// Weather and hard years (ideas round 75): the shared weather year, the cap on big weather hits,
// and the weather events and chains built on them. Run with: node tests/weather.test.mjs
import { serve, launch, runner, seedScript, assert, near } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(7575));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(srv.url, { waitUntil: 'load' });
await page.evaluate(() => {
  window.fresh = (len = 'two', extra = {}) => { newGame('Wx', len, 0); S.diff = 'hard'; S.noEvents = true; Object.assign(S, extra); return S; };
  window.byTitle = t => EVENTS.find(e => e.title === t) || DUE_EVENTS.find(e => e.title === t);
  window.choose = (t, i = 0) => { const e = byTitle(t); const ch = e.choices().filter(c => !c.if || c.if()); return ch[i].go(); };
  window.labels = t => byTitle(t).choices().filter(c => !c.if || c.if()).map(c => c.label);
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();

await t.check('a01: one weather year: a dry year is the bad harvest, smoke follows the year, odds stay as before', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, diff: 'hard' }); render(); startBiz('wheat');
    let dry = 0, smoke = 0, badDry = 0, smokeDry = 0; const N = 4000;
    for (let i = 0; i < N; i++) { S.wx = null; const w = wxYear(), y = wheatYield(); if (w.dry) { dry++; if (y <= 0.3) badDry++; if (w.smoke) smokeDry++; } if (w.smoke) smoke++; }
    S.wx = { y: new Date(S.date).getFullYear(), dry: false, wet: false, smoke: false, heat: false, rain: false };
    const good = Math.min(...Array.from({ length: 300 }, () => wheatYield()));
    return { dry: dry / N, smoke: smoke / N, badDry: badDry / dry, smokeInDry: smokeDry / dry, good };
  });
  assert(Math.abs(r.dry - 0.15) < 0.025, `dry years ${r.dry}`);
  assert(Math.abs(r.smoke - 0.25) < 0.03, `smoke years ${r.smoke}`);
  assert(r.badDry === 1 && r.good >= 0.9, `a dry year is always the bad harvest (${r.badDry}); a normal one never is (${r.good})`);
  assert(r.smokeInDry > 0.4, `smoke comes with dry years more often (${r.smokeInDry})`);
});

await t.check('a01: July names the year, sets S.smoke from it, and the cattle winter is the valley\'s winter', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 6, 5).getTime(), monKey: 0 });
    wxEnsure(); S.wx.smoke = true; S.wx.dry = true;
    const res = weekTick(false);
    return { note: res.notes.find(n => /dry year/.test(n)), smoke: S.smoke };
  });
  assert(r.note && r.smoke === 2027, `note ${r.note}, smoke ${r.smoke}`);
});

await t.check('a06: smoke years grow more common over the decades, to at most 45%', async () => {
  const r = await ev(() => [smokeOdds(2027), smokeOdds(2052), smokeOdds(2200)]);
  assert(near(r[0], 0.25) && near(r[1], 0.35) && near(r[2], 0.45), r.join());
});

await t.check('a23: after two big weather hits in a year, no more big weather events that year', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 1, 8).getTime() }); S.noEvents = false;
    const big = EVENTS.filter(e => e.big).map(e => e.title);
    const seen = n => { S.wxHits = { y: 2027, n }; const got = new Set(); for (let i = 0; i < 3000; i++) { const e = pickEvent(1, 'town'); if (e) got.add(e.title); } return big.filter(t => got.has(t)); };
    const before = seen(1), after = seen(2);
    S.wxHits = { y: 2026, n: 5 };
    return { big, before, after, newYear: wxCapped() };
  });
  assert(r.big.includes('Windstorm') && r.big.includes('The Touchet is running high'), `big events: ${r.big}`);
  assert(r.before.length > 0 && r.after.length === 0, `before ${r.before}, after ${r.after}`);
  assert(!r.newYear, 'the cap resets each year');
});

