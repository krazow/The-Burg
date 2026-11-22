// The hidden owner panel (feature-flag plan): ?owner or 7 quick taps on the version line open it; each feature can be
// Default, Force on or Force off on this device; new lives take a copy, "Apply to this life now" uses it at once; a
// life played with owner settings is marked and kept off the Easy, Normal, Hard and Classic shelves; weekly and story
// challenges ignore it. Run with: npm run test:owner
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(4242));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();
const panelOpen = () => ev(() => !$('#modal').classList.contains('hidden') && $('#sheet').classList.contains('owner'));
const reset = () => ev(() => { if (TUT) endTutorial(false); localStorage.clear(); OWNER_VIEW = null; S = null; closeSheet(); render(); });

await t.check('?owner in the address opens the panel: every feature, grouped by area, core ones always on', async () => {
  await page.goto(srv.url + '?owner', { waitUntil: 'load' });
  assert(await panelOpen(), 'the panel should open with ?owner');
  const r = await ev(() => {
    const rows = [...document.querySelectorAll('#sheet .ownrow')];
    const core = rows.filter(x => x.dataset.key.startsWith('core.'));
    return { title: $('#sheet h2').textContent, rows: rows.length, keys: Object.keys(FEATURE_TIER).length, areas: document.querySelectorAll('#sheet h3[data-area]').length,
      core: core.length, coreSeg: core.some(x => x.querySelector('[data-own]')), coreLock: core.every(x => /Always on/.test(x.textContent)),
      segs: rows.filter(x => x.querySelectorAll('[data-own]').length === 3).length, tiers: rows.every(x => x.querySelector('[data-tier]')),
      bal: document.querySelectorAll('#sheet .ownbal').length, balWant: Object.values(FEATURE_INFO).filter(f => f.b).length,
      deps: document.querySelector('#sheet .ownrow[data-key="family.kids"]').textContent,
      missing: Object.keys(FEATURE_TIER).filter(k => !FEATURE_INFO[k]), inline: document.querySelectorAll('#sheet [onclick]').length };
  });
  assert(/Developer/.test(r.title), r.title);
  assert(r.rows === 95 && r.keys === 95 && !r.missing.length, `rows ${r.rows} keys ${r.keys} missing ${r.missing}`);
  assert(r.areas === 16, `areas ${r.areas}`);
  assert(r.core === 6 && !r.coreSeg && r.coreLock && r.segs === 89 && r.tiers, JSON.stringify(r));
  assert(r.bal === r.balWant && r.bal > 50, `balance badges ${r.bal}/${r.balWant}`);
  assert(/Needs: Partner/i.test(r.deps), `deps note ${r.deps}`);
  assert(!r.inline, 'no inline handlers');
  await ev(() => $('#ownclose').click());
  assert(!(await panelOpen()), 'Done closes it');
});

await t.check('7 quick taps on the version line open it, on the title screen and in the Menu; 6 taps or slow taps do not', async () => {
  await page.goto(srv.url, { waitUntil: 'load' });
  await reset();
  assert(!(await panelOpen()), 'no panel without ?owner');
  for (let i = 0; i < 6; i++) await page.click('.title [data-ver]');
  assert(!(await panelOpen()), '6 taps should not open it');
  await page.waitForTimeout(1100);
  await page.click('.title [data-ver]');
  assert(!(await panelOpen()), 'a slow 7th tap starts the count again');
  for (let i = 0; i < 6; i++) await page.click('.title [data-ver]');
  assert(await panelOpen(), '7 quick taps on the title screen open it');
  await ev(() => { closeSheet(); newGame('Menu', 'two', 0, { diff: 'normal' }); showMenu(); });
  for (let i = 0; i < 7; i++) await page.click('#sheet [data-ver]');
  assert(await panelOpen(), '7 quick taps in the Menu open it');
  await reset();
});

