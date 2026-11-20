// Difficulty modes stage 3b (to-do list 2, D7): records per difficulty (plus Classic for older lives), net-worth
// targets per difficulty, and a score with no aim or report-card parts in Easy.
// Run with: npm run test:difficulty-score
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
const reset = () => ev(() => { S = null; closeSheet(); render(); });

await t.check('a finished life goes on its difficulty\'s shelf: best score, top lives, end screen and share text', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Rec' + d, 'half', 0, { diff: d }); S.noEvents = true; S.happy = 80;
      const share = shareText(); finish('Six months in the Burg is in the books.');
      out[d] = { end: document.querySelector('#sheet').textContent, share, story: (document.querySelector('#sheet .storydiff') || {}).textContent || '' }; closeSheet();
    }
    newGame('Cu', 'half', 0, { diff: 'easy', rules: { start: 'comfy' } }); S.noEvents = true; finish('Done.'); closeSheet();
    const best = store.get(BEST_KEY), list = ends();
    S = null; renderTitle(); challengesSheet(); const sh = document.querySelector('#sheet');
    const head = [...sh.querySelectorAll('table.rec thead th')].map(x => x.textContent.trim());
    const row = [...sh.querySelectorAll('table.rec')][0].querySelector('tbody tr').textContent;
    const shelves = [...sh.querySelectorAll('table.rec[data-shelf]')].map(x => x.dataset.shelf);
    const txt = sh.textContent; closeSheet();
    return { out, best, shelves: list.map(endShelf), head, row, tables: shelves, txt };
  });
  assert(['easy.half', 'normal.half', 'hard.half', 'cu-easy.half'].every(k => Number.isFinite(r.best[k])) && !('half' in r.best), JSON.stringify(r.best));
  assert(r.shelves.slice(0, 4).join() === 'easy,hard,normal,easy' && r.tables.join() === 'easy,normal,hard', `${r.shelves} ${r.tables}`);
  assert(/Easy/.test(r.head.join()) && /Normal/.test(r.head.join()) && /Hard/.test(r.head.join()) && !/Relaxed/.test(r.head.join()), r.head.join());
  assert(/Custom rules/.test(r.txt) && /🌱 Easy · 6 Months/.test(r.txt) && !/Classic/.test(r.txt), r.txt.slice(0, 600));
  for (const d of ['easy', 'normal', 'hard']) {
    const lab = { easy: 'Easy', normal: 'Normal', hard: 'Hard' }[d], o = r.out[d];
    assert(new RegExp(`${lab} score`).test(o.end) && new RegExp(`New best \\(${lab}\\)`).test(o.end), `${d} end: ${o.end.slice(0, 400)}`);
    assert(new RegExp(`6-month life on ${lab}`).test(o.share) && new RegExp(`6-month life on ${lab}`).test(o.story), `${d}: ${o.share} | ${o.story}`);
  }
  await reset();
});

await t.check('old records load as Classic: best scores, finished lives, a Classic life\'s ending and a restored backup', async () => {
  const r = await ev(async () => {
    localStorage.clear();
    store.set(BEST_KEY, { two: 66, 'half-relaxed': 48, 'sc-farm': 80, 'cu-five': 51 });
    store.set(ENDS_KEY, [{ name: 'Old', score: 70, title: 'Pillar of the Community', len: 'two', mode: 'relaxed', at: 1 }]);
    migrateRecords();
    const stub = ends()[0], labels = ['two', 'half-relaxed', 'sc-farm', 'cu-five'].map(bestLabel);
    challengesSheet(); const sh = document.querySelector('#sheet'), txt = sh.textContent;
    const tables = [...sh.querySelectorAll('table.rec[data-shelf]')].map(x => x.dataset.shelf);
    const cell = [...sh.querySelectorAll('table.rec')][0].textContent;
    sh.querySelector('[data-end="0"]').click(); const summary = document.querySelector('#sheet').textContent; closeSheet();
    // a life saved before difficulty modes (no S.diff) finishes onto the Classic shelf under its old key
    newGame('Cl', 'half', 0, { classic: true, mode: 'hard' }); S.noEvents = true; finish('Done.'); const end = document.querySelector('#sheet').textContent; closeSheet();
    const after = store.get(BEST_KEY);
    // a backup from before difficulty modes: its finished lives come in as Classic too
    const bk = { app: 'theburg', kind: 'backup', v: BACKUP_V, minReader: 1, slots: [], best: { five: 77 }, badges: {}, challenges: {}, ends: [{ name: 'Older', score: 60, len: 'five', mode: 'normal', at: 2 }] };
    localStorage.clear(); restoreBackup(await readBackup(JSON.stringify(bk)), 'add');
    return { stub, labels, txt, tables, cell, summary, end, after, restored: ends().map(e => [e.name, endShelf(e), !!e.classic]), rBest: bestLabel(Object.keys(store.get(BEST_KEY))[0]) };
  });
  assert(r.stub.classic === true && r.labels.every(l => /Classic/.test(l)), JSON.stringify(r.labels));
  assert(/🏛️ Classic/.test(r.txt) && /2 Years/.test(r.txt) && /6 Months \(Relaxed\)/.test(r.txt) && r.tables.join() === 'classic', r.txt.slice(0, 600));
  assert(!/66/.test(r.cell), `a Classic best should not sit in the Easy/Normal/Hard table: ${r.cell}`);
  assert(/Classic \(Relaxed\)/.test(r.summary), r.summary.slice(0, 300));
  assert(Number.isFinite(r.after['half-hard']) && /Classic \(Hard\) score/.test(r.end) && /Classic score/.test(r.end), JSON.stringify(r.after) + r.end.slice(0, 300));
  assert(JSON.stringify(r.restored) === '[["Older","classic",true]]' && /Classic · 5 Years/.test(r.rBest), JSON.stringify(r));
  await reset();
});

