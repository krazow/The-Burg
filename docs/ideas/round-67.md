# Ideas round 67

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 67: Tying the new systems together

Follow-ups that link the new money, retirement and jobs systems to each other and to the rest of the game, and fill the gaps they leave.

### i67-a01 Outlook counts the 401(k) draw in retirement (S, 🔴)
The 13-week outlook leaves out the 401(k) withdrawal that weekTick pays retirees, so it shows them poorer than they are. Add the same 4%-a-year draw line to moneyOutlook.
- Bug: weekTick (turn.js) pays Social Security, pension and a 401(k) withdrawal; moneyOutlook (features.js) only adds the first two.
- Fix: push a '401(k) withdrawal' line in the retired branch, using the same formula.
- Add a rules test: a retiree's outlook week 0 matches the weekTick money total with no events.
- Balance: display only.

### i67-a02 Outlook catches up with the jobs build (M, 🔴)
Union dues, seasonal layoffs, apprentice pay, furloughs and strike pay from the jobs build show up in the 13-week outlook, so a Forest Service crew member sees the paycheck stop in September.
- moneyOutlook uses payNow() directly; the jobs branch pays through jobPay() with dues and furlough rules.
- Split jobPay into a pure jobPayPreview(j, date) that both use, with no state changes.
- Seasonal jobs show a 'Season ends' big line and $0 weeks after it.
- Balance: display only; it helps careful players plan, not idle ones.

### i67-a03 Public jobs show their pension on the board and the offer (S, 🔴)
Jobs that earn a pension get a 🏛️ tag on the job board and a line in the offer sheet: about how much a month five years there would add at retirement.
- jobRow (ui.js) and the offer/interview sheets (jobs branch) read j.pension.
- Offer line: 'Earns a pension: about $X a month after 5 years', from PENSION_RATE and this job's pay.
- Help's pension paragraph links to the tag.
- Balance: information only; pension pay is unchanged.

### i67-a04 Teachers and federal jobs earn a pension too (S, 🔴)
The new school teacher job and the federal jobs (dam operator, VA clerk) join the public pension, like the paraeducator and the courthouse clerk already do.
- state.js and the jobs branch JOBS list: add pension:true to teacher, damop and vaclerk (seasonal Forest Service crew stays without).
- Help's pension job list is built from the data, so it updates itself.
- Balance: the pension still needs 5 years and only pays in Lifetime retirement; watch the homebody and planner medians in the sim.

### i67-a05 Before you buy: the outlook checks big purchases (M, 🔴)
Buying a home, a financed truck, a business, cattle, wine futures or a big fund buy shows one line from the outlook with the purchase taken out: 'Cash stays above $0' or 'Cash dips below $0 the week of Mar 9'.
- moneyOutlook(n, extra) takes an optional cash change and extra weekly lines (new mortgage, truck payment, hay).
- moveHome, buyCar, startBiz, buyWine, invest and the scholarship sheet show the line and a link to the full outlook.
- Never blocks the buy; it only warns.
- Balance: helps careful play; careless bots skip confirm sheets in the sim anyway.

### i67-a06 Sim bots use the new money systems (M, 🔴)
The planner buys index funds above 3 months of bills, refinances when it can, writes a will at 40 and buys care insurance at 55; the careless bot drops to liability and no renters insurance and sells funds in a drop; the homebody takes a pension job.
- tests/sim.test.mjs: add these calls next to the existing startBiz and planTrip lines.
- At the debt ending, careless bots file for bankruptcy half the time (bankruptcySheet path) so its score rule gets tested.
- Balance: report the medians before and after; targets stay careless <= 60, idle <= 50, good >= 70.

### i67-a07 Sim checks for the new money numbers (S, 🟠)
The sim fails if any new money number goes wrong: funds below zero, a home equity balance that grows, pension years above years worked, a refinance that raises the payment, or probate that never closes.
- tests/sim.test.mjs: add checks for S.stocks, heBalance(), S.pensionYears vs S.earnYears, S.mortgage after refinance, S.probate.
- Runs on the bots from the idea above.
- Balance: tests only.

