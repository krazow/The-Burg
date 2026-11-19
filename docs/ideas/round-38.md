# Ideas round 38

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 38: Balance — careless play

Round 38 looked for why careless play scores 68–78 in 5-year games. The playtest bot that found 68–71 was a job hopper, and Out-and-about clicking is worth even more. The sim's careless bot (best-pay job, no visits) sits at 59 and its median is pooled with short games. Every number below is from headless A/B runs (6–18 games each); 'expected' means not measured. Raises (+5 happiness, 6% pay) and partner/dog (1–2 points each) turned out minor.

### i38-a01 Hiring cheer once every 26 weeks (S, 🔴)
apply() in js/ui.js adds adj({happy:5}) on every hire, with no cooldown. A careless player who applies for random jobs 30% of weeks gets about 55 hires in 5 years.
Change: store S.hireJoy = S.turn and skip the +5 when S.turn - S.hireJoy < 26.
Measured (10 games, 5 years): random-job careless bot 71 to 61 (happiness part 100 to 68). Sim careless and planner unchanged (they rarely change jobs).
This bot is the one behind the round 37 playtest numbers: it reproduces Fresh 71, Farm 71, Grad 68, Transplant 71, Parent 68.

### i38-a02 Hiring cheer only for a better-paying job (S, 🟡)
Same spot in apply() (js/ui.js): read payNow(job()) before the switch and compare with payNow(x, false).
Measured: job-hopping careless bot 71 to 67 (weaker than the 26-week cooldown, because random jobs often pay more).
Pick this or the cooldown, not both.

### i38-a03 Quitting inside 13 weeks costs a little standing (S, 🟠)
In apply() (js/ui.js), when S.jobId is set and S.jobMonths < 3, adj({community:-2}) and log 'Left the X job after a few weeks.'
Expected: about -1 to -2 score for a random job hopper (40+ quick quits in 5 years), nothing for planners or the sim careless bot.
Tone: plain line in the Journal, no lecture.

### i38-a04 Three jobs in a year makes the next interview harder (S, 🟡)
apply() in js/ui.js already sums hire odds (community, schooling, people skill). Keep a short list S.hires of hire weeks and subtract 0.15 when 3+ are in the last 52.
Show it in the 'Not this time' sheet: 'They noticed you've had a few jobs this year.'
Expected: random job hopper about 2 points lower; nobody else affected.

### i38-a05 Summer town goal: drop 'Work extra hours' (S, 🟠)
SEASON_GOALS in js/state.js: summer focus ['work','hustle','community'] becomes ['hustle','community'] (update the 'what' text).
Measured (sim bots, 6–12 games): careless 5-year 60 to 58, 2-year 54 to 53; planner 85/89 and homebody 77/77 unchanged.

### i38-a06 Town goals need 3 more weeks each (S, 🔴)
SEASON_GOALS need values in js/state.js (+3 each); the town goal line already shows progress.
Measured: careless 5-year 60 to 55, 2-year 54 to 51; planner 85/89 unchanged; homebody 77 to 76.
Season goals alone are worth 7 points to careless play (59 to 52 with them switched off).

### i38-a07 Off-focus weeks set the town goal back a week (S, 🟡)
seasonWeek() in js/state.js: when the focus isn't in g.focus, prog = max(0, prog - 1). Update seasonLine() to say 'a week off sets you back one'.
Measured: careless 5-year 60 to 57, 2-year 54 to 52; planner and homebody unchanged.
Use this or the +3 weeks, not both, then re-check.

### i38-a08 Community pulls back harder above 60 (S, 🔴)
weekTick() in js/turn.js: dc = (25 - S.community) * 0.05 uses 0.1 when community > 60.
Why: careless play ends with community at 91–100 (local job +0.6, random Show up weeks, events +40 over 5 years, season goals) because nothing pushes back.
Measured: careless 5-year 60 to 57 (community part 92 to 66 in the 10-game check), job hopper 71 to 66; planner 2-year 85 to 83, 5-year 89 unchanged.

### i38-a09 Happiness pulls back harder above 70 (S, 🟠)
weekTick() in js/turn.js: (52 - S.happy) * 0.06 uses 0.12 when happy > 70.
The weekly pull back is only about 1.4% of the gap, so any steady +0.2 a week moves the resting point up 15 points.
Measured: random-visit careless bot 78 to 73, job hopper 71 to 69; planner 5-year 89 to 86 (still above 70).

