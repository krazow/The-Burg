# Ideas round 47

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 47: Bundles and release plans 3

A fifth set of build bundles covering rounds 40–46 (none already in a round 19, 25, 30 or 39 bundle), with bug-fix, accessibility and performance sweeps, and two release plans that continue v0.6–v0.7 into v0.8 and v0.9.

### i47-a01 Bundle: Bug-fix sweep: kids, trips and commutes (M, 🔴)
Fix the newest 🔴 bugs from the trip and parent playtests: trips in overtime and hustle weeks cost time, errands in your work town stop counting as fun, the same stop every week fades, Dayton trips stop drawing Walla Walla and Tri-Cities road events, carpool savings reach every far job's gas, a 17-year-old needs no commute childcare, every kid gets an 18th send-off, and 'your oldest' means one kid.
Covers: i42-a01, i42-a02, i42-a03, i42-a05, i42-a06, i46-a01, i46-a02, i46-a03.
One design: One pass over trip and household code: trip time reads the week's real hours, road events filter by the towns on the route, gas goes through one gasCost() that applies carpool, and kid checks read one kidAge() and one oldestKid() helper.
Files: outabout.js (trips, stops, gas, carpool), events.js (road event filter, send-off), turn.js (childcare, week hours), state.js (kid helpers), tests/rules.test.mjs.
Balance: Pure fixes; the trip exploits careless bots found close, and good play loses nothing.

### i47-a02 Bundle: Bug-fix sweep: screen readers, focus and zoom (M, 🔴)
Fix the 🔴 accessibility faults: the week strip reads its numbers, event text is read when the sheet opens, the result sheet is named for its event, tabbed-to buttons scroll clear of the bottom bars, Tab stays inside the tutorial bubble, control borders reach 3:1, the week strip stops covering End Week at 200% zoom, and the header stops sticking on short screens.
Covers: i43-a01, i43-a02, i43-a03, i43-a04, i43-a05, i43-a08, i43-a19, i43-a20.
One design: One sheet helper sets aria-labelledby and aria-describedby from the event title and text; one focus-trap helper serves sheets and the tutorial; a scroll-padding rule and a short-screen media query fix the overlap.
Files: ui.js (sheets, week strip, header), boot.js (tutorial focus), index.html (CSS), tests/screens.test.mjs.
Balance: No game change; it makes the game playable by keyboard and screen reader.

### i47-a03 Bundle: Performance sweep: a fast launch and a small save (M, 🔴)
Make the game open fast and save small: save only the life you're playing, stop re-downloading the game each launch, fetch each file once on first visit, minify scripts in the release kit, paint the title before the big event tables, read a tiny slot list on the title screen, cache index.html once, and write a 7 KB backup.
Covers: i43-b01, i43-b02, i43-b05, i43-b06, i43-b08, i43-b14, i43-b22, i43-b23.
One design: Saves split into one key per slot plus a slot index; the service worker uses one versioned cache list with no cache-busting query; the release kit adds a minify step; event tables load after first paint.
Files: state.js (save, slots), sw.js (cache list), boot.js (load order), index.html, tools/ (release kit), tests/offline.test.mjs.
Balance: No game change; old saves move over once and the offline test guards it.

### i47-a04 Bundle: Performance sweep: Help, the Journal and End Week (M, 🟠)
Make the heavy screens light: build Help only when it opens and empty it when it closes, load Help and the tutorial on first tap, Journal lines keep their kind and week number instead of text, one End Week remembers a capped amount, switching tabs redraws only the tab, and an event week saves and redraws once.
Covers: i43-b03, i43-b04, i43-b07, i43-b09, i43-b10, i43-b11, i43-b12, i43-b13.
One design: Journal entries become {wk, kind, text-id} records rendered on demand; render() takes a tab name; save and redraw run once at the end of resolve().
Files: help.js (lazy build), ui.js (render by tab, Journal), turn.js (end week, one save), state.js (journal format), tests/smoke.test.mjs.
Balance: No game change; the sim checks that scores match before and after.

### i47-a05 Bundle: Sim checks for trips, traits and event links (M, 🔴)
Grow the test suite to guard the new systems: bots that try trip exploits, a run of every trait pair, a check that event links never pay careless play, a save-size line, a test that fails when a tutorial step is skipped, and the new accessibility checks in the screen test.
Covers: i42-a30, i42-b08, i45-b31, i43-b21, i44-b10, i43-a29.
One design: New bots and checks plug into the existing bot list and CEILINGS table; the sim report adds save size and per-trait medians.
Files: tests/sim.test.mjs, tests/helpers.mjs, tests/flows.test.mjs, tests/screens.test.mjs.
Balance: The guard that keeps careless <= 60, idle <= 50 and good >= 70 true as trips, traits and links land.

### i47-a06 Bundle: Accessibility: names, labels and keys (M, 🟠)
Finish the screen-reader pass: the coach bubble is read once with a name, toasts are announced once, the name box shows the focus ring, stat buttons drop the inner label, game length and mode are named groups, Help's back buttons say where they go, the game behind a sheet is inert, and arrow keys move between map pins.
Covers: i43-a06, i43-a07, i43-a09, i43-a11, i43-a12, i43-a13, i43-a14, i43-a27.
One design: One toast live region, fieldset/legend on the title screen, the inert attribute set by the sheet helper from the sweep, and a roving tabindex on map pins.
Files: ui.js, boot.js, help.js, maps.js, index.html, tests/screens.test.mjs.
Balance: No game change.

