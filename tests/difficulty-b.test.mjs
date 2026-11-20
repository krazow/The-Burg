// Difficulty modes stage 2B (to-do list 2: D2 + D3, area B): every feature in Housing & vehicles, Family &
// relationships and Health & aging sits behind on(k). Each check shows a feature is off below its tier (no card,
// row, bill line, stop, choice or event, and its save fields stay at defaults) and on in its own tier, with the
// fallbacks: Easy homes keep their listed price and payment, no breakdowns or tabs, no kids; Easy and Normal have
// no home loans, injuries, dental or ambulance plans, Dad's care, care stops, paid leave or late-life care.
// Run with: node tests/difficulty-b.test.mjs
import { serve, launch, seedScript, runner, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(2203));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(srv.url, { waitUntil: 'load' });
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();
const D = ['easy', 'normal', 'hard'];

const AREA_B = ['home.buy', 'home.market', 'home.loans', 'home.propertyTax', 'car.buy', 'car.upkeep', 'family.partner', 'family.kids',
  'family.pets', 'family.dadCare', 'family.council', 'health.sickHours', 'health.injuries', 'health.coverage', 'health.events',
  'health.careStops', 'health.paidLeave', 'health.agingDrift', 'health.lateCare'];

await t.check('area B feature keys switch on exactly at their tier', async () => {
  const r = await ev(keys => { localStorage.clear(); return keys.map(k => [k, FEATURE_TIER[k], ...['easy', 'normal', 'hard'].map(d => on(k, { diff: d }))]); }, AREA_B);
  for (const [k, tier, ...ons] of r) {
    assert(tier, `${k} has no tier`);
    D.forEach((d, i) => assert(ons[i] === (D.indexOf(tier) <= i), `${k} (${tier}) in ${d}: ${ons[i]}`));
  }
});

await t.check('feature events: each comes up only while its feature is on (its own tier and up)', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    const setups = {
      'Starting a family?': () => { S.partner = true; S.ageMonths = 30 * 12; S.kids = []; },
      'Run for town council?': () => { S.community = 70; S.council = false; S.ageMonths = 30 * 12; },
      'Hurt on the job': () => { S.jobId = 'farmhand'; },
      'A personal day': () => { S.jobId = 'diner'; S.happy = 30; S.mhDay = -99; },
      'Stiff after a long day at the desk': () => { S.jobId = JOBS.find(j => !j.wear).id; S.ageMonths = 45 * 12; S.deskHabit = false; },
      'Flu going around': () => { S.jobId = 'diner'; },
      'Toothache': () => { S.dentist = -60; },
      'A cracked tooth': () => {},
      'Who drives Dad to Walla Walla?': () => { S.ageMonths = 52 * 12; S.parent = null; },
      'Long-term care insurance': () => { S.ageMonths = 56 * 12; S.ltc = null; },
      'Who will care for you?': () => { S.ageMonths = 80 * 12; S.health = 40; S.care = null; },
      'Physical therapy, or tough it out?': () => { S.jobId = 'farmhand'; S.injury = { part: 'back', ask: true, at: 0 }; }
    };
    for (const d of ['easy', 'normal', 'hard']) {
      newGame('Ev', 'life', 0, { diff: d }); S.turn = 10;
      out[d] = {};
      for (const [title, set] of Object.entries(setups)) {
        const e = [...EVENTS, ...PLAN_DUE, ...DUE_EVENTS].find(x => x.title === title); set();
        out[d][title] = [e.feat, !!e.when(0)];
      }
      // a toddler's events and the breakdown dice
      S.kids = [S.ageMonths - 36]; out[d].toddler = EVENTS.filter(e => e.feat === 'family.kids' && e.title !== 'Starting a family?' && e.title !== 'A kid heads off to college').some(e => e.when(5));
      S.car = 'beater'; S.svc = -200; const tr = EVENTS.find(e => e.title === 'Truck trouble'); let hits = 0; for (let i = 0; i < 200; i++) if (tr.when(0)) hits++; out[d].truck = hits;
    }
    S = null; closeSheet(); render(); return out;
  });
  for (const [i, d] of D.entries()) {
    for (const [title, [k, fires]] of Object.entries(r[d]).filter(([, v]) => Array.isArray(v))) {
      const want = D.indexOf(await ev(k => FEATURE_TIER[k], k)) <= i;
      assert(k, `${title} has no feature key`);
      assert(fires === want, `${d}: "${title}" (${k}) ${fires ? 'came up' : 'did not come up'}`);
    }
  }
  assert(!r.easy.toddler && r.normal.toddler && r.hard.toddler, `toddler events ${JSON.stringify([r.easy.toddler, r.normal.toddler])}`);
  assert(r.easy.truck === 0 && r.normal.truck > 0 && r.hard.truck > 0, `breakdowns ${r.easy.truck}/${r.normal.truck}/${r.hard.truck}`);
});

