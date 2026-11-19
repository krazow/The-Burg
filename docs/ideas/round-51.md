# Ideas round 51

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 51: A focused 1.0

A lean 1.0 polish pass: a golden path for the first life, five moments every life reaches, five signature features, one name per thing, a final pass on numbers, and the bar 1.0 must clear.

### i51-a01 A first life defaults to 2 Years, Fresh start, Normal (S, 🔴)
The very first Start on a new phone skips the length, background and mode pickers and begins a 2-year Fresh start on Normal; the pickers appear from the second life on. renderTitle (ui.js) checks the records store; nothing changes for returning players.
- Touches: renderTitle in ui.js reads BEST_KEY; empty means first life, so Start uses len 'two', bg 'fresh', mode 'normal'.
- Balance: Same rules as any Normal life, so the score is a real Normal score. No new bonuses.

### i51-a02 Golden path, week 1: a paycheck before anything else (S, 🔴)
On a first life, week 1 Home shows only the 'No paycheck' card and the Jobs tab glows; the focus grid stays visible but End Week asks 'End the week with no job?' once.
- Touches: renderHome and the end handler in ui.js; a one-time flag in prefs().
- Balance: A confirm, not a block. Idle play that ignores it gets the same week as today, so idle stays at or under 50.

### i51-a03 Golden path, weeks 2–4: one focus, then try a second (M, 🔴)
The first-life tips are rewritten as a fixed four-week script: week 2 points at Rest when health dips, week 3 at Show up for town, week 4 at the 🏆 Life Score so far button. After week 4 the script stops.
- Touches: TIPS in ui.js gain a 'week' field and a firstLife guard; no new UI, it reuses the tip card.
- Balance: Tips only point; they never pick for you. Careless bots don't read tips, so their median doesn't move.

### i51-a04 Golden path, month 2: the first place in town (S, 🟠)
In week 6 or 7 of a first life, one tip opens 🛍️ Out and about with the diner pre-scrolled into view, so every new player visits one real Main Street place before the first season ends.
- Touches: TIPS in ui.js plus a scroll target in outSheet (outabout.js).
- Balance: One cheap visit; the existing 2-a-week limit holds. No score change.

### i51-a05 Golden path, month 3: the first town goal finishes on screen (S, 🟠)
The first town goal a first-life player completes gets a full card (not a toast) saying what the town got and what the player got, so the 'show up and the town notices' loop lands once.
- Touches: seasonWeek in features.js and the modal in ui.js, guarded by a first-life flag.
- Balance: Display only; town goal rewards are unchanged.

### i51-a06 Golden path, the halfway check-in (S, 🟠)
At the halfway week of any first life, a one-screen check-in shows the four Life Score parts with the weakest one named and one plain suggestion, then gets out of the way.
- Touches: turn.js at S.turn === turns/2; reuses lifeScore() and SCORE_TIPS (features.js).
- Balance: Advice only. Good play already finds this; careless play may climb a little but the bot doesn't read modals.

### i51-a07 Golden path ends with 'try a different start' (S, 🟠)
A first life's end screen has one big next step: 'Try Farm kid' (or another background you haven't played), with the pickers unlocked by then. The other buttons drop below it.
- Touches: finish() in features.js and the end screen buttons; BACKGROUNDS in state.js.
- Balance: None; it only changes which button is biggest.

### i51-a08 Five moments every life has: a shared checklist (M, 🔴)
A MOMENTS table in features.js names five beats every life should reach: first paycheck, first place of your own, someone who knows your name, a hard week you got through, and a goodbye or a finish. The year in review and end screen read from it.
- Touches: New MOMENTS table in features.js; S.moments stores the week each one happened; migrate fills it from the Journal where it can.
- Balance: Moments carry no points, so nobody farms them. They are a story spine, not a score.

### i51-a09 Moment 1: the first paycheck gets a real beat (S, 🔴)
The first week with pay shows a small card with the amount after taxes and gas and one line about where it came from ('Your first check from the grain elevator'). It shows once per life.
- Touches: turn.js after the pay lines; job() names from state.js.
- Balance: Display only.

