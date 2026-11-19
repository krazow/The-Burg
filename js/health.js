// The Burg: health.js (Health, body and aging, round 74; loads after outabout.js and before maps.js; one shared global scope)
/* ============================================================
   🩺 HEALTH, BODY AND AGING (i74-a01 to a14), kept gentle and plain
   - a01 every job wears on a body part, and 'Hurt on the job' names it and fits its fix
   - a02 Washington sick hours: 1 hour per 40 worked (one a paid week), up to 40, used for sick days
   - a03 a personal day when happiness runs low, no questions asked
   - a04 ambulance district membership, a05 the county medical van, a08 dental coverage
   - a06 desk jobs wear a little after 40, a07 physical therapy after a work injury
   - a09 Get outside reads differently by age, a10 chair exercise at the senior center, a11 grown-up shots
   - a12 who drives Dad to Walla Walla, a13 a respite weekend, a14 paid family leave
   Money is in 2027 dollars and goes through cost(); labels use fmtc().
   ============================================================ */
const SICK_CAP = 40, SICK_DAY = 8;                     // a02: hours, and the hours in one sick day
const AMB_YEAR = 60, AMB_RIDE = 1200;                  // a04: membership a year; the ride bill without it
const DENTAL = 28, TOOTH_BILL = 1400, TOOTH_DENTAL = 400, TOOTH_EMERG_DENTAL = 250;   // a08
const VAN_FARE = 5, VAN_TIME = 0.6, VAN_AGE = 75;      // a05: the van takes the whole day: your focus works at 60% that week
const DESK_AGE = 40, DESK_WEAR = 0.2;                  // a06: monthly health drift for no-wear jobs after 40
const PT_WEEKS = 6, PT_COPAY = 40, LINGER = 0.3, WW_MILES = 21;   // a07: copay a visit, two visits a week; a lingering injury's drift
const MH_GAP = 13, MH_HAPPY = 45;                      // a03
const SHOT_COST = 60, SKI_HEALTH = 35;                 // a11; a09: skiing Bluewood wants a fair health score
const CHAIR_AGE = 65;                                  // a10
const RESPITE_COST = 160, RESPITE_HAPPY = 4, RESPITE_HEALTH = 3;   // a13
const LEAVE_WEEKS = 12, LEAVE_RATE = 0.9, LEAVE_CAP = 6500;        // a14: 90% of pay, up to about $1,500 a week (2027)
const HEALTH_STATE = () => ({ sickHrs:0, injury:null, deskHabit:false, shots:{}, mhDay:-99, parent:null });
function healthMigrate(s){
  for (const [k, v] of Object.entries(HEALTH_STATE())) if (s[k] === undefined) s[k] = v;
  if (!s.shots || typeof s.shots !== 'object') s.shots = {};
  if (s.ins && typeof s.ins === 'object') { if (s.ins.dental === undefined) s.ins.dental = false; if (s.ins.amb === undefined) s.ins.amb = false; }
  return s;
}

/* ---- a01: what each job wears on ---- */
const BODY = {
  back:      { name:'back',      ic:'🧍', hurt:'You wrenched your back lifting', fix:'See the doctor and start back stretches' },
  wrists:    { name:'wrists',    ic:'✋', hurt:'Your wrists ache from the same motion all shift', fix:'A wrist brace and a doctor visit' },
  ears:      { name:'ears',      ic:'👂', hurt:'Your ears are ringing after a loud shift', fix:'A hearing check and better ear protection' },
  feet:      { name:'feet',      ic:'🦶', hurt:'Your feet and knees are sore from standing all day', fix:'Good shoes and a doctor visit' },
  shoulders: { name:'shoulders', ic:'💪', hurt:'You strained a shoulder reaching overhead', fix:'See the doctor and rest the shoulder' },
  eyes:      { name:'eyes',      ic:'👀', hurt:'Your eyes are tired and your back is stiff from the screen', fix:'An eye exam and a better chair' }
};
const JOB_BODY = { farmhand:'back', diner:'wrists', para:'feet', elevator:'back', hardware:'feet', lift:'back', cna:'back', cellar:'back',
  onion:'wrists', co:'feet', rn:'back', retail:'feet', mech:'back', imaging:'back', hanford:'back', foodplant:'wrists', airport:'ears',
  trucker:'back', rail:'ears', windtech:'shoulders', damop:'ears', forest:'back', teacher:'feet', nukeop:'ears', harvtruck:'back',
  electrician:'shoulders', plumber:'back', lineman:'shoulders', welder:'shoulders', phleb:'wrists', barista:'wrists', grocer:'feet' };
