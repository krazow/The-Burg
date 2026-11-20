// The Burg: features.js (part 5 of 8; scripts load in order and share one global scope)
/* ============================================================
   🚗 AROUND THE REGION (#57–#63): trips to Dayton, Walla Walla and the Tri-Cities
   Plan one trip a week (from Home or by tapping a town on the region map): a town and up to 3 stops.
   It happens when you end the week: gas there and back, each stop's cost and its effect.
   The town you commute to costs no extra gas or time: you run the errands on the way home.
   Other trips take part of your week, so your focus works at 75% that week.
   Places are described, not named (no real business names).
   ============================================================ */
const TRIP_MAX = 3, TRIP_FX = 0.28, TRIP_TIME = 0.75, STOCK_WEEKS = 6, STOCK_OFF = 0.2, GROCERY_SHARE = 400, REPEAT_WEEKS = 4;
// i42-a03: the same stop again and again does less each time: 100%, 50%, 30%, then 15%; 8 weeks away and it's new again
const STOP_DECAY = [1, 0.5, 0.3, 0.15], STOP_RESET = 8;
// i42-a02: in your work town, eat and do stops are an evening after a shift: 60% of their effect
const AFTER_WORK = 0.6, AFTER_WORK_KINDS = ['eat', 'do'];
// i58-b03: road-weary: each trip in the last 4 weeks cuts the next trip's happiness and health by a quarter
const WEARY_WEEKS = 4, WEARY_CUT = 0.25;
const inSeason = (...ms) => () => ms.includes(curMonth());
const STOP_KINDS = { errand:'🛒 Errands', car:'🛻 Car care', eat:'🍽️ Eat out', do:'🎟️ Things to do', appt:'🩺 Appointments' };
const STOPS = [
  { id:'stock', kind:'errand', ic:'🛒', name:'Stock-up grocery run', towns:['wallawalla','kennewick','pasco','richland'], cost:0,
    note:`Big-store prices: groceries cost ${STOCK_OFF*100}% less for the next ${STOCK_WEEKS} weeks.` },
  { id:'oil', feat:'car.upkeep', kind:'car', ic:'🔧', name:'Oil change and tune-up', towns:['dayton','wallawalla','kennewick','pasco'], cost:90,
    note:'Fewer breakdowns for 6 months. After a year without one, breakdowns get more likely.' },
  { id:'tires', kind:'car', ic:'❄️', name:'Winter tires', towns:['wallawalla','kennewick','pasco'], cost:480, when:inSeason(9,10,11,0), season:'October–January',
    ok:() => S.tires !== S.car, note:'Much less likely to slide off Highway 12 in the snow. Good for as long as you keep this vehicle.' },
  { id:'wash', kind:'car', ic:'🧽', name:'Car wash', towns:['wallawalla','kennewick','richland'], cost:15, fx:{happy:2},
    note:'Extra satisfying after harvest dust (August–September) or winter road grime.' },
  { id:'cafe', kind:'eat', ic:'🥪', name:'Lunch at a small-town café', towns:['dayton'], cost:18, fx:{happy:3, community:1} },
  { id:'bistro', kind:'eat', ic:'🍝', name:'Dinner downtown', towns:['wallawalla'], cost:60, fx:{happy:5}, date:true },
  { id:'tasting', kind:'eat', ic:'🍷', name:'A tasting room', towns:['wallawalla'], cost:35, fx:{happy:4}, min21:true, date:true },
  { id:'taco', kind:'eat', ic:'🌮', name:'Taquerias and food trucks', towns:['pasco'], cost:16, fx:{happy:4} },
  { id:'court', kind:'eat', ic:'🍔', name:'The mall food court', towns:['kennewick'], cost:14, fx:{happy:2} },
  { id:'riverdine', kind:'eat', ic:'🐟', name:'Dinner by the river', towns:['richland'], cost:45, fx:{happy:4}, date:true },
  { id:'depot', kind:'do', ic:'🚂', name:'The old depot and the courthouse', towns:['dayton'], cost:0, fx:{happy:2, community:1} },
  { id:'market', kind:'do', ic:'🥕', name:'Farmers market', towns:['wallawalla','pasco'], cost:20, fx:{happy:3, community:2}, when:inSeason(4,5,6,7,8,9), season:'May–October' },
  { id:'college', kind:'do', ic:'🎓', name:'A college game or concert', towns:['wallawalla'], cost:15, fx:{happy:4, community:1}, when:inSeason(0,1,2,3,4,8,9,10,11), season:'during the school year' },
  { id:'movies', kind:'do', ic:'🎬', name:'The movies', towns:['wallawalla','kennewick'], cost:28, fx:{happy:3}, date:true },
  { id:'mall', kind:'do', ic:'🛍️', name:'The mall', towns:['kennewick'], cost:40, fx:{happy:2} },
  { id:'park', kind:'do', ic:'🌳', name:'A picnic at Columbia Park', towns:['kennewick'], cost:5, fx:{health:3, happy:3}, when:inSeason(3,4,5,6,7,8,9), season:'April–October' },
  { id:'arena', kind:'do', ic:'🎟️', name:'A show at the arena', towns:['kennewick'], cost:55, fx:{happy:5} },
  { id:'riverwalk', kind:'do', ic:'🚶', name:'A walk in the riverfront park', towns:['richland'], cost:0, fx:{health:3, happy:2} },
  { id:'museum', kind:'do', ic:'🔬', name:'The science museum', towns:['richland'], cost:15, fx:{happy:3} },
  { id:'confluence', kind:'do', ic:'🏞️', name:'The state park where the rivers meet', towns:['pasco'], cost:10, fx:{health:3, happy:3}, when:inSeason(3,4,5,6,7,8,9), season:'April–October' },
  { id:'baseball', kind:'do', ic:'⚾', name:'A minor-league ball game', towns:['pasco'], cost:25, fx:{happy:5}, when:inSeason(5,6,7,8), season:'June–September' },
  { id:'dentist', kind:'appt', ic:'🦷', name:'Dentist checkup', towns:['wallawalla','kennewick'], cost:120, fx:{health:3}, note:'A checkup a year keeps toothaches away.' },
  { id:'checkup', kind:'appt', ic:'🩺', name:'Doctor checkup', towns:['wallawalla','kennewick'], cost:250, fx:{health:6}, note:'Does more when your health is low.' }
];
const stopById = id => STOPS.find(s => s.id === id);
// B5: while you're in debt a trip is one stop at most, and the trip screens say so
const tripMax = () => S.money < 0 ? 1 : TRIP_MAX;
const debtTripNote = () => S.money < 0 ? `<div class="card warn">💳 You're ${fmt(-S.money)} in debt: trips cost gas and money, so they're limited to 1 stop until you're back above $0.</div>` : '';
// why a stop can't be picked right now ('' when it can)
function stopBlocked(s){
  if (s.feat && !on(s.feat)) return 'Not offered';   // to-do 2: a stop whose feature is off
  if (s.min21 && age() < 21) return '21 and over';
  if (s.when && !s.when()) return `Only ${s.season}`;
  if (s.ok && !s.ok()) return s.okWhy ? s.okWhy() : s.id === 'tires' ? 'Already on this vehicle' : 'Not now';
  return '';
}
const townStops = city => STOPS.filter(s => s.towns.includes(city) && !(s.feat && !on(s.feat)));
const tripIsCommute = city => !S.retired && job() && job().city === city;
const tripGas = city => tripIsCommute(city) ? 0 : CITIES[city].miles * 2 * cost(GAS) / CARS[S.car].mpg;
// a stop costs more with your partner along on a dinner or a movie
const stopCost = (s, town) => (s.id === 'dentist' && dentalOn() ? 0 : cost(s.cost)) * (s.date && S.partner ? 2 : 1) * (retailPerk(town) ? 1 - RETAIL_DISCOUNT : 1);   // i75-b08: the mall discount; i74-a08: checkups are free with dental
// breakdown odds: lower within 6 months of an oil change, higher after a year without one
function careMult(){ const w = S.turn - (S.svc ?? 0); return w <= 26 ? 0.6 : w <= 52 ? 1 : 1.4; }
const ditchMult = () => S.tires === S.car ? 0.4 : 1;
// i42-a03: how many times in a row you've made this stop (0 = fresh) if you went this week
function stopRunNext(id){
  const last = (S.stopLast || {})[id], n = (S.stopRun || {})[id] || 0;
  if (last == null) return 0;
  const gap = S.turn - last;
  return gap < REPEAT_WEEKS ? n + 1 : gap > STOP_RESET ? 0 : Math.max(0, n - 1);
}
const stopFresh = id => STOP_DECAY[Math.min(STOP_DECAY.length - 1, stopRunNext(id))];
// i58-b03: trips taken in the last 4 weeks, and what that leaves of a trip's happiness and health
const recentTrips = () => (S.tripTurns || []).filter(t => S.turn - t < WEARY_WEEKS && t < S.turn).length;
const wearyF = () => Math.max(0, 1 - recentTrips() * WEARY_CUT);
// i42-a01: how much of the week a planned trip leaves for your focus (1 = no trip, or a trip in your work town)
function tripTimeF(){
  const t = S.trip; if (!t || !CITIES[t.city] || !(t.stops || []).some(id => { const s = stopById(id); return s && !stopBlocked(s); })) return 1;
  return vanTrip(t) ? VAN_TIME : tripIsCommute(t.city) ? 1 : TRIP_TIME;
}
// plan this week's trip; returns '' or why it can't be planned
function planTrip(city, ids, van = false){
  if (!on('trips')) return 'Trips aren\'t part of this life.';   // to-do 2: the feature is switched off
  if (awaySouth()) return 'You\'re in Arizona until April.';   // i3-a30
  if (!CITIES[city] || city === 'waitsburg') return 'Pick a town to visit.';
  ids = [...new Set(ids)];
  if (!ids.length) return 'Pick at least one stop.';
  if (ids.length > tripMax()) return S.money < 0 ? 'While you\'re in debt, a trip can have only 1 stop.' : `Up to ${TRIP_MAX} stops a trip.`;
  for (const id of ids) {
    const s = stopById(id);
    if (!s || !s.towns.includes(city)) return 'That stop isn\'t in this town.';
    const why = stopBlocked(s); if (why) return `${s.name}: ${why.toLowerCase()}.`;
  }
  S.trip = { city, stops: ids };
  if (van && vanFits(city, ids)) S.trip.van = true;   // i74-a05: the county medical van
  return '';
}
// runs inside weekTick's money step: adds the trip's lines, does its errands and returns the stat effects
function tripWeek(lines){
  const t = S.trip; if (!t || !CITIES[t.city] || !on('trips')) { S.trip = null; return null; }
  const c = CITIES[t.city], fx = { happy:0, health:0, community:0 }, done = [];
  const van = vanTrip(t), gas = van ? 0 : tripGas(t.city);
  const commute = !van && tripIsCommute(t.city), weary = wearyF();
  if (gas) lines.push([`Trip to ${c.name}: gas`, -gas, `${c.miles} miles each way at ${CARS[S.car].mpg} mpg.`]);
  if (van) lines.push(['County medical van', -cost(VAN_FARE), 'A seat on the county van to your appointments: no driving, but it takes the whole day.']);
  for (const id of t.stops) {
    const s = stopById(id); if (!s || stopBlocked(s)) continue;
    if (stopCost(s, t.city)) lines.push([s.name, -stopCost(s, t.city), `A stop on your trip to ${c.name}${s.date && S.partner ? ', for two' : ''}${retailPerk(t.city) ? ', with your 10% employee discount' : ''}.`]);
    const run = stopRunNext(id);                     // i42-a03: again and again: less special each time
    let mult = STOP_DECAY[Math.min(STOP_DECAY.length - 1, run)];
    if (s.date && S.partner) mult += 0.4;
    if (s.id === 'wash' && [7,8,11,0,1].includes(curMonth())) mult += 0.5;
    if (s.id === 'checkup' && S.health < 50) mult *= 1.7;
    if (commute && AFTER_WORK_KINDS.includes(s.kind)) mult *= AFTER_WORK;   // i42-a02: an evening out after a shift
    for (const [k, v] of Object.entries(s.fx || {})) fx[k] += v * mult * TRIP_FX * (v > 0 && k !== 'community' ? weary : 1);   // same scale as a week's focus; i58-b03 road-weary
    if (s.id === 'stock') S.stockUntil = S.turn + STOCK_WEEKS;
    if (s.id === 'oil') S.svc = S.turn;
    if (s.id === 'tires') S.tires = S.car;
    if (s.id === 'dentist') S.dentist = S.turn;
    stopDone(s, fx);                                  // i74: shots, physical therapy, a respite weekend
    (S.stopRun = S.stopRun || {})[id] = run;
    (S.stopLast = S.stopLast || {})[id] = S.turn;
    done.push(s.name.charAt(0).toLowerCase() + s.name.slice(1));
  }
  S.trip = null;
  if (!done.length) return null;
  (S.towns = S.towns || {})[t.city] = 1;
  S.tripTurns = [...(S.tripTurns || []).filter(x => S.turn - x < WEARY_WEEKS), S.turn];
  log(`Trip to ${c.name}${van ? ' on the county medical van' : tripIsCommute(t.city) ? ' on the way home from work' : ''}: ${done.join(', ')}.`, 'trip');
  if (S.run) S.run.happened.push({ ic:'🚗', title:`Trip to ${c.name}`, money:0 });
  return { fx, away: van || !tripIsCommute(t.city), city: t.city, van };
}

/* ---- trip screens ---- */
// i58-b03: a note when this would be the 2nd, 3rd or 4th trip in a month
function wearyNote(){
  const n = recentTrips(); if (!n) return '';
  return `<p class="muted weary">🥱 ${['2nd', '3rd', '4th'][Math.min(2, n - 1)]} trip in a month: less special. Its happiness and health count ${Math.round(wearyF() * 100)}%. One or two trips a month is the sweet spot.</p>`;
}
function tripPicker(){
  if (!on('trips')) return;
  openSystem('trip', { quiet:true, how:'used' });
  sheet(`<h2>🚗 Plan a trip</h2>
    ${firstTime('trips')}<p class="muted">One trip a week, up to ${tripMax()} stop${tripMax() === 1 ? '' : 's'}. It happens when you end the week.${S.trip ? ` You have a trip to ${CITIES[S.trip.city].name} planned.` : ''}</p>${wearyNote()}${debtTripNote()}
    ${Object.entries(CITIES).filter(([k]) => k !== 'waitsburg').map(([k,c]) => {
      const gas = tripGas(k);
      return `<button class="kv job tripto" data-town="${k}"><span><span class="t">${TOWNIC[k]} ${c.name}</span><span class="s">${c.miles} mi each way · ${gas ? `gas about ${fmt(gas)}` : 'on your way home from work: no extra gas'}</span></span><span aria-hidden="true">›</span></button>`;
    }).join('')}
    <button class="btn ghost" id="n">Close</button>`);
  document.querySelectorAll('[data-town]').forEach(b => b.onclick = () => tripSheet(b.dataset.town));
  $('#n').onclick = closeSheet;
}
function tripSheet(city){
  if (!on('trips')) return;
  const c = CITIES[city], gas = tripGas(city);
  const max = tripMax();
  let sel = S.trip && S.trip.city === city ? S.trip.stops.filter(id => !stopBlocked(stopById(id))).slice(0, max) : [];
  const vanShown = city === 'wallawalla' && vanOK();
  let van = vanShown && !!(S.trip && S.trip.van);
  const groups = Object.entries(STOP_KINDS).map(([kind, label]) => {
    const list = townStops(city).filter(s => s.kind === kind); if (!list.length) return '';
    return `<h3 class="triph">${label}</h3>` + list.map(s => {
      const why = stopBlocked(s);
      const fresh = stopFresh(s.id), what = [stopCost(s, city) ? fmt(stopCost(s, city)) : 'Free', s.fx ? fxWords(s.fx) : '', s.fx && fresh < 1 ? `been here lately: ${Math.round(fresh * 100)}% as fun` : ''].filter(Boolean).join(' · ');   // i42-a03
      return `<button class="stopbtn${sel.includes(s.id) ? ' on' : ''}" data-stop="${s.id}" aria-pressed="${sel.includes(s.id)}" ${why ? 'disabled' : ''}>
        <span class="t">${s.ic} ${s.name}</span><span class="s">${why ? why : what}${s.date && S.partner && !why ? ' · for two' : ''}</span>${s.note && !why ? `<span class="s">${s.note}</span>` : ''}</button>`;
    }).join('');
  }).join('');
  sheet(`<div class="sheethead"><h2>${TOWNIC[city]} <span class="sr-only">Trip to </span>${c.name}</h2><span class="cnt" id="tripcnt"></span><button class="sm alt" id="close">Close</button></div>
    <p class="muted">${c.miles} mi each way · ${gas ? `gas about ${fmt(gas)}. A trip takes part of your week: your focus works at ${TRIP_TIME*100}%.` : 'You work here, so you\'ll stop on the way home: no extra gas or time.'}</p>
    ${gas ? '' : `<p class="muted">After work: eat and do stops do a bit less (${AFTER_WORK * 100}%). Errands, car care and checkups count in full.</p>`}
    ${wearyNote()}
    ${debtTripNote()}
    ${S.trip && S.trip.city !== city ? `<p class="muted">This replaces your trip to ${CITIES[S.trip.city].name}.</p>` : ''}
    ${groups}
    ${vanShown ? `<h3 class="triph">🚐 Getting there</h3><button class="stopbtn" id="van" aria-pressed="${van}"><span class="t">🚐 Ride the county medical van</span><span class="s">${fmtc(VAN_FARE)} instead of gas · takes the whole day: your focus works at ${VAN_TIME * 100}%</span><span class="s">For appointment stops only.</span></button>` : ''}
    <p id="tripsum" class="tripsum" aria-live="polite"></p>
    <button class="btn primary" id="go">Plan this trip</button>
    ${S.trip ? '<button class="btn ghost" id="cancel">Cancel my trip</button>' : ''}
    <button class="btn ghost" id="back">Other towns</button>`);
  const sum = () => {
    const vanOn = van && vanFits(city, sel);
    if ($('#van')) { $('#van').classList.toggle('on', vanOn); $('#van').setAttribute('aria-pressed', vanOn); $('#van').disabled = !!sel.length && !vanFits(city, sel); }
    const total = (vanOn ? cost(VAN_FARE) : gas) + sel.reduce((a, id) => a + stopCost(stopById(id), city), 0);
    $('#tripsum').textContent = sel.length ? `${sel.length} of ${max} stop${max === 1 ? '' : 's'} · about ${fmt(total)} in all` : `Pick up to ${max} stop${max === 1 ? '' : 's'}.`;
    $('#tripcnt').textContent = `${sel.length} of ${max} stop${max === 1 ? '' : 's'}`;   // i20-a23: the sticky header keeps the count in view
    $('#go').disabled = !sel.length;
    document.querySelectorAll('[data-stop]').forEach(b => {
      const s = stopById(b.dataset.stop), on = sel.includes(s.id);
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      b.disabled = !!stopBlocked(s) || (!on && sel.length >= max);
    });
  };
  document.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => {
    const id = b.dataset.stop;
    sel = sel.includes(id) ? sel.filter(x => x !== id) : sel.length < max ? [...sel, id] : sel; sum();
  });
  $('#go').onclick = () => {
    const err = planTrip(city, sel, van); if (err) return toast(err);
    save(); closeSheet(); render(); announce(`Trip to ${c.name} planned for this week. End Week now shows it.`);   // i23-a04: the End Week button shows it, so no toast on top of it
  };
  if ($('#cancel')) $('#cancel').onclick = () => { S.trip = null; save(); closeSheet(); render(); toast('Trip canceled'); };
  $('#back').onclick = tripPicker;
  $('#close').onclick = closeSheet;
  if ($('#van')) $('#van').onclick = () => { van = !van; sum(); };
  sum();
}
const tripChip = () => S.trip ? `🚗 Trip: ${CITIES[S.trip.city].name} (${S.trip.stops.length})` : '🚗 Plan a trip';

/* ============================================================
   🏅 ACHIEVEMENTS AND LIFE GOALS (#66)
   Badges are earned during a life (and collected across all your lives). Pin up to 3 as life goals on the
   Life tab: each pinned goal you reach adds 2 points to your Life Score.
   ============================================================ */
const BADGES = [
  { id:'job', ic:'💼', name:'First paycheck', desc:'Get a job.', test:() => !!S.jobId || S.retired },
  { id:'cert', ic:'📜', name:'Certified', desc:'Earn a trade certificate.', test:() => S.edu >= 1 },
  { id:'degree', ic:'🎓', name:'College graduate', desc:"Earn a bachelor's degree.", test:() => S.edu >= 3 },
  { id:'wheels', ic:'🚙', name:'New wheels', desc:'Trade up from the 1998 pickup.', test:() => S.car !== 'beater' },
  { id:'homeowner', ic:'🔑', name:'Homeowner', desc:'Buy a home.', test:() => !!HOMES[S.home].own },
  { id:'farmhouse', ic:'🏡', name:'The farmhouse', desc:'Own the farmhouse in the wheat hills.', test:() => S.home === 'farm' },
  { id:'paidoff', ic:'✂️', name:'Paid in full', desc:'Pay off a truck or student loan.', test:() => !!S.paidOff },
  { id:'saver', feat:'money.k401', ic:'🏦', name:'Saver', desc:'Have $25,000 in your 401(k) (2027 dollars).', test:() => (S.k401 || 0) / (S.col || 1) >= 25000 },
  { id:'nestegg', ic:'🥚', name:'Nest egg', desc:'Reach $100,000 net worth (2027 dollars).', test:() => netWorth() / (S.col || 1) >= 100000 },
  { id:'legend', ic:'🤝', name:'Pillar of the town', desc:'Reach community 80.', test:() => S.community >= 80 },
  { id:'healthy', ic:'💪', name:'Picture of health', desc:'Reach health 85.', test:() => S.health >= 85 },
  { id:'happy', ic:'😄', name:'Happy camper', desc:'Reach happiness 85.', test:() => S.happy >= 85 },
  { id:'council', feat:'family.council', ic:'🏛️', name:'Council member', desc:'Win a seat on the town council.', test:() => !!S.council },
  { id:'family', feat:'family.kids', ic:'👶', name:'Family', desc:'Have a kid.', test:() => (S.kids || []).length > 0 },
  { id:'dog', ic:'🐕', name:'Good dog', desc:'Adopt a dog.', test:() => !!S.dog },
  { id:'roadtrip', ic:'🗺️', name:'Know the region', desc:'Take a trip to all five towns.', test:() => Object.keys(S.towns || {}).length >= 5 },
  { id:'helper', feat:'town.seasonGoals', ic:'🌸', name:'Town helper', desc:'Finish 4 town goals.', test:() => (S.seasonWins || 0) >= 4 },
  { id:'retired', feat:'retire.income', ic:'🎉', name:'Retired', desc:'Retire (Lifetime games).', test:() => !!S.retired }
];
const BADGE_KEY = KEY_PREFIX + 'badges.v1', GOAL_MAX = 3, GOAL_POINTS = 2;
const badgeById = id => BADGES.find(b => b.id === id);
// to-do 2 D2: badges for a feature this life doesn't have can't be pinned as goals
const badgesOn = () => BADGES.filter(b => !b.feat || on(b.feat));
// check for new badges; returns notes for any just earned
function badgeWeek(notes){
  if (S.practice || !on('goals.badges')) return;
  S.badges = S.badges || {};
  const all = store.get(BADGE_KEY) || {};
  for (const b of badgesOn()) if (!S.badges[b.id] && b.test()) {   // to-do 2 D6: a badge for a switched-off system can't be earned
    S.badges[b.id] = S.turn; if (!S.rewound) all[b.id] = 1;   // i63-b22: a rewound life's badges stay in the life, not the collection
    const goal = (S.goals || []).includes(b.id);
    buzz('badge');
    (S.newBadges = S.newBadges || []).push(`${b.ic} Badge earned: ${b.name}${goal ? ` (a life goal! +${GOAL_POINTS} Life Score)` : ''}`);   // a toast, not a stop
    log(`Earned a badge: ${b.name}.`, 'mile');
  }
  store.set(BADGE_KEY, all);
}
// a goal counts only if it was pinned before the badge was earned (no pinning old badges in the last week)
const goalCounts = id => !!(S.badges && S.badges[id] != null && (S.goalAt || {})[id] != null && S.badges[id] > S.goalAt[id]);
// i22-a07: a goal you already meet (badges are only checked at the week's end) can't be newly pinned for free points
const goalMetNow = id => { const b = badgeById(id); return !!(b && !(S.goals || []).includes(id) && !(S.badges && S.badges[id] != null) && b.test()); };
const goalBonus = () => !on('goals.badges') ? 0 : (S.goals || []).filter(goalCounts).length * GOAL_POINTS;
function goalsSheet(){
  let sel = [...(S.goals || [])];
  sheet(`<h2>🎯 Pick your life goals</h2>
    <p class="muted">Pin up to ${GOAL_MAX}. Each one you reach <b>after</b> pinning it adds ${GOAL_POINTS} points to your Life Score. You can change them any time.</p>
    ${badgesOn().map(b => { const got = S.badges && S.badges[b.id];
      const pinnedEarly = (S.goals || []).includes(b.id) && goalCounts(b.id), met = goalMetNow(b.id);
      return `<button class="stopbtn${sel.includes(b.id) ? ' on' : ''}" data-goal="${b.id}" data-met="${met ? 1 : ''}" aria-pressed="${sel.includes(b.id)}"><span class="t">${b.ic} ${b.name}${got ? ' ✅' : ''}</span><span class="s">${b.desc}${got && !pinnedEarly ? ' · Already earned, so it won\'t add points' : met ? ' · You already meet this, so it can\'t be a goal' : ''}</span></button>`; }).join('')}
    <p id="goalsum" class="tripsum" aria-live="polite"></p>
    <button class="btn primary" id="ok">Save my goals</button><button class="btn ghost" id="n">Cancel</button>`);
  const sum = () => { $('#goalsum').textContent = `${sel.length} of ${GOAL_MAX} picked`;
    document.querySelectorAll('[data-goal]').forEach(b => { const on = sel.includes(b.dataset.goal); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.disabled = !on && (sel.length >= GOAL_MAX || !!b.dataset.met); }); };
  document.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => { const id = b.dataset.goal;
    sel = sel.includes(id) ? sel.filter(x => x !== id) : sel.length < GOAL_MAX && !goalMetNow(id) ? [...sel, id] : sel; sum(); });
  $('#ok').onclick = () => {
    sel = sel.filter(id => !goalMetNow(id));
    const at = {}; for (const id of sel) at[id] = (S.goalAt || {})[id] ?? S.turn;   // keep the week each goal was first pinned
    S.goals = sel; S.goalAt = at; save(); closeSheet(); render(); toast(sel.length ? '🎯 Life goals saved' : 'No life goals pinned'); };
  $('#n').onclick = closeSheet;
  sum();
}
function goalsCard(){
  if (!on('goals.badges')) return '';
  const got = Object.keys(S.badges || {}).length;
  return `${firstTime('goals')}<div class="card" id="goalscard"><h3>🎯 Life goals${newTag('goals')} <span class="tag">${got}/${badgesOn().length} badges</span></h3>
    ${(S.goals || []).length ? S.goals.map(id => { const b = badgeById(id); const got = S.badges && S.badges[id] != null;
      return b ? `<div class="kv"><span>${b.ic} ${b.name}<br><small class="muted">${b.desc}</small></span><span>${goalCounts(id) ? `✅ +${GOAL_POINTS}` : got ? '✅ (earned before you pinned it)' : 'Not yet'}</span></div>` : ''; }).join('')
      : `<p class="muted" style="margin:0 0 6px">Pin up to ${GOAL_MAX} goals for this life. Each one you reach after pinning it adds ${GOAL_POINTS} points to your Life Score.</p>`}
    <button class="sm" id="goals">${(S.goals || []).length ? 'Change goals' : 'Pick life goals'}</button>
    ${got ? `<p class="muted" style="margin:8px 0 0">Earned: ${BADGES.filter(b => S.badges[b.id]).map(b => `<span title="${b.name}">${b.ic}</span>`).join(' ')}</p>` : ''}</div>`;
}

