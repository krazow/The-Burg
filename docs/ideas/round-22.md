# Ideas round 22

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 22: Bug hunt

Real defects found by reading turn.js, features.js, events.js, outabout.js and state.js, each checked headless where possible (🔴 = checked, 🟠 = likely).

### i22-a01 Closing the app mid-event no longer dodges it (M, 🔴)
playWeeks saves before the event card shows, and nothing records the open event, so reloading during Layoffs skips it (and it then waits 40 weeks to come back). Save the open event's title as S.pendingEv, show it again on load, and clear it once a choice is made.
Checked: forced Layoffs, reloaded mid-card, the job was still there and the cooldown was set.
Touches: turn.js playWeeks, events.js showEvent, ui.js loadSlot, state.js migrate (add pendingEv).
Balance: Removes a reload trick that only helps players who game the save.

### i22-a02 An ending sticks even if you close the app (M, 🔴)
When an ending waits behind a 'This week' notes sheet, the slot is still saved as a live life, so closing the app undoes a Lifetime death and rolls it again. Save S.endPending with the reason and finish() it on load.
Checked: at 102 with a rut note showing, the slot was still a live life after a reload.
Touches: turn.js playWeeks, features.js finish, ui.js loadSlot.
Balance: Removes a way to undo deaths and debt endings.

### i22-a03 A new job clears leftover unemployment (S, 🔴)
S.ui only counts down while you're out of work, so after a layoff and a quick rehire the rest of the 6 months of benefits wait, and you collect them later if you quit. Set S.ui = 0 on every hire (apply and the friend's tip).
Checked: layoff, rehired after 2 weeks, quit 10 weeks later, and benefits paid again (5.3 months left).
Touches: ui.js apply, events.js 'A tip from a friend', turn.js.
Balance: Quitting already costs a paycheck; this just stops free benefits.

### i22-a04 No harvest check the week you lease the ground (S, 🔴)
A wheat lease started in August pays the full harvest check the next week (about $6,900 on average) before anything was farmed. Skip the harvest in the lease's first year unless it started before planting (by March).
Checked: a lease started Aug 23 paid its harvest check one week later.
Touches: features.js bizWeek and startBiz (store the start date).
Balance: Cuts a quick-money trick; careful players still profit over 5 years.

### i22-a05 No harvest check after the lease is up (S, 🟠)
Between the end of the lease and the end of the 8-week grace period, bizWeek still pays the August harvest, so a 5-year lease can pay 6 harvests. Pay only while S.biz.weeks < S.biz.lease.
Found by reading: the grace check runs before the harvest code and doesn't stop it.
Touches: features.js bizWeek.
Balance: Five harvests for five years. Small cut to wheat income.

### i22-a06 Renewing the lease can't be flipped for profit (S, 🔴)
At the end of a lease you can renew for about $1,500 and sell right away for about $2,800, because bizValue ignores how much lease time is left. Scale a wheat lease's value by the weeks it has left.
Checked: renew $1,501, sell $2,784, net +$1,284 the same week.
Touches: features.js bizValue, sellBiz, renewLease.
Balance: Net worth also stops counting a lease that's about to end at full value.

### i22-a07 A goal you already meet when you pin it doesn't count (S, 🔴)
Badges are only checked when a week ends, so a farm kid who pins 'First paycheck' (or a transplant who pins 'New wheels', a grad 'Certified', a young parent 'Family') gets +2 for nothing. Skip goals whose badge test is already true when pinned.
Checked: farm kid pinned 'First paycheck' at turn 0 and got +2 after one week.
Touches: features.js goalsSheet, goalCounts.
Balance: Life goals reward what you work toward, not where you started.

### i22-a08 Old winter tires don't come back with a new car (S, 🔴)
S.tires stores the car type, and buyCar never clears it, so going sedan to truck and back to a sedan puts the old winter tires on the new sedan. Clear S.tires in buyCar.
Checked: S.tires = 'sedan' still applied to a second sedan (ditch odds 0.4).
Touches: ui.js buyCar.
Balance: Tires are paid for each vehicle, as the stop already says.

