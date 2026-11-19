# Ideas round 6

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 6: Family and generations

Ideas about families across a life and across legacy generations: kids with names, teens, siblings and in-laws, traditions, the family home and business, and how one life leaves the town different for the next.

### i6-a01 Name your kids, and see them on the Family card (S, 🔴)
Each new baby gets a name you pick (or a suggested one) and the Family card lists them by name and age. Events and the Journal say 'Maya's first day of school' instead of 'a kid'.

- S.kids changes from birth months to {b, name}; migrate old saves in js/state.js (load fills in names).
- The 'Starting a family?' choice in js/events.js opens a small name sheet; the Family card in js/ui.js shows names.
- Groundwork for every other idea in this group.
- Balance: flavor only, no stat change.

### i6-a02 How you raised them shapes the heir (M, 🔴)
The weeks you spent at home or in town while kids lived with you build a quiet 'raised well' record. In legacy mode the grandkid starts with more happiness and community if the family was there for them, less if not.

- Count Rest and Show up for town weeks while kidsAtHome() > 0 in js/turn.js; store S.raised.
- startLegacy() in js/features.js turns it into a start bonus of up to +8 happiness and +6 community, or a small dip if it's near zero.
- The legacy sheet shows one line: 'You were around a lot. It shows.'
- Balance: rewards attentive play; careless and idle lives earn little, and the cap keeps it from snowballing across generations.

### i6-a03 A 529 college fund for each kid (M, 🔴)
Put a weekly amount into a college fund per kid. When they turn 18 the fund pays first, so the college event costs you less or nothing, and unused money rolls to the next kid.

- Life-tab control in js/ui.js; S.kid529 per kid; a weekly line in turn.js with modest tax-free growth.
- The 'A kid heads off to college' event in js/events.js reads the fund before asking for cash.
- Counts toward net worth only until it's spent.
- Balance: it's a choice to lock money away; it saves interest later but can't be pulled out without a penalty, so it's not free score.

### i6-a04 A letter from your grandparent (S, 🔴)
When a new generation starts, the grandkid opens a letter with one wish: keep the house, finish college, take a seat on council, open a shop. Meet it by the end of that life for a small badge and a line in the obituary.

- A list of wishes picked from the parent's life in startLegacy() (js/features.js); S.wish with a test function, like BADGES.
- Shown on the legacy sheet and as a Home tip until it's done.
- End screen in finish() marks it kept or not.
- Balance: a goal, not a gift; the reward is a badge, never Life Score.

### i6-a05 Split the estate among your kids (S, 🔴)
The heir's share depends on how many kids you had: one kid gets the full family share, three kids split it. More kids means a smaller check but more cousins in town, who bring community and a few events.

- startLegacy() in js/features.js divides the inheritance by kid count (with a floor) and adds +3 community per sibling family left in town.
- The legacy sheet shows the split in plain words.
- Pairs with the will idea (i3-a33) but works without it.
- Balance: stops big families from being a pure win in legacy; the 50% and $250,000 cap stay as they are.

### i6-a06 Family traditions that carry down (M, 🔴)
Pick one family tradition: Sunday dinner, a float in the Celebration Days parade, opening day on the Touchet, Christmas Eve at the Grange. It fires as a yearly event, and the next generation can keep it going or drop it. Three generations in a row earns a badge.

- S.tradition set by a one-time event in js/events.js; a dated event each year; carried by startLegacy().
- Keeping it costs that week's focus; skipping it a year makes it fade.
- Shown on the Family card and the end screen.
- Balance: small happiness and community for a real weekly cost; idle play can't keep it alive.

### i6-a07 Empty nest: the house goes quiet (M, 🔴)
When the last kid moves out, a choice sheet: downsize and bank the difference, turn the room into a workshop, rent the room, take a class, or take that trip you put off. Each gives something and costs something.

- Triggered in js/turn.js when kidsAtHome() drops to 0 after being above 0; choices in a story event in js/features.js.
- Downsize reuses HOMES and the mortgage code; the workshop gives a skill head start.
- A short dip in happiness for a few weeks if no choice fits.
- Balance: one choice, each a trade; downsizing turns home equity to cash, which doesn't change net worth.

