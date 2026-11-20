// The first hour (wave 1 "First hour and onboarding"): the first start, the three-question start, game lengths in minutes,
// the Life Score in the tutorial, first-time explainers, the job hunt on Home, pay-as-you-go certificates, a month of
// bills before investing, Good first job tags, the drive on the hired sheet, the overtime note and no repeated events in
// the first year. Ends with five scripted newcomers playing their first 26 weeks by tapping (i52-a29), with a short
// report in test-results/first-hour.md. Run with: npm run test:firsthour
import { serve, launch, runner, seedScript, assert, near } from './helpers.mjs';
import fs from 'node:fs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(4242));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const t = runner();
const open = '#modal:not(.hidden)';
const S = () => page.evaluate(() => JSON.parse(JSON.stringify(S)));
const ev = (fn, arg) => page.evaluate(fn, arg);
// a fresh title screen, as on a new phone
const fresh = () => ev(() => { if (typeof TUT !== 'undefined' && TUT) endTutorial(false); closeSheet(); localStorage.clear(); S = null; render(); });
// a fresh life on a chosen tab, with no random events
async function life(extra = {}, tabName = 'home', len = 'two') {
  await ev(([extra, tabName, len]) => {
    localStorage.clear(); newGame('First', len, 0); Object.assign(S, extra); S.noEvents = true;
    closeSheet(); tab = tabName; render();
  }, [extra, tabName, len]);
}

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('i49-a01: each game length says about how long it takes', async () => {
  await fresh();
  for (const [k, want] of [['half', 'about 4 min'], ['two', 'about 11 min (7 with ⏩)'], ['five', 'about 25 min'], ['life', 'about 4 hours']])
    assert((await page.textContent(`.len[data-len="${k}"]`)).includes(want), `${k} should say ${want}`);
});

await t.check('i23-a01: the very first Start offers a practice life once; Jump right in starts the life', async () => {
  await fresh();
  await page.fill('#nm', 'Newbie'); await page.click('[data-len=two]'); await page.click('#start');
  await page.waitForSelector(`${open} #jumpin`);
  assert(/New here\?/.test(await page.textContent('#sheet h2')), 'no New here sheet');
  await page.click(`${open} #jumpin`);
  let s = await S();
  assert(s.name === 'Newbie' && s.len === 'two' && !s.practice, JSON.stringify({ n: s.name, l: s.len }));
  // shown once: with no saves again, Start goes straight in
  await ev(() => { const p = prefs(); localStorage.clear(); store.set(PREF_KEY, p); S = null; render(); });
  await page.fill('#nm', 'Again'); await page.click('#start');
  assert(!(await page.$(open)) && (await S()).name === 'Again', 'the practice offer came back');
});

await t.check('i23-a01: Practice life first runs the tutorial, then starts the life that was picked', async () => {
  await fresh();
  await page.fill('#nm', 'Learner'); await page.click('[data-len=five]'); await page.click('#start');
  await page.click(`${open} #yes`);
  await page.waitForTimeout(500);
  assert(await ev(() => !!TUT && S.practice), 'the tutorial did not start');
  await page.click('#cskip');
  const s = await S();
  assert(s.name === 'Learner' && s.len === 'five' && !s.practice, JSON.stringify({ n: s.name, l: s.len, p: s.practice }));
});

await t.check('i7-a06: Never played one of these? sets the length, mode and text size, then offers the practice life', async () => {
  await fresh();
  await page.fill('#nm', 'Gentle');
  await page.click('#newbie');
  await page.click(`${open} [data-nq="len"][data-v="two"]`);
  await page.click(`${open} [data-nq="text"][data-v="l"]`);
  await page.click(`${open} [data-nq="easy"][data-v="easy"]`);
  assert((await page.getAttribute(`${open} [data-nq="easy"][data-v="easy"]`, 'aria-pressed')) === 'true', 'the pick is not pressed');
  await page.click(`${open} #yes`);
  assert(/All set/.test(await page.textContent('#sheet h2')) && /practice life/.test(await page.textContent('#sheet')), 'no practice offer at the end');
  await page.click(`${open} #jumpin`);
  const s = await S();
  assert(s.len === 'two' && s.diff === 'easy' && s.mode === 'relaxed' && s.name === 'Gentle', JSON.stringify({ l: s.len, d: s.diff, m: s.mode, n: s.name }));
  assert(await ev(() => prefs().textSize === 'l' && document.documentElement.classList.contains('ts-l')), 'bigger text not set');
  assert(await ev(() => !!prefs().newHere), 'the New here offer should not come again');
  await ev(() => setPref('textSize', 'normal'));
});

