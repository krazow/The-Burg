// The Burg: state.js (part 1 of 8; scripts load in order and share one global scope)
/* ============================================================
   THE BURG — a life sim in Waitsburg, WA
   ============================================================ */
const APP_VERSION = '0.2.0';   // the release kit stamps the exact version (with -beta.N) into every release
const SAVE_KEY = 'theburg.save.v2', BEST_KEY = 'theburg.best.v2';
const store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
const $ = s => document.querySelector(s);
const fmt = n => (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString();
const clamp = (v,a=0,b=100) => Math.max(a, Math.min(b, v));
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const chance = p => Math.random() < p;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SEASON = m => ['Winter','Winter','Spring','Spring','Spring','Summer','Summer','Summer','Fall','Fall','Fall','Winter'][m];
const GAS = 3.89, WORKDAYS = 21, ERRAND_MILES = 300;

const W = 12/52;                 // months in one week (all money constants below are monthly)
const SS_PAY = 1900;
const COL_RATE = 0.03, WAGE_RATE = 0.025;          // yearly growth of prices and of pay
const cost = v => v * (S ? S.col : 1);              // today's price of something listed in 2027 dollars
const payNow = (j, withRaise = true) => j.pay * (S ? S.wage : 1) * (withRaise && S && S.jobId === j.id ? S.raise : 1);
const ssPay = () => cost(SS_PAY);
// layoff risk by job: 1 = shaky (retail, seasonal), 0.2 = steady (public sector, licensed work)
const LAYOFF_RISK = { diner:1, hardware:1, lift:1, cellar:1, onion:1, retail:1, foodplant:1, airport:1,
  elevator:.5, cna:.5, mech:.5, imaging:.5, loan:.5, hanford:.5, labadmin:.5, trucker:.5, rail:.5,
  para:.2, insure:.2, clerk:.2, co:.2, rn:.2, prof:.2, scientist:.2, farmhand:0 };
const K401 = [0, 0.05, 0.10];
const RUT_WEEKS = 8;
// #70: side-hustle gigs follow the seasons; pay grows up to 60% with experience (40 weeks of hustling)
const GIGS = [
  { id:'harvest', name:'harvest work', months:[6,7], pay:1300, fx:{health:-1} },
  { id:'snow', name:'plowing snow', months:[11,0,1], pay:950 },
  { id:'yard', name:'yard work and fences', months:[3,4,5,8,9], pay:750, fx:{community:1} },
  { id:'cars', name:'fixing neighbors\' cars', months:[2,10], pay:800 }
];
const currentGig = () => GIGS.find(g => g.months.includes(curMonth())) || GIGS[3];
// how much a focus still does after repeating it: full for 4 weeks, then fading to 30%
function focusEffect(f = S.focus, n = S.streakF === f ? S.streakN : 1){ return f === 'study' || n <= 4 ? 1 : Math.max(0.3, 1 - 0.12 * (n - 4)); }
const wk = v => fmt(v*W) + '/wk';
const LENGTHS = {
  half: { label:'6 Months', sub:'26 weeks',  turns:26,       target:16000 },
  two:  { label:'2 Years',  sub:'104 weeks', turns:104,      target:90000 },
  five: { label:'5 Years',  sub:'260 weeks', turns:260,      target:300000 },
  life: { label:'Lifetime', sub:'18 to the end', turns:Infinity, target:3000000 }
};

const CITIES = {
  waitsburg: { name:'Waitsburg',   miles:0,  blurb:'Home. Main Street, the Touchet River, and everybody knows your truck.' },
  dayton:    { name:'Dayton',      miles:11, blurb:'Up Highway 12 past the wheat. Courthouse, the old depot, Bluewood up the hill.' },
  wallawalla:{ name:'Walla Walla', miles:21, blurb:'The big town next door: wineries, sweet onions, colleges and the hospital.' },
  pasco:     { name:'Pasco',       miles:58, blurb:'Rail yards, the airport and food plants at the river junction.' },
  kennewick: { name:'Kennewick',   miles:62, blurb:'Shopping, hospitals and the most jobs in the Tri-Cities.' },
  richland:  { name:'Richland',    miles:68, blurb:'Hanford and the national lab. Big paychecks, long drive.' }
};

// stress = happiness drain per month, wear = health drain per month
const JOBS = [
  {id:'farmhand', city:'waitsburg', title:'Wheat farm hand',            pay:2500, edu:0, stress:.2, wear:1.0},
  {id:'diner',    city:'waitsburg', title:'Main Street diner cook',     pay:2300, edu:0, stress:.5, wear:.5},
  {id:'para',     city:'waitsburg', title:'School paraeducator',        pay:2900, edu:1, stress:.4, wear:.1},
  {id:'elevator', city:'waitsburg', title:'Grain elevator operator',    pay:3800, edu:1, stress:.4, wear:.7},
  {id:'insure',   city:'waitsburg', title:'Farm insurance agent',       pay:4900, edu:2, stress:.6, wear:0, remote:2},
  {id:'hardware', city:'dayton',    title:'Hardware store clerk',       pay:2600, edu:0, stress:.3, wear:.3},
  {id:'lift',     city:'dayton',    title:'Bluewood ski lift operator', pay:2400, edu:0, stress:.1, wear:.5},
  {id:'clerk',    city:'dayton',    title:'County courthouse clerk',    pay:3500, edu:1, stress:.5, wear:0, remote:2},
  {id:'cna',      city:'dayton',    title:'Hospital nursing assistant', pay:3400, edu:1, stress:.8, wear:.5},
  {id:'cellar',   city:'wallawalla',title:'Winery cellar hand',         pay:3000, edu:0, stress:.3, wear:.7},
  {id:'onion',    city:'wallawalla',title:'Sweet onion packing shed',   pay:2700, edu:0, stress:.4, wear:.9},
  {id:'co',       city:'wallawalla',title:'Corrections officer',        pay:5000, edu:1, stress:1.3,wear:.7},
  {id:'rn',       city:'wallawalla',title:'Registered nurse',           pay:7300, edu:2, stress:1.0,wear:.5},
  {id:'prof',     city:'wallawalla',title:'College professor',          pay:6700, edu:3, stress:.5, wear:0, remote:2},
  {id:'retail',   city:'kennewick', title:'Mall retail associate',      pay:2600, edu:0, stress:.6, wear:.2},
  {id:'mech',     city:'kennewick', title:'Auto mechanic',              pay:4400, edu:1, stress:.5, wear:.8},
  {id:'imaging',  city:'kennewick', title:'Hospital imaging tech',      pay:5700, edu:2, stress:.6, wear:.2},
  {id:'loan',     city:'kennewick', title:'Bank loan officer',          pay:6100, edu:3, stress:.8, wear:0, remote:2},
  {id:'hanford',  city:'richland',  title:'Hanford cleanup technician', pay:6500, edu:1, stress:.8, wear:1.1},
  {id:'labadmin', city:'richland',  title:'Research lab administrator', pay:4800, edu:2, stress:.5, wear:0, remote:2},
  {id:'scientist',city:'richland',  title:'National lab scientist',     pay:9200, edu:3, stress:.8, wear:0, remote:2},
  {id:'foodplant',city:'pasco',     title:'Food processing line worker',pay:3000, edu:0, stress:.6, wear:.9},
  {id:'airport',  city:'pasco',     title:'Airport ground crew',        pay:3700, edu:0, stress:.5, wear:.7},
  {id:'trucker',  city:'pasco',     title:'Truck driver (CDL)',         pay:5500, edu:1, stress:.9, wear:.8},
  {id:'rail',     city:'pasco',     title:'Rail yard conductor',        pay:6100, edu:1, stress:.8, wear:.8}
];
const jobById = id => JOBS.find(j => j.id === id);

const EDU = ['High school diploma','Trade certificate','Associate degree',"Bachelor's degree"];
const STUDY_NEED = [16, 40, 72];         // weeks of classes to reach the next level
const TUITION   = [300, 350, 650];        // per month while studying
const SCHOOL    = ['a trade program in Walla Walla','community college classes','a university program in the Tri-Cities'];

const HOMES = {
  room:  {name:'Rented room above Main Street', cost:550,  happy:0},
  house: {name:'Rented house on a quiet street', cost:1150, happy:1.5},
  fixer: {name:'Fixer-upper by the Touchet',     cost:950,  happy:1.5, own:true, down:9000,  equityPer:260},
  farm:  {name:'Farmhouse in the wheat hills',   cost:1650, happy:3,   own:true, down:30000, equityPer:520}
};
const CARS = {
  beater:{name:'1998 pickup',            mpg:15, price:0,     breakdown:.12},
  sedan: {name:'Used sedan',             mpg:32, price:9000,  breakdown:.04, value:9000},
  truck: {name:'New pickup (financed)',  mpg:21, down:4000,   pay:640, months:60, breakdown:.01, value:42000}
};

const FOCUS = {
  work:     {ic:'💼', name:'Work extra hours', desc:'+20% pay, but it wears on you.', fx:{happy:-2, health:-1.5}, payMult:1.2, needsJob:true},
  rest:     {ic:'🛋️', name:'Rest & recharge',  desc:'Sleep in, take it easy.',         fx:{happy:4, health:4}},
  community:{ic:'🤝', name:'Show up for town', desc:'Volunteer, potlucks, ballgames.',   fx:{community:4, happy:2}, cost:50},
  study:    {ic:'📚', name:'Take classes',     desc:'Work toward the next diploma.',    fx:{happy:-2}, study:true},
  outdoors: {ic:'🎣', name:'Get outside',      desc:'Fish the Touchet, hike the Blues.', fx:{health:5, happy:3}, cost:40},
  hustle:   {ic:'🔧', name:'Side hustle',      desc:'Weekend gigs that follow the seasons, and pay more as you get good at them.',        fx:{happy:-1, health:-1}, hustle:true}
};

let S = null;                 // game state
let tab = 'home', jobCity = 'all';

/* ---------- helpers on state ---------- */
const age = () => Math.floor(S.ageMonths/12);
const kidsAtHome = () => (S.kids || []).filter(b => S.ageMonths - b < 18*12).length;
// fill in fields that older saves don't have
function migrate(s){
  const d = { slot:0, evPins:[], streakF:null, streakN:0, run:null, yearEvents:0, yearStart:null, evCd:{}, evDone:{}, ui:0, col:1, wage:1, kids:[], k401:0, k401rate:0, mortgage:null, loanPay:0 };
  for (const k in d) if (s[k] === undefined) s[k] = d[k];
  // Around the region (0.3.0): older lives count as just serviced and checked, with this year's tabs paid
  if (s.goals && !s.goalAt) s.goalAt = Object.fromEntries(s.goals.map(id => [id, 0]));
  const r = { goalAt:{}, skills:{}, biz:null, weekly:null, rng:null, gen:1, badges:{}, goals:[], chains:{}, towns:{}, storiesDone:0, scenario:null, scWon:false, paidOff:false, bg:'fresh', mode:'normal', sloanLeft:0, sloanPay:0, sgoal:null, seasonWins:0, carpool:false, hustleWeeks:0, scoreQ:null, trip:null, svc:s.turn || 0, tires:null, stockUntil:-1, dentist:s.turn || 0, stopLast:{}, out:null, tabsYear:new Date(s.date || Date.now()).getFullYear() };
  for (const k in r) if (s[k] === undefined) s[k] = r[k];
  for (const [k, v] of Object.entries(EVENT_STATE())) if (s[k] === undefined) s[k] = v;
  if (!s.out || typeof s.out !== 'object') s.out = outDefault();   // Out and about (#50)
  if (HOMES[s.home] && HOMES[s.home].own && !s.mortgage) s.mortgage = HOMES[s.home].cost;
  return s;
}
const job = () => S.jobId ? jobById(S.jobId) : null;
const commuteOneWay = () => (job() && !S.retired) ? CITIES[job().city].miles : 0;
// #70: remote days (office jobs drive in 3 days a week) and carpools (half the gas, less wear) make long commutes livable
const driveDays = (j = job()) => j && j.remote ? (5 - j.remote) / 5 : 1;
const canCarpool = () => commuteOneWay() >= 20 && S.community >= 30;
const carpooling = () => !!S.carpool && commuteOneWay() >= 20;
const commuteGasFactor = (j = job()) => driveDays(j) * (S && S.carpool && j && CITIES[j.city].miles >= 20 ? 0.5 : 1);
const netWorth = () => {
  const loan = S.loanLeft > 0 ? S.loanLeft * (S.loanPay || CARS.truck.pay) * 0.85 : 0;
  const sloan = S.sloanLeft > 0 ? S.sloanLeft * S.sloanPay * 0.85 : 0;
  return S.money + S.equity + S.carValue + (S.k401 || 0) + (S.biz ? bizValue() : 0) - loan - sloan;
};
const curMonth = () => new Date(S.date).getMonth();
const dateLabel = () => { const d = new Date(S.date); return `Week of ${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`; };
const turnWord = () => 'Week';
function adj(o){
  if (o.money) S.money += o.money;
  ['happy','health','community'].forEach(k => { if (o[k]) S[k] = clamp(S[k] + o[k]); });
}
// G8: each Journal entry has a kind (k) for the filter chips: 'money', 'ev' (events), 'mile' (milestones) or 'trip'.
// Callers can pass one; otherwise (and for entries from older saves) simple text rules decide.
function logKind(m){
  m = String(m || '');
  if (/^Trip to /.test(m)) return 'trip';
  if (/^(Earned a badge|📋 Report card|Helped the town|Completed the challenge|Graduated with)|skill reached level/.test(m)) return 'mile';
  if (typeof STORY_EVENTS !== 'undefined' && STORY_EVENTS.some(e => m.startsWith(e.title + ':'))) return 'mile';
  if (/^(Hired as|Applied for|Quit the job|Retired at|Moved into|Drove home|Started a business|Sold the|Made the last truck payment|Paid off the)/.test(m)) return 'money';
  return 'ev';
}
function log(msg, k){ S.log.unshift({d: dateLabel(), m: msg, k: k || logKind(msg)}); if (S.log.length > 120) S.log.length = 120; }
/* ---------- save slots: up to 5 lives, each auto-saving to its own slot ---------- */
const SLOTS_KEY = 'theburg.slots.v1', SLOT_COUNT = 5;
function slots(){
  const a = store.get(SLOTS_KEY), out = Array.isArray(a) ? a.slice(0, SLOT_COUNT) : [];
  while (out.length < SLOT_COUNT) out.push(null);
  const old = store.get(SAVE_KEY);                 // the single save from before slots: move it into a free slot
  if (old && !old.over) {
    const i = out.indexOf(null);
    if (i >= 0) { old.slot = i; out[i] = old; store.set(SLOTS_KEY, out); store.del(SAVE_KEY); }
  } else if (old) store.del(SAVE_KEY);
  return out;
}
function writeSlot(i, game){ const a = slots(); a[i] = game; store.set(SLOTS_KEY, a); }
function save(){ if (S && !S.over && !S.practice) { S.savedAt = Date.now(); writeSlot(S.slot ?? 0, S); } }
const clone = o => JSON.parse(JSON.stringify(o));
function savedAgo(t){
  if (!t) return '';
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? 'saved just now' : m < 60 ? `saved ${m} min ago` : m < 1440 ? `saved ${Math.round(m/60)} h ago` : `saved ${new Date(t).toLocaleDateString()}`;
}
function slotLine(g){
  const d = new Date(g.date);
  return `${LENGTHS[g.len] ? LENGTHS[g.len].label : ''} · age ${Math.floor(g.ageMonths/12)} · ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()} · ${fmt(g.money)}`;
}
function slotCard(g, i, buttons){
  return g ? `<div class="slot"><div class="slotinfo"><b>${esc(g.name)}</b>${g.copyNote ? ` <span class="tag">${esc(g.copyNote)}</span>` : ''}
      <div class="s">${slotLine(g)}</div><div class="s">Slot ${i+1} · ${savedAgo(g.savedAt)}</div></div>${buttons}</div>`
    : `<div class="slot empty"><div class="slotinfo"><b>Empty slot</b><div class="s">Slot ${i+1}</div></div>${buttons}</div>`;
}
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2200); }

