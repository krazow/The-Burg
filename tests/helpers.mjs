// Shared test helpers: serve the site from release.json, open a phone-sized page, and make the game's
// dice repeatable (seeded Math.random) so a failing test fails the same way every time.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const cfg = JSON.parse(fs.readFileSync('release.json', 'utf8'));
const SITE = path.resolve(cfg.site || '.');
const APP = path.relative(SITE, path.resolve(cfg.app || cfg.site || '.')).split(path.sep).join('/');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

export async function serve() {
  const server = http.createServer((req, res) => {
    let f = path.join(SITE, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) return res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}/${APP && APP !== '.' ? APP + '/' : ''}`;
  return { url, close: () => server.close() };
}

// CHROME_PATH lets a machine without Playwright's own browser use an installed Chrome.
export const launch = () => chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// A seeded random number generator (mulberry32), installed before the game's script runs.
export const seedScript = seed => `(() => { let a = ${seed >>> 0};
  Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();`;

export function runner() {
  let failed = 0;
  return {
    async check(name, fn) {
      try { await fn(); console.log('ok   ' + name); }
      catch (e) { failed++; console.log('FAIL ' + name + ': ' + (e && e.message || e)); }
    },
    get failed() { return failed; }
  };
}

export const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
