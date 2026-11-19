# Ideas round 19

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 19: Build bundles

Each bundle groups overlapping ideas from rounds 1–18 into one buildable feature; picking a bundle means build those ideas together.

### i19-a01 Bundle: Neighbors on your street (L, 🔴)
Three named neighbors on your block, each with likes, dislikes and a friendship level that grows through porch scenes, favors and block events. Over a long game they age, move away (you can talk one into staying) and new families move in, which you can welcome.
Covers: i1-b01, i10-a05, i11-b10, i11-b11, i11-b12, i10-a08, i13-b08, i1-b27.
One design: start from the light 'one neighbor next door' and grow to three with the full move-and-change version; the street card (i11-b12) is the Home view of it.
Files: state.js (neighbors array), events.js (neighbor scenes), ui.js (street card on Home), turn.js (yearly move-out/move-in check).
Balance: Friendship only rises through chosen actions and decays when ignored; a skipped life never builds it, so idle play gains nothing.

### i19-a02 Bundle: Partner with a name and a meter (L, 🔴)
Your partner gets a name, their own job and a closeness meter that rises and falls with how you spend weeks, replacing the coin-flip dating and marriage rolls. A turned-down date can come back, and a long marriage only ends after a real slide, never on one bad roll.
Covers: i1-a14, i1-b05, i1-b06, i1-b07, i11-b30, i11-b31, i8-a10, i5-a20.
One design: Merges four meter proposals into one 0–100 closeness value; the light version (name plus two stages) ships first and the meter slots in behind it.
Files: state.js (partner object), turn.js (weekly closeness drift), events.js (date, proposal and rough-patch events), ui.js (Family card).
Balance: Closeness drifts down slowly without attention, so careless play sees more rough patches; the partner's income is modest so it isn't a free money boost.

### i19-a03 Bundle: Aging parents and caregiving (L, 🔴)
Your parents live in town and grow older with you: Sunday visits, then rides to the specialist in Walla Walla, then a caregiving stretch you can share with a sibling or get paid for through the state program. Later you may care for your partner the same way.
Covers: i1-a16, i1-b09, i7-a25, i9-a19, i13-a15, i13-a16, i6-a10.
One design: One caregiving system covers parents, partner and the neighbor you drive to treatment; 'aging parents' from rounds 1a and 1b become one parent pair with stages.
Files: state.js (parents with age and need level), events.js (visit, ride, care events), features.js (caregiver pay option), ui.js (Family card).
Balance: Care costs time and happiness but builds Community and family closeness; paid caregiving pays below a normal job so it isn't an exploit.

### i19-a04 Bundle: Kids grow up in stages (L, 🔴)
Name your kids and watch them move through baby, school, teen and grown stages on the Family card, with a parenting-style choice in the teen years and an empty-nest moment when the last one leaves. Grown kids stay in the valley or move away, and how you raised them shapes the heir in legacy mode.
Covers: i1-a15, i1-b08, i6-a01, i6-a08, i6-a07, i1-b31, i6-a02.
One design: Both 'kids grow up in stages' ideas become one stage table; naming and the heir link ride on the same kid objects.
Files: state.js (kids array with name, age, stage), turn.js (stage changes on birthdays), events.js (stage events), ui.js (Family card).
Balance: Kids cost money at each stage as now; good parenting choices pay off late (heir traits), not as quick score.

### i19-a05 Bundle: Garden, canning and the freezer (M, 🟠)
A backyard garden or community plot you plant in spring and pick through summer, with a canning day in the fall that fills the freezer and pantry. A full freezer trims grocery bills through winter, and jars make gifts or a fair entry.
Covers: i1-a09, i1-b17, i10-a20, i11-a16, i11-a15, i4-b18.
One design: Two garden ideas become one plot with three seasonal beats; the freezer from round 10 is where fish, game and garden food all land.
Files: state.js (garden, pantry), turn.js (seasonal growth and grocery discount), events.js (planting, canning, fair), ui.js (Home card).
Balance: Needs a planting choice each spring; a neglected plot yields nothing, and savings are capped at a small weekly amount.

