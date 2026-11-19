# Ideas round 30

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 30: Bundles and release plans

A third set of build bundles covering rounds 25–29 (none already in round 19 or 25 bundles), plus three release plans that order the strongest bundles from all three bundle rounds into v0.3, v0.4 and v0.5.

### i30-a01 Bundle: Bug-fix sweep: the Out and about playtest (M, 🔴)
Fix what the newest playtest found: the $300 will finally reaches the grandkid (no will means probate takes 10%), free and $12 visits stop carrying an idle life, traffic school works once every 3 years, under-21 players get all-ages options at the tasting room and wine bar, a What's new list ships for this version, and the sim gets idle and careless visitor bots.
Covers: i26-b03, i26-b02, i26-b01, i26-b06, i26-b05, i26-b04, i26-b22, i26-b23.
One design: One pass over the visit and ending code: the will fix and heir names live in finish()/startLegacy, the visit caps share one 'once every N weeks' helper, and a release test checks WHATS_NEW matches VERSION.
Files: features.js (finish, startLegacy, heir names), outabout.js (farm counter, Shop local, age gates), events.js (speeding ticket, Celebration Days window), ui.js (WHATS_NEW), tests/sim.test.mjs, tests/rules.test.mjs.
Balance: Pulls the idle visitor back under 50 and removes a free choice in the ticket event; good play is unchanged.

### i30-a02 Bundle: Cozy mode (L, 🔴)
A third start mode at normal pace with softer landings: big bills split into four weekly pieces, never two rough weeks in a row, a month's notice before layoffs, health scares stay scares, and contentment weighs more in the score. It is explained next to Relaxed on the start sheet and the balance sim plays it too.
Covers: i25-b01, i25-b02, i25-b04, i25-b05, i25-b06, i25-b07, i25-b31, i25-b32.
One design: One S.mode='cozy' flag read by a small softLanding() helper in turn.js and events.js, so each rule is one line, not a fork.
Files: state.js (mode), turn.js (bill split, rough-week guard), events.js (layoff notice, health), features.js (score weights), ui.js (start sheet), tests/sim.test.mjs.
Balance: Cozy keeps its own best-score table, and the sim holds careless and idle Cozy lives to the same ceilings.

### i30-a03 Bundle: Kind words and small kindnesses (M, 🟠)
Quiet weeks get a kind line instead of nothing, the recap names three small good things, and setbacks use gentler wording. Neighbors trade a casserole dish, too much zucchini and holiday baking, and you can keep a small-gift shelf and write a thank-you note.
Covers: i25-b08, i25-b09, i25-b10, i25-b17, i25-b18, i25-b19, i25-b29, i25-b30.
One design: Text comes from one small pool keyed by week type and season; the gift items are one list on the Home card that events read and write.
Files: events.js (dish, zucchini, baking, thank-you), turn.js (quiet-week line, three good things), ui.js (gift shelf on Home).
Balance: Gifts cost a little time or food money and give small community points with a per-season cap, so spamming them does not score.

### i30-a04 Bundle: Calm moments through the year (M, 🟠)
Sit on the porch and see who walks by, watch the creek at dusk, snow on Main Street, rain on the roof, soup weather and a winter Hunker down focus. Each moment is saved to a quiet moments album.
Covers: i25-b11, i25-b12, i25-b13, i25-b14, i25-b15, i25-b23, i25-b24, i25-b28.
One design: One table of calm moments with month and weather keys, fired from the Rest focus or as weekly flavor, written to one album list.
Files: events.js (moment table), turn.js (Rest focus hook), features.js (album), ui.js (album sheet).
Balance: Moments restore a little happiness only on weeks you chose rest; they never replace work or bills, so idle play gains nothing.

### i30-a05 Bundle: A valley culture calendar (M, 🔴)
Put the valley's cultural events in one data table with community readers checking each scene: Día de los Muertos altars, fiestas patrias, a tamalada, a quinceañera invitation, the Walla Walla mercado and a summer Pride picnic.
Covers: i26-a28, i26-a29, i26-a03, i26-a05, i26-a11, i26-a04, i26-a02, i26-a27.
One design: Events are rows in one CULTURE_CAL table (month, place, cost, text, reader credit) so new ones are data, not code.
Files: events.js (table and picker), outabout.js (mercado stop), help.js (reader credits), docs/npc-submissions.md.
Balance: Each event fires at most once a year and gives modest community and happiness; attending costs a day or gas.

### i30-a06 Bundle: Day trips to learn the valley's history (M, 🔴)
Day trips to Tamástslikt, Whitman Mission (told from both sides), the pioneer village and a public powwow as a guest, with Mission and Pendleton on the region map, a 'Whose homeland this is' Help page and Learned something badges.
Covers: i26-a01, i26-a18, i26-a19, i26-a24, i26-a20, i26-a23, i26-a30.
One design: Every trip is an outabout destination with a cost, a travel day and a short text; badges count distinct trips.
Files: outabout.js (trips), maps.js (region pins), help.js (homeland page), features.js (badges).
Balance: Trips cost gas and a day; badges reward variety, so repeating one cheap trip earns nothing.