await t.check('a23: a big weather event counts as a hit when it fires', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 1, 8).getTime() }); S.noEvents = false;
    const real = rollEvent; rollEvent = () => byTitle('Windstorm');
    weekTick(false); rollEvent = real; return wxHitsNow();
  });
  assert(r === 1, `hits ${r}`);
});

await t.check('old saves load: weather fields get defaults and the year rolls on the next week', async () => {
  const r = await ev(() => {
    fresh('two'); const old = JSON.parse(JSON.stringify(S));
    for (const k of Object.keys(WX_STATE())) delete old[k];
    S = migrate(old); const ok = Object.keys(WX_STATE()).every(k => S[k] !== undefined);
    weekTick(false); return { ok, wx: !!S.wx, w: !!S.wxW };
  });
  assert(r.ok && r.wx && r.w, JSON.stringify(r));
});

await t.check('a02/a20: a May rain lifts the wheat floor to 1.1; hail cuts it, mostly covered by crop insurance', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, date: new Date(2027, 4, 3).getTime(), diff: 'hard' }); render(); startBiz('wheat');
    S.wx = { y: 2027, dry: false, wet: false, smoke: false, heat: false, rain: false };
    choose('A million-dollar rain'); const lo = Math.min(...Array.from({ length: 300 }, () => wheatYield()));
    S.wx.rain = false; S.biz.hail = { y: 2027, cut: 0.3 }; const hailNo = Math.max(...Array.from({ length: 300 }, () => wheatYield()));
    S.biz.ins = true; const hailIns = Math.max(...Array.from({ length: 300 }, () => wheatYield()));
    fresh('two'); S.wx = { y: 2027, dry: false }; const h0 = S.happy; choose('A million-dollar rain');
    return { lo, hailNo, hailIns, nonFarmer: S.happy - h0 };
  });
  assert(r.lo >= 1.1 - 1e-9, `rain floor ${r.lo}`);
  assert(r.hailNo <= 1.7 * 0.7 + 1e-9 && r.hailIns > r.hailNo, `hail ${r.hailNo} / insured ${r.hailIns}`);
  assert(r.nonFarmer >= 0.9, `non-farmers get +1 happy (${r.nonFarmer})`);
});

await t.check('a03: a hard winter adds a heating line, a mild one sends a refund that counts as saved', async () => {
  const r = await ev(() => {
    fresh('two'); wxEnsure(); S.wxW.kind = 'hard'; weekTick(false); const heat = (S.last.lines.find(l => /Heating/.test(l[0])) || [])[1];
    fresh('two'); wxEnsure(); S.wxW.kind = 'mild'; const m0 = S.money; choose('A mild winter');
    const snowHard = (() => { S.wxW.kind = 'hard'; return byTitle('Snow on Highway 12').w(); })(), snowMild = (() => { S.wxW.kind = 'mild'; return byTitle('Snow on Highway 12').w(); })();
    return { heat, refund: S.money - m0, saved: S.wxYr.saved, snowHard, snowMild };
  });
  assert(r.heat < 0 && r.refund > 100 && near(r.saved, r.refund), JSON.stringify(r));
  assert(r.snowHard > r.snowMild, `snow weights ${r.snowHard} / ${r.snowMild}`);
});

await t.check('a04: gray January drains 1 happiness a week for 3–5 weeks; the lamp halves it for good', async () => {
  const r = await ev(() => {
    fresh('two'); S.noEvents = false; S.wx = null; wxEnsure(); S.wxW.kind = 'hard';
    S.gray = { y: 2027, left: 4 }; const base = h => { S.happy = 60; const l = []; wxWeek(l, []); return 60 - S.happy; };
    const a = base(); S.grayLamp = true; const b = base();
    S.gray.left = 1; base(); const ended = S.gray.left === 0 && /First sun/.test(S.log[0].m);
    return { a, b, ended, choices: labels('Gray January').length };
  });
  assert(near(r.a, 1) && near(r.b, 0.5) && r.ended, JSON.stringify(r));
});

