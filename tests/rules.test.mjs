// Game-rules tests: check the game's math and rules directly, without tapping through screens.
// Pay, taxes, bills, gas, rising prices, loans, the 401(k), retirement, the Life Score, focus streaks and ruts,
// events, health, debt, school, family, save migration. Run with: npm run test:rules
import { serve, launch, runner, seedScript, assert, near } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(424242));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(srv.url, { waitUntil: 'load' });
// test helpers inside the page: a fresh life with no random events, and one week played
await page.evaluate(() => {
  window.fresh = (len = 'two', extra = {}) => { newGame('Rules', len, 0); S.noEvents = true; Object.assign(S, extra); return S; };
  window.week = () => { const r = weekTick(false); return { ...r, lines: Object.fromEntries(S.last.lines) }; };
  window.weeks = n => { let r; for (let i = 0; i < n; i++) r = weekTick(false); return r; };
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();
const W = 12 / 52;

await t.check('a weekly paycheck is the monthly pay × 12/52, taxed 15%', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'rest' }); return week().lines; });
  assert(near(r['Paycheck'], 2500 * W), `paycheck ${r['Paycheck']}`);
  assert(near(r['Taxes'], -2500 * W * 0.15), `taxes ${r['Taxes']}`);
  assert(near(r['Rent'], -550 * W) && near(r['Food & utilities'], -520 * W) && near(r['Insurance & phone'], -160 * W), 'bills are off');
});

await t.check('Work extra hours pays 15% more', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'work' }); return week().lines; });
  assert(near(r['Paycheck + overtime'], 2500 * W * 1.15), `overtime paycheck ${r['Paycheck + overtime']}`);
});

await t.check('gas covers the commute both ways on 21 workdays plus errands, at your vehicle\'s mileage', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'foodplant' }); const a = week().lines['Gas (commute + errands)'];
    fresh('two', { jobId: 'foodplant', car: 'sedan' }); const b = week().lines['Gas (commute + errands)']; return { a, b }; });
  assert(near(r.a, -(58 * 2 * 21 + 300) * W * 3.89 / 15), `pickup gas ${r.a}`);
  assert(near(r.b, -(58 * 2 * 21 + 300) * W * 3.89 / 32), `sedan gas ${r.b}`);
});

await t.check('prices rise about 3% a year and pay about 2.5%', async () => {
  const r = await ev(() => { fresh('five', { jobId: 'farmhand' }); weeks(52); return { col: S.col, wage: S.wage, rent: week().lines['Rent'], pay: S.last.lines.find(l => l[0] === 'Paycheck')[1] }; });
  assert(near(r.col, 1.03, 0.002) && near(r.wage, 1.025, 0.002), `after a year col ${r.col}, wage ${r.wage}`);
  assert(r.rent < -550 * W * 1.029, 'rent did not rise with prices');
  assert(r.pay > 2500 * W * 1.024, 'pay did not rise');
});

await t.check('a mortgage stays the same while prices rise, and the home builds equity', async () => {
  const r = await ev(() => {
    fresh('five', { jobId: 'farmhand', money: 50000 }); render();
    moveHome('fixer'); document.querySelector('#y').click();
    const m0 = week().lines['Mortgage'], eq0 = S.equity; weeks(104); const m1 = week().lines['Mortgage'];
    return { m0, m1, eq0, eq1: S.equity, home: S.home };
  });
  assert(r.home === 'fixer' && near(r.m0, -950 * W) && near(r.m1, r.m0, 0.0001), `mortgage moved: ${r.m0} → ${r.m1}`);
  assert(r.eq1 > r.eq0 + 260 * 24, `equity barely grew: ${r.eq0} → ${r.eq1}`);
});

