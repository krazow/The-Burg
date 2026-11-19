# Ideas round 41

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 41: Waitsburg businesses, deeper

Deeper ideas for the stand-in Waitsburg businesses: the people who work there, their traditions, regular perks, job ladders, long-game changes and seasonal specials.

### i41-a01 [Howlin' Bean] Dee, the morning barista who learns your order (S, 🔴)
After 4 coffee visits in 8 weeks, Dee has your order ready and the run-into-a-friend chance rises from 35% to 50%. Skip a month and she asks where you've been.
A named barista who remembers you. Regular = 4 visits in 8 weeks, read from S.out.last.
Touches visit() in js/outabout.js (the bean chance roll) and a small S.out.reg counter.
Balance: still capped by OUT_WEEK_CAP; idle play never visits, so it gains nothing.

### i41-a02 [Howlin' Bean] Barista to shift lead to opening manager (M, 🟠)
The barista job gets two rungs: shift lead after 26 good weeks (+15% pay) and opening manager after 52 (+30%, early mornings add a little stress).
A short café ladder on the existing barista job.
Touches JOBS in js/outabout.js and the promotion check in js/turn.js.
Balance: rungs need good weeks (not idle weeks), and the stress bump keeps it from being a free raise.

### i41-a03 [Howlin' Bean] The seasonal drink board (S, 🟡)
A chalkboard special that changes with the season: iced lavender in summer, pumpkin in fall, a peppermint mocha in December. The first one each season gives +1 happy.
Adds seasonal acts with a months field, like the Laughing Lad grill.
Touches PLACES in js/outabout.js.
Balance: +1 once per season, so it can't be farmed.

### i41-a04 [Simply Shavings] The winter-break build: a key to the shop (M, 🟠)
Regulars with 5+ classes get a shop key in January and February. A 6-week build ends with a piece of furniture for your home (+happy while you live there).
Gives the closed months a purpose for regulars.
Touches PLACES closed logic, S.out, and home perks in js/state.js.
Balance: costs a visit each week of the build; skipping weeks stalls it.

### i41-a05 [Simply Shavings] December gift market: sell what you made (S, 🟡)
A one-day market in early December. With handy 3+, sell a few pieces for $40–$150; higher handy sells more.
A yearly business event in OUT_EVENTS.
Touches js/outabout.js and the handy skill.
Balance: small cash, needs skill you built by actually taking classes.

### i41-a06 [Simply Shavings] The shop changes hands in a long game (M, 🟠)
Around 10 game years in, the owner retires. With handy 5+ and $20k you can buy in; otherwise a new owner runs it with a different class night.
A long-game turn for one business.
Touches PLACES (owner field), OUT_EVENTS and a business-ownership hook.
Balance: buying in is a real cost with modest income, not a jackpot.

### i41-a07 [Little Kiss] The same table every anniversary (S, 🔴)
If your first date was at The Little Kiss, each anniversary week brings a call: your table is held. Going gives both of you +happy and a relationship bump.
A tradition tied to your own story.
Touches S.partner, the dating code and OUT_EVENTS in js/outabout.js.
Balance: once a year, still costs the dinner.

### i41-a08 [Little Kiss] Tomato season and winter braise menus (S, 🟡)
The short menu turns over: valley tomatoes in August and September, a braise menu from December to February. Each new menu adds +1 happy to your first dinner of it.
Seasonal flavor on an existing place.
Touches the pasta acts in PLACES.
Balance: +1 per menu change, twice a year.

### i41-a09 [Little Kiss] Dishwasher to prep cook to pasta maker (M, 🟠)
A Waitsburg kitchen ladder that works Wednesday to Saturday evenings. Pasta maker pays well for town, but evening shifts cost a social event now and then.
New job with place:'pasta' and two rungs.
Touches JOBS and WORK_SPOT in js/outabout.js, promotions in js/turn.js.
Balance: the lost evenings are the trade-off.

