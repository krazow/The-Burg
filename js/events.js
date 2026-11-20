// The Burg: events.js (part 4 of 8; scripts load in order and share one global scope)
/* ---------- events ---------- */
// G5: events are paced by category so new ones don't crowd out the old. Each week one roll decides which category
// (if any) gets an event: town 14%, road 8% (only in weeks you commute 20+ miles each way or take a trip),
// work 8% (only with a job). At most one event a week; Hard mode adds 25% to each.
const EVENT_ODDS = { town: 0.14, road: 0.08, work: 0.08 };
const evCat = e => e.cat || 'town';
function eventOdds(trip){
  const hard = mode() === 'hard' ? 1.25 : 1, hasJob = !!job() && !S.retired;
  return { town: EVENT_ODDS.town * hard, road: trip || commuteOneWay() >= 20 ? EVENT_ODDS.road * hard : 0, work: hasJob ? EVENT_ODDS.work * hard : 0 };
}
function rollEvent(month, trip){
  S.roadTo = trip && trip.city ? trip.city : commuteOneWay() >= 20 ? job().city : null;   // where this week's drive goes
  const due = planDue(month); if (due) return due;   // i3-a30/a31/a32: life decisions that come when they're due
  { const k = kidSendOff(); if (k) return k; }       // i46-a02: a kid turning 18 always gets a send-off
  { const f = fixedEvent(month); if (f) return f; }  // i5-a04: the town's signature yearly events always come
  { const s = startEvent(month); if (s) return s; }  // i17-a03: the first 8 weeks have their own small pool (js/starts.js)
  const odds = eventOdds(trip);
  let r = Math.random();
  for (const cat of ['town', 'road', 'work']) { if (r < odds[cat]) return pickEvent(month, cat); r -= odds[cat]; }
  return null;
}
// i5-a04: signature town-calendar events (fixed:1, for now Celebration Days, with its payoff scaled down a little so doing
// nothing doesn't score more) come every year in their month: about half the time in a given week,
// and for sure in the month's last week if they haven't come yet (an event's yearly cooldown says it already came)
function fixedEvent(month){
  const last = new Date(S.date + 7 * 864e5).getMonth() !== month;
  const e = EVENTS.find(x => x.fixed && !(S.evCd[x.title] > S.turn) && !(x.once && S.evDone[x.title]) && (!x.when || x.when(month)));
  return e && (last || chance(0.5)) ? e : null;
}
// i46-a02/a03: kids by birth order, and the one (if any) who turns 18 this week without a send-off yet
const kidOrder = i => { const n = (S.kids || []).length; return n <= 1 ? 'Your kid' : i === 0 ? 'Your oldest' : i === n - 1 ? 'Your youngest' : 'Your middle one'; };
const kidTurning18 = () => (S.kids || []).findIndex((b, i) => !(S.kidSent || []).includes(i) && yrsOf(S.ageMonths + W - b) >= 18 && kidAge(b) < 19
  && (kidAge(b) < 18 || !(S.evCd['A kid heads off to college'] > S.turn)));   // an older save's kid who already had the old random send-off
function kidSendOff(){ return kidTurning18() >= 0 ? EVENTS.find(e => e.title === 'A kid heads off to college') : null; }
// each week (after birthdays): a kid who just turned 18 graduates and moves out, in the Journal and the year in review (i46-a04)
function kidBirthdays(m){
  (S.kids || []).forEach((b, i) => { if (kidAge(b) >= 18 && yrsOf(S.ageMonths - m - b) < 18) log(`${kidOrder(i)} graduated from Waitsburg High and moved out.`, 'mile', 1); });
}
function pickEvent(month, cat = 'town'){
  const wt = e => typeof e.w === 'function' ? e.w() : (e.w || 1);
  const ok = EVENTS.filter(e => evCat(e) === cat && !(e.start && S.turn >= START_WEEKS) && !(S.evCd[e.title] > S.turn) && !(e.once && S.evDone[e.title]) && (!e.when || e.when(month)) && !(e.big && wxCapped()) && wt(e) > 0);   // i75-a23: at most 2 big weather hits a year
  const total = ok.reduce((a,e) => a + wt(e), 0);
  let r = Math.random() * total;
  for (const e of ok) { r -= wt(e); if (r <= 0) return e; }
  return null;
}
// i71-b03: one way to settle an event, for a tapped choice and for one resolved on its own during a skip: the choice,
// the weather bill, the Journal, the week strip and the map pin, and only now the event's cooldown (i22-a01)
function resolveChoice(ev, choice, auto = false){
  const m0 = S.money, result = choice.go() || '', dm = S.money - m0;
  wxTrack(ev, dm);                          // i75-a30: the weather bill
  if (result) { log(`${ev.title}: ${result}`); if (S.evLabel) S.log[0].d = S.evLabel; }   // dated the week it happened
  if (S.run) S.run.happened.push({ ic: ev.ic, title: ev.title, money: dm, wx: !!ev.wx, ...(auto ? { auto: 1 } : {}) });
  if (S.evPins && S.evPins[0] && S.evPins[0].t === ev.title) S.evPins[0].r = result;
  const at = S.evAt ?? S.turn;
  S.evCd[ev.title] = at + (ev.yr ? 40 : 8);
  if (ev.once) S.evDone[ev.title] = 1;
  S.pendingEv = null; S.evAt = null;
  return { result, dm };
}
function showEvent(ev, then = null){
  const before = {happy:S.happy, health:S.health, community:S.community};
  const choices = ev.choices().filter(c => !c.if || c.if());
  const pin = S.evPins && S.evPins[0] && S.evPins[0].t === ev.title ? [S.evPins[0].m, S.evPins[0].k] : eventPlace(ev);
  sheet(`<div class="big">${ev.ic}</div><h2 style="text-align:center">${ev.title}</h2><p class="evplace">📍 ${esc(placeName(pin))}${pin[0] === 'R' ? ' · on the region map' : ''}</p><p id="evtext" data-desc>${typeof ev.text==='function'?ev.text():ev.text}</p>
    <div class="evchoices">${choices.map((c,i) => `<button class="btn ${i===0?'primary':'ghost'}" data-i="${i}">${c.label}</button>`).join('')}</div>`);
  $('#sheet').classList.add('ev');            // i2-a24: the choices sit at the bottom of the pop-up, in thumb reach
  sfx('event'); buzz('event');
  document.querySelectorAll('#sheet [data-i]').forEach(b => b.onclick = () => {
    const { result, dm } = resolveChoice(ev, choices[+b.dataset.i]);
    save();
    const st = ['happy', 'health', 'community'].reduce((a, k) => a + S[k] - before[k], 0);
    sfx(dm < 0 || st < -1 ? 'bad' : dm > 0 || st > 1 ? 'good' : 'tap');
    if (choices.length === 1) { closeSheet(); render(); toast(`${ev.ic} ${result}${dm ? ` (${dm>0?'+':''}${fmt(dm)})` : ''}`); if (then) showReview(then); return; }
    sheet(`<div class="big">${ev.ic}</div><h2 style="text-align:center">${ev.title}: how it went</h2><p id="evresult" data-desc>${result}</p>
      <p>${dm ? `<span class="delta ${dm>0?'up':'down'}">${dm>0?'+':''}${fmt(dm)}</span>` : ''}${deltaChips(before)}</p>
      <div class="evchoices"><button class="btn primary" id="ok">Continue</button></div>`);
    $('#sheet').classList.add('ev');          // the result keeps the same layout, so Continue is where the choice was
    $('#ok').onclick = () => { closeSheet(); render(); if (then) showReview(then); };
  });
}
// where each event happens: ['T', place] on the Waitsburg map or ['R', town or landmark] on the region map;
// 'work' means wherever you work
const EVENT_PLACE = {
  'Celebration Days':['T','fair'], 'Harvest time':['T','fields'], 'Snow on Highway 12':['T','hwy'], 'Truck trouble':['T','home'],
  'The Touchet is running high':['T','river'], 'Wine country weekend':['R','wallawalla'], 'Powder day at Bluewood':['R','bluewood'],
  'Tax refund':['T','board'], 'A raise':'work', 'Layoffs':'work', 'A friendly stray':['T','home'], 'Someone catches your eye':['T','mainst'],
  'A rough patch':['T','home'], 'Run for town council?':['T','mainst'], 'Fair & Frontier Days':['R','wallawalla'], 'Hunting season':['R','bluewood'],
  'Feeling run down':['R','wallawalla'], 'Windstorm':['T','home'], 'Walla Walla Sweets are in':['R','wallawalla'],
  'Festival at the Dayton Depot':['R','dayton'], 'A tip from a friend':['T','mainst'], 'Gas prices spike':['T','hwy'],
  "Neighbor's moving day":['T','home'], 'Found money':['T','home'], 'An inheritance':['T','board'], 'Starting a family?':['T','home'],
  'The trip of a lifetime':['R','pasco'], 'A kid heads off to college':['T','school'], 'Friday night game':['T','school'], 'Toothache':['R','wallawalla'],
  'The porch is sagging':['T','home'], 'The kitchen is next':['T','home'], 'The house is coming together':['T','home'],
  "A friend's food truck":['T','mainst'], 'Opening day for the food truck':['T','fair'], 'A year of the food truck':['T','fair'],
  'Harvest: sell or store?':['T','elevator'], 'Market drop':['R','wallawalla'], 'Calving season':['R','bluewood'], 'A hard winter on the herd':['R','bluewood'],
  'Wildfire smoke over the valley':['R','wallawalla'], 'A break-in':['T','home'], 'A kitchen fire':['T','home'], 'Catalytic converter stolen':['T','home'],
  'Water in the basements':['T','river'], 'A levee for the town':['T','river'], 'The levee is dedicated':['T','river']
};
const WORK_SPOT = { farmhand:'fields', diner:'mainst', para:'school', elevator:'elevator', insure:'mainst', teacher:'school', harvtruck:'fields', remote:'library' };
function eventPlace(ev){
  let pl = EVENT_PLACE[ev.title] || ['T','mainst'];
  const j = S.retired ? null : job();
  if (pl === 'road') pl = ['R', roadTown()];
  if (pl === 'work') pl = !j ? ['T','mainst'] : j.city === 'waitsburg' ? ['T', WORK_SPOT[j.id]] : ['R', j.city];
  if (pl[1] === 'hwy' && !(j && j.city !== 'waitsburg')) pl = ['T','home'];   // the highway pin only shows for commuters
  return pl;
}
function placeName([m, k]){
  if (m === 'R') return CITIES[k] ? CITIES[k].name : (LANDMARKS.find(l => l.k === k) || {}).name || k;
  const tp = townPlaces().find(p => p.k === k);
  return tp ? (tp.k === 'home' ? 'Home' : tp.name) + (tp.k === 'hwy' ? '' : ', Waitsburg') : 'Waitsburg';
}
// events from the last 4 weeks at a place on a map
const recentAt = (m, k) => (S.evPins || []).filter(p => p.m === m && p.k === k && S.turn - p.turn <= 4);
function evBadge(m, k, x, y){
  const r = recentAt(m, k); if (!r.length) return '';
  const fresh = S.turn - r[0].turn <= 1;
  return `<g class="evbadge${fresh ? ' fresh' : ''}" pointer-events="none"><circle cx="${x}" cy="${y}" r="10" fill="#ffd166" stroke="#9b2f1f" stroke-width="1.5"/><text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle">${r[0].ic}</text></g>`;
}
function recentList(m, k){
  const r = recentAt(m, k); if (!r.length) return '';
  return `<div class="recent"><b>📍 Recently here</b>${r.map(p => `<div class="s">${p.ic} ${esc(p.t)} · ${S.turn - p.turn <= 1 ? 'this week' : (S.turn - p.turn) + ' weeks ago'}${p.r ? `: ${esc(p.r)}` : ''}</div>`).join('')}</div>`;
}
const inM = (m, ...ms) => ms.includes(m);
const herd = () => S.biz && S.biz.type === 'cattle' ? S.biz : {};
const commuting = () => commuteOneWay() > 0;

