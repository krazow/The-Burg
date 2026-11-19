# Ideas round 34

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 34: School and kids' lives

Ideas that make Waitsburg's small K-12 school the center of family life, seen from a parent's side.

### i34-a01 A school record for each kid (M, 🔴)
Each kid on the Family card gets a small school line: grade level, a grades meter, and their activity. Grades rise in weeks you rest or do community at home and slip in long-commute or hustle streaks.
Turns S.kids from birth months into small objects {b, name, grades, act} with a save migration in state.js; Family card in features.js. Grades nudge happiness only, capped, so idle play gains little.

### i34-a02 Report cards come home in January and June (S, 🔴)
Twice a year a report card event shows each school-age kid's grades in plain words ("mostly B's, trouble in math"). You can praise, push or hire a tutor in Walla Walla.
New dated event in events.js reading the kid's grades. Tutor costs money and a weekly hour; pushing lifts grades but costs a little happiness. No choice is free.

### i34-a03 Parent-teacher conference night (S, 🔴)
In November and March the school sets a conference night. Go and you learn what your kid needs; skip it for a shift and the grades meter drifts down a bit.
Event in events.js, cat town, place school. Work-shift jobs (JOB_GROUP field) must trade an evening shift. Small community bump for going.

### i34-a04 Join the PTO (M, 🟠)
A season-long role on the Activities card: monthly meetings in the school library, one fundraiser to run, and a say in what the money buys (new library books or a gym scoreboard).
New role in features.js like season goals; worked with community focus. Pays community and kid grades a little; uses weekly time so it competes with work and rest.

### i34-a05 The PTO cash box is $80 short (S, 🟡)
As PTO treasurer you count the bake-sale box and it doesn't match. Cover it yourself, ask around, or report it at the meeting and risk hard feelings.
One-off moral event in events.js, only if in the PTO. Each choice trades money against community and happiness.

### i34-a06 The bus stop at the end of the gravel road (S, 🟠)
If you live out in the hills, your kid waits for the bus at the county road in the dark and cold. You can drive them in each morning (gas and a later start) or let them ride.
Event in events.js for rural homes (farm background or farm-area home). Driving adds a weekly gas cost in turn.js for the season; riding risks a cold or a missed-bus scramble.

### i34-a07 Fog delay: school starts two hours late (S, 🟡)
Valley fog in winter brings a two-hour late start. Work starts on time, so you find someone to watch the kids, take the hit at work, or bring them along.
Small winter event (months 11–1) in events.js, separate from snow days. Trades a work-pay slice against a neighbor favor or happiness.

### i34-a08 Transfer your kid to Walla Walla or Dayton schools (M, 🟠)
Washington lets families choose another district. Moving a kid to a bigger school brings more classes and teams but a daily drive and fewer friends in town.
Choice on the Family card (features.js) per kid. Adds commute miles via commuteOneWay-style cost in state.js, raises grades ceiling, lowers your community a little each year. Reversible once a year.

### i34-a09 Homeschool a kid (L, 🟠)
Keep a kid home for school with a local homeschool co-op that meets at the church hall. It costs you work hours and a small books budget, and their grades depend on your weekly focus.
New per-kid school mode in state.js; any week not on rest or community lowers grades faster. Caps your work hours like part-time. Careless play does worse than public school, so it is a real commitment, not a shortcut.

### i34-a10 Kindergarten round-up (S, 🟡)
The spring before a kid turns five, the school holds round-up day: shots, a bus tag, and a first look at the classroom. The first day of school follows in late August.
Two small dated events keyed to kid age in events.js. Shots cost a little unless you have the health plan. Mostly a warm milestone with a Journal line.

### i34-a11 Booster club concession stand (S, 🟡)
Work a shift at the snack shack during home games: hot dogs, cocoa and gossip. Shifts raise money for team buses and earn you community.
Fall and winter Friday event, place school field. Costs an evening and a bit of happiness when it's 30 degrees out; capped to a few times a season.

