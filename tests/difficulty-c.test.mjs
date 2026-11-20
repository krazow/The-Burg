// Difficulty modes stage 2C (to-do list 2, D2 + D3): weather, town and out-and-about, trips and maps, and the event
// packs sit behind on(k). Each feature is off below its tier and on at it; Easy-tier features are on in Easy and
// switch off with a device override (on a marked life). Run with: npm run test:difficulty-c
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(2203));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(srv.url, { waitUntil: 'load' });
await page.evaluate(() => {
  // a quiet life in difficulty d (overrides: a marked life with these device switches)
  window.life = (d, extra = {}, flags = null, opts = {}) => {
    localStorage.clear(); if (flags) localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify(flags));
    newGame('C', 'two', 0, { diff: d, ...opts }); S.unlockMode = 'all'; S.noEvents = true; if (flags) S.flagsEdited = true; Object.assign(S, extra); return S;
  };
  window.byTitle = t => EVENTS.find(e => e.title === t) || DUE_EVENTS.find(e => e.title === t);
  window.anyMonth = e => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(m => { try { return !!e.when(m); } catch (x) { return false; } });
  window.labelsOf = list => list.filter(c => !c.if || c.if()).map(c => c.label).join(' | ');
  window.done = () => { localStorage.clear(); S = null; closeSheet(); render(); };
});
const ev = (fn, arg) => page.evaluate(fn, arg);
const t = runner();

