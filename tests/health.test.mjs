// Health, body and aging (round 74, i74-a01 to a14): rules and screens. Run with: npm run test:health
import { serve, launch, runner, seedScript, assert, near } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 800 } });
await ctx.addInitScript(seedScript(7474));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(srv.url, { waitUntil: 'load' });
await page.evaluate(() => {
  window.fresh = (len = 'two', extra = {}) => { newGame('Body', len, 0); S.noEvents = true; Object.assign(S, extra); return S; };
  window.week = () => { const r = weekTick(false); return { ...r, lines: Object.fromEntries(S.last.lines) }; };
  window.weeks = n => { let r; for (let i = 0; i < n; i++) r = weekTick(false); return r; };
  window.E = t => EVENTS.find(e => e.title === t) || PLAN_DUE.find(e => e.title === t);
  window.open_ = e => e.choices().filter(c => !c.if || c.if());
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();
const W = 12 / 52;

await t.check('i74-a01: every job wears on a body part, and Hurt on the job names it and its fix', async () => {
  const r = await ev(() => { const none = JOBS.filter(j => !BODY[j.body]).map(j => j.id);
    fresh('two', { jobId: 'onion' }); const onion = { text: E('Hurt on the job').text(), labels: open_(E('Hurt on the job')).map(c => c.label) };
    fresh('two', { jobId: 'airport' }); const air = E('Hurt on the job').text();
    fresh('two', { jobId: 'farmhand' }); const m = S.money; open_(E('Hurt on the job'))[2].go();
    return { none, onion, air, paid: m - S.money, inj: S.injury, insure: jobById('insure').body }; });
  assert(!r.none.length, `jobs without a body part: ${r.none}`);
  assert(/wrists/.test(r.onion.text) && r.onion.labels.some(l => /wrist brace/.test(l)), JSON.stringify(r.onion));
  assert(/ears/.test(r.air), r.air);
  assert(near(r.paid, 120) && r.inj && r.inj.part === 'back' && r.inj.ask, `same doctor cost, injury noted ${JSON.stringify(r)}`);
  assert(r.insure === 'eyes', 'desk jobs wear on the eyes');
});

await t.check('i74-a07: therapy clears the injury over six weeks for copays; toughing it out drains health until therapy', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand', money: 3000 }); S.injury = { part: 'back', ask: true, at: S.turn };
    const due = E('Physical therapy, or tough it out?').when(); open_(E('Physical therapy, or tough it out?'))[0].go();
    const w1 = week().lines['Physical therapy (2 visits)']; weeks(5); const done = S.injury;
    fresh('two', { jobId: 'farmhand', health: 70 }); S.injury = { part: 'back', ask: true, at: S.turn }; open_(E('Physical therapy, or tough it out?'))[1].go();
    const linger = !!S.injury.linger; week(); const why = S.last.why.some(w => /never fully healed/.test(w)); const h1 = S.health;
    fresh('two', { jobId: 'farmhand', health: 70 }); week(); const h0 = S.health;
    const ptStop = stopBlocked(stopById('pt'));
    S.injury = { part: 'back', linger: true }; const ok = stopBlocked(stopById('pt')); planTrip('wallawalla', ['pt']); week(); const started = S.injury && S.injury.pt != null;
    return { due, w1, done, linger, why, h0, h1, ptStop, ok, started };
  });
  assert(r.due && r.w1 < -80 * W * 0 - 70 && r.done === null, `therapy ${JSON.stringify(r)}`);
  assert(r.linger && r.why && r.h1 < r.h0, `lingering ${JSON.stringify(r)}`);
  assert(r.ptStop && r.ok === '' && r.started, `therapy stop ${JSON.stringify(r)}`);
});

await t.check('i74-a02: sick hours build one a paid week up to 40, show on the Life tab and cover flu days', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'farmhand' }); weeks(10); const ten = S.sickHrs; weeks(40); const cap = S.sickHrs;
    const flu = open_(E('Flu going around')); const m = S.money; flu[0].go(); const after = { hrs: S.sickHrs, paid: m - S.money, label: flu[0].label };
    const run = open_(E('Feeling run down')).map(c => c.label);
    tab = 'life'; render(); const card = document.querySelector('#healthcard').textContent;
    fresh('two'); weeks(5); const idle = S.sickHrs;
    return { ten, cap, after, run, card, idle };
  });
  assert(r.ten === 10 && r.cap === 40, `bank ${r.ten}, ${r.cap}`);
  assert(r.after.hrs === 32 && Math.abs(r.after.paid) < 0.01 && /sick hours/.test(r.after.label), JSON.stringify(r.after));
  assert(/doctor/i.test(r.run[0]) && r.run.some(l => /sick days/.test(l)), r.run.join(' | '));
  assert(/Sick hours\s*32 of 40/.test(r.card), r.card);
  assert(r.idle === 0, 'no job, no sick hours');
});