### i67-a08 Warn before leaving a pension job months short of vesting (S, 🟠)
With 4 to 5 years in a public job, the Quit sheet and any application to a non-pension job say 'You're 3 months from vesting in the pension. Leave now and you get nothing from it.'
- The quit sheet in renderJobs (ui.js) and the apply/interview step check pensionYears against PENSION_VEST.
- A next-step hint can repeat it once.
- Balance: information only; it rewards planning, not idling.

### i67-a09 The banker's sit-down shows the new money (S, 🟠)
Sitting down at Standard Bearer Bank shows this year's mortgage rate, your rate, whether a refinance pays, your home equity loan, index funds and any collections or bankruptcy limit.
- bankSheet (outabout.js) still says the mortgage is 'locked in' and lists only cash, 401(k) and loans.
- Reuse homeMoneyHTML() rows and loanBlock(); a button jumps to the Life tab card.
- Balance: display only.

### i67-a10 'Why' lines that match the new bills (S, 🟠)
Tapping 'Insurance & phone' explains what you actually carry (full coverage, renters, a $2,500 deductible), and property tax, the home equity loan, pension, 401(k) withdrawal and union dues each get a why line.
- The clarity branch's why text says 'Car insurance and your phone plan.' for everyone.
- Build it from insParts(); add why strings to the moneyWeek, planWeek and jobPay lines.
- Balance: display only.

### i67-a11 Next-step hints for the new systems (S, 🟠)
The clarity build's next-step hint learns a few money nudges: idle cash with no funds, 40 with no will, a refinance that pays, half a year from vesting, liability-only with a truck loan, debt a month from collections.
- nextStep() in the clarity branch: one hint at a time, in that priority after the existing ones.
- Each hint names the Life tab card to open.
- Balance: hints only; idle bots never read them.

### i67-a12 A collections countdown (S, 🟠)
At 8 weeks below $0 the week's notes say 'Four more weeks and this goes to collections', and the outlook marks the week it would happen.
- debtWeek (features.js) adds the note at COLLECT_WEEKS - 4; moneyOutlook flags the week cash has stayed below zero long enough.
- The flow build's Auto stops at that warning.
- Balance: the rule is unchanged; careful players get a fair warning.

### i67-a13 Auto stops before a big bill (S, 🟠)
A new 'Auto until' choice stops skipping the week before a big bill: property tax, vehicle tabs, a lease renewal, the crop insurance premium or a winter away.
- The flow branch's Auto-until options read moneyOutlook(2).weeks[1].big.
- Auto says why it stopped: 'Property tax ($1,140) is due next week.'
- Balance: skipping never changes outcomes.

### i67-a14 Focus preview shows next week's big bills (S, 🟠)
The clarity build's 'Next week' estimate adds any big bill coming next week, so a $1,100 property tax week doesn't look like a normal one.
- Use moneyOutlook(1).weeks[0].big beside focusFx()/hustlePay() in the clarity branch's preview.
- Balance: display only.

### i67-a15 The lender wants full coverage on a financed truck (S, 🟠)
While a truck loan is open, the insurance sheet keeps full coverage on: liability only unlocks when the truck is paid off, like a real lender rule.
- insSheet (features.js) disables the liability button with a note when S.loanLeft > 0; buyCar switches a liability policy to full and says so.
- A save migration moves anyone financed on liability back to full.
- Balance: closes a cheap trick (finance a truck, skip coverage); costs about $35 a month.

### i67-a16 The Buy sheet shows the full cost of owning (S, 🟠)
Buying a home shows a monthly total, mortgage plus property tax plus homeowners insurance, next to what you pay in rent now.
- moveHome (ui.js) uses newMortgage(k), the home's value times PROP_TAX / 12, and INS_HOME with your deductible.
- The Homes list can show the same total on each owned home.
- Balance: display only.

### i67-a17 The bank calls when rates drop (M, 🟠)
In January, if this year's rate is a point or more under your mortgage rate, the bank calls with a refinance offer as an event, on the same terms as the Life tab card.
- A PLAN_DUE entry (features.js) placed at the bank, once per new low rate; choices: refinance (refinance()) or not now.
- Skipped when loanBlock() says no.
- Balance: same terms as the card, so no new money; it just stops owners missing it.

