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
  window.fresh = (len = 'two', extra = {}) => { newGame('Wx', len, 0); S.noEvents = true; Object.assign(S, extra); return S; };
  window.byTitle = t => EVENTS.find(e => e.title === t) || DUE_EVENTS.find(e => e.title === t);
  window.choose = (t, i = 0) => { const e = byTitle(t); const ch = e.choices().filter(c => !c.if || c.if()); return ch[i].go(); };
  window.labels = t => byTitle(t).choices().filter(c => !c.if || c.if()).map(c => c.label);
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();

await t.check('a01: one weather year: a dry year is the bad harvest, smoke follows the year, odds stay as before', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000 }); render(); startBiz('wheat');
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

if (errors.length) { console.log('page errors:', errors); process.exitCode = 1; }
await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} weather check(s) failed`); process.exit(1); }
console.log('All weather checks passed');