for (const j of JOBS) if (!j.body) j.body = JOB_BODY[j.id] || (j.wear ? 'back' : 'eyes');
const bodyOf = (j = job()) => (j && BODY[j.body]) ? j.body : 'back';

/* ---- a02: sick hours ---- */
const sickHrs = () => Math.floor((S && S.sickHrs) || 0);
const canSick = (h = SICK_DAY) => working() && sickHrs() >= h;
function useSick(h){ if (!canSick(h)) return false; S.sickHrs -= h; return true; }

/* ---- a04 / a08: insurance extras ---- */
const dentalOn = () => !!(S && S.ins && S.ins.dental);
const ambOn = () => !!(S && S.ins && S.ins.amb);
function insExtras(){
  const i = (S && S.ins) || {}, out = [];
  if (i.dental) out.push(['🦷 Dental', DENTAL]);
  if (i.amb) out.push(['🚑 Ambulance district membership', AMB_YEAR / 12]);
  return out;
}
const ambRide = () => ambOn() ? 0 : Math.round(cost(AMB_RIDE));

/* ---- a11: grown-up shots ---- */
const hasShot = k => !!S && !!S.shots && S.shots[k] != null;
const shotDue = () => !!S && ((age() >= 50 && !hasShot('shingles')) || (age() >= 65 && !hasShot('pneu')));
const shotsHad = () => hasShot('shingles') || hasShot('pneu');
const shotWhy = () => age() < 50 ? 'From age 50' : 'Up to date';

/* ---- a05: the county medical van ---- */
const vanOK = () => !!S && (age() >= VAN_AGE || !S.car);
const vanFits = (city, ids) => city === 'wallawalla' && vanOK() && ids.length > 0 && ids.every(id => { const s = stopById(id); return s && s.kind === 'appt'; });
const vanTrip = t => !!(t && t.van && vanFits(t.city, t.stops));

/* ---- a07: physical therapy ---- */
const wwGas = trips => tripIsCommute('wallawalla') ? 0 : trips * WW_MILES * 2 * cost(GAS) / CARS[S.car].mpg;
const ptWeekCost = () => medBill(PT_COPAY) * 2 + wwGas(2);
function startPT(part){ S.injury = { part: part || bodyOf(), pt: S.turn + PT_WEEKS }; }