### i34-a12 Band trip fundraiser: sell fruit boxes (S, 🟡)
Your kid's band is raising money for a trip to a festival in Spokane. Sell citrus boxes at work, buy the leftovers yourself, or let your kid knock on doors.
Event in events.js if a kid has the music activity. Selling at work uses coworker goodwill; buying costs money; door-knocking helps the kid's confidence.

### i34-a13 The spring musical needs a set crew (S, 🟡)
The school's spring play needs flats built and painted. Give two Saturdays and you see your name in the program and your kid on stage.
Spring event; better outcome if you have the woodshop or handy skill. Costs weekend time; pays community and kid happiness.

### i34-a14 Homecoming week and the Main Street parade (S, 🟠)
Spirit days, a float on a hay wagon, and the bonfire. Help your kid's class build a float or just line the street with the town.
October event in events.js, places Main St and fields. Helping costs a weekend and a little money for crepe paper; gives community and a Journal line.

### i34-a15 Field trip chaperone (S, 🟡)
The fourth grade is going to the dam and the fish ladder, and they need one more parent. Take a day off work to ride the bus with 22 kids.
Event in events.js; costs a day's pay for hourly jobs, less for salaried. Lifts community and kid happiness.

### i34-a16 The school nurse calls: come get your kid (S, 🟠)
Your kid has a fever and has to go home now. Leave work, call a grandparent or neighbor, or ask the office to keep them till lunch.
Work-cat event in events.js only on work weeks with a kid in school. Leaving costs pay; calling family uses a favor; waiting costs happiness. Adds real parent friction.

### i34-a17 Sports physicals and the August paperwork pile (S, 🟡)
Every August each kid in sports needs a physical, a signed form and a fee before the first practice. Miss the deadline and they sit out a week.
Small August event folded into back-to-school week; costs a little money or a clinic trip. Teaches planning without big swings.

### i34-a18 A trouble at school: your kid is being picked on (S, 🟠)
Your kid comes home quiet. You can call the principal, talk to the other kid's parent (you know them from church), or teach your kid to handle it.
Event in events.js with three choices that move kid happiness, your community and a later follow-up event. No choice is all upside.

### i34-a19 Your kid wants to quit (S, 🟡)
Halfway through the season your kid wants to quit the team or lessons. Make them finish, let them quit, or find something else.
Event tied to the kid's activity field. Finishing costs fees and a little happiness now but lifts grades later; quitting saves the fee.

### i34-a20 Teen's first summer job (M, 🔴)
At 15 or 16 your teen can work: wheat harvest, the city pool, or a fruit stand on the highway. They earn their own money, and you decide how much they save.
Summer event chain keyed to kid age; adds a teen savings number on the kid record. Teen savings later cut college costs, so it pays only if you steer it. No money flows to the player.

### i34-a21 Driver's ed and the insurance bill (S, 🟠)
Your teen wants a license. Driver's ed runs at night in Walla Walla, and adding a teen to your auto policy raises the bill every month.
Event at kid age 15–16 in events.js; adds a monthly line in turn.js bills until the kid leaves home. Links to the existing teen fender-bender event.

### i34-a22 FAFSA night in the school library (S, 🔴)
Senior fall, the counselor runs a night to help families fill out the federal aid form. Go and the college bill shrinks; skip and you pay more later.
October event when a kid is 17; sets a flag that lowers the college-help cost in the existing college event. Rewards planning, not luck.

### i34-a23 College applications and fees (M, 🟠)
Your senior picks schools: the community college, a state school across the mountains, or a reach school. Each costs an application fee and changes what the college event asks of you.
Fall event chain at kid age 17 in events.js; choice sets the kid's path. Grades meter gates the reach school. Feeds the existing college and grown-kid events.

### i34-a24 Local scholarship night (S, 🔴)
In May the town hands out small scholarships from the service clubs, the Grange and local families. Your kid's grades and your years of volunteering decide what they get.
May event when a kid is 18. Award amount reads kid grades and your community score, so only engaged play pays. Lowers college costs; uses stand-in club names.