/* ============================================================
   📖 STORY CHAINS (#68): events that unfold over weeks. Each step waits a few weeks and depends on what you chose.
   ============================================================ */
const chain = id => (S.chains || {})[id] || { step:0, at:0, f:{} };
const chainAt = (id, step) => { const c = (S.chains || {})[id]; return !!c && c.step === step && S.turn >= c.at; };
function chainSet(id, step, flags = {}, wait = [3, 7]){
  S.chains = S.chains || {}; const old = chain(id);
  S.chains[id] = { step, at: S.turn + ri(wait[0], wait[1]), f: { ...old.f, ...flags } };
}
const chainEnd = id => chainSet(id, 99);
const STORY_EVENTS = [
  // 🔨 the fixer-upper
  { ic:'🔨', title:'The porch is sagging', once:1, w:4, when:() => S.home === 'fixer' && !S.chains?.fixer,
    text:'The front porch of your fixer-upper groans every time you step on it. Time to do something.',
    choices:() => [
      {label:`Fix it yourself (-${fmt(handyCost(350))})`, go:() => { adj({money:-handyCost(350), health:-2, happy:2}); practice('handy', 3); chainSet('fixer', 2, { diy:true }); return 'Two weekends, a borrowed saw and sore hands. It\'s solid now, and you learned a lot.'; }},
      {label:`Hire Tim's Trim & Timber (-${fmtc(1400)})`, go:() => { adj({money:-cr(1400)}); chainSet('fixer', 2, { diy:false }); return 'Tim\'s Trim & Timber had it done in two days.'; }},
      {label:'Leave it', go:() => { adj({happy:-2}); chainEnd('fixer'); return 'You step carefully around the soft board.'; }}
    ]},
  { ic:'🍳', title:'The kitchen is next', once:1, w:8, when:() => chainAt('fixer', 2) && S.home === 'fixer',
    text:() => chain('fixer').f.diy ? 'Fixing the porch gave you ideas. The 1970s kitchen is calling.' : 'The contractor mentions the kitchen could use the same treatment.',
    choices:() => [
      {label:`Redo it yourself over a month (-${fmt(handyCost(2500))})`, go:() => { adj({money:-handyCost(2500), health:-3, happy:3}); practice('handy', 4); chainSet('fixer', 3, { kitchen:'diy' }, [6, 10]); return 'Cabinets out, cabinets in. Dinner on a camp stove for a month.'; }},
      {label:`Hire Sharp Point Builders (-${fmtc(7000)})`, go:() => { adj({money:-cr(7000)}); chainSet('fixer', 3, { kitchen:'pro' }, [6, 10]); return 'The crew is on it. Takeout for a few weeks.'; }},
      {label:'Not now', go:() => { chainEnd('fixer'); return 'The old kitchen still works. Mostly.'; }}
    ]},
  { ic:'🏠', title:'The house is coming together', once:1, w:8, when:() => chainAt('fixer', 3) && S.home === 'fixer',
    text:'Porch fixed, kitchen redone. The fixer-upper is starting to look like a real home, and it\'s worth more for it.',
    choices:() => [{label:'Step back and look', go:() => { const diy = chain('fixer').f.kitchen === 'diy', gain = Math.round(cost(diy ? 6500 : 8000));
      S.equity += gain; adj({happy:6, community:2}); chainEnd('fixer'); S.storiesDone = (S.storiesDone || 0) + 1;
      return `The neighbors stopped by to see it. Your home is worth about ${fmt(gain)} more${diy ? ', and you did most of it yourself' : ''}.`; }}]},
  // 🚚 a friend's food truck
  { ic:'🚚', title:"A friend's food truck", once:1, w:3, when:() => S.community >= 40 && age() >= 21 && !S.chains?.truck,
    text:'An old friend wants to start a food truck: Walla Walla sweet onion burgers. They\'re looking for a partner.',
    choices:() => [
      {label:`Invest ${fmtc(1500)}`, go:() => { adj({money:-cr(1500)}); chainSet('truck', 2, { inv:true }); return 'You\'re a silent partner in a food truck. Wild.'; }},
      {label:'Help out on weekends', go:() => { adj({community:3, health:-1}); chainSet('truck', 2, { help:true }); return 'You spent two Saturdays painting the truck and testing burgers.'; }},
      {label:'Wish them luck', go:() => { chainEnd('truck'); return 'You promise to be their first customer.'; }}
    ]},
  { ic:'🍔', title:'Opening day for the food truck', once:1, w:8, when:() => chainAt('truck', 2),
    text:'The food truck opens at the fairgrounds. The line starts early.',
    choices:() => [{label:'See how it goes', go:() => { const c = chain('truck'), good = chance(c.f.help ? 0.75 : 0.6);
      adj(good ? {happy:3, community:2} : {happy:-2}); chainSet('truck', 3, { good }, [20, 30]);
      return good ? 'Sold out by two o\'clock. People are already asking when it\'s back.' : 'The grill quit at noon. Rough first day.'; }}]},
  { ic:'📈', title:'A year of the food truck', once:1, w:8, when:() => chainAt('truck', 3),
    text:'It\'s been a while since the food truck opened. Your friend comes by to talk.',
    choices:() => [{label:'Hear the news', go:() => { const f = chain('truck').f; chainEnd('truck'); S.storiesDone = (S.storiesDone || 0) + 1;
      if (f.good && f.inv) { const v = Math.round(cost(3200)); adj({money:v, happy:3}); return `The truck is a hit. Your share of the profits: ${fmt(v)}.`; }
      if (f.inv) { adj({happy:-3}); return 'The truck didn\'t make it. Your $1,500 is gone, but your friend is still your friend.'; }
      if (f.good) { adj({community:5, happy:3}); return 'The truck is a hit, and your friend tells everyone you helped build it.'; }
      adj({community:2}); return 'The truck closed, but you made some good memories painting it.'; }}]},
  // 🌊 the flood and the levee
  // R10: the flood comes within 8 weeks of high water; i15-a05: sandbaggers get it too, with a line of their own
  { ic:'🌊', title:'Water in the basements', once:1, w:12, when:() => S.highWater != null && S.turn - S.highWater <= 8 && !S.chains?.levee,
    text:() => S.sandbagged != null && S.sandbagged === S.highWater
      ? 'You were there that night, and the sandbags held downtown. But the Touchet found a low spot, and half a dozen homes near the river have water in the basement. The town wants a real fix.'
      : 'The Touchet jumped its banks overnight. Half a dozen homes near the river have water in the basement.',
    choices:() => [
      {label:'Help muck out', go:() => { adj({community:4, health:-2}); chainSet('levee', 2, { helped:true }); return 'Wet boots, heavy carpets, grateful neighbors.'; }},
      {label:'Stay out of it', go:() => { adj({community:-2}); chainSet('levee', 2, { helped:false }); return 'You heard about it at the grocery store.'; }}
    ]},
  { ic:'🏗️', title:'A levee for the town', once:1, w:8, when:() => chainAt('levee', 2),
    text:'After the flood, the city wants to build up the levee along the river, and it\'s asking for volunteers and donations.',
    choices:() => [
      {label:'Volunteer on weekends', go:() => { adj({community:3, health:-1}); chainSet('levee', 3, { vol:true }, [20, 30]); return 'Sandbags, shovels and a lot of coffee.'; }},
      {label:`Donate ${fmtc(200)}`, go:() => { adj({money:-cr(200), community:2}); chainSet('levee', 3, { don:true }, [20, 30]); return 'Your name is on the donor list at City Hall.'; }},
      {label:'Pass', go:() => { chainEnd('levee'); return 'Somebody else will handle it.'; }}
    ]},
  { ic:'🎗️', title:'The levee is dedicated', once:1, w:8, when:() => chainAt('levee', 3),
    text:'The new levee is finished. The town holds a ribbon cutting by the river.',
    choices:() => [{label:'Go to the ribbon cutting', go:() => { const f = chain('levee').f; chainEnd('levee'); S.storiesDone = (S.storiesDone || 0) + 1;
      if (f.vol) { adj({community:4, happy:3}); return 'Your name is on the plaque with the other volunteers.'; }
      adj({community:3, happy:2}); return 'A good day for the town. The river can rise all it wants now.'; }}]}
];

/* ============================================================
   🏁 CHALLENGE SCENARIOS (#74): set-up stories with a goal
   ============================================================ */
const SCENARIOS = {
  debtfree: { ic:'💳', name:'Debt-free in 2 years', len:'two', bg:'fresh', endOnly:true,
    desc:'You start $8,000 in debt. Finish two years with no debt and no loans.',
    set:s => { s.money = -8000; }, win:() => S.money >= 0 && !(S.loanLeft > 0) && !(S.sloanLeft > 0) },
  farm: { ic:'🏡', name:'Save the family farm', len:'five', bg:'farm',
    desc:'The family farmhouse is up for sale. Buy it within five years.', win:() => S.home === 'farm' },
  single: { ic:'👶', name:'Single parent', len:'two', bg:'parent', endOnly:true,
    desc:'Two years with a toddler: stay out of debt and keep your average happiness at 55 or more.',
    win:() => S.money >= 0 && (S.monthsPlayed ? S.happySum / S.monthsPlayed : S.happy) >= 55 },
  lab: { ic:'🔬', name:'From the wheat to the lab', len:'five', bg:'fresh',
    desc:'Become a national lab scientist in Richland within five years.', win:() => S.jobId === 'scientist' }
};
const CHALLENGE_KEY = KEY_PREFIX + 'challenges.v1';
function scenarioWeek(notes){
  if (!on('challenges.scenarios')) return;
  const sc = SCENARIOS[S.scenario]; if (!sc || sc.endOnly || S.scWon) return;
  if (sc.win()) { S.scWon = true; notes.push(`🏁 Challenge complete: <b>${sc.name}</b>! Play on as long as you like.`); log(`Completed the challenge: ${sc.name}.`, 'mile'); markChallenge(S.scenario); }
}
function markChallenge(id){ if (S.practice || S.rewound) return; const w = store.get(CHALLENGE_KEY) || {}; w[id] = 1; store.set(CHALLENGE_KEY, w); }
function scenarioLine(){
  const sc = SCENARIOS[S.scenario]; if (!sc || !on('challenges.scenarios')) return '';
  return `<div class="sgoal">${sc.ic} <b>Challenge:</b> ${sc.desc}${S.scWon ? ' ✅ Done!' : ''}</div>`;
}
// i20-a30: Start sits under each description (no more clipping at 360 wide), with the length and your best as tags.
// i50-a05: the weekly challenge and your records moved here from the title screen.
function challengesSheet(){
  const won = store.get(CHALLENGE_KEY) || {}, best = store.get(BEST_KEY) || {}, wk = best[recKey('normal', `wk-${isoWeek()}`)];   // D7: the weekly is a Normal life
  const nWon = Object.keys(SCENARIOS).filter(k => won[k]).length;
  const diffBadge = d => `<span class="tag">${DIFFS[d].ic} ${DIFFS[d].label}</span>`;
  const tags = (len, b) => `<span class="tag">${LENGTHS[len].label}</span>${b != null ? `<span class="tag">Your best ${b}</span>` : ''}`;
  sheet(`<h2>🏁 Challenges</h2>
    <p class="muted">Set-up stories with a goal. They use the name you typed and the standard rules.</p>
    <div class="chrow"><div class="t">📅 Weekly challenge (${isoWeek()}) ${tags('half', wk)}${diffBadge('normal')}</div>
      <div class="s">A 6-month life where everyone gets the same events and dice this week. Play it, then share your score card and compare with friends. Everyone plays it with Normal rules.</div>
      <button class="sm" id="weekly">Start the weekly challenge</button></div>
    <h3 style="margin-top:14px">Story challenges <span class="tag">${nWon}/${Object.keys(SCENARIOS).length} completed</span>${diffBadge('hard')}</h3>
    <p class="muted" style="margin:2px 0">Story challenges play on ${DIFFS.hard.label}.</p>
    ${Object.entries(SCENARIOS).map(([k,sc]) => `<div class="chrow"><div class="t">${sc.ic} ${sc.name}${won[k] ? ' ✅' : ''} ${tags(sc.len, best[recKey('hard', 'sc-' + k)])}</div><div class="s">${sc.desc}</div><button class="sm" data-sc="${k}" aria-label="Start: ${esc(sc.name)}">Start</button></div>`).join('')}
    ${hasRecords() ? `<h3 style="margin-top:14px">🏆 Your records</h3><p class="muted" style="margin:2px 0">Your best Life Scores on this device. Each difficulty keeps its own.</p>${recordsTable()}${customShelf()}${classicShelf()}${topLives()}` : ''}
    ${badgeLine()}
    <button class="btn ghost" id="n">Close</button>`);
  $('#weekly').onclick = () => { if (readSlot(WEEKLY_SLOT)) return weeklySheet(); const name = (($('#nm') && $('#nm').value.trim()) || 'Dusty').slice(0,20); closeSheet(); startWeekly(name); };
  document.querySelectorAll('[data-end]').forEach(b => b.onclick = () => endSummary(top10()[+b.dataset.end]));   // i73-b02
  document.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => {
    const sc = SCENARIOS[b.dataset.sc], name = (($('#nm') && $('#nm').value.trim()) || 'Dusty').slice(0,20), free = freeSlot();
    closeSheet();
    const opts = { bg: sc.bg, diff: 'hard', scenario: b.dataset.sc };   // to-do 2 D2: story challenges are a Hard feature
    if (free < 0) return askReplace(name, sc.len, opts);
    newGame(name, sc.len, free, opts);
  });
  $('#n').onclick = closeSheet;
}

/* ============================================================
   🧰 SKILLS (#71): grow with practice, each opens new choices or saves money
   ============================================================ */
const SKILLS = {
  handy:   { ic:'🔨', name:'Handy', how:'Side hustles (yard work, fences, harvest, snow) and fixing up your home', perk:'Home repairs cost less (−15% a level)' },
  mechanic:{ ic:'🔧', name:'Mechanic', how:'Fixing neighbors\' cars as a side hustle', perk:'Fix truck trouble yourself at level 2; shop bills −15% a level' },
  cook:    { ic:'🍳', name:'Cook', how:'Rest weeks at home (you cook more)', perk:'Food costs −4% a level' },
  people:  { ic:'🗣️', name:'People', how:'Showing up for town and carpooling', perk:'Better odds when you apply for jobs; community fades slower' }
};
const SKILL_STEPS = [8, 24, 48];                     // practice points for levels 1, 2 and 3
// to-do 2 D2: with skills off (Easy) every level reads 0 and practice adds nothing, so skill choices and discounts never show
const skillLv = k => { if (!on('skills')) return 0; const x = (S.skills || {})[k] || 0; return x >= SKILL_STEPS[2] ? 3 : x >= SKILL_STEPS[1] ? 2 : x >= SKILL_STEPS[0] ? 1 : 0; };
function practice(k, n, notes){
  if (!on('skills')) return;
  S.skills = S.skills || {}; const before = skillLv(k);
  S.skills[k] = Math.min(60, (S.skills[k] || 0) + n);
  const after = skillLv(k);
  if (after > before) { (S.newBadges = S.newBadges || []).push(`${SKILLS[k].ic} ${SKILLS[k].name} skill: level ${after}`); log(`${SKILLS[k].name} skill reached level ${after}: ${SKILLS[k].perk.toLowerCase()}.`, 'mile'); }
}
function skillWeek(notes, gig){
  if (S.practice || !on('skills')) return;
  if (gig) practice(gig.id === 'cars' ? 'mechanic' : 'handy', 1, notes);
  if (S.focus === 'rest') practice('cook', 0.5, notes);
  if (S.focus === 'community') practice('people', 1, notes);
  if (carpooling()) practice('people', 0.3, notes);
}
function skillsCard(){
  if (!on('skills')) return '';
  return `${firstTime('skills')}<div class="card" id="skillscard"><h3>🧰 Skills${newTag('skills')}</h3>${Object.entries(SKILLS).map(([k,x]) => { const lv = skillLv(k), pts = (S.skills || {})[k] || 0, next = SKILL_STEPS[lv];
    return `<div class="kv"><span>${x.ic} ${x.name} <b>${'★'.repeat(lv)}${'☆'.repeat(3 - lv)}</b><br><small class="muted">${x.how}. ${x.perk}.</small></span><span>${lv >= 3 ? 'Max' : `${Math.floor(pts)}/${next}`}</span></div>`; }).join('')}</div>`;
}

/* ============================================================
   🏪 YOUR OWN BUSINESS (#72): small, risky, can grow
   ============================================================ */
const TRUCK_PAY = 1700, TRUCK_COOK = 0.08, TRUCK_PERMIT = 1000, SHOP_PAY = 90, SHOP_WEEKS = ['rest', 'hustle'];
const truckPay = (roll = 1) => cost(TRUCK_PAY) * (1 + skillLv('cook') * TRUCK_COOK) * roll * W;
// i75-b18: the wheat ground is hired farmed: custom farming, seed and fertilizer each April (about 80% of an average crop)
const WHEAT_FARMING = 5400;
const BIZ = {
  wheat: { ic:'🌾', name:'Lease wheat ground', cost:6000, desc:'Lease 80 acres and hire it farmed (the farming bill comes each April). The crop comes in each August, more or less depending on the weather: sell it at that summer\'s price or store it at the elevator and sell later. Lease by March to farm this year\'s crop; later in the year, your first crop is next August. The lease runs 5 years, then renewing costs a quarter of the price. What it sells for shrinks as the lease runs down.',
    yearly:() => cost(6000) * wheatYield() * wheatPriceF(), month:7 },
  // i75-b17: a season's base pay of $1,700 a month in Side hustle weeks, and a county health permit each April
  truck: { ic:'🚚', name:'Food truck', cost:9000, desc:`Weekends at the fairgrounds and events, April through October. Takes your Side hustle weeks and pays more than a side hustle, more again with the Cook skill. The county health permit is ${fmtc(TRUCK_PERMIT)} each April.`,
    weekly:() => [3,4,5,6,7,8,9].includes(curMonth()) && S.focus === 'hustle' ? truckPay(0.7 + Math.random() * 0.6) : 0,
    needs:'Food truck season is April to October, and the truck only runs in 🔧 Side hustle weeks. In any other week it sits in the driveway.' },
  // i75-b15: a real garage shop: $6,000, about $90 a month, and only in weeks you Rest or Side hustle
  shop:  { ic:'🪚', name:'Woodworking shop', cost:6000, desc:'Make and sell furniture from your garage. It only gets made in weeks you Rest or Side hustle; pays more with the Handy skill.',
    weekly:() => SHOP_WEEKS.includes(S.focus) ? cost(SHOP_PAY) * (1 + skillLv('handy') * 0.4) * (0.6 + Math.random() * 0.8) * W : 0,
    needs:'The woodworking shop only makes furniture in 🛋️ Rest & recharge and 🔧 Side hustle weeks.' },
  // i3-a18: a small herd that needs you outside: Get outside weeks count as checking on it
  cattle:{ ic:'🐄', name:'Cattle in the foothills', cost:16000, desc:'Six cow-calf pairs on rented pasture in the Blue Mountain foothills. Pasture rent, the vet, minerals and a bull lease cost money all year, hay November through March, calves come in spring, and they sell at the October livestock auction. Get outside weeks count as checking the herd: go too long without one and cows get lost.' }
};
// i3-a15: wheat prices. The yield is the weather; the price (per bushel, in 2027 dollars) is set each July for the new crop.
const WHEAT_BASE = 7.5, WHEAT_STORE_FEE = 0.01, CROP_INS = 540, CROP_INS_YIELD = 0.9;
const wheatPriceF = () => (S.wheatPrice || WHEAT_BASE) / WHEAT_BASE;
// a bad year (15%) brings in 30% of a normal crop, or 90% with crop insurance (i3-a16); otherwise 90–170%
// i75-a01: the year's weather decides it (a dry year, 15%, is the bad one); a20 hail takes a stripe, mostly covered by crop insurance
function wheatYield(){
  const w = wxYear(), hail = S.biz && S.biz.hail && S.biz.hail.y === w.y ? S.biz.hail.cut * (S.biz.ins ? 0.2 : 1) : 0;
  if (w.dry) return S.biz && S.biz.ins ? CROP_INS_YIELD : 0.3;
  return Math.max(w.rain ? 1.1 : 0.9, 0.9 + Math.random() * 0.8) * (1 - hail);   // a02: a May rain raises the floor
}
const wheatPriceLabel = () => `$${(S.wheatPrice * S.col).toFixed(2)}/bushel`;
const storedWheatValue = () => S.biz && S.biz.stored ? S.biz.stored * wheatPriceF() : 0;
function sellStoredWheat(why = ''){
  if (!S.biz || !S.biz.stored) return 0;
  const v = storedWheatValue(); S.money += v; S.biz.earned += v; S.biz.stored = 0;
  log(`Sold the stored wheat for ${fmt(v)} at ${wheatPriceLabel()}${why}.`, 'money');
  return v;
}
const CATTLE_COWS = 6, CALF_PRICE = 1450, PASTURE = 220, HAY = 60, COW_CARE = 90;   // i75-b16: real cow-calf prices; COW_CARE is per cow a year
const herdChecked = (weeks = 6) => S.biz && S.turn - (S.biz.check ?? S.turn) < weeks;
// i22-a06: a wheat lease is worth what's left of it, from what this term cost (a renewal is a quarter of a new lease)
const leaseLeftF = () => clamp(((S.biz.lease ?? LEASE_WEEKS) - S.biz.weeks) / LEASE_WEEKS, 0, 1);
const leaseBase = () => S.biz.leaseBase ?? ((S.biz.lease ?? LEASE_WEEKS) > LEASE_WEEKS ? BIZ.wheat.cost * LEASE_RENEW : BIZ.wheat.cost);
const bizValue = () => !S.biz ? 0 : S.biz.type === 'wheat' ? cost(leaseBase()) * 0.6 * (S.biz.dep ?? 1) * leaseLeftF()
  : cost(BIZ[S.biz.type].cost) * 0.6 * (S.biz.dep ?? 1) * (S.biz.type === 'cattle' ? (S.biz.cows ?? CATTLE_COWS) / CATTLE_COWS : 1);
