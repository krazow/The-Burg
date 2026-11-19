# Ideas round 35

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 35: Insurance, taxes and paperwork

The grown-up admin of life, insurance, taxes, records and the licensing office, turned into quick choices that cost a little when ignored and never pay off for idle play.

### i35-a01 Your papers: one card for everything on file (L, 🔴)
One home for all the grown-up admin, built from state the game already keeps (S.tabsYear, S.out.will, job, home, ride).
New S.papers map {id: {on, due}}; ui.js renders the card, turn.js flags items that lapse.
Each later idea in this round adds a row instead of its own screen.
Balance: lapsed items cost small fees or block a choice; idle play lets things lapse, so it can't score higher.

### i35-a02 Register to vote, then the ballot comes by mail (M, 🔴)
Washington votes by mail, so the moment is the envelope on the table, not a polling place.
events.js: a 'Your ballot came' card in late October; S.voter, S.voted. Existing levy, bond and council events check S.voter.
Strictly non-partisan: only local measures and nameless candidates, with neutral pro and con lines.
Balance: voting gives +1 community and a Journal line; not voting costs nothing but the chance to steer the local outcome.

### i35-a03 Itemize or take the standard deduction (S, 🔴)
A plain lesson in one tap, folded into the existing Tax refund event (events.js, 'Tax refund').
Itemized total = mortgage interest share + property tax + logged gifts (food bank, church).
Default highlights the better choice so careless players aren't punished; good play learns why.
Balance: the gap is small ($50–$400 a year).

### i35-a04 Name a beneficiary on your 401(k) (S, 🔴)
One line on the 401(k) card in ui.js (beside the rate buttons); S.benef.
Works with the existing will: the will covers the house and cash, the beneficiary covers the account.
Marriage, divorce or a new baby adds an orange 'update your beneficiary' row on the Papers card.
Balance: only matters at the end and in legacy; costs nothing to do, so careless play just loses 10% of the 401(k).

### i35-a05 Transfer the title within 15 days (S, 🟠)
Real Washington rule, made into a short timer on the Papers card.
features.js / outabout.js: private-sale buys set S.titleDue; Walla Walla gets an 'appt' stop that clears it.
Late fee starts near $50 and caps around $125.
Balance: a small cost for ignoring it; no upside for skipping.

### i35-a06 Shop your car insurance once a year (S, 🟠)
Splits the truck share out of the flat $160 'Insurance & phone' line in turn.js.
Stand-in names only (e.g. 'Wheatland Mutual', 'Blue Mountain Auto').
Bundling home and auto with one company takes 10% off both.
Balance: savings of $5–$15 a week; the cheapest quote raises the cost of the next fender bender.

### i35-a07 Pay the small claim yourself, keep the clean record (S, 🟠)
Adds a third button to existing crash, hail and deer events in events.js.
S.claimFree counts years; turn.js applies the discount to the insurance line.
Shows the math in one line: 'Claim saves $380 now, costs about $300 over 3 years.'
Balance: neither choice dominates; careless filing costs a little over time.

### i35-a08 Term life insurance when the first kid comes (M, 🟠)
events.js baby event adds the offer; S.lifeIns {amount, until}.
finish() and startLegacy read it alongside the will.
Plain note: term is the simple kind; it ends when the kids are grown.
Balance: a weekly cost with payoff only in rare early endings, so it's peace of mind (+1 happy at signup), not a money engine.

### i35-a09 The whole-life pitch at the kitchen table (S, 🟡)
One event in events.js, needs Term life insurance to make sense.
Buying locks in $150 a month; cancelling in the first years returns little.
Asking for the paper is the smart button and gets a Journal line: 'You read the fine print.'
Balance: the trap costs careless players money without ending the game.

### i35-a10 Pet insurance for the dog (S, 🟡)
Adds a toggle to the dog row on the Life tab; dog-care events in events.js check S.petIns.
Older dogs cost more to cover; signing up after a diagnosis won't cover that problem.
Balance: over a dog's life it roughly breaks even; it smooths the big hit.

### i35-a11 The extended warranty at the dealer (S, 🟡)
One extra step in the Ride buy flow (features.js).
S.warranty covers breakdown repair costs until it ends.
Balance: slightly worse than saving the money; good for players who can't absorb a $900 repair.

