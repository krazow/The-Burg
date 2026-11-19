# Ideas round 64

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 64: 0.2.2 patch plan

All 25 fixes from the 0.2.1 plan (round 60) are still open on main after the H1–H3 hotfixes, 10 of them confirmed by headless repro; this re-ranks them for 0.2.2 and adds one new bug (restored backups can run code). Put each test in tests/bugs.test.mjs.

### i64-a01 01 · Phone Back stays in the game and never answers a sheet (M, 🔴)
- **Was:** i60 04. **Still broken:** history.back() from a game with the Menu open went to about:blank: one Back press leaves the game.
- **Where:** ui.js sheet()/closeSheet(), tab switches, Help
- **Fix:** Push a history entry when a sheet, Help or a non-Home tab opens; on popstate close the top one, and on an event sheet keep it open with "Pick one to go on".
- **Test:** Start a life, open the Menu, call history.back(): the URL is still the game and the sheet is closed; with an event open, Back leaves it open and no choice ran.
- **Balance:** No score effect.

### i64-a02 02 · Double-tap on End Week plays one week (S, 🔴)
- **Was:** i60 01. **Still broken:** #end clicked twice 80 ms apart moved S.turn by 2.
- **Where:** turn.js playWeeks()
- **Fix:** Return early while a week is running or within 400 ms of the last call (busy flag plus timestamp); same guard for the skip buttons.
- **Test:** Double-click #end 80 ms apart: S.turn goes up by exactly 1.
- **Balance:** Removes accidental skipped weeks.

### i64-a03 03 · Reloading during an event shows it again (S, 🔴)
- **Was:** i60 02. **Still broken:** The Touchet event set its 52-week cooldown before any choice; reload and Continue showed no event, so the bad event was dodged.
- **Where:** turn.js playWeeks(), events.js showEvent(), boot.js
- **Fix:** Save S.pendingEv (the title) before save(), reopen it on Continue, clear it when a choice is made.
- **Test:** Force an event, reload before choosing, Continue: the same event card is open.
- **Balance:** Closes the reload dodge on bad events.

### i64-a04 04 · New: a restored backup can run code via a name or journal line (S, 🔴)
- **Was:** new. **Still broken:** restoreBackup() keeps names longer than 20 characters and raw log text; renderLog() prints e.m unescaped, so an image tag with onerror set a flag in the Journal.
- **Where:** ui.js restoreBackup() and renderLog(), state.js migrate()
- **Fix:** In migrate() slice names to 20 and strip tags from log text; render e.m through esc() and add the game's own <b> after escaping.
- **Test:** Restore a backup whose name and log contain an image tag that sets a flag; open every tab and the end screen: the flag is never set.
- **Balance:** No score effect; makes shared backup codes safe.

### i64-a05 05 · Names with HTML show as plain text everywhere (S, 🔴)
- **Was:** i60 13. **Still broken:** Same root as the item above, for names typed in the game: log lines and finish() reasons put S.name in raw.
- **Where:** features.js finish() and startLegacy(), every log() that includes S.name
- **Fix:** Escape names wherever they go into log text or ending reasons (one logName() helper).
- **Test:** Name a life "<b>x</b>", play 10 weeks: the Journal shows the tags as text.
- **Balance:** No score effect.

### i64-a06 06 · An ending sticks even if you close the app (S, 🔴)
- **Was:** i60 03. **Still broken:** Code check: res.ending still waits behind the "This week" sheet with nothing saved.
- **Where:** turn.js playWeeks(), features.js finish(), boot.js
- **Fix:** Save S.endPending with the reason before the notes sheet; call finish() on Continue when set.
- **Test:** Force a Lifetime death behind a notes sheet, reload, Continue: the end screen shows and the slot is cleared.
- **Balance:** Closes a reroll of a Lifetime death.

### i64-a07 07 · The tap that opens or closes a sheet can't land on a choice (S, 🔴)
- **Was:** i60 06. **Still broken:** Code check: sheet()/closeSheet() have no tap guard.
- **Where:** ui.js sheet() and closeSheet()
- **Fix:** Ignore sheet button clicks for 400 ms after open and page clicks for 350 ms after close.
- **Test:** Tap ⏩ 4 twice quickly with an event due: still unanswered; double-tap Close: the tab did not change.
- **Balance:** Stops unread event answers.

