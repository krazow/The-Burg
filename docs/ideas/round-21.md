# Ideas round 21

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 21: Writing and voice

Ideas to give the game one narrator voice, more Waitsburg in its words, fewer repeats, and text that notices who you are; all are text-only and leave effects and odds alone.

### i21-a01 Real job names in event text (S, 🔴)
A raise, Layoffs and Your performance review lowercase the job title, so players read "your main street diner cook job" or "your hanford cleanup technician job". A jobWords() helper gives a short place name instead: "Your boss at the grain elevator calls you in."

- `job().title.toLowerCase()` breaks proper nouns (Main Street, Hanford, Bluewood) and reads like a form.
- Add a `short` field to each job in JOBS (state.js, outabout.js): 'the diner', 'Hanford', 'the elevator', 'the clinic'.
- Use it in events.js (A raise, Layoffs, Your performance review) and the ui.js quit and hire logs.
- Text only. No effect changes, so no balance risk.

### i21-a02 Workplace words for each kind of job (M, 🔴)
Work events use the same nouns for every job: "Half the crew is out sick" for a professor, "You messed up an order" for a nurse, "The main machine at work" for a ranch hand. Each job group gets its own words, so the event fits the work.

- Add a WORK_WORDS table keyed by JOB_GROUP in events.js: crew/office/ward/shift, 'an order'/'a report'/'a chart'/'a load', the machine name.
- Rewrite Flu going around, A big mistake at work, Equipment breaks down, Mandatory overtime week and Cover a double shift to use it.
- Example for care jobs: "You mixed up two patients' charts. Nobody got hurt, but someone has to say so."
- Text only. Same odds and effects.

### i21-a03 Retire the repeated punchlines (S, 🟠)
Some lines show up in more than one event and lose their punch. "Your body kept score" (Feeling run down) and "Your back kept score" (Hurt on the job), "Ouch." three times, "Keep your head down" as a button in two events, and "back from its winter break" in both March reopenings.

- Keep each line in the one event it fits best and rewrite the other uses.
- Ouch: Someone catches your eye, Speeding ticket, Your performance review. Keep your head down: Your performance review and New manager.
- Simply Shavings is back and The Junque Sisters reopen (outabout.js) both say 'back from its winter break'. Give the second a different opening.
- Text only.

### i21-a04 A test that catches repeated lines (S, 🟠)
A node check lists every result line and button label used in two or more events, plus stock words that appear too often ("Maybe", "Skip", "Ouch"). Writers see the repeats before they ship.

- New test in tests/ that loads the game data, calls each choice's go() on a stub state and collects the returned strings.
- Fail on exact duplicates across events. Warn when one word opens more than 5 results.
- Today it would flag the 'kept score' pair and five 'Maybe…' declines.
- Build-time only. No effect on play.

### i21-a05 Saying no gets a real line (M, 🟠)
Turning things down often gives a blank: "You passed on it.", "Someone else went.", "You stayed in town.", "Another time." Each decline gets a small detail of what you did instead, like the good one already there: "You heard the parade from your porch."

- Rewrite about 20 decline results in events.js and outabout.js: Free training course, Conference trip, Hunting season, Festival at the Dayton Depot, Cheap flight deal, Workplace fundraiser, The boss offers a weekend gig.
- Example, Hunting season / Pass: "You heard rifles on the ridge at first light and rolled over."
- Saying no stays honest: no new upside is written in.
- Text only. Declines keep their current numbers, so careless 'always skip' play doesn't gain.

### i21-a06 Choice buttons in one voice (S, 🟡)
Decline buttons mix "Skip", "Skip it", "Pass", "Decline", "Not this time", "Not now" and "Not my job". One rule: buttons start with a verb in your own voice and say what you do instead ("Stay home", "Keep your weekend").

