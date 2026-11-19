# Ideas round 28

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 28: Sports and recreation

Sports and recreation in and around Waitsburg: Friday nights, kids' leagues, adult rec play, golf, fishing, running, biking and watching the game with friends.

### i28-a01 One Activities card for leagues and seasons (L, 🔴)
One home for every sport idea, so softball, bowling and pickleball stop being one-off events.
Join from the Life tab; one activity at a time; each has months, a fee and a weekly effect (health, happy, a little community).
Touches features.js (new ACTIVITIES table and activityWeek), ui.js Life tab, turn.js weekTick, state.js migrate.
Balance: costs money every month, gives nothing in Work-extra weeks, and the bonus fades after 3 missed weeks, so idle play gains nothing and careless play pays fees for little.

### i28-a02 Friday night home games at the school field (M, 🔴)
A fall Out and about place with three visits: watch (happy), concessions (community, small cost of time), chain gang (community, People practice).
Only on home-game weeks, about every other week in fall; the co-op Cardinals play.
Touches outabout.js (new place and pin), maps.js (town map pin), events.js town news line.
Balance: uses the existing 2-visit and 3-points-a-stat weekly caps, so it cannot be farmed.

### i28-a03 Your kid plays Little League: fees, games and snack duty (M, 🔴)
Kid stage feature for March to June; fee plus glove and cleats once.
Game weeks give happy and a little community if your focus is Rest or Show up for town; skipped snack duty costs community.
Touches events.js (sign-up and snack duty events), state.js kids data (a sport flag per kid), turn.js weekly kid effects.
Balance: costs money and time; a Work-extra grinder gets less from it, so it rewards attention, not idling.

### i28-a04 Saturday youth soccer: the drive to Walla Walla fields (M, 🟠)
Kid sport for September and October with away fields in Walla Walla.
Gas cost each game week, or half with the parents' carpool (community 30+, like the work carpool).
Touches events.js, turn.js gas and kid effects, uses canCarpool-style rule.
Balance: real gas cost; the carpool rewards standing you earned, not idle play.

### i28-a05 Kids' activities as a line on the monthly bills (S, 🟠)
A "Kids' activities" bill line in the week strip and money sheet.
Adds up league fees, gear and game-day gas while a season runs.
Touches turn.js bills, ui.js money breakdown.
Balance: no new effect, it only makes existing costs visible.

### i28-a06 Pickleball at the park courts (M, 🟠)
Out and about place with two visits: drop-in game (health, happy) and the Saturday round robin (community, small fee).
Closed December to February.
Touches outabout.js places, maps.js town pin.
Balance: inside the weekly visit caps; the repeat-visit half rule stops spamming it.

### i28-a07 Nine holes on the Walla Walla city course (M, 🟠)
Trip stop, kind "Things to do", March to October.
Twilight price is lower; with a partner it counts as a date.
Touches features.js STOPS (new stop with when:inSeason).
Balance: costs gas and a stop slot; same TRIP_FX scale as other stops.

### i28-a08 Invited to the boss's charity scramble (S, 🟡)
Work event, May to September, needs a job and a few months in it.
Play: costs entry, small raise odds and community. Donate: costs less, a little community. Pass: nothing.
Touches events.js (work category).
Balance: the money cost means it is not a free raise; once a year at most.

### i28-a09 Kids' fishing derby at the stocked pond (S, 🟠)
Town event in May, only with kids under 15 or with community 40+ to help out.
Go: happy, health and a little community; biggest fish: a story line in the journal.
Touches events.js (town, when month 4).
Balance: once a year, small effects, free; nothing to farm.

### i28-a10 Opening day of trout season at the lakes (S, 🟡)
Town event in April; better if you have a fishing license (ties to the license idea) or the Outdoors skill.
Go: health and happy, a short line; no license: risk of a ticket.
Touches events.js.
Balance: once a year; the ticket risk punishes careless picks.

### i28-a11 Train for the Days fun run (M, 🟠)
Sign up in March; counts Get outside weeks March to May.
Finish time and a journal line; personal best saved per life.
Touches events.js (sign-up and race day), turn.js (count weeks), features.js badges.
Balance: needs steady weeks of a healthy focus; idle play gets the slow time and no bonus.

### i28-a12 A gravel ride through the wheat hills (M, 🟡)
Town event in April or May, needs health 40+.
Pace yourself: health, happy. Keep up: more health, but a chance of a sore week (health dip) if health is under 60.
Touches events.js; optional bike item on the Life tab.
Balance: the risky choice rewards being healthy, not being careless.

### i28-a13 Host a rest stop for a charity bike tour (S, 🟡)
Town event, June to August.
Volunteer: community and happy, costs the weekend. Skip: nothing.
Touches events.js.
Balance: small, once a year.