const leaseCost = () => cost(BIZ.wheat.cost) * LEASE_RENEW;
const leaseDue = () => !!(S.biz && S.biz.type === 'wheat' && S.biz.weeks >= (S.biz.lease ?? LEASE_WEEKS));
function renewLease(){
  if (!leaseDue()) return '';
  const c = leaseCost(); if (S.money < c) return `You need ${fmt(c)} on hand.`;
  S.money -= c; S.biz.lease = S.biz.weeks + LEASE_WEEKS; S.biz.leaseBase = BIZ.wheat.cost * LEASE_RENEW; log(`Renewed the wheat lease for 5 more years (${fmt(c)}).`);
  return '';
}
function bizWeek(lines, notes){
  const b = S.biz && BIZ[S.biz.type]; if (!b || !bizOn(S.biz.type)) return;
  S.biz.weeks++; S.biz.dep = (S.biz.dep ?? 1) * Math.pow(1 - BIZ_DEP, 1/52);   // R13: wear and age take 5% a year off its value
  if (S.biz.type === 'wheat') {                    // R13: the lease runs 5 years, then it's renew or lose it
    const end = S.biz.lease ?? (S.biz.lease = LEASE_WEEKS);
    if (S.biz.weeks === end) { notes.push(`${b.ic} Your wheat lease is up. Renew it on the Life tab for ${fmt(leaseCost())} within ${LEASE_GRACE} weeks, or the landowner leases the ground to someone else.`); log('The wheat lease came up for renewal.'); }
    if (S.biz.weeks >= end + LEASE_GRACE) { sellStoredWheat(' when the lease ended'); notes.push(`${b.ic} You didn't renew, so the wheat lease ended.`); log('The wheat lease ended.'); S.biz = null; return; }
    const y = new Date(S.date).getFullYear();
    if (S.biz.ins && curMonth() === 3 && S.biz.insYear !== y) { S.biz.insYear = y; lines.push(['🌾 Crop insurance premium', -cost(CROP_INS)]); }   // i3-a16
    if (curMonth() === 3 && S.biz.farmYear !== y) { S.biz.farmYear = y; lines.push(['🌾 Custom farming, seed and fertilizer', -cost(WHEAT_FARMING)]); }   // i75-b18
    if (S.biz.stored) lines.push(['🌾 Elevator storage', -S.biz.stored * WHEAT_STORE_FEE * W]);
  }
  if (S.biz.type === 'cattle') return cattleWeek(lines, notes);
  const yr = bizYear();
  if (S.biz.type === 'truck' && curMonth() === 3 && S.biz.permitYear !== new Date(S.date).getFullYear()) {   // i75-b17
    S.biz.permitYear = new Date(S.date).getFullYear(); lines.push(['🚚 County health permit', -cost(TRUCK_PERMIT)]); S.biz.earned -= cost(TRUCK_PERMIT); yr.out += cost(TRUCK_PERMIT); }
  if (b.weekly) { const v = b.weekly(); if (v) { lines.push([`${b.ic} ${b.name}`, v]); S.biz.earned += v; yr.in += v; } }
  if (b.needs) {                                   // i15-a04: each April what the business needs, each October what it earned
    if (curMonth() === 3 && !yr.told) { yr.told = 1; notes.push(`${b.ic} ${b.needs}`); }
    if (curMonth() === 9 && new Date(S.date + 7 * 864e5).getMonth() === 10 && !yr.sum) { yr.sum = 1;
      notes.push(`${b.ic} ${b.name}, ${yr.y} so far: it earned ${fmt(yr.in)}${yr.out ? ` and the permit cost ${fmt(yr.out)}` : ''}.${yr.in < 1 ? ` ${b.needs}` : ''}`); }
  }
  if (b.yearly && curMonth() === b.month && S.biz.paidYear !== new Date(S.date).getFullYear()) {
    S.biz.paidYear = new Date(S.date).getFullYear();
    const crop = cost(6000) * wheatYield(), bad = crop < cost(3000);
    if (S.noEvents || S.practice) {                // no events (practice, rule checks): sold straight off the combine
      const v = crop * wheatPriceF(); lines.push([`${b.ic} Harvest check`, v]); S.biz.earned += v;
      notes.push(bad ? `${b.ic} A rough harvest: your wheat lease paid only ${fmt(v)}.` : `${b.ic} Harvest is in: your wheat lease paid ${fmt(v)}.`);
    } else { S.biz.crop = crop; S.biz.bad = bad; dueEvent('Harvest: sell or store?'); }   // i3-a15: you choose this week
  }
}
// i3-a18: the herd's week: pasture rent all year, hay in winter, calving in spring, the auction in October
// i15-a04: this year's earnings for the truck and the shop (what bizCard's "This season" shows)
function bizYear(){ const y = new Date(S.date).getFullYear(); if (!S.biz.yr || S.biz.yr.y !== y) S.biz.yr = { y, in:0, out:0 }; return S.biz.yr; }
function cattleWeek(lines, notes){
  const B = S.biz, mo = curMonth(), y = new Date(S.date).getFullYear();
  if (B.cows == null) B.cows = CATTLE_COWS;
  if (S.focus === 'outdoors') B.check = S.turn;
  const hard = B.hard === (mo >= 10 ? y : y - 1);
  lines.push(['🐄 Pasture rent', -cost(PASTURE) * W]);
  if (B.cows) lines.push(['🐄 Vet, minerals and bull lease', -cost(COW_CARE) * B.cows / 12 * W]);   // i75-b16
  if ([10, 11, 0, 1, 2].includes(mo)) lines.push([hard ? '🐄 Hay (hard winter)' : '🐄 Hay', -cost(HAY) * B.cows * (hard ? 1.5 : 1) * W]);
  if (mo === 10 && B.hardRoll !== y) { B.hardRoll = y; if (wxHard()) { B.hard = y; notes.push('🐄 The almanac and the old-timers agree: a hard winter is coming. Hay will cost more.'); } }
  if ([1, 2, 3].includes(mo) && !herdChecked(3)) B.miss = (B.miss || 0) + 1;     // calving season without checks
  if (mo === 4 && B.calvedYear !== y) {
    B.calvedYear = y;
    const rate = clamp(0.95 - 0.07 * Math.max(0, (B.miss || 0) - 3) - (hard ? 0.1 : 0), 0.25, 0.95);
    B.calves = clamp(Math.round(B.cows * rate + (B.saved || 0) + (Math.random() - 0.5)), 0, B.cows);
    B.miss = 0; B.saved = 0;
    notes.push(`🐄 Calving is done: ${B.calves} calves on the ground from ${B.cows} cows.`);
  }
  // a month or more without anyone checking: a cow gets through a fence, sick or lost (about a 1 in 4 chance each month)
  if (!herdChecked(6) && S.turn % 4 === 0 && B.cows > 0 && chance(0.25)) {
    B.cows--; notes.push(`🐄 Nobody had checked the herd in weeks, and a cow went missing in the foothills. ${B.cows} left.`); log('Lost a cow in the foothills.');
  }
  if (mo === 9 && B.soldYear !== y && B.calves) {
    B.soldYear = y; const price = 0.75 + Math.random() * 0.5, v = cost(CALF_PRICE) * B.calves * price * (B.thin === y ? 0.9 : 1);   // i75-a16: thin calves after an ice storm
    lines.push([`🐄 ${B.calves} calves sold at auction`, v]); B.earned += v; B.calves = 0;
    notes.push(`🐄 Sale day at the livestock auction: calves went ${price >= 1.1 ? 'high' : price <= 0.9 ? 'cheap' : 'about average'} and you brought home ${fmt(v)}.`);
  }
  if (B.cows <= 0) { notes.push('🐄 Your last cow is gone, and so is the cattle business.'); log('The cattle business ended.'); S.biz = null; }
}
// to-do 2 D2: a business type is offered only when it and 'biz' are on (Normal: the food truck and the woodworking shop)
const bizOn = k => on('biz') && on('biz.' + k);
const bizTypes = () => Object.keys(BIZ).filter(bizOn);
function bizCard(){
  if (!on('biz')) return '';
  if (S.biz) { const b = BIZ[S.biz.type], B = S.biz;
    const lease = B.type === 'wheat' ? (leaseDue() ? `<div class="card warn" style="margin:6px 0">🌾 The lease is up: renew within ${Math.max(1, B.lease + LEASE_GRACE - B.weeks)} week${B.lease + LEASE_GRACE - B.weeks === 1 ? '' : 's'} or it ends. <button class="sm" id="renew">Renew for 5 years (${fmt(leaseCost())})</button></div>`
      : `<div class="kv"><span>Lease</span><span>${Math.ceil(((B.lease ?? LEASE_WEEKS) - B.weeks) / 52 * 10) / 10} years left</span></div>`) : '';
    const wheat = B.type === 'wheat' ? `<div class="kv"><span>Wheat price</span><span>${wheatPriceLabel()}</span></div>
      ${B.stored ? `<div class="kv"><span>🏚️ Stored at the elevator<br><small class="muted">Storage costs about ${fmt(B.stored * WHEAT_STORE_FEE)} a month. It sells by July, when the new crop comes in.</small></span><span>${fmt(storedWheatValue())}</span></div>
        <button class="sm" id="sellwheat">Sell stored wheat (${fmt(storedWheatValue())})</button>` : ''}
      <div class="kv"><span>🛡️ Crop insurance<br><small class="muted">${fmt(cost(CROP_INS))} each April. A drought year then pays ${Math.round(CROP_INS_YIELD * 100)}% of a normal crop instead of 30%.</small></span>
        <button class="sm ${B.ins ? '' : 'alt'}" id="cropins" aria-pressed="${!!B.ins}">${B.ins ? 'On' : 'Off'}</button></div>` : '';
    const herd = B.type === 'cattle' ? `<div class="kv"><span>Herd</span><span>${B.cows ?? CATTLE_COWS} cows${B.calves ? `, ${B.calves} calves` : ''}</span></div>
      <div class="kv"><span>Last check on the herd</span><span>${B.check == null ? 'never' : S.turn - B.check === 0 ? 'this week' : `${S.turn - B.check} week${S.turn - B.check === 1 ? '' : 's'} ago`}</span></div>
      <p class="muted" style="margin:4px 0">${herdChecked(6) ? 'The herd is doing fine.' : '⚠️ Nobody has checked the herd lately: pick 🎣 Get outside to ride out and look them over.'}</p>` : '';
    return `${B.stored ? firstTime('wheat') : ''}<div class="card" id="bizcard"><h3>🏪 Your business</h3><div class="kv"><span>${b.ic} ${b.name}<br><small class="muted">${b.desc}</small></span><span></span></div>
      <div class="kv"><span>Earned so far</span><span><b>${fmt(B.earned)}</b></span></div>${b.needs ? (() => { const y = B.yr && B.yr.y === new Date(S.date).getFullYear() ? B.yr.in : 0;   // i15-a04
        return `<div class="kv"><span>This season</span><span${y < 1 ? ' style="color:var(--down)"' : ''}><b>${fmt(y)}</b></span></div>${y < 1 ? `<p class="muted" style="margin:4px 0">${b.needs}</p>` : ''}`; })() : ''}
      <div class="kv"><span>Worth if you sell</span><span>${fmt(bizValue())}</span></div>${lease}${wheat}${herd}
      <button class="sm alt" id="bizsell">Sell the business</button></div>`; }
  return `${firstTime('biz')}<div class="card" id="bizcard"><h3>🏪 Start a business${newTag('biz')}</h3><p class="muted" style="margin:0 0 6px">Small, risky, and it can grow. One at a time.</p>
    ${bizTypes().map(k => [k, BIZ[k]]).map(([k,b]) => `<div class="kv job"><div><div class="t">${b.ic} ${b.name}</div><div class="s">${b.desc}</div></div><button class="sm" data-biz="${k}">${fmt(cost(b.cost))}</button></div>`).join('')}</div>`;
}
function startBiz(k){
  if (!BIZ[k] || !bizOn(k)) return;
  const b = BIZ[k], c = cost(b.cost);
  if (S.money < c) return toast(`You need ${fmt(c)} on hand.`);
  S.money -= c; S.biz = { type:k, weeks:0, earned:0, paidYear:null, dep:1, lease: k === 'wheat' ? LEASE_WEEKS : null, ...(k === 'cattle' ? { cows:CATTLE_COWS, check:S.turn } : {}) };
  if (k === 'wheat') {                             // i22-a04: a lease taken after March misses this year's crop (no farming bill, no August check)
    const y = new Date(S.date).getFullYear(); Object.assign(S.biz, { startTurn:S.turn, startMonth:curMonth(), leaseBase:BIZ.wheat.cost });
    if (curMonth() > 2) Object.assign(S.biz, { paidYear:y, farmYear:y, insYear:y });
  }
  adj({happy:3}); log(`Started a business: ${b.name.toLowerCase()}.`, 'money');
  save(); render(); toast(`${b.ic} You started a ${b.name.toLowerCase()}!`);
}
function sellBiz(){
  sellStoredWheat(' with the lease');
  const v = bizValue(), b = BIZ[S.biz.type]; S.money += v; log(`Sold the ${b.name.toLowerCase()} for ${fmt(v)}.`, 'money'); S.biz = null; S.bizSold = true; save(); render(); toast(`Sold for ${fmt(v)}`);
}

/* ============================================================
   💰 MONEY (ideas round 3): insurance, property tax, the valley's housing market, mortgage rates,
   borrowing against your home, index funds, wine futures, collections and bankruptcy
   ============================================================ */
const HOME_GROW = 0.025, BASE_RATE = 6.5, SELL_FEE = 0.06, REFI_FEE = 0.02, HE_SHARE = 0.5, HE_MONTHS = 120, PROP_TAX = 0.01;
const MKT = { good:0.12, bad:0.08, drop:0.25, badOdds:0.2 };     // index funds: about 6% a year on average
const WINE_COST = 2500, WINE_WEEKS = 156, WINERY = 'Old Kiln Cellars', BROKER = 'Clocktower Investments';
const WINE_Q = { great:{ x:1.5, t:'a great vintage, and the wine sold out' }, good:{ x:1.25, t:'a good, solid vintage' }, smoke:{ x:0.75, t:'wildfire smoke got into the grapes, and the wine sold cheap' } };
const COLLECT_WEEKS = 12, COLLECT_FEE = 150, COLLECT_HAPPY = 0.8, BK_WEEKS = 364, BK_PENALTY = 8, BK_RATE = 3;
const INS_PHONE = 75, INS_AUTO = { full:130, liab:55 }, INS_RENTERS = 15, INS_HOME = { fixer:95, farm:140 },   // i75-b26: Washington prices
  INS_HOME_DEF = 95, INS_DED = { 500:15, 1000:0, 2500:-10 }, AUTO_DED = 500, RENTERS_DED = 250;
const MONEY_STATE = () => ({ ins:{ auto:'full', renters:true, ded:1000, dental:false, amb:false }, homeIdx:1, homeGrow:HOME_GROW, rate:BASE_RATE, mortRate:null,
  heLeft:0, hePay:0, heRate:0, stocks:0, mkt:{ y:2027, bad:false, dropAt:null }, wine:[], smoke:null, wheatPrice:WHEAT_BASE,
  debtWeeks:0, debtUp:0, debtPrev:null, bk:null, ptaxDone:null, due:[], monKey:2027 * 12 });

/* ---- i3-a19: the insurance sheet. The defaults (full coverage, renters) add up to $220 a month with the phone (i75-b26). ---- */
// difficulty: below Hard everyone has the standard $220 plan (full vehicle coverage, renters or homeowners, the phone)
const STD_INS = { auto:'full', renters:true, ded:1000 };
const insOf = () => on('money.insuranceChoices') ? S.ins || {} : STD_INS;
function insParts(){
  const i = insOf(), own = !!HOMES[S.home].own, ded = INS_DED[i.ded] != null ? i.ded : 1000;
  return [['📱 Phone', INS_PHONE], [i.auto === 'liab' ? '🛻 Vehicle: liability only' : '🛻 Vehicle: full coverage', INS_AUTO[i.auto === 'liab' ? 'liab' : 'full']],
    own ? [`🏡 Homeowners ($${ded.toLocaleString('en-US')} deductible)`, (INS_HOME[S.home] ?? INS_HOME_DEF) + INS_DED[ded]] : [i.renters === false ? '🏠 No renters insurance' : '🏠 Renters insurance', i.renters === false ? 0 : INS_RENTERS], ...insExtras(),   // i74-a04/a08
    ...(own && i.wind === 'pct' ? [[`🌬️ Wind and hail: ${WIND_PCT * 100}% deductible`, -windSave()]] : []),   // i75-a13
    ...(S.ticketUntil > S.turn ? [['🚓 A speeding ticket on your record', TICKET_INS]] : [])];   // i26-b06
}
// i75-a13: a cheaper homeowners plan where wind and hail damage carries a deductible of 1% of the home's value
const WIND_PCT = 0.01, WIND_SAVE = 0.0015;
const windDed = () => Math.round(homeValue() * WIND_PCT);                       // today's dollars
const windSave = () => Math.round((HOMES[S.home].value || 0) * WIND_SAVE / 12);  // 2027 dollars a month, like the rest of insParts
const insMonthly = () => insParts().reduce((a, [, v]) => a + v, 0);
// what a loss costs you after insurance: 'auto' (your vehicle), 'home' (an owned house; a landlord covers a rented one), 'stuff' (your belongings)
function youPay(kind, c, cause){
  const i = insOf(), own = !!HOMES[S.home].own, ded = cost(INS_DED[i.ded] != null ? i.ded : 1000);
  if (kind === 'auto') return i.auto === 'liab' ? c : Math.min(c, cost(AUTO_DED));
  if (kind === 'home') return own ? Math.min(c, cause === 'wind' && i.wind === 'pct' ? Math.max(ded, windDed()) : ded) : 0;   // i75-a13
  return own ? Math.min(c, ded) : i.renters === false ? c : Math.min(c, cost(RENTERS_DED));
}
const covered = (c, paid) => paid < c - 0.5 ? ` Insurance covered ${fmt(c - paid)}.` : '';
function insSheet(focusSel){
  const i = S.ins, own = !!HOMES[S.home].own;
  const cur = grp => grp === 'wind' ? i.wind || 'flat' : i[grp];
  const opt = (grp, val, label) => `<button class="${String(cur(grp)) === String(val) ? 'on' : ''}" data-ins="${grp}" data-v="${val}" aria-pressed="${String(cur(grp)) === String(val)}">${label}</button>`;
  sheet(`<h2>🛡️ Insurance</h2><p class="muted">Through Wheatland Mutual on Main Street. Cheaper coverage saves a little every month, until something goes wrong.</p>${firstTime('ins')}
    <h3>🛻 Your vehicle</h3><div class="maptog" role="group" aria-label="Vehicle coverage">${opt('auto', 'full', `Full ${fmtc(INS_AUTO.full)}/mo`)}${opt('auto', 'liab', `Liability ${fmtc(INS_AUTO.liab)}/mo`)}</div>
    <p class="muted">Full coverage pays for crashes, deer, ditches and theft after a ${fmtc(AUTO_DED)} deductible. Liability only covers the other driver: your own repairs are on you.</p>
    ${own ? `<h3>🏡 Homeowners deductible</h3><div class="maptog" role="group" aria-label="Homeowners deductible">${[500, 1000, 2500].map(d => opt('ded', d, `$${d.toLocaleString('en-US')}`)).join('')}</div>
      <p class="muted">Storms, fires and break-ins: you pay up to the deductible, insurance pays the rest. A $500 deductible costs ${fmtc(INS_DED[500])} more a month; $2,500 saves ${fmtc(-INS_DED[2500])}.</p>
      <h3>🌬️ Wind and hail</h3><div class="maptog" role="group" aria-label="Wind and hail deductible">${opt('wind', 'flat', 'Same deductible')}${opt('wind', 'pct', `${WIND_PCT * 100}% of the home, ${fmtc(windSave())}/mo less`)}</div>
      <p class="muted">On the cheaper plan, a windstorm or hail claim costs you up to ${WIND_PCT * 100}% of what the house is worth: <b>${fmt(windDed())}</b> today, instead of your regular deductible. Fires and break-ins keep the regular one.</p>`
      : `<h3>🏠 Renters insurance</h3><div class="maptog" role="group" aria-label="Renters insurance">${opt('renters', true, `Yes ${fmtc(INS_RENTERS)}/mo`)}${opt('renters', false, 'No')}</div>
      <p class="muted">Your landlord insures the building, not your things. Renters insurance pays for a break-in or a fire after a ${fmtc(RENTERS_DED)} deductible.</p>`}
    <h3>🩺 Medical</h3><p class="muted">${healthMonthly() ? `Your health plan is ${fmtc(healthMonthly())}/mo, paid as its own Health care bill.` : 'Apple Health covers you for $0 right now.'} It doesn't cover teeth or the ambulance ride: those two are add-ons here.</p>
    <h3>🦷 Dental</h3><div class="maptog" role="group" aria-label="Dental coverage">${opt('dental', true, `Yes ${fmtc(DENTAL)}/mo`)}${opt('dental', false, 'No')}</div>
    <p class="muted">Yearly dentist checkups are free with it, and a cracked tooth costs ${fmtc(TOOTH_DENTAL)} instead of ${fmtc(TOOTH_BILL)}.</p>
    <h3>🚑 Ambulance district</h3><div class="maptog" role="group" aria-label="Ambulance district membership">${opt('amb', true, `Member ${fmtc(AMB_YEAR)}/yr`)}${opt('amb', false, 'No')}</div>
    <p class="muted">The volunteer ambulance's membership: members pay nothing for the ride on a hospital trip. Without it the ride is ${fmtc(AMB_RIDE)} on top of the stay.</p>
    ${insParts().map(([l, v]) => `<div class="kv"><span>${l}</span><span>${fmtc(v)}/mo</span></div>`).join('')}
    <div class="kv"><span><b>Insurance & phone</b></span><span><b>${wk(cost(insMonthly()))}</b></span></div>
    <button class="btn primary" id="ok">Done</button>`);
  document.querySelectorAll('#sheet [data-ins]').forEach(b => b.onclick = () => {
    const g = b.dataset.ins, v = b.dataset.v; S.ins[g] = ['renters', 'dental', 'amb'].includes(g) ? v === 'true' : g === 'ded' ? +v : v; save();
    insSheet(`[data-ins="${g}"][data-v="${v}"]`); announce(`Insurance and phone now ${wk(cost(insMonthly()))}.`);
  });
  $('#ok').onclick = () => { closeSheet(); render(); };
  if (focusSel) setTimeout(() => { const el = $('#sheet ' + focusSel); if (el) el.focus({ preventScroll: true }); }, 40);
}

/* ---- i3-a21 / a22 / a20 / a23: the housing market, mortgage rates, property tax and home equity loans ---- */
const MOODS = { hot:{ ic:'🔥', name:'Hot', desc:'buyers are lining up and prices are climbing', buy:1.05 },
  steady:{ ic:'🏡', name:'Steady', desc:'prices are creeping up like usual', buy:1 },
  slow:{ ic:'🧊', name:'Slow', desc:'houses are sitting and prices are slipping', buy:0.97 } };
const homeMood = () => !on('home.market') ? 'steady' : S.homeGrow >= 0.05 ? 'hot' : S.homeGrow <= 0 ? 'slow' : 'steady';
const homePriceF = () => (S.homeIdx || 1) * MOODS[homeMood()].buy;          // a hot year costs more to buy into
const homeValue = (k = S.home) => HOMES[k].value ? HOMES[k].value * (S.homeIdx || 1) : 0;
const payF = (rate, months = 360) => { const i = rate / 1200; return i / (1 - Math.pow(1 + i, -months)); };
const buyRate = () => S.rate + (bkActive() ? BK_RATE : 0);
const homeDown = k => Math.round(HOMES[k].down * homePriceF());
const newMortgage = k => HOMES[k].cost * homePriceF() * payF(buyRate()) / payF(BASE_RATE);
const propTax = () => on('home.propertyTax') ? homeValue() * PROP_TAX / 2 : 0;                              // twice a year, April and October
const canRefi = () => !!(on('home.loans') && HOMES[S.home].own && S.mortgage && !loanBlock() && S.rate <= (S.mortRate ?? BASE_RATE) - 1);
const refiFee = () => homeValue() * REFI_FEE;
const refiPay = () => S.mortgage * payF(S.rate) / payF(S.mortRate ?? BASE_RATE);
function refinance(){
  if (!canRefi()) return false;
  const fee = refiFee(); if (S.money < fee) { toast(`You need ${fmt(fee)} for closing costs.`); return false; }
  const old = S.mortgage; S.money -= fee; S.mortgage = refiPay(); S.mortRate = S.rate;
  log(`Refinanced the mortgage at ${S.rate.toFixed(2)}%: ${wk(old)} down to ${wk(S.mortgage)} (closing costs ${fmt(fee)}).`, 'money');
  return true;
}
const heI = () => S.heRate / 1200;
const heBalance = () => S.heLeft > 0 && S.hePay ? S.hePay * (1 - Math.pow(1 + heI(), -S.heLeft)) / heI() : 0;
const heMax = () => HOMES[S.home].own && on('home.loans') ? Math.floor(Math.max(0, S.equity * HE_SHARE) / 500) * 500 : 0;
function takeHE(amount){
  if (!HOMES[S.home].own || S.heLeft > 0 || loanBlock() || !(amount > 0) || amount > heMax()) return false;
  S.heRate = S.rate + 1; S.hePay = amount * payF(S.heRate, HE_MONTHS); S.heLeft = HE_MONTHS; S.money += amount;
  log(`Borrowed ${fmt(amount)} against the house from Standard Bearer Bank at ${S.heRate.toFixed(2)}% (${wk(S.hePay)} for 10 years).`, 'money');
  return true;
}
function heSheet(){
  const max = heMax(), half = Math.floor(max / 2 / 500) * 500, r = S.rate + 1;
  sheet(`<h2>🏦 Borrow against your home</h2><p>Standard Bearer Bank lends up to half your equity at ${r.toFixed(2)}%, paid back over 10 years. It's cheaper than carrying debt at 1.5% a month, and it can start a business or pay for school.</p>
    <p class="muted">What you borrow counts against your net worth until it's paid back. Selling the house pays off what's left.</p>
    ${[half, max].filter((v, i, a) => v > 0 && a.indexOf(v) === i).map(v => `<button class="btn primary" data-he="${v}">Borrow ${fmt(v)} (${wk(v * payF(r, HE_MONTHS))} for 10 years)</button>`).join('')}
    <button class="btn ghost" id="no">Not now</button>`);
  document.querySelectorAll('#sheet [data-he]').forEach(b => b.onclick = () => { if (takeHE(+b.dataset.he)) { closeSheet(); save(); render(); toast(`🏦 Borrowed ${fmt(+b.dataset.he)}`); } });
  $('#no').onclick = closeSheet;
}
// the home card's money lines on the Life tab
function homeMoneyHTML(){
  const own = !!HOMES[S.home].own, md = MOODS[homeMood()], blk = loanBlock();
  const mk = on('home.market');   // to-do 2: Easy has no market or rate changes, Easy and Normal no home loans
  return `${mk ? `<div class="kv"><span>${md.ic} Housing market: <b>${md.name}</b><br><small class="muted">This year ${md.desc}${md.buy !== 1 ? ` (buying costs ${md.buy > 1 ? 'more' : 'less'})` : ''}.</small></span><span>${S.homeGrow >= 0 ? '+' : ''}${(S.homeGrow * 100).toFixed(1)}%/yr</span></div>
    <div class="kv"><span>🏦 Mortgage rate this year${bkActive() ? ' (+3 points after bankruptcy)' : ''}</span><span>${buyRate().toFixed(2)}%</span></div>` : ''}
    ${own ? `<div class="kv"><span>Your house is worth</span><span>${fmt(homeValue())}</span></div>
      <div class="kv"><span>Your mortgage rate</span><span>${(S.mortRate ?? BASE_RATE).toFixed(2)}%</span></div>
      ${on('home.propertyTax') ? `<div class="kv"><span>🧾 Property tax (April and October)</span><span>${fmt(propTax())} each</span></div>` : ''}
      ${S.heLeft > 0 ? `<div class="kv"><span>🏦 Home equity loan<br><small class="muted">${Math.ceil(S.heLeft / W)} weekly payments left</small></span><span>${wk(S.hePay)} · owe ${fmt(heBalance())}</span></div>` : ''}
      ${canRefi() ? `<div class="card tip" style="margin:6px 0">📉 Rates dropped to ${S.rate.toFixed(2)}%. Refinancing would cut your payment to ${wk(refiPay())} for ${fmt(refiFee())} in closing costs (it pays off in about ${Math.ceil(refiFee() / Math.max(1, S.mortgage - refiPay()))} months). <button class="sm" id="refi">Refinance</button></div>` : ''}
      ${!S.heLeft && heMax() >= cost(2000) ? (blk ? `<p class="muted">🏦 ${blk}</p>` : `<button class="btn ghost" id="heloan">🏦 Borrow against your home (up to ${fmt(heMax())})</button>`) : ''}` : ''}`;
}

