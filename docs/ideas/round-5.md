# Ideas round 5

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 5: Fresh-eyes playtest

Ideas from playing The Burg headless like a new player: a full 2-year life week by week, and a 5-year life skimmed by quarter.

### i5-a01 Fix age running a year behind at birthdays (S, 🔴)

- Seen in play: the end-of-2027 review said 'Sam is 18 now' after a full year, and the 2-year ending said final age 19 (should be 20).
- Cause: `S.ageMonths += 12/52` gives 227.99999 after 52 weeks, and `age()` floors it.
- Fix in state.js `age()` (add a tiny epsilon) or derive age from `S.turn`; add a rules test for age after 52 and 104 weeks.
- Balance: none; 21+ stops and birthday notes just arrive on the right week.

### i5-a02 Life Score so far is right in the first month (S, 🔴)

- Seen in play: the pill read 35 at week 0, then 6, 6 and 18, then jumped to 35+. A new player sees their life 'crash' after one good week.
- Cause: `lifeScore()` uses `Math.max(1, S.monthsPlayed)` while `happySum` only has a fraction of a month in it.
- Fix in features.js `lifeScore()`; show a friendly title in `scoreButton()` until week 4.
- Balance: the final score is unchanged (a full game is far past one month).

### i5-a03 Year in review counts the big moments (S, 🔴)

- Seen in play: 2029 and 2030 reviews said 'A quiet year' with 16–18 events, a council win and two job changes.
- Cause: turn.js filters out log lines containing ': ' (all event results).
- Add a `mile:true` flag on big results (hired, council, partner, dog, baby, house) and use it in the review filter and the Journal's Milestones tab.
- Balance: display only.

### i5-a04 Signature yearly events always happen (S, 🔴)

- Seen in play: 82 events in 260 weeks, zero Celebration Days, four college lectures, three snow days.
- Add a `fixed:true` list in events.js; `rollEvent` picks a fixed event first when its month comes and it hasn't fired this year.
- Keeps the town's rhythm real and makes years feel different from each other.
- Balance: these events mostly cost money for fun, and a 'Stay home' choice is always there, so idle play gains nothing.

### i5-a05 Active perks with weeks left on Home (S, 🔴)

- Seen in play: took the recruiter's 'your next application is a sure thing' and then forgot; it expired unused.
- Read the existing timers (`hireBy`, trade bonus, `out.look`, `out.ad`, `stockUntil`) in ui.js `renderHome()`; tap a chip to open the right screen.
- Balance: it only helps players who act, so careless and idle play gain nothing.

### i5-a06 Event results link to the screen they're about (S, 🟠)

- Seen in play: the dealer test-drive and recruiter results both pointed somewhere with no way to go there.
- Let a choice return `{text, go:'life'|'jobs'|'out'}`; events.js `showEvent` adds a second button next to Continue.
- Balance: none.

### i5-a07 Job tips show take-home and the drive (S, 🟠)

- Seen in play: three tips in 5 years moved me from Walla Walla to Pasco to Richland with one tap each.
- Reuse ui.js `commuteCost()` and the job-row text in the 'A tip from a friend' and 'A recruiter calls' events.
- Balance: careful players turn down bad tips; careless play stays the same.

### i5-a08 Job board shows what the drive costs you in happiness (S, 🟠)

- Seen in play: the top of the first job list was two 58-mile jobs.
- Use the same commute drain as turn.js (`commuteOneWay()/40 * driveDays()`) in ui.js `jobRow()`.
- Balance: more informed choices; no change to the numbers.

### i5-a09 Switching jobs shows what you give up (S, 🟡)

- Seen in play: hopped jobs three times with no cost shown.
- Read `S.raise` and `S.jobMonths` in ui.js `apply()` (a confirm step when you already have a job) and in the tip events.
- Balance: makes job hopping a real trade-off for good players; no effect on idle play.

### i5-a10 Happiness at the top needs something new (L, 🟠)

- Seen in play: a simple rotation of work, town, outside and hustle pinned happiness at 100 from year 2 on.
- turn.js weekly drift: add extra pull-down above 85, cancelled by a 'novelty' flag set by first visits, new towns or new events.
- Retune with the sim: good play should still reach 70+ in 5 years (it scored 74 here); careless and idle play lose a little more, which helps their targets.

### i5-a11 Pay extra on the mortgage or truck loan (M, 🟠)

