// Real saves from every tagged version (i56-b23): checks out each git tag v0.1.0-beta.1 … v0.2.x into a temp folder,
// plays a seeded 30-week life there and writes every theburg.* storage key to tests/fixtures/saves/<tag>.json.
// tests/rules.test.mjs loads each fixture into the current game, continues the life, plays 52 weeks and opens every tab.
// Run from the repo root after a release is tagged: node tools/save-fixtures.mjs   (one tag: node tools/save-fixtures.mjs v0.2.0)
// Existing fixtures are kept unless you pass --force: a fixture is a real old save, so it shouldn't change.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { serve, launch, seedScript } from '../tests/helpers.mjs';

const OUT = 'tests/fixtures/saves';
const force = process.argv.includes('--force');
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
const tags = execFileSync('git', ['tag', '--list', 'v*'], { encoding: 'utf8' }).split('\n').filter(Boolean)
  .filter(t => /^v0\.(1|2)\.\d+(-beta\.\d+)?$/.test(t) && (!only.length || only.includes(t)));
fs.mkdirSync(OUT, { recursive: true });
const browser = await launch();
for (const tag of tags) {
  const file = path.join(OUT, `${tag}.json`);
  if (fs.existsSync(file) && !force) { console.log(`keep  ${tag} (already saved)`); continue; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'theburg-tag-'));
  execFileSync('sh', ['-c', `git archive ${tag} | tar -x -C "${dir}"`]);
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'release.json'), 'utf8'));
  const srv = await serve(path.resolve(dir, cfg.app || cfg.site || '.'));
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  await ctx.addInitScript(seedScript(3030));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(srv.url, { waitUntil: 'load' });
  const r = await page.evaluate(tag => {
    // the same seeded 30-week life in every version: a farm hand who works, shows up for town and rests in turn
    newGame(`Saved in ${tag}`, 'five', 0);
    if (typeof render === 'function') render = () => {};
    if (JOBS.some(j => j.id === 'farmhand')) S.jobId = 'farmhand';
    let weeks = 0;
    for (; weeks < 30; weeks++) {
      const f = ['work', 'community', 'rest'][weeks % 3]; if (FOCUS[f]) S.focus = f;
      const res = weekTick(false);
      if (res && res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch.length) ch[0].go(); }
      if (res && res.ending) break;
    }
    save();
    const keys = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^theburg/.test(k)) keys[k] = localStorage.getItem(k); }
    return { weeks, keys };
  }, tag);
  await ctx.close(); srv.close(); fs.rmSync(dir, { recursive: true, force: true });
  if (errors.length || !Object.keys(r.keys).length) { console.log(`FAIL  ${tag}: ${errors[0] || 'nothing saved'}`); process.exitCode = 1; continue; }
  fs.writeFileSync(file, JSON.stringify({ tag, weeks: r.weeks, made: 'tools/save-fixtures.mjs', storage: r.keys }, null, 1) + '\n');
  console.log(`saved ${tag}: ${r.weeks} weeks, keys ${Object.keys(r.keys).join(', ')}`);
}
await browser.close();
