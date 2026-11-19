# Ideas round 14

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 14: Vehicles and getting around

Ideas for buying, keeping and driving your ride, and for other ways to get around the Touchet Valley.

### i14-a01 More rides on the used lot: AWD wagon, minivan, hybrid (M, 🔴)
Three new entries in CARS, each with one trait that matters: the AWD wagon slides off less in snow, the minivan fits a big family without a happiness hit, the hybrid gets 48 mpg but costs more up front.
- Adds `awd`, `seats` and `hybrid` traits to CARS in js/state.js; the Ride card in js/ui.js lists them.
- AWD multiplies ditch odds by 0.6 (stacks with winter tires, floored at 0.3).
- With 3+ kids, a ride with under 5 seats costs −0.5 happiness a week.
- Balance: every pick costs more than the beater, so careless buyers just spend more; no ride beats careful driving.

### i14-a02 Sell it yourself: private sale or quick trade-in (M, 🔴)
When you change rides, choose the dealer trade-in (instant, lower) or list it in the town paper for about 20% more. A buyer turns up in one to three weeks, and some try to lowball you.
- A "Sell it yourself" button in buyCar() (js/ui.js); S.forSale holds the listing.
- A weekly roll in js/turn.js finds a buyer; a small "Lowball offer" event lets you take it or wait.
- Until it sells you pay for both rides, so it only pays off with cash on hand.
- Balance: more money only for players who plan ahead.

### i14-a03 A pickup in a neighbor's driveway: buy it, or get it checked first (M, 🟠)
Now and then a neighbor sells a used ride cheap, with a hidden condition (good, fair or a lemon). Pay for an inspection in Walla Walla to see the condition before you buy.
- A new event in js/events.js that sets a hidden `cond`; the inspection is a trip stop in STOPS (js/features.js).
- A lemon has double breakdown odds for a year; good has half.
- Balance: buying blind is a gamble, careful play pays a small fee and wins on average.

### i14-a04 The project truck in the shed (L, 🟠)
Buy an old truck that doesn't run for a few hundred dollars and fix it up over many weekends. Each step needs parts money and a Side hustle or Rest week at home; a finished classic is worth several times what you put in.
- S.project with steps (engine, brakes, body, paint) in js/state.js; a Project card on the Life tab (js/ui.js).
- Weeks on it give Mechanic practice (SKILLS in js/features.js) and unlock the Dayton car show event (R-24) with a ribbon.
- A chain (chainSet) adds "missing part" and "neighbor has one" beats.
- Balance: needs many deliberate weeks and money; an abandoned project sells for scrap, so idle play gets nothing.

### i14-a05 Change your own oil in the driveway (S, 🔴)
An in-town way to keep up car care: buy oil and a filter at the hardware store and do it yourself for about a third of the shop price. At Mechanic level 0 there is a small chance of a mess that costs extra.
- A new Out and about action in js/outabout.js that sets S.svc like the oil stop.
- Gives 1 Mechanic practice point; the mess chance drops to 0 at level 1.
- Balance: saves a little money and a trip, but only if you remember; S.svc timing rules stay the same.

### i14-a06 A rolling tool chest (S, 🟡)
A one-time buy at the hardware store that makes do-it-yourself car work cheaper and lets you fix small Truck trouble at Mechanic level 1 instead of 2.
- S.tools flag in js/state.js; checked in the Truck trouble event (js/events.js) and the DIY oil change.
- Shows on the Life tab Ride card.
- Balance: pays back slowly; only worth it to players who do their own work.

### i14-a07 A used electric car on a rural road (L, 🔴)
A used EV joins the lot: very cheap per mile, but you need a garage outlet put in, winter cuts the range, and Tri-Cities trips need a charging stop that costs time.
- CARS.ev in js/state.js with `kwh` per mile; commuteCost() in js/ui.js uses power price instead of GAS.
- A one-time "charger at home" cost; renters in the room can't install one and charge at a slow public plug (more time, −happiness).
- Range rule: over 60 miles each way in Dec–Feb adds a charge stop (−1 happiness a commute week).
- Balance: saves money for planners with a house; poor fit for long winter commutes, so it isn't a free win.

