// Exploratory tests: every start/mode/challenge to the end, legacy generations, old saves, backups, monkey taps.
// Run with: npm run test:explore
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';
const srv = await serve(); const browser = await launch(); const t = runner();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(31337));
const page = await ctx.newPage(); const errors = [];
page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(srv.url, { waitUntil: 'load' });
const ev = (fn, a) => page.evaluate(fn, a);

await t.check('every start × mode × length plays to the end with sane numbers', async () => {
  const r = await ev(() => { const bad = []; window.__render = render; window.__toast = toast; render = () => {}; toast = () => {};   // just the rules (put back for the monkey)
    for (const bg of Object.keys(BACKGROUNDS)) for (const md of Object.keys(MODES)) for (const len of ['half', 'two', 'five']) {
      localStorage.clear(); newGame('E', len, 0, { bg, mode: md }); let end = null, w = 0;
      while (!end && w < 400) { const opts = Object.keys(FOCUS).filter(k => !(FOCUS[k].needsJob && !job()) && !(FOCUS[k].study && S.edu >= 3)); S.focus = opts[w % opts.length];
        if (!S.jobId && w % 3 === 0) apply(JOBS.filter(j => j.edu <= S.edu)[w % 5].id);
        if (w % 9 === 0) { const town = ['dayton','wallawalla','pasco','kennewick','richland'][w % 5]; planTrip(town, townStops(town).filter(s => !stopBlocked(s)).slice(0, 2).map(s => s.id)); }
        if (w === 30 && S.money > 3000) startBiz('shop');
        const res = weekTick(false); w++; if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); ch[w % ch.length].go(); } end = res.ending;
        for (const k of ['happy','health','community']) if (!(S[k] >= 0 && S[k] <= 100)) bad.push(`${bg}/${md}/${len} ${k}=${S[k]}`);
        for (const k of ['money','equity','carValue','k401']) if (!Number.isFinite(S[k])) bad.push(`${bg}/${md}/${len} ${k}=${S[k]}`);
        if (bad.length) return bad; }
      if (!end) bad.push(`${bg}/${md}/${len} never ended`);
      const sc = lifeScore(); if (!(sc.score >= 0 && sc.score <= 100)) bad.push(`${bg}/${md}/${len} score ${sc.score}`); }
    return bad; });
  assert(!r.length, r.slice(0, 5).join('; '));
});

await t.check('every challenge plays to the end and is judged', async () => {
  const r = await ev(() => { const out = {};
    for (const id of Object.keys(SCENARIOS)) { localStorage.clear(); const sc = SCENARIOS[id]; newGame('C', sc.len, 0, { bg: sc.bg, scenario: id }); let end = null, w = 0;
      while (!end && w < 300) { S.focus = ['work','community','study','rest'][w % 4]; if (!job() || S.focus === 'work' && !job()) S.focus = 'rest'; if (!S.jobId) apply('farmhand');
        const res = weekTick(false); w++; if (res.ev) res.ev.choices().filter(c => !c.if || c.if())[0].go(); end = res.ending; }
      finish(end || 'x'); out[id] = { ended: !!end, won: !!(S.scWon || sc.win()) }; closeSheet(); }
    return out; });
  assert(Object.values(r).every(x => x.ended), JSON.stringify(r));
  console.log('     challenge results:', JSON.stringify(r));
});

await t.check('legacy runs three generations in a row', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('Ann Lee', 'life', 0); S.noEvents = true; const gens = [];
    for (let g = 0; g < 3; g++) { S.kids = [S.ageMonths - 20 * 12]; S.money = 200000 + g * 50000; S.date += 30 * 365 * 864e5; S.col *= 2; finish('end');
      document.querySelector('#legacy').click(); document.querySelector('#heirgo').click(); gens.push({ name: S.name, gen: S.gen, money: Math.round(S.money), year: new Date(S.date).getFullYear() }); S.noEvents = true; for (let i = 0; i < 5; i++) weekTick(false); }
    return gens; });
  assert(r.length === 3 && r[2].gen === 4 && r.every(g => g.money > 0) && r[2].year > r[0].year, JSON.stringify(r));
  assert(r.map(g => g.name).join() === 'Ann Lee II,Ann Lee III,Ann Lee IV', `heir names ${r.map(g => g.name)}`);
  console.log('     generations:', JSON.stringify(r));
});