### i30-a07 Bundle: Ana, the crew and two languages (M, 🟠)
A year-long story with Ana, the orchard crew lead: heat rules, tutoring for the citizenship test, a coworker's ceremony and forklift-for-Spanish lessons. Spanish radio, hello in two languages and Saturday story time grow a small Spanish skill.
Covers: i26-a07, i26-a08, i26-a09, i26-a10, i26-a32, i26-a13, i26-a14, i26-a31.
One design: A story chain with step flags in S.story.ana; the Spanish skill is one more track on the Skills card that some lines check.
Files: events.js (chain, heat rules), features.js (Skills track), turn.js (radio on commute), outabout.js (library).
Balance: The skill grows slowly and opens kinder text and a few better choices, never raw money.

### i30-a08 Bundle: Visits that pull their weight (M, 🟠)
Pricey visits do something cheap ones can't, the Little Kiss takes reservations, every good deed costs a little, and business and commute events fire once a season or once a year. One-button events get a second choice, the audiobook choice stops being a fake pick, and snapping at a customer goes in your file.
Covers: i26-b07, i26-b08, i26-b09, i26-b10, i26-b13, i26-b14, i26-b15, i26-b16.
One design: Add per-event cooldowns (evCd) and a cost field to every 'good deed' choice in one pass over events.js and outabout.js.
Files: outabout.js (visit tiers, reservations), events.js (cooldowns, second choices, audiobook, customer), features.js (job file).
Balance: Removes free positives and repeat filler, which mostly helped careless lives.

### i30-a09 Bundle: Working in town (M, 🟠)
Staff perks where you work in town, better coverage that covers the clinic, work events shown on your workplace pin, lift operators driving the Bluewood road with a pass sale at Dayton, and the cost of weekday-only places for commuters. Adds a summer lifeguard gig and a fisheries restoration tech job with the tribes.
Covers: i26-b18, i26-b17, i26-b19, i26-b11, i26-b12, i26-b27, i28-a17, i26-a22.
One design: Perks and the two new jobs are rows in the job table with a perk field the week tick reads.
Files: state.js (job table), turn.js (perks, commute half-day), maps.js (workplace pins), outabout.js (Dayton stop), events.js (Bluewood road).
Balance: Perks are small and tied to holding the job; the seasonal gig pays less than a full job.

### i30-a10 Bundle: Dev panel: odds, previews and diffs (M, 🔴)
In ?dev=1 see each event's real chance this week and why others won't fire, preview an event and roll it back, see a save diff after End Week, pin a moment to return to, and paste a save into a save doctor. Dev-touched lives are flagged out of best scores, mistakes show on screen, and a bug code replays to the exact week.
Covers: i27-a01, i27-a02, i27-a03, i27-a04, i27-a27, i27-a29, i27-a26, i27-a05.
One design: All tools hang off one snapshot()/restore() pair on S, which powers preview, pin, diff and replay.
Files: features.js (dev panel), state.js (snapshot, dev flag, input log), turn.js (seeded replay), ui.js (menu 'Copy bug code').
Balance: Dev-flagged lives never count, so tools can't be used to farm scores or badges.

### i30-a11 Bundle: Content lints (M, 🔴)
Tests catch hand-typed dollars that skip cost(), button prices that don't match the charge, events without a real map pin, choices that write no journal line, big swings with no tag, season words in the wrong month, Help text that disagrees with data, and a new-event starter that passes all of it.
Covers: i27-a08, i27-a09, i27-a10, i27-a12, i27-a14, i27-a15, i27-a32, i27-a31.
One design: One rules.test.mjs pass loads the event list and runs each check as a small function; the starter is a template that already passes.
Files: tests/rules.test.mjs, events.js (fixes found), help.js, maps.js.
Balance: No balance change by itself; it stops price drift that quietly made late-game choices too cheap.

### i30-a12 Bundle: Balance dashboard and sim bots (L, 🔴)
The sim writes sim-report.json and a dashboard draws it; each PR gets a balance diff table. Adds per-bot score breakdowns, a jobs report, ceiling headroom and event coverage, plus a sporty bot and a check that creative payoffs come only from finished work.
Covers: i27-a06, i27-a07, i27-a18, i27-a19, i27-a22, i26-b26, i28-a30, i29-b34.
One design: Every bot writes the same row shape, so the dashboard, PR diff and headroom line are all views of one file.
Files: tests/sim.test.mjs, tools/dashboard.html, CI workflow.
Balance: This is the guard rail: careless <= 60, idle <= 50, good >= 70 checked on every change.

