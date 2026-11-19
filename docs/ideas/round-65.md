# Ideas round 65

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 65: Bundles part 9 and v1.3

29 bundles that group the round 61–64 ideas and the round 55–60 leftovers (debt in the score, backups, honest event odds, Spanish, humor, the Touchet River and small content), leaving out anything the 0.2.2 patch plan (round 64) or the 0.2.1 hotfix already fixes, and one release plan for v1.3.

### i65-a01 Bundle: Debt counts in the Life Score (M, 🔴)
A life spent deep in debt stops scoring like a steady one: the money part is scaled against $90,000 in every length, floored at −20 on Relaxed and −33 elsewhere, and weeks below −$1,000 add a small drag. New players get 8 weeks of grace, bad-luck debt drags at half, and climbing back out wins most of it back plus 2 points.
Fixes the playtest life that never worked, ended at −$29,151 and still scored 57.
Touches lifeScore() and scoreCard() in js/features.js and a weekly debt-week counter in js/turn.js weekTick.
Balance: aims the jobless bot well under 50 and the careless median under 60; good play barely moves because it rarely sits in debt. Ship with bundle 02 so the sim proves it.
Covers: i62-a04, i63-a01, i63-a02, i63-a03, i63-a04, i63-a05, i63-a08, i63-a09.

### i65-a02 Bundle: Debt in the score, shown and tested (M, 🔴)
The score sheet gets a 💳 Debt line saying what debt costs and what climbing out wins back, the arrow says "▼3 debt", and the first debt week and the −$15,000 card warn in plain words with a weeks-left pace. Three new sim bots, a guard test that more debt never raises the score, debt columns in the balance report and a Help section keep it honest.
Shows the player the rule from bundle 01 before it costs them.
Touches showScoreNow() and SCORE_TIPS in js/features.js, renderHome() debt card in js/ui.js, js/help.js Score page, tests/sim.test.mjs and a rules test.
Balance: the jobless, comeback and early-truck bots gate the release: jobless <= 45, comeback near the careless median, planner unchanged.
Covers: i63-a06, i63-a07, i63-a10, i63-a11, i63-a12, i63-a27, i63-a28, i63-a30.

### i65-a03 Bundle: Ways out of debt and the comeback story (M, 🟠)
The first time you go under, a calm money talk offers three ways out: jobs that start this week, side hustles, or trading the financed pickup down to a beater; a jobless broke week may offer a one-week day-labor shift. Climbing out is told: a "Came back from $11,400 in debt" line under the title, low point and way back on the end sheet, a Back in the black badge, and never a Tumbleweed title.
Gives a struggling player something to do, not just a lower number.
Touches a new money-talk sheet in js/features.js, the car sheet in js/ui.js, one work event in js/events.js and finish() for the end-sheet rows.
Balance: the day-labor shift pays about a week of a low job, only while jobless and broke; the badge can't be pinned as a goal, so it adds no points.
Covers: i63-a13, i63-a14, i63-a15, i63-a19, i63-a20, i63-a21, i63-a23, i63-a26.

### i65-a04 Bundle: Event choices with honest odds (M, 🟠)
Fixes the event choices that win on every count: the long-shot horse loses money on average, a deer tag fills the freezer instead of the wallet, snapping back at a customer risks a write-up, refusing mandatory overtime really costs, and an unpaid snow day stops beating driving in carefully. A sweep test flags any choice that is better or equal on every stat.
Replaces the round 62 draft bundle i62-a26 with its parts.
Touches EVENTS and WORK_EVENTS in js/events.js and ROAD_EVENTS for the snow day; the sweep goes in tests/rules.test.mjs reading eventDice() outcomes.
Balance: every fix trims a free win, so careless "always take the fun one" play loses a little; the sweep allows a listed exception only with a written reason.
Covers: i62-a16, i62-a17, i62-a18, i62-a19, i62-a20, i62-a21.

### i65-a05 Bundle: Restore forgives messy codes (M, 🔴)
A damaged backup code says what is wrong in plain words instead of "Failed to fetch": BURG2 codes carry a check and length that name the broken part, a code pasted inside a sentence or quotes still restores, texted codes can come in numbered parts, and a newer backup on an older app says "update first". Codes start with a readable label like BURG2-3L-W212.
Most of the backup pain from the 0.2.0 playtest.
Touches backupCode() and readBackup() in js/ui.js; fixtures for BURG0, BURG1, BURG2 and a v1 file in tests/fixtures with a rules test that feeds each damaged form.
Balance: none; restore never changes a score.
Covers: i62-a01, i62-a06, i62-a22, i63-b01, i63-b02, i63-b18, i63-b21, i63-b31.