await t.check('i74-a03: a personal day shows when happiness is low, at most once every 13 weeks, and is worth less than a Rest week', async () => {
  const r = await ev(() => {
    fresh('two', { jobId: 'retail', happy: 40 }); const e = E('A personal day'); const a = e.when();
    S.sickHrs = 8; const h = S.happy, m = S.money; open_(e)[0].go(); const gain = S.happy - h, paid = m - S.money, hrs = S.sickHrs;
    const b = e.when(); S.turn += 13; const c = e.when(); S.happy = 60; const d = e.when();
    return { a, b, c, d, gain, paid, hrs, rest: FOCUS.rest.fx.happy * FOCUS_K + FOCUS.rest.fx.health * FOCUS_K };
  });
  assert(r.a && !r.b && r.c && !r.d, JSON.stringify(r));
  assert(r.hrs === 0 && Math.abs(r.paid) < 0.01 && r.gain > 0 && r.gain < r.rest, JSON.stringify(r));
});

await t.check('i74-a04 + a08: dental and the ambulance district are on the insurance sheet; the hospital adds a ride bill without it', async () => {
  const r = await ev(() => {
    fresh('two', { money: 20000, focus: 'study' }); const base = insMonthly();
    S.health = -50; const m = S.money; week(); const noAmb = m - S.money;
    fresh('two', { money: 20000, focus: 'study' }); S.ins.amb = true; S.health = -50; const m2 = S.money; const res = week(); const amb = m2 - S.money;
    S.ins.dental = true; const withAll = insMonthly();
    S.dentist = -99; const tooth = open_(E('A cracked tooth')); const m3 = S.money; tooth[0].go(); const crown = m3 - S.money;
    S.ins.dental = false; const m4 = S.money; open_(E('A cracked tooth'))[0].go(); const crownNo = m4 - S.money;
    S.ins.dental = true; const free = stopCost(stopById('dentist'));
    return { base, noAmb, amb, withAll, crown, crownNo, free, note: res.notes.join(' ') };
  });
  assert(near(r.base, 220), `defaults unchanged ($220 at Washington prices, i75-b26) ${r.base}`);
  assert(r.noAmb - r.amb > 1150 && r.noAmb - r.amb < 1250, `ride bill ${r.noAmb} vs ${r.amb}`);
  assert(/ambulance/.test(r.note), r.note);
  assert(near(r.withAll, 220 + 28 + 5), `with dental and ambulance ${r.withAll}`);
  assert(near(r.crown, 400) && near(r.crownNo, 1400) && r.free === 0, JSON.stringify(r));
});

await t.check('i74-a04/a08 screen: the insurance sheet toggles dental and the ambulance membership', async () => {
  await ev(() => { fresh('two'); S.noEvents = true; tab = 'life'; render(); document.querySelector('#inssheet').click(); });
  await page.click('[data-ins="dental"][data-v="true"]');
  await page.click('[data-ins="amb"][data-v="true"]');
  const r = await ev(() => ({ ins: S.ins, txt: document.querySelector('#sheet').textContent, pressed: document.querySelector('[data-ins="amb"][data-v="true"]').getAttribute('aria-pressed') }));
  assert(r.ins.dental === true && r.ins.amb === true && r.pressed === 'true', JSON.stringify(r.ins));
  assert(/Dental/.test(r.txt) && /Ambulance district membership/.test(r.txt), 'lines on the sheet');
  await ev(() => closeSheet());
});

