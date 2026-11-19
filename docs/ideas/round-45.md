# Ideas round 45

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 45: Caring for the land

Ideas for caring for the Touchet valley that pay back slowly over a long game, without preaching.

### i45-a01 The valley ledger: a slow land-health number (L, 🔴)
A hidden S.land score (0–100) for the Touchet valley rises a little with each stewardship act and drifts back slowly. In long games it quietly tilts fishing, flood and fire odds and shows up on the end screen.
- Adds S.land in js/state.js (migrate default 40) and a weekly drift in js/turn.js toward 40.
- Stewardship choices in events and focuses add +1 to +4; nothing subtracts except a few careless choices.
- Readers: fishing and river events weight on S.land; flood/fire event damage scales down a bit at high S.land.
- Balance: it moves 1–2 points a month at best, so it only pays in 2-year and longer games; idle play never touches it, so idle stays flat.

### i45-a02 Water what you planted: the July survival check (S, 🔴)
Willows and trees planted in spring need a few summer visits. In July an event asks if you'll haul water; skip it and most of them die, and the game tells you how many lived.
- Follow-up chain (chainSet in js/features.js) on the existing willow-planting events.
- Choices: haul buckets (Get outside week counts), pay a kid to do it, or let it ride.
- Survivors add to S.land and to a 'trees still standing' count.
- Balance: planting alone earns little; the payoff needs the follow-up, which careless play skips.

### i45-a03 Trees that grow on the map (M, 🔴)
Every tree you planted shows on the Waitsburg map by the river: a dot in year 1, a small tree in year 2, a shade tree by year 4. Tap it to see when you planted it.
- js/maps.js draws S.trees entries along the Touchet and Coppei Creek lines on the town map.
- Each entry {wk, where, alive}; size from S.turn - wk.
- Pure payoff and memory; no score effect beyond S.land.
- Balance: cosmetic, so it can't be farmed for points.

### i45-a04 Count smolts at the screw trap in April (S, 🟠)
The fish crew needs volunteers to check the rotary trap at dawn and count young steelhead heading to sea. Cold hands, early alarm, a small community boost.
- New town event in js/events.js, April–May, w:2, Get outside or community week.
- Logs a 'smolts counted' number in S.fishLog.
- Four years later the 'Salmon come back to the Touchet' event weights higher if you counted.
- Balance: costs a point of health for the dawn cold; payoff is slow.

### i45-a05 Walk the creek counting redds (S, 🟠)
In late winter you walk a mile of the Touchet with a clipboard, counting steelhead nests in the gravel. Quiet, wet boots, and a tally you can compare year to year.
- Event, Feb–Apr, needs Get outside focus that week.
- Adds a yearly redd count line to the year in review (js/ui.js), seeded from S.land plus a little luck.
- Balance: +health +happy small, no money; repeat years show the count trend, not points.

### i45-a06 Leave the log in the river or cut it for firewood (S, 🟠)
High water drops a big cottonwood across a riffle near town. Cut it up for free firewood, or leave it: fish crews say logs like that make pools.
- Spring event in js/events.js after a high-water week (S.highWater).
- Cut: save on winter heat, small health cost. Leave: +S.land, and a later 'the pool below the log' fishing line.
- Balance: the money choice is real and fair; neither is a trap.

### i45-a07 Fish screen on the ditch, cost-shared (M, 🟡)
If you work farm ground with a ditch, the conservation district offers to split the cost of a fish screen. Pay your share now or keep losing fish into the field.
- Event for farmhand job (S.jobId) or owned acreage homes in HOMES.
- Pay a share (cost(), around $600); boss or neighbor remembers it (community +).
- Adds S.land +4 once. Balance: once only; a cost now for a slow return.

### i45-a08 Talk the boss into no-till (L, 🔴)
As a farm hand you can pitch no-till drilling. The first two harvests come in a little light, then fuel bills drop, the dirt stops blowing, and the boss gives you the credit.
- Story chain in STORY_EVENTS (js/features.js) gated on S.jobId==='farmhand' and 26+ weeks on the job.
- Stages: pitch (community/skill check), a lean harvest (smaller harvest bonus), year 3 payoff (raise boost via S.raiseBoost, fewer dust events).
- Feeds S.land and cuts odds of 'Dust storm on Highway 12' style events while employed there.
- Balance: the dip comes first, so short games see only the cost; good long play earns it back.