### i35-a12 Business insurance: a customer slips on the ice (M, 🟠)
Shop setup in features.js adds the coverage choice; one winter event in events.js.
Salting the walk (a free tap that week) cuts the odds by half.
Balance: rare but heavy; owners who skip both insurance and salt take real risk.

### i35-a13 Renter's insurance pays when the upstairs tub overflows (S, 🟡)
Event in events.js that reads the renters flag from the real insurance sheet idea (i3-a19); falls back to 'without' if that hasn't shipped.
Landlord covers the ceiling, not your things, and the card says so.
Balance: shows the value of a $15 policy without adding a new weekly screen.

### i35-a14 Keep the receipts folder (S, 🟠)
S.receipts flag; the Tax refund event and the IRS letter idea read it.
A small 'filed' count grows each month you keep it, shown on the Papers card.
Balance: costs one tap; careless players lose a little refund, never the game.

### i35-a15 A letter from the IRS: you forgot a form (S, 🟠)
events.js, only if a side hustle or gig paid over $600 that year (features.js hustle totals).
Plain words: 'This is common. It's not an audit with a man in a suit.'
Balance: penalty is 10–20% of the missed tax; receipts folder cuts it.

### i35-a16 Owe in April? Set up a payment plan (S, 🟡)
Extends the Tax refund event's owing branch in events.js; a 'Tax plan' line in turn.js bills.
Ignoring it adds an orange row on the Papers card and a bigger bill after 3 months.
Balance: avoids sudden game-ending debt while still costing careless players.

### i35-a17 Washington's working families credit (M, 🟠)
New event in events.js keyed to last year's earned pay (turn.js totals) and kid count.
No credit without earned income, so idle or jobless play can't farm it.
Plain note that many people who qualify never apply.
Balance: helps a struggling working life climb back toward 70; does nothing for high earners.

### i35-a18 The assessor says your house is worth more (S, 🟡)
Needs Property taxes for owners (i3-a20); events.js plus an 'appt' stop in outabout.js.
The notice also nudges your net-worth number up, so it's mixed news.
Balance: small yearly savings for effort; no effect on renters.

### i35-a19 Senior property tax break at 61 (S, 🟡)
Real Washington program, folded into property tax in turn.js; S.seniorExempt.
Income check uses the last year's pay plus Social Security.
Balance: helps late-life owners on fixed income stay in their house; nothing for early play.

### i35-a20 Wedding paperwork week (S, 🟠)
Follows the existing marriage event; each checkbox clears a Papers row.
Skipping the deed or beneficiary is fine until the end, when the grandkid sheet shows the cost.
Balance: costs a little happiness that week; no score from the chores themselves.

### i35-a21 Power of attorney for an aging parent (M, 🟠)
A short chain in events.js for players 40+; links to the existing parent and caregiver ideas.
S.poa unlocks a 'Pay Mom's bills' weekly task that costs an evening.
Balance: doing it right costs stress now and saves money and family friction later.

### i35-a22 Executor of a parent's estate (M, 🟡)
A 3–4 step chain in events.js using the chain helpers already used for story events.
Siblings can help or argue depending on community and past choices.
Gentle tone: one quiet line at the start, then plain chores.
Balance: the inheritance arrives later and a little smaller either way; no stat gain from the paperwork itself.

### i35-a23 Washington paid family leave when the baby comes (M, 🟠)
Real state program. events.js baby event plus a leave flag in turn.js that swaps pay for a benefit line.
Also covers your own serious illness: hospital events can offer it.
Balance: replaces most pay, not all, and pauses raises; it softens a hard stretch without rewarding staying home.

### i35-a24 Unemployment asks for three job contacts a week (S, 🔴)
turn.js unemployment payout checks S.searchLog for the week; ui.js adds the log button.
Matches the real Washington rule in plain words.
Balance: directly answers idle play: you can't sit on unemployment and coast.

### i35-a25 Upgrade to the enhanced license before Canada (S, 🟡)
Trip planner in outabout.js checks S.idDocs before a Canada stop.
Rush passport costs more and needs a Spokane trip.
Balance: a small cost and some planning; careless players lose the trip, not money.

