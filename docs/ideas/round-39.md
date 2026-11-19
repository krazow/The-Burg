# Ideas round 39

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 39: Bundles and release plans 2

A fourth set of build bundles covering rounds 30–38 (none already in a round 19, 25 or 30 bundle), with a bug-fix sweep, a balance sweep, and two release plans that continue v0.3–v0.5 into v0.6 and v0.7.

### i39-a01 Bundle: Bug-fix sweep: backgrounds, challenges and the heir's ride (M, 🔴)
Fix the newest 🔴 bugs: the heir's pickup and every ride's $500 floor are set in today's dollars, Single parent and Debt-free agree on what out of debt means and Debt-free ends with real savings, the young parent's toddler shows up, start hints stop swapping Standard and Head start, and the Farm kid lives at the farm with no 'find a job' nudge.
Covers: i30-b01, i30-b02, i35-b01, i35-b02, i37-b01, i37-b02, i37-b03, i37-b04.
One design: One pass over start-up and money code: ride values go through the same price-index helper as everything else, challenge goals read one debtFree() check, and each background's start (home, job, kids) lives in one table that the hints read from.
Files: state.js (backgrounds, start rides), features.js (challenges, startLegacy), ui.js (start hints), turn.js (car value floor), tests/rules.test.mjs.
Balance: Pure fixes; good play is unchanged and the Debt-free challenge gets harder to finish by accident.

### i39-a02 Bundle: Balance sweep: careless play fixes (M, 🔴)
Apply the round 38 rule changes as one tuned set: hiring cheer once every 26 weeks, quitting early costs a little standing, town goals need 3 more weeks, community and happiness pull back harder at the top, health starts at 55, and Out and about only lifts health under 70 and by at most 1 point per stat a week.
Covers: i38-a01, i38-a03, i38-a06, i38-a08, i38-a09, i38-a10, i38-a11, i38-a12.
One design: Every number goes into the tuning table, so the whole set can be turned on and tried in the sim before shipping; each change gets a one-line rule test.
Files: turn.js (stat pull-back, health start), outabout.js (visit caps), events.js (hiring cheer), features.js (town goals), state.js (tuning), tests/rules.test.mjs.
Balance: Aimed at the careless median: should pull it from the 60s back under 60 while good play stays at 70+, checked by the sim bundle below.

### i39-a03 Bundle: Balance sim: careless bots and hard ceilings (M, 🔴)
Teach the balance sim the ways a careless player actually plays: a job-hopper, an Out-and-about clicker, every challenge and idle Hard, ten 5-year games per start, with ceilings per game length and the score broken into parts so a failure says which part ran high.
Covers: i38-a18, i38-a19, i38-a20, i38-a21, i38-a22, i38-a23, i35-b04, i35-b06.
One design: New bots plug into the existing bot list in tests/sim.test.mjs; one CEILINGS table holds careless, idle and good targets for each length and mode, and the report prints the score parts.
Files: tests/sim.test.mjs, tests/helpers.mjs, features.js (score parts exposed for the report).
Balance: No game change; it is the guard that keeps careless <= 60, idle <= 50 and good >= 70 true for every mode.

### i39-a04 Bundle: Hard mode that's really hard (M, 🟠)
Make Hard change the life, not just the drain: lower resting points, more trouble in the event mix, lean winter weeks for shaky jobs, a hospital stay that costs two weeks of pay, worry that eats rest when in debt, credit checks for bank jobs, fewer steady openings, and a mode card that says all this.
Covers: i35-b05, i35-b07, i35-b08, i35-b09, i35-b20, i35-b11, i35-b24, i35-b21.
One design: One HARD block in the tuning table holds every Hard number; the mode card text is built from that block so it can't drift.
Files: state.js (mode settings), turn.js (resting points, worry), events.js (event weights, hospital), features.js (job openings, credit check), ui.js (mode card).
Balance: The sim must show Hard scoring clearly below Normal for every bot; good play on Hard aims for the mid 60s.

### i39-a05 Bundle: Challenges retuned (M, 🟠)
Give each challenge a real arc: Save the family farm becomes a 2-year race against a climbing price, with first-year bills and family help earned by town standing; Debt-free starts with the pickup gone and store-card offers to resist; Single parent gets a 62 happiness bar and a sitter for overtime.
Covers: i35-b03, i35-b18, i35-b19, i35-b28, i35-b16, i35-b17, i35-b15, i35-b14.
One design: Challenge rules move into one CHALLENGES table (start, goal, deadline, special events), so each one is a row the sim can play.
Files: features.js (challenges), events.js (store cards, farmhouse bills), state.js (challenge starts), tests/sim.test.mjs.
Balance: Each challenge is checked by the sim's challenge bots; careless play should fail most of them.

