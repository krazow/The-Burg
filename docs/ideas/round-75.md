# Ideas round 75

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 75: Weather and hard years

Ideas for how floods, smoke, ice, wind, heat and dry years shape work, money, health, mood and neighbors in the valley.

### i75-a01 One weather year that the wheat, wine, smoke and river all read (M, 🔴)
Today wheatYield() rolls its own 15% bad year, S.smoke rolls 25% on its own, and river events roll separately, so a drought harvest can land in a wet, smoke-free year.
Add S.wx in the monthly tick in features.js (where S.smoke is set); wheatYield(), the wine release and the high-water event read it.
A one-line note in July names the year: "A dry year is shaping up."
Balance: same odds as today, only correlated. Run the sim to confirm medians don't move more than a point.

### i75-a02 A million-dollar rain in May (S, 🟠)
Good weather, not just bad: the valley talks about a May rain worth a fortune to farmers.
One-choice news card in events.js (May, S.wx not dry); for wheat leases it raises that year's yield floor from 0.9 to 1.1.
Non-farmers: +1 happy, a line in the journal.
Balance: small, only for players who already paid for the lease, so idle play gains nothing.

### i75-a03 A mild winter: the heat bill comes in low (S, 🟡)
The other side of hard winters, so weather isn't only a cost.
Touches the winter heating line in the money sheet and the snow event weights in events.js.
Balance: saves about one week of food money; no effect on score drivers beyond that.

### i75-a04 Gray January: the valley inversion (M, 🟠)
Real Walla Walla Valley winter weather, and a mood problem with plain fixes.
A weekly state in turn.js (S.gray weeks) set in hard-winter S.wx years; event card in events.js with three choices: walk at noon (time, +health), drive up toward Bluewood (gas), buy a lamp (one-time cost, halves the drain for life).
A "first sun in three weeks" line ends it.
Balance: the drain is small (-1 happy a week, 3–5 weeks); idle players eat it, careful players fix it cheaply.

### i75-a05 A chinook wind melts the snow in a day (S, 🟠)
Ties winter snow to the river so floods have a cause you can see coming.
News card in events.js (Feb, hard winter); sets S.highWater so the existing flood and levee chain in features.js can follow.
Choice: move things up off the basement floor now (an evening, -1 happy) or wait.
Balance: moving things up cuts the later flood cost by half; ignoring it costs what it costs today.

### i75-a06 Smoke years grow more common over the decades (S, 🟡)
One line change where S.smoke is rolled in features.js, keyed to the game year.
Smoke already hits wine futures; more smoke years also wake the smoke-week ideas below.
Balance: affects later generations a little; check the Lifetime sim still lands good play at 70+.

### i75-a07 Outdoor crews get a smoke rule at work (M, 🟠)
Washington has a real wildfire-smoke rule for outdoor workers; this is that, in plain terms.
turn.js: in S.smoke years, July–August weeks, outdoor jobs get wear x0.5 and pay x0.9; a job flag (outdoor:1) in the JOBS table in state.js.
A one-time card: wear the mask and go home early, or push through for full pay (full wear, a small chance of a bad-air sick week).
Balance: pushing through is a gamble with a worse average, so careless play loses health.

### i75-a08 Build a box-fan air filter (S, 🟡)
Quick item in features.js tied to the Handy skill; sets S.airFilter for the year.
With it, the smoke event's health hit at home drops to zero.
Balance: costs money or time up front; small payback only in smoke years.

### i75-a09 Your kid's inhaler in a smoke week (S, 🟠)
Event in events.js gated on kidsAtHome() and S.smoke; reads S.airFilter.
Clinic: money and half a day; inside: -1 happy for you, kid fine; camp anyway: chance of an urgent care bill.
Keep it calm and not scary: a cough, a rescue inhaler, a better week after.
Balance: the careful choice costs a little; the careless one has a worse average.

### i75-a10 The neighbor on home oxygen when the power fails (S, 🔴)
Grounded and serious, not graphic: the neighbor is fine in every branch, but the ones where you help build a real tie.
Fires during the windstorm or ice storm events in events.js; sets a named neighbor in S.neighbors for later callbacks.
Drive: gas and a lost night, +community; cord: needs community 40+; call it in: no cost, small community loss.
Balance: rewards community, not cash, so it doesn't feed careless money play.