/* ---- i3-a29: index funds, and i3-a17: wine futures ---- */
const wineAtCost = () => (S.wine || []).reduce((a, l) => a + (l.paid || 0), 0);
const wineYear = () => new Date(S.date).getFullYear();
const wineOpen = () => on('money.index') && [8, 9, 10].includes(curMonth()) && !(S.wine || []).some(l => l.y === wineYear());
function buyWine(){
  if (!wineOpen()) return false;
  const c = cost(WINE_COST); if (S.money < c) { toast(`You need ${fmt(c)} on hand.`); return false; }
  S.money -= c; S.wine.push({ y: wineYear(), paid: c, at: S.turn + WINE_WEEKS, smoke: S.smoke === wineYear(), dry: !!(S.wx && S.wx.y === wineYear() && S.wx.dry && S.smoke !== wineYear()) });
  log(`Bought into the ${wineYear()} vintage at ${WINERY} for ${fmt(c)}. It pays out when the wine is released in ${wineYear() + 3}.`, 'money');
  return true;
}
function invest(amount){
  amount = Math.round(amount);
  if (amount > 0 && !on('money.index')) return false;
  if (amount > 0) { if (S.money < amount) { toast(`You need ${fmt(amount)} on hand.`); return false; } S.money -= amount; S.stocks = (S.stocks || 0) + amount; }
  else { const v = Math.min(S.stocks || 0, -amount); if (!(v > 0)) return false; S.stocks -= v; S.money += v; if (S.stocks < 1) S.stocks = 0; }
  return true;
}
// i72-b03/b05: this week's regular bills (rent, food, insurance, gas and the rest), a month of them, and how long cash lasts
const weekBills = () => Math.max(1, -billLines().reduce((a, l) => a + l[1], 0));
const monthBills = () => weekBills() * 52 / 12;
const cashWeeks = (cash = S.money) => Math.max(0, Math.floor(cash / weekBills()));
// i72-b05: investing that would leave under a month of bills in cash asks first; returns the question, or '' when it's fine
function investWorry(amount){
  if (!(amount > 0) || S.money < amount) return '';
  const left = S.money - amount;
  return left < monthBills() ? `That leaves ${fmt(left)}, about ${cashWeeks(left)} week${cashWeeks(left) === 1 ? '' : 's'} of bills. Invest anyway?` : '';
}
function investCard(){
  if (!on('money.index')) return '';               // difficulty: index funds and wine futures are Normal and up
  const y = wineYear(), m = S.mkt && S.mkt.y === y ? S.mkt : null, dropped = m && m.dropped, thin = S.money < monthBills();
  return `${firstTime('invest')}<div class="card"><h3>📈 Investing</h3>
    <div class="kv"><span>Index funds at ${BROKER}, Walla Walla<br><small class="muted">About 6% a year on average, but some years drop 20% or more. Counts in net worth at today's value.</small></span><span><b>${fmt(S.stocks || 0)}</b></span></div>
    ${dropped ? `<p class="muted" style="margin:2px 0">📉 The market dropped this year. It usually comes back for people who wait.</p>` : ''}
    <div class="maptog wrap" role="group" aria-label="Index funds">
      <button data-inv="1000" aria-label="Put $1,000 into index funds"${thin ? ' disabled aria-describedby="invthin"' : ''}>+$1,000</button><button data-inv="5000" aria-label="Put $5,000 into index funds"${thin ? ' disabled aria-describedby="invthin"' : ''}>+$5,000</button>${S.stocks > 0 ? `<button data-inv="-1000" aria-label="Take $1,000 out of index funds">−$1,000</button><button data-inv="all" aria-label="Sell all your index funds">Sell all</button>` : ''}</div>
    ${thin ? `<p class="muted" id="invthin" style="margin:2px 0">💵 Keep a month of bills (about ${fmt(monthBills())}) in cash before you invest: debt costs more than funds earn.</p>` : ''}
    <div class="kv"><span>🍷 Wine futures at ${WINERY}<br><small class="muted">Buy into a vintage in the fall for ${fmtc(WINE_COST)}; it pays out when the wine is released 3 years later: more for a great year, less if smoke got the grapes. Counted at what you paid until then.</small></span><span></span></div>
    ${(S.wine || []).map(l => `<div class="kv"><span>${l.y} vintage${l.smoke ? ' (a smoky summer)' : ''}</span><span>${fmt(l.paid)} · released in ${Math.max(1, Math.ceil((l.at - S.turn) / 4.33))} mo</span></div>`).join('')}
    ${wineOpen() ? `${S.smoke === y ? '<p class="muted" style="margin:2px 0">🔥 Wildfire smoke hung over the vineyards this summer: this vintage is a gamble.</p>' : ''}<button class="sm" id="wine">Buy into the ${y} vintage (${fmtc(WINE_COST)})</button>`
      : `<p class="muted" style="margin:2px 0">${(S.wine || []).some(l => l.y === y) ? `You're in on the ${y} vintage.` : 'Futures go on sale each fall (September to November).'}</p>`}
  </div>`;
}

/* ---- the money side of each week ---- */
// the first week of each month: a new year's market, wheat prices, and the summer's smoke
function moneyMonth(notes){
  const d = new Date(S.date), y = d.getFullYear(), mo = d.getMonth(), key = y * 12 + mo;
  wxEnsure();
  if (S.monKey === key) return; S.monKey = key;
  if (!S.mkt || S.mkt.y !== y) {                                   // New Year: home prices, mortgage rates and the stock market
    if (on('home.market')) { S.homeGrow = HOME_GROW + (Math.random() - 0.5) * 0.12;   // to-do 2: Easy keeps homes and rates as listed
    S.rate = Math.round(clamp(S.rate + (BASE_RATE - S.rate) * 0.3 + (Math.random() - 0.5) * 2, 4, 9.5) * 4) / 4; }
    const bad = on('money.index') && chance(MKT.badOdds); S.mkt = { y, bad, dropAt: bad ? S.turn + ri(8, 40) : null };
  }
  const wheat = S.biz && S.biz.type === 'wheat';
  if (mo === 6) {                                                   // July: the new crop's price, and the old crop has to go
    if (wheat && S.biz.stored) { const v = sellStoredWheat(' when the new crop came in'); notes.push(`🌾 The new crop is coming, so the elevator sold your stored wheat: ${fmt(v)}.`); }
    S.wheatPrice = WHEAT_BASE * (0.8 + Math.random() * 0.4);
    if (wxSmoke()) S.smoke = y;                                    // i75-a01: the year's weather
  } else if (wheat && S.biz.stored) S.wheatPrice *= 1 + 0.012 + (Math.random() - 0.5) * 0.1;
}
function moneyWeek(lines, notes){
  moneyMonth(notes);
  const home = HOMES[S.home], d = new Date(S.date), key = `${d.getFullYear()}-${d.getMonth()}`;
  if (home.own && [3, 9].includes(d.getMonth()) && S.ptaxDone !== key && on('home.propertyTax')) { S.ptaxDone = key; lines.push(['Property tax (county)', -propTax()]); }
  if (S.heLeft > 0) {
    const n = Math.min(W, S.heLeft); lines.push(['Home equity loan', -S.hePay * n]); S.heLeft -= n;
    if (S.heLeft < 1e-6) { S.heLeft = 0; S.hePay = 0; notes.push('🏦 Your home equity loan is paid off!'); S.paidOff = true; log('Paid off the home equity loan.'); }
  }
  if (S.mkt && S.stocks > 0) S.stocks *= Math.pow(1 + (S.mkt.bad ? MKT.bad : MKT.good), 1/52);
  if (S.mkt && S.mkt.dropAt != null && !S.mkt.dropped && S.turn >= S.mkt.dropAt) {
    S.mkt.dropped = true;
    if (S.stocks > 0) { S.mkt.lost = S.stocks * MKT.drop; S.stocks -= S.mkt.lost; if (S.noEvents) notes.push(`📉 The market dropped: your index funds lost ${fmt(S.mkt.lost)}.`); else dueEvent('Market drop'); }
  }
  for (const l of (S.wine || []).filter(l => S.turn >= l.at)) {
    const r = Math.random(), q = l.smoke ? (r < 0.1 ? 'great' : r < 0.5 ? 'good' : 'smoke') : l.dry ? (r < 0.4 ? 'great' : r < 0.9 ? 'good' : 'smoke') : (r < 0.25 ? 'great' : r < 0.8 ? 'good' : 'smoke');   // i75-a01: a hot, dry, clean summer makes big wine
    const v = l.paid * WINE_Q[q].x; lines.push([`🍷 ${l.y} vintage released`, v]);
    notes.push(`🍷 ${WINERY} released the ${l.y} vintage: ${WINE_Q[q].t}. Your share paid ${fmt(v)} on the ${fmt(l.paid)} you put in.`);
    log(`The ${l.y} vintage at ${WINERY} paid ${fmt(v)}.`, 'money');
  }
  S.wine = (S.wine || []).filter(l => S.turn < l.at);
}

/* ---- i3-a26: collections, and i3-a27: bankruptcy instead of leaving town ---- */
const inCollections = () => (S.debtWeeks || 0) > COLLECT_WEEKS;
const PLAN_WEEKS = 4, onPlan = () => inCollections() && (S.debtUp || 0) >= PLAN_WEEKS;   // i75-b22
const bkActive = () => S.bk != null && S.turn - S.bk < BK_WEEKS;
const canBankrupt = () => S.bk == null && !S.practice && mode() !== 'relaxed' && on('money.bankruptcy');
function loanBlock(){
  if (bkActive()) return `After the bankruptcy, no bank will lend to you until ${new Date(S.date + (BK_WEEKS - (S.turn - S.bk)) * 7 * 864e5).getFullYear()}.`;
  if (inCollections()) return 'With debt in collections, the bank turns you down until you\'re back above $0.';
  return '';
}
function debtWeek(notes){
  if (!on('money.collections')) return;            // difficulty: below Hard, debt only charges interest
  if (S.money < 0) {
    S.debtWeeks = (S.debtWeeks || 0) + 1;
    if (S.debtWeeks === COLLECT_WEEKS + 1) {
      lateLine('📞 Collections fee', -cost(COLLECT_FEE), `Your debt went to collections after ${COLLECT_WEEKS} weeks below $0.`);   // i71-b05
      notes.push(`📞 After ${COLLECT_WEEKS} weeks in debt, it went to collections: a ${fmtc(COLLECT_FEE)} fee and calls every day. Banks and bosses will see it until you're back above $0.`);
      log('The debt went to collections.', 'money');
    }
    // i75-b22: cash up 4 weeks in a row counts as a payment plan, and the calls stop
    const was = onPlan();
    S.debtUp = S.debtPrev != null && S.money > S.debtPrev + 0.5 ? (S.debtUp || 0) + 1 : 0;
    if (inCollections() && !was && onPlan()) notes.push(`📞 ${PLAN_WEEKS} weeks of paying it down: collections put you on a payment plan, and the calls stop while you keep it up.`);
    if (inCollections() && !onPlan()) adj({ happy: -COLLECT_HAPPY });
  } else { if (S.debtWeeks && inCollections()) log('Paid off the collections account: back above $0.', 'money'); S.debtWeeks = 0; S.debtUp = 0; }
  S.debtPrev = S.money;
}
function fileBankruptcy(){
  const lost = [];
  if (S.stocks > 0) lost.push(`${fmt(S.stocks)} in index funds`);
  if ((S.wine || []).length) lost.push('your wine futures');
  if (S.biz) lost.push(`the ${BIZ[S.biz.type].name.toLowerCase()}`);
  if (S.car !== 'beater') lost.push(`the ${CARS[S.car].name.toLowerCase().replace(' (financed)', '')}`);
  S.stocks = 0; S.wine = []; S.biz = null;
  if (S.car !== 'beater') { S.car = 'beater'; S.carValue = cost(2500); S.loanLeft = 0; S.loanPay = 0; S.tires = null; S.svc = S.turn; }
  S.money = 0; S.debtWeeks = 0; S.bk = S.turn; S.due = (S.due || []).filter(t => t !== 'Harvest: sell or store?' && t !== 'Market drop');
  adj({ happy: -8, community: -4 });
  log(`Filed for bankruptcy at the courthouse in Walla Walla. The debt is gone${lost.length ? `, and so is ${lost.join(', ')}` : ''}.`, 'money');
  return lost;
}
function bankruptcySheet(reason){
  const keep = [S.stocks > 0 && `${fmt(S.stocks)} in index funds`, (S.wine || []).length && 'your wine futures', S.biz && `your ${BIZ[S.biz.type].name.toLowerCase()}`,
    S.car !== 'beater' && `your ${CARS[S.car].name.toLowerCase().replace(' (financed)', '')} (you'd get a 1998 pickup)`].filter(Boolean);
  sheet(`<div class="big">⚖️</div><h2 style="text-align:center">Buried in debt</h2>
    <p>You owe ${fmt(-S.money)}, more than you can ever dig out of. You can pack up and leave Waitsburg, which ends this life, or file for bankruptcy and stay.</p>
    <div class="card warn"><b>Bankruptcy:</b> the debt is wiped${keep.length ? `, but you lose ${keep.join(', ')}` : ''}. Your 401(k) and your home are protected. For 7 years no bank will lend to you, and the better-paying jobs are harder to land. It takes ${BK_PENALTY} points off your Life Score, and you can only do it once.</div>
    <button class="btn primary" id="bkfile">File for bankruptcy and stay</button>
    <button class="btn ghost" id="bkleave">Pack up and leave town</button>`);
  $('#bkfile').onclick = () => { fileBankruptcy(); S.endPending = null; closeSheet(); save(); render(); announce('You filed for bankruptcy. The debt is gone, and you start over at $0.'); toast('⚖️ A fresh start, with a long memory'); };
  $('#bkleave').onclick = () => { closeSheet(); finish(reason, { debt: true }); };
}
// events that have to come up this week (the harvest choice, a market drop), ahead of the random roll
function dueEvent(title){ S.due = [...(S.due || []).filter(t => t !== title), title]; }
function takeDue(){
  while (S.due && S.due.length) { const e = DUE_EVENTS.find(x => x.title === S.due[0]); S.due.shift(); if (e && (!e.when || e.when())) return e; }
  return null;
}

/* ============================================================
   📅 WEEKLY CHALLENGE (#75): everyone gets the same dice this week; and 📤 a shareable score card
   ============================================================ */
const NATIVE_RANDOM = Math.random;
// the week is counted in UTC, so friends in different time zones are on the same week (R9)
const isoWeek = (d = new Date()) => { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0')}`; };
const weekSeed = w => [...w].reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
// a seeded life keeps its dice in S.rng, so it plays the same however often it's saved and continued
// one step of the mulberry32 dice: returns [next state, a number from 0 to 1]
const diceStep = a => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return [a, ((t ^ t >>> 14) >>> 0) / 4294967296]; };
function useDice(){
  if (S && S.rng != null) Math.random = () => { const [a, v] = diceStep(S.rng | 0); S.rng = a; return v; };
  else Math.random = NATIVE_RANDOM;
}
// R8: a seeded life rolls its events (whether one comes, and which) with separate dice, reseeded each week from
// S.rngEv and the week number, so the same events come in the same weeks whatever anyone chose before.
// Returns { done() } to switch back to the everyday dice.
function eventDice(){
  if (!S || S.rngEv == null) return { done(){} };
  const prev = Math.random; let a = weekSeed(`${S.rngEv}:${S.turn}`);
  Math.random = () => { const [n, v] = diceStep(a); a = n; return v; };
  return { done(){ Math.random = prev; } };
}
// i73-b11: the weekly challenge has its own place, so it never needs one of the 5 slots (a new start replaces this week's)
function startWeekly(name){
  if (S && !S.over && S.slot !== WEEKLY_SLOT) save();
  newGame(name, 'half', WEEKLY_SLOT, { bg:'fresh', diff:'normal', weekly: isoWeek() });   // to-do 2 D2: the weekly is always a Normal life
}
function scoreCard(){
  const { score, title } = lifeScore(), c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const g = c.getContext('2d');
  g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, 1080, 1350); g.fillStyle = '#9b2f1f'; g.fillRect(0, 0, 1080, 260);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 110px Georgia, serif'; g.fillText('The Burg', 540, 170);
  faceCanvas(g, 40, 40, 180);                      // i6-b01: your portrait, as you look at the end
  g.fillStyle = '#3d2b1f'; g.font = '600 52px system-ui, sans-serif'; g.fillText(`${S.name}'s life in Waitsburg`, 540, 380);
  g.font = '40px system-ui, sans-serif'; g.fillStyle = '#6b5b4e';
  g.fillText(`${LENGTHS[S.len].label} · ${diffName()}${S.classic && mode() !== 'normal' ? ` (${MODES[mode()].name})` : ''}${S.weekly ? ` · Weekly challenge ${S.weekly}` : ''}`, 540, 450);   // D7: the difficulty
  g.fillStyle = '#9b2f1f'; g.font = 'bold 300px Georgia, serif'; g.fillText(String(score), 540, 810);
  g.fillStyle = '#3d2b1f'; g.font = '600 60px system-ui, sans-serif'; g.fillText(title, 540, 900);
  g.font = '40px system-ui, sans-serif'; g.fillStyle = '#6b5b4e';
  { const back = comebackLine(), a = AIMS[S.aim] || AIMS.all;   // i63-a20 the comeback, i20-b01 the aim, i20-b05 good weeks
    g.font = 'italic 38px Georgia, serif'; if (back) g.fillText(back, 540, 955);
    g.font = '36px system-ui, sans-serif'; g.fillText(`${on('score.aims') ? `${a.ic} ${a.name} · ` : ''}${S.goodWeeks || 0} of ${tallyWeeks()} good weeks`, 540, 510); g.font = '40px system-ui, sans-serif'; }
  const bs = BADGES.filter(b => S.badges && S.badges[b.id]).map(b => b.ic).join(' ');
  if (bs) g.fillText(bs, 540, 1010);
  g.fillText(`Age ${age()} · ${EDU[S.edu]} · ${fmt(netWorth())}`, 540, 1100);
  // i2-a29: a few highlights from the life story
  const hl = lifeStory().rows.filter(r => r.age != null).flatMap(r => r.text.map(t => `${r.year}: ${t}`)).filter(t => !/^\d+: Earned a badge/.test(t));
  const few = hl.length > 2 ? [hl[0], hl[hl.length - 1]] : hl;
  g.font = '30px system-ui, sans-serif';
  few.forEach((t, i) => g.fillText(t.length > 52 ? t.slice(0, 50) + '…' : t, 540, 1160 + i * 42));
  g.fillStyle = '#9b2f1f'; g.font = '600 44px system-ui, sans-serif'; g.fillText('krazow.github.io/The-Burg', 540, 1260);
  return c;
}
// i73-b18: a short line of text goes with the picture (Messages and Facebook show it under the picture)
const weekOf = w => { const m = /^(\d{4})-W(\d\d)$/.exec(w || ''); if (!m) return w; const j4 = new Date(Date.UTC(+m[1], 0, 4)), d = new Date(j4 - ((j4.getUTCDay() || 7) - 1) * 864e5 + (+m[2] - 1) * 7 * 864e5); return `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`; };
// D7: "a 2-year life on Easy", "a lifetime on Hard", "a 2-year life (Classic)"
function lifeWords(){
  const L = { half: '6-month', two: '2-year', five: '5-year' }[S.len];
  return `${L ? `a ${L} life` : 'a lifetime'}${shelfOf() === 'classic' ? ' (Classic)' : ` on ${DIFFS[diff()].label}`}`;
}
function shareText(){
  const { score, title } = lifeScore();
  return `${S.name} scored ${score}, ${title}, in ${lifeWords()} in The Burg${S.weekly ? ` (Weekly challenge, week of ${weekOf(S.weekly)})` : ''}. krazow.github.io/The-Burg`;
}
async function shareCard(){
  const c = scoreCard(), blob = await new Promise(r => c.toBlob(r, 'image/png')), name = `the-burg-${S.name.replace(/\W+/g, '-').toLowerCase()}.png`, text = shareText();
  if (await shareFile(blob, name, 'My life in The Burg', text) !== 'saved') return;   // i59-a20: the share sheet where there is one
  toast('Score card saved');
  // where a picture can't be shared, the words can still be copied to post with it
  const sh = $('#share');
  if (sh && !$('#sharetext')) {
    sh.insertAdjacentHTML('afterend', `<button class="btn ghost" id="sharetext">📋 Copy the text to go with it</button><p class="muted hidden" id="sharetextout"></p>`);
    $('#sharetext').onclick = async () => {
      let ok = false; try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {}
      const o = $('#sharetextout'); o.classList.remove('hidden'); o.textContent = ok ? `Copied: “${text}”` : text;
      announce(ok ? 'Text copied' : 'Text shown: select and copy it');
    };
  }
}

/* ============================================================
   🌳 LEGACY MODE (#76): when a Lifetime game ends, play on as your grandkid (18, since you passed in your 80s: R6)
   ============================================================ */
const ROMAN = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
const toRoman = n => ROMAN.reduce((out, [v, r]) => { while (n >= v) { out += r; n -= v; } return out; }, '');
const fromRoman = r => { let n = 0; for (let i = 0; i < r.length; i++) { const v = { I:1, V:5, X:10 }[r[i]], nx = { I:1, V:5, X:10 }[r[i+1]] || 0; n += v < nx ? -v : v; } return n; };
// R5: Ann Lee → Ann Lee II → Ann Lee III, kept within 20 characters
function heirName(name){
  let base = String(name || 'Dusty').trim(), n = 1;
  const m = base.match(/^(.*\S)\s+([IVX]+)$/);
  if (m && toRoman(fromRoman(m[2])) === m[2] && fromRoman(m[2]) >= 2) { base = m[1]; n = fromRoman(m[2]); }
  else if (/\s+Jr\.?$/.test(base)) { base = base.replace(/\s+Jr\.?$/, ''); n = 2; }
  const suffix = ' ' + toRoman(Math.min(39, n + 1));
  return base.slice(0, 20 - suffix.length).trim() + suffix;
}
// i3-a33: what the will (or the lack of one) means for the grandkid
function legacyWillLine(p){
  const inh = inheritance(p);
  // the tip card is a flex row: one wrapper keeps the sentence in one block, so it doesn't wrap into a narrow column
  return inh.will ? `<div class="card tip"><div>📜 <b>${esc(p.name)} left a will.</b> ${fmt(inh.now)} passes right away${inh.home ? `, and so does the ${HOMES[inh.home].name.toLowerCase()}` : ''}.</div></div>`
    : `<div class="card warn">⚖️ <b>No will.</b> ${inh.later > 0 ? `${HOMES[p.home] && HOMES[p.home].own ? 'The house is sold, and p' : 'P'}robate takes ${fmt(inh.cut)} and about 6 months: ${fmt(inh.later)} arrives after 26 weeks.` : 'There\'s nothing to pass on.'}</div>`;
}
// pick (or type) the grandkid's name before the next generation starts
function legacySheet(parent){
  const sugg = heirName(parent.name);
  sheet(`<div class="big">🌳</div><h2 style="text-align:center">Continue as your grandkid</h2>
    <p>${esc(parent.name)}'s grandkid just turned 18 and is staying in Waitsburg, with part of the family's savings and a name people know around town.</p>
    ${legacyWillLine(parent)}
    <label class="field" for="heirnm">Your grandkid's name</label>
    <input type="text" id="heirnm" maxlength="20" value="${esc(sugg)}" autocomplete="off">
    <button class="btn primary" id="heirgo">Start the next generation</button>
    <button class="btn ghost" id="no">Not now (back to the title screen)</button>`);
  $('#heirgo').onclick = () => { const nm = ($('#heirnm').value.trim() || sugg).slice(0, 20); closeSheet(); startLegacy(parent, nm); };
  $('#no').onclick = () => { closeSheet(); S = null; useDice(); renderTitle(); };   // i60-a13: the grandkid keeps waiting on the title screen
}
function startLegacy(parent, name = heirName(parent.name)){
  const inh = inheritance(parent);                 // i3-a33: the will decides how (and when) the family's money arrives
  name = String(name).slice(0, 20);
  const all = slots(), slot = all[parent.slot ?? 0] == null ? parent.slot ?? 0 : all.indexOf(null);
  if (slot < 0) { S = null; useDice(); renderTitle(); return toast(`All ${SLOT_COUNT} slots are full: delete a life first, and your grandkid is still waiting.`); }
  if (parent.id) setHeirs(heirs().filter(p => p.id !== parent.id));
  newGame(name, 'life', slot, { bg:'fresh', mode:parent.mode, diff:parent.diff, classic:parent.diff === undefined || !!parent.classic, aim:parent.aim });   // to-do 2 D1: the heir keeps the difficulty (Classic from an older record)
  S.line = Array.isArray(parent.line) ? parent.line.slice(-40) : [];   // i73-b25
  S.gen = (parent.gen || 1) + 1; S.community = clamp(Math.round(parent.community / 2) + 15);
  // i8-a01: the grandkid is 18 about 60 years after the grandparent was born (never earlier than the day the life ended)
  const born = Number.isFinite(parent.ageMonths) ? new Date(parent.date).getFullYear() - Math.floor(parent.ageMonths / 12) : null;
  S.date = born == null ? parent.date : Math.max(parent.date, new Date(born + 60, 0, 4).getTime()); S.col = parent.col; S.wage = parent.wage; S.tabsYear = new Date(S.date).getFullYear();
  S.carValue = cost(2500);                         // i30-b01: the old pickup is worth a starter truck in today's dollars
  if (inh.will) {
    S.money = inh.now;
    if (inh.home) { S.home = inh.home; S.equity = parent.equity || 0; S.mortgage = parent.mortgage || cost(HOMES[inh.home].cost); }
  } else if (inh.later > 0) S.probate = { amt: inh.later, at: S.turn + PROBATE_WEEKS, from: parent.name };
  S.yearStart = { nw: netWorth(), happy: S.happy, health: S.health, community: S.community };
  S.badges = {}; S.log = [];
  log(inh.will ? `${name} turns 18 and picks up where grandparent ${parent.name} left off, with ${fmt(inh.now)} from the family${inh.home ? `, the family's ${HOMES[inh.home].name.toLowerCase()}` : ''} and a name people know around town. The will made it simple.`
    : `${name} turns 18 and picks up where grandparent ${parent.name} left off, with a name people know around town. There was no will: ${inh.later > 0 ? `probate takes ${fmt(inh.cut)} and about 6 months before ${fmt(inh.later)} comes through` : 'there was nothing left to pass on'}.`);
  save(); render(); toast(`🌳 Generation ${S.gen}: ${name}`);
}

