# Ideas round 58

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 58: Your own goals and plans

Ways to let players write their own plans, bucket lists and promises, have the game notice what they keep or break, and look back at the plan against the life at the end, all without big score swings.

### i58-a01 The five-year plan: three lines you write at the start (M, 🔴)
On a 5-year or Lifetime start, a short sheet asks for three plan lines picked from plain choices (money, work, home, people, town), like 'Own a house by 30' or 'Be on a first-name basis with Main Street'. They show on the Life tab and never add score; they shape story, check-ins and the ending.
New S.plan array (line id, picked week, why) set in a sheet after newGame() in js/ui.js; card on Life in js/features.js next to goalsCard().
Line templates live in one PLAN_LINES table with a test() each, like BADGES.
Balance: zero score points. It changes what the game says, not the Life Score, so careless or idle play gains nothing.

### i58-a02 Plan lines check themselves: on track, behind, done (S, 🔴)
Each plan line shows a small state word on the Life tab (on track, behind, done, let go), worked out from the same game data the badges use. A line that needs a pace, like savings, shows the pace it needs per week.
A planState(line) helper in js/features.js reads netWorth(), S.homeId, S.edu, S.community and so on.
Shows a pace line only for money and school lines ('About $90/wk keeps you on track').
Balance: read-only info.

### i58-a03 The first-of-the-month check-in (S, 🔴)
The first End Week of each month opens one short card if you have plans or promises: each line with its state and one tap to keep, tweak or let go. It is skippable and never stops a multi-week skip twice in a row.
Hook in weekTick() in js/turn.js beside seasonWeek(); returns a note like the year-in-review does.
A 'Quiet check-ins' toggle in the menu turns it into a Journal line only.
Balance: no stat change from the card itself.

### i58-a04 Let a goal go, on purpose (S, 🔴)
Any plan line, bucket item or promise to yourself can be crossed out with a reason (money got tight, changed my mind, life changed). Letting go on purpose costs nothing; a line that just lapses past its date gives a small happiness dip and a Journal line.
S.plan line gets status 'dropped' plus reason; the Life card shows it struck through.
Lapse check runs in the monthly check-in (js/turn.js).
Balance: lapse dip is -2 happiness at most once per line, so writing many goals and ignoring them is a small loss, not a big one.

### i58-a05 A hard year pauses the plan (S, 🟠)
After a layoff, a hospital stay, a death in the family or a disaster year, the game offers to put every dated goal on hold for six months. The dates move back and nothing counts as broken.
Hooks where those events already log (layoff in js/turn.js, hospital and grief events in js/events.js) set S.planHold = turn + 26.
Check-ins skip while on hold.
Balance: protects unlucky good play from double punishment; no upside for careless play since it gives no points.

### i58-a06 Why it matters: one reason on each goal (S, 🟠)
When you write a goal you pick why: for the kids, for me, to prove something, for the town, because Dad never could. The reason shows on the Life tab and changes the lines the game writes when you keep or break it.
Reason is one of five ids on the plan line; say()-style line tables in js/features.js per reason.
Ending and check-in text read it.
Balance: words only.

### i58-a07 A realistic check when you write a goal (S, 🟠)
Before you save a money or school goal, the sheet shows what it takes at today's pay ('$4,000 by next June is about $85 a week; your last month averaged $40'). You can keep it anyway.
Uses S.last and the run history from js/turn.js; for school uses STUDY_NEED and TUITION from js/state.js.
Balance: info only; helps good play plan, gives careless play nothing.

### i58-a08 The Waitsburg bucket list: pick five from the valley (M, 🔴)
A list of about 25 local things (opening day on the Touchet, the Celebration Days parade, the top of Bluewood, the county fair in Dayton, a sunset at Lewis and Clark Trail park, a night at the hydroplane races). Pick up to five for this life; each is checked off when you actually do it.
BUCKET table in js/features.js; each item names the event title, outabout stop id or trip stop that ticks it.
Tick happens in the existing event, visit and trip code paths (js/events.js, js/outabout.js, js/features.js tripWeek).
Balance: each item gives a one-time +2 to +4 happiness, nothing to money; idle play never travels or visits, so it ticks none.