### i47-a07 Bundle: Trip rules that add up (M, 🟠)
Make trips a clear, fair choice: trip fun tops out like Rest, a trip's free gas follows your current job, road events scale with miles driven, stop cards say how big the lift is, the stock-up run says what it saves, recent stops say so, a trip uses one Out and about visit, and winter gets its own stops.
Covers: i42-a04, i42-a08, i42-a09, i42-a10, i42-a11, i42-a12, i42-a22, i42-a14.
One design: Stop and trip numbers move into one TRIP tuning block; stop cards read their lift and savings from it, and a lastVisited map drives the fade and the 'went lately' tag.
Files: outabout.js (trips, stops), events.js (road event odds by miles), state.js (tuning), ui.js (stop cards).
Balance: Caps and fades stop the weekly repeat-trip loop that lifted careless scores; good players gain clearer choices, not more points.

### i47-a08 Bundle: Carpools, vanpools and remote days (M, 🟠)
Give far commuters real ways to cut the drive: the carpool follows the town, Dayton commuters can carpool, a Tri-Cities vanpool, gas as a share of pay on far job rows, a crash-pad night in the Tri-Cities, asking for another remote day, and the truck card showing carpool and remote days.
Covers: i42-a15, i42-a16, i42-a17, i42-a18, i42-a19, i42-a20, i42-a28.
One design: One commute table per town holds carpool, vanpool and crash-pad options; the job row and truck card read it.
Files: outabout.js (commute, region jobs), features.js (remote days), ui.js (job rows, truck card), state.js.
Balance: Savings come with costs (fixed hours, lower standing for remote asks), so a far job never beats a near one for free.

### i47-a09 Bundle: A region map that plans the trip (M, 🟡)
Make the region map the place you plan from: the town card shows real gas and lists its stops, the map shows this week's gas price, what's in season and your planned trip, a trip receipt sits in the week strip, an errand list picks the town, and Know the region counts towns you've worked in.
Covers: i42-a07, i42-a13, i42-a21, i42-a24, i42-a25, i42-a26, i42-a27, i42-a29.
One design: Town cards read from the same TRIP block and gasCost() as the trip sheet; the planned trip is one field in state shown as a dashed route.
Files: maps.js (region map, town cards), outabout.js (errand list), ui.js (week strip), features.js (Know the region).
Balance: Display only, plus an errand helper that saves taps, not money.

### i47-a10 Bundle: A shorter tutorial that shows how you win (M, 🔴)
Cut the tutorial from 26 steps to 14: start on Home with 'No paycheck', show one Out and about visit that doesn't use the week, plan one Walla Walla trip, tap 'Life Score so far', show an event's kind and 📍 place, let players skip and resume, and name chapters instead of step numbers.
Covers: i44-b01, i44-b02, i44-b03, i44-b04, i44-b05, i44-b06, i44-b08, i44-b09.
One design: Tutorial steps move into one table with chapter names; a saved step index lets the player pick up later.
Files: boot.js (tutorial), ui.js (coach bubble), help.js (links), tests/flows.test.mjs.
Balance: Teaching how the score works helps good players; nothing gives points.

### i47-a11 Bundle: Tips at the right moment (S, 🟠)
Teach by doing: every tip card links to its Help section, the last tutorial card links four sections, tips appear the first week you could carpool, when an oil change is overdue and the first time in debt, the 401(k) becomes a first-paycheck tip, road and work event results say why they happened, and at most one tip shows a week with a Tips on/off setting.
Covers: i44-b07, i44-b11, i44-b12, i44-b13, i44-b14, i44-b15, i44-b16, i44-b33.
One design: One TIPS table with a trigger check, a seen flag and a Help anchor; End Week shows the first due tip.
Files: ui.js (tip cards, settings), turn.js (tip triggers), help.js (anchors), state.js.
Balance: Tips explain costs, they don't cut them.

### i47-a12 Bundle: Help you can search and skim (M, 🔴)
Make Help fast to use: a search box that knows everyday words, ? opens Help at the part you're on, sections fold up with a one-line summary and a bold 'In short' line, big tables hide behind 'Show all', and sections are ordered by when you need them with Score second.
Covers: i44-b17, i44-b18, i44-b19, i44-b20, i44-b21, i44-b22, i44-b23.
One design: Help sections become data {id, title, short, body, words}; search and folding read the same list, and each screen names its Help id.
Files: help.js, ui.js (? button), index.html (CSS), tests/screens.test.mjs.
Balance: No game change.

### i47-a13 Bundle: Traits with two sides (M, 🔴)
Add five traits that each help and hurt: Early bird, Homebody, Handy, Chatty and Frugal, each shown with both sides on one line, picked in pairs that pull apart, and paying only when you lean into them.
Covers: i42-b01, i42-b02, i42-b03, i42-b04, i42-b05, i42-b06, i42-b07, i42-b09.
One design: One TRAITS table with up/down effects and a lean-in check; turn.js applies them in one place.
Files: state.js (traits), turn.js (effects), ui.js (title picker), events.js (trait checks).
Balance: Every trait costs something, and payoffs need matching choices, so no trait lifts idle or careless play; the sim plays every pair.