### i41-a10 [Rouge] Jo at the chair: the town's news, early (S, 🔴)
Book with Jo every 6–8 weeks and she passes on one thing early: a Waitsburg job opening, a house going up for sale, or a coming town event.
A recurring stylist who trades in news, not stats.
Touches the rouge visit in js/outabout.js and the job/house listing code.
Balance: information only, no stat gain beyond the haircut.

### i41-a11 [Rouge] Prom and wedding season: book ahead (S, 🟡)
April to June the chairs fill. A haircut needs booking the week before, or costs 20% more as a squeeze-in.
A seasonal rush that rewards planning.
Touches actBlocked and actCost in js/outabout.js.
Balance: careless players pay more; planners pay normal price.

### i41-a12 [Rouge] Shampoo assistant to licensed stylist (M, 🟠)
Start at the sink, take the cosmetology course in Walla Walla (one year, $4k), then go on commission. Commission pay rises with your community score.
A ladder where your social life pays.
Touches JOBS, the school/course system and pay calc in js/turn.js.
Balance: low community means low commission, so you can't coast.

### i41-a13 [Legal Cupboard] Your will goes out of date (S, 🟠)
After a marriage, a kid or buying a home, the will on file is flagged out of date. A $100 update visit fixes it; the end screen notes if it was current.
Makes the one-time will matter over a lifetime.
Touches S.out.will, life events in js/events.js, and the end screen.
Balance: small cost, small peace-of-mind happy, no score farming.

### i41-a14 [Legal Cupboard] Front desk to paralegal (M, 🟡)
A quiet weekday office ladder: front desk, then paralegal after a certificate class. Low wear, steady pay, little layoff risk.
A calm career at a Main Street office.
Touches JOBS, LAYOFF_RISK and education in js/state.js.
Balance: pay sits in the middle; the perk is low stress, not money.

### i41-a15 [Junque Sisters] Bev and Lou's running argument (S, 🟡)
The two sisters disagree about prices, the window display and the cat. Each visit shows one line of it; once a year you're asked to settle it (small community either way).
Two recurring people with a running bit.
Touches the junque visit message in js/outabout.js and a yearly event.
Balance: flavor; no new stat source.

### i41-a16 [Junque Sisters] Consign your things when you move (S, 🟠)
When you move or downsize, the sisters take furniture on consignment. Four weeks later you get a check for $100–$600.
Gives moving a small money side.
Touches outMoved() and a delayed payout in js/turn.js.
Balance: one-time per move, sized to what you'd lose otherwise.

### i41-a17 [Junque Sisters] The March reopening estate sale (S, 🟡)
The reopening week is an estate sale. A small chance of a rare find: old tools (handy practice) or a used instrument for the jam.
Builds on the existing 'reopen' event.
Touches OUT_EVENTS in js/outabout.js.
Balance: once a year; finds are small.

### i41-a18 [Standard Bearer Bank] Teller to head teller to loan officer (M, 🟠)
The teller job gets rungs. Loan officer needs a college degree, pays well, and brings a yearly event where you must say no to a neighbor.
A bank ladder with a social cost.
Touches JOBS, promotions in js/turn.js, and one new event.
Balance: higher stress and a community hit when you deny a loan.

### i41-a19 [Standard Bearer Bank] The lollipop jar and a kid's first account (S, 🟡)
When a kid turns 8, open a savings account for $25. Small deposits each birthday; at 18 the kid leaves home with it.
A family tradition at the bank.
Touches kids in js/state.js and the bank sheet.
Balance: money moves from you to the kid; no free gain.

### i41-a20 [Standard Bearer Bank] Branch hours shrink in a long game (M, 🟠)
Around year 8–12 the branch cuts to three days, and later may go to an ATM. You can join a town petition; teller layoff risk rises.
A real small-town change over a long game.
Touches PLACES hours, LAYOFF_RISK and a town-goal hook.
Balance: a pressure, not a punishment; community play can slow it.