### i58-a09 Bucket list items wave at you when they're in reach (S, 🟠)
When a picked bucket item can happen this week (it's August and the fair is on, or a trip stop is open), the Out and about card and the trip planner show a small ✏️ chip on it.
A bucketReady() check used by js/outabout.js and the trip sheet in js/features.js.
Balance: a nudge, not a reward.

### i58-a10 A bucket list for the second half (S, 🟠)
At 55, the game offers a short later-life bucket list: teach a grandkid to fish, ride the Blue Mountain loop one more time, sit in the front row at the high school graduation, see the coast with your partner. Same tick rules.
Extra rows in BUCKET with minAge; offered by the decade birthday code in js/turn.js.
Balance: small happiness only; gives late Lifetime weeks something to do without new score.

### i58-a11 Unfinished bucket items pass down (S, 🟡)
In legacy mode, the grandkid finds the items you never got to on a list in a drawer. They can adopt any of them, and finishing one adds a line to the family story ('Finally made it up Bluewood, like Grandpa always said he would').
Copy unticked BUCKET ids into the heir's start in the legacy code in js/features.js; mark them inherited.
Balance: same small happiness as any bucket item; nothing carries in money.

### i58-a12 Promise the kids something, out loud (M, 🔴)
From the household rows on the Life tab, make a promise to a kid: be at every game this season, a summer trip to the coast, home for supper on weeknights, help with the 4-H lamb. The game tracks it against your focus and trips and says when it's kept or broken.
S.promises array (who, what, until, test); tests read S.focus history (recentF), trips and events.
'Home for supper' fails on any Work extra week in its window.
Balance: kept gives family warmth and +3 happiness; broken costs -3 and a line the kid remembers. Never money, never score.

### i58-a13 Promises to your partner: a joint plan (M, 🟠)
Make one plan with your partner, like 'Pay off the truck before the wedding' or 'Move closer to their folks in Dayton'. It shows on both your Life tab and the partner row, and keeping it lifts partner closeness.
Partner state in js/events.js gets S.partner.plan; check-in and test like plan lines.
Balance: closeness and happiness only; the partner's mood already matters, so this adds story without a new lever.

### i58-a14 A promise to Mom you inherit (M, 🟠)
When an aging parent event comes up, they may ask for a promise: keep the farmhouse in the family, look after your brother, scatter the ashes at the Touchet. Saying yes makes a long promise the game remembers for years.
New event in js/events.js (needs a parent; age 40+); sets a long-lived promise with a test (keeps home id, visits) and a reminder each decade birthday.
Balance: optional; keeping the farmhouse can cost money, so it's a real trade, not a free bonus.

### i58-a15 Kept promises outweigh kept goals (S, 🟠)
Promises to other people matter more than goals for yourself: broken promises to family hit harder, and kept ones show up in how people treat you. Goals for yourself only change your own happiness a little.
One weights table in js/features.js: self goals ±2, promises ±3 plus closeness.
A test checks no single kept goal or promise moves happiness more than 4.
Balance: keeps goals as story, not a score engine.

### i58-a16 Say it out loud: tell someone your goal (M, 🟠)
When you set a goal, you can tell no one, tell your partner, tell a friend at the café, or let the Tattler print it. Telling people brings a little help (a job tip, a ride, a kind word) and a little pressure: they ask how it's going.
Visibility flag on the plan line; helper events in js/events.js ('Your friend heard about the truck fund and has a lead on a used one').
Broken public goals get a gentle Tattler line, never mockery.
Balance: help is small and once; the pressure is only text.

### i58-a17 A resolution buddy at the morning walking group (S, 🟡)
In January, a neighbor from the walking group offers to keep resolutions together. Each month you see how both of you are doing, and if one of you slips the other can pull them back once.
Builds on i4-a16 (New Year's resolutions); a buddy NPC in js/events.js with their own simple chance to keep or break.
Balance: one 'pull back' rescue per year; happiness only.

### i58-a18 Quitter's Day: the second Friday in January (S, 🟡)
The week most people drop their resolutions gets a light event: the gym in Walla Walla is half empty, the pastor jokes about it, and you choose to recommit, shrink the goal, or let it go with no shame.
Event in js/events.js gated on the second week of January and an active resolution (i4-a16).
Shrink swaps the goal for an easier one with the same reason.
Balance: words and a choice; no stat swing.

### i58-a19 Career target with a date and a boss who knows (M, 🟠)
Pick a job on the Jobs tab as 'the one I'm aiming for' and a year. The Jobs tab marks the gap (school, town, experience) and, if you tell your boss, the yearly review says how you're tracking.
S.careerAim {jobId, by}; reuses job gates in js/ui.js Jobs list; review text where raises happen in js/turn.js.
Balance: no pay bonus; the boss line is flavor and a small chance of a training tip.

### i58-a20 The game notices when you drift (S, 🔴)
When a big choice cuts against a plan line, the Journal says so once, plainly: 'You planned to save for a down payment. You bought a bass boat.' No penalty, just a mirror.
A planClash(action) check called from the buy, quit, move and trip code paths (js/ui.js, js/features.js).
One line per clash kind per year so it never nags.
Balance: text only.

### i58-a21 Small steps: a Journal line at a quarter, half and three-quarters (S, 🟡)
Money, school and streak goals log a short line as you pass 25%, 50% and 75%, so a long goal feels like it's moving.
planState() reports a fraction; log() with kind 'goal' when a step is crossed.
Balance: text only.

### i58-a22 A Goals filter in the Journal (S, 🟡)
The Journal gets a 🎯 chip that shows only goal lines: set, steps, kept, broken, let go and why.
logKind() in js/state.js learns the 'goal' kind; chip beside the existing filters in js/ui.js renderLog().
Balance: none.

### i58-a23 Plans in the year in review (S, 🟠)
The year-in-review sheet gets a short 'Your plan' section: what moved, what's done, what's behind, and one choice to keep the plan or rewrite one line.
Add to showReview() in js/turn.js; reads S.plan.
Rewrite keeps the old line in history (struck through) for the ending.
Balance: none.

### i58-a24 Goals sized to the game length (S, 🟠)
A 6-month life gets a season list (two small goals), a 1-year life a year list (three), 5-year a five-year plan, Lifetime a plan per decade. The sheet only offers lines that can be done in the time.
PLAN_LINES rows carry minWeeks; filtered by LENGTHS in js/state.js.
Balance: stops impossible goals in short games and silly-easy ones in long ones.

### i58-a25 Life-stage suggestions on the plan sheet (S, 🟡)
The plan sheet puts three suggestions on top that fit your age and life: at 22, 'Finish the trade certificate'; at 38 with kids, 'Get the oldest through school without new debt'; at 60, 'Have the house paid off'.
A suggest() helper in js/features.js reads age(), kidsAtHome(), S.edu, S.homeId.
Any line can still be picked.
Balance: none.

### i58-a26 When two plans pull against each other (M, 🟡)
If your plan says 'Move to Walla Walla for work' and your partner's says 'Stay near my folks', a kitchen-table event asks you to pick: one wins, you split the difference (a job in Walla Walla, a house in Waitsburg), or you shelve both for a year.
Event in js/events.js triggered by clashing plan tags (move/stay, spend/save).
Balance: the compromise costs commute time, not points; nothing here moves the score.

### i58-a27 Help your kid toward their goal (M, 🟠)
A teen picks a goal (make varsity, save for a first car, get into WSU). You can drive them to practice, match their savings, or let them do it alone, and the outcome shows up in their epilogue line.
Kid goal on each kid record when they turn 14 (js/events.js kid stages); your choices are focus and money choices.
Balance: matching savings costs real money; the reward is family story and small happiness.

### i58-a28 Plan vs. what happened: the end-screen page (M, 🔴)
The ending gets a page with two columns: what you planned (with the reasons and any rewrites) and what actually happened, with a plain line under each: kept, changed, let go, broken, or 'didn't plan it, mattered most'.
New section in the end screen in js/features.js after the score table; reads S.plan history, promises and bucket ticks.
Balance: no score; it's the payoff for using the plan at all.

### i58-a29 What you didn't plan that mattered most (S, 🟠)
At the end, the game picks the two or three unplanned things that moved happiness or community the most (the dog you kept, the friend from the fire crew, the year you coached) and puts them beside the plan.
Uses Journal milestones and the yearly review deltas; pick by biggest happiness or community change.
Balance: none.

### i58-a30 Plans in the Tattler obituary and the shelf (S, 🟡)
The end-of-life Tattler piece mentions one kept promise and one bucket item ('She made it up Bluewood at 71'), and the shelf of lives shows a 🎯 count of plans kept.
Feed plan results into the end text and the saved life summary (js/features.js, js/ui.js records).
Balance: none.

### i58-a31 Guard test: goals never move the score (S, 🔴)
A test plays lives with many goals kept, many broken and none set, and fails if the Life Score medians differ by more than 2 points, or if idle play with goals passes 50.
Add a case to the balance sim in tools/ and tests/; bots set goals at the start and play their usual way.
Balance: this is the balance guard for the whole group.

### i58-a32 A goal bot in the balance sim (M, 🟠)
The sim gets a 'planner' bot that writes a plan and plays toward it. It must land in the same score band as the good-play bot (70+), proving plans help play feel purposeful without being a cheat.
New strategy in the sim in tools/; picks lines and leans focus toward them.
Balance: watch that careless median stays <= 60 and idle <= 50 with plans on.

## Ideas 58: Playtest as three people

Three headless phone playtests (a Waitsburg retiree, a busy parent with five minutes, and a strategy fan hunting the best build), with what each tripped on and what they asked for.

### i58-b01 [Retiree] Phone Back closes the open sheet, not the game (S, 🔴)
On Android (and the APK), Back with an event, score sheet or Help open now leaves the game. Back should close the sheet or Help first, and only leave from a bare Home screen.
Seen: with the Life Score sheet open, Back went straight off the page (no popstate handling anywhere in js/).
Push one history entry when sheet() or Help opens; on popstate call closeSheet() / closeHelp(). An event sheet stays open (it needs an answer) and just shakes.
Files: ui.js (sheet, closeSheet), help.js (openHelp, closeHelp), boot.js.
Balance: none. Also stops a stray Back from dodging an event while i22-a01 is still open.

### i58-b02 [Strategist] Multi-week event money pays out week by week (S, 🔴)
The cheaper health plan drops $480 in your pocket on day one, and light duty takes $464 at once. Pay them as weekly lines instead, so quitting or retiring in February can't keep a year of savings.
Seen: "Cheaper plan (+$40/month)" pays +$480 the week you pick it (events.js, Health plan choice); "Light duty for 4 weeks (-$464)" is one lump.
Store S.healthPlan.save and a light-duty end week; weekTick adds "Health plan savings" and "Light duty" lines only while you hold the job.
The event sheet keeps the same words; the money strip shows the line each week.
Balance: closes a strategist exploit (take the $480, then quit or retire). Careless and idle play lose nothing they earned.

### i58-b03 [Strategist] A trip every week stops beating a balanced life (M, 🔴)
In the balance report the tripper bot (a trip every week) scores 79 in 2-year games with $28,000 net worth, above the planner's 76 with $112,000, and its Lifetime game ends in debt. Make back-to-back trips wear thin.
A "road-weary" factor in tripWeek (features.js): each trip in the last 4 weeks cuts the next trip's happiness and health by a quarter, shown as "4th trip in a month: less special".
Help's Trips page says one or two trips a month is the sweet spot.
sim.test.mjs: fail when any one-trick bot (tripper, homebody) beats the planner's median by 3+ points.
Balance: brings the tripper under the planner; planners already trip monthly and lose nothing.

### i58-b04 [Retiree] Stat bars stay in sight after you scroll (S, 🟠)
After End Week, Home stays scrolled to the focus grid, so the four stat bars sit off screen and a new player never sees them move. Show four thin bars in the header once the stat card scrolls away.
Seen at 390 × 844: Home scrolls 443 px, End Week keeps that spot, and the stat card is hidden every week.
An IntersectionObserver on the stat card toggles a slim 😊 ❤️ 🤝 bar row under the date line in the header. Tapping it scrolls back up.
Files: ui.js (render, header), index.html (styles). Screens test: the header must stay under its height limit at 320 px.
Balance: none.

### i58-b05 [Retiree] The event's 📍 line opens that spot on the map (S, 🟠)
"📍 Bluewood ski area · on the region map" looks like a link but is plain text. After you answer, make it a button that opens the map on that pin.
Seen: the place line is a <p class="evplace">; a first-time player tapped it and nothing happened.
On the result sheet, show "🗺️ See it on the map": closes the sheet, switches Home or Jobs to the map and selects the pin (maps.js already places evPins).
Before you answer it stays plain text, so it can't pull you away from a choice.
Balance: none.

### i58-b06 [Retiree] Coming home at 55: an older start for Lifetime (M, 🟠)
Every start is 18 to 21. Add a start for players who want a life like theirs: back in Waitsburg at 55 with some savings, a paid-down fixer, an old truck and friends in town, with retirement in sight.
BACKGROUNDS in state.js: age 55, $18,000, fixer with half its equity, community 50, health 66, a few years' 401(k).
Lifetime only. The net-worth target scales with the years left (LENGTHS.life target × years left / 62), so it is graded fairly.
Events already age-gate; the Help "How your life begins" list gets one more line.
Balance: add a planner, careless and idle game for it to the sim's background table; careless must stay at or under 60.

### i58-b07 [Parent] The big red button isn't always the one that costs money (S, 🟠)
The first choice of every event is styled as the main button, and it is usually the spending one: Hit the slopes (-$75), Buy the pass (-$307), Light duty (-$464), Take it home. Tired players tap the red one.
Seen: a busy-parent run that took the first choice spent about $1,300 in a year on choices it never weighed.
In showEvent (events.js), style every choice the same (ghost), or give the main style to the choice an event marks safe:true.
Keeps the order, so muscle memory and tests still work.
Balance: careless taps stop leaning toward spending; nothing changes for players who read.

### i58-b08 [Parent] End Week shows how many weeks in a row (S, 🟠)
The rut is invisible until week 9. Show the streak on the End Week button ("Rest · week 6 in a row") and fade its color from week 5, when the focus starts losing its punch.
Seen: a parent on Auto played Rest for 50 weeks straight; happiness fell from 64 to 23 with one rut note.
ui.js End Week label reads S.streakF and S.streakN, with focusEffect() for the fade (full until 4, then dimmer).
Screen readers hear "week 6 in a row, losing effect".
Balance: helps attentive play only; idle play still ruts.

### i58-b09 [Strategist] The score-so-far sheet shows each part's scale (S, 🟠)
In-game, "Happiness average 60 → 50/100" looks like a bug. The end screen already explains "30 → 0, 90 → 100". Show the same scales on the score-so-far sheet.
Seen: the 5-year score sheet in week 1 shows the 50/100 and 69/100 conversions with no scale.
Reuse the end screen's part() helper from finish() in the Home score sheet (features.js).
Also mark "now" for community (it counts where you end) next to "average" for the others.
Balance: none.

### i58-b10 [Strategist] What a change is worth, on the score sheet (M, 🟠)
Strategy players want to know where the next point comes from. Under the score breakdown, list what each change would add right now: "+5 average happiness from here = +1 point", "+10 community = +2.5", "+$10,000 = +0.8".
Computed from lifeScore() with the weeks left: averages are diluted by weeks already played, so the list changes as the game goes.
Four rows, sorted by points per week of effort for this length. No advice text, just the numbers.
Files: features.js (lifeScore, score sheet). A rules test checks the rows add up.
Balance: information only; it rewards planning, not idling.

### i58-b11 [Strategist] Sort the job board by "best for your life" (S, 🟠)
The board sorts by take-home, so Pasco and Kennewick jobs sit on top. The sim's commuter scores 55 in 2-year and 5-year games, below careless play. Add a sort that weighs the drive's toll.
Seen: a new player and a busy parent both took the top row (Pasco airport, 58 mi); one lost 41 happiness in a year.
Toggle "💵 Take-home / 🌾 Best for your life". The second sorts by take-home minus a dollar value for commute happiness and job stress (same numbers weekTick uses).
Files: ui.js (jobs list, jobRow), state.js (a small helper). Remembered like the List/Map toggle.
Balance: steers new players from a trap build; careless bots don't read sorts.

### i58-b12 [Parent] Auto answers small events the way you did last time (M, 🟠)
A year of Auto stopped 14 times, mostly for small things (a train crossing, a Friday game, a moving day). Let Auto reuse your last answer to a small event you've already seen.
Small = an event tagged minor (money under $50, stat changes under 4). Store S.lastAnswer[title] when you choose.
During skips, a seen minor event resolves with that answer and lands in the "What happened" list. Big events still stop.
A Menu switch "Auto asks me every time" turns it off.
Balance: only your own past answers; careless bots gain nothing, and first-time events still stop.

### i58-b13 [Retiree] A first life's job board opens on Waitsburg and Dayton (S, 🟠)
A first-time player lands on 25 jobs, with Tri-Cities jobs on top. In a first life, open on "Close to home" (Waitsburg and Dayton), with All towns one tap away.
Seen: a retiree read the list top to bottom and asked where the town jobs were.
jobCity defaults to a new "near" filter when no finished life is on record; the filter chip row gets a "Close to home" chip.
Files: ui.js (jobCity, chips). Tutorial and tests that tap "All towns" keep working.
Balance: nudges toward the homebody path (79 in the sim) and away from the commuter trap.

### i58-b14 [Strategist] Side hustle stops being a trap build (M, 🟠)
The sim's hustler scores 55 in 2-year games, one point under careless play, and 53 in a Lifetime. A player who grinds hustles is punished for trying. Let experience ease the toll.
After 20 hustle weeks the -1 health and -1 happiness ease to -0.5; at 40 weeks a "regular clients" gig pays a steady base in the off-season.
Files: state.js (FOCUS.hustle, GIGS), turn.js (hustle line). Help's side-hustle page names the milestones.
Balance: target hustler within 8 points of the planner, careless still at or under 60 (hustle needs repeated choice, which careless play doesn't do).

### i58-b15 [Retiree] Week one says "Just moved in", not "Tumbleweed" (S, 🟡)
In week 1 the Home card calls you a Tumbleweed before you have done anything, which stings for a new player. Show "Just moved in" as the title for the first 4 weeks.
The number still shows; only the title waits. Week 5 on, the normal titles return.
Files: features.js (lifeScore title, the Home score card).
Balance: none; the score itself doesn't change.

### i58-b16 [Retiree] Choices without a price say what they cost you (S, 🟡)
Next to "-$464" and "-$121", choices like "Push through", "Call a buddy" or "Wait" read as free. Give every unpriced choice a short tag: "free", "costs some health" or "a gamble".
A small cost hint field on each choice in events.js; showEvent prints it in muted text under the label.
A test checks every choice has either a price or a hint.
Balance: says the kind of cost, not the odds, so it doesn't hand out free answers.

### i58-b17 [Retiree] Result chips read as words for screen readers (S, 🟡)
An event result's chips run together in the text ("-$76Happiness +7Health +2"). Give each chip a spoken label and a separator so it reads "Happiness up 7, health up 2".
deltaChips() and the result sheet in events.js: an aria-label per chip plus a visually hidden comma.
The screens test reads the result's text and fails on joined words.
Balance: none.

### i58-b18 [Parent] Fun events ask who watches the kid (S, 🟡)
A young parent gets the same powder days, wine weekends and season passes as a single 18-year-old. With kids at home, add a sitter cost or a "bring the kid" version.
A kidsAtHome() branch on 4 or 5 outing events: "+$40 for a sitter" or "Bring them to the bunny hill (less fun for you, a kid moment)".
Files: events.js. Uses the existing kid joy and costs.
Balance: kid lives get a little pricier for outings; parent planner stays above 70 in the sim.

### i58-b19 [Parent] A quiet "Saved" mark after every week (S, 🟡)
A parent who gets interrupted wants to know they can close the app. After each week, show a small "✓ Saved" in the header for two seconds, and "Answer first, then it's saved" while an event is open.
save() in state.js sets a flag; the header shows the mark. Skips show it once at the end.
Ties in with i22-a01: once open events survive a reload, the second message goes away.
Balance: none.

### i58-b20 [Parent] Small event results show as a toast, not a second sheet (S, 🟡)
Every event takes two taps: the choice, then Continue. For minor results (no money over $50, small stat moves), close the sheet and show the result as a toast with its chips.
showEvent already does this for one-choice events; extend it to choices marked minor.
The Journal and the week's "What happened" list still record it.
Balance: none; it only removes a tap.

### i58-b21 [Parent] A standing visit that rides along on skips (M, 🟡)
Players who tap Out and about every week get a small free lift (the planner bot gets coffee weekly); Auto players never do. Let you set one "usual" visit that happens on its own on skip weeks.
Out and about sheet: "Make this my usual" on one activity. weekTick calls visit() for it when you skip and have the cash.
It uses one of the two weekly visits and still fades with repeats (REPEAT_WEEKS).
Files: outabout.js, turn.js.
Balance: capped by the same visit rules and costs money every week; idle bots don't set one.

### i58-b22 [Strategist] Your health plan shows on the Life tab (S, 🟡)
After open enrollment there is no place to see which plan you have or when it renews. Add a line under Health care: "Better coverage: doctor bills half off until next January".
Reads S.healthPlan in the Life tab's Around town section (ui.js).
Balance: none.

### i58-b23 [Strategist] The recruiter says "next 4 weeks" and which jobs (S, 🟡)
The choice says "your next application this month is a sure thing" but the result says "the next 4 weeks", and neither says locked jobs are still locked. Use one phrase and say "any job you qualify for".
Text only, in events.js (A recruiter calls).
Balance: none.

### i58-b24 [Strategist] A build card on the end screen (M, 🟡)
Strategy players want to compare runs. Add a short card to the end screen: weeks of each focus in percent, trips taken, visits made, jobs held, and the biggest money move.
Count focus weeks in weekTick (S.focusWeeks); finish() in features.js prints the card; the share card can include it.
Balance: information only.

### i58-b25 [Retiree] A simple screen: stats, focus and End Week (L, 🟡)
For players who rarely play games, a Menu setting that hides trips, Out and about, the map toggle and skips from Home, leaving the stats, six focus tiles and End Week in larger type.
The rest of the game still runs; Life and Jobs tabs stay as they are. Sensible defaults turn on (401(k) at 5%, carpool when offered).
Files: ui.js (render Home), state.js (a setting saved outside the life), index.html (a larger type scale).
Balance: scores are kept separately like a mode until the sim shows simple-screen planners land within a few points of normal planners.
