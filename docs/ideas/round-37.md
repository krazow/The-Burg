# Ideas round 37

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 37: Food and drink of the valley

Ideas about what the Walla Walla Valley grows, cooks and drinks, and how food ties to the seasons, money, health and town life.

### i37-a01 Harvest money: the town spends the wheat check (M, 🔴)
A town-economy multiplier keyed to the month: 1.1 in Aug–Sep, 0.9 in Jan–Feb, 1.0 otherwise.
Applies to hustle pay, small-business income and tips, not to job salary.
Touches turn.js (weekly income), features.js (GIGS, biz).
Balance: averages to about 1.0 over a year, so it rewards planning, not idling.

### i37-a02 A 50-pound sack of sweet onions in June (S, 🔴)
New errand stop in features.js (stops list), shown only in June–July.
Sets a short food discount like stockUntil, smaller than a stock-up.
Cook skill decides the bonus or the waste line.
Balance: small saving, needs a trip, once a year.

### i37-a03 Roadside asparagus in April (S, 🟠)
Seasonal stop (April–May) in outabout.js or features.js stops.
Health +0.5 a week for 3 weeks, cooldown of a year.
Balance: tiny effect, needs you to go out, so idle play never sees it.

### i37-a04 Three weeks on the cherry packing line (M, 🔴)
A June event offer in events.js that sets a 3-week temp gig (like trip weeks).
Pays about a week of diner pay per week; health -1.5 and happy -1 a week.
Blocks the work focus while it runs.
Balance: money now, health later; a careless player who also overworks gets hurt.

### i37-a05 Pan dulce Saturday at the panadería (S, 🟠)
New outabout.js stop in the Walla Walla list with a 4-week cooldown.
Happy +2 for about $8; Saturday trips only.
Balance: a small treat, with a cooldown so it can't be farmed.

### i37-a06 Crew lunch at the taco truck on payday (S, 🟠)
A repeating payday event in events.js for those job ids.
Going: about $12, job standing and coworker friendship up a little. Packing: no cost, no gain.
Balance: small and with a cooldown; it's a choice between money and people.

### i37-a07 Cut and wrap: the meat locker or the garage (M, 🟠)
Follow-up event in events.js after a hunt success (elk draw, deer season).
Locker: about $150, full freezer credit. DIY: free, uses a rest weekend, waste chance falls with skill.
Balance: skill-gated savings; never a big swing.

### i37-a08 Lent Friday fish fry at the parish hall (S, 🟠)
Seasonal event in events.js (Feb–Mar), once a year.
Buy: -$12, happy +2. Work: community +2, health -0.5 (grease and heat).
Balance: small; community needs a choice, not idling.

### i37-a09 The firefighters' pancake breakfast (S, 🟠)
One-time-a-year event in events.js tied to the Celebration Days week.
Flipping gives community +3 and a small friendship with the fire crew.
Balance: one week a year; only rewards the player who shows up.

### i37-a10 The church fall bazaar dinner: join the kitchen crew (M, 🟠)
A chain in events.js (chains state) over 4 weeks, starting from a community-focus week.
Each step: Cook practice +0.5, community +1; finale community +4.
Missing a step: community -1 and the chain ends.
Balance: needs steady choices; careless or idle play won't finish it.

### i37-a11 A jar that didn't seal (S, 🟡)
Short event in events.js, only after the canning feature has run that year.
Toss: nothing. Eat: 90% fine, 10% sick week (health -6, clinic cost).
Balance: teaches a real food-safety lesson; the safe pick costs nothing.

### i37-a12 A windstorm knocks out power and thaws the freezer (S, 🟠)
Event in events.js gated on owning a freezer or being stocked up.
Generator: free if your community is high. Cookout: -$20, community +3, saves half. Do nothing: lose the stock-up discount.
Balance: standing protects you; careless play pays.

### i37-a13 Long commutes, late dinners (M, 🔴)
In turn.js: commute 40+ miles one way and Cook below 2 and not stocked = health -0.3 a week.
Shows as a line in the week strip.
Balance: a real cost to a high-pay commute; good players fix it, careless ones don't.

### i37-a14 Basic Food benefits when money is tight (M, 🔴)
New errand in features.js (county-seat office) that sets S.foodAid; turn.js checks income each month.
Food line -40% while eligible; ends when pay rises.
Work-search rule: no job applications in 12 weeks = it lapses.
Balance: it needs an errand and job applications, so the idle bot never gets it; keep the sim idle median at 50 or less.