### i30-a13 Bundle: Tuning in one file and a faster sim (L, 🟠)
All balance numbers move to one tuning file you can override from the command line, a fast sim runs without a browser, and the same data drives prices across the decades, a choice outcome table, an event catalog page, content counts by season and place, and a size and speed budget the tests enforce.
Covers: i27-a24, i27-a23, i27-a25, i27-a30, i27-a13, i27-a16, i27-a17, i27-b30.
One design: Separate pure rules from the DOM so node can import them; the catalog and tables are generated from that.
Files: new js/tuning.js, state.js, turn.js, events.js, tests/sim.test.mjs, tools/.
Balance: Makes tuning faster and safer; no direct balance change.

### i30-a14 Bundle: Roadmap and the Seasons calendar (M, 🔴)
Name the next versions (People, Seasons, Towns) with one big thing each and a 'not building' list, decide the license, then start Seasons with a real-year calendar file updated every January, a first seasonal drop for Celebration Days in May 2027, and drops that stay as reruns.
Covers: i27-b01, i27-b02, i27-b29, i27-b28, i27-b14, i27-b15, i27-b16, i27-b17.
One design: The calendar is one data file keyed by real dates; the game reads it and falls back to normal events when it is missing.
Files: README.md, new js/calendar data, events.js (drop events), release checklist.
Balance: Drops are flavor and small rewards, held to the same once-a-year caps as other events.

### i30-a15 Bundle: One town file (L, 🟠)
Move Waitsburg's places, names and numbers into one town file, give every save its home town, find hard-coded 'Waitsburg' text, split engine and content folders, and add a new-town checklist. The town layer is one switch, off by default, and the sim plays every edition before it ships.
Covers: i27-b03, i27-b04, i27-b05, i27-b06, i27-b07, i27-b18, i27-b19, i27-b12.
One design: S.town points at a town object; text uses town.name, and Waitsburg stays the only town until another passes the checklist.
Files: new js/towns/waitsburg.js, state.js, events.js, maps.js, outabout.js, tests/sim.test.mjs.
Balance: No gameplay change for players; each future town must clear the same sim ceilings.

### i30-a16 Bundle: Written with the community (M, 🟠)
A community-written chapter about the year the elevator closed, writing nights at the library, a paper form for NPC ideas, credits shown inside the moment, a school event pack each spring, and a historical-society check before history ships.
Covers: i27-b21, i27-b22, i27-b23, i27-b24, i27-b25, i27-b26.
One design: Submissions land in docs/npc-submissions.md and become event rows with a credit field the sheet shows.
Files: docs/npc-submissions.md, events.js (credit field, chapter chain), help.js (credits).
Balance: Community content goes through the same lints and sim checks as anything else.

### i30-a17 Bundle: One Activities card for leagues (L, 🔴)
One Activities card lists what's in season: pickleball, nine holes in Walla Walla, the Days softball tournament, the fun run and a gravel ride, with play-hurt-or-sit-out sprains, full-season badges and sports talk at the coffee counter.
Covers: i28-a01, i28-a06, i28-a07, i28-a24, i28-a11, i28-a12, i28-a19, i28-a28.
One design: Each activity is a row with season, cost, time and stat effects; joining sets a weekly commitment the turn reads.
Files: new Activities card in ui.js, turn.js (weekly commitment), events.js (sprains, coffee talk), features.js (badges).
Balance: Activities cost time and fees and help health and community; the sim's sporty bot must stay under the careless ceiling when it skips work.

### i30-a18 Bundle: Kids in sports (M, 🔴)
Your kid plays Little League (fees, games, snack duty), Saturday soccer means the drive to Walla Walla, swim lessons, tryouts, senior night, and you can ump for spring cash. Fees show as a line on the monthly bills and you can ask the coach about the fee.
Covers: i28-a03, i28-a04, i28-a05, i28-a18, i28-a21, i28-a22, i28-a20, i29-a25.
One design: Kid activities hang off the existing kid record with a sport field and a monthly fee in the bills list.
Files: features.js (kids), turn.js (bills), events.js (tryouts, senior night, coach), ui.js (Money tab line).
Balance: Real costs in fees and gas; the payoff is kid happiness and memories, not money.

### i30-a19 Bundle: Game days and the outdoors (M, 🟠)
Friday night home games, Sunday football at your place, the ballgame on the radio, the alumni game, opening day of trout season, a kids' fishing derby and salmon coming back to the Touchet.
Covers: i28-a02, i28-a14, i28-a16, i28-a23, i28-a10, i28-a09, i26-a21, i28-a29.
One design: Seasonal events and outabout stops keyed by month; hosting football uses the existing friends list.
Files: events.js, outabout.js (pond, lakes, Touchet), turn.js (radio on commute).
Balance: Each fires once a season with small community or happiness; hosting costs food money.