### i64-a08 08 · A save that fails says so (S, 🔴)
- **Was:** i60 07. **Still broken:** With setItem throwing QuotaExceededError, End Week showed only the welcome toast; store.set() swallows the error.
- **Where:** state.js store.set() and save()
- **Fix:** Return false on error; save() shows one "Your phone's storage is full: this week wasn't saved" toast until a save works.
- **Test:** Stub setItem to throw, end 3 weeks: the warning shows once.
- **Balance:** No score effect.

### i64-a09 09 · Help with tuition can't push you past the debt limit (S, 🔴)
- **Was:** i60 08. **Still broken:** Code check: the choice still takes cost(15000) with no cash check.
- **Where:** events.js college event
- **Fix:** Offer the full amount only with that much cash; otherwise "Help with books" at a third.
- **Test:** Money $2,000, force the event: no choice takes cash below the mode's debt limit.
- **Balance:** Bots no longer go broke on it.

### i64-a10 10 · Hard mode's debt warning names the real limit (S, 🔴)
- **Was:** i60 09. **Still broken:** In Hard at -$20,000 the Home card said "Below -$40,000 you'll have to leave town"; Hard ends at -$25,000.
- **Where:** new debtLimit() in state.js; ui.js renderHome(), turn.js weekTick(), help.js
- **Fix:** One debtLimit() helper used by all three; warn at -$10,000 in Hard; no ending line in Relaxed.
- **Test:** Per mode, set money past the warning: the card's number equals the one weekTick uses.
- **Balance:** Fair notice; limits unchanged.

### i64-a11 11 · Money reads $1,500 on every phone, never $NaN (S, 🟠)
- **Was:** i60 15. **Still broken:** With locale de-DE, fmt(1500) gave "$1.500" and fmt(NaN) gave "$NaN".
- **Where:** state.js fmt(), help.js tables
- **Fix:** toLocaleString('en-US') everywhere; print $0 if not finite.
- **Test:** de-DE page: the cash pill reads $1,500; fmt(NaN) is $0.
- **Balance:** No score effect.

### i64-a12 12 · Age stops running a year behind (S, 🟠)
- **Was:** i60 17. **Still broken:** Adding 12/52 a week for 104 weeks from 18 gives 239.99999 months: age() says 19, not 20.
- **Where:** state.js age()
- **Fix:** Floor Math.round(ageMonths*1e4)/1e4/12, or count age from S.turn.
- **Test:** Play 104 weeks from 18: age() is 20.
- **Balance:** Tiny: 21+ stops open on time.

### i64-a13 13 · Retirees see no Apply buttons (S, 🟠)
- **Was:** i60 18. **Still broken:** A retired life showed 14 Apply buttons on Jobs.
- **Where:** ui.js job rows and apply(), events.js friend's tip
- **Fix:** Show a "Retired" tag instead of Apply and skip the friend's tip once S.retired.
- **Test:** Retire, open Jobs: no [data-apply].
- **Balance:** No score effect.

### i64-a14 14 · A new job clears leftover unemployment (S, 🟠)
- **Was:** i60 19. **Still broken:** Code check: apply() and the tip event set jobId but not S.ui, and weekTick pays ui whenever jobless.
- **Where:** ui.js apply(), events.js tip choice
- **Fix:** Set S.ui = 0 wherever a new job is taken.
- **Test:** Laid off, hired 2 weeks later, then quit: no benefits line.
- **Balance:** Closes a stacking exploit.

### i64-a15 15 · Grandkid only after a full life, and kept if you tap Not now (M, 🟠)
- **Was:** i60 10. **Still broken:** Code check: finish() offers the heir to any Lifetime with kids, at any age or ending.
- **Where:** features.js finish() and legacySheet(), ui.js renderTitle()
- **Fix:** Offer the heir only after old age at 60+; keep a waiting heir on the title screen until started or dismissed.
- **Test:** Debt ending at 25: no grandkid button; old-age ending then reload: the title shows the waiting heir.
- **Balance:** A bad life can't pass on.