### i41-a21 [Grenache & Gather] A guest chef a month (S, 🟡)
Each month's guest-chef dinner has a named chef and theme (spring asparagus, a fall game dinner). Trying 4 different chefs in a year earns a small 'regular at the table' perk.
Gives the chef dinner variety and a collection goal.
Touches the gather acts and a small S.out list.
Balance: costs $85 each; the perk is a 10% discount, not stats.

### i41-a22 [Grenache & Gather] Pour at Grenache Fest: the volunteer crew (S, 🟠)
At 21+, sign up to pour at Grenache Fest. Lose a little health from the long day, gain community, and get first pick of next year's dinner tickets.
A business tradition you take part in, not just attend.
Touches the Grenache Fest event in OUT_EVENTS.
Balance: health cost balances the community gain.

### i41-a23 [Burg Basket] Earl at register two, thirty years in (S, 🔴)
Earl knows every family in town. Shop local and he mentions who's sick or who just had a baby; in a long game he retires with a party at the store.
A recurring person who makes the grocery feel lived-in.
Touches the basket visit message and a long-game event.
Balance: flavor plus one-off community at his retirement.

### i41-a24 [Burg Basket] Clerk to produce lead to store manager (M, 🟠)
The grocery clerk job gets two rungs. Manager pays the most of any Main Street job but adds weekend call-ins.
A ladder on the existing grocer job.
Touches JOBS, promotions in js/turn.js, and an occasional call-in event.
Balance: call-ins can cost a weekend focus.

### i41-a25 [Burg Basket] Holiday ham and turkey orders (S, 🟡)
Order in early November and get holiday groceries at 15% off. Forget, and the store is sold out: family holiday events cost more.
A seasonal tradition that rewards planning.
Touches the holiday events and food costs in js/events.js.
Balance: planning saves a little; careless play pays more.

### i41-a26 [Royal Brick] The guests upstairs (S, 🟠)
Out-of-town visitors stay upstairs: cyclists in spring, wine tourists in fall, hunters in October. A chat at the bar can bring a Walla Walla job lead or a trip idea.
Recurring strangers with a seasonal pattern.
Touches the brick visit in js/outabout.js.
Balance: leads, not stats; 21 and over.

### i41-a27 [Mr. Q's] Brisket's gone by one (S, 🟡)
Make Mr. Q's your first visit of the week and you get the brisket (+1 happy). Later, it's pulled pork. Regulars get a text when there's a second smoker load.
Uses visit order, already tracked in S.out.n.
Touches visit() in js/outabout.js.
Balance: tiny bonus; just rewards paying attention.

### i41-a28 [Mr. Q's] Weekend smoker hand to pitmaster (M, 🟠)
A weekend side job: haul wood and tend the smoker. After a year you cook a Celebration Days catering order with him.
A side hustle with a payoff event.
Touches side hustles in js/features.js and a festival event.
Balance: weekend wear and an early-hours health cost.

### i41-a29 [Laughing Lad] Name the fall seasonal (S, 🟡)
Each September regulars submit beer names. Yours might win (more likely with community 50+), and a plaque goes up in the taproom.
A brewery tradition for regulars.
Touches OUT_EVENTS and a keepsake/plaque record.
Balance: one-time pride, small happy.

### i41-a30 [Laughing Lad] Grill cook to brewer's helper (M, 🟡)
Work the summer grill (May–October), then move inside as a brewer's helper. Brewing has heavy lifting and early brew days.
A seasonal job that can become year-round.
Touches JOBS and the grill months in js/outabout.js.
Balance: wear on the body; summer-only pay at first.

### i41-a31 [Bourbon Gulch] Line cook to kitchen manager (M, 🟠)
The line cook job gets two rungs. Kitchen manager pays well and runs the Friday rush, with more stress.
A ladder on the existing line-cook job.
Touches JOBS and promotions in js/turn.js.
Balance: stress rises with the title.

