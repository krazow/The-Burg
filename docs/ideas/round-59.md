# Ideas round 59

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 59: Feels like a real app

Thirty-two ways to make the installed game behave like a phone or Windows app, checked where possible on a headless Pixel 7 page.

### i59-a01 Back steps through tabs to Home, then asks before leaving (S, 🔴)
On Android, Back from Jobs, Life, Journal or Menu goes to Home, and Back on Home shows a toast: "Press Back again to leave. Your week is saved." Headless check: one Back after starting a life left the page entirely.
- What: each tab change pushes a history entry; Back pops to the last tab, then Home.
- How it plays: two Backs on Home leave; one Back never loses the game by surprise.
- Touches: ui.js render() and the nav tab handler, a popstate listener in boot.js; builds on i58-b01's sheet handling.
- Balance: no score effect.

### i59-a02 Back closes Help pages and the tutorial one step at a time (S, 🔴)
Back inside Help returns to the contents, then closes Help; Back during the coach asks "Skip the tour?" instead of leaving the app.
- What: showHelp() and each Help section push a history entry; drawCoach() pushes one too.
- How it plays: Back feels like every other Android app inside the guide.
- Touches: help.js showHelp(), closeHelp(), endTutorial(); the same popstate listener as i59-a01.
- Balance: none.

### i59-a03 Back during an event never picks an answer for you (S, 🔴)
When an event sheet is open, Back keeps it open and shakes the choices with "Pick one to go on." Today Escape clicks #no, #close, #back or #ok, so a Back mapped to it could quietly choose.
- What: event sheets get a flag; Back and Escape skip the auto-click when it is set.
- How it plays: no accidental choices from a thumb on the gesture edge.
- Touches: ui.js keydown handler and sheet(), events.js showEvent().
- Balance: stops careless answers that happen by accident; cannot raise idle scores.

### i59-a04 Back on the title screen folds More options and the restore box first (S, 🟠)
On the title screen, Back closes an open More options panel, restore code box or delete confirm before it leaves the app.
- What: these panels push a history entry when they open.
- Touches: ui.js renderTitle(), loadSheet(), the restore flow.
- Balance: none.

### i59-a05 A double tap on End Week plays one week, not two (S, 🔴)
A quick double tap on End Week now plays one week. Headless check on a Pixel 7 page: a double tap moved the game from week 0 to week 2.
- What: endTurn() ignores taps for 400 ms after a week ends, and the new End Week button starts disabled for a moment.
- How it plays: a shaky thumb or a laggy phone can't skip a week you meant to read.
- Touches: ui.js endTurn and render(), turn.js playWeeks().
- Balance: lowers careless skipping; no effect on the bots.

### i59-a06 No pull-to-refresh or scroll bounce in the middle of a week (S, 🔴)
Pulling down at the top of Home no longer reloads the page in a browser tab or bounces the header. Headless check: overscroll-behavior is 'auto' on html and body.
- What: overscroll-behavior-y: contain on html, body, .sheet and .helpview.
- How it plays: a long Journal scroll that overshoots doesn't throw you to the title screen.
- Touches: index.html styles.
- Balance: none.

### i59-a07 An open sheet holds still; the game behind it doesn't scroll (S, 🟠)
When a sheet is open, scrolling inside it never drags the screen behind it, and the screen behind stays where it was when the sheet closes.
- What: lock body scroll while #modal is open (save scrollY, position:fixed, restore on close).
- Touches: ui.js sheet() and closeSheet(), index.html .modal styles.
- Balance: none.

### i59-a08 Sheets fit the real screen height, not the tallest one (S, 🟠)
Sheets use 88dvh instead of 88vh, so the last button isn't hidden under the browser bar or the keyboard on Android and iPhone.
- What: max-height:88dvh with a vh fallback; same for Help and the coach.
- How it plays: no more hunting for an OK button under the address bar.
- Touches: index.html .sheet, .helpview.
- Balance: none.

### i59-a09 Long-press on a button doesn't select text or pop a menu (S, 🟠)
Holding a finger on End Week, a focus tile or a tab no longer highlights its words or opens the copy menu. Text in the Journal and Help stays selectable.
- What: user-select:none and -webkit-touch-callout:none on buttons, nav, chips, tiles and map pins.
- Touches: index.html styles only.
- Balance: none.

