// The Burg: features.js (part 5 of 8; scripts load in order and share one global scope)
/* ============================================================
   🚗 AROUND THE REGION (#57–#63): trips to Dayton, Walla Walla and the Tri-Cities
   Plan one trip a week (from Home or by tapping a town on the region map): a town and up to 3 stops.
   It happens when you end the week: gas there and back, each stop's cost and its effect.
   The town you commute to costs no extra gas or time: you run the errands on the way home.
   Other trips take part of your week, so your focus works at 75% that week.
   Places are described, not named (no real business names).
   ============================================================ */
const TRIP_MAX = 3, TRIP_FX = 0.28, TRIP_TIME = 0.75, STOCK_WEEKS = 6, STOCK_OFF = 0.2, GROCERY_SHARE = 360, REPEAT_WEEKS = 4;
const inSeason = (...ms) => () => ms.includes(curMonth());
const STOP_KINDS = { errand:'🛒 Errands', car:'🛻 Car care', eat:'🍽️ Eat out', do:'🎟️ Things to do', appt:'🩺 Appointments' };
const STOPS = [
  { id:'stock', kind:'errand', ic:'🛒', name:'Stock-up grocery run', towns:['wallawalla','kennewick','pasco','richland'], cost:0,
    note:`Big-store prices: groceries cost ${STOCK_OFF*100}% less for the next ${STOCK_WEEKS} weeks.` },
  { id:'oil', kind:'car', ic:'🔧', name:'Oil change and tune-up', towns:['dayton','wallawalla','kennewick','pasco'], cost:90,
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
  if (s.min21 && age() < 21) return '21 and over';
  if (s.when && !s.when()) return `Only ${s.season}`;
  if (s.ok && !s.ok()) return s.id === 'tires' ? 'Already on this vehicle' : 'Not now';
  return '';
}
const townStops = city => STOPS.filter(s => s.towns.includes(city));
const tripIsCommute = city => !S.retired && job() && job().city === city;
const tripGas = city => tripIsCommute(city) ? 0 : CITIES[city].miles * 2 * cost(GAS) / CARS[S.car].mpg;
// a stop costs more with your partner along on a dinner or a movie
const stopCost = s => cost(s.cost) * (s.date && S.partner ? 2 : 1);
// breakdown odds: lower within 6 months of an oil change, higher after a year without one
function careMult(){ const w = S.turn - (S.svc ?? 0); return w <= 26 ? 0.6 : w <= 52 ? 1 : 1.4; }
const ditchMult = () => S.tires === S.car ? 0.4 : 1;
// plan this week's trip; returns '' or why it can't be planned
function planTrip(city, ids){
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
  return '';
}
// runs inside weekTick's money step: adds the trip's lines, does its errands and returns the stat effects
function tripWeek(lines){
  const t = S.trip; if (!t || !CITIES[t.city]) { S.trip = null; return null; }
  const c = CITIES[t.city], fx = { happy:0, health:0, community:0 }, done = [];
  const gas = tripGas(t.city);
  if (gas) lines.push([`Trip to ${c.name}: gas`, -gas]);
  for (const id of t.stops) {
    const s = stopById(id); if (!s || stopBlocked(s)) continue;
    if (s.cost) lines.push([s.name, -stopCost(s)]);
    const half = S.turn - ((S.stopLast || {})[id] ?? -99) < REPEAT_WEEKS ? 0.5 : 1;   // again so soon: less special
    let mult = half;
    if (s.date && S.partner) mult += 0.4;
    if (s.id === 'wash' && [7,8,11,0,1].includes(curMonth())) mult += 0.5;
    if (s.id === 'checkup' && S.health < 50) mult *= 1.7;
    for (const [k, v] of Object.entries(s.fx || {})) fx[k] += v * mult * TRIP_FX;   // same scale as a week's focus
    if (s.id === 'stock') S.stockUntil = S.turn + STOCK_WEEKS;
    if (s.id === 'oil') S.svc = S.turn;
    if (s.id === 'tires') S.tires = S.car;
    if (s.id === 'dentist') S.dentist = S.turn;
    (S.stopLast = S.stopLast || {})[id] = S.turn;
    done.push(s.name.charAt(0).toLowerCase() + s.name.slice(1));
  }
  S.trip = null;
  if (!done.length) return null;
  (S.towns = S.towns || {})[t.city] = 1;
  log(`Trip to ${c.name}${tripIsCommute(t.city) ? ' on the way home from work' : ''}: ${done.join(', ')}.`);
  if (S.run) S.run.happened.push({ ic:'🚗', title:`Trip to ${c.name}`, money:0 });
  return { fx, away: !tripIsCommute(t.city) };
}

/* ---- trip screens ---- */
function tripPicker(){
  sheet(`<h2>🚗 Plan a trip</h2>
    <p class="muted">One trip a week, up to ${tripMax()} stop${tripMax() === 1 ? '' : 's'}. It happens when you end the week.${S.trip ? ` You have a trip to ${CITIES[S.trip.city].name} planned.` : ''}</p>${debtTripNote()}
    ${Object.entries(CITIES).filter(([k]) => k !== 'waitsburg').map(([k,c]) => {
      const gas = tripGas(k);
      return `<button class="kv job tripto" data-town="${k}"><span><span class="t">${TOWNIC[k]} ${c.name}</span><span class="s">${c.miles} mi each way · ${gas ? `gas about ${fmt(gas)}` : 'on your way home from work: no extra gas'}</span></span><span aria-hidden="true">›</span></button>`;
    }).join('')}
    <button class="btn ghost" id="n">Close</button>`);
  document.querySelectorAll('[data-town]').forEach(b => b.onclick = () => tripSheet(b.dataset.town));
  $('#n').onclick = closeSheet;
}
function tripSheet(city){
  const c = CITIES[city], gas = tripGas(city);
  const max = tripMax();
  let sel = S.trip && S.trip.city === city ? S.trip.stops.filter(id => !stopBlocked(stopById(id))).slice(0, max) : [];
  const groups = Object.entries(STOP_KINDS).map(([kind, label]) => {
    const list = townStops(city).filter(s => s.kind === kind); if (!list.length) return '';
    return `<h3 class="triph">${label}</h3>` + list.map(s => {
      const why = stopBlocked(s);
      const what = [s.cost ? fmt(stopCost(s)) : 'Free', s.fx ? fxWords(s.fx) : ''].filter(Boolean).join(' · ');
      return `<button class="stopbtn${sel.includes(s.id) ? ' on' : ''}" data-stop="${s.id}" aria-pressed="${sel.includes(s.id)}" ${why ? 'disabled' : ''}>
        <span class="t">${s.ic} ${s.name}</span><span class="s">${why ? why : what}${s.date && S.partner && !why ? ' · for two' : ''}</span>${s.note && !why ? `<span class="s">${s.note}</span>` : ''}</button>`;
    }).join('');
  }).join('');
  sheet(`<h2>${TOWNIC[city]} Trip to ${c.name}</h2>
    <p class="muted">${c.miles} mi each way · ${gas ? `gas about ${fmt(gas)}. A trip takes part of your week: your focus works at ${TRIP_TIME*100}%.` : 'You work here, so you\'ll stop on the way home: no extra gas or time.'}</p>
    ${debtTripNote()}
    ${S.trip && S.trip.city !== city ? `<p class="muted">This replaces your trip to ${CITIES[S.trip.city].name}.</p>` : ''}
    ${groups}
    <p id="tripsum" class="tripsum" aria-live="polite"></p>
    <button class="btn primary" id="go">Plan this trip</button>
    ${S.trip ? '<button class="btn ghost" id="cancel">Cancel my trip</button>' : ''}
    <button class="btn ghost" id="back">Other towns</button>`);
  const sum = () => {
    const total = gas + sel.reduce((a, id) => a + stopCost(stopById(id)), 0);
    $('#tripsum').textContent = sel.length ? `${sel.length} of ${max} stop${max === 1 ? '' : 's'} · about ${fmt(total)} in all` : `Pick up to ${max} stop${max === 1 ? '' : 's'}.`;
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
    const err = planTrip(city, sel); if (err) return toast(err);
    save(); closeSheet(); render(); toast(`🚗 Trip to ${c.name} planned for this week`);
  };
  if ($('#cancel')) $('#cancel').onclick = () => { S.trip = null; save(); closeSheet(); render(); toast('Trip canceled'); };
  $('#back').onclick = tripPicker;
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
  { id:'saver', ic:'🏦', name:'Saver', desc:'Have $25,000 in your 401(k) (2027 dollars).', test:() => (S.k401 || 0) / (S.col || 1) >= 25000 },
  { id:'nestegg', ic:'🥚', name:'Nest egg', desc:'Reach $100,000 net worth (2027 dollars).', test:() => netWorth() / (S.col || 1) >= 100000 },
  { id:'legend', ic:'🤝', name:'Pillar of the town', desc:'Reach community 80.', test:() => S.community >= 80 },
  { id:'healthy', ic:'💪', name:'Picture of health', desc:'Reach health 85.', test:() => S.health >= 85 },
  { id:'happy', ic:'😄', name:'Happy camper', desc:'Reach happiness 85.', test:() => S.happy >= 85 },
  { id:'council', ic:'🏛️', name:'Council member', desc:'Win a seat on the town council.', test:() => !!S.council },
  { id:'family', ic:'👶', name:'Family', desc:'Have a kid.', test:() => (S.kids || []).length > 0 },
  { id:'dog', ic:'🐕', name:'Good dog', desc:'Adopt a dog.', test:() => !!S.dog },
  { id:'roadtrip', ic:'🗺️', name:'Know the region', desc:'Take a trip to all five towns.', test:() => Object.keys(S.towns || {}).length >= 5 },
  { id:'helper', ic:'🌸', name:'Town helper', desc:'Finish 4 town goals.', test:() => (S.seasonWins || 0) >= 4 },
  { id:'retired', ic:'🎉', name:'Retired', desc:'Retire (Lifetime games).', test:() => !!S.retired }
];
const BADGE_KEY = 'theburg.badges.v1', GOAL_MAX = 3, GOAL_POINTS = 2;
const badgeById = id => BADGES.find(b => b.id === id);
// check for new badges; returns notes for any just earned
function badgeWeek(notes){
  if (S.practice) return;
  S.badges = S.badges || {};
  const all = store.get(BADGE_KEY) || {};
  for (const b of BADGES) if (!S.badges[b.id] && b.test()) {
    S.badges[b.id] = S.turn; all[b.id] = 1;
    const goal = (S.goals || []).includes(b.id);
    (S.newBadges = S.newBadges || []).push(`${b.ic} Badge earned: ${b.name}${goal ? ` (a life goal! +${GOAL_POINTS} Life Score)` : ''}`);   // a toast, not a stop
    log(`Earned a badge: ${b.name}.`);
  }
  store.set(BADGE_KEY, all);
}
// a goal counts only if it was pinned before the badge was earned (no pinning old badges in the last week)
const goalCounts = id => !!(S.badges && S.badges[id] != null && (S.goalAt || {})[id] != null && S.badges[id] > S.goalAt[id]);
const goalBonus = () => (S.goals || []).filter(goalCounts).length * GOAL_POINTS;
function goalsSheet(){
  let sel = [...(S.goals || [])];
  sheet(`<h2>🎯 Pick your life goals</h2>
    <p class="muted">Pin up to ${GOAL_MAX}. Each one you reach <b>after</b> pinning it adds ${GOAL_POINTS} points to your Life Score. You can change them any time.</p>
    ${BADGES.map(b => { const got = S.badges && S.badges[b.id];
      const pinnedEarly = (S.goals || []).includes(b.id) && goalCounts(b.id);
      return `<button class="stopbtn${sel.includes(b.id) ? ' on' : ''}" data-goal="${b.id}" aria-pressed="${sel.includes(b.id)}"><span class="t">${b.ic} ${b.name}${got ? ' ✅' : ''}</span><span class="s">${b.desc}${got && !pinnedEarly ? ' · Already earned, so it won\'t add points' : ''}</span></button>`; }).join('')}
    <p id="goalsum" class="tripsum" aria-live="polite"></p>
    <button class="btn primary" id="ok">Save my goals</button><button class="btn ghost" id="n">Cancel</button>`);
  const sum = () => { $('#goalsum').textContent = `${sel.length} of ${GOAL_MAX} picked`;
    document.querySelectorAll('[data-goal]').forEach(b => { const on = sel.includes(b.dataset.goal); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.disabled = !on && sel.length >= GOAL_MAX; }); };
  document.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => { const id = b.dataset.goal;
    sel = sel.includes(id) ? sel.filter(x => x !== id) : sel.length < GOAL_MAX ? [...sel, id] : sel; sum(); });
  $('#ok').onclick = () => {
    const at = {}; for (const id of sel) at[id] = (S.goalAt || {})[id] ?? S.turn;   // keep the week each goal was first pinned
    S.goals = sel; S.goalAt = at; save(); closeSheet(); render(); toast(sel.length ? '🎯 Life goals saved' : 'No life goals pinned'); };
  $('#n').onclick = closeSheet;
  sum();
}
function goalsCard(){
  const got = Object.keys(S.badges || {}).length;
  return `<div class="card"><h3>🎯 Life goals <span class="tag">${got}/${BADGES.length} badges</span></h3>
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
      {label:'Fix it yourself (-$350)', go:() => { adj({money:-Math.round(cost(350) * (1 - skillLv('handy') * 0.15)), health:-2, happy:2}); practice('handy', 3); chainSet('fixer', 2, { diy:true }); return 'Two weekends, a borrowed saw and sore hands. It\'s solid now, and you learned a lot.'; }},
      {label:'Hire a contractor (-$1,400)', go:() => { adj({money:-Math.round(cost(1400))}); chainSet('fixer', 2, { diy:false }); return 'A crew had it done in two days.'; }},
      {label:'Leave it', go:() => { adj({happy:-2}); chainEnd('fixer'); return 'You step carefully around the soft board.'; }}
    ]},
  { ic:'🍳', title:'The kitchen is next', once:1, w:8, when:() => chainAt('fixer', 2) && S.home === 'fixer',
    text:() => chain('fixer').f.diy ? 'Fixing the porch gave you ideas. The 1970s kitchen is calling.' : 'The contractor mentions the kitchen could use the same treatment.',
    choices:() => [
      {label:'Redo it yourself over a month (-$2,500)', go:() => { adj({money:-Math.round(cost(2500) * (1 - skillLv('handy') * 0.15)), health:-3, happy:3}); practice('handy', 4); chainSet('fixer', 3, { kitchen:'diy' }, [6, 10]); return 'Cabinets out, cabinets in. Dinner on a camp stove for a month.'; }},
      {label:'Hire it out (-$7,000)', go:() => { adj({money:-Math.round(cost(7000))}); chainSet('fixer', 3, { kitchen:'pro' }, [6, 10]); return 'The crew is on it. Takeout for a few weeks.'; }},
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
      {label:'Invest $1,500', go:() => { adj({money:-Math.round(cost(1500))}); chainSet('truck', 2, { inv:true }); return 'You\'re a silent partner in a food truck. Wild.'; }},
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
  // R10: the flood only comes within 8 weeks of high water that you didn't help sandbag
  { ic:'🌊', title:'Water in the basements', once:1, w:12, when:() => S.highWater != null && S.turn - S.highWater <= 8 && !S.chains?.levee,
    text:'The Touchet jumped its banks overnight. Half a dozen homes near the river have water in the basement.',
    choices:() => [
      {label:'Help muck out', go:() => { adj({community:4, health:-2}); chainSet('levee', 2, { helped:true }); return 'Wet boots, heavy carpets, grateful neighbors.'; }},
      {label:'Stay out of it', go:() => { adj({community:-2}); chainSet('levee', 2, { helped:false }); return 'You heard about it at the grocery store.'; }}
    ]},
  { ic:'🏗️', title:'A levee for the town', once:1, w:8, when:() => chainAt('levee', 2),
    text:'After the flood, the city wants to build up the levee along the river, and it\'s asking for volunteers and donations.',
    choices:() => [
      {label:'Volunteer on weekends', go:() => { adj({community:3, health:-1}); chainSet('levee', 3, { vol:true }, [20, 30]); return 'Sandbags, shovels and a lot of coffee.'; }},
      {label:'Donate $200', go:() => { adj({money:-Math.round(cost(200)), community:2}); chainSet('levee', 3, { don:true }, [20, 30]); return 'Your name is on the donor list at City Hall.'; }},
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
const CHALLENGE_KEY = 'theburg.challenges.v1';
function scenarioWeek(notes){
  const sc = SCENARIOS[S.scenario]; if (!sc || sc.endOnly || S.scWon) return;
  if (sc.win()) { S.scWon = true; notes.push(`🏁 Challenge complete: <b>${sc.name}</b>! Play on as long as you like.`); log(`Completed the challenge: ${sc.name}.`); markChallenge(S.scenario); }
}
function markChallenge(id){ if (S.practice) return; const w = store.get(CHALLENGE_KEY) || {}; w[id] = 1; store.set(CHALLENGE_KEY, w); }
function scenarioLine(){
  const sc = SCENARIOS[S.scenario]; if (!sc) return '';
  return `<div class="sgoal">${sc.ic} <b>Challenge:</b> ${sc.desc}${S.scWon ? ' ✅ Done!' : ''}</div>`;
}
function challengesSheet(){
  const won = store.get(CHALLENGE_KEY) || {};
  sheet(`<h2>🏁 Challenges</h2>
    <p class="muted">Set-up stories with a goal. They use the name you typed and Normal mode.</p>
    ${Object.entries(SCENARIOS).map(([k,sc]) => `<div class="kv job"><div><div class="t">${sc.ic} ${sc.name}${won[k] ? ' ✅' : ''}</div><div class="s">${sc.desc} ${LENGTHS[sc.len].label}.</div></div><button class="sm" data-sc="${k}">Start</button></div>`).join('')}
    <button class="btn ghost" id="n">Close</button>`);
  document.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => {
    const sc = SCENARIOS[b.dataset.sc], name = (($('#nm') && $('#nm').value.trim()) || 'Dusty').slice(0,20), free = slots().indexOf(null);
    closeSheet();
    const opts = { bg: sc.bg, mode: 'normal', scenario: b.dataset.sc };
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
const skillLv = k => { const x = (S.skills || {})[k] || 0; return x >= SKILL_STEPS[2] ? 3 : x >= SKILL_STEPS[1] ? 2 : x >= SKILL_STEPS[0] ? 1 : 0; };
function practice(k, n, notes){
  S.skills = S.skills || {}; const before = skillLv(k);
  S.skills[k] = Math.min(60, (S.skills[k] || 0) + n);
  const after = skillLv(k);
  if (after > before) { (S.newBadges = S.newBadges || []).push(`${SKILLS[k].ic} ${SKILLS[k].name} skill: level ${after}`); log(`${SKILLS[k].name} skill reached level ${after}: ${SKILLS[k].perk.toLowerCase()}.`); }
}
function skillWeek(notes, gig){
  if (S.practice) return;
  if (gig) practice(gig.id === 'cars' ? 'mechanic' : 'handy', 1, notes);
  if (S.focus === 'rest') practice('cook', 0.5, notes);
  if (S.focus === 'community') practice('people', 1, notes);
  if (carpooling()) practice('people', 0.3, notes);
}
function skillsCard(){
  return `<div class="card"><h3>🧰 Skills</h3>${Object.entries(SKILLS).map(([k,x]) => { const lv = skillLv(k), pts = (S.skills || {})[k] || 0, next = SKILL_STEPS[lv];
    return `<div class="kv"><span>${x.ic} ${x.name} <b>${'★'.repeat(lv)}${'☆'.repeat(3 - lv)}</b><br><small class="muted">${x.how}. ${x.perk}.</small></span><span>${lv >= 3 ? 'Max' : `${Math.floor(pts)}/${next}`}</span></div>`; }).join('')}</div>`;
}

/* ============================================================
   🏪 YOUR OWN BUSINESS (#72): small, risky, can grow
   ============================================================ */
const BIZ = {
  wheat: { ic:'🌾', name:'Lease wheat ground', cost:6000, desc:'Lease 80 acres and hire it farmed. Pays once a year at harvest (August), more or less depending on the weather and prices. The lease runs 5 years, then renewing costs a quarter of the price.',
    yearly:() => cost(6000) * (chance(0.15) ? 0.3 : 0.9 + Math.random() * 0.8), month:7 },
  truck: { ic:'🚚', name:'Food truck', cost:9000, desc:'Weekends at the fairgrounds and events, April through October. Takes your Side hustle weeks; pays more with the Cook skill.',
    weekly:() => [3,4,5,6,7,8,9].includes(curMonth()) && S.focus === 'hustle' ? cost(1400) * (1 + skillLv('cook') * 0.15) * (0.7 + Math.random() * 0.6) * W : 0 },
  shop:  { ic:'🪚', name:'Woodworking shop', cost:2500, desc:'Make and sell furniture from your garage. Pays a little every week; more with the Handy skill.',
    weekly:() => cost(180) * (1 + skillLv('handy') * 0.4) * (0.6 + Math.random() * 0.8) * W }
};
const bizValue = () => S.biz ? cost(BIZ[S.biz.type].cost) * 0.6 * (S.biz.dep ?? 1) : 0;
const leaseCost = () => cost(BIZ.wheat.cost) * LEASE_RENEW;
const leaseDue = () => !!(S.biz && S.biz.type === 'wheat' && S.biz.weeks >= (S.biz.lease ?? LEASE_WEEKS));
function renewLease(){
  if (!leaseDue()) return '';
  const c = leaseCost(); if (S.money < c) return `You need ${fmt(c)} on hand.`;
  S.money -= c; S.biz.lease = S.biz.weeks + LEASE_WEEKS; log(`Renewed the wheat lease for 5 more years (${fmt(c)}).`);
  return '';
}
function bizWeek(lines, notes){
  const b = S.biz && BIZ[S.biz.type]; if (!b) return;
  S.biz.weeks++; S.biz.dep = (S.biz.dep ?? 1) * Math.pow(1 - BIZ_DEP, 1/52);   // R13: wear and age take 5% a year off its value
  if (S.biz.type === 'wheat') {                    // R13: the lease runs 5 years, then it's renew or lose it
    const end = S.biz.lease ?? (S.biz.lease = LEASE_WEEKS);
    if (S.biz.weeks === end) { notes.push(`${b.ic} Your wheat lease is up. Renew it on the Life tab for ${fmt(leaseCost())} within ${LEASE_GRACE} weeks, or the landowner leases the ground to someone else.`); log('The wheat lease came up for renewal.'); }
    if (S.biz.weeks >= end + LEASE_GRACE) { notes.push(`${b.ic} You didn't renew, so the wheat lease ended.`); log('The wheat lease ended.'); S.biz = null; return; }
  }
  if (b.weekly) { const v = b.weekly(); if (v) { lines.push([`${b.ic} ${b.name}`, v]); S.biz.earned += v; } }
  if (b.yearly && curMonth() === b.month && S.biz.paidYear !== new Date(S.date).getFullYear()) {
    S.biz.paidYear = new Date(S.date).getFullYear(); const v = b.yearly(); lines.push([`${b.ic} Harvest check`, v]); S.biz.earned += v;
    notes.push(v < cost(3000) ? `${b.ic} A rough harvest: your wheat lease paid only ${fmt(v)}.` : `${b.ic} Harvest is in: your wheat lease paid ${fmt(v)}.`);
  }
}
function bizCard(){
  if (S.biz) { const b = BIZ[S.biz.type];
    const lease = S.biz.type === 'wheat' ? (leaseDue() ? `<div class="card warn" style="margin:6px 0">🌾 The lease is up: renew within ${Math.max(1, S.biz.lease + LEASE_GRACE - S.biz.weeks)} week${S.biz.lease + LEASE_GRACE - S.biz.weeks === 1 ? '' : 's'} or it ends. <button class="sm" id="renew">Renew for 5 years (${fmt(leaseCost())})</button></div>`
      : `<div class="kv"><span>Lease</span><span>${Math.ceil(((S.biz.lease ?? LEASE_WEEKS) - S.biz.weeks) / 52 * 10) / 10} years left</span></div>`) : '';
    return `<div class="card"><h3>🏪 Your business</h3><div class="kv"><span>${b.ic} ${b.name}<br><small class="muted">${b.desc}</small></span><span></span></div>
      <div class="kv"><span>Earned so far</span><span><b>${fmt(S.biz.earned)}</b></span></div>
      <div class="kv"><span>Worth if you sell</span><span>${fmt(bizValue())}</span></div>${lease}
      <button class="sm alt" id="bizsell">Sell the business</button></div>`; }
  return `<div class="card"><h3>🏪 Start a business</h3><p class="muted" style="margin:0 0 6px">Small, risky, and it can grow. One at a time.</p>
    ${Object.entries(BIZ).map(([k,b]) => `<div class="kv job"><div><div class="t">${b.ic} ${b.name}</div><div class="s">${b.desc}</div></div><button class="sm" data-biz="${k}">${fmt(cost(b.cost))}</button></div>`).join('')}</div>`;
}
function startBiz(k){
  const b = BIZ[k], c = cost(b.cost);
  if (S.money < c) return toast(`You need ${fmt(c)} on hand.`);
  S.money -= c; S.biz = { type:k, weeks:0, earned:0, paidYear:null, dep:1, lease: k === 'wheat' ? LEASE_WEEKS : null }; adj({happy:3}); log(`Started a business: ${b.name.toLowerCase()}.`);
  save(); render(); toast(`${b.ic} You started a ${b.name.toLowerCase()}!`);
}
function sellBiz(){
  const v = bizValue(), b = BIZ[S.biz.type]; S.money += v; log(`Sold the ${b.name.toLowerCase()} for ${fmt(v)}.`); S.biz = null; save(); render(); toast(`Sold for ${fmt(v)}`);
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
function startWeekly(name){
  const free = slots().indexOf(null), wkid = isoWeek();
  const go = slot => { newGame(name, 'half', slot, { bg:'fresh', mode:'normal', weekly: wkid }); };
  if (free < 0) return toast('All 5 slots are full: delete a life first.');
  go(free);
}
function scoreCard(){
  const { score, title } = lifeScore(), c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
  const g = c.getContext('2d');
  g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, 1080, 1350); g.fillStyle = '#9b2f1f'; g.fillRect(0, 0, 1080, 260);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 110px Georgia, serif'; g.fillText('The Burg', 540, 170);
  g.fillStyle = '#3d2b1f'; g.font = '600 52px system-ui, sans-serif'; g.fillText(`${S.name}'s life in Waitsburg`, 540, 380);
  g.font = '40px system-ui, sans-serif'; g.fillStyle = '#6b5b4e';
  g.fillText(`${LENGTHS[S.len].label}${S.weekly ? ` · Weekly challenge ${S.weekly}` : ''}${mode() !== 'normal' ? ` · ${MODES[mode()].name} mode` : ''}`, 540, 450);
  g.fillStyle = '#9b2f1f'; g.font = 'bold 300px Georgia, serif'; g.fillText(String(score), 540, 800);
  g.fillStyle = '#3d2b1f'; g.font = '600 60px system-ui, sans-serif'; g.fillText(mode() !== 'normal' ? `${title} (${MODES[mode()].name})` : title, 540, 900);
  g.font = '40px system-ui, sans-serif'; g.fillStyle = '#6b5b4e';
  const bs = BADGES.filter(b => S.badges && S.badges[b.id]).map(b => b.ic).join(' ');
  if (bs) g.fillText(bs, 540, 1010);
  g.fillText(`Age ${age()} · ${EDU[S.edu]} · ${fmt(netWorth())}`, 540, 1100);
  g.fillStyle = '#9b2f1f'; g.font = '600 44px system-ui, sans-serif'; g.fillText('krazow.github.io/The-Burg', 540, 1260);
  return c;
}
async function shareCard(){
  const c = scoreCard(), blob = await new Promise(r => c.toBlob(r, 'image/png')), name = `the-burg-${S.name.replace(/\W+/g, '-').toLowerCase()}.png`;
  const file = typeof File === 'function' ? new File([blob], name, { type:'image/png' }) : null;
  try { if (file && navigator.canShare && navigator.canShare({ files:[file] })) { await navigator.share({ files:[file], title:'My life in The Burg' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast('Score card saved');
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
// pick (or type) the grandkid's name before the next generation starts
function legacySheet(parent){
  const sugg = heirName(parent.name);
  sheet(`<div class="big">🌳</div><h2 style="text-align:center">Continue as your grandkid</h2>
    <p>${esc(parent.name)}'s grandkid just turned 18 and is staying in Waitsburg, with part of the family's savings and a name people know around town.</p>
    <label class="field" for="heirnm">Your grandkid's name</label>
    <input type="text" id="heirnm" maxlength="20" value="${esc(sugg)}" autocomplete="off">
    <button class="btn primary" id="heirgo">Start the next generation</button>
    <button class="btn ghost" id="no">Not now (back to the title screen)</button>`);
  $('#heirgo').onclick = () => { const nm = ($('#heirnm').value.trim() || sugg).slice(0, 20); closeSheet(); startLegacy(parent, nm); };
  $('#no').onclick = () => { closeSheet(); S = null; useDice(); renderTitle(); };
}
function startLegacy(parent, name = heirName(parent.name)){
  const real = Math.max(0, parent.nw), heir = Math.min(250000 * (parent.col || 1), Math.round(real * 0.5));
  name = String(name).slice(0, 20);
  newGame(name, 'life', parent.slot ?? 0, { bg:'fresh', mode:parent.mode });
  S.gen = (parent.gen || 1) + 1; S.money = heir; S.community = clamp(Math.round(parent.community / 2) + 15);
  S.date = parent.date; S.col = parent.col; S.wage = parent.wage; S.tabsYear = new Date(S.date).getFullYear();
  S.yearStart = { nw: netWorth(), happy: S.happy, health: S.health, community: S.community };
  S.badges = {}; S.log = [];
  log(`${name} turns 18 and picks up where grandparent ${parent.name} left off, with ${fmt(heir)} from the family and a name people know around town.`);
  save(); render(); toast(`🌳 Generation ${S.gen}: ${name}`);
}

/* ---------- 🏆 Life Score so far (#67) ---------- */
// R16: Relaxed and Hard scores are labeled as such, and kept apart from Normal best scores
function modeScoreNote(){
  const md = mode(); if (md === 'normal') return '';
  return `<p class="muted modenote" style="text-align:center">${MODES[md].ic} <b>${MODES[md].name} mode score.</b> ${md === 'relaxed' ? 'Debt never ends a Relaxed life, so' : 'Hard'} scores are kept separately from Normal ones and aren't compared with them.</p>`;
}
// B10: how far through the game you are (Lifetime: age 18 to 65), for an "on track" net-worth target
function gameProgress(){
  const L = LENGTHS[S.len];
  return L.turns === Infinity ? clamp((S.ageMonths / 12 - 18) / (65 - 18), 0, 1) : clamp(S.turn / L.turns, 0, 1);
}
function wealthTrack(real){
  const L = LENGTHS[S.len], p = gameProgress(), want = L.target * p;
  if (p < 0.02) return '';
  const ok = real >= want;
  return `<div class="kv"><span>${ok ? '✅' : '⏳'} Net worth on track?<br><small class="muted">By now (${Math.round(p * 100)}% of the way) you'd want about ${fmt(want)} in 2027 dollars</small></span><span><b>${ok ? 'On track' : `${Math.round(real / want * 100)}% there`}</b></span></div>`;
}
function scoreButton(){
  if (S.practice) return '';
  const sc = lifeScore(), d = S.scoreQ == null ? 0 : sc.score - S.scoreQ;
  return `<button class="scorebtn" id="scorenow" aria-label="Life Score so far ${sc.score}, ${sc.title}: see how it adds up">
    <span>🏆 Life Score so far</span><span><b>${sc.score}</b> ${sc.title}${S.scoreQ != null && d ? ` <span class="delta ${d>0?'up':'down'}">${d>0?'▲':'▼'}${Math.abs(d)}</span>` : ''} ›</span></button>`;
}
const SCORE_TIPS = {
  happy:'Happiness is your weakest part. Rest, Get outside and trips with friends help; long commutes, overtime and debt hurt.',
  health:'Health is your weakest part. Rest, Get outside and a doctor checkup help; physical jobs and overtime wear you down.',
  community:'Community is your weakest part. Show up for town, help in events, work in Waitsburg, or join a carpool.',
  wealth:'Net worth is your weakest part. A better-paying job, the 401(k), owning a home and stock-up grocery runs add up.'
};
function showScoreNow(){
  const { score, title, avgH, avgHe, nw, real, parts } = lifeScore(), L = LENGTHS[S.len];
  const part = (l, sub, v, w) => `<div class="kv"><span>${l}<br><small class="muted">${sub}</small></span><span><b>${v}</b>/100 × ${w}% = <b>${Math.round(v * w / 100)}</b></span></div>`;
  const weakest = Object.entries(parts).sort((a, b) => a[1] - b[1])[0][0];
  sheet(`<h2>🏆 Life Score so far: ${score}</h2>
    <p class="muted">${title}${mode() !== 'normal' ? ` (${MODES[mode()].name})` : ''}. This is what you'd score if the game ended today.${S.scoreQ != null ? ` Last report card: ${S.scoreQ}.` : ''}</p>
    ${part('Happiness', `average ${Math.round(avgH)} so far`, parts.happy, 30)}
    ${part('Health', `average ${Math.round(avgHe)} so far`, parts.health, 20)}
    ${part('Community', `now ${Math.round(S.community)}`, parts.community, 20)}
    ${part('Net worth', `${fmt(nw)}${S.col > 1.05 ? ` (${fmt(real)} in 2027 dollars)` : ''} of ${fmt(L.target)} by the end`, parts.wealth, 30)}
    ${wealthTrack(real)}
    ${goalBonus() ? `<div class="kv"><span>🎯 Life goals reached</span><span><b>+${goalBonus()}</b></span></div>` : ''}
    ${modeScoreNote()}
    <div class="card tip" style="margin-top:10px"><div>💡 ${SCORE_TIPS[weakest]}</div></div>
    <p class="muted">A report card goes in your Journal every 13 weeks.</p>
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
}
EVENTS.push(...STORY_EVENTS);
/* ---------- ending ---------- */
// Life Score: average happiness 30%, average health 20%, community 20%, net worth vs. the length's target 30%
function lifeScore(){
  const L = LENGTHS[S.len];
  const mp = Math.max(1, S.monthsPlayed);
  const avgH = S.happySum ? S.happySum/mp : S.happy, avgHe = S.healthSum ? S.healthSum/mp : S.health;
  // each part maps to 0–100 so that a middling life lands in the middle: happiness 30→0 and 90→100,
  // health 40→0 and 95→100, community 10→0 and 90→100, and net worth (in 2027 dollars) against the length's target
  const nw = netWorth(), real = nw / (S.col || 1), wealth = clamp(real / L.target * 100);
  const hp = clamp((avgH - 30) / 60 * 100), he = clamp((avgHe - 40) / 55 * 100), cm = clamp((S.community - 10) / 80 * 100);
  const bonus = goalBonus();                      // pinned life goals reached (#66)
  const score = Math.min(100, Math.round(hp*0.3 + he*0.2 + cm*0.2 + wealth*0.3) + bonus);
  const title = score >= 85 ? 'Legend of the Burg' : score >= 70 ? 'Pillar of the Community' : score >= 55 ? 'Solid Waitsburger' : score >= 40 ? 'Getting By on Main Street' : 'Tumbleweed';
  return { score, title, avgH, avgHe, nw, real, wealth, bonus, parts: { happy: Math.round(hp), health: Math.round(he), community: Math.round(cm), wealth: Math.round(wealth) } };
}
function finish(reason){
  const { score, title, avgH, avgHe, nw, real, wealth, parts, bonus } = lifeScore();
  const part = (l, sub, v, w) => `<div class="kv"><span>${l}<br><small class="muted">${sub}</small></span><span><b>${v}</b>/100 × ${w}% = <b>${Math.round(v * w / 100)}</b></span></div>`;
  const sc = SCENARIOS[S.scenario], scWin = sc ? (S.scWon || sc.win()) : false;
  if (sc && scWin) markChallenge(S.scenario);
  const best = store.get(BEST_KEY) || {};
  const bk = sc ? `sc-${S.scenario}` : S.weekly ? `wk-${S.weekly}` : bestKey(S.len, mode());
  const isBest = !best[bk] || score > best[bk];
  if (isBest && !S.practice) { best[bk] = score; store.set(BEST_KEY, best); }
  if (!S.practice) writeSlot(S.slot ?? 0, null);
  S.over = true;
  sheet(`<h2 style="text-align:center">${esc(S.name)}'s life in the Burg</h2>
    <p class="muted" style="text-align:center">${reason}</p>
    ${S.bg !== 'fresh' || mode() !== 'normal' ? `<p class="muted" style="text-align:center">${BACKGROUNDS[S.bg].ic} ${BACKGROUNDS[S.bg].name} · ${MODES[mode()].ic} ${MODES[mode()].name}</p>` : ''}
    <div class="score">${score}</div>
    <p style="text-align:center;margin-top:0"><b>${title}</b>${mode() !== 'normal' ? ` <span class="tag">${MODES[mode()].ic} ${MODES[mode()].name} score</span>` : ''}${isBest ? ` · <span class="tag cur">New best${mode() !== 'normal' ? ` (${MODES[mode()].name})` : ''}!</span>` : ''}</p>
    ${modeScoreNote()}
    <h3 style="margin-top:10px">How the score adds up</h3>
    ${part('Happiness', `average ${Math.round(avgH)} (30 → 0, 90 → 100)`, parts.happy, 30)}
    ${part('Health', `average ${Math.round(avgHe)} (40 → 0, 95 → 100)`, parts.health, 20)}
    ${part('Community', `ended at ${Math.round(S.community)} (10 → 0, 90 → 100)`, parts.community, 20)}
    ${part('Net worth', `${fmt(nw)}${S.col > 1.05 ? ` (${fmt(real)} in 2027 dollars)` : ''} of ${fmt(LENGTHS[S.len].target)}`, parts.wealth, 30)}
    ${bonus ? `<div class="kv"><span>🎯 Life goals reached</span><span><b>+${bonus}</b></span></div>` : ''}
    ${sc ? `<div class="card ${scWin ? 'tip' : 'warn'}" style="margin-top:10px">${sc.ic} <b>${scWin ? 'Challenge complete!' : 'Challenge not met this time.'}</b> ${sc.name}: ${sc.desc}</div>` : ''}
    ${Object.keys(S.badges || {}).length ? `<h3 style="margin-top:10px">Badges</h3><p>${BADGES.filter(b => S.badges[b.id]).map(b => `${b.ic} ${b.name}`).join(' · ')}</p>` : ''}
    <h3 style="margin-top:10px">Your life</h3>
    ${S.kids && S.kids.length ? `<div class="kv"><span>Kids raised</span><span>${S.kids.length}</span></div>` : ''}
    <div class="kv"><span>Final age</span><span>${age()}</span></div>
    <div class="kv"><span>Education</span><span>${EDU[S.edu]}</span></div>
    ${S.biz ? `<div class="kv"><span>🏪 Business</span><span>${BIZ[S.biz.type].name}, earned ${fmt(S.biz.earned)}</span></div>` : ''}
    ${S.gen > 1 ? `<div class="kv"><span>🌳 Generation</span><span>${S.gen}</span></div>` : ''}
    ${!S.practice ? '<button class="btn ghost" id="share">📤 Share score card</button>' : ''}
    ${LENGTHS[S.len].turns === Infinity && (S.kids || []).length && !S.practice ? `<button class="btn primary" id="legacy">🌳 Continue as your grandkid</button>` : ''}
    <button class="btn ${LENGTHS[S.len].turns === Infinity && (S.kids || []).length && !S.practice ? 'ghost' : 'primary'}" id="again">Play again</button>`);
  const parent = { name:S.name, nw:netWorth(), community:S.community, slot:S.slot, mode:mode(), gen:S.gen || 1, date:S.date, col:S.col, wage:S.wage };
  if ($('#share')) $('#share').onclick = shareCard;
  if ($('#legacy')) $('#legacy').onclick = () => legacySheet(parent);
  $('#again').onclick = () => { closeSheet(); S = null; useDice(); renderTitle(); };
}
