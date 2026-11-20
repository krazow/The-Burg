// The Burg: state.js (part 1 of 8; scripts load in order and share one global scope)
/* ============================================================
   THE BURG — a life sim in Waitsburg, WA
   ============================================================ */
const APP_VERSION = '0.2.1';   // the release kit stamps the exact version (with -beta.N) into every release
// every storage key starts with KEY_PREFIX: the beta (served under /beta/) keeps its lives apart from the live game's (H3)
const KEY_PREFIX = (typeof location !== 'undefined' && String(location.pathname).includes('/beta/')) ? 'theburgbeta.' : 'theburg.';
const SAVE_KEY = KEY_PREFIX + 'save.v2', BEST_KEY = KEY_PREFIX + 'best.v2', BEST_NOTE_KEY = KEY_PREFIX + 'bestNote.v1';   // i63-a20: a best life's comeback line
const store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } },   // i60-a10: false when the write failed (storage full or blocked)
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
const $ = s => document.querySelector(s);
const fmt = n => (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');
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
// i3: pay also carries your program (+10% at matching jobs), certificate perks, and for your own job its ladder rung,
// apprenticeship step and clearance wait (payPerks lives in features.js)
const payNow = (j, withRaise = true) => j.pay * (S ? S.wage : 1) * (S && typeof payPerks === 'function' ? payPerks(j, withRaise && S.jobId === j.id) : (withRaise && S && S.jobId === j.id ? S.raise : 1));
// i3-a25: Social Security grows with your working years (35 is a full career) and your average pay, 60% to 140% of SS_PAY
const SS_FULL_YEARS = 35, SS_LOW_PAY = 2000, SS_HIGH_PAY = 6000;
const avgEarn = () => (S && S.earnYears > 0) ? S.earnSum / S.earnYears : 0;     // average monthly pay in 2027 dollars
function ssFactor(){
  if (!S) return 1;
  const work = Math.min(1, (S.earnYears || 0) / SS_FULL_YEARS), pay = clamp((avgEarn() - SS_LOW_PAY) / (SS_HIGH_PAY - SS_LOW_PAY), 0, 1);
  return 0.6 + 0.8 * work * (0.4 + 0.6 * pay);
}
const ssPay = () => cost(SS_PAY * ssFactor());
// i3-a24 / i75-b10: school, county and state jobs earn a pension: 2% (like Washington's PERS 2 and TRS 2) of your best pay there for each year, once you have 5 years
const PENSION_RATE = 0.02, PENSION_VEST = 5;
const pensionVested = () => !!S && (S.pensionYears || 0) >= PENSION_VEST;
const pensionPay = () => pensionVested() ? cost(S.pensionYears * PENSION_RATE * (S.pensionPay || 0)) : 0;   // monthly, today's dollars
// layoff risk by job: 1 = shaky (retail, seasonal), 0.2 = steady (public sector, licensed work)
const LAYOFF_RISK = { diner:1, hardware:1, lift:1, cellar:1, onion:1, retail:1, foodplant:1, airport:1,
  elevator:.5, cna:.5, mech:.5, imaging:.5, loan:.5, hanford:.5, labadmin:.5, trucker:.5, rail:.5,
  para:.2, insure:.2, clerk:.2, co:.2, rn:.2, prof:.2, scientist:.2, farmhand:0,
  windtech:.5, damop:.2, forest:1, teacher:.2, vaclerk:.2, nukeop:.2, harvtruck:1, electrician:.5, plumber:.5, lineman:.2, welder:.5, phleb:.5, remote:.8 };
const K401 = [0, 0.05, 0.10];
// i75-b11/b12: a 401(k) counts at 88% in net worth (it's taxed when it comes out); the 3% match vests after 3 years at a job
const K401_MATCH = 0.03, K401_AFTER_TAX = 0.88, K401_VEST_MONTHS = 36;
// i75-b13: retirement draws: 4% a year from 62 to 72, then the IRS required-distribution table (age 73 to 102: divisor)
const RMD_DIV = [26.5, 25.5, 24.6, 23.7, 22.9, 22.0, 21.1, 20.2, 19.4, 18.5, 17.7, 16.8, 16.0, 15.2, 14.4, 13.7, 12.9, 12.2, 11.5, 10.8, 10.1, 9.5, 8.9, 8.4, 7.8, 7.3, 6.8, 6.4, 6.0, 5.6];
const drawRate = (a = age()) => a < 73 ? 0.04 : 1 / RMD_DIV[Math.min(RMD_DIV.length - 1, a - 73)];
// i75-b14: retirees: Social Security and the pension are untaxed under $3,000 a month (10% above), 401(k) withdrawals 10%
const RETIRE_TAX_FREE = 3000, RETIRE_TAX = 0.10;
// i75-b01: Washington's 2027 minimum wage, about $17.60 an hour, full time (2027 dollars); every job pays at least this
const MIN_WAGE_MONTH = 3050;
// i75-b03: taxes by bracket (federal income tax plus Social Security and Medicare; Washington has no income tax).
// The rate on a month's pay slides smoothly from 13% (up to $3,500) to 16% ($6,000), 20% ($8,000) and 22% ($9,000 and up),
// in 2027 dollars that rise with pay, so a raise never lowers take-home
const TAX_STEPS = [[3500, 0.13], [6000, 0.16], [8000, 0.20], [9000, 0.22]];
function taxRate(monthly){
  const p = monthly / (S ? S.wage : 1);
  if (p <= TAX_STEPS[0][0]) return TAX_STEPS[0][1];
  for (let i = 1; i < TAX_STEPS.length; i++) { const [a, ra] = TAX_STEPS[i - 1], [b, rb] = TAX_STEPS[i]; if (p <= b) return ra + (rb - ra) * (p - a) / (b - a); }
  return TAX_STEPS[TAX_STEPS.length - 1][1];
}
// i75-b02: food and utilities for one adult (groceries about $400, power, water, sewer, trash, internet), 2027 dollars
const FOOD_UTIL = 700;
// i75-b04: health insurance before 50: the employee share at work, or Apple Health ($0) with no job or low pay
const HEALTH_PREMIUM = 130, APPLE_HEALTH_PAY = 1900;
// i75-b05: unemployment pays 41% of your last job's monthly pay, held between $1,500 and $4,900 (2027 dollars), for 26 weeks
const UI_SHARE = 0.41, UI_MIN = 1500, UI_MAX = 4900;
// i75-b08: the mall is always hiring; the food plant's harvest pack (August to October) pays 30% more in overtime
const RETAIL_HIRE = 0.95, RETAIL_DISCOUNT = 0.10, PLANT_OT = 0.30, PLANT_OT_MONTHS = [7, 8, 9];
const HARD_LIVING = 0.1;                  // Hard mode: rent, food and insurance cost 10% more (R15)
const HUSTLE_FADE_AFTER = 26, HUSTLE_FADE = 0.5;   // side-hustle experience fades after 6 months off, half a week per week (B9)
const LEASE_WEEKS = 260, LEASE_RENEW = 0.25, LEASE_GRACE = 8;   // a wheat lease runs 5 years; renewing costs 25% of a new lease (R13)
const BIZ_DEP = 0.05;                     // businesses lose 5% of their value a year (R13)
// vehicle tabs: about 1% of what the vehicle is worth, at least $60 in 2027 dollars (R14)
const vehicleTabs = () => Math.max(cost(60), (S.carValue || 0) * 0.01);
// kids: $650 a month each, plus $200 of childcare when you commute 20+ miles; they lift you most in weeks at home (B4)
// i75-b28: a kid costs about $950 a month (2027 dollars), $400 of it childcare. Under about 60% of the state's median
// income, Working Connections childcare caps what you pay for childcare at $115 a month (commute childcare included).
const KID_COST = 950, KID_CARE = 400, KID_CARE_COMMUTE = 200, WCCC_LINE = 5000, WCCC_CAP = 115;
const householdPay = () => { const j = !S.retired && S.jobId ? JOBS.find(x => x.id === S.jobId) : null;
  return (j ? payNow(j) / (S.wage || 1) : 0) + (S.partner && S.ageMonths < 65 * 12 ? 1400 : 0); };   // monthly, in 2027 dollars
const childcareHelp = () => householdPay() < WCCC_LINE;
const kidMonthly = () => { const care = KID_CARE + (commuteOneWay() >= 20 ? KID_CARE_COMMUTE : 0);
  return KID_COST - KID_CARE + (childcareHelp() ? Math.min(care, WCCC_CAP) : care); };
const kidCost = () => cost(kidMonthly());
const HALF_START_DIP = 5;                 // B2: a 6-month life starts with a little less happiness and health
const studyDone = () => Math.floor(S.studyProg);   // weeks of classes done (a trip week counts 3/4, R11)
const kidJoy = () => ['rest', 'community'].includes(S.focus) ? 0.6 : 0.1;
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
  // i49-a01: mins is a real-time guess from timed phone play (390×844, ⏩ where it helps)
  half: { label:'6 Months', sub:'26 weeks',  turns:26,       target:16000,   mins:'about 4 min' },
  two:  { label:'2 Years',  sub:'104 weeks', turns:104,      target:90000,   mins:'about 11 min (7 with ⏩)' },
  five: { label:'5 Years',  sub:'260 weeks', turns:260,      target:400000,  mins:'about 25 min' },   // B1: raised so careless long games don't coast on pay growth
  life: { label:'Lifetime', sub:'18 to the end', turns:Infinity, target:4000000, mins:'about 4 hours, over many sittings' }
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
  {id:'farmhand', city:'waitsburg', title:'Wheat farm hand',            pay:3100, edu:0, stress:.2, wear:1.0, outdoor:1},
  {id:'diner',    city:'waitsburg', title:'Main Street diner cook',     pay:3050, edu:0, stress:.5, wear:.5},
  {id:'para',     city:'waitsburg', title:'School paraeducator',        pay:3300, edu:1, stress:.4, wear:.1, pension:true},
  {id:'elevator', city:'waitsburg', title:'Grain elevator operator',    pay:3800, edu:1, stress:.4, wear:.7, outdoor:1},
  {id:'insure',   city:'waitsburg', title:'Farm insurance agent',       pay:4900, edu:2, stress:.6, wear:0, remote:2},
  {id:'hardware', city:'dayton',    title:'Hardware store clerk',       pay:3150, edu:0, stress:.3, wear:.3},
  {id:'lift',     city:'dayton',    title:'Bluewood ski lift operator', pay:3080, edu:0, stress:.1, wear:.5},
  {id:'clerk',    city:'dayton',    title:'County courthouse clerk',    pay:3500, edu:1, stress:.5, wear:0, remote:2, pension:true},
  {id:'cna',      city:'dayton',    title:'Hospital nursing assistant', pay:3800, edu:1, stress:.8, wear:.5},
  {id:'cellar',   city:'wallawalla',title:'Winery cellar hand',         pay:3350, edu:0, stress:.3, wear:.7},
  {id:'onion',    city:'wallawalla',title:'Sweet onion packing shed',   pay:3200, edu:0, stress:.4, wear:.9},
  {id:'co',       city:'wallawalla',title:'Corrections officer',        pay:5000, edu:1, stress:1.3,wear:.7, pension:true},
  {id:'rn',       city:'wallawalla',title:'Registered nurse',           pay:8600, edu:2, stress:1.0,wear:.5, pension:true},
  {id:'prof',     city:'wallawalla',title:'College professor',          pay:6700, edu:3, stress:.5, wear:0, remote:2},
  {id:'retail',   city:'kennewick', title:'Mall retail associate',      pay:3150, edu:0, stress:.6, wear:.2},
  {id:'mech',     city:'kennewick', title:'Auto mechanic',              pay:4800, edu:1, stress:.5, wear:.8},
  {id:'imaging',  city:'kennewick', title:'Hospital imaging tech',      pay:6400, edu:2, stress:.6, wear:.2},
  {id:'loan',     city:'kennewick', title:'Bank loan officer',          pay:6900, edu:3, stress:.8, wear:0, remote:3},
  {id:'hanford',  city:'richland',  title:'Hanford cleanup technician', pay:6500, edu:1, stress:.8, wear:1.1},
  {id:'labadmin', city:'richland',  title:'Research lab administrator', pay:5400, edu:2, stress:.5, wear:0, remote:3},
  {id:'scientist',city:'richland',  title:'National lab scientist',     pay:9200, edu:3, stress:.8, wear:0, remote:2},
  {id:'foodplant',city:'pasco',     title:'Food processing line worker',pay:3600, edu:0, stress:.6, wear:.9},
  {id:'airport',  city:'pasco',     title:'Airport ground crew',        pay:3700, edu:0, stress:.5, wear:.7, outdoor:1},
  {id:'trucker',  city:'pasco',     title:'Truck driver (CDL)',         pay:5500, edu:1, stress:.9, wear:.8},
  {id:'rail',     city:'pasco',     title:'Rail yard conductor',        pay:6100, edu:1, stress:.8, wear:.8, union:true, outdoor:1},
  // i3-a05: more valley jobs. Pay sits inside each school level's range, so none is a new best job (a rules test checks)
  {id:'windtech', city:'dayton',    title:'Wind turbine technician',    pay:5200, edu:2, stress:.5, wear:.7, where:'Wind farm in the Dayton hills', needMajor:'wind', outdoor:1},
  {id:'damop',    city:'pasco',     title:'Dam operator on the Snake',  pay:5000, edu:1, stress:.4, wear:.3, federal:true},
  {id:'forest',   city:'dayton',    title:'Forest Service crew',        pay:3300, edu:0, stress:.3, wear:1.0, where:'Blue Mountains', season:[5,6,7,8], federal:true, outdoor:1},
  {id:'teacher',  city:'waitsburg', title:'School teacher',             pay:5000, edu:3, stress:.7, wear:.1, where:'Waitsburg schools', needMajor:'teaching', union:true, pension:true},
  {id:'vaclerk',  city:'wallawalla',title:'VA hospital clerk',          pay:3600, edu:1, stress:.3, wear:0, federal:true},
  {id:'nukeop',   city:'richland',  title:'Nuclear plant operator',     pay:7000, edu:2, stress:.7, wear:.3},
  // i3-a06: seasonal work (the Bluewood lift below runs December to March)
  {id:'harvtruck',city:'waitsburg', title:'Harvest truck driver',       pay:3600, edu:1, stress:.5, wear:.6, season:[6,7], needCert:'cdl'},
  // i3-a04 / i75-b07: apprenticeships start at 50% of a journeyman's pay and step up every year (about 8,000 hours, like Washington's)
  {id:'electrician',city:'wallawalla',title:'Electrician',              pay:5900, edu:1, stress:.4, wear:.6, union:true, apprentice:{weeks:208, startMult:.5}},
  {id:'plumber',  city:'dayton',    title:'Plumber',                    pay:5400, edu:1, stress:.4, wear:.6, apprentice:{weeks:208, startMult:.5}},
  {id:'lineman',  city:'pasco',     title:'Power lineman',              pay:6300, edu:1, stress:.6, wear:.9, union:true, apprentice:{weeks:156, startMult:.6}, outdoor:1},
  // i3-a03: narrow doors from short certificates
  {id:'welder',   city:'pasco',     title:'Welder (fab shop)',          pay:3600, edu:0, stress:.4, wear:.8, needCert:'welding'},
  {id:'phleb',    city:'wallawalla',title:'Hospital phlebotomist',      pay:3200, edu:0, stress:.5, wear:.2, needCert:'phlebotomy'},
  // i3-a13: city pay from home, but no coworkers
  {id:'remote',   city:'waitsburg', title:'Remote analyst',             pay:7800, edu:3, stress:.6, wear:0, remote:5, where:'a Seattle company, from home'}
];
// i3-a05/a06/a10/a03: what existing jobs gained
Object.assign(JOBS.find(j => j.id === 'lift'), { season:[11,0,1,2] });
Object.assign(JOBS.find(j => j.id === 'trucker'), { needCert:'cdl' });
for (const id of ['hanford', 'rn', 'para', 'co']) JOBS.find(j => j.id === id).union = true;
for (const id of ['hanford', 'scientist', 'labadmin']) JOBS.find(j => j.id === id).federal = true;
// i3-a01: two named steps up from each job's starting title (others get a generic senior and lead step)
const LADDER_TITLES = {
  farmhand:['Lead hand','Farm manager'], diner:['Lead line cook','Kitchen manager'], para:['Lead paraeducator','Special-ed paraeducator'],
  elevator:['Lead operator','Elevator manager'], insure:['Senior agent','Agency manager'], hardware:['Department lead','Store manager'],
  lift:['Lift supervisor','Mountain operations lead'], clerk:['Senior clerk','Chief deputy clerk'], cna:['Charge aide','Nursing unit coordinator'],
  cellar:['Cellar master','Assistant winemaker'], onion:['Line lead','Shed supervisor'], co:['Corrections sergeant','Corrections lieutenant'],
  rn:['Charge nurse','Nurse manager'], prof:['Associate professor','Full professor'], retail:['Key holder','Store manager'],
  mech:['Lead technician','Service manager'], imaging:['Senior imaging tech','Imaging supervisor'], loan:['Senior loan officer','Branch manager'],
  hanford:['Senior technician','Field work supervisor'], labadmin:['Senior administrator','Operations manager'], scientist:['Senior scientist','Group leader'],
  foodplant:['Line lead','Shift supervisor'], airport:['Ramp lead','Station supervisor'], trucker:['Lead driver','Dispatcher'], rail:['Engineer','Yardmaster'],
  windtech:['Lead technician','Site manager'], damop:['Senior operator','Chief operator'], forest:['Squad boss','Crew boss'], teacher:['Department head','Assistant principal'],
  vaclerk:['Senior clerk','Office supervisor'], nukeop:['Senior reactor operator','Shift supervisor'], harvtruck:['Lead driver','Harvest dispatcher'],
  electrician:['Foreman','Master electrician'], plumber:['Foreman','Master plumber'], lineman:['Foreman','General foreman'],
  welder:['Lead welder','Shop foreman'], phleb:['Lead phlebotomist','Lab supervisor'], remote:['Senior analyst','Team lead'],
  barista:['Shift lead','Café manager'], grocer:['Head clerk','Store manager'], reporter:['Senior reporter','Editor'], teller:['Head teller','Branch manager'],
  apprentice:['Carpenter','Site foreman'], medasst:['Lead medical assistant','Clinic office manager'], agtech:['Senior ag technician','Agronomist']
};
const jobById = id => JOBS.find(j => j.id === id);

