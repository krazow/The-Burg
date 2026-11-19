# Ideas round 48

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 48: Bundles part 6 and v1.0

30 bundles that group the round 40-47 ideas still loose (road events, job ladders, the Tattler, land, crises, performance, holidays), and one release plan for a polished 1.0.

### i48-a01 Bundle: Walla Walla and Dayton drive-bys (M, 🟡)
Seasonal one-card stops on drives to Walla Walla and Dayton: a youth car wash, the chalk festival, the fort museum, open mic, the courthouse lawn concert, the Bluewood elk herd and the 4-H auction. All go in one ROAD_EVENTS table in events.js keyed by town and month, low weight, yearly repeat, small happy/community gains so a trip-heavy idle life can't farm them.
Built on the road-event hook from i47-a16. Each fires at most yearly. Gains are +1 to +4 and most cost money, so they can't stack into a free score. Touches events.js and the trip/commute roll in turn.js.
Covers: i40-a15, i40-a16, i40-a17, i40-a18, i40-a19, i40-a20, i40-a21.

### i48-a02 Bundle: Tri-Cities drive-bys (M, 🟠)
The same table filled for Kennewick, Pasco, Richland and Wallula: mall Santa, the arena concert, the March job fair, a parking-lot fender-bender, the water park, a lost driver in Spanish, church tamales and family science night at the lab. The job fair is the one with real teeth: a better next application for the unemployed.
Same ROAD_EVENTS rows, town key 'tri'. The job fair bonus only helps players who are looking for work. The fender-bender is a cost, which keeps careless driving honest. Touches events.js and jobs apply odds in turn.js.
Covers: i40-a22, i40-a23, i40-a24, i40-a25, i40-a26, i40-a27, i40-a28, i40-a29.

### i48-a03 Bundle: Commute and trip mishaps (M, 🟠)
Things that go wrong or right on the way: the drive that feels endless after half a year, the forgotten wallet, carsick kids, a trip buddy who cancels, bringing a neighbor along to split gas, roadside fruit, and trips that cost more with kids in the back seat.
Long commutes cost a little happiness unless you plan stops, which rewards thought over ignoring it. Kid costs scale per kid. Touches the trip sheet in outabout.js, commute logic in turn.js and events.js.
Covers: i40-a09, i40-a12, i40-a13, i40-a14, i40-a30, i42-a23, i46-a28.

### i48-a04 Bundle: Coffee, kitchen and grocery ladders (L, 🟠)
Main Street service jobs get rungs and a weekly texture: barista to shift lead to opener with a Saturday rush and latte-art score, line cook to kitchen manager, grocery clerk to manager with truck day and the day-old shelf, plus inventory night and the tour-bus lunch rush.
One JOB_LADDERS table (i19-a09) with rows per job: weeks and standing to step up, pay bump, stress cost. i41-a02 and i41-b06 are the same ladder, merged. Higher rungs add early hours or call-ins so pay never comes free. Touches state.js jobs data, turn.js and the Jobs tab in ui.js.
Covers: i41-a02, i41-b06, i41-b04, i41-a31, i41-a24, i41-b31, i40-b17, i40-b19.

### i48-a05 Bundle: Bank, law office and salon ladders (L, 🟠)
Quiet weekday careers: teller to head teller to personal banker or loan officer, with harvest-check week at the drive-up, the loan you must turn down and the short cash drawer; front desk to paralegal; shampoo assistant to stylist with prom season booking.
Same ladder table. Loan officer needs a degree, stylist needs a year of class and $4k, so the top rungs reward planning. Low stress, low pay ceiling keeps them balanced against the trades. Touches jobs data, events.js and ui.js.
Covers: i41-a18, i41-b10, i41-b11, i41-a14, i41-a12, i41-a11, i40-b28, i40-b09.

### i48-a06 Bundle: Hospital and care work (L, 🔴)
Nursing jobs get the shift handoff, being floated to the ER, a named long-term resident you look after, the CPR card, the rest-area nap after a night shift, decades of charting change, and the hospital paying half of RN school for a two-year promise.
The tuition deal is the big one: a real path from aide to RN with a payback if you quit early. Careful handoffs cost happiness but cut bad-event odds, so rushing is a gamble. Touches jobs data, education in turn.js and events.js.
Covers: i41-b01, i41-b02, i41-b03, i41-b19, i41-b20, i40-b15, i40-a11.