### i45-a09 A thunderstorm cuts gullies in the field (S, 🟠)
A June cloudburst runs muddy water off the hills. Fields under stubble hold; worked-up ground loses topsoil and the county road fills with mud you help shovel.
- Town event, May–Jul; text and outcome read whether no-till is done.
- Choices: help clear the road (community +, health -), or stay home.
- Balance: no-till players see the good version; it's a reveal, not a big swing.

### i45-a10 Plant a cover crop on the corner (M, 🟡)
Ask to try a cover crop on a weedy field corner: radish, peas and oats. It costs seed and a Saturday; in spring the soil is darker and the boss wants more.
- Side-hustle week option for farm hands or acreage homes; seed cost around $150.
- Next spring a short event reports soil color and a small community/raise nudge.
- Balance: cost first, payoff months later; capped at once a year.

### i45-a11 Sandhill cranes overhead in March (S, 🟠)
You hear them before you see them: a long line of sandhill cranes rattling north over the wheat. Pull over and watch, or keep driving.
- Road event (cat:'road') in March, plus a town version for non-commuters.
- Watch: +happy, adds 'sandhill crane' to the wildlife life list if built.
- Balance: small, once a year; no money.

### i45-a12 The winter raptor route (M, 🟠)
Join a volunteer who drives the same county roads each winter counting hawks on power poles: red-tails, rough-legs, kestrels, the odd golden eagle. Three Saturdays, a thermos and a tally.
- A seasonal option on the town page or bulletin board (Dec–Feb), 3 weeks to finish.
- Each week uses a Get outside or Show up week; gas cost from a short loop.
- Finishing gives a badge (BADGES in js/features.js) and S.land +2.
- Balance: needs three planned weeks, so skip-ahead and idle play never finish it.

### i45-a13 A barn owl box on the shed (S, 🟡)
Put up an owl box for about $60. If owls move in, mice stop chewing the garage wiring and you hear them at night.
- Home upgrade button for houses, not rentals (HOMES own flag).
- Cuts the odds of a mice/pest repair event; 50% chance owls arrive by next spring.
- Balance: tiny one-time cost, tiny upside.

### i45-a14 The Christmas bird count (S, 🟡)
Mid-December, the valley's bird count needs one more counter for the Waitsburg circle. Cold morning, a bakery stop after, and your name in the paper's list of counters.
- Once-a-year town event in December, community + happy.
- Adds a line to the year in review: 'Counted birds for the valley'.
- Balance: small and flat each year.

### i45-a15 Goatheads in the park (S, 🟠)
Puncturevine has taken over the ballfield edge, and every kid's bike tire is flat. Spend a Saturday pulling it with gloves, or let the city spray.
- Summer town event; pull = community +3, health -1; kids at home get a happy bump.
- If ignored, a later 'flat tire' event fires for you or a kid.
- Balance: plain trade of time for standing.

### i45-a16 The weed board letter: knapweed on your lot (S, 🟠)
The county weed board sends a notice: there's knapweed on your property. Pull it, pay to spray, or ignore it and get a second letter with a fine.
- Two-step chain (chainSet) for players on bigger lots or acreage.
- Ignore: fine via cost() in 4–8 weeks, community -1.
- Balance: ignoring costs more than acting, so careless play is gently punished.

### i45-a17 Weeds spread if you leave them (M, 🟡)
A small yard-condition note on the home card: a weedy patch grows a step each summer you don't deal with it, and shrinks when you spend a week on it.
- S.weeds 0–3 on owned homes, shown in js/ui.js home card.
- Higher S.weeds raises odds of the weed board letter and lowers home sale price a little.
- Balance: punishes long neglect, not one missed week.

### i45-a18 Make your yard wildfire-ready (M, 🔴)
Clear five feet around the house, move the woodpile off the porch, rake the needles. One planned week and a little money; fire and smoke events go easier on you after.
- Home task (S.firewise flag with a 'needs refresh' timer of 52 weeks).
- Fire-related events read it: smaller damage, and lower odds of the insurer non-renewal idea.
- Balance: it fades yearly, so it rewards attention, not one click.

