# Ideas round 42

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 42: Playtest of trips and commutes

Ideas from playing games built around trips, long commutes, job moves between towns and the region map, headless with Playwright (two-year games, 5 seeds each).

### i42-a01 Trips in overtime and hustle weeks cost no time (S, 🔴)
A trip only trims a focus's good effects, so in a Work extra or Side hustle week it costs nothing: overtime pay stays full. A player who took Kennewick trips in work weeks scored 81 vs 75 without. A trip week now pays 75% of the overtime bonus and hustle pay.
Today `weekTick` multiplies only positive focus effects by TRIP_TIME. Work and hustle effects are all negative, so the trip is free.
Fix: in js/turn.js, scale the overtime part of payMult (0.2 → 0.15) and the gig pay by TRIP_TIME when `trip.away`. The trip sheet line already says 'your focus works at 75%'.
Balance: this takes away a free +6 from work-heavy players. Careless and idle bots barely use overtime trips, so their scores don't change.

### i42-a02 Errands in your work town aren't free fun (S, 🔴)
A Hanford commuter who did the same three Richland stops every week scored 97 vs 84 without. The free riverfront walk alone got 92 for $35 in two years. Work-town trips stay free of gas, but only errands and car care are free of time; fun stops count as a short evening out.
Commute-town trips cost no gas and no focus, and the repeat rule only halves a stop.
Fix in js/features.js `tripWeek`: for a commute-town trip, give 'eat' and 'do' stops 60% of their effect ('tired after a shift'). Errands, car care and appointments stay full.
The trip sheet says 'After work: fun stops do a bit less.' Keeps the commute perk without letting it outscore living in town.

### i42-a03 The same stop every week stops being special (S, 🔴)
The repeat rule only halves a stop seen in the last 4 weeks, and never more than that. A player who rested every week and went to the Dayton depot and café every week scored 54 vs 44, above the idle target of 50. Each repeat in a row now does less: 100%, 50%, 30%, then 15%.
Add a per-stop streak count next to `S.stopLast`. The streak resets after 8 weeks away.
Touches js/features.js (`tripWeek`, REPEAT_WEEKS) and the stop buttons in `tripSheet`.
Balance: aimed at autopilot trips. Players who move around the region lose nothing.

### i42-a04 Trip fun tops out like Rest does (S, 🟠)
Weekly trips that picked the most fun stops pushed average happiness to 98 and spent $21,600 in two years for +1 score. Rest already stops working in the low 80s. Trip happiness and health now shrink as you get close to full.
In `tripWeek`, multiply positive effects by clamp((92 − stat) / 20, 0.2, 1), close to how Rest works in js/turn.js.
Show 'You're already in a great mood: fun stops do less' on the trip sheet when happiness is above 85.
Balance: stops trips from taking happiness to the top. Errand value (groceries, oil, tires) is not touched.

### i42-a05 Walla Walla and Tri-Cities road events on a Dayton trip (S, 🔴)
Over 8 two-year games of weekly Dayton trips, 36 of 68 road events were set somewhere else: 'A friend is in the hospital in Walla Walla' (8), a free Walla Walla lecture (12), a lost wallet in a Walla Walla lot, Pasco flight deals, a Richland 5K, Columbia Park fireworks. Events that name a town now need that town to be this week's drive.
Add `when: () => roadTown() === 'wallawalla'` (and so on) to the town-named events in ROAD_EVENTS in js/events.js. EVENT_PLACE already lists their towns, so a helper can build the checks from that.
Valley-wide events (flat tire, a stranded driver, a wheat truck) still fire anywhere.
Balance: neutral. The same number of road events, but they make sense.

### i42-a06 Carpool savings show up on every far job's gas (S, 🔴)
When you carpool to your Walla Walla job, the Jobs board shows Kennewick retail at $78/wk gas. The real cost is $156, because a new job starts without a carpool. `commuteGasFactor(j)` checks S.carpool for any job 20+ miles away. Only your current job should get the carpool half.
Fix in js/state.js: `commuteGasFactor` halves only when `j.id === S.carpoolJob`. Take-home in `takeHome` and job rows in js/ui.js then fix themselves.
Add a 'carpool possible' hint on rows 20+ miles away if your community is 30+.
Balance: stops a misleading ▲ that pulls carpoolers toward far jobs that pay less.