### i48-a07 Bundle: Farm, elevator and ag tech careers (L, 🟠)
Ground-level farm work as careers: truck to combine seat to farm manager, fair or friendly moisture calls at the scale, the grain dust alarm, small elevators consolidating, autosteer arriving, drones and soil maps, the ag tech to agronomist step and soil-sample season.
Decade changes key off the game year (i41-b16, b18, b30). Harvest months cost health, so the pay jump is earned. Ties to the wheat lease bundle (i19-a27) for yield tips. Touches jobs data, turn.js and events.js.
Covers: i41-b15, i41-b16, i41-b17, i41-b18, i41-b30, i41-a33, i40-b30, i40-b25.

### i48-a08 Bundle: Tools of the trade: shop, road and rail (L, 🟠)
Jobs where you own the risk: ASE patches and the tool truck debt for mechanics, owner-operator rigs and paper vs electronic logs for drivers, the extra board to engineer seat on the rail, the corrections letter, and the boss asking you to grab parts on the way in.
Owner-operator doubles pay but carries fuel, repairs and slow weeks, so careless play loses money. Tool-truck debt is a real debt line. Touches jobs data, money in turn.js and events.js.
Covers: i41-b21, i41-b22, i41-b23, i41-b26, i41-b27, i41-b32, i40-b24, i40-a10.

### i48-a09 Bundle: Campus, slopes and the big employers (L, 🟡)
The odd jobs with their own rhythm: the professor's tenure clock, office hours and the recommendation letter, the ski lift operator's powder Saturday, thin-snow winters and the stuck lift, the Hanford dosimeter badge and the airport lost bag.
Tenure is a six-year track with a real fail state. Thin-snow winters push lift operators to plan a summer job. Touches jobs data, turn.js and events.js.
Covers: i41-b24, i41-b25, i40-b07, i41-b28, i41-b29, i40-b01, i40-b02, i40-b03.

### i48-a10 Bundle: Main Street menus and side jobs (M, 🟡)
The restaurants and shops change through the year: the coffee shop's seasonal drink board, tomato and braise menus, the guest-chef dinners, pouring at Grenache Fest, holiday ham orders, the smoker hand and brewer's helper weekend jobs, and the pasta kitchen ladder.
Menus add +1 happy only to the first visit each season. Weekend side jobs cost a social slot. Touches the Out and about places in outabout.js, jobs data and the calendar in events.js.
Covers: i41-a03, i41-a08, i41-a21, i41-a22, i41-a25, i41-a28, i41-a30, i41-a09.

### i48-a11 Bundle: Traits that change over a life (M, 🟠)
Traits stop being fixed at the start: swap one you've played against for a year, soften them at 40 and 60, earn one from a big moment, see them in the Tattler and in NPC lines, give your partner a trait that fits or rubs, and see which one each kid picked up.
Builds on the trait system (i47-a13). Every change is an offer, never forced, and traits stay two-sided so no swap is a pure gain. Touches state.js traits, events.js, the Tattler line and the Family card in ui.js.
Covers: i42-b18, i42-b19, i42-b20, i42-b23, i42-b27, i42-b28, i42-b29.

### i48-a12 Bundle: Accessibility sweep part 2: headings and spoken names (M, 🔴)
Screen readers hear the game properly: one h1 per screen, dialog names without emoji, decorative emoji hidden, End Week read as 'End week, focus: Rest', focus on the heading for read-heavy sheets, a real progress bar for school, blocked trip stops still focusable, and a skip link to End Week.
Pure markup fixes in ui.js, the sheet() helper and index.html. No balance effect. Each fix gets an axe or Playwright check in tests.
Covers: i43-a10, i43-a15, i43-a16, i43-a17, i43-a18, i43-a25, i43-a26, i43-a28.