const EDU = ['High school diploma','Trade certificate','Associate degree',"Bachelor's degree"];
const STUDY_NEED = [16, 40, 72];         // weeks of classes to reach the next level
const TUITION   = [520, 520, 1100];       // per month while studying (i75-b29: Walla Walla's community college, the Tri-Cities university campus)
// i75-b29: the Washington College Grant pays all of it under $4,000 a month in pay (2027 dollars), none from $6,500
const GRANT_FULL = 4000, GRANT_NONE = 6500;
const grantShare = () => { const j = S && !S.retired && S.jobId ? JOBS.find(x => x.id === S.jobId) : null, p = j ? payNow(j) / (S.wage || 1) : 0;
  return Math.max(0, Math.min(1, (GRANT_NONE - p) / (GRANT_NONE - GRANT_FULL))); };
const tuitionNow = (lvl = S.edu) => cost(TUITION[lvl]) * (1 - grantShare());
const tuitionWords = () => { const g = grantShare(); return g >= 0.995 ? `free with the Washington College Grant (${wk(cost(TUITION[S.edu]))} without it)` : `${wk(tuitionNow())}${g > 0.005 ? ` after a ${Math.round(g * 100)}% Washington College Grant` : ''}${S.money < 0 ? ', on your student loan while you\'re below $0' : ''}`; };
// i75-b23: tuition in a week you're below $0 goes on a federal student loan (about 6.5%, 10 years) instead of the card
const SLOAN_RATE = 0.065, SLOAN_MONTHS = 120;
const sloanPerDollar = () => { const r = SLOAN_RATE / 12; return r / (1 - Math.pow(1 + r, -SLOAN_MONTHS)); };
function tuitionOnLoan(amt){
  const owed = (S.sloanLeft > 0 ? S.sloanLeft * S.sloanPay : 0) + amt * sloanPerDollar() * SLOAN_MONTHS;
  S.sloanLeft = Math.max(S.sloanLeft || 0, SLOAN_MONTHS); S.sloanPay = owed / S.sloanLeft;
}
const SCHOOL    = ['a trade program in Walla Walla','community college classes','a university program in the Tri-Cities'];
// i3-a02: a program to study in. Finishing a diploma in one makes it your major: +10% pay and better odds at matching jobs
const PROGRAMS = {
  nursing:   { ic:'🩺', name:'Nursing',              jobs:['cna','rn','imaging','medasst','phleb','vaclerk'] },
  wine:      { ic:'🍷', name:'Wine making',          jobs:['cellar'] },
  equipment: { ic:'🚜', name:'Farm equipment tech',  jobs:['mech','elevator','agtech','farmhand','harvtruck'] },
  wind:      { ic:'🌬️', name:'Wind energy tech',     jobs:['windtech','lineman','damop','nukeop'] },
  business:  { ic:'📊', name:'Business',             jobs:['insure','loan','clerk','labadmin','teller','remote'] },
  teaching:  { ic:'🍎', name:'Teaching',             jobs:['para','teacher','prof'] }
};
const MAJOR_PAY = 0.10, MAJOR_ODDS = 0.08;
// i3-a03: short certificates, taken with Take classes weeks and a one-time fee (2027 dollars)
const CERTS = {
  cdl:        { ic:'🚛', name:'CDL (commercial driver\'s license)', weeks:6, fee:1800, what:'Needed to drive truck: truck driver and harvest trucking.' },
  welding:    { ic:'🔥', name:'Welding',                weeks:8, fee:1200, what:'Opens the fab shop welder job, and helps you get on at Hanford.' },
  phlebotomy: { ic:'💉', name:'Phlebotomy',             weeks:5, fee:700,  what:'Opens the hospital phlebotomist job in Walla Walla.' },
  pesticide:  { ic:'🌱', name:'Pesticide license',      weeks:4, fee:150,  what:'+6% pay on the farm, at the elevator and as an ag technician.' },
  notary:     { ic:'🖋️', name:'Notary public',          weeks:4, fee:120,  what:'+4% pay in office jobs (insurance, courthouse, bank, loans, lab office).' }
};
const CERT_PERK = { pesticide:{ jobs:['farmhand','elevator','agtech'], mult:1.06 }, notary:{ jobs:['insure','clerk','loan','teller','labadmin'], mult:1.04 } };
const CLEAR_WEEKS = 12, CLEAR_PAY = 0.8, FIBER_COST = 900, BUS_PASS = 50, UNION_DUES = 0.015;