### i28-a14 Sunday football at your place (M, 🔴)
A Rest-week add-on during the football season (Seattle's pro team, no real names needed).
Host: costs snacks, gives community and happy. Bring a dish: smaller cost and effect. Alone: plain Rest.
Touches turn.js (Rest focus in season), events.js or a one-tap prompt, ui.js.
Balance: only on Rest weeks, capped once every 3 weeks, so it lifts real social play rather than idle skipping.

### i28-a15 A friend has two tickets to a Seattle ballgame (S, 🟡)
Town event, May to September, needs community 35+.
Go: costs money and the week, big happy. Pass: nothing.
Touches events.js.
Balance: real cost and once a year; no effect on pay.

### i28-a16 The ballgame on the radio on the drive home (S, 🟡)
Road weeks June to September, 20+ miles each way.
A small happy bump and a line in the week strip.
Touches turn.js commute effects.
Balance: tiny, and only for commuters, who already lose health on the drive.

### i28-a17 Lifeguard at the town pool: a summer gig (S, 🟠)
Seasonal gig: one class week in May, then side-hustle pay in summer.
Adds a pool lifeguard option to the summer GIGS line.
Touches state.js GIGS, features.js skill practice, events.js for the class.
Balance: same scale as other summer gigs; class week is a cost up front.

### i28-a18 Swim lessons for the kids (S, 🟠)
Town event in June with kids aged 4 to 12.
Sign up: fee, happy; later pool events give the kids more happy.
Touches events.js, state.js kid flags.
Balance: small cost, small reward, once a year.

### i28-a19 Play hurt or sit out: rec-league sprains (M, 🟠)
Event tied to the Activities card; odds rise with age and low health.
Play hurt: community, chance of a health hit and a clinic bill. Sit out: lose the bonus for 3 weeks.
Touches events.js, features.js activities.
Balance: makes sports a real trade-off, so they don't only add points.

### i28-a20 Ump Little League for spring weekend cash (S, 🟠)
Side-hustle option March to June.
Pays like other spring gigs, adds People practice, and a chance of an angry-parent event.
Touches state.js GIGS, events.js.
Balance: same pay scale as other gigs; the angry-parent event can cost community.

### i28-a21 Tryouts: your teen makes the team, or doesn't (S, 🟠)
Kid event at ages 14 to 17, fall or winter.
Odds better if you had Rest or Show up for town weeks; cut: a choice to comfort or push.
Touches events.js, state.js kids.
Balance: a family story beat, small effects.

### i28-a22 Senior night: your kid's last home game (S, 🟠)
Kid event at 17 to 18.
Go: big happy and community; miss it for work: pay, but a lasting journal line and less happy.
Touches events.js (once per kid).
Balance: a real choice between money and family, not a free bonus.

### i28-a23 The alumni game: suit up one more time (S, 🟡)
Town event in winter.
Play: happy, community, a chance of a sore week if health is low. Clock: community. Stands: a little happy.
Touches events.js.
Balance: once a year; the risk scales with health.

### i28-a24 The Days softball tournament (S, 🟡)
Town event in May, tied to the Activities card.
On a team: chance to win based on weeks played; watch: happy.
Touches events.js, features.js activities.
Balance: the win needs steady play; trophy is a journal line and badge, not points.

### i28-a25 A basketball hoop over the garage (S, 🟡)
Life tab purchase for homeowners.
Rest weeks: small health; kids: small happy.
Touches ui.js Life tab, turn.js Rest effects, state.js.
Balance: one-time cost; the bonus is small and only on Rest weeks.

### i28-a26 Sledding the hill by the school (S, 🟡)
Town event in December to February, a snow week.
Go: happy and health; with kids: more happy.
Touches events.js.
Balance: once a winter, free, small.

### i28-a27 A disc golf round in Walla Walla (S, 🟡)
Trip stop, March to October, low cost.
Small health and happy.
Touches features.js STOPS.
Balance: same scale as other cheap stops.

### i28-a28 Badges for a full season (S, 🟡)
Badges count a season played or a race finished.
Show on the badges sheet; can be picked as a goal.
Touches features.js BADGES.
Balance: badges give points only as chosen goals, which are already capped.

### i28-a29 Talk sports at the coffee counter (S, 🟠)
Coffee shop visit option during school sports seasons.
Small community and People practice.
Touches outabout.js (coffee place), features.js practice.
Balance: inside the weekly visit caps.

### i28-a30 A sporty bot in the balance sim (S, 🔴)
A new bot in the play-test simulation that joins every activity it can.
Checks careless stays at or under 60 and idle at or under 50 with sports turned on.
Touches tests/sim.test.mjs.
Balance: this is the balance check itself.

## Ideas 28: Digital life in a small town

Ideas for how phones, internet and the town page change life in Waitsburg, all inside the game's world.

### i28-b01 Home internet: phone hotspot, tower wireless or satellite (M, 🔴)
- Adds S.net ('hotspot'|'tower'|'sat') with a monthly bill in turn.js and a picker in ui.js household rows.
- Study focus and remote days get a speed factor (0.8 / 1 / 0.95, satellite drops in snow).
- Separate from i13-b06: this is your own plan before and after any town fiber project.
- Balance: the default (hotspot) is the cheapest and slightly worse, so careless play gains nothing; good play pays for a fit.

### i28-b02 No bars at the farmhouse: the missed callback (S, 🟠)
- New events.js event with when:() => S.home === 'farm' && !S.booster.
- Missed callback can drop one pending job application (ties into the apply-and-wait system if built).
- Booster is a one-time buy in the event's choices.
- Balance: a real trade on the farmhouse's +3 happy, not a big swing either way.

### i28-b03 Study in the library parking lot (S, 🟠)
- A toggle on the study focus in ui.js when S.net is 'hotspot'.
- turn.js: study progress full, happy -1 in November–February.
- Balance: it costs comfort, so it's a fix for broke players, not a free boost.

### i28-b04 Online classes or the drive to Walla Walla (M, 🔴)
- Adds S.studyMode; turn.js applies gas for in-person (2 trips a week to Walla Walla) and a 12% 'fell behind' chance online (progress 0.5 that week).
- Rest and kids at home raise the fell-behind chance; good internet lowers it.
- Balance: neither mode is strictly better, and idle players don't study at all.

### i28-b05 The town page: a weekly scroll of posts (L, 🔴)
- New js/townpage.js (or a section in features.js) with a post bank keyed by month and events.
- Posts can hint at coming events (like café gossip, i4-a32) but about 1 in 4 hints is just a rumor.
- Several ideas below (comment fights, lost dog, swap page, firewood scam) post here.
- Balance: reading is free and optional; acting on a wrong rumor costs a little, so careless play can't farm it.

### i28-b06 Wade into a comment fight on the town page (S, 🟠)
- events.js event with three choices; posting rolls community ±3 based on S.community.
- Messaging privately is the safe +1 path; scrolling past has no effect.
- Balance: small swings, average close to zero for random picks.

### i28-b07 Share the lost dog post (S, 🟡)
- events.js event; driving costs gas and a little time, 40% chance you find it.
- Finding sets a friend flag that lowers the next 'need a hand' event cost.
- Balance: costs real money and time for a modest, delayed reward.

### i28-b08 Order it online or buy it on Main Street (S, 🟠)
- events.js event, cost(...) prices; online path has a 15% damaged-in-shipping follow-up.
- Buying local adds community +1 and a 'regular' tally that feeds i26-b29 if built.
- Balance: money vs community trade, no clear winner.

### i28-b09 Packages wait at the post office (S, 🟡)
- Yearly $90-ish bill in turn.js; December event about the holiday line.
- Chatting with the clerk is a small community +1 in the event.
- Balance: flavor with a small cost; no score impact beyond that.

### i28-b10 Rest week: phone in a drawer or scrolling (M, 🔴)
- S.restPhone toggle on the rest focus in ui.js; turn.js: scrolling gives happy +3 / health +2 instead of +4 / +4.
- Auto play and idle default to scrolling, so idle scores a bit lower.
- Balance: directly helps the idle <= 50 target; good players get the full rest by choosing it.

### i28-b11 Phone-free month challenge (S, 🟡)
- Add to SCENARIOS / challengesSheet in features.js; checks S.restPhone and focus history.
- Badge 'Logged off' in BADGES.
- Balance: challenges don't change the score itself.

### i28-b12 Streaming subscriptions creep up (M, 🔴)
- S.subs in state.js; free-trial events in events.js add $8–$16 if you don't cancel within 4 weeks.
- Shown in the household bills on the Money tab.
- Balance: careless players drift into $60+ a month; attentive players keep it small. Lowers careless median a little.

### i28-b13 Movie night at home instead of the drive (S, 🟡)
- A home option in events or a 'night in' row on the community focus.
- fx: happy +2, partner/friend bond +1; needs any internet.
- Balance: a modest, cheap option; doesn't beat a real night out.

### i28-b14 The rivalry game cuts out in the snow (S, 🟡)
- Winter events.js event tied to S.net; the tavern choice costs $20 and gives community +2.
- Links to the Dayton rivalry game idea (i12-a03) if built.
- Balance: small and seasonal.

### i28-b15 Your kid's first phone (M, 🔴)
- Adds per-kid phone setting in S.kids (or a parallel array); event fires at age 11.
- Smartphone: +$25/mo, happier kid, more chance of the group-chat and screen-time events; none: kid sulks some weeks.
- Balance: no choice is free; good play is matching it to your money and time at home.

### i28-b16 The middle-school group chat drama (S, 🟠)
- Chain event using chainSet in features.js after the first-phone choice.
- Talking it through needs a week at home (rest or community focus) for the best result.
- Balance: rewards being present, not spending.

### i28-b17 Remote day bloopers (S, 🟡)
- events.js flavor event when remote days are in use (remote jobs from J28).
- Small happiness or boss-mood effects; the library choice costs a little gas.
- Balance: tiny swings; adds texture to remote days without new remote rules.

### i28-b18 The windstorm takes the internet too (S, 🟠)
- Extends the existing 'Windstorm' event in events.js with a follow-up week.
- Helping costs a week's focus effect but gives community +3; remote workers lose remote days that week.
- Balance: a small, fair cost with a community upside for good play.

### i28-b19 Prescriptions by mail (S, 🟡)
- Toggle on the health/appointments area; winter events.js chance of a late refill.
- Saves one errand trip of gas a month.
- Balance: cheaper but with winter risk; distinct from the video-visit idea.

### i28-b20 A buyer overpays for your old truck (S, 🟠)
- events.js event when you sell or replace a vehicle; ties to the scam-signs card (i18-b11) if built.
- Refunding costs about $1,500; meeting in person in the grocery parking lot is the safe path.
- Balance: careless picks lose money; it's a lesson, not a trap with no tell.

### i28-b21 Too-cheap firewood on the town page (S, 🟠)
- Fall events.js event, posts on the town page if built.
- Asking around needs community >= 30 to reveal the scam.
- Balance: rewards community and caution.

### i28-b22 Neighbors post about your side hustle (M, 🟠)
- Adds S.hustleRep in features.js skillWeek; boosts gig pay up to 10%.
- Rep rises with steady hustle weeks and good health, falls on low-health weeks.
- Balance: helps steady, healthy players; overworked hustlers lose it.

### i28-b23 Sell the garage clutter on the swap page (S, 🟡)
- Spring events.js event; cash scales with years played (cost(150)–cost(600)).
- Ties to the home inventory idea (i18-b07) if built.
- Balance: small one-time cash, capped once a year.

### i28-b24 The Tattler moves mostly online (S, 🟡)
- A town ledger event (i13-b01) with a yearly subscription choice.
- Paying adds community +1 a year; free online slightly raises scam-event odds.
- Balance: flavor with a tiny trade.

### i28-b25 Snow week: school sends kids home with laptops (S, 🟠)
- Winter events.js event when kidsAtHome() > 0.
- Choices: take a day off (pay -1 day), pay a sitter, or a grandparent helps if community is high.
- Balance: hits careless parents with no plan; good players can lean on community.

### i28-b26 Late-night online games with old friends (S, 🟡)
- A rest-week sub-option next to the phone choice; repeated weeks add health -1.
- Counts as keeping in touch for any 'friends drift' system.
- Balance: fades with repeats like every focus, so it can't be farmed.

### i28-b27 Post a Touchet sunset photo (S, 🟡)
- Outdoors focus note in turn.js; Journal entry via log().
- Happy +1; posting adds community +1.
- Balance: only on Get outside weeks, which already cost money.

### i28-b28 Screen time vs time outside on the end screen (S, 🟡)
- Count weeks in turn.js (S.screenWeeks, S.outWeeks); show in finish() in features.js.
- No score effect, just reflection.
- Balance: none; pure feedback.

### i28-b29 Sign up for county alert texts (S, 🔴)
- Event early in the game sets S.alerts; windstorm and flood events check it and cut damage by half.
- Needs a phone, which everyone has.
- Balance: a small free choice that rewards paying attention, not idling.

### i28-b30 The cell tower vote (M, 🟠)
- A town ledger event with a vote; the town's choice changes signal for everyone (farmhouse missed calls stop, hotspot gets better).
- Speaking costs a community week and swings community ±2 by side.
- Balance: changes the whole town, not your score directly.

### i28-b31 Be the town's tech helper (M, 🔴)
- New GIGS entry 'tech help' in state.js available all year once you have an associate degree or a 'helped a neighbor' flag.
- Pay below other gigs but no health cost; helping free gives community +2.
- Balance: a gentler hustle that suits good, steady players; only unlocks by doing it.

### i28-b32 Help a parent with their tablet (S, 🟡)
- events.js family event; driving costs gas and a week's focus effect, phone path is a coin flip.
- Leads to the scam-signs card if a pop-up turns out to be a scam.
- Balance: small, family-flavored; rewards showing up.