### i30-a20 Bundle: Home internet and online classes (M, 🔴)
Pick home internet (hotspot, tower wireless or satellite); it shapes online classes versus the drive to Walla Walla, missed callbacks, study in the library lot, snow-week school laptops and windstorm outages. Sign up for county alert texts, and vote on the new cell tower.
Covers: i28-b01, i28-b04, i28-b02, i28-b03, i28-b25, i28-b18, i28-b29, i28-b30.
One design: One S.net tier read by class, remote-day and outage events; alerts are a one-time flag that softens flood and storm events.
Files: ui.js (Money tab choice), state.js, turn.js (classes), events.js (outages, alerts, tower vote).
Balance: Better internet costs more every month; the gain is fewer bad class weeks, not free money.

### i30-a21 Bundle: The town page (L, 🔴)
A Town page card on Home shows 3–4 posts a week: lost dogs, comment fights, too-cheap firewood and an overpaying truck buyer (scams), neighbors posting about your side hustle, and older neighbors asking you to be their tech helper or fix a parent's tablet.
Covers: i28-b05, i28-b06, i28-b07, i28-b20, i28-b21, i28-b22, i28-b31, i28-b32.
One design: Posts are rows with a weight and an optional choice; useful ones give tips, scam ones test caution, helper requests open a small gig.
Files: ui.js (Home card), events.js (post pool, scams), features.js (tech-helper gig).
Balance: Reading is free but choices cost time; scams punish careless taps, so careful players gain.

### i30-a22 Bundle: Screens at home (M, 🔴)
Rest can mean phone in a drawer or scrolling, a phone-free month challenge, streaming subscriptions that creep up until you audit them, movie night at home, late-night games with old friends, your kid's first phone and group-chat drama, and screen time versus time outside on the end screen.
Covers: i28-b10, i28-b11, i28-b12, i28-b13, i28-b26, i28-b15, i28-b16, i28-b28.
One design: Track one S.screens number fed by rest choices; the subscriptions line is a growing bill with a yearly audit event.
Files: turn.js (rest sub-choice), state.js, events.js (kid phone, audit), features.js (end screen line).
Balance: Scrolling rests less and fades with repeats, and subscriptions drain idle players who never audit.

### i30-a23 Bundle: Shopping, mail and the monthly bills (M, 🟡)
Order online or buy on Main Street, packages that wait at the post office, prescriptions by mail, shop local instead of the big-store run, budget billing for the winter heat bill, benefit dollars that go twice as far at the farmers market, the coverage renewal letter, and rent-to-own versus the rummage sale.
Covers: i28-b08, i28-b09, i28-b19, i26-b28, i29-a10, i29-a11, i29-a12, i29-a19.
One design: Each is a small choice on an existing bill line or shopping visit; budget billing spreads the heat bill evenly across months.
Files: turn.js (bills), outabout.js (Main Street, post office, market), events.js (renewal letter, rent-to-own).
Balance: Rent-to-own costs far more; missed renewal letters hurt careless players; nothing adds free money.

### i30-a24 Bundle: Back on your feet after a layoff (M, 🔴)
After a layoff a short plan card lists four steps, neighbors pass along leads, you choose to hide it or tell the family, and a gas card helps the hunt. Joining the credit union early opens a fair emergency loan; a free budget sit-down and helping a friend out of a payday loan teach the same lesson. Your first full paycheck after it gets a moment.
Covers: i29-a01, i29-a02, i29-a21, i29-a20, i29-a22, i29-a23, i29-a24, i29-a30.
One design: The plan card reads the existing unemployment state; the credit union loan is one more debt type with a membership-weeks check.
Files: ui.js (plan card), turn.js (unemployment), events.js (leads, family talk), outabout.js (credit union), help.js.
Balance: Help rewards players who prepared (joined early, kept savings), so careless play still lands harder.

### i30-a25 Bundle: Helping a neighbor through it (M, 🔴)
A neighbor loses a job and you can help without making it awkward, sign up for a meal train, bring food after a funeral, pay off school lunch balances and share a Thanksgiving table. A 'carried and carried others' line goes on your life story and a 'When money's tight' page joins Help.
Covers: i29-a03, i29-a04, i29-a27, i29-a13, i29-a31, i29-a28, i29-a29.
One design: A small help log in S counts help given and received; the life-story line reads it at the end.
Files: events.js, features.js (life story), help.js (new page).
Balance: Every kindness costs money or time and is capped per season, so it can't be farmed for community.

### i30-a26 Bundle: Food bank, Grange and giving back (L, 🟠)
Run the Saturday sort at the food bank, glean field edges, split wood for the firewood bank, build a little free pantry, weatherize windows with the Grange crew, borrow from the Grange tool library, drive the senior meal route and sit on the Grange help committee.
Covers: i29-a05, i29-a06, i29-a08, i29-a14, i29-a09, i29-a15, i29-a26, i29-a16.
One design: Volunteer roles share one weekly commitment slot like jobs; the tool library lowers home-repair costs while you're a member.
Files: outabout.js (food bank, Grange), turn.js (commitment), events.js (committee choices), features.js.
Balance: Volunteering takes real weeks and gives community, not cash; the committee only opens after steady service.