await t.check('selling a home on moving returns its equity minus 6%', async () => {
  const r = await ev(() => { fresh('two', { money: 50000 }); render(); moveHome('fixer'); document.querySelector('#y').click();
    const eq = S.equity, m = S.money; moveHome('room'); document.querySelector('#y').click(); return { eq, m, after: S.money, equity: S.equity }; });
  assert(near(r.after, r.m + Math.round(r.eq * 0.94) - 300, 0.001) && r.equity === 0, `sale math off: ${JSON.stringify(r)}`);
});

await t.check('a financed pickup charges a fixed payment for 60 months, then is paid off', async () => {
  const r = await ev(() => { fresh('five', { money: 20000, jobId: 'farmhand' }); render(); buyCar('truck'); document.querySelector('#y').click();
    const p0 = week().lines['Truck payment']; weeks(52 * 5 + 2); return { p0, left: S.loanLeft, lines: Object.keys(Object.fromEntries(S.last.lines)) }; });
  assert(near(r.p0, -640 * W), `payment ${r.p0}`);
  assert(r.left === 0 && !r.lines.includes('Truck payment'), 'loan should be paid off after 5 years');
});

await t.check('the 401(k) takes 5% pre-tax, adds a 3% match, and grows', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', k401rate: 1 }); const l = week().lines; return { l, k: S.k401 }; });
  const g = 2500 * W;
  assert(near(r.l['401(k) contribution'], -g * 0.05), `contribution ${r.l['401(k) contribution']}`);
  assert(near(r.l['Taxes'], -(g * 0.95) * 0.15), 'taxes should come after the contribution');
  assert(near(r.k, g * 0.08 * Math.pow(1.06, 1/52), 0.01), `balance ${r.k}`);
});

await t.check('retirement pays Social Security and draws about 4% a year from the 401(k)', async () => {
  const r = await ev(() => { fresh('life', { retired: true, k401: 100000 }); return week().lines; });
  assert(near(r['Social Security'], 1900 * W) && near(r['401(k) withdrawal'], 100000 * 0.04 * W / 12), JSON.stringify(r));
});

await t.check('the Life Score maps each part to 0–100 and weights 30/20/20/30', async () => {
  const r = await ev(() => { fresh('two');
    S.monthsPlayed = 10; S.happySum = 600; S.healthSum = 675; S.community = 50;
    S.money = 45000 - S.carValue; S.equity = 0; S.k401 = 0;
    const mid = lifeScore();
    S.happySum = 1000; S.healthSum = 1000; S.community = 100; S.money = 1e7;
    const top = lifeScore();
    S.happySum = 0.001; S.healthSum = 0.001; S.community = 0; S.money = -1e5;
    const low = lifeScore();
    return { mid, top, low };
  });
  assert(r.mid.parts.happy === 50 && r.mid.parts.health === 50 && r.mid.parts.community === 50 && r.mid.parts.wealth === 50 && r.mid.score === 50, `middle life: ${JSON.stringify(r.mid.parts)} = ${r.mid.score}`);
  assert(r.top.score === 100 && r.top.title === 'Legend of the Burg', `top: ${r.top.score}`);
  assert(r.low.score === 0 && r.low.title === 'Tumbleweed', `bottom: ${r.low.score}`);
});

await t.check('a focus works fully for 4 weeks in a row, then fades to 30%; classes never fade', async () => {
  const r = await ev(() => [1,4,5,6,10,20].map(n => focusEffect('rest', n)).concat([focusEffect('study', 40)]));
  assert(r[0] === 1 && r[1] === 1 && near(r[2], 0.88, 0.001) && near(r[3], 0.76, 0.001) && r[4] === 0.3 && r[5] === 0.3 && r[6] === 1, r.join(', '));
});

await t.check('after 8 weeks of the same focus you\'re in a rut: a warning, and happiness drops', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand', focus: 'community', streakF: 'community', streakN: 8, happy: 60 }); const rut = week();
    const h1 = S.happy;
    fresh('two', { jobId: 'farmhand', focus: 'community', streakF: 'community', streakN: 3, happy: 60 }); week();
    return { note: rut.notes.join(' '), rutHappy: h1, okHappy: S.happy };
  });
  assert(r.note.includes('rut'), 'no rut warning');
  assert(r.okHappy - r.rutHappy > 1.1, `rut cost only ${(r.okHappy - r.rutHappy).toFixed(2)} happiness`);
});

