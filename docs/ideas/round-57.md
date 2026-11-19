# Ideas round 57

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 57: Data safety and privacy

A defensive review of where saved, imported and shared text reaches the page, how storage and the offline cache can break, and what a store reviewer would ask, with one concrete hardening step each.

### i57-a01 Beta lives live under their own keys, apart from the real game (S, 🔴)
Found: both builds use `theburg.slots.v1`, `theburg.best.v2` on krazow.github.io; only the cache name differs (sw.js `CACHE_PREFIX`).
Fix: `SLOTS_KEY`, `BEST_KEY`, `BADGE_KEY`, `CHALLENGE_KEY` in js/state.js get a `KEY_PREFIX` the release kit stamps to `theburgbeta.` in beta.
A one-time "Copy my live lives into the beta" button on the beta title screen keeps testers playing.
Balance: none.

### i57-a02 A backup life is checked field by field before it is kept (M, 🔴)
Verified harmlessly: a backup life with `mode: "nope"` restores fine, then Continue throws "Cannot read properties of undefined (reading 'ic')".
Fix: a `validLife(g)` in js/ui.js next to `readBackup()`; one table of field rules (type, min, max, max length) shared with `migrate()`.
Covers mode, len, bg, scenario, weekly, scoreQ, log, kids, out, biz; home/car/job ids are already i22-a21.
Balance: none.

### i57-a03 Restored lives keep only fields the game knows (S, 🟠)
Fix: in `readBackup()` (js/ui.js) copy only keys present in a fresh `newGame()` state plus the `migrate()` defaults; drop the rest.
Pairs with the field check above; keeps backups small (helps i43-b23).
Balance: none.

### i57-a04 A huge backup file is turned away before it is read (S, 🟠)
Verified: a 30 MB pasted string takes about 1.3 s of blocked page before "doesn't look like a backup"; a real backup is under 150 KB.
Fix: `#rsfile` onchange checks `f.size`, and `readBackup()` checks `text.length` first (js/ui.js).
Balance: none.

### i57-a05 A compressed backup code can only unpack to a set size (S, 🟠)
Fix: in `readBackup()` read the DecompressionStream with a reader loop and a byte counter instead of `new Response(raw).text()` (js/ui.js).
Message: "That code is too big to be a Burg backup."
Balance: none.

### i57-a06 Every Journal line shows as plain text, whatever its source (S, 🔴)
Verified: a log entry `Journal <b>bold</b>` (as a restored backup could carry) renders bold; `e.d` is raw too.
Fix: `${esc(e.d)}` and `${esc(e.m)}` in `renderLog()` (js/ui.js); no log line today needs markup.
Balance: none.

### i57-a07 The "Last report card" line can't carry markup (S, 🟠)
Verified: `S.scoreQ = "<u>q</u>"` underlines in `showScoreNow()` (js/features.js).
Fix: show `Number.isFinite(S.scoreQ) ? S.scoreQ : ""`; `migrate()` resets anything else to null.
Balance: none.

### i57-a08 esc() also covers the single quote (S, 🟡)
Fix: one character class change in `esc` (js/ui.js line ~392): add `'` → `&#39;`.
A rules test checks `esc(`<"'&>`)` returns all five entities.
Balance: none.

### i57-a09 Map pins lose their inline onclick handlers (M, 🟠)
Where: js/maps.js (`MAPTAP` pins), js/outabout.js (`BIZTAP` pins and buttons), keyboard `onkeydown` strings.
Fix: `data-pin` / `data-biz` attributes and one `click` + `keydown` listener on the map container.
Balance: none.

### i57-a10 A content security policy for the page (S, 🔴)
Fix: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; connect-src 'self' https://formspree.io; img-src 'self' data: blob:; object-src 'none'; base-uri 'none'">` in index.html (inline `<style>` keeps `style-src 'self' 'unsafe-inline'`).
Why it matters: every krazow.github.io app shares one origin and its storage, so a slip in one app reaches the others.
Needs the inline-handler idea first; tests/smoke checks no CSP errors in the console.
Balance: none.

### i57-a11 A test that a fresh game only talks to itself (S, 🟠)
Verified: a load plus reload only requests the game's own host.
Fix: tests/smoke.test.mjs records `page.on("request")` hosts through title, a week and the menu; fails on any other host (Formspree allowed only on the send step later).
Balance: none.

### i57-a12 No referrer leaves the game (S, 🟡)
Fix: `<meta name="referrer" content="no-referrer">` in index.html; `rel="noopener noreferrer"` on outbound links in js/help.js.
Balance: none.