await t.check('Force on: a Normal feature shows up in a new Easy life; Apply now takes a feature away from a Hard life', async () => {
  await reset();
  const r = await ev(() => {
    const out = {};
    const k401 = () => { tab = 'life'; render(); return !!document.querySelector('#k401card'); };
    newGame('Plain', 'two', 0, { diff: 'easy', unlock: 'all' }); out.plain = { on: on('money.k401'), card: k401(), marked: S.flagsEdited };
    ownerPanel(); OWNER_VIEW = 'easy'; ownerPanel();
    out.before = document.querySelector('#sheet .ownrow[data-key="money.k401"] [data-now]').textContent;
    document.querySelector('#sheet [data-own="money.k401"][data-v="on"]').click();
    out.after = document.querySelector('#sheet .ownrow[data-key="money.k401"] [data-now]').textContent;
    out.saved = JSON.parse(localStorage.getItem(DIFF_FLAGS_KEY));
    out.oldLife = on('money.k401');                                  // the open life keeps playing as it was until Apply
    closeSheet();
    newGame('Forced', 'two', 1, { diff: 'easy', unlock: 'all' });
    out.forced = { on: on('money.k401'), card: k401(), marked: S.flagsEdited, flags: S.flags };
    tab = 'home'; render(); out.chip = (document.querySelector('#ownchip') || {}).textContent || '';
    // Hard: a life started without overrides, then the panel forces 401(k) off and applies it now
    localStorage.removeItem(DIFF_FLAGS_KEY);
    newGame('Hard', 'two', 2, { diff: 'hard', unlock: 'all' }); out.hard0 = { card: k401(), marked: S.flagsEdited };
    tab = 'home'; render(); out.chip0 = !!document.querySelector('#ownchip');
    ownerPanel(); document.querySelector('#sheet [data-own="money.k401"][data-v="off"]').click();
    out.hardMid = on('money.k401');
    document.querySelector('#ownapply').click();
    out.hard1 = { on: on('money.k401'), marked: S.flagsEdited, state: $('#ownstate').textContent };
    $('#ownclose').click(); out.hard1.card = k401();
    out.saved2 = readSlot(2) && readSlot(2).flagsEdited;
    return out;
  });
  assert(!r.plain.on && !r.plain.card && !r.plain.marked, `plain Easy ${JSON.stringify(r.plain)}`);
  assert(r.before === 'off' && r.after === 'on' && r.saved['money.k401'] === true && !r.oldLife, JSON.stringify(r));
  assert(r.forced.on && r.forced.card && r.forced.marked && r.forced.flags['money.k401'] === true, `forced Easy ${JSON.stringify(r.forced)}`);
  assert(/Owner settings on/.test(r.chip), `chip ${r.chip}`);
  assert(r.hard0.card && !r.hard0.marked && !r.chip0, `hard before ${JSON.stringify(r.hard0)}`);
  assert(r.hardMid, 'the open life changes only on Apply');
  assert(!r.hard1.on && !r.hard1.card && r.hard1.marked && /Custom shelf/.test(r.hard1.state) && r.saved2, `hard after ${JSON.stringify(r.hard1)}`);
  await reset();
});

await t.check('dependencies: a switch is disabled with a note when what it needs is off', async () => {
  await reset();
  const r = await ev(() => {
    const out = {};
    ownerPanel(); OWNER_VIEW = 'hard'; ownerPanel();
    const row = k => document.querySelector(`#sheet .ownrow[data-key="${k}"]`);
    const btns = k => [...row(k).querySelectorAll('[data-own]')].map(b => b.disabled);
    out.loans0 = btns('home.loans');
    document.querySelector('#sheet [data-own="home.buy"][data-v="off"]').click();
    out.loans1 = { dis: btns('home.loans'), blocked: row('home.loans').classList.contains('blocked'), text: row('home.loans').textContent, now: row('home.loans').querySelector('[data-now]').textContent };
    out.onLoans = on('home.loans', { diff: 'hard', flags: { 'home.buy': false, 'home.loans': true } });
    // in Easy, bankruptcy needs collections, which is a Hard feature
    OWNER_VIEW = 'easy'; ownerPanel(); out.easyBank = { dis: btns('money.bankruptcy'), text: row('money.bankruptcy').textContent };
    // forcing the dependency on frees it
    document.querySelector('#sheet [data-own="money.collections"][data-v="on"]').click(); out.easyBank2 = btns('money.bankruptcy');
    closeSheet(); return out;
  });
  assert(r.loans0.every(d => !d), `home.loans starts free ${r.loans0}`);
  assert(r.loans1.dis.every(Boolean) && r.loans1.blocked && /Off because Buying a home/i.test(r.loans1.text) && r.loans1.now === 'off', JSON.stringify(r.loans1));
  assert(!r.onLoans, 'on() keeps a feature off when its dependency is off');
  assert(r.easyBank.dis.every(Boolean) && /Off because/.test(r.easyBank.text) && r.easyBank2.every(d => !d), JSON.stringify(r));
  await reset();
});

