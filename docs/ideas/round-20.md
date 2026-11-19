# Ideas round 20

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 20: Screen by screen

A walk through every screen and sheet at 360×640 and 768×1024, with layout, wording and polish fixes found in the screenshots.

### i20-a01 [Jobs] Town filter chips stop squashing into circles (S, 🔴)
At 360 and 768 wide the town chips shrink to 44px circles and cut words to 'All to' and 'Waits'. Chips keep their full width and the row scrolls, with a soft fade at the right edge to show there is more.
Files: index.html .chips/.chip CSS: add flex-shrink:0 and a right-edge fade mask.
Balance: Pure layout fix; no score effect.

### i20-a02 [Journal] Filter chips show whole words and a count (S, 🔴)
The Journal chips cut off to 'Mone', 'Event', 'Milestor'. Same no-shrink fix, plus a small count on each chip ('Money 4') so empty filters are clear before you tap.
Files: index.html chip CSS; js/ui.js Journal tab renders the counts.
Balance: Display only.

### i20-a03 [Home] Toasts sit above the bottom bars, not on top of them (S, 🔴)
The 'Badge earned' toast lands on the Last week strip and the holdings chips. Put it just above the strip, shorter, and fade it out after 2.5 seconds.
Files: index.html #toast position; js/ui.js toast().
Balance: No balance effect.

### i20-a04 [Event] Hold toasts while an event sheet is open (S, 🔴)
On the Windstorm sheet the badge toast covers the event title. Queue toasts while a sheet is open and show them after it closes.
Files: js/ui.js toast() checks #modal; flush on closeSheet().
Balance: Display only.

### i20-a05 [Home] A slimmer bottom stack on short phones (M, 🔴)
At 360×640 the Last week strip, End Week row and tab bar take about 175px, over a quarter of the screen. Under 700px tall, fold the strip into a single chip beside End Week and trim bar padding.
Files: index.html media query (max-height:700px); js/ui.js week strip markup.
Balance: More room for the map and focus; no score effect.

### i20-a06 [Home] Fast-forward buttons say what they do (S, 🟠)
'⏩ 4' and '⏩ 13' read like counts. Label them '+4 wks' and '+13 wks' with the icon above, and give Auto a short 'till event' line.
Files: js/ui.js end-week row labels.
Balance: Wording only; events still stop fast-forward, so careless play gains nothing.

### i20-a07 [Home] Map view gets the room it needs (M, 🟠)
On a small phone only the top third of the town and region maps shows above the bars. When Map is picked, scroll the map into view and give it a height of the space between header and bars.
Files: js/maps.js map container sizing; index.html .mapwrap height via calc(100dvh - bars).
Balance: Display only.

### i20-a08 [Home] Town goal box: one short line and progress dots (S, 🟡)
The town goal is a four-line sentence. Show 'Holiday food drive' with four dots for weeks done and 'Town or Outside focus · ends Feb' on a second short line.
Files: js/ui.js town goal render (features.js goal data).
Balance: Same rules, less reading.

### i20-a09 [Jobs] Section headers: can apply, needs a certificate, needs a degree (M, 🔴)
The job board is one 40-row list where Apply rows and locked rows mix. Split it under three headers with counts, so you can skip what you can't take yet.
Files: js/ui.js job board render, group by requirement.
Balance: No change to pay or odds.

### i20-a10 [Jobs] Clearer pay words: before tax and take-home (S, 🟠)
Rows say 'pay $578/wk' under '$491/wk take-home'. Rename the small line to 'before tax $578 · gas $0' so the two numbers don't look like a clash.
Files: js/ui.js job row text.
Balance: Wording only.

### i20-a11 [Jobs] Locked buttons name what you need (S, 🟠)
'🔒 Cert' and '🔒 Assoc.' don't say which one or how long. Show '🔒 Trade cert · 16 wks' and open a short sheet on tap with how to start it.
Files: js/ui.js job row; reuse education data from state.js.
Balance: Information only; school still costs time and money.

### i20-a12 [Jobs] Your current job pinned as its own card (M, 🟠)
The current job is just the first row with a green tag. Give it a card at the top with weeks worked and standing, and move 'Quit my job' into it.
Files: js/ui.js Jobs tab layout.
Balance: No balance change; quitting still opens its confirm sheet.