### i6-a08 Raising teens: a parenting style (M, 🟠)
Once a kid turns 13, pick how you parent: strict, easygoing or in between. Teen events roll from it: a missed curfew, a call from the deputy, the learner permit, homecoming. Style changes the odds, not the whole story.

- S.kids[i].style; teen events in js/events.js weight their outcomes by style and by recent home weeks.
- Builds on kids-in-stages (i1-b08) without repeating its stage events.
- Choices cost an evening (happiness) or money (a car, a dance).
- Balance: no style is best; easygoing saves stress now but has rougher odds, strict costs happiness weekly.

### i6-a09 Hand the old truck down to your teen (S, 🟠)
When you buy a new vehicle and a kid is 16 or older, give them the old truck instead of trading it in. You lose the trade-in, they start driving, and the insurance line goes up.

- A choice in the vehicle purchase flow in js/ui.js; a 'teen driver' insurance line in turn.js until they're 18.
- In legacy mode a kept truck can become the heir's truck (pairs with heirlooms i2-b13).
- Balance: you give up the trade-in value and pay more insurance for a happiness and kid bonus.

### i6-a10 A brother or sister in the valley (M, 🟠)
Every life starts with a sibling with a name and a place: a brother farming outside Dayton, a sister nursing in Walla Walla, one who left for Seattle. They ask for help, offer help, and show up at holidays.

- S.sib = {name, city, path} set in newGame() (js/ui.js) from a small table; a handful of events in js/events.js: borrow money, couch for a month, help at harvest, a wedding.
- Helping costs money or a focus week; they pay back in favors later.
- Only Two-year, Five-year and Lifetime lives.
- Balance: help and asks roughly even out; ignoring them costs happiness, not money.

### i6-a11 In-laws come with the partner (M, 🟠)
When you marry, the partner's family comes too. Thanksgiving at their wheat farm, an offer to work their harvest, a mother-in-law with opinions about the house.

- Needs a marriage step (i1-b05). S.inlaws = {farm, warmth}; three or four events in js/events.js.
- Warmth rises when you show up for their events and falls when you skip.
- A warm in-law family can help with childcare (cuts kidCost a little).
- Balance: the childcare help is small and costs focus weeks to earn.

### i6-a12 Your own family reunion at the park (S, 🟡)
Every few summers the family gathers at Preston Park. Host it, bring a dish, or skip it. The bigger your family tree, the bigger the reunion.

- A dated July event in js/events.js every 3 years when you have a sibling, kids or a legacy generation.
- Hosting costs money and a weekend; brings happiness and community.
- Reads S.gen and kid count to set the size line.
- Balance: one optional event every few years.

### i6-a13 Memorial Day at the family plot (S, 🟠)
In legacy lives, the family has a plot at the city cemetery. Each Memorial Day you can bring flowers and clean up the stones. Earlier generations' names are on them.

- A dated late-May event in js/events.js when S.gen > 1; names read from the family store.
- Bringing flowers: small happiness and community; skipping is fine.
- A pin on the Waitsburg map in js/maps.js once there's a family plot.
- Balance: flavor with a tiny effect; no money.

### i6-a14 Bring your teen into the family business (M, 🟠)
If you own a business and a kid is 14 or older, they can work summers. They save you a hired hand, learn the trade, and might want it when they grow up.

- A summer choice in js/features.js business code; reduces S.biz costs a bit in June–August.
- Each summer worked raises a 'wants the business' count on that kid.
- Feeds the next idea and heirlooms (i2-b13).
- Balance: savings are small; the kid's happiness drops if forced every summer.

### i6-a15 Hand the business to a grown kid (L, 🟠)
Late in life, sell or hand your business to a kid who wants it. They pay you out over years (retirement income), the business keeps running in town, and in legacy mode your grandkid can work there.

- A Life-tab action in js/ui.js when S.biz and a grown kid with enough 'wants the business' exist; payments as a turn.js line for 10 years.
- The business stays on the map with your family name.
- Startup can pick 'work at the family shop' as a first job.
- Balance: payout is below sale value; the trade is steady income and a legacy job, not a windfall.

