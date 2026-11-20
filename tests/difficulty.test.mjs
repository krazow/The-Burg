// Difficulty modes (to-do list 2, stage 1: D1 + D4): js/difficulty.js and on(k) with deps and device overrides,
// S.diff on new lives and old saves (Hard + Classic), the start screen's three difficulty cards, event tiers and a
// roll that never picks an event above the life's difficulty (52 weeks in each), and Easy's softer event dice.
// Run with: npm run test:difficulty
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(2027));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(srv.url, { waitUntil: 'load' });
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();

await t.check('difficulty.js: three difficulties in order, every feature has a tier, core features are Easy', async () => {
  const r = await ev(() => ({ order: DIFF_LIST.map(k => DIFF_ORDER[k]), keys: Object.keys(FEATURE_TIER).length,
    tiers: [...new Set(Object.values(FEATURE_TIER))].sort(), core: Object.keys(FEATURE_TIER).filter(k => k.startsWith('core.')).every(k => FEATURE_TIER[k] === 'easy'),
    modes: DIFF_LIST.map(k => DIFF_MODE[k]), deps: Object.values(FEATURE_DEPS).flat().every(d => FEATURE_TIER[d]) }));
  assert(r.order.join() === '0,1,2' && r.keys === 95, JSON.stringify(r));
  assert(r.tiers.join() === 'easy,hard,normal' && r.core && r.deps, JSON.stringify(r));
  assert(r.modes.join() === 'relaxed,normal,hard', JSON.stringify(r.modes));
});

