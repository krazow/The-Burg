# Ideas round 62

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 62: Playtest of live 0.2.0

What a new player on a phone found in the live 0.2.0 build (first run, tutorial, a full 2-year life, Continue after reload, backup and restore), limited to things earlier rounds did not cover.

### i62-a01 Broken backup codes say plain words, not "Failed to fetch" (S, 🔴)
Seen on the live build: 30 characters cut off the end, and + turned to spaces, both said "⚠️ Failed to fetch".
ui.js readBackup(): wrap the gzip, atob and JSON steps and throw one plain message; keep the "doesn't look like a backup" message for text that has no BURG prefix at all.
No balance effect.

### i62-a02 Restoring the same backup twice makes twin lives (S, 🔴)
Seen: file restore after code restore gave slots [Sam:10, Sam:10].
ui.js restoreBackup() and the restore preview: match on name + len + the life's first date + savedAt; the preview marks matches "Already on this phone".
No balance effect; fewer accidental save-scum copies.

### i62-a03 Back up from the title screen, records and badges included (S, 🔴)
ui.js renderTitle() and backupSheet(): count "something to save" as lives, best scores or badges; the sheet says "0 lives, 1 record, 5 badges".
readBackup() accepts a backup with no lives when it has records or badges ("That backup has no saved lives in it" goes away for those).
No balance effect.

### i62-a04 A life that never worked scores 57: debt should cost points (M, 🔴)
features.js lifeScore(): wealth part = clamp(real / target × 100, −33, 100), so −$30k in a 2-year life costs about 10 points; the end sheet shows the minus line in red.
Count student loans at half so a grad's normal loan doesn't sink a careful life; run the sim for grad and careless.
Balance: my no-job sim (12 lives each) scored median 46 rotating Town/Outside/Rest and 20 resting; this pushes no-job lives well under the idle 50 and leaves careful lives (no debt) unchanged.

### i62-a05 The year in review comes back after closing the app (S, 🟠)
Verified on the live build: review open at week 52, reload, Continue: no sheet.
turn.js playWeeks(): store S.pendingReview before save(); ui.js loadSlot() shows it and clears it on "On to 2028".
Same pattern as the open-event fix (i60-a05), so build them together. No balance effect.

### i62-a06 A pasted code with words or quotes around it still restores (S, 🟠)
ui.js readBackup(): match /BURG[01]:[A-Za-z0-9+\/= \n]+/ and clean it first.
Messengers and notes apps often add text or break long lines; this saves a "my backup is broken" moment.
No balance effect.

### i62-a07 The restore preview lists records and badges, not just lives (S, 🟠)
ui.js restoreSheet() check(): count b.best keys, b.badges and b.challenges and name the best few.
Helps a player pick the right file when they have several backups.
No balance effect.

### i62-a08 After a restore, open the life you brought back (S, 🟡)
ui.js finishRestore(): a small sheet in place of the toast.
No balance effect.

### i62-a09 The restore preview says which slot each life will land in (S, 🟡)
ui.js restoreSheet(): work out the target slots before showing the cards; slotCard() takes a note.
No balance effect.

### i62-a10 Backups carry your settings and the tips you have seen (S, 🟡)
ui.js backupData() adds prefs; restoreBackup() merges tips (union) and keeps the new phone's view choices if it already has some.
No balance effect.

### i62-a11 Backup file names say who is inside and use your local date (S, 🟡)
ui.js backupSheet() download: local yyyy-mm-dd-hhmm plus up to 3 life names, cleaned to a-z and dashes.
Update the flows test pattern for the file name. No balance effect.

### i62-a12 Enter in the name box starts the life (S, 🟡)
ui.js renderTitle(): #nm keydown Enter → $("#start").click(); add enterkeyhint="go" to the input.
No balance effect.

### i62-a13 Finishing the tutorial marks its matching tips as seen (S, 🟡)
help.js endTutorial(true): set the three tip ids after restoring the saved prefs.
A skipped tutorial keeps the tips. No balance effect.

### i62-a14 The tutorial ring stays inside the screen on tab steps (S, 🟡)
help.js drawCoach(): clamp box x, y, w, h to 0..innerWidth/innerHeight after adding the pad.
No balance effect.

