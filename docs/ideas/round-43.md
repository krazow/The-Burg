# Ideas round 43

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 43: Accessibility audit

Fixes found by a measured Playwright audit of every screen and sheet (contrast, names, focus, 200% zoom, motion, announcements); axe-core is not installed, so checks were scripted.

### i43-a01 [Home] Week strip says its numbers, not just "details" (S, 🔴)
The #strip button's aria-label ("What the last week did: details") hides the cash and stat changes inside it, so a screen reader never hears "+$189, happiness up 1". Build the label from the same numbers runChips() shows, in words.
Measured: #strip has aria-label "What the last week did: details"; its visible chips (+$189, 😊 ▲1, ❤️ ±0) are never spoken.
Fix: a runWords() helper in turn.js next to runChips(); ui.js render() uses it for the aria-label.
Balance: no score effect.

### i43-a02 [Event] Event text is read when the sheet opens (S, 🔴)
sheet() moves focus straight to the first choice, so a screen reader says the title and "Fix it yourself" but skips the story. Add aria-describedby on #sheet pointing at the event paragraph.
Measured: event sheets get aria-label from the h2 only; focus lands on [data-i=0].
Fix: showEvent() in events.js gives the text paragraph an id; sheet() in ui.js sets aria-describedby when a [data-desc] element exists.
Balance: no score effect.

### i43-a03 [Event] The result sheet is named for the event, not "Message" (S, 🔴)
After you pick a choice, the result sheet has no heading, so sheet() names the dialog "Message". Give it an h2 like "Snow on Highway 12: how it went" so screen readers know where they are.
Measured: events.js:43 builds the result sheet without an h2; ui.js sheet() falls back to aria-label "Message".
Fix: add the h2 (can be visually small) in events.js; same check for any other sheet() call with no h2.
Balance: no score effect.

### i43-a04 [Home] Tabbed-to buttons scroll clear of the bottom bars (S, 🔴)
Tabbing down Home puts focus on buttons hidden under the fixed bars: measured "Out and about" under ⏩4, the job row under End Week, "Plan a trip" under the toast, map pins under the week strip. Add scroll-padding-bottom equal to the bar stack.
Measured at 390×844: 4 of 30 Tab stops on Home and 6 on the Waitsburg map were covered by .endbar, #strip, #ff4/#ff13 or #toast (WCAG 2.4.11).
Fix: html{scroll-padding-bottom:var(--barstack)} in index.html, with --barstack set from the bars' real height on render; a focusin handler scrolls the element in if still covered.
Balance: no score effect.

### i43-a05 [Tutorial] Tab stays inside the coach bubble and the lit spot (S, 🔴)
During the tutorial the keydown trap has no root (coach ? null), so Tab walks through every button under the dark overlay: measured 25 of 30 Tab stops on the Jobs step were behind .cdim. Trap Tab to the highlighted target plus Next and Skip.
Measured: tutorial step on Jobs, Tab reached Apply/Locked buttons covered by .cdim.
Fix: in ui.js keydown, when #coach is shown, use [highlighted element, #cnext, #cskip] as the focus loop; help.js drawCoach() stores the target.
Balance: no score effect.

### i43-a06 [Tutorial] The coach bubble is read once, with a name (S, 🟠)
The .cbubble is role="dialog" aria-live="polite" with no name, and drawCoach() also calls announce() with the same text, so each step can be read twice. Drop aria-live on the bubble and give it aria-label "Tutorial".
Measured: help.js:248 bubble role=dialog, aria-live=polite, no aria-label; help.js:254 announce() repeats the step text.
Fix: help.js only.
Balance: no score effect.

### i43-a07 [All] Toasts are announced once, not twice (S, 🟠)
#toast is already role="status" aria-live="polite", and several callers also run announce() with the same words (Out and about, backups, ui.js:316), so screen readers hear each message twice. Pick one path: toast() announces, callers stop doubling.
Measured: toast(msg); announce(msg) at outabout.js:212, ui.js:263 and ui.js:316.
Fix: mark #toast aria-hidden and have toast() call announce(), or remove the extra announce() calls. Add a test that #sr and #toast never carry the same text at once.
Balance: no score effect.

