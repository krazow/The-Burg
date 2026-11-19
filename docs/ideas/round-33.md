# Ideas round 33

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 33: The Tri-Cities up close

Ideas that make Pasco, Kennewick and Richland feel like real places you work, shop and play, and that make the long drive from Waitsburg part of the story.

### i33-a01 Tri-Cities close-up map (L, 🔴)
Tapping Pasco, Kennewick or Richland on the region map opens one close-up map of all three cities: the Columbia and Snake meeting, the three bridges, Columbia Park, the mall, downtown Pasco, the airport, Badger Mountain and the road north to Hanford.
- A third close-up map built like townSVG/townPlaces in js/maps.js, drawn for the Tri-Cities (stand-in names only), with the real river shapes from GEO_RIVERS reused at a closer zoom.
- Opens from the three Tri-Cities pins in regionDetail and from the trip sheet header.
- Road events already tagged 'R' to pasco, kennewick or richland in js/events.js show their badge on the matching spot.
- Balance: a view only, so careless and idle play gain nothing.

### i33-a02 Every Tri-Cities stop and your workplace get a pin (S, 🔴)
Each Tri-Cities stop in the trip list gets a spot on the close-up map, and tapping one adds it to this week's trip. If you work there, your job's building (the site, the lab, the rail yard, the airport, the plant, the hospital) gets a briefcase pin where your commute truck ends.
- Add x,y for the Tri-Cities to STOPS in js/features.js; map job ids (hanford, scientist, labadmin, rail, airport, foodplant, trucker, retail, mech, imaging, loan) to places in js/maps.js.
- Tapping a pin uses the same add-stop path as the trip sheet, so tripMax() and stopBlocked() still apply.
- Balance: display and a faster way to plan; no new effects.

### i33-a03 One trip, three cities: hop the bridges (M, 🔴)
A Tri-Cities trip can mix stops from Pasco, Kennewick and Richland, since they sit a bridge apart. Each extra city adds a few dollars of gas for the hop.
- planTrip in js/features.js accepts stops from any of the three when the trip city is a Tri-Cities town; tripWeek adds a 'bridge hop' gas line per extra city (about 8 miles).
- Still capped at TRIP_MAX stops and TRIP_TIME, and the REPEAT_WEEKS fade still applies.
- Balance: more choice, not more stops, so it cannot raise the weekly payout ceiling.

### i33-a04 A bridge closed for deck work (S, 🟠)
Every few years one of the Columbia bridges closes a lane for repairs for about two months. Kennewick and Pasco commuters lose a little time and gas each week, or pay for a detour that avoids it.
- New 'road' event in js/events.js for kennewick and pasco commuters; sets S.bridgeWork to a turn count read by the gas line in js/turn.js (commuteGasFactor).
- Choices: sit in it (small happiness drain) or take the far bridge (a bit more gas).
- Shows as a cone icon on the bridge in the close-up map.
- Balance: a small cost only commuters feel; no upside to farm.

### i33-a05 Badger Mountain sunrise hike (S, 🔴)
A new Richland stop: hike the hill above town before the heat, with the three cities and the rivers below. Free, good for health, and best in spring and fall.
- New STOPS entry (kind 'do', towns ['richland'], cost 0, fx {health:3, happy:3}) with when:inSeason(2,3,4,5,8,9,10).
- In July and August its note warns it's a 6 a.m. hike or nothing, and it gives less.
- Balance: TRIP_TIME and gas still apply, and REPEAT_WEEKS halves a weekly repeat.

### i33-a06 Bike the river loop through all three cities (S, 🟠)
A paved trail runs along both sides of the Columbia and links all three cities. Ride a stretch for health and a long look at the river. Needs a bike or a rental.
- New Tri-Cities stop (towns ['kennewick','richland','pasco']), cost $0 with your own bike or $25 to rent, fx {health:4, happy:2}, April to October.
- If a bike item from earlier rounds exists, read it; otherwise the rental price shows.
- Balance: same trip-time cost as any stop; health gain is modest.

### i33-a07 Rent a paddleboard at the Columbia Park marina (S, 🟡)
A summer stop: rent a paddleboard or a kayak for an afternoon on the slow water by the park. Cool water on a hot day.
- New STOPS entry in js/features.js, Kennewick, June to September, $35, fx {happy:4, health:2}; date:true so it doubles with a partner.
- One-in-ten tip-over gives a funny Journal line, no cost.
- Balance: a priced fun stop like the others; no new stat.

