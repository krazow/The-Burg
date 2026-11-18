// The Burg: turn.js (part 3 of 8; scripts load in order and share one global scope)
/* ---------- turn processing (one turn = one week) ---------- */
function endTurn(){ playWeeks(1); }

// Plays up to n weeks. Skips (n > 1) stop when something needs the player: an event with a real choice,
// a milestone note, a year in review, or the end of the game.
function playWeeks(n){
  S.run = { weeks: 0, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] };
  let res;
  for (let i = 0; i < n; i++) {
    res = weekTick(n > 1); S.run.weeks++;
    if (res.ending || res.ev || res.notes.length || res.review) break;
  }
  save();
  const after = () => {
    if (res.ending) return finish(res.ending);
    render();
    if (S.newBadges && S.newBadges.length) { toast(S.newBadges.join(' · ')); S.newBadges = []; }
    if (res.ev) showEvent(res.ev);
    else if (res.review) showReview(res.review);
    const r = S.run, dm = S.money - r.money, ch = (n, v) => Math.abs(v) < 0.5 ? `${n} unchanged` : `${n} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}`;
    announce(`${r.weeks > 1 ? r.weeks + ' weeks' : 'Week'} done. Cash ${dm >= 0 ? 'up' : 'down'} ${fmt(Math.abs(dm))}, now ${fmt(S.money)}. ${ch('Happiness', S.happy - r.happy)}, ${ch('health', S.health - r.health)}, ${ch('community', S.community - r.community)}. ${dateLabel()}.`);
  };
  if (res.notes.length) {
    sheet(`<h2>${S.run.weeks > 1 ? S.run.weeks + ' weeks later' : 'This week'}</h2>
      ${res.notes.map(t => `<p><b>${t}</b></p>`).join('')}
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
    <div class="kv"><span><b>Total change in cash</b></span><span><b>${dm>=0?'+':''}${fmt(dm)}</b></span></div>
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
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

function weekTick(auto){
  const L = LENGTHS[S.len], m = W, k = 0.28;
  const f = FOCUS[S.focus] || FOCUS.rest, j = S.retired ? null : job();
  const lines = [], notes = [];

  // ---- money (constants are monthly; m converts to one week) ----
  let gross = 0;
  if (S.retired) {
    gross = ssPay()*m; lines.push(['Social Security', gross]);
    if (S.k401 > 0) { const w = Math.min(S.k401, S.k401 * 0.04 * m / 12); S.k401 -= w; gross += w; lines.push(['401(k) withdrawal', w]); }
  }
  else if (j) { gross = payNow(j) * m * (f.payMult||1); lines.push([`Paycheck${f.payMult?' + overtime':''}`, gross]); }
  let k401 = 0;
  if (j && !S.retired && S.k401rate) {           // pre-tax contribution, with a 3% employer match at 5% or more
    k401 = gross * K401[S.k401rate]; lines.push(['401(k) contribution', -k401]);
    S.k401 += k401 + gross * 0.03;
  }
  if (gross) lines.push(['Taxes', -(gross - k401) * (S.retired ? 0.05 : 0.15)]);
  if (!S.retired && !j && S.ui > 0) { const n = Math.min(m, S.ui); lines.push(['Unemployment benefits', 1100*S.wage*n]); S.ui -= n; }
  let gig = null;
  const truckTime = S.biz && S.biz.type === 'truck' && [3,4,5,6,7,8,9].includes(curMonth());
  if (f.hustle && !truckTime) { gig = currentGig(); const xp = 1 + Math.min(0.6, (S.hustleWeeks || 0) / 40); lines.push([`Side hustle: ${gig.name}`, cost(gig.pay * (0.85 + Math.random() * 0.3)) * xp * m]); S.hustleWeeks = (S.hustleWeeks || 0) + 1; }
  const home = HOMES[S.home], car = CARS[S.car];
  lines.push([home.own ? 'Mortgage' : 'Rent', -(home.own && S.mortgage ? S.mortgage : cost(home.cost))*m]);
  bizWeek(lines, notes);
  const trip = tripWeek(lines);                    // this week's trip around the region, if one is planned
  const stocked = S.turn < S.stockUntil;
  lines.push([stocked ? 'Food & utilities (stocked up)' : 'Food & utilities', -cost(520 - (stocked ? GROCERY_SHARE * STOCK_OFF : 0))*(1 - skillLv('cook') * 0.04)*m]);
  lines.push(['Insurance & phone', -cost(160)*m]);
  { const y = new Date(S.date).getFullYear(); if (curMonth() === 0 && S.tabsYear !== y) { lines.push(['Vehicle tabs (DMV)', -cost(95)]); S.tabsYear = y; } }
  const miles = (commuteOneWay()*2*WORKDAYS*commuteGasFactor() + ERRAND_MILES) * m;
  lines.push([commuteOneWay() ? 'Gas (commute + errands)' : 'Gas (errands)', -miles*cost(GAS)/car.mpg]);
  if (S.loanLeft > 0) {
    const n = Math.min(m, S.loanLeft); lines.push(['Truck payment', -(S.loanPay || CARS.truck.pay)*n]); S.loanLeft -= n;
    if (S.loanLeft < 1e-6) { S.loanLeft = 0; notes.push('🛻 The truck is paid off!'); S.paidOff = true; log('Made the last truck payment.'); }
  }
  if (S.sloanLeft > 0) {
    const n = Math.min(m, S.sloanLeft); lines.push(['Student loan', -S.sloanPay*n]); S.sloanLeft -= n;
    if (S.sloanLeft < 1e-6) { S.sloanLeft = 0; notes.push('🎓 Your student loans are paid off!'); S.paidOff = true; log('Paid off the student loans.'); }
  }
  if (mode() === 'hard') lines.push(['Higher living costs (Hard)', -cost(68)*m]);
  if (S.dog) lines.push(['Dog food & vet', -cost(45)*m]);
  if (S.partner) { lines.push(['Date nights', -cost(120)*m]); if (age() < 65) lines.push(["Partner's paycheck (part-time)", 1400*S.wage*m]); }
  const kidsHome = kidsAtHome();
  if (kidsHome) lines.push([kidsHome > 1 ? `Kids (${kidsHome})` : 'Kid', -cost(650)*kidsHome*m]);
  const a0 = age();
  if (a0 >= 50) lines.push(['Health care', -cost(a0 >= 65 ? 420 : 180)*m]);
  if (f.cost) lines.push([f.name, -cost(f.cost)*m]);
  if (f.study && S.edu < 3) {
    lines.push(['Tuition', -cost(TUITION[S.edu])*m]);
    S.studyProg += 1;
    if (S.studyProg >= STUDY_NEED[S.edu]) { S.studyProg = 0; S.edu++; notes.push(`🎓 You earned your ${EDU[S.edu]}! New jobs unlocked.`); log(`Graduated with a ${EDU[S.edu]}.`); adj({happy:8}); }
  }
  if (S.money < 0) lines.push(['Interest on debt', S.money * (mode() === 'relaxed' ? 0.01 : 0.015) * m]);
  const net = lines.reduce((a,[,v]) => a + v, 0);
  S.money += net;
  S.last = { lines: lines.filter(([,v]) => Math.round(v)), net };
  if (home.own) S.equity = S.equity * Math.pow(1.025, 1/52) + home.equityPer * m;   // principal paid + 2.5%/yr appreciation
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
  dh += home.happy * 0.4 + (S.partner ? 0.6 : 0) + (S.dog ? 0.4 : 0) + kidsHome * 0.3 - (S.money < 0 ? 2 : 0);
  dc += kidsHome * 0.2;
  if (S.council) dc += 0.8;
  // worn down: pushing through low health with overtime or side hustles makes it worse, fast
  if (S.health < 35 && (S.focus === 'work' || S.focus === 'hustle')) dH -= 3.2;
  if (mode() === 'relaxed') { if (dh < 0) dh *= 0.6; if (dH < 0) dH *= 0.6; if (dc < 0) dc *= 0.6; }
  if (mode() === 'hard') { if (dh < 0) dh *= 1.25; if (dH < 0) dH *= 1.25; if (dc < 0) dc *= 1.25; }
    S.happy = clamp(S.happy + dh*m); S.health = clamp(S.health + dH*m); S.community = clamp(S.community + dc*m);
  // doing the same thing week after week loses its punch (classes excepted), and a long rut wears on you
  if (S.streakF === S.focus) S.streakN++; else { S.streakF = S.focus; S.streakN = 1; }
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
  let ev = !S.noEvents && chance(mode() === 'hard' ? 0.33 : 0.28) ? pickEvent(curMonth()) : null;
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
        if (S.run) S.run.happened.push({ ic: ev.ic, title: ev.title, money: S.money - m0 });
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
  if (!ending && mode() !== 'relaxed' && S.money < debtEnd) ending = `Buried in debt, ${S.name} packed up and left Waitsburg.`;
  if (mode() === 'relaxed' && S.money < -40000) S.money = -40000;   // Relaxed: a debt counselor stops the slide
  return { ev, notes, ending, review };
}

function deltaChips(before){
  const d = [['Happiness', S.happy-before.happy], ['Health', S.health-before.health], ['Community', S.community-before.community]];
  return d.map(([l,v]) => Math.abs(v) < 0.5 ? '' : `<span class="delta ${v>0?'up':'down'}">${l} ${v>0?'+':''}${Math.round(v)}</span>`).join('');
}