- Seen in play: $131k idle cash at the end of a 5-year life while still paying a mortgage every week.
- Add 'Pay extra' to outabout.js `bankSheet()`; lower `S.mortgage` or `S.loanLeft` and show the new payment.
- Balance: it moves cash into equity at the same net worth, so it gives choice without inflating scores; it rewards planning, not idling.

### i5-a12 A heads-up when cash just sits there (S, 🟡)

- Seen in play: no hint ever suggested a use for a large cash pile.
- A TIPS entry in ui.js with a `when` on cash vs. weekly bills.
- Balance: only helps players who act on it.

### i5-a13 Fold out-and-about into one Journal line a week (S, 🟡)

- Seen in play: by year 4 most Journal entries were visits, burying jobs, moves and council.
- Merge in outabout.js `visit()` by updating this week's line; add a filter in ui.js `LOG_FILTERS`.
- Balance: none.

### i5-a14 Out and about shows what's new to you (S, 🟠)

- Seen in play: the same two places, every visit, for 5 years.
- Use `S.out.last` in outabout.js `outSheet()` for the tag and sort; first-visit bonus stays under the weekly cap.
- Balance: the weekly cap still holds, so it adds variety, not points.

### i5-a15 Events notice what you've already done (S, 🟡)

- Seen in play: the Little Kiss table event, and the Howlin' Bean 'catches your eye' event without ever visiting.
- Add a `when` check on `S.out.last[pid]` in events.js and a 'regular' text variant.
- Balance: none; story fit only.

### i5-a16 Fresh text for events that repeat (L, 🟠)

- Seen in play: the 5-year life had nine events that repeated word for word.
- Let `text` and choice results be arrays in events.js; remember the last variant per title in `S.evCd`.
- Balance: same numbers, new words.

### i5-a17 Event drought guard (S, 🟠)

- Seen in play: Aug–Dec 2027 had only a handful of events and long flat stretches.
- Track weeks since the last event in turn.js and add a boost in `rollEvent`.
- Balance: favor small, mixed-outcome town events so the extra ones don't add free points.

### i5-a18 One-choice events as a quick news card (S, 🟡)

- Seen in play: several sheets a year with nothing to choose.
- In turn.js resolve one-choice events the way skips already do, and show them in `showRunDetails()` and a toast.
- Balance: same outcomes.

### i5-a19 Choice labels show the real cost (S, 🟡)

- Seen in play: two results that didn't match their buttons.
- Run the skill discount when building labels in events.js (porch, kitchen, truck trouble).
- Balance: none; it rewards skills you've earned by showing them.

### i5-a20 A turned-down date isn't a dead end (M, 🟡)

- Seen in play: two rejections in the 2-year life and no partner, then a yes on the first try in the 5-year one.
- Count recent social visits in outabout.js and use them in the event's weight and success chance in events.js.
- Balance: it costs money and visits; idle play gets no more chances than today.

### i5-a21 Nudge to finish a half-done degree (S, 🟡)

- Seen in play: progress sat at 32 of 40 weeks for three years.
- A TIPS entry in ui.js using `studyDone()` and `STUDY_NEED`.
- Balance: only helps players who act on it.

### i5-a22 End screen: one thing to try next time (S, 🟠)

- Seen in play: the ending showed the math but not what to change.
- Reuse the 'weakest part' tip from `showScoreNow()` in features.js `finish()`.
- Balance: none; it teaches good play.

### i5-a23 The last year gets a review too (S, 🟡)

- Seen in play: no year-two review in the 2-year life, none for 2031 in the 5-year one.
- Build the review snapshot in turn.js when the game ends and render it in `finish()`.
- Balance: none.

### i5-a24 Your work history on the Jobs tab (S, 🟡)

- Seen in play: four jobs in 5 years with no single place to see them.
- Push to `S.jobs` in ui.js `apply()` and the tip events; render in `renderJobs()`.
- Balance: none.

### i5-a25 Tips put themselves away once you've done the thing (S, 🟡)

- Seen in play: two tips stayed on Home for the whole first month, pushing the focus picker down.
- Add a `done` check to each TIPS entry in ui.js (focus changed, strip tapped, tab visited).
- Balance: none.

### i5-a26 Suggest Auto in a quiet stretch (S, 🟡)

- Seen in play: tapping End Week 104 times in a 2-year life, many weeks with nothing to do.
- Track quiet weeks in turn.js; highlight the Auto button in ui.js `render()`.
- Balance: Auto already stops for real choices.

### i5-a27 Score pill shows the trend (S, 🟡)

- Seen in play: 59 → 74 over three years, one point at a time, with no sense of direction.
- Use `S.scoreQ` in features.js `scoreButton()`.
- Balance: none.

