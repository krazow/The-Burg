# Ideas round 27

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 27: The owner's tools

Tools that make adding and tuning content faster and safer for the owner and for Claude; none of them change how the game plays.

### i27-a01 This week's odds, and why an event won't fire (S, 🔴)
In the ?dev=1 panel, list every event that can fire this week with its real chance (category roll × weight share). Pick any other event and it says why not: wrong month, cooldown until week N, once and done, weight 0, no job or no long drive.
Touches: Reads eventOdds() and pickEvent()'s filter in events.js; no game change.
Balance: Read-only view; never touches S.

### i27-a02 Try an event without keeping the result (M, 🔴)
Preview any event sheet as it would look right now, tap a choice, and see the result line plus the exact change to money and stats. Then it rolls everything back, so you can try every button on the same save.
Touches: Copies S (and the dice state) before showEvent(), restores after; panel in ui.js, behind ?dev=1.
Balance: Dev only; nothing is saved.

### i27-a03 Dev-touched lives never set best scores (S, 🔴)
Any life where the panel jumped weeks, set stats or forced an event gets a dev flag. It shows a small wrench on the save slot and is left out of best scores, badges and the weekly challenge.
Touches: S.dev in state.js; checks in the best-score and badge code.
Balance: Keeps tools from ever leaking into real results or bragging rights.

### i27-a04 What changed this week: a save diff (S, 🔴)
After End Week, the panel shows only the save fields that changed and by how much (money -312, happy +4, evCd['Flood'] set to week 61). Bugs like a stat that drifts every week stand out at once.
Touches: Snapshot S at the start of the turn in turn.js, deep-compare after, render in the panel.
Balance: Read-only.

### i27-a05 Bug codes that replay to the exact week (L, 🔴)
The game keeps a short list of the player's inputs per week (focus, choices, trips, stops). 'Copy bug code' in the menu packs the seed, rules and that list into one string; tools/replay.mjs plays it headless and stops at the reported week with the same events.
Touches: Builds on seeded dice in features.js (S.rng, S.rngEv); an input log in S; a Playwright script in tools/.
Balance: Input log is small and capped; no effect on play.

### i27-a06 Balance dashboard from sim runs (L, 🔴)
The sim writes its results to sim-report.json, and tools/dashboard.html draws them: score spread per bot, per length, per mode and start, with the careless and idle ceilings drawn as lines. Open it offline in any browser.
Touches: tests/sim.test.mjs writes JSON; a single static HTML page with simple SVG charts.
Balance: Makes the 60/50/70 targets visible at a glance.

### i27-a07 Balance diff on every pull request (M, 🔴)
CI keeps main's last sim-report.json. On a PR it posts a short table: careless 56 → 59, good play 86 → 84, Flood fired 14 → 31 times, farmhand pay rank 9 → 6. Only rows that moved more than the dice usually do are shown.
Touches: GitHub Actions artifact plus a small compare script in tools/; posts to the job summary or a PR comment.
Balance: Catches quiet balance shifts the ceilings alone miss.

### i27-a08 A cost() check for hand-typed dollars (S, 🔴)
A lint finds money changes written as plain numbers (money:-250) instead of cost(250), and labels that show $ without fmtc(). Prices typed in today's dollars break once the years go by.
Touches: Node script in tools/lint-content.mjs over events.js, outabout.js, features.js; run in npm test.
Balance: Keeps late-game prices fair at every decade.

### i27-a09 Button price matches what it charges (S, 🔴)
For each choice, the lint compares the amount in the label (fmtc(60)) with the amount in go() (cost(60)). A button that says -$60 and takes $90 fails the test.
Touches: Regex pairing inside each choice object in tools/lint-content.mjs.
Balance: Players never pay more than the button says.

### i27-a10 Every event has a real map pin (S, 🟠)
The lint lists events that fall back to the default home pin, pins that name a place missing from maps.js, and road or work events whose pin can't show for a player who doesn't commute.
Touches: Checks EVENT_PLACE and eventPlace() against the place lists in maps.js.
Balance: Content quality only.

### i27-a11 Sheets that fit on a small phone (M, 🟠)
A Playwright pass opens every event sheet at 320×568 and flags any that need scrolling to reach the last button, or whose title wraps to three lines.
Touches: New check in tests/screens.test.mjs using the preview from the panel code.
Balance: No balance effect.

