# Ideas round 69

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 69: 0.2.1 release readiness

What to check, fix and write before 0.2.1 ships the hotfixes plus the 61 picks (#153, #159–#161 merged; #162–#164 open and conflicting).

### The What's new list for 0.2.1 (for `WHATS_NEW['0.2.1']` in js/ui.js)

Lines 10–12 go in only if #162, #163 and #164 land.

1. 🛡️ **Safer saves:** a damaged save no longer blanks the game, and ending or replacing a life asks first.
2. ⚙️ **Settings:** sounds, vibration, bigger text and a night theme that follows your phone. Find them in the Menu.
3. 👆 **Easier on a phone:** swipe to change tabs, pull a pop-up down to close it, and choices sit near your thumb.
4. 🧓 **Retirement:** pensions for public jobs, Social Security that follows your work, a winter in Arizona and long-term care.
5. 📜 **Your legacy:** a will that's read when your grandkid takes over, and a scholarship in your name.
6. 📅 **Money outlook:** see the next 13 weeks of pay and bills, and the week your cash would run short.
7. 🏡 **Homes and insurance:** pick your coverage, pay property tax, and watch home prices and mortgage rates move. You can refinance or take a home equity loan.
8. 🌾 **Farm and investing:** sell or store your wheat, buy crop insurance, raise cattle, or buy wine futures and index funds.
9. 🆘 **Deep debt:** collections after 12 weeks below zero, and a one-time bankruptcy instead of the game ending.
10. 🪜 **Jobs with a ladder:** promotions, programs, certificates, apprenticeships, interviews, unions and 13 new jobs.
11. ⏭️ **Smoother weeks:** Auto stops when you choose, a weekly focus plan, undo on the Life tab, and the town changes with the seasons.
12. 🧭 **Finding your way:** a preview of what your focus will do, words you can tap for an explanation, a "why" on every money line, and your life story at the end.

### Player release note (top of the GitHub release)

> **The Burg 0.2.1.** Your saves are safer: a damaged save won't blank the game, and nothing deletes a life without asking.
> New ⚙️ Settings let you choose sounds, vibration, text size and a night theme.
> Plan for later life with pensions, Social Security, a will and long-term care. Run the money side with insurance, property tax, a moving housing market, wheat prices, cattle and investing.
> Jobs now have ladders and certificates, weeks flow faster, and the game explains what changed and why.
> Your lives carry over. Back them up first if you like: Menu → 📤 Back up or restore.

### i69-a01 Add the 0.2.1 What's new list (12 entries) to js/ui.js (S, 🔴)
Add `'0.2.1'` to `WHATS_NEW` with the 12 lines above (icon, title, one short line).
Drop lines 10–12 for any of #162–#164 that doesn't make the cut.
Touches js/ui.js only. No balance effect.

### i69-a02 Turn the 0.2.1 changelog into a full release entry (S, 🔴)
CHANGELOG.md already has a dated `## 0.2.1 (2026-11-19)` with only the three hotfixes, and there's no Unreleased section.
The release kit builds the notes from Unreleased, so #159–#164 would be missing from the release.
Rename it to Unreleased and add Added/Changed entries for retirement, money, settings, jobs, flow and clarity.

### i69-a03 Short player-facing release note for 0.2.1 (S, 🔴)
Use the note above at the top of the GitHub release and as the changelog intro.
It leads with safer saves and ends by pointing to backups.

### i69-a04 Show 0.2.0's list too for players who skipped it (S, 🟠)
`whatsNew()` shows only the newest list a player hasn't seen. 0.2.0 went live hours before 0.2.1, so most players jump from 0.1.0 straight to 0.2.1.
Add an "Also new in 0.2.0" fold-out under the 0.2.1 list when the player's last seen version is older than 0.2.0.
Touches js/ui.js.

### i69-a05 Don't burn the What's new card when a sheet is already open (S, 🟡)
`whatsNew()` saves `seenVersion` before it checks whether a pop-up is open, so the card can be lost for good.
Save the version only after the card actually shows.

### i69-a06 First property tax bill warns before it lands on an old save (S, 🔴)
A 0.2.0 homeowner who opens the game in April or October pays $800 (fixer) to $1,500 (farmhouse) in their first week, with no warning.
Fix: in `migrate()`, set `ptaxDone` to the current month when it's a tax month. Also add a one-time week note: "Property tax now comes in April and October."
Touches js/state.js and js/features.js (`moneyWeek`). Balance: it only delays one bill.

### i69-a07 Truckers from old saves keep their CDL (S, 🔴)
#162 makes the trucker job need a CDL. Old saves start with `certs:{}`.
In `migrate()`, give `certs.cdl = 1` to a life with `jobId === 'trucker'`, so its own job isn't shown as locked and a re-hire after a layoff works.
Touches js/state.js in #162. No balance effect.

### i69-a08 One-time note when union dues start on an existing job (S, 🟠)
#162 adds 1.5% dues to rail, Hanford, nurse, para, corrections and other union jobs, part way through a life.
On the first paycheck after the update, add a week note and a Journal line that explain the dues and the January raise.
Touches js/turn.js. No balance effect.

### i69-a09 Life story falls back to the Journal for years before 0.2.1 (S, 🟠)
#164 builds the ending story from `S.years`, which starts empty on migrated lives.
For years before the first `S.years` entry, use the Journal milestones (`logKind` 'mile') so a long life doesn't start its story at the update.
Touches js/features.js (life story) in #164.

### i69-a10 Spot-check Social Security on migrated retirees (S, 🟠)
Older retirees have no job, so their estimated work record uses $3,000 pay. That lands near 104% of the old flat check.
Working lives in low-pay jobs get a lower estimate than before. Check that the Life tab row reads well and that no one sees a big drop.
Touches nothing unless a number looks off (js/state.js `migrate`).

### i69-a11 Warn when a backup is from a newer version (S, 🟠)
`backupData()` already writes `version`. A 0.2.1 backup restored on an old APK or a stale PWA quietly loses the new fields.
`restoreSheet()` should compare versions and say "This backup is from 0.2.1. Update the app first."
Touches js/ui.js.

### i69-a12 First-week-back money re-roll check (S, 🟡)
Migrated saves get `monKey` and `mkt.y` set to 2027. A save in 2031 re-rolls home growth, the mortgage rate and the market in its first week.
That's fine, but confirm a refinance offer or a "Market drop" doesn't fire right away. A drop shouldn't anyway, because old saves own no stocks.
Touches js/features.js `moneyMonth` only if it misbehaves.

### i69-a13 Long-time workers get credit toward the first promotion step (S, 🟡)
#162 starts `tenure` from `jobMonths`, which goes back to 0 at each raise. A farm hand with 10 years in the job can look new.
Use a hire-date estimate instead (turns since the "Hired as" Journal line, or `jobMonths` if that's missing).
Touches js/state.js in #162. Balance: the top step still needs extra school or People 2.

### i69-a14 Say that night theme now follows the phone (S, 🟡)
Settings default to "Match phone", so dark-mode phones open 0.2.1 in the night theme.
Line 2 of What's new mentions it. Add "switch it in ⚙️ Settings" to the Help guide's Settings section.

### i69-a15 Rebase #162, #163 and #164 and settle the overlaps (M, 🔴)
GitHub shows all three as conflicting with main. Things to settle:
#164's ✨ Animations toggle moves into the new ⚙️ Settings sheet. #164's checklist replaces the old tips, which #161's install card checks through `currentTip()`.
#163's long-press on End Week and #161's thumb-reach layout both change the End Week bar. #164's Escape change has to keep the #153 rule that Escape keeps the life.
Merge in this order: #163, then #164, then #162 last (it's the biggest).

### i69-a16 One combined balance run on the final main (S, 🔴)
Each PR measured the sim from a different base: money 54/35/87, jobs 56/35/86, flow and clarity 57/39/90.
After the last merge, run the full `npm test` once and record careless, idle, planner and the rotation bot in the release PR.
Targets: careless ≤ 60, idle ≤ 50, good play ≥ 70.

### i69-a17 Back up a live 0.2.0 save and restore it into the 0.2.1 beta (M, 🔴)
Beta saves are now kept apart, so the beta starts with no lives and no What's new card.
Export a backup from the live game and restore it into /beta/. Load each kind of life: a homeowner, a retiree, a trucker, a business owner (wheat lease), a life in debt and a Lifetime heir.
Check best scores and badges survive, and that "Replace all" asks first.

### i69-a18 Phone pass: update over 0.2.0 and play 10 weeks (M, 🔴)
Do this on an Android phone (APK installed over 0.2.0, and the PWA) and on an iPhone PWA.
Update in place and open the app twice, so the service worker swaps caches. Then check the version in the Menu.
Go offline and play 10 weeks: End Week, ⏭ Auto, a trip, an event with a choice. There should never be a blank screen.

### i69-a19 Phone pass: settings and feel (S, 🟠)
On the smallest phone, try Larger text: nothing should overflow, and long buttons should wrap. Try the night theme on every tab and the maps.
Sounds play only after a tap. Vibration works on Android and isn't missed on iPhone. Swipes change tabs and a pop-up pulls down to close.
In Safari (not installed), check that the browser's edge-swipe Back doesn't fight the tab swipe.

### i69-a20 Phone pass: End Week controls (S, 🟠)
A double tap plays one week. On a narrow phone, a long press on End Week opens the skip options.
Auto stops for the condition you picked and says why. "Watch the weeks go by" stops when you tap Stop.

### i69-a21 Balance spot checks by hand (M, 🟠)
Play a homeowner through April and October (property tax), and a wheat harvest both sold and stored. Try crop insurance in a drought.
Then take one bankruptcy, own cattle and never check them, and hold or sell through a market drop. Go 12 weeks below zero on Hard (collections).
The sim bots don't buy homes or invest, so these paths have only been checked by tests.

### i69-a22 Check the What's new card on an upgraded save (S, 🟠)
On a device with 0.2.0 saves, the card shows once with the 0.2.1 list.
It never shows on a fresh install or in the tutorial. With 12 lines, it should scroll and fit at 320 px with Larger text.

### i69-a23 Pull the backup escaping fix (i64-a04/a05) into 0.2.1 (S, 🔴)
The release note sends players to back up and restore. A crafted backup can still put markup into a name or Journal line: `S.name` goes unescaped into ending text, while slot cards use `esc()`.
Ship i64-a04 and i64-a05 with 0.2.1 rather than 0.2.2. Touches js/turn.js, js/ui.js and js/features.js.

### i69-a24 Hold #162 (jobs and school) to 0.2.2 if it isn't green by cut (S, 🟠)
It's the largest change (+799 lines). It adds job gating and 13 new jobs, and it moves balance the most.
If its rebase or the combined sim slips, ship 0.2.1 without it, drop What's new line 10, and keep i69-a07/a08/a13 for 0.2.2.
The rest (settings, retirement, money, flow, clarity) can ship without it.

### i69-a25 Hold "Previously in the Burg" if the recap fights What's new (S, 🟡)
After time away, #164's recap and the What's new card both open on Continue.
On the first launch after the update, show only What's new and save the recap for the next visit, so players don't face two sheets in a row.

### i69-a26 Cut a 0.2.1 beta first, then promote (S, 🟡)
Run `/release beta` with everything merged, do a17–a22 on the beta, then `/release promote`.
Three large PRs merging on the same day shouldn't go straight to live players.

### i69-a27 Old Bluewood lift workers aren't laid off on the first summer week (S, 🟠)
#162 makes the existing lift job seasonal (December–March).
A 0.2.0 lift worker who opens the game in summer would lose the job in the first week.
In `migrate()`, a lift worker out of season gets a `recall` for December and a week note instead. Touches js/state.js in #162.

## Ideas 69: Ten neighbors, ten stories

Ten townsfolk (all stand-in names) with stories that run for years alongside yours, plus the shared system that schedules, saves and scores them.

### i69-b01 Edna Harlow farms the home place alone (M, 🔴)
Who: a widow in her late 60s running 900 acres of wheat on the Coppei road after her husband dies.
Beats: (1) first harvest alone, in July: haul for her, find her a crew from the elevator, or stay out of it. (2) A big outfit offers to buy or lease. Help her read the offer or let her decide alone. (3) Her grandson Wyatt comes out from Spokane for a summer. Teach him or ignore him. (4) Her last harvest.
Endings: leased to a young family (high warmth and you helped with the offer), sold to the big outfit (neutral), or Wyatt takes over (high warmth plus you taught him).
Touches: neighbor beats in features.js, pinned to the fields; ties into harvest months. Balance: hauling costs a week's focus and health, and pays mostly community.

### i69-b02 Cal and Becca sign a lease on Main Street (M, 🔴)
Who: a couple in their late 20s opening a gift-and-coffee shop in an empty storefront.
Beats: (1) paint day before opening: help, send money, or skip it. (2) January is dead: buy a gift card for $100, put a word out, or tell them it was a long shot. (3) The Celebration Days rush: work a Saturday at the till. (4) A baby on the way, and the shop needs a third person.
Endings: they open a second room, hold on as a small steady shop, or put up a For Lease sign. A buy-in pays back only if the shop does well.
Touches: features.js beats pinned to Main Street; Business focus counts toward help. Balance: a buy-in is a real risk with a capped return, like the food truck story.

### i69-b03 Danny Ruiz comes home from the Army (M, 🟠)
Who: a hometown kid back at 27 after eight years in, living in his mom's spare room.
Beats: (1) homecoming at the Legion: show up or don't. (2) Months of looking for work: pass along a lead or vouch for him. (3) A bad night when he calls you at 11 p.m.: drive over, talk on the phone, or let it ring. (4) His first VA checkup in Walla Walla: give him a ride. (5) He takes a job.
Endings: he coaches Little League and stays (warmth 4+), moves to Spokane for good work (neutral), or drifts and you hear he left (warmth 1 or less).
Touches: features.js beats; reuses the veteran and VA wording; the 11 p.m. beat costs health. Balance: kept low-key; the bad night is handled plainly, never as a gotcha.

### i69-b04 Kayla Moss counts the days until she leaves (M, 🔴)
Who: a 16-year-old junior who wants Seattle and says so every chance she gets.
Beats: (1) her first job at the diner: recommend her or not. (2) The college aid forms her mom can't help with: sit with her for an evening. (3) Prom: lend a car or chip in. (4) Graduation and the drive west. (5) Thanksgiving home, a bit changed.
Endings, years later: she comes back to teach at the school (high warmth, Lifetime only), visits every summer, or stops calling. Leaving is never treated as failing.
Touches: features.js beats pinned to the school; a Lifetime handoff (i69-b23). Balance: helping costs evenings (a week's focus); payoff is happiness, not money.

### i69-b05 Mrs. Albee, forty years of fourth grade, starts to forget (M, 🟠)
Who: a retired teacher in her 80s who taught half the town, now living alone on Main.
Beats: (1) she starts a Saturday reading hour at the library and asks you to read once. (2) She loses her keys, then her way home from the post office: walk her back and call her son. (3) Her son in Boise wants her moved: back him, back her, or stay out of it. (4) The care wing: visit or don't.
Endings: her town history for the kids gets finished with your help and goes in the library, gets finished by someone else, or stays a box of notes. Also she stays in town in the care wing, or moves to Boise.
Touches: features.js beats pinned to the library; ties to hospital-visit events. Balance: visits cost a little health and time; no money reward.

### i69-b06 The Medinas open a bakery on Main (M, 🟠)
Who: a family from Pasco (parents, a teen daughter, a grandmother who does the conchas) opening a panaderia.
Beats: (1) the county health permit runaround: drive them to the office or help with the forms. (2) A slow first spring: tell people, order for a work event. (3) Pan de muerto sells out the first week of November. (4) Their daughter's quinceanera at the Legion hall: help set up. (5) A citizenship ceremony for the father.
Endings: a Main Street fixture with a line on Saturdays, a small steady bakery, or they move back to Pasco where the rent was easier.
Touches: features.js beats pinned to Main Street; can lean on the Spanish-language neighbor work from earlier rounds. Balance: help costs time; payoff is community and happiness.

### i69-b07 Hollis won't buy a scan tool (M, 🟠)
Who: a 70-year-old who owns a two-bay garage and still sets points by ear.
Beats: (1) he turns away a newer car with a check-engine light: talk him into a scan tool or take his side. (2) A heart scare at the shop: drive him to Walla Walla. (3) He needs an apprentice: send him someone, or sign up yourself on Saturdays. (4) What to do with the place.
Endings: sold to a young mechanic (you found one), closed with an auction of his tools (you can buy a toolbox that cuts repair costs a little), or kept open one more year at a time.
Touches: features.js beats; the garage becomes the default fix in Truck trouble (i69-b19). Balance: the toolbox discount is small and costs real money at the auction.

### i69-b08 Gus, the fire chief nobody will replace (M, 🟡)
Who: a 64-year-old who has run the volunteer fire crew for 22 years and wants to hand it off.
Beats: (1) recruiting night, three people show up: go, or bring someone. (2) A big grass fire in August: help on the line if you joined, or bring water. (3) A training weekend in Dayton. (4) The handoff.
Endings: someone new takes the helmet, you do (if you've been on the crew a year and community is high), or nobody does and the crew merges with Dayton's, which shows as slower response in a later fire event.
Touches: features.js beats; checks the existing volunteer fire state if present. Balance: the chief role costs focus weeks; no direct score.

### i69-b09 Morgan moves from Seattle with big plans (M, 🟡)
Who: a remote worker in their 30s who buys the old house on Preston and wants to fix the whole town.
Beats: (1) a flyer war over a dog park: sign the petition, sign the other one, or neither. (2) A council meeting where they say the wrong thing: explain how things work here, or let them learn. (3) A hard winter: lend them chains or firewood. (4) A project that works, like a tool library or a Saturday cleanup.
Endings: they belong (high warmth, you helped them learn), they stay but keep to themselves, or they sell and go back.
Touches: features.js beats pinned to Main Street. Balance: gentle on both sides; nobody is the villain.

### i69-b10 Tess works nights and studies to be a nurse (M, 🟠)
Who: a single mom in her 30s working nights as a hospital aide in Walla Walla, with a 7-year-old son.
Beats: (1) she asks you to watch her son some mornings: yes, sometimes, or no. (2) She signs up for prerequisites at the community college. (3) She fails anatomy and wants to quit: study with her or encourage her. (4) The nursing school letter.
Endings: she passes boards and works days at the hospital, puts it off and stays an aide (no shame in the text), or moves in with her sister in Kennewick.
Touches: features.js beats; mornings cost health (sleep). Balance: childcare help costs focus; the payoff is warmth and a later favor, not cash.

### i69-b11 One neighbors table runs every arc (L, 🔴)
A `NEIGHBORS` list in features.js. Each entry has id, stand-in name, map pin, a `when` gate, beats (title, text, choices) and endings.
It runs on the existing `chain`, `chainSet` and `chainEnd` helpers, with the arc id as the chain id, and pushes into `EVENTS` like `STORY_EVENTS`.
Adding a neighbor is adding data. Endings bump `storiesDone`.

### i69-b12 Arcs stretch or squeeze to fit the game length (M, 🔴)
Each beat has a place in the arc (0 to 1), not a fixed week; the scheduler maps it onto the weeks left.
6 months: 2 neighbors, 2 beats each. 2 years: 4 neighbors. 5 years: all ten. Lifetime: staggered by your age (Kayla's arc when you're young, Mrs. Albee's later).
Touches: features.js scheduler, game length from state.js.

### i69-b13 Only one neighbor beat at a time (S, 🔴)
At least five weeks between neighbor beats. They never share a week with a crisis, road or due event.
A due beat takes the town event slot, so the total events per year barely changes. Touches: rollEvent in events.js.

### i69-b14 Warmth: how close you are to each neighbor (M, 🟠)
A 0-5 number per neighbor in `S.nb`. Help raises it, letting them down lowers it, and it drifts toward 2 if you go a year without seeing them.
Warmth sets ending odds and unlocks later favors (Hollis fixes the truck at cost, Becca's job tip). It never adds score by itself.

### i69-b15 Helping a neighbor costs something real (S, 🔴)
Every help choice costs money, health or a focus week. The let-it-go choice saves you something now.
Payoff is small community and happiness spread over months. Careless players who click "help" on everything run short of money and health. Idle players skip and lose nothing.

### i69-b16 Skipped weeks don't lose a story (S, 🟠)
During ⏩ and Auto, a due beat waits up to 8 weeks, and Auto stops for it like other events that need you.
After 8 weeks it plays out without you: a plain Journal line and the neutral ending. Touches: the skip loop in turn.js.

### i69-b17 How their stories ended, on the end screen (S, 🔴)
One line per neighbor met: how it turned out and whether you were part of it ("Edna leased the farm to the Ortegas. You hauled her last harvest.").
Arcs still going say "still going." Touches: the end screen in ui.js. No score effect.

### i69-b18 Who's who: neighbor cards on the Life tab (M, 🟠)
A list on the Life tab: name, a one-line "where things stand," warmth as dots, and weeks since you last saw them.
Tap for that neighbor's story so far. Only neighbors you've met appear. Touches: ui.js Life tab.

### i69-b19 Neighbors fill in for "a friend" in old events (M, 🟠)
Events with nameless people swap in a neighbor you've met: Hollis in Truck trouble, Becca in A tip from a friend, Danny in a job lead, Tess in a hospital event.
Warmth nudges the result a little. Falls back to the old text if you haven't met anyone. Touches: text functions in events.js.

### i69-b20 When two neighbors' stories cross (M, 🟡)
Bonus beats when two arcs run at once: Kayla works Saturdays at the Medina bakery, Danny apprentices with Hollis, Morgan rents a corner of Edna's ground for a market garden.
Each one gives both arcs a small push toward a good ending. Touches: the `when` gates in the neighbors table.

### i69-b21 Each neighbor has a spot on the town map (S, 🟡)
Each neighbor's beats pin to their place: Edna's fields, Hollis's garage (the elevator road), the library for Mrs. Albee, Main Street for the shops.
Uses `EVENT_PLACE` and the 📍 line in events.js.

### i69-b22 Tap a name in the Journal to read their whole story (S, 🟡)
Journal lines from a neighbor's beats carry the name as a link. Tapping it filters the Journal to that neighbor.
Touches: Journal rendering in ui.js. Works alongside Journal search.

### i69-b23 When one story ends, a new neighbor moves in (M, 🟡)
Lifetime only. An ended arc can start a follow-up arc: Wyatt on Edna's place, Kayla back as a teacher, the young mechanic at Hollis's garage.
That keeps the cast fresh across 40-plus years without new code. Touches: a `next` field in the neighbors table.

### i69-b24 Neighbor stories: full, fewer or off (S, 🟡)
A setting: Full (game-length cast), Fewer (three neighbors), Off.
Score targets don't change because arcs are close to even for score. Touches: settings in ui.js and state.js.

### i69-b25 Neighbor stories save safely and survive updates (S, 🟠)
Arc progress lives in `S.nb` (`{id: {stage, warmth, at, f, end, seen}}`) with a version number.
`migrate` in state.js starts old saves with nobody met and drops unknown ids. Backup codes carry it.

### i69-b26 A test that walks every neighbor to every ending (M, 🟠)
A rules test forces each arc down each choice path. It checks that every ending can happen, no beat fires twice, and arcs end or wait cleanly at the last week.
Touches: tests/rules.test.mjs. Read-only of the data, so new neighbors are tested automatically.

### i69-b27 Sim check: neighbor stories don't reward idle play (S, 🔴)
The playtest bot runs careless, idle and good players with arcs on and off.
Targets: careless median 60 or lower, idle 50 or lower, good play 70 or higher. Arcs may add at most one or two points for good play.

### i69-b28 Help: your neighbors, in plain words (S, 🟡)
A short Help section: who the neighbors are, how often they come up, what warmth does, and that saying no is fine.
Touches: help.js and the Help search words.

### i69-b29 Player-made characters fit the same arc shape (M, 🟡)
The version 2.0 questionnaire (docs/npc-submissions.md) adds two fields: one hope and one worry.
A reviewer turns those into a three-beat arc in the neighbors table, so approved characters get stories, not just cameos.

### i69-b30 Stand-in names in one list, shuffled each life (S, 🟡)
Each neighbor's name comes from a small pool in one list, picked at the start of a life and saved.
Replays feel fresh, and the whole list is in one place to check against real townspeople before a release.
