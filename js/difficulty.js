// The Burg: difficulty.js (loads right after state.js; scripts share one global scope)
/* ============================================================
   🎚️ DIFFICULTY (to-do list 2, D1 + D4): Easy, Normal and Hard stack. Easy is the core game, Normal adds more,
   and Hard is the full game. Each feature and each event has a tier; it is on when its tier is at or below the
   life's difficulty (S.diff). A save from before difficulties loads as Hard and is labeled Classic, so it plays
   exactly as before. The old mode numbers ride along: Easy uses Relaxed's, Normal Normal's and Hard Hard's.
   Feature and event tiers come from the difficulty plan (features-tiered.json and events-tiered.json).
   ============================================================ */
const DIFFS = {
  easy:   { ic:'🌱', label:'Easy', mode:'relaxed', blurb:'The heart of the game: a job, a home, school, a partner, trips and the town. Fewer bad surprises, stats wear down slower, and debt never ends your game.' },
  normal: { ic:'⚖️', label:'Normal', mode:'normal', blurb:'Adds kids, stocks, weather, rising prices, a business and more. Work your way up and plan to retire. Debt ends the game at -$40,000.' },
  hard:   { ic:'🔥', label:'Hard', mode:'hard', blurb:'The full game: adds layoffs and strikes, home damage, caring for Dad, farming and more. Stats wear down faster, costs are 10% higher, and debt ends the game at -$25,000.' }
};
const DIFF_ORDER = { easy:0, normal:1, hard:2 };
// to-do 2 D9: "Which mode is for me?" in plain words, shared by the start screen's card and the Help section
const DIFF_WHO = {
  easy:   'New to games like this, or want a calm game. There is less to keep track of, fewer bad surprises, and debt never ends your life.',
  normal: 'Want the game as it was made. You plan for kids, savings, weather and rising prices, and deep debt can end your life.',
  hard:   'Know the game well and want a test. Everything is on, money is tighter, and the same good play scores a few points lower.'
};
const DIFF_WHO_NOTE = 'Not sure? Start on Easy or Normal. You pick a mode for each new life, and each mode keeps its own records.';
const whichModeHTML = () => `<ul class="whichlist">${DIFF_LIST.map(k => `<li><b>${DIFFS[k].ic} ${DIFFS[k].label}:</b> ${DIFF_WHO[k]}</li>`).join('')}</ul><p class="whichnote">${DIFF_WHO_NOTE}</p>`;