### i34-a25 Help with the scholarship essay (S, 🟡)
Your senior is stuck on an essay about growing up in a small town. Sit with them for an evening and the award odds go up.
Small spring event before scholarship night; costs an evening (happiness neutral, small tired hit). Sets a flag the scholarship night reads.

### i34-a26 The all-night grad party (S, 🟡)
Parents run a safe, all-night grad party at the school gym, with games and prizes. Volunteer a shift at 3 a.m. or donate a prize.
June event when a kid is 18. Costs health (sleep) or money; pays community. Quick warm milestone.

### i34-a27 Grad open house in the backyard (S, 🟠)
Your kid's graduation: a class of two dozen, and the whole town walks down the street to each open house. Host one, or join another family's.
June event after the grad party. Hosting costs money for food and gives community; joining is cheaper. Journal line for the milestone.

### i34-a28 School counselor: college, trades or the farm (M, 🟠)
In junior year the counselor sits down with you and your teen. Talk up college, an apprenticeship, or coming home to work.
Event at kid age 16 sets a path on the kid record that the grown-kid events read (stay or go). Ties to the legacy grandkid start.

### i34-a29 Coach the junior high basketball team (M, 🟡)
The school needs a volunteer coach for seventh and eighth grade. Two practices a week in winter and road trips on the bus.
Winter role on the Activities card; uses weekday evenings (cuts rest effect). Pays community and a coaching Journal line; capped to one season a year.

### i34-a30 Help with homework at the kitchen table (S, 🟠)
On rest weeks you can pick a small 'homework night' option that lifts a kid's grades more than resting alone does.
A sub-choice on rest focus in turn.js when kids are 6–17. Trades some of rest's happiness for grades; no effect for idle autoplay that skips the choice.

### i34-a31 Parent volunteer hours on the Family card (S, 🟡)
A simple tally of your school volunteer nights each year, shown on the Family card, with a small end-of-life note like "Gave 140 hours to the school."
Counter in state.js bumped by school events; shown in features.js and the end screen. Display only, so it can't be farmed for score.

### i34-a32 Yearbook ad for your business (S, 🟡)
If you own a business, the yearbook staff asks you to buy an ad. A quarter page costs a little and brings a few local customers.
Spring event for business owners in events.js; small boost to business visits for a season. Ties school life to the business card.

## Ideas 34: Buying, renting and housing

Ideas for house hunting, renting, buying, selling and the short supply of places to live in Waitsburg.

### i34-b01 Buying takes weeks: a house hunt with showings, offer and closing (L, 🔴)
Tapping Buy starts a short hunt instead of an instant move: a showing week, an offer, an inspection and a closing day 4 to 6 weeks out at the law office. You keep paying rent until the keys are yours.
Touches: js/ui.js moveHome becomes a small S.hunt state machine; js/turn.js advances it each week; closing notes in the week log.
Balance: Delay and carrying costs slow quick flips; careless players who forget to save the down payment lose the deal, careful ones get a calm checklist.

### i34-b02 Three listings, each with one hidden catch (M, 🔴)
A showing week shows three real-street listings near the asking price, each with one line of hint ("fresh paint in one bedroom", "sump pump in the basement"). The catch shows up after you move in unless an inspection found it.
Touches: js/state.js listing table; js/ui.js Homes list; js/events.js move-in surprises.
Balance: Reading the hints and paying attention beats tapping the cheapest; no idle gain.

### i34-b03 Pay for the inspection or waive it (S, 🔴)
Before closing, pay about $450 for an inspection or waive it to win the house. An inspection names the catch so you can ask for a repair credit or walk away; waiving risks a $2,000–8,000 surprise in year one (roof, septic, wiring).
Touches: js/ui.js offer sheet; js/events.js 'The inspector's list' and move-in surprise events.
Balance: Waiving is the careless pick and is usually worse on average; good play pays a small fee to dodge a big hit.

