// Difficulty modes stage 2A (to-do list 2, D2 + D3): Jobs & work, School & training, Money & investing.
// Each feature is fully off below its tier (no card, sheet row, bill line, choice or Journal line, and its save
// fields stay at their defaults) and on in its own difficulty, with the plan's fallbacks in its place.
// Run with: node tests/difficulty-a.test.mjs
import { serve, launch, seedScript, runner, assert } from './helpers.mjs';

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

// a quiet life in a difficulty, with test helpers on the page
await ev(() => {
  window.life = (d, extra = {}) => { localStorage.clear(); closeSheet(); newGame('Tier', 'five', 0, { diff: d }); S.noEvents = true; Object.assign(S, extra); return S; };
  window.week = () => { const res = weekTick(false); return Object.fromEntries((S.last && S.last.lines || []).map(([l, v]) => [l, v])); };
  window.tabHTML = k => { closeSheet(); tab = k; render(); return document.querySelector('#main').innerHTML; };
  window.logText = () => (S.log || []).map(l => typeof l === 'string' ? l : l.m || '').join('\n');
});
const D = ['easy', 'normal', 'hard'];
const each = async fn => { const out = {}; for (const d of D) out[d] = await ev(fn, d); return out; };
const expect = (r, key, tier, label) => {
  const want = { easy: tier === 'easy', normal: tier !== 'hard', hard: true };
  for (const d of D) assert(!!r[d][key] === want[d], `${label}: ${d} should ${want[d] ? '' : 'not '}have it ${JSON.stringify(r[d])}`);
};

await t.check('jobs.ladder (Normal): no ladder, rungs or promotion in Easy; a small raise each January instead', async () => {
  const r = await each(d => {
    life(d, { edu: 1 }); startJob('diner'); S.tenure = 40; S.rung = 1;
    const card = tabHTML('jobs'), promo = EVENTS.find(e => e.title === 'A promotion offer');
    const out = { ladder: /class="ladder"/.test(card) || /Next step up/.test(card), rung: rungOf().payMult > 1, next: !!nextRung(), promo: !!promo.when() };
    life(d, { edu: 1, date: new Date(2027, 11, 27).getTime() }); startJob('diner'); S.tenure = 12; const r0 = S.raise;
    for (let i = 0; i < 2; i++) week();
    out.yearRaise = S.raise > r0 && /Yearly raise/.test(logText());
    return out;
  });
  expect(r, 'ladder', 'normal', 'the job ladder'); expect(r, 'rung', 'normal', 'rung pay'); expect(r, 'next', 'normal', 'the next rung');
  for (const d of D) assert(!!r[d].yearRaise === (d === 'easy'), `the yearly raise is Easy's fallback: ${d} ${JSON.stringify(r[d])}`);
});

await t.check('jobs.interview + jobs.perks (Normal): Easy hires on the odds alone, with no asking for more, sign-on or clearance', async () => {
  const r = await each(d => {
    life(d, { edu: 3 }); apply('diner');
    const out = { interview: !!S.interview || /Interview:/.test(document.querySelector('#sheet').textContent) };
    closeSheet(); life(d, { edu: 3 }); hired(jobById('cna'));
    out.ask = !!document.querySelector('#sheet [data-i="1"]'); out.signOn = !!document.querySelector('#sheet [data-i="2"]');
    closeSheet(); life(d, { edu: 3 }); startJob('hanford'); out.clear = S.clearAt >= 0 || clearing();
    out.tag = /🔐 clearance/.test(tabHTML('jobs'));
    return out;
  });
  expect(r, 'interview', 'normal', 'the interview sheet'); expect(r, 'ask', 'normal', 'asking for 5% more');
  expect(r, 'signOn', 'normal', 'the sign-on bonus'); expect(r, 'clear', 'normal', 'the clearance wait'); expect(r, 'tag', 'normal', 'the clearance tag');
});