await t.check('a05/a32/a18: a chinook raises the river; moving things up halves the flood bill; helpers take 10% each', async () => {
  const r = await ev(() => {
    fresh('two', { money: 50000 }); S.home = 'fixer'; S.mortgage = 950;
    choose('A chinook wind', 0); const hw = S.highWater === S.turn, half = floodBill(1000);
    S.movedUp = null; const full = floodBill(1000);
    S.helped = 3; const h = helpCut(1000); S.helped = 9; const capped = helpCut(1000);
    return { hw, half, full, h: h.c, line: h.line, capped: capped.c };
  });
  assert(r.hw && near(r.half, 500) && near(r.full, 1000), JSON.stringify(r));
  assert(near(r.h, 700) && /Three neighbors came with shovels/.test(r.line) && near(r.capped, 500), JSON.stringify(r));
});

await t.check('a32: drying out after the flood: three cards, cost near the old flood bill, friends shorten it', async () => {
  const r = await ev(() => {
    const run = (pick, helped) => { fresh('two', { money: 50000 }); S.noEvents = false; S.home = 'fixer'; S.mortgage = 950; S.helped = helped;
      S.dryOut = { step:0, at:S.turn, base: 2500, asked:false }; const m0 = S.money, t0 = S.turn; let cards = 0;
      for (let i = 0; i < 20 && S.dryOut; i++) { wxWeek([], []); const due = takeDue(); if (due) { cards++; const ch = due.choices().filter(c => !c.if || c.if()); ch[Math.min(pick, ch.length - 1)].go(); } S.turn++; }
      return { cost: m0 - S.money, cards, weeks: S.turn - t0, done: !S.dryOut }; };
    return { hire: run(0, 0), friends: run(0, 3) };
  });
  assert(r.hire.done && r.hire.cards === 3, JSON.stringify(r.hire));
  assert(r.hire.cost > 2500 * 0.7 && r.hire.cost < 2500 * 1.3, `cost ${r.hire.cost}`);
  assert(r.friends.cost < r.hire.cost && r.friends.weeks < r.hire.weeks, JSON.stringify(r));
});

await t.check('a10/a11: an outage brings the neighbor on oxygen and the line crews; helping counts and names her', async () => {
  const r = await ev(() => {
    fresh('two', { community: 45 }); S.wx = null; wxEnsure(); S.wxW.kind = 'hard';
    choose('An ice storm'); const out = S.outage === S.turn;
    const oxy = byTitle('The neighbor on oxygen').when(), crews = byTitle('Line crews fill the café').when();
    const ls = labels('The neighbor on oxygen'); choose('The neighbor on oxygen', 1);
    choose('Line crews fill the café', 0);
    return { out, oxy, crews, ls, helped: S.helped, june: S.neighbors.june, line: helpCut(1000).line };
  });
  assert(r.out && r.oxy && r.crews && r.ls.length === 3, JSON.stringify(r));
  assert(r.helped === 2 && r.june === 'cord' && /June Harlow/.test(r.line), JSON.stringify(r));
});

await t.check('a15/a16: a dry year asks about the herd; selling down pays now and the herd regrows; an ice storm thins calves', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, date: new Date(2027, 6, 5).getTime(), monKey: 0, diff: 'hard' }); S.noEvents = false; render(); startBiz('cattle');
    S.wx = { y: 2027, dry: true, wet: false, smoke: false, heat: false, rain: false };
    const l = []; wxWeek(l, []); const hay = l.find(x => /dry pasture/.test(x[0])), asked = S.due.includes('A dry year on the herd');
    const m0 = S.money; choose('A dry year on the herd', 0); const sold = { cows: S.biz.cows, cash: S.money - m0 };
    const l2 = []; wxWeek(l2, []); const hayAfter = l2.some(x => /dry pasture/.test(x[0]));
    S.turn = S.biz.regrow; wxWeek([], []);
    choose('An ice storm in calving season', 1);
    return { hay: !!hay, asked, sold, hayAfter, regrown: S.biz.cows, thin: S.biz.thin };
  });
  assert(r.hay && r.asked && r.sold.cows === 4 && r.sold.cash > 2500 && !r.hayAfter, JSON.stringify(r));
  assert(r.regrown === 6 && r.thin === 2027, JSON.stringify(r));
});