/* ============================================================
   🎬 HOW A LIFE BEGINS (#69) and 🎚️ MODES (#73)
   ============================================================ */
const BACKGROUNDS = {
  fresh:      { ic:'🌾', name:'Fresh start', hint:'Standard', desc:'18, a rented room above Main Street, $1,500 and the 1998 pickup. The classic start.' },
  farm:       { ic:'🚜', name:'Farm kid', hint:'Standard', desc:'Raised in the wheat hills. You start working on the family farm and everybody knows you, but you have only $300.',
    set:s => { s.money = 300; s.community = 42; s.health = 84; s.jobId = 'farmhand'; } },
  grad:       { ic:'🎓', name:'Grad coming home', hint:'Head start, with debt', desc:'21, back from college with an associate degree and $36,000 in student loans (about $380 a month for 10 years).',
    set:s => { s.ageMonths = 21*12; s.edu = 2; s.money = 500; s.community = 20; s.happy = 56; s.sloanLeft = 120; s.sloanPay = 380; } },
  transplant: { ic:'🏙️', name:'Seattle transplant', hint:'Money, but lonely', desc:'Moved over the mountains with $6,000 saved and a used sedan. Nobody in town knows you yet, and you miss the city.',
    set:s => { s.money = 6000; s.community = 5; s.happy = 50; s.car = 'sedan'; s.carValue = 9000; s.ageMonths = 24*12; } },
  parent:     { ic:'👶', name:'Young parent', hint:'Tight money, full heart', desc:'20, with a two-year-old. Money is tight and every week counts, but the town looks out for you.',
    set:s => { s.ageMonths = 20*12; s.kids = [s.ageMonths - 24]; s.money = 800; s.community = 36; s.happy = 64; } }
};
const MODES = {
  relaxed: { ic:'🌤️', name:'Relaxed', desc:'Stats wear down slower, debt grows slower and never ends your game. For playing at your own pace.' },
  normal:  { ic:'⚖️', name:'Normal', desc:'The game as designed.' },
  hard:    { ic:'🔥', name:'Hard', desc:'Stats wear down faster, more events, layoffs more likely, living costs 10% more, and debt ends the game at -$25,000.' }
};
const mode = () => (S && S.mode) || 'normal';
const bestKey = (len, m) => m && m !== 'normal' ? `${len}-${m}` : len;
const bestLabel = k => { if (k.startsWith('wk-')) return `📅 ${k.slice(3)}`; if (k.startsWith('sc-')) { const sc = SCENARIOS[k.slice(3)]; return sc ? `${sc.ic} ${sc.name}` : null; } const [len, m] = k.split('-'); return LENGTHS[len] ? `${LENGTHS[len].label}${m && MODES[m] ? ` (${MODES[m].name})` : ''}` : null; };