### i34-b04 Make an offer: under, at or over asking (M, 🟠)
Pick under asking (cheaper, may lose it), at asking, or over asking with an escalation cap. In a tight Waitsburg year with few listings, another buyer often bids too.
Touches: js/ui.js offer sheet; uses the housing index if i21-b03 lands, else a simple tight/normal flag per year.
Balance: Overbidding raises the mortgage for 30 years; underbidding often means waiting. Neither is free.

### i34-b05 The appraisal comes in low (S, 🟡)
Sometimes the bank's appraiser values the house below your offer. Cover the gap in cash, ask the seller to drop the price (People skill helps), or back out and get your earnest money back.
Touches: js/ui.js closing step; js/state.js skills check.
Balance: Only bites over-asking offers, so it checks the overpay habit.

### i34-b06 Earnest money and the deal that falls through (S, 🟡)
An offer puts $1,000 in earnest money at the title office. If you back out for a reason in the contract you get it back; if you just change your mind, you lose it.
Touches: js/ui.js hunt flow; money log line.
Balance: Teaches the rule plainly; small sum, no balance risk.

### i34-b07 Closing costs on top of the down payment (S, 🔴)
Buying costs about 3% more at closing: the loan fee, title insurance, the first escrow deposit. The Homes list shows 'cash to close' as one number so nobody is surprised.
Touches: js/ui.js moveHome need math and the Homes row text; HOMES gains a close field.
Balance: A small extra cost on buying keeps early buying from being a free win over renting.

### i34-b08 A USDA rural loan: no money down in Waitsburg (L, 🔴)
Waitsburg counts as rural, so a stand-in USDA rural loan lets low and middle earners buy with nothing down, plus a 1% guarantee fee and a small yearly fee in the payment. Above the income limit you don't qualify.
Touches: js/ui.js moveHome adds a loan picker; js/state.js loan types and income limit by household size.
Balance: Opens buying earlier for steady workers; the income cap and fees keep it from helping high earners or idle players (no job, no loan).

### i34-b09 First-time buyer class and down payment help (M, 🟠)
Take a Saturday homebuyer class at the library (one focus week) and you can get a stand-in state down payment loan: up to $10,000 at low interest, repaid when you sell or refinance.
Touches: js/ui.js Homes list unlocks; js/turn.js class week like a short study; S.dpa balance taken out of home sale.
Balance: Costs a week of focus and is a loan, not a gift; only first-time buyers.

### i34-b10 Mortgage insurance until you hit 20% (S, 🟡)
Buy with under 20% down and the payment carries mortgage insurance. Once your equity passes 20%, a note says you can ask the bank to drop it, and the payment falls.
Touches: js/turn.js equity check; js/ui.js home row shows 'includes mortgage insurance'.
Balance: Rewards paying down and checking the Life tab; small sums.

### i34-b11 The escrow letter: taxes and insurance went up (S, 🟠)
Each January the bank's escrow review says property tax and home insurance rose, so the mortgage payment goes up $20–60 a week, or you pay the shortage in one lump.
Touches: js/turn.js January check; S.mortgage adjusts; pairs with property tax idea i3-a20.
Balance: Keeps owning from being a frozen cost forever; small and predictable.

### i34-b12 Your insurer won't renew after fire season (M, 🟠)
After a bad fire summer, the home insurer sends a non-renewal letter for houses near the wheat or brush. Shop the state's fair-access plan (pricier) or a local agent, and clearing defensible space around the house helps.
Touches: js/events.js new event for owners; uses the fire-edge flag from i18-b13 if built.
Balance: Real risk of owning in the hills; good play clears brush on an Outside week to soften it.

### i34-b13 A manufactured home on a rented lot (M, 🔴)
A new Homes row: buy a used manufactured home in a park for $25,000–45,000 with a small chattel loan, then pay lot rent. Cheaper than a house, but the home loses value instead of gaining, and lot rent rises every year.
Touches: js/state.js HOMES gains 'mobile' with depreciation and lotRent; js/ui.js Homes row; js/turn.js yearly lot rent bump.
Balance: A real middle step between renting and a house; depreciation keeps it from beating the fixer for long-run equity.

