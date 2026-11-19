# Ideas round 10

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 10: Lessons from other games

One mechanic from each well-loved life sim and town game, made our own for The Burg's one-week turns and small-town tone.

### i10-a01 Three small wants that refresh (M, 🔴)
Home shows three small wants drawn from your life right now, like "eat out with your partner" or "get outside twice this month". Meeting one gives a bit of happiness and a new want takes its place.
Lesson from life sims with wants: small, personal goals give each week a reason.
S.wants (3 slots) in state.js, a WANTS pool keyed to age, job, family and season; checked in weekTick (turn.js); a Home card in ui.js.
Only actions meet wants, so idle and Auto-on-one-focus never fill them. Bonus capped at +3 happiness a want, and wants that sit 8 weeks just swap out with no penalty.

### i10-a02 Pick two traits when you start (M, 🟠)
At the start you pick two traits from about ten, like Homebody, Restless, Penny-pincher or Joiner. Each tilts one focus up and has a small downside, so two lives with the same background play differently.
Lesson from life sims with personality traits.
TRAITS table in state.js; focusEffect() and FOCUS fx read S.traits; new step in the start flow (ui.js); shown on the Life tab.
Every trait pays for its upside (Restless: Get outside +25%, ruts come 1 week sooner). Sim bots take random traits so the medians stay checked.

### i10-a03 One worry at a time (S, 🟡)
When something is weighing on you, like low cash, a long stretch without friends or a truck overdue for service, it shows as a single worry on Home. It drains a little happiness each week until you deal with it, then it clears with a small relief bump.
Lesson from life sims with fears: a named problem is easier to act on than a falling bar.
worry() picks the top one from state each week (turn.js); one line on Home (ui.js).
Drain is small (−0.5/week). Careless play keeps worries, so it nudges the careless median down, not up.

### i10-a04 Fix up the old Grange hall, one set at a time (L, 🔴)
The town's old hall needs fixing, and a board at the hall lists six sets to bring in, like "a fish from the Touchet, a jar of preserves and 3 weeks of volunteering". Each set you finish fixes one room for good and opens a lasting town perk.
Lesson from farm sims with collection bundles that rebuild a town building.
GRANGE_SETS in features.js; progress in S.grange; items come from outdoors, cook, handy and community weeks; a pin on the town map (maps.js) and a sheet in ui.js.
Each set needs different focuses, so one-focus or idle play never finishes one. Perks are small (for example community fades slower) and capped at six.

### i10-a05 Neighbors with likes, dislikes and friendship scenes (M, 🟠)
Each named neighbor loves one thing and dislikes one thing, and you learn which by trying. Bring the right thing on a visit and you get closer; at three friendship steps a short scene plays where you learn more about them.
Lesson from farm sims where gifts and heart scenes make neighbors real.
Builds on named neighbors (i1-b01): NEIGHBORS gets likes and dislikes, S.friends holds points; scenes are STORY_EVENTS chains (features.js).
Visits cost a trip stop and money, so it trades against other uses of the week. Max +2 community per scene.

### i10-a06 Finds for the historical society (M, 🟠)
Weeks outside or doing yard and fence work sometimes turn up an old find: a railroad spike, a milk bottle from a long-gone dairy, a 1920s photo. Donate it and it goes into a display case you can browse, with one line of plain town history each.
Lesson from collect-and-donate museums in cozy games.
FINDS list (about 30) in features.js; rolled in skillWeek or the outdoors focus; a case sheet from the library pin (maps.js, ui.js).
Collection only: each find is +1 happiness the first time and nothing after. Never anything sacred or tribal, only everyday town objects.

### i10-a07 A different out-of-town visitor on Main Street each week (M, 🟠)
Most weeks one visitor sets up on Main Street: a knife sharpener, a traveling portrait photographer, a book van, a tire deal truck. Each has one offer that week only, and some only come in certain seasons.
Lesson from cozy town games where a rotating visitor makes you check in.
VISITORS table in outabout.js, picked by the week seed; a Main Street stop card for the week.
Offers are fair, not free (a tire deal is 20% off, still a cost). Missing one costs nothing.

