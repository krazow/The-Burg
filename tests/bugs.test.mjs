// Known-bug repros (i56-b03): one small repro per known bug, tagged with its idea id.
// Each repro returns true when the game behaves correctly. While a bug is open (fixed: false) a failing repro only
// prints "open <id>" and never fails the run; once it's fixed, set fixed: true so the repro guards it for good.
// A repro that starts passing while still marked open prints "now passing <id>" as a reminder to flip it.
// Seeded with the round-54 bug hunt (i54-a26). Run with: npm run test:bugs
import { serve, launch, seedScript } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const errors = [];

// a fresh page (own storage), a life with no random events, ready on Home
async function lifePage({ locale, sw = 'block', ctx: shared } = {}) {
  const ctx = shared || await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: sw, ...(locale ? { locale } : {}) });
  if (!shared) await ctx.addInitScript(seedScript(5454));
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(srv.url, { waitUntil: 'load' });
  return { ctx, page };
}
const startLife = (page, extra = {}) => page.evaluate(extra => { newGame('Bug', 'two', 0); S.noEvents = true; Object.assign(S, extra); tab = 'home'; save(); render(); }, extra);

const BUGS = [
  { id: 'i54-a01', title: 'a double tap on End Week plays one week', fixed: true, repro: async () => {
    const { ctx, page } = await lifePage(); await startLife(page, { jobId: 'farmhand' });
    await page.dblclick('#end'); await page.waitForTimeout(600);
    const turn = await page.evaluate(() => S.turn); await ctx.close(); return turn === 1; } },

  { id: 'i54-a03', title: 'money uses US number style on a German phone ($1,500, not $1.500)', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage({ locale: 'de-DE' });
    const r = await page.evaluate(() => [fmt(1500), fmt(1234567)]); await ctx.close(); return r[0] === '$1,500' && r[1] === '$1,234,567'; } },

  { id: 'i54-a04', title: 'closing a sheet puts focus back on the stat card that opened it', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage(); await startLife(page);
    await page.focus('[data-stat="happy"]'); await page.keyboard.press('Enter');
    await page.waitForSelector('#modal:not(.hidden)'); await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    const ok = await page.evaluate(() => !!document.activeElement && document.activeElement.dataset.stat === 'happy'); await ctx.close(); return ok; } },

  { id: 'i54-a08', title: 'loading another life resets the Journal and job filters', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage();
    const r = await page.evaluate(() => { newGame('One', 'two', 0); save(); newGame('Two', 'two', 1); save();
      logFilter = 'trip'; jobCity = 'dayton'; loadSlot(0); return [logFilter, jobCity]; });
    await ctx.close(); return r[0] === 'all' && r[1] === 'all'; } },

  { id: 'i54-a09', title: 'with a Main Street job, the town map still has a pin for Show up for town', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage(); await startLife(page, { jobId: 'barista', edu: 1 });
    const r = await page.evaluate(() => townPlaces().filter(p => p.focus === 'community').length); await ctx.close(); return r > 0; } },

  { id: 'i54-a13', title: 'offline, a link with ?source=pwa still opens the cached game', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage({ sw: 'allow' });
    const ready = await page.evaluate(() => Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise(r => setTimeout(() => r(false), 10000))]));
    if (!ready) { await ctx.close(); throw new Error('no service worker'); }
    await page.reload({ waitUntil: 'load' });
    await ctx.setOffline(true);
    let ok = false;
    try { await page.goto(srv.url + '?source=pwa', { waitUntil: 'load', timeout: 8000 }); ok = await page.evaluate(() => typeof newGame === 'function'); } catch (e) { ok = false; }
    await ctx.setOffline(false); await ctx.close(); return ok; } },

  { id: 'i54-a14', title: 'two open copies of one life don\'t erase each other\'s weeks', fixed: false, repro: async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await ctx.addInitScript(seedScript(5454));
    const a = (await lifePage({ ctx })).page; await startLife(a, { jobId: 'farmhand' });
    const b = (await lifePage({ ctx })).page; await b.evaluate(() => { loadSlot(0); S.noEvents = true; });
    for (let i = 0; i < 3; i++) await b.evaluate(() => { weekTick(false); save(); });
    await a.waitForTimeout(300);
    await a.evaluate(() => { if (S) { S.noEvents = true; weekTick(false); save(); } });
    const saved = await a.evaluate(() => (slots()[0] || {}).turn);
    await ctx.close(); return saved >= 4; } },

  { id: 'i54-a15', title: 'when storage is full, a failed save says so', fixed: false, repro: async () => {
    const { ctx, page } = await lifePage(); await startLife(page, { jobId: 'farmhand' });
    const r = await page.evaluate(() => { const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function(){ throw new DOMException('full', 'QuotaExceededError'); };
      try { weekTick(false); save(); render(); } finally { Storage.prototype.setItem = orig; }
      return document.body.innerText; });
    await ctx.close(); return /couldn.t save|storage is full|not saved/i.test(r); } }
];

let failed = 0, open = 0;
for (const b of BUGS) {
  let ok = false, err = '';
  try { ok = await b.repro(); } catch (e) { err = e && e.message || String(e); }
  if (b.fixed) {
    if (ok) console.log(`ok   ${b.id} ${b.title}`);
    else { failed++; console.log(`FAIL ${b.id} ${b.title} (marked fixed, but the repro fails${err ? ': ' + err : ''})`); }
  } else if (ok) console.log(`now passing ${b.id} ${b.title}: mark it fixed: true`);
  else { open++; console.log(`open ${b.id} ${b.title}${err ? ` (${err})` : ''}`); }
}
const known = errors.filter(e => !/QuotaExceeded|full/.test(e));
if (known.length) { failed++; console.log('FAIL page errors: ' + known.join('; ')); }
await browser.close();
srv.close();
console.log(`${open} open bug(s), ${BUGS.length - open} passing`);
if (failed) { console.log(`${failed} bug check(s) failed`); process.exit(1); }
console.log('All fixed-bug repros pass');
