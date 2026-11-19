# Ideas round 63

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 63: Debt and recovery in the score

Debt, a long slide and a climb back out now change the Life Score fairly. Measured in 308 headless sim lives: planner, careless and idle medians did not move (71, 56, 38), a 2-year no-job life drops from 52 to 36, and a comeback life gains 1–2.

### i63-a01 Debt is scored against $90,000 in every game length (S, 🔴)
Below $0 net worth, the wealth part uses min(target, $90,000) as its scale, so −$33,000 costs the same in a 5-year or Lifetime game as in a 2-year one.
features.js lifeScore(): scale = real < 0 ? Math.min(L.target, 90000) : L.target. Builds on i62-a04, which divides by the length target.
Why: with the 5-year target of $400,000, −$33,000 is only −8 on the wealth part. Measured: a 5-year jobless life on Relaxed scores 65 today, 59 with i62-a04 alone, 56 with this.
Balance: careful lives never go below $0, so planner (71), careless (56) and idle (38) medians did not move in 260 simulated lives.

### i63-a02 Relaxed floors the debt part at −20, Normal and Hard at −33 (S, 🔴)
The negative wealth part stops at −20 on Relaxed (about −6 points) and −33 on Normal and Hard (about −10), so Relaxed debt still counts but never sinks a life.
features.js lifeScore(): floor = mode() === "relaxed" ? -20 : -33; student loans count at half, as in i62-a04.
Measured (2-year, 10 lives): Relaxed no-job life 60 → 51; Normal no-job 52 → 36; Hard no-job 44 → 31.
Relaxed best scores stay separate, so this only changes how Relaxed lives compare with each other.

### i63-a03 Weeks spent deep in debt cost up to 6 points (M, 🔴)
Each week your cash is below −$1,000 adds to a debt drag: the share of weeks in debt × 6 points (× 3 on Relaxed), so a life that lived in debt scores lower than one that only dipped at the end.
turn.js weekTick(): S.debtWeeks++ while S.money < −1000 × S.col. features.js lifeScore(): drag = round(debtWeeks / weeks played × 6).
Measured: no-job 2-year lives (in debt from week 8) lose 5–6 more points; no planner or careless life changed score (0 of 50).
The score sheet shows it as its own minus line (see i63-a10).

### i63-a04 Climb out and the debt drag shrinks to a third (S, 🔴)
If you end the life with cash at $0 or more and net worth above $0, the debt drag is cut to a third, so getting back on your feet wins most of those points back.
features.js lifeScore(): if (S.money >= 0 && real >= 0) drag = Math.floor(drag / 3).
Measured: a bot with no job for 40 weeks, then working well, climbed back to $0 in week 65–68 every time and kept at most 1 point of drag.
Balance: you never end better off than if you had stayed out of debt, so there is nothing to gain by diving in.

### i63-a05 "Climbed out" adds 2 points after a real hard stretch (S, 🟠)
+2 points if you spent at least 13 weeks with cash at −$5,000 or lower and net worth below $0, then finished with cash above $0 and net worth at a quarter of the target or more.
features.js lifeScore(): uses S.debtDeepWeeks (cash ≤ −$5,000 and net worth < $0) kept in turn.js. Shows as "🧗 Climbed out +2" under Life goals.
Measured: recovery bot 2-year 51 → 52, 5-year 74 → 76; Debt-free challenge planner 69 → 71. A planner who buys the financed truck early never qualifies (0 of 30 lives).
Balance: the net-worth-below-$0 rule means debt backed by a truck or a house never counts, so a planner cannot borrow on purpose for the bonus; a real hole that deep costs months of interest and happiness (−2 a week while in debt).

### i63-a06 Sim bots for a no-job life, a comeback and an early truck buyer (M, 🔴)
tests/sim.test.mjs gets three bots: "jobless" (never works, rotates Town, Outside and Rest), "comeback" (no job 40 weeks, then plays like the planner) and "diver" (planner who finances the pickup as soon as he can).
Checks: jobless median ≤ 45, comeback median ≥ jobless + 10, diver ≤ planner + 1. Same seeds as the other bots.
Measured with the proposed rules: jobless 36, comeback 52, diver 70 vs planner 71 (2-year).
This keeps a later change from making debt free again. Bot code is in /tmp/ideas/work63a/sim.mjs.

