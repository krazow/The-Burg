// Game-rules tests: check the game's math and rules directly, without tapping through screens.
// Pay, taxes, bills, gas, rising prices, loans, the 401(k), retirement, the Life Score, focus streaks and ruts,
// events, health, debt, school, family, save migration, trips around the region. Run with: npm run test:rules
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

await t.check('a weekly paycheck is the monthly pay × 12/52, taxed 13% on a small paycheck (i75-b03)', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'rest' }); return week().lines; });
  assert(near(r['Paycheck'], 3100 * W), `paycheck ${r['Paycheck']}`);
  assert(near(r['Taxes'], -3100 * W * 0.13), `taxes ${r['Taxes']}`);
  assert(near(r['Rent'], -650 * W) && near(r['Food & utilities'], -700 * W) && near(r['Insurance & phone'], -220 * W), 'bills are off');
  assert(near(r['Health care'], -130 * W), `health care at work before 50 ${r['Health care']}`);
});

await t.check('i75-b27: Work extra hours pays time and a half (+35%) and wears on you faster', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'work' }); return { l: week().lines, fx: FOCUS.work.fx }; });
  assert(near(r.l['Paycheck + overtime'], 3100 * W * 1.35), `overtime paycheck ${r.l['Paycheck + overtime']}`);
  assert(r.fx.happy === -2.5 && r.fx.health === -2, JSON.stringify(r.fx));
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
  const g = 3100 * W;
  assert(near(r.l['401(k) contribution'], -g * 0.05), `contribution ${r.l['401(k) contribution']}`);
  assert(near(r.l['Taxes'], -(g * 0.95) * 0.13), 'taxes should come after the contribution');
  assert(near(r.k, g * 0.08 * Math.pow(1.06, 1/52), 0.01), `balance ${r.k}`);
});

await t.check('retirement pays Social Security and draws about 4% a year from the 401(k)', async () => {
  const r = await ev(() => { fresh('life', { retired: true, k401: 100000, earnYears: 35, earnSum: 35 * (2000 + 4000 / 6) }); return week().lines; });
  assert(near(r['Social Security'], 1900 * W) && near(r['401(k) withdrawal'], 100000 * 0.04 * W / 12), JSON.stringify(r));
});

await t.check('the Life Score maps each part to 0–100 and weights 30/20/20/30', async () => {
  const r = await ev(() => { fresh('two');
    S.monthsPlayed = 10; S.happySum = 600; S.healthSum = 675; S.commSum = 500; S.community = 50;
    S.money = 45000 - S.carValue; S.equity = 0; S.k401 = 0;
    const mid = lifeScore();
    S.happySum = 1000; S.healthSum = 1000; S.commSum = 1000; S.community = 100; S.money = 1e7;
    const top = lifeScore();
    S.happySum = 0.001; S.healthSum = 0.001; S.commSum = 0; S.community = 0; S.money = -1e5;
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
  const r = await ev(() => { fresh('two', { health: -5, jobId: 'hanford', focus: 'work' }); const m = S.money; const res = week(); return { note: res.notes.join(' '), health: S.health, paid: -(res.lines['🏥 Hospital bill'] || 0) }; });   // i71-b05: the bill is a money line now
  assert(r.note.includes('hospital') && r.health === 30 && near(r.paid, 6500 + 1200, 0.02), JSON.stringify(r));   // i74-a04: plus the ambulance ride (no membership)
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
  assert(near(r.first, 1500 * W) && !r.later, JSON.stringify(r));   // i75-b05: an old save's benefits pay the $1,500 floor
});

await t.check('16 weeks of classes earn a trade certificate, and tuition is charged weekly', async () => {
  const r = await ev(() => { fresh('two', { focus: 'study', money: 50000 }); JOBS.push({ id: 'tst', title: 'Test', city: 'waitsburg', pay: 7000, edu: 0 }); S.jobId = 'tst';
    const tu = week().lines['Tuition']; S.jobId = null; JOBS.pop(); weeks(14); const mid = S.edu; const res = week(); return { tu, mid, edu: S.edu, note: res.notes.join(' ') }; });
  assert(near(r.tu, -520 * W) && r.mid === 0 && r.edu === 1 && r.note.includes('Trade certificate'), JSON.stringify(r));
});

await t.check('i75-b29: tuition at Washington rates; the College Grant pays all of it under $4,000 a month in pay, none from $6,500', async () => {
  const r = await ev(() => {
    const at = (pay, edu = 0) => { fresh('two', { focus: 'study', edu, money: 50000 }); JOBS.push({ id: 'tst', title: 'Test', city: 'waitsburg', pay, edu: 0 }); S.jobId = 'tst';
      const v = week().lines['Tuition'] || 0; S.jobId = null; JOBS.pop(); return v; };
    fresh('two', { focus: 'study' }); const words = tuitionWords(), none = week().lines['Tuition'];
    return { low: at(3900), mid: at(5250), high: at(6600), uni: at(7000, 2), none, words, t: TUITION };
  });
  assert(r.t.join() === '520,520,1100', `tuition ${r.t}`);
  assert(r.low === 0 && r.none === undefined && /free with the Washington College Grant/.test(r.words), JSON.stringify(r));
  assert(near(r.mid, -520 * 0.5 * W) && near(r.high, -520 * W) && near(r.uni, -1100 * W), JSON.stringify(r));
});

await t.check('i75-b23: tuition while below $0 goes on the federal student loan (about 6.5%), not the 18% card', async () => {
  const r = await ev(() => {
    const go = money => { fresh('two', { focus: 'study', money }); JOBS.push({ id: 'tst', title: 'Test', city: 'waitsburg', pay: 7000, edu: 0 }); S.jobId = 'tst'; };
    go(-5000); const per = tuitionNow() * W * sloanPerDollar(); const res = week();
    const first = { left: S.sloanLeft, pay: S.sloanPay, notes: res.notes.join(' '), tu: res.lines['Tuition'] };
    week(); const second = { left: S.sloanLeft, pay: S.sloanPay }; S.jobId = null; JOBS.pop();
    go(50000); week(); const cash = { left: S.sloanLeft }; S.jobId = null; JOBS.pop();
    return { first, second, per, cash, rate: sloanPerDollar() };
  });
  assert(near(r.rate, 0.011355, 0.001), `payment per dollar ${r.rate}`);
  assert(r.first.left === 120 && near(r.first.pay, r.per) && r.first.tu === undefined && /student loan/.test(r.first.notes), JSON.stringify(r));
  assert(r.second.left >= 119 && r.second.pay > r.first.pay && r.cash.left === 0, JSON.stringify(r));
});

await t.check('i75-b28: kids cost about $950 a month each until 18; Working Connections caps childcare at $115 on a low income', async () => {
  const r = await ev(() => { fresh('life'); S.kids = [S.ageMonths, S.ageMonths - 17.9 * 12, S.ageMonths - 19 * 12]; const low = week().lines;
    fresh('life', { jobId: 'hanford' }); S.kids = [S.ageMonths]; const high = week().lines;
    fresh('life', { jobId: 'farmhand', partner: true }); S.kids = [S.ageMonths]; const two = { help: childcareHelp(), pay: householdPay() };
    return { low: low['Kids (2)'], high: high['Kid'], two }; });
  assert(near(r.low, -(550 + 115) * 2 * W), `low income ${r.low}`);
  assert(near(r.high, -(950 + 200) * W), `Hanford commute ${r.high}`);
  assert(r.two.help && r.two.pay === 3100 + 1400, JSON.stringify(r.two));
});

await t.check('net worth is cash + home equity + vehicle + 401(k) after tax − what\'s left on the truck loan', async () => {
  const r = await ev(() => { fresh('two', { money: 1000, equity: 20000, carValue: 5000, k401: 3000, loanLeft: 10, loanPay: 500 }); return netWorth(); });
  assert(near(r, 1000 + 20000 + 5000 + 3000 * 0.88 - 10 * 500 * 0.85, 0.0001), `net worth ${r}`);   // i75-b11: the 401(k) after tax
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

await t.check('every event happens at a real place on one of the maps, for commuters and Waitsburg workers alike', async () => {
  const bad = await ev(() => {
    const out = [];
    for (const setup of [{ jobId: 'farmhand' }, { jobId: 'scientist' }, { jobId: null }, { jobId: 'diner' }]) {
      fresh('life', setup);
      const town = townPlaces().map(p => p.k), region = Object.keys(TOWNLL).concat(LANDMARKS.map(l => l.k));
      for (const e of EVENTS) { const [m, k] = eventPlace(e); if (!(m === 'T' ? town : region).includes(k)) out.push(`${e.title} → ${m}:${k} (${setup.jobId})`); }
    }
    return out;
  });
  assert(!bad.length, bad.slice(0, 5).join('; '));
});

await t.check('an event is pinned where it happened, with its result, for 4 weeks', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); S.noEvents = false;
    const e = EVENTS.find(x => x.title === 'Celebration Days');
    const realPick = pickEvent, old = Math.random;
    pickEvent = () => e; Math.random = () => 0.01;        // force this week's event
    let res; try { res = weekTick(true); } finally { pickEvent = realPick; Math.random = old; }
    const pin = S.evPins[0];
    const now = recentAt('T', 'fair').length;
    weeks(5);
    return { pin, now, later: recentAt('T', 'fair').length, ev: !!res.ev };
  });
  assert(r.pin && r.pin.t === 'Celebration Days' && r.pin.m === 'T' && r.pin.k === 'fair', JSON.stringify(r.pin));
  assert(r.now === 1 && r.later === 0, `recent at the fairgrounds: ${r.now} then ${r.later}`);
});

await t.check('the region map uses real river shapes that cross the map', async () => {
  const r = await ev(() => Object.fromEntries(['Columbia', 'Snake', 'Yakima'].map(n => {
    const pts = GEO_RIVERS[n].flat(); const inMap = pts.filter(([la, lo]) => la >= RBB.s && la <= RBB.n && lo >= RBB.w && lo <= RBB.e);
    return [n, { pts: pts.length, inMap: inMap.length }];
  })));
  for (const [n, x] of Object.entries(r)) assert(x.pts >= 8 && x.inMap >= 4, `${n}: ${JSON.stringify(x)}`);
  // the Snake meets the Columbia near Pasco
  const meet = await ev(() => { const end = GEO_RIVERS.Snake.flat().reduce((a, p) => p[1] < a[1] ? p : a); return end; });
  assert(Math.abs(meet[0] - 46.2) < 0.1 && Math.abs(meet[1] + 119.05) < 0.1, `Snake ends at ${meet}`);
});

await t.check('backups round-trip: compressed code, plain code and file JSON all restore the same lives', async () => {
  const r = await ev(async () => {
    localStorage.clear(); fresh('two', { jobId: 'rn', money: 12345 }); S.turn = 30; save();
    newGame('Second', 'life', 1); S.turn = 9; save(); store.set(BEST_KEY, { two: 66 });
    const data = backupData();
    const gz = await backupCode(data), plain = 'BURG0:' + b64(new TextEncoder().encode(JSON.stringify(data)));
    const a = await readBackup(gz), b = await readBackup(plain), c = await readBackup(JSON.stringify(data, null, 1));
    const sig = x => x.lives.map(g => g && `${g.name}/${g.len}/${g.turn}/${Math.round(g.money)}`).join('|');
    return { gz: gz.slice(0, 6), short: gz.length < JSON.stringify(data).length / 2, a: sig(a), b: sig(b), c: sig(c), best: a.best.two };
  });
  assert(r.gz === 'BURG2:' && r.short, `code ${r.gz}, compressed well: ${r.short}`);
  assert(r.a === r.b && r.b === r.c && r.a.startsWith('Rules/two/30/12345|Second/life/9'), `${r.a} / ${r.b} / ${r.c}`);
  assert(r.best === 66, 'best scores missing');
});

await t.check('i62-a01/a06/a22: damaged backup codes get plain messages, and codes in pasted text still restore', async () => {
  const r = await ev(async () => {
    localStorage.clear(); fresh('two', { jobId: 'rn' }); S.turn = 12; save();
    const data = backupData(), gz = await backupCode(data), plain = 'BURG0:' + b64(new TextEncoder().encode(JSON.stringify(data))), file = JSON.stringify(data);
    const msg = async t => { try { const b = await readBackup(t); return 'ok:' + b.lives.filter(Boolean).map(g => g.name).join(); } catch (e) { return 'err:' + e.message; } };
    const wrap = (c, n) => c.match(new RegExp(`.{1,${n}}`, 'g')).join('\n');
    return {
      cut: await msg(gz.slice(0, -30)), plus: await msg(plain.replace(/\+/g, ' ')), mid: await msg(gz.slice(0, 40) + gz.slice(80)), junkTail: await msg(gz.slice(0, -4) + '!!!!'),
      fileCut: await msg(file.slice(0, -40)), plain0Cut: await msg(plain.slice(0, -10)), notOurs: await msg('hello there'), other: await msg('{"app":"other","slots":[]}'),
      inText: await msg(`Here's my backup: "${gz}" thanks!`), wrapped: await msg(wrap(gz, 60)), quoted: await msg(`'${plain}'`), plusOk: await msg(gz.includes('+') ? gz.replace(/\+/g, ' ') : gz)
    };
  });
  const bad = Object.entries(r).filter(([k, v]) => ['inText', 'wrapped', 'quoted', 'plusOk', 'plus'].includes(k) ? v !== 'ok:Rules' : !/^err:/.test(v) || /fetch|JSON|token|atob|decod|Unexpected|undefined/i.test(v));
  assert(!bad.length, JSON.stringify(bad));
  assert(/missing|damaged/.test(r.cut) && /damaged/.test(r.plain0Cut) && /damaged/.test(r.fileCut) && /doesn't look like/.test(r.notOurs), JSON.stringify(r));
});

await t.check('i62-a02/a03/a10: re-restoring never makes twins, a records-only backup restores, and tips are merged', async () => {
  const r = await ev(async () => {
    localStorage.clear(); fresh('two', {}); S.turn = 8; save(); setPref('tips', ['focus']); setPref('theme', 'night');
    const bk = await readBackup(JSON.stringify(backupData()));
    const a = restoreBackup(bk, 'add'), b = restoreBackup(bk, 'add'), names = slots().map(g => g && g.name).join();
    const plan = restorePlan(bk).filter(Boolean).map(x => x.dup);
    localStorage.clear(); store.set(BEST_KEY, { two: 61 }); store.set(BADGE_KEY, { job: 1, dog: 1 });
    const counts = countWords(localCounts());
    const rec = await readBackup(JSON.stringify(backupData()));
    localStorage.clear(); setPref('tips', ['strip']); setPref('theme', 'day');
    restoreBackup({ ...rec, prefs: { tips: ['focus'], theme: 'night', mapView: true } }, 'add');
    return { a: a.dupes, b: b.dupes, names, plan, counts, best: store.get(BEST_KEY).two, badges: Object.keys(store.get(BADGE_KEY)).length, p: prefs() };
  });
  assert(r.a === 1 && r.b === 1 && r.names === 'Rules,,,,' && r.plan.join() === '0', JSON.stringify(r));
  assert(r.counts === '0 lives, 1 record, 2 badges' && r.best === 61 && r.badges === 2, JSON.stringify(r));
  assert(r.p.tips.join() === 'strip,focus' && r.p.theme === 'day' && r.p.mapView === true, JSON.stringify(r.p));
});

await t.check('restoring adds to empty slots or replaces all, keeps the best scores, and rejects junk', async () => {
  const r = await ev(async () => {
    localStorage.clear(); newGame('A', 'two', 0); save(); newGame('B', 'two', 1); save(); store.set(BEST_KEY, { two: 50, five: 70 });
    const bk = await readBackup(JSON.stringify(backupData()));
    store.set(SLOTS_KEY, [null, null, null, null, null]); newGame('Here', 'half', 0); save(); store.set(BEST_KEY, { two: 60 });
    const skippedAdd = restoreBackup(bk, 'add').skipped; const added = slots().map(g => g && g.name);
    const best = store.get(BEST_KEY);
    restoreBackup(bk, 'replace'); const replaced = slots().map(g => g && g.name);
    const errs = [];
    for (const junk of ['hello', '{"app":"other","slots":[]}', '{"app":"theburg","slots":[{"name":5}]}', 'BURG1:@@@']) { try { await readBackup(junk); errs.push('accepted ' + junk); } catch (e) { errs.push(e.message ? 'ok' : 'no message'); } }
    // full slots: nothing fits
    for (let i = 0; i < 5; i++) { newGame('F' + i, 'half', i); save(); }
    const skippedFull = restoreBackup(bk, 'add').skipped;
    return { skippedAdd, added, best, replaced, errs, skippedFull, slotsOk: slots().every((g, i) => g.slot === i) };
  });
  assert(r.skippedAdd === 0 && r.added.join() === 'Here,A,B,,', `add: ${r.added}`);
  assert(r.best.two === 60 && r.best.five === 70, `best ${JSON.stringify(r.best)}`);
  assert(r.replaced.join() === 'A,B,,,', `replace: ${r.replaced}`);
  assert(r.errs.every(x => x === 'ok'), r.errs.join('; '));
  assert(r.skippedFull === 2 && r.slotsOk, `full slots skipped ${r.skippedFull}`);
});

// ---- Around the region (#57–#63): trips, groceries, car care, eating out, outings, appointments ----
await t.check('a trip costs gas there and back plus each stop, then clears', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', date: new Date(2027, 5, 7).getTime() });
    const err = planTrip('wallawalla', ['movies', 'bistro']); const l = week().lines; return { err, l, trip: S.trip, log: (S.log.find(e => /^Trip to/.test(e.m)) || {}).m }; });
  assert(r.err === '', r.err);
  assert(near(r.l['Trip to Walla Walla: gas'], -21 * 2 * 3.89 / 15), `gas ${r.l['Trip to Walla Walla: gas']}`);
  assert(near(r.l['The movies'], -28) && near(r.l['Dinner downtown'], -60), `stops ${JSON.stringify(r.l)}`);
  assert(r.trip === null && /Trip to Walla Walla: the movies, dinner downtown/.test(r.log), `after: ${JSON.stringify(r.trip)} / ${r.log}`);
});

await t.check('in the town you commute to, a trip costs no extra gas or time', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'cellar', focus: 'outdoors', happy: 50, health: 50, date: new Date(2027, 5, 7).getTime() });
    planTrip('wallawalla', ['movies']); const a = week().lines; const h1 = S.health;
    fresh('two', { jobId: 'farmhand', focus: 'outdoors', happy: 50, health: 50, date: new Date(2027, 5, 7).getTime() });
    planTrip('wallawalla', ['movies']); week(); const h2 = S.health;
    fresh('two', { jobId: 'cellar', focus: 'outdoors', happy: 50, health: 50, date: new Date(2027, 5, 7).getTime() }); week(); const h3 = S.health;
    fresh('two', { jobId: 'farmhand', focus: 'outdoors', happy: 50, health: 50, date: new Date(2027, 5, 7).getTime() }); week(); const h4 = S.health;
    return { gas: a['Trip to Walla Walla: gas'], h1, h2, h3, h4 };
  });
  assert(r.gas === undefined, `commuter paid trip gas ${r.gas}`);
  assert(near(r.h1, r.h3, 0.001), `commute-town trip changed the focus: ${r.h1} vs ${r.h3}`);
  assert(r.h2 < r.h4, `a trip out of town should take some of the week: ${r.h2} vs ${r.h4}`);
});

await t.check('trip planning: up to 3 stops, in that town, in season, 21+ for tasting', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 0, 4).getTime() });
    return { four: planTrip('wallawalla', ['movies', 'bistro', 'dentist', 'checkup']), wrongTown: planTrip('dayton', ['movies']),
      offSeason: planTrip('pasco', ['baseball']), under21: planTrip('wallawalla', ['tasting']), none: planTrip('pasco', []),
      home: planTrip('waitsburg', ['movies']), ok: planTrip('dayton', ['cafe', 'depot', 'oil']) };
  });
  assert(r.four && r.wrongTown && r.offSeason && r.under21 && r.none && r.home, JSON.stringify(r));
  assert(r.ok === '', `a good trip was refused: ${r.ok}`);
  const adult = await ev(() => { fresh('two', { ageMonths: 22 * 12, date: new Date(2027, 6, 5).getTime() }); return [planTrip('wallawalla', ['tasting']), planTrip('pasco', ['baseball', 'market'])]; });
  assert(adult.every(x => x === ''), JSON.stringify(adult));
});

await t.check('a stock-up grocery run makes groceries 20% cheaper for 6 weeks (B6)', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 5, 7).getTime() }); planTrip('kennewick', ['stock']);
    const out = [week().lines]; for (let i = 0; i < 6; i++) out.push(week().lines); return out.map(l => l['Food & utilities (stocked up)'] ?? l['Food & utilities']); });
  const cheap = -(700 - 400 * 0.2) * W;
  assert(r.slice(0, 6).every(v => near(v, cheap, 0.02)), `stocked weeks ${r}`);
  assert(r[6] < cheap * 1.05, `week 7 should be back to full price: ${r[6]}`);
});

await t.check('oil changes lower breakdown odds; a year without one raises them; winter tires cut ditch odds', async () => {
  const r = await ev(() => { fresh('two'); const a = careMult(); S.turn = 40; const b = careMult(); S.turn = 60; const c = careMult();
    S.date = new Date(2027, 10, 1).getTime(); planTrip('wallawalla', ['oil', 'tires']); week(); const d = careMult();
    return { a, b, c, d, ditch: ditchMult(), tiresAgain: planTrip('wallawalla', ['tires']) }; });
  assert(r.a === 0.6 && r.b === 1 && r.c === 1.4 && r.d === 0.6, JSON.stringify(r));
  assert(r.ditch === 0.4 && r.tiresAgain, `tires ${JSON.stringify(r)}`);
});

await t.check('going out again within 4 weeks is half as fun; a date costs double and does more', async () => {
  const r = await ev(() => {
    const go = (extra, again) => { fresh('two', { happy: 50, focus: 'study', date: new Date(2027, 5, 7).getTime(), ...extra });
      if (again) S.stopLast = { arena: S.turn - 1 };
      const h0 = S.happy; S.noEvents = true; planTrip('kennewick', ['arena']); const l = week().lines;
      const h1 = S.happy; fresh('two', { happy: 50, focus: 'study', date: new Date(2027, 5, 7).getTime(), ...extra }); week(); return { gain: h1 - S.happy, cost: l['A show at the arena'] }; };
    return { first: go({}), again: go({}, true) };
  });
  assert(near(r.again.gain, r.first.gain / 2, 0.05), `repeat ${r.again.gain} vs ${r.first.gain}`);
  const date = await ev(() => { fresh('two', { partner: true, date: new Date(2027, 5, 7).getTime() }); planTrip('wallawalla', ['movies']); return week().lines['The movies']; });
  assert(near(date, -56), `a date at the movies ${date}`);
});

await t.check('vehicle tabs renew once each January', async () => {
  const r = await ev(() => { fresh('five'); const first = weeks(52) && S.log; let tabs = 0, n = 0;
    fresh('five'); for (let i = 0; i < 120; i++) { const l = week().lines; if (l['Vehicle tabs (DMV)']) { tabs++; n = l['Vehicle tabs (DMV)']; } } return { tabs, n }; });
  assert(r.tabs === 2, `tabs charged ${r.tabs} times in 120 weeks from January 2027 (2027 is prepaid)`);
  assert(r.n < -60 && r.n > -70, `tabs on the old pickup should be the $60 minimum (with prices): ${r.n}`);
});
await t.check('vehicle tabs scale with what the vehicle is worth (R14)', async () => {
  const r = await ev(() => { const tabs = extra => { fresh('five', { date: new Date(2028, 0, 10).getTime(), tabsYear: 2027, ...extra }); return week().lines['Vehicle tabs (DMV)']; };
    return { beater: tabs({}), sedan: tabs({ car: 'sedan', carValue: 9000 }), truck: tabs({ car: 'truck', carValue: 42000 }) }; });
  assert(near(r.beater, -60) && near(r.sedan, -90, 0.02) && near(r.truck, -420, 0.02), JSON.stringify(r));
});

await t.check('a toothache can only come after a year without the dentist', async () => {
  const r = await ev(() => { fresh('two'); const e = EVENTS.find(x => x.title === 'Toothache'); const a = e.when(); S.turn = 60; const b = e.when();
    S.dentist = 55; const c = e.when(); S.dentist = 0; e.choices()[0].go(); return { a, b, c, d: e.when(), place: EVENT_PLACE['Toothache'] }; });
  assert(!r.a && r.b && !r.c && !r.d, JSON.stringify(r));
  assert(r.place[1] === 'wallawalla', 'toothache place');
});

await t.check('older saves get the trip fields', async () => {
  const r = await ev(() => { const old = { turn: 30, date: new Date(2028, 3, 1).getTime() }; migrate(old); return old; });
  assert(r.trip === null && r.svc === 30 && r.dentist === 30 && r.tabsYear === 2028 && r.stockUntil === -1, JSON.stringify(r));
});

// ---- Phase 1 (#70, #67): commutes, side hustles, Life Score so far ----
await t.check('remote days cut commute gas and wear; a carpool halves gas and adds a little community', async () => {
  const r = await ev(() => {
    const g = extra => { fresh('two', { focus: 'rest', ...extra }); return week().lines['Gas (commute + errands)']; };
    return { full: g({ jobId: 'rail' }), remote: g({ jobId: 'loan' }), pool: g({ jobId: 'rail', carpool: true, carpoolJob: 'rail' }),
      can: (fresh('two', { jobId: 'rail', community: 25 }), canCarpool()), can2: (S.community = 35, canCarpool()), near: (fresh('two', { jobId: 'cellar', community: 50 }), canCarpool()) };
  });
  assert(near(r.full, -(58 * 2 * 21 + 300) * W * 3.89 / 15), `full ${r.full}`);
  assert(near(r.remote, -(62 * 2 * 21 * 0.4 + 300) * W * 3.89 / 15), `remote ${r.remote}`);   // i75-b09: 3 remote days
  assert(near(r.pool, -(58 * 2 * 21 * 0.5 + 300) * W * 3.89 / 15), `carpool ${r.pool}`);
  assert(!r.can && r.can2 && r.near, `carpool rules ${JSON.stringify(r)}`);
});

await t.check('side-hustle gigs follow the seasons and pay more with experience', async () => {
  const r = await ev(() => {
    const pay = (month, hw) => { let tot = 0; for (let i = 0; i < 40; i++) { fresh('two', { focus: 'hustle', hustleWeeks: hw, date: new Date(2027, month, 7).getTime() });
      const l = week().lines; tot += Object.entries(l).find(([k]) => k.startsWith('Side hustle'))[1]; } return { avg: tot / 40, label: Object.keys(S.last.lines.reduce((o, [k]) => (o[k] = 1, o), {})).find(k => k.startsWith('Side hustle')) }; };
    return { july: pay(6, 0), jan: pay(0, 0), julyPro: pay(6, 40), hw: (fresh('two', { focus: 'hustle' }), week(), S.hustleWeeks) };
  });
  assert(/harvest/.test(r.july.label) && /snow/.test(r.jan.label), `gig names ${r.july.label} / ${r.jan.label}`);
  assert(near(r.july.avg, 1300 * W, 0.06) && near(r.jan.avg, 950 * W, 0.06), `gig pay ${r.july.avg} ${r.jan.avg}`);
  assert(near(r.julyPro.avg, 1300 * 1.6 * W, 0.06), `experienced pay ${r.julyPro.avg}`);
  assert(r.hw === 1, 'hustle weeks not counted');
});

await t.check('Life Score so far shows on Home and a report card lands in the Journal every 13 weeks', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); tab = 'home'; render();
    const btn = document.querySelector('#scorenow').textContent; weeks(13); const log13 = S.log.find(e => /Report card/.test(e.m)); const q = S.scoreQ;
    weeks(13); const log26 = S.log.find(e => /Report card/.test(e.m)).m;
    showScoreNow(); const sheetText = document.querySelector('#modal').textContent; closeSheet();
    return { btn, log13: log13 && log13.m, q, log26, sheetText, score: lifeScore().score };
  });
  assert(/Life Score so far/.test(r.btn), r.btn);
  assert(r.log13 && Number.isInteger(r.q) && /since the last one/.test(r.log26), `${r.log13} / ${r.log26}`);
  assert(/weakest part/.test(r.sheetText) && /if the game ended today/.test(r.sheetText), 'score sheet text');
});

// ---- Phase 2 (#69, #73, #77): backgrounds, modes, season goals ----
await t.check('each background starts a life the way it says', async () => {
  const r = await ev(() => Object.fromEntries(Object.keys(BACKGROUNDS).map(bg => { newGame('B', 'two', 0, { bg }); S.noEvents = true;
    const s0 = { age: age(), money: S.money, job: S.jobId, edu: S.edu, car: S.car, kids: kidsAtHome(), community: S.community, sloan: S.sloanLeft };
    const l = week().lines; return [bg, { ...s0, loanLine: l['Student loan'] }]; })));
  assert(r.fresh.age === 18 && r.fresh.money === 1500 && !r.fresh.job, `fresh ${JSON.stringify(r.fresh)}`);
  assert(r.farm.job === 'farmhand' && r.farm.money === 300 && r.farm.community > 40, `farm ${JSON.stringify(r.farm)}`);
  assert(r.grad.age === 21 && r.grad.edu === 1 && r.grad.sloan === 120 && near(r.grad.loanLine, -380 * W), `grad ${JSON.stringify(r.grad)}`);
  assert(r.transplant.money === 6000 && r.transplant.car === 'sedan' && r.transplant.community < 10, `transplant ${JSON.stringify(r.transplant)}`);
  assert(r.parent.age === 20 && r.parent.kids === 1, `parent ${JSON.stringify(r.parent)}`);
});

await t.check('the student loan counts against net worth and ends after 10 years', async () => {
  const r = await ev(() => { newGame('G', 'five', 0, { bg: 'grad' }); S.noEvents = true; const nw0 = netWorth(), m0 = S.money;
    let done = false; for (let i = 0; i < 530 && !done; i++) { weekTick(false); if (S.sloanLeft === 0) done = i; } return { gap: m0 + S.carValue - nw0, done }; });
  assert(r.gap > 35000, `loan should lower net worth by ~$39k: ${r.gap}`);
  assert(r.done > 515 && r.done < 525, `paid off after ${r.done} weeks (expected ~520)`);
});

await t.check('Relaxed softens drains and never ends in debt; Hard costs more and ends in debt sooner', async () => {
  const r = await ev(() => {
    const drop = md => { newGame('M', 'two', 0, { mode: md }); S.noEvents = true; S.happy = 80; S.jobId = null; S.focus = 'study'; weeks(8); return S.happy; };
    const relaxed = drop('relaxed'), normal = drop('normal');
    newGame('M', 'two', 0, { mode: 'relaxed' }); S.noEvents = true; S.money = -45000; const rEnd = week().ending, rMoney = S.money;
    newGame('M', 'two', 0, { mode: 'hard' }); S.noEvents = true; S.money = -26000; const hEnd = week().ending;
    newGame('M', 'two', 0, { mode: 'hard' }); S.noEvents = true; const hCost = week().lines['Higher living costs (Hard, +10%)'];
    newGame('M', 'two', 0, { mode: 'hard' }); S.jobId = 'diner'; S.jobMonths = 12; const lay = EVENTS.find(e => e.title === 'Layoffs').w();
    newGame('M', 'two', 0); S.jobId = 'diner'; S.jobMonths = 12; const layN = EVENTS.find(e => e.title === 'Layoffs').w();
    return { relaxed, normal, rEnd, rMoney, hEnd, hCost, lay, layN };
  });
  assert(r.relaxed > r.normal + 1, `relaxed ${r.relaxed} vs normal ${r.normal}`);
  assert(!r.rEnd && r.rMoney >= -40000, `relaxed debt ${r.rEnd} ${r.rMoney}`);
  assert(/debt/.test(r.hEnd || '') && near(r.hCost, -(650 + 700 + 220) * 0.1 * W) && near(r.lay, r.layN * 1.6), JSON.stringify(r));
});

await t.check('best scores are kept per mode', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('A', 'half', 0, { mode: 'hard' }); S.noEvents = true; weeks(26); finish('done'); closeSheet();
    const b = store.get(BEST_KEY); return { keys: Object.keys(b), label: bestLabel('half-hard') }; });
  assert(r.keys.includes('half-hard') && !r.keys.includes('half') && r.label === '6 Months (Hard)', JSON.stringify(r));
});

