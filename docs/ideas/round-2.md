# Ideas round 2

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 2: Play experience

Ideas that make each week clearer, faster and kinder to play on a phone, without changing what a good life scores.

### i2-a01 Show what each event choice does (S, 🔴)

- Events today show only a label; you learn the cost after you tap.
- Add an optional `hint` (or `fx`) field to each choice in js/events.js and features.js; showEvent draws it in small text under the button.
- Hints show direction and rough cost, never the dice roll, so surprises stay.
- flows.test.mjs already taps every choice; add a check that every multi-choice event has hints.
- Balance: no change to outcomes. Helps careful players choose; careless players still tap the first button.

### i2-a02 Preview what this week's focus will do (S, 🔴)

- Players now guess what a focus does from a sentence.
- Compute a no-dice estimate from FOCUS, focusEffect() and the weekly bills in js/turn.js (a pure helper so weekTick and the preview share the math).
- Shows "works at 64%" when a streak is fading, right where you pick.
- Balance: information only. Makes ruts visible, which helps good play and does nothing for idle play.

### i2-a03 A Settings sheet in the Menu (M, 🔴)

- One place for comfort options instead of scattering them.
- New settingsSheet() in js/ui.js, stored with setPref(); applied as classes on <html> at boot.
- screens.test.mjs runs each screen with the largest text size and night theme on.
- Balance: none; no setting touches game math.

### i2-a04 Vibration on phones (S, 🟠)

- A tiny buzz() helper in js/state.js wraps navigator.vibrate and checks the setting.
- Called from playWeeks (turn.js), showEvent (events.js) and badge awards (features.js).
- iPhones ignore it quietly; Android and the APK build get it.
- Balance: none.

### i2-a05 Small sounds, made in code (M, 🟠)

- Works offline because nothing is downloaded; sw.js needs no new files.
- New sound.js (or a block in state.js) with 5–6 short synth patches and one volume setting.
- Plays only after a user tap, so browsers allow it; muted while Auto runs fast.
- Balance: none.

### i2-a06 Text size setting (S, 🟠)

- Set a root font-size class in index.html CSS and move fixed px sizes in ui.js templates to rem.
- screens.test.mjs adds the Larger size at 320 px and fails on overflow, as it does now.
- Balance: none.

### i2-a07 Night theme (M, 🟠)

- CSS variables in index.html already carry the palette; add a dark set under prefers-color-scheme and a .night class.
- Maps in maps.js and outabout.js use variables for land, rivers and labels instead of fixed fills.
- The contrast check in screens.test.mjs runs in both themes.
- Balance: none.

### i2-a08 Stats that count up after a week (S, 🟠)

- render() in ui.js keeps the old values from S.run and animates from them; the .bar transition already exists.
- Money count-up is a 400 ms requestAnimationFrame loop.
- Balance: none; makes cause and effect easier to feel.

### i2-a09 Seasons on the town scene (M, 🟡)

- SCENE in ui.js becomes a function of curMonth() with four color sets and a few seasonal shapes.
- Gives long games a sense of time passing without any text.
- Balance: none.

### i2-a10 A real moment for badges and milestones (S, 🟠)

- turn.js now toasts S.newBadges.join(' · '); queue them into one celebration sheet after the week instead.
- Respects reduce motion; one card even if several badges land at once.
- Balance: none.

### i2-a11 Auto until something you choose (M, 🔴)

- playWeeks() in turn.js takes a stop test alongside the current event and note checks.
- Cuts taps in 5-year and Lifetime games, the biggest tedium in the playtest.
- Balance: skips never change results, only taps. Low-stat stops help careful players; idle play still scores the same.

### i2-a12 A weekly focus rotation (M, 🔴)

- Add S.plan (an array of focus keys) and advance it in weekTick (turn.js); the focus grid gets a "Plan" toggle in ui.js.
- Changing focus by hand pauses the plan for that week.
- Balance: a plan is a choice the player makes, so it scores like the same choices made by hand. Streak fade still applies per focus, so a lazy one-item plan still ruts. Add a "rotation" bot to sim.test.mjs to confirm it stays near good play, not above it.

### i2-a13 Don't stop skips for events with no choice (M, 🔴)

- playWeeks() checks choices().length; single-choice events resolve in place and push to S.run.happened.
- showRunDetails() already lists what happened, so the digest reuses it.
- Balance: there was no decision to make, so outcomes are the same. Fewer taps only.

