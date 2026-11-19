# Ideas round 8

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 8: Playtest of modes

Ideas from a fresh-eyes headless playtest of each mode: 6 months on Hard, 2 years Relaxed as a Farm kid, a Lifetime game through retirement and the grandkid handoff, every challenge, and the weekly challenge.

### i8-a01 Grandkid only after a life that ran its course (S, 🔴)
Bug: a 25-year-old who leaves town buried in debt (or taps End this life now) is offered "Continue as your grandkid", and an 18-year-old grandkid starts in the same year with $0. Offer the grandkid only after passing away at 60 or older, and move the date forward to fit.
- Found in play: a Lifetime life ended by debt at 25 with one baby offered the 🌳 button; the heir started in 2027, the same year.
- Fix in finish() (features.js): show 🌳 only when the ending is a death at 60+; otherwise offer "Start fresh" only.
- In startLegacy(), set the date to the parent's birth year + about 60 so the grandkid really is a grandkid.
- Balance: closes a way to restart a bad life with a reputation bonus (+15 community).

### i8-a02 "Not now" keeps the grandkid waiting (S, 🔴)
Tapping "Not now" on the grandkid sheet (or closing the app on the ending screen) loses the next generation forever, because the slot is already cleared. Keep a waiting grandkid in the slot so the title screen shows "🌳 Ann Lee's grandkid is ready" until you start or dismiss it.
- Today finish() writes null to the slot and keeps the parent only in memory.
- Write a small {legacy: parent} record to the slot instead; renderTitle() shows it with Start and Delete.
- Touches features.js (finish, legacySheet) and ui.js (renderTitle, slotCard).
- Balance: none; it only stops a lost choice.

### i8-a03 Retirees can't be "hired" into a job that never pays (M, 🔴)
Bug: after retiring, the Jobs tab still has Apply buttons, and a retiree who applies sees "You're hired!" but never gets a paycheck. Either hide Apply once retired, or let retirees take part-time work that really pays half wages on top of Social Security.
- Found in play: retired at 63, applied to farm hand, got hired, next week had no Paycheck line.
- weekTick() ignores the job when S.retired; renderJobs() still lists Apply.
- Simple fix: hide Apply and show "Retired" on the job board. Better: a "Part-time" tag, half pay, half stress, Social Security continues.
- Balance: part-time pay is small and adds wear, so it cannot beat a full career; sim checks Lifetime idle play stays under 50.

### i8-a04 Retiring asks first and marks the day (M, 🔴)
The Retire button sits under the job board and retires you in one tap with only a toast. Ask first with the numbers (Social Security + 401(k) per week against your take-home now), then show a short retirement moment.
- Today: one mis-tap ends a career for good, and there is no sheet, only "Happy retirement!" for two seconds.
- Confirm sheet: weekly income before and after, partner's pay, the house payment, and "You can't un-retire".
- From 62, a one-line card on Home says retirement is open, so players don't have to find it on Jobs.
- Touches ui.js (renderJobs, retire handler, renderHome). Balance: no change to money; it only adds a choice point.

### i8-a05 Live challenge progress with a deadline (M, 🔴)
Challenges show only their goal line, so you can't tell if you are on track. Add a progress line for each: debt left, average happiness so far against 55, down payment saved against the farmhouse price, and class weeks done against weeks left.
- In play the Lab challenge failed with 2 of 3 degrees after 5 years, and nothing warned that the class weeks no longer fit.
- Each SCENARIOS entry gets a progress() that returns text and an on-track flag; scenarioLine() shows it with "N weeks left".
- A warning note fires once when the goal becomes out of reach.
- Touches features.js (SCENARIOS, scenarioLine). Balance: information only.

### i8-a06 Job openings change week to week (M, 🔴)
Every job is always open, so 6 of 7 test lives took Airport ground crew in Pasco in week one, whatever the mode or background. Show a changing set of openings each week (some jobs closed for a while), with your current job always listed.
- renderJobs() shows a seeded subset: about 60% of jobs open each week, more in harvest and ski season, fewer on Hard.
- Weekly challenge lives use their own dice so everyone sees the same openings.
- Touches ui.js (renderJobs, apply), state.js (JOBS).
- Balance: careless play can't grab the best entry job on day one; good play plans around openings. Run the sim to keep good play at 70+.