### i45-a19 Chipper day on the street (S, 🟡)
The fire district parks a chipper at the end of your street one Saturday. Haul your brush down and it's gone, and you meet the neighbors doing the same.
- Spring town event; counts toward the wildfire-ready yard if done that spring.
- Community +2, small health cost.
- Balance: free, small, once per spring.

### i45-a20 Burn the ditch or wait for the crew (S, 🟠)
Your neighbor burns his ditch every spring and offers to do yours. The wind is picking up. Light it, wait for a calm day, or call it off.
- March–April event; light-in-wind carries a 15% chance of an escape that brings the volunteer fire department.
- Escape: cost, community -3, embarrassment line. Waiting: no harm.
- Balance: the risky choice is the lazy one.

### i45-a21 Let the lawn go golden in August (S, 🟡)
Your summer water bill doubles. Keep the lawn green or let it go golden till fall. Golden saves money; one neighbor sniffs about it.
- August event on owned homes; reads the water bill line if built.
- Golden: save cost(), community -1 with a 50% chance the 'native yard' neighbor praises you instead.
- Balance: small money vs small standing.

### i45-a22 Trade the lawn for native plants (M, 🟠)
Rip out the front lawn and plant bunchgrass, yarrow and sage. It costs a weekend and some money up front, then the water bill drops every summer for good.
- Home upgrade (owned homes) around $1,200; lowers summer water cost from then on.
- Pollinators and birds show up: small happy each summer, S.land +2 once.
- Balance: break-even takes about 3 summers, so it pays only in long games.

### i45-a23 A beaver dam backs water into a field (M, 🟠)
A beaver has dammed a side channel, and the farmer next door wants it gone. Trap it, call the tribe's crew to move it, or help put in a pipe that keeps the pond low.
- Town event with three outcomes and a follow-up 8–12 weeks later.
- Trap: farmer happy, S.land -1. Move it: costs a week of waiting. Pipe: a Saturday and $80, both sides happy, S.land +3.
- Balance: the best answer costs time, not money.

### i45-a24 Bag the river after the tubing weekends (S, 🟡)
By August the riverbank below the bridge has cans, lost flip-flops and a cooler lid. Join the cleanup float with a mesh bag.
- August town event after the tubing idea or any July Get outside week.
- Community +2, happy +1, S.land +1.
- Balance: small, once per summer.

### i45-a25 Salmon in the classroom (S, 🟠)
Your kid's class raises steelhead eggs in a chilled tank and lets the fry go at the park in May. You chaperone release day.
- Needs kidsAtHome() with a school-age kid; once per kid.
- Choices: take a half day (small pay cost) or skip. Going: happy +, kid line in year review.
- Balance: a family moment, tiny S.land bump.

### i45-a26 Leave the field corner for the birds (S, 🟡)
The boss asks whether to farm the odd corner by the creek or leave it in brush. Leaving it costs a little grain and brings back quail and pheasants.
- Farm hand event; 'leave it' lowers next harvest bonus slightly.
- Later pheasant-opener events weight higher; S.land +2.
- Balance: a tiny pay cost for a long-game outdoors return.

### i45-a27 Spray drift on your garden (S, 🟡)
A neighbor's spray rig drifts into your tomatoes. Talk to him over the fence, call the state ag department, or say nothing.
- Summer event for players with the garden idea or any owned home.
- Talk: usually ends with an apology and a box of peaches. Call: you get paid back but lose standing.
- Balance: no right answer for points; it's about neighbors.

### i45-a28 The land trust needs a preserve steward (M, 🟠)
The valley's land trust looks after a slice of native prairie on the hill. Take on a few hours a month: check the fence, pull weeds, lead one spring walk.
- A standing role (like council) toggled on the town page; uses one Show up week a month.
- Monthly community +2 and S.land +1 while active; drops if you miss two months.
- Balance: needs steady attention, which careless and idle play can't give.

### i45-a29 Sell a conservation easement on your ground (L, 🟠)
If you own acreage, the land trust offers to buy an easement: money now, and the ground can never be split into lots. Your heirs keep the farm, not the subdivision.
- Option on owned acreage homes in HOMES (or the bought wheat ground idea).
- Pays about 25% of land value as cash; lowers sale value of that home by the same.
- Legacy hook: the next generation (startLegacy) inherits with an 'easement' note and S.land head start.
- Balance: neutral on net worth; trades flexibility for a legacy bonus line.