await t.check('on(k): unknown keys are on, tiers stack Easy < Normal < Hard, and deps switch a feature off', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      const s = { diff: d };
      out[d] = { unknown: on('no.such.thing', s), core: on('core.week', s), normal: on('money.k401', s), hard: on('jobs.layoffs', s) };
    }
    // a dep that's off switches its feature off, even with the feature itself forced on
    const s = { diff: 'hard', practice: true };
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'money.collections': false }));
    out.dep = { bankruptcy: on('money.bankruptcy', s), collections: on('money.collections', s) };
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'home.buy': false, 'home.loans': true }));
    out.dep2 = on('home.loans', s);
    // a fake loop in the deps never hangs or locks a feature
    FEATURE_DEPS['x.a'] = ['x.b']; FEATURE_DEPS['x.b'] = ['x.a']; FEATURE_TIER['x.a'] = 'easy'; FEATURE_TIER['x.b'] = 'easy';
    out.loop = on('x.a', { diff: 'easy' });
    delete FEATURE_DEPS['x.a']; delete FEATURE_DEPS['x.b']; delete FEATURE_TIER['x.a']; delete FEATURE_TIER['x.b'];
    localStorage.removeItem(DIFF_FLAGS_KEY);
    return out;
  });
  assert(r.easy.unknown && r.easy.core && !r.easy.normal && !r.easy.hard, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.core && r.normal.normal && !r.normal.hard, `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.core && r.hard.normal && r.hard.hard, `hard ${JSON.stringify(r.hard)}`);
  assert(!r.dep.bankruptcy && !r.dep.collections && !r.dep2 && r.loop, JSON.stringify(r));
});

await t.check('device overrides: used by a marked or sandbox life, never by a weekly challenge or a records life', async () => {
  const r = await ev(() => {
    localStorage.clear(); localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'jobs.layoffs': true, 'core.jobs': false }));
    const out = {
      records: on('jobs.layoffs', { diff: 'easy', rules: {} }),
      marked: on('jobs.layoffs', { diff: 'easy', rules: {}, flagsEdited: true }),
      markedOff: on('core.jobs', { diff: 'easy', rules: {}, flagsEdited: true }),
      sandbox: on('jobs.layoffs', { diff: 'easy', rules: { events: 'none' }, tier0: 'sandbox' }),
      weekly: on('jobs.layoffs', { diff: 'easy', rules: {}, flagsEdited: true, weekly: '2027-W01' })
    };
    localStorage.setItem(DIFF_FLAGS_KEY, '[1,2]'); out.junk = on('jobs.layoffs', { diff: 'easy', flagsEdited: true });
    localStorage.setItem(DIFF_FLAGS_KEY, '{oops'); out.broken = on('jobs.layoffs', { diff: 'easy', flagsEdited: true });
    localStorage.clear(); return out;
  });
  assert(!r.records && r.marked && !r.markedOff && r.sandbox && !r.weekly, JSON.stringify(r));
  assert(!r.junk && !r.broken, `bad overrides should be ignored ${JSON.stringify(r)}`);
});

await t.check('new lives: S.diff picks the mode numbers (Easy plays Relaxed), weekly and challenges are Normal', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) { newGame('D', 'two', 0, { diff: d }); out[d] = [S.diff, S.mode, mode(), S.classic, diff()]; }
    newGame('D', 'two', 0); out.none = [S.diff, S.mode];
    newGame('D', 'two', 0, { mode: 'relaxed' }); out.oldOpt = [S.diff, S.mode];
    newGame('D', 'two', 0, { diff: 'nope' }); out.bad = S.diff;
    startWeekly('W'); out.weekly = [S.diff, S.mode];
    newGame('D', 'two', 0, { mode: 'hard', classic: true }); out.classicHeir = [S.diff, S.mode, S.classic];
    S = null; closeSheet(); render(); return out;
  });
  assert(r.easy.join() === 'easy,relaxed,relaxed,false,easy', `easy ${r.easy}`);
  assert(r.normal.join() === 'normal,normal,normal,false,normal' && r.hard.join() === 'hard,hard,hard,false,hard', `${r.normal} / ${r.hard}`);
  assert(r.none.join() === 'normal,normal' && r.oldOpt.join() === 'easy,relaxed' && r.bad === 'normal', JSON.stringify(r));
  assert(r.weekly.join() === 'normal,normal' && r.classicHeir.join() === 'hard,hard,true', JSON.stringify(r));
});

await t.check('an old save (no S.diff) loads as Hard and Classic, keeps its own mode, and saves that way', async () => {
  const r = await ev(() => {
    localStorage.clear(); newGame('Old', 'two', 0, { diff: 'easy' }); S.noEvents = true;
    const old = JSON.parse(JSON.stringify(S)); delete old.diff; delete old.classic; delete old.flagsEdited; old.mode = 'relaxed';
    const m = migrate(JSON.parse(JSON.stringify(old)));
    const n = migrate(JSON.parse(JSON.stringify({ ...old, mode: 'normal' })));
    const keep = migrate(JSON.parse(JSON.stringify({ ...old, diff: 'easy', classic: false })));
    const bad = migrate(JSON.parse(JSON.stringify({ ...old, diff: 'impossible', classic: false })));
    // through a real slot load
    writeSlot(1, old); loadSlot(1); const loaded = [S.diff, S.classic, mode(), on('jobs.layoffs')];
    save(); const back = readSlot(1); S = null; closeSheet(); render();
    return { m: [m.diff, m.classic, m.mode, m.flagsEdited], n: [n.diff, n.classic, n.mode], keep: [keep.diff, keep.classic], bad: bad.diff, loaded, back: [back.diff, back.classic] };
  });
  assert(r.m.join() === 'hard,true,relaxed,false' && r.n.join() === 'hard,true,normal', JSON.stringify(r));
  assert(r.keep.join() === 'easy,false' && r.bad === 'hard', JSON.stringify(r));
  assert(r.loaded.join() === 'hard,true,relaxed,true' && r.back.join() === 'hard,true', JSON.stringify(r));
});

await t.check('start screen: three difficulty cards (Normal picked) replace the mode picker, and the pick starts the life', async () => {
  await ev(() => { localStorage.clear(); setPref('newHere', 1); S = null; closeSheet(); render(); });
  const cards = await page.$$eval('[data-diff]', bs => bs.map(b => ({ k: b.dataset.diff, on: b.getAttribute('aria-pressed'), text: b.textContent })));
  assert(cards.map(c => c.k).join() === 'easy,normal,hard', JSON.stringify(cards));
  assert(cards.map(c => c.on).join() === 'false,true,false', 'Normal should start picked');
  assert(/never ends your game/.test(cards[0].text) && /kids/.test(cards[1].text) && /layoffs/.test(cards[2].text), JSON.stringify(cards));
  assert((await page.$$('[data-mode]')).length === 0 && !(await page.$('#modedesc')), 'the old mode picker should be gone');
  assert(await page.isVisible('[data-diff="easy"]'), 'the cards should show without opening More options');
  await page.click('[data-diff="easy"]');
  assert((await page.getAttribute('[data-diff="easy"]', 'aria-pressed')) === 'true' && (await page.getAttribute('[data-diff="normal"]', 'aria-pressed')) === 'false', 'the pick did not move');
  assert(/Easy/.test(await page.textContent('#moresum')), await page.textContent('#moresum'));
  await page.fill('#nm', 'Gentle'); await page.click('#start');
  const s = await ev(() => [S.diff, S.mode, S.classic]);
  assert(s.join() === 'easy,relaxed,false', JSON.stringify(s));
  assert(/Easy/.test(await page.textContent('header.top')), 'the header should show the difficulty');
});

await t.check('every event has a tier after boot (untiered ones count as Normal), and the tiers came from the plan', async () => {
  const r = await ev(() => ({ all: [...EVENTS, ...DUE_EVENTS, ...PLAN_DUE].every(e => DIFF_ORDER[e.tier] != null),
    layoffs: EVENTS.find(e => e.title === 'Layoffs').tier, cel: EVENTS.find(e => e.title === 'Celebration Days').tier,
    plan: PLAN_DUE[0].tier, listed: Object.keys(EVENT_TIER).every(t => EVENTS.some(e => e.title === t) || DUE_EVENTS.some(e => e.title === t) || PLAN_DUE.some(e => e.title === t)),   // the Little League steps are due events
    count: { easy: EVENTS.filter(e => e.tier === 'easy').length, hard: EVENTS.filter(e => e.tier === 'hard').length } }));
  assert(r.all && r.layoffs === 'hard' && r.cel === 'easy' && r.plan === 'normal' && r.listed, JSON.stringify(r));
  assert(r.count.easy > 50 && r.count.hard > 20, JSON.stringify(r.count));
});

await t.check('52 weeks in each difficulty, events on: the roll never picks an event above the difficulty', async () => {
  const r = await ev(() => {
    const out = {}, orig = rollEvent;
    for (const d of DIFF_LIST) {
      const seen = {}; let picks = 0, above = [];
      window.rollEvent = (m, trip) => { const e = orig(m, trip); if (e) { picks++; seen[e.tier] = (seen[e.tier] || 0) + 1; if (DIFF_ORDER[evTier(e)] > DIFF_ORDER[d]) above.push(e.title); } return e; };
      for (const [job, seed] of [['diner', 1], ['cellar', 2], ['farmhand', 3]]) {
        localStorage.clear(); newGame('Roll', 'five', 0, { diff: d, rules: { events: 'busy' } });
        S.money = 20000; if (jobById(job)) { S.jobId = job; S.jobMonths = 12; }
        for (let i = 0; i < 52 && !S.over; i++) {
          const res = weekTick(true);
          if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; }
          if (res.ending) break;
        }
      }
      out[d] = { picks, seen, above };
    }
    window.rollEvent = orig; S = null; closeSheet(); render(); return out;
  });
  for (const d of ['easy', 'normal', 'hard']) {
    assert(!r[d].above.length, `${d} picked events above its tier: ${r[d].above.join(', ')}`);
    assert(r[d].picks >= 15, `${d}: too few events to tell (${r[d].picks})`);
  }
  assert(!r.easy.seen.normal && !r.easy.seen.hard && !r.normal.seen.hard, JSON.stringify(r));
  assert(r.hard.seen.hard > 0 || r.hard.seen.normal > 0, `Hard should still see its own events ${JSON.stringify(r.hard)}`);
});

await t.check('Easy pacing: events that cost money or stats come about 40% less often; Normal and Hard keep today\'s dice', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Pace', 'two', 0, { diff: d }); S.evSeen = {};
      let bad = 0, good = 0, none = 0; const N = 4000;
      for (let i = 0; i < N; i++) { S.evCd = {}; const e = pickEvent(i % 12, 'town'); if (!e) none++; else if (EVENT_BAD.has(e.title)) bad++; else good++; }
      out[d] = { bad, good, none };
    }
    S = null; closeSheet(); render(); return out;
  });
  assert(r.normal.none === 0 && r.hard.none === 0, `Normal and Hard should always pick when they roll ${JSON.stringify(r)}`);
  assert(r.easy.none > 0, `Easy should have quiet weeks ${JSON.stringify(r.easy)}`);
  const share = x => x.bad / (x.bad + x.good + x.none);
  assert(share(r.easy) < share(r.normal) * 0.85, `Easy should see fewer bad events ${JSON.stringify(r)}`);
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll difficulty checks passed');
