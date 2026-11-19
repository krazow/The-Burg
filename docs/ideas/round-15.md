# Ideas round 15

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 15: Playtest of a long game

Findings from two headless 5-year games each (a careful planner using Out and about, trips, carpools, side hustles, a business and the road and work events, and a player who keeps making mediocre choices): the planner scored 90 and 92, the mediocre player 58 and 41, with no page errors and no broken screens in 120 weeks of tap-through play; the problems are stats stuck at 100 from year 2, idle cash and businesses, and a few events that repeat or never fire.

### i15-a01 Community counts your average, not the last week (S, 🔴)
The Life Score uses your average happiness and health but your community on the final week, so a late council seat lifts it to 100. Score community the same way as the others: the average over the life.
In the playtest the mediocre player spent only 31 of 260 weeks on Show up for town, sat at 52–60 community for three years, then won a council seat and ended at 90. Community scored a full 100/100 and lifted that life to 58, right at the careless ceiling.
Add S.commSum next to happySum and healthSum in turn.js and use it in lifeScore() (features.js). Show "average" on the end screen line.
Balance: cuts late spikes for careless play; a planner who is steady all game loses almost nothing.

### i15-a02 Out and about gains taper off in the 80s, like Rest (S, 🔴)
Quick visits push happiness and health to 100 by year 2 and keep them there. Visit gains should shrink as a stat passes 80, the same way Rest already tops out in the low 80s.
The careful planner made two visits a week (yoga 112 times, the jam 84) and had happiness 96–100 and health 99–100 from the second year to the end. Happiness and health scored 100/100 every year after that.
In visit() (outabout.js), scale each positive gain by clamp((90 - stat) / 15, 0.2, 1). The per-week cap stays.
Balance: a planner still reaches the high 80s; the top 10 points need a partner, a home, a dog or a good job. Careless and idle play barely use visits, so they are not affected.