/* ---- a12 / a13 / a14: an aging parent ---- */
// bill = monthly money, drives = drives to Walla Walla a month (gas), happy/health/comm = monthly drift, like CARE
const DAD_WAYS = {
  share: { ic:'🤝', name:'Split the drives with your sister', bill:120, drives:2, happy:-0.5, health:0, comm:0,
    desc:'Your sister drives over from Spokane every other trip. You chip in for her gas and motel, and you both get some breathing room.' },
  pay:   { ic:'🚐', name:'Pay for a driver and a helper', bill:450, drives:0, happy:-0.1, health:0, comm:0,
    desc:'A driver from the senior center takes Dad, and a helper sits with him at the appointments. It costs, but your weeks stay your own.' },
  you:   { ic:'🛻', name:'Take every drive yourself', bill:0, drives:4, happy:-1.3, health:-0.6, comm:0.2,
    desc:'You do all the driving and all the waiting rooms. Dad loves the company. It wears on you, though.' },
  leave: { ic:'🏡', name:'Take paid family leave and do it yourself', bill:0, drives:4, happy:-0.4, health:0, comm:0.2,
    desc:`Washington's paid leave covers caring for a parent: up to ${LEAVE_WEEKS} weeks at most of your pay, with your job waiting for you.` }
};
const caring = () => !!(S && S.parent && !S.parent.done && DAD_WAYS[S.parent.who]);
const onLeave = () => !!(caring() && S.parent.who === 'leave' && S.turn < (S.parent.leaveEnd ?? -1) && working());
const careWay = () => !caring() ? null : S.parent.who === 'leave' && !onLeave() ? DAD_WAYS.you : DAD_WAYS[S.parent.who];
const respiteOK = () => caring() && S.parent.who !== 'pay' && ((S.parent.drain || {}).happy > 0.5 || (S.parent.drain || {}).health > 0.5);
const leavePayMonthly = j => Math.min(payNow(j) * LEAVE_RATE, LEAVE_CAP * S.wage);
function leavePay(j, lines){
  const v = leavePayMonthly(j) * W;
  lines.push(['Paid family leave (90% of pay)', v, `Washington paid family leave: 90% of your pay, up to about ${fmt(LEAVE_CAP * S.wage * W)} a week, for up to ${LEAVE_WEEKS} weeks.`]);
  return v;
}
function dadChoices(leaveOK){
  const pick = k => () => {
    const p = S.parent = S.parent && !S.parent.done ? S.parent : { who:null, until: S.turn + ri(52, 78), drain:{ happy:0, health:0 }, leaveUsed:false };
    p.who = k;
    if (k === 'leave') { p.leaveUsed = true; p.leaveEnd = S.turn + LEAVE_WEEKS; }
    log(`Dad's appointments: ${DAD_WAYS[k].name.toLowerCase()}.`, 'mile');
    return DAD_WAYS[k].desc;
  };
  const lab = k => { const w = DAD_WAYS[k]; return `${w.ic} ${w.name}${w.bill ? ` (${fmtc(w.bill)}/month)` : k === 'you' ? ' (time and gas)' : ''}`; };
  return [
    { label: lab('share'), go: pick('share') },
    { label: lab('pay'), go: pick('pay') },
    { label: lab('you'), go: pick('you') },
    { label: lab('leave'), if: () => leaveOK() && working() && !(S.parent && S.parent.leaveUsed), go: pick('leave') }
  ];
}