await t.check('housing: Easy keeps the listed price and payment (no market, rates or property tax); home loans are Hard only', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of ['easy', 'normal', 'hard']) {
      newGame('Home', 'two', 0, { diff: d }); S.noEvents = true; S.money = 200000; S.jobId = 'diner';
      const pay0 = newMortgage('fixer');
      S.home = 'fixer'; S.mortgage = pay0; S.mortRate = S.rate; S.equity = 60000;
      const lines = [], rates = new Set(), grows = new Set();
      for (let i = 0; i < 70 && !S.over; i++) { weekTick(true); S.pendingEv = null; S.due = []; lines.push(...S.last.lines.map(l => l[0])); rates.add(S.rate); grows.add(S.homeGrow); }
      const pay1 = newMortgage('fixer');
      S.rate = S.mortRate - 2;   // a rate drop, for the refinance offer
      const html = homeMoneyHTML();
      out[d] = { idx: S.homeIdx, pay: [Math.round(pay0), Math.round(pay1)], rates: rates.size, grows: grows.size, mood: homeMood(),
        ptax: lines.includes('Property tax (county)'), ptaxNow: propTax(), market: /Housing market/.test(html), rateRow: /Mortgage rate this year/.test(html),
        taxRow: /Property tax/.test(html), refi: canRefi() && /id="refi"/.test(html), he: heMax(), heBtn: /id="heloan"/.test(html), took: takeHE(2000),
        heLeft: S.heLeft, outlook: moneyOutlook(52).weeks.some(w => w.big.some(b => /Property tax/.test(b[0]))) };
    }
    S = null; closeSheet(); render(); return out;
  });
  const e = r.easy, n = r.normal, h = r.hard;
  assert(e.idx === 1 && e.pay[0] === e.pay[1] && e.rates === 1 && e.grows === 1 && e.mood === 'steady', `Easy market ${JSON.stringify(e)}`);
  assert(!e.ptax && e.ptaxNow === 0 && !e.market && !e.rateRow && !e.taxRow && !e.outlook, `Easy should have no market or tax rows ${JSON.stringify(e)}`);
  assert(n.idx !== 1 && n.rates + n.grows > 2 && n.ptax && n.market && n.rateRow && n.taxRow && n.outlook, `Normal market and tax ${JSON.stringify(n)}`);
  for (const [d, x] of [['easy', e], ['normal', n]]) assert(!x.refi && x.he === 0 && !x.heBtn && !x.took && x.heLeft === 0, `${d} should have no home loans ${JSON.stringify(x)}`);
  assert(h.refi && h.he > 0 && h.heBtn && h.took && h.heLeft > 0 && h.ptax && h.market, `Hard keeps home loans ${JSON.stringify(h)}`);
});

await t.check('vehicles: Easy has no oil-change stop, breakdown talk or January tabs bill; Normal and Hard do', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of ['easy', 'normal', 'hard']) {
      newGame('Car', 'two', 0, { diff: d }); S.noEvents = true; S.money = 50000;
      S.date = new Date(2027, 11, 27).getTime(); S.tabsYear = 2027;
      const lines = []; for (let i = 0; i < 3; i++) { weekTick(true); lines.push(...S.last.lines.map(l => l[0])); }
      S.date = new Date(2028, 11, 20).getTime();
      tab = 'life'; render();
      out[d] = { oil: townStops('dayton').some(s => s.id === 'oil'), oilBlocked: stopBlocked(stopById('oil')), tabs: lines.some(l => /Vehicle tabs/.test(l)),
        card: /oil change/i.test(document.querySelector('#main').textContent), outlook: moneyOutlook(4).weeks.some(w => w.big.some(b => /Vehicle tabs/.test(b[0]))) };
    }
    S = null; closeSheet(); render(); return out;
  });
  assert(!r.easy.oil && r.easy.oilBlocked && !r.easy.tabs && !r.easy.card && !r.easy.outlook, `Easy ${JSON.stringify(r.easy)}`);
  for (const d of ['normal', 'hard']) assert(r[d].oil && !r[d].oilBlocked && r[d].tabs && r[d].card && r[d].outlook, `${d} ${JSON.stringify(r[d])}`);
});