const EVENTS = [
  { ic:'🐎', title:'Celebration Days', yr:1, fixed:1, w:4, when:m => inM(m,4),
    text:'Waitsburg\'s big spring weekend: parade down Main Street, horse races, and a beer garden.',
    choices:() => [
      {label:`Go to the parade and races (-${fmtc(60)})`, go:() => { adj({money:-cost(60), happy:6, community:2}); return 'You cheered yourself hoarse at the races.'; }},
      {label:`Put ${fmtc(100)} on a long-shot horse`, go:() => { if (chance(.28)) { adj({money:cost(400), happy:10}); return `The long shot came in! You won ${fmtc(500)} and bragging rights.`; } adj({money:-cost(100), happy:-1}); return 'Your horse is still running, probably.'; }},
      {label:'Stay home', go:() => { adj({happy:-2}); return 'You heard the parade from your porch.'; }}
    ]},
  { ic:'🌾', title:'Harvest time', yr:1, w:5, when:m => inM(m,6,7),
    text:() => S.jobId==='farmhand' ? 'Wheat is ready and the combines run dawn to dark. The boss is paying harvest overtime.' : 'A farmer up the road is short a truck driver for wheat harvest.',
    choices:() => S.jobId==='farmhand' ? [
      {label:'Run the combine all month', go:() => { adj({money:cost(1500), health:-4, happy:2}); return 'Long, dusty days, but a fat harvest bonus.'; }}
    ] : [
      {label:'Drive grain trucks on weekends', go:() => { adj({money:cost(900), health:-3, community:4}); return 'Hauled wheat to the elevator. The farmer won\'t forget it.'; }},
      {label:'Pass this year', go:() => 'You watched the dust plumes from town.'}
    ]},
  { ic:'❄️', title:'Snow on Highway 12', w:4, when:m => inM(m,11,0,1) && commuting(),
    text:'Overnight snow and ice on the highway. Your commute looks ugly.',
    choices:() => [
      {label:'Drive in slow and careful', go:() => { if (chance((CARS[S.car].mpg>25 ? .3 : .2) * ditchMult())) { const c = cost(850), p = youPay('auto', c); adj({money:-p, health:-3, happy:-4}); return `You slid into a ditch. A tow and repairs ran ${fmt(c)}.${covered(c, p)}`; } adj({happy:-1}); return 'White knuckles the whole way, but you made it.'; }},
      {label:'Take an unpaid day', go:() => { const p = Math.round((job()?payNow(job(), true):0)/WORKDAYS); adj({money:-p, happy:2}); return `You stayed home with coffee and lost a day's pay.`; }}
    ]},
  { ic:'🔧', title:'Truck trouble', w:4, when:() => chance(CARS[S.car].breakdown * 4 * careMult() * (onBus() ? 0.5 : 1)),   // i3-a14: the bus saves wear
    text:() => `Your ${CARS[S.car].name.toLowerCase()} won't start.`,
    choices:() => [
      {label:'Take it to the shop', go:() => { const c = shopCost(); adj({money:-c, happy:-2}); return `The shop fixed it for ${fmt(c)}.`; }},
      {label:`Fix it yourself (-${fmtc(80)} in parts)`, if:() => skillLv('mechanic') >= 2, go:() => { adj({money:-Math.round(cost(80)), happy:2}); practice('mechanic', 1); return 'A new starter and a skinned knuckle later, it runs.'; }},
      {label:'Call a buddy who knows engines', if:() => S.community >= 40, go:() => { adj({community:2});   // i66-b07: it works 60% of the time
        if (chance(.6)) { adj({money:-cr(120)}); return 'Your buddy fixed it for parts and a six-pack.'; }
        const c = Math.round(shopCost() * 0.7); adj({money:-c, happy:-1}); return `Your buddy couldn't sort it out, but he knows the shop owner: ${fmt(c)}, about 30% off the usual price.`; }}
    ]},
  { ic:'🌊', title:'The Touchet is running high', yr:1, w:() => wxYear().wet ? 6 : wxDry() ? 0.5 : 2, when:m => inM(m,1,2,3),   // i75-a01: a wet spring brings it, a dry one rarely
    text:'Snowmelt and rain have the river climbing. Neighbors are filling sandbags.',
    choices:() => [
      {label:'Help sandbag', go:() => { adj({community:6, health:-2, happy:2}); S.highWater = S.turn; S.sandbagged = S.turn; return 'Muddy, cold and proud. The town held the line, for now.'; }},   // i15-a05: the levee story can follow either way
      {label:'Stay dry', go:() => { S.highWater = S.turn; S.sandbagged = null; if (S.home==='fixer' && chance(.4)) { const h = helpCut(floodBill(cost(2500))); adj({money:-h.c, happy:-6}); return `Water got in your basement. Cleanup cost ${fmt(h.c)}.${h.line}`; } adj({community:-2}); return 'The water stayed in its banks this time.'; }}
    ]},
  { ic:'🍷', title:'Wine country weekend', w:2, when:m => age() >= 21 && m >= 3 && m <= 9,   // i66-b02: April to October
    text:'Friends are heading to Walla Walla tasting rooms on Saturday.',
    choices:() => [
      {label:`Go along (-${fmtc(90)})`, go:() => { adj({money:-cost(90), happy:6}); return 'A sunny afternoon among the vineyards.'; }},
      {label:`Be the designated driver (-${fmtc(20)})`, go:() => { adj({money:-cost(20), happy:3, community:3}); return 'Everyone got home safe, thanks to you.'; }},
      {label:'Not this time', go:() => 'You saved your money.'}
    ]},
  { ic:'⛷️', title:'Powder day at Bluewood', w:3, when:m => inM(m,0,1,2),
    text:'Fresh snow up above Dayton. The lifts open at nine.',
    choices:() => [
      {label:skiPass() ? 'Hit the slopes (season pass)' : `Hit the slopes (-${fmtc(75)})`, go:() => { const lift = skiPass() ? 0 : cost(75);
        if (chance(.1)) { const care = medBill(300); adj({money:-(lift + care), health:-6, happy:2}); return `Great runs until you twisted a knee. Urgent care cost ${fmt(care)}.`; }
        adj({money:-lift, happy:7, health:2}); return skiPass() ? 'Bluebird skies, fresh tracks, and your season pass paid for itself a little more.' : 'Bluebird skies and fresh tracks.'; }},
      {label:'Skip it', go:() => 'Maybe next storm.'}
    ]},
  { ic:'🧾', title:'Tax refund', yr:1, w:4, when:m => inM(m,2,3) && S.jobId,
    text:'Your return is in.',
    choices:() => [{label:'Nice!', go:() => { const r = Math.round(cost(ri(300,1300))); adj({money:r, happy:3}); return `The IRS sent back ${fmt(r)}.`; }}]},
  { ic:'📈', title:'A raise', w:3, when:() => job() && !S.retired && S.jobMonths >= 12 && S.raise < RAISE_CAP - 0.02,
    text:() => `Your boss at the ${job().title.toLowerCase()} job calls you in.`,
    choices:() => [{label:'Hear them out', go:() => { const g = bumpPay(1.06); S.jobMonths = 0; adj({happy:5}); return raiseNote(g); }}]},
  { ic:'📉', title:'Layoffs', yr:1, w:() => 0.8 * (LAYOFF_RISK[S.jobId] ?? .5) * (mode() === 'hard' ? 1.6 : 1) * (job() && job().union ? 0.5 : 1) * wxLayoffF(), when:() => job() && !S.retired && S.jobMonths >= 9,
    text:() => `Business is slow and cuts are coming at your ${job().title.toLowerCase()} job.`,
    choices:() => [
      {label:'Ask to stay on', go:() => { if (chance(.5 + S.community*0.003)) { adj({happy:-2}); return 'They kept you on. Phew.'; } const t = job().title; leaveJob('laid'); S.ui = 6; adj({happy:-10}); return `You were let go from your ${t.toLowerCase()} job. Check the job board.`; }},
      {label:'Take the severance', go:() => { const p = payNow(job(), true); leaveJob('laid'); adj({money:p*2, happy:-5}); return `You took two months' pay (${fmt(p*2)}) and walked.`; }}
    ]},
  { ic:'🐕', title:'A friendly stray', w:3, when:() => !S.dog,
    text:'A scruffy dog follows you all the way home from the park.',
    choices:() => [
      {label:'Keep it', go:() => { S.dog = true; adj({happy:8}); log('Took in a scruffy stray: you have a dog now.', undefined, 1); return 'You have a dog now. Best decision all year.'; }},
      {label:'Find it a home', go:() => { adj({community:3}); return 'A family on Main Street took it in.'; }}
    ]},
  { ic:'☕', title:'Someone catches your eye', w:2, when:() => !S.partner && age() >= 19 && age() < 75,
    text:'You keep running into the same person at Howlin\' Bean on Main Street.',
    choices:() => [
      {label:'Ask them out', go:() => { const boost = S.danceBoost; S.danceBoost = false; if (chance(boost ? .72 : .6)) /* W27: a barn dance makes it 20% likelier */ { S.partner = true; adj({happy:10}); meetPartner(); log(`Started dating ${S.partnerName}.`, undefined, 1); return `${S.partnerName} said yes! You're seeing each other now.`; } adj({happy:-3}); return 'They\'re flattered but not interested. Ouch.'; }},
      {label:'Just smile', go:() => 'Maybe next time.'}
    ]},
  { ic:'💔', title:'A rough patch', w:1, when:() => S.partner,
    text:() => `You and ${partnerWord()} have been arguing a lot lately.`,
    choices:() => [
      {label:`Plan a getaway to the coast (-${fmtc(400)})`, go:() => { adj({money:-cost(400)}); if (chance(.8)) { adj({happy:4}); return 'A weekend away fixed a lot.'; } S.partner = false; adj({happy:-10}); return `It didn't help. You and ${partnerWord()} split up.`; }},
      {label:'Let it run its course', go:() => { if (chance(.5)) { adj({happy:1}); return 'Things settled down on their own.'; } S.partner = false; adj({happy:-10}); return 'You went your separate ways.'; }}
    ]},
  { ic:'🏛️', title:'Run for town council?', yr:1, w:5, when:() => S.community >= 60 && !S.council && age() >= 21,
    text:'People keep telling you that you should run for Waitsburg city council.',
    choices:() => [
      {label:`Run (-${fmtc(300)} for signs)`, go:() => { adj({money:-cost(300)}); if (chance(.65)) { S.council = true; adj({community:10, happy:5}); log('Won a seat on the town council.', 'mile', 1); return 'You won the seat! Meetings are Wednesday nights.'; } adj({happy:-4}); return 'You lost by eleven votes.'; }},
      {label:'Not for me', go:() => 'You\'ll keep helping from the sidelines.'}
    ]},
  { ic:'🎡', title:'Fair & Frontier Days', yr:1, w:3, when:m => inM(m,7,8),
    text:'The fair and rodeo are on in Walla Walla.',
    choices:() => [
      {label:`Go for the rodeo (-${fmtc(70)})`, go:() => { adj({money:-cost(70), happy:7}); return 'Corn dogs, bull riding and a sunburn.'; }},
      {label:`Enter your pie (-${fmtc(20)})`, go:() => { adj({money:-cost(20)}); if (chance(.3)) { adj({community:6, happy:8}); return 'Blue ribbon! Your pie is famous now.'; } adj({happy:2}); return 'No ribbon, but the judges asked for seconds.'; }},
      {label:'Skip it', go:() => 'You\'ll go next year.'}
    ]},
  { ic:'🦌', title:'Hunting season', yr:1, w:3, when:m => inM(m,9,10),
    text:'Deer season opens in the Blue Mountains.',
    choices:() => [
      {label:`Buy a tag and go (-${fmtc(150)})`, go:() => { adj({money:-cost(150)}); if (chance(.5)) { adj({money:cost(450), happy:5}); return 'You filled your tag. The freezer is full for winter.'; } adj({happy:2}); return 'No deer, but a great sunrise.'; }},
      {label:'Pass', go:() => 'You stayed in town.'}
    ]},
  { ic:'🩺', title:'Feeling run down', w:5, when:() => S.health < 45,   // i66-b17: before it gets bad
    text:'You\'ve been tired and achy for weeks. The Burg Clinic on Main Street can see you this week.',
    choices:() => [
      {label:`See a doctor at The Burg Clinic (-${fmt(medBill(350))})`, go:() => { const bad = S.health < 25; adj({money:-medBill(350), health:12}); return bad ? 'The doctor sent you to a specialist in Walla Walla. Rest and a prescription helped a lot.' : 'Some rest and a prescription helped a lot.'; }},
      {label:'Tough it out', go:() => { adj({health:-6}); return 'You kept going. Your body kept score.'; }}
    ]},
  { ic:'🦷', title:'Toothache', w:2, when:() => S.turn - (S.dentist ?? 0) > 52,
    text:'A back tooth has been throbbing for days. It\'s been more than a year since you saw a dentist.',
    choices:() => [
      {label:`Emergency dentist in Walla Walla (-${fmtc(650)})`, go:() => { adj({money:-Math.round(cost(650)), health:-1}); S.dentist = S.turn; return 'A root canal later, you can chew again. A yearly checkup would have caught it.'; }},
      {label:'Tough it out', go:() => { adj({health:-4, happy:-4}); return 'Ice packs and ibuprofen. It still hurts.'; }}
    ]},
  // i75-a12: owners lose shingles, and every roofer in the valley is booked for weeks (windChoices, below)
  // i15-a03: storm season (October to March), once a year at most, with a choice to get ready (last in windChoices)
  { ic:'🌬️', title:'Windstorm', yr:1, w:2, when:m => inM(m,9,10,11,0,1,2),
    text:() => `The forecast calls for a big wind tonight, and the old limb over the ${HOMES[S.home].own ? 'roof' : 'driveway'} is already creaking.${HOMES[S.home].own ? ' If the shingles go, every roofer in the valley will be booked.' : ''}`,
    choices:() => windChoices() },
  { ic:'🧅', title:'Walla Walla Sweets are in', yr:1, w:3, when:m => inM(m,5,6),
    text:'The sweet onion harvest is here.',
    choices:() => [
      {label:`Host a backyard BBQ (-${fmtc(80)})`, go:() => { adj({money:-cost(80), community:4, happy:4}); return 'Grilled onions for the whole block.'; }},
      {label:`Grab a bag (-${fmtc(15)})`, go:() => { adj({money:-cost(15), happy:2}); return 'Onion rings for a week.'; }}
    ]},
  { ic:'🚂', title:'Festival at the Dayton Depot', yr:1, w:2, when:m => inM(m,5,6,7,8),
    text:'Dayton is throwing a summer festival around its historic train depot.',
    choices:() => [
      {label:`Drive over (-${fmtc(40)})`, go:() => { adj({money:-cost(40), happy:5}); return 'Live music, old trains and good food.'; }},
      {label:'Skip it', go:() => 'Another time.'}
    ]},
  // i66-b01: only when a better-paying job is really open; i22-a09: the button shows today's weekly pay, like the job board
  { ic:'💡', title:'A tip from a friend', w:2, when:() => S.community >= 50 && !S.retired && tipJobs().length > 0,
    text:'A friend says there\'s an opening nobody\'s posted yet. They could put in a word.',
    choices:() => {
      const opts = tipJobs();
      if (!opts.length) return [{label:'Thanks anyway', go:() => { adj({community:1}); return 'Nothing beats what you have now.'; }}];
      const x = pick(opts);
      return [
        {label:`Take it: ${x.title} in ${CITIES[x.city].name} (${wk(payNow(x, false))})`, go:() => { startJob(x.id); adj({happy:4}); return `You start as ${x.title} in ${CITIES[x.city].name}.`; }},
        {label:'Stay where I am', go:() => 'You thanked them and passed.'}
      ];
    }},
  { ic:'⛽', title:'Gas prices spike', w:2, when:() => commuteOneWay() >= 20,
    text:'Prices jumped at the pump this month.',
    choices:() => [
      {label:'Pay up', go:() => { const c = Math.round(commuteCost(commuteOneWay(), CARS[S.car], job())*0.25); adj({money:-c, happy:-2}); return `Your commute costs ${fmt(c)} extra this month.`; }},
      {label:'Find a carpool', if:() => S.community >= 35, go:() => { adj({community:2}); return 'You split rides with a coworker from Waitsburg.'; }}
    ]},
  { ic:'📦', title:'Neighbor\'s moving day', w:2,
    text:'The family next door needs help loading a truck.',
    choices:() => [
      {label:'Lend a hand', go:() => { adj({community:4, health:-1}); return 'They paid in pizza and gratitude.'; }},
      {label:'Make an excuse', go:() => { adj({community:-2}); return 'They noticed.'; }}
    ]},
  { ic:'🧥', title:'Found money', w:1,
    text:'Something crinkles in your old winter coat.',
    choices:() => [{label:'Check the pocket', go:() => { const v = Math.round(cost(pick([20,50,100]))); adj({money:v, happy:2}); return `${fmt(v)}! Today is a good day.`; }}]},
  { ic:'📜', title:'An inheritance', once:1, w:1, when:() => LENGTHS[S.len].turns===Infinity && age() >= 40,
    text:'A letter from Mother Hubbard\'s Legal Cupboard on Main Street: a great-aunt in Spokane left you something in her will.',
    choices:() => [{label:'Read the letter', go:() => { const v = Math.round(cost(ri(5,30)*1000)); adj({money:v, happy:3}); return `She left you ${fmt(v)} and a note telling you to stay out of trouble.`; }}]},
  { ic:'👶', title:'Starting a family?', yr:1, w:3, when:() => S.partner && age() >= 23 && age() <= 42 && S.kids.length < 3,
    text:() => S.kids.length ? `You and ${partnerWord()} are talking about another one.` : `You and ${partnerWord()} have been talking about kids.`,
    choices:() => [
      {label:`Have a baby (about ${fmtc(kidMonthly())}/mo until they're 18${childcareHelp() ? ', with state childcare help' : ''})`, go:() => { S.kids.push(S.ageMonths); adj({happy:12, community:3, health:-2}); log(S.kids.length > 1 ? `Baby number ${S.kids.length} arrived!` : 'Became a parent!', undefined, 1); return S.kids.length > 1 ? 'Another little Waitsburger! The house is louder and happier.' : 'A baby! Sleepless, broke and over the moon.'; }},
      {label:'Not now', go:() => 'You decided to wait.'}
    ]},
  { ic:'✈️', title:'The trip of a lifetime', yr:1, w:2, when:() => age() >= 28 && S.money > cost(12000),
    text:() => `You've always wanted to see the world. A big trip would cost about ${fmt(cost(5000))}.`,
    choices:() => [
      {label:'Book it', go:() => { adj({money:-Math.round(cost(5000)), happy:12, health:2}); return 'Two weeks away. You came home with a full camera roll and a new outlook.'; }},
      {label:'Keep saving', go:() => { adj({happy:-1}); return 'Maybe someday.'; }}
    ]},
  // i46-a02/a03: never rolled at random: kidSendOff() brings it, once per kid, the week they turn 18 (by birth order)
  { ic:'🎓', title:'A kid heads off to college', yr:1, w:0, when:() => kidTurning18() >= 0,
    text:() => `${kidOrder(Math.max(0, kidTurning18()))} just graduated from Waitsburg High and wants to go to college.`,
    // i22-a16: the full tuition only with the cash on hand; otherwise books, never more than you have
    choices:() => { const full = cr(15000), books = Math.min(cr(5000), Math.max(0, Math.floor(S.money))); return [
      {label:`Help with tuition (-${fmt(full)})`, if:() => S.money >= full, go:() => { adj({money:-full, happy:8, community:2}); return 'They\'re off to college with your help. Proud doesn\'t cover it.'; }},
      {label:`Help with books (-${fmt(books)})`, if:() => S.money < full && books > 0, go:() => { adj({money:-books, happy:5, community:1}); return 'You can\'t cover tuition, but their books and first-term fees are paid. They noticed.'; }},
      {label:'They\'ll take out loans', go:() => { adj({happy:2}); return 'They\'re off to college on their own dime.'; }}
    ]; }},
  // i3-a19: losses that your insurance choices decide
  { ic:'🚪', title:'A break-in', w:1,
    text:() => `Someone got into your ${HOMES[S.home].own ? 'house' : 'place'} while you were out. The TV, a laptop and some tools are gone.`,
    choices:() => [{label:S.ins && S.ins.renters === false && !HOMES[S.home].own ? 'Count what you lost' : 'Call the insurance company', go:() => {
      const c = cr(1800), p = youPay('stuff', c); adj({money:-p, happy:-4});
      return p >= c ? `Without renters insurance, replacing it all cost ${fmt(c)}.` : `You paid the ${fmt(p)} deductible.${covered(c, p)}`; }}]},
  { ic:'🔥', title:'A kitchen fire', yr:1, w:0.6,
    text:'A pan of grease went up on the stove. The Waitsburg volunteer firefighters were there in minutes, but the kitchen is a mess.',
    choices:() => [{label:'Call the insurance company', go:() => {
      if (HOMES[S.home].own) { const c = cr(9000), p = youPay('home', c); adj({money:-p, happy:-6}); return `Smoke, water and a new kitchen: ${fmt(c)} of work. You paid the ${fmt(p)} deductible.${covered(c, p)}`; }
      const c = cr(2500), p = youPay('stuff', c); adj({money:-p, happy:-5});
      return p >= c ? `The landlord's insurance fixed the building, but your things and a week at a motel cost you ${fmt(c)}. Renters insurance would have covered it.` : `Your renters insurance paid for your things and a week at a motel, after the ${fmt(p)} deductible.`; }}]},
  { ic:'🔩', title:'Catalytic converter stolen', w:1,
    text:() => `You start your ${CARS[S.car].name.toLowerCase()} and it roars like a tractor. Somebody sawed the catalytic converter off overnight.`,
    choices:() => [{label:'Get it replaced', go:() => { const c = cr(1600), p = youPay('auto', c); adj({money:-p, happy:-3});
      return S.ins && S.ins.auto === 'liab' ? `Liability insurance doesn't cover theft: the new one cost ${fmt(c)}.` : `Your full coverage paid for it after the ${fmt(p)} deductible.${covered(c, p)}`; }}]},
  // i3-a18: the herd (herd() is a throwaway object if the herd is gone by the time you choose)
  { ic:'🐄', title:'Calving season', yr:1, w:5, when:m => inM(m,1,2,3) && S.biz && S.biz.type === 'cattle',
    text:'A heifer is having a hard time calving up in the foothills, and it\'s 2 a.m.',
    choices:() => [
      {label:'Pull on your boots and help', go:() => { const h = herd(); h.saved = (h.saved || 0) + 1; adj({health:-3, happy:2}); h.check = S.turn; return 'A long, cold night, and a wobbly new calf by sunrise.'; }},
      {label:`Call the large-animal vet (-${fmtc(250)})`, go:() => { adj({money:-cr(250)}); const h = herd(); h.saved = (h.saved || 0) + 1; return 'The vet got the calf turned. Mother and calf are fine.'; }},
      {label:'Let nature take its course', go:() => { if (chance(0.5)) { const h = herd(); h.saved = (h.saved || 0) - 1; adj({happy:-3}); return 'You lost the calf.'; } return 'She managed on her own this time.'; }}
    ]},
  { ic:'🌨️', title:'A hard winter on the herd', yr:1, w:5, when:m => inM(m,11,0,1) && S.biz && S.biz.type === 'cattle' && S.biz.hard === (m >= 10 ? new Date(S.date).getFullYear() : new Date(S.date).getFullYear() - 1),
    text:'Snow on top of snow in the foothills, and the hay pile is shrinking fast.',
    choices:() => [
      {label:`Haul in extra hay (-${fmtc(600)})`, go:() => { adj({money:-cr(600)}); herd().check = S.turn; return 'The herd came through thin but fine.'; }},
      {label:'Stretch what you have', go:() => { const h = herd(); if (chance(0.4) && h.cows > 1) { h.cows--; adj({happy:-4}); return `You lost a cow to the cold. ${h.cows} left.`; } return 'It was close, but the herd made it to spring.'; }}
    ]},
  // i3-a17: smoke-year news for the wine futures
  { ic:'🌫️', title:'Wildfire smoke over the valley', yr:1, w:4, when:m => inM(m,7,8) && S.smoke === new Date(S.date).getFullYear(),
    text:() => `Fires in the Cascades sent smoke over the whole valley. The sky is orange, and the winemakers are worried about this year's grapes${(S.wine || []).length ? '' : ' (and this fall\'s wine futures)'}.`,
    choices:() => [
      {label:'Stay inside with the windows shut', go:() => { if (airFilterOn()) { adj({happy:-2}); return 'A week of board games, and the box-fan filter kept the air inside clean.'; } adj({happy:-2, health:-2}); return 'A week of board games, a scratchy throat and a headache by Friday.'; }},
      {label:`Drive up to Bluewood for clean air (-${fmtc(40)})`, go:() => { adj({money:-cr(40), happy:2, health:1}); return 'Blue sky above the smoke line.'; }}
    ]},
  { ic:'🏀', title:'Friday night game', w:2, when:m => inM(m,0,1,2,8,9,10,11),
    text:'The home team is playing in the school gym tonight.',
    choices:() => [
      {label:`Go cheer (-${fmtc(10)})`, go:() => { adj({money:-cost(10), community:3, happy:3}); return 'Half the town was there. You saw everyone.'; }},
      {label:'Stay in', go:() => 'You caught the score the next morning.'}
    ]}
];

