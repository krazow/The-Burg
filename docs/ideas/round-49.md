# Ideas round 49

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 49: The 10-minute session

Ideas from timing real headless sessions at phone size (390×844 and 360×640), aimed at shorter, clearer sittings that end well and resume easily.

### i49-a01 Game lengths say how long they take (S, 🔴)
Under each length on the title screen, show a real-time guess from timed phone play: 6 Months about 4 min, 2 Years about 11 min (7 with ⏩), 5 Years about 25 min, Lifetime about 4 hours over many sittings. New players pick a game that fits the time they have.
- Measured at 390×844 (taps 0.7 s, reading 4 words/s, 3 s per choice): 6 Months 3.3 min, 2 Years 10.7 min weekly or 7.4 min with ⏩ 4, 5 Years 17–28 min, Lifetime with Auto 3.9 hours.
- Add a `mins` field to LENGTHS in js/state.js and print it in renderTitle (js/ui.js) next to `sub`.
- Balance: text only. Numbers come from the sim report (see i49-a20) so they stay true.

### i49-a02 An event result can go straight to next week (S, 🔴)
The result sheet after an event choice gets two buttons: OK, and Next week → that closes it and ends the week with the same focus. One tap instead of two after most events.
- Measured: every choice costs two taps (choice, then OK on a ~15-word result). A Lifetime with Auto had 764 choices, so about 760 extra taps, roughly 9 minutes.
- js/events.js showEvent result step; Next week calls endTurn() after closeSheet().
- Hidden when a year in review or ending is queued, and while the focus is in a rut, so it never rushes past a warning.
- Balance: same weeks, same choices; only the tap count drops.

