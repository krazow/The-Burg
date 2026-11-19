# Ideas round 9

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 9: Later life and endings

Ideas for the 40s through 80s of a Lifetime game: health, money, retirement weeks, family, and an ending that fits the life.

### i9-a01 Medicare at 65: pick your plan (M, 🔴)
At 65 a sheet asks you to pick Medicare with a supplement (higher monthly cost, small hospital bills) or an all-in-one plan (cheaper monthly, bigger bills when you're sick). Sign up late and the premium stays a bit higher for life.
- Replaces the flat $420 'Health care' line at 65+ with the plan you pick; the hospital bill in turn.js scales by plan.
- Opens once at the week you turn 65 (like the January health plan event, J29) and can be changed each October.
- Touches turn.js (bills, hospital bill), events.js (sheet), ui.js (Life tab card), state.js (S.medicare).
- Balance: both plans cost about the same over a typical life; ignoring it adds a 10% late fee, so idle play pays a little more.

### i9-a02 Checkups at 50 lower late-life risk (S, 🟠)
From 50, a yearly checkup shows up as a trip stop in Walla Walla. Each one you keep shaves a little off the late-life ending chance; skipped years show as 'overdue' on the Health card.
- A STOPS entry in features.js and an S.checkups count.
- turn.js: the age-60+ ending chance (p) is multiplied by up to 0.85 for kept checkups.
- Balance: costs a trip and a co-pay; careless and idle players never book it, so only attentive play benefits.

### i9-a03 Midlife: the 'what now?' years (M, 🟠)
Between 40 and 55 a short story chain asks what you want from the second half: pick up a hobby, switch careers, run the Walla Walla half marathon, or buy the motorcycle. Each pays off slowly or flops.
- A chain in features.js (chainSet) with 3 check-ins over two years.
- Hobby and race give lasting small happiness or health; the motorcycle is fun with a crash risk; a career switch links to the late-start career idea (i8-b18).
- Balance: every path costs money or weeks first; the payoff is small (+1 to +3 baseline), so it rewards following through, not one tap.

### i9-a04 Show where health is headed for your age (S, 🟠)
The health bar gets a faint tick at the level your body drifts toward at your age (85 in your 20s, down to 42 past 80), with a plain line: 'At 72, health slowly settles near 55 unless you look after it.'
- turn.js already has the age bands in dH; move them to a helper in state.js and draw the tick in ui.js.
- Explains why health falls in later life without the player feeling punished.
- Balance: information only.

### i9-a05 Hearing aids and cataract surgery (S, 🟡)
In your 60s and 70s, events offer hearing aids or cataract surgery. Get them and you keep up at town meetings and on the road; put them off and community gains shrink and night driving gets riskier.
- Two events in events.js gated on age, with S.aids / S.eyes flags.
- Without aids, Show up for town gives 20% less community; without eye surgery, night road events come up more.
- Balance: a one-time cost that pays back over years; skippers lose a little, never a lot.

### i9-a06 Handing over the truck keys (M, 🟠)
In your 80s, a gentle event asks if it's time to stop driving. Keep the keys and road events get riskier; hand them over and trips go by the county senior van or a neighbor's ride, which costs a little and builds ties.
- events.js event; S.noDrive flag; features.js trips use a 'ride' mode (no gas, a small fee, a wait day).
- The map shows your truck parked at home; your kid or a neighbor gets a thank-you line in the epilogue.
- Balance: no right answer; the van removes the crash risk but trims happiness a little each trip.

### i9-a07 Grab bars before the fall (S, 🟠)
At 75+, a home check suggests grab bars, a railing and a bedroom downstairs. Do it and the 'a fall at home' event becomes rare; skip it and a fall means a rehab stay in Walla Walla and weeks of slow recovery.
- A Life-tab home upgrade for owners and renters (landlord asks for renters), plus one fall event in events.js.
- Rehab: 4 weeks with only Rest and Town focuses and a capped health bounce.
- Balance: cheap fix, real cost for skipping; idle play loses health averages here.

### i9-a08 Hire the neighbor kid for the walk and yard (S, 🟡)
From 70, snow and yard weeks ask: shovel it yourself (health risk), or pay a neighbor teen. Hiring the same kid every time builds a small friendship that shows up later in the epilogue.
- Hooks the winter and fall chore events; S.helperKid with a name from the stand-in name list.
- Balance: small weekly cost; doing it yourself past 75 has a small injury chance.

### i9-a09 Lend a hand: a retiree focus in place of overtime (S, 🔴)
Once retired, the greyed-out 'Work extra hours' slot becomes 'Lend a hand': deliver meals, help at the food bank, fix a neighbor's fence. It gives community and a little happiness, and keeps your days full.
- FOCUS in state.js gets a retiree swap; ui.js shows it in the same spot so the grid never has a dead button.
- Works with i8-a08: Lend a hand counts as a reason for retirement happiness.
- Balance: smaller than Show up for town (+2 community vs +3) so it doesn't become the only pick; the rut rule still applies.

### i9-a10 A standing weekly commitment for retirees (M, 🟠)
Retirees pick one regular thing that happens every week alongside their focus: coffee crew Monday, senior lunch Wednesday, library volunteer Thursday, or Grange cards Friday. It's what retirees in town really do each week.
- S.standing in state.js; turn.js adds its small weekly effect; a card on Home shows it ('Wednesday: senior lunch').
- Each option brings 2–3 of its own events (the lunch raffle, a coffee-crew argument about the bypass).
- Balance: about +0.5 happiness or community a week; it never stacks with more than one, and drops if you miss it during long hospital stays.

### i9-a11 Social Security raises each January (S, 🟡)
Each January the Social Security check goes up with prices, with a Tattler line about the raise. Savings and a paid-off house don't rise, so you can see what fixed income means.
- state.js ssPay() already exists; tie its growth to S.col in January rather than every week.
- Balance: matches what happens today in total; it just lands once a year so the player notices.

### i9-a12 Choose your 401(k) draw rate (M, 🟠)
At retirement, pick how fast to spend your savings: careful (3%), steady (4%) or enjoy it now (6%). The Life tab shows a plain forecast: 'At this pace, savings last to about 88.'
- turn.js uses a fixed 4% today; make it S.drawRate with a forecast helper in state.js.
- Running dry means Social Security only and a 'tight year' note, not an ending.
- Balance: a faster draw raises happiness now and lowers ending net worth, so it's a real trade in the Lifetime score.

### i9-a13 Reverse mortgage or sell and rent back (M, 🟡)
Owners past 62 with a lot of home equity can take a reverse mortgage (monthly money, smaller estate) or sell to a young family and rent the place back. Both turn the house into money to live on.
- Life tab in ui.js, home section; uses the existing equity math in state.js.
- The heir's share in startLegacy shrinks with what you borrowed.
- Balance: it moves value out of net worth into happiness, never adds value; fees mean a careless taker scores slightly lower.

### i9-a14 Mentor a young townsperson (M, 🔴)
From 50, you can take a young worker, an FFA kid or a new teacher under your wing. Check-ins every few months over two years; how often you show up decides whether they make it, and their story ends up in your epilogue.
- A chain in features.js with a named mentee; check-ins are events that ask for a Town or Rest week.
- Success: +community, and the mentee can turn up later as your doctor, your mechanic or the next council member.
- Balance: costs weeks of focus; skipping check-ins ends the chain with a gentle 'they found their own way'.

### i9-a15 Teach what you know at the library (S, 🟠)
Retirees and late-career players can teach a short class at the library based on the job they held longest: welding, canning, bookkeeping, first aid. A few weeks of Study focus gives community instead of education.
- Uses the work history (i5-a24) or the current job group; a library map action in maps.js.
- Balance: only available with 10+ years in one field; community gain is capped per year.

### i9-a16 Grandkid week in July (S, 🟠)
Once you have grandkids, one week each July they stay with you. Pick the plan: fish the Touchet, the county fair, bake for the Celebration Days booth, or just the porch. Each builds closeness and a line in the family story.
- A yearly event in events.js (yr:1) gated on grandkids; a closeness number on the Family card.
- Closeness adds a small community boost to the heir when Legacy starts.
- Balance: costs a week's money and some health for older grandparents; skipping just means no boost.

### i9-a17 Watch the grandkids so your kid can work (S, 🟡)
Your grown kid asks if you can watch the little ones two days a week. Say yes and you lose some free weeks but get happiness and family ties; your kid saves on day care and helps you later.
- A yes/no event that sets S.sitting; turn.js applies a small weekly health cost past 70 and a happiness gain.
- Later, a 'your kid returns the favor' event (rides, a fixed roof).
- Balance: roughly even; it's about the story, and ends on its own when the grandkids start school.

### i9-a18 Phone scams aimed at retirees (S, 🟠)
A call says your grandkid is in jail in Spokane and needs bail money now. Choices: wire the money, hang up, or call the family first. A few kinds of scams come up rarely and teach the warning signs.
- 2–3 events in events.js gated on age 65+, with a cooldown.
- Calling the family first always works; wiring money loses it. A 'Scam smart' badge after three.
- Balance: only hurts players who pick the wrong choice; auto-pick takes the safe option.

### i9-a19 Caring for your partner (M, 🟠)
In your 70s your partner may get sick. You become their caregiver: weeks get harder, and you choose help: a paid aide a few days a week, adult day care in Walla Walla, or family taking shifts.
- A chain in features.js; S.partnerCare changes weekly happiness and health in turn.js.
- Ties to the family caregiver pay idea (i7-a25) if built.
- Balance: costs money or health either way; good choices soften it, they don't remove it.

### i9-a20 Losing your partner, gently (M, 🔴)
Late in a Lifetime game your partner can pass away. A quiet event, a heads-up line (i7-a15), then a grief stretch where happiness can't climb as high for a few months, neighbors bring casseroles (more if your community is high), and later you may find a friend for coffee.
- features.js chain: S.partner becomes S.late, with a 'remembering' line on the Family card.
- turn.js caps happiness for 26 weeks; the partner's line moves to the epilogue.
- Balance: the cap is temporary; strong community and family shorten it, which rewards good play over idle.

### i9-a21 Sort the house: keep, give, sell (M, 🟠)
When you downsize or after 75, a sorting sheet lists what's in the house: the old pickup, your mom's quilts, the fishing gear, the piano. Keep some, give some to family, sell the rest at a yard sale.
- A sheet in ui.js built from things you've owned (truck, home, pets, hobbies, keepsakes if built).
- Selling gives cash; giving to family raises heir community; kept items show in the epilogue.
- Balance: total value is small; it's a story moment with a little money.

### i9-a22 Give while you're living (M, 🟠)
From 60, give money now: help a kid with a down payment, fund the pool, give to the food bank. Gifts lower net worth but raise community and happiness, and the ending counts half of what you gave toward wealth.
- Life tab in ui.js; S.given tallied; lifeScore() in features.js adds 50% of gifts to net worth for the wealth part.
- Gifts show in the obituary and epilogue lines.
- Balance: at 50% credit, giving is never a score exploit; it trades some wealth for community.

### i9-a23 Medicaid steps in when care runs long (S, 🟡)
If long-term care (i3-a31) drains your savings, Medicaid starts paying instead of the game ending in debt. A plain note explains it, and the house may go to cover care costs instead of to your heir.
- turn.js: debt ending skipped for players 75+ in care; a 'care covered' line replaces the cost.
- Balance: protects late-life endings from a sudden debt loss; the heir gets less, so no free lunch.

### i9-a24 Talk it over: your wishes on paper (S, 🟠)
Past 70, a quiet event asks if you want to sit down with family and write down your wishes: who speaks for you, what care you want, where you'd like to be. Doing it makes the last weeks calmer for everyone.
- One event in events.js; S.wishes flag.
- With it, the final season (i9-a25) starts with family already there, and hospital bills at the end are smaller.
- Balance: a small happiness gain and nothing else; it's about tone, not score.

### i9-a25 A final season instead of a sudden end (L, 🔴)
Today a Lifetime game can end on any week with no warning. Instead, when the end draws near, a 'final season' begins: a few weeks with softer choices (time with family, the porch, one last outing), then the ending.
- turn.js: when the age-60+ chance hits, set S.final = 4–8 weeks instead of ending; ui.js swaps the focus grid for gentle options.
- Content notes (i7-a15) and no Auto skipping through it.
- Balance: no score changes in the final weeks except small happiness; the ending odds stay the same.

### i9-a26 Goodbyes: three visits in your last season (M, 🟠)
In the final season, pick up to three people or places to visit: a grown kid, your old workplace, the Touchet, the café. Each visit is a short scene and adds a line to the epilogue.
- Built on i9-a25; uses maps.js places and the people you know (kids, partner, mentee, neighbors).
- Balance: no stat effects beyond happiness; purely closure.

### i9-a27 Record stories for the grandkids (S, 🟡)
From 70, a Rest-week option to record a story about your life (your first job, the flood year, how you met your partner). The heir starts with those stories, and each one becomes a line they can read on their Family card.
- Stories pulled from S.log milestones; saved to the legacy parent object in features.js.
- Balance: tiny heir community bonus per story, capped at 3.

### i9-a28 Endings that fit the life (S, 🔴)
The natural ending always says 'with the whole town at the service'. Write it from your life instead: who was there (partner, kids, the coffee crew), how many came (by community), and where (the church, the Grange, the park).
- finish() reason text in turn.js built from S.partner, S.kids, community and S.standing.
- Low community reads gently: 'a small service with family close'.
- Balance: text only.

### i9-a29 A life chart on the ending screen (M, 🟠)
The ending screen shows a simple chart of happiness, health, community and net worth year by year, with marks for big moments (married, bought the house, retired). You see the shape of your whole life.
- The year-in-review snapshot in turn.js already exists; store one per year in S.years and draw an SVG in features.js finish().
- Balance: display only; also helps players see what a good life looked like.

### i9-a30 What it added up to: a life's tallies (S, 🟡)
A short list of fun totals on the ending screen: weeks worked, miles driven on US-12, potlucks, fish caught, kids raised, council votes cast, dogs loved.
- Counters in S.tally bumped in turn.js and features.js; shown in finish().
- Balance: display only.

### i9-a31 Pick a line for your stone (S, 🟡)
At the very end you choose one line for your headstone from three that fit your life ('Never missed a home game', 'Fed half the town', 'Paid off the farm'). It goes on the score card and the lives shelf.
- Lines picked from badges, focus history and milestones in features.js.
- Balance: text only.

### i9-a32 Lifelong habits shape the late years (S, 🟠)
The late-life ending chance looks at your average health over your life, not just this week. Years of rest, the outdoors and checkups buy you more time; decades of overtime on a worn-out body cost some.
- turn.js line for p: blend current health with S.healthSum / S.monthsPlayed.
- Balance: helps good play reach old age; careless and idle lives end a bit sooner, which keeps their scores where they should be.

### i9-a33 Faster late years: monthly turns after 70 (L, 🟠)
Past 70 (or once retired), offer a 'month at a time' pace: each End Week covers four weeks with the same focus, and only real moments stop it. The late game moves at a pace that fits it.
- turn.js already supports a month multiplier (m); add an S.pace option and keep events weekly-weighted.
- Balance: the sim runs both paces to confirm scores match; Auto-only idle play still drifts down.

### i9-a34 Age bands on every event, checked by tests (M, 🟠)
Give each event an age range (say 'first apartment' 18–35, 'grab bars' 75+) and have the tests check no 80-year-old ever gets a young-adult event and late-life events never reach a 25-year-old.
- An age field in events.js entries read by the event picker; a rules test walks every event at ages 20, 45, 70 and 90.
- Balance: none; keeps the later years feeling right.

## Ideas 9: Learning real-life skills

Ideas that let the game teach money and life skills by showing, not lecturing, plus an offline classroom mode for Waitsburg and Dayton schools.

### i9-b01 A pay stub you can open (S, 🔴)
Tap 'Paychecks and bills' to see a real pay stub: gross pay, federal withholding, Social Security and Medicare, WA Cares and paid leave, and the pre-tax 401(k). The total matches today's flat tax, just split into named lines.
Touches: turn.js weekTick tax line (line 81) splits into labeled parts; ui.js week sheet adds the stub view.
Balance: Same total as now, so no score change. Pure teaching.

### i9-b02 A 'Real-life notes' switch (S, 🔴)
One Settings switch turns on short real-life notes after money moments. Off by default, on automatically in class mode, so regular players are never lectured.
Touches: state.js settings flag; ui.js; the hook every other 'note' idea in this group uses.
Balance: No effect on play or score.

### i9-b03 'What would this cost in real life?' moments (M, 🔴)
With notes on, big purchases and bills show one line comparing the game price to a typical real range today (rent, a used sedan, a root canal). Prices live in one data table with a 'checked' year.
Touches: New PRICES table in state.js; event results in events.js and Life-tab purchases in ui.js read it.
Balance: Text only. Never changes money.

### i9-b04 A monthly budget with three buckets (M, 🔴)
A Budget sheet on the Life tab: set a plan for needs, wants and savings. At month's end you see plan vs. actual, and staying on plan gives a small 'peace of mind' happiness bump.
Touches: New budget state in state.js; month-end check in turn.js; sheet in ui.js.
Balance: Bump is +1 happiness, capped once a month, and only if you also saved something, so a plan alone can't farm score.

### i9-b05 Emergency fund meter (S, 🟠)
Home shows how many months of bills your cash covers. At three months or more, surprise-bill events add a calm 'pay from the fund' choice with no stress hit.
Touches: Computed from S.money and the last month's bills in turn.js; events.js adds the option; ui.js meter.
Balance: Rewards holding cash, which careless and idle play rarely do. Only removes a small happiness hit.

### i9-b06 A store credit card and the minimum payment (M, 🔴)
A Kennewick store offers a card at the register. Debt on it charges card interest, and the statement shows: 'Paying the minimum, this takes 9 years and costs $X in interest.'
Touches: New card balance in state.js; monthly statement in turn.js; offer event in events.js; card line in net worth.
Balance: Card interest is higher than cash debt, so careless use costs more. Paying it off in full each month costs nothing.

### i9-b07 A payday loan offer when you're broke (S, 🟠)
When cash is near zero, a storefront loan shop (stand-in name) offers $400 fast. The offer shows the yearly rate in plain words. Taking it costs much more than waiting it out.
Touches: One event in events.js gated on low cash; a short-term loan field in state.js.
Balance: Strictly worse than the alternatives over time, so it can't help careless play.

### i9-b08 Pay off debts in the order you choose (S, 🟡)
With two or more debts (card, truck, student loan), a Debts sheet lets you put extra money toward one: smallest first or highest rate first. It shows the interest each order saves.
Touches: ui.js sheet; turn.js applies the extra payment; builds on the truck and student-loan fields.
Balance: Only moves money you already have. Saves interest for players who think about it.

### i9-b09 An overdraft fee the first time you go below zero (S, 🟠)
The first time cash dips under $0, the bank charges a $35 overdraft fee and offers free overdraft protection from your savings. One note, one choice, then it's handled.
Touches: turn.js money step; one-time event in events.js.
Balance: A small one-time cost. Teaches before the debt slide starts.

### i9-b10 Compound interest birthdays (S, 🟠)
At 25, 35 and 45, a short card shows what your 401(k) is now and what it would be at 65 if you add nothing more, and if you add $100 more a month.
Touches: Birthday check in turn.js; uses the 6% growth already in turn.js line 126.
Balance: Text only. Nudges toward saving without changing the math.

### i9-b11 Money left on the table: the 401(k) match (S, 🔴)
If you contribute less than the match needs, the 401(k) row says 'You're skipping $X a year your employer would give you.' One tap sets it to 5%.
Touches: ui.js Life-tab 401(k) row; K401 and the 3% match in turn.js.
Balance: Helps good play find the match. Careless play still has to tap it.

### i9-b12 'Will I have enough?' retirement check (M, 🟠)
A sheet projects your 401(k) and Social Security at 65 against your current bills, and shows what +5% saving or retiring two years later would change.
Touches: ui.js sheet; reads S.k401, ssPay() and the monthly bill lines.
Balance: A planning view only.

### i9-b13 Read the lease before you sign (M, 🔴)
Renting the house brings up a short lease card with four clauses: deposit, pets, breaking the lease early, who fixes what. Reading it costs nothing; skipping it can mean a surprise fee later.
Touches: HOMES moves in ui.js; lease terms in state.js; a later 'clause' event in events.js checks whether you read it.
Balance: Skipping can only cost money, so careless play loses a little.

### i9-b14 Move-in costs and getting your deposit back (S, 🟠)
Renting a new place takes first month plus a deposit. Moving out returns the deposit, minus damage if the dog chewed the door or chores slid.
Touches: Home change in ui.js; deposit field in state.js; refund on move.
Balance: Deposit comes back for careful players, so it's mostly a cash-timing lesson.

### i9-b15 Rent vs. buy, side by side (M, 🔴)
The Homes list gets a 'Compare' button: five years of renting vs. buying with your numbers: down payment, payments, equity built, repairs and taxes. Plain verdict line at the bottom.
Touches: ui.js Homes view; HOMES equityPer and down in state.js.
Balance: Information only; buying already pays off for good play.

### i9-b16 Open enrollment: pick a health plan (M, 🟠)
Every November, jobs with benefits ask you to pick a low-deductible plan (higher paycheck cost) or a high-deductible plan with a health savings account. Medical events then cost what your plan says.
Touches: New plan field in state.js; payroll line in turn.js; medical events in events.js read the deductible.
Balance: Both plans come out close on average; the choice changes risk, not the expected score.

### i9-b17 W-4 at hire: more now or a refund later (S, 🟡)
Taking a job asks one question: withhold a bit less (bigger paychecks) or a bit more (a refund in spring). Builds on Tax refund season if that ships.
Touches: Hire flow in ui.js; a withholding setting in turn.js.
Balance: Same yearly total either way.

### i9-b18 Free tax help night at the library (S, 🟠)
Each February, an event offers a free tax help night at the library. Low-pay and parent players who go get a work credit they'd otherwise miss.
Touches: One event in events.js (Feb, weighted for low pay or kids).
Balance: Costs an evening (small happiness). Helps those who show up, not idle play.

### i9-b19 Hourly jobs and time-and-a-half (S, 🟡)
Hourly jobs show their hourly rate, and 'Work extra hours' pays time-and-a-half on the extra hours, so the stub shows why overtime pays more than it looks.
Touches: JOBS gets an hourly flag in state.js; payMult in turn.js stays about the same total.
Balance: Keep the same +20% total, so no balance change.

### i9-b20 The first paycheck comes two weeks late (S, 🟡)
A new job pays its first check after two weeks, like real payroll. The week sheet says why, and Home shows 'First paycheck: in 2 weeks'.
Touches: turn.js paycheck line; a payStart field in state.js.
Balance: Small cash hit on every job change, which slightly punishes careless job-hopping.

### i9-b21 The real price of the new pickup (S, 🟠)
Financing the pickup shows the total you'll pay over five years, not just the monthly. The dealer then offers an extended warranty and paint protection you can turn down.
Touches: Car purchase in ui.js; CARS.truck in state.js; add-ons as a choice.
Balance: Add-ons cost more than they save on average.

### i9-b22 A scam text from 'your bank' (S, 🟠)
A text says your account is locked and asks for a code. Calling the bank from the number on your card is safe; replying costs money and a week of stress.
Touches: One event in events.js, low weight, any age.
Balance: Wrong choice costs; right choice is free. Neutral for idle play.

### i9-b23 Read the bill: catch the mistake (S, 🟡)
Now and then a phone or repair bill has a double charge. 'Check the bill' takes a little time and gets it back; 'just pay it' doesn't.
Touches: One event in events.js with two outcomes.
Balance: A few dollars either way; rewards attention.

### i9-b24 Prices then and now in the year review (S, 🟠)
The year review adds one line: 'A gallon of milk was $4.10 when you were 18. Now it's $5.30.' It uses the game's own price growth.
Touches: turn.js year review; S.col from state.js.
Balance: Text only.

### i9-b25 Student loan plans for the grad start (S, 🟡)
The grad start can switch its student loan to an income-based plan: lower payments when pay is low, longer to pay off, more interest overall.
Touches: sloanPay and sloanLeft in state.js; a sheet in ui.js.
Balance: Lower monthly cost but more total, so net worth comes out about even.

### i9-b26 Money lessons from this life (M, 🔴)
The end screen adds three lines from your own life: interest you paid, 401(k) match you skipped, and weeks with no cushion. Each is a plain fact with one 'next time' idea.
Touches: Lifetime counters in state.js updated in turn.js; end screen in features.js.
Balance: Text only. Fits beside the existing 'try next time' line without repeating it.

### i9-b27 Class codes that work offline (L, 🔴)
A teacher picks length, start, mode and topics and gets a short class code. Students type it in: everyone plays the same dice and settings, with family-friendly events on. No accounts, no internet.
Touches: Code encode/decode in features.js, reusing the weekly-challenge dice; new title-screen entry in ui.js; Settings flags.
Balance: Class lives are practice mode and stay out of records and badges.

### i9-b28 Guided lesson units (L, 🔴)
Six short practice-mode units: First paycheck, First apartment, Car trouble, The credit card, Moving out, Saving for later. Each runs 4–8 weeks with one goal and ends on a debrief card.
Touches: Built on the challenges code in features.js with practice mode; unit data in a new table.
Balance: Practice mode, so no score or badge effect.

### i9-b29 Discussion prompts at checkpoints (M, 🟠)
In class mode, a question card appears at set points ('Why did you pick that place?'). No right answer. The student types a line, and it's saved for the printable.
Touches: Checkpoint hook in turn.js; prompt list and answers in state.js; sheet in ui.js.
Balance: No effect on play.

### i9-b30 A printable one-page summary (M, 🔴)
The end screen (and class mode) gets 'Print summary': name, class code, choices, a simple budget chart, net worth and the student's prompt answers on one page.
Touches: Print stylesheet in index.html; summary builder in features.js.
Balance: No effect on play.

### i9-b31 Result codes for the teacher's table (M, 🟠)
Each student's end screen shows a short result code. On the teacher page, typing in codes builds a table (score, weeks in debt, share saved) for class discussion, all on one device.
Touches: Encode results in features.js; a teacher sheet in ui.js. Codes carry no names unless typed.
Balance: No effect on play.

### i9-b32 A teacher guide in Help (S, 🟡)
A Help page for Waitsburg and Dayton teachers: which unit fits which topic, how long each takes, how class codes and printing work, and three ready discussion questions per unit.
Touches: help.js new section.
Balance: Text only.

### i9-b33 Small splurge, long shadow (S, 🟡)
With notes on, optional splurges over $500 show one line: 'Saved instead, this could be about $X at 65.' Shown once per kind of purchase, never twice in a row.
Touches: ui.js and events.js purchase choices; uses the 401(k) growth rate.
Balance: Text only, rate-limited so it doesn't nag.