### i37-a15 Free summer lunch at the park for kids (S, 🟠)
turn.js: kid cost -15% in June–August while kids are at home; a one-line note in the recap.
Balance: small and automatic only for families, who already carry high kid costs.

### i37-a16 Crawdads in the Touchet (S, 🟡)
Flavor branch of the outdoors focus in turn.js or events.js, summer only.
Happy +2 and kid joy; saves a few dollars on food.
Balance: tiny, rewards the outdoors focus which already wears off with streaks.

### i37-a17 A food worker card for food jobs (S, 🟡)
On hire in features.js/ui.js for food job ids: a one-time -$10 and a checklist line.
Forgetting for 2 weeks: job standing -2, never a firing.
Balance: a tiny real-world cost; teaches, doesn't punish.

### i37-a18 Field lunches for the harvest crew (S, 🟠)
Harvest event in events.js for farmhand or lease players.
Cost about $25; job standing +2, plus Cook practice; Cook 2+ adds community.
Balance: one or two times a season; cost keeps it a choice.

### i37-a19 Food prices jump: a hard year at the grocery (M, 🟠)
Macro event in events.js setting a timed food multiplier read by turn.js; Tattler headline.
At most once every 2 years.
Balance: hits everyone; planners who stock up lose less, which widens the gap good play needs.

### i37-a20 Cider pressing in October over the Oregon line (S, 🟡)
October event or Milton-Freewater stop in outabout.js.
Happy +2, community +1, -$10 for jugs.
Balance: once a year, small.

### i37-a21 A carboy of homemade wine with a neighbor (M, 🟡)
Crush-season offer in events.js; sets a timer in state (like trips).
Result at 9 months: Cook 2+ = gifts (community +3); lower = 50% vinegar (happy -1, a laugh).
Balance: small cost, a long wait, nothing to farm.

### i37-a22 A wine club at a Walla Walla winery (S, 🟡)
A Life-tab subscription in features.js: monthly cost, happy +3 on pickup weeks, halved after 4 pickups.
Balance: a money sink with a fading return; it lowers net worth if kept carelessly.

### i37-a23 Grow a contract field of sweet onions (L, 🟠)
Extends the wheat lease in features.js: a crop choice (wheat, peas, onions) per year.
Onions: big up-front cost, crew bill in June, payout in August; 10% hail risk; stress +.
Harvest weeks need you on the farm (blocks rest).
Balance: high risk and work; careless play that ignores the crew weeks loses money.

### i37-a24 The doctor says ease off the fryer (M, 🟠)
Follows the clinic checkup stop in outabout.js; a 12-week goal in goals state.
Counts weeks with rest or outdoors focus or Cook 2+; at 8 of 12 = health +6 and lower hospital odds for a year.
Balance: needs steady choices; idle play doesn't meet it.

### i37-a25 Cook with the kids on rest weeks (S, 🟡)
In features.js practice(): rest focus with kids at home adds +0.25 cook practice.
Balance: small; rest already has a cap and streak fade.

### i37-a26 Harvest moon supper in the wheat: work it or buy a seat (M, 🟠)
September event in events.js.
Seat: -$150, happy +6. Server: +$120 including tips, happy +1, health -1.
Balance: a clear money-or-joy trade; once a year.

### i37-a27 Pumpkin patch and corn maze in October (S, 🟡)
October stop near Waitsburg in outabout.js; with kids, extra kid joy.
Happy +2 for about $15; once a year.
Balance: small.

### i37-a28 Harvest hours at the grain elevator (S, 🟠)
Job-specific harvest rule in turn.js for job id elevator: +15% pay, stress +0.3, rest focus half effect in July–August.
Balance: more money with a real cost; it shows in the job card.

### i37-a29 Sunday menudo at the taquería (S, 🟡)
Outabout.js Walla Walla stop; if last week had a night out, it removes that health dip.
About $10; 4-week cooldown.
Balance: only undoes a small cost; never a net gain.

### i37-a30 Run a tab at Burg Basket (M, 🟠)
New option in outabout.js on the Burg Basket stop: credit up to about $150, stored in state.
Month end: unpaid = community -4 and the tab closes for a year.
Balance: earned by standing; it helps careful players over a rough week, not careless ones.

### i37-a31 The Tattler's what's-in-season line (S, 🟡)
A month-keyed list of short lines in events.js or ui.js where the Tattler is built.
No stat effects, flavor only.
Balance: none needed.

## Ideas 37: Playtest of every background

