# Ideas round 44

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 44: When the town pulls together

Big shared moments where the whole town pulls together for weeks, with roles you can take, real costs, and a record of how the town remembers.

### i44-a01 A town crisis engine: multi-week arcs with phases (L, 🔴)
A shared S.crisis object in features.js runs one town-wide crisis at a time through phases (warning, the hard week, cleanup, afterward), each phase an event a few weeks apart, with a banner on Home while it runs.
- One crisis at a time, at most one every 18 months, picked by month and conditions.
- Phases reuse chainSet/chainAt in features.js; a crisis banner sits on Home in ui.js.
- Balance: no crisis hands out net gain without cost; idle play just gets the 'stay home' path.

### i44-a02 Pick your role when the town calls (M, 🔴)
Each crisis opens with a role choice: Hands (labor, costs health), Kitchen (cooking, costs money and a week of rest), Driver (miles and gas), Organizer (needs People skill), Donor (cash only) or Stay home.
- Your role stays for the whole arc and changes the later phases' text and choices.
- Uses skillLv() and practice() in features.js; roles read CARS and commute for Driver.
- Balance: every role costs something real; Donor gives the least community per dollar so money can't buy a pillar score.

### i44-a03 The Town Book: crises you lived through (M, 🔴)
A new card on the Life tab lists each town crisis, the year, and the role you took, and the end screen adds one line for the biggest one.
- Stored in S.townBook; written when a crisis ends.
- Touches ui.js (Life tab, end screen) and features.js.
- Balance: a record only, no score; it makes showing up feel remembered.

### i44-a04 Fire in the wheat on the ridge (L, 🔴)
In late July a combine spark starts a field fire north of town; over four weeks you can run a water trailer, cut a firebreak with a neighbor's disc, then help with lost-crop hay and a benefit dinner.
- Week 1: the fire night (Hands risks a health hit, Driver hauls water).
- Week 2–3: the burned farm needs hay, fencing and a meal train.
- Week 6: a benefit auction at the fairgrounds.
- Balance: only fires in July–August of dry years; your own wheat lease can be singed if you ignore it.

### i44-a05 Ice storm: five days without power (L, 🔴)
A January ice storm drops lines across the valley; over three weeks the town runs a warming room at the church, shares generators, and the power co-op holds a meeting about burying lines.
- Week 1 outage: choose to host neighbors, run a generator, or ride it out (heat bill vs. health).
- Week 2: limbs everywhere; chainsaw work uses Handy.
- Week 4: the co-op meeting asks for a vote and a small fee.
- Different from the windstorm freezer event: it's a whole-town arc.

### i44-a06 Missing hiker in the Blues (L, 🟠)
A teen from Dayton doesn't come back from a day hike; for two to three weeks the town walks search lines, feeds the command post at the trailhead and passes out flyers.
- Search lines cost health and a work day; the command post costs money; flyers use the car.
- The outcome is chance-based but more volunteers raise the odds of a good ending.
- Ends with a trail-marker dedication either way, written gently.
- Not the same as joining search and rescue: this is one town-wide search anyone can join.

### i44-a07 The levee gets tested (M, 🟠)
Only after the levee story is done: a spring night the Touchet rises to the top of the new levee and you walk a night watch with a flashlight, then the levee district bills every home.
- Reads chain('levee') flags; volunteers who built it get first call.
- Second phase: pay the assessment, fight it at the meeting, or ask for a payment plan.
- Balance: the bill is small; skipping the watch costs community only if your house is by the river.

### i44-a08 The grocery store says it's closing (L, 🔴)
The only grocery in town posts a closing sign; over two months the town tries a co-op buyout and you can buy a member share, work a volunteer shift or keep driving to Walla Walla.
- If the co-op opens, grocery runs in town come back cheaper and it shows on the Main Street map.
- If not, every grocery run costs Walla Walla miles for good.
- Uses the business list in outabout.js with a stand-in name.
- Balance: the share is a real cost with a slow, small payback.

### i44-a09 The clinic loses its doctor (M, 🟠)
The town clinic's doctor retires with no one lined up; the town spends a season recruiting one and you can host the visiting candidate for dinner or give them a tour.
- Until a doctor signs, appointments go to Walla Walla (miles and time).
- A good tour and community 50+ raise the odds the doctor stays.
- Touches outabout.js (clinic) and the appointments code.
- Balance: no shortcut; it changes travel, not stats directly.