### i57-a13 A hotel Wi-Fi login page is never saved as the game (S, 🔴)
Fix: in sw.js `fetch`, cache only if `res.ok && res.type === "basic" && !res.redirected` and the content type matches the file (`text/javascript` for .js, `text/html` for pages, images for icons).
Balance: none.

### i57-a14 Offline files are checked against the release's fingerprints (M, 🟡)
Where: sw.js `install` and `fetch`; release kit stamping step (like VERSION today).
A mismatch skips the cache write and keeps the last good copy.
Balance: none.

### i57-a15 A broken save is kept aside, not overwritten (S, 🔴)
Verified: `theburg.slots.v1 = "{bad"` gives 0 lives and the raw text stays only until the next save.
Fix: `store.get` returns a "corrupt" marker (js/state.js); `slots()` copies the raw string to `theburg.broken.<time>` once; title shows "Some saved data couldn't be read: download it".
Differs from i56-b01 (no lockout): this keeps the data.
Balance: none.

### i57-a16 Each life saves under its own key (M, 🟠)
Fix: `writeSlot()` and `slots()` in js/state.js use `theburg.slot.0`…`4`; a one-time move from `theburg.slots.v1`.
Backups keep the same format (a `slots` array).
Balance: none.

### i57-a17 The last good save is kept one step back (S, 🟠)
Fix: `writeSlot()` (js/state.js) writes, reads back and compares length; on mismatch it restores the previous copy and shows the save-failed note (i54-a15).
Balance: rolling back a week is never a gain; the score uses the same rules.

### i57-a18 Restore says "restored" only when the lives really landed (S, 🔴)
Fix: `restoreBackup()` (js/ui.js) checks `slots()` after writing; `finishRestore()` shows "Your device is out of space: nothing was changed" on a miss.
Balance: none.

### i57-a19 Undo for "Replace all my lives" (S, 🟠)
Fix: `restoreBackup(b, "replace")` stores the old `slots()` in `sessionStorage` before writing; `backupSheet()` shows "Undo the last replace" while it exists (js/ui.js).
Balance: none.

### i57-a20 Best scores from a backup must be real scores (S, 🟡)
Fix: `restoreBackup()` (js/ui.js) requires `v >= 0 && v <= 100`; the same check trims bad values already on the device at boot.
Balance: keeps the best-score board honest.

### i57-a21 A test that a backup can't touch shared object shapes (S, 🟡)
Verified: today nothing leaks (the `bestLabel` and id checks filter it); this guards against a later "just copy everything" change.
Where: tests/rules.test.mjs calling `readBackup()` and `restoreBackup()`.
Balance: none.

### i57-a22 Ask the browser to keep the lives (persistent storage) (S, 🟠)
Fix: once, in `save()` (js/state.js), guarded by a flag; the backup sheet says "This device keeps your lives" or suggests a backup when it isn't granted.
Balance: none.

### i57-a23 Help: "What this game keeps on your device" (S, 🔴)
Where: js/help.js new section; erase removes `theburg.*` keys and `theburg-` caches only, after a typed confirm.
Gives the store "data deletion" and privacy answers a place to point (fits i17-b03).
Balance: none.

### i57-a24 Names lose invisible and direction-flipping characters (S, 🟡)
Not measured: the name box (maxlength 20) accepts any character today, so a right-to-left mark can reverse the slot line text after it.
Fix: one `cleanName()` used in the `#start` handler and `#y` (js/ui.js), the heir sheet (js/features.js), and `validLife()` on restore.
Balance: none.

### i57-a25 The backup code box is filled as text (S, 🟡)
Fix: `#bkcode` handler in `backupSheet()` (js/ui.js) builds the textarea empty, then `ta.value = code`.
Balance: none.

### i57-a26 Event text escapes the values put into it (M, 🟠)
Where: `ev.text` and option results in js/events.js and js/features.js; `showEvent()` puts `ev.text` in raw today.
`html`...`` escapes `${}` values unless wrapped in `raw()`. Do the NPC lines first.
Balance: none.

### i57-a27 A test that flags raw text in page templates (M, 🟡)
Where: tests/rules.test.mjs, an allow-list for ids looked up in game tables (CITIES, JOBS).
Catches the next Journal-style slip before release.
Balance: none.