- Single-choice buttons get the same treatment: Tax refund's "Nice!" becomes "Open the envelope"; A customer compliment's "Enjoy it" becomes "Take the compliment".
- Touches choice labels in events.js, outabout.js and features.js (fixer, food truck and levee chains).
- Add the rule to the content style guide.
- Text only.

### i21-a07 An exclamation-mark budget (S, 🟡)
Big moments lose weight when every good result shouts: "Promoted!", "Blue ribbon!", "They said yes!", "A baby!", "Hired as … !", "$50! Today is a good day." One exclamation per sheet at most, saved for the moments that change a life.

- Keep it for a baby, a council win, a first home, a long-shot horse.
- Trim it from routine wins: employee of the month, the pie ribbon, found money, job hires in the Journal (ui.js).
- The duplicate-line test can count them per file.
- Text only.

### i21-a08 Text that knows your age (M, 🔴)
The same words play at 19 and at 68: "They said yes! You're seeing each other now." (Someone catches your eye), "You've always wanted to see the world" (The trip of a lifetime), "You and your partner have been talking about kids" at 41. Key events get young, middle and older lines.

- Add ageBand() (under 30, 30–59, 60+) and pick lines from it in about 10 events: Someone catches your eye, Starting a family?, The trip of a lifetime, Wine country weekend, Powder day at Bluewood, A rough patch.
- Example, 64 and asking someone out: "You both laughed about being too old for this, then made plans for Friday."
- Same choices and odds in every band.
- Text only.

### i21-a09 Text that knows where you came from (S, 🔴)
The gas-station old-timer says "He knew your grandparents" even if you picked the City transplant start, whose card says nobody in town knows you yet. Lines that assume roots check S.bg and say something true.

- A friendly regular at the gas station: transplant version, "He wanted to know what brought a city kid out here. You told him. He told you three better reasons."
- Harvest time and Stranded driver get a farm-kid line ("Your uncle's combine is in the next field").
- Touches events.js text functions and BACKGROUNDS in state.js.
- Text only.

### i21-a10 Text that knows who's at home (M, 🟠)
Events rarely notice your family. Fourth of July says "sparklers on the porch" with or without kids, Friday night game never mentions your own kid in the stands, and A kid heads off to college says "your oldest" even with one child. Short riders add the people and dog you actually have.

- Riders for kidsAtHome(), S.partner, S.dog and kid count in 10–12 events: Fourth of July, Friday night game, Windstorm, Celebration Days, Neighbor's moving day, Holiday party.
- Fix 'your oldest' to 'your kid' when there is one child, and use kid names once kid naming ships.
- One extra clause at most, so sheets stay short.
- Text only.

### i21-a11 Text that knows how you're doing (M, 🟠)
When happiness or health is under 30, a few fun events add a line that matches: "You went to the game, but your mind was somewhere else." When both are high, a line says so. The game sounds like it's paying attention.

- A moodLine() helper in events.js reads S.happy and S.health and adds a short tail to 8–10 social events (Friday night game, Celebration Days, music night, the jam).
- Never changes numbers. Never scolds the player.
- Pairs with the red banner already on Home: same facts, said once in story form.
- Text only.

### i21-a12 A last line that fits the life (S, 🔴)
Every Lifetime ending says "passed peacefully … with the whole town at the service", even at community 5. The line changes with community, family and age: a full church, a few close friends, your kids and the dog by the creek.

- Pick from 6–8 endings in turn.js by community band, kids, partner and age.
- Example, low community, kids: "Your kids drove in from Spokane and Boise. They scattered your ashes where you used to fish."
- Same for 'health finally gave out' and the game-length ending ('… is in the books').
- Text only. Kind at every level: low community is quiet, not shameful.

### i21-a13 Leaving town in debt, with some dignity (S, 🟡)
"Buried in debt, … packed up and left Waitsburg." is the only debt ending. A few versions say what you leave and where you go, without blame: "You sold the truck, paid what you could and moved in with a cousin in Yakima."