await t.check('Rest stops helping in the mid 80s', async () => {
  const r = await ev(() => { fresh('two', { focus: 'rest', happy: 86, health: 86, jobId: 'farmhand' }); const h0 = S.happy; week(); return { h0, h1: S.happy }; });
  assert(r.h1 <= r.h0, `rest raised happiness above the cap: ${r.h0} → ${r.h1}`);
});

await t.check('events follow their rules: seasons, cooldowns, once-only, and job-based layoffs', async () => {
  const r = await ev(() => {
    fresh('life', { jobId: 'farmhand', jobMonths: 24, ageMonths: 45 * 12 });
    const pickN = (m, n) => { const seen = {}; for (let i = 0; i < n; i++) { const e = pickEvent(m); if (e) seen[e.title] = 1; } return seen; };
    const june = pickN(5, 400), may = pickN(4, 400);
    S.evDone['An inheritance'] = 1; const afterInherit = pickN(5, 400);
    S.evCd['Windstorm'] = S.turn + 5; const cooling = pickN(5, 400);
    const ev2 = EVENTS.find(e => e.title === 'Layoffs');
    const farm = ev2.w(); S.jobId = 'retail'; const retail = ev2.w(); S.jobId = 'rn'; const rn = ev2.w();
    return { juneCeleb: !!june['Celebration Days'], mayCeleb: !!may['Celebration Days'], inheritOnce: !afterInherit['An inheritance'], inheritSeen: !!june['An inheritance'] || !!may['An inheritance'], cool: !cooling['Windstorm'], farm, retail, rn };
  });
  assert(r.mayCeleb && !r.juneCeleb, 'Celebration Days should only come in May');
  assert(r.inheritOnce, 'an inheritance came twice');
  assert(r.cool, 'an event came back during its cooldown');
  assert(r.farm === 0 && r.retail > r.rn && r.rn > 0, `layoff weights farm ${r.farm}, retail ${r.retail}, nurse ${r.rn}`);
});

await t.check('at 0 health you go to the hospital (outside Lifetime), with a bill', async () => {
  const r = await ev(() => { fresh('two', { health: -5, jobId: 'hanford', focus: 'work' }); const m = S.money; const res = week(); return { note: res.notes.join(' '), health: S.health, paid: m + S.last.net - S.money }; });
  assert(r.note.includes('hospital') && r.health === 30 && near(r.paid, 6500, 0.02), JSON.stringify(r));
});

await t.check('nonstop overtime in a hard job lands you in the hospital within about two years; a balanced life stays healthy', async () => {
  const r = await ev(() => {
    const run = plan => { fresh('five', { jobId: 'hanford' }); let first = null, low = 100;
      for (let w = 0; w < 156; w++) { S.focus = plan(w); const res = weekTick(false); low = Math.min(low, S.health); if (first === null && res.notes.some(n => n.includes('hospital'))) first = w; }
      return { first, low }; };
    return { grind: run(() => 'work'), balanced: run(w => ['work', 'community', 'outdoors', 'rest'][w % 4]) };
  });
  assert(r.grind.first !== null && r.grind.first < 130, `grinding never reached the hospital (lowest health ${Math.round(r.grind.low)})`);
  assert(r.balanced.first === null && r.balanced.low > 60, `a balanced life got sick (lowest ${Math.round(r.balanced.low)})`);
});

await t.check('pushing through low health with overtime makes it drop faster', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', health: 30, focus: 'work' }); week(); const pushed = S.health;
    fresh('two', { jobId: 'farmhand', health: 30, focus: 'community' }); week(); return { pushed, eased: S.health }; });
  assert(r.eased - r.pushed > 1, `overtime at low health cost only ${(r.eased - r.pushed).toFixed(2)} more`);
});

