# Ideas round 7

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 7: Everyone can play

Ideas to make The Burg playable and welcoming for everyone: players with disabilities, older players and kids, people with little time or little game experience, and lives of all kinds shown with respect.

### i7-a01 Reduced motion that follows the phone setting (S, 🔴)
Honors the phone's 'reduce motion' setting and adds a switch in Settings: no sliding sheets, count-ups, truck animation or confetti, just instant changes.
Reads prefers-reduced-motion and a prefs() flag; one CSS class on <body> turns transitions and keyframes off.
Touches index.html (CSS), ui.js (sheet/toast), maps.js (the 🛻 commute drive).
Test in screens.test.mjs: emulate reduced motion and check no animation runs longer than 0 ms.
Balance: none, display only.

### i7-a02 A one-sentence week summary for screen readers (S, 🔴)
After End Week, the live region reads one plain sentence: 'Week 34 done. You earned $612. Health up 2, happiness down 1. One event waiting.' A Settings choice picks short or full.
Builds the sentence in turn.js from the same deltas the result strip uses, then calls announce() in ui.js.
Skips (4/13 weeks, Auto) announce one sum-up, not every week.
Test: screens.test.mjs listens to #sr after End Week.
Balance: none.

### i7-a03 Stats in words, not just bars (S, 🔴)
Every stat bar also says a word band (Low, OK, Good, Great) and has notches, so you can read it without color or fine vision. Screen readers hear 'Health 72, Good, down 3 this week.'
Adds a band() helper in state.js and labels in renderHome() and showStatInfo() in ui.js.
Bar fill gets a pattern edge at the danger line so red/green is never the only signal.
Balance: none.

### i7-a04 Read aloud: events, choices and help (M, 🟠)
A 🔊 button on events, Help and the Journal reads the text out loud using the phone's built-in voice. Works offline on most phones; hidden where the browser has no voice.
Uses speechSynthesis in a small speak() helper in ui.js; a Settings slider for speed.
Reads the title, text, then each choice with its number.
Stops when a sheet closes. Test with a stubbed speechSynthesis in gameplay.test.mjs.
Balance: none.

### i7-a05 Grade 6 reading check for every line of game text (S, 🔴)
A build check scores every event, tip and help line for reading level and fails if any goes above about grade 6, listing the worst lines to rewrite.
New tools/reading-level.mjs walks EVENTS, TIPS and help.js text; simple syllable-count formula, no network.
Runs in rules.test.mjs with an allow-list for place names like Touchet and Bluewood.
Keeps new content plain as the game grows. Balance: none.

### i7-a06 New to games? A three-question start (S, 🔴)
A 'Never played one of these?' button on the title screen asks how long you want to play, how much reading you like, and if you want it easy. It sets length, mode, and helpful settings for you.
Lives in renderTitle() in ui.js; writes LENGTHS choice, mode and prefs (text size, read aloud, simple numbers).
Ends by offering the guided tutorial from help.js.
Balance: picks Normal or the gentle first season only; never a hidden easier score table.

### i7-a07 Simple numbers setting (S, 🟠)
Money shows as rounded plain words like 'about $1,200 a month' and 'about $300 left', and small stat changes show as arrows instead of decimals. Full numbers are one tap away.
A fmtSimple() next to fmt() in state.js, used by the result strip, Home and job rows when the pref is on.
Exact figures stay in the Life tab and in tap-to-explain sheets.
Balance: same rules and score; it only changes how numbers are shown.

### i7-a08 Plain-words Help: 'How do I...?' cards (M, 🔴)
Help opens on 12 short question cards ('How do I get a better job?', 'Why is my health dropping?', 'How do I save?'), each answered in two or three sentences with a 'Show me' button that jumps to the right tab.
Adds a QUESTIONS list in help.js; 'Show me' reuses the tutorial's highlight code.
Keeps the full guide behind 'Read the whole guide'.
Test: every card's Show me target exists. Balance: none, it explains, it doesn't play for you.

### i7-a09 Bigger buttons mode (M, 🟠)
One switch makes every button at least 56 px tall with more space between them, puts End Week and event choices at the bottom of the screen, and turns off swipe and long-press so a tap does everything.
A body class in index.html CSS; ui.js checks the pref before wiring swipe or long-press gestures.
screens.test.mjs runs a pass with the mode on and checks 56 px targets.
Helps shaky hands, older players and kids. Balance: none.