/* ============================================================
   🛣️ ROAD AND 💼 WORK EVENTS (review doc 2026-11-18, sections B and C)
   Road events come in weeks you commute 20+ miles each way or take a trip; work events need a job.
   Every amount is in 2027 dollars and goes through cost(); labels show today's price.
   ============================================================ */
// small state these events keep (new lives get it in newGame, older saves in migrate)
const EVENT_STATE = () => ({ roadTo:null, healthPlan:null, skiPass:null, snowChains:null, gasFriend:false, applyBoost:0, hireBy:-1,
  tradeBy:-1, raiseBoost:0, promoBoost:0, promo:null, danceBoost:false, ...townStateA(),   // danceBoost: W27
  // round 75 weather, part 2: the smoke rule at work, the air filter, a roof on the waiting list, the raised furnace,
  // a vacation day spent on an outage, the neighbor's walk, and the block captain's storm plan
  smokeRule:null, airFilter:null, roofWait:null, floodAsk:null, vacDay:null, walk:false, walkWinter:null, walkWinters:0, walkPie:false, captain:null,
  // wave 1 events: traffic school and a ticket on record (i26-b06), toddler moments (i37-b01), college send-offs (i46-a02),
  // health-plan savings and light duty paid by the week (i58-b02)
  trafficSchool:null, ticketUntil:-1, toddlerLast:-99, kidSent:[], lightDuty:null, sandbagged:null });
// the doc's job groups, mapped to every job in JOBS
const JOB_GROUP = { farmhand:'field', cellar:'field', onion:'field', foodplant:'field', hanford:'field', lift:'field', airport:'field', agtech:'field',
  insure:'office', clerk:'office', loan:'office', labadmin:'office', prof:'office', scientist:'office', teller:'office', reporter:'office',
  cna:'care', rn:'care', imaging:'care', para:'care', medasst:'care',
  diner:'service', retail:'service', hardware:'service', barista:'service', grocer:'service',
  trucker:'trades', rail:'trades', mech:'trades', elevator:'trades', co:'trades', apprentice:'trades',
  forest:'field', harvtruck:'field', vaclerk:'office', remote:'office', teacher:'care', phleb:'care',
  windtech:'trades', damop:'trades', nukeop:'trades', electrician:'trades', plumber:'trades', lineman:'trades', welder:'trades' };
const working = () => !!job() && !S.retired;
const jobIn = (...groups) => working() && groups.includes(JOB_GROUP[S.jobId]);
const longCommute = () => commuteOneWay() >= 20;
const TICKET_YEARS = 3, TICKET_INS = 10;          // i26-b06: years between traffic schools and on your record; $ a month (2027)
const trafficSchoolOK = () => S.trafficSchool == null || S.turn - S.trafficSchool >= TICKET_YEARS * 52;
const dayPay = () => working() ? payNow(job()) / WORKDAYS : 0;
const weekPay = () => working() ? payNow(job()) * W : 0;
const cr = v => Math.round(cost(v));
const RAISE_CAP = 1.3;   // i75-b25: raises top out 30% above inflation; the ladder rungs are the main way up
// i22-a10: returns the real raise (0 at the cap) so the text never promises more than the cap allows
const bumpPay = f => { const was = S.raise; S.raise = Math.min(RAISE_CAP, Math.max(S.raise, S.raise * f)); return S.raise / was - 1; };
const raiseRoom = f => Math.max(0, Math.min(f, RAISE_CAP / S.raise) - 1);   // what a raise of f would really add now
const pctTxt = g => `${+(g * 100).toFixed(1)}%`;
const capTxt = 'You\'re at the top of the pay scale for this job: a promotion or a new job is the way up.';
function raiseNote(g){
  if (g <= 0.0005) return `No raise: ${capTxt.charAt(0).toLowerCase()}${capTxt.slice(1)}`;
  return `A ${pctTxt(g)} raise! You now make ${wk(payNow(job()))}.${S.raise >= RAISE_CAP - 1e-9 ? ' ' + capTxt : ''}`;
}
const shopCost = () => Math.round(cost(ri(300, S.car === 'beater' ? 1400 : 900)) * (1 - skillLv('mechanic') * 0.15));
// i66-b01: openings you could take that pay more than your job does now
const tipJobs = () => { const now = job() && !S.retired ? payNow(job()) : 0;
  return JOBS.filter(x => x.edu <= S.edu && !extraLock(x) && jobInSeason(x) && x.id !== S.jobId && payNow(x, false) > now); };
const handyCost = v => Math.round(cost(v) * (1 - skillLv('handy') * 0.15));   // i71-b01: a do-it-yourself price, after your handy discount
// the town this week's drive goes to: a trip's town, else your commute, else Walla Walla
function roadTown(){
  if (S.roadTo && CITIES[S.roadTo] && S.roadTo !== 'waitsburg') return S.roadTo;
  return longCommute() ? job().city : 'wallawalla';
}
const roadName = () => CITIES[roadTown()].name;
// the ski season that starts each October (December to March count with the October before)
const skiSeason = () => { const d = new Date(S.date); return d.getMonth() >= 9 ? d.getFullYear() : d.getFullYear() - 1; };
const skiPass = () => S.skiPass === skiSeason();
// i66-b16: with a pass, a December-March Get outside week is a ski day at Bluewood
const skiWeek = () => S.focus === 'outdoors' && skiPass() && [11, 0, 1, 2].includes(curMonth()) && S.health >= SKI_HEALTH;
// J29: better coverage halves doctor and urgent-care bills from events until next January
const planYear = () => new Date(S.date).getFullYear();
// i58-b02: event money that runs over weeks shows up as weekly lines, only while you hold the job it came with
const HEALTH_CHEAP = 20;                          // the cheaper plan saves this much a month (2027 dollars; i66-b15: $240 a year)
function eventMoneyWeek(lines){
  const hp = S.healthPlan, ld = S.lightDuty;
  if (hp && hp.k === 'cheap' && hp.save && hp.y === planYear() && working() && (hp.job == null || hp.job === S.jobId))
    lines.push(['Health plan savings', cost(hp.save) * W, `The cheaper health plan you picked at open enrollment: about ${fmtc(hp.save)} a month back, while you work this job.`]);
  if (ld) {
    if (S.turn < ld.until && working() && S.jobId === ld.job) lines.push(['Light duty (80% pay)', -weekPay() * 0.2, `Your back is healing on light duty at 80% pay: about ${Math.max(1, ld.until - S.turn)} week${ld.until - S.turn > 1 ? 's' : ''} to go.`]);
    if (S.turn + 1 >= ld.until || S.jobId !== ld.job) S.lightDuty = null;
  }
}
const medBill = v => cost(v) * (S.healthPlan && S.healthPlan.k === 'better' && S.healthPlan.y === planYear() ? 0.5 : 1);
// weeks of class progress from an event; graduates you if that finishes the program
function classWeeks(n){
  if (S.edu >= 3) return false;
  S.studyProg += n;
  if (S.studyProg >= STUDY_NEED[S.edu]) { graduate(); (S.newBadges = S.newBadges || []).push(`🎓 ${EDU[S.edu]}!`); }
  return true;
}
const studying = () => S.focus === 'study' && S.edu < 3;
// what event choices keep doing week to week (weekTick runs it every week before the event roll, even with events off: i71-b04)
function eventUpkeep(){
  if (S.promo && (S.promo.job !== S.jobId || S.retired)) S.promo = null;
  if (S.promo) adj({happy: -0.3 * S.promo.n * W});          // J2: a promotion adds job stress
}