### i62-a15 Long names fit on the score card (S, 🟡)
features.js scoreCard(): a small fitText(g, text, max, startPx) helper for the name line and the mode line.
No balance effect.

### i62-a16 The long-shot horse loses money on average (S, 🟠)
events.js Celebration Days: chance(.28) → chance(.18).
Balance: removes a small free-money choice that careless players take every spring.

### i62-a17 Hunting fills the freezer, not your wallet (S, 🟠)
events.js Hunting season and the food line in turn.js weekTick(): S.freezer weeks cut food cost by 25%.
Balance: removes a sure profit; the happiness upside stays.

### i62-a18 Snapping back at a rude customer costs something (S, 🟠)
events.js A rude customer: chance(.2) → chance(.4); a write-up delays S.jobMonths by 4 weeks.
Balance: the patient choice stops being the worse one.

### i62-a19 Mandatory overtime means it: refusing has a real cost (S, 🟠)
events.js Mandatory overtime week: change the odds or the words so they agree.
Balance: Work it (pay vs. health) becomes a real trade-off instead of a trap.

### i62-a20 Snow day: the unpaid day shouldn't win every way (S, 🟡)
events.js Snow on Highway 12 and ditchMult(): pair with the tire purchase so preparing pays.
Balance: keeps the choice about risk, not an obvious answer.

### i62-a21 A test that flags event choices that beat the others on everything (M, 🟠)
tests/rules.test.mjs: clone S, run each choice, average the four deltas; allowlist events whose cost is later (test drive, kitchen, food truck, health plan).
Keeps new events honest as content grows. No balance effect by itself.

### i62-a22 A broken-backup test: damaged codes all get plain messages (S, 🟠)
tests/rules.test.mjs: the eight cases from this playtest; pairs with i62-a01 and i62-a06.
No balance effect.

### i62-a23 A two-phone test: finish, reload, back up, restore in a clean browser (M, 🟡)
tests/flows.test.mjs: two contexts on one served origin; covers i62-a03, a07, a08 and a10.
Note for testers: Playwright storage states are saved per origin and port, so carry them to the new port or use one server.

### i62-a24 The end screen offers to back up your records (S, 🟠)
features.js finish(): one ghost button that calls backupSheet(); needs i62-a03 so a backup with no lives works.
No balance effect.

### i62-a25 Bundle: Backups that forgive mistakes (M, 🔴)
Covers: i62-a01, i62-a02, i62-a03, i62-a06, i62-a07, i62-a08, i62-a09, i62-a10, i62-a11, i62-a24, with tests i62-a22 and i62-a23.
Touches ui.js (backupData, readBackup, restoreBackup, restoreSheet, finishRestore, renderTitle) and features.js finish().
No balance effect.

### i62-a26 Bundle: Event choices with honest odds (M, 🟠)
Covers: i62-a16, i62-a17, i62-a18, i62-a19, i62-a20, with the test i62-a21.
events.js only, plus a freezer line in turn.js weekTick().
Balance: removes small free wins that careless play picks up; run the sim and check careless median stays ≤ 60.

## Ideas 62: Humor and charm

Small-town comedy for The Burg: running gags, dry result lines, silly rare events and tiny charming details, all warm and never mean.

### i62-b01 Vern's '79 Ford tries to start (a running gag) (M, 🔴)
What: a neighbor's pickup that never starts, told in one recap line every 6–10 weeks.
Lines step forward and never repeat: "Vern has named the battery. It's not a nice name." … "Vern's truck now has a bird nest. Vern says the bird can stay."
Finale (once, year 3+, 1 in 40 a week): "It started." Cheer from the porch (🤝+2) or honk back (☺+2). The Tattler runs it the next week.
Files: turn.js recap, state.js S.gags, uses the gag tracker (i62-b28).
Balance: text only, finale stats capped at +2 once. Nothing to farm.