await t.check('net-worth targets differ per difficulty (Easy lower for short games, no Easy Lifetime); Classic keeps the old ones', async () => {
  const r = await ev(() => {
    const out = {};
    for (const len of ['half', 'two', 'five']) out[len] = DIFF_LIST.map(d => lenTarget(len, d));
    newGame('T', 'two', 0, { diff: 'easy' }); const easyNow = lenTarget(); S.money = 80000; const sc = scoreSnap();
    newGame('T', 'two', 0, { classic: true }); const classic = lenTarget();
    return { out, easyNow, wealth: Math.round(sc.wealth), classic, life: lenTarget('life', 'easy') };
  });
  for (const len of ['half', 'two', 'five']) {
    const [e, n, h] = r.out[len];
    assert(e !== n && n === h, `${len}: ${r.out[len]}`);
  }
  assert(r.out.half[0] < r.out.half[1] && r.out.two[0] < r.out.two[1], JSON.stringify(r.out));
  assert(r.easyNow === r.out.two[0] && r.classic === r.out.two[2] && r.life === 4000000, JSON.stringify(r));
  await reset();
});

await t.check('Easy\'s score has no aim or report-card parts; Normal and Hard keep them', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      newGame('S', 'two', 0, { diff: d, aim: 'roots' }); S.noEvents = true;
      for (let i = 0; i < 27; i++) weekTick(false);
      const sc = lifeScore(); showScoreNow(); const now = document.querySelector('#sheet').textContent; closeSheet();
      finish('Done.'); const end = document.querySelector('#sheet').textContent; closeSheet();
      out[d] = { aimW: sc.w.aim, cards: sc.cards, cardAvg: sc.cardAvg, now, end, help: guideHTML(), term: GLOSSARY.lifescore.d() };
    }
    return out;
  });
  const e = r.easy;
  assert(e.aimW === 0 && e.cards === 0 && e.cardAvg == null, JSON.stringify({ aimW: e.aimW, cards: e.cards }));
  for (const [where, txt] of [['now', e.now], ['end', e.end]]) assert(!/Report-card|report card|aim:|Played for|Your aims|🧭/.test(txt), `easy ${where}: ${txt.slice(0, 500)}`);
  assert(!/Report cards count|Life aims:|report card goes in|debt drag/.test(e.help) && /No report cards on Easy/.test(e.help), 'Easy help still shows aims or report cards');
  assert(!/report cards|life aim/.test(e.term), e.term);
  for (const d of ['normal', 'hard']) {
    const o = r[d];
    assert(o.aimW > 0 && o.cards >= 2 && /Report-card average/.test(o.now) && /aim:/.test(o.now) && /Played for/.test(o.end), `${d}: ${o.now.slice(0, 300)}`);
    assert(/Report cards count/.test(o.help) && /Life aims:/.test(o.help), `${d} help`);
  }
  await reset();
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll difficulty score checks passed');
