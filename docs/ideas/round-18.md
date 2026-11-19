# Ideas round 18

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 18: Farm, land and animals

Ideas for farming, land and animals as a real life path in the valley, built on the existing wheat lease and farm start.

### i18-a01 Cash rent or crop share on the wheat lease (S, 🔴)
When you lease, pick the terms: cash rent (pay up front, keep the whole check) or crop share (pay little up front, the landowner takes a third of every harvest, so a bad year hurts you less).
Touches: BIZ.wheat and startBiz/bizWeek in js/features.js; S.biz.terms in js/state.js migration.
Balance: Crop share lowers the top and the bottom of the harvest range, so it only beats cash rent for players who think about risk. Expected value stays a bit lower than cash rent.

### i18-a02 The landowner is a person you keep happy (M, 🟠)
The wheat ground belongs to a stand-in landowner, an older widow in Walla Walla. Drop off a Christmas card and a harvest report and she renews at a better price; ignore her and she raises the rent or leases to a neighbor.
Touches: S.biz.owner (0–100) in features.js, a December prompt in events.js, renewLease() price uses it.
Balance: Costs a Show up for town week or a small gift. Careless players pay full renewal or lose the lease, so attention is what pays.

### i18-a03 Peas or summer fallow: the rotation choice (M, 🟠)
Each fall the wheat lease asks what goes in next: wheat again (tired ground, lower yields over time), peas (a smaller June check that rebuilds the soil) or fallow (no check, a bigger wheat year after).
Touches: S.biz.soil and a fall choice card in bizCard(); yearly() reads soil; a June payout for peas.
Balance: Wheat every year wins short-term and loses over five years. Idle players get the default (fallow), which is safe but smaller.

### i18-a04 A harvest scale ticket instead of one number (S, 🟡)
At harvest the elevator hands you a ticket: bushels per acre, test weight, protein and the price that day. It explains why the check was big or small.
Touches: bizWeek() notes in features.js; a small ticket card in ui.js log or the week summary.
Balance: No new money, just clarity. Helps players learn the risk without a help page.

### i18-a05 Join the grain co-op and get a patronage check (S, 🟠)
Buy a co-op share once. Fuel, seed and grain run through it, and each February a small patronage check comes back, plus a seat at the annual meeting dinner.
Touches: New Life-tab purchase in features.js; February payout in turn.js; uses the farm-supply stand-in name.
Balance: The check is small (a few percent of farm spend) and needs a wheat lease or farm job to count. It rewards staying put, not idling.

### i18-a06 The farm credit operating line (M, 🟠)
Borrow in spring against this year's wheat at the farm credit bank (stand-in name), repay at harvest with interest. A rough harvest leaves a balance that rolls over at a higher rate.
Touches: Money system in turn.js (like the truck loan), a card in bizCard(), help.js text.
Balance: Borrowing only makes sense to cover farming costs (i15-a08). Rolling over debt drags the score, so careless borrowing is punished.

### i18-a07 Enroll ground in the conservation program (S, 🟡)
Sign the leased or owned ground into a 10-year stand-in conservation program: a smaller steady check every October, no harvest risk, and grass and pheasants where the wheat was.
Touches: A choice on the wheat card in features.js; yearly() swaps to a fixed payment; ties the lease length to 10 years.
Balance: Pays about 60% of an average harvest with no variance. Safe, not optimal, and locks the ground up.

### i18-a08 Drought year: the county declares a disaster (M, 🟠)
Some summers the county is declared in drought. Wheat yields drop, hay prices jump, a burn ban starts, and you can apply for a low-interest emergency loan at the county farm office.
Touches: A yearly roll in turn.js that sets S.drought; read by BIZ.wheat.yearly, hay, events.js filters and the weather line if built.
Balance: Hits everyone who farms, but planners who bought insurance (i3-a16) or chose crop share feel it less.

### i18-a09 Hay: three cuttings and a rain risk (M, 🟠)
A new business on irrigated ground: cut and bale hay in June, July and September. Each cutting can get rained on while it lies in the field, cutting the price in half.
Touches: New BIZ.hay in features.js with three payout months; needs a water right (see the water idea); uses Work extra weeks in those months.
Balance: Pays in three smaller checks and needs your weeks, so idle play earns little. Rain chance keeps it from being a sure thing.