### i75-a11 Line crews from three states fill the café (S, 🟡)
Event after an outage in events.js; diner cook and barista get an overtime choice (+pay, -health); others can bring coffee (+community).
A line in the journal: "Trucks from Idaho and Oregon lined Main Street."
Balance: overtime trades health for money as usual; capped at one week.

### i75-a12 Every roofer is booked for months after the windstorm (M, 🟠)
Turns the one-tap windstorm repair in events.js into a short chain (chainSet) with a waiting period.
Waiting: -1 happy a week and a small chance of water damage in rain; rush: about 30% more; DIY: needs Handy, saves half, small injury chance.
Balance: no choice is free; good play picks by skill and cash, careless play pays the rush or the water bill.

### i75-a13 A wind-and-hail deductible on the home policy (M, 🟡)
Adds a row to the insurance sheet in features.js (line ~529); youPay() checks the cause of the damage.
Shows the dollar amount, not just the percent, so the trade is clear.
Balance: over a normal life the two plans come out close; the cheap plan punishes bad luck, which the bad-luck cap below keeps fair.

### i75-a14 Raise the furnace and water heater after the flood (S, 🟠)
Follow-up choice in the flood chain in features.js (after 'Water in the basements'); sets S.floodProof.
Costs about a month's rent; cuts later flood costs by 80%.
Balance: only worth it for owners who stay; renters get a 'tell the landlord' line instead.

### i75-a15 Sell down the herd in a dry year (M, 🔴)
Cattle business in features.js: a dry S.wx raises the feed cost line; one choice card in July.
Selling down lowers cows and income for two years but saves cash; buying keeps the herd at a loss this year.
Balance: each path ends close on average; the point is a real choice that rewards watching the herd card, not idle play.

### i75-a16 An ice storm in calving season (S, 🟡)
Uses the existing calving-season check (B.miss) in features.js; event in events.js gated on cattle and a hard winter.
Night checks: -health, -happy; skipping: +1 miss and a smaller calf check.
Balance: the cost is time and health, not money, so it doesn't help careless cash play.

### i75-a17 Coffee with the farmers in a bad year (S, 🟠)
Grounded mental health in plain words: no drama, just a neighbor who notices.
Event in events.js on a bad S.wx year; the listen choice sets a later callback where that farmer thanks you.
Balance: small community gain; no money.

### i75-a18 Storm debts: the people you helped help you (M, 🔴)
Adds S.helped (a count, up to 5) bumped by the help choices in events.js and the flood chain in features.js.
Home damage events subtract 10% per helper from the repair cost, up to half.
A line names them: "Three neighbors came with shovels."
Balance: rewards active, generous play; careless and idle play never builds it.

### i75-a19 No power, no remote day (S, 🟡)
Remote jobs (remote:2 in JOBS) get one extra choice in the outage events in events.js.
Library: gas and -1 happy; vacation day: uses one; skip: about a day's pay.
Balance: remote jobs are the easy ones; this adds a small cost they can plan for.

### i75-a20 Hail cuts a stripe through the wheat (S, 🟠)
One-time news card in events.js for wheat lease holders; sets S.biz.hail (10–40%) that the harvest math in features.js reads.
Crop insurance covers most of it; no insurance means a smaller check.
Balance: gives the April crop-insurance choice a second reason to matter; same average as today's bad-year roll.

### i75-a21 Clear the neighbor's walk every snow (S, 🟡)
A toggle on the Home tab for winter; snow weeks in turn.js apply -1 health, +1 community.
After a few winters the neighbor leaves a pie on the porch, and later shows up in Storm debts.
Balance: tiny weekly effects, never a big swing either way.

### i75-a22 One storm card in the recap (S, 🟡)
UI only: notes from weather events carry a tag (wx:true) and the recap in ui.js groups them.
Easier to read, and you see what the storm cost in one number.
Balance: none; display only.