### i35-a26 Dog license at City Hall (S, 🟡)
Papers row and a January bill line in turn.js; the existing dog-runs-off events read S.dogTag.
Small-town touch: the clerk knows your dog's name.
Balance: tiny cost, tiny risk.

### i35-a27 Burn permit for the fall leaf pile (S, 🟡)
One event in events.js for owners; 'Check the burn line' is the free safe button.
Or haul it to the green waste pile for a small fee.
Balance: the careful choice is free; carelessness costs a fine and a little community.

### i35-a28 Pull a permit for the deck (S, 🟠)
Homeowner upgrade buys in features.js add the choice; the sell flow checks S.unpermitted.
Plain words: 'The inspector is a neighbor. He's fair.'
Balance: permits cost a little up front; skipping saves now and risks more later.

### i35-a29 File it in small claims court (M, 🟡)
A 2–3 step chain in events.js, triggered from contractor and storm-roofer events.
Records (receipts folder, a written estimate) raise the win odds.
Balance: recovers part of a loss for effort; no profit from suing.

### i35-a30 A fireproof box for the papers (S, 🟡)
Life tab buy; disaster events in events.js check S.fireBox.
Shows on the Papers card as a small lock icon.
Balance: small cost, payoff only in rare disasters.

### i35-a31 Kitchen-table admin hour (S, 🔴)
New choice on the Rest focus (turn.js); clears S.papers items that can be done from home.
Makes a dozen chores into one satisfying tap.
Balance: trades happiness for avoided fees; good players use it a few times a year, idle players never choose it.

### i35-a32 Sign here: a form card for paperwork choices (M, 🟠)
A shared sheet helper in ui.js used by beneficiary, wedding, title, permit and tax cards.
Quick and satisfying: the stamp lands, a soft sound, done.
Accessibility: checkboxes are real buttons with labels; no swipe required.

### i35-a33 Due soon: a strip of the next three deadlines (S, 🟠)
ui.js Home render reads S.papers due dates.
Hidden until the player has at least two items on file, so new players aren't buried.
Balance: information only; helps good play plan without scoring.

### i35-a34 An 'On top of it' badge (S, 🟡)
Badge list in state.js; checked at year end in turn.js.
Shows how many paperwork fees you avoided that year.
Balance: badges add a little to the score; idle play lets items lapse, so it can't earn it.

## Ideas 35: Playtest of Hard and the challenges

A headless playtest (222 bot games plus probes) of every challenge and of 2- and 5-year Hard games found most challenges are won even by doing nothing, and Hard scores the same as Normal for good play; these ideas fix that.

### i35-b01 Single parent and Debt-free agree on what "out of debt" means (S, 🔴)

Bug: Single parent wins with a financed truck because it only checks cash, while Debt-free also checks the truck and student loans. One shared debtFree() check in features.js fixes it, and both cards say plainly that a mortgage is not counted.
- Single parent says "stay out of debt" but its win() only checks S.money >= 0; Debt-free also checks loanLeft and sloanLeft.
- Add one debtFree() helper next to SCENARIOS and use it in both win() checks and the cards.
- Files: js/features.js (SCENARIOS).
- Balance: makes Single parent slightly harder, never easier.

### i35-b02 Debt-free starts $20,000 down and ends with $15,000 saved (S, 🔴)

Today anyone clears the $8,000 by week 16–26, and doing nothing clears it by week 53 (idle won 8 of 8). Starting $20,000 down and asking for $15,000 in the bank at the end turns it into a real two-year plan.
- Playtest: good players cleared the debt by week 16–20, strugglers by 20–26, idle by 39–53. All 32 games won.
- At -$20,000, good players clear it by week ~47, strugglers by ~60, and idle mostly never does.
- Files: js/features.js (debtfree set() and win(), desc).
- Balance: idle can no longer win it; good play still wins with room to spare.

### i35-b03 Save the family farm becomes a 2-year race (S, 🔴)

Good players buy the farmhouse by week 62–67 and then have 190 weeks with nothing to do, and resting every week still buys it in 7 of 8 games. A 2-year limit keeps the same price, makes it a race, and shuts out idle play.
- Playtest buy weeks: good 62–67, struggling 59–86, idle 114–188 (out of 260).
- With len two, every active player still makes it and every idle game fails.
- Files: js/features.js (SCENARIOS.farm len and desc).
- Balance: fixes the idle win; a struggling player still has a fair shot.

