# Ideas round 72

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 72: Raising kids in a small town

Right now a kid is just a birth date, a monthly bill and a bit of happiness; these ideas give each kid a bond, a spark, memories and a path, so how you parent shows up years later.

### i72-a01 A bond meter for each kid, fed by family weeks (M, 🔴)
Each kid gets a hidden 0–100 bond that grows in weeks you Rest, Get outside or Show up for town while they live at home, and slips in overtime, class and side-hustle weeks.
Files: state.js kids become {born, bond} objects (migrate old birth-month numbers in normalize); turn.js updates bond next to kidJoy; ui.js Family card shows a word (close, fine, distant), never the number.
Balance: Bond only grows a little per week and caps at +2, so it rewards steady presence, not one burst. Idle play keeps the default focus and lands in the middle.

### i72-a02 Each kid keeps five memories of you (M, 🔴)
Big parent moments are saved to the kid who saw them: you missed senior night, you helped with tuition, the thin Christmas, the move. Each kid keeps up to five, newest pushing out the weakest.
Files: A tiny memory list per kid in state.js; events.js choices call kidMemo(tag, +/-); the 18th birthday sheet and late-life events quote one back in plain words.
Balance: Memories change bond and later events, not score directly, so there is no memory farming.

### i72-a03 Their path at 18 comes from how they grew up (L, 🔴)
At 18 each kid lands on a path: college, a trade, the military, the family farm or business, a job in town, or a move to the city. The odds come from bond, money at home, their spark and how much you showed up.
Files: Replaces the single 'A kid heads off to college' event in events.js with a weighted roll in features.js; the path is saved on the kid and read by the end screen, legacy and grown-kid events.
Balance: No path scores higher on its own. Paths only shift later events and help, so careless play does not get a better kid outcome by chance.

### i72-a04 Count on family only works if a kid is close (S, 🔴)
Late-life care 'Count on family' needs a grown kid with good bond who lives nearby. A distant kid sends a check now and then instead.
Files: features.js CARE.family 'if' test reads bond and the kid's path town; a lower happy cost when the helping kid is close.
Balance: Stops a careless parent from getting free care in old age. Good play still gets the cheapest care.

### i72-a05 Balance: kids can't be a free happiness pump (S, 🔴)
Check that kid joy, bond and later help do not lift careless or idle runs. Add a parent bot to the balance sim that has kids and ignores them.
Files: tests balance sim plus the turn.js kid lines; tune KID_COST and kidJoy only if the careless median rises above 60.
Balance: Keeps careless <= 60 and idle <= 50 with the new kid systems turned on.

### i72-a06 Each kid has a spark: sports, animals, music, books or engines (M, 🟠)
Every kid shows one interest by age 6. Backing it (fees, rides, a used guitar) costs money and weeks but grows bond and nudges their path at 18.
Files: A spark field on the kid in state.js; events.js picks spark-tagged events (game nights, fair, recitals, the shop); ui.js shows the spark icon on the Family card.
Balance: Ignoring the spark is cheaper but costs bond, so money and time trade off fairly.

### i72-a07 Family dinners: weeks you're home by six (S, 🟠)
Night shifts, overtime and long commutes mean you miss dinner. The game counts dinner weeks each year and shows it on the Family card.
Files: turn.js counts a dinner week when focus isn't overtime and the commute is under 40 miles; it feeds bond. Year in review shows 'home for dinner 38 of 52 weeks'.
Balance: A small nudge, not a penalty: good play can still work hard and keep a decent count.

### i72-a08 The younger one remembers what the older got (S, 🟠)
Help one kid with tuition, a truck or a wedding and the next one expects the same. Do less and their bond drops; do the same and it costs you again.
Files: features.js keeps a 'given' list on the family; events.js college and truck events read it and add a fairness line to the choice text.
Balance: Makes big gifts a real decision across kids, so a parent can't buy bond once and reuse it.

