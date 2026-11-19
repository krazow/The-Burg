# Ideas round 16

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 16: Month by month

Thirty-four ideas that walk the calendar from January to December, so each month in Waitsburg has its own feel.

### i16-a01 January: The December card bill comes due (S, 🟠)
Whatever you spent on gifts and holiday outings in December shows up as one January bill. Pay it off now, or carry it at interest and feel it until spring.
- Track holiday spending in December (holiday party, gifts, Holidays at home) in `S.decSpend`; fire a `when:m=>inM(m,0)` event in js/events.js.
- Choices: pay in full (money now), pay half (small interest each week in turn.js), or carry it (bigger drag plus a small happy hit).
- Balance: only fires if you spent; idle players who spent nothing skip it, so no free gain.

### i16-a02 January: Ten below and the truck won't start (S, 🟠)
A cold-snap week where an old truck may not start. Plug in a block heater you bought earlier, get a jump from a neighbor, or miss a day of work.
- New event in js/events.js, `when:m=>inM(m,0,1)`, weighted by `CARS[S.car].breakdown`.
- A one-time `S.blockHeater` purchase (small cost, Out and About hardware stop) skips it in later winters.
- Balance: rewards planning ahead; missing work costs pay so ignoring it scores lower.

### i16-a03 January: Polar plunge in the Touchet for the food bank (S, 🟡)
On a January Saturday the town jumps in the cold creek to raise food-bank money. Plunge, pledge money, or stay dry and watch.
- Town event in js/events.js, `when:m=>inM(m,0)`, yr:1.
- Plunge: community up, small health risk if health is low. Pledge: money for community. Watch: tiny happy.
- Balance: community gain is small and once a year.

### i16-a04 February: Valentine's dinner (S, 🔴)
With a partner, pick dinner out in Walla Walla, cook at home, or forget. Forgetting stings; cooking is cheap and counts if your cooking skill is up.
- Event in js/events.js, `when:m=>inM(m,1) && S.partner`, yr:1.
- Dinner out: money for relationship; cook: uses `skillLv('cook')`; forget: relationship and happy drop.
- Balance: careless picks lose a little; a small, cheap good choice exists so it isn't a money sink.

### i16-a05 February: Super Bowl Sunday (S, 🟡)
Host the party, watch at the sports bar, or stay home. Hosting costs snacks but builds friends; the bar costs more but is easy.
- Event in js/events.js, `when:m=>inM(m,1)`, yr:1, with the second-week date check (see the holiday-week idea).
- Host: money and energy for community; bar: money for happy; skip: nothing.
- Balance: modest, symmetric gains; no choice is free and strong.

### i16-a06 February: Prune vines for a week of winter cash (S, 🟡)
Wineries need winter pruners. Take a cold week of vineyard work for extra cash, which tires you out but pays well for unskilled work.
- Gig event in js/events.js, `when:m=>inM(m,0,1,2)`, offered if not retired and age 16–65.
- Pay scaled with `cost()`, health and happy cost, a small farm-skill tick in features.js.
- Balance: costs energy, so it helps active players more than idle ones; once a year.

### i16-a07 March: Spring break with the kids (S, 🟠)
Kids are out a week. Drive them to the coast, do day trips nearby, or juggle work and a sitter.
- Event in js/events.js, `when:m=>inM(m,2) && kidsAtHome()>0`, yr:1. Shares choice style with Summer break.
- Coast trip: money for family and happy; day trips: small cost; juggle: money for sitter, small happy loss.
- Balance: parents only; costs scale with kids so it doesn't snowball.

### i16-a08 March: State basketball in Spokane (S, 🟡)
Some years the high school team makes state. Drive up for the tournament, watch on the stream, or ignore it.
- Event in js/events.js, `when:m=>inM(m,2)`, chance about 1 in 4 years via a yearly seed.
- Drive: money and a day off for big community and happy; stream: small happy.
- Balance: rare, so it can't be farmed.

### i16-a09 March: Mud season on the county roads (S, 🟡)
Gravel roads go soft and get weight limits. Farm and trades jobs lose a few hours, and you can skip the gravel shortcut or risk getting stuck.
- Road event in js/events.js, `cat:'road'`, `when:m=>inM(m,2,3)`, plus a one-week hours cut for `jobIn('field','trades')` in turn.js.
- Choice: long way (time, energy) or shortcut (chance of tow bill).
- Balance: small, honest cost tied to job type; nothing to exploit.

