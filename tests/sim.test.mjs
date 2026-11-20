// Play-test simulation: bot players with different habits play whole games at every length.
// Fails on anything impossible (errors, NaN, stats outside 0–100, games that never end).
// Prints a balance report (and adds it to the GitHub Actions job summary). In the full run it also fails when
// careless play or doing nothing scores too high (T1/B7), so a change can't quietly break the balance.
// Run with: npm run test:sim     More games: SIM_SCALE=3 npm run test:sim
// On GitHub pull requests the simulation runs at half scale (T2); pushes to main and releases run it in full.
import fs from 'node:fs';
import { serve, launch, runner, seedScript } from './helpers.mjs';

const SCALE = Number(process.env.SIM_SCALE || (process.env.GITHUB_EVENT_NAME === 'pull_request' ? 0.5 : 1));
const FILTERED = !!(process.env.SIM_ONLY || process.env.SIM_LEN || process.env.SIM_VARIANTS);   // a tuning run: no balance ceilings
const CEILING = { careless: 62, idle: 52 };                     // the targets (60 and 50) plus a small margin for dice
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
  // i75-b21: a broke start: -$5,000 and the farm hand job, played sensibly (the struggler) and idle, 8 games each
  ...['struggler', 'idle'].map(strat => ({ len: 'two', strat, opts: { debt: 5000 }, label: 'broke', n: 8 }))];