await t.check('a17: coffee with the farmers in a dry year comes back as thanks later', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 8, 6).getTime() }); S.wx = { y: 2027, dry: true };
    const when = byTitle('Coffee with the farmers').when(8); choose('Coffee with the farmers', 0);
    S.turn = S.chains.farmer.at; const thanks = byTitle('Dale says thanks').when(); const c0 = S.community; choose('Dale says thanks');
    return { when, thanks, gain: S.community - c0, done: S.chains.farmer.step === 99 };
  });
  assert(r.when && r.thanks && r.gain >= 2.9 && r.done, JSON.stringify(r));
});

await t.check('a24/a29: a dry August swaps tubing for the pool; the onion shed has a short pack season', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'onion', date: new Date(2027, 6, 12).getTime() }); S.wx = { y: 2027, dry: true };
    const pool = labels('August on the Touchet')[0]; const f = wxPayF(job()), lay = wxLayoffF();
    S.wx.dry = false; const tube = labels('August on the Touchet')[0];
    S.wx.dry = true; S.jobId = 'farmhand'; const other = wxPayF(job());
    return { pool, tube, f, lay, other };
  });
  assert(/pool/.test(r.pool) && /river/.test(r.tube), JSON.stringify(r));
  assert(near(r.f, 0.85) && r.lay > 1 && r.other === 1, JSON.stringify(r));
});

await t.check('a22/a30: weather events group on one storm card, and the year review shows the weather bill', async () => {
  const r = await ev(() => {
    fresh('two'); S.run = { weeks: 2, money: S.money, happy: S.happy, health: S.health, community: S.community,
      happened: [{ ic:'🌬️', title:'Windstorm', money:-300, wx:true }, { ic:'🧊', title:'An ice storm', money:-60, wx:true }, { ic:'🐕', title:'A friendly stray', money:0 }] };
    showRunDetails(); const card = document.querySelector('#sheet .wxcard'); const txt = card ? card.textContent : ''; closeSheet();
    showReview({ year: 2027, start: { nw:0, happy:50, health:50, community:30 }, end: { nw:0, happy:50, health:50, community:30 }, milestones: [], events: 3, wx: { cost: 900, saved: 400 } });
    const rv = document.querySelector('#sheet').textContent; closeSheet();
    return { txt, label: card && card.getAttribute('aria-label'), rv };
  });
  assert(/Weather/.test(r.txt) && /360/.test(r.txt) && /Windstorm/.test(r.txt) && !/stray/.test(r.txt), r.txt);
  assert(/What the weather cost you/.test(r.rv) && /900/.test(r.rv) && /400/.test(r.rv), r.rv);
});

await t.check('a31: getting ready pays: moving things up before a flood costs less than it saves on average', async () => {
  const r = await ev(() => {
    // an evening (about 1 happiness) against half the expected flood bill when water does come
    fresh('two', { money: 50000 }); S.home = 'fixer'; const base = cost(2500);
    S.movedUp = S.turn; const prepped = floodBill(base); S.movedUp = null; const not = floodBill(base);
    return { saved: not - prepped };
  });
  assert(r.saved >= 1000, `saved ${r.saved}`);
});

if (errors.length) { console.log('page errors:', errors); process.exitCode = 1; }
await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} weather check(s) failed`); process.exit(1); }
console.log('All weather checks passed');
