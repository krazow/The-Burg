# Ideas round 54

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 54: Bug hunt 2

Real defects found by reading ui.js, maps.js, help.js, boot.js, index.html and sw.js; 🔴 ones were reproduced headless with Playwright.

### i54-a01 Double-tap on End Week plays only one week (S, 🔴)
A quick double tap on End Week now plays one week, not two. playWeeks ignores a second call while a week is running or within about 400 ms of the last one.
- Verified: a double click on #end moved the turn from 0 to 2.
- Files: js/turn.js (playWeeks busy flag and timestamp), js/ui.js (End Week, ⏩ and Auto buttons share the guard).
- Balance: none. It only stops lost weeks.

### i54-a02 The tap that closes a sheet does not land on what is under it (S, 🔴)
After a sheet closes, taps are ignored for about 350 ms, so the second half of a double tap no longer hits the tab bar or End Week behind it.
- Verified: a double tap on "Let's go" after being hired closed the sheet and then switched to the Life tab.
- Files: js/ui.js (closeSheet sets a short guard; one capture-phase click listener drops clicks inside the guard).
- Balance: none.

### i54-a03 Money shows as $1,500 on every phone (S, 🔴)
Money always uses US number style. Today a phone set to German shows "$1.500" for fifteen hundred dollars.
- Verified: with the de-DE locale the header showed "$1.500", and fmt(1234567) gave "$1.234.567".
- Files: js/state.js (fmt uses toLocaleString('en-US')), js/help.js (pw and the price tables).
- Balance: none.

### i54-a04 Focus goes back to the button that opened a sheet (M, 🔴)
Closing a sheet puts keyboard focus back on the button you used, even when that button has no id (stat cards, Apply, Got it, chips).
- Verified: Enter on the Happiness card, then Escape, left focus on the page body.
- sheet() saves only an element id. Save a selector instead (id, or the data-* attribute and its value) and look it up again after render.
- Files: js/ui.js (sheet, closeSheet).
- Balance: none.

### i54-a05 Picking a focus tile with the keyboard keeps focus there (S, 🔴)
After you pick a weekly focus with Enter or Space, focus stays on that tile instead of jumping to the top of the page.
- Verified: Enter on the Town tile re-rendered Home and focus went to the body.
- Fix: before render(), note the focused element's data-f (or data-tab, data-lf, data-k401); after render, focus the new element with the same value.
- Files: js/ui.js (render, renderHome).
- Balance: none.

### i54-a06 Map pins keep keyboard focus after a tap (S, 🔴)
Selecting a pin on the town or region map with the keyboard keeps focus on that pin, so the next Tab goes to its details card.
- Verified: Enter on the Touchet River pin redrew the map and focus went to the body.
- Fix: MAPTAP and MAPTAB refocus the pin or map tab with the same aria-label after render.
- Different from i43-a27 (arrow keys between pins).
- Files: js/maps.js.

### i54-a07 Closing Help opened from the Menu puts focus back on Menu (S, 🔴)
When you open Help from the Menu sheet and close it, focus returns to the Menu button in the tab bar.
- Verified: Menu → Help & tutorial → Escape left focus on the body.
- showHelp saves the focused id after closeSheet has already hidden it. Save it first, and fall back to the Menu tab button.
- Files: js/help.js (showHelp, closeHelp).

### i54-a08 Loading another life resets the Journal and job filters (S, 🔴)
Continuing or loading a life starts with the Journal on All and the job board on All towns, not the filters you left on in another life.
- Verified: with the Journal on Trips, loading another slot opened its Journal still filtered to Trips.
- Files: js/ui.js (loadSlot and newGame reset logFilter, jobCity and jobOK).
- Balance: none.

### i54-a09 A Main Street job keeps the Town pin on the map (S, 🔴)
If you work on Main Street (barista, grocer, teller and others), the town map still has a place for Show up for town.
- Verified: with the barista job, no town-map pin had the community focus, so map players could not pick Town.
- Fix: the workplace gets its own small pin next to Main Street (or a second button on the Main Street card), and Main Street keeps the Town focus.
- Files: js/maps.js (townPlaces), js/outabout.js (WORK_SPOT).