### i34-b14 The park is sold to an investor (S, 🟡)
Some years the manufactured home park changes hands and lot rent jumps 20%. Residents can band together to make an offer (Community helps), pay up, or move the home for $6,000.
Touches: js/events.js; only fires for 'mobile' owners.
Balance: Rare; the community route rewards neighbors you've kept up with.

### i34-b15 Put the home on your own land (M, 🟠)
Own a manufactured home and buy a small lot or the empty lot next door (i33-b19) and you can move it there: a one-time $6,000–9,000 for the move, septic and hookups, then no lot rent and the land holds value.
Touches: js/ui.js Life tab action for mobile owners; js/state.js S.lot.
Balance: A long-game path for patient players; big upfront cost, no short-term edge.

### i34-b16 Housing is scarce: listings come and go (M, 🔴)
Homes and rentals aren't always open. Each week 0–2 places are listed in town and most stay a few weeks before someone else takes them. The Homes list says 'Nothing for rent in town right now' when that's true.
Touches: js/state.js S.listings rolled in js/turn.js; js/ui.js Homes list shows only open listings and the Dayton/Walla Walla fallback.
Balance: Idle players miss listings; careful players watch for them. Keeps buying a choice at the right time, not a button.

### i34-b17 Hear about a place before it's listed (S, 🟠)
With Community 60+, a neighbor, the postmaster or someone at church tells you a house is coming up for sale or rent a week before anyone else. You get first look.
Touches: js/turn.js listing roll gives a private early listing; note in the week log; ties to i31-a16.
Balance: Rewards community, which already counts in the score; only one early look at a time.

### i34-b18 Join the waitlist for the rented house (S, 🟡)
When the rented house is full, put your name on the landlord's list. A spot opens in 4 to 20 weeks; a good rental history moves you up.
Touches: js/ui.js Homes row 'Join waitlist'; js/turn.js countdown; uses i17-a24 reference if built.
Balance: Patience, not money; nothing for idle players who never sign up.

### i34-b19 The landlord is selling: 60 days to move (M, 🔴)
Renters sometimes get a notice that the owner is selling or turning the place into a weekend rental. You have about 8 weeks: find another listing, offer to buy it yourself, or land in a pricier place in Dayton.
Touches: js/events.js renter event; js/turn.js deadline; ties to listings and the buy flow.
Balance: A real renter worry; savings and community make it a bump, not a crash.