### i19-a06 Bundle: Volunteer fire and search crews (M, 🟠)
Join the volunteer fire department or county search and rescue: training nights, tones that go off at bad times, and calls you choose to answer. It builds Community and a few skills but costs sleep and the odd shift.
Covers: i1-a21, i1-b03, i13-b22, i5-b13.
One design: Three fire department ideas and the search-and-rescue idea share one 'on the roster' role with a call event pool.
Files: state.js (roles), events.js (call-out events), features.js (join and quit), help.js.
Balance: Calls cost happiness and sometimes work hours; benefits only come from answering, so joining and ignoring it gains nothing.

### i19-a07 Bundle: Council seat and town votes (L, 🟠)
Run for council or school board, then sit through a term of real votes: the budget hearing, a levy, the school bond and public comment night. Each vote pleases some neighbors and annoys others, and you can stand again or step down.
Covers: i1-a04, i1-b11, i10-a11, i13-b03, i13-b04, i13-b19, i13-b21, i4-a25.
One design: Two council ideas and the balancing-act version merge into one term system; levy, bond and budget nights become its vote events.
Files: state.js (office, term), events.js (vote events), features.js (run for office), ui.js (Community card).
Balance: Votes trade Community with different groups, so there's no always-right answer; holding office takes evenings.

### i19-a08 Bundle: Job standing, boss and coworkers (L, 🔴)
Each job has a named boss and two regular coworkers, plus a standing that tracks how you've done with both the boss and the crew and remembers why. Good standing brings raises and references that follow you; old bosses can hire you back.
Covers: i1-a01, i11-b01, i11-b02, i11-b03, i8-b01, i8-b02, i3-a09, i8-b15.
One design: The three standing variants resolve to the two-track version (boss and crew), shown as a three-word label first.
Files: state.js (job.standing, contacts), turn.js (weekly standing change from focus), events.js (boss and coworker events), ui.js (Jobs tab).
Balance: Standing rises with effort and drops with skipped weeks and walk-outs; it gates raises, so idle play stalls.

### i19-a09 Bundle: Job ladders with visible rungs (M, 🟠)
Every job family gets named rungs with the gates shown (years, skill, standing), plus side moves to a related job. The Jobs tab shows your work history and a wishlist that says what you still need.
Covers: i3-a01, i11-b19, i11-b20, i11-b21, i5-a24, i15-b27.
One design: Ships the 'titles only' version first, then adds visible gates; side moves live on the same ladder data.
Files: features.js (job ladder data), ui.js (Jobs tab, history, wishlist), state.js (work history).
Balance: Pay steps stay as now; gates just make progress readable, so no score change for idle play.

### i19-a10 Bundle: A job market that moves (M, 🟠)
Openings change from week to week, with hiring seasons by job type, seasonal jobs that end and start again, and short interviews with a choice or two. Some applications wait for a call back.
Covers: i8-a06, i11-b22, i11-b23, i11-b24, i3-a06, i3-a07.
One design: The three versions of 'openings change' combine into hiring seasons with a few closed jobs each month and a call-back delay.
Files: features.js (job board), turn.js (weekly openings roll), events.js (interview events), ui.js (job list).
Balance: Makes job-hopping slower, which mostly limits careless churn; good play plans around seasons.

### i19-a11 Bundle: Shifts and the work week (M, 🟠)
Pick days, swing or nights, three 12-hour hospital shifts, on-call weeks for trades, part-time or school-hours jobs. A shift strip on Home shows this week, and service jobs post the schedule late.
Covers: i8-b04, i8-b05, i8-b06, i8-b07, i8-b08, i8-b21, i8-b20.
One design: One shift field per job with a few patterns, instead of separate rules per job.
Files: features.js (shift patterns per job), turn.js (pay and energy by shift), ui.js (shift strip).
Balance: Nights pay more but cost health and family time; part-time pays less, so totals stay balanced.

### i19-a12 Bundle: Town standing you can spend (M, 🟠)
Community becomes a standing with perks at each level that you pick, plus favors you can call in from people you've helped. It counts your average over weeks, not just last week, and the town has a line about you.
Covers: i1-a02, i11-b13, i11-b14, i11-b15, i1-b04, i15-a01, i1-b25.
One design: Picks the 'perks you pick' version with a small goodwill pool for favors; the average fix from round 15 comes first.
Files: state.js (goodwill, perks), turn.js (rolling average), features.js (favors), ui.js (Community card).
Balance: Average-based standing stops one-week spikes; favors are spent, so they can't be farmed.