### i72-a09 The kid who's always at your table (S, 🟠)
Your kid's friend from a hard home starts showing up for dinner most nights. Feed them, call their folks, or set a limit.
Files: A short story chain in events.js with three steps over a year; feeding them costs a little each month.
Balance: Kindness costs real money and pays in community and bond, not in score.

### i72-a10 The in-home daycare in town has a waitlist (M, 🟠)
With a baby and a job, you need care. Waitsburg's one in-home daycare has a waitlist; meanwhile it's the Walla Walla center (drive), a partner cutting hours, or Grandma.
Files: state.js adds a care choice for kids under 5 that sets the childcare line in turn.js; events.js offers the opening after a few months.
Balance: Replaces the flat commute childcare with a choice; the cheapest option always costs time or happiness.

### i72-a11 Everyone knows your kid: slip-ups touch your standing (M, 🟠)
In a town this small, a teen's TP job on the school or a speeding ticket on Main Street gets around. How you handle it moves your community, up or down.
Files: events.js teen events add a community change based on your choice (make it right in person vs brush it off); log line in the Journal.
Balance: Owning it costs happiness but saves community, so careless answers lose standing.

### i72-a12 They follow you into your trade, or swear off it (S, 🟠)
If your job was steady and you seemed happy during their teen years, a kid may want the same work. If it ground you down, they say never.
Files: features.js path roll reads your average happiness and job type over the kid's ages 13–17; a line at 18 says why.
Balance: Flavor tied to how you actually lived, so it can't be gamed with one good week.

### i72-a13 How often they call depends on the bond (S, 🟠)
Grown kids check in by phone or visit at a rate tied to their bond and how far away they live. Close kids drop by; distant kids call on your birthday.
Files: A weekly chance roll in events.js for 'A call from your kid' and 'Your kid drops by', reading bond and path town.
Balance: Small happiness bumps only; it rewards earlier parenting, not current grinding.

### i72-a14 Your kid moves back to raise their own kids here (S, 🟠)
Around 30, a grown kid who left may come home to raise a family in Waitsburg if the bond is good and the town is doing well.
Files: events.js reads bond, path and town goals finished; on yes, the kid's town becomes Waitsburg and grandkid events open.
Balance: Ties raising kids to building the town; careless play rarely sees it.

### i72-a15 Who's in the room at the end (S, 🟠)
When a Lifetime game ends, the end screen says which kids came home and what each one remembered most.
Files: features.js finish() reads each kid's bond and top memory; no score change.
Balance: Pure payoff for the thread; nothing to exploit.

### i72-a16 Tailgate talk: your teen asks what you'd do (S, 🟠)
A summer night on the tailgate, your teen asks if they should stay or go after school. Your answer nudges their path and is saved as a memory.
Files: One events.js event for kids 15–17 with three answers: stay, go, 'your call'.
Balance: No right answer; each shifts the path roll a bit.

### i72-a17 One Family page per kid: time, money and memories (M, 🟠)
Tap a kid on the Family card to see their age, stage, spark, bond word, what you've spent on them and the memories they keep.
Files: ui.js sheet built from the kid object; reads only, no new state.
Balance: Shows the cost of each kid plainly so players can plan.

### i72-a18 Allowance or paid chores: a money lesson that sticks (S, 🟡)
When a kid turns 8, pick: no allowance, a flat allowance, or pay for chores. It costs a little each month and shapes how they handle money at 18.
Files: A setting on the kid in state.js; the monthly bill line in turn.js; the path roll reads it.
Balance: Cheap either way; the effect is story and a small push on their path.

### i72-a19 Pulling a teen out of Waitsburg High mid-way (S, 🟡)
Move out of town while a kid is 14–17 and they change schools. They lose friends and their spot on the team, and they remember it.
Files: features.js move code checks kids' ages and adds a strong memory and a bond drop; a warning line on the move sheet.
Balance: Makes moving a real family choice, not just a money one.