### i2-a14 "Previously in the Burg" when you come back (S, 🔴)

- loadSlot() in ui.js compares S.savedAt with now; the recap reads S.log, S.goals and seasonLine().
- One tap to dismiss; never shown twice for the same save.
- Balance: none; helps players keep a plan across sessions.

### i2-a15 A good place to stop (S, 🟡)

- Hook into seasonWeek() in state.js, which already knows when a season ends.
- Shown once per season, skippable, and not during Auto unless you chose "until next season".
- Balance: none.

### i2-a16 First-month checklist in a real game (M, 🟠)

- Replaces the three TIPS in ui.js with a list that tracks progress in prefs().
- No rewards, so it cannot change scores.
- Balance: none; teaches good habits without paying for them.

### i2-a17 First-time explainers for new systems (S, 🟠)

- A small FIRST table in help.js keyed by system; shown from the place that unlocks it and remembered in prefs().
- Pulls numbers from the same data as guideHTML(), so text stays right.
- Balance: none.

### i2-a18 Early warning when a stat keeps falling (S, 🟠)

- Keep the last 4 values per stat in S (turn.js); renderHome() draws the arrow.
- STATINFO in ui.js gains the likely cause from the week's lines.
- Balance: helps attentive players; careless and idle play ignore it, so their scores do not rise.

### i2-a19 One "next step" hint on Home (S, 🟠)

- Uses the same parts as showScoreNow() in features.js and picks from a short list of concrete suggestions.
- Tapping the hint goes to the right tab.
- Balance: advice only. It does not act for you, so ignoring it changes nothing.

### i2-a20 Tap a word to see what it means (S, 🟡)

- A GLOSSARY object in help.js and a term() helper used in ui.js and features.js templates.
- Keyboard and screen-reader friendly (a button with aria-describedby).
- Balance: none.

### i2-a21 Why did that happen? (M, 🟡)

- weekTick() in turn.js already builds S.last.lines; add a short "why" string to each line.
- showRunDetails() shows it on tap.
- Balance: none; explains the rules the game already uses.

### i2-a22 Swipe between tabs and to close sheets (M, 🟡)

- Pointer events on #main in ui.js, with a minimum distance so scrolling never triggers it.
- Event sheets with choices cannot be swiped away.
- Balance: none.

### i2-a23 Skip options behind a long-press on End Week (S, 🟡)

- The endbar in render() (ui.js) loses two buttons on narrow phones; wide screens keep them visible.
- Must keep 44 px targets and keyboard access for screens.test.mjs.
- Balance: none.

### i2-a24 Event choices in thumb reach (S, 🟡)

- CSS in index.html for #sheet when it holds data-i buttons; showEvent() in events.js keeps the layout for the result.
- Cuts thumb travel on tall phones.
- Balance: none.

### i2-a25 Undo Life-tab changes before End Week (S, 🟡)

- Store a clone of S before the action (clone() exists in state.js); Undo restores it.
- Cleared at the start of weekTick, so it never undoes a week's outcome.
- Balance: undo only covers choices made this week with no randomness, so no reroll exploit.

### i2-a26 Keyboard shortcuts on desktop and Windows (S, 🟡)

- One keydown listener in ui.js, off while a sheet or input has focus.
- Fits the Windows installer build, where people use a keyboard.
- Balance: none.

### i2-a27 Two columns on tablets and landscape (M, 🟡)

- A CSS grid in index.html at min-width 900 px; renderHome() adds a side column.
- screens.test.mjs already checks tablet and desktop sizes.
- Balance: none.

### i2-a28 Watch the weeks roll by on Auto (M, 🟡)

- playWeeks() in turn.js runs the loop in small timed steps when the speed is not Instant.
- Instant stays the default for tests; reduce motion forces Instant.
- Balance: none; outcomes are the same at any speed.

### i2-a29 Your life story at the ending (M, 🟠)

- finish() in features.js builds it from S.log milestones and the year-in-review data.
- Skippable with one tap; shareable as part of the score card.
- Balance: none.

### i2-a30 Install the app at the right moment (S, 🟠)

- Catch beforeinstallprompt in boot.js; the card lives in renderHome() tips.
- Hidden when already installed (display-mode: standalone) or in the APK.
- Balance: none.