### i6-a16 The family home keeps its history (M, 🟠)
If the heir keeps the house, it carries a history card: who lived there, the height marks on the doorframe, what each generation fixed or added. Upgrades stay; selling it ends the line with a check and a happiness hit.

- S.homeHist list carried by startLegacy() in js/features.js; a card opened from the Life tab in js/ui.js.
- Upgrades from i1-a03 persist with a little wear per generation.
- Pairs with heirlooms (i2-b13).
- Balance: upkeep grows with the house's age, so an old family home isn't free housing.

### i6-a17 Boomerang kid moves back home (S, 🟠)
A grown kid comes back after college or a breakup. Charge rent, let them stay free, or help them find a place. They help around the house but the grocery bill goes up.

- An event in js/events.js for kids 22–30; counts them as 'at home' for a set number of months at a reduced kidCost.
- Free stay: happiness both ways, money out. Rent: a little money in, a little happiness lost.
- Balance: every choice is a trade; time-limited.

### i6-a18 Help a grown kid with a down payment (S, 🟡)
Your kid finds a house in town and asks for help. Give, lend, or say no. In legacy mode, a kid you helped means your grandkid grew up in Waitsburg and starts with a bit more community.

- An event in js/events.js for kids 25–40 when you have savings.
- Lending creates a small repayment line in turn.js.
- Balance: giving lowers net worth now for a small legacy community gain later.

### i6-a19 Your kid's wedding (S, 🟡)
A kid is getting married. Pay for a barn wedding in the wheat, chip in, or let them handle it. Dancing at the reception, a toast you have to write.

- An event in js/events.js for kids 24–35 with three cost levels.
- Paying more gives more happiness, with diminishing returns.
- Balance: money for happiness, once per kid.

### i6-a20 A partner with kids from before (S, 🟡)
Sometimes the person who catches your eye has a kid already. Say yes and you're a stepparent: kid costs and joys from day one, and a co-parent on the other side of town.

- A variant of 'Someone catches your eye' in js/events.js; adds a kid record flagged step.
- Step kids count for kidsAtHome() and legacy.
- Balance: same cost and joy as any kid, so it's a different road, not a shortcut.

### i6-a21 Co-parenting after a split (M, 🟡)
If you split up with kids at home, kids live with you every other week. Costs are halved, joy is halved, and handoffs at the gas station are their own small events.

- When S.partner turns false with kids at home, set S.coparent; turn.js halves kid lines and kidJoy on off weeks.
- A couple of gentle events in js/events.js: a school play you both attend, a holiday schedule.
- Balance: lower costs balance lower joy; no score gain from a breakup.

### i6-a22 Foster a kid through the county (M, 🟡)
Sign up as a foster home. Kids come for a few months at a time; a monthly stipend covers part of the cost. Some go home, one might stay.

- A Life-tab action in js/ui.js after an eligibility check (stable home, community 40+).
- Temporary kid records with an end date; a stipend line in turn.js.
- Rare adoption event at the end of a placement.
- Balance: stipend is less than the cost; the reward is happiness and community.

### i6-a23 Inherited favors and grudges (M, 🟠)
Your grandparent's town life follows you. If they helped people, old-timers do you favors. If they fought the school bond or closed a shop, some folks are cool to you at first.

- Store a few flags from the parent's life (council, biz, community, town choices) in startLegacy().
- Three or four events in js/events.js check them: a free repair, a job lead, a cold shoulder you can win back.
- Different from i2-b15 (past lives as townsfolk): this is what people remember about your family.
- Balance: favors and grudges are both small and wear off after a few years.

### i6-a24 Town choices stick for the next generation (M, 🟠)
Big town choices made in one life are still there in the next: the school bond that passed means a new gym, the storefront you saved is a café, the creek you planted is shady.

- A family-line flag store carried by startLegacy(); a few map spots in js/maps.js and events in js/events.js check it.
- Only within a legacy line, unlike the cross-life town meter (i2-b16).
- Balance: changes add places and flavor, not stat boosts.

### i6-a25 The years show across generations (M, 🟡)
As a legacy line moves through the 2050s and 2070s, the town changes with it: electric farm trucks, the Tattler on screens, new jobs at the lab, an older Main Street.