### i22-a09 The friend's job tip shows today's pay (S, 🔴)
The tip's button shows fmt(x.pay), the 2027 monthly pay with no '/mo', so late in a Lifetime an RN shows $7,300 when it really pays $13,140. Use wk(payNow(x, false)) like the job board.
Checked: wage 1.8x, label $7,300, real pay $13,140 a month.
Touches: events.js 'A tip from a friend'.
Balance: Text only.

### i22-a10 Raise and promotion text tell the truth at the cap (S, 🔴)
'A raise' caps at 1.5x and bumpPay at 1.6x, but the text still says 6%, 12% or 2%: at 1.48x the '6% raise' is really 1.4%. Show the real change, and say when you're at the top of the pay scale.
Checked: raise at 1.48x moved to 1.50x and said '6% raise'.
Touches: events.js 'A raise', 'A promotion offer', 'A recruiter calls'; maybe one RAISE_CAP.
Balance: Text only, plus one cap value for all three.

### i22-a11 A raise doesn't reset your time on the job (S, 🟠)
'A raise' sets S.jobMonths = 0, and that same counter also gates reviews, promotions and layoffs, so a raise blocks a promotion for a year and protects you from layoffs for 9 months. Track the last raise in its own field.
Found by reading: jobMonths is the only tenure counter, and the raise event resets it.
Touches: events.js 'A raise' (new S.raiseAt), state.js migrate.
Balance: Layoff risk comes back to normal after a raise. Small change.

### i22-a12 The food truck counts as hustling (S, 🔴)
In food-truck months the side hustle is skipped, so S.hustleLast never moves and hustle experience fades while you work the truck every weekend. Count truck weeks as hustle weeks.
Checked: 30 weeks of food truck weekends took hustle experience from 40 to 38.5.
Touches: turn.js weekTick (hustle and truckTime).
Balance: Keeps the truck owner's hustle skill. No new income.

### i22-a13 The bluegrass jam event comes on a jam week (S, 🔴)
The jam event is rolled on an even turn but shown on the next (odd) turn, when Tonnage's card says 'Private this week. The jam is next week.' Check jamWeek for the week the event shows (S.turn + 1).
Checked: event rolled on turn 4 (a jam week) and showed on turn 5, when Tonnage is closed.
Touches: outabout.js OUT_EVENTS jam event, jamWeek.
Balance: Text and timing only.

### i22-a14 The gas-spike event counts remote days and carpools (S, 🔴)
'Gas prices spike' calls commuteCost without the job, so a scientist who carpools pays $185 when a quarter of the real gas is $56. Pass job() the way the remote-day trial does.
Checked: carpooling scientist charged $185 vs a true quarter of $56.
Touches: events.js 'Gas prices spike'.
Balance: Makes carpooling and remote days pay off the way the Jobs tab says.

### i22-a15 Extra class weeks carry over when you graduate (S, 🔴)
classWeeks and weekTick set studyProg to 0 when you graduate, so a 4-week training course that finishes a program wastes the extra weeks. Carry the extra into the next program.
Checked: 15 of 16 weeks plus a 4-week course left 3 weeks unused.
Touches: events.js classWeeks, turn.js study step.
Balance: At most a few weeks saved per diploma.

### i22-a16 Helping with college checks your cash first (S, 🔴)
'Help with tuition' is the first button and takes $15,000 with no check, so it can push you past the debt limit and end the game (the bots pick it every time). Offer it only with cash on hand, or offer a smaller amount.
Checked: at -$15,000 on Hard, helping took you to -$30,000, past the -$25,000 limit.
Touches: events.js 'A kid heads off to college'.
Balance: Careless play still pays more for kids; it just can't end the game in one tap.

### i22-a17 Your partner gets Social Security too (S, 🟠)
When you turn 65 your partner's paycheck stops, and nothing replaces it, even if you're still working. Switch it to a small Social Security check at 65 instead of $0.
Checked: at 65 with a partner, no partner income line at all.
Touches: turn.js weekTick partner lines.
Balance: A small retirement income; keep it under the part-time paycheck.

