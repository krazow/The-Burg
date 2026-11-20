// Difficulty modes stage 2D (to-do list 2, D2 + D3): business and skills, retirement and legacy, the score, goals and
// challenges, UI helpers and Help are switched off by on(k) below their tier, with the plan's fallbacks.
// Run with: npm run test:difficulty-d
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

await t.check('business: none in Easy, the food truck and shop in Normal, all four in Hard', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Biz', 'five', 0, { diff: d }); S.money = 50000; tab = 'life'; render();
      const card = [...document.querySelectorAll('#main [data-biz]')].map(b => b.dataset.biz);
      startBiz('wheat'); const wheat = S.biz ? S.biz.type : null; S.biz = null; S.money = 50000;
      startBiz('truck'); const truck = S.biz ? S.biz.type : null;
      out[d] = { card, types: bizTypes(), wheat, truck, head: /Start a business|Your business/.test(document.querySelector('#main').textContent) };
    }
    return out;
  });
  assert(!r.easy.card.length && !r.easy.types.length && !r.easy.wheat && !r.easy.truck, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.card.join() === 'truck,shop' && !r.normal.wheat && r.normal.truck === 'truck', `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.card.join() === 'wheat,truck,shop,cattle' && r.hard.wheat === 'wheat', `hard ${JSON.stringify(r.hard)}`);
  await reset();
});

await t.check('skills: no card, no levels and no practice in Easy; they grow in Normal', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Sk', 'two', 0, { diff: d }); S.skills = { handy: 30 };
      const lv = skillLv('handy'); practice('cook', 20); S.focus = 'community'; skillWeek([], null);
      tab = 'life'; render();
      out[d] = { lv, cook: (S.skills || {}).cook || 0, people: (S.skills || {}).people || 0, card: /🧰 Skills/.test(document.querySelector('#main').textContent) };
    }
    return out;
  });
  assert(r.easy.lv === 0 && !r.easy.cook && !r.easy.people && !r.easy.card, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.lv === 2 && r.normal.cook === 20 && r.normal.people === 1 && r.normal.card, `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.lv === 2 && r.hard.card, `hard ${JSON.stringify(r.hard)}`);
  await reset();
});

await t.check('lengths, backgrounds and aims: Easy is 6 months / 2 / 5 years, Fresh start and All-around only', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) { newGame('L', 'life', 0, { diff: d, bg: 'farm', aim: 'content' }); out[d] = [S.len, S.bg, S.aim]; }
    return out;
  });
  assert(r.easy.join() === 'five,fresh,all', `easy ${r.easy}`);
  assert(r.normal.join() === 'life,farm,content' && r.hard.join() === 'life,farm,content', JSON.stringify(r));
  // the start screen hides what Easy doesn't have, and puts the picks back to ones it does
  await ev(() => { localStorage.clear(); setPref('newHere', 1); setPref('moreOpts', true); S = null; closeSheet(); render(); });
  await page.click('[data-len="life"]'); await page.click('[data-bg="farm"]'); await page.click('[data-aim="content"]');
  await page.click('[data-diff="easy"]');
  const vis = async sel => page.isVisible(sel);
  assert(!(await vis('[data-len="life"]')) && await vis('[data-len="five"]') && await vis('[data-len="half"]'), 'Easy should hide Lifetime only');
  assert(!(await vis('[data-bg="farm"]')) && await vis('[data-bg="fresh"]'), 'Easy should show Fresh start only');
  assert(!(await vis('[data-aim="content"]')) && await vis('[data-aim="all"]'), 'Easy should show All-around only');
  const on = await page.$$eval('.title .on[data-len], .title .on[data-bg], .title .on[data-aim]', bs => bs.map(b => b.dataset.len || b.dataset.bg || b.dataset.aim));
  assert(on.join() === 'five,fresh,all', `picks should move to allowed ones: ${on}`);
  await page.click('[data-diff="normal"]');
  assert(await vis('[data-len="life"]') && await vis('[data-bg="farm"]') && await vis('[data-aim="content"]'), 'Normal shows them all again');
  await page.fill('#nm', 'Easyo'); await page.click('[data-diff="easy"]'); await page.click('#start');
  const s = await ev(() => [S.diff, S.len, S.bg, S.aim]);
  assert(s.join() === 'easy,five,fresh,all', JSON.stringify(s));
  await reset();
});