### i57-a28 NPC text from players is shown only as plain text (S, 🔴)
Where: the NPC engine (#42) People screen and event lines; `tools/import-npcs.py` (#41) schema rule.
A sample NPC in the test set has `<b>x</b>` in its tip and must show it as typed.
Balance: none.

### i57-a29 The NPC draft stays on the device and goes away when sent (S, 🟠)
Where: the questionnaire (#40); key `theburg.npcdraft`; `backupData()` in js/ui.js must not include it.
A queued send older than 30 days is dropped with a note.
Balance: none.

### i57-a30 NPC sends carry only the answers (S, 🟠)
Where: the send step (#40); id from `crypto.randomUUID()`; the privacy note says Formspree sees the sender's internet address.
A flows test with mocked Formspree checks the exact JSON keys.
Balance: none.

### i57-a31 "Report this character" on every NPC card (S, 🟠)
Where: the People screen (#42); a report form or mailto with only the NPC id.
Answers a likely store review question about user-generated content.
Balance: none.

### i57-a32 The 18+ gate for NPC submissions is remembered (S, 🟡)
Where: page 1 of the questionnaire (#40); a `theburg.npcAge` flag, cleared by Erase everything.
Balance: none.

## Ideas 57: Growing up in Waitsburg

Short, optional scenes from childhood and the teen years in Waitsburg that set a few small traits, people and memories before the 18-year-old start.

### i57-b01 Five quick scenes before 18: the Growing up prologue (L, 🔴)

- What: a 'Grow up first?' toggle in More options; five scenes in a row, about a minute in all.
- Plays: one card per scene with a year, a place and 2–3 choices; each choice says plainly what it leaves you with.
- Touches: new js/prologue.js (add to index.html and sw.js ASSETS), newGame() in js/ui.js, S.past default in the js/state.js migration.
- Balance: every choice trades a gain for a cost; the whole prologue is capped (see 02), so it shapes a life without raising the ceiling.

### i57-b02 A tight budget for the past, checked by the sim (S, 🔴)

- What: a PAST_CAP table in js/prologue.js that clamps the sum of all scene effects.
- Plays: no visible change; childhoods feel different but none is a cheat code.
- Touches: js/prologue.js, tests/sim.test.mjs (random picks for careless, no prologue for idle, best picks for good play).
- Balance: the test fails if careless median moves more than 1 point or idle goes over 50.

### i57-b03 Age 5: first day at the K–12, who you sit with (M, 🔴)

- What: the opening scene of the prologue; the friend gets a stand-in name from a name list.
- Plays: the quiet kid gives +1 happy over the years; the loud kid +1 community; the cousin a family dinner event later.
- Touches: js/prologue.js, a 'friend' line in town events in js/events.js that swaps in the name.
- Balance: flavor first; the stat nudge is 1 point and fits the budget in 02.

### i57-b04 Age 9: swim team, snack bar or the high dive (M, 🟠)

- What: a summer scene with three paths.
- Plays: swim team gives +2 starting health; snack bar gives 3 Cook skill points; the high dive gives +2 happy and a 'not scared of much' line in a later hard event.
- Touches: js/prologue.js, practice() in js/features.js for skill points.
- Balance: each path is worth about the same; none stacks with another scene's same reward past the cap.

### i57-b05 Age 11: a summer on Grandpa's wheat place (M, 🔴)

- What: one teaching choice maps to one skill: Handy, Mechanic, Cook or People.
- Plays: you start with 5 points in that skill, so level 1 comes a little sooner; the grandparent sends a card on your birthday the first few years.
- Touches: js/prologue.js, S.skills via practice() in js/features.js, birthday note in js/turn.js.
- Balance: 5 points is below level 1 (8); you still have to practice. Farm kid already lives this, so it gives them a different skill (see 18).

### i57-b06 Age 12: your best friend's family moves to Spokane (M, 🔴)

- What: a goodbye scene that sets a story chain flag.
- Plays: write, and a letter or text arrives once a year with small news; the keepsake comes back to you in your 30s; the quick goodbye gives +1 happy now and no echo later.
- Touches: js/prologue.js, a new chain in the STORY CHAINS block of js/features.js.
- Balance: the echoes are flavor plus one small happiness bump, spread over decades; no money.

### i57-b07 Age 15: your first job, picked from four (M, 🟠)

- What: a teen-job scene with four choices.
- Plays: each gives a skill seed (Handy, Cook, Handy, People) and a 'reference' that lifts your odds a little on one job family on the Jobs list in your first year.
- Touches: js/prologue.js, apply odds in js/turn.js, Jobs tags in js/ui.js.
- Balance: the odds boost ends at age 19, and it only helps you get hired, not paid more.

### i57-b08 The first paycheck: save it or spend it (S, 🟠)

- What: a one-card follow-up to 07.
- Plays: save adds $200 to your start money; spend gives +2 happy; groceries gives +2 community and a line from your mom later.
- Touches: js/prologue.js, start values in newGame() in js/ui.js.
- Balance: three equal-value choices inside the budget.

### i57-b09 Fourth-grade field trip to the state park by the river (S, 🟡)

- What: a tiny scene with two choices.
- Plays: wandering finds an arrowhead-shaped rock (a keepsake on the Journal) and makes the park an Out and about stop you already know; staying earns the teacher's note home (+1 community).
- Touches: js/prologue.js, js/outabout.js place unlock.
- Balance: unlocking a place early saves a week of discovery, nothing more.

### i57-b10 Age 8: Celebration Days from a float or the curb (S, 🟠)

- What: a parade scene.
- Plays: the float gives +2 community; lemonade gives $40 to start and a Hustle hint; the lawn chair gives +1 happy and an extra line when you go to Days as an adult.
- Touches: js/prologue.js, Celebration Days events in js/events.js.
- Balance: small and inside the budget.

### i57-b11 Age 16: the night on the grain elevator (M, 🟠)

- What: a teen-trouble scene with a real cost.
- Plays: go up and get caught: −2 community at start, but 'you owned it' lifts community back by 25 when a later event asks you to own a mistake; talk them out of it: +2 People skill; go home: no change.
- Touches: js/prologue.js, a flag read by one adult event in js/events.js.
- Balance: the risky path costs first and pays back only if you act on it later.

### i57-b12 The dog you grew up with (S, 🟡)

- What: a name field and one choice: you walked her every day, or your little brother did.
- Plays: walking her gives +1 health at start; the adult dog's first week gets +2 happy once.
- Touches: js/prologue.js, dog adoption in js/events.js.
- Balance: one-time bump; no effect without a dog.

### i57-b13 Freshman fall: football, FFA or band (M, 🟠)

- What: one high-school activity, named on the summary card.
- Plays: football gives +2 health and the Friday-night crowd knows you (+1 community); FFA gives Handy points and a farm-job tag; band gives +2 happy and a tune you can play on rest weeks.
- Touches: js/prologue.js, js/features.js skills, rest-week text in js/turn.js.
- Balance: same-size rewards in different stats; capped with the rest.

### i57-b14 Skipped scenes come back as Rest-week flashbacks (M, 🔴)

- What: unplayed scenes go into a queue in S.past.
- Plays: a gentle card on a Rest week: 'You find your old swim team ribbon…' with the same choices; at most one a year.
- Touches: js/prologue.js, rest focus in js/turn.js.
- Balance: half effects and only on Rest weeks, so idle play (which rests anyway) gains at most a few points over a whole life; the sim in 02 checks idle stays at or under 50.

### i57-b15 Start at 18, or 'Surprise me' with a balanced childhood (S, 🟠)

- What: three buttons in More options on the title screen.
- Plays: Surprise me shows the result on the summary card (16) so you still see who you are.
- Touches: js/ui.js title screen, js/prologue.js random pick with the game's dice (works with weekly seeds).
- Balance: the roll is drawn only from pairs that cancel, so it never beats a neutral start.

### i57-b16 'Who you were at 18': a summary card on day one (S, 🔴)

- What: a dismissable card on Home for the first two weeks, and a copy on the Journal.
- Plays: makes the prologue's choices visible so they don't feel like they vanished.
- Touches: js/ui.js Home render, js/prologue.js summary text.
- Balance: display only.

### i57-b17 Childhood lines in the Journal, dated from 2014 (S, 🟠)

- What: log() entries with a past date field.
- Plays: the Journal reads like a whole life, not one that starts at 18.
- Touches: log() and the journal card in js/ui.js; S.log entries get an optional year.
- Balance: none; flavor.

### i57-b18 Each starting background gets its own scenes (M, 🟠)

- What: a few scene variants keyed to BACKGROUNDS in js/state.js.
- Plays: the transplant's aunt scene gives +4 community, since nobody knows them yet; the young parent's scene sets who helps with the baby.
- Touches: js/prologue.js, BACKGROUNDS in js/state.js.
- Balance: the same budget per background; the transplant bump does not lift them past a fresh start's community.

### i57-b19 Age 13: you laughed along when they teased Sam (M, 🟠)

- What: a hard little choice that sets a person in S.past.
- Plays: laughing along means Sam turns up in your 20s, and you can apologize (+3 happy) or not; speaking up gives +1 community now; sitting with Sam makes Sam a second friend.
- Touches: js/prologue.js, one later event and chain in js/events.js / js/features.js.
- Balance: the apology repays most of what laughing cost; no path is a big win.

### i57-b20 Your first crush is still in town (S, 🟡)

- What: a prologue choice (ask, don't ask) and one adult event.
- Plays: the event is another way to meet a partner, not an extra one; partner odds stay the same.
- Touches: js/prologue.js, the partner event in js/events.js.
- Balance: it swaps in for the usual meeting event, so it adds no extra partner chance.

### i57-b21 Summer reading at the library: a head start on classes (S, 🟠)

- What: a two-choice scene.
- Plays: S.studyProg starts at 1 week if you read.
- Touches: js/prologue.js, newGame() start values.
- Balance: one week of classes is worth about the same as 2 health; inside the budget.

### i57-b22 Age 16: the year your dad got laid off (M, 🟠)

- What: a family scene with a lasting money attitude.
- Plays: helping costs −2 happy at start but softens the happiness hit of your own first layoff by half; being kept out of it gives +2 happy now and nothing later.
- Touches: js/prologue.js, the layoff event in js/events.js / js/turn.js.
- Balance: the payback only shows if a layoff happens, and it never helps the score of careless play directly.

### i57-b23 Learning to drive in Grandpa's 1998 pickup (S, 🟠)

- What: ties the existing start truck to a person.
- Plays: oil gives 4 Mechanic points; the tire skips one future flat-tire shop bill; the trailer gives +1 happy and a better line when you sell the truck later.
- Touches: js/prologue.js, car events in js/events.js (ROAD_EVENTS), the car text in js/ui.js.
- Balance: the saved tire bill is under $150 once.

### i57-b24 Your class of 2027: a roster other features can use (S, 🟡)

- What: S.past.class, a short name list made once.
- Plays: events say 'Kayla from your class' instead of 'a classmate'.
- Touches: js/prologue.js, name swaps in js/events.js.
- Balance: text only. Keep it small for save size.

### i57-b25 Full circle: one late-life echo per scene (M, 🟠)

- What: a small late-life event per scene, read from S.past.
- Plays: each is +2 happy and a Journal line; at most one a year.
- Touches: js/events.js, the age gates in pickEvent().
- Balance: spread late in life, small, and skipped in short lives; the sim checks the score impact stays under 1 point.

### i57-b26 The owner who gave you your first job (S, 🟡)

- What: one Out and about place greets you by your past.
- Plays: −10% on that one stop; the owner can be a job reference once.
- Touches: js/outabout.js, js/prologue.js.
- Balance: a small cost cut on one place.

### i57-b27 Replay a childhood from the title screen (L, 🟡)

- What: a prologue-only mode with no weeks, saved as a preset in prefs.
- Plays: try out childhoods without starting a life; pick one when you start.
- Touches: js/ui.js title screen, js/prologue.js, prefs storage in js/state.js.
- Balance: presets are the same capped choices, so nothing stacks.

### i57-b28 Who raised you: a flavor choice with no score effect (S, 🟡)

- What: a text-only choice at the start of the prologue.
- Plays: events swap the family member they mention.
- Touches: js/prologue.js, family text in js/events.js.
- Balance: no stat effect at all, on purpose, so no family is 'better'.

### i57-b29 The broken arm from the monkey bars (S, 🟡)

- What: a tiny scene, mostly flavor.
- Plays: +1 community at start; a cold-weather 'your old arm aches' line some winters with no stat effect.
- Touches: js/prologue.js, winter text in js/turn.js.
- Balance: 1 point, inside the budget.

### i57-b30 Eighth-grade trip over the mountains (S, 🟡)

- What: a two-choice scene.
- Plays: loving it makes your first road trip give +3 happy; wanting home gives +2 community, and the 'big town pull' events show up less.
- Touches: js/prologue.js, trips in js/events.js.
- Balance: one-time, small.

### i57-b31 Your heir's childhood is the one you gave them (M, 🟠)

- What: S.past for gen 2 built from your kids' events and chosen focus weeks, then shown on the summary card.
- Plays: the heir can still play one scene of their own.
- Touches: js/prologue.js, the legacy hand-off in js/features.js.
- Balance: same budget; good parenting gives the heir a better-feeling start, not a higher-scoring one.
