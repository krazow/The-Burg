# Ideas round 23

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 23: First-time player

Ideas from tapping through The Burg as a brand-new player on a 390×844 phone: tutorial, ~25 weeks of play, and every tab and sheet.

### i23-a01 Offer the practice life on a brand-new start (S, 🔴)
The very first time someone taps Start with no saves and no records, a small sheet asks 'New here? 3-minute practice life first' or 'Jump right in'. Today the tutorial only lives behind the ? button, and a newcomer lands on the Jobs tab with a 3-second toast.
ui.js (start handler, renderTitle), help.js startTutorial. Shown once, stored in prefs. Balance: no effect on scores.

### i23-a02 Badge toasts stop replaying after you reopen the app (S, 🔴)
'Badge earned: First paycheck' popped up again after reopening the app and again after ⏩ 4. playWeeks saves before it clears S.newBadges, so the old toast is saved. Clear the list before save().
turn.js playWeeks (save() runs before after() clears newBadges). Bug fix. Balance: none.

### i23-a03 '1 weeks left' reads 'Last week!' (S, 🔴)
The header said '1 weeks left' in the final week. Say '1 week left', and in the last week say 'Last week!' so a newcomer knows the next End Week ends the life.
ui.js line with `${L.turns - S.turn} weeks left`. Balance: none.

### i23-a04 End Week shows a planned trip (S, 🔴)
After planning a trip to Walla Walla, the End Week button still said just 'Rest', and the 'trip planned' toast sat on top of the chip that showed it. Make the button read 'End Week → Rest + 🚗 Walla Walla' so the player knows the trip is set.
ui.js End Week label, outabout/trip state (S.trip). Balance: none; the 75% focus cost becomes visible.

### i23-a05 Town goal box says the reward and the time left (S, 🔴)
The goal box said '0/4 weeks… until the end of February' but not what you get or how many weeks remain. Add '3 more needed · 6 weeks left · reward ▲5 community ▲4 happiness'.
state.js seasonLine (g.fx, weeks to season end). Balance: same reward, just shown; idle play still can't earn it.

### i23-a06 A missed town goal says so (S, 🟠)
My newcomer's food drive ended at 1/4 and the box quietly switched to Celebration Days. Add a short line to the week strip and the Journal: 'Holiday food drive ended at 1/4. Next up: Celebration Days.'
state.js seasonWeek (detect season change with !done), log(). Balance: no penalty, just feedback.