### i33-a08 Fall chinook on the Hanford Reach (M, 🟠)
In September and October the salmon run up the last free-flowing stretch of the Columbia. Fish from the bank for the price of a license, or split a guide boat with friends.
- A seasonal Richland stop and a once-a-year 'road' event for outdoorsy players; uses the fishing license if one exists, or charges a short-season license.
- Bank: small happiness, low odds of a fish. Guide boat: $150, better odds, a freezer of salmon that trims food costs for 4 weeks (like STOCK_OFF, smaller).
- Balance: the food saving is less than the boat price, so it's for fun, not profit.

### i33-a09 Jet-boat tour to the White Bluffs (S, 🟡)
A Richland stop: a jet boat runs up the Reach past the old reactors, the bluffs and the eagles. Pricey and a once-in-a-while thing.
- New STOPS entry, towns ['richland'], May to October, $65, fx {happy:6}; counts a week of class work if studying, like the Hanford history tour event.
- The REPEAT_WEEKS fade plus the price keep it rare.
- Balance: high cost per point of happiness.

### i33-a10 Junior hockey nights at the arena (S, 🟠)
From fall to spring a stand-in junior hockey club plays at the Kennewick arena. Cheaper than a concert, loud, and better with friends or kids.
- New STOPS entry (Kennewick, September to March, $22, fx {happy:4, community:1}) beside the existing arena show stop.
- A playoff-week Journal line in March if you went three or more times that season.
- Balance: same rules as other priced stops; the community point is small.

### i33-a11 A ticket pack for the ballpark or the rink (M, 🟡)
Buy a 10-game pack for minor-league baseball in Pasco or junior hockey in Kennewick. Each game you pick on a trip costs nothing extra, and the pack shows how many are left.
- S.tixPack {kind, left, season}; stopCost in js/features.js returns 0 for the matching stop while left > 0; a small line on the trip sheet.
- Unused games are lost at season's end.
- Balance: the pack costs about 8 single games, so it only pays if you really go; gas and trip time still apply.

### i33-a12 Kids run the bases after the Sunday ballgame (S, 🟡)
With kids aged 4 to 12, a Pasco ballgame on a summer Sunday ends with them running the bases. A little extra happiness for you and a Journal line about the kid.
- Extra branch in the baseball stop's effect in tripWeek when S.kids has a child in range and it's June to August.
- Adds a tiny kid-happiness bump if kids have their own mood stat.
- Balance: a small add-on to an existing paid stop.

### i33-a13 Hydro race week jams up the whole Tri-Cities (S, 🟠)
The week of the hydroplane races, everything near the river is packed: Columbia Park picnics are closed, traffic crawls, and Kennewick commuters lose time getting home.
- When the existing hydroplane event fires (July), set S.raceWeek; the park stop shows 'Closed for race week', and kennewick/richland commuters get a small happiness drain.
- The close-up map shows boats and a crowd on the river that week.
- Balance: pure friction around an existing upside event; no new payout.

### i33-a14 Shopping the downtown Pasco market blocks (S, 🔴)
A new Pasco stop: walk the downtown blocks of bakeries, butcher shops and produce stands, with Spanish on every sign. Pan dulce for the ride home and a meat order that trims groceries for two weeks.
- New STOPS entry (kind 'errand', towns ['pasco'], cost $20, fx {happy:3, community:1}) plus a 2-week, 10% food discount using the same path as the stock-up run (smaller and shorter).
- If the Spanish skill (i12-a19) is built, it grows a little here.
- Balance: the discount is smaller than gas from Waitsburg unless you commute to Pasco.

### i33-a15 Pick up family at the Pasco airport (S, 🟠)
A parent or sibling flies in for a visit, landing at 11 p.m. Make the late drive to Pasco and back, or have them rent a car and arrive in a mood.
- New 'road' event in js/events.js for players with family; gas uses tripGas('pasco') (free if you commute there).
- Drive: community +2, happiness +2, a tired next week (small health dip). Rental: they pay, happiness -1.
- Balance: a real trade between time and goodwill.