await t.check('a season goal counts weeks of the right focus and pays out once', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 2, 1).getTime(), focus: 'community', community: 30 }); tab = 'home'; render();
    const line = document.querySelector('.sgoal').textContent; let note = null, c5 = 0;
    for (let i = 0; i < 9; i++) { const res = week(); if (i === 7) c5 = S.community; if (res.notes.some(n => /Town goal done/.test(n))) note = i; }
    const done = { ...S.sgoal }, wins = S.seasonWins; weeks(2);
    fresh('two', { date: new Date(2027, 2, 1).getTime(), focus: 'rest' }); weeks(4);
    return { line, note, done, wins, after: S.seasonWins, restProg: S.sgoal.prog };
  });
  assert(/Celebration Days/.test(r.line) && /0\/9/.test(r.line), r.line);
  assert(r.note === 8 && r.done.done && r.wins === 1, JSON.stringify(r));
  assert(r.restProg === 0, 'Rest should not count toward the spring goal');
});

await t.check('a winter goal spans December to February as one season', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 11, 20).getTime(), focus: 'outdoors' }); weeks(3); const a = S.sgoal.id; const p = S.sgoal.prog; weeks(1); return { a, b: S.sgoal.id, p, p2: S.sgoal.prog }; });
  assert(r.a === r.b && r.a === 'winter-2027' && r.p2 >= r.p, JSON.stringify(r));
});

// ---- Phase 3 (#66, #68, #74): badges and life goals, story chains, challenges ----
await t.check('badges are earned once, saved across lives, and pinned goals add 2 points each', async () => {
  const r = await ev(() => { localStorage.removeItem(BADGE_KEY); fresh('two', { jobId: 'farmhand' }); S.goals = ['job', 'dog', 'degree']; S.goalAt = { job: S.turn, dog: S.turn, degree: S.turn };
    const before = lifeScore().score - goalBonus(); const res = week(); const n1 = Object.keys(S.badges).length; S.dog = true; week();
    return { notes: (S.newBadges || []).join(' ') + res.notes.join(' '), n1, has: Object.keys(S.badges), bonus: goalBonus(), score: lifeScore().score, all: Object.keys(store.get(BADGE_KEY)) , before }; });
  assert(/Badge earned/.test(r.notes) && r.has.includes('job') && r.has.includes('dog'), JSON.stringify(r));
  assert(r.bonus === 4 && r.all.includes('job'), `bonus ${r.bonus}`);
});

await t.check('a story chain moves step by step and ends', async () => {
  const r = await ev(() => { fresh('two', { home: 'fixer', money: 20000 }); const e = n => EVENTS.find(x => x.title === n);
    const w0 = e('The porch is sagging').when(); e('The porch is sagging').choices()[0].go(); const s1 = { ...S.chains.fixer };
    const early = e('The kitchen is next').when(); S.turn = S.chains.fixer.at; const ready = e('The kitchen is next').when();
    e('The kitchen is next').choices()[0].go(); S.turn = S.chains.fixer.at; const eq = S.equity; e('The house is coming together').choices()[0].go();
    return { w0, s1, early, ready, gain: S.equity - eq, step: S.chains.fixer.step, again: e('The porch is sagging').when(), stories: S.storiesDone }; });
  assert(r.w0 && r.s1.step === 2 && r.s1.f.diy && !r.early && r.ready, JSON.stringify(r));
  assert(r.gain > 6000 && r.step === 99 && !r.again && r.stories === 1, JSON.stringify(r));
});

await t.check('challenges set up the life and are judged at the end (or as soon as they are met)', async () => {
  const r = await ev(() => { localStorage.removeItem(CHALLENGE_KEY);
    newGame('C', 'two', 0, { bg: 'fresh', scenario: 'debtfree' }); S.noEvents = true; const debt = S.money; S.money = 500; const mid = SCENARIOS.debtfree.win();
    newGame('L', 'five', 0, { bg: 'fresh', scenario: 'lab' }); S.noEvents = true; S.jobId = 'scientist'; const res = week();
    return { debt, mid, note: res.notes.join(' '), won: S.scWon, stored: store.get(CHALLENGE_KEY) }; });
  assert(r.debt === -8000 && r.mid, JSON.stringify(r));
  assert(/Challenge complete/.test(r.note) && r.won && r.stored.lab, JSON.stringify(r));
});

// ---- Phase 4 (#71, #72, #75, #76): skills, business, weekly challenge, legacy ----
await t.check('skills grow with practice and pay off', async () => {
  const r = await ev(() => { fresh('two', { focus: 'community' }); weeks(25); const people = skillLv('people');
    fresh('two', { focus: 'rest', skills: { cook: 48 } }); const food = week().lines['Food & utilities'];
    fresh('two', { skills: { mechanic: 30 } }); const ev2 = EVENTS.find(e => e.title === 'Truck trouble'); const labels = ev2.choices().filter(c => !c.if || c.if()).map(c => c.label);
    fresh('two', { jobId: 'farmhand', focus: 'hustle', date: new Date(2027, 4, 3).getTime() }); weeks(10); const handy = S.skills.handy;
    return { people, food, labels, handy }; });
  assert(r.people === 2, `people level after 25 weeks of town ${r.people}`);
  assert(near(r.food, -700 * W * 0.88), `cook level 3 food ${r.food}`);
  assert(r.labels.some(l => /yourself/.test(l)), 'mechanic level 2 should offer fixing it yourself');
  assert(r.handy >= 9, `yard-work hustles should build handy: ${r.handy}`);
});

await t.check('a business costs money up front, earns, counts in net worth, and sells for 60%', async () => {
  const r = await ev(() => { fresh('two', { money: 10000, skills: { handy: 48 } }); render(); const nw0 = netWorth(); startBiz('shop'); const nw1 = netWorth();
    let earned = 0, work = 0; for (let i = 0; i < 20; i++) { S.focus = 'rest'; const l = week().lines; earned += l['🪚 Woodworking shop'] || 0; }
    S.focus = 'community'; for (let i = 0; i < 4; i++) work += week().lines['🪚 Woodworking shop'] || 0;
    const m = S.money; sellBiz(); const got = S.money - m;
    fresh('two', { money: 10000, date: new Date(2027, 1, 5).getTime() }); render(); startBiz('wheat'); S.date = new Date(2027, 6, 5).getTime(); let check = 0, n = 0;   // i22-a04: leased by March
    for (let i = 0; i < 6; i++) { const l = week().lines; if (l['🌾 Harvest check']) { check = l['🌾 Harvest check']; n++; } }
    return { lost: nw0 - nw1, earned, work, got, biz: S.biz && S.biz.type, check, n }; });
  assert(near(r.lost, 6000 * 0.4, 0.02), `starting should only lose 40% of the cost in net worth: ${r.lost}`);
  assert(r.earned > 20 * 90 * W * 1.5 && near(r.got, 3600, 0.03) && r.work === 0, `shop earned ${r.earned} (and ${r.work} in other weeks), sold for ${r.got}`);
  assert(r.n === 1 && r.check > 1500, `wheat lease paid ${r.n} times, ${r.check}`);
});

await t.check('i75-b15–b17: the shop costs $6,000, cattle $16,000 with a vet line, and the food truck pays a $1,000 permit each April', async () => {
  const r = await ev(() => {
    fresh('two', { money: 50000, date: new Date(2027, 3, 5).getTime(), focus: 'hustle' }); render(); startBiz('truck'); const a = week().lines; const b = week().lines;
    return { shop: BIZ.shop.cost, cattle: BIZ.cattle.cost, calf: CALF_PRICE, pasture: PASTURE, permit: a['🚚 County health permit'], again: b['🚚 County health permit'], truck: a['🚚 Food truck'] }; });
  assert(r.shop === 6000 && r.cattle === 16000 && r.calf === 1450 && r.pasture === 220, JSON.stringify(r));
  assert(near(r.permit, -1000) && r.again === undefined && r.truck > 1700 * 0.7 * W, JSON.stringify(r));
});

// i75-b18: a no-browser-clicks ledger of every business: 5 years at skill 0 and skill 3, the dice set to their average.
// The business's own focus every other week (Work extra hours in between); the food truck counts only what it earns
// over the side hustle those weeks would have paid. Time spent is ignored, so the 30% ceiling is high on purpose.
await t.check('i75-b18: every business returns between 0% and 30% a year (index funds: about 6%)', async () => {
  const r = await ev(() => {
    const rnd = Math.random, wy = wheatYield; let ey = 0; for (let i = 0; i < 20000; i++) { if (S) S.wx = null; ey += wy(); } ey /= 20000;   // i75-a01: a new weather year each draw
    const own = { shop: 'rest', truck: 'hustle', cattle: 'outdoors', wheat: 'work' }, out = {};
    try {
      wheatYield = () => ey;
      for (const type of Object.keys(BIZ)) for (const lvl of [0, 3]) {
        fresh('five', { money: 1e6, jobId: 'farmhand', date: new Date(2027, 0, 4).getTime() }); Math.random = () => 0.5; startBiz(type);   // newGame resets the dice
        const y0 = new Date(S.date).getFullYear(), yrs = [0, 0, 0, 0, 0];
        for (let w = 0; w < 260 && S.biz; w++) {
          S.skills = lvl ? { handy: 1e4, cook: 1e4 } : {}; S.focus = w % 2 ? 'work' : own[type]; S.hustleWeeks = 12; S.health = 70; S.happy = 60;
          const y = new Date(S.date).getFullYear() - y0, alt = S.focus === 'hustle' && truckSeason() ? hustlePay(currentGig(), 0.5) : 0;
          weekTick(false);
          const v = S.last.lines.filter(([k]) => k.startsWith(BIZ[type].ic)).reduce((a, [, x]) => a + x, 0);
          if (y < 5) yrs[y] += (v - alt) / S.col / BIZ[type].cost;
        }
        out[`${type}${lvl}`] = yrs.map(v => Math.round(v * 1000) / 10);
      }
    } finally { Math.random = rnd; wheatYield = wy; }
    return out;
  });
  console.log('     business return per year (skill 0 / skill 3), index funds about 6%: ' + Object.entries(r).map(([k, v]) => `${k} ${v.join('/')}%`).join(' · '));
  const bad = Object.entries(r).filter(([, v]) => v.some(x => x > 30 || x < 0));
  assert(!bad.length, `outside 0–30% a year: ${bad.map(([k, v]) => `${k} ${v.join('/')}`).join(', ')}`);
});

// i75-b19: no job is beaten on every count by another job at the same or a lower school level: take-home after taxes and gas,
// the happiness drain (stress plus the drive) and wear. Gated jobs (seasonal, certificate, major, apprentice) are listed, not failed,
// and can't be the better job. KNOWN are the jobs still beaten after the i75-b01–b09 repricing: the minimum-wage floor bunched the
// low jobs together, so in-town jobs at the same pay now beat several commuting ones (mall retail and the food plant have perks this
// check can't see: sure hiring and a discount, harvest overtime). A job beaten that isn't on the list fails, and a listed job that
// is no longer beaten is reported so the list can shrink.
const DOMINATED_KNOWN = ['diner', 'hardware', 'cellar', 'onion', 'retail', 'mech', 'foodplant', 'airport', 'reporter'];
await t.check('i75-b19: no job is beaten on take-home, happiness and wear by another job at the same or a lower school level', async () => {
  const r = await ev(() => {
    fresh('two');
    const gated = j => !!(j.season || j.needCert || j.needMajor || j.apprentice);
    const take = j => j.pay * 0.85 - commuteCost(CITIES[j.city].miles, CARS.beater, j);
    const drain = j => j.stress + CITIES[j.city].miles / 40 * driveDays(j);
    return JOBS.map(j => ({ id: j.id, gated: gated(j), by: JOBS.filter(k => k !== j && !gated(k) && k.edu <= j.edu && take(k) > take(j) && drain(k) < drain(j) && k.wear < j.wear).map(k => k.id) })).filter(x => x.by.length);
  });
  const fail = r.filter(x => !x.gated && !DOMINATED_KNOWN.includes(x.id)), fixed = DOMINATED_KNOWN.filter(id => !r.some(x => x.id === id));
  console.log(`     beaten on every count: ${r.map(x => `${x.id}${x.gated ? ' (gated)' : ''} < ${x.by.join('/')}`).join(' · ')}${fixed.length ? ` · no longer beaten (take off the list): ${fixed.join(', ')}` : ''}`);
  assert(!fail.length, `a job is beaten on every count: ${fail.map(x => `${x.id} by ${x.by.join(', ')}`).join('; ')}`);
});

// i75-b20: base pay stays within 25% of real 2027 Washington pay, and never under the minimum wage. Monthly, rounded: 2024 state and
// Tri-Cities/Walla Walla occupational wage medians (Washington ESD and BLS OEWS) grown about 3% a year to 2027, and the round-75 figures
// for nurses, aides, techs and mechanics; the dam operator is a federal lock and dam operator. PAY_PENDING lists jobs waiting on a repricing (reported, not failed).
// Seasonal jobs are information only.
const WA_PAY_2027 = {
  farmhand: 3500, diner: 3500, para: 3400, elevator: 4400, insure: 5600, hardware: 3300, lift: 3200, clerk: 4300, cna: 3800, cellar: 3600,
  onion: 3300, co: 6000, rn: 8600, prof: 7800, retail: 3300, mech: 4800, imaging: 6400, loan: 7000, hanford: 7200, labadmin: 5600,
  scientist: 10500, foodplant: 3700, airport: 4000, trucker: 6000, rail: 7000, windtech: 5800, damop: 5800, forest: 3600, teacher: 6500,
  vaclerk: 4000, nukeop: 8200, harvtruck: 4200, electrician: 6800, plumber: 6400, lineman: 8000, welder: 4300, phleb: 3700, remote: 8800,
  barista: 3100, grocer: 3200, reporter: 3800, teller: 3400, apprentice: 3500, medasst: 3700, agtech: 4200 };
const PAY_PENDING = [];   // empty since the i75-b01–b09 repricing: every job is checked
await t.check('i75-b20: every job pays within 25% of real 2027 Washington pay, and at least the minimum wage', async () => {
  const r = await ev(() => ({ jobs: JOBS.map(j => ({ id: j.id, pay: j.pay, season: !!j.season })), min: MIN_WAGE_MONTH }));
  const missing = r.jobs.filter(j => !WA_PAY_2027[j.id]).map(j => j.id);
  assert(!missing.length, `add these jobs to WA_PAY_2027: ${missing.join(', ')}`);
  const off = r.jobs.filter(j => Math.abs(j.pay / WA_PAY_2027[j.id] - 1) > 0.25 || (r.min && !j.season && j.pay < r.min));
  const info = off.filter(j => j.season || PAY_PENDING.includes(j.id)), fail = off.filter(j => !info.includes(j));
  if (info.length) console.log(`     pay off Washington rates (pending or seasonal): ${info.map(j => `${j.id} ${j.pay} vs ${WA_PAY_2027[j.id]}`).join(', ')}`);
  assert(!fail.length, fail.map(j => `${j.id} pays ${j.pay}, Washington about ${WA_PAY_2027[j.id]}`).join('; '));
});

await t.check('i75-b22: collections stop calling once cash has gone up 4 weeks in a row: "On a payment plan"', async () => {
  const r = await ev(() => {
    const run = up => { fresh('two', { money: up ? -12000 : -6000, debtWeeks: 20, happy: 60, jobId: up ? 'rail' : null, edu: 1, focus: 'rest' }); const notes = [];
      for (let i = 0; i < 8; i++) notes.push(...weekTick(false).notes); return { happy: S.happy, plan: onPlan(), notes: notes.join(' '), card: (tab = 'home', render(), document.querySelector('#main').textContent) }; };
    return { up: run(true), down: run(false) }; });
  assert(r.up.plan && /payment plan/.test(r.up.notes) && /On a payment plan/.test(r.up.card), JSON.stringify(r.up).slice(0, 300));
  assert(!r.down.plan && /in collections/.test(r.down.card) && !/On a payment plan/.test(r.down.card), JSON.stringify(r.down).slice(0, 300));
});

await t.check('i75-b25: raises top out at 30% above inflation', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', jobMonths: 24, raise: 1.27 }); const E = EVENTS.find(e => e.title === 'A raise'); const can = E.when(); E.choices()[0].go();
    const after = S.raise, again = E.when(); S.raise = 1.29; bumpPay(1.05); return { cap: RAISE_CAP, can, after, again, bump: S.raise }; });
  assert(r.cap === 1.3 && r.can && r.after === 1.3 && !r.again && r.bump === 1.3, JSON.stringify(r));
});

await t.check('the weekly challenge plays the same for everyone, even across saves', async () => {
  const r = await ev(() => { const run = () => { localStorage.clear(); newGame('W', 'half', 0, { weekly: '2026-W47' }); S.jobId = 'farmhand';
      const out = []; for (let i = 0; i < 26; i++) { const res = weekTick(false); if (res.ev) { resolveChoice(res.ev, res.ev.choices()[0]); out.push(res.ev.title); } } return out.join('|') + '#' + Math.round(S.money); };
    const a = run(), b = run();
    localStorage.clear(); newGame('W', 'half', 0, { weekly: '2026-W47' }); S.jobId = 'farmhand'; for (let i = 0; i < 10; i++) weekTick(false); save();
    loadSlot(0); for (let i = 0; i < 5; i++) weekTick(false); const c = Math.round(S.money);
    localStorage.clear(); newGame('W', 'half', 0, { weekly: '2026-W47' }); S.jobId = 'farmhand'; for (let i = 0; i < 15; i++) weekTick(false); const d = Math.round(S.money);
    newGame('X', 'half', 0); const native = S.rng === null;
    return { same: a === b, a, savedSame: c === d, c, d, native, wk: isoWeek(new Date(2026, 10, 18)) }; });
  assert(r.same && r.a.length > 5, `two weekly runs differed: ${r.a}`);
  assert(r.savedSame, `save/continue changed the dice: ${r.c} vs ${r.d}`);
  assert(r.native && r.wk === '2026-W47', JSON.stringify(r));
});

await t.check('legacy: a Lifetime game with kids continues as the grandkid, named in a sheet', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('Pat Doe', 'life', 0); S.noEvents = true; S.kids = [300]; S.money = 400000; S.community = 70;
    S.date = new Date(2080, 3, 1).getTime(); S.col = 2; S.will = true; S.ageMonths = 80 * 12; finish('done'); const btn = document.querySelector('#legacy').textContent; document.querySelector('#legacy').click();
    const sugg = document.querySelector('#heirnm').value; document.querySelector('#heirgo').click();
    return { btn, sugg, name: S.name, gen: S.gen, money: S.money, community: S.community, age: age(), year: new Date(S.date).getFullYear(), col: S.col, log: S.log.map(e => e.m).join(' ') }; });
  assert(/grandkid/.test(r.btn) && r.sugg === 'Pat Doe II' && r.name === 'Pat Doe II' && r.gen === 2 && r.age === 18, JSON.stringify(r));
  assert(/grandparent Pat Doe/.test(r.log), r.log);
  assert(r.money > 100000 && r.money <= 500000 && r.community === 50 && r.year === 2080 && r.col === 2, JSON.stringify(r));
});

// ---- review fixes (#90 R1–R3): backups keep badges and challenge wins; goals must be pinned first; event costs rise with prices ----
await t.check('backups carry badges, challenge wins and every kind of best score, and restoring merges them', async () => {
  const r = await ev(async () => { localStorage.clear(); newGame('B', 'two', 0); save();
    store.set(BADGE_KEY, { job: 1, dog: 1 }); store.set(CHALLENGE_KEY, { lab: 1 }); store.set(BEST_KEY, { two: 70, 'two-hard': 61, 'sc-farm': 80, 'wk-2026-W47': 77, bogus: 99 });
    const text = JSON.stringify(backupData()); localStorage.clear(); store.set(BADGE_KEY, { homeowner: 1 });
    const b = await readBackup(text); restoreBackup(b, 'replace');
    return { badges: Object.keys(store.get(BADGE_KEY)).sort(), wins: store.get(CHALLENGE_KEY), best: store.get(BEST_KEY) }; });
  assert(r.badges.join() === 'dog,homeowner,job', `badges ${r.badges}`);
  assert(r.wins.lab, 'challenge wins lost');
  assert(r.best.two === 70 && r.best['two-hard'] === 61 && r.best['sc-farm'] === 80 && r.best['wk-2026-W47'] === 77 && !('bogus' in r.best), JSON.stringify(r.best));
});

await t.check('pinning a badge you already earned adds no points; pinning first does', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); weeks(2); tab = 'life'; render();
    document.querySelector('#goals').click(); document.querySelector('#modal [data-goal="job"]').click(); document.querySelector('#modal [data-goal="dog"]').click(); document.querySelector('#modal #ok').click();
    const late = goalBonus(); S.dog = true; weeks(1); const after = goalBonus(); const card = document.querySelector('#main').textContent;
    const old = { goals: ['job'], turn: 9 }; migrate(old);
    return { late, after, card, oldAt: old.goalAt }; });
  assert(r.late === 0, `an already-earned badge counted: ${r.late}`);
  assert(r.after === 2, `a badge earned after pinning should count: ${r.after}`);
  assert(/earned before you pinned it/.test(r.card), 'the goals card should say why it does not count');
  assert(r.oldAt && r.oldAt.job === 0, 'older saves keep their pinned goals');
});

await t.check('event costs rise with prices, and the choices show today\'s price', async () => {
  const r = await ev(() => { fresh('two', { money: 5000 }); S.col = 2; const e = EVENTS.find(x => x.title === 'Feeling run down'); const ch = e.choices().find(c => /doctor/.test(c.label));
    const m = S.money; ch.go(); const doc = m - S.money;
    const ws = EVENTS.find(x => x.title === 'Windstorm'); S.home = 'fixer'; ws.choices()[0].go(); S.turn = S.roofWait.at; const l = []; weatherLines(l, []); const roof = -l[0][1];
    return { label: ch.label, doc, roof }; });
  assert(near(r.doc, 700) && /\$700/.test(r.label), `doctor ${r.doc} "${r.label}"`);
  assert(near(r.roof, 2000), `roof ${r.roof} (a $2,400 roof, paid up to the $1,000 deductible at today's prices)`);
});

// ---- review fixes batch A (#90): R5, R6, R8–R16, B1–B10 ----
await t.check('R5: heirs get Roman numerals within 20 characters, and the name can be changed', async () => {
  const r = await ev(() => ({ a: heirName('Ann Lee'), b: heirName('Ann Lee II'), c: heirName('Ann Lee III'), d: heirName('Ann Lee IX'), e: heirName('Pat Jr.'),
    f: heirName('Bartholomew Smithers'), g: heirName('Max V'), h: heirName('Ivy') }));
  assert(r.a === 'Ann Lee II' && r.b === 'Ann Lee III' && r.c === 'Ann Lee IV' && r.d === 'Ann Lee X' && r.e === 'Pat III', JSON.stringify(r));
  assert(r.f.length <= 20 && / II$/.test(r.f) && r.g === 'Max VI' && r.h === 'Ivy II', JSON.stringify(r));
  const r2 = await ev(() => { localStorage.clear(); newGame('Ann Lee', 'life', 0); S.noEvents = true; S.kids = [300]; S.money = 1000; S.ageMonths = 75 * 12; finish('done');
    document.querySelector('#legacy').click(); document.querySelector('#heirnm').value = 'Rosie'; document.querySelector('#heirgo').click(); const a = S.name;
    S.ageMonths = 75 * 12; S.kids = [S.ageMonths - 240]; finish('done'); document.querySelector('#legacy').click(); return { a, b: document.querySelector('#heirnm').value, title: document.querySelector('#sheet h2').textContent }; });
  assert(r2.a === 'Rosie' && r2.b === 'Rosie II' && /grandkid/.test(r2.title), JSON.stringify(r2));
  await ev(() => closeSheet());
});

await t.check('R8: in the weekly challenge, events come in the same weeks whatever you choose', async () => {
  const r = await ev(() => { const run = (pickLast, focus) => { localStorage.clear(); newGame('W', 'half', 0, { weekly: '2026-W47' }); S.jobId = 'farmhand'; S.focus = focus;
      const out = []; for (let i = 0; i < 26; i++) {   // no trips: a trip week adds the chance of a road event, by design
        const res = weekTick(false); if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); resolveChoice(res.ev, ch[pickLast ? ch.length - 1 : 0]); out.push(`${S.turn}:${res.ev.title}`); } }
      return { weeks: out.map(x => x.split(':')[0]).join(), titles: out, rng: S.rng, rngEv: S.rngEv }; };
    const a = run(false, 'rest'), b = run(true, 'hustle');
    let same = 0; while (same < a.titles.length && a.titles[same] === b.titles[same]) same++;
    return { aw: a.weeks, bw: b.weeks, same, n: a.titles.length, a: a.titles, b: b.titles, both: a.rng != null && a.rngEv != null && a.rng !== b.rng }; });
  assert(r.aw === r.bw, `event weeks differ: ${r.aw} vs ${r.bw}`);
  assert(r.n >= 4 && r.same >= 2, `the first events (before a choice changes which events can come) should match: ${r.a} vs ${r.b}`);
  assert(r.both, 'both dice should be stored, and the everyday dice should differ with different choices');
});

await t.check('R9: the weekly challenge week is counted in UTC', async () => {
  const ctx2 = await browser.newContext({ serviceWorkers: 'block', timezoneId: 'Pacific/Auckland' });
  const p2 = await ctx2.newPage(); await p2.goto(srv.url, { waitUntil: 'load' });
  const r = await p2.evaluate(() => [isoWeek(new Date(Date.UTC(2026, 10, 22, 23, 30))), isoWeek(new Date(Date.UTC(2026, 10, 23, 0, 30)))]);
  await ctx2.close();
  assert(r[0] === '2026-W47' && r[1] === '2026-W48', JSON.stringify(r));
});

await t.check('R10 + i15-a05: the flood story follows high water within 8 weeks, sandbagged or not, with a line for sandbaggers', async () => {
  const r = await ev(() => { const flood = EVENTS.find(e => e.title === 'Water in the basements'), high = EVENTS.find(e => e.title === 'The Touchet is running high');
    fresh('two'); S.turn = 30; const none = flood.when(2);
    high.choices()[0].go(); const sandbag = flood.when(2), bagText = flood.text();
    high.choices()[1].go(); const dry = flood.when(2), dryText = flood.text(); S.turn += 8; const late8 = flood.when(5); S.turn += 1; const late9 = flood.when(5);
    return { none, sandbag, dry, late8, late9, bagText, dryText }; });
  assert(!r.none && r.sandbag && r.dry && r.late8 && !r.late9, JSON.stringify(r));
  assert(/You were there that night/.test(r.bagText) && !/You were there/.test(r.dryText), JSON.stringify(r));
});

await t.check('R11: a trip week counts 3/4 of a week of classes; the commute town counts a full week', async () => {
  const r = await ev(() => { fresh('two', { focus: 'study' }); planTrip('dayton', ['cafe']); week(); const away = S.studyProg;
    fresh('two', { focus: 'study', jobId: 'clerk' }); planTrip('dayton', ['cafe']); week(); const commute = S.studyProg;
    fresh('two', { focus: 'study', studyProg: 15.75 }); week(); const grad = S.edu;
    return { away, commute, grad }; });
  assert(r.away === 0.75 && r.commute === 1 && r.grad === 1, JSON.stringify(r));
});

await t.check('R12: a carpool ends when the job changes', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'rail', community: 50 }); tab = 'jobs'; render(); document.querySelector('#carpool').click();
    const on = S.carpool && S.carpoolJob === 'rail'; week(); const kept = S.carpool;
    S.jobId = 'trucker'; const l = week(); return { on, kept, after: S.carpool, gas: l.lines['Gas (commute + errands)'], log: S.log[0].m }; });
  assert(r.on && r.kept && !r.after && /carpool ended/.test(r.log), JSON.stringify(r));
  assert(r.gas < -(58 * 2 * 21 * 0.9) * W * 3.89 / 15, `a new job should pay full commute gas: ${r.gas}`);
});

await t.check('R13: businesses lose 5% of their value a year; the wheat lease must be renewed every 5 years', async () => {
  const r = await ev(() => { fresh('five', { money: 50000, col: 1 }); render(); startBiz('shop'); const v0 = bizValue(); for (let i = 0; i < 52; i++) bizWeek([], []); const v1 = bizValue() / S.col;
    fresh('five', { money: 50000 }); render(); startBiz('wheat'); S.biz.weeks = LEASE_WEEKS - 1; const notes = []; bizWeek([], notes); const due = leaseDue();
    tab = 'life'; render(); const btn = !!document.querySelector('#renew'); const m = S.money; document.querySelector('#renew').click();
    const paid = m - S.money, after = !leaseDue() && S.biz.lease === LEASE_WEEKS * 2;
    S.biz.weeks = S.biz.lease - 1; bizWeek([], []); for (let i = 0; i < LEASE_GRACE; i++) bizWeek([], []); const gone = S.biz === null;
    return { v0, v1, notes, due, btn, paid, after, gone }; });
  assert(near(r.v1, r.v0 * 0.95, 0.005), `shop value ${r.v0} → ${r.v1}`);
  assert(r.due && r.btn && /lease is up/.test(r.notes.join()) && near(r.paid, 1500) && r.after, JSON.stringify(r));
  assert(r.gone, 'an unrenewed lease should end after the grace weeks');
});

await t.check('R16: the end screen and score sheet label Relaxed and Hard scores', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('R', 'half', 0, { mode: 'relaxed' }); S.noEvents = true; weeks(3); showScoreNow(); const now = document.querySelector('#sheet').textContent; closeSheet();
    finish('done'); const end = document.querySelector('#sheet').textContent; closeSheet();
    newGame('N', 'half', 0); finish('done'); const normal = document.querySelector('#sheet').textContent; closeSheet(); return { now, end, normal }; });
  assert(/Relaxed mode score/.test(r.end) && /Relaxed mode score/.test(r.now) && /New best \(Relaxed\)/.test(r.end), r.end.slice(0, 300));
  assert(!/mode score/.test(r.normal), 'Normal games need no label');
});

await t.check('B2: a 6-month life starts with a little less happiness and health', async () => {
  const r = await ev(() => { newGame('H', 'half', 0); const h = [S.happy, S.health]; newGame('T', 'two', 0); return { h, t: [S.happy, S.health] }; });
  assert(r.h[0] === r.t[0] - 5 && r.h[1] === r.t[1] - 5, JSON.stringify(r));
});

await t.check('B4: kids cost more for long commuters and lift you most in weeks at home', async () => {
  const r = await ev(() => { const kid = (extra) => { fresh('two', { kids: [S.ageMonths - 24], happy: 50, ...extra }); S.kids = [S.ageMonths - 24]; const l = week(); return { cost: l.lines['Kid'], happy: S.happy }; };
    return { home: kid({ focus: 'rest' }), away: kid({ focus: 'study' }), none: (fresh('two', { focus: 'study', happy: 50 }), week(), S.happy), commute: kid({ jobId: 'rail', focus: 'rest' }) }; });
  assert(near(r.home.cost, -665 * W) && near(r.commute.cost, -1150 * W), JSON.stringify(r));   // i75-b28: childcare help at home on no pay; the rail job pays too much for it
  assert(r.away.happy - r.none < 0.05 && r.away.happy > r.none, `a study week with kids should add only a little: ${r.away.happy} vs ${r.none}`);
});

await t.check('B5: trips while in debt are one stop, with a warning', async () => {
  const r = await ev(() => { fresh('two', { money: -500, date: new Date(2027, 5, 7).getTime() }); const two = planTrip('wallawalla', ['stock', 'movies']); const one = planTrip('wallawalla', ['stock']);
    tripSheet('wallawalla'); const txt = document.querySelector('#sheet').textContent; closeSheet(); return { two, one, txt }; });
  assert(/debt/.test(r.two) && r.one === '' && /in debt/.test(r.txt) && /1 stop/.test(r.txt), JSON.stringify(r).slice(0, 300));
});

await t.check('B8: a tip says when overtime 3 weeks in 4 is wearing you down', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'rail' }); for (const f of ['work', 'work', 'rest', 'work']) { S.focus = f; week(); } tab = 'home'; render(); const on = document.querySelector('#main').textContent;
    S.focus = 'rest'; week(); week(); render(); return { on, off: document.querySelector('#main').textContent }; });
  assert(/Overtime 3 weeks in 4 is wearing you down, on top of a long commute/.test(r.on), 'the overtime tip should show');
  assert(!/wearing you down/.test(r.off), 'the tip should go away after rest');
});

await t.check('B9: side-hustle experience fades after 6 months without hustling', async () => {
  const r = await ev(() => { fresh('two', { focus: 'hustle', hustleWeeks: 40 }); week(); const a = S.hustleWeeks; S.focus = 'rest'; weeks(26); const b = S.hustleWeeks; weeks(10); return { a, b, c: S.hustleWeeks }; });
  assert(r.a === 41 && r.b === 41 && near(r.c, 36, 0.01), JSON.stringify(r));
});

