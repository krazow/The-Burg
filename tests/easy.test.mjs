// Easier start: Easy is picked for a first life (and the last-started difficulty after that), a one-time "Try a fresh
// start on Easy" card for players on an older Classic or Hard life, and Easy's safety net (quiet first weeks, the
// neighbors' one-time gift, half-speed wear).
// Run with: npm run test:easy
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(4242));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(srv.url, { waitUntil: 'load' });
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();
const open = '#modal:not(.hidden)';
// a clean device on the title screen (newHere skips the practice offer; the What's new card is marked seen)
const fresh = (keep = {}) => ev(k => { closeSheet(); localStorage.clear(); store.set(SEEN_KEY, baseVersion()); for (const [a, b] of Object.entries(k)) setPref(a, b); FRESH_CARD = null; S = null; renderTitle(); }, keep);
const picked = () => ev(() => [...document.querySelectorAll('[data-diff]')].filter(b => b.classList.contains('on')).map(b => b.dataset.diff + ':' + b.getAttribute('aria-pressed')).join());
// an older life in slot i: from before difficulties (Classic) or a Hard life from before this update
const oldLife = (i, kind = 'classic') => ev(([i, kind]) => {
  newGame('Old' + i, 'two', i, kind === 'classic' ? { classic: true, mode: 'normal' } : { diff: 'hard' });
  const g = clone(S); delete g.easyEra; delete g.neighborsHelped; if (kind === 'classic') { delete g.diff; delete g.classic; }
  writeSlot(i, g); S = null; FRESH_CARD = null; const p = prefs(); delete p.freshSeen; delete p.lastDiff; store.set(PREF_KEY, p);   // as saved before this update
}, [i, kind]);
const card = () => ev(() => !!document.querySelector('#freshcard'));

await t.check('a fresh device picks Easy on the start screen, and a first life starts on Easy', async () => {
  await fresh({ newHere: 1 });
  assert(await picked() === 'easy:true', `picked ${await picked()}`);
  assert(await ev(() => document.querySelector('[data-bg="parent"]').hidden), 'the Young parent start should be hidden on Easy');
  await page.fill('#nm', 'Firsty'); await page.click('#start');
  const r = await ev(() => [S.diff, S.easyEra, prefs().lastDiff, prefs().easyPlayed]);
  assert(r.join() === 'easy,true,easy,1', JSON.stringify(r));
});

await t.check('after that the start screen picks the difficulty of the life started last', async () => {
  await ev(() => { save(); S = null; renderTitle(); });
  assert(await picked() === 'easy:true', `after an Easy life: ${await picked()}`);
  await page.click('[data-diff="hard"]'); await page.fill('#nm', 'Hardy'); await page.click('#start');
  assert(await ev(() => S.diff) === 'hard', 'the Hard card should start a Hard life');
  await ev(() => { save(); S = null; renderTitle(); });
  assert(await picked() === 'hard:true', `after a Hard life: ${await picked()}`);
  // a challenge, the weekly or a practice life doesn't change it
  await ev(() => { newGame('Sc', 'two', 3, { scenario: Object.keys(SCENARIOS)[0] }); newGame('Pr', 'half', 4, { practice: true, diff: 'normal' }); S = null; renderTitle(); });
  assert(await picked() === 'hard:true', `after a challenge: ${await picked()}`);
  // a player from before this update (lives saved, no pick remembered) gets Normal, as before
  await fresh(); await oldLife(0); await ev(() => renderTitle());
  assert(await picked() === 'normal:true', `old player: ${await picked()}`);
  // a device with only records (no lives) is not a first life either
  await fresh(); await ev(() => { store.set(ENDS_KEY, [{ name: 'Gone', score: 50, len: 'two', diff: 'hard' }]); renderTitle(); });
  assert(await picked() === 'normal:true', `records only: ${await picked()}`);
});

await t.check('the newbie questions start from Easy', async () => {
  await fresh();
  await page.click('#newbie');
  assert(await ev(() => document.querySelector('#sheet [data-nq="easy"][data-v="easy"]').classList.contains('on')), 'Easy should be picked in the newbie sheet');
  await ev(() => closeSheet());
});

await t.check('the fresh-start card shows once for a Classic life, and Keep playing hides it', async () => {
  await fresh(); await oldLife(0);
  await ev(() => loadSlot(0));
  assert(await ev(() => S.classic && diff() === 'hard'), 'the old save should load as Classic');
  assert(await card(), 'no fresh-start card on a Classic life');
  const txt = await ev(() => document.querySelector('#freshcard').innerText);
  assert(/Easy/.test(txt) && /Start an Easy life/.test(txt) && /Keep playing/.test(txt), txt);
  assert(await ev(() => prefs().freshSeen) === 1, 'shown once per device: the pref should be set');
  await ev(() => { tab = 'jobs'; render(); tab = 'home'; render(); });
  assert(await card(), 'the card should stay up for the rest of this visit until answered');
  await page.click('#freshcard [data-call="freshKeep"]');
  assert(!(await card()), 'Keep playing should hide it');
  // a later visit (FRESH_CARD resets on load): never again on this device
  await ev(() => { FRESH_CARD = null; save(); S = null; loadSlot(0); });
  assert(!(await card()), 'the card came back on a later visit');
  assert(await ev(() => S.name) === 'Old0' && await ev(() => slots().filter(Boolean).length) === 1, 'no life should change');
});