### i14-a08 A charger comes to Main Street (S, 🟠)
A town council vote on putting a fast charger by the park. Vote yes, no, or push for it if you're on council; if it goes in, EV drivers get faster trips and a little foot traffic helps Main Street.
- A once-a-life event in js/events.js; S.townCharger flag read by the EV range rule.
- Council members get a community choice (pairs with Run for town council).
- Balance: small effects, mostly flavor for EV players.

### i14-a09 Bike to Dayton in good weather (M, 🟠)
Buy a bike. From April to October a Dayton or Waitsburg worker can ride to work: no gas, more health, but rain weeks are miserable and the 11 miles each way is tiring.
- S.bike in js/state.js; a "Ride the bike" toggle next to carpool on the job card (js/ui.js).
- In js/turn.js bike weeks set gas to 0 for the commute, +1 health, −0.5 happiness on rainy weeks (curMonth based).
- Turns itself off from November to March.
- Balance: modest savings, needs health above 40; careless players who never toggle it lose nothing.

### i14-a10 Walk to work on Main Street (S, 🟠)
Players with a job in Waitsburg can walk instead of driving the block. A walking streak gives small health and community gains and a badge at 26 weeks.
- A new badge in BADGES (js/features.js) and a streak count in js/turn.js for Waitsburg jobs.
- Breaks on a "drove to work" week (bad weather event or toggle off).
- Balance: tiny effects; rewards a choice, not idling.

### i14-a11 A bike for the kids (S, 🟡)
A kid of 6–12 asks for a bike for their birthday. Buy new, find a used one at a yard sale, or say no; a bike kid shows up riding in the Celebration Days parade.
- A family event in js/events.js using kidsAtHome() and kid ages.
- A flag lets Celebration Days add a line about the bike parade.
- Balance: small money and happiness trade.

### i14-a12 Driver's ed and the learner's permit (M, 🔴)
At 15 a kid asks to start driver's ed. Pay for the course, teach them yourself on the gravel roads, or wait; the license test is a Walla Walla trip stop at 16.
- A chain in STORY_EVENTS (js/features.js) with steps: permit, practice weeks, test day.
- Teaching them yourself costs Rest weeks but is free; skipping the course raises later teen crash odds.
- The test is a STOPS entry gated by a chain step.
- Balance: no score gain for ignoring it; teens without a license ask you for rides (small happiness cost).