### i16-a10 April: Easter egg hunt at the park (S, 🟡)
The town egg hunt for little kids. Volunteer to hide eggs, bring your kids, or donate candy.
- Town event in js/events.js, `when:m=>inM(m,2,3)` keyed to the Easter week (holiday-week idea).
- Volunteer: community; bring kids: family and happy; donate: small money for small community.
- Balance: modest and once a year.

### i16-a11 April: Prom for your teen (M, 🟠)
A teen kid wants to go to prom: dress or tux, photos, and a curfew talk. Spend, set limits, or let them handle it.
- Event in js/events.js, `when:m=>inM(m,3,4)` when a kid is 16–18 (kid ages from `S.kids`). Adds a kid-mood flag the graduation party event can read.
- Spend: money for family; budget version: cheaper, family still up; hands-off: no cost, a small chance of a worry event later.
- Balance: costs scale with `cost()`; no stat gain is free.

### i16-a12 April: Closing day at Bluewood (S, 🟡)
The last ski day of the season with the pond skim and costumes. Pass holders get a free fun day; others can buy a cheap ticket.
- Event in js/events.js, `when:m=>inM(m,3)`, more weight when `skiPass()` is true.
- Go: happy and community; skip: nothing.
- Balance: tiny and once a year; gives the season pass one more payoff.

### i16-a13 May: Mother's Day brunch (S, 🟠)
Call your mom, take her to brunch, or forget. Later in life the event becomes your kids calling you.
- Event in js/events.js, `when:m=>inM(m,4)`, swaps text by age and whether you have grown kids.
- Brunch: money for family and happy; call: small family; forget: family drop.
- Balance: careless 'forget' costs a little; cheap good option exists.

### i16-a14 May: Teacher appreciation week (S, 🟡)
Parents send a card, a plant or lunch for the teachers. If you work at the school, you're on the getting end.
- Event in js/events.js, `when:m=>inM(m,4) && (kidsAtHome()>0 || S.jobId is a school job)`.
- Parent: small money for community; school worker: happy and a small chance of an Employee of the month boost.
- Balance: tiny, cosmetic-leaning.

### i16-a15 June: Pea harvest night shifts (M, 🔴)
The green-pea harvest runs day and night for a few weeks. Sign on for night shifts: big short-term pay, wrecked sleep, and a summer that flies by.
- A three-week seasonal side job in features.js (pattern like the food truck `weekly`), offered in June, `when:m=>inM(m,5)`.
- Each week: pay, health and happy drain; can quit any week. Can't stack with a full-time job unless it's a school job on summer break.
- Balance: pays like hard work and costs health, so idle play can't use it; capped at three weeks a year.

### i16-a16 June: Father's Day fishing (S, 🟡)
Take your dad (or later, your kids) fishing on the Touchet, buy a gift, or let it slide.
- Event in js/events.js, `when:m=>inM(m,5)`, ties to the fishing license if owned.
- Fishing: family and happy, small energy; gift: money for family; slide: small family drop.
- Balance: same shape as Mother's Day; both cheap.

### i16-a17 June: U-pick cherries over the Oregon line (S, 🟡)
Cherry orchards near Milton-Freewater open for u-pick. Pick a few buckets for pies and the freezer, or pass.
- Outing in js/outabout.js, `months:[5]`, or a town event in js/events.js.
- Pick: small money and energy for happy; with the canning or pie ideas it saves grocery money later.
- Balance: a small, real food saving; no stacking.

### i16-a18 July: Run the fireworks stand for the boosters (S, 🟠)
For the week before the Fourth the boosters need people to staff the fireworks stand. Take shifts, donate, or sell your own (not allowed during a burn ban).
- Event in js/events.js, `when:m=>inM(m,5,6)`, community 20+.
- Shifts: energy for community; donate: money for community.
- Balance: modest community gain that costs energy, not money from nowhere.

### i16-a19 July: Summer camp in the Blues (S, 🟡)
Sign a kid up for a week of camp in the mountains. It costs, but kids come back happier and parents get a quiet week.
- Event in js/events.js, `when:m=>inM(m,5,6) && kidsAtHome()>0`, kid age 8–15.
- Camp: money for family and happy, small energy back. Skip: nothing.
- Balance: plain trade of money for stats at fair rates.

