// Screens and accessibility: every main screen at seven sizes (small phone to desktop, plus landscape).
// Fails on: content wider than the screen, bars that overlap or fall off-screen, less than 45% of the screen left
// for content, buttons without a name, tap targets under 44 × 44 px (WCAG 2.5.5), text under 11 px, and text
// contrast below WCAG AA (4.5:1, or 3:1 for large text). Then checks keyboard and screen-reader use.
// i2-a03/a06/a07: a second pass runs every screen with the night theme and the Larger text size on, at the
// smallest phone, sideways and on a tablet, with the same checks (contrast in both themes, overflow at 320 px).
// Screenshots go to test-results/screens/. Run with: npm run test:screens
import fs from 'node:fs';
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const SIZES = [
  ['small-phone', 320, 568], ['phone', 375, 667], ['big-phone', 430, 932], ['tall-phone', 390, 844],
  ['landscape', 844, 390], ['tablet', 768, 1024], ['desktop', 1280, 800],
  ['night-xl-small-phone', 320, 568, true], ['night-xl-landscape', 844, 390, true], ['night-xl-tablet', 768, 1024, true], ['night-xl-desktop', 1280, 800, true]
];
// for a quick look at some sizes: SCREENS_ONLY=night-xl npm run test:screens (matches the size labels)
if (process.env.SCREENS_ONLY) SIZES.splice(0, SIZES.length, ...SIZES.filter(x => x[0].includes(process.env.SCREENS_ONLY)));
const srv = await serve();
const browser = await launch();
const t = runner();
fs.mkdirSync('test-results/screens', { recursive: true });
const report = [];
let SCREEN_COUNT = 0;