### i10-a08 Talk a neighbor out of moving away (M, 🟡)
Now and then a neighbor you know says they're thinking of leaving town. If your friendship is high enough you can help them stay (a job lead, a hand with the move-in fix-up), or wish them well and get a letter later.
Lesson from town games where residents ask to leave and you can talk them out of it.
An event in events.js gated on S.friends; outcome changes who appears in later events.
Helping costs a week of community focus or money; letting go is never punished, it just changes the cast.

### i10-a09 The town gives you a nickname (S, 🟠)
After a year of steady habits, the town starts calling you something: "Creek" if you're always fishing, "Overtime" if you work every week, "Coach" if you volunteer with kids. Events and the Tattler use it.
Lesson from cozy games where neighbors pick up a catchphrase and call you by it.
nickname() reads the last 52 weeks of focus counts and flags (turn.js); used in event text and the obituary.
Flavor only, no score. Some nicknames poke fun at one-note play, which quietly points at variety.

### i10-a10 Front-porch asks: quick two-button cards (M, 🔴)
Once a month, three neighbors stop by with quick asks, like lending a ladder or watching a dog. Each card has two buttons and small arrows showing which stats would move, but not by how much.
Lesson from swipe-choice games: fast choices with partial hints are fun and fast.
PORCH_ASKS pool in events.js; a stacked card sheet in ui.js; arrows read from each choice's fx.
Saying yes to everything drains money and health; no to everything drains community. Auto picks the safe no, so idle gets nothing.

### i10-a11 Council term as a balancing act (M, 🟠)
On the council, each vote pushes four town groups: farmers, Main Street, families and the budget. Let any group get too unhappy or too pleased and the term ends early with a story about why.
Lesson from reign-style games where every meter can end you at either extreme.
Builds on the council seat; S.council holds four 0–100 meters; votes are events in events.js; meters on the Life tab.
A full term pays community; an early end costs some. Needs real choices, so Auto play can't hold a seat.

### i10-a12 Small talk while you're out (S, 🟡)
Sometimes an out-and-about stop has a one-tap moment: someone in line at the post office says something and you can chat, joke or just nod. It never costs a week.
Lesson from life sims full of tiny three-button encounters with strangers.
SMALLTALK lines in outabout.js shown on the trip result; three canned replies.
Tiny effects (±1). A chat streak with the same person can turn them into a named neighbor.