await t.check('B10: Life Score so far shows whether net worth is on track for this point in the game', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); weeks(52); S.money = 50000; showScoreNow(); const a = document.querySelector('#sheet').textContent; closeSheet();
    S.money = 1000; showScoreNow(); const b = document.querySelector('#sheet').textContent; closeSheet(); return { a, b }; });
  assert(/Net worth on track\?/.test(r.a) && /On track/.test(r.a) && /50% of the way/.test(r.a), r.a.slice(0, 400));
  assert(/% there/.test(r.b), 'a low net worth should show how far along it is');
});

// ---- event pacing by category (G5) and the road and work events ----
await t.check('events are paced by category: town 14%, road 8% (long commute or trip), work 8% (a job); Hard ×1.25', async () => {
  const r = await ev(() => {
    const odds = (extra, trip = null) => { fresh('two', extra); return eventOdds(trip); };
    const o = {
      none: odds({}), farm: odds({ jobId: 'farmhand' }), rn: odds({ jobId: 'rn' }), dayton: odds({ jobId: 'hardware' }),
      daytonTrip: odds({ jobId: 'hardware' }, { city: 'kennewick' }), retired: odds({ retired: true }),
      hard: odds({ jobId: 'rn', mode: 'hard' })
    };
    // over many weeks, each category comes at its own rate, and never more than one event a week
    fresh('two', { jobId: 'rn' }); const n = 6000, seen = { town: 0, road: 0, work: 0 };
    for (let i = 0; i < n; i++) { const e = rollEvent(3, null); if (e) seen[evCat(e)]++; }   // April: no every-year (fixed) event
    fresh('two', {}); let noJobRoadWork = 0;
    for (let i = 0; i < 2000; i++) { const e = rollEvent(3, null); if (e && evCat(e) !== 'town') noJobRoadWork++; }
    const groups = JOBS.filter(j => !JOB_GROUP[j.id]).map(j => j.id);
    return { o, rate: Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, v / n])), noJobRoadWork, groups };
  });
  const { o } = r, eq = (x, y) => Math.abs(x - y) < 1e-9;
  assert(eq(o.none.town, .14) && o.none.road === 0 && o.none.work === 0, `no job: ${JSON.stringify(o.none)}`);
  assert(o.farm.road === 0 && eq(o.farm.work, .08), `Waitsburg job: ${JSON.stringify(o.farm)}`);
  assert(eq(o.rn.road, .08) && eq(o.rn.work, .08), `Walla Walla commute: ${JSON.stringify(o.rn)}`);
  assert(o.dayton.road === 0 && eq(o.daytonTrip.road, .08), `an 11-mile commute has no road events unless you take a trip: ${JSON.stringify([o.dayton, o.daytonTrip])}`);
  assert(o.retired.work === 0 && o.retired.road === 0, `retired: ${JSON.stringify(o.retired)}`);
  assert(eq(o.hard.town, .175) && eq(o.hard.road, .1) && eq(o.hard.work, .1), `Hard: ${JSON.stringify(o.hard)}`);
  assert(Math.abs(r.rate.town - .14) < .02 && Math.abs(r.rate.road - .08) < .015 && Math.abs(r.rate.work - .08) < .015, `rates ${JSON.stringify(r.rate)}`);
  assert(r.noJobRoadWork === 0, 'road or work events came with no job and no trip');
  assert(!r.groups.length, `jobs without a job group: ${r.groups}`);
});

await t.check('road events happen in the town you drive to, work events at your workplace', async () => {
  const r = await ev(() => {
    const place = t => eventPlace(EVENTS.find(e => e.title === t));
    fresh('two', { jobId: 'rn' }); rollEvent(4, null); const commute = place('Flat tire on US-12'), work = place('Holiday party');
    fresh('two', { jobId: 'farmhand' }); rollEvent(4, { city: 'richland' }); const trip = place('Flat tire on US-12'), farmWork = place('Holiday party');
    const tour = EVENTS.find(e => e.title === 'Hanford history tour').when(4);
    fresh('two', { jobId: 'farmhand' }); rollEvent(4, null); const noTour = EVENTS.find(e => e.title === 'Hanford history tour').when(4);
    fresh('two', { jobId: 'rn' }); const cats = new Set(); for (let i = 0; i < 300; i++) { const e = pickEvent(4, 'road'); if (e) cats.add(evCat(e)); }
    return { commute, work, trip, farmWork, tour, noTour, cats: [...cats] };
  });
  assert(r.commute.join() === 'R,wallawalla' && r.work.join() === 'R,wallawalla', `commute ${r.commute}, work ${r.work}`);
  assert(r.trip.join() === 'R,richland' && r.farmWork.join() === 'T,fields', `trip ${r.trip}, farm work ${r.farmWork}`);
  assert(r.tour && !r.noTour, 'the Hanford tour should need a Richland trip');
  assert(r.cats.join() === 'road', `road picks: ${r.cats}`);
});

await t.check('road and work events: prices rise, and skills, remote days, carpools and plans change them', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t), open = e => e.choices().filter(c => !c.if || c.if());
    // cost(): a ticket at twice the prices costs twice as much, and the label says so
    fresh('two', { jobId: 'rn', money: 5000 }); S.col = 2; const tk = open(E('Speeding ticket')).find(c => /Pay it/.test(c.label)); let m = S.money; tk.go(); const ticket = { label: tk.label, paid: m - S.money };
    // Mechanic skill opens changing a flat yourself, and practices it
    fresh('two', { jobId: 'rn' }); const flat0 = open(E('Flat tire on US-12')).length; S.skills = { mechanic: 8 }; const flat1 = open(E('Flat tire on US-12')); flat1[0].go();
    // carpool: the late-buddy event needs one, and leaving ends it
    fresh('two', { jobId: 'rn', community: 40 }); const noPool = E('Your carpool buddy is always late').when(4); S.carpool = true;
    const pool = E('Your carpool buddy is always late').when(4); open(E('Your carpool buddy is always late'))[1].go();
    // remote-day trial: office jobs with a long drive; saves 40% of a month's commute gas (remote days already counted)
    fresh('two', { jobId: 'insure' }); const nearOffice = E('A remote-day trial').when(0);
    fresh('two', { jobId: 'loan', money: 0 }); const farOffice = E('A remote-day trial').when(0); open(E('A remote-day trial'))[0].go();
    const gas = commuteCost(62, CARS.beater, job()) * .4, saved = S.money;
    // the better health plan halves doctor bills; a season pass makes powder days free
    fresh('two', { jobId: 'rn', money: 5000, health: 30 }); open(E('Health plan choice'))[1].go(); m = S.money; open(E('Feeling run down'))[0].go(); const doc = m - S.money;
    S.date = new Date(2027, 9, 10).getTime(); S.skiPass = skiSeason(); S.date = new Date(2028, 0, 10).getTime(); const passOk = skiPass(); m = S.money; const pd = open(E('Powder day at Bluewood'))[0]; const rnd = Math.random; Math.random = () => .5; pd.go(); Math.random = rnd; const ski = { label: pd.label, paid: m - S.money };
    // a recruiter makes your next application a sure thing; a clearance-sale outfit helps a little
    fresh('two', { jobId: 'farmhand', community: 40 }); open(E('A recruiter calls'))[0].go(); const old = Math.random; Math.random = () => .999;
    render(); apply('scientist'); Math.random = old; closeSheet(); const hired = S.jobId;
    return { ticket, flat0, flat1: flat1.length, noPool, pool, nearOffice, farOffice, gas, saved, doc, passOk, ski, hired };
  });
  assert(near(r.ticket.paid, 320) && /\$320/.test(r.ticket.label), `ticket ${JSON.stringify(r.ticket)}`);
  assert(r.flat0 === 1 && r.flat1 === 2, `flat tire choices ${r.flat0} → ${r.flat1}`);
  assert(!r.noPool && r.pool, 'the carpool event should need a carpool');
  assert(!r.nearOffice && r.farOffice && near(r.saved, Math.round(r.gas), 0.001) && r.gas > 0, `remote trial ${JSON.stringify(r)}`);
  assert(near(r.doc, 175), `doctor with better coverage ${r.doc}`);
  assert(r.passOk && Math.abs(r.ski.paid) < 0.01, `powder day with a pass ${JSON.stringify(r.ski)}`);
  assert(/season pass/.test(r.ski.label), `powder day label ${r.ski.label}`);
  assert(r.hired === 'scientist', `a recruiter's sure thing: ${r.hired}`);
});

await t.check('events keep the skill, carpool and promotion state they change, and older saves get it', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t);
    fresh('two', { jobId: 'rn', community: 40, carpool: true }); E('Your carpool buddy is always late').choices()[1].go(); const carpool = S.carpool;
    // i3-a01: a promotion moves you up a named rung (+12% pay, +0.3 stress) instead of a flat raise
    fresh('two', { jobId: 'cellar', jobMonths: 20, tenure: 20 }); const r0 = payNow(job()); const can = E('A promotion offer').when(); E('A promotion offer').choices()[0].go(); const r1 = payNow(job());
    const stress = rungOf().stress, title = jobTitle(), raise = S.raise, rung = S.rung;
    fresh('two', { jobId: 'cellar', skills: {} }); E('Train the new hire').choices()[0].go(); const people = S.skills.people;
    const old = { turn: 5, date: new Date(2028, 3, 1).getTime() }; migrate(old);
    return { carpool, r0, r1, stress, title, raise, rung, can, people, old: { hp: old.healthPlan, pass: old.skiPass, hire: old.hireBy, promo: old.promo } };
  });
  assert(r.carpool === false, 'leaving the carpool should end it');
  assert(r.can && near(r.r1, r.r0 * 1.12) && r.raise === 1 && r.rung === 1 && near(r.stress, 0.3) && r.title === 'Cellar master', `promotion ${JSON.stringify(r)}`);
  assert(r.people === 2, `mentoring should practice People twice: ${r.people}`);
  assert(r.old.hp === null && r.old.pass === null && r.old.hire === -1 && r.old.promo === null, JSON.stringify(r.old));
});

// ---- review gaps (G6, G8, R7) ----
await t.check('Journal entries get a kind when logged, and older entries are sorted by their text', async () => {
  const r = await ev(() => { fresh('two'); S.log = []; log('Something odd happened'); log('Hired as Diner cook in Waitsburg!'); log('Picked by hand', 'mile');
    return { stored: S.log.map(e => e.k), kinds: ['Trip to Pasco: taquerias.', 'Earned a badge: Saver.', 'Cook skill reached level 2: food costs.', 'Helped the town: stock the food bank.',
      'Graduated with a Trade certificate.', 'The porch is sagging: Two weekends.', 'Made the last truck payment.', 'Started a business: food truck.', 'Windstorm: The roof held.', 'Completed the challenge: Single parent.'].map(logKind) }; });
  assert(r.stored.join() === 'mile,money,ev', `stored ${r.stored}`);
  assert(r.kinds.join() === 'trip,mile,mile,mile,mile,mile,money,money,ev,mile', `kinds ${r.kinds}`);
});

await t.check('weekly-challenge bests from earlier weeks are dropped when the game loads; other bests stay', async () => {
  const r = await ev(() => { store.set(BEST_KEY, { two: 60, 'sc-lab': 70, 'wk-2020-W10': 90, ['wk-' + isoWeek()]: 55 }); pruneWeekly(); return store.get(BEST_KEY); });
  assert(r.two === 60 && r['sc-lab'] === 70 && !('wk-2020-W10' in r) && Object.keys(r).length === 3, JSON.stringify(r));
});

await t.check('What\'s new ignores beta tags, compares versions as numbers, and lists the 0.2.0 features', async () => {
  const r = await ev(() => ({ v: baseVersion(), n: (WHATS_NEW['0.2.0'] || []).length, order: verNum('0.10.0') > verNum('0.9.9') && verNum('0.2.0-beta.3') === verNum('0.2.0') }));
  assert(/^\d+\.\d+\.\d+$/.test(r.v) && r.n >= 12 && r.order, JSON.stringify(r));
});

await t.check('What\'s new has a list for this version: 12 lines at most, each with an icon, a title and a short line (i69-a01)', async () => {
  const r = await ev(() => ({ v: baseVersion(), list: WHATS_NEW[baseVersion()] }));
  assert(Array.isArray(r.list) && r.list.length >= 1 && r.list.length <= 12, `no What's new list for ${r.v}: ` + JSON.stringify(r.list));
  for (const [ic, title, line] of r.list) assert(ic && title && line && line.length <= 120 && /\.$/.test(line), JSON.stringify([ic, title, line]));
});

// ---- Out and about (#48–#54): Waitsburg's businesses ----
await t.check('no real business names appear anywhere in js/ or index.html (stand-in names only)', async () => {
  const fs = await import('node:fs');
  const REAL = ['Bar Bacetto', 'Bacetto', 'Wolfling', 'Atelier Waitsburg', 'Royal Block', 'Laht Neppur', 'Whiskey Canyon', "Mr. C's", "Mr C's", 'Ten Ton',
    'Waitsburg Grocery', 'Simply Sawdust', 'Gaudy Gals', "Nancy's Dream", 'Blush Salon', 'Banner Bank', 'Waitsburg Clinic', 'The Times', 'Stone and Sky',
    'Hubbard Law', 'Karl Law', 'McGregor', 'Affordable Concrete', 'Chisel Point', "Tim's Carpentry", 'L-C Applicators'];
  const files = ['index.html', ...fs.readdirSync('js').filter(f => f.endsWith('.js')).map(f => 'js/' + f)];
  const hits = [];
  for (const f of files) { const s = fs.readFileSync(f, 'utf8').toLowerCase(); for (const n of REAL) if (s.includes(n.toLowerCase())) hits.push(`${n} in ${f}`); }
  assert(!hits.length, hits.join('; '));
});

await t.check('places keep their real open days and seasons: winter breaks, the grill, the garden season, Tonnage\'s jam weeks', async () => {
  const r = await ev(() => { fresh('two', { ageMonths: 30 * 12, money: 5000 });
    const at = (m, turn = 0) => { S.date = new Date(2027, m, 10).getTime(); S.turn = turn; };
    const open = id => !placeClosed(placeById(id));
    at(0); const janShop = open('shavings'), janJunque = open('junque'), janGarden = open('garden'), janGrill = actBlocked(placeById('lad'), actOf(placeById('lad'), 'grill'));
    at(2); const marShop = open('shavings');
    at(3); const aprGarden = open('garden');
    at(7); const augGarden = open('garden'), augGrill = actBlocked(placeById('lad'), actOf(placeById('lad'), 'grill')), augPint = open('lad');
    at(7, 10); const jamEven = open('tonnage'); at(7, 11); const jamOdd = open('tonnage'); at(4, 11); const festival = open('tonnage');
    return { janShop, janJunque, janGarden, janGrill, marShop, aprGarden, augGarden, augGrill, augPint, jamEven, jamOdd, festival, checked: PLACES_CHECKED }; });
  assert(!r.janShop && !r.janJunque && r.marShop, `winter breaks: ${JSON.stringify(r)}`);
  assert(!r.janGarden && r.aprGarden && !r.augGarden, 'the garden center is a spring business');
  assert(/Only/.test(r.janGrill) && r.augGrill === '' && r.augPint, `grill season: ${r.janGrill} / ${r.augGrill}`);
  assert(r.jamEven && !r.jamOdd && r.festival, 'Tonnage opens only on jam weeks (every other week) and festival days');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(r.checked), 'places need a last-checked date');
});

await t.check('drinks are 21 and over: hidden and refused before 21', async () => {
  const r = await ev(() => { fresh('two', { ageMonths: 19 * 12, money: 5000 }); S.date = new Date(2027, 5, 10).getTime(); S.turn = 2;
    const young = { pasta: shownActs(placeById('pasta')).map(a => a.id), brick: visit('brick', 'night').err, gather: shownActs(placeById('gather')).map(a => a.id).join(), grill: visit('lad', 'grill').err || 'ok' };
    S.ageMonths = 21 * 12; const old = { pasta: shownActs(placeById('pasta')).map(a => a.id), brick: visit('brick', 'night').err || 'ok' };
    return { young, old }; });
  assert(r.young.pasta.join() === 'dinner' && r.young.brick === '21 and over' && r.young.gather === 'board' && r.young.grill === 'ok', JSON.stringify(r.young));
  assert(r.old.pasta.join() === 'dinner,wine' && r.old.brick === 'ok', JSON.stringify(r.old));
});

await t.check('visits: 2 a week, once per place, half as special within 4 weeks, capped per stat, and they cost money', async () => {
  const r = await ev(() => { fresh('two', { ageMonths: 30 * 12, money: 5000, happy: 50, health: 50, community: 30 }); S.date = new Date(2027, 5, 10).getTime(); S.turn = 2;
    const m0 = S.money, h0 = S.happy; const a = visit('pasta', 'dinner'); const paid = m0 - S.money, gain = S.happy - h0;
    const again = visit('pasta', 'wine').err; visit('bean', 'coffee'); const third = visit('mrq', 'bbq').err;
    S.turn = 3; const h1 = S.happy; visit('pasta', 'dinner'); const half = S.happy - h1;
    S.turn = 9; S.happy = 50; visit('pasta', 'dinner'); visit('rouge', 'spa'); const capped = S.out.gain.happy;
    const info = visit('bank', 'banker');
    return { a: !!a.msg, paid, gain, again, third, half, capped, info: info.info, n: S.out.n }; });
  assert(r.a && near(r.paid, 45) && near(r.gain, 6 * 0.28), `first dinner: paid ${r.paid}, +${r.gain}`);
  assert(/this week/.test(r.again) && /2 visits/.test(r.third), `limits: ${r.again} / ${r.third}`);
  assert(near(r.half, 3 * 0.28), `a repeat within 4 weeks should be half: ${r.half}`);
  assert(r.capped <= 3 + 1e-9, `visits added ${r.capped} happiness in one week (cap 3)`);
  assert(r.info === 'bank' && r.n === 2, 'talking to the banker should not use a visit');
});

await t.check('visits are saved: new lives and older saves get them, and they ride along in slots', async () => {
  const r = await ev(() => { const old = migrate({ turn: 5 }); fresh('two', { ageMonths: 30 * 12 }); S.date = new Date(2027, 5, 10).getTime();
    const fresh0 = JSON.stringify(S.out); visit('bean', 'coffee'); save(); const saved = slots()[S.slot].out;
    return { old: old.out, fresh0, saved }; });
  assert(r.old && r.old.n === 0 && r.old.will === false, `migrate: ${JSON.stringify(r.old)}`);
  assert(JSON.parse(r.fresh0).n === 0, 'newGame needs Out and about defaults');
  assert(r.saved && r.saved.n === 1 && r.saved.last.bean != null, `slot: ${JSON.stringify(r.saved)}`);
});

await t.check('little extras: a haircut helps applications, a Tattler ad raises hustle pay, a woodworking class eases a rut', async () => {
  const r = await ev(() => { fresh('two', { ageMonths: 30 * 12, money: 5000 }); S.date = new Date(2027, 5, 10).getTime(); S.turn = 4;
    const look0 = outLookBonus(); visit('rouge', 'cut'); const look1 = outLookBonus(); S.turn = 7; const look2 = outLookBonus();
    S.focus = 'hustle'; visit('tattler', 'ad'); const boost = outAdBoost();
    S.streakF = 'rest'; S.streakN = 9; S.turn = 20; visit('shavings', 'class'); const rut = S.streakN;
    return { look0, look1, look2, boost, rut }; });
  assert(r.look0 === 0 && r.look1 > 0 && r.look2 === 0, `look ${r.look0}/${r.look1}/${r.look2}`);
  assert(near(r.boost, 1.15) && r.rut === 7, `ad ${r.boost}, rut ${r.rut}`);
});

await t.check('jobs at local businesses: balanced pay, school where needed, and a spot on the town map', async () => {
  const r = await ev(() => { const ids = ['diner', 'barista', 'grocer', 'reporter', 'teller', 'apprentice', 'medasst', 'agtech'];
    const out = ids.map(id => { const j = jobById(id); fresh('two', { jobId: id }); const spot = townPlaces().find(p => p.work); return { id, pay: j.pay, edu: j.edu, where: j.where, place: !!placeById(j.place), city: j.city, spot: spot && spot.k }; });
    const edu0 = JOBS.filter(j => j.edu === 0 && !ids.includes(j.id)).map(j => j.pay), edu1 = JOBS.filter(j => j.edu === 1 && !ids.includes(j.id)).map(j => j.pay);
    return { out, lo0: Math.min(...edu0), hi0: Math.max(...edu0), lo1: Math.min(...edu1), hi1: Math.max(...edu1), cook: jobById('diner').title }; });
  assert(r.cook === 'Line cook', `diner cook should be a line cook: ${r.cook}`);
  for (const j of r.out) {
    assert(j.city === 'waitsburg' && j.where && j.place && j.spot, `${j.id}: ${JSON.stringify(j)}`);
    const [lo, hi] = j.edu === 0 ? [r.lo0 - 300, r.hi0] : [r.lo1, r.hi1];
    assert(j.pay >= lo && j.pay <= hi, `${j.id} pays ${j.pay}, outside ${lo}–${hi}`);
  }
  assert(r.out.find(j => j.id === 'medasst').edu >= 1 && r.out.find(j => j.id === 'agtech').edu >= 1, 'medical assistant and ag tech need school');
  assert(r.out.find(j => j.id === 'diner').spot === 'gulch', 'the line cook works at the sports bar pin');
});

await t.check('business events: at their places, on their days; the doctor and the inheritance moved to the clinic and the law office', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: 30 * 12, money: 5000 });
    const titles = OUT_EVENTS.map(e => e.title); const places = Object.fromEntries(titles.map(t => [t, eventPlace(EVENTS.find(e => e.title === t))]));
    const pickN = n => { const seen = {}; for (let i = 0; i < n; i++) { const e = pickEvent(curMonth()); if (e) seen[e.title] = 1; } return seen; };
    S.date = new Date(2027, 7, 10).getTime(); S.turn = 10; const even = pickN(600); S.turn = 11; const odd = pickN(600);
    S.date = new Date(2027, 3, 10).getTime(); const april = pickN(600); S.ageMonths = 19 * 12; const aprYoung = pickN(600);
    const run = EVENTS.find(e => e.title === 'Feeling run down'), inh = EVENTS.find(e => e.title === 'An inheritance');
    return { places, jamEven: !!even['Bluegrass jam at Tonnage'], jamOdd: !!odd['Bluegrass jam at Tonnage'], fest: !!april['Grenache Fest'], festYoung: !!aprYoung['Grenache Fest'],
      run: [run.text, run.choices()[0].label, eventPlace(run)], inh: [inh.text, eventPlace(inh)], n: titles.length }; });
  assert(r.n >= 9, `only ${r.n} business events`);
  assert(r.places['Cookout at Mr. Q\'s'][1] === 'mrq' && r.places['The grill is open at Laughing Lad'][1] === 'lad' && r.places['Grenache Fest'][1] === 'mainst', JSON.stringify(r.places));
  assert(!r.jamEven && r.jamOdd, 'the jam comes every other week: rolled the week before a jam week (i22-a13)');
  assert(r.fest && !r.festYoung, 'Grenache Fest is 21 and over');
  assert(/Burg Clinic/.test(r.run[0]) && /doctor/.test(r.run[1]) && r.run[2][1] === 'mainst', JSON.stringify(r.run));
  assert(/Mother Hubbard/.test(r.inh[0]) && r.inh[1][1] === 'mainst', JSON.stringify(r.inh));
});

// ---- flow items (i2-a11, a12, a13, a25, a28, a09) and the End Week double-tap guard ----
await t.check('a focus plan takes turns week by week, a hand-picked focus pauses it for one week, and job-only picks fall back to Rest', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); S.plan = ['work', 'community', 'outdoors']; S.planI = 0; S.focus = planFocus();
    const seen = [S.focus]; for (let i = 0; i < 4; i++) { weekTick(false); seen.push(S.focus); }
    S.focus = 'rest'; const pausedTurn = S.planI; weekTick(false); const afterPause = S.focus;
    S.jobId = null; S.plan = ['work', 'outdoors']; S.planI = 1; weekTick(false); const noJob = S.focus;
    return { seen, pausedTurn, afterPause, noJob };
  });
  assert(r.seen.join() === 'work,community,outdoors,work,community', `rotation ${r.seen}`);
  assert(r.afterPause === ['work', 'community', 'outdoors'][(r.pausedTurn + 1) % 3], `after a hand pick the plan should carry on, got ${r.afterPause}`);
  assert(r.noJob === 'rest', `Work extra hours with no job should fall back to Rest, got ${r.noJob}`);
});

await t.check('a one-item plan still ruts, and a rotation never does', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); S.plan = ['rest']; S.focus = planFocus(); weeks(12); const lazy = S.streakN;
    fresh('two', { jobId: 'farmhand' }); S.plan = ['work', 'community', 'outdoors', 'rest']; S.focus = planFocus(); weeks(12); const mixed = S.streakN;
    return { lazy, mixed };
  });
  assert(r.lazy === 12 && r.mixed === 1, JSON.stringify(r));
});

await t.check('old saves get an empty plan, and a damaged plan keeps only real focuses', async () => {
  const r = await ev(() => { fresh('two'); const o = clone(S); delete o.plan; delete o.planI; const a = migrate(o);
    const b = clone(S); b.plan = ['work', 'nap', 7, 'rest', 'study', 'hustle', 'community']; migrate(b); return { a: [a.plan, a.planI], b: b.plan }; });
  assert(JSON.stringify(r.a) === '[[],0]', JSON.stringify(r.a));
  assert(r.b.join() === 'work,rest,study,hustle', r.b.join());
});

await t.check('Auto until: a season change or a stat dropping below 35 stops Auto, and says why', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); playWeeks(AUTO_MAX, AUTO_UNTIL.season.test); closeSheet();
    const season = { weeks: S.run.weeks, month: curMonth(), said: /Auto stopped: Spring is here/.test($('#sheet').textContent) };
    fresh('two', { jobId: 'farmhand', health: 36, focus: 'work' }); playWeeks(AUTO_MAX, AUTO_UNTIL.low.test);
    const low = { weeks: S.run.weeks, health: S.health, said: /Health dropped to/.test($('#sheet').textContent) }; closeSheet();
    fresh('two', { jobId: 'farmhand', health: 20 }); const st = { money: S.money, happy: S.happy, health: 20, community: S.community };
    const already = AUTO_UNTIL.low.test(st);       // already below 35 at the start: that alone doesn't stop Auto
    return { season, low, already };
  });
  assert(r.season.month === 2 && r.season.said, JSON.stringify(r.season));
  assert(r.low.health < 35 && r.low.weeks < 26 && r.low.said, JSON.stringify(r.low));
  assert(r.already === null, 'a stat already low should not stop Auto at once');
});

await t.check('skips never change results: the same dice give the same life whether played one week at a time or on Auto', async () => {
  const r = await ev(() => {
    const run = auto => { newGame('Same', 'two', 0, { weekly: '2027-W05' }); S.jobId = 'farmhand'; S.noEvents = true; S.plan = ['work', 'community', 'outdoors']; S.focus = planFocus();
      if (auto) while (S.turn < 8) { playWeeks(8 - S.turn); closeSheet(); } else for (let i = 0; i < 8; i++) { playWeeks(1); closeSheet(); }
      return [S.turn, Math.round(S.money * 100), Math.round(S.happy * 1000), Math.round(S.health * 1000), Math.round(S.community * 1000)].join(); };
    const a = run(false), b = run(true); localStorage.clear(); return { a, b };
  });
  assert(r.a === r.b, `${r.a} vs ${r.b}`);
});

await t.check('skips play one-choice events on their own and list them, but stop for a real choice', async () => {
  const r = await ev(() => {
    const ok = e => e.choices().filter(c => !c.if || c.if());
    fresh('two', { jobId: 'farmhand' }); S.noEvents = false; S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1]));   // no milestone card in the way
    const one = EVENTS.find(e => !e.once && ok(e).length === 1), two = EVENTS.find(e => !e.once && ok(e).length >= 2);
    const real = rollEvent;
    rollEvent = () => one; playWeeks(4); const a = { weeks: S.run.weeks, auto: S.run.happened.filter(h => h.auto).length, sheet: !$('#modal').classList.contains('hidden') }; closeSheet();
    rollEvent = () => two; playWeeks(4); const b = { weeks: S.run.weeks, sheet: !$('#modal').classList.contains('hidden') }; closeSheet();
    rollEvent = real;
    return { a, b };
  });
  assert(r.a.weeks === 4 && r.a.auto === 4 && !r.a.sheet, `one-choice: ${JSON.stringify(r.a)}`);
  assert(r.b.weeks === 1 && r.b.sheet, `real choice: ${JSON.stringify(r.b)}`);
});

await t.check('i49-a03: good-news notes ride along on a skip and show on the next sheet; notes that need you still stop it', async () => {
  const r = await ev(() => {
    const ok = e => e.choices().filter(c => !c.if || c.if()), two = EVENTS.find(e => !e.once && ok(e).length >= 2), real = rollEvent;
    fresh('two', { jobId: 'farmhand', loanLeft: W * 1.5, loanPay: 400 }); S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1]));
    playWeeks(4); const a = { weeks: S.run.weeks, txt: $('#sheet').textContent, open: !$('#modal').classList.contains('hidden') }; closeSheet();
    fresh('two', { jobId: 'farmhand', loanLeft: W * 1.5, loanPay: 400 }); S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1])); S.noEvents = false;
    let n = 0; rollEvent = () => ++n === 3 ? two : null;
    playWeeks(4); const b = { weeks: S.run.weeks, ride: ($('#sheet .ridealong') || {}).textContent || '', title: ($('#sheet h2') || {}).textContent }; closeSheet(); rollEvent = real;
    fresh('two', { jobId: 'farmhand', focus: 'work', streakF: 'work', streakN: RUT_WEEKS - 1 }); S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1]));
    playWeeks(4); const c = { weeks: S.run.weeks, txt: $('#sheet').textContent }; closeSheet();
    return { a, b, c, rides: rides('🛻 The truck is paid off!'), stops: rides('🏥 You ended up in the hospital.') };
  });
  assert(r.rides && !r.stops, 'the note kinds are wrong');
  assert(r.a.weeks === 4 && r.a.open && /truck is paid off/.test(r.a.txt), `the skip should run on and end on the note: ${JSON.stringify(r.a).slice(0, 200)}`);
  assert(r.b.weeks === 3 && /truck is paid off/.test(r.b.ride) && !!r.b.title, `the note should sit on top of the event: ${JSON.stringify(r.b)}`);
  assert(r.c.weeks < 4 && /rut/.test(r.c.txt), `a rut still stops the skip: ${JSON.stringify(r.c).slice(0, 200)}`);
});

await t.check('i49-a11: an answer rule settles a small event during skips (a line in the strip) but not on a plain End Week', async () => {
  const r = await ev(() => {
    const ok = e => e.choices().filter(c => !c.if || c.if()), real = rollEvent;
    fresh('two', { jobId: 'farmhand' }); S.noEvents = false; S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1]));
    const two = EVENTS.find(e => ruleOK(e) && ok(e).length >= 2), pick = ok(two)[1];
    S.ansRules = { [two.title]: { k: ruleKey(pick.label), l: pick.label } };
    rollEvent = () => two; playWeeks(4);
    const a = { weeks: S.run.weeks, rule: S.run.happened.filter(h => h.rule).length, strip: (() => { closeSheet(); showRunDetails(); return $('#sheet').textContent; })() }; closeSheet();
    playWeeks(1); const b = { evSheet: !!$('#sheet [data-i]') }; closeSheet();
    rollEvent = real;
    return { a, b, key: ruleKey('Pay $1,250 to fix it'), key2: ruleKey('Pay $1,400 to fix it'), big: ruleOK(EVENTS.find(e => e.title === 'Starting a family?')) };
  });
  assert(r.a.weeks === 4 && r.a.rule === 4 && /your rule/.test(r.a.strip), JSON.stringify(r.a).slice(0, 300));
  assert(r.b.evSheet, 'a plain End Week should still ask');
  assert(r.key === r.key2 && !r.big, `rule keys ${r.key} / ${r.key2}, big ${r.big}`);
});