### i51-a10 Moment 2: your own place, with a key (S, 🟠)
Moving out of the rented room (or buying the fixer-upper or farmhouse) shows a short 'new key' card with the address type and the new monthly cost next to the old one.
- Touches: The housing move handler in ui.js; HOUSING in state.js.
- Balance: Display only; the costs shown are the real ones.

### i51-a11 Moment 3: someone in town knows your name (S, 🟠)
When Community first crosses 50, a neighbor greets you by name in a one-line card and the Journal marks it; it's the payoff for weeks of Show up for town.
- Touches: turn.js stat checks; one line pool in events.js.
- Balance: No stat change, so it can't be farmed. Careless play rarely crosses 50 early.

### i51-a12 Moment 4: the hard week you got through (S, 🟠)
The first time a stat comes back from under 30 to over 50, a card says you pulled through and names what helped (the top focus of those weeks).
- Touches: turn.js tracks S.lowAt per stat; reads S.focus history.
- Balance: Rewards recovery with words only. No points, so tanking a stat on purpose gains nothing.

### i51-a13 Moment 5: every ending gets a goodbye line (S, 🔴)
Whatever ends the life (length reached, retirement, leaving town in debt), the end screen opens with one plain goodbye line about where you were and who was there.
- Touches: finish(reason) in features.js picks a line by reason and household.
- Balance: None.

### i51-a14 Signature five: name them and show them on the title screen (S, 🔴)
Pick five features to stand for The Burg 1.0: the weekly focus, the real-town map, town goals through the seasons, the Life Score's four parts, and the year in review. A one-line strip under Start lists them.
- Touches: renderTitle in ui.js; README.md 'What makes it The Burg' section matches the same five.
- Balance: None.

### i51-a15 Every signature feature appears in the first 13 weeks (M, 🔴)
A test plays a scripted first life for 13 weeks and checks that the focus, the map, a town goal line, the Life Score sheet and a quarter-end recap have all been seen.
- Touches: New case in tests/flows.test.mjs using helpers.mjs; fails the build if a signature feature is buried.
- Balance: Test only.

### i51-a16 The map is one tap from Home, every week (S, 🟠)
The Home map toggle moves from inside the focus card to a fixed chip next to the stats, so the real-town map (a signature) is never a hidden setting.
- Touches: mapToggle placement in renderHome (ui.js).
- Balance: None.

### i51-a17 Year in review becomes the 1.0 showcase screen (M, 🟠)
Tidy the year in review so it fits one phone screen at 390 px: the four parts with arrows, the town goal done this year, one moment, and one 'next year try' line.
- Touches: The year-in-review builder in turn.js and its CSS; screens test checks no scroll at 390x844.
- Balance: Display only.

### i51-a18 A word list: one name per thing, checked by a test (M, 🔴)
A small NAMES table (state.js) holds the player-facing word for each system: Community (not 'standing' or 'belonging'), Life Score so far, Journal, Out and about, town goal. A test greps ui.js, help.js and events.js text for the banned synonyms.
- Touches: New NAMES in state.js; new check in tests/rules.test.mjs.
- Balance: None.

### i51-a19 'Standing' and 'belonging' become 'Community' everywhere (S, 🔴)
Help and stat info say 'higher standing helps you get hired' while the stat is called Community; the copy switches to 'Community' so the stat reads the same on every screen.
- Touches: STATINFO text in ui.js, help.js, a few event lines in events.js.
- Balance: None.

### i51-a20 Score titles show on the stats, the end screen and records alike (S, 🟡)
'Solid Waitsburger' and the other titles appear on the score button and end screen but not in records; records and the year in review use the same title next to the number.
- Touches: recordsSheet and the year-in-review builder read lifeScore().title rules from one helper in features.js.
- Balance: None.

### i51-a21 Places and towns: same spelling, same icon on every screen (S, 🟠)
Walla Walla, the Tri-Cities and each stand-in business use the same name and emoji on the map, job cards, trip picker and Journal; a test compares PLACES and TOWNS names to rendered text.
- Touches: TOWNS in state.js, PLACES in outabout.js; a check in tests/rules.test.mjs.
- Balance: None.

### i51-a22 Stats on Home show whole numbers with a word (S, 🔴)
Each stat shows a whole number and a one-word band (Low, OK, Good, Great) under it, so 47 and 52 don't need Help to read. The bands use the same cut points as the warnings.
- Touches: statBtn in ui.js; band cut points in one const in state.js.
- Balance: Display only.