/* ---------- 🏆 Life Score so far (#67) ---------- */
// R16, to-do 2 D7: each difficulty's scores are kept on their own shelf; a life from before difficulty modes is Classic
function modeScoreNote(){
  if (S.practice) return '';
  if (shelfOf() === 'classic') return `<p class="muted modenote" style="text-align:center">🏛️ <b>Classic score.</b> This life began before Easy, Normal and Hard, so it goes on its own Classic shelf.</p>`;
  return `<p class="muted modenote" style="text-align:center">${shelfName(diff())} <b>score.</b> Easy, Normal and Hard scores each have their own shelf, and they are not compared.</p>`;
}
// B10: how far through the game you are (Lifetime: age 18 to 65), for an "on track" net-worth target
function gameProgress(){
  const L = LENGTHS[S.len];
  return L.turns === Infinity ? lifeProgress() : clamp(S.turn / L.turns, 0, 1);
}
function wealthTrack(real){
  const p = gameProgress(), want = lenTarget() * p;
  if (p < 0.02) return '';
  const ok = real >= want;
  return `<div class="kv"><span>${ok ? '✅' : '⏳'} Net worth on track?<br><small class="muted">By now (${Math.round(p * 100)}% of the way) you'd want about ${fmt(want)} in ${term('dollars')}</small></span><span><b>${ok ? 'On track' : `${Math.round(real / want * 100)}% there`}</b></span></div>`;
}
function scoreButton(){
  if (S.practice ? !TUT : !isOpen('score')) return '';   // i31: opens as you go; i44-b05: the tutorial shows how the score adds up
  const sc = lifeScore(), d = S.scoreQ == null ? 0 : sc.score - S.scoreQ;
  const title = S.turn < 4 ? 'Just getting started' : sc.title;   // i5-a02: no verdict in the first weeks
  return `<button class="scorebtn" id="scorenow" aria-label="Life Score so far ${sc.score}, ${title}: see how it adds up${isNew('score') ? '. New' : ''}">
    <span>🏆 Life Score so far${newTag('score')}</span><span><b>${sc.score}</b> ${title}${S.scoreQ != null && d ? ` <span class="delta ${d>0?'up':'down'}">${d>0?'▲':'▼'}${Math.abs(d)}</span>` : ''} ›</span></button>`;
}
const SCORE_TIPS = {
  happy:'Happiness is your weakest part. Rest, Get outside and trips with friends help; long commutes, overtime and debt hurt.',
  health:'Health is your weakest part. Rest, Get outside and a doctor checkup help; physical jobs and overtime wear you down.',
  community:'Community is your weakest part. Show up for town, help in events, work in Waitsburg, or join a carpool.',
  wealth:'Net worth is your weakest part. A better-paying job, the 401(k), owning a home and stock-up grocery runs add up.',
  wealthEasy:'Net worth is your weakest part. A better-paying job, owning a home and stock-up grocery runs add up.',
  debt:'Debt is costing you the most. Every week below -$1,000 counts against you, and getting back to $0 by the end wins most of it back: steady work, fewer trips and paying down the card come first.',
  debtNW:'Debt is costing you the most. Net worth below $0 pulls your score down, and getting back to $0 by the end wins most of it back: steady work, fewer trips and paying down the card come first.'
};
const PART_NAMES = { happy:'Happiness', health:'Health', community:'Community', wealth:'Net worth' };
// i20-b05: the good-weeks line, shown under the score
const goodLine = () => `${S.goodWeeks || 0} of ${tallyWeeks()} weeks were good ones`;
// the lines of "How the score adds up", shared by Life Score so far and the end sheet. end: the life is over
function scoreLines(sc, end){
  const w = sc.w, target = lenTarget();
  // i20-a28: four tight columns (Stat · Score · Weight · Points), the range notes in small text under each stat
  const part = (l, sub, v, wt) => `<tr><th scope="row">${l}<small>${sub}</small></th><td>${v}</td><td>${wt}%</td><td>${Math.round(v * wt / 100)}</td></tr>`;
  const so = end ? '' : ' so far', dc = debtCost(sc);
  const sh = sc.aimShares, aims = Object.keys(sh).filter(k => k !== 'all');
  return `<table class="rec scoremath"><caption class="sr-only">How the score adds up</caption>
      <thead><tr><th scope="col">Stat</th><th scope="col">Score</th><th scope="col">Weight</th><th scope="col">Points</th></tr></thead><tbody>
    ${part('Happiness', `average ${Math.round(sc.avgH)}${so}${end ? ' (30 → 0, 90 → 100)' : ''}`, sc.parts.happy, w.happy)}
    ${part('Health', `average ${Math.round(sc.avgHe)}${so}${end ? ' (40 → 0, 95 → 100)' : ''}`, sc.parts.health, w.health)}
    ${part('Community', `average ${Math.round(sc.avgC)}${so}${end ? ' (10 → 0, 90 → 100)' : `, now ${Math.round(S.community)}`}`, sc.parts.community, w.community)}
    ${part('Net worth', `${fmt(sc.nw)}${S.col > 1.05 ? ` (${fmt(sc.real)} in 2027 dollars)` : ''} of ${fmt(target)}${end ? '' : ' by the end'}${S.sloanLeft > 0 ? '; student loans count at half' : ''}`, Math.max(0, sc.parts.wealth), Math.round(w.wealth))}
    ${w.aim > 0 ? part(aims.length === 1 ? `${AIMS[aims[0]].ic} ${AIMS[aims[0]].name}` : '🧭 Your aims', `your life aim${aims.length > 1 ? `s, by the weeks you held each (${aims.map(k => `${AIMS[k].name} ${Math.round(sh[k] * 100)}%`).join(', ')})` : ''}`, Math.round(sc.aim), Math.round(w.aim)) : ''}</tbody></table>
    ${dc ? `<div class="kv debt"><span>💳 Debt<br><small>${dc.cost ? `Debt is costing you ${dc.cost} point${dc.cost === 1 ? '' : 's'}.` : 'Debt costs you nothing more right now.'}${!end && dc.back ? ` Back to $0 by the end wins back ${dc.back}.` : ''}${sc.drag ? ` ${S.deepWeeks} week${S.deepWeeks === 1 ? '' : 's'} below ${fmtc(-DEEP_DEBT)}.` : ''}</small></span><span><b>−${dc.cost}</b></span></div>` : ''}
    <div class="kv"><span>⚖️ Weakest part: ${PART_NAMES[weakestPart(sc)]}<br><small class="muted">A balanced life counts more: the weakest part counts ${WEAK_SHARE * 100}% on its own</small></span><span><b>${Math.round(sc.weakest)}</b>/100</span></div>
    ${sc.cardAvg != null ? `<div class="kv"><span>📋 Report-card average ${sc.cardAvg}, ending ${sc.snap}<br><small class="muted">${sc.cards} report card${sc.cards === 1 ? '' : 's'} count ${CARD_SHARE * 100}%, ${end ? 'the ending' : 'today'} ${Math.round((1 - CARD_SHARE) * 100)}%</small></span><span><b>${Math.round(sc.cardAvg * CARD_SHARE + sc.snap * (1 - CARD_SHARE))}</b></span></div>` : ''}
    ${sc.bonus ? `<div class="kv"><span>🎯 Life goals reached</span><span><b>+${sc.bonus}</b></span></div>` : ''}
    ${sc.bk ? `<div class="kv debt"><span>⚖️ Bankruptcy</span><span><b>−${sc.bk}</b></span></div>` : ''}`;
}
const weakestPart = sc => Object.entries(sc.parts).sort((a, b) => a[1] - b[1])[0][0];
function showScoreNow(){
  openSystem('score', { quiet:true, how:'used' });
  const sc = lifeScore(), dc = debtCost(sc);
  const tip = dc && dc.cost >= 3 ? 'debt' : weakestPart(sc);
  const title = S.turn < 4 ? 'Just getting started' : sc.title;
  sheet(`<h2>🏆 Life Score so far: ${sc.score}</h2>
    <p class="muted">${title} (${lifeDiffLabel()})${on('score.aims') ? ` · aim: ${aimLabel()}` : ''}. This is the ${term('lifescore')} you'd get if the game ended today.${S.scoreQ != null ? ` At the last report card it was ${S.scoreQ}.` : ''}</p>
    <p class="muted">☀️ ${goodLine()} so far.</p>
    ${scoreLines(sc, false)}
    ${wealthTrack(sc.real)}
    ${modeScoreNote()}
    <div class="card tip" style="margin-top:10px"><div>💡 ${tip === 'wealth' && !on('money.k401') ? SCORE_TIPS.wealthEasy : SCORE_TIPS[tip === 'debt' && !on('score.debtDrag') ? 'debtNW' : tip]}</div></div>
    ${on('score.reportCards') ? `<p class="muted">A report card goes in your Journal every 13 weeks, and the report cards count for ${CARD_SHARE * 100}% of the final score.</p>` : '<p class="muted">Your final score comes from your averages and net worth when the life ends.</p>'}
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
}
// i2-a19: one concrete suggestion for Home, from the weakest part of the Life Score. Advice only: it never acts for you.
function nextStep(){
  if (S.practice || (!job() && !S.retired)) return null;            // no job: the No paycheck card has the job-hunt tip (i72-b01)
  const { parts } = lifeScore(), j = S.retired ? null : job();
  const order = Object.entries(parts).sort((a, b) => a[1] - b[1]).map(([k]) => k);
  const pick = {
    wealth: () => {
      if (j && !S.k401rate && on('money.k401')) return { t:'Save 5% in your 401(k): your employer adds 3% on top.', go:'life', b:'Life' };
      const now = j ? takeHome(j) : 0, better = JOBS.filter(x => x.edu <= S.edu && jobOn(x) && x.id !== S.jobId && takeHome(x) > now * 1.1).sort((a, b) => takeHome(b) - takeHome(a))[0];
      if (better && !S.retired) return { t:`${better.title} in ${CITIES[better.city].name} takes home about ${fmt(takeHome(better) - now)} more a week.`, go:'jobs', b:'Jobs' };
      if (!S.retired && S.edu < 3 && S.focus !== 'study') return { t:`A ${EDU[S.edu + 1].toLowerCase()} opens better-paying jobs: try Take classes.`, go:'focus', b:'Focus' };
      if (!HOMES[S.home].own && S.money > cost(HOMES.fixer.down) + cost(2000)) return { t:'You have enough for a down payment: owning a home builds equity.', go:'life', b:'Life' };
      if (S.turn >= (S.stockUntil ?? -1)) return { t:`A stock-up grocery run makes food ${STOCK_OFF * 100}% cheaper for ${STOCK_WEEKS} weeks.`, go:'trip', b:'Plan a trip' };
      return null;
    },
    happy: () => !['rest', 'outdoors', 'community'].includes(S.focus) ? { t:'Happiness is your weakest part: Get outside or Rest this week.', go:'focus', b:'Focus' }
      : canCarpool() && !S.carpool ? { t:'Join a carpool: the long drive wears on you less.', go:'jobs', b:'Jobs' } : null,
    health: () => !['rest', 'outdoors'].includes(S.focus) ? { t:'Health is your weakest part: Rest or Get outside this week.', go:'focus', b:'Focus' }
      : S.health < 50 ? { t:'A doctor checkup on a trip does the most when your health is low.', go:'trip', b:'Plan a trip' } : null,
    community: () => S.focus !== 'community' ? { t:`Community is your weakest part: Show up for town this week${seasonGoal() ? ' (it also counts for the town goal)' : ''}.`, go:'focus', b:'Focus' } : null
  };
  for (const k of order) { const h = pick[k](); if (h) return h; }
  if (!(S.goals || []).length && on('goals.badges')) return { t:`Pin up to ${GOAL_MAX} life goals: each one you reach adds ${GOAL_POINTS} points.`, go:'life', b:'Life' };
  return null;
}
/* ---------- i2-a29: your life story, from the Journal and each year's review ---------- */
const STORY_SKIP = /^(📋|📝|Applied for|Trip to|Renewed the|The wheat lease came|Refinanced)/;
const storyWorthy = e => e && (e.k || logKind(e.m)) !== 'ev' && !STORY_SKIP.test(e.m) || !!(e && e.mile) || /^(Hired as|Retired at|Moved into|Started dating)/.test(e && e.m || '');
// at New Year, a few of the year's milestones go into S.years, so the story survives the Journal's 120-entry limit
function yearMilestones(y){ return S.log.filter(e => e.d.endsWith(String(y)) && storyWorthy(e)).reverse().slice(0, 3).map(e => e.m); }
function lifeStory(){
  const strip = m => String(m).replace(/<[^>]+>/g, '');
  const yrs = (S.years || []).map(y => ({ year: y.year, age: y.age, m: y.m || [], d: y.end && y.start ? y.end.nw - y.start.nw : 0, h: y.end ? y.end.happy : 0 }));
  const cur = new Date(S.date).getFullYear();
  if (!yrs.some(y => y.year === cur)) yrs.push({ year: cur, age: age(), m: yearMilestones(cur), d: 0, h: S.happy });
  for (const y of yrs) if (!y.m.length) y.m = yearMilestones(y.year);   // years the Journal still remembers
  const first = S.log.length ? strip(S.log[S.log.length - 1].m) : '';
  let rows = yrs.filter(y => y.m.length);
  if (rows.length > 12) { const step = (rows.length - 1) / 11; rows = Array.from({ length: 12 }, (_, i) => rows[Math.round(i * step)]); }
  const full = (S.years || []).filter(y => y.start && y.end);
  const rich = full.slice().sort((a, b) => (b.end.nw - b.start.nw) - (a.end.nw - a.start.nw))[0];
  const glad = full.slice().sort((a, b) => b.end.happy - a.end.happy)[0];
  const best = [rich && rich.end.nw - rich.start.nw > 0 ? `Best year for money: ${rich.year} (${fmt(rich.end.nw - rich.start.nw)} more net worth).` : '',
    glad && full.length > 1 ? `Happiest year: ${glad.year}.` : ''].filter(Boolean);
  const early = S.storyEarly ? [{ year: `Before ${S.storyEarly}`, age: null, text: ['Earlier years came before this update, when the game didn\'t keep a year-by-year story yet.'] }] : [];
  return { first: S.storyEarly ? '' : first, rows: [...early, ...rows.map(y => ({ year: y.year, age: y.age, text: y.m.map(strip) }))], best };
}
function storyHTML(){
  if (!on('score.history')) return '';
  const st = lifeStory(); if (!st.rows.length && !st.first) return '';
  return `<section class="story" id="story" aria-labelledby="storyh"><div class="storyhead"><h3 id="storyh">📖 ${esc(S.name)}'s story</h3><button class="sm alt" id="skipstory">Skip to the score</button></div>
    <p class="muted storydiff">${lifeWords().replace(/^a/, 'A')}.</p>
    ${st.first ? `<p>${esc(st.first)}</p>` : ''}
    <ol class="storyl">${st.rows.map(r => `<li><b>${r.year}${r.age != null ? ` · age ${r.age}` : ''}</b> ${r.text.map(esc).join(' ')}</li>`).join('')}</ol>
    ${st.best.length ? `<p class="muted">${st.best.join(' ')}</p>` : ''}</section>`;
}
EVENTS.push(...STORY_EVENTS);
/* ---------- ending ---------- */
/* ---- Life Score (wave 1 score API) ----
   Parts are 0–100: average happiness, health and community over the life (i15-a01), net worth against the length's target
   (it goes below 0 in debt: i62-a04, i63-a01, i63-a02) and the life aim's measure (i20-b01, i20-b06).
   scoreSnap(o) is one snapshot: 85% the weighted parts + 15% the weakest part (i20-b13). A report card every 13 weeks stores a
   snapshot against targets scaled by progress (i20-b14). lifeScore() = 60% report-card average + 40% ending snapshot,
   plus life goals, minus a bankruptcy and the debt drag (i63-a03, i63-a04). Later balance work tunes these constants. */
const SCORE_W = { happy:30, health:20, community:20, wealth:30 };   // All-around weights (points out of 100)
const AIM_W = 15;                       // i20-b01: points of the wealth weight a life aim moves to its own measure
const WEAK_SHARE = 0.15, CARD_SHARE = 0.6, CARD_EVERY = 13, CARD_POW = 1.5;   // savings compound, so a report card's net-worth target grows as progress^1.5
const DEBT_SCALE = 90000, DEBT_FLOOR = { relaxed:-20, normal:-33, hard:-33 }, SLOAN_SCORE = 0.5;   // student loans count at half
const DEEP_DEBT = 1000, DRAG_PTS = { relaxed:3, normal:6, hard:6 };   // weeks below -$1,000 (2027 dollars) cost up to 6 points
const GOOD_MIN = 60, CONTENT_FULL = 0.9;                             // i20-b05: a good week; 90% good weeks is a full Contentment part
const AIM_CHANGE_WEEKS = 52;                                         // i20-b06: an aim can change once a year
const tallyWeeks = () => Math.max(1, S.turn - (S.tallyFrom || 0));
const goodShare = () => S.turn - (S.tallyFrom || 0) > 0 ? (S.goodWeeks || 0) / tallyWeeks() : 0;
const share = (n, full) => Math.min(1, (n || 0) / tallyWeeks() / full);
// i20-b01: what each aim plays for. Each measure counts things you do (rates or firsts), so idle weeks don't build it.
// count: built from one-time things (Legacy), so report cards count net worth in its place.
const AIMS = {
  all:       { ic:'✨', name:'All-around', line:'The classic Life Score: happiness, health, community and net worth.', what:'Net worth' },
  content:   { ic:'☀️', name:'Contentment', line:'Good weeks count: happiness and health both 60+ and no bills on the card.', what:'Good weeks',
    measure:() => clamp(goodShare() / CONTENT_FULL * 100),
    parts:() => [['Good weeks', `${S.goodWeeks || 0} of ${tallyWeeks()}`, Math.round(clamp(goodShare() / CONTENT_FULL * 100))]] },
  roots:     { ic:'🏡', name:'Roots', line:'Grow in: Show up for town, be a regular around town, own a home here and finish town goals.', what:'Roots',
    parts:() => { const yrs = Math.max(0.5, tallyWeeks() / 52);
      return [['Weeks showing up for town', `${S.townWeeks || 0}`, Math.round(share(S.townWeeks, 0.4) * 45)],
        ['Visits around town', `${(S.out && S.out.visits) || 0}`, Math.round(share(S.out && S.out.visits, 1) * 20)],
        ['A home of your own here', HOMES[S.home].own ? 'yes' : 'not yet', HOMES[S.home].own ? 15 : 0],
        ['Town goals finished', `${S.seasonWins || 0}`, Math.round(Math.min(1, (S.seasonWins || 0) / yrs) * 20)]]; } },
  adventure: { ic:'🧭', name:'Adventure', line:'New things count: trips around the region, new towns, new places in town and time outside.', what:'Adventure',
    parts:() => [['Trips taken', `${S.tripsN || 0}`, Math.round(share(S.tripsN, 0.25) * 35)],
      ['Towns visited', `${Object.keys(S.towns || {}).length} of 5`, Math.round(Math.min(1, Object.keys(S.towns || {}).length / 5) * 25)],
      ['Places tried in town', `${Object.keys((S.out && S.out.last) || {}).length}`, Math.round(Math.min(1, Object.keys((S.out && S.out.last) || {}).length / 20) * 20)],
      ['Weeks outside', `${S.outWeeks || 0}`, Math.round(share(S.outWeeks, 0.4) * 20)]] },
  legacy:    { ic:'🌱', name:'Legacy', line:'What outlasts you: kids raised, a business built, town stories seen through, a council seat, a scholarship.', what:'Legacy',
    parts:() => [['Kids', `${(S.kids || []).length}`, Math.min(2, (S.kids || []).length) * 20],
      ['A business built', S.biz || S.bizSold ? 'yes' : 'no', S.biz || S.bizSold ? 25 : 0],
      ['Years running it', `${Math.floor((S.bizWeeks || 0) / 52)}`, Math.round(Math.min(1, (S.bizWeeks || 0) / 104) * 25)],
      ['Town stories seen through', `${S.storiesDone || 0}`, Math.min(3, S.storiesDone || 0) * 12],
      ['Town council', S.council ? 'yes' : 'no', S.council ? 20 : 0],
      ['A scholarship in your name', S.scholar ? 'yes' : 'no', S.scholar ? 10 : 0]], count:true }
};
function aimMeasure(k){
  const a = AIMS[k]; if (!a || !a.parts && !a.measure) return 0;
  return clamp(a.measure ? a.measure() : a.parts().reduce((t, x) => t + x[2], 0));
}
// i20-b06: each aim's share of the weeks it was held (the current aim counts from its last change)
function aimShares(){
  if (!on('score.aims')) return { all: 1 };   // to-do 2 D2: no life aims (Easy): All-around only
  const w = { ...(S.aimWeeks || {}) }, tot = Object.values(w).reduce((a, v) => a + v, 0);
  if (!tot) return { [AIMS[S.aim] ? S.aim : 'all']: 1 };
  return Object.fromEntries(Object.entries(w).filter(([k, v]) => v > 0 && AIMS[k]).map(([k, v]) => [k, v / tot]));
}
const canChangeAim = () => S.turn - (S.aimAt ?? -AIM_CHANGE_WEEKS) >= AIM_CHANGE_WEEKS;
const aimNextDate = () => new Date(S.date + Math.max(0, AIM_CHANGE_WEEKS - (S.turn - (S.aimAt ?? -AIM_CHANGE_WEEKS))) * 7 * 864e5);
function setAim(k){
  if (!on('score.aims') || !AIMS[k] || k === S.aim || !canChangeAim()) return false;
  S.aim = k; S.aimAt = S.turn; log(`Changed my life aim to ${AIMS[k].name}.`, 'mile'); return true;
}
const aimDesc = k => `${AIMS[k].line}${k === 'all' ? '' : ` It takes ${AIM_W} of net worth's ${SCORE_W.wealth} points for its own measure.`} You can change it once a year.`;
const monthYear = d => d.toLocaleDateString('en-US', { month:'long', year:'numeric' });
// i20-b06: the Life tab's aim card: change once a year; the score blends each aim by the weeks you held it
function aimCard(){
  if (!on('score.aims')) return '';
  const a = AIMS[S.aim] || AIMS.all, ok = canChangeAim(), sh = aimShares();
  const held = Object.keys(sh).length > 1 ? `<p class="muted">So far: ${Object.entries(sh).map(([k, v]) => `${AIMS[k].name} ${Math.round(v * 100)}%`).join(', ')} of your weeks.</p>` : '';
  return `<div class="card" id="aimcard"><h3>🧭 Life aim: ${a.ic} ${a.name}</h3>
    <p class="muted">${a.line}${S.aim !== 'all' ? ` Measure so far: <b>${Math.round(aimMeasure(S.aim))}</b>/100.` : ''}</p>${held}
    <div class="bgs" role="group" aria-label="Change your life aim">${Object.entries(AIMS).map(([k, x]) => `<button class="chip${k === S.aim ? ' on' : ''}" data-setaim="${k}" aria-pressed="${k === S.aim}"${!ok && k !== S.aim ? ' disabled' : ''}>${x.ic} ${x.name}</button>`).join('')}</div>
    <p class="muted">${ok ? 'You can change your aim now. Each aim counts by the weeks you hold it, so a late switch counts for little.' : `Next change: ${monthYear(aimNextDate())}.`}</p></div>`;
}
function wireAimCard(){
  document.querySelectorAll('[data-setaim]').forEach(b => b.onclick = () => {
    const k = b.dataset.setaim; if (k === S.aim) return;
    if (setAim(k)) { save(); render(); announce(`Life aim changed to ${AIMS[k].name}. Next change in a year.`); toast(`${AIMS[k].ic} Now playing for ${AIMS[k].name}`); }
  });
}
// net worth as the score counts it: 2027 dollars, with student loans at half (i62-a04)
function scoredReal(){
  const sl = S.sloanLeft > 0 ? S.sloanLeft * S.sloanPay * 0.85 : 0;
  return (netWorth() + sl * SLOAN_SCORE) / (S.col || 1) - (rule('startAdd') || 0);   // i19-b09 (scaled-down): a Comfortable start's extra cash can't lift the score
}
const debtFloor = () => DEBT_FLOOR[mode()] ?? -33;
// one snapshot of the parts. o.p: a report card's progress (the net-worth target scales with it);
// o.real: a what-if net worth (the debt line asks "what if you were back at $0?")
function scoreSnap(o = {}){
  const T = lenTarget(), mp = S.monthsPlayed || 0, p = o.p == null ? 1 : Math.max(0.1, o.p);   // D7: the target for this difficulty
  const avg = (sum, now) => mp > 0 && sum != null ? sum / mp : now;   // i5-a02: over the months actually played
  const avgH = avg(S.happySum, S.happy), avgHe = avg(S.healthSum, S.health), avgC = avg(S.commSum, S.community);
  const real = o.real ?? scoredReal(), scale = real < 0 ? Math.min(T, DEBT_SCALE) : T * Math.pow(p, CARD_POW);
  const wealth = clamp(real / scale * 100, debtFloor(), 100);
  const hp = clamp((avgH - 30) / 60 * 100), he = clamp((avgHe - 40) / 55 * 100), cm = clamp((avgC - 10) / 80 * 100);
  const sh = aimShares(), allShare = sh.all || 0, aimW = AIM_W * (1 - allShare);
  // a report card judges Legacy (things that build late) as net worth; the ending counts it in full
  const am = k => o.p != null && AIMS[k].count ? Math.max(0, wealth) : aimMeasure(k);
  const aim = aimW > 0 ? Object.entries(sh).filter(([k]) => k !== 'all').reduce((t, [k, v]) => t + am(k) * v, 0) / (1 - allShare) : 0;
  const w = { ...SCORE_W, wealth: SCORE_W.wealth - aimW, aim: aimW };
  const weighted = (hp * w.happy + he * w.health + cm * w.community + wealth * w.wealth + aim * w.aim) / 100;
  const weakest = Math.max(0, Math.min(hp, he, cm, wealth));
  return { base: weighted * (1 - WEAK_SHARE) + weakest * WEAK_SHARE, weighted, weakest, w, avgH, avgHe, avgC, real, wealth, aim,
    parts: { happy: Math.round(hp), health: Math.round(he), community: Math.round(cm), wealth: Math.round(wealth) } };
}
// i63-a03: the share of weeks spent below -$1,000 (2027 dollars), up to 6 points (3 on Relaxed); climb out and it's a third (i63-a04)
function debtDrag(o = {}){
  if (!on('score.debtDrag')) return 0;   // to-do 2 D2: Easy and Normal: only the net-worth part reflects debt
  const n = S.deepWeeks || 0; if (!n || !S.turn) return 0;
  const d = Math.round(Math.min(1, n / S.turn) * (DRAG_PTS[mode()] ?? 6)), cash = o.cash ?? S.money, real = o.real ?? scoredReal();
  return cash >= 0 && real >= 0 ? Math.floor(d / 3) : d;
}
// i20-b14: a report card's score (a snapshot against progress-scaled targets), stored every 13 weeks in turn.js
const cardScore = () => scoreSnap({ p: gameProgress() }).base;
function addReportCard(){
  if (!on('score.reportCards')) return null;
  const c = cardScore(), n = Math.floor(S.turn / CARD_EVERY);
  if (S.cardSeed) { S.cardSeed = false; S.cardCount = Math.max(0, n - 1); S.cardSum = c * S.cardCount; }   // an older save: earlier cards count as this one
  S.cardSum += c; S.cardCount++;
  return Math.round(c);
}
const SCORE_TITLES = [[85, 'Legend of the Burg'], [70, 'Pillar of the Community'], [55, 'Solid Waitsburger'], [40, 'Getting By on Main Street'], [-1, 'Tumbleweed']];
const scoreTitle = sc => (SCORE_TITLES.find(([n]) => sc >= n) || SCORE_TITLES[SCORE_TITLES.length - 1])[1];
// The Life Score. o: what-ifs for the debt line (real, cash). Returns the score and everything the sheets show.
function lifeScore(o = {}){
  const snap = scoreSnap(o), n = on('score.reportCards') ? S.cardCount || 0 : 0, cardAvg = n ? (S.cardSum || 0) / n : null;
  const blended = cardAvg == null ? snap.base : cardAvg * CARD_SHARE + snap.base * (1 - CARD_SHARE);
  const bonus = goalBonus();                      // pinned life goals reached (#66)
  const bk = S.bk != null ? BK_PENALTY : 0;       // i3-a27: a bankruptcy costs a fixed number of points
  const drag = o.noDrag ? 0 : debtDrag(o);
  const score = clamp(Math.min(100, Math.round(blended) + bonus) - bk - drag, 0, 100);
  const nw = netWorth();
  return { score, title: scoreTitle(score), avgH: snap.avgH, avgHe: snap.avgHe, avgC: snap.avgC, nw, real: snap.real, wealth: snap.wealth, bonus, bk, drag,
    snap: Math.round(snap.base), cardAvg: cardAvg == null ? null : Math.round(cardAvg), cards: n, weighted: snap.weighted, weakest: snap.weakest,
    w: snap.w, aim: snap.aim, aimShares: aimShares(), parts: snap.parts };
}
// i60-a13: a grandkid carries on only after a full Lifetime: 60 or older, not run out of town by debt
const heirOK = (opts = {}) => on('legacy.heirs') && LENGTHS[S.len].turns === Infinity && (S.kids || []).length > 0 && !S.practice && !opts.debt && age() >= 60;
// i73-b01: what's kept of a finished life (about 1 KB)
function endStub(reason, sc){
  const y1 = new Date(S.date).getFullYear(), y0 = new Date(S.date - (S.turn || 0) * 7 * 864e5).getFullYear(), j = S.retired ? null : job();
  return { name:S.name, from:y0, to:y1, at:Date.now(), len:S.len, mode:mode(), diff:diff(), classic:!!S.classic, bg:S.bg, score:sc.score, title:sc.title, parts:sc.parts, cause:String(reason).slice(0, 200),
    age:age(), job: S.retired ? 'Retired' : j ? jobTitle(j) : 'No job', home:HOMES[S.home].name, kids:(S.kids || []).length, gen:S.gen || 1,
    seed:S.weekly || null, scenario:S.scenario || null, nw:Math.round(netWorth()) };
}
// i63-a10: what debt costs now, and what getting back to $0 by the end would win back
function debtCost(sc = lifeScore()){
  if (!(sc.real < 0 || sc.drag > 0)) return null;
  const free = lifeScore({ real: Math.max(0, sc.real), noDrag: true });   // no debt part and no drag at all
  const back = lifeScore({ real: Math.max(0, sc.real), cash: Math.max(0, S.money) });
  return { cost: Math.max(0, free.score - sc.score), back: Math.max(0, back.score - sc.score) };
}
// called once per week played (skips too) from weekTick, before the week number moves on
function scoreWeek(trip){
  const c = S.col || 1;
  if (S.happy >= GOOD_MIN && S.health >= GOOD_MIN && S.money >= 0) S.goodWeeks = (S.goodWeeks || 0) + 1;   // i20-b05
  if (S.money < -DEEP_DEBT * c && on('score.debtDrag')) S.deepWeeks = (S.deepWeeks || 0) + 1;                                      // i63-a03
  S.debtLow = Math.min(S.debtLow || 0, S.money / c);                                                      // i63-a20
  if (on('score.aims')) { const a = AIMS[S.aim] ? S.aim : 'all'; (S.aimWeeks = S.aimWeeks || {})[a] = (S.aimWeeks[a] || 0) + 1; }  // i20-b06
  if (S.focus === 'community') S.townWeeks = (S.townWeeks || 0) + 1;
  if (S.focus === 'outdoors') S.outWeeks = (S.outWeeks || 0) + 1;
  if (trip) S.tripsN = (S.tripsN || 0) + 1;
  if (S.biz) S.bizWeeks = (S.bizWeeks || 0) + 1;
}
// i63-a20: a life that climbed out of real debt says so under its title
function comebackLine(){
  const low = S.debtLow || 0;
  return low <= -DEEP_DEBT && S.money >= 0 && scoredReal() >= 0 ? `Came back from ${fmt(Math.round(-low / 100) * 100)} in debt.` : '';
}
const aimLabel = () => { const a = AIMS[S.aim] || AIMS.all; return `${a.ic} ${a.name}`; };
function finish(reason, opts = {}){
  const scr = lifeScore(), { score, title, parts } = scr, back = comebackLine();
  const sc = SCENARIOS[S.scenario], scWin = sc ? (S.scWon || sc.win()) : false;
  if (sc && scWin) markChallenge(S.scenario);
  const best = store.get(BEST_KEY) || {};
  const tier = sc || S.weekly ? 'standard' : lifeTier();   // i19-b03: Custom rules get their own shelf, a sandbox is never recorded
  // to-do 2 D7: the best goes on this life's difficulty shelf; a Classic life keeps the old key (length and mode)
  const sh = shelfOf(), rest = sc ? `sc-${S.scenario}` : S.weekly ? `wk-${S.weekly}` : sh === 'classic' ? bestKey(S.len, mode()) : S.len;
  const bk = (tier === 'custom' ? 'cu-' : '') + recKey(sh, rest);
  const isBest = tier !== 'sandbox' && (!best[bk] || score > best[bk]) && !S.rewound;     // i63-b22: a rewound life sets no best score
  if (isBest && !S.practice) { best[bk] = score; store.set(BEST_KEY, best); const nt = store.get(BEST_NOTE_KEY) || {}; if (back) nt[bk] = back; else delete nt[bk]; store.set(BEST_NOTE_KEY, nt); }
  const heir = heirOK(opts), stub = endStub(reason, { score, title, parts });
  // i73-b25: the family line so far, carried into the grandkid's save
  const line = [...(S.line || []), { name:S.name, years:`${stub.from}–${stub.to}`, job:stub.job, home:stub.home, score, title, epitaph:stub.cause }].slice(-40);
  const parent = { id:S.lifeId, name:S.name, nw:netWorth(), community:S.community, slot:S.slot === WEEKLY_SLOT ? 0 : S.slot, mode:mode(), diff:diff(), classic:!!S.classic, aim:S.aim, gen:S.gen || 1, date:S.date, ageMonths:S.ageMonths, col:S.col, wage:S.wage,
    will:hasWill(), home:S.home, equity:S.equity, mortgage:S.mortgage, line };
  if (!S.practice) {
    addEnd(stub);
    if (heir) setHeirs([parent, ...heirs().filter(p => p.id !== parent.id)]);   // i60-a13: waits on the title screen until started or dismissed
    writeSlot(S.slot ?? 0, null);
  }
  S.over = true;
  sheet(`<h2 style="text-align:center">${esc(S.name)}'s life in the Burg</h2>
    ${S.practice ? '' : `<div class="endface">${myFace(84)}</div>`}
    <p class="muted" style="text-align:center">${esc(reason)}</p>
    ${S.practice ? '' : `<p class="pronline" style="text-align:center">${esc(pronLine())}</p>`}
    ${S.practice ? '' : storyHTML()}
    ${S.practice ? '' : `<p class="muted" style="text-align:center" id="enddiff">${LENGTHS[S.len].label} · ${lifeDiffLabel()}${S.bg !== 'fresh' ? ` · ${BACKGROUNDS[S.bg].ic} ${BACKGROUNDS[S.bg].name}${dis() ? ` (${dis().name.toLowerCase()})` : ''}` : ''}</p>`}
    <div class="score" id="finalscore" tabindex="-1" aria-label="Life Score ${score}">${score}</div>
    <p style="text-align:center;margin-top:0"><b>${title}</b>${S.practice ? '' : ` <span class="tag">${lifeDiffLabel()} score</span>`}${isBest && !S.practice ? ` · <span class="tag cur">New best (${diffName()})!</span>` : ''}</p>
    ${back ? `<p class="comeback" style="text-align:center;margin-top:-6px">${back}</p>` : ''}
    <p class="goodweeks" style="text-align:center"><b>☀️ ${goodLine()}.</b>${on('score.aims') ? `<br><span class="muted">Played for: ${aimLabel()}</span>` : ''}</p>
    ${modeScoreNote()}
    ${tier !== 'standard' && !S.practice ? `<p class="muted" style="text-align:center" id="tiernote">${TIERS[tier].ic} This life counted toward ${TIERS[tier].shelf}. ${esc(rulesSummary(S.rules))}.</p>` : ''}
    ${S.rewound ? '<p class="muted" style="text-align:center">⏪ This life was rewound from an older backup, so its score and badges don\'t go in your records.</p>' : ''}
    <h3 style="margin-top:10px">How the score adds up</h3>
    ${scoreLines(scr, true)}
    ${sc ? `<div class="card ${scWin ? 'tip' : 'warn'}" style="margin-top:10px">${sc.ic} <b>${scWin ? 'Challenge complete!' : 'Challenge not met this time.'}</b> ${sc.name}: ${sc.desc}</div>` : ''}
    ${Object.keys(S.badges || {}).length ? `<h3 style="margin-top:10px">Badges</h3><p>${BADGES.filter(b => S.badges[b.id]).map(b => `${b.ic} ${b.name}`).join(' · ')}</p>` : ''}
    <h3 style="margin-top:10px">Your life</h3>
    ${S.kids && S.kids.length ? `<div class="kv"><span>Kids raised</span><span>${S.kids.length}</span></div>` : ''}
    <div class="kv"><span>Final age</span><span>${age()}</span></div>
    <div class="kv"><span>Education</span><span>${EDU[S.edu]}</span></div>
    ${S.biz ? `<div class="kv"><span>🏪 Business</span><span>${BIZ[S.biz.type].name}, earned ${fmt(S.biz.earned)}</span></div>` : ''}
    ${S.gen > 1 ? `<div class="kv"><span>🌳 Generation</span><span>${S.gen}</span></div>` : ''}
    ${S.scholar ? `<div class="kv"><span>🎓 ${esc(scholarName())}</span><span>${S.scholar.n} graduate${S.scholar.n === 1 ? '' : 's'} helped</span></div>` : ''}
    ${pensionVested() ? `<div class="kv"><span>🏛️ Public pension</span><span>${Math.floor(S.pensionYears)} years</span></div>` : ''}
    ${heir ? `<div class="kv"><span>📜 Will</span><span>${hasWill() ? 'On file' : 'None: probate will take a share'}</span></div>` : ''}
    ${!S.practice && on('score.history') ? '<button class="btn ghost" id="share">📤 Share score card</button>' : ''}
    ${!S.practice ? '<button class="btn ghost" id="endbackup">💾 Back up your records</button>' : ''}
    ${heir ? `<button class="btn primary" id="legacy">🌳 Continue as your grandkid</button>` : ''}
    <button class="btn ${heir ? 'ghost' : 'primary'}" id="again">Play again</button>`);
  if ($('#share')) $('#share').onclick = shareCard;
  if ($('#endbackup')) $('#endbackup').onclick = () => backupSheet(() => { S = null; useDice(); renderTitle(); });   // i62-a24: closing it goes on to the title screen
  if ($('#skipstory')) $('#skipstory').onclick = () => { $('#story').remove(); const f = $('#finalscore'); f.scrollIntoView({ block: 'start' }); f.focus({ preventScroll: true }); };
  if ($('#legacy')) $('#legacy').onclick = () => legacySheet(parent);
  $('#again').onclick = () => { closeSheet(); S = null; useDice(); renderTitle(); };
}

/* ============================================================
   💼 JOBS AND SCHOOL (ideas round 3, i3-a01 … i3-a14): job ladders, programs, short certificates,
   apprenticeships, seasonal work, interviews, offers, references, unions, furloughs, clearances,
   a remote job and the county bus. Data (JOBS, PROGRAMS, CERTS) is in state.js.
   ============================================================ */
// i3-a01: each job's ladder. Rung 0 is the job as hired; the top rung needs 3 years in the job
// plus more school than the job asks for, or People skill level 2
function ladderOf(j){
  if (j.ladder) return j.ladder;
  const t = LADDER_TITLES[j.id] || [`Senior ${j.title.toLowerCase()}`, `Lead ${j.title.toLowerCase()}`];
  return (j.ladder = [
    { title:j.title, payMult:1, stress:0, needMonths:0 },
    { title:t[0], payMult:1.12, stress:.3, needMonths:12 },
    { title:t[1], payMult:1.25, stress:.6, needMonths:36, needEdu:Math.min(3, j.edu + 1), needSkill:['people', 2] }
  ]);
}
// difficulty: ladders are Normal and up (jobs.ladder); in Easy every job stays on its first rung and gets a small raise
// each January instead (turn.js). Unions, seasonal layoffs and remote jobs switch off the same way.
const YEAR_RAISE = 1.02;
const rungOf = (j = job()) => j ? ladderOf(j)[on('jobs.ladder') ? Math.min(S.rung || 0, 2) : 0] : null;
const nextRung = () => working() && on('jobs.ladder') ? ladderOf(job())[(S.rung || 0) + 1] || null : null;
const unionJob = (j = job()) => !!(j && j.union && on('jobs.union'));
const remoteDays = (j = job()) => j && j.remote && on('jobs.commute') ? j.remote : 0;
const seasonal = x => !!(x && x.season && on('jobs.layoffs'));
const jobOn = x => !!x && !(x.remote === 5 && !on('jobs.commute'));   // the fully remote job is part of remote work
// i3-a04: apprentices earn startMult of full pay, stepping up each year until they're journeymen
const apprenticing = (j = job()) => !!(j && j.apprentice && S.jobId === j.id && (S.appWeeks || 0) < j.apprentice.weeks);
function appMult(j, cur){
  const a = j.apprentice; if (!a) return 1;
  if (!cur) return a.startMult;
  if ((S.appWeeks || 0) >= a.weeks) return 1;
  return a.startMult + (1 - a.startMult) * Math.floor((S.appWeeks || 0) / 52) / (a.weeks / 52);
}
// what still stands between you and a rung ('' when nothing does)
function rungNeeds(r){
  const out = [];
  if ((S.tenure || 0) < r.needMonths) out.push(`${r.needMonths} months in this job (you have ${Math.floor(S.tenure || 0)})`);
  if (r.needEdu != null && S.edu < r.needEdu && !(r.needSkill && skillLv(r.needSkill[0]) >= r.needSkill[1]))
    out.push(`a ${EDU[r.needEdu].toLowerCase()}${r.needSkill && on('skills') ? ` or ${SKILLS[r.needSkill[0]].name} skill level ${r.needSkill[1]}` : ''}`);
  if (apprenticing()) out.push('finishing your apprenticeship');
  return out.join(' and ');
}
const canPromote = () => { const r = nextRung(); return !!r && !rungNeeds(r) && !S.strike; };
const jobTitle = (j = job()) => !j ? '' : S.jobId === j.id && !S.retired ? (apprenticing(j) ? `Apprentice ${j.title.toLowerCase()}` : rungOf(j).title) : j.title;
// i3-a12: badged-out pay until the clearance comes through
const CLEARANCE = ['hanford', 'scientist', 'labadmin'];
const clearing = () => (S.clearAt ?? -1) > S.turn && working() && CLEARANCE.includes(S.jobId);
// i3-a02 / a03: a major or a certificate changes pay at the jobs it fits
const majorFits = x => !!(S.major && PROGRAMS[S.major] && PROGRAMS[S.major].jobs.includes(x.id));
function payPerks(j, cur){
  let m = majorFits(j) ? 1 + MAJOR_PAY : 1;
  for (const [c, p] of Object.entries(CERT_PERK)) if ((S.certs || {})[c] && p.jobs.includes(j.id)) m *= p.mult;
  m *= appMult(j, cur);
  if (cur) { m *= S.raise * rungOf(j).payMult; if (clearing()) m *= CLEAR_PAY; }
  return m;
}
// what a job needs beyond schooling: a certificate or a program ('' when nothing)
function extraLock(x){
  if (x.needCert && on('school.certs') && !(S.certs || {})[x.needCert]) return CERTS[x.needCert].name.replace(/ \(.*/, '');
  if (x.needMajor && S.major !== x.needMajor) return `${PROGRAMS[x.needMajor].name} program`;
  return '';
}
// i3-a06: seasonal jobs
const jobInSeason = (x, m = curMonth()) => !seasonal(x) || x.season.includes(m);
const seasonWords = x => `${MONTHS[x.season[0]]} to ${MONTHS[x.season[x.season.length - 1]]}`;
// i3-a09: a reference from your last job
const refNow = () => S.ref && S.turn < S.ref.until ? S.ref.k : null;
const refBonus = () => ({ good: 0.06, bad: -0.12 })[refNow()] || 0;
// i3-a08: jobs that are hard to fill, where you can ask for more
const HARD_TO_FILL = ['rn', 'cna', 'imaging', 'trucker', 'scientist', 'labadmin', 'lineman', 'windtech', 'nukeop', 'teacher', 'phleb'];
const SIGN_ON = 3000, ASK_LOSE = 0.10;

// leaving a job, however it happens: 'notice', 'walk', 'new' (another job), 'laid', 'fired', 'season', 'retire'
function leaveJob(how){
  if (!S.jobId) return;
  const months = S.tenure || 0;
  if (how === 'walk' || how === 'fired') S.ref = { k:'bad', until:S.turn + 52 };
  else if (months >= 6 && how !== 'retire') S.ref = { k:'good', until:S.turn + 104 };
  else if (how === 'notice' || how === 'new') S.ref = refNow() === 'bad' ? S.ref : null;   // too short to vouch for you
  if (S.bonus && S.bonus.job === S.jobId && S.turn < S.bonus.until && ['notice', 'walk', 'new', 'fired'].includes(how)) {
    S.money -= S.bonus.amt; log(`Paid back the ${fmt(S.bonus.amt)} sign-on bonus for leaving inside a year.`, 'money');
  }
  const j0 = jobById(S.jobId);
  if (j0 && (how === 'laid' || how === 'season')) S.uiPay = uiFor(j0);   // i75-b05: benefits follow a layoff
  if ((S.k401match || 0) > 0 && how !== 'season' && how !== 'retire') {   // i75-b12: an unvested match stays with the employer
    const lost = Math.min(S.k401, S.k401match); S.k401 -= lost;
    if (lost >= 1) log(`Left before the 401(k) match vested: ${fmt(lost)} of the employer's match went back to them. Your own savings stay yours.`, 'money');
  }
  if (how !== 'season') S.k401match = 0;          // a seasonal layoff with a call-back keeps its place toward vesting
  S.bonus = null; S.notice = null; S.strike = null; S.clearAt = -1; S.rung = 0; S.appWeeks = 0;
  S.jobId = null; if (S.focus === 'work') S.focus = 'rest';
}
// starting a job; back = what a seasonal recall keeps (raise, rung and months on the job)
function startJob(id, back = null){
  const x = jobById(id); if (!x) return;
  if (!S.practice && !prefs().hired) setPref('hired', 1);   // i52-a01: the Good first job tags are done after the first hire
  if (S.jobId && S.jobId !== id) leaveJob('new');
  Object.assign(S, { jobId:id, jobMonths:0, raise:1, rung:0, tenure:0, appWeeks:0, notice:null, strike:null, retired:false });
  if (back) Object.assign(S, { raise:back.raise || 1, rung:back.rung || 0, tenure:back.tenure || 0 });
  if (S.recall && S.recall.job === id) S.recall = null;
  S.ui = 0;                                        // i22-a03: benefits stop with a new paycheck; leftover months aren't banked
  S.clearAt = CLEARANCE.includes(id) && !back && on('jobs.perks') ? S.turn + CLEAR_WEEKS : -1;
  if (unionJob(x)) S.contractAt = S.turn + ri(78, 156);
  if (remoteDays(x) === 5 && !S.fiber) { const c = Math.round(cost(FIBER_COST)); S.money -= c; S.fiber = true; log(`Had fiber internet put in at home for the remote job (${fmt(c)}).`, 'money'); }
  if (!busOK(x)) S.bus = false;
  accOnHire(id);                                   // i7-a21: an accommodation, set up by the employer
}