### i34-b20 Month-to-month or sign for a year (S, 🟠)
At move-in and each renewal, choose a 12-month lease (rent locked, a fee to break it early) or month-to-month (a little more each month, rent can rise with 60 days' notice, free to leave).
Touches: js/ui.js move sheet; js/state.js S.lease end week; pairs with i21-b13 renewal.
Balance: Small trade-off between flexibility and price; neither is always best.

### i34-b21 The 90-day rent notice: talk, pay or move (S, 🟡)
Washington landlords must give notice before raising rent. When the notice comes you can ask for a smaller raise (People skill and a clean payment record help), accept it, or start looking.
Touches: js/events.js renter event; builds on i21-b13 timing without repeating its once-a-year rule.
Balance: Asking only works with a good record, so careless late payers can't talk their way down.

### i34-b22 Rental help: the housing voucher waitlist (M, 🟠)
Low-income renters can sign up for a stand-in housing voucher at the county housing office. The wait is long (a year or more); when it comes through, rent drops to about 30% of pay while income stays under the limit.
Touches: js/turn.js waitlist timer; js/ui.js Life tab note; listed on the 'When money's tight' Help page (i29-a29).
Balance: Only below an income limit and only after a long wait; raising pay ends it, so it's a floor, not a strategy.

### i34-b23 Moving day: hire movers, rent a truck, or call friends (S, 🔴)
Moving now costs a flat $300. Instead pick: movers from Walla Walla ($1,200, no strain), a rented box truck ($250 plus gas, a tired week), or friends with pizza (free with Community 40+, owes them a favor later).
Touches: js/ui.js moveHome cost picker; js/turn.js 'tired week' flag; favor event in js/events.js.
Balance: Gives moving real choices; moving often gets costly or tiring, which checks house-hopping.

### i34-b24 Selling takes time: list it and wait (M, 🔴)
Selling a home is no longer instant. List with an agent (about 6% fee) or by owner (cheaper, slower). Showings come over weeks; offers depend on price and the year's market. You keep paying the mortgage until it closes.
Touches: js/ui.js sell action; js/turn.js weekly offer rolls; S.listingHome. Today moveHome credits the sale at once.
Balance: Removes a free instant cash-out; patient pricing does better than dumping it.

### i34-b25 The buyer's inspection asks for repairs (S, 🟡)
When you sell, the buyer's inspector finds things. Fix them (Handy skill saves money), give a credit, or say no and risk the buyer walking.
Touches: js/turn.js sell flow; skillLv('handy').
Balance: Owners who kept up the house face a shorter list, so upkeep pays off at the end.

### i34-b26 Buy before you sell: two payments at once (S, 🟡)
Moving up while you still own? Buy now and carry two mortgages until the old place sells, or sell first and rent the room for a few months in between.
Touches: js/ui.js buy flow checks S.listingHome; js/turn.js double payment.
Balance: A real trade-off; careless players who buy first in a slow year feel it.

### i34-b27 The house that comes with the job (M, 🟠)
Some farm and ranch jobs offer a house on the place at low rent. Cheap and close, but if you quit or lose the job you have 30 days to move out.
Touches: js/state.js JOBS gain a housing field; js/ui.js hire sheet; js/turn.js move-out timer on job loss.
Balance: Cheap housing tied to a job you have to keep; layoffs hurt more, so it isn't a free saving.

### i34-b28 An old owner sells on contract (M, 🟠)
Now and then an older owner offers to sell their place on a real estate contract: a smaller down payment and monthly payments to them, no bank. Miss payments and you can lose the house and what you paid.
Touches: js/events.js offer; js/state.js S.mortgage with lender 'seller'; missed payment check in js/turn.js.
Balance: Opens a door for players the bank turns down, with a sharp penalty for being careless with money.

### i34-b29 Buy out your siblings' share of the family house (M, 🟡)
When a parent passes and leaves the house to you and two siblings, buy their shares (a loan for two-thirds of the value), sell and split, or rent it out and share the rent.
Touches: js/events.js inheritance event; js/ui.js Homes adds 'family' home; ties to aging parents i19-a03.
Balance: A family story with real money weight; no free house.

### i34-b30 Your parents help with the down payment (S, 🟡)
If your family is in town and you're close, they may offer $3,000–8,000 toward a first home, with a gift letter for the bank. Take it, or say no and keep it simple.
Touches: js/events.js; family closeness from existing family events.
Balance: One-time, only for first homes; family closeness takes real time.

### i34-b31 Closing day: keys at the law office (S, 🟡)
The day you close gets its own scene: sign at the law office stand-in, get the keys, and a neighbor drops off a plant. A small happiness lift and a line on the fridge door.
Touches: js/events.js scripted card; js/features.js keepsake/fridge if built.
Balance: Flavor only; small lift tied to a big choice.

### i34-b32 Help page: buying a home in six steps (S, 🟠)
A plain Help page: save the down payment and closing costs, get pre-approved, look at listings, offer, inspect, close. Plus a short renter's page on notices and deposits.
Touches: js/help.js new pages.
Balance: Teaches without changing balance.

### i34-b33 Senior apartments in Dayton: the waitlist (S, 🟡)
After 65, sign up for a stand-in senior apartment building in Dayton or Walla Walla. When a spot opens (6 to 30 weeks), move in with rent near 30% of income, no stairs and no yard.
Touches: js/state.js HOMES gains 'senior'; js/turn.js waitlist; js/ui.js Homes row after 65.
Balance: An option for late life alongside downsizing (i30-b06); rent-based, so it doesn't add score for idle play.
