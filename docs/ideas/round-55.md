# Ideas round 55

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 55: Bundles part 7 and v1.1

30 bundles that group the round 49–54 ideas still loose (bug fixes, round 50's cuts and merges, the first hour, short sessions, small towns, evenings, clubs, money, decades and mentors), and one release plan for v1.1.

### i55-a01 Bundle: Bug-fix sweep: double taps, money and saving (M, 🔴)
Fix the 🔴 tap and save bugs: a double tap on End Week plays one week, the tap that closes a sheet stops landing on what's behind it, money reads $1,500 on every phone and never $NaN, a failed save says so, the page behind a sheet stays still, and iPhone stops zooming on quick taps.
playWeeks in turn.js ignores a second call while a week runs or within 400 ms; ui.js swallows taps for 350 ms after a sheet closes.
fmt in state.js pins en-US and falls back to $0 with a logged error; the save writer catches quota errors and shows one warning.
Sheets lock body scroll; buttons and pins get touch-action: manipulation.
tests/bugs2.test.mjs holds the repros. Balance: no rule changes, but the double-tap fix stops accidental extra weeks that drift idle scores.
Covers: i54-a01, i54-a02, i54-a03, i54-a15, i54-a16, i54-a18, i54-a20, i54-a26.

### i55-a02 Bundle: Bug-fix sweep: keyboard focus after sheets (M, 🔴)
Fix where keyboard focus lands: closing a sheet goes back to the button that opened it (even with no id), a picked focus tile keeps focus, map pins keep it after a tap, Help from the Menu returns to Menu, and the backup check lands on a working button. The tutorial's look-only Save step can't be tapped, and Help opened in the tutorial closes with it.
ui.js keeps a reference to the opener element, not its id, and restores it on close; render() re-focuses the active focus tile or pin by data key.
The tutorial disables pointer events on look-only steps and closes any sheet it opened when it ends.
Touches ui.js, maps.js, help.js and boot.js (tutorial). Balance: none; this is reachability for keyboard and switch users.
Covers: i54-a04, i54-a05, i54-a06, i54-a07, i54-a10, i54-a17, i54-a22.

### i55-a03 Bundle: Bug-fix sweep: loading, backups and offline (M, 🔴)
Fix the load and backup bugs: loading a life resets Journal and job filters, Main Street jobs keep a Town pin, a thin backup loads with safe defaults, a bad export date is left out, the app opens offline from links with ?query, two open copies stop erasing each other's weeks, and the same backup file can be picked twice.
Load runs one migrate/defaults pass in state.js that fills any missing field from newLife(); filter state lives in the UI, cleared on load.
The service worker matches with ignoreSearch for the app shell; a save stamp in localStorage plus a storage event makes an older window reload before it plays.
Touches state.js, boot.js, maps.js, sw.js and the backup input reset. Balance: none.
Covers: i54-a08, i54-a09, i54-a11, i54-a12, i54-a13, i54-a14, i54-a21.

### i55-a04 Bundle: Bug-fix sweep: the first hour (M, 🔴)
Fix the first-hour faults new players hit: two jobs get a ⭐ Good first job tag, 'You're hired' names a long drive and its cost, the first Work extra tap says it's overtime on top of your job, no event repeats in your first 52 weeks, and rejections in your first month cost no happiness. A five-newcomer test guards it.
Tags come from take-home after commute wear in the Jobs tab (ui.js); pickEvent in events.js skips fired events in year one unless the pool is empty.
tests/firsthour.test.mjs plays five scripted first lives and checks they find work and see varied events.
Balance: the tags and no-repeat rule help any player; the sim must show careless still at or under 60 since the help is information, not money.
Covers: i52-a01, i52-a02, i52-a03, i52-a07, i52-a10, i52-a29.

### i55-a05 Bundle: Round 50 cuts (M, 🔴)
Apply round 50's removals in one pass: pinned life goals and their +2 go, Cook and People skills go, the food truck goes, businesses sell for half with no yearly wear, Out and about loses its hidden boosts, the Home chip row goes, the report card log line goes, and badges trim from 18 to 12.
Saves migrate: pinned goals are dropped, Cook and People levels are discarded, a food truck is sold at half price to cash.
Later bundles that mention Cook or People (truce dinner, meal prep, apprentices) use Rest weeks, Handy or plain stats instead.
Touches features.js (goals, skills, businesses, badges), outabout.js, ui.js (Home) and turn.js (report card). Balance: re-run the sim; losing the +2 goals and the boosts lowers good play a little, so check good play stays at or over 70.
Covers: i50-a01, i50-a09, i50-a10, i50-a12, i50-a13, i50-a16, i50-a17, i50-a24.

### i55-a06 Bundle: One place for each thing (M, 🔴)
Apply round 50's merges: Out and about and trips become one Go somewhere sheet, Home shows one goal line and one heads-up card, the Life tab opens with home, ride and money, the title screen folds the weekly challenge, records and Restore under Challenges and a small link, three skip buttons become two, and Save, Load and Back up become one Your lives sheet.
Go somewhere has two tabs, In Waitsburg and Out of town, sharing the cooldown code in outabout.js.
⏩ 13 goes; ⏩ 4 and ⏭ Auto stay. Heads-up card picks the most urgent warning with '+2 more'.
Touches ui.js, outabout.js, boot.js (title screen) and help.js. Balance: no rule changes; fewer buttons means fewer mistaken taps.
Covers: i50-a02, i50-a03, i50-a04, i50-a05, i50-a06, i50-a14, i50-a15, i50-a21.

### i55-a07 Bundle: Plainer rules, shorter Help (M, 🟠)
The rest of round 50's simplifications: the wheat lease loses its renewal rule, score so far compares net worth with where you should be by now, the Household card drops the price index and empty council row, Journal filters drop to All and Milestones, the Jobs tab gets one town picker, carpool turns on by itself, and Help goes from 19 sections to 11 with no data tables.
Score so far scales the net worth target by weeks played (features.js), which retires the second 'on track?' row.
Help sections merge in help.js; place hours, the badge list and job tables stay where they are used.
Balance: carpool auto-on saves gas for everyone with a 20+ mile commute; check careless doesn't gain more than a point.
Covers: i50-a11, i50-a18, i50-a19, i50-a20, i50-a22, i50-a23, i50-a25, i50-a26.

### i55-a08 Bundle: Idea board prune (S, 🟠)
Clear the idea board of themes that don't fit an offline single-player game: live-ops and seasonal drops, the deep finance sim, leaving the valley, the farm-equipment sim, narrator voices and text engines, ranking players, and reworded repeats. The board gets one 'Dropped' tag instead of deletion, so nothing is lost.
A one-time pass over docs/ideas and the board JSON marks matching ideas Dropped with the round-50 reason.
Ideas in rounds 49–54 that clash (a job that leaves the valley, an app-icon badge) are tagged too.
Touches docs only. Balance: none.
Covers: i50-a28, i50-a29, i50-a30, i50-a31, i50-a32, i50-a33, i50-a34.

### i55-a09 Bundle: Golden path for a first life (L, 🔴)
A brand-new player's first life is a guided 2-year Fresh start on Normal: week 1 is about a paycheck, weeks 2–4 teach one focus then a second, month 2 visits one Main Street place, month 3 finishes a town goal on screen, the halfway check names your weakest part, and the end screen says 'Try Farm kid'.
A firstLife flag in state.js gates the script; the tips in boot.js become a fixed week table.
The pickers unlock after the first life ends, or from the Menu for anyone who wants them.
Balance: the path teaches good play, it adds no money or stats, so sim bots (which never see tips) are unaffected.
Covers: i51-a01, i51-a02, i51-a03, i51-a04, i51-a05, i51-a06, i51-a07.

### i55-a10 Bundle: Five moments every life has (M, 🔴)
A MOMENTS table names five beats every life should reach, each with a small card the first time: the first paycheck after taxes and gas, a new key for your own place, someone in town using your name when Community crosses 50, the hard week you pulled through, and a goodbye line on every ending.
MOMENTS lives in features.js with a check per beat in turn.js; each fires once and adds a Journal milestone.
The year in review and end screen read the same table.
Balance: moments are cards, not rewards; no score is attached, so idle play can't farm them.
Covers: i51-a08, i51-a09, i51-a10, i51-a11, i51-a12, i51-a13.

### i55-a11 Bundle: Signature five and one word per thing (M, 🔴)
Name the five features that stand for The Burg (weekly focus, the real-town map, town goals, the Life Score's four parts, year in review) and make sure each shows in the first 13 weeks, with the map one tap from Home. A NAMES table and a test keep one word per thing: Community, not standing; same title, place name and emoji on every screen.
NAMES and PLACES tables in state.js; a test greps rendered text for banned synonyms and mismatched names.
tests checks a scripted 13-week first life opens each signature screen.
Year in review fits one 390 px screen. Balance: copy and layout only.
Covers: i51-a14, i51-a15, i51-a16, i51-a17, i51-a18, i51-a19, i51-a20, i51-a21.

### i55-a12 Bundle: Numbers that read at a glance (M, 🟠)
Stats show whole numbers with a word (Low, OK, Good, Great), money under $10,000 shows dollars and above shows $12.4k, net worth shows its change this week, every percent is whole, '2027 dollars' becomes one footnote, a grad's negative net worth says it's mostly the loan, and the header says 'Year 1 of 5' instead of a week countdown.
One short mode for fmt in state.js; band words come from the same cutoffs the warnings use.
Last week's net worth is already in history, so the change line costs no new state.
Touches ui.js header, Home and sheets. Balance: display only.
Covers: i51-a22, i51-a23, i51-a24, i51-a25, i51-a26, i52-a21, i52-a26.

### i55-a13 Bundle: Quality bar checks (M, 🔴)
A checklist file the release kit reads, with a test for each line: sim targets hold across 500 lives for every length, a cold start under two seconds on a throttled phone, saves from every past version load and play, no text cut off at 320 px or 200% zoom, zero console errors in a 260-week bot run, and three new players finish a first life unaided.
docs/quality-bar.md plus tests/fixtures saves; the release skill refuses a tag until each check passes or is waived in writing.
The new-player run is a manual line with a date and notes.
Balance: this is the gate that enforces careless <= 60, idle <= 50, good >= 70 per length.
Covers: i51-a27, i51-a28, i51-a29, i51-a30, i51-a31, i51-a32, i51-a33.

### i55-a14 Bundle: First hour: jobs, rejections and early bills (M, 🟠)
Help a new player through the job hunt: job cards say Good, Fair or Long shot and what the week feels like, a rejection offers 'Spend this week on Town' in one tap, End Week asks once if you have no job and haven't applied, a failed gamble says what the careful choice would have done, early big repair bills can be split over 4 weeks, and an ignored warning counts what it has cost.
Odds words reuse apply() odds in features.js; job tag lines are a field on starter jobs.
Bill split adds $25 and only runs in the first 26 weeks; the warning counter lives on the heads-up card.
Balance: the split costs more in total, and the warnings only inform, so careless play gains no money.
Covers: i52-a04, i52-a05, i52-a06, i52-a08, i52-a09, i52-a12, i52-a13.

### i55-a15 Bundle: First hour: a kinder first year (M, 🟠)
Smooth the first year's rough edges: first lives start in April, a birthday lands in year one, Out and about lists open places first, January's town goal gets a winter name, early event cards come under 35 words, a found home for the stray stays found, event text stops claiming a past you didn't have, and a new partner's next scene is a good one.
Start date and birth month in newLife() in state.js; event text edits and a 2-year stray cooldown in events.js.
Open-first sort in outabout.js.
Balance: the birthday is +2 happiness once; everything else is text or order. April start gives every bot spring goals, so re-run the sim.
Covers: i52-a11, i52-a14, i52-a15, i52-a16, i52-a17, i52-a18, i52-a19, i52-a20.

### i55-a16 Bundle: First-life check-ins (M, 🟠)
A first life gets a few short looks back: a 'Your first month' recap after week 4, week 13's report card as a one-time sheet, a retired neighbor's porch notes every few weeks as the voice of the golden-path tips, the week strip counting town-goal weeks and a kept dog, and a 6-month ending that offers 'Keep going to 2 years'.
The porch notes replace tip bubbles rather than stacking on them; the report card sheet replaces the cut log line.
Keep going saves the 6-month score first, then extends the length in state.js.
Balance: extending can't raise the saved 6-month score; the 2-year score is judged on its own targets.
Covers: i52-a22, i52-a23, i52-a24, i52-a25, i52-a27, i52-a28.

### i55-a17 Bundle: Ten-minute session: fewer taps per week (M, 🔴)
Make a week cheaper to play: an event result can go straight to Next week, milestone notes ride along instead of stopping a skip, the focus label on End Week opens the six icons, 'Always answer this way' settles repeat small events, the first week back stops only for real choices, events end with their question in bold, and stats fit one slim row.
Auto-answers live in state (event id to choice) and only apply to small events already seen; big ones always stop.
Touches ui.js (end bar, result sheet, stats row), turn.js (skip stops) and events.js text.
Balance: an auto-answer repeats the player's own choice, so it can't pick better than they would; the sim's idle bot already auto-answers, so its score shouldn't move.
Covers: i49-a02, i49-a03, i49-a04, i49-a11, i49-a13, i49-a14, i49-a25.

### i55-a18 Bundle: Ten-minute session: stop and pick up (M, 🟠)
Make stopping and coming back easy: a 'Done for now' card shows what this sitting did, the Continue card shows stats, focus, weeks left and the last sitting, the Journal marks where each sitting started, year in review gets 'Stop here for today' and a 'Coming up' list, the app opens straight into today's life, and the week strip says 'When you left'.
A sitting record (start week, start score, timestamp) saved with the life in state.js.
Touches boot.js (title and open), ui.js and the Journal.
Balance: display only; no bonus for coming back.
Covers: i49-a05, i49-a06, i49-a07, i49-a08, i49-a09, i49-a10, i49-a15, i49-a23.

### i55-a19 Bundle: Small towns: pins, via-stops and the rules (L, 🔴)
Touchet, Lowden, Dixie, Prescott, Starbuck, Pomeroy, Milton-Freewater and Athena become light pins on the region map with no jobs; a Walla Walla or Dayton trip can add one on-the-road stop for a few miles of gas, with the same cooldown and fade as big towns. Help lists them, the Tattler gets an 'Around the valley' note, visiting five earns a badge, and the bots learn the stops.
Pins in maps.js; via-stops in the Go somewhere sheet's Out of town tab (outabout.js); a SMALL_TOWNS table holds each town's stops.
Content stops (tavern nights, fair, fruit boxes) come in a later bundle.
Balance: stops share the trip cooldown and fade with repeats; the sim bots check a trip-heavy idle life stays at or under 50.
Covers: i49-b01, i49-b02, i49-b03, i49-b28, i49-b29, i49-b30, i49-b31.

### i55-a20 Bundle: Friction threads that end in peace (L, 🔴)
Small-town spats get a shared spark, simmer and make-peace shape that always ends warm: make-peace cards (a loaf of bread, a chore, a ride) in the week, a truce dinner for two feuding neighbors, the old-timers' bench giving a one-line verdict on your week, a kerfuffle-of-the-week headline on Home, and a September street party that toasts every spat you settled.
A FRICTIONS table in events.js with step, open week and peace options; the truce dinner leans on a Rest week since the Cook skill is cut.
Bench lines and the kerfuffle are text pools keyed to your week and the month.
Balance: peace gives small community gains and costs time or money; an idle life never opens or settles a spat, so it gains nothing.
Covers: i50-b01, i50-b02, i50-b03, i50-b29, i50-b30, i50-b32.

### i55-a21 Bundle: Evenings: the night shift and the drive home (L, 🔴)
The night shift costs something real: a sleep bank drains on night weeks and refills on Rest, job boards show the night pay differential, blackout curtains slow the drain, and each month asks whether to flip back to days. The drive home gets deer at dusk on Highway 12, rumble strips after long shifts, and a monthly call that keeps an old friend.
Sleep bank is a hidden number in state.js read by turn.js; deer and drowsy events key off commute length and month.
Touches features.js jobs, events.js and the planned night shift pick.
Balance: night pay is offset by health and family costs, so a careless night worker doesn't out-earn a good day worker in the sim.
Covers: i51-b01, i51-b02, i51-b03, i51-b04, i51-b08, i51-b09, i51-b10.

### i55-a22 Bundle: Evenings: daylight, Main Street at night and the sky (L, 🟠)
A month table of sunsets decides what fits after work, a sky calendar lists moon phases and meteor showers with a moon on the date line, a dark-sky pullout pin sits above town, Main Street shows lit windows on Friday nights, the walk home from the ale house depends on where you live, summer brings movies on the lawn at the park, and parents can book a teen sitter for date night.
DAYLIGHT and SKY tables in a small data block in state.js; the ridge pin in maps.js; Friday look in the Main Street close-up.
Balance: evening stops share the Out and about cooldown and give small lifts; the sitter costs money that grows with prices.
Covers: i51-b12, i51-b13, i51-b14, i51-b19, i51-b21, i51-b22, i51-b25, i51-b32.

### i55-a23 Bundle: Clubs: join up and show up (L, 🔴)
A Clubs card on the Life tab lets you join up to two town groups after a free guest visit. Dues land on the Bills list in their month, meetings count on any Show up for town week that month, three misses moves you to the rolls, a year of attendance can earn an office, and the annual meeting asks who will be president. A sim bot checks joiners versus ghosts.
CLUBS table in features.js; meeting credit read in turn.js from the week's focus.
Office holders get small yearly community gains and one extra chore choice.
Balance: dues cost money every year and ghosts lose the benefit, so joining and not showing up scores lower than not joining.
Covers: i52-b01, i52-b02, i52-b03, i52-b04, i52-b05, i52-b06, i52-b07, i52-b35.

### i55-a24 Bundle: Clubs: big events, doors and limits (L, 🟠)
What membership opens: each club runs one big yearly event you can lead, members get small doors around town (the hall at half price, the seed swap), family service lets you join the Legion auxiliary, the garden club keeps Main Street planters, the volunteer ambulance crew pays for an EMT class and a weekend pager, and the end screen lists your clubs. A third role brings a spread-too-thin warning.
Events and doors as rows on the CLUBS table; the EMT class reuses the class-weeks system.
Balance: the thin-spread rule costs happiness each month, so stacking roles stops paying; pager calls cost rest.
Covers: i52-b08, i52-b09, i52-b10, i52-b16, i52-b18, i52-b23, i52-b24, i52-b34.

### i55-a25 Bundle: Money as story: firsts and lean weeks (M, 🔴)
Money gets moments: the thing you've wanted since you were a kid, first $1,000 and first loan-free day, a way to mark the payoff, the Thursday you go from the food bank line to the donation table, a kid asking why you can't afford it, plain lean-week and payday lines on the week strip, and a money year as three lines in the review.
Milestones fire once each from turn.js; strip lines come from cash versus a week of bills.
The want is set at start in state.js with a price that rises with inflation.
Balance: moments are text with tiny happiness; the want costs real money, so buying it early only helps when savings allow.
Covers: i53-a01, i53-a02, i53-a03, i53-a12, i53-a13, i53-a21, i53-a22, i53-a30.

### i55-a26 Bundle: Money with neighbors: gifts, IOUs and tabs (M, 🟠)
Money between people: a small gift in a lean week counts as much as a big one, the hat goes round after a house fire, an IOU drawer tracks what you lent, you can pay Grandma back with a pie, cosigning a cousin's truck is a three-year risk, neighbors bring casseroles after a hard turn, and the corner market lets you run a tab till payday.
Giving is weighed against weeks of bills in features.js; IOU and tab are small lists in state.js shown on Home.
Balance: gift value is capped by what you have, so a rich idle life can't buy community; tabs paid late cost trust.
Covers: i53-a04, i53-a05, i53-a06, i53-a07, i53-a08, i53-a11, i53-a28.

### i55-a27 Bundle: Decade grades (M, 🔴)
At 30, 40, 50, 60, 70, 80 and the end of a long life, a decade card grades what that decade is for: a base in your 20s, roots in your 30s, balance in your 40s, readiness in your 50s, purpose in your 60s, connection in your 70s and peace in your 80s, each with three or four plain checks and one line for the next decade.
A DECADES table in features.js read at birthdays in turn.js; grades go into the Journal and the Lifetime end screen.
Balance: grades are a lens on the same stats, with no score bonus, so they can't be farmed.
Covers: i53-b05, i53-b10, i53-b15, i53-b20, i53-b25, i53-b30, i53-b34.

### i55-a28 Bundle: Decade turns: the pressure points (M, 🔴)
The hard turns each age brings: the 30s squeeze when job, kids and house want the same week, the body's first bill from a hard-wear job in your 40s, harder hiring after 55, a five-year countdown to retirement, phased retirement at three days a week, porch-light checks from neighbors, and the choice in your 80s to stay home or move to care in Walla Walla.
Age gates in turn.js and events.js; the countdown sits on Home from 55.
Balance: the squeeze and the body bill hit careless lives hardest; good play softens them with Rest and savings.
Covers: i53-b06, i53-b13, i53-b16, i53-b18, i53-b21, i53-b31, i53-b32.

### i55-a29 Bundle: Mentors: the old-timer who shows you the ropes (M, 🔴)
In the first month an older townsperson offers to teach you their skill: practice counts 1.5x while a monthly coffee keeps the bond, a mentor card on the Life tab shows it, they add one plain line before big buys, and once they can vouch for you on a job. No mentor? Show up for town weeks can find one. Thank them at your big firsts. A bot checks it.
MENTORS table in features.js with skill, bond and last visit; 'Visit [name]' is a free Out and about stop.
Mentors teach Handy or Mechanic, or plain health and money sense, since Cook and People are cut.
Balance: the bond decays in three months, so idle lives lose the bonus; the bot test checks careless and idle don't move.
Covers: i54-b01, i54-b02, i54-b03, i54-b04, i54-b06, i54-b07, i54-b15, i54-b17.

### i55-a30 Bundle: Mentors: passing it on (L, 🔴)
Later in life you teach: at skill level 3 or five years in one job a teenager asks to learn from you, their story goes somewhere over two or three years, your mentor ages and their toolbox or recipe box comes to you, after 62 a Mentor focus opens, your old apprentice comes through for you, and in legacy mode they mentor your grandkid.
Apprentice rows in state.js; the Mentor focus is a seventh focus shown only after 62.
The year review and end screen name who taught you and who you taught.
Balance: teaching takes part of a week a month and gives community, not money; the Mentor focus only opens late, when work focuses already pay less.
Covers: i54-b05, i54-b12, i54-b13, i54-b14, i54-b23, i54-b24, i54-b25, i54-b31.

### i55-a31 Release plan: v1.1 — Easy to start, easy to come back to (L, 🔴)
Ship 1.1 as a short follow-up to 1.0 that fixes the newest bugs and makes the game simpler to start and to play in short sittings: the four bug sweeps, round 50's cuts and merges, plainer numbers, the golden path and first-hour help, the ten-minute session pieces, and the quality bar as its release gate. Clubs, mentors, decades, small towns, evenings and the holiday, land, Tattler and job-ladder bundles held back from 1.0 wait for 1.2+ so 1.1 removes more than it adds.
Order: bug sweeps a01–a04 first, then cuts a05 and merges a06 (one save migration), then a07 and a12, then the first-life work a09, a14–a16 and the session work a17–a18.
Gate: a13 Quality bar checks must pass, including the sim targets on every length after the cuts.
Balance: cuts remove the +2 goals and hidden boosts, so good play may dip; tune town goals before tagging if good play falls under 70.
Covers: i55-a01, i55-a02, i55-a03, i55-a04, i55-a05, i55-a06, i55-a07, i55-a09, i55-a12, i55-a13, i55-a14, i55-a15, i55-a17, i55-a18.

## Ideas 55: The valley's changing work

How work in the Walla Walla Valley changes across a Lifetime game: new trades open, old jobs shrink, and players who plan ahead can move with it.

### i55-b01 Jobs open and close with the game year (M, 🔴)
Each job can carry an opening year and a closing year, so the Lifetime job board slowly changes: new trades appear in the 2030s, some old ones fade by the 2050s. Short games barely notice; Lifetime games feel the valley change.
- Add optional `opens` and `closes` years to JOBS entries in js/state.js, plus `gameYear()` from S.date.
- renderJobs (js/ui.js), the job-offer event (js/events.js ~line 223), maps.js and help.js filter by it.
- A saved job that has closed keeps paying until a closing event moves you on (see the warning idea).
- Balance: the base 25 jobs stay open all game, so no start is ever harder; only Lifetime runs shift.

### i55-b02 'New this year' tag on the job board (S, 🔴)
A job that opened in the last 12 months gets a small 'New' tag on its row and a line in the Journal the week it appears. Players notice change without reading Help.
- Tag in jobRow (js/ui.js) when gameYear() - job.opens < 1.
- One log line from turn.js on the first week of the opening year.
- Balance: information only.

### i55-b03 A shrinking job warns you three years out (M, 🔴)
When a job is headed for its closing year, its card says 'Shrinking: fewer openings each year' three years ahead, and layoff odds climb a little each year. The careful player gets time to move; the careless one gets caught.
- New `shrinkRisk()` in js/state.js adds to LAYOFF_RISK in the last 3 years before `closes`.
- Warning chip on the job card and the Home job card (js/ui.js); a one-time 'heads up' event (js/events.js).
- On the closing year, holders get a layoff with two months' severance.
- Balance: idle and careless bots that never switch lose pay; good play has 3 years to act, so it keeps 70+.

### i55-b04 Each field's pay grows at its own pace (M, 🟠)
Wages no longer all rise at the same 2.5% a year. Care, solar and lab work grow a bit faster; packing sheds, tellers and retail grow slower. Over 40 years the gap is real.
- Add a `drift` per job (e.g. +0.6% or -0.5% a year) applied in payNow (js/state.js) from the year you took the job.
- Jobs tab shows 'Pay growing faster/slower than most' in plain words.
- Balance: sim check that the average drift is zero, so total pay over a life is unchanged; only who picks well gains.

### i55-b05 Solar installer crews in the wheat hills (M, 🔴)
From about 2030 a solar crew job opens in Dayton: trade certificate, good pay, high wear in July and August on the roofs and racks. It is the first 'new trade' a Lifetime player sees.
- New JOBS entry (city dayton, edu 1, opens 2030, wear .9, stress .4) with LAYOFF_RISK .5.
- Summer wear bump via the existing month logic in js/turn.js.
- Two work events for it in js/events.js: a hot roof day and a panel that cracks in the wind.
- Balance: pay sits between elevator operator and trucker, so it is a fair move, not a jackpot.

### i55-b06 Drone spray pilot for the spring fields (M, 🟠)
Around 2031 a farm drone pilot job opens in Waitsburg at the farm supply co-op (stand-in name). Busy March to July, slow in winter, with a 6-week drone course before you can apply.
- JOBS entry at place 'mcgrub' (outabout.js), opens 2031, edu 1, plus a `course` flag for a short study run (6 weeks of Take classes).
- Winter months pay 70% (seasonal), shown on the card.
- Balance: seasonal dip keeps it from beating steady jobs on paper; it wins on community and no commute.

### i55-b07 EV and hybrid tech in Walla Walla (S, 🟠)
From about 2033 a Walla Walla dealership (stand-in) hires EV and hybrid techs. Auto mechanics can switch with a short high-voltage course; the Kennewick mechanic job's pay grows slower after 2045.
- New JOBS entry (wallawalla, edu 1, opens 2033), tagged as a bridge target for 'mech'.
- Kennewick 'mech' gets a negative drift after 2045 (uses the pay-drift idea).
- Balance: same base pay as mech plus a shorter commute, so the reward is the drive, not a pay spike.

### i55-b08 Battery yard technician by the substation (M, 🟠)
When the solar fields grow, a battery storage yard near Pasco hires techs in the late 2030s. Low wear, steady, a little dull, and safety rules matter.
- JOBS entry (pasco, edu 2, opens 2037, wear .2, stress .5, LAYOFF_RISK .2).
- One event in js/events.js: a fire drill and an alarm at 2 a.m. that tests the safety habit.
- Balance: steady like public jobs, but the 58-mile drive keeps take-home modest.

### i55-b09 Hanford winds down over the decades (M, 🔴)
Cleanup work doesn't last forever. From about 2045 the cleanup tech job has fewer openings each year, then becomes a smaller 'site monitoring tech' job; by 2060 the cleanup job closes. The lab stays.
- 'hanford' gets `closes: 2060` and a shrinking window; a new 'monitor' JOBS entry (richland, edu 1, opens 2050, lower pay, lower wear).
- Fall Hanford news (if built) says how many crews are left.
- Balance: the big early paycheck is still there for young players; Lifetime players must plan a second act.

### i55-b10 The last shift at Hanford (S, 🟠)
If you hold the cleanup job when it closes, you get a last-shift event: a badge to keep, a lump-sum closure bonus, and a 'Hanford alumni' tag that helps your odds at the Richland lab and the battery yard.
- One-time event in js/events.js on the closing week; S.tags.hanfordAlum read in apply() (js/ui.js) for a small hire bonus.
- Journal line and a year-in-review milestone.
- Balance: the bonus is about two months' pay, less than switching early would have earned.

### i55-b11 Care work grows as the valley ages (M, 🔴)
After 2035 the valley is older. Care jobs open more often (better hiring odds), a memory care aide job opens in Walla Walla, and nurses get a telehealth remote day.
- Hire-odds bonus for care-group jobs by year in apply() (js/ui.js); new JOBS entry (wallawalla, edu 1, opens 2035).
- rn gets `remote:1` from 2038 via the era table.
- Balance: care jobs keep their high stress, so the easy hire is paid back in happiness.

### i55-b12 Home health aide on the farm roads (S, 🟠)
From about 2029 a home health agency (stand-in) hires aides in Waitsburg. You drive to farmhouses, get paid mileage, and know half the valley by name.
- JOBS entry (waitsburg, edu 0, opens 2029, stress .6, wear .4) with a small community gain like other Waitsburg jobs.
- Mileage pay line in js/turn.js offsets its gas.
- Balance: low base pay; the community gain is the draw, and it stops if you skip shifts.

### i55-b13 Sorting robots come to the packing shed (M, 🟠)
Around 2038 the onion shed and the Pasco food plant put in sorting robots. Line jobs open less often and pay grows slower, but a 'line technician' job opens for anyone with a trade certificate.
- 'onion' and 'foodplant' get negative drift and fewer openings after 2038; new 'linetech' JOBS entry (pasco, edu 1, opens 2038).
- An event at the shed: the first robot week, with a choice to sign up for the bridge course.
- Balance: no one is fired outright; the careless player just stalls.

### i55-b14 Office remote days grow with the years (S, 🟠)
Office jobs with remote days get one more remote day per week around 2035 and again around 2045, so long commutes to Richland or Kennewick get easier later in life.
- An era step in js/state.js raises `remote` on office jobs by year (cap 4).
- Jobs tab take-home and gas recompute automatically.
- Balance: community from coworkers drops a little with each remote day, so it is a trade, not a free gain.

### i55-b15 A coworking room above Main Street (M, 🟠)
Around 2032 a coworking room (stand-in name) opens above a Main Street shop. On remote days you can work there for a small monthly fee: you keep the coworker company and earn a bit of community.
- New place in js/outabout.js with a monthly cost line in js/turn.js when you sign up.
- Only matters if your job has remote days.
- Balance: fee is about half the gas it replaces in community value; skipping it is never a trap.

### i55-b16 Evening bridge course before your job fades (M, 🔴)
When your job is shrinking, you can take an evening bridge course: 8 to 12 weeks of classes at half speed while you keep working. Finishing it unlocks the matching new job (shed to line tech, mechanic to EV tech, cleanup to monitoring).
- A `bridge` map from old job ids to new job ids in js/state.js; a study mode that runs alongside work at half the focus cost (js/turn.js, studyProg).
- Offer card on the Jobs tab and in the shrinking-job warning event.
- Not the same as a layoff retraining grant or the one-time career change at 45: this is before the cut, in the same field.
- Balance: costs tuition and some happiness each week; idle play never takes it, so idle still falls behind.

### i55-b17 Boom jobs with an end date: the power line crew (M, 🟠)
Some jobs are temporary by design. In the mid-2030s a crew builds a big power line from the solar fields to the Tri-Cities: very good pay for 3 years, then it ends on a date the card shows from day one.
- JOBS entries can carry `ends` (a fixed year) and a 'Temporary until 2037' chip.
- On the end date you get a clean finish (no layoff mark) and unemployment as usual.
- Balance: high wear and long days; sim check that taking it and saving is good play, blowing it is not.

### i55-b18 A new inn on Main Street hires a front desk (S, 🟠)
As wine tourism grows, an inn (stand-in name) opens in Waitsburg around 2034. It adds a front desk job and wine-weekend crowds on Main Street.
- New outabout.js place plus a JOBS entry at that place (edu 0, opens 2034, LAYOFF_RISK 1, weekend shifts).
- Wine-weekend busy weeks reuse the existing seasonal customer logic if built.
- Balance: shaky like other service work; its edge is a walk to work.

### i55-b19 Short-stay turnover: a tourism side gig (S, 🟠)
After about 2031 a new side hustle appears on wine weekends: cleaning and turning over short-stay rentals for owners in town. Steady small cash in spring and fall.
- New GIGS entry in js/state.js gated by gameYear() >= 2031, months 3–5 and 8–10.
- Uses the existing hustle experience and fade rules.
- Balance: pay under yard work, so it fills gaps without beating a job.

### i55-b20 Help lists when each job opened and when it fades (S, 🟠)
The jobs table in Help gets two small columns: 'Since' and 'Fading from'. Players can plan a career across decades instead of guessing.
- help.js jobs table reads opens, closes and the shrinking window.
- Only shows jobs open in the current game year, plus 'Coming soon' for ones the paper has announced.
- Balance: information only.

### i55-b21 Year in review: a 'Work in the valley' line (S, 🔴)
Each year in review gets one line on how work changed: what opened, what is shrinking, what closed. 'Two solar crews are hiring in Dayton. The packing shed put in its second robot.'
- Built in the yearly review block in js/turn.js (~line 200) from the job table's year fields.
- Shown in Lifetime and 5-year games only.
- Balance: information only; makes the warning system easy to notice.

### i55-b22 The paper prints next year's hiring a year early (M, 🟠)
The town paper (stand-in) runs a story about a project a year before its jobs open: 'Solar company files for permits on the ridge.' Players who read it can start a course ahead of time.
- Event in js/events.js keyed to each job's `opens - 1`; adds a 'Coming soon' row on the Jobs tab.
- Reuses the newspaper/front-page text style if built.
- Balance: rewards planning; a careless player gets no penalty, just no head start.

### i55-b23 A solar lease offer on your wheat ground (M, 🟠)
If you farm the wheat lease or own ground, a solar company offers to rent the far corner for panels: steady yearly rent, but less wheat and some neighbors grumble.
- Event for wheat-lease holders in js/events.js after 2032; yearly income line in js/turn.js; a small community hit for one season.
- Ends when the lease ends, unless you own the ground.
- Balance: rent is below what that ground earns in a good wheat year, so it is safety, not a windfall.

### i55-b24 Gone from the valley: jobs you outlived (S, 🟡)
The Journal keeps a short list of jobs that closed during your life, with the years they ran and whether you ever held one. At the end it becomes a line in the life summary.
- S.goneJobs array filled on each closing year in js/turn.js; shown in the Journal tab (js/ui.js).
- Life-summary line reads it.
- Balance: flavor only.

### i55-b25 Farm equipment tech at the implement dealer (M, 🟡)
From about 2040 farms run fewer hands and more machines. Wheat farm hand openings thin out, and an equipment tech job opens at a Waitsburg implement dealer (stand-in) for trade certificate holders.
- 'farmhand' gets fewer openings after 2040 (not closed); new JOBS entry (waitsburg, edu 1, opens 2040).
- Bridge course from farm hand to equipment tech.
- Balance: farm kid starts are unchanged; only late Lifetime years shift.

### i55-b26 Mentor pay: train the new trade late in your career (S, 🟠)
At 55 or older, if you finished a bridge course and hold the new job, you can become the shop's trainer: a modest raise and community, and new hires you trained show up in events.
- Offer event in js/events.js for age >= 55 with a bridge-course job; sets S.raise up a step.
- Ties into the existing coworker events if built.
- Balance: gated by having done the work earlier, so idle and careless players never see it.

### i55-b27 Main Street jobs that thin out (S, 🟡)
Over the decades the bank's teller window goes to two days a week and the grocery puts in self-checkout. Teller and grocery clerk jobs open less often and pay grows slower, but neither vanishes.
- Drift and fewer openings for 'teller' (after 2040) and 'grocer' (after 2036) via the era table.
- One small town event each, so the change is felt, not just numbers.
- Balance: these are starter jobs; good play moves on from them anyway.

### i55-b28 Vineyard irrigation tech as water gets tight (S, 🟡)
Drier summers make water the hard part of wine. Around 2036 a vineyard irrigation tech job opens in Walla Walla: sensors, drip lines and long July days.
- JOBS entry (wallawalla, edu 1, opens 2036, wear .6) with summer overtime in July and August.
- One event: a broken line during a heat week.
- Balance: pay near cellar hand plus a bump; the edge is a winery path for trade-certificate players.

### i55-b29 Your kid's first job didn't exist when you were 18 (S, 🟡)
When a grown kid takes their first job, the text names a job from the current board, and if it opened after you started, you get a short line: 'That job wasn't on the board when you were their age.'
- Reads JOBS with opens > the year your life began; text in the kid milestone code (js/events.js or features.js).
- Balance: flavor only.

### i55-b30 Sim check: sixty years of the job board (M, 🔴)
The balance sim plays Lifetime runs and checks the changing board: never fewer than 18 open jobs a year, each education level always has a job, careless median stays at or under 60, idle at or under 50, good play at or above 70.
- New checks in the sim/test scripts (tests/), run per decade with the era table on.
- Fails the build if a shrinking job leaves an education level with nothing to apply for.
- Balance: this is the guard for every idea above.
