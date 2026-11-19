# Ideas round 11

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 11: Home, food and daily life

Ideas that make the house, the kitchen, the groceries and the small daily routines in the Burg matter.

### i11-a01 Cook in or eat out: a weekly food habit (M, 🔴)

A three-way setting on the Life tab; Mix is today's food line, so nothing changes until you pick.
Mostly home: food −15%, Cook practice +0.3 a week, ☺−0.5 on Work extra hours weeks (no time). Eat out: food +25%, ☺+0.5, community +0.2 if you eat in Waitsburg.
Commuters see the drive-thru lunch in the line, so the long drive has a food cost too. Separate from #60 dining out (special outings).
Files: turn.js food line, features.js skills, ui.js Life tab.
Balance: careless and idle bots never change it, so they stay where they are. Good play gains a few hundred dollars a year, not a score jump.

### i11-a02 Your potluck dish (S, 🔴)

A one-time pick, saved as S.dish with a level (0–3) that rises every 6 Show up for town weeks.
Potluck events (J23 lunchroom, W17 Town Hall, funeral meals) add community +1 per dish level and a line like 'Somebody asked if you brought the potatoes.'
At level 3 the town asks you to bring it to Celebration Days.
Files: features.js (new small block), events.js potluck choices, ui.js Life card.
Balance: only grows through community weeks, which careless and idle bots rarely pick. Bonus caps at +3 per event.

### i11-a03 A good bed and the sleep you get (M, 🔴)

Sleep 0–100, recalculated weekly: old bed −10, early or night shifts (rail, CNA, lift, Hanford) −15, baby under 1 −20, debt −10.
Rest focus effect scales from 70% (bad sleep) to 100% (good). A plain line on Home: 'You're not sleeping well: the baby and the 5 a.m. shift.'
Buy a mattress on the Life tab ($900, lasts 10 years).
Files: turn.js rest calc, state.js job flags, ui.js Home and Life.
Balance: idle play leans on Rest, so bad sleep trims idle scores slightly. The fix costs money that good players can plan for.

### i11-a04 One hobby at home that grows (L, 🔴)

Set on the Life tab; changeable once a year. Practice +1 per Rest week (Cook practice stays).
Payoffs by level: a quilt for the auction, a seat at the coffee shop jam, the library book club, pies for the bake sale, shelves you build, online friends.
A Rest streak with a hobby fades a little slower (5 weeks before the fade instead of 4).
Files: features.js (like SKILLS), events.js payoff events, ui.js Life card. Woodworking feeds the existing woodworking shop business.
Balance: payoffs are community events, not stat multipliers, and the low-80s Rest cap stays, so an all-Rest idle player gains very little.

### i11-a05 Morning coffee: the pot, the counter or the gas station (S, 🟠)

A small pick on Home under the week's focus, remembered week to week.
Home pot: no cost. Coffee counter: about $15/week, community +0.2, and gossip lines. Gas station: $8/week, only on commute weeks, ties into the existing gas-station regular event.
Files: ui.js Home, turn.js bill line, events.js (regular event weight).
Balance: tiny amounts; it's flavor that teaches how small daily costs add up over a year.

### i11-a06 Evening walks around the block (S, 🟠)

