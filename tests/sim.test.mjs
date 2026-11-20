// Play-test simulation: bot players with different habits play whole games at every length.
// Fails on anything impossible (errors, NaN, stats outside 0–100, games that never end).
// Prints a balance report (and adds it to the GitHub Actions job summary). In the full run it also fails when
// careless play or doing nothing scores too high (T1/B7), so a change can't quietly break the balance.
// Run with: npm run test:sim     More games: SIM_SCALE=3 npm run test:sim
// On GitHub pull requests the simulation runs at half scale (T2); pushes to main and releases run it in full.
import fs from 'node:fs';
import { serve, launch, runner, seedScript } from './helpers.mjs';

const SCALE = Number(process.env.SIM_SCALE || (process.env.GITHUB_EVENT_NAME === 'pull_request' ? 0.5 : 1));
const FILTERED = !!(process.env.SIM_ONLY || process.env.SIM_LEN || process.env.SIM_VARIANTS || process.env.SIM_AIMS);   // a tuning run: no balance ceilings
const CEILING = { careless: 62, idle: 52 };
const AIM_SPREAD = 5;                                            // i20-b23: fitted aim medians must sit within 5 points                     // the targets (60 and 50) plus a small margin for dice
let GAMES = { half: 6, two: 4, five: 2, life: 1 };              // per strategy, times SIM_SCALE
let STRATEGIES = ['planner', 'homebody', 'commuter', 'student', 'hustler', 'careless', 'idle', 'tripper', 'roadie', 'rotation'];
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
  ...['relaxed', 'hard'].flatMap(mode => ['planner', 'careless', 'idle'].map(strat => ({ len: 'two', strat, opts: { mode }, label: mode }))),
  // i31-b20/b33: the 'Everything open' start setting (normal games play 'Open as I go'); same dice, so scores must match
  ...['planner', 'careless', 'idle'].map(strat => ({ len: 'two', strat, opts: { unlock: 'all' }, label: 'allopen' })),
  // i75-b21: a broke start: -$5,000 and the farm hand job, played sensibly (the struggler) and idle, 8 games each
  ...['struggler', 'idle'].map(strat => ({ len: 'two', strat, opts: { debt: 5000 }, label: 'broke', n: 8 }))];
// i20-b23: each life aim played well by a planner fitted to it (5-year games), and played idle (2-year games)
const AIM_KEYS = ['all', 'content', 'roots', 'adventure', 'legacy'];
const AIM_RUNS = process.env.SIM_ONLY && !process.env.SIM_AIMS ? [] : [
  ...AIM_KEYS.map(aim => ({ len: 'five', strat: 'planner', opts: { aim }, label: `aim-${aim}`, n: 4 })),
  ...AIM_KEYS.map(aim => ({ len: 'two', strat: 'idle', opts: { aim }, label: `aim-${aim}`, n: 3 }))];