### i10-a13 Hidden knacks you find by trying (S, 🟠)
Each life rolls two hidden knacks, like a green thumb or a head for numbers. You only learn about one when you try something it helps, and from then on it shows on the Life tab.
Lesson from life sims with hidden starting stats.
S.knacks rolled at start (state.js); practice() and focus results check them (features.js); a reveal note on discovery.
Small bonus (+15% to one skill's practice). Only found by trying new things, which rewards variety, not idle.

### i10-a14 A bill lands before payday (S, 🟡)
On Normal and Hard, a bill sometimes comes due a few days before your paycheck. You can pay it from what you have and run lean, or let it go late and pay a fee.
Lesson from budget-crisis games: timing, not just totals, is what pinches.
An event in events.js when cash is under one week of bills; fee is added to lines in weekTick.
Only fires when cash is short, so planners with a buffer never see it. Careless play pays more fees.

### i10-a15 Check the forms at a county desk job (M, 🟡)
If you work an office job at the courthouse, you can play a short check each week: five forms, and a rule list that changes now and then. Get them right for a better work standing; skip it any time.
Lesson from document-checking games where a growing rulebook makes desk work tense.
A small form sheet in ui.js for jobs tagged clerk; rule list in features.js; result feeds work standing.
Optional and skippable; Auto skips it. Accuracy only helps raises a little.

### i10-a16 Cut a corner at work, and the check comes later (M, 🟡)
Sometimes work offers a shortcut: skip a safety step, fudge a timesheet, take the leftover lumber. It pays off now, but some months later there may be a review that costs much more.
Lesson from games where small rule-bends come back as a later citation.
A chainSet() story in features.js that fires the review 8–30 weeks on; events.js text.
Expected value is negative. Honest players lose nothing; a careless streak lands harder.

### i10-a17 How everyone at home is doing (M, 🟠)
After each week, one short line per person and pet at home: "Partner: worn out", "Kid: happy", "Dog: restless". Leave someone low for too long and it turns into an event.
Lesson from trail and checkpoint games that list each family member's condition at night.
household() builds lines from state in turn.js; shown in the week strip and run details sheet (ui.js).
Rest and community weeks lift them; overtime streaks drag them. Gives a reason to vary focus.

### i10-a18 Kindness tokens turned over at the end (M, 🟠)
Each real good deed (a meal for a sick neighbor, a ride, a shift covered) gives a face-down token. You can't see what they're worth until the end, when they flip over and add to the story and a little to the score.
Lesson from the board game of life, where hidden bonus tiles pay out at the finish.
S.tokens list; earned in chosen event outcomes (events.js); flipped on the end screen (features.js finish()).
Capped at 3 score points total. Only chosen deeds count, so idle earns none.

### i10-a19 Show the odds as a spinner on risky choices (S, 🟡)
When an event choice is a gamble, a small spinner shows the slices before you pick and spins when you do. You see why it went how it went.
Lesson from spinner board games: visible odds make luck feel fair.
A spinner() SVG in ui.js; events with a p value pass it through; respects reduced motion.
No balance change; just shows the existing odds.

### i10-a20 A freezer full of fish, game and garden (M, 🟠)
Fishing, a hunting tag or a good garden fills the freezer, which cuts the grocery bill until it runs out. It only holds so much, and a power outage can spoil some of it.
Lesson from trail games where you could hunt far more than you could carry.
S.freezer (0–100) in state.js; filled by outdoors weeks and licenses; lowers the grocery line in weekTick; a Life tab bar.
Capped, so it saves maybe $40 a week at best. Needs outdoor weeks to refill.

### i10-a21 Pick your pace on winter roads (S, 🟠)
On snowy or icy weeks you choose how to drive: slow and steady, which costs a little happiness and time, or normal pace, which raises the chance of the ditch.
Lesson from trail games where you set pace and live with the risk.
A winter-only toggle on Home; ditch odds in turn.js read it with ditchMult().
Slow is the safe default for Auto; normal pace saves a bit but costs more on average. Snow tires still help.

### i10-a22 The washed-out road (S, 🟡)
After a spring storm, the back road you use is under water. Take the long way (gas and time), wait a week, or try the crossing and maybe stall the truck.
Lesson from trail games' river crossings with three plain choices.
A spring event in events.js for commuters and farm workers.
Risky choice has negative expected value; waiting is safe but slow.

### i10-a23 Trade work with neighbors instead of cash (M, 🟠)
Swap what you're good at for what you need: fix a neighbor's truck for a month of haircuts, or put up a fence for a side of beef. Offers show up based on your skills.
Lesson from trail games' trading posts.
BARTER offers in features.js keyed to SKILLS levels; a sheet from the bulletin board pin.
Trades cost a hustle week and replace money, not add to it. Needs real skill levels.

### i10-a24 Notes in the little free library (S, 🟠)
The book box on Main Street has notes folks leave inside. When you're low you can read one for a small lift, and once a season you can leave your own, picked from a few kind lines, for a bit of community.
Lesson from games built around kind anonymous letters, done offline with written notes.
NOTES list in outabout.js; a stop on the library pin.
Each note helps once; leaving one is once a season. Tiny effects.

### i10-a25 Ask the town for help (M, 🔴)
When things go badly, like a fire, a layoff or a hospital stay, you can post on the town message page asking for help. What comes back depends on your community standing: meals, a spare room, a fundraiser.
Lesson from kindness games: the people you showed up for show up for you.
An option in hospital, debt and disaster events (events.js); payout scales with S.community; uses up some of it.
Only pays if you built standing. Careless and idle lives get little; it can't be used more than once a year.

### i10-a26 A corkboard of thank-you cards (S, 🟡)
Each time you help someone, a thank-you card goes on a corkboard in your kitchen on Home. Tap one to read it again.
Lesson from kindness games where replies pile up in your room as keepsakes.
S.thanks list filled in event outcomes; a small board in ui.js.
Keepsake only, no score.

### i10-a27 Walk a trail to the top (M, 🟡)
Pick a long trail in the Blue Mountains. Each week outside moves you one stretch along it on a small trail map, with a line about what you see. At the top you get a view card and a lasting calm.
Lesson from gentle hiking games where the goal is just to get to the top.
TRAILS in features.js; progress in S.trail; a trail strip on the outdoors focus card.
Lasting perk is small (+1 happiness a month for a year). Needs 10–15 outdoor weeks spread out.

### i10-a28 Spots you only find by wandering (S, 🟠)
Get-outside weeks have a small chance to turn up a spot that isn't on any list: a swimming hole, an old orchard, a ridge with a view. Once found, it becomes a pin you can go back to.
Lesson from exploration games that reward curiosity with hidden places.
HIDDEN_SPOTS in maps.js, found in the outdoors focus; S.found keeps them across lives.
A found spot gives a fresh-place bonus, then fades like other repeats.

### i10-a29 Set your prices at your business (M, 🟠)
If you run a business, each week you can set prices low, fair or high. Low brings more customers but thin money; high brings fewer, and the weather and season change how many come.
Lesson from street-vendor games where pricing each day is the job.
S.biz.price in features.js bizWeek(); weather and month adjust demand.
Fair is the default for Auto. Smart pricing earns maybe 10% more, not a jackpot.

### i10-a30 When two things want the same evening (M, 🟡)
Sometimes two things land on the same evening: a kid's game and a late shift, or a friend's birthday and the council meeting. You pick one, and the one you miss remembers.
Lesson from small-life games where fixed times clash.
A clash event in events.js built from family, job and roles in state.
Both sides have a real payoff, so there's no right answer; skipped sides cost a little later.

### i10-a31 A town history rolled at the start (L, 🟡)
Each new game rolls a short history for the Burg: a flood year, a fire, who built the old mill, a famous wheat harvest. Events and old-timers refer back to it, so every town feels lived in.
Lesson from world-building games that generate history before you play.
A seeded generator in features.js writes S.history (8–12 entries); event text uses fill-in slots; a page in the almanac.
Flavor only. Real dates and places stay real; only invented details change.

### i10-a32 Each place to live has a feel (S, 🟠)
Every place you can live has one trait: the creek-side rental makes Get outside better, the Main Street apartment makes Show up for town better, the farmhouse has more chores.
Lesson from life sims where each lot has a trait.
A trait field on each housing option in state.js; read by focusEffect().
Each trait has a matching cost (rent, chores), so no home is simply best.

## Ideas 10: Wild cards

Surprising, funny and ambitious ideas: rare events, local secrets, odd jobs and other eras, still built on the game's systems.

### i10-b01 A rare-events pool and a 'Once in a lifetime' page (S, 🔴)
A separate pool of very rare events (about 1 in 400 weeks each, once per life) with a badge-book page of ??? slots you fill across lives.
Each rare event is flavor first: a story, a memory, a badge. Players compare who has seen what.
Touches: events.js (new RARE list, rolled after the normal category roll), features.js (BADGES page), state.js (S.rareSeen + a cross-life store key).
Balance: No rare event pays more than a small one-time amount, so it can't lift careless or idle medians.

### i10-b02 The ghost at the old brick hotel (M, 🔴)
A four-part story over a few months: lights in the shut upper floor of the old hotel on Main, a cold room, a name scratched in a window. You can dig in or leave it alone.
Clues come from library and Main Street weeks. The ending is gentle and real-world: an owl, old pipes, and a 1912 guest whose story you can tell the historical society.
Touches: features.js STORY_EVENTS + chainSet; outabout.js (Main Street stop unlocks the next part); Tattler log line.
Balance: Needs active focus weeks to progress, so Auto and idle never see the end. Payoff is community +3 and a badge.

### i10-b03 The mill bell mystery: a town puzzle over years (L, 🔴)
Who rang the old flour-mill bell at 3 a.m. in 1919? Clues turn up over years: a ledger page, a photo, an old-timer's story. Put them together on a clue card and name the answer.
Clues are spread across library, Main Street, fairgrounds and the Tattler. You can guess early; a wrong guess just costs a little pride.
Touches: features.js (new MYSTERY with clue flags), events.js (clue events), outabout.js (clue stops), ui.js (Clue card on Home), help.js.
Balance: Solving gives community and a once-only badge, no money. Clues need varied focus weeks, which careless and idle players don't do.

### i10-b04 Strange gigs on the bulletin board (M, 🔴)
Odd one-week jobs: goat herding for weed control, rodeo-clown fill-in, corn-maze cutter, pet-sitting a 30-year-old parrot, mystery shopper in Walla Walla.
Each gig is a short card with a pay range and one twist. Pick one a month at most.
Touches: maps.js bulletin board pin, turn.js (gig week), events.js (one funny result each), features.js skills (some gigs give practice).
Balance: Pay is modest and costs the week's focus; no gig beats steady work over a year.

### i10-b05 Northern lights over the wheat (S, 🟠)
A rare night when the aurora shows over the Blues. Wake the house and drive out to the fields, or sleep.
Going out gives a big happy bump and a memory line; next week's work is a little worse.
Touches: events.js RARE entry (Sept to March), turn.js (next week tired note).
Balance: One-time, small trade-off either way.

### i10-b06 Chase the eclipse (M, 🟡)
Once a life, a solar eclipse path crosses Oregon or Idaho. Plan a trip to totality on the region map, or watch the partial from the porch.
Planning ahead (gas, time off, a room) makes it go well; going last-minute means traffic and maybe clouds.
Touches: features.js trips (new far destination), maps.js region map path line, events.js reminder months ahead.
Balance: Costs money and a week. Pays only happiness and a badge.

### i10-b07 A meteorite in the stubble (S, 🟡)
A rock that doesn't belong turns up in a wheat field. Sell it to a collector, give it to the museum, or keep it on the shelf.
Each choice has a different payoff: some cash, community, or a keepsake that cheers you each year.
Touches: events.js RARE entry, keepsake shelf hook if built, state.js flag.
Balance: Cash option is capped near one month of bills. Truly rare, once in many lives.

### i10-b08 A hot-air balloon lands in your field (S, 🟠)
During the valley's spring balloon festival, a balloon comes down in your yard or a neighbor's pasture. Help pack it up, or yell about the fence.
Helping earns a free ride ticket the next year and a good story.
Touches: events.js (May, town), outabout.js (a ride offer later in the season).
Balance: Flavor plus small community. Funny, no money.

### i10-b09 Dust storm on Highway 12 (S, 🟠)
A wall of brown dust rolls across the road on a dry, windy day. Pull over and wait, or push on.
Pulling over is late to work; pushing on risks the truck and your health.
Touches: events.js road event (late summer, dry years), features.js ditchMult/tires.
Balance: Normal road-event odds; teaches a real eastern Washington hazard.

### i10-b10 Cattle loose on Highway 12 (S, 🟠)
A dozen steers are standing on the highway at dawn. Help the rancher, call it in, or drive around.
Helping makes you late but earns a favor and a side of beef offer.
Touches: events.js road event, named-neighbor hook if built.
Balance: Small, balanced trade-offs; repeats rarely.

### i10-b11 A film crew takes over Main Street (M, 🟠)
A movie crew rents Main Street for three weeks. Be an extra, rent them your house, or complain about parking.
Being an extra eats a week for small pay and a cameo you can see in the year review.
Touches: features.js STORY_EVENTS chain, outabout.js (Main Street changes while they're here), Tattler line.
Balance: Money is small and one-time. Once per life.

### i10-b12 Something in the Blue Mountains (S, 🟡)
A big footprint at Bluewood, or strange lights over the wheat (a satellite train). Report it to the Tattler or keep quiet.
Pure fun. The Tattler runs your quote either way.
Touches: events.js RARE entries, Tattler log line, badges ('Believer' or 'Skeptic').
Balance: No stats beyond a tiny happy bump.

### i10-b13 An arrowhead in the creek bank: do it right (S, 🟠)
Floodwater uncovers what looks like an old artifact. Leave it, photograph it and report it to the tribes and state, or pocket it.
Reporting earns community and a thank-you letter; pocketing it costs community if found out.
Touches: events.js (after high water), help.js 'Waitsburg for real' note on the law and respect.
Balance: Teaches respect for the Cayuse, Umatilla and Walla Walla peoples' history. No cash path.

### i10-b14 Dig day at the mammoth site (S, 🟡)
Volunteer a Saturday at a regional Ice Age dig. Sift dirt, find a tooth fragment, learn about the Missoula floods.
A fun day trip with a fact card for the album.
Touches: outabout.js (Tri-Cities stop, summer), features.js skills (Outdoors practice).
Balance: Costs gas and the week; pays happiness and a skill point.

### i10-b15 The old cornerstone box is opened (S, 🟠)
Workers find a box sealed in a Main Street building in the 1930s: letters, a newspaper, a ticket stub. Read them at the library.
Pairs with the time-capsule idea: you see what the town of the past hoped for.
Touches: events.js once-only town event, outabout.js library, almanac hook.
Balance: Flavor and a little community.

### i10-b16 The territorial charter vote (M, 🟠)
Waitsburg still runs under its old territorial-era charter. A council push to switch to a standard code comes up; speak at the meeting and vote.
A real local oddity played straight; both sides get fair arguments.
Touches: features.js council, events.js town event, help.js 'Waitsburg for real' note.
Balance: Neutral, no right answer for score; community for showing up.

### i10-b17 The stoplight debate (S, 🟡)
Somebody wants the town's first stoplight. The café splits, the Tattler prints letters, and the council asks you.
A funny small-town fight; your vote is remembered in a later headline.
Touches: events.js town event, council hook, Tattler letters if built.
Balance: Tiny community swings only.

### i10-b18 A key to a box nobody knew about (M, 🟠)
An old key in an inherited coat opens a forgotten safe deposit box. Inside: letters, a war bond worth a little, and a mineral-rights deed worth nothing.
Three steps across months; the letters tell a family story.
Touches: features.js chain, outabout.js bank stop, legacy (more likely in heir lives).
Balance: Money is a few hundred dollars at most, once.

### i10-b19 A letter about money the state is holding (S, 🟠)
The state's unclaimed property office says it has $212 in your name from an old deposit. Fill out the form, or toss it as a scam.
Real lesson: check the official site; the scam version asks for a fee.
Touches: events.js town event, pairs with the scam-text idea (teaches the difference).
Balance: Small, once.

### i10-b20 A world record on Main Street (M, 🟠)
The town tries for the longest pie table in the state. Bake, organize or just eat.
Organizing takes two focus weeks and can fail with rain; success gives a town-wide happy week.
Touches: features.js STORY_EVENTS chain around Celebration Days, outabout.js Main Street.
Balance: Community and happiness, no money; needs active planning.

### i10-b21 The demolition derby at the fair (M, 🟡)
Enter your old truck in the fair's derby. Soup it up, pick a driving style, and see what's left.
Wins give a trophy and bragging rights; you'll need a new truck either way.
Touches: features.js (vehicles), events.js fair week, outabout.js fairgrounds.
Balance: Costs your truck's value; prize is small. Only for trucks near the end.

### i10-b22 Count the town: census taker every ten years (S, 🟠)
In census years, a short federal job knocking on doors around the valley.
A few weeks of extra pay and many new names in town.
Touches: turn.js (seasonal job in years ending in 0), events.js (one funny door card).
Balance: Short and capped; costs the overtime focus.

### i10-b23 Santa suit season (S, 🟡)
The Grange needs a Santa for December. Wear the suit for the kids' night and the parade.
Big community and happiness; one kid pulls your beard.
Touches: events.js (December), family hooks (your own kids recognize you).
Balance: December only; small effects.

### i10-b24 A famous someone buys the house on the hill (M, 🟡)
A retired TV actor moves to town. The café talks of nothing else. Wave, ask for a favor, or leave them be.
Treating them like a neighbor pays off later: they host a library fundraiser.
Touches: features.js chain, named-neighbors hook, Tattler.
Balance: Fictional person only. Community payoff, no cash.

### i10-b25 Groundhog week (M, 🟡)
On February 2, a once-a-life prompt: 'Live this week again?' You replay it knowing what happened.
A wink at the movie; you can change your choice but the dice also re-roll.
Touches: turn.js (snapshot like the last-good copy), state.js flag, events.js.
Balance: Once per life; replay means fresh dice, so it can go worse.

### i10-b26 A dog's-eye week (S, 🟡)
Once, on your dog's birthday, the week's summary is told by the dog: the mailman, the creek, the cat.
Pure delight; nothing changes but a laugh.
Touches: ui.js week summary text, state.js pet data.
Balance: No stats.

### i10-b27 Sliding doors: the job you didn't take (M, 🟠)
On the ending screen, one paragraph about the life where you took the other offer you turned down.
Written from simple rules: the other job's pay, its drive, and one twist.
Touches: state.js (remember the biggest turned-down offer), ui.js ending, epilogue lines.
Balance: End-screen only; no score effect.

### i10-b28 Groundwork for era starts (M, 🟠)
One table of prices, wages, jobs and tech by year so the game can start in another era.
Needed before 1975 or 2050 starts. Today's game is just the default era.
Touches: state.js (era field), turn.js cost(), features.js job lists, tests/sim.test.mjs.
Balance: Sim runs each era so careless and idle targets still hold.

### i10-b29 Start in 1975 (big) (L, 🟠)
A life starting in 1975: cheap gas, no cell phones, the farm crisis of the 1980s, and life moving into today.
Prices and jobs shift by decade; Hanford and the wheat economy look different.
Touches: Era table, events.js era-only events, ui.js retro styling, help.js.
Balance: Same score targets via the sim; era events balance good and bad years.

### i10-b30 Ash falls on the valley: May 1980 (S, 🟡)
In 1975 lives, Mount St. Helens dusts eastern Washington with ash. Stay in, clean the gutters, protect the truck engine.
A real once-in-a-lifetime week from local history.
Touches: events.js era-only event, maps.js gray tint for a week.
Balance: One week; smart prep limits health and truck costs.

### i10-b31 Start in 2050 (big, speculative) (L, 🟡)
A light-hearted future Waitsburg: hotter summers, electric trucks, a robot combine to babysit, and remote work from the Grange hall.
Labeled clearly as made-up; plays the same core loop.
Touches: Era table, new jobs list, events.js era pool, help.js note that it's a guess.
Balance: Sim-checked like any mode; future perks offset by heat and cost.

### i10-b32 Honorary mayor for a day (S, 🟡)
Win the Celebration Days raffle and be mayor for a day: cut a ribbon, judge the pie, sign a silly proclamation.
A fun card with three silly choices and a photo for the album.
Touches: events.js (Celebration Days), raffle hook, Tattler line.
Balance: Community and happiness only.
