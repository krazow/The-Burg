// Play-test simulation: bot players with different habits play whole games at every length.
// Fails on anything impossible (errors, NaN, stats outside 0–100, games that never end).
// Prints a balance report (and adds it to the GitHub Actions job summary).
// Run with: npm run test:sim     More games: SIM_SCALE=3 npm run test:sim
import fs from 'node:fs';
import { serve, launch, runner, seedScript } from './helpers.mjs';

const SCALE = Number(process.env.SIM_SCALE || 1);
let GAMES = { half: 6, two: 4, five: 2, life: 1 };              // per strategy, times SIM_SCALE
let STRATEGIES = ['planner', 'homebody', 'commuter', 'student', 'hustler', 'careless', 'idle', 'tripper', 'roadie'];
// for tuning: SIM_ONLY=commuter,hustler and/or SIM_LEN=five,two run a subset (CI always runs everything)
if (process.env.SIM_ONLY) STRATEGIES = STRATEGIES.filter(x => process.env.SIM_ONLY.split(',').includes(x));
if (process.env.SIM_LEN) GAMES = Object.fromEntries(Object.entries(GAMES).filter(([k]) => process.env.SIM_LEN.split(',').includes(k)));

const srv = await serve();
const browser = await launch();
const t = runner();
const results = [];

// every background and mode, played 2 years by a good and a careless player (and idle for the modes)
const VARIANTS = (process.env.SIM_ONLY || process.env.SIM_LEN) && !process.env.SIM_VARIANTS ? [] : [
  ...['farm', 'grad', 'transplant', 'parent'].flatMap(bg => ['planner', 'careless'].map(strat => ({ len: 'two', strat, opts: { bg }, label: bg }))),
  ...['relaxed', 'hard'].flatMap(mode => ['planner', 'careless', 'idle'].map(strat => ({ len: 'two', strat, opts: { mode }, label: mode })))];