### i20-a13 [Jobs] Quit my job looks like a risky button (S, 🟡)
'Quit my job' sits at the very bottom styled like every other button. Give it a red outline and a warning line, and keep it away from Apply buttons.
Files: index.html .btn.danger; js/ui.js.
Balance: Fewer slip taps; no score effect.

### i20-a14 [Life] Buy buttons never cut off (S, 🔴)
'Buy ($9,015 dow' and 'Buy ($30,051 dow' are clipped at 360 wide. Use two lines: 'Buy' over '$9,015 down', with a fixed button width so the house rows line up.
Files: js/ui.js Home in Waitsburg and Ride rows; index.html .sm.
Balance: Display only.

### i20-a15 [Life] Jump chips at the top of a long tab (M, 🟠)
The Life tab is about five screens tall at 360 wide. Add a chip row (Goals, Skills, Business, Town, School, Home, Ride, 401(k), Household) that scrolls to each card.
Files: js/ui.js Life tab, ids on each card; reuse .chips.
Balance: Navigation only.

### i20-a16 [Life] Badges row says what you earned (S, 🟡)
'Earned: 💼' is a lone icon. Show 'Badges earned (1)' with the icon and name, and tap to open the full badge list.
Files: js/ui.js Life goals card.
Balance: No effect on goal points.

### i20-a17 [Life] Household rows in plain words (S, 🟡)
'Town council —' and 'Prices since 2027 Same' read oddly. Say 'Town council: not on it' and 'Prices: same as 2027'.
Files: js/ui.js Household card.
Balance: Wording only.

### i20-a18 [Life] Around town buttons side by side (S, 🟡)
The bank and clinic buttons stack at mixed widths under the table. Put them in an even two-up row, each 44px tall, labeled with the action ('Visit the bank').
Files: js/ui.js Around town card; index.html grid.
Balance: Display only.

### i20-a19 [Life] What you have stands out from what you could buy (S, 🟡)
In Home and Ride, your current place and truck are small rows with a tag. Highlight the owned row as a tinted card on top, then list the options below a thin 'Other choices' line.
Files: js/ui.js Home and Ride cards.
Balance: Display only.

### i20-a20 [Main Street] Readable labels on the close-up map (M, 🟠)
Business labels on the close-up are about 8px ('Woodshop', 'Law office'). Raise them to 11px, make pins 44px tap areas, and let a tap on the label open the card too.
Files: js/maps.js Main Street close-up SVG text and pin sizes.
Balance: Display only.

### i20-a21 [Region map] Bars don't cover the bottom of the map (S, 🟠)
The Last week strip sits over the map's source line and the bottom pins at both sizes. Add bottom padding equal to the bar stack so the whole map can scroll clear.
Files: index.html #main padding-bottom; js/maps.js.
Balance: Display only.

### i20-a22 [Business card] One way to count visits (S, 🔴)
Home says '2 of 2 quick visits left'; the business card says 'Visits this week: 0 of 2'. Use 'Visits left this week: 2 of 2' in both places.
Files: js/outabout.js line ~200 text.
Balance: Wording only.

### i20-a23 [Trip] A header that stays put on the trip sheet (M, 🔴)
Scroll the trip sheet and the town name, stops picked and Close all scroll away. Keep a slim sticky header: 'Walla Walla · 1 of 3 stops · Close'.
Files: js/outabout.js tripSheet; index.html sticky .sheethead.
Balance: Display only; stop limits unchanged.

### i20-a24 [Sheets] Close and main action pinned at the bottom of long sheets (M, 🟠)
On the Menu at 360×640 the Close button is cut off at the bottom edge; on Life goals there's no Done in view. Pin the last row of buttons to the sheet's bottom on any sheet taller than the screen.
Files: js/ui.js sheet(); index.html .sheetfoot sticky.
Balance: Display only.

### i20-a25 [Menu] Save first, risky last (S, 🟠)
Save and Load are both big red buttons, and 'End this life now' looks like the others. Make Save the only red one, Load a plain button, and give End this life a red outline under a gap.
Files: js/ui.js menu sheet; index.html .btn.danger.
Balance: Fewer accidental endings.