- A small era table keyed by year in js/state.js; swaps flavor lines in events, the Tattler and the job board.
- Prices already rise with S.col; this adds words, not numbers.
- Balance: flavor only.

### i6-a26 Stories at the Thanksgiving table (S, 🟡)
At holiday dinners in legacy lives, someone tells a story from an earlier generation: 'Remember when Grandpa ran the food truck?' pulled from that life's big Journal moments.

- Save 3–5 milestone log lines per life in startLegacy(); a holiday event in js/events.js picks one.
- Builds on Holidays at home (i1-b10).
- Balance: flavor, +1 happiness.

### i6-a27 Turn down the family money (S, 🟠)
When the next generation starts, the heir can refuse the inheritance and make their own way. The money goes to the town (a park bench, a scholarship), and the life gets a 'self-made' mark.

- An option on legacySheet() in js/features.js; S.selfMade; the money becomes community and a town improvement.
- A self-made badge and a label on the score card.
- Balance: makes legacy harder by choice; score isn't boosted, only labeled.

### i6-a28 Choose which grandkid carries on (M, 🟠)
Instead of one heir, the legacy sheet shows two or three grandkids with a short sketch each: the one who stayed on the farm, the one back from college with loans, the one who wants to open a shop.

- legacySheet() in js/features.js builds options from the kids' paths; each applies a BACKGROUNDS-like set.
- Reuses existing start trade-offs (money vs. head start vs. debt).
- Balance: each option is an existing balanced start plus the family share.

### i6-a29 Overlap generations: switch to your kid at 65 (L, 🟠)
At retirement you can hand play to your grown kid while you're still alive. You become a character in their life: you babysit, give advice, need rides later, and pass on when it's time.

- A Life-tab action in js/ui.js for Lifetime games; the parent becomes S.elder with age and health, aged weekly in turn.js.
- Elder events in js/events.js: babysitting cuts kidCost, later care costs weeks and money.
- The ending and obituary of the parent run when the elder passes.
- Balance: early help and later care roughly cancel; the parent's score is locked at handoff so it can't be farmed.

### i6-a30 A puppy from the old dog's litter (S, 🟡)
Before your dog gets old, a litter lets you keep a pup. When the old dog goes, the pup is grown, and in legacy mode the heir can start with a dog from the same line.

- An event in js/events.js when S.dog and the dog is 6–9; S.dog2 young dog.
- startLegacy() can carry a dog.
- Builds on dogs grow old (i1-a17).
- Balance: two dogs cost two vet lines for a while.

### i6-a31 Anniversaries that add up (S, 🟡)
Your 10th, 25th and 50th anniversaries are real moments: a dinner in Walla Walla, a party at the Grange hall, the kids coming home.

- Needs a wedding date (i1-b05); dated events in js/events.js.
- Shown on the Family card.
- Balance: cost for happiness, three times in a life.

### i6-a32 Your family's marks on the map (S, 🟡)
Each generation can leave one mark: a bench in the park, a brick at the school, a name on the fire hall plaque. Later generations see them on the Waitsburg map with who left them.

- A one-time action per life (costs money or community work); stored in the family line; pins in js/maps.js.
- Balance: a cost with no stat return beyond a small happiness tap.

## Ideas 6: Look, sound and map

Ideas that make the game look, sound and feel like Waitsburg, with maps and a home that change as you live; all art is original and drawn in code so the PWA stays small.