### i63-a07 Guard test: more debt never raises the score (S, 🟠)
A rules test plays a seeded life, then replays the score with cash $1,000, $5,000 and $20,000 lower, and fails if any score goes up.
tests/rules.test.mjs: set S.money lower, call lifeScore(), compare. Also checks the drag never goes negative.
Catches sign mistakes in the floor, the drag and the climbed-out bonus.
No balance effect.

### i63-a08 A fresh 18-year-old gets 8 weeks of grace while job hunting (S, 🟠)
Debt weeks are not counted for the first 8 weeks of a fresh start, so a new player still learning the Jobs tab is not marked down for a slow first month.
turn.js: count S.debtWeeks only when S.turn > 8 or the background is not fresh.
Measured: no planner, careless or idle bot goes below −$1,000 in the first 8 weeks, and the no-job bot first crosses it at week 7–8, so the grace protects new players without helping a life that never works.
No change to careless or idle medians.

### i63-a09 Bad-luck debt drags at half (M, 🟠)
Weeks in debt within 13 weeks of a layoff, a medical bill or a big breakdown count half toward the debt drag, so the score tells hard luck apart from overspending.
events.js: tag those choices with luck:true; turn.js stores S.luckUntil = S.turn + 13; lifeScore() counts those weeks at 0.5.
The score sheet says "8 of your 20 debt weeks followed the layoff, so they count half."
Balance: careless bots spend their way into debt rather than through luck, so this does not lift them.

### i63-a10 The score sheet shows what debt costs and what climbing out wins back (S, 🔴)
Life Score so far gets a red "💳 Debt" line: "Debt is costing you 9 points. Back to $0 by the end wins back 6." The weakest-part tip talks about debt when it is the biggest loss.
features.js showScoreNow() and finish(): split the wealth line into the plain part and the debt part; add a SCORE_TIPS.debt entry.
Shows only while in debt or after a debt stretch, so careful players never see it.
No balance effect; makes the new rules visible.

### i63-a11 The score arrow says when debt moved it (S, 🟡)
When the 🏆 Life Score so far button shows ▼ and the debt part grew, the arrow reads "▼3 debt" so the drop has a cause.
features.js scoreButton(): keep the last debt part in S.scoreQDebt next to S.scoreQ and compare.
Also in the aria-label.
No balance effect.

### i63-a12 The week results warn when debt starts costing points (S, 🟠)
The first week your cash goes below −$1,000, the week results add one line: "💳 You're in debt. Each week like this costs a little Life Score until you climb back out."
turn.js weekTick() notes; once per debt stretch (reset after a week above $0).
Measured: a no-job life hits this line at week 7–8, long before the −$15,000 warning in ui.js.
No balance effect.

### i63-a13 The money talk: three ways out when you first go under (M, 🔴)
The first time cash drops below −$1,000, a calm sheet offers three paths: "See jobs that start this week", "Pick up side hustles" (sets the focus) and "Trade the truck down" if you have one.
ui.js: a sheet opened from the week results; the jobs button opens the Jobs tab filtered to jobs your education allows within 15 miles.
Different from the bank options in i19-a14: these are things you can do this week with no loan.
Balance: only points at choices the game already has; nothing free.

### i63-a14 A day-labor shift when you are broke and between jobs (M, 🟠)
Jobless and below −$1,000, a weekly event may offer a one-week shift (a warehouse in Walla Walla, a seed plant in Dayton, harvest trucks in July) that pays about $550 and costs some health.
events.js: a new event with when: !S.jobId && S.money < −1000, weight up in harvest months; stand-in business names only.
Measured: today a jobless life that side-hustles still ends near −$18,000 (median 36 → 25 under the new rules); a shift every few weeks slows the slide but stays far below a job.
Balance: pays less than the farmhand job, so idle players who never apply gain little.

### i63-a15 Trade the pickup down to a beater to climb out (S, 🟠)
In the car sheet, a financed pickup can be sold back: you get the trade-in value minus what you still owe, drive a used beater home, and the loan and its payment end.
ui.js car sheet: a "Sell it and drive a beater" button when S.loanLeft > 0; sets S.car = "beater", carValue 2500, loanLeft 0.
Net worth barely moves (the loan was already counted), but the weekly payment stops, which is what gets cash back above $0.
Balance: no score gain on its own; it only makes climbing out possible.

### i63-a16 Relaxed: the debt counselor pays it down from your paycheck (M, 🟡)
When Relaxed catches you at −$40,000, interest stops and 10% of every paycheck goes to the debt until you are back above −$20,000, so a Relaxed life can climb out on its own pace.
turn.js: replace the silent clamp with S.plan = true; a "Payment plan" line in the week money; ends at −$20,000.
Goes with i8-a16 (the note when the floor catches you).
Balance: Relaxed only; the −20 floor still holds, so no gain over staying out of debt.

