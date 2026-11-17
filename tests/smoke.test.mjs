// Smoke test (from the release kit's template): the app opens cleanly, installs its service worker,
// and still opens offline. Run with: npm run test:smoke
import { serve, launch, runner } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
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

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} smoke check(s) failed`); process.exit(1); }
console.log('All smoke checks passed');