### i33-a16 De-icing nights for the airport ground crew (S, 🟡)
For airport ground crew, winter brings 4 a.m. de-icing shifts in the cold. Pick up the extra nights for pay, or keep your days.
- Work event for jobId 'airport' in December to February in js/events.js.
- Take them: +10% pay that month, health -2. Pass: nothing.
- Balance: trades health for money at the same rate as Work extra hours, so it isn't a free bonus.

### i33-a17 Potato season at the food plant (S, 🟠)
From fall into winter the frozen-potato lines run full tilt. Food plant workers get offered six-day weeks for a month: good money, a tired body.
- Once a year in October for jobId 'foodplant'; sets a 4-week overtime flag read by the pay line in js/turn.js.
- Overtime: +20% pay for 4 weeks, health and happiness drain like Work extra hours. Decline: a small boss note.
- Balance: same rate as the existing work-extra focus, so careless play gains nothing new.

### i33-a18 Hanford's first week: badging, training and a dosimeter (S, 🟠)
Starting a Hanford job takes a week of badging, safety classes and getting your dosimeter before you see the site. A short scene sets the tone of the job.
- One-time event on the first turn of jobId 'hanford' in js/events.js; text only, with a choice of how you take it (ask questions: tiny boost to the first review; coast: nothing).
- Pairs with i3-a12 clearance if that's built.
- Balance: flavor; the boost is small and one-time.

### i33-a19 A yearly site physical for Hanford workers (S, 🟠)
Hanford workers get a free medical check each year as part of the job. It works like a doctor checkup without the trip or the bill.
- Once a year for jobId 'hanford', apply the checkup stop's health effect (fx health +6 scaled when health is low) at no cost, with a Journal line.
- Offsets part of the job's high wear (1.1), which the docs say makes the job harsh.
- Balance: only for one job, and it keeps the job's health drain above average.

### i33-a20 Hanford's budget year: news every fall (M, 🟠)
Each October the cleanup budget comes out of Congress. A good year means steady overtime; a lean year means a few unpaid furlough weeks. Hanford and lab workers see it coming on a news card.
- Yearly roll in October for hanford, labadmin and scientist jobs in js/events.js; S.siteBudget lasts 12 months and adjusts pay in js/turn.js (good +5%, lean: 2 unpaid weeks spread out).
- A savings cushion on Home helps you ride it out.
- Balance: average effect is about zero, so it adds swing to the top-paying jobs without raising their mean.

### i33-a21 Four tens: a long-day schedule with Fridays off (M, 🔴)
Hanford and the lab offer four 10-hour days. You drive US-12 four times a week instead of five, saving gas and getting a three-day weekend, but each day runs long.
- A toggle on the job card for hanford, labadmin and scientist; driveDays() in js/turn.js returns 4, and the commute happiness drain per day goes up 20%.
- A Friday off gives a small bump to Rest and Get outside focus that week.
- Balance: saves about 20% of commute gas; the per-day drain keeps it from being a free win.

### i33-a22 A sour smell near the tank farms (S, 🟡)
A coworker swears they smelled vapors on shift. Report it and get checked, or shrug it off to keep the line moving.
- Work event for jobId 'hanford' in js/events.js.
- Report: lose a shift's pay for the medical check, health +1, community +1 with the crew. Shrug: 10% chance of a health -4 cough that lingers 4 weeks.
- Balance: the careful choice is mildly better, so careless play doesn't gain.

### i33-a23 Proposal season at the national lab (S, 🟠)
Each spring lab staff race to write funding proposals. Stay late for weeks for a shot at a bigger project and a raise, or write the safe one.
- Work event in March for scientist and labadmin jobs.
- Push: happiness -3 over the month, 40% chance of a 4% raise. Safe: nothing changes.
- Balance: a gamble on stress, about break-even on average.

### i33-a24 A summer internship at the national lab (M, 🟠)
Students working toward a bachelor's can spend a summer as a lab intern in Richland: modest pay, a long drive, and a real leg up on the lab scientist job later.
- Offered in April when S.edu >= 2 and studying; a 12-week summer job that replaces pay with intern pay and counts class weeks at half speed.
- Afterward, the scientist job gets an apply bonus (like applyBoost) for 2 years.
- Balance: costs money now for a later career payoff; idle play never qualifies.