### i42-a07 The region map's town card shows the gas you really pay (S, 🟠)
Tapping Walla Walla while carpooling says '~$53/wk gas', but you pay $26. It never says what a trip there costs ($11). The card now shows 'Your commute: $26/wk (carpool, 2 remote days)' for your work town, and 'A trip here: about $11 gas' for every town.
js/maps.js `regionDetail`: use `commuteCost(miles, car, job())` for the work town and `tripGas(k)` for the trip line.
Other towns show the solo commute so you can compare jobs.
Balance: display only.

### i42-a08 A trip's free gas changes when your job changes (S, 🟡)
Plan a Kennewick trip ($32 gas), get hired in Kennewick the same week, and the trip charges $0. Plan a 'no extra gas' trip to your work town, quit, and it now costs gas with no warning. When the job changes and a trip is planned, a toast says what changed: 'Your Kennewick trip now costs about $32 in gas.'
Hook into `apply` and quitting in js/ui.js. Compare `tripGas` before and after and toast if it differs.
Rare, but the trip sheet promises a price and the week strip should keep it.
Balance: neutral.

### i42-a09 Road events follow the miles you drive (M, 🟠)
A 68-mile Richland commute got about 7 road events in two years, the same as a 21-mile Walla Walla drive. An 11-mile Dayton trip gets full road odds even though an 11-mile Dayton commute gets none. Road odds now scale with this week's miles: remote days and riding in a carpool lower them, and a long trip raises them.
js/events.js `eventOdds`: road odds = 8% × clamp(weekMiles / 200, 0.3, 1.5), where weekMiles counts commute drive days (carpool riders count half) plus trip miles.
The 'Deer on Highway 12' and 'Speeding ticket' style events then land more on the long drivers.
Balance: long commutes feel riskier and remote days count for something. Check the sim's commuter and roadie medians stay at 70+.

### i42-a10 Stop cards say how big the lift is (S, 🟠)
On the trip sheet a $15 car wash (about +0.6 happiness) and a $55 arena show (+1.4) both just say '▲ happiness'. Show one, two or three dots for the size of the lift, so you can weigh a $5 picnic against a $55 show.
js/features.js `tripSheet`: dots from the sum of `s.fx` × TRIP_FX, after the repeat, partner and season boosts. The same dots go in the running total line.
Plain words for screen readers: 'small lift', 'good lift', 'big lift'.
Balance: none. It helps careful players spend well, which is the point.

### i42-a11 The stock-up run says what it saves (S, 🟡)
'Free' hides the real deal: about $100 off groceries over 6 weeks, worth the $11 drive to Walla Walla and still worth $32 to Kennewick. The stop now says 'Saves about $100 over 6 weeks', the trip chip shows '🛒 stocked: 4 weeks left', and planning another run while stocked warns you.
js/features.js: work the saving out from GROCERY_SHARE × STOCK_OFF × W × STOCK_WEEKS, using cost() and the cook skill.
The Last week detail already says 'Food & utilities (stocked up)'. Add the amount saved.
Balance: none.

### i42-a12 Stops you went to lately say so (S, 🟠)
The 'again so soon: half as fun' rule is hidden. Stop buttons now show 'Last here 2 weeks ago: half the fun' in the small line, and the stop drops to the bottom of its group.
js/features.js `tripSheet`: read `S.stopLast`, plus the repeat streak if i42-a03 ships.
Teaches players to move around the region instead of repeating one trip.
Balance: none on its own. It makes the repeat rule fair because you can see it.

### i42-a13 A trip receipt in the week strip (S, 🟠)
After a trip week the strip just says 'Happiness ▲3', with nothing about the trip. Add a 🚗 line: 'Walla Walla: −$127 · 😊 +2.2 · groceries stocked'. Tap it to see each stop's cost and what it did.
`tripWeek` already builds the effects and the list of stops done. Keep them on S.last and show them in the Last week sheet in js/ui.js.
Also say when a stop was skipped (out of season, under 21) instead of dropping it silently.
Balance: none.