### i7-a10 Every gesture and timer has a tap-only way (S, 🟠)
Rule for the whole game: nothing needs a swipe, a hold, a drag or fast fingers. Any timed feature (like a Blitz clock or a fishing tap game) gets an 'Extra time' or 'Skip the mini-game, take the average result' option.
A checklist line in tests/screens.test.mjs plus a shared tapAlternative() pattern in ui.js.
Mini-games' average result equals their typical outcome, never the best one.
Balance: average result means skipping can't beat playing well.

### i7-a11 Word labels on every icon button (S, 🟠)
Buttons that are just an emoji (⏩, ⏭, 📋, 🗺️, ?) get a short visible word under them, so voice control ('tap Auto') and new players know what they do.
Small label spans in index.html and render() in ui.js; the accessible name matches the visible word.
Test: screens.test.mjs checks visible text is part of each button's accessible name (WCAG 2.5.3).
Balance: none.

### i7-a12 Map pins with shapes, letters and a 'list the places' view (S, 🟠)
Map pins use shapes and a letter, not just color, and a 'Places as a list' button reads them in order with distance and direction ('Dayton, 11 miles northeast, 3 jobs').
Touches maps.js pin drawing and adds a list sheet built from CITIES and town places.
Arrow keys move pin to pin on desktop.
Balance: none, same actions as the map.

### i7-a13 Easy-reading font and spacing (S, 🟡)
A Settings choice for a high-legibility font, wider line spacing, left-aligned text and no all-caps labels. The font file is cached for offline use.
Bundles one open-licensed legibility font in the repo and adds it to the sw.js cache list.
CSS variables in index.html switch font and line-height; .field loses uppercase.
Balance: none.

### i7-a14 Family-friendly events setting (S, 🟠)
A switch that keeps out events about drinking, betting and raffles, and softens a few heavy ones, for kids playing or family play. Those events are swapped for others in the same season, so the year isn't emptier.
Adds an adult:true tag to events in events.js and features.js (beer garden, wine weekends, horse-race bets); the event picker skips tagged ones.
Test: flows.test.mjs runs a year with the switch on and checks no tagged event fires.
Balance: replacements come from the same pool, so event counts and score stay the same.

### i7-a15 Heads-up before heavy moments (S, 🟡)
Optional content notes before events about death, serious illness, job loss or a breakup: a short line ('This one is about a funeral') with Continue or 'Just tell me what happened'.
A heavy:'death' tag on events; the event sheet in ui.js shows a pre-card when the pref is on.
'Just tell me' picks the calmer default choice and shows the result.
Balance: the default choice is the middle one, not the best one.

### i7-a16 Play-time reminder you set (S, 🟡)
Choose a gentle reminder after 15, 30 or 60 minutes. When it comes due, the game finishes the current week, saves, and shows a 'Good place to stop' card with what happened today.
A session timer in ui.js; the card reuses the year-in-review styles.
Pairs with Auto: Auto pauses at the reminder.
For parents of kid players and anyone with short breaks. Balance: none.

### i7-a17 Short-session quick week (M, 🟡)
A compact 'Quick week' view on Home shows only this week's focus, money left and End Week, for playing in a two-minute break. Tap 'Full view' any time.
A second Home layout in renderHome(); remembers the choice in prefs.
Still stops for events and warnings, so nothing is hidden that matters.
Balance: same choices and rules; it can't speed through events.

### i7-a18 Calm Home: show more only when it matters (M, 🟠)
New lives start with a lighter Home: three stats, focus and End Week. Loans, 401(k), kids and business panels appear the first time they apply, each with a one-line 'new here' note.
renderHome() and renderLife() check flags like S.mortgage, S.kids.length and S.k401 before drawing panels.
A Settings switch shows everything from the start for experienced players.
Balance: no rules change; it trims screen clutter.

### i7-a19 Young reader text for events (M, 🟡)
Each event can carry a short, simpler version of its text and choices. Players who pick 'Simpler words' in Settings see those, with the same choices and results.
Adds optional ts and choice ls fields in events.js; the event sheet picks them when the pref is on.
The reading-level check holds simpler text to about grade 3.
Balance: same go() functions, so outcomes are identical.

### i7-a20 Pronouns for you and your partner (S, 🔴)
At the start you can pick she, he or they for yourself, and the person you date gets a name and pronouns too. Every generated line (Tattler, Journal, ending story) uses them, and nothing in the rules changes with who you love.
Adds S.pron and S.partnerPron in newGame(); a small pron() text helper in state.js used by events.js and the ending.
Migrates old saves to 'they'. Test: rules.test.mjs checks all three sets render in the ending text.
Balance: none.