### i48-a13 Bundle: Zoom, Reduce Motion and Help demos (M, 🟠)
The game holds up at 200% zoom and with Reduce Motion on: the header wraps, stat cards drop to one column, the Help contents go to one column, sheets stop sliding; plus Help gets short looping clips and a 'Watch it' live demo that taps through the practice life.
CSS changes in index.html styles; the clips and demo honor Reduce Motion (a still frame instead). The demo uses the practice life so it can't touch a real save. Touches help.js and ui.js.
Covers: i43-a21, i43-a22, i43-a23, i43-a24, i44-b31, i44-b32.

### i48-a14 Bundle: Performance sweep part 3: Jobs tab and old data (M, 🟡)
Trim the remaining slow spots: forget expired event cooldowns, draw the region map's rivers once, cache the Help text per version, let the browser skip off-screen Journal lines, work out take-home pay once a week, build the Jobs list while idle, skip the JSON clone on load, and run the old-save move once.
Measured targets from the round 43 audit (Jobs tab 17-18 ms at 6x). No gameplay change; the sim tests must give the same scores before and after. Touches state.js, maps.js, help.js and ui.js.
Covers: i43-b15, i43-b16, i43-b17, i43-b18, i43-b19, i43-b20, i43-b24, i43-b25.

### i48-a15 Bundle: Long town crises (L, 🟠)
Crises that run a season instead of a week: a missing hiker in the Blues, the grocery store closing and a co-op buyout, the clinic losing its doctor, the school roof failing, no one to run Celebration Days, the fire levy failing, the packing plant fire and the ten-day farm-road drift.
Each is a row in the crisis engine (i47-a23) with phases and roles. At most one long crisis a year. Helping costs weeks and money, so it pays in community, not score padding. Touches events.js and turn.js.
Covers: i44-a06, i44-a08, i44-a09, i44-a12, i44-a13, i44-a14, i44-a15, i44-a16.

### i48-a16 Bundle: Neighbors through a crisis and the year after (M, 🟠)
What happens around a crisis: take in a family for a month, the meal train sheet, your five-name phone tree, the Tattler special edition, the one-year remembrance, the argument about who's to blame, kids helping with sandwiches and sandbags, and the closing spaghetti feed.
Shared add-ons any crisis row can use. The phone tree grows or shrinks with reliability, so skipping calls has a cost. Touches events.js, the Tattler line and the Journal.
Covers: i44-a17, i44-a18, i44-a19, i44-a23, i44-a24, i44-a25, i44-a26, i44-a27.

### i48-a17 Bundle: Help rewrite, section by section (M, 🟠)
The long Help sections get rewritten from the round 44 audit: 'Your first four weeks', Out and about rules first, Events led by the three-kinds table, Jobs split into Commuting and Side hustles, a 'Why take a trip?' table, Skills and Business split, and saves plus installing merged into 'Your device'.
Text-only changes in help.js with the help-coverage test updated. No balance effect. Pairs with the searchable Help bundle (i47-a12).
Covers: i44-b24, i44-b25, i44-b26, i44-b27, i44-b28, i44-b29, i44-b30.

### i48-a18 Bundle: Rivers and wild things (M, 🟠)
The Touchet and the sky: count smolts at the screw trap, walk the creek counting redds, leave the log or cut it, the beaver dam fight, bag the river after tubing weekends, salmon in the classroom, sandhill cranes in March and the Christmas bird count.
One volunteer-and-nature event group in events.js, mostly yearly and seasonal. Gains are small community and happiness; the log choice trades free firewood for fish. Touches events.js and outabout.js.
Covers: i45-a04, i45-a05, i45-a06, i45-a23, i45-a24, i45-a25, i45-a11, i45-a14.

### i48-a19 Bundle: Farm ground and the long view (L, 🟠)
Caring for working land: talk the boss into no-till, the June cloudburst gullies, a cover crop on the corner, leave the corner for birds, spray drift on your garden, the cost-shared fish screen, a conservation easement on your acreage and the school pollinator strip.
No-till pays off over years: light harvests first, then lower costs, so patient play wins. The easement is a big one-time money choice for land owners. Touches the wheat lease in turn.js, events.js and the end screen.
Covers: i45-a08, i45-a09, i45-a10, i45-a26, i45-a27, i45-a07, i45-a29, i45-a34.