### i75-a23 Bad luck has a ceiling: two big weather hits a year (S, 🔴)
Count big weather hits per year in S.wxHits; events.js checks it before firing costly weather events.
Keeps a careful player from losing a whole life to one unlucky stretch, which is what makes the luck feel unfair.
Balance: trims the worst runs only; run the sim to make sure careless medians don't rise (they shouldn't, the cap applies to everyone).

### i75-a24 Low water in August: the Touchet is too low to tube (S, 🟡)
Reads S.wx in the river and summer fun events in events.js and outabout.js; swaps the tubing choice for the pool.
A small flavor of drought that everyone feels, not just farmers.
Balance: removes one cheap happy choice for a few weeks; the pool costs a little more.

### i75-a25 High wind closes Highway 12 to trucks (S, 🟡)
Event in events.js (spring and fall), with a trucker branch (jobId 'trucker') and a commuter branch.
Trucker: lose a day's pay or drive the long way (gas, -health); commuters: slow down (-1 happy) or push it (small fender chance).
Balance: the safe choice costs a little; the push has a worse average.

### i75-a26 Cards by lantern when the power's out (S, 🟡)
One extra choice in the outage events in events.js; needs someone at home (partner, kids or community 30+).
+3 happy, +1 community; the journal keeps it.
Balance: a small positive that rewards having people around, not money.

### i75-a27 De-ice the planes at 5 a.m. (S, 🟡)
Work scene in events.js for jobId 'airport', Dec–Feb; take the overtime (+pay, -health) or regular hours.
Ties to the Wallula fog already in the game.
Balance: standard overtime trade.

### i75-a28 Heat limits in the suit at Hanford (S, 🟡)
Work scene in events.js for jobId 'hanford' in July–August heat years; small pay dip, less wear.
Choice: follow the stay times, or push for the overtime (more wear, a chance of a heat sick day).
Balance: the safe choice is cheaper over time.

### i75-a29 A short pack season in a dry year (S, 🟠)
turn.js reads S.wx for jobs 'foodplant' and 'onion': pay x0.85 for 4–6 weeks in summer; layoff risk in state.js goes up a step.
A side hustle or extra hours elsewhere can fill the gap.
Balance: hits seasonal jobs a little harder, which fits their low stress and low pay.

### i75-a30 What the weather cost you this year (S, 🟡)
Weather events add to S.wxCost and S.wxSaved; the year review in ui.js shows both.
Makes prep feel worth it, since you can see the saving.
Balance: display only.

### i75-a31 Sim check: getting ready for weather pays off (S, 🟠)
tests/ sim helpers: a weather-prep policy on the good bot.
Keeps all the ideas in this group honest: prep must cost something and save more on average.
Balance: guards careless <= 60, idle <= 50, good >= 70.

### i75-a32 The house after the water: six weeks of drying out (L, 🟠)
A chain in features.js after 'Water in the basements' for owners and renters, with three or four short cards over six weeks.
Where you sleep sets cost, happiness and community; helpers from Storm debts shorten it.
Plain and calm: no one gets hurt, it's tired and hard, then it's done.
Balance: the total cost is close to today's flood cost; choices move it ±30% by skill, cash and friends.

### i75-a33 Block captain: your street's storm plan (L, 🟠)
A Life-tab role in features.js with a small list card; storm events in events.js read it and offer a 'run the plan' choice.
Each storm you run the plan: an evening of time, +community, and the oxygen and walk-shoveling events resolve well.
Ties together the neighbor ideas in this group into one role you can grow into.
Balance: costs time every storm; pays in community and Storm debts, never cash.

## Ideas 75: Economy balance check

Read from the merged 0.2.1 money, retirement, jobs and school code and the balance sim: dominant picks, dead options, late-game runaway, poverty traps and numbers that drifted from 2020s Washington figures.

### i75-b01 No full-time job pays under Washington's 2027 minimum wage (S, 🔴)
Seven starting jobs (diner $2,300, lift $2,400, farm hand $2,500, hardware and mall retail $2,600, onion shed $2,700, paraeducator $2,900) pay less than the state's minimum of about $17.60 an hour, which is about $3,050 a month. Raise them to between $3,050 and $3,400, keeping their order, and add a MIN_WAGE constant that a rules test checks every job against.
Touches: state.js JOBS, a new MIN_WAGE_MONTH constant, rules.test.mjs.
Balance: Ship this with b02, b04 and b26 so an idle farm hand clears about $60 a month more than today, not $780 more. The sim's idle limit decides whether it ships.