### i64-a16 16 · Badge toasts stop replaying after you reopen (S, 🟠)
- **Was:** i60 14. **Still broken:** Code check: S.newBadges is cleared after save(), so a reload behind a notes sheet replays it.
- **Where:** turn.js playWeeks()
- **Fix:** Copy the list and empty it before save(); toast the copy in after().
- **Test:** Earn a badge behind a notes sheet, reload, play a week: the toast shows once in total.
- **Balance:** No score effect.

### i64-a17 17 · The app opens offline from a link with ?source=home (S, 🟠)
- **Was:** i60 11. **Still broken:** Code check: sw.js uses caches.match(e.request) with no ignoreSearch.
- **Where:** sw.js fetch handler
- **Fix:** For navigations, caches.match(req, {ignoreSearch:true, cacheName:CACHE}).
- **Test:** offline test: go offline, open ./?source=home: the title loads.
- **Balance:** No score effect.

### i64-a18 18 · The wheat lease can't pay early, late or flip for profit (S, 🟠)
- **Was:** i60 20. **Still broken:** Code check: the first August pays no matter when you leased, and bizValue() (60% of $6,000) beats the renewal cost.
- **Where:** features.js bizWeek() and bizValue()
- **Fix:** Skip the first harvest unless leased by March; scale a wheat lease's value by weeks left.
- **Test:** Lease in July: no check that August; renew and sell at once: sale <= renewal cost.
- **Balance:** Closes money exploits.

### i64-a19 19 · The $300 will reaches the grandkid (S, 🟠)
- **Was:** i60 16. **Still broken:** Code check: the parent object in finish() has no will field.
- **Where:** features.js finish() and startLegacy()
- **Fix:** Pass will:S.out.will; without one, probate takes 10%.
- **Test:** Same net worth, with and without a will: the heir with one starts 10% higher.
- **Balance:** A paid action does what it says.

### i64-a20 20 · Two open copies don't erase each other's weeks (M, 🟠)
- **Was:** i60 12. **Still broken:** Code check: savedAt exists but nothing listens for the storage event.
- **Where:** state.js save(), boot.js storage listener
- **Fix:** On a storage event for this slot with a newer savedAt, reload that life with a toast instead of writing over it.
- **Test:** Same life in two pages, play 2 weeks in one, end a week in the other: the slot has all 3 weeks.
- **Balance:** No score effect.

### i64-a21 21 · Leaving the app saves this week's changes (S, 🟡)
- **Was:** i60 05. **Still broken:** Demoted: focus and trip planning already call save(); boot.js still has no pagehide/visibilitychange save as a backstop.
- **Where:** boot.js
- **Fix:** Call save() on visibilitychange (hidden) and pagehide.
- **Test:** Change S directly, dispatch hidden, reload: the change is kept.
- **Balance:** No score effect.

### i64-a22 22 · Health plan savings pay week by week (M, 🟡)
- **Was:** i60 21. **Still broken:** Code check: the cheaper plan still adds the full year (12 x $40) at once.
- **Where:** events.js health plan, turn.js weekTick()
- **Fix:** Keep an S.perWeek list of {label, amount, weeksLeft}; quitting or retiring ends the rest.
- **Test:** Cheaper plan, quit in week 3: savings are 3 weeks' worth.
- **Balance:** Closes a quit-and-keep exploit.

### i64-a23 23 · Single parent and Debt-free agree on out of debt (S, 🟡)
- **Was:** i60 22. **Still broken:** Code check: Single parent wins on S.money >= 0 even with a truck loan.
- **Where:** features.js SCENARIOS
- **Fix:** One debtFree() check used by both cards.
- **Test:** Single parent with a truck loan and $1,000: not won; pay it off: won.
- **Balance:** The challenge is as hard as it reads.