### i33-a25 Judge the regional science fair (S, 🟡)
Lab and Hanford workers get asked to judge the spring science fair in Kennewick. Give a Saturday for a bit of community and one great kid's volcano.
- Yearly event in March for hanford, labadmin and scientist; costs this week's trip slot (or a small gas line), gives community +2 and happiness +1.
- If you have a kid in school, they can enter too.
- Balance: a small time-for-community trade.

### i33-a26 The Wallula Gap pullout on the long drive (S, 🟠)
Where US-12 meets the Columbia, the river cuts through a gap between basalt walls with two rock spires above it. It becomes a pin on the region map and, once a month, a commute moment: pull over for a minute or keep going.
- Add a LANDMARKS entry near Wallula in js/maps.js with a short desc; a once-a-month commute line in the day notes for Tri-Cities commuters.
- Pull over: happiness +1, a few minutes late home. Keep going: nothing.
- Balance: tiny effect, mostly place and mood.

### i33-a27 Winter fog along the Wallula stretch (S, 🟠)
November to February, thick valley fog sits on the highway between Wallula and Pasco. Slow down and get to work late, or keep your speed and take a chance.
- New 'road' event for Tri-Cities commuters in js/events.js.
- Crawl: happiness -1, 5% chance of a docked late shift. Push it: 8% chance of a fender-bender (like the dust storm).
- Balance: careful driving is mildly safer; winter tires don't help with fog, so it's its own risk.

### i33-a28 Spring tumbleweeds on the highway (S, 🟡)
On a windy April day, a wall of tumbleweeds rolls across the road and piles up at the fence lines. Drive through and hope, or wait it out.
- New 'road' event, March to May, for Tri-Cities commuters and trips.
- Drive through: 10% chance of a $90 radiator-grille repair, otherwise a funny line. Wait: happiness -1.
- Balance: small, mostly a laugh about life out here.

### i33-a29 A warehouse club card (M, 🟠)
Pay a yearly fee for a stand-in warehouse club in Kennewick. Your stock-up runs there save more and last longer, if you actually go.
- S.clubCard (turn bought); in tripWeek the 'stock' stop in kennewick uses a bigger STOCK_OFF (0.28) and STOCK_WEEKS 8.
- The card shows 'saved so far' against the fee; a renewal card each year.
- Balance: about $60 a year; it only pays back with four or more runs a year, and B6 shows runs from Waitsburg are already thin.

### i33-a30 Your doctor sends you to a specialist in Kennewick (M, 🟡)
When health stays low, the Walla Walla doctor refers you to a specialist in the Tri-Cities. It's a long drive for one appointment, but it helps more than a regular checkup.
- Triggers after 8 weeks with health under 35; adds a one-time Kennewick 'appt' stop that costs $200 and gives health +10.
- If ignored for 3 months, the referral expires with a nudge.
- Balance: aimed at struggling players, costs real money and a trip.

### i33-a31 The big wooden playground in Columbia Park (S, 🟡)
With young kids, a new Kennewick stop: the huge community-built wooden playground in the park. Cheap, tiring, and the kids talk about it all week.
- New STOPS entry (Kennewick, cost $5 for snacks, fx {happy:3, community:0}), only shown when S.kids has a child aged 2 to 11.
- Shares the April to October season with the picnic stop.
- Balance: same as other cheap stops; REPEAT_WEEKS fade applies.

### i33-a32 The pickup's air quits in July (S, 🟡)
Driving to the Tri-Cities at 105 degrees, the old pickup's air conditioning dies. Fix it for real money, or drive with the windows down all summer.
- Car event for older cars (S.car 'beater' or mileage-heavy) on Tri-Cities commutes in July and August.
- Fix: $650. Windows down: happiness -1 a month until September.
- Balance: a cost tied to the long commute, not to any upside.

## Ideas 33: Waitsburg street by street

The town map past Main Street: the streets you live on, the areas each home sits in, the walks and landmarks locals use, and a map that changes as you play.

### i33-b01 Streets as living data: S.streets (L, 🔴)
Add a small STREETS table in js/maps.js (Main, Preston, Coppei, the river side, the hill, east end, west end, farm roads) with a saved condition and mood per street that events and turns can nudge. Every other idea in this round reads and writes it.
A STREETS table in maps.js: name, area, housing types, walk minutes to Main, and a saved S.streets entry (upkeep 0-100, mood, recent notes).
turn.js drifts each street a little per season; events in events.js can name a street and change it.
Balance: streets only change fx by small amounts (±0.5 happy), so nothing here is a farm for points.