### i62-b02 Gerald the rooster weighs in on big choices (S, 🔴)
What: 1 in 6 events with a gain or loss over $300 add a Gerald line under the result.
Pool by outcome: loss ("Gerald turned his back to you, which is a lot for a rooster"), gain ("Gerald strutted past. He's taking partial credit"), declined ("Gerald seemed relieved").
Only for house or farm homes on the town map. Files: events.js showEvent result sheet.
Balance: words only; never changes a stat.

### i62-b03 The Tattler's correction that needs its own correction (S, 🔴)
What: TATTLER_CHAINS in outabout.js, each three lines, played on back-to-back weeks.
Example: wk1 "Mrs. Pruitt's pie takes first at the fair." wk2 "Correction: second." wk3 "Correction to last week's correction: it was a crisp. Mrs. Pruitt would like it known she was robbed."
About 8 chains, at most 3 per year, never repeated in a life. Different from the planned corrections column: this is the paper's own running mistake, not you.
Balance: flavor only.

### i62-b04 Callbacks: the third time, the game notices (M, 🔴)
What: S.evSeen[title] counter, and a CALLBACKS table of 15 common events with lines for the 3rd and 5th time.
Examples: Windstorm 3rd: "You know where the lawn chair goes now. It goes to the Hendersons'." Friendly stray 3rd: "Word's out among the cats."
Files: events.js showEvent, state.js. Old saves start at zero.
Balance: text only; counts don't touch odds or scores.

### i62-b05 Your phone number used to be the feed store's (M, 🟠)
What: event "Wrong number, again", cooldown 10 weeks, max 6 per life.
Choices: give them the right number (no effect); take a message and walk it over (☺−1, 🤝+2); "Quote them a price" ("You said forty dollars a bale. They said 'that's high.' You agreed.").
Payoff after 5: a feed store calendar with a different tractor each month on Home.
Files: events.js, ui.js Home. Balance: community gain tiny and capped by the cooldown; costs a little happiness.

### i62-b06 Earl's knee forecast in the Tattler (S, 🟠)
What: a weekly knee line added under the Tattler line, about one week in three.
Ties into the planned weather system: the knee reads next week's weather and is right 60%. Without weather, pure flavor.
Extra lines: "Earl's knee declined to comment." "Earl's knee is on vacation. Earl is not."
Files: outabout.js tattlerLine. Balance: no reward for trusting it.

### i62-b07 Funny result lines for Out and about visits (M, 🔴)
What: a lines[] array on each act in outabout.js; the toast picks one you haven't seen lately.
More: pasta dinner: "You said 'just a bite' of the tiramisu. It was not just a bite." Bluegrass jam: "You clapped on one and three. Nobody said a word, which is how you know they like you." Haircut: "You look like someone who returns library books on time."
About 25 acts × 4 lines. Uses stand-in names already in the file.
Balance: same costs and effects as now.

### i62-b08 Norman the garden gnome is on tour (M, 🟠)
What: maps.js draws a tiny gnome at one of 15 spots, picked by month.
Tap: "Norman, at the grain elevator. He looks well." (☺+1, once per month). Tattler: "Norman spotted near the pool. Norman did not swim."
Postcard after 12: a Journal line and a keepsake. Files: maps.js, state.js S.gnome.
Balance: +1 happy at most once a month, needs an actual tap, so idle play gets nothing.

### i62-b09 The lost and found box at City Hall (S, 🟡)
What: a 30-item pool, three shown each week.
Payoff: if you lost a wallet or a glove in an event, 1 in 10 weeks it's in the box: "Your glove. Somebody washed it." (☺+1).
Files: outabout.js City Hall card, events.js flags.
Balance: one tiny return per loss, never money beyond what was lost.

### i62-b10 Dueling church reader boards (S, 🟠)
What: 20 sign pairs, one per month, in the recap. The two churches have no names, just "the brick church" and "the white church".
More: "'Free coffee Sunday.' / 'Ours is decaf. We forgive you.'" "'Come as you are.' / 'Wipe your feet first.'"
Rule: food, weather and parking jokes only. No doctrine, no digs.
Files: turn.js recap. Balance: flavor only.

### i62-b11 Silly numbers in the year in review (S, 🔴)
What: a pool of about 20 count lines; the review picks the three biggest that aren't zero.
Examples: weeks you rested ("The couch thanks you for 19 weeks of service"), jams attended, Tattlers bought, gnome sightings.
Files: turn.js year review, S.run counters (most exist).
Balance: display only.