const JOBS_LIST = [];
for (const len of Object.keys(GAMES)) for (const strat of STRATEGIES) for (let g = 0; g < Math.max(1, Math.round(GAMES[len] * SCALE)); g++) JOBS_LIST.push({ len, strat, g, opts: {}, label: 'normal' });
for (const v of VARIANTS) for (let g = 0; g < (v.n || 4); g++) JOBS_LIST.push({ ...v, g });
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
        const debt = opts.debt; delete opts.debt;
        newGame('Bot', len, 0, opts);
        if (debt) { S.money = -debt; apply('farmhand'); if (!S.jobId) startJob('farmhand'); }   // i75-b21: a fresh start, broke
        S.k401rate = { planner: 2, homebody: 1, commuter: 1, student: 1, rotation: 1 }[strat] || 0;
        const bad = [], events = {}, choiceFx = {};
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
          else if (strat === 'planner') f = S.edu < 2 && LENGTHS[S.len].turns > 26 ? 'study' : ['work', 'community', 'outdoors', 'work', 'community', 'rest'][weeks % 6];
          else if (strat === 'hustler') f = weeks % 3 ? 'hustle' : (job() ? 'work' : 'rest');
          else if (strat === 'commuter') f = weeks % 4 === 3 ? 'community' : (job() && !S.retired ? 'work' : 'rest');
          else if (strat === 'roadie') f = ['work', 'community', 'outdoors', 'rest'][weeks % 4];   // a long commute, but a balanced week
          else f = ['community', 'outdoors', 'rest', 'community'][weeks % 4];
          S.focus = opts.includes(f) ? f : 'rest';
          if (!['careless', 'idle'].includes(strat) && canCarpool()) { S.carpool = true; S.carpoolJob = S.jobId; }   // sensible players share the drive
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
            // i66-b27: replay each choice from a copy of this week (same side dice for every choice, so the game's own
            // dice are untouched) and keep what each did to money, happiness, health and community
            { const ch0 = res.ev.choices().filter(c => !c.if || c.if());
              if (ch0.length > 1) {
                const S0 = S, snap = JSON.stringify(S), rnd = Math.random, fx = [];
                for (let i = 0; i < ch0.length; i++) {
                  let a = (weeks * 2654435761 + 97) >>> 0;
                  Math.random = () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
                  try { S = JSON.parse(snap); const c = res.ev.choices().filter(c => !c.if || c.if())[i]; c.go();
                    fx.push({ label: c.label.replace(/\(.*?\)/g, '').replace(/[-+$\d,.%]/g, '').replace(/\s+/g, ' ').trim(),
                      d: [S.money - S0.money, S.happy - S0.happy, S.health - S0.health, S.community - S0.community] }); }
                  catch (e) { fx.push(null); }
                  finally { Math.random = rnd; }
                }
                S = S0; save();
                if (fx.every(Boolean)) (choiceFx[res.ev.title] = choiceFx[res.ev.title] || []).push(fx);
              } }
            const ch = res.ev.choices().filter(c => !c.if || c.if());
            const m0 = S.money; (strat === 'careless' ? ch[Math.floor(Math.random() * ch.length)] : ch[0]).go(); wxTrack(res.ev, S.money - m0);   // i75-a30: the weather bill
          }
          ending = res.ending;
          for (const k of ['happy', 'health', 'community']) if (!(S[k] >= 0 && S[k] <= 100)) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          for (const k of ['money', 'equity', 'carValue', 'ageMonths', 'date']) if (!Number.isFinite(S[k])) bad.push(`${k}=${S[k]} in week ${S.turn}`);
          if (bad.length) break;
        }
        const sc = lifeScore();
        return { weeks, ending, bad, events, score: sc.score, parts: sc.parts, nw: Math.round(sc.real), age: age(), edu: S.edu, kids: S.kids.length,
                 debt: /debt/.test(ending || ''), endedOk: !!ending, cash: Math.round(S.money), bk: S.bk != null, climbed, nw65,
                 src: Object.fromEntries(Object.entries(src).map(([k, v]) => [k, Math.round(v)])),
                 choiceFx, wxCost: Math.round((S.wxLife || {}).cost || 0), wxSaved: Math.round((S.wxLife || {}).saved || 0), yrs: Math.max(0.5, S.turn / 52) };
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
  const broke = s => results.filter(r => r.label === 'broke' && r.strat === s), out = rs => rs.filter(r => r.climbed && !r.bk && !r.debt).length;
  const st = broke('struggler'), id = broke('idle');
  const line = `\n**A broke start** (-$5,000, farm hand, 2 years): sensible play climbed out in ${out(st)} of ${st.length} games (median net worth ${money(med(st.map(r => r.nw)))}, score ${med(st.map(r => r.score))}); idle play in ${out(id)} of ${id.length} (${money(med(id.map(r => r.nw)))}, score ${med(id.map(r => r.score))}).\n`;
  md += line; console.log(line);
  await t.check(`a broke start can climb out: sensible play gets back above $0 in at least 70% of games (${out(st)} of ${st.length})`, async () => {
    if (out(st) < st.length * 0.7) throw new Error(`only ${out(st)} of ${st.length} struggler games got back above $0 without bankruptcy`);
    if (med(st.map(r => r.score)) <= med(id.map(r => r.score))) throw new Error('sensible play from a broke start should score better than idle play');
  });
}
if (process.env.SIM_DEBUG) for (const len of Object.keys(GAMES)) for (const st of STRATEGIES) { const rs = results.filter(r => r.len===len && r.strat===st); const avg = k => Math.round(rs.reduce((a,r)=>a+r.parts[k],0)/rs.length); console.log(len.padEnd(5), st.padEnd(9), 'happy', avg('happy'), 'health', avg('health'), 'comm', avg('community'), 'wealth', avg('wealth'), 'kids', rs.map(r=>r.kids).join(',')); }
// ---- i66-b27: strictly better choices (information only) ----
// Every event with 2+ choices was replayed choice by choice from a copy of the week. A choice that beats another on
// money, happiness, health and community (at least as good on all four, better on one) in 95% of its fires
// (5 fires or more) makes the other choice pointless, unless it sets up something later (a story, a pet, a habit).
{
  const fires = {};
  for (const r of results) for (const [title, list] of Object.entries(r.choiceFx || {})) for (const fx of list) {
    const key = title + ' :: ' + fx.map(c => c.label).join(' | '); (fires[key] = fires[key] || { title, labels: fx.map(c => c.label), runs: [] }).runs.push(fx.map(c => c.d));
  }
  const TOL = [1, 0.05, 0.05, 0.05], beats = (a, b) => a.every((v, k) => v >= b[k] - TOL[k]) && a.some((v, k) => v > b[k] + TOL[k]);
  const flagged = [];
  for (const f of Object.values(fires)) {
    if (f.runs.length < 5) continue;
    for (let i = 0; i < f.labels.length; i++) for (let j = 0; j < f.labels.length; j++) {
      if (i === j) continue;
      const n = f.runs.filter(run => beats(run[i], run[j])).length;
      if (n >= f.runs.length * 0.95) flagged.push(`${f.title}: "${f.labels[i]}" beats "${f.labels[j]}" in ${n} of ${f.runs.length} fires`);
    }
  }
  const checked = Object.values(fires).filter(f => f.runs.length >= 5).length;
  const sb = `\n**Strictly better choices** (i66-b27, information only): ${checked} events with 5+ fires checked, ${flagged.length} choice pairs flagged.\n` +
    (flagged.length ? flagged.map(x => `- ${x}`).join('\n') + '\n' : '');
  md += sb; console.log(sb);
  await t.check('the strictly-better choice check ran on the simulated events', async () => {
    if (!checked && !FILTERED) throw new Error('no event with 2+ choices fired 5 times: the replay found nothing to compare');
  });
}