await t.check('kids: Easy never has kids (no bill, no row, no Young parent start); Normal and Hard do', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of ['easy', 'normal', 'hard']) {
      newGame('Kid', 'two', 0, { diff: d, bg: 'parent' });
      const start = [S.bg, S.kids.length];
      S.kids = [S.ageMonths - 30]; S.noEvents = true; weekTick(true);
      tab = 'life'; render();
      out[d] = { start, home: kidsAtHome(), bill: S.last.lines.some(l => /^Kid/.test(l[0])), row: [...document.querySelectorAll('#main .kv span:first-child')].some(s => s.textContent === 'Kids'),
        council: [...document.querySelectorAll('#main .kv span:first-child')].some(s => s.textContent === 'Town council') };
    }
    S = null; closeSheet(); render(); return out;
  });
  assert(r.easy.start.join() === 'fresh,0' && r.easy.home === 0 && !r.easy.bill && !r.easy.row && !r.easy.council, `Easy ${JSON.stringify(r.easy)}`);
  for (const d of ['normal', 'hard']) assert(r[d].start.join() === 'parent,1' && r[d].home === 1 && r[d].bill && r[d].row && r[d].council, `${d} ${JSON.stringify(r[d])}`);
});

await t.check('start screen: the Young parent start hides when Easy is picked and comes back for Normal', async () => {
  await ev(() => { localStorage.clear(); setPref('newHere', 1); setPref('moreOpts', true); S = null; closeSheet(); render(); });
  assert(await page.isVisible('[data-bg="parent"]'), 'Normal is picked first, so Young parent should show');
  await page.click('[data-bg="parent"]');
  await page.click('[data-diff="easy"]');
  assert(!(await page.isVisible('[data-bg="parent"]')), 'Young parent should hide in Easy');
  assert((await page.getAttribute('[data-bg="fresh"]', 'aria-pressed')) === 'true', 'the pick should fall back to Fresh start');
  await page.click('[data-diff="normal"]');
  assert(await page.isVisible('[data-bg="parent"]'), 'Young parent should come back in Normal');
});

