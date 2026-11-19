# Ideas round 53

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 53: Money as story

Ideas that treat money as feeling and story, not math: first buys, lean weeks, giving, lending and being the one with money in a small town.

### i53-a01 The thing you've wanted since you were a kid (M, 🔴)
At the start you name one want (a drift boat, a good guitar, a cast-iron set). The week you can pay for it with a month of bills still in the bank, a short scene plays, and it shows up later in events and the year review.
- Pick from a short list on the new-game sheet, or skip it.
- A 'Buy it' card appears on Home only when cash covers the price plus four weeks of bills.
- Touches state.js (S.want), ui.js (new-game sheet, Home card), events.js (a few events check S.wantBought).
- Balance: one-time happiness bump; careless players who buy early on credit get no scene, so it can't be farmed.

### i53-a02 Money milestones get a moment, once each (M, 🔴)
First $1,000 saved, first month of bills in the bank, net worth above zero for the first time, last loan paid off. Each gets one small beat on the week strip and a line in the Journal.
- A MONEY_MILESTONES table in features.js, checked at the end of each turn in turn.js.
- Each fires once (S.msDone) and logs to S.log with a 🎉 kind.
- Balance: flavor plus a tiny happiness bump (+2); idle play rarely reaches them, careless play loses them to debt.

### i53-a03 Burn the payoff letter: a debt-free day (S, 🟠)
When the last loan hits zero, pick how to mark it: a bonfire of the paperwork at the river, steak dinner in Walla Walla, or just a quiet beer on the porch.
- One event in events.js with when: loans just reached 0 (S.loanLeft, S.sloanLeft, S.mortgage).
- Each choice costs a little and gives a little: happiness, community or nothing but a log line.
- Balance: once per life; happens only after real payoff.

### i53-a04 A $20 gift from a lean week counts like $200 (M, 🔴)
Giving is weighed against what you have. A small gift when cash is thin earns as much town standing as a big gift from a fat account, so generosity is a story about means, not size.
- One helper giftWeight(amount) in features.js: standing scales with amount divided by weeks of bills in the bank.
- Used by food bank, passing the hat, porch gifts and other giving events in events.js.
- Balance: capped per month so rich players can't buy standing, and broke players can't go into debt to give (choice hidden below $0).

### i53-a05 Passing the hat at the tavern after a house fire (S, 🟠)
A family on Preston Ave loses their kitchen to a fire. A coffee can goes around the bar. Give $5, $20, $100, or bring a casserole instead.
- Town event in events.js using giftWeight().
- The family thanks you by name in a later Journal line; the casserole costs a Home week's grocery bump instead of cash.
- Balance: standing gain capped; a 'nothing to give tonight' choice costs nothing and loses nothing.

### i53-a06 An IOU drawer on Home (M, 🟠)
Every time you lend money in an event, it lands in a small IOU list with a name and amount. Some pay back late, some in kind (a cord of wood), some never. You can forgive one for peace of mind.
- S.ious array in state.js; written by lending events in events.js.
- Each week a small chance a debtor pays back (cash or a favor); forgiving one gives happiness and ends the reminder.
- ui.js: a collapsible 'Owed to you' row on Home. Not counted in net worth.
- Balance: lending never beats saving on average; it's for the story.