### i48-a20 Bundle: A yard ready for summer (M, 🟠)
The home lot as land: goatheads in the park, the weed board letter, a weedy patch that grows each summer you ignore it, a wildfire-ready yard, chipper day, burn the ditch or wait, let the lawn go golden, and trade the lawn for native plants.
A yard-condition note on the Home card. Ignoring weeds brings a second letter and a fine, and a ready yard softens fire-crisis losses, so neglect costs. Touches state.js home, events.js and ui.js.
Covers: i45-a15, i45-a16, i45-a17, i45-a18, i45-a19, i45-a20, i45-a21, i45-a22.

### i48-a21 Bundle: Event threads: work and town (M, 🟠)
Choices at work and in town come back: your famous pie, the designated driver's reputation, the council race you lost by eleven votes, a council seat at the big days, the new hire who becomes your boss, the coworker who took your promotion, the old boss calling after the layoff, and the training course paying off.
Rows in the event-links table (i47-a21). Most follow-ups are small and can cut either way, so there's no single best choice to farm. Touches events.js.
Covers: i45-b06, i45-b07, i45-b08, i45-b09, i45-b10, i45-b11, i45-b12, i45-b34.

### i48-a22 Bundle: Event threads: friends and neighbors (M, 🟡)
People remember you: the friend you visited in the hospital shows up when you're run down, your carpool buddy's wedding, new folks next door after moving day, the sandbag crew in the windstorm, the health plan choice that looks back at your year, and the regular who stopped coming in.
Same event-links table. The new neighbors become a returning NPC (i47-a22). Touches events.js and the neighbors data in state.js.
Covers: i45-b18, i45-b19, i45-b24, i45-b25, i45-b33, i40-b20.

### i48-a23 Bundle: Buy, sell and swap (M, 🟠)
A classifieds page and the junk shop: For sale, For rent and Gigs columns that turn over weekly, sell your own stuff, rentals you only find in the paper, free-to-a-good-home pets, consign furniture when you move, the reopening estate sale, the December gift market and the grocery sale insert.
Selling gets fair prices, not windfalls; price high and you wait. Paper-only rentals reward reading the Tattler. Touches the Tattler sheet (i47-a27), moving in ui.js and state.js household.
Covers: i46-b08, i46-b09, i46-b10, i46-b11, i41-a16, i41-a17, i41-a05, i46-b28.

### i48-a24 Bundle: Reporter desk and the letters page (M, 🟠)
The Tattler from the inside: Tuesday night lock, the old-hand editor who retires, the council member who wants a story pulled, pitching your own stories from this week's events, plus the reader side: compose a letter, the grumpy regular, call in a tip and the council endorsement.
Reporter job rows in the ladder table, letters as a weekly Tattler action. Gossip tips can backfire. Touches the Tattler sheet, jobs data and events.js.
Covers: i41-b07, i41-b08, i40-b27, i46-b22, i46-b23, i46-b24, i46-b25, i46-b29.

### i48-a25 Bundle: The paper of record (M, 🟡)
The Tattler keeps the town's life: births and new arrivals, obituaries you can act on, weddings and big birthdays, the graduation section, the blotter that needs your help and the one that mentions you gently, public notices worth reading, and the Save the Tattler drive.
Names come from the town ledger (i47-a28). Careless choices land in the blotter, a soft nudge. Public notices give early warning, which rewards reading. Touches the Tattler sheet and events.js.
Covers: i46-b12, i46-b13, i46-b14, i46-b30, i46-b15, i46-b16, i46-b27, i46-b32.

### i48-a26 Bundle: Cardinals on Friday night (M, 🟡)
A real school sports season: the sports page keeps the Cardinals' record, your kid in the box score, the café pick'em card, years of Friday nights counted for your kid, and the team packing the booths after home games.
One season record per sport in state.js, scores rolled weekly. Going to games costs evenings. Touches the Tattler sports section, kids in turn.js and events.js.
Covers: i46-b17, i46-b18, i46-b19, i45-b26, i41-a32.