### i64-a24 24 · No commute childcare for a teenager (S, 🟡)
- **Was:** i60 23. **Still broken:** Code check: kidCost() adds the commute care for any kid at home.
- **Where:** state.js kidCost()
- **Fix:** Add KID_CARE_COMMUTE only for kids under 13.
- **Test:** Walla Walla commuter with a 17-year-old: base cost only.
- **Balance:** Small cash change.

### i64-a25 25 · Old winter tires don't come back with a new car (S, 🟡)
- **Was:** i60 24. **Still broken:** Code check: buyCar() never clears S.tires, which is keyed by car type.
- **Where:** ui.js buyCar()
- **Fix:** Set S.tires = null on purchase.
- **Test:** Tires on a sedan, buy a truck, then a sedan: ditchMult() is 1.
- **Balance:** Removes a free safety perk.

### i64-a26 26 · The heir's car and the car value floor use today's dollars (S, 🟡)
- **Was:** i60 25. **Still broken:** Code check: the heir keeps newGame's carValue 2500 and the floor is a flat 500.
- **Where:** features.js startLegacy(), turn.js weekTick()
- **Fix:** Use cost(2500) and cost(500).
- **Test:** Heir with S.col = 8: carValue $20,000.
- **Balance:** Small late-game net-worth fix.

## Ideas 64: The Touchet River

The Touchet as a living part of Waitsburg: its seasons, swimming holes, levee, wildlife and quiet places.

### i64-b01 One river level that every river event reads (M, 🔴)
A weekly river level (runoff, high, normal, low, iced) set in state.js from the month and the year's snowpack. Fishing, swimming, flood and ice events all check it instead of the month alone.
Add S.river in state.js, set in weekTick (turn.js) from month plus a yearly roll.
events.js and outabout.js gate river events on it.
Balance: it only changes which river events can fire, not their size, so no score shift by itself.

### i64-b02 The Blues snowpack sets the river's year (S, 🔴)
In January the Tattler reports a big, normal or thin snowpack in the Blue Mountains. A big year means a higher, longer runoff; a thin year means an early, harsh summer low.
One yearly roll stored on S, shown in the Tattler (outabout.js TATTLER) and help.js.
Feeds the river level above.
Balance: a warning, not a reward; careful players prepare and careless ones get hit by the same odds.

### i64-b03 A River card on the Home tab (L, 🔴)
A small card showing what the Touchet is doing this week and what you can do there: walk, fish, swim, watch birds or help. Each line is a tap that spends spare time.
New riverCard() in ui.js next to townLifeCard; actions run through visit() in outabout.js with OUT_REPEAT decay.
Balance: each action has a repeat cooldown and a time cost, so spamming the river never beats a balanced week; idle play never taps it.

### i64-b04 Think it over on the river bench (M, 🔴)
Before a big choice (new job, move, proposal, quitting) you can go sit on the riverwalk bench first. You see both sides in plain words and lose a little stress, but the choice waits a week.
Adds a 'Go to the river first' button to big-choice sheets in events.js and ui.js.
Stress -small, one-week delay.
Balance: limited to once per choice and costs a week of time on offers that can expire.

### i64-b05 The kids build a raft out of pallets (M, 🔴)
A summer story chain for kids 8–13: they build a raft from pallets, test it, and plan a float to the bridge. You set the rules: life jackets, a buddy, home by dark.
Three steps in STORY_EVENTS (features.js) using chainSet.
Rules you set change the odds of a scare in step three.
Balance: no rules means more fun at first but a real chance of a bad outcome; careful parents get a family bond bump.

### i64-b06 Three swimming holes, each with its own catch (M, 🟠)
Summer Out and About spots for three stand-in holes: the bridge pool (busy, safe), the rope-swing bend (fun, a bit risky) and the gravel bar (quiet, far walk). Closed during runoff.
Three PLACES entries in outabout.js with months and river-level gates.
Balance: mood gains decay on repeat visits; the risky one can cost health, so it is not the free best pick.

### i64-b07 June water is still snowmelt (S, 🟠)
Early summer looks warm, but the Touchet is still running cold. Jump in now for a shock and a story, or wait for July.
One event in events.js gated on June and runoff level.
Jumping: small health risk, mood gain; waiting: nothing lost.
Balance: pure flavor choice with a small risk on the reckless side.