### i14-a13 The teen's first fender bender (S, 🟠)
A licensed teen bumps a car in the Walla Walla school lot. Pay out of pocket, file a claim and pay more insurance later, or have them work it off at a summer job.
- An event in js/events.js gated on a licensed teen (from the driver's ed chain).
- Odds lower if they took the course.
- Balance: a one-time cost that careful parents shrink.

### i14-a14 Renew your license every eight years (S, 🟡)
Every eight years the license needs renewing. Do it online for a small fee, or it comes up as a Walla Walla trip stop after 70 when you need a vision test.
- A yearly check in js/turn.js like the tabs line; a STOPS entry for the vision test.
- Driving on an expired license makes Speeding ticket costlier.
- Balance: cheap and easy; a reminder, not a trap.

### i14-a15 The pump price on the Home tab (S, 🔴)
Gas prices move with the seasons: a bit higher in summer, lower in winter, plus the spikes. The Home tab shows "Gas at the station this week" so commute choices make sense.
- A seasonal multiplier on GAS in one place (cost() path in js/state.js), shown in the week summary (js/ui.js).
- The Gas prices spike event sets a few weeks of higher price instead of a one-time hit.
- Balance: the yearly average stays the same, so the sim targets hold.

### i14-a16 The ride board at the grocery store (M, 🟠)
A corkboard where neighbors post rides for errands and trips. Offer a seat on your trip to split gas, or ride along with someone going to Walla Walla when your truck is in the shop.
- A ride-board card on the Out and about screen (js/outabout.js) built from regulars.
- Offering a seat on planTrip() halves trip gas and adds community +1; riding along means you can't pick the stops.
- Needs community 25+.
- Balance: savings are small and tied to community, which careless play lets slide.

### i14-a17 Help a neighbor move with your pickup (S, 🟠)
Pickup owners get asked to haul a couch across town. Say yes for community and a pizza, or say no; the old 1998 pickup might not make it.
- An event in js/events.js only for beater or truck owners.
- Beater has a small breakdown chance during the haul (careMult).
- Balance: community for a little time; no money gain.

### i14-a18 A winter kit in the trunk (S, 🔴)
For a small cost, put a blanket, shovel, sand and jumper cables in the trunk. If you slide off or get stuck in the snow, it turns a long cold wait into a short one.
- S.kit flag; a new Out and about buy in js/outabout.js or a car STOPS entry.
- Halves the health and happiness hit in Snow on Highway 12 and Fog events (js/events.js); money cost unchanged.
- Balance: cheap protection that only planners buy; doesn't stack into a profit.

### i14-a19 Highway 12 is closed (S, 🟠)
A blizzard shuts the highway for two days. Remote workers barely notice; everyone else loses a day's pay or tries the long way around.
- A winter event in js/events.js (Dec–Feb, commuters only).
- Choices: stay home (−pay for a day), try the long way (gas, ditch roll with ditchMult), or help the plow crew (community).
- Balance: a small setback shared by all play styles.

### i14-a20 Shovel out the neighbor's car (S, 🟡)
After a big snow, the older couple next door is snowed in. Shovel them out for community and a plate of cookies, or stay warm inside.
- A short event in js/events.js, Dec–Feb, health 30+.
- A small health cost; community +3.
- Balance: tiny; adds winter texture.

### i14-a21 Palouse Falls and Lyons Ferry on a summer Saturday (S, 🟠)
A long day-trip drive north to the falls and the river park. Gas and a day off the week, but a big happiness lift and a photo for the Journal.
- A new destination in CITIES or a special trip in js/features.js (no stops beyond the park).
- Once a season limit (stopLast).
- Balance: costs gas and gives only happiness; capped so spamming it doesn't pay.

### i14-a22 Wrong turn on a gravel road (S, 🟡)
A shortcut through the wheat turns into a washboard road. Turn back, push on and find a view of the Blues, or get a flat in the middle of nowhere.
- A road event in js/events.js for commuters and trip weeks.
- Uses ditchMult for the flat roll; a good outcome adds a Journal line.
- Balance: small and mixed.

### i14-a23 What happens while your truck is in the shop (S, 🔴)
A breakdown now leaves you without a ride for a week. Borrow a neighbor's car, rent one in Walla Walla, ride with a coworker, or stay home without pay.
- A follow-up choice in the Truck trouble event (js/events.js); S.carDown for the week in js/turn.js.
- Borrowing needs community 35+; renting costs money; carpool riders lose nothing.
- Balance: makes skipped car care hurt a bit more than money alone, which helps keep careless scores in check.

### i14-a24 Pick your loan: 3, 5 or 7 years (S, 🟠)
When you finance a pickup, choose a shorter loan with bigger payments or a longer one that costs more in the end. The sheet shows the total you'll pay.
- A loan picker in buyCar() (js/ui.js); S.loanLeft and S.loanPay already exist.
- Longer loans add interest (total about +8% at 5 years, +15% at 7).
- Balance: careless picks the long loan and pays more over a life.

### i14-a25 Name your truck (S, 🟡)
Give your ride a name. It shows on the Life tab and in events ("Old Blue wouldn't start"), and the name stays with it if you hand it down.
- S.carName in js/state.js; a rename button on the Ride card (js/ui.js); event text in js/events.js uses it.
- Balance: no effect on score.

### i14-a26 One car or two (M, 🟠)
With a working partner, a one-car house means juggling rides every week. Buy a second used car, carpool together if you work in the same town, or live with the juggle.
- S.car2 in js/state.js; a second row on the Ride card; gas and tabs in js/turn.js add the second car.
- Without one: −0.6 happiness a week when both work in different towns.
- Balance: a real cost either way; good play picks the cheaper fix.

### i14-a27 Someone took the catalytic converter (S, 🟡)
Your truck roars like a tractor after a night parked in a Walla Walla lot. Pay to replace it, or drive loud for a while and get a ticket.
- A rare event in js/events.js for trip and commute weeks to Walla Walla or the Tri-Cities.
- Pickups only; the beater is safe (nobody wants it).
- Balance: rare, a money hit only.

### i14-a28 Retire the old beater: scrap it or give it to the school shop (S, 🟠)
When the 1998 pickup is worth almost nothing, sell it for scrap or give it to the high school auto shop for a tax write-off and some community.
- A button on the Ride card in js/ui.js when S.car is beater and you're buying another ride.
- Donation: +community and a small tax refund line in January.
- Balance: a small trade between cash and community.

### i14-a29 A recall notice in the mail (S, 🟠)
The maker recalls part of your ride. Get it fixed free at a Kennewick or Pasco dealer on a trip, or put it off and risk a breakdown.
- An event in js/events.js that sets S.recall; a free STOPS entry clears it.
- An open recall doubles breakdown odds until fixed.
- Balance: free for planners, costly for careless play.

### i14-a30 A rock chip in the windshield (S, 🟡)
A gravel truck flicks a rock. Fix the chip now for a little, or wait and maybe pay for a whole new windshield when it cracks across in the cold.
- An event in js/events.js; waiting sets S.chip and a winter roll in js/turn.js.
- Balance: small; rewards fixing things early.

### i14-a31 Pack a cooler for trips (S, 🟠)
Before a trip, pack lunch from home. The trip costs less than eating out and gives a little happiness, but you skip the restaurant stop.
- A checkbox in tripSheet() (js/features.js) that removes eat stops and adds +1 happiness.
- Balance: a choice between money and the bigger eat-out lift.

### i14-a32 Jump-start a stranger in the Kennewick lot (S, 🟡)
Someone's battery is dead in the mall parking lot. Use your cables if you have the winter kit, or point them to the parts store.
- A trip event in js/events.js; the kit choice gives community and a thank-you line.
- Balance: tiny; ties the winter kit to more than snow.

### i14-a33 Tractors and combines on the road (M, 🟠)
Farm hands and wheat-lease owners drive farm equipment on the highway at harvest. A slow-moving tractor week adds a road event and pays a little extra.
- Job tag check (farmhand, wheat biz) in js/events.js; a harvest event with choices to pull over or push on.
- Pairs with Stuck behind a wheat truck, from the other side.
- Balance: small flavor; no gain for idle play.

## Ideas 14: Friends and social life

A circle of friends beyond the partner and neighbors: invites, leagues, regulars, falling out and making up, dating as a single adult, being new in town, and how you recharge.

### i14-b01 Your crew: one friendship meter for your circle (M, 🔴)
A 'Your crew' line on the Life tab shows how close you are with your circle of friends (0–100). Social stops, the jam and invites raise it; it fades a little each week you don't see anyone.
- A light stand-in for the full NPC engine (#42): one number, not a cast of people.
- New S.crew in state.js fresh state with a save migration; bumps in outabout.js acts (fx.crew) and new events; weekly fade in turn.js.
- High crew adds a small weekly happiness lift (like the partner's +0.6) and unlocks the invites below.
- Balance: it fades, so idle play drops to zero; social stops cost money, so careless spending can't buy it fast (cap +3 a week).

### i14-b02 Saturday invites from the group text (S, 🔴)
Some weeks a short group-text card asks 'River float Saturday?' or 'Burgers at ours?'. Say yes for a small cost and a crew lift, or pass.
- A one-tap invite card in events.js, cat 'social', only when crew is 20+.
- Text names the real place: Preston Park, the Touchet, the fairgrounds.
- Balance: each yes costs $10–30 and a little rest; idle never sees them because crew stays low.

### i14-b03 Say no too often and the invites stop (S, 🔴)
Pass on three invites in a row and the group stops asking for a while. One 'Sorry, I owe you one' card lets you get back in.
- Counter S.r.invNo in events.js; invites pause 8 weeks after three passes.
- The comeback card costs a pizza ($25) and brings crew back to where it was.
- Balance: you can't bank the benefits while skipping the costs; makes careless 'always pass' play lose its edge.

### i14-b04 Game night, and your turn to host (S, 🟠)
Once a month friends rotate game night: board games, cards and chips. Every fourth month it's at your place, and hosting costs snacks but counts double.
- A monthly event in events.js with a host counter in S.r.gameNight.
- Renters in the room above Main Street can host 'at the park pavilion' instead.
- Balance: small happiness and crew gains; skipping your hosting turn costs crew.

### i14-b05 A winter bowling league in Walla Walla (M, 🟠)
Join a Tuesday-night team at a stand-in Walla Walla lanes from October to March. A small league card tracks your team's wins and ends with a banquet.
- A season chain in features.js (chainSet 'bowl'); weekly gas uses the existing commuteCost to Walla Walla.
- Each week rolls a team result; a good season gives a badge and a trophy line in the Journal.
- Balance: weekly fee plus gas; gives crew and happiness but no money, so it can't lift a careless score by itself.

### i14-b06 Becoming a regular at the ale house (S, 🟠)
After ten visits to Laughing Lad Ale House you're a regular: your name goes on a mug on the wall, the pint costs a bit less and the regulars pass on news.
- Count visits to the 'lad' place in outabout.js; at 10, a one-time card and a 🍺 badge.
- Regular status adds a small chance of a job tip (reuses 'A tip from a friend').
- Balance: visits still cost money and happiness gains have the usual repeat fade; 21+ only.

### i14-b07 The regulars' table: who's at the bar tonight (S, 🟡)
Once you're a regular, an ale house visit shows one line from a stand-in regular: the retired wheat farmer, the young teacher, the trucker home for the weekend.
- A small text pool in outabout.js keyed to season and your job.
- Some lines carry a hint (a used truck for sale, a cheap rental).
- Balance: flavor only, no extra stats.

### i14-b08 Fantasy football at the sports bar (M, 🟡)
In September, friends start a fantasy league at Bourbon Gulch Sports Bar: a $20 buy-in, a weekly 'start or sit' tap and a winner in December.
- An autumn chain in features.js; one tap a week from a small card, or Auto picks for you.
- Results are dice plus a small boost if you tapped; the winner takes the pot.
- Balance: the pot is small ($100); mostly bragging rights and crew. Auto play gets average results, not better.

### i14-b09 Cards with the old-timers: cribbage at the café (S, 🟡)
Mornings at Howlin' Bean, a few old-timers play cribbage. Sit in and learn; after a few weeks you can hold your own.
- A new act on the 'bean' place in outabout.js, mornings only; best for retirees and remote workers.
- A tiny skill (cards 0–3) gives a slow happiness lift and old-timer stories about the town.
- Balance: free but uses the week's visit; no money effect.

### i14-b10 The yearly group trip: who books it? (M, 🔴)
Each spring friends plan a long weekend: the coast, Lake Chelan or Coeur d'Alene. You can be the planner (more work, more thanks), just chip in, or skip it.
- An event chain in features.js that reuses the trip and stops code; cost is split by how many go.
- Planner choice costs a week of stress but gives a big crew bump; needs PTO if working.
- Balance: costs $300–600; careless players who go every year without savings see the bill hit.

### i14-b11 A falling out, and making up (M, 🔴)
Sometimes a friendship cracks: a borrowed truck comes back dented, or a council vote splits the table. Over the next weeks you can apologize, wait, or let a mutual friend help.
- A three-step chain in features.js: the fight, a chance meeting at Burg Basket Grocery, then a make-up or a lasting chill.
- A lasting chill lowers crew and blocks that friend's invites for a year.
- Balance: making up costs a little pride (happiness) and time; ignoring it is cheaper short-term but loses crew.

### i14-b12 Make up at Celebration Days (S, 🟠)
If you have a falling out open in May, Celebration Days offers one more chance: share a funnel cake on the parade route and patch it up.
- A festival-week card in events.js gated on the falling-out chain step.
- Works with the existing Celebration Days event and the Tonnage festival opening.
- Balance: only once per falling out; the town mood of the festival gives slightly better odds.

### i14-b13 Lending money to a friend (S, 🟠)
A friend asks to borrow $300 for rent. Lend it, lend part, or say no. Later they pay you back, pay part, or it quietly never comes up again.
- A two-step chain in features.js; payback odds rise with crew and with how long you've known them.
- The Journal records it; a 'never repaid' result lowers happiness a little but not crew.
- Balance: a real money risk with a social upside; teaches lending only what you can lose.

### i14-b14 A friend needs your couch (M, 🟡)
After a breakup, a friend asks to stay a few weeks. They help with dishes and the yard, but the house is crowded and the weeks drag if it runs long.
- A chain in features.js lasting 3–8 weeks; renters of the room above Main Street can't say yes.
- Each week a small happiness cost and a crew gain; a send-off card when they find a place.
- Balance: costs groceries and some happiness; the crew payoff is real but slow.

### i14-b15 Small-town dating: everyone knows by Monday (M, 🔴)
Single and 19+, you can try dating on purpose. A first date on Main Street means the whole town hears about it; a date in Walla Walla keeps it quiet but costs gas.
- Replaces part of the 'Someone catches your eye' coin flip with a short choice chain in events.js.
- In-town dates give community but a bad date follows you (an awkward week at the grocery).
- Balance: dates cost money; success odds rise with happiness and health, not cash, so careless play doesn't win it.

### i14-b16 A dating app with a 60-mile radius (M, 🟠)
Pay a small monthly fee and matches show up from Dayton to Pasco. A match in the Tri-Cities means long drives on US-12 if it turns serious.
- A Life-tab toggle with a monthly cost in turn.js; matches come as cards with a town and drive time.
- Dating someone far away adds weekly gas until one of you moves.
- Balance: the fee runs every month; idle players pay and get matches they never meet.

### i14-b17 Friends set you up on a blind date (S, 🟡)
With crew 40+ and no partner, friends set you up: dinner at The Little Kiss Pasta Bar with someone's cousin. It goes well, it goes fine, or it's a great story.
- An event in events.js; the 'great story' result still gives crew (everyone laughs about it).
- A good result starts dating like the existing event.
- Balance: one card a year at most; dinner cost applies.

### i14-b18 Running into your ex at the grocery (S, 🟡)
After a breakup in a small town, you'll see your ex around: at the grocery, at the jam, at the ballgame. The first few times sting, and then they don't.
- A short-lived event pool in events.js for 26 weeks after S.partner goes false.
- Choices: wave and move on, chat, or shop in Dayton for a while (costs gas).
- Balance: small happiness hits that fade; no long-term penalty.

### i14-b19 Being new in town: from stranger to local (M, 🔴)
Newcomers (the Seattle transplant, or anyone who moves to Waitsburg) start as 'new in town'. Small milestones mark the way: the first wave back from a pickup, a saved seat at the ballgame, the first invite to a porch.
- A newcomer track in features.js with five steps shown on the Life tab; steps come from community, crew and visits.
- Finishing it gives a 'Local now' badge and lifts the transplant's lonely start.
- Balance: needs steady showing up over months; skipping or idle leaves you 'new' and a little less happy.

### i14-b20 The two-finger steering-wheel wave (S, 🟡)
Once your community is 30+, the commute line now and then says a farmer waved two fingers off the wheel. Before that, nobody waves.
- One line in the week strip from turn.js, keyed to community and a long commute.
- Pure flavor that shows progress for newcomers.
- Balance: no stats.

### i14-b21 Who are your people? The first question you get (S, 🟡)
New players hear 'So who are your people?' at the café. Answer with a family name (Farm kid), 'nobody yet' (transplant) or a job, and the town treats you a little differently at first.
- A first-month card in events.js tied to the starting background in state.js.
- 'Nobody yet' gets a small crew boost from the curious; family names start with more community.
- Balance: tiny one-time effects matching existing backgrounds.

### i14-b22 Social battery: introvert or extrovert as a play style (L, 🟠)
Pick how you recharge at the start: alone or with people. Introverts gain more from Rest and Get outside but drain on back-to-back social weeks; extroverts get more from town and fade when alone.
- A choice on the new-game screen in ui.js; a hidden battery in S.r that fills and drains by focus and visit kind in turn.js.
- Shown as a small 🔋 on Home with a plain hint ('You need a quiet week').
- Different from i10-a02 traits: this is a meter that moves every week, not a fixed bonus.
- Balance: both styles score the same over a good game; ignoring the battery hurts either one, so careless play doesn't gain.

### i14-b23 Quiet ways to belong (S, 🟠)
For introverts, a few low-key ways to build crew without crowds: a walk with one friend, lending a tool, a long phone call on Sunday.
- New small acts and one-tap cards in events.js that raise crew by 1–2 without draining the social battery.
- Lets a homebody style still reach good play.
- Balance: smaller gains than big social weeks, so it's a style, not a shortcut.

### i14-b24 You're the subject of the gossip (M, 🟠)
Now and then a rumor about you goes around: you're moving, you got fired, you're seeing someone. Set it straight at the café, laugh it off, or let it ride.
- An event in events.js with true or false rumors built from your real state (job, partner, home).
- Letting a false rumor ride can cost a job tip or an invite; setting it straight takes a café visit.
- Balance: small community swings; different from i4-a32, where you hear gossip about others.

### i14-b25 A friend tells you a secret (S, 🟡)
A friend confides something big: a pregnancy, a job hunt, a sick parent. Weeks later, someone fishes for it at the bar. Keep it, or let it slip.
- A two-step chain in features.js.
- Keeping it deepens crew; letting it slip gives a small community bump (you're 'in the know') and a falling out later.
- Balance: the short-term gain leads to a bigger loss.

### i14-b26 The jam regulars' potluck (S, 🟠)
After six jams, the regulars invite you to the spring potluck at Tonnage Coffee & Strings: a covered dish, a birthday song for the oldest player and a group photo for your Journal.
- A once-a-year card in outabout.js keyed to jam visit count.
- Gives crew and community; listeners count, not just players (separate from i11-a21).
- Balance: needs regular jam visits, which cost a few dollars and a visit each time.

### i14-b27 Carpool to a bluegrass festival (S, 🟡)
Jam regulars head to a summer bluegrass festival a few hours away. Split a car, camp two nights and come home sunburned and happy.
- A July event in outabout.js for jam regulars; reuses the trip cost code with a shared-gas discount.
- Needs a free weekend (PTO if your job has weekend shifts).
- Balance: $150 and a tired week; only for players who built the jam habit.

### i14-b28 Celebration Days: who's back in town (S, 🟠)
Folks who moved away come home for Celebration Days. A festival card lists who you ran into on Main Street, and long-time players see old friends from earlier years.
- A festival-week line in events.js using crew and how many years you've lived here.
- Ties to i13-b14 Celebration Days through the years by adding names to the memory list.
- Balance: flavor plus a small crew lift; needs a festival-week visit.

### i14-b29 The street dance after the parade (S, 🟡)
Saturday night of Celebration Days there's a street dance on Main Street. Dance with your partner, ask someone new, or watch from the curb with friends.
- A festival choice in events.js; singles who ask someone get a small chance to start dating.
- Couples get a happiness bump; friends on the curb raise crew.
- Balance: one night a year, small cost, no money gain.

### i14-b30 Friendsgiving for the folks with nowhere to go (S, 🟠)
In November, singles, transplants and anyone whose family is far away get together. Host it, bring a dish, or spend the holiday alone.
- A November event in events.js for players without kids at home or far from family.
- Hosting costs more but gives a big crew lift; alone costs happiness.
- Balance: one card a year; the cost is set by what you choose.

### i14-b31 Friends drift as life changes (M, 🟡)
When you have kids, move away or retire, some friends drift. A short card says the crew has changed, and a new circle starts to form (other parents, other retirees).
- Life-stage hooks in features.js that drop crew by a third and change invite text.
- New invite types per stage: playdates at Preston Park, morning coffee for retirees.
- Balance: keeps crew from being a one-time build; good play keeps tending it.

### i14-b32 After-shift beers with coworkers (S, 🟡)
Commuters to the Tri-Cities get asked out after shift. Go and you're home late on US-12; skip and you're the one who never comes.
- A work-category event in events.js for long commutes; going raises boss and crew standing.
- Going late adds a small health cost and a 'tired on the drive' line.
- Balance: trades health for social; long commuters already pay for distance.

### i14-b33 Elk camp with the crew (S, 🟡)
Each fall friends set up an elk camp in the Blue Mountains. Haul the wall tent, cook over the fire, and maybe someone fills a tag.
- An October event in events.js, needs a hunting license if i1-a10 exists, else just camping.
- Gives crew, happiness and health; a filled tag adds to the freezer if i10-a20 exists.
- Balance: costs a week and $100 in gear and food; no money gain.

### i14-b34 A surprise party for a friend's 40th (S, 🟡)
The crew plans a surprise for a friend turning 40 at the fairgrounds pavilion. Help plan, chip in, or just show up. Don't spill the secret.
- A two-step chain in features.js; a small chance it gets spoiled if you chose the gossip path before.
- Helping plan gives the biggest crew lift.
- Balance: costs $40–80; one a few years.

### i14-b35 Who shows up: friends at your send-off (S, 🟠)
At retirement or the end of a life, the ending screen lists who came: a few lines for a high crew ('the whole bowling team'), and an honest quiet line for a low one.
- Adds a block to the ending screen in ui.js using crew and the chains you finished.
- Separate from i9-a26 goodbye visits: this is a summary, not new events.
- Balance: no score change; shows the value of the social side.