- Pick by home owned, kids and age in turn.js.
- Keep the fact plain: the game is over and why.
- Matches the tone the respectful-events guide asks for: money trouble shown without blame.
- Text only.

### i21-a14 Decade birthdays that mention your life (S, 🟡)
Birthdays every ten years just say "🎂 Happy 30th birthday!". Each decade gets a line built from your life: "Forty. Still at the elevator, still in the fixer-upper, still the first one at the jam."

- One template per decade in turn.js using job short name, home, kids and a top stat.
- Shows in the week notes as now, and in the Journal.
- Text only, no new rewards.
- Different from birthday gameplay ideas: this is just the words.

### i21-a15 A bigger Tattler, by month, without repeats (M, 🟠)
The weekly Tattler line comes from only 9 lines, picked by S.turn % 9, so the same headline returns every nine weeks. Grow it to about 60 lines tagged by month and season, and don't repeat one within a year.

- TATTLER in outabout.js becomes [{m:[months], t:'…'}]; tattlerLine() picks one that fits the month and isn't in a 52-week memory.
- Examples: 'Pea harvest night shift wants drivers' (June), 'Loose cows on the Coppei road, again' (any), 'Booster club sells out of fireworks by noon' (July).
- Stand-in names only. Works alongside the 'built from your week' idea as the fallback pool.
- Flavor only.

### i21-a16 One spelling for every local place (S, 🟡)
The same road and places go by different names: "Flat tire on US-12" next to "Snow on Highway 12", "the Blues" and "the Blue Mountains", "the Burg" and "Waitsburg". A short word list says which form to use where.

- Rule: 'Highway 12' in text, 'US-12' only on maps; 'the Blue Mountains' once, then 'the Blues'; 'Waitsburg' in facts, 'the Burg' in warm lines.
- Add the list to the content style guide and rename the events that break it (keep EVENT_PLACE keys in sync).
- Text only.

### i21-a17 A dry closer for flat result lines (M, 🟠)
Some results are just receipts: "Every bit helps." (Workplace fundraiser), "Free lunch." (Lunchroom potluck), "You saved your money." (Wine country weekend), "You squeaked by." (Safety inspection). Each gets the dry, warm closer the best lines already have.

- Model lines already in the game: 'Your horse is still running, probably.', 'People loved the rust. Well, some did.', 'You counted 112 cars.'
- Example, fundraiser: "The coffee can on the time clock filled up by Friday."
- About 15 rewrites across events.js and outabout.js.
- Text only.

### i21-a18 Our best lines as the voice examples (S, 🟠)
The style guide gets a page of real before-and-after pairs from this game, so new writers can hear the voice: a neighbor on the next stool at the café, dry and warm, never laughing at you. Setups in present tense, results in past tense, second person.

- Pick 10 good lines (the long-shot horse, the gritty teeth in the dust storm, the crooked cutting board) and 10 flat ones with rewrites.
- Rules: one detail beats three adjectives; name a real place; end on the image, not the stat.
- Lives next to the existing content style guide in docs/.
- No code.

### i21-a19 First names for the people you meet once (M, 🟠)
The stranded driver, the recruiter, the new manager and the gas-station old-timer are all nameless. A small regional name list gives them first names, and people who come back keep theirs (the old-timer is Dale every time).

- NAMES list in events.js (plain first names that fit the valley across ages). Picked with the life's seed, saved in S.names by role.
- Use in 8–10 events: 'Dale at the pumps', 'Your new manager, Teresa'.
- A light stand-in until player-submitted NPCs ship in v2.0, and the same roles can hand over to them.
- Text only.

### i21-a20 Townsfolk who speak in their own words (M, 🟠)
People rarely talk in events. The few quotes work ("Not this year.", "Take her for a spin!"). Add one short quote to about 15 events so the boss, the coach, the old-timer and the farmer each sound like someone.

- Examples: Harvest time, farmer: "Can you drive stick? Then you can drive truck." Layoffs, boss: "I hate this part of the job."
- Quotes go in event text, in quotation marks, one per sheet.
- Keep them short and plain for reading level.
- Text only.