### i47-a14 Bundle: Interests and a motto (M, 🟠)
Pick two interests and a motto at the start: interest events like the history buff's walk and the gearhead's car show, interests picked up later, a motto you choose or write, a check at the end on whether you lived it, a nudge when you drift, and an heir who keeps the motto.
Covers: i42-b10, i42-b11, i42-b12, i42-b13, i42-b14, i42-b15, i42-b16, i42-b30.
One design: Interests tag events in events.js; the motto maps to one or two tracked choices that the end screen checks.
Files: state.js, events.js (interest tags), features.js (motto check, heir), ui.js (title, end screen).
Balance: Interest events are flavor-weighted, not richer; the motto check is a line, not points.

### i47-a15 Bundle: The character card (M, 🟠)
Show who you are: a character card on the Life tab with a short life line, how you see yourself next to how the town sees you, picking traits by a few questions or at random, no traits as a fine choice, a who-you-were line at the end, and a plain help page.
Covers: i42-b21, i42-b22, i42-b17, i42-b24, i42-b25, i42-b26, i42-b31, i42-b32.
One design: The card reads traits, interests, motto and standing; the town's view is worked out from the values profile already tracked.
Files: ui.js (Life tab, end screen), boot.js (title questions), help.js, state.js.
Balance: Display and start options only; no score effect.

### i47-a16 Bundle: Highway 12 road events (S, 🟡)
Eight short road events for the drive: road spray and an empty washer tank, a hitchhiker at the Lowden turnoff, black ice in the ditch, the beater's check-engine light, low fuel past Touchet, a radio call-in contest, a garage-sale sign, and hay bales off a pickup.
Covers: i40-a01, i40-a02, i40-a03, i40-a04, i40-a05, i40-a06, i40-a07, i40-a08.
One design: Rows in the road event table tagged with season and car condition, so black ice is winter only and the check-engine light needs an old car.
Files: events.js (road events), turn.js (car wear).
Balance: Most cost a little time or money; careful car care and slower winter driving cut the odds, rewarding good play.

### i47-a17 Bundle: Shifts that cost you later (M, 🟠)
Make hard shifts matter over time: the holiday shift, night shifts that wreck sleep, called in on your day off, frost watch in the vineyard, winging a safety inspection, toughing it out week after week, and working sick that spreads.
Covers: i40-b11, i40-b14, i40-b22, i40-b05, i45-b13, i45-b14, i45-b15.
One design: A small strain counter in state that these events add to and rest pays down; past a line it triggers an injury or illness event.
Files: events.js (work events), turn.js (strain), state.js.
Balance: Saying yes to every shift pays now and costs later, so grinding without rest scores lower.

### i47-a18 Bundle: Work events that test your job (M, 🔴)
Give each kind of job a real busy day: a storm-claim rush after hail, a grant deadline at the lab, a shoplifter at your register, the line speeding up for a big order, the school flu-shot clinic, a student melting down in the hall, a grease fire on the flat-top, and a customer's car coming back.
Covers: i40-b06, i40-b08, i40-b18, i40-b04, i40-b12, i40-b13, i40-b16, i40-b23.
One design: Rows in the work event table keyed by job kind (Field, Office, Care, Service, Trades), each with a skill or standing check.
Files: events.js (work events), features.js (job standing).
Balance: Good outcomes need skills or rest built by good play; careless choices cost standing.

### i47-a19 Bundle: Faces behind the counter (S, 🔴)
Put names on Waitsburg's counters: a morning barista who learns your order, a stylist who hears the news first, two sisters at the junk shop who argue, a grocery clerk thirty years in, guests upstairs at the old hotel, brisket gone by one, the same restaurant table every anniversary, and knowing the regulars when you're the barista.
Covers: i41-a01, i41-a10, i41-a15, i41-a23, i41-a26, i41-a27, i41-a07, i41-b05.
One design: A small TOWNSFOLK table keyed to Out and about places, each with a visits count that unlocks their lines; stand-in business names only.
Files: outabout.js (places, visit text), state.js (visits), events.js.
Balance: Flavor and small community lifts capped like other visits.

### i47-a20 Bundle: Apprentice to your own crew (L, 🟠)
A full trades path: apprentice with the builder, the foreman's Friday punch list, a fall off the ladder, the journeyman card and then your own contractor license, leading a small job, a winter-break build at the woodshop, a drive-time clock that runs out, and your own crew.
Covers: i41-a34, i41-b12, i41-b14, i41-b13, i40-b29, i41-a04, i40-b21.
One design: One ladder table with rungs, hours and test checks, reused by later job ladders.
Files: features.js (job ladders), outabout.js (jobs), events.js, state.js.
Balance: Each rung needs logged weeks and skills, so the top pay comes late and only with steady play.