### i27-a12 Every choice writes a journal line (S, 🟠)
A test fires every choice of every event on a stock save and fails if go() returns nothing, returns 'undefined', or leaves NaN anywhere in S.
Touches: Loop in tests/rules.test.mjs over EVENTS, ROAD_EVENTS, WORK_EVENTS with a restored S per choice.
Balance: Catches silent choices that cost money with no explanation.

### i27-a13 Choice outcome table (M, 🟠)
For every choice, run it 200 times on a typical age-30 save and print the low, middle and high result for money, happy, health and community. Choices that are always best, or never worth it, jump out.
Touches: tools/choice-table.mjs, reuses the event loop above; writes a CSV and a dashboard tab.
Balance: Spots free-win buttons that would let careless play score high.

### i27-a14 Big swings need a tag (S, 🟡)
Any choice that can move a stat by more than 12 or money by more than ten weeks of pay must carry a big:true tag, so huge outcomes are on purpose and rare.
Touches: Lint over the choice outcome table; tag read nowhere else.
Balance: Guards against one lucky button deciding a life.

### i27-a15 Season words match the months (S, 🟡)
A small word list (snow, harvest, rodeo, Fourth, school) checks that events mentioning them only allow fitting months in when(). A snowy road in July fails.
Touches: Calls each event's when(m) for m 0–11 in the lint script.
Balance: Content only.

### i27-a16 Event catalog page (M, 🟠)
tools/events.html lists every event with icon, category, months, place, age limits, once or repeat, and cooldown. Filter by town, season or category to see where the gaps are.
Touches: Loads the game's js files in a plain page and reads EVENTS; no build step.
Balance: Planning aid; no game change.

### i27-a17 Content counts by season and place (S, 🟡)
npm run content prints how many events each category, town, month and age band has, and marks thin spots (two winter work events, nothing in Prescott).
Touches: Small node script reading the event list; complements the sim's firing counts.
Balance: Helps spread new events so no stretch goes flat.

### i27-a18 Score breakdown per bot (S, 🟠)
The sim report shows which parts of the Life Score each bot earns most from (money, health, happiness, community, goals). If idle play is propped up by one part, that is the one to fix.
Touches: Split the score calculation into named parts that sim.test.mjs can read.
Balance: Points tuning at the right lever.

### i27-a19 Jobs report from the sim (M, 🟠)
Per job: how many bots took it, weeks held, take-home after commute, and the average score of lives that ended in it. Jobs no bot ever picks, or that every bot ends in, are flagged.
Touches: Counts in the sim bot loop; a jobs tab in the dashboard.
Balance: Keeps any one job from being the only right answer.

### i27-a20 Event money and score impact (M, 🟡)
Next to how often each event fires, the report shows what it does over a game on average: total dollars and stat points. The events that quietly make or break lives are listed first.
Touches: Uses S.run.happened in events.js, summed in sim.test.mjs.
Balance: Finds events that tilt the score more than intended.

### i27-a21 Weekly stat lines for one bot life (M, 🟡)
Pick a bot and seed, and the dashboard draws its money, happy, health and community week by week, with markers where events hit. Flat stretches and cliffs are easy to see.
Touches: sim.test.mjs saves a per-week series for a few chosen games.
Balance: Spot-check tool for pacing.

### i27-a22 Ceiling headroom in the sim summary (S, 🟠)
The job summary shows careless and idle medians beside their ceilings with a plain warning when either is within 2 points, before the test actually fails.
Touches: A few lines in tests/sim.test.mjs.
Balance: Early warning on the 60 and 50 targets.

### i27-a23 Try a tuning change in the sim from the command line (M, 🟠)
SIM_TUNE='EVENT_ODDS.town=0.18' runs the sim twice, as-is and with the change, and prints the two reports side by side. No code edit needed to try a number.
Touches: Init script in tests/helpers.mjs applies the override after load; reuses the diff from the PR tool.
Balance: Lets balance changes be tested before they are made.