const DIFF_LIST = ['easy', 'normal', 'hard'];
// the old mode a difficulty plays with, and the difficulty an old mode maps to (for callers that still pass a mode)
const DIFF_MODE = { easy:'relaxed', normal:'normal', hard:'hard' };
const MODE_DIFF = { relaxed:'easy', normal:'normal', hard:'hard' };
// every feature's tier (core loop features are always on)
const FEATURE_TIER = {
  'core.week':'easy', 'core.focus':'easy', 'core.jobs':'easy', 'core.saves':'easy', 'core.score':'easy', 'core.bills':'easy',
  'jobs.interview':'normal', 'jobs.perks':'normal', 'jobs.ladder':'normal', 'jobs.layoffs':'hard', 'jobs.union':'hard', 'jobs.seasonal':'normal',
  'jobs.hustle':'easy', 'jobs.commute':'normal', 'jobs.events':'easy', 'school':'easy', 'school.certs':'normal', 'money.k401':'normal',
  'money.index':'normal', 'money.insuranceChoices':'hard', 'money.collections':'hard', 'money.bankruptcy':'hard', 'money.outlook':'normal',
  'money.inflation':'normal', 'home.buy':'easy', 'home.market':'normal', 'home.loans':'hard', 'home.propertyTax':'normal', 'car.buy':'easy',
  'car.upkeep':'normal', 'family.partner':'easy', 'family.kids':'normal', 'family.pets':'easy', 'family.dadCare':'hard', 'family.council':'normal',
  'health.sickHours':'normal', 'health.injuries':'hard', 'health.coverage':'hard', 'health.events':'normal', 'health.careStops':'hard',
  'health.paidLeave':'hard', 'health.agingDrift':'normal', 'health.lateCare':'hard', 'weather':'normal', 'weather.smoke':'hard',
  'weather.homeDamage':'hard', 'weather.neighbors':'hard', 'weather.events':'normal', 'out':'easy', 'out.bizJobs':'normal', 'out.extras':'normal',
  'out.events':'easy', 'town.seasonGoals':'normal', 'town.walk':'easy', 'trips':'easy', 'trips.roadEvents':'easy', 'trips.ski':'easy', 'maps':'easy',
  'events':'easy', 'events.packW2':'easy', 'events.packA1':'easy', 'events.story':'normal', 'biz':'normal', 'biz.wheat':'hard', 'biz.truck':'normal',
  'biz.shop':'normal', 'biz.cattle':'hard', 'skills':'normal', 'retire.income':'normal', 'retire.south':'normal', 'retire.host':'normal',
  'legacy.will':'normal', 'legacy.heirs':'normal', 'legacy.scholarship':'normal', 'score.aims':'normal', 'score.reportCards':'normal',
  'score.debtDrag':'hard', 'goals.badges':'easy', 'challenges.scenarios':'hard', 'challenges.weekly':'normal', 'modes':'easy',
  'backgrounds':'normal', 'lengths.life':'normal', 'score.history':'easy', 'ui.plan':'easy', 'ui.auto':'easy', 'ui.undo':'easy',
  'ui.checklist':'easy', 'ui.recap':'easy', 'ui.nudges':'easy', 'ui.milestones':'easy', 'ui.explain':'easy', 'help.tutorial':'easy',
  'help.inline':'easy', 'help.whatsNew':'easy'
};
// a feature is on only if the features it builds on are on
const FEATURE_DEPS = {
  'jobs.events':['events'], 'school.certs':['school'], 'money.bankruptcy':['money.collections'], 'home.market':['home.buy'],
  'home.loans':['home.buy'], 'home.propertyTax':['home.buy'], 'family.partner':['events'], 'family.kids':['family.partner'],
  'family.pets':['events'], 'family.council':['events'], 'health.coverage':['money.insuranceChoices'],
  'health.careStops':['family.dadCare', 'trips'], 'health.paidLeave':['family.kids'], 'health.lateCare':['events'], 'weather.smoke':['weather'],
  'weather.homeDamage':['home.buy', 'weather'], 'weather.neighbors':['weather'], 'weather.events':['events', 'weather'], 'out.bizJobs':['out'],
  'out.extras':['out'], 'out.events':['events', 'out'], 'trips.roadEvents':['events'], 'events.packW2':['events'], 'events.packA1':['events'],
  'events.story':['events'], 'biz.wheat':['biz'], 'biz.truck':['biz'], 'biz.shop':['biz'], 'biz.cattle':['biz'], 'retire.income':['money.k401']
};
// events by tier (any event not listed here counts as Normal)
const EVENT_TIERS = {
  easy: [
    'Celebration Days', 'Harvest time', 'Wine country weekend', 'Powder day at Bluewood', 'Tax refund', 'A raise', 'A friendly stray',
    'Someone catches your eye', 'Fair & Frontier Days', 'Hunting season', 'Walla Walla Sweets are in', 'Festival at the Dayton Depot',
    'A tip from a friend', 'Found money', 'The trip of a lifetime', 'Friday night game', 'A stranded driver on the shoulder',
    'Hot-air balloon festival in Walla Walla', 'A free college lecture in Walla Walla', 'Wine release weekend in Walla Walla',
    'Cheap flight deal out of Pasco', 'Spring festival in Pasco', 'Hydroplane races on the Columbia', 'Fourth of July fireworks in Columbia Park',
    'Clearance sale at the mall', 'A test drive at a dealership', 'Riverfront 5K in Richland', 'Hanford history tour', 'Classic car show in Dayton',
    'Bluewood season pass sale', 'A lost wallet in a Walla Walla parking lot', 'A friendly regular at the gas station', 'Your performance review',
    'Free training course', 'Employee of the month', 'Holiday party', 'Train the new hire', 'A customer compliment', 'Workplace fundraiser',
    'Conference trip', 'A coworker retires', 'Year-end bonus', 'Lunchroom potluck', 'A recruiter calls', 'A work friend\'s wedding', 'Snow day',
    'Community potluck at Town Hall', '"Lost dog" poster', 'Pour beer at the Celebration Days beer garden', 'Town Hall roof fundraiser',
    'Adopt a Main Street flower basket', 'Little League needs a coach', 'A losing streak', 'The comeback', 'The season party', 'A cross-country cyclist asks for water', 'Christmas lights contest',
    'Barn dance at the fairgrounds', 'Wild turkeys strut down Main Street', 'Graduation party invitations', 'Bluegrass jam at Tonnage',
    'Tonnage opens for Celebration Days', 'Grenache Fest', 'Music night at The Royal Brick', 'All-ages show at The Royal Brick',
    'The grill is open at Laughing Lad', 'Simply Shavings is back', 'The Junque Sisters reopen', 'Spring rush at Dreamy Garden Center',
    'Cookout at Mr. Q\'s', 'A table at The Little Kiss', 'Preston Park cleanup day', 'Museum open house', 'Fourth of July parade',
    'Trout opener on Coppei Creek', 'Library book sale', 'FFA bake sale', 'Neighbor\'s chickens loose in your yard', 'Citywide yard sale',
    'School fundraiser auction', 'Fire district pancake breakfast', 'An old friend moves back'
  ],
  hard: [
    'The Touchet is running high', 'Layoffs', 'A break-in', 'A kitchen fire', 'Catalytic converter stolen', 'Calving season',
    'A hard winter on the herd', 'Wildfire smoke over the valley', 'A fender bender', 'Hurt on the job', 'A big mistake at work',
    'Health plan choice', 'Harvest: sell or store?', 'Neighbor\'s tree takes out your fence', 'Rattlesnake in the woodpile',
    'The smoke rule at work', 'A cough in a smoke week', 'After the flood: the furnace', 'A cracked tooth', 'Flu season in town',
    'Smoke from a wheat-field fire', 'Water in the basements', 'A levee for the town', 'The levee is dedicated', 'Contract vote', 'Federal shutdown',
    'A chinook wind', 'An ice storm', 'The neighbor on oxygen', 'Line crews fill the café', 'An ice storm in calving season',
    'Coffee with the farmers', 'Dale says thanks', 'Hail cuts a stripe through the wheat', 'A dry year on the herd'
  ]
};
const EVENT_TIER = Object.fromEntries(Object.entries(EVENT_TIERS).flatMap(([t, list]) => list.map(title => [title, t])));
// events that cost money or stats: on Easy they come about 40% less often (Hard and Normal keep today's pacing)
const EVENT_BAD = new Set([
  'Snow on Highway 12', 'Truck trouble', 'The Touchet is running high', 'Wine country weekend', 'Powder day at Bluewood', 'Layoffs',
  'Someone catches your eye', 'A rough patch', 'Run for town council?', 'Fair & Frontier Days', 'Feeling run down', 'Toothache',
  'Walla Walla Sweets are in', 'Festival at the Dayton Depot', 'Gas prices spike', 'Neighbor\'s moving day', 'Starting a family?',
  'The trip of a lifetime', 'A break-in', 'A kitchen fire', 'Catalytic converter stolen', 'Calving season', 'A hard winter on the herd',
  'Wildfire smoke over the valley', 'Friday night game', 'Deer on Highway 12 at dusk', 'Stuck behind a wheat truck', 'Fog in the Touchet Valley',
  'Flat tire on US-12', 'A fender bender', 'Speeding ticket', 'Road-construction detour', 'Your carpool buddy is always late',
  'Dust storm near the Tri-Cities', 'Wine release weekend in Walla Walla', 'Train crossing in Pasco', 'Chains required on the road to Bluewood',
  'Wrong pump at the gas station', 'Pothole season', 'Your performance review', 'Mandatory overtime week', 'A coworker conflict',
  'Free training course', 'Hurt on the job', 'New manager', 'Holiday party', 'Train the new hire', 'A big mistake at work', 'Equipment breaks down',
  'Flu going around', 'A rude customer', 'The boss offers a weekend gig', 'New software rollout', 'Payroll error: a late paycheck',
  'Cover a double shift', 'Harvest crunch', 'Safety inspection', 'Daycare calls: a fever', 'Potty training rut', 'Market drop', 'Snow day',
  'Pour beer at the Celebration Days beer garden', 'Little League needs a coach', 'Late frost kills the garden',
  'Neighbor\'s tree takes out your fence', 'Rattlesnake in the woodpile', 'A cough in a smoke week', 'High wind closes Highway 12 to trucks',
  'De-icing planes at 5 a.m.', 'Heat limits in the suit at Hanford', 'A cracked tooth', 'Flu season in town', 'Bluegrass jam at Tonnage',
  'Tonnage opens for Celebration Days', 'Grenache Fest', 'Music night at The Royal Brick', 'All-ages show at The Royal Brick',
  'The grill is open at Laughing Lad', 'Simply Shavings is back', 'The Junque Sisters reopen', 'Spring rush at Dreamy Garden Center',
  'Cookout at Mr. Q\'s', 'Preston Park cleanup day', 'Ice storm knocks out power', 'Frozen pipes', 'Fire district pancake breakfast',
  'Smoke from a wheat-field fire', 'Mice in the walls', 'An old friend moves back', 'The porch is sagging', 'The kitchen is next',
  'A friend\'s food truck', 'Opening day for the food truck', 'A year of the food truck', 'Water in the basements', 'A levee for the town',
  'Contract vote', 'A rough guest', 'A chinook wind', 'An ice storm', 'The neighbor on oxygen', 'Line crews fill the café',
  'An ice storm in calving season'
]);
const EASY_BAD_W = 0.6;
const DIFF_FLAGS_KEY = KEY_PREFIX + 'flags';
const diff = (s = S) => (s && DIFFS[s.diff] ? s.diff : 'hard');
const diffAtLeast = (t, s = S) => DIFF_ORDER[t] <= DIFF_ORDER[diff(s)];
// the owner's device overrides ({ key: true|false }), set in the owner panel (owner.js). A life takes a copy when it
// starts (S.flags) and is marked (S.flagsEdited). They never touch a weekly or story challenge. A life without a copy
// that could go on the records only reads the device's overrides once it is marked
function flagOverrides(s = S){
  if (!s || s.weekly || (s.scenario && typeof SCENARIOS !== 'undefined' && SCENARIOS[s.scenario])) return {};
  if (s.flags && typeof s.flags === 'object' && !Array.isArray(s.flags)) return s.flags;
  const free = s.flagsEdited || s.practice || (typeof lifeTier === 'function' && lifeTier(s) === 'sandbox');
  if (!free) return {};
  try { const o = JSON.parse(localStorage.getItem(DIFF_FLAGS_KEY) || 'null'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; }
}
// is feature k on in this life? Unknown keys are on; a feature is off if anything it builds on is off
function on(k, s = S, seen = {}){
  if (!Object.prototype.hasOwnProperty.call(FEATURE_TIER, k)) return true;
  if (seen[k]) return true;                                   // a loop in the deps never locks a feature
  seen[k] = 1;
  for (const d of FEATURE_DEPS[k] || []) if (!on(d, s, seen)) return false;
  const o = flagOverrides(s);
  if (typeof o[k] === 'boolean') return o[k];
  return diffAtLeast(FEATURE_TIER[k], s);
}
// an event's tier (tagged on the event the first time it's asked), and whether it can come up in this life
const evTier = e => e.tier || (e.tier = EVENT_TIER[e.title] || 'normal');
const evOn = (e, s = S) => diffAtLeast(evTier(e), s);
// Easy eases the dice on events that cost money or stats
const evDiffW = (e, s = S) => diff(s) === 'easy' && EVENT_BAD.has(e.title) ? EASY_BAD_W : 1;
// boot: every event object gets its tier
function tagEventTiers(){
  const lists = [typeof EVENTS !== 'undefined' && EVENTS, typeof DUE_EVENTS !== 'undefined' && DUE_EVENTS, typeof PLAN_DUE !== 'undefined' && PLAN_DUE];
  for (const l of lists) if (Array.isArray(l)) l.forEach(evTier);
}
// a life's difficulty in a few words ("🌱 Easy", or "Classic" for a life from before difficulties)
const diffName = (s = S) => s && s.classic ? 'Classic' : DIFFS[diff(s)].label;
const diffTag = (s = S) => s && s.classic ? '🏛️ Classic' : `${DIFFS[diff(s)].ic} ${DIFFS[diff(s)].label}`;