await t.check('a 0.1.0-era save (no new fields) loads and plays', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('Old', 'two', 0); const g = JSON.parse(JSON.stringify(S));
    for (const k of ['trip','svc','tires','stockUntil','dentist','stopLast','tabsYear','carpool','hustleWeeks','scoreQ','bg','mode','sloanLeft','sloanPay','sgoal','seasonWins','badges','goals','chains','towns','storiesDone','scenario','scWon','paidOff','skills','biz','weekly','rng','gen']) delete g[k];
    store.set(SLOTS_KEY, [g, null, null, null, null]); S = null; loadSlot(0); S.jobId = 'farmhand'; for (let i = 0; i < 30; i++) weekTick(false); tab = 'life'; render(); tab = 'home'; render();
    return { turn: S.turn, mode: S.mode, money: Number.isFinite(S.money), score: lifeScore().score }; });
  assert(r.turn === 30 && r.mode === 'normal' && r.money, JSON.stringify(r));
});

await t.check('backups carry badges, skills, a business and weekly dice', async () => {
  const r = await ev(async () => { localStorage.clear(); newGame('B', 'half', 0, { weekly: '2026-W47' }); S.skills = { handy: 30 }; S.money = 9000; startBiz('shop'); S.badges = { job: 1 }; save();
const bk = await readBackup(JSON.stringify(backupData())); localStorage.clear(); restoreBackup(bk, 'replace'); loadSlot(0);
    return { skills: S.skills, biz: S.biz && S.biz.type, badges: S.badges, rng: S.rng !== null, weekly: S.weekly }; }).catch(e => ({ err: String(e) }));
  assert(r.biz === 'shop' && r.skills.handy === 30 && r.badges.job && r.rng && r.weekly, JSON.stringify(r));
});

await t.check('monkey: 600 random taps across every screen cause no errors', async () => {
  await ev(() => { render = window.__render; toast = window.__toast; closeSheet(); localStorage.clear(); S = null; render(); });
  await page.fill('#nm', 'Monkey'); await page.click('#start');
  // each tap picks a visible, enabled control inside the page (one round trip per tap keeps this quick);
  // skips anything that deletes, replaces, quits or restores
  let taps = 0;
  for (let i = 0; i < 600; i++) {
    const did = await page.evaluate(i => {
      const els = [...document.querySelectorAll('button:not([disabled]), [role=button], .mpin')]
        .filter(e => (e.offsetParent !== null || e.closest('svg')) && !/Delete|🗑|Replace|Quit my job|restore|Restore|Back up/i.test(e.textContent || ''));
      if (!els.length) return false;
      const e = els[Math.floor(Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 * els.length)];
      e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return true;
    }, i).catch(() => true);
    if (!did) break;
    taps++;
  }
  console.log(`     ${taps} taps, ${await ev(() => S ? `${S.name} in week ${S.turn}` : "on the title screen")}`);
  assert(!errors.length, errors.slice(0, 3).join(' | '));
});