### i33-b02 Your address: every home sits on a real street (S, 🔴)
Each housing type gets a street: the room is above Main, the rental is on a side street off Coppei Ave, the fixer is on the river side, the farmhouse is out a farm road. Home and Life cards show 'Your street' with a one-line feel for it.
Add st to each HOMES entry in state.js; show it on the Home card and in the town map detail.
Pure flavor plus the hook for later street ideas.
Balance: no stat change by itself.

### i33-b03 The Home pin sits where you actually live (S, 🔴)
Move the 🏠 pin on the town map to your street: over Main for the room, near the Touchet for the fixer, out past the edge in the fields for the farmhouse. Moving house moves the pin.
townPlaces() in maps.js reads the home's street for x/y instead of the fixed 78,118.
The farmhouse pin gets a dashed road line back to town.
Balance: visual only.

### i33-b04 Neighborhood areas you can tap on the town map (M, 🔴)
Shade the town map into soft areas (east end, west end, the hill, the river side, farm roads). Tap one for a sheet: what the houses are like, typical rent or price, walk time to Main, flood or fire edge, and what's for sale there now.
New area paths and an AREATAP handler in maps.js; sheet uses STREETS data and HOMES prices.
Helps new players see what each housing choice means before they move.
Balance: information only; it doesn't make any home cheaper.

### i33-b05 Pick the street when you move (M, 🟠)
When you rent or buy, you see two or three listings on different streets with real tradeoffs: cheaper on the Preston Ave side with truck noise, quieter up the hill but icy in January, river side with a levee out back.
Home move flow in ui.js/features.js shows street variants of the same HOMES type, ±10% cost and one street trait each.
Balance: every cheaper listing carries a matching downside, so no street is strictly best.

### i33-b06 Street traits that touch your week (M, 🟠)
Each street has one or two traits: Preston Ave gets harvest trucks and walks to the taproom, Coppei Ave is close to school, the hill has a view and an icy grade, the river side has mosquitoes and the levee. Traits add small, seasonal effects on your weekly report.
STREETS trait list in maps.js; turn.js applies them by season (e.g., -0.5 rest in harvest on Preston, +0.5 outdoors on the river side).
Shown as one line on the weekly report so it never feels hidden.
Balance: effects are tiny and offset each other; idle play can't stack them.

### i33-b07 Preston Avenue: living on the highway (S, 🟡)
If you live on the Preston side, Highway 12 runs past your door. You hear the wheat trucks in July, you can walk to the BBQ and the ale house, and once in a while a lost trucker knocks to ask the way to Dayton.
Two or three Preston-only events in events.js; walk-to-Preston means outabout.js visits there cost no gas.
Balance: free trips are capped by OUT_WEEK_CAP, so it saves a little money, not stats.

### i33-b08 Coppei Avenue: the walk to school (S, 🟡)
Living off Coppei Ave, your kids walk to school past the creek. Some weeks it's a nice moment (they stop for frogs), some it's a worry (a dog loose, ice on the bridge). Older kids can walk on their own.
Kid events in events.js gated on street and kid age; small happy or family-time effects.
Balance: a rare event, no money; it gives family players flavor, not points.

### i33-b09 East end or west end: which side you're from (S, 🟡)
Town folks talk about the east end (toward Dayton) and the west end (out by the elevator and Highway 124). Where you live gives you a side, a few teasing lines at the café, and a line on the end screen: 'An east-ender for 22 years.'
Derived from street area in maps.js; café and Main Street lines in outabout.js pick by side; end screen in ui.js.
Balance: flavor only.

### i33-b10 The river side: high water nights (M, 🟠)
On the river side you watch the Touchet from your back step. In a high-water week you get a choice: sandbag the yard, help the neighbors, or drive to higher ground. Calm years give you fishing from the levee out back.
River-side events in events.js tied to existing flood/high-water weeks; outdoors focus gets +0.5 on the river side in summer.
Balance: the risk shows on the area sheet before you buy, and careless players who ignore the warning pay for it.

