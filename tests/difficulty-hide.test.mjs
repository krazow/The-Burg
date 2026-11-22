// Difficulty modes stage 3a (to-do list 2, D5 + D6): nothing a life can't use is shown or taught. Help sections,
// word meanings, first-time cards, tutorial steps, the first-month checklist, What's new, unlocks and badges carry the
// feature they belong to and hide when it's off. Easy gets a short tutorial; the checklist can be finished everywhere.
// Run with: npm run test:difficulty-hide
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
const reset = () => ev(() => { if (TUT) endTutorial(false); S = null; closeSheet(); closeHelp(); render(); });

await t.check('Help: every tagged part shown is on, and switched-off systems are gone', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Help', 'two', 0, { diff: d }); S.turn = 5;
      showHelp();
      const v = document.querySelector('#helpview');
      const tags = [...v.querySelectorAll('[data-feat]')].flatMap(e => e.dataset.feat.split(' '));
      out[d] = { tags: [...new Set(tags)], off: tags.filter(k => !on(k)), sections: [...v.querySelectorAll('.guide details.gsec')].map(s => s.id.slice(2)),   // i44-b20: the guide's sections fold up, under group headings
        groups: v.querySelectorAll('.guide .ggrp').length, toc: v.querySelectorAll('.toc button').length, text: v.textContent };
      closeHelp();
    }
    return out;
  });
  for (const d of ['easy', 'normal', 'hard']) {
    assert(!r[d].off.length, `${d}: shows parts for switched-off systems: ${r[d].off}`);
    assert(r[d].toc === r[d].groups && r[d].sections.length >= r[d].groups, `${d}: contents and sections differ`);
  }
  assert(r.hard.tags.length >= 40, `hard should show every tagged part (${r.hard.tags.length})`);
  for (const s of ['savings', 'grow', 'weather']) assert(!r.easy.sections.includes(s) && r.hard.sections.includes(s), `easy section ${s}`);
  assert(r.normal.sections.includes('weather') && r.normal.sections.includes('savings'), `normal ${r.normal.sections}`);
  for (const w of ['401(k)', 'bankruptcy', 'property tax', 'long-term care', 'Union jobs', 'index funds', 'Lifetime', 'Interviews', 'collections', 'Kids:'])
    assert(!r.easy.text.includes(w), `easy Help still mentions "${w}"`);
  for (const w of ['bankruptcy', 'Union jobs', 'Dental', 'block captain', 'Wheat:'])
    assert(!r.normal.text.includes(w) && r.hard.text.includes(w), `normal Help and "${w}"`);
  assert(/yearly tabs are in it too/.test(r.easy.text) && !/yearly tabs are in it too/.test(r.normal.text), 'Easy insurance includes the tabs');
  assert(/debt counselor/.test(r.easy.text) && /-\$40,000/.test(r.normal.text), 'debt reads right for each difficulty');
  assert(/Each year in a job also brings a small raise/.test(r.easy.text) && !/Promotions and job ladders/.test(r.easy.text), 'Easy raises');
  await reset();
});

await t.check('word meanings and first-time cards: none for a switched-off system', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Words', 'two', 0, { diff: d }); setPref('first', {});
      const terms = Object.keys(GLOSSARY).filter(k => /data-term/.test(term(k)));
      const firsts = Object.keys(FIRST).filter(k => { FIRST_SLOT = null; return !!firstTime(k); });
      const defs = Object.keys(GLOSSARY).filter(k => terms.includes(k)).map(k => GLOSSARY[k].d()).join(' ');
      out[d] = { terms, firsts, defs, badTerm: terms.filter(k => GLOSSARY[k].feat && !on(GLOSSARY[k].feat)), badFirst: firsts.filter(k => FIRST[k].feat && !on(FIRST[k].feat)) };
    }
    FIRST_SLOT = null; out.allTagged = Object.keys(FIRST).every(k => FIRST[k].feat);
    return out;
  });
  for (const d of ['easy', 'normal', 'hard']) assert(!r[d].badTerm.length && !r[d].badFirst.length, `${d}: ${JSON.stringify([r[d].badTerm, r[d].badFirst])}`);
  assert(!r.easy.terms.includes('k401') && r.normal.terms.includes('k401'), `401(k) word ${r.easy.terms}`);
  assert(!r.easy.firsts.includes('biz') && !r.easy.firsts.includes('skills') && !r.easy.firsts.includes('k401') && r.normal.firsts.includes('biz'), `first cards ${r.easy.firsts}`);
  assert(!r.normal.firsts.includes('union') && r.hard.firsts.includes('union'), 'union card is Hard only');
  for (const w of ['401(k)', 'index funds', 'home equity loan', 'report cards', 'life aim']) assert(!r.easy.defs.includes(w), `easy word meanings mention "${w}"`);
  assert(r.allTagged, 'every first-time card names its feature');
  await reset();
});