### i18-a10 Water rights come with the land, or they don't (M, 🟠)
Land for sale is listed as dryland or irrigated with a senior water right. Irrigated ground costs more and grows hay or orchard; if you don't use the water for five years, the state can take the right back.
Touches: A water flag on land and acreage purchases in features.js/state.js; a five-year use check in turn.js; help text.
Balance: Gives a reason to actually use what you buy. Losing the right drops land value, so buy-and-forget loses money.

### i18-a11 A few acres outside town (the hobby farm home) (M, 🔴)
A new home: a small acreage on the edge of Waitsburg with a well, a shop and a pasture. More chores each week, more joy on Get outside weeks, and a well pump or septic that sometimes breaks.
Touches: New HOMES entry in js/state.js, its own repair events in events.js, a map marker in maps.js.
Balance: Upkeep costs time and money; the happy bonus only shows up on Rest and Get outside weeks, so it doesn't pay off for idle play beyond a normal house.

### i18-a12 The hobby farm ledger: what it really costs (S, 🟡)
The Life tab shows farm money in and out for the year: feed, fuel, vet and fence against eggs, hay and calves. Most hobby farms lose money, and the card says so kindly.
Touches: A ledger card in ui.js fed by tagged lines from turn.js.
Balance: Pure honesty, no new money. Helps players decide if the animals are worth it to them.

### i18-a13 4-H: your kid raises a market lamb (M, 🔴)
A kid age 9 to 18 can join 4-H in spring. Weeks you Show up for town or Rest at home count as chores; at the fair in late August the lamb sells at the junior livestock auction, where local businesses bid it up.
Touches: Kids system in turn.js/state.js, a spring prompt and an August payout event in events.js, fair week in features.js.
Balance: The check and the kid's pride depend on chore weeks logged, so ignoring it means a skinny lamb and a low bid. Small money, big happiness and community.

### i18-a14 Be a 4-H club leader (S, 🟡)
With community 50+, you can lead the local 4-H club: one evening a week of meetings and fair prep. Community goes up steadily and a kid in town remembers you later.
Touches: A council-style role flag in features.js; weekly fx in turn.js; one later event in events.js.
Balance: Costs a bit of stress each week. Only helps players who already invest in town.

### i18-a15 Lambing season keeps you up in February (M, 🟡)
Run a small flock of sheep on the acreage: lambing in February means nights in the barn (tired but happy), a wool check in May and lamb sales in the fall. Coyotes take one now and then.
Touches: New animal in the pets/animals state (alongside i1-b14), events.js for lambing and coyotes, turn.js costs.
Balance: Health and stress costs in February balance the fall money; a careless player who never checks loses lambs.

### i18-a16 Bees for the orchards (S, 🟡)
Keep a few hives. Rent them to a cherry orchard for April pollination and sell honey in the fall. A bad winter can kill a hive.
Touches: A small Life-tab purchase in features.js, April and October payouts in turn.js, a winter loss roll.
Balance: Low money, low cost. The winter loss keeps it from being free income.

### i18-a17 Plant an orchard or vines: a slow business (L, 🟠)
Plant a few acres of cherries or wine grapes on irrigated ground. Nothing for three or four years, then a crop you sell to a packing house or a Walla Walla winery. A hard freeze can set you back a year.
Touches: New BIZ.orchard with an age field in features.js; yearly payout after year 3; a winter freeze event in events.js; needs the water right.
Balance: Big wait up front, so it only pays in 5-year and Lifetime games. A short game player who buys one loses money, and the help text says so.

### i18-a18 Frost night: help run the wind machines (S, 🟡)
An April night drops below freezing. A neighbor's orchard needs hands on the wind machines and heaters until dawn. Go and earn cash and goodwill, or stay in bed.
Touches: One seasonal event in events.js (April, needs not-night-shift).
Balance: Small pay, a health hit and community. A once-a-year color event.

### i18-a19 Buy an old combine and cut for neighbors (M, 🟠)
Buy a used combine at the farm auction. Cut your own wheat (lowers farming costs) and do custom harvest for neighbors on Work extra weeks in July and August.
Touches: S.gear in state.js; BIZ.wheat cost reduction; a harvest Work extra bonus in turn.js; breakdown chance.
Balance: Needs your weeks in harvest and has repairs, so it only pays if you work it. Resale value falls each year.