### i45-a30 A spring walk on the prairie preserve (S, 🟡)
A free guided walk on the land trust's hill in May: balsamroot in bloom, a kestrel hunting, a view of the Blues. A new Get outside place.
- New pin on the Waitsburg map or an Out and about stop in js/outabout.js (no cost, May–June only).
- Health + happy like Get outside, with a seasonal line.
- Balance: same as any outdoors week; it's flavor.

### i45-a31 The valley you leave: a stewardship line on the end screen (M, 🔴)
At the end, a short paragraph tallies what you did for the land: trees still standing, redds counted, yard kept fire-ready, the creek you kept clean.
- finish() in js/features.js reads S.trees, S.fishLog, S.land, firewise and badges.
- Plain sentences, no score; lists only what happened.
- Balance: no points, so no farming; it rewards with memory.

### i45-a32 Help explains stewardship without a sermon (S, 🟡)
A short Help page: what the land number does, that it's slow, and that it pays back in fish, fewer bad fire weeks and a fuller end screen.
- New section in js/help.js under the outdoors part.
- Plain, factual, no lecture; names the long-game payoff honestly.
- Balance: tells players good play pays slowly.

### i45-a33 Steelhead come back stronger in a long game (M, 🟠)
In 5-year and Lifetime games, the fall fishing events read S.land: a well-tended valley gives better catch odds and a line about more fish than five years ago.
- Changes weights and text of existing fishing and steelhead events in js/events.js.
- Only active after week 104 so short games aren't affected.
- Balance: the payback is a better outdoors week, not cash.

### i45-a34 Pollinator strip with the school (S, 🟡)
The ag class plants a strip of wildflowers along the school fence and needs help with the seeding day and summer weeding.
- Spring community event with a 2-step summer follow-up (chainSet).
- Community +2, happy +1; finishing adds S.land +1.
- Balance: small; needs the follow-up week to count.

## Ideas 45: Events that connect

Links between the events already in js/events.js, js/features.js and js/outabout.js, so what you chose comes back weeks or years later.

### i45-b01 One marks table that events write and read (S, 🔴)
A small S.marks record (key: week set) with mark(k) and marked(k, weeks) helpers, so any event choice can leave a note and any event's when, text, weight or choices can read it. Every link below runs on it.
- New helpers next to chain() in features.js; S.marks added to EVENT_STATE and migrate in state.js.
- Marks expire on their own (a weeks window), so old saves and long lives don't pile up.
- Balance: marks only change text, weights and extra choices; no mark grants money by itself.

### i45-b02 Bluewood snow chains help on Highway 12 too (S, 🔴)
Chains bought in 'Chains required on the road to Bluewood' are already in the trunk. In the same ski season, 'Snow on Highway 12' cuts the ditch chance by 40% and the result says the chains did it.
- events.js: Snow on Highway 12 reads skiPass-style S.snowChains === skiSeason().
- Balance: the chains already cost money; this only makes a paid choice matter twice. No effect for idle play (needs the earlier buy).

### i45-b03 The levee holds when the Touchet runs high (S, 🔴)
After 'The levee is dedicated', the next 'The Touchet is running high' reads differently: the crew walks the new levee, the Stay dry basement risk is gone, and helping is 'Walk the levee with the crew'.
- events.js: The Touchet is running high checks chain('levee') ended with vol or don flags.
- features.js: Water in the basements stays off while the levee stands.
- Balance: the payoff only comes to towns where you (or the town) finished the chain; it removes a cost, adds no money.

### i45-b04 Vern, the wheat farmer you hauled for (M, 🔴)
Driving grain trucks in 'Harvest time' makes Vern (stand-in name) a regular. He waves you around in 'Stuck behind a wheat truck', gives 'Truck trouble' a cheap 'Call Vern' choice, offers his stubble in 'Hunting season' (better odds), and next July asks if you're in again.
- Mark 'vern' for 3 years from Harvest time; reads in Stuck behind a wheat truck, Truck trouble, Hunting season, next Harvest time.
- Balance: each perk is small (a choice, a few % odds), and you paid in health on the haul. Lapses if you pass two harvests in a row.