### i35-b04 The balance sim plays every challenge, idle included (M, 🔴)

The sim never plays a challenge, so nobody saw that resting every week wins Debt-free and Save the family farm. Add good, struggling and idle bots for each SCENARIOS entry, print win rates, and fail if idle wins more than 1 in 4.
- tests/sim.test.mjs: a SCENARIO_VARIANTS list built from SCENARIOS, 4 games per bot.
- The report gets a table of win rate, median win week and median score per challenge.
- Catches any future challenge that idle play can win.
- Balance: this is the guard; it changes no rules.

### i35-b05 Hard lowers the resting points, not just the drain (M, 🔴)

Good play scored the same on Hard as on Normal (71 vs 71 over 2 years, 78 vs 77 over 5), because Hard's extra costs land on score parts that are already maxed. On Hard, happiness drifts toward 48 instead of 52, rest tops out in the mid-70s, and community drifts toward 20, so the top of each stat takes work to hold.
- Today the ×1.25 drain only applies to falling stats, and good players sit at wealth 100 and community 100 either way.
- js/turn.js weekTick: mode-based drift targets and the rest cap (86 → 78 on Hard).
- Plays differently: you have to choose which stat to keep high, not just spend more.
- Balance: lowers good, careless and idle play alike; check good stays at 70 or above on Normal (unchanged).

### i35-b06 The sim fails if Hard scores like Normal (S, 🔴)

Add Hard 5-year games to the sim's variants and a check that good play on Hard scores at least 4 points below Normal. Hard can't quietly turn back into Normal with a higher price tag.
- Playtest: Hard good 71/78, Normal good 71/77; careless only 3–4 points lower.
- tests/sim.test.mjs: add five-year hard to VARIANTS plus one t.check.
- Pairs with the resting-points change, which makes the check pass.
- Balance: a guard; no rule changes.

### i35-b07 Hard tilts the event mix toward trouble (S, 🟠)

Hard brings 25% more events, but many of them are good news (a stray dog, a windfall), so more events doesn't mean a harder life. On Hard, events that cost money or health weigh 30% more and windfalls weigh 20% less.
- Playtest: Hard games saw ~100 events in 5 years vs ~77 on Normal, with no change in score.
- js/events.js pickEvent: a mode weight per event, using a simple bad or good tag on each event.
- Plays differently: Hard is about bad luck you can plan for (a cushion, winter tires, the health plan).
- Balance: hurts careless play more than careful play, since careful players have cushions.

### i35-b08 Lean winter weeks on Hard for shaky jobs (M, 🟠)

On Hard, shaky jobs (diner, retail, cellar, ski lift and others) cut hours by 20% in January and February. Players learn to save a cushion in the fall or pick steadier work, a real plan instead of a flat price rise.
- Playtest: no Hard player came near the -$25,000 debt line; the lowest any spender went was -$2,900.
- js/turn.js paycheck line: a "Short hours (winter)" line for LAYOFF_RISK 1 jobs on Hard.
- A Home card in December says it is coming.
- Balance: careless players feel it most; planners who saved don't.

### i35-b09 A Hard hospital stay costs two weeks of pay (S, 🟠)

A workaholic on Hard spent about 150 of 260 weeks with health under 35 and went to the hospital 4 times, yet never went into debt, because a $6,500 bill is small next to the pay. On Hard, a hospital stay also means two weeks without pay unless your job is a steady one.
- js/turn.js health crisis block: on Hard, S.unpaidWeeks = 2 for jobs with LAYOFF_RISK above 0.2.
- The note says how many weeks you will miss.
- Balance: only touches players who run their health to zero.

### i35-b10 Sent home sick: the boss steps in when you're run down (S, 🟠)

After 4 weeks of overtime or side hustles with health under 35, your boss sends you home for a week: the focus is set to Rest, with a plain note. Struggling players get a way out of the grind before the hospital, instead of a tip they keep ignoring.
- Playtest: an overtime-every-week player sat under 35 health for 130–186 weeks before the first hospital stay.
- js/turn.js: a check before the focus effects; reuses S.recentF.
- Works on every mode; on Hard it costs that week's pay too.
- Balance: helps strugglers a little, doesn't help idle (idle already rests).