### i18-a20 The combine breaks down mid-harvest (S, 🟡)
A bearing goes on the third day of harvest. Drive to Walla Walla for parts tonight (tired, keeps the crop), wait for the dealer (lose some to a storm) or call a neighbor (owe them one).
Touches: One July/August event in events.js for players with a wheat lease or farm job.
Balance: Every choice costs something. The neighbor favor comes back as a later ask.

### i18-a21 Farm auctions: an estate sale out on the county road (M, 🟠)
A retiring farmer sells out. Bid on lots: a stock trailer, a welder, a pickup, a box of old tools. Some lots are gems and some are junk, and the auctioneer talks fast.
Touches: A spring or fall event in events.js that opens a small bidding card (ui.js); items feed vehicles and skills in features.js.
Balance: Random lot quality and a bidding cap keep it from being free value. Careless bidding can overpay.

### i18-a22 Rent more ground when an old farmer retires (M, 🟠)
After three good years on your lease, a retiring neighbor offers his 80 acres too. Take it and the harvest doubles, but so does the risk and the farming bill.
Touches: A second-lease field on S.biz in features.js; an event in events.js gated on years and landowner standing.
Balance: Doubles the swing, not just the income. With farming costs in, a drought year can wipe out a year's savings.

### i18-a23 A fence line dispute with the neighbor (S, 🟡)
The neighbor's cows came through a sagging fence again. Split the cost of a new fence, fix it yourself (Handy skill helps), or call the county.
Touches: One event in events.js for players on the acreage or with animals.
Balance: Small money and community either way. Calling the county saves money and costs standing.

### i18-a24 A hunting lease on your ground (S, 🟡)
If you own land, a group from the west side wants to lease it for pheasant and deer season. Steady fall money, a few strangers on your gravel road.
Touches: An October offer in events.js gated on owned land; a yearly payout in turn.js.
Balance: Small yearly check. Only for land owners, who already paid big up front.

### i18-a25 A wind company wants to lease your ridge (M, 🟡)
Own ground in the Dayton hills and a wind company offers a 30-year turbine lease: a steady yearly check. Some neighbors are for it and some will stop waving.
Touches: An offer event in events.js gated on owned land; yearly payout in turn.js; a community split.
Balance: The check is capped and comes with a community hit. Gated behind buying land, so idle play never sees it.

### i18-a26 A farm stand at the end of the driveway (S, 🟠)
On the acreage, set out a table with an honor box from June to October: eggs, cherries, squash. A little money most weeks and neighbors stop to talk.
Touches: A summer weekly line in turn.js for players with the acreage home (and a garden or chickens if built).
Balance: Small, steady and only in season. Once in a while the box comes up short.

### i18-a27 Sale-barn café on Tuesday (S, 🟡)
Out and about: the café at the livestock sale barn in Walla Walla. Pie, coffee and cattle prices with the old-timers. Cheap, and it teaches you a little about farming.
Touches: A new 'do' entry in features.js Out and about list (stand-in name), with a small skill nudge if a farm skill exists.
Balance: Costs a few dollars and a week's focus slot. Mostly flavor and community.

### i18-a28 A Farming skill you earn in the field (M, 🟠)
A new skill: practice it working the farm, on harvest weeks or with a wheat lease. Each star raises harvest checks a little and opens the farm manager step.
Touches: SKILLS in features.js and practice() calls; BIZ.wheat.yearly reads skillLv('farm').
Balance: Up to about 15% more harvest at max, earned only by working. Idle lease holders stay at zero stars.

### i18-a29 Who feeds the animals when you're gone? (S, 🟡)
Before a trip, line up someone to feed the dog and the chickens: a neighbor (owe a favor), a paid sitter, or skip the trip. Go without asking and something goes wrong.
Touches: A check in the trip flow (features.js) for players with a dog or animals; a follow-up event in events.js.
Balance: A small cost that makes animals feel real. It never blocks a trip, only adds a choice.