### i39-a06 Bundle: Late life that feels late (L, 🔴)
One life-stages table sets health caps, happiness set points, gig weight and event pools by age, so 80 stops being your healthiest year, home comforts hold happiness in the 80s, retirees keep a steady pace of events, people skill only slows the fade to 75, gigs ease off after 70 and classes become cheap audits.
Covers: i30-b26, i30-b03, i30-b04, i30-b05, i30-b08, i30-b09, i30-b17, i30-b20.
One design: LIFE_STAGES replaces the scattered age checks; the retiree event slot and net-worth floor at retirement read from it.
Files: state.js (LIFE_STAGES), turn.js (health target and cap, happiness pull), events.js (retiree pool), features.js (score net-worth part, classes).
Balance: Lifetime good play stays near 80 but no longer sits at 95+ for decades; idle Lifetime drops.

### i39-a07 Bundle: Family money, the family home and downsizing (M, 🟠)
Pass things down the way families do: money arrives as a trust in three pieces, the heir can keep the family home instead of cash, money past the cap goes to the town in the parent's name, rides wear with model years, the heir keeps a trace of the family's start, and a downsizer buys the smaller place outright.
Covers: i30-b06, i30-b10, i30-b11, i30-b12, i30-b18, i37-b30.
One design: The legacy sheet in startLegacy gets a choice row (home or cash) and a trust schedule; the downsizing check runs in the home purchase code.
Files: features.js (startLegacy, legacy sheet), state.js (heir start, ride model year), turn.js (trust payments, breakdown odds), ui.js.
Balance: Removes the $1.5M week-one farmhouse for heirs, so the next generation still has a money decade.

### i39-a08 Bundle: Backgrounds that score alike (M, 🔴)
Even out the starts: the Grad can't walk into a $6,500 Hanford job on week 0, newcomer loneliness lasts past week 13, careless play stays under 60 in every 5-year start, backgrounds land within 10 points of each other, and each start gets a hook, a start sheet and check-ins at month 3 and year 1.
Covers: i37-b05, i37-b06, i37-b07, i37-b23, i37-b19, i37-b24, i37-b25, i37-b20.
One design: Backgrounds become rows with their own tuning (starting job gate, loneliness length, hook event); a sim test plays each start.
Files: state.js (backgrounds), features.js (job gates), events.js (check-ins, hooks), ui.js (start sheet), tests/sim.test.mjs.
Balance: Directly targets careless > 60 per start and a 10-point spread between starts.

### i39-a09 Bundle: Farm kid and Grad stories (M, 🟠)
Make two starts feel lived in: the Farm kid's family farm pays in more than wages, needs a hand at harvest, makes leaving a real choice and keeps 'everybody knows you' and good health; the Grad hears the hometown rumor mill, can pause a loan payment once and gets a goal made for the start.
Covers: i37-b09, i37-b10, i37-b11, i37-b12, i37-b28, i37-b08, i37-b26, i37-b21.
One design: Background-tagged events in events.js, plus one tailored life goal per start in the goals table.
Files: events.js (background events), features.js (goals, loan pause), state.js.
Balance: Perks fade unless kept up (harvest help, visits home), so a careless farm kid doesn't coast.

### i39-a10 Bundle: Transplant and Young parent stories (M, 🟠)
The other two starts get their own threads: the Transplant has a Seattle group chat, a moving bill that catches up, a welcome visit and a city sedan; the Young parent gets a hand from Grandma, cheaper childcare once school starts, the other parent in the picture and a toddler who shapes the weekly focus.
Covers: i37-b13, i37-b14, i37-b15, i37-b29, i37-b16, i37-b17, i37-b18, i37-b27.
One design: Same background-tagged events as the bundle above; childcare cost reads the kid's age stage.
Files: events.js, turn.js (childcare cost, focus weights), state.js (start ride), features.js.
Balance: Adds costs as well as help, so neither start gets an easier median.

### i39-a11 Bundle: Open as you go: one unlock table (M, 🔴)
Week 1 shows just four focuses, stats and End Week; everything else opens from one unlock table with a 'New' tag and a two-line unlock card, paced to game length, with an 'I know this one' button, a start setting for 'Everything open', and sim tests with unlocks on and off.
Covers: i31-b01, i31-b02, i31-b15, i31-b16, i31-b19, i31-b20, i31-b22, i31-b33.
One design: UNLOCKS table (system, trigger, card text) checked once a week in turn.js; ui.js hides what's not open.
Files: state.js (UNLOCKS, S.unlocked), turn.js, ui.js (tabs, New tags, unlock card), boot.js (start setting), tests/sim.test.mjs.
Balance: Hiding systems must not change scores; the sim runs both ways and the medians must match within a couple of points.

