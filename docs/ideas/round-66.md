# Ideas round 66

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 66: Celebration Days up close

Waitsburg's May festival as a real multi-day weekend: weather, volunteer jobs, booths, the car show, the dance, royalty, family traditions and how it changes over a long game.

### i66-a01 A weather roll for the festival weekend (S, 🔴)
One seeded draw per year: sun 60%, wind 15%, rain 15%, heat 10%. Store it as S.daysWx when May starts.
Event text and results change with it (muddy races, a short parade, crowded shade).
Touches js/events.js (Celebration Days), js/outabout.js (festivalWeek helpers).
Balance: weather only trims or shifts rewards, never adds new ones, so it can't be farmed.

### i66-a02 Cap what one festival weekend can give (S, 🔴)
Add a small festival ledger that each festival event adds to; past the cap, extra gains drop to zero and the result text says 'you're festivaled out'.
Touches js/events.js, js/outabout.js, adj() callers.
Balance: closes a stacking hole as this round adds more May events; careless and idle bots gain less from a busy May.

### i66-a03 Pick a festival volunteer job and keep it for years (M, 🔴)
S.daysJob and S.daysYears. One pick in April; it fires a short job card in festival week.
Year 1 helper, year 3 lead, year 6 the person everyone calls. Small community bumps that grow slowly.
Touches js/events.js, js/state.js (new fields), the spring season goal in state.js (counts toward it).
Balance: costs a week's spare time (health −1) and pays community, not money. Skipping a year resets one step.

### i66-a04 Park cars in the hayfield (S, 🟡)
One of the volunteer jobs as its own card: 'Push the minivan out' (community +3, health −1) or 'Call the tow guy' (community +1).
Touches js/events.js.
Balance: small, once a year.

### i66-a05 Sunday dawn trash crew (S, 🟠)
Community +4, health −1. A 15% chance you find a wallet: return it (community +2, a thank-you card) or keep the cash (+$40, a quiet −3 community later if anyone saw).
Touches js/events.js.
Balance: honesty pays more over time than the cash.

### i66-a06 The first aid tent for nurses and EMTs (S, 🟠)
Job-gated (clinic, nursing, EMT jobs). Pays career progress and community, no money.
On a heat-weather year the heat case shows up; handle it well and a family thanks you in the paper.
Touches js/events.js, job list in js/state.js.

### i66-a07 Call the horse races from the announcer's booth (M, 🟠)
A yearly card with a small flub roll that drops with each year you do it.
After 5 years: a title on the character card and a line in the life story.
Touches js/events.js, js/state.js (a counter), character card UI.
Balance: gated on community, so it rewards long steady play, not idle play.

### i66-a08 Hot-walk horses at the barn row (S, 🟡)
Happy +4, health −1. 1 in 5 chance an owner offers riding lessons next spring (a cheap repeat outing).
Touches js/events.js, the Fairgrounds pin in js/maps.js.

### i66-a09 Rent a booth on the street fair (M, 🔴)
Fee −$40. Sales = skill level × base × weather factor, with a spread. Rain years can lose money.
Unlocks from any making skill (Cook, Handy, quilting if built).
Touches js/events.js, skills in js/state.js, the weather roll above.
Balance: expected profit is small and needs a real skill, so careless play doesn't gain.

### i66-a10 The booth next to yours (S, 🟡)
Follow-up card when you have a booth. Friendly: small sales boost next year. Feud: a rival note that comes back.
Touches js/events.js.

### i66-a11 A lost kid at the street fair (S, 🟡)
Both choices end well; carrying them takes longer (health −1) but the family remembers you (community +3).
Touches js/events.js.

### i66-a12 Enter your own car in the car show (M, 🟠)
Uses your car's age and miles. Wax −$20. Ribbon odds by category; a 300,000-mile pickup has a real shot at one.
Touches js/events.js, car data in js/state.js.
Balance: happy and a ribbon on the character card, no cash prize.