### i2-a31 High-contrast and color-blind check (S, 🟡)

- statBar() and statColor() in ui.js gain a pattern class; the maps get stronger outlines.
- Add a high-contrast run to screens.test.mjs.
- Balance: none.

### i2-a32 Big choices say what will change (S, 🟠)

- moveHome() and buyCar() in ui.js act on one tap today; add a shared confirmSheet(lines) helper.
- Quit already asks, so use the same helper there.
- Balance: none; prevents costly mis-taps, which mostly hurt careful players.

## Ideas 2: Replay and progression

Ideas that give players reasons to start another life, things to collect and unlock across lives, offline ways to compete with friends, and endings that tell the story of the life they lived.

### i2-b01 Your life in the Tattler: an obituary at the end (S, 🔴)
- When a life ends, the Touchet Tattler runs a short write-up of it: the jobs you held, the house you owned, your kids, your business and what the town remembers you for, built from your Journal milestones.
- Built from the "mile" Journal entries and end state (job history, home, kids, biz, council, badges) with plain sentence templates.
- Shows at the top of the end screen and goes on the score card as a one-line quote.
- Touches finish() in js/features.js and the log kinds in js/state.js.
- No score effect; careless lives just get a shorter, plainer write-up.

### i2-b02 Where are they now: epilogue lines (S, 🔴)
- After the score, a few lines tell what became of the people and things in your life: your kids, your dog, the farmhouse, your business, your carpool buddy and the town goals you helped with.
- 4 to 8 lines picked from state: kids (stay or go), business (sold, passed on, closed), home (who lives there now), dog, council seat.
- A "6-month" or "2-year" life gets "a year later" lines instead.
- Touches finish() in js/features.js; a small EPILOGUE table of line templates.
- Cosmetic only, so it rewards a full life without changing balance.

### i2-b03 Lives lived: a shelf of every finished life (M, 🔴)
- Every life you finish is kept on a "Lives lived" shelf on the title screen with its name, start, mode, score, title and obituary line, so past lives aren't wiped when the slot clears.
- finish() already clears the slot; save a small summary (about 300 bytes) to a new theburg.lives.v1 key, newest 50 kept.
- Tap a life to reread its end screen and reshare its score card.
- Touches finish() in js/features.js, renderTitle() and backupData() in js/ui.js (backups must carry it, like badges).
- No score effect. Practice and tutorial lives are not kept.

### i2-b04 Unlockable starts earned across lives (M, 🔴)
- New ways to begin unlock from things you did in earlier lives: finish a Lifetime game to unlock "Coming home at 55", own a business to unlock "Inherit the woodshop", win the farm challenge to unlock "Fourth-generation farmer".
- New BACKGROUNDS entries with an unlock test read from the cross-life badge and challenge stores; locked chips show how to earn them.
- Each new start has a real trade-off (money vs. age, a business vs. its debt), like the five starts now.
- Touches BACKGROUNDS in js/state.js and the More options panel in js/ui.js.
- Each start keeps its own best score; the sim plays every start to keep careless <= 60 and idle <= 50.

### i2-b05 Start in the middle of life (M, 🟠)
- Pick a starting age of 18, 35 or 50. Older starts come with a job, a home, a partner or kids and some savings or debt already set, and a shorter, tighter road to a good score.
- Age 35 and 50 build a believable set-up from a small table (job, home, family, 401(k), debt) with a little randomness.
- Lifetime only; the wealth target scales with the years left so a late start isn't judged on an 18-year-old's target.
- Touches newGame() in js/ui.js, BACKGROUNDS and LENGTHS in js/state.js, gameProgress() in js/features.js.
- Starts get their own best-score keys; the sim checks idle play from a set-up life still lands <= 50.

### i2-b06 Five new challenges, unlocked as a ladder (M, 🟠)
- Add challenges like "Flood year" (high water in week 10, rebuild before winter), "Laid off at 45", "Open on Main Street in 2 years", "Win a council seat by 30" and "One car, three kids". Each unlocks when you finish the one before.
- New SCENARIOS entries with set(), win() and a "needs" field; the Challenges sheet shows the next locked one with a padlock.
- "Flood year" reuses the levee story chain by forcing its first step.
- Touches SCENARIOS and challengesSheet() in js/features.js.
- Win tests need active play (a seat, a shop, no debt), so idle and careless runs fail them.