### i72-a20 The child tax credit on your refund (S, 🟡)
Each kid under 17 adds a credit to the spring refund, so kids cost a bit less than the monthly bill suggests.
Files: The tax refund event in events.js adds a per-kid amount using cost().
Balance: Small and fair; does not make kids a money maker.

### i72-a21 A gap year on the harvest crew (S, 🟡)
Not sure about college, a grown kid works a year of harvest and ranch work first. The path roll runs again a year later.
Files: A new path option in features.js and one follow-up event in events.js.
Balance: No score effect; it just adds a story beat.

### i72-a22 Your kid ships out to basic training (S, 🟡)
For a kid on the military path, a send-off at the Walla Walla bus stop, letters home, and a visit on leave a year later.
Files: Two or three events in events.js for the military path; letters show in the Journal.
Balance: Happiness swings only, matched by the absent kid's quiet house.

### i72-a23 The welding certificate at the community college (S, 🟡)
On the trade path, a kid finishes a one-year certificate in Walla Walla and lands a job in the valley. They often stay close.
Files: Trade path events in events.js; the kid's town is set nearby, raising the chance of drop-by visits.
Balance: Shows trades as a full path, not a fallback.

### i72-a24 The college visit road trip (S, 🟡)
Drive your senior across the state to see two campuses. It costs a weekend and gas, and helps their choice.
Files: An events.js event in spring of age 17; uses the road-trip gas cost and a memory.
Balance: Optional; skipping it costs nothing but a missed memory.

### i72-a25 Match your teen's car savings dollar for dollar (S, 🟡)
Your teen saves from a summer job for a first car. Match it, pay all, or let them do it alone.
Files: An events.js choice at 16 tied to the teen job; the kid's car is a field read later.
Balance: Matching costs money but builds bond and a better money habit.

### i72-a26 Sixteen and wants to quit school for a job (S, 🟡)
A teen with a low bond or no spark wants to drop out to work full time at the elevator. Push back, make a deal, or let them.
Files: An events.js event gated on low bond; the choice shifts the path.
Balance: Shows up mostly for careless parents, so ignoring kids has a cost.

### i72-a27 An 18-year receipt for each kid (S, 🟡)
When a kid turns 18, a card shows what you spent on them, how many weeks you were home, and the top memory.
Files: Built from the bill lines in turn.js and the kid's memory list; shown with the 18th birthday sheet.
Balance: Plain numbers, no score change.

### i72-a28 A grown kid asks you to co-sign a loan (S, 🟡)
Your 24-year-old wants a truck or a place and needs a co-signer. Sign, decline, or offer a smaller loan from you.
Files: A two-step events.js chain; if they miss payments later, you pay a share.
Balance: A real risk-and-trust choice; signing for a distant kid is riskier.

## Ideas 72: The first ten minutes, revisited

With Out and about, retirement, money, jobs and school added, a brand-new player now meets far more on day one; these ideas trim, delay and explain it.

### i72-b01 The first Home tip shows before you have a job (S, 🔴)
The "pick a focus, then End Week" tip only shows once you have a job, so a Fresh start player lands with no tip at all. A jobless tip comes first: one application a week, and what to do with the week meanwhile.
- Today the first tip (id `focus`) checks `S.jobId`. A Fresh start has no job, so Home shows no tip in week 1, and a rejected player gets none either.
- Add a `nojob` tip before it: "One job application a week. While you wait, pick a focus and tap End Week."
- Files: ui.js (TIPS, currentTip).
- Balance: words only.

### i72-b02 No paycheck yet? A one-tap Side hustle in the meantime (S, 🔴)
The "No paycheck coming in" card gets a second button: "🔧 Side hustle meanwhile (about $X a week)". New players don't know Side hustle works without a job.
- Side hustle has no `needsJob`, but nothing on Home says so. The card names this season's gig and its pay from `currentGig()`.
- The button sets the focus, like the existing `data-sugg` buttons.
- Files: ui.js (renderHome warn card), features.js (currentGig).
- Balance: hustle pays less than any job and costs happiness and health, so it is a bridge, not a strategy. Idle play does not change.