### i44-a10 The Preston Avenue bridge washes out (M, 🟠)
A spring storm takes out the small creek bridge on the way out of town; for three months the detour adds miles, the school bus reroutes and neighbors reshuffle carpools.
- A temporary commute penalty while S.crisis is active; carpool choices offset it.
- You can run a coffee stand at the detour for tips or join the cleanup crew.
- Shows a closed-road marker on the Waitsburg map in maps.js.

### i44-a11 The heat dome: ten days over 105 (M, 🟠)
A July heat wave where the town keeps a check-on-list of older neighbors; you can take a route, drive people to the cool room in Walla Walla, or shift harvest work to nights.
- Each skipped check has a small chance of a sad note about a neighbor; each kept one gives community.
- Different from the cooling-bill event: this is about other people.
- Balance: health drains for everyone outdoors; resting at home is a fair choice.

### i44-a12 The school roof fails: class in the church hall (M, 🟠)
A January roof collapse (no one hurt) moves the grade school into church basements for a semester; parents drive, teachers improvise and the town raises roof money.
- Parents get a weekly driving cost; non-parents can help teach a lesson or run a bake sale.
- Ends with a back-to-school day in the fixed building.
- Touches kids code in state.js and features.js.

### i44-a13 No one to run Celebration Days (M, 🟡)
The longtime organizer steps down and the festival is about to be canceled; you can take a committee job months ahead, which costs weeks but changes the festival event when it comes.
- Ties into the existing Celebration Days event in events.js with a better version if you helped.
- Organizer role uses People skill.
- Balance: weeks spent planning replace a focus, so it trades against work and rest.

### i44-a14 Fire district levy fails: nights go dark (M, 🟡)
The rural fire levy fails and the station can't cover nights; over a season you can join the volunteer roster, knock doors for the re-vote or just vote.
- While unstaffed, home fire events cost more.
- The re-vote passes more often if community in town is high.
- Touches features.js events and the volunteer fire ideas already on the board without repeating them.

### i44-a15 The packing plant fire: 80 jobs on hold (M, 🟡)
A fire at a Dayton food plant idles workers for two months; the town runs a food box line, and you can hire a worker for odd jobs or help at the line.
- If you work there, you're laid off with a recall date; if not, you see your neighbors' side.
- Uses LAYOFF_RISK and the jobs list in state.js.
- Balance: recall is likely, so it hurts but doesn't end a career.

### i44-a16 The big drift: farm roads shut for ten days (M, 🟡)
After a February blizzard county roads to the farms drift shut; you can ride along with the plow, deliver medicine by snowmobile with a neighbor or keep your own lane open.
- Two to three phases over a few weeks.
- Outdoors and Handy skills help.
- Different from the snow-day scramble: it's about cut-off farms, not school.

### i44-a17 Take in a family for a month (M, 🟠)
When a crisis leaves a household without a home, you can offer your spare room; for four weeks food costs rise, rest is harder, and you get a lasting friend.
- Only if your home has room (HOMES in state.js).
- Each week a short scene; kids at home add a choice.
- Balance: real money and happiness costs up front, community and a named neighbor after.

### i44-a18 Meal train sign-up sheet (S, 🟡)
A neighbor with a long illness gets a meal train; you pick weekly slots across six weeks and each one costs a little money and a rest week's worth of time.
- A small sheet in ui.js with dates to tick.
- Skipping after signing up costs more than never signing.
- Balance: capped community per week.

### i44-a19 The town phone tree (M, 🟡)
You're given five neighbors to call in any emergency; each crisis asks if you make the calls, and the tree grows or shrinks with how reliable you've been.
- Stored as S.phoneTree; shows in the Town Book.
- A reliable tree makes later crisis phases go better.
- Balance: one quick choice per crisis, small rewards that build over years.

### i44-a20 The boss and your missed shifts (M, 🟠)
Helping during a crisis can mean missing work; your boss may give you the day, dock your pay or show up to help, based on the job and your record.
- Reads job type and performance in turn.js.
- Shift workers get docked; office jobs often allow it.
- Balance: makes helping cost something honest without punishing it twice.

### i44-a21 Too much at once: a step-back choice (S, 🟠)
If you've helped in a crisis in the last six months, the next one offers a 'step back this time' choice with kind text, and pushing on costs extra health.
- A check in the crisis engine in features.js.
- The text says plainly that resting is fine.
- Balance: stops grinding community from crises.

### i44-a22 Crisis week on the map (M, 🟡)
During a crisis the Waitsburg and region maps show the command post, warming room, closed roads and burn area as temporary markers.
- Temporary pins in maps.js keyed by S.crisis.
- Tapping a pin opens that phase's choices.
- No balance change; it makes the arc readable.