### i59-a10 Every button presses down when touched (S, 🟡)
Tabs, chips, focus tiles and small buttons get the same press-down look End Week already has, so a tap feels answered before the screen redraws.
- What: shared :active styles (slight sink and shade).
- Touches: index.html styles; respects the Reduce Motion rule.
- Balance: none.

### i59-a11 The name box: Go starts your life, names get capitals, no squiggles (S, 🔴)
On the title screen, the keyboard's Go key starts the life, the first letter is capitalized, and names aren't underlined or autocorrected. Headless check: Enter in the name box did nothing, and it has no enterkeyhint or autocapitalize.
- What: wrap the name box in a form (submit = Start), add enterkeyhint="go", autocapitalize="words", spellcheck="false", autocorrect="off".
- Also: the heir's name box in features.js gets the same.
- Touches: ui.js renderTitle(), features.js heir sheet.
- Balance: none.

### i59-a12 The keyboard doesn't cover the box you're typing in (M, 🟠)
When the keyboard opens, the name or backup box scrolls into view and the fixed End Week bar, week strip and tabs hide instead of riding up on top of the keyboard.
- What: listen to visualViewport resize; add a body class while an input has focus; scrollIntoView({block:'center'}).
- Touches: ui.js title, backup and restore sheets; index.html .endbar, .weekstrip, nav.
- Balance: none.