### i65-a06 Bundle: Restore with no twins and no surprises (M, 🔴)
Each life gets a lasting id, so restoring the same backup twice never makes twin lives and an older copy of a life is marked "rewound" (it plays, but sets no bests). The preview lists records and badges, says which slot each life goes to, lets you tick which lives to bring, can just check a file without restoring, and finishing opens the life you brought back.
Touches restoreBackup(), restoreSheet() and finishRestore() in js/ui.js and a new id field set in js/state.js for new lives (migrate() gives old ones one).
Balance: the rewound mark stops restoring an old copy to retry an ending for a better best score.
Covers: i62-a02, i62-a07, i62-a08, i62-a09, i63-b22, i63-b23, i63-b24, i63-b26.

### i65-a07 Bundle: Back up at the right moments (S, 🟠)
The game offers a backup when it matters: from the title screen (records and badges too), from the end screen, four weeks before a set-length life ends, and on each year in review. The Continue card says "Backed up at week 140, 32 weeks ago" or "Never backed up", with a reminder setting of every season, every year or never.
Touches renderTitle(), backupSheet() and the end sheet in finish(); the weekly report line in js/turn.js; one Settings row in the Menu.
Balance: none. "Never" really means never, and no nudge shows more than once per period.
Covers: i62-a03, i62-a24, i63-b08, i63-b09, i63-b10, i63-b11.

### i65-a08 Bundle: Backups that explain themselves (S, 🟡)
A backup carries your settings and the tips you have seen, names its file after who is inside with your local date, opens in a text app with a plain summary, and can name the device it came from. You can email the code to yourself, back up one life in a short code you can read aloud, keep a weekly challenge life's week, and get a clear "not enough room" message before a restore.
Touches backupData() (adds prefs, summary and device name), the file download name, and a mailto: link in backupSheet() in js/ui.js; navigator.storage.estimate before restore.
Balance: a challenge life restored late still can't set that week's best.
Covers: i62-a10, i62-a11, i63-b17, i63-b20, i63-b25, i63-b27, i63-b28, i63-b29.