await t.check('tutorial steps: Easy is a short tour of Easy systems, Normal skips Hard-only steps', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) { const st = tutSteps(d); out[d] = { n: st.length, off: st.filter(s => s.feat && !on(s.feat, { diff: d })).length, normalOnly: st.filter(s => s.t === 'normal').length, sels: st.map(s => s.sel || '') }; }
    out.all = TSTEPS.length;
    return out;
  });
  assert(r.easy.n >= 13 && r.easy.n <= 18 && !r.easy.normalOnly, `easy tour: ${r.easy.n} steps`);
  assert(!r.easy.off && !r.normal.off && !r.hard.off, 'a step for a switched-off system');
  for (const sel of ['[data-job="lineman"]', '#inssheet']) assert(!r.normal.sels.includes(sel) && r.hard.sels.includes(sel), `normal and ${sel}`);
  assert(r.normal.sels.includes('#outlook') && !r.easy.sels.includes('#outlook') && !r.easy.sels.includes('[data-k401="1"]'), 'outlook and 401(k) steps');
  assert(r.hard.n === r.all, 'Hard shows every step');
});

await t.check('the practice life plays at the picked difficulty (Normal from the title), not forced to Hard', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    S = null; startTutorial(); out.title = [S.diff, TUT.diff, TUT.steps.length]; endTutorial(false);
    const go = () => {}; go.diff = 'easy'; startTutorial(go); out.picked = S.diff; endTutorial(false);
    newGame('Mine', 'two', 0, { diff: 'hard' }); startTutorial(); out.life = S.diff; endTutorial(false); out.back = S && S.name;
    showHelp(); out.card = document.querySelector('.tutcard') && document.querySelector('.tutcard').textContent; closeHelp();
    return out;
  });
  assert(r.title[0] === 'normal' && r.title[1] === 'normal' && r.title[2] === r.title[2], `from the title ${r.title}`);
  assert(r.picked === 'easy' && r.life === 'hard' && r.back === 'Mine', JSON.stringify(r));
  await reset();
});

await t.check('the Easy tutorial runs end to end by tapping', async () => {
  await ev(() => { localStorage.clear(); setPref('mapView', false); newGame('Mine', 'two', 0, { diff: 'easy' }); S.turn = 3; tab = 'home'; render(); save(); });
  await page.click('#helpbtn');
  assert(/about 2 minutes/.test(await page.textContent('.tutcard')), 'the Easy tutorial card says it is short');
  await page.click('#tutstart');
  let steps = 0, skipped = [], diffs = new Set(), covered = [];
  for (let g = 0; g < 60; g++) {
    await page.waitForTimeout(430);
    const st = await ev(() => {
      if (!TUT) return null;
      const s = tsteps()[TUT.i], el = s.sel && document.querySelector(s.sel), r = el && el.getBoundingClientRect();
      const hit = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { i: TUT.i, sel: s.sel || null, tap: !!s.tap, skipped: [...TUT.skipped], diff: S.diff, shown: !document.querySelector('#coach').classList.contains('hidden'), reach: !!(hit && el.contains(hit)) };
    });
    if (!st) break;
    skipped = st.skipped; diffs.add(st.diff);
    if (!st.shown) continue;
    steps = Math.max(steps, st.i + 1);
    if (st.tap && !st.reach) covered.push(st.sel);
    if (st.tap) { const box = await (await page.$(st.sel)).boundingBox(); await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
    else await page.click('#cnext');
  }
  const r = await ev(() => ({ n: LAST_TUT_N, skipped: LAST_TUT_SKIPPED, tut: !!TUT, name: S && S.name, diff: S && S.diff }));
  assert(!r.tut, 'the tutorial never finished');
  assert(steps === r.n && r.n <= 18, `reached step ${steps} of ${r.n}`);
  assert(!skipped.length && !r.skipped.length, `skipped steps ${skipped}`);
  assert(!covered.length, `covered tap targets ${covered}`);
  assert([...diffs].join() === 'easy', `practice life played at ${[...diffs]}`);
  assert(r.name === 'Mine' && r.diff === 'easy', 'the real life came back');
  await reset();
});

await t.check('the first-month checklist: only rows this life can do, and it can be finished in every difficulty', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      localStorage.clear(); newGame('List', 'two', 0, { diff: d });
      const rows = checklistOn();
      tab = 'home'; render();
      const card = document.querySelector('#checklist');
      const o = { ids: rows.map(c => c.id), off: rows.filter(c => c.feat && !on(c.feat)).map(c => c.id), shown: card && card.textContent, total: card && card.querySelector('.tag').textContent };
      // do each row the way a player would
      startJob('farmhand'); S.turn = 1; setPref('cl', { ...(prefs().cl || {}), strip: 1 });
      if (rows.some(c => c.id === 'k401')) S.k401rate = 1;
      if (rows.some(c => c.id === 'plan')) { goTo('plan'); o.planSheet = !!document.querySelector('#sheet:not(.hidden), #modal:not(.hidden)'); closeSheet(); S.plan = ['work', 'rest']; }
      S.goals = ['dog']; S.out = { ...(S.out || {}), visits: 1 };
      o.left = checklist(); render(); o.card = !!document.querySelector('#checklist');
      out[d] = o;
    }
    return out;
  });
  for (const d of ['easy', 'normal', 'hard']) {
    assert(!r[d].off.length, `${d}: rows for switched-off systems ${r[d].off}`);
    assert(r[d].left === null && !r[d].card, `${d}: the checklist could not be finished ${JSON.stringify(r[d].left)}`);
    assert(r[d].total === `0/${r[d].ids.length}`, `${d}: count ${r[d].total}`);
  }
  assert(!r.easy.ids.includes('k401') && r.easy.ids.includes('plan') && r.easy.planSheet, `easy rows ${r.easy.ids}`);
  assert(!/401\(k\)/.test(r.easy.shown), 'easy card mentions the 401(k)');
  assert(r.normal.ids.includes('k401') && !r.normal.ids.includes('plan') && r.hard.ids.join() === r.normal.ids.join(), `normal rows ${r.normal.ids}`);
  await reset();
});