### i75-b02 Living costs at real 2027 prices: food $700, a room $650 (S, 🔴)
Food and utilities are $520 a month. A rural Washington single adult pays about $400 for groceries, $110 for power, $120 for city water, sewer and trash and $70 for internet. Raise food and utilities to $700, the room to $650 and the rented house to $1,250. Hard mode's extra 10% stays on top.
Touches: billLines in turn.js, HOMES in state.js, GROCERY_SHARE in features.js, the Help text.
Balance: This is the other half of the wage fix: higher pay at the bottom and higher bills keep idle and careless play where they are now.

### i75-b03 Taxes by bracket instead of a flat 15% (M, 🟠)
Washington has no income tax, but federal tax plus Social Security and Medicare runs from about 13% on a $3,000 month to 22% on a $9,000 month. Tax the paycheck 13% up to $3,500 a month, 16% up to $6,000, 20% up to $8,000 and 22% above that (2027 dollars, rising with S.wage). The Jobs list's take-home figure uses the same function.
Touches: weekTick taxes line, takeHome in ui.js, a taxRate() helper, rules test 'taxed 15%'.
Balance: This narrows the lead that the top-paid jobs (scientist, nurse, remote analyst) have over everything else, so a long-game planner's wealth grows a little slower.

### i75-b04 Health insurance costs something before 50 (S, 🟠)
Under 50 there is no health care line, so a 30-year-old on side gigs pays nothing. Charge the usual employee share of $130 a month while working. Anyone without a job, or earning under about $1,900 a month, is on Apple Health for $0, so being poor doesn't get worse.
Touches: billLines (the a0 >= 50 branch), the money outlook, Help.
Balance: This costs every working player about the same, keeps the poverty floor where it is, and pays for part of the minimum-wage raise.

### i75-b05 Unemployment pays 41% of your old pay, like Washington's (S, 🟠)
Benefits are a flat $1,100 a month, which is below the state's lowest weekly benefit (about $1,500 a month). Pay 41% of your last job's monthly pay, held between $1,500 and $4,900 in 2027 dollars, for the same 26 weeks.
Touches: weekTick unemployment line, S.uiPay set in leaveJob('laid') and on seasonal layoffs.
Balance: Benefits only follow a layoff, never a quit, so careless play gains little. It shortens the debt spiral after a layoff without paying anyone to sit at home.

### i75-b06 Nurses, aides and techs paid closer to Washington rates (S, 🟠)
Some health and school jobs are well below what they pay in the valley today: a registered nurse is $7,300 (about $8,600 here), a nursing assistant $3,400 (about $3,800), an imaging tech $5,700 (about $6,400), a paraeducator $2,900 (about $3,300) and an auto mechanic $4,400 (about $4,800). Move them to those figures.
Touches: JOBS pay in state.js; the i3-a05 'no new best job' rules test.
Balance: Even at $8,600 a nurse still clears less than the scientist after gas, so the best job at each school level stays the same.

### i75-b07 Apprenticeships as long as Washington's: plumbers too (S, 🔴)
A 16-week trade certificate leads to plumber ($5,400, 11 miles away, low stress), which then beats every other trade-level job by about $1,400 a month, after only a 2-year apprenticeship at 60% pay. Washington plumbing and electrical apprenticeships take about 8,000 hours, so make plumber 208 weeks like the electrician, and start both at 50% of full pay instead of 60%.
Touches: JOBS apprentice fields in state.js, appMult in features.js, rules tests for apprentice steps.
Balance: This takes away the quickest route to high pay, so the trades become a long plan rather than an obvious first pick. Journeyman pay doesn't change.