### i42-a14 Winter stops so Pasco isn't a one-taco town (M, 🟠)
From November to March, Pasco has one fun stop (taquerias) and Dayton has two all year. Add winter-only stops: an indoor ice rink in Pasco, a planetarium night in Richland, and a soup-and-pie lunch at a Dayton church hall (stand-in names).
New STOPS entries in js/features.js with `when:inSeason(10,11,0,1,2)`. Their costs and effects should match the summer stops they stand in for.
Gives commuters to Pasco and Richland something to do on the way home in winter.
Balance: same size as existing stops, and they fall under the repeat and top-out rules (i42-a03, i42-a04).

### i42-a15 The carpool follows the town, not the job (S, 🟡)
Moving from corrections officer to registered nurse, both in Walla Walla, ends your carpool and you have to join again. If the new job is in the same town, the carpool carries over. A new town still ends it.
js/state.js `syncCarpool`: compare the city of `S.carpoolJob` with the new job's city instead of the job id.
The 'Your carpool ended' log line then only shows when it should.
Balance: tiny. Carpools still need community 30+.

### i42-a16 Dayton commuters can carpool too (S, 🟠)
Dayton is 11 miles away, under the 20-mile carpool rule, so a Dayton commuter pays $28/wk in the pickup with no way to share. Dayton jobs lose to Waitsburg jobs at the same schooling (nursing assistant $639 take-home vs grain elevator $745), and a Dayton life scored 71 vs 80. Let 10+ mile commutes carpool and save a third of the gas.
js/state.js `canCarpool` and `commuteGasFactor`: 10–19 miles saves 1/3, 20+ saves 1/2. The carpool card in js/ui.js shows for 10+ miles.
The 'carpool buddy is always late' event can then fire for Dayton riders.
Balance: a small lift for a town no bot picks. Careless play doesn't carpool.

### i42-a17 A Tri-Cities vanpool (M, 🟠)
In the 1998 pickup, a Tri-Cities commute eats about 30% of take-home: mall retail clears $354 after gas, less than a Waitsburg farm hand. Add a stand-in regional vanpool for 50+ mile jobs. It's a flat monthly fare (about 35% of solo gas) with no community needed, but you can't stop for errands in the work town and overtime weeks have to fit the van's schedule.
A third option on the carpool card in js/ui.js. S.vanpool goes into `commuteGasFactor`. Turn off `tripIsCommute` while you're on the van.
Riding the van counts as reading time: the audiobook event's class-week choice fires a bit more.
Balance: helps low-paid long commutes, which are a trap now. You give up the free work-town stops (see i42-a02), so good players have a real choice.

### i42-a18 Gas as a share of pay on far job rows (S, 🟡)
A job row shows gas per week but not how big that is next to the pay. When gas is more than 20% of take-home, the row adds '⛽ gas eats 31% of this check' in amber, and suggests a carpool or the sedan.
js/ui.js `jobRow`: divide the gas by the take-home.
Uses the real car and carpool (after the i42-a06 fix).
Balance: display only. It helps new players skip trap jobs.

### i42-a19 A crash pad night in the Tri-Cities (M, 🟡)
Commuters going 50+ miles can rent a room near work for two nights a week (about $260 a month). It cuts the gas and the drive's happiness drag by 40%, but you're away from town, so community drifts down and Out and about drops to one visit.
A toggle on the carpool card. It goes into the gas line and the commute drag in js/turn.js, plus a −0.3 community drift. The region map truck parks at the work town.
Events: a roommate who snores, a quiet motel diner regular.
Balance: you trade community for happiness, so it can't stack with carpool (pick one).

### i42-a20 Ask for another remote day (M, 🟠)
Office jobs come with 2 remote days, and the 'remote-day trial' event almost never fires. After 6 months in the job you can ask for a third. The odds go up with time on the job, and a yes means 40% less commute gas and drag, but raises come a little slower.
A button on the job card in js/ui.js for jobs with `remote`. It sets S.remoteExtra, which goes into `driveDays`. The boss answers in a short sheet, and a no means wait 6 months to ask again.
Remote days show on the region map card (see i42-a27).
Balance: slower raises keep it a trade, not a free win. Only office jobs, which need schooling.