### i19-a13 Bundle: Savings jar and cushion (M, 🔴)
A savings account with goals you name (truck, down payment, rainy day) shown as a jar on Home, plus a cushion line that says how many weeks of bills your cash covers. A gentle note appears when cash just sits.
Covers: i1-a05, i11-b32, i11-b33, i9-b05, i15-b10, i5-a12.
One design: The cushion line and emergency fund meter are the same number; the jar is the full version layered on top.
Files: state.js (savings, goals), turn.js (small interest), ui.js (Home jar and cushion), help.js.
Balance: Interest is small; the value is fewer debt spirals, which helps good play more than idle.

### i19-a14 Bundle: Debt help: refinance, plans and bankruptcy (M, 🟠)
When debt drags on you get a calm warning card, then choices: refinance at the bank, pay debts in the order you pick, a kitchen-table budget, collections if you ignore it, and bankruptcy as a hard but real alternative to leaving town. Every loan shows a debt-free date.
Covers: i1-a07, i3-a26, i3-a27, i9-b08, i12-b07, i4-b19, i15-b14.
One design: One debt ladder from warning to bankruptcy replaces separate one-off ideas.
Files: features.js (bank actions), turn.js (collections step), events.js (budget scenes), ui.js (Money sheet).
Balance: Bankruptcy keeps the life going but caps the score and wrecks credit for years, so it never beats paying.

### i19-a15 Bundle: Homeowner upkeep and upgrades (M, 🟠)
Owners get chores that pile up, things that break (fix it yourself, call someone, or tell the landlord if renting), weekend projects that add value, property taxes and storm prep like trimming the big tree.
Covers: i1-a03, i1-b16, i11-a09, i11-a10, i3-a20, i18-b20, i13-a31.
One design: Two upkeep ideas and two upgrade ideas become one house condition value with repair and project choices.
Files: state.js (house condition), turn.js (wear and taxes), events.js (breakdowns), features.js (projects), ui.js (Home).
Balance: Neglect lowers home value and raises repair bills, so careless owners pay more; projects take weekends.

### i19-a16 Bundle: Roommate and the spare room (S, 🟡)
Take in a roommate, rent the spare room on wine weekends, let a friend crash on the couch, or have a grown kid move back. Each brings money or help and a little friction.
Covers: i1-a08, i1-b19, i3-a34, i6-a17, i14-b14.
One design: One 'spare room' slot used by all four cases; only one occupant at a time.
Files: state.js (spare room), events.js (roommate events), features.js (rent it out).
Balance: Rent income is small and comes with happiness costs; only owners or bigger rentals have a spare room.

### i19-a17 Bundle: Pets with names that grow old (M, 🟡)
Name your dog, adopt a pet on purpose, keep barn cats, chickens or a horse on a bigger place. Pets age, and when the old dog goes there may be a puppy from its litter; the portrait ages too.
Covers: i1-a17, i1-b13, i1-b15, i6-a30, i6-b30, i1-b14.
One design: Both dog-ages ideas use one pet object with age; farm animals share it.
Files: state.js (pets array), turn.js (aging), events.js (pet events), ui.js (Family card portrait).
Balance: Pets cost money and give a small happiness lift; the loss event is gentle.

### i19-a18 Bundle: Friends and your crew (M, 🟠)
A best friend through the years and one friendship meter for your circle, fed by Saturday invites from the group text. Say no too often and the invites stop; friends drift as life changes, fall out and make up, and a contacts list shows who you haven't talked to.
Covers: i1-b30, i14-b01, i14-b02, i14-b03, i14-b31, i14-b11, i16-b17.
One design: One crew meter plus one named best friend, rather than several meters.
Files: state.js (crew, bestFriend), turn.js (drift), events.js (invite events), ui.js (contacts list).
Balance: Invites cost time and money; ignoring them slowly shrinks the circle, so idle play loses the happiness.

### i19-a19 Bundle: Retirement chapter (M, 🟠)
Retiring asks first and marks the day, then you pick how the last years go: a retiree focus like lending a hand, a standing weekly commitment, or a town role. Happiness in retirement needs a reason after the first years.
Covers: i1-a24, i2-b28, i1-b21, i9-a09, i9-a10, i8-a08, i8-a04.
One design: One retirement setup screen covers 'choose when', 'choose your last years' and retiree roles.
Files: features.js (retire), turn.js (retiree focus), ui.js (retirement sheet), state.js.
Balance: Retiring with no plan lets happiness slide, so idle retirement scores lower than an active one.