### i62-b12 The fish that grows every time you tell it (M, 🟠)
What: 1 in 12 Get outside weeks in May–Sept log a fish with a length.
Each January the claim grows: "You told the steelhead story at the café. It's 23 inches now. Earl's knee has doubts."
Files: turn.js focus results, state.js S.fish, end screen.
Balance: no stats from the claim; the catch itself gives ☺+1, same as a normal outside week.

### i62-b13 The fruitcake that will not die (S, 🟠)
What: a December event, once a year, with the owner list growing ("Pruitt 2019, Hendersons 2021, you 2027").
Choices: re-gift (it'll be back in 2–4 years); eat it (❤️−1, the Tattler runs "Fruitcake, 2011–2028, finally"); frame the tag (it hangs on Home).
Once eaten or framed, the gag ends for that life.
Files: events.js, state.js. Balance: tiny, one-time effects.

### i62-b14 New folks say "Touch-et" (S, 🟠)
What: Transplant background only, one event in month one, one payoff line at the first anniversary.
Choices: practice it out loud in the truck (🤝+1 at the payoff); keep saying it your way ("People are too polite to correct you twice").
Files: events.js, S.bg check.
Balance: +1 community once, delayed a year.

### i62-b15 Doris the deer eats only your tulips (M, 🟡)
What: an April event for homeowners who bought starts, once a year.
Choices: a fence (−$, starts keep their full boost); plant daffodils ("Doris looked at them. Doris left."); let her be ("Doris has brought a friend. The friend is also Doris.").
Files: events.js, outabout.js garden act.
Balance: the worst case trims one week's garden happiness by 1; never punishes renters or non-gardeners.

### i62-b16 Stand-in business names with gentle wordplay (S, 🟠)
What: a short NAMES.md list in docs with 30 stand-in names by kind, ready for new places and Tattler ads.
More: "Bale Bonds" (bail joke, used only as a classified gag), "The Spare Part" (hardware), "Shear Luck" (sheep shearing), "Hay There Feed & Seed".
Rule: check each name against the real valley businesses before use; keep real names out.
Balance: none needed.

### i62-b17 The council cat abstains (S, 🟡)
What: one line per council term-year in the council results and the Tattler.
Pool: "Biscuits moved to table the motion. Then she was the table." "Biscuits voted with her eyes closed. So did Earl."
Files: features.js council, outabout.js Tattler line.
Balance: flavor only.

### i62-b18 Loading lines when a new life starts (S, 🟡)
What: 15 lines, one per new life, shown for the half second the start takes.
Lines match the start: farm kid ("Finding your boots. They're in the truck."), transplant ("Learning which way is Dayton.").
Files: ui.js new-life flow.
Balance: none.

### i62-b19 The BUMP sign on Highway 12 (S, 🟠)
What: a commute line pool for weeks you drive 20+ miles; about one in eight weeks.
Escalation: "Someone put a tiny wreath on the BUMP sign." "The county repainted the BUMP sign. Still no bump." Finale: "There's a bump now. Everyone is very proud."
Files: turn.js commute line, gag tracker.
Balance: text only.

### i62-b20 The concrete goose on 3rd Street dresses for the season (S, 🟠)
What: 12 monthly outfits, then a second year set, shown in the first week of each month.
Examples: Cardinals jersey in fall, a tiny raincoat in March, "a Walla Walla Sweets crown, sources say" in June.
Tiny detail: the goose appears on the town map near 3rd Street.
Files: turn.js recap, maps.js. Balance: flavor only.

### i62-b21 Rare: the great tumbleweed drift (S, 🟡)
What: a rare town event (about 1 in 200 weeks, fall only, once per life).
Choices: tumbleweed snowman (☺+3, Tattler photo: "Local resident builds 'Frosty, but crunchy'"); rake it (❤️+1, "You filled the truck bed. The wind brought more.").
Files: events.js, rare-events pool.
Balance: once per life, small.

### i62-b22 Rare: the parade goes the wrong way (S, 🟡)
What: 1 in 25 Celebration Days get this version, once per life.
Choices: run to the other end (❤️+1, "You saw the last float. It was very good."); wave at the back of the fire truck (☺+2, "The firefighter waved back, backwards").
Files: events.js Celebration Days variant.
Balance: replaces the normal result, same size.

### i62-b23 Rare: onions on Highway 12 (S, 🟡)
What: a rare road event in June–July for commuters.
Choices: take a bag (☺+2, cooking practice +1, "Your truck will smell like this until August"); help pick up crates (🤝+2, late to work, small pay loss).
Files: events.js road events. Keep the scene light: nobody hurt, just onions.
Balance: once a year at most.

### i62-b24 The harvest pageant: your kid is Potato #2 (S, 🟠)
What: an October event, once per kid per year at ages 5–10.
Choices: help them practice (☺+3, better odds of nailing it); go and film it (☺+2); miss it for work (pay, ☺−2, "Your kid said you'd have loved it").
Files: events.js, S.kids ages.
Balance: missing it costs a little; going costs a little pay. No big swings.

### i62-b25 Classified ads that make you smile (S, 🔴)
What: 30 joke classifieds mixed into the Tattler pool, about one week in five.
More: "WANTED: Someone who knows what this key goes to." "FREE: Zucchini. Do not leave on my porch. I know it was you, Gary."
Different from answerable classifieds: these are just for reading.
Files: outabout.js TATTLER. Balance: none.

### i62-b26 The check-engine light you've learned to ignore (S, 🟠)
What: a flag set when truck miles cross 150k; a recap line about one week in ten.
Lines: "The check-engine light is still on. You've started saying goodnight to it." "A passenger asked about the light. You said 'it's decorative.'"
Choice once: pay $90 at the shop (light goes off, gag ends) or leave it.
Files: turn.js, state.js car miles. Balance: $90 is optional; no hidden breakdown change.

### i62-b27 The long goodbye (S, 🟠)
What: a pool of 10 lines for Town focus and evening Out and about visits, about one in six.
More: "Three 'well, anyway's later, you were on the porch. Two more and you were on the steps."
Files: turn.js focus results, outabout.js.
Balance: text only.

### i62-b28 A gag tracker so running jokes pace and land (M, 🔴)
What: GAGS table in features.js: {id, lines[], gap:[min,max], finale, when()} plus S.gags[id] = {step, next}.
Rule: at most one gag line per recap; finales are once per life.
Powers Vern's truck, the BUMP sign, the goose, the check-engine light and Doris.
Test: a 10-year headless run shows no line twice and no week with two gags.
Balance: no stat effects except finales, each capped at +2.

### i62-b29 The dog's monthly crimes report (S, 🟡)
What: the first recap of each month, if you have a dog, builds a line from three small pools (crime, ongoing feud, verdict).
Examples: "Stole a dinner roll. Feud with the mail carrier continues. Forgiven by noon."
Files: turn.js recap, existing dog flag.
Balance: text only.

### i62-b30 This week in 1952: the crosswalk debate (S, 🔴)
What: 25 archive lines, one week in six, some matching current Tattler stories on purpose.
More: "1961: Letter to the editor about loose dogs." "1974: Library story hour moves to Saturdays. Then back."
Payoff: if you're on council and vote yes on the crosswalk, the Tattler runs "After 75 years, a crosswalk. Some are still against it."
Files: outabout.js TATTLER, features.js council. Balance: flavor only.

### i62-b31 Each focus gets its own funny result lines (M, 🟠)
What: 6–8 lines per focus, picked so none repeats within ten weeks.
Get outside: "You walked to the river and back. The river did most of the work."
Files: turn.js weekTick and recap.
Balance: same effects as today; words only.

### i62-b32 The old-timer's one joke at the hardware counter (S, 🟠)
What: a counter on hardware or Main Street visits; lines change slightly each time ("He told it again. He laughed first this time.").
Payoff at 10: a one-time card, "Pass it on" (🤝+2, Journal: "You told the river joke. It's yours now too.").
Files: outabout.js visits, gag tracker.
Balance: needs ten paid visits over time; +2 once.