### i21-a21 A valley detail in every generic event (M, 🔴)
Several events could happen in any town in America: Clearance sale at the mall, Cheap flight deal out of Pasco, New software rollout, Workplace fundraiser, Holiday party. Each gets one detail that puts it in the valley.

- Holiday party: 'Ugly sweaters, a white-elephant gift and someone's mom's huckleberry pie.' Flight deal: 'Pasco to Phoenix for less than a tank of gas.'
- Fundraiser: for a family whose barn burned, not 'a family in need'.
- About 12 rewrites. Stand-in names for any business.
- Text only.

### i21-a22 A say() helper with variants and tokens (M, 🔴)
One small helper in events.js picks a line from a list and fills tokens like {job}, {ride}, {kid}, {town} and {season}. It makes the age, family, job and variety ideas cheap to write and easy to test.

- say(['…','…']) picks with the life's random stream, avoiding the last one used; tokens read from helpers that already exist (job short name, CARS[S.car].name, roadName()).
- Plain strings keep working, so events convert one at a time.
- The duplicate-line test can expand every variant.
- No effect changes. Also serves the planned 'fresh text for events that repeat'.

### i21-a23 Event titles in one style (S, 🟡)
Titles mix short news phrases ("Windstorm"), questions ("Starting a family?", "Run for town council?") and form labels ("Payroll error: a late paycheck", "Road-construction detour", "A remote-day trial"). Rule: a short headline as the Tattler would print it, and questions only for life-changing choices.

- Rename the label-style ones: 'Your check is late', 'Detour on Highway 12', 'Try working from home'.
- Update EVENT_PLACE and saved evCd/evDone keys with a small rename map in migrate().
- Text only.

### i21-a24 Business events that start at the moment (S, 🟡)
Business events often re-explain the place before anything happens: "Tonnage Coffee & Strings is a private space most days, but every other week it opens its doors…" The place card already says that. Event text starts with what's happening right now.

- Bluegrass jam: "Two fiddles are tuning up at Tonnage. The door's open tonight."
- Trim Bluegrass jam at Tonnage, Tonnage opens for Celebration Days, Grenache Fest and Simply Shavings is back in outabout.js.
- Shorter sheets help phones and the reading-level check.
- Text only.

### i21-a25 Journal lines in one voice (S, 🟠)
Journal lines mix styles: "Hired as … in …!", "Drove home a 1998 pickup.", "Earned a badge: …", "Out and about: … at …." One rule: short past-tense sentences, no exclamation marks, the place named once, like a diary.

- Rewrite the log() strings in ui.js, turn.js, features.js and outabout.js.
- Example: 'Started at the grain elevator.' 'Traded the pickup for a used sedan.'
- Read top to bottom, the Journal starts to sound like a life story.
- Text only.

### i21-a26 Small wins and big wins read differently (S, 🟡)
Found money says "$20! Today is a good day." and the same for $100. The tax refund line is the same for $300 and $1,300. Results with a random amount get two or three lines by size.

- Found money: '$20. Enough for coffee and a pastry on Main.' / '$100. You checked the other pockets too.'
- Apply to Found money, Tax refund, An inheritance, Hunting season and the long-shot horse.
- Text only. Same amounts and odds.

### i21-a27 Retirement that fits the job you left (S, 🟡)
Every retirement logs "Time for coffee on Main Street every morning." Each job group gets its own send-off: the farm hand parks the truck by the fence, the nurse gives away the scrubs, the professor finally reads for fun.

- Lines keyed by JOB_GROUP in ui.js where retirement is logged and toasted.
- Keep the coffee line as the fallback.
- Text only.

### i21-a28 A local's tip in each Help section (S, 🟡)
Help is clear but reads like a manual. Each section gets one short boxed tip in the game's voice, next to the plain rules: "A Tri-Cities paycheck looks big until you buy gas for it."

