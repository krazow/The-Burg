# Ideas round 56

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 56: Signature moments

The single best scenes a life in the Burg could hold, each with a trigger, a few lines of text, a choice, its effect and how rare it is.

### i56-a01 Signature scenes: a full-page sheet, a gold edge and a pacing rule (M, 🔴)
- What: a `sig:1` flag on an event gives it the big sheet, a gold edge, and a line kept in `S.moments` (max 30).
- How it plays: you never get two in a season, and ⏩ skips stop so you see it, not a toast.
- Touches: events.js (`showEvent`, `pickEvent` cooldown `S.sigCd`), ui.js (sheet style, end screen), turn.js (skip stop).
- Balance: the shelf is flavor; no score points of its own.

### i56-a02 Directions that use your place as the landmark (S, 🔴)
- Text: "Turn left past ___'s place. You can't miss it, the blue porch." You're standing right there.
- Choices: wave and grin (+3 happy); walk them over (+2 community); give the back-road shortcut (+1 both).
- Effect: your house gets a 📍 label on the town map for the rest of the life. Once per life; about 1 in 3 long games see it.
- Touches: events.js, maps.js (home pin label), state.js flag. Balance: needs years of owning and showing up, so idle and careless play never reach it.

### i56-a03 Sandbags at the Preston Avenue bridge at 2 a.m. (M, 🔴)
- Text: "Headlamps on the bridge, the river loud as a highway. Someone hands you a shovel."
- Choices: bucket line (−6 health, +8 community, +4 happy); coffee run (−$40, +5 community); guard your own place (no flood damage roll on your home).
- Effect: the Tattler and café talk name you the next week. Rare: a flood year is about 1 in 15 years; once per flood.
- Touches: events.js (chain off the river event), turn.js. Balance: the selfish choice is safe, the giving one costs health; neither is free score.

### i56-a04 Your kid's name read out in the gym (M, 🔴)
- Text: "Folding chairs, a box fan, the band a beat behind. Then your kid's name."
- Choices: holler (+5 happy; years later the kid tells the story at your birthday); quiet clap (+3); film it (+3, a fridge-door photo).
- Effect: if you chose Work extra that week you miss it, and the Journal says so for good. Once per kid.
- Touches: events.js (kids array, June), ui.js Journal. Balance: missing it is a real cost to grinding, not to careful play.

### i56-a05 The last tune you call at the jam (M, 🔴)
- Text: "Everybody waits on you to kick it off. Your hands know this one better than your head."
- Choices: mentor's tune (+6 happy); your own song (+4 happy, the band keeps playing it in later lives); give the fiddle away (+6 community, your heir or the kid starts with music).
- Effect: closes the jam for this life with a lasting small happiness floor. Once per life, maybe 1 in 6 Lifetime games.
- Touches: features.js (jam ladder), events.js, state.js heir start. Balance: needs decades of jam weeks.