I played each of the five starts (Fresh, Farm kid, Grad, Seattle transplant, Young parent) headless for 2 and 5 years with the same careful strategy (6 seeds each), plus careless and idle bots (5 seeds each). Good-play medians, 2 yr / 5 yr: Fresh 76/81, Farm 81/84, Grad 85/87, Transplant 86/84, Parent 71/78. Careless: 57-68 / 68-71. Idle: 26-39 / 28-40. Starts differ for about 3 months; after that happiness and community reach 100 for everyone and only money differs.

### i37-b01 Bug: the young parent's toddler never shows up in 5 years (M, 🔴)
Playtest: 0 kid events in 5-year Young parent games; the kid only appears as a cost line and an "age N" row.
Add toddler events (sick-day pickup, daycare spot opens, potty training rut, library story time, first haircut on Main Street) when a kid is 2 to 5.
js/events.js, kidsAtHome() in js/state.js.
Choices trade money or a work week for happiness and community, so they do not add free score.

### i37-b02 Bug: start hints say "Standard" and "Head start" backwards (S, 🔴)
Playtest medians (good play, 2 yr / 5 yr): Fresh 76/81, Farm 81/84, Grad 85/87, Transplant 86/84, Parent 71/78.
Change hints in BACKGROUNDS (js/state.js): Farm "A little easier", Grad "Strong start, big debt", Transplant "Easy money, slow friends", Parent "Hardest".
No balance change; it just tells the truth.

### i37-b03 Bug: Farm kid is told "Start by finding a job" with a job already (S, 🔴)
js/ui.js newGame(): toast and opening log line.
Farm kid: "Welcome home. The harvest crew starts at six." Others keep the current line.
No balance effect.

### i37-b04 Bug: the Farm kid rents a room on Main Street (M, 🔴)
Add a "folks' place" home in HOMES (js/state.js) with low rent and a small happiness cost after age 21 ("still at home").
The Farm kid starts there; a later event offers moving to town.
Lower rent is balanced by the happiness tug and by the farm drive costing gas.

### i37-b05 Balance: the Grad walks into a $6,500 Hanford job on week 0 (M, 🔴)
Playtest: Grad net worth -$35,760 at start, +$15,045 by week 52.
In apply() (js/ui.js), big-pay jobs set a start date 6 weeks out; you keep looking or take a stopgap job meanwhile.
Pulls Grad down toward the pack without touching careless or idle play much (they rarely land these jobs).

### i37-b06 Balance: newcomer loneliness fixes itself by week 13 (S, 🔴)
Playtest: Transplant community 5 → median 21 at week 13 → 37 at week 26; a careful player ends at 100 anyway.
In weekTick (js/turn.js) the drift target is 25; use a per-background target S.bgRest that the Transplant has at 10 for 52 weeks.
Only effort (community focus, Out and about) beats it, so "lonely" means something.

### i37-b07 Careless play tops 60 in every background's 5-year game (M, 🔴)
Playtest: careless 5-year medians Fresh 71, Farm 71, Grad 68, Transplant 70, Parent 68; 2-year 57 to 68.
Look at the happy mean-reversion in js/turn.js (52 baseline, +0.06 per point) and focus gains; random focus averages out to a balanced week.
Add the background variants to tests/sim.test.mjs at 5 years so the ceiling covers them.

### i37-b08 Grad: the hometown rumor mill (S, 🟠)
One-time Grad event in js/events.js in weeks 1 to 6.
Career day costs a work day but gives community; bragging gives happiness and can backfire.
Small swings; no net free points.

### i37-b09 The family farm pays in more than wages (M, 🟠)
Family farm job (a Farm-kid-only version of farmhand in JOBS): free meals cut food costs, harvest weeks pay a bonus, and Dad notices if you leave.
js/state.js JOBS, harvest event in js/events.js.
Total pay stays below the trades job over a year, so it is a lifestyle pick, not a money pick.

### i37-b10 Leaving the farm is a choice, not a click (S, 🟠)
js/ui.js apply() for S.bg === "farm" and the old job is the family farm.
"After harvest" delays the new start 3 weeks; "just go" costs happiness and a community hit.
Makes the first month feel like a farm kid's life.

### i37-b11 Farm kid: the folks need a hand at harvest (M, 🟠)
Yearly event gated on S.bg === "farm" and month 7 in js/events.js.
Ties into the existing Harvest time event text.
Costs pay either way, so it can't be farmed for score.

### i37-b12 Farm kid: "everybody knows you" lasts (S, 🟠)
Same S.bgRest hook as the Transplant fix in js/turn.js.
A +7 resting point is worth about 2 score points; the Farm kid's $300 start pays for it.
Hint text updated to match.

