// Smoke test (from the release kit's template): the app opens cleanly, installs its service worker,
// and still opens offline. Run with: npm run test:smoke
import { serve, launch, runner, SITE_DIR } from './helpers.mjs';
import fs from 'node:fs';
import path from 'node:path';

const srv = await serve();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (/Content Security Policy/i.test(m.text())) errors.push(m.text()); });   // i57-a10
const t = runner();

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('the app opens without errors', async () => { await page.waitForTimeout(1000); if (errors.length) throw new Error(errors.join('; ')); });
await t.check('the page has a title', async () => { if (!(await page.title())) throw new Error('empty <title>'); });
await t.check('the title screen shows the game', async () => { await page.waitForSelector('text=The Burg'); await page.waitForSelector('#start'); });
await t.check('the service worker installs (offline use)', async () => {
  const ok = await page.evaluate(() => Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise(r => setTimeout(() => r(false), 8000))]));
  if (!ok) throw new Error('no active service worker after 8 s');
});
await t.check('it still opens offline', async () => {
  await page.context().setOffline(true);
  try { await page.reload({ waitUntil: 'load' }); await page.waitForSelector('#start', { timeout: 5000 }); }
  finally { await page.context().setOffline(false); }
});

// i57-a10: the release kit's Android wrapper serves the app from https://appassets.androidplatform.net/www/ and adds a
// script (a copy of its DOWNLOAD_SHIM) that saves <a download> files by fetching their blob: address, which the
// page's content security policy must allow (connect-src blob:)
const ANDROID_SHIM = "(function(){if(window.__kitDl)return;window.__kitDl=1;document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[download]');if(!a||!/^(blob|data):/.test(a.href))return;e.preventDefault();e.stopImmediatePropagation();fetch(a.href).then(function(r){return r.blob()}).then(function(b){var f=new FileReader();f.onload=function(){KrazowAndroid.saveFile('dl'+Date.now(),a.getAttribute('download')||'download',b.type||'',String(f.result).split(',')[1]||'')};f.readAsDataURL(b)})},true)})();";
await t.check('i57-a10: in the Android app the page loads and saves a backup file under its security policy', async () => {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const errs = [];
  try {
    await ctx.route('https://appassets.androidplatform.net/**', route => {
      const f = path.join(SITE_DIR, new URL(route.request().url()).pathname.replace(/^\/www\//, ''));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404 });
      route.fulfill({ status: 200, contentType: types[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
    });
    await ctx.addInitScript("window.KrazowAndroid = { saveFile: (id, name, type, b64) => { window.__saved = name + ' ' + b64.length; } };" + ANDROID_SHIM);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('https://appassets.androidplatform.net/www/index.html', { waitUntil: 'load' });
    await p.fill('#nm', 'Droid'); await p.click('#start'); await p.click('#modal:not(.hidden) #jumpin');   // i23-a01: the very first start offers a practice life
    await p.evaluate(() => { tab = 'home'; render(); });
    await p.click('[data-tab=menu]'); await p.click('#backup'); await p.click('#bkfile');
    await p.waitForFunction(() => window.__saved, null, { timeout: 5000 });
    if (!/^the-burg-backup-.*\.json \d+$/.test(await p.evaluate(() => window.__saved))) throw new Error('saved ' + await p.evaluate(() => window.__saved));
    if (errs.length) throw new Error(errs.join('; '));
  } finally { await ctx.close(); }
});

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} smoke check(s) failed`); process.exit(1); }
console.log('All smoke checks passed');