### i16-a20 August: Back-to-school week (S, 🔴)
Shoes, supplies, sports physicals and fees all land in one week per school-age kid. Shop in Walla Walla, go over the Oregon line, or use hand-me-downs.
- Event in js/events.js, `when:m=>inM(m,7) && kidsAtHome()>0`, cost per kid via `cost()`.
- Full shop: money for family; hand-me-downs: cheap, small happy dip for teens; Oregon line: saves tax, costs a drive.
- Balance: a real, expected cost for parents; planning (savings) softens it.

### i16-a21 August: Perseids over the wheat (S, 🟡)
Meteor-shower week. Stay up late in a stubble field: free and peaceful, but you're tired at work.
- Event in js/events.js, `when:m=>inM(m,7)`, yr:1.
- Stay up: happy and family if partnered, small energy loss; sleep: nothing.
- Balance: free happy, so keep it small and once a year.

### i16-a22 August: The last truck and the harvest dinner (S, 🟡)
When the last load hits the elevator, a farm family throws a harvest dinner. Bring a dish, help set up, or skip.
- Event in js/events.js, `when:m=>inM(m,7)`, more weight if you worked the harvest or have the wheat lease.
- Dish: small money and cook skill for community; set up: energy for community.
- Balance: gives harvest workers a small extra payoff.

### i16-a23 September: Labor Day weekend (S, 🟠)
Last camping weekend of summer. Service jobs pay holiday time; everyone else picks the lake, a backyard cookout, or catching up on sleep.
- Event in js/events.js, `when:m=>inM(m,8)` in the first week (holiday-week idea).
- Service and care jobs: a one-week pay bump if you take the shift. Others: trip (money for happy), cookout (small money for community), rest (health).
- Balance: each choice trades one stat for another; no free win.

### i16-a24 September: Back-to-school night (S, 🟡)
Meet the teachers, see the classroom, sign up to help. Going costs an evening; skipping means you miss the early warning on a struggling kid.
- Event in js/events.js, `when:m=>inM(m,8) && kidsAtHome()>0`.
- Go: small community and family; sets a flag that lowers the odds of a bad-grades event later.
- Balance: helps engaged play; skipping has a delayed, mild cost.

### i16-a25 October: Halloween on Main Street (S, 🔴)
Shops hand out candy on Main Street and the fire hall runs a haunted house. Hand out candy at home, take the kids, or work a shift at the haunted house.
- Event in js/events.js, `when:m=>inM(m,9)` in the last week; Home tab pumpkin from the holiday touches idea if built.
- Candy: small money for community; take kids: family and happy; haunted house: energy for community.
- Balance: small, once a year, every choice costs something.

### i16-a26 October: A week on an orchard picking crew (S, 🟡)
Apple orchards across the Oregon line need pickers. A hard week on a ladder pays cash and builds grit.
- Gig event in js/events.js, `when:m=>inM(m,8,9)`, not offered with a full-time job unless on unpaid leave or between jobs.
- Pick: money, health cost, small chance of a ladder fall.
- Balance: helps between-jobs players a little; costs health so it isn't free.

### i16-a27 November: Veterans Day at the school gym (S, 🟡)
The school holds an assembly to honor local veterans. Go and listen, help set up, or, if you served, stand when they call your branch.
- Event in js/events.js, `when:m=>inM(m,10)`; extra text for the veteran start.
- Go: small community and happy; help: energy for community.
- Balance: tiny gains, once a year.

### i16-a28 November: Ski swap at the fairgrounds (S, 🟡)
Before the season, the ski club runs a swap. Buy used gear cheap, sell your old gear, or skip.
- Event in js/events.js, `when:m=>inM(m,10)`, more weight with `skiPass()`.
- Buy: one-time gear flag that lowers Bluewood trip cost in outabout.js; sell: small cash if you have gear.
- Balance: a saving, not a gift; you still pay for the pass.

### i16-a29 November: Turkey trot down Main Street (S, 🟡)
A Thanksgiving-morning fun run. Run it, walk it with family, or sleep in before the big meal.
- Event in js/events.js, `when:m=>inM(m,10)` in the fourth week.
- Run: health and happy, small fee; walk with family: family; sleep: small energy.
- Balance: small; health gain capped so it can't replace regular exercise.

### i16-a30 December: Cut your own tree in the Blues (S, 🟠)
Buy a cheap Forest Service permit and cut a tree in the mountains with the family, or buy one in town.
- Event in js/events.js, `when:m=>inM(m,10,11)`; chains needed if Snow on Highway 12 is active.
- Cut your own: small money, energy for family and happy; buy in town: more money, less energy.
- Balance: both cost; the cheaper one costs energy and has a small road-risk roll.