### i64-b08 The rope swing gets cut down (S, 🟠)
After a near-miss, the landowner cuts down the rope swing. Ask permission and rebuild it safer, sign the kids up for the pool, or let it go.
Event in events.js; rebuild costs a weekend and a little money and brings the swing back in outabout.js.
Balance: community effort pays back slowly in mood, not money.

### i64-b09 A life jacket loaner board at the bridge (S, 🟠)
The town puts up a board of loaner life jackets at the bridge. Chip in, build it on a weekend, or skip it. Later in the summer, a jacket from the board saves a kid you know.
Town project in events.js with a later echo.
Balance: helping costs time or money now; the payoff is a mood and town-standing moment, not cash.

### i64-b10 Skipping-stone record on the gravel bar (S, 🟡)
On a quiet river visit you can skip stones. Your best count is saved as a little personal record, and your kid may beat it someday.
One stat on S, shown in the journal (ui.js).
Balance: no score effect at all.

### i64-b11 August low water: a voluntary pull-back (M, 🟠)
When the river drops low in August, irrigators are asked to cut back for the fish. If you farm or keep a big garden, you choose: cut back, keep watering, or switch crops.
Event in events.js gated on low river level and farm or garden flags.
Cutting back costs some harvest money; keeping on risks a curtailment order later.
Balance: careful and careless lose about the same short-term, careful wins over years.

### i64-b12 Ditch rider: a summer job opening headgates (M, 🟠)
A seasonal side job: drive the irrigation ditches at dawn, open and close headgates, and settle squabbles between farmers. Early mornings, steady pay, April to September.
New entry in JOBS (state.js) with a season window and an energy cost.
Balance: pay is modest and tiring, so it helps a plan, it does not replace a career.

### i64-b13 Use it or lose it: the five-year water right letter (S, 🟡)
If you own land with a water right and leave it unused for five years, a state letter warns you could lose it. Use it, lease it to a neighbor, or let it lapse.
Timer on owned land in state.js, letter event in events.js.
Leasing pays a small yearly sum.
Balance: idle owners lose value, active ones keep it.

### i64-b14 Shelf ice on the Touchet: look, don't walk (M, 🟠)
In a January cold snap the river grows shelf ice and frozen spray on the willows. Take photos, skate the frozen slough pond, or walk out on the river ice.
Event in events.js gated on the iced river level.
Walking out can mean a cold soak and a health hit.
Balance: the reckless pick is the only risky one and gives no extra reward.

### i64-b15 The night the ice goes out (S, 🟡)
A February thaw night: the ice breaks up with loud booms and neighbors gather on the bridge with flashlights and coffee.
One free event in events.js after an iced stretch.
Small mood gain if you go.
Balance: free, rare, no money.

### i64-b16 High-water marks on the bridge piling (M, 🟠)
Painted marks on the bridge piling show old flood years. When a flood happens in your game, a new mark is painted with the year, and it stays for the next generation.
Small list on S carried by startLegacy (features.js), shown on the town map in maps.js.
Balance: memory only, no score effect.

### i64-b17 Walk the levee with the inspector in October (M, 🟠)
Each fall you can join the levee district's inspection walk. You spot burrows and seeps, and repairs before spring lower the chance of flood damage.
Event in events.js that sets a flag lowering flood damage odds next spring (features.js flood story).
Balance: costs a weekend; the payoff only matters in a bad water year.

### i64-b18 Levee district dues on the tax bill (S, 🟡)
Riverside homes pay a small levee assessment. Every few years there is a vote to raise it for repairs. Yes costs more each year and makes the levee stronger.
Line on the property tax in state.js, vote event in events.js.
Balance: small yearly cost against lower flood risk; roughly even over a life.

### i64-b19 An evening lap on the riverwalk (S, 🟠)
A free evening walk on the levee trail as a Rest add-on. It lifts mood a little more in good weather and is closed in high water.
Rest option in ui.js checking the river level.
Gain decays with repeats.
Balance: tops out below a balanced week, so idle Rest players get no new edge.