### i18-a30 Barn raising after a neighbor's fire (S, 🟡)
A neighbor's barn burns down. The valley turns out for a weekend to build a new one. Pitch in for community and happiness, or send money instead.
Touches: One rare event in events.js with a town-goal style community payoff.
Balance: Rare, costs a week of rest. Community-focused players gain most.

### i18-a31 Ten years on the same ground (S, 🟡)
A badge and a log line for farming the same ground ten years, plus a note from the landowner. If you used rotations, the ending says the soil is better than when you started.
Touches: BADGES in features.js; the ending text in ui.js.
Balance: Only long, attentive games earn it. No money attached.

## Ideas 18: Luck and the unexpected

Ideas that make chance feel fair and visible, soften bad streaks, and reward getting ready for floods, fire, wind and scams.

### i18-b01 A luck tally for the year: good breaks and bad breaks (M, 🔴)
Pure-chance events get a good or bad tag, and the year review shows how many of each you got and what they cost or paid, next to a typical year: 'a rough year: about $2,100 worse than usual'.
- Tag each pure-luck event in js/events.js (luck:+1 or -1). Choice results don't count.
- The year review and Journal (js/ui.js) show counts, dollars and a plain verdict.
- Balance: display only. It tells a careful player their bad year was dice, not their plan.

### i18-b02 A rough stretch, said out loud (S, 🔴)
After three bad-luck money hits in eight weeks, the next four weeks skip bad-luck money events, and a chip on Home says 'Catching your breath: 4 weeks' so you can see the rule working.
- pickEvent in js/events.js filters luck:-1 money events while S.breather is set; js/ui.js shows the chip.
- Only pure-luck hits count, never costs from your own choices.
- Balance: trims the unlucky tail, adds no money. Careless play still pays for its choices.

### i18-b03 How luck works, written in Help (S, 🟠)
A Help page lists the real weekly event odds (town, road, work), what raises them (a beater truck, low health, Hard mode, skipped upkeep) and the rough-stretch rule, and says plainly there is no hidden catch-up.
- js/help.js, reading EVENT_ODDS and the multipliers so the page never drifts from the code.
- Balance: none. Builds trust in the dice.

### i18-b04 'Why me?' on a bad-luck event (S, 🟠)
A small link on bad-luck event sheets shows what moved the odds this time: 'Beater truck: 4x breakdowns. Overdue oil change: 1.5x.' If nothing did, it says 'Just bad luck.'
- showEvent in js/events.js; reuses careMult, ditchMult and CARS breakdown values.
- Teaches what to prepare for next time.
- Balance: information only.

### i18-b05 Windfalls wait a week (M, 🟠)
Any windfall of $1,000 or more (inheritance, bonus, a big harvest, a settlement) lands in a 'Windfall' envelope. Next week a sheet asks: pay down debt, top up your cushion, one real treat, give some to town, or a split.
- js/features.js holds S.windfall; js/ui.js shows the envelope on Home and the sheet.
- Tax refunds keep their own sheet (i1-a12).
- Balance: the treat gives happiness that fades; paying debt or saving helps the score more over time.

### i18-b06 Insurance claims take weeks, not a tap (M, 🔴)
Filing a claim starts a short chain: report it, then an adjuster visit in a week or two (be home and lose half a day, or reschedule and wait), then a payout minus your deductible.
- Uses S.chains in js/features.js and builds on the insurance sheet (i3-a19).
- Photos or a home inventory (next idea) speed it up and raise the payout.
- Balance: a claim raises next year's premium a little, so filing tiny claims isn't free.

### i18-b07 Walk the house with your phone: a home inventory (S, 🟠)
A one-time Home action records what you own. Later claims pay about 15% more and a week sooner. Each January a line reminds you it may be out of date.
- S.inventoryAt in js/state.js; read by the claim chain.
- Balance: a small reward for preparing; it does nothing unless something goes wrong.

### i18-b08 Storm-chaser roofer at the door (S, 🔴)
After a windstorm, a truck with out-of-state plates offers your roof at half price, cash up front. Pay the deposit (they usually vanish), look up their contractor license with the state first, or call a local builder.
- New event in js/events.js after a Windstorm, homeowners only.
- The license check is free and reveals the truth every time.
- Balance: careful play never loses; rushing does.