### i37-b13 Transplant: the Seattle group chat (M, 🟠)
Chain event in js/events.js for S.bg === "transplant", ending at week 52 or when community reaches 50.
Uses the existing Seattle trip and Snoqualmie Pass text where it fits.
Each answer trades something, so "miss the city" finally plays.

### i37-b14 Transplant: the moving bill catches up (S, 🟡)
One-time event in js/events.js, or a line in the first bill in js/turn.js.
Playtest: Transplant leads net worth by about $15,000 at year 1; this trims it.
Idle Transplant 5-year score (40) drops toward the others (about 29).

### i37-b15 Transplant: the newcomer's welcome visit (S, 🟡)
js/events.js plus the regulars system in js/outabout.js.
Gives the Transplant a first step out of loneliness that the player picks.
Small, one time.

### i37-b16 Young parent: a hand from Grandma (M, 🟠)
Playtest: Parent is last in both lengths (71 / 78) on wealth (27 / 55).
kidCost / childcare line in js/turn.js checks S.bg === "parent" and community.
Rewards the town-focused play the start is about; careless play rarely keeps 40.

### i37-b17 Young parent: childcare drops when the kid starts school (S, 🟠)
kidCost() in js/state.js takes the kid's age; the Family card shows the stage.
Same total over 18 years, so Lifetime balance holds; the Parent start feels the toddler squeeze, then relief.
Help text in js/help.js updated.

### i37-b18 Young parent: the other parent (M, 🟡)
js/events.js for S.bg === "parent"; the court path costs a work day and a fee but makes the money steady.
Informal pays sometimes, skips sometimes (dice).
Plain, kind wording; no blame.

### i37-b19 Fresh start: give the classic start a hook (S, 🟡)
One-time week-1 event for S.bg === "fresh" in js/events.js.
Each pick is a small tradeoff that shows the money, truck and fun systems on day one.
No net score change.

### i37-b20 Background check-ins at month 3 and year 1 (S, 🟠)
Uses S.yearStart and the start snapshot; text per background in js/features.js.
Makes the start matter after the first month even when stats have caught up.
Text only.

### i37-b21 One life goal tailored to each start (M, 🟠)
Pinned goals already exist (goalBonus in js/features.js); add one per background.
Goal bonus stays at the current size, so it is a direction, not extra free score.
Goals need effort to reach; idle play misses them.

### i37-b22 End screen: a line that remembers how you started (S, 🟡)
finish() in js/features.js; per-background templates.
Playtest: by the end every start sat at happiness 100 and community 100, so this is the only place the start still shows.
Text only.

### i37-b23 Backgrounds score within 10 points of each other (S, 🟠)
Today the spread is 15 points at 2 years (Parent 71 to Transplant 86).
Report-only warning first, then a failing check once tuned.
Keeps future content from quietly making one start the best.

### i37-b24 Fix "From the wheat to the lab" to start as a Farm kid (S, 🟡)
SCENARIOS.lab in js/features.js: bg:"fresh" → bg:"farm".
Check the challenge is still winnable with $300 in a 5-year game.
Story fix.

### i37-b25 Start sheet: what your first month looks like (S, 🟡)
Static text per background in BACKGROUNDS (js/state.js), shown in #bgdesc in js/ui.js.
Grad: "A Hanford-level job is in reach right away; the loan bill comes every month."
No balance effect.

### i37-b26 Grad: the loan payment can be paused once (S, 🟡)
Student loan block in js/turn.js; offer in a calm card like the debt cards.
Mostly helps careless Grads (median 57) avoid a spiral; costs more over the full loan.
Different from loan plans: a one-time hardship pause.

### i37-b27 Young parent: the toddler shapes the weekly focus (M, 🟠)
focusEffect and weekly notes in js/turn.js check kid age.
Makes the Parent start play differently every week, not just cost more.
The cut only hits heavy work streaks, which careful players avoid anyway.

### i37-b28 Farm kid: the good-health start lasts (S, 🟡)
Health drift target in js/turn.js plus a job flag.
Small, earned by staying in outdoor work.
Health is 20% of score; +3 rest point is about 1 point.

### i37-b29 Transplant: the sedan is a city car (S, 🟡)
breakdown and road events in js/events.js read S.car === "sedan".
Gives the car a personality and trims the Transplant's money lead.
Affects anyone who buys a sedan, not just Transplants.

### i37-b30 Heirs keep a trace of the family's start (M, 🟡)
js/features.js line ~519 passes bg:"fresh"; pick from the parent life's bg, home and edu.
Balance: heir starts already get money from the will; keep the loan-free Grad at lower cash.
Makes a dynasty of starts.