### i8-a07 Lifetime "score so far" counts net worth against "by now" (S, 🟠)
In Lifetime the Life Score so far sat at 34-37 for the first ten years, even while net worth was on track, because it compares you to the $4 million end target. Score the wealth part against the on-track amount for your age while playing, and the full target only at the end.
- wealthTrack() already works out the "by now" amount; lifeScore() gets a soFar flag that uses it.
- The final score at the ending stays exactly as it is.
- Touches features.js (lifeScore, showScoreNow, scoreButton) and the report card line in turn.js.
- Balance: changes only the running number, not the end score or best scores.

### i8-a08 Retirement happiness needs a reason after the first years (S, 🟠)
Once retired, happiness drifts up every week and sat at 100 for 15 years in play while the player just skipped. Keep the boost for the first two years, then tie it to showing up for town, getting outside, family or a partner.
- turn.js: the retired +1 a week fades to 0 after 104 retired weeks unless that week's focus is Town, Outside or Rest with family at home.
- Year in review notes "a quiet year" in plain words when happiness slips.
- Balance: idle retirees no longer lift average happiness to the top; active retirees keep it.

### i8-a09 Events you've seen a lot come up less (M, 🟠)
In one Lifetime the same events came back again and again: Wine country weekend 27 times, Truck trouble 25, Music night 25, Neighbor's moving day 23. Each time you see an event, its odds drop for the next few years, so other events get a turn.
- pickEvent() multiplies weight by 0.8 for each time seen in the last 5 years (S.evSeen keeps turn numbers).
- Signature yearly events (Celebration Days, harvest) are left out.
- Touches events.js (pickEvent, EVENT_STATE).
- Balance: total event rate stays the same; only which event changes.

### i8-a10 A long marriage doesn't end on one coin flip (S, 🟠)
In play a 50-year marriage ended at 75 from "A rough patch" and a 50/50 coin flip. Make that event rarer and gentler the longer you have been together, and never a break-up after 30 years together.
- Track S.partnerSince when a partner joins.
- In events.js, "A rough patch" weight falls with years together; the "let it run its course" break-up chance drops from 50% to 10% after 10 years and 0 after 30.
- Balance: a partner is already worth about +0.6 happiness a week; this keeps late life from a random loss, not a big score change.

### i8-a11 The trip of a lifetime happens once (S, 🟡)
"The trip of a lifetime" came back every year, 12 times in one life, even after you booked it. After you book it, it is done; later you may get a smaller "Another trip?" now and then.
- events.js: Book it sets S.bigTrip; when() checks it.
- Add a lighter follow-up event with a different place each time.
- Balance: none; it costs $5,000 and gives +12 happiness once instead of repeatable.

### i8-a12 Farm kid lives at the family place at first (S, 🟠)
The Farm kid start says you were raised in the wheat hills and work the family farm, but you pay rent for a room above Main Street. Start them in a room at the family farmhouse for a small board payment until they move out.
- Add a non-buyable home "Your old room at the farm" ($200 a month, happiness +1) to HOMES, used only by the farm background.
- Moving out works as now from the Life tab.
- Touches state.js (BACKGROUNDS.farm, HOMES), ui.js (renderLife).
- Balance: saves about $80 a week early; the farm kid still starts with only $300. Board rises to $400 at 21 so it isn't a forever deal.

### i8-a13 Work events that fit a farm or a small shop (M, 🟠)
Working the family wheat farm, the farm kid got "New manager starts Monday", "Lunchroom potluck in the break room", "Employee of the month" and "A coworker retires after 30 years". Small workplaces get their own versions.
- Tag small jobs in JOBS (farmhand, diner, hardware store) with small:1.
- Work events read the tag: a new hand instead of a new manager, a harvest supper instead of a break-room potluck, the boss's thanks instead of a picture on the wall.
- Touches events.js and state.js. Balance: same effects, different words.

### i8-a14 Fix the raise wording (S, 🟡)
The raise event reads "Your boss at the wheat farm hand job calls you in." Use a short workplace name per job ("at the wheat farm", "at the diner", "at the rail yard").
- Add a short where field to each job in JOBS and use it in "A raise" and other work events.
- Touches state.js and events.js. Balance: words only.

### i8-a15 Farm kid can take over the family farm (L, 🟠)
A Farm kid life has a real family farm: in your late 20s or 30s your folks offer to hand it over. Say yes and you buy in at a family price and run a wheat business from the farmhouse; say no and they sell.
- A short story chain (features.js chain()) with 3 beats: helping at harvest, the talk at the kitchen table, the hand-over.
- Saying yes gives the farm home and a wheat business at a discount; uses the existing wheat business rules and good and bad years.
- Ties in the "Save the family farm" challenge.
- Balance: the buy-in costs most of your savings and wheat years swing, so it rewards planning, not idling.