### i5-a28 A playtest bot that writes a readable story (M, 🟠)

- How this round was tested: a Playwright script that drives `playWeeks`, `apply`, `visit` and `planTrip` and logs the sheets.
- Add as tools/playtest.mjs with seed and length flags; report repeated events, weeks without events and the final score.
- Balance: it adds a 'human' profile next to careless, idle and good in the sim.

## Ideas 5: Outdoors and the region

The Blue Mountains, the rivers, the wheat, the weather and the towns and trips around Waitsburg, as things you plan around and play.

### i5-b01 A forecast chip that changes this week's focus (M, 🔴)

- Home shows one forecast chip above the focus buttons, rolled from the month with the seeded event dice.
- Each forecast adds a small modifier to FOCUS fx in weekTick (js/turn.js); the preview line says what it will do.
- Touches js/state.js (FORECAST table by month), js/turn.js, js/ui.js.
- Balance: modifiers are ±1 to ±2 and only reward players who read and adapt; Auto and idle bots keep one focus, so they average out to zero.

### i5-b02 Smoke weeks: an air-quality meter in late summer (M, 🔴)

- A smoke spell rolls on some years (more likely after a dry summer) and lasts 2–4 weeks; an AQI chip shows Good, Unhealthy or Hazardous.
- During smoke, Get outside gives ♥−2, outdoor workers (farm hand, lift, harvest) lose extra health, and Rest is the safe pick.
- One-time 'Box fan air filter' purchase (−$60) halves the health hit at home. Builds on the W13 wheat-fire event.
- Touches js/turn.js, js/events.js, js/ui.js. Balance: punishes Auto play that keeps Get outside running, not players who switch.

### i5-b03 Pick where you get outside (M, 🔴)

- A new OUTSPOTS list in js/features.js, shaped like the trip stops (when, season, cost, fx, miles).
- The River pin on the town map and the focus button open the picker; the last spot is remembered for skips.
- Farther spots give more (♥+6) but cost gas and are closed in winter; the levee is free and always open.
- Balance: total gain stays near today's +5/+3 average; going far costs money, and repeat-spot streaks feed the existing rut rule.

### i5-b04 Camp at Lewis and Clark Trail State Park (S, 🟠)

- New event, June to August, once a summer: 'Campsites open at the state park'. Book (−$35, ☺+5, ♥+2) or skip.
- With kids, adds a family memory to the Journal and a small kid-happiness boost if kids are tracked.
- Touches js/events.js (town event, place pin on the region map). Balance: yearly cooldown, costs money, no score unless chosen.

### i5-b05 An outdoor gear shelf (M, 🟠)

- S.gear list; buy from the Out and about sheet (sporting goods stand-in in Walla Walla) or a Tattler want ad.
- Each piece adds +1 to its matching spot or event (fishing, hiking, camping, skiing); rental fee drops to zero at Bluewood with skis.
- Touches js/features.js (GEAR table, trip stop), js/outabout.js, js/ui.js Life tab.
- Balance: a one-time cost of $80–$400; the bonus is small and only applies to outings you choose.

### i5-b06 An Outdoors skill (S, 🔴)

- Add 'outdoors' to SKILLS in js/features.js with practice() calls from the outdoors focus and outdoor events.
- Perks per level: +10% success on hunt and fish rolls, −25% chance of trail mishaps.
- Shows in the skill list and the Help guide (js/help.js).
- Balance: success odds stay under 80% at max level; skill only grows with time spent outside, which costs gas and focus weeks.

### i5-b07 The elk draw: apply in spring, hunt in fall (M, 🟠)

- A 3-step chain with chainSet/chainAt: apply in May (−$15), results in July (about 1 in 6), hunt week in November (−$120 tag, gas).
- Drawn hunters choose how hard to hunt; success fills the freezer for months (smaller grocery bills for 12 weeks).
- Each year you're not drawn adds a preference point that raises your odds, so it rewards sticking with it.
- Touches js/features.js chain code, js/events.js. Balance: the payoff is a grocery discount worth about what it costs; the real reward is happiness.

### i5-b08 Winter steelhead on the Touchet (S, 🟡)

- Town event, Jan–Feb, yearly: Go at dawn (−$20, ☺+4, ♥−1; Outdoors skill raises the catch chance) or stay warm.
- A catch adds a Tattler line and counts toward the wildlife and outdoors lists.
- Touches js/events.js. Balance: small, yearly, costs money and a little health.