### i48-a27 Bundle: Parent playtest fixes part 2 (M, 🔴)
Fixes and adds from the parent playtest: no dating in year one of the Single parent challenge, kids along on Out and about, a birthday each year, the grown kid who is the heir's parent drops by, the end screen lists what each kid did at 18 and what kids did to the score, milestones stop a skip, and a breakup says the kids stay.
Mostly small fixes in turn.js, outabout.js and the end screen in ui.js. The challenge fix stops a partner paycheck from making it easy. Each gets a sim check.
Covers: i46-a09, i46-a13, i46-a16, i46-a17, i46-a18, i46-a20, i46-a21, i46-a25.

### i48-a28 Bundle: Winter and spring traditions (M, 🟡)
The first half of the year: the New Year's first hike streak, classroom valentines, carnations at the senior center, peas on St. Patrick's Day, the lodge hall corned beef feed, the Easter sunrise service, the Memorial Day roll call and booking the camp spot in January.
Holiday rows on the calendar (i19-a29) with year-in-a-row counters. Each gives small, steady gains; streaks matter more than any one year. Touches events.js and the calendar.
Covers: i47-b01, i47-b03, i47-b04, i47-b05, i47-b06, i47-b07, i47-b10, i47-b11.

### i48-a29 Bundle: Summer and fall traditions (M, 🟡)
The second half: the family's spot on the levee, the dog and the fireworks, the first-day-of-school porch photo, trunk-or-treat, the full-size candy bar house, homemade costumes, the Turkey Bowl and deer camp with the same crew.
Same holiday rows. The Turkey Bowl injury risk climbs with age, and the candy house costs grow each year, so traditions aren't free points. Touches events.js and the Family card.
Covers: i47-b13, i47-b14, i47-b16, i47-b17, i47-b18, i47-b19, i47-b21, i47-b22.

### i48-a30 Bundle: December and traditions that carry on (L, 🟠)
December plus the long view: lighting of Main Street, one ornament a year, one big gift or a pile, twelve nights of porch gifts, the Christmas club savings, the first holiday with an empty chair, and Mother's and Father's Day across generations.
The ledger (i47-b29), teen opt-out (i47-b31), hosting hand-off (i47-b32) and Grandpa interview (i47-b20) ride along as stretch items once this core lands. The Christmas club smooths December costs and is the 🔴 quick win. Touches events.js, money in turn.js and the Family card.
Covers: i47-b23, i47-b24, i47-b25, i47-b26, i47-b28, i47-b30, i47-b08, i47-b09.

### i48-a31 Release plan: v1.0 — A polished town (L, 🔴)
Ship 1.0 once the seven planned releases are done (v0.3 Solid ground through v0.9 A town that remembers), then a final polish pass of the new sweeps: accessibility, zoom and Reduce Motion, performance, the Help rewrite and the parent playtest fixes. Holidays, land, Tattler extras and the new job ladders wait for 1.1+ so 1.0 stays stable.
Gate: every earlier release plan shipped and its sweeps closed. Final polish: i48-a12 (screen readers), i48-a13 (zoom, motion, Help demos), i48-a14 (performance), i48-a17 (Help rewrite), i48-a27 (parent fixes). Release checks: the balance sim must hold careless median <= 60, idle <= 50, good play >= 70 across all backgrounds and modes; axe and Playwright pass at 200% zoom; save from 0.2.0 loads cleanly. Kept for after 1.0 on purpose: holidays (i48-a28 to a30), land (a18 to a20), Tattler extras (a23 to a26), job ladders (a04 to a10) and road events (a01 to a03), so content lands on a stable base.
Covers: i30-a31, i30-a32, i30-a33, i39-a31, i39-a32, i47-a29, i47-a30, i48-a12, i48-a13, i48-a14, i48-a17, i48-a27.

## Ideas 48: Playtest on Relaxed

Ideas from headless Relaxed playtests (6-month and 2-year) by a casual player who taps fast, skips reading and uses ⏩ 4, ⏩ 13 and Auto: one focus switch per skip took a 2-year score from 32 to 74, and the game never tells skippers that.