### i54-a10 The tutorial's Save game step cannot be tapped (S, 🔴)
On the look-only "Save game and Load game live here" step, tapping the ringed button no longer opens the real Save game sheet and derails the tutorial.
- Verified: a tap on the ringed #save opened "Save game" during the practice life; the next step looks for #close, which that sheet does not have.
- Fix: for steps without tap, draw a clear blocker over the ring so taps do nothing.
- Files: js/help.js (drawCoach), index.html (.cring style).

### i54-a11 A restored life with missing parts gets safe defaults (M, 🔴)
A backup life that has only the basics (name, length, money, date, age) now loads with sane defaults instead of crashing on Continue.
- Verified: such a life passed the restore check, then render() threw "Cannot read properties of undefined (reading 'ic')" (no focus) and the screen went blank.
- Fix: migrate() fills every field newGame sets (focus, log, stats, home, car and so on), or readBackup refuses the life.
- Different from i22-a21, which checks that home, car and job ids exist.
- Files: js/state.js (migrate), js/ui.js (readBackup).

### i54-a12 No "saved Invalid Date" on a backup (S, 🔴)
A backup with a missing or bad export date just leaves the date out.
- Verified: a backup with exported:"yesterday" showed "(saved Invalid Date)".
- Files: js/ui.js (restoreSheet: only show the date when it parses).

### i54-a13 The app opens offline from a link with ?something on it (S, 🔴)
Opening the game offline from a link like ?source=home still loads the cached game instead of a browser error page.
- Verified: offline, "/" loaded but "/?source=pwa" failed with net::ERR_FAILED.
- Fix: for navigation requests, match with ignoreSearch and fall back to the cached index.html.
- Files: sw.js (fetch handler).

### i54-a14 Two open copies of the game don't erase each other's weeks (M, 🔴)
If the same life is open in two windows (the installed app and a browser tab), the older window notices and reloads the life before you play on.
- Verified: 3 weeks played in tab B were overwritten when tab A ended one week (saved turn went from 3 to 1).
- Fix: listen for the storage event; when this life's slot changes elsewhere, show a short sheet and reload the slot (or go to the title screen).
- Files: js/ui.js or js/boot.js (storage listener), js/state.js (save).

### i54-a15 A save that fails says so (S, 🔴)
When the phone's storage is full or blocked, the game shows a clear warning once instead of silently not saving.
- Verified: with localStorage throwing QuotaExceededError the week played, nothing was saved, and no message appeared.
- Fix: store.set returns false on failure; save() shows "Couldn't save: your browser's storage is full" once per session.
- Files: js/state.js (store, save).

### i54-a16 The page behind a sheet stays still (S, 🔴)
Scrolling while a sheet is open no longer scrolls the game behind it, so you come back to the same spot.
- Verified: with a stat sheet open on the Life tab, a mouse-wheel scroll moved the page behind it by 600 px.
- Fix: add a class on body while the modal or Help is open (overflow:hidden) and overscroll-behavior:contain on the sheet.
- Files: js/ui.js (sheet, closeSheet), js/help.js, index.html.

### i54-a17 Help opened during the tutorial closes when it ends (S, 🟠)
If you tap ? on the tutorial's "Tap ? any time" step, Help no longer stays open over your real life when the tutorial finishes.
- Verified: the tap opened Help under the coach. endTutorial closes sheets but not Help.
- Fix: endTutorial also calls closeHelp (or make that step look-only, as with Save game).
- Files: js/help.js.

### i54-a18 Money never shows "$NaN" (S, 🟠)
If a number ever goes bad, money shows "$0" instead of "$NaN", and the error is logged for testing.
- Verified: fmt(NaN) and fmt(undefined) both return "$NaN". No live path found in normal play; restored or older saves are the risk.
- Files: js/state.js (fmt guards Number.isFinite).