const HOMES = {
  room:  {name:'Rented room above Main Street', cost:650,  happy:0},
  house: {name:'Rented house on a quiet street', cost:1250, happy:1.5},
  fixer: {name:'Fixer-upper by the Touchet',     cost:950,  happy:1.5, own:true, down:9000,  equityPer:260, value:160000},
  farm:  {name:'Farmhouse in the wheat hills',   cost:1650, happy:3,   own:true, down:30000, equityPer:520, value:300000}
};
const CARS = {
  beater:{name:'1998 pickup',            mpg:15, price:0,     breakdown:.12},
  sedan: {name:'Used sedan',             mpg:32, price:9000,  breakdown:.04, value:9000},
  truck: {name:'New pickup (financed)',  mpg:21, down:4000,   pay:640, months:60, breakdown:.01, value:42000}
};

const FOCUS = {
  work:     {ic:'💼', name:'Work extra hours', desc:'Overtime at time and a half: +35% pay, but it wears on you.', fx:{happy:-2.5, health:-2}, payMult:1.35, needsJob:true},
  rest:     {ic:'🛋️', name:'Rest & recharge',  desc:'Sleep in, take it easy.',         fx:{happy:4, health:4}},
  community:{ic:'🤝', name:'Show up for town', desc:'Volunteer, potlucks, ballgames.',   fx:{community:4, happy:2}, cost:50},
  study:    {ic:'📚', name:'Take classes',     desc:'Work toward the next diploma.',    fx:{happy:-2}, study:true},
  outdoors: {ic:'🎣', name:'Get outside',      desc:'Fish the Touchet, hike the Blues.', fx:{health:5, happy:3}, cost:40},
  hustle:   {ic:'🔧', name:'Side hustle',      desc:'Weekend gigs that follow the seasons, and pay more as you get good at them.',        fx:{happy:-1, health:-1}, hustle:true}
};

// i2-a12: a weekly focus rotation: up to 4 focuses that take turns, one a week
const PLAN_MAX = 4;
const planOK = k => !!FOCUS[k] && !(FOCUS[k].needsJob && (!S.jobId || S.retired)) && !(FOCUS[k].study && (typeof canStudy === 'function' ? !canStudy() : S.edu >= 3));
const planFocus = () => { const k = S.plan && S.plan.length ? S.plan[(S.planI || 0) % S.plan.length] : null; return k == null ? null : planOK(k) ? k : 'rest'; };

let S = null;                 // game state
let tab = 'home', jobCity = 'all';

/* ---------- helpers on state ---------- */
// wave 1: the Life Score's running tallies (features.js scoreWeek) and the life aim (i20-b01)
const SCORE_STATE = () => ({ commSum:0, cardSum:0, cardCount:0, cardSeed:false, goodWeeks:0, deepWeeks:0, debtLow:0, tallyFrom:0,
  aim:'all', aimWeeks:{}, aimAt:0, townWeeks:0, outWeeks:0, tripsN:0, bizWeeks:0, bizSold:false });