const JOBS_LIST = [];
for (const len of Object.keys(GAMES)) for (const strat of STRATEGIES) for (let g = 0; g < Math.max(1, Math.round(GAMES[len] * SCALE)); g++) JOBS_LIST.push({ len, strat, g, opts: {}, label: 'normal' });
for (const v of VARIANTS) for (let g = 0; g < 4; g++) JOBS_LIST.push({ ...v, g });
for (const { len, strat, g, opts, label } of JOBS_LIST) {
  {
    {
      const seed = (len.length * 7919 + STRATEGIES.indexOf(strat) * 104729 + g * 1299709) >>> 0;   // backgrounds and modes reuse the normal games' dice, so they compare directly
      const ctx = await browser.newContext({ serviceWorkers: 'block' });
      await ctx.addInitScript(seedScript(seed));
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(srv.url, { waitUntil: 'load' });
      const r = await page.evaluate(([len, strat, opts]) => {
        // ---- the bot, running inside the game page ----
        render = () => {}; toast = () => {};   // skip redrawing the screen: just the rules
        newGame('Bot', len, 0, opts);
        S.k401rate = { planner: 2, homebody: 1, commuter: 1, student: 1 }[strat] || 0;
        const bad = [], events = {};
        const best = () => JOBS.filter(x => x.edu <= S.edu).sort((a, b) =>
          (b.pay - commuteCost(CITIES[b.city].miles) * (strat === 'homebody' ? 4 : 1)) - (a.pay - commuteCost(CITIES[a.city].miles) * (strat === 'homebody' ? 4 : 1)))[0];
        let ending = null, weeks = 0;
        while (!ending && weeks < 6000) {
          // job hunting
          if (strat === 'idle') { if (!S.jobId && !S.retired) apply('farmhand'); }
          else if (!S.retired && (strat !== 'careless' || Math.random() < 0.3)) {
            const want = strat === 'homebody' ? JOBS.filter(x => x.city === 'waitsburg' && x.edu <= S.edu).sort((a, b) => b.pay - a.pay)[0] : best();
            if (want && want.id !== S.jobId && (!job() || want.pay > job().pay * S.raise * 1.1)) apply(want.id);
          }
          if (LENGTHS[S.len].turns === Infinity && age() >= 65 && !S.retired) { S.retired = true; S.jobId = null; }
          // this week's focus
          const opts = Object.keys(FOCUS).filter(k => !(FOCUS[k].needsJob && (!job() || S.retired)) && !(FOCUS[k].study && S.edu >= 3));
          let f;
          if (strat === 'idle') f = 'rest';                          // never touches the focus
          else if (strat === 'careless') f = opts[Math.floor(Math.random() * opts.length)];
          else if (S.health < 45 || S.happy < 40) f = S.health < S.happy ? 'rest' : 'outdoors';
          else if (strat === 'student' && S.edu < 3) f = 'study';
          else if (strat === 'planner') f = S.edu < 2 && LENGTHS[S.len].turns > 26 ? 'study' : ['work', 'community', 'outdoors', 'work', 'community', 'rest'][weeks % 6];
          else if (strat === 'hustler') f = weeks % 3 ? 'hustle' : (job() ? 'work' : 'rest');
          else if (strat === 'commuter') f = weeks % 4 === 3 ? 'community' : (job() && !S.retired ? 'work' : 'rest');
          else if (strat === 'roadie') f = ['work', 'community', 'outdoors', 'rest'][weeks % 4];   // a long commute, but a balanced week
          else f = ['community', 'outdoors', 'rest', 'community'][weeks % 4];
          S.focus = opts.includes(f) ? f : 'rest';
          if (!['careless', 'idle'].includes(strat) && canCarpool()) S.carpool = true;   // sensible players share the drive
          if (!S.biz && strat === 'planner' && S.money > 40000) startBiz('wheat');            // businesses: a planner leases wheat ground,
          if (!S.biz && strat === 'homebody' && S.money > 8000) startBiz('shop');             // a homebody opens a woodshop
          // trips around the region: the planner shops and keeps up car care monthly; the tripper goes out every week
          if (strat === 'planner' && weeks % 4 === 0 && S.money > 300) {
            const ids = ['stock']; if (S.turn - S.svc > 22) ids.push('oil'); else if (S.turn - S.dentist > 45) ids.push('dentist'); else ids.push('movies');
            planTrip('wallawalla', ids);
          }
          if (strat === 'tripper') {
            const towns = ['dayton', 'wallawalla', 'pasco', 'kennewick', 'richland'], town = towns[weeks % towns.length];
            const fun = s => Object.values(s.fx || {}).reduce((a, v) => a + v, 0);
            planTrip(town, townStops(town).filter(s => !stopBlocked(s)).sort((a, b) => fun(b) - fun(a)).slice(0, TRIP_MAX).map(s => s.id));
          }
          // play the week
          const res = weekTick(false); weeks++;
          if (res.ev) {
            events[res.ev.title] = (events[res.ev.title] || 0) + 1;
            const ch = res.ev.choices().filter(c => !c.if || c.if());
            (strat === 'careless' ? ch[Math.floor(Math.random() * ch.length)] : ch[0]).go();
          }
          ending = res.ending;
          for (const k of ['happy', 'health', 'community']) if (!(S[k] >= 0 && S[k] <= 100)) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          for (const k of ['money', 'equity', 'carValue', 'ageMonths', 'date']) if (!Number.isFinite(S[k])) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          if (bad.length) break;
        }
        const sc = lifeScore();
        return { weeks, ending, bad, events, score: sc.score, parts: sc.parts, nw: Math.round(sc.real), age: age(), edu: S.edu, kids: S.kids.length,
                 debt: /debt/.test(ending || ''), endedOk: !!ending };
      }, [len, strat, opts]);
      r.len = len; r.strat = strat; r.errors = errors; r.label = label;
      results.push(r);
      await ctx.close();
    }
  }
}

