# Ideas round 46

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 46: Playtest as a parent

Ideas from playing 5-year and Lifetime games as a parent (Young parent and fresh starts, with partners, kids, college send-offs and the grandkid handoff), headless with Playwright.

### i46-a01 Bug: a 17-year-old still needs $200 of commute childcare (S, 🔴)
kidCost() adds the $200 commute childcare for every kid at home, so a parent driving to Walla Walla pays daycare for a high-school junior. Charge childcare only for kids under 13.
- Found in Lifetime playtests: the Kids line never drops when kids hit their teens.
- Touches kidCost() and kidsAtHome() in js/state.js (cost per kid by age) and the Kids line in js/turn.js.
- Balance: a small saving for parents of teens only; idle and careless play gain nothing new.

### i46-a02 Bug: a kid can turn 18 with no send-off at all (S, 🔴)
"A kid heads off to college" is a random roll in a 12-month window. In 2 of 4 Lifetime playtests a kid turned 18 with no event. Make it a sure thing: one send-off per kid in the week they turn 18.
- Today the biggest parenting moment can just not happen.
- Touches the event in js/events.js (track which kids had it, e.g. S.kidSent) and a forced pick in rollEvent() or a note in js/turn.js.
- Balance: same choices and costs as now; only the chance it is skipped goes away.

### i46-a03 Bug: "your oldest" is every kid (S, 🔴)
The college event always says "Your oldest at home", even for the second and third kid. Say "your oldest", "your middle one" or "your youngest" from the birth order.
- Small text bug that makes kids feel like copies.
- Touches the text function of "A kid heads off to college" in js/events.js.
- Balance: text only.

### i46-a04 Kids leaving home reach the Journal and the year in review (S, 🔴)
When a kid turns 18 nothing is logged; they just become "grown" on the Household card. Log "Your youngest graduated from Waitsburg High and moved out" and show it in that year's review.
- The year in review only ever showed "Baby number 2 arrived". Its filter drops event results (lines with ": "), so even the college choice never appears.
- Touches weekTick() in js/turn.js (check birthdays each week) and the milestone filter in the review.
- Balance: Journal text only.

### i46-a05 The Jobs list shows the childcare cost of a long commute (S, 🔴)
Take-home on the Jobs list counts taxes and gas but not the $200 a month per kid of commute childcare, so a Walla Walla job looks better than it is. Add "childcare $X/wk" to the row and take it out of take-home.
- As a parent this is the number that decides a job.
- Touches takeHome() and jobRow() in js/ui.js, reusing KID_CARE_COMMUTE from js/state.js.
- Balance: information only; it makes the honest choice easier.

### i46-a06 The "Have a baby" button quotes the real monthly cost (S, 🟠)
The button says about $650 a month, but with a 20+ mile commute it is $850. Quote the cost for your current commute and add "+$200 childcare while you commute".
- Kids should not surprise you on the first bill.
- Touches the "Starting a family?" label in js/events.js, calling kidCost().
- Balance: text only.

### i46-a07 Tell your partner you're done having kids (S, 🟠)
"Starting a family?" came up 6 to 12 times in each Lifetime run, still asking at 41 with a teen at home. After a "Not now", offer "We're done at this many" so it stops asking.
- Being asked every year feels like nagging, not choosing.
- Touches the event's when() and choices in js/events.js, with an S.familyDone flag.
- Balance: neutral; it only removes a repeat prompt.

### i46-a08 Bug: the Young parent earns the Family badge in week one (S, 🟠)
The Young parent background starts with a toddler and gets 👶 Family on day 7 for a kid they never chose. Award it for a baby born in this life, or at the toddler's first birthday in the game.
- A free badge in the first week cheapens it.
- Touches the family badge test in BADGES in js/features.js (compare the birth month to the start).
- Balance: badges don't score, so no score change.

### i46-a09 Single parent challenge: no dating in the first year (S, 🟠)
In the 2-year Single parent challenge a partner showed up by month 4, adding a part-time paycheck, and happiness sat at 81 to 87. Hold "Someone catches your eye" until month 13 of the challenge.
- The challenge is easy because it stops being single.
- Touches the when() of the dating event in js/events.js and SCENARIOS.single in js/features.js.
- Balance: makes the challenge harder, which is the point; normal games are unchanged.