### i39-a12 Bundle: Unlock moments in play (M, 🟠)
Systems open through small story beats: classes when you tap a locked job, side hustles when a neighbor asks, Out and about with a walk down Main Street, trips when town runs out of something, carpools with a long commute, skills on your first point, the 401(k) with the benefits packet, house buying when a down payment is near, each with a short 'Show me how' tour.
Covers: i31-b17, i31-b03, i31-b04, i31-b05, i31-b06, i31-b07, i31-b08, i31-b12.
One design: Each trigger is a row in the unlock table pointing at an existing event or tap handler; tours are 2–4 highlighted steps.
Files: state.js (UNLOCKS rows), events.js (trigger events), ui.js (tours), help.js.
Balance: Triggers never give money or stats, so they can't be farmed.

### i39-a13 Bundle: Shared places wear down and get cared for (L, 🔴)
Parks, the pool, the library and the fairgrounds get a care level that slips over time: pitch in to keep them up, let one slide and it closes a door, sit on the parks board, adopt a place for life, see then-and-now on each sheet, and storms can take a limb off a park tree.
Covers: i31-a01, i31-a02, i31-a03, i31-a04, i31-a05, i31-a11, i31-a33, i31-a34.
One design: S.places[id].care with weekly drift in turn.js; place sheets in maps.js show care and the pitch-in button; the end screen lists places you kept up.
Files: state.js (S.places), turn.js (drift), maps.js (place sheets), outabout.js (pitch in), events.js (storm, parks board), features.js (end screen).
Balance: Pitching in costs a focus slot or a visit; community gains run through the new pull-back above 60.

### i39-a14 Bundle: Library, pool and gym through the year (M, 🟠)
Public buildings follow the calendar: the Friends book sale and seed library, borrowing textbooks for classes, the library as a cool room in smoke and heat, pool opening and closing days, scrubbing the pool in May, water aerobics, and winter walking in the school gym.
Covers: i31-a06, i31-a07, i31-a08, i31-a09, i31-a12, i31-a13, i31-a14, i31-a21.
One design: Dated visit options in outabout.js keyed to week of year, using the shared places from the bundle above.
Files: outabout.js, events.js (smoke and heat), features.js (textbook discount), maps.js.
Balance: Small stat gains under the 1-point-per-week Out and about cap; textbook savings are modest.

### i39-a15 Bundle: Dayton up close (L, 🔴)
Dayton gets a close-up map like Waitsburg's: the depot and courthouse as two stops, a short-trip rule, the Main Street block, its events on the map, the Columbia County Fair on Labor Day weekend, the hospital-paid nursing assistant course, and what changes if you move there.
Covers: i32-a01, i32-a02, i32-a03, i32-a04, i32-a31, i32-a11, i32-a13, i32-a28.
One design: A second close-up map in maps.js built from the same pin format; the fair and the course are dated events tied to Dayton pins.
Files: maps.js, outabout.js (trips), events.js (fair), features.js (nursing course, moving), state.js.
Balance: The paid course trades weeks of study for a job; trips still cost a focus.

### i39-a16 Bundle: Walla Walla up close (L, 🔴)
A Walla Walla close-up map with a pin for every trip stop and your workplace, a Main Street stroll and Pioneer Park, community college programs that lead to named jobs, the corrections officer job as it really runs, and a 'who's driving home' choice after wine country.
Covers: i32-b01, i32-b02, i32-b03, i32-b04, i32-b05, i32-b10, i32-b15, i32-b20.
One design: Same close-up map format as Dayton; college programs become class tracks that gate specific jobs.
Files: maps.js, outabout.js, features.js (classes, jobs), events.js (driving home), state.js.
Balance: Program jobs pay more only after the study weeks; the drive-home choice has a real cost.

### i39-a17 Bundle: The Tri-Cities up close (L, 🔴)
A Tri-Cities close-up with a pin for every stop and your workplace, one trip that hops the bridges (and a bridge closed for deck work), a Badger Mountain sunrise hike, the downtown Pasco market blocks, hydro race week traffic, and four tens: a long-day schedule with Fridays off.
Covers: i33-a01, i33-a02, i33-a03, i33-a04, i33-a05, i33-a14, i33-a13, i33-a21.
One design: Third close-up map; the bridge hop is one trip with several stops; four tens is a job schedule flag that frees one weekday slot.
Files: maps.js, outabout.js, events.js (bridge, hydro week), features.js (job schedules), turn.js.
Balance: Four tens adds strain on work days so the free Friday isn't pure gain.