### i65-a09 Bundle: Lives that survive a wiped browser (M, 🔴)
If the browser clears your lives, the game notices: a "has played" flag in Cache Storage shows "Your lives were cleared" with how to restore, each save also goes to IndexedDB so lives can come back, and a fresh home-screen app on iPhone offers to bring lives over from the Safari tab. Help lists what wipes lives on each browser, saves and backups share one migrate table, and offline files are checked against the release's fingerprints.
Builds on i61-a02 (saves that can't be lost) without repeating it: this is about the browser losing data, not the game.
Touches save()/load and migrate() in js/state.js, sw.js, renderTitle() in js/ui.js, a Help page; i56-b01 adds 12 damaged-storage cases to tests/explore.test.mjs.
Balance: none.
Covers: i63-b03, i63-b04, i63-b05, i63-b06, i63-b07, i56-b01, i57-a14.

### i65-a10 Bundle: Moving phones by QR (L, 🟠)
Menu gets "📱 Moving to a new phone": the old phone loops a few small QR frames, the new phone scans them with its camera (or opens a link from the phone camera) and shows a 4-letter "got it" code to match before you wipe the old one. A printable paper backup, a two-phone QR test and a two-browser finish-backup-restore test guard it.
Replaces the round 63 draft bundle i63-b32 with its parts.
Needs a small QR maker and reader added offline to the cached files (sw.js); falls back to the code where BarcodeDetector is missing. The #restore= part never leaves the phone.
Balance: none. Build after bundles 05 and 06 so the codes and ids it moves are settled.
Covers: i63-b12, i63-b13, i63-b14, i63-b15, i63-b16, i63-b19, i63-b30, i62-a23.

### i65-a11 Bundle: Small polish from the 0.2.0 playtest (S, 🟡)
Small rough edges found playing the live build: the year in review comes back after closing the app, Enter in the name box starts the life, finishing the tutorial marks its tips seen, the tutorial ring stays on screen, and long names fit the score card. The window title shows your life and week, the Life tab shows your health plan, and the recruiter says one plain "next 4 weeks".
Touches renderTitle(), renderLife() and document.title in render() in js/ui.js, endTutorial() in js/help.js, scoreCard() in js/features.js, the recruiter event in js/events.js.
Balance: none; wording and screen fixes only.
Covers: i62-a05, i62-a12, i62-a13, i62-a14, i62-a15, i59-a28, i58-b22, i58-b23.

### i65-a12 Bundle: Balance pass part 3: cheap visits and free stuff (M, 🟠)
Closes the cheap wins left after the first two balance passes: the paper and the farm counter stop being free weekly community, the coffee run-in needs a few weeks away, dead trip stops get a reason, Get outside eases in deep winter without gear, and overtime weeks count toward a raise. Fun events ask young parents who watches the kid, and one "usual" Out and about visit can ride along on skips.
Touches js/outabout.js acts, tripSheet() stops in js/features.js, the Get outside focus in js/turn.js, and kid checks in a few fun EVENTS.
Balance: the planner's lead from coffee and free community shrinks a few points; the standing visit gives Auto and skip players the same small lift tappers get, not more. If cheap visits still lead, i59-b25 (one visit a week) is the fallback. Check with the round 61 value sim.
Covers: i59-b11, i59-b12, i59-b14, i59-b21, i59-b24, i58-b18, i58-b21.

### i65-a13 Bundle: Spanish groundwork: ids, t() and string files (M, 🔴)
Everything Spanish needs before a single line is translated: events keyed by a short id instead of their English title, a t() lookup that falls back to English, a script that pulls every player line into lang/en.js, offline language files listed in sw.js, and a flag on Spanish lines older than their English. The tutorial finds pins by id, a lint stops new hard-coded text, and a stretched fake language finds strings that slipped through.
Touches S.evCd, S.evDone and evPins (migrate() moves old titles to ids), js/state.js for t(), tools/extract-strings.mjs, help.js tutorial targets.
Balance: none in English; ship it alone first so any score change shows up as a bug.
Covers: i61-b01, i61-b02, i61-b03, i61-b04, i61-b05, i61-b15, i61-b23, i61-b22.

### i65-a14 Bundle: Spanish that reads right (M, 🔴)
Spanish text that reads like a person wrote it: money stays $1,250, dates read "Semana del 3 de mar.", plurals follow a rule, lines are phrased so they never guess your gender, places carry el and la, choice buttons get short labels and clean hyphens, and accents and ñ show on old phones. A test opens every event at 360 px in both languages and flags anything that overflows.
Touches fmt(), dateLabel() and MONTHS in js/state.js, the money spots in js/help.js, CSS for lang="es", and a new width check in tests/screens.test.mjs.
Balance: none.
Covers: i61-b06, i61-b07, i61-b08, i61-b09, i61-b10, i61-b12, i61-b31, i61-b11.

### i65-a15 Bundle: Ship Spanish in three waves (M, 🟠)
An English · Español switch on the title and in the Menu (picks Spanish if the phone is set to it) ships Spanish in three waves marked beta: menus and Help, then events, then Tattler, badges and the end screen. A glossary and a valley style guide keep it consistent, native speakers review from a sheet with screenshots, new events can ship in English first, and the install name and store listing get Spanish too.
Touches renderTitle() and the Menu in js/ui.js, <html lang>, tools/review-sheet.mjs, the store listing text in the release kit.
The "Mejorar texto" link opens a prefilled draft; nothing is sent without the player tapping send. Balance: none.
Covers: i61-b13, i61-b17, i61-b18, i61-b19, i61-b20, i61-b24, i61-b25, i61-b32.

### i65-a16 Bundle: Spanish proven: Journal, screens and same score (M, 🟠)
Proof that Spanish is a full game: new Journal lines are stored as a key plus values so the whole Journal re-reads in the current language, screen-reader text and announce() go through t() with lang tags on mixed lines, every main screen is tested in both languages, and a seeded sim shows the same score in English and Spanish.
Touches log() in js/state.js and renderLog() in js/ui.js, announce(), tests/screens.test.mjs and tests/sim.test.mjs.
Balance: the same-score test catches any code that reads display text; it gates each wave.
Covers: i61-b14, i61-b16, i61-b21, i61-b26.

### i65-a17 Bundle: Grew up bilingual (M, 🟡)
A start background for growing up speaking Spanish at home: a few "bilingual preferred" jobs pay a little more, some events gain a choice, a few neighbors switch languages mid-sentence in both modes, your kid translates for a neighbor at the clinic, and read-aloud picks a Spanish voice when the phone has one.
Touches BACKGROUNDS in js/state.js, a "bi" flag on some event lines in js/events.js, speech in js/ui.js.
Balance: the pay bump is small and on a few jobs only, matched by a slightly smaller starting savings so the background stays even in the sim. Build after bundle 13.
Covers: i61-b27, i61-b28, i61-b29, i61-b30.

### i65-a18 Bundle: Running gags that pace themselves (M, 🔴)
One small gag tracker runs every running joke with ordered lines, a minimum gap, a finale and a retire rule, so jokes never repeat or pile up. It launches with Vern's '79 Ford that will not start, Gerald the rooster's opinions, third-time callbacks on repeat events, the check-engine light you ignore, the old-timer's one joke, the BUMP sign on 12 and calls about hay for the feed store.
Touches a GAGS list and S.gags counters in js/state.js, the weekly recap in js/turn.js, and showEvent() for callbacks.
Balance: lines only, no stats, except the hay calls' calendar (cosmetic). At most one gag line per week.
Covers: i62-b28, i62-b01, i62-b02, i62-b04, i62-b26, i62-b32, i62-b19, i62-b05.

### i65-a19 Bundle: Funny lines for your week and your year (M, 🟠)
The weekly recap gets warmth: each focus and each Out and about act rotates a few dry result lines, Show up for town weeks sometimes end with the long goodbye, the dog files a monthly crimes report, and a new life gets a loading line. The year in review adds silly counts, the brag fish grows two inches a year, and the Grange fruitcake comes back every December.
Touches the recap in js/turn.js, act results in js/outabout.js, the year in review, and a December event in js/events.js.
Balance: text only; the fruitcake choices are +/−1 happiness at most. Uses the gag tracker from bundle 18 for pacing.
Covers: i62-b07, i62-b31, i62-b27, i62-b29, i62-b18, i62-b11, i62-b12, i62-b13.

### i65-a20 Bundle: The Tattler gets funny (S, 🟠)
The weekly Tattler line gains recurring bits: a correction that needs its own correction, Earl's knee forecast, dueling church reader boards, silly classified ads, "This week in 1952" archive lines, the council cat's vote, and the porch goose's monthly outfit. A naming list gives every new stand-in business gentle local wordplay.
Touches the Tattler line picker in js/turn.js and a TATTLER_BITS list; the naming list lives in docs/ for js/outabout.js businesses.
Balance: none; one bit per week at most, through the gag tracker.
Covers: i62-b03, i62-b06, i62-b10, i62-b25, i62-b30, i62-b17, i62-b20, i62-b16.

### i65-a21 Bundle: Town characters and rare odd weeks (M, 🟡)
Small recurring characters and once-in-a-long-while weeks: Norman the gnome on tour around the town map, the City Hall lost and found, Doris the deer who eats only your tulips, the kind "TOO-shee" correction for newcomers, your kid as Potato #2 in the harvest pageant, and rare weeks with a tumbleweed drift, a backward parade and onions on Highway 12.
Touches map pins in js/maps.js for Norman, a City Hall board in js/outabout.js, and small EVENTS with low odds and long cooldowns.
Balance: Norman's sightings give a cosmetic postcard only, so tapping the map every week never scores; rare events stay at +/−2.
Covers: i62-b08, i62-b09, i62-b15, i62-b14, i62-b24, i62-b21, i62-b22, i62-b23.

### i65-a22 Bundle: The Touchet's year and a River card (L, 🔴)
One weekly river level (runoff, high, normal, low, iced) set by the month and the Blues snowpack the Tattler reports in January, read by every river event. A River card on Home shows what the Touchet is doing and what you can do there; June water is snowmelt cold, the ice goes out with a boom in February, the low-water ford floods your commute in runoff, and an evening riverwalk lap rides along with Rest.
Touches S.river in js/state.js, weekTick in js/turn.js, renderHome() in js/ui.js, and the fishing, swim and flood events in js/events.js.
Balance: the River card spends spare time like Out and about, so it shares the weekly visit cap; the evening lap is a small Rest bonus that tops out with Rest.
Covers: i64-b01, i64-b02, i64-b03, i64-b07, i64-b15, i64-b30, i64-b19.

### i65-a23 Bundle: Summer on the Touchet (M, 🟠)
Summer river life for families and young adults: three stand-in swimming holes with their own risk, a pallet raft story for kids 8–13, the rope swing cut down after a near-miss, a loaner life-jacket board at the bridge, your teen's bridge jump on video, a bonfire on the gravel bar when the deputy drives by, and a skipping-stone record your kid may beat.
Touches Out and about spots in js/outabout.js, STORY_EVENTS in js/features.js for the raft chain, kid-age checks in js/events.js; all read the river level from bundle 22.
Balance: risky choices carry real health or money odds; the safe choice is never worst on every stat (checked by the bundle 04 sweep).
Covers: i64-b05, i64-b06, i64-b08, i64-b09, i64-b31, i64-b29, i64-b10.

### i65-a24 Bundle: Water rights, levees and the winter river (M, 🟡)
The working river: an August low-water pull-back for irrigators, a summer ditch rider side job, the five-year water right letter, an October levee walk that lowers flood damage, levee dues and a repair vote on the tax bill, high-water marks painted on the bridge piling that pass to the next generation, and January shelf ice you should look at, not walk on.
Touches land and farm checks in js/features.js, a seasonal hustle in js/turn.js, the flood event odds, and S.marks kept through legacySheet().
Balance: levee work lowers flood odds a little for everyone, so it is a community choice, not a money engine; the ditch rider pays like other seasonal hustles.
Covers: i64-b11, i64-b12, i64-b13, i64-b16, i64-b17, i64-b18, i64-b14.

### i65-a25 Bundle: River wildlife and caring for it (M, 🟡)
A river life list in the Journal for the heron at the bend, the ospreys on the ball-field pole, merganser ducklings crossing Main, beaver, mink and otter by season and river level. Your family can adopt a mile of the Touchet (the sign passes to your heir), cleanups turn up odd finds for a shelf, the dog comes home smelling like the river, and keeping a fish out of season may draw a ticket.
Touches a LIFE_LIST in js/state.js, a Journal filter in renderLog(), river visit results, and legacySheet() for the sign.
Balance: sightings are cosmetic; cleanup weekends give community like other town work with the same cap, and the fine makes poaching a losing bet.
Covers: i64-b22, i64-b23, i64-b24, i64-b25, i64-b26, i64-b27, i64-b28, i64-b32.

### i65-a26 Bundle: Quiet moments by the river and in town (S, 🟡)
Small scenes that land because they are quiet: sit on the riverwalk bench before a big choice, a plaque on a bench for someone you lost, proposing on the footbridge at sunset, the old mill race walk, your initials on the repainted welcome sign, a Richland coworker who has heard of you, the first snow after you retire, and your kid out-fishing you on the Touchet.
Uses the signature-scene frame from i61-a22 for the four i56-a scenes; the bench sits before the job, move, proposal and quit sheets in js/ui.js and js/features.js.
Balance: the bench costs a little time and only clears a little stress; it shows both sides but never picks for you. Each scene fires once per life.
Covers: i64-b04, i64-b20, i64-b21, i64-b33, i56-a09, i56-a17, i56-a19, i56-a24.

### i65-a27 Bundle: Jobs that come and go, part 2 (S, 🟡)
More of the changing valley from round 55: short-stay turnover as a wine-weekend side gig after 2031, an equipment tech at a stand-in implement dealer as farm hands thin, a vineyard irrigation tech as water gets tight, bank teller and grocery clerk work that thins, a Journal list of jobs you outlived, and your grown kid's first job that wasn't on the board when you were 18.
Rides on the year-by-year job board in i61-a19 (JOBS open and fade years in js/state.js).
Balance: new jobs pay at their field's level; the sixty-year board sim from i61-a19 checks no decade gets easier.
Covers: i55-b19, i55-b24, i55-b25, i55-b27, i55-b28, i55-b29.

### i65-a28 Bundle: Childhood odds and ends (S, 🟡)
Leftover prologue pieces: the fourth-grade trip to the state park on the Touchet, the dog you grew up with, the crush from the Days dance who comes back in your 20s, a class of 2027 roster other features can name, the café owner who gave you your first job, who raised you (flavor only), the cast everyone signed and the eighth-grade bus to Seattle.
Rides on the Growing up prologue (i61-a25); the roster is a list in S.class used by reunions and the Tattler.
Balance: echoes are lines or one-time +/−2 bumps; the café discount is a few dollars and fades. "Who raised you" has no score effect by design.
Covers: i57-b09, i57-b12, i57-b20, i57-b24, i57-b26, i57-b28, i57-b29, i57-b30.

### i65-a29 Bundle: Goals part 2: small steps and buddies (S, 🟡)
Small additions to the five-year plan: Journal lines at a quarter, half and three-quarters of a goal, a 🎯 Goals Journal filter, life-stage suggestions on the plan sheet, a January resolution buddy and Quitter's Day, a kitchen-table event when your plan and your partner's pull apart, unfinished bucket items that pass to the grandkid, and plans in the Tattler obituary.
Rides on the plan bundles i61-a28 to a30; adds LOG_FILTERS entry in js/ui.js and goalsSheet() suggestions in js/features.js.
Balance: like all plans, nothing here moves the score (the i61-a30 guard test covers it).
Covers: i58-a11, i58-a17, i58-a18, i58-a21, i58-a22, i58-a25, i58-a26, i58-a30.

### i65-a30 Release plan: v1.3 — Fair score, safe moves, the valley comes alive (L, 🔴)
Ship 1.3 after 1.2 as the first content release, with fairness fixes first: debt finally counts in the Life Score (with the sim bots as the gate), event choices get honest odds, restore forgives messy codes and never makes twins, lives survive a wiped browser, and the cheap-visit balance closes. New content: the changing job board, the signature-scene frame, the Growing up prologue, the five-year plan, the running-gag tracker and the Touchet's year with its River card.
Order: debt score (01, 02) and honest odds (04) land first so the content is balanced against the right score; then backups (05, 06, 07, 09); then content.
Gate: the round 61 value sim and the new debt bots pass (careless median <= 60, idle <= 50, jobless <= 45, good play >= 70), and the 0.2.2 repro tests stay green.
Waits for 1.4: Spanish (13–17, starting with the groundwork bundle on its own), QR moving (10), the rest of the river and humor bundles, and the clubs, mentors and decades bundles held since 1.1.
Covers: i65-a01, i65-a02, i65-a03, i65-a04, i65-a05, i65-a06, i65-a07, i65-a09, i65-a11, i65-a12, i65-a18, i65-a22, i61-a19, i61-a22, i61-a25, i61-a28.

Left loose on purpose: round 64's patch items and their round 56/58/59/60 repros (i56-b02, b04, b05, b06, b09, i58-b01, b02, i59-a01, a03, a05, a22, i60-b25); i57-a01 and i56-b11 shipped with 0.2.1; i59-a07 is in v1.1 and i59-b01, b02, b06, b08, b09 ride inside i59-b03; i62-a25, i62-a26 and i63-b32 were draft bundles now split into 05–10 and 04; i59-b25 is the fallback inside 12. Still loose (🟡): i56-b30, i56-b32, i57-b27, i58-b24, i58-b25, i59-a29, i59-a30, i63-a16, a17, a18 (waits for bankruptcy itself), a22, a24, a25, a29, a31.

## Ideas 65: Harvest season

Wheat harvest as the biggest weeks of the year in the Touchet Valley: one shared harvest flag, crews, the elevator line, fire rules, every job feeling it, and how it changes over the decades.

### i65-b01 Harvest is on: a town-wide mode for the weeks the combines run (M, 🔴)
From the first cut in early July to the last load, the game flags "Harvest is on" and every tab shows it: a wheat banner on Home, busier Main Street, dust on the map.
A shared S.harvest object (start week, end week, percent cut) set in turn.js weekTick() from the month plus a little weather luck, so harvest starts 1–2 weeks early or late each year.
Everything else in this round reads that one flag instead of checking inM(m,6,7) on its own.
Touches: turn.js, state.js (migrate default), ui.js renderHome() banner, maps.js tint.
Balance: Pure framing; no stat change by itself.

### i65-b02 How much of the valley is cut: a percent on the town map (S, 🟠)
During harvest the Fields and Elevator pins show "Valley cut: 40%" and the Bring in the harvest goal shows the same number, so you can feel the whole town racing the weather.
The percent climbs 10–20 a week, slower in rain weeks, from S.harvest.
Touches: maps.js pin labels, state.js seasonLine().
Balance: Display only.

### i65-b03 The co-op chalkboard: this week's wheat price (M, 🟠)
The farm-supply pin shows a posted price per bushel each harvest week, chalked on the board, with a small up or down arrow and a one-line reason ("Australia had rain", "export ships are full").
The price walks a few cents a week; your lease check in features.js uses the average of the posted harvest weeks instead of a hidden roll, so what you saw is what you got.
Touches: outabout.js farm-supply place, features.js BIZ.wheat.yearly(), the weekly news line list.
Balance: Same average payout as today; only the spread becomes visible. No sell-timing choice (that is a separate older idea).

### i65-b04 The truck line at the elevator backs onto Main (S, 🟠)
A road event for anyone hauling grain: the line is twenty trucks long. Wait it out with the radio, take the long way to the satellite elevator, or go home and come back at dusk.
Waiting costs a little happiness, the long way costs gas, dusk costs health but pays a small late-haul bonus.
Touches: events.js ROAD_EVENTS, uses S.harvest; only fires if you hauled this week (harvest gig, farmhand, or the Harvest time truck choice).
Balance: No option nets more than a normal week's hustle pay.

### i65-b05 Sign on with a custom harvest crew heading north (L, 🔴)
A crew that started cutting in Texas in May rolls through. With health 50+ and no kids at home you can sign on for the rest of the run: six weeks gone, then Montana and the Dakotas into September.
While away, your job is on hold (unpaid leave if the boss allows, or you quit), rent still comes due, community slowly fades, and the pay arrives as one check at the end.
A once-per-life choice with a short story chain: the cook trailer, sleeping in a camper, the last field in North Dakota.
Touches: events.js new chain, turn.js away-weeks (reuse the road-weeks pattern from the trucker job), features.js badge.
Balance: Net pay about one good month after rent; it costs community and family time, so careless play cannot farm it. Once per life.

### i65-b06 The custom crew camps at the fairgrounds (S, 🟡)
A town event: a southern custom crew parks campers at the fairgrounds for two weeks. Their kids show up at the park and the pool; the diner runs out of pie.
Choices: invite them to Sunday supper (community up, small cost), sell them firewood or ice (small money), or keep to yourself.
Touches: events.js EVENTS, EVENT_PLACE fair pin.
Balance: Small one-time effects, 52-week cooldown.

### i65-b07 Every job feels harvest (M, 🔴)
A small HARVEST_FX table by job so the weeks feel different in town: the diner opens at 4 a.m. (more hours, more tired), the bank has a line of grain checks, the mechanic gets midnight parts calls, the para sees farm kids miss school.
One line per job in the weekly result ("Diner: harvest breakfasts, +$60, -1 health") during S.harvest weeks.
Touches: state.js JOBS (new hf field) or a table in turn.js, ui.js week summary.
Balance: Each job gets a small pay-for-health trade; totals sum to near zero, so it adds texture, not score.

### i65-b08 Parts run to Walla Walla at midnight (S, 🟠)
A side event for anyone with a running vehicle: a neighbor's combine threw a belt and the dealer's night man will meet you at the shop. Drive the 20 miles or say you can't.
Going costs gas and a little health, earns community and a favor that cuts your next repair bill.
Touches: events.js EVENTS (cat town, harvest only), S.favor flag read by the car repair cost.
Balance: The favor is a one-time discount capped at 20%.

### i65-b09 Red flag days stop the combines at noon (S, 🔴)
When the fire danger is extreme, farms agree to stop cutting at noon. Field and elevator jobs get a half week; everyone in town sees the red flag on Home.
About one week in four of harvest, rolled in turn.js. Field jobs lose a slice of overtime but gain a little health.
Touches: turn.js, ui.js banner, JOB_GROUP field in events.js.
Balance: Lowers harvest pay a bit; nothing to exploit.

### i65-b10 Keep the water trailer hitched: the farm fire rule (S, 🟠)
A farmhand event: the boss wants a water trailer and disc at every field. Skip it to save an hour, or do it right. If a spark from the header catches the stubble that week, the choice decides how it goes.
Did it right: the fire is out in minutes, the boss trusts you (raise odds up). Skipped it: a scary afternoon, health and community down, and the neighbor's fence is gone.
Touches: events.js WORK_EVENTS, hidden follow-up check in turn.js.
Balance: Careful play wins; the shortcut never pays.

### i65-b11 Rain delay: the combines sit three days (S, 🟡)
A harvest weather event: a thunderstorm soaks the swaths. Field crews sit idle; you choose to fix equipment in the shop, go fishing at the river, or pick up a shift in town.
Each option trades the lost overtime for health, happiness or a smaller paycheck.
Touches: events.js WORK_EVENTS for the field group, pushes S.harvest end by a week.
Balance: Net effect near zero; it slows the harvest percent.

### i65-b12 The elevator is full: wheat goes on the ground pile (S, 🟠)
Grain elevator operators only: the bins are full and trucks keep coming. Open the ground pile and tarp it, turn trucks away, or call in the night crew.
Ground pile: long night, health down, a bonus if the tarps hold through the wind; turning trucks away costs farmer goodwill (community down).
Touches: events.js WORK_EVENTS, elevator job.
Balance: Bonus is a small roll; average no better than a normal overtime week.

### i65-b13 The auger and the loose sleeve (S, 🔴)
A safety moment for field and elevator jobs: your sleeve is loose near a running auger. Stop and shut it down, or reach in quick.
Stopping costs ten minutes and a sigh from the driver. Reaching in usually works, but 1 in 6 times it's a hospital trip and weeks off.
Touches: events.js WORK_EVENTS; uses the existing injury/time-off path.
Balance: The careless option has a worse average, so careless play does not score higher.

### i65-b14 Harvest tired: long days pile up (M, 🟠)
Every harvest week worked in a field job, at the elevator or on the harvest hustle adds one "long day" mark. At 4 marks your health drain grows unless you take a Rest week.
Marks clear one per week after harvest. A tooltip on Home says "4 long weeks in a row: take a breather".
Touches: turn.js health drain (beside the worn-down rule at line 142), ui.js chip.
Balance: Stops stacking harvest work with Work extra every week; good play rests once and keeps its pay.

### i65-b15 Your teen drives truck for harvest (M, 🟠)
If you have a kid 14–17, a farmer asks if they can drive grain truck this summer. Say yes and they earn their own money, come home sunburnt and proud, and you worry every afternoon.
Kid gets a trait or line in their story ("hauled wheat at 15"), you get happiness, a small chance of a scare on a farm road.
Touches: events.js (family category), kid fields in state.js.
Balance: No money to the player; happiness only. Once per kid.

### i65-b16 School starts before harvest ends (S, 🟡)
Late August: harvest is still going and school starts Tuesday. Farm kids miss the first week. A choice for parents and the para job: send them, keep them on the farm, or work out a half day.
Keeping them out helps the farm (community) but costs the kid a school mark.
Touches: events.js, uses S.harvest end week and kid ages.
Balance: Each option has a cost; no free gain.

### i65-b17 Park the food truck at the elevator line (S, 🟠)
If you own the food truck business, a harvest choice: park at the elevator where twenty idling trucks need lunch, or stay on Main for the regulars.
Elevator: higher sales for the harvest weeks but your Main regulars drift; Main: steady.
Touches: features.js business weekly income, a toggle on the Life tab business card during S.harvest.
Balance: The extra is capped and offset by a small regular-customer dip after harvest.

### i65-b18 Rent the spare room to a harvest hand (S, 🟡)
Custom crews and out-of-town truck drivers need beds for three weeks. If you have a spare room, rent it to a hand who leaves at 4 a.m. and comes back covered in dust.
Small rent for the harvest weeks; a random flavor note (he fixed your gate, he ate all the bread).
Touches: events.js, home check in state.js HOMES.
Balance: Pay is small and ends with harvest. Not offered if the roommate system already has someone in the room.

### i65-b19 Bushels-per-acre talk at the café (S, 🟡)
When harvest ends, the news line reports the valley's average yield ("62 bushels, the best in five years") and townsfolk react. Good years lift town mood a little; bad years mean tight belts at every shop.
One yield number per year drives the lease check, the town mood note and the next year's small-business sales.
Touches: outabout.js news lines, features.js wheat yearly(), turn.js year roll.
Balance: Town mood effect is ±1–2 happiness for everyone; luck, not skill, so it never decides a score.

### i65-b20 105 in the cab: the swather's AC quits (S, 🟡)
A one-week farmhand event in the hottest harvest week: the cab air conditioning dies. Keep running with wet towels and the door open, or lose a day while it's fixed.
Running costs health, stopping costs a little pay.
Touches: events.js WORK_EVENTS.
Balance: Tiny effects; makes field work feel physical.

### i65-b21 Harvest vs. the county fair (S, 🟠)
Fair week and the last big fields land together. Field workers choose: ask for Saturday off to see your kid show the 4-H lamb, or keep cutting.
Off: happiness and family up, boss trust down a bit. Keep cutting: pay up, happiness down, and the kid remembers.
Touches: events.js, links the existing fair event via S.ev flags.
Balance: Classic trade; no option strictly better.

### i65-b22 Wash the combine and roll it into the shed (S, 🟠)
The end of harvest as a quiet ritual: the final week shows a short scene (washing equipment, sweeping the bin floor, the first cool morning), and field workers get a recovery week with no health drain.
Also clears the long-day marks and logs "Harvest is in" in the Journal.
Touches: turn.js on S.harvest end, ui.js scene card, journal log.
Balance: Only after you worked the harvest; idle players get nothing.

### i65-b23 The quiet week after harvest (S, 🟡)
After weeks of trucks and dust the town goes still. A one-week mood note: overtime ends, paychecks drop back, and you choose how to spend the first free weekend (sleep, a drive to the Blues, catch up with friends).
Small happiness or community bump depending on the pick; a nudge that your weekly pay just went back down.
Touches: events.js, timed to S.harvest end + 1 week.
Balance: Tiny; helps players understand the pay drop.

### i65-b24 Harvest across the decades (L, 🔴)
Legacy and long lives see harvest change: a 1970s-style crew of eight with a cookhouse, a 1990s family crew and two trucks, and today one operator with autosteer and a hired hauler. Older relatives tell how it was.
A HARVEST_ERA table keyed by in-game year or legacy generation sets crew size, the flavor text in the Harvest time event, and the odds of crew-related events (more crew jobs back then, fewer now).
Touches: events.js Harvest time text, features.js startLegacy(), a new era table in state.js.
Balance: Fewer harvest jobs in later eras keeps modern play from leaning on harvest pay.

### i65-b25 Grandpa's harvest story at the café (S, 🟡)
An old-timer NPC tells one harvest story a year at the café (the year of the fire on the ridge, the hailstorm that took it all, hauling with a two-ton truck). Listening is a small community boost and unlocks a journal page.
Stories rotate so a long life hears five different ones.
Touches: outabout.js café place, journal log, features.js album.
Balance: Once per year, flavor first.

### i65-b26 Harvest planner: pick your days for six weeks (L, 🟠)
During harvest the focus buttons turn into a simple day plan: how many days to cut or haul, how many to rest, and whether to work Sundays. The plan sets pay and health in one clear line.
Defaults to the normal focus if you skip it, so one-tap play still works.
Touches: ui.js focus panel, turn.js weekTick() harvest branch, state.js FOCUS.
Balance: Pay rises with days but health falls faster after 6 days a week; the best plan is a steady 5–6, not all 7.

### i65-b27 Sundays during harvest (S, 🟡)
Church moves its service to the evening for harvest weeks and the pastor brings pie to the field. Choose: work through Sunday, go to the evening service, or spend it with family.
Each gives a different small stat; repeating the same pick every week fades its effect (uses focusEffect()).
Touches: events.js, state.js focusEffect.
Balance: Diminishing returns stop farming it.

### i65-b28 The end-of-harvest party at the shop (M, 🟠)
When the valley hits 100% cut, one farm hosts the season's party in the machine shed: tri-tip, a keg, a band on a flatbed. You go only if you worked harvest or helped (meals, parts runs, rides).
Unlocked by an S.harvestHelp counter; going gives community and happiness and a once-a-year Journal entry.
Touches: turn.js counter, events.js, journal.
Balance: Rewards active help only; idle and careless players are not invited. (Different from the August harvest dinner and moon supper ideas: this one is gated by what you did.)

### i65-b29 Harvest pay can't beat careful play: a sim guard (S, 🔴)
A test that runs the bots through ten summers with every harvest idea on and checks the targets still hold: careless median <= 60, idle <= 50, good play >= 70.
Also checks that harvest gig + Harvest time event + Harvest crunch + goal never stack above one capped weekly bonus.
Touches: tests/ sim bots, turn.js one HARVEST_CAP constant.
Balance: The guard for this whole round.

### i65-b30 Harvest help on the town map (S, 🟡)
During harvest the Fields pin gets three quick choices: bring water and sandwiches, give a farmer a ride back to his pickup, or watch for smoke from the hill. Each counts toward the end-of-harvest party.
One tap a week, each costs a little time (no focus change) and adds 1 to S.harvestHelp.
Touches: maps.js fields pin, outabout.js place actions.
Balance: Capped at one tap a week; small community only.