### i38-a10 Health score starts at 55, not 40 (S, 🟠)
lifeScore() in js/features.js: he = clamp((avgHe - 55) / 40 * 100); update the 'How the score adds up' line (40 → 0 becomes 55 → 0).
Measured (sim, 6–18 games): idle 6-month 53 to 49 (now under its 50 target), careless 6-month 51 to 48, 5-year 60 to 59; planner 6-month 73 to 70, 2-year 85 to 82, 5-year 89 to 86.

### i38-a11 Out and about health only when health is under 70 (S, 🔴)
visit() in js/outabout.js: drop fx.health when S.health >= 70 (the clinic already does more when health is low). Say so in the option note.
Measured: careless bot with 2 random visits a week 78 to 74 (health part 89 to 67). Sim bots unchanged (the planner only gets coffee and goes to the game).
Not the same as the 80s taper (i15-a02): this stops health gains from visits for healthy players entirely.

### i38-a12 Out and about adds at most 1 point per stat a week (S, 🟠)
OUT_WEEK_CAP in js/outabout.js (and the help line in js/help.js that prints it).
Measured: random-visit careless bot 78 to 74 (happiness part 94 to 83); job hopper unchanged; planner's weekly coffee (+0.56 happy) is under the cap, so it's unchanged.

### i38-a13 Visits lose their sparkle after 3 weeks in a row (M, 🟡)
visit() in js/outabout.js: keep S.outHist of visit weeks and scale mult by 0.4 when the last 3 weeks are all in it.
Measured: random-visit careless bot 78 to 70 (strongest single Out-and-about fix), planner 2-year 85 to 79 (it gets coffee every week).
Counting only 2-visit weeks spared the planner but did nothing (clicker 78): random clicking only makes 2 visits in about 45% of weeks. A better rule: the first visit each week is exempt.

### i38-a14 Events: a careless answer should average zero (M, 🟠)
Measured (careless bot, 5 years): no events 44, worst answer every time 46, random 59, best 67. The 21-point gap between best and worst is healthy, but random sits 15 points above no events.
Most common gains for random answers: A friendly stray (+6 happy), Friday night game, A stranded driver, Employee of the month, Audiobook habit, Cheap flight deal.
EVENTS in js/events.js: add a money or time cost (or a small chance of a dud) to their cheapest good option. Planner picks the first choice, so check it stays at 70+.

### i38-a15 A rented room past 30 wears on you (S, 🟠)
weekTick() in js/turn.js: dh -= 0.6 when S.home === 'room' && age() >= 30. Add a one-time Journal note at 30: 'Most of your friends have a place of their own now.'
Measured: Lifetime careless 72 to 69 (harness, 6 games) and 65 to 63 (sim, 3 games); planner, homebody, idle and tripper Lifetime scores unchanged.

