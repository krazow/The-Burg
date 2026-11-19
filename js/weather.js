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

const winterYear = () => { const d = new Date(S.date); return d.getMonth() >= 10 ? d.getFullYear() : d.getFullYear() - 1; };
function wxEnsure(){
  if (!S) return;
  const y = new Date(S.date).getFullYear();
  if (!S.wx || S.wx.y !== y) {
    const dry = chance(WX_DRY);
    // the same overall odds as before (smoke about 1 year in 4), only now a dry year brings smoke and heat more often
    const p = smokeOdds(y), smoke = chance(dry ? Math.min(0.9, p * 2) : (p - WX_DRY * Math.min(0.9, p * 2)) / (1 - WX_DRY));
    S.wx = { y, dry, wet: !dry && chance(WX_WET), smoke, heat: chance(dry ? 0.6 : 0.25), rain:false };
  }
  const wy = winterYear();
  if (!S.wxW || S.wxW.y !== wy) { const r = Math.random(); S.wxW = { y: wy, kind: r < WX_HARD ? 'hard' : r < WX_HARD + WX_MILD ? 'mild' : 'normal' }; }
}
const wxYear = () => { wxEnsure(); return S.wx; };
const wxWinter = () => { wxEnsure(); return S.wxW.kind; };
const wxDry = () => !!wxYear().dry, wxSmoke = () => !!wxYear().smoke, wxHeat = () => !!wxYear().heat;
const wxHard = () => wxWinter() === 'hard', wxMild = () => wxWinter() === 'mild';
const WX_NAME = () => { const w = wxYear(); return w.dry ? 'A dry year is shaping up.' : w.wet ? 'A wet year: the river ran high this spring.' : w.smoke ? 'A smoky summer.' : 'An ordinary year for weather, so far.'; };

/* ---- a23: bad luck has a ceiling ---- */
const thisYear = () => new Date(S.date).getFullYear();
const wxHitsNow = () => S.wxHits && S.wxHits.y === thisYear() ? S.wxHits.n : 0;
const wxCapped = () => wxHitsNow() >= WX_CAP;
function wxHit(){ S.wxHits = { y: thisYear(), n: wxHitsNow() + 1 }; }

/* ---- a30: what the weather cost this year, and what preparing saved ---- */
function wxYr(){ const y = thisYear(); if (!S.wxYr || S.wxYr.y !== y) S.wxYr = { y, cost:0, saved:0 }; return S.wxYr; }
function wxCostAdd(v){ if (!(v > 0)) return; wxYr().cost += v; S.wxLife = S.wxLife || { cost:0, saved:0 }; S.wxLife.cost += v; }
function wxSave(v){ if (!(v > 0)) return; wxYr().saved += v; S.wxLife = S.wxLife || { cost:0, saved:0 }; S.wxLife.saved += v; }
// a weather event's result: what it cost goes on the weather bill
function wxTrack(ev, dm){ if (ev && ev.wx && dm < 0) wxCostAdd(-dm); }
// the year review's weather line (called by weekTick at New Year, before the counters reset)
function wxYearEnd(y){ const r = S.wxYr && S.wxYr.y === y ? { cost: S.wxYr.cost, saved: S.wxYr.saved } : { cost:0, saved:0 }; return r; }

/* ---- the weekly weather tick (called from weekTick before the business week) ---- */
function wxWeek(lines, notes){
  wxEnsure();
  const d = new Date(S.date), mo = d.getMonth();
  if (mo === 6 && d.getDate() <= 7 && !S.practice) notes.push(`🌦️ ${WX_NAME()}`);   // a01: the year gets a name in July
}

/* ---- events ---- */
const WX_EVENTS = [];
EVENTS.push(...WX_EVENTS);
// existing events that are weather: wx adds them to the weather bill, big ones count toward the yearly cap
for (const [t, big] of [['Windstorm', 1], ['Snow on Highway 12', 1], ['The Touchet is running high', 1], ['Water in the basements', 1],
  ['A hard winter on the herd', 1], ['Wildfire smoke over the valley', 0], ['Fog in the Touchet Valley', 0], ['Dust storm near the Tri-Cities', 0], ['Pothole season', 0]]) {
  const e = EVENTS.find(x => x.title === t); if (e) Object.assign(e, { wx:1 }, big ? { big:1 } : {});
}
