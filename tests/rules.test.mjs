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
  assert(near(r.food, -520 * W * 0.88), `cook level 3 food ${r.food}`);
  assert(r.labels.some(l => /yourself/.test(l)), 'mechanic level 2 should offer fixing it yourself');
  assert(r.handy >= 9, `yard-work hustles should build handy: ${r.handy}`);
});

await t.check('a business costs money up front, earns, counts in net worth, and sells for 60%', async () => {
  const r = await ev(() => { fresh('two', { money: 10000, skills: { handy: 48 } }); render(); const nw0 = netWorth(); startBiz('shop'); const nw1 = netWorth();
    let earned = 0; for (let i = 0; i < 20; i++) { const l = week().lines; earned += l['🪚 Woodworking shop'] || 0; }
    const m = S.money; sellBiz(); const got = S.money - m;
    fresh('two', { money: 10000, date: new Date(2027, 6, 5).getTime() }); render(); startBiz('wheat'); let check = 0, n = 0;
    for (let i = 0; i < 6; i++) { const l = week().lines; if (l['🌾 Harvest check']) { check = l['🌾 Harvest check']; n++; } }
    return { lost: nw0 - nw1, earned, got, biz: S.biz && S.biz.type, check, n }; });
  assert(near(r.lost, 2500 * 0.4, 0.02), `starting should only lose 40% of the cost in net worth: ${r.lost}`);
  assert(r.earned > 20 * 180 * W * 1.5 && near(r.got, 1500, 0.03), `shop earned ${r.earned}, sold for ${r.got}`);
  assert(r.n === 1 && r.check > 1500, `wheat lease paid ${r.n} times, ${r.check}`);
});

await t.check('the weekly challenge plays the same for everyone, even across saves', async () => {
  const r = await ev(() => { const run = () => { localStorage.clear(); newGame('W', 'half', 0, { weekly: '2026-W47' }); S.jobId = 'farmhand';
      const out = []; for (let i = 0; i < 26; i++) { const res = weekTick(false); if (res.ev) { res.ev.choices()[0].go(); out.push(res.ev.title); } } return out.join('|') + '#' + Math.round(S.money); };
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

await t.check('legacy: a Lifetime game with kids continues as the grown kid', async () => {
  const r = await ev(() => { localStorage.clear(); newGame('Pat Doe', 'life', 0); S.noEvents = true; S.kids = [300]; S.money = 400000; S.community = 70;
    S.date = new Date(2080, 3, 1).getTime(); S.col = 2; finish('done'); const btn = !!document.querySelector('#legacy'); document.querySelector('#legacy').click();
    return { btn, name: S.name, gen: S.gen, money: S.money, community: S.community, age: age(), year: new Date(S.date).getFullYear(), col: S.col }; });
  assert(r.btn && r.name === 'Pat Jr.' && r.gen === 2 && r.age === 18, JSON.stringify(r));
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
    const ws = EVENTS.find(x => x.title === 'Windstorm'); S.home = 'fixer'; const m2 = S.money; ws.choices()[0].go(); const roof = m2 - S.money;
    return { label: ch.label, doc, roof }; });
  assert(near(r.doc, 700) && /\$700/.test(r.label), `doctor ${r.doc} "${r.label}"`);
  assert(near(r.roof, 2400), `roof ${r.roof}`);
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
    const young = { pasta: shownActs(placeById('pasta')).map(a => a.id), brick: visit('brick', 'night').err, gather: shownActs(placeById('gather')).length, grill: visit('lad', 'grill').err || 'ok' };
    S.ageMonths = 21 * 12; const old = { pasta: shownActs(placeById('pasta')).map(a => a.id), brick: visit('brick', 'night').err || 'ok' };
    return { young, old }; });
  assert(r.young.pasta.join() === 'dinner' && r.young.brick === '21 and over' && r.young.gather === 0 && r.young.grill === 'ok', JSON.stringify(r.young));
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
  assert(r.jamEven && !r.jamOdd, 'the jam comes every other week');
  assert(r.fest && !r.festYoung, 'Grenache Fest is 21 and over');
  assert(/Burg Clinic/.test(r.run[0]) && /doctor/.test(r.run[1]) && r.run[2][1] === 'mainst', JSON.stringify(r.run));
  assert(/Mother Hubbard/.test(r.inh[0]) && r.inh[1][1] === 'mainst', JSON.stringify(r.inh));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} rules check(s) failed`); process.exit(1); }
console.log('All rules checks passed');