### i30-a27 Bundle: Music: from a used fiddle to a band (M, 🔴)
Buy a used instrument at the junk store, practice nights on a Music skill track, a growing list of tunes you know, the jam ladder from back row to calling tunes, the beginners' slow jam, your first solo, busking during Celebration Days and three regulars who start a band.
Covers: i29-b01, i29-b02, i29-b03, i29-b04, i29-b05, i29-b06, i29-b09, i29-b07.
One design: Music is one more Skills track; jam rungs are thresholds on it, and the band is a small story chain.
Files: features.js (Skills track), outabout.js (store, jam night), events.js (solo, busking, band).
Balance: Practice takes time and only finished milestones pay off, which the sim checks.

### i30-a28 Bundle: Quilting and woodworking (M, 🔴)
Join the Tuesday quilting circle, pick a pattern and give the finished quilt away. Woodworking projects have a finish line, a gift that lands, a park bench with a small plaque, an unfinished-projects pile, and a beginner class you teach at the woodshop.
Covers: i29-b13, i29-b14, i29-b15, i29-b19, i29-b20, i29-b21, i29-b22, i29-b29.
One design: Projects are one list with weeks-left counters; finishing moves them to a 'made' list that gifts and the plaque read.
Files: features.js (projects), turn.js (progress), events.js (gifts, bench), outabout.js (circle, woodshop).
Balance: Payoff only on finish; abandoned projects pile up and nag, so idle starts earn nothing.

### i30-a29 Bundle: Paint, photograph and write (M, 🟠)
Paint the valley on Outside weeks with a line for each painting, a month on the coffee shop wall, photos of the valley described in words, a Touchet sunset post, the town calendar contest, your own Tattler column and a book of valley stories.
Covers: i29-b16, i29-b17, i29-b18, i29-b26, i28-b27, i29-b27, i29-b24, i29-b25.
One design: Works go into the same 'made' list as crafts; the wall show and contest pick from it.
Files: features.js (made list), turn.js (Outside weeks), events.js (wall, contest, column), outabout.js (coffee shop).
Balance: Recognition needs finished pieces and costs time; the book costs real money to print.

### i30-a30 Bundle: On stage and at the bazaar (L, 🟠)
Community theater auditions in January and the show in March, going up on your lines, building the set with your Handy skill, a booth at the December craft bazaar, your kid's piano lessons, the spring show where your skills meet, making it through a hard week, and a list of things you made and where they are now.
Covers: i29-b10, i29-b11, i29-b12, i29-b28, i29-b30, i29-b31, i29-b32, i29-b33.
One design: Theater is a seasonal commitment; the bazaar sells from the 'made' list; the end screen shows where each piece went.
Files: events.js (theater chain, bazaar), features.js (made list, end screen), turn.js (commitment), outabout.js.
Balance: Bazaar sales are small and need finished goods; rehearsal weeks cost time from work.

### i30-a31 Release plan: v0.3 — Solid ground (L, 🔴)
Fix every known bug and build the tools that keep balance honest before adding more: the seven bug-fix sweeps and the Out and about sweep, the dev panel, content lints, the balance dashboard, a fairer Life Score and a named roadmap.
Covers: i25-a01, i25-a02, i25-a03, i25-a04, i25-a05, i25-a06, i25-a07, i30-a01, i30-a10, i30-a11, i30-a12, i25-a13, i30-a14.
One design: Ship order: sweeps first, then lints and dashboard, then the score change so the sim can measure it.
Files: See each bundle.
Balance: Every later release is measured against the ceilings this one locks in.

### i30-a32 Release plan: v0.4 — People (L, 🔴)
Make the town about people: neighbors on your street, a partner, job standing and town standing you can spend, a life aim, day notes, Cozy mode, layoffs you can climb out of, helping a neighbor, memories that last and the town page.
Covers: i19-a01, i19-a02, i19-a08, i19-a12, i25-a12, i25-a22, i30-a02, i30-a24, i30-a25, i25-a30, i30-a21.
One design: Neighbors and standing land first since the layoff, helping and town page bundles read them.
Files: See each bundle.
Balance: Each bundle adds costs with its rewards; the dashboard from v0.3 checks every merge.

### i30-a33 Release plan: v0.5 — Seasons (L, 🔴)
Make the year feel like the valley: weather, holidays and the real-year calendar, the culture calendar, the Activities card and kids' sports, music, quilting and woodworking, a Main Street shop and prices that move over the decades.
Covers: i19-a23, i19-a29, i30-a14, i30-a05, i30-a17, i30-a18, i30-a27, i30-a28, i25-a25, i25-a19.
One design: Weather and the calendar file come first; every seasonal bundle hangs its events off them.
Files: See each bundle.
Balance: Seasonal content is capped once a season or year, so more content never means a higher idle score.

## Ideas 30: Lifetime playtest

Two full Lifetime games (plus three repeats), played headless 18 to the end: a steady family life in Waitsburg and a restless one with job changes, two businesses and moves. These ideas come from what each decade felt like, what faded, the money curves, the retirement years and the handoff to the grandkid.

