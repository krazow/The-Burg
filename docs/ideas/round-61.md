# Ideas round 61

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 61: Bundles part 8 and v1.2

30 bundles that group the round 55–60 ideas still loose (data safety, test coverage, app feel, playtest and balance fixes, feedback, the changing job board, signature scenes, growing up and plans), leaving out anything the 0.2.1 patch plan already fixes or tests, and one release plan for v1.2.

### i61-a01 Bundle: Backups checked before they land (M, 🔴)
A restored life is checked field by field before it is kept: numbers must be finite and in range, text and lists are capped, unknown fields are dropped, best scores must be real, and oversized files or codes are turned away before they are read.
Builds on patch 0.2.1 H1 (i60-a01), which only fills safe defaults; this adds one validLife() schema in state.js used by readBackup() in ui.js.
File size is checked before FileReader runs; the compressed code unpacks through a size-capped reader; the code box is filled with .value, never as markup.
Test: hand-made hostile backups (huge, nested, __proto__ keys, NaN money) are refused or cleaned, and shared object shapes stay untouched.
Balance: none; cleaned saves can't carry a fake best score onto the shelf.
Covers: i57-a02, i57-a03, i57-a04, i57-a05, i57-a20, i57-a21, i57-a25.

### i61-a02 Bundle: Saves that can't be lost (M, 🔴)
Nothing the player built gets wiped quietly: an unreadable slot list is copied aside and offered as a download, each life saves under its own key with the last good save kept one step back, Restore only says 'restored' when the lives really landed, 'Replace all' gets an undo, the game asks the browser for persistent storage, and Help says plainly what is kept on the device.
state.js: slots() copies broken text to a side key before treating it as empty; save() writes life-<id> plus a .prev copy; store.set's false return (patch 0.2.1 07, i60-a10) drives the Restore check.
boot.js calls navigator.storage.persist() after the first finished week; help.js gets a short 'What this game keeps' page.
Migration moves the old single slots key to per-life keys once, keeping the old key until the next version.
Balance: none.
Covers: i57-a15, i57-a16, i57-a17, i57-a18, i57-a19, i57-a22, i57-a23.

