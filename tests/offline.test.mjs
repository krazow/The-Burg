// Offline and updates: the app installs its offline cache, a life can be played and continued with no network,
// and a new version replaces the old one (new cache, old cache removed) without losing saved lives or best scores.
// Serves a temporary copy of the site so the test can publish a "new version" mid-test.
// Run with: npm run test:offline
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { serve, launch, runner, assert, SITE_DIR } from './helpers.mjs';

const FILES = ['index.html', 'js', 'sw.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'theburg-offline-'));
for (const f of FILES) fs.cpSync(path.join(SITE_DIR, f), path.join(dir, f), { recursive: true });
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
  await page.evaluate(() => setPref('newHere', 1));            // skip the first-start practice offer (i23-a01)
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

// i64-a01: let the Back-button history settle before a reload, and retry once if a page-side navigation cut it off
const settle = () => page.waitForFunction(() => typeof HIST_T === 'undefined' || (!HIST_T && !HIST_SKIP), null, { timeout: 3000 }).catch(() => {});
const reloadSafe = async () => { await settle(); try { await page.reload({ waitUntil: 'load' }); } catch (_) { await page.waitForTimeout(300); await page.reload({ waitUntil: 'load' }); } };

await t.check('i43-b02: a normal launch downloads nothing: every file comes from the cache', async () => {
  const net = [], fromNet = [];
  const onReq = r => { if (r.serviceWorker()) net.push(new URL(r.url()).pathname); };
  const onRes = r => { if (r.url().startsWith(srv.url) && !r.fromServiceWorker()) fromNet.push(new URL(r.url()).pathname); };
  ctx.on('request', onReq); page.on('response', onRes);
  try { await reloadSafe(); await page.waitForTimeout(500); }
  finally { ctx.off('request', onReq); page.off('response', onRes); }
  assert(!net.length, `the service worker went to the network for: ${net.join(', ')}`);
  assert(!fromNet.filter(p => p !== '/sw.js').length, `not from the cache: ${fromNet.join(', ')}`);
});

await t.check('i54-a13: offline, a link with ?something on it still opens the game', async () => {
  await ctx.setOffline(true);
  try {
    await page.goto(srv.url + '?source=home', { waitUntil: 'load' });
    await page.waitForSelector('.title h1');
    await page.goto(srv.url + 'index.html?from=share#x', { waitUntil: 'load' });
    await page.waitForSelector('.title h1');
  } finally { await ctx.setOffline(false); }
  await page.goto(srv.url, { waitUntil: 'load' });
});

await t.check('a new version replaces the old one: new cache, old cache gone, saves and best scores kept', async () => {
  await page.evaluate(() => { save(); store.set(BEST_KEY, { two: 77 }); });
  const before = await page.evaluate(() => JSON.stringify(slots().map(g => g && { name: g.name, turn: g.turn })));
  // publish "9.9.9": a changed service worker (new cache name) and a changed page
  const NEW = '9.9.9';
  fs.writeFileSync(path.join(dir, 'sw.js'), fs.readFileSync(path.join(dir, 'sw.js'), 'utf8').replace(`const VERSION = CACHE_PREFIX + '${oldVersion}'`, `const VERSION = CACHE_PREFIX + '${NEW}'`));
  fs.writeFileSync(path.join(dir, 'js/state.js'), fs.readFileSync(path.join(dir, 'js/state.js'), 'utf8').replace(/const APP_VERSION = '[^']*'/, `const APP_VERSION = '${NEW}'`));
  await reloadSafe();                      // the old cached page loads; the browser finds the new worker
  let names = [];
  for (let i = 0; i < 40; i++) { names = await cacheNames(); if (names.includes('theburg-' + NEW) && !names.includes('theburg-' + oldVersion)) break; await page.waitForTimeout(250); }
  assert(names.includes('theburg-' + NEW), `new cache missing: ${names}`);
  assert(!names.includes('theburg-' + oldVersion), `old cache not removed: ${names}`);
  await reloadSafe();                      // now the new page comes from the new cache
  let shown = '';
  for (let i = 0; i < 3 && !shown.includes(NEW); i++) { shown = await page.evaluate(() => APP_VERSION); if (!shown.includes(NEW)) await reloadSafe(); }
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

await t.check('H3: the beta keeps its lives under its own keys, apart from the live game', async () => {
  const both = fs.mkdtempSync(path.join(os.tmpdir(), 'theburg-beta-'));
  fs.symlinkSync(SITE_DIR, path.join(both, 'beta')); fs.symlinkSync(SITE_DIR, path.join(both, 'live'));
  const s2 = await serve(both), c2 = await browser.newContext({ serviceWorkers: 'block' }), p2 = await c2.newPage();
  p2.on('pageerror', e => errors.push(String(e)));
  try {
    const base = s2.url.replace(/\/$/, '');
    const play = async (where, name) => { await p2.goto(`${base}/${where}/`, { waitUntil: 'load' });
      return p2.evaluate(n => { newGame(n, 'two', 0); save(); setPref('x', n); return { prefix: KEY_PREFIX, slots: SLOTS_KEY, names: slots().map(g => g && g.name) }; }, name); };
    const live = await play('live', 'LiveLife'), beta = await play('beta', 'BetaLife');
    assert(live.prefix === 'theburg.' && live.slots === 'theburg.slots.v1', `live keys changed: ${JSON.stringify(live)}`);
    assert(beta.prefix === 'theburgbeta.' && beta.slots === 'theburgbeta.slots.v1', `beta keys: ${JSON.stringify(beta)}`);
    assert(beta.names.join() === 'BetaLife,,,,', `beta sees: ${beta.names}`);
    await p2.goto(`${base}/live/`, { waitUntil: 'load' });
    const back = await p2.evaluate(() => ({ names: slots().map(g => g && g.name).join(), pref: prefs().x, keys: Object.keys(localStorage).sort() }));
    assert(back.names === 'LiveLife,,,,' && back.pref === 'LiveLife', `live sees: ${JSON.stringify(back)}`);
    assert(back.keys.every(k => k.startsWith('theburg.') || k.startsWith('theburgbeta.')), `stray keys: ${back.keys}`);
  } finally { await c2.close(); s2.close(); fs.rmSync(both, { recursive: true, force: true }); }
});

await t.check('i57-a13: a Wi-Fi login page is never saved as the game', async () => {
  // a server that turns into a captive portal: every address answers 200 with a login page
  let portal = false;
  const files = http.createServer((req, res) => {
    if (portal) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<!doctype html><title>Hotel Wi-Fi</title><h1>Log in to the Wi-Fi</h1>'); }
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };
    let f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) return res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => files.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${files.address().port}/`, c3 = await browser.newContext(), p3 = await c3.newPage();
  p3.on('pageerror', e => errors.push(String(e)));
  try {
    await p3.goto(url, { waitUntil: 'load' });
    await p3.evaluate(() => navigator.serviceWorker.ready);
    await p3.reload({ waitUntil: 'load' });
    portal = true;
    const r = await p3.evaluate(async () => {
      const got = await (await fetch('js/state.js?fresh=1')).text();          // not in the cache: goes to the "network"
      const keys = [];
      for (const n of await caches.keys()) if (n.startsWith('theburg-')) for (const q of await (await caches.open(n)).keys()) keys.push(new URL(q.url).pathname + new URL(q.url).search);
      return { got: got.slice(0, 40), keys };
    });
    assert(/Wi-Fi/.test(r.got), `the portal answered ${r.got}`);
    assert(!r.keys.some(k => k.includes('fresh=1')), `the login page was cached: ${r.keys.join(', ')}`);
    await p3.goto(url + '?source=home', { waitUntil: 'load' });
    assert(await p3.$('.title h1'), 'the cached game did not open behind the portal');
    assert(!(await p3.textContent('body')).includes('Log in to the Wi-Fi'), 'the login page replaced the game');
  } finally { portal = false; await c3.close(); files.close(); }
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
fs.rmSync(dir, { recursive: true, force: true });
if (t.failed) { console.log(`${t.failed} offline check(s) failed`); process.exit(1); }
console.log('All offline checks passed');