### i30-b01 Bug: the grandkid's pickup is worth an eighth of a starter truck (S, 🔴)
- A Lifetime heir starts with the 1998 pickup valued at $2,500 even when prices are 8x higher, so in 2097 it is worth about $300 in 2027 dollars. Set the starting ride's value in today's dollars when the next generation begins.
- Seen in every heir: carValue 2,500 at price levels of 6.2 to 8.2.
- Fix: in startLegacy (features.js), set S.carValue = cost(2500) after S.col is copied; newGame (ui.js) stays as is for gen 1.
- Trade-in, net worth and the tabs line all read right after that.
- Balance: worth a few hundred real dollars. No effect on careless or idle scores.

### i30-b02 Bug: a ride's value never drops below 2027's $500 (S, 🔴)
- The floor on a car's value is a flat $500, so a sedan kept for 50 years trades in for $500 when prices are 8x higher, about what one year of tabs costs. Make the floor $500 in 2027 dollars.
- At 85 the steady life's sedan showed "Trade-in value $500", while tabs cost about $470 a year.
- Fix: turn.js weekTick, Math.max(500, …) becomes Math.max(cost(500), …).
- Balance: a few hundred real dollars at most.

### i30-b03 You're healthiest at 80: health's ceiling comes down with age (M, 🔴)
- In the steady lives, health was 95+ in every week from 68 to the end, and in no week before 58. Cap health by age (100 to 55, then down to about 75 at 85), so the late years feel like late years and Rest and Get outside hold you near the cap.
- Why: retiring removes job wear, and one Get outside week (+1.4) beats a whole month of aging drift.
- How: a maxHealth(age) helper in state.js; adj() and the weekly drift clamp health to it. The Health stat card shows the cap ("tops out at 82 at your age").
- Touches turn.js (drift), state.js (adj), ui.js (stat card), help.js.
- Balance: trims late-life health averages by a few points for everyone. Good play stays above 70, and idle lives rarely reach the cap anyway.

### i30-b04 Home comforts hold happiness in the 80s, not at 100 (M, 🔴)
- A partner, a dog, a nice home and kids add a flat happiness bonus every week, so a family life sits at 95+ for 60 years even without any outings. Make those bonuses pull toward the mid-80s instead of past it, so the top 15 points need things you choose to do each week.
- Evidence: happiness at 95 or more in 70–100% of weeks from age 28 to the end in the family lives (45–100% in the restless ones), with or without Out and about. The happiness part of the score was 100 from about 28 on.
- How: in turn.js, scale the partner, dog, home and kids terms by clamp((88 - happy) / 30, 0, 1), the same way Rest already tops out in the low 80s.
- Balance: good play still averages about 88 with Rest, Get outside and visits. Careless play loses more, because it no longer coasts on a partner and a dog.

### i30-b05 Retirement years can't drag the net-worth part down (S, 🔴)
- Cash earns nothing, so a retiree's real net worth falls 15–25% between 65 and the end, and living longer lowers the Life Score (87 at 68 down to 83 at 86). In Lifetime, the net-worth part uses the higher of today's value and the value on the day you retired.
- Seen in every life: real net worth peaked at retirement, then fell (e.g. $3.17M at 68 to $2.37M at 83).
- How: save S.retireReal when you retire (ui.js retire button). lifeScore (features.js) uses max(real, S.retireReal) for the wealth part. The score sheet shows the line "Held from your retirement".
- Balance: you still have to build the money to retire with. Idle and careless lives retire poor, so the floor gives them almost nothing.

### i30-b06 Downsize with the sale money: buy the smaller place outright (M, 🔴)
- Moving from the farmhouse to a smaller home late in life makes your weekly costs higher, because a new mortgage or rent is at today's prices while your old payment was locked decades ago. If the sale covers the smaller home's full price, you buy it outright: no mortgage, and the rest goes to your cash.
- Evidence: at 70 the farmhouse cost $649/wk. The fixer-upper's new mortgage was $1,589/wk and the rented house $1,563/wk, so downsizing cut the restless life's real net worth by about $500,000.
- How: give owned homes a price (HOMES, state.js). moveHome (ui.js) offers "Buy it outright" when the sale covers it, and sets S.mortgage = 0.
- Balance: only helps owners with years of equity. A renter or a careless life gets nothing new.

### i30-b07 Raises take 20 years to reach the cap, not 9 (S, 🟠)
- Steady Waitsburg lives hit the top raise (1.6x) by about 28, and then got no raise for 37 years. Spread raises out: smaller steps, and a minimum time between raises that grows as you near the cap, so pay keeps growing into your late 40s.
- Evidence: in the Waitsburg-only lives, a farm insurance agent hired at about 19 was at 1.6x by 28.
- How: in events.js, "A raise" and bumpPay use a step that shrinks as S.raise nears RAISE_CAP. Work events that already promise pay bumps stay the same.
- Balance: less money in the first decade for every job holder. Good play still reaches the cap; careless play (job hopping, no work focus) reaches it less often.