### i61-a03 Bundle: Plain text everywhere (M, 🔴)
Every bit of text that could come from a player or a save is shown as plain text: Journal lines, the last report card line, event text with names in it, and NPC text from players. esc() covers the single quote, names lose invisible and direction-flipping characters, map pins drop inline onclick, and a test flags raw values in page templates.
Extends patch 0.2.1 13 (i60-a16), which escapes names in the log; this escapes at render time in ui.js, events.js (say/fill helpers) and maps.js.
Map pins get data-place attributes and one delegated listener; the name box strips bidi and zero-width characters in state.js newLife().
tests/escape.test.mjs greps templates for ${ without esc( and fails on new ones.
Balance: none.
Covers: i57-a06, i57-a07, i57-a08, i57-a09, i57-a24, i57-a26, i57-a27, i57-a28.

### i61-a04 Bundle: A locked-down page and safe player characters (M, 🟠)
The page gets a content security policy and sends no referrer, a test proves a fresh game only talks to itself, and a hotel Wi-Fi login page can never be cached as the game. Player-made NPC drafts stay on the device until sent, sends carry only the answers, every NPC card has 'Report this character', and the 18+ gate is remembered.
index.html gets a CSP meta tag and referrer policy (needs the map pins' inline handlers gone first, see the plain text bundle); sw.js only caches responses that are 200, same-origin and HTML with the game's marker.
The NPC sheet keeps its draft in one local key cleared on send; the Formspree payload is built from a fixed field list.
tests/offline.test.mjs records every request in a fresh game and allows only same-origin ones.
Balance: none.
Covers: i57-a10, i57-a11, i57-a12, i57-a13, i57-a29, i57-a30, i57-a31, i57-a32.

### i61-a05 Bundle: Open-bug repros that stay quiet until fixed (M, 🔴)
One tests/bugs.test.mjs holds a small repro per known bug with its idea id: it prints 'open i22-a18' while the bug stands and must pass forever once marked fixed. It starts with the bugs the 0.2.1 patch does not already test: a raise that resets job time, the fixer-upper story after moving, old-save mortgage prices, a trip in debt, jam weeks and gas spikes, and the focus and tutorial fixes from v1.1.
Repros already written into the 0.2.1 patch (endings, tuition, broken backups, wheat lease, tires, unemployment) are not repeated; this file imports their ids so the list stays complete.
Each repro is 10–30 lines using tests/helpers.mjs; a FIXED list in the file flips a repro from 'report' to 'must pass'.
Balance: none; the trip-in-debt repro guards a careless-play edge.
Covers: i56-b03, i56-b07, i56-b08, i56-b10, i56-b12, i56-b13, i56-b14, i56-b15.

### i61-a06 Bundle: Reach tests and edge-case bots (M, 🔴)
Prove every part of the game can happen: a reach table shows each event can fire, every job gets worked in the sim, every story chain branch reaches its end, every event choice works for a broke 19-year-old, and the screen audit covers events, notes and the year in review. Two new bots hit the hospital and the debt ending, and a test pins which ending wins at the exact debt line.
tools/sim.mjs gets a reach mode that forces conditions per event and logs any that never fire; a worn-out bot and a big-spender bot join the bot list.
tests/audit.test.mjs walks the event, notes and review sheets on a small phone.
Balance: the big-spender bot must end in debt and the worn-out bot below 50, which keeps careless play from drifting up.
Covers: i56-b16, i56-b17, i56-b18, i56-b19, i56-b20, i56-b21, i56-b22, i56-b25.

### i61-a07 Bundle: Old saves, long lives and odd settings (M, 🟠)
Keep real saves from every tagged version as test fixtures and make sure old backup codes still restore. Check that a 4-week skip matches four single weeks, event perks end on time, long lives keep their lists short, a practice life leaves no records, business rules hold off the happy path, and Reduce Motion stops every animation.
tests/fixtures/saves/<version>.json is filled by the release kit at each tag; tests/compat.test.mjs loads each and draws every tab.
Seeded runs compare S after ⏩ 4 against four End Week taps.
Balance: the skip test guards idle play from gaining anything over hands-on weeks.
Covers: i56-b23, i56-b24, i56-b26, i56-b27, i56-b28, i56-b29, i56-b31, i56-b33.

### i61-a08 Bundle: Feels like an app: Back, touch and scroll (M, 🔴)
After the 0.2.1 patch makes Back close sheets (i60-a07), Back also steps through Help pages and the tutorial one at a time and folds the title screen's More options first. Pull-to-refresh and header bounce stop, sheets fit the real screen height, long-press doesn't select text, buttons press down when touched, and big moments get a tiny screen pulse where there's no vibration. A phone-sized 'feels like an app' test guards it all.
ui.js reuses the patch's history entries for Help pages and tutorial steps; boot.js handles title-screen popstate.
index.html CSS: overscroll-behavior: none, 100dvh sheets, user-select and -webkit-touch-callout off on buttons, :active scale.
tests/appfeel.test.mjs runs on a Pixel 7 profile. The page-behind-sheet scroll lock (i59-a07) is already in v1.1's i55-a01.
Balance: none.
Covers: i59-a02, i59-a04, i59-a06, i59-a08, i59-a09, i59-a10, i59-a31, i59-a32.

### i61-a09 Bundle: Feels like an app: typing, screens and icons (M, 🟠)
The name box starts your life on Go, capitalizes names and skips spell-check squiggles; the keyboard never covers the box you type in; the backup code box gets a Paste button. Sideways phones keep text clear of the notch, tablets and Chromebooks can turn, turning keeps your spot, dark-mode phones don't repaint the game, and the icon is round-safe with a one-color themed version.
index.html inputs get enterkeyhint, autocapitalize=words and spellcheck=false; ui.js scrolls the focused input into view on visualViewport resize.
CSS uses env(safe-area-inset-*) and color-scheme: light; manifest.webmanifest drops the portrait lock and adds maskable and monochrome icons.
Balance: none.
Covers: i59-a11, i59-a12, i59-a13, i59-a14, i59-a16, i59-a17, i59-a18, i59-a19.

### i61-a10 Bundle: Feels like an app: Android, Windows and sharing (M, 🟠)
In the installed app, backups and share cards use the phone's share sheet, a backup file opens straight from Files or a message, and coming back checks for a new version. The Android status and gesture bars match the game. On Windows the app opens in its own phone-shaped window that remembers its size, and a second launch brings up the first. A nearly full phone trims old Journal lines before it would lose a week.
ui.js uses navigator.share with files when present, falling back to download; manifest gets file_handlers and launch_handler (focus-existing).
boot.js checks the service worker for an update on visibilitychange; theme-color follows the open screen.
The Journal trim runs when store.set fails (patch 0.2.1 07) and keeps milestones.
Balance: none.
Covers: i59-a15, i59-a20, i59-a21, i59-a23, i59-a24, i59-a25, i59-a26, i59-a27.

### i61-a11 Bundle: Playtest fixes: the retiree (M, 🟠)
Fixes for a player in their 70s: stat bars stay in sight after you scroll, an event's 📍 line opens that spot on the map, a first life's job board opens on Waitsburg and Dayton, week one says 'Just moved in', choices without a price say what they cost you, result chips read as words for screen readers, and a 'Coming home at 55' start for Lifetime.
ui.js: sticky stat strip, data-place on the 📍 line, default town filter for first lives, aria-label on chips like '+3 health'.
The age-55 start sets age, savings and a paid-off house in state.js newLife(); its net worth target scales so it scores like other starts.
Balance: the 55 start is checked in the sim against Fresh start; careless at 55 must stay at or under 60.
Covers: i58-b04, i58-b05, i58-b06, i58-b13, i58-b15, i58-b16, i58-b17.

### i61-a12 Bundle: Playtest fixes: the parent and the strategist (M, 🟠)
For players with little time or a spreadsheet mind: the big red button isn't always the one that costs money, End Week shows a weeks-in-a-row count, a quiet 'Saved' mark appears after every week, small results show as a toast, small events can be auto-answered the way you did last time, the score sheet shows each part's scale and what a change is worth, and the job board sorts by 'best for your life'.
ui.js: button colors follow cost, not order; renderScore() lists each part's max and a +1 preview; job sort uses take-home after commute wear and stat effects.
Auto answers only repeat small, no-money events and never answer story or crisis events (events.js tags small: true).
Balance: auto answers can't pick a choice the player never picked, so idle play gains nothing; the 'best for your life' sort is information only.
Covers: i58-b07, i58-b08, i58-b09, i58-b10, i58-b11, i58-b12, i58-b19, i58-b20.

### i61-a13 Bundle: Balance pass part 2: trips, hustles and Out and about (M, 🔴)
Ship the weekly-choice balance pass (i59-b03) together with the fixes it left out: back-to-back trips wear thin, side-hustle experience eases the hustle toll per kind of gig, Out and about happiness and community top out near full, a trip's checkup beats the clinic again, a trip takes half your week, and the side-hustle ad lasts 4 weeks.
outabout.js and turn.js: a tripStreak counter halves trip gains after two in a row; S.hustleXp keyed by gig type lowers the health cost.
Tuning lives in the one tuning file so the sim can sweep it.
Balance: target the tripper bot below the planner and the hustler above careless; careless median <= 60, idle <= 50, good >= 70 re-checked in the sim.
Covers: i59-b03, i58-b03, i58-b14, i59-b07, i59-b10, i59-b15, i59-b16, i59-b22.

### i61-a14 Bundle: Balance sim: what each choice is worth (M, 🔴)
The sim measures each weekly choice: points per week against Rest, a failure when a choice loses to Rest everywhere or any bot's median hits 100, shared dice so swaps compare directly, a points-per-dollar list for stops and visits, a check that the planner's lead isn't just coffee, and a re-tuned two-year net worth target. Help gets a plain 'what a week of each does' table built from the same numbers.
tools/sim.mjs: a --choices mode, a seeded dice stream shared by paired runs, and CI fail rules in tests/balance.test.mjs.
help.js reads the table from the tuning file so the text can't drift.
Balance: this is the guard for the targets themselves.
Covers: i59-b04, i59-b05, i59-b13, i59-b17, i59-b18, i59-b19, i59-b20, i59-b23.

### i61-a15 Bundle: Tell us: one feedback sheet and an outbox (M, 🔴)
Menu, the end screen and the title screen get 💬 Tell us with four chips and a short box. Notes and player characters share one outbox that sends when you're back online, every note starts with a line saying where you were, a plain privacy line sits on the sheet, sends stay under Formspree's 50 a month, one switch turns off every ask, and tests send to a fake Formspree.
New feedback code in ui.js posts to the existing Formspree form with type 'feedback'; the outbox is one local key flushed on open, 'online' and after End Week.
The where-you-were line is built from tab, week, mode and version, never the name or save.
tests/feedback.test.mjs routes the form URL to a local stub.
Balance: none.
Covers: i60-b01, i60-b02, i60-b03, i60-b04, i60-b05, i60-b11, i60-b17.

### i61-a16 Bundle: Closing the loop with players (M, 🟠)
Players see their notes matter: a 'Your notes' list, What's new says when one is fixed, short replies ship in the next update, and testers who opt in get credited by first name. One question at the end of a life and a week-12 check-in in a first life ask how it's going; a known-problems list shows before you write. A script turns the Formspree export into a page, and the first 50 players get a tester diary.
Notes keep a local id; release.json lists fixed note ids and replies that What's new matches.
tools/feedback-report.mjs reads the CSV export and writes a page grouped by chip and screen.
Asks respect the one off switch from the Tell us bundle.
Balance: none.
Covers: i60-b06, i60-b07, i60-b08, i60-b10, i60-b15, i60-b16, i60-b18, i60-b19.

### i61-a17 Bundle: Report it where you see it (M, 🟠)
Small 'something wrong?' links sit where problems show: 'Still stuck?' at the bottom of each Help page, 'Request a job' on the Jobs tab, 'Something wrong here?' on business cards (which also say they're a stand-in), and 'report the last event'. A one-time hint shows the map can be tapped, and a 'my place' pin marks your house on the Waitsburg map.
Each link opens the Tell us sheet with the type and place filled in (help.js, ui.js renderJobs, maps.js cards, events.js last event).
The my-place pin is stored in S and drawn by maps.js.
Balance: none.
Covers: i60-b09, i60-b12, i60-b13, i60-b14, i60-b20, i60-b21, i60-b26.

### i61-a18 Bundle: Answers for strangers and skeptics (M, 🟠)
For players who've never heard of Waitsburg: a first-launch card saying where it is, a tap-a-money-word meaning for words like equity, a note on where the prices come from, no repeated small events in short games, Help showing 'Ready offline', and a guest life so a brother can try it without touching your lives.
boot.js first-launch card; help.js glossary used by a tap handler on marked words; events.js pickEvent skips fired small events in 1- and 2-year games.
The guest life uses its own temporary key and leaves no records or best scores.
Balance: no-repeat makes short games read better without changing odds of money events; checked in the sim.
Covers: i60-b22, i60-b23, i60-b24, i60-b27, i60-b28, i60-b29.

### i61-a19 Bundle: A job board that moves with the years (M, 🔴)
Jobs open and close as the game year passes, with a 'New this year' tag, a three-year warning when your field is shrinking, pay that grows at each field's own pace, the paper printing next year's hiring early, Help listing when each job opened and fades, and a 'Work in the valley' line in the year in review. A sim run checks sixty years of the board.
Each job in the job table gets opens/fades years and a growth rate; ui.js renderJobs filters by S.year.
turn.js year-end adds the review line; the Tattler reads the next year's openings.
Balance: the sim must show a full Lifetime always has 5+ open jobs per town and that a careless player gains nothing from the newest jobs.
Covers: i55-b01, i55-b02, i55-b03, i55-b04, i55-b20, i55-b21, i55-b22, i55-b30.

### i61-a20 Bundle: New trades on the wheat hills (M, 🟠)
New work arrives in the valley: solar installer crews, a drone spray pilot for the spring fields, EV and hybrid tech in Walla Walla, a battery yard tech by the substation, a power line crew with an end date, sorting robots in the packing shed, a solar lease offer on your wheat ground, and mentor pay for training the new trade late in your career.
New rows in the job table with opens years from the moving job board bundle; the solar lease is a business option in features.js beside the wheat lease.
Boom jobs carry an end year shown on the card; the robot event moves shed jobs toward line tech.
Balance: new jobs pay at their field's level, not above; the solar lease trades wheat income for a smaller steady check, so it is not a free win.
Covers: i55-b05, i55-b06, i55-b07, i55-b08, i55-b13, i55-b17, i55-b23, i55-b26.

### i61-a21 Bundle: Hanford winds down; care, remote and Main Street jobs grow (M, 🟠)
Over decades Hanford shrinks to a last shift while care work grows with an aging valley, including a home health aide on the farm roads. Office jobs get more remote days, a coworking room opens above Main Street, a new inn hires a front desk, and an evening bridge course retrains you before your job fades.
Job table fade years for Hanford roles; a signature-style last-shift event in events.js; care jobs' openings scale with the year.
The bridge course is a class in the classes system at half speed while you work, unlocking the matching new job.
Balance: the course costs weeks and money like any class; it never pays more than the job it replaces.
Covers: i55-b09, i55-b10, i55-b11, i55-b12, i55-b14, i55-b15, i55-b16, i55-b18.

### i61-a22 Bundle: Signature scenes: the frame and the first set (L, 🔴)
Once-a-life scenes open as a full-page sheet with a gold edge, at most one every 13 weeks, and get saved to a Moments shelf; directions use your place as the landmark; a guard test makes sure none can be farmed. The first set: sandbags at the bridge at 2 a.m., the car in the ditch on 12, CPR in the bleachers, the 3 a.m. hospital drive, and strangers sleeping in the school gym when the pass closes.
ui.js gets a scene() sheet; events.js tags signature: true with once-per-life flags in S.moments; skips always stop for one.
The guard test plays 200 seeded lives and checks no scene repeats and none gives more than a small stat bump.
Balance: scenes give memories and small bumps, never money, so they can't lift careless or idle scores.
Covers: i56-a01, i56-a02, i56-a28, i56-a03, i56-a06, i56-a07, i56-a21, i56-a27.

### i61-a23 Bundle: Signature scenes: kids, home and the farm (M, 🟠)
Scenes for family life: your kid's name read out in the gym, their last-second shot, the kid you coached coming back grown, your grown kid buying a house two streets over, the first Thanksgiving at your house, your folks signing the farm over at the kitchen table, buying back the house you grew up in, and flipping on the Main Street lights.
Each scene uses the frame from the first-set bundle and checks kids, home and farm state in events.js.
The farm handover moves the wheat lease to ownership in features.js; buying back the old house adds it as a home choice for that one week.
Balance: the farm and house scenes cost market price; only the memory is free.
Covers: i56-a04, i56-a14, i56-a15, i56-a16, i56-a18, i56-a22, i56-a23, i56-a26.

### i61-a24 Bundle: Signature scenes: farewells and full circles (M, 🟠)
Scenes for endings and turns: the last tune you call at the jam, the fish of a lifetime on the Touchet, sunrise from Lewis Peak after the worst year, the boss who let you go applying to work for you, carrying the casket for the old-timer who taught you, the last night at the tavern before your best friend moves, two people at the old bachelor's funeral, and the crew lining the hallway on your last day.
Triggers read existing state: low year score for the sunrise, a past layoff for the boss, the mentor bundle's old-timer for the casket, retirement for the hallway.
All use the gold-edge frame and the Moments shelf.
Balance: comfort scenes come after hard times, not from grinding; no money attached.
Covers: i56-a05, i56-a08, i56-a10, i56-a11, i56-a12, i56-a13, i56-a20, i56-a25.

### i61-a25 Bundle: The Growing up prologue (L, 🟠)
An optional five-scene prologue from age 5 to 17 before week one, with a tight budget checked by the sim. Players can skip it or pick 'Surprise me' for a balanced childhood; skipped scenes come back as Rest-week flashbacks. Day one shows a 'Who you were at 18' card, the Journal gets childhood lines dated from 2014, and each starting background gets its own scenes.
New js/prologue.js (or a section of boot.js) stores choices in S.past; nudges apply in newLife() in state.js.
The sim plays every prologue path and fails if any lands more than 2 points from the 'start at 18' median.
Balance: the budget caps total nudges so no childhood buys a better score.
Covers: i57-b01, i57-b02, i57-b14, i57-b15, i57-b16, i57-b17, i57-b18.

### i61-a26 Bundle: Childhood scenes: ages 5 to 13 (M, 🟠)
The early prologue scenes: first day at the K–12 and who you sit with, swim team or the high dive at 9, Celebration Days from a float or the curb at 8, summer reading at the library, a summer on Grandpa's wheat place at 11, a best friend's family moving to Spokane at 12, and laughing along when they teased Sam at 13.
Each is a short scene object in the prologue file with two or three choices and S.past keys.
Sam and the Spokane friend become NPCs that can come back as adults through the people-who-come-back system.
Balance: each scene stays inside the prologue budget.
Covers: i57-b03, i57-b04, i57-b05, i57-b06, i57-b10, i57-b19, i57-b21.

### i61-a27 Bundle: Teen years and what they echo (M, 🟠)
The teen scenes and their long tail: your first job at 15 picked from four, the first paycheck saved or spent, freshman fall in football, FFA or band, the night on the grain elevator, the year your dad got laid off, learning to drive in Grandpa's pickup, one late-life echo per scene, and your heir's childhood shaped by the one you gave them.
Echo events in events.js read S.past and fire once after 50; the heir's S.past is filled from the parent's choices in startLegacy().
Balance: echoes give memories and small bumps only; the heir's past stays inside the same budget.
Covers: i57-b07, i57-b08, i57-b11, i57-b13, i57-b22, i57-b23, i57-b25, i57-b31.

### i61-a28 Bundle: The five-year plan (M, 🟠)
At the start you write up to three plan lines (sized to the game length) with one reason each; they check themselves as on track, behind or done, a first-of-the-month check-in shows them, a realistic check warns on long shots, you can let a goal go on purpose, and a hard year pauses the plan.
New plan data in S.plan with check functions in features.js; the check-in rides the first End Week of each month in turn.js.
Round 50 removed pinned goals and their +2; this has no score effect at all.
Balance: plans never move the score (see the guard in the plans-that-show-up bundle).
Covers: i58-a01, i58-a02, i58-a03, i58-a04, i58-a05, i58-a06, i58-a07, i58-a24.

### i61-a29 Bundle: Bucket list and promises out loud (M, 🟠)
Pick five from a Waitsburg bucket list (with a second-half list after 50) that wave when they're in reach. Promise the kids something out loud, make a joint plan with your partner, inherit a promise to Mom, and tell someone your goal; kept promises count for more in the story than kept goals.
Bucket items reuse places from maps.js and outabout.js; promises are entries in S.plan with a person attached.
A broken promise lowers that person's bond a little; kept ones raise it.
Balance: bonds already feed the score, so promises are capped at three open and give small bond changes only.
Covers: i58-a08, i58-a09, i58-a10, i58-a12, i58-a13, i58-a14, i58-a15, i58-a16.

### i61-a30 Bundle: Plans that show up at work and at the end (M, 🟠)
Plans show up in the game: a career target with a date your boss knows, a nudge when you drift, help for your kid toward their goal, plans in the year in review, a plan-vs-what-happened end-screen page with what you didn't plan that mattered most, a guard test that goals never move the score, and a goal bot in the sim.
features.js finish() builds the end page from S.plan and the Moments and Journal milestones.
tests/balance.test.mjs runs the goal bot and fails if its median differs from the planner's by more than a point.
Balance: this bundle holds the guard for all plan features.
Covers: i58-a19, i58-a20, i58-a23, i58-a27, i58-a28, i58-a29, i58-a31, i58-a32.

### i61-a31 Release plan: v1.2 — Safe to keep, feels like an app (L, 🔴)
Ship 1.2 after 1.1 as a trust release: lives that can't be lost or poisoned, a page that only talks to itself, an app that behaves like one on Android, iPhone and Windows, the open-bug repros and reach tests as the gate, the playtest and balance fixes, and a way for players to tell us what's wrong. New content (the changing job board, signature scenes, the Growing up prologue and plans) waits for 1.3 with the clubs, mentors and decades bundles held from 1.1.
Order: the data-safety bundles first (backups, saves, plain text, locked-down page), then the tests, then app feel, playtest and balance, then feedback last so it ships with a known-problems list.
Gate: bugs.test.mjs has no repro marked fixed that fails, the reach table has no unreachable event, and the sim holds careless <= 60, idle <= 50, good >= 70.
Assumes the 0.2.1 patch (i60-a01 to a28) is already in; nothing here repeats its fixes.
Left loose on purpose: i56-b05, b06, b09, b11 and i60-b25 are already done by the 0.2.1 patch; i59-b01, b02, b06, b08 and b09 ride inside i59-b03; i59-a07 is in v1.1. About 45 others (mostly 🟡) wait for part 9.
Covers: i61-a01, i61-a02, i61-a03, i61-a04, i61-a05, i61-a06, i61-a07, i61-a08, i61-a09, i61-a10, i61-a11, i61-a12, i61-a13, i61-a14, i61-a15, i61-a16.

## Ideas 61: Spanish and bilingual play

A full plan for playing The Burg in Spanish and in both languages, from pulling out the text to testing it on phones.

### i61-b01 Events keyed by an id, not their English title (M, 🔴)
Cooldowns and once-only flags in events.js key on e.title; so do evPins and S.run.happened.
Add an id field to each event, keep title as display text, and map title to id in a one-time save migration (state.js).
Prerequisite for any translation: without it a Spanish player could see once-only events twice.
Balance: none. A rules test checks the migration keeps every cooldown.

### i61-b02 A t() lookup that falls back to English, never a blank (S, 🔴)
t(key, vars) fills {tokens} and returns the English line if Spanish is missing.
English strings stay in the code at first (t('key', 'English default')) so nothing has to move on day one.
Touches state.js only; every other file adopts it gradually.
Balance: none; text only.

### i61-b03 A script that pulls every player-facing line out of js/ and index.html (M, 🔴)
Finds event text, choice labels, results, Help, badges, tips, aria-labels and the static parts of index.html.
Skips CSS classes, ids, data-* and code-only strings by simple rules plus an allowlist.
Output is a starting point a person checks, not an automatic rewrite.
Balance: none.

### i61-b04 Translation files as plain script files that work offline (S, 🔴)
Each entry can carry a note for the translator: {t:'...', note:'said by a crew lead, friendly'}.
Flat dotted keys by area: ev., ui., help., biz., badge.
sw.js file list and the offline test both include it.
Balance: none.

### i61-b05 Flag Spanish lines that are older than the English (S, 🟠)
Hash stored next to the text in lang/es.js.
A test prints stale keys as a warning, not a failure, so releases are not blocked.
Keeps rewrites from round 21-style text passes from leaving Spanish behind.
Balance: none.

### i61-b06 Money in US Spanish style: $1,250, not 1.250 $ (S, 🔴)
Replace hand-built '$' strings in help.js, features.js and ui.js with fmt and fmtc.
es-US keeps $ and commas; es-MX or es-ES would confuse a Walla Walla reader.
'/wk' becomes '/sem' through t().
Balance: none; amounts are unchanged.

### i61-b07 Dates and months that read right in Spanish (S, 🟠)
state.js dateLabel, slot cards and MONTH_SPAN in outabout.js use one date helper.
Journal dates follow the current language.
Weekly challenge week labels (isoWeek) stay as numbers.
Balance: none.

### i61-b08 Plurals from a rule, not n === 1 ? '' : 's' (S, 🔴)
Spots include features.js trip stops and lease weeks, ui.js backup lives and Journal entries.
t('ui.lives', {n}) picks {one:'1 vida', other:'{n} vidas'}.
A test runs each plural with 0, 1 and 2.
Balance: none.

### i61-b09 Spanish that never has to guess your gender (M, 🟠)
Default: neutral wording in every line; the choice only shows in Spanish and only matters for a short list of lines.
Stored in prefs, not the save, so it carries across lives.
Partner and kid lines use their names instead of él or ella where possible.
Balance: none.

### i61-b10 Places carry their article: el río, la biblioteca (S, 🟠)
maps.js and outabout.js place names get an es entry with art and name.
Token forms: {place}, {a_place}, {de_place}.
Keeps event writers from hand-fixing grammar in every line.
Balance: none.

### i61-b11 A phone-width check for longer Spanish event text (M, 🔴)
Uses showEvent with a fixed state per event in tests/screens.test.mjs.
Lists the worst ten so writers trim those first.
Flags only; a person decides whether to cut words or allow a scroll.
Balance: none.

### i61-b12 Short labels for choice buttons (S, 🟠)
Optional short field in the language file per choice.
index.html CSS: hyphens:auto under :lang(es).
Keeps buttons two lines at most on small phones.
Balance: none.

### i61-b13 English · Español switch on the title screen and in the Menu (S, 🔴)
Stored in prefs; ui.js redraws the current view.
Works mid-week; an open event redraws in the new language.
Labels show in their own language: 'English' and 'Español', never flags.
Balance: none.

### i61-b14 The Journal re-reads in your current language (M, 🟠)
S.log entries gain {k, v}; old text entries stay as written.
Event results return keys through t() so they can be redrawn.
Backups stay language-neutral, so a life moves between an English phone and a Spanish phone.
Balance: none.

### i61-b15 The tutorial finds pins by id, not English labels (S, 🔴)
Add data-k to map pins in maps.js and outabout.js.
Rewrite the step selectors in help.js.
A test runs the tutorial in Spanish start to finish.
Balance: none.

### i61-b16 Screen reader text in Spanish, with lang tags on mixed lines (S, 🟠)
Covers map pins, score button, slot cards and Journal announcements.
Mixed lines matter in English mode too, for bilingual characters.
Checked by the existing accessibility checks plus a lang test.
Balance: none.

### i61-b17 A glossary: what stays in English and what doesn't (S, 🟠)
lang/glossary.md with each term, the Spanish form and a reason.
Covers town and business stand-in names, Celebration Days, Life Score and the stats.
A check flags a glossary term spelled two ways.
Balance: none.

### i61-b18 Valley Spanish, not textbook Spanish (S, 🔴)
Lives next to the English writing guide in docs.
Lists word choices for local life: harvest, crew, swing shift, orchard, rent.
Grade-6 reading level, same as the English.
Balance: none.

### i61-b19 Native-speaker review with a sheet and screenshots (M, 🔴)
Reviewers see the line on a real screen, not in a list.
Review happens per wave (menus, then events by category).
Reviewers are credited on the credits page if they want to be.
Balance: none.

### i61-b20 Suggest a better translation from inside the game (S, 🟡)
Shows only in Spanish mode, and only if the player turns it on in the Menu.
Carries the key and version, no save data.
Fits the no-tracking feedback approach.
Balance: none.

### i61-b21 Screens test in both languages (M, 🔴)
Screens: title, Home, Jobs, Money, Journal, Help, the end screen and sample events.
English-leak check uses a short word list ('the', 'week', 'your').
Screenshots also feed the review sheet.
Balance: none.

### i61-b22 A stretched fake language for finding missed strings (S, 🟠)
Generated from en.js on the fly; never shipped to players.
Turned on from the builder panel or a URL flag in tests.
Catches problems before a translator spends time.
Balance: none.

### i61-b23 A lint that stops new hard-coded text (S, 🔴)
Simple rules: template literals with words inside sheet(), label:, text:, return lines in go().
The allowlist count is printed so progress is visible.
Keeps future content translatable without anyone remembering to.
Balance: none.

### i61-b24 New events can ship before their Spanish (S, 🟠)
Fallback lives in t(); the note comes from a flag on the event.
Coverage tool counts events, Help and menus separately.
Writers add a note for translators when they add the event.
Balance: none.

### i61-b25 Ship Spanish in three waves, marked beta (S, 🔴)
Each wave goes through the review sheet and the screens test.
Coverage percent shows in the builder panel.
What's new notes come in both languages.
Balance: none.

### i61-b26 Same seed, same score in both languages (S, 🔴)
Runs in tests/sim.test.mjs with the existing seeded runs.
Also proves language never changes odds or choice order.
Balance: guarantees careless, idle and good-play targets hold in Spanish.

### i61-b27 Neighbors who switch languages mid-sentence (M, 🟠)
A bi flag on a line tells t() to leave it as written.
Meaning is always clear from the choices, so English-only players are never stuck.
New stand-in characters, like a tire-shop owner and a school bus driver, in town and work events.
Balance: text only; no new rewards.

### i61-b28 Grew up bilingual: a start option (M, 🟠)
Small pay step (about $1 an hour) on a handful of clinic, school and county jobs.
Extra choices give community, not money.
Balance: offset by a smaller starting savings, like other backgrounds; sim test checks the median stays in range.

### i61-b29 Your kid translates at the doctor (S, 🟡)
One event in events.js, gated on kids old enough and the background.
Cooldown of a few years.
Small community or happiness change either way; no right answer.
Balance: tiny, once in a while.

### i61-b30 Read-aloud picks a Spanish voice (S, 🟡)
Uses speechSynthesis voice lists; falls back quietly.
Follows the lang spans from the screen reader idea.
No download; uses what the phone already has.
Balance: none.

### i61-b31 Accents and ñ everywhere, and lists sorted in Spanish (S, 🟡)
One test screenshot of a line with every accent.
Sorting in features.js and outabout.js lists.
Upside-down marks are written in, never left out.
Balance: none.

### i61-b32 An install name and store listing in Spanish (S, 🟡)
manifest gets a Spanish description; store kit gets Spanish screenshots from the screens test.
What's new reads from the language file.
Reviewed by the same native speakers.
Balance: none.