await t.check('H1: damaged saves and thin backups never blank the game', async () => {
  const base = await ev(() => { closeSheet(); localStorage.clear(); newGame('Base', 'two', 0); S.jobId = 'farmhand'; S.turn = 4; const g = JSON.parse(JSON.stringify(S)); S = null; localStorage.clear(); return g; });
  const life = (o, drop = []) => { const g = { ...base, ...o }; for (const k of drop) delete g[k]; return g; };
  const half = Object.fromEntries(Object.entries(base).filter((_, i) => i % 2 === 0));
  const cases = {
    'a number slot': [5, life({ name: 'Num' })],
    'a null slot and a string slot': [null, 'hello', life({ name: 'Ok' })],
    'slots is not a list': 'oops',
    'half a life': [{ ...half, name: 'Half' }],
    'just a name': [{ name: 'Bare' }],
    'unknown home': [life({ home: 'castle' })],
    'unknown car': [life({ car: 'spaceship' })],
    'unknown job': [life({ jobId: 'astronaut' })],
    'mode nope': [life({ mode: 'nope', bg: 'nope', focus: 'nope', scenario: 'nope' })],
    'bad date and length': [life({ date: 'yesterday', len: 'forever', ageMonths: null })],
    'bad lists and numbers': [life({ log: 'x', kids: null, skills: 5, goals: 7, money: 'lots', health: null, out: 3, biz: { type: 'moon' } })],
    'an old single save that is a number': null
  };
  const bad = [];
  for (const [name, slotsVal] of Object.entries(cases)) {
    const before = errors.length;
    await ev(([v, old]) => { localStorage.clear(); if (v !== null) localStorage.setItem(SLOTS_KEY, JSON.stringify(v)); if (old) localStorage.setItem(SAVE_KEY, '42'); }, [slotsVal, name.includes('old single')]);
    await page.reload({ waitUntil: 'load' });
    await ev(() => closeSheet());
    if (!(await page.$('#start'))) { bad.push(`${name}: no title screen`); continue; }
    for (const b of await page.$$eval('[data-cont]', els => els.map(e => e.dataset.cont))) {
      await page.click(`[data-cont="${b}"]`);
      if (!(await page.$('#end'))) { bad.push(`${name}: Continue did not open the life`); continue; }
      for (const tb of ['jobs', 'life', 'log', 'home']) await page.click(`nav [data-tab="${tb}"]`);
      await page.click('nav [data-tab="menu"]'); await page.click('#sheet #title');
    }
    if (errors.length > before) bad.push(`${name}: ${errors.slice(before).join(' | ')}`);
  }
  // a thin backup: lives missing fields and an export date that doesn't parse
  const before = errors.length;
  await ev(() => { localStorage.clear(); closeSheet(); S = null; renderTitle(); });
  await page.click('#restore');
  await page.fill('#rscode', JSON.stringify({ app: 'theburg', slots: [{ name: 'Thin' }, 3, { name: 'Thinner', len: 'half', home: 'igloo' }], exported: 'not a date' }));
  await page.click('#rscheck');
  await page.waitForSelector('#rsadd');
  const shown = await page.textContent('#rsout');
  if (/Invalid Date|NaN|undefined/.test(shown)) bad.push(`backup sheet shows: ${shown.slice(0, 120)}`);
  await page.click('#rsadd');
  await ev(() => { closeSheet(); S = null; renderTitle(); });
  for (const b of await page.$$eval('[data-cont]', els => els.map(e => e.dataset.cont))) {
    await page.click(`[data-cont="${b}"]`);
    for (const tb of ['jobs', 'life', 'log', 'home']) await page.click(`nav [data-tab="${tb}"]`);
    await page.click('#end'); await ev(() => { closeSheet(); S = null; renderTitle(); });
  }
  if ((await page.$$('[data-cont]')).length !== 2) bad.push('the thin backup did not restore 2 lives');
  if (errors.length > before) bad.push(`backup: ${errors.slice(before).join(' | ')}`);
  assert(!bad.length, bad.slice(0, 4).join('; '));
});

await t.check('no page errors overall', async () => { assert(!errors.length, errors.slice(0, 3).join(' | ')); });
await browser.close(); srv.close();
if (t.failed) { console.log(`${t.failed} exploratory check(s) failed`); process.exit(1); }
console.log('All exploratory checks passed');
