// The Burg: weather.js (loads after outabout.js; scripts share one global scope)
/* ============================================================
   🌦️ WEATHER AND HARD YEARS (ideas round 75)

   THE WEATHER-YEAR API (i75-a01, a23). Other code reads weather only through these:
     wxYear()        this calendar year's weather: { y, dry, wet, smoke, heat, rain }
                       dry   a drought year (15%): a bad wheat harvest, a low river, a short pack season
                       wet   a high-water spring (more likely the Touchet runs high)
                       smoke wildfire smoke in July–August (S.smoke is set from it in July)
                       heat  a hot summer (heat waves in July–August)
                       rain  set by the "million-dollar rain" card in May: raises the wheat floor
     wxWinter()      this winter's kind: 'hard' | 'mild' | 'normal'. A winter runs November to March and is
                       named by the year it starts (December 2027 and February 2028 are the 2027 winter).
     wxDry() / wxSmoke() / wxHeat() / wxHard() / wxMild()   shorthands
     wxEnsure()      rolls this year's weather and this winter if they aren't rolled yet (idempotent;
                       called each week from wxWeek and from the cattle and money ticks)
     big weather hits (a23): an event with big:1 is a costly weather hit. pickEvent skips them once
       wxCapped() (2 this calendar year); weekTick calls wxHit() when one fires.
     weather money (a30): an event with wx:1 adds what it cost to the year's weather bill on its own
       (showEvent / the skip resolver call wxTrack). Other code calls wxCostAdd(v) for a cost and
       wxSave(v) for money that preparing saved (both positive numbers).
   State lives in S (defaults in WX_STATE, used by blankLife and migrate):
     S.wx, S.wxW, S.wxHits {y,n}, S.wxYr {y,cost,saved}, S.wxLife {cost,saved}, S.gray, S.grayLamp, S.helped,
     S.neighbors, S.outage, S.movedUp, S.floodProof, S.dryOut
   ============================================================ */
const WX_DRY = 0.15, WX_WET = 0.3, WX_HARD = 0.25, WX_MILD = 0.2, WX_CAP = 2, HELP_MAX = 5;
// i75-a06: smoke years grow more common over the decades: 25% in 2027, +0.4 points a year, at most 45%
const smokeOdds = y => Math.min(0.45, 0.25 + 0.004 * Math.max(0, y - 2027));
const WX_STATE = () => ({ wx:null, wxW:null, wxHits:null, wxYr:null, wxLife:{ cost:0, saved:0 }, gray:null, grayLamp:false,
  helped:0, neighbors:{}, outage:null, movedUp:null, floodProof:false, dryOut:null });

// to-do 2 D2: Easy has no weather year. Every read gets a calm year and a normal winter, and nothing is saved.
// Normal keeps the year and the heating bill but has no smoke (that's Hard's smoke rule).
const wxOn = () => on('weather');
const wxCalm = () => ({ y: new Date(S.date).getFullYear(), dry:false, wet:false, smoke:false, heat:false, rain:false });
const winterYear = () => { const d = new Date(S.date); return d.getMonth() >= 10 ? d.getFullYear() : d.getFullYear() - 1; };
function wxEnsure(){
  if (!S || !wxOn()) return;
  const y = new Date(S.date).getFullYear();
  if (!S.wx || S.wx.y !== y) {
    const dry = chance(WX_DRY);
    // the same overall odds as before (smoke about 1 year in 4), only now a dry year brings smoke and heat more often
    const p = smokeOdds(y), smoke = chance(dry ? Math.min(0.9, p * 2) : (p - WX_DRY * Math.min(0.9, p * 2)) / (1 - WX_DRY));
    S.wx = { y, dry, wet: !dry && chance(WX_WET), smoke: smoke && on('weather.smoke'), heat: chance(dry ? 0.6 : 0.25), rain:false };
  }
  const wy = winterYear();
  if (!S.wxW || S.wxW.y !== wy) { const r = Math.random(); S.wxW = { y: wy, kind: r < WX_HARD ? 'hard' : r < WX_HARD + WX_MILD ? 'mild' : 'normal' }; }
}
const wxYear = () => { if (!wxOn()) return wxCalm(); wxEnsure(); return S.wx; };
const wxWinter = () => { if (!wxOn()) return 'normal'; wxEnsure(); return S.wxW.kind; };
const wxDry = () => !!wxYear().dry, wxSmoke = () => !!wxYear().smoke, wxHeat = () => !!wxYear().heat;
const wxHard = () => wxWinter() === 'hard', wxMild = () => wxWinter() === 'mild';
const WX_NAME = () => { const w = wxYear(); return w.dry ? 'A dry year is shaping up.' : w.wet ? 'A wet year: the river ran high this spring.' : w.smoke ? 'A smoky summer.' : 'An ordinary year for weather, so far.'; };