### i27-a24 All the balance numbers in one file (M, 🟡)
Event odds, pay raise caps, price growth, ceilings and other knobs move into js/tuning.js with a plain comment each. The dev panel can change them for the current session only.
Touches: New script before state.js; sw.js file list and tests updated.
Balance: Easier tuning; session overrides mark the life as dev.

### i27-a25 A fast sim that runs without a browser (L, 🟡)
Load the game scripts in Node with a tiny fake page, so a tuning run of 300 games takes seconds instead of minutes. CI still runs the browser sim as the final word.
Touches: tools/fastsim.mjs using node:vm and stubbed render(), toast() and storage.
Balance: Faster loops mean more careful tuning.

### i27-a26 Save doctor: paste a save and check it (S, 🟠)
Paste a save from a player into the panel. It runs the upgrade steps, lists fields that were added, fixed or are unknown, and loads it as a dev life to look at.
Touches: Calls the migrate code in state.js; panel in ui.js.
Balance: Dev life only; never overwrites a real slot.

### i27-a27 Pin a moment and come back to it (S, 🟠)
The panel can keep a few snapshots of the current life. Restore one to replay a tricky week or an event chain from the same spot.
Touches: Dev-only localStorage key; restores S and the dice.
Balance: Restored lives carry the dev flag.

### i27-a28 Walk a story chain step by step (M, 🟡)
Pick a story chain and the panel steps through each stage in order, showing its text and choices and what the next stage needs. Broken links in a chain show up right away.
Touches: Reads S.chains and the chain data in features.js.
Balance: Content check only.

### i27-a29 Mistakes show on screen in dev mode (S, 🟠)
With ?dev=1, a small bar shows any error, any NaN passed to adj(), and any stat that was clamped at 0 or 100, with the week it happened. Tap it to copy the details.
Touches: Wraps adj() and window.onerror in dev mode only.
Balance: No effect for players.

### i27-a30 Prices across the decades (S, 🟡)
A report shows each event's cost at 2026, 2046 and 2066 next to a typical week's pay in those years, flagging costs that become trivial or crushing.
Touches: Calls cost() with different years in a node script.
Balance: Keeps old-age events fair in long lives.

### i27-a31 New-event starter (S, 🟡)
npm run new-event asks for a title, category, months, place and two choices, then adds a ready skeleton to events.js with cost(), fmtc(), a place pin and a returned line.
Touches: tools/new-event.mjs; the lint runs right after.
Balance: Fewer mistakes in new content.

### i27-a32 Help and data agree (S, 🟡)
A check makes sure every job, stop, town and focus named in help.js exists in the game data, and that every job and stop has a Help mention.
Touches: Node script comparing help.js text with JOBS, CITIES, FOCUS and the stops in outabout.js.
Balance: Players never read about something that isn't there.

## Ideas 27: The long-term vision

Where The Burg could go over the next few years, with each idea a concrete next step toward versions 2.0 (people), 2.5 (seasons) and 3.0 (towns), and a few rules for keeping it small and good.

### i27-b01 Name the next three versions: 2.0 People, 2.5 Seasons, 3.0 Towns (S, 🔴)
Write down one theme per version so every idea on the board has a home: 2.0 brings people (the NPC plan), 2.5 ties the game to the real Waitsburg year, 3.0 opens other towns on the same engine.
- A short 'Where this is going' section in TODO.md with three themes and what each must ship to be done.
- Board items get a version tag (2.0, 2.5, 3.0, later), so the build board can filter by it.
- Touches TODO.md and the board only. No game change, so no balance effect.

### i27-b02 A 'not building' list in the README (S, 🔴)
A plain list of what The Burg will never have, so it stays small and good: no accounts, no ads, no chat, no named leaderboards, no real-money buys, no live server it depends on, no data from minors.
- README.md and Help get the same short list, with one line on why for each.
- New ideas that break a line get closed with a link to it, which saves review time.
- No game change; protects the offline, private design that every later idea builds on.

### i27-b03 Move Waitsburg's data into one town file (M, 🔴)
Gather CITIES, JOBS, town map places, map coordinates and town blurbs into js/town-waitsburg.js, one TOWN object the rest of the code reads. Nothing changes for the player; it is the first real step toward other editions.
- state.js (CITIES, JOBS), maps.js (townPlaces, TOWNLL, TOWNIC, LANDMARKS) and features.js (STOPS) read from TOWN.
- index.html and sw.js load and cache the new file.
- Rules tests and the sim must give the exact same results before and after: a pure move, so balance can't drift.