### i42-a21 Know the region counts towns you've worked in (S, 🟡)
The 'Know the region' badge only counts trips, so a year of driving to Richland doesn't stamp Richland. After 8 weeks working in a town, it counts as known.
In js/features.js, `weekTick` or `tripWeek` sets `S.towns[job().city]` once `S.jobMonths >= 2`.
The badge text says 'Take a trip to or work in all five towns.'
Balance: one badge, worth 2 points only if it was pinned as a goal before you earned it.

### i42-a22 A trip away uses one Out and about visit (S, 🟠)
Trips stack on top of everything else: the focus, two Out and about visits and the trip all in one week. A trip away from your work town now uses one of the week's two visits, which makes 'go to the city or stay in town' a real choice.
js/outabout.js visit count: subtract 1 when `S.trip && !tripIsCommute(S.trip.city)`. The Out and about card says 'Trip this week: 1 visit left'.
Work-town errand trips don't use a visit.
Balance: cuts down the stacking that let weekly trips max out happiness. Careful players lose little.

### i42-a23 Bring someone along (M, 🟡)
On a trip you can invite a neighbor or friend (community 40+). They split the gas, and fun stops give a little community as well as happiness. Some weeks they ask to add their own stop, like a hardware run or a hospital visit.
A 'Bring someone' toggle on the trip sheet in js/features.js. Names come from the townsfolk list. It adds +0.3 community per fun stop and halves the trip gas.
Can't stack with the partner's 'for two' boost (pick partner or friend).
Balance: community from trips only up to about 60. After that, the friend stops adding community.

### i42-a24 An errand list that picks the town (M, 🟠)
Needs pile up quietly: oil due, a dentist checkup due, groceries running low, winter tires in October. The trip chip shows a small list ('3 errands') and the picker marks the town that covers most of them: 'Walla Walla: oil, dentist, stock-up'.
A `tripNeeds()` helper in js/features.js reads S.svc, S.dentist, S.stockUntil and S.tires. `tripPicker` sorts towns by how many needs they cover.
Turns trips from shopping for fun into planning, which is what the stops were built for.
Balance: helps good players keep up car care and health. Careless play ignores it.

### i42-a25 Your planned trip on the region map (S, 🟠)
Planning a trip doesn't show on the map: only the commute route is drawn. A planned trip draws its route in a second color, with the stop icons next to the town pin and a small 'gas $32' tag. Tapping the tag opens the trip.
js/maps.js `regionSVG`: reuse `commuteRoute(S.trip.city)` with a different stroke, and put the `stopById` icons in a row beside the pin.
After End Week the truck drives the trip route instead of the commute that week.
Balance: display only.

### i42-a26 Town pins show what's in season (S, 🟡)
Ball games, picnics and markets come and go with the seasons, but the map never shows it. When a seasonal stop opens this month, a small icon sits on the town pin (⚾ Pasco June–September, 🥕 Walla Walla May–October), and it's gone when the season ends.
js/maps.js: for each town, the first `townStops(k)` with `when` that's open now. Draw it like `evBadge`, but with a light green ring.
Gives the region map a reason to be checked each month.
Balance: none.

### i42-a27 The town card lists its stops, not just a count (S, 🟠)
The region map card says 'Plan a trip here (9 places to go)' and nothing about what they are. List them in one compact line per kind, with cost, and grey out the ones out of season or recently visited. Tapping one opens the trip sheet with it already picked.
js/maps.js `regionDetail`: build the list from `townStops(k)` and `stopBlocked`. `TRIPTO(k, id)` passes in the first pick.
Puts the stops above the job rows, since that's what you open the card for.
Balance: none.

### i42-a28 The truck shows your carpool and remote days (S, 🟡)
The commute truck on the region map looks the same driving alone, carpooling or working from home 2 days a week. Show riders next to the 🛻 when you carpool, and a '🏠 2 days home' tag on the route for remote jobs.
js/maps.js `regionSVG`: add icons next to the animated truck. The route is dashed thinner on remote weeks.
Makes the choices on the Home carpool card show up on the map.
Balance: none.