/* ---- a23: bad luck has a ceiling ---- */
const thisYear = () => new Date(S.date).getFullYear();
const wxHitsNow = () => S.wxHits && S.wxHits.y === thisYear() ? S.wxHits.n : 0;
const wxCapped = () => wxOn() && wxHitsNow() >= WX_CAP;
function wxHit(){ if (!wxOn()) return; S.wxHits = { y: thisYear(), n: wxHitsNow() + 1 }; }

/* ---- a30: what the weather cost this year, and what preparing saved ---- */
function wxYr(){ const y = thisYear(); if (!S.wxYr || S.wxYr.y !== y) S.wxYr = { y, cost:0, saved:0 }; return S.wxYr; }
function wxCostAdd(v){ if (!(v > 0) || !wxOn()) return; wxYr().cost += v; S.wxLife = S.wxLife || { cost:0, saved:0 }; S.wxLife.cost += v; }
function wxSave(v){ if (!(v > 0) || !wxOn()) return; wxYr().saved += v; S.wxLife = S.wxLife || { cost:0, saved:0 }; S.wxLife.saved += v; }
// a weather event's result: what it cost goes on the weather bill
function wxTrack(ev, dm){ if (ev && ev.wx && dm < 0) wxCostAdd(-dm); }
// the year review's weather line (called by weekTick at New Year, before the counters reset)
function wxYearEnd(y){ const r = S.wxYr && S.wxYr.y === y ? { cost: S.wxYr.cost, saved: S.wxYr.saved } : { cost:0, saved:0 }; return r; }

/* ---- a18: storm debts. The people you helped help you back. ---- */
function helpOut(){ if (!on('weather.neighbors')) return; S.helped = Math.min(HELP_MAX, (S.helped || 0) + 1); }
const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five'];
// a home repair after help: 10% off per helper, up to half, and a line that names them
function helpCut(c){
  const n = on('weather.neighbors') ? Math.min(HELP_MAX, S.helped || 0) : 0; if (!n) return { c, line:'' };
  const cut = c * Math.min(0.5, 0.1 * n); wxSave(cut);
  const june = S.neighbors && S.neighbors.june;
  const who = june ? `June Harlow's grandson${n > 1 ? ` and ${NUM[n - 1].toLowerCase()} more neighbor${n > 2 ? 's' : ''}` : ''}` : `${NUM[n]} neighbor${n > 1 ? 's' : ''}`;
  return { c: c - cut, line: ` ${who} came with shovels and saved you ${fmt(cut)}.` };
}
// a flooded basement's bill: moving things up (a05) halves it, a raised furnace (S.floodProof) cuts it 80%
function floodBill(base){
  let c = base;
  if (!on('weather.homeDamage')) return c;
  if (S.movedUp != null && S.turn - S.movedUp <= 16) { wxSave(c * 0.5); c *= 0.5; }
  if (S.floodProof && HOMES[S.home].own) { wxSave(c * 0.8); c *= 0.2; }
  return c;
}