### i19-a20 Bundle: A final season and a fitting ending (L, 🔴)
Late life ends with a final season instead of a sudden stop: three goodbye visits, a last walk down Main Street, then an ending that fits the life, a Tattler obituary and 'where are they now' lines for your people.
Covers: i9-a25, i9-a26, i9-a28, i2-b01, i2-b02, i2-a29, i4-a23.
One design: Obituary, life story and epilogue lines become one ending screen with three parts.
Files: turn.js (final season trigger), events.js (goodbye scenes), ui.js (end screen), state.js.
Balance: No score change; the ending reads back what the life did, which rewards a full life over an idle one.

### i19-a21 Bundle: The shelf of lives and the family tree (M, 🟡)
A shelf of every finished life, shown as books you open, with a family tree view for legacy lines and a way to compare two lives from the title screen.
Covers: i2-b03, i11-b16, i11-b17, i11-b18, i2-b14, i15-b32.
One design: Ships the one-line rows first, then books; the tree is a second view of the same list.
Files: state.js (lives archive), boot.js (title screen), ui.js (shelf and tree).
Balance: Display only; no gameplay effect.

### i19-a22 Bundle: What gets passed down (M, 🟠)
Write a will, split the estate among your kids, and pass down heirlooms, family traditions, and the favors and grudges you built. The grandkid sheet shows exactly what comes down and what town choices stick.
Covers: i2-b13, i6-a05, i6-a23, i6-a24, i3-a33, i8-a28, i6-a06.
One design: One inheritance list on the grandkid sheet holds money, heirlooms, traditions and standing.
Files: state.js (legacy carry-over), features.js (will), ui.js (grandkid sheet).
Balance: Inherited money is taxed and split; grudges carry too, so a careless parent leaves a worse start.

### i19-a23 Bundle: Weather and the seasons (M, 🟠)
A weekly forecast chip that nudges this week's focus, weather that touches jobs and events, a season mood, weather in the header and on the map, and seasons drawn on the town scene.
Covers: i5-b01, i11-b25, i11-b26, i11-b27, i6-b23, i6-b08, i2-a09.
One design: Starts with the one-rule weather line, then the full version; the season mood is the fallback between weather weeks.
Files: turn.js (weather roll), events.js (weather tags), ui.js (header chip), maps.js (map overlay).
Balance: Effects are small and known ahead, so planning around them helps good play.

### i19-a24 Bundle: Wants and worries (M, 🟠)
Three small wants that refresh and come from your life, plus one worry at a time. Meeting a want gives a happiness bump, and staying at the top of happiness needs something new.
Covers: i10-a01, i11-b28, i11-b29, i10-a03, i5-a10.
One design: Light version is one want at a time; the full version grows to three drawn from your situation.
Files: state.js (wants, worry), turn.js (refresh and check), ui.js (Home chips).
Balance: Wants only pay when you act on them; the cap on top happiness stops autopilot maxing.

### i19-a25 Bundle: Choices that show what they do (M, 🔴)
Event buttons show small arrows for what each choice changes, with clearer hints as your skills and standing grow, real costs on the labels, a 'why did that happen?' line after, and big choices that say what will change.
Covers: i2-a01, i11-b04, i11-b05, i11-b06, i5-a19, i2-a32, i2-a21.
One design: Arrows-only first, then skill-gated detail; 'Think it over' becomes an optional long-press.
Files: ui.js (event sheet), events.js (effect tags), help.js.
Balance: Hard mode keeps arrows vague; showing effects helps careful players most.

### i19-a26 Bundle: Plan the week ahead (M, 🟠)
Before End Week, see what this focus will do (money first, then all four stats), compare two focuses side by side, queue the next four weeks, and see dated things coming in the next eight weeks, all in one Planner.
Covers: i2-a02, i11-b07, i11-b08, i11-b09, i16-b01, i15-b06, i15-b31.
One design: One Planner screen holds the preview, compare, queue and up-next list.
Files: ui.js (Planner sheet), turn.js (dry-run of a week), state.js (focus queue).
Balance: Preview uses expected values, not the dice; the queue stops on events, so it isn't free Auto.