### i49-a03 Milestone notes ride along instead of stopping a skip (S, 🔴)
Notes like a paid-off truck or a finished class no longer stop ⏩ or Auto. They wait and show at the top of the next sheet that has to appear anyway (an event, a review or the skip's end).
- Measured: in a 5-year Auto game, 15 of 99 stops were a notes-only "N weeks later" sheet with nothing to decide.
- js/turn.js playWeeks: stop on res.notes only when a note is flagged `stop` (red stat, job loss, hospital); queue the rest in S.run.notes.
- Balance: warnings that need action still stop (keeps r48 red-stat stops). Idle bots gain nothing: no choices are skipped.

### i49-a04 Change focus from the End Week button (S, 🔴)
Tapping the small focus label on End Week opens a row of the six focus icons right above the bar. Pick one and you're back, no scrolling.
- Measured: at 390×844 the first focus row ends at 676 px, under the week strip (670), and the second row ends at 756, under the End Week bar (722). At 360×640 all six are below the bar (518). Each focus change costs a scroll, about 1.5 s.
- js/ui.js render(): split the End Week `small` label into its own button; reuse the .fbtn markup in a popover.
- Balance: same choices, faster to reach. Encourages switching focus, which is what good play does.

### i49-a05 Done for now: a sitting card, then the title (S, 🔴)
Menu gets a 'Done for now' button. It saves and shows one small card: weeks played this sitting, the dates they covered, Life Score before and after, and the best moment. Then it goes to the title.
- Gives a 10-minute session a clean end the player picks, unlike timed (i7-a16) or seasonal (i2-a15) stops.
- Track `S.sitting = {start turn, score, time}` when a life is loaded (js/ui.js loadSlot); card in showMenu.
- Balance: no reward for stopping or for long sittings, so it can't be farmed.

### i49-a06 The Continue card shows stats, focus and weeks left (S, 🟠)
Each saved life on the title screen shows four tiny stat bars, this week's focus, and weeks left (or age in Lifetime). If an event was left open, it says 'A choice is waiting'.
- Measured: today the card says only length, age, month and cash ("6 Months · age 18 · Feb 2027 · $2,892"). After a day away you can't tell if the life was going well.
- js/state.js slotLine(); stats are already in the saved slot.
- Balance: display only.

### i49-a07 The Continue card says what your last sitting did (S, 🟠)
Under each saved life: 'Last sitting: 38 weeks, Mar–Nov 2028, score 58 → 63'. You remember how far you got and whether it went well.
- Uses the sitting record from i49-a05, saved on pagehide/visibilitychange so it works even if you just close the app.
- js/state.js save() and slotLine(); js/boot.js listener.
- Balance: display only.

### i49-a08 The Journal marks where each sitting started (M, 🟠)
When you continue a life, the Journal adds a thin divider: 'You picked up here · Tue, 3 real days later'. Scrolling down from the top shows exactly what happened last time.
- Measured: in a Lifetime with Auto, a 10-minute sitting covers about 165 weeks, too many to remember. The divider gives a place to start reading.
- js/ui.js renderLog: a `sit` entry type that draws as a divider, kept out of filters and the 120-line cap.
- Balance: display only.

### i49-a09 Year in review has a 'Stop here for today' button (S, 🟠)
Next to 'On to 2029', a second button saves and returns to the title. Next Continue opens with that year's review line at the top of Home.
- Measured: in a Lifetime with Auto a review lands about every 3–4 minutes of play, the most natural stopping beat the game has.
- js/turn.js showReview; Home reads S.lastReview once on load.
- Balance: no gameplay effect.

### i49-a10 Year in review ends with 'Coming up' (S, 🟠)
The review closes with two or three forward lines: classes 6 of 12 weeks, the truck paid off in 14 weeks, turning 30 in March. A reason to come back and a memory aid when you do.
- Built from data the game has: STUDY_NEED, loanLeft, birthday, trip plans, pinned goals.
- js/turn.js showReview.
- Balance: information only; good planners already know it.

### i49-a11 'Always answer this way' for repeat small events (M, 🔴)
On the result of a small event you've seen before, a checkbox: 'Next time, answer the same way'. That event then resolves itself during skips and shows as a line in the strip. Turn rules off in the Menu.
- Measured: a Lifetime with Auto stopped 764 times for choices, and Auto averaged only 3.7 weeks per press (847 presses). Repeats are most of that.
- js/events.js: S.autoAns[eventId] = choice index; only events marked `small` (no big money, no relationships).
- Balance: it uses your own past choice, so careless play can't use it to dodge bad options; the sim's careless bot never sets it. Stat-red stops still happen.

### i49-a12 A reading-budget test (S, 🟠)
A Playwright test plays 52 weeks at phone size and counts words on every sheet. It fails if a week's median goes over 40 words or any event sheet passes 60 words.
- Measured baseline: weekly 2-year play read 1,095 words in sheets; most weeks 0, 90th percentile 37–57 words; events median 28, longest 46.
- New check in tests/gameplay.test.mjs, beside the r22 turn-budget (taps) test.
- Balance: keeps new content from slowing sessions down.

### i49-a13 Each event leads with its question in bold (S, 🟡)
Event text keeps its story but ends with a short bold line that says what you're deciding: 'Go, or stay home and save?'. Skimmers read one line and pick.
- Measured: events run 28 words on average (about 7 s of reading). The decision is often only in the buttons.
- js/events.js: an optional `ask` field per event, drawn bold under the text.
- Balance: none; same options.

### i49-a14 Stats card as one slim row (S, 🟠)
Happiness, Health, Community and Net worth fit one row of thin bars with numbers. The focus grid moves up into view above the week strip.
- Measured: the stats card is 212 px of an 844 px screen, and Home is 1,450 px tall (1.7 screens).
- js/ui.js renderHome statBtn; tap still opens the stat sheet.
- Balance: display only.

### i49-a15 Open straight into the life you played today (S, 🟠)
If you played a life in the last 12 hours, opening the app goes straight to its Home. The title screen is one tap away in the Menu.
- Saves a tap and about 15 s of reading a 59-word title screen at the start of every short session.
- js/boot.js: check the newest slot's savedAt before renderTitle(); a Menu setting turns it off.
- Balance: none.

### i49-a16 Add a play reminder to your own calendar (S, 🟡)
Menu → Reminder lets you pick a day and time; the game saves a small .ics file with a weekly repeat. Your calendar app does the reminding, offline, with no permission prompt. Delete it there to stop.
- Fits an offline PWA: no server, no push, and the game never asks twice.
- js/ui.js showMenu; build the .ics text in code like backupData does.
- Balance: no in-game reward for coming back, so no streak pressure.

### i49-a17 A Sunday reminder on installed Android, off by default (M, 🟡)
Where the browser supports periodic background sync on an installed app, an opt-in reminder shows once a week at most: 'Pat's week of Mar 3 is waiting.' Two ignored reminders turn it off for good.
- Uses sw.js periodicsync and showNotification; falls back to the .ics option (i49-a16) on iPhone and desktop.
- The text names the life and date, never guilt or rewards.
- Balance: none.

### i49-a18 A 1 Year game that fits one sitting (M, 🟠)
A fifth length: 52 weeks, about 6 minutes of weekly play. It has one year in review as its natural ending and its own net worth target.
- Measured: 6 Months takes about 3 minutes and 2 Years about 11, so nothing fits a coffee break with a full year of seasons.
- js/state.js LENGTHS (target set by the sim, near $40,000); tests/sim.test.mjs adds the length.
- Balance: target tuned so careless stays ≤ 60 and idle ≤ 50 in the sim before release.

### i49-a19 The end screen says how long the life took (S, 🟡)
Under the score: 'Lived over 6 sittings, 52 minutes.' The share card can include it.
- Sum the sitting records from i49-a05.
- js/ui.js finish screen.
- Balance: shown, never scored, so rushing doesn't pay.

### i49-a20 The sim report estimates minutes per game (S, 🟡)
The balance report gets a column: estimated phone minutes per game length and bot, from taps, sheet words and choices.
- Same model used here: 0.7 s a tap, 4 words a second, 3 s a choice, 1.5 s a Home glance.
- tests/sim.test.mjs report table; feeds i49-a01's numbers.
- Balance: catches changes that quietly add stops or reading.

### i49-a21 Apply from Home's 'No job yet' card (S, 🟠)
The 'No paycheck coming in' card gets an Apply button for the best open job you qualify for nearby, beside 'Find a job'.
- Measured: a job-hunting week costs 4 taps (Jobs, Apply, OK, back to Home) before End Week; this makes it 2.
- js/ui.js renderHome; reuse apply(id).
- Balance: same one application a week and the same odds.

### i49-a22 The progress bar shows this sitting (S, 🟡)
The header progress bar draws the part you played this sitting in a brighter shade. A glance shows how far 10 minutes took you.
- Uses the sitting start turn from i49-a05.
- js/ui.js render() header .progress; one extra <i>.
- Balance: display only.

### i49-a23 The week strip knows you were away (S, 🟡)
After coming back a day or more later, the strip above End Week says 'When you left' instead of 'Last week', so the numbers don't look like a week you just played.
- js/ui.js render() strip label; compare savedAt to now.
- Balance: display only.

### i49-a24 The app icon shows a waiting choice (S, 🟡)
If you close the app with an event open, the installed icon shows a 1 until you answer it. Nothing else ever sets the badge.
- navigator.setAppBadge where supported; clear in showEvent's choice handler.
- Pairs with the r22 fix that keeps an open event from being dodged.
- Balance: none.

### i49-a25 The first week back stops for nothing small (S, 🟠)
After a day or more away, your first End Week or skip shows only real choices; small notes from that week go into the strip.
- Measured: info-only sheets outnumber choices in long games (907 to 764 in a Lifetime with Auto). Coming back to a pile of OK buttons is the worst first impression.
- js/turn.js playWeeks reads a `back` flag set on load.
- Balance: same weeks; red-stat and job-loss stops still show.

### i49-a26 Skip totals per sitting in the Menu (S, 🟡)
The Menu's top line says 'This sitting: 12 min · 41 weeks · 3 choices'. Players learn how their skips stretch a short break.
- Uses the sitting record from i49-a05.
- js/ui.js showMenu.
- Balance: display only; no reward for speed.

### i49-a27 Lifetime parts on the Continue card (M, 🟠)
Lifetime splits into five parts by age: 18–25, 25–35, 35–50, 50–65, 65 on. The Continue card says 'Part 2 of 5' and the end of a part gets the 'Done for now' card offered once.
- Measured: a Lifetime with Auto takes about 4 hours, roughly 24 ten-minute sittings. Parts give it shape.
- js/ui.js slotLine and render header; part ends checked in js/turn.js weekTick.
- Balance: no rewards tied to parts; scoring unchanged.

### i49-a28 Pick up a skip where you left it (S, 🟠)
If you close the app while a ⏩ 13 or Auto has weeks left, Continue shows 'Keep going (9 weeks left)' on Home as a one-time button.
- Saves re-deciding after a break; the focus stays the one you chose.
- Store S.run.left in playWeeks; show in renderHome.
- Balance: same as pressing the skip again.

## Ideas 49: The small towns nearby

The small towns around Waitsburg as light stops and people you know, without new jobs or commutes.

### i49-b01 Light pins for the small towns (L, 🔴)
Touchet, Lowden, Dixie, Prescott, Starbuck, Pomeroy, Milton-Freewater and Athena show as small dots on the region map, with no jobs and no commute. Tap one for a two-line card and what you can do there.
New SMALLTOWNS table in maps.js (name, lat/lon, icon, blurb, via-town). Drawn smaller than TOWNLL pins and kept out of spread() so the big pins don't move. regionDetail() gets a light branch like LANDMARKS.
Balance: pins add nothing by themselves; any effect comes from stops below, which use the normal trip limits.

### i49-b02 Stop on the way: add one small town to a trip (M, 🔴)
A trip to Walla Walla or Dayton can add one small-town stop that lies on the road (Dixie, Touchet, Lowden, Prescott), at a few extra miles of gas instead of a whole trip.
features.js: STOPS get a `via` list; planTrip() allows one via-stop that counts toward TRIP_MAX. tripGas() adds the detour miles. maps.js draws the truck through the pin.
Balance: it still uses a stop slot and costs gas, so careless players can't stack free happiness.

### i49-b03 Small-town stops share the cooldown and fade with repeats (S, 🔴)
Going to the same small-town stop every week pays less each time, like the big-town stops already do.
Reuse S.stopLast and the existing repeat damping in features.js for every small-town stop. Help text in help.js 'trips' says so.
Balance: blocks a repeat loop that idle or Auto play could farm.

### i49-b04 Prescott: rides to practice with Prescott parents (S, 🟠)
With a kid on the Waitsburg-Prescott team, some weeks a Prescott parent offers to share practice rides. Take turns and save gas and time, or drive your own kid.
events.js kid/teen event, Prescott pin on the region map. Sets a light carpool flag for a season (features.js like S.carpool).
Balance: needs a kid on a team; skipping a turn you promised costs community.

### i49-b05 Prescott: the tavern burger night (S, 🟠)
A Thursday burger night at the Prescott tavern (stand-in: the Elevator Tap) where farm families from both towns eat. A stop for community and a chance to hear of work.
features.js STOPS entry, towns:['prescott'] via-stop; min21 off (it's a family night). 15% chance of a harvest-hours lead in the Journal.
Balance: small fx, cooldown applies.

### i49-b06 Touchet: Friday at the tavern by the tracks (S, 🟠)
Touchet's tavern (stand-in: the Gap Road Tavern) is where valley farmhands, truckers and a few Walla Walla commuters end the week. Shoot pool, hear the gossip.
features.js STOPS, min21, on the Walla Walla road. Adds a 'heard in Touchet' Journal line drawn from upcoming events.
Balance: costs money and a little health if you stay late (a choice in outabout.js).

### i49-b07 Touchet: the other small school (S, 🟠)
The Touchet school's teams play the Cardinals each winter. A home-and-away pair of game nights with Touchet families in the bleachers.
events.js seasonal pair (Dec–Feb), pinned ['R','touchet'] for the away game. Distinct from the Dayton rivalry: friendly, small crowd.
Balance: optional; going costs an evening (☺+, small gas).

### i49-b08 Lowden: a tasting room in the old schoolhouse (S, 🟡)
Lowden's wineries sit right on US-12. A stand-in winery in an old schoolhouse is a quick 21+ via-stop on any Walla Walla trip, good for a date.
features.js STOPS with min21 and date:true, via Walla Walla. Cheaper and quieter than the downtown tasting stop.
Balance: same price scaling with a partner (stopCost).

### i49-b09 Lowden: the cottonwood lane in October (S, 🟡)
In fall the cottonwoods along the Lowden farm roads go yellow. A free scenic via-stop in October only.
features.js STOPS with when:inSeason(9). Pin icon on the region map turns gold that month (maps.js).
Balance: free but only once a year, so no farming.

### i49-b10 Dixie: the honor box egg stand (S, 🟡)
A farm at Dixie has an egg cooler and a coffee can for cash. Stop on the way to Walla Walla for a dozen; once in a while the can's been stolen and you can leave extra.
features.js via-stop (cost small, ☺+1). Rare events.js follow-up 'The Dixie can went missing': chip in (🤝+1, −$10) or not.
Balance: tiny amounts; it's flavor.

### i49-b11 Dixie: the old schoolhouse open house (S, 🟡)
Once a year Dixie's restored one-room schoolhouse opens for an afternoon. Old photos, a bake sale, and someone who knew your grandparents.
events.js once a year (June), pinned ['R','dixie']. Legacy lives (S.gen>1) get a line about an ancestor's name on the class photo.
Balance: one small community bump a year.

### i49-b12 Starbuck: coffee and talk at the store (S, 🟠)
Starbuck is a few dozen people and one store (stand-in: the Tucannon Mercantile). Stop for coffee and you hear road reports, hunting news and who's selling hay.
features.js STOPS, Starbuck pin. Gives a one-line tip that lowers the odds of the next road event (events.js road weight) for 4 weeks.
Balance: a long drive (about 35 mi), so gas outweighs the perk for idle play.

### i49-b13 Starbuck: the fall wild game feed (S, 🟡)
Each November the Starbuck volunteers put on a wild game dinner. Bring a dish or just pay at the door; hunters swap stories.
events.js November event, ['R','starbuck']. Bigger bump if you have the Outdoors focus record that year.
Balance: costs a Saturday and gas.

### i49-b14 Pomeroy: the Garfield County Fair in August (M, 🟠)
Pomeroy's fair has a small rodeo, a demolition derby and 4-H barns. Go for the rodeo night, or enter a pie or a kid's animal.
events.js August event with a short choice sheet; ties into the 4-H animal idea if built. Pin ['R','pomeroy']. Distinct from Dayton's fair (Labor Day).
Balance: entry fees; a ribbon is luck plus skill, not free.

### i49-b15 Pomeroy: the courthouse lawn on a summer evening (S, 🟡)
Pomeroy's quiet Main Street and courthouse lawn make an easy picnic stop on the long way to Clarkston.
features.js STOPS, summer only, free, health+2.
Balance: long drive, so it only pays off when you're already headed that way.

### i49-b16 Milton-Freewater: a fruit stand box for the freezer (S, 🟠)
In July and August the fruit stands south of the line sell peaches and corn by the box. Buy a box and put it up: a few weeks of cheaper groceries.
features.js STOPS (cost ~$30). Sets a short grocery discount like S.stockUntil. Different from u-pick: you buy, then spend a rest week canning.
Balance: the saving only beats the gas if you plan it with another stop.

### i49-b17 Milton-Freewater: count the frog statues (S, 🟡)
The town is full of painted frog statues. Each visit you spot a few more; find them all for a small badge.
features.js badges entry with a counter in S.towns; 3–4 found per visit.
Balance: badge only, no score.

### i49-b18 Milton-Freewater: the Muddy Frogwater festival in August (S, 🟡)
The town's summer festival has a parade, a frog-jump contest and food booths. A festival-week stop with extra happiness.
Event in events.js (August) plus a seasonal stop in features.js. Pinned ['R','miltonfreewater'].
Balance: festival bonus only that week.

### i49-b19 Athena: the Scottish games in July (S, 🟡)
Athena's Caledonian Games bring bagpipes, caber tossing and a kilted crowd to a town of a thousand. A one-weekend stop with a fun Journal line.
events.js July event + seasonal stop, pin ['R','athena'] just over the Oregon line. A teen in the house may want to enter the dance contest (small cost).
Balance: one weekend a year.

### i49-b20 Athena: a cousin's family on the wheat ground (S, 🟡)
Some backgrounds give you family on a wheat farm near Athena. A Sunday dinner there now and then keeps the tie.
state.js background option adds S.kin = {town:'athena'}. events.js invitation every few months; skip too often and the tie fades.
Balance: a relationship to keep, not a free bonus.

### i49-b21 Family in a small town: weddings, birthdays and funerals (L, 🟠)
A relative in Prescott, Pomeroy or Athena means life events pull you there: a wedding with a gift, a graduation party, a funeral you can't miss.
state.js S.kin, events.js chain of family events pinned to the kin's town. Each costs gas and a gift; going gives family-happiness, missing a funeral costs a lot.
Balance: obligations, so careless play loses more than it gains.

### i49-b22 The rural mail carrier who knows three towns (S, 🟠)
A stand-in mail carrier (Darlene) runs the route through Prescott, Touchet and Dixie. Wave her down and she passes along news: a farm sale, a job, a pup that needs a home.
One NPC in events.js that shows up a few times a year with a choice; her tips point to small-town stops.
Balance: tips are leads, not rewards; acting on them still costs a trip.

### i49-b23 A Prescott date (S, 🟡)
Someone you meet at the Prescott tavern or a game can become a date: a drive on the wheat roads and dinner in Prescott.
Extends the dating events in events.js with a small-town option; adds a 'Prescott' tag to partner data.
Balance: same odds and costs as other dates.

### i49-b24 Weekend bartending in Touchet (S, 🟡)
The Touchet tavern needs a Friday-Saturday hand. A side gig that pays tips and gossip but costs sleep.
Hustle board entry (outabout.js / features.js) with a Touchet pin. Pays ~$120 a weekend, −1 health.
Balance: needs 21+, stops if health is low, so it can't run forever on Auto.

### i49-b25 The back-roads loop: Prescott, Starbuck, Pomeroy and home (M, 🟠)
A named Saturday drive through wheat country: up to Prescott, across to Starbuck on the Tucannon, Pomeroy for lunch, back through Dayton. It counts as the week's trip.
features.js a 'loop' trip type with its own route in maps.js and the truck animated around it. Gas is high (about 120 mi).
Balance: big happiness once a season, then damped; costs a full trip.

### i49-b26 Small-town Saturday spring cleanups and yard sales (S, 🟡)
One Saturday in May each small town holds a town-wide yard sale. Pick one town; find a cheap tool, a crib or a recliner.
events.js May event with a town choice; reward is a small discount or a home item.
Balance: random finds, small amounts; the gas can eat the deal.

### i49-b27 A ride from a farmer at the Prescott grain scale (S, 🟡)
If your truck dies on a small-town road, the farmer at the nearest scale gives you a lift. Next harvest he asks a favor back.
events.js road breakdown variant pinned to a small-town pin; sets a chain flag for the favor (a weekend of hauling, community+).
Balance: the favor costs a focus week if you accept.

### i49-b28 Small towns get a line in the weekly news (S, 🟡)
Once a month the Tattler's back page has a 'Around the valley' note from one small town: a new café, a water main, a fair result.
Text-only Journal/News line from a small table in events.js, linked to the pin.
Balance: no effect, just flavor and a hint at seasonal stops.

### i49-b29 Know the back roads badge (S, 🟡)
Visit five of the eight small towns in one life and earn a badge.
features.js badges entry like 'roadtrip', using S.towns with the small-town keys.
Balance: badge only, counted in the end screen, no score.

### i49-b30 Help page: the small towns (S, 🟡)
A short help section lists each small town, what you'd go there for, and that they're stops, not places to work.
help.js new section after 'trips'. Numbers (miles, months) come from the SMALLTOWNS and STOPS data, not typed in.

### i49-b31 Small-town stops in the playtest bots (S, 🟠)
The careless, idle and good-play bots get a rule for small-town stops so balance checks cover them.
tests/ bot scripts: good play uses via-stops, careless spams them, idle never plans. Check targets: careless median <= 60, idle <= 50, good >= 70.
