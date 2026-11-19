# Ideas round 26

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 26: The valley's people and cultures

Ideas that bring the Walla Walla Valley's real communities into the game with care: Latino families, the Confederated Tribes of the Umatilla Indian Reservation, farm heritage and immigrant histories, always as celebrating, learning and visiting.

### i26-a01 Tamástslikt Cultural Institute: a day trip to learn (S, 🔴)
A yearly road choice (or a Pendleton stop once road trips exist) to visit the Tamástslikt Cultural Institute near Pendleton, the museum the Cayuse, Umatilla and Walla Walla tribes run. It costs gas and a ticket, gives happiness and a short note about what you learned, and fills an Explorer badge.
A road event (js/events.js) in spring or fall: go (about −$70 with gas and admission, ☺+5) or skip. Once i5-b18 road trips land it becomes a Pendleton stop in STOPS.
The result text describes the museum plainly: the three tribes' own telling of their history, from before the Oregon Trail to the Confederated Tribes today. No ceremony is shown.
Balance: paid, once a year, small effect. Idle bots never pick it.

### i26-a02 The mercado in Walla Walla (S, 🔴)
A new Walla Walla trip stop: a Mexican grocery and bakery (stand-in name) with fresh tortillas, pan dulce and produce. It gives a small grocery discount for a few weeks and a little happiness.
New STOPS entry, kind 'errand', towns ['wallawalla','pasco'], cost $25, fx {happy:3}, with a smaller grocery cut than the big-store stock-up (10% for 4 weeks). Doesn't stack with 🛒 stock-up.
The note says what's on the shelves, not who shops there.
Balance: a trip slot and gas; same REPEAT_WEEKS rule as other stops.

### i26-a03 Día de los Muertos: a community altar exhibit (S, 🔴)
In late October and early November, a Walla Walla stop lets you visit a public community altar exhibit with marigolds, sugar skulls and photos families share. A plain note explains it as a joyful day for remembering loved ones.
Seasonal STOPS entry, when inSeason(9,10) limited to the last week of October and first of November, $5, fx {happy:3, community:1}.
If a family member or pet has died in this life, the result line can mention them gently.
Visitor-only: you look, learn and maybe buy pan de muerto. Nothing ritual is played.
Balance: two weeks a year, tiny effect.

### i26-a04 A quinceañera invitation (S, 🔴)
A coworker invites you to their daughter's quinceañera. Go with a gift, help set up the hall, or send a card. It's a big, happy family party with a dance and lots of food.
Work event (js/events.js), once per job, needs 8+ weeks in that job. Go (−$40, ☺+5, 🤝+3), help set up (−$20, health −1, ☺+4, 🤝+5, handy practice 2), or send a card (−$5, 🤝+1).
The coworker gets a first name from the regional name list and can come back in later work events.
Balance: careless players who skip work weeks rarely reach 8 weeks in one job.

### i26-a05 Fiestas patrias in September (S, 🟠)
Around September 16, Walla Walla and Pasco hold a Mexican Independence Day celebration with music, folk dancing and food booths. It shows up as a stop for those two weeks.
Seasonal STOPS entry in wallawalla and pasco, two weeks in mid-September, $20, fx {happy:5, community:2}. date:true so it counts as a date night.
Add it to the festival list if i12-a21 lands.
Balance: short window, a trip slot and gas.

### i26-a06 A Sunday soccer league (M, 🟠)
Join a Sunday soccer league that plays at a Walla Walla park from spring to fall. Teams mix farmworkers, students and families, and it's a cheap way to stay fit and meet people.
A weekly toggle on the Life tab (like a membership): $30 a season, health +2 and community +1 most weeks while active, a small injury risk (health −6, 1 in 40 weeks).
Skipped if you work weekends. Effects fade if you also pick Rest every week.
Balance: needs gas each week (a short Walla Walla drive); idle bots never sign up.