/* ---- the week: sick hours, therapy, Dad's care (runs in weekTick's money step) ---- */
function healthWeek(lines, notes, j, gross){
  if (j && gross > 0 && !onLeave()) S.sickHrs = Math.min(SICK_CAP, (S.sickHrs || 0) + 1);   // one hour per 40 worked
  const inj = S.injury;
  if (inj && inj.pt != null) {
    lines.push(['Physical therapy (2 visits)', -ptWeekCost(), `Six weeks of therapy in Walla Walla for your ${BODY[inj.part] ? BODY[inj.part].name : 'injury'}: two copays${wwGas(2) ? ' and the gas' : ''}.`]);
    adj({ happy: -0.3 });                                  // two afternoons a week in the car and the waiting room
    if (S.turn + 1 >= inj.pt) {
      adj({ health: 3 }); S.injury = null;
      notes.push(`🩹 Physical therapy is done: your ${BODY[inj.part] ? BODY[inj.part].name : 'body'} feels strong again.`);
      log('Finished six weeks of physical therapy.', 'ev');
    }
  }
  if (caring()) {
    const p = S.parent, w = careWay();
    if (w.bill) lines.push([w === DAD_WAYS.share ? 'Your share of Dad\'s rides' : 'A driver and helper for Dad', -cost(w.bill) * W, w.desc]);
    if (w.drives) { const g = wwGas(w.drives * W); if (g) lines.push(['Driving Dad to Walla Walla', -g, `About ${w.drives} drives a month, ${WW_MILES} miles each way.`]); }
    if (S.turn >= p.until) {
      S.parent = { done: true, who: p.who };
      notes.push('🧓 Dad\'s run of appointments is done. He\'s settled and doing well, and he says thank you more than he used to.');
      log('Dad\'s appointments wrapped up. He\'s doing well.', 'mile');
    }
  }
}
// monthly drift from the body and from caregiving; adds plain reasons to the week's "why"
function bodyDrift(a, j, why){
  const d = { dh:0, dH:0, dc:0 };
  if (j && !j.wear && a >= DESK_AGE && !S.deskHabit && !onLeave()) { d.dH -= DESK_WEAR; why.push('💺 Long days at a desk after 40, a stiff back and tired eyes: ▼ health a little.'); }
  if (S.injury && S.injury.linger) { d.dH -= LINGER; why.push(`🩹 Your ${BODY[S.injury.part] ? BODY[S.injury.part].name : 'injury'} never fully healed: ▼ health a little. Physical therapy in Walla Walla can still help.`); }
  const w = careWay();
  if (w) {
    d.dh += w.happy; d.dH += w.health; d.dc += w.comm;
    const dr = S.parent.drain = S.parent.drain || { happy:0, health:0 };
    dr.happy += -w.happy * W; dr.health += -w.health * W;
    why.push(`🧓 Helping Dad (${w.name.toLowerCase()}): ${w.happy < -0.3 ? '▼ happiness' : 'a little ▼ happiness'}${w.health < 0 ? ', ▼ health' : ''}${w.comm > 0 ? ', ▲ community' : ''}.`);
  }
  return d;
}
// a trip stop's own effects (a07, a11, a13); fx is the trip's stat change
function stopDone(s, fx){
  if (s.id === 'shots') { S.shots = S.shots || {}; if (age() >= 50) S.shots.shingles = S.turn; if (age() >= 65) S.shots.pneu = S.turn; }
  if (s.id === 'pt' && S.injury) startPT(S.injury.part);
  if (s.id === 'respite' && caring()) {
    const dr = S.parent.drain || { happy:0, health:0 };
    const h = Math.min(RESPITE_HAPPY, dr.happy), H = Math.min(RESPITE_HEALTH, dr.health);   // only gives back what caregiving took
    fx.happy += h; fx.health += H; dr.happy -= h; dr.health -= H; S.parent.drain = dr;
  }
}

/* ---- trip stops ---- */
STOPS.push(
  { id:'shots', kind:'appt', ic:'💉', name:'Grown-up shots at the pharmacy', towns:['dayton','wallawalla'], cost:SHOT_COST, ok:shotDue, okWhy:shotWhy,
    note:'Shingles at 50, pneumonia at 65. A later flu week is shorter and milder.' },
  { id:'pt', kind:'appt', ic:'🩹', name:'Start physical therapy', towns:['wallawalla'], cost:0, ok:() => !!(S.injury && S.injury.linger), okWhy:() => 'For an old work injury',
    note:`Six weeks, twice a week (about ${fmtc(PT_COPAY * 2)} a week in copays, plus gas). Clears an injury that never healed.` },
  { id:'respite', kind:'appt', ic:'🌿', name:'A respite weekend (adult day program)', towns:['wallawalla'], cost:RESPITE_COST, ok:respiteOK, okWhy:() => caring() ? 'Nothing to recover yet' : 'While you\'re caring for Dad',
    note:'The adult day program looks after Dad for a weekend. Gives back health and happiness caregiving took, never more.' }
);

/* ---- a10: the senior center ---- */
PLACES.push({ id:'senior', name:'Touchet Valley Senior Center', ic:'🪑', lb:'Seniors', addr:'Waitsburg', st:'town', kind:'Senior center', hide:() => age() < CHAIR_AGE,
  desc:'Morning chair exercise, a hot lunch on weekdays, and people who notice when you don\'t come in.', hours:'Weekday mornings',
  acts:[{ id:'chair', ic:'🪑', name:'Chair exercise class', cost:3, fx:{health:3, community:2, happy:1}, minAge:CHAIR_AGE, note:'Gentle movement for 65 and up, and someone always asks how you are.' }] });

/* ---- a09: Get outside, by age ---- */
Object.defineProperty(FOCUS.outdoors, 'desc', { configurable:true, enumerable:true, get(){
  const a = S ? age() : 25;
  return a < 30 ? 'Fish the Touchet, hike the Blues.' : a < 50 ? 'Fish the Touchet, hike the lower trails.' : a < 65 ? 'Creek walks along the Touchet and fishing from the bank.'
    : a < 75 ? 'Easy walks by the river and a little fishing.' : 'The riverwalk bench, the birds and some fresh air.';
} });

