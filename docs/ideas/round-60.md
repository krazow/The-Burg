# Ideas round 60

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 60: 0.2.1 patch plan

0.2.0 is live; this is the fix list for 0.2.1, deduped from every 🔴 bug and bug-fix bundle so far: 3 hotfixes to ship within a day, then 25 fixes in order, each with one test (put the tests in tests/bugs.test.mjs, per i56-b03).

### i60-a01 H1 · A damaged save or thin backup never blanks the game (S, 🔴)
- **Fixes:** i56-b01, i54-a11, i22-a21, i54-a12
- **Where:** state.js slots()/migrate(), ui.js readBackup() and slotLine()
- **Fix:** slots() drops any slot that is not an object with a name; migrate() fills home, car, job, len and date with safe defaults when the id is unknown; the backup date is shown only if it parses.
- **Test:** explore.test.mjs loads 12 kinds of broken storage (a number slot, half a life, unknown home/car/job ids, bad export date) and requires the title screen, Continue and every tab with no page errors.
- **Balance:** No score effect; it only stops a crash on Continue.

### i60-a02 H2 · One tap can no longer delete a life (S, 🔴)
- **Fixes:** i12-b01, i12-b04 (from i25-a01)
- **Where:** ui.js showMenu() #retireNow and askReplace()
- **Fix:** 'End this life now' opens a confirm sheet with the score so far and 'Keep playing' as the safe button; Replace in askReplace asks 'Replace Ann's life? This can't be undone' like saveCopySheet does.
- **Test:** flows test: tap End this life now, press Escape, and the slot still holds the life; tap Replace on a full board, tap Back, and all 5 slots are unchanged.
- **Balance:** No score effect. Escape always lands on the safe choice.

### i60-a03 H3 · Beta lives live under their own keys (S, 🔴)
- **Fixes:** i57-a01
- **Where:** state.js SAVE_KEY/SLOTS_KEY/BEST_KEY and the release kit stamp
- **Fix:** Build every storage key from one KEY_PREFIX that the release kit stamps as 'theburgbeta.' in /beta/, the same way sw.js gets 'theburgbeta-'; the live game keeps 'theburg.' so no live save moves.
- **Test:** offline test serves the beta build and the live build on one origin, saves a life in each, and checks neither slot list sees the other's life.
- **Balance:** No score effect; it keeps a 0.3.0 beta save change away from 0.2.x players.

### i60-a04 01 · Double-tap on End Week plays one week (S, 🔴)
- **Fixes:** i54-a01, i59-a05 (i55-a01)
- **Where:** turn.js playWeeks()
- **Fix:** Return early when a week is still running or the last call was under 400 ms ago (a busy flag plus a timestamp).
- **Test:** gameplay test double-clicks #end 80 ms apart and expects S.turn to go up by exactly 1.
- **Balance:** Removes accidental skipped weeks; no change to scores of careful play.

### i60-a05 02 · Reloading during an event shows it again (S, 🔴)
- **Fixes:** i22-a01, i56-b04 (i25-a01)
- **Where:** turn.js playWeeks() and showEvent(), boot.js
- **Fix:** Store the open event's title as S.pendingEv before save(), show it again on Continue, and clear it when a choice is made.
- **Test:** Force a Layoffs event, end the week, reload before choosing, tap Continue: the same event card is open and its cooldown is not yet spent.
- **Balance:** Closes a dodge: reloading can no longer skip bad events.

### i60-a06 03 · An ending sticks even if you close the app (S, 🔴)
- **Fixes:** i22-a02 (i25-a01)
- **Where:** turn.js playWeeks() notes path, features.js finish()
- **Fix:** When res.ending waits behind the 'This week' sheet, save S.endPending with the reason and call finish() on load if it is set.
- **Test:** Force a Lifetime death behind a notes sheet, reload, Continue: the end screen shows and the slot is cleared.
- **Balance:** Closes a reroll of a Lifetime death.

### i60-a07 04 · Phone Back closes the sheet, never the game or an answer (M, 🔴)
- **Fixes:** i58-b01, i59-a01, i59-a03
- **Where:** ui.js sheet()/closeSheet() and the keydown Escape handler
- **Fix:** Push a history entry when a sheet, Help or a non-Home tab opens and close it on popstate; on an event sheet, Back and Escape keep it open and say 'Pick one to go on' instead of clicking #no/#ok.
- **Test:** Pixel 7 page: start a life, open an event, call history.back(): the page is still the game, the event is still open and no choice ran.
- **Balance:** No score effect; stops a stray Back from picking an event answer.