### i72-b03 "Your cash lasts about 5 weeks" while you're job hunting (S, 🔴)
While you have no job, the No paycheck card adds one line: how many weeks your cash covers at your current bills. It turns $1,500 into a number a newcomer can feel.
- Weeks = money ÷ the sum of `billLines()` (rent, food, insurance, gas). A Fresh start reads "about 5 weeks".
- Under 2 weeks the line turns red and says what debt costs each week.
- Files: ui.js (renderHome), turn.js (billLines).
- Balance: information only; it pushes careless players toward a job sooner, which is the point.

### i72-b04 Certificate fees paid week by week, not all up front (M, 🔴)
Signing up for a CDL costs $1,800 at once, more than a Fresh start's $1,500, so one tap on the Life tab puts a new player in debt at 1.5% a week. Fees now split across the course weeks, with "Pay it all now" as an option.
- `startCert()` takes the fee at sign-up today. The sign-up sheet adds "Pay as you go: $300 a week for 6 weeks" as the first choice.
- If even that would put you below $0, the sheet says so in one line before you confirm.
- Files: features.js (startCert, certWeek), ui.js (cert sign-up sheet), turn.js (bill line "Certificate course").
- Balance: same total cost; only the timing changes. A rules test checks the full fee is always paid.

### i72-b05 Index funds keep a month of bills back (S, 🔴)
With $1,500 you can tap +$1,000 into index funds in week 1 and be in debt by week 3. The invest buttons now ask first when they would leave less than a month of bills in cash.
- `invest()` only checks that you have the money. Add a soft check: "That leaves $500, about 2 weeks of bills. Invest anyway?"
- The card's +$1,000 and +$5,000 buttons gray out with a reason while cash is under one month of bills.
- Files: features.js (invest, investCard).
- Balance: stops an early trap. Patient investing is unchanged.

### i72-b06 Tap the money in the header for this week's in and out (S, 🔴)
The cash number at the top becomes a button. It opens a small sheet: last week's pay in, bills out, and what next week looks like, with a link to the full money outlook.
- Today the most-watched number on screen explains nothing, and the outlook is buried in a Life tab card.
- Reuse `S.last.lines` for last week and the first row of `outlookSheet()` for next week.
- Files: ui.js (render header), features.js (outlookSheet).
- Balance: information only.

### i72-b07 "Can apply" starts switched on until your first job (S, 🟠)
The Jobs board now has close to 40 jobs, each with tags for unions, apprentices, clearance, seasons and majors. On a first life, the "✅ Can apply" filter starts on, so the first visit shows only the jobs you can get this week.
- `jobOK` starts `false`. Start it `true` while you have never been hired in this life (or on your first life ever), with a line: "Showing jobs you can apply for. Tap to see all."
- Files: ui.js (jobOK, renderJobs).
- Balance: a shorter list, same jobs and odds.

### i72-b08 Out-of-season jobs fold under "Hiring later this year" (S, 🟠)
In January, the Forest Service crew and harvest trucking sit on the board with a gray "Hires Jun" button. They move into one folded row at the bottom with the month each one opens.
- Rows where `!jobInSeason(x)` and you aren't on recall go into a `<details>` row.
- Files: ui.js (renderJobs, jobRow).
- Balance: layout only.

### i72-b09 A seasonal first job says when it ends, before you take it (S, 🟠)
A newcomer in January sees the Bluewood lift job close to home and takes it, then is laid off in April without warning. The Apply button and the interview sheet now say "Runs until March: you'll need another job in 10 weeks."
- Use the job's `season` months and today's date. The hired sheet repeats it, and the Journal logs it.
- Files: ui.js (jobRow, hired), features.js (interviewSheet, seasonWords).
- Balance: same job and layoff; the player just isn't surprised.