### i47-a21 Bundle: Event threads: links as data (L, 🔴)
Let events remember each other: one marks table events write and read, links stored as data, threads in the Journal, what the town remembers on the Life tab, the Tattler following up on what you skipped, Bluewood snow chains helping on Highway 12, the levee holding, and a full freezer feeding later events.
Covers: i45-b01, i45-b29, i45-b28, i45-b30, i45-b27, i45-b02, i45-b03, i45-b22.
One design: S.marks holds small flags with a week; event rows gain needs/sets fields, and the Journal groups lines by thread.
Files: state.js (marks), events.js (needs/sets), ui.js (Journal threads, Life tab).
Balance: Links pay back past care, never a skip; the sim check in this round guards it.

### i47-a22 Bundle: People who come back (M, 🟠)
Bring back people you met: the wheat farmer you hauled for, a trooper on Highway 12, the gas-station old-timer over the years, the person from the coffee shop, the food truck around town, the stray, the car dealer, and a retired coworker who knocks doors for you.
Covers: i45-b04, i45-b16, i45-b17, i45-b20, i45-b23, i45-b05, i45-b21, i45-b32.
One design: Each person is a short thread in the marks table with 2–4 events and a cooldown.
Files: events.js, state.js (marks), outabout.js (food truck spots).
Balance: Return visits key off kind or careful past choices; they add story, small lifts at most.

### i47-a23 Bundle: A town crisis engine and your role (L, 🔴)
Add multi-week town crises with phases: pick your role when the town calls, step back when it's too much, square missed shifts with the boss, see the crisis on the map, a Town Book of crises you lived through, longer crises on Hard, and a Help page.
Covers: i44-a01, i44-a02, i44-a21, i44-a20, i44-a22, i44-a03, i44-a28, i44-a31.
One design: A CRISES table with phases and role choices, run by one tick in turn.js; at most one at a time and rare.
Files: turn.js (crisis tick), events.js, maps.js, ui.js (Town Book), help.js, state.js.
Balance: Roles trade time and pay for community; skipping costs a little standing, and the step-back choice keeps it from punishing busy lives.

### i47-a24 Bundle: Crises: fire, ice and high water (L, 🟠)
The first crises for the engine: fire in the wheat on the ridge, an ice storm with five days without power, the levee tested, the Preston Avenue bridge washing out, a ten-day heat dome, a livestock truck rollover on Highway 12, and your own house being the one in trouble.
Covers: i44-a04, i44-a05, i44-a07, i44-a10, i44-a11, i44-a29, i44-a30.
One design: Each is a row in the CRISES table with season, phases and roles; yard and insurance choices change how hard your house is hit.
Files: events.js (crisis rows), turn.js, state.js.
Balance: Prepared players lose less; careless ones pay more, so the average stays fair.

### i47-a25 Bundle: Kids show up in the week (M, 🔴)
Make kids visible week to week: kids leaving home reach the Journal and year in review, a family line on Home, a one-line kid moment in the recap, joy that changes with age, everyday events that notice your kids, grown kids' ages in the household, the happiness ⓘ showing what kids gave, and getting outside as family time.
Covers: i46-a04, i46-a11, i46-a15, i46-a19, i46-a23, i46-a24, i46-a26, i46-a10.
One design: One kidMoment() picks a line by age and week; Home, recap and the ⓘ read the same kid joy number.
Files: turn.js (recap, kid joy), ui.js (Home, household), events.js.
Balance: Shows what kids already give; no new points.

### i47-a26 Bundle: The cost of kids, made plain (M, 🟠)
Show what kids cost before you choose: the Jobs list shows long-commute childcare, 'Have a baby' quotes the monthly cost, tell your partner you're done, a sleepless first year, a home too small, a partner at home halving childcare, the Young parent's Family badge fixed, and Help on how kids work.
Covers: i46-a05, i46-a06, i46-a07, i46-a12, i46-a14, i46-a27, i46-a08, i46-a22.
One design: One childcareCost() feeds the job rows, the baby button and Help.
Files: features.js (jobs, badges), turn.js (childcare, sleep), ui.js, help.js.
Balance: Clear costs help good planners; the sleepless year and small home add real strain.

### i47-a27 Bundle: The Tattler you open (L, 🟠)
Turn the one-line paper into a front page: one story queue for the paper, back issues you can browse, clip stories to the fridge, subscribe or buy at the rack, the year in front pages, the editor who knows your name, and your byline on the front page.
Covers: i46-b01, i46-b02, i46-b04, i46-b06, i46-b07, i46-b31, i46-b20, i46-b21.
One design: One story queue fed by events, marks and town news; an issue is saved as story ids per week, trimmed by the performance work.
Files: outabout.js (tattlerLine), turn.js (issue build), ui.js (paper sheet), state.js.
Balance: Reading is free; a subscription is a small cost and the byline needs real reporter or community work.

### i47-a28 Bundle: The valley ledger (L, 🟠)
A slow land-health number for the valley: water what you planted, trees that grow on the map, a land trust that needs a preserve steward, steelhead coming back in a long game, a stewardship line on the end screen, and Help that explains it without a sermon.
Covers: i45-a01, i45-a02, i45-a03, i45-a28, i45-a33, i45-a31, i45-a32.
One design: One S.ledger number moved by land choices with a long lag; maps.js draws planted trees from it.
Files: state.js, turn.js (ledger tick), maps.js, events.js, ui.js (end screen), help.js.
Balance: The ledger is shown, not scored, so it can't be farmed; it shapes events and the end line.