### i39-a18 Bundle: Waitsburg street by street (L, 🔴)
Streets become data: every home has a real street address, the Home pin sits where you live, neighborhoods are tappable on the map, you pick the street when you move, street traits touch your week, walking loops are drawn on the map, and street names fill in as you get to know town.
Covers: i33-b01, i33-b02, i33-b03, i33-b04, i33-b05, i33-b06, i33-b16, i33-b27.
One design: S.streets with traits and coordinates; homes reference a street id; the town map draws neighborhoods and loops from it.
Files: state.js (S.streets), maps.js (town map), features.js (moving), turn.js (street traits), outabout.js (walking loops).
Balance: Street traits trade off (quiet vs close to school), no street is best.

### i39-a19 Bundle: A school record for each kid (M, 🔴)
Each kid gets a school record: report cards in January and June, parent-teacher conference night, the nurse calling you to come get your kid, a trouble at school to handle, homework at the kitchen table, the PTO and parent volunteer hours on the Family card.
Covers: i34-a01, i34-a02, i34-a03, i34-a16, i34-a18, i34-a30, i34-a04, i34-a31.
One design: kid.school {grade, standing, notes} updated by homework and attention; dated school events read it.
Files: state.js (kid records), events.js (school events), ui.js (Family card), turn.js.
Balance: Kids do better with your time, which costs focus; ignoring them shows on the record, not a free score.

### i39-a20 Bundle: Teens on the way to graduation (M, 🔴)
The teen years get real steps: a first summer job, driver's ed and the insurance bill, FAFSA night, college applications and fees, local scholarship night and help with the essay, the school counselor's college, trades or farm talk, and a grad open house.
Covers: i34-a20, i34-a21, i34-a22, i34-a23, i34-a24, i34-a25, i34-a28, i34-a27.
One design: Age-gated kid events that read the school record and set the grown kid's path.
Files: events.js, state.js (kid path), features.js (scholarships, fees), turn.js (bills).
Balance: Scholarships reward the time you put in earlier; skipping FAFSA costs money later.

### i39-a21 Bundle: A house hunt that takes weeks (L, 🔴)
Buying becomes a few weeks of steps: three listings each with a hidden catch, an inspection you pay for or waive, an offer under, at or over asking, closing costs on top, a USDA rural loan or first-time buyer help, and keys handed over at the law office.
Covers: i34-b01, i34-b02, i34-b03, i34-b04, i34-b07, i34-b08, i34-b09, i34-b31.
One design: S.hunt holds the active search; each week advances one step with a choice card; loan types are rows in the mortgage code.
Files: features.js (buying, mortgage), state.js (listings, hunt), ui.js (hunt card), events.js (catches), help.js.
Balance: Waiving inspection is a gamble, not a free saving; no-down loans have higher weekly cost.

### i39-a22 Bundle: Moving in a tight market (M, 🔴)
Housing is scarce: listings come and go, a manufactured home on a rented lot is an option, landlords sell and give 60 days, you choose month-to-month or a lease, rent notices arrive, the voucher waitlist is there when money is tight, moving day has three ways, and selling takes time.
Covers: i34-b16, i34-b13, i34-b19, i34-b20, i34-b21, i34-b22, i34-b23, i34-b24.
One design: A small listings pool that refills slowly; rentals get lease terms; moving day is one choice card.
Files: features.js (housing), state.js (listings, lease), events.js (landlord sale, rent notice), turn.js.
Balance: Forced moves cost money and a week, so careless renters lose ground.

### i39-a23 Bundle: Your papers and the admin hour (L, 🔴)
One Papers card holds everything on file: register to vote and get the ballot by mail, itemize or take the standard deduction, name a 401(k) beneficiary, unemployment's three job contacts a week, a kitchen-table admin hour focus, a sign-here form card and a 'due soon' strip of the next three deadlines.
Covers: i35-a01, i35-a02, i35-a03, i35-a04, i35-a24, i35-a31, i35-a32, i35-a33.
One design: S.papers with dated deadlines; one form card component used by all paperwork choices; the strip on Home reads the next three.
Files: state.js (S.papers), ui.js (Papers card, form card, strip), features.js (taxes, 401(k), unemployment), turn.js.
Balance: Missed deadlines cost small fees; the admin hour costs a focus slot, so it's a trade.