/* ---------------- Weather ---------------- */
await t.check('weather: Easy has no weather year, bills or saved weather; Normal rolls the year and pays the hard-winter heat', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d, { date: new Date(2027, 11, 6).getTime() });
      const y = wxYear(); if (on('weather')) S.wxW = { y: winterYear(), kind: 'hard' };
      const lines = [], notes = []; wxWeek(lines, notes);
      wxCostAdd(100); wxSave(50); wxHit();
      out[d] = { wx: !!S.wx, wxW: !!S.wxW, calm: !y.dry && !y.wet && !y.smoke && !y.heat, winter: wxWinter(), heat: lines.some(l => /Heating/.test(l[0])),
        yr: S.wxYr ? S.wxYr.cost : 0, hits: S.wxHits ? S.wxHits.n : 0, end: wxYearEnd(2027).cost };
    }
    done(); return out;
  });
  assert(!r.easy.wx && !r.easy.wxW && r.easy.calm && r.easy.winter === 'normal' && !r.easy.heat, `easy ${JSON.stringify(r.easy)}`);
  assert(r.easy.yr === 0 && r.easy.hits === 0 && r.easy.end === 0, `easy keeps no weather bill ${JSON.stringify(r.easy)}`);
  assert(r.normal.wx && r.normal.heat && r.normal.winter === 'hard' && r.normal.yr > 0 && r.normal.hits === 1, `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.wx && r.hard.heat && r.hard.yr > 0, `hard ${JSON.stringify(r.hard)}`);
});

await t.check('weather.smoke: no smoke years or smoke rule below Hard; Hard keeps both', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d, { date: new Date(2027, 6, 12).getTime() }); S.jobId = 'farmhand'; S.jobMonths = 12;
      let smoke = 0; for (let i = 0; i < 400; i++) { S.wx = null; if (wxYear().smoke) smoke++; }
      if (S.wx) S.wx.smoke = true;                  // force a smoke year where there is weather
      out[d] = { smoke, rule: smokeRuleWeek(), pay: smokePayMult(), event: anyMonth(byTitle('The smoke rule at work')) };
    }
    done(); return out;
  });
  assert(r.easy.smoke === 0 && !r.easy.rule && r.easy.pay === 1 && !r.easy.event, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.smoke === 0 && !r.normal.rule && r.normal.pay === 1, `normal ${JSON.stringify(r.normal)}`);
  assert(r.hard.smoke > 40 && r.hard.rule && r.hard.pay < 1, `hard ${JSON.stringify(r.hard)}`);
});

await t.check('weather.homeDamage: below Hard the wind and water never damage your home (no roofer list, no drying out)', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d, { home: 'fixer', money: 50000 });
      let dry = 0; for (let i = 0; i < 40; i++) { S.dryOut = null; if (startDryOut()) dry++; }
      S.dryOut = null; S.floodProof = 'fixer'; S.movedUp = S.turn;
      const wind = labelsOf(windChoices()), text = byTitle('Windstorm').text();
      out[d] = { dry, roofer: /roofer/.test(wind), shingles: /shingles/.test(text), flood: floodBill(1000) };
    }
    done(); return out;
  });
  for (const d of ['easy', 'normal']) assert(!r[d].dry && !r[d].roofer && !r[d].shingles && r[d].flood === 1000, `${d} ${JSON.stringify(r[d])}`);
  assert(r.hard.dry > 0 && r.hard.roofer && r.hard.shingles && r.hard.flood < 1000, `hard ${JSON.stringify(r.hard)}`);
});

await t.check('weather.neighbors: no storm debts, block captain, air filter or outage extras below Hard', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d, { community: 60, partner: 'Sam', money: 5000 });
      helpOut(); const helped = S.helped;
      S.captain = { since: 0, runs: 0 };
      const outage = outageChoices('Wait it out', () => 'ok', 'the storm').length;
      const card = weatherCard(), built = buildFilter(false);
      out[d] = { helped, captain: isCaptain(), outage, card: /Block captain/.test(card), filter: /Air filter/.test(card), built, cut: helpCut(1000).c };
    }
    done(); return out;
  });
  for (const d of ['easy', 'normal']) assert(r[d].helped === 0 && !r[d].captain && r[d].outage === 1 && !r[d].card && !r[d].built && r[d].cut === 1000, `${d} ${JSON.stringify(r[d])}`);
  assert(r.hard.helped === 1 && r.hard.captain && r.hard.outage > 1 && r.hard.card && r.hard.filter && r.hard.built && r.hard.cut < 1000, `hard ${JSON.stringify(r.hard)}`);
});

await t.check('weather.events: the weather packs never come up in Easy; Normal has the everyday ones', async () => {
  const r = await ev(() => {
    const out = {}, packs = [...WX_EVENTS, ...WX2_EVENTS];
    for (const d of DIFF_LIST) {
      life(d, { date: new Date(2027, 6, 12).getTime() });
      out[d] = { any: packs.filter(e => anyMonth(e)).map(e => e.title), touchet: anyMonth(byTitle('August on the Touchet')),
        due: WX_DUE.some(e => { S.dryOut = { step: 0 }; return !!e.when(); }) };
    }
    done(); return out;
  });
  assert(!r.easy.any.length && !r.easy.due, `easy should have no weather events: ${r.easy.any.join(', ')}`);
  assert(r.normal.touchet && r.hard.touchet, JSON.stringify(r));
});

/* ---------------- Town & Out and about ---------------- */
await t.check('out (Easy): the button, visits and Preston Avenue pins are there in Easy, and all gone when switched off', async () => {
  const r = await ev(() => {
    const out = {};
    for (const [k, flags] of [['easy', null], ['off', { out: false }]]) {
      life('easy', {}, flags);
      out[k] = { btn: !!outButton(), visit: visit('bean', placeById('bean').acts[0].id).err || 'ok', pins: outTownPins().length, ms: !!mainStreetBlock(),
        ev: OUT_EVENTS.some(e => anyMonth(e)) };
    }
    done(); return out;
  });
  assert(r.easy.btn && r.easy.visit === 'ok' && r.easy.pins > 0 && r.easy.ms && r.easy.ev, `easy ${JSON.stringify(r.easy)}`);
  assert(!r.off.btn && r.off.visit !== 'ok' && !r.off.pins && !r.off.ms && !r.off.ev, `off ${JSON.stringify(r.off)}`);
});

await t.check('out.bizJobs and out.extras: no job listings, bank or trades sheets or Tattler in Easy; Normal has them', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d);
      out[d] = { jobs: bizJobs(placeById('bean')).length, bank: shownActs(placeById('bank')).length, trades: shownActs(placeById('trades')).length, tattler: !!tattlerLine() };
      bizSheet('bean'); out[d].sheetJobs = !!document.querySelector('#sheet') && /Work here/.test(document.querySelector('#sheet').textContent); closeSheet();
    }
    done(); return out;
  });
  assert(!r.easy.jobs && !r.easy.bank && !r.easy.trades && !r.easy.tattler && !r.easy.sheetJobs, `easy ${JSON.stringify(r.easy)}`);
  for (const d of ['normal', 'hard']) assert(r[d].jobs && r[d].bank && r[d].trades && r[d].tattler && r[d].sheetJobs, `${d} ${JSON.stringify(r[d])}`);
});

await t.check('town.seasonGoals: no town goal line or progress in Easy; Normal works toward it', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) {
      life(d, { date: new Date(2027, 3, 5).getTime(), focus: 'community' }); S.sgoal = null;
      const notes = []; seasonWeek(notes);
      out[d] = { goal: !!seasonGoal(), line: !!seasonLine(), prog: S.sgoal ? S.sgoal.prog : 0, help: townGoalHelp() };
    }
    done(); return out;
  });
  assert(!r.easy.goal && !r.easy.line && r.easy.prog === 0 && !r.easy.help, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.goal && r.normal.line && r.normal.prog === 1 && r.hard.prog === 1, JSON.stringify(r));
});

await t.check('town.walk (Easy): the winter walk card is there in Easy and gone (with its snow weeks) when switched off', async () => {
  const r = await ev(() => {
    const out = {};
    for (const [k, flags] of [['easy', null], ['off', { 'town.walk': false }]]) {
      life('easy', { date: new Date(2027, 11, 6).getTime(), walk: true }, flags);
      let n = 0; for (let i = 0; i < 40; i++) { S.walkWinter = null; S.walkWinters = 0; weatherLines([], []); if (S.walkWinters) n++; }
      out[k] = { card: !!walkCard(), snow: n };
    }
    done(); return out;
  });
  assert(r.easy.card && r.easy.snow > 0, `easy ${JSON.stringify(r.easy)}`);
  assert(!r.off.card && r.off.snow === 0, `off ${JSON.stringify(r.off)}`);
});

/* ---------------- Trips & maps ---------------- */
await t.check('trips, trips.ski and maps (Easy): on in Easy, and gone when switched off', async () => {
  const r = await ev(() => {
    const out = {};
    for (const [k, flags] of [['easy', null], ['off', { trips: false, 'trips.ski': false, maps: false }]]) {
      life('easy', { money: 5000 }, flags); const sale = anyMonth(byTitle('Bluewood season pass sale')); S.skiPass = skiSeason();
      const stop = STOPS.find(s => s.towns.includes('wallawalla') && !stopBlocked(s));
      const err = planTrip('wallawalla', [stop.id]); S.trip = { city: 'wallawalla', stops: [stop.id] };
      const lines = [], fx = tripWeek(lines);
      setPref('mapView', true); tab = 'home'; render();
      out[k] = { err, fx: !!fx, chip: !!document.querySelector('#tripchip'), ski: skiPass(), sale,
        toggle: !!mapToggle(), map: !!document.querySelector('#main .mapsvg'), fgrid: !!document.querySelector('#main .fgrid'), tripBtn: /Plan a trip/.test(regionDetail('wallawalla')) };
      setPref('mapView', false);
    }
    done(); return out;
  });
  const e = r.easy, o = r.off;
  assert(e.err === '' && e.fx && e.chip && e.ski && e.sale && e.toggle && e.map && e.tripBtn, `easy ${JSON.stringify(e)}`);
  assert(o.err && !o.fx && !o.chip && !o.ski && !o.sale && !o.toggle && !o.map && o.fgrid && !o.tripBtn, `off ${JSON.stringify(o)}`);
});

await t.check('trips.roadEvents (Easy): road events come up in Easy and never when switched off', async () => {
  const r = await ev(() => {
    const out = {};
    for (const [k, flags] of [['easy', null], ['off', { 'trips.roadEvents': false }]]) {
      life('easy', { date: new Date(2027, 9, 4).getTime() }, flags); S.roadTo = 'wallawalla'; S.evSeen = {};
      let n = 0; for (let i = 0; i < 300; i++) { S.evCd = {}; if (pickEvent(i % 12, 'road')) n++; }
      out[k] = n;
    }
    done(); return out;
  });
  assert(r.easy > 50 && r.off === 0, JSON.stringify(r));
});

/* ---------------- Event packs ---------------- */
await t.check('events, packW2, packA1 (Easy): on in Easy; the master switch stops every rolled event', async () => {
  const r = await ev(() => {
    const out = {};
    for (const [k, flags] of [['easy', null], ['packs', { 'events.packW2': false, 'events.packA1': false }], ['off', { events: false }]]) {
      life('easy', { money: 20000 }, flags, { rules: { events: 'busy' } }); S.noEvents = false;
      const w2 = TOWN_EVENTS_W2.some(e => anyMonth(e)), a1 = TOWN_EVENTS_A1.some(e => anyMonth(e));
      let evs = 0;
      for (let i = 0; i < 52 && !S.over; i++) { const res = weekTick(true); if (res.ev) { evs++; const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; } if (res.ending) break; }
      out[k] = { w2, a1, evs };
    }
    done(); return out;
  });
  assert(r.easy.w2 && r.easy.a1 && r.easy.evs > 5, `easy ${JSON.stringify(r.easy)}`);
  assert(!r.packs.w2 && !r.packs.a1 && r.packs.evs > 0, `packs off ${JSON.stringify(r.packs)}`);
  assert(!r.off.w2 && !r.off.a1 && r.off.evs === 0, `events off ${JSON.stringify(r.off)}`);
});

await t.check('events.story: no story chains in Easy; Normal starts the fixer-upper chain', async () => {
  const r = await ev(() => {
    const out = {};
    for (const d of DIFF_LIST) { life(d, { home: 'fixer' }); out[d] = { any: STORY_EVENTS.some(e => anyMonth(e)), porch: anyMonth(byTitle('The porch is sagging')) }; }
    done(); return out;
  });
  assert(!r.easy.any, `easy ${JSON.stringify(r.easy)}`);
  assert(r.normal.porch && r.hard.porch, JSON.stringify(r));
});

/* ---------------- a year in each difficulty ---------------- */
await t.check('52 weeks in each difficulty, events on: nothing above the tier happens, and its save fields stay at defaults', async () => {
  const r = await ev(() => {
    const out = {}, orig = rollEvent;
    const packOf = {};
    for (const e of [...WX_EVENTS, ...WX2_EVENTS, ...WX_DUE]) packOf[e.title] = 'weather';
    for (const e of STORY_EVENTS) packOf[e.title] = 'story';
    for (const d of DIFF_LIST) {
      const seen = { weather: 0, story: 0 }; let all = 0;
      window.rollEvent = (m, trip) => { const e = orig(m, trip); if (e) { all++; if (packOf[e.title]) seen[packOf[e.title]]++; } return e; };
      const fields = [];
      for (const [job, seed] of [['farmhand', 1], ['diner', 2]]) {
        life(d, { money: 20000, home: 'fixer', community: 60 }, null, { rules: { events: 'busy' } }); S.noEvents = false; S.jobId = job; S.jobMonths = 12;
        for (let i = 0; i < 52 && !S.over; i++) {
          const res = weekTick(true);
          if (res.ev) { if (packOf[res.ev.title]) seen[packOf[res.ev.title]]++; const ch = res.ev.choices().filter(c => !c.if || c.if()); if (ch[0]) resolveChoice(res.ev, ch[0], true); S.pendingEv = null; }
          if (res.ending) break;
        }
        fields.push({ wx: S.wx, wxYr: S.wxYr, helped: S.helped, captain: S.captain, roofWait: S.roofWait, dryOut: S.dryOut, smokeRule: S.smokeRule, sgoal: S.sgoal || null, gray: S.gray });
      }
      out[d] = { seen, all, fields };
    }
    window.rollEvent = orig; done(); return out;
  });
  assert(r.easy.all > 10 && !r.easy.seen.weather && !r.easy.seen.story, `easy ${JSON.stringify(r.easy.seen)} of ${r.easy.all}`);
  for (const f of r.easy.fields) assert(f.wx === null && f.wxYr === null && !f.helped && !f.captain && !f.roofWait && !f.dryOut && !f.smokeRule && !f.sgoal && !f.gray, `easy fields ${JSON.stringify(f)}`);
  for (const f of r.normal.fields) assert(f.wx && !f.helped && !f.roofWait && !f.dryOut && !f.smokeRule, `normal fields ${JSON.stringify(f)}`);
});

await t.check('Easy renders Home and Life with no weather card, trips and out-and-about still there', async () => {
  const r = await ev(() => {
    life('easy', { date: new Date(2027, 11, 6).getTime() }); tab = 'home'; render();
    const home = { out: !!document.querySelector('#outbtn'), trip: !!document.querySelector('#tripchip'), walk: !!document.querySelector('#walk') };
    tab = 'life'; render(); const lifeTxt = document.querySelector('#main').textContent;
    life('hard', { date: new Date(2027, 11, 6).getTime() }); tab = 'life'; render(); const hardTxt = document.querySelector('#main').textContent;
    tab = 'home'; done(); return { home, easyCard: /Ready for weather/.test(lifeTxt), hardCard: /Ready for weather/.test(hardTxt) };
  });
  assert(r.home.out && r.home.trip && r.home.walk && !r.easyCard && r.hardCard, JSON.stringify(r));
});

await t.check('no page errors', async () => { assert(!errors.length, errors.join(' | ')); });

await browser.close(); srv.close();
if (t.failed) { console.log(`\n${t.failed} check(s) failed`); process.exit(1); }
console.log('\nAll difficulty 2C checks passed');