### i54-a19 A new version's offline copy skips the browser's own cache (S, 🟠)
When a new version installs, its files come straight from the server, not from the browser's short-term cache, so the offline copy is never a mix of old and new files.
- Not verified headless. Hosts like GitHub Pages send max-age=600, so addAll can store files up to 10 minutes old under the new version name.
- Fix: addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))).
- Files: sw.js (install).

### i54-a20 Quick taps don't zoom the page on iPhone (S, 🟠)
Fast taps on buttons and map pins stop triggering double-tap zoom on iPhone.
- Not verified (needs Safari on iOS).
- Fix: touch-action: manipulation on button, .mpin and .chip.
- Files: index.html (CSS).

### i54-a21 Picking the same backup file again works (S, 🟡)
After a failed check, choosing the same backup file a second time checks it again.
- The file input keeps its value, so choosing the same file fires no change event. Not verified headless (Playwright always fires it).
- Fix: clear #rsfile.value after reading.
- Files: js/ui.js (restoreSheet).

### i54-a22 Focus lands on a working button after a backup check (S, 🟡)
When there are no free slots, focus goes to "Replace all my lives" instead of the disabled "Add" button (which can't take focus).
- Files: js/ui.js (restoreSheet: focus the first enabled button).

### i54-a23 The service worker reads only its own cache (S, 🟡)
The offline handler looks only in this version's cache, so a leftover cache from the beta or an older build can never answer a request.
- Not verified. Fix: caches.open(CACHE).then(c => c.match(req)).
- Files: sw.js (fetch).

### i54-a24 Only app files go into the offline cache (S, 🟡)
The background refresh stores only the app's own files, not every same-origin request, so the cache doesn't grow with one-off URLs.
- Not verified. Fix: only cache.put when the path is in ASSETS (ignoring the query).
- Files: sw.js (fetch).

### i54-a25 A note when a new version is ready (S, 🟡)
When a new version has installed in the background, a small toast says "Updated: reopen or tap to load the new version".
- Today the open page keeps running the old code until the next launch.
- Fix: on controllerchange, after the first install, offer a reload (only on the title screen or Home, never mid-event).
- Files: js/boot.js.

### i54-a26 A test file for these bugs (S, 🔴)
Add tests/bugs2.test.mjs with the repros above: double tap, locale, focus after sheet and render, filters after load, Main Street pin, offline ?query, two tabs and storage full.
- Each check is a few lines with tests/helpers.mjs, so the fixes stay fixed.
- Files: tests/bugs2.test.mjs, package.json (test script).

## Ideas 54: Mentors and passing it on

Ideas for learning from older townsfolk at 18 and, later, teaching the young ones yourself, so skills and stories pass down through Waitsburg.

### i54-b01 An old-timer takes you under their wing at 18 (M, 🔴)
A one-time opening event in events.js offers one of four mentors, matched to your start background.
Saving `S.mentor = {who, skill, bond, since}` in state.js (with save migration). practice() in features.js multiplies points for that skill while bond > 0.
Balance: the bonus only multiplies practice you already do. An idle player practices nothing, so it adds nothing.

### i54-b02 Coffee once a month keeps the mentor close (S, 🔴)
A new stop in outabout.js that only shows while you have a mentor. It uses no week, like other visits.
Bond drops 1 a month and rises 3 a visit, up to 10. At 0 the mentor fades to "an old friend" until you come back.
Balance: careless and idle bots never visit, so the bonus is gone within a season for them.

### i54-b03 A mentor card on the Life tab (S, 🔴)
A mentorCard() in features.js, placed next to skillsCard() in ui.js. It hides in practice mode, like the other cards.
Plain words: "Walt is teaching you Handy. Last coffee: 5 weeks ago."
Balance: display only.

### i54-b04 Your mentor's two cents before a big choice (M, 🔴)
A mentorTip(kind) helper in features.js, shown in the confirm sheets in ui.js for jobs, homes and vehicles.
Tips read from the same numbers the game already uses (payment vs. pay, commute miles, savings).
Balance: it helps careful players read the numbers. It does not change any odds.

### i54-b05 Take on an apprentice of your own (M, 🔴)
Saved as `S.mentee = {name, skill, weeks, path}` in state.js. It starts from an event in events.js once the condition is met.
A monthly "Teach [name]" choice arrives with the week; if you skip it twice in a row the kid drifts off.
Balance: only open to players who built a skill or held a job, which idle and careless bots rarely do.

### i54-b06 A playtest bot that keeps a mentor (S, 🔴)
Add a "mentored" bot next to planner and homebody. Report its median in the balance report.
Fail the run if careless median goes over 60 or idle over 50 once mentors are on.
Balance: this idea is the guard rail for the rest of the round.

### i54-b07 No mentor? Find one by showing up (S, 🟠)
A town-category event in events.js, weighted up by community standing and only when `S.mentor` is empty.
The new mentor's skill fits what you have been doing (side-hustle kind, rest weeks, town weeks).
Balance: a mentor is earned through town weeks, not handed out.

### i54-b08 Learn the river from the old-timer at the bridge (M, 🟠)
Counts your river visits from the town map in maps.js and turn.js. After 8, a one-time event in events.js marks you as "knows the river".
Knowing the river gives a one-week heads-up before `S.highWater` and the levee chain in features.js, with a choice to move things off the basement floor.
Balance: the warning saves a bit of damage. It only helps players who already spend weeks outside.

### i54-b09 Ride along in the combine cab for one harvest (M, 🟠)
A summer event in events.js for players under 25 without a full-time job. It takes your July weeks like the harvest gig.
Sets a flag that adds hire odds and a small starting raise for the farmhand job in ui.js.
Balance: low pay this summer for a better next year. Careless bots skip it.

### i54-b10 The teacher who remembers you (M, 🟠)
A three-step story chain in features.js (chain ids and waits as the fixer and levee chains do).
The letter adds a one-time boost to one job application. The care-home visit gives happiness and community.
Balance: the help is small and once only. The visit costs a week.

### i54-b11 Career day: talk to the kids about your job (S, 🟠)
A spring town event in events.js, when you have held a job for 2+ years.
Saying yes sets a flag that makes the apprentice event a little more likely.
Balance: costs a half day of pay. Only working players see it.

### i54-b12 Your apprentice's road: stay, stumble or leave (M, 🟠)
A story chain in features.js keyed off `S.mentee.path`. Patient teaching (choices that cost you a little) leads to the better outcomes.
Each step writes a Journal line. The ending shows up on the end screen.
Balance: it is mostly story, plus a small community lift if they stay in town.

### i54-b13 The mentor gets older too (M, 🟠)
Mentor age comes from `since` and a starting age. Events in events.js open as they reach their 80s.
Driving them costs a trip week (as in outabout.js). Their death is a quiet event with a funeral choice that lifts community.
Balance: costs time and gives standing. Ignoring it costs nothing, but you miss the next idea.

### i54-b14 Their toolbox, recipe box or phone list comes to you (S, 🟠)
A choice event in events.js that sets `S.keepsake`. Its perk is read where the Handy, Cook and People perks already are in features.js.
Worth half a skill level, and it shows on the mentor card.
Balance: only players who kept the bond up are offered it.

### i54-b15 Your mentor vouches for you, once (S, 🟠)
A button on the job apply sheet in ui.js when bond is 7 or more and the favor is unused.
Adds +15% to the hire chance used at ui.js:563.
Balance: once per mentor, and it needs months of visits.

### i54-b16 Not every piece of old advice holds up (M, 🟠)
About one in five mentorTip lines is marked dated in features.js. The Journal later notes how it played out.
Teaches weighing advice without making the mentor a fool.
Balance: following every tip blindly is not the best play.

### i54-b17 Thank the person who taught you (S, 🟠)
A milestone hook where badges are given out in features.js raises a short event.
Dinner costs money and adds bond and happiness. A call is free and gives a little bond.
Balance: small amounts. Its real job is to tie milestones to people.

### i54-b18 Two mentors, two different roads (S, 🟠)
A one-time event in events.js when you have a mentor and the teacher chain has started.
Siding with one lowers the other's bond by 3. Neither choice is wrong.
Balance: a trade, not a bonus.

### i54-b19 Thursday skills night at the grange hall (M, 🟠)
A monthly stop in outabout.js (stand-in name "Touchet Valley Grange") that shows up on the first Thursday week.
Choosing it sets the week's focus to community and adds 1.5 practice to that night's skill.
Balance: it replaces a week of something else, so it is a choice, not free points.

### i54-b20 Watch and learn when the truck breaks down (S, 🟠)
A third choice on the truck trouble events in events.js, shown when Mechanic is below level 2.
Half the shop bill, the truck is out an extra week (gas bus or carpool), +3 Mechanic practice.
Balance: saves money only for players willing to lose a week of easy commuting.

### i54-b21 Saturday lessons: teach your kid one skill on purpose (M, 🟠)
Each kid record gets `teach` and `pts`. skillWeek() in features.js adds kid points on rest weeks.
The 18 send-off text and the end screen name what they learned.
Balance: it rides on rest weeks you already take. The joy is small and it adds no money.

### i54-b22 Write it all down: the notebook for the grandkid (M, 🟠)
A choice on the retirement screen and in rest weeks after 62. It takes 6 weeks of writing to finish.
The heir set-up in features.js (near line 508) reads `S.notebook` and gives the grandkid starting points.
Balance: a small head start that costs the parent weeks of living.

### i54-b23 Retired? Become the old-timer people ask (M, 🟠)
A new FOCUS entry in state.js for retired players. Its happiness and community gains fade with streaks like every other focus.
Weekly flavor lines come from a small pool of who stopped by.
Balance: about the same as Show up for town, with a different feel. No money.

### i54-b24 Your old apprentice comes through for you (S, 🟠)
A town or road event in events.js that only rolls if `S.mentee.path` ended well.
One of three payback outcomes, each once only.
Balance: a one-time rescue that rewards earlier effort. It never shows for players who did not teach.

### i54-b25 Who taught whom: a mentor line across generations (L, 🟠)
The heir carry-over in features.js copies `S.mentee` into the new `S.mentor`, aged up, and keeps a `lineage` list.
The end screen in ui.js draws a short chain: "Walt → you → Rosa → your grandkid".
Balance: the grandkid starts with a mentor only if you taught one, so it is earned in the parent's life.

### i54-b26 Lead the kids' livestock club (M, 🟠)
A sign-up event in early spring in events.js. It is a mini commitment that checks your focus once a month.
Miss two meetings and the club gets a new leader, with a small community drop.
Balance: commitment with a cost to quitting, so it does not pay off half-effort play.

### i54-b27 Learn from someone younger (S, 🟡)
A work event in events.js tied to age and a job.
Taking help: People practice and a small happiness bump. Refusing: a little work stress for 4 weeks.
Balance: small either way. It turns mentoring around.

### i54-b28 Your mentor's sayings show up in the week (S, 🟡)
A sayings table per mentor type in features.js, chosen by season and situation in the recap notes in turn.js.
At most one a month so it does not wear thin.
Balance: flavor only.

### i54-b29 Tying flies with an old-timer in January (S, 🟡)
A winter event in events.js that sets a flag good through June.
River weeks add +1 happiness while the flag is on.
Balance: small and seasonal. Only helps players who go outside.

### i54-b30 Mentor of the year at Celebration Days (S, 🟡)
A once-per-life badge in features.js and a Journal milestone line.
A one-time community lift and a line on the end screen.
Balance: only reachable after years of real teaching.

### i54-b31 The year in review names who taught you and who you taught (S, 🟡)
Reads `S.mentor` and `S.mentee` in the year-in-review and end screen code in ui.js.
Plain words: "Walt taught you Handy for 4 years. You taught Rosa for 2."
Balance: display only.

### i54-b32 Help explains mentors in plain words (S, 🟡)
A new section in help.js next to Skills.
Four sentences, no numbers beyond "about half again as fast".
Balance: none.