await t.check('retirement and legacy: no Social Security, will, scholarship, spare room or heirs in Easy', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('R', d === 'easy' ? 'five' : 'life', 0, { diff: d }); S.home = 'fixer'; S.money = 300000; S.ageMonths = 66 * 12; S.kids = [{ born: S.date - 30 * 365 * 864e5 }];
      tab = 'life'; render(); const m = document.querySelector('#main').textContent;
      tab = 'jobs'; render(); const retire = !!document.querySelector('#retire');
      S.retired = true; S.snowbird = new Date(S.date).getFullYear();
      const will = writeWill(), sch = endowScholarship();
      out[d] = { ss: /Social Security/.test(m), willRow: /📜 Will/.test(m), host: /Spare room/.test(m), scholar: /Endow a scholarship/.test(m), retire,
        will, sch, heir: heirOK(), act: shownActs(placeById('legal')).some(a => a.id === 'will'), south: PLAN_DUE.find(e => e.title === 'Winter in Arizona?').when(11) };
    }
    return out;
  });
  const e = r.easy, n = r.normal;
  assert(!e.ss && !e.willRow && !e.host && !e.scholar && !e.retire && !e.act && !e.heir && !e.south, `easy ${JSON.stringify(e)}`);
  assert(e.will && e.sch, `easy: a will and a scholarship can't be made ${JSON.stringify(e)}`);
  assert(n.ss && n.willRow && n.host && n.scholar && n.retire && n.act && !n.will && !n.sch, `normal ${JSON.stringify(n)}`);
  assert(r.hard.ss && r.hard.willRow && r.hard.retire, `hard ${JSON.stringify(r.hard)}`);
  await reset();
});