### i15-a03 Windstorm: a storm season and a real choice (S, 🔴)
Windstorm was the most common event in the playtest (13 times in four 5-year games), comes in any month and is one button that only costs money. Make it fall and winter only, once a year at most, with a choice to prepare.
Counts: Windstorm 13, A tip from a friend 10, Neighbor's moving day 10, Found money 9, Cheap flight deal 9 over four 5-year lives.
events.js: when: October–March, yr:1, and two choices: "Trim the big limb and tie things down (-$40)" (halves the damage, Handy practice) or "Hope for the best" (today's roll).
Balance: same money on average; the choice rewards a planner a little.

### i15-a04 A business that earns nothing says so (S, 🔴)
The mediocre player paid over $9,000 for a food truck and it earned $4,100 in four years because it only runs on Side hustle weeks. Each April the game should say what the business needs, and each October show what it earned against what it cost.
The food truck pays only when your focus is Side hustle, April to October. Nothing on Home said so, so it sat in the driveway for most of four seasons.
features.js bizWeek(): an April note ("Your food truck runs on Side hustle weeks") and an October note with the season's earnings. bizCard() shows "This season: $0" in red when idle.
Balance: information only. Careless players still have to change their weeks to earn from it.

### i15-a05 Sandbagging leads into the levee story too (S, 🔴)
The levee story only starts if you chose "Stay dry" when the Touchet ran high, so the people who helped sandbag never see it. It never fired in four lives. Start it from either choice, with text that fits.
"Water in the basements" needs S.highWater, which only the "Stay dry" choice sets (events.js). "Help sandbag" clears it.
Set highWater for both choices and give the first levee step a line for the sandbaggers ("You were there that night. The town wants a real fix.").
Balance: the levee story asks for time and money, so it is a choice, not free points.

### i15-a06 "Truck trouble" names what you actually drive (S, 🟡)
The planner drove a used sedan and still got "Truck trouble" four times. The title and icon should follow your vehicle (car trouble for the sedan).
events.js "Truck trouble": the text already says the vehicle's name; the title does not. Use a title function or two variants, and keep the cooldown key the same.
Check EVENT_PLACE and the album still match the title.
Balance: none.

### i15-a07 Story steps are marked on event buttons (S, 🟠)
A careful player who judges each choice by what it costs today turned down "The porch is sagging" and "The kitchen is next", so the home-value payoff never came. Choices that start or continue a story should carry a small 📖 "starts a story" tag.
Both planner lives skipped the fixer-upper story: the first step looks like a pure cost. The payoff (+$6,500–8,000 home value) is three steps away and never hinted.
Add story:true to chain choices in STORY_EVENTS (features.js); showEvent() (events.js) adds a muted line under those buttons.
Balance: no numbers change; it only tells you a story continues.

### i15-a08 The wheat lease pays its own farming costs (S, 🟠)
A $6,000 lease paid $6,500–9,600 every August, so it paid for itself in one harvest and earned about four times its price over the game. Add a spring bill for custom farming, seed and fertilizer.
Planner harvest checks: $8,818, $8,278, $8,661 and $6,520, $7,353, $9,626, $7,272.
features.js BIZ.wheat: an April line "Custom farming and fertilizer" of about 40% of the average harvest; a bad year (the 15% roll) can now lose money.
Balance: only planners lease wheat; it brings their wealth part back toward the 400,000 target instead of over it.

### i15-a09 Buy the wheat ground outright (M, 🟠)
By year 4 the planner had $150,000–215,000 sitting in checking with nothing left to buy. After three years on a lease, the landowner offers to sell the 80 acres: a big purchase that holds its value and pays the harvest without lease renewals.
A once-a-life offer (an event in features.js) when you have leased 3+ years and have the cash. Land counts in netWorth() and rises about 2% a year; property tax is a yearly line.
The Life tab shows the land under Your business.
Balance: it turns cash into an asset of about the same value, so it does not add free points; it gives late money something to do.

### i15-a10 A family can start inside a 5-year life (S, 🟠)
"Starting a family?" needs age 23, so a 5-year life that starts at 18 almost never reaches kids even with a partner from 19. Allow it from 21 once you have been together two years.
No kids in any of the four lives; the kids, school and college events never fired.
events.js: track S.partnerSince when the partner arrives; the family event checks age >= 21 and two years together.
Balance: a kid costs about $650 a month, so it is a real trade, not a bonus.

### i15-a11 The dealer sheet shows the 5-year total (S, 🟠)
The mediocre player bought the new financed pickup with $4,500 and paid $36,600 in truck payments over the game. The buy sheet should say what the loan costs in all and how much of your take-home it is.
buyCar() (ui.js): add "About $38,400 over 5 years" and its share of your take-home (for example "about 22%") under the payment line.
Same line on the Life tab while the loan runs.
Balance: information only; it helps careless players notice the trap.

### i15-a12 Overtime most weeks counts as a rut (S, 🟠)
The mediocre player worked overtime 144–154 of 260 weeks but saw the rut warning only once, because any other week resets the streak. Count overtime over the last 8 weeks instead.
turn.js: if 6 of the last 8 weeks were Work extra hours, show "Running on fumes" once and apply the rut penalty; keep recentF 8 long.
Balance: hits careless overtime grinding; the planner mixes focuses and never trips it.

### i15-a13 Year in review: one lever, one leak (S, 🟠)
The year in review lists numbers but never says what to change. Add two lines worked out from your year: the biggest leak ("Overtime 30 weeks: health -22") and the biggest unused lever ("$93,000 in checking is doing nothing").
showReview() (turn.js). Leaks: weeks of overtime, debt interest, an idle business, health under 40. Levers: idle cash, a 401(k) under 5%, an unfinished degree, a long commute without a carpool.
Balance: advice only; it helps mediocre players climb without making careless play score more.

### i15-a14 A work calendar: four sure beats a year (M, 🟠)
11 of the 30 work events never fired in four 5-year lives, including Year-end bonus, Holiday party, Health plan choice and Employee of the month. Give each working year four set beats outside the weekly dice.
January: health plan choice. June: review. Your job's busy season: crunch. December: party or bonus. Each fires once in its month if you have a job (events.js WORK_EVENTS, a small scheduler in turn.js).
The 8% weekly work roll then draws only the everyday work events.
Balance: a bonus goes to people who stayed in a job; the crunch costs health, so it is not free money.

### i15-a15 Standing trips and visits that keep running during skips (S, 🟠)
The planner set up the same Walla Walla trip every 4 weeks and the same two visits every week, by hand, for five years. Let you save a standing trip and up to two standing visits that run on their own, even during ⏩ skips.
features.js and outabout.js: S.standing = {trip, every, visits}. weekTick() plans it when due and skips anything closed or unaffordable, with one Journal line.
A "Make this a standing trip" toggle on the trip sheet and the visit result.
Balance: the same effects as doing it by hand (repeat visits still count half); it saves taps, not points.

### i15-a16 Long commutes use up your evenings (S, 🟠)
A 68-mile Hanford commute plus two visits a week left the planner at full happiness: the drive cost almost nothing. With a job 50+ miles away, you get one Out and about visit a week instead of two.
visitsLeft() (outabout.js) uses OUT_MAX - 1 when commuteOneWay() >= 50 on a drive day; remote days and retirement give it back.
The Out and about button says why ("Long commute: 1 visit this week").
Balance: makes the long-commute, high-pay choice a real trade again.

### i15-a17 A friend's tip is for a job you would take (S, 🟡)
"A tip from a friend" came 10 times in four lives, often for jobs the player had no reason to want. Only offer jobs that pay at least 10% more after the drive, and skip the event when there are none.
events.js "A tip from a friend": filter by take-home after gas (commuteCost in ui.js), not by gross pay.
Balance: fewer empty events; no change to pay.

### i15-a18 Score so far shows what is maxed and what can still grow (S, 🟠)
From year 3 the planner's score rose only through net worth, while happiness, health and community sat at 100/100. The score sheet should mark maxed parts and point at the part that can still grow.
showScoreNow() (features.js): a "maxed" tag on parts at 95+, and one line like "Net worth is 39/100: the part that can still grow."
Balance: information only.

### i15-a19 Main Street specials of the week (M, 🟠)
The planner's best visits were the same two places nearly every week for five years. Each week one or two places run a special (half price, a double effect, a one-off guest) shown on the Out and about list, so the best pick changes.
outabout.js: pick specials from the week's seed (works with the weekly challenge dice); a ⭐ tag in placeLine() and the Main Street map.
Balance: specials only change which visit is best, not how many you get; the per-week stat cap stays.

### i15-a20 Dealership events skip a nearly new vehicle (S, 🟡)
"A test drive at a dealership" came three times to a player who had just financed a brand-new pickup. Skip it while a vehicle loan runs or the vehicle is under three years old.
events.js: add !(S.loanLeft > 0) and a vehicle-age check (store S.carSince in buyCar()).
Balance: none.

### i15-a21 Events for the business you own (M, 🟠)
Owning the woodshop, food truck or wheat lease brought no events of its own in the playtest; only harvest checks. Add a few per business: a custom table order, a spot at Fair and Frontier Days, hail on the wheat.
Three or four events per business in features.js with when: S.biz.type, using skills (Handy for the order, Cook for the fair).
Balance: each has a cost or risk side (hail can halve the harvest, the fair spot costs a fee), so owning a business is not just more money.

### i15-a22 Events that fit a comfortable life (M, 🟡)
With $200,000 in the bank, "Found money: $50" and a $60 windstorm mean nothing. When cash is far above a year of bills, money-only events should switch to time, health or community stakes.
events.js: a comfy() helper (cash > 12 months of bills); a few common events get a second choice set for it, like "Pay a crew" versus "Do it yourself (health -2, Handy)".
Balance: the planner gets real choices late; careless play rarely reaches that much cash.

### i15-a23 Where your money came from (S, 🟠)
At the end, and in each year in review, show money by source: pay, overtime, side hustle, business, partner, 401(k) growth, and the biggest costs. The playtest had to add this up by hand.
Keep a running tally of S.last.lines by label (turn.js) in S.ledger by year; finish() and showReview() show the top five in and out.
Example from the planner: pay $378,000, overtime $72,000, harvest $26,000, hustle $8,800; food $28,700, mortgage $47,000.
Balance: information only.

### i15-a24 Long-game checks in the balance sim (S, 🟠)
The sim test checks scores but not the long-game problems this playtest found. Add report lines for weeks with a stat at 95+, the most repeated event per game, and businesses that earned less than they cost.
tests/sim.test.mjs: count weeks at 95+ for each stat, the top event count per game, and idle-business games; print them in the balance report, with a soft limit (for example no stat pinned for more than 2 years for the planner).
Balance: guards the fixes above from drifting back.

### i15-a25 A 15% 401(k) step (S, 🟡)
The planner maxed the 401(k) at 10% and still had $200,000 idle. Add a 15% step on the Life tab (the match stays at 3%).
K401 in state.js gets 0.15; the buttons in renderLife() (ui.js) show the weekly cost.
Balance: moves cash into an account that grows, but it is locked until retirement and counts the same in net worth, so scores barely change.

### i15-a26 A turned-down story comes back once (S, 🟡)
Say "Leave it" to the sagging porch and the fixer-upper story is gone for good. A year later, offer it once more ("The porch board finally gave way").
features.js: chainEnd for a decline sets a retry turn 52 weeks out instead of step 99, and the first step's text changes on the retry.
Balance: the second offer costs a little more (the damage got worse).

### i15-a27 The jam's boost fades after a few in a season (S, 🟡)
The planner went to the bluegrass jam 84 times in five years, about every time it ran. Going to every jam should make you a regular there (a name in the Journal), but the stat gain should fade after the first few in a season.
outabout.js visit(): for the jam, effect drops after 4 visits in a season (resets each season).
Balance: small; it trims the cheapest repeatable +happy, +community visit the planner leaned on.

## Ideas 15: Planning tools and info

Tools that help you see where your life is heading in The Burg: trend lines, money charts, what's coming up, side-by-side comparisons, goal progress, and a Journal that keeps the whole story. None of them add points; they help careful players plan.

### i15-b01 Keep a small weekly history of money and the four stats (S, 🔴)
Adds S.hist: one row per week, written at the end of weekTick in js/turn.js; migrate() in js/state.js starts it empty.
After 104 rows, older rows merge to one per month, so a Lifetime save grows only a few KB.
Backups and checkpoints carry it with the rest of S.
Balance: no gameplay effect; it only feeds the tools below.

### i15-b02 Tiny trend lines in the stat sheets (S, 🔴)
showStatInfo in js/ui.js draws an inline SVG (about 40 lines, no library) from S.hist.
Dashed marks: 30 for the low warnings, 0 for the hospital.
Distinct from the ending-screen life chart (i9-a29): this is in play, per stat, short window.
Balance: information only; it rewards players who look and react, not idle ones.

### i15-b03 Money over time: cash and net worth on one chart (M, 🔴)
Net-worth branch of showStatInfo in js/ui.js; reads S.hist.
Two lines, two colors plus labels at the line ends so it works without color.
Under 300 px tall on phones; tap a point for the week's numbers.
Balance: no score effect.

### i15-b04 An on-pace mark for the net worth target (S, 🟠)
Straight-line pace from LENGTHS[S.len].target and S.turn in js/features.js (showScoreNow).
Lifetime uses a gentle curve since pay grows over the years.
Balance: shows the bar; does not move it. Careless play still falls short.

### i15-b05 Where the money went: the last 4 weeks by kind (M, 🔴)
Keep the last 4 weeks of S.last.lines in S.spend4; group line labels by a small map in js/turn.js.
Opens from the week strip details sheet (showRunDetails) as 'Last 4 weeks'.
Different from the budget buckets idea (i9-b04): no settings, just a mirror.
Balance: information only.

### i15-b06 Up next: dated things in the next 8 weeks (M, 🔴)
New upNext() in js/features.js reads S.tabsYear, S.svc, lease weeks, S.loanLeft, seasonGoal() and S.date.
One collapsed line on Home ('3 things coming up ›') that opens a sheet, so the screen stays short.
Only shows things the game already decides; random events stay surprises.
Balance: helps you set money aside; no free money.

### i15-b07 A month view for the Journal (M, 🟡)
renderLog in js/ui.js groups S.log by dateLabel's week.
Upcoming weeks show greyed items from the Up next list.
Phone-light: one grid of buttons, no images.
Balance: no effect.

### i15-b08 Compare two jobs side by side (M, 🔴)
renderJobs/jobRow in js/ui.js; uses takeHome, commuteCost, JOBS stress/wear and LAYOFF_RISK.
Words for risk ('steady', 'shaky') instead of raw numbers.
Works with the job you have now as one column by default.
Balance: helps you choose; the 1-application-per-week limit stays.

### i15-b09 Compare two rides on your own commute (S, 🟡)
buyCar area of renderLife in js/ui.js; reuses commuteCost with each car's mpg and ditchMult.
Shows 'with snow tires' when you have them.
Balance: information only.

### i15-b10 Cushion: how many weeks of bills your cash covers (S, 🟠)
Uses last week's bill lines (S.last.lines, minus pay) in js/turn.js; shown in the Net worth sheet and the Up next sheet.
Plain words, no new screen.
Balance: nudges saving, which good play already does; no score change.

### i15-b11 Payback time for classes (S, 🟠)
FOCUS study text in renderHome (js/ui.js) using TUITION, STUDY_NEED and the best job the new level unlocks.
Says 'about' and rounds to months.
Balance: makes study a clearer bet; study already costs weeks of other focuses.

### i15-b12 Progress bars for pinned life goals and challenges (S, 🟠)
Add an optional progress() to badges in js/features.js and to SCENARIOS; draw a bar in the Life tab goal list and the challenge line.
Goals without a count just say 'Not yet'.
Balance: no extra points; the +2 per goal stays as is.

### i15-b13 How many weeks until you can afford it (S, 🟠)
renderLife in js/ui.js; pace from S.hist (average cash change over the last 8 weeks).
If you're losing money it says 'not at this pace'.
Not a savings jar (i1-a05): no setting, just a line on each locked item.
Balance: information only.

### i15-b14 Debt-free dates on every loan (S, 🟠)
S.loanLeft, S.sloanLeft and the mortgage weeks in renderLife (js/ui.js); turns weeks into a date with S.date.
Pairs with the pay-extra idea (i5-a11) if that is built: the date moves when you pay more.
Balance: no effect.

### i15-b15 Retirement check for Lifetime games (M, 🟡)
ssPay and S.k401 in js/state.js; bills from S.last.lines.
Only in Lifetime, where retiring is a real choice (renderJobs retire button).
Balance: helps planners; idle play doesn't touch the 401(k) so it gains nothing.

### i15-b16 Month-end digest in the Journal (S, 🟠)
Built in weekTick (js/turn.js) when curMonth changes; uses S.hist and upNext.
Never stops a skip; shows as a Journal entry with a 📰 kind for the filter.
Different from the quarterly report card (score only) and the year in review.
Balance: no effect.

### i15-b17 A notepad in the Journal (S, 🟠)
S.note (up to 500 characters) in js/state.js; textarea in renderLog (js/ui.js); escaped with esc().
Kept in backups; not shared anywhere.
Balance: none.

### i15-b18 Remind me in a few weeks (S, 🟠)
S.reminders [{week, text}] checked in playWeeks after the week (js/turn.js).
A reminder stops a multi-week skip only if you ticked 'stop here'.
Balance: none; it's a sticky note.

### i15-b19 Old Journal lines fold into month summaries (M, 🟠)
log() in js/state.js: when over 120, merge the oldest month into one summary entry with kind 'month'.
Milestones (job, home, kids, badges) are kept word for word inside the fold.
Fixes what i12-b17 only labels. Year review still reads milestone lines.
Balance: none.

### i15-b20 Star a Journal entry to keep it (S, 🟡)
Add a 'star' flag to log entries; a ⭐ filter in LOG_FILTERS; finish() shows up to 8.
Starred lines never fold away.
Balance: none.

### i15-b21 Search the Journal (S, 🟡)
Simple lowercase includes() over S.log in renderLog (js/ui.js); works with the kind filters.
Announces the count for screen readers, like the filters do.
Balance: none.

### i15-b22 Journal sections by year (S, 🟡)
renderLog groups by the year at the end of e.d; <details> per year, current one open.
Header shows that year's net worth change from the year review data.
Balance: none.

### i15-b23 Copy the Journal as text (S, 🟡)
navigator.clipboard with a fallback textarea, in showMenu (js/ui.js).
Strips HTML; adds the name, start and length at the top.
Balance: none.

### i15-b24 A table behind every chart (S, 🟠)
One shared chartBlock(rows) helper in js/ui.js that outputs the SVG plus a hidden-by-default table.
The SVG gets role='img' and an aria-label that says the start, end and change.
Balance: none.

### i15-b25 Year-to-date totals (M, 🟠)
Running sums by label from S.last.lines into S.ytd, reset at the new year in weekTick (js/turn.js); last year kept in S.ytdPrev.
Opened from the Journal and shown in the year in review.
Balance: none.

### i15-b26 Hours and miles behind the wheel (S, 🟡)
Miles from CITIES and WORKDAYS (js/state.js); 50 mph average for hours; carpool halves the gas, not the hours.
Makes the long Richland drive feel real before you take it.
Balance: information only.

### i15-b27 A job wishlist that says what's missing (S, 🟠)
S.wish (up to 3 job ids); explainLocked in js/ui.js already knows the reasons.
Tapping it opens the job on the board.
Balance: guides long plans; you still have to do the weeks.

### i15-b28 'Last time you picked this' on repeat events (S, 🟡)
Store {eventId: {choice, money, fx}} in S.evMemo in js/events.js when a choice resolves.
Only the last result per choice; random outcomes stay random.
Balance: helps careful players learn; careless play skips reading it.

### i15-b29 Show money per week or per month (S, 🟡)
The wk() helper in js/state.js reads a pref and becomes per-period; all labels use it already.
Default stays per week.
Balance: none.

### i15-b30 Side-hustle seasons at a glance (S, 🟡)
GIGS in js/state.js; FOCUS hustle text in renderHome.
Lets you plan heavy-gig months around school or trips.
Balance: no pay change; gig pay rules stay.

### i15-b31 The Planner: everything on one screen (L, 🟠)
New plannerSheet() in js/ui.js reusing the pieces above; sections fold shut on small phones.
No new rules; just a single place to look before a big choice.
Build last, once the parts exist.
Balance: none.

### i15-b32 Compare two lives from the title screen (M, 🟡)
recordsSheet area of renderTitle in js/ui.js; reads slots() and each slot's S.hist.
Read only; does not load either life.
Balance: none.

### i15-b33 Big moments marked on the charts (M, 🟡)
Mark the week number on milestone log entries (js/state.js log()); the chart helper plots them.
At most 12 dots per chart view so it stays readable on a phone.
Balance: none.