### i45-b05 The stray comes back to you (M, 🟠)
If you found the stray a home with the family on Main Street, that family may be the one in 'Neighbor's moving day' months later. Their new apartment won't take dogs: keep it now, or help find it another home.
- Mark 'stray-home' from A friendly stray; Neighbor's moving day gets a text variant and a third choice that sets S.dog.
- Only once per life, 8 to 40 weeks later.
- Balance: same happy as keeping the dog the first time; no extra reward for the delay.

### i45-b06 Your famous pie (M, 🔴)
A blue ribbon at 'Fair & Frontier Days' follows you. 'Lunchroom potluck' gets 'Bring the ribbon pie', 'Workplace fundraiser' gets 'Bake for the sale' (no cash, +community), and next year's fair asks you to defend the ribbon at lower odds.
- Mark 'pie' for 2 years; reads in Lunchroom potluck, Workplace fundraiser, Fair & Frontier Days, Celebration Days text.
- Balance: only 30% of entries win; perks are community-sized (+1 to +2) and defending is a gamble.

### i45-b07 The designated driver gets a reputation (S, 🟠)
Being the designated driver in 'Wine country weekend' makes you the tasting crew's driver. 'Wine release weekend in Walla Walla' and the work 'Holiday party' offer 'Drive everyone home again' for community, and now and then a friend covers your tab.
- Mark 'dd' for 52 weeks; two events gain a choice.
- Balance: small community, small happy; the choice still costs a little gas.

### i45-b08 Eleven votes: the council race you lost (M, 🟠)
Losing 'Run for town council?' is remembered. Next year's offer opens with 'Eleven votes. People haven't forgotten,' and your odds go up 10% if your community rose since the loss. The Tattler mentions the rematch.
- Mark 'council-lost' with your community at the time; Run for town council? reads it in text and odds.
- Balance: needs community growth to help, so idle play gets nothing; the sign cost is the same.

### i45-b09 A council seat shows up at the town's big days (M, 🟠)
With a council seat, 'Celebration Days' adds 'Ride in the parade', 'Friday night game' adds 'Hand out the trophy', and 'A levee for the town' adds a deciding vote: back the bond (community up, a small tax) or vote no (save money, some neighbors cool on you).
- events.js and features.js read S.council; the levee vote sets a chain flag the dedication reads.
- Balance: each choice trades money for community both ways; none is free.

### i45-b10 The new hire you trained becomes your boss (M, 🔴)
Whatever you did in 'Train the new hire' comes back 6 to 18 months later in 'New manager': it's them. If you mentored them, your next performance review gets +10% raise odds. If you said 'Not my job', the meeting is awkward and the boost goes the other way.
- Mark 'mentee' with the choice and job id; New manager text and S.raiseBoost read it; cleared if you change jobs.
- Balance: the effect is ±0.05 to 0.10 raise odds, same as other boosts, and careless play gets the minus side half the time.

### i45-b11 The coworker who took the promotion you passed on (S, 🟡)
Turning down 'A promotion offer' means someone else got it. When 'A coworker conflict' comes later, it's with them, and 'Talk it out' works better because they know they owe you.
- Mark 'passed-promo'; A coworker conflict text variant and better odds on one choice.
- Balance: a softer conflict, not a reward; you still gave up the 12% raise.

### i45-b12 Your old boss calls after the layoff (M, 🟠)
Months after 'Layoffs', the old shop is hiring again. If you asked to stay and still got cut, they offer your old job at your old pay. If you took the severance and walked, the offer is 5% lower.
- One-time work or town event 20 to 52 weeks later, only if you're out of work or in a lower-paying job.
- Balance: never better than what you lost; it shortens a bad stretch, which helps good play more than idle.

### i45-b13 Wing the safety inspection, get hurt later (S, 🟠)
'Safety inspection' now echoes for six months: 'Wing it' doubles the weight of 'Hurt on the job' and 'Equipment breaks down', and the result says why. 'Prep the crew' halves them.
- Mark 'safety' with the choice for 26 weeks; weight functions in events.js read it.
- Balance: makes the careless pick cost more over time, which pulls careless scores down, not up.