### i5-b09 Morel season in the Blues (S, 🟡)

- Event in May, more likely after a wet spring or a burn the year before.
- Hunt (gas, ♥+2; 40% a good haul: +$80–$150 or ☺+3 if you cook them) or skip; low Outdoors skill has a small chance you get turned around.
- Touches js/events.js. Balance: yearly, small money, random.

### i5-b10 Pheasant opener on a neighbor's stubble (S, 🟡)

- Event in October: with community 40+, free access (☺+4, ♥+1); otherwise pay a hunting club (−$60) or skip.
- Ties community standing to an outdoor perk, which the town hasn't had before.
- Touches js/events.js. Balance: yearly; the free option only rewards players who built community.

### i5-b11 Huckleberry picking in August (S, 🟡)

- Event in August (skipped in smoke or fire-closure years): Pick (gas, ♥+2, ☺+3) with a choice to sell (+$60) or make jam (counts for the fair entry if built).
- Touches js/events.js. Balance: yearly, small.

### i5-b12 Lost on a Blue Mountains trail (S, 🟠)

- Rare event in weeks you choose a far outdoor spot: Stay put and wait (☺−3), push on (risky: injury −$400 hospital, ♥−6), or use the map and compass (needs gear or skill 2+: safe, ☺+2).
- Search and rescue volunteers find you if it goes badly; community +1 if you thank them.
- Touches js/events.js, OUTSPOTS. Balance: the risk side of far outings, so long hikes aren't free health.

### i5-b13 Join county search and rescue (M, 🟡)

- Join from a recruiting event (needs Outdoors skill 1+). Then a callout every 8–12 weeks: go (🤝+4, ♥−2, ☺+2) or pass (🤝−1).
- Stored like other roles; a badge after 10 callouts.
- Touches js/events.js, js/features.js (roles, badges). Balance: community gain is paced by callouts, not by focus, so it can't be farmed; skipping costs a little.

### i5-b14 Fire season closes the Blues (S, 🟠)

- A yearly roll (higher in a dry summer); while closed, OUTSPOTS marks the Blues and Bluewood 'Closed: fire danger' and the levee and state park stay open.
- A Tattler line when it opens and closes.
- Touches js/features.js, js/turn.js. Balance: removes the best outdoor option for a few weeks so long Auto runs with Get outside lose a little.

### i5-b15 The wheat hills change color on the region map (S, 🟡)

- Shaded field patches in the region map SVG (js/maps.js) take a fill by month; the elevator pin glows at harvest.
- Respects the night theme and contrast checks. Balance: visuals only.

### i5-b16 Prescott, Dixie, Starbuck and Pomeroy as day trips (M, 🟠)

- Add the towns to CITIES (no jobs or one each) and to the region map with real coordinates.
- Each has 1–2 stops in the trip list: fishing at Lyons Ferry, Palouse Falls, a café stand-in, a county fair.
- Touches js/state.js, js/maps.js, js/features.js trip stops, js/help.js town table.
- Balance: same rules as other trips; gas and a cooldown keep them from being a happiness pump.

### i5-b17 Milton-Freewater: big buys without sales tax (S, 🟠)

- A trip stop south of Walla Walla; buying a vehicle or home item there takes off sales tax.
- The trip sheet does the math: 'Saves $X, gas about $Y'.
- Touches js/state.js (city entry), js/features.js trip and purchase costs, js/maps.js.
- Balance: only pays off on purchases over about $300; a small planning reward.

### i5-b18 Weekend road trips: Spokane, Pendleton, Lewiston, Seattle (L, 🔴)

- A Road trip button on the region map opens four destinations with real drive times, gas, lodging and what you'll do.
- Taking one uses your week's focus; big ☺ (+6 to +10), a Journal entry and a postcard; one trip per 13 weeks.
- Road events can fire on the drive (passes, deer, construction). Unlike a generic vacation, each place has its own season and events.
- Touches js/features.js (ROADTRIPS), js/maps.js, js/turn.js, js/events.js. Balance: costs $300–$900 and a work week; careless bots can't afford them often.

### i5-b19 Zoom the map out to the Northwest (M, 🟠)

- A zoom toggle on the region map (js/maps.js) with simple outlines and highways drawn from a few points.
- Road trip destinations are tappable from here.
- Balance: none; navigation and a sense of place.

### i5-b20 Pendleton Round-Up in September (S, 🟡)

- Road event in September, yearly: day trip (−$90 with gas, ☺+5) or skip; if road trips are built, it becomes the Pendleton trip's special.
- Touches js/events.js. Balance: yearly, costs money.