/* ============================================================
   🌸 SEASON GOALS IN TOWN (#77): one town goal a season, worked toward with your weekly focus
   ============================================================ */
const fmtc = n => fmt(cost(n));       // a price that rises with the cost of living, for event labels
const SEASON_GOALS = [
  { key:'spring', ic:'🌸', name:'Get Celebration Days ready', months:[2,3,4], focus:['community'], need:6, fx:{community:6, happy:3},
    what:'Show up for town', done:'Celebration Days went off without a hitch, and people know you helped.' },
  { key:'summer', ic:'🌾', name:'Bring in the harvest', months:[5,6,7], focus:['work','hustle','community'], need:5, fx:{community:5, happy:2},
    what:'Work extra, Side hustle or Show up for town', done:'The wheat is in. The whole valley breathes out, and you were part of it.' },
  { key:'fall', ic:'🍂', name:'Stock the food bank before winter', months:[8,9,10], focus:['community'], need:5, fx:{community:6, happy:3},
    what:'Show up for town', done:'The food bank shelves are full going into winter.' },
  { key:'winter', ic:'❄️', name:'Holiday food drive and shoveling for neighbors', months:[11,0,1], focus:['community','outdoors'], need:4, fx:{community:5, happy:4},
    what:'Show up for town or Get outside', done:'Every older neighbor on your street had a clear walk and a full pantry.' }
];
const seasonGoal = () => SEASON_GOALS.find(g => g.months.includes(curMonth()));
// the season's year label, so winter's December–February counts as one season
const seasonId = g => { const d = new Date(S.date), y = d.getFullYear(); return `${g.key}-${g.key === 'winter' && d.getMonth() <= 1 ? y - 1 : y}`; };
function seasonWeek(notes){
  const g = seasonGoal(); if (!g || S.practice) return;
  const id = seasonId(g);
  if (!S.sgoal || S.sgoal.id !== id) S.sgoal = { id, prog:0, done:false };
  if (S.sgoal.done || !g.focus.includes(S.focus)) return;
  S.sgoal.prog++;
  if (S.sgoal.prog >= g.need) {
    S.sgoal.done = true; adj(g.fx); S.seasonWins = (S.seasonWins || 0) + 1;
    notes.push(`${g.ic} Town goal done: ${g.name}! ${g.done}`); log(`Helped the town: ${g.name.toLowerCase()}.`, 'mile');
  }
}
function seasonLine(){
  const g = seasonGoal(); if (!g || S.practice) return '';
  const st = S.sgoal && S.sgoal.id === seasonId(g) ? S.sgoal : { prog:0, done:false };
  const end = MONTHS[g.months[g.months.length - 1]];
  return `<div class="sgoal">${g.ic} <b>Town goal:</b> ${g.name} · ${st.done ? '✅ done!' : `${st.prog}/${g.need} weeks of ${g.what} (until the end of ${end})`}</div>`;
}
