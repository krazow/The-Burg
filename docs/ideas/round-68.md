# Ideas round 68

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 68: Fall and winter

The cold half of the year in Waitsburg, from the deer opener to the first blackbirds, built so planning ahead pays and skipping it costs.

### i68-a01 Winter prep list on Home each October (S, 🔴)
A card on Home (ui.js) from October to the first snow, read from a WINTER_PREP table in state.js.
Each item maps to an existing or new event (pipes freeze, furnace, dead battery) and cuts its cost or odds.
Doing an item costs a small fee or a focus week; nothing happens on its own.
Balance: idle and careless bots skip it and pay full winter costs, so careful play pulls ahead.

### i68-a02 Plastic on the windows and door sweeps (S, 🟠)
A road-free town event in October (events.js) with a S.sealed = year flag.
The monthly utilities line in turn.js checks the flag November to February.
Renters get half the saving (the landlord won't do the storm windows).
Balance: saving is small and only for players who answer the event.

### i68-a03 The furnace won't light on the first cold night (M, 🔴)
New town event, when: November or December, owners only, once a year at most.
Handy level 2+ makes the do-it-yourself choice safe; below that it can fail and cost more.
Winter prep 'furnace tune-up' item cuts the odds by two thirds.
Balance: a cost, not a reward; preparation is the only way to dodge it.

### i68-a04 Space heaters in every room (S, 🟡)
Life tab toggle for renters in the old apartment or fixer, December to February.
Adds to utilities in turn.js and nudges the existing house fire event weight a little.
Off by default; the outlook shows the extra bill.
Balance: a trade of money for comfort, never a net gain.

### i68-a05 Heat with wood: a stove for the house (L, 🟠)
New home upgrade in features.js with S.stove; a fall choice sets the heat source for the winter.
Cutting your own uses Get outside weeks in October (health up, a chance of a hurt back).
Ties into the existing firewood and chimney ideas: an unswept chimney raises the house fire odds.
Balance: only pays back over several winters and needs real weeks spent, so idle play can't use it.

### i68-a06 Prebuy propane in August, not January (S, 🟡)
Event for the hobby farm and rural homes in August (events.js), S.propane = year.
A January bill line in turn.js charges the winter price if you didn't prebuy.
The money outlook shows the coming January bill.
Balance: rewards planning ahead; skippers just pay more.

### i68-a07 Blow out the sprinklers before the hard freeze (S, 🟠)
Town event, October, owners only; S.drained = year.
An April check in turn.js rolls the split line if not drained (40%).
Part of the winter prep list.
Balance: a small cost avoided, no gain for doing it.

### i68-a08 Dead battery on the first cold morning (S, 🔴)
Road event, December or January, weight up for older vehicles (CARS age in state.js).
A new battery from the winter prep list prevents it for 3 years.
Community 30+ turns a missed half-day into a coffee with a neighbor.
Balance: costs time and money; community earned through play softens it.

### i68-a09 Frost on the windshield: leave ten minutes early (S, 🟡)
Road event, November to February, shown at most twice a winter.
The 'late' outcome feeds the existing work standing used for raises.
Carport or garage homes never see it.
Balance: tiny swings, mostly flavor.

### i68-a10 Opening morning empties the shop (S, 🟠)
Work event, October, for trades, farm and shop jobs (job tags in state.js).
Covering pays overtime and raises standing; going chains into the existing Hunting season event.
Office and remote jobs never see it.
Balance: either choice is fair; overtime is capped like other work events.

### i68-a11 Hunters' breakfast at 4 a.m. (S, 🟡)
Town event, the opener week of October.
Eating gives a small bonus to the hunting event's success roll that season.
Cooking takes the week's Show up for town credit toward the fall goal.
Balance: small, one-week effects.

### i68-a12 Blaze orange on your Get outside weeks (S, 🟡)
Outabout.js prairie and Blues trail stops check the month (October to mid-November).
A $15 orange vest bought once removes the risk for good.
Plain text: 'A shot cracked across the draw. You headed back to the truck.'
Balance: a one-time $15 fix; no score gain.

### i68-a13 The meat processor is three weeks behind (S, 🟡)
Follow-up to the Hunting season success choice in events.js.
Cutting it yourself uses the handy or cook skill; a bad roll loses part of the meat.
The freezer ideas from earlier rounds read the result.
Balance: trims the hunting payoff instead of adding to it.

### i68-a14 Build the haunted house in the empty storefront (M, 🟠)
A three-step story chain (S.chains) across October Show up for town weeks.
Finishing all three gives community and a happy bump; skipping a week weakens the ending text, not your stats.
Kids at home add a 'take the little ones through the not-scary hour' choice.
Balance: costs three focus weeks for modest community, same rate as other town work.

### i68-a15 Pumpkin drop from the fire truck ladder (S, 🟡)
Town event, first week of November, one choice plus a skip.
Adds a line to the year in review if you went every year.
No cost; small happy only.
Balance: tiny, free flavor; once a year.

### i68-a16 Thanksgiving drive: Tuesday night or Wednesday (M, 🔴)
Event the week before Thanksgiving when a partner or parent lives west (family data in state.js).
Wednesday rolls on the existing Snoqualmie pass report and snow-chain flags.
A third choice: host here instead, which feeds 'The first year Thanksgiving is at your house'.
Balance: the safe choice costs pay; the risky one costs health and happiness on a bad roll.

### i68-a17 Shop Main Street the Saturday after Thanksgiving (S, 🟠)
Town event, Thanksgiving week, with the Kennewick mall as the other choice (cheaper, drive cost, crowds).
Uses the gas cost from maps.js for the mall trip.
Ties to shop-local ideas already planned.
Balance: trade of money for community at a fixed rate.

### i68-a18 Caroling to the shut-ins (S, 🟠)
Town event, December, counts toward the winter town goal.
Kids add +1 happy each.
Cold night: -1 health if your health is under 40.
Balance: one focus-free event, small.

### i68-a19 Drive the holiday basket route (S, 🔴)
Town event, December, after the fall food bank goal (SEASON_GOALS) is done.
Costs a gas trip (maps.js) and gives community plus a later event 'a farmer you delivered to offers work at harvest'.
Skipped if your vehicle is in the shop.
Balance: costs money and time; payoff is a future job lead, not cash now.

### i68-a20 Christmas cookie exchange (S, 🟡)
Town event, December.
Cook skill practice on the bake choice (practice() in features.js).
Store tray: -$25, smaller community bump.
Balance: tiny, flavor.

### i68-a21 The quiet week between Christmas and New Year (S, 🟠)
Work event, last week of December, for jobs with paid leave flags.
Taking it off gives a strong Rest week (happy, health) without the rut counter moving.
Retail and care jobs get the opposite: a busy returns week.
Balance: Rest bonus is capped by the existing Rest cap.

### i68-a22 Salt the front steps or risk a fall (S, 🟠)
Town event, December to February, owners and house renters.
Older players (60+) take a bigger health hit.
Part of the winter prep list: a salt bucket bought in fall covers the winter.
Balance: a small cost avoided; no upside to skipping beyond $8.

### i68-a23 Follow the sand truck at 25 (S, 🟡)
Road event, December to February, commuters 10+ miles.
Passing uses the existing ditch and insurance outcome (youPay()).
Winter tires lower the risk on the pass choice.
Balance: the safe choice costs a little standing; the fast one risks a deductible.

### i68-a24 Check the road cams before you leave (M, 🔴)
A toggle in ui.js shown November to March; turn.js reads it when picking a road event.
Remote-day jobs get a free stay-home; others lose a day's pay.
Off by default; it's a habit the player builds.
Balance: trades pay for safety; careless bots never turn it on.

### i68-a25 Move your car for the plow (S, 🟡)
Town event, the first heavy snow week, for homes on Main Street streets.
Garage homes skip it.
Ties to the existing snowplow berm idea for the 'didn't move' result.
Balance: a small fine avoided.

### i68-a26 River ice on the Touchet: keep the kids off (S, 🟠)
Family event, January, with kids 6 to 14.
Uses the Touchet River pin from maps.js in the result text.
The bad roll: -8 happy, a doctor bill, community +2 from the neighbor who helped.
Balance: no reward for the risky choice.

### i68-a27 Seed catalogs on the kitchen table (S, 🟠)
Event or Home card in February for players with a garden (garden ideas in features.js).
Sets S.gardenPlan = year; the spring garden roll reads it.
Plan week gives +2 happy against the winter blues.
Balance: improves a planned-play feature only.

### i68-a28 Winter reading challenge at the library (S, 🟡)
Library pin in maps.js shows the card January to February.
Six ticks give +1 practice in a chosen skill; no money.
Kids join with their own card for a family happy bump.
Balance: rewards weeks you'd spend anyway; no stacking with summer reading.

### i68-a29 Cabin fever: the February itch (M, 🟠)
Tracks S.lastTrip; fires in February if no Out and about trip since November.
Each choice uses an existing trip (outabout.js) at a small discount.
Ignoring it: -4 happy and a slower happy recovery for 3 weeks.
Balance: costs money to fix; players who took trips never see it.

### i68-a30 Red-wing blackbirds on the Touchet: spring's coming (S, 🟡)
A short notice in the week strip (ui.js), not a full event.
Doubles the happy part of one Get outside week only.
Rotates with other first signs: buttercups on the hill, the first robin, the frost going out of the ground.
Balance: one-week, tiny.

### i68-a31 Freezing rain, not snow (S, 🟠)
Road event, December to February, weight 2.
Staying in costs a day's pay unless remote; driving rolls the ditch outcome at double odds.
Owners can lose a branch on the roof (handy skill cuts the bill).
Balance: a cost event; preparation (chains, tires, cams) softens it.

### i68-a32 Shovel your way through the winter goal (M, 🟠)
Changes the winter SEASON_GOALS entry in state.js to read a S.snowWeeks counter.
A mild winter needs fewer weeks; a big one gives more chances.
Help text in help.js explains the snow bonus.
Balance: the goal still needs the same focus weeks; it only follows the weather.

## Ideas 68: Help for the new systems

The four open PRs and the money build add many systems; this round says where each belongs in Help, gives short plain text for each, and names where an in-game explainer can replace Help text.

### i68-b01 One Help order once PRs #161–#164 land (M, 🔴)
After the four PRs merge, Help has 22 sections in the order they were added. Set one order by when you need them, with the new systems in their own homes.
Order: Getting started, Your week, Finding your way, Stats, Money, Getting a job, Moving up at work, School, Homes, Savings, Later life and legacy, Family, Events, Maps, Trips, Out and about, Farm and ranch, Goals, Score, Saves, Settings, Install.
Do it as one pass in js/help.js after the merge so the four PRs' edits to the week, jobs and school text do not fight.
Balance: text only, no effect.

### i68-b02 Fix the glossary's net worth to match the game (S, 🔴)
The clarity PR's tappable "net worth" leaves out index funds, wine futures and the home equity loan that main already counts. Build the line from one list that netWorth(), the Stats section and the glossary all read.
Text: "Net worth: your cash, home equity, vehicle, 401(k), business and index funds (today's value), plus wine futures at what you paid, minus what you still owe on truck, school and home equity loans. It is 30% of your Life Score."
Files: GLOSSARY.networth in js/help.js (#164), Stats section, a NW_PARTS list next to netWorth() in js/state.js.
Balance: no effect.

### i68-b03 Split Jobs into "Getting a job" and "Moving up at work" (M, 🔴)
With #162, the Jobs section grows to 13 paragraphs plus a big table. Split it: getting hired (applying, interviews, offers, references, commuting, carpool, bus, remote) and keeping and growing a job (raises, ladders, apprenticeships, unions, layoffs, seasonal and federal work).
Each half fits on about four phone screens instead of nine.
Files: js/help.js S2 entries "jobs" becomes "hired" and "work"; keep the job table in "hired".
Balance: no effect.

### i68-b04 Plain text: job ladders (S, 🔴)
Replace the ladder paragraph with a shorter one that leads with what the player does.
Text: "🪜 Every job has two steps up, like farm hand, then lead hand, then farm manager. After a year your boss can offer the first step (+12% pay). The top step (+25%) takes three years plus more school than the job asks, or People skill 2. Each step is a little more stress. A new job starts you at the bottom. The Jobs tab shows where you are."
Files: js/help.js "work" section (from #162). Numbers read from the ladder data, not typed in.
Balance: no effect.

### i68-b05 Plain text: unions, in one paragraph (S, 🟠)
A short union paragraph that names the trade-off in one line and keeps the 🪪 mark the job table uses.
Text: "🪪 Union jobs (rail yard, Hanford, nurses, paraeducators, corrections, teachers, electricians, linemen) take 1.5% of your pay as dues. In return you get a 1.5% raise every January and half the layoff risk. Every few years there is a contract vote: take the 2% deal, or strike for a few weeks on 40% pay for a likely 6% raise."
Job list from JOBS.filter(j => j.union), dues from UNION_DUES.
Balance: no effect.

### i68-b06 Plain text: jobs that change with the calendar (S, 🟠)
Merge the apprenticeship and seasonal-work paragraphs into one "Jobs that change over time" block: both are about pay that moves on a schedule.
Text: "Some jobs change on a schedule. 🔧 Apprentices (electrician, plumber, lineman; trade certificate needed) start at 60% of full pay and step up each year until they are journeymen. Leaving starts it over. ❄️ Seasonal jobs (the Bluewood lift Dec–Mar, harvest trucking Jul–Aug, the Forest Service crew Jun–Sep) lay you off when the season ends and call you back when it returns. Pair a winter job with a summer one."
Files: js/help.js "work" section.
Balance: no effect.

### i68-b07 "Working for the government": one paragraph for public jobs (M, 🔴)
Pensions sit in Savings, furloughs and clearance in Jobs, unions in a third place. Put what a public job means in one block in "Moving up at work", and leave a one-line pointer in Savings.
Text: "🏛️ Public jobs pay steady and rarely lay off. Many earn a pension: 1.5% of your best pay there for each year, paid monthly once you retire, but only after 5 years in public jobs (vesting). Federal jobs (Hanford, the lab, the dam, the VA, the Forest Service) can be furloughed in a shutdown: no pay for a few weeks, then all the back pay at once. Hanford and the lab need a clearance: 12 weeks at 80% pay, and deep debt can sink it."
Numbers from PENSION_RATE, PENSION_VEST, CLEAR_WEEKS, CLEAR_PAY.
Balance: no effect.

### i68-b08 School becomes "School, programs and certificates" (S, 🔴)
Rename the section and lead with the choice the player faces: a diploma for big jobs, a certificate for a quick door.
Text: "📚 Take classes works toward one of two things. A diploma (certificate, associate, bachelor's) takes months and opens most better jobs. Pick a program first and the diploma becomes your major: +10% pay and better odds at matching jobs. A short certificate (CDL, welding, phlebotomy, pesticide, notary) takes 4–8 weeks and a one-time fee, with no tuition. Its weeks come first, then classes go back to your diploma."
Keep the certificate table; drop the programs table (see the program-picker explainer idea).
Balance: no effect.

### i68-b09 The program picker shows its jobs, so Help drops the table (S, 🟠)
On the Life tab, each program button lists its matching jobs in small text. Help then needs one sentence, not a six-row table.
Files: the program picker in js/ui.js (#162) reads PROGRAMS[k].jobs; remove progRows from js/help.js.
Help keeps: "Each program lists its matching jobs on the Life tab."
Balance: no effect.

### i68-b10 First-time explainers for the jobs and school systems (M, 🔴)
Add FIRST cards (from #164) where #162's systems open: the first interview, the first offer you can negotiate, the first union job, the ladder card, the program picker and the certificate sign-up. Help can then drop the interview, offer and reference paragraphs to two lines.
Example: interview: "🗣️ New: Interviews. Pick how to answer. Being straight helps a little, selling hard needs People skill, and Decide later keeps today's odds."
Files: FIRST table in js/help.js, calls in js/ui.js Jobs and Life tabs. One card per screen, once per device, numbers from data.
Balance: no effect; cards only explain.

### i68-b11 First-time explainers for the money systems (M, 🔴)
FIRST cards for the investing card, the insurance sheet, the will, long-term care at 55, the first property tax bill, the first collections warning and stored wheat. Each is one or two sentences with the real numbers.
Example: will: "📜 New: A will. $300 from age 25. With one, your grandkid gets their share and the family home right away. Without one, the house is sold and probate takes 10% and 6 months."
Files: FIRST in js/help.js; js/features.js cards (investCard, will, LTC).
Balance: no effect.

### i68-b12 Cut Help text the game already says at the moment (S, 🔴)
Several sheets already explain themselves well: the refinance sheet (break-even months), the bankruptcy sheet, the harvest sell-or-store event, the care choice and #164's confirm sheet. Help keeps one line each and says "the sheet explains it when it comes up".
Saves about 350 words from Money, Homes and Savings.
Files: js/help.js money, home and savings sections.
Balance: no effect.

### i68-b13 "Later life and your legacy" section (M, 🟠)
Move the will, long-term care, care choices, wintering in Arizona and the scholarship out of Savings, and Legacy out of "Skills and your own business", into one section ordered by age.
Text opener: "In a Lifetime game, the last chapters have their own choices. Most of them come with a sheet that explains the cost when the time comes."
Savings keeps 401(k), funds, wine futures, Social Security and pensions.
Balance: no effect.

### i68-b14 Plain text: Social Security (S, 🔴)
A shorter Social Security paragraph that says what grows it in everyday words.
Text: "🇺🇸 Social Security pays every month once you retire. It grows with each year you drew a paycheck (35 years is a full career) and with how well you were paid. With no work record you get 60% of the standard check; a long, well-paid career gets up to 140%. Side hustles and your own business don't count."
Numbers from SS_PAY and ssFactor() limits.
Balance: no effect.

### i68-b15 Plain text: insurance in a three-row table (S, 🟠)
Replace the 70-word insurance paragraph with one sentence and a small table: what you carry, what it costs you after a loss.
Rows: Vehicle full coverage: pays after $500 / liability only: you pay it all. Renters: pays your things after $250. Homeowners: pays after your deductible ($500, $1,000 or $2,500).
Sentence: "Cheaper coverage saves a little each month and costs a lot in a bad week."
Files: js/help.js money section. Balance: no effect.

### i68-b16 Plain text: the housing market and refinancing (S, 🟠)
Two short sentences each, leading with what to do.
Text: "🏡 Each January the market turns hot, normal or slow. Hot years cost 5% more to buy; slow years 3% less. Mortgage rates move too, and yours locks when you buy. If rates fall a full point below yours, Refinance shows up on the Life tab and tells you how many months it takes to pay off the 2% closing cost."
Balance: no effect.

### i68-b17 Plain text: index funds without the fear (S, 🟠)
A paragraph that explains the drop and why holding is the usual answer, without promising it.
Text: "📈 Index funds grow about 6% a year on average. About one year in five the market drops a quarter at once. Selling in a drop locks the loss in; holding has usually come back within a few years. Only put in money you won't need for bills."
Balance: no effect; it states odds the game already has.

### i68-b18 Plain text: collections and bankruptcy as steps (S, 🔴)
Write debt as a numbered ladder so the player sees how far they are from each step.
Text: "1. Below $0: about 1.5% interest a month. 2. 12 weeks below $0: collections, a $150 fee and calls that cost happiness each week. 3. -$15,000: a warning. 4. -$40,000 (-$25,000 on Hard): leave town, or file for bankruptcy once a life. Bankruptcy wipes the debt but takes funds, wine futures, a business and a nice vehicle, blocks loans for 7 years and costs 8 points."
Numbers from COLLECT_WEEKS, COLLECT_FEE, BK_WEEKS, BK_PENALTY.
Balance: no effect.

### i68-b19 Farm and ranch: a section built as a calendar (M, 🔴)
Wheat and cattle rules are one long sentence today. Give them their own section with a month table.
Rows: April crop insurance ($540). July wheat price set. August harvest: sell now or store (1% of the crop a month). Each month stored price moves. November–March hay for the cows (more in a hard winter). Spring calves. October livestock auction. Any 6 weeks without Get outside risks losing a cow.
Files: js/help.js new "farm" section, taken out of "grow". Numbers from CROP_INS and BIZ.
Balance: no effect.

### i68-b20 A money calendar: what happens each month (M, 🟠)
One table in Money listing the yearly money dates the new systems added, so nothing feels random.
January: housing market, mortgage rates, vehicle tabs, union raises. April and October: property tax. April: crop insurance. July: wheat price. September–November: wine futures. October: cattle sale. December: the Arizona choice.
Built from data where it can be. Files: js/help.js money section.
Balance: no effect.

### i68-b21 A "by age" table (S, 🟠)
A small table of what opens at each age: 21 drinks, 25 a will, 50 health care costs, 55 long-term care insurance, 62 retirement, 75 care choices.
Read from WILL_MIN_AGE, LTC_AGE, CARE_AGE and the retire age. Lives in "Later life and your legacy".
Balance: no effect.

### i68-b22 Help shows your own retirement estimate (M, 🟠)
When Help is opened from a game, the Savings section adds one line: "For you today: Social Security about $X a month (Y work years), pension vested or N years to go, 401(k) about $Z a month at 4%."
Reads ssPay(), pensionVested(), S.pensionYears and S.k401; hidden from the title screen and in the practice life.
Balance: no effect; it shows numbers the game already has.

### i68-b23 Your week: rewrite for Plan, Auto until and Undo (S, 🔴)
After #163 and #164, the week section has six paragraphs about skipping. Fold them into one short list.
Text: "⏩ 4 and ⏩ 13 play weeks with your focus or your plan. ⏭ Auto plays until something needs you, or until what you chose: a stat under 35, cash under $0, or a new season. 🗓 Plan rotates up to 4 focuses, one a week; picking by hand pauses it for one week. ↩ Undo on the Life tab takes back changes until you end the week, except anything that rolled the dice."
On small phones: "hold End Week for these." Balance: no effect.

### i68-b24 Help states exactly how a plan counts for fade and ruts (S, 🟠)
#163 says a focus "that comes up week after week still fades", which leaves players unsure whether a rotation avoids ruts. Check focusFx() and write the true rule in one sentence.
If streaks count only weeks in a row: "A plan that changes focus every week never fades or ruts." If not, say how it counts.
Add a rules test that the sentence stays true.
Balance: no effect; rotation bot scores already sit between careless and planner.

### i68-b25 Animations joins Settings, and Help says so (S, 🟠)
#164 puts ✨ Animations in the Menu because Settings did not exist on its branch; #161 adds Settings. Move the toggle into Settings and add one line to the Settings help.
Text: "Animations: stat bars slide and cash counts up after each week. Off, or when your phone asks for less motion, the numbers just change."
Files: js/ui.js Menu and Settings sheet, js/help.js settings section.
Balance: no effect.

### i68-b26 Settings help shrinks to two lines (S, 🟡)
Each Settings row already names what it does. Put the one-line descriptions under each row in the sheet, and cut the Help section to two lines.
Help keeps: "Settings (Menu or title screen) change how the game looks, sounds and feels on this device. They never change the game's numbers."
Balance: no effect.

### i68-b27 "Finding your way" takes in the Tips section (S, 🟠)
#164's new section and the old 💡 Tips both tell you how to play well. Merge them: checklist, Next step, explainers, tappable words, then five tips.
Drop the tips that the checklist or Next step now say (401(k) match, watch the strip).
Balance: no effect.

### i68-b28 New glossary words for the new systems (S, 🔴)
Add tappable words with one-line meanings: vesting, probate, deductible, liability only, home equity loan, refinance, collections, union dues, apprentice, major, certificate.
Example: vesting: "Staying long enough to keep a pension: 5 years in public jobs. Leave sooner and it's gone." Deductible: "What you pay first after a loss before insurance pays the rest."
Files: GLOSSARY in js/help.js; numbers read from data.
Balance: no effect.

### i68-b29 Help uses the same tappable words as the game (S, 🟠)
Help paragraphs call term() for glossary words the first time each appears in a section, so a definition reads the same in Help and on the Life tab.
Files: js/help.js guideHTML(). Only the first use per section, to keep the page calm.
Balance: no effect.

### i68-b30 Help search indexes the new systems' words (S, 🔴)
When the planned Help search (round 44) is built, give each section a words list that covers the new systems: pension, vest, Social Security, will, probate, deductible, renters, property tax, refinance, rate, hot market, cattle, calves, hay, bushel, elevator, crop insurance, index fund, market drop, collections, bankruptcy, union, strike, dues, furlough, shutdown, clearance, apprentice, CDL, welding, notary, major, program, promotion, ladder, interview, reference, bonus, bus, remote, theme, dark mode, text size, sound, swipe, plan, rotation, auto, undo.
Words live next to each section id in js/help.js S2, so a new section brings its own words.
Balance: no effect.

### i68-b31 Search shows the glossary meaning first (S, 🟠)
A search that matches a GLOSSARY or FIRST word shows that one-line meaning above the paragraph hits, so "probate" answers itself without scrolling.
Files: js/help.js search (when built) reads GLOSSARY and FIRST.
Balance: no effect.

### i68-b32 A legend for the job table marks (S, 🟡)
With #162 the job table shows 🪪, season months, "60% as an apprentice" and "+ CDL". One legend line above the table explains them.
Text: "🪪 union · (Dec–Mar) seasonal · 60% as an apprentice · + a certificate or program it needs."
Balance: no effect.

### i68-b33 "New" tags on Help sections that changed this version (S, 🟡)
A small HELP_NEW list keyed by APP_VERSION marks updated sections with a New chip in the contents for one version, so returning players find the jobs, money and settings changes.
Files: js/help.js contents nav. Cleared on the next version bump.
Balance: no effect.

### i68-b34 A test that every explainer and word has a Help home (S, 🟠)
A rules test checks that each FIRST key, GLOSSARY key and new system flag (union, season, apprentice, needCert, pension, clearance) is mentioned in a named Help section.
Files: tests/rules.test.mjs, a HELP_HOME map in js/help.js.
Stops Help from falling behind the next build.
Balance: no effect.
