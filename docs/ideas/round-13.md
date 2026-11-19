# Ideas round 13

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 13: Health, body and mind

Ideas about the body over a lifetime, getting care far from a big town, and how health ties into money, work and happiness.

### i13-a01 Fitness that builds slowly and fades slowly (L, 🔴)

- A new S.fitness number (0–100). Outdoors focus, the yoga class, field jobs and the 5K add to it; desk weeks and long commutes slowly take it away.
- In turn.js the age-based health target gets + fitness × 0.06, so a fit 60-year-old drifts like a 50-year-old.
- Shown as a short line under Health ("Fitness: building"), not as a fourth stat bar.
- Balance: it takes months of mixed weeks to build, so idle Rest play never gets it, and the bonus is capped so health can't carry the score.

### i13-a02 A video visit with the clinic from the kitchen table (S, 🔴)

- New act on the clinic place in outabout.js: cost 45, health +3 only when health < 60, otherwise just peace of mind (+1 happiness).
- When health < 30 it adds no health and says "They want to see you in person," pointing to Feeling run down or a checkup trip.
- Balance: small effect, counts against the 2 visits a week, and can't replace a real checkup.

### i13-a03 Workers' comp after you're hurt on the job (M, 🔴)

- Adds a choice to the Hurt on the job event in events.js: S.comp = {weeks, rate:0.6}; turn.js pays rate × pay instead of full pay while it runs.
- Work extra hours and Side hustle are locked until it ends (you're healing). Health recovers +1.5 a week.
- 10% chance the next performance review is a little cooler.
- Balance: you lose 40% of pay for weeks, so it's a safety net, not a money maker. Careless players who push through still take the big health hit.

### i13-a04 Quit smoking: a habit you can start the game with (M, 🔴)

- New start option in the new-game screen (ui.js) and S.smoke = {on, quitWeek, tries}. A bill line "Cigarettes" in turn.js uses cost() so it rises with prices.
- Quit: a $60 clinic act starts the try. Each week, a stressful job or happiness under 35 gives a 6% chance of a slip; Get outside and Show up for town halve it.
- After 12 weeks: the bill and drain end, +4 happiness, and a log line "Quit smoking at 34."
- Plain, no lecturing. Balance: starting as a smoker is harder, and quitting is the payoff, so careless play stays lower.

### i13-a05 Talk it out: a friend, the pastor or a counselor (M, 🔴)

- A new event in events.js, when: happiness < 35 for 4+ weeks (tracked in S.lowWeeks), cooldown 26 weeks.
- Friend: +3 happiness now. Pastor: +2 happiness, +2 community. Counselor: −$60 a week for 6 weeks (half with the better health plan) and +1.5 happiness each week.
- Warm, plain words, nothing clinical, and no talk of crisis. Help gets one line: "Feeling low for a while? Talking to someone you trust helps."
- Balance: only shows up when things are already bad, so it can't be farmed by idle play.

### i13-a06 A checkup finds high blood pressure (M, 🟠)

- In features.js, the checkup stop rolls (age − 40) × 1% for S.bp. A 'Prescriptions' bill line, about $15 a month, through cost().
- Untreated: health −0.3 a week and a 1.3× hospital chance in turn.js. Treated: no drain.
- Without checkups it still shows up later, as a Feeling run down card, at a worse level.
- Balance: rewards the yearly checkup good players already make; careless players pay for skipping it.

### i13-a07 The specialist is in Walla Walla (M, 🟠)

- Feeling run down (health < 25) sets S.referral = {until: turn+4}. features.js adds a 'Specialist visit' stop in Walla Walla while it's open: $220, health +8.
- The Home card shows "🩺 Specialist visit due by week 112."
- Rural access made real: a day off, the 21-mile drive and gas.
- Balance: costs time, money and a trip slot, so it's a choice, not a free heal.

### i13-a08 Sick on a Saturday: wait for Monday or urgent care (S, 🟠)

- New event in events.js tied to the clinic's hours text in outabout.js; cooldown 26 weeks.
- Wait: health −4, happiness −1. Urgent care: −$180 via medBill(), health −1.
- Good-plan players pay half (J29).
- Balance: small, both choices cost something.

### i13-a09 Squinting at the menu: reading glasses in your 40s (S, 🟠)

- Once-only event in events.js at ages 42–48. S.eyes = 'readers' | 'exam'.
- Without either: −0.2 happiness a week while studying or in an office job until you fix it. The exam also adds an 'Eye exam' stop that's worth doing every two years.
- Younger players see nothing. Leaves cataracts and hearing to i9-a05.
- Balance: cheap fix, small penalty, so it's flavor more than a trap.

### i13-a10 The dentist's postcard on the fridge (S, 🟠)

- ui.js reads S.turn − S.dentist. At 48 weeks a small card links to the Walla Walla dentist trip stop in features.js.
- No change to the Toothache event; it just tells you it's coming.
- Balance: rewards paying attention; idle play still ignores it.

### i13-a11 A free health fair and flu shots at the fairgrounds (S, 🟠)

- Yearly event in events.js (October), placed at the fairgrounds on the town map.
- Go: costs part of your week (focus at 75%), sets S.flushot = year, and runs a free blood pressure check (ties to the blood pressure idea).
- Flu going around checks S.flushot for half weight.
- Balance: free but costs time; the benefit only matters if you're working in winter.

### i13-a12 Good boots and earplugs for field and trades jobs (S, 🟠)

- A buy on the farm-supply place in outabout.js, S.gear = turn; wears out after 3 years.
- events.js: Hurt on the job weight × 0.5 when S.gear is fresh.
- Balance: a sensible money-for-safety trade; pays off only if you stay in physical work.

### i13-a13 Spring pollen and harvest dust (S, 🟠)

- S.allergy set at new game; shown in the Life tab. A bill line, 'Allergy pills', while the season runs, if you buy them from the grocery.
- turn.js: Outdoors health × 0.6 in April–June without the pills; field job wear +0.2 in July–August.
- Balance: a small, fixable seasonal cost that rewards a quick decision.

### i13-a14 A pint is a treat, not a habit (S, 🟠)

- outabout.js: count pint visits in the last 4 weeks; the 3rd and later give half happiness and −1 health.
- New act 'Root beer or an NA pint' ($6, community +1, happiness +1, no 21+ limit).
- Light, no warnings or labels. Balance: stops an easy happiness loop at the taproom.

### i13-a15 Drive a neighbor to treatment in Walla Walla (S, 🟠)

- Event in events.js, community ≥ 30, needs a running vehicle. Sets S.rides = 4; each week costs the 42-mile round trip in gas and runs focus at 85%.
- Yes: +2 community a week, and a later thank-you card (a pie or a small favor).
- No: no penalty beyond a missed chance.
- Balance: a clear time-for-community trade; it can't stack with a trip that week.

### i13-a16 You need a ride home after a procedure (S, 🟠)

- A rider on certain appointments in features.js: if S.community ≥ 40 a free ride and a short line naming 'a neighbor'; otherwise a choice.
- A once-only 'Screening at 50' appointment uses it.
- Balance: shows that community pays back in a real way, not just in score.

### i13-a17 Health shows up at work (S, 🟠)

- events.js: the Your performance review weights shift by (health − 50) / 200. Track S.sickWeeks per year; at 0, a Year-end bonus line "Perfect attendance" (+$150 through cost()).
- Balance: links health to money a little; good play gains a small edge, careless play loses a little.

### i13-a18 Grief takes its time (M, 🟠)

- S.grief = {until, who}. turn.js: happiness gains × 0.7 while it runs, except Show up for town and visits with friends, which get × 1.2.
- A one-line card in plain, kind words; no stats in the text. A memory line goes in the log.
- Hooks into existing pet and aging-parent ideas when they ship.
- Balance: a temporary slowdown, not a penalty that piles up.

### i13-a19 Morning walking group on Main Street (S, 🟠)

- A toggle on the Main Street pin in maps.js / outabout.js: S.walkers = true. +0.6 health, +0.4 community a week; skipped in snow, smoke and on weeks you commute 40+ miles.
- Gives a small boost to 'A tip from a friend' odds.
- Balance: small and steady; different from evening walks (i11-a06) because it's a group and a community source.

### i13-a20 Rec league softball and pickup at the school gym (M, 🟡)

- A seasonal sign-up card (April and November), S.league = season. turn.js adds +0.5 health, +0.5 happiness, +0.4 community a week while it runs.
- Injury chance 2% a week, rising with age past 40: health −4 and two weeks off the league.
- Balance: modest gains, a cost and a risk; doesn't stack with a 'Get outside' week for health.

### i13-a21 Get outside changes with age (S, 🟡)

- FOCUS.outdoors desc text in state.js changes by age band; ui.js shows the new line.
- Past 55: 3% a week ankle twist (health −3), halved with high fitness.
- Balance: keeps Get outside useful but not a free health machine late in life.

### i13-a22 A gym in Walla Walla or the school weight room (M, 🟡)

- A membership on the Life tab, a bill line through cost(). Gym visits count as a free trip stop (+3 health); the weight room adds +0.5 health a week if you're not on a long commute.
- Six weeks without a visit, a reminder: "Still paying for the gym?"
- Balance: careless play pays without going and loses money; it builds fitness only for players who use it.

### i13-a23 Braces for a kid (S, 🟡)

- Event in events.js using S.kids ages. A 24-month bill line like the truck loan.
- Better health plan covers half.
- Balance: a real family cost with a fair choice; no effect for players without kids.

### i13-a24 Dry January (S, 🟡)

- Yearly event (January, 21+). S.dry = {until}. outabout.js hides drink acts or marks them 'Not this month'.
- Finish: +3 health, +2 happiness, and a log line.
- Balance: small and optional; it doesn't punish players who skip it.

### i13-a25 Daylight saving week (S, 🟡)

- turn.js: second week of March, Rest fx × 0.8; events.js road events weight × 1.3 that week.
- A one-line header note: "Clocks went forward. Everyone's dragging."
- Balance: tiny, once a year, mostly flavor.

### i13-a26 Summer at the town pool (S, 🟡)

- A place in outabout.js with months 5–7 open; act fx {health:2, happy:2}, cost 3.
- On heat-wave weeks (i5-b22) it gives double happiness.
- Balance: small, seasonal, counts against the 2 visits a week.

### i13-a27 Your year in health (S, 🟡)

- turn.js already snapshots the year; add counters S.yr.sick, visits, outdoors. ui.js renders three lines and one sentence.
- Balance: no effect on play; it helps players see why health moved.

### i13-a28 A health savings account with the cheaper plan (M, 🟡)

- Adds S.hsa to the Health plan choice event and the Life tab. medBill() takes from S.hsa first; a weekly deposit slider like the 401(k).
- Balance: a smart-money tool that rewards planning; capped yearly so it isn't a tax-free money printer.

### i13-a29 Your body: back, knees, teeth, eyes and heart (L, 🟠)

- S.body = {back, knees, teeth, eyes, heart} each 0–100, worn by job.wear, age, S.dentist, fitness and stress in turn.js.
- Fixes: physical therapy trips in Walla Walla, the dentist, the eye exam, the checkup. Low parts add small weekly health drains.
- Pulls in old injuries (i1-a23) and the glasses and blood pressure ideas as parts of one system.
- Balance: drains are small and fixable; idle play wears slowly but never fixes, so it ends lower.

### i13-a30 A regular doctor who knows you (M, 🟠)

- S.doc counts clinic and checkup visits; at 2 the clinic card names your doctor (a stand-in name).
- Effects: Feeling run down bill × 0.8, the blood-pressure roll is found at checkups instead of during a crisis.
- If you skip a whole year, the clinic's 'Welcome back' resets the count to 1.
- Balance: rewards steady checkups, the same thing good players already do.

### i13-a31 Ladders and chainsaws: fixing it yourself (S, 🟡)

- An event for owned homes (fixer and farm) in October: DIY saves cost(300) with a 12% chance of health −6; hire −cost(300).
- Good boots (above) cut the chance in half.
- Balance: a fair money-or-risk trade.

### i13-a32 A heart scare after 55, and cardiac rehab (M, 🟡)

- Event in events.js (age 55+, fitness low, job stress high), a hospital bill through medBill().
- Then S.rehab = 8 visits; each Walla Walla trip with the rehab stop gives +3 health and +2 fitness. Finishing gives +5 health and a log line.
- Balance: rare, and recovery takes real effort, so it can't be farmed.

## Ideas 13: Town history and civic life

Ideas that teach Waitsburg's real history through play, let the town change over a long game, and give even-handed, non-partisan civic roles.

### i13-b01 The town ledger: Waitsburg changes over a long game (M, 🔴)
A hidden town record (people, school enrollment, open storefronts, rent level, internet speed) moves a little each year from random drift plus what players do. It shows as a one-card 'How the Burg is doing' on the Life tab, and events, rents and job lists read from it.
New S.town object in state.js, yearly tick in turn.js, card in ui.js; events.js and features.js read it. Drift alone is small, so idle play gets an ordinary town, not a better one; the town only improves from Show up for town weeks and civic choices.

### i13-b02 Wait's mill: how the town got its name (S, 🔴)
A short opening story card on a first game: a man named Wait builds a flour mill on the Touchet in the 1860s, a town grows around it, and wheat still runs everything. Tapping the mill on the town map later replays it with a 'today' line.
Help/intro text in help.js and a map tap in maps.js. Pure flavor, no score effect. Keep claims to the well-known basics.

### i13-b03 Levy season: vote, campaign or stay home (M, 🔴)
Every couple of years a local levy goes to the ballot (school operations, fire and EMS, or the parks). The Tattler lays out what it pays for and what it costs per $100k of home value; you vote, knock doors for either side, or skip it. The result changes your property tax and a town service for the next years.
Event in events.js with a yearly levy calendar, results into S.town. Both outcomes have a real cost and a real benefit, the game never says which is right, and campaigning for either side gives the same community gain. Owners see the tax; renters see it later in rent.

### i13-b04 Public comment night at city hall (M, 🔴)
A Show up for town option on council nights: sign the sheet and speak three minutes on this month's item (a sidewalk, dog rules, a water main). How it lands depends on People skill and whether you did your homework that week.
Focus sub-option in turn.js and ui.js, item list in events.js. Small community and People skill gain; a bad speech costs a little happiness, never money. Gives non-council players a civic path.

### i13-b05 The water system is a hundred years old (M, 🟠)
A slow story: a main breaks on Main, the town studies its pipes, and rates must rise or repairs wait. You can volunteer on the rate committee, and your water bill on the money breakdown follows the choice the town makes.
Chain in features.js STORY_EVENTS (chainSet), a water line in the monthly costs in turn.js. Raising rates costs more now; waiting risks boil-water weeks later. Both are fair trade-offs, sized so neither swings the score more than a couple of points.

### i13-b06 Broadband comes up the valley (M, 🟠)
Around year two or three a fiber project reaches town in stages. Until it does, remote jobs and online classes are slower; after, remote work days count fully and a couple of new remote-friendly jobs appear. Players can sign the interest list to help the town win the grant.
S.town.net in state.js, read by job remote days and study speed in turn.js, a chain in features.js. Signing up is a Show up for town week, so idle play waits longer for it.

### i13-b07 Rent creeps up as new families arrive (S, 🟠)
When the town ledger shows people moving in, rents and home prices in Waitsburg rise a bit faster than inflation for a few years; when people leave, they flatten. A one-line Tattler note explains why.
Rent multiplier on S.town in state.js, used where housing costs are set. Owners gain on paper, renters pay more; the move is capped at a few percent a year so it never wrecks a run.

### i13-b08 New families on your block (M, 🟠)
Now and then a new household moves in: a young couple who work remotely, a family from the Tri-Cities, a retired teacher. Welcome them with a casserole and they become a neighbor who can trade favors; ignore them and they stay strangers.
Event pool in events.js, neighbor list in state.js. Small community gain for welcoming; no penalty for skipping beyond a missed friend. Feeds the town ledger's population.

### i13-b09 Enrollment and the school's future (M, 🟠)
The ledger tracks how many kids are in the K-12 school. If it drops for years, the school board talks about sharing programs with a nearby district; if it grows, a new teacher gets hired and the para job opens more often. Your own kids count.
S.town.kids in state.js, para job odds in turn.js, an event in events.js. Families with kids nudge it up, which already costs money, so it does not reward careless play.

### i13-b10 Run for school board (M, 🟠)
A second elected seat, separate from council, open to players with kids in school or community 50+. Monthly meetings take one evening, and a couple of times a year you decide something like a bus route, a four-day week or a new roof.
Flag S.board in state.js, event and decisions in events.js, Life tab line in ui.js, a badge in features.js. Same small weekly community gain as council, a little stress, no pay.

### i13-b11 The Bruce House: be a museum docent (M, 🟠)
The old Victorian house museum needs Saturday volunteers in summer. Take a training afternoon, then lead tours; each tour teaches you one real history note, collected in a 'What you know about the Burg' list.
Out and about stop in outabout.js, notes list in state.js, a page in help.js. Small community and happiness gain; capped at one tour a week so it can't be farmed.

### i13-b12 Coppei: the school before the town (S, 🟠)
A history note and short event about the early Coppei settlement and its pioneer school out on Coppei Creek. An old-timer drives you out to see where it stood, and you can leave flowers at the little cemetery.
Event in events.js, note in the docent list, a point on the region map in maps.js. Flavor with a small happiness lift.

### i13-b13 Flood memory: the year the Touchet came over (M, 🟠)
Old-timers tell about the big floods, and the town still does a yearly levee walk in late winter. Join the walk and check sandbag stock; it lowers basement-flood damage for you and neighbors if high water comes that year.
Late-winter event in events.js, tied to the existing flood and levee code in features.js. Prep costs a Show up for town week; it only pays back in flood years, so it rewards planning, not grinding.

### i13-b14 Celebration Days through the years (M, 🟠)
Each year's Celebration Days adds one page to a scrapbook: who won the races, the parade theme, what you did. In long games, the town also changes the festival (a new event added, one dropped for lack of volunteers) based on the ledger.
Scrapbook in state.js, festival week in events.js, page in ui.js. Volunteer count comes from player Show up weeks and the ledger. No score; it is memory and color.

### i13-b15 The town's old charter, explained (S, 🟠)
A short help page and a council-night trivia question about why Waitsburg still runs under its territorial-era charter and what a charter does. Ties to the existing charter-vote idea without repeating it.
help.js page and one trivia line. No effect on play; it gives civic context in plain language.

### i13-b16 A storefront closes, a storefront opens (M, 🟠)
In long games, Main Street businesses (stand-in names) sometimes close when an owner retires, and someone opens something new in the space a season later. Out and about stops update, and you get a choice to shop the farewell sale or be at the ribbon cutting.
Stop list in outabout.js gains open/closed state in S.town; events in events.js. Closures are rare and always followed by an opening, so towns never hollow out from bad luck alone.

### i13-b17 Library card week (S, 🟠)
A first-year nudge to get a library card. With one, a Rest week can be a reading week (small happiness and a little study progress), and the librarian points you to the local history room.
Flag in state.js, Rest sub-option in turn.js. The study bit is small and capped so it does not replace real classes.

### i13-b18 Library hours on the ballot (M, 🟠)
The library's budget tightens. The council weighs cutting a weekday or asking voters for a small levy. You can testify, run a book sale fundraiser, or let it ride; open hours change which library options you get.
Event chain in features.js, library availability in outabout.js. Each path has a cost (time, money or fewer hours); none is marked the 'right' answer.

### i13-b19 Fill a town board seat (M, 🟠)
Unpaid town boards (planning commission, parks board, cemetery board) need people. Join one for a two-year term: a meeting a month and one decision a year, like a fence rule or a new playground spot.
Generalize the council flag into S.seats in state.js; decisions in events.js; Life tab in ui.js. Lower stakes than council, open at community 40, gives mid-game civic play.

### i13-b20 Election Day helper (S, 🟠)
In election years, work a shift helping at the county ballot drop box or the ballot center in Dayton for a small stipend. Plain notes explain mail-in voting in Washington.
Event in events.js keyed to November of even years. Small pay and community. Strictly non-partisan; no races or candidates named.

### i13-b21 The town budget hearing (M, 🟠)
Each fall the town posts its budget. A simple sheet shows where money goes (police contract, streets, water, parks, pool) and lets you suggest one shift. The council takes up the most common suggestion among players on council or at the hearing.
Sheet in ui.js, budget numbers in S.town, outcome into the ledger in turn.js. Teaches local money without picking sides; every shift helps one thing and squeezes another.

### i13-b22 Volunteer firefighter tones (S, 🟠)
Join the volunteer fire department. Some weeks your pager goes off: a grass fire at harvest, a chimney fire, a car off US-12. Going costs a work shift or a night's sleep; the town remembers.
Flag in state.js, random calls in events.js. Community gain, small health and happiness cost, a little training pay. Capped calls so it can't be farmed.

### i13-b23 Old-timer oral history project (M, 🟡)
With the historical society, record five old-timers over a year. Each recording unlocks a real-style history note and a new face who greets you in town. Finish all five and the society names you in its newsletter.
Chain in features.js, people in state.js, notes list shared with the docent idea. Different from the café old-timer: it is a project you run, five people, one year.

### i13-b24 Historic district paint rules (S, 🟡)
Own a building on Main? The historic district has guidelines. Repainting means picking from period colors or asking the council for a pass, which costs time and some goodwill.
Event in events.js for Main Street owners. Small cost either way, purely flavor with a touch of civic process.

### i13-b25 A plaque for your house (S, 🟡)
After 20+ years in the same home, the historical society asks to put a small plaque on it with your family name and the year you moved in. It shows on your house in the town map.
Event in events.js, flag shown in maps.js. Small community and happiness lift; only long, settled games reach it.

### i13-b26 The town's 'then and now' photo walk (M, 🟡)
A Saturday activity: walk Main Street with old photos and match each to today's building. Find all six over a few walks to finish a 'then and now' set in your scrapbook.
Out and about activity in outabout.js, photo list in a data file. Happiness gain; one walk a week.

### i13-b27 Population sign update (S, 🟡)
When the ledger crosses a round number, the town's entry sign gets a new population figure, with a Tattler line and a small town moment. Up or down, it is just news.
Check in turn.js on the yearly tick, note in the weekly result. Flavor only.

### i13-b28 A town hall on housing (M, 🟡)
When rents climb, the council hosts a town hall: allow accessory cottages, add a few lots on the edge of town, or leave zoning alone. Everyone speaks; the outcome shapes future rent drift and new-family arrivals.
Event in events.js, result into S.town rent and growth rates. Each choice has a downside (traffic, cost, slower growth); the game does not label any as best.

### i13-b29 Read the Tattler's minutes (S, 🟡)
Tap the Tattler to read two-line council and school-board minutes for the month: what passed, what was tabled. Items you spoke on show your name.
Small list in outabout.js and state.js drawing on events already fired. No score; makes civic actions feel seen.

### i13-b30 A century in the Burg: lifetime town timeline (L, 🟡)
In Lifetime games, a timeline page shows the town's big turns during your life: floods, levies, new storefronts, broadband, school changes, your seats. At the end it becomes a closing 'what the Burg became' summary.
New sheet in ui.js reading the ledger and scrapbook in state.js; ending screen hook. No score of its own; it turns the long game's town changes into a story.