- One line per section in help.js; the rules and numbers stay as they are.
- Tips only restate rules already in the section, never hidden ones.
- Text only.

### i21-a29 Season touches inside events (M, 🟡)
Events that can happen any month read the same in January and July: A stranded driver, Flat tire on US-12, A lost wallet, Neighbor's moving day. A season word changes the scene: breath fogging, heat off the asphalt, mud on your boots.

- A seasonWord() helper (winter, spring, summer, fall) feeds one clause in 8 any-month events.
- Separate from the weekly valley line idea: this lives inside the event sheet.
- Text only.

### i21-a30 A rewrite pass on the ten flattest events (L, 🟠)
A focused pass over the events with the least life in them, rewriting setup, buttons and every result line to the voice guide: Tax refund, Windstorm, Gas prices spike, Found money, Festival at the Dayton Depot, Road-construction detour, Workplace fundraiser, New software rollout, Holiday party and Bluewood season pass sale.

- Use the say() helper so each gets 2–3 variants and reacts to job, family or age where it fits.
- Run the duplicate-line test, the reading-level check and the balance sim after; numbers must not move.
- Do it as one change so the voice is even across the set.
- Text only, so careless, idle and good-play scores stay where they are.

## Ideas 21: The economy over decades

How prices, pay, homes, rates and savings move across a Lifetime game, and the sim checks that keep a 60-year life fair.

### i21-b01 The mortgage ends after 30 years (S, 🔴)
Right now a mortgage never ends: a Lifetime owner pays it at 80. Count down 360 months like the truck loan, then stop the payment, stop the principal part of equity, and celebrate the paid-off house.
Touches: S.mortgageLeft counts down in turn.js like loanLeft; buying in ui.js sets 360. Equity stops gaining equityPer once paid.
Balance: A paid-off house is a real late-life reward, but only for people who bought and kept up payments for decades; idle renters gain nothing.

### i21-b02 A real home value, with equity as value minus the loan (M, 🔴)
Each owned home gets a price that follows a housing index, and the loan has a balance. Equity is value minus balance, so the Net worth sheet shows what the house is worth and what you still owe.
Touches: New S.homeValue and S.homeLoan in state.js; turn.js grows value by the housing index and pays down the balance; netWorth() and the move sheet in ui.js use them. Replaces the 2.5% growth on equity alone.
Balance: Sim must keep five-year and Lifetime planner wealth within 10% of today so the target stays right.

### i21-b03 Home prices run on their own index, not the price of milk (M, 🟠)
Houses rise about 3.5% a year on average but swing: flat for years, then a run-up, then a dip. Down payments and rent follow the housing index, so buying early or late feels different.
Touches: S.hpi next to S.col in state.js; a costH() helper for HOMES rent and down; the economy cycle nudges its yearly rate.
Balance: Swings cut both ways, so a careless buyer at a peak can lose; planners who wait get no guaranteed edge.

### i21-b04 The bank checks your pay before the mortgage (S, 🟠)
Buying asks if the payment is under 28% of your gross pay. Over that, the bank says no, or asks for a bigger down payment, with a one-line reason.
Touches: A check in the buy sheet in ui.js using payNow(job()) and cost(x.cost); a co-signer option for the partner's pay.
Balance: Stops a broke player from buying the farmhouse on a diner wage and drowning; costs good players nothing.

### i21-b05 Affordability on the Homes list: years of pay (S, 🟡)
Each home shows 'about 4.1 years of your pay' and the rent as a share of take-home. Over a Lifetime you watch those numbers move with booms, busts and your raises.
Touches: Homes card in ui.js; reads payNow and the housing index. No new state.
Balance: Information only; helps careful players and doesn't change scores.