### i51-a23 Money under $10,000 shows dollars; above, shows $12.4k (S, 🟠)
fmt gets a short mode used on Home and the header so net worth fits a 320 px phone; sheets with details keep full dollars.
- Touches: fmt in state.js gains fmtShort; header and Home stat use it.
- Balance: Display only.

### i51-a24 Net worth on Home shows the change since last week (S, 🟠)
Under the net worth number, a small '+$212 this week' or '−$90 this week' line, so money feels like a weekly choice.
- Touches: renderHome (ui.js); last week's net worth stored in S.nwPrev at end of turn (turn.js).
- Balance: Display only; no new lever.

### i51-a25 Every percent the player sees is a whole number (S, 🟠)
Pay boosts, odds and score weights already round in most places; sweep the rest (focus streak %, job odds, part weights) to whole numbers and drop 'x 30%' math from the score sheet in favor of 'worth up to 30 points'.
- Touches: showScoreNow in features.js; the streak line in ui.js; apply odds in ui.js.
- Balance: Display only.

### i51-a26 '2027 dollars' shows once per screen, as a footnote (S, 🟡)
Where prices have risen, sheets show today's prices with one small footnote ('Score compares in 2027 dollars'), not the phrase inside every line.
- Touches: showScoreNow, finish (features.js) and help.js lines.
- Balance: Display only.

### i51-a27 1.0 quality bar: a checklist file the release kit reads (M, 🔴)
docs/quality-bar.md lists the 1.0 must-be-true items; the release kit refuses a 1.0 tag until each has a checked box and a linked test or note.
- Touches: New docs/quality-bar.md; a check in tools/ that release.json calls before a non-beta 1.x tag.
- Balance: None.

### i51-a28 Quality bar: the sim targets hold across 500 lives (S, 🔴)
Before 1.0: careless median at or under 60, idle at or under 50, good play at or over 70, for every length, with the numbers printed in the release notes.
- Touches: tests/sim.test.mjs runs 500 lives per bot per length in the release job.
- Balance: This is the balance gate itself.

### i51-a29 Quality bar: a cold start under two seconds on a mid phone (S, 🟠)
Before 1.0, a throttled Playwright run (4x CPU, slow 3G, then offline) reaches a playable Home in under 2 seconds from the service worker cache.
- Touches: tests/offline.test.mjs with CPU throttling; sw.js file list unchanged.
- Balance: None.