### i64-b20 A bench with their name on it (S, 🟡)
When someone close dies, you can buy a plaque for a riverwalk bench. Later visits to that bench bring a quiet memory line in the journal.
Event in events.js with a one-time cost; adds a bench to the map in maps.js.
Balance: costs money, gives a small mood lift only.

### i64-b21 Ask the big question on the footbridge (S, 🟡)
When you propose, you can pick the spot. The footbridge over the Touchet at sunset is one choice, with its own scene and journal line.
Location pick in the proposal event (events.js).
Balance: flavor only.

### i64-b22 Adopt a mile of the Touchet (M, 🟠)
Your family adopts a stretch of river. A few cleanup weekends a year keep your name on the sign, and the sign can pass to your heir.
Flag on S passed by startLegacy (features.js); cleanup weeks fit the Community focus and seasonGoal (state.js).
Balance: costs weekend time; payoff is town standing and mood, not money.

### i64-b23 What the cleanup pulls out of the river (S, 🟡)
Cleanup days turn up odd finds: a shopping cart, an old soda bottle from the 1950s, a rusty bike, a license plate. Some go on a shelf at home.
Find table in events.js with a small collection on S.
Balance: no money; a collection for completionists.

### i64-b24 The heron at the bend (S, 🟠)
A great blue heron always stands at the same bend. On quiet river weeks you may see it, and the journal keeps count across the years.
Counter on S, a line in river visits (outabout.js).
Balance: no score effect.

### i64-b25 The ospreys come back to the light pole (S, 🟡)
Each April the osprey pair returns to the nest on the ball field light pole. The Tattler runs a poll to name the chicks, and you can vote.
Spring event in events.js plus a Tattler line in outabout.js.
Balance: free flavor.

### i64-b26 Ducklings cross Main Street (S, 🟡)
A merganser mom leads her ducklings from the river across Main. Stop traffic and help, or honk and drive on. Helping makes you a little late.
One event in events.js.
Helping: tiny work hit, mood gain.
Balance: even trade.

### i64-b27 A river life list in the journal (M, 🟠)
A page listing river wildlife you've seen: heron, osprey, kingfisher, merganser, beaver, mink, river otter. Rare ones show up only in certain seasons and river levels.
New list on S and a sheet in ui.js; sightings roll on river visits.
Balance: collection only, no score.

### i64-b28 Read the regs or pay the fine (M, 🟠)
Fishing seasons and catch rules change by stretch of river. Keep a fish out of season and a game warden may write you a ticket.
Check in the fishing actions (outabout.js) against a small rules table in state.js.
Balance: careless fishing costs money; careful fishing loses nothing.

### i64-b29 Bonfire on the gravel bar (S, 🟡)
For young adults: a summer night bonfire with friends on the gravel bar. A deputy drives by. Douse it and leave, talk your way through, or run.
Event in events.js for ages 18–25.
Running can mean a fine and a blotter line.
Balance: the honest choice costs nothing; the reckless one costs.

### i64-b30 The low-water crossing goes under (S, 🟡)
In runoff, the farm road ford goes under water. Your commute is longer for a few weeks unless you leave early.
Event in events.js gated on runoff for rural homes, small time and gas cost (state.js cost()).
Balance: a small, fair seasonal cost.

### i64-b31 Your teen jumped off the bridge (M, 🟠)
Your teen jumped off the bridge with friends and someone posted the video. Ground them, go see the spot together and talk about depth, or laugh it off.
Event in events.js for kids 13–17, with an echo weeks later.
The talk lowers later risk events.
Balance: laughing it off saves time now and raises later risk.

### i64-b32 The dog comes home smelling like the river (S, 🟡)
Your dog slipped out and came home soaked and proud. Give it a bath, or let it sleep on the porch.
Tiny pet event in events.js.
Balance: flavor only.

### i64-b33 Follow the old mill race (S, 🟡)
A history stop: walk the path of the old flour mill's water race from the river toward town, with a plain-language sign about how the river powered Waitsburg.
Out and About spot in outabout.js with a history note in help.js.
Balance: one-time small mood gain, then it decays.