### i48-b01 A quick second tap on ⏩ can't pick an event choice (S, 🔴)
An event's first choice opens right under ⏩ 4, ⏩ 13, Auto and End Week, so a fast double tap answers it unread. Ignore choice taps for about 400 ms after a sheet opens from a skip.
- Bug, found headless: after a skip, the point under the ⏩ 4, Auto and End Week buttons is the event's first choice ([data-i=0]).
- Fix in sheet() (ui.js) and showEvent() (events.js): set a short "armed" delay before [data-i] buttons accept taps. Keyboard and the tutorial are unaffected.
- Balance: stops careless first-choice answers that nobody read.

### i48-b02 Relaxed softens the rut too (S, 🔴)
In Relaxed, the rut costs 0.7 happiness a week, not the full 1.2. Today Relaxed softens stat drift but not the rut, and the rut is what sinks a casual player.
- In the playtest a skipper with a job who never changed focus scored 32 on Relaxed and 30 on Normal, almost the same.
- turn.js: scale the rut adj({happy:-1.2}) by 0.6 when mode() is relaxed, like dh/dH/dc.
- Balance: Relaxed scores are kept separately. Idle Relaxed 2-year moves from about 25 to about 28.

### i48-b03 The rut reminds you again every 13 weeks (S, 🔴)
The rut note shows once, at week 9. After that a skipper loses happiness for months without a word. Repeat the note, and stop the skip, every 13 weeks while the same focus runs on.
- Playtest: 96 weeks of Rest in a row and happiness fell from 66 to 6, with one note in week 9.
- turn.js weekTick: push the rut note when (streakN - RUT_WEEKS - 1) % 13 === 0.
- Balance: no new effect, just information. Careless play stays where it is unless the player reacts.

### i48-b04 The rut stop has focus buttons (S, 🔴)
The rut note sheet gets two or three focus buttons (the ones for your lowest stats) plus "Keep it", so a player who doesn't read can fix it in one tap.
- Playtest: one focus switch per skip took a 2-year Relaxed skipper from 32 to 74. The fix is one tap, but today the sheet only has Continue.
- turn.js playWeeks notes sheet: when the note is the rut, add data-sugg buttons like the Home low-stat cards.
- Say the cost in the note: "−1.2 happiness every week until you switch".
- Balance: rewards a choice, not idling.

### i48-b05 Skips stop when a stat drops into the red (S, 🔴)
A skip stops the first week happiness, health or community falls below 25, with the same one-tap fix as the Home card. It warns again only after the stat climbs back above 35.
- Playtest: happiness hit 0 on an idle Relaxed life and 6 on a working one, and no skip stopped for it.
- turn.js weekTick: add a note when a stat crosses 25 going down (S.redArmed per stat). Reuse sugg() from renderHome.
- Balance: at most a few stops a life. Only helps players who act on it.

### i48-b06 Before a long skip, check the focus (M, 🔴)
Tap ⏩ 13 or Auto after four or more weeks of the same focus and a small sheet asks: "Rest fades after 4 weeks. Keep it, or switch?" with two suggested focuses. It has a "Don't ask again" setting.
- Casual players never open the focus grid. Asking at the skip button is the one moment they are looking.
- ui.js render(): wrap the #ff13 and #auto handlers. Suggest the focuses for your lowest stats. Classes don't count, since they don't fade.
- Balance: the player still chooses. No automatic focus rotation (that is a separate idea).

### i48-b07 The stop sheet says why it stopped and offers "Keep going" (S, 🟠)
When a ⏩ 13 stops at week 2, the sheet says "Stopped after 2 of 13 weeks: an event needs you" and has a "Keep going (11 more)" button.
- Playtest: ⏩ 4 averaged 2.9 weeks and ⏩ 13 about 5. Players who don't read think the button is broken.
- turn.js playWeeks: keep S.run.req. Show the reason (event, note, New Year) and, after the event's Continue, offer the rest of the skip.
- Balance: no change to what happens, only fewer taps.