/* ---- events changed by this round ---- */
const evByTitle = t => EVENTS.find(e => e.title === t);
// a01 + a07: the injury fits the job, and a therapy choice follows
Object.assign(evByTitle('Hurt on the job'), {
  text:() => `${BODY[bodyOf()].hurt} at your ${job().title.toLowerCase()} job.`,
  choices:() => { const b = BODY[bodyOf()], hurt = () => { if (!(S.injury && S.injury.pt != null)) S.injury = { part: bodyOf(), ask: true, at: S.turn + 1 }; }; return [
    {label:`Light duty for 4 weeks (-${fmt(weekPay() * .8)})`, go:() => { const v = Math.round(weekPay() * .8); adj({money:-v}); hurt(); return `Four weeks of light duty at 80% pay: ${fmt(v)} less. Your ${b.name} got a rest.`; }},
    {label:'Push through', go:() => { adj({health:-6}); hurt(); return `You kept working. Your ${b.name} kept score.`; }},
    {label:`${b.fix} (-${fmt(medBill(120))})`, go:() => { adj({money:-Math.round(medBill(120)), health:-2}); hurt(); return `The doctor checked your ${b.name}. It's healing.`; }}
  ]; }
});
// a02 + a11: sick hours and shots for the flu
Object.assign(evByTitle('Flu going around'), {
  text:() => shotsHad() ? 'Half the crew is out sick, and you\'re starting to feel it. Your shots from the pharmacy seem to be keeping it mild.' : 'Half the crew is out sick, and you\'re starting to feel it.',
  choices:() => [
    {label:`Stay home on sick hours (${SICK_DAY} of your ${sickHrs()})`, if:() => canSick(SICK_DAY), go:() => { useSick(SICK_DAY); adj({health: shotsHad() ? 2 : 1}); return 'A day in bed with soup, and your paycheck didn\'t notice.'; }},
    {label:`Stay home unpaid (-${fmt(dayPay())})`, go:() => { adj({money:-Math.round(dayPay()), health: shotsHad() ? 2 : 1}); return 'A day in bed with soup.'; }},
    {label:'Work sick', go:() => { adj({health: shotsHad() ? -2 : -4}); if (chance(.3)) { adj({community:-1}); return 'You worked through it, and two coworkers caught it from you.'; } return shotsHad() ? 'You worked through it. It passed quickly.' : 'You worked through it. Barely.'; }}
  ]
});
// a02: sick days for feeling run down
{ const e = evByTitle('Feeling run down'), old = e.choices;
  e.choices = () => { const c = old(); c.splice(1, 0, {label:`Take two sick days to rest (${SICK_DAY * 2} of your ${sickHrs()} sick hours)`, if:() => canSick(SICK_DAY * 2),
    go:() => { useSick(SICK_DAY * 2); adj({health:7, happy:1}); return 'Two days of sleep and soup, paid. You feel more like yourself.'; }}); return c; }; }
// a08: dental coverage makes the emergency dentist cheaper
{ const e = evByTitle('Toothache');
  e.choices = () => [
    {label:`Emergency dentist in Walla Walla (-${fmtc(dentalOn() ? TOOTH_EMERG_DENTAL : 650)})`, go:() => { adj({money:-Math.round(cost(dentalOn() ? TOOTH_EMERG_DENTAL : 650)), health:-1}); S.dentist = S.turn; return `A root canal later, you can chew again.${dentalOn() ? ' Dental coverage paid most of it.' : ''} A yearly checkup would have caught it.`; }},
    {label:'Tough it out', go:() => { adj({health:-4, happy:-4}); return 'Ice packs and ibuprofen. It still hurts.'; }}
  ]; }