### i60-a08 05 · Leaving the app saves this week's changes (S, 🔴)
- **Fixes:** i59-a22
- **Where:** boot.js (new visibilitychange and pagehide listener)
- **Fix:** Call save() when the page goes hidden, so a changed focus, an application or a planned trip survives Android closing the app.
- **Test:** Change focus, plan a trip, dispatch visibilitychange (hidden), reload: the focus and S.trip are still set.
- **Balance:** No score effect.

### i60-a09 06 · The tap that opens or closes a sheet can't land on a choice (S, 🔴)
- **Fixes:** i54-a02, i48-b01 (i55-a01)
- **Where:** ui.js sheet() and closeSheet()
- **Fix:** Ignore clicks on sheet buttons for 400 ms after a sheet opens, and on the page behind for 350 ms after it closes.
- **Test:** Tap ⏩ 4 twice quickly with an event due: the event is still unanswered; double-tap Close on a sheet: the tab bar did not change.
- **Balance:** Stops unread event answers during skips.

### i60-a10 07 · A save that fails says so (S, 🔴)
- **Fixes:** i54-a15 (i55-a01)
- **Where:** state.js store.set()
- **Fix:** Return false on a caught error and have save() show one warning toast ('Your phone's storage is full: this week wasn't saved') until a save works again.
- **Test:** Stub localStorage.setItem to throw QuotaExceededError, end a week, and expect the warning once, not every week.
- **Balance:** No score effect.

### i60-a11 08 · 'Help with tuition' can't end your life in debt (S, 🔴)
- **Fixes:** i22-a16 (i25-a02)
- **Where:** events.js college event (Help with tuition choice)
- **Fix:** Offer the full $15,000 only with that much cash on hand; otherwise offer 'Help with books' at a third of it.
- **Test:** Set money to $2,000, force the event, and check no choice takes cash below the mode's debt limit.
- **Balance:** Bots picked it every time and went broke; it now costs only what you have.

### i60-a12 09 · The debt warning names your mode's real limit (S, 🔴)
- **Fixes:** i12-b03 (i25-a03)
- **Where:** ui.js renderHome() debt card, turn.js weekTick() debtEnd, help.js Money
- **Fix:** Move the limit into one debtLimit() helper (Hard -$25,000, Normal -$40,000, Relaxed none) and use it in weekTick, the Home card and Help; on Hard warn at -$10,000.
- **Test:** For each mode, set money just past the warning line and check the card's number matches the ending weekTick uses (and Relaxed shows no ending line).
- **Balance:** Hard players get fair notice; no change to the limits.

### i60-a13 10 · Grandkid only after a full life, and waits if you tap Not now (M, 🔴)
- **Fixes:** i8-a01, i8-a02 (i25-a01)
- **Where:** features.js finish() and legacySheet(), ui.js renderTitle()
- **Fix:** Offer the heir only after passing away at 60+, and keep a waiting heir in the slot so the title screen shows 'Ann Lee's grandkid is ready' until started or dismissed.
- **Test:** End a Lifetime by debt at 25: no grandkid button. End one by old age, reload on the end screen: the title screen shows the waiting grandkid.
- **Balance:** Stops a bad life from passing on; no score change.

### i60-a14 11 · The app opens offline from a link with ?source=home (S, 🟠)
- **Fixes:** i54-a13, i54-a23 (i55-a03)
- **Where:** sw.js fetch handler
- **Fix:** Look up navigations with caches.match(req, {ignoreSearch:true, cacheName:CACHE}) so a query string still gets the cached shell, from this version's cache only.
- **Test:** offline.test.mjs goes offline and opens ./?source=home: the title screen loads.
- **Balance:** No score effect.

### i60-a15 12 · Two open copies don't erase each other's weeks (M, 🟠)
- **Fixes:** i54-a14 (i55-a03)
- **Where:** state.js save() and a storage-event listener in boot.js
- **Fix:** Keep S.savedAt per slot; on a 'storage' event for this slot with a newer savedAt, reload that life with a toast instead of writing over it.
- **Test:** Open the same life in two pages, play 2 weeks in one, then end a week in the other: it reloads first and the slot has all 3 weeks.
- **Balance:** No score effect.