### i30-b08 People skill slows the fade only up to 75 (S, 🟠)
- With the People skill maxed and a council seat, community sat at 95+ every week from 28 to 89, with town weeks only 2 in 6. Keep the skill's slower fade for the climb, but above 75 community fades at the normal rate.
- How: one condition in turn.js (the dc line): the People multiplier applies only while S.community < 75.
- The skill card says "Community fades slower (up to 75)".
- Balance: staying a pillar of the town takes showing up. Idle lives have no People skill, so nothing changes for them.

### i30-b09 Retirees keep the same pace of events (S, 🟠)
- After retiring, the work-event slot goes unused and road events need a trip, so events fell from about 125 a decade (45–57 different ones) to about 65 (20–23 different) and 80% of weeks had nothing. When you're retired, the 8% work slot rolls retiree events instead.
- How: eventOdds (events.js) gives a "later" category the work odds when S.retired; pickEvent already filters by category, cooldowns and when().
- Fill it with the retiree events already on the board (scams, care, grandkids) plus a few small ones.
- Balance: events are a mix of good and bad. Same cooldowns, so no farming.

### i30-b10 Family money arrives as a trust, not a lump (M, 🟠)
- Every heir started at 18 with $1.5–2 million in cash, enough to buy the farmhouse in week one and skip the only decade that had real money tension. Hand the family money over as a trust: a quarter at 18, a quarter at 25, the rest at 30.
- How: startLegacy (features.js) sets S.trust = [{age:25, amt}, {age:30, amt}]. weekTick pays each one out with a note and a Journal milestone.
- The legacy sheet says what comes when.
- Balance: same total as today. It only changes timing, so the heir's early decade plays like a fresh start with a cushion.

### i30-b11 The grandkid can take the family home instead of cash (M, 🟠)
- The farmhouse a family owned for 49 years is sold off-screen, and the heir starts in a $920/wk room. Offer a choice on the legacy sheet: keep the family home (its equity counts against the same hand-down cap) or take the cash.
- How: legacySheet (features.js) gets two buttons. "Keep the home" sets S.home, S.equity and a paid-off mortgage when the parent held it 30+ years; the cash is cut by the equity.
- Pairs with the trust idea: the house can come at 18 and the cash later.
- Balance: inside the existing 50% / $250,000 cap, so no extra wealth.

### i30-b12 Money past the hand-down cap goes to the town (S, 🟠)
- All four heirs got exactly $250,000 in 2027 dollars, whether the parent left $1.5M or $2.4M, so anything past about $500,000 doesn't matter to the next generation. Money over the cap goes to the town in the parent's name and raises the heir's starting community a little.
- How: startLegacy (features.js): the part over the cap adds up to +10 starting community (for example +1 for each $100,000 in 2027 dollars), and the first Journal line names the gift ("the new library roof").
- Balance: community only, capped at +10, and it fades like any other. It doesn't add money.

### i30-b13 Half your raise follows you to a job in the same field (S, 🟠)
- Every new job resets your raise to 1.0, so after 30 a job change is nearly always a pay cut: a nurse at the cap earns more than a starting lab scientist. Keep half of your raise when the new job is in the same group (care, office, trades, field, service).
- Evidence: the restless life had no reason to change jobs after 22. At 40 the steady nurse's $11,680 beat the scientist job's $9,200.
- How: apply (ui.js) and the job-offer events set S.raise = 1 + (old - 1) / 2 when JOB_GROUP matches.
- Balance: switching still costs half your raise, so job hopping isn't rewarded.

### i30-b14 Badges and goals for the second half of life (M, 🟠)
- Lives earned 11 of 18 badges by 25 and 14 by 45, and only "Retired" after that, so the goals sheet had nothing left to pin. Add badges you can only earn late: 25 years in one home, 40 years with your partner, every kid grown, 50 years in Waitsburg, a pillar of the town at 80.
- How: new BADGES entries in features.js. Each test reads state that already exists (S.ageMonths, S.kids, S.home and a new homeSince).
- The goals sheet suggests them after 45.
- Balance: pinned goals still add at most +6. Every new badge needs decades of steady play, which idle and careless lives don't have.

### i30-b15 Turning down a council run twice puts it away for five years (S, 🟠)
- A player who said "Not for me" got asked to run for council 42 times in one life, 10 of them after 66. After two no's in a row, the question waits five years.
- How: the "Run for town council?" event (events.js) counts declines in S.councilNo; w() returns 0 while S.councilNo >= 2 and the last no was less than 260 weeks ago.
- Balance: no effect on scores. It frees the event slot for others.

### i30-b16 A council seat needs ten years in town (S, 🟡)
- Steady lives won a council seat at about 21 and held it for 68 years, which took one of the biggest town moments off the table early. Running needs ten years in town as an adult (age 28+ for a Waitsburg start) on top of community 60.
- How: the when() of "Run for town council?" (events.js) adds age() >= 28, or 10 years since the life began for later starts.
- Balance: moves council's +0.8 community a month later in life. Careless and idle lives rarely get a seat anyway.