### i66-a13 Judge the car show (S, 🟡)
Community 50+. Score it straight (neighbor −2 relationship, community +2) or give the neighbor the nod (neighbor +3, a grumble from the club).
Touches js/events.js.

### i66-a14 Designated driver from the beer garden (S, 🟠)
Drive them (community +3, happy −1). Say no (nothing). Ties to the existing W19 beer garden card but doesn't repeat it.
Touches js/events.js.
Balance: no money, a small social gain for the careful choice.

### i66-a15 Under 21 and outside the beer garden fence (S, 🟠)
For ages 18–20. Sneak in: 30% you're caught (−$150 fine, community −3). Root beer stand: happy +2, meet someone new.
Touches js/events.js.
Balance: the risky pick loses on average.

### i66-a16 Two-step lessons before the Days dance (S, 🟡)
A short repeat outing in April; each week adds a step. At the dance, more steps = better result and, if single, a better 'catches your eye' roll.
Touches js/outabout.js (outing), js/events.js (dance result).
Balance: costs outing slots; not a free bonus.

### i66-a17 The last slow song (S, 🟡)
Partnered: relationship +4. Single: a 'catches your eye' roll. Sit out: happy +1.
Touches js/events.js, relationships in js/state.js.

### i66-a18 Sponsor a royalty scholarship (S, 🟡)
−$100 for community +4, or −$25 for community +1. If you own a business, a small ad boost next month.
Touches js/events.js, AD_BOOST in js/outabout.js.
Balance: about $25 per community point, in line with other donations.

### i66-a19 The old court rides again (S, 🟡)
Background flag 'grew up here' plus a small chance you were on the court. Happy +6, community +2.
Otherwise you see your aunt on the float and wave.
Touches js/events.js, background in js/state.js.

### i66-a20 Your lawn chairs on Main Street (S, 🔴)
A yearly spot streak. Each year in a row adds a tiny happy bump (cap +3).
The year your chairs get moved: let it go, or have a word (it's your neighbor's cousin).
Touches js/events.js, a streak counter in js/state.js.
Balance: tiny, but it gives long games a thread to keep.

### i66-a21 A family festival tradition (M, 🟠)
S.daysTrad. A yearly card with growing happiness for the family; when a kid grows up, they come back for it (or start their own).
Touches js/events.js, kids in js/state.js, the life story.
Balance: the payoff is spread over many years; it can't be front-loaded.

### i66-a22 Kids' stick-horse race (S, 🟡)
For kids aged 3–9. Make the horse (Handy +1 practice) or buy one (−$10). Happy +3 either way.
Touches js/events.js.

### i66-a23 The festival shows up on the Main Street map (S, 🔴)
Pins appear only on the Celebration Days week. Each pin opens the matching card if it's in the pool this week.
Touches js/maps.js, js/outabout.js (festivalWeek), index.html styles.
Balance: no new rewards; it's how players find the festival cards.

### i66-a24 Main Street closes for the parade (S, 🟡)
Out-and-about places on Main show 'Closed for the parade until noon' on that week, except festival stops.
Touches js/outabout.js (open() rules).
Balance: a small friction, fits the town.

### i66-a25 Put your business in the parade (M, 🟠)
−$60 for an ad boost for 8 weeks (uses AD_WEEKS/AD_BOOST). Rain year: half the crowd, half the boost.
Touches js/events.js, js/outabout.js ads, owned-business systems.
Balance: an ad buy at fair cost, not free money.

### i66-a26 A share in a race horse (L, 🟠)
Buy-in −$1,500, feed −$60/mo. Each May the horse runs with posted odds; wins are rare. Sell your share back at a loss any time.
The horse ages: a good year or two, then it retires to the pasture and you visit it.
Touches js/events.js, a new holding in js/state.js, the bills list.
Balance: expected loss by design (happy is the return), so it never helps careless play.