// i3-a07: the interview. Each answer moves the odds a little; not answering keeps the usual odds.
function hireOdds(x){
  let p = 0.5 + S.community * 0.004 + (S.edu > x.edu ? 0.12 : 0) + (x.city === 'waitsburg' ? 0.1 : 0) + skillLv('people') * 0.04 + outLookBonus();
  if (!S.jobId) p += 0.08;
  p += S.applyBoost || 0;                          // new work clothes from a clearance sale (event)
  if (majorFits(x)) p += MAJOR_ODDS;               // i3-a02: the right program
  if (x.id === 'hanford' && (S.certs || {}).welding) p += 0.1;   // i3-a03: Hanford hires welders
  if (inCollections()) p -= 0.1;                   // i3-a26: a collections account shows up on background checks
  if (bkActive() && x.pay >= 4800) p -= 0.15;      // i3-a27: the better-paying jobs look hard at a bankruptcy
  p += refBonus();                                 // i3-a09
  return x.id === 'retail' && on('jobs.seasonal') ? Math.max(RETAIL_HIRE, p) : p;   // i75-b08: the mall is always hiring
}
const INTERVIEW = [
  { k:'honest', label:'Be straight about what you can and can\'t do yet', d:() => 0.05,
    hint:'A safe answer: a little better odds.' },
  { k:'bold', label:'Sell yourself hard', d:() => skillLv('people') >= 1 ? 0.1 : -0.05,
    hint:'Works if you have People skill; falls flat if you don\'t.' },
  { k:'pay', label:'Ask about the pay and the hours', d:x => HARD_TO_FILL.includes(x.id) ? 0.06 : -0.03,
    hint:'Hard-to-fill jobs like it. Others think you only care about money.' }
];
function resolveInterview(k){
  const iv = S.interview; S.interview = null;
  const x = iv && jobById(iv.id); if (!x) return null;
  const a = INTERVIEW.find(q => q.k === k), p = iv.p + (a ? a.d(x) : 0);
  return { x, ok: chance(x.id === 'retail' && on('jobs.seasonal') ? Math.max(RETAIL_HIRE, Math.min(0.92, p)) : Math.min(0.92, p)) };
}
function interviewSheet(x){
  const r = refNow(), notes = [skillLv('people') ? `🗣️ People skill ${skillLv('people')}` : '', outLookBonus() ? '💇 a fresh haircut' : '',
    r ? (r === 'good' ? '📄 a good reference' : '📄 a bad reference from your last job') : '', majorFits(x) ? `🎓 your ${PROGRAMS[S.major].name.toLowerCase()} major` : ''].filter(Boolean);
  sheet(`<div class="big">🤝</div><h2 style="text-align:center">Interview: ${esc(x.title)}</h2>
    <p class="evplace">📍 ${esc(x.where || CITIES[x.city].name)}</p>${firstTime('interview')}
    <p>The manager looks over your application and asks: <i>"So why should we hire you?"</i></p>
    ${notes.length ? `<p class="muted">Going for you: ${notes.join(', ')}.</p>` : ''}
    ${INTERVIEW.map((q, i) => `<button class="btn ${i === 0 ? 'primary' : 'ghost'}" data-i="${i}">${q.label}<small style="display:block;font-weight:400">${q.hint}</small></button>`).join('')}
    <button class="btn ghost" id="no">Decide later (they'll call by the end of the week)</button>`);
  document.querySelectorAll('#sheet [data-i]').forEach(b => b.onclick = () => { const res = resolveInterview(INTERVIEW[+b.dataset.i].k); if (res) hireResult(res.x, res.ok); });
  $('#no').onclick = () => { closeSheet(); render(); toast('They\'ll call by the end of the week'); };
}
// the end of an application, from the interview sheet
function hireResult(x, ok){
  if (!ok) {
    log(`Applied for ${x.title} in ${CITIES[x.city].name}. They went with someone else.`); adj({happy:-2});
    sheet(`<div class="big">📭</div><h2 style="text-align:center">Not this time</h2>
      <p style="text-align:center">The ${x.title} job went to someone else. You can apply again next ${turnWord().toLowerCase()}.</p>
      <p class="muted" style="text-align:center">Tip: higher Community standing, more schooling, the right program and a good reference help.</p><button class="btn primary" id="ok">OK</button>`);
    $('#ok').onclick = () => { closeSheet(); tab = 'home'; render(); };
    save(); return;
  }
  hired(x);
}
// i38-a01: a new job's +5 happiness comes once every 26 weeks, so job hopping doesn't carry happiness
function hireCheer(){ if (S.hireJoy != null && S.turn - S.hireJoy < HIRE_JOY_WEEKS) return; S.hireJoy = S.turn; adj({happy:5}); }
// i52-a02: a 20+ mile job says what the drive takes: time each way, happiness a month and gas a week
function driveLine(x){
  const mi = CITIES[x.city].miles; if (mi < 20 || remoteDays(x) === 5) return '';
  const mins = Math.round(mi * 60 / 55 / 5) * 5, t = mins >= 60 ? `an hour${mins > 60 ? ` and ${mins - 60} minutes` : ''}` : `${mins} minutes`;
  return `🛣️ It's ${mi} miles each way, about ${t} on the road. The drive wears on you: about −${(mi / 40 * driveDays(x)).toFixed(1)} happiness a month, and ${wk(commuteCost(mi, CARS[S.car], x))} in gas.`;
}
function hired(x){
  const before = { jobId:S.jobId, jobMonths:S.jobMonths, raise:S.raise, rung:S.rung, tenure:S.tenure, appWeeks:S.appWeeks, ref:S.ref, bonus:S.bonus,
    notice:S.notice, strike:S.strike, clearAt:S.clearAt, contractAt:S.contractAt, focus:S.focus, bus:S.bus, money:S.money, fiber:S.fiber };
  startJob(x.id);
  log(`Hired as ${x.title} in ${CITIES[x.city].name}!`, undefined, 1); hireCheer();
  const extra = [x.apprentice ? `You start as an apprentice at ${Math.round(x.apprentice.startMult * 100)}% pay, stepping up every year for ${x.apprentice.weeks / 52} years.` : '',
    clearing() ? `Your security clearance takes about ${CLEAR_WEEKS} weeks. Until then you're badged out, at ${Math.round(CLEAR_PAY * 100)}% pay. Keep your money in order: heavy debt can sink the check.` : '',
    unionJob(x) ? 'It\'s a union job: monthly dues, steadier raises and more protection from layoffs.' : '',
    seasonal(x) ? `It's seasonal work, ${seasonWords(x)}. You're laid off between seasons and called back after.` : ''].filter(Boolean);
  const drive = driveLine(x);
  const ask = HARD_TO_FILL.includes(x.id) && !S.practice && on('jobs.interview');   // difficulty: asking for more is Normal and up
  sheet(`<div class="big">🎉</div><h2 style="text-align:center">You're hired!</h2>
    <p style="text-align:center">${x.title} in ${CITIES[x.city].name} at ${wk(payNow(x))}.</p>
    ${drive ? `<p class="otnote">${drive}</p>` : ''}${extra.map(t => `<p class="muted">${t}</p>`).join('')}
    ${ask ? `${firstTime('offer')}<p>They need people for this job, so you could ask for more. Ask too hard and they may pull the offer (1 in 10).</p>
      <button class="btn primary" data-i="0">Take it as it is</button>
      <button class="btn ghost" data-i="1">Ask for 5% more${skillLv('people') ? ' (your People skill helps)' : ''}</button>
      ${on('jobs.perks') ? `<button class="btn ghost" data-i="2">Ask for a ${fmtc(SIGN_ON)} sign-on bonus (paid back if you leave inside a year)</button>` : ''}`
      : '<button class="btn primary" id="ok">Let\'s go</button>'}`);
  const done = msg => { if (msg) { log(`Job offer: ${msg}`); sheet(`<div class="big">🤝</div><p>${msg}</p><button class="btn primary" id="ok">Let's go</button>`); $('#ok').onclick = go; } else go(); };
  const go = () => { closeSheet(); tab = 'home'; render(); };
  if ($('#ok')) $('#ok').onclick = go;
  document.querySelectorAll('#sheet [data-i]').forEach(b => b.onclick = () => done(negotiate(+b.dataset.i, before)));
  save();
}
// i3-a08: 0 take it, 1 ask for 5% more, 2 ask for a sign-on bonus. Returns what happened ('' for take it).
function negotiate(k, before){
  if (!k) return '';
  const x = job();
  if (chance(ASK_LOSE)) {
    Object.assign(S, before); S.money = before.money;
    log(`The ${x.title} offer was pulled after you asked for more.`); adj({happy:-6});
    return `They thought it over and pulled the offer. ${before.jobId ? `You still have your job as ${jobById(before.jobId).title.toLowerCase()}.` : 'Back to the job board.'}`;
  }
  if (k === 1) {
    if (chance(0.5 + skillLv('people') * 0.1)) { S.raise *= 1.05; return `They agreed to 5% more. You start at ${wk(payNow(x))}.`; }
    return `They held firm at ${wk(payNow(x))}, but the offer stands.`;
  }
  if (chance(0.75)) { const amt = Math.round(cost(SIGN_ON)); S.money += amt; S.bonus = { amt, until:S.turn + 52, job:x.id }; return `A ${fmt(amt)} sign-on bonus, paid now. Stay a year or you pay it back.`; }
  return 'No bonus, but the offer stands.';
}
// the week's job upkeep, at the start of each week (turn.js): a pending interview, notice, seasons and recalls
function jobWeekStart(notes){
  if (S.interview) {
    const r = resolveInterview(null);
    if (r && r.ok) { startJob(r.x.id); log(`Hired as ${r.x.title} in ${CITIES[r.x.city].name}!`, undefined, 1); hireCheer(); notes.push(`📞 The ${r.x.title.toLowerCase()} job called back: you're hired!`); }
    else if (r) { log(`Applied for ${r.x.title} in ${CITIES[r.x.city].name}. They went with someone else.`); adj({happy:-2}); }
  }
  if (S.notice != null && S.turn >= S.notice && working()) {
    const t = job().title; leaveJob('notice'); log(`Quit the job as ${t} after two weeks' notice.`);
    notes.push(`👋 Your last day as ${t.toLowerCase()}. You left on good terms${refNow() === 'good' ? ', and the boss will give you a good reference' : ''}.`);
  }
  const j = S.retired ? null : job();
  if (S.seasonGrace && (!j || j.id !== S.seasonGrace || jobInSeason(j))) S.seasonGrace = null;   // an old save's grace ends when its season comes round
  if (j && j.season && !jobInSeason(j) && S.seasonGrace !== j.id) {
    S.recall = { job:j.id, raise:S.raise, rung:S.rung, tenure:S.tenure, until:S.turn + 52 };
    leaveJob('season'); S.ui = Math.max(S.ui || 0, Math.min(4, 12 - j.season.length));
    log(`Laid off for the season as ${j.title}. Called back in ${MONTHS[j.season[0]]}.`);
    notes.push(`🍂 The ${j.title.toLowerCase()} season is over. You're laid off until ${MONTHS[j.season[0]]}, when they call you back. Unemployment covers some of the gap, or find something for the off-season.`);
  } else if (S.recall) {
    const x = jobById(S.recall.job);
    if (!x || S.turn > S.recall.until) S.recall = null;
    else if (jobInSeason(x) && !job() && !S.retired) {
      startJob(x.id, S.recall); log(`Called back as ${x.title} for the season.`);
      notes.push(`📞 The ${x.title.toLowerCase()} season is starting, and they called you back. No application needed.`);
    }
  }
}
// the week's job upkeep after pay (turn.js): apprenticeships, the clearance check, strikes and furloughs ending
function jobWeekEnd(notes){
  const j = S.retired ? null : job();
  if (j) S.tenure = (S.tenure || 0) + W;
  if (apprenticing(j)) {
    S.appWeeks = (S.appWeeks || 0) + 1;
    if (S.appWeeks >= j.apprentice.weeks) { log(`Became a journeyman ${j.title.toLowerCase()}.`, 'mile'); notes.push(`🧰 Your apprenticeship is done: you're a journeyman ${j.title.toLowerCase()} now, at full pay (${wk(payNow(j))}).`); adj({happy:6}); }
    else if (S.appWeeks % 52 === 0) notes.push(`🧰 Another year of your apprenticeship done: your pay steps up to ${wk(payNow(j))}.`);
  }
  if (j && CLEARANCE.includes(j.id) && S.clearAt >= 0 && S.turn >= S.clearAt) {
    S.clearAt = -1;
    if (S.money < -cost(5000) && on('jobs.layoffs') && chance(0.5)) {   // difficulty: below Hard, jobs only end when you leave
      const t = j.title; leaveJob('laid'); S.ref = null; log(`The security clearance for ${t} was denied.`);
      notes.push(`🪪 Your security clearance was denied: the background check flagged your debts. You lose the ${t.toLowerCase()} job.`);
    } else { log(`Security clearance came through for ${j.title}.`); notes.push(`🪪 Your security clearance came through. You're on full pay now: ${wk(payNow(j))}.`); }
  }
  if (S.strike && S.turn >= S.strike.until) {
    S.strike = null;
    const big = chance(0.75), g = working() ? bumpPay(big ? 1.06 : 1.02) : 0;   // i22-a10: the real raise, after the cap
    notes.push(g <= 0.0005 ? `✊ The strike is over and there's a new contract, but your pay was already at the top of the scale. ${capTxt}`
      : big ? `✊ The strike is over and the union won a better contract: a ${pctTxt(g)} raise.` : `✊ The strike is over. The new contract is only a little better than the old offer: ${pctTxt(g)}.`);
  }
}
// the money side of all this, inside the week's paycheck (turn.js); returns the paycheck that week
function jobPay(j, base, lines, f){
  if (S.strike) { const v = base * 0.4; lines.push(['Strike pay from the union', v]); return v; }
  if (S.furlough && S.turn < S.furlough.until) { S.furlough.owed += base; return 0; }
  lines.push([`Paycheck${f.payMult || plantOT(j) > 1 ? ' + overtime' : ''}${clearing() ? ' (badged out until your clearance)' : apprenticing(j) ? ' (apprentice)' : ''}`, base]);
  return base;
}
function furloughBackPay(lines){
  if (!S.furlough || S.turn < S.furlough.until) return 0;
  const v = S.furlough.owed; S.furlough = null;
  if (v > 0) { lines.push(['Back pay from the furlough', v]); log(`The furlough ended: ${fmt(v)} of back pay came through.`, 'money'); }
  return v;
}