### i2-b07 Bronze, silver and gold on every challenge (S, 🟠)
- Finishing a challenge earns bronze; doing it with a Life Score of 70 earns silver and 85 earns gold. The Challenges sheet and Your records show your medal for each.
- Store a medal level instead of 1 in theburg.challenges.v1 (old 1 reads as bronze).
- Medals show on the score card for challenge lives.
- Touches markChallenge(), finish() and challengesSheet() in js/features.js, recordsSheet() in js/ui.js.
- Gold needs a high score on top of the goal, so it can't be reached by grinding one stat.

### i2-b08 A badge book with hidden badges and progress (M, 🔴)
- A Badges screen shows all badges across lives, with progress bars ("3 of 5 towns") and 10 hidden badges that only show a hint until earned, like "Comeback kid" (climb from -$5,000 back to $10,000) and "Never left" (a whole life without a trip).
- A BADGES "hidden" flag and an optional progress() function; the title-screen badge strip becomes a button to the book.
- Hidden ones reward odd but deliberate play: every Main Street business visited, all three story endings, 10 years at one job.
- Touches BADGES and badgeWeek() in js/features.js, renderTitle() in js/ui.js, Help in js/help.js.
- Badges give no score unless pinned as a life goal; hidden ones can't be pinned, so they never inflate the score.

### i2-b09 Badges with levels (S, 🟡)
- Some badges grow in three steps: Town helper at 4, 12 and 24 town goals; Know the region at 5 towns, every stop type, every stop; Good dog at 1, 5 and 10 years with your dog.
- Store the highest level reached in S.badges and the cross-life badge store.
- Level 2 and 3 show a silver or gold ring on the badge.
- Touches BADGES and badgeWeek() in js/features.js.
- Only level 1 counts for life goals, so goal points stay where they are.

### i2-b10 The Burg album: every event you have seen (M, 🔴)
- A collection of every event and story in the game, filled in across all your lives. Ones you haven't met show as a grey card with a hint ("Happens in winter, if you own a home"), and you can reread the ones you have.
- Record event titles seen in a new theburg.album.v1 key when showEvent() runs; the hint comes from each event's month and "when" data.
- Shows "142 of 230 seen" on the title screen, with sections for town, road, work, stories and businesses.
- Touches showEvent() in js/ui.js, EVENTS in js/events.js, backupData() for backups.
- No score effect; it pushes players to try other starts, jobs and towns to find new cards.