### i20-a26 [All] Names ending in s read right (S, 🟡)
'Screens's journal', 'Screens's life in the Burg' and 'Screens's life is in slot 1'. Add a small poss(name) helper that writes Screens' when the name ends in s.
Files: js/state.js helper; used in ui.js, features.js (end sheet and share image).
Balance: Wording only.

### i20-a27 [Life goals] A picked counter and Done button in view (S, 🟠)
The goal sheet scrolls past the fold with no count. Show '1 of 3 picked' at the top, Done pinned at the bottom, and goals already earned folded to the end.
Files: js/features.js goals sheet.
Balance: Same 2-point rule; earned goals still add nothing.

### i20-a28 [End] Score math in a clean table (S, 🔴)
At 360 wide '21/100 × 30% = 6' wraps so the 6 lands alone. Use four tight columns: Stat · Score · Weight · Points, with the long range notes in small text under the stat name.
Files: js/features.js finish() sheet; index.html table CSS.
Balance: Same math, easier to read.

### i20-a29 [Title] Mode and start chips in a tidy grid (S, 🟡)
The start chips wrap in a ragged centered stack and '☀️ Relaxed' breaks onto two lines. Use a two-column grid for starts and keep icon and word on one line for modes.
Files: js/ui.js renderTitle more options; index.html grid.
Balance: Display only.

### i20-a30 [Challenges] Start buttons fit on screen (S, 🔴)
The Start buttons are clipped at the right edge at 360 wide. Put Start under each description, full width or right-aligned, and show length and your best as small tags.
Files: js/ui.js challenges sheet.
Balance: Display only.

### i20-a31 [Weekly] Name the week in plain words (S, 🟠)
'Weekly challenge (2026-W47)' is code talk. Say 'Weekly challenge · week of Nov 16' on the title button, sheet and records; keep the code only for result matching.
Files: js/ui.js lines ~45, 79, 108; add a weekLabel() helper.
Balance: Wording only; same seed per week.

### i20-a32 [Records] Your bests stand out from the dashes (S, 🟡)
The records table is mostly dashes the same weight as scores. Make empty cells pale, bold the scores, and gold-tint your single top score.
Files: js/ui.js records sheet; index.html.
Balance: Display only.

### i20-a33 [What's new] Short list, then 'See all' (S, 🟡)
The What's new sheet runs past the screen with eight items and no button in view. Show the top three with 'See all' and a pinned 'Got it'.
Files: js/ui.js whatsNew().
Balance: Display only.

### i20-a34 [Tutorial] The highlight ring hugs the button (S, 🟡)
On step 2 the yellow box sits a few pixels off the Apply button and is square while the button is round. Match the target's rect and border radius.
Files: js/help.js tutorial spotlight.
Balance: Display only.

### i20-a35 [Tablet] Bottom bars match the content column (S, 🟡)
At 768 wide the cards are a 492px column but the tab bar spreads its five icons across the full width. Center the tab bar items in the same column width as the End Week row.
Files: index.html #app > nav max-width.
Balance: Display only; two-column layout stays a separate idea.

## Ideas 20: What winning means

Ways to rethink the Life Score so money doesn't dominate, players choose what they're playing for, the score teaches, and the last weeks can't be gamed.