### i47-a29 Release plan: v0.8 — Fast, clear and easy to learn (L, 🔴)
Make the game quick, readable by everyone and easy to learn: the kids-and-trips and accessibility bug sweeps, both performance sweeps, new sim checks, a shorter tutorial, timely tips and searchable Help, fairer trips and commutes, and traits with two sides shown on a character card, and Highway 12 road events.
Covers: i47-a01, i47-a02, i47-a03, i47-a04, i47-a05, i47-a06, i47-a10, i47-a11, i47-a12, i47-a07, i47-a08, i47-a13, i47-a15, i47-a16.
Order: bug and accessibility sweeps first, then performance and sim checks, then teaching, then trips and traits; run the balance sim before tagging.

### i47-a30 Release plan: v0.9 — A town that remembers (L, 🔴)
Make the town remember you: event threads and people who come back, town crises and the role you play, kids who show up week to week and what they cost, the Tattler front page, the valley ledger, interests and a motto, work that tests you, faces behind the counter, a trades path, and a region map that plans the trip.
Covers: i47-a21, i47-a22, i47-a23, i47-a24, i47-a25, i47-a26, i47-a27, i47-a28, i47-a14, i47-a17, i47-a18, i47-a19, i47-a20, i47-a09.
Order: event threads first (crises, people and the Tattler build on them), then crises, kids, the paper and the rest; run the balance sim before tagging.

## Ideas 47: Holidays and traditions

One holiday or town tradition at a time: a specific moment with choices, a cost, and a way for it to build over the years.

### i47-b01 New Year's Day: first hike of the year, year after year (S, 🟠)
On the first week of January, walk up the hill above the cemetery or along the Touchet levee. Each year in a row adds to a streak shown on Home; a long streak gives a small health and happiness lift, and missing one resets it.

- A dated event in js/events.js (week 1 of January); choices: hike (♥+2, ☺+2), sleep in (no change), drag the family along (needs partner or kids; 🤝+1 with the household).
- S.trad.hike = {streak, best}; streak bonus is +1 ☺ per 5 years, capped at +3.
- Touches js/events.js and the Home card in js/ui.js.
- Balance: costs the week's focus slot only if you pick it; idle play never keeps a streak.

### i47-b02 New Year's Eve: midnight at nine for the little ones (S, 🟡)
With young kids at home you count down at nine o'clock with pots and spoons on the porch. As they grow, the countdown moves later until a teen asks to stay up for the real midnight, then to go out instead.

- One December week-5 event in js/events.js whose text and choices change by the oldest kid's age (under 10, 10–14, 15+).
- Choices: noisemakers at nine (☺+3, −$10), Legion hall dance (−$40, 🤝+2, ☺+2), work a bar shift if your job allows it (+pay, ☺−1).
- Logs a one-line memory each year for the end screen.
- Balance: small numbers; the money choice costs happiness.

### i47-b03 Valentine's: classroom valentines, handmade or a box (S, 🟡)
The school sends home a class list. Make cards at the kitchen table, buy a boxed set, or forget until the night before. Handmade takes your rest time but the kid remembers it.

- February event in js/events.js, only when a kid is 5–11 (S.kids ages).
- Handmade: −$5, ☺+3, counts as rest but not full rest. Boxed: −$12, ☺+1. Forgot: −$8 at the gas station at 9 pm, ☺−1.
- Handmade years add to a 'kitchen table' tally the grown kid mentions later (js/features.js legacy text).
- Balance: cheapest choice is best for happiness, but only if you give up the week's rest.

### i47-b04 Valentine's: carnations to the senior center (S, 🟡)
The Grange sells carnations and asks for drivers to hand one to each resident at the senior center. A small yearly habit that builds slowly into standing with older folks in town.

- February event; −$20 for a dozen and a Saturday morning.
- 🤝+2, ☺+2; after 3 years in a row a resident asks for you by name (one-line follow-up).
- Lives in js/events.js; streak in S.trad.
- Balance: about $10 per community point, inside the usual range.

### i47-b05 St. Patrick's Day: plant peas, the old gardener's rule (S, 🟠)
Old-timers plant peas on St. Patrick's Day no matter the weather. If you have a yard, plant on the day, wait for a warmer week, or skip; a June pea crop follows if the frost doesn't take it.

- March event for homeowners and renters with a yard (S.home); −$6 seed.
- Plant on the day: 70% chance of a June event with fresh peas (☺+3, food −$15 that month); 30% a late frost loses them.
- Waiting: safer, smaller crop. Links to the garden idea (i1-a09) if built.
- Balance: tiny money, a gamble with no big loss.

### i47-b06 St. Patrick's Day: cook at the lodge hall corned beef feed (S, 🟡)
The lodge hall puts on a corned beef and cabbage dinner to fund scholarships. Eat there, wash dishes all evening, or, with Cook skill 2+, run the kitchen.

- March event in js/events.js; stand-in name 'the lodge hall'.
- Eat: −$15, ☺+2, 🤝+1. Dishes: ♥−1, 🤝+3. Run the kitchen (Cook 2+): 🤝+5, ☺+2, practice('cook', 2).
- Running the kitchen three years makes you 'the corned beef cook' in the town talk.
- Balance: the big reward needs a skill you earned by playing.