await t.check('health: sick hours, injuries, coverage, care stops, aging drift, Dad\'s care and paid leave by tier', async () => {
  const r = await ev(() => {
    localStorage.clear(); const out = {};
    for (const d of ['easy', 'normal', 'hard']) {
      newGame('Hp', 'life', 0, { diff: d }); S.noEvents = true; S.money = 50000; S.jobId = 'diner';
      for (let i = 0; i < 12; i++) { weekTick(true); S.pendingEv = null; }
      const sick = [S.sickHrs, canSick(1)];
      S.ins.dental = true; S.ins.amb = true;
      const cov = [insExtras().length, dentalOn(), ambOn(), ambRide()];
      S.ins.amb = false; const ride = ambRide();
      S.ageMonths = 76 * 12; S.car = 'beater';
      const care = [vanOK(), shotDue(), townStops('wallawalla').map(s => s.id).filter(id => ['shots', 'pt', 'respite'].includes(id)).join('+'), maxHealth(80) < 100];
      S.ageMonths = 45 * 12; S.jobId = JOBS.find(j => !j.wear).id; S.deskHabit = false;
      const why = []; const desk = bodyDrift(45, job(), why).dH < 0;
      S.injury = { part: 'back', linger: true }; const linger = bodyDrift(45, null, []).dH < 0;
      S.injury = null;
      S.parent = { who: 'leave', until: S.turn + 50, leaveEnd: S.turn + 10, drain: { happy: 2, health: 1 } };
      const dad = [caring(), onLeave(), !!careWay(), dadChoices(() => true).filter(c => !c.if || c.if()).length];
      tab = 'life'; render(); const card = document.querySelector('#healthcard').textContent;
      out[d] = { sick, cov, ride, care, desk, linger, dad, cardSick: /Sick hours/.test(card), cardDental: /Dental/.test(card), cardDad: /Dad/.test(card), cardWear: /wears on/.test(card) };
    }
    S = null; closeSheet(); render(); return out;
  });
  const e = r.easy, n = r.normal, h = r.hard;
  assert(e.sick[0] === 0 && !e.sick[1] && !e.cardSick, `Easy sick hours ${JSON.stringify(e)}`);
  assert(n.sick[0] > 0 && n.sick[1] && n.cardSick, `Normal sick hours ${JSON.stringify(n)}`);
  for (const [d, x] of [['easy', e], ['normal', n]]) {
    assert(x.cov.join() === '0,false,false,0' && x.ride === 0 && !x.cardDental, `${d} coverage ${JSON.stringify(x)}`);
    assert(!x.care[0] && !x.care[1] && x.care[2] === '' && !x.linger && !x.cardWear, `${d} care stops and injuries ${JSON.stringify(x)}`);
    assert(x.dad.join() === 'false,false,false,3' && !x.cardDad, `${d} Dad's care ${JSON.stringify(x.dad)}`);
  }
  assert(!e.care[3] && !e.desk && n.care[3] && n.desk, `aging drift ${JSON.stringify([e.care, e.desk, n.care, n.desk])}`);
  assert(h.cov[0] === 2 && h.cov[1] && h.cov[2] && h.ride > 0 && h.cardDental, `Hard coverage ${JSON.stringify(h)}`);
  assert(h.care[0] && h.care[1] && h.care[2] === 'shots+pt+respite' && h.linger && h.cardWear, `Hard care ${JSON.stringify(h)}`);
  assert(h.dad.join() === 'true,true,true,4' && h.cardDad, `Hard Dad's care ${JSON.stringify(h.dad)}`);
});

await t.check('a year in each difficulty with busy events: area B save fields stay at defaults below their tier', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of ['easy', 'normal', 'hard']) {
      const f = { kids: 0, council: 0, sick: 0, injury: 0, parent: 0, ltc: 0, care: 0, idx: 0, he: 0, svc: 0 };
      for (const [job, age] of [['farmhand', 30], ['cellar', 52], ['diner', 58]]) {
        localStorage.clear(); newGame('Yr', 'life', 0, { diff: d, rules: { events: 'busy' } });
        S.money = 300000; S.jobId = job; S.jobMonths = 12; S.ageMonths = age * 12; S.partner = true; S.community = 70;
        S.home = 'fixer'; S.mortgage = newMortgage('fixer'); S.equity = 50000;
        for (let i = 0; i < 52 && !S.over; i++) {
          const res = weekTick(true);
          if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; }
          if (res.ending) break;
        }
        f.kids += S.kids.length; f.council += S.council ? 1 : 0; f.sick += S.sickHrs || 0; f.injury += S.injury ? 1 : 0; f.parent += S.parent ? 1 : 0;
        f.ltc += S.ltc ? 1 : 0; f.care += S.care ? 1 : 0; f.idx += Math.abs(S.homeIdx - 1) > 1e-9 ? 1 : 0; f.he += S.heLeft > 0 ? 1 : 0;
      }
      out[d] = f;
    }
    S = null; closeSheet(); render(); return out;
  });
  const e = r.easy, n = r.normal;
  assert(e.kids === 0 && e.council === 0 && e.sick === 0 && e.idx === 0, `Easy ${JSON.stringify(e)}`);
  for (const [d, x] of [['easy', e], ['normal', n]]) assert(x.injury === 0 && x.parent === 0 && x.ltc === 0 && x.care === 0 && x.he === 0, `${d} ${JSON.stringify(x)}`);
  assert(n.sick > 0 && n.idx > 0, `Normal should run sick hours and the market ${JSON.stringify(n)}`);
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll stage 2B difficulty checks passed');