// runs inside the page: checks the screen as it is right now
const audit = () => {
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const covered = el => { const r = el.getBoundingClientRect(); const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const top = document.elementFromPoint(x, y); return top && !el.contains(top) && !top.contains(el); };
  const out = { overflow: document.documentElement.scrollWidth - innerWidth, unnamed: [], tiny: [], smallText: [], contrast: [], bars: [], room: 1, leftover: [] };
  for (const m of document.body.innerText.matchAll(/.{0,30}(\$\{|[\w.!?)]\}|undefined|NaN|\[object).{0,10}/g)) out.leftover.push(m[0].replace(/\s+/g, ' '));
  const name = el => (el.getAttribute('aria-label') || el.textContent || '').trim();
  for (const el of document.querySelectorAll('button, [role=button], a[href], input')) {
    if (!vis(el) || covered(el)) continue;
    const r = el.getBoundingClientRect(), n = name(el) || el.placeholder || '';
    if (!n && el.tagName !== 'INPUT') out.unnamed.push(el.outerHTML.slice(0, 60));
    // words you tap for their meaning sit inside sentences: WCAG 2.5.5 exempts inline targets
    if ((r.width < 43.5 || r.height < 43.5) && !el.classList.contains('term')) out.tiny.push(`${n.slice(0, 20)} ${Math.round(r.width)}×${Math.round(r.height)}`);
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
  // room for content: between the header and the first fixed bar below it
  const head = document.querySelector('.top'), lows = ['.endbar', '#strip', '#app > nav'].map(q => document.querySelector(q)).filter(e => e && vis(e));
  if (head && lows.length) out.room = (Math.min(...lows.map(e => e.getBoundingClientRect().top)) - head.getBoundingClientRect().bottom) / innerHeight;
  return out;
};

const problems = { overflow: [], unnamed: [], tiny: [], smallText: [], contrast: [], bars: [], room: [], leftover: [] };
for (const [label, w, h, nightXL] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block', hasTouch: w < 900, isMobile: w < 900 });
  await ctx.addInitScript(seedScript(77));
  if (nightXL) await ctx.addInitScript(() => { window.__NIGHTXL = true; localStorage.setItem('theburg.prefs', JSON.stringify({ theme: 'night', textSize: 'xl' })); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(srv.url, { waitUntil: 'load' });
  const screens = [
    ['title', async () => {}],
    ['help', async () => { await page.click('#how'); }],
    ['home', async () => { await page.evaluate(() => { closeHelp(); localStorage.clear(); setPref('tips', ['focus','strip','tabs']); if (window.__NIGHTXL) { setPref('theme', 'night'); setPref('textSize', 'xl'); } applyPrefs(); newGame('Screens', 'two', 0, { diff: 'hard' }); S.noEvents = true; S.jobId = 'farmhand'; tab = 'home'; render(); }); await page.click('#end'); await page.waitForTimeout(300);
      if (await page.$('#modal:not(.hidden) #ok')) await page.click('#modal:not(.hidden) #ok'); }],   // i2-a10: the First paycheck badge card
    ['jobs', async () => { await page.click('[data-tab=jobs]'); }],
    ['life', async () => { await page.click('[data-tab=life]'); }],
    ['life-skills-biz', async () => { await page.evaluate(() => { S.money = 9000; S.skills = { handy: 30, cook: 10, people: 50 }; S.goals = ['dog']; S.goalAt = { dog: 0 }; S.biz = { type: 'shop', weeks: 5, earned: 140, paidYear: null }; render(); }); }],
    // round 3 money: an owner's home card, investing, crop insurance and stored wheat; a herd; the insurance sheet; bankruptcy; the harvest choice
    ['life-money', async () => { await page.evaluate(() => { S.money = 30000; S.home = 'fixer'; S.equity = 40000; S.mortgage = 950; S.mortRate = 7.5; S.rate = 6.25; S.homeGrow = 0.07; S.stocks = 4200;
      S.heLeft = 60; S.hePay = 210; S.heRate = 7.5; S.date = new Date(2027, 9, 4).getTime(); S.smoke = 2027; S.wine = [{ y: 2026, paid: 2500, at: S.turn + 100, smoke: true }];
      S.biz = { type: 'wheat', weeks: 30, earned: 5000, paidYear: 2027, dep: 1, lease: 260, stored: 6000, ins: true }; render(); }); }],
    ['life-cattle', async () => { await page.evaluate(() => { S.heLeft = 0; S.rate = 7; S.biz = { type: 'cattle', weeks: 30, earned: 800, dep: 1, cows: 5, calves: 4, check: S.turn - 8 }; render(); }); }],
    ['insurance', async () => { await page.click('#inssheet'); }],
    ['bankruptcy', async () => { await page.evaluate(() => { closeSheet(); S.money = -41000; bankruptcySheet('Buried in debt.'); }); }],
    ['harvest-choice', async () => { await page.evaluate(() => { closeSheet(); S.money = 9000; S.home = 'room'; S.biz = { type: 'wheat', weeks: 30, earned: 0, paidYear: 2027, dep: 1, lease: 260, crop: 7000, bad: true, ins: true }; showEvent(DUE_EVENTS[0]); }); }],
    ['journal', async () => { await page.evaluate(() => { closeSheet(); S.biz = null; }); await page.click('[data-tab=log]'); }],
    ['home-map', async () => { await page.click('[data-tab=home]'); await page.click('#main .maptog button:nth-child(2)'); }],
    ['main-street', async () => { await page.click('.mpin[aria-label="Main Street"]'); await page.evaluate(() => document.querySelector('.msmap').scrollIntoView({ block: 'center' })); }],
    ['business-card', async () => { await page.evaluate(() => { S.ageMonths = 25 * 12; bizSheet('pasta'); }); }],
    ['region-map', async () => { await page.evaluate(() => { closeSheet(); S.evPins = [{ t: 'Wine country weekend', ic: '🍷', m: 'R', k: 'wallawalla', turn: S.turn, r: 'A sunny afternoon.' }]; }); await page.click('.maptabs button:nth-child(2)'); await page.click('.mpin[aria-label="Walla Walla"]'); }],
    ['trip', async () => { await page.evaluate(() => { S.date = new Date(2027, 5, 7).getTime(); tripSheet('wallawalla'); }); await page.click('#modal [data-stop="market"]'); }],
    ['event', async () => { await page.evaluate(() => { closeSheet(); showEvent(EVENTS.find(e => e.title === 'Celebration Days')); }); }],
    ['skip-options', async () => { await page.evaluate(() => { closeSheet(); skipSheet(); }); }],
    ['focus-plan', async () => { await page.evaluate(() => { closeSheet(); S.plan = ['work', 'community']; planSheet(); }); }],
    ['life-undo', async () => { await page.evaluate(() => { closeSheet(); S.plan = []; tab = 'life'; render(); });
      // the Life tab is long (round 75 added the weather card), and in CI's headless shell Playwright's tap on this button far down
      // the page kept landing on the header, the nav or the text above it (no cards overlap). Center it and send the tap to the
      // button itself: this step is about the undo card it brings up, not about where the button sits.
      await page.evaluate(() => document.querySelector('[data-k401="1"]').scrollIntoView({ block: 'center' })); await page.locator('[data-k401="1"]').dispatchEvent('click'); await page.waitForSelector('#undo'); await page.evaluate(() => { tab = 'home'; render(); }); await page.evaluate(() => { tab = 'life'; render(); }); }],
    ['menu', async () => { await page.evaluate(() => { tab = 'home'; render(); }); await page.click('[data-tab=home]'); await page.evaluate(() => closeSheet()); await page.click('#main .maptog button:nth-child(1)'); await page.click('[data-tab=menu]'); await page.waitForTimeout(300); }],
    ['settings', async () => { await page.click('#sheet #settings'); await page.waitForTimeout(200); }],
    // i2 clarity: the badge card, why lines, the recap, a big choice and an open word meaning
    ['celebrate', async () => { await page.evaluate(() => { closeSheet(); celebrate(['🐕 Badge earned: Good dog', '🍳 Cook skill: level 1']); }); }],
    ['why', async () => { await page.evaluate(() => { closeSheet(); showRunDetails(); }); await page.click('#modal .whyrow'); }],
    ['recap', async () => { await page.evaluate(() => { closeSheet(); recapSheet(Date.now() - 3 * 864e5); }); }],
    ['confirm-move', async () => { await page.evaluate(() => { closeSheet(); S.money = 50000; moveHome('fixer'); }); }],
    // i56-b20: the longest event with 3 choices and its result, the week's notes, the year in review, the bank and trades
    // cards, naming an heir (with a will), and backup and restore
    ['event-longest', async () => { await page.evaluate(() => { closeSheet(); S.money = 9000; S.home = 'room';
      const len = e => { try { const ch = e.choices().filter(c => !c.if || c.if()); return ch.length === 3 ? (typeof e.text === 'function' ? e.text() : e.text).length + ch.reduce((a, c) => a + c.label.length, 0) : -1; } catch (x) { return -1; } };
      const ev = EVENTS.reduce((a, e) => len(e) > len(a) ? e : a, EVENTS[0]); window.__LONGEST = ev.title; showEvent(ev); }); }],
    ['event-result', async () => { await page.click('#modal:not(.hidden) [data-i="0"]'); }],
    ['week-notes', async () => { await page.evaluate(() => { closeSheet(); S.noEvents = true; const wt = weekTick;
      weekTick = a => { const r = wt(a); r.notes.push('🎓 You\'re below $0, so this week\'s tuition went on a federal student loan (about 6.5%) instead of the card.', '🛻 The truck is paid off!'); weekTick = wt; return r; };
      playWeeks(1); }); await page.waitForSelector('#modal:not(.hidden) #ok'); }],
    ['year-review', async () => { await page.evaluate(() => { closeSheet(); render(); showReview({ year: 2027, start: { nw: 1500, happy: 60, health: 78, community: 30 },
      end: { nw: netWorth(), happy: S.happy, health: S.health, community: S.community }, events: 7, wx: { cost: 1840, saved: 420 },
      milestones: ['Hired as Wheat farm hand in Waitsburg!', 'Adopted a dog from the Blue Mountain Humane Society.', 'Finished a welding certificate.', 'Earned a badge: Good dog.'] }); }); }],
    ['bank-card', async () => { await page.evaluate(() => { closeSheet(); S.k401 = 3200; S.k401rate = 1; S.sloanLeft = 30; S.sloanPay = 120; bankSheet('bank'); }); }],
    ['trades-card', async () => { await page.evaluate(() => { closeSheet(); tradesSheet('trades'); }); }],
    ['heir-naming', async () => { await page.evaluate(() => { closeSheet(); legacySheet({ name: 'Margaret Ann Whitmore', nw: 420000, community: 70, home: 'farm', equity: 90000, will: true, col: 1.4, slot: 0, gen: 2, mortgage: 1650 }); }); }],
    ['backup', async () => { await page.evaluate(() => { closeSheet(); backupSheet(); }); }],
    ['restore', async () => { await page.evaluate(() => { closeSheet(); restoreSheet(); }); }],
    ['glossary', async () => { await page.evaluate(() => { closeSheet(); tab = 'jobs'; render(); }); await page.click('#main .term').catch(() => {}); }],
    ['tutorial', async () => { await page.evaluate(() => { closeSheet(); startTutorial(); }); await page.waitForTimeout(500); await page.click('#cnext'); await page.waitForTimeout(600); }],
    // the newer pop-ups (G3): life goals, the end screen, the title screen's options, challenges (with the weekly challenge and records) and What's new
    ['life-goals', async () => { await page.evaluate(() => { endTutorial(false); $('#toast').classList.add('hidden'); tab = 'life'; render(); }); await page.click('#goals'); }],
    ['money-outlook', async () => { await page.evaluate(() => { closeSheet(); S.home = 'fixer'; S.mortgage = 950; S.roomHost = true; S.money = 200; S.jobId = null; tab = 'life'; render(); outlookSheet(); }); }],
    ['life-planning', async () => { await page.evaluate(() => { closeSheet(); S.money = 200000; S.scholar = { y: 2027, n: 2 }; S.pensionYears = 6; S.pensionPay = 3500; render(); document.querySelector('#outlook').scrollIntoView({ block: 'center' }); }); }],
    ['rules-card', async () => { await page.evaluate(() => { closeSheet(); S.rules = { start: 'comfy', routine: 'on' }; S.tier0 = 'custom'; tab = 'life'; render(); document.querySelector('#rulescard').scrollIntoView({ block: 'center' }); }); }],   // i19-b19
    ['end', async () => { await page.evaluate(() => { closeSheet(); S.badges = { job: 1, dog: 3 }; finish('You chose to wrap things up.'); }); }],
    ['legacy-will', async () => { await page.evaluate(() => { legacySheet({ name: 'Screens', nw: 300000, community: 50, home: 'fixer', equity: 50000, will: false, col: 1, slot: 0, gen: 1 }); }); }],
    ['title-options', async () => { await page.evaluate(() => { closeSheet(); S = null; useDice(); renderTitle(); }); await page.click('#moreopts'); }],
    ['rules', async () => { await page.click('#rulesbtn'); await page.evaluate(() => document.querySelector('[data-rule="start"][data-opt="comfy"]').click()); }],   // i19-b02..b05
    ['challenges', async () => { await page.evaluate(() => closeSheet()); await page.click('#chal'); }],
    ['records', async () => { await page.evaluate(() => { closeSheet(); store.set(CHALLENGE_KEY, { farm: 1 }); const b = store.get(BEST_KEY) || {}; b['half-hard'] = 41; b['sc-farm'] = 77; b['wk-' + isoWeek()] = 63; store.set(BEST_KEY, b); renderTitle(); }); await page.click('#chal'); }],   // i50-a05: the weekly challenge and records live in Challenges
    ['whats-new', async () => { await page.evaluate(() => { closeSheet(); store.set(SEEN_KEY, '0.1.0'); whatsNew(); }); }]
  ];
  SCREEN_COUNT = screens.length;
  for (const [screen, go] of screens) {
    await go();
    await page.waitForTimeout(250);
    // a pop-up fades in: on a busy machine 250 ms can catch it part way, which reads as low contrast
    await page.waitForFunction(() => ['#modal', '#sheet'].every(q => { const e = document.querySelector(q); return !e || e.classList.contains('hidden') || getComputedStyle(e).opacity === '1'; }), null, { timeout: 3000 }).catch(() => {});
    await page.screenshot({ path: `test-results/screens/${label}-${screen}.png` });
    const a = await page.evaluate(audit);
    const where = `${label} ${w}×${h} / ${screen}`;
    if (a.overflow > 1) problems.overflow.push(`${where}: ${a.overflow}px too wide`);
    for (const k of ['unnamed', 'tiny', 'smallText', 'contrast', 'bars', 'leftover']) for (const x of a[k]) problems[k].push(`${where}: ${x}`);
    if (['home', 'jobs', 'life', 'life-skills-biz'].includes(screen) && a.room < 0.45) problems.room.push(`${where}: ${Math.round(a.room * 100)}% of the screen`);
  }
  if (errors.length) problems.unnamed.push(`${label}: page error ${errors[0]}`);
  await page.evaluate(() => endTutorial(false)).catch(() => {});
  await ctx.close();
}
const uniq = a => [...new Set(a.map(x => x.replace(/^[^/]+\/ /, '')))];

await t.check('nothing is wider than the screen at any size', async () => { assert(!problems.overflow.length, problems.overflow.slice(0, 5).join('; ')); });
await t.check('End Week, the week strip and the tab bar stay on-screen and never overlap', async () => { assert(!problems.bars.length, problems.bars.slice(0, 5).join('; ')); });
await t.check('the Help guide scrolls normally: its contents list and sections are not pinned over the text', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(srv.url, { waitUntil: 'load' });
  await page.click('#how');
  const r = await page.evaluate(() => {
    document.querySelector('#g-start').open = true;
    const toc = document.querySelector('#helpview .toc'), first = document.querySelector('#g-start p');
    first.scrollIntoView({ block: 'center' });
    const b = first.getBoundingClientRect(), top = document.elementFromPoint(b.left + 20, b.top + b.height / 2);
    return { pos: getComputedStyle(toc).position, covered: !first.contains(top) && top !== first, by: top && (top.className || top.tagName) };
  });
  assert(r.pos === 'static' && !r.covered, `contents list is ${r.pos}; guide text covered by ${r.by}`);
  await ctx.close();
});
await t.check('no code leftovers on screen ("${", stray "}", undefined, NaN)', async () => { assert(!problems.leftover.length, uniq(problems.leftover).slice(0, 5).join('; ')); });
await t.check('every button has a name a screen reader can say', async () => { assert(!problems.unnamed.length, problems.unnamed.slice(0, 5).join('; ')); });
await t.check('content gets at least 45% of the screen between the header and the bottom bars (portrait and landscape)', async () => { assert(!problems.room.length, problems.room.slice(0, 5).join('; ')); });
await t.check('every tap target is at least 44 × 44 px (WCAG 2.5.5)', async () => { assert(!problems.tiny.length, uniq(problems.tiny).slice(0, 8).join('; ')); });
await t.check('no text smaller than 11 px', async () => { assert(!problems.smallText.length, uniq(problems.smallText).slice(0, 8).join('; ')); });
await t.check('text contrast meets WCAG AA (4.5:1, or 3:1 for large text)', async () => { assert(!problems.contrast.length, uniq(problems.contrast).slice(0, 10).join('; ')); });
// G1: walk the whole tutorial at a small phone, a phone held sideways, a tablet and a computer: every tap step's ring
// sits on a spot a finger can reach (not under the bubble or the dimmer, inside the screen), and no step is skipped
await t.check("the tutorial's touch highlights work at every screen size, and no step is skipped", async () => {
  const bad = [];
  for (const [label, w, h] of [['small-phone', 320, 568], ['landscape', 844, 390], ['tablet', 768, 1024], ['desktop', 1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block', hasTouch: w < 900, isMobile: w < 900 });
    await ctx.addInitScript(seedScript(78));
    const page = await ctx.newPage();
    await page.goto(srv.url, { waitUntil: 'load' });
    await page.evaluate(() => startTutorial());
    let steps = 0, skipped = [];
    for (let g = 0; g < 120; g++) {
      await page.waitForTimeout(430);
      const st = await page.evaluate(() => {
        if (!TUT) return null;
        const s = TSTEPS[TUT.i], el = s.sel && document.querySelector(s.sel), r = el && el.getBoundingClientRect();
        const x = r && r.left + r.width / 2, y = r && r.top + r.height / 2, hit = r && document.elementFromPoint(x, y);
        return { i: TUT.i, sel: s.sel || null, tap: !!s.tap, skipped: [...TUT.skipped], shown: !document.querySelector('#coach').classList.contains('hidden'),
          reach: !!(hit && el.contains(hit)), inView: !r || (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth), x, y };
      });
      if (!st) break;
      skipped = st.skipped;
      if (!st.shown) continue;
      steps = Math.max(steps, st.i + 1);
      if (!st.inView) bad.push(`${label} step ${st.i + 1} (${st.sel}): off screen`);
      if (st.tap && !st.reach) { bad.push(`${label} step ${st.i + 1} (${st.sel}): covered`); break; }
      if (st.tap) { if (w < 900) await page.touchscreen.tap(st.x, st.y); else await page.mouse.click(st.x, st.y); }
      else await page.click('#cnext');
    }
    const total = await page.evaluate(() => TSTEPS.length);
    if (steps !== total) bad.push(`${label}: reached step ${steps} of ${total}`);
    if (skipped.length) bad.push(`${label}: skipped steps ${skipped.map(i => i + 1).join(', ')}`);
    await ctx.close();
  }
  assert(!bad.length, bad.slice(0, 6).join('; '));
});

// ---------- keyboard and screen readers ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.addInitScript(seedScript(78));
  const page = await ctx.newPage();
  await page.goto(srv.url, { waitUntil: 'load' });
  const active = () => page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim().slice(0, 30)));
  const tabTo = async (pred, max = 80) => { for (let i = 0; i < max; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(pred)) return true; } return false; };
  await page.evaluate(() => { localStorage.clear(); setPref('tips', ['focus','strip','tabs']); newGame('Keys', 'two', 0); S.noEvents = true; S.jobId = 'farmhand'; tab = 'home'; render(); });

  await t.check('keyboard: Tab reaches End Week, and Enter plays the week and announces it', async () => {
    assert(await tabTo(() => document.activeElement && document.activeElement.id === 'end'), 'never reached End Week with Tab');
    const turn = await page.evaluate(() => S.turn);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
    assert((await page.evaluate(() => S.turn)) === turn + 1, 'Enter did not end the week');
    const said = await page.textContent('#sr');
    assert(/^Week \d+ done\. (You earned|You spent|Your cash)/.test(said), `screen-reader message: "${said}"`);   // i7-a02: one short sentence by default
  });

  await t.check('keyboard: a focused button shows a visible focus ring', async () => {
    await page.focus('#end');
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const w = await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement).outlineWidth));
    assert(w >= 2, `focus outline ${w}px`);
  });

  await t.check('keyboard: the Menu opens as a dialog, Tab stays inside it, Escape closes it and returns focus', async () => {
    await page.focus('[data-tab=menu]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#modal:not(.hidden)');
    // the sheet moves focus on a short timer; wait for it (up to 2 s) instead of a fixed pause, which raced on a busy machine
    const moved = await page.waitForFunction(() => document.querySelector('#sheet').contains(document.activeElement), null, { timeout: 2000 }).then(() => true, () => false);
    if (!moved) await page.keyboard.press('Escape');              // don't leave the Menu open over the next checks
    assert(moved, 'focus did not move into the Menu');
    assert((await page.getAttribute('#sheet', 'role')) === 'dialog' && (await page.getAttribute('#sheet', 'aria-modal')) === 'true', 'sheet is not a modal dialog');
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); assert(await page.evaluate(() => document.querySelector('#sheet').contains(document.activeElement)), 'Tab left the Menu'); }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    assert(await page.isHidden('#modal'), 'Escape did not close the Menu');
  });

  await t.check('keyboard: map pins open with Enter', async () => {
    await page.click('#main .maptog button:nth-child(2)');
    await page.focus('.mpin[aria-label="Touchet River"]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.mapdet');
    await page.click('#main .maptog button:nth-child(1)');
  });

  await t.check('keyboard: ? opens Help with focus on the part you were on (i44-b19), and Escape closes it back to the ? button', async () => {
    await page.focus('#helpbtn');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#helpview:not(.hidden)');
    const at = await page.evaluate(() => { const a = document.activeElement, d = a && a.closest('details.gsec'); return a && a.tagName === 'SUMMARY' && d && d.open ? d.id : null; });
    assert(at === 'g-' + (await page.evaluate(() => helpHere())), `focus on ${await active()} (${at})`);
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => !!document.activeElement.closest('#helpview')), 'Tab left Help');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    assert(await page.isHidden('#helpview'), 'Escape did not close Help');
    assert((await active()) === 'helpbtn', `focus went to ${await active()}`);
  });

  await t.check('keyboard: the whole tutorial can be done with Enter alone', async () => {
    await page.evaluate(() => startTutorial());
    let steps = 0;
    for (let g = 0; g < 80; g++) {
      await page.waitForTimeout(450);
      const st = await page.evaluate(() => TUT ? { i: TUT.i, shown: !document.querySelector('#coach').classList.contains('hidden') } : null);
      if (!st) break;
      if (!st.shown) continue;
      steps = Math.max(steps, st.i + 1);
      await page.keyboard.press('Enter');
    }
    const total = await page.evaluate(() => TSTEPS.length), skipped = await page.evaluate(() => typeof LAST_TUT_SKIPPED === 'undefined' ? [] : LAST_TUT_SKIPPED);
    assert(steps === total, `reached step ${steps} of ${total} with the keyboard`);
    assert(!skipped.length, `steps skipped with the keyboard: ${skipped.join(', ')}`);
  });

  await t.check('screen readers: messages use a live status region, and tabs mark the current page', async () => {
    assert((await page.getAttribute('#toast', 'role')) === 'status', 'toast is not a status region');
    assert((await page.$$('#app > nav [aria-current="page"]')).length === 1, 'no current tab marked');
    assert((await page.$$('.fbtn[aria-pressed="true"]')).length === 1, 'chosen focus not marked as pressed');
  });
  await ctx.close();
}