const ROAD_EVENTS = [
  { ic:'🦌', title:'Deer on Highway 12 at dusk', cat:'road', w:3, when:m => longCommute() && inM(m,9,10,11,0),
    text:'Eyes in the headlights at the edge of the wheat.',
    choices:() => [{label:'Brake hard', go:() => { if (chance(S.tires === S.car ? .05 : .15)) { const c = cr(900), p = youPay('auto', c); adj({money:-p, health:-1, happy:-1}); return `You clipped it. The repair ran ${fmt(c)}.${covered(c, p)}`; }
      adj({happy:-1}); return `It bounded off into the dark. Your heart took a while to slow down${S.tires === S.car ? ' (good thing for those winter tires)' : ''}.`; }}]},
  { ic:'🚜', title:'Stuck behind a wheat truck', cat:'road', w:3, when:m => inM(m,6,7),
    text:'A loaded grain truck doing 35 on the two-lane, and a line of cars behind it.',
    choices:() => [
      {label:'Wait it out', go:() => { adj({happy:-1}); return 'You crawled along behind the wheat and got there late.'; }},
      {label:'Pass on the straightaway', go:() => { if (chance(.05)) { adj({health:-2}); return 'An oncoming pickup came over the rise. Too close. Your hands shook for an hour.'; } adj({happy:1}); return 'Clean pass. The trucker waved.'; }}
    ]},
  { ic:'🌫️', title:'Fog in the Touchet Valley', cat:'road', w:2, when:m => inM(m,10,11,0),
    text:'Thick valley fog. You can barely see the hood ornament.',
    choices:() => [
      {label:'Drive slow', go:() => { adj({happy:-1}); return 'Twenty-five miles an hour, the whole way.'; }},
      {label:working() ? `Leave late and lose a few hours (-${fmt(dayPay() / 4)})` : 'Leave late, once it lifts', go:() => { const p = Math.round(dayPay() / 4); adj({money:-p}); return p ? `You waited for the fog to burn off and lost ${fmt(p)} of pay.` : 'You waited for the fog to burn off.'; }}
    ]},
  { ic:'🛞', title:'Flat tire on US-12', cat:'road', w:2,
    text:() => `A loud thump on the way to ${roadName()}. The back tire is flat.`,
    choices:() => [
      {label:'Change it yourself', if:() => skillLv('mechanic') >= 1, go:() => { adj({health:-1}); practice('mechanic', 1); return 'Jack, lug wrench, spare. Twenty minutes on the shoulder.'; }},
      {label:`Call a tow (-${fmtc(120)})`, go:() => { adj({money:-cr(120)}); return `The tow and a patch ran ${fmtc(120)}.`; }}
    ]},
  { ic:'💥', title:'A fender bender', cat:'road', w:1,
    text:() => `Traffic stopped short in ${roadName()} and you didn't. Nobody's hurt, but your front end is crumpled.`,
    choices:() => [{label:'Exchange insurance info', go:() => { const c = cr(3200), p = youPay('auto', c); adj({money:-p, happy:-3});
      return S.ins && S.ins.auto === 'liab' ? `Your liability insurance paid for their car, not yours: your repairs cost ${fmt(c)}.` : `Full coverage paid for the repairs after your ${fmt(p)} deductible.${covered(c, p)}`; }}]},
  { ic:'🚓', title:'Speeding ticket', cat:'road', yr:1, w:2, when:() => longCommute(),
    text:'Lights in the mirror. You were doing 72 in a 60.',
    choices:() => [
      // i26-b06: traffic school keeps a ticket off your record only once every few years; a paid ticket raises insurance a little
      {label:`Traffic school (-${fmtc(60)}, an evening)`, if:trafficSchoolOK, go:() => { adj({money:-cr(60), happy:-1}); S.trafficSchool = S.turn; return `An evening of videos, and the ticket stays off your record. Traffic school only works once every ${TICKET_YEARS} years.`; }},
      {label:`Pay it (-${fmtc(160)})`, go:() => { adj({money:-cr(160), happy:-2}); S.ticketUntil = S.turn + TICKET_YEARS * 52; return `Paid the ${fmtc(160)} ticket online. Ouch. It stays on your record for ${TICKET_YEARS} years, so your car insurance goes up ${fmtc(TICKET_INS)} a month.${trafficSchoolOK() ? '' : ' (Traffic school was off the table: you went too recently.)'}`; }}
    ]},
  { ic:'🚧', title:'Road-construction detour', cat:'road', w:2, when:m => inM(m,5,6,7),
    text:'Orange signs: the highway is down to gravel for a mile and traffic is detoured.',
    choices:() => [{label:'Take the long way', go:() => { adj({money:-cr(15), happy:-1}); return `The detour cost about ${fmtc(15)} in gas and half an hour.`; }}]},
  { ic:'🚙', title:'A stranded driver on the shoulder', cat:'road', w:2,
    text:'A car with its hazards on and the hood up. Someone is waving.',
    choices:() => [
      {label:'Stop and help', go:() => { adj({community:2, happy:2}); if (chance(S.gasFriend ? .3 : .1)) { adj({community:2}); return 'It turned out to be someone from Waitsburg. The whole town will hear about it.'; } return 'A jump start and a thank-you. It felt good.'; }},
      {label:'Drive on', go:() => 'Somebody else will stop.'}
    ]},
  { ic:'⏰', title:'Your carpool buddy is always late', cat:'road', yr:1, w:3, when:() => carpooling(),
    text:'Third time this month you\'ve sat in their driveway for ten minutes.',
    choices:() => [
      {label:'Talk it out', go:() => { adj({community:1, happy:-1}); practice('people', 1); return 'An awkward talk, but they\'re on time now.'; }},
      {label:'Leave the carpool', go:() => { S.carpool = false; return 'You drive yourself again. More gas, less waiting.'; }}
    ]},
  { ic:'🎧', title:'An audiobook habit on the commute', cat:'road', w:2, when:() => commuteOneWay() >= 40,
    text:'An hour each way adds up. You could use it.',
    choices:() => [
      {label:studying() ? 'Learn something (a week of class work)' : 'Learn something', go:() => { if (studying()) { classWeeks(1); return 'You listened to your course lectures on the drive: a week ahead in class.'; } adj({happy:2}); return 'A history of the Oregon Trail, one commute at a time.'; }},
      {label:'Music and coffee', go:() => { adj({happy:2}); return 'Windows down, radio up.'; }}
    ]},
  { ic:'🌪️', title:'Dust storm near the Tri-Cities', cat:'road', yr:1, w:2, when:m => inM(m,5,6,7),
    text:'A brown wall of dust rolls across the highway.',
    choices:() => [
      {label:'Pull over and wait', go:() => { adj({happy:-1}); return 'You sat on the shoulder until you could see again.'; }},
      {label:'Push through', go:() => { if (chance(.1)) { const c = cr(600), p = youPay('auto', c); adj({money:-p}); return `You tapped a car you couldn't see. The fender cost ${fmt(c)}.${covered(c, p)}`; } return 'You made it through, gritting your teeth (and your teeth were gritty).'; }}
    ]},
  { ic:'🎈', title:'Hot-air balloon festival in Walla Walla', cat:'road', yr:1, w:3, when:m => inM(m,4),
    text:'Dozens of balloons lift off at dawn over Walla Walla.',
    choices:() => [
      {label:'Watch the dawn launch', go:() => { adj({happy:4}); return 'Coffee in a field, and the sky full of color.'; }},
      {label:`Balloon ride (-${fmtc(250)})`, go:() => { adj({money:-cr(250), happy:8}); return 'You floated over the wheat and the Blues. Unforgettable.'; }}
    ]},
  { ic:'🎓', title:'A free college lecture in Walla Walla', cat:'road', w:2, when:m => inM(m,0,1,2,3,4,8,9,10,11),
    text:'A professor is giving a free public talk tonight.',
    choices:() => [
      {label:'Go', go:() => { adj({happy:2}); if (studying()) { classWeeks(1); return 'Fascinating, and it counted as a week of your class work.'; } return 'You learned something and stayed for the questions.'; }},
      {label:'Skip', go:() => 'Maybe the next one.'}
    ]},
  { ic:'🏥', title:'A friend is in the hospital in Walla Walla', cat:'road', yr:1, w:2,
    text:'An old friend had surgery and is stuck in a hospital bed.',
    choices:() => { const g = Math.round(tripGas('wallawalla')); return [
      {label:g ? `Visit (gas about ${fmt(g)})` : 'Visit after work', go:() => { adj({money:-g, community:2, happy:1}); return 'You brought magazines and bad jokes. They needed both.'; }},
      {label:`Send flowers (-${fmtc(40)})`, go:() => { adj({money:-cr(40), community:1}); return 'The flowers made it. So did a text.'; }}
    ]; }},
  { ic:'🍷', title:'Wine release weekend in Walla Walla', cat:'road', w:2, when:m => inM(m,3,4,8,9,10) && age() >= 21,
    text:'Release weekend: the tasting rooms are full and so is the road.',
    choices:() => [
      {label:`Stop at a tasting (-${fmtc(35)})`, go:() => { adj({money:-cr(35), happy:3}); return 'A new red, poured by the winemaker.'; }},
      {label:'Sit in traffic', go:() => { adj({happy:-1}); return 'Limos and tour buses the whole way through town.'; }}
    ]},
  { ic:'🚆', title:'Train crossing in Pasco', cat:'road', w:3, when:() => roadTown() === 'pasco',
    text:'The gates come down. A mile-long freight train is crawling through.',
    choices:() => [
      {label:'Wait', go:() => { if (chance(.05)) { adj({money:-cr(50), happy:-1}); return `It stopped on the crossing. You were late, and ${fmtc(50)} was docked.`; } adj({happy:-1}); return 'You counted 112 cars.'; }},
      {label:`Take the long way (-${fmtc(8)})`, go:() => { adj({money:-cr(8)}); return `Around by the overpass: ${fmtc(8)} in gas.`; }}
    ]},
  { ic:'🛫', title:'Cheap flight deal out of Pasco', cat:'road', yr:1, w:2, when:() => S.money >= cost(1000),
    text:'Fares out of the Tri-Cities airport just dropped for next weekend.',
    choices:() => [
      {label:`Weekend getaway (-${fmtc(350)})`, go:() => { adj({money:-cr(350), happy:6}); return 'Two days somewhere new. You came back rested.'; }},
      {label:'Pass', go:() => 'You closed the tab.'}
    ]},
  { ic:'💃', title:'Spring festival in Pasco', cat:'road', yr:1, w:3, when:m => inM(m,4),
    text:'Music, dancing and food stands fill downtown Pasco.',
    choices:() => [
      {label:`Food and music (-${fmtc(25)})`, go:() => { adj({money:-cr(25), happy:4, community:1}); return 'Tamales, a mariachi band and new friends.'; }},
      {label:'Skip', go:() => 'You drove past the crowds.'}
    ]},
  { ic:'🚤', title:'Hydroplane races on the Columbia', cat:'road', yr:1, w:3, when:m => inM(m,6),
    text:'Unlimited hydroplanes roar down the river. You can hear them for miles.',
    choices:() => [
      {label:`Go (-${fmtc(30)})`, go:() => { adj({money:-cr(30), happy:5}); return 'Rooster tails, sunburn and ringing ears.'; }},
      {label:'Watch from the riverbank, free', go:() => { adj({happy:3}); return 'A blanket on the bank and a free show.'; }}
    ]},
  { ic:'🎆', title:'Fourth of July fireworks in Columbia Park', cat:'road', yr:1, w:3, when:m => inM(m,6),
    text:'The Tri-Cities puts on the biggest fireworks show around.',
    choices:() => { const g = Math.round(tripGas('kennewick')); return [
      {label:g ? `Drive over (gas about ${fmt(g)})` : 'Stay after work for the show', go:() => { adj({money:-g, happy:3}); return 'Booms over the river. Worth the drive.'; }},
      {label:'Stay in Waitsburg for the parade', go:() => { adj({happy:2}); return 'Small-town parade, sparklers on the porch.'; }}
    ]; }},
  { ic:'🛍️', title:'Clearance sale at the mall', cat:'road', yr:1, w:2, when:m => inM(m,0,7),
    text:'Everything is 60% off at the Kennewick mall.',
    choices:() => [
      {label:`New work clothes (-${fmtc(120)})`, go:() => { adj({money:-cr(120), happy:2}); S.applyBoost = 0.05; return 'You look sharp. Your next job application gets a little boost.'; }},
      {label:'Window shop', go:() => { adj({happy:1}); return 'You looked at everything and bought a pretzel.'; }}
    ]},
  { ic:'🚘', title:'A test drive at a dealership', cat:'road', yr:1, w:3, when:() => ['kennewick','pasco'].includes(roadTown()),
    text:'A salesman waves you onto the lot. "Take her for a spin!"',
    choices:() => [
      {label:`Take it home (+${fmtc(500)} trade-in bonus this week)`, go:() => { S.tradeBy = S.turn; tab = 'life'; return `The dealer will add ${fmtc(500)} to your trade-in if you buy this week. Your vehicles are on the Life tab.`; }},
      {label:'Just a test drive', go:() => { adj({happy:2}); return 'New-car smell, and no paperwork.'; }}
    ]},
  { ic:'🏃', title:'Riverfront 5K in Richland', cat:'road', yr:1, w:3, when:m => inM(m,3,8),
    text:'A 5K along the Columbia this Saturday.',
    choices:() => [
      {label:`Run it (-${fmtc(25)})`, go:() => { adj({money:-cr(25), health:3, happy:2}); return 'You finished, and got a T-shirt to prove it.'; }},
      {label:'Cheer from the side', go:() => { adj({happy:1}); return 'Cowbell duty.'; }}
    ]},
  { ic:'☢️', title:'Hanford history tour', cat:'road', yr:1, w:3, when:() => roadTown() === 'richland',
    text:'A free public tour of the old reactor site.',
    choices:() => [{label:'Take it, free', go:() => { adj({happy:2}); if (studying()) { classWeeks(1); return 'You took notes for class: a week of class work.'; } return 'History you can stand inside.'; }}]},
  { ic:'🚗', title:'Classic car show in Dayton', cat:'road', yr:1, w:3, when:m => inM(m,5),
    text:'Chrome and fins line Main Street in Dayton.',
    choices:() => [
      {label:'Show off the 1998 pickup', if:() => S.car === 'beater', go:() => { adj({happy:3}); if (chance(.2)) { adj({money:cr(50)}); return `It won "best beater" and ${fmtc(50)}!`; } return 'People loved the rust. Well, some did.'; }},
      {label:'Browse', go:() => { adj({happy:2}); return 'You picked out the one you\'d buy if you won the lottery.'; }}
    ]},
  { ic:'🎿', title:'Bluewood season pass sale', cat:'road', yr:1, w:3, when:m => inM(m,9) && !skiPass(),
    text:'Early-bird season passes for Bluewood are on sale.',
    choices:() => [
      {label:`Buy it (-${fmtc(300)})`, go:() => { adj({money:-cr(300)}); S.skiPass = skiSeason(); return 'Powder days at Bluewood are free for you this season, and winter Get outside weeks are ski days.'; }},
      {label:'Pass', go:() => 'You\'ll pay by the day.'}
    ]},
  { ic:'⛓️', title:'Chains required on the road to Bluewood', cat:'road', yr:1, w:3, when:m => inM(m,11,0,1) && roadTown() === 'dayton' && S.snowChains !== skiSeason(),
    text:'Past Dayton, the sign says chains required.',
    choices:() => [
      {label:`Buy chains (-${fmtc(60)})`, go:() => { adj({money:-cr(60)}); S.snowChains = skiSeason(); return 'Chained up on the shoulder. Good for the rest of the season.'; }},
      {label:'Turn back', go:() => { adj({happy:-2}); return 'You turned around and went home.'; }}
    ]},
  { ic:'⛽', title:'Wrong pump at the gas station', cat:'road', yr:1, w:0.4,
    text:'You were half asleep and grabbed the diesel nozzle.',
    choices:() => [{label:'Drain and refill', go:() => { adj({money:-cr(400), happy:-2}); return `A tow and a tank flush: ${fmtc(400)}.`; }}]},
  { ic:'👛', title:'A lost wallet in a Walla Walla parking lot', cat:'road', yr:1, w:2,
    text:'A wallet on the ground by your car. Cash and a driver\'s license inside.',
    choices:() => [
      {label:'Track down the owner', go:() => { adj({community:2, happy:3}); if (chance(.4)) { adj({money:cr(50)}); return `The owner insisted on a ${fmtc(50)} reward.`; } return 'A very grateful stranger.'; }},
      {label:'Leave it at the store desk', go:() => { adj({happy:1}); return 'You did the right thing, quickly.'; }}
    ]},
  { ic:'🕳️', title:'Pothole season', cat:'road', yr:1, w:3, when:m => inM(m,2),
    text:'Winter left the highway full of holes.',
    choices:() => [{label:'Swerve and slow down', go:() => { if (S.car === 'sedan' && chance(.3)) { adj({money:-cr(150), happy:-1}); return `The sedan dropped into one. Alignment: ${fmtc(150)}.`; } adj({happy:-1}); return S.car === 'sedan' ? 'You dodged most of them.' : 'The pickup shrugged them off.'; }}]},
  { ic:'☕', title:'A friendly regular at the gas station', cat:'road', once:1, w:2, when:() => longCommute(),
    text:'The same old-timer is at the gas station every morning you fill up.',
    choices:() => [{label:'Coffee and stories', go:() => { S.gasFriend = true; adj({happy:2, community:1}); return 'He knew your grandparents. Now the drive feels like home.'; }}]}
];