### i35-b11 A credit check on Hard for bank and office jobs (S, 🟠)

On Hard, when you are more than $5,000 in debt, the bank, insurance and loan-office jobs turn you down at the interview. Debt then shapes your choices, not just your balance.
- js/ui.js apply() and explainLocked(): a Hard-only rule for loan, insure, teller, clerk.
- The job row says "Needs debt under $5,000 (Hard)".
- Plays differently: getting out of debt opens doors, so there is a reason to clear it fast.
- Balance: no effect on players who stay out of debt.

### i35-b12 A summer intensive to catch up on classes (M, 🟠)

Strugglers won From the wheat to the lab only 4 times in 12, finishing their degree in week ~252 with no time left to get hired. A summer intensive (June–August) gives 1.5 weeks of class credit per week for double tuition and more stress, so a player who fell behind can still catch up.
- Playtest: good players reached the bachelor's by week ~146 and were hired the next week; strugglers took until week 250+.
- js/turn.js study block and FOCUS.study: an "intensive" toggle on the Life tab in summer.
- Also useful outside the challenge for anyone studying.
- Balance: costs happiness and money, so careless players don't gain from it.

### i35-b13 The national lab hires in spring and fall (S, 🟡)

Scientist applications open only in March–April and September–October. Finishing your degree in May means waiting, so the lab challenge becomes a plan with dates, not just a grind.
- js/ui.js apply() and job row: "Next hiring: September" when closed.
- Only the scientist job, so the rest of the Jobs tab is unchanged.
- Balance: slows good players by a few weeks at most; idle never gets there anyway.

### i35-b14 A sitter for overtime when you parent alone (S, 🟠)

In Single parent, Work extra hours and Side hustle cost $40 a week for a sitter. The money-or-time pull that makes single parenting hard shows up every week, and today's too-easy wins (11 of 12 for strugglers) get closer.
- Playtest: good players averaged happiness 85 against a bar of 55; strugglers averaged 62.
- js/turn.js: a "Sitter" line when S.scenario is single and the focus is work or hustle.
- Balance: makes careless grinding cost more; good players mix in home weeks anyway.

### i35-b15 Single parent's happiness bar goes to 62 (S, 🟠)

The bar of 55 is far below what good play reaches (85) and near what struggling play reaches (62). Raising it to 62 makes the challenge a coin flip for strugglers and keeps it safe for good play.
- Playtest at 55: good 12/12, struggling 11/12, idle 3/8.
- js/features.js SCENARIOS.single win() and desc.
- Balance: closes the idle path entirely (idle averaged 45–62).

### i35-b16 Debt-free starts with the pickup repossessed (M, 🟠)

Debt-free and Save the family farm play the same today: work, hustle, save. In Debt-free you start without a vehicle, so only Waitsburg and Dayton jobs work until you buy one, and buying one means borrowing more.
- js/features.js debtfree set(): S.car = null, with a "no ride" rule in commuteOneWay and the Jobs tab.
- A neighbor's ride to Dayton for $15 a week is the stopgap.
- Plays differently: the first choice is a ride or a cheaper local job.
- Balance: makes careless play slower; a plan (sedan in month 4) still wins.

### i35-b17 Store-card offers in the Debt-free challenge (S, 🟡)

Two or three times in Debt-free, a store card offers $1,500 of credit for something you want (a TV, a trip, new boots) with a happiness boost now. Saying no keeps you on track; saying yes adds debt at a high rate.
- js/events.js: one event with when: S.scenario === "debtfree", w:2.
- Gives the challenge its own temptations instead of only a number to pay down.
- Balance: careless players pick it at random and fall behind; planners decline.

### i35-b18 The farmhouse price climbs while you save (S, 🟡)

In Save the family farm, the down payment goes up 1% a month while it sits on the market. Waiting costs you, so slow saving and idle play fall behind.
- js/features.js: a farm price in S.farmDown, set at start and raised each month; moveHome reads it.
- The Life tab shows "Price this month".
- Balance: idle bought it at week 114–188 today; this pushes idle out of reach.