await t.check('i74-a05: from 75 the county medical van takes appointment trips for $5 and the whole day', async () => {
  const r = await ev(() => {
    fresh('life', { money: 5000, ageMonths: 76 * 12, health: 60 }); const ok = vanOK();
    planTrip('wallawalla', ['checkup'], true); const v = S.trip.van; const res = week();
    const lines = res.lines; planTrip('wallawalla', ['checkup', 'movies'], true); const mixed = !!S.trip.van; S.trip = null;
    fresh('life', { ageMonths: 50 * 12 }); const young = vanOK();
    return { ok, v, van: lines['County medical van'], gas: lines['Trip to Walla Walla: gas'], mixed, young, fx: focusFx('rest', 1, VAN_TIME).happy < focusFx('rest', 1, true).happy };
  });
  assert(r.ok && r.v && near(r.van, -5) && r.gas === undefined, JSON.stringify(r));
  assert(!r.mixed && !r.young && r.fx, JSON.stringify(r));
});

await t.check('i74-a05 screen: the van toggle shows on the Walla Walla trip sheet at 75', async () => {
  await ev(() => { fresh('life', { money: 5000, ageMonths: 76 * 12 }); render(); tripSheet('wallawalla'); });
  await page.click('[data-stop="checkup"]');
  await page.click('#van');
  await page.click('#go');
  const r = await ev(() => S.trip);
  assert(r && r.van === true, JSON.stringify(r));
});

await t.check('i74-a06: desk jobs wear a little after 40 until you walk at lunch', async () => {
  const r = await ev(() => {
    const run = (habit, a) => { fresh('two', { jobId: 'insure', health: 70, ageMonths: a * 12 }); S.deskHabit = habit; week(); return S.health; };
    const e = E('Stiff after a long day at the desk'); fresh('two', { jobId: 'insure', ageMonths: 45 * 12 }); const when = e.when(); open_(e)[0].go();
    return { y: run(false, 30), y2: run(true, 30), o: run(false, 45), o2: run(true, 45), when, after: e.when(), habit: S.deskHabit };
  });
  assert(near(r.y, r.y2, 0.0001) && r.o < r.o2 && near(r.o2 - r.o, 0.2 * W, 0.05), JSON.stringify(r));
  assert(r.when && r.habit && !r.after, JSON.stringify(r));
});

await t.check('i74-a09: Get outside reads by age; skiing Bluewood wants a fair health score', async () => {
  const r = await ev(() => { fresh('life'); const young = FOCUS.outdoors.desc; S.ageMonths = 55 * 12; const mid = FOCUS.outdoors.desc; S.ageMonths = 80 * 12; const old = FOCUS.outdoors.desc;
    S.health = 20; const low = open_(E('Powder day at Bluewood')).map(c => c.label); S.health = 70; const ok = open_(E('Powder day at Bluewood')).map(c => c.label);
    return { young, mid, old, low, ok }; });
  assert(/Blues/.test(r.young) && /Creek/.test(r.mid) && /bench/.test(r.old), JSON.stringify(r));
  assert(!r.low.some(l => /Hit the slopes/.test(l)) && r.low.some(l => /view/.test(l)) && /Hit the slopes/.test(r.ok[0]), JSON.stringify(r));
});

await t.check('i74-a10: the senior center shows from 65 with a capped chair class', async () => {
  const r = await ev(() => {
    fresh('life', { money: 500, ageMonths: 40 * 12 }); render(); outSheet(); const before = !!document.querySelector('[data-place="senior"]'); closeSheet();
    S.ageMonths = 66 * 12; outSheet(); const after = !!document.querySelector('[data-place="senior"]'); closeSheet();
    const h = S.health, c = S.community; const res = visit('senior', 'chair');
    return { before, after, res: res.msg, dh: S.health - h, dc: S.community - c };
  });
  assert(!r.before && r.after && /Chair exercise/.test(r.res), JSON.stringify(r));
  assert(r.dh > 0 && r.dh <= 3 && r.dc > 0, JSON.stringify(r));
});

await t.check('i74-a11: shots at 50 and 65 at the pharmacy make a flu week milder', async () => {
  const r = await ev(() => {
    fresh('life', { money: 3000, ageMonths: 45 * 12 }); const young = stopBlocked(stopById('shots'));
    S.ageMonths = 51 * 12; const due = stopBlocked(stopById('shots')); planTrip('dayton', ['shots']); week(); const shots = { ...S.shots };
    const done = stopBlocked(stopById('shots')); S.ageMonths = 66 * 12; const due65 = stopBlocked(stopById('shots'));
    fresh('two', { jobId: 'farmhand', health: 60 }); open_(E('Flu going around')).at(-1).go(); const sick = 60 - S.health;
    fresh('two', { jobId: 'farmhand', health: 60 }); S.shots = { shingles: 1 }; open_(E('Flu going around')).at(-1).go(); const mild = 60 - S.health;
    return { young, due, shots, done, due65, sick, mild };
  });
  assert(r.young === 'From age 50' && r.due === '' && r.shots.shingles != null && r.done === 'Up to date' && r.due65 === '', JSON.stringify(r));
  assert(r.mild < r.sick, JSON.stringify(r));
});