// ---- correctness checks (these fail the run) ----
await t.check('no page errors in any simulated game', async () => {
  const e = results.filter(r => r.errors.length);
  if (e.length) throw new Error(`${e.length} games: ${e[0].errors[0]}`);
});
await t.check('stats stay in range and numbers stay finite', async () => {
  const e = results.filter(r => r.bad.length);
  if (e.length) throw new Error(`${e.length} games, e.g. ${e[0].len}/${e[0].strat}: ${e[0].bad[0]}`);
});
await t.check('every game ends, with the right number of weeks for its length', async () => {
  for (const r of results) {
    if (!r.endedOk) throw new Error(`${r.len}/${r.strat} never ended after ${r.weeks} weeks`);
    const turns = { half: 26, two: 104, five: 260 }[r.len];
    if (turns && !r.debt && r.weeks !== turns) throw new Error(`${r.len}/${r.strat} ended after ${r.weeks} weeks, expected ${turns}`);
    if (r.len === 'life' && !r.debt && (r.age < 60 || r.age > 102)) throw new Error(`a Lifetime game ended at age ${r.age}`);
  }
});
await t.check('scores are whole numbers from 0 to 100', async () => {
  const e = results.find(r => !(Number.isInteger(r.score) && r.score >= 0 && r.score <= 100));
  if (e) throw new Error(`${e.len}/${e.strat} scored ${e.score}`);
});

// ---- balance report (information only; see issues #6 and #7 for targets) ----
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const money = n => (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString();
let md = `## The Burg balance report\n\n${results.length} simulated games (SIM_SCALE=${SCALE}).\n\n| Length | Strategy | Games | Median score | Score range | Median net worth (2027 $) | Debt endings |\n|---|---|---|---|---|---|---|\n`;
for (const len of Object.keys(GAMES)) for (const strat of STRATEGIES) {
  const rs = results.filter(r => r.len === len && r.strat === strat && r.label === 'normal'); if (!rs.length) continue;
  const sc = rs.map(r => r.score);
  md += `| ${len} | ${strat} | ${rs.length} | ${med(sc)} | ${Math.min(...sc)}–${Math.max(...sc)} | ${money(med(rs.map(r => r.nw)))} | ${rs.filter(r => r.debt).length} |\n`;
}
if (VARIANTS.length) {
  md += `\n**Backgrounds and modes** (2-year games):\n\n| Start or mode | Strategy | Games | Median score | Median net worth | Debt endings |\n|---|---|---|---|---|---|\n`;
  for (const lab of [...new Set(VARIANTS.map(v => v.label))]) for (const strat of ['planner', 'careless', 'idle']) {
    const rs = results.filter(r => r.label === lab && r.strat === strat); if (!rs.length) continue;
    md += `| ${lab} | ${strat} | ${rs.length} | ${med(rs.map(r => r.score))} | ${money(med(rs.map(r => r.nw)))} | ${rs.filter(r => r.debt).length} |\n`;
  }
}
const ev = {}; let weeks = 0;
for (const r of results) { weeks += r.weeks; for (const [k, v] of Object.entries(r.events)) ev[k] = (ev[k] || 0) + v; }
md += `\n**Events per 100 weeks played** (${weeks.toLocaleString()} weeks in total):\n\n` +
  Object.entries(ev).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${(v / weeks * 100).toFixed(1)}`).join('\n') + '\n';
const careless = med(results.filter(r => r.label === 'normal' && r.strat === 'careless').map(r => r.score));
const idle = med(results.filter(r => r.label === 'normal' && r.strat === 'idle').map(r => r.score));
const planner = med(results.filter(r => r.label === 'normal' && r.strat === 'planner' && (r.len === 'five' || r.len === 'life')).map(r => r.score));
md += `\nIdle median **${idle}** (target 50 or below) · Careless median **${careless}** (target 60 or below) · Planner median in 5-year and Lifetime games **${planner}** (target 70 or above).\n`;
if (idle > 50) md += `\n> ⚠️ Doing nothing scores too high (issue #20).\n`;
if (careless > 60) md += `\n> ⚠️ Careless play scores too high (issue #7).\n`;
if (planner < 70) md += `\n> ⚠️ Good play scores too low.\n`;
console.log(md);
if (process.env.SIM_DEBUG) for (const len of Object.keys(GAMES)) for (const st of STRATEGIES) { const rs = results.filter(r => r.len===len && r.strat===st); const avg = k => Math.round(rs.reduce((a,r)=>a+r.parts[k],0)/rs.length); console.log(len.padEnd(5), st.padEnd(9), 'happy', avg('happy'), 'health', avg('health'), 'comm', avg('community'), 'wealth', avg('wealth'), 'kids', rs.map(r=>r.kids).join(',')); }
fs.mkdirSync('test-results', { recursive: true });
fs.writeFileSync('test-results/balance-report.md', md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} simulation check(s) failed`); process.exit(1); }
console.log('All simulation checks passed');