### i72-b10 Interview answers speak to you: "You have no People skill yet" (S, 🟠)
"Sell yourself hard" says "Works if you have People skill." A new player has none and can't tell. With no People skill, the hint now says "⚠️ You don't have People skill yet: this lowers your odds."
- `INTERVIEW` hints become functions that read `skillLv('people')` and `HARD_TO_FILL` for this job.
- Files: features.js (INTERVIEW, interviewSheet).
- Balance: same odds; it only removes a hidden trap.

### i72-b11 Life tab: "Right now" first, "Later in life" folded (M, 🟠)
An 18-year-old's Life tab opens with goals, skills, a business list, investing, wine futures, the 401(k), Social Security and a will. It splits into "Right now" (school, home, ride, insurance, household) and a folded "Later in life" with a one-line summary of each card.
- "Later in life" holds the business, investing, 401(k) and planning cards. It opens by itself once you own something there (a fund, a 401(k) balance, a business) or turn 30.
- The fold remembers open or closed, like More options on the title screen.
- Files: ui.js (renderLife), features.js (bizCard, investCard, planningCard).
- Balance: layout only. Players who use these systems early lose nothing.

### i72-b12 No buttons grayed out for years (the will at 18) (S, 🟠)
The "Write a will · from age 25" button sits disabled on an 18-year-old's screen for seven years. Buttons locked by age hide, and a single "Opens later: will at 25, retirement at 62" line takes their place.
- Covers the will (`WILL_MIN_AGE`) now, and any later age-locked buttons through one `ageLocks()` list.
- Files: features.js (planningCard), ui.js (renderJobs retire button).
- Balance: layout only.

### i72-b13 Program chips and certificates wait for your first Take classes week (S, 🟠)
Seven program chips and five certificates sit on the Life tab from week 1. They fold into one line ("📚 Pick a program when you start classes") until the first time you pick Take classes, which opens a short program picker.
- The picker shows the programs and what each leads to, with General studies as the default. The Life tab card then shows them as it does today.
- Tapping a locked certificate job on the Jobs tab still opens its sign-up directly.
- Files: ui.js (eduCard, focus buttons), features.js (programs).
- Balance: no change to study cost or pay.

### i72-b14 Out and about says "doesn't use your week" until your first visit (S, 🟠)
The Out and about button reads "2 of 2 quick visits left this week". A newcomer can't tell it's extra time. Until your first visit it reads "Free: quick visits on top of your week (2 left)".
- After one visit it goes back to today's text.
- Files: outabout.js (outButton).
- Balance: words only. Visits are already capped at 2 a week.

### i72-b15 Net worth says "cash plus your pickup" while that's all it is (S, 🟠)
A Fresh start sees $1,500 in the header and about $4,000 net worth on Home, with no clue why. While net worth is only cash and the vehicle, the stat shows a small line under it: "cash + your 1998 pickup".
- Once a 401(k), fund, home or debt appears, the line goes away and the ⓘ sheet takes over.
- Files: ui.js (renderHome net worth button).
- Balance: words only.

### i72-b16 The 0/N badge count waits for your first badge (S, 🟠)
The Life tab opens with "🎯 Life goals · 0/N badges", which reads like a test you are failing. The count shows after your first badge; before that, the card says "Pick up to 3 goals for this life."
- Files: features.js (goalsCard).
- Balance: words only.

### i72-b17 First-month events mark the careful choice with 🛡️ (S, 🟠)
In your first life's first month, the event choice with the smallest downside gets a small 🛡️ "safe" mark. New players learn what the game thinks is careful without reading every number.
- Pick the choice with the smallest worst-case loss from its `fx` and money. Ties go to the first choice.
- After week 4, or after any first life, the mark stops.
- Files: events.js (showEvent).
- Balance: the safe choice is rarely the best one, so it guards against early disasters but doesn't steer good players. The sim checks careless median stays at or under 60.