### i46-a10 Get outside counts as family time (S, 🟠)
Kids at home lift you 0.6 a week in Rest and Town weeks but only 0.1 in Outside weeks, the same as overtime. Fishing and hikes with the kids should count: make Outside 0.4.
- Kid joy now pushes parents to rest, not to go fishing on the Touchet.
- Touches kidJoy() in js/state.js and the Help family line.
- Balance: idle play always rests, so it gains nothing; a small lift for varied play.

### i46-a11 A family line on Home (M, 🟠)
Home shows job, home, ride and school, but nothing about the kids. Add "👶 Kid, 4 · $718/mo" with a tap that lists each kid's age, cost and next milestone ("starts kindergarten September 2030").
- Today the only place kids appear is one Household line on Life: "age 2".
- Touches renderHome() in js/ui.js and a small family sheet.
- Balance: information only.

### i46-a12 The first year is sleepless (M, 🟠)
While a baby is under 1, rest tops out lower and health drifts down a little, but kid joy is higher. The note "A baby! Sleepless, broke and over the moon" becomes a real season.
- The baby is a +12 happiness pop, then just a bill.
- Touches weekTick() in js/turn.js (the rest cap and health drift) and kidJoy() in js/state.js.
- Balance: a real cost for a newborn so kids aren't free happiness; lasts 52 weeks only.

### i46-a13 Out and about: bring the kids (M, 🟠)
With a kid under 13 at home, some visits get "with the kids": story time at the library, ice cream on Main, the park. They cost a little per kid and count as family time that week.
- Gives parents something to do with kids each week, not just a cost line.
- Touches PLACES and actCost() in js/outabout.js, like the date-night "for two" option.
- Balance: still under OUT_WEEK_CAP, and costs money, so it can't be farmed.

### i46-a14 A home too small for the family (M, 🟠)
Three kids in the rented room above Main Street changed nothing. With 2+ kids at home in the room, lose a little happiness each week and get one note: "The kids are sharing a bunk by the fridge."
- Makes moving to a house part of raising a family.
- Touches HOMES (add beds) in js/state.js and the happiness drift in js/turn.js.
- Balance: hurts careless play that never moves; good play already moves.

### i46-a15 A one-line kid moment in the week recap (M, 🔴)
Most weeks with kids at home, the week sheet adds one plain line by age: "Learned the word 'tractor'", "Lost a tooth at recess", "Borrowed the truck keys". No stats and no popup.
- Answers "do kids feel like people?" cheaply: a voice every week.
- Touches showRunDetails() and the Tattler line in js/turn.js, plus a small pool by age in js/events.js.
- Balance: zero stats, never stops a skip.

### i46-a16 A kid's birthday each year (M, 🟡)
Once a year per kid: cake at home (free, small happiness) or a party at Preston Park (costs more, more happiness and community).
- A yearly beat that marks the kid growing up.
- Touches a scheduled event in js/events.js keyed to each kid's birth month.
- Balance: small numbers, once a year per kid.

### i46-a17 Your grown kid is the heir's parent, and drops by (M, 🟠)
The legacy sheet says whose child the heir is ("your oldest's kid"). In the heir's first month that grown kid stops by with a casserole and advice.
- Today your kids vanish at the handoff; the heir is just "a grandkid".
- Touches legacySheet() and startLegacy() in js/features.js and one once-only event in js/events.js.
- Balance: flavor plus a small community bump, once.

### i46-a18 The end screen remembers what each kid did at 18 (S, 🟠)
Keep the college choice per kid and list it at the end: "Oldest: college with your help. Youngest: took out loans."
- The end screen just says "Kids raised 3"; the choices you made vanish.
- Touches the college event in js/events.js (store a note per kid) and finish() in js/features.js.
- Balance: text only.