/* ---- the weekly weather tick (called from weekTick before the business week) ---- */
const GRAY_DRAIN = 1, HEAT_BILL = 45, PACK_CUT = 0.15;
const PACK_JOBS = ['foodplant', 'onion'];
// a29: a short pack season in a dry year (July and early August)
const packShort = (j = S.retired ? null : job(), d = new Date(S.date)) => !!j && PACK_JOBS.includes(j.id) && S.wx && S.wx.y === d.getFullYear() && S.wx.dry && (d.getMonth() === 6 || (d.getMonth() === 7 && d.getDate() <= 14));
const wxPayF = j => packShort(j) ? 1 - PACK_CUT : 1;                 // turn.js multiplies the paycheck by this
const wxLayoffF = () => S.wx && S.wx.dry && PACK_JOBS.includes(S.jobId) ? 1.5 : 1;   // a29: layoffs go up a step
function wxWeek(lines, notes){
  wxEnsure(); if (!wxOn()) return;
  const d = new Date(S.date), mo = d.getMonth(), y = d.getFullYear(), first = d.getDate() <= 7;
  if (mo === 6 && first && !S.practice) notes.push(`🌦️ ${WX_NAME()}`);   // a01: the year gets a name in July
  // a03: a hard winter's heating bill (a mild one sends a refund card instead)
  if ([11, 0, 1].includes(mo) && wxHard()) { const v = cost(HEAT_BILL) * W; lines.push(['🔥 Heating (hard winter)', -v, 'A hard winter: the furnace runs day and night.']); wxCostAdd(v); }
  // a04: gray January in a hard winter: 3 to 5 weeks of inversion fog, a small drain on happiness
  if (mo === 0 && first && wxHard() && !S.practice && !S.noEvents && !(S.gray && S.gray.y === y)) S.gray = { y, left: ri(3, 5) };
  if (S.gray && S.gray.left > 0) {
    adj({ happy: -GRAY_DRAIN * (S.grayLamp ? 0.5 : 1) });
    if (--S.gray.left === 0) log('☀️ First sun in three weeks. The whole town was out on Main Street, squinting.');   // a Journal line, so it doesn't stop a skip
  }
  // a29
  const j = S.retired ? null : job();
  if (packShort(j)) { const v = payNow(j) * W * PACK_CUT; wxCostAdd(v);
    if (!S.packNote || S.packNote !== y) { S.packNote = y; notes.push(`🧅 A dry year means a short pack season: ${j.title.toLowerCase()} pay is down ${PACK_CUT * 100}% into August. A side hustle can fill the gap.`); } }
  // a15: the herd in a dry year: feed costs more July to October unless you sold down
  const B = S.biz && S.biz.type === 'cattle' ? S.biz : null;
  if (B) {
    if (S.wx.dry && mo >= 6 && mo <= 9 && B.soldDown !== y) { const v = cost(HAY) * (B.cows ?? CATTLE_COWS) * 0.6 * W; lines.push(['🐄 Hay (dry pasture)', -v, 'A dry year: the pasture burned off, so the herd eats hay early.']); wxCostAdd(v); }
    if (S.wx.dry && mo === 6 && B.dryAsk !== y && !S.noEvents) { B.dryAsk = y; dueEvent('A dry year on the herd'); }
    if (B.regrow != null && S.turn >= B.regrow) { B.regrow = null; B.cows = Math.min(CATTLE_COWS, (B.cows || 0) + 2); notes.push(`🐄 The heifers you kept back after the dry year are cows now: ${B.cows} in the herd again.`); }
  }
  // a32: the house after the water, one card every couple of weeks
  if (S.dryOut && S.dryOut.at <= S.turn && !S.dryOut.asked && !S.noEvents) { S.dryOut.asked = true; dueEvent(DRY_STEPS[S.dryOut.step]); }
}

