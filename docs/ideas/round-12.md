# Ideas round 12

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 12: The neighboring towns

The other towns as real places with their own people, rivalries, festivals and services, plus moving away and what changes.

### i12-a01 College Place joins the region map (M, 🔴)
A seventh pin just west of Walla Walla (about 23 mi) with its own CITIES entry, blurb and two or three stops: a quiet bakery, a big-box store at the edge of town and a university orchestra night. Most shops close Friday sundown to Saturday sundown, so a Saturday-week trip finds fewer stops open.
New TOWNLL/TOWNIC/CITIES entry (js/maps.js, js/state.js), commuteRoute branch, STOPS towns lists, 'Know the region' badge stays at 5 towns. Stops cost gas and the usual 75% trip week, so it adds choice, not free points.

### i12-a02 Each town gets a character card (S, 🔴)
Tapping a town shows a short 'what it's like' card above the drive line: size, pace, what it's known for, and one line on what locals there say about Waitsburg folks.
A CHAR table beside CITIES, rendered in regionDetail (js/maps.js). Text only, no stat effect, so no balance risk.

### i12-a03 The Dayton rivalry game (M, 🔴)
Once each winter the Cardinals play Dayton in the gym for a stand-in traveling trophy. Go (home or away), cheer, help at the snack table, or skip it; the result rolls with a small home-court edge and the town talks about it for weeks.
A dated event in js/events.js with choices; a S.rival record {won, lost, streak}. Going costs gas when it's away. Effects are small community and happy bumps, only if you showed up.

### i12-a04 Bragging rights after the rivalry game (S, 🟠)
Win the Dayton game and for 4 weeks Main Street events lean friendly and the café counter talks you up; lose and you hear about it on Dayton trips. A little mood that fades.
S.rival.until; a light weight shift for a few town events (js/events.js) plus a line on Dayton's card. Mood effect only, capped at +2 community total, so it cannot carry a careless life.

### i12-a05 Follow the Cardinals on the road (S, 🟠)
Away games in Dayton, Prescott and other small-school towns show up as a one-stop trip during the season: cheap, a bit of community, and a chance to meet the same parents in the bleachers.
New 'game' STOPS kind with inSeason and per-town lists (js/features.js). Uses REPEAT_WEEKS cooldown so it can't be farmed every week.