### i27-b04 Every save knows its home town (S, 🔴)
Add S.town = 'waitsburg' to new and migrated saves, and show the town on save slots. Old saves keep working, and a future Dayton or Walla Walla life won't load the wrong map.
- state.js save migration adds the field; ui.js slot rows show 🏡 Waitsburg.
- Best scores are kept per town (BEST_KEY gets a town key), so towns don't compete unfairly.
- Offline test: an old save loads, plays and keeps its best score.

### i27-b05 Find every hard-coded 'Waitsburg' in game text (S, 🟠)
A small tool lists every line in js/*.js that names Waitsburg, the Touchet or Main Street outside the town file, and marks which ones should come from TOWN instead. It shows how big an edition really is before anyone starts one.
- tools/town-words.mjs prints a count and a list per file; a docs note records the result.
- Lines that are truly about Waitsburg (its history, its events) stay as they are and get a town tag.
- Developer tool only. No balance effect.

### i27-b06 Engine and content in separate folders (L, 🟡)
Split the code into js/engine (turns, money, events, saves, maps) and content/waitsburg (jobs, places, events, calendar). An edition becomes a new content folder, not a copy of the game.
- Builds on the town file and the events-as-data idea; done in small pull requests, one system at a time.
- sw.js caches the engine plus the chosen town's folder.
- Every step must pass the full test suite and the sim unchanged.

### i27-b07 A new-town checklist (S, 🔴)
One page that says exactly what a town needs before it can be an edition: a town map with about 10 places, 15–25 jobs within an hour's drive, 40 events, a yearly calendar, stand-in business names and a local reviewer.
- docs/new-town-checklist.md, with Waitsburg filled in as the worked example.
- Each line links to the file or data table it fills.
- Stops a half-built town from shipping. No game change.

### i27-b08 A town champion for each edition (S, 🟠)
Every town edition has one local adult who reads its events, checks the places and flags anything wrong or unkind before release. Waitsburg gets one first, so the habit exists before Dayton.
- Credited by first name in the Made-with-the-town page; their checklist is part of the release steps.
- Review happens on a printed or shared list of new text, not in the code.
- Keeps real-town content accurate. No balance effect.

### i27-b09 Dayton edition pilot: a home town 11 miles up the road (L, 🟠)
Start a life living in Dayton, with its own town map (courthouse, depot, the pool, Bluewood up the hill), its own home events and Waitsburg as the next town over. It reuses the same region map and jobs, so it is the cheapest second town.
- A content/dayton town file: 10 places, 30 home events, Dayton-side commute miles, its own calendar.
- Not the same as moving to another town mid-life: this is a separate edition with its own best scores.
- Must pass the sim on its own: careless ≤ 60, idle ≤ 50, good ≥ 70, before it is shown to players.

### i27-b10 'Pick your town' card that stays hidden until it's real (S, 🟡)
The title screen gets a town picker only once a second edition passes its checklist. Until then nothing shows, so there are no empty promises or 'coming soon' buttons.
- ui.js title screen reads the list of ready towns; with one town, no picker.
- The picker shows each town's map thumbnail and a one-line blurb.
- No balance effect; best scores are already kept per town.

### i27-b11 Walla Walla edition as the 3.0 big-town test (L, 🟡)
A bigger town plays differently: more jobs close to home and shorter drives, but higher rent and slower community growth because fewer people know you. It proves the engine works for more than tiny towns.
- A content/wallawalla town file with rent, community gain and job tables; Waitsburg becomes a small town nearby.
- Community per week is lower so a town of 30,000 doesn't hand out standing as easily.
- Its own sim run and targets; it must not score higher than Waitsburg for the same bot.

### i27-b12 The sim plays every edition before it ships (S, 🟠)
tests/sim.test.mjs loops over every town folder and writes one balance table per town. A town that misses the targets fails the build.
- Same seven bots, same seeds, one section per town in the balance report.
- Catches a town that is too easy because jobs are closer or rent is cheaper.
- Directly enforces careless ≤ 60, idle ≤ 50, good ≥ 70 per town.

### i27-b13 Your heir can grow up in the next town over (M, 🟡)
When a legacy life starts, the heir can choose to start in Waitsburg or any other ready edition. The family history and heirlooms carry over, and the new town's map starts with one pin: Grandpa's old house.
- features.js startLegacy gets a town choice; the save's town changes for the new life only.
- Only shows once there are two or more editions.
- No money or score carries over beyond today's legacy rules, so it can't be used to farm points.

### i27-b14 2.5 'Seasons' starts with a real-year calendar file (M, 🔴)
One data table lists Waitsburg's year as it really runs: Celebration Days in May, the fair over Labor Day weekend, harvest, the first home football game, the Christmas lights. Events and pins read their dates from it instead of hard-coded months.
- content/waitsburg/calendar.js with a week number, a name and a pin for each date.
- events.js 'when' checks call calendar names (cal('fair')) instead of month numbers.
- Same events at nearly the same weeks, so balance holds; the sim checks event counts per year.

### i27-b15 Update the calendar every January as a release step (S, 🟠)
The release checklist gets one yearly step: check next year's real dates (Celebration Days weekend, fair dates, school start) with the town champion and update the calendar file.
- Added to the shared release kit's checklist and the /releasenow notes for The Burg.
- A rules test fails if the calendar's year is older than the current year.
- Keeps the real-town tie true over years. No balance effect.

### i27-b16 The first seasonal drop: Celebration Days, May 2027 (M, 🔴)
Pick one real weekend and ship a small drop for it: three new events, a parade pin on Main Street that week, and one badge. It sets the size of every later drop and tests the whole routine end to end.
- A drop is a dated content file (content/waitsburg/drops/2027-05.js) loaded like any events.
- Drop events have normal cooldowns and once-only flags.
- Each drop event is capped like other town events and runs through the sim; no drop adds more than about 1 point to good play.

### i27-b17 Drops stay in the game as reruns (S, 🟠)
After its season, a drop's events stay in the pool at a lower weight instead of vanishing, so offline players and late installers still meet them. The game never needs the internet to have its content.
- Drop events get a 'rerun' weight after their first year; the badge stays earnable.
- The What's new note lists the drop once, then it is simply part of the game.
- Lower weight keeps the event mix from swelling as drops pile up; the sim's event coverage report watches it.

### i27-b18 The town layer: one switch, off by default (S, 🔴)
Settings gets a single 'Town news from Waitsburg' switch with a plain note: when on, the game checks one small file once a week when online. When off, nothing ever leaves or enters the phone.
- maps.js prefs stores the switch; Help explains exactly what is fetched and that nothing is sent.
- The first-run screen mentions it once, in one line, and doesn't nag.
- No balance effect; the game plays the same either way.

### i27-b19 A tiny town file the game can read, never needs (M, 🟠)
When the town layer is on, the game fetches a hand-edited town.json (under 2 KB) from the game's own site: this week's real happenings and a date it expires. It is cached, read once a week, and ignored if it is late, broken or missing.
- boot.js fetch with a short timeout; sw.js caches it; a schema check drops anything malformed.
- Contents show only as flavor lines on the town map and a Home note, never as effects.
- Because it never changes money or stats, it can't help or hurt any score.

### i27-b20 Town averages from the bots, shipped with each release (S, 🟡)
The ending screen can show 'most lives in this version averaged 64' and 'you spent more weeks at the river than most', using numbers from the balance sim baked into the release. No player data is collected.
- The sim writes a small averages file; the release copies it into the game.
- The ending card adds two plain comparison lines.
- Gives context without a server or tracking. Display only, so no balance effect.

### i27-b21 A community-written chapter: 'The Year the Elevator Closed' (L, 🟠)
A six-week story arc in town, with each step written by a different local at a writing night, then edited to fit the game. It ships as one story chain with a credit line on each step.
- Uses features.js STORY_EVENTS and chainSet like today's stories; each step names its writer by first name.
- Written drafts come in through the NPC form's 'your own event' page or on paper.
- Each step has capped effects like any story event, and the whole chain goes through the sim.

### i27-b22 A writing night at the library (S, 🟠)
Host one evening a year where people draft events and chapter steps on a printed template: the place, the situation, two or three choices and what each one costs. It brings in people who would never fill an online form.
- A one-page printable template in docs, matching the event data fields.
- Drafts are typed in by the maintainer and reviewed like NPC submissions.
- Content only; every event still gets capped effects and a sim pass.

### i27-b23 A paper form for the NPC plan (S, 🟡)
Print the 2.0 'Be in the game' questions on one sheet for the library and post office, with the same consent boxes. Older neighbors without smartphones can still become characters.
- A printable version of the npc-submissions.md questionnaire, kept in step with the form version.
- The import tool gets a 'typed from paper' source field.
- Same review, 18+ rule and removal rules as online. No balance effect.

### i27-b24 Credits inside the moment, not just on a page (S, 🟡)
When an event or NPC was written by a local, a tiny 'written by Marge, Waitsburg' line sits under its text. Players see the town making the game while they play.
- events.js and the NPC data get an optional 'by' field; showEvent renders it in small text.
- Only first names or nicknames, by the same rules as the NPC plan.
- Display only. No balance effect.

### i27-b25 A school partnership: one student event pack each spring (M, 🟡)
Waitsburg High students write five events about being a teen in town, as a class project with their teacher. They are reviewed like any submission and ship in the June release with the class credited.
- Uses the writing-night template and the events-as-data format.
- Students under 18 give only their class name, never their own names or details, matching the 18+ rule for personal characters.
- Events have normal caps and go through the sim.

### i27-b26 A historical-society fact check before history ships (S, 🟠)
Any event that states real Waitsburg history gets checked by the local historical society or museum volunteers before release. A small 'checked' mark appears in Help's Waitsburg for real page.
- History events get a 'checked' field; a rules test lists unchecked ones before a release.
- Builds on history and Bruce House ideas already on the board.
- Accuracy only. No balance effect.

### i27-b27 A 'make your own town' guide for other small towns (M, 🟡)
A docs guide that walks a teacher or a town group through building their own edition: copy the town folder, fill the checklist, run the sim. Other small towns can use the engine without the maintainer doing the work.
- docs/make-your-town.md uses Waitsburg and the Dayton pilot as examples.
- Only written after the engine and content split is done, so the steps are true.
- Each town's own sim run is part of the guide.

### i27-b28 Decide the license: open engine, Waitsburg content kept (S, 🟠)
Pick a license before anyone forks it: the engine code could be open, while Waitsburg's events, art and submitted characters stay with the project. People who submitted characters were promised exactly where their words go.
- A LICENSE file plus a short note in README and the privacy note; ties to the Krazow LLC plan.
- Submitted NPCs and chapters are never relicensed without asking.
- No game change.

### i27-b29 One big thing per version (S, 🟠)
A simple rule for staying small: each version adds one big feature (people, seasons, towns) plus fixes. Everything else waits, and the board shows what the big thing is.
- Written in TODO.md next to the version themes; the build board marks the one big item.
- The release notes lead with it, so players know what changed.
- Fewer moving parts per release means cleaner sim results.

### i27-b30 A size and speed budget the tests enforce (S, 🟠)
The smoke test fails if the game's files grow past a set size (say 1.5 MB) or the first screen takes over 2 seconds on a slowed-down phone. New towns and drops must fit, or something gets cut.
- tests/smoke.test.mjs sums the cached files from sw.js and times first paint with CPU throttling.
- Budget numbers live in package.json so they're easy to see and change on purpose.
- Keeps the game fast on old phones. No balance effect.

### i27-b31 A yearly cut list: retire what nobody uses (S, 🟡)
Once a year, use the sim's event coverage and the bot averages to list features and events that rarely fire or add little, and cut or merge a few. The game gets better by getting smaller too.
- A 'cut list' section added to the year's review in docs, decided by the maintainer.
- Removed events keep their title in a list so old saves' once-only flags still read cleanly.
- Each cut goes through the sim so targets still hold.

### i27-b32 A 'State of the Burg' note on the game's birthday (S, 🟡)
Each November, one short What's new page: what shipped this year, which locals helped, and the one big thing for next year. It keeps the long-term plan honest and visible to players.
- Shown once in the What's new sheet; also posted on the game's site.
- Written from TODO.md and the build board's done items.
- Display only. No balance effect.