/* ---- events ---- */
const dryNext = (step, wait) => { S.dryOut = { ...S.dryOut, step, at: S.turn + wait - ((S.helped || 0) >= 2 ? 1 : 0), asked:false }; };
const DRY_STEPS = ['The house after the water', 'Drying out: the drywall comes down', 'Drying out: done'];
// a32: if the flood reached your place, six weeks of drying out (base: the flood's bill before choices)
function startDryOut(){
  if (!on('weather.homeDamage')) return '';
  const own = !!HOMES[S.home].own;
  if (!chance(own ? 0.5 : 0.35)) return '';
  S.dryOut = { step:0, at: S.turn + 1, base: floodBill(cost(own ? 2500 : 700)), asked:false };
  return ` The water reached your ${own ? 'basement' : 'place'} too: it'll take a few weeks to dry out.`;
}
const WX_EVENTS = [
  // a02: good weather too
  { ic:'🌧️', title:'A million-dollar rain', wx:1, yr:1, w:3, when:m => m === 4 && !wxDry(),
    text:'A slow, soaking rain all weekend, right when the wheat needed it. At the café they say it was worth a million dollars to the valley.',
    choices:() => [{label:'Listen to it on the roof', go:() => { if (S.biz && S.biz.type === 'wheat') { wxYear().rain = true; return 'Your wheat drank it up. This year\'s crop should come in at least a little above normal.'; }
      adj({ happy:1 }); return 'Everyone in town was in a good mood all week.'; }}]},
  // a03: the other side of hard winters
  { ic:'🌤️', title:'A mild winter', wx:1, yr:1, w:4, when:m => m === 0 && wxMild(),
    text:'Hardly any snow, and afternoons in the forties. The heating bill came in low.',
    choices:() => [{label:'Open the bill', go:() => { const v = cr(130); adj({ money:v }); wxSave(v); return `About ${fmt(v)} less than a usual January. That's a week of groceries.`; }}]},
  // a04
  { ic:'🌫️', title:'Gray January', wx:1, yr:1, w:6, when:() => !!(S.gray && S.gray.left > 0 && S.gray.y === thisYear()),
    text:'The valley inversion: a lid of cold fog that hasn\'t lifted in two weeks. Everyone\'s a little flat. Above it, Bluewood is in sunshine.',
    choices:() => [
      {label:`Buy a light-therapy lamp (-${fmtc(70)}, half the gloom for good)`, if:() => !S.grayLamp, go:() => { adj({ money:-cr(70) }); S.grayLamp = true; return 'Twenty minutes with coffee in front of it every morning. It helps, this winter and every gray one after.'; }},
      {label:'Walk at noon, every day', go:() => { adj({ health:2, happy:1 }); return 'The fog is thinnest at noon. You walked the river path most days.'; }},
      {label:`Drive up toward Bluewood for sun (-${fmtc(30)})`, go:() => { adj({ money:-cr(30), happy:3, health:1 }); return 'Twenty minutes up the road, out of the fog and into blue sky.'; }}
    ]},
  // a05: a chinook melts the snow in a day, and the river follows
  { ic:'🌬️', title:'A chinook wind', wx:1, yr:1, w:3, when:m => m === 1 && wxHard() && !S.chains?.levee,
    text:'A warm wind came over the Blues overnight and ate a foot of snow by noon. The Touchet is going to rise this week.',
    choices:() => [
      {label:'Move things up off the basement floor tonight', go:() => { S.highWater = S.turn; S.movedUp = S.turn; adj({ happy:-1 }); return 'An evening of boxes and cinder blocks. If the water comes, it\'ll cost half as much.'; }},
      {label:'Wait and see', go:() => { S.highWater = S.turn; return 'You watched the gutters run and hoped.'; }}
    ]},
  // a10: an ice storm takes the power (the windstorm does too)
  { ic:'🧊', title:'An ice storm', wx:1, big:1, yr:1, w:2, when:m => inM(m,11,0,1) && wxHard(),
    text:'Freezing rain all night. Branches came down on the lines, and the power is out up and down your street.',
    choices:() => [{label:'Light the candles and check the house', go:() => { S.outage = S.turn;
      if (HOMES[S.home].own) { const h = helpCut(cost(700)), p = youPay('home', h.c); adj({ money:-p, happy:-2 }); return `A limb took out the gutter and part of the fence: ${fmt(h.c)}.${h.line}${covered(h.c, p)}`; }
      adj({ money:-cr(60), happy:-1 }); return 'Two days without power. The fridge food didn\'t make it.'; }}]},
  { ic:'🫁', title:'The neighbor on oxygen', wx:1, yr:1, w:6, when:() => S.outage != null && S.turn - S.outage <= 1,
    text:'June Harlow next door runs on home oxygen, and the power is still out. Her backup tank is good for a few more hours. She\'s calm about it; she\'s done this before.',
    choices:() => [
      {label:`Drive her to her daughter's in Walla Walla (gas, a lost night)`, go:() => { adj({ money:-cr(25), happy:-1, community:4 }); helpOut(); S.neighbors = { ...S.neighbors, june:'drove' };
        return 'An hour there and back on slick roads. June talked about the 1964 flood the whole way. She\'s fine, and she won\'t forget it.'; }},
      {label:'Run a cord from the Kellers\' generator', if:() => S.community >= 40, go:() => { adj({ community:3 }); helpOut(); S.neighbors = { ...S.neighbors, june:'cord' };
        return 'You knew who had a generator and they knew you. June\'s machine hummed all night.'; }},
      {label:'Call it in', go:() => { adj({ community:-1 }); return 'The volunteer fire crew swung by with a spare tank. June is fine. You waved from the porch.'; }}
    ]},
  // a11
  { ic:'🚚', title:'Line crews fill the café', wx:1, yr:1, w:5, when:() => S.outage != null && S.turn - S.outage >= 0 && S.turn - S.outage <= 2,
    text:'Trucks from Idaho and Oregon lined Main Street. Line crews are working around the clock, and they\'re hungry.',
    choices:() => ['diner', 'barista', 'grocer'].includes(S.jobId) && working() ? [
      {label:`Work the extra shifts (+${fmt(weekPay() * .3)})`, go:() => { const v = Math.round(weekPay() * .3); adj({ money:v, health:-2 }); return `A week of 5 a.m. breakfasts for linemen: ${fmt(v)} extra. Trucks from Idaho and Oregon lined Main Street.`; }},
      {label:'Regular hours', go:() => 'You kept your shifts. Trucks from Idaho and Oregon lined Main Street.'}
    ] : [
      {label:`Bring the crews coffee (-${fmtc(15)})`, go:() => { adj({ money:-cr(15), community:2, happy:1 }); helpOut(); return 'Two big thermoses and a box of donuts. Trucks from Idaho and Oregon lined Main Street.'; }},
      {label:'Wave as they go by', go:() => 'Trucks from Idaho and Oregon lined Main Street.'}
    ]},
  // a16
  { ic:'🌨️', title:'An ice storm in calving season', wx:1, big:1, yr:1, w:4, when:m => inM(m,1,2) && wxHard() && S.biz && S.biz.type === 'cattle',
    text:'Ice on everything in the foothills, and the heifers are calving.',
    choices:() => [
      {label:'Night checks with a flashlight', go:() => { const h = herd(); h.check = S.turn; h.saved = (h.saved || 0) + 1; adj({ health:-4, happy:-2 }); return 'Three nights of 2 a.m. checks. Every calf made it.'; }},
      {label:'Check in the morning', go:() => { const h = herd(); h.miss = (h.miss || 0) + 1; h.thin = thisYear(); return 'You slept. A couple of calves came out of it thin, and they\'ll sell lighter in October.'; }}
    ]},
  // a17: a neighbor who notices
  { ic:'☕', title:'Coffee with the farmers', wx:1, yr:1, w:2, when:m => inM(m,7,8,9) && wxDry() && !(chain('farmer').step > 0 && chain('farmer').step < 99),
    text:'The farmers\' table at the café is quieter than usual. One of them, Dale, has a harvest that didn\'t cover the bills, and he hasn\'t said much in weeks.',
    choices:() => [
      {label:'Sit down and listen', go:() => { adj({ community:1 }); helpOut(); chainSet('farmer', 2, {}, [20, 30]); return 'You didn\'t fix anything. You just listened, and he talked for an hour.'; }},
      {label:'Talk about the ballgame', go:() => 'Easier for both of you. Dale went home early.'}
    ]},
  { ic:'🤝', title:'Dale says thanks', wx:1, w:8, when:() => chainAt('farmer', 2),
    text:'Dale from the café table stops you outside the post office. The crop came back this year.',
    choices:() => [{label:'Hear him out', go:() => { chainEnd('farmer'); adj({ community:3, happy:2 }); return '"That coffee last fall mattered more than you know," he says. He means it.'; }}]},
  // a20
  { ic:'🌩️', title:'Hail cuts a stripe through the wheat', wx:1, big:1, yr:1, w:2, when:m => m === 5 && S.biz && S.biz.type === 'wheat' && !wxDry(),
    text:'A ten-minute hailstorm laid a stripe of your wheat flat.',
    choices:() => [{label:'Walk the field', go:() => { if (!S.biz) return 'The hail missed your place.'; const cut = 0.1 + Math.random() * 0.3; S.biz.hail = { y: thisYear(), cut };
      return S.biz.ins ? `About ${Math.round(cut * 100)}% of the field is down. Your crop insurance covers most of it.` : `About ${Math.round(cut * 100)}% of the field is down, and without crop insurance the harvest check will be that much smaller.`; }}]},
  // a24
  { ic:'🛟', title:'August on the Touchet', wx:1, yr:1, w:1.5, when:m => inM(m,6,7),
    text:() => wxDry() ? 'The Touchet is too low to tube this year: rocks and warm puddles. The town pool is packed.' : 'Hot afternoon, cold river. Half the town is floating the Touchet on inner tubes.',
    choices:() => wxDry() ? [
      {label:`Swim at the town pool (-${fmtc(8)})`, go:() => { adj({ money:-cr(8), happy:3 }); return 'Cannonballs and a sno-cone. Not the river, but close.'; }},
      {label:'Stay in the shade', go:() => 'A box fan and a cold drink.'}
    ] : [
      {label:'Float the river', go:() => { adj({ happy:3 }); return 'Two hours on an inner tube from the bridge to the park.'; }},
      {label:'Stay in the shade', go:() => 'A box fan and a cold drink.'}
    ]}
];
// a15, a32: cards that come when they're due
const WX_DUE = [
  { ic:'🐄', title:'A dry year on the herd', wx:1, when:() => S.biz && S.biz.type === 'cattle' && (S.biz.cows || 0) > 2,
    text:() => `The pasture is burning off and hay is already ${fmtc(HAY * 0.6 * ((S.biz || {}).cows || CATTLE_COWS))} a month for the herd. Sell two cow-calf pairs now, or keep them and buy hay through October?`,
    choices:() => [
      {label:`Sell two pairs (+${fmtc(3000)})`, go:() => { const B = S.biz; if (!B || B.type !== 'cattle') return 'The herd is already gone.'; B.cows -= 2; B.soldDown = thisYear(); B.regrow = S.turn + 104; adj({ money:cr(3000) });
        return `Sold at the sale barn. ${B.cows} cows left; you kept two heifers back, and the herd is whole again in two years.`; }},
      {label:'Keep the herd and buy hay', go:() => 'You lined up hay from a grower in the Palouse. The herd stays together, at a cost.'}
    ]},
  { ic:'🏠', title:DRY_STEPS[0], wx:1, when:() => !!S.dryOut,
    text:'Fans, a rented dehumidifier and the smell of wet carpet. The house needs a few weeks to dry. Where will you sleep?',
    choices:() => { const b = (S.dryOut || { base: cost(700) }).base * 0.3; return [
      {label:`Stay home with the fans (about ${fmt(b * 0.8)})`, go:() => { adj({ money:-b * 0.8, happy:-3 }); dryNext(1, 2); return 'Loud, damp and home.'; }},
      {label:`A friend's spare room (about ${fmt(b * 0.6)})`, if:() => S.community >= 40 || (S.helped || 0) >= 2, go:() => { adj({ money:-b * 0.6, happy:-1, community:2 }); dryNext(1, 2); return 'Your friends wouldn\'t hear of a motel.'; }},
      {label:`A motel in Walla Walla (about ${fmt(b * 1.4)})`, go:() => { adj({ money:-b * 1.4 }); dryNext(1, 2); return 'Clean sheets, and a long drive every morning.'; }}
    ]; }},
  { ic:'🧱', title:DRY_STEPS[1], wx:1, when:() => !!S.dryOut,
    text:() => HOMES[S.home].own ? 'The bottom two feet of drywall have to come out before mold sets in.' : 'Your landlord\'s crew is pulling drywall; your soaked things have to go or get cleaned.',
    choices:() => { const b = (S.dryOut || { base: cost(700) }).base * 0.7, own = HOMES[S.home].own; return [
      {label:own ? `Hire a restoration crew (about ${fmt(b)})` : `Replace what you lost (about ${fmt(b)})`, go:() => { const h = helpCut(b); adj({ money:-h.c, happy:-1 }); dryNext(2, 2); return `${own ? 'A crew from Walla Walla had it gutted in two days.' : 'A mattress, a couch and a lot of boxes.'}${h.line}`; }},
      {label:`Do it yourself (about ${fmt(b * 0.6)})`, if:() => skillLv('handy') >= 1, go:() => { const h = helpCut(b * 0.6); adj({ money:-h.c, health:-3 }); practice('handy', 2); dryNext(2, 3); return `A pry bar, a respirator and two long weekends.${h.line}`; }}
    ]; }},
  { ic:'🌤️', title:DRY_STEPS[2], wx:1, when:() => !!S.dryOut,
    text:'Six weeks after the water. The fans are off, the walls are back and the house smells like a house again.',
    choices:() => [{label:'Sit on the porch', go:() => { S.dryOut = null; adj({ happy:3, community:1 }); S.storiesDone = (S.storiesDone || 0) + 1;
      return HOMES[S.home].own ? 'It was tired, hard work, and now it\'s done.' : 'It was tired, hard work, and now it\'s done. You told the landlord the furnace should go up off the basement floor.'; }}]}
];
EVENTS.push(...WX_EVENTS);
DUE_EVENTS.push(...WX_DUE);
Object.assign(EVENT_PLACE, { 'A million-dollar rain':['T','fields'], 'A mild winter':['T','home'], 'Gray January':['T','mainst'], 'A chinook wind':['T','river'],
  'An ice storm':['T','home'], 'The neighbor on oxygen':['T','home'], 'Line crews fill the café':['T','mainst'], 'An ice storm in calving season':['R','bluewood'],
  'Coffee with the farmers':['T','mainst'], 'Dale says thanks':['T','mainst'], 'Hail cuts a stripe through the wheat':['T','fields'], 'August on the Touchet':['T','river'],
  'A dry year on the herd':['R','bluewood'], [DRY_STEPS[0]]:['T','home'], [DRY_STEPS[1]]:['T','home'], [DRY_STEPS[2]]:['T','home'] });
