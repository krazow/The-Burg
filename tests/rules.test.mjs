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

await t.check('a weekly paycheck is the monthly pay × 12/52, taxed 15%', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'rest' }); return week().lines; });
  assert(near(r['Paycheck'], 2500 * W), `paycheck ${r['Paycheck']}`);
  assert(near(r['Taxes'], -2500 * W * 0.15), `taxes ${r['Taxes']}`);
  assert(near(r['Rent'], -550 * W) && near(r['Food & utilities'], -520 * W) && near(r['Insurance & phone'], -160 * W), 'bills are off');
});

await t.check('Work extra hours pays 20% more', async () => {
  const r = await ev(() => { fresh('two', { jobId: 'farmhand', focus: 'work' }); return week().lines; });
  assert(near(r['Paycheck + overtime'], 2500 * W * 1.2), `overtime paycheck ${r['Paycheck + overtime']}`);
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
  assert(r.gz === 'BURG1:' && r.short, `code ${r.gz}, compressed well: ${r.short}`);
  assert(r.a === r.b && r.b === r.c && r.a.startsWith('Rules/two/30/12345|Second/life/9'), `${r.a} / ${r.b} / ${r.c}`);
  assert(r.best === 66, 'best scores missing');
});

await t.check('restoring adds to empty slots or replaces all, keeps the best scores, and rejects junk', async () => {
  const r = await ev(async () => {
    localStorage.clear(); newGame('A', 'two', 0); save(); newGame('B', 'two', 1); save(); store.set(BEST_KEY, { two: 50, five: 70 });
    const bk = await readBackup(JSON.stringify(backupData()));
    store.set(SLOTS_KEY, [null, null, null, null, null]); newGame('Here', 'half', 0); save(); store.set(BEST_KEY, { two: 60 });
    const skippedAdd = restoreBackup(bk, 'add'); const added = slots().map(g => g && g.name);
    const best = store.get(BEST_KEY);
    restoreBackup(bk, 'replace'); const replaced = slots().map(g => g && g.name);
    const errs = [];
    for (const junk of ['hello', '{"app":"other","slots":[]}', '{"app":"theburg","slots":[{"name":5}]}', 'BURG1:@@@']) { try { await readBackup(junk); errs.push('accepted ' + junk); } catch (e) { errs.push(e.message ? 'ok' : 'no message'); } }
    // full slots: nothing fits
    for (let i = 0; i < 5; i++) { newGame('F' + i, 'half', i); save(); }
    const skippedFull = restoreBackup(bk, 'add');
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
    const err = planTrip('wallawalla', ['movies', 'bistro']); const l = week().lines; return { err, l, trip: S.trip, log: S.log[0].m }; });
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

await t.check('a stock-up grocery run makes groceries 15% cheaper for 4 weeks', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 5, 7).getTime() }); planTrip('kennewick', ['stock']);
    const out = [week().lines]; for (let i = 0; i < 4; i++) out.push(week().lines); return out.map(l => l['Food & utilities (stocked up)'] ?? l['Food & utilities']); });
  const cheap = -(520 - 360 * 0.15) * W;
  assert(r.slice(0, 4).every(v => near(v, cheap, 0.02)), `stocked weeks ${r}`);
  assert(r[4] < cheap * 1.05, `week 5 should be back to full price: ${r[4]}`);
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
  assert(r.n < -95 && r.n > -110, `tabs ${r.n}`);
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
    return { full: g({ jobId: 'rail' }), remote: g({ jobId: 'loan' }), pool: g({ jobId: 'rail', carpool: true }),
      can: (fresh('two', { jobId: 'rail', community: 25 }), canCarpool()), can2: (S.community = 35, canCarpool()), near: (fresh('two', { jobId: 'cellar', community: 50 }), canCarpool()) };
  });
  assert(near(r.full, -(58 * 2 * 21 + 300) * W * 3.89 / 15), `full ${r.full}`);
  assert(near(r.remote, -(62 * 2 * 21 * 0.6 + 300) * W * 3.89 / 15), `remote ${r.remote}`);
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
  assert(r.grad.age === 21 && r.grad.edu === 2 && r.grad.sloan === 120 && near(r.grad.loanLine, -380 * W), `grad ${JSON.stringify(r.grad)}`);
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
    newGame('M', 'two', 0, { mode: 'hard' }); S.noEvents = true; const hCost = week().lines['Higher living costs (Hard)'];
    newGame('M', 'two', 0, { mode: 'hard' }); S.jobId = 'diner'; S.jobMonths = 12; const lay = EVENTS.find(e => e.title === 'Layoffs').w();
    newGame('M', 'two', 0); S.jobId = 'diner'; S.jobMonths = 12; const layN = EVENTS.find(e => e.title === 'Layoffs').w();
    return { relaxed, normal, rEnd, rMoney, hEnd, hCost, lay, layN };
  });
  assert(r.relaxed > r.normal + 1, `relaxed ${r.relaxed} vs normal ${r.normal}`);
  assert(!r.rEnd && r.rMoney >= -40000, `relaxed debt ${r.rEnd} ${r.rMoney}`);
  assert(/debt/.test(r.hEnd || '') && near(r.hCost, -68 * W) && near(r.lay, r.layN * 1.6), JSON.stringify(r));
});

await t.check('best scores are kept per mode', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('A', 'half', 0, { mode: 'hard' }); S.noEvents = true; weeks(26); finish('done'); closeSheet();
    const b = store.get(BEST_KEY); return { keys: Object.keys(b), label: bestLabel('half-hard') }; });
  assert(r.keys.includes('half-hard') && !r.keys.includes('half') && r.label === '6 Months (Hard)', JSON.stringify(r));
});

await t.check('a season goal counts weeks of the right focus and pays out once', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 2, 1).getTime(), focus: 'community', community: 30 }); tab = 'home'; render();
    const line = document.querySelector('.sgoal').textContent; let note = null, c5 = 0;
    for (let i = 0; i < 6; i++) { const res = week(); if (i === 4) c5 = S.community; if (res.notes.some(n => /Town goal done/.test(n))) note = i; }
    const done = { ...S.sgoal }, wins = S.seasonWins; weeks(2);
    fresh('two', { date: new Date(2027, 2, 1).getTime(), focus: 'rest' }); weeks(4);
    return { line, note, done, wins, after: S.seasonWins, restProg: S.sgoal.prog };
  });
  assert(/Celebration Days/.test(r.line) && /0\/6/.test(r.line), r.line);
  assert(r.note === 5 && r.done.done && r.wins === 1, JSON.stringify(r));
  assert(r.restProg === 0, 'Rest should not count toward the spring goal');
});

await t.check('a winter goal spans December to February as one season', async () => {
  const r = await ev(() => { fresh('two', { date: new Date(2027, 11, 20).getTime(), focus: 'outdoors' }); weeks(3); const a = S.sgoal.id; const p = S.sgoal.prog; weeks(1); return { a, b: S.sgoal.id, p, p2: S.sgoal.prog }; });
  assert(r.a === r.b && r.a === 'winter-2027' && r.p2 >= r.p, JSON.stringify(r));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} rules check(s) failed`); process.exit(1); }
console.log('All rules checks passed');