### i63-a17 Hard counts debt weeks one and a half times (S, 🟡)
On Hard, the debt drag uses × 9 instead of × 6, matching its tighter −$25,000 ending.
features.js lifeScore(): drag multiplier by mode: Relaxed 3, Normal 6, Hard 9.
Measured: a Hard no-job life drops 44 → 31 with the Normal rules; this takes it 2 lower. Hard planners never went below $0.
Hard best scores are kept apart, so this does not affect Normal.

### i63-a18 Bankruptcy has a clear score rule (S, 🟠)
If bankruptcy (i3-a27) is built: at filing the debt is wiped and the drag so far is kept, minus 4 points once, and the life can never earn "Climbed out".
features.js lifeScore(): S.bankrupt adds a fixed −4 line, "⚖️ Fresh start after bankruptcy".
Without this, filing would erase −33 on the wealth part and score better than paying it off.
Balance: filing should always score below climbing out and above leaving town; a sim check proves it.

### i63-a19 Leaving town in debt shows how far you got (S, 🟠)
When debt ends a life, the end sheet says "Left in week 61 of 104" and the wealth part sits at the floor, so the score and the story agree.
features.js finish(): show S.turn / L.turns when the reason is the debt ending; turn.js passes a debt flag instead of matching text.
With the new floor the wealth part is already −33 there; today it reads 0, as if nothing was lost.
No change to careful play.

### i63-a20 A line under the title tells the comeback (S, 🔴)
A life that climbed out gets a second line under its title: "Came back from $11,400 in debt." It shows on the end sheet, the score card and the records list.
features.js finish() and scoreCard(); store S.debtLow (lowest cash in 2027 dollars) in turn.js; records keep the line.
Titles from the score stay the same; this only adds the arc, so it reads with dignity, not as a grade.
No balance effect.

### i63-a21 Hard times on the end sheet: the low point and the way back (S, 🟠)
"Your life" gets three rows when you were in debt: the lowest point and when, weeks below $0, and the week you climbed back out (or "Still working on it").
features.js finish(): reads S.debtLow, S.debtLowWeek, S.debtWeeks, S.debtOutWeek, all kept in turn.js.
Plain words, no red text: it is part of the story.
No balance effect.

### i63-a22 The share card shows the climb (S, 🟡)
If you climbed out, the score card adds a small "🧗 from −$11,400" next to your final net worth.
features.js scoreCard(): one more text line under the net worth line; fits with the long-name fix (i62-a15).
No balance effect.

### i63-a23 Back in the black: a badge for climbing out (S, 🟠)
A badge for getting cash back above $0 after 8 or more weeks below −$1,000. It cannot be pinned as a life goal, so it never adds points.
features.js BADGES: { id:"black", ic:"🧗", name:"Back in the black" }; goalsSheet() skips it for pinning.
Shown with the other badges across lives, so a hard life still leaves something on the shelf.
Balance: no points, so no reason to dive into debt for it.

### i63-a24 The Journal marks the week you got back above zero (S, 🟡)
The week cash returns above $0 after a long stretch, the Journal gets a milestone: "Back above zero after 23 weeks."
turn.js weekTick(): log() with the milestone filter when S.debtWeeks in this stretch ≥ 8.
No balance effect.

### i63-a25 Report cards count the weeks in debt (S, 🟡)
Each 13-week report card in the Journal adds "Weeks in debt: 6 of 13" when there were any, and "Out of debt 🎉" when a stretch ended.
turn.js report card text; reads a per-quarter counter.
No balance effect.

### i63-a26 A climbed-out life never ends as Tumbleweed (S, 🟡)
If you climbed out (cash and net worth above $0 at the end after a debt stretch), the lowest title shown is "Getting By on Main Street", even if the score is under 40.
features.js lifeScore(): title floor only; the number does not change.
Rare in practice (recovery bots scored 50–77), but it keeps the name kind where it matters most.
No balance effect on scores.

### i63-a27 The −$15,000 warning says how many weeks you have left (S, 🟠)
The red debt card on Home adds pace: "At this rate you leave town in about 9 weeks," from the last 4 weeks of cash change.
ui.js home card: weeks = (limit − money) / average weekly change; hidden when cash is rising ("You're climbing: keep going").
Uses the mode's real limit (i60-a12).
No balance effect.