// existing events that are weather: wx adds them to the weather bill, big ones count toward the yearly cap
for (const [t, big] of [['Windstorm', 1], ['Snow on Highway 12', 1], ['The Touchet is running high', 1], ['Water in the basements', 1],
  ['A hard winter on the herd', 1], ['Wildfire smoke over the valley', 0], ['Fog in the Touchet Valley', 0], ['Dust storm near the Tri-Cities', 0], ['Pothole season', 0]]) {
  const e = EVENTS.find(x => x.title === t); if (e) Object.assign(e, { wx:1 }, big ? { big:1 } : {});
}
// wraps an existing event's choices: after(choiceIndex, result) can add to what happened (keeps the original rules)
function wxWrap(title, after){
  const e = EVENTS.find(x => x.title === title); if (!e) return;
  const orig = e.choices;
  e.choices = () => orig().map((c, i) => ({ ...c, go: () => { const r = c.go(); return after(i, r, c) ?? r; } }));
}
// a03: snow events follow the winter (a hard one brings more, a mild one fewer)
for (const t of ['Snow on Highway 12', 'Powder day at Bluewood']) { const e = EVENTS.find(x => x.title === t); if (e) { const w0 = e.w || 1; e.w = () => w0 * (wxHard() ? 1.75 : wxMild() ? 0.25 : 1); } }
// a10: a windstorm takes the power out too
wxWrap('Windstorm', () => { S.outage = S.turn; });
// a18: sandbagging and mucking out are help the town remembers; a32: the flood can reach your place
wxWrap('The Touchet is running high', (i, r, c) => { if (/sandbag/i.test(c.label)) helpOut(); });
wxWrap('Water in the basements', (i, r, c) => { if (/muck/i.test(c.label)) helpOut(); return r + startDryOut(); });

