# Ideas round 1

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 1: Gameplay depth

New systems and decisions that give money, time, health, happiness and community more ways to push on each other, from quick wins to a few big ones.

### i1-a01 Work standing at your job (M, 🔴)
- Per-job meter: S.jobStand, reset on a job change (half carries over when you move up with the same employer).
- Work focus +2/wk, J-events adjust it, J1 review and J2 promotion read it; LAYOFF_RISK is scaled by (1.3 − stand/100).
- Touches state.js (migrate, LAYOFF_RISK), turn.js (weekTick), events.js (J1, J2, J7, J11), ui.js (Jobs card).
- Balance: careless and idle players sit near 40 standing, so they get smaller raises and more layoffs; only active play climbs.

### i1-a02 Community standing perks (M, 🔴)
- Three tiers shown on the Community stat sheet, each a short list of perks.
- Discount on Out and about visits and shop-local; a once-a-year 'neighbors pitch in' that halves one bad-luck event bill; +10% application odds at 80.
- Touches outabout.js (actCost), events.js (bill-type events), ui.js (applications, stat sheet), help.js.
- Balance: community fades without effort, so idle play never keeps a tier; perks are capped at one save a year.

### i1-a03 Home upgrades for owners (M, 🔴)
- A '🔨 Improve your home' list on the Life tab when you own: insulation cuts winter bills, a new roof stops storm-damage events, a garage shop boosts the woodworking business, beds unlock the garden.
- Handy skill cuts the cost 15% a level (DIY takes 2–4 weeks of Rest-or-Hustle time); hiring Sharp Point Builders is faster.
- Touches state.js (HOMES, migrate: S.upgrades), ui.js (Life tab), features.js (BIZ shop, skills), events.js (storm events).
- Balance: about 60% of the cost comes back in equity, so it's a choice, not free net worth; careless players don't buy them.

### i1-a04 Council seat that votes (M, 🟠)
- Quarterly council-meeting event while S.council; 3 choices with clear trade-offs (popular vs. sound).
- Some votes change a town flag for a year (water rates up → bills +$8/mo; pool open → summer outdoors weeks do more).
- Re-election every 4 years reads your vote record and community.
- Touches events.js (new council events, re-election), state.js (S.town flags), turn.js. Balance: council needs community 60+, out of reach for idle play.

### i1-a05 Savings account and savings goals (S, 🔴)
- Life tab or the bank sheet: move money in or out, set a goal amount and weekly amount.
- Earns about 3% a year (less than prices rise in bad years); reaching a goal gives a small happiness boost and a Journal line.
- Touches outabout.js (bankSheet), turn.js (weekTick transfer and interest), state.js (S.savings, S.saveGoal), features.js (netWorth).
- Balance: interest is small; the real gain is avoiding 1.5% debt interest, which rewards planners only.

### i1-a06 Credit score (M, 🟠)
- Range 500–800, shown on the bank sheet and the Life tab; starts by background (grad 650, fresh 600).
- Months with money < 0 cost points; paid-off loans and steady jobs add points.
- Touches state.js (CARS.truck pay, HOMES down), ui.js (buy flows), outabout.js (bankSheet), turn.js.
- Balance: careless debt now costs more later, which pulls careless scores down, never up.

### i1-a07 Refinance your debt at the bank (S, 🟠)
- Offer on the bank sheet when money < 0 and you have a job; 2–3 year term, about half the overdraft interest.
- Locks in a weekly payment like the student loan; miss-proof but it squeezes later weeks.
- Touches outabout.js (bankSheet), turn.js (loan line like sloan), state.js (migrate).
- Balance: only helps players who act on it; no cash handout, so it can't lift idle play.

### i1-a08 Take a roommate (S, 🟠)
- Toggle on the Life tab; ends automatically when you get a partner or kids, or by event.
- Roommate events: late rent, a great friend, a messy kitchen, they move out.
- Touches state.js (S.roommate), turn.js (rent line, happiness), events.js (roommate events), ui.js.
- Balance: saves money but costs happiness, so it's a real trade; capped at one roommate.