### i22-a18 Hard mode's +10% leaves the mortgage alone (S, 🟠)
Hard says rent, food and insurance cost 10% more, but the line also adds 10% to a locked-in mortgage. Use 10% of rent only when renting.
Found by reading: the Hard line takes 10% of rentV, which is the mortgage for owners.
Touches: turn.js weekTick Hard living line.
Balance: Owners on Hard pay slightly less. Small.

### i22-a19 The Lifetime progress bar and the score agree (S, 🔴)
The header bar runs from 18 to 85 while the score's 'on track' check runs from 18 to 65, so at 65 the bar says 70% and the score says 100%. Pick one span for both.
Checked: at 65 the header said 70% and gameProgress said 100%.
Touches: ui.js render (header bar), features.js gameProgress.
Balance: Display only.

### i22-a20 Older saves get a mortgage in today's dollars (S, 🟠)
migrate gives an owned home with no mortgage HOMES.cost in 2027 dollars, while buying sets cost(x.cost). Use cost() with the save's S.col.
Found by reading: migrate sets s.mortgage = HOMES[s.home].cost.
Touches: state.js migrate.
Balance: Older saves only.

### i22-a21 A restored backup checks home, car and job ids (S, 🟠)
readBackup checks name, length, money, date and age, but not home, car or job, so a backup from a newer version (or one edited by hand) crashes render on HOMES[S.home].own. Treat unknown ids as invalid, or reset them to safe defaults.
Found by reading: the ok() check in readBackup.
Touches: ui.js readBackup.
Balance: No balance effect.

### i22-a22 Sim bots skip weeks too (M, 🟠)
The sim only calls weekTick(false), so the skip path that settles one-choice events inside weekTick (before the date moves) is never tested. Add a bot that plays in 4-week skips and compare its scores.
Found by reading: tests/sim.test.mjs only ever calls weekTick(false).
Touches: tests/sim.test.mjs.
Balance: Test only; guards the careless and idle score targets on the path players use.

### i22-a23 Sim bots buy homes and cars and start the next generation (M, 🟠)
No bot ever calls moveHome, buyCar, the food truck business or startLegacy, so the bugs above went unseen. Add a homeowner bot, a car trader and a 2-generation Lifetime run.
Found by reading: the sim has no calls to moveHome, buyCar, startBiz('truck') or startLegacy.
Touches: tests/sim.test.mjs.
Balance: Test only.

### i22-a24 The sim checks every number, not just five (S, 🟠)
The sim checks only money, equity, carValue, age and date for NaN. Also check k401, col, wage, studyProg, raise, S.biz.dep and skill points, and fail on any that are negative or not finite.
Found by reading: the sim's finite check lists five fields.
Touches: tests/sim.test.mjs.
Balance: Test only.

### i22-a25 Trip stops get checked again if you go into debt (S, 🟠)
planTrip limits a trip to 1 stop in debt, but only when you plan it. Plan 3 stops at $50, go into debt before the week ends, and all 3 still happen. Check tripMax() again in tripWeek and keep only the first stop.
Found by reading: tripWeek never calls tripMax().
Touches: features.js tripWeek.
Balance: Keeps the debt rule honest.

### i22-a26 Moving away from the fixer-upper ends its story (S, 🟠)
If you move out partway through the fixer-upper story, S.chains.fixer stays at its step. Buy a fixer-upper again later and the kitchen step picks up on the new house, but the porch step never comes back. End or reset the chain in moveHome.
Found by reading: moveHome doesn't touch S.chains.
Touches: ui.js moveHome, features.js STORY_EVENTS.
Balance: No balance effect.

## Ideas 22: Inside a week

Ideas that make a single one-week turn feel richer while keeping each turn under about 20 seconds.