### i26-a07 Ana, the orchard crew lead: a story over a year (M, 🔴)
A recurring neighbor: Ana runs a picking crew and is saving to buy her own few acres of cherries. Over a year you carpool, help with a fence, get invited to a family carne asada and maybe go in on the land together.
A STORY_EVENTS chain (js/features.js) with chainSet steps: carpool (people practice), fence help (handy practice), the cookout (☺+5, 🤝+3), and a last choice to lend money, co-sign or cheer her on.
She's written as a boss with plans, not as a hard-luck story.
Balance: lending can lose money; the chain only starts if you show up for town at least 4 times.

### i26-a08 Heat rules on the crew (S, 🟠)
In July a work event on outdoor jobs: it's 104°F and the shade tent blew down. Speak up for the water-and-shade breaks Washington's heat rules require, fix it yourself, or keep picking.
Work event for farmhand, onion, cellar and harvest side jobs, July–August. Speak up (🤝+3, small chance the boss is annoyed), fix the tent (health −1, 🤝+2), keep going (health −4, rare heat-illness hospital trip).
A one-line fact about real outdoor heat rules in the result.
Balance: careless 'keep going' costs health.

### i26-a09 Tutor for the citizenship test (M, 🟠)
Volunteer an evening a week at the library helping adults study for the U.S. citizenship civics test. Months later, you're invited to the ceremony.
A Class/Learn focus option at the library (js/turn.js): community +2, happy +1 a week, no pay. After 12 weeks a once-only event: your student invites you to their naturalization ceremony in Spokane or Yakima (go: a day off, −$60 gas, ☺+8, 🤝+5).
Differs from i9-a15 (teach what you know): fixed curriculum, ends in a ceremony.
Balance: costs a focus week, so it trades against pay.

### i26-a10 A coworker's citizenship ceremony (S, 🟡)
A coworker who has lived in the valley 20 years invites you to the ceremony where they become a citizen. Take a day off to go, or send a card.
Work event, once per life, needs 26+ weeks in one job. Go (lose a day of pay, ☺+6, 🤝+4) or send a card (🤝+1).
Short, warm text about the oath and the family photos after.
Balance: costs pay; small effect.

### i26-a11 A tamalada in December (S, 🟠)
Your neighbors invite you to their family tamalada, an afternoon of making dozens of tamales together. Bring a dish of your own, learn to spread masa, and go home with a dozen.
Town event in December, once a year at most: join (☺+5, 🤝+3, cook practice 2, groceries −10% for 2 weeks from the leftovers) or politely decline.
If you have a recipe from i11-a24, the result names what you brought.
Balance: once a year, can't be farmed.

### i26-a12 Folklórico at the school spring show (S, 🟡)
If you have kids, one may join the school's folklórico dance group. Pay for a skirt or boots, drive to practices, and watch the spring show.
Family event (kids 6–17), once per kid: join (−$80, ☺+4 each spring show, 🤝+2) or pick another activity. Spring show in May.
Any kid can join; the text doesn't assume the family's background.
Balance: costs money and an evening drive a month.

### i26-a13 Spanish radio on the drive (S, 🟡)
On the region map, the 🛻 commute can play a Spanish-language station: norteño and banda music and the farm report. It's a tiny happiness lift and a little Spanish practice.
A radio toggle in the commute strip (js/maps.js): music gives ☺+1 every 4 commute weeks; if i12-a19 Spanish lands, 1 practice point a month.
No cost, but capped so it can't beat a real study week.
Balance: tiny and capped; only for players who drive.

### i26-a14 Hello in two languages around town (S, 🟠)
Short Spanish lines show up in town scenes with English right after: a 'buenos días' at the Howlin' Bean, a sign at the onion shed, a neighbor's 'gracias'. It makes the town sound like the valley really sounds.
Add optional es lines to about 15 events and OUT_EVENTS (js/events.js, js/outabout.js), shown as 'Buenos días (Good morning)'.
A reviewer who speaks Spanish checks every line before release.
Balance: text only, no score effect.

### i26-a15 Where the Walla Walla sweet onion came from (S, 🟡)
The onion shed job and the June onion sack get a short history card: an Italian gardener brought onion seed from Corsica around 1900, and Italian and later Japanese American and Latino families grew the crop into what it is.
A history note in help.js shown the first time you take the onion job or buy an onion sack. Facts checked against a museum or university source before it ships.
Balance: text only.