await t.check('i15-b01/b05: a small weekly history (weekly for 2 years, then monthly and yearly) and the last 4 weeks by kind', async () => {
  const r = await ev(() => {
    fresh('life', { jobId: 'farmhand' }); for (let i = 0; i < 1500; i++) { weekTick(false); if (S.health < 30) S.health = 70; }
    const h = S.hist, last = h.slice(-HIST_WEEKS);
    return { n: h.length, size: JSON.stringify(h).length, weekly: last.every((x, i) => !i || x[0] - last[i - 1][0] === 1), end: h[h.length - 1][0] === S.turn && h[h.length - 1][1] === Math.round(S.money),
      spend: S.spend4.length, kinds: Object.keys(S.spend4[0]), rent: spendKind('Rent', -100), tabs: spendKind('Vehicle tabs (DMV)', -60) };
  });
  assert(r.n > 104 && r.n < 400 && r.size < 12000 && r.weekly && r.end, JSON.stringify(r));
  assert(r.spend === 4 && r.kinds.includes('pay') && r.kinds.includes('home') && r.rent === 'home' && r.tabs === 'ride', JSON.stringify(r));
});

await t.check('i15-b06: up next lists dated things in the next 8 weeks (tabs, New Year, a last truck payment)', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand', loanLeft: W * 2.5, loanPay: 400 }); S.date = new Date(2027, 11, 6).getTime(); S.tabsYear = 2027;
    const a = upNext().map(x => x.ic + x.n);
    fresh('two', { jobId: 'farmhand' }); S.date = new Date(2027, 4, 3).getTime(); S.svc = -30; S.sgoal = { id: seasonId(seasonGoal()), prog: 6, done: true };
    return { a, b: upNext().map(x => x.ic + x.n) };
  });
  assert(r.a.includes('📅3') && r.a.includes('🪪4') && r.a.includes('🛻2'), JSON.stringify(r.a));
  assert(!r.b.length, JSON.stringify(r.b));
});

await t.check('i15-b01 / i49-a11: an older save without the history, the rules or the spend list loads with empty ones', async () => {
  const r = await ev(() => { fresh('two'); const o = JSON.parse(JSON.stringify(S)); delete o.hist; delete o.ansRules; delete o.spend4; o.ansRules = undefined;
    const m = migrate(o); const bad = migrate({ ...JSON.parse(JSON.stringify(S)), hist: [[1, 'x']], ansRules: { a: 5, b: { k: '<b>x</b>', l: 'y' } } });
    return { m: [m.hist, m.ansRules, m.spend4], bad: [bad.hist.length, Object.keys(bad.ansRules), bad.ansRules.b.k] }; });
  assert(JSON.stringify(r.m) === '[[],{},[]]' && JSON.stringify(r.bad) === '[0,["b"],"x"]', JSON.stringify(r));
});

await t.check('a double tap on End Week plays one week, not two', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1])); PLAY_AT = -1e9; const t0 = S.turn;
    tapPlay(1, { detail: 1 }); closeSheet(); tapPlay(1, { detail: 2 }); tapPlay(1, { detail: 1 }); closeSheet();
    const quick = S.turn - t0; PLAY_AT = -1e9; tapPlay(1, { detail: 1 }); closeSheet();
    return { quick, later: S.turn - t0 };
  });
  assert(r.quick === 1, `a double tap played ${r.quick} weeks`);
  assert(r.later === 2, 'a tap after a moment should play the next week');
});

await t.check('watching the weeks go by plays the same weeks in steps, and reduced motion or the default plays them instantly', async () => {
  const r = await ev(async () => {
    fresh('two', { jobId: 'farmhand' }); tab = 'home'; localStorage.removeItem(PREF_KEY);
    const def = watchWeeks();
    setPref('speed', 'watch'); const t0 = S.turn; playWeeks(4);
    const mid = { rolling: !!ROLL, turn: S.turn - t0, stopBtn: !!$('#stoproll') };
    await new Promise(res => setTimeout(res, ROLL_MS * 6)); closeSheet();
    const done = { rolling: !!ROLL, turn: S.turn - t0 };
    playWeeks(13); await new Promise(res => setTimeout(res, ROLL_MS + 40)); stopRoll(); const stopped = S.turn - t0 - 4; closeSheet();
    setPref('speed', 'instant');
    return { def, mid, done, stopped };
  });
  assert(r.def === false, 'Instant should be the default');
  assert(r.mid.rolling && r.mid.turn === 1 && r.mid.stopBtn, `while rolling: ${JSON.stringify(r.mid)}`);
  assert(!r.done.rolling && r.done.turn === 4, `after rolling: ${JSON.stringify(r.done)}`);
  assert(r.stopped >= 1 && r.stopped < 13, `Stop should end the roll early (played ${r.stopped})`);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const rm = await ev(() => { setPref('speed', 'watch'); const w = watchWeeks(); fresh('two', { jobId: 'farmhand' }); playWeeks(4); const now = { w, rolling: !!ROLL, turn: S.turn }; closeSheet(); setPref('speed', 'instant'); return now; });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert(!rm.w && !rm.rolling && rm.turn === 4, `reduced motion: ${JSON.stringify(rm)}`);
});

await t.check('the town scene follows the seasons, on the title screen and the town map', async () => {
  const r = await ev(() => {
    const s = [0, 3, 6, 9].map(m => scene(m).match(/data-season="(\w+)"/)[1]);
    fresh('two'); S.date = new Date(2027, 10, 1).getTime(); save(); const title = titleMonth();
    const map = townSVG().match(/data-season="(\w+)"/)[1];
    return { s, title, map, differ: scene(0) !== scene(6) };
  });
  assert(r.s.join() === 'Winter,Spring,Summer,Fall' && r.differ, r.s.join());
  assert(r.title === 10 && r.map === 'Fall', JSON.stringify(r));
});
// ---- jobs and school (ideas round 3) ----
await t.check('i3-a05: no new or gated job is a new best job for the simulation\'s job picker (at every school level and vehicle)', async () => {
  const r = await ev(() => {
    const bad = [];
    for (const car of Object.keys(CARS)) for (let edu = 0; edu <= 3; edu++) {
      fresh('two', { edu, car });
      const best = JOBS.filter(x => x.edu <= S.edu).sort((a, b) => (b.pay - commuteCost(CITIES[b.city].miles)) - (a.pay - commuteCost(CITIES[a.city].miles)))[0];
      const home = JOBS.filter(x => x.city === 'waitsburg' && x.edu <= S.edu).sort((a, b) => b.pay - a.pay)[0];
      for (const x of [best, home]) if (x.needCert || x.needMajor || x.season || x.apprentice) bad.push(`${car}/edu ${edu}: ${x.id}`);
    }
    return bad;
  });
  assert(!r.length, `the bots would pick a gated job: ${r.join(', ')}`);
});

await t.check('i3-a01: the promotion needs months on the job, and the top rung needs more school or People skill', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t);
    fresh('two', { jobId: 'farmhand', tenure: 6 }); const early = E('A promotion offer').when();
    S.tenure = 13; const ok1 = E('A promotion offer').when(); E('A promotion offer').choices()[0].go();
    const t1 = jobTitle(), p1 = payNow(job()) / (jobById('farmhand').pay * S.wage);
    S.tenure = 40; const noEdu = E('A promotion offer').when(), need = rungNeeds(nextRung());
    S.edu = 1; const ok2 = E('A promotion offer').when(); E('A promotion offer').choices()[0].go();
    const t2 = jobTitle(), p2 = payNow(job()) / (jobById('farmhand').pay * S.wage), top = E('A promotion offer').when();
    S.focus = 'rest'; const h = S.happy; S.happy = 60; const lines = week(); const dh = S.happy - 60;
    fresh('two', { jobId: 'farmhand' }); S.happy = 60; week(); const dh0 = S.happy - 60;
    // a new job starts at the bottom again
    fresh('two', { jobId: 'farmhand', rung: 2, tenure: 40 }); startJob('diner'); const reset = [S.rung, S.tenure];
    return { early, ok1, t1, p1, noEdu, need, ok2, t2, p2, top, dh, dh0, reset };
  });
  assert(!r.early && r.ok1 && r.t1 === 'Lead hand' && Math.abs(r.p1 - 1.12) < 1e-9, `rung 1 ${JSON.stringify(r)}`);
  assert(!r.noEdu && /trade certificate or People skill level 2/.test(r.need) && r.ok2 && r.t2 === 'Farm manager' && Math.abs(r.p2 - 1.25) < 1e-9 && !r.top, `rung 2 ${JSON.stringify(r)}`);
  assert(r.dh < r.dh0, `the top rung should be more stressful: ${r.dh} vs ${r.dh0}`);
  assert(r.reset[0] === 0 && r.reset[1] === 0, `a new job resets the ladder: ${r.reset}`);
});

await t.check('i3-a02: a program becomes your major at graduation, for +10% pay and better odds at matching jobs', async () => {
  const r = await ev(() => {
    fresh('two', { program: 'nursing', focus: 'study', studyProg: 15.5 }); week();
    const major = S.major, edu = S.edu, cna = payNow(jobById('cna')) / (jobById('cna').pay * S.wage), mech = payNow(jobById('mech')) / (jobById('mech').pay * S.wage);
    const o1 = hireOdds(jobById('cna')), o2 = hireOdds(jobById('mech'));
    const tuition = (() => { fresh('two', { program: 'wine', focus: 'study' }); return week().lines['Tuition']; })();
    fresh('two', { edu: 2, major: 'business' }); const windLock = extraLock(jobById('windtech')); S.major = 'wind'; const windOk = extraLock(jobById('windtech'));
    return { major, edu, cna, mech, d: o1 - o2, tuition, windLock, windOk, log: S.log[0].m };
  });
  assert(r.major === 'nursing' && r.edu === 1, `major ${JSON.stringify(r)}`);
  assert(Math.abs(r.cna - 1.1) < 1e-9 && Math.abs(r.mech - 1) < 1e-9, `major pay ${r.cna} ${r.mech}`);
  assert(Math.abs(r.d - 0.08) < 1e-9, `major odds ${r.d}`);
  assert(r.tuition === undefined, `no job: the College Grant pays the tuition: ${r.tuition}`);
  assert(r.windLock && !r.windOk, 'the wind tech job needs the wind energy program');
});

await t.check('i3-a03: a certificate costs a fee and Take classes weeks, then opens its door', async () => {
  const r = await ev(() => {
    fresh('two', { money: 5000, edu: 1, focus: 'study' }); const locked = extraLock(jobById('trucker'));
    startCert('cdl'); const fee = 5000 - S.money; const again = startCert('welding');
    const w1 = week(); const noTuition = !('Tuition' in w1.lines), prog = S.certStudy.prog, diploma = S.studyProg;
    for (let i = 0; i < 5; i++) week();
    return { locked, fee, again, noTuition, prog, diploma, cdl: S.certs.cdl, open: extraLock(jobById('trucker')), after: S.certStudy };
  });
  assert(r.locked && r.fee === 1800 && r.again === false, `sign-up ${JSON.stringify(r)}`);
  assert(r.noTuition && r.prog === 1 && r.diploma === 0, `a cert week ${JSON.stringify(r)}`);
  assert(r.cdl === 1 && r.open === '' && r.after === null, `done after 6 weeks ${JSON.stringify(r)}`);
});

await t.check('i3-a04 / i75-b07: a plumber apprentice starts at 50% and steps up each year over 4 years to full journeyman pay; leaving resets it', async () => {
  const r = await ev(() => {
    fresh('two', { edu: 1 }); startJob('plumber'); const full = 5400 * S.wage;
    const p0 = payNow(job()) / full; S.appWeeks = 52; const p1 = payNow(job()) / full;
    S.appWeeks = 104; const p2y = payNow(job()) / full; S.appWeeks = 207; S.tenure = 48; const noPromo = canPromote(); week(); const p2 = payNow(job()) / (5400 * S.wage), done = !apprenticing();
    startJob('diner'); startJob('plumber'); const reset = S.appWeeks;
    return { p0, p1, p2y, p2, done, noPromo, reset, weeks: jobById('plumber').apprentice.weeks, elec: jobById('electrician').apprentice.startMult };
  });
  assert(r.weeks === 208 && r.elec === 0.5, `plumber and electrician apprenticeships ${JSON.stringify(r)}`);
  assert(Math.abs(r.p0 - 0.5) < 1e-9 && Math.abs(r.p1 - 0.625) < 1e-9 && Math.abs(r.p2y - 0.75) < 1e-9 && Math.abs(r.p2 - 1) < 1e-9 && r.done, `apprentice pay ${JSON.stringify(r)}`);
  assert(!r.noPromo && r.reset === 0, `apprentice rules ${JSON.stringify(r)}`);
});

await t.check('i3-a06: a seasonal job lays you off when the season ends, and calls you back when it returns', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 2, 29).getTime(), tenure: 5 }); startJob('lift'); S.tenure = 5; S.rung = 1;
    let res; for (let i = 0; i < 2; i++) res = weekTick(false);
    const off = { job: S.jobId, recall: S.recall && S.recall.job, ui: S.ui, note: res.notes.join(' ') };
    const canApply = (() => { const a = S.applied; apply('lift'); const got = S.interview; S.applied = a; return got; })();
    S.date = new Date(2027, 10, 29).getTime(); for (let i = 0; i < 2; i++) res = weekTick(false);
    return { off, canApply, back: S.jobId, rung: S.rung, recall: S.recall, note: res.notes.join(' ') };
  });
  assert(r.off.job === null && r.off.recall === 'lift' && r.off.ui > 0 && /season is over/.test(r.off.note), `laid off ${JSON.stringify(r.off)}`);
  assert(!r.canApply, 'no applying out of season');
  assert(r.back === 'lift' && r.rung === 1 && r.recall === null, `called back ${JSON.stringify(r)}`);
});

await t.check('i3-a07: applying opens an interview; answers move the odds, and an unanswered one keeps today\'s odds at week\'s end', async () => {
  const r = await ev(() => {
    fresh('two', { community: 30 }); render(); apply('diner');
    const iv = S.interview && S.interview.id, sheetUp = /Interview/.test(document.querySelector('#sheet').textContent), base = S.interview.p;
    const d = INTERVIEW.map(q => q.d(jobById('rn')));
    closeSheet(); const old = Math.random; Math.random = () => 0.01; weekTick(false); Math.random = old;
    return { iv, sheetUp, base, d, hired: S.jobId, pending: S.interview };
  });
  assert(r.iv === 'diner' && r.sheetUp, 'an interview sheet should open');
  assert(near(r.base, 0.5 + 30 * 0.004 + 0.1 + 0.08), `base odds ${r.base}`);
  assert(r.d[0] === 0.05 && r.d[1] === -0.05 && r.d[2] === 0.06, `answer effects ${r.d}`);
  assert(r.hired === 'diner' && r.pending === null, 'the pending interview resolves at the end of the week');
});

await t.check('i3-a08: asking for more can raise the offer, pay a bonus you owe back if you leave early, or lose the offer', async () => {
  const r = await ev(() => {
    const old = Math.random;
    fresh('two', { edu: 2, jobId: 'cna', tenure: 12 }); const before = { jobId: 'cna', jobMonths: 0, raise: 1, rung: 0, tenure: 12, money: S.money };
    startJob('rn'); Math.random = () => 0.3; const more = negotiate(1, before), raise = S.raise;
    fresh('two', { edu: 2, money: 0 }); startJob('rn'); Math.random = () => 0.3; negotiate(2, { jobId: null, money: 0 }); const bonus = S.money, owed = S.bonus && S.bonus.amt;
    startJob('cna'); const after = S.money;
    fresh('two', { edu: 2, jobId: 'cna', tenure: 12 }); const b2 = { jobId: 'cna', jobMonths: 0, raise: 1, rung: 0, tenure: 12, money: S.money };
    startJob('rn'); Math.random = () => 0.01; const lost = negotiate(1, b2); Math.random = old;
    return { more, raise, bonus, owed, after, lost, kept: S.jobId };
  });
  assert(Math.abs(r.raise - 1.05) < 1e-9 && /5% more/.test(r.more), `ask for more ${JSON.stringify(r)}`);
  assert(r.bonus === 3000 && r.owed === 3000 && r.after === 0, `sign-on bonus ${JSON.stringify(r)}`);
  assert(/pulled the offer/.test(r.lost) && r.kept === 'cna', `a lost offer keeps your old job ${JSON.stringify(r)}`);
});

await t.check('i3-a09: notice after 6 months gives a good reference; walking out or a firing gives a bad one for a year', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'diner', tenure: 8 }); S.notice = S.turn + 2; weeks(3); const good = [S.jobId, refNow()];
    const og = hireOdds(jobById('hardware'));
    fresh('two', { jobId: 'diner', tenure: 8 }); leaveJob('walk'); const bad = refNow(), ob = hireOdds(jobById('hardware'));
    S.turn += 53; const gone = refNow();
    fresh('two', { jobId: 'diner', tenure: 2 }); leaveJob('notice'); const short = refNow();
    return { good, bad, gone, short, d: og - ob };
  });
  assert(r.good[0] === null && r.good[1] === 'good', `notice ${r.good}`);
  assert(r.bad === 'bad' && r.gone === null && r.short === null, JSON.stringify(r));
  assert(near(r.d, 0.18), `reference odds ${r.d}`);
});

await t.check('i3-a10: union jobs pay dues, halve layoff odds, step up each January, and a contract vote can strike', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t);
    fresh('two', { edu: 1 }); startJob('rail'); const dues = week().lines['Union dues'], pay = payNow(job());
    S.jobMonths = 12; const wU = E('Layoffs').w(); fresh('two', { jobId: 'trucker', jobMonths: 12 }); const wN = E('Layoffs').w();
    fresh('two', { edu: 1, date: new Date(2027, 11, 27).getTime() }); startJob('rail'); S.tenure = 8; const r0 = S.raise; weekTick(false); const step = S.raise / r0;
    S.contractAt = S.turn; const vote = E('Contract vote').when(); const m = S.money; E('Contract vote').choices()[1].go(); const n = S.strike.until - S.turn;
    const w = week(); const strike = w.lines['Strike pay from the union'];
    const old = Math.random; Math.random = () => 0.1; S.strike.until = S.turn; const r1 = S.raise; weekTick(false); Math.random = old;
    return { dues, pay, wU, wN, step, vote, n, strike, won: S.raise / r1, done: S.strike };
  });
  assert(near(r.dues, -r.pay * 0.015 * 12 / 52), `dues ${r.dues}`);
  assert(near(r.wU, r.wN * 0.5), `layoff weight ${r.wU} vs ${r.wN}`);
  assert(near(r.step, 1.015), `January step ${r.step}`);
  assert(r.vote && r.n >= 2 && r.n <= 5 && r.strike > 0 && near(r.won, 1.06) && r.done === null, JSON.stringify(r));
});

await t.check('i3-a11: a federal shutdown stops pay for a few weeks, then back pay arrives in one lump', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t);
    fresh('two', { edu: 1 }); startJob('hanford'); S.clearAt = -1; const can = E('Federal shutdown').when();
    fresh('two', { jobId: 'trucker' }); const not = E('Federal shutdown').when();
    fresh('two', { edu: 1 }); startJob('hanford'); S.clearAt = -1; E('Federal shutdown').choices()[0].go(); const n = S.furlough.until - S.turn;
    const w1 = week(); const owed = S.furlough.owed; for (let i = 1; i < n; i++) week(); const last = week();
    return { can, not, n, paid: w1.lines['Paycheck'] || 0, owed, back: last.lines['Back pay from the furlough'], weekly: payNow(job()) * 12 / 52, f: S.furlough };
  });
  assert(r.can && !r.not, 'only federal jobs get furloughed');
  assert(!r.paid && near(r.owed, r.weekly) && near(r.back, r.weekly * r.n) && r.f === null, JSON.stringify(r));
});

await t.check('i3-a12: Hanford and the lab pay 80% until the clearance clears in 12 weeks; heavy debt can sink it', async () => {
  const r = await ev(() => {
    fresh('two', { edu: 1 }); startJob('hanford'); const p0 = payNow(job()) / (6500 * S.wage); weeks(12); const p1 = payNow(job()) / (6500 * S.wage), kept = S.jobId;
    fresh('two', { edu: 3, money: -40000, mode: 'relaxed' }); startJob('scientist'); const old = Math.random; Math.random = () => 0.1; weeks(13); Math.random = old;
    return { p0, p1, kept, lost: S.jobId, ref: S.ref };
  });
  assert(near(r.p0, 0.8) && near(r.p1, 1) && r.kept === 'hanford', JSON.stringify(r));
  assert(r.lost === null, `deep debt should sink the check: ${r.lost}`);
});

await t.check('i3-a13: the remote job charges for fiber once, has no commute and makes community fade faster', async () => {
  const r = await ev(() => {
    fresh('two', { edu: 3, money: 2000 }); startJob('remote'); const fiber = 2000 - S.money; startJob('scientist'); startJob('remote'); const twice = 2000 - S.money;
    S.community = 40; const gas = week().lines['Gas (errands)']; const c1 = S.community;
    fresh('two', { jobId: 'insure', community: 40 }); week(); const c2 = S.community;
    return { fiber, twice, gas, c1, c2, risk: LAYOFF_RISK.remote };
  });
  assert(r.fiber === 900 && r.twice === 900, `fiber ${r.fiber} ${r.twice}`);
  assert(r.gas !== undefined && r.c1 < r.c2 && r.risk === 0.8, JSON.stringify(r));
});

await t.check('i3-a14: the county bus cuts commute gas by 90% for a monthly pass and a little happiness', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'cellar' }); S.happy = 60; const drive = week(); const h0 = S.happy;
    fresh('two', { jobId: 'cellar', bus: true }); S.happy = 60; const bus = week(); const h1 = S.happy;
    fresh('two', { jobId: 'rn', bus: true }); const r2 = onBus();
    fresh('two', { jobId: 'hanford', bus: true }); const far = onBus();
    return { gD: drive.lines['Gas (commute + errands)'], gB: bus.lines['Gas (commute + errands)'], pass: bus.lines['County bus pass'], h0, h1, r2, far };
  });
  const errands = -300 * 12 / 52 * 3.89 / 15, commute = r.gD - errands;
  assert(near(r.gB, errands + commute * 0.1), `bus gas ${JSON.stringify(r)}`);
  assert(near(r.pass, -50 * 12 / 52) && r.h1 < r.h0 && r.r2 && !r.far, JSON.stringify(r));
});

await t.check('older saves get the round-3 job fields', async () => {
  const r = await ev(() => { const old = { name: 'Old', len: 'two', turn: 40, jobId: 'farmhand', jobMonths: 9, date: new Date(2027, 9, 1).getTime() }; migrate(old);
    return { tenure: old.tenure, rung: old.rung, certs: old.certs, program: old.program, bus: old.bus, clearAt: old.clearAt }; });
  assert(r.tenure === 9 && r.rung === 0 && JSON.stringify(r.certs) === '{}' && r.program === null && r.bus === false && r.clearAt === -1, JSON.stringify(r));
});


/* ---------- round 3: money ---------- */
await t.check('i3-a15: wheat has a July price; the harvest waits on sell-or-store; storing costs a fee and sells by July', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, date: new Date(2027, 1, 5).getTime() }); render(); startBiz('wheat'); S.date = new Date(2027, 6, 5).getTime();   // i22-a04: leased by March
    const prices = []; for (let i = 0; i < 300; i++) { S.monKey = 0; moneyMonth([]); prices.push(S.wheatPrice); }
    const avgP = prices.reduce((a, v) => a + v, 0) / prices.length;
    S.wheatPrice = WHEAT_BASE; S.noEvents = false; S.due = []; S.date = new Date(2027, 7, 2).getTime(); const lines = [];
    bizWeek(lines, []); const due = S.due.slice(), crop = S.biz.crop, noCheck = !lines.some(l => /Harvest check/.test(l[0]));
    const e = takeDue(); const sellLabel = e.choices()[0].label; e.choices()[1].go();
    const stored = S.biz.stored, l2 = []; bizWeek(l2, []); const fee = (l2.find(l => /Elevator storage/.test(l[0])) || [])[1];
    S.wheatPrice = WHEAT_BASE * 1.2; const worth = storedWheatValue();
    S.date = new Date(2028, 6, 3).getTime(); const m = S.money, notes = []; moneyMonth(notes); const july = S.money - m;
    // the yearly average is unchanged: a yield of 0.15×0.3 + 0.85×1.3 times a price that averages 1
    return { avgP, min: Math.min(...prices), max: Math.max(...prices), due, crop, noCheck, sellLabel, stored, fee, worth, july, notes, left: S.biz.stored }; });
  assert(near(r.avgP, 7.5, 0.03) && r.min >= 6 && r.max <= 9, `prices ${r.avgP} ${r.min}–${r.max}`);
  assert(r.due[0] === 'Harvest: sell or store?' && r.crop > 0 && r.noCheck && /Sell now/.test(r.sellLabel), JSON.stringify(r).slice(0, 300));
  assert(near(r.stored, r.crop) && near(r.fee, -r.crop * 0.01 * W) && near(r.worth, r.crop * 1.2), JSON.stringify(r));
  assert(near(r.july, r.worth) && r.left === 0 && /new crop/.test(r.notes.join()), `July sale ${r.july} vs ${r.worth}`);
});

await t.check('i3-a16: crop insurance costs about what a drought year loses on average, charged in April', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, date: new Date(2027, 2, 5).getTime() }); render(); startBiz('wheat'); S.date = new Date(2027, 3, 5).getTime();   // i22-a04: leased by March
    const sample = ins => { S.biz.ins = ins; const a = []; for (let i = 0; i < 4000; i++) { S.wx = null; a.push(wheatYield()); } return a; };   // i75-a01: a new weather year each draw
    const off = sample(false), on = sample(true);
    const lines = []; bizWeek(lines, []); const prem = (lines.find(l => /premium/.test(l[0])) || [])[1]; const again = []; bizWeek(again, []);
    return { minOff: Math.min(...off), minOn: Math.min(...on), gain: (on.reduce((a, v) => a + v, 0) - off.reduce((a, v) => a + v, 0)) / 4000 * 6000, prem, twice: again.some(l => /premium/.test(l[0])) }; });
  assert(near(r.minOff, 0.3) && near(r.minOn, 0.9), `${r.minOff} / ${r.minOn}`);
  assert(near(r.prem, -540) && !r.twice, `premium ${r.prem}`);
  assert(Math.abs(r.gain - 540) < 150, `expected payout gain ${r.gain} should be near the $540 premium`);
});

await t.check('i3-a17: wine futures sell in the fall, count at cost, and pay out 3 years later', async () => {
  const r = await ev(() => {
    fresh('five', { money: 10000, date: new Date(2027, 4, 3).getTime() }); const spring = buyWine();
    S.date = new Date(2027, 9, 4).getTime(); const nw0 = netWorth(); const ok = buyWine(), twice = buyWine(); const nw1 = netWorth();
    const lot = S.wine[0], lines = [], notes = []; S.turn = lot.at - 1; moneyWeek(lines, notes); const early = lines.length;
    S.turn = lot.at; moneyWeek(lines, notes);
    const pay = lines.find(l => /vintage released/.test(l[0]));
    // the average payout, normal and smoky years
    const avg = smoke => { let t = 0; for (let i = 0; i < 3000; i++) { S.wine = [{ y: 2027, paid: 1, at: S.turn, smoke }]; const l = []; moneyWeek(l, []); t += l.find(x => /vintage/.test(x[0]))[1]; } return t / 3000; };
    return { spring, ok, twice, nw: nw1 - nw0, early, pay: pay && pay[1], notes, left: S.wine.length, normal: avg(false), smoky: avg(true) }; });
  assert(!r.spring && r.ok && !r.twice && Math.abs(r.nw) < 1, JSON.stringify(r).slice(0, 200));
  assert(r.early === 0 && [3750, 3125, 1875].some(v => near(r.pay, v)) && /Old Kiln/.test(r.notes.join()), `payout ${r.pay}`);
  assert(near(r.normal, 1.21, 0.04) && r.smoky < r.normal - 0.1, `average ${r.normal}, smoky ${r.smoky}`);
});

await t.check('i3-a18: cattle earn for an owner who checks the herd and lose money for one who never does', async () => {
  const r = await ev(() => {
    const year = active => { fresh('two', { money: 30000, jobId: 'farmhand' }); render(); startBiz('cattle'); let cash = 0;
      for (let i = 0; i < 52; i++) { S.focus = active && i % 3 === 0 ? 'outdoors' : 'rest'; const l = week().lines; for (const [k, v] of Object.entries(l)) if (k.startsWith('🐄')) cash += v; }
      return { cash, cows: S.biz ? S.biz.cows : 0, hay: true }; };
    const a = [], b = []; for (let i = 0; i < 6; i++) { a.push(year(true)); b.push(year(false)); }
    fresh('two', { money: 30000, date: new Date(2027, 11, 6).getTime() }); render(); startBiz('cattle'); const w = week().lines;
    return { active: a.reduce((x, v) => x + v.cash, 0) / 6, idle: b.reduce((x, v) => x + v.cash, 0) / 6, cowsA: a.reduce((x, v) => x + v.cows, 0) / 6, cowsI: b.reduce((x, v) => x + v.cows, 0) / 6, hay: w['🐄 Hay'] || w['🐄 Hay (hard winter)'], rent: w['🐄 Pasture rent'], vet: w['🐄 Vet, minerals and bull lease'] }; });
  assert(r.active > 1000 && r.idle < 0, `active ${r.active}, idle ${r.idle}`);
  assert(r.cowsA > r.cowsI && r.cowsA >= 5.5, `cows ${r.cowsA} vs ${r.cowsI}`);
  assert(near(r.hay, -60 * 6 * W) && near(r.rent, -220 * W) && near(r.vet, -90 * 6 / 12 * W), JSON.stringify(r));
});

await t.check('i3-a19/i75-b26: insurance defaults to $220 at Washington prices; cheaper coverage costs more when something happens', async () => {
  const r = await ev(() => {
    fresh('two'); const def = insMonthly(), line = week().lines['Insurance & phone'];
    S.home = 'farm'; const farm = insMonthly(); S.home = 'fixer'; const own = insMonthly(); S.ins.ded = 2500; const high = insMonthly(); S.ins.ded = 500; const low = insMonthly();
    S.ins.ded = 1000; S.col = 1; const ownFire = youPay('home', 9000); S.ins.ded = 2500; const ownFire2 = youPay('home', 9000);
    S.home = 'room'; S.ins = { auto: 'full', renters: true, ded: 1000 };
    const full = youPay('auto', 3200), stuff = youPay('stuff', 1800);
    S.ins.auto = 'liab'; S.ins.renters = false; const cheap = insMonthly(), liab = youPay('auto', 3200), bare = youPay('stuff', 1800), landlord = youPay('home', 9000);
    S.col = 1; const fb = EVENTS.find(e => e.title === 'A fender bender'), m = S.money; fb.choices()[0].go(); const hit = m - S.money;
    S.ins.auto = 'full'; const m2 = S.money; const res = fb.choices()[0].go(); const hit2 = m2 - S.money;
    return { def, line, farm, own, high, low, ownFire, ownFire2, full, stuff, cheap, liab, bare, landlord, hit, hit2, res }; });
  assert(r.def === 220 && near(r.line, -220 * W) && r.own === 75 + 130 + 95 && r.high === 290 && r.low === 315 && r.farm === 75 + 130 + 140, JSON.stringify(r));
  assert(r.ownFire === 1000 && r.ownFire2 === 2500 && r.full === 500 && r.stuff === 250, JSON.stringify(r));
  assert(r.cheap === 130 && r.liab === 3200 && r.bare === 1800 && r.landlord === 0, JSON.stringify(r));
  assert(near(r.hit, 3200) && near(r.hit2, 500) && /deductible/.test(r.res), JSON.stringify(r));
});

await t.check('i3-a20: owners pay property tax in April and October, about 1% of the home a year', async () => {
  const r = await ev(() => {
    fresh('two', { money: 50000, jobId: 'farmhand' }); render(); moveHome('fixer'); document.querySelector('#y').click();
    let tax = 0, n = 0; for (let i = 0; i < 52; i++) { const v = week().lines['Property tax (county)']; if (v) { tax += v; n++; } }
    fresh('two', { money: 50000 }); let rent = 0; for (let i = 0; i < 52; i++) if (week().lines['Property tax (county)']) rent++;
    return { tax, n, rent, idx: S.homeIdx }; });
  assert(r.n === 2 && r.rent === 0 && Math.abs(-r.tax - 1600) < 120, JSON.stringify(r));
});