### i67-a18 Fold debt into a home equity loan before collections (M, 🟠)
Owners with equity who are 8 weeks below $0 get a call from the bank: borrow against the house to clear the debt at a lower rate before it goes to collections.
- A PLAN_DUE event that calls takeHE() for the debt rounded up; respects loanBlock() and heMax().
- The loan still counts against net worth and costs interest for 10 years.
- Balance: trades 18% a year for about 7.5%; it can't raise the score above paying the debt off.

### i67-a19 One insurance sheet for everything you carry (M, 🟠)
Crop insurance, long-term care insurance and a new herd coverage row join the insurance sheet when they apply, so every policy lives in one place.
- insSheet (features.js) adds sections for S.biz.ins (wheat), S.ltc and cattle.
- Herd coverage: a small monthly premium pays 70% of cows lost in a hard winter (the 'A hard winter on the herd' event uses youPay('herd')).
- Balance: premium priced so it about breaks even over 10 years; careless players skip it and take the swings.

### i67-a20 Farmhouse owners graze their own ground (S, 🟠)
Running cattle while you own the farmhouse saves the pasture rent: the cows graze your own acres, though the farmhouse holds fewer cows than rented foothill pasture.
- cattleWeek and moneyOutlook (features.js) skip PASTURE when S.home === 'farm'; a cap on the herd there.
- The business card and Help say so.
- Balance: about $120 a month; the farmhouse already costs far more.

### i67-a21 A farm tax break for working ground (S, 🟡)
Farmhouse owners who farm (a wheat lease or cattle) sign up for the county's open-space farm program and pay less property tax on the land.
- propTax() (features.js) takes a share off when S.home === 'farm' and S.biz is wheat or cattle; Help explains it.
- The tax goes back up the year farming stops.
- Balance: a few hundred dollars a year; needs owning, farming and a business.

### i67-a22 The 401(k) rides the market too (M, 🟠)
Your 401(k) follows the same good and bad years as the index funds, with smaller swings, and the planning card shows how this year went.
- moneyWeek (features.js) grows S.k401 with a milder MKT rate; a market drop takes a smaller share than from funds.
- The Market drop event mentions both.
- Balance: same long-run average as today; check that planner medians don't move more than a point.

### i67-a23 Move money from funds to cover a dip (S, 🟠)
When the outlook shows cash going below $0 and you hold index funds, it offers to move just enough to cash, and warns if the market dropped this year.
- outlookSheet (features.js) adds a button that calls invest(-amount) for the shortfall plus a small cushion.
- Text: 'Selling in a down year locks in the loss.'
- Balance: it's the same sale you can make by hand.

### i67-a24 Debt follows you into the clearance check (S, 🟠)
A collections account or a recent bankruptcy slows the jobs build's security clearance for Hanford and the lab, the way money trouble does in real background checks.
- The jobs branch's clearance wait adds weeks when inCollections() or bkActive(); a note says why.
- Help's clearance and bankruptcy paragraphs mention each other.
- Balance: hurts careless debt play, not careful play.

### i67-a25 A will passes the family business (M, 🟠)
With a will, your grandkid starts with your herd, your wheat lease or your shop; without one, probate sells it and adds what it fetched to the slow inheritance.
- inheritance() and the legacy start (features.js) carry S.biz over when p.will.
- The planning card's will row says what it would pass on.
- Balance: the business still has its costs; the grandkid's score uses the same rules.

### i67-a26 Claims show on the insurance sheet (S, 🟠)
The insurance sheet lists your last few claims and what insurance paid, so you can see what coverage has saved you before dropping it.
- Events that call youPay() record S.claims (kind, cost, paid, week); keep the last 5.
- insSheet shows the list and a total: 'Insurance paid $4,250 in the last 3 years.'
- Balance: display only.