### i16-a31 December: The school Christmas concert (S, 🟡)
Kids sing in the gym. Leave work early to make it, or miss it. Grandparents count too.
- Event in js/events.js, `when:m=>inM(m,11) && (kidsAtHome()>0 || grandkids)`.
- Go: family and happy, a small work hit if you leave early; miss: family drop.
- Balance: a family-vs-work tradeoff, no free gain.

### i16-a32 December: A year-end gift to the food bank (S, 🟡)
Before the year ends, give to the food bank, volunteer a shift sorting boxes, or pass. Giving lowers next April's tax a little if you itemize.
- Event in js/events.js, `when:m=>inM(m,11)`; links to the Tax refund event amount.
- Give: money for community and a small refund bump; volunteer: energy for community.
- Balance: money given is mostly lost; the tax bump is a fraction of it.

### i16-a33 January–December: Holidays land on the right week (M, 🔴)
A small calendar table so holiday events fire in their real week (Super Bowl, Easter, Mother's Day, Labor Day, Halloween, Thanksgiving) instead of any week of the month.
- Add a `HOLIDAYS` table and `holidayWeek(name)` helper in js/events.js using `S.date` (Easter computed by year). Events can use `when:()=>holidayWeek('halloween')`.
- Holiday events get a high weight that week so they reliably show.
- Balance: no stat effect itself; it just makes timing right.

### i16-a34 January–December: The month at a glance on Home (M, 🟠)
At the start of each month, Home shows a one-line card: what's coming this month in Waitsburg (two or three items from these events and the existing ones).
- In js/ui.js read event `when` rules for the current month (and the `HOLIDAYS` table) to list 2–3 titles; no new state.
- Lets players plan (save for back-to-school, buy a block heater).
- Balance: information only; helps planning, doesn't add points.

## Ideas 16: For every play style

Ideas that make The Burg better for eight kinds of players, each built so it doesn't hurt the others.

### i16-b01 [Optimizer] A focus queue: plan the next four weeks (M, 🔴)
Set up to four focuses in order (work, study, work, rest) and the skip buttons play them in turn, stopping when an event needs you.
Touches: ui.js skip buttons and focus tiles; turn.js reads S.focusQueue before the week.
Balance: Same weekly math, streaks and ruts still count, so a queue only saves taps; it cannot beat good weekly choices. Off for everyone who never opens it.

### i16-b02 [Optimizer] Copy your life's weekly numbers as CSV (S, 🟡)
A Menu button copies cash, net worth and the four stats by week as CSV text, so you can paste it into a spreadsheet and study your run.
Touches: ui.js Menu sheet; reads the weekly history in the save (or starts a small one in turn.js).
Balance: Read only; no score change. Clipboard text works offline.

### i16-b03 [Optimizer] Soft-cap ticks on the stat bars (S, 🟠)
Each stat bar gets a faint tick where your current focus stops helping, like where Rest tops out in the low 80s, so you can see diminishing returns.
Touches: ui.js stat bars; reads the Rest cap and streak fade from turn.js/state.js.
Balance: Shows rules that already exist. Helps good play aim, does nothing for careless or idle play.

### i16-b04 [Optimizer] Tag a life with your strategy name (M, 🟡)
At the start (or any time) name your plan, like 'Commuter + 401(k)'. The shelf of lives groups your best scores by tag so you can compare strategies.
Touches: state.js save field S.plan; features.js finish() stores it with bests; ui.js lives list.
Balance: Labels only. No score effect.

### i16-b05 [Storyteller] Name each year like a book chapter (S, 🔴)
At the year in review you pick one of three suggested chapter titles built from the year ('The Year of the Long Commute') or type your own. The Journal and ending show the chapters.
Touches: ui.js year review; features.js finish() ending story; title stored in S.chapters.
Balance: Text only. Suggested titles come from what happened, so they reward paying attention, not points.

### i16-b06 [Storyteller] A narrator voice: plain, porch-talk or dry (M, 🟡)
A setting swaps Journal and week-strip lines between three voices built from word lists. Same facts, different flavor.
Touches: New word lists in events.js; ui.js Settings; Journal line builder in turn.js.
Balance: Text only. Plain stays the default for readability (grade 6).

### i16-b07 [Storyteller] Why you did it: a reason chip on big choices (S, 🟠)
After quitting, moving, marrying or retiring, tap a one-word reason ('for the kids', 'money', 'felt right'). The ending story quotes them back.
Touches: ui.js confirm sheets for quit, move, retire; features.js finish() story.
Balance: Optional tap; skip with one button. No stat effect.

### i16-b08 [Storyteller] Still unfolding: open story threads (S, 🟠)
A Journal section lists the stories that are still mid-way (a friend's secret, the mill bell) with the last thing that happened, so you can follow each arc.
Touches: features.js chain() state and STORY_EVENTS; ui.js Journal tab.
Balance: Shows only what you have already seen; never what comes next.

### i16-b09 [Explorer] A dot on choices you've never picked (S, 🔴)
Event buttons show a small 'new to you' dot on any choice you have never taken in any life, so explorers can hunt every branch.
Touches: events.js choice ids; ui.js event sheet; a small localStorage set beside badges.
Balance: Tells you nothing about the result, so it cannot steer careless play to better outcomes.

### i16-b10 [Explorer] Seasonal pins that come and go (M, 🟠)
Some map spots exist only in season: a roadside fruit stand in August, a sledding hill in January, a pumpkin patch in October. Each is a new trip stop.
Touches: maps.js town and region pins; features.js STOPS using inSeason().
Balance: Uses the normal trip cap and costs, so it adds variety, not extra gains.

### i16-b11 [Explorer] Old townsites on the region map (M, 🟡)
Faded pins for long-gone townsites along the Touchet (stand-in names). Visit on a side trip to reveal a short history card and a keepsake.
Touches: maps.js region layer; features.js trip stops; help.js history text.
Balance: One-time small happiness on first visit; gas costs still apply.

### i16-b12 [Explorer] Ask a local which way to go (S, 🟠)
Once a season at the café, a regular points you to one place you have never been. Your first visit there gets a small bonus.
Touches: outabout.js café stop; features.js stopById; S.tipped flag.
Balance: One tip per season and only for unvisited places, so it cannot be farmed.

### i16-b13 [Homebody] Pick how you rest: read, bake, tinker or nap (M, 🔴)
Rest gets a small sub-choice. Each gives the same rest, plus a line in the Journal and a little practice (bake for cooking, tinker for fixing).
Touches: turn.js FOCUS.rest; features.js practice() and SKILLS; ui.js focus tile.
Balance: Rest's low-80s cap is unchanged and practice is small. Idle play keeps 'nap', which adds nothing new, so idle stays under 50.

### i16-b14 [Homebody] Houseplants on the windowsill (S, 🟡)
Buy a plant on a garden trip; it grows on the Home scene if you rest at home at least once a month, and droops if you don't.
Touches: features.js garden stop; ui.js Home scene; S.plants.
Balance: Cosmetic plus a tiny happiness bump while healthy. Neglect costs nothing but the plant.

### i16-b15 [Homebody] A craft table that sells from home (M, 🟠)
Make quilts, carvings or jam during Rest weeks and list them by mail order. Pays a little, slowly, and better with skill.
Touches: features.js BIZ (a small 'craft' type) or skillWeek(); ui.js Home card.
Balance: Income capped per month and only on varied rest weeks, so resting every week still ruts and stays low.

### i16-b16 [Homebody] Badges where the house is the hero (S, 🟡)
A badge set for home life: pay off the house, furnish every room, cook 52 dinners in, keep a pet ten years.
Touches: features.js BADGES and badgeWeek().
Balance: Badges need steady long play, so careless runs rarely get them.

### i16-b17 [Social Butterfly] A contacts list with 'last talked' weeks (M, 🔴)
A phone sheet lists friends, family and coworkers with weeks since you last talked. Tap to call; it uses a sliver of the week and warms the tie.
Touches: ui.js new sheet; state.js S.contacts; turn.js applies the call.
Balance: Calls have diminishing returns per week, so spamming calls doesn't beat real visits.

### i16-b18 [Social Butterfly] Play matchmaker for two neighbors (M, 🟠)
Set up two single neighbors. Over a few weeks it works, fizzles or gets awkward; if it works you're invited to the wedding.
Touches: features.js STORY_EVENTS chain; events.js result lines.
Balance: Small community swing either way; it's a story, not a farm.

### i16-b19 [Social Butterfly] Put in a word to get a friend hired (S, 🟠)
When your job has an opening and your standing is good, refer a friend. They owe you a favor, unless they flake and it costs you standing.
Touches: state.js JOBS openings; features.js favors; events.js follow-up.
Balance: Risk on both sides, and only with good standing, so careless play can't use it.

### i16-b20 [Social Butterfly] Throw a block party in summer (M, 🟡)
Plan a block party: pick food and music, pay for it, and see who comes. Lifts your street and can bring new friends.
Touches: events.js summer card; outabout.js bbq/grill items; ui.js plan sheet.
Balance: Costs money and a week; once per summer; needs some community to fill the street.

### i16-b21 [Collector] One collections page for every set (M, 🔴)
One sheet shows progress on every set (badges, wildlife, recipes, keepsakes, events seen, stops visited) as counts like 17/40.
Touches: features.js new collectionsSheet(); reads existing badge and album stores.
Balance: No score effect; it just gathers what's already tracked.

### i16-b22 [Collector] The license plate game on Highway 12 (S, 🟠)
Commute and trip drives sometimes spot a plate from a new state. Fill all 50 over many lives.
Touches: turn.js commute line; localStorage set like badges; ui.js collections.
Balance: Zero score effect, so it can't tilt balance.

### i16-b23 [Collector] Rocks from the river bars (S, 🟡)
Getting outside on the Touchet or a Snake River trip may turn up an agate, petrified wood or a geode for a shelf on Home.
Touches: turn.js outside focus; features.js trip stops; ui.js Home shelf.
Balance: Finds are rare and cosmetic; repeating outdoors still ruts.

### i16-b24 [Collector] A stop passport with a stamp for each place (S, 🟠)
A little passport gets a stamp the first time you visit each out-and-about stop, town and festival.
Touches: features.js tripWeek(); outabout.js stop ids; ui.js passport sheet.
Balance: Cosmetic. First-visit stamps nudge variety, which already helps good play.

### i16-b25 [Speedrunner] Split times for milestones (M, 🟠)
An optional timer shows the week (and real minutes) you hit first job, $10k, a home and debt-free, beside your best splits.
Touches: features.js milestone hooks; localStorage best splits; ui.js header chip.
Balance: Off by default; records only. Practice lives don't save splits.

### i16-b26 [Speedrunner] Turbo setting: no animations, events still stop (S, 🔴)
Turns off the week animation and week strip pop-ups; results show as one line. Events and big choices still wait for you.
Touches: ui.js render and week strip; turn.js week end.
Balance: Same game, fewer frames. Doesn't skip any decision, so careless play gains nothing.

### i16-b27 [Speedrunner] A run code that proves your result (M, 🟡)
The end screen gives a code of the seed and your choices. Pasting it replays the life and confirms the score.
Touches: features.js useDice()/eventDice(); a replay runner reusing the sim's headless loop.
Balance: Read only; makes bragging honest, changes no rules.

### i16-b28 [Speedrunner] Practice one hard stretch (M, 🟡)
Start a short segment from any checkpoint of a past life (like your first winter) to practice it. Segments never count for bests.
Touches: state.js checkpoint copies; S.practice flag already blocks challenges.
Balance: Practice flag keeps it out of records.

### i16-b29 [Parent + Kid] Guess first: what will happen? (S, 🔴)
Optional: before an event's result, the kid picks a guess from three picture cards. Right guesses earn a sticker.
Touches: ui.js event sheet; events.js result tags; S.stickers.
Balance: No stat effect. Off unless the family setting is on.

### i16-b30 [Parent + Kid] Count the paycheck in coins and bills (S, 🟡)
After payday, an optional mini-game lets a kid count the week's pay with pictured bills and coins, then see where it goes.
Touches: ui.js week sheet; turn.js pay line.
Balance: Learning only; skipping it changes nothing.

### i16-b31 [Parent + Kid] Kid draws the dog or the truck (M, 🟡)
A simple drawing pad lets a kid draw your pet, truck or house. The picture shows on Home and in the album.
Touches: ui.js new canvas sheet; small image in the save; maps.js truck icon.
Balance: Cosmetic. Size-capped image so saves stay small.

### i16-b32 [Parent + Kid] Picture icons on event choices (S, 🟠)
Each choice gets a clear icon (money, heart, people, house) so a child who can't read yet can still help pick.
Touches: events.js choice tags; ui.js event buttons.
Balance: Icons show the kind of choice, not the result, so they don't help careless play.