await t.check('score: no report cards or aims in Easy (final averages), no debt drag in Easy or Normal', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) {
      newGame('Sc', 'two', 0, { diff: d, rules: { events: 'none' } }); S.noEvents = true;
      if (jobById('diner')) { S.jobId = 'diner'; S.jobMonths = 12; }
      S.money = -8000 * (S.col || 1);
      for (let i = 0; i < 26 && !S.over; i++) { const res = weekTick(true); if (res.ending) break; S.pendingEv = null; S.money = Math.min(S.money, -8000); }
      tab = 'life'; render(); const life = document.querySelector('#main').textContent;
      showScoreNow(); const sheetT = document.querySelector('#sheet').textContent; closeSheet();
      const sc = lifeScore();
      out[d] = { cards: S.cardCount || 0, cardLog: S.log.some(x => /Report card/.test(x.m)), scoreQ: S.scoreQ, cardAvg: sc.cardAvg, drag: sc.drag, deep: S.deepWeeks || 0,
        aimCard: /Life aim/.test(life), aimWeeks: Object.keys(S.aimWeeks || {}).length, cardLine: /report card goes in your Journal/.test(sheetT) };
    }
    return out;
  });
  const e = r.easy;
  assert(!e.cards && !e.cardLog && e.scoreQ == null && e.cardAvg == null && !e.aimCard && !e.aimWeeks && !e.cardLine, `easy ${JSON.stringify(e)}`);
  assert(!e.drag && !e.deep && !r.normal.drag && !r.normal.deep, `no drag in Easy/Normal ${JSON.stringify(r)}`);
  assert(r.normal.cards === 2 && r.normal.cardLog && r.normal.aimCard && r.normal.cardLine, `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.deep > 0 && r.hard.drag > 0, `hard keeps the drag ${JSON.stringify(r.hard)}`);
  await reset();
});

await t.check('challenges: the weekly is a Normal life and story challenges are Hard; no scenario below Hard', async () => {
  await ev(() => { localStorage.clear(); setPref('newHere', 1); S = null; closeSheet(); render(); });
  await page.click('#chal');
  const sheetT = await page.textContent('#sheet');
  assert(/Normal/.test(sheetT) && /Hard/.test(sheetT), 'the Challenges sheet should name the difficulties');
  await page.click('[data-sc="debtfree"]');
  const sc = await ev(() => [S.diff, S.scenario, !!scenarioLine()]);
  assert(sc.join() === 'hard,debtfree,true', JSON.stringify(sc));
  const r = await ev(() => {
    startWeekly('W'); const wk = S.diff;
    newGame('N', 'two', 0, { diff: 'normal' }); S.scenario = 'lab'; const line = scenarioLine(); const n = []; scenarioWeek(n);
    return { wk, line, n: n.length, won: S.scWon };
  });
  assert(r.wk === 'normal' && r.line === '' && !r.n && !r.won, JSON.stringify(r));
  await reset();
});

await t.check('badges and goals: a goal for a feature this life lacks is not offered (Easy: no 401(k), kids, town goals, retiring)', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of DIFF_LIST) { newGame('G', 'two', 0, { diff: d }); goalsSheet(); out[d] = [...document.querySelectorAll('#sheet [data-goal]')].map(b => b.dataset.goal); closeSheet(); }
    return out;
  });
  for (const id of ['saver', 'family', 'helper', 'retired']) assert(!r.easy.includes(id), `easy offers ${id}`);
  assert(r.easy.includes('job') && r.hard.includes('retired') && r.normal.includes('family'), JSON.stringify(r));
  await reset();
});

await t.check('UI helpers and Help switched off by device overrides: nothing breaks, and they are gone', async () => {
  const keys = ['ui.plan', 'ui.auto', 'ui.undo', 'ui.checklist', 'ui.recap', 'ui.nudges', 'ui.milestones', 'ui.explain', 'help.tutorial', 'help.inline', 'help.whatsNew', 'goals.badges', 'score.history'];
  const r = await ev(keys => {
    localStorage.clear();
    newGame('Off', 'five', 0, { diff: 'easy' }); S.flagsEdited = true;
    localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify(Object.fromEntries(keys.map(k => [k, false]))));
    S.plan = ['rest', 'community']; S.planI = 0;
    const out = { offs: keys.filter(k => !on(k)) };
    tab = 'home'; render();
    out.home = { plan: !!document.querySelector('#planbtn:not(.hidden)'), auto: !!document.querySelector('#auto'), ff: !!document.querySelector('#ff4'),
      check: !!document.querySelector('#checklist'), prev: !!document.querySelector('#fprev'), planLine: !!document.querySelector('.planline') };
    out.first = firstTime('biz') + firstTime('k401'); out.term = term('lifescore'); out.wn = whatsNew(); out.undo = undoTop();
    for (const t of ['jobs', 'life', 'log', 'home']) { tab = t; render(); }
    let review = 0, focus = [];
    for (let i = 0; i < 60 && !S.over; i++) { const res = weekTick(true); if (res.review) review++; focus.push(S.focus); if (res.ending) break; S.pendingEv = null; }
    out.review = review; out.badges = Object.keys(S.badges || {}).length; out.planMoved = new Set(focus).size > 1; out.goals = goalsCard();
    S.run = { weeks: 1, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] }; showRunDetails(); out.why = /Why your stats moved/.test(document.querySelector('#sheet').textContent); closeSheet();
    showHelp(); out.tut = !!document.querySelector('#tutstart'); closeHelp();
    let went = false; startTutorial(() => { went = true; }); out.tutWent = went;
    localStorage.removeItem(DIFF_FLAGS_KEY);
    return out;
  }, keys);
  assert(r.offs.length === keys.length, `all should be off: ${r.offs}`);
  assert(!Object.values(r.home).some(Boolean), `home ${JSON.stringify(r.home)}`);
  assert(r.first === '' && !/<button/.test(r.term) && r.wn === false && r.undo == null, JSON.stringify(r));
  assert(!r.review && !r.badges && !r.planMoved && r.goals === '' && !r.why, JSON.stringify(r));
  assert(!r.tut && r.tutWent, `tutorial ${JSON.stringify(r)}`);
  await reset();
});

await t.check('26 weeks in each difficulty with every tab drawn', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      localStorage.clear(); newGame('Run', d === 'easy' ? 'five' : 'life', 0, { diff: d });
      if (jobById('cellar')) { S.jobId = 'cellar'; S.jobMonths = 12; } S.money = 20000;
      for (let i = 0; i < 26 && !S.over; i++) {
        const res = weekTick(true);
        if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; }
        if (res.ending) break;
        if (i % 6 === 0) for (const t of ['home', 'jobs', 'life', 'log']) { tab = t; render(); }
      }
      out[d] = { turn: S.turn, biz: S.biz, skills: Object.keys(S.skills || {}).length, cards: S.cardCount || 0 };
    }
    return out;
  });
  assert(r.easy.turn >= 20 && !r.easy.biz && !r.easy.skills && !r.easy.cards, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.cards >= 1 && r.hard.cards >= 1, JSON.stringify(r));
  await reset();
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll difficulty stage 2D checks passed');