A toggle on Home. +0.3 health and +0.2 community a week; with a dog, the dog's line says it's happy too.
Skipped automatically in ice weeks (Dec–Feb, 1 in 3), smoke weeks, and when your one-way commute is 40+ miles.
Now and then a one-line neighbor sighting ('Mrs. B's roses are out').
Files: turn.js, ui.js Home, events.js (sighting lines).
Balance: small and capped; the long-commute cut keeps it honest. Different from healthy habits (i1-a22): this one is about being seen in town.

### i11-a07 A Sunday drive in the wheat (S, 🟡)

A new trip type in the Out & about list, once per 4 weeks, $10–20 of gas.
Unlike other trips it doesn't cut your focus to 75%. ☺+2, more with a partner or kids in the truck.
Season lines: green hills in May, harvest dust in August, first snow on the Blues in November.
Files: features.js trip list, outabout.js, maps.js route draw.
Balance: monthly limit and gas cost; too small to change scores.

### i11-a08 Furnish your rooms (M, 🟠)

Each room has a tier 0–2. Yard sale tier costs $80–200, store tier $600–1,500.
Each tier adds ☺+0.1 a week; furniture counts in net worth at 20%.
The room above Main Street only fits the bedroom and kitchen; moving keeps your furniture.
Files: state.js HOMES rooms, ui.js Life tab, turn.js happiness.
Balance: spending money for small happiness is a real trade; net worth counts it low so it can't be gamed.

### i11-a09 Something breaks: fix it, call it in, or tell the landlord (M, 🟠)

A set of household events with an age on each appliance; older ones break more often.
Fix it: costs a Rest week's effect, Handy level sets the odds; a botch costs more later. Call it in: $150–1,200. Renters: free but 1–3 weeks of ☺−1.
Files: events.js (new 'home' category), features.js Handy skill, state.js appliance ages.
Balance: a cost careless players can't dodge; Handy players and those who save an emergency fund come out ahead. Different from owner home upkeep (i1-b16), which is roof and paint.

### i11-a10 Weekend projects around the house (M, 🟠)

Pick a project from Home; it uses that Rest week (rest effect halved) plus $20–150.
Each finished project adds ☺+0.15 a week for as long as you live there, and Handy practice +1.
Renters need the landlord's OK (a quick yes or no).
Files: ui.js Home, turn.js, features.js Handy.
Balance: halving rest that week is the cost; idle players who never pick one get nothing new.

### i11-a11 Settling in after a move (S, 🟠)

After moving: ☺−0.5 a week for 4 weeks, then a note and a log line.
After 1 year in one place, ☺+0.2 a week; after 5 years, +0.4 (shown as 'Years here').
Files: features.js move logic, turn.js, ui.js Life tab.
Balance: makes moving back and forth a little costly and rewards staying put, which fits the town.

### i11-a12 The Burg Basket receipt (S, 🟠)

A tap on the food line opens the receipt; prices follow the game's cost-of-living rise.
Shows 'Since you started: +$X a month for the same basket.'
Files: ui.js week summary, state.js cost().
Balance: no effect on play; it teaches inflation in plain terms.

### i11-a13 Shop local all month: the Burg Basket punch card (S, 🟠)

Tracks whether you made a stock-up run in the last 4 weeks.
Full card: community +1, $15 off next month's food.
Files: features.js stock-up, turn.js food line, ui.js.
Balance: the stock-up run still saves more money; this gives a community reason to stay home. Bots don't plan for it.

### i11-a14 Run a tab at the Burg Basket (M, 🟡)

Only after 26 weeks of living in Waitsburg and community 40+.
Unpaid after 4 weeks: community −3 and the tab closes for a year.
Files: turn.js money, ui.js Life card, events.js (a reminder event).
Balance: a short loan with a social cost; it can't stack with debt because it closes once used and unpaid.

### i11-a15 Food follows the seasons (M, 🟠)

Food line multiplier by month: Jun–Sep −8%, Feb–Mar +6%, about even over a year.
June event: buy a 50 lb sack of sweet onions ($25) for 4 weeks of −$10 food, or share half with neighbors (community +1).
Files: turn.js food line, events.js, state.js.
Balance: averages out over a year; it only rewards timing a stock-up run.

### i11-a16 Canning day with the neighbor: jars for gifts (S, 🟡)

Event (Aug–Sep, homes with a kitchen): spend a Rest week afternoon, $40 for jars.
December gift costs drop by $60, community +2, Cook practice +1.
Files: events.js, features.js holiday costs.
Balance: small net saving with a time cost. Different from the freezer idea (i10-a20), which stores your own catch and garden.

### i11-a17 Host a dinner for friends (S, 🟠)

Life tab button, once per 13 weeks; $40–120.
Cook level sets the odds: good dinner ☺+3 community +2; burned ☺+1 and a funny log line.
With a partner, it counts toward the relationship.
Files: features.js, events.js outcome lines, ui.js.
Balance: limited per season and costs money.

### i11-a18 Be a regular at the Main Street diner (S, 🟠)

Needs the Eat out food setting or 8 Show up for town weeks.
Regular status: a weekly gossip line, job tips one week early, community fades slower.
Files: features.js, ui.js Jobs tab hint, events.js.
Balance: costs money (eating out); benefits are information, not score.

### i11-a19 Subscriptions that creep (S, 🟠)

Optional bills on the Life tab: $12–60 a month each, ☺+0.2 a week each, max 3.
Each rises 5–10% every January; a card shows the new total and lets you cancel.
Files: turn.js bill lines, ui.js Life tab, features.js year review.
Balance: the happiness gain is less than the money's score worth for most players, which is the lesson.

### i11-a20 Food bank Thursday (S, 🟠)

Offered when money is below one week of food: food line is $0 for 2 weeks, ☺−1 the first time.
Once you're above $5,000, a 'give back' choice: $50 or a Show up for town week there (community +2).
Files: turn.js, events.js, ui.js.
Balance: a safety net that only works twice a year, so careless play can't lean on it. Stand-in name only.

### i11-a21 Bring the fiddle to the bluegrass jam (S, 🟡)

Event on jam weeks for music hobby players; choices: play, just listen, skip.
Playing: community +2, ☺+2; at level 3 you get asked to play Celebration Days.
Files: events.js, features.js hobby levels.
Balance: needs the hobby built up first; payoff is community only.

### i11-a22 Book club at the library (S, 🟡)

Reading hobby level 1, monthly, free. Community +1 a month while you attend.
A three-part chain: the old flood photos, a missing local history book, a talk you give.
Files: events.js chain, features.js hobby.
Balance: monthly, small, needs the hobby.

### i11-a23 A quilt for the school auction (S, 🟡)

Adds a choice to the W11 auction event for quilting hobby players.
Quilt level 1–3 gives community +3 to +5 at no money cost.
Files: events.js W11, features.js hobby.
Balance: replaces money with weeks spent practicing; yearly only.

### i11-a24 A recipe box that fills up (S, 🟡)

Cards come from Cook levels, the canning day, potluck events and hosting dinners.
Each card cuts food 0.5% (max 5%); the box shows on the Life tab.
Files: features.js, ui.js, events.js (grants).
Balance: tiny and capped; mostly a keepsake.

### i11-a25 Home has rooms you tap (L, 🟠)

One screen ties together the home features instead of more cards on Home.
Each room is a big tap target with its own sheet; works by keyboard and screen reader.
Files: ui.js (new view), maps.js style SVG, tests/screens.test.mjs.
Balance: no rule changes; it makes the home choices easy to find for good players.

### i11-a26 Weekdays and a weekend pick (L, 🟡)

A second, smaller choice under the focus; default 'nothing' keeps today's game.
Weekend picks: chores (clears 'chores pile up'), hobby (+0.5 practice), errands (stock-up counts without the 75% trip cut).
Ruts count the weekend pick too.
Files: state.js FOCUS, turn.js, ui.js, tests/sim.test.mjs bots.
Balance: big change; must run the sim at SIM_SCALE=3 and keep careless ≤ 60 and idle ≤ 50, since a free extra pick could raise every score.

### i11-a27 Late-night gaming and the 2 a.m. problem (S, 🟡)

Video games hobby: ☺+1 more on Rest weeks.
4th Rest week in a row: sleep −15 for 2 weeks and a plain line about it.
Files: features.js hobby, turn.js sleep.
Balance: rewards gaming in moderation; extra rest-spamming is punished, which hurts idle play a little.

### i11-a28 A slow cooker for busy weeks (S, 🟡)

One-time buy on the Life tab; only matters with the Mostly home setting.
Lasts 8 years, then it cracks (a funny note).
Files: features.js, turn.js food line.
Balance: a tiny planning reward.

### i11-a29 A spare key with the neighbor (S, 🟡)

Community 50+ or one neighbor favor done: trips with a dog are free of boarding.
Otherwise $35 a trip or the dog is grumpy (☺−1) for a week.
Return the favor: a neighbor asks you to watch their place (S event).
Files: features.js trips, events.js.
Balance: small; rewards knowing your neighbors.

## Ideas 11: Variants of the best

Two or three different shapes for twelve of the strongest 🔴 ideas from rounds 1–10, so the owner can pick which one to build.

### i11-b01 [i1-a01] Light version: a three-word job standing (S, 🔴)
Instead of a hidden 0–100 number, your job shows one word: Shaky, Solid or Valued. Only three things move it (no-shows, Work extra hours streaks, and event choices tagged 'work'), and it only changes raise size at reviews.
Files: state.js (S.standing as -1/0/1), turn.js review step, events.js tag on work events.
Balance: No layoff or promotion math changes, so it is safe to ship first. Idle play never earns Valued because it needs Work extra hours weeks.

### i11-b02 [i1-a01] Full version: standing that remembers why (M, 🟠)
A 0–100 standing plus a short 'boss notes' list (last 4 things that moved it, like 'covered a shift in harvest +4'). It drives raises, promotion odds and layoff order, and drops when you change jobs.
Files: state.js, turn.js (reviews, layoffs), ui.js Jobs tab notes list, events.js work outcomes.
Balance: Differs from the original by showing the reasons, so players learn the rules. Layoff protection caps at 50% so good standing can't make a risky job safe.

### i11-b03 [i1-a01] Two-track version: standing with the boss and the crew (M, 🟡)
Split standing into Boss (raises, promotion) and Crew (carpools, shift swaps, tips on other jobs). Choices often pull them apart: report a coworker or cover for them.
Files: state.js two fields, events.js new work dilemmas, features.js carpool check uses Crew.
Balance: A real trade-off instead of one number to max. Careless play loses both through no-shows, so it can't score higher.

### i11-b04 [i2-a01] Light version: arrows only on event buttons (S, 🔴)
Each event button shows only stat icons with up or down arrows (💵▼ 😊▲), no amounts. One small render change, no tuning of numbers.
Files: ui.js event sheet renderer; events.js effects read for sign only.
Balance: Same as the original but with no money figures, so dice outcomes stay a surprise. Helps careful players more than careless ones, who tap fast anyway.

### i11-b05 [i2-a01] Full version: hints that unlock with skill and standing (M, 🟠)
Hints start as arrows and grow into rough ranges ('about $100–200') once you've seen that event before or have the matching skill. The Album (i2-b10) shows the full outcome of past picks.
Files: ui.js, events.js (seen-count per event in prefs), skills lookup.
Balance: Differs by rewarding experience across lives. Keeps first-time events fresh; idle play never sees many events so gains nothing.

### i11-b06 [i2-a01] Alternate: a 'Think it over' button instead of hints (S, 🟡)
Buttons stay clean. A small 'Think it over' link opens a one-line advice note from someone in your life ('Your mom says: the truck can wait'). Free once per event.
Files: ui.js event sheet, events.js optional advice field (falls back to a generic hint).
Balance: Different mechanic, same goal: fewer blind choices with more flavor. No numbers shown, so no change to balance targets.

### i11-b07 [i2-a02] Light version: money-only week preview (S, 🔴)
Under the focus grid, one line: 'This week: about +$410'. It counts pay, bills, gas and streak fade, but leaves stats out.
Files: ui.js focus grid, turn.js (dry-run the money part of the week without dice).
Balance: Quickest win; money is already fully known before dice. Doesn't help idle play since rest weeks show lower money.

### i11-b08 [i2-a02] Full version: compare two focuses side by side (M, 🟠)
Long-press a focus to pin it, then tap another to see both previews in a two-column card: money, health, happiness, community. Shows streak fade as a small 'tired of this' note.
Files: ui.js new compare card, turn.js dry-run function shared with the light version.
Balance: Differs by making the choice a comparison, not a guess. Exact stat values stay rounded to arrows with 1–3 dots.

### i11-b09 [i2-a02] Alternate: a 4-week plan preview instead of one week (M, 🟡)
The preview shows the next four weeks if you keep this focus: money total and where each stat ends up, with a warning when a stat will drop under 40.
Files: turn.js multi-week dry run (no events), ui.js preview line, pairs with i2-a12 rotation.
Balance: Teaches the streak-fade rule by showing it. Events are left out, so it's a plan, not a promise.

### i11-b10 [i1-b01] Light version: one neighbor next door (S, 🔴)
Start with just one named neighbor (the widow next door) who shows up in 6–8 events across a life, with a 3-step friendship. Tests the idea before building five.
Files: events.js new neighbor events, state.js S.neighbor {name, level}, Family card line.
Balance: Same goal as the original at a fifth of the writing. Friendship only grows from community weeks and helping choices, never from idling.

### i11-b11 [i1-b01] Full version: neighbors who move and change (L, 🟠)
The five neighbors live their own lives: the young couple has a baby, the mechanic moves to Dayton, a new family arrives. Each change brings a new event and a fresh friendship to build.
Files: state.js neighbor list with life stages, turn.js yearly neighbor tick, events.js, maps.js house markers.
Balance: Differs by making the street change over long lives. Benefits are small and spread out so no one neighbor is a must-farm.

### i11-b12 [i1-b01] Alternate: the street as a card you tend (M, 🟡)
No new events. A 'Your street' card on Home lists five houses; once a month you can bring one something (a pie, a fixed fence) for community. Each house has a small yearly payback.
Files: ui.js Home card, features.js street actions, state.js house levels.
Balance: Different mechanic: a light routine instead of stories. Costs a little money each time, so it can't be spammed for points.

### i11-b13 [i1-a02] Light version: one perk at each threshold (S, 🔴)
Only three perks, one per level: 40 = 5% off at the grocery, 60 = a free truck tow once a year, 80 = one job referral a year. Shown as a ladder on the Community line.
Files: features.js perk checks, ui.js Life tab ladder, turn.js where costs are paid.
Balance: Quick and visible. Perks are small and need steady community weeks to keep, so idle lives drop below 40 and lose them.

### i11-b14 [i1-a02] Full version: perks you pick (M, 🟠)
Each time community crosses 40, 60 or 80 you pick one perk from three (discounts, help on bad weeks, referrals, a seat on a board). Fall back below and the perk pauses.
Files: features.js perk table, ui.js pick sheet, state.js S.perks.
Balance: Differs by letting the player shape the payback to their life. Pause-on-drop keeps upkeep real.

### i11-b15 [i1-a02] Alternate: community as a spendable 'goodwill' meter (M, 🟡)
Community stays a stat, but a second meter, Goodwill, fills as you help people. Spend it when you need help (a tow, a sitter, a move); it refills slowly.
Files: state.js S.goodwill, features.js spend sheet, events.js help choices. Overlaps i1-b04; build one, not both.
Balance: A different shape: active spending instead of passive perks. Capped at 3 uses a year so it can't erase bad luck.

### i11-b16 [i2-b03] Light version: last 10 lives as one-line rows (S, 🔴)
The title screen gets a 'Past lives' list: name, years, score and title, one line each, last 10 only. No obituary, no detail page.
Files: state.js new LIVES_KEY store on game over, ui.js title screen list.
Balance: Smallest piece that stops lives being wiped. No effect on scoring.

### i11-b17 [i2-b03] Full version: a shelf of books you open (M, 🟠)
Each life is a book spine on a shelf, colored by its life path. Open one to read its obituary, year-by-year highlights and score card. Pin favorites; keep up to 50.
Files: ui.js shelf view, state.js keeps a trimmed copy of journal milestones at game end, needs i2-b01 for the obituary.
Balance: Differs by keeping the story, not just the number. Trimmed to about 2 KB a life so storage stays small.

### i11-b18 [i2-b03] Alternate: a family tree instead of a shelf (M, 🟡)
Lives are drawn as a tree: legacy grandkids hang under their grandparent, fresh starts are new roots. Tap a name for its score and title.
Files: ui.js simple SVG tree, state.js parent id on each life.
Balance: Different shape that makes legacy mode the star. Works with the light list as a second view.

### i11-b19 [i3-a01] Light version: titles only, same pay steps (S, 🔴)
Each job gets two rung names, and the existing promotion just changes your title (cellar hand to cellar lead). Pay and stress use today's promotion math.
Files: state.js JOBS gets rungs array, ui.js shows title, turn.js promotion log line.
Balance: Pure flavor, no balance risk. Makes the Journal and Tattler read better at once.

### i11-b20 [i3-a01] Full version: rungs with gates you can see (M, 🟠)
Three rungs per job, each with clear gates shown on the Jobs tab: time in job, a school level or certificate, and standing. A locked rung says what's missing.
Files: state.js JOBS rungs with gates, turn.js promotion check, ui.js locked-rung text, pairs with i3-a03 certificates.
Balance: Differs by showing the path ahead. Top rungs need school and time, so careless play stalls at rung one.

### i11-b21 [i3-a01] Alternate: side moves instead of a ladder (M, 🟡)
No ladders. After a year in a job, offers come for related jobs in other towns (cellar hand to a Walla Walla tasting room lead), trading commute for pay.
Files: turn.js offer event, JOBS related-job links, events.js offer sheet.
Balance: A different growth shape that uses the map and commute cost. Higher pay comes with real gas and time costs.

### i11-b22 [i8-a06] Light version: a few jobs closed each month (S, 🔴)
Once a month, about a third of jobs show 'Not hiring right now'. Your current job is always listed. One random roll per month, no new data.
Files: turn.js monthly roll into S.closedJobs, ui.js Jobs tab grays them.
Balance: Fixes the same-job-every-life problem with the least code. Closures are random, so no one job is always the best pick.

### i11-b23 [i8-a06] Full version: hiring seasons by job type (M, 🟠)
Openings follow the valley's year: farm and cellar jobs hire in harvest, the ski lift in winter, schools in August, the airport all year. A small 'hiring now' tag shows on open jobs.
Files: state.js JOBS hire months, ui.js tags, turn.js opening check.
Balance: Differs by teaching the real seasons and rewarding planning ahead. Keeps one or two all-year jobs so no one is stuck jobless.

### i11-b24 [i8-a06] Alternate: apply and wait for a call back (M, 🟡)
All jobs stay listed, but applying starts a 1–3 week wait, and some don't call back. Skills, school and standing raise your odds.
Files: state.js S.applications, turn.js weekly call-back roll, ui.js 'Waiting to hear' row.
Balance: Different mechanic: friction at the door instead of closed doors. Odd first jobs spread out because the best ones call back less often.

### i11-b25 [i5-b01] Light version: weather line with one rule (S, 🔴)
Each week shows a weather word, and only one rule uses it: bad weather (rain, snow, smoke) halves the health gain from Get outside. Nothing else changes.
Files: turn.js weekly roll by month, ui.js chip on Home, FOCUS outdoor effect.
Balance: A tiny build that makes Get outside a choice to time. Doesn't touch money, so scores barely move.

### i11-b26 [i5-b01] Full version: weather that hits jobs and events (M, 🟠)
The forecast also changes work: snow days close field and lift jobs (or pay extra at the lift), heat waves wear on field crews, wind brings power-out events. Shown a week ahead.
Files: turn.js, JOBS group tags (i8-b34), events.js weather-gated events.
Balance: Differs by reaching into pay and events. Bad weeks are balanced by good ones over a year so median scores hold.

### i11-b27 [i5-b01] Alternate: a season mood instead of weekly weather (S, 🟡)
No weekly roll. Each season gets one 'kind of year' line at its start (a wet spring, a hot summer, a mild winter) that shifts a few odds for the whole season.
Files: turn.js season roll, events.js weighting, ui.js season banner.
Balance: Fewer moving parts and less to check each week. Easier for new players to follow.

### i11-b28 [i10-a01] Light version: one want at a time (S, 🔴)
Home shows a single small want ('get outside twice this month'). Meet it for a small happiness bump; a new one comes next month either way.
Files: features.js wants list, turn.js month check, ui.js Home line.
Balance: Same idea with less screen clutter. One want a month can't be farmed, and most need active focus choices.

### i11-b29 [i10-a01] Full version: wants that come from your life (M, 🟠)
Wants are written from what's going on: a new baby brings 'take a week off', a rough job brings 'look at other jobs', a partner brings 'a night out in Walla Walla'. Three at a time, swap one per month.
Files: features.js want rules read state, ui.js Home card, events.js tie-ins.
Balance: Differs by reacting to your life, not a fixed pool. Rewards are small and only for active choices.

### i11-b30 [i1-b05] Light version: just a name and two stages (S, 🔴)
Your partner gets a name you pick, and there are only two stages: dating and together (moved in). Events and the Journal use their name.
Files: state.js S.partner {name, stage}, events.js text swap, ui.js Family card.
Balance: Small and warm. No new money or stat rules.

### i11-b31 [i1-b05] Full version: a relationship meter with ups and downs (M, 🟠)
Besides stages, the relationship has a closeness level that rest and town weeks raise and long work or trip streaks lower. Low closeness brings hard talks; very low can mean a breakup.
Files: state.js closeness, turn.js weekly change, events.js relationship events.
Balance: Differs by making the partner something to tend, not a trophy. Work-only play pays a happiness cost, which helps the careless/idle targets.

### i11-b32 [i1-a05] Light version: a cushion line, no bank (S, 🟠)
Cash under a set amount you choose (say $1,000) is shown as 'Cushion' and bad-luck bills take from cash above it first, with a warning when they dip into it. No interest, no new account.
Files: state.js S.cushion, ui.js money line, turn.js bill step warning.
Balance: Teaches the emergency-fund idea with almost no code. Doesn't add money, so scores don't change.

### i11-b33 [i1-a05] Full version: savings goals with a jar on Home (M, 🟠)
Name up to three goals (truck, down payment, Christmas) each with a weekly transfer and a jar that fills on Home. Finishing a goal before its date gives a small happiness bump; pulling money out early shows a sad jar.
Files: state.js S.goals, turn.js weekly transfer, ui.js jars, features.js payout.
Balance: Differs by making saving visible and personal. The bump only comes from finished goals, so it rewards planning, not idling.