await t.check('Reset all to defaults clears every override (and the Home chip)', async () => {
  await reset();
  const r = await ev(() => {
    newGame('Reset', 'two', 0, { diff: 'normal' });
    ownerPanel();
    for (const k of ['weather', 'family.pets', 'biz']) document.querySelector(`#sheet [data-own="${k}"][data-v="off"]`).click();
    document.querySelector('#sheet [data-own="jobs.layoffs"][data-v="on"]').click();
    const out = { n: Object.keys(JSON.parse(localStorage.getItem(DIFF_FLAGS_KEY))).length, state: $('#ownstate').textContent };
    closeSheet(); tab = 'home'; render(); out.chip = !!document.querySelector('#ownchip');
    document.querySelector('#ownchip').click(); out.chipOpens = $('#sheet').classList.contains('owner');
    $('#ownreset').click();
    out.after = localStorage.getItem(DIFF_FLAGS_KEY);
    out.allDef = [...document.querySelectorAll('#sheet [data-own][data-v="def"]')].every(b => b.classList.contains('on'));
    out.resetOff = $('#ownreset').disabled; out.state2 = $('#ownstate').textContent;
    $('#ownclose').click(); out.chip2 = !!document.querySelector('#ownchip');
    out.newLife = (newGame('After', 'two', 1, { diff: 'normal' }), S.flagsEdited);
    return out;
  });
  assert(r.n === 4 && /4 parts are forced/.test(r.state), JSON.stringify(r));
  assert(r.chip && r.chipOpens, 'the chip shows and opens the panel');
  assert(r.after === null && r.allDef && r.resetOff && /Everything is on Default/.test(r.state2), JSON.stringify(r));
  assert(!r.chip2 && !r.newLife, 'after a reset there is no chip and new lives are not marked');
  await reset();
});

await t.check('records: a life with owner settings goes on the Custom shelf, never on Easy, Normal, Hard or Classic', async () => {
  await reset();
  const r = await ev(() => {
    const out = {};
    newGame('Normal', 'half', 0, { diff: 'easy' }); S.turn = 26; finish('done');
    out.plainKeys = Object.keys(store.get(BEST_KEY) || {}); closeSheet();
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'family.pets': false }));
    newGame('Owner', 'two', 1, { diff: 'easy' }); out.tier = lifeTier(); S.turn = 104; S.money = 90000; finish('done');
    out.note = ($('#tiernote') || {}).textContent || '';
    out.keys = Object.keys(store.get(BEST_KEY) || {});
    out.stub = ends()[0]; out.top = SHELVES.flatMap(topOf).map(e => e.name); out.custom = customShelf();
    closeSheet();
    // weekly and story challenges ignore owner settings
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'money.k401': false, 'jobs.layoffs': true }));
    newGame('Week', 'half', WEEKLY_SLOT, { weekly: isoWeek(), diff: 'normal' }); out.weekly = { marked: S.flagsEdited, k401: on('money.k401'), lay: on('jobs.layoffs'), tier: lifeTier() };
    const sc = Object.keys(SCENARIOS)[0];
    newGame('Story', 'two', 2, { scenario: sc }); out.story = { marked: S.flagsEdited, k401: on('money.k401'), flags: S.flags };
    S = null; return out;
  });
  assert(r.plainKeys.some(k => !k.startsWith('cu-')), `a plain life is recorded normally ${r.plainKeys}`);
  assert(r.tier === 'custom' && /Owner settings were on/.test(r.note), `tier ${r.tier} note ${r.note}`);
  const owned = r.keys.filter(k => /two/.test(k));
  assert(owned.length && owned.every(k => k.startsWith('cu-')), `owner life keys ${r.keys}`);
  assert(r.stub.name === 'Owner' && r.stub.owner && !r.top.includes('Owner') && r.top.includes('Normal'), `top lists ${r.top}`);
  assert(/Custom rules/.test(r.custom), 'Custom shelf lists it');
  assert(!r.weekly.marked && r.weekly.k401 && !r.weekly.lay && r.weekly.tier === 'standard', `weekly ${JSON.stringify(r.weekly)}`);
  assert(!r.story.marked && r.story.k401 && !Object.keys(r.story.flags || {}).length, `story ${JSON.stringify(r.story)}`);
  await reset();
});