await t.check('the card also shows for a Hard life from before this update, never for a new Hard, Normal or Easy life', async () => {
  await fresh(); await oldLife(0, 'hard');
  await ev(() => loadSlot(0));
  assert(await ev(() => !S.classic && S.diff === 'hard' && S.easyEra === false), 'an old Hard life should migrate with easyEra false');
  assert(await card(), 'no card on a Hard life from before the update');
  for (const d of ['hard', 'normal', 'easy']) {
    await fresh(); await ev(d => { newGame('New', 'two', 0, { diff: d }); tab = 'home'; render(); }, d);
    assert(!(await card()), `a card on a new ${d} life`);
  }
});

await t.check('never for a player who has an Easy life (or played one), and never in challenges, the weekly or practice', async () => {
  // an Easy life in another slot
  await fresh(); await oldLife(0); await ev(() => { newGame('Easy', 'two', 1, { diff: 'easy' }); save(); S = null; localStorage.removeItem(PREF_KEY); loadSlot(0); });
  assert(await ev(() => S.classic) && !(await card()), 'a card for a player with an Easy life');
  // an Easy life that ended (on the records)
  await fresh(); await oldLife(0); await ev(() => { store.set(ENDS_KEY, [{ name: 'E', score: 60, len: 'two', diff: 'easy', classic: false }]); loadSlot(0); });
  assert(!(await card()), 'a card for a player who finished an Easy life');
  // challenges, the weekly challenge, the practice life and the tutorial
  await fresh(); await ev(() => { newGame('Sc', 'two', 0, { scenario: Object.keys(SCENARIOS)[0] }); tab = 'home'; render(); });
  assert(await ev(() => !!S.scenario && diff() === 'hard') && !(await card()), 'a card in a story challenge');
  await ev(() => { S.easyEra = false; S.classic = true; render(); });
  assert(!(await card()), 'a card in an older story challenge');
  await fresh(); await ev(() => { newGame('Wk', 'half', 0, { classic: true }); S.weekly = isoWeek(); tab = 'home'; render(); });
  assert(!(await card()), 'a card in the weekly challenge');
  await fresh(); await ev(() => { newGame('Pr', 'half', 0, { classic: true, practice: true }); tab = 'home'; render(); });
  assert(!(await card()), 'a card in the practice life');
  await fresh(); await oldLife(0); await ev(() => { TUT = { i: 0 }; FRESH_CARD = null; loadSlot(0); });
  const inTut = await card(); await ev(() => { TUT = null; });
  assert(!inTut, 'a card during the tutorial');
  assert(!(await ev(() => prefs().freshSeen)), 'a hidden card should not use up the one showing');
});

await t.check('Start an Easy life opens the start screen with Easy picked in a free slot, and deletes nothing', async () => {
  await fresh(); await oldLife(0); await oldLife(1);
  await ev(() => loadSlot(0));
  await page.click('#freshcard [data-call="freshEasy"]');
  assert(await ev(() => S === null && !!document.querySelector('#start')), 'should be on the start screen');
  assert(await picked() === 'easy:true', `picked ${await picked()}`);
  assert(await ev(() => slots().filter(Boolean).map(g => g.name).join()) === 'Old0,Old1', 'the lives should all be kept');
  await page.fill('#nm', 'Sprout'); await page.click('#start');
  const r = await ev(() => [S.diff, S.slot, slots().filter(Boolean).map(g => g.name).join()]);
  assert(r[0] === 'easy' && r[1] === 2 && r[2] === 'Old0,Old1,Sprout', JSON.stringify(r));
});