### i39-a24 Bundle: Insurance you choose (M, 🟠)
Insurance becomes choices you can get right or wrong: shop car insurance yearly, pay a small claim yourself to keep a clean record, term life when the first kid comes, the whole-life pitch, pet insurance, the dealer's extended warranty, renter's insurance that pays when the tub upstairs overflows, and business insurance.
Covers: i35-a06, i35-a07, i35-a08, i35-a09, i35-a10, i35-a11, i35-a13, i35-a12.
One design: Policies are rows in S.papers with premium and coverage; claims events check them.
Files: state.js, features.js (policies), events.js (claims, pitches), turn.js (premiums).
Balance: Good picks are dull and cheap; bad pitches cost money over years, never pay off for careless play.

### i39-a25 Bundle: Rough patches and making up (M, 🔴)
A rough patch becomes a short story: the money talk, the overtime argument, the chores fight, a chance to cool off or apologize first with a small gesture, couples counseling in Walla Walla, and a help page for when things get hard at home.
Covers: i36-a01, i36-a02, i36-a03, i36-a04, i36-a05, i36-a06, i36-a07, i36-a35.
One design: A small story chain in events.js with a partner mood meter; answers move it a step at a time.
Files: events.js (story chain), state.js (partner mood), features.js (counseling), help.js.
Balance: Patching things up takes focus and money; ignoring it slowly drains happiness.

### i39-a26 Bundle: After a split (L, 🔴)
When it doesn't work out: a trial separation, Washington's 90-day wait, splitting savings, house and truck, a parenting plan, child support on the bills, holidays split year by year, dating again later in life, and an end screen that says a split isn't the end of a good life.
Covers: i36-a08, i36-a09, i36-a10, i36-a12, i36-a14, i36-a15, i36-a17, i36-a34.
One design: Divorce is a multi-week process in features.js; assets split by rule; kids' weeks follow the plan.
Files: features.js (divorce, assets), state.js (custody), turn.js (support), events.js (holidays, dating), features.js (end screen).
Balance: Costly but survivable; the score doesn't punish a split beyond its real money and happiness effects.

### i39-a27 Bundle: Veteran rank and deep cuts (M, 🔴)
Reasons to play the tenth life: a lives-lived rank from Newcomer to Fixture of the Burg, a hard goal for each background, rare combos that open secret events, deep-cut events after 10 lives, device milestones, how close your best life came part by part, a background and mode star grid and a good-life streak on the title screen.
Covers: i36-b01, i36-b02, i36-b03, i36-b07, i36-b11, i36-b12, i36-b18, i36-b28.
One design: A device-level meta record in localStorage separate from the save; events can require a rank.
Files: state.js (meta record), boot.js (title screen), events.js (secret and deep-cut events), features.js (goals), ui.js.
Balance: Rewards are content and badges, not stat boosts, so veterans don't score higher just for playing more.

### i39-a28 Bundle: Harvest food through the year (M, 🔴)
The valley's food calendar: the town spends the wheat check, a 50-pound sack of sweet onions in June, roadside asparagus in April, three weeks on the cherry packing line, field lunches for the harvest crew, harvest hours at the elevator, the harvest moon supper and the Tattler's what's-in-season line.
Covers: i37-a01, i37-a02, i37-a03, i37-a04, i37-a18, i37-a28, i37-a26, i37-a31.
One design: A FOOD_SEASONS table by week of year feeds events, temp jobs and the Tattler line.
Files: state.js (FOOD_SEASONS), events.js, features.js (temp jobs), ui.js (Tattler).
Balance: Temp jobs pay but cost strain; food buys are small savings.

### i39-a29 Bundle: Food when money is tight (M, 🔴)
Make tight weeks show at the table: long commutes mean late dinners, Basic Food benefits when money runs short, free summer lunch for kids at the park, a hard year when food prices jump, a tab at Burg Basket, and the doctor telling you to ease off the fryer.
Covers: i37-a13, i37-a14, i37-a15, i37-a19, i37-a30, i37-a24.
One design: A weekly food cost line that reacts to commute, income and price year; benefits check income like unemployment.
Files: turn.js (food cost), features.js (benefits, tab), events.js (price jump, doctor), state.js.
Balance: Help is for low income only, so it can't be gamed; the tab must be paid down.

### i39-a30 Bundle: Far trips (L, 🔴)
A fourth kind of trip that takes the whole week: save in a trip jar on Home, arrange who watches the house and the dog, check season windows for the big places, see far places on a zoomed-out Northwest map, get homesick on long trips, bring something home for the neighbors, and read a short 'while you were gone' card.
Covers: i38-b01, i38-b02, i38-b03, i38-b04, i38-b06, i38-b19, i38-b17, i38-b18.
One design: Far trips reuse the trip code with a whole-week flag; the trip jar is a savings target on Home; the catch-up card summarizes skipped town events.
Files: outabout.js (trips), maps.js (Northwest map), ui.js (trip jar, catch-up card), turn.js (week away), state.js.
Balance: A week away costs a whole week of focus and community fade, so it can't be spammed.