await t.check('i44-b05: the tutorial opens the Life Score breakdown and points at the weakest-part tip', async () => {
  const st = await ev(() => TSTEPS.map(s => s.sel || ''));
  const i = st.findIndex(s => /#scorenow/.test(s));
  assert(i > st.indexOf('#ff4') && st[i + 1].includes('.card.tip'), JSON.stringify(st.slice(8, 14)));
  assert(st.length >= 40 && st.length <= 42, `the tutorial has ${st.length} steps`);
  // the score button shows in the practice life only while the tutorial runs
  await ev(() => { closeSheet(); startTutorial(); });
  await page.waitForTimeout(500);
  assert(await ev(() => { TUT.i = TSTEPS.findIndex(s => /#scorenow/.test(s.sel || '')) - 1; tab = 'home'; render(); return !!document.querySelector('#scorenow'); }), 'no score button in the practice life');
  await ev(() => document.querySelector('#scorenow').click());
  await page.waitForSelector(`${open} .card.tip`);
  await ev(() => endTutorial(false));
});

await t.check('i72-b01/b02/b03: with no job, Home has the job-hunt tip, a Side hustle button and how long cash lasts', async () => {
  await fresh();
  await ev(() => { setPref('newHere', 1); newGame('Hunt', 'two', 0); S.noEvents = true; tab = 'home'; render(); });
  const card = await page.textContent('.nopay');
  const weeks = await ev(() => Math.floor(S.money / -billLines().reduce((a, l) => a + l[1], 0)));
  assert(card.includes('One job application a week') && card.includes('pick a focus'), card);
  assert(card.includes(`about ${weeks} week`) && weeks >= 2 && weeks <= 8, `${card} (${weeks} weeks)`);
  assert(/Side hustle meanwhile \(about \$\d+ a week\)/.test(card), card);
  await page.click('.nopay [data-sugg="hustle"]');
  assert((await S()).focus === 'hustle', 'the button should set the focus');
  assert(/already Side hustle/.test(await page.textContent('.nopay')), 'the card should say the focus is set');
  await ev(() => { S.money = 300; render(); });
  assert(await page.$('.nopay .cashline.low') && /interest a week/.test(await page.textContent('.nopay')), 'low cash should turn red and say what debt costs');
});

await t.check('i72-b04: certificate fees are paid week by week by default, and the full fee is always paid', async () => {
  await life({ money: 1500 }, 'life');
  await page.click('[data-cert="cdl"]');
  const txt = await page.textContent('#sheet');
  assert(/Pay as you go: \$300 a week for 6 weeks/.test(txt) && /Pay it all now \(\$1,800\)/.test(txt), txt);
  await page.click(`${open} #yes`);
  let s = await S();
  assert(s.money === 1500 && s.certStudy.owe === 1800, JSON.stringify({ m: s.money, c: s.certStudy }));
  const paid = await ev(() => { let p = 0; S.focus = 'study'; for (let i = 0; i < 6; i++) { weekTick(true); const l = S.last.lines.find(x => x[0] === 'Certificate course'); p += l ? -l[1] : 0; } return p; });
  s = await S();
  assert(near(paid, 1800) && s.certs.cdl && !s.certStudy, JSON.stringify({ paid, certs: s.certs, cs: s.certStudy }));
  // studying slower than the payments: the fee still ends on time; a course finished early pays the rest at once
  const r = await ev(() => { S.certs = {}; startCert('welding', true); S.focus = 'rest'; let p = 0;
    for (let i = 0; i < 10; i++) { weekTick(true); const l = S.last.lines.find(x => x[0] === 'Certificate course'); p += l ? -l[1] : 0; }
    const owed = certOwed(); S.certStudy = null; S.certs = {}; startCert('phlebotomy', true); const m0 = S.money; S.certStudy.prog = 4.9; S.focus = 'study';
    weekTick(true); return { p, owed, early: m0 - S.money, cert: !!S.certs.phlebotomy, fee: Math.round(cost(CERTS.phlebotomy.fee)), wfee: Math.round(cost(CERTS.welding.fee)) }; });
  assert(near(r.p, r.wfee) && r.owed === 0 && r.cert && r.early >= r.fee * 0.99, JSON.stringify(r));
});

await t.check('i72-b04: the sign-up sheet warns when even the weekly payment means debt', async () => {
  await life({ money: 100 }, 'life');
  await page.click('[data-cert="cdl"]');
  assert(/would take you below \$0/.test(await page.textContent('#sheet')), 'no warning');
  await page.click(`${open} #no`);
});

await t.check('i72-b05: index funds keep a month of bills back', async () => {
  await life({ jobId: 'farmhand', money: 1500 }, 'life');
  assert(await page.$eval('[data-inv="1000"]', b => b.disabled) && /Keep a month of bills/.test(await page.textContent('#main')), 'buttons should gray out with a reason');
  const month = await ev(() => monthBills());
  await ev(m => { S.money = Math.round(m) + 600; render(); }, month);
  await page.click('[data-inv="1000"]');
  await page.waitForSelector(`${open} #y`);
  assert(/That leaves \$[\d,]+, about \d+ weeks? of bills\. Invest anyway\?/.test(await page.textContent('#sheet')), await page.textContent('#sheet'));
  await page.click(`${open} #n`);
  assert(!((await S()).stocks > 0), 'Keep the cash should not invest');
  await page.click('[data-inv="1000"]'); await page.click(`${open} #y`);
  assert((await S()).stocks === 1000, 'Invest anyway should invest');
  await ev(() => { S.money = 50000; render(); });
  await page.click('[data-inv="5000"]');
  assert(!(await page.$(open)) && (await S()).stocks === 6000, 'plenty of cash should not ask');
});

await t.check('i52-a01: a first life tags two Good first jobs within 25 miles, until the first hire', async () => {
  await fresh();
  await ev(() => { setPref('newHere', 1); newGame('Look', 'two', 0); S.noEvents = true; tab = 'jobs'; render(); });
  const tagged = await ev(() => [...document.querySelectorAll('.goodjob')].map(b => b.closest('[data-job]').dataset.job));
  assert(tagged.length === 2, `tags: ${tagged}`);
  assert(await ev(ids => ids.every(id => CITIES[jobById(id).city].miles <= 25 && jobById(id).edu <= S.edu), tagged), `a tag is too far or locked: ${tagged}`);
  await ev(() => { startJob('farmhand'); S.jobId = null; render(); });
  assert(!(await page.$('.goodjob')), 'tags should go after the first hire');
});

await t.check("i52-a02: You're hired names a long drive and what it costs", async () => {
  await life({ money: 1500 }, 'jobs');
  await ev(() => hired(jobById('airport')));
  const txt = await page.textContent('#sheet');
  assert(/58 miles each way, about an hour/.test(txt) && /happiness a month/.test(txt) && /in gas/.test(txt), txt);
  await ev(() => { closeSheet(); hired(jobById('diner')); });
  assert(!/miles each way/.test(await page.textContent('#sheet')), 'no drive line for a job in town');
  await ev(() => closeSheet());
});

await t.check('i52-a03: the first Work extra week says it is overtime on top of your job, then not again', async () => {
  await life({ jobId: 'diner' }, 'home');
  await page.click('[data-f="work"]');
  assert(/Work extra is overtime/.test(await page.textContent('.otnote')), 'no overtime note');
  await ev(() => { PLAY_AT = -1e9; }); await page.click('#end');
  await page.waitForTimeout(300); await ev(() => { closeSheet(); render(); });
  assert((await S()).seenOT === true && !(await page.$('.otnote')), 'the note should show once');
});

await t.check('i52-a10: no event repeats in the first 52 weeks, unless nothing new is left', async () => {
  const r = await ev(() => {
    newGame('Ev', 'two', 0); S.turn = 10;
    const all = EVENTS.map(e => e.title); let keep = null;
    for (let i = 0; i < 50 && !keep; i++) { const e = pickEvent(curMonth(), 'town'); keep = e && e.title; }
    S.evSeen = Object.fromEntries(all.filter(x => x !== keep).map(x => [x, 1]));
    const got = new Set(); for (let i = 0; i < 30; i++) { const e = pickEvent(curMonth(), 'town'); if (e) got.add(e.title); }
    S.evSeen = Object.fromEntries(all.map(x => [x, 1]));
    const fallback = pickEvent(curMonth(), 'town');
    S.turn = 60; S.evSeen = Object.fromEntries(all.filter(x => x !== keep).map(x => [x, 1]));
    const later = new Set(); for (let i = 0; i < 60; i++) { const e = pickEvent(curMonth(), 'town'); if (e) later.add(e.title); }
    return { got: [...got], keep, fallback: !!fallback, later: later.size };
  });
  assert(r.got.length >= 1 && r.got.every(x => x === r.keep), JSON.stringify(r));
  assert(r.fallback && r.later > 1, JSON.stringify(r));
  assert(await ev(() => { const s = { name: 'Old', len: 'two', turn: 5, date: Date.now() }; migrate(s); return s.seenOT === true && typeof s.evSeen === 'object'; }), 'old saves need defaults');
});

await t.check('i68-b10/b11: first-time explainers for the jobs, school and money systems', async () => {
  const keys = await ev(() => Object.keys(FIRST));
  for (const k of ['interview', 'offer', 'union', 'ladder', 'program', 'cert', 'invest', 'ins', 'will', 'ltc', 'ptax', 'collect', 'wheat'])
    assert(keys.includes(k), `no ${k} explainer`);
  assert(await ev(() => Object.values(FIRST).every(x => { const d = x.d(); return d.length > 20 && !/undefined|NaN/.test(d); })), 'an explainer has a broken number');
  // each one shows where its system opens, and Got it sticks
  const where = await ev(() => {
    const out = {};
    const firstOn = (k, fn) => { closeSheet(); fn(); const el = document.querySelector(`[data-firstcard="${k}"]`); out[k] = !!el; setPref('first', { ...(prefs().first || {}), [k]: 1 }); };
    localStorage.clear(); newGame('Ex', 'life', 0, { diff: 'hard' }); S.noEvents = true;   // Hard: every system's explainer
    setPref('first', { school: 1, goals: 1, skills: 1, biz: 1, k401: 1, carpool: 1 });
    firstOn('interview', () => { S.interview = { id: 'diner', p: 0.5 }; interviewSheet(jobById('diner')); });
    firstOn('offer', () => hired(jobById('cna')));
    firstOn('union', () => { startJob('rail'); tab = 'jobs'; render(); });
    firstOn('ladder', () => { tab = 'jobs'; render(); });
    firstOn('invest', () => { closeSheet(); tab = 'life'; render(); });   // i50-a04: Home comes first on Life now, so Investing's explainer shows before the school one
    firstOn('program', () => { tab = 'life'; render(); });
    firstOn('cert', () => { tab = 'life'; render(); document.querySelector('[data-cert="cdl"]').click(); });
    firstOn('ins', () => insSheet());
    firstOn('will', () => { S.ageMonths = 30 * 12; tab = 'life'; render(); });
    firstOn('ltc', () => { S.ageMonths = 56 * 12; tab = 'life'; render(); });
    firstOn('ptax', () => { S.home = 'fixer'; S.mortgage = 950; tab = 'life'; render(); });
    firstOn('collect', () => { S.money = -500; tab = 'home'; render(); });
    firstOn('wheat', () => { S.money = 1e6; S.biz = null; S.diff = 'hard'; startBiz('wheat'); S.biz.stored = 2000; tab = 'life'; render(); });
    closeSheet(); return out;
  });
  const missing = Object.entries(where).filter(([, v]) => !v).map(([k]) => k);
  assert(!missing.length, `explainers not shown: ${missing.join(', ')}`);
});

/* ---------- i52-a29: five scripted newcomers play their first 26 weeks by tapping ---------- */
const NEWBIES = [
  { name: 'Ann', seed: 11, plan: ['community', 'rest', 'outdoors', 'community'] },  // rotates, like the tips say
  { name: 'Bo', seed: 22, plan: ['work'] },                                         // reads Work extra as "go to work"
  { name: 'Cy', seed: 33, plan: ['rest'] },                                         // never changes the focus
  { name: 'Di', seed: 44, plan: ['outdoors', 'community', 'work', 'rest'] },
  { name: 'Eve', seed: 55, plan: ['study', 'study', 'community', 'rest'] }
];
const LIMITS = { words: 260, hiredBy: 8, happy: 30, debt: -2500 };
const report = [];
async function sheetWords() {
  return ev(() => { const s = document.querySelector('#modal:not(.hidden) #sheet'); return s ? { h: (s.querySelector('h2') || {}).textContent || s.textContent.slice(0, 30), w: s.textContent.trim().split(/\s+/).length } : null; });
}
async function clearAll(rec) {
  for (let i = 0; i < 12; i++) {
    const sw = await sheetWords(); if (!sw) return;
    rec.sheets.push(sw);
    const b = await page.$(`${open} #ok, ${open} [data-i="0"], ${open} #again, ${open} #no, ${open} #close, ${open} #n`);
    if (!b) { await ev(() => closeSheet()); return; }
    await b.click(); await page.waitForTimeout(60);
  }
}
async function applyGood(rec) {
  await ev(() => { closeSheet(); tab = 'jobs'; render(); });
  const id = await ev(() => { const g = document.querySelector('.goodjob'); const row = g ? g.closest('[data-job]') : [...document.querySelectorAll('[data-job]')].find(r => r.querySelector('[data-apply]:not([disabled])') && CITIES[jobById(r.dataset.job).city].miles <= 25);
    const b = row && row.querySelector('[data-apply]:not([disabled])'); return b ? b.dataset.apply : null; });
  if (!id) return;
  rec.applied.push(id);
  await page.click(`[data-apply="${id}"]`); await page.waitForTimeout(80);
  await clearAll(rec);
}
for (const nb of NEWBIES) {
  await t.check(`i52-a29: newcomer ${nb.name} plays a first 26 weeks`, async () => {
    await fresh();
    await page.evaluate(seedScript(nb.seed));
    await ev(() => { window.__evs = []; if (!window.__showEvent) { window.__showEvent = showEvent; showEvent = (e, then) => { window.__evs.push(e.title); return window.__showEvent(e, then); }; } });
    const rec = { name: nb.name, sheets: [], applied: [], hiredAt: null };
    await page.fill('#nm', nb.name); await page.click('[data-len=two]'); await page.click('#start');
    await page.click(`${open} #jumpin`);
    for (let w = 0; w < 26; w++) {
      let s = await S();
      if (!s.jobId && !s.applied) await applyGood(rec);
      s = await S();
      if (s.jobId && rec.hiredAt == null) rec.hiredAt = s.turn;
      let f = nb.plan[w % nb.plan.length];
      if ((f === 'work' && !s.jobId) || (f === 'study' && s.edu >= 3)) f = 'rest';
      await ev(() => { closeSheet(); tab = 'home'; render(); });
      if (s.focus !== f) await page.click(`[data-f="${f}"]`);
      await ev(() => { PLAY_AT = -1e9; });
      await page.click('#end'); await page.waitForTimeout(120);
      await clearAll(rec);
    }
    const s = await S(), evs = await ev(() => window.__evs);
    const big = rec.sheets.reduce((a, x) => x.w > a.w ? x : a, { w: 0, h: '' });
    const repeats = evs.filter((x, i) => evs.indexOf(x) !== i);
    report.push({ ...rec, happy: Math.round(s.happy), health: Math.round(s.health), community: Math.round(s.community), money: Math.round(s.money), job: s.jobId, events: evs, repeats, big });
    assert(s.turn === 26, `played ${s.turn} weeks`);
    assert(big.w <= LIMITS.words, `a sheet has ${big.w} words: ${big.h}`);
    assert(rec.hiredAt != null && rec.hiredAt <= LIMITS.hiredBy, `${nb.name} was hired at week ${rec.hiredAt} (applied: ${rec.applied.join(', ')})`);
    assert(!repeats.length, `events repeated: ${repeats.join(', ')}`);
    assert(s.money >= LIMITS.debt, `${nb.name} is ${s.money} in debt`);
    if (nb.plan.join() !== 'work') assert(s.happy >= LIMITS.happy, `${nb.name} happiness ${Math.round(s.happy)}`);
  });
}

await t.check('no errors in the page', async () => { assert(!errors.length, errors.slice(0, 3).join(' | ')); });

fs.mkdirSync('test-results', { recursive: true });
fs.writeFileSync('test-results/first-hour.md', `# First hour: five scripted newcomers (26 weeks, 2-year game)\n\n` +
  `Thresholds: every sheet ${LIMITS.words} words or fewer, hired by week ${LIMITS.hiredBy}, no repeated events, cash above ${LIMITS.debt}, happiness ${LIMITS.happy}+ (except the all-overtime player).\n\n` +
  `| Newcomer | Hired (week) | Job | Happy | Health | Community | Cash | Events | Longest sheet |\n|---|---|---|---|---|---|---|---|---|\n` +
  report.map(r => `| ${r.name} | ${r.hiredAt ?? '–'} | ${r.job || '–'} | ${r.happy} | ${r.health} | ${r.community} | $${r.money.toLocaleString()} | ${r.events.length}${r.repeats.length ? ` (${r.repeats.length} repeats)` : ''} | ${r.big.w} words: ${String(r.big.h).trim().slice(0, 40)} |`).join('\n') + '\n');

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} first-hour check(s) failed`); process.exit(1); }
console.log('\nAll first-hour checks passed');