const WORK_EVENTS = [
  { ic:'📝', title:'Your performance review', cat:'work', yr:1, w:3, when:() => working() && S.jobMonths >= 6,
    text:() => `Review time at your ${job().title.toLowerCase()} job.`,
    choices:() => [
      {label:'Ask for a raise', go:() => { const p = .6 + skillLv('people') * .05 + (S.raiseBoost || 0); S.raiseBoost = 0;
        if (raiseRoom(1.04) <= 0.0005) { adj({happy:-1}); return `"We can't go any higher for this job." ${capTxt}`; }
        if (chance(p)) { const g = bumpPay(1.04); adj({happy:3}); return raiseNote(g); } adj({happy:-3}); return '"Not this year." Ouch.'; }},
      {label:'Keep your head down', go:() => 'A fine review, and no surprises.'}
    ]},
  // i3-a01: a promotion moves you up a named rung of the job's ladder (features.js), once you've earned it
  { ic:'🪜', title:'A promotion offer', cat:'work', yr:1, w:2, when:() => canPromote(),
    text:() => `Your boss wants to move you up from ${jobTitle().toLowerCase()} to ${nextRung().title.toLowerCase()}. More pay, more headaches.`,
    choices:() => { const r = nextRung(), up = Math.round((r.payMult / rungOf().payMult * (1 + raiseRoom(1 + (S.promoBoost || 0))) - 1) * 100); return [
      {label:`Take it (+${up}% pay, more stress)`, go:() => { S.rung = (S.rung || 0) + 1; if (S.promoBoost) bumpPay(1 + S.promoBoost); S.promoBoost = 0;
        return `Promoted to ${r.title.toLowerCase()}! You now make ${wk(payNow(job()))}, and the job is a little more stressful.`; }},
      {label:'Turn it down', go:() => { adj({happy:1}); return 'You like your job the way it is.'; }}
    ]; }},
  { ic:'⏱️', title:'Mandatory overtime week', cat:'work', w:2, when:() => jobIn('field','service'),
    text:'Everyone is on 60 hours this week. No exceptions, says the boss.',
    choices:() => [
      {label:`Work it (+${fmt(weekPay() * .3)})`, go:() => { const v = Math.round(weekPay() * .3); adj({money:v, health:-3, happy:-2}); return `A long week. ${fmt(v)} extra.`; }},
      {label:'Refuse', go:() => { if (chance(.1)) { adj({happy:-1}); return 'You got a write-up for it.'; } return 'You said no. Nobody pushed it.'; }}
    ]},
  { ic:'😤', title:'A coworker conflict', cat:'work', w:2, when:() => working(),
    text:'A coworker keeps taking credit for your work.',
    choices:() => [
      {label:'Talk it out', go:() => { const ok = chance(.7 + skillLv('people') * .15); practice('people', 1);
        if (ok) { adj({community:1, happy:1}); return 'You cleared the air over coffee.'; } adj({happy:-2}); return 'It got heated. Things are tense now.'; }},
      {label:'Go to the boss', go:() => { adj({happy:-1}); return 'The boss sorted it out. Your coworker isn\'t speaking to you.'; }}
    ]},
  { ic:'📚', title:'Free training course', cat:'work', once:1, w:2, when:() => working() && S.edu < 3,
    text:'Work will pay for a training course that counts toward your next diploma.',
    choices:() => [
      {label:'Take it (4 weeks of class work)', go:() => { classWeeks(4); adj({happy:-1}); return 'Four weeks of evening classes, paid for. You\'re ahead in school.'; }},
      {label:'Skip', go:() => 'You passed on it.'}
    ]},
  { ic:'🤕', title:'Hurt on the job', cat:'work', yr:1, w:2, when:() => jobIn('field','trades'),
    text:'You wrenched your back lifting at work.',
    choices:() => [
      {label:`Light duty for 4 weeks (-${fmt(weekPay() * .8)})`, go:() => { const v = Math.round(weekPay() * .8); adj({money:-v}); return `Four weeks of light duty at 80% pay: ${fmt(v)} less.`; }},
      {label:'Push through', go:() => { adj({health:-6}); return 'You kept working. Your back kept score.'; }},
      {label:`See the doctor (-${fmt(medBill(120))})`, go:() => { adj({money:-Math.round(medBill(120)), health:-2}); return 'Stretches and rest. It\'s healing.'; }}
    ]},
  { ic:'🏆', title:'Employee of the month', cat:'work', yr:1, w:() => .6 + skillLv('people') * .4, when:() => working(),
    text:'Your picture is going up on the wall.',
    choices:() => [{label:'Accept the parking spot and gift card', go:() => { adj({money:cr(50), happy:4}); return `A reserved parking spot and a ${fmtc(50)} gift card.`; }}]},
  { ic:'👔', title:'New manager', cat:'work', yr:1, w:2, when:() => working(),
    text:'A new manager starts Monday. Everyone is nervous.',
    choices:() => [
      {label:`Bring donuts (-${fmtc(15)})`, go:() => { adj({money:-cr(15), happy:1, community:1}); return 'A good first impression, with sprinkles.'; }},
      {label:'Keep your head down', go:() => { adj({happy:-3}); return 'A rough month while they figured everyone out.'; }}
    ]},
  { ic:'🎄', title:'Holiday party', cat:'work', yr:1, w:4, when:m => working() && inM(m,11),
    text:'The work holiday party is Friday.',
    choices:() => [
      {label:'Go', go:() => { adj({happy:3, community:1}); return 'Ugly sweaters and a white-elephant gift.'; }},
      {label:'Skip', go:() => { adj({happy:-1}); return 'You heard it was fun.'; }}
    ]},
  { ic:'🧑‍🏫', title:'Train the new hire', cat:'work', w:2, when:() => working() && S.jobMonths >= 6,
    text:'The boss asks you to show the new hire the ropes.',
    choices:() => [
      {label:'Mentor them', go:() => { adj({happy:1}); practice('people', 2); return 'They\'re catching on fast, thanks to you.'; }},
      {label:'Not my job', go:() => { adj({happy:-1}); return 'The new hire struggled. People noticed.'; }}
    ]},
  { ic:'😬', title:'A big mistake at work', cat:'work', w:.3, when:() => working(),
    text:'You messed up an order, and it\'s going to cost the company.',
    choices:() => [
      {label:'Fix it after hours', go:() => { adj({health:-2}); return 'Two late nights, and nobody ever knew.'; }},
      {label:'Own up to the boss', go:() => { adj({happy:-2}); S.raiseBoost = .1; return 'An uncomfortable talk, but the boss respects honesty. It will help at your next review.'; }},
      // i3-a09: a firing follows you as a bad reference for a year
      {label:'Blame the new hire', go:() => { if (chance(.5)) { const t = job().title; leaveJob('fired'); adj({happy:-8}); return `The boss found out. You were fired from the ${t.toLowerCase()} job, and that reference will follow you for a year.`; }
        adj({community:-1}); return 'It worked, this time. The new hire looked miserable.'; }}
    ]},
  { ic:'⚙️', title:'Equipment breaks down', cat:'work', w:2, when:() => jobIn('field','trades'),
    text:'The main machine at work quits mid-shift.',
    choices:() => [
      {label:`Fix it yourself (+${fmtc(100)} bonus)`, if:() => skillLv('mechanic') >= 1, go:() => { adj({money:cr(100)}); practice('mechanic', 1); return `Back up in an hour. The boss handed you ${fmtc(100)}.`; }},
      {label:`Call it in (-${fmt(dayPay() / 2)})`, go:() => { adj({money:-Math.round(dayPay() / 2), happy:-1}); return 'Half a day without pay while you waited for the repair crew.'; }}
    ]},
  { ic:'🤧', title:'Flu going around', cat:'work', yr:1, w:3, when:m => working() && inM(m,11,0,1),
    text:'Half the crew is out sick, and you\'re starting to feel it.',
    choices:() => [
      {label:`Stay home unpaid (-${fmt(dayPay())})`, go:() => { adj({money:-Math.round(dayPay()), health:1}); return 'A day in bed with soup.'; }},
      {label:'Work sick', go:() => { adj({health:-4}); if (chance(.3)) { adj({community:-1}); return 'You worked through it, and two coworkers caught it from you.'; } return 'You worked through it. Barely.'; }}
    ]},
  { ic:'💬', title:'A customer compliment', cat:'work', w:2, when:() => jobIn('service','care'),
    text:'Someone asked for your manager, just to say how great you were.',
    choices:() => [{label:'Enjoy it', go:() => { adj({happy:3}); return 'It made your whole week.'; }}]},
  { ic:'😠', title:'A rude customer', cat:'work', w:2, when:() => jobIn('service'),
    text:'A customer is yelling at you about something that isn\'t your fault.',
    choices:() => [
      {label:'Keep your cool', go:() => { adj({happy:-2}); practice('people', 1); return 'You smiled through it. You\'re getting good at this.'; }},
      {label:'Snap back', go:() => { if (chance(.2)) { adj({happy:-3}); return 'It felt great until the write-up.'; } adj({happy:1}); return 'It felt great.'; }}
    ]},
  { ic:'🫙', title:'Workplace fundraiser', cat:'work', yr:1, w:2, when:() => working(),
    text:'A coworker is raising money for a family in need.',
    choices:() => [
      {label:`Chip in (-${fmtc(25)})`, go:() => { adj({money:-cr(25), community:2}); return 'Every bit helps.'; }},
      {label:'Skip', go:() => 'You passed the jar along.'}
    ]},
  { ic:'💵', title:'The boss offers a weekend gig', cat:'work', w:2, when:() => jobIn('field','trades'),
    text:'The boss needs help with a side job this weekend. Cash.',
    choices:() => [
      {label:`Take it (+${fmtc(300)})`, go:() => { adj({money:cr(300), health:-2, happy:-1}); return `A long weekend, and ${fmtc(300)} cash.`; }},
      {label:'Decline', go:() => 'You kept your weekend.'}
    ]},
  { ic:'🧳', title:'Conference trip', cat:'work', yr:1, w:2, when:() => jobIn('office','care'),
    text:'Work will send you to a conference in Spokane, paid.',
    choices:() => [
      {label:'Go, paid', go:() => { const cls = classWeeks(2); adj({happy:S.partner ? 2 : 3}); return `Three days of talks and hotel breakfasts${cls ? ', and two weeks of class work' : ''}.${S.partner ? ` ${partnerWord(true)} missed you.` : ''}`; }},
      {label:'Skip', go:() => 'Someone else went.'}
    ]},
  { ic:'🎂', title:'A coworker retires', cat:'work', yr:1, w:2, when:() => working(),
    text:'After 30 years, a coworker is retiring.',
    choices:() => [
      {label:`Chip in for the gift (-${fmtc(20)})`, go:() => { adj({money:-cr(20), community:2, happy:2}); return 'Cake in the break room and a few tears.'; }},
      {label:'Sign the card', go:() => { adj({community:1}); return 'You wrote something nice.'; }}
    ]},
  { ic:'💻', title:'New software rollout', cat:'work', yr:1, w:2, when:() => jobIn('office'),
    text:'A whole new system at work. Training is optional, for now.',
    choices:() => [
      {label:'Learn it early', go:() => { adj({happy:-2}); S.promoBoost = .05; return 'A frustrating week, but now you\'re the one people ask. Your next promotion will pay a bit more.'; }},
      {label:'Grumble', go:() => { adj({happy:-1}); return 'You\'ll learn it when you have to.'; }}
    ]},
  { ic:'🧾', title:'Payroll error: a late paycheck', cat:'work', yr:1, w:.5, when:() => working(),
    text:'Payroll messed up. Your check is a week late.',
    choices:() => [{label:'Wait it out', go:() => { const short = Math.max(0, weekPay() - S.money), fee = Math.round(short * .015);
      adj({money:-fee, happy:-2}); return fee ? `It came a week late, and the overdraft cost ${fmt(fee)} in interest.` : 'It came a week late. Annoying.'; }}]},
  { ic:'🎁', title:'Year-end bonus', cat:'work', yr:1, w:4, when:m => jobIn('office','care') && inM(m,11),
    text:'A good year. Bonus checks are out.',
    choices:() => [
      {label:`Bank it (+${fmt(weekPay() * 2)})`, go:() => { const v = Math.round(weekPay() * 2); adj({money:v}); return `${fmt(v)} into savings.`; }},
      {label:`Treat yourself (+${fmt(weekPay())})`, go:() => { const v = Math.round(weekPay()); adj({money:v, happy:4}); return `${fmt(v)} saved and the rest spent on something nice.`; }}
    ]},
  { ic:'🥘', title:'Lunchroom potluck', cat:'work', w:2, when:() => working(),
    text:'Potluck in the break room Friday.',
    choices:() => [
      {label:`Bring a dish (-${fmtc(10)})`, go:() => { const good = skillLv('cook') >= 2; adj({money:-cr(10), community:1, happy:good ? 3 : 2}); return good ? 'Your dish was gone in ten minutes. People asked for the recipe.' : 'Your dish was a hit.'; }},
      {label:'Grab a plate', go:() => { adj({happy:1}); return 'Free lunch.'; }}
    ]},
  { ic:'🌙', title:'Cover a double shift', cat:'work', w:2, when:() => jobIn('service','care','field'),
    text:'A coworker\'s kid is sick. Can you cover?',
    choices:() => [
      {label:`Do it (+${fmt(dayPay() * 1.5)})`, go:() => { const v = Math.round(dayPay() * 1.5); adj({money:v, health:-2, community:2}); return `Sixteen hours and ${fmt(v)}. They owe you one.`; }},
      {label:'Say no', go:() => 'You need your sleep.'}
    ]},
  { ic:'🌾', title:'Harvest crunch', cat:'work', yr:1, w:4, when:m => working() && ['elevator','cellar','onion'].includes(S.jobId) && inM(m,6,7,8),
    text:'It\'s crunch time: the boss wants 60-hour weeks for a month.',
    choices:() => [
      {label:`60-hour weeks for a month (+${fmtc(1200)})`, go:() => { adj({money:cr(1200), health:-4, happy:-2}); return `A brutal month and ${fmtc(1200)} in overtime.`; }},
      {label:'Normal hours', go:() => { adj({happy:1}); return 'You kept your evenings.'; }}
    ]},
  { ic:'🦺', title:'Safety inspection', cat:'work', yr:1, w:2, when:() => jobIn('field','trades'),
    text:'The state safety inspector is coming next week.',
    choices:() => [
      {label:'Prep the crew', go:() => { adj({happy:-1}); return 'A week of cleanup and paperwork. You passed easily.'; }},
      {label:'Wing it', go:() => { if (chance(.2)) { const v = Math.round(weekPay()); adj({money:-v, happy:-1}); return `You failed. The site shut down for a week without pay (${fmt(v)}).`; } return 'You squeaked by.'; }}
    ]},
  { ic:'📞', title:'A recruiter calls', cat:'work', yr:1, w:2, when:() => working() && S.community >= 30,
    text:'A recruiter heard good things about you.',
    choices:() => [
      {label:'Interview (your next application this month is a sure thing)', go:() => { S.hireBy = S.turn + 4; return 'They\'ll put you in for any job you apply to in the next 4 weeks.'; }},
      {label:raiseRoom(1.02) > 0.0005 ? `Stay loyal (+${pctTxt(raiseRoom(1.02))} pay)` : 'Stay loyal (you\'re at the top of the pay scale)', go:() => { const g = bumpPay(1.02); return g > 0.0005 ? `Your boss heard you turned them down and bumped your pay ${pctTxt(g)}.` : `Your boss heard you turned them down and thanked you. ${capTxt}`; }}
    ]},
  { ic:'🏠', title:'A remote-day trial', cat:'work', yr:1, w:2, when:() => jobIn('office') && longCommute(),
    text:'Your office is trying an extra work-from-home day for a month.',
    choices:() => [
      {label:'Try it', go:() => { const v = Math.round(commuteCost(commuteOneWay(), CARS[S.car], job()) * .4); adj({money:v, happy:2}); return `Pajama meetings, and ${fmt(v)} less gas this month.`; }},
      {label:'Skip', go:() => 'You like the office.'}
    ]},
  { ic:'🩺', title:'Health plan choice', cat:'work', yr:1, w:4, when:m => working() && inM(m,0),
    text:'Open enrollment: pick your health plan for the year.',
    choices:() => [
      {label:`Cheaper plan (+${fmtc(HEALTH_CHEAP)}/month, about ${fmtc(HEALTH_CHEAP * 12)} a year)`, go:() => { S.healthPlan = { k:'cheap', y: planYear(), save: HEALTH_CHEAP, job: S.jobId }; const v = cr(HEALTH_CHEAP * 12); return `Smaller paycheck deductions: about ${fmtc(HEALTH_CHEAP)} a month, about ${fmt(v)} this year, in each paycheck while you're at this job.`; }},   // i66-b15 amount, i58-b02: paid by the week
      {label:'Better coverage (doctor and dentist bills half off)', go:() => { S.healthPlan = { k:'better', y: planYear() }; return 'Doctor, urgent-care, emergency dentist and therapy bills are half off this year.'; }}
    ]},
  { ic:'💒', title:'A work friend\'s wedding', cat:'work', yr:1, w:2, when:() => working(),
    text:'A work friend is getting married at a winery.',
    choices:() => [
      {label:`Go, with a gift (-${fmtc(100)})`, go:() => { adj({money:-cr(100), happy:4, community:2}); return 'You danced badly and loved it.'; }},
      {label:`Send a gift (-${fmtc(60)})`, go:() => { adj({money:-cr(60), happy:1}); return 'They sent a lovely thank-you card.'; }}
    ]}
];
EVENTS.push(...ROAD_EVENTS, ...WORK_EVENTS);

