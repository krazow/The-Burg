# Ideas round 25

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 25: More build bundles

A second set of build bundles: each groups related ideas from rounds 1–24 (none already in round 19's bundles) into one buildable feature, and the seven bug-fix sweeps collect every 🔴 bug from the playtest and bug-hunt rounds.

### i25-a01 Bundle: Bug-fix sweep: saves, endings and the grandkid (M, 🔴)
Fix the seven save and ending bugs in one pass: an open event or a pending ending survives closing the app, badge toasts stop replaying, 'End this life now' and 'Replace' ask first, and the grandkid only comes after a full life and waits if you tap Not now.
Covers: i22-a01, i22-a02, i23-a02, i12-b01, i12-b04, i8-a01, i8-a02.
One design: All seven touch the same save/finish path, so one change to what playWeeks saves (S.pendingEv, S.endPending, cleared S.newBadges) fixes most of them together.
Files: turn.js (playWeeks save order), features.js (finish, grandkid offer), state.js (save, slots), ui.js (showMenu, askReplace).
Balance: Closes ways to dodge bad events and reroll endings, so careful play is the only way to a good score.

### i25-a02 Bundle: Bug-fix sweep: jobs and pay (M, 🔴)
Fix the pay and job bugs: a new job clears leftover unemployment, the friend's tip shows today's take-home, raise text tells the real amount at the cap, extra class weeks carry over, retirees can't be hired into jobs that never pay, tuition help checks your cash, and the gas-spike event counts remote days.
Covers: i22-a03, i22-a09, i22-a10, i22-a15, i8-a03, i22-a16, i22-a14.
One design: Every fix reads pay the same way the job board does (payNow, wk) so one helper serves all seven.
Files: ui.js (apply, quit, commuteCost), events.js (friend tip, gas spike, tuition help, raise events), turn.js (weekTick unemployment and studyProg).
Balance: Removes free money (double benefits) and false bargains; no change to normal pay curves.

### i25-a03 Bundle: Bug-fix sweep: money, farm and business (M, 🔴)
Fix the money-sheet and business bugs: no free harvest check the week you lease ground, no lease flipping for profit, old winter tires don't follow you to a new car, food-truck weeks count as hustling, the net worth breakdown adds up, the debt warning names your mode's real limit, and a business that earns nothing says so.
Covers: i22-a04, i22-a06, i22-a08, i22-a12, i12-b02, i12-b03, i15-a04.
One design: The lease fixes share bizValue and the harvest check; the net worth and debt-limit fixes read the same numbers weekTick and netWorth use.
Files: features.js (bizValue, harvest, business report), ui.js (buyCar, showStatInfo net), turn.js (weekTick debt limit, hustle), help.js (Money lines).
Balance: Closes two money exploits worth thousands; warnings get more honest, not more generous.

### i25-a04 Bundle: Bug-fix sweep: score, clock and goals (M, 🔴)
Fix the counting bugs: age stops running a year behind, the score pill is right in the first month, the Lifetime bar and score agree on one span, a goal you already meet when pinned doesn't count, challenges show live progress, '1 weeks left' reads 'Last week!', the town goal box shows reward and time left, and perks show weeks left on Home.
Covers: i5-a01, i5-a02, i22-a19, i22-a07, i8-a05, i23-a03, i23-a05, i5-a05.
One design: Age and the Lifetime bar both move to a weeks-played count, so the 18-to-65 span is one constant everyone reads.
Files: state.js (age from S.turn), features.js (lifeScore, goal pinning, challenge progress), ui.js (header, score pill, town goal box, 'Working for you' row).
Balance: Pinning free goals goes away (-2 points of free score); everything else is display truth.

### i25-a05 Bundle: Bug-fix sweep: events and the calendar (S, 🔴)
Fix the event-timing bugs: Celebration Days and the other yearly events happen every year, the year in review counts event milestones, windstorms come in storm season with a real choice, the levee story starts from either Touchet choice, the jam event lands on a jam week, and visit gains taper above 80.
Covers: i5-a03, i5-a04, i15-a02, i15-a03, i15-a05, i22-a13.
One design: One calendar check for yearly events and one 'milestone' flag on event results cover the first two; the rest are small guards in their own events.
Files: events.js (calendar events, windstorm, levee, jam), outabout.js (visit gains taper), features.js (year review).
Balance: The visit taper stops quick visits pinning happiness and health at 100, which pulls careless scores down.

### i25-a06 Bundle: Bug-fix sweep: Home screen and toasts (S, 🔴)
Clean up Home: toasts sit above the bottom bars and wait while a sheet is open, the bottom stack slims on short phones, the business card and Home count visits the same way, End Week names a planned trip, and a brand-new player is offered the practice life.
Covers: i20-a03, i20-a04, i20-a05, i20-a22, i23-a04, i23-a01.
One design: One toast queue fixes both toast bugs; the short-phone layout and End Week label share the same bottom-bar code.
Files: ui.js (toast, bottom bar, End Week label, business card), boot.js (first-start sheet), index.html styles.
Balance: Display only, no score effect.

### i25-a07 Bundle: Bug-fix sweep: lists and long sheets (S, 🔴)
Fix the layout bugs at 360 wide: Jobs and Journal chips keep whole words, the job board splits under can-apply and locked headers, buy buttons never cut off, the trip sheet header stays put, end-screen score math sits in a clean table, and challenge Start buttons fit.
Covers: i20-a01, i20-a02, i20-a09, i20-a14, i20-a23, i20-a28, i20-a30.
One design: A shared no-shrink chip row and a sticky sheet header serve several screens at once.
Files: ui.js (job board, Life buy rows, Journal filters, trip sheet), features.js (score table, challenge list), index.html styles; screens.test.mjs at 360 wide.
Balance: Display only, no score effect.

### i25-a08 Bundle: One rules sheet for custom games (M, 🔴)
A single rules object that every system reads, opened from one folded 'Change the rules' button on the start sheet. Each knob shows the Normal value and a dollar example for a week, a meter says easier or harder, and a live badge says what this life still counts toward.
Covers: i19-b01, i19-b02, i19-b03, i19-b04, i19-b05, i19-b06, i19-b28, i19-b29.
One design: The rules object (i19-b01) comes first; everything else is the sheet that edits it. Rules lock for weekly challenges and travel inside backups.
Files: state.js (S.rules, defaults per mode), ui.js (start sheet, rules sheet), features.js (what counts toward records), backup code in ui.js.
Balance: Easier rules mark the life as Custom so it can't set Normal records; the meter is the same number the badge uses.

### i25-a09 Bundle: Custom knobs: length, money and events (L, 🟠)
The knobs that go on the rules sheet: any game length in weeks or an end age, starting money (Broke, Standard, Comfortable), an inflation dial, start month, which kinds of events show up, whole systems on or off, and longer turns for long lives.
Covers: i19-b07, i19-b08, i19-b09, i19-b10, i19-b11, i19-b12, i19-b13, i19-b14.
One design: Each knob is just a field in S.rules; systems check one flag instead of growing their own settings.
Files: state.js (rules fields), turn.js (turn length, end check), events.js (event kind filter), features.js (system on/off guards).
Balance: Knobs that make life easier push the life to Custom; the balance sim runs the extremes (see the sandbox and presets bundle).

### i25-a10 Bundle: Assists for a gentler game (S, 🟠)
Optional helps: handle routine stuff for me, let the game answer small events, no game over, and a warning before cash dips under a line you set. You can turn assists off mid-life, never on.
Covers: i19-b15, i19-b16, i19-b17, i19-b18, i19-b19.
One design: One assist list in S.rules; off-only mid-life stops switching them on for the hard stretch.
Files: state.js (S.rules.assist), turn.js (auto-answer and no-game-over checks), events.js (small-event flag), ui.js (cash warning).
Balance: Assisted lives are marked and kept off records; auto-answers pick the middle choice, never the best one.

### i25-a11 Bundle: Presets, seeds and sharing rules (M, 🟠)
Built-in preset cards with a typical score range, your own saved presets, short share codes, a word as your seed, the same seed under new rules to compare two runs, a Custom shelf grouped by rule set, and rules printed on the score card and share image.
Covers: i19-b20, i19-b21, i19-b22, i19-b23, i19-b24, i19-b25, i19-b26, i19-b27.
One design: Presets and share codes are both just a packed S.rules; the seed rides along in the same code.
Files: features.js (preset list, share code pack/unpack, score card), state.js (seed from word), ui.js (title shelf).
Balance: Score ranges come from the balance sim, so a preset can't claim an easy high score it doesn't give.

### i25-a12 Bundle: Pick a life aim (L, 🔴)
At the start you pick an aim (Comfort, Roots, Adventure or Legacy), each with its own measure, plus a count of good weeks money can't buy. The aim shows up on birthdays, you get a halfway check, and you can change aims but it counts by the week.
Covers: i20-b01, i20-b02, i20-b03, i20-b04, i20-b05, i20-b06, i20-b21, i20-b22.
One design: Roots, Adventure and Legacy are the three new measures; Comfort is today's score. Changing aims weighs each week by the aim it was played under.
Files: state.js (S.aim, weekly aim log), turn.js (good-week count, measures), features.js (aim scoring), ui.js (start sheet, birthday line, halfway sheet).
Balance: Each aim's measure only grows from chosen actions; idle weeks are never 'good weeks'.

### i25-a13 Bundle: A fairer Life Score (M, 🔴)
The Life Score becomes the average of your yearly report cards, rewards balance over one maxed part, counts net worth you'd really walk away with, adds an 'enough' line and a security-first view for short games, and shows the four bars and weights as a picture. A sim check proves no aim beats another.
Covers: i20-b11, i20-b12, i20-b13, i20-b14, i20-b15, i20-b16, i20-b18, i20-b23.
One design: Average-of-report-cards replaces the end-only math; the 'enough' line and the security view are the same cap seen two ways.
Files: features.js (lifeScore, scoreCard, netWorth for score), tests/sim.test.mjs (aim balance check).
Balance: Balance bonus and the 'enough' cap stop rich-but-miserable lives scoring high; the sim keeps careless <= 60, idle <= 50.

### i25-a14 Bundle: End-screen verdicts and titles (M, 🟠)
The end screen rates your own life first, then gives two verdicts (the town's and yours), titles from your aim and score with kind words for low scores, your three turning points, every part's score in plain words, a try-other-weights toggle, and an epitaph you pick from three.
Covers: i20-b07, i20-b08, i20-b09, i20-b10, i20-b17, i20-b19, i20-b20, i20-b26.
One design: One end-screen layout; the turning points come from the biggest week-to-week swings already in the weekly history.
Files: features.js (finish, end screen), state.js (weekly history), ui.js (epitaph picker).
Balance: Display and choice only; trying other weights never changes the recorded score.

### i25-a15 Bundle: A say() helper and text that knows you (M, 🔴)
One say() helper with variants and tokens, so events use your real job name and workplace words, name the people you meet once, and change with your age, where you came from, who's at home and how you're doing.
Covers: i21-a22, i21-a01, i21-a02, i21-a08, i21-a09, i21-a10, i21-a11, i21-a19.
One design: say() lands first; the five 'text that knows' ideas become token sets it fills, not five separate systems.
Files: events.js (event text through say()), state.js (token sources), tests (every token resolves).
Balance: Text only, no stat changes.

### i25-a16 Bundle: Valley detail and a bigger Tattler (M, 🟠)
Give every generic event a valley detail and season touch, one spelling for every place, townsfolk who talk in their own words, and a bigger monthly Tattler with no repeats, then rewrite the ten flattest events using our best lines as the examples.
Covers: i21-a21, i21-a29, i21-a16, i21-a20, i21-a15, i21-a18, i21-a30, i21-a24.
One design: Place spellings live in one list the Tattler and events both read.
Files: events.js (event text, Tattler pool), maps.js (place names), outabout.js (townsfolk lines).
Balance: Text only, no stat changes.

### i25-a17 Bundle: Home prices, mortgages and equity (M, 🔴)
Homes get a real value on their own price index, equity is value minus the loan, the bank checks your pay before lending, the Homes list shows years of pay, the mortgage ends after 30 years and the locked payment feels lighter as pay rises. Rent goes up once a year at renewal, and the valley housing market moves.
Covers: i21-b01, i21-b02, i21-b03, i21-b04, i21-b05, i21-b12, i21-b13, i3-a21.
One design: One home price index replaces the old milk-price scaling and the earlier housing-market idea.
Files: state.js (home value, loan), turn.js (mortgage end, rent renewal), ui.js (Homes list, buy check), features.js (netWorth).
Balance: The pay check stops careless players buying beyond their means; equity only counts what you'd keep after selling.

### i25-a18 Bundle: A valley business cycle (M, 🔴)
A boom-and-bust cycle that lasts years, run by one interest rate: in a recession the job board thins, raises freeze then catch up, older workers and extended benefits come into play, and a market-drop card asks panic or hold as the 401(k) follows the cycle.
Covers: i21-b06, i21-b11, i21-b07, i21-b08, i21-b27, i21-b28, i21-b09, i21-b10.
One design: The cycle and the single rate are the engine; hiring, raises and the 401(k) all read the same cycle value.
Files: turn.js (cycle state yearly), features.js (401(k) returns), ui.js (job board openings), events.js (market-drop card).
Balance: Holding through a drop beats panic selling over time; the sim checks a recession at the worst moment (see economy tests).

### i25-a19 Bundle: Prices and pay over the decades (M, 🔴)
Prices rise at different speeds with gas shocks that last a year or two, pay steps up each January by employer type with Washington's minimum wage tracking prices, real pay grows a little with experience, and you can view everything in today's or 2027 dollars, in hours of work, and see what your cash lost this year.
Covers: i21-b14, i21-b15, i21-b16, i21-b17, i21-b18, i21-b20, i21-b21, i21-b22.
One design: All prices go through cost() with a category; the dollars toggle is one display switch over that.
Files: state.js (price indexes), turn.js (January pay step), ui.js (fmt with dollars toggle), features.js (year review line).
Balance: Cash that just sits loses value, which nudges active saving; pay keeps pace so careful players aren't punished.

### i25-a20 Bundle: Will retirement cover the bills? (M, 🟠)
Pick when to claim Social Security (62, 67 or 70) and a 401(k) draw rate, see January raises, and get one plain check (in Lifetime games and before you retire) that says whether retirement covers the bills.
Covers: i21-b24, i9-a12, i21-b26, i9-a11, i3-a25, i21-b25, i9-b12, i15-b15.
One design: The withdrawal-rate ideas from rounds 9 and 21 become one picker; the two retirement checks become one card.
Files: features.js (retirement income), turn.js (January Social Security bump), ui.js (retire sheet, check card).
Balance: A too-high draw runs the 401(k) dry and costs happiness late; the check makes the trade-off visible, not free.

### i25-a21 Bundle: Economy and long-game sim tests (M, 🟠)
Sim tests that frozen prices give the same score, affordability stays sane every decade, a recession at the worst time is survivable, every price goes through cost(), an economy seed lets two lives share one economy, and the bots skip weeks, buy homes and cars and play the next generation.
Covers: i21-b30, i21-b31, i21-b32, i21-b33, i21-b34, i15-a24, i22-a22, i22-a23.
One design: One long-game sim file covers all of these, with bots that act like real players.
Files: tests/sim.test.mjs (long-game runs, bots), state.js (economy seed), a grep test for cost().
Balance: These are the guard rails that keep careless <= 60, idle <= 50 and good play >= 70 across decades.

### i25-a22 Bundle: Day notes and Tonight (M, 🔴)
The week summary gets five short weekday lines from a pack of 90, including your commute, plus one evening tap ('Tonight') and an optional midweek tap inline in the recap. Jobs set which days are your weekend, overtime and hustle eat it, and household evenings show who's home.
Covers: i22-b01, i22-b06, i22-b27, i22-b02, i22-b05, i22-b07, i22-b08, i22-b16.
One design: Day notes are the base; Tonight and the midweek tap are two taps inside the same recap, not new sheets.
Files: turn.js (day notes), events.js (moment pack), ui.js (recap), state.js (job weekend days).
Balance: Tonight picks give small, tapering effects; skipping them never hurts, but never helps either.

### i25-a23 Bundle: A week recap that tells a story (M, 🟠)
The recap tells a tiny story: money in day order, weather by day, the week's best moment, a one-word Sunday-night feeling and quick reactions. Small notes go to the strip, and stacked sheets show a counter.
Covers: i22-b03, i22-b13, i22-b26, i22-b12, i22-b10, i22-b11, i22-b14, i22-b29.
One design: One recap sheet replaces the stack of small result sheets.
Files: ui.js (recap sheet, week strip), turn.js (week log in day order).
Balance: Display only; fewer sheets make careful play faster, not idle play better.

### i25-a24 Bundle: Faster quiet weeks (M, 🟠)
Quiet weeks play faster: a turn-budget test keeps a week under 20 seconds, Auto skips redraws, a turbo setting drops animations, skipped weeks get a one-line digest, the turn fits one thumb, and events with no choice don't stop a skip.
Covers: i22-b04, i22-b15, i22-b22, i22-b24, i16-b26, i3-b15, i2-a13.
One design: Turbo and Auto share one 'no redraw' path; the digest is how skipped weeks still get read.
Files: turn.js (playWeeks), ui.js (redraw, turbo setting, layout), tests (turn budget).
Balance: Speed only; events that need a choice still stop, so skipping can't dodge them.

### i25-a25 Bundle: Open a shop on Main Street (L, 🔴)
A fourth kind of business: pick a bakery, hardware and feed, gift or bike shop, name it and hang the sign, rent the space or buy the old brick building, take a bank loan, do the permit run and cut the ribbon. A storefront bot joins the balance sim.
Covers: i23-b01, i23-b02, i23-b29, i23-b05, i23-b04, i23-b03, i23-b06, i23-b33.
One design: The shop type list drives everything else; the loan reuses the debt code.
Files: features.js (new business kind), ui.js (shop setup sheets), maps.js (sign on Main Street), tests/sim.test.mjs (storefront bot).
Balance: Startup costs and the loan mean a careless owner loses money; the bot proves a good owner can't run away with the score.

### i25-a26 Bundle: Running the shop week to week (M, 🔴)
A 'Behind the counter' focus for owners, stock to order before busy weeks with the distributor on Tuesdays, festival weekends to staff up for, a first employee who is a real person (raises, sick days, quitting) with payroll and workers' comp, and a profit-and-loss on the business card.
Covers: i23-b10, i23-b11, i23-b12, i23-b14, i23-b07, i23-b08, i23-b09, i23-b22.
One design: Employees and payroll are one system; the P&L reads stock, payroll and sales from the same weekly shop tick.
Files: features.js (shop tick, employees), ui.js (focus grid, business card P&L), events.js (employee events).
Balance: Shop income needs owner weeks or a paid employee; ignoring it lets stock spoil and sales slide.

### i25-a27 Bundle: Shop customers, rivals and selling out (M, 🟠)
Seasonal customers (riders, hunters, wine weekends), regulars at the counter, a reputation built by word of mouth, a Tattler ad plan, the pull of the big store in Walla Walla, owner's draw or reinvest, and a way out: sell through a broker or to your longtime employee.
Covers: i23-b13, i23-b28, i23-b18, i23-b17, i23-b15, i23-b21, i23-b30, i23-b31.
One design: Reputation is the one number customers, ads and the sale price all read.
Files: features.js (shop reputation, sale value), events.js (customers, big-store events), ui.js (draw sheet, sell sheet).
Balance: Sale price follows real profit and reputation, so a neglected shop sells for little.

### i25-a28 Bundle: A quiet values profile (M, 🔴)
Your choices quietly build a values profile that can flip over time; some choices echo back weeks later, folks greet you by your leanings, the Tattler prints what you did in public, results are written in your voice, and the end screen says what you stood for. A guard test proves values never touch the score.
Covers: i24-a01, i24-a02, i24-a03, i24-a30, i24-a20, i24-a27, i24-a19, i24-a21.
One design: The profile and echo queue come first; greetings, Tattler and the end line all just read the profile.
Files: state.js (S.values, echo queue), events.js (choice tags, echo events), ui.js (end screen line), tests (values-score guard).
Balance: Values never change the score, so there's no 'right' leaning to farm.

### i25-a29 Bundle: Small dilemmas, well paced (M, 🟠)
A first pack of everyday hard choices (covering for a coworker, the wallet, too much change, the dinged car, the friend's pie) marked with a scale icon showing both sides' cost, paced to one every six weeks and written to a short rules page.
Covers: i24-a05, i24-a06, i24-a07, i24-a08, i24-a09, i24-a28, i24-a29, i24-a31.
One design: Pacing and the writing rules ship with the first five so later packs follow the same shape.
Files: events.js (dilemma pool, pacing), docs (writing rules), ui.js (scale icon on choices).
Balance: Both sides cost something; pacing stops dilemmas crowding out stat-building weeks.

### i25-a30 Bundle: Memories that last a lifetime (M, 🔴)
A memory list that lasts the whole life: memories come back on their date years later, fade unless you revisit them (with 'look through the box' as a Rest choice), lift you in rough stretches, and add up to remembered happiness on the end screen. Doing things lingers; buying things fades.
Covers: i24-b01, i24-b03, i24-b05, i24-b04, i24-b23, i24-b20, i24-b21, i24-b30.
One design: One memory record feeds the anniversary, fade, comfort and end-screen ideas.
Files: state.js (S.memories), turn.js (date check, fade), ui.js (Rest choice, end screen), tests (balance check).
Balance: A balance check proves skipped weeks never make memories, so idle play gains nothing.

## Ideas 25: Cozy and calm

Ideas for players who want a gentle small-town life: quiet moments, calm pacing, softer setbacks in a new Cozy mode, small kindnesses, and quiet weeks that feel good.

### i25-b01 Cozy mode: normal pace, softer landings (L, 🔴)
A fourth entry in MODES (state.js), picked on the start sheet.
Relaxed changes the numbers (slower drains, debt floor). Cozy keeps Normal's numbers and changes the shape of setbacks: ideas b02–b06 are its rules.
Touches state.js MODES, bestKey, turn.js and the event picker in events.js.
Balance: best scores stored under a 'cozy' key, never compared with Normal. Debt can still end a Cozy life, so careless play still loses.

### i25-b02 Cozy: big bills split into four weekly pieces (S, 🔴)
A truck repair or ER bill shows as '1 of 4' on the week strip.
Queue in S.softBills, paid in turn.js before the week's money line.
Balance: the total is the same, no interest is dropped. Only the timing is gentler.

### i25-b03 Cozy: a neighbor shows up in bad moments (S, 🟠)
A wrapper around event results in events.js adds a helper line from a short list.
Uses named neighbors if that system is built, otherwise 'a neighbor'.
Balance: only 25% off, and only in Cozy, whose scores are kept separately.

### i25-b04 Cozy: never two rough weeks in a row (S, 🟠)
Tag events by their usual net effect; the picker in events.js skips bad ones for one week after a bad one.
Losing a pet, friend or job also gets this quiet week after.
Balance: setbacks still happen at about the same rate; they just don't pile up.

### i25-b05 Cozy: a month's notice before a layoff (S, 🟠)
turn.js layoff roll sets S.noticeWeeks instead of clearing the job.
Jobs tab shows a calm notice banner.
Balance: same layoff odds; a careless player who ignores the notice still ends up unemployed.

### i25-b06 Cozy: health scares stay scares (S, 🟠)
Health events in events.js get a cozy weight for the mild outcome.
Late-life risks stay, just softer.
Balance: the clinic visit still costs money and a week; skipping checkups still raises risk.

### i25-b07 Cozy score: contentment counts more than net worth (M, 🟠)
New weights in the end-score function (features.js / ui.js end screen) when mode is cozy.
Uses 'good weeks' if that idea is built.
Balance: happiness and community still need focus choices each week, so idle play stays low; the sim (b32) checks idle <= 50.

### i25-b08 Cozy wording for setbacks (S, 🟡)
Event text gets an optional cozy variant through the say() helper or a small word swap table.
ui.js skips the red toast style in Cozy.
Balance: words only; no numbers change.

### i25-b09 A quiet week, said kindly (M, 🔴)
A word-list builder in a new js/calm.js picks a scene from what you have (home type, pet, kids, season, job).
Shown in the week recap in ui.js when no event fired.
Balance: text only, no stat change, so it can't reward doing nothing.

### i25-b10 Three small good things (S, 🟠)
Lines are picked from state: garden, kids, partner, pet, job, savings.
Lives in js/calm.js with the quiet-week line.
Balance: text only. A life with more in it gets better lines, which nudges toward living, not idling.

### i25-b11 Sit on the porch: see who walks by (M, 🔴)
Button on Home (ui.js), scene text from js/calm.js using the season and named neighbors if built.
Each porch scene can also start a front-porch ask now and then.
Balance: +1 happiness, once a week, far less than any focus. The sim gives every bot the tap so careless and idle scores are checked.

### i25-b12 The creek at dusk (M, 🟠)
New place in outabout.js and a pin in maps.js by the Coppei Creek label.
Scene text changes by month.
Balance: small happiness, once a month, tapers like other visits.

### i25-b13 Snow falling on Main Street (M, 🟠)
CSS snowfall layer in ui.js, only in Dec–Feb snow weeks; off when reduced motion is on.
One Journal line per winter.
Balance: looks only, no effect on play.

### i25-b14 Calm moments through the year (L, 🟠)
A 'moment' event category in events.js with no cost and one button; each fires once a year at most.
Each gets a simple drawn scene, matched to Waitsburg.
Balance: +1 happiness each, about a dozen a year, small next to focus effects.

### i25-b15 A quiet moments album (M, 🟡)
Album list in S.moments; a count kept in local storage across lives.
Journal tab gets an 'Album' chip.
Balance: collection only, no score.

### i25-b16 A Gentle pace setting (M, 🔴)
Settings flag read by ui.js and the CSS animation timings.
Builds on reduced motion but is a choice, not a phone setting.
Balance: presentation only.

### i25-b17 A small-gift shelf (M, 🟠)
S.gifts list; Rest weeks or a woodshop visit can make one.
events.js adds 'Bring something from the shelf' to fitting events with a slightly better result.
Balance: gifts cost a Rest week or money to make, and the bonus is small community.

### i25-b18 The casserole dish that goes back and forth (S, 🟠)
A slow chain in features.js, every 8–16 weeks while you keep returning it.
Uses named neighbors if built.
Balance: +1 community and +1 happiness each turn of the loop; returning costs a little grocery money.

### i25-b19 Too much zucchini (S, 🟠)
Yearly event in events.js for August; garden owners get the 'leave a bag' choice.
A funny small-gift moment.
Balance: tiny effects, once a year.

### i25-b20 A comfort routine you pick (M, 🟠)
S.ritual with a streak in turn.js; shown under the focus grid.
Missing a week costs nothing; the streak just pauses.
Balance: softens drops by 1–2 at most, some routines cost a few dollars, and it never adds happiness by itself.

### i25-b21 A bird feeder by the kitchen window (S, 🟡)
Home upgrade in features.js, a weekly line from a seasonal bird list.
Feeds the wildlife life list if that is built.
Balance: costs a little each month; +1 happiness in winter only.

### i25-b22 A stray cat that chooses you (M, 🟡)
A slow chain in features.js that ends in a pet entry in the pet system.
You can't force it; it picks its week.
Balance: same upkeep and effects as any pet.

### i25-b23 Rain on the roof (S, 🟠)
Event in events.js for wet months, fall to spring.
Each choice is small and calm.
Balance: small effects; a couple of times a year.

### i25-b24 Soup weather: the first cold week (S, 🟠)
Yearly event in events.js in October or November.
Sharing ties to community; keeping it saves a little grocery money.
Balance: small effects, once a year.

### i25-b25 Calm weeks on the end screen (S, 🟡)
Count in turn.js, shown in the end screen in ui.js.
Text only; not part of the score.
Balance: no score effect, so it can't be gamed.

### i25-b26 Swap books with a neighbor (S, 🟠)
A slow chain in features.js, tied to the library if the book club is built.
Each finished book is a Journal line.
Balance: +1 community, +1 happiness each swap.

### i25-b27 Calm sounds while you plan (M, 🟡)
Made in code with Web Audio noise and filters, no sound files, so it works offline.
Settings toggle; stops when the app is hidden.
Balance: sound only.

### i25-b28 Hunker down: a winter focus (S, 🟡)
New focus in FOCUS (state.js), only shown in winter.
Effects sit between Rest and nothing.
Balance: weaker than Rest for stats; only the gas saving is better, and it can't beat good play.

### i25-b29 Holiday baking for the street (S, 🟠)
Yearly event in events.js; uses named neighbors if built.
Ties to the gift shelf (b17).
Balance: small cost, small community, once a year.

### i25-b30 Write a thank-you note (S, 🟡)
Follow-up choice on helping events in events.js.
Pairs with the corkboard of thank-you cards idea.
Balance: tiny effect, only after help events.

### i25-b31 Cozy explained next to Relaxed on the start sheet (S, 🔴)
Start sheet in ui.js and a Help section in help.js.
Shows a mode chip on the header and save slots.
Balance: text only.

### i25-b32 The balance sim plays Cozy too (S, 🔴)
Add 'cozy' to the mode list in the balance sim under tests/.
Fails if softer setbacks let idle play score too high.
Balance: this is the check that keeps Cozy honest.