### i8-a16 Relaxed says so when the debt floor catches you (S, 🟠)
On Relaxed, debt silently stops at -$40,000. When it happens, say so: a note that a debt counselor set up a payment plan, a Journal line, and a Home card with what to do next.
- turn.js: the clamp adds a note the first time and a log line.
- Home shows a small card while you are at the floor, with the weekly interest and a "Find better work" link.
- Balance: no change to the floor; it explains it.

### i8-a17 Hard makes the first job harder to land (S, 🟠)
On Hard, every test life was hired on its first application, the same as Normal. Lower the odds of getting hired on Hard by about 10 points, and say so in the mode description.
- ui.js apply(): p -= 0.1 when mode() is hard.
- MODES.hard.desc mentions it; the "Not this time" sheet says "Hard: jobs are harder to get".
- Balance: Hard should score lower than Normal for the same play; the sim checks good play on Hard still reaches the 60s.

### i8-a18 Challenge results and records judge the challenge (S, 🟠)
Winning "From the wheat to the lab" in play scored 46, "Getting By on Main Street", which reads like a loss. Lead the ending with the challenge result and how fast you did it, and keep your fastest win in Your records next to the Life Score.
- finish() puts the challenge card at the top with "done in N weeks".
- Records store sc-<id>-wk (fewest weeks) as well as the score.
- Touches features.js (finish) and ui.js (recordsSheet). Balance: none.

### i8-a19 Early win, then a stretch goal (S, 🟠)
In "Debt-free in 2 years" the debt was gone by week 30, then nothing for 74 weeks. When an end-only goal is met early, say so and offer a stretch goal (for example $10,000 saved), shown with a star at the end.
- scenarioWeek() notices the goal is met and shows a note once; SCENARIOS get an optional stretch test.
- The real goal still has to hold at the end.
- Balance: the stretch adds no score points, only a ⭐ on the challenge.

### i8-a20 Save the family farm gets a story (M, 🟡)
Today any farmhouse counts, and it is always for sale. Make it the family's farmhouse with a price that goes up each spring, a supper with the family each harvest, and a rival buyer in year four.
- Three or four once-only events in features.js tied to S.scenario === "farm".
- The farmhouse down payment rises 3% a year in this challenge.
- Balance: harder to win late, so the deadline matters.

### i8-a21 A briefing when a challenge starts (S, 🟡)
A challenge starts on the Jobs tab with the usual "find a job" toast. Open with a short briefing: the goal, the deadline, and one plain tip.
- features.js challengesSheet(): after newGame, show a sheet with the goal, the end date, and a one-line hint.
- Balance: none.

### i8-a22 Take a challenge on Hard (S, 🟡)
Challenges are always Normal mode. Let the player pick Hard for a challenge and earn a separate 🔥 check mark.
- A mode toggle in the challenges sheet; CHALLENGE_KEY stores {id: 1 or "hard"}.
- Records show ✅ and 🔥.
- Balance: Hard rules are already tested.

### i8-a23 A weekly finished after Monday still counts (S, 🟠)
Bug: a weekly challenge started on Sunday and finished after midnight saves its score under last week, and the next load deletes it. Keep each weekly score under its own week and show last week's result on the records sheet.
- pruneWeekly() keeps the current and the previous week.
- finish() says "Last week's challenge: saved as 2026-W47".
- Touches ui.js (pruneWeekly, recordsSheet). Balance: none.

### i8-a24 Your first weekly finish is the official one (S, 🟠)
The weekly challenge has fixed dice, so replaying it lets you learn every event in advance. Mark the first finish as your official score, and label later runs "replay".
- Store wk-<week>-first beside the best.
- Score card and records show "Official" and "Best replay".
- Balance: keeps comparing with friends fair.

### i8-a25 Weekly challenge starts in this real month (S, 🟡)
Every weekly challenge starts in January, so every week begins in winter. Start the weekly in the game month that matches the real month, so a November weekly starts in November.
- startWeekly(): set S.date to the first Monday of that month in 2027.
- Balance: the sim plays 12 start months to keep the 6-month target fair.