### i51-a30 Quality bar: a 10-year save from 0.2 loads and plays (M, 🔴)
A stored save from each past version (0.2 betas on) is kept in tests/fixtures and must load, migrate and play 52 weeks without errors.
- Touches: New tests/fixtures/*.json; a case in tests/flows.test.mjs calling migrate (state.js).
- Balance: None.

### i51-a31 Quality bar: no text cut off at 320 px or 200% zoom (M, 🟠)
Every sheet and card is screenshotted at 320 px wide and at 200% text zoom; a test fails on horizontal scroll or clipped buttons.
- Touches: tests/screens.test.mjs gains a zoom pass over all sheets.
- Balance: None.

### i51-a32 Quality bar: three new players finish a first life without help (S, 🔴)
Before 1.0, three people who've never played finish a 6-month life on a phone with no tips from the builder; every 'what do I do?' moment becomes a bug.
- Touches: docs/playtest/ gains a one-page script and result sheet.
- Balance: Catches confusion the bots can't.

### i51-a33 Quality bar: zero console errors in a 260-week bot run (S, 🟠)
The five-year bot run in tests must finish with no console errors or warnings across all six focuses and every background.
- Touches: tests/gameplay.test.mjs listens to page console and fails on any error.
- Balance: None.

## Ideas 51: Evenings and weekends

What Waitsburg is like after work and on weekends: night shifts, the late drive home, dark skies, summer evenings and Saturday rhythms.

### i51-b01 Night owl sleep bank: what the night shift really costs (L, 🔴)
Builds on the planned night shift pick: a hidden sleep bank drains on night weeks and refills on Rest weeks or days off, and a low bank means slips at work and a worse drive home.
- Adds S.sleep (0–10) in state.js migrate; turn.js drains it on night-shift weeks and refills it on Rest focus.
- Below 3, work events in events.js get a mistake weight and the commute gets a drowsy risk.
- The Home stat line shows a small moon icon with plain words: "Running on fumes".
- Balance: night pay stays ahead only if you rest; careless play that never rests loses more than the differential gains.

### i51-b02 Night pay differential on the job board (S, 🔴)
Night and swing jobs show their extra pay per hour next to the base rate, so the trade is clear before you take it.
- A night:true flag and a diff amount on JOBS in state.js; ui.js Jobs list adds "+$2/hr nights".
- Pairs with the sleep bank so the extra money comes with a cost.
- Balance: modest (about 8%), smaller than Work extra hours, so it is a choice, not a free win.

### i51-b03 Blackout curtains and a box fan (S, 🟠)
A cheap one-time buy for day sleepers that slows how fast the sleep bank drains.
- Offered once on the first night-shift week as a two-button card in events.js.
- Sets S.dayGear; turn.js halves the night drain.
- Balance: one-time $80, no effect for day workers, so it cannot be farmed.

### i51-b04 Days off: flip back or stay a night owl (S, 🟠)
On a night-shift schedule, each month asks whether you flip to days for family and town, or stay on nights and sleep well.
- A monthly card in events.js when the job is nights.
- Flip back: +happy, +community, -sleep. Stay up: +sleep, -community, and you miss Saturday events.
- Balance: both choices cost something; neither is a dominant pick.

### i51-b05 The 10 a.m. mower: day sleeper versus the neighbors (S, 🟡)
A neighbor fires up the mower while you sleep after a night shift. Ask nicely, wear earplugs, or snap at them.
- One event in events.js for night workers, May to September.
- Ask: small community gain and the noise moves to afternoons. Snap: sleep back, community down.
- Balance: small stakes, flavor plus a light community nudge.

### i51-b06 Breakfast at 2 a.m. at the all-night truck stop (S, 🟡)
Night workers in Pasco and Walla Walla get a stop for a hot meal after shift at a stand-in all-night truck stop.
- A new STOPS entry in features.js, eat kind, only shown when the job is nights.
- Small happy lift, a few dollars, and once in a while a coworker sits down with you.
- Balance: uses the existing trip cap and repeat fade.

### i51-b07 Vending machine dinners or a packed lunch bag (S, 🟡)
Night crews eat from the machine unless you pack food. A one-time pick sets the habit for the season.
- A card in events.js on night jobs; sets S.packs.
- Packing: small weekly savings and health, with a small happy cost. Vending: easier, costs health over months.
- Balance: the packing pick pays only over many weeks, which favors steady play.

### i51-b08 Deer at dusk on Highway 12 (M, 🔴)
Evening drives home in fall and early winter carry a deer risk that grows with commute length. Slow down and get home later, or keep speed and roll the dice.
- A road event in events.js weighted by commuteOneWay() and months 10–12 (the rut) and dusk light.
- Hit: repair bill sized by car value in CARS, and a week of happy loss. Slow down: -1 happy, no risk that week.
- A remembered choice: pick "always slow down" once and later weeks auto-apply it.
- Balance: careless play skips the choice and eats rare big bills; the careful pick costs little.

### i51-b09 Rumble strips: drowsy on the drive home (S, 🟠)
After overtime or a night shift with a long commute, the tires hit the rumble strip. Pull over and nap, or push on.
- An event in events.js gated on Work extra hours focus or a low sleep bank, plus a commute over 30 minutes.
- Pull over: home late, -1 happy. Push on: small chance of a ditch and a big bill.
- Balance: punishes stacking overtime on a long commute, which careless play does.

### i51-b10 Call an old friend on the long drive home (S, 🟠)
A long commute can keep an old friendship alive: a hands-free call once a month keeps it from fading.
- A monthly prompt in events.js when the commute is over 40 minutes.
- Gives a small happy and community lift and sets S.callFriend so later "friend moves back" style events can fire.
- Balance: only turns dead commute time into a small upside; no money.

### i51-b11 The 10 p.m. call: a friend needs a ride home (S, 🟡)
A friend calls from a Walla Walla bar and needs a ride. Go get them, send a cab number, or let it ring.
- An events.js card for age 21+, weekends only, with a gas cost from commuteCost.
- Going: community up, sleep down, gas spent. Ignoring: small community loss later through chainSet.
- Balance: a small favor with a cost, no farming.

### i51-b12 Daylight by month: what fits after work (M, 🔴)
A month table of sunset times sets what you can do after work: June evenings fit fishing and the park, December evenings are dark by 4:30.
- A DAYLIGHT array in state.js; FOCUS outdoors gives full effect on weekdays only from April to September for full-time workers.
- In winter the Get outside card says "Weekends only this time of year" and gives about two thirds of the effect.
- Balance: makes the outdoors focus a summer strength and Rest or Community a winter one, so one focus spammed all year scores less.

### i51-b13 Moon phase on the date line (S, 🟠)
A small moon icon next to the week date. Full moon nights are bright; new moon nights are best for stars.
- A pure function in state.js from the game date (29.5-day cycle) and a glyph in ui.js header.
- Other ideas (sky outings, coyotes, night fishing) read it.
- Balance: display only.

### i51-b14 The dark-sky pullout on the ridge road (M, 🟠)
A pin above town on the region map where the town lights drop away. Go on a clear night for a big calm lift; clouds or a full moon make it weaker.
- A new STOPS place in features.js and a pin in maps.js, with weather by month and the moon phase setting the effect.
- Text says what you saw: the Milky Way, a satellite, nothing but clouds.
- Balance: uses the trip cap and the repeat fade; the best nights are rare, so idle play does not get it.

### i51-b15 Borrow the library telescope and keep a sky log (M, 🟡)
The library lends a telescope for two weeks. Each clear night out adds a line to your sky log: the Moon, Saturn, a comet.
- An act on the library place in outabout.js; S.sky holds the log, shown on the Life tab.
- A badge in features.js BADGES for ten log entries.
- Balance: free, but each night out uses an outing; the log is collection play, not score.

### i51-b16 The space station flies over tonight (S, 🟡)
A rare news card: the station passes over at 9:14 p.m. Step outside with the family, or skip it.
- One events.js card a few times a year, needs a clear month.
- Stepping out: +2 happy, more with kids at home; sets a sky-log line if the log exists.
- Balance: tiny and rare.

### i51-b17 Star party with the valley astronomy club (S, 🟡)
In summer, a stand-in valley astronomy club sets up telescopes at a dark field. Show up, help set up, or skip.
- An events.js card in July and August near the new moon.
- Showing up: happy and community; helping: more community and a contact that unlocks a later club invite.
- Balance: one event a year, summer only.

### i51-b18 Ask a neighbor to shield the new yard light (S, 🟡)
A neighbor puts in a bright yard light that floods your bedroom and the sky. Ask them to shield it, buy the shield yourself, or live with it.
- An events.js card for house and farm homes.
- Asking: community check; buying the $30 shield: sure fix and a small community gain.
- Balance: small; rewards talking to neighbors.

### i51-b19 Movie on the lawn at Preston Park (S, 🟠)
Summer Fridays bring a free movie on a sheet at the park. Bring a blanket, run the popcorn table, or stay home.
- A calendar event in events.js, June to August, two or three times a summer.
- Popcorn table: community up; blanket: happy up, more with kids or a partner.
- Balance: free but it competes with the Tonight tap and the weekly event cap.

### i51-b20 Heat-wave evenings: the town comes out after eight (S, 🟡)
On the hottest weeks the town hides indoors all day and comes out after sunset: porches, the pool at night swim, kids on bikes.
- A note on the heat-wave weeks in events.js that swaps the Get outside effect to evening text and keeps the health gain.
- One extra choice: the late swim at the town pool or a porch with the neighbors.
- Balance: softens heat weeks a little only if you choose to go out.

### i51-b21 Friday night on Main: what is lit tonight (M, 🟠)
The Main Street close-up gets a Friday night look: lit windows for places open that evening, dark ones for those closed.
- mainStreetSVG in outabout.js reads each place's evening days and draws a warm window glow.
- Tapping a lit window opens its card at the evening act.
- Balance: display and shortcut only; visit rules and caps stay as they are.

### i51-b22 The walk home from the ale house: where you live matters (M, 🔴)
Live above Main Street and you walk home from the ale house. Live in the wheat hills and you need a plan: one drink, a sober friend, or a risky drive.
- visit() in outabout.js checks the home in HOMES; far homes get a small choice card after evening acts at the ale house and wine bar.
- A risky drive carries a small chance of a DUI stop with a big money and community hit.
- Balance: town living gets a small social upside; the careless pick is the one that can go badly.

### i51-b23 The after-jam in the back room (S, 🟡)
Some jam weeks, a few players keep going past midnight. Stay for it, or head home to sleep.
- A follow-up in outabout.js after the jam act, about one jam in four.
- Staying: a bigger happy lift and music practice if the Music track exists, with a tired Monday (-health).
- Balance: a trade, not a pure bonus.

### i51-b24 Pint night for the boosters (S, 🟡)
Once a season the ale house gives a dollar a pint to the school boosters. Go have one, bring friends, or skip.
- An outabout.js event tied to the ale house, age 21+.
- Bringing friends: community up, a bit more money spent.
- Balance: small, seasonal, uses the event cap.

### i51-b25 A teen sitter for Saturday date night (S, 🟠)
Parents with a partner can book a sitter from down the street for a night out. The going rate climbs over the years.
- Date-flagged acts in outabout.js get a sitter cost when kidsAtHome() and kids are under 12.
- A regular sitter cuts the price and can turn into a later "the sitter graduates" event.
- Balance: makes date nights cost more for parents, which is real; the happiness gain stays capped.

### i51-b26 Saturday at the county transfer station (S, 🟡)
The dump is open on Saturday mornings. A neighbor asks to throw a few bags in your truck, and the line is a town social hour.
- An events.js card for pickup owners, a few times a year.
- Helping: community up, a small fee; skipping: nothing.
- Balance: small and only for truck owners.

### i51-b27 Coffee pot Saturdays at the hardware counter (S, 🟡)
The hardware store keeps a pot on Saturday mornings. Become a regular and you hear about jobs, deals and who needs help.
- An act on the hardware place in outabout.js; a count of visits unlocks a "heard at the counter" job lead or a cheaper repair once.
- Balance: uses an outing; the payoff comes only after several weeks of steady visits.

### i51-b28 Sunday-night meal prep for the week (S, 🟠)
Spend Sunday evening cooking for the week. It saves eat-out money and helps health, and gets easier as Cook improves.
- A choice on the Tonight tap or a small Home toggle; reads skillLv("cook") in features.js.
- Gives a weekly grocery saving and a small health gain, with a small happy cost at Cook level 0.
- Balance: a steady habit that pays over months, which suits good play over idle play.

### i51-b29 Your teen's curfew and the Main Street loop (M, 🟡)
Teens with a license want to drive the loop on Friday nights. Set a curfew: early, midnight, or none.
- A family card in events.js when a kid is 16–17; sets S.curfew.
- Later events read it: a late call from a friend's house, a fender bender, or a teen who trusts you more.
- Balance: no curfew raises the risk of costly events; strict lowers the teen's happiness line.

### i51-b30 Night fishing for catfish on the Snake (S, 🟡)
Summer nights at a Snake River boat launch: a lantern, a bell on the rod, and channel cats.
- A stop on the region map in features.js, June to August, needs a fishing license if that system exists.
- Bigger happy lift near the new moon; a tired Monday after.
- Balance: summer only, trip cap and repeat fade apply.

### i51-b31 Backyard fire pit nights, when there is no burn ban (S, 🟡)
Fall and spring evenings around a fire pit with friends. Closed when the county has a burn ban.
- A one-time $150 buy for house and farm homes; adds an evening choice in events.js.
- Burn ban months block it with a plain reason line.
- Balance: one-time cost, seasonal, small lift.

### i51-b32 The sky calendar: one data table for moon, showers and flyovers (L, 🟠)
A single data file lists moon phases, meteor showers, eclipses and rare sky events by game date, so every sky idea reads from one place.
- A SKY table in state.js (or js/sky.js) keyed by month and week; events and stops look up "is tonight good".
- Used by the moon icon, the dark-sky pullout, the telescope log, the star party and night fishing.
- Includes the real rare years (eclipses) for the Seasons calendar.
- Balance: data only; it changes when good nights happen, not how much they give.