### i39-a31 Release plan: v0.6 — Fair starts, open as you go (L, 🔴)
Make every way to start a life fair and easy to learn: the new bug-fix and balance sweeps, careless bots in the sim, Hard and the challenges retuned, backgrounds that score alike with their own stories, and systems that open as you go.
Covers: i39-a01, i39-a02, i39-a03, i39-a04, i39-a05, i39-a08, i39-a09, i39-a10, i39-a11, i39-a12.
Order: build the sweeps and sim checks first, then the rest in the listed order; run the balance sim before tagging the release.

### i39-a32 Release plan: v0.7 — Home, paperwork and the wider valley (L, 🔴)
Make the places and the paperwork of a life feel real: streets and shared places, Dayton, Walla Walla and the Tri-Cities up close, a house hunt and a tight rental market, the Papers card, school records and teens, rough patches and life after a split, late life that feels late, and food through the year.
Covers: i39-a13, i39-a15, i39-a16, i39-a17, i39-a18, i39-a19, i39-a20, i39-a21, i39-a22, i39-a23, i39-a25, i39-a26, i39-a06, i39-a28, i39-a29.
Order: build the sweeps and sim checks first, then the rest in the listed order; run the balance sim before tagging the release.

## Ideas 39: Waitsburg event pack 2

Thirty more town events for Waitsburg, in the same format and balance rules as section A of docs/review-and-events-2026-11-18.md (☺ happiness · ♥ health · 🤝 community · money via cost(), in 2027 dollars).

### i39-b01 January: Boil-water notice after a main break (S, 🟡)
- When/who: January, everyone in town.
- Choices: Buy jugs at the store −cost(20) (no stat change) · Boil it and grumble (☺−1) · Hand out jugs at Town Hall (🤝+3, ♥−1).
- Repeat: Yearly. Touches: js/events.js (Town; one-week flag shows on Home while the notice lasts).
- Balance: Free choice is a small loss; helping pays community at a health cost, so idle play gains nothing.

### i39-b02 February: Crab feed at the fairgrounds (S, 🟠)
- When/who: February, adults 21+.
- Choices: Buy a plate −cost(60) (☺+2, 🤝+1) · Work the kitchen, community 30+ (🤝+4, ♥−1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town; community gate on the second choice).
- Balance: About $20 a point, in range; the better choice needs earned community.

### i39-b03 February: Chili cook-off at the Legion hall (S, 🟠)
- When/who: February.
- Choices: Enter a pot −cost(25) (☺+2, 🤝+1; Cook 2+: 30% blue ribbon, ☺+3 and a Journal line) · Just taste −cost(8) (☺+1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town; Cook skill check; Journal entry on a win).
- Balance: A Cook payoff; the ribbon is luck on top of a small, fair base.

### i39-b04 March: A calving night on the neighbor's ranch (S, 🟠)
- When/who: March, community 20+.
- Choices: Pull a calf at 2 a.m. (🤝+3, ☺+2, ♥−2) · Hold the flashlight (🤝+1, ♥−1) · Sleep through it.
- Repeat: Yearly. Touches: js/events.js (Town; community gate).
- Balance: Costs health to earn community and happiness; skip is neutral.

### i39-b05 March: Spring bulky-item pickup day (S, 🟡)
- When/who: March.
- Choices: Haul out your junk (☺+2, ♥−1) · Haul an older neighbor's too (🤝+3, ♥−2) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: Small. Counts toward the spring town goal if one is active.

### i39-b06 April: Free trees on Arbor Day at the park (S, 🟡)
- When/who: April.
- Choices: Plant one in your yard, homeowners (☺+2, ♥−1; the Home scene shows the tree) · Plant one at the park (🤝+2, ♥−1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town; Home scene tree flag).
- Balance: Free but costs a point of health; flavor with a lasting picture, no stacking bonus.

### i39-b07 April: Kids' bike rodeo and helmet giveaway (S, 🟡)
- When/who: April, a kid 5–12 at home.
- Choices: Bring the kids (☺+2, 🤝+1) · Run the cone course (🤝+3, ♥−1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town; kid age check).
- Balance: Parents only; small.

### i39-b08 May: A honeybee swarm in your tree (S, 🟡)
- When/who: May–June.
- Choices: Call the beekeeper to collect it (☺+2; 30%: a jar of honey later, ☺+1) · Spray it −cost(15) (🤝−1) · Wait it out (☺−1).
- Repeat: Yearly. Touches: js/events.js (Town; follow-up line two weeks later on the honey roll).
- Balance: Free best choice is small; spraying costs money and goodwill.