/* ---- round 75 part 2 hooks (events.js has the rest): the ice storms get the outage choices (a19, a26, a33),
   and a block captain's plan already has June Harlow on it (a33) ---- */
{ const e = EVENTS.find(x => x.title === 'An ice storm'); if (e) { const orig = e.choices; e.choices = () => { const [b] = orig(); return outageChoices(b.label, b.go, 'the ice storm'); }; } }
{ const e = EVENTS.find(x => x.title === 'Ice storm knocks out power'); if (e) { const orig = e.choices; e.choices = () => { const ch = orig(), i = ch.findIndex(c => /wait/i.test(c.label));
  if (i < 0) return ch;   // the town pack's own choices keep their places; remote work replaces waiting, the captain and the lantern come last
  const oc = outageChoices(ch[i].label, ch[i].go, 'the ice storm'), own = oc.filter(c => c.go === ch[i].go || /library|vacation|Miss the work/.test(c.label));
  return [...ch.slice(0, i), ...own, ...ch.slice(i + 1), ...oc.filter(c => !own.includes(c))]; }; } }
{ const e = EVENTS.find(x => x.title === 'The neighbor on oxygen'); if (e) { const orig = e.choices; e.choices = () => [
  ...(isCaptain() ? [{label:'She\'s on the storm plan: hook her up to the block\'s generator', go:() => { adj({ community:3 }); helpOut(); S.neighbors = { ...S.neighbors, june:'plan' };
    return 'June was first on your list. The generator was running at her place before her backup tank got low.'; }}] : []), ...orig()]; } }

/* ---- to-do 2 D2 + D3 (area C): event packs sit behind their feature switches. A pack that's off never comes up
   (its events' when() says no), so a life below its tier never sees it. ---- */
function featGate(list, k){ for (const e of list) { const w = e.when; e.when = w ? (...a) => on(k) && w(...a) : () => on(k); } }
featGate([...WX_EVENTS, ...WX2_EVENTS, ...WX_DUE], 'weather.events');
featGate(OUT_EVENTS, 'out.events');
featGate(TOWN_EVENTS_W2, 'events.packW2');
featGate(TOWN_EVENTS_A1, 'events.packA1');
featGate(STORY_EVENTS, 'events.story');
featGate(EVENTS.filter(e => evCat(e) === 'road'), 'trips.roadEvents');
featGate(EVENTS.filter(e => e.title === 'Bluewood season pass sale'), 'trips.ski');