### i2-b11 Story endings to collect (S, 🟠)
- Each story chain (fixer-upper, friend's shop, the levee) records which ending you reached, and the album shows "2 of 3 endings found" with a hint for the missing ones.
- Tag each final step in STORY_EVENTS with an ending id; save it to the album store on chainEnd().
- New stories added later slot in the same way.
- Touches STORY_EVENTS and chainEnd() in js/features.js.
- Endings pay out as they do now; collecting them adds nothing to the score.

### i2-b12 Life paths: what kind of life it was (M, 🔴)
- Besides the score title, each life gets a path name from how you lived it, like "The Farmer", "The Commuter", "Main Street Regular", "The Organizer", "The Builder" or "The One Who Stayed Put". Your records collect the paths you have lived.
- Count weeks per focus, job city, business, council and trips through the life; the path is the strongest pattern from a list of about 12.
- Each path has a one-line description and its own little icon on the score card.
- Touches turn() counters in js/turn.js, finish() in js/features.js, recordsSheet() in js/ui.js.
- Paths carry no points, so they reward variety of play, not a higher score; "Tumbleweed path" exists for idle lives so idle play earns nothing new.

### i2-b13 Heirlooms in legacy mode (M, 🔴)
- When you continue as your grandkid, pick two things to pass down besides money: the house, the business, the truck, a skill head start or the family name (extra community). Each has a catch, like the house's upkeep or the business's lease.
- legacySheet() gets a pick-two list; startLegacy() applies them (home, S.biz with fresh weeks, a skill at level 1, +10 community).
- The house comes with property tax and upkeep; the business comes at its current, depreciated value.
- Touches legacySheet() and startLegacy() in js/features.js.
- The money share drops when you take the house or business, so a generation can't stack every advantage.

### i2-b14 The family tree (M, 🟠)
- A Family tree screen for legacy lives shows each generation with their name, years, job, home, score and obituary line, plus a family score: the average across generations.
- Store a short summary per generation in S.family (carried by startLegacy()), and on the Lives lived shelf.
- Shows as a vertical tree with Roman-numeral names, opened from the end screen and the Life tab.
- Touches startLegacy() and finish() in js/features.js, the Life tab in js/ui.js.
- The family score is its own record; it never adds to a single life's score.

### i2-b15 Previous lives show up in town (M, 🟠)
- Your earlier citizens become townsfolk in later lives: the one who ran the food truck still parks it at Celebration Days, the council member is now the old-timer at the diner, and they show up in a few events by name.
- Read the Lives lived shelf; a handful of event templates fill in a past name, job or business ("Ask Dusty about the elevator job").
- Only in fresh lives, never in weekly or shared-code lives, so those stay the same for everyone.
- Touches EVENTS in js/events.js and the shelf store from the Lives lived idea.
- Events give small, ordinary effects, so a long history doesn't make new lives easier.

### i2-b16 The town grows across your lives (L, 🟠)
- Town goals you finish in any life add up on a town-wide meter. At steps along the way Waitsburg changes for later lives: the park gets new benches, the old theater reopens, the pool gets a new slide, each with new places and events on the map.
- A cross-life counter in a new theburg.town.v1 key; 5 to 6 steps each unlock a map spot and 1 to 2 events.
- A "Town over the years" card on the title screen shows what's been built and what's next.
- Touches seasonWeek() in js/features.js, the Waitsburg map in js/maps.js, EVENTS in js/events.js.
- Unlocks add variety, not stat boosts; weekly and shared-code lives use the base town so they stay fair.

### i2-b17 Daily 4-week sprint (M, 🔴)
- Once a day, a short seeded run: everyone gets the same mid-life situation (say, the truck died and rent is due) and four weeks to reach a goal. Takes two minutes and gives a small score card to share.
- Uses the existing seeded dice (S.rng, S.rngEv) with a date seed; a table of about 30 set-ups rotates by day.
- Its own scoring: how close you got to the goal plus the four stats, out of 100.
- Touches startWeekly()-style start code and the dice in js/features.js, a button in renderTitle() in js/ui.js.
- Not a Life Score and not kept in length records, so it can't affect balance targets; a done-nothing run always fails the goal.

### i2-b18 Weekly challenge twists (S, 🟠)
- Each week's challenge gets a rule picked by the seed: start as a transplant, no truck for the first 8 weeks, prices like Hard mode, or a flood in week 6. The twist shows on the challenge button and the score card.
- A short TWISTS table; weekSeed() picks one, and startWeekly() applies it to the new life.
- Keeps the weekly challenge fresh without new content each week.
- Touches startWeekly() and scoreCard() in js/features.js, the weekly sheet in js/ui.js.
- Twists only make it harder or different, never easier; score is still compared only within the same week.

### i2-b19 Weekly streak and history (S, 🟡)
- Keep your last 12 weekly-challenge scores (now only this week's is kept) and count your streak of weeks played in a row, shown on the title screen.
- Change pruneWeekly() to keep 12 weeks and add a small history list to Your records.
- A 4-, 12- and 26-week streak badge (cross-life, not pinnable).
- Touches pruneWeekly() and recordsSheet() in js/ui.js.
- No effect on any Life Score.

### i2-b20 Challenge a friend with a life code (M, 🔴)
- Any new life can be shared as a short code like BURG-7K3Q-F2 that holds its seed, start, length and mode. A friend types it in, plays the same life with the same events, and the score cards show the code so you can compare. Works fully offline.
- Encode seed, bg, len and mode in base-32 with a check letter; "Enter a life code" on the title screen.
- Uses the same seeded dice as the weekly challenge, so the same choices see the same events.
- Touches startWeekly()/newGame() and the dice in js/features.js and js/ui.js, scoreCard() for the code line.
- Same rules as any life; best scores per code are kept apart from normal records.

### i2-b21 Race your best run (S, 🟠)
- In a weekly or code life you have played before, Home shows a pace line: "Your best run had $4,200 and community 31 by now." At the end, see where you pulled ahead or fell behind.
- Save a few numbers every 4 weeks for the best run of each weekly week and code.
- Shows as one line under the Life Score so far.
- Touches turn() in js/turn.js, scoreButton() in js/features.js.
- Information only; no score effect.

### i2-b22 Family night: take turns on the same life (M, 🟠)
- Two to four players each type a name and play the same seeded 6-month life one after another on one phone. A table at the end ranks them and shows who made which big choices.
- A pass-and-play option on the weekly sheet: same seed per player, a "pass the phone" screen between turns.
- Saves each player's score and 3 biggest choices (from the Journal) for the final table.
- Touches startWeekly() and finish() in js/features.js, renderTitle() in js/ui.js.
- Each life is a normal life with normal scoring; nothing carries between players.

### i2-b23 A life story score card (S, 🟡)
- A second share card: a timeline of your life with ages and icons (first job, the farmhouse, kids, the business, retirement) instead of just the number.
- Drawn on canvas like scoreCard(), from the "mile" Journal entries, 8 to 10 points along a line.
- The end screen gets a "Share my life story" button beside the score card.
- Touches scoreCard() and shareCard() in js/features.js.
- Cosmetic only.

### i2-b24 Stars for every start and mode (S, 🟠)
- Each starting background earns up to three stars (Life Score 55, 70 and 85 in a 2-year or longer life). Stars show on the start chips, and Your records shows a grid of starts by mode.
- Read from the best-score store with start added to the key for new results.
- Gives a clear reason to try the young parent or transplant start on Hard.
- Touches finish() and bestKey() in js/state.js and js/features.js, the More options panel and recordsSheet() in js/ui.js.
- Thresholds match the score titles, so careless and idle play stay at zero stars.

### i2-b25 Next unlock on the title screen (S, 🟡)
- One line on the title screen points to the nearest thing to earn: "Finish a 5-year life with community 60 to unlock the Coming home at 55 start" or "2 more album cards from winter events".
- Picks the closest locked item across unlockable starts, challenges, badges and the album.
- Tap it to see the full list of what's locked and how to get it.
- Touches renderTitle() in js/ui.js and the unlock tests from the other ideas.
- A hint only.

### i2-b26 Your personal town records (S, 🟡)
- A records page beyond scores: oldest age reached, highest net worth, longest time at one job, most town goals in one life, fastest to buy a home, most generations in one family.
- Updated in finish() and kept in the best-score store (and backups).
- Each record names the life that set it and links to it on the Lives lived shelf.
- Touches finish() in js/features.js and recordsSheet() in js/ui.js.
- No score effect.

### i2-b27 Holiday specials on the real calendar (S, 🟡)
- During real Celebration Days week in May, the Fourth of July and Christmas week, the title screen offers a special 6-month start that begins in that season with its own town goal and a holiday badge.
- Reads the device date; works offline. Sets the start month and a themed season goal.
- The badge is cross-life and only earnable that week, giving a reason to come back.
- Touches newGame() in js/ui.js and SEASON_GOALS in js/state.js.
- Normal scoring; it counts toward the 6-month record like any life.

### i2-b28 Retirement chapter: choose your last years (M, 🟠)
- At retirement in a Lifetime game, pick how the last chapter goes: stay in the house, downsize to a place on Main Street, or move near the grandkids. Each changes the last years' events and the epilogue.
- A one-time choice sheet at retirement; downsizing sells the home and buys a smaller one, moving away ends with an "away from the Burg" epilogue.
- Late-life events filter on the choice (porch visits, a Main Street routine, grandkid weekends).
- Touches the retirement step in js/turn.js and EVENTS in js/events.js.
- Selling and buying use existing home prices; community still fades if you move away, so it isn't a free score boost.

### i2-b29 A keepsake shelf on Home (S, 🟡)
- Some moments leave a keepsake: a county fair ribbon, a levee plaque, your first paycheck stub, a Celebration Days T-shirt. They sit on a little shelf on Home and show at the end of the life.
- About 20 keepsakes tied to existing badges, stories and town goals; stored in S.keeps.
- Keepsakes count in the album across lives.
- Touches badgeWeek(), chainEnd() and seasonWeek() in js/features.js, the Home screen in js/ui.js.
- Purely for display.

### i2-b30 Score card shows your best and your record (S, 🟡)
- The share card adds "Personal best: 81" and, for weekly and code lives, "Week 2026-W47" or the code, so friends see how this run compares with yours.
- Small text lines added in scoreCard().
- Uses the best-score store already read in finish().
- Touches scoreCard() in js/features.js.
- No balance effect.