await t.check('jobs.layoffs (Hard): below Hard seasonal jobs run all year, and a clearance never costs the job', async () => {
  const r = await each(d => {
    life(d, { edu: 1, date: new Date(2027, 5, 1).getTime() });
    const out = { season: !jobInSeason(jobById('lift')), tag: /🗓️/.test(jobRow(jobById('lift'))) };
    life(d, { edu: 1, date: new Date(2027, 2, 29).getTime() }); startJob('lift'); S.tenure = 5;
    for (let i = 0; i < 3; i++) week();
    out.laidOff = !S.jobId || !!S.recall || S.ui > 0;
    life(d, { edu: 3, money: -40000, mode: 'relaxed' }); startJob('scientist'); S.clearAt = S.turn; const old = Math.random; Math.random = () => 0.1;
    week(); Math.random = old; out.denied = S.jobId !== 'scientist';
    return out;
  });
  expect(r, 'season', 'hard', 'the off-season'); expect(r, 'tag', 'hard', 'the season tag'); expect(r, 'laidOff', 'hard', 'the seasonal layoff');
  expect(r, 'denied', 'hard', 'a denied clearance');
});

await t.check('jobs.union (Hard): no dues, step raises, contract votes or union tags below Hard', async () => {
  const r = await each(d => {
    life(d, { edu: 1 }); startJob('rail');
    const lines = week(), html = tabHTML('jobs');
    return { dues: 'Union dues' in lines, contract: S.contractAt >= 0, tag: /🪪 union/.test(html), card: /Union job:/.test(html) };
  });
  for (const k of ['dues', 'contract', 'tag', 'card']) expect(r, k, 'hard', `union ${k}`);
});

await t.check('jobs.seasonal (Normal): no harvest overtime or mall perks in Easy', async () => {
  const r = await each(d => { life(d); S.jobId = 'retail'; const out = { perk: retailPerk('pasco') }; S.jobId = 'foodplant'; out.ot = plantOT(jobById('foodplant'), 8) > 1; return out; });
  expect(r, 'perk', 'normal', 'the retail discount'); expect(r, 'ot', 'normal', 'plant overtime');
});

await t.check('jobs.commute (Normal): no carpool, bus, remote days or the remote job in Easy', async () => {
  const r = await each(d => {
    life(d, { edu: 3, community: 50 }); startJob('prof');
    const html = tabHTML('jobs');
    const out = { carpool: /🚙 Carpool/.test(html), remoteJob: !!document.querySelector('[data-job="remote"]'), remoteDays: driveDays(job()) < 1 };
    life(d, { edu: 1 }); startJob('clerk'); out.bus = /County bus/.test(tabHTML('jobs')); S.bus = true; out.busLine = 'County bus pass' in week();
    return out;
  });
  for (const k of ['carpool', 'remoteJob', 'remoteDays', 'bus', 'busLine']) expect(r, k, 'normal', `commute ${k}`);
});

await t.check('school.certs (Normal): no certificate courses in Easy, and no job needs one', async () => {
  const r = await each(d => { life(d); const html = tabHTML('life'); return { card: /Short certificates/.test(html) && !!document.querySelector('[data-cert]'), lock: !!extraLock(jobById('welder')) }; });
  expect(r, 'card', 'normal', 'the certificate list'); expect(r, 'lock', 'normal', 'the certificate lock');
});

await t.check('money.k401 + money.index + money.outlook (Normal): no 401(k), investing or outlook in Easy', async () => {
  const r = await each(d => {
    life(d, { money: 20000 }); startJob('diner'); S.k401rate = 2;
    const html = tabHTML('life'), lines = week();
    return { k401: !!document.querySelector('[data-k401]'), k401line: '401(k) contribution' in lines, saved: S.k401 > 0,
      invest: !!document.querySelector('[data-inv]') && invest(1000), outlook: !!document.querySelector('#outlook') && /Money outlook/.test(html) };
  });
  for (const k of ['k401', 'k401line', 'saved', 'invest', 'outlook']) expect(r, k, 'normal', k);
});