### i21-b06 A valley cycle that lasts years, not coin flips (M, 🔴)
Extends good and bad years: the economy moves through long stretches (a 5–8 year expansion, a 1–2 year recession, a slow recovery) instead of rolling each year fresh. The Tattler names the phase.
Touches: S.econ = {phase, yearsIn} stepped each January in turn.js with a small chance table per phase; i1-a20's effects read from it.
Balance: Recessions hit everyone; savings and steady jobs soften them, so careless and idle play suffer most. Sim locks the share of recession years near 15%.

### i21-b07 Hiring freeze: the job board thins out in a recession (S, 🟠)
In a recession, a third of job openings show 'Not hiring right now' and offers come rarer. In a boom, a few jobs post signing bonuses.
Touches: A filter on the Jobs list in ui.js and on apply(); 'A tip from a friend' in events.js is rarer in recessions.
Balance: Punishes job-hopping at the wrong time; the steady worker barely notices.

### i21-b08 Raises freeze, then catch up (S, 🟠)
In a recession, yearly raises and the wage index stop. In the first boom year after, pay jumps a little to catch up, but not all the way.
Touches: WAGE_RATE in turn.js becomes a per-phase rate; the raise events in events.js check the phase.
Balance: Long-run real pay stays about the same as today, so the five-year target needs no change; the sim checks it.

### i21-b09 401(k) and savings follow the cycle (M, 🔴)
The 401(k) no longer grows a flat 6%: it averages that, drops 15–30% in a recession year and climbs back after. A Tattler line says 'Markets fell this month.'
Touches: Replace the fixed 1.06 in turn.js with a phase-based yearly return applied weekly, plus small noise.
Balance: Average return unchanged, so planners still win on average; the sim reports the spread across lives.

### i21-b10 Panic or hold: the market-drop card (S, 🟠)
The first week your 401(k) falls 15% from its high, a card asks: hold, move it to the safe fund, or cash some out with the 10% penalty. Selling low locks in the loss.
Touches: An event in events.js with a 'when' on the 401(k) high-water mark; a S.k401safe flag earns the bond rate.
Balance: The default (hold) is the good choice, so careless random picks tend to lose; extends i3-a29 to the 401(k) you already have.

### i21-b11 One interest rate runs the whole economy (M, 🟠)
A single bank rate drifts over the decades (2% to 9%). It sets new mortgage and truck loan payments, what the savings jar earns, and what debt costs instead of a fixed 1.5% a month.
Touches: S.rate in state.js, stepped each January by the cycle; used by the buy sheets in ui.js and the debt-interest line in turn.js.
Balance: Debt still costs far more than savings earn, so running negative stays a losing plan in every rate era.

### i21-b12 Your locked payment gets lighter every year (S, 🟡)
Owners see 'Renting this house today would cost $X; your locked payment is $Y' on the Homes card. A fixed mortgage in an inflating world is a quiet win, and the game says so.
Touches: One line in the Homes card in ui.js comparing S.mortgage with cost(x.cost).
Balance: Information only.

### i21-b13 Rent goes up once a year, at lease renewal (S, 🟠)
Instead of rent creeping each week, the landlord sends a letter each year: rent rises by inflation plus or minus a bit. Long-time tenants get a smaller bump; a move resets it.
Touches: S.rent stored at signing in ui.js; a yearly renewal note in turn.js; rent line reads S.rent.
Balance: Same average cost as now; sim checks real rent over 40 years stays within 5% of today.

### i21-b14 Pay steps up each January, by employer type (S, 🟠)
Raises from the wage index land once a year. County, school and state jobs get a set cost-of-living raise; private jobs get more in booms and nothing in busts.
Touches: Move the weekly S.wage creep in turn.js to a January step; a sector field on JOBS in state.js.
Balance: Public jobs become the steady choice in rough decades, which matches their low layoff risk.

### i21-b15 Washington's minimum wage rises with prices each January (S, 🔴)
Washington raises its minimum wage by inflation every year by law. Entry jobs (diner, retail, lift) get exactly that raise, so they keep pace while other jobs drift.
Touches: A minWage flag on those JOBS in state.js; payNow uses S.col instead of S.wage for them.
Balance: Entry pay stays low in real terms, so living on it forever still scores poorly; it just stops falling.