### i42-a29 This week's gas price on the region map (S, 🟡)
Gas on the map is worked out from a price you never see. A small '⛽ $4.12 a gallon' tag in a corner of the map, with an arrow when it went up since last month, explains why trips and commutes cost more over the years.
js/maps.js `regionSVG`: cost(GAS) next to the 'N ↑' label. Keep last month's price on S to show the arrow.
Works with gas-shock ideas if they ship.
Balance: none.

### i42-a30 Sim bots that test trip exploits (S, 🔴)
sim.test.mjs has a 'tripper' and a 'roadie', but no bot that repeats the same free stop. Add an 'idle tripper' (rests every week and does the Dayton depot and café every week) that must stay at or under 50, and a 'work-town tripper' that must stay within 5 points of the same commuter without trips.
Two new STRATEGIES in tests/sim.test.mjs with CEILING checks. This playtest saw 54 and 97 (vs 44 and 84).
Keeps i42-a01 to i42-a04 from coming back.
Balance: this is the guard.

## Ideas 42: Who you are

Ideas for letting players shape who their character is (traits with real trade-offs, interests, a motto, and how the town sees you), built so no trait pair is a best build.

### i42-b01 Early bird: first in, first tired (S, 🔴)
Early bird is a trait: Work extra hours pays a bit more (+5% on top) and the morning commute has fewer deer and ice events, but Rest gives 1 less happiness and late events like the bar trivia night cost more health.
Touches: Trait data in state.js TRAITS; payMult and fx tweaks in turn.js; event weights in events.js.
Balance: The bonus only lands on work weeks; the rest penalty always applies, so an idle life gets the cost, not the gain.

### i42-b02 Homebody: home is the best week (S, 🟠)
Homebody makes Rest give +1 happiness and Cook skill grow faster, but Out and About trips and Show up for town give a little less happiness and Get outside costs a bit more effort.
Touches: TRAITS in state.js; focus fx in turn.js; trip happiness in outabout.js.
Balance: Rest is already the idle pick, so Homebody's gain is capped at +1 and a slower community fade is not included. Idle stays under 50.

### i42-b03 Handy: fix it, but you can't leave it alone (S, 🟠)
Handy starts the Handy skill at 4 points and makes home repair events cheaper, but repair events come up a little more often because you keep finding projects, and each one costs an evening.
Touches: TRAITS; skills in features.js; repair events in events.js.
Balance: Nets out near zero on money in the sim; it changes which events you see, not how rich you get.

### i42-b04 Chatty: everybody knows you, everybody talks (S, 🟠)
Chatty grows community faster on town weeks and helps the People skill, but gossip events about you come up more and a slip of the tongue can cost a little community.
Touches: TRAITS; People skill in features.js; two gossip events in events.js.
Balance: The community gain needs Show up for town weeks; the gossip risk always applies. Careless play doesn't gain.

### i42-b05 Frugal: tight with a dollar (S, 🔴)
Frugal trims food and fun costs by 5% and makes debt warnings show earlier, but treats and trips give less happiness and you sometimes skip a gift and feel it later.
Touches: TRAITS; costs in turn.js; trip happiness in outabout.js.
Balance: Money gain is about the size of the happiness loss in score points; the sim keeps it within 2 points of no trait.

### i42-b06 A trait has two sides, shown on one line (S, 🔴)
Every trait is written as one up and one down with the same size, like 'Early bird: +5% on work weeks / −1 happiness on rest weeks'. The pick screen shows both, never just the good part.
Touches: Pick screen in ui.js renderTitle/new-life flow; TRAITS text fields.
Balance: Makes trade-offs visible so players pick for style, not for a hidden best.

### i42-b07 Traits come in pairs that pull apart (M, 🔴)
Traits sit in three groups (pace, people, money), and you pick two from different groups. Opposites like Homebody and Restless, Frugal and Generous, can't both be picked.
Touches: TRAITS group field in state.js; pick rules in ui.js.
Balance: Stops stacking two traits that push the same stat, the easiest way to build a 'best build'.