### i22-b01 Day notes: five weekday lines in the week summary (S, 🔴)
After End Week, the details sheet shows Mon to Fri as one short line each, picked from your focus, job, season and town. It is flavor only, so the week reads like days, not a bill.
- The 'This week' sheet gets a small Mon–Fri list above the money lines, one line a day.
- Lines come from a new MOMENTS pool in events.js, filtered by focus, job, month and town.
- Touches showRunDetails() and weekTick() in turn.js (store S.last.days).
- Balance: no stat effect, so it can't reward careless or idle play.

### i22-b02 Tonight: one evening tap a week (M, 🔴)
Under the focus grid, one chip offers three evening options for this week, like porch time, call your sister or early to bed. Each is about a quarter of a focus, and not tapping means a quiet night with no effect.
- Options rotate by season and household and read from a small EVENINGS table in state.js.
- Applied in weekTick() after the focus, at 0.25 strength, with its own repeat fade like focusEffect().
- UI: one chip row in ui.js Home, one tap, no sheet.
- Balance: the untouched default is zero effect, so idle play gains nothing.

### i22-b03 A week recap that tells a tiny story (M, 🔴)
The top of the recap is three short lines: how the week started, what turned, and how it ended, built from the week's real money, stats and events.
- Templates per focus with slots: 'Monday you picked up a double. Wednesday the truck needed tires. By Sunday you were tired but ahead.'
- Reads S.last.lines, S.run.happened and stat deltas; new recapStory() in turn.js.
- Shows in the notes sheet and the details sheet; screen readers get the same three lines.
- Balance: reads the week, never changes it.

### i22-b04 Keep a turn under 20 seconds: a turn-budget test (S, 🔴)
A Playwright test counts taps and sheets per turn over 52 weeks and fails if a normal week needs more than 3 taps or more than one sheet on average.
- New tests/turn-budget.spec.mjs using tests/helpers.mjs; logs taps, sheets and time per week.
- Every new in-week feature (evening tap, day notes, reactions) must pass it.
- Report prints the slowest weeks and why (event, review, notes).
- Balance: no gameplay change; it guards pace.

### i22-b05 A midweek tap, inline in the recap (M, 🔴)
At most once a week, a tiny yes/no shows in the week strip, not a sheet: 'Neighbor needs a hand with a couch tonight?' Yes costs a little happiness and adds a little community.
- Inline buttons in the weekstrip (ui.js); answered or ignored by next End Week.
- Pool of 30 micro-asks in events.js tagged by town, job and household.
- Skips and Auto decline on their own, so they never stop a skip.
- Balance: effects are 1 to 2 points and capped; ignoring is neutral, so idle doesn't score.

### i22-b06 Moment pack: 90 small daily lines (M, 🟠)
A content pack of one-line daily moments for day notes: the elevator crew waving from the scale house, frost on the truck, kids biking past the pool.
- MOMENTS array in events.js with tags: focus, job, month, town, household, weather.
- Each line has a cooldown like evCd so the same moment doesn't repeat within 10 weeks.
- Stand-in names for any business; real streets and places are fine.
- Balance: flavor only.

### i22-b07 Jobs set which days are your weekend (M, 🟠)
Each job lists its work days: the diner works Saturdays, the farmhand works all of harvest, the para has summers off. Day notes and the weekend line follow it.
- Add a days field to JOBS in state.js (e.g. 'Tue–Sat').
- Day notes use it; harvest months override for field jobs.
- Pairs with the shift strip idea (i8-b07) as its data source.
- Balance: shown only, unless the weekend-rest rule below is built.

### i22-b08 Overtime and hustle eat your weekend (S, 🟠)
Every focus keeps a small weekend rest, except Work extra hours and Side hustle, which use the weekend up. The focus tile says 'uses your weekend'.
- In weekTick(): +0.3 happy weekend baseline for all focuses except work and hustle.
- Focus tile desc in ui.js gets a small 'uses your weekend' tag.
- Balance: makes nonstop overtime a bit worse, which helps keep careless money-grinding below good play.