await t.check('with all 5 slots full it says so and points to replacing one, and never deletes a life', async () => {
  await fresh();
  for (let i = 0; i < 5; i++) await oldLife(i);
  const before = await ev(() => slots().map(g => g && g.lid).join());
  await ev(() => loadSlot(2));
  await page.click('#freshcard [data-call="freshEasy"]');
  await page.waitForSelector(`${open} [data-call="freshTitle"]`);
  const txt = await ev(() => document.querySelector('#sheet').innerText);
  assert(/All 5 slots are full/.test(txt) && /replace/.test(txt) && /Nothing is deleted/.test(txt), txt);
  assert(await ev(() => slots().map(g => g && g.lid).join()) === before, 'a life changed');
  await page.click(`${open} [data-call="freshKeep"]`);
  assert(await ev(() => !!S && S.name === 'Old2' && document.querySelector('#modal').classList.contains('hidden')), 'Keep playing should go back to the life');
  // Go to the start screen: Easy picked; Start asks which life to replace (nothing deleted until you say yes)
  await ev(() => freshEasy()); await page.click(`${open} [data-call="freshTitle"]`);
  assert(await picked() === 'easy:true', `picked ${await picked()}`);
  await page.fill('#nm', 'Sprout'); await page.click('#start');
  await page.waitForSelector(`${open} [data-over]`);
  await page.click(`${open} #no`);
  assert(await ev(() => slots().map(g => g && g.lid).join()) === before, 'a life was deleted');
});

await t.check('Easy safety net: no bad-luck events in the first 8 weeks (Normal and Hard keep them)', async () => {
  const r = await ev(() => {
    const out = {}, r0 = render;
    for (const d of ['easy', 'normal']) {
      newGame('Net', 'two', 0, { diff: d }); render = () => {}; S.jobId = 'farmhand';
      const pick = turn => { S.turn = turn; S.evSeen = {}; let bad = 0; for (let i = 0; i < 400; i++) for (const cat of ['town', 'road', 'work']) { const e = pickEvent(0, cat); if (e && EVENT_BAD.has(e.title)) bad++; } return bad; };
      out[d] = { early: pick(0) + pick(7), later: pick(8) };
      out[d].fixed = (() => { S.turn = 3; return EVENTS.filter(e => e.fixed && EVENT_BAD.has(e.title)).every(e => !evSafeOK(e)); })();
    }
    render = r0;
    return out;
  });
  assert(r.easy.early === 0 && r.easy.later > 0 && r.easy.fixed, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.early > 0, `normal ${JSON.stringify(r.normal)}`);
});

await t.check("Easy safety net: the neighbors pitch in once when cash first drops below $0 in year one", async () => {
  const r = await ev(() => {
    const out = {};
    const run = (d, turn, money) => { newGame('Gift', 'two', 0, { diff: d }); S.noEvents = true; S.turn = turn; S.money = money; const n = []; const g = neighborsWeek(n); return { g, m: S.money, n: n.length, helped: S.neighborsHelped }; };
    out.easy = run('easy', 10, -300);
    out.again = (() => { S.money = -200; return neighborsWeek([]); })();
    out.deep = run('easy', 20, -5000);
    out.yearTwo = run('easy', 60, -300);
    out.normal = run('normal', 10, -300);
    out.hard = run('hard', 10, -300);
    // through a played week: cash below $0 ends the week back above it, with a note and a Journal line
    newGame('Week', 'two', 0, { diff: 'easy' }); S.noEvents = true; S.turn = 12; S.money = -400;
    const res = weekTick(false);
    out.week = { m: S.money > 0, note: res.notes.some(x => /neighbors/.test(x)), log: S.log.some(e => /neighbors pitched in/.test(e.m)) };
    return out;
  });
  assert(r.easy.g > 0 && r.easy.m > 0 && r.easy.n === 1 && r.easy.helped, `easy ${JSON.stringify(r.easy)}`);
  assert(r.again === 0, 'the gift came twice');
  assert(r.deep.g === 1500 && r.deep.m === -3500, `the gift should top out at $1,500: ${JSON.stringify(r.deep)}`);
  assert(r.yearTwo.g === 0 && r.normal.g === 0 && r.hard.g === 0, JSON.stringify(r));
  assert(r.week.m && r.week.note && r.week.log, JSON.stringify(r.week));
});

await t.check('Easy wears stats down at half speed; Classic Relaxed lives keep 60%', async () => {
  const r = await ev(() => {
    const drop = o => { newGame('Wear', 'two', 0, o); S.noEvents = true; S.jobId = 'farmhand'; S.focus = 'rest'; S.happy = 95; S.health = 95; S.community = 90; const c0 = S.community; weekTick(false); return c0 - S.community; };
    return { easy: drop({ diff: 'easy' }), relaxed: drop({ classic: true, mode: 'relaxed' }) };
  });
  assert(r.easy > 0 && r.relaxed > 0 && Math.abs(r.easy / r.relaxed - 0.5 / 0.6) < 0.05, JSON.stringify(r));
});

await t.check('old saves migrate: easyEra false and neighborsHelped false; new lives start with easyEra true', async () => {
  const r = await ev(() => { newGame('M', 'two', 0, { diff: 'easy' }); const fresh = [S.easyEra, S.neighborsHelped]; const g = clone(S); delete g.easyEra; delete g.neighborsHelped; const m = migrate(g); return [...fresh, m.easyEra, m.neighborsHelped]; });
  assert(r.join() === 'true,false,false,false', JSON.stringify(r));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll Easy start checks passed');