await t.check('money.insuranceChoices (Hard): below Hard everyone has the standard $220 plan', async () => {
  const r = await each(d => {
    life(d); const html = tabHTML('life'); S.ins.auto = 'liab';
    return { sheet: !!document.querySelector('#inssheet') && /Change coverage/.test(html), choice: insMonthly() !== 220 && youPay('auto', 3000) === 3000 };
  });
  expect(r, 'sheet', 'hard', 'the insurance sheet'); expect(r, 'choice', 'hard', 'a coverage choice');
});

await t.check('money.collections + money.bankruptcy (Hard): below Hard debt only charges interest; Easy debt never ends the game, Normal at -$40,000', async () => {
  const r = await each(d => {
    life(d, { money: -100, debtWeeks: 12 }); const lines = week();
    const out = { fee: '📞 Collections fee' in lines, coll: inCollections() || /collections/.test(logText()), bk: (S.mode = d === 'easy' ? 'relaxed' : d, canBankrupt()) };
    out.limit = debtLimit();
    return out;
  });
  expect(r, 'fee', 'hard', 'the collections fee'); expect(r, 'coll', 'hard', 'collections'); expect(r, 'bk', 'hard', 'bankruptcy');
  assert(r.easy.limit == null && r.normal.limit === -40000, `debt endings ${r.easy.limit} / ${r.normal.limit}`);
});

await t.check('money.inflation (Normal): Easy prices and pay stay at 2027 levels', async () => {
  const r = await each(d => { life(d); startJob('diner'); for (let i = 0; i < 30; i++) week(); return { grow: S.col > 1.001 && S.wage > 1.001, row: /Prices since 2027/.test(tabHTML('life')) }; });
  expect(r, 'grow', 'normal', 'price growth'); expect(r, 'row', 'normal', 'the prices row');
});

await t.check('a year in Easy with events on: none of these features show up in the Journal, and their save fields stay at defaults', async () => {
  const r = await ev(() => {
    localStorage.clear(); newGame('Calm', 'five', 0, { diff: 'easy', rules: { events: 'busy' } }); S.edu = 3; S.money = 5000; startJob('rail');
    for (let i = 0; i < 52 && !S.over; i++) {
      const res = weekTick(true);
      if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; }
      if (res.ending) break;
    }
    const txt = logText();
    return { bad: ['Union step raise', 'collections', 'security clearance', 'promot', 'furlough', 'strike', '401(k)', 'vintage', 'index funds', 'certificate'].filter(w => txt.toLowerCase().includes(w.toLowerCase())),
      fields: { rung: S.rung, k401: S.k401, stocks: S.stocks, wine: S.wine.length, col: S.col, wage: S.wage, debtWeeks: S.debtWeeks, bk: S.bk, strike: S.strike, furlough: S.furlough, contractAt: S.contractAt, clearAt: S.clearAt, certs: Object.keys(S.certs).length, carpool: S.carpool, bus: S.bus, ui: S.ui, interview: S.interview, ins: S.ins.auto } };
  });
  assert(!r.bad.length, `Journal lines from switched-off features: ${r.bad.join(', ')}`);
  const f = r.fields;
  assert(f.rung === 0 && f.k401 === 0 && !f.stocks && !f.wine && f.col === 1 && f.wage === 1 && !f.debtWeeks && f.bk == null && !f.strike && !f.furlough, JSON.stringify(f));
  assert(f.contractAt === -1 && f.clearAt === -1 && !f.certs && !f.carpool && !f.bus && !f.ui && !f.interview && f.ins === 'full', JSON.stringify(f));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('\n')); });
await browser.close(); srv.close();
if (t.failed) { console.log(`${t.failed} difficulty-a check(s) failed`); process.exit(1); }
console.log('difficulty-a: all checks passed');