// a09: skiing wants a fair health score; otherwise ride up for the view
{ const e = evByTitle('Powder day at Bluewood'), old = e.choices;
  e.choices = () => { const c = old(); c[0].if = () => S.health >= SKI_HEALTH;
    c.splice(1, 0, {label:`Ride up for the view and a cocoa (-${fmtc(15)})`, if:() => S.health < SKI_HEALTH, go:() => { adj({money:-cr(15), happy:4}); return 'Snowy firs, a warm mug and skiers going by. A fine morning.'; }}); return c; }; }

const HEALTH_EVENTS = [
  // a03: a personal day
  { ic:'🌤️', title:'A personal day', cat:'work', w:3, when:() => working() && S.happy < MH_HAPPY && S.turn - (S.mhDay ?? -99) >= MH_GAP,
    text:'It\'s been a heavy stretch. Your workplace lets you take a personal day, and nobody needs a reason.',
    choices:() => [
      {label:canSick(SICK_DAY) ? `Take a personal day (${SICK_DAY} sick hours)` : `Take a personal day (-${fmt(dayPay())})`, go:() => { S.mhDay = S.turn;
        if (!useSick(SICK_DAY)) adj({money:-Math.round(dayPay())}); adj({happy:1.5}); return 'A quiet day: a slow breakfast, a walk by the Touchet, an early night. It helped.'; }},
      {label:'Not this week', go:() => { S.mhDay = S.turn; return 'You kept going. The offer stands next time.'; }}
    ]},
  // a06: desk jobs after 40
  { ic:'💺', title:'Stiff after a long day at the desk', cat:'work', yr:1, w:2, when:() => working() && !job().wear && age() >= DESK_AGE && !S.deskHabit,
    text:'Your back is stiff and your eyes are tired by three o\'clock. A coworker has started walking a loop around the block at lunch.',
    choices:() => [
      {label:'Stand up and walk at lunch', go:() => { S.deskHabit = true; adj({health:1, happy:1}); return 'A lap around the block every day. The stiffness eased up, and you know the neighbors\' dogs now.'; }},
      {label:'Eat at your desk', go:() => 'You kept working through lunch. The stiffness stayed.'}
    ]},
  // a08: a cracked tooth, more likely when the dentist was long ago
  { ic:'🦷', title:'A cracked tooth', yr:1, w:() => S.turn - (S.dentist ?? 0) > 52 ? 1 : 0.3,
    text:() => `You bit down on an olive pit, and now a back tooth is cracked.${dentalOn() ? ' Your dental coverage pays most of a crown.' : ''}`,
    choices:() => [
      {label:`A crown in Walla Walla (-${fmtc(dentalOn() ? TOOTH_DENTAL : TOOTH_BILL)})`, go:() => { adj({money:-cr(dentalOn() ? TOOTH_DENTAL : TOOTH_BILL)}); S.dentist = S.turn; return `A crown and a cleaning. ${dentalOn() ? 'Dental covered most of it.' : 'Pricey, but it\'s fixed.'}`; }},
      {label:'Chew on the other side for now', go:() => { adj({health:-2, happy:-3}); return 'You eat carefully. It twinges.'; }}
    ]},
  // a11: flu in town when you aren't working
  { ic:'🤧', title:'Flu season in town', yr:1, w:2, when:m => inM(m,11,0,1) && age() >= 50 && !working(),
    text:() => `The flu is going around Waitsburg, and it found you.${shotsHad() ? ' Your shots from the pharmacy help you bounce back.' : ''}`,
    choices:() => [{label:'Rest at home with soup', go:() => { adj({health: shotsHad() ? -1 : -3, happy:-1}); return shotsHad() ? 'A few slow days, and you were back on your feet.' : 'A long, achy week on the couch.'; }}]}
];
EVENTS.push(...HEALTH_EVENTS);
// events that come when they're due (a07, a12, a14)
PLAN_DUE.push(
  { ic:'🩹', title:'Physical therapy, or tough it out?', when:() => !!(S.injury && S.injury.ask && S.turn >= S.injury.at && working()),
    text:() => `Your ${BODY[S.injury.part] ? BODY[S.injury.part].name : 'injury'} still bothers you. The doctor suggests six weeks of physical therapy in Walla Walla, twice a week.`,
    choices:() => [
      {label:`Six weeks of therapy (about ${fmt(ptWeekCost())} a week)`, go:() => { startPT(S.injury.part); return 'Two afternoons a week of stretches and bands. The therapist says you\'re doing great.'; }},
      {label:'Tough it out', go:() => { S.injury = { part: S.injury.part, linger: true }; return 'You\'ll manage. It aches now and then, and it may keep aching until you get it seen to.'; }}
    ]},
  { ic:'🧓', title:'Who drives Dad to Walla Walla?', once:1, when:() => isLifetime() && !S.parent && age() >= 45 && age() < 63 && (age() >= 50 || chance(0.012)),
    text:'Your sister calls from Spokane. Dad is slowing down, and he has appointments in Walla Walla every week or two for the next year or so. He can\'t drive himself anymore. How will the two of you handle it?',
    choices:() => dadChoices(() => true)},
  { ic:'🏡', title:'Family leave is ending', when:() => caring() && S.parent.who === 'leave' && S.turn >= (S.parent.leaveEnd ?? 0),
    text:'Your paid family leave is almost used up, and Dad still has appointments. Back to work Monday. Who drives him now?',
    choices:() => dadChoices(() => false)}
);
Object.assign(EVENT_PLACE, { 'A personal day':['T','home'], 'Stiff after a long day at the desk':'work', 'A cracked tooth':['R','wallawalla'],
  'Flu season in town':['T','home'], 'Physical therapy, or tough it out?':['R','wallawalla'], 'Who drives Dad to Walla Walla?':['T','home'], 'Family leave is ending':['T','home'] });