### i48-b08 A report card that lands mid-skip shows on the stop sheet (S, 🟠)
If a quarterly report card came up during the skip, the next stop sheet shows it in one line: "📋 Report card: 38 (−2)".
- Playtest: skippers' scores slid 40 → 38 → 33 and the report cards only went into the Journal.
- turn.js: keep the report card on S.run and print it in the notes sheet and in showRunDetails.
- Balance: information only.

### i48-b09 Eight weeks with no paycheck stop a skip (S, 🟠)
After 8 weeks with no job (and not retired), a skip stops once with "No paycheck for 8 weeks" and a Find a job button. It stops again every 26 weeks after that.
- Playtest: an idle Relaxed 2-year life slid to −$35,000 with no stop for it. Relaxed keeps the life going, so nothing else ever stops it.
- turn.js weekTick: track S.noJobWeeks and push a note. Add a data-go="jobs" button.
- Balance: idle stays at or below 50. It only helps once the player applies.

### i48-b10 Relaxed: fewer small events, so a skip goes farther (M, 🟠)
In Relaxed, small town and road events (not yearly, story or big-money ones) roll about 30% less often, so ⏩ 13 more often means 13.
- Playtest: 34 skip stops in a 2-year Relaxed life. Most were small two-button events like a potluck, a Friday game or a moving day.
- events.js rollEvent pacing: a Relaxed multiplier on the category chance, the opposite of Hard's "more events".
- Balance: fewer small bonuses and fewer small costs. Check in the sim that idle Relaxed stays at or below 50.

### i48-b11 Small choices from a skip wait in one sheet (M, 🟠)
Two-button events marked small (under $100, nothing that lasts) don't stop a long skip. They wait, and the skip ends with "While you skipped: 3 quick calls", each with its week and buttons.
- Keeps the choice but drops the stop. Big events, money over $100 and anything that sets state still stop at once.
- events.js: a small:true flag on event rows. turn.js: a queue on S.run. A new sheet runs the queued choices in order.
- Balance: same choices, same effects, just answered later. No auto-picking.

### i48-b12 The dealer offer doesn't pull you off Home (S, 🟠)
"Take it home" sets the tab to Life, so the skip buttons vanish, and the "this week" trade-in bonus runs out on the next skip. Stay on Home, show a toast with a link, and keep the bonus for 2 weeks.
- Bug, found headless: after choosing "Take it home", Home is gone and so are the ⏩ buttons. A casual tapper thinks they bought a truck.
- events.js test-drive event: drop tab = 'life', make S.tradeBy = S.turn + 2, and rename the button "Look at trade-ins (+$500 bonus for 2 weeks)".
- Balance: same bonus, a fair window.

### i48-b13 The end sheet names what cost you most (M, 🟠)
The score sheet adds one line about the biggest habit, such as "96 weeks of Rest in a row: the rut cost about 40 happiness", or the commute or weeks without a job.
- Playtest: a skipper saw "Happiness average 31 → 1/100" with no reason given.
- turn.js: count S.rutWeeks, S.noJobWeeks and commute happiness lost. features.js finish(): show the largest one in plain words.
- Balance: information only. It teaches the one lesson that matters.

### i48-b14 The Relaxed end note mentions debt only if you were in debt (S, 🟡)
The Relaxed score note always says "Debt never ends a Relaxed life, so…". If you never went below $0, just say Relaxed scores are kept separately.
- Confusing on a life that finished with $11,000 saved.
- features.js modeScoreNote(): branch on a new S.everInDebt, set in weekTick.
- Balance: none.

### i48-b15 Help says when skips really stop (S, 🟡)
Help says skips stop "at New Year", but 6-month lives have no year review, so they don't. Badges and skill levels don't stop a skip either. Fix the line, or add a short New Year note to 6-month lives.
- help.js line on Skipping ahead. In turn.js the review only runs when the length is over 26 weeks.
- Balance: none.

### i48-b16 Skip buttons know how many weeks are left (S, 🟡)
Near the end, ⏩ 13 reads "⏩ 5" when 5 weeks are left, and a skip stops one week early so you play the last week yourself.
- Casual tappers end a life without seeing its last week.
- ui.js render(): change the button label and its playWeeks count. turn.js: stop at L.turns - 1 when n > 1.
- Balance: none.