### i35-b19 First-year farmhouse bills: well pump and roof (S, 🟡)

After you buy the farmhouse, the first year brings one well-pump bill and one roof patch. The Handy skill cuts both, so the farm feels like a farm after the challenge ends.
- js/events.js: two once-only events when S.home === "farm" and you bought it under a year ago.
- Uses skillLv("handy") for the discount.
- Balance: costs a few thousand dollars, mostly to players without a cushion.

### i35-b20 Worry eats into rest when you're in debt on Hard (S, 🟠)

On Hard, Rest and Get outside give half their happiness while your cash is below zero. Debt weighs on you without changing a single price.
- js/turn.js focus effects: a Hard-only multiplier when S.money < 0.
- The week result says "Money worries took the edge off your rest".
- Plays differently: getting back above $0 matters for the stats, not only the score.
- Balance: no effect on players who stay out of debt.

### i35-b21 Hard's mode card says what it really changes (S, 🟡)

Once Hard has its own rules (lower resting points, lean winters, worry in debt), the mode card on the title screen lists them in plain words. Players pick Hard for how it plays, not for a bigger bill.
- js/state.js MODES.hard.desc and the Help page on modes (js/help.js).
- Balance: text only.

### i35-b22 Keep the café open: a business challenge (M, 🟡)

All four challenges come down to saving money or taking classes. A fifth, "Keep the café open", starts you owning a small Main Street café (stand-in name) that must earn $40,000 over 2 years, testing the business system instead.
- js/features.js: a new SCENARIOS entry using startBiz and S.biz.earned.
- Starts with a little cash and the business already running.
- Balance: earnings need staffing weeks (Work focus) and town standing, so idle play fails.

### i35-b23 Pre-K for the toddler in the Single parent challenge (S, 🟡)

When the kid turns 4, a choice: a free pre-K at the school that asks you to volunteer some weeks, or a paid preschool in Walla Walla. Gives the challenge a story moment and a real trade.
- js/events.js: a once-only event on the kid's 4th birthday, for any parent.
- Free pre-K adds community and costs a few Rest weeks; paid costs money.
- Balance: neither choice wins outright.

### i35-b24 Steady jobs open less often on Hard (S, 🟡)

Layoffs on Hard are 1.6 times as likely, but good players just pick steady jobs and saw 0.1 layoffs a game. On Hard, steady jobs (clerk, CO, RN, professor, scientist) open only every few weeks, so landing one is a goal.
- js/ui.js Jobs tab: an "open" flag per steady job that turns on a few weeks out of every 8 on Hard.
- Balance: careful players still get there; it slows the safe path a little.

### i35-b25 A grinder bot in the balance sim (S, 🟡)

Strugglers who work overtime most weeks scored 37 over 5 years, below random clicking (52–56). Add a "grinder" bot to the sim so changes that help or trap these players show up in the report.
- tests/sim.test.mjs: a strategy that picks overtime or hustle 5 weeks in 7 and rests only under 30.
- Information only, no ceiling.
- Balance: a guard; no rule changes.

### i35-b26 Sick-kid weeks for a parent on their own (S, 🟡)

A few times a year the toddler gets sick: stay home (lose a week of pay, small happiness gain) or call in a favor (costs community). Makes the single parent's week less predictable.
- js/events.js: a work-category event when kids at home and no partner, w:2.
- Balance: costs either way, so random picks don't gain.

### i35-b27 A lighter class load: half credit, half the strain (S, 🟠)

Struggling students in the lab challenge averaged happiness 37 (score part 12) from class weeks. A lighter load gives half a week of credit for half the happiness cost and half the tuition, so a worn-out player can keep going instead of quitting classes.
- js/state.js FOCUS: a "Light classes" choice, or a toggle on Take classes.
- The lab challenge is still winnable on light classes if you start by year 2.
- Balance: slower to the degree, so it doesn't help good players.

### i35-b28 Family help with the farm down payment, earned by standing in town (S, 🟡)

In Save the family farm, if your community is 60 or more when you have half the down payment, your relatives chip in $5,000. The challenge rewards a life in town, not just a savings account.
- js/features.js: a once-only check in scenarioWeek for the farm challenge, with a Journal line.
- Balance: needs real community work, which idle play never builds.