// i3-a28 outlook: the job's money in week i from now (pay, strike, furlough, clearance, apprenticeship steps,
// seasons, call-backs, notice and unemployment). Returns { gross, lines, big } before taxes; read-only.
function jobOutlook(i, d, f){
  const lines = [], big = [], mo = d.getMonth(), wage = Math.pow(1 + growth('wage'), i / 52);
  let j = S.retired ? null : job(), gross = 0;
  if (j && S.notice != null && S.turn + i >= S.notice) j = null;                  // gave notice
  if (j && j.season && !jobInSeason(j, mo)) j = null;                             // the season ends
  let recalled = false;
  if (!j && !S.retired && S.recall && S.turn + i <= S.recall.until) {             // a call-back when the season returns
    const x = jobById(S.recall.job); if (x && jobInSeason(x, mo) && !(job() && job().id !== x.id && S.notice == null)) { j = x; recalled = true; }
  }
  if (j) {
    let pay = (recalled && S.jobId !== j.id ? j.pay * S.wage * (S.recall.raise || 1) * ladderOf(j)[S.recall.rung || 0].payMult : payNow(j)) * wage * W * (f.payMult || 1) * plantOT(j, mo);
    if (!recalled && clearing() && S.turn + i >= S.clearAt) pay /= CLEAR_PAY;        // the clearance comes through
    if (!recalled && apprenticing(j)) { const w0 = S.appWeeks; S.appWeeks = w0 + i; const m1 = appMult(j, true); S.appWeeks = w0; pay *= m1 / appMult(j, true); }
    if (S.strike && S.turn + i < S.strike.until) { gross = pay * 0.4; lines.push(['Strike pay', gross]); }
    else if (S.furlough && S.turn + i < S.furlough.until) { lines.push(['Furloughed', 0]); }
    else { gross = pay; lines.push(['Paycheck', gross]); }
    if (S.furlough && S.turn + i === S.furlough.until) {                            // back pay: what's owed plus the weeks still to come
      const owed = S.furlough.owed + payNow(j) * W * Math.max(0, S.furlough.until - S.turn); gross += owed; big.push(['Back pay from the furlough', owed]);
    }
  } else if (!S.retired) {
    const left = (S.ui || 0) - i * W + (job() && job().season && !jobInSeason(job(), mo) ? Math.min(4, 12 - job().season.length) : 0);
    if (left > 0) lines.push(['Unemployment benefits', ((S.ui || 0) - i * W > 0 || !job() ? uiMonthly() : uiFor(job()) * S.wage) * wage * Math.min(W, left)]);   // i75-b05
  }
  return { gross, lines, big };
}
// i3-a03: short certificates
// i72-b04: pay as you go splits the same fee across the course's weeks (a bill line each week, studying or not)
function startCert(id, payGo = false){
  const c = CERTS[id]; if (!c || (S.certs || {})[id] || S.certStudy) return false;
  const fee = Math.round(cost(c.fee));
  if (payGo) { S.certStudy = { id, prog:0, owe:fee, per:fee / c.weeks }; log(`Signed up for a ${c.name} course (${fmt(fee)}, paid as you go: ${fmt(fee / c.weeks)} a week for ${c.weeks} weeks).`, 'money'); }
  else { S.money -= fee; S.certStudy = { id, prog:0 }; log(`Signed up for a ${c.name} course (${fmt(fee)}).`, 'money'); }
  return true;
}
// what's still owed on a pay-as-you-go certificate, and the week's payment (off = weeks from now)
const certOwed = () => S.certStudy && S.certStudy.owe > 0.005 ? S.certStudy.owe : 0;
const certPay = (off = 0) => { const left = certOwed() - off * ((S.certStudy && S.certStudy.per) || 0); return left > 0.005 ? Math.min(S.certStudy.per, left) : 0; };
const canStudy = () => S.edu < 3 || !!S.certStudy;
// a week of classes (turn.js): a certificate course comes first, then the next diploma
function certWeek(n, notes){
  const cs = S.certStudy; if (!cs) return false;
  cs.prog += n;
  if (cs.prog >= CERTS[cs.id].weeks) {
    if (certOwed()) { S.money -= cs.owe; log(`Paid the rest of the ${CERTS[cs.id].name} course (${fmt(cs.owe)}).`, 'money'); cs.owe = 0; }   // the full fee is always paid
    S.certs = { ...(S.certs || {}), [cs.id]: 1 }; S.certStudy = null;
    log(`Earned a ${CERTS[cs.id].name} certificate.`, 'mile'); notes.push(`📜 You earned your ${CERTS[cs.id].name} certificate! ${CERTS[cs.id].what}`); adj({happy:4});
  }
  return true;
}
// i3-a02: finishing a diploma; the program you studied becomes your major
function graduate(){
  const extra = Math.max(0, S.studyProg - STUDY_NEED[S.edu]); S.edu++;   // i22-a15: extra class weeks carry into the next program
  S.studyProg = S.edu < 3 ? Math.min(extra, STUDY_NEED[S.edu] - 1) : 0;
  if (S.program && PROGRAMS[S.program]) { S.major = S.program; log(`Graduated with a ${EDU[S.edu]} in ${PROGRAMS[S.program].name.toLowerCase()}.`); }
  else log(`Graduated with a ${EDU[S.edu]}.`);
  adj({happy:8});
}

// i3-a10 contract votes and i3-a11 federal shutdowns
Object.assign(EVENT_PLACE, { 'Contract vote':'work', 'Federal shutdown':'work' });
const JOB_EVENTS = [
  { ic:'✊', title:'Contract vote', cat:'work', w:6, when:() => working() && job().union && !S.strike && (S.contractAt ?? -1) >= 0 && S.turn >= S.contractAt,
    text:() => `The union contract at your ${job().title.toLowerCase()} job is up. Management offers 2%. The union hall votes this week: take the deal, or strike for more?`,
    choices:() => [
      {label:raiseRoom(1.02) > 0.0005 ? `Take the deal (+${pctTxt(raiseRoom(1.02))})` : 'Take the deal (you\'re at the top of the scale)', go:() => { const g = bumpPay(1.02); S.contractAt = S.turn + 156;
        return g > 0.0005 ? `The deal passed. A ${pctTxt(g)} raise: you now make ${wk(payNow(job()))}.` : `The deal passed. ${capTxt}`; }},
      {label:'Vote to strike (strike pay for a few weeks, then likely a better raise)', go:() => { const n = ri(2, 5); S.strike = { until:S.turn + n }; S.contractAt = S.turn + 156; adj({community:2, happy:-2});
        return `The strike vote passed. You're on the picket line for about ${n} weeks on 40% strike pay.`; }}
    ]},
  { ic:'🏛️', title:'Federal shutdown', cat:'work', yr:1, w:.6, when:() => working() && job().federal && !S.furlough && !clearing(),
    text:'Congress missed the budget deadline and the federal government shut down. You\'re furloughed: no paychecks until it\'s over, then back pay.',
    choices:() => [{label:'Tighten your belt', go:() => { const n = ri(2, 5); S.furlough = { until:S.turn + n, owed:0 };
      return `Furloughed for about ${n} weeks. The bills don't wait, so savings matter.`; }}]}
];
EVENTS.push(...JOB_EVENTS);

/* ============================================================
   🧓 RETIREMENT AND PLANNING (ideas round 3: i3-a24 to i3-a34)
   Pensions and Social Security live in state.js (pensionPay, ssPay); this part has the late-life choices,
   the will, the scholarship, the spare room and the 13-week money outlook. Amounts are monthly 2027 dollars.
   ============================================================ */
const isLifetime = () => LENGTHS[S.len].turns === Infinity;
// i3-a33: a will at Mother Hubbard's Legal Cupboard. Without one, probate takes 10% of what the grandkid gets and about 6 months
const WILL_FEE = 300, WILL_MIN_AGE = 25, PROBATE_CUT = 0.10, PROBATE_WEEKS = 26;
const hasWill = () => !!(S && (S.will || (S.out && S.out.will)));
function writeWill(){
  if (!on('legacy.will')) return 'Not in this life.';
  if (hasWill()) return 'Your will is already on file.';
  if (age() < WILL_MIN_AGE) return `From age ${WILL_MIN_AGE}.`;
  if (S.money < cost(WILL_FEE)) return `You need ${fmtc(WILL_FEE)} on hand.`;
  S.money -= cost(WILL_FEE); S.will = true; S.out = S.out || outDefault(); S.out.will = true; adj({ happy:2 });
  log(`Wrote a will at Mother Hubbard's Legal Cupboard (${fmtc(WILL_FEE)}).`, 'money');
  return '';
}
// what the grandkid gets: half the net worth, up to $250,000 in 2027 dollars. A will passes it at once, with the family home;
// without one the house is sold and probate takes 10% and 26 weeks
function inheritance(p){
  const cap = 250000 * (p.col || 1), nw = Math.max(0, p.nw || 0), owned = !!(HOMES[p.home] && HOMES[p.home].own);
  if (p.will) return { will:true, now: Math.min(cap, Math.round(Math.max(0, nw - (owned ? p.equity || 0 : 0)) * 0.5)), later:0, cut:0, home: owned ? p.home : null };
  const share = Math.min(cap, Math.round(nw * 0.5)), later = Math.round(share * (1 - PROBATE_CUT));
  return { will:false, now:0, later, cut: share - later, home:null };
}
// i3-a30: retirees can winter in Arizona from January to March
const SOUTH_MONTHS = [0, 1, 2], SOUTH_COST = 1950;
const awaySouth = () => !!S && !!S.retired && on('retire.south') && S.snowbird === new Date(S.date).getFullYear() && SOUTH_MONTHS.includes(curMonth());
// i3-a31: long-term care from 75 when health is under 50; insurance bought at 55 pays 60% of the bill
const LTC_PREMIUM = 120, LTC_COVER = 0.6, CARE_AGE = 75, CARE_HEALTH = 50, LTC_AGE = 55;
// happy, health and comm are monthly drift, like a job's stress
const CARE = {
  aide:   { ic:'🏠', name:'A paid aide at home', bill:'Home care aide', cost:4200, happy:0.8, health:2, comm:0,
    desc:'Stay in your own house with a home care aide most days. Costs the most to keep life as it is.' },
  living: { ic:'🏥', name:'Assisted living in Walla Walla', bill:'Assisted living', cost:5600, happy:-0.3, health:3, comm:-1.5,
    desc:'Nurses down the hall and meals made for you. Your health holds up best, but you see less of Waitsburg.' },
  family: { ic:'👪', name:'Count on family', bill:'', cost:0, happy:-2, health:1, comm:0.3,
    desc:'Your kids take turns helping out. No bill, but it weighs on everyone.' },
  medicaid: { ic:'🛏️', name:'A Medicaid bed at the Dayton nursing home', bill:'', cost:0, happy:-2.5, health:1.5, comm:-1,
    desc:'With your savings spent down, Medicaid pays for a shared room in Dayton. You\'re looked after, but it isn\'t home.' }
};
// paid care needs about 6 months of the bill on hand; when the money runs out, Medicaid takes over
const careAfford = k => S.money >= cost(CARE[k].cost) * (S.ltc && S.ltc.ins ? 1 - LTC_COVER : 1) * 6;
const careMonthly = () => S.care && CARE[S.care] ? CARE[S.care].cost * (S.ltc && S.ltc.ins ? 1 - LTC_COVER : 1) : 0;
const hasFamily = () => (S.kids || []).length > 0 || S.partner;
// i3-a32: a scholarship in your name at Waitsburg High
const SCHOLAR_NW = 150000, SCHOLAR_COST = 40000;
const scholarName = () => `${S.name} Scholarship`;
function endowScholarship(){
  if (!on('legacy.scholarship')) return 'Not in this life.';
  if (S.scholar) return 'Your scholarship is already set up.';
  if (netWorth() < cost(SCHOLAR_NW)) return `From a net worth of ${fmtc(SCHOLAR_NW)}.`;
  if (S.money < cost(SCHOLAR_COST)) return `You need ${fmtc(SCHOLAR_COST)} on hand.`;
  S.money -= cost(SCHOLAR_COST); S.scholar = { y: new Date(S.date).getFullYear(), n:0, at: age() };
  adj({ community:5, happy:4 }); log(`Endowed the ${scholarName()} at Waitsburg High with ${fmtc(SCHOLAR_COST)}.`, 'mile');
  return '';
}
// i3-a34: owners with a spare room host visitors on the first weekend of May, July, September and November
const HOST_WEEKS = { 4:'spring release weekend', 6:'summer concerts at the wineries', 8:'Fair & Frontier Days', 10:'fall release weekend' };
const HOST_PAY = 170, HOST_HAPPY = -1.5;
const spareRoom = () => !!(HOMES[S.home] && HOMES[S.home].own) && kidsAtHome() <= (S.home === 'farm' ? 2 : 1);
const hostWeekAt = d => HOST_WEEKS[d.getMonth()] !== undefined && d.getDate() <= 7;
// the planning lines and notes for one week (runs in weekTick's money step)
function planWeek(lines, notes){
  const m = W;
  if (awaySouth()) lines.push(['Winter in Arizona', -cost(SOUTH_COST) * m]);
  if (S.roomHost && on('retire.host') && spareRoom() && !S.practice && hostWeekAt(new Date(S.date))) {
    lines.push([`Spare room: ${HOST_WEEKS[curMonth()]} guests`, cost(HOST_PAY)]); adj({ happy: HOST_HAPPY }); S.hostLast = S.turn;
  }
  if ((S.care === 'aide' || S.care === 'living') && S.money < 0) {   // paid care ran through the savings: Medicaid takes over
    S.care = 'medicaid'; notes.push('🛏️ Your savings ran out, so Medicaid moved you to a shared room at the Dayton nursing home.'); log('Savings ran out: moved into a Medicaid bed in Dayton.', 'mile');
  }
  if (S.probate && S.turn >= S.probate.at) {
    lines.push(['Inheritance (probate closed)', S.probate.amt]);
    notes.push(`⚖️ Probate is finally done: ${fmt(S.probate.amt)} from ${esc(S.probate.from)}'s estate is yours.`);
    log(`Probate closed on ${S.probate.from}'s estate: ${fmt(S.probate.amt)}.`, 'money'); S.probate = null;
  }
}
// events that come when they're due instead of by the dice (the care chain, the winter choice, scholarship night)
function planDue(month){
  return PLAN_DUE.find(e => !(S.evCd[e.title] > S.turn) && !(e.once && S.evDone[e.title]) && e.when(month)) || null;
}
const PLAN_DUE = [
  { ic:'📋', title:'Long-term care insurance', once:1, when:() => isLifetime() && age() >= LTC_AGE && age() < LTC_AGE + 5 && !S.ltc,
    text:() => `An agent from the farm insurance office explains long-term care insurance: ${wk(cost(LTC_PREMIUM))} from now on, and it pays ${LTC_COVER * 100}% of an aide or assisted living if you need one after ${CARE_AGE}.`,
    choices:() => [
      {label:`Buy it (${wk(cost(LTC_PREMIUM))})`, go:() => { S.ltc = { ins:true, at:age() }; return 'Signed. One less thing to worry about later.'; }},
      {label:'Pass', go:() => { S.ltc = { ins:false, at:age() }; return 'You\'ll take your chances, or count on family.'; }}
    ]},
  { ic:'🧓', title:'Who will care for you?', once:1, when:() => isLifetime() && age() >= CARE_AGE && S.health < CARE_HEALTH && !S.care,
    text:() => `The stairs are harder and the doctor wants someone checking on you. Time to decide how you'll be cared for.${S.ltc && S.ltc.ins ? ` Your care insurance pays ${LTC_COVER * 100}% of the bill.` : ''}`,
    choices:() => [
      ...['aide', 'living'].map(k => ({ label:`${CARE[k].ic} ${CARE[k].name} (${wk(cost(CARE[k].cost) * (S.ltc && S.ltc.ins ? 1 - LTC_COVER : 1))})`, if:() => careAfford(k),
        go:() => { S.care = k; log(`Chose care: ${CARE[k].name.toLowerCase()}.`, 'mile'); return CARE[k].desc; } })),
      { label:`${CARE.family.ic} ${CARE.family.name}`, if:hasFamily, go:() => { S.care = 'family'; log('Chose care: family looks after you.', 'mile'); return CARE.family.desc; } },
      { label:`${CARE.medicaid.ic} ${CARE.medicaid.name}`, if:() => !careAfford('aide'), go:() => { S.care = 'medicaid'; log('Moved into a Medicaid bed at the Dayton nursing home.', 'mile'); return CARE.medicaid.desc; } }
    ]},
  { ic:'🌵', title:'Winter in Arizona?', yr:1, when:m => m === 11 && on('retire.south') && S.retired && !S.care && S.snowbird !== new Date(S.date).getFullYear() + 1 && S.money >= cost(SOUTH_COST) * 4,
    text:() => `Friends from church are renting places near Yuma again, January through March. Sunshine and golf for about ${fmt(cost(SOUTH_COST))} a month, but Waitsburg goes on without you.`,
    choices:() => [
      {label:`Go south for the winter (${wk(cost(SOUTH_COST))})`, go:() => { S.snowbird = new Date(S.date).getFullYear() + 1; return 'Bags packed for January. The gray months will be someone else\'s problem.'; }},
      {label:'Stay home this winter', go:() => 'Snow on Main Street and coffee at the bakery. Home is home.'}
    ]},
  { ic:'🎓', title:'Scholarship night at Waitsburg High', when:m => m === 5 && !!S.scholar && S.scholar.y !== new Date(S.date).getFullYear(),
    text:() => `Awards night in the gym. This year's ${scholarName()} goes to a senior headed to college in the fall.`,
    choices:() => [{label:'Hand over the certificate', go:() => { S.scholar.y = new Date(S.date).getFullYear(); S.scholar.n++; adj({ community:3, happy:2 });
      return `The whole gym clapped. That's ${S.scholar.n} graduate${S.scholar.n === 1 ? '' : 's'} helped so far.`; }}]}
];
PLAN_DUE.push(...LEAGUE_STEPS);   // W22: the Little League season's later steps (js/events.js)
// i3-a34: the odd guest, in the weeks right after a hosting weekend
const PLAN_EVENTS = [
  { ic:'🛏️', title:'Wine weekend guests', w:3, when:() => S.roomHost && S.turn - (S.hostLast ?? -99) <= 1,
    text:'Your spare-room guests from Seattle loved the town: the bakery, the river walk, the quiet.',
    choices:() => [{label:'Wave them off', go:() => { adj({ money:cr(40), happy:2 }); return `A glowing review and a ${fmtc(40)} tip on the dresser.`; }}]},
  { ic:'🍷', title:'A rough guest', w:2, when:() => S.roomHost && S.turn - (S.hostLast ?? -99) <= 1,
    text:'Your spare-room guest came back from the tasting rooms loud at 2 a.m. and left red wine on the carpet.',
    choices:() => [
      {label:`Pay for a carpet cleaner (-${fmtc(220)})`, go:() => { adj({ money:-cr(220), happy:-1 }); return 'The stain came out. The memory didn\'t.'; }},
      {label:'Scrub it yourself', go:() => { adj({ happy:-3, health:-1 }); return 'An afternoon on your knees with club soda. Mostly out.'; }}
    ]}
];
EVENTS.push(...PLAN_EVENTS);
Object.assign(EVENT_PLACE, { 'Long-term care insurance':['T','mainst'], 'Who will care for you?':['T','home'], 'Winter in Arizona?':['T','home'],
  'Scholarship night at Waitsburg High':['T','school'], 'Wine weekend guests':['T','home'], 'A rough guest':['T','home'] });