/* ---------- 👶 kids (wave 1): the college send-off, toddler moments, and a line a week about the kids ---------- */
// i46-a02: whichever college choice you pick, that kid has had their send-off
{ const e = EVENTS.find(x => x.title === 'A kid heads off to college'), orig = e.choices;
  e.choices = () => { const i = kidTurning18(); return orig().map(c => ({ ...c, go: () => { if (i >= 0) S.kidSent = [...(S.kidSent || []), i]; return c.go(); } })); }; }
// i37-b01: a kid from 2 to 5 at home; these trade money or work time for happiness and community
const toddlerHome = () => (S.kids || []).some(b => { const a = kidAge(b); return a >= 2 && a <= 5; });
const TODDLER_EVENTS = [
  { ic:'🤒', title:'Daycare calls: a fever', yr:1, w:4, when:() => toddlerHome() && working(),
    text:'The daycare calls at 10 a.m.: your toddler has a fever and has to be picked up. Now.',
    choices:() => [
      {label:`Leave work and stay home tomorrow too (-${fmt(dayPay() * 1.5)})`, go:() => { adj({money:-Math.round(dayPay() * 1.5), happy:2}); return 'Popsicles, cartoons and a nap on your chest. The fever broke by Thursday.'; }},
      {label:`Ask the neighbor who watches kids (-${fmtc(40)})`, if:() => S.community >= 30, go:() => { adj({money:-cr(40), community:1}); return 'She had soup on the stove before you could say thanks. You owe her one.'; }},
      {label:`${partnerWord(true)} takes the afternoon`, if:() => !!S.partner, go:() => { adj({happy:-1}); return `${partnerWord(true)} went. You called at lunch, at two and at four.`; }}
    ]},
  { ic:'🖍️', title:'A daycare spot opens up', yr:1, w:3, when:() => toddlerHome(),
    text:'The waiting list at the little daycare on Main Street finally came through: a spot for your toddler, three mornings a week.',
    choices:() => [
      {label:`Take it (-${fmtc(150)} deposit)`, go:() => { adj({money:-cr(150), happy:3, community:2}); return 'Finger paint, other parents to talk to, and a toddler who comes home tired.'; }},
      {label:'Keep things the way they are', go:() => 'Maybe next year.'}
    ]},
  { ic:'🚽', title:'Potty training rut', yr:1, w:3, when:() => (S.kids || []).some(b => { const a = kidAge(b); return a >= 2 && a <= 3; }),
    text:'Three weeks in, and your toddler has decided the potty is the enemy.',
    choices:() => [
      {label:working() ? `Take a long weekend and stick with it (-${fmt(dayPay())})` : 'Spend the weekend sticking with it', go:() => { adj({money:-Math.round(dayPay()), happy:3}); return 'Three days, a lot of laundry, and a very proud toddler.'; }},
      {label:`A sticker chart and the fancy potty (-${fmtc(35)})`, go:() => { adj({money:-cr(35), happy:1}); return 'The dinosaur stickers did most of the work.'; }},
      {label:'Back off for a month', go:() => { adj({happy:-1}); return 'Diapers for a while longer. They\'ll get there.'; }}
    ]},
  { ic:'📚', title:'Story time at the library', yr:1, w:3, when:() => toddlerHome(),
    text:'The Weller Public Library has story time for small kids each Wednesday. There are songs, a puppet and a big pile of books.',
    choices:() => [
      {label:working() ? `Go every Wednesday this month (-${fmt(dayPay() * 2)} in missed work)` : 'Go every Wednesday this month', go:() => { adj({money:-Math.round(dayPay() * 2), happy:2, community:3}); return 'Your toddler knows every song now, and you know every parent in town.'; }},
      {label:'Read at home instead', go:() => { adj({happy:1}); return 'The same dinosaur book, eleven nights in a row.'; }}
    ]},
  { ic:'💈', title:'First haircut on Main Street', yr:1, once:1, w:3, when:() => toddlerHome(),
    text:'Those curls are in their eyes. The barber on Main Street does first haircuts with a lollipop and a certificate.',
    choices:() => [
      {label:`Take them in (-${fmtc(20)})`, go:() => { adj({money:-cr(20), happy:3, community:1}); return 'A lock of hair in an envelope, a lollipop and a certificate for the fridge.'; }},
      {label:'Do it at the kitchen table', go:() => { adj({happy:1}); return 'A little crooked. Perfect.'; }}
    ]}
];
EVENTS.push(...TODDLER_EVENTS);
Object.assign(EVENT_PLACE, { 'Daycare calls: a fever':['T','mainst'], 'A daycare spot opens up':['T','mainst'], 'Potty training rut':['T','home'],
  'Story time at the library':['T','library'], 'First haircut on Main Street':['T','mainst'] });
// i46-a15: most weeks with kids at home, one plain line about one of them in the week sheet (no stats, never a pop-up)
const KID_MOMENTS = [
  [0, 1, ['Rolled over for the first time.', 'Slept four hours straight. A miracle.', 'Grabbed your nose and would not let go.', 'Laughed at a sneeze for ten minutes.', 'Spit up on your work shirt, right as you left.']],
  [2, 4, ['Learned the word "tractor" and used it all week.', 'Said "no" to every single thing.', 'Hid your keys in the toy box.', 'Wanted the same book read nine times.', 'Waved at every combine on Highway 12.', 'Ate a crayon. The purple one.']],
  [5, 12, ['Lost a tooth at recess.', 'Got 10 out of 10 on a spelling test.', 'Wants to show a calf at the county fair.', 'Built a fort in the living room and won\'t take it down.', 'Caught a crawdad in the Touchet.', 'Asked why the sky is blue, then why again.']],
  [13, 17, ['Borrowed the truck keys, and brought them back.', 'Said their whole day was "fine."', 'Stayed up late finishing a history project.', 'Asked for a ride to Walla Walla, again.', 'Made the team. Practice is every night now.', 'Ate everything in the fridge.']]
];
function kidMoment(){
  if (!S || S.practice) return '';
  const home = (S.kids || []).map((b, i) => [i, kidAge(b)]).filter(([, a]) => a < 18);
  if (!home.length || S.turn % 5 === 4) return '';          // most weeks, not every week
  const [i, a] = home[S.turn % home.length], band = KID_MOMENTS.find(([lo, hi]) => a >= lo && a <= hi);
  if (!band) return '';
  const who = home.length > 1 ? kidOrder(i) : 'Your kid';
  return `<p class="muted" style="margin-top:10px">🧒 ${who} (${a < 1 ? 'a baby' : `age ${a}`}): ${band[2][(S.turn * 7 + i * 3) % band[2].length]}</p>`;
}

/* ---------- events that must come up when they happen (round 3): they never roll at random ---------- */
const DUE_EVENTS = [
  // i3-a15: sell at harvest, or store it at the elevator and hope for a better price by spring
  { ic:'🌾', title:'Harvest: sell or store?', when:() => S.biz && S.biz.type === 'wheat' && S.biz.crop > 0,
    text:() => { const v = S.biz.crop * wheatPriceF(), ins = S.biz.bad && S.biz.ins;
      return `${S.biz.bad ? (ins ? 'A drought year, but your crop insurance paid most of a normal crop.' : 'A rough harvest: dry weather cut the crop to a third of normal.') : 'The combines are done and your wheat is in.'} The elevator pays ${wheatPriceLabel()} this summer, ${fmt(v)} for your crop. Or store it there for about ${fmt(S.biz.crop * WHEAT_STORE_FEE)} a month and sell when the price looks better. Prices usually rise a little by spring, but not always.`; },
    choices:() => [
      {label:`Sell now (+${fmt(S.biz.crop * wheatPriceF())})`, go:() => { const v = S.biz.crop * wheatPriceF(); S.money += v; S.biz.earned += v; S.biz.crop = 0; return `Sold at ${wheatPriceLabel()}: ${fmt(v)}.`; }},
      {label:'Store it at the elevator', go:() => { S.biz.stored = (S.biz.stored || 0) + S.biz.crop; S.biz.crop = 0; return 'Your wheat is in the elevator. Sell it from the Life tab when the price is right (by next July).'; }}
    ]},
  // i3-a29: a down year. Selling now locks in the loss.
  { ic:'📉', title:'Market drop', when:() => S.stocks > 0,
    text:() => `The stock market fell hard this week. Your index funds at ${BROKER} lost ${fmt(S.mkt && S.mkt.lost || 0)} and are worth ${fmt(S.stocks)} now. The news is all doom.`,
    choices:() => [
      {label:'Hold on and wait it out', go:() => { adj({happy:-2}); return 'You turned off the news. Markets have always come back, eventually.'; }},
      {label:`Sell everything (+${fmt(S.stocks)})`, go:() => { const v = S.stocks; S.stocks = 0; S.money += v; adj({happy:1}); return `You sold for ${fmt(v)} and locked in the loss. At least you can sleep.`; }}
    ]}
];
// where road and work events happen: 'road' is the town you drive to that week, 'work' your workplace
Object.assign(EVENT_PLACE, Object.fromEntries(WORK_EVENTS.map(e => [e.title, 'work'])), Object.fromEntries(ROAD_EVENTS.map(e => [e.title, 'road'])), {
  'Hot-air balloon festival in Walla Walla':['R','wallawalla'], 'A free college lecture in Walla Walla':['R','wallawalla'],
  'A friend is in the hospital in Walla Walla':['R','wallawalla'], 'Wine release weekend in Walla Walla':['R','wallawalla'],
  'A lost wallet in a Walla Walla parking lot':['R','wallawalla'], 'Train crossing in Pasco':['R','pasco'],
  'Cheap flight deal out of Pasco':['R','pasco'], 'Spring festival in Pasco':['R','pasco'], 'Hydroplane races on the Columbia':['R','kennewick'],
  'Fourth of July fireworks in Columbia Park':['R','kennewick'], 'Clearance sale at the mall':['R','kennewick'],
  'Riverfront 5K in Richland':['R','richland'], 'Hanford history tour':['R','richland'], 'Classic car show in Dayton':['R','dayton'],
  'Bluewood season pass sale':['R','bluewood'], 'Chains required on the road to Bluewood':['R','dayton']
});
const tradeBonus = () => S.tradeBy === S.turn ? cr(500) : 0;   // R-21: a dealer's trade-in bonus, this week only

/* ============================================================
   🏡 Event pack A, part 2 (W16–W30): more town events in Waitsburg (review doc 2026-11-18, section A)
   Town pacing category; every amount is in 2027 dollars and goes through cost(); labels show today's price.
   ============================================================ */