### i48-b17 Relaxed shows what it saved you (M, 🟠)
The week details get a line, "🌤️ Relaxed eased: happiness +2, health +1 this stretch", and the end sheet totals it up. That makes the mode visible.
- Playtest: in 6-month lives Relaxed and Normal scored within 2 to 3 points, so players can't tell the mode is doing anything.
- turn.js: add the softened part of dh/dH/dc (and the rut, if it is softened) to S.run.relaxed and S.relaxedTotal. ui.js showRunDetails, features.js finish.
- Balance: information only.

### i48-b18 Relaxed: stats don't drift below 20 on their own (S, 🟠)
In Relaxed, weekly drift and the rut stop pulling a stat down once it reaches 20. Events and the hospital can still take it lower.
- A floor fits "play at your own pace". Today a Relaxed life can sit at happiness 0 for a year.
- turn.js weekTick: clamp the drift result at 20 when relaxed (only if it was already 20 or more).
- Balance: idle Relaxed 2-year goes from about 25 to about 30, still at or below 50. Good play is unchanged.

### i48-b19 A skip remembers what wore you down (M, 🟠)
During a skip the game tracks the biggest drains (rut, commute, no job, debt). When a stat fell 10 or more, the strip says "Happiness ▼18: the rut and a 58-mile drive".
- Playtest: the strip showed ▼ arrows, but a skipper never learned the cause.
- turn.js weekTick: add each drift part to S.run.drag. ui.js: a line on the strip and in showRunDetails.
- Balance: information only.

### i48-b20 Life Score tile shows its change since the last skip (S, 🟡)
The Home "Life Score so far" tile adds "▼5 since your last skip" (or ▲), so a skimmer sees the trend without opening anything.
- Store the score on S.run when the skip starts. Change renderHome only.
- Balance: none.

### i48-b21 A balance-sim bot that never changes focus (S, 🟠)
Add a "one-focus skipper" to the balance sim: takes the top job, never touches the focus, skips 13 weeks at a time, and answers with the first choice. Report it for Relaxed and Normal.
- This is the most common casual player, and the bots don't cover it today. Playtest: 30 to 40 on 2-year lives.
- tests/sim.test.mjs: a new bot, with a target band for Relaxed (35 to 55) so the Relaxed fixes don't overshoot.
- Balance: it keeps careless median at or below 60.

### i48-b22 A gameplay test for fast casual taps (S, 🟠)
A Playwright test plays a Relaxed 2-year life with only skips and first choices. It checks the skip buttons always come back to Home, no choice sits under a skip button, and the rut stop repeats.
- tests/flows.test.mjs, with the helpers and a seeded game. It catches the dealer tab bug and the double-tap bug from this round.
- Balance: none.

### i48-b23 Halfway card in 6-month lives (S, 🟡)
At week 13 of a 6-month life, the skip stops for a short card: score so far, your weakest stat and a focus button. It stands in for the year in review that short lives never get.
- turn.js: when L.turns is 26 and the turn is 13, push a note with the report card. Reuse sugg().
- Balance: one stop, information and a choice.

### i48-b24 A Quick life badge (S, 🟡)
Finish a Relaxed or Normal 2-year life with 60 or more points in under 40 taps of End Week or ⏩. It rewards learning the focus habit, not reading every card.
- features.js BADGES: count S.taps in playWeeks.
- Balance: needs good choices to reach 60, so careless play can't earn it.

### i48-b25 "You pick for me" on small events in Relaxed (M, 🟡)
In Relaxed, small two-button events get a third, quiet button, "You pick", that takes the no-cost, no-risk choice (marked in the event data) so the skip carries on.
- events.js: an easy index on small events. showEvent: the extra button, then resume the skip (see the "Keep going" idea).
- Balance: the easy choice is neutral by design, so it never beats choosing.

### i48-b26 Events during a skip say where you are in it (S, 🟡)
An event that stops a skip shows a small "Week 3 of 13" tag above the title, so the player knows the skip will want to carry on.
- events.js showEvent: read S.run.weeks and S.run.req.
- Balance: none.