### i72-b18 A rough first life offers Relaxed, once (M, 🟠)
If your first-ever life drops into debt or a red stat in its first two months, a one-time card offers to switch this life to 🌤️ Relaxed. Its score is kept under Relaxed records, as today.
- Uses the existing `MODES.relaxed` and `bestKey()`, so records stay fair. "Keep Normal" is the first button, and saying no never asks again.
- Files: ui.js (renderHome card), state.js (mode switch), features.js (records).
- Balance: Relaxed scores are kept apart from Normal, so nobody climbs Normal records this way.

### i72-b19 A button budget test for the first weeks (M, 🟠)
A test counts the buttons and cards on Home, Jobs and Life for a Fresh start at weeks 0, 4 and 13 and fails if a new feature pushes week 0 past a set budget. Each new system then has to decide when it shows up.
- Uses the existing Playwright helpers in tests/. The budget numbers live in one file so they are easy to raise on purpose.
- Files: tests/ (new first-weeks clutter test).
- Balance: none; it guards the first ten minutes against future builds.

### i72-b20 After you apply, the Jobs board says "Next chance: next week" (S, 🟠)
Once you have applied, every Apply button on the board goes gray. The board now leads with "You applied this week. Next chance after End Week" and folds the list under "Look anyway".
- Files: ui.js (renderJobs, `S.applied`).
- Balance: layout only.

### i72-b21 Stat bars show where "doing fine" starts (S, 🟡)
Happiness, health and community are 0 to 100 with no sign of what's good. Each bar gets a faint tick at 60, where the color already turns green, and the ⓘ sheet says "60+ is doing well".
- Files: ui.js (statBtn, STATINFO), CSS in index.html.
- Balance: information only.

### i72-b22 Insurance card says "the basics are covered" on a new life (S, 🟡)
The Insurance & phone card shows a breakdown and "Change coverage" from week 1. Until you change anything, it leads with "You're covered for the basics. Most people don't change this in the first year."
- Files: ui.js (renderLife insurance card).
- Balance: words only. It quietly steers new players away from dropping coverage to save a few dollars.

### i72-b23 The Map switch arrives after your first month (S, 🟡)
Home shows a List/Map switch above the focus buttons from week 1. On a first life it waits until week 5, then appears with a one-time "Try the map" tip.
- Players who have finished a life see it from the start.
- Files: maps.js (mapToggle), ui.js (TIPS).
- Balance: layout only.

### i72-b24 First launch asks one comfort question (S, 🟡)
The very first time the game opens, a small card asks about text size and night mode, with a preview, then never again. Settings stays in the menu for later.
- Uses the existing `SETTINGS` and `applyPrefs()`; it shows only when no prefs exist.
- Files: ui.js (renderTitle, settingsSheet), boot.js.
- Balance: none.

### i72-b25 Your first town goal is sized for a newcomer (S, 🟡)
A first life starts in January with the winter goal: 4 weeks of Town or Get outside, while you're still job hunting. On your first life, the first town goal you meet needs half the weeks, with half the reward.
- `seasonWeek()` reads a `firstGoal` flag. After that goal, need and reward go back to normal.
- Files: state.js (seasonGoal, seasonWeek, seasonLine).
- Balance: half the reward for half the effort, so the score is unchanged on balance.

### i72-b26 The trip chip says what a trip is for (S, 🟡)
Home's "🚗 Plan a trip" chip means nothing in week 1. On a first life it reads "🚗 Walla Walla run: cheaper groceries" until your first trip, which is the most useful early trip.
- Files: features.js (tripChip).
- Balance: words only.

### i72-b27 Focus fade waits until your second month, then speaks in words (S, 🟡)
From week 4, Home says "next week it works at 85%". New players don't know what "works" means. In the first two months the line says "Doing the same thing every week loses its punch. Mix it up."; numbers come later.
- Files: ui.js (renderHome streak line).
- Balance: same fade and rut rules.