// i5-a01: whole years from months; 52 weeks of 12/52 add up to 11.99999..., so a tiny nudge keeps birthdays on time
const yrsOf = mo => Math.floor(mo / 12 + 1e-6);
const age = () => yrsOf(S.ageMonths);
const kidAge = b => yrsOf(S.ageMonths - b);
const kidsAtHome = () => (S.kids || []).filter(b => kidAge(b) < 18).length;
// fill in fields that older saves don't have
// H1: a fresh life's fields, used by newGame and to repair damaged saves
// i63-b22: every life gets an id, so a restored backup can tell an older copy of the same life (no Math.random: the dice stay put)
let LID_N = 0;
const newLid = () => { try { return [...crypto.getRandomValues(new Uint32Array(2))].map(n => n.toString(36)).join(''); } catch (e) { return Date.now().toString(36) + (LID_N++).toString(36); } };
function blankLife(name, len, slot = 0){
  return { v:3, slot, name, len, lid:newLid(), rewound:false, backupNudged:false, turn:0, date: new Date(2027,0,4).getTime(), ageMonths:18*12, evCd:{}, evDone:{}, last:null, ui:0,
    col:1, wage:1, kids:[], k401:0, k401rate:0, k401match:0, uiPay:null, mortgage:null, loanPay:0,   // i75-b12 unvested match, i75-b05 benefit
    money:1500, health:78, happy:60, community:30,
    edu:0, studyProg:0, jobId:null, jobMonths:0, raise:1, retired:false,
    home:'room', equity:0, car:'beater', carValue:2500, loanLeft:0,
    dog:false, partner:false, council:false,
    focus:'rest', applied:false, happySum:0, healthSum:0, monthsPlayed:0,
    log:[], over:false, cause:null, streakF:null, streakN:0, run:null, yearEvents:0,
    trip:null, svc:0, tires:null, stockUntil:-1, dentist:0, stopLast:{}, tabsYear:2027, carpool:false, hustleWeeks:0, scoreQ:null,
    bg:'fresh', mode:'normal', sloanLeft:0, sloanPay:0, sgoal:null, seasonWins:0,
    badges:{}, goals:[], chains:{}, towns:{}, storiesDone:0, scenario:null, scWon:false, paidOff:false,
    earnYears:0, earnSum:0, pensionYears:0, pensionPay:0, ltc:null, care:null, snowbird:null, scholar:null, will:false, probate:null, roomHost:false, hostLast:-99,
    skills:{}, biz:null, weekly:null, rng:null, rngEv:null, gen:1, goalAt:{}, carpoolJob:null, hustleLast:0, highWater:null, recentF:[], out:outDefault(), years:[],
    plan:[], planI:0,                              // i2-a12: a weekly focus rotation (empty = no plan)
    hireJoy:null, bgRest:null,                     // i38-a01: the week of the last hiring cheer; i37-b06: a background's community resting point
    evSeen:{}, seenOT:false,                       // i52-a10: events seen this life (no repeats in the first year); i52-a03: the overtime note
    rules:{}, tier0:'standard',                    // i19-b01/b03: knobs changed from Normal, and the record tier the life started on
    line:[], lifeId:newLifeId(), saveN:0, pendingEv:null, endPending:null,   // i73-b25 the family line; i54-a14 save stamp; i22-a01/a02
    ...SCORE_STATE(),                              // wave 1: the Life Score's running tallies and the life aim
    // jobs and school (round 3): ladder rung, months in this job, program and major, certificates, seasonal recall,
    // a pending interview, your reference, notice, sign-on bonus, union contract, strike, furlough, clearance, fiber, bus
    rung:0, tenure:0, program:null, major:null, certs:{}, certStudy:null, recall:null, interview:null, ref:null, notice:null, bonus:null,
    contractAt:-1, strike:null, furlough:null, clearAt:-1, fiber:false, bus:false, appWeeks:0, seasonGrace:null,
    ...EVENT_STATE(), ...MONEY_STATE(), ...HEALTH_STATE(), ...WX_STATE() };   // i74: sick hours, injuries, shots, Dad's care; i75: weather
}
// never from Math.random, so a seeded life's dice (and the weekly challenge) roll the same
let LIFE_IDS = 0;
const newLifeId = () => Date.now().toString(36) + (typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36) : (++LIFE_IDS).toString(36));
// H1: put back anything a damaged save is missing or has a bad value for, so rendering never throws
function repairLife(s){
  const okNum = v => typeof v === 'number' && Number.isFinite(v), isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  if (typeof s.name !== 'string' || !s.name) s.name = 'Someone';
  if (!LENGTHS[s.len]) s.len = 'two';
  if (!okNum(s.date) || isNaN(new Date(s.date))) s.date = new Date(2027,0,4).getTime() + (okNum(s.turn) ? s.turn : 0) * 7 * 864e5;
  if (!HOMES[s.home]) s.home = 'room';
  if (!CARS[s.car]) s.car = 'beater';
  if (s.jobId != null && !jobById(s.jobId)) s.jobId = null;
  if (s.mode !== undefined && !MODES[s.mode]) s.mode = 'normal';
  if (s.bg !== undefined && !BACKGROUNDS[s.bg]) s.bg = 'fresh';
  if (!FOCUS[s.focus]) s.focus = 'rest';
  if (s.scenario != null && !(typeof SCENARIOS !== 'undefined' && SCENARIOS[s.scenario])) s.scenario = null;
  if (s.biz != null && !(isObj(s.biz) && typeof BIZ !== 'undefined' && BIZ[s.biz.type])) s.biz = null;
  const b = blankLife(s.name, s.len, 0);
  for (const [k, v] of Object.entries(b)) {
    if (s[k] === undefined) continue;                                      // migrate's own defaults fill these
    if (typeof v === 'number' && !okNum(s[k])) s[k] = v;
    else if (Array.isArray(v) && !Array.isArray(s[k])) s[k] = v;
    else if (isObj(v) && !isObj(s[k])) s[k] = v;
  }
  // i57-a02 / i64-a04: every field checked before a life reaches a slot: stats in range, text short and tag-free,
  // lists capped, ids that exist. Journal lines and names are plain text (the screens escape them too).
  s.name = noTags(s.name).slice(0, 20) || 'Someone';
  for (const k of ['happy', 'health', 'community']) if (okNum(s[k])) s[k] = clamp(s[k]);
  if (okNum(s.ageMonths)) s.ageMonths = clamp(s.ageMonths, 18 * 12, 110 * 12);
  if (okNum(s.turn)) s.turn = Math.max(0, Math.floor(s.turn));
  if (okNum(s.edu)) s.edu = clamp(Math.floor(s.edu), 0, 3);
  if (okNum(s.rung)) s.rung = clamp(Math.floor(s.rung), 0, 2);
  const KINDS = ['money', 'ev', 'mile', 'trip'];
  if (Array.isArray(s.log)) s.log = s.log.filter(isObj).slice(0, 120).map(e => ({ d: noTags(e.d).slice(0, 40), m: noTags(e.m).slice(0, 600), k: KINDS.includes(e.k) ? e.k : undefined }));
  if (Array.isArray(s.kids)) s.kids = s.kids.filter(okNum).slice(0, 12);
  if (Array.isArray(s.goals)) s.goals = s.goals.filter(x => typeof x === 'string' && (typeof BADGES === 'undefined' || BADGES.some(b => b.id === x))).slice(0, 3);
  if (Array.isArray(s.plan)) s.plan = s.plan.filter(k => FOCUS[k]).slice(0, PLAN_MAX);
  if (Array.isArray(s.evPins)) s.evPins = s.evPins.filter(isObj).slice(0, 12).map(p => ({ ...p, t: noTags(p.t).slice(0, 80), r: noTags(p.r).slice(0, 400), ic: noTags(p.ic).slice(0, 8) }));
  if (Array.isArray(s.years)) s.years = s.years.filter(isObj).slice(-120).map(y => ({ ...y, m: Array.isArray(y.m) ? y.m.slice(0, 3).map(t => noTags(t).slice(0, 600)) : [] }));
  if (Array.isArray(s.line)) s.line = s.line.filter(isObj).slice(-40).map(p => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, typeof v === 'string' ? noTags(v).slice(0, 200) : okNum(v) ? v : null])));
  if (isObj(s.certs)) s.certs = Object.fromEntries(Object.keys(s.certs).filter(k => CERTS[k]).map(k => [k, 1]));
  if (s.program != null && !PROGRAMS[s.program]) s.program = null;
  if (s.major != null && !PROGRAMS[s.major]) s.major = null;
  if (s.recall != null && !(isObj(s.recall) && jobById(s.recall.job))) s.recall = null;
  if (s.copyNote != null) s.copyNote = noTags(s.copyNote).slice(0, 40);
  if (isObj(s.probate) && s.probate.from != null) s.probate.from = noTags(s.probate.from).slice(0, 20);
  for (const k of ['pendingEv', 'evLabel']) if (s[k] != null) s[k] = noTags(s[k]).slice(0, 80);
  if (s.endPending != null && !(isObj(s.endPending) && typeof s.endPending.r === 'string')) s.endPending = null;
  if (s.endPending) s.endPending = { r: noTags(s.endPending.r).slice(0, 200), debt: !!s.endPending.debt, death: !!s.endPending.death };
  return s;
}
const noTags = v => String(v == null ? '' : v).replace(/<[^>]*>?/g, '');
function migrate(s){
  repairLife(s);
  const d = { slot:0, evPins:[], streakF:null, streakN:0, run:null, yearEvents:0, yearStart:null, evCd:{}, evDone:{}, evSeen:{}, seenOT:true, ui:0, col:1, wage:1, kids:[], k401:0, k401rate:0, k401match:0, uiPay:null, mortgage:null, loanPay:0 };   // i75: an older 401(k) counts as vested; old benefits pay the floor
  for (const k in d) if (s[k] === undefined) s[k] = d[k];
  s.rules = cleanRules(s.rules); if (!TIERS[s.tier0]) s.tier0 = recordTier(s.rules);   // i19-b01: unknown knobs fall back to Normal
  if (typeof s.lid !== 'string' || !s.lid) s.lid = newLid();          // i63-b22
  if (s.rewound === undefined) s.rewound = false;
  if (s.backupNudged === undefined) s.backupNudged = false;          // i63-b08
  // Around the region (0.3.0): older lives count as just serviced and checked, with this year's tabs paid
  if (s.tenure === undefined) s.tenure = s.jobMonths || 0;          // i3-a01: older lives count the months since the last raise
  if (s.certs === undefined) {                                       // lives from before certificates and seasons (0.2.0)
    s.certs = s.jobId === 'trucker' ? { cdl:1 } : {};                // i3-a03: a working trucker already holds a CDL
    const jb = s.jobId ? JOBS.find(j => j.id === s.jobId) : null;      // i3-a06: no surprise layoff on load; the season runs its course first
    s.seasonGrace = jb && jb.season && !s.retired && !jb.season.includes(new Date(s.date || Date.now()).getMonth()) ? jb.id : null;
  }
  // i69-a07: 0.2.0 truckers already had certs ({}) but no CDL, so their own job was locked: anyone driving truck (or
  // waiting on a recall to it) holds one
  if (['trucker', 'harvtruck'].some(id => s.jobId === id || (s.recall && s.recall.job === id))) s.certs = { ...(s.certs || {}), cdl:1 };
  // i69-a06: a homeowner's save from before property tax, opened in April or October, starts with this half's bill paid
  if (s.ptaxDone === undefined && HOMES[s.home] && HOMES[s.home].own) { const d = new Date(s.date); if ([3, 9].includes(d.getMonth())) s.ptaxDone = `${d.getFullYear()}-${d.getMonth()}`; }
  if (!s.lifeId) s.lifeId = `old-${s.savedAt || 0}-${(s.name || '').length}`;   // i54-a14: two windows opening the same old save agree on its id
  if (s.goals && !s.goalAt) s.goalAt = Object.fromEntries(s.goals.map(id => [id, 0]));
  const r = { goalAt:{}, skills:{}, biz:null, weekly:null, rng:null, rngEv:null, carpoolJob:s.jobId ?? null, hustleLast:s.turn || 0, highWater:null, recentF:[], gen:1, badges:{}, goals:[], chains:{}, towns:{}, storiesDone:0, scenario:null, scWon:false, paidOff:false, bg:'fresh', mode:'normal', sloanLeft:0, sloanPay:0, sgoal:null, seasonWins:0, carpool:false, hustleWeeks:0, scoreQ:null, trip:null, svc:s.turn || 0, tires:null, stockUntil:-1, dentist:s.turn || 0, stopLast:{}, out:null, tabsYear:new Date(s.date || Date.now()).getFullYear() };
  for (const k in r) if (s[k] === undefined) s[k] = r[k];
  // wave 1 score: an older life's averages and rates start from what it has now; earlier report cards are filled in at the next one
  const t0 = s.turn || 0, sc = { ...SCORE_STATE(), commSum:(s.community || 0) * (s.monthsPlayed || 0), tallyFrom:t0, debtLow:Math.min(0, (s.money || 0) / (s.col || 1)),
    aimWeeks:{ all:t0 }, aimAt:-52, cardSeed:t0 >= 13 };
  for (const k in sc) if (s[k] === undefined) s[k] = sc[k];
  for (const [k, v] of Object.entries(EVENT_STATE())) if (s[k] === undefined) s[k] = v;
  for (const [k, v] of Object.entries(WX_STATE())) if (s[k] === undefined) s[k] = v;   // i75: weather (rolled on the next tick)
  // i3-a24/a25: lives from before work history count about three of every four adult years as worked, at their current job's pay
  if (s.earnYears === undefined) { const yrs = Math.max(0, (s.ageMonths || 216) / 12 - 18) * 0.75, jb = s.jobId ? JOBS.find(j => j.id === s.jobId) : null;
    s.earnYears = yrs; s.earnSum = yrs * (jb ? jb.pay : 3000); }
  if (s.pensionYears === undefined) { const jb = s.jobId ? JOBS.find(j => j.id === s.jobId) : null; s.pensionYears = jb && jb.pension && !s.retired ? (s.jobMonths || 0) / 12 : 0; s.pensionPay = jb && jb.pension ? jb.pay : 0; }
  if (s.will === undefined) s.will = !!(s.out && s.out.will);
  if (!s.out || typeof s.out !== 'object') s.out = outDefault();   // Out and about (#50)
  healthMigrate(s);                                                 // i74: health, body and aging (no sick hours banked, no dental or ambulance plan)
  if (HOMES[s.home] && HOMES[s.home].own && !s.mortgage) s.mortgage = HOMES[s.home].cost;
  // weekly-challenge lives from before separate event dice get their own event dice (R8)
  if (s.rng != null && s.rngEv == null && s.weekly) s.rngEv = weekSeed(`${s.weekly}:events`);
  // businesses from before depreciation and lease renewals (R13): full value, and a wheat lease gets at least a season's notice
  if (s.biz) { if (s.biz.dep == null) s.biz.dep = 1; if (s.biz.type === 'wheat' && s.biz.lease == null) s.biz.lease = Math.max(LEASE_WEEKS, (s.biz.weeks || 0) + 13); }
  // i2-a29: a save from before the life story gets its past years from the Journal; if the Journal had already
  // dropped its oldest entries, the story says the earlier years came before this update
  if (s.years === undefined) {
    const y0 = new Date(s.date).getFullYear(), lg = Array.isArray(s.log) ? s.log : [], by = {}, yr = e => parseInt(String(e.d || '').slice(-4), 10);
    const worthy = typeof storyWorthy === 'function' ? storyWorthy : () => true;
    for (const e of lg.slice().reverse()) { const y = yr(e); if (y && y < y0 && worthy(e)) (by[y] = by[y] || []).push(e.m); }
    s.years = Object.keys(by).map(Number).sort((a, b) => a - b).map(y => ({ year: y, age: Math.floor((s.ageMonths || 216) / 12) - (y0 - y), m: by[y].slice(0, 3) }));
    const oldest = lg.length ? yr(lg[lg.length - 1]) : y0;
    s.storyEarly = lg.length >= 120 || (s.turn > 0 && !lg.length) ? (oldest || y0) : null;
  }
  for (const [k, v] of Object.entries(blankLife(s.name, s.len, s.slot))) if (s[k] === undefined) s[k] = v;   // H1: half a life gets the rest of a fresh one
  return s;
}
const job = () => S.jobId ? jobById(S.jobId) : null;
const commuteOneWay = () => (job() && !S.retired) ? CITIES[job().city].miles : 0;
// #70: remote days (office jobs drive in 3 days a week) and carpools (half the gas, less wear) make long commutes livable
const driveDays = (j = job()) => j && j.remote ? (5 - j.remote) / 5 : 1;
const canCarpool = () => commuteOneWay() >= 20 && S.community >= 30;
const carpooling = () => !!S.carpool && commuteOneWay() >= 20;
// a carpool belongs to the job you joined it for: a new job (or none) starts out driving alone (R12)
function syncCarpool(){ if (S && S.carpool && S.carpoolJob !== S.jobId) { S.carpool = false; S.carpoolJob = null; return true; } return false; }
// i3-a14: the county bus runs to Dayton and Walla Walla
const busOK = (j = job()) => !!j && ['dayton', 'wallawalla'].includes(j.city);
const onBus = () => !!(S && S.bus) && busOK() && !S.retired;
const commuteGasFactor = (j = job()) => S && S.bus && j && S.jobId === j.id && busOK(j) ? 0.1 : driveDays(j) * (S && S.carpool && j && CITIES[j.city].miles >= 20 ? 0.5 : 1);
const netWorth = () => {
  const loan = S.loanLeft > 0 ? S.loanLeft * (S.loanPay || CARS.truck.pay) * 0.85 : 0;
  const sloan = S.sloanLeft > 0 ? S.sloanLeft * S.sloanPay * 0.85 : 0;
  // round 3: index funds at market value, wine futures at what you paid, minus what's left on a home equity loan
  return S.money + S.equity + S.carValue + (S.k401 || 0) * K401_AFTER_TAX + (S.biz ? bizValue() : 0) - loan - sloan
    + (S.stocks || 0) + wineAtCost() - heBalance();
};
const curMonth = () => new Date(S.date).getMonth();
const dateLabel = () => { const d = new Date(S.date); return `Week of ${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`; };
const turnWord = () => 'Week';
function adj(o){
  if (o.money) S.money += o.money;
  ['happy','health','community'].forEach(k => { if (o[k]) S[k] = clamp(S[k] + o[k]); });
  if (o.health > 0) S.health = Math.min(S.health, Math.max(maxHealth(), S.health - o.health));   // i30-b03: gains stop at the age cap
}
// i30-b03: health's ceiling comes down with age: 100 until 55, about 75 at 85, 60 past 100
const maxHealth = (a = age()) => clamp(100 - Math.max(0, a - 55) * 25 / 30, 60, 100);
// i35-b05/i37-b06: where happiness and community drift back to, and where Rest and Get outside top out
const happyRest = () => mode() === 'hard' ? 48 : 52;
const commRest = () => { const base = mode() === 'hard' ? 20 : 25; return S.bgRest != null && S.turn < BG_REST_WEEKS ? Math.min(base, S.bgRest) : base; };
const restTop = () => mode() === 'hard' ? 76 : 86;
const BG_REST_WEEKS = 52, HIRE_JOY_WEEKS = 26;
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
// i5-a03: big results (hired, a partner, a dog, a baby, a house, the council, a kid moving out) carry mile:1, so the year in
// review and the Journal's Milestones chip show them even when they're an event's result
function log(msg, k, mile){ S.log.unshift({d: dateLabel(), m: msg, k: k || logKind(msg), ...(mile ? { mile:1 } : {})}); if (S.log.length > 120) S.log.length = 120; }
const isMile = e => !!e && (!!e.mile || (e.k || logKind(e.m)) === 'mile');
// the year in review's milestones: big moments first when there are too many, kept in the order they happened
function reviewMilestones(y, n = 8){
  const yl = S.log.filter(e => e && String(e.d).endsWith(String(y))).reverse(), pick = yl.filter(e => e.mile || !String(e.m).includes(': '));
  const keep = new Set([...pick.filter(e => e.mile), ...pick.filter(e => !e.mile)].slice(0, n));
  return pick.filter(e => keep.has(e)).map(e => e.m);
}
/* ---------- save slots: up to 5 lives, each auto-saving to its own slot ---------- */
// i43-b01: each life has its own key (slot.0 … slot.4), so a save writes one life instead of all five. SLOTS_KEY is the
// old all-in-one key: if it's there (an older version wrote it) its lives move into the slot keys, and it's removed
// only once every slot was written.
const SLOTS_KEY = KEY_PREFIX + 'slots.v1', SLOT_COUNT = 5;
const WEEKLY_SLOT = 'weekly';                                    // i73-b11: the weekly challenge's own place, not one of the 5
const slotKey = i => KEY_PREFIX + (i === WEEKLY_SLOT ? 'weekly.v1' : 'slot.' + i);
const slotName = i => i === WEEKLY_SLOT ? 'the weekly challenge' : `slot ${i + 1}`;
const BROKEN_KEY = KEY_PREFIX + 'slots.broken';                 // i57-a15: a save that won't read is kept aside, never overwritten
const rawGet = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
function keepBroken(k, raw){
  const b = store.get(BROKEN_KEY), o = b && typeof b === 'object' && !Array.isArray(b) ? b : {};
  if (o[k] === raw) return;
  o[k] = raw; o.at = Date.now(); store.set(BROKEN_KEY, o);
}
const hasBroken = () => { const b = store.get(BROKEN_KEY); return !!b && typeof b === 'object' && Object.keys(b).some(k => k !== 'at'); };
// one slot's life, or null; text there that isn't a life is copied to BROKEN_KEY first
function readLife(k){
  const raw = rawGet(k); if (raw == null) return null;
  let g; try { g = JSON.parse(raw); } catch(e){ g = undefined; }
  if (g === null) return null;
  if (!isLife(g)) { keepBroken(k, raw); return null; }
  return g;
}
// moves the old all-in-one key into the slot keys; returns its lives when that couldn't finish (storage full)
function importLegacy(){
  const raw = rawGet(SLOTS_KEY); if (raw == null) return null;
  let a; try { a = JSON.parse(raw); } catch(e){ a = undefined; }
  if (!Array.isArray(a)) { if (a !== null) keepBroken(SLOTS_KEY, raw); store.del(SLOTS_KEY); return null; }
  const lives = Array.from({ length: SLOT_COUNT }, (_, i) => isLife(a[i]) ? a[i] : null);
  a.slice(0, SLOT_COUNT).forEach((g, i) => { if (g != null && !isLife(g)) keepBroken(`${SLOTS_KEY}#${i}`, JSON.stringify(g)); });
  let ok = true;
  lives.forEach((g, i) => { if (g) ok = store.set(slotKey(i), g) && ok; else store.del(slotKey(i)); });
  if (!ok) return lives;
  store.del(SLOTS_KEY); return null;
}
function slots(){
  const legacy = importLegacy();
  const out = legacy || Array.from({ length: SLOT_COUNT }, (_, i) => readLife(slotKey(i)));   // H1: damaged slots read as empty
  const old = store.get(SAVE_KEY);                 // the single save from before slots: move it into a free slot
  if (isLife(old) && !old.over) {
    const i = out.indexOf(null);
    if (i >= 0) { old.slot = i; out[i] = old; if (store.set(slotKey(i), old)) store.del(SAVE_KEY); }
  } else if (old) store.del(SAVE_KEY);
  return out;
}
const readSlot = i => i === WEEKLY_SLOT ? readLife(slotKey(i)) : slots()[i] || null;
const isLife = g => !!g && typeof g === 'object' && !Array.isArray(g) && typeof g.name === 'string';
// writes one life (null deletes it); false when the write failed
function writeSlot(i, game){
  if (i !== WEEKLY_SLOT && rawGet(SLOTS_KEY) != null) importLegacy();
  if (!game) { store.del(slotKey(i)); return true; }
  return store.set(slotKey(i), game);
}
// all five at once (restoring a backup); true only if every life landed
function writeSlots(a){ let ok = true; for (let i = 0; i < SLOT_COUNT; i++) ok = writeSlot(i, a[i] || null) && ok; return ok; }
// i54-a14: two windows on one life. Each save counts up S.saveN, so a window that loaded an older week sees that
// another window saved since, and picks up that week instead of writing over it
function newerOnDisk(i = S && S.slot){
  if (!S || i == null || !S.lifeId) return null;
  const raw = rawGet(slotKey(i)); if (!raw) return null;
  const id = /"lifeId":"([^"]*)"/.exec(raw), n = /"saveN":(\d+)/.exec(raw);
  if (!id || id[1] !== S.lifeId || !n || +n[1] <= (S.saveN || 0)) return null;
  try { const g = JSON.parse(raw); return isLife(g) ? g : null; } catch(e){ return null; }
}
function adoptNewer(g){
  if (typeof ROLL !== 'undefined' && ROLL) { clearTimeout(ROLL.t); ROLL = null; }
  const i = S.slot; S = migrate(g); S.slot = i; useDice();
  closeSheet(); render();
  toast('This life was played in another window: picked up its latest week.');
  resumePending();
}
let SAVE_FAILED = false;
function save(){
  if (!S || S.over || S.practice) return true;
  const i = S.slot ?? 0, newer = newerOnDisk(i);
  if (newer) { adoptNewer(newer); return false; }
  const prev = [S.savedAt, S.saveN];
  S.savedAt = Date.now(); S.saveN = (S.saveN || 0) + 1;
  if (writeSlot(i, S)) { SAVE_FAILED = false; return true; }
  [S.savedAt, S.saveN] = prev;
  if (!SAVE_FAILED) {                             // i60-a10: one warning, then quiet until a save works again
    SAVE_FAILED = true; const m = "Your phone's storage is full: this week wasn't saved";
    toast(m); if (typeof announce === 'function') announce(m);
  }
  return false;
}
/* ---------- i73-b01: a finished life leaves a small stub, so it outlasts "Play again" ---------- */
const ENDS_KEY = KEY_PREFIX + 'ends.v1', ENDS_MAX = 100;
const ends = () => { const a = store.get(ENDS_KEY); return Array.isArray(a) ? a.filter(e => e && typeof e === 'object' && typeof e.name === 'string' && Number.isFinite(e.score)) : []; };
// newest first; past ENDS_MAX the oldest go, but never the ten best
function keepEnds(list){
  const top = new Set(list.slice().sort((a, b) => b.score - a.score).slice(0, 10)), out = list.slice();
  for (let i = out.length - 1; out.length > ENDS_MAX && i >= 0; i--) if (!top.has(out[i])) out.splice(i, 1);
  return out;
}
const addEnd = stub => store.set(ENDS_KEY, keepEnds([stub, ...ends()]));
/* ---------- i60-a13: a grandkid waits on the title screen until started or dismissed ---------- */
const HEIR_KEY = KEY_PREFIX + 'heirs.v1';
const heirs = () => { const a = store.get(HEIR_KEY); return Array.isArray(a) ? a.filter(p => p && typeof p === 'object' && typeof p.name === 'string') : []; };
const setHeirs = a => store.set(HEIR_KEY, a.slice(0, 10));
const clone = o => JSON.parse(JSON.stringify(o));
function savedAgo(t){
  if (!t) return '';
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? 'saved just now' : m < 60 ? `saved ${m} min ago` : m < 1440 ? `saved ${Math.round(m/60)} h ago` : `saved ${new Date(t).toLocaleDateString()}`;
}
function slotLine(g){
  const d = new Date(g.date), ok = Number.isFinite(g.date) && !isNaN(d);   // H1: a damaged life shows what it can
  return [LENGTHS[g.len] ? LENGTHS[g.len].label : '', Number.isFinite(g.ageMonths) ? `age ${Math.floor(g.ageMonths/12)}` : '',
    ok ? `${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}` : '', Number.isFinite(g.money) ? fmt(g.money) : ''].filter(Boolean).join(' · ');
}
function slotCard(g, i, buttons){
  return g ? `<div class="slot"><div class="slotinfo"><b>${esc(g.name)}</b>${g.copyNote ? ` <span class="tag">${esc(g.copyNote)}</span>` : ''}
      <div class="s">${slotLine(g)}</div><div class="s">Slot ${i+1} · ${savedAgo(g.savedAt)}</div></div>${buttons}</div>`
    : `<div class="slot empty"><div class="slotinfo"><b>Empty slot</b><div class="s">Slot ${i+1}</div></div>${buttons}</div>`;
}
/* ---------- device-wide settings (i2-a03): kept apart from saved lives, the same in every slot ---------- */
const PREF_KEY = KEY_PREFIX + 'prefs';
const prefs = () => store.get(PREF_KEY) || {};
const setPref = (k, v) => { const p = prefs(); p[k] = v; store.set(PREF_KEY, p); };
// the comfort settings and their defaults; none of them touches the game's numbers
const SETTINGS = {
  theme:    { def:'auto',   opts:[['auto','📱 Match phone'], ['day','☀️ Day'], ['night','🌙 Night']] },
  textSize: { def:'normal', opts:[['normal','Normal'], ['l','Large'], ['xl','Larger']] },
  sound:    { def:'off',    opts:[['off','🔇 Off'], ['soft','🔈 Soft'], ['normal','🔊 Normal']] },
  vibrate:  { def:'on',     opts:[['on','On'], ['off','Off']] },
  swipe:    { def:'on',     opts:[['on','On'], ['off','Off']] },
  motion:   { def:'on',     opts:[['on','On'], ['off','Off']] },    // i2-a08/a10: moving bars, counting cash and confetti
  srWeek:   { def:'short',  opts:[['short','Short'], ['full','Full']] }   // i7-a02: what a screen reader hears after End Week
};
// fewer moving parts when the device asks for reduced motion, or Settings → Animations is off
const calmMotion = () => setting('motion') === 'off' || !!(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
const setting = k => { const v = prefs()[k]; return SETTINGS[k].opts.some(o => o[0] === v) ? v : SETTINGS[k].def; };
const darkQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
const isNight = () => setting('theme') === 'night' || (setting('theme') === 'auto' && !!(darkQuery && darkQuery.matches));
// i2-a06 / i2-a07: text size and theme are classes on <html>
function applyPrefs(){
  const h = document.documentElement, ts = setting('textSize');
  h.classList.toggle('ts-l', ts === 'l'); h.classList.toggle('ts-xl', ts === 'xl');
  h.classList.toggle('night', isNight());
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = isNight() ? '#5a170e' : '#9b2f1f';
  const cs = document.querySelector('meta[name=color-scheme]'); if (cs) cs.content = isNight() ? 'dark' : 'only light';   // i59-a19: phones don't auto-darken the day theme
}
if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', applyPrefs);
// sounds and buzzes wait for the player's first tap or key, so the browser allows them (and the sim stays silent)
let TAPPED = false;
if (typeof document !== 'undefined') ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => { TAPPED = true; }, { capture: true, passive: true }));
// i2-a04: a short buzz on phones that support it (iPhones ignore it quietly)
const BUZZ = { week:8, event:[25, 40, 25], badge:[30, 50, 30, 50, 70] };
function buzz(kind){
  if (setting('vibrate') === 'off' || !TAPPED || !BUZZ[kind]) return;
  buzz.last = kind;
  try { if (navigator.vibrate) navigator.vibrate(BUZZ[kind]); } catch(e){}
}
// i2-a05: small sounds made in code (nothing to download, so they work offline). Off unless turned on in Settings.
// each note: [frequency Hz, start s, length s, wave]
const SFX = {
  tap:   [[880, 0, .05, 'sine']],
  week:  [[587, 0, .07, 'sine'], [784, .06, .09, 'sine']],
  event: [[659, 0, .14], [880, .11, .22]],
  good:  [[523, 0, .1], [659, .08, .1], [784, .16, .18]],
  bad:   [[392, 0, .14], [311, .12, .24]],
  badge: [[523, 0, .09], [659, .08, .09], [784, .16, .09], [1047, .24, .3]]
};
const SFX_VOL = { off:0, soft:.08, normal:.22 };
let AUDIO = null;
function sfx(name){
  const vol = SFX_VOL[setting('sound')];
  if (!vol || !TAPPED || sfx.mute || !SFX[name]) return;
  sfx.last = name;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
    AUDIO = AUDIO || new Ctx(); if (AUDIO.state === 'suspended') AUDIO.resume();
    const t0 = AUDIO.currentTime + .01;
    for (const [f, at, len, wave = 'triangle'] of SFX[name]) {
      const o = AUDIO.createOscillator(), g = AUDIO.createGain();
      o.type = wave; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t0 + at); g.gain.exponentialRampToValueAtTime(vol, t0 + at + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + at + len);
      o.connect(g); g.connect(AUDIO.destination); o.start(t0 + at); o.stop(t0 + at + len + .03);
    }
  } catch(e){}
}
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2200); }

