// Offline and updates: the app installs its offline cache, a life can be played and continued with no network,
// and a new version replaces the old one (new cache, old cache removed) without losing saved lives or best scores.
// Serves a temporary copy of the site so the test can publish a "new version" mid-test.
// Run with: npm run test:offline
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { serve, launch, runner, assert, SITE_DIR } from './helpers.mjs';

const FILES = ['index.html', 'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'theburg-offline-'));
for (const f of FILES) fs.copyFileSync(path.join(SITE_DIR, f), path.join(dir, f));
const oldVersion = fs.readFileSync(path.join(dir, 'sw.js'), 'utf8').match(/const VERSION = CACHE_PREFIX \+ '([^']+)'/)[1];

const srv = await serve(dir);
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
const t = runner();
const open = '#modal:not(.hidden)';
const ready = () => page.evaluate(() => Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise(r => setTimeout(() => r(false), 10000))]));
const cacheNames = () => page.evaluate(() => caches.keys());

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('the service worker installs and caches the whole app', async () => {
  assert(await ready(), 'no service worker');
  const names = await cacheNames();
  assert(names.includes('theburg-' + oldVersion), `cache names: ${names}`);
  const cached = await page.evaluate(async n => (await (await caches.open(n)).keys()).map(r => new URL(r.url).pathname), 'theburg-' + oldVersion);
  for (const f of ['/', '/index.html', '/sw.js'.replace('/sw.js', '/manifest.webmanifest'), '/icon-192.png']) assert(cached.includes(f), `${f} not cached (${cached.join(', ')})`);
});

await t.check('after a reload the service worker controls the page', async () => {
  await page.reload({ waitUntil: 'load' });
  assert(await page.evaluate(() => !!navigator.serviceWorker.controller), 'page not controlled');
});

await t.check('a life started online can be continued and played offline', async () => {
  await page.fill('#nm', 'Offline');
  await page.click('[data-len=two]');
  await page.click('#start');
  await page.evaluate(() => { S.noEvents = true; S.jobId = 'farmhand'; tab = 'home'; save(); render(); });
  await page.click('#end');
  const turn = await page.evaluate(() => S.turn);
  await ctx.setOffline(true);
  try {
    await page.reload({ waitUntil: 'load' });
    await page.click('[data-cont="0"]');
    assert((await page.evaluate(() => S.turn)) === turn, 'saved week not restored offline');
    await page.click('#end');
    for (let i = 0; i < 4; i++) { const b = await page.$(`${open} #ok, ${open} [data-i]`); if (!b) break; await b.click(); }
    assert((await page.evaluate(() => S.turn)) === turn + 1, 'could not play a week offline');
    await page.click('[data-tab=jobs]'); await page.click('[data-tab=life]'); await page.click('#helpbtn');
    await page.waitForSelector('#helpview:not(.hidden) .guide');
    await page.click('#helpclose');
  } finally { await ctx.setOffline(false); }
});

await t.check('a new version replaces the old one: new cache, old cache gone, saves and best scores kept', async () => {
  await page.evaluate(() => { save(); store.set(BEST_KEY, { two: 77 }); });
  const before = await page.evaluate(() => JSON.stringify(slots().map(g => g && { name: g.name, turn: g.turn })));
  // publish "9.9.9": a changed service worker (new cache name) and a changed page
  const NEW = '9.9.9';
  fs.writeFileSync(path.join(dir, 'sw.js'), fs.readFileSync(path.join(dir, 'sw.js'), 'utf8').replace(`const VERSION = CACHE_PREFIX + '${oldVersion}'`, `const VERSION = CACHE_PREFIX + '${NEW}'`));
  fs.writeFileSync(path.join(dir, 'index.html'), fs.readFileSync(path.join(dir, 'index.html'), 'utf8').replace(/const APP_VERSION = '[^']*'/, `const APP_VERSION = '${NEW}'`));
  await page.reload({ waitUntil: 'load' });                      // the old cached page loads; the browser finds the new worker
  let names = [];
  for (let i = 0; i < 40; i++) { names = await cacheNames(); if (names.includes('theburg-' + NEW) && !names.includes('theburg-' + oldVersion)) break; await page.waitForTimeout(250); }
  assert(names.includes('theburg-' + NEW), `new cache missing: ${names}`);
  assert(!names.includes('theburg-' + oldVersion), `old cache not removed: ${names}`);
  await page.reload({ waitUntil: 'load' });                      // now the new page comes from the new cache
  let shown = '';
  for (let i = 0; i < 3 && !shown.includes(NEW); i++) { shown = await page.evaluate(() => APP_VERSION); if (!shown.includes(NEW)) await page.reload({ waitUntil: 'load' }); }
  assert(shown === NEW, `still running ${shown}`);
  assert((await page.textContent('.title')).includes('v' + NEW), 'title screen does not show the new version');
  const after = await page.evaluate(() => JSON.stringify(slots().map(g => g && { name: g.name, turn: g.turn })));
  assert(after === before, `saves changed in the update: ${before} → ${after}`);
  assert((await page.evaluate(() => store.get(BEST_KEY).two)) === 77, 'best score lost');
});

await t.check('the new version also works offline', async () => {
  await ctx.setOffline(true);
  try {
    await page.reload({ waitUntil: 'load' });
    assert((await page.evaluate(() => APP_VERSION)) === '9.9.9', 'offline page is not the new version');
    await page.click('[data-cont="0"]');
    await page.waitForSelector('#end');
  } finally { await ctx.setOffline(false); }
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
fs.rmSync(dir, { recursive: true, force: true });
if (t.failed) { console.log(`${t.failed} offline check(s) failed`); process.exit(1); }
console.log('All offline checks passed');