await t.check('saves: S.flags has a default, survives a save, and migrate() cleans it', async () => {
  await reset();
  const r = await ev(() => {
    const out = { blank: blankLife('B', 'two', 0).flags };
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify({ 'weather': false, 'core.week': false, 'no.such': true, 'biz': 'yes' }));
    out.dev = ownerFlags();
    newGame('Save', 'two', 0, { diff: 'normal' }); save(); out.loaded = migrate(clone(readSlot(0))).flags;
    const old = clone(readSlot(0)); delete old.flags; delete old.flagsEdited; out.old = [migrate(old).flags, old.flagsEdited];
    const junk = clone(readSlot(0)); junk.flags = [1, 2]; out.junk = migrate(junk).flags;
    const bad = clone(readSlot(0)); bad.flags = { weather: false, 'core.jobs': false, x: 1 }; out.bad = migrate(bad).flags;
    S = null; return out;
  });
  assert(r.blank === null, `blank ${r.blank}`);
  assert(JSON.stringify(r.dev) === '{"weather":false}', `device overrides are cleaned ${JSON.stringify(r.dev)}`);
  assert(JSON.stringify(r.loaded) === '{"weather":false}', `loaded ${JSON.stringify(r.loaded)}`);
  assert(r.old[0] === null && r.old[1] === false && r.junk === null && JSON.stringify(r.bad) === '{"weather":false}', JSON.stringify(r));
  await reset();
});

await t.check('not mentioned in Help, the tutorial or What\'s new', async () => {
  await reset();
  const r = await ev(() => {
    newGame('Help', 'two', 0, { diff: 'hard' });
    showHelp(); const help = document.querySelector('#helpview').textContent; closeHelp();
    const tut = (typeof TSTEPS !== 'undefined' ? TSTEPS : []).map(s => s.text).join(' ');
    const wn = typeof WHATS_NEW !== 'undefined' ? JSON.stringify(WHATS_NEW) : '';
    S = null; const o = /owner (panel|settings)|\?owner|version line/i; return { help: o.test(help), tut: o.test(tut), wn: o.test(wn) };
  });
  assert(!r.help && !r.tut && !r.wn, JSON.stringify(r));
  await reset();
});

await t.check('26 weeks with several features forced off: every tab draws and nothing errors', async () => {
  await reset();
  const before = errors.length;
  const r = await ev(() => {
    const off = ['weather', 'family.pets', 'biz', 'trips', 'events.story', 'jobs.ladder', 'money.inflation', 'health.events', 'ui.plan', 'out.extras', 'skills', 'help.inline'];
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify(Object.fromEntries(off.map(k => [k, false]))));
    newGame('Long', 'two', 0, { diff: 'hard', unlock: 'all' });
    const out = { marked: S.flagsEdited, offs: off.filter(k => !on(k)).length, weeks: 0 };
    S.jobId = S.jobId || (JOBS.find(j => !j.edu) || JOBS[0]).id;
    for (let i = 0; i < 26 && !S.over; i++) {
      const res = weekTick(true); out.weeks++;
      S.pendingEv = null; closeSheet();
      for (const tb of ['home', 'jobs', 'life', 'log']) { tab = tb; render(); }
      if (res && res.ending) break;
    }
    out.over = !!S.over; out.wx = !!document.querySelector('#wxcard');
    return out;
  });
  assert(r.marked && r.offs === 12, JSON.stringify(r));
  assert(r.weeks === 26, `played ${r.weeks} weeks`);
  assert(errors.length === before, errors.slice(before, before + 3).join(' | '));
  await reset();
});

await t.check('Settings shows a Developer button only after the panel was opened once; it opens the flags and Back returns to Settings', async () => {
  await reset();
  const r = await ev(() => {
    localStorage.removeItem('burg-dev'); closeSheet();
    settingsSheet(true); const before = !!document.querySelector('#devbtn');
    ownerPanel(); closeSheet();
    settingsSheet(true); const btn = document.querySelector('#devbtn'), after = !!btn;
    btn.click(); const title = document.querySelector('#sheet h2').textContent, flags = /Feature flags/.test(document.querySelector('#sheet').textContent),
      back = document.querySelector('#ownclose').textContent;
    document.querySelector('#ownclose').click();
    const home = document.querySelector('#sheet h2').textContent;
    return { before, after, title, flags, back, home };
  });
  assert(!r.before && r.after, JSON.stringify(r));
  assert(/Developer/.test(r.title) && r.flags && /Back to Settings/.test(r.back) && /Settings/.test(r.home), JSON.stringify(r));
  await reset();
});

await t.check('no page errors', async () => { assert(!errors.length, errors.slice(0, 3).join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll owner panel checks passed');