await t.check('i3-a21: home prices move each year (2.5% on average); a hot year costs more to buy into', async () => {
  const r = await ev(() => {
    fresh('two'); const g = [], moods = {};
    for (let i = 0; i < 2000; i++) { S.mkt = null; S.monKey = 0; moneyMonth([]); g.push(S.homeGrow); moods[homeMood()] = 1; }
    const avg = g.reduce((a, v) => a + v, 0) / g.length;
    S.homeIdx = 1; S.homeGrow = 0.07; const hot = homeDown('fixer'); S.homeGrow = -0.02; const slow = homeDown('fixer');
    fresh('two', { money: 50000, homeGrow: -0.03 }); render(); moveHome('fixer'); document.querySelector('#y').click(); const eq0 = S.equity; weeks(52);
    return { avg, min: Math.min(...g), max: Math.max(...g), moods, hot, slow, eqGain: S.equity - eq0, idx: S.homeIdx }; });
  assert(Math.abs(r.avg - 0.025) < 0.005 && r.min < 0 && r.max > 0.06 && r.moods.hot && r.moods.slow && r.moods.steady, JSON.stringify(r));
  assert(r.hot === 9450 && r.slow === Math.round(9000 * 0.97), `${r.hot} ${r.slow}`);
  assert(r.eqGain < 260 * 12 && r.idx < 0.98, `a slipping market should hold equity back: ${r.eqGain}, index ${r.idx}`);
});

await t.check('i3-a22: the mortgage follows the year\'s rate; refinancing needs a 1-point drop and has closing costs', async () => {
  const r = await ev(() => {
    const rates = []; fresh('two'); for (let i = 0; i < 500; i++) { S.mkt = null; S.monKey = 0; moneyMonth([]); rates.push(S.rate); }
    fresh('two', { money: 50000, rate: 8 }); render(); moveHome('fixer'); document.querySelector('#y').click();
    const pay8 = S.mortgage; S.rate = 7.25; const half = canRefi(); S.rate = 7; const can = canRefi(), fee = refiFee(), m = S.money, newPay = refiPay(); refinance();
    return { expect8: 950 * payF(8) / payF(6.5), min: Math.min(...rates), max: Math.max(...rates), pay8, half, can, fee, paid: m - S.money, newPay, mort: S.mortgage, rate: S.mortRate }; });
  assert(r.min >= 4 && r.max <= 9.5, `rates ${r.min}–${r.max}`);
  assert(near(r.pay8, r.expect8, 0.001) && r.pay8 > 1050, `mortgage at 8%: ${r.pay8}`);
  assert(!r.half && r.can && near(r.fee, 3200) && near(r.paid, 3200) && r.mort < r.pay8 && near(r.mort, r.newPay) && r.rate === 7, JSON.stringify(r));
  assert(r.fee / (r.pay8 - r.mort) > 24, 'refinancing should take years to pay off');
});

await t.check('i3-a23: a home equity loan: up to half the equity, a fixed payment, and it can\'t pad net worth', async () => {
  const r = await ev(() => {
    fresh('two', { money: 50000 }); render(); moveHome('fixer'); document.querySelector('#y').click(); S.equity = 30000;
    const max = heMax(), tooMuch = takeHE(20000), nw0 = netWorth(), ok = takeHE(15000), nw1 = netWorth(), again = takeHE(500);
    const pay = week().lines['Home equity loan'];
    const bal = heBalance(); const m = S.money; moveHome('room'); document.querySelector('#y').click();
    return { max, tooMuch, ok, again, nwDiff: nw1 - nw0, pay, hePay: S.hePay, left: S.heLeft, bal, sale: S.money - m }; });
  assert(r.max === 15000 && !r.tooMuch && r.ok && !r.again && Math.abs(r.nwDiff) < 1, JSON.stringify(r));
  assert(r.pay < 0 && r.pay > -200 * W * 1.2 && r.left === 0, `payment ${r.pay}`);
});

await t.check('i3-a26: 12 weeks in debt goes to collections: a fee, weekly unhappiness, worse odds; clears above $0', async () => {
  const r = await ev(() => {
    fresh('two', { money: -2000, jobId: null }); const notes = []; let fee = 0;
    for (let i = 0; i < 13; i++) { const m = S.money; const res = weekTick(false); notes.push(...res.notes); }
    const inC = inCollections(), block = loanBlock(), h0 = S.happy;
    const hireRate = () => { S.jobId = null; return hireOdds(jobById('diner')); };   // i3-a07: applying now goes through an interview, so compare the odds
    const S0 = S.community; const inRate = hireRate(); const saved = S.debtWeeks; S.debtWeeks = 0; const outRate = hireRate(); S.debtWeeks = saved;
    S.money = 5000; S.jobId = null; weekTick(false);
    return { notes, inC, block, inRate, outRate, after: S.debtWeeks, cleared: !inCollections(), log: S.log.slice(0, 3).map(e => e.m) }; });
  assert(r.inC && /collections/.test(r.notes.join()) && /collections/.test(r.block), JSON.stringify(r).slice(0, 300));
  assert(r.outRate - r.inRate > 0.04, `hire odds in collections ${r.inRate} vs ${r.outRate}`);
  assert(r.after === 0 && r.cleared, JSON.stringify(r));
  const h = await ev(() => { const run = d => { fresh('two', { money: -3000, debtWeeks: d, happy: 60 }); weeks(4); return S.happy; }; return run(0) - run(20); });
  assert(h > 2.5, `collections should cost happiness every week: ${h}`);
});

await t.check('i3-a27: bankruptcy wipes debt, takes savings, vehicles and the business, blocks loans for 7 years, and costs Life Score', async () => {
  const r = await ev(() => {
    fresh('two', { money: -40500, car: 'truck', carValue: 30000, loanLeft: 20, loanPay: 640, k401: 4000, stocks: 3000, wine: [{ y: 2027, paid: 2500, at: 999, smoke: false }] });
    S.biz = { type: 'shop', weeks: 1, earned: 0, paidYear: null, dep: 1 };
    const res = week(), can = canBankrupt(), sc0 = lifeScore().score;
    const lost = fileBankruptcy(); const sc1 = lifeScore().score;
    return { debt: res.debt, ending: res.ending, can, again: canBankrupt(), lost, money: S.money, car: S.car, loan: S.loanLeft, biz: S.biz, stocks: S.stocks, wine: S.wine.length, k401: S.k401,
      block: loanBlock(), rate: buyRate() - S.rate, diff: sc0 - sc1, bk: lifeScore().bk,
      later: (() => { S.turn += 365; return loanBlock(); })(), relaxed: (() => { S.bk = null; S.mode = 'relaxed'; return canBankrupt(); })() }; });
  assert(r.debt && /debt/.test(r.ending) && r.can && !r.again, JSON.stringify(r).slice(0, 200));
  assert(r.money === 0 && r.car === 'beater' && r.loan === 0 && r.biz === null && r.stocks === 0 && r.wine === 0 && r.k401 > 4000 && r.lost.length === 4, JSON.stringify(r));
  assert(/2034|2035/.test(r.block) && r.rate === 3 && r.bk === 8 && r.later === '' && !r.relaxed, JSON.stringify(r));
});

await t.check('i3-a29: index funds average about 6% with drop years; a drop asks Hold or Sell; they count in net worth', async () => {
  const r = await ev(() => {
    fresh('five', { money: 20000 }); const nw0 = netWorth(); invest(10000); const nw1 = netWorth();
    let tot = 0, drops = 0; const N = 600;
    for (let i = 0; i < N; i++) { S.stocks = 1000; S.mkt = null; S.monKey = 0; S.due = []; S.noEvents = false; moneyMonth([]); const t0 = S.turn;
      for (let w = 0; w < 52; w++) { moneyWeek([], []); S.turn++; } S.turn = t0; tot += S.stocks / 1000; if (S.mkt.dropped) drops++; }
    S.stocks = 5000; S.mkt = { y: 2027, bad: true, dropAt: S.turn }; S.due = []; moneyWeek([], []); const due = S.due.slice(), e = takeDue(), after = S.stocks;
    const hold = e.choices()[0].label, m = S.money; e.choices()[1].go();
    return { nw: nw1 - nw0, avg: tot / N, drops: drops / N, due, after, hold, sold: S.money - m, left: S.stocks }; });
  assert(Math.abs(r.nw) < 1, 'investing moves cash, not net worth');
  assert(Math.abs(r.avg - 1.058) < 0.02 && Math.abs(r.drops - 0.2) < 0.06, `average year ${r.avg}, drop years ${r.drops}`);
  assert(r.due[0] === 'Market drop' && near(r.after, 3750) && /Hold/.test(r.hold) && near(r.sold, 3750) && r.left === 0, JSON.stringify(r));
});

await t.check('round 3 money: older saves get the new money fields', async () => {
  const r = await ev(() => { const old = clone(blankLife('Old', 'two')); for (const k of Object.keys(MONEY_STATE())) delete old[k]; old.home = 'fixer'; old.mortgage = 950; const s = migrate(old);
    return { ins: s.ins, idx: s.homeIdx, rate: s.rate, wine: s.wine, due: s.due, st: s.stocks }; });
  assert(r.ins.auto === 'full' && r.idx === 1 && r.rate === 6.5 && Array.isArray(r.wine) && Array.isArray(r.due) && r.st === 0, JSON.stringify(r));
});
// ---- Retirement and planning (ideas round 3: i3-a24, a25, a28, a30, a31, a32, a33, a34) ----
await t.check('i3-a25: Social Security runs from 60% with no work record to 140% after 35 years of good pay', async () => {
  const r = await ev(() => { const ss = extra => { fresh('life', { retired: true, ...extra }); return week().lines['Social Security']; };
    return { none: ss({ earnYears: 0, earnSum: 0 }), full: ss({ earnYears: 35, earnSum: 35 * 7000 }), half: ss({ earnYears: 17.5, earnSum: 17.5 * 2000 }), long: ss({ earnYears: 50, earnSum: 50 * 9000 }) }; });
  assert(near(r.none, 1900 * 0.6 * W) && near(r.full, 1900 * 1.4 * W) && near(r.long, 1900 * 1.4 * W), JSON.stringify(r));
  assert(near(r.half, 1900 * (0.6 + 0.8 * 0.5 * 0.4) * W), JSON.stringify(r));
});
await t.check('i3-a25: every week with a paycheck adds to your work record, in 2027 dollars', async () => {
  const r = await ev(() => { fresh('life', { jobId: 'elevator', focus: 'rest' }); weeks(52); const a = { y: S.earnYears, avg: avgEarn() };
    fresh('life', { jobId: null, focus: 'rest' }); weeks(52); return { a, idle: S.earnYears }; });
  assert(near(r.a.y, 1) && r.a.avg > 3700 && r.a.avg < 3900 && r.idle === 0, JSON.stringify(r));
});
await t.check('i3-a24: public jobs vest a pension after 5 years that pays 2% of best pay (i75-b10) per year in retirement', async () => {
  const r = await ev(() => { fresh('life', { jobId: 'clerk', focus: 'rest' }); weeks(52 * 4); const at4 = { vested: pensionVested(), pay: pensionPay() };
    weeks(52 * 2); const yrs = S.pensionYears, best = S.pensionPay; S.retired = true; S.jobId = null; const l = week().lines;
    fresh('life', { jobId: 'hanford', focus: 'rest' }); weeks(52 * 6); const priv = S.pensionYears;
    return { at4, yrs, best, pension: l['Pension'], expect: cost(yrs * 0.02 * best) * W, rate: PENSION_RATE, priv, log: JSON.stringify(S.log), pub: JOBS.filter(j => j.pension).map(j => j.id) }; });
  assert(!r.at4.vested && r.at4.pay === 0 && r.rate === 0.02, 'not vested at 4 years');
  assert(near(r.yrs, 6, 0.02) && near(r.pension, r.expect, 0.02) && r.pension > 0, JSON.stringify(r));
  assert(r.priv === 0 && r.pub.join() === 'para,clerk,co,rn,teacher', JSON.stringify(r.pub));
});
await t.check('i3-a28: the money outlook projects 13 weeks from the same bills and flags the first week below zero', async () => {
  const r = await ev(() => { fresh('two', { jobId: null, money: 1200, focus: 'rest', ui: 0 }); wxEnsure(); const o = moneyOutlook();
    const net0 = o.weeks[0].net; week(); const last = S.last.net;
    // i71-b02: with a job and a 401(k), week one still matches the real week (pay, savings, taxes and bills)
    fresh('two', { jobId: 'farmhand', money: 3000, focus: 'rest', k401rate: 2 }); wxEnsure(); const k = moneyOutlook().weeks[0].net; const kl = week().lines; const kNet = S.last.net;
    fresh('two', { jobId: 'rn', money: 5000, focus: 'rest', date: new Date(2027, 11, 6).getTime(), tabsYear: 2027 }); const p = moneyOutlook();
    const tabs = p.weeks.findIndex(w => w.big.some(b => b[0] === 'Vehicle tabs (DMV)'));
    return { n: o.weeks.length, low: o.lowWeek, net0, last, k, kNet, k401: kl['401(k) contribution'], good: p.lowWeek, tabs }; });
  assert(r.n === 13 && r.low != null && r.low < 13, JSON.stringify(r));
  assert(Math.abs(r.last - r.net0) < 1, `outlook week one ${r.net0} vs the real week ${r.last}`);
  assert(r.k401 < 0 && Math.abs(r.kNet - r.k) < 1, `with a job and a 401(k): outlook ${r.k} vs real ${r.kNet}`);
  assert(r.good === null && r.tabs >= 3 && r.tabs <= 5, JSON.stringify(r));
});
await t.check('i3-a30: a December choice sends a retiree to Arizona for January to March: a bill, no events, community fades', async () => {
  const r = await ev(() => { fresh('life', { retired: true, ageMonths: 70 * 12, money: 50000, community: 60, date: new Date(2070, 11, 3).getTime() });
    S.noEvents = false; const e = planDue(11); const title = e && e.title; e.choices()[0].go();
    S.date = new Date(2071, 0, 7).getTime(); const away = awaySouth(); const l = week().lines; const trip = planTrip('wallawalla', ['movies']);
    let evs = 0; for (let i = 0; i < 10; i++) if (weekTick(false).ev) evs++;
    const comm = S.community; S.date = new Date(2071, 3, 7).getTime(); return { title, away, bill: l['Winter in Arizona'], trip, evs, comm, after: awaySouth() }; });
  assert(r.title === 'Winter in Arizona?' && r.away && r.bill < 0 && /Arizona/.test(r.trip) && r.evs === 0, JSON.stringify(r));
  assert(r.comm < 60 && !r.after, JSON.stringify(r));
});
await t.check('i3-a31: insurance at 55, then a care choice at 75 with health under 50; insurance pays 60% of the bill', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: 55 * 12 }); const ins = planDue(3); ins.choices()[0].go(); const prem = week().lines['Long-term care insurance'];
    S.ageMonths = 76 * 12; S.health = 60; const early = planDue(3); S.health = 40; S.kids = []; S.partner = false; S.money = 100000; const care = planDue(3);
    const labels = care.choices().filter(c => !c.if || c.if()).map(c => c.label); care.choices()[0].go(); const l = week().lines;
    fresh('life', { ageMonths: 76 * 12, health: 40, ltc: { ins: false }, kids: [100], money: 100000 }); const fam = planDue(3).choices().filter(c => !c.if || c.if());
    fam[2].go(); const lf = week().lines;
    return { ins: ins.title, prem, early: early && early.title, labels, aide: l['Home care aide'], expect: -cost(4200) * 0.4 * W, premAfter: l['Long-term care insurance'], famN: fam.length, famBill: Object.keys(lf).filter(k => /aide|living/i.test(k)) }; });
  assert(r.ins === 'Long-term care insurance' && r.prem < 0 && r.early == null, JSON.stringify(r));
  assert(r.labels.length === 2 && near(r.aide, r.expect) && r.premAfter === undefined, JSON.stringify(r));
  assert(r.famN === 3 && r.famBill.length === 0, JSON.stringify(r));
});
await t.check('i3-a31: without the money for paid care, Medicaid takes over, and paid care that runs dry moves there too', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: 80 * 12, health: 40, money: 2000, retired: true }); const ch = planDue(3).choices().filter(c => !c.if || c.if()).map(c => c.label);
    fresh('life', { ageMonths: 80 * 12, health: 40, money: -10, retired: true, care: 'aide' }); const res = week();
    return { ch, care: S.care, note: res.notes.join(' ') }; });
  assert(r.ch.length === 1 && /Medicaid/.test(r.ch[0]) && r.care === 'medicaid' && /Medicaid/.test(r.note), JSON.stringify(r));
});
await t.check('i3-a32: a scholarship needs $150,000 of net worth, costs $40,000 and pays out every June', async () => {
  const r = await ev(() => { fresh('life', { money: 100000 }); const poor = endowScholarship();
    fresh('life', { money: 200000, community: 40, date: new Date(2030, 4, 6).getTime() }); const ok = endowScholarship(); const money = S.money, comm = S.community;
    S.date = new Date(2031, 5, 2).getTime(); const e = planDue(5); const res = e.choices()[0].go(); const again = planDue(5);
    return { poor, ok, money, comm, title: e.title, res, n: S.scholar.n, again }; });
  assert(/150,000/.test(r.poor) && r.ok === '' && r.money === 160000 && r.comm === 45, JSON.stringify(r));
  assert(r.n === 1 && r.again === null && /1 graduate/.test(r.res), JSON.stringify(r));
});
await t.check('i3-a33: the will is read at the handoff: in full with the home, or probate takes 10% and 26 weeks', async () => {
  const r = await ev(() => { const p = { name:'Gran', nw:600000, community:60, col:1, wage:1, date:new Date(2080, 0, 5).getTime(), gen:1, mode:'normal', home:'farm', equity:200000, mortgage:1650 };
    startLegacy({ ...p, will:true }, 'Kid'); const w = { money:S.money, home:S.home, equity:S.equity, probate:S.probate };
    startLegacy({ ...p, will:false }, 'Kid'); S.noEvents = true; const n = { money:S.money, home:S.home, probate:{ ...S.probate } };
    for (let i = 0; i < 26; i++) weekTick(false); const before = S.money; const res = weekTick(false); const got = S.money - before;
    S.out.will = false; S.will = false; S.money = 1000; S.ageMonths = 30 * 12; const fee = writeWill(); 
    return { w, n, got, note: res.notes.join(' '), fee, has: hasWill(), outWill: S.out.will }; });
  assert(r.w.money === 200000 && r.w.home === 'farm' && r.w.equity === 200000 && !r.w.probate, JSON.stringify(r.w));
  assert(r.n.money === 1500 && r.n.home === 'room' && r.n.probate.amt === 225000, JSON.stringify(r.n));
  assert(r.got > 215000 && /Probate/.test(r.note), JSON.stringify(r));
  assert(r.fee === '' && r.has && r.outWill, 'the Life-tab will also counts at the law office');
});
await t.check('i3-a33: the law office will and the Life-tab will are the same will', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: 30 * 12, money: 5000, date: new Date(2030, 4, 8).getTime() }); const v = visit('legal', 'will'); return { v: !v.err, will: S.will, again: writeWill() }; });
  assert(r.v && r.will && /already/.test(r.again), JSON.stringify(r));
});
await t.check('i3-a34: a spare room pays on the first weekend of May, July, September and November, a few hundred a year', async () => {
  const r = await ev(() => { fresh('life', { home: 'fixer', mortgage: 950, roomHost: true, date: new Date(2030, 0, 7).getTime() }); let paid = 0, weeksPaid = 0, happyHits = 0;
    for (let i = 0; i < 52; i++) { const l = week().lines; const k = Object.keys(l).find(x => /^Spare room/.test(x)); if (k) { paid += l[k]; weeksPaid++; } }
    fresh('life', { home: 'room', roomHost: true, date: new Date(2030, 4, 6).getTime() }); const renter = Object.keys(week().lines).some(x => /^Spare room/.test(x));
    return { paid, weeksPaid, renter }; });
  assert(r.weeksPaid === 4 && r.paid > 500 && r.paid < 900 && !r.renter, JSON.stringify(r));
});
await t.check('i3-a24/a25: older saves get an estimated work record', async () => {
  const r = await ev(() => { const old = JSON.parse(JSON.stringify(fresh('life', { ageMonths: 40 * 12, jobId: 'para', jobMonths: 36 }))); for (const k of ['earnYears', 'earnSum', 'pensionYears', 'pensionPay', 'will', 'ltc', 'care']) delete old[k];
    const m = migrate(old); return { y: m.earnYears, p: m.pensionYears, pay: m.pensionPay, pp: jobById('para').pay, will: m.will, care: m.care }; });
  assert(near(r.y, 16.5) && near(r.p, 3) && r.pay === r.pp && r.will === false && r.care === null, JSON.stringify(r));
});

await t.check('i2-a29: an old save gets its past years in the life story, and says when earlier years came before the update', async () => {
  const r = await ev(() => {
    fresh('five', { jobId: 'farmhand' }); S.date = new Date(2029, 5, 1).getTime(); S.turn = 125; S.ageMonths = 20 * 12;
    const g = JSON.parse(JSON.stringify(S)); delete g.years; delete g.storyEarly;
    g.log = [{ d: 'Week of Mar 1, 2029', m: 'Earned a badge: Good dog.', k: 'mile' }, { d: 'Week of May 3, 2028', m: 'Hired as Wheat farm hand in Waitsburg!', k: 'money' },
      { d: 'Week of Feb 2, 2028', m: 'Celebration Days: you ran.', k: 'ev' }, { d: 'Week of Jan 4, 2027', m: 'Rules turns 18 and rents a room above Main Street in Waitsburg.', k: 'ev' }];
    const short = migrate(JSON.parse(JSON.stringify(g)));
    const long = JSON.parse(JSON.stringify(g)); for (let i = 0; i < 120; i++) long.log.splice(1, 0, { d: 'Week of Apr 1, 2029', m: 'Quiet week.', k: 'ev' });
    long.log = long.log.slice(0, 120); const big = migrate(long);
    S = short; const st = lifeStory(); S = big; const st2 = lifeStory();
    return { years: short.years, early: short.storyEarly, rows: st.rows.map(x => `${x.year}:${x.text.join(' ')}`), early2: big.storyEarly, first2: st2.rows[0].text[0] };
  });
  assert(r.years.length === 1 && r.years[0].year === 2028 && /Hired as/.test(r.years[0].m[0]) && r.years[0].age === 19, JSON.stringify(r.years));
  assert(!r.early && r.rows.some(x => /^2028:.*Hired/.test(x)) && !r.rows.some(x => /Celebration/.test(x)), JSON.stringify(r.rows));
  assert(r.early2 && /before this update/.test(r.first2), JSON.stringify(r));
});

await t.check('i3-a28 + jobs: the 13-week outlook counts union dues, the bus pass, furloughs, seasons, call-backs, unemployment, apprenticeship steps and certificates', async () => {
  const r = await ev(() => {
    // week one of the outlook matches the real week for a union apprentice who rides the bus
    fresh('two', { edu: 1, money: 3000, focus: 'rest' }); startJob('electrician'); S.bus = true;
    S.wxW = { y: winterYear(), kind: 'hard' };   // a hard winter: the heating line is in both (i71-b02)
    const o0 = moneyOutlook().weeks[0].net, b0 = billLines(0).map(l => l[0]); const real = week();
    // a furlough: no pay until it ends, then the back pay in one lump
    fresh('two', { edu: 1, money: 3000, focus: 'rest' }); startJob('hanford'); S.clearAt = -1; S.furlough = { until: S.turn + 3, owed: 0 };
    const fo = moneyOutlook().weeks, wPay = payNow(job()) * 12 / 52 * 0.85;
    // a ski-lift job in March: pay stops in April, unemployment follows; the call-back returns in December
    fresh('two', { money: 3000, date: new Date(2027, 2, 1).getTime(), focus: 'rest' }); startJob('lift');
    const lo = moneyOutlook().weeks.map(w => w.net);
    fresh('two', { money: 3000, date: new Date(2027, 10, 1).getTime(), focus: 'rest', recall: { job: 'lift', raise: 1, rung: 0, tenure: 4, until: 60 } });
    const ro = moneyOutlook().weeks.map(w => w.net);
    // an apprentice about to finish year one steps up
    fresh('two', { edu: 1, money: 3000, focus: 'rest' }); startJob('plumber'); S.appWeeks = 50; const ao = moneyOutlook().weeks.map(w => w.net);
    // a certificate in progress delays tuition
    fresh('two', { money: 3000, focus: 'study', certStudy: { id: 'cdl', prog: 2 } }); const co = moneyOutlook().weeks.map(w => w.big.some(b => b[0] === 'Tuition'));
    return { o0, b0, fo: fo.map(w => [w.net, w.big.map(b => b[0]).join()]), wPay, lo, ro, ao, co, realLines: real.lines };
  });
  const realNet = Object.values(r.realLines).reduce((a, v) => a + v, 0);
  assert(r.b0.includes('Union dues') && r.b0.includes('County bus pass') && r.realLines['🔥 Heating (hard winter)'] < 0, `bills ${r.b0}`);
  assert(Math.abs(r.o0 - realNet) < 1, `outlook week one ${r.o0} vs real ${realNet}`);
  assert(r.fo[0][0] < 0 && r.fo[2][0] < 0 && /Back pay/.test(r.fo[3][1]) && r.fo[3][0] > r.wPay * 3, `furlough ${JSON.stringify(r.fo.slice(0, 5))}`);
  assert(r.lo[0] > 0 && r.lo[6] < r.lo[0] - 200, `season end ${r.lo}`);
  assert(r.ro[0] < 0 && r.ro[6] > 0, `call-back ${r.ro}`);
  assert(r.ao[3] > r.ao[0] + 50, `apprentice step ${r.ao}`);
  assert(!r.co[0] && !r.co[3] && r.co[4], `tuition waits for the certificate ${r.co}`);
});

await t.check('old 0.2.0 saves: a working trucker gets a CDL; others don\'t', async () => {
  const r = await ev(() => { const a = migrate({ name: 'Old', len: 'two', turn: 40, jobId: 'trucker', jobMonths: 9, date: new Date(2027, 9, 1).getTime() });
    const b = migrate({ name: 'Old', len: 'two', turn: 40, jobId: 'diner', jobMonths: 9, date: new Date(2027, 9, 1).getTime() });
    S = a; return { a: a.certs, lock: extraLock(jobById('trucker')), b: b.certs }; });
  assert(r.a.cdl === 1 && r.lock === '' && !r.b.cdl, JSON.stringify(r));
});

await t.check('old 0.2.0 saves: a seasonal worker loaded out of season keeps the job until the next season ends', async () => {
  const r = await ev(() => {
    const old = migrate({ name: 'Old', len: 'two', turn: 40, jobId: 'lift', jobMonths: 9, money: 3000, date: new Date(2027, 5, 7).getTime() });
    S = old; S.noEvents = true; const grace = S.seasonGrace; weeks(4); const kept = S.jobId;
    S.date = new Date(2027, 11, 6).getTime(); weeks(2); const cleared = S.seasonGrace;
    S.date = new Date(2028, 3, 3).getTime(); weeks(2);
    return { grace, kept, cleared, after: S.jobId, recall: S.recall && S.recall.job };
  });
  assert(r.grace === 'lift' && r.kept === 'lift' && r.cleared === null, `grace ${JSON.stringify(r)}`);
  assert(r.after === null && r.recall === 'lift', `laid off after the next season ${JSON.stringify(r)}`);
});

// ---- round 75: weather and hard years, part 2 ----
await t.check('i75-a07: outdoor crews in a smoke summer get shorter days (pay ×0.9, half the wear) unless they push through', async () => {
  const r = await ev(() => {
    const run = (smoke, push, jobId = 'farmhand') => { fresh('two', { jobId, focus: 'rest', health: 60, date: new Date(2027, 6, 5).getTime(), wx: { y: 2027, dry: false, wet: false, smoke: !!smoke, heat: false, rain: false }, monKey: 2027 * 12 + 6,
      smokeRule: push ? { y: 2027, push: true } : null }); const h = S.health; const w = week(); return { pay: w.lines['Paycheck'], dH: S.health - h, why: S.last.why.join(' ') }; };
    const ev = EVENTS.find(e => e.title === 'The smoke rule at work');
    fresh('two', { jobId: 'farmhand', date: new Date(2027, 6, 5).getTime(), wx: { y: 2027, dry: false, wet: false, smoke: true, heat: false, rain: false } }); const due = ev.when(6); ev.choices()[1].go(); const after = ev.when(6), pushed = pushingSmoke();
    fresh('two', { jobId: 'insure', date: new Date(2027, 6, 5).getTime(), wx: { y: 2027, dry: false, wet: false, smoke: true, heat: false, rain: false } }); const office = ev.when(6);
    return { clear: run(false), rule: run(true), push: run(true, true), office, due, after, pushed, outdoor: JOBS.filter(j => j.outdoor).map(j => j.id) };
  });
  assert(near(r.rule.pay, r.clear.pay * 0.9) && near(r.push.pay, r.clear.pay), `pay ${r.clear.pay} / rule ${r.rule.pay} / push ${r.push.pay}`);
  assert(near(r.rule.dH - r.clear.dH, 1.0 * 0.5 * W, 0.05), `half the wear: ${r.clear.dH} → ${r.rule.dH}`);
  assert(/smoke rule/.test(r.rule.why) && /Pushing through/.test(r.push.why), 'the week\'s reasons name the smoke rule');
  assert(r.due && !r.after && r.pushed && !r.office, `the card comes once a smoke summer, only for outdoor jobs ${JSON.stringify(r)}`);
  assert(r.outdoor.includes('farmhand') && r.outdoor.includes('agtech') && !r.outdoor.includes('insure'), `outdoor jobs ${r.outdoor}`);
});

await t.check('i75-a08: a box-fan filter (Handy) or a purifier keeps the smoke week off your health at home, for one year', async () => {
  const r = await ev(() => {
    const ev = EVENTS.find(e => e.title === 'Wildfire smoke over the valley');
    fresh('two', { money: 1000, date: new Date(2027, 7, 2).getTime(), smoke: 2027, health: 60 }); ev.choices()[0].go(); const without = S.health - 60;
    const noDiy = buildFilter(true); const m = S.money; const bought = buildFilter(false); const paid = m - S.money; S.health = 60; ev.choices()[0].go(); const withF = S.health - 60;
    const twice = buildFilter(false);
    S.date = new Date(2028, 4, 1).getTime(); const nextYear = airFilterOn();
    S.skills = { handy: 20 }; const m2 = S.money; buildFilter(true); const diy = m2 - S.money;
    tab = 'life'; render(); const card = document.querySelector('#main').textContent;
    return { without, withF, noDiy, bought, paid, twice, nextYear, diy, card };
  });
  assert(r.without === -2 && r.withF === 0, `health ${r.without} / ${r.withF}`);
  assert(!r.noDiy && r.bought && near(r.paid, 160) && !r.twice && !r.nextYear && near(r.diy, 45), JSON.stringify(r));
  assert(/Ready for 2028/.test(r.card), 'the Life tab shows the filter is ready');
});

await t.check('i75-a09: a cough in a smoke week: the clinic costs a little, camp anyway risks urgent care', async () => {
  const r = await ev(() => {
    const ev = EVENTS.find(e => e.title === 'A cough in a smoke week');
    fresh('two', { money: 2000, jobId: 'farmhand', date: new Date(2027, 7, 2).getTime(), wx: { y: 2027, dry: false, wet: false, smoke: true, heat: false, rain: false } }); const noKids = ev.when(7);
    S.kids = [S.ageMonths - 60]; const kids = ev.when(7); S.wx.smoke = false; const clear = ev.when(7); S.wx.smoke = true;
    const ch = ev.choices(); const m = S.money; ch[0].go(); const clinic = m - S.money;
    const h = S.happy; ch[1].go(); const inside = S.happy - h; S.airFilter = 2027; const h2 = S.happy; ev.choices()[1].go(); const insideF = S.happy - h2;
    const orig = Math.random; Math.random = () => 0; const m3 = S.money; ev.choices()[2].go(); Math.random = orig; const camp = m3 - S.money;
    return { noKids, kids, clear, clinic, want: medBill(120) + dayPay() / 2, inside, insideF, camp, n: ch.length };
  });
  assert(!r.noKids && r.kids && !r.clear && r.n === 3, JSON.stringify(r));
  assert(near(r.clinic, r.want, 0.01) && r.inside === -1 && r.insideF === 0 && near(r.camp, 450, 0.01), JSON.stringify(r));
});