### i19-a27 Bundle: The wheat lease as a real farm (L, 🟠)
The wheat lease becomes a farm year: cash rent or crop share with a landowner you keep happy, peas or fallow rotation, a scale ticket at harvest, sell or store the grain, crop insurance, and a Farming skill you earn.
Covers: i18-a01, i18-a02, i18-a03, i18-a04, i3-a15, i3-a16, i15-a08, i18-a28.
One design: One farm-year flow on the lease replaces separate one-off choices.
Files: features.js (lease), turn.js (crop year), events.js (harvest events), ui.js (farm card).
Balance: Bad years still hurt; insurance trims the swing but costs money, keeping careless farming below good farming.

### i19-a28 Bundle: Body, habits and health over time (M, 🟠)
Fitness that builds and fades slowly, healthy habits, old injuries that linger, a body card (back, knees, teeth, eyes, heart), a regular doctor, and a line showing where your health is headed for your age.
Covers: i1-a22, i1-a23, i13-a01, i13-a29, i9-a32, i9-a04, i13-a30.
One design: One body card with a slow fitness value replaces separate habit and injury meters.
Files: state.js (body), turn.js (slow changes), events.js (injury and checkup), ui.js (health sheet).
Balance: Habits pay off over decades; one good week does little, so steady play wins.

### i19-a29 Bundle: Holidays on the calendar (M, 🟡)
Holidays land on the right week with a month-at-a-glance on Home, holiday touches on the Home scene, Christmas cards, and specials on the real calendar.
Covers: i1-b10, i16-a33, i2-b27, i6-b13, i16-a34, i4-a14.
One design: One holiday table keyed by week of year drives events, Home touches and the month card.
Files: turn.js (calendar), events.js (holiday events), ui.js (month card, Home scene).
Balance: Small happiness beats with costs; no big score effect.

### i19-a30 Bundle: Charts of your life (M, 🟡)
Keep a small weekly history of money and the four stats, then show tiny trend lines in stat sheets, cash and net worth on one chart with an on-pace mark, big moments marked, and a plain table behind every chart.
Covers: i15-b01, i15-b02, i15-b03, i15-b04, i15-b33, i15-b24.
One design: One history buffer feeds every chart; the table view is the accessible form.
Files: state.js (history ring buffer), ui.js (charts), help.js.
Balance: Display only; helps players see slow leaks.

## Ideas 19: Custom games and settings

Knobs, assists, presets and seeds that let players shape a life, with clear rules for what counts toward records.

### i19-b01 One rules object every system reads (M, 🔴)
Add RULES defaults next to MODES in js/state.js; S.rules saved with the life, missing keys fall back to Normal.
Swap fixed values (debt end, start money, length, event odds, COL_RATE) in turn.js, events.js and ui.js for rule(k).
Old saves load with Normal rules, so nothing changes for them.
Balance: no effect by itself; it makes every later knob testable in the sim.

### i19-b02 Change the rules: one folded button on the start sheet (S, 🔴)
New row in the start sheet in js/ui.js, next to the mode buttons; summary updates with moreSum().
Opens a sheet of grouped rows: Length, Money, Events, Systems, Assists.
Keeps the start screen simple for people who just want to play.
Balance: Standard is the default and the only thing that fills the normal records.

### i19-b03 This life counts toward: a live badge on the rules sheet (S, 🔴)
Computed from S.rules by one recordTier() helper in js/state.js, used by the badge and by the end screen in features.js.
Three tiers: Standard (records), Custom (its own shelf), Sandbox (never recorded).
No surprises at the end of a long life.
Balance: easy settings can never land a score on the normal records.

### i19-b04 Like Normal, but...: every knob shows the Normal value (S, 🔴)
Rules sheet rows in js/ui.js read defaults from RULES.
Plain labels: 'Starting money: $1,500 (Normal)'.
Helps non-gamers see what they changed and undo it.
Balance: none; it's display only.

### i19-b05 What this means for a week: dollar examples on each knob (S, 🔴)
A small preview function per rule in js/state.js, using HOMES, cost() and the event odds.
Words for people who don't think in percent.
Updates live as the knob moves.
Balance: none; it explains, it doesn't change play.