### i41-a32 [Bourbon Gulch] Friday nights: the team eats here (S, 🟡)
In football season the high school team and families pack the booths after home games. Go on a game week for extra community; if your kid plays, more.
A fall tradition tied to the school calendar.
Touches the gulch visit and kid activities.
Balance: still under the weekly cap.

### i41-a33 [McGrub & Grain] Ag tech to field agronomist (M, 🟠)
After two harvests, the ag tech can become a field agronomist (+25% pay). Harvest months run long and cost health.
A ladder on the farm job.
Touches JOBS, promotions and harvest months in js/turn.js.
Balance: harvest strain offsets the raise.

### i41-a34 [Sharp Point Builders] Apprentice to journeyman to your own crew (L, 🔴)
After 3 years the apprentice becomes a journeyman. Later you can start your own small crew: steadier pay, but slow months and a truck payment.
The big ladder: from learning to owning.
Touches JOBS, the trades sheet, business ownership and js/turn.js.
Balance: the business has real costs and slow winters; careless play loses money.

## Ideas 41: Each job, deeper

Thirty-two ideas that go deeper on single jobs: a weekly moment, the skill that counts, named promotion steps, a hazard or perk, a coworker, and how the work changes over the decades.

### i41-b01 [Registered nurse] Shift report at 7: the handoff that matters (S, 🔴)
A weekly 'Shift report' card for RNs and nursing assistants.
Careful: -1 happiness, error-event odds halved for 4 weeks. Rushed: nothing now, odds doubled.
Touches js/events.js (new card, job gate rn/cna), js/turn.js for the 4-week flag.
Balance: the careless pick is never better on average; idle play gets the rushed default.

### i41-b02 [Registered nurse] Floated to the ER: extra pay, extra strain (S, 🟠)
A float request about one week in eight for RNs.
Yes: +$150 that week, stress x1.5. No: small standing drop, nothing else.
Touches js/events.js and the pay line in js/turn.js.
Balance: the money is small next to the health cost, so grabbing every float doesn't win.

### i41-b03 [Registered nurse] Paper charts give way to tablets over the decades (M, 🟡)
Three eras of flavor text for RN, nursing assistant, imaging tech and medical assistant.
The switch year brings a one-time 'new charting system' week with extra stress.
Touches js/events.js text helpers and the generation year in js/state.js.
Balance: flavor plus one hard week; no lasting score change.

### i41-b04 [Barista] The Saturday rush line at the coffee shop (M, 🔴)
A barista-only practice track (0–3) that grows by working, not by idling.
Rush weekend card: tips scale with level; level 0 is a stressful scramble.
Touches js/features.js SKILLS, js/outabout.js (barista job), js/turn.js.
Balance: tips cap near $60 a week, so it rewards sticking with the job, not gaming it.

### i41-b05 [Barista] Know the regulars' orders (S, 🟡)
A short list of stand-in regulars (the wheat farmer, the retired teacher, the deputy).
Meet them through work weeks; the fifth unlocks the perk.
Touches js/outabout.js people list and js/features.js practice('people').
Balance: slow to earn, only for players who keep the job a while.

### i41-b06 [Barista] Shift lead, then the keys to open (S, 🟠)
Named steps: Barista, Shift lead (+$200), Opening manager (+$450).
Opening manager adds an early-start sleep cost: health wear +0.1.
Touches js/outabout.js job entries and the raise logic in js/turn.js.
Balance: the top rung still pays below most trade jobs; it's a small-town path, not a shortcut.

### i41-b07 [Reporter] Tuesday night: the paper goes to the printer (S, 🔴)
A weekly deadline card for the reporter job.
Chasing a quote: a chance of a front-page story that raises community; a small chance of a correction that lowers standing.
Touches js/events.js, the Tattler headline list in js/outabout.js.
Balance: on-time is the safe average; chasing is a real gamble, not a free win.