### i39-b09 May: Wasp nest under the eaves (S, 🟡)
- When/who: May–August.
- Choices: Spray it yourself −cost(12) (25% stung: ☺−2, ♥−1) · Call a pro −cost(120) · Leave it (☺−2).
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: A bad-luck event; expected cost of DIY is about $12 plus a point, cheaper than the pro.

### i39-b10 May: A lemonade stand on the corner (S, 🟡)
- When/who: May–August, low weight.
- Choices: Buy a cup −cost(5) (☺+1) · Tip a twenty −cost(20) (🤝+2, ☺+1) · Walk past.
- Repeat: 8 wk. Touches: js/events.js (Town).
- Balance: Tiny amounts; the 8-week cooldown keeps cheap community from adding up.

### i39-b11 June: Skunk under the porch (S, 🟠)
- When/who: June.
- Choices: Live trap −cost(30) (☺−1) · Call the wildlife man −cost(150) · Wait it out (30%: sprayed, ☺−4 and −cost(40) for the smell).
- Repeat: Yearly. Touches: js/events.js (Town; dog owners get the spray roll at 45%).
- Balance: Waiting has the worst expected result; the trap is the smart cheap choice.

### i39-b12 June: Fiftieth anniversary party at the Legion hall (S, 🟡)
- When/who: June.
- Choices: Go with a card −cost(20) (☺+2, 🤝+2) · Set up and pour punch (🤝+3, ♥−1) · Skip (🤝−1).
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: Small; skipping costs a little community, as in W29.

### i39-b13 July: Bats in the attic (S, 🟠)
- When/who: July, homeowners.
- Choices: Hire exclusion −cost(300) (☺+1) · Seal it yourself, Handy 1+ −cost(50) (♥−1; Handy +1 practice) · Leave them (☺−1, ♥+1 from fewer mosquitoes).
- Repeat: Yearly. Touches: js/events.js (Town; Handy skill check; homeowner check).
- Balance: A Handy payoff; leaving them is a fair, funny trade, not a free win.

### i39-b14 July: Odd-even watering days (M, 🟠)
- When/who: July–August.
- Choices: Let the lawn go brown (☺−1, 🤝+1) · Water at night anyway (☺+1; 25%: a neighbor reports you, −cost(100), 🤝−2) · Plant dry-yard natives −cost(250) (☺+1; this event stops for you).
- Repeat: Yearly. Touches: js/events.js (Town; flag to end the event after the native yard).
- Balance: Cheating has an expected cost of about $25 and half a point of community; the native yard buys peace, not points.

### i39-b15 July: A loose horse on Coppei Avenue (S, 🟡)
- When/who: July, low weight.
- Choices: Coax it with a bucket of grain (🤝+2, ☺+2; 10%: a kick, ♥−3) · Call the sheriff (🤝+1) · Close your gate.
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: Comic, small; the risk keeps the best choice honest.

### i39-b16 August: Feed the neighbors' animals for a week (S, 🟠)
- When/who: August, community 20+.
- Choices: Do it (🤝+3, ♥−1; 50%: they bring you a cost(40) gift card) · Say no (🤝−1).
- Repeat: 8 wk. Touches: js/events.js (Town; community gate).
- Balance: Expected value of about +$20 plus community for a point of health; cooldown limits stacking.

### i39-b17 August: A loud party next door (S, 🟡)
- When/who: May–September.
- Choices: Knock and ask nicely (☺+1; 20%: they hold a grudge, 🤝−2) · Join in (☺+3, ♥−2) · Call the sheriff (☺+1, 🤝−3).
- Repeat: 8 wk. Touches: js/events.js (Town; 21+ for joining in).
- Balance: Every choice has a cost; no free stat.

### i39-b18 September: Your dog digs up the neighbor's bulbs (S, 🟡)
- When/who: September–October, dog owners.
- Choices: Replace the bulbs −cost(25) (🤝+1) · Fix the fence gap, Handy 1+ −cost(30) (♥−1; this event stops) · Shrug (🤝−3).
- Repeat: 8 wk. Touches: js/events.js (Town; dog and Handy checks; stop flag).
- Balance: A small dog downside that a Handy fix ends for good.