### i63-a28 Help explains how debt affects the Life Score (S, 🟠)
Help → Score gets a short section: debt below $0 lowers the money part to a floor, weeks deep in debt cost a little, climbing out wins most of it back, and Relaxed counts it gently.
help.js: one more block under the score help, with the real numbers from the rules.
No balance effect.

### i63-a29 Young adults drag at half until 21 (S, 🟡)
Weeks in debt before age 21 count half toward the debt drag, so a teen's first rough year does not weigh like a grown-up's.
features.js lifeScore(): weight debt weeks by age at the time (keep a weighted counter in turn.js).
Measured: no planner, careless or idle bot ever went below −$1,000 at 18–20, so only no-job lives are touched, and they still score 36 or less.
Balance: lifts nothing that plays well already.

### i63-a30 The balance report adds debt columns (S, 🟠)
The sim balance report shows, per bot: median weeks in debt, the median low point and how many lives climbed out.
tests/sim.test.mjs: track the lowest cash and weeks below −$1,000 in the bot loop; two more table columns.
Makes debt tuning visible on every pull request.
No balance effect.

### i63-a31 Debt-free challenge scores the climb, not just the finish (S, 🟡)
In "Debt-free in 2 years", the end sheet shows the comeback line and Climbed out +2 when you earned it, so a challenge win and a good score agree.
features.js finish(): no special case needed once i63-a05 is in; add a line to the challenge card.
Measured: Debt-free planner 69 → 71, careless 48 → 49.
Challenge scores are kept apart from Normal.

## Ideas 63: Backups and moving devices

Ways to keep lives safe and move them between phones with no server: checked codes, QR transfer, timely reminders and plain notes when a browser wipes things.

### i63-b01 Backup code checks itself and names the broken part (S, 🔴)
BURG2 codes end in a short check (a CRC of the packed bytes) plus the length, so a cut-off or retyped code says "The last part is missing" or "One piece was changed" before any unpacking.
Touches: readBackup()/backupCode() in js/ui.js. Add a `.<len>.<crc>` tail to BURG2 codes; BURG0/1 still read.
Balance: Pure safety; no effect on scores.

### i63-b02 Backups say which format they are, and newer ones ask you to update (S, 🔴)
backupData() already writes v:1 but readBackup() never looks at it. Read v and minReader: an older app given a newer backup says "This backup is from a newer Burg. Update first" with a Check for update button, instead of guessing.
Touches: readBackup() in js/ui.js, service worker update check in js/boot.js. A frozen fixture per format in tests/rules.test.mjs.
Balance: No gameplay effect.

### i63-b03 One migrate table for saves and backups, with a step per format (M, 🟠)
Format steps (v1→v2→v3) live in one list in js/state.js that both loading a slot and reading a backup walk, so a backup from 0.2 and a save from 0.2 always end up the same.
Touches: migrate() in js/state.js, readBackup() in js/ui.js. Add docs/backup-format.md listing each version's fields.
Balance: No gameplay effect; stops old lives from scoring under old rules by mistake.

### i63-b04 Safari tab to home-screen app: bring your lives along (S, 🔴)
On iPhone the home-screen app has its own storage, so lives played in a Safari tab look gone after installing. When the installed app opens with no lives, it shows "Played in Safari before? Open the game there, tap Copy backup code, come back and paste."
Touches: Title screen in js/ui.js, display-mode: standalone check in js/boot.js. Help 'Installing' section in js/help.js.
Balance: No balance effect; it only shows on an empty device.

### i63-b05 "Your lives were cleared" note when the browser wiped them (M, 🔴)
The game keeps a tiny 'has played' flag in a second place (Cache Storage, which the service worker already uses). If that flag is there but the lives are gone, the title says "Your saved lives were cleared from this browser. Have a backup? Restore it here."
Touches: js/boot.js (cache flag), title in js/ui.js. A flows test clears localStorage only and checks the note.
Balance: No balance effect.

### i63-b06 A second copy of each life in IndexedDB (M, 🟠)
Each save also writes to IndexedDB. If localStorage is emptied (some cleaner apps and 'clear cookies' only hit one store) the game offers to bring the lives back from the second copy.
Touches: save()/slots() in js/state.js, js/boot.js. Reads stay from localStorage; IndexedDB is only a fallback.
Balance: Restores the exact same week, so no rewinding.