### i20-b01 Play for something: pick a life aim (L, 🔴)
When a life starts, pick what you are playing for: All-around (today's score), Contentment, Roots, Adventure or Legacy. Your aim takes 15 of the 100 points from net worth and gives them to its own measure, so money stops being the only big lever.
New-life setup (ui.js) adds an aim row with one plain line per aim; S.aim is saved with the life.
lifeScore() (features.js) swaps 15% of the wealth weight for the aim's measure (ideas 02–05); All-around keeps today's formula.
The end screen, score sheet and share card show the aim.
Balance: every aim measure counts things you do, not weeks that pass, so idle play scores the same or lower; the sim check (i20-b23) keeps each aim's best play within a few points.

### i20-b02 Roots: a measure of how deep you grew in (M, 🟠)
A 0–100 Roots measure for years in Waitsburg, years in the same home, years at one job, regulars you know by name and town goals finished. It is the scoring part for the Roots aim and a line on every end screen.
rootsScore() in features.js from S.homeSince, S.jobMonths history, S.seasonWins and out-and-about visit counts (outabout.js).
Living in town counts double against living out of town.
Balance: staying put on the couch does not build it; regulars and town goals need Out and about and Show up for town weeks.

### i20-b03 Adventure: a measure of the new things you tried (M, 🟠)
A 0–100 Adventure measure: different towns visited, different Out and about places, trips taken, rare events seen and first-time event choices. It scores the Adventure aim and appears on every end screen.
adventureScore() in features.js from S.towns, a new S.placesSeen set (outabout.js visit()) and a count of first-time event choices (events.js).
Repeats count nothing; only the first time anywhere counts.
Balance: trips cost money and time, so it trades against wealth; idle play stays near 0.

### i20-b04 Legacy: what outlasts you (M, 🟠)
A 0–100 Legacy measure for things left behind: kids raised, a business handed on or sold, story chains finished for the town (the levee, the friend's shop), council years and money given away. It scores the Legacy aim.
legacyScore() in features.js from S.kids, S.biz, S.chains endings, S.council time and a new S.given total.
The end screen lists each item next to its points.
Balance: every item costs money, time or a choice that earns less now, so it can't be farmed in the last weeks.

### i20-b05 Good weeks: a count money can't buy (S, 🔴)
Each week where happiness and health are both 60+ and no bill went unpaid counts as a good week. The end screen shows it big under the score ("184 of 260 weeks were good ones"), and it is the Contentment aim's measure.
turn.js: S.goodWeeks += m when the week qualifies; a skip counts each week it covers.
finish() and showScoreNow() (features.js) show the count and the share.
Balance: it is an average by nature, so a late burst barely moves it; careless overtime and debt cost good weeks directly.

### i20-b06 Your aim can change, but it counts by the week (S, 🔴)
You can switch aims on the Life tab once a year, and the aim part of the score is weighted by how many weeks you held each aim. Switching to the aim you happen to be winning in the last month earns almost nothing.
S.aimWeeks = {aim: weeks} ticks in turn.js; lifeScore() blends each aim's measure by its share of weeks.
The Life tab says "Next change: March 2029".
Balance: this is the guard against last-week gaming for the aim system.

### i20-b07 End titles from your aim and your score (S, 🟠)
The end title comes from both your aim and your score: a Roots life at 80 is "Heart of the Burg", an Adventure life at 80 is "Valley Wanderer", a Legacy life at 80 is "Left It Better". Five tiers for each aim.
A TITLES table in features.js keyed by aim and tier replaces the one-line title in lifeScore().
All-around keeps today's titles.
Balance: words only; the score tiers stay the same.

### i20-b08 Low scores get kind titles (S, 🟡)
"Tumbleweed" and "Getting By" read as an insult after five years of play. Low tiers name what the life still had ("Kept Going", "Never Missed a Friday Game") from the best part of the life.
lifeScore() (features.js): under 55, pick the title from the highest of the four parts or the aim measure.
The tier number still shows, so the scale is honest.
Balance: none; the score is unchanged.

### i20-b09 Two verdicts at the end: the town's and yours (M, 🟠)
The end screen shows two results side by side: the Life Score (how the town sees it) and your own aim's verdict ("Roots: 88, you did what you set out to do"). A life can score modestly and still be a clear win on its own terms.
finish() (features.js) adds a second card with the aim measure, its label and one line about why.
Records keep both numbers; best scores still use the Life Score.
Balance: the aim verdict has no points of its own beyond its 15% share, so it can't inflate scores.

### i20-b10 Rate your own life before you see the score (S, 🟡)
Before the number appears, the game asks "How did this life feel?" with five faces. Your answer is saved next to the score, and the shelf shows lives where you and the game disagreed.
finish() (features.js) opens a short step first; S.selfRate is saved with the finished life record.
Skippable with one tap.
Balance: no effect on points.

### i20-b11 Security, not riches, in short games (M, 🟠)
In 6-month and 2-year games, net worth is scored by safety: months of bills covered, no debt, and a 401(k) started, not by raw dollars. A cautious short life is no longer a weak score.
lifeScore() (features.js): for half and two, the wealth part = 50% months-of-bills (capped at 6), 30% debt-free, 20% retirement saving.
Longer games keep net worth against the target.
Balance: careless play often runs debt, so it scores lower here; idle play has no 401(k) and few months saved.

### i20-b12 An 'enough' line on the score sheet (S, 🟠)
Once net worth passes the target, the score sheet says "You have enough. More money won't raise your score." and points at the parts that can still grow, including giving some away.
showScoreNow() (features.js): a tip card when wealth is 100; it links to the Legacy giving option if the aim system is in.
Same line in the year in review.
Balance: information only; it pushes rich planners toward the rest of life instead of more saving.

### i20-b13 A balanced life counts more than one maxed part (S, 🔴)
The Life Score uses 85% of the weighted parts plus 15% of your weakest part. Maxing money while health sits at 20 no longer carries a life.
lifeScore() (features.js): score = 0.85 × weighted sum + 0.15 × min(parts); rescale so a steady middling life lands where it does today.
The score sheet shows the weakest-part line.
Balance: careless lives usually have one wrecked part, so they drop; good play is balanced and loses about 1–2 points.

### i20-b14 The Life Score is the average of your report cards (M, 🔴)
The final score blends your quarterly report cards (60%) with the ending snapshot (40%), so a strong last month can't undo three bad years and a bad final week can't undo a good life.
turn.js already makes a report card every 13 weeks: keep S.cardSum and S.cardCount; lifeScore(final) blends them. Report cards use the in-game target scaled by progress (gameProgress()).
The end screen shows "Report-card average 71, ending 76".
Balance: closes the remaining last-week tricks for every part at once; steady good play is unchanged.

### i20-b15 Net worth counts what you'd really walk away with (S, 🟠)
At the end, the home counts after selling costs, vehicles at trade-in and a business at what its earnings record would fetch. Buying a new truck or a business in the last weeks no longer pads the score.
netWorth() (state.js) gains an atEnd flag used by lifeScore(): equity × 0.93, carValue × 0.8, bizValue() from the last two seasons' earnings.
The score sheet says which values are discounted.
Balance: hits late purchases and idle businesses; long-held assets lose a few percent only.

### i20-b16 Score so far says what the last weeks can still change (S, 🟠)
Near the end, the score sheet says how much is still in play: "3 weeks left: about +1 at most from happiness and health. The rest is settled." It teaches that the score is the life, not the finish.
showScoreNow() (features.js): with under 13 weeks left, work out the most each averaged part could still move and show one line.
Only in fixed-length games.
Balance: information only.

### i20-b17 Your three turning points (M, 🟠)
The end screen names the three stretches that moved your score most, found from the report cards: "Fall 2028: 14 overtime weeks, score -9" or "Spring 2030: bought the house, +6".
turn.js stores each report card with its top two causes (focus counts, a big buy, an event from S.log). finish() (features.js) picks the three biggest swings.
Each line has a date and an icon.
Balance: advice only; it helps mediocre players learn without changing points.

### i20-b18 The score as a picture: four bars and their weights (S, 🟠)
The score sheet and end screen show one stacked bar: each part's share in its own color, with the empty part of each bar showing what was left on the table.
A small inline SVG in showScoreNow() and finish() (features.js); colors from the stat icons.
Screen readers get the same numbers as text.
Balance: none.

### i20-b19 Try other weights on the end screen (S, 🟡)
A "What if it counted differently?" link on the end screen lets you slide the four weights and see your score change. It is for curiosity only and never saved as a record.
A sheet in features.js reusing lifeScore() parts with custom weights; marked "Just for fun".
Shows which weights make your life shine.
Balance: nothing recorded, so no effect.

### i20-b20 Every part's score in plain words (S, 🟡)
Each part on the end screen gets a short sentence from the life: "Health: strong until the Hanford years, then slipping." Numbers stay, but the words say what happened.
finish() (features.js): compare each part's report-card values by year and pick a phrase (steady, rising, a hard stretch in year N).
Grade 6 reading level.
Balance: none.

### i20-b21 Your aim shows up on birthdays (S, 🟡)
Each birthday the Journal says how your aim is going: "Roots: ten years on Preston Avenue." or "Adventure: you haven't been anywhere new this year."
turn.js birthday check (near the 🎂 note) adds one Journal line from the aim measure.
Uses the aim measures from ideas 02–05.
Balance: a nudge only.

### i20-b22 Halfway reckoning: is this still what you want? (S, 🟠)
At the halfway week (age 40 in Lifetime), a short sheet shows your aim's progress and the Life Score so far, and offers one free aim change without the yearly wait.
turn.js: a once-per-life stop at gameProgress() 0.5; uses the aim switch from i20-b06.
The week-weighting still applies, so a switch only counts from then on.
Balance: no free points; it gives mid-life a moment of choice.

### i20-b23 No aim beats another: a balance-sim check (S, 🔴)
The balance sim plays each aim with a strategy fitted to it and fails if any aim's median is more than 5 points above the others, or if idle play with any aim passes 50.
tests/sim.test.mjs: one bot per aim (Roots stays and shows up, Adventure travels, Legacy raises kids and finishes stories, Contentment rests and avoids debt).
Prints the medians in the balance report.
Balance: this is the guard that keeps there from being one optimal path.

### i20-b24 Share card leads with good weeks, not money (S, 🟠)
The share card shows the score, the aim, the title and the good-weeks count. Net worth is off by default, with a toggle to add it.
shareCard() (features.js) canvas layout; a checkbox on the share sheet.
Weekly challenge cards keep the score line the same.
Balance: none.

### i20-b25 Compare lives by what mattered, not dollars (M, 🟠)
Past lives can be sorted and compared by good weeks, Roots, Adventure and Legacy as well as score. Money is one column among five, not the headline.
Builds on the lives-lived shelf (i2-b03): store the four measures with each finished life (finish() in features.js); a sort row on the shelf sheet (ui.js title screen).
Comparing two lives (i15-b32) uses the same columns.
Balance: none.

### i20-b26 Pick your epitaph from three lines (S, 🟡)
At the end, the game writes three one-line epitaphs from your life ("She knew every dog on Main Street") and you pick the one that fits. It is kept with the life on the shelf and the share card.
finish() (features.js): lines from S.log milestones, the aim and the highest part; a small template table.
No real business names.
Balance: words only.

### i20-b27 The goals sheet suggests badges for your aim (S, 🟠)
When you pick life goals, the sheet puts the three badges that fit your aim at the top (Roots: Homeowner, Pillar of the town, Town helper). Any badge can still be pinned.
goalsSheet() (features.js): an aims → badge ids map sorts the list and tags "Fits your aim".
Points per goal stay at +2.
Balance: no change to points; it makes the aim and goals point the same way.

### i20-b28 New badges money can't buy (S, 🟠)
Add badges for a life well lived without dollars: A hundred good weeks, Ten years on one street, Seen it all (every Out and about place), Taught someone a skill, Never missed a Friday game in a season.
BADGES in features.js with tests from the new measures (good weeks, S.homeSince, S.placesSeen).
They can be pinned as life goals like any badge.
Balance: each takes many weeks of choices, so a late pin still needs the pin-before-earn rule that exists.

### i20-b29 A weekly challenge board for each aim (S, 🟡)
The weekly challenge keeps a best score for each aim, so a Roots run and an Adventure run on the same dice don't compete with each other.
bestKey() for weekly lives in features.js adds the aim; the challenge card lists one best per aim played.
Old weekly bests count as All-around.
Balance: none; same dice, same rules.

### i20-b30 Your partner has an aim too (M, 🟡)
A partner gets their own aim (roots, adventure or family) shown on the Life tab. The end screen says whether your life gave them theirs, and doing so adds a little to happiness along the way.
events.js sets S.partner.aim when the partner arrives; a small weekly check in turn.js gives happiness +0.3 when the week fits it (a trip, a home, a kid).
finish() (features.js) adds one line.
Balance: the happiness gain is small and capped by the existing weekly stat cap; it rewards choices, not time.