### i43-a08 [All] Control borders reach 3:1 contrast (S, 🔴)
The name box, length cards, chips, ghost buttons and focus tiles use --line (#e7dcc4) borders that measure 1.26:1 on cream (1.34:1 on paper); WCAG 1.4.11 asks 3:1 for the edge of a control. Add a darker --edge color for control borders only.
Measured on Title (#nm, .len, .btn.ghost), Jobs (.chip), Home (.fbtn, #ff4, #auto), Menu (#backup, #help) and every sheet Close button.
Fix: new --edge (about #9c8a70) in index.html for input, .len, .chip, .btn.ghost, .fbtn, .sm.alt; card borders stay soft.
Balance: no score effect.

### i43-a09 [Title] The name box shows the blue focus ring (S, 🟠)
input[type=text]:focus sets outline:none and shows focus only as a #c99a3b border, which measures 2.53:1 on the box. Drop the outline:none so the shared :focus-visible ring shows, as on every button.
Measured: Tab to #nm on Title reports no outline; same rule hits #heirnm on the next-generation sheet.
Fix: one line in index.html.
Balance: no score effect.

### i43-a10 [Life] The school progress bar is a real progress bar (S, 🟠)
The Education card's .bar (ui.js:589) is two plain divs with a track at 1.22:1, so screen readers skip it and low-vision players can't see where it ends. Give it role="progressbar" with aria-valuenow/max and a darker track.
Measured: .bar tracks 1.22:1 on Home and Life; Education bar has no role or value.
Fix: ui.js:589 markup; .bar background in index.html. Stat bars inside buttons already have the value in their label, so they only need the track color.
Balance: no score effect.

### i43-a11 [Home] Stat buttons drop the <label> inside them (S, 🟠)
Each stat button (Happiness, Health, Community, Net worth) wraps its text in a <label> that labels nothing; a label inside a button is invalid and some readers announce it oddly. Swap it for a span with the same class.
Measured: 4 "label inside button" hits on Home, every map view and sheet over Home.
Fix: statBtn() at ui.js:398-400 and the Net worth button at ui.js:427; CSS selector .stat label becomes .stat .lbl.
Balance: no score effect.

### i43-a12 [Title] Game length, Start and Mode are named groups (S, 🟠)
"Game length", "How your life begins" and "Mode" are <label> tags tied to nothing, and the length cards have no group at all, so a screen reader hears "6 Months, toggle" with no question. Use role="group" with aria-labelledby on each heading.
Measured: 3 orphan labels on Title and Title options; .lengths has no role.
Fix: renderTitle() in ui.js:29-41: give the labels ids, point the groups at them, drop the duplicate aria-label text.
Balance: no score effect.

### i43-a13 [Help] "Back to contents" buttons say which section they leave (S, 🟠)
The Help guide has 20 buttons all named "↑ Back to contents", so a screen reader's button list is 20 identical lines. Add aria-label "Back to contents from Money" etc. and hide the arrow.
Measured: Tab walk through #helpview hit 20 identical names.
Fix: the section template in help.js:22.
Balance: no score effect.

### i43-a14 [Sheets] The game behind a sheet or Help is inert (S, 🟠)
Help is role="dialog" without aria-modal, and neither Help nor sheets make #app inert, so a screen reader's swipe can wander into the Home screen behind. Set the inert attribute on #app while #modal or #helpview is open.
Measured: #helpview aria-modal=null; #app has no inert while sheets are open.
Fix: sheet()/closeSheet() in ui.js and openHelp()/closeHelp() in help.js toggle #app.inert; add aria-modal="true" to #helpview in index.html:214.
Balance: no score effect.

### i43-a15 [All] One h1 per screen and tab titles as h2 (S, 🟠)
Game screens have no h1: the player name is the h2 and tab content starts at h3 (Jobs "Job board", Life cards), so heading navigation has no top. Add a visually hidden h1 "The Burg" and an h2 per tab (Home, Jobs, Life, Journal).
Measured heading outlines: Home H2 name > H3; Jobs H2 name > H3 Job board; Life H2 > ten H3s.
Fix: render() and renderJobs/Life/Log in ui.js; .sr-only class exists already.
Balance: no score effect.

### i43-a16 [Sheets] Dialog names skip the leading emoji (S, 🟡)
sheet() names each dialog from its h2 text, so a reader says "spaghetti The Little Kiss Pasta Bar" or "direct hit Pick your life goals". Strip the leading emoji when setting aria-label.
Measured: 9 sheet dialog names start with an emoji (business card, trip, goals, challenges, weekly, records, What's new).
Fix: one regex in sheet() at ui.js:704.
Balance: no score effect.

### i43-a17 [All] Decorative emoji are hidden from screen readers (M, 🟡)
Buttons like "🏁 Challenges", "🏠Home", "💼Work extra" and "🛻 1998 pickup" are read with their emoji names first. Wrap the icon in <span aria-hidden="true"> through one small ic() helper.
Measured: emoji-first names on every screen (title buttons, nav tabs, focus tiles, Journal chips, goal list).
Fix: an ic() helper in state.js used by ui.js, maps.js, features.js and outabout.js templates; pins and tabs that already have aria-label stay as is.
Balance: no score effect.

### i43-a18 [Home] End Week says what it will do in plain words (S, 🟠)
The End Week button is read as "End Week right arrow couch Rest". Give it aria-label "End week, focus: Rest" built from FOCUS_SHORT.
Measured: #end accessible name "End Week →🛋️ Rest".
Fix: ui.js:371.
Balance: no score effect.

### i43-a19 [Home] At 200% zoom the week strip no longer sits on End Week (M, 🔴)
At 200% zoom on a 375px phone (187px wide) the fixed #strip (299-383px) overlaps .endbar (355-447px) by 28px and covers the End Week label. Stack strip and End Week in one fixed column so they push each other instead of using fixed bottoms.
Measured at 187×422 (375×667 at 200%): strip and endbar overlap; the tab bar clicks timed out because the pinned stack covered them.
Fix: index.html .weekstrip/.endbar wrapped in one fixed flex container in ui.js render().
Balance: no score effect.

### i43-a20 [Header] The header stops sticking when the screen is short (S, 🔴)
At 200% zoom in landscape (422×195) the sticky .top header (0-76px) and the fixed strip, End Week and tabs (37-195px) cover the whole screen, leaving no room for content. When the viewport is under 300px tall, make .top position:static.
Measured: 422×195 and 320×256, header plus bars use more than 100% of the height.
Fix: a @media (max-height:300px) rule in index.html; the bottom bars are a separate fix.
Balance: no score effect.

### i43-a21 [Header] Name and cash wrap instead of running together (S, 🟠)
At 200% zoom the header reads "Screens$1,689" with no space and the ? Help button is cut off at the right edge. Let .top .row wrap with a gap so cash drops under the name.
Measured at 187px wide: name, money and #helpbtn overflow the row.
Fix: .top .row{flex-wrap:wrap;gap:4px 10px} in index.html.
Balance: no score effect.

### i43-a22 [Home] Stat cards go to one column when zoomed (S, 🟠)
At 200% zoom the two-column .stats grid cuts the Health card off at the right edge. Use grid-template-columns:repeat(auto-fit,minmax(140px,1fr)) so cards stack when there is no room.
Measured at 187px wide on Home: Health and Net worth cards clipped.
Fix: .stats in index.html:66; same pattern for .focus and .fgrid.
Balance: no score effect.

### i43-a23 [Help] The contents list is one column on narrow screens (S, 🟡)
At 200% zoom the two-column .toc in Help pushes 19 section buttons past the right edge (right edge 205px on a 187px screen). Switch to one column under 360px.
Measured: 76 text pieces past the right edge inside #helpview at 187px wide.
Fix: one media rule for .toc in index.html.
Balance: no score effect.

### i43-a24 [Sheets] Sheets appear without sliding when Reduce Motion is on (S, 🟡)
With the phone set to Reduce Motion, every sheet still runs the up (slide) and fade animations: measured on 7 sheets. Add .modal and .sheet to the existing reduced-motion rule, plus the .bar width transition.
Measured with reducedMotion=reduce: getAnimations() shows "up" on #sheet and "fade" on #modal for business card, goals, end, challenges, weekly, records, What's new.
Fix: index.html:169 media rule gets .modal,.sheet{animation:none} and .bar i{transition:none}.
Balance: no score effect.

### i43-a25 [End] Read-heavy sheets put focus on the heading (S, 🟠)
The end screen puts focus on "Share score card", so a screen reader hears that button before the score. For end, year in review, records and What's new, focus the h2 (tabindex="-1") so reading starts at the top.
Measured: End sheet focus starts on #share; Records on #ok Close.
Fix: sheet() in ui.js takes a focusHead option; finish(), showYear, records and whatsNew pass it.
Balance: no score effect.

### i43-a26 [Trip] Full or blocked stops can still be focused to hear why (S, 🟠)
Trip stops that are blocked or over the limit use disabled, so keyboard and screen-reader players skip them and never hear the reason shown on screen ("Closed Mondays"). Use aria-disabled="true" and ignore the tap instead.
Measured: disabled [data-stop] buttons drop out of the Tab walk on the Walla Walla trip sheet.
Fix: tripSheet() and sum() in features.js:117-150; also the same pattern on locked job and focus tiles.
Balance: no score effect.

### i43-a27 [Maps] Arrow keys move between map pins (M, 🟠)
The Waitsburg map puts 12 pins and the Main Street close-up 13 more in the Tab order before "Out and about", so keyboard players tab 25 times to pass the maps. Make each map one Tab stop with arrow keys between pins (roving tabindex).
Measured: Tab walk on the map view hit 12 town pins, then 13 Main Street pins.
Fix: maps.js pin markup gets tabindex=-1 except the current one; one keydown handler per .mapsvg.
Balance: no score effect.

### i43-a28 [Home] A skip link to End Week (S, 🟡)
From the top of Home it takes 21 Tab presses to reach End Week. Add a first "Skip to End Week" link that only shows when focused.
Measured: #end was Tab stop 21 on Home at 390×844, more with the map open.
Fix: render() in ui.js; style shares .sr-only plus a :focus rule.
Balance: no score effect.

### i43-a29 [Tests] Add these checks to the screen test (M, 🟠)
Lock the fixes in: tests/screens.test.mjs gains control-border contrast, focus-not-covered on Tab, tutorial focus trap, a 200% zoom pass (187×422 and 422×195) and a reduced-motion animation check.
Measured with a throwaway Playwright script; axe-core is not in node_modules, so the checks are hand-written like the current audit().
Fix: tests/screens.test.mjs only.
Balance: no score effect.

## Ideas 43: Performance audit

Measured with Playwright on a 390 px phone view with CDP CPU throttling at 1x, 4x and 6x: load, parse, tab renders, weekTick, skips, save size over a full Lifetime, memory and the service-worker cache. Each idea names the number it improves.

Baseline at 6x: first paint 272 ms, script 39 ms, weekTick 0.3 ms, a 13-week engine run about 4 ms, End Week 25 ms median, Help open 326 ms. A real Lifetime save is 18.8 KB (log 66%), five lives use about 2% of the 5.2M-character quota, and the heap is 5.6 MB after GC following 600 played weeks (no leak seen). Map SVGs are small (79 and 63 elements).

### i43-b01 Save only the life you're playing (M, 🔴)
Each weekly save reads, parses and rewrites all five lives in one localStorage key. On a 6x-throttled phone that took 1.3 ms with one Lifetime life and 20.5 ms with five large ones (259K characters). Give each slot its own key (theburg.slot.0–4) so a week writes one 19 KB life.
Touches: js/state.js (slots, writeSlot, save), js/ui.js (loadSlot, backup/restore).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b02 Stop re-downloading the game on every launch (M, 🔴)
The service worker refreshes every file in the background on every request, so each launch re-fetches 11 files and 310 KB even when nothing changed. Serve straight from the versioned cache and fetch only when sw.js reports a new version: 0 KB per normal launch.
Touches: sw.js fetch handler, release kit version stamp.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b03 Open Help without building the whole guide (M, 🔴)
Opening Help builds a 38 KB guide (928 elements) at once and takes 326 ms on a 6x-throttled phone, the slowest tap in the game. Draw the contents list and first section, then fill other sections as they scroll into view (or use content-visibility: auto).
Touches: js/help.js (showHelp, guideHTML).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b04 Empty the Help screen when it closes (S, 🟠)
After Help closes, its 928 hidden elements stay in the page, so the DOM sits at about 1,250 nodes instead of about 320 and every later style pass walks them. Clear #helpview on close and rebuild on the next open.
Touches: js/help.js (closeHelp).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b05 First visit downloads each file once, not twice (M, 🟠)
A first visit makes 26 requests and moves 664 KB because the service worker's install fetches every file the page just loaded. Have install read from the HTTP cache (cache: 'force-cache', with release cache headers) to bring a first visit to about 330 KB.
Touches: sw.js install, release kit headers.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b06 Minify the scripts in the release kit (M, 🟠)
The 9 scripts are 291 KB raw and 95 KB gzipped, and parsing them takes about 49 ms on a 6x-throttled phone (ui.js 10.4, features.js 10.2, events.js 8.6 ms). A minify step in the shared release kit cuts bytes and parse time with no code change.
Touches: release kit build step, sw.js ASSETS.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b07 Load Help and the tutorial on first tap (S, 🟠)
help.js is 32 KB and only 11% of it runs on load (3.1 ms parse at 6x). Load it on the first ? tap or tutorial start, and keep it in the offline file list so it still works with no signal.
Touches: index.html script tags, js/help.js, sw.js ASSETS.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b08 Paint the title screen before the big event tables (M, 🟠)
Cold load has two long tasks of about 54 ms each and first paint at 272 ms on a 6x-throttled phone, while only 17–33% of ui.js, events.js and features.js runs before the title shows. Load state.js, the title and boot first, and the rest right after first paint.
Touches: index.html script order, js/boot.js.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b09 Event Journal lines save their kind (S, 🟠)
Event results are added to the Journal with no kind (events.js line 38), so every Journal render re-runs logKind's regexes and a scan of every story event for each line: 0.53 ms per 120 lines at 6x, twice per filter tap. Store k when the line is written.
Touches: js/events.js showEvent, js/state.js log().
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b10 Journal lines keep the week number, not the date text (S, 🟠)
Each Journal line stores text like 'Week of Jan 4, 2027'. That's about 2.4 KB of a 12.4 KB log, and the log is 66% of a 19 KB Lifetime save. Store the turn number and format the date when it's shown.
Touches: js/state.js log(), js/ui.js renderLog, js/turn.js year review (it matches lines by e.d year).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b11 Cap what one End Week remembers (S, 🟠)
S.run.happened only resets in playWeeks, so any path that runs weeks another way (the sim, scripted runs) grows it without limit: 33.9 KB after one Lifetime, 65% of a 51.7 KB save. Cap it at 30 entries plus a count.
Touches: js/turn.js playWeeks, js/events.js, js/features.js trips.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b12 Switching tabs redraws only the tab (M, 🟠)
render() rebuilds the whole app (header, end-week bar and nav) on every tab tap. The Jobs tab takes 17–18.6 ms on a 6x-throttled phone. Swap only #main on a tab change and update the header text in place.
Touches: js/ui.js render().
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b13 One save and one redraw per event week (S, 🟠)
A week with an event saves in playWeeks, saves again after the choice, then renders twice. A plain End Week costs 25 ms median (39 ms p95) at 6x while the rules take 0.3 ms. Save once after the choice and skip the first render when an event sheet follows.
Touches: js/turn.js playWeeks, js/events.js showEvent.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b14 A tiny slot list for the title screen (S, 🟠)
The title screen parses all five full lives just to show name, age, date and cash: 24 ms with one life, 31 ms with five Lifetime lives at 6x. Keep a small summary key (under 1 KB) updated on save and read only that on the title.
Touches: js/state.js save/writeSlot, js/ui.js renderTitle.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b15 Forget event cooldowns that ran out (S, 🟡)
S.evCd keeps an entry for every event ever seen, even long expired: 2.7 KB by the end of a Lifetime. Drop entries whose turn has passed once a year, during the year review.
Touches: js/turn.js year review, js/events.js picker.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b16 Build the region map's rivers once (S, 🟡)
The region map takes 1.27 ms per render at 6x, twice the town map (0.63 ms), because it re-projects every river and road point on every draw. Build the static layers once into a string and add only pins and highlights each time.
Touches: js/maps.js regionSVG.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b17 Cache the Help guide text by version (S, 🟡)
guideHTML() builds the same 38 KB string on every Help open: 12 ms at 6x. Keep it per app version and title/game mode and reuse it on later opens.
Touches: js/help.js guideHTML.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b18 Let the browser skip off-screen Journal lines (S, 🟡)
With 120 lines the Journal renders in 8.5–8.9 ms at 6x by year 10, up from 3 ms at week 0. Add content-visibility: auto to Journal cards so lines below the fold aren't laid out until scrolled to.
Touches: index.html CSS (.logitem, .card).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b19 Jobs tab works out take-home pay once a week (M, 🟡)
The Jobs tab is the slowest tab (16.7–18.6 ms at 6x by year 10) and recomputes pay, gas and commute for every job on each draw. Cache each job's take-home line per turn and clear it when the week, car or carpool changes.
Touches: js/ui.js renderJobs.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b20 Copy a life without the JSON round-trip (S, 🟡)
Loading a slot runs clone() (a JSON round-trip): 2.4 ms on a Lifetime save at 6x, on top of parsing the slot. With per-slot keys (i43-b01), parse the slot's own key once and skip the extra clone.
Touches: js/ui.js loadSlot, js/state.js clone.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b21 Keep the save small as features grow: a save-size line in the sim (S, 🟡)
A real Lifetime save is about 19 KB, so five lives use 2% of the 5.2M-character quota. Have the sim print the largest S keys and fail if one key passes 15 KB, so growth like the S.run case shows up early.
Touches: tests/sim.test.mjs report.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b22 Cache index.html once, not twice (S, 🟡)
The offline list caches './' and './index.html' as two 19 KB copies (15 entries, 353 KB; Chrome reports 981 KB of cache storage). Cache index.html once and answer './' from it.
Touches: sw.js ASSETS and fetch.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b23 A backup file that's 7 KB, not 125 KB (S, 🟠)
A backup with five Lifetime lives is a 125 KB pretty-printed file (94 KB without the indents), while the same data as the gzipped share code is 7 KB. Write the file compact and gzipped (with a plain-JSON fallback on restore) so backups mail and sync fast.
Touches: js/ui.js backup export/restore (backupCode already gzips).
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b24 Build the Jobs list while the phone is idle (S, 🟡)
The Jobs tab is the slowest tap at 17–18.6 ms on a 6x-throttled phone. After each End Week, build its HTML in requestIdleCallback so the next Jobs tap only swaps it in; throw it away if anything changes.
Touches: js/ui.js renderJobs, js/turn.js playWeeks.
Balance: no rule or score change; careless, idle and good play score the same as today.

### i43-b25 Run the old-save move once, not on every save (S, 🟡)
Every save calls slots(), which also checks for the pre-slot single save key: 0.95 ms per call at 6x with one Lifetime life. Do the move once at boot and have writeSlot skip the check.
Touches: js/state.js slots(), js/boot.js.
Balance: no rule or score change; careless, idle and good play score the same as today.