### i12-a06 More than sports: cross-town contests (M, 🟠)
Dayton and Waitsburg keep a yearly score in friendly contests: best Main Street holiday lights, the bigger food-drive bin, a bake-off at Celebration Days. Help your town's entry with your focus that week and the tally shows on both towns' cards.
S.townCup {burg, dayton} per year; three dated events in js/events.js tied to existing season goals (#77). Your help counts only if your focus was community that week, so idle play adds nothing.

### i12-a07 Regulars in every town (M, 🔴)
Each town has one recurring stand-in person you meet on trips: the Dayton café waitress, the Walla Walla tire-shop guy, a Pasco taco-truck owner, a Richland retiree at the river walk. Visit three times and they remember your name; later they tip you off to a deal or a job.
A REGULARS table keyed by town; S.regs[town] visit count bumped in tripWeek (js/features.js); one line in the trip log per visit. Perks are small (a 10% discount, one job lead) and need repeat paid trips.

### i12-a08 Ties in your work town (M, 🟠)
Commuters slowly build 'ties' in the town they work in: coworkers, the lunch spot, a softball team. Ties make job applications there easier and soften the sting of a long drive, but they don't count as Waitsburg community.
S.ties[city] grows a little each work week (js/turn.js); used in the apply odds next to the People skill (js/features.js). Helps the commuter build (#70) without replacing showing up at home.

### i12-a09 Live in another town (L, 🔴)
Move your household to Dayton, Walla Walla or the Tri-Cities: each town gets two or three homes with its own rent and price of groceries, and commutes are measured from where you live. The Waitsburg map becomes 'your old town', still one trip away.
HOMES gain a town field (js/state.js); commuteOneWay and commuteRoute use S.homeTown; the town map shows the home town or a simple placeholder (js/maps.js). Big-town rents run higher and community starts low, so moving is a trade, not a shortcut.

### i12-a10 Community follows you, but slowly (M, 🟠)
After a move your Waitsburg community fades toward 'old friends' and a new town meter starts near zero. Old friends still invite you back for weddings and Celebration Days.
Per-town community: S.comm[town], with the current town's value shown as community (js/state.js, js/turn.js). Score uses the home town's meter, so moving to chase pay costs you standing for a while.

### i12-a11 Try a town before you move (S, 🟡)
Rent a weekend place in the town you're thinking about: one trip that shows its rent, grocery prices and drive to your job, and a short 'how it felt' note.
A 'trial weekend' stop (kind 'appt') in each big town (js/features.js) that sets a S.tried flag shown on the move sheet. Costs money and a trip week; no stat gain.

### i12-a12 Move closer to the job? (S, 🟠)
After six months of a 60-plus mile commute, an event asks if you want to move to the Tri-Cities. Say yes and you open the move sheet; say no and the game remembers you chose home.
One event in js/events.js gated on commuteOneWay and weeks in job; links to the Live in another town sheet. Choosing to stay gives a small one-time community bump, no ongoing effect.

### i12-a13 Coming home again (S, 🟡)
If you moved away and move back to Waitsburg, the town throws a small welcome-back scene: who missed you, what changed on Main Street, and part of your old community comes back.
A once-per-move event (js/events.js) when S.homeTown returns to waitsburg; restores a share of the faded meter. Capped so leaving and returning can't be looped for gain.

### i12-a14 The US-12 commuter club (M, 🟠)
Carpools get named riders and a rotation: some weeks it's your turn to drive (full gas that week), some weeks you ride. Riders come and go, and a rider who moves away leaves a gap you can fill by inviting a neighbor.
S.carpoolCrew in js/state.js; weekly driver turn in the gas step (js/turn.js); crew notes in the carpool card (js/ui.js). Average savings stay at half gas, just spread out more honestly.

### i12-a15 Leave early or leave late (S, 🟡)
Commuters pick a drive window: early (less traffic and fewer road events, a little less rest) or late (more rest, more trucks and deer at dusk). It changes which road events can roll.
S.commuteWin on the carpool/commute card (js/ui.js); weights in the R-event pool (js/events.js) and a tiny rest tweak (js/turn.js). Trade-off both ways; neither window is strictly better.

### i12-a16 Fill up where gas is cheaper (S, 🟡)
Gas costs a bit more in Waitsburg and Dayton than in the Tri-Cities. Commuters and trip-takers can choose to fill up in the bigger town and save a few dollars a month.
A per-town gas factor in CITIES (js/state.js) applied in commuteCost and tripGas; one toggle on the commute card. Savings are a few dollars, never worth a trip by itself.

### i12-a17 Jury duty in Walla Walla (S, 🟠)
Waitsburg sits in Walla Walla County, so the summons sends you to the county courthouse there. Serve a week (small pay, community up, work week lost) or ask to be excused once.
A rare event in js/events.js; serving sets a 'away' week like a trip. Net effect is near zero money and a little community, so it's flavor with a real choice.

### i12-a18 County seat errands (S, 🟡)
Some paperwork only happens at the county seat: property tax for owned homes, a marriage license, business licenses. These become Walla Walla 'appt' stops that clear a pending item.
New appt STOPS (js/features.js) that satisfy flags set by owning a home, getting married or starting a business. Skipping an item adds a small late fee later, so ignoring it doesn't pay.

### i12-a19 Learn some Spanish in Pasco (M, 🟠)
Trips to Pasco's taquerias and market, and a class at the community college, slowly build a Spanish skill. It opens better odds at bilingual jobs in the Tri-Cities and a friendly scene or two.
A new 'spanish' entry in SKILLS (js/features.js) practiced by Pasco stops and an evening class focus option. Skill grows slowly and only from paid trips or study weeks.

### i12-a20 Three cities, three personalities (S, 🟡)
The Tri-Cities stop feeling the same: Richland trips can bring lab and Hanford talk, Pasco trips the rail yard and farm work, Kennewick trips shopping crowds and traffic. Each town gets its own small pool of trip-log lines.
A TRIPLINES table per city read in tripWeek's log (js/features.js). Text only.

### i12-a21 Festival weeks as trip stops (M, 🔴)
Each town's big yearly event becomes a stop for its weeks only: Dayton's town days in summer, Walla Walla's sweet onion festival in July, the county fair in Kennewick in late August, a harvest festival in College Place. Most cost a little and give happy and community.
Dated STOPS with a 'when' on the week of year (js/features.js), shown with a badge on the region map (js/maps.js). Cooldown is one per year each; they don't repeat existing events R-11, R-17, R-18 or R-24.

### i12-a22 A weekly 'what's on' line per town (S, 🟡)
Each town card shows one line on what's going on there this week: a sale, a game, road work, a festival coming up. It helps you decide where a trip is worth it.
Built from STOPS 'when' windows plus a small word list per town in regionDetail (js/maps.js). No stat effect.

### i12-a23 Wine weekends crowd Walla Walla (S, 🟡)
On wine release weekends, downtown dinner and the tasting room cost more and might be full unless you planned the trip a week ahead. Locals learn to go the week after.
A price and 'full' check on the bistro and tasting stops during R-14 weeks (js/features.js); planning S.trip a turn early locks the normal price. Small money effect only.

### i12-a24 Hardware runs for the fixer-upper (S, 🟠)
Lumber and paint are cheaper at the big-box store in Kennewick or Walla Walla. A hardware stop on a trip lets fixer-upper owners do a repair project for less and grow equity a little faster.
A 'hardware' errand STOP (js/features.js) that sets a short S.repairUntil bonus to equityPer for the fixer home (js/turn.js). Costs money and a trip week; the bonus is small and time-limited.

### i12-a25 Dayton's small-town services (S, 🟡)
Dayton becomes the close option for a few things Waitsburg lacks: a small hospital ER, a vet, a lumber yard. Closer and quicker than Walla Walla, a bit pricier and fewer choices.
Extra Dayton entries in STOPS (js/features.js), each a pricier near twin of a Walla Walla stop. Shorter gas, same 75% trip week.

### i12-a26 Teens want to go to the big town (M, 🟡)
Once kids are teens they push for Walla Walla movies or the Kennewick mall with friends. Drive them, let them ride with a friend's parent, or say no; each choice nudges family mood and your week.
A few events in js/events.js gated on kid age; driving them adds a free one-stop trip for that week. Small effects; saying no is a fair choice.

### i12-a27 Towns appear on the map as you hear of them (M, 🟠)
The region map starts with Waitsburg, Dayton and Walla Walla. Other towns fade in when the story brings them up: a job posting, an event, a regular's tip. A light 'more out there' label hints at what's still hidden.
S.known set in js/state.js; regionSVG draws only known pins (js/maps.js); events and job listings add towns. Old saves start with all towns known so nothing disappears.

### i12-a28 Drive-time rings on the region map (S, 🟡)
Faint rings show 15, 30 and 60 minutes from home, so you can see at a glance what a commute or trip means.
Three circles from the home pin in regionSVG (js/maps.js), scaled from the existing minutes formula. Pure display.

### i12-a29 Same trip as last time (S, 🟡)
Each town remembers your last trip there. One tap on 'Same as last time' plans it again, skipping any stops that are on cooldown or out of season.
Store S.lastTrip[city] in tripWeek; a button in tripSheet (js/features.js). Convenience only; cooldowns and costs still apply.

### i12-a30 Prescott, the sister town (M, 🟠)
Prescott shares more than a highway with Waitsburg: school families, a co-op team and the same wheat trucks. Prescott neighbors show up at Cardinals games and harvest scenes, and a Prescott family can become friends you visit.
A Prescott NPC pool in js/events.js used by school and harvest events, plus one visit scene. Different from the earlier Prescott day-trip idea: this is people, not stops. Small community effects.

### i12-a31 Out-of-town friends who need a visit (M, 🟠)
Friends you make in other towns (regulars, coworkers, a Prescott family) fade if you never visit. A trip to their town keeps them; an occasional invitation to a birthday or a barbecue gives a reason to go.
S.friendsOut[town] with a slow fade in js/turn.js; invitations as events in js/events.js. Keeping them costs gas and trip weeks, so they reward deliberate play only.

### i12-a32 Region map shows where you're known (S, 🟡)
Town pins get a small ring that fills as your ties, regulars and friends there grow, so you can see your life spread across the valley.
Reads S.ties, S.regs and S.friendsOut in regionSVG (js/maps.js). Display only.

## Ideas 12: Quick wins

Small, cheap fixes found by reading ui.js, help.js, turn.js and the CSS line by line; every one is size S.

### i12-b01 "End this life now" asks first (S, 🔴)
Menu → "End this life now" (ui.js showMenu) calls finish() at once, which scores the life and clears its slot. Add a confirm sheet with the score so far and "Keep playing" as the safe button (Esc picks it).
Why: A misclick in the Menu ends a 40-year life and frees its slot for good.
Touches: ui.js showMenu, features.js finish.
Balance: No score change; ending early already counts.

### i12-b02 Net worth breakdown adds up (S, 🔴)
showStatInfo("net") lists cash, equity, ride, 401(k) and truck loan, but netWorth() also counts the business and student loans, so a Grad or business owner sees rows that do not add to the total. Add the two rows, and say so in the Help Stats line too.
Why: Rows that don't add up make players distrust every number.
Touches: ui.js showStatInfo, state.js netWorth, help.js guideHTML (stats).
Balance: Display only.

### i12-b03 Debt warning names the right limit for the mode (S, 🔴)
The Home card says "Below -$40,000 you'll have to leave town" even on Hard (weekTick ends at -$25,000) and on Relaxed (debt never ends it). Read the limit from the same place weekTick does and warn earlier on Hard; fix the Help Money line to match.
Why: Hard players get a false sense of room and lose the game with no fair warning.
Touches: ui.js renderHome, turn.js weekTick (debtEnd), help.js guideHTML (money).
Balance: Keeps Hard hard but honest; no score change.

### i12-b04 Replacing a full slot asks once more (S, 🔴)
When all 5 slots are full, askReplace deletes a life on one tap of "Replace". Add the same second step saveCopySheet already uses: "Replace Ann's life? (6 Months · age 19 · $2,300) This can't be undone."
Why: One stray tap on the wrong card deletes a life.
Touches: ui.js askReplace (reuse the saveCopySheet confirm).
Balance: None.

### i12-b05 Undo a deleted life for a few seconds (S, 🟠)
After 🗑 Delete on the title screen, the toast says "Deleted · Undo" for about 6 seconds and puts the life back in its slot if tapped. Needs a toast with one button.
Why: Deleting stays two taps, but a regret is now fixable.
Touches: ui.js askDelete, state.js toast (optional action button).
Balance: None.

### i12-b06 Starting a business asks first (S, 🟠)
A tap on the $6,000–$9,000 price in "Start a business" spends the money at once (features.js startBiz). Show a short sheet: cost now, what it pays and when, and that it sells for 60% of the price.
Why: Selling already asks; buying, the bigger money move, does not.
Touches: features.js startBiz, bizCard.
Balance: Stops accidental buys; no balance change.

### i12-b07 A calm debt card before the scary one (S, 🟠)
Between $0 and the warning line Home says nothing, though interest is charged every week. Add a small card: "You're $3,200 in debt: about $11/wk in interest." The red warning stays for deep debt.
Why: Players see debt early while it is still cheap to fix.
Touches: ui.js renderHome, turn.js weekTick (interest line).
Balance: Nudges careful play; careless play still pays the interest.

### i12-b08 Cash in the header turns red in debt (S, 🟠)
The header money is the same white whether you have $5,000 or -$5,000. Below $0 show it with a red-on-white pill and the word "debt" for screen readers.
Why: A minus sign alone is easy to miss at a glance.
Touches: ui.js render (header), index.html .top .money CSS.
Balance: Display only.

### i12-b09 Long names don't push the cash off the header (S, 🟡)
A 20-letter name plus mode, 🏁, 📅 and 🌳 tags crowds the header row on a small phone. Let the name shrink with an ellipsis (min-width:0, overflow hidden) and keep the cash and ? button fixed.
Why: Names up to 20 letters are allowed, so this happens.
Touches: index.html .top .row / .top h2 CSS, ui.js render.
Balance: None.

### i12-b10 Lifetime header says something useful on the right (S, 🟠)
In Lifetime the header shows "age 34" on the left and "Age 34" again on the right. Put "Retire from 62" (or "Retired") or the Lifetime label there instead.
Why: The same number twice wastes the one spot that shows how far you are.
Touches: ui.js render (left).
Balance: None.

### i12-b11 No "-$0" in the week strip (S, 🟠)
runChips and showRunDetails pass the raw change to fmt, so a change of -$0.40 shows as a red "-$0". Round before picking the sign and the color, and show "$0" in the flat gray.
Why: A red "-$0" looks like a bug.
Touches: turn.js runChips, showRunDetails; state.js fmt.
Balance: None.

### i12-b12 A trade-in worth more than the car says "you get money back" (S, 🟠)
buyCar shows "You pay $0 now" when the trade-in is worth more than the sedan, but then adds the difference to your cash. Say "You get $1,200 back" in that case.
Why: The sheet says one thing and the cash does another.
Touches: ui.js buyCar.
Balance: No change to the math.

### i12-b13 Say why the ride buttons are greyed out (S, 🟠)
While a truck loan runs, every "Buy" in the Ride card is disabled with no reason (and disabled buttons ignore taps). Add one line: "Pay off the truck first (23 payments left)."
Why: Players think the button is broken.
Touches: ui.js renderLife (Ride card), index.html .sm[disabled].
Balance: None.

### i12-b14 401(k) buttons show what they cost a week (S, 🟡)
The 0% / 5% / 10% buttons give no dollar figure and lack aria-pressed. Show "5% · about $38/wk" from the current paycheck, and mark the chosen one pressed.
Why: A percent alone doesn't tell a new player if they can afford it.
Touches: ui.js renderLife (401(k) card).
Balance: Display only.

### i12-b15 Greyed-out focus tiles say why (S, 🟡)
Work extra and Side hustle are disabled with no job, and Classes after a degree, with no reason given. Add a tiny line on the tile ("needs a job", "all done").
Why: Saves a trip to Help.
Touches: ui.js renderHome (fgrid).
Balance: None.

### i12-b16 Empty job list offers to clear the filter (S, 🟠)
With ✅ Can apply on and a town picked, the board can say only "No jobs match." Add "Show all jobs here" and "Show all towns" buttons.
Why: An empty list with no way out feels like a dead end.
Touches: ui.js renderJobs.
Balance: None.

### i12-b17 The Journal says it keeps the last 120 entries (S, 🟡)
log() drops the oldest lines past 120, so a long Lifetime Journal starts mid-story with no note. Add a muted line at the bottom: "The Journal keeps your newest 120 entries."
Why: Players think their early life was lost by a bug.
Touches: ui.js renderLog, state.js log.
Balance: None.

### i12-b18 Names are escaped in Journal lines (S, 🟡)
The name goes into log text and renderLog prints it as HTML, so a name like "<i>Al" turns the rest of the Journal italic. Escape the text when it is drawn.
Why: Tiny bug, two-word fix.
Touches: ui.js renderLog, turn.js showReview (already escapes).
Balance: None.

### i12-b19 Multi-week details say the bills are for the last week (S, 🟠)
After ⏩ 13, showRunDetails shows one week of paychecks and bills over a total for all 13 weeks. Title the block "Last week's paychecks and bills (1 of 13)" so the numbers don't look wrong.
Why: The rows and the total don't match and nothing says why.
Touches: turn.js showRunDetails.
Balance: Display only.

### i12-b20 The hospital note says where you land (S, 🟡)
The hospital note gives the bill but not that health is now 30 and happiness took a hit. Add "You're home at health 30. Rest for a few weeks."
Why: The player gets a next step, not just a bill.
Touches: turn.js weekTick (health crisis).
Balance: None.

### i12-b21 Save slots show mode, challenge and weekly tags (S, 🟠)
slotLine shows length, age, date and cash only, so a Hard life, a weekly challenge and a challenge story all look alike on the title screen. Add the same 🔥 / 📅 / 🏁 / 🌳 tags the header uses.
Why: Players pick the wrong life to continue or replace.
Touches: state.js slotLine / slotCard.
Balance: None.

### i12-b22 No checkpoint copies of a weekly-challenge life (S, 🟠)
A weekly life keeps its dice in S.rng, so a copy from 💾 Save game lets you replay the same events and pick again for a better shared score. Disable "copy to another slot" for weekly lives, with a line saying why.
Why: Keeps the weekly score card fair between friends.
Touches: ui.js saveCopySheet, loadSheet; features.js useDice.
Balance: Closes a save-scum route; no effect on normal lives.

### i12-b23 The weekly challenge sheet shows your best this week (S, 🟡)
The 📅 start sheet doesn't say if you already played this week. Add "Your best this week: 64" (or "Not played yet") and which name it will use.
Why: Saves a trip to Your records.
Touches: ui.js renderTitle (#weekly sheet).
Balance: None.

### i12-b24 The welcome toast fits how your life begins (S, 🟡)
newGame always says "Start by finding a job," even for the Farm kid, who starts with one. Say "Pick your first week's focus" when you already have a job.
Why: First words that don't match the screen confuse new players.
Touches: ui.js newGame.
Balance: None.

### i12-b25 Legacy is "grandkid" everywhere (S, 🟡)
What's New says Legacy lets you "carry on as your grown kid," but the end screen and Help say grandkid. Use one word.
Why: Mixed words make players think it's two features.
Touches: ui.js WHATS_NEW, features.js legacySheet, help.js guideHTML.
Balance: None.

### i12-b26 Help numbers come from the game data (S, 🟡)
Help hard-codes kids at $650 a month, moving at $300, the debt lines and the list of remote office jobs. Build them from KID_COST, the moving cost, debtEnd and JOBS.filter(remote) so Help can't drift when balance changes.
Why: Help has already drifted once (the debt limit).
Touches: help.js guideHTML (money, jobs, home, family), state.js constants.
Balance: None.

### i12-b27 Restore with nothing pasted says what to do (S, 🟡)
Tapping "Check this backup" with an empty box shows "That doesn't look like a backup." Say "Paste a backup code or choose a file first."
Why: Not an error, just a missing step.
Touches: ui.js restoreSheet.
Balance: None.

### i12-b28 Backup buttons say why they're off (S, 🟡)
With no saved lives, the download and copy buttons are greyed out with no reason. Add "No saved lives to back up yet."
Why: Disabled buttons can't be tapped to ask why.
Touches: ui.js backupSheet.
Balance: None.

### i12-b29 The quit sheet says benefits only follow a layoff (S, 🟡)
Unemployment benefits (S.ui) start only on a layoff, but the quit sheet says only "no paycheck." Add "No unemployment benefits when you quit" and, if you carpool, "Your carpool ends."
Why: Players quit expecting the 6 months of benefits Help talks about.
Touches: ui.js renderJobs (#quit sheet), events.js layoff.
Balance: Clearer cost of quitting; no change to the math.

### i12-b30 The end screen counts kids raised honestly (S, 🟡)
finish() shows "Kids raised: 2" even when both kids are toddlers. Show "Kids: 2 (ages 3 and 1)" unless they are grown.
Why: Small wording nit on the screen players share.
Touches: features.js finish.
Balance: None.
