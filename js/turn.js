// The Burg: turn.js (part 3 of 8; scripts load in order and share one global scope)
/* ---------- turn processing (one turn = one week) ---------- */
function endTurn(){ playWeeks(1); }

let ROLL = null;              // i2-a28: weeks rolling by on screen (null when not)
let PLAY_AT = -1e9;           // when the last End Week or skip finished, so a double tap plays one week
const ROLL_MS = 260, LOW_STOP = 35, AUTO_MAX = 26;
// i2-a11: what ⏭ Auto plays until, besides anything that needs you (an event with a choice, a milestone, New Year)
const AUTO_UNTIL = {
  event:  { name:'Something needs me', short:'' },
  low:    { name:`A stat drops below ${LOW_STOP} (happiness, health or community)`, short:'a stat drops',
            test: st => { const s = [['happy','Happiness'],['health','Health'],['community','Community']].find(([k]) => S[k] < LOW_STOP && st[k] >= LOW_STOP);
              return s ? `${s[1]} dropped to ${Math.round(S[s[0]])}.` : null; } },
  broke:  { name:'Cash drops below $0', short:'cash runs out', test: st => S.money < 0 && st.money >= 0 ? `Cash dropped below $0 (${fmt(S.money)}).` : null },
  season: { name:'The season changes', short:'the season turns', test: st => SEASON(curMonth()) !== st.season ? `${SEASON(curMonth())} is here.` : null }
};
const autoUntil = () => AUTO_UNTIL[prefs().autoUntil] ? prefs().autoUntil : 'event';
// i2-a28: "watch" shows each week go by; Instant is the default, and reduced motion always plays instantly
const reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const watchWeeks = () => prefs().speed === 'watch' && !reducedMotion();
// the End Week and skip buttons come through here: a second tap of a double tap (or a held-down Enter) is ignored
function tapPlay(n, e){
  if (ROLL || !S || S.over || (e && e.detail > 1) || performance.now() - PLAY_AT < 350) return;
  if (n === 'auto') autoPlay(); else playWeeks(n);
}
function autoPlay(){ const k = autoUntil(); playWeeks(AUTO_MAX, AUTO_UNTIL[k].test || null); }
function stopRoll(){ if (!ROLL) return; clearTimeout(ROLL.t); const fin = ROLL.fin; ROLL = null; fin(); }