### i18-b09 A rental that's too cheap to be real (S, 🟠)
While looking at homes, a listing shows a house at half the usual rent. The owner is 'out of the country' and wants the deposit wired today. Send it, ask to see it in person, or report it.
- Shown in the home-move flow in js/features.js now and then.
- Asking to see it makes the 'owner' disappear; sending loses the deposit.
- Balance: only costs players who skip the warning signs.

### i18-b10 The buyer who overpays for your truck (S, 🟡)
When you sell a vehicle, a buyer mails a check for $1,500 too much and asks you to send back the difference. Wait for the check to clear at the bank, or refund now and lose it when it bounces.
- Vehicle sale flow in js/features.js.
- Balance: waiting costs one week; refunding early loses money.

### i18-b11 A card of scam signs you collect (S, 🟡)
Each scam you spot adds a sign to a card on Home: 'pay now or else', 'wire or gift cards only', 'too good to be true', 'don't tell anyone'. Later scams highlight any sign you already know.
- Ties the existing and planned scams together; js/ui.js card, tags on scam events in js/events.js.
- Balance: a learning reward inside one life; no money of its own.

### i18-b12 Flood insurance waits 30 days (M, 🔴)
Homeowners can buy flood cover anytime, but it starts 30 days later, as the real rule works. Buying when the Touchet is already high does nothing this year.
- Insurance options in js/features.js; 'The Touchet is running high' and basement water in js/events.js check the start date.
- Balance: a yearly premium that only pays off for players who plan ahead.

### i18-b13 Flood zone and fire edge on the home cards and map (M, 🟠)
Homes say 'near the creek: flood zone', 'edge of town: grass fire risk' or 'up on the hill'. Risky homes cost a little less. The town map can shade the flood zone.
- HOMES in js/state.js get a hazard field; js/maps.js draws the shading; events read it.
- Balance: a real trade-off, cheaper rent for more luck rolls, shown up front.

### i18-b14 Wildfire evacuation: Ready, Set, Go (M, 🔴)
In a dry August, a grass fire near town brings three levels over a week or two: Ready (pack up), Set (leave now if you need time), Go. Leave early for a motel night and a lost day, or wait and risk losing things and health.
- A short chain in js/events.js for edge-of-town homes and the farmhouse.
- A go bag (next idea) softens every step.
- Balance: leaving early is the safe, slightly costly choice; waiting is a gamble that loses on average.

### i18-b15 A go bag by the door (S, 🟠)
Buy a go bag on Home for about $60: water, meds, copies of papers, a charger, dog food. Floods, fires and outages hit happiness and health less. It needs a refresh every two years.
- S.goBag in js/state.js; checked by hazard events in js/events.js.
- Balance: small cost, small help; never stops an event.

### i18-b16 The smoke alarm chirps at 3 a.m. (S, 🟡)
A low-battery chirp wakes you. Swap the battery for $8, or pull it off the ceiling. If you pulled it, a later kitchen fire is worse.
- Small event in js/events.js setting S.alarmOff.
- Balance: the right choice is cheap and obvious; it teaches without punishing much.

### i18-b17 A kitchen fire: small and recoverable (M, 🟠)
A rare grease fire. With a lid or a $40 extinguisher from the hardware store it's a scare and a ruined pan. Without, smoke damage means a claim, a hotel night and a cleanup.
- Rare home event in js/events.js; extinguisher buy on Home; smoke damage feeds the claim chain.
- Balance: rare, and preparation makes it cheap.

### i18-b18 Hail on the hood (S, 🟡)
A June thunderstorm drops hail on your truck. With full coverage it's a claim and a deductible; with liability only you live with dents and a lower resale price.
- Event in js/events.js; vehicle value in CARS; coverage from the insurance sheet (i3-a19).
- Balance: makes the coverage choice matter once in a while.

### i18-b19 Pipes freeze in a cold snap (S, 🟠)
A cold-snap warning: drip the faucets and open the cabinet doors (one tap, free), or ignore it. Ignore it and a pipe may burst: about $900 for owners, and lost belongings for renters.
- Winter event in js/events.js, Dec–Feb.
- Balance: free to prepare; only careless play pays.