### i66-a27 The photo finish argument (S, 🟡)
Say what you saw (community +2) or side with your friend (friend +3, 25% someone's phone video says otherwise, community −3).
Touches js/events.js.

### i66-a28 Will the town keep the horse races? (M, 🟠)
Fires once in years 8–15. The result sticks and changes the main festival card for the rest of the game.
With community 60+, you can speak at the meeting and swing it.
Touches js/events.js, a town-state flag in js/state.js.
Balance: changes flavor and options, not score totals.

### i66-a29 A round-number anniversary year (M, 🟠)
One special May with richer versions of the festival cards (inside the yearly cap) and a keepsake pin in the life story.
Touches js/events.js, js/state.js (a flag), the life story.
Balance: same cap as any year; the reward is the memory.

### i66-a30 Rain on the parade: pack up or march on (S, 🟡)
Rain-roll variant of the main card. Poncho: community +3, happy +2. Tent (21+): happy +2, −$15. Home: nothing lost.
Touches js/events.js.

### i66-a31 Wind takes the booth tents (S, 🟡)
Wind-roll variant. Grab a pole: community +3, health −1, 10% you get a bruise (health −2 more). Your own stuff: booth sales saved.
Touches js/events.js.

### i66-a32 Sunburn at the races (S, 🟡)
Heat-roll variant. Cooler −$15: happy +2. No plan: health −2 next week. Ties to the weather roll.
Touches js/events.js.

## Ideas 66: Event pool health

I measured the event system with 540 bot lives (9 bots, 5 backgrounds, all 4 lengths; 326,646 weeks; 85,044 events): 106 of 109 events fired, every event fired about as often as its weight predicts, and each idea below is one tuning change backed by those numbers.

### i66-b01 A tip from a friend only comes when a better job is open (S, 🔴)
Measured: 1,719 of 1,908 fires (90%) had no better job, so the only button was "Thanks anyway" (+0.5 community). A Lifetime game gets it 19 times (median), and 17 of those are blank.
Change: move the `opts` filter from choices() into when() in js/events.js. The weight stays the same.
Effect: about 0.5 town slots per 100 weeks go to real events. The pacing roll stays at 14%, so the weekly event rate does not change.
Balance: none. The blank card only gave +0.5 community.

### i66-b02 Wine country weekend: weight 3 to 2, April to October only (S, 🔴)
Measured: 3,913 fires, the most of any event (1.20 per 100 weeks). It is 8–10% of town events every month and comes 40 times in a median Lifetime game.
Change: `w:2, when:m => inM(m,3,4,5,6,7,8,9) && age() >= 21` in js/events.js. The text already says "a sunny afternoon among the vineyards."
Effect: about 0.47 per 100 weeks. The freed town slots spread over the other 48 town events.
Balance: the first button gives +3.6 happy for $90. Fewer free mood bumps for idle players.

### i66-b03 Neighbor's moving day happens in moving season (May to September) (S, 🟠)
Measured: 3,037 fires (0.93 per 100 weeks, 2nd overall). It showed up in 61% of all games and 29 times in a median Lifetime game.
Change: `when:m => inM(m,4,5,6,7,8)` in js/events.js. Keep w:2.
Effect: about 0.39 per 100 weeks. June's town events go from 19% seasonal (the 2nd-lowest month) to about 27%.
Balance: helping gives +1.6 community and costs 1 health. A smaller share of free community for one tap.

### i66-b04 Found money turns up in winter-coat season (November to February) (S, 🟡)
Measured: 1,572 fires with one button (+$57), spread evenly over the year. December has the lowest seasonal share of town events (18%): only Snow on Highway 12 and Friday night game.
Change: `w:2, when:m => inM(m,10,11,0,1)` in js/events.js. Raising the weight from 1 to 2 keeps the yearly count close to today's (about 0.32 per 100 weeks).
Effect: December goes to about 24% seasonal.
Balance: none. The money is the same.

### i66-b05 Pothole season covers February too (S, 🟡)
Measured: in February only 11% of road events are seasonal, the lowest month (March is 25%). Today Pothole season is March only and takes 16% of March road events.
Change: `w:2, when:m => inM(m,1,2)` in js/events.js. Keep yr:1, so it still comes at most once a year.
Effect: February goes to about 20% seasonal. March becomes less crowded.
Balance: none. It is one button: −1 happy, and sometimes $150 for a sedan.

### i66-b06 Fog in the Touchet Valley runs into February (S, 🟡)
Measured: Fog fired 384 times, November to January only. Road events in February: 11% seasonal. The top two February cards are the free lecture and the stranded driver, which both come all year.
Change: `when:m => inM(m,10,11,0,1)` in js/events.js.
Effect: about +0.03 per 100 weeks of fog. February road events go up to about 18% seasonal (about 25% together with the Pothole change).
Balance: none. Both choices cost a little (−1 happy, or a quarter day's pay).

### i66-b07 Truck trouble: the buddy fix works 60% of the time (S, 🔴)
Measured: the buddy button showed in 2,670 of 2,728 fires (98%: community 40+). It beat "Take it to the shop" on all four stats in 100% of them: −$120 and +1 community, against −$728 and −2 happy.
Change: in the buddy go() in js/events.js, if chance(.6) do today's result. If not, the shop bill is 70% and +1 community ("they tried").
Effect: expected cost goes from $120 to about $276. The buddy is still the best pick, but the shop is now a real choice for anyone who hates risk.
Balance: about −$150 per breakdown for engaged players. The truck breaks down 29 times in a median Lifetime game. Careless play is not helped.

### i66-b08 Gas prices spike: a carpool covers half the spike, not all of it (S, 🟠)
Measured: carpool showed in 1,822 of 1,888 fires. It beat "Pay up" in 100% of them: $0 and +0.9 community, against −$135 and −2 happy.
Change: in the carpool go() in js/events.js, charge 50% of the spike and −1 happy, and keep +2 community.
Effect: carpool becomes about −$68 −1 happy +2 community. It is still the better pick, but it now has a cost.
Balance: about −$70 per spike for good players. Neutral for careless play.

### i66-b09 A coworker conflict: going to the boss buys a quiet year (S, 🟠)
Measured: "Talk it out" beat "Go to the boss" in 1,364 of 1,364 fires (+0.7 happy +0.5 community, against −1 happy).
Change: the boss go() sets `S.evCd['A coworker conflict'] = S.turn + 52` (today 8) in js/events.js.
Effect: a real trade. Talking it out is a gamble that builds the people skill. The boss gives a quiet year.
Balance: none to small. It only moves when the event comes back.

### i66-b10 Train the new hire: mentoring costs a late night (S, 🟡)
Measured: "Mentor them" beat "Not my job" in 1,128 of 1,128 fires (+0.9 happy and people practice, against −1 happy).
Change: mentor go() adds health:-1. "Not my job" changes to happy 0 (you kept your evening) in js/events.js.
Effect: both choices have a cost. The people-skill practice still makes mentoring the better long-term pick.
Balance: −1 health for engaged players. Skills still reward care.

### i66-b11 A lost wallet: finding the owner costs an afternoon (S, 🟡)
Measured: "Track down the owner" beat "Leave it at the store desk" in 99% of 1,297 fires (+2.2 happy, +0.9 community, +$20 average reward, against +0.8 happy).
Change: tracking: −$10 gas and +2 happy (was +3). Desk: +1 happy and +1 community, in js/events.js.
Effect: tracking is still the warmer choice, but the quick choice no longer loses on every stat.
Balance: small. It is a road event, once a year at most.

### i66-b12 A friend in the hospital: flowers become the easy kind choice (S, 🟡)
Measured: "Visit" beat "Send flowers" in 100% of 992 fires (−$10 +0.8 happy +0.9 community, against −$40 +0.5 community). "Visit after work" (240 fires) beat it too.
Change: flowers go to −$25 with +1 community and +1 happy. Visiting stays the bigger community gain, in js/events.js.
Effect: the choice becomes time against money, not right against wrong.
Balance: none.

### i66-b13 Skipping the holiday party or the conference gets you something (S, 🟡)
Measured: Holiday party "Go" beat "Skip" in 100% of 194 fires (+2.3 happy +0.5 community, against −1 happy). Conference "Go, paid" beat "Skip" in 98% of 425 fires (+1.9 happy, against nothing).
Change: Holiday skip: +1 happy (+2 with kids at home). Conference skip: +1 happy (+2 with a partner), in js/events.js.
Effect: two dead buttons become real choices. Going still gives community or class weeks.
Balance: small. A few happy points a year, the same for any play style.

### i66-b14 Bluegrass jam: sitting in costs a late night (S, 🟡)
Measured: "Bring a guitar and sit in" (community 45+) showed in 1,409 of 1,497 fires and beat "Go listen" every time (+4 happy +3 community free, against $5 +3 happy +2 community).
Change: the sit-in go() adds health:-1 in js/outabout.js.
Effect: sitting in is still the community choice, but it costs something.
Balance: −1 health about every 4 jams for players with high community.

### i66-b15 Health plan: better coverage pays back (M, 🔴)
Measured: event medical bills (Feeling run down, the Bluewood knee, the back doctor) average $17.70 per year of work over 4,845 bot work-years. Halving that saves about $9, against +$480 for the cheaper plan. Good players took "Cheaper plan" in 179 of 206 picks.
Change: medBill() also covers Toothache ($650; 0.26 a year → about $85 saved) and Hurt on the job light duty (about $159 per work-year → about $80 saved). The cheaper plan becomes +$40 a month for 6 months. Touches js/events.js.
Effect: better coverage is worth about $174 a year, against $240. Field and trades workers, who get Hurt on the job, come out ahead.
Balance: about −$240 a year for players who take the cheaper plan. Careless play is not helped.

### i66-b16 Bluewood season pass: winter "Get outside" weeks count as ski days (S, 🔴)
Measured: Powder day fired 0.17 times a year (1,055 fires in 6,282 bot-years). The pass saves $75 per Powder day, so about $13 a season. Good players bought it in 185 of 211 sales.
Change: in weekTick (js/turn.js), when skiPass() and the month is December to March and the focus is outdoors, add {happy:2, health:1}. Show "🎿 Ski day" in the week's notes.
Effect: a planner who gets outside 1 week in 6 gets about 3 ski days a season (+6 happy, +3 health) for $300.
Balance: it rewards a choice the player made on purpose. Idle players never buy a pass or pick outdoors.

### i66-b17 Feeling run down comes under 45 health, not 40 (S, 🔴)
Measured: 157 fires, all from the all-work bot (4% of games). There were 0 fires in 300,000+ weeks from the other bots, and careless players never went below 50 health. Share of event weeks under 45 health: commuter 9%, hustler 7%. Under 50: 75% and 58%, which is too many.
Change: `when:() => S.health < 45`, w:5 to 4, in js/events.js.
Effect: the clinic card shows up for players who really overwork. The doctor gives +12 health for $350.
Balance: it helps players who work hard. Careless and idle players never get it.

### i66-b18 Job events get double weight for your own job group (M, 🟠)
Measured: in 12 forced service lives (diner, retail, hardware, barista, grocer; 3,120 weeks), A rude customer fired 9 times, against 18 each for Lunchroom potluck and A coworker conflict. Across all bots, 6,328 of 20,418 work fires (31%) were group events.
Change: add `grp:true` to the 13 jobIn events (or derive it). In pickEvent (js/events.js), give grp events double weight in the work pool.
Effect: group events go to about 47% of work fires. A rude customer comes about every 3.5 years instead of every 7 for a service worker.
Balance: group events are mixed (overtime pay and injuries). The sim checks medians do not move more than 1 point.

### i66-b19 Harvest crunch: more harvest jobs, weight 4 to 8 (S, 🟠)
Measured: 6 fires in 326,646 bot weeks. In 12 forced elevator/cellar/onion lives (3,120 weeks) it fired twice, about once every 30 work-years.
Change: `when:m => working() && ['elevator','cellar','onion','foodplant','agtech'].includes(S.jobId) && inM(m,6,7,8)`, w:8, in js/events.js. The farmhand keeps "Run the combine" in Harvest time.
Effect: about once every 4 or 5 harvests for those jobs.
Balance: it is a trade (+$1,200 against −4 health). Neutral.

### i66-b20 Chains required also comes on Bluewood ski days (S, 🟡)
Measured: 19 fires, all from the trip-every-week bot (2% of games). Good players picked "Hit the slopes" 941 times and never had to think about chains.
Change: the Powder day "Hit the slopes" go() checks `S.snowChains !== skiSeason()` with a 30% chance. If the check hits, it shows the chains card as a follow-up (showEvent(…, then)), in js/events.js.
Effect: about 1 in 3 ski seasons asks about chains, once. Buying them covers the rest of the season.
Balance: −$60 or −2 happy. A small cost on a fun choice.

### i66-b21 Fixer-upper: hiring a contractor pays close to doing it yourself (S, 🟠)
Measured with 20 five-year lives that start in the fixer: planners (the do-it-yourself buttons come first) finished the story in 10 of 10. Careless players finished 5 of 10. Do it yourself: −$350 −$2,500 +$6,500 equity = +$3,650. Pro: −$1,400 −$7,000 +$8,000 = −$400.
Note: in the main sim 0 of 540 bot lives bought any home, so the 3 fixer events never fired. See the reach table (i56-b16).
Change: the pro kitchen gain goes 8,000 to 10,000 in "The house is coming together" (js/features.js). The pro path nets +$1,600 and saves 5 health.
Balance: homeowners only. Careless players rarely finish the story.

### i66-b22 The flood: Water in the basements gets 16 weeks to arrive, not 8 (S, 🟠)
Measured: Stay dry was picked 58 times, but Water in the basements fired only 12 times (21%). After that, A levee for the town fired 11 times and The levee is dedicated fired 6. It was eligible for only 261 weeks in all.
Change: `S.turn - S.highWater <= 16` and w:20 in js/features.js.
Effect: the chance per week goes from about 4% to about 6%, so about 60% of Stay-dry springs flood.
Balance: the flood only follows the less careful pick. It is a story, not a reward.

### i66-b23 Hurt on the job: light duty costs half as much (S, 🟠)
Measured: good players took light duty in 752 of 810 fires, at −$949 on average (2027 dollars). "See the doctor" was −$120 and −2 health. In a 2-year game, 1 health point is worth about $230 of score, so the doctor wins by about $370.
Change: weekPay()×0.8 becomes ×0.4 (4 weeks at 90%), and add health:1, in js/events.js.
Effect: light duty is about −$475 and +1 health. Pushing through stays −6 health.
Balance: field and trades workers who rest get a little more. Careless play picks at random.

### i66-b24 Cooldowns grow each time an event repeats (M, 🟠)
Measured: the median Lifetime game ran 3,185 weeks and had 798 events, only 90 of them different. Wine country weekend came 40 times, and Moving day, Truck trouble, Music night and Windstorm came 29 each. Short games are fine: 6-month games repeat 2% of events, 2-year games 16%.
Change: count S.evSeen[title] in weekTick (js/turn.js). Set the cooldown to `S.turn + (ev.yr ? 40 : Math.min(52, 8 + 4 * seen))`.
Effect: the most common events settle at about once a year after their first 10 fires. Rarer events and story steps get the freed slots.
Balance: the event rate does not change (the category roll is the same). Medians shift less than 1 point.

### i66-b25 A raise, Layoffs and Tax refund move to the work pool (S, 🟠)
Measured: 1,800 of 45,562 town fires (4.0%) were A raise (750), Layoffs (396) or Tax refund (654). All 3 need a job.
Change: add cat:'work' to all 3 in js/events.js. Keep their weights.
Effect: town cards are about the town. Work events go up by about 9% for workers, and town events spread over the other events.
Balance: about neutral. The same events, from a different 8% roll.

### i66-b26 The idle bot answers events with the do-nothing choice (S, 🟠)
Measured: event effects per 52 weeks: idle +24.6 happy and +10.6 community, planner +9.3 and +2.5. The planner's stats sit near the cap, so its gains get clipped.
Change: in tests/sim.test.mjs, the idle bot picks `ch[ch.length - 1]`. Report the old first-button idle as its own "idle-tapper" row.
Effect: the idle ceiling (52) is tested against a truly passive player. The tapper row shows how much events give to people who only tap.
Balance: a measurement change. If idle-tapper goes over 50, the friendly first buttons are too generous.

### i66-b27 A strictly-better choice check in the sim (L, 🔴)
Measured: this round's 540 lives found 14 pairs with no later effects where one choice won in 95% or more of fires (truck buddy, carpool, coworker talk, new hire, wallet, hospital visit, traffic school, holiday party, conference, remote-day trial and more), each over 23 to 2,670 fires.
How: in tests/sim.test.mjs, save S and the dice with structuredClone, run each choice's go() 6 times, then put everything back. Mark choices that change lasting state (S.promo, S.skiPass, S.healthPlan, chains) as "has later effects" and leave them out.
Output: a table in the job summary, and a failure for any new pair not on an allow list.
Balance: report only. It stops new events from adding free wins.

### i66-b28 Music night at The Royal Brick: weight 2 to 1 (S, 🟡)
Measured: 2,787 fires (0.85 per 100 weeks), 41% of games. Together with The Little Kiss (0.48) and the bluegrass jam (0.46), business cards are 13% of town events.
Change: w:1 in js/outabout.js.
Effect: about 0.45 per 100 weeks. The freed slots go mostly to seasonal and story events.
Balance: the first button gives +4 happy +2 community for $25. Fewer free bumps for idle players.

### i66-b29 Celebration Days: the long-shot horse loses money on average (S, 🟠)
Measured: "Put $100 on a long-shot horse" averaged +$36 and +0.8 happy over 493 fires. The parade costs $60.
Change: chance(.28) becomes chance(.18) in js/events.js. A win still pays $400.
Effect: the bet averages about −$10. It is still a thrill, not a money-maker.
Balance: careless random picks lose their small bonus.

### i66-b30 Mandatory overtime: refusing has a real cost (S, 🟡)
Measured: "Refuse" averaged −0.1 happy over 833 fires. "Work it" averaged +$367, −3 health and −1.9 happy.
Change: the Refuse go() uses chance(.4) for the write-up and sets S.raiseBoost = -0.1 (the next review is less likely to bring a raise), in js/events.js.
Effect: the card is a real trade: your health against your standing at work.
Balance: small. Field and service jobs only.

### i66-b31 A season-mix check: every month at least 20% seasonal events (S, 🟡)
Measured: town events by month: March 43% seasonal, but June 19%, October 20%, November 20% and December 18%. Road events: February 11%, the lowest. The event rate itself is flat: 25.7 to 26.5 per 100 weeks every month.
How: an event counts as seasonal if when() returns false for some month (test each month with the same S). Add a 12-column row to the sim summary in tests/sim.test.mjs.
Effect: retiming ideas (wine country, moving day, found money, potholes, fog) can be checked, and a new event pack cannot leave a month bare.
Balance: report only.