### i67-a27 Badges for the new money systems (S, 🟠)
New badges: Vested (a public pension), Held steady (kept your funds through a drop until they recovered), Refinanced, Rancher (sold calves three Octobers) and Paperwork in order (a will and care insurance).
- ACHIEVEMENTS (features.js) with tests on existing state.
- Only the harder ones can be pinned as life goals, so they can't be farmed for goal points.
- Balance: no money; goal bonus unchanged.

### i67-a28 Money milestones in the life story (S, 🟠)
The end screen and the clarity build's life story name the money moments: the year you vested, refinanced, held through a drop, wrote a will, or went bankrupt and came back.
- finish() (features.js) and the clarity life story read log entries tagged money/mile and a few state flags.
- Balance: display only.

### i67-a29 Help: one money and planning page with plain words (M, 🔴)
Help's money section is split into short pages (insurance, your home, investing, debt, retirement and the will), each with a few plain definitions: deductible, equity, vesting, probate, collections.
- help.js: the long money paragraphs become sub-pages with a small glossary.
- Each Life tab card (insurance, home money, investing, planning) gets a ? that opens its page.
- Balance: none.

### i67-a30 An optional money tour in the tutorial (S, 🟠)
After the basic tutorial, an optional 'money tour' shows the insurance sheet, the planning card, the 13-week outlook and the investing card on the practice life.
- TUT steps (help.js) with selectors for #inssheet, #outlook and the investing card; the practice life is never saved.
- Offered at the end of the main tutorial and from Help.
- Balance: none.

### i67-a31 What's new lists the money and retirement update (S, 🟠)
Players coming back see a What's new card for the big money build: insurance, property tax, the housing market, refinancing, cattle, funds, collections, bankruptcy, pensions, Social Security, the will and the outlook.
- WHATS_NEW (ui.js) gets an entry for the version that ships these, with one line each, grouped in about six rows.
- Balance: none.

### i67-a32 The Legal Cupboard's paperwork checkup (S, 🟡)
A free visit at the law office lists your paperwork: will, care insurance, renters or homeowners coverage, and what probate would take from your heir today.
- A new info act at the 'legal' place (outabout.js) like the banker's sit-down; it doesn't use a visit.
- Reads hasWill(), S.ltc, insParts() and inheritance().
- Balance: information only.

### i67-a33 Insurance office staff get a discount (S, 🟡)
Working as the insurance agent on Main Street knocks 15% off your own coverage, shown on the insurance sheet.
- insMonthly() (features.js) checks S.jobId === 'insure'.
- Balance: about $15 a month for one job.

### i67-a34 Wine-making students read the vintage (S, 🟡)
With the jobs build's wine making program, the futures card says how the vintage looks (a smoky summer, a clean one) and the odds of a great year.
- investCard (features.js) shows WINE_Q odds when S.major === 'wine'.
- Balance: information only; odds and payouts are unchanged.

### i67-a35 A cash offer on your house in a hot year (M, 🟡)
In a hot housing year, an owner may get a cash offer from a family moving in from Seattle: sell above value with no agent fees, but you have to move.
- A rare event when homeMood() === 'hot' and you own; selling runs moveHome's sale with no SELL_FEE and a small premium, then you pick a rental.
- Balance: rare, and moving costs happiness and the community bonus of a long stay.

## Ideas 67: Spring and summer

The warm half of the year in Waitsburg: spring planting, school letting out, the Fourth, fire season, camping in the Blues and long evenings in town.

### i67-b01 Last day of school: the half-day Friday (S, 🔴)
A yearly June event for lives with kids 5–17 at home. It marks the start of summer break in the log.
events.js (new event, yr:1, inM(m,5)), uses kidsAtHome() from state.js.
Balance: a fair trade of a little money for a little happiness. Idle play gets the default (keep working), which gives nothing.

### i67-b02 Swallows build a nest over the porch light (S, 🟠)
A short spring event with a follow-up: if you left it, a 'the babies fledged' note comes in July.
The game says plainly that once there are eggs the nest has to stay; that's the law for wild birds.
events.js (event plus a chainAt follow-up in features.js chains).
Balance: tiny happy gain only; no money.