### i21-b16 Real pay that rises a little with experience (M, 🟠)
Today pay grows 2.5% while prices grow 3%, so a lifer slowly gets poorer. Instead, pay tracks prices and real raises come from years in the same field, flattening after 50.
Touches: WAGE_RATE equal to COL_RATE in state.js; a field-years bonus in payNow; RAISE_CAP stays.
Balance: Pay growth rewards staying and learning, not idling; sim tunes the bonus so the Lifetime target holds.

### i21-b17 Prices that rise at different speeds (M, 🔴)
Tuition and health care climb about 5% a year, rent 3.5%, food 2.5%, phones barely at all. cost() takes a kind, so a long life feels like the real one: school and doctors get dear.
Touches: cost(v, kind) in state.js with a small per-kind index table; turn.js, the Tuition line and health care lines pass their kind.
Balance: The sim checks the weighted basket still averages 3% so nothing else needs retuning.

### i21-b18 Gas shocks that last a year or two (S, 🟠)
On top of the weekly pump price, rare oil shocks lift gas 40–80% for one to two years, then ease. Long commuters in thirsty trucks feel it; carpools and sedans shine.
Touches: S.gasMult in state.js stepped in January; GAS reads through it in turn.js and commuteCost in ui.js.
Balance: Hurts the careless long-commute player most; planners can carpool or switch cars.

### i21-b19 Newer cars get better mileage over the years (M, 🟡)
Each used car on the lot gets about 1% better mpg per year after 2027, and an electric pickup appears in the mid-2030s. Keeping a 1998 beater forever costs more and more at the pump.
Touches: CARS mpg scaled by years since 2027 at purchase, stored as S.mpg in ui.js; turn.js gas uses S.mpg.
Balance: Small effect per year; rewards replacing the car now and then, not hoarding cash.

### i21-b20 See everything in today's dollars or 2027 dollars (S, 🔴)
A switch in Settings shows every price and balance either as it is today or in 2027 dollars. In a 50-year life, 2027 dollars make the numbers make sense.
Touches: A display flag read by fmt() call sites through a real() helper in state.js; the header and Net worth sheet first, then the rest.
Balance: Display only; scores already use 2027 dollars.

### i21-b21 What it costs in hours of your work (S, 🟠)
A small Prices sheet on the Life tab: a burger at the café, a tank of gas, a month of rent, a semester of classes, each shown as hours of work at your pay, now and when you were 18.
Touches: A sheet in features.js reading cost() and payNow(job()); a snapshot of your pay at 18 saved in S.
Balance: Information only; makes raises and inflation visible in one table. Extends i9-b24.

### i21-b22 Your cash lost value this year (S, 🟠)
The year review adds: 'Prices rose 3.1%. The $8,000 in checking now buys what $7,760 did.' A nudge to save in the 401(k) or pay down debt.
Touches: One line in the year review in features.js using S.col at year start and end.
Balance: Information only; nudges sensible play.

### i21-b23 A decade chart of the valley economy (M, 🟡)
The journal gets an Economy page: one bar per year colored by boom, normal or recession, with named slumps ('the 2041 slump') and what prices and your pay did.
Touches: S.econHist pushed each January in turn.js; a sheet in features.js.
Balance: Display only.

### i21-b24 Pick your withdrawal rate in retirement (S, 🟠)
At retirement, choose to draw 3%, 4% or 6% of the 401(k) a year. 6% feels rich until a recession in your late 60s eats the balance; 3% leaves money behind.
Touches: S.drawRate replaces the fixed 0.04 in turn.js; a choice on the retire sheet in ui.js.
Balance: High draws plus a bad cycle can run the account dry, so retiring careless and greedy scores lower.