/* ---------- i15-b06: Up next: dated things in the next 8 weeks, behind one line on Home ---------- */
const UP_WEEKS = 8;
const wksTo = t => Math.ceil((t - S.date) / (7 * 864e5) - 1e-9);
const inWks = n => n <= 0 ? 'this week' : n === 1 ? 'next week' : `in ${n} weeks`;
function upNext(){
  if (!S || S.over) return [];
  const out = [], d = new Date(S.date), y = d.getFullYear();
  const add = (n, ic, t) => { if (n >= 0 && n <= UP_WEEKS) out.push({ n, ic, t }); };
  // vehicle tabs: every January
  { const jan = d.getMonth() === 0 && S.tabsYear !== y ? S.date : new Date(y + 1, 0, 1).getTime();
    add(Math.max(0, wksTo(jan)), '🪪', `Vehicle tabs at the DMV, about ${fmt(vehicleTabs())}`); }
  // the oil change: breakdowns rise after 26 weeks, and more after a year
  { const w = S.turn - (S.svc ?? 0);
    if (w < 26) add(26 - w, '🔧', 'An oil change is due: after that, breakdowns get more likely. Car care is on a trip to Dayton, Walla Walla or the Tri-Cities.');
    else if (w < 52) add(52 - w, '🔧', 'A year since the last oil change: breakdowns get even more likely after that.'); }
  // the wheat lease
  if (S.biz && S.biz.type === 'wheat') { const end = S.biz.lease ?? LEASE_WEEKS, left = end - S.biz.weeks;
    if (left > 0) add(left, '🌾', `The wheat lease is up: renew it on the Life tab for about ${fmt(leaseCost())}.`);
    else add(end + LEASE_GRACE - S.biz.weeks - 1, '🌾', `Last chance to renew the wheat lease (${fmt(leaseCost())}) before it ends.`); }
  // loans paid off
  if (S.loanLeft > 0) add(Math.ceil(S.loanLeft / W) - 1, '🛻', 'The last truck payment.');
  if (S.sloanLeft > 0) add(Math.ceil(S.sloanLeft / W) - 1, '🎓', 'The last student loan payment.');
  // this season's town goal
  { const g = seasonGoal();
    if (g && !S.practice) { const st = S.sgoal && S.sgoal.id === seasonId(g) ? S.sgoal : { prog:0, done:false };
      let n = 0; while (n < 20 && g.months.includes(new Date(S.date + (n + 1) * 7 * 864e5).getMonth())) n++;
      if (!st.done) add(n, g.ic, `The town goal ends (${g.name}): ${g.need - st.prog} more week${g.need - st.prog === 1 ? '' : 's'} of ${g.what} needed.`); } }
  // New Year and the year in review
  if (LENGTHS[S.len].turns > 26) add(Math.max(0, wksTo(new Date(y + 1, 0, 1).getTime()) - 1), '📅', `New Year: your ${y} in review.`);
  return out.sort((a, b) => a.n - b.n);
}
function upNextLine(){
  const u = upNext(); if (!u.length) return '';
  return `<button class="card upnext" id="upnext" aria-haspopup="dialog"><span>📆 ${u.length} thing${u.length === 1 ? '' : 's'} coming up</span><span aria-hidden="true">›</span></button>`;
}
function upNextSheet(){
  const u = upNext();
  sheet(`<h2>📆 Coming up in the next ${UP_WEEKS} weeks</h2>
    ${u.length ? u.map(x => `<div class="kv"><span>${x.ic} ${x.t}</span><span class="tag">${inWks(x.n)}</span></div>`).join('') : '<p>Nothing dated in the next 8 weeks.</p>'}
    ${S.practice ? '' : '<button class="btn ghost" id="outlook">📅 Money outlook: next 13 weeks</button>'}
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
  if ($('#outlook')) $('#outlook').onclick = () => outlookSheet(upNextSheet);
}
// i3-a28: the next 13 weeks of regular money, read-only, from the same bill lines weekTick uses
function moneyOutlook(n = 13){
  const out = [], j = S.retired ? null : job(), f = FOCUS[S.focus] || FOCUS.rest, d0 = new Date(S.date);
  let cash = S.money, tabsYear = S.tabsYear, lowWeek = null;
  const lease = S.biz && S.biz.type === 'wheat' ? (S.biz.lease ?? LEASE_WEEKS) - S.biz.weeks : null;
  for (let i = 0; i < n; i++) {
    const d = new Date(d0.getTime() + i * 7 * 864e5), lines = [], big = [], grow = Math.pow(1 + growth('col'), i / 52);
    let gross = 0;
    let rate = 0;
    if (S.retired) { gross = ssPay() * W + pensionPay() * W; lines.push(['Social Security and pension', gross]); rate = Math.max(0, gross - cost(RETIRE_TAX_FREE) * W) * RETIRE_TAX / gross; }
    else { const jo = jobOutlook(i, d, f); rate = taxRate(jo.gross / W / Math.pow(1 + growth('wage'), i / 52)); gross = jo.gross * (1 - (S.k401rate && on('money.k401') ? K401[S.k401rate] : 0)); lines.push(...jo.lines.filter(l => l[0] !== 'Paycheck' && l[0] !== 'Strike pay'), [jo.lines.some(l => l[0] === 'Strike pay') ? 'Strike pay' : 'Paycheck', gross]); big.push(...jo.big); }   // i3: the job's own ups and downs
    if (gross && rate) lines.push(['Taxes', -gross * rate]);   // i75-b03/b14
    if (S.partner && age() < 65) lines.push(["Partner's paycheck", 1400 * S.wage * W]);
    lines.push(...billLines(i));
    // i75-a03: a hard winter's heating line, once this winter's kind is known (read only: the outlook never rolls dice)
    if ([11, 0, 1].includes(d.getMonth()) && S.wxW && S.wxW.kind === 'hard' && S.wxW.y === (d.getMonth() >= 10 ? d.getFullYear() : d.getFullYear() - 1)) lines.push(['🔥 Heating (hard winter)', -cost(HEAT_BILL) * grow * W]);
    if (f.cost) lines.push([f.name, -cost(f.cost) * grow * W]);
    if (f.study && S.edu < 3 && !(S.certStudy && i < CERTS[S.certStudy.id].weeks - S.certStudy.prog)) big.push(['Tuition', -tuitionNow() * grow * W]);   // i3-a03: a paid-up certificate comes first
    if (S.loanLeft > i * W) lines.push(['Truck payment', -(S.loanPay || CARS.truck.pay) * Math.min(W, S.loanLeft - i * W)]);
    if (S.sloanLeft > i * W) lines.push(['Student loan', -S.sloanPay * Math.min(W, S.sloanLeft - i * W)]);
    if (S.heLeft > i * W) lines.push(['Home equity loan', -S.hePay * Math.min(W, S.heLeft - i * W)]);   // round 3 money
    if (HOMES[S.home].own && on('home.propertyTax') && [3, 9].includes(d.getMonth()) && `${d.getFullYear()}-${d.getMonth()}` !== S.ptaxDone && !out.some(w => w.ptax === `${d.getFullYear()}-${d.getMonth()}`)) big.push(['Property tax (county)', -propTax()]);
    if (S.biz && S.biz.type === 'wheat' && S.biz.ins && d.getMonth() === 3 && S.biz.insYear !== d.getFullYear() && !out.some(w => w.crop)) big.push(['Crop insurance premium', -cost(CROP_INS)]);
    if (S.biz && S.biz.type === 'wheat' && d.getMonth() === 3 && S.biz.farmYear !== d.getFullYear() && !out.some(w => w.farm)) big.push(['Custom farming, seed and fertilizer', -cost(WHEAT_FARMING)]);
    if (S.biz && S.biz.type === 'truck' && d.getMonth() === 3 && S.biz.permitYear !== d.getFullYear() && !out.some(w => w.permit)) big.push(['County health permit', -cost(TRUCK_PERMIT)]);
    if (S.biz && S.biz.stored) lines.push(['Elevator storage', -S.biz.stored * WHEAT_STORE_FEE * W]);
    if (S.biz && S.biz.type === 'cattle') { lines.push(['Pasture rent', -cost(PASTURE) * grow * W], ['Vet, minerals and bull lease', -cost(COW_CARE) * (S.biz.cows ?? CATTLE_COWS) / 12 * grow * W]); if ([10, 11, 0, 1, 2].includes(d.getMonth())) lines.push(['Hay', -cost(HAY) * (S.biz.cows ?? CATTLE_COWS) * grow * W]); }
    if (d.getMonth() === 0 && tabsYear !== d.getFullYear() && on('car.upkeep')) { big.push(['Vehicle tabs (DMV)', -vehicleTabs() * grow]); tabsYear = d.getFullYear(); }
    if (lease != null && lease === i) big.push(['Wheat lease renewal', -leaseCost()]);
    if (S.retired && S.snowbird === d.getFullYear() && SOUTH_MONTHS.includes(d.getMonth())) big.push(['Winter in Arizona', -cost(SOUTH_COST) * grow * W]);
    if (S.roomHost && spareRoom() && hostWeekAt(d)) lines.push(['Spare-room guests', cost(HOST_PAY) * grow]);
    if (S.probate && S.probate.at === S.turn + i) big.push(['Inheritance (probate closes)', S.probate.amt]);
    const net = [...lines, ...big].reduce((a, [, v]) => a + v, 0);
    cash += net;
    if (cash < 0 && lowWeek == null) lowWeek = i;
    out.push({ d, net, cash, big, ptax: big.some(b => b[0] === 'Property tax (county)') ? `${d.getFullYear()}-${d.getMonth()}` : null, crop: big.some(b => b[0] === 'Crop insurance premium'), farm: big.some(b => b[0] === 'Custom farming, seed and fertilizer'), permit: big.some(b => b[0] === 'County health permit') });
  }
  return { weeks: out, lowWeek };
}
function outlookSheet(back){
  const o = moneyOutlook(), lab = d => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  const end = o.weeks[o.weeks.length - 1].cash;
  sheet(`<h2>📅 Money outlook: the next 13 weeks</h2>
    <p class="muted">Your regular pay and bills from today's numbers, week by week. Events, trips and side hustles aren't counted.</p>
    <div class="card ${o.lowWeek == null ? 'tip' : 'warn'}" role="status">${o.lowWeek == null
      ? `✅ On track: cash stays above zero, about ${fmt(end)} by ${lab(o.weeks[o.weeks.length - 1].d)}.`
      : `⚠️ Cash dips below zero in the week of ${lab(o.weeks[o.lowWeek].d)}. Cut a cost or pick up hours before then.`}</div>
    <table class="rec outlook"><caption class="sr-only">Cash week by week</caption><thead><tr><th scope="col">Week of</th><th scope="col">Change</th><th scope="col">Cash after</th></tr></thead><tbody>
    ${o.weeks.map(w => `<tr class="${w.cash < 0 ? 'neg' : ''}"><th scope="row">${lab(w.d)}${w.big.length ? `<br><small>${w.big.map(([l, v]) => `${esc(l)} ${v > 0 ? '+' : ''}${fmt(v)}`).join(' · ')}</small>` : ''}</th>
      <td>${w.net >= 0 ? '+' : ''}${fmt(w.net)}</td><td>${fmt(w.cash)}</td></tr>`).join('')}</tbody></table>
    ${back ? '<button class="btn primary" id="back">Back</button>' : ''}<button class="btn ${back ? 'ghost' : 'primary'}" id="no">Close</button>`);
  if ($('#back')) $('#back').onclick = back;
  $('#no').onclick = closeSheet;
}
// the Life tab's planning card: retirement income, the outlook, the will, care, the scholarship and the spare room
function planningCard(){
  const life = isLifetime(), owned = HOMES[S.home].own;
  const row = (l, v) => `<div class="kv"><span>${l}</span><span>${v}</span></div>`;
  const inc = on('retire.income'), will = on('legacy.will'), sch = on('legacy.scholarship'), host = on('retire.host');   // to-do 2 D2
  const pens = inc && (S.pensionYears || 0) > 0 ? row(`🏛️ Public pension<br><small class="muted">${PENSION_RATE * 100}% of your best public pay for each of your ${Math.floor(S.pensionYears * 10) / 10} years${pensionVested() ? '' : ` · vests at ${PENSION_VEST}`}</small>`,
    pensionVested() ? `<b>${wk(pensionPay())}</b>` : 'Not vested yet') : '';
  const first = (will && !hasWill() && age() >= WILL_MIN_AGE ? firstTime('will') : '') || (life && age() >= LTC_AGE && !S.care && on('health.lateCare') ? firstTime('ltc') : '');   // i68-b11
  const body = `
    ${on('money.outlook') ? '<button class="sm alt" id="outlook">📅 Money outlook: next 13 weeks</button>' : ''}
    ${inc ? row(`🇺🇸 Social Security${S.retired ? '' : ' (estimate)'}<br><small class="muted">${Math.floor(S.earnYears || 0)} years worked of ${SS_FULL_YEARS} · ${Math.round(ssFactor() * 100)}% of the standard amount</small>`, `<b>${wk(ssPay())}</b>`) : ''}
    ${pens}
    ${life && S.ltc ? row('📋 Long-term care insurance', S.ltc.ins ? (S.care ? `Pays ${LTC_COVER * 100}% of care` : wk(cost(LTC_PREMIUM))) : 'None') : ''}
    ${S.care ? row(`${CARE[S.care].ic} Care`, `${CARE[S.care].name}${careMonthly() ? ` · ${wk(cost(careMonthly()))}` : ''}`) : ''}
    ${S.retired && S.snowbird != null && on('retire.south') ? row('🌵 Winters', S.snowbird >= new Date(S.date).getFullYear() ? `Arizona, January to March ${S.snowbird}` : 'At home') : ''}
    ${will ? row('📜 Will', hasWill() ? 'On file' : life ? 'None yet: probate would take 10% and 6 months from your heir' : 'None yet') : ''}
    ${hasWill() || !will ? '' : `<button class="sm" id="will" ${age() < WILL_MIN_AGE ? 'disabled' : ''}>Write a will (${fmtc(WILL_FEE)})${age() < WILL_MIN_AGE ? ` · from age ${WILL_MIN_AGE}` : ''}</button>`}
    ${!sch ? '' : S.scholar ? row(`🎓 ${esc(scholarName())}`, `${S.scholar.n} graduate${S.scholar.n === 1 ? '' : 's'} helped`)
      : netWorth() >= cost(SCHOLAR_NW) ? `<p class="muted" style="margin:6px 0">Endow a scholarship at Waitsburg High in your name: ${fmtc(SCHOLAR_COST)} now, a graduate every June, and a little community each year.</p><button class="sm" id="scholar">🎓 Endow a scholarship (${fmtc(SCHOLAR_COST)})</button>` : ''}
    ${owned && host ? `<p class="muted" style="margin:6px 0">🛏️ Spare room: host visitors on Walla Walla's big wine weekends, four times a year, about ${fmtc(HOST_PAY)} each, plus the cleaning.${spareRoom() ? '' : ' A full house leaves no spare room right now.'}</p>
      <button class="sm ${S.roomHost ? 'alt' : ''}" id="host" aria-pressed="${!!S.roomHost}">${S.roomHost ? 'Hosting: stop renting the room' : 'Rent out the spare room'}</button>` : ''}
  `;
  return body.trim() ? `${first}<div class="card"><h3>🧭 Planning ahead</h3>${body}</div>` : '';   // to-do 2 D2: nothing to plan, no card
}
function planningWire(){
  if ($('#outlook')) $('#outlook').onclick = () => outlookSheet();
  if ($('#will')) $('#will').onclick = () => { const e = writeWill(); if (e) return toast(e); save(); render(); toast('📜 Your will is on file'); announce('Your will is on file.'); };
  if ($('#scholar')) $('#scholar').onclick = () => {
    sheet(`<h2>🎓 Endow the ${esc(scholarName())}?</h2><p>${fmtc(SCHOLAR_COST)} goes to Waitsburg High. A graduating senior gets it every June, and the town remembers who made it happen.</p>
      <button class="btn primary" id="y">Endow it</button><button class="btn ghost" id="no">Not now</button>`);
    $('#y').onclick = () => { const e = endowScholarship(); closeSheet(); if (e) return toast(e); save(); render(); toast(`🎓 The ${scholarName()} is set up`); };
    $('#no').onclick = closeSheet;
  };
  if ($('#host')) $('#host').onclick = () => { S.roomHost = !S.roomHost; save(); render(); toast(S.roomHost ? '🛏️ The spare room is listed for wine weekends' : 'The spare room is yours again'); };
}

/* ============================================================
   🌦️ i75: the Life tab's weather card: a box-fan air filter for smoke season (a08), the roof on the waiting list
   (a12), the raised furnace (a14), and the block captain's storm plan (a33). The events are in events.js.
   ============================================================ */
const FAN_DIY = 45, FAN_BUY = 160, CAPTAIN_MIN = 40;
const CAPTAIN_PLAN = [[0, 'A phone tree for the block'], [1, 'Who lives alone or needs power for medical equipment'], [3, 'Who has a generator, a chainsaw and shovels']];
function buildFilter(diy){
  if (!on('weather.neighbors') || airFilterOn() || (diy && skillLv('handy') < 1)) return false;
  const c = cr(diy ? FAN_DIY : FAN_BUY);
  S.money -= c; S.airFilter = thisYear();
  if (diy) { adj({happy:1}); practice('handy', 1); }
  log(diy ? `Built a box-fan air filter for smoke season (${fmt(c)} in parts).` : `Bought an air purifier for smoke season (${fmt(c)}).`);
  return true;
}
function weatherCard(){
  // to-do 2: every row here is a Hard feature (storm neighbors, home damage); below Hard there's no card
  const nb = on('weather.neighbors'), dmg = on('weather.homeDamage'); if (!nb && !dmg) return '';
  const m = curMonth(), own = !!HOMES[S.home].own, runs = S.captain ? S.captain.runs || 0 : 0;
  const fanTime = inM(m, 3, 4, 5, 6, 7, 8);                     // April to September, before and during smoke season
  return `<div class="card"><h3>🌦️ Ready for weather</h3>
    ${nb ? `<div class="kv"><span>😷 Air filter for smoke season<br><small class="muted">A box fan with a furnace filter strapped on keeps the air inside clean in a smoke week. Filters clog, so it's good for one summer.</small></span><span>${airFilterOn() ? `Ready for ${thisYear()} ✓` : fanTime ? '' : 'Spring'}</span></div>
    ${!airFilterOn() && fanTime ? `<div class="slotbtns">${skillLv('handy') >= 1 ? `<button class="sm" id="fandiy">🔨 Build one (${fmtc(FAN_DIY)} in parts)</button>` : ''}<button class="sm alt" id="fanbuy">Buy an air purifier (${fmtc(FAN_BUY)})</button></div>
      ${skillLv('handy') < 1 ? `<p class="muted" style="margin:4px 0 0">With the Handy skill you could build one for ${fmtc(FAN_DIY)}.</p>` : ''}` : ''}` : ''}
    ${dmg && S.roofWait ? `<div class="kv"><span>🏠 Roof: on the roofer's list, with a tarp on it for now</span><span>about ${Math.max(1, S.roofWait.at - S.turn)} wk</span></div>` : ''}
    ${dmg && own && S.floodProof === S.home ? '<div class="kv"><span>🔧 Furnace and water heater raised off the basement floor</span><span>Flood cleanup −80%</span></div>' : ''}
    ${nb ? `<div class="kv"><span>🔦 Block captain${S.captain ? `<br><small class="muted">Your street's storm plan. Each storm you run it: an evening of your time, ▲ community. Storms so far: ${runs}.</small>` : `<br><small class="muted">Keep your street's storm plan: check on neighbors, share generators and shovels. It costs an evening every storm and pays in community, never cash.</small>`}</span>
      <span>${S.captain ? '<span class="tag cur">Captain</span>' : ''}</span></div>
    ${S.captain ? `<ul class="changes" aria-label="Your street's storm plan">${CAPTAIN_PLAN.map(([n, t]) => `<li>${runs >= n ? '✅' : '⬜'} ${t}${runs >= n ? '' : ` <small class="muted">(after ${n} storm${n > 1 ? 's' : ''})</small>`}</li>`).join('')}</ul>
      <button class="sm alt" id="captoff">Step down as block captain</button>`
      : S.community >= CAPTAIN_MIN ? '<button class="sm" id="capton">Be your block\'s storm captain</button>' : `<p class="muted" style="margin:4px 0 0">Neighbors pick someone they know: it opens at community ${CAPTAIN_MIN}.</p>`}` : ''}
  </div>`;
}
function weatherWire(){
  const fan = diy => { if (!buildFilter(diy)) return; save(); render(); toast(diy ? '😷 Box-fan filter built' : '😷 Air purifier bought'); announce(`Air filter ready for ${thisYear()}. Cash ${fmt(S.money)}.`); };
  if ($('#fandiy')) $('#fandiy').onclick = () => fan(true);
  if ($('#fanbuy')) $('#fanbuy').onclick = () => fan(false);
  if ($('#capton')) $('#capton').onclick = () => { S.captain = { since: S.turn, runs: 0 }; log('Became the block captain for the street\'s storm plan.'); save(); render(); toast('🔦 You\'re the block captain'); const b = $('#captoff'); if (b) b.focus({ preventScroll: true }); };
  if ($('#captoff')) $('#captoff').onclick = () => { S.captain = null; log('Stepped down as block captain.'); save(); render(); toast('🔦 Someone else has the storm plan now'); const b = $('#capton'); if (b) b.focus({ preventScroll: true }); };
}
// i75-a21: the Home tab's winter toggle: clear the neighbor's walk every snow
function walkCard(){
  if (!on('town.walk') || !inM(curMonth(), 10, 11, 0, 1, 2) || S.practice) return '';
  return `<div class="card"><div class="kv"><span>❄️ Clear Edna's walk next door when it snows<br><small class="muted">She's 84. Each snowy week: ▼ a little health, ▲ community.${S.walkWinters ? ` Winters so far: ${S.walkWinters}.` : ''}</small></span>
    <button class="sm${S.walk ? '' : ' alt'}" id="walk" aria-pressed="${!!S.walk}" aria-label="Clear the neighbor's walk when it snows">${S.walk ? 'On' : 'Off'}</button></div></div>`;
}
function walkWire(){
  if (!$('#walk')) return;
  $('#walk').onclick = () => { S.walk = !S.walk; save(); renderHome(); const b = $('#walk'); if (b) b.focus({ preventScroll: true });
    announce(S.walk ? 'You\'ll clear the neighbor\'s walk every snow.' : 'You won\'t clear the neighbor\'s walk.'); };
}