await t.check("What's new, unlocks and badges: nothing for a switched-off system", async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      localStorage.clear(); newGame('New', 'two', 0, { diff: d }); save();
      const o = {};
      o.wnOff = Object.keys(WHATS_NEW).flatMap(v => whatsNewOn(v)).filter(b => b[3] && ![].concat(b[3]).every(k => on(k))).map(b => b[1]);
      store.set(SEEN_KEY, '0.1.0'); closeSheet(); whatsNew(); o.wn = (document.querySelector('#sheet') ? document.querySelector('#sheet').textContent : '') + ' ' + whatsNewOn('0.2.1').map(b => b[1] + ': ' + b[2]).join(' '); closeSheet();   // the 0.2.1 list holds the tagged bullets, whatever the current version
      // unlocks: run a year of checks with everything due
      S.money = 90000; S.skills = { cook: 5 }; startJob('farmhand'); S.turn = 80;
      unlockCheck(true); o.opened = Object.keys(S.opened || {});
      showHelp(); o.coming = document.querySelector('#comingup') ? document.querySelector('#comingup').textContent : '';
      o.badgeRows = [...document.querySelectorAll('#g-goals table tr td:first-child')].map(td => td.textContent); closeHelp();
      // badges: a council seat, a kid and a big 401(k) don't earn a badge where the system is off
      S.council = true; S.kids = [{ age: 1 }]; S.k401 = 90000; S.badges = {}; badgeWeek([]); o.badges = Object.keys(S.badges);
      goalsSheet(); o.goalBtns = [...document.querySelectorAll('[data-goal]')].map(b => b.dataset.goal); closeSheet();
      out[d] = o;
    }
    return out;
  });
  for (const d of ['easy', 'normal', 'hard']) assert(!r[d].wnOff.length, `${d}: What's new bullets ${r[d].wnOff}`);
  assert(r.hard.wn.includes('Skills') || r.hard.wn.includes('Weather'), `hard What's new ${r.hard.wn.slice(0, 80)}`);
  assert(!/Skills:|Your own business:|Weather and hard years:/.test(r.easy.wn) && /Safer saves/.test(r.easy.wn), `easy What's new ${r.easy.wn.slice(0, 200)}`);
  for (const id of ['k401', 'skills', 'biz']) assert(!r.easy.opened.includes(id) && r.normal.opened.includes(id), `unlock ${id}: easy ${r.easy.opened} normal ${r.normal.opened}`);
  assert(!/401\(k\)|Skills|business/.test(r.easy.coming), `easy coming up ${r.easy.coming}`);
  for (const b of ['saver', 'family', 'council']) assert(!r.easy.badges.includes(b) && !r.easy.goalBtns.includes(b), `easy badge ${b}`);
  assert(r.normal.badges.includes('council') && r.normal.badges.includes('family') && r.normal.badges.includes('saver'), `normal badges ${r.normal.badges}`);
  assert(!r.easy.badgeRows.some(x => /Saver|Family|Council member|Town helper|Retired/.test(x)) && r.hard.badgeRows.some(x => /Council member/.test(x)), `easy badge table ${r.easy.badgeRows}`);
  await reset();
});

await t.check('no page errors', async () => { assert(!errors.length, errors.slice(0, 3).join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll difficulty stage 3a (hiding) checks passed');