### i42-b08 The balance sim plays every trait pair (M, 🔴)
The balance sim runs each legal trait pair with careless, idle and good play. It fails if any pair's median is more than 3 points above the no-trait median, or if any pair lifts idle past 50.
Touches: tools/ balance sim script; tests.
Balance: This is the guard that keeps traits a style choice. Any pair that wins gets its up trimmed.

### i42-b09 Traits only pay when you lean into them (S, 🟠)
A trait's upside only fires on weeks you act on it (Early bird on work weeks, Chatty on town weeks), while its downside is steady. Picking a trait and ignoring it is a small net loss.
Touches: Trait checks in turn.js weekly loop.
Balance: Careless and idle play can't farm traits; good play that fits the trait breaks about even plus a bit of fun.

### i42-b10 Pick your interests: two things you care about (M, 🔴)
At the start pick two interests: fishing, music, history, sports, gardening, cars, books or food. Each opens its own small events and Journal lines, like the Touchet trout opener or the history society's walk.
Touches: INTERESTS in state.js; tagged events in events.js; new-life flow in ui.js.
Balance: Interests open content, not points: the events they unlock have the same mix of good and bad outcomes as any other.

### i42-b11 Interest events: the history buff's walk (M, 🟠)
With History as an interest, a few yearly events open: the old Coppei schoolhouse visit, a cemetery cleanup, the museum needs a volunteer. Each is a normal two-choice event with small, mixed results.
Touches: events.js with an 'interest' field; event filter in events.js.
Balance: Same size as other events; they replace a random event rather than adding one, so the yearly event count stays the same.

### i42-b12 Interest events: the gearhead at the car show (S, 🟡)
With Cars as an interest, the Days car show, a swap meet in Walla Walla and a neighbor's barn find become events. Mechanic skill grows a bit faster from them.
Touches: events.js; skills in features.js.
Balance: Replaces random events, no extra money. The swap meet can cost as easily as it pays.

### i42-b13 Interests can be picked up later (S, 🟠)
Once a year you can add an interest you've been living (ten Get outside weeks makes 'fishing' offered), up to three. You can also let one go.
Touches: Interest tracker in turn.js; yearly prompt on birthday in events.js.
Balance: Interests come from habits you already played, so there's nothing to grind.

### i42-b14 Your motto, picked or written at the start (S, 🔴)
At the start pick a motto from a short list ('Family first', 'Work hard, play harder', 'Leave it better', 'Take it easy', 'See the world') or type your own. It shows on the character card and the end screen.
Touches: S.motto in state.js; new-life flow in ui.js; end screen in features.js.
Balance: Flavor only. A typed motto never touches the score.

### i42-b15 Did you live your motto? (M, 🟠)
Picked mottos each have a plain test (Family first: most weeks with family at home and no work-extra streaks over 8). The end screen says 'You lived it', 'Mostly' or 'Not really', with one line why.
Touches: MOTTOS checks in features.js end screen.
Balance: Shown as words, not points, so it can't be gamed and doesn't overlap the aim score.

### i42-b16 The motto speaks up when you drift (S, 🟡)
If you go three months against your motto, a gentle Journal line says so: 'Family first, but you worked every weekend since March.' Once a season at most.
Touches: turn.js weekly check; log in state.js.
Balance: A nudge, not a penalty. Ignoring it costs nothing.

### i42-b17 How you see yourself vs how the town sees you (M, 🔴)
The character card shows two short lines: your traits as you picked them, and what the town thinks from what you've done ('Says homebody, shows up to every game'). The gap is just a fun read.
Touches: Character card in ui.js renderLife; habit counts from S.recentF and focus history.
Balance: Pure text from play history; no score effect, so there's no reason to chase a match.

### i42-b18 When the gap gets big, you can change (S, 🟠)
If your play has been the opposite of a trait for a year (picked Homebody but out every week), the game offers to swap it for the one you're living. Say yes or keep it.
Touches: Yearly check in turn.js; swap sheet in ui.js.
Balance: Swaps happen only toward what you already do, so it never hands out a free upgrade.