### i63-b07 Help: what wipes your lives, browser by browser (S, 🟠)
A short Help list: iPhone 'Clear History and Website Data', Android Chrome 'Clear site data' or uninstalling the app, private tabs, and Safari's seven days away. Each line ends with "Back up first."
Touches: New subsection under the device section in js/help.js.
Balance: No balance effect.

### i63-b08 Back up before the last month of a set-length life (S, 🔴)
In a 2-year or 5-year life, four weeks before the end, the weekly report adds one line: "Your ending is 4 weeks away. Back up now so the record is safe?" One tap opens the backup sheet; it shows once per life.
Touches: End Week report in js/turn.js, backupSheet() in js/ui.js. Flag on S so it never repeats.
Balance: A line, not a pop-up; no stat change.

### i63-b09 The year in review has a Back up button (S, 🟠)
The review card after each year in long lives gets "📤 Back up this year" next to Keep going. A natural, once-a-year moment, no extra prompt.
Touches: Year review card in js/turn.js / js/ui.js.
Balance: No balance effect.

### i63-b10 Each life knows when it was last backed up (S, 🟠)
Backups stamp each slot with the week they caught. The Continue card says "Backed up at week 140, 32 weeks ago" or "Never backed up", so you can see which life is at risk.
Touches: backupData() marks S.lastBackupWeek per slot; Continue card in js/ui.js.
Balance: Display only.

### i63-b11 Backup reminder setting: every season, every year, or never (S, 🟡)
Settings gets one row for how often the Continue card nudges you to back up. Default every year of play. 'Never' really means never.
Touches: Prefs in js/state.js, Settings sheet in js/ui.js. Uses the last-backed-up week above.
Balance: No balance effect.

### i63-b12 Animated QR to move every life, not just one (L, 🔴)
A full backup is too big for one QR. The old phone loops 6–12 small QR frames (each says 'part 3 of 8'); the new phone's camera collects them in any order and shows a progress bar until done.
Touches: New js/qr.js (small QR encoder, no library download), backupSheet() and restoreSheet() in js/ui.js. Uses the BURG2 code split into parts.
Balance: No server; same checks as a pasted code.

### i63-b13 Scan a QR inside the game with the camera (M, 🟠)
Restore gets "📷 Scan from the other phone". It uses the browser's BarcodeDetector where there is one; where there isn't, it says "Use the backup code instead" rather than failing.
Touches: restoreSheet() in js/ui.js, camera via getUserMedia. Stops the camera the moment the sheet closes.
Balance: No balance effect.

### i63-b14 A QR the phone's own camera can open (M, 🟠)
The QR holds the game's address with the code after a # (thegame/#restore=BURG2…). The phone camera opens the game, which fills the restore box. The part after # is never sent to any server.
Touches: Hash handling in js/boot.js, then restoreSheet(). Clears the hash once read so a reload doesn't restore again.
Balance: No balance effect; same restore checks.

### i63-b15 Moving to a new phone: a two-screen guide (M, 🔴)
Menu gets "📱 Moving to a new phone". The old phone says Step 1: show this QR or send this code; the new phone's title has "I'm the new phone" which opens the scanner and paste box. Plain steps, nothing new under the hood.
Touches: New sheet in js/ui.js reusing backup and restore pieces; a Help line in js/help.js.
Balance: No balance effect.