const ownHome = () => !!(HOMES[S.home] && HOMES[S.home].own);
// W16: shoveling for neighbors counts as a week toward the winter town goal
function townGoalWeek(key){
  const g = seasonGoal(); if (!g || g.key !== key || S.practice) return '';
  const id = seasonId(g);
  if (!S.sgoal || S.sgoal.id !== id) S.sgoal = { id, prog:0, done:false };
  if (S.sgoal.done) return '';
  if (++S.sgoal.prog >= g.need) { S.sgoal.done = true; adj(g.fx); S.seasonWins = (S.seasonWins || 0) + 1; log(`Helped the town: ${g.name.toLowerCase()}.`, 'mile'); return ` That finished the town goal: ${g.name}!`; }
  return ' It counts as a week toward the town goal.';
}
// W26: a windstorm hit within the last 6 weeks (its once-a-year cooldown, 40 weeks, tells when)
const windstormLately = () => S.evCd && S.evCd['Windstorm'] != null && S.evCd['Windstorm'] - 40 >= S.turn - 6;
const TOWN_EVENTS_W2 = [
  { ic:'☃️', title:'Snow day', w:2, when:m => inM(m,11,0,1),
    text:'School is called off and the whole town is buried in white.',
    choices:() => [
      {label:'Sled at the park', go:() => { adj({happy:4, health:1}); return 'Red cheeks, a cracked sled and the best afternoon all winter.'; }},
      {label:'Shovel the neighbors\' walks', go:() => { adj({community:3, health:-1}); return 'Every walk on the block is clear, and your back knows it.' + townGoalWeek('winter'); }}
    ]},
  { ic:'🥧', title:'Community potluck at Town Hall', yr:1, w:3, when:m => inM(m,8,9,10),
    text:'Long tables, folding chairs and a sign-up sheet for dishes at Town Hall.',
    choices:() => [
      {label:`Bring a dish (-${fmtc(15)})`, go:() => { const good = skillLv('cook') >= 2; adj({money:-cr(15), community:3, happy:good ? 3 : 2}); practice('cook', 1);
        return good ? 'Your dish was scraped clean first. Three people asked for the recipe.' : 'You brought a casserole and left with a full plate and new friends.'; }},
      {label:'Skip it', go:() => 'You heard the pie table was something else.'}
    ]},
  { ic:'🐶', title:'"Lost dog" poster', w:2, when:() => !S.dog,
    text:'A hand-drawn poster on the post office door: a brown mutt named Biscuit, last seen near the levee.',
    choices:() => [
      {label:'Search the levee', go:() => { adj({community:3}); if (chance(.3)) { adj({happy:3, money:cr(50)}); return `You found Biscuit asleep under a cottonwood. The family insisted on a ${fmtc(50)} reward.`; } return 'No luck, but half the town saw you looking.'; }},
      {label:'Share the post', go:() => { adj({community:1}); return 'You shared it everywhere. Biscuit came home two days later.'; }}
    ]},
  { ic:'🍺', title:'Pour beer at the Celebration Days beer garden', yr:1, w:2, when:m => inM(m,4) && age() >= 21,
    text:'The beer garden at the fairgrounds needs volunteers to pour for the Celebration Days crowd.',
    choices:() => [
      {label:'Volunteer a shift', go:() => { adj({community:3, happy:2, health:-1}); return 'Four hours on your feet, and you met half the county.'; }},
      {label:`Just visit (-${fmtc(20)})`, go:() => { adj({money:-cr(20), happy:2}); return 'A cold one in the sun, and the races on the speakers.'; }}
    ]},
  { ic:'🏛️', title:'Town Hall roof fundraiser', yr:1, w:2,
    text:'The old Town Hall roof leaks every time it rains. The town is raising money to fix it.',
    choices:() => [
      {label:`Donate (-${fmtc(100)})`, go:() => { adj({money:-cr(100), community:4}); return 'Your name is on the thermometer sign out front.'; }},
      {label:'Help with the bake-off', go:() => { adj({community:2}); return 'You judged the bake-off and ate too many brownies.'; }},
      {label:'Skip it', go:() => 'Somebody else will chip in.'}
    ]},
  { ic:'🌺', title:'Adopt a Main Street flower basket', yr:1, w:3, when:m => inM(m,3),
    text:'The town is looking for sponsors for the hanging flower baskets on Main Street.',
    choices:() => [
      {label:`Adopt one (-${fmtc(40)})`, go:() => { adj({money:-cr(40), happy:1, community:3}); return 'Petunias spill over the sidewalk, with your name on a tag all summer.'; }},
      {label:'Skip it', go:() => 'You enjoy the baskets anyway.'}
    ]},
  { ic:'⚾', title:'Little League needs a coach', yr:1, w:3, when:m => inM(m,2) && S.community >= 30 && !leagueOn(),
    text:'The Little League team has twelve kids, a bucket of balls and no coach.',
    choices:() => [
      {label:'Coach this season', go:() => { adj({community:5, happy:2, health:-1}); chainSet('league', 2, {}, [3, 6]); return 'You have a clipboard, a whistle and twelve kids who can\'t wait.'; }},
      {label:'Skip it', go:() => 'Somebody\'s dad stepped up.'}
    ]},
  { ic:'🚴', title:'A cross-country cyclist asks for water', w:2, when:m => inM(m,5,6,7),
    text:'A sunburned cyclist riding the Lewis & Clark route stops on Main Street and asks where to fill a water bottle.',
    choices:() => [
      {label:`Offer a meal (-${fmtc(10)})`, go:() => { adj({money:-cr(10), happy:3, community:1}); return 'They told you about crossing the Rockies over a burger. They\'ll remember Waitsburg.'; }},
      {label:'Fill their bottle', go:() => { adj({happy:1}); return 'Cold water and directions to the Dayton hill. Off they went.'; }}
    ]},
  { ic:'🥶', title:'Late frost kills the garden', yr:1, w:3, when:m => inM(m,4) && ownHome(),
    text:'A hard frost overnight. Your tomato starts are black and limp.',
    choices:() => [
      {label:`Replant (-${fmtc(40)})`, go:() => { adj({money:-cr(40), happy:1}); return 'New starts from the garden center, and a sheet ready for the next cold night.'; }},
      {label:'Let it go', go:() => { adj({happy:-2}); return 'No homegrown tomatoes this year.'; }}
    ]},
  { ic:'🎄', title:'Christmas lights contest', yr:1, w:3, when:m => inM(m,11),
    text:'The town is judging the best-lit house this year.',
    choices:() => [
      {label:`Go big (-${fmtc(120)})`, go:() => { adj({money:-cr(120), happy:4, community:3}); if (chance(.25)) { adj({money:cr(100)}); return `You won! Cars slow down to look, and the prize is a ${fmtc(100)} gift card.`; } return 'Cars slow down to look. You came in second to the inflatable reindeer.'; }},
      {label:`A few strings (-${fmtc(20)})`, go:() => { adj({money:-cr(20), happy:2}); return 'A few strings on the porch. Cozy.'; }},
      {label:'Skip it', go:() => 'Your house stayed dark.'}
    ]},
  { ic:'🌳', title:'Neighbor\'s tree takes out your fence', yr:1, w:8, when:() => ownHome() && windstormLately(),
    text:'The windstorm brought down your neighbor\'s old elm, right across your fence.',
    choices:() => [
      {label:`Split the cost (-${fmtc(300)})`, go:() => { adj({money:-cr(300), community:2}); return 'You split the bill and a pot of coffee. Good fences, good neighbors.'; }},
      {label:`Go through insurance (-${fmtc(500)} deductible)`, go:() => { adj({money:-cr(500), community:-1}); return 'The insurance paid, after your deductible. Your neighbor is a little cool to you now.'; }},
      {label:`Fix it yourself (-${fmtc(80)})`, if:() => skillLv('handy') >= 2, go:() => { adj({money:-cr(80), health:-1}); practice('handy', 1); return 'A chainsaw, new posts and a weekend. The fence is better than before.'; }}
    ]},
  { ic:'🤠', title:'Barn dance at the fairgrounds', yr:1, w:3, when:m => inM(m,9),
    text:'A fiddle band, hay bales and a dance floor at the fairgrounds barn.',
    choices:() => [
      {label:`Go (-${fmtc(15)})`, go:() => { adj({money:-cr(15), happy:4, community:2}); if (!S.partner) { S.danceBoost = true; return 'You danced every dance. Somebody asked your name twice.'; } return `You and ${partnerWord()} danced until the band packed up.`; }},
      {label:'Skip it', go:() => 'You heard the fiddles from your porch.'}
    ]},
  { ic:'🦃', title:'Wild turkeys strut down Main Street', w:0.5, when:m => inM(m,2,3,4),
    text:'A dozen wild turkeys are holding up traffic on Main Street.',
    choices:() => [{label:'Take a picture', go:() => { adj({happy:1}); return 'Your turkey photo got more likes than anything you\'ve ever posted.'; }}]},
  { ic:'🎓', title:'Graduation party invitations', yr:1, w:3, when:m => inM(m,5),
    text:'Graduation cards for half the senior class are stuck to your fridge.',
    choices:() => [
      {label:`Cards for everyone (-${fmtc(25)})`, go:() => { adj({money:-cr(25), community:2, happy:1}); return 'A card and a little cash for every grad. The parents noticed.'; }},
      {label:'Skip them', go:() => { adj({community:-1}); return 'You missed the parties. Somebody\'s aunt noticed.'; }}
    ]},
  { ic:'🐍', title:'Rattlesnake in the woodpile', yr:1, w:2, when:m => inM(m,5,6,7),
    text:'A dry rattle from the woodpile. There\'s a snake in there.',
    choices:() => [
      {label:`Call the guy who relocates them (-${fmtc(40)})`, go:() => { adj({money:-cr(40)}); return 'He bagged it in two minutes and drove it out to the hills.'; }},
      {label:'Handle it yourself', go:() => { if (chance(.15)) { const c = Math.round(medBill(1800)); adj({money:-c, health:-6}); return `It bit you. The hospital in Walla Walla cost ${fmt(c)} for the antivenom.`; } adj({happy:2}); return 'A long-handled shovel and steady nerves. The snake is in the canyon now.'; }}
    ]}
];
EVENTS.push(...TOWN_EVENTS_W2);
// W22: the Little League season, told in three steps. The later steps come when they're due (added to PLAN_DUE in features.js).
const leagueOn = () => { const c = (S.chains || {}).league; return !!c && c.step > 1 && c.step < 99; };
const LEAGUE_STEPS = [
  { ic:'⚾', title:'A losing streak', when:() => chainAt('league', 2),
    text:'Five games, five losses. The kids are hanging their heads in the dugout.',
    choices:() => [
      {label:'Keep it fun', go:() => { adj({happy:1}); chainSet('league', 3, { drills:false }, [3, 6]); return 'Ice cream after the game, win or lose. The kids are smiling again.'; }},
      {label:'Extra practices', go:() => { adj({health:-1, community:1}); chainSet('league', 3, { drills:true }, [3, 6]); return 'Two extra practices a week. The parents brought lawn chairs.'; }}
    ]},
  { ic:'⚾', title:'The comeback', when:() => chainAt('league', 3),
    text:'Bottom of the last inning, down by one, bases loaded.',
    choices:() => [{label:'Watch from the dugout', go:() => { const d = chain('league').f.drills; adj({happy:d ? 4 : 3, community:d ? 2 : 1}); chainSet('league', 4, {}, [2, 4]);
      return d ? 'A line drive to left, two runs score, and the kids pile on second base. The practices paid off.' : 'A dribbler past the pitcher, and the winning run slides home. Nobody stopped cheering for ten minutes.'; }}]},
  { ic:'🍕', title:'The season party', when:() => chainAt('league', 4),
    text:'The season is over. Time to celebrate with the team.',
    choices:() => [
      {label:`Pizza party (-${fmtc(40)})`, go:() => { adj({money:-cr(40), community:2, happy:2}); chainEnd('league'); return 'Pizza, trophies for everyone, and a card signed by the whole team.'; }},
      {label:`Hot dogs at the park (-${fmtc(15)})`, go:() => { adj({money:-cr(15), community:1, happy:1}); chainEnd('league'); return 'Hot dogs, a water-balloon fight and a team photo.'; }}
    ]}
];
Object.assign(EVENT_PLACE, {
  'Snow day':['T','home'], 'Community potluck at Town Hall':['T','mainst'], '"Lost dog" poster':['T','river'],
  'Pour beer at the Celebration Days beer garden':['T','fair'], 'Town Hall roof fundraiser':['T','mainst'], 'Adopt a Main Street flower basket':['T','mainst'],
  'Little League needs a coach':['T','school'], 'A losing streak':['T','school'], 'The comeback':['T','school'], 'The season party':['T','school'],
  'A cross-country cyclist asks for water':['T','mainst'], 'Late frost kills the garden':['T','home'], 'Christmas lights contest':['T','home'],
  "Neighbor's tree takes out your fence":['T','home'], 'Barn dance at the fairgrounds':['T','fair'], 'Wild turkeys strut down Main Street':['T','mainst'],
  'Graduation party invitations':['T','school'], 'Rattlesnake in the woodpile':['T','home']
});

/* ============================================================
   🌦️ WEATHER AND HARD YEARS, part 2 (ideas round 75): smoke at work and at home, roofs and deductibles after a
   windstorm, the furnace after a flood, the power going out, snow on the neighbor's walk, wind on Highway 12,
   winter and summer work scenes, and a block captain's storm plan. The Life tab's weather card is in features.js.
   ============================================================ */
