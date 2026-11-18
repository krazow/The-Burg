// Screens and accessibility: every main screen at seven sizes (small phone to desktop, plus landscape).
// Fails on: content wider than the screen, bars that overlap or fall off-screen, buttons without a name, tap
// targets under 24 × 24 px (WCAG 2.2 AA), text under 11 px, and text contrast below WCAG AA (4.5:1, or 3:1 for
// large text). Reports targets under 44 × 44 px (the comfortable size) without failing.
// Screenshots go to test-results/screens/. Run with: npm run test:screens
import fs from 'node:fs';
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const SIZES = [
  ['small-phone', 320, 568], ['phone', 375, 667], ['big-phone', 430, 932], ['tall-phone', 390, 844],
  ['landscape', 844, 390], ['tablet', 768, 1024], ['desktop', 1280, 800]
];
const srv = await serve();
const browser = await launch();
const t = runner();
fs.mkdirSync('test-results/screens', { recursive: true });
const report = [];

// runs inside the page: checks the screen as it is right now
const audit = () => {
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const covered = el => { const r = el.getBoundingClientRect(); const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const top = document.elementFromPoint(x, y); return top && !el.contains(top) && !top.contains(el); };
  const out = { overflow: document.documentElement.scrollWidth - innerWidth, unnamed: [], tiny: [], small: [], smallText: [], contrast: [], bars: [] };
  const name = el => (el.getAttribute('aria-label') || el.textContent || '').trim();
  for (const el of document.querySelectorAll('button, [role=button], a[href], input')) {
    if (!vis(el) || covered(el)) continue;
    const r = el.getBoundingClientRect(), n = name(el) || el.placeholder || '';
    if (!n && el.tagName !== 'INPUT') out.unnamed.push(el.outerHTML.slice(0, 60));
    if (r.width < 24 || r.height < 24) out.tiny.push(`${n.slice(0, 20)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    else if (r.width < 44 || r.height < 44) out.small.push(n.slice(0, 20));
  }
  // text: size and contrast against the first solid background behind it
  const rgba = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number).concat(m.length === 3 ? [1] : []) : [0,0,0,0]; };
  const lum = ([r,g,b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
  const blend = (fg, bg) => [0,1,2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
  const bgOf = el => { let layers = []; for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
    let bg = [255,255,255]; for (const c of layers.reverse()) bg = blend(c, bg); return bg; };
  const opac = el => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode, el = node.parentElement;
    if (!el || seen.has(el) || !node.textContent.trim() || /^[\p{Emoji}\s·›✕↑]+$/u.test(node.textContent.trim())) continue;
    seen.add(el);
    if (!vis(el) || el.closest('svg, .cdim') || covered(el)) continue;
    if (el.closest('button[disabled], [aria-hidden=true]')) continue;              // inactive controls are exempt
    const cs = getComputedStyle(el), px = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
    if (px < 11) out.smallText.push(`${node.textContent.trim().slice(0, 24)} (${px}px)`);
    const fg = rgba(cs.color); fg[3] *= opac(el);
    const bg = bgOf(el), f = blend(fg, bg);
    const L1 = lum(f), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const need = px >= 24 || (bold && px >= 18.66) ? 3 : 4.5;
    if (ratio < need) out.contrast.push(`"${node.textContent.trim().slice(0, 24)}" ${ratio.toFixed(2)}:1 (needs ${need})`);
  }
  // fixed bars: inside the screen and not on top of each other
  const bars = ['.endbar', '#strip', '#app > nav'].map(s => document.querySelector(s)).filter(e => e && vis(e)).map(e => [e, e.getBoundingClientRect()]);
  for (const [e, r] of bars) if (r.bottom > innerHeight + 1 || r.top < 0) out.bars.push(`${e.className || e.tagName} off-screen`);
  for (let i = 0; i < bars.length; i++) for (let j = i + 1; j < bars.length; j++) {
    const a = bars[i][1], b = bars[j][1];
    if (a.left < b.right && b.left < a.right && a.top < b.bottom - 1 && b.top < a.bottom - 1) out.bars.push(`${bars[i][0].className || bars[i][0].tagName} overlaps ${bars[j][0].className || bars[j][0].tagName}`);
  }
  return out;
};

const problems = { overflow: [], unnamed: [], tiny: [], smallText: [], contrast: [], bars: [] };
let smallTargets = 0;
for (const [label, w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block', hasTouch: w < 900, isMobile: w < 900 });
  await ctx.addInitScript(seedScript(77));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(srv.url, { waitUntil: 'load' });
  const screens = [
    ['title', async () => {}],
    ['help', async () => { await page.click('#how'); }],
    ['home', async () => { await page.evaluate(() => { closeHelp(); localStorage.clear(); setPref('tips', ['focus','strip','tabs']); newGame('Screens', 'two', 0); S.noEvents = true; S.jobId = 'farmhand'; tab = 'home'; render(); }); await page.click('#end'); await page.waitForTimeout(300); }],
    ['jobs', async () => { await page.click('[data-tab=jobs]'); }],
    ['life', async () => { await page.click('[data-tab=life]'); }],
    ['journal', async () => { await page.click('[data-tab=log]'); }],
    ['home-map', async () => { await page.click('[data-tab=home]'); await page.click('#main .maptog button:nth-child(2)'); }],
    ['region-map', async () => { await page.click('.maptabs button:nth-child(2)'); }],
    ['menu', async () => { await page.click('#main .maptog button:nth-child(1)'); await page.click('[data-tab=menu]'); await page.waitForTimeout(300); }],
    ['tutorial', async () => { await page.evaluate(() => { closeSheet(); startTutorial(); }); await page.waitForTimeout(500); await page.click('#cnext'); await page.waitForTimeout(600); }]
  ];
  for (const [screen, go] of screens) {
    await go();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `test-results/screens/${label}-${screen}.png` });
    const a = await page.evaluate(audit);
    const where = `${label} ${w}×${h} / ${screen}`;
    if (a.overflow > 1) problems.overflow.push(`${where}: ${a.overflow}px too wide`);
    for (const k of ['unnamed', 'tiny', 'smallText', 'contrast', 'bars']) for (const x of a[k]) problems[k].push(`${where}: ${x}`);
    smallTargets += a.small.length;
  }
  if (errors.length) problems.unnamed.push(`${label}: page error ${errors[0]}`);
  await page.evaluate(() => endTutorial(false)).catch(() => {});
  await ctx.close();
}
const uniq = a => [...new Set(a.map(x => x.replace(/^[^/]+\/ /, '')))];

await t.check('nothing is wider than the screen at any size', async () => { assert(!problems.overflow.length, problems.overflow.slice(0, 5).join('; ')); });
await t.check('End Week, the week strip and the tab bar stay on-screen and never overlap', async () => { assert(!problems.bars.length, problems.bars.slice(0, 5).join('; ')); });
await t.check('every button has a name a screen reader can say', async () => { assert(!problems.unnamed.length, problems.unnamed.slice(0, 5).join('; ')); });
await t.check('every tap target is at least 24 × 24 px (WCAG 2.2 AA)', async () => { assert(!problems.tiny.length, uniq(problems.tiny).slice(0, 8).join('; ')); });
await t.check('no text smaller than 11 px', async () => { assert(!problems.smallText.length, uniq(problems.smallText).slice(0, 8).join('; ')); });
await t.check('text contrast meets WCAG AA (4.5:1, or 3:1 for large text)', async () => { assert(!problems.contrast.length, uniq(problems.contrast).slice(0, 10).join('; ')); });

const md = `## Screens and accessibility\n\n${SIZES.length} screen sizes × 10 screens. Tap targets under the comfortable 44 × 44 px (counted, not failing): **${smallTargets}** (issue #10).\nScreenshots: \`test-results/screens/\`.\n`;
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} screen check(s) failed`); process.exit(1); }
console.log('All screen checks passed');