### i41-b08 [Reporter] Your editor, the old hand, and the day they retire (M, 🟠)
One named editor (stand-in name) who appears in reporter events.
Retirement event after about 3 game years; editor rung pays +$600 and adds stress.
Touches js/events.js and the job title override in js/outabout.js.
Balance: gated by years and standing, so job-hoppers never see it.

### i41-b09 [Reporter] From darkroom to phone camera across the decades (S, 🟡)
Era text for reporter events and the Tattler's look.
The online era adds a 'comments section' stress event.
Touches js/events.js and js/outabout.js Tattler text.
Balance: flavor; the comments event is mild and avoidable by a choice.

### i41-b10 [Bank teller] Teller, head teller, personal banker (S, 🟠)
Named steps with pay +$250 and +$700.
Short drawers from the existing cash-drawer event reset the clock.
Touches js/outabout.js (teller), js/features.js skillLv, js/turn.js raises.
Balance: careless answers to drawer events stall the climb.

### i41-b11 [Bank teller] Harvest checks at the drive-up window (S, 🟡)
A seasonal teller card tied to the harvest months.
Good choice: +standing, +1 People practice.
Touches js/events.js season gates.
Balance: once a year, small.

### i41-b12 [Trades apprentice] The foreman's Friday punch list (S, 🔴)
A weekly card for the apprentice job with a running 'hours logged' count on the Jobs tab.
Doing it right costs a bit of health wear; cutting corners stalls hours.
Touches js/outabout.js (apprentice), js/ui.js job card, js/turn.js.
Balance: idle play logs hours slowly; careful play reaches journeyman in about 2 years.

### i41-b13 [Trades apprentice] Journeyman card, then your own contractor license (M, 🟠)
Named steps: Apprentice, Journeyman (+$1,400), Licensed contractor (opens a business card).
Contractor ties into the existing business system in js/features.js.
Touches js/outabout.js and js/features.js.
Balance: the business still carries its normal risk, so it's not free money.

### i41-b14 [Trades apprentice] A fall off the ladder (S, 🟠)
A hazard event for apprentice and farm hand, weighted by wear.
A one-time $120 harness purchase on the Life tab.
Touches js/events.js and the shop list in js/ui.js.
Balance: careful players spend a little and skip a big health hit.

### i41-b15 [Grain elevator operator] Moisture meter calls at the scale (S, 🟠)
A harvest-week card for elevator and ag tech jobs.
Two kinds of standing pull against each other.
Touches js/events.js and the standing values used in js/ui.js.
Balance: neither pick dominates; both carry a cost.

### i41-b16 [Grain elevator operator] Small elevators close, a big loader opens (M, 🟡)
A one-time era event for elevator operators.
Choose to follow the job (pay +$500, commute up) or take a severance and look locally.
Touches js/state.js JOBS city/miles, js/events.js.
Balance: both options are fair; neither raises score for doing nothing.

### i41-b17 [Wheat farm hand] Truck, then the combine seat, then farm manager (S, 🟠)
Named steps: Truck driver, Combine operator (+$400), Farm manager (+$1,100).
Each harvest gives one careful-or-fast choice that decides the step.
Touches js/state.js (farmhand), js/events.js harvest cards.
Balance: fast choices finish early but risk breakdowns that stall the climb.

### i41-b18 [Wheat farm hand] GPS autosteer arrives in the cab (S, 🟡)
An era change for farm hand and ag tech: wear 1.0 to 0.7.
Adds a mild 'long quiet days' line unless People skill is 1+.
Touches js/state.js job stats and js/turn.js weekly drains.
Balance: lowers health drain a bit; offset by the happiness line.

### i41-b19 [Hospital nursing assistant] The resident you look after (M, 🟠)
One named resident per CNA run, with 3–4 story beats.
Ends with a hard week: -happiness, then +community from the family's thanks.
Touches js/events.js chain system (S.chains).
Balance: net small; it's a story, not a score lever.