await t.check('i75-a12: after a windstorm owners wait for a roofer, pay 30% to rush, or fix it with the Handy skill', async () => {
  const r = await ev(() => {
    const ws = EVENTS.find(e => e.title === 'Windstorm');
    fresh('two', { money: 9000, home: 'fixer', mortgage: 950, date: new Date(2027, 10, 1).getTime(), skills: {} });
    const ch = ws.choices().filter(c => !c.if || c.if()); const labels = ch.map(c => c.label);
    const m = S.money; ch[1].go(); const rush = m - S.money;
    ws.choices()[0].go(); const wait = { ...S.roofWait }; const h = S.happy; const l = []; weatherLines(l, []); const waitHappy = S.happy - h;
    S.turn = S.roofWait.at; const l2 = []; weatherLines(l2, []);
    const noDiy = ws.choices().filter(c => !c.if || c.if()).length; S.skills = { handy: 20 }; const diy = ws.choices().filter(c => !c.if || c.if()).some(c => /yourself/.test(c.label)) && noDiy === 3;
    fresh('two', { money: 9000 }); const renter = ws.choices().map(c => c.label);
    return { labels, rush, wait, waitHappy, paid: l2.length ? -l2[0][1] : 0, cleared: S.roofWait, diy, renter };
  });
  assert(r.labels.length === 3 && /roofer's list/.test(r.labels[0]) && /now/.test(r.labels[1]) && /Trim the big limb/.test(r.labels[2]), `owner choices ${r.labels}`);
  assert(r.rush > 1000 + 300 - 1, `rushing costs the deductible plus 30% of the job: ${r.rush}`);
  assert(r.wait.at >= 4 && r.wait.at <= 8 && r.wait.c >= 850 && r.waitHappy <= -1, JSON.stringify(r.wait) + ' ' + r.waitHappy);
  assert(near(r.paid, 1000) && r.diy && /damage/.test(r.renter[0]) && !r.renter.some(l => /roofer/.test(l)), JSON.stringify(r));
});

/* ---------- wave 1: events, family and money moments ---------- */
await t.check('i5-a01: you turn a year older every 52 weeks, right on time', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); weeks(52); const a1 = age(); weeks(52); const a2 = age();
    fresh('two', { kids: [] }); S.kids = [S.ageMonths]; weeks(52); return { a1, a2, kid: kidAge(S.kids[0]) }; });
  assert(r.a1 === 19 && r.a2 === 20 && r.kid === 1, JSON.stringify(r));
});

await t.check('i5-a03 + i46-a04: big results are milestones in the year in review and the Journal, and a kid moving out is logged', async () => {
  const r = await ev(() => { fresh('two');
    for (let i = 0; i < 10; i++) log(`Out and about: coffee ${i} at Howlin' Bean.`);
    for (let i = 0; i < 9; i++) log(`Small thing ${i}.`);
    log('Won a seat on the town council.', 'mile', 1); log('Took in a scruffy stray: you have a dog now.', undefined, 1);
    const ms = reviewMilestones(2027);
    fresh('two', { partner: true }); S.kids = [S.ageMonths - 18 * 12 + 0.1]; weekTick(false);
    const moved = S.log.find(e => /moved out/.test(e.m));
    logFilter = 'mile'; tab = 'log'; render(); const shown = document.querySelector('#main').textContent; logFilter = 'all';
    return { ms, moved, shown: /moved out/.test(shown), story: storyWorthy(moved) }; });
  assert(r.ms.length === 8 && r.ms.includes('Won a seat on the town council.') && r.ms.some(m => /stray/.test(m)), JSON.stringify(r.ms));
  assert(r.moved && r.moved.mile && /graduated from Waitsburg High and moved out/.test(r.moved.m) && r.shown && r.story, JSON.stringify(r));
});

await t.check('i5-a04: Celebration Days comes every year in May', async () => {
  const r = await ev(() => { fresh('two');
    S.date = new Date(2027, 4, 3).getTime(); let early = 0; for (let i = 0; i < 400; i++) if (fixedEvent(4)) early++;
    S.date = new Date(2027, 4, 27).getTime(); const last = fixedEvent(4) && fixedEvent(4).title;
    S.evCd['Celebration Days'] = S.turn + 40; const done = fixedEvent(4);
    S.date = new Date(2027, 3, 26).getTime(); const april = fixedEvent(3);
    // over a 2-year life with events on, Celebration Days comes both Mays
    fresh('two'); S.noEvents = false; let celeb = 0;
    for (let i = 0; i < 104; i++) { const res = weekTick(false); if (res.ev) { if (res.ev.title === 'Celebration Days') celeb++; resolveChoice(res.ev, res.ev.choices().find(c => !c.if || c.if())); } }   // i22-a01: the cooldown starts when you pick
    return { early, last, done, april, celeb, fixed: EVENTS.filter(e => e.fixed).map(e => e.title) }; });
  assert(r.early > 120 && r.early < 280 && r.last === 'Celebration Days' && r.done === null, JSON.stringify(r));
  assert(r.fixed.join() === 'Celebration Days' && r.april === null && r.celeb === 2, JSON.stringify(r));
});

await t.check('i15-a03: windstorms come October to March, once a year, and getting ready halves the damage', async () => {
  const r = await ev(() => { const ws = EVENTS.find(e => e.title === 'Windstorm');
    const months = [...Array(12).keys()].filter(m => ws.when(m));
    fresh('two', { money: 9000, home: 'fixer', mortgage: 950, date: new Date(2027, 10, 1).getTime(), skills: {} });
    const rnd = Math.random; Math.random = () => 0.5; const ch = ws.choices(); Math.random = rnd;
    const full = ch[0], prep = ch.find(c => /Trim the big limb/.test(c.label));
    full.go(); const c1 = S.roofWait.c; S.roofWait = null;
    const m = S.money; prep.go(); const paid = m - S.money, c2 = S.roofWait.c, handy = (S.skills.handy || 0) > 0;
    fresh('two', { money: 9000 }); const rp = ws.choices().find(c => /cooler/.test(c.label)); const m2 = S.money; rp.go();
    return { months, yr: ws.yr, c1, c2, paid, handy, renter: m2 - S.money }; });
  assert(r.months.join() === '0,1,2,9,10,11' && r.yr === 1, JSON.stringify(r));
  assert(near(r.c2, r.c1 / 2, 0.02) && near(r.paid, 40) && r.handy && near(r.renter, 20), JSON.stringify(r));
});

await t.check('i15-a04: a food truck says what it needs in April and what it earned in October; the card shows This season', async () => {
  const r = await ev(() => { fresh('two', { money: 20000, focus: 'rest', date: new Date(2027, 3, 5).getTime() });
    S.biz = { type: 'truck', weeks: 0, earned: 0, dep: 1 };
    const apr = weekTick(false).notes.join(' '); const apr2 = weekTick(false).notes.join(' ');
    tab = 'life'; render(); const idle = document.querySelector('#main').innerHTML;
    S.date = new Date(2027, 9, 18).getTime(); S.focus = 'hustle'; const oct1 = weekTick(false).notes.join(' '); S.focus = 'hustle'; const oct = weekTick(false).notes.join(' ');
    return { apr, apr2, idle: /This season/.test(idle) && /color:var\(--down\)"><b>\$0/.test(idle), oct1, oct, earned: S.biz.yr.in }; });
  assert(/Side hustle weeks/.test(r.apr) && !/Side hustle weeks/.test(r.apr2) && r.idle, JSON.stringify(r));
  assert(!/so far/.test(r.oct1) && /2027 so far: it earned/.test(r.oct) && /permit/.test(r.oct) && r.earned > 0, JSON.stringify(r));
});

await t.check('i26-b05: under 21, the tasting room and wine bar still have something, and an all-ages show comes instead of music night', async () => {
  const r = await ev(() => { fresh('two', { ageMonths: 19 * 12, money: 5000 }); S.date = new Date(2027, 5, 10).getTime(); S.turn = 2;
    const E = t => EVENTS.find(e => e.title === t);
    const open = visit('brick', 'openmic').msg, board = !actBlocked(placeById('gather'), actOf(placeById('gather'), 'board'));
    const show = E('All-ages show at The Royal Brick').when(5), music = E('Music night at The Royal Brick').when(5);
    const any21 = PLACES.filter(p => only21(p)).map(p => p.id), line = placeLine(placeById('brick'));
    S.ageMonths = 22 * 12; const show21 = E('All-ages show at The Royal Brick').when(5), music21 = E('Music night at The Royal Brick').when(5);
    return { open: !!open, board, show, music, any21, line, show21, music21 }; });
  assert(r.open && r.board && r.show && !r.music && !r.show21 && r.music21 && /Open this week/.test(r.line), JSON.stringify(r));
});

await t.check('i26-b06: traffic school only once every 3 years; a paid ticket adds a little to insurance for 3 years', async () => {
  const r = await ev(() => { const tk = EVENTS.find(e => e.title === 'Speeding ticket'), open = () => tk.choices().filter(c => !c.if || c.if());
    fresh('two', { jobId: 'rn', money: 5000 }); const first = open().map(c => c.label);
    open()[0].go(); S.turn += 60; const later = open().map(c => c.label); const ins0 = insMonthly();
    open()[0].go(); const ins1 = insMonthly(), line = insParts().some(([l]) => /speeding ticket/i.test(l));
    S.turn += 157; const ins2 = insMonthly(), back = open().length;
    return { first: first.length, school: /Traffic school/.test(first[0]), later, ins: ins1 - ins0, line, gone: ins2 === ins0, back }; });
  assert(r.first === 2 && r.school && r.later.length === 1 && /Pay it/.test(r.later[0]), JSON.stringify(r));
  assert(r.ins === 10 && r.line && r.gone && r.back === 2, JSON.stringify(r));
});

await t.check('i30-b01/b02: a grandkid\'s pickup and a car\'s lowest value follow prices', async () => {
  const r = await ev(() => { const p = { name:'Gran', nw:100000, community:60, col:4, wage:3, date:new Date(2080, 0, 5).getTime(), gen:1, mode:'normal', will:true };
    startLegacy(p, 'Kid'); const heir = S.carValue / S.col;
    fresh('two', { col: 3, carValue: 100 }); S.noEvents = true; weekTick(false); const floor = S.carValue / S.col;
    return { heir, floor }; });
  assert(near(r.heir, 2500) && r.floor > 499 && r.floor < 501.5, JSON.stringify(r));
});

await t.check('i37-b01: toddler moments come when a kid is 2 to 5, and trade money or work time for happiness', async () => {
  const r = await ev(() => { const T = TODDLER_EVENTS.map(e => e.title), E = t => EVENTS.find(e => e.title === t);
    fresh('two', { jobId: 'farmhand', community: 40 }); S.kids = [S.ageMonths - 3 * 12];
    const on = T.filter(t => E(t).when(4)); const m = S.money, h = S.happy; E('Daycare calls: a fever').choices()[0].go(); const cost = m - S.money, happy = S.happy - h;
    S.kids = [S.ageMonths - 8 * 12]; const off = T.filter(t => E(t).when(4));
    const seen = {}; S.kids = [S.ageMonths - 3 * 12]; for (let i = 0; i < 3000; i++) { const e = pickEvent(4); if (e && T.includes(e.title)) seen[e.title] = 1; }
    return { on, off, cost, happy, seen: Object.keys(seen).length, n: T.length }; });
  assert(r.n === 5 && r.on.length === 5 && r.off.length === 0 && r.cost > 0 && r.happy > 0 && r.seen === 5, JSON.stringify(r));
});

await t.check('i46-a02/a03: every kid gets one send-off the week they turn 18, named by birth order', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: 40 * 12, partner: true }); S.noEvents = false;
    S.kids = [S.ageMonths - 18 * 12 + 0.1, S.ageMonths - 15 * 12, S.ageMonths - 10 * 12];
    const e = rollEvent(4, null), text = e && e.text(); e.choices()[1].go(); const again = kidSendOff();
    S.ageMonths += 3 * 12; const mid = kidSendOff() && kidSendOff().text();
    kidSendOff().choices()[1].go(); S.ageMonths += 5 * 12; const young = kidSendOff() && kidSendOff().text();
    const w = EVENTS.find(x => x.title === 'A kid heads off to college').w;
    return { title: e && e.title, text, again, mid, young, sent: S.kidSent, w }; });
  assert(r.title === 'A kid heads off to college' && /^Your oldest/.test(r.text) && r.again === null, JSON.stringify(r));
  assert(/^Your middle one/.test(r.mid) && /^Your youngest/.test(r.young) && r.sent.join() === '0,1' && r.w === 0, JSON.stringify(r));
});

await t.check('i46-a15: most weeks with kids at home, the week details have one plain line about a kid', async () => {
  const r = await ev(() => { fresh('two'); const none = kidMoment(); S.kids = [S.ageMonths - 3 * 12, S.ageMonths - 14 * 12];
    const lines = []; for (let t = 0; t < 10; t++) { S.turn = t; lines.push(kidMoment()); }
    S.run = { weeks: 1, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] }; S.turn = 1; showRunDetails();
    const sheetTxt = document.querySelector('#sheet').textContent; closeSheet();
    return { none, n: lines.filter(Boolean).length, sample: lines.filter(Boolean).slice(0, 2), sheet: /🧒/.test(sheetTxt) }; });
  assert(r.none === '' && r.n === 8 && r.sheet && r.sample.every(l => /(oldest|youngest)/.test(l)), JSON.stringify(r));
});

await t.check('i58-b02: the cheaper health plan and light duty pay out week by week, only while you hold the job', async () => {
  const r = await ev(() => { const E = t => EVENTS.find(e => e.title === t);
    fresh('two', { jobId: 'farmhand', money: 5000, focus: 'rest' }); let m = S.money; E('Health plan choice').choices()[0].go(); const lump = S.money - m;
    const l1 = week().lines['Health plan savings']; leaveJob('walk'); const l2 = week().lines['Health plan savings'];
    fresh('two', { jobId: 'farmhand', money: 5000, focus: 'rest' }); const wp = weekPay(); m = S.money; E('Hurt on the job').choices()[0].go(); const lump2 = m - S.money;
    const ld = []; for (let i = 0; i < 6; i++) ld.push(week().lines['Light duty (80% pay)'] || 0);
    return { lump, l1, l2, lump2, ld, wp }; });
  assert(r.lump === 0 && near(r.l1, 20 * 12 / 52) && r.l2 === undefined, JSON.stringify(r));
  assert(r.lump2 === 0 && r.ld.filter(Boolean).length === 4 && near(-r.ld.reduce((a, b) => a + b, 0), r.wp * 0.8), JSON.stringify(r));
});

await t.check('i75-a13: a wind-and-hail plan saves a little a month; a wind claim then costs up to 1% of the home', async () => {
  const r = await ev(() => {
    fresh('two', { home: 'fixer', mortgage: 950 }); const flat = youPay('home', 3000, 'wind'), base = insMonthly();
    S.ins.wind = 'pct'; const pct = youPay('home', 3000, 'wind'), fire = youPay('home', 3000), small = youPay('home', 1200, 'wind'), cheaper = insMonthly();
    tab = 'life'; render(); insSheet(); const sheetTxt = document.querySelector('#sheet').textContent;
    document.querySelector('#sheet [data-ins="wind"][data-v="flat"]').click(); const back = S.ins.wind; closeSheet();
    fresh('two'); insSheet(); const renterSheet = !!document.querySelector('#sheet [data-ins="wind"]'); closeSheet();
    return { flat, pct, fire, small, base, cheaper, sheetTxt, back, renterSheet, ded: windDed() };
  });
  assert(r.flat === 1000 && r.pct === 1600 && r.fire === 1000 && r.small === 1200, JSON.stringify(r));
  assert(r.base - r.cheaper === 20, `saves ${r.base - r.cheaper} a month`);
  assert(/\$1,600/.test(r.sheetTxt) && r.back === 'flat' && !r.renterSheet, 'the sheet shows the dollar amount, and only to owners');
});

await t.check('i75-a14: after the flood, a raised furnace cuts later flood cleanup 80%; renters tell the landlord', async () => {
  const r = await ev(() => {
    const ev = EVENTS.find(e => e.title === 'After the flood: the furnace'), hi = EVENTS.find(e => e.title === 'The Touchet is running high');
    fresh('two', { money: 9000, home: 'fixer', mortgage: 950 }); const before = ev.when();
    S.chains = { levee: { step: 2, at: 0, f: {} } }; const after = ev.when(); const m = S.money; ev.choices()[0].go(); const paid = m - S.money; const again = ev.when();
    const orig = Math.random; Math.random = () => 0; const m2 = S.money; hi.choices()[1].go(); Math.random = orig; const flood = m2 - S.money;
    S.home = 'house'; const l = []; weatherLines(l, []); const kept = S.floodProof; const renter = ev.when() && ev.choices().map(c => c.label);
    S.home = 'farm'; S.floodAsk = null; const farm = ev.when();
    return { before, after, paid, again, flood, kept, renter, farm };
  });
  assert(!r.before && r.after && near(r.paid, 950) && !r.again, JSON.stringify(r));
  assert(near(r.flood, 500), `flood cleanup ${r.flood}`);
  assert(r.kept === null && r.renter.length === 1 && /landlord/.test(r.renter[0]) && !r.farm, JSON.stringify(r));
});

await t.check('i75-a19/a26: no power: remote workers choose the library, a vacation day or the lost day; cards by lantern need people', async () => {
  const r = await ev(() => {
    const ev = EVENTS.find(e => e.title === 'Ice storm knocks out power'), open = () => ev.choices().filter(c => !c.if || c.if()).map(c => c.label);
    fresh('two', { money: 3000, jobId: 'farmhand', community: 20, date: new Date(2027, 11, 6).getTime() }); const plain = open();
    S.partner = true; const withPartner = open(); const h = S.happy, cm = S.community; ev.choices().find(c => /lantern/.test(c.label)).go();
    const lantern = [S.happy - h, S.community - cm];
    fresh('two', { money: 3000, jobId: 'remote', edu: 3, community: 20, date: new Date(2027, 11, 6).getTime() }); const remote = open();
    ev.choices().find(c => /vacation/.test(c.label)).go(); const vacAgain = open().some(l => /vacation/.test(l));
    const m = S.money; ev.choices().find(c => /Miss/.test(c.label)).go(); const miss = m - S.money;
    const ice = EVENTS.find(e => e.title === 'An ice storm'); const iceRemote = ice.choices().map(c => c.label);
    return { plain, withPartner, lantern, remote, vacAgain, miss, day: dayPay(), iceRemote };
  });
  assert(r.plain.some(l => /Wait it out/.test(l)) && !r.plain.some(l => /lantern|library/.test(l)) && r.withPartner.some(l => /lantern/.test(l)), JSON.stringify(r));
  assert(r.lantern[0] === 1 && r.lantern[1] === 1, `lantern (waiting it out -2, then +3) ${r.lantern}`);
  assert(r.remote.some(l => /library/.test(l)) && r.remote.some(l => /vacation/.test(l)) && r.remote.some(l => /Miss/.test(l)) && !r.remote.some(l => /Wait it out/.test(l)) && !r.vacAgain, JSON.stringify(r.remote));
  assert(near(r.miss, r.day, 0.01) && r.iceRemote.some(l => /library/.test(l)), JSON.stringify(r));
});

await t.check('i75-a21: clearing the neighbor\'s walk costs a little health each snow and earns a pie after three winters', async () => {
  const r = await ev(() => {
    fresh('two', { date: new Date(2027, 11, 6).getTime(), health: 70, community: 30 }); tab = 'home'; render();
    const btn = document.querySelector('#walk'); const pressed0 = btn.getAttribute('aria-pressed'); btn.click(); const on = S.walk, pressed1 = document.querySelector('#walk').getAttribute('aria-pressed');
    const orig = Math.random; Math.random = () => 0; const notes = [];
    weatherLines([], notes); const d = [S.health - 70, S.community - 30, S.walkWinters];
    for (const y of [2029, 2030]) { S.date = new Date(y, 0, 10).getTime(); weatherLines([], notes); }
    Math.random = orig; const pie = S.walkPie;
    S.date = new Date(2028, 6, 5).getTime(); render(); const summer = !!document.querySelector('#walk');
    return { pressed0, pressed1, on, d, pie, winters: S.walkWinters, notes, summer };
  });
  assert(r.pressed0 === 'false' && r.on && r.pressed1 === 'true', 'the Home toggle switches and says so');
  assert(r.d[0] === -1 && r.d[1] === 1 && r.d[2] === 1, `a snowy week ${r.d}`);
  assert(r.pie && r.winters === 3 && r.notes.some(n => /pie/.test(n)) && !r.summer, JSON.stringify(r));
});

await t.check('i75-a25/a27/a28: wind on Highway 12, de-icing at the airport and heat limits at Hanford', async () => {
  const r = await ev(() => {
    const hw = EVENTS.find(e => e.title === 'High wind closes Highway 12 to trucks'), de = EVENTS.find(e => e.title === 'De-icing planes at 5 a.m.'), hf = EVENTS.find(e => e.title === 'Heat limits in the suit at Hanford');
    fresh('two', { jobId: 'trucker', certs: { cdl: 1 }, edu: 1 }); const truck = hw.choices().map(c => c.label);
    fresh('two', { jobId: 'cna', edu: 1 }); const comm = hw.choices().map(c => c.label);
    const orig = Math.random; Math.random = () => 0; const m = S.money; hw.choices()[1].go(); Math.random = orig; const crash = m - S.money;
    fresh('two', { jobId: 'airport' }); const deW = de.when(0), deS = de.when(6); const m2 = S.money, h = S.health; de.choices()[0].go(); const ot = [S.money - m2, S.health - h];
    fresh('two', { jobId: 'hanford', edu: 1, date: new Date(2027, 6, 5).getTime(), wx: { y: 2027, dry: false, wet: false, smoke: false, heat: false, rain: false } }); const hfClear = hf.when(6); S.wx.heat = true; const hfHot = hf.when(6);
    return { truck, comm, crash, deW, deS, ot, hfClear, hfHot, cat: [hw.cat, de.cat, hf.cat] };
  });
  assert(/Park the rig/.test(r.truck[0]) && /long way/.test(r.truck[1]) && /Slow down/.test(r.comm[0]), JSON.stringify(r));
  assert(near(r.crash, 500) && r.deW && !r.deS && r.ot[0] > 0 && r.ot[1] === -3 && !r.hfClear && r.hfHot, JSON.stringify(r));
  assert(r.cat.join() === 'road,work,work', `paced by category ${r.cat}`);
});

await t.check('i75-a33: a block captain runs the storm plan: an evening, more community, and the plan list grows', async () => {
  const r = await ev(() => {
    fresh('two', { community: 35 }); tab = 'life'; render(); const locked = !document.querySelector('#capton');
    S.community = 45; render(); document.querySelector('#capton').click(); const cap = !!S.captain;
    const ws = EVENTS.find(e => e.title === 'Windstorm'), po = EVENTS.find(e => e.title === 'Ice storm knocks out power'), plan = () => po.choices().find(c => /storm plan/.test(c.label));
    const first = ws.choices()[0].label; const c0 = S.community; ws.choices()[0].go(); const gain = S.community - c0;
    plan().go(); plan().go(); render(); const list = [...document.querySelectorAll('#main ul[aria-label] li')].map(li => li.textContent);
    document.querySelector('#captoff').click(); const off = S.captain;
    return { locked, cap, first, gain, runs: 3, list, off };
  });
  assert(r.locked && r.cap && /storm plan/.test(r.first) && r.gain === 3, JSON.stringify(r));
  assert(r.list.length === 3 && r.list.every(l => l.startsWith('✅')) && r.off === null, JSON.stringify(r.list));
});

await t.check('i75: older saves load with the new weather fields', async () => {
  const r = await ev(() => { const s = migrate({ name: 'Old', len: 'two', turn: 40, date: new Date(2027, 9, 1).getTime(), ins: { auto: 'full', renters: true, ded: 1000 } });
    S = s; S.noEvents = true; const c = weatherCard(); weeks(2); return { walk: s.walk, captain: s.captain, roof: s.roofWait, ok: /Ready for weather/.test(c), wind: youPay('home', 3000, 'wind') }; });
  assert(r.walk === false && r.captain === null && r.roof === null && r.ok && r.wind === 0, JSON.stringify(r));
});

await t.check('Waitsburg pack A, part 1 (W1–W15): months, who sees what, town goals, prices that rise, and the barn cat', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t), open = e => e.choices().filter(c => !c.if || c.if()).map(c => c.label);
    fresh('two', { community: 20 });
    const all = TOWN_EVENTS_A1.every(e => evCat(e) === 'town' && EVENT_PLACE[e.title] && EVENT_PLACE[e.title][0] === 'T');
    const months = { 'Preston Park cleanup day': [3], 'Museum open house': [5], 'Fourth of July parade': [6], 'Trout opener on Coppei Creek': [3], 'Library book sale': [9],
      'Ice storm knocks out power': [11, 0, 1], 'Frozen pipes': [11, 0, 1], 'Citywide yard sale': [5], 'School fundraiser auction': [2], 'Fire district pancake breakfast': [4],
      'Smoke from a wheat-field fire': [7], 'Mice in the walls': [9], "Neighbor's chickens loose in your yard": [2, 3, 4, 5, 6, 7] };
    const badMonth = Object.entries(months).filter(([t, ms]) => [...Array(12).keys()].some(m => E(t).when(m) !== ms.includes(m))).map(([t]) => t);
    const lowFloat = open(E('Fourth of July parade')).length, lowFlip = open(E('Fire district pancake breakfast')).length;
    S.community = 45; const hiFloat = open(E('Fourth of July parade')).length, hiFlip = open(E('Fire district pancake breakfast')).length;
    const renterPipes = open(E('Frozen pipes')).length; S.home = 'fixer'; const ownerPipes = open(E('Frozen pipes')).length;
    S.skills = { handy: 8 }; const handyPipes = open(E('Frozen pipes')).length;
    const once = !!E('An old friend moves back').once, yearly = ['Preston Park cleanup day', 'Mice in the walls', 'Ice storm knocks out power'].every(t => E(t).yr) && !E('FFA bake sale').yr;
    // helping in the April cleanup counts as a week toward the spring town goal
    S.date = new Date(2027, 3, 10).getTime(); S.sgoal = null; const h0 = S.community; E('Preston Park cleanup day').choices()[0].go(); const goal1 = S.sgoal && S.sgoal.prog;
    S.sgoal.prog = SEASON_GOALS[0].need - 1; const wins = S.seasonWins || 0; const msg = E('Preston Park cleanup day').choices()[0].go(); const done = S.sgoal.done && S.seasonWins === wins + 1 && /town goal/.test(msg);
    // prices rise with the cost of living
    S.col = 1.5; const m0 = S.money; E('Trout opener on Coppei Creek').choices()[0].go(); const paid = m0 - S.money; const label = open(E('Trout opener on Coppei Creek'))[0];
    // the barn cat: half a dog's cheer, about $20 a month, and it can't be adopted twice
    fresh('two', { focus: 'rest' }); const b0 = week().lines; const happy0 = S.happy;
    fresh('two', { focus: 'rest', cat: true }); const b1 = week().lines; const noSecond = !open(E('Mice in the walls')).some(l => /cat/.test(l));
    return { all, badMonth, lowFloat, hiFloat, lowFlip, hiFlip, renterPipes, ownerPipes, handyPipes, once, yearly, goal1, done, paid, label, catBill: b1['Cat food'], noCatBill: b0['Cat food'], noSecond, h0 };
  });
  assert(r.all, 'every pack event is a town event with a Waitsburg map place');
  assert(!r.badMonth.length, `wrong months: ${r.badMonth}`);
  assert(r.lowFloat === 1 && r.hiFloat === 2 && r.lowFlip === 1 && r.hiFlip === 2, `community-gated choices ${JSON.stringify(r)}`);
  assert(r.renterPipes === 1 && r.ownerPipes === 1 && r.handyPipes === 2, `frozen pipes choices ${JSON.stringify(r)}`);
  assert(r.once && r.yearly, 'repeat rules are off');
  assert(r.goal1 === 1 && r.done, `town goal ${JSON.stringify(r)}`);
  assert(near(r.paid, 45) && r.label.includes('$45'), `the license should cost $45 at +50% prices: ${r.paid} / ${r.label}`);
  assert(near(r.catBill, -20 * W) && r.noCatBill === undefined && r.noSecond, `cat ${JSON.stringify(r)}`);
});

// ---- ideas round 75, economy balance (i75-b01 … b14) ----
await t.check('i75-b01: every full-time job pays at least Washington\'s 2027 minimum wage, and the starting jobs keep their order', async () => {
  const r = await ev(() => ({ min: MIN_WAGE_MONTH, low: JOBS.filter(j => j.pay < MIN_WAGE_MONTH).map(j => `${j.id} ${j.pay}`),
    order: ['diner', 'lift', 'farmhand', 'hardware', 'onion', 'para'].map(id => jobById(id).pay), retail: jobById('retail').pay }));
  assert(r.min === 3050 && !r.low.length, `under the minimum wage: ${r.low.join(', ')}`);
  assert(r.order.every((p, i) => i === 0 || p > r.order[i - 1]) && r.order[0] >= 3050 && r.order[5] <= 3400 && r.retail >= 3050, `order ${r.order}`);
});

await t.check('i75-b02: living costs at 2027 prices: food and utilities $700, a room $650, the rented house $1,250', async () => {
  const r = await ev(() => { fresh('two', { focus: 'rest' }); const a = week().lines; fresh('two', { focus: 'rest', home: 'house' }); const b = week().lines;
    return { food: a['Food & utilities'], room: a['Rent'], house: b['Rent'], share: GROCERY_SHARE }; });
  assert(near(r.food, -700 * W) && near(r.room, -650 * W) && near(r.house, -1250 * W) && r.share === 400, JSON.stringify(r));
});

await t.check('i75-b03: taxes by bracket: 13% to 22%, smooth (a raise never lowers take-home), rising with pay, and the Jobs list uses them', async () => {
  const r = await ev(() => { fresh('two');
    const rates = [3000, 3500, 6000, 8000, 9000, 12000].map(p => taxRate(p));
    let mono = true, prev = 0; for (let p = 1000; p <= 15000; p += 50) { const th = p * (1 - taxRate(p)); if (th < prev) mono = false; prev = th; }
    S.wage = 1.5; const scaled = taxRate(6000 * 1.5); S.wage = 1;
    fresh('two', { jobId: 'scientist', focus: 'rest' }); const l = week().lines; const want = -9200 * W * 0.22;
    fresh('two'); const th = takeHome(jobById('rn')), expTh = 8600 * W * (1 - taxRate(8600)) - commuteCost(21, CARS[S.car], jobById('rn')) * W;
    return { rates, mono, scaled, tax: l['Taxes'], want, th, expTh }; });
  assert(near(r.rates[0], 0.13) && near(r.rates[1], 0.13) && near(r.rates[2], 0.16) && near(r.rates[3], 0.20) && near(r.rates[4], 0.22) && near(r.rates[5], 0.22), `rates ${r.rates}`);
  assert(r.mono && near(r.scaled, 0.16), `take-home must rise with pay; brackets rise with S.wage (${r.scaled})`);
  assert(near(r.tax, r.want, 0.01) && near(r.th, r.expTh, 0.001), JSON.stringify(r));
});

await t.check('i75-b04: health insurance costs $130 a month while working before 50; no job means Apple Health for $0', async () => {
  const r = await ev(() => { fresh('two', { focus: 'rest' }); const none = week().lines['Health care'];
    fresh('two', { focus: 'rest', jobId: 'diner' }); const work = week().lines['Health care'];
    fresh('life', { focus: 'rest', jobId: 'diner', ageMonths: 55 * 12 }); const old = week().lines['Health care'];
    fresh('two', { jobId: 'diner' }); const out = moneyOutlook().weeks.length; return { none, work, old, out, lowPay: APPLE_HEALTH_PAY }; });
  assert(!r.none && near(r.work, -130 * W) && near(r.old, -180 * W) && r.lowPay === 1900 && r.out === 13, JSON.stringify(r));
});

await t.check('i75-b05: unemployment pays 41% of the last job\'s pay, between $1,500 and $4,900, after a layoff (not a quit)', async () => {
  const r = await ev(() => {
    const laid = id => { fresh('two', { jobId: id, focus: 'rest' }); leaveJob('laid'); S.ui = 6; return week().lines['Unemployment benefits'] / W; };
    const rn = laid('rn'), diner = laid('diner');
    fresh('two', { jobId: 'rn' }); S.ui = 0; leaveJob('notice'); const quit = week().lines['Unemployment benefits'];
    fresh('two', { jobId: 'lift', date: new Date(2027, 2, 29).getTime() }); weeks(2); const season = S.uiPay;
    return { rn, diner, quit, season }; });
  assert(near(r.rn, 8600 * 0.41, 0.001) && near(r.diner, 1500, 0.001) && !r.quit, JSON.stringify(r));
  assert(near(r.season, 1500, 0.001), `a seasonal layoff sets the benefit too: ${r.season}`);
});