### i22-b09 The weekend writes itself (S, 🟠)
The recap ends with one Saturday–Sunday line drawn from what you did: 'Slept till ten Saturday, mowed Sunday' after overtime, 'Sunday on the Touchet' after Get outside.
- One template per focus plus household and season variants in turn.js.
- No choice and no stat effect; it closes the tiny story.
- Balance: flavor only.

### i22-b10 Sunday night feeling: a one-word read (S, 🟠)
Each recap ends with one word for how the week left you: Rested, Stretched thin, Restless, Content, Behind. It comes from the stat and money deltas.
- Small lookup in turn.js on dh, dH, dc and net money.
- Shows next to the week strip label on Home ('Last week · Stretched thin').
- Balance: info only; it nudges players to notice ruts.

### i22-b11 Quick reactions to the week's result (S, 🟠)
Under the recap, three chips: 'Worth it', 'Rough one', 'Need a break'. 'Need a break' preselects Rest for next week; the others just go in the Journal.
- One tap, optional, closes the sheet.
- Stored as S.react per week; the year in review counts them ('You called 9 weeks rough').
- Balance: no stat effect; preselect only saves a tap.

### i22-b12 The week's best moment chip (S, 🟠)
The recap highlights one best thing that happened, picked from the biggest good change: a promotion, a fish, a paid-off loan, a good potluck.
- Pick from S.run.happened, notes and day notes by weight.
- Shown as a gold chip at the top of the details sheet and saved to the Journal.
- Balance: info only.

### i22-b13 Money in day order (S, 🟠)
The money list in the recap reads by day: 'Fri: paycheck +$612. Sat: groceries −$120. Sun: gas −$38.' A toggle keeps the old list.
- Map each line kind in S.last.lines to a day (pay Friday, rent the 1st week, food Saturday).
- showRunDetails() in turn.js renders either view; setting in ui.js.
- Balance: same totals, just easier to feel.

### i22-b14 Fewer sheets: small notes go to the strip (S, 🟠)
Notes that need no choice (a badge, a season goal step, a skill level) show as small icons on the week strip instead of a 'This week' sheet that must be closed.
- playWeeks() in turn.js only opens the notes sheet for big notes (graduation, payoff, hospital, rut).
- Small notes get an icon in the weekstrip with a tap for detail.
- Helps keep a turn under 20 seconds.
- Balance: no change to effects.

### i22-b15 Quiet weeks play faster (S, 🟠)
Weeks are tagged quiet, normal or big. A quiet week shows only the strip; a big week gets the full tiny story. Players see right away which weeks matter.
- Tag in weekTick() from event, notes and the size of stat moves.
- Recap length follows the tag; quiet weeks skip the day notes unless opened.
- Balance: pacing only.

### i22-b16 Household evenings (S, 🟠)
When you have a partner, kids or a dog, the evening tap offers them: homework at the kitchen table, a walk with the dog, a movie on the couch.
- Extra rows in the EVENINGS table keyed on S.partner, kidsAtHome() and S.dog.
- Kids options feed kidJoy a little, like Rest does now.
- Balance: same 0.25 strength cap as other evenings.

### i22-b17 Evening habits form on their own (M, 🟡)
Pick the same evening thing four weeks running and it becomes a named habit ('Tuesday porch regular'). A habit gives a tiny steady effect but takes the evening slot until you drop it.
- S.habit in state.js; shown as a chip on Home with a 'drop it' tap.
- Effect is half the evening's value, so trying new evenings still pays more.
- Balance: small and capped; it rewards steady play, not idle.

### i22-b18 Day notes that hint at next week (M, 🟡)
Now and then a day note sets up a coming event: 'Thursday: saw smoke over the Blues.' The next week or two, the smoke event comes.
- Event entries in events.js get an optional hint line; rollEvent() schedules the event after its hint shows.
- Uses the story-chain plumbing already built.
- Balance: same events, just warned; slightly helps attentive players.