### i44-a23 The Tattler special edition (S, 🟡)
Each crisis ends with a special edition headline in the weekly Tattler line, and if you took a role your name is in the volunteer list.
- Adds lines to TATTLER in outabout.js keyed to S.townBook.
- Plain text, no score.

### i44-a24 One year later: the town remembers (S, 🟡)
On the crisis's anniversary a short scene comes up: a potluck by the burned field, a plaque on the bridge, a neighbor bringing it up at the café.
- A one-choice event keyed to S.townBook dates.
- Text changes with the role you took.
- Balance: small happiness only.

### i44-a25 Who's to blame: the argument after (M, 🟡)
After a crisis the town argues about it (the burn ban, the bridge inspection, the co-op's books); you can take a side, keep the peace or stay out.
- Taking a side gains friends on one side and costs on the other.
- Keeping the peace needs People skill.
- Touches neighbor relationships if those are built.

### i44-a26 Kids help too: sandwiches and sandbags (S, 🟡)
If kids are at home, crisis phases add a family choice: bring them along to help, which costs a little and adds happiness and a kid memory.
- Uses kidsAtHome() in state.js.
- Older kids can do more.
- Balance: small, family-only bonus.

### i44-a27 Spaghetti feed at the Legion hall (S, 🟡)
A closing benefit dinner for any crisis: buy a plate, work the line or donate a pie, with the money raised shown in the Tattler.
- A reusable last phase for the crisis engine.
- Cooking skill can make your pie the top bid.
- Balance: cheap, small community; good for low-money players.

### i44-a28 Hard mode: crises run longer (S, 🟡)
In Hard mode crisis phases are spaced wider and cleanup costs more; in Relaxed they're shorter and gentler.
- A multiplier on phase waits in the crisis engine, read from the mode setting.
- Keeps the target scores for each mode intact.

### i44-a29 The livestock truck rollover on Highway 12 (S, 🟡)
A cattle truck tips near the Lowden turnoff and the whole valley spends a weekend rounding up cows; quick, funny and still a shared moment.
- A two-phase short arc (the roundup, then a thank-you steak feed).
- Uses the road event category in events.js.
- Balance: tiny costs and rewards; a lighter crisis between heavy ones.

### i44-a30 Your own house is the one in trouble (M, 🟠)
Sometimes the crisis lands on you: your basement floods or the fire takes your shed, and the people you helped before show up, scaled by your Town Book.
- Checks S.townBook roles; more past help means more hands and lower costs.
- Without past help, you pay full repair.
- Balance: rewards a long habit of showing up, not one big week.

### i44-a31 Help explains town crises (S, 🟡)
A Help section that says what a town crisis is, how roles work, that you can step back, and how the town remembers.
- Adds a block in help.js next to Stories.
- Plain language, a few lines.

## Ideas 44: Tutorial and Help rewrite

This round rewrites the tutorial and Help: a 14-step tour that covers newer systems like trips and Out and about, tips that show up when they matter, and a searchable, folded Help guide that opens at the section you need.

### i44-b01 Tutorial: cut 26 steps to 14 by dropping tap-here-to-navigate steps (S, 🔴)
Steps like 'Back to Home', 'Tap Menu', 'Tap Close' and 'switch back to List' teach nothing; the coach switches tabs itself on Next, so the practice life drops from 26 steps to about 14.
Played headless at 390x844: 26 steps, and 8 of them (12, 15, 17, 21, 22, 23, 24, 25) are only navigation or a pointer at a button.
In js/help.js, TSTEPS gets a `go:'jobs'` field that calls `tab=...; render()` in `before`, so the coach can say 'This is Jobs' with no tap.
Save/Load and the ? button move into the final card's text.
Balance: the practice life is never scored, so nothing changes.

### i44-b02 Tutorial opens on Home with 'No paycheck', not on the Jobs list (S, 🟠)
The practice life starts on Home, where the real 'No paycheck coming in' card and its Find a job button are the first thing the coach points at, so the tutorial teaches the path a real first week takes.
Today step 2 drops you on the Jobs tab with no context ('This is the Jobs tab...').
In js/help.js, startTutorial sets tab='home', and step 2 targets `[data-go="jobs"]` inside the warn card before the farmhand Apply step.
Balance: no effect on play.

### i44-b03 Tutorial: one Out and about visit, showing it doesn't use your week (S, 🔴)
A new step opens 🛍️ Out and about, has you visit the coffee place, and points at the stat change while your focus stays Town. That teaches the biggest system the tutorial skips.
It goes after the first End Week. The targets are `#outbtn` and then the first visit button in the out sheet (js/outabout.js outSheet).
The coach text gives the rule in one line: up to 3 visits a week, on top of your focus.
Balance: the practice life isn't scored. Real-life visit caps (OUT_WEEK_CAP) are unchanged.

### i44-b04 Tutorial: plan one trip to Walla Walla with a grocery stock-up (M, 🟠)
Four steps cover trips: tap the 🚗 trip chip, pick Walla Walla, pick the grocery stock-up, and see End Week name the trip and the gas.
This replaces the two River map steps; one map step stays.
Targets: `#tripchip`, then the town and stop buttons in tripPicker/tripSheet (js/features.js).
The coach line says a trip costs gas and makes your focus work at 75% that week.
Balance: no effect on real lives. It teaches the trip's cost as well as its upside.

### i44-b05 Tutorial shows how you win: tap 'Life Score so far' (S, 🔴)
After ⏩ 4 the coach points at the score button on Home, opens the breakdown and points at the weakest-part tip. Players learn the four parts of the score before they learn the 401(k).
Today the tutorial never mentions the Life Score.
Targets: `#scorenow`, then the breakdown sheet from showScoreNow (js/features.js).
This step replaces the 401(k) step (see i44-b33).
Balance: knowing the formula rewards balanced play, not idle play.

### i44-b06 Tutorial event shows its kind and its 📍 place (S, 🟡)
The scripted Celebration Days event also points at the 🏡 Town tag and the 'where it happened' line, and the coach says there are three kinds of events: town, road and work.
This is one added non-tap step after the choice result, in js/help.js TSTEPS.
If the event card has no kind tag yet, add a small `.evkind` label in showEvent (js/events.js) that both the step and real play use.
Balance: it only explains the event.

### i44-b07 Tutorial's last card links to four Help sections (S, 🟡)
The 'That's the basics' card gets four buttons: Trips, Skills and business, Goals and badges, and Saving. Each one closes the tutorial and opens Help at that section.
These cover what the short tutorial left out on purpose.
It needs showHelp(sectionId), the same as i44-b19.
The card goes in endTutorial/drawCoach (js/help.js).
Balance: no effect.

### i44-b08 Skip the tutorial now, pick up where you left off later (S, 🟡)
Skip tutorial remembers your step. Next time, the Help card reads 'Pick up at step 6 (Your week)' next to 'Start over'.
The step index goes in prefs (setPref('tutAt')), and step 0 is replayed silently to set up the practice state.
Steps that need a past action (a job, a week played) get a `setup` function so they can start on their own.
Balance: no effect.

### i44-b09 Progress shows chapter names, not 'Step 13 of 26' (S, 🟡)
The coach header shows the chapter and dots, like 'Your week ● ● ○' or 'Getting around ○ ○ ○', so the tour feels short and players know what's coming.
TSTEPS entries get a `ch` field, and drawCoach renders the chapter name and a dot for each step in it.
Screen readers hear 'Your week, step 2 of 3'.
Balance: no effect.

### i44-b10 A test fails if a tutorial step is skipped silently (S, 🔴)
drawCoach skips a step whose target never shows up. A new check in tests/flows.test.mjs plays the whole tutorial at phone size and fails if any step was skipped or its target is off-screen.
drawCoach sets `TUT.skipped.push(i)` and logs `console.warn` on a skip.
The test asserts the list is empty and that each target's rect is inside the viewport (the logic is in /tmp/r44b/play.mjs).
This keeps the tutorial in step as the UI changes (TODO G1).
Balance: no effect.

### i44-b11 Every tip card gets 'More in Help →' to the right section (S, 🔴)
The Home tip cards (TIPS in js/ui.js) get a small link that opens Help scrolled to the matching section. A tip stays one line and the detail stays in one place.
TIPS entries get `help:'week'`, and the card adds `<button data-helpsec>`.
It needs showHelp(sec) (i44-b19).
Balance: no effect.

### i44-b12 Carpool tip the first week you could join one (S, 🟠)
When community reaches 30 and you commute 20+ miles alone, a one-time Home tip says: 'You can join a carpool on the Jobs tab: half the gas, and the drive wears on you less.'
This is a new entry in TIPS (js/ui.js): `when: () => S.community >= 30 && commuteOneWay() >= 20 && !S.carpool`.
The Help guide is the only place carpools are explained today.
Balance: it helps careful commuters. Careless players still have to act on it.

### i44-b13 Car-care tip when an oil change is overdue (S, 🟠)
When it's been 26+ weeks since S.svc, a one-time tip says your truck is due and that a trip to a town with an oil change cuts breakdowns for 6 months. It has a 'Plan a trip' button.
This is a TIPS entry. The button calls tripPicker() (js/features.js).
It covers trip reasons players miss, because trips are only explained in Help.
Balance: it costs gas and part of your week. Players who never take a trip are unchanged.

### i44-b14 First time in debt: a tip on what it costs (S, 🟠)
The first week cash goes below $0, a tip says: 1.5% interest a month, trips limited to 1 stop, a warning at -$15,000, and you leave town at -$40,000. It links to Help: Money.
This is a TIPS entry in js/ui.js, `when: () => S.money < 0`.
Today the only debt card shows at -$15,000, which is late.
Balance: a warning, not a bailout.

### i44-b15 A road or work event's result says why it happened (S, 🟡)
The first road event and the first work event each get one extra muted line in the result, such as 'Road events only happen in weeks you drive 20+ miles.' It shows once per device.
In showEvent's result in js/events.js, check `ev.kind` and prefs().tips.
It explains the three kinds of events at the moment they matter, not in a Help table.
Balance: no effect.

### i44-b16 At most one tip a week, and a Tips on/off setting (S, 🟠)
Tips never stack, and a new tip waits a week after the last one. Menu gets a 'Show tips' switch and 'Show tips again', which clears prefs().tips.
currentTip() in js/ui.js checks a `tipWeek` pref.
The Menu sheet gets two rows.
This keeps Home calm as more contextual tips are added (i44-b12 to b14).
Balance: no effect.

### i44-b17 Search box at the top of Help (M, 🔴)
A 🔍 field filters the guide as you type ('gas', 'carpool', 'retire'). It shows matching paragraphs under their section names, with the words highlighted, and tapping one jumps there. It works offline.
Help is 4,777 words and about 20,300px tall on a phone, so finding one rule means scrolling about 24 screens.
In js/help.js, split the rendered guide into paragraph nodes once, match each lowercase word, and hide sections with no hits.
Balance: no effect.

### i44-b18 Help search knows everyday words (S, 🟡)
Search maps everyday words to game terms: 'baby' and 'kids' to Family, '401k' and 'retire' to Savings, 'truck' and 'car' to Homes and vehicles, 'fun' and 'bar' to Out and about, and 'win' to Score.
This is a small SYN table in js/help.js, used by i44-b17.
Balance: no effect.

### i44-b19 ? opens Help at the part you're looking at (S, 🔴)
Tapping ? on Jobs opens Help: Jobs, on Life opens Homes and vehicles, and from a trip sheet opens Trips. The tutorial card stays one tap away at the top.
Today Help always opens at the top, above the tutorial card and a 19-button contents list.
showHelp(sec) scrolls to `#g-${sec}`. A tab-to-section map lives in js/help.js, and #helpbtn passes the current tab or open sheet.
Balance: no effect.

### i44-b20 Help sections fold up with a one-line summary each (M, 🔴)
Each section becomes a `<details>` with its title and a one-line summary. Only the one you open expands. The guide goes from about 20,300px to roughly 1,500px of headings.
In js/help.js, sec() renders `<details id="g-…"><summary>`. Search (i44-b17) and deep links open the matching section.
'Back to contents' buttons are no longer needed.
Balance: no effect.

### i44-b21 Big tables hide behind 'Show all' (S, 🟠)
The 32-row jobs table, the 20-row places table and the trip stops table start folded behind 'Show all 32 jobs'. Each section's text reads first.
Jobs (2,500px) and Out and about (2,766px) are the two longest sections, and most of their height is tables.
Use a nested `<details>` in guideHTML (js/help.js).
Balance: no effect.

### i44-b22 Each Help section opens with a bold 'In short' line (S, 🟠)
Every section starts with one plain sentence, for example 'Trips: once a week, drive to another town for errands and fun; it costs gas and some of your week.' The detail follows.
S2 entries in js/help.js get a fourth field, used as the `<details>` summary (i44-b20) and as the search snippet.
Balance: no effect.

### i44-b23 Reorder Help by when you need it; Score goes second (S, 🟡)
New order: Getting started, How you're scored, Your week, Stats, Jobs, Money, Events, Out and about, Trips, Maps, School, Homes, Savings, Family, Skills, Business, Goals, Saving, Install. Tips become 'Five rules of thumb' at the top.
Today the score is 17th of 19, but it's the goal of the game.
This only reorders the S2 array in js/help.js.
Balance: no effect.

### i44-b24 Getting started rewrite: 'Your first four weeks' (S, 🟠)
Cut the background and mode lists (the title screen's More options already explains them) and replace them with a numbered list: get a job, pick a focus, end the week and read the strip, then try a visit or a trip.
This takes the section from 326 words to about 120. The length table stays.
The start item in guideHTML (js/help.js) changes, with links to Jobs, Your week, Out and about and Trips.
Balance: no effect.

### i44-b25 Out and about rewrite: rules first, place details on the cards (S, 🟠)
The longest section (692 words) splits into 'How visits work' (3 a week, one per place, the half-fun repeat, the stat cap) and the places table. The prose list of each shop's seasons and hours goes, because each place's own card already shows them.
The out item in js/help.js keeps the rule bullets and the 'Little extras'. The seasons paragraph becomes 'Places keep real hours and seasons: check the place's card.'
This also stops Help prose from naming stand-in businesses that can drift from PLACES data.
Balance: no effect.

### i44-b26 Events rewrite: lead with the three-kinds table and 📍 (S, 🟠)
Events opens with a table (kind, how often, when it can happen), then the 📍 gold map badge (moved from Maps), then a short seasonal list. 'About 100 events' becomes a number from EVENTS.length.
There are 109 events today.
The events and maps items in js/help.js change; the Maps section keeps a one-line pointer.
Balance: no effect.

### i44-b27 Jobs rewrite: 'Commuting' and 'Side hustles' get their own subheads (S, 🟡)
The 150-word paragraph mixing remote days, carpools and side hustles splits into two short headed blocks, each with three bullets.
This is the jobs item in js/help.js.
The carpool rule ('it goes with the job') becomes its own bullet so it isn't missed.
Balance: no effect.

### i44-b28 Trips rewrite: a 'Why take a trip?' table (S, 🟡)
The seven-bullet list becomes a table: reason (groceries, oil change, winter tires, dentist, doctor, fun) → what it does → how often it's worth it. Gas, time and debt rules go above it.
This is the trips item in js/help.js, using STOCK_OFF, STOCK_WEEKS and TRIP_TIME as it does now.
Balance: no effect.

### i44-b29 Split 'Skills and your own business'; move challenges out (S, 🟡)
Skills and Business become two sections. The Weekly challenge and Legacy paragraphs move to 'Goals, stories and challenges', next to the other title-screen modes and 🏆 Your records.
The grow and goals items in js/help.js change.
Your records is mentioned today only in passing in the Score section.
Balance: no effect.

### i44-b30 Merge 'Saving and loading' and 'Installing' into 'Your device' (S, 🟡)
One section covers saves, backups and installing for offline play, in that order, with the 5-slot rule first.
The saves and install items in js/help.js merge, which cuts the guide by one section.
Balance: no effect.

### i44-b31 Short looping clips for five key moves (L, 🟠)
Five small muted loops in Help show End Week and the strip, a map tap, planning a trip, an Out and about visit, and ⏩ 4. They're about 6 seconds and under 150 KB each, and each sits at the top of its section.
A tools/record-clips.mjs Playwright script plays the practice life and saves animated WebP to assets/help/. sw.js caches them for offline play.
Clips load only when a section opens. With reduced motion on, a still frame shows instead.
Balance: no effect.

### i44-b32 'Watch it' replays a live demo instead of a video (M, 🟠)
Each Help section with a clip idea also gets ▶ Watch it. It starts the practice life and the coach taps through 4–6 steps by itself, so the demo always matches the current UI and adds no file size.
This reuses the TUT engine in js/help.js with an `auto:true` flag: drawCoach clicks the target after 1.2 seconds.
The lesson arrays sit next to TSTEPS, and Close returns to Help.
Balance: no effect.

### i44-b33 401(k) leaves the tutorial and becomes a first-paycheck tip (S, 🟠)
Instead of a tutorial step, the first week you're paid by an employer with a match, a tip says: 'Put 5% in your 401(k) on the Life tab and your employer adds 3%.' It has a Go button.
This is a TIPS entry in js/ui.js, `when: () => S.jobId && S.turn >= 2 && !S.k401`, with data-go='life'.
It frees the tutorial slot for the Life Score step (i44-b05).
Balance: it helps long games a little. Idle players still have to act on it.