/* ============================================================
   🎬 HOW A LIFE BEGINS (#69) and 🎚️ MODES (#73)
   ============================================================ */
const BACKGROUNDS = {
  fresh:      { ic:'🌾', name:'Fresh start', hint:'Standard', desc:'18, a rented room above Main Street, $1,500 and the 1998 pickup. The classic start.' },
  farm:       { ic:'🚜', name:'Farm kid', hint:'Standard', desc:'Raised in the wheat hills. You start working on the family farm and everybody knows you, but you have only $300.',
    set:s => { s.money = 300; s.community = 42; s.health = 84; s.jobId = 'farmhand'; } },
  grad:       { ic:'🎓', name:'Grad coming home', hint:'Head start, with debt', desc:'21, back from college with a trade certificate, 20 weeks of classes short of an associate degree, and $36,000 in student loans (about $380 a month for 10 years).',
    set:s => { s.ageMonths = 21*12; s.edu = 1; s.studyProg = 20; s.money = 500; s.community = 20; s.happy = 56; s.sloanLeft = 120; s.sloanPay = 380; } },
  transplant: { ic:'🏙️', name:'Seattle transplant', hint:'Money, but lonely', desc:'Moved over the mountains with $6,000 saved and a used sedan. Nobody in town knows you yet, and you miss the city.',
    set:s => { s.money = 6000; s.community = 5; s.happy = 50; s.car = 'sedan'; s.carValue = 9000; s.ageMonths = 24*12; s.bgRest = 10; } },   // i37-b06: lonely for the first year
  parent:     { ic:'👶', name:'Young parent', hint:'Tight money, full heart', desc:'20, with a two-year-old. Money is tight and every week counts, but the town looks out for you.',
    set:s => { s.ageMonths = 20*12; s.kids = [s.ageMonths - 24]; s.money = 800; s.community = 36; s.happy = 64; } }
};
const MODES = {
  relaxed: { ic:'🌤️', name:'Relaxed', desc:'Stats wear down slower, debt grows slower and never ends your game. For playing at your own pace.' },
  normal:  { ic:'⚖️', name:'Normal', desc:'The game as designed.' },
  hard:    { ic:'🔥', name:'Hard', desc:'Stats wear down faster and settle lower, more events, layoffs more likely, rent, food and insurance cost 10% more, and debt ends the game at -$25,000.' }
};
const mode = () => (S && S.mode) || 'normal';
// i60-a12: where debt ends a life in this mode (null: Relaxed, where a debt counselor stops it at RELAXED_FLOOR), and where Home warns
const DEBT_LIMIT = { hard:-25000, normal:-40000, relaxed:null }, DEBT_WARN = { hard:-10000, normal:-15000, relaxed:-15000 }, RELAXED_FLOOR = -40000;
const debtLimit = (m = mode(), r = S && S.rules) => { const own = rule('debtEnd', r); return own != null ? own : DEBT_LIMIT[m] === undefined ? DEBT_LIMIT.normal : DEBT_LIMIT[m]; };   // i19-b01: the debt rule wins
const debtWarnAt = (m = mode(), r = S && S.rules) => { const w = DEBT_WARN[m] ?? DEBT_WARN.normal, own = rule('debtEnd', r); return own != null && own > w ? Math.round(own / 2) : w; };