if (process.env.SIM_AIMS) { STRATEGIES.length = 0; STRATEGIES.push('planner', 'idle'); for (const k of Object.keys(GAMES)) delete GAMES[k]; VARIANTS.length = 0; }
const JOBS_LIST = [];
for (const len of Object.keys(GAMES)) for (const strat of STRATEGIES) for (let g = 0; g < Math.max(1, Math.round(GAMES[len] * SCALE)); g++) JOBS_LIST.push({ len, strat, g, opts: {}, label: 'normal' });
for (const v of [...VARIANTS, ...AIM_RUNS]) for (let g = 0; g < (v.n || 4); g++) JOBS_LIST.push({ ...v, g });
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
        const debt = opts.debt; delete opts.debt; const aimK = opts.aim || 'all', aimRun = !!opts.aim;
        newGame('Bot', len, 0, opts);
        if (debt) { S.money = -debt; apply('farmhand'); if (!S.jobId) startJob('farmhand'); }   // i75-b21: a fresh start, broke
        S.k401rate = { planner: 2, homebody: 1, commuter: 1, student: 1, rotation: 1 }[strat] || 0;
        const bad = [], events = {};
        const best = () => JOBS.filter(x => x.edu <= S.edu).sort((a, b) =>
          (b.pay - commuteCost(CITIES[b.city].miles) * (strat === 'homebody' ? 4 : 1)) - (a.pay - commuteCost(CITIES[a.city].miles) * (strat === 'homebody' ? 4 : 1)))[0];
        let ending = null, weeks = 0, nw65 = null, climbed = false;
        // i75-b30: where the money came from, in 2027 dollars
        const src = { pay: 0, overtime: 0, hustle: 0, business: 0, retirement: 0, k401: 0, market: 0, equity: 0 }, bizIc = Object.values(BIZ).map(b => b.ic);
        while (!ending && weeks < 6000) {
          // job hunting
          if (strat === 'idle') { if (!S.jobId && !S.retired) apply('farmhand'); }
          else if (strat === 'struggler') { if (S.edu >= 1 && !S.retired) { const want = best(); if (want && want.id !== S.jobId && (!job() || want.pay > job().pay * S.raise * 1.1)) apply(want.id); } }
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
          else if (strat === 'rotation') {                            // i2-a12: sets a 🗓 focus plan once and lets End Week follow it
            if (!S.plan.length) { S.plan = ['work', 'community', 'outdoors', 'rest']; S.planI = 0; S.focus = planFocus(); }
            f = S.focus;
          }
          else if (S.health < 45 || S.happy < 40) f = S.health < S.happy ? 'rest' : 'outdoors';
          else if (strat === 'struggler') f = S.edu < 1 ? 'study' : ['work', 'community', 'rest', 'work'][weeks % 4];   // classes until a certificate, then steady work
          else if (strat === 'student' && S.edu < 3) f = 'study';
          else if (strat === 'planner' && S.edu < 2 && LENGTHS[S.len].turns > 26) f = 'study';
          else if (strat === 'planner' && aimRun) f = ['work', 'community', 'outdoors', 'work', 'outdoors', 'rest'][weeks % 6];   // i20-b23: every aim bot shares one balanced week; only the aim's extras differ
          else if (strat === 'planner') f = ['work', 'community', 'outdoors', 'work', 'community', 'rest'][weeks % 6];
          else if (strat === 'hustler') f = weeks % 3 ? 'hustle' : (job() ? 'work' : 'rest');
          else if (strat === 'commuter') f = weeks % 4 === 3 ? 'community' : (job() && !S.retired ? 'work' : 'rest');
          else if (strat === 'roadie') f = ['work', 'community', 'outdoors', 'rest'][weeks % 4];   // a long commute, but a balanced week
          else f = ['community', 'outdoors', 'rest', 'community'][weeks % 4];
          S.focus = opts.includes(f) ? f : 'rest';
          if (!['careless', 'idle'].includes(strat) && canCarpool()) { S.carpool = true; S.carpoolJob = S.jobId; }   // sensible players share the drive
          if (strat === 'planner' && aimK === 'roots' && !HOMES[S.home].own && S.money > homeDown('fixer') + cost(4000)) { moveHome('fixer'); const y = document.querySelector('#y'); if (y) y.click(); }
          if (strat === 'planner' && aimK === 'adventure' && weeks % 5 === 2 && S.money > 800) {   // a trip somewhere every 5 weeks, new places in town
            const towns = ['dayton', 'wallawalla', 'pasco', 'kennewick', 'richland'], town = towns[Math.floor(weeks / 5) % towns.length];
            planTrip(town, townStops(town).filter(s => !stopBlocked(s)).slice(0, 1).map(s => s.id));
          }
          if (strat === 'planner' && (aimK === 'adventure' || aimK === 'roots') && S.money > 1000) {
            const seen = (S.out && S.out.last) || {}, pl = PLACES.filter(p => aimK === 'roots' || !(p.id in seen));
            const p = pl[weeks % Math.max(1, pl.length)]; if (p) visit(p.id, p.acts[0].id);
          }
          if (!S.biz && strat === 'planner' && S.money > 40000) startBiz('wheat');            // businesses: a planner leases wheat ground (and renews it),
          if (strat === 'planner' && leaseDue()) renewLease();
          if (strat === 'planner' && S.biz && S.biz.type === 'wheat') S.biz.ins = true;          // i75-a31: the planner gets ready for weather (crop insurance; prep choices come first in weather cards)
          if (!S.biz && strat === 'homebody' && S.money > cost(12000)) startBiz('shop');       // a homebody opens a woodshop ($6,000, i75-b15)
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
          // Out and about: the planner gets coffee most weeks and a night out now and then
          if (strat === 'planner' && S.money > 1000) { visit('bean', 'coffee'); if (weeks % 6 === 2) visit('gulch', 'game'); }
          // play the week
          const k0 = S.k401 || 0, e0 = S.equity || 0, s0 = S.stocks || 0;
          const res = weekTick(false); weeks++;
          { const c = S.col || 1; let contrib = 0, draw = 0;
            for (const [l, v] of S.last.lines) {
              if (/^Paycheck/.test(l)) { const ot = /overtime/.test(l) ? v * (1 - 1 / FOCUS.work.payMult) : 0; src.pay += (v - ot) / c; src.overtime += ot / c; }
              else if (/^Side hustle/.test(l)) src.hustle += v / c;
              else if (bizIc.some(ic => l.startsWith(ic))) src.business += v / c;
              else if (l === 'Social Security' || l === 'Pension') src.retirement += v / c;
              else if (l === '401(k) contribution') contrib -= v;
              else if (l === '401(k) withdrawal') draw += v;
            }
            src.k401 += ((S.k401 || 0) - k0 - contrib + draw) / c; src.market += ((S.stocks || 0) - s0) / c; src.equity += ((S.equity || 0) - e0) / c; }
          if (nw65 == null && LENGTHS[S.len].turns === Infinity && age() >= 65) nw65 = Math.round(netWorth() / (S.col || 1));   // i75-b31
          if (S.money >= 0) climbed = true;
          if (res.ev) {
            events[res.ev.title] = (events[res.ev.title] || 0) + 1;
            const ch = res.ev.choices().filter(c => !c.if || c.if());
            const m0 = S.money; (strat === 'careless' ? ch[Math.floor(Math.random() * ch.length)] : ch[0]).go(); wxTrack(res.ev, S.money - m0);   // i75-a30: the weather bill
          }
          ending = res.ending;
          for (const k of ['happy', 'health', 'community']) if (!(S[k] >= 0 && S[k] <= 100)) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          for (const k of ['money', 'equity', 'carValue', 'ageMonths', 'date']) if (!Number.isFinite(S[k])) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          if (bad.length) break;
        }
        const sc = lifeScore();
        return { weeks, ending, bad, events, score: sc.score, parts: sc.parts, cardAvg: sc.cardAvg, snap: sc.snap, aimPart: Math.round(sc.aim), drag: sc.drag, good: S.goodWeeks, nw: Math.round(sc.real), age: age(), edu: S.edu, kids: S.kids.length,
                 debt: /debt/.test(ending || ''), endedOk: !!ending, cash: Math.round(S.money), bk: S.bk != null, climbed, nw65,
                 src: Object.fromEntries(Object.entries(src).map(([k, v]) => [k, Math.round(v)])),
                 wxCost: Math.round((S.wxLife || {}).cost || 0), wxSaved: Math.round((S.wxLife || {}).saved || 0), yrs: Math.max(0.5, S.turn / 52),
                 opened: Object.fromEntries(Object.entries(S.opened || {}).map(([k, v]) => [k, v.how])) };
      }, [len, strat, opts]);
      r.len = len; r.strat = strat; r.errors = errors; r.label = label; r.g = g;
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
// i31-b33: which systems opened during normal ('Open as I go') games, and how (moment, deadline, start or used)
{ const n = {}, how = {}; const rs = results.filter(r => r.label === 'normal');
  for (const r of rs) for (const [k, h] of Object.entries(r.opened || {})) { n[k] = (n[k] || 0) + 1; how[k] = how[k] || {}; how[k][h] = (how[k][h] || 0) + 1; }
  md += `\n**Systems opened** (normal games, of ${rs.length}):\n\n` + Object.entries(n).map(([k, v]) => `- ${k}: ${v} (${Object.entries(how[k]).map(([h, c]) => `${h} ${c}`).join(', ')})`).join('\n') + '\n'; }