### i19-b06 Easier or harder: a simple meter for your rule set (S, 🟠)
Weights per rule kept in RULES (js/state.js), tuned from balance-sim runs in tools/.
Shows on the rules sheet and on the save slot line.
Different from the after-the-fact grit rating: this is before you start.
Balance: the meter is informational; record tiers decide what counts.

### i19-b07 Pick any game length, in weeks (M, 🟠)
LENGTHS in js/state.js gets a 'custom' entry; target from a curve through the 26/104/260-week targets.
gameProgress() and the 'by now' line in features.js already work off turns and target.
A length that matches a standard one goes on that shelf; any other goes to Custom.
Balance: careless and idle still fall short because the target curve follows the tuned ones.

### i19-b08 End at an age you pick (S, 🟡)
Ending check in js/turn.js compares age() with rule('endAge').
Target net worth from the same length curve, using the weeks it will take.
Lifetime stays the only open-ended length.
Balance: Custom shelf; same scoring as any set length.

### i19-b09 Starting money: Broke, Standard or Comfortable (S, 🟠)
Applied in newGame() in js/ui.js after the background's set().
lifeScore() in features.js subtracts start money above the background's normal amount from net worth.
Broke is a real challenge for players who want one.
Balance: extra cash can't lift the wealth part; Custom shelf unless left at Standard.

### i19-b10 Inflation dial: frozen, usual or 1970s (S, 🟠)
COL_RATE and WAGE_RATE in js/state.js become rule('col') and rule('wage'), used in the yearly update in turn.js.
The year review already shows 'then and now' prices.
Fast inflation pairs well with the class codes for teachers.
Balance: score uses 2027 dollars, so frozen prices don't inflate it; Custom shelf.

### i19-b11 Pick which kinds of events show up (M, 🟠)
Each event in js/events.js gets a kind tag; the event picker skips kinds that are off.
Different from how often events come: this is which ones.
Good for players who hate car trouble or want a work-only story.
Balance: turning kinds off sends the life to Custom; the sim checks that dropping only bad-news kinds doesn't top the shelf.

### i19-b12 Turn whole systems on or off (L, 🟠)
Each feature in js/features.js and js/outabout.js checks rule('sys.x') before showing UI or running its week.
Score parts that need an off system are dropped and the rest scaled, so the total stays out of 100.
Great for a short, simple first life or a teacher's money-only lesson.
Balance: Custom shelf; the sim plays the lite sets to keep careless at or under 60.

### i19-b13 Start in any month (S, 🟡)
S.date set in newGame() in js/ui.js; seasons, town goals and gigs already follow curMonth().
Weekly challenge keeps its own start month rule.
A small way to make replays feel new.
Balance: January stays the standard; other months go to Custom.

### i19-b14 Longer turns for long lives (L, 🟠)
turn.js already scales weekly money lines with a multiplier m for multi-week steps; reuse it for a fixed pace.
Stat drift, focus streaks and study progress scale with the pace.
One event chance per turn, not per week, with odds raised to match.
Balance: Custom shelf until the sim shows the same scores as weekly play.

### i19-b15 Assist: handle the routine stuff for me (S, 🔴)
A list of routine events flagged in js/events.js with their default choice.
Shown as one 'Taken care of' line in the summary in turn.js.
Cuts taps for players who just want the story.
Balance: it picks the same choice a careful player would, so it counts normally; the sim confirms.

### i19-b16 Assist: let the game answer small events (S, 🟠)
Each event choice in js/events.js gets a 'safe' mark; the picker uses it when the event is small.
Different from skipping one-button events: these have real choices, just small ones.
You can always open the summary to see what it picked.
Balance: cautious answers cost a little upside, so it can't beat careful play; Custom shelf.

### i19-b17 Assist: no game over (S, 🟠)
Ending checks at the end of js/turn.js call a comeback step when rule('noEnd') is on.
Relaxed already stops debt; this covers every ending, on any mode.
For kids, new players and people who just want to see a whole life.
Balance: assisted lives are never recorded, so it can't lift records.

### i19-b18 Assist: warn me before cash goes under a line (S, 🟡)
One check in adj() callers for buys in js/ui.js and js/features.js.
Choices stay yours; it only adds a pause.
Helps people who tap fast.
Balance: removes no choices, so it counts normally.