### i18-b20 Trim the big tree before storm season (S, 🟡)
Each fall homeowners can pay an arborist about $250 to take down the dead limbs over the house. For three years, windstorms are half as likely to hit the roof.
- Home chore in js/features.js setting S.treeTrim; the Windstorm event checks it.
- Balance: costs real money that only pays back if the wind comes.

### i18-b21 Mud-out day: the town comes to your house (L, 🔴)
After flood or fire damage, a recovery checklist runs over several weeks: safety check, photos, claim, mud-out, rebuild. With a strong community score or people you helped, neighbors show up for mud-out and save you money and a week.
- A chain in js/features.js using S.chains; reads community and the thank-you corkboard.
- Works alongside 'Ask the town for help' (i10-a25), which stays the general version.
- Balance: the help is earned by weeks spent on town, so idle play gets the slow, costly path.

### i18-b22 A relief shelter at the school gym (S, 🟡)
During a flood or fire, a relief group (stand-in name: Valley Relief) opens the gym. If you're hit, stay free with a small happiness cost. If you're not, volunteer a shift for community.
- Hooks on hazard events in js/events.js; a pin on the town map in js/maps.js.
- Balance: small, fair rewards either way.

### i18-b23 Disaster aid after a declared flood (M, 🟡)
In a big flood year the county is declared a disaster area. Fill out an aid form (receipts and photos help), wait about six weeks, and get a low-interest loan or a small grant for damage insurance didn't cover.
- Sheet in js/features.js; payout after a delay; ties to the home inventory.
- Balance: slow and partial on purpose; insurance still beats waiting for aid.

### i18-b24 A relief jar on the café counter (S, 🟠)
Drop $10–50 in the jar in good weeks. When a disaster hits a neighbor, the Journal says where your money went. If it hits you, the jar helps no matter what you gave.
- js/outabout.js café stop; S.jarGiven tally.
- Balance: giving adds a little community; help to you never depends on giving, so it stays fair.

### i18-b25 Scratch tickets with the real odds (S, 🟡)
At the gas station counter, buy a $2 scratch ticket. The card shows the real odds and that tickets pay back about 60 cents on the dollar. The Journal keeps a lifetime spent-versus-won line.
- Out-and-about stop in js/outabout.js; hidden by the family-friendly setting (i7-a14).
- Balance: always loses on average; never helps the score.

### i18-b26 A lucky penny that admits it does nothing (S, 🟡)
Win a lucky penny or rabbit's-foot keychain at the fair. Now and then on a bad-luck event it says 'Your lucky penny is in your pocket. Same odds, but you feel a little better.'
- S.charm in js/state.js; one line and happiness +1 on luck:-1 events.
- Balance: tiny happiness only; honest about the odds.

### i18-b27 January: what could go wrong this year (M, 🟠)
Each January a sheet lists your three biggest risks with rough yearly odds for your life: 'beater truck: about 40% a breakdown', 'flood zone: about 15% basement water', 'your job: medium layoff risk', each with one thing you could do.
- Sheet in js/ui.js reading CARS, LAYOFF_RISK, home hazard and upkeep state.
- Different from seasonal tests (i4-b30): one personal review, not a scheduled test.
- Balance: information only; acting on it costs money and time.

### i18-b28 Luck versus choices on the end screen (M, 🟠)
The end screen splits the result in two: 'Luck cost you about $4,200 this life. Your choices earned the rest.' A lucky careless life and an unlucky careful one read clearly for what they were.
- End screen in js/ui.js; sums the luck-tagged deltas from the luck tally.
- Balance: display only; the score itself is unchanged.

### i18-b29 Good deeds come back, and Help says so (S, 🟡)
Returning the lost wallet, helping the stranded driver or pulling a neighbor out of the ditch adds goodwill. Goodwill makes small good breaks (someone fixes your flat, a free load of firewood) a little more common, and Help shows the rule.
- S.goodwill in js/state.js; event weights in js/events.js; line in js/help.js.
- Balance: capped and small; it rewards choices, not idle weeks.

### i18-b30 A sure thing from a friend at church (S, 🟠)
Someone from your crew pitches a deal that pays '20% a month, guaranteed'. Put in $2,000 and it pays twice, then stops. Ask for paperwork, or ask the bank first, and it falls apart.
- Event in js/events.js when community is high, because this scam works through trust.
- Balance: the careful choices cost nothing; the greedy one loses.