### i7-a21 Living with a disability: a respectful start (L, 🔴)
A start where you live with a disability you pick (wheelchair user, Deaf, low vision or a chronic illness). It changes which jobs suit you and adds real-life details like accessible housing, work accommodations and good days and bad days, never pity or a 'cure' story.
A new START in state.js with a S.disability field; job rows in ui.js show 'fits' or 'needs an accommodation'.
A short set of everyday events in events.js written with disabled players' input (see the writing guide idea).
Life Score target and scoring stay the same; extra costs come with matching supports so it's fair, not a hard mode.

### i7-a22 Ask for an accommodation at work (M, 🟠)
Any player with a health need (from a disability, an old injury or later life) can ask a boss for a change: a stool at the counter, a later shift, a screen reader, remote days. Most employers say yes; some need a nudge.
New event chain in events.js plus a job flag in JOBS for what each workplace can easily change.
Lowers that job's wear or stress while it lasts.
Balance: asking costs a week of focus and a small happiness dip; it trims wear, it doesn't raise pay.

### i7-a23 Came home from the service: a veteran start (M, 🟠)
A start for a veteran back from active duty: some savings, a skill that counts for certain jobs, GI Bill help with classes, and the VA clinic in Walla Walla. The Legion hall is a place to belong, and hard memories show up only if you choose.
A new START in state.js; study costs drop with S.giBill; one Legion hall place in outabout.js (stand-in name).
Events include Veterans Day at the school and helping a younger vet find work.
Balance: lower starting community (new in town again) offsets the class help.

### i7-a24 Parenting solo, with real supports (M, 🟠)
When you're raising kids on your own, the game shows the help a real family in the valley can get: child care subsidy, WIC, school meals, and neighbors who can do pickup. Each one has a plain sign-up and an income limit.
Adds a 'Family supports' panel to renderLife() when kids live with you and there's no partner; costs in kidCost() drop while you qualify.
Supports fade as income rises, checked monthly in turn.js.
Balance: supports cover part of the costs only, so a careless solo parent still scores lower than a careful one.

### i7-a25 Get paid as a family caregiver (M, 🟠)
If someone in your family needs daily care, you can become their paid caregiver through the state program: modest pay, flexible hours, and a lot of love and tiredness. Respite weekends matter.
A new job type in JOBS (city: waitsburg, low pay, high stress, no commute) unlocked by a family-care event in events.js.
A 'Respite weekend' Rest option recovers more happiness while you're caring.
Balance: pay is low and stress real; it's a meaningful path, not a score shortcut.