### i21-b25 Does retirement cover the bills? A plain check (S, 🟠)
At retirement and each January after, Home shows Social Security plus 401(k) per week next to your bills, as '82% covered'. Under 70% suggests part-time work, a roommate or downsizing.
Touches: A line on Home in ui.js using ssPay, the draw rate and S.last lines.
Balance: Extends i15-b15 into retirement itself; information only.

### i21-b26 Claim Social Security at 62, 67 or 70 (S, 🟡)
Retiring and claiming become separate. Claim at 62 for 70% of the check, 67 for full, or 70 for 124%. Live on the 401(k) in between if you can.
Touches: S.ssClaim age in state.js; ssPay() scales by it; a choice on the retire sheet.
Balance: Waiting pays only if you lived long and saved; random play claims early and gets less.

### i21-b27 Older workers in a downturn (S, 🟡)
After 55, a recession layoff is harder to recover from: fewer offers, and a new job may pay 15% less. A savings cushion and a steady public job are the real protection.
Touches: Hiring odds in apply() and the job tip event in events.js check age and phase.
Balance: Hits careless late careers; planners with savings ride it out.

### i21-b28 Extended unemployment in a recession (S, 🟡)
In a recession, the state stretches unemployment benefits from 26 weeks to 39. A Tattler line says so.
Touches: The S.ui grant on layoff in events.js reads the phase.
Balance: Softens recessions a little for laid-off players without paying idle play: benefits still follow a layoff only.

### i21-b29 Booms tempt you to buy high (S, 🟡)
In a boom year, house prices and the dealer lot both climb, and a 'Everybody's buying' event pushes a bigger house or a new truck. Buying at the top can sting when the dip comes.
Touches: An event in events.js gated on boom phase; uses the housing index and CARS prices.
Balance: The careful choice (wait) is free; careless picks take the risk.

### i21-b30 Sim test: frozen prices give the same score (S, 🔴)
Run the Lifetime and five-year bots with prices and pay frozen, then at the usual rates. Real net worth and Life Score must land within a few points, so inflation is never a hidden bonus or tax.
Touches: A tuning pass in tests/sim.test.mjs that sets COL_RATE and WAGE_RATE to 0 for a twin of each game with the same seed.
Balance: Catches any price left out of cost(), or any pay that grows with prices by mistake.

### i21-b31 Sim test: affordability stays sane every decade (M, 🔴)
In Lifetime bot games, check every 10 years that rent is 20–45% of a median job's take-home, a house costs 3–7 years of pay, and a retiree's Social Security covers at least 60% of basic bills.
Touches: Snapshots each decade in the bot loop in tests/sim.test.mjs; fails outside the bands and prints a table in the job summary.
Balance: Keeps 60-year lives from drifting into absurd prices as rates and cycles get added.

### i21-b32 Sim test: a recession at the worst time (M, 🟠)
Force a two-year recession at age 25 and again at 62. The planner must still score 70 or more, careless and idle stay under their ceilings, and no planner ends in debt.
Touches: A SIM_ECON override in tests/sim.test.mjs that sets S.econ by week; reuses the same seeds.
Balance: Proves the cycle hurts but doesn't randomly ruin good play.

### i21-b33 A check that every price goes through cost() (S, 🟠)
A rules test scans events.js, outabout.js and features.js for money amounts in labels and adj() calls that skip cost() or fmtc(), and fails with the line number.
Touches: A new check in tests/rules.test.mjs reading the source files with a short regex and an allow-list.
Balance: Stops the R3 bug (fixed event prices shrinking over 50 years) from coming back.

### i21-b34 Two lives, one economy: an economy seed (S, 🟡)
The valley's boom-and-bust history comes from its own seed, separate from the dice for events. Two players (or two of your lives) can live through the same 2040s, and the sim compares strategies under one history.
Touches: A separate seeded random in state.js used only by the cycle, the rate and the shocks; saved in S.econSeed.
Balance: No score effect; makes balance testing fairer.