### i46-a19 Kid joy changes with age (S, 🟡)
Toddlers lift you most, teens least: 0.8 under 6, 0.6 from 6 to 12, 0.4 from 13 to 17.
- Right now a 2-year-old and a 17-year-old feel the same.
- Touches kidJoy() in js/state.js (per kid, not per head count).
- Balance: about the same over 18 years; it just moves the joy earlier.

### i46-a20 Kid milestones stop a skip (M, 🟠)
Skips go right past every kid moment. Add notes for starting kindergarten, turning 13 and turning 16, so a 4- or 13-week skip pauses there.
- Skipping ahead is how most long games are played; milestones must catch you.
- Touches weekTick() notes in js/turn.js, which already stop playWeeks().
- Balance: no stats; just pauses.

### i46-a21 A breakup says the kids stay with you (S, 🟡)
When "A rough patch" ends with a split and kids are at home, the result says so and Household shows "Single parent". Today it just says "You went your separate ways."
- In one playtest a parent of a 9- and 11-year-old split up, and nothing mentioned the kids.
- Touches the choices of "A rough patch" in js/events.js and the Household card in js/ui.js.
- Balance: text only.

### i46-a22 Help explains how kids really work (S, 🟡)
Help says kids lift you "most in weeks at home". Spell out the rules: Rest or Town weeks, $200 childcare per kid only on a 20+ mile commute, a little community each week, the 3-kid limit.
- Parents can't plan around rules they can't see.
- Touches the family section in js/help.js.
- Balance: text only.

### i46-a23 Everyday events notice your kids (M, 🟠)
With kids at home, some events get a parent's version: the Friday game ("your kid's in the pep band"), the double shift ("but it's recital night"), the neighbor's moving day ("their kids are your kid's best friends").
- Kids show up in the town's stories, not just on the bills.
- Touches the text and choices functions of existing events in js/events.js.
- Balance: same sizes as today; a recital choice trades cash for happiness.

### i46-a24 Household lists grown kids' ages (S, 🟡)
"Kids: grown, grown, grown" becomes "3 grown (ages 57, 51, 48)", with kids at home listed first.
- Grown kids should still read as people.
- Touches the Household card in renderLife() in js/ui.js.
- Balance: text only.

### i46-a25 The end screen shows what kids did to the score (M, 🟡)
In playtests, two kids moved a Lifetime score by about ±1 (more happiness, less money) and cost 2 to 3 points over 5 years. Add a short line: "Family: +5 average happiness, $590k raising them."
- Shows the trade honestly, so having kids feels chosen, not punished.
- Touches finish() and lifeScore() in js/features.js (count kid cost while you play).
- Balance: information only.

### i46-a26 The happiness ⓘ shows what your kids gave this week (S, 🟡)
Tapping Happiness lists "kids at home" with no number. Show it live: "Kids at home: +1.2 this week (Rest week)".
- Lets a parent see the Rest/Town rule working.
- Touches showStatInfo() in js/ui.js, using kidJoy() and kidsAtHome().
- Balance: information only.

### i46-a27 A partner at home halves commute childcare (S, 🟡)
Your partner works part-time, so with a partner the $200 commute childcare is cut in half.
- Today a two-parent family pays the same childcare as a single parent.
- Touches kidCost() in js/state.js.
- Balance: a small saving; single parents keep the full charge, which keeps that path harder.

### i46-a28 Road trips cost more with kids in the back seat (M, 🟡)
On trips, food and tickets cost a bit more per kid at home, and family stops (zoo, water park, science center) give more happiness with kids along.
- Trips ignore kids completely today.
- Touches stopCost() and the trip fx in js/features.js.
- Balance: more cost and more reward; trip time limits still apply.

## Ideas 46: The Touchet Tattler

The Touchet Tattler becomes a real paper you open each week, with a front page built from your game, classifieds, letters, sports, the editor, and an archive of every issue.

### i46-b01 The Tattler page: a real front page you open (M, 🔴)
Tap the paper pin or the week sheet's Tattler line to open a full front page: a lead story, two briefs, a photo caption and a box score. All of it comes from this week's game state.
New openTattler() sheet in ui.js, styled like newsprint. It reads from the story queue (b02). The one-line tattlerLine() in outabout.js becomes its teaser.
Balance: Reading costs nothing and gives no stats, so idle play can't farm it.

