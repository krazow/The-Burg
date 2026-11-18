// The Burg: events.js (part 4 of 8; scripts load in order and share one global scope)
/* ---------- events ---------- */
function pickEvent(month){
  const wt = e => typeof e.w === 'function' ? e.w() : (e.w || 1);
  const ok = EVENTS.filter(e => !(S.evCd[e.title] > S.turn) && !(e.once && S.evDone[e.title]) && (!e.when || e.when(month)) && wt(e) > 0);
  const total = ok.reduce((a,e) => a + wt(e), 0);
  let r = Math.random() * total;
  for (const e of ok) { r -= wt(e); if (r <= 0) return e; }
  return null;
}
function showEvent(ev){
  const before = {happy:S.happy, health:S.health, community:S.community};
  const choices = ev.choices().filter(c => !c.if || c.if());
  const pin = S.evPins && S.evPins[0] && S.evPins[0].t === ev.title ? [S.evPins[0].m, S.evPins[0].k] : eventPlace(ev);
  sheet(`<div class="big">${ev.ic}</div><h2 style="text-align:center">${ev.title}</h2><p class="evplace">📍 ${esc(placeName(pin))}${pin[0] === 'R' ? ' · on the region map' : ''}</p><p>${typeof ev.text==='function'?ev.text():ev.text}</p>
    ${choices.map((c,i) => `<button class="btn ${i===0?'primary':'ghost'}" data-i="${i}">${c.label}</button>`).join('')}`);
  document.querySelectorAll('#sheet [data-i]').forEach(b => b.onclick = () => {
    const mBefore = S.money;
    const result = choices[+b.dataset.i].go() || '';
    const dm = S.money - mBefore;
    if (result) S.log.unshift({d: S.evLabel || dateLabel(), m: `${ev.title}: ${result}`});
    if (S.run) S.run.happened.push({ ic: ev.ic, title: ev.title, money: dm });
    if (S.evPins && S.evPins[0] && S.evPins[0].t === ev.title) S.evPins[0].r = result;
    save();
    if (choices.length === 1) { closeSheet(); render(); toast(`${ev.ic} ${result}${dm ? ` (${dm>0?'+':''}${fmt(dm)})` : ''}`); return; }
    sheet(`<div class="big">${ev.ic}</div><p>${result}</p>
      <p>${dm ? `<span class="delta ${dm>0?'up':'down'}">${dm>0?'+':''}${fmt(dm)}</span>` : ''}${deltaChips(before)}</p>
      <button class="btn primary" id="ok">Continue</button>`);
    $('#ok').onclick = () => { closeSheet(); render(); };
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
  'Water in the basements':['T','river'], 'A levee for the town':['T','river'], 'The levee is dedicated':['T','river']
};
const WORK_SPOT = { farmhand:'fields', diner:'mainst', para:'school', elevator:'elevator', insure:'mainst' };
function eventPlace(ev){
  let pl = EVENT_PLACE[ev.title] || ['T','mainst'];
  const j = S.retired ? null : job();
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
const commuting = () => commuteOneWay() > 0;

const EVENTS = [
  { ic:'🐎', title:'Celebration Days', yr:1, w:4, when:m => inM(m,4),
    text:'Waitsburg\'s big spring weekend: parade down Main Street, horse races, and a beer garden.',
    choices:() => [
      {label:`Go to the parade and races (-${fmtc(60)})`, go:() => { adj({money:-cost(60), happy:8, community:3}); return 'You cheered yourself hoarse at the races.'; }},
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
      {label:'Drive in slow and careful', go:() => { if (chance((CARS[S.car].mpg>25 ? .3 : .2) * ditchMult())) { adj({money:-cost(850), health:-3, happy:-4}); return `You slid into a ditch. A tow and repairs ran ${fmtc(850)}.`; } adj({happy:-1}); return 'White knuckles the whole way, but you made it.'; }},
      {label:'Take an unpaid day', go:() => { const p = Math.round((job()?payNow(job(), true):0)/WORKDAYS); adj({money:-p, happy:2}); return `You stayed home with coffee and lost a day's pay.`; }}
    ]},
  { ic:'🔧', title:'Truck trouble', w:4, when:() => chance(CARS[S.car].breakdown * 4 * careMult()),
    text:() => `Your ${CARS[S.car].name.toLowerCase()} won't start.`,
    choices:() => [
      {label:'Take it to the shop', go:() => { const c = Math.round(cost(ri(300, S.car==='beater'?1400:900)) * (1 - skillLv('mechanic') * 0.15)); adj({money:-c, happy:-2}); return `The shop fixed it for ${fmt(c)}.`; }},
      {label:`Fix it yourself (-${fmtc(80)} in parts)`, if:() => skillLv('mechanic') >= 2, go:() => { adj({money:-Math.round(cost(80)), happy:2}); practice('mechanic', 1); return 'A new starter and a skinned knuckle later, it runs.'; }},
      {label:'Call a buddy who knows engines', if:() => S.community >= 40, go:() => { adj({money:-cost(120), community:2}); return 'Your buddy fixed it for parts and a six-pack.'; }}
    ]},
  { ic:'🌊', title:'The Touchet is running high', yr:1, w:3, when:m => inM(m,1,2,3),
    text:'Snowmelt and rain have the river climbing. Neighbors are filling sandbags.',
    choices:() => [
      {label:'Help sandbag', go:() => { adj({community:6, health:-2, happy:2}); return 'Muddy, cold and proud. The town held the line.'; }},
      {label:'Stay dry', go:() => { if (S.home==='fixer' && chance(.4)) { adj({money:-cost(2500), happy:-6}); return `Water got in your basement. Cleanup cost ${fmtc(2500)}.`; } adj({community:-2}); return 'The water stayed in its banks this time.'; }}
    ]},
  { ic:'🍷', title:'Wine country weekend', w:3, when:() => age() >= 21,
    text:'Friends are heading to Walla Walla tasting rooms on Saturday.',
    choices:() => [
      {label:`Go along (-${fmtc(90)})`, go:() => { adj({money:-cost(90), happy:6}); return 'A sunny afternoon among the vineyards.'; }},
      {label:`Be the designated driver (-${fmtc(20)})`, go:() => { adj({money:-cost(20), happy:3, community:3}); return 'Everyone got home safe, thanks to you.'; }},
      {label:'Not this time', go:() => 'You saved your money.'}
    ]},
  { ic:'⛷️', title:'Powder day at Bluewood', w:3, when:m => inM(m,0,1,2),
    text:'Fresh snow up above Dayton. The lifts open at nine.',
    choices:() => [
      {label:`Hit the slopes (-${fmtc(75)})`, go:() => { if (chance(.1)) { adj({money:-cost(375), health:-6, happy:2}); return `Great runs until you twisted a knee. Urgent care cost ${fmtc(300)}.`; } adj({money:-cost(75), happy:7, health:2}); return 'Bluebird skies and fresh tracks.'; }},
      {label:'Skip it', go:() => 'Maybe next storm.'}
    ]},
  { ic:'🧾', title:'Tax refund', yr:1, w:4, when:m => inM(m,2,3) && S.jobId,
    text:'Your return is in.',
    choices:() => [{label:'Nice!', go:() => { const r = Math.round(cost(ri(300,1300))); adj({money:r, happy:3}); return `The IRS sent back ${fmt(r)}.`; }}]},
  { ic:'📈', title:'A raise', w:3, when:() => job() && !S.retired && S.jobMonths >= 12 && S.raise < 1.5,
    text:() => `Your boss at the ${job().title.toLowerCase()} job calls you in.`,
    choices:() => [{label:'Hear them out', go:() => { S.raise = Math.min(1.5, S.raise * 1.06); S.jobMonths = 0; adj({happy:5}); return `A 6% raise! You now make ${wk(payNow(job()))}.`; }}]},
  { ic:'📉', title:'Layoffs', yr:1, w:() => 0.8 * (LAYOFF_RISK[S.jobId] ?? .5) * (mode() === 'hard' ? 1.6 : 1), when:() => job() && !S.retired && S.jobMonths >= 9,
    text:() => `Business is slow and cuts are coming at your ${job().title.toLowerCase()} job.`,
    choices:() => [
      {label:'Ask to stay on', go:() => { if (chance(.5 + S.community*0.003)) { adj({happy:-2}); return 'They kept you on. Phew.'; } const t = job().title; S.jobId = null; S.ui = 6; adj({happy:-10}); return `You were let go from your ${t.toLowerCase()} job. Check the job board.`; }},
      {label:'Take the severance', go:() => { const p = payNow(job(), true); S.jobId = null; adj({money:p*2, happy:-5}); return `You took two months' pay (${fmt(p*2)}) and walked.`; }}
    ]},
  { ic:'🐕', title:'A friendly stray', w:3, when:() => !S.dog,
    text:'A scruffy dog follows you all the way home from the park.',
    choices:() => [
      {label:'Keep it', go:() => { S.dog = true; adj({happy:8}); return 'You have a dog now. Best decision all year.'; }},
      {label:'Find it a home', go:() => { adj({community:3}); return 'A family on Main Street took it in.'; }}
    ]},
  { ic:'☕', title:'Someone catches your eye', w:2, when:() => !S.partner && age() >= 19 && age() < 75,
    text:'You keep running into the same person at the coffee shop on Main.',
    choices:() => [
      {label:'Ask them out', go:() => { if (chance(.6)) { S.partner = true; adj({happy:10}); log('Started dating someone special.'); return 'They said yes! You\'re seeing each other now.'; } adj({happy:-3}); return 'They\'re flattered but not interested. Ouch.'; }},
      {label:'Just smile', go:() => 'Maybe next time.'}
    ]},
  { ic:'💔', title:'A rough patch', w:1, when:() => S.partner,
    text:'You and your partner have been arguing a lot lately.',
    choices:() => [
      {label:`Plan a getaway to the coast (-${fmtc(400)})`, go:() => { adj({money:-cost(400)}); if (chance(.8)) { adj({happy:4}); return 'A weekend away fixed a lot.'; } S.partner = false; adj({happy:-10}); return 'It didn\'t help. You split up.'; }},
      {label:'Let it run its course', go:() => { if (chance(.5)) { adj({happy:1}); return 'Things settled down on their own.'; } S.partner = false; adj({happy:-10}); return 'You went your separate ways.'; }}
    ]},
  { ic:'🏛️', title:'Run for town council?', yr:1, w:5, when:() => S.community >= 60 && !S.council && age() >= 21,
    text:'People keep telling you that you should run for Waitsburg city council.',
    choices:() => [
      {label:`Run (-${fmtc(300)} for signs)`, go:() => { adj({money:-cost(300)}); if (chance(.65)) { S.council = true; adj({community:10, happy:5}); return 'You won the seat! Meetings are Wednesday nights.'; } adj({happy:-4}); return 'You lost by eleven votes.'; }},
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
  { ic:'🩺', title:'Feeling run down', w:5, when:() => S.health < 40,
    text:'You\'ve been tired and achy for weeks.',
    choices:() => [
      {label:`See a doctor (-${fmtc(350)})`, go:() => { const bad = S.health < 25; adj({money:-cost(350), health:12}); return bad ? 'The doctor sent you to a specialist in Walla Walla. Rest and a prescription helped a lot.' : 'Some rest and a prescription helped a lot.'; }},
      {label:'Tough it out', go:() => { adj({health:-6}); return 'You kept going. Your body kept score.'; }}
    ]},
  { ic:'🦷', title:'Toothache', w:2, when:() => S.turn - (S.dentist ?? 0) > 52,
    text:'A back tooth has been throbbing for days. It\'s been more than a year since you saw a dentist.',
    choices:() => [
      {label:`Emergency dentist in Walla Walla (-${fmtc(650)})`, go:() => { adj({money:-Math.round(cost(650)), health:-1}); S.dentist = S.turn; return 'A root canal later, you can chew again. A yearly checkup would have caught it.'; }},
      {label:'Tough it out', go:() => { adj({health:-4, happy:-4}); return 'Ice packs and ibuprofen. It still hurts.'; }}
    ]},
  { ic:'🌬️', title:'Windstorm', w:2,
    text:'A big wind tears through the valley overnight.',
    choices:() => [{label:'Check the damage', go:() => {
      if (HOMES[S.home].own) { const c = Math.round(cost(1200) * (1 - skillLv('handy') * 0.15)); adj({money:-c, happy:-3}); practice('handy', 1); return `You lost shingles. Roof repair: ${fmt(c)}${skillLv('handy') ? ' (you did part of it yourself)' : ''}.`; }
      adj({money:-cost(60), happy:-1}); return 'Power was out a day and the fridge food spoiled.'; }}]},
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
  { ic:'💡', title:'A tip from a friend', w:2, when:() => S.community >= 50 && !S.retired,
    text:'A friend says there\'s an opening nobody\'s posted yet. They could put in a word.',
    choices:() => {
      const opts = JOBS.filter(x => x.edu <= S.edu && x.id !== S.jobId && x.pay > (job() ? job().pay*S.raise : 0));
      if (!opts.length) return [{label:'Thanks anyway', go:() => { adj({community:1}); return 'Nothing beats what you have now.'; }}];
      const x = pick(opts);
      return [
        {label:`Take it: ${x.title} in ${CITIES[x.city].name} (${fmt(x.pay)})`, go:() => { S.jobId = x.id; S.jobMonths = 0; S.raise = 1; adj({happy:4}); return `You start as ${x.title} in ${CITIES[x.city].name}.`; }},
        {label:'Stay where I am', go:() => 'You thanked them and passed.'}
      ];
    }},
  { ic:'⛽', title:'Gas prices spike', w:2, when:() => commuteOneWay() >= 20,
    text:'Prices jumped at the pump this month.',
    choices:() => [
      {label:'Pay up', go:() => { const c = Math.round(commuteCost(commuteOneWay())*0.25); adj({money:-c, happy:-2}); return `Your commute costs ${fmt(c)} extra this month.`; }},
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
    text:'A great-aunt in Spokane left you something in her will.',
    choices:() => [{label:'Read the letter', go:() => { const v = Math.round(cost(ri(5,30)*1000)); adj({money:v, happy:3}); return `She left you ${fmt(v)} and a note telling you to stay out of trouble.`; }}]},
  { ic:'👶', title:'Starting a family?', yr:1, w:3, when:() => S.partner && age() >= 23 && age() <= 42 && S.kids.length < 3,
    text:() => S.kids.length ? 'You and your partner are talking about another one.' : 'You and your partner have been talking about kids.',
    choices:() => [
      {label:`Have a baby (about ${fmtc(650)}/mo until they're 18)`, go:() => { S.kids.push(S.ageMonths); adj({happy:12, community:3, health:-2}); log(S.kids.length > 1 ? `Baby number ${S.kids.length} arrived!` : 'Became a parent!'); return S.kids.length > 1 ? 'Another little Waitsburger! The house is louder and happier.' : 'A baby! Sleepless, broke and over the moon.'; }},
      {label:'Not now', go:() => 'You decided to wait.'}
    ]},
  { ic:'✈️', title:'The trip of a lifetime', yr:1, w:2, when:() => age() >= 28 && S.money > cost(12000),
    text:() => `You've always wanted to see the world. A big trip would cost about ${fmt(cost(5000))}.`,
    choices:() => [
      {label:'Book it', go:() => { adj({money:-Math.round(cost(5000)), happy:12, health:2}); return 'Two weeks away. You came home with a full camera roll and a new outlook.'; }},
      {label:'Keep saving', go:() => { adj({happy:-1}); return 'Maybe someday.'; }}
    ]},
  { ic:'🎓', title:'A kid heads off to college', yr:1, w:4, when:() => (S.kids||[]).some(b => { const a = (S.ageMonths - b)/12; return a >= 18 && a < 19; }),
    text:'Your oldest at home just graduated from Waitsburg High and wants to go to college.',
    choices:() => [
      {label:`Help with tuition`, go:() => { adj({money:-Math.round(cost(15000)), happy:8, community:2}); return 'They\'re off to college with your help. Proud doesn\'t cover it.'; }},
      {label:'They\'ll take out loans', go:() => { adj({happy:2}); return 'They\'re off to college on their own dime.'; }}
    ]},
  { ic:'🏀', title:'Friday night game', w:2, when:m => inM(m,0,1,2,8,9,10,11),
    text:'The home team is playing in the school gym tonight.',
    choices:() => [
      {label:`Go cheer (-${fmtc(10)})`, go:() => { adj({money:-cost(10), community:3, happy:3}); return 'Half the town was there. You saw everyone.'; }},
      {label:'Stay in', go:() => 'You caught the score the next morning.'}
    ]}
];