### i41-b20 [Hospital nursing assistant] The hospital pays for nursing school (M, 🔴)
A tuition offer card that halves study cost toward the RN education level.
A payback balance if you leave within 2 years of finishing.
Touches js/state.js EDU/STUDY_NEED, js/turn.js study, js/ui.js.
Balance: rewards staying put; job-hoppers pay full price plus the clawback.

### i41-b21 [Auto mechanic] ASE patches on your shirt (M, 🟠)
Four patches, each +$250 a month; pass odds rise with Mechanic skill.
Touches js/features.js SKILLS (mechanic) and js/turn.js pay.
Shows the patches on the Jobs tab card in js/ui.js.
Balance: costs time and money up front, so careless play gets nothing.

### i41-b22 [Auto mechanic] The tool truck comes on Tuesdays (S, 🟠)
A weekly offer: buy a tool set on $25 a week; each set adds a small pay bump.
More than three sets running shows a warning and a stress line.
Touches js/events.js and the loan list in js/turn.js.
Balance: one or two sets pay off; buying everything loses money.

### i41-b23 [Auto mechanic] Carburetors, then computers, then electric cars (M, 🟡)
Era checks at two switch years with a 4-week retraining choice.
Skip it and your pay steps down 10% until you train.
Touches js/turn.js and the era year in js/state.js.
Balance: careful play keeps pace; idle play slowly falls behind.

### i41-b24 [College professor] The tenure clock (L, 🔴)
Named steps: Assistant, Associate (tenure, +$900), Full professor (+$1,200).
Yearly progress card with research or teaching focus.
Touches js/state.js (prof), js/events.js, js/turn.js layoff risk set to 0 on tenure.
Balance: tenure lowers layoff risk, not stress; missing is a real setback.

### i41-b25 [College professor] Wednesday office hours (S, 🟡)
A light weekly card with rotating student types.
Feeds the tenure clock teaching score.
Touches js/events.js.
Balance: small effects both ways.

### i41-b26 [Truck driver] Buy your own rig: owner-operator (L, 🟠)
Named steps: Company driver, Lead driver (+$400), Owner-operator.
Owner-operator uses the business system with a truck loan and weekly fuel cost.
Touches js/features.js business, js/turn.js loans.
Balance: average income only beats the company job with careful choices.

### i41-b27 [Truck driver] Paper logbook to electronic logs (S, 🟡)
Era change: the fudge choice only exists before the switch year.
Fudging gives +$100 and a fine chance.
Touches js/events.js.
Balance: the fine wipes out the gain on average.

### i41-b28 [Ski lift operator] First chair on a powder Saturday (S, 🟡)
A weekly winter card for the lift job after a snow week.
+happiness; ties to the weather line if built.
Touches js/events.js season checks.
Balance: small, seasonal.

### i41-b29 [Ski lift operator] Thin-snow winters over the decades (S, 🟡)
Era-weighted chance of a short season that trims winter pay.
Offers a summer trail-crew job link.
Touches js/turn.js pay and js/state.js.
Balance: lower pay pushes active planning; idle play earns less.

### i41-b30 [Ag technician] Drones and soil maps over the wheat (M, 🟡)
Era unlock with a short training choice.
Ties to the wheat lease yield in js/features.js.
Touches js/outabout.js (agtech), js/features.js.
Balance: the yield tip is a few percent, not a jackpot.

### i41-b31 [Grocery clerk] Truck day on Wednesdays, and the day-old shelf (S, 🟡)
A weekly moment line plus a 3% food cost perk while you hold the job.
Touches js/outabout.js (grocer) and the food cost line in js/turn.js.
Balance: tiny perk for a low-paying job.

### i41-b32 [Rail yard conductor] The extra board, then the engineer's seat (M, 🟠)
Named steps: Extra board (call-in stress), Regular job (+$300), Engineer (+$1,200).
The extra board adds a random 'called at 2 a.m.' sleep hit.
Touches js/state.js (rail), js/events.js, js/turn.js.
Balance: the top rung pays well but wear rises; careless play burns out.