await t.check('i75-b06/b08/b09: nurses, aides and techs at valley rates; the food plant, loan officer and lab office pay for the drive', async () => {
  const r = await ev(() => { const p = id => jobById(id).pay;
    fresh('two'); const best3 = takeHome(jobById('remote')) > takeHome(jobById('loan')) && takeHome(jobById('scientist')) > takeHome(jobById('loan'));
    return { rn: p('rn'), cna: p('cna'), imaging: p('imaging'), para: p('para'), mech: p('mech'), plant: p('foodplant'), loan: p('loan'), lab: p('labadmin'),
      remote: [jobById('loan').remote, jobById('labadmin').remote], best3 }; });
  assert(r.rn === 8600 && r.cna === 3800 && r.imaging === 6400 && r.para === 3300 && r.mech === 4800, JSON.stringify(r));
  assert(r.plant === 3600 && r.loan === 6900 && r.lab === 5400 && r.remote.join() === '3,3' && r.best3, JSON.stringify(r));
});

await t.check('i75-b08: the mall is always hiring and gives 10% off Tri-Cities stops; the food plant pays 30% harvest overtime', async () => {
  const r = await ev(() => { fresh('two', { community: 0 }); const odds = hireOdds(jobById('retail'));
    fresh('two', { jobId: 'retail', date: new Date(2027, 5, 7).getTime() }); planTrip('kennewick', ['court']); const court = week().lines['The mall food court'];
    fresh('two', { jobId: 'foodplant', focus: 'rest', date: new Date(2027, 7, 9).getTime() }); const aug = week().lines['Paycheck + overtime'];
    fresh('two', { jobId: 'foodplant', focus: 'rest', date: new Date(2027, 4, 3).getTime() }); const may = week().lines['Paycheck'];
    return { odds, court, aug, may }; });
  assert(r.odds >= 0.95 && near(r.court, -14 * 0.9, 0.01), JSON.stringify(r));
  assert(near(r.aug, 3600 * W * 1.3) && near(r.may, 3600 * W), JSON.stringify(r));
});

await t.check('i75-b11/b12: the 401(k) counts at 88% after tax; the match vests after 3 years, and leaving sooner gives it back', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand', k401rate: 1, focus: 'rest' }); weeks(10); const k = S.k401, m = S.k401match; startJob('diner'); const after = S.k401;
    fresh('two', { jobId: 'farmhand', k401rate: 1, focus: 'rest', tenure: 35.9 }); weeks(2); const vested = S.k401match; startJob('diner'); const kept = S.k401 > 0;
    fresh('two', { k401: 10000, money: 0, carValue: 0 }); const nw = netWorth();
    return { k, m, after, vested, kept, nw, log: S.log.length }; });
  assert(near(r.m, r.k * 3 / 8, 0.02) && near(r.after, r.k - r.m, 0.001), `unvested match ${JSON.stringify(r)}`);
  assert(r.vested === 0 && r.kept && near(r.nw, 8800), JSON.stringify(r));
});

await t.check('i75-b13/b14: retirement draws follow the IRS table after 73; Social Security is untaxed under $3,000, 401(k) draws taxed 10%', async () => {
  const r = await ev(() => {
    const rates = [62, 72, 73, 80, 90].map(a => drawRate(a));
    fresh('life', { retired: true, k401: 100000, ageMonths: 80 * 12, earnYears: 35, earnSum: 35 * (2000 + 4000 / 6) }); const l = week().lines;
    return { rates, w: l['401(k) withdrawal'], tax: l['Taxes'], ss: l['Social Security'] }; });
  assert(near(r.rates[0], 0.04) && near(r.rates[1], 0.04) && near(r.rates[2], 1 / 26.5) && near(r.rates[3], 1 / 20.2) && near(r.rates[4], 1 / 12.2), `rates ${r.rates}`);
  assert(near(r.w, 100000 / 20.2 * W / 12, 0.001) && near(r.tax, -r.w * 0.1, 0.001), JSON.stringify(r));
});

await t.check('i75: older saves load with the new fields filled in (unvested match 0, benefits at the floor)', async () => {
  const r = await ev(() => { const old = JSON.parse(JSON.stringify(fresh('two', { jobId: 'farmhand', k401: 500, ui: 3 }))); delete old.k401match; delete old.uiPay;
    const m = migrate(old); S = m; S.jobId = null; const ui = week().lines['Unemployment benefits']; return { match: m.k401match, uiPay: m.uiPay, ui }; });
  assert(r.match === 0 && r.uiPay === null && near(r.ui, 1500 * W), JSON.stringify(r));
});

// i63-b02: one frozen backup per format this app has ever written; every one must still restore
const FIXTURES = {
  json: '{"app":"theburg","kind":"backup","v":1,"slots":[{"name":"Fixture","len":"two","turn":5,"money":1000}],"best":{"two":61}}',
  burg0: 'BURG0:eyJhcHAiOiJ0aGVidXJnIiwia2luZCI6ImJhY2t1cCIsInYiOjEsInNsb3RzIjpbeyJuYW1lIjoiRml4dHVyZSIsImxlbiI6InR3byIsInR1cm4iOjUsIm1vbmV5IjoxMDAwfV0sImJlc3QiOnsidHdvIjo2MX19',
  burg1: 'BURG1:H4sIAAAAAAAC/x2MOxKEIBBE79IxAQYazAG8xNYGoFNqqUAJ+CmKuzu7Wb/+FZgQQEgz23xMUFgXN4phzbDmIHyCGoW4+RRBnwJndpa8X+6UD5bCxu53cHnRYgm0Crt3/MhSa12/CpZjApV/i7qm1hcuwp+qeAAAAA==',
  burg2: 'BURG2:H4sIAAAAAAAC/x2MOw7CMBBE7zK1CwcJij0AB6BFFDZZgZVkbflDQJbvzkI3b+ZpOlxKINQn+5YfMFiCzFp4d19aUn6BDgZljbWArh3iNtb9HN61ZVZhZfkd7FGzVgpHgy0Kf0CTtXbcDDyXCup/i07TUCHIhd3MWaXxBRnt/gSGAAAA.132.14be3af5',
  burg2plain: 'BURG2:eyJhcHAiOiJ0aGVidXJnIiwia2luZCI6ImJhY2t1cCIsInYiOjIsInNsb3RzIjpbeyJuYW1lIjoiRml4dHVyZSIsImxlbiI6InR3byIsInR1cm4iOjUsIm1vbmV5IjoxMDAwfV0sImJlc3QiOnsidHdvIjo2MX0sIm1pblJlYWRlciI6MX0=.134.04feed19'
};
await t.check('i63-b02: a frozen backup of every format (file, BURG0, BURG1, BURG2) still restores', async () => {
  const r = await ev(async fx => { const out = {}; for (const [k, v] of Object.entries(fx)) { try { const b = await readBackup(v); out[k] = `${b.lives[0].name}/${b.lives[0].turn}/${b.best.two}`; } catch (e) { out[k] = 'ERR ' + e.message; } } return out; }, FIXTURES);
  for (const [k, v] of Object.entries(r)) assert(v === 'Fixture/5/61', `${k}: ${v}`);
});

await t.check('i63-b01: a BURG2 code checks itself: a cut-off end, a missing middle and a changed letter each say so', async () => {
  const r = await ev(async () => {
    localStorage.clear(); newGame('Check', 'two', 0); S.turn = 12; save();
    const code = await backupCode(backupData()), [, body, len, crc] = code.match(/^BURG2:(.*)\.(\d+)\.(\w+)$/);
    const msg = async t => { try { await readBackup(t); return 'accepted'; } catch (e) { return e.part || e.message; } };
    const mid = Math.floor(body.length / 2), swap = body[mid] === 'A' ? 'B' : 'A';
    const wrapped = code.replace(/(.{60})/g, '$1\n ');          // pasted through a message that wraps lines
    return { ok: (await readBackup(code)).lives[0].name, wrapped: (await readBackup(wrapped)).lives[0].name,
      cut: await msg(code.slice(0, code.length - 30)), cutTail: await msg(code.slice(0, code.lastIndexOf('.'))),
      middle: await msg(`BURG2:${body.slice(0, mid - 8) + body.slice(mid - 4)}.${len}.${crc}`),
      changed: await msg(`BURG2:${body.slice(0, mid) + swap + body.slice(mid + 1)}.${len}.${crc}`),
      text: await (async () => { try { await readBackup(code.slice(0, -40)); } catch (e) { return e.message; } })() };
  });
  assert(r.ok === 'Check' && r.wrapped === 'Check', `round trip: ${r.ok} / ${r.wrapped}`);
  assert(r.cut === 'end' && r.cutTail === 'end', `cut-off code: ${r.cut} / ${r.cutTail}`);
  assert(r.middle === 'middle', `missing middle: ${r.middle}`);
  assert(r.changed === 'changed', `changed letter: ${r.changed}`);
  assert(/last part/i.test(r.text), r.text);
});

await t.check('i63-b02: a backup from a newer Burg asks you to update instead of guessing', async () => {
  const r = await ev(async () => {
    const tryIt = async t => { try { await readBackup(t); return 'accepted'; } catch (e) { return e.newer ? 'newer' : e.message; } };
    const life = [{ name: 'Future', len: 'two', turn: 3 }];
    return { v9: await tryIt(JSON.stringify({ app: 'theburg', v: 9, minReader: 9, slots: life })),
      v9ok: await tryIt(JSON.stringify({ app: 'theburg', v: 9, minReader: 1, slots: life })),
      code: await tryIt('BURG7:abc'), mine: backupData().v === BACKUP_V && backupData().minReader === 1 };
  });
  assert(r.v9 === 'newer' && r.code === 'newer', `newer: ${r.v9} / ${r.code}`);
  assert(r.v9ok === 'accepted', `a newer backup old apps can still read: ${r.v9ok}`);
  assert(r.mine, 'backupData() writes v and minReader');
});

await t.check('i63-b22: restoring an earlier week of a life on this phone marks it rewound: no best score or badges at its end', async () => {
  const r = await ev(async () => {
    localStorage.clear(); newGame('Rewind', 'half', 0); S.noEvents = true; S.turn = 4; save();
    const lid = S.lid, old = await readBackup(JSON.stringify(backupData()));
    S.turn = 20; save();
    const older = olderCopies(old).length;
    restoreBackup(old, 'add');
    const copy = slots()[1];
    const fresh = await readBackup(JSON.stringify(backupData()));   // same weeks as here: not older
    loadSlot(1); const rew = S.rewound; S.turn = 25; S.health = 90; S.money = 900000;
    store.set(BEST_KEY, {}); store.set(BADGE_KEY, {});
    badgeWeek([]); const inLife = Object.keys(S.badges).length;
    finish('done'); closeSheet();
    return { lid: !!lid && copy.lid === lid, older, rewound: copy.rewound && rew, notOlder: olderCopies(fresh).filter(([g]) => g.lid === lid && g.turn === 20).length,
      best: Object.keys(store.get(BEST_KEY) || {}).length, badges: Object.keys(store.get(BADGE_KEY) || {}).length, inLife };
  });
  assert(r.lid, 'lives keep their id through a backup');
  assert(r.older === 1 && r.rewound, `older ${r.older}, rewound ${r.rewound}`);
  assert(r.notOlder === 0, 'a copy at the same week is not older');
  assert(r.best === 0, 'a rewound life set a best score');
  assert(r.inLife > 0 && r.badges === 0, `badges: ${r.inLife} in the life, ${r.badges} in the collection`);
});

await t.check('i63-b08: 4 weeks before a 2-year or 5-year life ends, the week offers a backup, once', async () => {
  const r = await ev(() => {
    const run = (len, from) => { fresh(len, { jobId: 'farmhand' }); S.turn = from; const got = []; for (let i = 0; i < 6 && S.turn < LENGTHS[len].turns - 1; i++) { const res = weekTick(false); if (res.notes.includes(BACKUP_NUDGE)) got.push(S.turn); } return got; };
    return { two: run('two', 97), five: run('five', 253), half: run('half', 19), old: (() => { const g = migrate({ name: 'Old', len: 'two', turn: 50 }); return g.backupNudged === false && typeof g.lid === 'string'; })() };
  });
  assert(r.two.join() === '100' && r.five.join() === '256', `2y ${r.two} 5y ${r.five}`);
  assert(!r.half.length, `6-month life nudged: ${r.half}`);
  assert(r.old, 'old saves get the new fields');
});

await t.check('i73-b18: the shared score card comes with a short text (and the week for a weekly challenge)', async () => {
  const r = await ev(() => { fresh('two'); const a = shareText(); S.len = 'half'; S.weekly = '2026-W47'; const b = shareText(); S.weekly = null; S.len = 'life'; const c = shareText(); return { a, b, c }; });
  assert(/^Rules scored \d+, [A-Z][\w ]+, in a 2-year life in The Burg\. krazow\.github\.io\/The-Burg$/.test(r.a), r.a);
  assert(r.b.includes('in a 6-month life in The Burg (Weekly challenge, week of Nov 16).'), r.b);
  assert(r.c.includes('in a lifetime in The Burg'), r.c);
});

// i56-b16: every event has a way to happen. Each event needs a row: a setup (job, month, health, home, chain step…)
// under which its when() is true and pickEvent (or planDue, for events that come when they're due) returns it.
// Most events are found by the broad setups; the REACH rows name the special state the rest need.
// A new event that no row reaches fails here: add a row for it.
await t.check('i56-b16: reach table: every event can happen under some setup, and pickEvent can return it', async () => {
  const r = await ev(() => {
    const chainRow = (id, step, f = {}) => () => { S.chains = { ...(S.chains || {}), [id]: { step, at: 0, f } }; };
    const farJob = () => JOBS.find(j => { S.jobId = j.id; return commuteOneWay() >= 20; }).id;
    const deskJob = () => JOBS.find(j => !j.wear && !j.season).id;
    const unionJob = () => JOBS.find(j => j.union && !j.season).id;
    // [month, setup] per event that the broad setups below don't reach
    const REACH = {
      'Starting a family?': [3, () => { S.partner = true; S.ageMonths = 26 * 12; }],
      'A kid heads off to college': [8, () => { S.ageMonths = 45 * 12; S.kids = [S.ageMonths - 18 * 12 - 2]; }],
      'A hard winter on the herd': [0, () => { S.biz = { type: 'cattle', weeks: 60, value: 16000, hard: thisYear() - 1 }; }],
      'Wildfire smoke over the valley': [7, () => { S.smoke = thisYear(); }],
      'Your carpool buddy is always late': [4, () => { S.jobId = farJob(); S.edu = 3; S.carpool = true; }],
      'Chains required on the road to Bluewood': [0, () => { S.roadTo = 'dayton'; }],
      "Neighbor's tree takes out your fence": [10, () => { S.home = 'fixer'; S.evCd['Windstorm'] = S.turn + 52; }],   // a windstorm two weeks ago (its cooldown runs a year)
      'A cough in a smoke week': [7, () => { S.kids = [S.ageMonths - 60]; S.wx.smoke = true; }],
      'After the flood: the furnace': [5, () => { S.home = 'fixer'; chainRow('levee', 2)(); S.floodAsk = null; }],
      'The kitchen is next': [5, () => { S.home = 'fixer'; chainRow('fixer', 2)(); }],
      'The house is coming together': [5, () => { S.home = 'fixer'; chainRow('fixer', 3)(); }],
      'Opening day for the food truck': [5, () => { S.biz = { type: 'truck', weeks: 10, value: 8000 }; chainRow('truck', 2)(); }],
      'A year of the food truck': [5, () => { S.biz = { type: 'truck', weeks: 60, value: 8000 }; chainRow('truck', 3)(); }],
      'Water in the basements': [3, () => { S.highWater = S.turn - 2; }],
      'A levee for the town': [5, chainRow('levee', 2)],
      'The levee is dedicated': [5, chainRow('levee', 3)],
      'Contract vote': [4, () => { S.jobId = unionJob(); S.edu = 3; S.contractAt = S.turn; }],
      'Wine weekend guests': [6, () => { S.home = 'farm'; S.roomHost = true; S.hostLast = S.turn; }],
      'A rough guest': [6, () => { S.home = 'farm'; S.roomHost = true; S.hostLast = S.turn; }],
      'Stiff after a long day at the desk': [4, () => { S.jobId = deskJob(); S.edu = 3; S.ageMonths = 45 * 12; S.deskHabit = false; }],
      'Gray January': [0, () => { S.gray = { left: 3, y: thisYear() }; }],
      'The neighbor on oxygen': [0, () => { S.outage = S.turn; }],
      'Line crews fill the café': [0, () => { S.jobId = 'diner'; S.outage = S.turn; }],
      'An ice storm in calving season': [1, () => { S.biz = { type: 'cattle', weeks: 60, value: 16000 }; S.wxW.kind = 'hard'; }],
      'Dale says thanks': [5, chainRow('farmer', 2)],
      'Bluegrass jam at Tonnage': [5, () => { S.turn = 301; }],   // rolled the week before a jam week (i22-a13)
      'Heat limits in the suit at Hanford': [6, () => { S.jobId = 'hanford'; S.edu = 3; S.wx.heat = true; }],
      'Physical therapy, or tough it out?': [4, () => { S.jobId = 'farmhand'; S.injury = { part: 'back', ask: true, at: S.turn }; }],
      'Family leave is ending': [4, () => { S.ageMonths = 50 * 12; S.parent = { who: 'leave', until: S.turn + 40, leaveEnd: S.turn, drain: { happy: 0, health: 0 }, leaveUsed: true }; }],
      // events that come when they're due (planDue)
      'Long-term care insurance': [3, () => { S.ageMonths = 56 * 12; S.ltc = null; }],
      'Who will care for you?': [3, () => { S.ageMonths = 77 * 12; S.health = 40; S.care = null; }],
      'Winter in Arizona?': [11, () => { S.ageMonths = 70 * 12; S.retired = true; S.jobId = null; S.money = 100000; }],
      'Scholarship night at Waitsburg High': [5, () => { S.scholar = { y: 0, n: 0 }; }]
    };
    // the broad setups: every job (with school and certificates), every home, car and business, and a few lives
    const BROAD = [['fresh', () => {}]];
    for (const j of JOBS) BROAD.push(['job ' + j.id, () => { S.jobId = j.id; S.edu = 3; S.jobMonths = 24; S.tenure = 24; S.certs = Object.fromEntries(Object.keys(CERTS).map(k => [k, 1])); }]);
    for (const h of Object.keys(HOMES)) BROAD.push(['home ' + h, () => { S.home = h; S.jobId = 'farmhand'; }]);
    for (const c of Object.keys(CARS)) BROAD.push(['car ' + c, () => { S.car = c; S.jobId = 'farmhand'; }]);
    for (const b of Object.keys(BIZ)) BROAD.push(['business ' + b, () => { S.biz = { type: b, weeks: 60, value: 10000 }; S.jobId = 'farmhand'; }]);
    for (const k of ['dry', 'wet', 'smoke', 'heat']) BROAD.push([`a ${k} year`, () => { S.wx[k] = true; S.jobId = 'farmhand'; S.home = 'fixer'; }]);
    for (const k of ['hard', 'mild']) BROAD.push([`a ${k} winter`, () => { S.wxW.kind = k; S.jobId = 'farmhand'; S.home = 'fixer'; }]);
    for (const id of ['league']) for (let k = 2; k <= 6; k++) BROAD.push([`${id} step ${k}`, chainRow(id, k)]);
    BROAD.push(['family', () => { S.partner = true; S.kids = [S.ageMonths - 30, S.ageMonths - 100]; S.dog = true; S.home = 'house'; S.jobId = 'farmhand'; S.community = 70; S.happy = 70; }],
      ['single at 25', () => { S.ageMonths = 25 * 12; S.community = 60; }],
      ['retired at 72', () => { S.ageMonths = 72 * 12; S.retired = true; S.jobId = null; S.health = 40; S.home = 'farm'; S.money = 80000; }],
      ['worker in the 50s', () => { S.ageMonths = 52 * 12; S.jobId = 'para'; S.health = 45; S.happy = 40; S.home = 'fixer'; S.partner = true; }],
      ['broke', () => { S.money = -3000; S.happy = 30; S.health = 30; }],
      ['out of work', () => { S.jobId = null; S.ui = 20; S.money = 500; S.happy = 40; }],
      ['student', () => { S.focus = 'study'; S.edu = 1; S.jobId = 'barista'; }]);
    // an ordinary weather year and winter (no dice), so what's reached doesn't depend on the roll; rows set the weather they need
    const start = m => { newGame('Reach', 'life', 0, { diff: 'hard' }); S.noEvents = true;   // Hard: the full game, every event in play
      S.turn = 300; S.date = new Date(2031, m, 8).getTime();
      S.wx = { y: 2031, dry: false, wet: false, smoke: false, heat: false, rain: false }; S.wxW = { y: winterYear(), kind: 'normal' }; };
    const all = [...EVENTS.map(e => ['pick', e]), ...PLAN_DUE.map(e => ['due', e])];
    // pickEvent with only this event in the list (so the dice can't pick another), planDue with only this one due
    const returns = (kind, e, m) => {
      const list = kind === 'pick' ? EVENTS : PLAN_DUE, keep = list.slice(); list.length = 0; list.push(e);
      try { return (kind === 'pick' ? pickEvent(m, evCat(e)) : planDue(m)) === e; } finally { list.length = 0; list.push(...keep); }
    };
    const when = (e, m) => !e.when || e.when(m);
    const rows = {}, wrong = [];
    for (const [kind, e] of all) {
      const row = REACH[e.title]; if (!row) continue;
      start(row[0]); row[1]();
      if (when(e, row[0]) && returns(kind, e, row[0])) rows[e.title] = 'row'; else wrong.push(e.title);
    }
    for (const [name, f] of BROAD) for (let m = 0; m < 12; m++) {
      start(m); f();
      for (const [kind, e] of all) if (!rows[e.title] && !REACH[e.title] && when(e, m) && returns(kind, e, m)) rows[e.title] = `${name}, month ${m + 1}`;
    }
    const unused = Object.keys(REACH).filter(k => !all.some(([, e]) => e.title === k));
    return { n: all.length, reached: Object.keys(rows).length, missing: all.filter(([, e]) => !rows[e.title]).map(([, e]) => e.title), wrong, unused };
  });
  assert(!r.wrong.length, `these REACH rows no longer make their event happen: ${r.wrong.join('; ')}`);
  assert(!r.unused.length, `REACH rows for events that don't exist: ${r.unused.join('; ')}`);
  assert(!r.missing.length && r.reached === r.n, `no setup makes these events happen (add a REACH row): ${r.missing.join('; ')}`);
});

// i56-b23: real saves from every tagged version (tests/fixtures/saves, made by tools/save-fixtures.mjs) load in this
// version, continue, play 52 more weeks and open every tab without errors, NaN or undefined on screen
await t.check('i56-b23: saves from every tagged version load, continue, play 52 weeks and open every tab', async () => {
  const fs = await import('node:fs');
  const files = fs.readdirSync('tests/fixtures/saves').filter(f => f.endsWith('.json')).sort();
  assert(files.length >= 12, `only ${files.length} save fixtures`);
  const bad = [];
  for (const f of files) {
    const fx = JSON.parse(fs.readFileSync('tests/fixtures/saves/' + f, 'utf8'));
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await c.addInitScript(seedScript(2323));
    await c.addInitScript(keys => { if (!sessionStorage.getItem('fx')) { sessionStorage.setItem('fx', '1'); for (const [k, v] of Object.entries(keys)) localStorage.setItem(k, v); } }, fx.storage);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(srv.url, { waitUntil: 'load' });
    const r = await p.evaluate(() => {
      const sl = slots(); if (!sl[0]) return { missing: true };
      loadSlot(0); closeSheet(); const t0 = S.turn, name = S.name; let ending = null;
      for (let w = 0; w < 52 && !ending; w++) { const res = weekTick(false); if (res.ev) { const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch.length) ch[0].go(); } ending = res.ending; }
      save(); return { t0, turn: S.turn, name, ending, money: S.money };
    });
    if (r.missing) { bad.push(`${fx.tag}: no life in slot 1`); await c.close(); continue; }
    const shown = [];
    for (const tb of ['home', 'jobs', 'life', 'log', 'menu']) {
      await p.evaluate(() => closeSheet());
      await p.click(`[data-tab=${tb}]`); await p.waitForTimeout(50);
      const txt = await p.evaluate(() => document.querySelector('#app').innerText + (document.querySelector('#modal:not(.hidden)') ? document.querySelector('#modal').innerText : ''));
      if (/NaN|undefined|\[object/.test(txt)) shown.push(tb);
    }
    if (errs.length) bad.push(`${fx.tag}: ${errs[0]}`);
    if (shown.length) bad.push(`${fx.tag}: NaN or undefined on ${shown.join(', ')}`);
    if (r.t0 !== fx.weeks || r.turn !== r.t0 + 52 || r.ending || !Number.isFinite(r.money) || !/^Saved in/.test(r.name)) bad.push(`${fx.tag}: ${JSON.stringify(r)}`);
    await c.close();
  }
  assert(!bad.length, bad.join('; '));
});

await t.check('wave 1 D2: event text and balance (i22-a09/a10/a13/a14/a16, i71-b01, i66-b01/b02/b07/b15/b16/b17)', async () => {
  const r = await ev(() => {
    const E = t => EVENTS.find(e => e.title === t), open_ = e => e.choices().filter(c => !c.if || c.if()), out = {};
    const num = l => +((l.match(/\$([\d,]+)/) || [])[1] || '0').replace(/,/g, '');
    // i66-b01 + i22-a09: the tip needs a better job open, and shows today's weekly pay
    fresh('two', { jobId: 'farmhand', community: 60 }); const tip = E('A tip from a friend'); out.tipOn = tip.when();
    const tc = tip.choices()[0]; out.tipLabel = tc.label; out.tipWk = tipJobs().map(x => wk(payNow(x, false)));
    out.tipBetter = tipJobs().every(x => payNow(x, false) > payNow(job()));
    S.raise = 100; out.tipOff = tip.when();
    // i22-a10: raises tell the truth at the cap
    fresh('two', { jobId: 'farmhand', jobMonths: 24, raise: 1.27 }); out.raise = E('A raise').choices()[0].go();
    S.raise = RAISE_CAP; const rec = E('A recruiter calls').choices()[1]; out.loyalLabel = rec.label; out.loyal = rec.go();
    fresh('two', { jobId: 'farmhand', raise: 1.29 }); out.loyal2 = E('A recruiter calls').choices()[1].label;
    // i22-a14: the gas spike counts remote days
    fresh('two', { jobId: 'loan', money: 5000 }); const m0 = S.money; E('Gas prices spike').choices()[0].go();
    out.gas = [m0 - S.money, Math.round(commuteCost(commuteOneWay(), CARS[S.car], job()) * 0.25), Math.round(commuteCost(commuteOneWay()) * 0.25)];
    // i22-a16: college help never pushes you past what you have
    const kidAt18 = () => { S.kids = [S.ageMonths - 18 * 12 - 3]; };
    fresh('two', { money: 2000 }); kidAt18(); const col = E('A kid heads off to college'); out.colWhen = col.when();
    out.poor = open_(col).map(c => { S.money = 2000; c.go(); return [c.label, S.money]; });
    fresh('two', { money: 20000 }); kidAt18(); out.rich = open_(col).map(c => c.label);
    fresh('two', { money: -500 }); kidAt18(); out.broke = open_(col).map(c => c.label);
    // i71-b01: chain-event labels show what you're charged
    fresh('two', { home: 'fixer', money: 20000, skills: { handy: 30 } }); S.col = 1.7; out.chain = [];
    for (const [t, i] of [['The porch is sagging', 0], ['The porch is sagging', 1], ['The kitchen is next', 0], ['The kitchen is next', 1], ["A friend's food truck", 0], ['A levee for the town', 1]]) {
      const c = E(t).choices()[i], m = S.money; c.go(); out.chain.push([c.label, num(c.label), Math.round(m - S.money)]); }
    // i66-b02: wine weekends April to October, weight 2
    fresh('two'); S.ageMonths = 30 * 12; const wine = E('Wine country weekend'); out.wine = [wine.w, wine.when(2), wine.when(3), wine.when(9), wine.when(10)];
    // i66-b07: the buddy fix works 60% of the time
    fresh('two', { community: 50, money: 5000 }); const rnd = Math.random; const bud = E('Truck trouble').choices()[2];
    Math.random = () => 0.5; let m = S.money; bud.go(); out.budOk = m - S.money;
    Math.random = () => 0.9; m = S.money; out.budBad = [bud.go(), m - S.money]; Math.random = rnd;
    // i66-b15: the cheap plan pays $240 a year (by the week, i58-b02); better coverage halves the emergency dentist
    fresh('two', { jobId: 'rn', money: 5000 }); const hp = E('Health plan choice').choices(); out.cheap = hp[0].label; m = S.money; hp[0].go(); out.cheapGot = S.money - m;
    const tooth = () => { const c = E('Toothache').choices()[0], m1 = S.money; c.go(); return m1 - S.money; };
    out.toothFull = tooth(); hp[1].go(); out.toothHalf = tooth();
    // i66-b16: a winter Get outside week with a season pass is a ski day
    fresh('two', { focus: 'outdoors', health: 60, happy: 50 }); S.date = new Date(2027, 9, 10).getTime(); S.skiPass = skiSeason(); S.date = new Date(2028, 0, 10).getTime();
    out.skiOn = skiWeek(); weekTick(false); out.skiWhy = S.last.why.some(w => /ski day/.test(w));
    S.focus = 'rest'; out.skiRest = skiWeek(); S.focus = 'outdoors'; S.date = new Date(2028, 5, 10).getTime(); out.skiJune = skiWeek();
    // i66-b17: run down under 45
    fresh('two', { health: 44 }); out.run44 = E('Feeling run down').when(); S.health = 45; out.run45 = E('Feeling run down').when();
    return out; });
  assert(r.tipOn && r.tipBetter && !r.tipOff && /\/wk\)$/.test(r.tipLabel) && r.tipWk.some(w => r.tipLabel.includes(w)), `tip ${JSON.stringify([r.tipOn, r.tipOff, r.tipLabel])}`);
  assert(/A 2\.4% raise/.test(r.raise) && /top of the pay scale/.test(r.raise), `raise at the cap: ${r.raise}`);
  assert(/top of the pay scale/.test(r.loyalLabel) && !/2%/.test(r.loyal) && /\+0\.8% pay/.test(r.loyal2), JSON.stringify([r.loyalLabel, r.loyal, r.loyal2]));
  assert(r.gas[0] === r.gas[1] && r.gas[1] < r.gas[2], `gas spike counts remote days ${r.gas}`);
  assert(r.colWhen && r.poor.length === 2 && r.poor.every(([, m]) => m >= 0) && /books/.test(r.poor[0][0]) && /\$2,000/.test(r.poor[0][0]), `college with $2,000 ${JSON.stringify(r.poor)}`);
  assert(r.rich.some(l => /tuition/.test(l)) && !r.rich.some(l => /books/.test(l)) && r.broke.length === 1, JSON.stringify([r.rich, r.broke]));
  assert(r.chain.every(([, l, paid]) => l > 0 && l === paid), `chain labels match what you pay ${JSON.stringify(r.chain)}`);
  assert(r.wine[0] === 2 && !r.wine[1] && r.wine[2] && r.wine[3] && !r.wine[4], `wine ${r.wine}`);
  assert(near(r.budOk, 120) && /couldn't/.test(r.budBad[0]) && r.budBad[1] > 120, `buddy ${r.budOk} ${JSON.stringify(r.budBad)}`);
  assert(/\$240 a year/.test(r.cheap) && r.cheapGot === 0 && near(r.toothHalf, r.toothFull / 2, 0.02), JSON.stringify([r.cheap, r.cheapGot, r.toothFull, r.toothHalf]));
  assert(r.skiOn && r.skiWhy && !r.skiRest && !r.skiJune, JSON.stringify([r.skiOn, r.skiWhy, r.skiRest, r.skiJune]));
  assert(r.run44 && !r.run45, 'run down under 45');
});

await t.check('i22-a12: a food-truck weekend keeps hustle experience from fading', async () => {
  const r = await ev(() => {
    const run = truck => { fresh('two', { focus: 'hustle', hustleWeeks: 20, hustleLast: 0, turn: 100, money: 50000 }); S.date = new Date(2028, 4, 10).getTime();
      if (truck) S.biz = { type: 'truck', weeks: 0, earned: 0, dep: 1, permitYear: 2028 }; const t0 = S.turn; week(); return { last: S.hustleLast, t0, hw: S.hustleWeeks }; };
    return { truck: run(true), gig: run(false) }; });
  assert(r.truck.last === r.truck.t0 && r.truck.hw === 20, `truck week ${JSON.stringify(r.truck)}`);
  assert(r.gig.last === r.gig.t0 && r.gig.hw === 21, `gig week ${JSON.stringify(r.gig)}`);
});