### i46-b02 One story queue for the whole paper (L, 🔴)
Every system drops story candidates into one weekly queue: events, town goals, the town ledger, season, sports, your job and home. The paper ranks them, uses cooldowns and never repeats a story within a year.
New js/tattler.js with addStory(kind, weight, text, tags) and buildIssue(). Events, features and turn.js call addStory. It replaces the TATTLER array.
Balance: Pure presentation. Stories about you only come from things you actually did.

### i46-b03 Masthead, volume and issue number (S, 🟡)
The top of the page reads 'Vol. 139, No. 22 · Thursday, May 28 · 75¢'. The price rises with game inflation, and the volume turns over each January.
A header string in openTattler() built from S.turn, the game date and the inflation factor in state.js.
Balance: No balance effect.

### i46-b04 Back issues: the Tattler archive (M, 🔴)
Every issue is saved, and a 'Back issues' drawer lists them by date. Open any one to read it again. Issues are stored as compact facts and rebuilt the same way each time, so saves stay small.
S.tattler = [{turn, seed, storyIds}] in state.js with a save migration. Rebuilt by buildIssue() in tattler.js. Keep the last 260, plus any you clipped.
Balance: Archive only. No stats.

### i46-b05 Search the back issues (S, 🟡)
A search box in the archive finds issues by a name, place or word: 'Preston', 'levee', your kid's name. Results show the date and headline.
A filter over rebuilt archive issues in tattler.js, with results in the archive sheet in ui.js.
Balance: No balance effect.

### i46-b06 Clip it: stories on the fridge (S, 🟠)
Tap ✂️ on any story to clip it. Clipped stories go to a fridge board on Home, stay in the archive forever and are listed on the end screen as 'Clippings'.
S.clips (max 12) in state.js, a small Home card in ui.js, and an end-screen list in turn.js finish().
Balance: Keepsake only. No score.

### i46-b07 Subscribe, or buy it at the rack (S, 🟠)
A $35-a-year subscription brings every issue to your door. Without one you only get the issues from weeks you pick up a copy at 216 Main. Unread issues still go in the archive, marked 'not read'.
A subscription flag on the Life tab, billed in the weekly bills in turn.js. It gates which issues are marked read in tattler.js.
Balance: Subscribing gives +1 community a quarter at most, less than the yearly cost in a careless budget.

### i46-b08 The classifieds page: For sale, For rent, Gigs (M, 🔴)
A real classifieds page in three columns that refresh every week. Ads run for 1–3 weeks and then expire. Circle one to hold it, then answer it from the week sheet.
An ads pool in tattler.js tagged by season and town. Circled ads sit in S.circled. Answering uses the existing gig, move and vehicle flows in features.js.
Balance: Ads are fair trades or a little better, never free money. Gigs cost a focus week like the bulletin board does.

### i46-b09 Sell your own stuff in the classifieds (S, 🟠)
List an old couch, a spare bike or your gear for $5. A buyer calls in 1–3 weeks. Price it high and you might wait, price it low and it goes fast.
A 'Sell something' action at the Tattler pin in outabout.js. The items come from things you own (vehicles, the gift shelf, hobby gear). Resolved in turn.js.
Balance: Only sells things you bought, at a loss, so it can't make money from nothing.

### i46-b10 Rentals you only find in the paper (S, 🟠)
Some rentals never reach the Move list: a room over a garage, a farmhouse out on Lewis Gulch Road. They show up in the For rent column, are a bit cheaper, and come with a quirk.
Extra HOMES entries flagged paperOnly in state.js, listed in the classifieds. Moving into one uses the existing move flow on the Life tab.
Balance: Each one has a quirk (a long drive, a landlord with rules), so the discount has a cost.