### i75-b08 Retail and the food plant need a reason to exist (S, 🟠)
Mall retail in Kennewick ($2,600, 62 miles, the biggest happiness drain at its school level) and the Pasco food plant ($3,000, 58 miles) come out worse than nearly every other no-diploma job after gas. Give retail an always-hiring 95% hire chance plus an employee discount (10% off Tri-Cities trip stops), and pay the food plant $3,600 for the night shift, with harvest-season overtime at +30%.
Touches: JOBS, hireOdds, stopCost in features.js.
Balance: Both stay below the trades. They become a quick, sure job when you're broke, not a trap.

### i75-b09 Office jobs far from home pay enough to make the drive worth it (S, 🟠)
After gas, the bank loan officer (bachelor's, Kennewick) clears about the same as an electrician with a trade certificate, and the lab administrator (associate degree, Richland) clears less than the farm insurance agent who works in town. Raise the loan officer to $6,900 and the lab administrator to $5,400, and add a third remote day to each.
Touches: JOBS pay and remote fields.
Balance: They still clear less than the remote analyst and the scientist, so this adds choices without adding a new best job.

### i75-b10 Public pensions at Washington's 2% a year (S, 🟠)
The game's pension is 1.5% of your best pay for each year worked. Washington's PERS 2 and TRS 2 plans pay 2% of your average final pay per year. At 2%, a teacher or courthouse clerk who works 30 years retires on 60% of their pay, which makes these lower-paid public jobs a real choice for a whole life.
Touches: PENSION_RATE in state.js, the pension rules test, Help.
Balance: This only matters in Lifetime games and only after 5 years, and idle and careless bots rarely hold one public job that long.

### i75-b11 Count the 401(k) at what it's worth after tax (S, 🔴)
Net worth counts every 401(k) dollar in full, but that money is taxed when it comes out. Count it at 88% in netWorth() and the Life Score, and show the 'after tax' figure on the Life tab.
Touches: netWorth in state.js, the stat sheet, rules test 'net worth is cash + …'.
Balance: A 10% contribution with the match is the best wealth tool in the game now. This makes it a little less of a sure thing without changing what happens week to week.

### i75-b12 The employer match vests after 3 years (S, 🟠)
The 3% match is yours the day it's paid. Most Washington employers make you stay about 3 years before the match is fully yours. Track S.k401match separately, and if you leave a job before 3 years, the unvested match is gone (with a line in the Journal).
Touches: weekTick 401(k) block, leaveJob, the 401(k) card in ui.js.
Balance: This rewards staying at a job and costs players who hop between jobs the most. Contributions are always yours.

### i75-b13 Retirement draws rise with age, like the IRS table (S, 🟠)
In retirement the 401(k) grows 6% and pays out 4%, so it keeps growing until death and net worth climbs every year. Draw on the IRS required-distribution schedule instead: about 3.8% at 73, 5.3% at 80 and 8.2% at 90 (4% from 62 to 72).
Touches: weekTick retired branch, the Retire button and 401(k) card text in ui.js.
Balance: This stops wealth from piling up after retirement in Lifetime games. Players who saved still have plenty, and the money gets spent in the years it's meant for.

### i75-b14 Retirees pay tax on the 401(k), not on Social Security (S, 🟡)
Every retiree's dollar is taxed a flat 5%. For most valley retirees Social Security goes untaxed, and 401(k) withdrawals are taxed at about 10%. Split the line: 0% on Social Security and the pension under $3,000 a month, and 10% on 401(k) withdrawals.
Touches: weekTick retired tax line.
Balance: Big savers pay a little more and modest retirees pay a little less, which is closer to real life and slightly reduces the gap at the end.

### i75-b15 The woodshop returns 15–40% a year, not 85–190% (S, 🔴)
A $2,500 shop pays about $2,160 a year with no time spent, and with Handy 3 about $4,750 a year. That beats index funds by about 14 to 1 and is the homebody bot's best move. Make a real garage shop cost $6,000, pay $90 a month base, and only produce in weeks with Rest or Side hustle as the focus.
Touches: BIZ.shop in features.js, the shop rules test (line ~514), the homebody sim bot's money threshold.
Balance: It still pays back in a few years with Handy skill, but it's no longer free money that runs while you do something else.

### i75-b16 Cattle at real cow-calf prices (S, 🟠)
Six pairs cost $8,000 and clear about $4,400 a year (55%). Bred cows sold for nearly $3,000 each in 2025, and foothill pasture rents for about $35 a pair a month. Make the herd $16,000, pasture $220 a month and calves $1,450, and add $90 per cow a year for the vet, minerals and the bull lease. That works out to about 20% a year in an average year.
Touches: BIZ.cattle, CALF_PRICE, PASTURE in features.js, cattle rules tests.
Balance: This is still the best business for someone who gets outside every week, but it takes years of saving to start.

### i75-b17 The food truck beats plain side hustling (S, 🟠)
The truck only runs in Side hustle weeks and pays about $323 a week, against $170–480 for a seasoned side hustle, so the $9,000 often never pays back (round 15 saw $4,100 in four years). Raise the season's base pay to $1,700 a month and add a $1,000 county health permit each April.
Touches: BIZ.truck in features.js, the April bill in bizWeek.
Balance: It earns about $3,600 a year more than hustling in a full season, and only through hustle weeks that cost health, so it doesn't reward doing nothing.

### i75-b18 A sim check: every business has a return ceiling (S, 🔴)
Add a no-browser ledger in rules.test.mjs that runs each BIZ type for 5 years at skill 0 and at skill 3, with the dice averaged, and fails if any yearly return goes over 30% or under 0%. Print a one-line table of return per year beside index funds' 6%.
Touches: rules.test.mjs (it reuses bizWeek and cattleWeek with S.noEvents).
Balance: This catches the next wheat-lease-style jackpot before release. The ledger ignores time spent, so the ceiling is set high on purpose.

### i75-b19 A sim check: no job is beaten on every count (S, 🔴)
A rules test works out each job's take-home after tax and gas, its happiness drain (stress plus drive) and its wear. It fails if another job at the same or a lower school level is better on all three, with seasonal and certificate jobs listed but allowed. Today that flags mall retail, the food plant, the dam operator and the auto mechanic.
Touches: rules.test.mjs, next to the i3-a05 best-job test.
Balance: Each job then needs a reason to pick it. The check fails on the jobs b08 and b09 fix until they're done, so it ships with them.

### i75-b20 A sim check: pay stays near real Washington wages (S, 🟠)
The test file keeps a small table of 2027 Washington pay for each job, taken from state wage figures and rounded. The check fails if a job's base pay drifts more than 25% away, or falls under MIN_WAGE_MONTH. Comments in the table say where each number came from.
Touches: rules.test.mjs, a WA_PAY_2027 table in the test.
Balance: This keeps future job additions honest. It's information only for seasonal jobs.

### i75-b21 A sim check: a broke start can climb out (M, 🔴)
A new 'struggler' bot starts at -$5,000 with the farm hand job and plays sensibly: classes until a certificate, rests when stats are low, no extras. Over 104 weeks at least 70% of its games must get back above $0 without going bankrupt. The same start played idle must not.
Touches: sim.test.mjs (a new strategy plus a pass/fail check), a fresh-at-debt start option.
Balance: This turns 'no poverty trap' into a test, so tougher bills (b02, b04) can't quietly lock out anyone who starts broke.

### i75-b22 Collections stop calling once you're paying it down (S, 🟠)
In collections you lose 0.8 happiness a week, plus 2 a month for any debt, and you also take worse hire odds, one-stop trips and 18% interest. Players who are paying it back sink into a happiness spiral. If cash has gone up 4 weeks in a row, stop the weekly happiness loss and show 'On a payment plan'.
Touches: debtWeek in features.js, the debt card.
Balance: The loss stays for anyone whose debt keeps growing, so ignoring debt still hurts. Only players who are working their way out get relief.

### i75-b23 Classes in debt go on the student loan, not the card (S, 🟠)
Tuition paid while cash is below $0 grows at the 18% card rate. Real tuition goes on a federal loan at about 6.5%. When cash is below $0, add that week's tuition to the student loan (S.sloanLeft and S.sloanPay) instead of to cash.
Touches: weekTick tuition line, the student-loan code that the Grad background uses.
Balance: It's still a debt you repay, so classes aren't free. Getting more schooling, the main way out of low pay, just stops making the debt spiral worse.

### i75-b24 Every start must be winnable: fail the build if a planner goes bust (S, 🟠)
The sim already plays every background for 2 years, but it only reports the results. Fail the build if any background's planner ends in debt in more than 1 of 4 games, or finishes with median net worth under $0. With $800, a toddler and a farm hand job, the young parent has about $170 a month to spare today.
Touches: sim.test.mjs VARIANTS section.
Balance: This is the safety net for b02 and b04, which raise bills for everyone. If the young parent fails, ship those with a childcare or tax-credit offset.

### i75-b25 Raises top out at 30% above inflation, not 60% (S, 🟠)
Raise events can stack up to 1.6× pay above inflation, and the ladder adds another 1.25×, so a diner cook can end up at about $5,400 in 2027 dollars. Real pay beyond inflation grows about 1% a year over a career. Lower RAISE_CAP to 1.3 and leave the ladder rungs as the main way up.
Touches: RAISE_CAP and the 'A raise' event's 1.5 check in events.js.
Balance: This slows the late-game runaway for anyone who stays in one job, and makes promotions and changing jobs the better plan.

### i75-b26 Insurance at real Washington prices: car $130, home $100 (S, 🟠)
Full-coverage car insurance is $70 a month here (about $150 in Washington) and homeowners is $15 (about $100). At $15, the fixer-upper ($950 mortgage) is cheaper every month than the $1,150 rented house and also builds equity, so renting the house is never worth it. Use full coverage $130, liability $55, homeowners $95 (fixer) and $140 (farm).
Touches: INS_AUTO, INS_HOME in features.js, insParts per home, the insurance rules test.
Balance: Renting and owning become a real choice on monthly cost, and owning still wins over time through equity.

### i75-b27 Overtime pays time and a half (S, 🟡)
'Work extra hours' adds 20% pay, but Washington overtime pays 1.5× for hours over 40. Ten extra hours is about +37%. Pay +35%, and make overtime wear on you a little faster (happiness -2.5, health -2).
Touches: FOCUS.work in state.js.
Balance: Overtime pays more and hurts more. Careless bots pick it about 1 week in 7, so the sim limit should hold, but check the grinder results.

### i75-b28 Kids cost $950, and state childcare help keeps it fair (S, 🟡)
A kid is $650 a month. In 2027 dollars, raising one costs about $1,100. Raise it to $950. Under about 60% of the state median income, Working Connections childcare caps the commute childcare charge at $115 a month instead of $200.
Touches: KID_COST, kidCost in state.js, the Have a baby button text.
Balance: Families who are doing well pay more, and low-income parents (the Young parent start) pay about the same, so the parent background doesn't get harder.

### i75-b29 Tuition at real Washington rates, cheaper on low pay (S, 🟠)
A trade program costs $300 a month and a university $650. Walla Walla's community college is about $520 a month and the university campus in the Tri-Cities is about $1,100. Use those, but under $4,000 a month in pay the Washington College Grant pays 100% of tuition, falling to 0% by $6,500.
Touches: TUITION in state.js, weekTick tuition line, the Take classes text.
Balance: Moving up from low pay stays cheap, but a nurse going back for a bachelor's pays the real price. Both are closer to Washington, and neither makes idle play pay more.

### i75-b30 Sim report: where the planner's wealth came from (M, 🟠)
For every bot, sum each money line by source over the game (pay, overtime, side hustle, business, 401(k) growth, market, home equity) and print shares in the balance report. Warn if one source other than pay is over 40% of the median planner's final net worth.
Touches: sim.test.mjs (tag S.last.lines by kind into a per-game total).
Balance: This finds the next dominant strategy from the numbers instead of from a playtest.

### i75-b31 Sim report: real net worth at 65 and at the end (S, 🟡)
Lifetime games print the bots' median net worth in 2027 dollars at 65 and at death. Warn if it grows more than 50% after retirement.
Touches: sim.test.mjs life games (snapshot at the birthday).
Balance: This is how to check that b13 and the retiree tax change keep retirees from getting rich just by living a long time.