### i7-a26 First-generation family in the valley (M, 🟠)
A start where your parents came to work the orchards and onion fields. Being bilingual is a real skill (interpreter pay at the hospital or school), you help your parents with forms, and family celebrations are part of the year, shown as everyday life, not hardship.
A new START in state.js with S.bilingual; jobs like CNA, RN, para and clerk add a bilingual pay bump in payNow().
A few family events in events.js (a cousin's quinceañera, paperwork at the county office, Sunday dinner).
Balance: the pay bump is small (5%) and only on certain jobs.

### i7-a27 Help is there: benefits you can apply for (M, 🔴)
When money gets very tight, the Life tab shows what you can apply for: Basic Food, energy help for winter heat, free school meals and the food bank, each a one-tap application with no shame in the wording.
A 'Help you can get' panel in renderLife(); rules in turn.js check income and cash before paying out.
Ties into the hospital and debt systems so a bad stretch doesn't spiral straight to game over.
Balance: help only kicks in below a low income line and stops as you recover; idle players already earn too little score for it to lift them past 50.

### i7-a28 A town that looks like real towns (M, 🟠)
Fill the town cast with all kinds of people, written as neighbors first: the mechanic who uses a wheelchair, the retired teacher and her wife, the deputy who coaches Little League, the family who moved from Oaxaca. Their traits are never the joke or the plot.
A pass over event text in events.js, features.js and outabout.js to give named neighbors varied lives.
Pairs with the writing guide checks below.
Balance: content only.

### i7-a29 A writing guide for respectful events (S, 🟠)
A short guide for anyone adding events: write people as neighbors, not lessons; no traits as punchlines; no pity or 'inspiration' stories; show money trouble without blame. A test flags banned words.
A docs page plus a word list checked in rules.test.mjs over all event text.
Applies to NPC submissions in docs/npc-submissions.md too.
Balance: none.

### i7-a30 Older-player comfort pack (S, 🟡)
One Settings preset for older eyes and hands: larger text, bigger buttons, read aloud on, simple numbers and slower toasts that stay until tapped.
Just turns on existing prefs together from the Settings sheet in ui.js.
Toasts get a 'stay until tapped' option instead of timing out.
Balance: none.

### i7-a31 Messages stay until you're done reading (S, 🟡)
Toasts and the result strip never vanish on a timer if you choose 'Let me read'; they stay until tapped, and the Journal keeps every one.
toast() in ui.js checks a pref and adds a close button; screen readers already get announce().
Meets WCAG 2.2.1 timing for slower readers.
Balance: none.

### i7-a32 Life situations that are ordinary, not plot twists (M, 🟡)
Let players set a few background facts at the start (raised by grandparents, a parent in recovery, grew up in a trailer park, came out as a teen) that add small warm touches to events, never penalties.
Optional 'About you' picks in newGame(); events in events.js read S.bg for an extra line or a neighbor who gets it.
No stat changes from the picks themselves.
Balance: flavor only, so they can't be chosen for an edge.

### i7-a33 Captions for every sound (S, 🟡)
If the game gets sound, each one has a small caption ('🔔 church bell', '🚂 train horn') on screen, and vibration patterns get the same captions, so Deaf and hard-of-hearing players miss nothing.
A caption() call next to every sound or vibration call in ui.js.
Off by default unless the phone is muted or the pref is on.
Balance: none.

### i7-a34 Pause and think: no auto-advance ever (S, 🟡)
A guarantee that nothing moves on its own while you're reading: Auto and skips stop for any choice, the turn waits for you, and the 'Watch the weeks' view can be paused with one tap.
A check in turn.js skip loop and ui.js so no sheet closes on a timer.
Test in gameplay.test.mjs: an open sheet still waits after 30 seconds.
Balance: none.

## Ideas 7: Players and community content

Ways real Waitsburg folks and players can add to the game, beyond the v2.0 NPC submissions: a data format and pipeline, trivia and history, a real town board, and ways to give back.

### i7-b01 Events as data: a simple JSON event format (M, 🔴)
New events live in data/events.json with a title, place, season, text and two or three choices whose effects come from a fixed menu of sizes. Adding an event means adding a few lines, not writing code.
events.js gets a small loader that turns each JSON event into the same shape as today's EVENTS entries.
Effects use the same fixed menu as the v2.0 NPC events (small/medium money, happiness, health, community, a gamble), so every source shares one rulebook.
Touches events.js, sw.js (cache the file), tests.
Balance: effect sizes are capped by the menu, so new content can't hand out big free gains.

### i7-b02 Content checker for every data file (S, 🔴)
A script checks every content file before release: lengths, known places, allowed effects, seasons, and a list of real business names that must not appear.
tools/check-content.mjs runs in CI and in /release.
Fails with a plain message: which file, which line, what's wrong.
Touches tools/, the release workflow, tests.
Balance: it also flags any file that adds more than a set amount of total upside per year.

### i7-b03 One send helper for every community form (S, 🔴)
All player submissions (events, trivia, history, board notes) go through one helper with an offline queue, a honeypot and a 'type' field, reusing the NPC form's queue.
One Formspree form, sorted by type, so the free plan's inbox stays simple.
Every form gets the same Send, queued and thank-you screens.
Touches a new js/community.js (or features.js) and the v2.0 queue code.
Balance: no game rewards for sending anything.

### i7-b04 Submissions open or closed this month (S, 🟠)
The game reads a small flag file when online that says which kinds of submissions are open, so you can close forms when the 50-a-month Formspree limit gets close.
Closed forms show 'Back next month' instead of a Send button.
The flag ships in data/board.json and is fetched network-first, cached for offline.
Touches sw.js, community code.
Balance: none; it only protects the inbox.

### i7-b05 A content style guide (S, 🟠)
One short guide for anyone writing content: plain words, lengths, the effect menu, stand-in business names, and how Waitsburg sounds.
Linked from every submission form ('How to write a good one').
Same rules the checker enforces, written for people.
Touches docs/content-guide.md and the forms.
Balance: lists the effect sizes so writers know big wins aren't allowed.

### i7-b06 Send in a town happening (M, 🟠)
A form for a small town event without a character: a dog loose on Main Street, the elevator's first truck of harvest. Players fill title, place, season, text and two choices from the fixed effect menu.
Different from v2.0 NPC events: no person, just something that happens in town.
Approved ones ship in data/events.json with a 'Sent in by a player' line.
Touches the send helper, the JSON event format, the import tool.
Balance: same capped effect menu; the checker rejects anything over it.

### i7-b07 Seasonal content drops (M, 🔴)
Four times a year a release adds a small batch of new content for the coming season: a few events, trivia, history notes and board items, all from the data files.
Each drop is one folder, data/drops/2027-spring/, loaded when its season starts in the game.
What's new says 'New this season: 5 events, 12 trivia questions'.
Touches the data loader, ui.js What's new, the release checklist.
Balance: new events join the same paced event roll, so more content doesn't mean more events per week.

### i7-b08 Vote on what comes next (M, 🟠)
The board file lists three candidate events or features for the next drop. Players tap one to vote; the winner ships in the next drop.
One tap, no free text, so it needs no moderation.
Results come in through the send helper; one vote per device per drop.
Touches community code, board.json.
Balance: no reward for voting.

### i7-b09 Thumbs up or down on events (S, 🟡)
After an event, a small thumbs up or down. Counts stay on the device and, if the player agrees, go out in one bundle a month.
Shows which events are fun and which feel unfair, so drops can retire the duds.
Opt-in only; nothing but event titles and counts is sent.
Touches showEvent in events.js, the send helper.
Balance: no effect on play.

### i7-b10 Trivia night at the library (M, 🔴)
When you spend a week at the Weller Public Library, a three-question town quiz card can come up. Questions come from data/trivia.json, photo-free and about real Waitsburg.
Each right answer adds a small Education bump; a perfect card adds a little Community.
Shown at most once every four weeks, and only if you chose the library.
Touches maps.js (library focus), data/trivia.json, turn.js.
Balance: small and capped; idle play never sees it because it needs a chosen library week.

### i7-b11 Send in a trivia question (S, 🟠)
A form for a question, four answers and a source (a book, a sign, a website). Credited 'Asked by a player' if they want.
Multiple-choice only, so it's quick to check.
The source field is required so facts can be confirmed.
Touches the send helper, the import tool, data/trivia.json.
Balance: no reward for sending.

### i7-b12 Where in the Burg? map riddles (M, 🟠)
A short riddle about a real spot ('Water runs under me twice a year at high water...'). Answer by tapping the right place on the town or region map.
One riddle a season from the drop; solving it gives a small Community bump once.
Riddles are text only and point to existing map places.
Touches maps.js, the drop data.
Balance: one-time per riddle, so it can't be farmed.

### i7-b13 This week in Waitsburg history (S, 🔴)
A one-line history note tied to the real time of year, shown with the Tattler line on the weekly result.
Notes come from data/history.json, each with a month and a source.
Only checked facts ship; anything unsure stays out.
Touches outabout.js (tattlerLine), data/history.json.
Balance: flavor only.

### i7-b14 History markers on the town map (M, 🟠)
Small markers on the town map: tap one for a short history note about that spot, like the river, the fairgrounds or Main Street's old buildings.
Markers are a separate map layer that can be turned off.
Text comes from data/history.json, so contributors can add markers.
Touches maps.js, data/history.json.
Balance: no effect on stats.

### i7-b15 Send in a local history fact (S, 🟠)
A form for one history fact: the place, the year, two sentences and where it came from.
Reviewed against the source before it ships.
Credited by first name or 'a local' if they want.
Touches the send helper, import tool, data/history.json.
Balance: no reward.

### i7-b16 Looking back: stories from locals (S, 🟠)
Locals send a short memory of the old days (up to 280 characters). Picked ones run as a 'Looking back' column in the Tattler line now and then.
No names of other people allowed; the import tool flags them.
A source of real flavor without anyone writing events.
Touches outabout.js Tattler lines, the send helper.
Balance: flavor only.

### i7-b17 Recipe of the year at Celebration Days (S, 🟡)
Players send a family recipe as text. One a year shows up as the winning recipe in the Celebration Days or fair event and gets saved to a recipe card on Home.
Text only, short, no brand names.
The recipe card is a keepsake, not a stat.
Touches events.js (Celebration Days), the send helper, features.js.
Balance: no stat effect.

### i7-b18 A book of local sayings (S, 🟡)
Locals send sayings and nicknames ('the Burg', what people call a hill or a road). The game collects them in a little sayings book as you hear them in events.
Each saying has a meaning line for newcomers.
Collect them by playing; the book shows how many you've heard.
Touches help.js or features.js, data/sayings.json.
Balance: collection only.

### i7-b19 A live town board at the post office (M, 🔴)
The post office bulletin board pin gets a 'Town board' tab with real community happenings: Celebration Days dates, library story time, the food drive. It comes from data/board.json, fetched when online and cached for offline.
Each note has an end date and drops off by itself; the board shows 'as of' the last fetch.
Public and nonprofit happenings only, no businesses without their OK.
Touches maps.js (board place), sw.js (network-first for this one file), ui.js.
Balance: no game effect; it's a real-world window.

### i7-b20 Put a board item on your phone calendar (S, 🟡)
Each real board note has an 'Add to calendar' button that downloads a small calendar file.
Made on the device, no server.
Only for real-world notes, not game events.
Touches the town board sheet.
Balance: none.

### i7-b21 Send a real community event to the board (S, 🟠)
Schools, churches, the Grange or a club can send an upcoming public event for the town board: what, when, where, who to contact.
Reviewed, then added to board.json, which can update without a full release.
Fundraisers and volunteer days welcome; sales pitches aren't.
Touches the send helper, board.json.
Balance: none.

### i7-b22 Town notes built from word lists (M, 🟠)
Leave a note at a map place by picking words from lists ('Try the river in spring', 'Watch for deer here'). Picked notes ship to everyone in the next drop.
No free text, so nothing can go wrong in it.
Notes show as a small tip when you visit that place.
Touches maps.js, the send helper, data/notes.json.
Balance: tips are text only, never stat boosts.

### i7-b23 Share your year as a text postcard (S, 🟠)
At each year in review, a 'Send a postcard' button shares five plain lines about your year plus the game link, through the phone's share sheet.
Text, not a picture, so it works in any message app.
No personal details beyond what the player typed as their name.
Touches the year review in features.js, the share code.
Balance: none.

### i7-b24 Made with the town: a credits page (S, 🟠)
A page in Help lists everyone whose content shipped, by first name or 'a player', grouped by drop.
Opt-in only, using the credit choice from the form.
Removal requests take the name off in the next release.
Touches help.js, data/credits.json.
Balance: none.

### i7-b25 Town contributor badge (S, 🟡)
When someone's content ships, they get a short code. Typing it in Menu unlocks a cosmetic 'Town contributor' badge.
Codes are checked against a list of hashes in the data, so no server.
Cosmetic only.
Touches features.js badges, data/credits.json.
Balance: no score effect.

### i7-b26 Waitsburg for real: a page in Help (S, 🔴)
A short Help page about the real town: the library, the parks, Celebration Days, the food bank, how to visit. Links open in the browser.
Public and nonprofit places only, kept up to date with each drop.
Turns players into visitors.
Touches help.js.
Balance: none.

### i7-b27 'Try it for real' notes on events (S, 🟠)
Some events end with a small line pointing to the real thing: 'The real library has volunteer days too.' A Settings switch turns these off.
Only on events that match a real public activity.
Text lives on the JSON event as an optional field.
Touches events.js, the event format, settings.
Balance: none.

### i7-b28 Support the town link (S, 🟡)
A Menu item 'Support the town' links to a real local cause you choose, like the library friends or the food bank. Nothing in the game changes.
No in-game reward, so it never feels like pay-to-win.
You pick and update the cause in board.json.
Touches ui.js Menu, board.json.
Balance: none.

### i7-b29 A classroom pack for local schools (M, 🟡)
A teacher page with a local history and money quiz set, a one-week lesson using practice mode, and no accounts needed.
Uses the trivia and history data already built.
Practice mode keeps student play off the real records.
Touches docs/classroom.md, help.js, a trivia set flag.
Balance: practice mode doesn't count toward scores.

### i7-b30 Community goal with a real-world gift (L, 🟡)
A seasonal goal across all players who opt in, like 'finish 1,000 food drive weeks.' If the town reaches it, you make a real donation to a local cause you name.
Players send one opt-in count per season through the send helper; the board shows progress when online.
Your call on the gift and whether to run it at all.
Touches the season goal (#77) code, board.json, the send helper.
Balance: counts actions that are already balanced; no extra in-game reward.

### i7-b31 Every drop runs through the balance sim (S, 🟠)
Before a drop ships, the playtest sim runs with the new content to check careless, idle and good-play scores still hit their targets.
A drop that pushes careless above 60 or idle above 50 fails the release.
Reports which new events moved the numbers most.
Touches the sim tests and release checks.
Balance: this is the guard for all community content.