### i38-a16 Lifetime: piles of cash count less than invested money (M, 🟠)
lifeScore() in js/features.js: split netWorth() into cash and the rest; cash over 24 months of living costs counts 50%. Show it on the end screen as 'Cash sitting idle (counts half)'.
Expected: Lifetime careless about 72 to 65; the Lifetime planner (401(k) and wheat lease) loses little. Not the same as i20-b15 (that one is about what you'd walk away with, after selling).

### i38-a17 Overtime weeks leave room for one visit (S, 🟡)
visitsLeft() and actBlocked() in js/outabout.js read OUT_MAX; make it 1 when S.focus === 'work'.
Expected: random-visit careless bot about -1 (one week in six is overtime); planner unchanged (its overtime weeks only get coffee).
Fits the week-as-a-turn idea: your focus is where your time goes.

### i38-a18 Balance sim: careless ceilings per game length (S, 🔴)
tests/sim.test.mjs: compute the careless and idle medians per length and fail if any is above the ceiling (62 / 52). Print them in the report.
Measured today (SIM_SCALE=3): careless 6-month 51, 2-year 54, 5-year 60, Lifetime 65; pooled 54. Idle 6-month 53 is also over 50 and hidden by the pooled 46.

### i38-a19 Balance sim: a job-hopping careless bot (S, 🔴)
tests/sim.test.mjs STRATEGIES: add 'drifter'; in the job step pick JOBS.filter(x => x.edu <= S.edu) at random instead of best().
Today's careless bot always chases the best-paid job (Hanford), which is a careful choice: it sits at 59 while a real careless player drifts through local jobs and scores 71.
Include it in the careless ceiling.

### i38-a20 Balance sim: an Out-and-about careless bot (S, 🔴)
tests/sim.test.mjs: a strategy that picks 2 random open places and options each week (PLACES, placeClosed, shownActs, visit). With visits half the weeks it scores 68.
Not the same as i26-b01 (out-and-about players, i.e. careful ones): this is the careless version, and it should count toward the careless ceiling.

### i38-a21 Balance sim: 10 careless 5-year games, not 2 (S, 🟠)
tests/sim.test.mjs GAMES: give careless and idle their own counts (five: 10, life: 4). Adds about 30 seconds.
Measured: 2 games gave 68 (63–68); 12 games gave 59 (47–68).

### i38-a22 Balance sim: 5-year careless for every start (S, 🟠)
tests/sim.test.mjs VARIANTS: add len 'five' for farm, grad, transplant, parent with careless, drifter and planner, 3 games each.
Today's careless bot at 5 years: Fresh 59, Farm 58, Grad 62, Transplant 65, Parent 59; the drifter 68–71 in all.

### i38-a23 Balance sim: score parts in the report (S, 🟠)
tests/sim.test.mjs: move the SIM_DEBUG table into the markdown report and flag any careless part with a median of 95 or more.
Today careless community is 91 at 5 years and 100 in Lifetime; the clicker's happiness is 94.

### i38-a24 Balance sim: how much events are worth (M, 🟡)
tests/sim.test.mjs: a short extra pass (careless, 5 years, 6 games) with S.noEvents = true, plus best and worst answers (try each choice on a clone of S).
Measured today: none 44, worst 46, random 59, best 67.

### i38-a25 Balance sim: try a rule change without editing the game (S, 🟡)
tests/sim.test.mjs: pass process.env.SIM_PATCH into page.evaluate and eval it after newGame(); never used in CI.
This round's numbers came from exactly this: each fix took one command and about 15 seconds.

### i38-a26 Balance sim: careless 401(k) and carpool at random (S, 🟡)
tests/sim.test.mjs: S.k401rate = random 0–2 for careless; canCarpool() then carpool with chance 0.5.
Expected: careless wealth part up a few points (more saving), which makes the ceiling a fairer test.

## Ideas 38: Farther afield

Trips and ties beyond the valley: far places, the people who leave and come back, and what home looks like when you return.

### i38-b01 Far trips: a fourth kind of trip that takes the whole week (L, 🔴)
Add far destinations (Spokane, Seattle, Portland, Boise, the Oregon coast, Mount Rainier, Yellowstone) to the trip picker as whole-week trips: no focus that week, gas plus a motel per night, and a bigger happiness lift that shrinks if you go far more than twice a year.
Touches: New FAR table next to CITIES in state.js; planFar/farWeek in features.js reuse tripSheet and tripWeek; weekTick skips focus when S.trip.far is set.
Balance: Focus is zero that week and the lift fades after two far trips a year, so trip spam loses score; idle play never plans one.

### i38-b02 A trip jar on Home: save toward a named trip (S, 🔴)
Pick a far trip and a goal amount; each week a set amount moves into the jar, and when it's full the trip unlocks at no new debt.
Touches: S.jar {dest, goal, have, perWeek}; money step in turn.js moves the weekly amount; small card in ui.js Home; far trips ask for the jar or a card charge.
Balance: Paying with the card instead adds interest and a 'trip on credit' happiness dip later, so planning ahead wins.

### i38-b03 Who watches the house and the dog while you're gone (S, 🔴)
Before a far trip, ask a neighbor friend (free, friendship goes up a little) or pay a sitter; leave nobody and pets cost a kennel and winter weeks risk frozen pipes.
Touches: Choice on the far-trip confirm in features.js; frozen-pipe repair as a town event gated on S.lastAwayEmpty and months 11,0,1 in events.js.
Balance: Asking a friend only works with a friendship above a threshold, so it rewards community play.

### i38-b04 While you were gone: a short catch-up card (S, 🔴)
When you come back from a week or more away, a card lists what happened in town: a new sign on Main Street, a levy result, who asked about you, the mail pile.
Touches: Gather log entries and town changes since S.awayFrom in turn.js; show in showReview; no new stats.
Balance: Information only; no score change.

### i38-b05 The train out of Pasco to Portland or Seattle (M, 🟠)
Far trips to Portland or Seattle can go by train from Pasco: slower and an early drive, but cheaper than flying, no pass closures and no driving fatigue.
Touches: Travel mode on the far-trip sheet (drive, train, fly) in features.js; mode changes cost, road-event odds in events.js eventOdds and the Snoqualmie check.
Balance: Train skips road events but takes an extra day, so the lift is a little smaller.

### i38-b06 Season windows for the big places (S, 🟠)
Mount Rainier's high road opens in July and closes in fall, Yellowstone's roads open in May, the coast is cheap and stormy in winter; the far-trip list says when each is open.
Touches: Reuse inSeason() and the season label on stops for FAR entries in features.js.
Balance: Off-season coast is cheaper but gives less health from rain-day walks; no exploit.

### i38-b07 Wildflowers at Paradise: Mount Rainier in late July (S, 🟡)
A Rainier trip in its two best weeks adds a wildflower hike line and a bigger health lift; a week of smoke from fires can wipe it out.
Touches: Extra stop on the Rainier FAR entry with a when() for late July and early August; a fire-smoke roll in farWeek.
Balance: Only once a year at full value.

### i38-b08 The long drive to Yellowstone needs a car that can make it (M, 🟠)
Yellowstone is about nine hours each way; an old or high-mileage car can break down near Missoula, costing a tow, a motel night and a ruined day.
Touches: Breakdown chance from S.car age and condition in farWeek; car lines in the money step; a road event for the far route.
Balance: Careless players with neglected cars pay for it; a tune-up stop beforehand cuts the risk.

### i38-b09 Gorge wind and I-84 closures on the way to Portland (S, 🟡)
A winter Portland trip can hit wind, ice or a closed freeway in the Columbia Gorge: wait it out a day, take the long way, or turn around.
Touches: New road events with roadTo === 'portland' and winter months in events.js, like the Snoqualmie Pass idea.
Balance: Turning around keeps the money but loses the lift.

### i38-b10 A cousin's wedding in Boise: RSVP weeks ahead (S, 🟠)
An invitation arrives a couple of months out; say yes and it plans a far trip to Boise that week with a gift cost, or send a gift and regrets.
Touches: Chain in features.js chainSet with a wait; the yes path calls planFar for the wedding week.
Balance: Family ties lift happiness; missing it costs a little, never a lot.

### i38-b11 Whose family this Christmas? (M, 🟠)
With a partner whose family lives out of state, December asks: drive or fly to theirs, have everyone here, or split it and do both quick.
Touches: December event in events.js gated on S.partner and a new partner home-state field; hosting costs groceries, travel costs a far trip.
Balance: Each path has a cost and a lift; skipping both every year slowly strains the relationship.

### i38-b12 A specialist only in Spokane or Seattle (M, 🟠)
Some health problems need a specialist the region doesn't have; book the drive months out, or put it off and let health slip slowly.
Touches: Health event in events.js sets S.referral with a due week; a far trip with a 'specialist' stop clears it and restores health.
Balance: Putting it off costs more health than the trip costs, so ignoring it is the worse play.

### i38-b13 Flown to a Spokane trauma center (M, 🟡)
A rare serious accident flies you or a family member to a Spokane trauma hospital; family drives up, insurance decides the bill.
Touches: Rare once-per-life event in events.js; bill depends on S.insurance; a week with no focus.
Balance: Rare and mostly cost; insured players are protected, which is the point.

### i38-b14 Get a passport first (S, 🟠)
A trip abroad needs a passport: apply at the post office, pay the fee, and wait about eight weeks before you can book.
Touches: S.passport week stamp; button on the trip-of-a-lifetime sheet in features.js; abroad trips check it.
Balance: Small cost and a delay; no stat effect.

### i38-b15 A friend's hometown in Mexico (M, 🟠)
A close friend from Pasco invites you to their family's town for a holiday: fly from Pasco, stay with family, eat well, come home changed.
Touches: Once-per-life invite event gated on a high-friendship NPC in events.js; abroad far trip with passport check in features.js.
Balance: Needs a real friendship built over time, so idle play never sees it.

### i38-b16 Jet lag: the week after a big trip abroad (S, 🟡)
The first week home from abroad, focus works at 80% and you sleep through Sunday.
Touches: S.jetlag flag set by farWeek for abroad trips; focusEffect multiplier in state.js for one week.
Balance: A small cost that keeps abroad trips from being free happiness.

### i38-b17 Bring something home for the neighbors (S, 🟡)
On a far trip, buy a small treat for the people back home (smoked fish from the coast, huckleberry candy from Idaho); hand it out for a community lift.
Touches: Optional stop on far trips in features.js; community bump applied in the week after.
Balance: Small cost, small lift; only counts once per trip.

### i38-b18 Homesick on long trips (S, 🟡)
If your town ties are strong, a far trip past a week brings a homesick note and a smaller lift; loners don't feel it.
Touches: In farWeek, scale the happiness lift down when S.community is high and the trip runs over 7 days.
Balance: Keeps very long trips from being the best happiness move.

### i38-b19 The Northwest map: far places on a zoomed-out view (M, 🟠)
A second map shows the far destinations with miles from Waitsburg and a check on each one you've been to.
Touches: New far-view SVG in maps.js with coordinates for FAR entries; visited set in S.far.
Balance: Display only.

### i38-b20 Seattle rent shock (S, 🟡)
On a Seattle or Portland trip, one line compares what your place would rent for there; usually you come home glad.
Touches: Line in farWeek using your housing cost times a city factor; small happiness lift if your housing is cheaper.
Balance: Tiny lift, once a year.

### i38-b21 An offer to leave town (M, 🟠)
A recruiter offers a big job in Boise or Seattle: take it (the life ends with a 'moved away' ending), decline, or use it to ask for a raise here.
Touches: Rare work event in events.js; take calls finish('moved') in features.js with its own end text; counter-offer raises S.raise with a chance to annoy the boss.
Balance: Taking it scores the life as it stands; leverage only works if your job rating is good.

### i38-b22 Your grown kid moves to Seattle (M, 🟠)
In Lifetime, a grown child takes a job across the mountains: a goodbye week, calls now and then, and a visit you can plan.
Touches: Lifetime event in events.js on kid age; a 'visit' far trip in features.js; happiness from kids drops while they're away.
Balance: Visits cost money and a week; calling is free but smaller.

### i38-b23 Friends who moved away keep a couch for you (M, 🟠)
Friends who leave town stay on a far-away list; visiting one makes a far trip cheaper (no motel) and keeps the friendship from fading.
Touches: Moved-away NPCs keep a city field in outabout.js friend data; farWeek drops lodging cost if a friend lives there.
Balance: Only helps if you kept the friendship up first.

### i38-b24 A classmate moves back with a plan (M, 🟡)
Someone who left years ago comes back and wants to open a shop on Main Street; help with the fix-up, invest, or just be a regular.
Touches: Chain in features.js chainSet; adds a new storefront to outabout.js places when it opens.
Balance: Investing can lose money; helping gives community, not cash.

### i38-b25 The class reunion brings everyone home (S, 🟡)
Every ten years, a summer reunion brings old classmates back to town: catch up, see who stayed, who left and who's thinking of coming back.
Touches: Summer town event in events.js on turn interval; can start the 'classmate moves back' chain.
Balance: Small lift; once a decade.

### i38-b26 Snowbird winters in Arizona (M, 🟠)
Retired in Lifetime, you can go south for January and February: warm weeks help health, but costs run high and community fades while you're gone.
Touches: Retired-only choice in November; skips two months of focus and adds a lodging cost in turn.js; community decay doubled while away.
Balance: A trade, not a free win: health up, community and money down.

### i38-b27 Spokane's big spring run (S, 🟡)
Sign up in winter, train with Get outside weeks, and drive up in May for the 12K; finishing gives a health lift and a goal badge.
Touches: Goal in features.js goalsSheet; checks Get outside weeks since sign-up; one far trip in early May.
Balance: Needs weeks of training; signing up and not training gives nothing.

### i38-b28 The 5 a.m. run to the Pasco airport (S, 🟡)
Early flights mean a dark drive to Pasco and paid parking; winter fog on the highway can make you miss the flight.
Touches: Parking cost and a fog road event in events.js when a flying far trip leaves in months 11,0,1.
Balance: Small cost; missing the flight costs a change fee, not the trip.

### i38-b29 Delayed in Seattle: the missed connection (S, 🟡)
A flight with a connection can get stuck in Seattle overnight: pay for a hotel, sleep at the gate, or call the airline.
Touches: Event during flying far trips in farWeek; three choices with money and happiness effects.
Balance: Mild bad luck; no lasting harm.

### i38-b30 Postcards on the fridge from far places (S, 🟡)
Each far place you visit leaves a postcard on Home; the end screen lists them with the year.
Touches: S.far visited list rendered as a small row in ui.js and in the end summary in features.js finish.
Balance: Display only; no score.