/* ---- the Life tab card ---- */
function healthCard(){
  const j = working() ? job() : null, a0 = age(), row = (l, v) => `<div class="kv"><span>${l}</span><span>${v}</span></div>`, inj = S.injury;
  const shots = a0 >= 50 ? [hasShot('shingles') ? 'shingles ✓' : 'shingles due', ...(a0 >= 65 ? [hasShot('pneu') ? 'pneumonia ✓' : 'pneumonia due'] : [])].join(' · ') : '';
  const w = careWay();
  return `<div class="card" id="healthcard"><h3>🩺 Health and body</h3>
    ${j ? row(`${BODY[bodyOf(j)].ic} Your job wears on your`, BODY[bodyOf(j)].name) : ''}
    ${j || S.sickHrs ? row('🤒 Sick hours', `${sickHrs()} of ${SICK_CAP}`) : ''}
    ${inj ? row('🩹 Work injury', inj.pt != null ? `therapy, ${Math.max(0, inj.pt - S.turn)} weeks left` : inj.linger ? `your ${BODY[inj.part].name} still aches` : 'healing') : ''}
    ${j && !j.wear && a0 >= DESK_AGE ? row('💺 Desk days', S.deskHabit ? 'you walk at lunch ✓' : 'stiff by afternoon') : ''}
    ${shots ? row('💉 Grown-up shots', shots) : ''}
    ${row('🦷 Dental', dentalOn() ? 'covered' : 'not covered')}${row('🚑 Ambulance district', ambOn() ? 'member' : 'not a member')}
    ${w ? row('🧓 Dad\'s appointments', `${w.ic} ${w.name}${onLeave() ? ` · leave, ${S.parent.leaveEnd - S.turn} weeks left` : ''}`) : ''}
    <p class="muted" style="margin:6px 0">${j ? 'Jobs earn an hour of sick time for every 40 worked (up to 40). They cover sick days, so the week isn\'t unpaid. ' : ''}${inj && inj.linger ? 'Physical therapy is a stop on a Walla Walla trip. ' : ''}${w && S.parent.who !== 'pay' ? 'A respite weekend in Walla Walla gives back what caregiving takes. ' : ''}${a0 >= VAN_AGE ? 'The county medical van can take you to Walla Walla appointments for ' + fmtc(VAN_FARE) + '. ' : ''}Dental and the ambulance district are on the insurance sheet.</p>
  </div>`;
}