### i19-b19 You can turn assists off mid-life, not on (S, 🔴)
Read-only 'Rules for this life' card on the Life tab in js/ui.js, with off switches only for assists.
Confirm sheet names the shelf it moves to.
Stops 'easy for the hard part, then off' tricks.
Balance: records only see lives that kept their tier the whole way.

### i19-b20 Built-in preset cards (M, 🟠)
PRESETS list in js/state.js; each card shows its badge tier and a two-line description.
Picking a card fills the rules sheet, which can still be tweaked.
Gives non-gamers a starting point without reading every knob.
Balance: each preset is in the sim; Tight times must still let good play reach 70.

### i19-b21 Preset cards show a typical score range (S, 🟡)
The sim in tools/ writes a small presets-scores.json baked into the build.
Shown on the card and on the end screen next to your score.
Helps make sense of Custom shelf numbers.
Balance: the same runs catch a preset where careless play scores too high.

### i19-b22 Save your own presets (S, 🟠)
Stored in prefs() in localStorage, not in the save, so they last across lives.
Edit, rename or delete from the rules sheet.
Included in the backup file.
Balance: a saved preset gets the same tier as its rules.

### i19-b23 Share a preset as a short code (S, 🟠)
Pack S.rules into a compact string in js/state.js; checksum letter catches typos.
Different from a life code, which also fixes the dice and start.
Works offline; QR optional.
Balance: unknown or out-of-range values are clamped, so a code can't break the game.

### i19-b24 Type a word as your seed (S, 🟠)
Reuses weekSeed() and useDice() from the weekly challenge in js/ui.js.
Blank means random, as now.
Pairs with life codes, but is easy to say out loud.
Balance: seeded lives count like any other, but a seed replayed after finishing goes to Custom, like the weekly's first-finish rule.

### i19-b25 Same seed, new rules: compare two runs (M, 🟡)
Keep the finished life's seed, rules and score in features.js; a 'Try again with new rules' button.
Side-by-side card built from the existing score card code.
A fun way to learn what each knob really does.
Balance: replays are never recorded.

### i19-b26 A Custom shelf grouped by rule set (M, 🟠)
A short fingerprint of S.rules forms the best key in bestKey() in js/state.js.
Your records sheet in js/ui.js gets a Custom tab listing each set with its best.
Old normal records are untouched.
Balance: easy sets never mix with standard scores.

### i19-b27 Rules show on the score card and share image (S, 🟡)
Score card in js/features.js prints a rules line from the same preview text.
Standard lives show nothing extra.
Keeps friends from comparing apples to oranges.
Balance: none; it's honesty in display.

### i19-b28 Rules lock for weekly challenges and scenarios (S, 🔴)
newGame() in js/ui.js ignores S.rules when weekly or scenario is set.
Short note: 'Everyone plays the weekly with the same rules.'
Keeps weekly results fair.
Balance: stops custom knobs from leaking into shared boards.

### i19-b29 Rules travel safely in backups (S, 🟠)
Extend the import check in js/ui.js (the ok() validator near line 222).
Old backups import with Normal rules.
A tampered backup can't create an impossible life.
Balance: clamping stops edited rules from landing on the records.

### i19-b30 Tinker sheet for sandbox lives (M, 🟠)
New sheet in js/ui.js shown only when recordTier() is Sandbox.
Writes straight to S, then re-renders.
Builds on Porch mode's start setup, adding changes during play.
Balance: never recorded, so it can't touch scores.

### i19-b31 Event browser: try any event in a sandbox (S, 🟡)
Reads the event list in js/events.js; runs the same show-event code as a normal week.
Sandbox lives only.
Also handy for writing and checking new events.
Balance: sandbox only, never recorded.

### i19-b32 Custom games, explained: a plain Help page (S, 🟠)
New page in js/help.js, linked from the rules sheet's '?' button.
Short sentences, examples in dollars, no game words like 'RNG'.
Mentions that Standard is how the game is meant to be played.
Balance: none.

### i19-b33 The sim plays every preset and the extreme knobs (M, 🔴)
Extend the balance sim in tools/ to read RULES and PRESETS.
Checks: careless median 60 or under, idle 50 or under, good play 70 or more for every counted tier.
Runs in the release kit before beta.
Balance: this is the guard for the whole round.