await t.check('debt charges about 1.5% a month, and below -$40,000 the game ends', async () => {
  const r = await ev(() => { fresh('two', { money: -10000 }); const i = week().lines['Interest on debt'];
    fresh('two', { money: -40500 }); const end = week().ending; return { i, end }; });
  assert(near(r.i, -10000 * 0.015 * W, 0.02), `interest ${r.i}`);
  assert(/debt/.test(r.end || ''), 'no debt ending');
});

await t.check('unemployment benefits last 6 months after a layoff, then stop', async () => {
  const r = await ev(() => { fresh('two', { jobId: null, ui: 6 }); const first = week().lines['Unemployment benefits']; weeks(26); return { first, later: Object.fromEntries(S.last.lines)['Unemployment benefits'] }; });
  assert(near(r.first, 1100 * W) && !r.later, JSON.stringify(r));
});

await t.check('16 weeks of classes earn a trade certificate, and tuition is charged weekly', async () => {
  const r = await ev(() => { fresh('two', { focus: 'study' }); const tu = week().lines['Tuition']; weeks(14); const mid = S.edu; const res = week(); return { tu, mid, edu: S.edu, note: res.notes.join(' ') }; });
  assert(near(r.tu, -300 * W) && r.mid === 0 && r.edu === 1 && r.note.includes('Trade certificate'), JSON.stringify(r));
});

await t.check('kids cost about $650 a month each until they turn 18', async () => {
  const r = await ev(() => { fresh('life'); S.kids = [S.ageMonths, S.ageMonths - 17.9 * 12, S.ageMonths - 19 * 12]; const l = week().lines; return l; });
  assert(near(r['Kids (2)'], -650 * 2 * W), JSON.stringify(r));
});

await t.check('net worth is cash + home equity + vehicle + 401(k) − what\'s left on the truck loan', async () => {
  const r = await ev(() => { fresh('two', { money: 1000, equity: 20000, carValue: 5000, k401: 3000, loanLeft: 10, loanPay: 500 }); return netWorth(); });
  assert(near(r, 1000 + 20000 + 5000 + 3000 - 10 * 500 * 0.85, 0.0001), `net worth ${r}`);
});

await t.check('older saves are filled in when loaded (and an owned home gets its mortgage)', async () => {
  const r = await ev(() => { const old = { name: 'Old', len: 'two', home: 'fixer', money: 5 }; return migrate(old); });
  assert(r.col === 1 && r.wage === 1 && Array.isArray(r.kids) && r.k401 === 0 && r.mortgage === 950 && r.streakN === 0 && r.slot === 0, JSON.stringify(r));
});

await t.check('one application per week; a practice life is always hired', async () => {
  const r = await ev(() => { fresh('two'); render(); S.practice = true; apply('diner'); closeSheet(); const hired = S.jobId; const applied = S.applied;
    S.jobId = null; apply('cellar'); closeSheet(); return { hired, applied, second: S.jobId }; });
  assert(r.hired === 'diner' && r.applied && r.second === null, JSON.stringify(r));
});

await t.check('the year in review comes once each New Year, with the year\'s milestones', async () => {
  const r = await ev(() => { fresh('five'); S.date = new Date(2027, 11, 20).getTime(); log('Hired as a test');
    const reviews = []; for (let i = 0; i < 60; i++) { const res = weekTick(false); if (res.review) reviews.push(res.review); } return reviews.map(x => ({ year: x.year, m: x.milestones })); });
  assert(r.length === 2 && r[0].year === 2027 && r[1].year === 2028, `reviews: ${JSON.stringify(r.map(x => x.year))}`);
  assert(r[0].m.some(x => x.includes('Hired as a test')), 'milestone missing');
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} rules check(s) failed`); process.exit(1); }
console.log('All rules checks passed');