### i6-b01 A drawn portrait that ages with you (M, 🔴)
A small SVG face built from a few shapes (hair, brows, lines, glasses) that you pick at the start and that grays, wrinkles and slows as the years pass.
New portrait() in ui.js drawn from S.age plus a few saved traits; shows on Home, the score card and the ending. Pure code, no image files. Cosmetic only, no score effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b02 Your house on Home, drawn from what you own (M, 🔴)
A little SVG of your place (apartment, rented house, farmhouse) that gains a porch, garden, dog house, second truck or kids' bikes as your life fills in.
houseArt() in ui.js reads S.housing, pets, kids, vehicles and business. Replaces nothing, sits above the Home stats. Shows what you built; careless play just gets a plainer house.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b03 The title scene follows your latest life (M, 🔴)
The title-screen hills and town take the season and time of day of your newest save, so opening the app feels like coming back to that week.
SCENE in ui.js becomes sceneFor(season, hour) with swapped fills. Reads only the newest slot's turn. No balance effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b04 Day and dusk on the town map (M, 🟠)
The town map tints by the real clock: soft blue at dawn, warm at evening, streetlights and lit windows at night.
A tint layer and a few small circles in maps.js town panel, keyed to new Date().getHours(). Respects the reduced-motion and night-theme settings. Cosmetic.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b05 Main Street changes as you play (M, 🔴)
The town map shows what has happened in your life: your shop sign on its storefront, a SOLD sign on a house you bought, a new mural after a town goal, a closed shop that reopens.
A list of map decorations in maps.js driven by S.biz, season-goal wins and story-chain flags. Each decoration is a few SVG shapes plus a tap note. Earned through play, so it rewards attention, not idling.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b06 Footprints: the places you go most (S, 🟠)
A faint worn path or warm glow on the town-map spots you pick most often, so the map shows your habits.
Count focus picks by place in S; draw opacity on the town map in maps.js. Tap the legend to see your top three places. No stat effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b07 Region map remembers your trips (M, 🟠)
Towns you've visited get a small stamp; the roads you've driven most get a slightly thicker line.
Store a trip tally per city in S.trips; maps.js scales stroke width and adds a stamp mark. A 'places I've been' count goes in the year review. Cosmetic.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b08 Weather on the map (S, 🟠)
Rain streaks, a snow dusting or a smoke haze over the region map in the weeks those happen in the game.
Read the game's season and weather notes in turn.js; maps.js adds a simple pattern overlay. Pattern defs only, a few hundred bytes.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b09 The Touchet rises and falls (S, 🟠)
The river on both maps runs wide and dark blue in spring melt and thin and pale in late summer, and floods its banks during the high-water story.
Stroke width and color of the Touchet in maps.js keyed to week-of-year and the flood chain flag. Tiny change, makes the map feel alive.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b10 Wheat trucks at harvest (S, 🟡)
In July and August a few tiny grain trucks crawl along US-12 on the region map toward the elevators.
Small SVG rects animated along the US12 path in maps.js, only in harvest weeks, off under reduced motion. Decoration only.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b11 Season accent colors across the app (S, 🔴)
The header band and buttons shift a touch with the season: blossom pink in spring, wheat gold in summer, rust in fall, frost blue in winter.
Set a data-season attribute on body in ui.js; index.html overrides --wheat and one accent var per season. Checked against the contrast rules. No balance effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b12 A home that ages with you (M, 🟠)
Rentals and owned homes slowly look worn (peeling paint, a sagging fence) unless you keep them up; a repaint or new roof shows right away.
houseArt() reads a wear value that the existing upkeep events touch. Shows the cost of neglect visually, so careless play looks worse without new penalties.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b13 Holiday touches on Home (S, 🟠)
Lights on the house in December, a flag for the Fourth, a pumpkin in October, a Celebration Days banner in May.
A date-to-decoration table in ui.js layered on houseArt() and the title scene. A few SVG shapes each.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b14 Your truck on the map looks like your truck (S, 🟡)
The commute truck takes your vehicle's color and shape (old pickup, used sedan, new truck) and gets dusty after gravel trips.
maps.js truck icon becomes a tiny SVG built from S.vehicle. Color picked once when you buy. Cosmetic.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b15 Original icon set to replace emoji in key spots (M, 🟠)
A small set of hand-drawn-style SVG icons for the stats (money, happy, health, stress) and tabs, so the game looks the same on every phone.
One icons.js-style object of inline SVG paths inside ui.js (about 4 KB total). Emoji stay as fallback text for screen readers. No balance effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b16 Paper texture and a stamp look (S, 🟡)
A faint paper grain behind cards and a rubber-stamp style for badges and the Tattler masthead.
A tiny inline SVG noise filter in index.html CSS, plus a stamp class. Off on the light mode for old phones.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b17 A soundtrack made in code (M, 🟠)
An optional quiet loop: a few banjo-like plucks and a fiddle drone, made with the Web Audio API, changing key by season.
A small music() in features.js using oscillators and a simple pattern; default off, a toggle in Settings. No audio files. Stops when the app is hidden.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b18 Town sounds on the map (S, 🟡)
Tapping places on the town map plays a tiny sound: a café bell, the grain elevator hum, a school bell, a train horn in Dayton.
Short synthesized blips in features.js, one per place type. Uses the existing sound toggle; off by default.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b19 Haptic patterns that mean something (S, 🟡)
Different short buzz patterns for a raise, a bill you can't pay, a new badge and a baby, instead of one buzz for all.
A pattern table next to the vibration setting. Uses navigator.vibrate only where it exists. Never on Auto weeks.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b20 Theme picker: Barn, Wheat, Creek, Night (S, 🟠)
Pick a color theme in Settings that recolors the app's few CSS variables; Night stays the dark mode.
Theme objects in ui.js write --barn, --wheat, --sage and friends onto :root. Saved in prefs, not the save file. Contrast-checked in tests.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b21 Dark map palette (S, 🟡)
The town and region maps get their own night colors (dark fields, pale roads, lit town dots) instead of just dimming.
A second fill set in maps.js chosen when the night theme or late hour is on. Keeps labels readable.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b22 Small life moments animate once (M, 🟠)
Confetti of wheat for a graduation, a little heart for a wedding, a stork glide for a new baby, a key turning for a first house.
One-shot CSS animations from a moments table in ui.js, triggered by the existing milestone hooks. Skippable, off under reduced motion, never during Auto.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b23 Weather in the header (S, 🟡)
A tiny sun, cloud, rain or snow mark beside the week number that matches the game's season and current weather note.
Header render in ui.js reads the same weather the turn uses. Pure display.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b24 A portrait album at the end (M, 🟠)
The ending shows your portrait at 25, 40, 60 and the end side by side, with one line from each decade.
Save portrait traits and a line at each decade turn in turn.js; render in the end screen. No score change.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b25 Your kids appear by the house (S, 🟡)
Small figures for each kid by the house art that grow taller each stage, and later leave for college or their own place.
houseArt() reads kids' ages. A few rect-and-circle figures. Ties visuals to family choices without new rules.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b26 A hand-drawn Waitsburg map style (L, 🟠)
Redraw the town map with an original sketchy, ink-and-wash look: wobbly roads, hatched wheat fields, little drawn buildings for the real spots.
Replace flat shapes in the maps.js town panel with path data and an SVG turbulence filter for wobble. Original art, under 15 KB. Same tap targets, so tests still pass.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b27 Map labels that tell you something (S, 🟡)
Hover or long-press a place on the town map to see a one-line memory: "Where you met Sam", "Your first job".
maps.js reads the life journal for the first event at each place and shows it in the tap note. Display only.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b28 Night lights show who's home (S, 🟠)
At night on the town map, your house window is lit when you're home and dark on trip weeks; the café is lit early, the bar late.
maps.js lit-window circles keyed to the current focus and hour. Cosmetic; tiny.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b29 Animated week turn (S, 🟡)
Ending a week flips a small calendar page with the new date; holding End Week for skips fans several pages.
CSS keyframes in index.html called from turn.js after a turn. 300 ms, skippable, off under reduced motion and on Auto.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b30 Pet portrait that ages (M, 🟡)
Your dog or cat gets a small drawn portrait on the Life tab that grays at the muzzle as it gets old.
Reuses the portrait builder with animal shapes; reads pet age. Cosmetic.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b31 Splash and icon tied to the season (S, 🟠)
The install icon stays the barn, but the app's splash screen and in-app header logo pick up the season's sky and field colors.
Splash is the boot screen in boot.js plus index.html; swap colors by month. No new assets.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.

### i6-b32 Little easter eggs on the map (S, 🟡)
Tap the grain elevator five times for a pigeon flight, the water tower for a tiny night shooting star, the creek for a jumping fish.
Hidden tap counters in maps.js with one-shot SVG animations. Logs a hidden badge in the badge book. No score effect.
Balance: looks only; no stat or score change, so careless and idle play gain nothing.