await t.check('i22-a03: a new job clears leftover unemployment months', async () => {
  const r = await ev(() => { fresh('two', { ui: 4, uiPay: 2000 }); startJob('diner'); const ui = S.ui; S.jobId = null; return { ui, line: week().lines['Unemployment benefits'] }; });
  assert(r.ui === 0 && r.line == null, JSON.stringify(r));
});

await t.check('i22-a04: a wheat lease taken after March skips that year\'s farming bill and harvest; one taken by March gets both', async () => {
  const r = await ev(() => {
    const run = mo => { fresh('two', { money: 50000 }); S.date = new Date(2028, mo, 3).getTime(); startBiz('wheat'); const seen = {};
      while (new Date(S.date).getFullYear() === 2028) { week(); for (const [l] of S.last.lines) seen[l] = 1; } return seen; };
    const late = run(5), early = run(1);
    return { lateFarm: !!late['🌾 Custom farming, seed and fertilizer'], lateHarvest: !!late['🌾 Harvest check'], earlyFarm: !!early['🌾 Custom farming, seed and fertilizer'], earlyHarvest: !!early['🌾 Harvest check'] }; });
  assert(!r.lateFarm && !r.lateHarvest && r.earlyFarm && r.earlyHarvest, JSON.stringify(r));
});

await t.check('i22-a06: a wheat lease sells for what is left of it, so renewing then selling loses money', async () => {
  const r = await ev(() => { fresh('two', { money: 50000 }); S.biz = { type: 'wheat', weeks: 0, earned: 0, dep: 1, lease: LEASE_WEEKS };
    const v0 = bizValue(); S.biz.weeks = LEASE_WEEKS / 2; const half = bizValue(); S.biz.weeks = LEASE_WEEKS; const end = bizValue();
    const m0 = S.money; renewLease(); const paid = m0 - S.money, after = bizValue(); return { v0, half, end, paid, after, full: cost(6000) * 0.6 }; });
  assert(near(r.v0, r.full) && near(r.half, r.full / 2) && r.end === 0, JSON.stringify(r));
  assert(r.paid > 0 && r.after < r.paid, `renew ${r.paid}, sell ${r.after}`);
});

await t.check('i22-a07: a goal you already meet can\'t be newly pinned for free points', async () => {
  const r = await ev(() => { fresh('two', { retired: true }); const met = goalMetNow('retired');
    goalsSheet(); const btn = document.querySelector('[data-goal="retired"]'); const dis = btn.disabled; btn.click(); $('#ok').click();
    const pinned = S.goals.includes('retired'); S.goals = ['retired']; S.goalAt = { retired: S.turn }; const kept = goalMetNow('retired'); return { met, dis, pinned, kept }; });
  assert(r.met && r.dis && !r.pinned && !r.kept, JSON.stringify(r));
});

await t.check('i22-a08: winter tires don\'t carry over to a new vehicle', async () => {
  const r = await ev(() => { fresh('two', { money: 60000, car: 'beater', tires: 'beater', carValue: 2500 }); buyCar('sedan'); $('#y').click(); const t1 = S.tires;
    S.money = 60000; buyCar('beater'); if ($('#y')) $('#y').click(); return { t1, car: S.car, t2: S.tires }; });
  assert(r.t1 === null && (r.car !== 'beater' || r.t2 === null), JSON.stringify(r));
});

await t.check('i22-a15: extra class weeks carry into the next program', async () => {
  const r = await ev(() => { fresh('two', { edu: 0, studyProg: 15 }); classWeeks(4); const a = { edu: S.edu, p: S.studyProg };
    fresh('two', { edu: 2, studyProg: 71 }); classWeeks(4); return { a, b: { edu: S.edu, p: S.studyProg } }; });
  assert(r.a.edu === 1 && r.a.p === 3 && r.b.edu === 3 && r.b.p === 0, JSON.stringify(r));
});

await t.check('i22-a19: the Lifetime header bar and the score\'s on-track target use the same 18-to-65 span', async () => {
  const r = await ev(() => { fresh('life', { ageMonths: Math.round(41.5 * 12) }); tab = 'home'; render();
    return { bar: $('.progress i').style.width, gp: gameProgress(), lp: lifeProgress() }; });
  assert(near(parseFloat(r.bar), 50, 0.01) && near(r.gp, 0.5, 0.01) && r.gp === r.lp, JSON.stringify(r));
});

await t.check('i60-a12: the Home debt card names the limit weekTick uses in each mode; Relaxed has no ending line', async () => {
  const r = await ev(() => {
    const card = (md, money) => { fresh('two', { mode: md, money }); tab = 'home'; render(); const c = $('#debtwarn'); return c ? c.textContent : null; };
    const ends = (md, money) => { fresh('two', { mode: md, money }); return !!weekTick(false).debt; };
    return { hard: card('hard', -12000), normalQuiet: card('normal', -12000), normal: card('normal', -16000), relaxed: card('relaxed', -16000),
      limits: [debtLimit('hard'), debtLimit('normal'), debtLimit('relaxed')], hardEnd: ends('hard', -26000), normalEnd: ends('normal', -26000), relaxedEnd: ends('relaxed', -60000), floor: S.money }; });
  assert(r.hard && r.hard.includes('-$25,000') && !r.normalQuiet && r.normal.includes('-$40,000') && r.relaxed && !/leave town/.test(r.relaxed), JSON.stringify(r));
  assert(r.limits[0] === -25000 && r.limits[1] === -40000 && r.limits[2] === null && r.hardEnd && !r.normalEnd && !r.relaxedEnd && r.floor === -40000, JSON.stringify(r));
});

await t.check('i71-b05: the collections fee and a hospital bill show as money lines, so the lines add up to the change in cash', async () => {
  const r = await ev(() => {
    fresh('two', { money: -100, debtWeeks: 12 }); let m0 = S.money; week(); const fee = S.last.lines.find(l => l[0] === '📞 Collections fee'), d1 = S.money - m0, n1 = S.last.net;
    fresh('two', { jobId: 'farmhand', focus: 'work', health: 0, money: 20000 }); m0 = S.money; week(); const bill = S.last.lines.find(l => l[0] === '🏥 Hospital bill'), d2 = S.money - m0, n2 = S.last.net;
    return { fee: fee && fee[1], d1, n1, bill: bill && bill[1], d2, n2 }; });
  assert(near(r.fee, -150) && near(r.d1, r.n1, 0.0001), JSON.stringify(r));
  assert(r.bill < -6000 && near(r.d2, r.n2, 0.0001), JSON.stringify(r));
});

await t.check('i71-b04: promotion stress counts in weeks with events off', async () => {
  const r = await ev(() => { const run = promo => { fresh('two', { jobId: 'farmhand', focus: 'rest', happy: 60 }); if (promo) S.promo = { job: 'farmhand', n: 2 }; weeks(1); return S.happy; };
    return { base: run(false), promo: run(true) }; });
  assert(near(r.base - r.promo, 0.6 * W, 0.01), JSON.stringify(r));
});

// ---- i19: custom rules and assists ----
await t.check('i19-b01: one rules object: missing or unknown knobs fall back to Normal, and old saves load with Normal rules', async () => {
  const r = await ev(() => {
    const def = { col: rule('col', {}), wage: rule('wage', {}), ev: rule('evMult', {}), debt: rule('debtEnd', {}), add: rule('startAdd', {}), routine: rule('routine', {}) };
    const junk = { col: rule('col', { prices: 'hyper', events: 7 }), clean: cleanRules({ prices: 'hyper', events: 'calm', start: 'std', x: 1 }) };
    const old = blankLife('Old', 'two'); delete old.rules; delete old.tier0; migrate(old);
    const bad = blankLife('Bad', 'two'); bad.rules = { prices: 'nope', events: 'busy' }; bad.tier0 = 'gold'; migrate(bad);
    return { def, junk, old: [old.rules, old.tier0], bad: [bad.rules, bad.tier0] };
  });
  assert(r.def.col === 0.03 && r.def.wage === 0.025 && r.def.ev === 1 && r.def.debt === null && r.def.add === 0 && r.def.routine === false, JSON.stringify(r.def));
  assert(r.junk.col === 0.03 && JSON.stringify(r.junk.clean) === '{"events":"calm"}', JSON.stringify(r.junk));
  assert(JSON.stringify(r.old) === '[{},"standard"]', JSON.stringify(r.old));
  assert(JSON.stringify(r.bad) === '[{"events":"busy"},"custom"]', JSON.stringify(r.bad));
});

await t.check('i19-b01: the knobs reach prices, pay, debt, event odds and starting money', async () => {
  const r = await ev(() => {
    const yr = rules => { newGame('R', 'two', 0, { rules }); S.noEvents = true; weeks(52); return { col: S.col, wage: S.wage }; };
    const odds = rules => { newGame('R', 'two', 0, { rules }); S.jobId = 'farmhand'; return eventOdds(null).town; };
    const money = (rules, bg) => { newGame('R', 'two', 0, { rules, bg }); return S.money; };
    const debt = (rules, mode) => { newGame('R', 'two', 0, { rules, mode }); return debtLimit(); };
    return { usual: yr({}), frozen: yr({ prices: 'frozen' }), fast: yr({ prices: 'fast' }), calm: odds({ events: 'calm' }), busy: odds({ events: 'busy' }), none: odds({ events: 'none' }), normalOdds: odds({}),
      broke: money({ start: 'broke' }), comfy: money({ start: 'comfy' }), comfyFarm: money({ start: 'comfy' }, 'farm'), std: money({}),
      tight: debt({ debt: 'tight' }), deep: debt({ debt: 'deep' }, 'relaxed'), modeLine: debt({}, 'hard') };
  });
  assert(near(r.usual.col, 1.03, 0.002) && near(r.usual.wage, 1.025, 0.002), JSON.stringify(r.usual));
  assert(r.frozen.col === 1 && r.frozen.wage === 1, JSON.stringify(r.frozen));
  assert(near(r.fast.col, 1.07, 0.002) && near(r.fast.wage, 1.055, 0.002), JSON.stringify(r.fast));
  assert(near(r.calm, 0.07) && near(r.busy, 0.21) && r.none === 0 && near(r.normalOdds, 0.14), JSON.stringify(r));
  assert(r.broke === 0 && r.comfy === 6500 && r.comfyFarm === 5300 && r.std === 1500, JSON.stringify(r));
  assert(r.tight === -15000 && r.deep === -80000 && r.modeLine === -25000, JSON.stringify(r));
});

await t.check('i19-b09 (scaled down): a Comfortable start\'s extra $5,000 does not count toward the score', async () => {
  const r = await ev(() => { newGame('R', 'two', 0, {}); const a = scoredReal(); newGame('R', 'two', 0, { rules: { start: 'comfy' } }); return { a, b: scoredReal() }; });
  assert(near(r.a, r.b), JSON.stringify(r));
});

await t.check('i19-b03: recordTier: Normal rules and the routine assist are Standard, changed knobs Custom, no events Sandbox', async () => {
  const r = await ev(() => [recordTier({}), recordTier({ routine: 'on' }), recordTier({ start: 'comfy' }), recordTier({ start: 'broke', events: 'none' }), recordTier({ prices: 'bogus' })]);
  assert(JSON.stringify(r) === '["standard","standard","custom","sandbox","standard"]', JSON.stringify(r));
});

await t.check('i19-b03: the end screen puts Custom lives on their own shelf and never records a sandbox life', async () => {
  const r = await ev(() => {
    const end = rules => { localStorage.clear(); newGame('R', 'half', 0, { rules }); S.noEvents = true; finish('Done.'); closeSheet(); return { best: store.get(BEST_KEY) || {}, note: '' }; };
    const std = end({}), cu = end({ start: 'comfy' });
    const cuNote = (() => { localStorage.clear(); newGame('R', 'half', 0, { rules: { start: 'comfy' } }); S.noEvents = true; finish('Done.'); const n = document.querySelector('#tiernote'); const t = n ? n.textContent : ''; closeSheet(); return t; })();
    const sb = end({ events: 'none' });
    return { std: Object.keys(std.best), cu: Object.keys(cu.best), sb: Object.keys(sb.best), cuNote, label: bestLabel('cu-half') };
  });
  assert(JSON.stringify(r.std) === '["half"]' && JSON.stringify(r.cu) === '["cu-half"]' && r.sb.length === 0, JSON.stringify(r));
  assert(/Custom shelf/.test(r.cuNote) && /Starting money: Comfortable/.test(r.cuNote), r.cuNote);
  assert(/6 Months/.test(r.label) && /Custom rules/.test(r.label), r.label);
});

await t.check('i19-b04/b05: every knob shows its Normal value and a plain dollar preview', async () => {
  const r = await ev(() => ({ std: ruleLabel('start', 'std', { bg: 'fresh' }), comfy: ruleLabel('start', 'comfy', { bg: 'fresh' }), debt: ruleLabel('debt', 'mode', { mode: 'relaxed' }),
    pStart: rulePreview('start', 'std', { bg: 'fresh' }), pBroke: rulePreview('start', 'broke', {}), pPrices: rulePreview('prices', 'fast', {}), pFrozen: rulePreview('prices', 'frozen', {}),
    pEv: [rulePreview('events', 'usual', {}), rulePreview('events', 'calm', {}), rulePreview('events', 'none', {})], pDebt: rulePreview('debt', 'mode', { mode: 'normal' }) }));
  assert(r.std === 'Starting money: $1,500 (Normal)', r.std);
  assert(r.comfy === 'Starting money: $6,500 · Normal is $1,500', r.comfy);
  assert(/never/.test(r.debt) && /\(Normal\)/.test(r.debt), r.debt);
  assert(/about 10 weeks of rent/.test(r.pStart) && /Nothing in the bank/.test(r.pBroke), r.pStart + ' / ' + r.pBroke);
  assert(/\$150 a week now and about \$295 in 10 years/.test(r.pPrices) && /\$150 a week now and about \$150 in 10 years/.test(r.pFrozen), r.pPrices + ' / ' + r.pFrozen);
  assert(/About 11 surprises/.test(r.pEv[0]) && /About 6 surprises/.test(r.pEv[1]) && /Never recorded/.test(r.pEv[2]), r.pEv.join(' / '));
  assert(/about 267 weeks of rent/.test(r.pDebt), r.pDebt);
});

await t.check('i19-b15: with the routine assist, routine events take the careful choice and show as "Taken care of"; off, they still ask', async () => {
  const r = await ev(() => {
    const run = rules => { newGame('R', 'two', 0, { rules }); S.jobId = 'foodplant';
      const ev = EVENTS.find(e => e.title === 'Speeding ticket'); const orig = rollEvent; rollEvent = () => ev;
      const m0 = S.money; S.run = { weeks: 0, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] };
      const res = weekTick(false); rollEvent = orig; return { ev: res.ev && res.ev.title, line: careLine(), log: S.log.map(e => e.m).join(' | ') }; };
    const pick = t => { const c = routinePick(EVENTS.find(e => e.title === t)); return c && c.label; };
    newGame('R', 'two', 0, {});
    return { on: run({ routine: 'on' }), off: run({}), picks: Object.keys(ROUTINE).map(t => [t, !!EVENTS.find(e => e.title === t), pick(t)]) };
  });
  assert(r.on.ev == null && /Taken care of: Speeding ticket \(-\$60\)/.test(r.on.line) && /Speeding ticket: An evening of videos/.test(r.on.log), JSON.stringify(r.on));
  assert(r.off.ev === 'Speeding ticket' && r.off.line === '', JSON.stringify(r.off));
  const miss = r.picks.filter(([, found, label]) => !found || !label);
  assert(!miss.length, `routine events without an event or a default choice: ${JSON.stringify(miss)}`);
});

await t.check('i19-b19: turning an assist off keeps the life on the shelf it started on', async () => {
  const r = await ev(() => { newGame('R', 'two', 0, { rules: { start: 'comfy', routine: 'on' } }); const before = lifeTier();
    S.rules = cleanRules({ ...S.rules, routine: 'off' }); const a = lifeTier();
    S.rules = {}; return { before, a, b: lifeTier(), tier0: S.tier0 }; });
  assert(r.before === 'custom' && r.a === 'custom' && r.b === 'custom' && r.tier0 === 'custom', JSON.stringify(r));
});

await t.check('i19-b28: weekly challenges, scenarios and practice lives ignore custom rules', async () => {
  const r = await ev(() => { const opts = { rules: { start: 'comfy', events: 'none' } };
    newGame('R', 'half', 0, { ...opts, weekly: '2027-W01' }); const wk = [S.rules, S.tier0, S.money];
    newGame('R', SCENARIOS[Object.keys(SCENARIOS)[0]].len, 0, { ...opts, scenario: Object.keys(SCENARIOS)[0] }); const sc = [S.rules, S.tier0];
    newGame('R', 'half', 0, { ...opts, practice: true }); const pr = [S.rules];
    return { wk, sc, pr }; });
  assert(JSON.stringify(r.wk.slice(0, 2)) === '[{},"standard"]' && r.wk[2] < 6000, JSON.stringify(r.wk));
  assert(JSON.stringify(r.sc) === '[{},"standard"]' && JSON.stringify(r.pr) === '[{}]', JSON.stringify(r));
});

// ---- wave 1: Life Score formula and aims ----
await t.check('i5-a02: Life Score so far is right in the first month, with a friendly title until week 4', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); tab = 'home';
    const s0 = lifeScore(); const a = scoreSnap(); week(); const s1 = lifeScore(), b = scoreSnap(); render(); const btn = document.querySelector('#scorenow').textContent;
    weeks(4); render(); const btn4 = document.querySelector('#scorenow').textContent;
    return { s0: s0.score, s1: s1.score, h0: a.avgH, h1: b.avgH, happy: S.happy, btn, btn4, title: lifeScore().title }; });
  assert(Math.abs(r.s0 - r.s1) <= 4, `the score shouldn't crash after one week: ${r.s0} → ${r.s1}`);
  assert(r.h1 > 40 && r.h1 < 80, `average happiness after a week ${r.h1}`);
  assert(/Just getting started/.test(r.btn) && !/Just getting started/.test(r.btn4) && r.btn4.includes(r.title), `${r.btn} / ${r.btn4}`);
});

await t.check('i15-a01: community counts as the life average, so a late spike barely moves it', async () => {
  const r = await ev(() => { fresh('two'); S.monthsPlayed = 20; S.happySum = 1200; S.healthSum = 1350; S.commSum = 600; S.community = 30;
    const a = lifeScore(); S.community = 100; const b = lifeScore(); return { a: a.parts.community, b: b.parts.community, avgC: b.avgC }; });
  assert(r.a === r.b && r.avgC === 30, JSON.stringify(r));
  const t = await ev(() => { fresh('two', { focus: 'rest' }); weeks(2); return { sum: S.commSum, mp: S.monthsPlayed }; });
  assert(t.sum > 0 && near(t.mp, 2 * W), JSON.stringify(t));
});

await t.check('i20-b13: 85% the weighted parts + 15% the weakest; a steady middling life lands where it did', async () => {
  const r = await ev(() => { fresh('two'); S.monthsPlayed = 10; S.commSum = 500; S.money = 45000 - S.carValue; S.equity = 0; S.k401 = 0;
    S.happySum = 600; S.healthSum = 675; const even = lifeScore();
    S.happySum = 900; S.healthSum = 400 + 0.001; const lop = lifeScore(), sn = scoreSnap();
    showScoreNow(); const txt = document.querySelector('#sheet').textContent; closeSheet();
    return { even: even.score, lop: lop.score, weighted: sn.weighted, weakest: sn.weakest, base: sn.base, txt }; });
  assert(r.even === 50, `steady middling life ${r.even}`);
  assert(near(r.base, r.weighted * 0.85 + r.weakest * 0.15, 1e-9) && r.weakest < 0.01 && r.lop < Math.round(r.weighted), JSON.stringify(r).slice(0, 300));
  assert(/Weakest part: Health/.test(r.txt), 'the sheet names the weakest part');
});

await t.check('i20-b14: report cards are kept, and the final score is 60% their average + 40% the ending', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); weeks(26); const sc = lifeScore(), n = S.cardCount, sum = S.cardSum;
    const log = S.log.filter(e => /Report card/.test(e.m)).map(e => e.m); S.over = false; finish('Test.'); const txt = document.querySelector('#sheet').textContent; closeSheet();
    return { n, sum, score: sc.score, cardAvg: sc.cardAvg, snap: scoreSnap().base, raw: sum / n, log, txt }; });
  assert(r.n === 2 && r.log.length === 2 && /this quarter/.test(r.log[0]), JSON.stringify(r.log));
  assert(r.score === Math.round(r.raw * 0.6 + r.snap * 0.4), `blend ${r.score} vs ${r.raw} / ${r.snap}`);
  assert(/Report-card average \d+, ending \d+/.test(r.txt), 'the end sheet shows both');
});

await t.check('i62-a04, i63-a01, i63-a02: debt pulls the wealth part below 0 against $90,000, floored at -33 (-20 Relaxed); student loans count at half', async () => {
  const r = await ev(() => { const at = (len, md, money, extra = {}) => { newGame('D', len, 0, { mode: md }); S.noEvents = true; Object.assign(S, extra); S.money = money - S.carValue; return scoreSnap().wealth; };
    return { two: at('two', 'normal', -25000), five: at('five', 'normal', -25000), floor: at('two', 'normal', -90000), relaxed: at('two', 'relaxed', -90000), plus: at('two', 'normal', 45000),
      grad: (() => { newGame('G', 'two', 0, { bg: 'grad' }); return { real: scoredReal(), nw: netWorth(), sl: S.sloanLeft * S.sloanPay * 0.85 }; })() }; });
  assert(near(r.two, -25000 / 900, 0.001) && near(r.five, r.two, 0.001), `-$25,000: ${r.two} (2y) ${r.five} (5y)`);
  assert(r.floor === -33 && r.relaxed === -20 && near(r.plus, 50, 0.01), JSON.stringify(r));
  assert(near(r.grad.real, r.grad.nw + r.grad.sl / 2, 0.001), JSON.stringify(r.grad));
});

await t.check('i63-a03, i63-a04: weeks below -$1,000 drag the score up to 6 points (3 Relaxed); climbing out cuts it to a third', async () => {
  const r = await ev(() => { fresh('two'); S.turn = 100; S.deepWeeks = 100; S.money = -5000; const deep = debtDrag();
    S.money = 100; S.equity = 50000; const out = debtDrag(); S.mode = 'relaxed'; S.money = -5000; S.equity = 0; const rel = debtDrag();
    fresh('two', { jobId: null, money: -2000 }); weeks(3); const n = S.deepWeeks, low = S.debtLow;
    return { deep, out, rel, n, low, sc: lifeScore().drag }; });
  assert(r.deep === 6 && r.out === 2 && r.rel === 3, JSON.stringify(r));
  assert(r.n === 3 && r.low < -2000, JSON.stringify(r));
});

await t.check('i63-a10: the score sheet shows a red Debt line with what climbing out wins back, only after debt', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand' }); weeks(8); showScoreNow(); const clean = document.querySelector('#sheet').textContent; closeSheet();
    S.money = -30000; S.deepWeeks = 8; showScoreNow(); const debt = document.querySelector('#sheet .kv.debt'); const txt = document.querySelector('#sheet').textContent; closeSheet();
    return { clean, debt: debt && debt.textContent, tip: /Debt is costing you the most/.test(txt), dc: debtCost() }; });
  assert(!/💳 Debt/.test(r.clean), 'no debt line for a careful life');
  assert(r.debt && /Debt is costing you \d+ points?\./.test(r.debt) && /Back to \$0 by the end wins back \d+/.test(r.debt) && r.dc.cost >= r.dc.back && r.dc.back > 0, JSON.stringify(r));
  assert(r.tip, 'the tip talks about debt when it costs the most');
});

await t.check('i63-a20: a life that climbed out says "Came back from $X in debt." on the end sheet and in records', async () => {
  const r = await ev(() => { localStorage.clear(); fresh('two', { jobId: 'farmhand' }); S.debtLow = -11437; S.money = 5000; const line = comebackLine();
    finish('Test.'); const txt = document.querySelector('#sheet').textContent; closeSheet(); challengesSheet(); const rec = document.querySelector('#sheet').textContent; closeSheet();
    fresh('two'); S.debtLow = -11437; S.money = -50; const still = comebackLine(); return { line, txt, rec, still }; });
  assert(r.line === 'Came back from $11,400 in debt.' && r.txt.includes(r.line) && r.rec.includes(r.line) && r.still === '', JSON.stringify(r).slice(0, 300));
});

await t.check('i20-b01: a life aim moves 15 of net worth\'s 30 points to its measure; All-around keeps the old weights', async () => {
  const r = await ev(() => { const at = aim => { newGame('A', 'two', 0, { aim }); S.noEvents = true; const s = scoreSnap(); return { aim: S.aim, w: s.w }; };
    const all = at('all'), roots = at('roots'), bad = at('nope');
    newGame('A', 'two', 0, { aim: 'content' }); S.noEvents = true; S.focus = 'rest'; weeks(10); S.over = false; finish('Test.'); const txt = document.querySelector('#sheet').textContent; closeSheet();
    return { all, roots, bad, txt, keys: Object.keys(AIMS) }; });
  assert(r.all.w.wealth === 30 && r.all.w.aim === 0 && r.roots.aim === 'roots' && r.roots.w.wealth === 15 && r.roots.w.aim === 15 && r.bad.aim === 'all', JSON.stringify(r).slice(0, 300));
  assert(r.keys.join() === 'all,content,roots,adventure,legacy' && /Contentment/.test(r.txt), 'aims and end sheet');
});

await t.check('i20-b05: good weeks count happiness and health 60+ with cash at $0 or more, and the end screen shows them', async () => {
  const r = await ev(() => { fresh('two', { happy: 90, health: 90, money: 5000 }); weeks(3); const g = S.goodWeeks;
    S.money = -500; weeks(2); const g2 = S.goodWeeks; S.money = 5000; S.happy = 30; weeks(1); const g3 = S.goodWeeks;
    finish('Test.'); const txt = document.querySelector('#sheet').textContent; closeSheet(); return { g, g2, g3, txt }; });
  assert(r.g === 3 && r.g2 === 3 && r.g3 === 3, JSON.stringify(r).slice(0, 200));
  assert(/3 of 6 weeks were good ones/.test(r.txt), 'end sheet line');
});

await t.check('i20-b06: the aim changes once a year, counts by the weeks held, and the Life tab says when it can change next', async () => {
  const r = await ev(() => { fresh('two', { aim: 'content' }); S.aimAt = 0; weeks(10); const early = setAim('roots'); tab = 'life'; render(); const card = document.querySelector('#aimcard').textContent;
    weeks(42); const ok = setAim('roots'); weeks(52); const sh = aimShares(); return { early, card, ok, sh, aw: S.aimWeeks }; });
  assert(!r.early && /Next change: \w+ 20\d\d/.test(r.card), r.card);
  assert(r.ok && near(r.sh.content, 0.5, 0.01) && near(r.sh.roots, 0.5, 0.01), JSON.stringify(r));
});

await t.check('wave 1 score: an older save loads with the score tallies filled in', async () => {
  const r = await ev(() => { const old = JSON.parse(JSON.stringify(fresh('two', { turn: 30, monthsPlayed: 30 * W, community: 40 })));
    for (const k of ['commSum', 'cardSum', 'cardCount', 'cardSeed', 'goodWeeks', 'deepWeeks', 'debtLow', 'tallyFrom', 'aim', 'aimWeeks', 'aimAt', 'townWeeks', 'outWeeks', 'tripsN', 'bizWeeks', 'bizSold']) delete old[k];
    const m = migrate(old); S = m; S.noEvents = true; const s0 = lifeScore(); weeks(9); return { aim: m.aim, comm: lifeScore().avgC, seed: S.cardSeed, n: S.cardCount, s0: s0.score, aw: S.aimWeeks, from: S.tallyFrom }; });
  assert(r.aim === 'all' && r.comm > 30 && r.n === 3 && r.seed === false && r.from === 30 && r.aw.all === 39 && Number.isInteger(r.s0), JSON.stringify(r));
});

// ---- wave 1: weekly drift and focus balance ----
await t.check('i59-b02/i35-b05: Get outside tops out like Rest, lower on Hard', async () => {
  const r = await ev(() => { fresh('two', { happy: 84, health: 84 }); const n = focusFx('outdoors', 1, false), lo = (S.happy = 50, S.health = 50, focusFx('outdoors', 1, false));
    S.mode = 'hard'; S.happy = 80; S.health = 80; const h = focusFx('rest', 1, false); return { n, lo, h }; });
  assert(r.n.health < 5 * 0.28 * 0.2 && r.lo.health === 5 * 0.28 && r.h.happy === 0 && r.h.health === 0, JSON.stringify(r));
});
await t.check('i38-a01: the hiring cheer comes once every 26 weeks', async () => {
  const r = await ev(() => { fresh('two', { happy: 50 }); hireCheer(); const a = S.happy; hireCheer(); const b = S.happy; S.turn += 26; hireCheer(); return [a, b, S.happy]; });
  assert(r[0] === 55 && r[1] === 55 && r[2] === 60, JSON.stringify(r));
});
await t.check('i38-a06: town goals take 3 more weeks each', async () => {
  const r = await ev(() => SEASON_GOALS.map(g => g.need));
  assert(JSON.stringify(r) === '[9,8,8,7]', JSON.stringify(r));
});
await t.check('i38-a08/i37-b06/i35-b05: community pulls back harder above 60; a Transplant rests at 10 for a year; Hard rests lower', async () => {
  const r = await ev(() => { const drift = (c, extra) => { fresh('two', { focus: 'study', community: c, edu: 3, ...extra }); S.focus = 'study'; const c0 = S.community; weekTick(false); return S.community - c0; };
    return { hi: drift(80), mid: drift(50), newbie: drift(10, { bgRest: 10, turn: 0 }), later: drift(10, { bgRest: 10, turn: 60 }), hard: (() => { fresh('two', { mode: 'hard' }); return [happyRest(), commRest(), restTop()]; })() }; });
  assert(r.hi < r.mid * 2 - 0.3 && Math.abs(r.newbie) < 0.05 && r.later > 0.1 && JSON.stringify(r.hard) === '[48,20,76]', JSON.stringify(r));
});
await t.check('i48-b02: Relaxed softens the rut to -0.7', async () => {
  const r = await ev(() => { fresh('two'); const n = rutHit(); S.mode = 'relaxed'; return [n, rutHit()]; });
  assert(r[0] === 1.2 && r[1] === 0.7, JSON.stringify(r));
});
await t.check('i30-b03: health tops out lower with age, and the Health card says so', async () => {
  const r = await ev(() => { fresh('two', { health: 70 }); S.ageMonths = 85 * 12; adj({ health: 30 }); const capped = S.health;
    tab = 'home'; render(); const lab = document.querySelector('[data-stat="health"]').getAttribute('aria-label'); return { c40: maxHealth(40), c85: maxHealth(85), capped, lab }; });
  assert(r.c40 === 100 && near(r.c85, 75) && near(r.capped, 75) && /tops out at 75/.test(r.lab), JSON.stringify(r));
});
await t.check('i30-b04: home comforts stop lifting happiness in the high 80s', async () => {
  const r = await ev(() => { fresh('two', { partner: true, dog: true }); S.happy = 60; const lo = comfortF(); S.happy = 90; return [lo, comfortF()]; });
  assert(r[0] > 0.9 && r[1] === 0, JSON.stringify(r));
});
await t.check('i15-a02/i38-a11/i26-b02: visits taper in the 80s, no health at 70+, cheap visits limited', async () => {
  const r = await ev(() => { fresh('two', { money: 5000, health: 60, happy: 50 }); visit('yoga', 'class'); const yLow = [S.health, S.happy];
    S.turn++; S.health = 75; visit('yoga', 'class'); const yHi = S.health;
    S.turn++; S.happy = 90; const h0 = S.happy; visit('pasta', 'dinner'); const taper = S.happy - h0;
    S.turn++; S.community = 30; visit('mcgrub', 'counter'); const m1 = S.community; S.turn += 2; visit('mcgrub', 'counter'); const m2 = S.community;
    S.turn += 13; visit('mcgrub', 'counter'); const m3 = S.community;
    S.turn++; const b0 = S.community; visit('basket', 'shop'); const b1 = S.community; S.turn += 2; visit('basket', 'shop'); const b2 = S.community;
    return { yLow, yHi, taper, m: [m1 - 30, m2 - m1, m3 - m2], b: [b1 - b0, b2 - b1] }; });
  assert(r.yLow[0] > 60 && r.yHi === 75 && r.taper > 0 && r.taper < 6 * 0.28 * 0.5 && r.m[0] > 0 && r.m[1] === 0 && r.m[2] > 0 && r.b[0] > 0 && r.b[1] === 0, JSON.stringify(r));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} rules check(s) failed`); process.exit(1); }
console.log('All rules checks passed');