### i1-a09 A garden plot (M, 🟠)
- Homeowners use the yard; renters can rent a community-garden plot for a small fee.
- Weeks tended through summer set the harvest size (food −10% to −25% for 10 weeks).
- Ties into W24 (late frost) and the garden center's starts (stronger with a garden).
- Touches state.js (S.garden), turn.js (food line), outabout.js (garden center), events.js. Balance: needs steady tending, so idle play gets nothing.

### i1-a10 Hunting and fishing licenses (S, 🟡)
- License about $60 a year, bought on the Life tab or at the farm-supply counter.
- A good outdoors week in season gives a chance of 'freezer full' (food −15% for 6 weeks).
- Touches outabout.js (farm supply act), turn.js (food line), state.js.
- Balance: small savings, needs a choice of focus in the right months; no effect on idle play.

### i1-a11 Winter heating bills (S, 🟡)
- Food & utilities line gets a seasonal multiplier (+25% winter); firewood bought in October halves the winter bump.
- Shown in the week strip and the Help guide's money section.
- Touches turn.js (foodV), state.js, outabout.js (farm supply sells firewood), help.js.
- Balance: same cost for all bots; good play plans around it, so it widens the gap between planners and careless play.

### i1-a12 Tax refund season (S, 🟡)
- A spring event sized from last year's pay and credits; three choices with different payoffs.
- Owners who forgot to file get a late penalty event (rare).
- Touches events.js (new yearly event), turn.js (track last year's pay), state.js.
- Balance: a splurge gives happiness now, savings gives interest; auto-play picks savings so idle play gains nothing extra.

### i1-a13 Take a real vacation (M, 🟠)
- Plan it on the Life tab 4+ weeks out; the vacation week replaces your focus and any trip.
- Hourly jobs lose a week of pay; office and care jobs use paid days off.
- Touches features.js (like trips), turn.js (focus override), ui.js, events.js (vacation mishaps).
- Balance: once a year, with a 40-week cooldown; the boost fades over a month, so it can't carry an idle life.

### i1-a14 Partner closeness (M, 🟠)
- Low closeness makes 'A rough patch' likelier; high closeness unlocks moving in, marriage and a bigger partner paycheck.
- Shown on the Life tab with a short hint about what helps.
- Touches state.js (S.partner becomes an object, migrate), turn.js, events.js (rough patch, starting a family), outabout.js (date acts).
- Balance: needs regular attention, so neglectful play loses the partner's happiness bonus.

### i1-a15 Kids grow up: stages and choices (L, 🟠)
- Stage events tied to each kid's age; costs shift by stage instead of a flat $650.
- Choices change happiness, community (school sports) and legacy money for the heir.
- Touches state.js (kids array of objects, kidCost), events.js (stage events), features.js (legacy heir inherits choices).
- Balance: total cost stays near today's average; good choices give happiness, not money, so careless play doesn't gain.

### i1-a16 Aging parents (M, 🟠)
- A story chain in features.js (chainSet) over 1–3 years with check-in events.
- Moving them in can bring a small monthly contribution and childcare help; paying for care drains savings.
- Touches features.js (STORY_EVENTS), turn.js (weekly cost lines), events.js.
- Balance: Lifetime and 5-year games only; all paths cost something, so no path lifts careless scores.

### i1-a17 Your dog grows old (S, 🟡)
- S.dog becomes an adoption turn; vet line rises after 8 years; a gentle goodbye event at 11–15 years.
- Outdoors weeks with a dog give a little extra health.
- Touches state.js (migrate dog to {since}), turn.js (vet line), events.js (stray event, goodbye).
- Balance: small numbers; mostly flavor and a real cost of keeping a pet.

### i1-a18 Become a landlord (L, 🟠)
- Second-property purchase on the Life tab (down payment, mortgage); rent income line; tenant events.
- Handy skill cuts repair bills; selling realizes the equity.
- Touches state.js (HOMES-like RENTALS, S.rental), turn.js (income and mortgage lines), ui.js, events.js, features.js (netWorth).
- Balance: about a 4–6% yearly return after bad years, and a big down payment, so it rewards saving first.

### i1-a19 Grow your business (M, 🟠)
- Two upgrade levels per business on the business card; higher levels pay more and lose more in bad seasons.
- Food truck level 2 can hire help so it pays on non-hustle weeks at half rate.
- Touches features.js (BIZ, bizWeek, bizCard, bizValue), story chains for the truck.
- Balance: upgrades depreciate like the business (R13); bad-year odds rise with size.

### i1-a20 Good years and bad years in the valley (M, 🟠)
- Rolled every January (seeded dice); shown on Home and in the year in review.
- Tough years: layoffs ×1.5, gigs −20%, homes cheaper to buy. Good years: bigger raises, hiring easier.
- Touches state.js (S.econ), turn.js (raises, gigs), events.js (layoff), outabout.js (Tattler lines), ui.js.
- Balance: averages out over 5 years; good players buy in tough years, careless players get hit by layoffs.

### i1-a21 Volunteer fire department (M, 🟠)
- Training: 6 weeks of Show up for town; then on-call events about once a month, more in wheat-fire season.
- Answering a call costs a little health and the week's focus; skipping too many drops you from the roster.
- Touches events.js (call events), state.js (S.fire), turn.js, ui.js (Life tab), W13 smoke event ties in.
- Balance: community gains are capped by the community fade; idle players never pass training.

### i1-a22 Healthy habits (M, 🟠)
- Habit list on the Life tab; a habit sticks after 8 weeks; stressful weeks (overtime, a long trip) can break a new one.
- Walk to work needs a Waitsburg job; cook at home grows the Cook skill.
- Touches state.js (S.habits), turn.js (drift), features.js (skills), ui.js.
- Balance: small, steady effects (+0.3 health a week); idle play never picks one.

### i1-a23 Old injuries that linger (M, 🟡)
- Chance rises with job wear and low health; shown as a condition on the Health sheet.
- PT appointments (a trip stop) clear it over 6 weeks; ignoring it makes Work extra hours hurt more.
- Touches turn.js (dH), features.js (STOPS appt), events.js (J6 hurt on the job), ui.js.
- Balance: hits grinders who overwork, which pushes against the overtime grinder (B8).

### i1-a24 Choose when to retire (M, 🟠)
- Retire button shows the monthly check at each age; waiting to 67 gives about +30%, to 70 about +75%.
- Part-time option: a quarter of your old pay, less stress, keeps community.
- Touches state.js (ssPay), ui.js (retire flow), turn.js (retired branch).
- Balance: later retirement trades happiness now for money later; the Life Score weighs both.

### i1-a25 Lead a big town project (M, 🟠)
- One project at a time; progress from community weeks and donations; stalls and setbacks by event.
- Perks last for the rest of the life: the pool makes summer outdoors weeks stronger, the mural lifts community fade.
- Touches state.js (seasonWeek pattern, S.project), features.js (badge 'Built it'), events.js, ui.js (Home card).
- Balance: needs 20+ focused weeks; perks are small and capped, so idle play never finishes one.

### i1-a26 Chores pile up (S, 🟡)
- A small chore meter on Home; rises 1 per busy week, Rest clears it.
- Kids and a dog make it rise faster; a roommate or partner slows it.
- Touches turn.js (weekTick), state.js (S.chores), ui.js (Home chip).
- Balance: gives Rest a reason in a work-heavy rotation; the max cost is small, and idle (all Rest) play gains nothing.

### i1-a27 Employer pays for school (S, 🟡)
- A tuition-help tag on those jobs; tuition line halves; leaving within 52 weeks of graduating bills the help back.
- Touches state.js (JOBS flag), turn.js (tuition line), ui.js (Jobs card note).
- Balance: modest savings with a stay-or-pay trade; no effect on idle play.

### i1-a28 Truck miles add up (S, 🟡)
- Miles from commute, errands and trips; shown on the Life tab with the vehicle.
- Breakdown odds × (1 + miles/150,000); careMult still applies.
- Touches turn.js (miles already computed), features.js (careMult), state.js (S.odo), events.js (breakdown).
- Balance: makes the commute trade-off honest without new penalties for in-town play.

### i1-a29 Grandkids (S, 🟡)
- Chance once a grown kid is 25–35; up to 3 grandkids; a visit event every few months.
- Touches state.js (S.grandkids), events.js, turn.js (kidJoy-like drift).
- Balance: small happiness, small costs; late-life only, so it doesn't change short games.

### i1-a30 Decade check-ins (M, 🟡)
- One choice sheet at each milestone birthday; the decade goal is worth +1 Life Score if met.
- Career: raises +10%; Roots: home happiness +; Give back: community fade slower; Easy: rest does more.
- Touches turn.js (birthday notes), features.js (goal bonus), ui.js.
- Balance: each boost has a matching small cost; only counts if you meet its goal.

### i1-a31 A stall at the summer market (M, 🟡)
- Unlocks with a garden, the woodworking shop or Cook level 2; appears as a gig choice June–September.
- Pay depends on stock (garden harvest, shop output) and skill.
- Touches state.js (GIGS, currentGig), features.js (BIZ shop, skills), turn.js.
- Balance: pays about the same as other gigs; the gain is variety and community, not extra money.

### i1-a32 A second, lighter focus (M, 🟡)
- A toggle under the focus picker; second focus gives 40% of its effects and counts toward streaks at half.
- Not allowed with Take classes; costs −1 happiness and −1 health a week.
- Touches turn.js (focus effects), state.js (FOCUS), ui.js (Home picker), sim bots.
- Balance: tiredness makes it a net loss if overused; the sim must keep good play ≥70 and careless ≤60.

## Ideas 1: Town and people

Ideas that make Waitsburg feel like a town full of people you know, with roles to hold, family that changes over time, and a home to look after.

### i1-b01 Named neighbors on your street (L, 🔴)

Five built-in neighbors with stand-in names (a retired wheat farmer, a widow next door, a young couple, a teacher, a mechanic) who keep showing up in events, each with a friendship level you raise by helping them.

- Adds a small fixed cast in a new NEIGHBORS table (js/state.js) and S.nbrs = {id: level 0-5}.
- Existing events like the stray, the windstorm and food drives pick a neighbor and name them; new short events ("Dale needs his truck jumped") raise or lower one level.
- Each level-4+ neighbor gives a small perk (a ride, a tip about a job, a borrowed trailer). Shows on the Family card.
- The v2 player-submitted NPC engine (#42) can slot in beside this cast later.
- Balance: levels only rise from event choices and Show up for town weeks, and fade 1 level a year if ignored, so idle play gets nothing.

### i1-b02 Community roles you hold over time (L, 🔴)

Sign up for standing roles (Booster Club, library board, food bank crew, youth coach) that each ask for one Show up for town week in four and give a steady perk while you keep it.

- New ROLES table and S.roles in js/features.js; a "Roles" card on Home with sign-up and quit buttons.
- Each role has a duty rate, a perk (community fades slower, a hiring bonus, cheaper kid costs) and one or two role events a year.
- Missing duty for 8 weeks warns you; 12 weeks drops the role with a community hit.
- Council becomes one role in this system (see i1-b11).
- Balance: max two roles; perks are small and only paid while duties are met, so careless play loses them.

### i1-b03 Join the volunteer fire department (M, 🔴)

Train for six community weeks to join the volunteer fire crew, then answer pager calls: August grass fires, chimney fires in winter, wrecks on Highway 12.

- A role in the i1-b02 system with S.fire = {trained, calls}. Training progress shows like a town goal.
- Pager events (js/events.js, cat "fire") interrupt a week: go (community +4, health -1, may cost a work day) or pass.
- After 10 calls you earn a badge and a small yearly stipend.
- Balance: calls cost health and pay, so it is a trade, not free points; never available to idle play since training takes focus weeks.

### i1-b04 Favors you can call in (M, 🔴)

Helping people banks favors; spend them when you need the town: a neighbor tows your truck, friends move you for free, someone watches the kids.

- S.favors (0-5) in js/state.js, shown as 🤝 chips on the Community stat sheet.
- Earned from helping choices in existing events (stranded driver, neighbor in need, shoveling) and finished town goals.
- Spent automatically, with a prompt, on truck trouble, moving (cuts moving costs), hospital weeks and childcare emergencies.
- Balance: capped at 5, one favor expires each year, and you only earn them by picking the helpful choice.

### i1-b05 A partner with a name and a path to the altar (M, 🔴)

Your partner gets a name, and the relationship moves through stages: dating, moving in, engaged, married, with a wedding choice from the Dayton courthouse to a fairgrounds barn party.

- Turns S.partner from true/false into {name, stage, since} with migrate() keeping old saves as "dating".
- Stage events in js/features.js STORY_EVENTS: move in (shared rent), propose, the wedding (cost scales with choice).
- Married couples share health insurance (a small bill cut) and the Family card shows the anniversary.
- Balance: a big wedding costs real money and adds happiness only for a few months; a small one is fine for score.

### i1-b06 A relationship meter instead of coin flips (S, 🟠)

How things go with your partner depends on how you spend your weeks, not a 50/50 roll: date nights and home weeks build it, long work streaks wear it down.

- S.rel (0-100) updated in js/turn.js each week; dates at Out and about places and Rest or Get outside weeks raise it.
- "A rough patch" fires more often below 40 and its outcome odds use the meter; a breakup is possible below 20.
- Shown as a heart bar on the Family card.
- Balance: punishes the overtime grinder a little, rewards balanced play; idle Rest weeks help it but nothing else.

### i1-b07 Your partner has their own job (M, 🟠)

Instead of a flat part-time paycheck, your partner works a real job from the job list, with their own commute, raises and layoffs.

- S.partner.jobId picks from JOBS near Waitsburg; pay uses payNow() at 50-100% hours.
- Shared events: their layoff, their promotion, "they got an offer in Kennewick: move or commute?"
- Replaces the flat $1,400 line in js/turn.js bills.
- Balance: average take-home stays about the same as today, so the score target is not affected.

### i1-b08 Kids grow up in stages (M, 🔴)

Kids move from baby to school kid to teen, each with its own events and costs: first day of school, the science fair, a learner permit, a first job at the grocery.

- Stage helper from S.kids birth months in js/state.js; kidCost() varies by stage (daycare high, school lower, teen car insurance).
- Stage events in js/events.js, each needing a home or community week to go well.
- Kids at home show their age and stage on the Family card.
- Balance: total cost over 18 years stays near today's $650/mo average; good-parent choices lift happiness, ignoring kids drains it.

### i1-b09 Aging parents in town (M, 🔴)

Your mom or dad lives across town. Early on they help (Sunday dinners, a loan); later they need you: rides to appointments in Walla Walla, then a choice of moving them in or assisted living.

- S.folks = {age, health} set by starting background in js/state.js; a story chain in STORY_EVENTS.
- Later-stage events cost focus weeks or money; moving them in saves money but costs happiness and health.
- Ties to the existing inheritance event and the will at the law office.
- Balance: mostly Lifetime and 5-year games; the help early and the cost later roughly cancel out, but ignoring them costs community.

### i1-b10 Holidays at home (S, 🔴)

Thanksgiving and Christmas weeks ask how you spend them: host the family, go to the folks' place, volunteer at the community dinner, or work the holiday for extra pay.

- Two dated events in js/events.js (late November, late December), with choices based on partner, kids and home size.
- Hosting costs more in a bigger home and gives more happiness; the community dinner gives community.
- Quick win; reuses fmtc() prices.
- Balance: each option is a trade between money, happiness and community; no choice is free.

### i1-b11 A council term with real votes (M, 🟠)

Council seats last four years. A few times a year an agenda item comes up (the pool, water rates, Main Street parking, a dog park) and you vote; re-election depends on how your votes landed with the town.

- S.council becomes {since, votes, mood}; COUNCIL_ITEMS table in js/events.js.
- Each vote shifts community and sometimes your bills (water rate up, pool fee down).
- A re-election event at the end of the term.
- Balance: council still gives its +0.8 community a week, but a bad term can lose the seat.

### i1-b12 Your kid raises an FFA market lamb (M, 🟠)

A teen kid takes on an FFA project: buy a lamb in spring, feed it all summer, show it at the fair in Walla Walla, and maybe sell it at auction.

- A story chain in STORY_EVENTS for kids aged 14-18; feed and vet costs weekly in the bills.
- Home or Get outside weeks keep it on track; the fair outcome rolls on how many you gave it.
- Auction money goes to the kid's college fund (cuts the college event cost).
- Balance: costs money up front and needs focus weeks; the payoff is happiness and community, not profit.

### i1-b13 Name your dog, and dogs grow old (M, 🟠)

Your dog gets a name and a breed, needs walks, vet visits and a yearly checkup, slows down with age, and one day says goodbye; then you can adopt again.

- S.dog becomes {name, breed, born}; migrate() keeps old saves as a 3-year-old dog.
- Dog joy is bigger in Get outside weeks; old-dog vet bills rise; a gentle farewell event after 11-15 years.
- Shown on the Family card with the dog's age.
- Balance: the happiness bonus needs some outdoor weeks, so idle Rest-only play gets less from the dog.

### i1-b14 Barn cat, chickens and a horse (M, 🟠)

Homeowners can keep more animals: a barn cat that keeps the mice out, backyard chickens whose eggs trim the grocery bill, and a horse at the farmhouse.

- S.pets list in js/state.js; offered from the Dreamy Garden Center, the farm supply and an event.
- Chickens cut food costs a little but need a week of care now and then; a horse costs board and lifts happiness and health.
- The cat softens the mice-in-the-walls event when that is built.
- Balance: each pet has a monthly cost and care need; none pays for itself.

### i1-b15 Adopt a pet on purpose (S, 🟡)

Add a shelter visit as a trip stop in Walla Walla so you can choose a dog instead of waiting for a stray to follow you home.

- A new STOPS entry in js/features.js (kind "do"), with an adoption fee.
- Sets the same dog state as the stray event.
- Quick win.
- Balance: same costs as any dog; it only removes the luck.

### i1-b16 Home upkeep for owners (M, 🟠)

Owned homes have a condition that slowly slips: the roof, the furnace, the paint. Keep it up with Rest weeks, a DIY project, or hiring a local trade, or watch equity and happiness slide.

- S.homeCond (0-100) for owned homes in js/turn.js; shown on the Home card.
- Low condition lowers equity on sale and adds repair events; DIY uses the existing skills.
- Pairs with the fixer-upper story chain.
- Balance: careless owners lose equity, which hits net worth; renters are not affected.

### i1-b17 A backyard garden (M, 🟠)

Plant a garden in spring, water it through summer, and pick tomatoes and squash in August that cut your grocery bill and cheer you up.

- S.garden {planted, care} for any home but the room; starts from Dreamy Garden Center help it.
- Get outside weeks count as garden care; harvest lowers food costs for 8 weeks.
- A late frost or a hot August can hurt it.
- Balance: needs several focus weeks for a small saving; ignored gardens just die.

### i1-b18 Firewood and fall chores (S, 🟡)

Each fall: split firewood, clean gutters and rake leaves, or pay a neighbor kid. Done chores mean lower winter heating and fewer winter repair events.

- A fall event in js/events.js for homeowners, with DIY, pay, or skip.
- Skip raises the odds of frozen pipes and a cold house.
- Quick win.
- Balance: a small trade of a focus week against winter costs.

### i1-b19 Take in a roommate or rent the spare room (S, 🟠)

Renters can split rent with a roommate; homeowners can rent a spare room. It saves money but costs a little happiness, and some roommates are trouble.

- S.roommate {since} in js/state.js; a rent credit in js/turn.js bills.
- Roommate events: late rent, a loud boyfriend, they move out.
- Not allowed with kids at home or after marriage (or it asks the partner).
- Balance: saves about a quarter of rent but takes happiness each week; careless play won't gain from it.

### i1-b20 More places to live in town (S, 🟡)

Add homes between the room and the farmhouse: an apartment on Preston Avenue, a small duplex, and an old house on Main Street with a big porch.

- New entries in HOMES (js/state.js) with cost, happiness and down payment.
- The Waitsburg map can mark them; Moving already handles sales.
- Balance: priced on the same curve as current homes, so no new best choice.

### i1-b21 Roles for retirees (S, 🟠)

Retirees can take town roles that fit: crossing guard, museum docent, Meals on Wheels driver, or the library book sale crew.

- Retiree-only roles in the i1-b02 system.
- Each asks for one community week a month and pays a little in happiness and community.
- Gives late Lifetime games something to do.
- Balance: retired players who sit idle get nothing; their score already counts the stats these lift.

### i1-b22 Lonely stretches (S, 🟠)

If you're single, have no dog, and haven't shown up for town in a long while, loneliness sets in and slowly drains happiness until you reach out.

- A check in js/turn.js: 12+ weeks with no community week, no partner, no dog = a small happiness drain and a gentle event ("Call an old friend?").
- A one-line note in the week strip.
- Balance: aimed squarely at idle play; any people choice ends it.

### i1-b23 Trade childcare with neighbors (S, 🟠)

With community 50+, neighbors offer to swap babysitting. Take your turn once a month and the commute childcare charge drops.

- An event offers the swap; S.sitSwap tracks your turns in js/turn.js.
- kidCost() skips the commute add-on while the swap is active.
- Miss two turns and it ends.
- Balance: turns community into money only for players who keep showing up.

### i1-b24 The Burg almanac: town calendar and memory book (M, 🟠)

A sheet that shows what is coming in town over the next month (Celebration Days, the fair, harvest, Christmas lighting) and a year-by-year scrapbook of what you did at each.

- New sheet in js/ui.js from the Menu; reads event months and season goals.
- The scrapbook stores one line per tradition per year in S.almanac.
- Lets players plan focus weeks ahead.
- Balance: information only; no stat change.

### i1-b25 What the town says about you (M, 🟠)

Your habits earn a reputation tag ("always at the jam", "works too much", "never says no to a neighbor") that the paper mentions and that nudges hiring and event odds.

- A tag picked from recent focus and choices in js/turn.js every season; shown under Community.
- The Touchet Tattler place shows a short weekly column line with your tag.
- Good tags add a little to hiring odds; "never around" lowers them.
- Balance: small effects, and the bad tags land on careless and idle patterns.

### i1-b26 Funerals and the house next door (S, 🟠)

An older neighbor passes away. Bring a casserole and go to the service, and later their house goes up for sale, a chance to buy close to home.

- An event in js/events.js using the i1-b01 cast when built (a generic neighbor until then).
- Offers a one-time home purchase at a fair price.
- Balance: going costs a week of focus time; the house is priced at market, no free equity.

### i1-b27 Welcome the new family (S, 🟡)

A family moves in down the street. Drop off cookies and show them around, and they become friends who may help later.

- An event in js/events.js; the helpful choice adds a neighbor or a favor.
- Balance: small community gain for a small cost.

### i1-b28 Birthdays that matter (S, 🟡)

Your birthday, your partner's and the kids' come up each year; plan something or forget and pay for it in happiness.

- Birth months stored when people join; a reminder line the week before.
- Event offers a small party, a dinner out on Main Street, or nothing.
- Balance: small happiness swings both ways.

### i1-b29 Class reunion every ten years (S, 🟡)

Every ten years your Waitsburg High class gets together at the fairgrounds pavilion. How you're doing shows: classmates notice your job, home and family.

- A dated event in js/events.js by age (28, 38, 48...); text built from your current stats.
- Going lifts happiness and community; can surface a job tip.
- Balance: once a decade; small effects.

### i1-b30 A best friend through the years (M, 🟡)

A best friend from school has their own life story alongside yours: weddings, a divorce, a move to Spokane and back, a health scare, needing a place to stay.

- A long story chain in STORY_EVENTS with gaps of months or years.
- Being there costs a week or some money; it lifts happiness and gives a favor.
- Balance: optional help each time; skipping costs a bit of happiness, not score.

### i1-b31 Grown kids who stay or go (M, 🟠)

When kids grow up, some stay in the valley and some move to Seattle. Ones who stay drop by and later bring grandkids; ones who leave call on Sundays.

- Kid records gain {stays} at 18 in js/state.js; grandkid events in Lifetime games.
- Feeds the Legacy heir story.
- Balance: happiness only; no money or score jump.

### i1-b32 Sunday crew: a congregation or the Grange (S, 🟡)

Join a local congregation or the Grange for the weekly potluck crew, funeral meals and the fall dinner; faith is left to the player.

- A role in the i1-b02 system with plain, faith-neutral wording.
- Gives community fading slower and a few potluck events.
- Balance: same duty rules as other roles.