### i47-b07 Easter: sunrise service on the cemetery hill (S, 🟡)
Before dawn, folks gather on the hill above town for a short service while the sun comes up over the Blues. Go alone, bring the family in the cold, or sleep and make the egg hunt instead.

- April event, Easter week only (uses the right-week holiday dates from i16-a33 if built).
- Go: ♥−1 (cold, early), ☺+3, 🤝+2. Bring the family: kids fuss (☺+1 now) but it adds to S.trad.sunrise. Sleep in: no change.
- Lives in js/events.js.
- Balance: small; no money, just a cost in rest.

### i47-b08 Mother's Day when Mom is gone (S, 🟠)
After your mother passes, Mother's Day changes. Plant her favorite flowers at the cemetery, cook her recipe, or let the day pass quietly. The choice you keep making becomes your way of remembering her.

- Replaces the Mother's Day brunch (i16-a13) once the parent is gone (aging parents, i1-b09).
- Flowers: −$25, ☺+2. Her recipe: practice('cook', 1), ☺+3. Quiet day: ☺−1 the first year, 0 after.
- Same choice 3 years running logs 'You keep Mom's day with ___.'
- Balance: gentle numbers; it's about meaning, not points. Mirrors for Father's Day.

### i47-b09 Father's Day: pass on what Dad taught you (M, 🔴)
Spend Father's Day teaching your kid the thing your dad taught you: changing oil, a dovetail joint, his chili. Each year adds a little; when the kid grows up in Legacy, they start with that skill already practiced.

- June event when a kid is 10+; choose one skill from SKILLS (handy, mechanic, cook) and it sticks as the family skill.
- Each year: you lose the week's rest, the kid gets +3 practice in S.kidSkill; startLegacy() in js/features.js copies it into the heir's S.skills (max level 1).
- Shown on the Family card as 'Taught: Mechanic, 6 Father's Days.'
- Balance: only real, repeated choices pay off; caps at level 1 so the heir still has to play.

### i47-b10 Memorial Day: read the names at the roll call (S, 🟠)
The Legion reads the names of local veterans buried at the cemetery, and they need readers. With community 40+, you're asked to read; it's a quiet honor that grows each year you return.

- May event (Memorial Day week) in js/events.js; asked only with community 40+.
- Read: 🤝+3, ☺+2, ♥−1 (standing in the sun). Attend: 🤝+1. Skip: no change.
- If a family member was a veteran (i7-a23 start), their name is read and the text says so.
- Balance: reward needs earned standing; no money involved. Distinct from cemetery cleanup (i31-a22).

### i47-b11 Memorial weekend camp spot: book it in January (M, 🟠)
The family camps the same spot in the Blues every Memorial weekend, but the campground fills in January. A reminder event lets you book early; forget and you take whatever's left or stay home.