const ev = {}; let weeks = 0;
for (const r of results) { weeks += r.weeks; for (const [k, v] of Object.entries(r.events)) ev[k] = (ev[k] || 0) + v; }
md += `\n**Events per 100 weeks played** (${weeks.toLocaleString()} weeks in total):\n\n` +
  Object.entries(ev).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${(v / weeks * 100).toFixed(1)}`).join('\n') + '\n';
// i75-a31: what the weather cost each kind of player a year, and what getting ready saved (information only)
md += `\n**Weather per year played** (median, 2027 $):\n\n| Strategy | Weather cost | Saved by getting ready |\n|---|---|---|\n` +
  STRATEGIES.map(st => { const rs = results.filter(r => r.label === 'normal' && r.strat === st); return rs.length ? `| ${st} | ${money(med(rs.map(r => Math.round(r.wxCost / r.yrs))))} | ${money(med(rs.map(r => Math.round(r.wxSaved / r.yrs))))} |` : ''; }).filter(Boolean).join('\n') + '\n';
// i75-b30: where each bot's money came from (normal games, all lengths), and a warning when one source besides pay
// is over 40% of the median planner's final net worth
const SRC = { pay: 'Pay', overtime: 'Overtime', hustle: 'Side hustle', business: 'Business', retirement: 'Social Security + pension', k401: '401(k) growth + match', market: 'Index funds', equity: 'Home equity' };
md += `\n**Where the money came from** (share of everything earned or gained, 2027 dollars, normal games):\n\n| Strategy | ${Object.values(SRC).join(' | ')} |\n|---|${Object.keys(SRC).map(() => '---|').join('')}\n`;
for (const strat of STRATEGIES) {
  const rs = results.filter(r => r.label === 'normal' && r.strat === strat); if (!rs.length) continue;
  const tot = Object.fromEntries(Object.keys(SRC).map(k => [k, rs.reduce((a, r) => a + Math.max(0, r.src[k]), 0)])), all = Object.values(tot).reduce((a, v) => a + v, 0) || 1;
  md += `| ${strat} | ${Object.keys(SRC).map(k => `${Math.round(tot[k] / all * 100)}%`).join(' | ')} |\n`;
}
const plannerNW = med(results.filter(r => r.label === 'normal' && r.strat === 'planner').map(r => r.nw));
for (const k of Object.keys(SRC).filter(k => k !== 'pay')) {
  const v = med(results.filter(r => r.label === 'normal' && r.strat === 'planner').map(r => r.src[k]));
  if (plannerNW > 0 && v > plannerNW * 0.4) md += `\n> ⚠️ ${SRC[k]} brings the planner ${money(v)}, over 40% of the median planner's final net worth (${money(plannerNW)}).\n`;
}
// i75-b31: Lifetime games: real net worth at 65 and at the end; it shouldn't grow by more than half after retirement
const lifeRs = results.filter(r => r.label === 'normal' && r.len === 'life' && r.nw65 != null);
if (lifeRs.length) {
  md += `\n**Lifetime net worth at 65 and at the end** (2027 dollars):\n\n| Strategy | At 65 | At the end | Change |\n|---|---|---|---|\n`;
  for (const strat of STRATEGIES) {
    const rs = lifeRs.filter(r => r.strat === strat); if (!rs.length) continue;
    const a = med(rs.map(r => r.nw65)), b = med(rs.map(r => r.nw));
    md += `| ${strat} | ${money(a)} | ${money(b)} | ${a > 0 ? `${b >= a ? '+' : ''}${Math.round((b / a - 1) * 100)}%` : '—'} |\n`;
    if (a > 0 && b > a * 1.5) md += `\n> ⚠️ The ${strat} bot's net worth grows ${Math.round((b / a - 1) * 100)}% after 65: retirees shouldn't get rich just by living long.\n`;
  }
}
// i20-b23: no aim beats another
let aimMeds = null;
if (AIM_RUNS.length) {
  const aimRs = (k, st) => results.filter(r => r.label === `aim-${k}` && r.strat === st);
  aimMeds = Object.fromEntries(AIM_KEYS.map(k => [k, { fit: med(aimRs(k, 'planner').map(r => r.score)), idle: med(aimRs(k, 'idle').map(r => r.score)) }]));
  md += `\n**Life aims** (i20-b23): a planner fitted to each aim (5-year games) and idle play (2-year games):\n\n| Aim | Fitted median | Idle median |\n|---|---|---|\n` +
    AIM_KEYS.map(k => `| ${k} | ${aimMeds[k].fit} | ${aimMeds[k].idle} |`).join('\n') + '\n';
}
const careless = med(results.filter(r => r.label === 'normal' && r.strat === 'careless').map(r => r.score));
const idle = med(results.filter(r => r.label === 'normal' && r.strat === 'idle').map(r => r.score));
const planner = med(results.filter(r => r.label === 'normal' && r.strat === 'planner' && (r.len === 'five' || r.len === 'life')).map(r => r.score));
md += `\nIdle median **${idle}** (target 50 or below) · Careless median **${careless}** (target 60 or below) · Planner median in 5-year and Lifetime games **${planner}** (target 70 or above).\n`;
if (idle > 50) md += `\n> ⚠️ Doing nothing scores too high (issue #20).\n`;
if (careless > 60) md += `\n> ⚠️ Careless play scores too high (issue #7).\n`;
if (planner < 70) md += `\n> ⚠️ Good play scores too low.\n`;
console.log(md);
// ---- balance ceilings (T1/B7): these fail the full run, not a filtered tuning run ----
if (!FILTERED) {
  await t.check(`careless play scores ${CEILING.careless} or below (median ${careless})`, async () => {
    if (careless > CEILING.careless) throw new Error(`careless median ${careless} is above ${CEILING.careless}`);
  });
  await t.check(`doing nothing scores ${CEILING.idle} or below (median ${idle})`, async () => {
    if (idle > CEILING.idle) throw new Error(`idle median ${idle} is above ${CEILING.idle}`);
  });
}
if (aimMeds) {
  const fit = AIM_KEYS.map(k => aimMeds[k].fit), spread = Math.max(...fit) - Math.min(...fit), idleTop = Math.max(...AIM_KEYS.map(k => aimMeds[k].idle));
  await t.check(`no life aim beats another: fitted medians within ${AIM_SPREAD} points (${AIM_KEYS.map(k => `${k} ${aimMeds[k].fit}`).join(', ')})`, async () => {
    if (spread > AIM_SPREAD) throw new Error(`aim medians spread ${spread} points: ${JSON.stringify(aimMeds)}`);
  });
  await t.check(`idle play scores 50 or below with every aim (highest ${idleTop})`, async () => {
    if (idleTop > 50) throw new Error(`idle play with an aim scored ${idleTop}: ${JSON.stringify(aimMeds)}`);
  });
}
// i75-b24: every start must be winnable: a planner may end in debt in at most 1 of 4 games, with a median net worth of $0 or more
// i75-b21: from -$5,000 and the farm hand job, sensible play climbs back above $0 without bankruptcy in at least 70% of games
if (VARIANTS.length) {
  await t.check('every background is winnable: its planner ends in debt in at most 1 of 4 games, median net worth $0 or more', async () => {
    const bad = [];
    for (const bg of ['farm', 'grad', 'transplant', 'parent']) {
      const rs = results.filter(r => r.label === bg && r.strat === 'planner'); if (!rs.length) continue;
      const inDebt = rs.filter(r => r.debt || r.cash < 0).length, nw = med(rs.map(r => r.nw));
      if (inDebt > rs.length / 4 || nw < 0) bad.push(`${bg}: ${inDebt} of ${rs.length} in debt, median net worth ${money(nw)}`);
    }
    if (bad.length) throw new Error(bad.join('; '));
  });
  // i31-b20/b33: opening everything at the start is UI only: the same dice score within noise of 'Open as I go'
  await t.check('Everything open scores the same as Open as I go (within 3 points per strategy)', async () => {
    const bad = [];
    for (const strat of ['planner', 'careless', 'idle']) {
      const b = results.filter(r => r.label === 'normal' && r.len === 'two' && r.strat === strat), a = results.filter(r => r.label === 'allopen' && r.strat === strat && b.some(x => x.g === r.g));   // the same dice
      if (!a.length || !b.length) continue;
      const d = med(a.map(r => r.score)) - med(b.map(r => r.score));
      if (Math.abs(d) > 3) bad.push(`${strat}: ${med(a.map(r => r.score))} vs ${med(b.map(r => r.score))}`);
    }
    if (bad.length) throw new Error(bad.join('; '));
  });
  const broke = s => results.filter(r => r.label === 'broke' && r.strat === s), out = rs => rs.filter(r => r.climbed && !r.bk && !r.debt).length;
  const st = broke('struggler'), id = broke('idle');
  const line = `\n**A broke start** (-$5,000, farm hand, 2 years): sensible play climbed out in ${out(st)} of ${st.length} games (median net worth ${money(med(st.map(r => r.nw)))}, score ${med(st.map(r => r.score))}); idle play in ${out(id)} of ${id.length} (${money(med(id.map(r => r.nw)))}, score ${med(id.map(r => r.score))}).\n`;
  md += line; console.log(line);
  await t.check(`a broke start can climb out: sensible play gets back above $0 in at least 70% of games (${out(st)} of ${st.length})`, async () => {
    if (out(st) < st.length * 0.7) throw new Error(`only ${out(st)} of ${st.length} struggler games got back above $0 without bankruptcy`);
    if (med(st.map(r => r.score)) <= med(id.map(r => r.score))) throw new Error('sensible play from a broke start should score better than idle play');
  });
}
if (process.env.SIM_DEBUG) for (const lab of [...new Set(results.map(r => r.label))].filter(l => l.startsWith('aim-'))) for (const st of ['planner', 'idle']) { const rs = results.filter(r => r.label === lab && r.strat === st); if (rs.length) console.log(lab.padEnd(14), st.padEnd(8), 'scores', rs.map(r => r.score).join(','), 'aim part', rs.map(r => r.aimPart).join(','), 'parts', JSON.stringify(rs[0].parts), 'cards', rs[0].cardAvg, 'end', rs[0].snap, 'nw', rs.map(r => r.nw).join(',')); }
if (process.env.SIM_DEBUG) for (const len of Object.keys(GAMES)) for (const st of STRATEGIES) { const rs = results.filter(r => r.len===len && r.strat===st); const avg = k => Math.round(rs.reduce((a,r)=>a+(k in r.parts ? r.parts[k] : r[k] || 0),0)/rs.length); console.log(len.padEnd(5), st.padEnd(9), 'happy', avg('happy'), 'health', avg('health'), 'comm', avg('community'), 'wealth', avg('wealth'), 'cards', avg('cardAvg'), 'end', avg('snap'), 'drag', avg('drag'), 'good', avg('good'), 'kids', rs.map(r=>r.kids).join(',')); }
fs.mkdirSync('test-results', { recursive: true });
fs.writeFileSync('test-results/balance-report.md', md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} simulation check(s) failed`); process.exit(1); }
console.log('All simulation checks passed');