### i53-a07 Pay Grandma back, with a pie on top (S, 🟠)
If family helped you early (a down payment, Young parent's hand from Grandma), years later you can pay it back. She may refuse the check; you can sneak it into her purse or take her to lunch instead.
- Event in events.js gated on a S.familyHelp flag set by existing help events.
- Three endings: she takes it, she refuses and you fix her porch, or you let it go.
- Balance: costs money, pays happiness and family standing only.

### i53-a08 Cosign for a cousin's truck (M, 🟠)
A cousin asks you to cosign. Say yes and their payments become your risk for three years: most months nothing happens, but a missed payment can land on you.
- Event in events.js sets S.cosign {left, pay, name}; turn.js rolls a small monthly miss chance.
- A miss sends a calm card: pay it, or let it hurt your credit (shows up on bank loan odds).
- Balance: no upside in dollars; yes gives family warmth, no gives a cooler Thanksgiving.

### i53-a09 Thanksgiving after the windfall (M, 🟠)
The first Thanksgiving after an inheritance, a big sale or a lucky week, the table is different. Pick up everyone's bill, start a small family fund, or say nothing and let it pass.
- Holiday event in events.js gated on a windfall flag (big one-time cash in the last year).
- Each choice shifts how often family ask events fire for the next year.
- Balance: no choice is free; 'say nothing' keeps cash but trims happiness slightly.

### i53-a10 The teller knows your balance (S, 🟡)
Banking in town means the teller is your neighbor. Move your account to a credit union in Walla Walla for privacy, or stay local and get the friendly heads-up when you overdraft.
- Event in events.js plus S.bankLocal flag.
- Local: a one-time 'she covered your overdraft till Monday' save. Away: a small gas cost to visit, no gossip events about money.
- Balance: trade-off only; neither side scores higher.

### i53-a11 Casseroles after the repo man (S, 🟠)
After a repossession, layoff or forced move, neighbors show up with food. Take it with thanks, or turn it away out of pride.
- Event in events.js gated on a recent hard hit (repo, layoff, eviction flags).
- Accepting: grocery bill skips a week, small community gain. Refusing: happiness dip, no help.
- Balance: only after a hit, so careless players get comfort but not a profit.

### i53-a12 From the food bank line to the donation table (S, 🔴)
If you once used the food bank or Basic Food, and you're now steady (a month of bills saved), a Thursday comes when they ask if you'll help on the other side of the table.
- Event in events.js gated on S.usedFoodHelp and cash cushion.
- Volunteer a week (community) or bring a box (cash via giftWeight).
- Balance: strong happiness line, once per life; needs a real climb out.

### i53-a13 Kid asks why we can't afford it (S, 🔴)
Your kid wants the same bike as their friend. Tell them the honest truth, buy it anyway, or promise 'when the harvest check comes', which becomes a small goal on Home.
- Kids event in events.js; the promise sets a mini savings target with a deadline.
- Keep the promise: kid happiness and a Journal line. Break it: it comes up again.
- Balance: buying on credit adds debt and gives less happiness than keeping a promise.

### i53-a14 The thin Christmas the kids remember (S, 🟠)
A lean December: homemade gifts, a tree cut on a permit, popcorn strings. Ten years later the grown kid says it was their favorite.
- December event in events.js when cash < two weeks of bills and kids at home.
- Sets a flag; a later 'grown kid' event reads it and pays happiness.
- Balance: the payoff is delayed and small; no money gain.

### i53-a15 Take your folks to dinner on your dime (S, 🟠)
The first time you can afford it, you take your parents to a nice dinner in Walla Walla and pay before they see the check.
- Event in events.js, once, when cash covers a month of bills and parents are alive.
- Costs about $120; happiness plus a Journal line your parents mention later.
- Balance: one-time, needs a cushion.

### i53-a16 A new truck on Main Street gets talked about (S, 🟡)
Drive a brand-new pickup home and the coffee crowd notices. A used one keeps you 'one of us'. A shiny one brings a joke or two and a few more favor asks.
- Hook in the car purchase code (features.js / ui.js Life tab) sets S.showyWeeks.
- For eight weeks, small weight bump on ask events and a teasing line on Main Street.
- Balance: social flavor; no standing loss, just more asks.

### i53-a17 Keep the old truck running: a mileage pride badge (S, 🟡)
Keep the same ride past 15 years or 250,000 miles and you earn a badge and a line at the Grange: 'that thing will outlive us all'.
- New badge in features.js badges; uses car age or a mileage counter in turn.js.
- Repairs still come; the pride is the reward.
- Balance: badge only, no score.

### i53-a18 Hand-me-downs between Waitsburg families (S, 🟡)
A box of outgrown kid clothes arrives on the porch. Take it (save on kid costs for a month), pass your own along later (community), or both.
- Kids event pair in events.js; a S.handMeDown flag links them.
- Balance: small savings; passing it on is the bigger gain, so the story pays generosity.

### i53-a19 The splurge you don't regret (M, 🟠)
Once a year you get one 'treat yourself' tap: concert tickets, a steak, a weekend at the coast. It feels great once a year; use it more and it fades.
- A Home button in ui.js; S.lastSplurge stores the week.
- Happiness scales down the closer splurges are (uses the same fade rule as focus streaks in turn.js).
- Balance: a planned splurge from savings is worth more than an impulse one on credit.

### i53-a20 Buyer's remorse when the cushion is gone (S, 🟠)
Buy something big that leaves you under two weeks of bills and the next week's strip says so: 'You keep looking at the bank app.' A small happiness dip for two weeks.
- Check in the buy flows (ui.js Life tab) sets S.remorse; turn.js applies it.
- The want-list item never triggers it if bought with a cushion.
- Balance: gently pushes careless play down, which helps keep careless median under 60.

### i53-a21 Lean-week lines on the week strip (S, 🔴)
When cash covers less than one week of bills, the week strip tells it plainly: 'Rice and eggs again.' 'Gas in five-dollar pieces.' 'Wednesday: $14 till Friday.'
- A LEAN_LINES table in features.js, picked by season and kids/no kids; shown in turn.js summary.
- No numbers change; it's tone.
- Balance: zero effect on score; makes the money state felt without a new meter.

### i53-a22 Payday Friday (S, 🟡)
The week a paycheck lands after a lean stretch, the strip says so too: gas tank filled all the way, a real grocery run, the kids get a treat.
- Pairs with lean-week lines: fires when the previous week was lean and this week isn't.
- Distinct from the first-paycheck beat; this is for every recovery.
- Balance: tone only.

### i53-a23 $20 in last winter's coat (S, 🟡)
In a lean week, you find a twenty in a coat pocket. Small joy, tiny money.
- Town event in events.js, only when cash < one week of bills, long cooldown.
- Balance: $20 and +2 happiness; too small to matter to the score.

### i53-a24 The waitress remembers how you tip (M, 🟡)
Eat out often at the café and your tipping becomes a reputation. Good tippers get the corner booth and the gossip first; stingy ones get coffee refills a little slower.
- A tip pick on eat-out stops in outabout.js (10, 18, 25 percent); S.tipRep stores an average.
- Good rep unlocks one or two café-only rumor events.
- Balance: small community gain capped; tipping costs real money.

### i53-a25 The candle party pitch (S, 🟡)
A friend invites you to a home sales party and wants you to sign up as a seller for $300. Buy one candle, sign up, or say a kind no.
- Event in events.js; signing up starts a 6-week side gig that mostly loses money but sometimes breaks even.
- Balance: the honest no costs a little friendship; the gig averages a loss.

### i53-a26 Envy: the classmate's lake house (S, 🟠)
A high school classmate posts photos from their new lake house on Coeur d'Alene. Stew on it, call them up, or put the phone down and go fishing.
- Town event in events.js, more likely when your net worth is below the game's target.
- Stewing costs happiness; calling them can reveal they're deep in debt; fishing gives health.
- Balance: shows that comparison costs you; no money change.

### i53-a27 A hidden purchase comes out (S, 🟠)
Your partner finds the receipt for the thing you bought and didn't mention. Come clean, make a joke, or get defensive.
- Partner event in events.js gated on a buy over $500 in the last month (S.lastBigBuy).
- Choices move partner happiness and set a 'talk before big buys' flag that softens the next one.
- Balance: only fires after spending, so frugal play never sees it.

### i53-a28 Run a tab at the market (M, 🟠)
In a lean week the owner of the corner market lets you run a tab till payday. Pay it on time and trust grows; let it ride and she stops offering.
- S.tab in state.js; offered by an event when cash is under a week of bills.
- Paid on time: small community gain and the tab is offered again. Late: the offer goes away for a year.
- Balance: no interest, but capped at $100 and only once a month, so it can't fund careless play.

### i53-a29 What do you give at a Waitsburg wedding? (S, 🟡)
A coworker's wedding at the fairgrounds. Cash in a card, something off the registry, or a handmade gift.
- Event in events.js using giftWeight() so a handmade gift on a thin budget still lands well.
- Balance: costs time or money; standing scaled to means.

### i53-a30 Your money year as a short story (M, 🟠)
The year review adds three plain lines: how many lean weeks, the biggest thing you gave, and the money moment that mattered most.
- ui.js year review reads counters kept in turn.js (S.leanWeeks, S.biggestGift, last milestone).
- Words, not charts: 'Eleven lean weeks. You gave $60 to the fire family. You paid off the truck in May.'
- Balance: display only.

### i53-a31 The one with money in a small town (L, 🟠)
Once your net worth is well above the town's, a slow storyline starts over a year: the booster club asks you first, an old friend gets a little distant, a neighbor asks for a job. Each step is a choice about who you want to be.
- A short chain in events.js using the existing S.chains system, gated on net worth well above target.
- Four steps over 52 weeks; choices set a tone flag (generous, private, showy) that changes later lines.
- Balance: costs money or warmth at each step; rich play gains texture, not score.

### i53-a32 Paycheck-to-paycheck weeks as a story chain (L, 🟠)
Four lean weeks in a row become a small story: week one is fine, week two you skip the tavern, week three the gas light comes on, week four a friend notices. Getting out writes its own ending.
- A chain in events.js tracked by S.leanStreak in turn.js; each step is a light event with one or two choices.
- Ending depends on how you got out (overtime, help, a side job, cutting back).
- Balance: no extra penalty beyond the cash itself; adds support choices so careful recovery is rewarded.

## Ideas 53: Decade by decade

What would make each decade of a Lifetime game in The Burg feel like its own chapter: worries, milestones, events, how the town sees you, and what the score should value.

### i53-b01 [20s] Still "the Hendricks kid" until you earn your own name (S, 🟠)
Events and the Tattler call you by your parents' surname ("the Hendricks kid") until you prove yourself.
Ten community-focus weeks, or any town role, flips a flag `S.ownName`; the town notes it in the Journal.
Touches: `adj()` community multiplier in state.js, name lines in events.js.
Balance: a small early handicap that good play clears in months; idle play never clears it.

### i53-b02 [20s] Quitting is cheap in your 20s (S, 🟠)
Job-hopping in your 20s is normal; employers shrug.
Track `S.shortStints`; only stints after 30 count against hiring odds (−5% each, cap −15%).
Touches: hiring odds and the Jobs tab in features.js/ui.js.
Balance: rewards early exploring, not endless quitting; late careless hopping costs more.

### i53-b03 [20s] Every summer, someone's getting married (S, 🟡)
A seasonal event in June–August while you're 22–32, with a bigger version for a close friend.
Choices: go, go and help set up (a weekend gone), or mail a card.
Touches: events.js (age-gated seasonal event), cost().
Balance: costs real money at a tight age; the card choice is never zero-cost to community.

### i53-b04 [20s] Big swings while you're young (S, 🟡)
The 20s feel loud: highs higher, lows lower.
One multiplier in `adj()` by age band; health recovery bonus stays modest.
Touches: state.js `adj()`, turn.js health drift.
Balance: symmetric, so it averages out; careless choices lose more, which pushes careless medians down.

### i53-b05 [20s] Decade grade: did you build a base? (M, 🔴)
First use of a shared `DECADES` table: each decade lists 3–4 things it values and how to grade them 0–100.
20s values: education or trade progress, an emergency fund, skills learned, community above 40.
Touches: new table in features.js, the 30th-birthday note in turn.js, the end screen.
Balance: every item needs action; idle play gets near zero on all of them.

### i53-b06 [30s] The squeeze: job, kids and house want the same week (M, 🔴)
The 30s are the time crunch.
When all three are true, Rest gives 70% and a weekly coverage event asks who stays home for the sick kid or the school play.
Touches: turn.js focus effects, events.js, Family card in ui.js.
Balance: pushes planning (childcare, partner hours), not grinding; careless play takes more hits.

### i53-b07 [30s] A big job offer that means leaving the valley (M, 🟠)
The classic small-town fork.
Options: leave (ending screen 'Left for Boise at 34'), try it two years and come back with a pay bump but community halved, or stay.
Touches: events.js one-time event, finish() in features.js.
Balance: staying is scored fairly; leaving ends with your current score, so it isn't a free win.

### i53-b08 [30s] Friends' marriages start coming apart (S, 🟡)
An age-gated (30–45) event with a short follow-up two months later.
Helping costs a weekend and a little money and gives community; spare room costs happiness for a month.
Touches: events.js chained event.
Balance: no money reward; it's about community and happiness trade-offs.

### i53-b09 [30s] The town starts asking you to run things (S, 🟠)
One leadership ask per year after 30 if community is above 50.
Yes: a month of evenings (happiness −, community ++), with a Journal milestone.
Touches: events.js, Journal milestones.
Balance: time cost is real; only active players see the ask.

### i53-b10 [30s] Decade grade: did you put down roots? (S, 🔴)
Second row of the `DECADES` table.
Grades: housing stability, job tenure, close ties, debt-to-pay ratio.
Touches: features.js DECADES, the 40th-birthday note.
Balance: steady play scores well; it doesn't need riches.

### i53-b11 [40s] Peak-pay years and the nudge to save (S, 🟠)
The 40s are when money is easiest to set aside.
A Home card line from 40–50 with the projected retirement gap and a quick setting.
Touches: Home card in ui.js, the 401(k) setting.
Balance: just information plus a lever; careless players who ignore it miss the gain.

### i53-b12 [40s] Start over at 45: one real career change (M, 🟡)
The 'do I want this for 20 more years?' choice.
Unlocks an event 'Is this it?' leading to a one-year program; tuition as usual.
Touches: study in state.js/turn.js, JOBS edu checks, events.js.
Balance: pay drops at first; only pays off over 10+ years of good play.

### i53-b13 [40s] The body sends its first bill (M, 🔴)
Cumulative wear from JOBS `wear` is tracked from 18 and comes due in the 40s.
Choices: therapy (money and weeks), lighter duty (−10% pay), or tough it out (health drift up for years).
Touches: turn.js wear tracking, events.js.
Balance: careless 'tough it out' costs health score; good players plan for it.

### i53-b14 [40s] A teenager in the house (M, 🟠)
The 40s often mean teens at home.
An event category `teen` drawn while any kid is 13–17, with 8–10 short events.
Touches: events.js categories, kid ages in state.js.
Balance: events are mostly happiness and small money; no single right answer.

### i53-b15 [40s] Decade grade: did you keep your balance? (S, 🔴)
Third row of the `DECADES` table.
Grades: average health, happiness low-months count, overtime weeks share, community or family weeks.
Touches: features.js DECADES, monthly stat history.
Balance: punishes overwork and neglect alike; idle play fails the health and community lines.

### i53-b16 [50s] Harder to get hired after 55 (S, 🟠)
Real life: late-career job hunts are tough.
−15% hiring odds at 55+, removed by a reference, a matching skill or a community above 70.
Touches: hiring code in features.js, the Jobs tab note.
Balance: rewards long ties; no effect for players who stay employed.

### i53-b17 [50s] 401(k) catch-up contributions at 50 (S, 🟡)
A once-only 50th-birthday letter and a 'catch-up' toggle.
Raises the cap on the 401(k) rate by a set amount.
Touches: retirement savings code, the 50th birthday in turn.js.
Balance: money moves from cash to savings, not created; helps planners only.

### i53-b18 [50s] Five-year countdown to the day you stop (M, 🟠)
Turns retirement into a plan, not a button.
A countdown card on Home and a pinned goal with a small goal bonus.
Touches: Home card in ui.js, goals in features.js.
Balance: the goal needs savings and a paid-off house, which careless play rarely has.

### i53-b19 [50s] Your parents' house: the last clear-out (M, 🟡)
A 50s-only chain after an aging-parent ending.
Weeks of evenings, some money from a sale, and a Journal memory line.
Touches: events.js chain, aging-parent state.
Balance: small money; mostly happiness and community choices.

### i53-b20 [50s] Decade grade: are you ready? (S, 🔴)
Fourth row of the `DECADES` table.
Grades use the same 'Will I have enough?' math as Home.
Touches: features.js DECADES.
Balance: wealth matters most here, so careless coasting can't make up for it later.

### i53-b21 [60s] Phased retirement: three days a week at the old job (S, 🟠)
A soft landing between full-time and done.
An offer event at 60–67 if you've been there 5+ years; sets a part-time flag on the job.
Touches: JOBS pay calc in turn.js, events.js.
Balance: less pay than full-time; only open to long-tenured players.

### i53-b22 [60s] The first time you're the oldest one at the jam (S, 🟡)
The 60s are when the town's view of you flips.
A one-time scene at 60 plus a +10% community gain from Out and about visits through the 60s.
Touches: outabout.js, events.js.
Balance: small, and only if you go out; idle play gets nothing.

### i53-b23 [60s] Travel while your knees still work (M, 🟡)
Short list on Home in the 60s.
Each trip: one week, a cost, happiness up, a badge for all three.
Touches: trips in features.js, Home card.
Balance: costs real money; no score gain beyond happiness.

### i53-b24 [60s] Grandkids on Sundays (S, 🟡)
The 60s often mean grandkids nearby.
A toggle on the Family card; small cost and happiness each week.
Touches: Family card ui.js, monthly bills in turn.js.
Balance: diminishing happiness after many weeks, like other repeats.

### i53-b25 [60s] Decade grade: did you find a purpose? (S, 🔴)
Fifth row of the `DECADES` table.
Grades: roles held, hobby weeks, health, community or family weeks.
Touches: features.js DECADES.
Balance: money no longer counts here, so a rich but idle retiree scores low.

### i53-b26 [70s] Grand marshal of the Days parade (S, 🟠)
The town's highest honor for an old-timer.
One-time event in August, age 70+.
Touches: events.js, badges.
Balance: only reachable by long, active play.

### i53-b27 [70s] Your class gets smaller (M, 🟠)
The 70s are when friends go.
A yearly-ish event from 70 with named classmates from the class list.
Touches: events.js, classmate names (i17 follow list), Tattler.
Balance: costs happiness; calling friends softens it and keeps community up.

### i53-b28 [70s] Fifty years in town: the Legion's pin (S, 🟡)
A quiet honor for staying.
Tracks years in Waitsburg; moving away resets.
Touches: state.js counter, events.js, badges.
Balance: small, and only for long lives in town.

### i53-b29 [70s] Everything takes a little longer (S, 🟡)
The 70s change the weekly math.
Per-focus health cost +0.2 and Rest +0.2 from 70.
Touches: turn.js focus effects (fits a life-stage table).
Balance: shifts the best mix, doesn't punish; idle Rest still won't help community.

### i53-b30 [70s] Decade grade: did you stay connected? (S, 🔴)
Sixth row of the `DECADES` table.
Grades: Out and about visits, standing commitments, community, health.
Touches: features.js DECADES.
Balance: idle play fails all lines.

### i53-b31 [80s] Stay home or move to the care place in Walla Walla (M, 🔴)
The decade's big question.
Three options with clear monthly costs and effects; the house can be sold.
Touches: HOMES in state.js, events.js, monthly bills.
Balance: no free option; each trades money, happiness or community.

### i53-b32 [80s] The porch-light check (S, 🟠)
What a lifetime of being a good neighbor buys.
From 80, community above 60 lowers health-event harm and adds a small weekly happiness.
Touches: turn.js health events, events.js.
Balance: earned only by decades of community play.

### i53-b33 [80s] Oldest Waitsburger (S, 🟡)
A rare honor for very long lives.
A one-time event; title shows on the ending screen.
Touches: events.js, finish() in features.js.
Balance: health-driven, no money or score bonus beyond a goal line.

### i53-b34 [80s] Decade grade: are you at peace? (M, 🔴)
Last row of the `DECADES` table, and where it pays off.
Final Life Score blends the end snapshot with the decade grades for Lifetime games.
Touches: lifeScore() and finish() in features.js, the end screen shows one row per decade.
Balance: rich-but-careless lives lose on 4 of 7 decades; sim check that careless stays <= 60 and idle <= 50.