### i45-b14 Toughing it out adds up (M, 🔴)
Each 'Tough it out' or 'Push through' (Toothache, Feeling run down, Hurt on the job, Flu going around 'Work sick') adds to a count that fades after 26 weeks. At 3 or more, 'Feeling run down' comes sooner and costs more, and Toothache says 'the same tooth'.
- Mark counter 'tough'; reads in Feeling run down weight and bill, Toothache text.
- Balance: the free choice stays free once; repeating it is what costs. Careless players lose health, good players see the warning.

### i45-b15 Working sick spreads (S, 🟡)
Picking 'Work sick' in 'Flu going around' makes 'A coworker conflict' three times as likely for a month, with the text 'Half the crew caught what you had.' With kids at home, 'Feeling run down' can fire for you a few weeks later.
- Mark 'worked-sick' for 4 weeks; two weight functions read it.
- Balance: you kept the day's pay; this is the price.

### i45-b16 Trooper Dahl on Highway 12 (M, 🟠)
One state trooper (stand-in name) works your stretch of road. They write your 'Speeding ticket', stop when you clip the deer in 'Deer on Highway 12 at dusk', and call the tow in 'Snow on Highway 12'. A second ticket inside a year: 'Same trooper, same mile marker,' and the fine is 50% higher unless you did traffic school.
- Mark 'trooper' plus 'ticket' week; reads in three road events.
- Balance: only adds cost for repeat speeding; text-only otherwise.

### i45-b17 The gas-station old-timer, over the years (M, 🟠)
The old-timer from 'A friendly regular at the gas station' keeps turning up: he calls ahead in 'Snow on Highway 12' (a free 'Wait for the plow' choice), knows a spot in 'Hunting season', and years later his service is in the Tattler with a choice to go.
- S.gasFriend already exists; add reads in Snow on Highway 12 and Hunting season, and a once-only town event 3+ years after you met.
- Balance: one safer choice and +10% hunt odds; the service card is community and happy only.

### i45-b18 The friend you visited in the hospital (S, 🟠)
Visiting in 'A friend is in the hospital in Walla Walla' means that friend shows up for you. When 'Feeling run down' fires, a new choice: 'Your friend drives you to the clinic' (same bill, no happy loss). 'A tip from a friend' is more likely for a year.
- Mark 'visited' for 52 weeks; reads in Feeling run down and A tip from a friend weight.
- Balance: the visit cost a day; payback is small and timed to a bad week.

### i45-b19 Your carpool buddy's wedding (S, 🟡)
If you talked it out in 'Your carpool buddy is always late', the next 'A work friend's wedding' is theirs. The text says so, and either gift choice adds a little community.
- Mark 'buddy' while carpooling; A work friend's wedding text and +1 community.
- Balance: flavor with a tiny bonus.

### i45-b20 The person from Howlin' Bean (M, 🟡)
If they turned you down in 'Someone catches your eye', they're still around: the 'A stranded driver on the shoulder' turns out to be them, or they're at the 'Holiday party' with someone. Once, much later, 'They're single again' gives a second ask at the same odds.
- Mark 'bean-person'; text variants in two events and one weighted retry of Someone catches your eye.
- Balance: same 60% odds as the first ask; no extra happy.

### i45-b21 The dealer calls back (S, 🟡)
Passing on 'A test drive at a dealership' and then hitting 'Truck trouble' within six months adds 'Call the dealer back': half the trade-in bonus this week, and it opens the Life tab like the first offer did.
- Mark 'test-drive'; Truck trouble gains a choice that sets S.tradeBy.
- Balance: smaller bonus than the original; it is still a car purchase.

### i45-b22 A full freezer feeds later events (S, 🟡)
Filling your tag in 'Hunting season' leaves venison until spring: the 'Walla Walla Sweets are in' BBQ costs less, 'Lunchroom potluck' gets a free dish choice, and 'Neighbor's moving day' says you brought jerky.
- Mark 'venison' until May; three events read it.
- Balance: saves $20 to $40 across a year; you paid for the tag and took the 50% gamble.

### i45-b23 The food truck shows up around town (M, 🟠)
After a good opening day in the food-truck story, the truck is parked at 'Celebration Days', 'Friday night game', 'Walla Walla Sweets are in' and 'Festival at the Dayton Depot'. Each gets a line and a choice to work the window for an hour.
- features.js chain('truck') flags; four events in events.js get a text line and a choice.
- Balance: community +1 to +2 or a small tip, capped at one window shift a month.