### i30-b17 Side hustles ease off after 70 (S, 🟡)
- The restless life plowed snow and built fences into its 70s at full pay ($1,265/wk at 68 on top of Social Security). After 70, gigs pay half and the heavy ones (harvest, snow) cost more health. Yard work turns into "odd jobs for neighbors".
- How: in turn.js, the gig pay line gets an age factor; currentGig() picks a light gig past 70.
- Balance: takes away a late-life money tap that careless bots can use too. No effect before 70.

### i30-b18 Rides show their model year and wear with age (M, 🟡)
- The steady life drove one used sedan from 30 to 89 with the same 4% breakdown odds, and the 2097 heir starts in a "1998 pickup". Rides get a model year when you buy them, and breakdown odds rise a little every 5 years you keep one.
- How: S.carYear set in buyCar and newGame (ui.js). CARS names show it ("2031 sedan"), the heir's start says "a 20-year-old pickup", and the breakdown roll adds 1% for every 5 years of age.
- Balance: keeping a car forever costs a little more in repairs. Buying newer costs cash. Both stay small.

### i30-b19 Snowbird winters for retirees (M, 🟡)
- Retired lives had piles of cash and nothing to do with it. From 62, a retiree can book January and February somewhere warm: a big bill, happiness and health up, but community fades while you're away and you miss the winter town goal.
- How: a Life-tab card when retired. While away, weekTick skips town events and season goals and adds the trip fx (like tripWeek in features.js).
- Balance: costs real money and community. It can't help idle or careless lives, since they don't retire with the cash.

### i30-b20 Classes after retirement are cheap and just for fun (S, 🟡)
- At 85, "Take classes" still charges $1,087 a week toward a bachelor's degree for jobs you can't take. Retirees audit instead: a small fee, a little happiness and no degree.
- How: FOCUS.study in state.js and the tuition line in turn.js check S.retired. The Life tab's Education card says "Auditing at Walla Walla".
- Balance: a mild happy boost that costs a week's focus, the same as any other focus.

### i30-b21 Quiet years count the small things in the year in review (S, 🟡)
- From 70 to 89 every year in review read "A quiet year", with all three stats unchanged. List the habits instead: coffees at the bean, jam nights, town goals done, trips taken.
- How: weekTick (turn.js) already builds the review from the Journal; count the out-and-about, trip and town-goal lines for the year. showReview prints one line for each.
- Balance: display only.

### i30-b22 A finished town goal stops a long skip only the first time (S, 🟡)
- Lifetime lives got 25–35 skip-stopping notes a decade, about 80% of them the same four "Town goal done" lines. After a goal has been done once, finishing it again is a toast and a Journal line, not a stop.
- How: seasonWeek (state.js) pushes the note only the first time each goal key is finished. Later finishes log and set S.newBadges-style toasts.
- Balance: no score change. Makes 13-week skips finish more often.

### i30-b23 Report cards go yearly after 65, and skip "+0" (S, 🟡)
- The late-life Journal fills with "Report card: Life Score 83 (+0 since the last one)" four times a year for 25 years. After 65, write a report card once a year, and only when the score moved.
- How: the S.turn % 13 block in turn.js checks age() and the difference before logging.
- Balance: display only.

### i30-b24 At the top of the pay scale, the Jobs tab says so (S, 🟡)
- From about 25 on, every row on the Jobs tab showed ▼ against your job, with no hint why. When nothing pays more, a line at the top says so and points to other moves: a business, a shorter commute or more schooling.
- How: renderJobs (ui.js) checks whether any job beats your take-home and shows one short card.
- Balance: display only.

### i30-b25 A Lifetime decade table in the sim report (S, 🟡)
- The balance report shows one line per Lifetime game, which hides problems that only show by decade. Add a table: for each decade, average stats, weeks at 95+, events and distinct events, real net worth and score.
- How: tests/sim.test.mjs collects the numbers in the bot loop (the same way this playtest did) and prints them for life games.
- It would have flagged the late-life health, the happiness ceiling and the thin retirement event pool.
- Balance: test only.

### i30-b26 Life stages: one table drives drift, caps and event pools (L, 🟠)
- Age rules are scattered (health targets in turn.js, age gates in each event), so the 40s feel like the 30s and 85 feels like 45. One LIFE_STAGES table (18–29, 30s, 40–50s, 60s, 70s, 80+) sets each stage's health target and cap, happiness set point, gig weight and the event categories it draws from.
- How: a table in state.js. weekTick, eventOdds and gig choice read the current stage. The Home screen shows the stage name ("Your 70s: slowing down").
- Builds on the health-ceiling, home-comforts and retiree-events ideas, so they live in one place.
- Balance: tune it with the decade table in the sim. The idle and careless ceilings stay as they are.