// Plays up to n weeks. Skips (n > 1) stop when something needs the player: an event with a real choice,
// a milestone note, a year in review, the end of the game, or the player's own Auto stop (i2-a11).
// One-choice events don't stop a skip: they resolve in place and show up in the week strip's details (i2-a13).
function playWeeks(n, stop = null){
  if (ROLL) return;
  S.run = { weeks: 0, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] };
  const st = { money: S.money, happy: S.happy, health: S.health, community: S.community, season: SEASON(curMonth()) };
  let res, why = null;
  const step = () => {
    res = weekTick(n > 1); S.run.weeks++;
    if (res.ending || res.ev || res.notes.length || res.review) return true;
    if (stop && (why = stop(st))) return true;
    return S.run.weeks >= n;
  };
  if (n > 1 && watchWeeks()) {
    const life = S;
    ROLL = { n, fin: () => finishRun(res, why) };
    const tick = () => {
      if (!ROLL || S !== life) { ROLL = null; return; }
      if (step()) { ROLL = null; return finishRun(res, why); }
      save(); render(); ROLL.t = setTimeout(tick, ROLL_MS);
    };
    return tick();
  }
  while (!step());
  finishRun(res, why);
}
function finishRun(res, why){
  PLAY_AT = performance.now();
  save();
  const notes = why ? [...res.notes, `⏸ Auto stopped: ${why}`] : res.notes;
  const after = () => {
    if (res.ending) return res.debt && canBankrupt() ? bankruptcySheet(res.ending) : finish(res.ending);   // i3-a27
    render();
    if (S.newBadges && S.newBadges.length) { toast(S.newBadges.join(' · ')); S.newBadges = []; }
    if (res.ev) showEvent(res.ev, res.review);     // a year in review that week comes after the event
    else if (res.review) showReview(res.review);
    const r = S.run, dm = S.money - r.money, ch = (n, v) => Math.abs(v) < 0.5 ? `${n} unchanged` : `${n} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}`;
    const own = r.happened.filter(h => h.auto).length;
    announce(`${r.weeks > 1 ? r.weeks + ' weeks' : 'Week'} done. Cash ${dm >= 0 ? 'up' : 'down'} ${fmt(Math.abs(dm))}, now ${fmt(S.money)}. ${ch('Happiness', S.happy - r.happy)}, ${ch('health', S.health - r.health)}, ${ch('community', S.community - r.community)}. ${own ? `${own} event${own > 1 ? 's' : ''} with no choice to make played out: see the week strip. ` : ''}${dateLabel()}.`);
  };
  if (notes.length) {
    sheet(`<h2>${S.run.weeks > 1 ? S.run.weeks + ' weeks later' : 'This week'}</h2>
      ${notes.map(t => `<p><b>${t}</b></p>`).join('')}
      <p>${runChips()}</p>
      <button class="btn primary" id="ok">Continue</button>`);
    $('#ok').onclick = () => { closeSheet(); after(); };
  } else after();
}
// what the last End Week / skip did, counting events resolved since
function runChips(){
  if (!S.run) return '';
  const r = S.run, dm = S.money - r.money;
  const d = [['😊', S.happy - r.happy], ['❤️', S.health - r.health], ['🤝', S.community - r.community]];
  return `<span class="delta ${dm>=0?'up':'down'}">${dm>=0?'+':''}${fmt(dm)}</span>` +
    d.map(([ic,v]) => `<span class="delta ${Math.abs(v) < 0.5 ? 'flat' : v>0?'up':'down'}">${ic} ${Math.abs(v) < 0.5 ? '±0' : (v>0?'▲':'▼') + Math.abs(Math.round(v))}</span>`).join('');
}
function showRunDetails(){
  const r = S.run; if (!r) return;
  const dm = S.money - r.money;
  sheet(`<h2>${r.weeks > 1 ? `The last ${r.weeks} weeks` : 'This week'}</h2>
    <p>${runChips()}</p>
    ${S.last ? `<h3 style="margin-top:12px">${r.weeks > 1 ? 'The last week' : 'Money'}</h3>${S.last.lines.map(([l,v]) => `<div class="kv"><span>${l}</span><span style="color:${v<0?'var(--barn)':'var(--sage)'}">${v>0?'+':''}${fmt(v)}</span></div>`).join('')}
      <div class="kv"><span><b>Paychecks and bills</b></span><span><b>${S.last.net>=0?'+':''}${fmt(S.last.net)}</b></span></div>` : ''}
    ${r.happened.length ? `<h3 style="margin-top:12px">What happened</h3>${r.happened.map(h => `<div class="kv"><span>${h.ic} ${esc(h.title)}</span><span style="color:${h.money<0?'var(--barn)':'var(--sage)'}">${h.money ? (h.money>0?'+':'') + fmt(h.money) : ''}</span></div>`).join('')}` : ''}
    <div class="kv"><span><b>Total change in cash</b></span><span><b>${dm>=0?'+':''}${fmt(dm)}</b></span></div>${tattlerLine()}
    ${S.practice ? '' : '<button class="btn ghost" id="outlook">📅 Money outlook: next 13 weeks</button>'}
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
  if ($('#outlook')) $('#outlook').onclick = () => outlookSheet(showRunDetails);
}
function showReview(rv){
  const row = (l, a, b, money) => { const d = b - a; return `<div class="kv"><span>${l}</span><span>${money ? fmt(b) : Math.round(b)} <span class="delta ${Math.abs(d) < (money?1:0.5) ? 'flat' : d>0?'up':'down'}">${Math.abs(d) < (money?1:0.5) ? '±0' : (d>0?'▲':'▼') + (money ? fmt(Math.abs(d)) : Math.round(Math.abs(d)))}</span></span></div>`; };
  sheet(`<div class="big">📅</div><h2 style="text-align:center">${rv.year} in review</h2>
    <p class="muted" style="text-align:center">${esc(S.name)} is ${age()} now.</p>
    ${row('Net worth', rv.start.nw, rv.end.nw, true)}${row('Happiness', rv.start.happy, rv.end.happy)}${row('Health', rv.start.health, rv.end.health)}${row('Community', rv.start.community, rv.end.community)}
    ${rv.milestones.length ? `<h3 style="margin-top:12px">Milestones</h3>${rv.milestones.map(m => `<div class="logitem">${esc(m)}</div>`).join('')}` : '<p class="muted">A quiet year.</p>'}
    <p class="muted">${rv.events} event${rv.events===1?'':'s'} this year.</p>
    <button class="btn primary" id="ok">On to ${rv.year + 1}</button>`);
  $('#ok').onclick = () => { closeSheet(); render(); };
}

// i3-a28: the bills that come every week, the same in weekTick and the 13-week money outlook (off = weeks from now)
function billLines(off = 0){
  const m = W, home = HOMES[S.home], car = CARS[S.car], out = [], c = v => cost(v) * Math.pow(1 + COL_RATE, off / 52);
  const rentV = -(home.own && S.mortgage ? S.mortgage : c(home.cost))*m;
  out.push([home.own ? 'Mortgage' : 'Rent', rentV]);
  const stocked = S.turn + off < S.stockUntil;
  const foodV = -c(520 - (stocked ? GROCERY_SHARE * STOCK_OFF : 0))*(1 - skillLv('cook') * 0.04)*m, insV = -c(insMonthly())*m;   // i3-a19: what you picked on the insurance sheet ($160 by default)
  out.push([stocked ? 'Food & utilities (stocked up)' : 'Food & utilities', foodV]);
  out.push(['Insurance & phone', insV]);
  if (mode() === 'hard') out.push(['Higher living costs (Hard, +10%)', (rentV + foodV + insV) * HARD_LIVING]);   // R15: 10% of rent, food and insurance
  const miles = (commuteOneWay()*2*WORKDAYS*commuteGasFactor() + ERRAND_MILES) * m;
  out.push([commuteOneWay() ? 'Gas (commute + errands)' : 'Gas (errands)', -miles*c(GAS)/car.mpg]);
  if (S.dog) out.push(['Dog food & vet', -c(45)*m]);
  if (S.partner) out.push(['Date nights', -c(120)*m]);
  const kidsHome = kidsAtHome();
  if (kidsHome) out.push([kidsHome > 1 ? `Kids (${kidsHome})` : 'Kid', -kidCost()*kidsHome*m]);
  const a0 = Math.floor((S.ageMonths + off * m) / 12);
  if (a0 >= 50) out.push(['Health care', -c(a0 >= 65 ? 420 : 180)*m]);
  if (S.ltc && S.ltc.ins && !S.care) out.push(['Long-term care insurance', -c(LTC_PREMIUM)*m]);
  if (S.care && careMonthly() > 0) out.push([CARE[S.care].bill, -c(careMonthly())*m]);
  return out;
}
// i3-a24/a25: a week of work adds to your Social Security record and, in a public job, your pension
function workYear(j, m){
  const real = payNow(j) / S.col;                  // this job's pay in 2027 dollars
  S.earnYears = (S.earnYears || 0) + m / 12; S.earnSum = (S.earnSum || 0) + real * m / 12;
  if (j.pension) {
    const was = pensionVested();
    S.pensionYears = (S.pensionYears || 0) + m / 12; S.pensionPay = Math.max(S.pensionPay || 0, real);
    if (!was && pensionVested()) log(`Vested in the public pension after ${PENSION_VEST} years: it pays when you retire.`, 'mile');
  }
}

function weekTick(auto){
  const L = LENGTHS[S.len], m = W, k = 0.28;
  const f = FOCUS[S.focus] || FOCUS.rest, j = S.retired ? null : job();
  const lines = [], notes = [];
  LIFE_UNDO = [];                                  // i2-a25: a played week can't be undone
  if (syncCarpool()) log('Your carpool ended with the job change: you drive alone now.');

  // ---- money (constants are monthly; m converts to one week) ----
  let gross = 0;
  if (S.retired) {
    gross = ssPay()*m; lines.push(['Social Security', gross]);
    if (pensionVested()) { const p = pensionPay()*m; gross += p; lines.push(['Pension', p]); }
    if (S.k401 > 0) { const w = Math.min(S.k401, S.k401 * 0.04 * m / 12); S.k401 -= w; gross += w; lines.push(['401(k) withdrawal', w]); }
  }
  else if (j) { gross = payNow(j) * m * (f.payMult||1); lines.push([`Paycheck${f.payMult?' + overtime':''}`, gross]); }
  if (j) workYear(j, m);                           // i3-a24/a25: years worked count toward Social Security and a public pension
  let k401 = 0;
  if (j && !S.retired && S.k401rate) {           // pre-tax contribution, with a 3% employer match at 5% or more
    k401 = gross * K401[S.k401rate]; lines.push(['401(k) contribution', -k401]);
    S.k401 += k401 + gross * 0.03;
  }
  if (gross) lines.push(['Taxes', -(gross - k401) * (S.retired ? 0.05 : 0.15)]);
  if (!S.retired && !j && S.ui > 0) { const n = Math.min(m, S.ui); lines.push(['Unemployment benefits', 1100*S.wage*n]); S.ui -= n; }
  let gig = null;
  const truckTime = S.biz && S.biz.type === 'truck' && [3,4,5,6,7,8,9].includes(curMonth());
  if (f.hustle && !truckTime) { gig = currentGig(); const xp = 1 + Math.min(0.6, (S.hustleWeeks || 0) / 40); lines.push([`Side hustle: ${gig.name}`, cost(gig.pay * (0.85 + Math.random() * 0.3)) * xp * outAdBoost() * m]); S.hustleWeeks = (S.hustleWeeks || 0) + 1; S.hustleLast = S.turn; }
  else if (S.hustleWeeks > 0 && S.turn - (S.hustleLast ?? S.turn) > HUSTLE_FADE_AFTER) S.hustleWeeks = Math.max(0, S.hustleWeeks - HUSTLE_FADE);   // B9: rusty after 6 months off
  const home = HOMES[S.home];
  bizWeek(lines, notes);
  moneyWeek(lines, notes);                         // round 3: property tax, home equity loan, index funds, wine futures
  const trip = tripWeek(lines);                    // this week's trip around the region, if one is planned
  lines.push(...billLines());                      // i3-a28: the regular bills, shared with the money outlook
  { const y = new Date(S.date).getFullYear(); if (curMonth() === 0 && S.tabsYear !== y) { lines.push(['Vehicle tabs (DMV)', -vehicleTabs()]); S.tabsYear = y; } }
  if (S.loanLeft > 0) {
    const n = Math.min(m, S.loanLeft); lines.push(['Truck payment', -(S.loanPay || CARS.truck.pay)*n]); S.loanLeft -= n;
    if (S.loanLeft < 1e-6) { S.loanLeft = 0; notes.push('🛻 The truck is paid off!'); S.paidOff = true; log('Made the last truck payment.'); }
  }
  if (S.sloanLeft > 0) {
    const n = Math.min(m, S.sloanLeft); lines.push(['Student loan', -S.sloanPay*n]); S.sloanLeft -= n;
    if (S.sloanLeft < 1e-6) { S.sloanLeft = 0; notes.push('🎓 Your student loans are paid off!'); S.paidOff = true; log('Paid off the student loans.'); }
  }
  if (S.partner && age() < 65) lines.push(["Partner's paycheck (part-time)", 1400*S.wage*m]);
  const kidsHome = kidsAtHome();
  if (f.cost) lines.push([f.name, -cost(f.cost)*m]);
  planWeek(lines, notes);                          // i3-a30/a31/a33/a34: winters south, late-life care, probate and spare-room guests
  if (f.study && S.edu < 3) {
    lines.push(['Tuition', -cost(TUITION[S.edu])*m]);
    S.studyProg += trip && trip.away ? TRIP_TIME : 1;     // R11: a trip week is 3/4 of a week of classes
    if (S.studyProg >= STUDY_NEED[S.edu]) { S.studyProg = 0; S.edu++; notes.push(`🎓 You earned your ${EDU[S.edu]}! New jobs unlocked.`); log(`Graduated with a ${EDU[S.edu]}.`); adj({happy:8}); }
  }
  if (S.money < 0) lines.push(['Interest on debt', S.money * (mode() === 'relaxed' ? 0.01 : 0.015) * m]);
  const net = lines.reduce((a,[,v]) => a + v, 0);
  S.money += net;
  S.last = { lines: lines.filter(([,v]) => Math.round(v)), net };
  debtWeek(notes);                                 // i3-a26: long debt goes to collections
  // i3-a21: the valley's home prices move with this year's market (2.5% a year on average); owners gain principal + appreciation
  S.homeIdx = (S.homeIdx || 1) * Math.pow(1 + (S.homeGrow ?? 0.025), 1/52);
  if (home.own) S.equity = S.equity * Math.pow(1 + (S.homeGrow ?? 0.025), 1/52) + home.equityPer * m;
  S.carValue = Math.max(500, S.carValue * Math.pow(0.99, m));
  S.k401 *= Math.pow(1.06, 1/52);
  S.col *= Math.pow(1 + COL_RATE, 1/52); S.wage *= Math.pow(1 + WAGE_RATE, 1/52);

  // ---- stats drift for the week ----
  const a = age();
  let dh = -0.5 + (52 - S.happy) * 0.06;
  let dH = ((a < 30 ? 85 : a < 50 ? 78 : a < 65 ? 68 : a < 80 ? 55 : 42) - S.health) * 0.025;
  let dc = (25 - S.community) * 0.05 * (S.community > 25 ? 1 - skillLv('people') * 0.15 : 1);   // people skill: community fades slower
  if (S.retired) dh += 1;
  else if (j) { dh -= j.stress; dH -= j.wear; dc += j.city==='waitsburg' ? 0.6 : j.city==='dayton' ? 0.2 : 0; }
  else dh -= 2;
  dh -= commuteOneWay() / 40 * driveDays() * (carpooling() ? 0.6 : 1);
  if (carpooling()) dc += 0.3;                    // riding with neighbors keeps you in the loop
  dh += home.happy * 0.4 + (S.partner ? 0.6 : 0) + (S.dog ? 0.4 : 0) + kidsHome * kidJoy() - (S.money < 0 ? 2 : 0);
  dc += kidsHome * 0.2;
  if (S.council) dc += 0.8;
  if (awaySouth()) { dh = Math.max(dh, 0.5); dH = Math.max(dH, 0.3); dc -= 1.2; }   // i3-a30: sun holds you up, but town forgets you a little
  if (S.care && CARE[S.care]) { const cr = CARE[S.care]; dh += cr.happy; dH += cr.health; dc += cr.comm; }   // i3-a31
  // worn down: pushing through low health with overtime or side hustles makes it worse, fast
  if (S.health < 35 && (S.focus === 'work' || S.focus === 'hustle')) dH -= 3.2;
  if (mode() === 'relaxed') { if (dh < 0) dh *= 0.6; if (dH < 0) dH *= 0.6; if (dc < 0) dc *= 0.6; }
  if (mode() === 'hard') { if (dh < 0) dh *= 1.25; if (dH < 0) dH *= 1.25; if (dc < 0) dc *= 1.25; }
    S.happy = clamp(S.happy + dh*m); S.health = clamp(S.health + dH*m); S.community = clamp(S.community + dc*m);
  // doing the same thing week after week loses its punch (classes excepted), and a long rut wears on you
  if (S.streakF === S.focus) S.streakN++; else { S.streakF = S.focus; S.streakN = 1; }
  S.recentF = [S.focus, ...(S.recentF || [])].slice(0, 4);
  const eff = focusEffect();
  adj(Object.fromEntries(Object.entries(f.fx).map(([st,v]) => {
    let d = v * k * (v > 0 ? eff * (trip && trip.away ? TRIP_TIME : 1) : 1);
    if (S.focus === 'rest' && v > 0) d *= clamp((86 - S[st]) / 20, 0, 1);   // rest tops out in the low 80s
    return [st, d];
  })));
  if (S.focus !== 'study' && S.streakN > RUT_WEEKS) {
    adj({happy: -1.2});
    if (S.streakN === RUT_WEEKS + 1) notes.push(`🔁 ${S.streakN - 1} weeks of "${f.name}" in a row. You're in a rut: try a different focus.`);
  }
  if (trip) adj(trip.fx);
  seasonWeek(notes);
  if (gig && gig.fx) adj(Object.fromEntries(Object.entries(gig.fx).map(([st, v]) => [st, v * k])));
  skillWeek(notes, gig);

  // ---- maybe an event this week ----
  const dice = eventDice();         // R8: events roll their own dice, so a weekly challenge brings everyone the same events
  let ev = S.noEvents || awaySouth() ? null : rollEvent(curMonth(), trip);   // i3-a30: nothing happens in town while you're in Arizona   // town, road and work events, paced by category
  dice.done();
  { const due = S.noEvents ? null : takeDue(); if (due) ev = due; }   // a harvest choice or a market drop comes first
  if (ev) {
    S.evCd[ev.title] = S.turn + (ev.yr ? 40 : 8);
    { const pl = eventPlace(ev); S.evPins = [{ t: ev.title, ic: ev.ic, m: pl[0], k: pl[1], turn: S.turn + 1, r: '' }, ...(S.evPins || [])].slice(0, 12); }
    if (ev.once) S.evDone[ev.title] = 1;
    S.evLabel = dateLabel();
    S.yearEvents = (S.yearEvents || 0) + 1;
    if (auto) {                      // while skipping ahead, one-choice events resolve on their own
      const ch = ev.choices().filter(c => !c.if || c.if());
      if (ch.length === 1) {
        const m0 = S.money, r = ch[0].go();
        if (r) log(`${ev.title}: ${r}`);
        if (S.run) S.run.happened.push({ ic: ev.ic, title: ev.title, money: S.money - m0, auto: 1 });
        if (S.evPins && S.evPins[0] && S.evPins[0].t === ev.title) S.evPins[0].r = r || '';
        ev = null;
      }
    }
  }

  // ---- advance one week ----
  S.happySum += S.happy * m; S.healthSum += S.health * m; S.monthsPlayed += m;
  const oldAge = age(), oldYear = new Date(S.date).getFullYear();
  S.date += 7 * 864e5; S.ageMonths += m; S.turn++; S.jobMonths += m; S.applied = false;
  if (age() > oldAge && age() % 10 === 0) notes.push(`🎂 Happy ${age()}th birthday!`);
  if (S.turn % 13 === 0 && !S.practice) {          // a quarterly report card in the Journal (doesn't stop skips)
    const sc = lifeScore().score, d = S.scoreQ == null ? null : sc - S.scoreQ;
    log(`📋 Report card: Life Score ${sc}${d == null ? '' : ` (${d >= 0 ? '+' : ''}${d} since the last one)`}.`);
    S.scoreQ = sc;
  }
  if (S.focus === 'work' && !job()) S.focus = 'rest';
  if (S.plan && S.plan.length) { S.planI = ((S.planI || 0) + 1) % S.plan.length; S.focus = planFocus(); }   // i2-a12: next week's turn in the rotation
  let review = null;
  const newYear = new Date(S.date).getFullYear();
  if (newYear > oldYear) {
    const snap = { nw: netWorth(), happy: S.happy, health: S.health, community: S.community };
    if (S.yearStart && LENGTHS[S.len].turns > 26) review = { year: oldYear, start: S.yearStart, end: snap, events: S.yearEvents || 0,
      milestones: S.log.filter(e => e.d.endsWith(String(oldYear)) && !e.m.includes(': ')).map(e => e.m).reverse().slice(0, 8) };
    S.yearStart = snap; S.yearEvents = 0;
  }

  badgeWeek(notes); scenarioWeek(notes);
  // ---- health crises & endings ----
  let ending = null;
  if (S.health <= 0) {
    if (L.turns === Infinity && age() >= 50) ending = `${S.name}'s health finally gave out at age ${age()}.`;
    else { const bill = Math.round(cost(6500)); S.money -= bill; S.health = 30; adj({happy:-10}); notes.push(`🏥 You ended up in the hospital. The bill was ${fmt(bill)}.`); log('Spent a week in the hospital in Walla Walla.'); }
  }
  if (!ending && L.turns === Infinity && age() >= 60) {
    const p = Math.pow((age()-60)/35, 3) * 0.22 * (1.6 - S.health/100) * (W/3);
    if (chance(p) || age() >= 102) ending = `${S.name} passed peacefully at age ${age()}, with the whole town at the service.`;
  }
  if (!ending && S.turn >= L.turns) ending = `${L.label} in the Burg is in the books.`;
  const debtEnd = mode() === 'hard' ? -25000 : -40000;
  let debt = false;
  if (!ending && mode() !== 'relaxed' && S.money < debtEnd) { ending = `Buried in debt, ${S.name} packed up and left Waitsburg.`; debt = true; }
  if (mode() === 'relaxed' && S.money < -40000) S.money = -40000;   // Relaxed: a debt counselor stops the slide
  return { ev, notes, ending, review, debt };
}

function deltaChips(before){
  const d = [['Happiness', S.happy-before.happy], ['Health', S.health-before.health], ['Community', S.community-before.community]];
  return d.map(([l,v]) => Math.abs(v) < 0.5 ? '' : `<span class="delta ${v>0?'up':'down'}">${l} ${v>0?'+':''}${Math.round(v)}</span>`).join('');
}