### i5-b21 Snoqualmie Pass report on Seattle trips (S, 🟡)

- Road event on Seattle trips in Nov–Mar; reuses the chains state from the Bluewood road (js/events.js).
- Closed: lose a day of the trip (☺−2) or go via the longer pass (more gas).
- Balance: adds risk to winter trips, so summer is the smart time to go.

### i5-b22 Heat wave week and the cooling bill (S, 🟠)

- Event in July: run the AC (−$90, no health loss), fans and wet towels (♥−2, ☺−1), or check on neighbors too (🤝+3).
- Outdoor workers lose extra health that week; Get outside early-morning is fine.
- Touches js/events.js, js/turn.js. Balance: summer's counterpart to winter heating bills; a cost, not a reward.

### i5-b23 Winter blues and short days (S, 🟠)

- If you haven't picked Get outside or a trip in 4 winter weeks, ☺−1 a week; a one-time light lamp (−$50) halves it.
- A gentle Home hint when it starts. Touches js/turn.js, js/ui.js.
- Balance: hits idle play in winter and rewards variety; the cap is small (about ☺−6 a winter).

### i5-b24 A wildlife life list (M, 🟠)

- About 20 animals, each with months and places; outdoor weeks and some events roll a sighting and add it to a Life list in the Journal.
- Badges at 5, 10 and all; rare ones only at far spots or certain months.
- Touches js/features.js (WILDLIFE, badges), js/turn.js, js/ui.js Journal.
- Balance: collection only, no stat gain beyond a tiny ☺+1 for a new sighting.

### i5-b25 Plant willows on Coppei Creek (S, 🟠)

- Event in March–April: volunteer (🤝+3, ♥+2, gas none) or donate (−$25, 🤝+1).
- After three years of planting, a Tattler story about the fish coming back and a badge.
- Touches js/events.js, js/features.js badges. Balance: yearly; it's the only outdoor event that builds community.

### i5-b26 Work weekends at Bluewood for a free pass (S, 🟠)

- Add a 'bluewood' gig to the hustle list (Dec–Mar, lower pay) that sets S.skiPass for the season after 4 weeks.
- Touches js/state.js hustle gigs, js/events.js skiPass().
- Balance: trades pay for the pass; worth it only to players who ski.

### i5-b27 Tubing the Touchet in July (S, 🟡)

- Event in July: float it (−$15, ☺+5; 10% a scrape, ♥−2) or watch from the bank (☺+1).
- Not offered in a high-water year. Touches js/events.js.

### i5-b28 Burn ban season (S, 🟡)

- A Fourth of July and fall-cleanup event checks it: wait for the ban to lift (☺−1) or burn anyway (30%: −$250 fine, 🤝−3).
- Touches js/events.js. Balance: a temptation with a downside; flavor that teaches the season.

### i5-b29 Bring someone outside with you (S, 🟠)

- A small toggle on the outdoors focus (and the spot picker) if you have a partner, kids or a best friend.
- Adds 🤝+1 or a partner/kid bond tick; costs a bit more ($10).
- Touches js/state.js FOCUS, js/turn.js. Balance: replaces some of the health gain with social gain, so it isn't a pure add.

### i5-b30 A year outside: a seasonal outing card (M, 🟠)

- A card under the season goal on Home with five checkboxes that fill from events and outdoor spots.
- Finishing gives ☺+4, ♥+2 and a badge; resets each January.
- Touches js/state.js (like SEASON_GOALS), js/ui.js, js/features.js badges.
- Balance: needs choices across the whole year, so Auto and idle play can't finish it; the reward is less than a town goal.

### i5-b31 Ski lessons for you or the kids (S, 🟡)

- Event in December: lessons (−$200, Outdoors skill +1, ☺+3) for you or a kid.
- After lessons, powder day events give ☺+2 more. Touches js/events.js.
- Balance: one-time money cost for a small lasting boost.

### i5-b32 A cabin up the Touchet road (L, 🟡)

- A Life-tab purchase for owners with money (−$45,000 down or $400 a month to rent); it adds a 'Cabin weekend' outdoor spot with better effects and no lodging cost on hunts.
- Cabin events: roof snow in winter, a fire-closure scare in August, renting it to hunters for income.
- Touches js/state.js (second property in net worth), js/features.js, js/events.js, js/ui.js.
- Balance: a big cost with modest happiness gains and upkeep; net worth counts only equity, so it doesn't inflate the score.