// ---------- accessibility audit fixes (wave 1) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.addInitScript(seedScript(91));
  const page = await ctx.newPage();
  await page.goto(srv.url, { waitUntil: 'load' });
  await page.evaluate(() => { localStorage.clear(); setPref('tips', ['focus','strip','tabs']); newGame('Audit', 'two', 0); S.noEvents = true; S.jobId = 'farmhand'; tab = 'home'; render(); });
  const settle = () => page.waitForTimeout(120);

  await t.check('i43-a01 / i7-a02: the week strip says its numbers, and the live region says one short sentence (or every number in Full)', async () => {
    const closeCards = async () => { for (let i = 0; i < 3 && await page.$('#modal:not(.hidden) #ok'); i++) { await page.click('#modal:not(.hidden) #ok'); await page.waitForTimeout(120); } };
    await page.click('#end'); await page.waitForTimeout(250);
    const r = await page.evaluate(() => ({ label: $('#strip').getAttribute('aria-label'), said: $('#sr').textContent, turn: S.turn, dm: Math.round(S.money - S.run.money) }));
    assert(/^Last week: cash (up|down) \$[\d,]+, happiness (up \d+|down \d+|unchanged), health .*, community .*\. Details$/.test(r.label), `strip label "${r.label}"`);
    assert(r.said.startsWith(`Week ${r.turn} done.`) && r.said.includes(r.dm > 0 ? `You earned $` : 'You spent') && !/now \$/.test(r.said), `short summary "${r.said}"`);
    const short = await page.evaluate(() => { S.run = { weeks: 1, money: S.money - 612, happy: S.happy + 1, health: S.health - 2, community: S.community, happened: [] }; return weekSentence({ ev: {} }); });
    assert(/^Week \d+ done\. You earned \$612\. Happiness down 1, health up 2\. One event waiting\.$/.test(short), short);
    await closeCards(); await page.evaluate(() => { setPref('srWeek', 'full'); render(); }); await page.click('#end'); await page.waitForTimeout(250);
    const full = await page.textContent('#sr');
    assert(/^Week done\. Cash (up|down) .*, now \$/.test(full), `full summary "${full}"`);
    await closeCards(); await page.evaluate(() => setPref('srWeek', 'short'));
  });

  await t.check('i74-b05 / i7-a03: Net worth says its amount; every stat says a word and its bar has notches', async () => {
    const r = await page.evaluate(() => { S.happy = 82; S.health = 61; S.community = 20; render();
      return { nw: $('[data-stat=net]').getAttribute('aria-label'), want: fmt(netWorth()), happy: $('[data-stat=happy]').getAttribute('aria-label'), shown: $('[data-stat=community]').textContent,
        notched: document.querySelectorAll('#main .stats .bar.notched').length, words: [10, 35, 59, 60, 80].map(statWord) }; });
    assert(r.nw === `Net worth ${r.want}: what counts`, r.nw);
    assert(r.happy === 'Happiness 82, Great: what moves it' && /20 · Low/.test(r.shown), `${r.happy} / ${r.shown}`);
    assert(r.notched === 3 && r.words.join() === 'Low,OK,OK,Good,Great', `${r.notched} notched bars, words ${r.words}`);
  });

  await t.check('i74-b15 / i43-a08: stat bars reach 3:1 on their track and control borders 3:1 on their page, day and night', async () => {
    const bad = await page.evaluate(() => {
      const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126*f(m[0]) + 0.7152*f(m[1]) + 0.0722*f(m[2]); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const probe = document.createElement('div'); document.body.append(probe);
      const col = v => { probe.style.color = v; return getComputedStyle(probe).color; };
      const out = [];
      for (const night of [false, true]) {
        document.documentElement.classList.toggle('night', night);
        for (const c of ['--bar-good', '--bar-ok', '--bar-low', '--bar-sky']) { const r = ratio(col(`var(${c})`), col('var(--track)')); if (r < 3) out.push(`${night ? 'night' : 'day'} ${c} ${r.toFixed(2)}:1`); }
        for (const bg of ['--cream', '--paper', '--card', '--pale']) { const r = ratio(col('var(--edge)'), col(`var(${bg})`)); if (r < 3) out.push(`${night ? 'night' : 'day'} --edge on ${bg} ${r.toFixed(2)}:1`); }
      }
      document.documentElement.classList.remove('night');
      for (const q of ['.fbtn', '.sm.alt', '.chip', '.btn.ghost']) { const e = document.querySelector(q); if (e && getComputedStyle(e).borderTopColor !== col('var(--edge)')) out.push(`${q} border is not --edge`); }
      probe.remove();
      return out;
    });
    assert(!bad.length, bad.join('; '));
  });

  await t.check('i43-a02 / i43-a03: an event sheet reads its story, and the result sheet is named for the event', async () => {
    await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
    await settle();
    const r = await page.evaluate(() => { const sh = $('#sheet'), d = document.getElementById(sh.getAttribute('aria-describedby') || 'none'); return { d: d && d.textContent, want: EVENTS.find(e => e.title === 'Celebration Days').text }; });
    assert(r.d && r.d === r.want, `described by "${r.d}"`);
    await page.click('#sheet [data-i="0"]'); await settle();
    const r2 = await page.evaluate(() => ({ name: $('#sheet').getAttribute('aria-label'), desc: !!$('#sheet').getAttribute('aria-describedby') }));
    assert(r2.name === 'Celebration Days: how it went' && r2.desc, `result sheet named "${r2.name}"`);
    await page.click('#sheet #ok'); await settle();
    await page.evaluate(() => settingsSheet());
    assert(!(await page.getAttribute('#sheet', 'aria-describedby')), 'a later sheet kept the event description');
    await page.evaluate(() => closeSheet());
  });

  await t.check('i70-b17 / i74-b02: yes/no sheets that end or delete something put the safe answer at the bottom and focus it first', async () => {
    const bad = [];
    for (const [name, open] of [['delete', () => { writeSlot(1, { ...clone(S), name: 'Old', slot: 1 }); askDelete(1); }], ['end life', () => confirmRetire()],
      ['replace', () => { for (let i = 0; i < SLOT_COUNT; i++) if (!slots()[i]) writeSlot(i, { ...clone(S), name: 'Full' + i, slot: i }); askReplace('New', 'two'); document.querySelector('#sheet [data-over="1"]').click(); }],
      ['quit job', () => { tab = 'jobs'; render(); $('#quit').click(); }]]) {
      await page.evaluate(open); await page.waitForTimeout(150);
      const r = await page.evaluate(() => { const bs = [...document.querySelectorAll('#sheet button')]; return { last: bs[bs.length - 1].hasAttribute('data-safe'), focus: document.activeElement && document.activeElement.hasAttribute('data-safe'), text: bs[bs.length - 1].textContent }; });
      if (!r.last || !r.focus) bad.push(`${name}: bottom "${r.text}" safe=${r.last}, focus on safe=${r.focus}`);
      await page.evaluate(() => { closeSheet(); tab = 'home'; render(); });
    }
    assert(!bad.length, bad.join('; '));
  });

  await t.check('i74-b01: Tab reaches the backup code box in Restore', async () => {
    await page.evaluate(() => restoreSheet()); await page.waitForTimeout(150);
    let hit = false; for (let i = 0; i < 8 && !hit; i++) { await page.keyboard.press('Tab'); hit = await page.evaluate(() => document.activeElement && document.activeElement.id === 'rscode'); }
    assert(hit, 'Tab never reached the backup code box');
    await page.evaluate(() => closeSheet());
  });

  await t.check('i43-a04: a button reached with Tab is never left under the bottom bars', async () => {
    await page.evaluate(() => { tab = 'home'; render(); window.scrollTo(0, 0); $('#end').focus(); });
    const bad = [];
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Shift+Tab');
      const r = await page.evaluate(() => { const a = document.activeElement; if (!a || !$('#main').contains(a)) return null; const b = a.getBoundingClientRect();
        const tops = ['#strip', '.endbar', '#app > nav'].map(q => $(q)).filter(Boolean).map(e => e.getBoundingClientRect().top);
        return { name: (a.getAttribute('aria-label') || a.textContent).trim().slice(0, 30), under: b.bottom > Math.min(...tops) + 1, over: b.top < $('.top').getBoundingClientRect().bottom - 1 }; });
      if (r && (r.under || r.over)) bad.push(`${r.name} ${r.under ? 'under the bars' : 'under the header'}`);
    }
    assert(!bad.length, bad.slice(0, 5).join('; '));
  });

  await t.check('i43-a05: during the tutorial Tab stays on the lit spot, Next and Skip', async () => {
    await page.evaluate(() => startTutorial());
    const bad = [];
    for (let step = 0; step < 6; step++) {
      await page.waitForFunction(() => TUT && !$('#coach').classList.contains('hidden'), null, { timeout: 4000 });
      await page.waitForTimeout(100);
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        const ok = await page.evaluate(() => { const a = document.activeElement, st = TSTEPS[TUT.i], el = st.tap && st.sel && document.querySelector(st.sel);
          return !!a && (!!a.closest('#coach .cbubble') || !!(el && el.contains(a))); });
        if (!ok) { bad.push(`step ${await page.evaluate(() => TUT.i + 1)}: Tab left the tutorial`); break; }
      }
      const tap = await page.evaluate(() => !!TSTEPS[TUT.i].tap);
      if (tap) await page.evaluate(() => { const el = document.querySelector(TSTEPS[TUT.i].sel); el.click(); });
      else await page.click('#cnext');
      await page.waitForTimeout(450);
    }
    await page.evaluate(() => endTutorial(false));
    assert(!bad.length, bad.join('; '));
  });

  await t.check('i59-a19 / i70-b01: the day theme says light-only, Text size follows the phone and reaches the header, tabs and End Week', async () => {
    const r = await page.evaluate(() => {
      setPref('theme', 'day'); setPref('textSize', 'normal'); applyPrefs(); tab = 'home'; render();
      const px = q => parseFloat(getComputedStyle(document.querySelector(q)).fontSize);
      const day = { meta: document.querySelector('meta[name=color-scheme]').content, cs: getComputedStyle(document.documentElement).colorScheme, root: getComputedStyle(document.documentElement).fontSize };
      const a = ['.top h2', '.top .money', '#app > nav button', '#end', '#strip .wl'].map(px);
      setPref('textSize', 'xl'); setPref('theme', 'night'); applyPrefs(); render();
      const b = ['.top h2', '.top .money', '#app > nav button', '#end', '#strip .wl'].map(px);
      const night = { meta: document.querySelector('meta[name=color-scheme]').content, cs: getComputedStyle(document.documentElement).colorScheme };
      setPref('textSize', 'normal'); setPref('theme', 'day'); applyPrefs(); render();
      return { day, night, a, b, src: [...document.styleSheets[0].cssRules].find(r => r.selectorText === 'html' && r.style.fontSize).style.fontSize };
    });
    assert(r.day.meta === 'only light' && /light/.test(r.day.cs) && !/dark/.test(r.day.cs), `day color-scheme ${JSON.stringify(r.day)}`);
    assert(r.night.meta === 'dark' && r.night.cs === 'dark', `night color-scheme ${JSON.stringify(r.night)}`);
    assert(r.src === '100%', `root font-size is ${r.src}, not the phone's own size`);
    const grew = r.a.map((v, i) => r.b[i] / v);
    assert(grew.every(x => x > 1.2), `Larger text grew header/tabs/End Week/strip by ${grew.map(x => x.toFixed(2)).join(', ')}`);
  });
  await ctx.close();

  await t.check('i43-a20: on a very short screen the header scrolls away instead of sticking', async () => {
    const c2 = await browser.newContext({ viewport: { width: 422, height: 195 }, serviceWorkers: 'block' });
    const p2 = await c2.newPage();
    await p2.goto(srv.url, { waitUntil: 'load' });
    const pos = await p2.evaluate(() => { localStorage.clear(); newGame('Short', 'two', 0); S.noEvents = true; render(); return getComputedStyle($('.top')).position; });
    await c2.close();
    assert(pos === 'static', `header is ${pos}`);
  });
}

const md = `## Screens and accessibility\n\n${SIZES.length} screen sizes × ${SCREEN_COUNT} screens, plus keyboard and screen-reader checks.\nScreenshots: \`test-results/screens/\`.\n`;
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} screen check(s) failed`); process.exit(1); }
console.log('All screen checks passed');