### i60-a16 13 · A name with HTML in it shows as plain text (S, 🟠)
- **Fixes:** i56-b02
- **Where:** ui.js renderLog(), features.js finish() and startLegacy() log lines
- **Fix:** Escape names when they go into log text and finish() reasons, and render e.m through esc() (keeping only the game's own <b> tags).
- **Test:** Start a life named with an image tag that sets a flag, play 10 weeks, open every tab and the end screen: the flag is never set.
- **Balance:** No score effect; a restored backup can no longer run code.

### i60-a17 14 · Badge toasts stop replaying after you reopen (S, 🟠)
- **Fixes:** i23-a02 (i25-a01)
- **Where:** turn.js playWeeks()
- **Fix:** Take the toast text from S.newBadges and empty the list before save(), then show it in after().
- **Test:** Earn First paycheck, reload, play ⏩ 4: the badge toast shows once in total.
- **Balance:** No score effect.

### i60-a18 15 · Money reads $1,500 on every phone, never $NaN (S, 🟠)
- **Fixes:** i54-a03, i54-a18 (i55-a01)
- **Where:** state.js fmt(), help.js price tables
- **Fix:** Use toLocaleString('en-US') everywhere, and print $0 (and log once) if the number isn't finite.
- **Test:** With the page locale set to de-DE, the cash pill reads $1,500; fmt(NaN) returns $0.
- **Balance:** No score effect.

### i60-a19 16 · The $300 will reaches the grandkid (S, 🟠)
- **Fixes:** i26-b03 (i30-a01)
- **Where:** features.js finish() parent object and startLegacy()
- **Fix:** Pass will:S.out.will in the parent; with a will the heir gets the full share, without one probate takes 10%.
- **Test:** Two Lifetime endings with the same net worth, one with a will: the heir with the will starts with 10% more.
- **Balance:** Makes a paid action do what it says; the share stays capped.

### i60-a20 17 · Age stops running a year behind (S, 🟠)
- **Fixes:** i5-a01 (i25-a04)
- **Where:** turn.js weekTick() ageMonths, state.js age()
- **Fix:** Round ageMonths to 4 places before flooring in age(), or count from S.turn, so birthdays land on the right week.
- **Test:** Play 104 weeks from 18: age() is 20, and the year-in-review line says the right age.
- **Balance:** Tiny: 21+ stops open on time.

### i60-a21 18 · Retirees can't be hired into a job that never pays (S, 🟠)
- **Fixes:** i8-a03 (i25-a02)
- **Where:** ui.js apply() and renderJobs()
- **Fix:** Hide Apply (show 'Retired') once S.retired is true, and drop the friend's job tip for retirees.
- **Test:** Retire, open Jobs: no Apply button; force the friend's tip event: it does not fire.
- **Balance:** No score effect.

### i60-a22 19 · A new job clears leftover unemployment (S, 🟠)
- **Fixes:** i22-a03 (i25-a02)
- **Where:** ui.js apply(), events.js friend's tip choice
- **Fix:** Set S.ui = 0 wherever S.jobId is set to a new job.
- **Test:** Get laid off, get hired 2 weeks later, quit: no unemployment line in the next week.
- **Balance:** Closes a stacking exploit: benefits no longer wait to be cashed later.

### i60-a23 20 · The wheat lease can't pay early, late or flip for profit (S, 🟠)
- **Fixes:** i22-a04, i22-a05, i22-a06 (i25-a03)
- **Where:** features.js bizWeek() and bizValue()
- **Fix:** Skip the harvest in a lease's first year unless it began by March, pay only while weeks < lease, and scale a wheat lease's value by the weeks left.
- **Test:** Lease in August: no check that year. Renew at the end and sell at once: the sale is not more than the renewal cost.
- **Balance:** Closes three money exploits.

### i60-a24 21 · Multi-week event money pays out week by week (M, 🟡)
- **Fixes:** i58-b02
- **Where:** events.js health-plan and light-duty events, turn.js weekTick() lines
- **Fix:** Store a short S.perWeek list of {label, amount, weeksLeft} and add one line a week; quitting or retiring ends the rest.
- **Test:** Pick the cheaper health plan, quit in week 3: total savings are 3 weeks' worth, not $480.
- **Balance:** Closes a quit-and-keep exploit.

### i60-a25 22 · Single parent and Debt-free agree on 'out of debt' (S, 🟡)
- **Fixes:** i35-b01 (i39-a01)
- **Where:** features.js SCENARIOS.single.win and debtfree.win
- **Fix:** Add one debtFree() check (cash >= 0, no truck or student loan, mortgage not counted) and use it in both, and say so on both cards.
- **Test:** Finish Single parent with a financed truck and $1,000 cash: not won; pay off the truck: won.
- **Balance:** Makes the challenge as hard as it reads.

### i60-a26 23 · No commute childcare for a teenager (S, 🟡)
- **Fixes:** i46-a01 (i47-a01)
- **Where:** state.js kidCost() and turn.js weekTick() kid line
- **Fix:** Charge KID_CARE_COMMUTE only for kids under 13; older kids at home pay the base cost.
- **Test:** A Walla Walla commuter with a 17-year-old: the kid line is the base cost; with a 5-year-old it adds the care.
- **Balance:** Small cash change for parents with long commutes.

### i60-a27 24 · Old winter tires don't come back with a new car (S, 🟡)
- **Fixes:** i22-a08 (i25-a03)
- **Where:** ui.js buyCar()
- **Fix:** Set S.tires = null when a car is bought.
- **Test:** Buy tires on a sedan, buy a truck, buy a sedan again: winter tires show as not fitted and ditchMult() is 1.
- **Balance:** Removes a free safety perk.

### i60-a28 25 · The heir's pickup and a car's floor value use today's dollars (S, 🟡)
- **Fixes:** i30-b01, i30-b02 (i39-a01)
- **Where:** features.js startLegacy(), turn.js weekTick() carValue floor
- **Fix:** Set the heir's carValue to cost(2500) and the floor to cost(500).
- **Test:** Start an heir in a game with S.col = 8: carValue is $20,000; keep a sedan 50 years: it never drops below cost(500).
- **Balance:** Small net-worth fix late in Lifetime.

## Ideas 60: What players will say

What the first 50 players of 0.2.0 will most likely say, each turned into a change, plus an offline-first way to collect notes through the existing Formspree form.

### i60-b01 'How do I tell you?' A 💬 Tell us sheet that sends through Formspree (M, 🔴)
- What: a small feedback sheet with four chips and a 500-character box.
- Plays: two taps and a sentence; no account, no email needed.
- Touches: new feedbackSheet() in js/features.js, showMenu() and the end screen in js/ui.js; posts JSON to https://formspree.io/f/xyewwazg with type:'feedback'.
- Balance: no game effect.

### i60-b02 One outbox for notes and characters, sent when you're back online (M, 🔴)
- What: a localStorage queue (burg-outbox), max 10 items, oldest dropped first.
- Plays: write a note on the farm with no signal; it goes when you're back in town.
- Touches: shared send/retry code with the planned NPC queue (#40), boot.js for the retry, ui.js Menu line.
- Balance: none.

### i60-b03 Every note says where you were, in a line you read first (S, 🔴)
- What: auto context so 'it broke' becomes fixable.
- Plays: read-only line, nothing hidden; untick to send only your words.
- Touches: feedbackSheet() in features.js, reads S and VERSION.
- Balance: none. No journal or save data is sent.

### i60-b04 A plain privacy line on the feedback sheet (S, 🔴)
- What: three sentences, same wording style as the Be in the game consent.
- Touches: feedbackSheet() in features.js; the privacy page from #39.
- Balance: none.

### i60-b05 Stay under Formspree's 50 a month (S, 🟠)
- What: client-side limits so 50 players don't use up the free plan.
- Plays: extra notes wait in the outbox for tomorrow; the player isn't told 'no'.
- Touches: the outbox code; _subject and _gotcha fields.
- Balance: none.

### i60-b06 Your notes list, and What's new says when one is fixed (S, 🔴)
- What: closes the loop so players see they were heard.
- Touches: WHATS_NEW entries in ui.js get an optional ids array; whatsNew() checks local note codes.
- Process: tools/feedback-report.py prints codes per issue so the owner can copy them in.
- Balance: none.

### i60-b07 A short reply to your note, shipped in the next update (S, 🟡)
- What: a reply with no server; only the device holding the code sees it.
- Touches: a REPLIES map beside WHATS_NEW in ui.js.
- Note: codes are random, so the list leaks nothing about who wrote what.
- Balance: none.

### i60-b08 One question at the end of a life (S, 🟠)
- What: the best moment to ask is right after a finished life.
- Touches: end screen in js/ui.js, a short QUESTIONS list in features.js, outbox.
- Balance: answering gives nothing, so no reason to rush lives to answer.

### i60-b09 'I didn't get it': Still stuck? at the bottom of each Help page (S, 🟠)
- What: shows which Help pages fail people.
- Touches: js/help.js page footer, feedbackSheet() prefill.
- Report: the tool counts Still stuck per page.
- Balance: none.

### i60-b10 A first-life check-in at week 12: 'How's it going?' (S, 🟠)
- What: catches people who quit quietly before an ending.
- Touches: turn.js after End Week, a once flag in store, outbox.
- Balance: fires once; does not stop skips (rides along like milestone notes).

### i60-b11 One switch turns off every feedback ask (S, 🟠)
- What: respect for players who just want to play.
- Touches: a store flag read by the three asks.
- Balance: none.

### i60-b12 'Where's my job?' Request a job from the Jobs tab (S, 🟡)
- What: tallies which real jobs people want.
- Touches: renderJobs() in js/ui.js, outbox.
- Process: the report tool ranks requests by count.
- Balance: none until a job ships; new jobs still go through the sim.

### i60-b13 'It closes at 2 on Sunday': Something wrong here? on business cards (S, 🟠)
- What: locals are the best fact-checkers for hours and seasons.
- Touches: business card in js/outabout.js, outbox with type 'place-fix'.
- Balance: corrections change data only after owner review.

### i60-b14 'That's not what happened here': report the last event (S, 🟠)
- What: a precise way to flag one event, asked for by the player, not a prompt after every event.
- Touches: S.lastEvent from js/events.js, feedbackSheet().
- Balance: none.

### i60-b15 A 'Known problems' list shown before you write (S, 🟠)
- What: a KNOWN array in js/help.js, edited at release time.
- Touches: help.js, feedbackSheet(); /release now checks the list has a date.
- Balance: none.

### i60-b16 A feedback report script turns the Formspree export into a page (M, 🟠)
- What: 50 notes become one page you can act on in 10 minutes.
- Touches: tools/, reusing the NPC tool's identifying-text checks.
- Bonus: flags notes from old versions as 'maybe already fixed'.
- Balance: none.

### i60-b17 Tests send notes to a fake Formspree (S, 🟠)
- What: the feedback path can't break silently.
- Touches: tests/flows.test.mjs and tests/offline.test.mjs via page.route; shared with NPC QA (#44).
- Balance: none.

### i60-b18 Tester diary for the first 50 players (M, 🟠)
- What: steady notes from locals and friends without a beta group setup.
- Touches: leaving the app (visibilitychange) and Back to title in ui.js, outbox.
- Balance: no game effect; the diary never pauses play.

### i60-b19 Credit me as: first names for notes that changed the game (S, 🟡)
- What: a reason for locals to write good notes.
- Touches: feedbackSheet(), a THANKS list in js/help.js; the import tool checks names like the NPC rules.
- Balance: none.

### i60-b20 'I didn't know you could tap the map': a one-time tap-a-place hint (S, 🟠)
- What: family players read maps as pictures.
- Touches: js/maps.js, a once flag.
- Balance: none.

### i60-b21 'Is that a real store?' Business cards say it's a stand-in (S, 🟡)
- What: stops the same question from every local.
- Touches: js/outabout.js card, a Help paragraph in js/help.js.
- Balance: none.

### i60-b22 'What's equity?' Tap a money word for a one-line meaning (M, 🟠)
- What: a GLOSSARY object in js/help.js and a wrapper that marks terms in rendered text.
- Who: teens, grandparents and app-store strangers.
- Checks: screens test keeps tap targets at 44 px.
- Balance: none.

### i60-b23 'Gas is cheaper than that': where the numbers come from (S, 🟠)
- What: turns arguments about gas and rent into useful notes.
- Touches: js/help.js, feedbackSheet() chip.
- Balance: price changes still go through the sim.

### i60-b24 'Same event again?' Short games don't repeat small events (S, 🟠)
- What: short games feel varied for players who play once or twice.
- Touches: event picking in js/events.js (cooldown by length).
- Balance: run the sim; quiet weeks favor no bot, and careless/idle medians must stay within targets.

### i60-b25 'I tapped End Week by accident': a short pause after a sheet closes (S, 🔴)
- What: the most likely complaint from fast tappers.
- Touches: closeSheet() and the End Week handler in js/ui.js.
- Differs from the double-tap fix: this is the tap that lands through a closing sheet.
- Balance: none.

### i60-b26 'I found my house!' A 'my place' pin on the Waitsburg map (S, 🟡)
- What: locals love seeing their own corner.
- Touches: js/maps.js, one stored point.
- Balance: decoration only, no stats.

### i60-b27 'Can my brother try it?' A guest life that leaves yours alone (M, 🟡)
- What: phones get handed around at family dinners.
- Touches: new guest flag in js/state.js, save() and records skip it.
- Balance: guest lives never set best scores.

### i60-b28 'Where even is Waitsburg?' A first-launch card for strangers (S, 🟠)
- What: app-store strangers have no idea where they are.
- Touches: renderTitle() in js/ui.js, a once flag; reuses the region map drawing in js/maps.js.
- Balance: none.

### i60-b29 'Does it work without signal?' Help shows Ready offline (S, 🟡)
- What: rural players want to know before driving out of range.
- Touches: js/help.js, a check of navigator.serviceWorker.controller and the cache.
- Balance: none.