### i23-a07 Focus buttons that count for the town goal wear its icon (S, 🟠)
Put a small ❄️ (or the season's icon) on the Town and Outside buttons while they count toward the town goal. A newcomer can't match 'Show up for town or Get outside' to buttons labeled Town and Outside.
ui.js focus grid, SEASON_GOALS focus list in state.js. Balance: none.

### i23-a08 One name for each focus everywhere (S, 🟠)
The buttons say Classes, Work extra and Hustle. The Education card says 'Pick "Take classes"', and the stat sheets say 'Work extra hours, Take classes, Side hustle'. Use the button name everywhere, with the long name after it once.
ui.js stat sheets (line ~461), features.js Education card, help.js. Use FOCUS_SHORT. Balance: none.

### i23-a09 A Classes week shows school progress (S, 🟠)
After a Classes week the strip only showed less money. Add '📚 Trade certificate 2/16' to the strip. If the certificate can't finish before the game ends, the Classes description says so ('needs 16 weeks, 10 left').
turn.js/ui.js strip, events.js study progress (STUDY_NEED), ui.js focus description. Balance: shows the honest payoff; no change to rates.

### i23-a10 Tapping a grayed-out focus says why (S, 🟠)
Before you have a job, Work extra is gray and nothing happens when you tap it. Use aria-disabled so a tap shows a toast: 'Get a job first: try the Jobs tab.' Do the same for any locked focus.
ui.js focus grid (disabled → aria-disabled plus a click handler). Balance: none.

### i23-a11 Switching jobs asks first (S, 🟠)
Apply while employed swaps your job at once if you're hired. Show a short compare first: 'Leave Trades apprentice? Take-home ▲$31, 58 mi drive each way.' Buttons: Apply / Keep my job.
ui.js apply(). Doesn't use up the week's application if you cancel. Balance: stops accidental job loss; no gain for idle play.

### i23-a12 'You're hired' shows take-home, like the board (S, 🟠)
The board says $549/wk take-home and the hired sheet says $646/wk. Show both the way the board does: '$549/wk take-home ($646 before taxes)'.
ui.js apply() hired sheet (reuse the take-home helper). Balance: none.

### i23-a13 The recruiter's sure thing shows on the Jobs tab (S, 🟠)
After 'Interview', nothing reminds you the next application is guaranteed. Put a chip on the job board: '📞 Recruiter: your next application is a sure thing · 3 weeks left'. Make the choice text say '4 weeks', not 'this month'.
ui.js job board header (S.hireBy), events.js 'A recruiter calls' label. Balance: same perk, just visible.

### i23-a14 Work events happen at your workplace (S, 🟡)
'New manager', 'A coworker retires' and 'Safety inspection' all said 📍 Main Street, Waitsburg while I worked for a builder. For work events, use the place and stand-in name of your job.
events.js (cat:'work' location), jobById(S.jobId). Balance: none.

### i23-a15 Home chips open the right part of Life (S, 🟠)
Tapping 'room above Main Street' opened the top of Life, at Life goals and Skills, three screens away from Home. Each chip scrolls to its own card: home → Home, pickup → Ride, High school → Education.
ui.js Home chip handlers, Life card ids, scrollIntoView. Balance: none.

### i23-a16 Out and about suggests one visit right on Home (M, 🟠)
In 25 weeks my newcomer never opened Out and about. The card on Home could show one open place that fits this week: '☕ Coffee at the café · $8 · ▲😊 ▲🤝 [Go]', with 'See all places' under it.
ui.js Home card, outabout.js (pick an open place you haven't visited lately). Balance: the half-value repeat rule and the 2-visit cap still apply.

### i23-a17 A visit's result shows under the button, without a toast (S, 🟠)
After 'Coffee and a pastry' the result appeared at the bottom of the place sheet and a toast covered it with the same words. Put the result in the spot where the button was, and skip the toast while the sheet is open.
outabout.js place sheet. Balance: none.

### i23-a18 'Work here' on a place sheet can take you to the job (S, 🟡)
The café sheet lists 'Barista $485/wk — Apply on the Jobs tab' as plain text. Make it a button that opens Jobs filtered to Waitsburg with that job highlighted.
outabout.js 'Work here', ui.js jobs tab (jobCity, scroll/flash a row). Balance: still one application a week.

### i23-a19 Household rows say how things happen (S, 🟠)
'Dog: None' and 'Partner: Single' give no hint how to change them, since both only come from events. Add a gray line like 'Comes up in events. Town and Outside weeks help you meet people.'
features.js Household card; use the real event conditions in events.js for the wording. Balance: no new path, just a hint.

### i23-a20 Reopening the app goes back to your life (S, 🟠)
Each time the app opened, it showed the title screen and you had to tap Continue. If there's one life in progress, open straight to its Home. The title screen stays one tap away in Menu.
boot.js / ui.js renderTitle vs render on load (last-played slot). Balance: none.

### i23-a21 Menu says your life is already saved (S, 🟡)
A big 'Save game' button made me think I had to save by hand. Show '✅ Saved after the week of Jan 11' at the top, and move manual Save next to Load as a smaller button.
ui.js Menu sheet. Balance: none.

### i23-a22 Hint cards sit under the focus grid (S, 🟠)
The 'Got it' hint card goes above This week's focus, so the six focus buttons slip under the End Week bar. Put hints below the grid, or keep them to one line with 'More'.
ui.js Home hint card order. Balance: none.

### i23-a23 Jobs welcome stays until the first application (S, 🟠)
'Welcome to the Burg! Start by finding a job.' is a toast that's gone in seconds. On a new life, put a card at the top of Jobs: 'Tap Apply on one job. You get one try a week; local jobs have no gas cost.' It goes away after you apply.
ui.js Jobs tab (first week, !S.jobId && !S.applied). Balance: none.

### i23-a24 Practice life ends with 'Start a real life' (S, 🟠)
If you start the tutorial from the title screen, it ends back on the title screen. End with two buttons, 'Start a real life' and 'Back to title', and use the name you typed.
help.js endTutorial (prev.S null branch). Balance: none.

### i23-a25 Tutorial bubble moves up when the target is in a sheet (S, 🟠)
At steps 8, 10 and 14 the bubble covers the paycheck lines, the event result and the job's needs, which are the things it's explaining. When the target is inside a bottom sheet, dock the bubble at the top of the screen.
help.js drawCoach (bubbleY when el.closest('.sheet')). Balance: none.

### i23-a26 Selected trip stops show a check and a running total (S, 🟡)
Picked stops just turn pink, and '2 of 3 stops · about $39' is only at the very bottom. Add a ✓ on picked cards and a small total next to the trip title.
outabout.js / trip sheet in ui.js. Balance: none.

### i23-a27 Score words without '2027 dollars' (S, 🟡)
The Life Score sheet says 'about $615 in 2027 dollars' and '$16,000 (in 2027 dollars)'. A newcomer reads that as a typo. Say 'at today's prices' and keep the exact term in Help.
ui.js score sheet and Net worth sheet, help.js. Balance: none.

### i23-a28 Your first score says 'First score', not 'New best!' (S, 🟡)
The first life ended with a 'New best!' badge, which means nothing yet. Say 'Your first score: 58' and add a 'Your records' button that fills in from now on.
ui.js finish()/end sheet, records store. Balance: none.

### i23-a29 The life you just finished stays on the title screen (M, 🟡)
After the end sheet, the life and its journal were gone from the title screen. Keep the last finished life as a read-only card ('58 · Solid Waitsburger · Read the journal') until another life ends.
ui.js renderTitle, save slots (a 'finished' flag kept 1 deep). Balance: read-only, so it can't be continued.

### i23-a30 Journal puts same-week entries under one date (S, 🟡)
'Week of Jan 4, 2027' appeared twice in a row: once for turning 18 and again for getting hired. Group entries by week under one date line.
ui.js Journal render (group S.log by week). Balance: none.

### i23-a31 Life goals get a nudge in the first month (S, 🟡)
Pinning goals adds +2 each, but the button is at the top of Life, a tab a newcomer may never open. Add a one-time Home hint in week 2–3: 'Pick up to 3 life goals for bonus points' with a button that opens the picker.
ui.js hint queue (the existing 'Got it' cards), features.js goals picker. Balance: goals still have to be reached to count.

## Ideas 23: Owning a Main Street business

Ideas for owning a real shop on Main Street, from the permit run and first hire to festival weekends, taxes, and selling up.

### i23-b01 A storefront on Main Street: a fourth kind of business (L, 🔴)
Lease an empty storefront on Main Street and run a real shop. Unlike the woodshop or wheat lease, it only does well when you put in owner hours, keep stock and look after customers.
- Adds BIZ.store in js/features.js with its own state: S.biz.shop {kind, rent, stock, staff, rep}.
- Shows as a pin on the Main Street map in js/outabout.js at a stand-in address.
- Weekly sales = foot traffic x reputation x stock on hand, minus rent, wages and goods.
- Balance: rent is due every week, so an unattended shop loses money; only planned play earns well.

### i23-b02 Pick a kind of shop: bakery, hardware and feed, gift, bike and outdoor (M, 🔴)
Each kind of shop has its own year. The bakery is steady but spoils, hardware peaks in spring, gift peaks at Christmas and the bike shop lives on summer riders.
- A SHOP_KINDS table in js/features.js: monthly demand curve, goods margin, spoil rate, startup cost.
- Skills tie in: Cook helps the bakery, Handy helps hardware and the bike shop.
- Balance: no kind is best every year; margins land within a few percent of each other over a decade.

### i23-b03 The permit run before you open (S, 🟠)
Before the doors open you need a city business license, a state business number and, for food, a county health inspection. It takes a few weeks and a few hundred dollars, and skipping steps isn't an option.
- A short checklist card on the Life tab; each step clears over 1 to 3 weeks (js/features.js, js/ui.js).
- The health inspector comes back once a year for food shops; a messy week can mean a fix-it list.
- Balance: a small, sure cost that teaches the order of things; no score effect by itself.

### i23-b04 A business loan from the bank (M, 🔴)
Sit down with the banker and borrow to open the shop. The bank looks at your credit, your savings and your plan, and the payment comes out every week whether sales are good or not.
- New 'Borrow for the business' choice at the bank stop (js/outabout.js info:'bank') that reuses the loan math in js/turn.js.
- Down payment of 20% required; rate depends on debt load.
- Balance: a loan makes opening possible, not profitable; careless borrowers carry a payment the shop can't cover.

### i23-b05 Rent the space or buy the old brick building (M, 🟠)
Rent is simple and you can walk away. Buying the building costs a lot up front, adds the roof and the boiler to your worries, and lets you rent out the apartment upstairs.
- A choice at opening and a later 'buy the building' offer from the landlord (js/features.js).
- Owning adds upkeep events (roof, boiler, sidewalk) and an upstairs rental line in the weekly money.
- Balance: the building gains value slowly with the home index; repairs keep it from being a sure win.

### i23-b06 Opening day and the ribbon cutting (S, 🟠)
The chamber brings the big scissors, the Tattler takes a photo, and neighbors come by. How many show up depends on your Community standing and whether you advertised.
- A one-time event in js/events.js on the shop's first week.
- Turnout sets the starting reputation for the shop.
- Balance: a strong opening helps for a few months; it can't carry a shop that's run badly.

### i23-b07 Hire your first employee (M, 🔴)
Put a help-wanted ad in the Tattler or on the grocery corkboard and pick from two or three stand-in applicants. One is reliable, one is cheap, one is great with customers but often late.
- A hire sheet in js/ui.js with generated people (first names, a trait, an asking wage).
- Up to two employees in S.biz.shop.staff; each lets the shop stay open when you're not there.
- Balance: wages are paid every week; a shop that hires before sales support it bleeds cash.

### i23-b08 Employees are people: raises, sick days and quitting (M, 🟠)
Your workers ask for a raise after a year, call in sick in flu season, and might leave for a Walla Walla job that pays more. Treat them well and they stay, and the shop runs smoother.
- Each employee has a mood and tenure; small events in js/events.js with when: S.biz.shop.staff.length.
- A longtime employee gives a steady reputation bonus.
- Balance: keeping staff costs money in raises; turnover costs reputation and a slow week of training.

### i23-b09 Payroll, the minimum wage and workers' comp (S, 🟠)
Paying people means more than wages: payroll taxes, the state workers' comp premium and the minimum wage that goes up each January. The business card shows the real cost of each hire.
- A payroll line on the shop's weekly money in js/features.js; wage floor follows the yearly minimum-wage rise.
- January note: 'The minimum wage went up; your payroll is now X a week.'
- Balance: a plain, sure cost that makes hiring a real decision.

### i23-b10 Behind the counter: a new weekly focus for owners (M, 🔴)
Owners get a 'Mind the shop' focus that replaces Work. Weeks you're behind the counter sell more and build reputation; weeks you're away depend on your staff.
- A focus option in FOCUS (js/state.js) shown only with a storefront; uses the fade from focusEffect so seven weeks straight wears you down.
- Without staff, a week away means the shop is closed.
- Balance: Auto and idle play pick the default focus, so an idle owner with no staff earns little.

### i23-b11 Stock the shelves: order before the busy weeks (M, 🔴)
Keep a stock level and order more from the distributor. Run out on a busy weekend and you lose sales; overbuy and your cash sits on shelves, or goes stale at the bakery.
- S.biz.shop.stock with an 'Order stock' button on the business card (js/features.js, js/ui.js).
- Shows weeks of stock left at the current pace; a small reorder suggestion based on next month's demand.
- Balance: a planning skill that careless play fails; good ordering earns maybe 10 to 15% more, not a jackpot.

### i23-b12 The distributor's truck comes on Tuesdays (S, 🟡)
Orders have a minimum and arrive the next week, not the same day. A missed order before Celebration Days means scrambling to Walla Walla in your own truck at retail prices.
- Order lead time of one week in js/features.js; an emergency run option costs more and a trip's gas.
- Ties to the region map trip to Walla Walla (js/maps.js).
- Balance: rewards looking a week ahead; the rescue option keeps mistakes from being fatal.

### i23-b13 Seasonal customers: riders, hunters and wine weekends (S, 🟠)
Foot traffic on Main Street changes by month: summer bike riders on Highway 12, fall hunters heading to the Blues, wine-weekend visitors from Walla Walla, and a quiet January.
- A FOOT_TRAFFIC table by month in js/features.js, tilted per shop kind.
- The business card shows 'This month: busy / steady / slow' with a short reason.
- Balance: known in advance, so planning beats luck; the yearly total is the same for every kind.

### i23-b14 Festival weekends: stay open late and staff up (M, 🔴)
Celebration Days, the fair weekend and the holiday parade bring crowds. Decide a week ahead whether to stay open late, bring in extra help and order extra stock; rain can still wash it out.
- A prep card the week before each festival in js/events.js; three choices with cost and payoff.
- Weather roll on the weekend; a rained-out festival leaves leftover stock.
- Balance: preparing usually pays 2 to 3 good weeks' worth, but costs real money up front.

### i23-b15 The big store in Walla Walla (M, 🟠)
A new big-box store opens in Walla Walla and some regulars start driving over. You answer with service, special orders or a niche, and the slump eases over a year if you choose well.
- A once-a-decade story chain in js/events.js that lowers foot traffic for 26 to 52 weeks.
- Three answers: special orders (costs time), a niche line (costs stock), price match (costs margin).
- Balance: survivable if you have a cushion; the slump is announced a season ahead in the Tattler.

### i23-b16 Special orders: 'Can you get one in?' (S, 🟡)
Customers ask for things you don't stock. Say yes and you earn a loyal regular and a small sale; say yes too often and your evenings go to tracking orders.
- Small two-button cards in js/events.js for storefront owners.
- Each yes adds reputation and costs a little happiness for that week.
- Balance: a trade of time for standing, never a money pump.

### i23-b17 A Tattler ad plan for your shop (S, 🟠)
Instead of one-off side-hustle ads, owners can run a weekly ad, a holiday insert or sponsor the Cardinals score box. Ads lift traffic for a while and fade, so steady and timed beats big and random.
- Extends the Tattler stop in js/outabout.js with shop ad choices tied to S.biz.shop.
- Ad effect decays over 4 weeks; the score box gives a small Community bump too.
- Balance: ads cost more than they earn in a slow month, so timing matters.

### i23-b18 Word of mouth: the shop's reputation (M, 🟠)
A shop reputation from 0 to 100 that rises with good service weeks, steady staff and full shelves, and drops with empty shelves, closed days and rude-clerk events. People talk at the café.
- S.biz.shop.rep in js/features.js; shown as stars on the business card.
- Feeds into weekly sales and the sale price of the business.
- Balance: moves slowly both ways, so one bad week doesn't ruin you and one good week doesn't make you.

### i23-b19 Sales tax and the state excise return (S, 🟠)
Washington has no income tax, but your shop collects sales tax and owes the state's business tax on gross sales. The return is due each quarter, and the sales tax was never your money.
- A quarterly due card in js/features.js; collected tax is held in a separate 'owed to the state' line on the business card.
- Late filing adds a penalty and an angry letter event.
- Balance: careless players who spend the tax money get a bill they can't pay; a planning test.

### i23-b20 Bookkeeping night or hire a bookkeeper (S, 🟡)
Once a month, spend an evening on the books or pay a bookkeeper in town. Skip it and you find mistakes later: a missed bill, a tax surprise, a supplier you paid twice.
- A monthly card in js/features.js; doing it yourself costs a little happiness, hiring costs a monthly fee.
- Skipped months raise the chance of a 'books were a mess' event.
- Balance: small and sure; teaches that running a business is paperwork too.

### i23-b21 Pay yourself: owner's draw or put it back in (M, 🟠)
Sales go into the shop's own account. Each month you choose how much to take home and how much to leave for stock, repairs and slow months.
- S.biz.shop.cash separate from S.money in js/features.js; a draw slider on the business card.
- A shop with no cash can't order stock or make payroll.
- Balance: drawing everything works until January; leaving a cushion is what good play does.

### i23-b22 A shop profit and loss on the business card (S, 🔴)
One plain table on the business card: sales, cost of goods, wages, rent, taxes, ads and what you took home, for this month and this year.
- Weekly numbers tallied into S.biz.shop.book in js/features.js; rendered in bizCard().
- Uses the same fmt() and cost() as the rest of the money screens.
- Balance: information only; helps careful players see a leak early.

### i23-b23 Closed on Mondays: owner strain and time off (M, 🟠)
Running a shop wears on you in its own way. An owner strain meter rises with seven-day weeks and no staff, and eases when you close a day a week or take a vacation while staff cover.
- S.biz.shop.strain in js/features.js; high strain cuts happiness and health each week and raises mistake events.
- A 'Close Mondays' toggle trades a little sales for less strain.
- Balance: grinding every week stops paying, so working yourself to the bone isn't the best strategy.

### i23-b24 Stay open in January or close for winter (S, 🟡)
The quiet months barely cover the heat bill. Close for six weeks to rest and save on wages, or stay open for the regulars and keep your reputation warm.
- A choice card in December in js/events.js for storefront owners.
- Closing pauses wages and most rent costs but trims reputation a little.
- Balance: either choice is fine; the point is a real decision with a clear trade.

### i23-b25 Join the Main Street merchants' group (S, 🟡)
Pay yearly dues to the merchants' group and you help decide the flower baskets, the holiday lights and the festival hours. You get earlier word on town plans and a small Community boost.
- A once-a-year join card in js/events.js; members see one extra planning note before each festival.
- Ties to the town goals in js/state.js (SGOALS).
- Balance: dues cost money every year; the benefit is information and standing, not cash.

### i23-b26 Shop owners are town fixtures (M, 🟠)
Owning a storefront changes how the town sees you. People greet you by name, ask your opinion at council meetings, and expect you at the Christmas parade, which helps Community but brings more asks.
- An 'owner' standing in js/features.js that grows with years open and shop reputation.
- Adds a small weekly Community floor and unlocks owner-only event lines in js/events.js.
- Balance: the standing builds over years, so a shop opened just before the end doesn't score it.

### i23-b27 Every team wants a sponsor (S, 🟡)
The Little League, the school auction, the FFA chapter and the fire department pancake breakfast all come asking. Say yes and your name is on the jerseys; say no too often and people notice.
- Small two-button asks in js/events.js, more frequent with higher owner standing.
- Yes costs cash from the shop account and adds Community.
- Balance: a slow trade of money for standing; never free.

### i23-b28 Regulars at the counter (M, 🟡)
Three regulars come in week after week: the retired farmer who wants coffee and talk, the young mom on a budget and the contractor who buys in bulk. Their stories run alongside yours.
- Three recurring customer characters with small story chains in js/events.js.
- Keeping them happy steadies sales; losing one hurts reputation.
- Balance: flavor first; their money effect is small.

### i23-b29 Name your shop and put up the sign (S, 🟡)
Name your store when you open it. The name shows on the Main Street map, in Tattler headlines and on the end screen.
- A name field at opening, saved in S.biz.shop.name; escaped like other names (js/ui.js).
- Used by the map pin in js/outabout.js and by event text.
- Balance: no effect on score.

### i23-b30 Sell the business through a broker (M, 🟠)
Instead of an instant sale at a fixed share of what you paid, list the shop and wait for buyers. Offers come over a few weeks, based on the last two years of profit and the shop's reputation.
- Replaces sellBiz() for storefronts with a listing period and two or three offers (js/features.js).
- A well-run shop sells for more than it cost; a struggling one sells for the stock and the fixtures.
- Balance: the price rewards years of good running, so a quick open-and-flip doesn't pay.

### i23-b31 Sell to your longtime employee (M, 🟡)
If someone has worked for you for years, they can buy the shop on a payment plan. You get monthly checks for several years and the shop stays open under a name you know.
- An option when an employee's tenure passes 5 years; payments as a weekly line in js/turn.js for up to 8 years.
- Missed-payment risk if the shop's reputation drops after you leave.
- Balance: lower price than a broker sale but a steady retirement income; a different path from handing it to a kid.

### i23-b32 The going-out-of-business sale (S, 🟡)
When it's time to close, run a last sale to clear the shelves, take down the sign and hand back the keys. The town remembers, and the Journal gets a proper last line.
- A closing flow in js/features.js: stock sells at a discount, lease ends, staff get a last week's pay.
- A Tattler line and a Journal entry; the storefront returns to empty on the map.
- Balance: recovers some stock value; closing well protects Community.

### i23-b33 A storefront bot in the balance sim (S, 🔴)
The sim gets a bot that opens a shop and runs it with simple rules, plus a careless owner who never orders ahead and an idle owner who never minds the shop.
- New bot strategies in the balance sim tests.
- Checks: careless owner median stays <= 60, idle <= 50, careful owner can reach >= 70.
- Balance: keeps the storefront from becoming the one best path.