await t.check('i74-a12/a13/a14: Dad\'s appointments, a respite weekend and paid family leave', async () => {
  const r = await ev(() => {
    const dad = E('Who drives Dad to Walla Walla?');
    fresh('life', { ageMonths: 52 * 12, jobId: 'rn', money: 20000 }); const due = dad.when(); const labels = open_(dad).map(c => c.label);
    // take every drive yourself: it drains, and a respite weekend gives part of it back, never more
    open_(dad)[2].go(); const h0 = S.happy; week(); const drained = S.parent.drain.happy > 0 && S.happy < h0 + 5;
    const blockedEarly = stopBlocked(stopById('respite'));
    weeks(10); const dr = { ...S.parent.drain }; planTrip('wallawalla', ['respite']); const hb = S.happy; week(); const back = S.parent.drain;
    // paid family leave: 90% of pay, capped, no job wear, and a follow-up when it ends
    fresh('life', { ageMonths: 52 * 12, jobId: 'rn' }); open_(dad).find(c => /family leave/.test(c.label)).go();
    const leave = week().lines; const pay = leave['Paid family leave (90% of pay)'], check = leave['Paycheck'];
    S.turn = S.parent.leaveEnd; const end = E('Family leave is ending').when(); const endLabels = open_(E('Family leave is ending')).map(c => c.label);
    open_(E('Family leave is ending'))[1].go(); const back2 = week().lines;
    // the care need ends
    S.turn = S.parent.until; const res = week(); const done = S.parent.done;
    fresh('life', { ageMonths: 52 * 12 }); const noJob = open_(dad).some(c => /leave/.test(c.label));
    fresh('two', { ageMonths: 52 * 12 }); const notLife = dad.when();
    return { due, labels, drained, blockedEarly, dr, back, pay, check, end, endLabels, paid: back2['Paycheck'], driver: back2['A driver and helper for Dad'], done, note: res.notes.join(' '), noJob, notLife,
      expect: Math.min(payNow(jobById('rn')) * 0.9, 6500 * S.wage) * W };
  });
  assert(r.due && r.labels.length === 4 && r.drained, JSON.stringify(r));
  assert(r.blockedEarly === '' || /Nothing/.test(r.blockedEarly), r.blockedEarly);
  assert(r.back.happy < r.dr.happy && r.back.happy >= 0, `respite gives back what was drained ${JSON.stringify([r.dr, r.back])}`);
  assert(r.pay > 0 && r.check === undefined && r.pay < 7300 * W * 0.91, `leave pay ${r.pay}`);
  assert(r.end && !r.endLabels.some(l => /leave/.test(l)) && r.paid > 0 && r.driver < 0, JSON.stringify(r));
  assert(r.done && /Dad/.test(r.note), r.note);
  assert(!r.noJob && !r.notLife, 'leave needs a job; the chain is for Lifetime games');
});

await t.check('old saves load with health defaults (no sick hours, no dental or ambulance plan)', async () => {
  const r = await ev(() => { const s = migrate({ name: 'Old', len: 'two', turn: 40, jobId: 'farmhand', ins: { auto: 'full', renters: true, ded: 1000 }, date: new Date(2027, 9, 1).getTime() });
    S = s; S.noEvents = true; weeks(2); tab = 'life'; render(); return { hrs: s.sickHrs, dental: s.ins.dental, amb: s.ins.amb, shots: s.shots, parent: s.parent, card: !!document.querySelector('#healthcard') }; });
  assert(r.hrs === 2 && r.dental === false && r.amb === false && r.shots && r.parent === null && r.card, JSON.stringify(r));
});

await t.check('the Help guide explains the body over a life', async () => {
  const r = await ev(() => { showHelp(); const s = document.querySelector('#g-body'); return s ? s.textContent : ''; });
  assert(/Sick hours/.test(r) && /paid family leave/.test(r) && /Ambulance district/.test(r), r.slice(0, 200));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} health check(s) failed`); process.exit(1); }
console.log('All health checks passed');