### i59-a13 A Paste button and a paste-friendly backup code box (S, 🟠)
The restore box gets a Paste button (clipboard read) and turns off autocorrect, capitals and spellcheck, so a long BURG1 code isn't mangled by the phone keyboard.
- What: navigator.clipboard.readText() behind a button; hide the button where it isn't allowed.
- Touches: ui.js restore sheet (#rscode).
- Balance: none.

### i59-a14 Sideways phones keep text clear of the notch (S, 🟠)
In landscape, the header, tabs, End Week and sheets add left and right safe-area padding, so the name and cash aren't under the camera cutout.
- What: add --safe-l and --safe-r from env(safe-area-inset-left/right) next to --safe-t and --safe-b.
- Touches: index.html .wrap, .top, nav, .endbar, .weekstrip, .sheet.
- Balance: none.

### i59-a15 The Android app's status bar and gesture bar match the game (M, 🟠)
In the APK, the top bar is barn red with white icons and the bottom gesture area matches the cream tab bar, with no black strips. The page's safe-area padding is checked to work inside the app's WebView.
- What: set status and navigation bar colors in the release kit's Android settings; test env() insets in the APK.
- Touches: release.json android block (or a kit option), index.html theme-color.
- Balance: none.

### i59-a16 Tablets, Chromebooks and the Windows window can turn sideways (S, 🟡)
The manifest stops locking to portrait, so a tablet on a stand or a laptop isn't stuck in a narrow column. The landscape styles already exist.
- What: orientation "any" in manifest.webmanifest (or keep portrait only on phones in the Android kit).
- Touches: manifest.webmanifest, release kit Android settings.
- Balance: none.

### i59-a17 Turning the phone keeps your spot (S, 🟡)
Rotating the phone keeps the scroll spot on the current tab and keeps an open sheet open and scrolled where it was.
- What: on orientation change, remember the nearest card on screen and scroll it back into view.
- Touches: ui.js render(), a resize listener next to the coach's in help.js.
- Balance: none.

### i59-a18 A real round-safe app icon and a one-color themed icon (S, 🟠)
The maskable icon gets its own art drawn inside the safe circle, so Android's round mask doesn't clip the barn. A one-color version follows Android's themed icons.
- What: add icon-maskable-512.png and icon-mono.png; set purpose maskable and monochrome.
- Touches: manifest.webmanifest, new icon files, sw.js ASSETS, tests/offline.test.mjs file list.
- Balance: none.

### i59-a19 Dark-mode phones don't repaint the game by themselves (S, 🔴)
Until the night theme (i2-a07) is built, the page says it is light-only, so Android's auto-dark and dark WebViews can't invert the map and art into odd colors. Headless check: with the phone set to dark, the page shows its normal cream with color-scheme 'normal'.
- What: <meta name="color-scheme" content="light"> and color-scheme: light on :root; a theme-color for dark mode that keeps barn red.
- Touches: index.html head.
- Balance: none.

### i59-a20 Backups and share cards use the phone's share sheet in the app (M, 🔴)
In the Android app, Back up and Share open the phone's share sheet (Drive, email, Messages) instead of a download link that can do nothing inside a WebView. Browsers keep the download as a fallback.
- What: try navigator.share({files}) first for the backup file, as the share card already does; show the backup code if both fail.
- Touches: ui.js backupSheet(), features.js share card; check in the APK.
- Balance: none.

### i59-a21 Open a backup file straight from Files or a message (M, 🟡)
Tapping a .burg backup in the phone's Files app, or sharing it to The Burg, opens the restore sheet with it filled in. Windows can open it by double-click.
- What: share_target and file_handlers in the manifest; the restore flow reads the launch file.
- Touches: manifest.webmanifest, sw.js (share POST), ui.js restore.
- Balance: restore checks stay as they are.

### i59-a22 Leaving the app saves what you changed this week (S, 🔴)
When you switch apps or lock the phone, the game saves at once, so a changed focus, a job application or a planned trip is still there if Android closes the app.
- What: save() on visibilitychange to hidden and on pagehide.
- Touches: boot.js listeners, state.js save().
- Balance: only saves what you already chose; no rerolls.

### i59-a23 Check for a new version when you come back to the app (S, 🟠)
Coming back to the app after a while asks the service worker to look for an update, so a phone that's never fully closed still gets fixes.
- What: registration.update() on visibilitychange to visible, at most once an hour.
- Touches: boot.js; the update banner itself is i3-b08.
- Balance: none.

### i59-a24 A nearly full phone trims old Journal lines before losing a week (M, 🟠)
If a save is refused for space, the game drops the oldest Journal lines and saves again, then shows a plain note to back up. A check of free space on the Menu warns early.
- What: catch QuotaExceededError in store.set; trim; navigator.storage.estimate() on the Menu.
- Touches: state.js store and save(), ui.js menu.
- Balance: score parts never trimmed, only old Journal text.

### i59-a25 The Windows app opens in its own window, not a browser tab (M, 🔴)
The Windows installer starts the game in an app window with The Burg's name and icon and no address bar, like the installed phone app.
- What: launch Edge or Chrome in app mode at the local port, or install the PWA from the local page on first run.
- Touches: the release kit's Windows template; release.json windows block.
- Balance: none.

### i59-a26 The Windows window opens phone-shaped and remembers its size (S, 🟠)
The first window is tall and narrow (about 480 by 900), never narrower than 360, and opens where you last left it.
- What: window size and place saved by the launcher.
- Touches: release kit Windows launcher.
- Balance: none.

### i59-a27 A second launch on Windows brings up the first window (M, 🟠)
Starting The Burg twice, or when the port is busy, brings the open window forward instead of a blank error page.
- What: the launcher checks port 47920 (48920 for beta) and whether it is The Burg answering.
- Touches: release kit Windows launcher, release.json port.
- Balance: none.

### i59-a28 The window title and app switcher say where you are (S, 🟡)
The page title reads like "The Burg · Dusty · Week 12" while playing and "The Burg" on the title screen, so the Windows taskbar and Android's recent apps show your life.
- What: set document.title in render() and renderTitle().
- Touches: ui.js.
- Balance: none.

### i59-a29 The status bar dims with a sheet and goes cream in Help (S, 🟡)
When a sheet opens, the phone's status bar darkens to match the shade, and in Help it matches Help's cream header.
- What: swap the theme-color meta in sheet(), closeSheet(), showHelp() and closeHelp().
- Touches: ui.js, help.js.
- Balance: none.

### i59-a30 Long-press a saved life for Continue, Copy, Back up and Delete (S, 🟡)
On the title screen, holding a life card opens a small action sheet, the way phone apps handle list items. The 🗑 button stays.
- What: a 500 ms press timer on .slot; keyboard users get the same sheet from a ⋯ button.
- Touches: ui.js renderTitle() slot cards.
- Balance: none.

### i59-a31 A 'feels like an app' test on a phone-sized page (M, 🟠)
A new test plays on a Pixel-sized page and checks Back, double taps, overscroll, Enter in the name box, safe-area variables and the color-scheme tag, so these don't quietly break.
- What: tests/native.test.mjs using helpers.mjs serve() and launch().
- Touches: tests/, package.json test script.
- Balance: none.

### i59-a32 Haptic-free fallback: a tiny screen pulse on big moments (S, 🟡)
On phones that can't vibrate (all iPhones, the Windows app), a quick flash of the stat bar marks a raise, a badge or a hard hit, so the moment still lands.
- What: one CSS class added for 300 ms; off under Reduce Motion.
- Touches: ui.js render(), turn.js playWeeks() results; pairs with i2-a04.
- Balance: none.

## Ideas 59: Balance of each weekly choice

Each weekly choice measured headless (Playwright, seeded dice, 8 games per cell): on its own, in common mixes, and swapped one at a time out of the planner's routine, at 6 months, 2 years, 5 years and Lifetime.

**What the numbers say.** Overtime loses to plain Rest at every length. Two cheap Out and about visits a week ($22) add 9 to 18 points and lift a random-focus life (72) above the planner (85). Get outside beats Rest once stats are good. The 16-week trade certificate is worth +12 points in 2 years, and the bachelor's degree costs points before 5 years. On today's code the weekly tripper alone no longer beats the planner (77 vs 85), but weekly trips added to the planner still give +11 (i58-b03 covers that). Sim noise at this size is about ±2.

### i59-b01 Overtime pays time and a half, and wears a little less (S, 🔴)
Work extra hours loses to plain Rest at every length today. Raise its pay from +20% to +35% and ease the toll from -2/-1.5 to -1.5/-1, so overtime about breaks even with Rest instead of being a trap.
Measured: a planner who swaps every overtime week for Rest scores higher now (6 months 75 vs 73, 2 years 88 vs 86, 5 years 91 vs 89, Lifetime 93 vs 91; Lifetime health part 97 vs 78).
After (payMult 1.35, fx happy -1.5, health -1.5→-1): overtime planner 74/85/91/93 against Rest 74/86/91/93 (averages), so it's a fair trade.
Files: state.js (FOCUS.work: payMult, fx, desc '+35% pay'). Help's focus line.
Balance: sim careless 57→59 (2 years) and 58→60 (5 years), right at the line, so ship it with i59-b02 (careless drops 1–3 there). Commuter bot 50→57.

### i59-b02 Get outside tops out like Rest does (S, 🔴)
Rest stops working in the low 80s, but Get outside never does, so once your stats are good it beats Rest on every stat for $9 a week. Let Get outside's gains shrink near the top the same way.
Measured per week at high stats (82/84/75): Get outside +0.58 happiness and +1.28 health more than Rest. Alternating Show up for town and Get outside scores 82 (2 years) with no money focus at all.
Change: turn.js, the focus step, apply the rest clamp ((86 − stat) / 20) to outdoors too. Rest then wins on happiness (+4) and Get outside on health (+5): a real choice.
After: town/outside alternation 82→73 (2 years) and 80→73 (5 years); outside/rest 69→63; sim planner 85/90 → 85/89, homebody 78→74, careless 57→56 and 58→56.
Balance: hits the no-effort stat combo hardest and leaves good play above 70.

### i59-b03 Bundle: the weekly-choice balance pass (M, 🔴)
Ship i59-b01, b02, b06, b08 and b09 together and re-run the sim. Measured as one change: careless and one-trick builds drop, the planner stays put, and overtime stops being a trap.
Measured (sim, 2 and 5 years, before → after): planner 85→84 and 90→90; careless 57→56 and 58→55; homebody 78→74 and 76→71; roadie 72→70 and 67→65; idle 35 and 28 unchanged; tripper 77 and 76 unchanged (i58-b03 handles it).
Random focus with two cheap visits a week: 86→76. Overtime planner vs Rest planner: 85 vs 87 before, 84 vs 85 after.
Files: state.js, turn.js, outabout.js; CHANGELOG 'Balance' line; sim report.
Balance: every target holds (careless ≤ 60, idle ≤ 50, good play ≥ 70).

### i59-b04 Balance sim: what each weekly choice is worth (M, 🔴)
Add a swap table to the balance report: the planner plays with one weekly slot swapped for each focus, and with each add-on (weekly trip, two visits, coffee) switched on or off. It prints points per week and money per week at every length.
Why: this round's dead options (overtime, the third trip stop, rest at high stats) only showed up by swapping one choice at a time with the same dice.
How: tests/sim.test.mjs gets a 'swap' bot family that takes a slot map; the report adds a table 'choice · 6 mo · 2 yr · 5 yr · Lifetime' in points against Rest.
Runs only in the full (not pull request) sim, about 40 extra games.
Balance: tooling only.

### i59-b05 Balance sim: fail when a choice loses to Rest everywhere (S, 🔴)
A new check: if swapping a weekly choice for Rest raises the planner's median at every length by 2 or more, the run fails with 'dead option: <choice>'. Overtime fails it today.
Measured now: overtime → Rest gives +2 (6 months), +2 (2 years), +2 (5 years), +2 (Lifetime). After i59-b01 it gives +0 to +1 and passes.
Uses the swap table from i59-b04; checks work, hustle, community, outdoors and study (study only at 2 years and up).
Files: tests/sim.test.mjs.
Balance: keeps future tuning from quietly burying a focus tile.

### i59-b06 The second Out and about visit of a week does half (S, 🟠)
Two cheap visits a week are the strongest choice in the game: about $22 a week turns a random-focus life (72) into 86, above the planner. Keep two visits, but the second one each week lifts half as much.
Measured per week: the jam and a game at the sports bar add +1.38 community on top of any focus, more than a full week of Show up for town (+1.12).
Change: outabout.js visit(): after the repeat check, mult *= 0.5 when o.n >= 1. The sheet says 'Second visit this week: half as special'.
After: planner + 2 cheap visits 94→89 (2 years); random focus + 2 cheap visits 86→83; Rest + 2 cheap visits 62→57. Sim bots unchanged (they make one visit).
Stronger option measured too: one visit a week (OUT_MAX 1) gives 94→87 and 86→82. Different from i38-a12, which caps points per stat.

### i59-b07 Out and about happiness and community top out near full (S, 🟠)
Visits keep their full lift at 95 happiness, so small treats pin a life at the top. Shrink a visit's happiness and community lift as the stat nears 90, like Rest (health is already covered by i38-a11).
Change: outabout.js visit(): multiply each non-health gain by clamp((90 − stat) / 25, 0.2, 1).
Measured: random focus + 2 cheap visits 86→82 (2 years) and 86→81 (5 years); planner + 2 cheap visits 94→89; planner 85→83.
The place card shows 'You're already in good spirits: a smaller lift' when it applies.
Balance: pick this or i59-b06, not both, then re-run the sim.

### i59-b08 Classes: trade certificate 24 weeks, associate 32, bachelor's 56 (S, 🟠)
The 16-week trade certificate is the best deal in the game and the bachelor's is a trap before 5 years. Even out the ladder: 24, 32 and 56 weeks (from 16, 40 and 72).
Measured now: no classes 76 (2 years); trade certificate only 88; associate 84; bachelor's 74. At 5 years: 74, 82, 87, 84.
After: trade certificate only 86; associate 83; bachelor's 73 (2 years) and 85 (5 years). Sim student 78→81 at 5 years; careless 58→56.
Files: state.js STUDY_NEED; Help 'Classes' numbers; the grad start's 20 weeks of progress still fits (20 of 32).
Balance: careless and planner unchanged at 2 years; patient study pays more in long lives.

### i59-b09 Side-hustle cash pays the same 15% tax as a paycheck (S, 🟡)
Hustle money is the only income with no tax line, so a new hustler already out-earns overtime at every job under $5,000 a month. Take 15% off hustle pay and show it as 'Taxes (side hustle)'.
Measured per week: hustle +$173 to +$480 (season and experience), overtime +$82 to +$361 after tax. In a balanced 3-week cycle, hustle/town/outside scores 77 vs overtime/town/outside 72.
Change: turn.js, the hustle line goes into the taxed total (or a separate 15% line).
After alone: hustler bot 50→49, alternating hustle/rest 64.6→64.0 average: small, but it pairs with i59-b01 so neither money focus is free money.
Balance: careless unchanged (57, 58).

### i59-b10 A trip's doctor checkup beats the town clinic again (S, 🟠)
The checkup in Walla Walla or Kennewick costs $250, gas and a quarter of your week for +6 health; the town clinic is $150 for +5 with no drive. Make the city checkup a full physical: +9 health, and the clinic stays the cheap quick option.
Measured cost per stat point (with gas in the 1998 pickup): clinic $107, trip checkup $155–168, the worst of all non-once options.
Files: features.js STOPS (checkup fx and note).
Or simply price it at $160.
Balance: only matters for players who plan health on purpose.

### i59-b11 The mall, the food court and off-season car washes get a reason (S, 🟡)
Three trip stops are dead: the mall ($40 + $32 gas for +2 happiness, $129 a point), the food court and a car wash outside harvest and winter ($82–89 a point). Give each a small reason to pick it.
The mall: +3 happiness and new clothes (the haircut's 2-week job-application bonus).
The food court: $10 and +1 community (you see people from work).
Car wash: say 'Best after harvest or winter roads' on the card, and hide it in Kennewick and Richland when it isn't.
Files: features.js STOPS; outabout.js outLookBonus. Balance: still far below the café and park on value.

### i59-b12 The paper and the farm counter stop being free community (S, 🟡)
Picking up the paper ($2) and talking shop at the farm counter (free) add community every week for nothing. Make them weekly-paper and farm-folk things: the paper's community only once a month, the counter's only for farm jobs or a wheat lease.
Measured: the cheap-visit bot's favorites are the counter (free), the paper ($2), the jam ($5) and coffee ($8). Together they keep community pinned at 100.
Files: outabout.js visit() (paper: community when 4+ weeks since the last paper; counter: fx only for farmhand, agtech or a wheat lease).
The card says why: 'You already know this week's news.'
Balance: small alone; stacks with i59-b06.

### i59-b13 Two-year net worth target: $90,000 to $120,000 (S, 🟡)
A planner reaches the 2-year target around week 90, so overtime, hustles and stock-up runs after that are worth nothing. A $120,000 target keeps money choices alive to the end.
Measured (sim results rescored): planner 85→82, careless 57→55, tripper 77→75, homebody 78→75, hustler 50→45; planner + weekly trips 96→90.
Cost: the sim student falls 63→55 because classes eat most of 2 years. Pair with i59-b08.
Files: state.js LENGTHS.two.target; Help and the score sheet read it already.
Rejected after measuring: moving happiness's top from 90 to 95 changes scores by 2 or less.

### i59-b14 The coffee-shop run-in needs a few weeks away (S, 🟡)
Coffee every week is worth about 9 points to the planner (85 with it, 76 without) for $8 a week. The 35% chance to run into an old friend (+3 community) should only come on a visit after 4 or more weeks away.
Change: outabout.js visit(): the run-in only when mult is 1 (not a repeat).
Measured: planner 85→84 (2 years), 89→89 (5 years); planner + 2 cheap visits 94→92.
Text: 'Running into old friends is likelier when you haven't been in a while.'
Balance: small; makes 'go every week' slightly less automatic.

### i59-b15 A trip away takes half your week, not a quarter (S, 🟡)
A trip away runs your focus at 75%. Since most players rest or work on trip weeks, that quarter barely costs anything. Make it 50%, so a weekly trip has a real cost.
Measured: planner + weekly trips 96→90 (2 years) and 92→90 (5 years). But the planner's own monthly trip costs it too: 90→86 at 5 years.
Also measured: cutting trips to 2 stops changed nothing (96→97), because the third stop lands on full stats anyway.
Files: features.js TRIP_TIME; Help's Trips 'Time' line.
Balance: a weaker fix than i58-b03 for the weekly tripper; use only if that one isn't built.

### i59-b16 The side-hustle ad lasts 4 weeks, not 8 (S, 🟡)
A $15 ad in the Tattler adds 15% hustle pay for 8 weeks: about $360 back for $15 if you hustle every week, so it's never a choice. Make it 4 weeks, $25.
Files: outabout.js AD_WEEKS and the ad's cost; the note text reads the constant.
Return after: about $180 for $25 when hustling weekly, about $60 when hustling one week in three.
Balance: tiny; helps hustle stay a planned choice.

### i59-b17 Balance sim: flag any bot whose median hits 100 (S, 🟠)
The planner with two visits a week scores a median 100 in 2-year games, and with weekly trips 96. A score of 100 leaves no room to reward better play. The report should warn when any bot's median is 95 or more.
Measured: planner + 2 fun visits 100 (2 years), 94 (5 years); planner + 2 cheap visits 94 and 96; planner + weekly trips 96 and 92.
Add those three as report-only bots ('optimizer') next to the planner.
Files: tests/sim.test.mjs.
Balance: tooling; turns score crowding at the top into a visible number.

### i59-b18 Balance sim: shared dice so swaps compare directly (S, 🟡)
The sim seeds each bot differently, so two bots never see the same weeks. Seed by length and game number only (the bot's habits still change what happens), so 'planner vs planner without overtime' compares like for like.
Seen this round: an unrelated change (two-stop trips) moved the 5-year careless median from 58 to 63 just by using dice differently. Paired dice cut that noise.
Files: tests/sim.test.mjs (seed formula); keep the old seed behind SIM_SEED=old for history.
Balance: tooling.

### i59-b19 Balance sim: a points-per-dollar list for stops and visits (S, 🟡)
Print every trip stop and visit with its cost, gas from Waitsburg and stat points, sorted by dollars per point. Outliers both ways are easy to spot.
This round's list: best are the farm counter (free), the jam ($3 a point), the depot in Dayton ($7 with gas) and the paper ($7). Worst: the will ($536, once), the mall ($129), trip checkups ($155–181).
Files: a small tools/ script or a section in the sim report, reading STOPS and PLACES.
Balance: tooling.

### i59-b20 Help: what a week of each choice does (S, 🟡)
A Help page with one plain table: what a typical week of each focus, a trip and two visits does to your stats and cash. Players can see why Rest stops helping and why overtime is hard work for little.
Numbers from this round (grain elevator job, compared with Rest): overtime +$149 and -1.7 happiness, -1.5 health; side hustle +$255; Show up for town +1.1 community for $12; a Walla Walla trip +3.4 happiness for $121; coffee and the paper +0.6 happiness and +0.9 community for $10.
Files: help.js (a new section; numbers computed from FOCUS, GIGS and STOPS so they stay true).
Balance: none; it helps careful players, not careless ones.

### i59-b21 Get outside does less in deep winter (S, 🟡)
Fishing the Touchet in January lifts you as much as in June. In December to February, Get outside does 70% unless you own a ski pass or winter gear, so Rest and Show up for town get their season.
Files: turn.js focus step (a winter factor for outdoors); the tile says 'Cold out: less of a lift' in winter.
Measure before shipping: Get outside is the strongest non-money focus all year, and this trims about a quarter of its weeks.
Balance: lowers pure-outdoors and alternation builds; the planner's 1-in-6 outdoors week barely notices.

### i59-b22 Side-hustle experience counts per kind of gig (S, 🟡)
Forty weeks of any hustle make you 60% better at all of them, so harvest work makes you a better plower. Track experience per gig (harvest, snow, yard, cars), so the full bonus takes longer and fits the work.
Measured: a hustler at full experience earns $277–480 a week, more than overtime at every job but the national lab scientist.
Files: turn.js (S.hustleWeeks → S.hustleXp[gig.id]); migrate() copies old weeks into every gig.
Balance: slower hustle growth; the jobs card can show 'Snow plowing: experienced'.

### i59-b23 Balance sim: the planner's lead isn't just coffee (S, 🟠)
The sim planner gets coffee every week and a game every sixth week. Without those visits it scores 76 in 2-year games, not 85, so the planner's lead over the homebody (78) is mostly the coffee. Report the planner with and without visits.
Measured: planner without visits 76 (2 years) and 86 (5 years); with coffee 85 and 89.
Change: a 'planner (no visits)' line in the report, and the 'good play ≥ 70' check uses it too.
Files: tests/sim.test.mjs.
Balance: tooling; keeps good-play targets honest after visit changes.

### i59-b24 Overtime weeks count toward your next raise (S, 🟡)
Overtime only pays this week; a side hustle builds experience. Let each Work extra hours week count 1.5 weeks toward the 12 months a raise or promotion needs, so overtime has a long-game reason of its own.
Files: turn.js (S.jobMonths += m * 1.5 on overtime weeks); events.js raise and promotion checks stay as they are.
The tile: '+35% pay, and the boss notices.'
Measure with i59-b01: target overtime planner ≥ Rest planner by 0–1 point, careless still ≤ 60.

### i59-b25 One Out and about visit a week: the strong version (S, 🟡)
If i59-b06 isn't enough, allow one visit a week instead of two. Measured, it is the strongest single visit change: it cuts the cheap-visit builds hard and barely touches the planner.
Measured: planner 85→83 (2 years) and 89→88; planner + 2 cheap visits 94→87 and 96→93; random focus + visits 86→82; Rest + visits 62→51 and 59→46.
Files: outabout.js OUT_MAX; Help and the Out and about button read the constant.
Different from i38-a12 (a per-stat cap): this keeps a visit's full lift but makes it one pick a week.
Balance: the cleanest choice-making fix; costs a little of the new feature's fun.