### i39-b19 September: Kittens under the shed (M, 🟠)
- When/who: September, once.
- Choices: Find them homes on the town page (🤝+2, ☺+1) · Keep one (☺+4, −cost(20) a month; the same small cat pet as W14) · Take them to the Walla Walla shelter with a donation −cost(40) (🤝+1).
- Repeat: Once. Touches: js/events.js (Town; pet cat from W14 (half a dog's effect)).
- Balance: Keeping one is a steady small cost for a steady small boost, like the dog.

### i39-b20 September: The school wants a career-day speaker (S, 🟡)
- When/who: September, a job held 26+ weeks.
- Choices: Talk to the fifth grade (🤝+3, ☺+2) · Send a handout (🤝+1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town; job tenure check).
- Balance: Rewards keeping a job, which idle play doesn't.

### i39-b21 October: Sweep the chimney before the first fire (M, 🟠)
- When/who: October, homes with a woodstove.
- Choices: Pay the sweep −cost(150) · Do it yourself, Handy 1+ −cost(30) (♥−1) · Skip (5%: a chimney fire this winter, −cost(1200), ☺−6).
- Repeat: Yearly. Touches: js/events.js (Town; winter roll flag; Handy check).
- Balance: Skipping saves money but carries about $60 of expected cost plus the happiness risk; careful play wins.

### i39-b22 October: Leaves clog the storm drain (S, 🟡)
- When/who: October–November.
- Choices: Rake it clear (🤝+2, ♥−1) · Call public works (☺−1) · Ignore it (next rain: 30% water in your yard, ☺−3).
- Repeat: Yearly. Touches: js/events.js (Town; next-rain flag).
- Balance: Small; doing the chore is better than ignoring it.

### i39-b23 October: A quarter beef from down the road (M, 🟠)
- When/who: October, money cost(1000)+.
- Choices: Buy a quarter −cost(600) (food bill −cost(18) a week for 30 weeks, ☺+2) · Split it with a neighbor −cost(300) (−cost(9) a week for 30 weeks, 🤝+2) · Pass.
- Repeat: Yearly. Touches: js/events.js (Town; food bill discount in turn.js).
- Balance: Breaks about even on money; the gain is a little happiness or community, and it needs cash on hand.

### i39-b24 October: Check on the quiet neighbor (S, 🔴)
- When/who: October–February.
- Choices: Knock on the door (🤝+3; 30%: they had a fall and you got help in time, 🤝+3 more and ☺+2) · Call city hall (🤝+1) · Mind your own business.
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: A kind, cheap choice with a good luck roll; no money involved, so it can't be farmed.

### i39-b25 November: Turkey raffle at the hardware counter (S, 🟡)
- When/who: November.
- Choices: Buy tickets −cost(10) (🤝+1; 15%: win the turkey, ☺+2 and −cost(40) off this week's food) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: Expected value close to the ticket price; flavor.

### i39-b26 November: Write a column for the Tattler (S, 🟠)
- When/who: November, community 40+.
- Choices: Write a month of columns (🤝+4, ☺+1, ♥−1) · One letter to the editor (🤝+1) · Decline.
- Repeat: Yearly. Touches: js/events.js (Town; community gate; the paper's name is a stand-in).
- Balance: Medium community for a health cost, gated behind earned community.

### i39-b27 December: Live nativity needs a donkey wrangler (S, 🟡)
- When/who: December.
- Choices: Volunteer in the cold (🤝+3, ☺+2, ♥−1) · Bring the family to watch (☺+2) · Skip.
- Repeat: Yearly. Touches: js/events.js (Town).
- Balance: Small; counts toward the winter goal.

### i39-b28 Any: Tree roots heave your sidewalk (S, 🟠)
- When/who: Any, homeowners.
- Choices: Hire a concrete crew −cost(450) · Fix it yourself, Handy 2+ −cost(120) (♥−2; Handy +1 practice) · Ignore it (20%: a neighbor trips, −cost(300), 🤝−3).
- Repeat: Yearly. Touches: js/events.js (Town; Handy check).
- Balance: Ignoring costs about $60 plus community in expectation; Handy fix is the payoff.

### i39-b29 Any: Coyotes in the wheat at night (S, 🟡)
- When/who: Any, a pet or chickens.
- Choices: Bring the animals in at dusk (☺−1) · Motion lights −cost(60) (this event stops) · Ignore it (10%: you lose a chicken or the cat, ☺−5).
- Repeat: Yearly. Touches: js/events.js (Town; pet check; stop flag).
- Balance: Skipping has the worst expected cost; lights are a one-time fix.

### i39-b30 Any: A free piano if you can move it (S, 🟠)
- When/who: Any, once.
- Choices: Move it with friends (☺+3, 🤝+1, ♥−2; music hobby starts with a free instrument) · Decline.
- Repeat: Once. Touches: js/events.js (Town; music hobby flag if one exists).
- Balance: Once only; health cost offsets the gain.