### i67-b03 The mosquito truck on summer nights (S, 🟡)
A summer-night event, July–August, in towns near the river.
Dumping water costs a little time (one of the week's focus effects is trimmed), and makes the next mosquito event skip you that year.
events.js; tie to the River card if it exists.
Balance: small health or happy swings either way; nothing to farm.

### i67-b04 A rattlesnake on the trail (S, 🟠)
Fires only when focus is Get outside, so it's a risk tied to the healthy choice, not a random hit.
A dog off leash may need a vet trip (money), and poking at it can mean a bite and a hospital bill.
events.js (when: S.focus==='outdoors' and month 4–7).
Balance: the safe choice costs nothing; only careless picks cost money.

### i67-b05 Foxtails and hot pavement: summer with a dog (S, 🟡)
Picking dawn walks sets a small flag that makes this event skip you for the rest of summer.
events.js, reads S.dog.
Balance: the cheap fix is a choice, so careful players pay nothing and careless ones pay a vet bill.

### i67-b06 Swamp cooler or a window unit before July (M, 🔴)
A one-time purchase on the home card in ui.js, stored as S.cooling.
Heat events in events.js check S.cooling and soften their happy and health hits; the cooling bill goes up a little in summer months.
A swamp cooler is cheap to run but weak in muggy smoke weeks; the window unit costs more to run.
Balance: it only pays back in hot weeks, so total score gain is small and needs real money up front.

### i67-b07 The longest evening of the year (S, 🟡)
A once-a-year small evening choice, free, gives happy +2 (+1 more with a partner or kid along).
Skipped automatically if focus is Work extra hours that week.
events.js or the evening-tap system if built.
Balance: tiny and once a year; idle play gets it only if it's not auto-skipped, so set the default to skip.

### i67-b08 Fireworks ban in a dry year (M, 🔴)
Reads a dry-summer flag (from the planned dry-summer idea, or a 1-in-4 yearly roll set in April if that isn't built).
Lighting them anyway has a small chance of a fine and a rarer chance of a field fire bill and a community hit.
events.js; shares the flag with fire events.
Balance: the careless choice has the worst average result, so careless play doesn't gain.

### i67-b09 Fire camp sets up at the fairgrounds (M, 🟠)
A late-summer event with a two-week follow-up; the fairgrounds pin on the town map shows a tent icon while it lasts.
events.js, maps.js pin, outabout.js note in the town life card.
Selling lunches pays like a Side hustle week, not more.
Balance: money choice is capped at a normal hustle week; community choice gives the bigger score gain but costs a focus slot.

### i67-b10 Rock picking, moving pipe, babysitting: more teen summer jobs (S, 🔴)
Extends the planned 'Teen's first summer job': each pays differently and shapes the teen a little (tough, early riser, good with kids).
Data table in state.js; the pick is a choice in the teen event in events.js.
Balance: the money goes to the teen's savings, not to your Life Score money, so it can't be farmed.

### i67-b11 A snow-cone stand at the ballfield (S, 🟠)
A summer-only Side hustle option in GIGS (state.js), months 5–7, with pay that rides on the weather and smoke flags.
Starts with a one-time cost for the shaver and syrups.
Balance: average pay sits below harvest work, so the best summer hustle stays harvest.

### i67-b12 Little League all-stars: three July weekends on the road (M, 🟠)
A yearly chance event for each kid in range; saying yes queues three weekend notes that cost money and give happy and community.
A deep run is a rare bonus with a one-line story in the log.
events.js, uses CITIES gas math from features.js.
Balance: it costs real money and gives soft stats; net score is about even, so it's a family choice, not a strategy.

### i67-b13 Camping weekends: three campgrounds, three seasons (L, 🔴)
A new trip kind in features.js beside the town trips: pick a site and what to bring (tent, cooler, fishing gear).
Each site has a cost, drive time and a weather or fire roll; fire season can close the high one (ties to the planned Blues closure).
Gives the Get outside effect plus a small bonus, and a journal line.
Balance: uses the week's trip slot and costs money; the bonus is about one good Get outside week, so it can't stack beyond that.

### i67-b14 Kite day on the windy hill (S, 🟡)
A one-line spring choice, April only, in the Out and about place list or as a small event.
outabout.js PLACES act with months [3], or events.js.
Balance: very small happy gain, free, at most once a year.

### i67-b15 A grasshopper summer (M, 🟠)
A yearly 1-in-6 flag set in June; while on, garden and lease yields drop a few percent and one choice event fires.
events.js plus the lease and garden math in turn.js.
Balance: only takes value away; the choices limit the loss, they don't add new money.

### i67-b16 Ice cream on the bench after supper (S, 🟠)
A new Out and about place or act in outabout.js with months 4–8; cheap, counts as a date with a partner.
Has a small chance of a neighbor chat line from the town life card.
Balance: same cap as other Out and about visits (OUT_MAX); just another cheap happy option.

### i67-b17 Fourth of July as a planned day (M, 🔴)
One sheet in ui.js opened by a July event in events.js; each slot adds a small effect and a log line.
Existing and planned Fourth ideas plug into its slots, and a dry-year flag closes home fireworks.
Balance: each slot gives a small effect, and the holiday-shift pay is about one normal day, so the total sits near one good week.

### i67-b18 A power outage on the hottest night (S, 🟠)
A summer event that checks the freezer (if built) and cooling (if bought).
events.js.
Balance: costs small money or a little health; nothing gained, only managed.

### i67-b19 A fawn in the tall grass: leave it be (S, 🟡)
A short spring event that teaches a real rule; picking it up costs a gas trip and a sad follow-up note.
events.js.
Balance: free right answer, tiny happy gain.

### i67-b20 May frost warning: cover the starts (S, 🟠)
Fires only for lives with a garden (planned garden ideas); covering keeps the full summer yield.
events.js; reads the garden flag.
Balance: careful play keeps value, careless play loses some; no new value created.

### i67-b21 The neighborhood kids find your sprinkler (S, 🟡)
A summer event for any home with a yard.
events.js.
Balance: a small money for community trade, about even.

### i67-b22 One apricot tree, one week of everything (S, 🟠)
A homeowner event, July, once a year if the home has a tree (a random trait set when you move in).
events.js; ties to canning or freezer ideas if built.
Balance: canning costs a Rest week's worth of time; giving it away gives community. Small either way.

### i67-b23 A permitted field burn drifts into town (S, 🟡)
A spring or fall event in farm country weeks.
Complaining can make a neighbor cooler toward you (small community hit) but cuts future smoke a little.
events.js.
Balance: small and short.

### i67-b24 Your teen at the district track meet (S, 🟡)
A spring event for lives with a teen; uses the work-day cost the same way other time-off choices do.
events.js; optional line in the kid's record if built.
Balance: a small pay-for-happiness trade.

### i67-b25 Sidewalk tables come out in May (S, 🟠)
A month check in outabout.js placeLine and visit: a summer bonus to happy for certain places.
Smoke weeks turn the bonus off.
Balance: a small bump on visits that already cost money and are capped each week.

### i67-b26 Spring seeding on the wheat lease: plant early or wait (M, 🟠)
One choice event in March or April for lease holders; stores S.leaseSeed and shifts the harvest yield.
events.js plus the lease harvest math in turn.js.
Balance: both picks average the same; the choice spreads the outcome, it doesn't raise it.

### i67-b27 The trampoline ends up in the neighbor's yard (S, 🟡)
A funny spring event for lives with kids; arguing has a small community cost.
events.js.
Balance: tiny.

### i67-b28 No lifeguards this summer: the pool may not open (S, 🟠)
A rare May event; the result sets how many weeks the pool is open that summer (pool ideas read it).
A teen in the house can be the fix.
events.js.
Balance: community choice costs a focus slot; nothing pays more than a normal Show up for town week.

### i67-b29 Thunder at the ballgame: everybody to the cars (S, 🟡)
A short summer event, June–July; waiting gives a small happy story beat.
events.js.
Balance: tiny, once a summer at most.