// ---- i56-b17: every job gets worked (reported apart from the balance medians) ----
// The rotator takes each job in turn (with the school, certificates and program it needs, starting in its season)
// and works it for 26 weeks: pay arrives, the commute is paid, work events can happen and the Jobs tab reads right.
if (!process.env.SIM_ONLY || process.env.SIM_ONLY.split(',').includes('rotator')) {
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  await ctx.addInitScript(seedScript(171717));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(srv.url, { waitUntil: 'load' });
  const rows = await page.evaluate(() => JOBS.map(x => {
    newGame('Rotator', 'two', 0); S.noEvents = true;
    S.edu = 3; S.certs = Object.fromEntries(Object.keys(CERTS).map(k => [k, 1])); if (x.needMajor) S.major = x.needMajor;
    if (x.season) S.date = new Date(2027, x.season[0], 4).getTime();
    S.money = 20000; startJob(x.id);
    const out = { id: x.id, title: x.title, payWeeks: 0, inSeason: 0, pay: [], gas: 0, workEv: new Set(), problems: [] };
    const expect = payNow(x) * 12 / 52;
    for (let w = 0; w < 26; w++) {
      S.focus = ['work', 'rest', 'community'][w % 3];
      const m = curMonth(), working = S.jobId === x.id && !S.retired;
      if (working) { out.inSeason += jobInSeason(x, m) ? 1 : 0; for (const e of EVENTS) if (evCat(e) === 'work' && (!e.when || e.when(m))) out.workEv.add(e.title); }
      weekTick(false);
      const pay = S.last.lines.filter(l => /^Paycheck/.test(l[0])).reduce((a, l) => a + l[1], 0);
      if (working && pay > 0) { out.payWeeks++; out.pay.push(pay / (/overtime/.test(S.last.lines.map(l => l[0]).join()) ? FOCUS.work.payMult : 1)); }
      if (working && S.last.lines.some(l => /^Gas/.test(l[0]) && /commute/.test(l[0]))) out.gas++;
      for (const k of ['money', 'happy', 'health', 'community']) if (!Number.isFinite(S[k])) out.problems.push(`${k} is ${S[k]}`);
    }
    // the Jobs tab reads right for this life
    tab = 'jobs'; render(); const txt = document.querySelector('main, #app, body').innerText;
    if (/NaN|undefined|\[object/.test(txt)) out.problems.push('the Jobs tab shows NaN or undefined');
    const med = [...out.pay].sort((a, b) => a - b)[Math.floor(out.pay.length / 2)] || 0;
    out.ratio = expect ? Math.round(med / expect * 100) / 100 : 0;
    out.far = CITIES[x.city].miles > 0 && x.remote !== 5;
    out.workEv = out.workEv.size;
    return out;
  }));
  await ctx.close();
  const jt = `\n**Every job, 26 weeks each** (i56-b17, the rotator; apart from the medians above):\n\n| Job | Weeks paid | Pay vs listed | Commute weeks | Work events possible |\n|---|---|---|---|---|\n` +
    rows.map(r => `| ${r.title} | ${r.payWeeks} | ${Math.round(r.ratio * 100)}% | ${r.far ? r.gas : '—'} | ${r.workEv} |`).join('\n') + '\n';
  md += jt; console.log(jt);
  await t.check(`the rotator works every job (${rows.length}) for 26 weeks: paid, commuting, with work events and a sane Jobs tab`, async () => {
    const bad = [];
    if (errors.length) bad.push(errors[0]);
    for (const r of rows) {
      if (r.problems.length) bad.push(`${r.id}: ${r.problems[0]}`);
      if (r.payWeeks < Math.min(13, r.inSeason)) bad.push(`${r.id}: paid in only ${r.payWeeks} of ${r.inSeason} weeks in season`);
      if (!(r.ratio >= 0.4 && r.ratio <= 1.6)) bad.push(`${r.id}: pay is ${Math.round(r.ratio * 100)}% of the listed pay`);
      if (r.far && r.gas < r.payWeeks / 3) bad.push(`${r.id}: commute gas in only ${r.gas} of ${r.payWeeks} weeks`);
      if (!r.workEv) bad.push(`${r.id}: no work event can happen`);
    }
    if (bad.length) throw new Error(bad.join('; '));
  });
}

fs.mkdirSync('test-results', { recursive: true });
fs.writeFileSync('test-results/balance-report.md', md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} simulation check(s) failed`); process.exit(1); }
console.log('All simulation checks passed');