- Two linked events: January (book for −$40, sets S.trad.camp.booked) and late May (the trip).
- Booked: the trip is a full trip week (♥+3, ☺+5, −$80 food and gas). Not booked: a worse site (☺+2) or home (☺−1).
- Years in a row grow the trip text (the kid's first fish, the year it snowed).
- Balance: rewards planning ahead; idle play never books it.

### i47-b12 Graduation: chaperone the all-night safe party (S, 🟡)
Parents of seniors run an all-night party in the school gym so grads stay off the roads. Sign up for the 2–6 am shift, donate, or pass. Your own teen will pretend not to see you.

- June event when a kid is graduating (age 18 that year).
- Chaperone: ♥−2, 🤝+4, ☺+2. Donate: −$50, 🤝+2. Pass: 🤝−1.
- Lives in js/events.js; complements graduation night (i17-a01) rather than replacing it.
- Balance: community for health, the usual trade.

### i47-b13 Fourth of July: the family's spot on the levee (S, 🟡)
Every year you lay a blanket on the same patch of the Touchet levee for the fireworks. Get there early and it's yours; get there late and someone else has it. The spot becomes a family thing.

- July event in js/events.js; choices: go early (♥−1 in the heat, ☺+4), go late (☺+2, 30% lose the spot), skip.
- S.trad.levee counts years held; at 10 years neighbors leave it for you (☺+1 extra).
- Balance: small numbers; it's a streak you keep by choosing it.

### i47-b14 Fourth of July: the dog and the fireworks (S, 🟠)
Fireworks terrify your dog. Buy a snug wrap, stay home with him, or hope for the best. Hope and he may bolt; a lost-dog search follows.

- July event only when S.dog; runs in js/events.js.
- Wrap: −$40 once, then calmer every year. Stay home: miss the show (☺−1) but dog stays calm. Hope: 25% he gets out (search the next week, ☺−4 or −$60 vet if he's hurt).
- Pairs with the family levee spot: you choose one or the other.
- Balance: the cheap choice is a real risk; the one-time buy is a fair fix.

### i47-b15 Labor Day: dog swim on the pool's last day (S, 🟡)
On the last day before the town pool drains for the season, dogs get the water. Bring your dog for a splashy hour; the kids love it more than the dog does.

- September (Labor Day week) event when S.dog; −$5 entry to the pool fund.
- ☺+4, 🤝+1; if the dog is old (i1-a17) the text and choices soften (wade in the shallow end).
- Without a dog: volunteer at the gate (🤝+2).
- Balance: flavor and small happiness.

### i47-b16 First day of school: the porch photo every year (M, 🟠)
Each first day of school you can take a photo of the kids on the same porch step. The pictures line up in an album; at 18 the game shows the whole row in one strip.

- September event when kids are 5–17; one tap: take the photo (☺+2) or rush out the door.
- Each photo stores the kid's age, your home and a short caption in S.album (text only, no images; emoji and words).
- A Family card button opens the strip; the end screen shows each kid's row; moving homes changes the 'porch' line.
- Balance: no stat gain beyond +2; the payoff is the record.

### i47-b17 Halloween: trunk-or-treat in the church lot (S, 🟡)
Kids trick-or-treat from car to car in a parking lot. Decorate your trunk; a pickup bed makes a great haunted hayride, a sedan trunk is tight. Your vehicle changes what you can do.

- October event in js/events.js; options keyed to S.car (truck, sedan, none).
- Go big (truck): −$30, 🤝+3, ☺+3; 20% win 'best trunk' (☺+2). Simple: −$10, 🤝+2. No car: help hand out cider (🤝+1).
- Balance: small; the truck perk is a little reason to own one.

### i47-b18 Halloween: the full-size candy bar house (S, 🟠)
Hand out full-size candy bars and word spreads by next year. Kids flood your porch, costs climb, and you become a known house on the street. Stop and kids notice.

- October event for homeowners; −$40 first year, rising 20% a year as more kids come (cap −$90).
- ☺+3, 🤝+2, and S.trad.fullsize years; after 3 years you're 'the full-size house' in town talk.
- Stopping after 3+ years: 🤝−2 once ('the house went dark').
- Balance: a real, growing yearly cost for a slowly growing reputation.

### i47-b19 Halloween: homemade costume or store-bought (S, 🟡)
Your kid wants to be a combine this year. Build it out of boxes over two evenings, or buy a costume at the big store in Walla Walla. Homemade costumes go in the family stories.

- October event when a kid is 3–12; homemade costs the week's rest (−$10 supplies, ☺+4, practice('handy', 1)).
- Store-bought: −$35, ☺+2, saves the week.
- Homemade costumes log a line used later by Stories at the Thanksgiving table (i6-a26).
- Balance: time versus money, fair both ways.

### i47-b20 Veterans Day: the kid interviews Grandpa (S, 🟠)
Your kid has a school project to interview a veteran. If a grandparent served, set up a visit; the story they record joins the family's saved stories and can come back in a later generation.

- November event when a kid is 10–14 and a living parent or in-law is a veteran (aging parents, i1-b09; veteran start, i7-a23).
- Set up the visit: drive cost + ☺+3, a closeness bump with the elder. Ask a Legion member instead: 🤝+2.
- The story is saved as one line in the family record carried by startLegacy().
- Balance: flavor with small stats; needs a real family setup.

### i47-b21 Thanksgiving: the Turkey Bowl in the yard (S, 🟠)
Every Thanksgiving morning, family and neighbors play touch football in the side yard. Each year you get older the injury risk climbs, until you move from playing to refereeing.

- November event; Play: ♥+1, ☺+4, but an injury chance of (age − 30) × 1% (−$150 urgent care, ♥−4). Referee: ☺+2, no risk.
- Once you referee, the text names who took your spot (grown kid or neighbor).
- Lives in js/events.js; S.trad.turkeybowl years.
- Balance: older players who keep playing pay for it; choosing to step back is the smart, honest move.

### i47-b22 Fall: deer camp with the same crew (M, 🟡)
Each October the same crew heads up to the Blues for opening week of deer season. Keep going and the camp gets its own stories, an old trailer and a new kid along each year. Miss a year and the crew notices.

- October trip-week event; needs a hunting license (i1-a10) or come as camp cook.
- Go: −$120 (tag, gas, food), ♥+2, ☺+4; 35% a deer (food −$100 over two months). Cook for camp: practice('cook', 2).
- After 5 years, invite a kid (12+) and they get a line in their legacy story.
- Balance: costs a full week and real money; the payback is small and chancy.

### i47-b23 Lighting of Main Street: Santa rides the fire engine (M, 🔴)
The first Saturday of December, the town lights Main Street, the choir sings and Santa arrives on the fire engine. Help hang lights from the bucket truck, sing, bring the kids to see Santa, or watch from the diner window.

- December event, week 1, in js/events.js; Waitsburg's own night, separate from Dayton's parade (i32-a26).
- Hang lights (Handy 1+ or 🤝 30+): ♥−1, 🤝+4, practice('handy', 1). Sing: 🤝+2, ☺+3. Kids to Santa: −$10, ☺+4 per kid under 10. Watch: −$6 cocoa, ☺+1.
- Shows lights on the Main Street close-up map (js/maps.js) for the rest of December.
- Balance: no choice is free; the big community choice costs health.

### i47-b24 Christmas: one new ornament every year (M, 🟠)
Each December you pick one ornament that stands for the year: a tiny truck for the new pickup, a dog bone, a little diploma. The box fills up over a life, and your kid inherits it.

- December event offers 3 ornaments chosen from that year's log (new job, home, kid, dog, trip); −$8.
- S.ornaments list (emoji + year) shown on the Family card as a tree.
- startLegacy() in js/features.js carries the box; the heir's first December says 'You hang Mom's 2031 truck first.'
- Balance: +1 ☺ only; it's a memory record, not a stat source.

### i47-b25 Christmas morning: one big gift or a pile (S, 🟠)
Set the kids' Christmas budget: one big thing they asked for, a pile of small ones, or a smaller Christmas and an experience trip in spring. The kids' reactions change as they grow.

- December event with kids at home; three budgets scaled by kids count: −$150, −$250, or −$80 now and a spring outing.
- Big gift: ☺+5, once a year. Pile: ☺+3. Experience: ☺+2 now, ☺+4 in April.
- Teens (13+) value the experience more (+1 extra).
- Balance: spending more doesn't always win; the January card bill (i16-a01) still applies.

### i47-b26 Christmas: twelve nights of porch gifts for a neighbor (S, 🟡)
A family on your street is having a hard winter. Leave a small gift on their porch each night for twelve nights without getting caught. Get caught and it's still kind, just not secret.

- December event; −$60 over the stretch, ♥−1 (late nights).
- 🤝+3, ☺+4; 25% you get caught (🤝+1 more, the neighbor family becomes a named friend if i1-b01 exists).
- Lives in js/events.js; S.trad.porch counts years.
- Balance: community at $20 a point, standard.

### i47-b27 Celebration Days royalty: your teen runs for court (M, 🟠)
Your teen wants to run for the Celebration Days court. It means a riding outfit, photos, appearances at the parade and the races. Back them fully, help on a budget, or talk them out of it.

- April story event when a kid is 15–17; a 3-step chain (sign-up, appearances, crowning at Celebration Days in May).
- Back fully: −$300, 🤝+4, ☺+4; 35% they're crowned (☺+5, 🤝+3). Budget: −$100, same odds minus 10%. Talk them out: ☺−3.
- Uses the chain helpers in js/features.js and the Celebration Days event in js/events.js.
- Balance: real money with a chance, not a sure payoff.

### i47-b28 Christmas club savings at the bank (M, 🔴)
Open an old-fashioned holiday savings club in January: a set amount each week that you can't touch until December. December costs come out of it first, so January's card bill shrinks.

- A Money tab option in js/ui.js; S.holidayClub {weekly, saved}; deposits in js/turn.js each week.
- In December, holiday event costs draw from the club first; a full club gives ☺+2 ('no card bill this year').
- Withdrawing early costs a $10 fee and the bonus.
- Balance: no interest beyond 0.5%; rewards planning, not wealth.

### i47-b29 Traditions ledger: years in a row for every holiday (L, 🔴)
One Family card section lists every tradition you've kept and how many years in a row: 12 years on the levee, 4 Turkey Bowls, 9 ornaments. Hitting 10 on any earns a badge, and the end screen shows the list.

- S.trad as one object of {streak, best, total} keyed by tradition; each tradition event above updates it through one helper, tradTick(key, kept).
- Family card in js/features.js; end screen in features.js; badges in the existing badge list.
- Streak bonuses use one shared rule: +1 ☺ per 5 years, capped at +3 per tradition, and at most 3 traditions count at once.
- Balance: the cap stops tradition stacking from beating good play; idle play keeps none.

### i47-b30 The first holiday with an empty chair (M, 🟠)
The first Thanksgiving or Christmas after losing a partner, parent or old dog gets its own version: set their place, change the tradition, or skip the holiday this year. Each helps grief heal differently.

- A flag S.loss {who, turn} set when a family member or pet dies; the next holiday event swaps text and choices.
- Set their place: ☺+2 later. Do it differently: ☺+1 now, and the tradition gets a new name. Skip: ☺−2 now, no streak loss this once.
- Touches js/events.js and the holiday events from i1-b10.
- Balance: plain, kind language; no choice is punished hard.

### i47-b31 Teen opts out: keep it, change it, or let it go (M, 🟠)
At 14 or so your kid says the Easter sunrise or the porch photo is lame. Insist, make a new version together, or let them skip. How you handle it decides whether they carry the tradition on in Legacy.

- Fires once per tradition with a teen at home; three choices change S.trad[key].heir: kept, changed or dropped.
- Insist: ☺−2 now, 60% the heir keeps it. Change it together: ☺+1, 80% kept (renamed). Let go: 20% kept.
- startLegacy() reads .heir to decide which streaks carry.
- Balance: small numbers; it makes inherited traditions earned.

### i47-b32 Pass the hosting to the next generation (M, 🟡)
Once your grown kids have families of their own, holiday hosting outgrows your kitchen. Keep hosting at a bigger cost, split it, or hand the roaster pan to your kid and come as a guest.

- Holiday event variant when a grown kid has a partner or grandkids (i1-a29).
- Keep hosting: −$150 more, ♥−1, ☺+5. Split it: −$60, ☺+3. Hand it on: ☺+2, 🤝+1, and the heir starts Legacy with 'the roaster pan' (a cheaper first holiday).
- Touches js/events.js and startLegacy() in js/features.js.
- Balance: hosting is a choice with a cost, not a free happiness source late in life.