### i33-b11 A house up on the hill (M, 🟠)
A new housing choice: an older house up the hill above town, with a view of the elevators and Main Street lights. It costs more than the rental, the grade is icy in winter, and it's a long walk back up from Main.
New HOMES entry in state.js (own, mid down payment); winter car-trouble chance up a bit on icy weeks in turn.js.
Balance: happy bonus between house and farm, paid for with cost and winter risk; tuned so the sim median doesn't move.

### i33-b12 Farm roads: which road you live out (M, 🟠)
The farmhouse sits on a named farm road heading out of town: south toward Walla Walla, out Coppei way, or west on Highway 124. Each road has its own drive time to Main, gravel dust in summer, and its own spot in the snowplow order.
Farm road picked on purchase; road data in maps.js; commute and trip time to town in outabout.js use it.
Balance: the shorter road costs more to buy, the far road is cheaper but slower; no free win.

### i33-b13 Gravel roads are plowed last (S, 🟡)
In a snow week, town streets get plowed first and farm roads last. If you live out a farm road without the truck, you might be snowed in for a week: rest is forced, work is missed unless you planned ahead.
Snow event branch in events.js checks area and car; a heads-up card the week before lets you stock up or stay in town.
Balance: careful players avoid it with one tap; careless players lose a week, which helps keep careless median low.

### i33-b14 Directions by landmark (S, 🟡)
Place cards get a 'How to get there' line the way locals give it: 'past the elevator, left at the old church, then where the Johnson place used to be.' Landmarks come from the map, so the directions stay true as places change.
A LANDMARKS list in maps.js and a small function that builds a direction line from home to any pin.
Balance: flavor; also good for screen reader users who can't see the map.

### i33-b15 A lost driver at the corner (S, 🟡)
A car slows down: someone's trying to find Bluewood, the fairgrounds or a house on the hill. Pick the right directions from three choices built off the real map, and they wave thanks. Get it wrong and you hear about it at the café.
Event in events.js that uses the LANDMARKS helper to build one right and two wrong routes.
Balance: a small community bump for a right answer, nothing for a wrong one; can't be repeated more than every few months.

### i33-b16 Walking loops drawn on the map (M, 🔴)
Name three or four real loops: around the Main Street blocks, out the levee and back, up the hill, and out to the fairgrounds. Pick one as your usual walk on the town map; it shows as a dotted line, gives small health and mood each week, and has its own chance encounters.
Loop paths in maps.js; S.walkLoop saved; turn.js adds +0.5 health when you don't pick work focus; loop-specific events in events.js.
Balance: small, only when you aren't overworking, and it needs a choice once; idle play gets it only if the player set it up.

### i33-b17 The shortcut through the alley (S, 🟡)
After a few months of walking to work in town, you find the alley shortcut behind the Main Street blocks. It saves a little time each week and once in a while you run into a neighbor taking out the trash.
Unlocks after N in-town work weeks; shows as a thin line on the Main Street close-up in outabout.js; a small happy bump.
Balance: earned by playing, not by waiting.

### i33-b18 The houses on your street change (M, 🟠)
Over the years the houses near you change: one gets new paint, one goes for sale, one sits empty after an old-timer passes, one gets a big remodel. A short 'Your street' log on the Home card shows what's new.
Reads S.streets in maps.js; a season tick in turn.js adds a house change line now and then; the empty house can feed later events.
Balance: no stat change except a small mood dip when the street runs down, which you can fix (see fix-it list).

### i33-b19 Buy the empty lot next door (M, 🟠)
When the lot next to your house comes up, you can buy it: a bigger garden, a shop, room for an extra rental cabin later. Or let it go and see who builds there.
Event in events.js for owners; S.lot flag; adds a small land asset in net worth and opens a garden upgrade.
Balance: costs real savings and adds upkeep; payback is slow, so it rewards long, careful play only.

### i33-b20 Your street's fix-it list (M, 🟠)
Each street has one thing broken: a cracked sidewalk, a dark corner with no streetlight, a pothole by the stop sign. Spend community weeks gathering neighbors and taking it to the city council; when it's fixed, the street's mood goes up for good.
STREETS gets a fix item; progress ticks on community focus weeks in turn.js; council scene in events.js.
Balance: takes 4-6 community weeks you could spend elsewhere; payoff is a small lasting happy bonus.