### i46-b11 Free to a good home (S, 🟡)
Puppies, kittens, a laying hen and a goat named Doris show up in the classifieds. Take one and it joins your household, with its own feed costs and small happy moments.
Classified entries that create a pet in S.pets (or a simple flag if pets aren't built yet). Uses the pet events in events.js.
Balance: Weekly costs and vet events balance the happiness.

### i46-b12 Births and new arrivals (S, 🟠)
A small column lists new babies and families who moved to town, using stand-in names from the town ledger. When you have a kid, you can pay $10 to announce it, and neighbors stop by.
Built from the town ledger and the kid-birth code in features.js, with a choice added to the birth event in events.js.
Balance: The announcement gives +2 community once per kid.

### i46-b13 Townsfolk obituaries you can act on (M, 🟠)
When a named local you know dies (a jam regular, an old boss, a neighbor), their obituary runs and gives you a choice: go to the service, send a card, or bring food. This leads into the existing funeral moments.
NPC age and death flags in state.js, with obituary text from tattler.js that opens the funeral events in events.js. Only for NPCs you've met three or more times.
Balance: Going costs a focus week and gives community. Skipping costs nothing but is remembered in the next one.

### i46-b14 Weddings, anniversaries and big birthdays (S, 🟡)
A social column for a 50th anniversary at the Legion, a 100th birthday at the care home, and engagements. Your own wedding and milestone anniversaries can run here too.
Story candidates from the family code in features.js and the NPC pool, plus an optional announcement choice.
Balance: Flavor only, with a one-time +1 community for your own announcement.

### i46-b15 The blotter needs you (S, 🟠)
Some light sheriff's log items are open calls: 'A brown dog has been visiting porches on 4th St.' or 'Cow loose near the Coppei turnoff.' Help out that week for a small reward and a follow-up line.
Blotter entries with a matching Out and about action in outabout.js that lasts one week, plus a follow-up story in tattler.js.
Balance: Costs a focus week. The reward is mostly community with small cash, capped once a month.

### i46-b16 Your name in the blotter, gently (S, 🟡)
Careless choices (a loose dog, a fender bender, skipping the burn ban) can land you in the blotter without your name: 'A resident on Main St. was reminded...' Everyone knows anyway.
Hooks on existing careless event choices in events.js that add a blotter story and −1 community.
Balance: A small extra cost for careless play, which pushes that median down.

### i46-b17 Cardinals season on the sports page (M, 🟠)
The sports page keeps a real season record for the Cardinals (football, volleyball, basketball and baseball by season), with scores each week and a playoff run some years.
A seeded season sim in tattler.js, tied to the school calendar. It feeds headlines and the existing Friday game events.
Balance: Flavor, plus a small happiness bump on win weeks if you went to the game.

### i46-b18 Your kid in the box score (S, 🟠)
If your kid plays a sport, their name shows up in the box score and the game recap. A big game gets them a photo, and you can clip it.
Reads the kid sports flags in features.js and adds lines to the sports page in tattler.js.
Balance: Only for kids whose sports you paid for and supported, so it rewards involvement.

### i46-b19 The café football pick'em (S, 🟡)
Each fall Friday, fill out the Tattler's pick'em card for $1. The weekly winner's name runs in the paper, and the season leader gets a free breakfast.
A small pick sheet in ui.js, results from the season sim (b17), with the winner shown on the sports page.
Balance: Pennies at stake. Small happiness and community, only on weeks you take part.

### i46-b20 The editor knows your name (M, 🔴)
The editor, a stand-in character called Marv Ostrander, becomes part of everyone's town life, not just reporters'. He asks favors: carry bundles when the carrier is sick, judge the pie contest, check a fact. He remembers how you answered.
A named NPC in events.js with a relationship number in S.npc. Three to five favor events a year, and his tone in the paper changes with how you've treated him.
Balance: Favors cost a focus week, and the payoff is community and later story options, not cash.

### i46-b21 Your byline on the front page (S, 🔴)
As the reporter, your stories run with your byline. Their quality depends on your stress and on what you chose at deadline. A good one leads the page, and a weak one lands on page 6.
Ties the reporter job in outabout.js and its work events to story candidates in tattler.js, flagged byline:true.
Balance: Quality follows stress and focus, so working while burned out shows in print.

### i46-b22 Pitch your own story (M, 🟠)
As the reporter, each month the editor offers three leads taken from the game: a real event from this week, a town goal and a sports game. Your pick becomes next week's feature and introduces you to someone new.
Pulls leads from the story queue (b02). The choice sheet is an event in events.js, and the new contact goes into the NPC pool.
Balance: Costs a work week's stress. The payoff is community and contacts.

### i46-b23 Compose a letter: topic and tone (S, 🟠)
Any week you hold a paper, write a letter: pick a topic (the crosswalk, loose dogs, the pool, praise for a neighbor) and a tone (kind, firm, sharp). Kind letters build standing, and sharp ones win some readers and lose others.
A compose sheet in ui.js. The letter prints in next week's issue from tattler.js. Limited to one a month.
Balance: Capped at one a month. Sharp letters carry a community risk, so they can't be spammed for points.

### i46-b24 The letters page regular (M, 🟡)
A grumpy regular letter writer, a stand-in named Delbert, writes in most weeks. Answer him and a polite feud runs for weeks. Some years it ends with the two of you having coffee.
An NPC letter chain in tattler.js with three or four stages tracked in S.npc, plus a coffee-shop meeting event in events.js.
Balance: Flavor. The coffee ending gives a one-time happiness and community bump.

### i46-b25 Call in a tip (S, 🟡)
Phone the newsroom with a tip about something you saw this week. True tips run in 1–3 weeks and help your standing. Gossip gets checked and quietly dropped, and the editor trusts you a little less.
A Tattler pin action in outabout.js. Tips come from this week's events and are true or rumor by source, scored in tattler.js.
Balance: Only real events make true tips. A rumor lowers the editor's opinion of you (b20).

### i46-b26 Corrections and clarifications (S, 🟡)
Now and then the paper gets something about you wrong: your name spelled 'Smiht', the wrong pie flavor. Ask for a correction, laugh it off, or keep the misprint clipping.
A rare story variant in tattler.js with a small choice event in events.js.
Balance: Flavor only.

### i46-b27 Public notices worth reading (S, 🟠)
The small type in the back: a road closure on 12 next month, a zoning hearing next to your lot, the property tax due date. Players who read it get a warning and a way to act.
Notices made from upcoming events and the Up next dates. Acting on one (a detour, going to the hearing) uses existing code in events.js and features.js.
Balance: An information edge for careful players. Idle play never acts on it, and careless play skips it.

### i46-b28 The grocery insert (S, 🟡)
Each issue has a one-line Burg Basket sale. Shop local in a sale week and groceries cost about 5% less, which helps shopping local against the Walla Walla stock-up.
A rotating sale tag in tattler.js, checked in the grocery cost in turn.js.
Balance: A small, steady saving only when you shop local in sale weeks.

### i46-b29 The council endorsement (S, 🟡)
When you run for council, the editor writes an endorsement based on your record: years in town, letters, volunteering, and whether you've ever been in the blotter. It shifts the vote a little.
Reads S.npc editor and your community history, then changes the council-run event odds in events.js.
Balance: A few points of vote share, earned through steady play.

### i46-b30 Graduation special section (S, 🟡)
Every June the paper prints the senior class: names, plans and one photo each. Your kid is in it, and you can buy a congratulations ad for $20.
A June issue template in tattler.js that reads your kids' ages from features.js, with the ad as an optional choice.
Balance: Flavor with a one-time happiness bump.

### i46-b31 The year in front pages (S, 🟠)
The year in review shows the four best front pages of your year as small thumbnails. Tap one to open it from the archive.
Year-in-review screen in turn.js, picking issues from S.tattler by story weight.
Balance: No balance effect.

### i46-b32 Save the Tattler (L, 🟠)
In a tough valley year, ads dry up and the paper might close. The town runs a drive: subscribe, buy an ad, or help with a fundraiser dinner. If it closes, the front page goes dark for a year.
A crisis chain in events.js tied to the valley economy. A paper-health number in state.js controls whether openTattler() shows the full page or a 'closed' notice.
Balance: It costs money and time to help, with community as the reward. Losing the paper takes away the information edge from b27.