### i56-a06 The car in the ditch on 12, and who it turns out to be (M, 🔴)
- Text: "Hazards blinking in the snow past Dixie. A kid in a sedan, no gloves."
- Choices: tow strap and an hour (−1/4 day's pay, sets an echo); call it in and drive on (nothing comes back).
- Payoff: a short scene later: "You're the one with the tow strap." +6 community, a small favor (a shorter wait, a good word).
- Touches: events.js (road cat), an echo queue in state.js. Rare: about 1 in 4 long commuters. Balance: costs pay now, pays only in standing later.

### i56-a07 CPR in the bleachers (M, 🟠)
- Text: "The band stops. Somebody screams for a doctor. Nobody moves."
- Choices: compressions (he lives 70% with the card; +10 community either way); run the crowd and the 911 call (+5 community).
- Effect: if he lives he leaves a pie on your porch every fall. About once per lifetime; can't happen without the card.
- Touches: events.js, the CPR card from the care jobs, features.js. Balance: the class costs weeks first.

### i56-a08 Fish of a lifetime on the Touchet (S, 🟠)
- Text: "The rod bends to the water and keeps going."
- Choices: photo and release (+6 happy); mount it at the café (+3 happy, +3 community, −$150); call your kid (+5 happy, the kid's 'remembers' line).
- Effect: the fish shows on the café in Out and about from then on.
- Touches: events.js, outabout.js. Balance: tied to real outdoor weeks; tiny stat bump.

### i56-a09 Your initials on the repainted welcome sign (S, 🟠)
- Text: "Fresh paint, a ladder, and the whole valley behind you."
- Choices: your initials (+4 happy); decline (+2 community); your kid's too (+3 happy, kid flag).
- Effect: a tiny mark on the sign pin of the town map, visible in later lives too. Once per life.
- Touches: events.js, maps.js. Balance: gated on finished town goals.

### i56-a10 Sunrise from Lewis Peak after the worst year (S, 🔴)
- Text: "Wheat to the edge of the world, and you're still here."
- Choices: speak (+6 happy); sit (+5 happy, +2 health); call them (+4 happy, +4 community, that NPC gets warmer).
- Effect: the Journal turns the rough stretch into "came through it". Once per life.
- Touches: events.js, turn.js (track the low stretch), ui.js Journal. Balance: needs a real recovery, not a coast.

### i56-a11 The boss who let you go applies to work for you (M, 🟠)
- Text: "Same handwriting as your pink slip."
- Choices: hire (+3 community, small team boost); pass (+3 happy); hire and stay quiet (+5 community, they become a loyal coworker).
- Effect: once per life, maybe 1 in 8 lives.
- Touches: events.js (work cat), state.js (layoff history), features.js coworkers. Balance: only after recovering from a layoff.

### i56-a12 Asked to carry the casket for the old-timer who taught you (M, 🟠)
- Text: "His grandson hands you a white glove. Your hands remember his handshake."
- Choices: carry (+4 community); eulogy (+6 community, −2 happy that week); handshake (+2).
- Effect: the family gives you his fly rod, fiddle or level, a keepsake that adds to that hobby. Once per life.
- Touches: events.js, outabout.js (old-timer visits), features.js keepsakes. Balance: earned by many visits.

### i56-a13 Last night at the tavern before your best friend moves (S, 🟠)
- Text: "Last call. They're not looking at the door, they're looking at you."
- Choices: close the place (+5 happy, −$40); pack the truck (+3 happy, +2 health); ask them to stay (a gamble).
- Effect: if they leave, letters come twice a year. Once per friend.
- Touches: events.js, the best-friend NPC. Balance: no money or score swing worth chasing.

### i56-a14 The town picks you to flip on the Main Street lights (S, 🟠)
- Text: "Count down from ten, the whole street counting with you."
- Choices: you (+5 happy); with the kid (+5 happy, kid flag); give it away (+6 community).
- Effect: once per life, top-tier standing only.
- Touches: events.js (December), the holiday lighting event. Balance: needs years of showing up.

### i56-a15 Your folks sign the farm over at the kitchen table (L, 🔴)
- Text: "Dad slides the pen across the oilcloth and won't look up."
- Choices: take it (farmhouse home + wheat lease, ongoing work and risk); sell (one-time cash split three ways, −4 happy); lease (smaller steady check).
- Effect: the biggest fork in a Farm kid life. Once.
- Touches: state.js (HOMES.farm, wheat lease), features.js, events.js. Balance: each choice trades risk for steadiness; none beats steady play by itself.

### i56-a16 The kid you coached comes back grown (S, 🟠)
- Text: "You won't remember me. You told me to keep my elbow in."
- Choices: coffee (+5 happy); hand them the clipboard (+4 community, they run it next year); shrug (+3 happy).
- Effect: they become a regular NPC. Once per life.
- Touches: events.js, features.js (coaching, slow jam). Balance: pays back long-past volunteering.

### i56-a17 Somebody in Richland has heard of you (S, 🟠)
- Text: "Fifty miles from home and your name got there first."
- Choices: own it (+4 happy); credit the town (+3 community); change the subject (+2 happy).
- Effect: once per life. A small hiring edge in the Tri-Cities for a year.
- Touches: events.js (work cat), state.js. Balance: rare, top-tier standing.

### i56-a18 Your grown kid buys a house two streets over (M, 🔴)
- Text: "They want their kids to grow up where they did."
- Choices: co-sign (+6 happy, risk if they miss payments); move them in (+5 happy, −2 health); push them out (+2 happy, they may come back later).
- Effect: grandkids nearby, Sunday dinners, and a stronger heir. About 1 in 4 lives with kids.
- Touches: events.js, state.js kids/heir. Balance: needs a long game and roots.

### i56-a19 The first snow with nowhere to be (S, 🟡)
- Text: "No alarm. No Highway 12. Just snow."
- Choices: window (+6 happy); shovel (+4 community, −2 health); drive by (+3 happy, a wistful Journal line).
- Effect: once per life.
- Touches: events.js (retired, winter). Balance: small; only once.

### i56-a20 Your last day: the crew lines the hallway (M, 🔴)
- Text: "Someone starts clapping and it doesn't stop."
- Choices: speak (+5 happy, +3 community); slip out (+3 happy); leave the tools (+5 community, the new hire visits later).
- Effect: once per life; any job, not just Hanford.
- Touches: events.js, the retire flow in features.js. Balance: tied to long tenure, which steady play earns.

### i56-a21 The 3 a.m. drive to the Walla Walla hospital (M, 🔴)
- Text: "Twenty-one miles, one hand on the wheel, one being squeezed."
- Choices: careful (safe, +5 happy); fast (5% the baby is born in the truck at Dixie, a story the town tells forever); ambulance (−$300, safe, +3 community).
- Effect: the birth story becomes the kid's first Journal line. Once per kid.
- Touches: events.js ('Starting a family?' follow-up), turn.js. Balance: no wrong choice, only stories.

### i56-a22 Your kid's last-second shot and the gym goes up (S, 🟠)
- Text: "Every Waitsburg voice in the building, then none."
- Choices: on your feet (+6 happy); filming (+4 happy, a shared clip); eyes shut (+5 happy, a family joke for years).
- Effect: the café talks about it for a month (+3 community). Once per kid.
- Touches: events.js ('Friday night game'). Balance: needs you to be there.

### i56-a23 Buy back the house you grew up in (M, 🟠)
- Text: "Your height marks are still on the pantry door."
- Choices: buy (a new home at +10% price, +8 happy); let it go (+2 happy); walk through (+5 happy, free).
- Effect: once per life. The free choice is almost as good, so it isn't a money trap.
- Touches: events.js, state.js HOMES. Balance: the price premium keeps it from being an optimal buy.

### i56-a24 Your kid out-fishes you for the first time (S, 🟡)
- Text: "They hold it up with both hands and look at you, not the fish."
- Choices: tease (+4 happy); brag (+3 happy, +2 community); pretend (+3 happy, they call you on it at 40).
- Effect: once per kid.
- Touches: events.js (outdoors + kids). Balance: tiny.

### i56-a25 Two people at the old bachelor's funeral (S, 🟠)
- Text: "Just you, the pastor and a dog nobody claimed."
- Choices: go (+5 community, you take the dog home); flowers (+2); skip (nothing).
- Effect: the next year the town does better: a bench at the cemetery and a bigger turnout at funerals in this life.
- Touches: events.js, the pet system. Balance: kindness is the reward.

### i56-a26 The first year Thanksgiving is at your house (S, 🟠)
- Text: "Twenty-two chairs and only nineteen match."
- Choices: tables through the house (+6 happy, −$180); potluck (+4 happy, −$40); the Grange (+3 community, −$120).
- Effect: hosting passes to you for the rest of the life. Once.
- Touches: events.js (November), state.js. Balance: costs money; no score shortcut.

### i56-a27 The pass closes and strangers sleep in the school gym (M, 🟠)
- Text: "A trucker from Montana, a family from Spokane, a man with a parrot."
- Choices: gym (+6 community, −2 health); spare room (+5 happy, one guest who writes later); stay home (+2 health).
- Effect: a postcard from one of them comes a year later. About 1 in 10 winters.
- Touches: events.js (winter), maps.js gym pin. Balance: helpful choices trade health for standing.

### i56-a28 Guard test: signature moments can't be farmed (S, 🔴)
- What: a rules test plus a sim tally of signature moments per bot.
- Checks: idle median stays ≤ 50 and careless ≤ 60; good play still ≥ 70 with moments turned off.
- Touches: tests/rules.test.mjs, tests/sim.test.mjs. Balance: this is the balance note.

## Ideas 56: Test coverage gaps

One concrete test per idea, from reading tests/*.test.mjs against js/*.js and measuring 90 bot games (37,103 weeks).

### i56-b01 A broken save never locks you out of the title screen (S, 🔴)
Measured: a slot entry of `1`, a slot of `{"name":"Half"}`, or an old `theburg.save.v2` of `"x"` or `{"name":"Old"}` all throw "reading 'slice'" and the title never draws. The game cannot be opened again until storage is cleared.
How: one browser context per case, an init script that writes the bad value once, then wait for `#start` and assert no `pageerror`. Tap Continue and Your records when shown.
Touches: tests/explore.test.mjs only (the fix is in slots() and migrate in js/state.js).
Balance: none.

### i56-b02 A player name with HTML in it shows as plain text everywhere (S, 🔴)
Measured: the name `<img src=x onerror=...>` fires on the Journal (log lines put the name in raw) and in finish() (the ending text). Other tabs escape it.
This is the regression test for i12-b18. Also check the name text is visible as typed on Home and the end screen.
Touches: tests/flows.test.mjs; type the name into `#nm` so the real title path is used.
Balance: none.

### i56-b03 Open-bug repros that stay quiet until the fix lands (S, 🔴)
Each entry: `{ id, title, repro: async page => bool, fixed: false }`. Open entries never fail the run; fixed entries do. The summary prints the open count.
Holds the repros in the ideas below for rounds 22 and 54. Grep check: none of the i22-a bugs and none of the i54-a bugs are fixed in js/ yet (no S.pendingEv, no S.ui reset on hire, tuition unchecked).
Touches: new test file, package.json "test" script. Keeps CI green while the list is worked down.
Balance: none.

### i56-b04 Repro: reloading during an event shows the same event again (i22-a01) (S, 🔴)
How: override pickEvent to return "Layoffs" for one roll, click End Week, `page.reload()`, Continue, then assert the sheet title and that `S.evCd["Layoffs"]` only counts once the choice is made.
Goes in tests/bugs.test.mjs as open until i22-a01 is built, then moves to tests/gameplay.test.mjs.
Balance: closes a dodge that helps careful players who reload, not idle play.

### i56-b05 Repro: an ending behind a notes sheet survives a reload (i22-a02) (S, 🟠)
How: S.health = 0, S.ageMonths just under 70×12 so the 🎂 note fires, End Week, reload, check `slots()[slot]` is null or the end screen shows the same reason.
Touches: tests/bugs.test.mjs (open), then tests/gameplay.test.mjs.
Balance: stops rerolling a Lifetime death.

### i56-b06 Repro: the wheat lease pays only for seasons it farmed (i22-a04–a06) (S, 🟠)
How: startBiz("wheat") with S.date in August, tick 2 weeks, expect no "Harvest is in" note; set S.biz.weeks = S.biz.lease + 2 in August, tick, expect no payout; renewLease() then compare bizValue() to leaseCost().
The current test (R13) only checks that value falls 5% a year and the lease must be renewed.
Touches: tests/bugs.test.mjs (open). Balance: removes about $6,900 of free money a planner bot can get.

### i56-b07 Repro: a new job ends benefits; a raise keeps job time (i22-a03, a11) (S, 🟠)
Today "unemployment benefits last 6 months" is tested only for someone who stays out of work.
How: S.ui = 26, apply("farmhand") with S.practice, assert S.ui === 0; S.jobMonths = 30, run the raise choice, assert S.jobMonths >= 30 (or the new lastRaise field moved).
Touches: tests/bugs.test.mjs. Balance: stops quit-later benefit banking.

### i56-b08 Repro: a new car or house drops the old one's extras (i22-a08, a26) (S, 🟠)
How: S.tires = "sedan"; buyCar("truck"); buyCar("sedan"); assert S.tires is not "sedan". For the house: run the porch choice, moveHome("rent"), moveHome("fixer"), assert "The porch is sagging".when() is true or the chain is reset.
Today flows only checks the money side of buyCar and moveHome.
Touches: tests/bugs.test.mjs. Balance: none.

### i56-b09 Repro: helping with college never ends the game by itself (i22-a16) (S, 🟠)
How: fresh life with S.kids = [S.ageMonths - 18.2*12], S.money = 2000, S.loan state near the line; run choices()[0].go() if shown and assert S.money > debtEnd.
Touches: tests/bugs.test.mjs. Balance: debt endings should come from player choices, not one tap.

### i56-b10 Repro: old saves and Hard mode price the mortgage right (i22-a18, a20) (S, 🟠)
The current migrate test only uses col 1, so `mortgage === 950` passes either way.
How: migrate({ name:"Old", len:"two", home:"fixer", money:5, col:1.5 }).mortgage ≈ cost-at-col; Hard owner: compare the housing bill line to Normal.
Touches: tests/bugs.test.mjs. Balance: Hard stays hard for renters only, as its text says.

### i56-b11 Repro: backups with odd parts restore safely (i22-a21, i54-a11, a12) (S, 🔴)
Today the restore test checks junk is rejected, but not a life that passes ok() and then crashes render (HOMES[S.home].own).
How: readBackup(JSON.stringify(...)) then restoreBackup(bk, "replace"), loadSlot(0), render each tab; check #sheet text for "Invalid".
Touches: tests/bugs.test.mjs. Balance: none.

### i56-b12 Repro: a trip keeps 1 stop if you fall into debt (i22-a25) (S, 🟠)
B5 is tested only at planning time ("trips while in debt are one stop").
How: planTrip("wallawalla", three ids); S.money = -500; weekTick(false); count "Trip to" log stops.
Touches: tests/bugs.test.mjs. Balance: stops a debt-time trip exploit.

### i56-b13 Repro: jam on jam weeks; gas spike uses real drive (i22-a13, a14) (S, 🟡)
How: sweep S.turn with a forced pick and compare jamWeek() for S.turn + 1; for gas, set jobId "scientist", carpool on, read the choice label amount.
Touches: tests/bugs.test.mjs. Balance: fair costs for commuters who plan.

### i56-b14 Repro: tutorial look-only step and Help close cleanly (i54-a10, a17) (S, 🟠)
These two were left out of the i54-a26 bug file list.
How: startTutorial(), advance with #cnext to the step, click the ringed element, assert `#modal` hidden; for Help, assert `#help` hidden after endTutorial.
Touches: tests/bugs.test.mjs. Balance: none.

### i56-b15 Repro: same backup file twice; focus after full slots (i54-a21, a22) (S, 🟡)
How: setInputFiles twice with the same path and count status messages; read document.activeElement.id after the check.
Touches: tests/bugs.test.mjs. Balance: none.

### i56-b16 Every event has a way to happen: a reach table (M, 🔴)
Measured: in 90 bot games (37,103 weeks, all 9 bots, all lengths) 6 of 109 events never fired: Feeling run down, A rude customer, Harvest crunch, and the 3 fixer-upper steps. "The levee is dedicated" fired once.
Unlike the event coverage report (i26-b26), this fails on a dead event and needs no luck.
How: EVENT_REACH = { "Harvest crunch": { jobId:"elevator", month:7 }, ... }; force cat via pickEvent(month, cat) in a seeded loop of 200 tries.
Touches: tests/rules.test.mjs. Balance: none.

### i56-b17 Every job gets worked in the sim (M, 🔴)
Measured: the 9 bots held only 9 of 32 jobs (airport, scientist, RN, farmhand, Hanford, apprentice, food plant, cellar, onion). Never held: every Main Street job, diner, para, elevator, insure, CNA, mechanic, trucker, rail and 10 more.
That is why "A rude customer" (service jobs) and "Harvest crunch" (elevator/cellar/onion) never fire in the sim.
How: set S.jobId directly with S.edu = job.edu, count work events per JOB_GROUP, assert each group saw at least one.
Balance: reporting only; the ceilings still use the 9 old bots.

### i56-b18 A worn-out bot that hits the hospital and the clinic (S, 🟠)
Measured: 0 hospital stays and 0 early-death endings in 90 bot games; every bot rests below 45 health, and "Feeling run down" needs health under 40.
Today the hospital is tested only by forcing health to 0 (flows) and one overtime rules check.
Touches: tests/sim.test.mjs, its own report row. Balance: shows careless overwork scores low; not in the medians.

### i56-b19 A big-spender bot that reaches the debt ending (S, 🟠)
Measured: 0 debt endings in 90 bot games. The debt ending and the B5 one-stop rule are only tested by setting S.money by hand.
Touches: tests/sim.test.mjs (uses moveHome, buyCar and planTrip as a player would).
Balance: confirms spending your way through life scores below careless and idle targets.

### i56-b20 The screen audit covers events, notes and the year in review (S, 🔴)
Measured: the audit checks 22 screens at every size, but none of these, though the event card is the sheet players see most.
Each gets the same checks: width, tap size, text size, contrast, names, leftovers.
How: open each with its function (showEvent, showReview, bankSheet, legacySheet, backupSheet, restoreSheet) after closeSheet().
Balance: none.

### i56-b21 Every event choice works for a broke 19-year-old too (S, 🟠)
Measured: under the current rich test life (cellar job, $60,000, partner, age 45) no choice is hidden by its `if`, so the low-money branches inside go() and the hidden-choice paths are never drawn.
Touches: tests/flows.test.mjs, a second base in the same loop (about doubles that check's time; run it at the rules level without screens to keep it fast).
Balance: none.

### i56-b22 Debt and the last week: which ending wins, at the exact line (S, 🟠)
Today: weekTick checks "in the books" before debt, so the last week in debt never says you left town. The current test only checks a life far below the line.
Write the expected reason down in the test so a change is on purpose.
Touches: tests/rules.test.mjs. Balance: the debt ending is part of the careless floor.

### i56-b23 Real saves from every tagged version, kept as fixtures (M, 🔴)
Today the "0.1.0-era save" test is made from today's newGame with fields deleted, so it misses fields that changed shape, old Journal entries and old best-score keys.
Beta testers have beta saves, so the beta tags matter. The script runs once per release; fixtures are committed.
Touches: tools/make-save-fixtures.mjs, tests/explore.test.mjs. Balance: none.

### i56-b24 Backup codes made by older versions still restore (S, 🟠)
Today backups are only round-tripped inside the current version.
Touches: tests/fixtures/backups/, tests/rules.test.mjs. Balance: none.

### i56-b25 Story chains: every branch to its end (M, 🟠)
Today only the fixer-upper DIY path is tested; the food truck has no chain test and the levee only its 8-week window (R10). In the sim "The levee is dedicated" fired once in 37,103 weeks.
How: drive chainSet/chainAt with S.turn = chain.at between steps, as the current fixer test does.
Touches: tests/rules.test.mjs. Balance: check no branch pays more than it costs over the chain unless it took real effort.

### i56-b26 A 4-week skip and four single weeks end the same (S, 🟡)
The skip path settles one-choice events inside weekTick, before the date moves; nothing checks it matches normal play. (i22-a22 adds a skipping bot for scores; this is an exact match test.)
Touches: tests/rules.test.mjs. Balance: skipping should never be better or worse than tapping.

### i56-b27 Event perks last their window and no longer (S, 🟡)
Measured: snowChains, applyBoost, gasFriend and tradeBy are named in no test; skiPass, hireBy and healthPlan appear once or twice.
How: run the event choice, then check apply odds, medBill, trade price or road event weight before and after the end week.
Touches: tests/rules.test.mjs. Balance: perks should not stack forever for free.

### i56-b28 Long lives keep their lists short (S, 🟡)
Measured: no test reads the pin cap or yearEvents; only the 120 log cap is named.
Touches: tests/rules.test.mjs. Balance: none.

### i56-b29 A practice life leaves no records behind (S, 🟡)
Today S.practice is tested only for "always hired".
Touches: tests/rules.test.mjs. Balance: practice must not feed records.

### i56-b30 Heir names at the edges (S, 🟡)
toRoman and fromRoman are named in no test; R5 checks one name.
Touches: tests/rules.test.mjs. Balance: none.

### i56-b31 Business rules past the happy path (S, 🟡)
Measured: renewLease and sellBiz never ran in the V8-sampled bot games; the business test covers only start, earn and sell for 60%.
Touches: tests/rules.test.mjs. Balance: no buy-sell loop beats normal play.

### i56-b32 Same game in any time zone (S, 🟡)
Measured: all four match today ($21,852, 26 events, 2 reviews). The test stops a future change from switching date math to UTC by accident (players are mostly in Pacific time, with summer time shifts).
How: Playwright context timezoneId per zone.
Touches: tests/rules.test.mjs. Balance: none.

### i56-b33 Reduce Motion stops the game's animations (S, 🟡)
The CSS has two prefers-reduced-motion rules; no test emulates the setting.
Touches: tests/screens.test.mjs. Balance: none.