### i26-a16 Walla Walla's Chinese gardeners and laundries (S, 🟡)
A history card at the old depot or downtown stop: in the 1800s Walla Walla had a Chinese community of gardeners, laundry owners and railroad workers who fed the town, and were later pushed out by unfair laws.
A one-time card from the Walla Walla 'Dinner downtown' or history stop, plus a Journal line. Plain, factual tone.
Pairs with i7-b14 history markers if built.
Balance: text only.

### i26-a17 The Volga German families of 'Russian Town' (S, 🟡)
A history card: German-speaking families from Russia's Volga region settled on Walla Walla's north side around 1900, worked the wheat and built churches and bakeries. One old-timer still makes their grandma's bierocks.
A town event in fall with a neighbor's story and a recipe card (bierocks) if i11-a24 is built. Choice: listen (☺+2, 🤝+1) or help them bake for the church sale (cook practice 2).
Balance: once only, small.

### i26-a18 Whitman Mission: a history that has two sides (S, 🟠)
A free Walla Walla stop at the national historic site west of town. The note says the park now tells both the missionaries' story and the Cayuse people's story of disease, conflict and loss.
New STOPS entry, kind 'do', towns ['wallawalla'], free, fx {happy:2, community:1}. The note stays factual and short and does not dramatize the 1847 killings.
Balance: free but takes a trip slot and gas; REPEAT_WEEKS applies.

### i26-a19 The pioneer village and the 33-mule combine (S, 🟡)
A Walla Walla museum stop (stand-in name) with an old pioneer village and a huge diorama of the days when combines were pulled by teams of mules. Farm hands get a little extra from it.
New STOPS entry, $10, fx {happy:3}; farmhand and elevator jobs and wheat-lease players get community +1 more.
Check the mule count in the real exhibit before shipping; don't name the museum.
Balance: small, paid.

### i26-a20 Whose homeland this is: a page in Help (S, 🔴)
A short Help page about the land the game is set on: the Walla Walla, Cayuse and Umatilla peoples, the 1855 Walla Walla Treaty, and the Confederated Tribes of the Umatilla Indian Reservation today, with Tamástslikt as the place to learn more.
New section in js/help.js, five plain sentences, written to point players to the tribes' own museum and website rather than speak for them.
Ask the Tamástslikt or CTUIR staff to review it if they're willing.
Balance: no gameplay effect.

### i26-a21 Salmon come back to the Touchet (S, 🟠)
After years of restoration work by the tribes' fisheries program and the state, spring Chinook are seen in the Touchet. A river-week event lets you watch from the bridge or join a stream-planting day.
Touchet River event (outdoor focus) in April–May, more likely in later years. Watch (☺+3) or volunteer to plant willows with a restoration crew (health −1, 🤝+4, ☺+3).
The text credits the tribal fisheries and partner agencies as a team (generic names).
Balance: needs an outdoor week.

### i26-a22 Restoration crew tech: a job with the tribes' fisheries (M, 🟠)
A new job in Walla Walla: seasonal field tech for a salmon habitat crew run by the tribes' natural resources department. Muddy work, fair pay, and fish counts in the spring.
New JOBS entry (js/state.js): city 'wallawalla', pay about $3,300, edu 1, stress .3, wear .8, seasonal months March–October with layoff notice in November.
Employer is described, not named. Pairs with the salmon event.
Balance: seasonal gap in winter keeps it from beating steady jobs.

### i26-a23 Mission and Pendleton on the region map (L, 🟠)
Add Pendleton and Mission, Oregon as a seventh pin, about 50 minutes south of Walla Walla. Trips there reach Tamástslikt, the Round-Up grounds and the woolen mill, and a few jobs open up, including at the tribes' clinic and businesses.
New CITIES entry with real coordinates and the OR-11 route in js/maps.js, a gas cost, 3–4 STOPS and 2–3 JOBS (stand-in employers).
Folds in i5-b20 Round-Up and the Tamástslikt trip.
Balance: long drive (high gas and time), so commuting there costs real money; screens test at 320 px must still pass.