### i63-b16 The new phone shows a short 'got it' code back (S, 🟡)
After restoring, the new phone shows a 4-letter check (from the backup's CRC). The old phone shows the same four letters, so you can see they match before you wipe or give away the old phone.
Touches: finishRestore() and backupSheet() in js/ui.js.
Balance: No balance effect.

### i63-b17 Email the backup code to yourself (S, 🟠)
A "✉️ Email it to me" button opens a mail draft with the code and one line of how-to in the body. Works in any browser with no server, and an inbox is a backup most people already have.
Touches: backupSheet() in js/ui.js using a mailto: link. Falls back to Copy if the code is too long for mailto on that phone.
Balance: No balance effect.

### i63-b18 Split a long code into numbered parts for texting (S, 🟡)
Some messengers cut long texts. Copy code can split into parts ("Part 1 of 3"), and the restore box accepts the parts pasted in any order.
Touches: backupCode()/readBackup() in js/ui.js, using the BURG2 part header.
Balance: No balance effect.

### i63-b19 A printable paper backup (M, 🟡)
"🖨️ Print a backup" makes one page with the QR frames, the code in large groups of five, the date and who's inside. A drawer copy for people who don't trust phones.
Touches: New print view in js/ui.js with print CSS in index.html; reuses js/qr.js.
Balance: No balance effect.

### i63-b20 A one-life code that's short enough to read aloud (M, 🟠)
Back up just one life without its Journal and old reports. The code shrinks a lot, and the restored life gets a Journal line: "Moved here from another phone."
Touches: backupData() option in js/ui.js; Journal trimming list in js/state.js.
Balance: Stats, money, week and flags all travel; only old text is left behind, so scores don't change.

### i63-b21 Codes start with a readable label (S, 🟡)
Codes start BURG2-3L-W212: three lives, furthest at week 212. You can tell two codes in your messages apart without restoring them.
Touches: backupCode()/readBackup() in js/ui.js (label is ignored on read).
Balance: No balance effect.

### i63-b22 Restoring an older copy of a life is marked 'rewound' (M, 🔴)
If a backup brings back a life at an earlier week than the one on this phone, it asks first and marks it rewound. A rewound life still plays, but its ending doesn't set best scores or badges.
Touches: restoreBackup() in js/ui.js, best-score check in js/features.js. Life id plus week decides 'older'.
Balance: Stops backup-and-restore save scumming from beating the score targets; careless and idle play can't gain from it.

### i63-b23 Pick which lives to bring in (S, 🟡)
The restore preview gets a checkbox on each life, so a new phone can take Sam but leave the old practice life behind.
Touches: restoreSheet() and restoreBackup() in js/ui.js.
Balance: No balance effect.

### i63-b24 Each life gets a lasting id (S, 🟠)
New lives get a random id saved with them. Twin checks, rewound checks and 'last backed up' all match on the id instead of name and start date.
Touches: New-life setup in js/state.js, migrate() gives old lives one. Used by restore in js/ui.js.
Balance: No balance effect.

### i63-b25 Name this device (S, 🟡)
A nickname ("Kitchen laptop") goes into backups, so the restore preview reads "From Kitchen laptop, 3 days ago". Stays on the device otherwise.
Touches: Prefs in js/state.js, backupData()/restoreSheet() in js/ui.js.
Balance: No balance effect.

### i63-b26 Check an old backup file without restoring (S, 🟡)
"Is this backup still good?" reads a file or code and lists what's inside and how far each life is behind this phone, then closes without touching anything.
Touches: restoreSheet() in js/ui.js with a look-only mode.
Balance: No balance effect.

### i63-b27 A backup file you can read (S, 🟡)
The .json file starts with a plain summary field ("3 lives: Sam week 212, Robin week 40…") and a note on how to restore, so opening it in a text app isn't a wall of numbers.
Touches: backupData() in js/ui.js; readBackup() ignores the summary.
Balance: No balance effect.

### i63-b28 Weekly challenge lives travel, but keep their week (S, 🟠)
A weekly challenge life restored on another phone keeps its challenge week and still can't set that week's best after the week has passed.
Touches: restoreBackup() in js/ui.js, weekly best rules in js/features.js.
Balance: Stops moving a challenge life to replay an old week for a better score.

### i63-b29 Restore on a phone that is nearly full (S, 🟡)
Before writing, restore checks there's room (navigator.storage.estimate) and says "This phone needs about 40 KB free; delete a finished life or clear space" instead of half-writing.
Touches: finishRestore() in js/ui.js.
Balance: No balance effect.

### i63-b30 Two-phone QR test (S, 🟠)
A Playwright test makes the animated QR frames in one context, feeds the decoded parts out of order into a second empty context, and checks lives, records and the 'got it' code match.
Touches: tests/flows.test.mjs, helpers in tests/helpers.mjs.
Balance: Test only.

### i63-b31 Format fixtures for every backup version (S, 🟠)
tests/fixtures holds a BURG0, BURG1 and BURG2 code and a v1 file. Rules tests restore each and check the same life comes out, and that a fake v9 says 'update first'.
Touches: tests/rules.test.mjs, new tests/fixtures/backups/.
Balance: Test only.

### i63-b32 Bundle: Moving phones without a server (L, 🔴)
One pass: self-checking BURG2 codes with labels and parts, the format check, the 'Moving to a new phone' guide with animated QR and scanner, the got-it code, and the Safari-to-app and cleared-lives notes.
Touches: js/ui.js, new js/qr.js, js/boot.js, js/help.js, tests.
Balance: No balance effect, plus the rewound mark so restores can't be used to retry bad weeks.