### i22-b19 Name every week (S, 🟡)
Each week gets a short title from its biggest moment: 'The week the creek came up', 'Double-shift week'. It shows on the strip and in the Journal.
- Title from recapStory() or the best moment; falls back to the season.
- Journal rows in ui.js show the title instead of only the date.
- Balance: flavor only.

### i22-b20 A snapshot of the week (M, 🟡)
Each week leaves one emoji scene (🎣🌅, 🛻❄️, 🍰🤝). The year in review shows them as a 52-tile strip you can tap through.
- S.snaps array, one entry per week, trimmed to the current year.
- showReview() in turn.js draws the strip; tap a tile for that week's title.
- Balance: flavor only; small save size.

### i22-b21 The year in review picks its best weeks (S, 🟡)
The year in review lists three standout weeks with their tiny-story lines, not only milestones.
- Keep the top weeks by best-moment weight in S.yearBest (max 3).
- showReview() adds a 'Weeks to remember' block.
- Balance: info only.

### i22-b22 Skip digest: one line per week (S, 🟡)
After a skip of several weeks, the recap shows one best day note per week in a short list, so skipped weeks still have a story.
- playWeeks() collects one moment per weekTick() into S.run.days.
- showRunDetails() lists them under 'The last N weeks'.
- Balance: no change; skips stay fast.

### i22-b23 A text after a rough week (S, 🟡)
After a week that ends Stretched thin or Behind, a friend or your partner sometimes texts one line. A one-tap 'thanks' adds a point of community.
- Shows inline in the recap; at most once every four weeks.
- Sender comes from partner, crew or the recurring coworkers idea.
- Balance: tiny, capped and only after a bad week, so it can't be farmed.

### i22-b24 One-thumb turn layout (S, 🟡)
Everything a normal turn needs (focus, evening chip, End Week) sits in the bottom third of Home on phones.
- CSS and layout in index.html and ui.js Home render; tested in the turn-budget test.
- Other Home cards move above or collapse.
- Balance: none.

### i22-b25 Sunday supper line (S, 🟡)
The recap's last line says who you ate Sunday supper with: the family, the crew at the café, a neighbor, or alone with the radio.
- Picked from household, community level and focus.
- Low community and no household gives 'alone' more often, a soft hint.
- Balance: flavor only.

### i22-b26 Weather by day in the recap (S, 🟡)
The recap shows a small Mon–Sun weather row for the week that was. If two or more days rained, an outdoor week says so and does a little less.
- Weather rolled per week from the month in seasonWeek(); stored in S.last.wx.
- Outdoors focus effect ×0.8 on a wet week; the forecast idea (i5-b01) can preview it.
- Balance: small and shown, so it isn't a hidden penalty.

### i22-b27 Commute shows up in the day notes (S, 🟡)
A long commute appears plainly: 'Tue: 68 miles, home at 7:10.' It makes the drive you chose visible every week.
- Day note template uses commuteOneWay() and the job's days.
- Pairs with the 'long commutes use up your evenings' fix.
- Balance: info only.

### i22-b28 One plain tweak after a hard week (S, 🟡)
After two rough weeks in a row, the recap ends with one plain suggestion: 'Two weeks of overtime and health is sliding. A Rest week would help.' It never changes anything for you.
- Small rule list in turn.js using recentF and stat deltas.
- Hidden in practice-off modes if assists are off.
- Balance: helps new players reach good play without helping idle play.

### i22-b29 Stack the week's sheets with a counter (S, 🟡)
When a week has a note, an event and a review, they show as one stack with '1 of 3' so you know how long the turn is.
- playWeeks() builds a queue; sheet() gets a small counter.
- Order stays: notes, event, review.
- Balance: pacing only.

### i22-b30 Evening options follow the town calendar (M, 🟡)
Some evenings come from what's on in town that week: a ballgame at the park, the every-other-week jam at the coffee shop, a council meeting.
- EVENINGS rows tagged with month or week rules, using stand-in business names.
- Town evenings give a little community instead of happiness.
- Balance: same 0.25 cap; only one evening a week.