/* ============================================================
   🎛️ CUSTOM RULES (i19-b01..b05): one rules object every system reads. S.rules holds only the knobs a player
   changed ({ knob: option }); anything missing or unknown falls back to Normal, so old saves play as before.
   Each option's tier says where a life with it is recorded: standard (the normal records), custom (its own
   shelf) or sandbox (never recorded). Assists can be turned off mid-life but never on (i19-b19).
   ============================================================ */
const RULES = {
  start:   { grp:'Money', name:'Starting money', def:'std', opts:{
    broke: { name:'Broke', tier:'custom', startSet:0, startAdd:0 },
    std:   { name:'Standard', startSet:null, startAdd:0 },
    comfy: { name:'Comfortable', tier:'custom', startSet:null, startAdd:5000 } } },
  prices:  { grp:'Money', name:'Prices and pay', def:'usual', opts:{
    frozen: { name:'Frozen', tier:'custom', col:0, wage:0 },
    usual:  { name:'Usual', col:COL_RATE, wage:WAGE_RATE },
    fast:   { name:'1970s', tier:'custom', col:0.07, wage:0.055 } } },
  debt:    { grp:'Money', name:'Debt that ends the game', def:'mode', opts:{
    tight: { name:'Sooner', tier:'custom', debtEnd:-15000 },
    mode:  { name:'Mode\'s line', debtEnd:null },
    deep:  { name:'Later', tier:'custom', debtEnd:-80000 } } },
  events:  { grp:'Events', name:'How often things happen', def:'usual', opts:{
    calm:  { name:'Quieter', tier:'custom', evMult:0.5 },
    usual: { name:'Usual', evMult:1 },
    busy:  { name:'Busier', tier:'custom', evMult:1.5 },
    none:  { name:'Nothing', tier:'sandbox', evMult:0 } } },
  routine: { grp:'Assists', name:'Handle the routine stuff for me', def:'off', assist:true, opts:{   // i19-b15: counts normally
    off: { name:'Off', routine:false },
    on:  { name:'On', routine:true } } }
};
const RULE_GROUPS = ['Money', 'Events', 'Assists'];
const TIERS = {
  standard: { ic:'🏆', name:'Standard', shelf:'the normal records', desc:'Your score goes on the normal records, next to every other life.' },
  custom:   { ic:'🎛️', name:'Custom', shelf:'the Custom shelf', desc:'Your score goes on its own Custom shelf, apart from the normal records.' },
  sandbox:  { ic:'🧪', name:'Sandbox', shelf:'nowhere (sandbox)', desc:'Play however you like: a sandbox life is never recorded.' }
};
const TIER_ORDER = ['standard', 'custom', 'sandbox'];
const ruleOpt = (id, r = S && S.rules) => r && RULES[id] && Object.prototype.hasOwnProperty.call(RULES[id].opts, r[id]) ? r[id] : RULES[id].def;
// the value of one rule setting (col, wage, debtEnd, evMult, startSet, startAdd, routine) for these rules
function rule(k, r = S && S.rules){
  for (const id in RULES) { const o = RULES[id].opts[ruleOpt(id, r)]; if (k in o) return o[k]; }
  return undefined;
}
// keep only known knobs set away from Normal (a clean copy for saving)
const cleanRules = r => { const out = {}; if (r && typeof r === 'object') for (const id in RULES) if (ruleOpt(id, r) !== RULES[id].def) out[id] = r[id]; return out; };
const tierMax = (a, b) => TIER_ORDER[Math.max(TIER_ORDER.indexOf(a), TIER_ORDER.indexOf(b), 0)];
// i19-b03: where a life with these rules is recorded
const recordTier = (r = S && S.rules) => Object.keys(RULES).reduce((t, id) => tierMax(t, RULES[id].opts[ruleOpt(id, r)].tier || 'standard'), 'standard');
// i19-b19: a life keeps the tier it started with, so turning an assist off never moves it to a better shelf
const lifeTier = (s = S) => tierMax(s && s.tier0 || 'standard', recordTier(s && s.rules));
// the money a background starts with, before the money rule
const bgMoney = bg => { const s = { money:1500, kids:[], ageMonths:216 }; if (BACKGROUNDS[bg] && BACKGROUNDS[bg].set) BACKGROUNDS[bg].set(s); return s.money; };
// i19-b04: an option's value in plain words; ctx = { bg, mode } of the life being set up (or played)
function ruleValue(id, opt, ctx = {}){
  const o = RULES[id].opts[opt], r = { [id]: opt };
  if (id === 'start') { const base = bgMoney(ctx.bg || 'fresh'); return fmt(o.startSet != null ? o.startSet : base + o.startAdd); }
  if (id === 'prices') return `${o.name} (${o.col ? `prices +${Math.round(o.col * 100)}% a year` : 'prices never change'})`;
  if (id === 'debt') { const d = debtLimit(ctx.mode || 'normal', r); return d == null ? 'never (a counselor steps in)' : `below ${fmt(d)}`; }
  return o.name;
}
const ruleLabel = (id, opt, ctx) => { const R = RULES[id], v = ruleValue(id, opt, ctx); return opt === R.def ? `${R.name}: ${v} (Normal)` : `${R.name}: ${v} · Normal is ${ruleValue(id, R.def, ctx)}`; };
// i19-b05: what an option means for a week, in dollars and plain words
function rulePreview(id, opt, ctx = {}){
  const o = RULES[id].opts[opt], rent = HOMES.room.cost * W;
  if (id === 'start') { const m = o.startSet != null ? o.startSet : bgMoney(ctx.bg || 'fresh') + o.startAdd;
    return m <= 0 ? 'Nothing in the bank: the first rent check comes out of your first paycheck.' : `That pays about ${Math.floor(m / rent)} weeks of rent for a room (${fmt(rent)} a week).${o.startAdd ? ` The extra ${fmt(o.startAdd)} doesn't count toward your score.` : ''}`; }
  if (id === 'prices') { const ten = v => fmt(v * Math.pow(1 + o.col, 10)), pay = 600 * Math.pow(1 + o.wage, 10);
    return `A room's rent is ${fmt(rent)} a week now and about ${ten(rent)} in 10 years. A ${fmt(600)}-a-week paycheck becomes about ${fmt(pay)}.`; }
  if (id === 'debt') { const d = debtLimit(ctx.mode || 'normal', { debt: opt });
    return d == null ? 'Debt never ends the game in Relaxed: a counselor stops it.' : `You'd have to fall about ${Math.round(-d / rent)} weeks of rent behind before you leave town.`; }
  if (id === 'events') { const n = Math.round(52 * (EVENT_ODDS.town + EVENT_ODDS.work) * o.evMult);
    return n ? `About ${n} surprises a year with a job in town (good and bad).` : 'No surprises at all: no flat tires, no windfalls. Never recorded.'; }
  if (id === 'routine') return o.routine ? 'Flat tires, fog on the highway, mice in the walls: the game picks what a careful player would and lists it under "Taken care of". Counts normally.'
    : 'You answer every event yourself, as usual.';
  return '';
}
const rulesSummary = r => { const ch = Object.keys(cleanRules(r)); return ch.length ? ch.map(id => `${RULES[id].name}: ${RULES[id].opts[r[id]].name}`).join(' · ') : 'Normal rules'; };
// i22-a19: how far through a Lifetime you are (age 18 to 65): the header bar and the score's on-track target share it
const lifeProgress = () => clamp((S.ageMonths / 12 - 18) / (65 - 18), 0, 1);
const bestKey = (len, m) => m && m !== 'normal' ? `${len}-${m}` : len;
const bestLabel = k => { if (k.startsWith('cu-')) { const b = bestLabel(k.slice(3)); return b ? `🎛️ ${b} · Custom rules` : null; } if (k.startsWith('wk-'))return `📅 ${k.slice(3)}`; if (k.startsWith('sc-')) { const sc = SCENARIOS[k.slice(3)]; return sc ? `${sc.ic} ${sc.name}` : null; } const [len, m] = k.split('-'); return LENGTHS[len] ? `${LENGTHS[len].label}${m && MODES[m] ? ` (${MODES[m].name})` : ''}` : null; };

/* ============================================================
   🌸 SEASON GOALS IN TOWN (#77): one town goal a season, worked toward with your weekly focus
   ============================================================ */
const fmtc = n => fmt(cost(n));       // a price that rises with the cost of living, for event labels
const SEASON_GOALS = [
  { key:'spring', ic:'🌸', name:'Get Celebration Days ready', months:[2,3,4], focus:['community'], need:9, fx:{community:6, happy:3},
    what:'Show up for town', done:'Celebration Days went off without a hitch, and people know you helped.' },
  { key:'summer', ic:'🌾', name:'Bring in the harvest', months:[5,6,7], focus:['work','hustle','community'], need:8, fx:{community:5, happy:2},
    what:'Work extra, Side hustle or Show up for town', done:'The wheat is in. The whole valley breathes out, and you were part of it.' },
  { key:'fall', ic:'🍂', name:'Stock the food bank before winter', months:[8,9,10], focus:['community'], need:8, fx:{community:6, happy:3},
    what:'Show up for town', done:'The food bank shelves are full going into winter.' },
  { key:'winter', ic:'❄️', name:'Holiday food drive and shoveling for neighbors', months:[11,0,1], focus:['community','outdoors'], need:7, fx:{community:5, happy:4},
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