### i8-a26 Town goals with a new twist each year (S, 🟠)
Over one Lifetime the same four town goals came back with the same words about 30 times each. Give each season 3 versions (for example: help a neighbor's harvest crew, drive a grain truck, feed the crews) that rotate by year.
- SEASON_GOALS get a variants list with their own name, done text and focus.
- seasonId() picks the version by year.
- Touches state.js. Balance: same need and rewards.

### i8-a27 Road events match the road you drive (S, 🟡)
"A free college lecture in Walla Walla" came up 13-16 times for a player driving to Pasco and Richland. Give road events a town and only use them on that road.
- Road events get a town in when() (roadTown() === "wallawalla").
- Add one or two Pasco and Richland stand-ins.
- Touches events.js. Balance: same event rate.

### i8-a28 The grandkid sheet shows what comes down (S, 🟡)
The grandkid sheet says "part of the family's savings" but not how much. Show the amount (and in 2027 dollars), the town standing they start with, and what does not carry over (house, truck, skills).
- legacySheet() works out the same numbers startLegacy() uses.
- Touches features.js. Balance: none.

## Ideas 8: Work life up close

What a working week feels like in The Burg: bosses and coworkers with names, shifts and schedules, benefits you can use, leaving well, starting over, seasonal rhythms, working for yourself and work that fits around kids.

### i8-b01 A named boss at every job (M, 🔴)
Every job gets a boss drawn from a name list when you're hired: name, style, and a small mood number saved in S.work.
Events J1, J2, J8, J11 and J24 read the boss's style for their text and odds; a stickler is harder to please but fairer at review time.
Touches events.js (JOB_GROUP work events), state.js (S.work, migrate), ui.js (Jobs card line).
Balance: mood moves a few points per event, so it shades odds rather than handing out raises. Builds on i1-a01 standing; doesn't replace it.

### i8-b02 Two regular coworkers who keep turning up (M, 🟠)
Two coworker names per job, saved with the job, used in J4, J10, J19, J23, J30 instead of 'a coworker'.
Help the work friend enough times and they move to your friends list; the sore spot can soften or leave.
Touches events.js, state.js (S.work.crew), outabout.js (a coworker sometimes at the same place).
Balance: favors cost time or money; the payoff is happiness and a little community, not pay.

### i8-b03 A week in the life: a card for each job (S, 🔴)
One short data block per job group plus a line or two per job ("12-hour shifts, 3 a week", "crush runs Sep to Oct").
Shown in the job detail sheet next to pay, drive and stress.
Touches state.js (JOBS text), ui.js (job sheet), help.js.
Balance: information only. Helps good players pick well without changing any numbers.

### i8-b04 Pick your shift: days, swing or nights (M, 🔴)
S.shift on the job; office jobs are days only.
Nights: +12% pay, -1 health a week, kid and partner weekly lift halved. Swing: +6% pay, no Show up for town bonus on weeknights.
Touches state.js, turn.js (weekTick pay and family lift), ui.js (Jobs card picker).
Balance: the pay bump is smaller than the health and family cost over a year, so grinding nights doesn't beat good play.

### i8-b05 Hospital rhythm: three 12-hour shifts a week (S, 🟠)
Care-group jobs get a 'long shifts' flag: +1 out-and-about visit slot a week, -0.5 health a week.
Work extra hours means a fourth shift, not 20% more of the same.
Touches state.js (JOBS flags), outabout.js (visit slots), turn.js.
Balance: the extra visit costs money to use, and the health drag shows up for careless play.

### i8-b06 On-call weeks for nurses, mechanics and trades (S, 🟡)
RN, imaging, mechanic and trades apprentice get an on-call week every fourth week, shown on Home.
If the call comes (about 40%), the focus gives half its happiness and you earn a call-out bonus.
Touches turn.js, events.js (one small call-out card), ui.js.
Balance: roughly money-neutral over a month; it trades calm for cash.

### i8-b07 Your work week on Home: a shift strip (S, 🔴)
Seven little cells under the job line: work, off, on-call, night, school hours.
Reads job, shift and flags; no new rules of its own.
Touches ui.js (Home card), styles in index.html.
Balance: display only.

### i8-b08 The schedule goes up late: service-job weekends (S, 🟡)
A weekly roll for service jobs: 'You work Saturday' chip on Home.
Trading the shift costs a favor with a coworker, or skip the weekend event.
Touches turn.js, outabout.js (weekend events check), events.js.
Balance: small friction for low-pay jobs; good play learns to trade shifts on the weekends that matter.

### i8-b09 Tips at the bar, the café and the diner (S, 🟠)
A weekly tip amount: base x (1 + People level x 0.1) x a small random factor, bigger in rush weeks.
Shown as its own line in the week summary so you see it.
Touches turn.js (pay), outabout.js (diner, barista), features.js (skills).
Balance: tips cap at about 15% of pay, so the low-pay jobs stay low-pay unless you invest in people.

### i8-b10 Rush weeks: Black Friday, Celebration Days, the holidays (S, 🟡)
Fixed weeks per job: mall retail on Black Friday and December, Main Street jobs on Celebration Days, grocer before Thanksgiving.
Pay +25% that week, stress up, and Rest is weaker.
Touches turn.js, events.js (one rush card per job group).
Balance: forced, not chosen, so it can't be farmed.

### i8-b11 Paid time off you can actually use (M, 🔴)
Each job gets a pto rate (0 to 3 days a month); S.pto banks it, up to 30 days.
Using a week costs 5 days and keeps full pay for a Rest, Get outside or family week.
Touches state.js (JOBS), turn.js, ui.js (Life tab focus shows 'use PTO'), help.js.
Balance: it smooths good play; idle play doesn't gain since PTO only replaces pay you'd have earned anyway. Doesn't repeat J29 or pensions.

### i8-b12 Sick week: call in or push through (S, 🟠)
Fires when health < 35 and you have a job, with a cooldown.
Push through: 30% chance of a second sick week and a boss mood hit.
Touches events.js (work events), turn.js.
Balance: careless play that ignores health pays twice.

### i8-b13 Benefits at a glance on every job (S, 🟠)
Icons with words: 🏥 health, 🌴 PTO, 💰 match, ✊ union.
Ties the existing 401k match, J29 health plan and PTO into one view.
Touches state.js (JOBS data), ui.js (job list and sheet).
Balance: information only.

### i8-b14 Quit well: give notice or walk out (S, 🔴)
Notice: you keep working the old job two more weeks, then switch; job marked 'rehire OK'.
Walk out: no notice, -boss mood to the floor, that employer closed for 104 weeks.
Touches ui.js (job switch flow), state.js (S.jobPast with terms).
Balance: walking out is only worth it in a real emergency; careless job-hopping costs future options.

### i8-b15 Old bosses can hire you back (S, 🟠)
Reads S.jobPast; rehire skips any new-hire dip and keeps old standing.
Offer lasts five years, then the boss retires.
Touches ui.js (Jobs list), state.js.
Balance: rewards leaving well, not leaving often.

### i8-b16 A send-off on your last day (S, 🟡)
One small event on switching; adds the work friend to your friends.
Text changes by job group (cake in the break room, beers at the bar, a card signed by the whole floor).
Touches events.js, ui.js.
Balance: happiness only.

### i8-b17 Starting over: the first-year dip in a new field (M, 🟠)
Changing job group (field to care, say) sets a trainee flag: 90% pay for 13 weeks, J11 odds up.
Same-group moves skip the dip.
Touches ui.js (switch flow and 'what you give up' line), turn.js, features.js (badges).
Balance: makes frequent job-hopping cost something; a planned change still pays off in a year.

### i8-b18 A late-start career: become a nurse at 40 (L, 🟡)
A chain (chains.js style) that starts from an event after age 35 with a job you've had 5+ years.
Each step is a choice: keep going, pause, or quit the program.
Touches features.js (chains), events.js, the education system in state.js.
Balance: it's a long cost before the payoff; good for a strong mid-game, slow for idle play.

### i8-b19 Burnout and a leave of absence (M, 🟠)
A burnout counter from stress and Work extra hours; warning card at a threshold.
Leave: no pay, job held, big health and happiness recovery; ignoring it leads to a forced week off and a boss hit.
Touches turn.js, events.js, ui.js (Home warning).
Balance: punishes the overtime grind that careless play leans on.

### i8-b20 School-hours jobs (M, 🔴)
A 'school hours' flag on a few Waitsburg jobs; waives the $200 childcare and boosts the kid lift.
Shows as a 🎒 tag on the Jobs tab when you have kids.
Touches state.js (JOBS, childcare in kid costs), turn.js, ui.js.
Balance: those jobs pay less, so it's a real trade, not a free bonus.

### i8-b21 Part-time hours (M, 🟠)
S.partTime on the job; pay and stress scale; benefits row greys out.
Can switch back to full time after 13 weeks.
Touches state.js, turn.js, ui.js (Jobs card toggle).
Balance: money drops more than mood rises for players without kids; idle players can't sit part-time and score high.

### i8-b22 Summer break with kids at home (S, 🟠)
A June card for parents with a job and school-age kids.
Options cost money, community favors or happiness; one picks up the Outdoors or Handy skill for the kid.
Touches events.js, features.js (family).
Balance: costs land on everyone with kids; good planning keeps them small.

### i8-b23 Snow day scramble (S, 🟡)
Dec to Feb, parents with jobs and kids under 13.
Bringing them works only at local places; calling a neighbor uses a favor.
Touches events.js, outabout.js (local job check).
Balance: small, one day's worth of cost either way.

### i8-b24 Go solo in your trade (M, 🟠)
A 'self-employed' version of the job: pay = base x standing factor x a monthly swing; no PTO, no match.
You buy your own health plan each January.
Touches state.js, turn.js, ui.js (Jobs), features.js (skills).
Balance: higher ceiling only with high community and skill; low-standing players earn less than the job.

### i8-b25 Quarterly taxes when you work for yourself (S, 🟡)
Due weeks in Apr, Jun, Sep, Jan; a reminder card a week before.
Paid from cash; skip adds 10% next April.
Touches turn.js, features.js (biz), ui.js (Money tab).
Balance: a planning test that careless play fails.

### i8-b26 The farm year for farm hands (S, 🟠)
Monthly hours and wear by season: Jan–Feb 70% pay, Jul–Aug 130% pay with more wear.
A line on Home says what's happening on the farm this month.
Touches state.js (JOBS), turn.js, events.js (one card per season).
Balance: the year averages out to the same pay; it adds rhythm, not money.

### i8-b27 Wine crush as a season with a finish line (S, 🟠)
Builds on J25: weeks 1–6 tracked, pay +30%, health drag.
Finish all six and you get the party and a keepsake bottle.
Touches events.js, turn.js, features.js (keepsakes if built).
Balance: forced season for one job; the reward is mostly a keepsake and happiness.

### i8-b28 Road weeks for truck drivers (S, 🟡)
About one in six weeks is a road week; you can turn some down at a pay cost.
Away weeks block Rest and Show up for town and cut family lift.
Touches turn.js, events.js, ui.js (shift strip).
Balance: pay bump roughly equals the lost family and community gains.

### i8-b29 A signature week for each Main Street job (M, 🟠)
Seven small events tied to place ids (bean, basket, bank, trades, clinic, mcgrub, tattler).
Each gives a choice that leans on a skill or community.
Touches outabout.js (OUT_EVENTS), events.js.
Balance: upside mostly community and happiness; these jobs stay lower pay.

### i8-b30 Pick a beat at the Tattler (S, 🟡)
S.work.beat; filters which reporter events can fire.
Council beat ties into the council seat; farm beat into wheat prices.
Touches outabout.js, events.js.
Balance: flavor; no beat pays more.

### i8-b31 Main Street jobs know everybody (S, 🟠)
+0.3 community a week for Waitsburg-place jobs; an early 'heard at work' line in the Journal.
Pairs with the lower pay of those jobs.
Touches turn.js, outabout.js (place jobs), ui.js (Journal).
Balance: small and steady; doesn't beat Show up for town.

### i8-b32 Talk of a union in the break room (M, 🟡)
A three-step chain for field and service jobs; outcome odds depend on how many coworkers you're close to.
Win: +5% pay and PTO; lose: boss mood down for a year.
Touches events.js, features.js (chains). Builds on i3-a10 union cards.
Balance: a gamble with modest upside, so it can't be farmed.

### i8-b33 Laid off? Retraining money for a new field (S, 🟡)
Hooks into the layoff event: a follow-up card with a tuition voucher for one program.
Only for switching job group; expires in 26 weeks.
Touches events.js (layoff), state.js (study system).
Balance: softens bad luck without rewarding idle play; you still have to study.

### i8-b34 Job group tags for every work rule (S, 🔴)
Move JOB_GROUP out of events.js into state.js next to JOBS, add fields for shifts, pto, school hours, tips.
Tests check every job has every field.
Touches state.js, events.js, outabout.js, tests.
Balance: none by itself; it keeps later work-life rules consistent.