### i45-b24 New folks next door after moving day (M, 🔴)
4 to 10 weeks after 'Neighbor's moving day', a new family moves in. Welcome them or just wave. Welcomed neighbors show up later: they help clear branches in 'Windstorm' (20% off), give a jump start in 'Truck trouble', and fetch the dog if it gets out.
- New town event plus mark 'new-neighbors'; reads in Windstorm, Truck trouble and dog events.
- Balance: small savings; ignoring them gives nothing, and 'Make an excuse' on moving day makes the welcome cooler.

### i45-b25 The sandbag crew in the windstorm (S, 🟡)
If you sandbagged in 'The Touchet is running high' or mucked out in 'Water in the basements' within a year, 'Windstorm' gets 'The sandbag crew comes by with chainsaws': repairs cost 30% less.
- Mark 'sandbag' for 52 weeks; Windstorm choice for owners.
- Balance: you paid in health earlier; owners only.

### i45-b26 Years of Friday nights for your kid (M, 🟠)
When a kid is 14 to 18, 'Friday night game' says your kid is on the team, and each game you go to counts. 'A kid heads off to college' reads the count: no games, a quiet goodbye; eight or more, they thank you for always being in the stands (up to +4 happy).
- Mark counter 'games' per kid; Friday night game text, A kid heads off to college happy.
- Balance: spans years and needs choices each time; idle players never get it.

### i45-b27 The Tattler follows up on what you skipped (M, 🟠)
Two to six weeks after some choices, the week's Tattler line tells what happened next: you passed on harvest and the farmer hired a high-schooler; you stayed dry and two basements on Preston flooded; you skipped the fair and a Dayton baker took the pie ribbon.
- outabout.js tattlerLine checks recent marks before the rotating TATTLER list.
- Balance: text only.

### i45-b28 Threads in the Journal (S, 🔴)
Journal entries from linked events get a 🧵 and a tap that shows only that thread, so you can read 'Train the new hire' and 'New manager' together a year apart.
- state.js log() stores a thread key from the mark; ui.js adds a thread filter.
- Balance: display only.

### i45-b29 Event links as data (L, 🟠)
A LINKS table in events.js lists each connection: the source event and choice, the mark it sets, how many weeks it lasts, and which events read it. A test checks every mark written is read somewhere and every read has a writer.
- events.js LINKS table; tests/ new links test; Help can list them later.
- Big because it touches most events above, but it keeps links from rotting.
- Balance: makes the sim able to report each link's average value.

### i45-b30 What the town remembers, on the Life tab (S, 🟡)
A short list of live marks in plain words: 'Vern owes you one,' 'The trooper knows your truck,' 'Your pie is famous,' with roughly how long each lasts. No odds shown.
- ui.js Life tab card reading S.marks and a words table.
- Balance: display only; helps good players use links.

### i45-b31 Sim check: links never pay careless play (S, 🔴)
The balance sim runs careless, idle and good bots with links on and fails if careless median goes above 60 or idle above 50. A report lists the average score value of each link.
- Balance sim in tests; uses the LINKS table if present.
- Most links reward choosing the effortful option, so careless scores should drop slightly.

### i45-b32 The retiree from work knocks on doors for you (S, 🟡)
Chipping in for the gift in 'A coworker retires' means the retiree has time and likes you. The next 'Run for town council?' adds 'They knock on doors for you' and your odds go up 5%.
- Mark 'retiree' for 3 years; Run for town council? text and odds.
- Balance: needs 60 community to even get the council offer.

### i45-b33 The health plan choice looks back at your year (S, 🟡)
Each January, 'Health plan choice' lists last year's doctor and urgent-care bills from events (Toothache, Hurt on the job, the ski knee, Feeling run down) so the cheap-or-better pick is an informed one.
- Mark each medBill() charge with its event; Health plan choice text sums them.
- Balance: information only; helps good players, does nothing for idle.

### i45-b34 The training course pays off at the rollout (S, 🟡)
If you took 'Free training course', 'New software rollout' says you already know it: 'Learn it early' costs no happy and still gives the promotion boost.
- Mark 'course'; New software rollout reads it.
- Balance: removes a −2 happy; the course cost four weeks of class work.