### i33-b21 A street tree in front of your house (S, 🟡)
The city's planting street trees and you can sign up for one. It starts as a stick, grows over the years on your house sketch, and on hot summer weeks it cuts the heat bill a little.
Sign-up event in spring; S.tree with a planted turn; Home sketch and heat-wave event read its age.
Balance: tiny saving that only shows after years; needs watering in its first summer or it dies.

### i33-b22 Spring yard-sale Saturday (S, 🟡)
One Saturday in May, whole streets put out tables. The town map shows which streets are having sales; walk them to find a cheap tool or a lamp, or put your own stuff out on the lawn.
Seasonal event in events.js with map badges on the streets; buy/sell uses the existing item or money paths.
Balance: small money either way and only once a year.

### i33-b23 The corner dog on your walk (S, 🟡)
There's a dog at the corner house that barks at you every morning. Walk past enough weeks and it starts wagging; one day the owner asks if you'll watch it for a weekend.
Counter tied to the walking loop; a three-step story in events.js.
Balance: flavor and a small community bump; needs a walking loop set.

### i33-b24 The dead end by the river (S, 🟡)
The end of the street by the river is where teens park and talk. Your teen goes there; sometimes it's fine, sometimes there's trouble, and as an adult you might be the one who calls to check in.
Teen-age kid events in events.js tied to the river-side area.
Balance: choices trade family time for kid outcomes; no money.

### i33-b25 Christmas lights tour by street (S, 🟡)
In December, drive the streets to see who went all out. The town map lights up the best-decorated streets, and if you and your neighbors put in the work, your street can make the tour.
December event; streets with high mood get a lights badge on the town map; your effort adds to your street's mood.
Balance: costs a little money and a community week; the reward is mood, not cash.

### i33-b26 A paper route that teaches you the streets (M, 🟠)
An early-morning job delivering the weekly paper on every street in town. Pay is small, but each week you learn a street: its name shows up on your town map and you hear its news first.
New side hustle in features.js; fills S.knownStreets; maps.js only draws street labels you know.
Balance: low pay and an early-morning health cost; it's for exploring, not earning.

### i33-b27 Street names fill in as you get to know town (S, 🟠)
The town map starts with just Main Street and Preston labeled. Street names appear once you've lived on them, walked them, worked a job there, or been to an event there. A 'You know 9 of 14 streets' line sits under the map.
S.knownStreets in state.js; maps.js draws labels from STREETS when known; events and walking loops add streets.
Balance: no score effect; a gentle explorer goal.

### i33-b28 What people call your house (S, 🟡)
Folks in town call houses by who lived there: 'the old Miller place.' Live in yours long enough and do right by it, and town starts calling it by your name. Your heir hears it too.
Each owned home gets a stand-in prior name; after enough years and upkeep, Home card and event text switch to your family name.
Balance: flavor; tied to upkeep so neglect doesn't earn it.

### i33-b29 New houses go up on the west end (M, 🟠)
In a long game, a few new houses get built on the west end past the elevator. The map gains a small street, home prices nudge, and some folks at the café aren't happy about it.
A long-game tick in turn.js (after year 8 or so) adds a STREETS entry and map path; housing prices in the valley market read it.
Balance: small price shift both ways; it's a world change, not a reward.

### i33-b30 The edges of town change with the seasons (S, 🟡)
Small seasonal pins appear at the edges of the town map: the farm stand out the highway in August, the pumpkin patch in October, the snowplow lot in winter. Tap for a one-line card and a small trip.
Seasonal pins in townPlaces() in maps.js; trips reuse outabout.js visit logic and caps.
Balance: counts toward OUT_WEEK_CAP, so more pins don't mean more points.

### i33-b31 Your street on the end screen (S, 🟡)
The end screen adds a short 'Your street' line: where you lived, how the street changed while you were there, and what you fixed. 'Coppei Ave got a streetlight because of you.'
ui.js end screen reads S.streets notes and fix-it history.
Balance: flavor only.

### i33-b32 A Waitsburg street guide in Help (S, 🟡)
A Help page that lists each street and area in plain words: what's there, what living there is like, and which events can happen. It fills in as you learn the streets.
help.js section built from STREETS data and S.knownStreets.
Balance: information only.