// they read the shared weather year (weather.js: wxSmoke, wxHeat, wxHard, wxMild, thisYear, winterYear)
const smokeYear = () => wxSmoke();
const heatYear = () => wxHeat();
const SMOKE_RULE_MONTHS = [6, 7];                     // July and August
const outdoorJob = () => working() && !!job().outdoor;
const smokeRuleWeek = () => SMOKE_RULE_MONTHS.includes(curMonth()) && outdoorJob() && smokeYear();   // cheap checks first: no weather roll for others
const pushingSmoke = () => !!(S.smokeRule && S.smokeRule.y === thisYear() && S.smokeRule.push);
// i75-a07: in a smoke week outdoor crews work shorter days (pay ×0.9, wear ×0.5), unless you chose to push through
const SMOKE_PAY = 0.9, SMOKE_WEAR = 0.5, SMOKE_SICK = 0.08;
const smokePayMult = () => smokeRuleWeek() && !pushingSmoke() ? SMOKE_PAY : 1;
const smokeWearMult = () => smokeRuleWeek() && !pushingSmoke() ? SMOKE_WEAR : 1;
const airFilterOn = () => S.airFilter === thisYear();           // i75-a08: good for this year's smoke
const isCaptain = () => !!S.captain;                            // i75-a33
const peopleHome = () => !!(S.partner || kidsAtHome() || S.community >= 30);
const FLOOD_PROOF_OFF = 0.8;                                    // i75-a14: a raised furnace cuts flood cleanup 80%
const ROOF_RUSH = 0.3, ROOF_WAIT = [4, 8], ROOF_LEAK = 0.05;    // i75-a12
// i75-a33: running the block's storm plan takes an evening and keeps the street together
function runPlan(what){
  S.captain.runs = (S.captain.runs || 0) + 1; adj({community:3, happy:-1}); helpOut();   // i75-a18: the street remembers
  return `You worked the phone tree, checked on the neighbors who live alone and lent out the generator after ${what}. ${S.captain.runs > 1 ? `That's ${S.captain.runs} storms your street has come through together.` : 'Your street came through it together.'}`;
}
function roofWaitList(c){
  S.roofWait = { at: S.turn + ri(ROOF_WAIT[0], ROOF_WAIT[1]), c };
  return `Sharp Point Builders can come in about ${S.roofWait.at - S.turn} weeks. A blue tarp will have to do until then.`;
}
// i75-a12/a13: the windstorm's choices. Owners pick how the roof gets fixed; renters lose a day of power.
function windChoices(){
  const own = !!HOMES[S.home].own;
  const plan = isCaptain() ? [{label:own ? 'Run the block\'s storm plan, and get on a roofer\'s list' : 'Run the block\'s storm plan (an evening)',
    go:() => runPlan('the windstorm') + (own ? ' ' + roofWaitList(roofCost()) : '')}] : [];
  if (!own) return [...outageChoices('Check the damage', () => { if (S.generator) return 'Power was out a day, but your generator kept the fridge cold.'; adj({money:-cost(60), happy:-1}); return 'Power was out a day and the fridge food spoiled.'; }, 'the windstorm'),
    {label:`Tie things down and pack the fridge into a cooler (-${fmtc(20)})`, go:() => { adj({money:-cr(20)}); if (!S.generator) wxSave(cr(40)); practice('handy', 1);   // i15-a03
      return 'You tied down the patio chairs and filled a cooler with ice. The power was out a day, but nothing blew away and nothing spoiled.'; }}];
  const c = roofCost(), p = youPay('home', c, 'wind'), rush = Math.round(c * ROOF_RUSH), diy = Math.round(c * 0.5);
  // i15-a03: getting ready halves the damage (a smaller job on the roofer's list)
  const prep = {label:`Trim the big limb and tie things down (-${fmtc(40)})`, go:() => { const half = Math.round(c / 2); adj({money:-cr(40)}); practice('handy', 1);
    wxSave(p - youPay('home', half, 'wind'));
    return `You took the limb down before dark and strapped down everything loose. The wind still took some shingles, about half the damage it could have done. ${roofWaitList(half)}`; }};
  return [...plan,
    {label:`Get on a roofer's list (you pay ${fmt(p)} when they come)`, go:() => { adj({happy:-1}); return roofWaitList(c); }},
    {label:`Pay a crew from out of town to come now (${fmt(p + rush)})`, go:() => { const h = helpCut(c), p2 = youPay('home', h.c, 'wind'); adj({money:-(p2 + rush), happy:-1});
      return `A crew from Spokane had it done by Saturday: ${fmt(h.c)} of work, plus ${fmt(rush)} extra to jump the line that insurance won't cover.${h.line}${covered(h.c, p2)}`; }},
    {label:`Fix it yourself (${fmt(diy)} in shingles)`, if:() => skillLv('handy') >= 1, go:() => { adj({money:-diy}); practice('handy', 2);
      if (chance(0.12)) { const b = Math.round(medBill(150)); adj({money:-b, health:-5, happy:-2}); return `The roof is fixed, but you slipped on the ladder and wrenched a shoulder. Urgent care cost ${fmt(b)}.`; }
      adj({happy:2}); return 'Two days on the roof with a nail gun. It\'s tight again, and it cost half what a roofer charges.'; }},
    prep
  ];
}
const roofCost = () => Math.round(cost(ri(1000, 4000)) * (1 - skillLv('handy') * 0.15));

// i75-a19/a26/a33: an outage's choices. The outage's own cost (base) always happens; remote workers also decide about the
// work day, people at home can make an evening of it, and a block captain runs the plan.
function outageChoices(label, base, what){
  const remote = working() && !!job().remote, g = Math.round(tripGas('wallawalla')), day = Math.round(dayPay()), list = [];
  const both = extra => () => `${base()} ${extra()}`;
  if (isCaptain()) list.push({label:'Run the block\'s storm plan (an evening)', go:both(() => runPlan(what))});
  if (remote) {
    list.push({label:`Work from the library in Walla Walla (gas about ${fmt(g)})`, go:both(() => { adj({money:-g, happy:-1}); return 'You worked from a table by the outlets at the Walla Walla library, with half the valley\'s remote workers.'; })});
    if (S.vacDay !== thisYear()) list.push({label:'Take a vacation day', go:both(() => { S.vacDay = thisYear(); return 'You used a vacation day and read by the window. The boss understood.'; })});
    list.push({label:`Miss the work day (-${fmt(day)})`, go:both(() => { adj({money:-day}); return `No power, no internet, no remote day: ${fmt(day)} of pay.`; })});
  } else list.push({label, go:base});
  if (peopleHome()) list.push({label:remote ? `Call it a day: cards by lantern (-${fmt(day)})` : 'Cards by lantern', go:both(() => { if (remote) adj({money:-day}); adj({happy:3, community:1});
    return `Then rummy by lantern light with ${S.partner || kidsAtHome() ? 'the family' : 'the neighbors'}. Nobody wanted the power back.`; })});
  return list;
}

const WX2_EVENTS = [
  // i75-a07: Washington's wildfire-smoke rule for outdoor workers, in plain terms
  { ic:'😷', title:'The smoke rule at work', wx:1, cat:'work', yr:1, w:6, when:() => smokeRuleWeek() && !(S.smokeRule && S.smokeRule.y === thisYear()),
    text:'The air quality reading is in the unhealthy range again. State rules say outdoor crews get masks, more breaks and shorter days when the smoke is this thick.',
    choices:() => [
      {label:'Wear the mask and go home early (10% less pay, half the wear)', go:() => { S.smokeRule = { y: thisYear(), push:false }; return 'A mask, water breaks in the shade and home by two. The paychecks run a little light until the smoke clears.'; }},
      {label:'Push through for full pay', go:() => { S.smokeRule = { y: thisYear(), push:true }; adj({happy:1}); return 'Full days in the haze. Your throat is scratchy by quitting time.'; }}
    ]},
  // i75-a09: a cough, a rescue inhaler, a better week after
  { ic:'🫁', title:'A cough in a smoke week', wx:1, yr:1, w:4, when:m => inM(m,6,7,8) && kidsAtHome() > 0 && smokeYear(),
    text:() => `The smoke is thick again, and your ${kidsAtHome() > 1 ? 'youngest' : 'kid'} has a tight, wheezy cough that won't quit.${airFilterOn() ? ' The box-fan filter is humming in the living room.' : ''}`,
    choices:() => { const clinic = Math.round(medBill(120) + dayPay() / 2); return [
      {label:`Take them to The Burg Clinic (-${fmt(clinic)}, half a day)`, go:() => { adj({money:-clinic}); return 'A rescue inhaler and a plan for smoky days. By the weekend the cough was easing.'; }},
      {label:'Keep everyone inside this week', go:() => { if (airFilterOn()) return 'Windows shut and the filter humming. Board games all week, and the cough settled down.';
        adj({happy:-1}); return 'Windows shut and a stuffy house. Cabin fever for you, but the cough settled down.'; }},
      {label:'Send them to day camp anyway', go:() => { if (chance(airFilterOn() ? 0.2 : 0.4)) { const b = Math.round(medBill(450)); adj({money:-b, happy:-3});
        return `The cough got worse at camp. Urgent care in Walla Walla and a breathing treatment cost ${fmt(b)}. They were fine by morning.`; }
        adj({happy:1}); return 'They came home dusty and happy, and coughing less than you feared.'; }}
    ]; }},
  // i75-a14: after the flood, raise the furnace and water heater off the basement floor
  { ic:'🔧', title:'After the flood: the furnace', w:6, when:() => !!(S.chains && S.chains.levee) && S.floodAsk !== S.home && (S.home === 'fixer' || !HOMES[S.home].own),
    text:() => HOMES[S.home].own ? 'Everyone who got water in the basement is saying the same thing: raise the furnace and the water heater up on blocks before the river comes up again.'
      : 'Everyone who got water in the basement is saying the same thing: raise the furnace and the water heater up on blocks before the river comes up again. It\'s not your furnace, though.',
    choices:() => HOMES[S.home].own ? [
      {label:`Raise them up (-${fmt(cost(HOMES[S.home].cost))})`, go:() => { S.floodAsk = S.home; adj({money:-Math.round(cost(HOMES[S.home].cost))}); S.floodProof = S.home; practice('handy', 1); return `A plumber and a pallet of blocks. If the Touchet gets in again, the cleanup will cost about ${FLOOD_PROOF_OFF * 100}% less.`; }},
      {label:'Leave them where they are', go:() => { S.floodAsk = S.home; return 'The furnace stays on the floor. Here\'s hoping the levee holds.'; }}
    ] : [{label:'Mention it to your landlord', go:() => { S.floodAsk = S.home; adj({community:1}); return 'Your landlord said they\'d look into it. It\'s their furnace, after all.'; }}]},
  // i75-a25: high wind closes Highway 12 to trucks
  { ic:'🚛', title:'High wind closes Highway 12 to trucks', wx:1, cat:'road', yr:1, w:2, when:m => inM(m,2,3,4,9,10),
    text:() => S.jobId === 'trucker' && working() ? 'Gusts over 50 near Wallula. The state closed US-12 to high-profile trucks, and your load is due today.'
      : 'Gusts over 50 on the open stretch of US-12. Trucks are parked on the shoulder, and the crosswind is shoving cars around.',
    choices:() => S.jobId === 'trucker' && working() ? [
      {label:`Park the rig and wait it out (-${fmt(dayPay())})`, go:() => { const p = Math.round(dayPay()); adj({money:-p, happy:-1}); return `A day in the truck stop with coffee and the weather radio: ${fmt(p)} of pay.`; }},
      {label:`Take the long way around (gas about ${fmtc(70)}, a long day)`, go:() => { adj({money:-cr(70), health:-2}); return 'Three extra hours behind the wheel, but the load got there.'; }}
    ] : [
      {label:'Slow down and keep both hands on the wheel', go:() => { adj({happy:-1}); return 'Forty-five miles an hour the whole way, and you got there late.'; }},
      {label:'Keep up your speed', go:() => { if (chance(0.12)) { const c = cr(1100), p = youPay('auto', c); adj({money:-p, health:-1, happy:-2}); return `A gust pushed you onto the shoulder and into a road sign. The repair ran ${fmt(c)}.${covered(c, p)}`; }
        return 'White knuckles, but you made it on time.'; }}
    ]},
  // i75-a27: freezing fog off the river near Wallula, and planes to de-ice before the first flights
  { ic:'🛫', title:'De-icing planes at 5 a.m.', wx:1, cat:'work', yr:1, w:5, when:m => working() && S.jobId === 'airport' && inM(m,11,0,1),
    text:'Freezing fog rolled in off the Columbia near Wallula overnight, and every plane at the Pasco airport needs de-icing before the first flights. The lead wants volunteers at 4:30.',
    choices:() => [
      {label:`Take the early shifts this week (+${fmt(weekPay() * 0.25)})`, go:() => { const v = Math.round(weekPay() * 0.25); adj({money:v, health:-3, happy:-1}); return `Glycol spray in the dark and frozen fingers, and ${fmt(v)} of overtime.`; }},
      {label:'Regular hours', go:() => { adj({happy:1}); return 'You came in at seven. The early crew looked frozen.'; }}
    ]},
  // i75-a28: summer heat in the protective suit at Hanford
  { ic:'🥵', title:'Heat limits in the suit at Hanford', wx:1, cat:'work', yr:1, w:5, when:m => working() && S.jobId === 'hanford' && inM(m,6,7) && heatYear(),
    text:'It\'s over 100 out on the site, and inside the protective suit it\'s worse. Safety has set short stay times and long cool-down breaks.',
    choices:() => [
      {label:`Follow the stay times (-${fmt(dayPay())} this week)`, go:() => { const p = Math.round(dayPay()); adj({money:-p, health:1}); return `Short shifts and cold water in the shade. A little less pay (${fmt(p)}), and you felt fine.`; }},
      {label:`Push for the overtime (+${fmt(weekPay() * 0.2)})`, go:() => { const v = Math.round(weekPay() * 0.2); adj({money:v, health:-3});
        if (chance(0.25)) { const p = Math.round(dayPay()); adj({money:-p, health:-3}); return `You got dizzy in the suit on Thursday and spent a day home recovering. ${fmt(v - p)} extra after the lost day.`; }
        return `Long, hot shifts and ${fmt(v)} of overtime.`; }}
    ]}
];
EVENTS.push(...WX2_EVENTS);
Object.assign(EVENT_PLACE, { 'The smoke rule at work':'work', 'A cough in a smoke week':['T','home'], 'After the flood: the furnace':['T','home'],
'High wind closes Highway 12 to trucks':'road', 'De-icing planes at 5 a.m.':'work', 'Heat limits in the suit at Hanford':'work' });

// each week (turn.js): the smoke rule's sick days, the roof on the waiting list, the raised furnace and the neighbor's walk
function weatherLines(lines, notes){
  if (smokeRuleWeek() && pushingSmoke() && chance(SMOKE_SICK)) {
    const p = Math.round(dayPay() * 3); wxCostAdd(p); lines.push(['Sick days (smoke)', -p, 'Three days home with a smoke cough after pushing through full shifts in the haze.']);
    adj({health:-5, happy:-2}); notes.push(`😷 Full days in the smoke caught up with you: three days home sick with a cough (${fmt(p)} of pay).`); log('Missed three days of work with a smoke cough.');
  }
  if (S.floodProof && S.floodProof !== S.home) S.floodProof = null;          // the blocks stay with the house you sold
  if (S.roofWait) {
    if (!HOMES[S.home].own) S.roofWait = null;                                // sold: the buyer deals with the roof
    else if (S.turn >= S.roofWait.at) {
      const h = helpCut(S.roofWait.c), c = h.c, p = youPay('home', c, 'wind'); S.roofWait = null; wxCostAdd(p);
      lines.push(['Roof repair (after the windstorm)', -p, `Sharp Point Builders replaced the shingles: ${fmt(c)} of work.${covered(c, p)}`]);
      notes.push(`🏠 The roofer finally came: the roof is fixed. You paid ${fmt(p)}.${h.line}${covered(c, p)}`); log('The roof is fixed after the windstorm.');
    } else {
      adj({happy:-1});
      if (inM(curMonth(), 9, 10, 11, 0, 1, 2, 3, 4) && !S.roofWait.leak && chance(ROOF_LEAK)) {
        const d = cr(700), p = youPay('home', d); S.roofWait.leak = true; wxCostAdd(p);
        lines.push(['Water damage under the tarp', -p]); notes.push(`💧 Rain got under the tarp and stained the bedroom ceiling: ${fmt(p)}.`);
      }
    }
  }
  // i75-a21: a snowy week (about one in three December to March; half in a hard winter, one in seven in a mild one)
  if (S.walk && inM(curMonth(), 11, 0, 1, 2) && chance(wxHard() ? 0.5 : wxMild() ? 0.15 : 0.35)) {
    adj({health:isCaptain() ? -0.5 : -1, community:1});
    if (S.walkWinter !== winterYear()) { S.walkWinter = winterYear(); S.walkWinters = (S.walkWinters || 0) + 1;
      notes.push(`❄️ First snow of the winter: you cleared Edna's walk next door before breakfast${isCaptain() ? ', and the block\'s shovel crew took the rest' : ''}.`); }
    if (S.walkWinters >= 3 && !S.walkPie) { S.walkPie = true; adj({happy:3, community:2}); helpOut();   /* she's one of your storm debts now */ notes.push('🥧 A pie on the porch: Edna next door says thank you for three winters of a clear walk.'); log('Edna next door left a pie on the porch for three winters of shoveling.'); }
  }
}