### i42-b19 Traits soften and grow with age (M, 🟠)
At 40 and 60 each trait can shift a step: Restless can mellow to Settled, Chatty can turn Storyteller. A one-line sheet asks, with no right answer.
Touches: Birthday hook in events.js; TRAITS 'later' field in state.js.
Balance: Each later trait has the same up/down size as the one it replaces; the sim covers them.

### i42-b20 Life changes you: a trait earned from a big moment (M, 🟠)
Some big events can give a new trait offer: a flood year can make you Prepared, a long layoff can make you Frugal, raising kids can make you Patient. You can say no.
Touches: Story events in events.js; trait offers in ui.js.
Balance: Earned traits still have a down side and you can hold at most three, so they don't stack up into a power build.

### i42-b21 Character card on the Life tab (M, 🔴)
A new card at the top of Life: your name, age, background, two traits with their up and down, interests, motto, and the 'town says' line. Tap it for the full sheet.
Touches: renderLife in ui.js; new characterCard() in features.js; styles in index.html.
Balance: Display only.

### i42-b22 The card keeps a short life line (S, 🟡)
The character card's sheet lists when each trait or interest changed and why ('Age 34: became Frugal after the mill layoff').
Touches: Trait history array in state.js; sheet in ui.js.
Balance: Display only; reads from saved history.

### i42-b23 Traits and interests in the Tattler (S, 🟡)
The town paper now and then mentions you by your traits or interests: 'Early riser spotted fishing the Touchet at dawn, again.'
Touches: Tattler text in events.js.
Balance: Text only.

### i42-b24 Pick traits by tapping a few questions (S, 🟠)
Instead of a list, new players can answer three quick questions ('Saturday morning: sleep in or up at five?') and the game suggests two traits, which you can change.
Touches: New-life flow in ui.js; question table in state.js.
Balance: Same traits either way; it just helps first-time players.

### i42-b25 Random traits for a surprise life (S, 🟡)
A 'Surprise me' button rolls two traits and two interests. The weekly challenge uses rolled traits so everyone plays the same person.
Touches: ui.js new-life; weekly seed in features.js.
Balance: Rolled pairs are all legal ones the sim has passed.

### i42-b26 No traits is a fine choice (S, 🟠)
You can skip traits; you play the plain version. Badges and best scores keep a 'with traits' and 'plain' mark only for interest, not separate boards.
Touches: ui.js; save slot line in state.js.
Balance: Since no pair beats plain by more than 3, skipping costs nothing.

### i42-b27 People react to your traits (M, 🟠)
A few NPC lines change by trait: the barista teases the Early bird, the neighbor asks the Handy one for help, the old-timers like the Chatty one's stories. Each NPC event gets one trait-flavored line.
Touches: events.js event text; NPC text tables.
Balance: Text plus at most a ±1 community nudge, same size for every trait.

### i42-b28 A partner whose traits fit or rub (M, 🟡)
A partner gets one trait. Matching ones add a little happiness on shared weeks; clashing ones (Homebody with Restless) bring a small 'what to do this weekend' event now and then that you can talk through.
Touches: Partner state in events.js; small event in events.js.
Balance: Fit and clash end up even over a life in the sim; clash events have good outcomes too.

### i42-b29 Kids pick up one of your traits (S, 🟡)
When a kid turns 12, the Journal says which of your traits they picked up, or that they're nothing like you. Shown on the household line.
Touches: Kids in state.js; birthday hook in events.js; renderLife.
Balance: Text only.

### i42-b30 The heir keeps the motto, not the traits (S, 🟡)
In a family legacy game, the next generation can keep your motto but picks their own traits and interests, so a family has a saying, not a build.
Touches: Legacy flow (gen) in features.js; new-life flow in ui.js.
Balance: Stops a best build from passing down forever.

### i42-b31 End screen: who you were (S, 🟠)
The end screen adds a short 'who you were' block: traits at the end, interests, motto and whether you lived it, and the town's last word on you.
Touches: End screen in features.js; share image text.
Balance: Display only; good for the share card.

### i42-b32 Trait help page in plain words (S, 🟡)
Help gets a Traits section listing every trait's up and down, how interests open events, and a note that no trait pair scores much better than another.
Touches: help.js.
Balance: Telling players there's no best build keeps them picking for fun.