### i26-a24 A public powwow, as a guest (S, 🟡)
In July, an event offers a trip to a public summer powwow near Pendleton. You go as a guest: watch the grand entry and dance contests, buy from craft and food vendors, and follow the announcer.
Road event in July, once a year: go (−$60 with gas, ☺+6) or skip. The text keeps to what visitors see and adds etiquette: stand when asked, ask before taking photos, listen to the announcer.
No dance meanings or ceremonies described.
Balance: paid, once a year.

### i26-a25 Old-time threshing day (S, 🟡)
Each August an old-time threshing and tractor show runs at a farm outside town. Watch steam engines and horse teams thresh wheat the old way, or volunteer if you're a farm hand.
Town event in August: watch (−$10, ☺+4), volunteer (health −1, 🤝+4, handy practice 1), or skip. Farm hands and wheat-lease owners get the volunteer option first.
Balance: once a year.

### i26-a26 A valley community cookbook (M, 🟡)
The school's parents group collects recipes from families all over the valley for a fundraiser cookbook: tamales, bierocks, lefse, Grandma's pie. Send yours in and buy a copy.
A once-only town chain: submit a recipe (cook level 1+, 🤝+3), buy the book ($20, ☺+2, adds 4 recipe cards to i11-a24's box), or skip.
Recipes come from named families, each told in a line, so no group is reduced to one food.
Balance: small and once only.

### i26-a27 A summer Pride picnic in Walla Walla (S, 🟡)
In June, a Walla Walla stop for a family-friendly Pride picnic in the park with music, food trucks and local groups' tables.
Seasonal STOPS entry for June, $10, fx {happy:3, community:1}. Plain description, no politics in the text.
Balance: one month a year, small effect.

### i26-a28 A valley culture calendar in one data table (S, 🔴)
One table lists every cultural date the game uses (fiestas patrias, Día de los Muertos, the powwow, threshing day, Pride, Celebration Days) with its weeks, town and kind. Stops and events read their dates from it.
New const CULTURE_DAYS in js/state.js; STOPS and events check a helper like cultureWeek('muertos') instead of hard-coded months.
Makes i16-a33 (holidays on the right week) and i12-a21 (festival weeks) easier.
Balance: no direct effect.

### i26-a29 Community readers for culture scenes (S, 🔴)
Before any culture content ships, a short checklist and a 'reviewed by' note: a Spanish speaker for the Spanish lines, and an offer to Tamástslikt or CTUIR staff to read tribal history text. No sacred or ceremonial content, ever.
Adds a culture section to the content guide (i7-b05) and a flag on events (reviewed:true) that the content checker (i7-b02) warns about if missing on tagged culture content.
Balance: process only.

### i26-a30 'Learned something' badges for visiting (S, 🟠)
A small set of badges for culture and history visits: Tamástslikt, Whitman Mission, the mercado, fiestas patrias, threshing day, the sweet onion card. Collecting five gives a one-time community lift.
New BADGES entries in js/features.js keyed to the stops and events above. Five gives 🤝+3 once.
Balance: every visit costs money and a trip slot, so the lift is paid for; once per life.

### i26-a31 Saturday Spanish story time at the library (S, 🟡)
If you have little kids, the library's bilingual story time is a cheap Saturday outing. Kids pick up words in both languages and you meet other parents.
Library place action (js/outabout.js), $0, kids under 7: ☺+2, 🤝+1; capped at once every 4 weeks.
Balance: free but capped, and only for players with young kids.

### i26-a32 Teach a coworker to drive the forklift, learn some Spanish back (S, 🟡)
At the onion shed or food plant, a coworker offers a trade: you help them study for the forklift card, they teach you work Spanish. Both of you get a little better at the job.
Work event for onion and foodplant jobs, once per job: trade (people practice 2, Spanish practice 2 if i12-a19 exists, small raise chance for both) or no thanks.
Shows both people as skilled.
Balance: once per job.

## Ideas 26: Playtest of the newest content

Ideas from headless 2-year and 5-year playtests (60 games) of Out and about, the 60 road and work events, local jobs, records and legacy.

### i26-b01 Out-and-about players in the balance sim (S, 🔴)
An idle bot that only taps the free farm counter and the $12 grocery visit each week rose from 38 to 48 in 2-year games, close to the 50 ceiling.
Playtest: idle 38 → 48 (2 years), careless 67 → 72, every good bot +8 to +12, with the happiness, health and community parts at 100.
Add `idleV` (farm counter + Shop local) and `carelessV` (2 random visits) to STRATEGIES in tests/sim.test.mjs, under CEILING.
Balance: this is the guard rail. It changes no rules.

### i26-b02 Free and $12 visits stop carrying an idle life (S, 🔴)
McGrub's farm counter is free every week and Shop local is $12, and together they took an idle player's community part from 43 to 78.
Playtest: idle community part 43 → 78 (2 years) and 52 → 90 (5 years) from these two visits alone.
js/outabout.js visit(): mcgrub gives 0 unless farmhand, ag tech or a wheat lease (otherwise once per 13 weeks); basket community only if 4+ weeks since the last.
Balance: lowers the idle ceiling and leaves real choices (coffee, jam, yoga) alone.

### i26-b03 Bug: the $300 will is never read (S, 🔴)
Writing a will at Mother Hubbard's sets S.out.will, but finish() never passes it to the grandkid and startLegacy ignores it, so the will buys only +2 happiness.
Checked headless: a parent with a will and $300,000 passed the same $151,250 as a parent without one.
Add will to the parent object in finish() (js/turn.js) and use it in startLegacy (js/features.js); Help line in js/help.js.
Balance: only a Lifetime ending is affected; a will costs $300 and the gap is 10% of the share.

### i26-b04 What's new for the Out and about update (S, 🔴)
WHATS_NEW has only a 0.2.0 list and VERSION is still 0.2.0, so players who already saw it will never hear about Out and about, the Main Street map, 7 local jobs, 60 new events or records.
js/ui.js WHATS_NEW: add the next version, made from the CHANGELOG Unreleased "Added" lines (short).
tests/rules.test.mjs: WHATS_NEW must have a key for the version being released.
Balance: none.

### i26-b05 Things to do under 21 at the tasting room and wine bar (M, 🔴)
A fresh 18-year-old never turns 21 in a 2-year game, so Grenache & Gather and The Royal Brick show "Open this week" with nothing to do, and Grenache Fest never fired in 60 games.
Playtest: Grenache Fest 0 of 60 games; Music night only in 5-year games.
js/outabout.js PLACES: add non-min21 acts at gather and brick; OUT_EVENTS: an all-ages version of Music night.
Pins and list say "21+" when nothing is doable (mainStreetSVG, placeLine).
Balance: same scale as other visits; the weekly cap still applies.

### i26-b06 Traffic school only once in a while (S, 🔴)
In the Speeding ticket event, traffic school (-$60, -1 happiness) beats paying (-$160, -2) every time.
Choice sweep: traffic school is better on every count.
js/events.js ROAD_EVENTS: S.trafficSchool turn and S.ticketUntil; commuteCost or vehicle upkeep reads it.
Balance: costs only careless drivers, and only a little.

### i26-b07 Pricey visits do something cheap ones can't (M, 🟠)
The smart visitor bot made 1,800 jam visits, 1,372 yoga visits and 822 coffee visits, and almost never chose the spa, the chef dinner or pasta, because the weekly cap makes price buy nothing.
Playtest visit counts: jam 1,800, yoga 1,372, coffee 822, pasta 157, spa and chef dinner almost never.
js/outabout.js visit(): spa sets a short wear shield read in js/turn.js; date acts set S.dateUntil, which lowers the odds of "A rough patch" (js/events.js).
Balance: the effects are protective, not points, so they don't raise the score ceiling.

### i26-b08 The Little Kiss takes reservations (M, 🟠)
The "Somebody canceled, you've been trying for weeks" event fired 72 times in 60 games (up to 5 times in one game), even though you can walk in any week from Out and about.
js/outabout.js: pasta acts become "Reserve a table" (S.out.resv = turn + 3); the visit happens that week, and the Home card reminds you.
OUT_EVENTS "A table at The Little Kiss": only when S.out.resv is set, with yr:1.
Balance: same effect, just planned; fewer repeats in the town pool.

### i26-b09 Business events once a season each (S, 🟠)
The bluegrass jam event (64 times) and the Little Kiss table (72) were 9% of all town events and crowd out the older town events.
Playtest: business events were 16% of town events; jam and Little Kiss alone were 9%.
js/turn.js evCd: a cd:13 field on OUT_EVENTS, and a shared S.evCd.biz.
Balance: neutral; the older events get their share back.

### i26-b10 Commute filler events once a year (S, 🟠)
Train crossing in Pasco (-1 happiness or -$8) fired 4–5 times in a 5-year Pasco game, while Spring festival in Pasco fired once in 60 games and Balloon festival twice.
Repeats: Train crossing, Flat tire, Stranded driver and Audiobook fired 4–5 times in one game. Rare: Spring festival 1, Balloon festival 2, Hanford tour 3, Wrong pump 2.
js/events.js ROAD_EVENTS: add yr to the fillers; adjust w on the festivals.
Balance: neutral; same road odds, more variety.

### i26-b11 Lift operators drive the Bluewood road (M, 🟠)
The ski-lift job counts as a Dayton commute (11 miles), so it never gets road events.
Playtest: the tripper bot with the lift job had 0 road weeks from its commute.
js/events.js commuteOneWay/roadTown: in ski season the lift job drives to Bluewood; the chains and snow events can then come up.
Balance: a bit more winter risk for one low-stress job; fits its 0.1 stress.

### i26-b12 The Bluewood pass on sale at the Dayton stop (S, 🟡)
The season pass is sold only by an October road event, so a Waitsburg worker who never commutes can't plan for powder days.
js/features.js trip stops: a Dayton stop "Bluewood pass office" that sets S.skiPass = skiSeason().
Balance: the same price; the pass only pays off if Powder day comes up.

### i26-b13 A second choice for one-button road and work events (M, 🟠)
8 of the 60 new events have just one button: Deer on Highway 12, Road-construction detour, Wrong pump, Pothole season, Hanford tour, Employee of the month, Customer compliment and Payroll error.
Different from showing them as news cards: this makes them choices.
Deer: brake hard or hold the lane (a chance of a big repair bill). Employee of the month: keep the parking spot or give it to a coworker (+community).
js/events.js ROAD_EVENTS and WORK_EVENTS. Balance: each fork trades money for a stat, no free wins.

### i26-b14 Every good deed costs a little (M, 🟠)
In the choice sweep, many new events have a kind option that wins on every count: help the stranded driver, return the wallet, go to the holiday party, mentor the new hire, talk out a conflict, go on the paid conference.
Choice sweep: in all of these the other option was worse on every stat.
js/events.js: use dayPay(), kidsAtHome() and S.partner in the go() functions.
Balance: careful players still come out ahead; careless random picks lose a little.

### i26-b15 The audiobook choice: two buttons, one result (S, 🟡)
When you aren't taking classes, "Learn something" and "Music and coffee" both give +2 happiness.
js/events.js "An audiobook habit on the commute": practice() on the learn branch.
Balance: the same size of gain, just a different kind.

### i26-b16 Snapping at a customer goes in your file (S, 🟡)
"Snap back" in the rude-customer event averages +0.6 happiness and has no cost at work, so the write-up means nothing.
js/events.js "A rude customer": on the write-up branch, S.raiseBoost -= 0.1.
Balance: small; touches only service jobs.

### i26-b17 Better coverage covers the clinic (S, 🟠)
medBill() is used in only 3 places, and one of them ("Feeling run down") never fired in 60 games, while the cheaper plan pays $480 in cash, so cheap always wins.
js/outabout.js visit(): the clinic cost goes through medBill; js/features.js appointment stops too.
The cheaper plan pays $40 a month instead of one lump in January.
Balance: a fair choice for players who look after their health; no new points.

### i26-b18 Staff perks where you work in town (M, 🟠)
Seven new jobs are at Out and about places, but only the ag tech gets anything at their own workplace.
js/outabout.js: a PERKS table by job id, read in visit(), the food bill (js/turn.js) and the home loan (js/ui.js).
Shown on the business card under "Work here".
Balance: each perk is worth about $10–30 a week, so a lower-paying local job becomes a fair choice, not a better one.

### i26-b19 Work events show on your workplace pin (S, 🟡)
WORK_SPOT puts the barista, grocery clerk, reporter, teller, apprentice and medical assistant all on the general Main Street pin, so work events never show on your own shop's pin on the close-up map.
js/events.js eventPlace() and js/outabout.js bizRecent(): use job().place when it exists.
Balance: none.

### i26-b20 Smaller tap areas on the Main Street close-up (S, 🟡)
Each pin has an invisible tap circle 42 units wide.
Headless tap test: a tap on the empty street opened the wrong shop, and a tap halfway between the bean and the jam opened the jam.
js/outabout.js mainStreetSVG(): r="42" → about 24; move x/y in PLACES.
Balance: none.

### i26-b21 Places you can't use yet say so in the list (S, 🟡)
The list shows Mother Hubbard's as "Open this week · from $300" to an 18-year-old, who can't write a will until 25, and shows wine places as open to anyone under 21.
js/outabout.js placeLine() and outSheet(): check shownActs plus actBlocked for minAge.
Balance: none.

### i26-b22 Celebration Days is one week, not all of May (S, 🟡)
festivalWeek() is true for the whole month, so the private Tonnage space is open 4–5 weeks in a row in May.
js/outabout.js festivalWeek(): curMonth() === 4 and day of month 15–21.
Help line in js/help.js. Balance: slightly fewer jam visits in May.

### i26-b23 Heir names: "Mary I" and generation 40 (S, 🟡)
heirName("Mary I") gives "Mary I II", and "Ann Lee XL" gives "Ann Lee XL II" because the numeral table has no L.
Found headless by calling heirName on 11 names.
js/features.js ROMAN and heirName(). Balance: none.

### i26-b24 The grandkid's first Journal line is a milestone (S, 🟡)
logKind() files "…turns 18 and picks up where grandparent… left off" under Events, so the start of a new generation is missing from Milestones.
js/state.js logKind(): add these to the "mile" pattern, or pass k:"mile" from startLegacy.
Balance: none.

### i26-b25 Legacy lives kept apart in records (M, 🟡)
A grandkid starts with up to $250,000 and a name people know, but their Lifetime score goes into the same best as a first life that started with $1,500.
js/turn.js finish(): bestKey gets a "-g2" suffix when S.gen > 1; js/ui.js recordsSheet adds the row.
Balance: keeps the Lifetime best fair.

### i26-b26 Event coverage report in the sim (M, 🟠)
In 60 games (10,920 weeks), Grenache Fest, Year-end bonus and A remote-day trial never fired, 10 events fired 1–3 times, and the Little Kiss table fired 72 times.
tests/sim.test.mjs already counts events per game: add the table to the job summary (a report only, it never fails the run).
Balance: a tuning tool.

### i26-b27 Weekday-only places cost a commuter half a day (M, 🟠)
The bank, clinic, law office, farm counter and trades keep weekday hours.
js/outabout.js PLACES: a weekday:true flag; actWhat and visit() add dayPay()/2 for commutes of 40+ miles.
Different from a weekend pick: this makes the hours on each card count.
Balance: costs only long commuters, who already earn the most.

### i26-b28 Shop local instead of the big-store run (S, 🟡)
Burg Basket's "Shop local this week" is an extra $12 on top of a food bill you already pay, and it stacks with stock-up runs.
js/outabout.js basket act, and the food line in js/turn.js; the Around town card shows which one you chose.
Balance: a real choice between money and town, and no free community.

### i26-b29 Your regular spot on the end screen (S, 🟡)
S.out.visits is counted but never shown.
js/outabout.js: S.out.count[pid]++ in visit(); js/turn.js finish() and the review sheet.
Balance: none (no points).
