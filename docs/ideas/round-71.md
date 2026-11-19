# Ideas round 71

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 71: Fighting the samey weeks

Ways to make the long middle of a life (steady job, mid-career, empty nest) feel different week to week without adding chores.

### i71-a01 A dry-spell floor: six empty weeks, then something happens (S, 🔴)
After six weeks with no event, the next week's town roll is guaranteed to pick one, so the long middle never goes silent for months.
Touches: rollEvent() in js/events.js: count S.quietN, force pickEvent(month,'town') at 6, reset on any event.
Balance: Pacing only: the forced event comes from the normal pool with normal good/bad mix, so it adds no free points. Paused while away south.

### i71-a02 Quiet weeks notice things: seeds that become chances later (M, 🔴)
On a week with no event, a Town or Outside focus has a 1-in-5 chance to plant a seed line ("The old hall on Main has a For Sale sign"). Four to ten weeks later it comes back as an opportunity event.
Touches: weekTick() in js/turn.js plants via chainSet() from js/features.js; a small SEEDS list of seed + payoff pairs (cheap lot, a shop sale, a job opening, a used boat).
Balance: Rest seeds at 1-in-10 and only when cash is above zero, so idle Rest rarely gets them. Payoffs cost money or a week to take.

### i71-a03 Offers with a clock: a chance on Home that's gone in two weeks (M, 🔴)
Some opportunities show as a chip on Home with a deadline ("A neighbor's canoe, $300, two weeks"). Act before it runs out or it's gone.
Touches: S.offers [{id, until, cost, fx}] in js/features.js, a chip in the Home render in js/ui.js, expiry checked in weekTick().
Balance: Skipping lets offers lapse, which gives a skip a real cost. Every offer costs money or time, so careless play can't stack them.

### i71-a04 The plateau: three years at a capped job brings a work crossroads (M, 🔴)
When you've been in the same job three years and raises are near the cap, the boss offers a choice: lead a crew (more pay, more stress), go to four days (less pay, more happiness), or stay put.
Touches: A new WORK_EVENTS entry in js/events.js gated on S.jobMonths >= 36 and S.raise near RAISE_CAP; once per job.
Balance: Each option trades one stat for another; staying put changes nothing, so it can't be gamed.

### i71-a05 Slack: calm, steady weeks cushion the next hard one (M, 🟠)
A week with no overtime or hustle, no rut and at least two weeks of bills in the bank adds one point of slack (max 3). The next bad event spends it and hurts 30% less.
Touches: S.slack in weekTick(); showEvent() in js/events.js scales negative happy and health by slack. A small dot row on Home.
Balance: Needs cash and a job or retirement, so idle and broke play never build it. It only softens losses; it never adds points.

### i71-a06 Restless: a long, comfortable stretch wants something new (M, 🟠)
If a whole year passes with nothing new (no new job, home, trip town, badge or story chain), a gentle happiness drift starts and Home says "You're restless." Any new thing clears it.
Touches: S.lastNew stamped wherever badges, jobs, trips and chains start; a check in weekTick().
Balance: Hits idle play hardest (about −0.3 happiness a week); active players never see it. Stops at 75+ so old age stays calm.

### i71-a07 Momentum: varied weeks tilt luck your way (M, 🟠)
Three or more different focuses in the last four weeks, no debt, and you build momentum: good events get a bit more likely and your next job application gets a small boost.
Touches: S.recentF already exists in js/turn.js; pickEvent() weights tagged good events ×1.3; feeds S.applyBoost in EVENT_STATE.
Balance: Rewards attention, not grinding. A rut or debt drops it to zero. Shown as a small chip so the player knows why.

### i71-a08 Same focus, different month: seasonal flavors for three focuses (M, 🔴)
The same focus reads and plays a little differently through the year: Outside is snowshoeing near Bluewood in January and fishing the Touchet in May; Town is a soup supper in winter and Celebration Days setup in spring.
Touches: A FOCUS_FLAVOR table by month in js/state.js; weekTick() shifts the fx mix (say +20% health, −20% happy) and the week strip shows the line.
Balance: The total of each focus stays the same; only the mix moves, so no focus gets stronger overall.

### i71-a09 Open door or lay low: one tap sets how lively your week is (S, 🟠)
A small toggle by End Week. Open door makes town events half again as likely and adds a little community; Lay low halves them and helps you rest when health is low.
Touches: eventOdds() in js/events.js reads S.door; a toggle in the End Week area in js/ui.js. It stays set until you change it.
Balance: Events average out near zero, so neither setting farms points; it just lets the player pick the pace.

### i71-a10 A quarterly work pick at report-card time (M, 🟠)
Every 13 weeks with a job, one short sheet: take the new route (more pay, more wear), train the new hire (community, less pay), or keep it steady. It sets the next quarter.
Touches: Rides on the report card in weekTick(); S.assign modifies pay and stress in the money and drift lines.
Balance: Skips pick "steady" for you. Options are even trades, so careless play doesn't gain.

### i71-a11 A sabbatical: eight unpaid weeks after seven years at one job (M, 🟡)
Seven years in one job opens a sabbatical: eight weeks with no paycheck, your job held, and Outside and trip weeks count extra. You come back fresh, rut cleared.
Touches: A planDue entry in js/features.js; job() stays held; tripWeek() and focus fx get a bonus while S.sabbUntil > S.turn.
Balance: Eight weeks of lost pay is a real cost; the boost is happiness only, so a broke player can't afford it.

### i71-a12 Train for the Walla Walla half marathon (M, 🟡)
Sign up in January. Each Outside week before May counts toward 12 training weeks. On race day you finish strong, finish sore, or walk it, based on how many you got in.
Touches: A personal goal like seasonGoal() in js/state.js, with a race-day event in js/events.js.
Balance: Health and happiness payoff only; the sign-up fee means it's a choice, not a freebie.

### i71-a13 Skill level 3 opens a moonlight job (M, 🟠)
Reach the top of a skill and an offer comes: cook caters wine-weekend weddings, handy builds decks, mechanic fixes tractors at harvest, people hosts at the grange. A few paid weekends a year.
Touches: SKILLS and practice() in js/features.js; offers arrive through the clock chips (a03).
Balance: Pay is modest and costs a little health. It rewards years of steady practice, not a quick grind.

### i71-a14 A crossroads scheduler for the long middle (L, 🔴)
In lives over five years, if no real life choice has come in 78 weeks, the game picks one that fits your stage: a move, a career change, a parent who needs help, a business for sale.
Touches: A CROSSROADS list by age band in js/features.js, served through planDue() so it lands like other life decisions.
Balance: Each crossroads has a safe "no thanks". It changes the story, not the score math.

### i71-a15 Season tickets to the Friday night games (S, 🟡)
Buy fall season tickets in September. Each fall Friday week adds a little happiness and community without a tap. If the team makes the playoffs, a road-trip event comes.
Touches: An S.tickets flag; weekTick() adds small fx in months 8 to 10; the Friday night game event in js/events.js knows you're a regular.
Balance: Costs money up front and an evening a week (tiny health dip), so it isn't free.

### i71-a16 Steady jobs grow new work events with tenure (M, 🟠)
After three years in one job, new work events unlock: your old trainee becomes your boss, the new owner asks your opinion, you're asked to write the how-to binder.
Touches: New WORK_EVENTS in js/events.js gated on S.jobMonths >= 36.
Balance: Mixed outcomes like other work events; it fights sameness without moving the score curve.

### i71-a17 A clean quarter earns a gold star on the report card (S, 🟠)
At the 13-week report card, if you never hit a rut, never went into debt and tried three or more focuses, you get a gold star in the Journal and a small happiness lift.
Touches: The report-card block in weekTick() in js/turn.js; S.qClean tracked through the quarter.
Balance: Small (+3 happiness), and idle play can't qualify since it needs varied focuses.

### i71-a18 Rain check: pass on an offer now, maybe see it again (S, 🟡)
Clock offers get a "Rain check" button. Half the time the offer comes back 8 to 20 weeks later, a little worse.
Touches: A field on S.offers in js/features.js.
Balance: Worse terms on return, so waiting is a real tradeoff, not a free reroll.

### i71-a19 Double-booked: two good things want the same Saturday (S, 🟠)
Now and then a town event and a work event land the same week. You pick one, and the other has a small cost (a friend's sigh, the boss's note).
Touches: rollEvent() in js/events.js rolls both categories on rare weeks (about 1 in 40) and builds a two-way sheet.
Balance: The skipped side always costs a little, so it's a real choice, never two free wins.

### i71-a20 Secondhand finds that change a focus a little (S, 🟡)
A few times a year, a cheap used thing turns up: a canoe makes Outside a bit stronger, a bread machine trims the grocery bill, a tiller helps a garden. You keep it.
Touches: S.items in js/state.js; offers via the clock chips; small modifiers in billLines() and focus fx.
Balance: Each is small and capped at one per kind; they cost money and can break.

### i71-a21 Each year has a character: wet, dry, boom or lean (M, 🟠)
Each January the year draws a mood that tilts which events come: a wet year brings high water and mushrooms, a dry year brings smoke and a short harvest, a boom year more hiring.
Touches: A YEARS table; pickEvent() in js/events.js scales weights by S.yearKind; named in the year in review.
Balance: Each year type has good and bad events, so the average stays the same.

### i71-a22 Money crossroads: what to do with a healthy savings account (M, 🟠)
When cash covers six months of bills and you haven't touched money tools in a year, one sheet offers three uses: an extra mortgage payment, the index fund, or a family trip.
Touches: Reads moneyOutlook() in js/features.js; links to invest(), the mortgage and tripSheet().
Balance: Only shows once you've earned the cushion; each choice is a real trade of cash now for later.

### i71-a23 The skip button lists what will lapse (S, 🔴)
Before a 4 or 13 week skip, a short line says what you'll miss: offers that run out, a town goal that needs your focus, a seed coming due.
Touches: The skip handler around playWeeks() in js/turn.js; reads S.offers, seasonGoal() and pending chains.
Balance: Quick skip stays quick, but it now has a known cost, so skipping isn't the best move by default.

### i71-a24 Tenure perks at 2, 5 and 10 years (M, 🟠)
Stay with an employer and the job gets better: at 2 years you pick your shift (less commute stress), at 5 a long weekend each quarter, at 10 a pin and a send-off when you leave.
Touches: job() checks S.jobMonths in js/turn.js drift; a Journal line at each step.
Balance: Rewards staying, which is a choice against chasing raises; the perks are small.

### i71-a25 A perfect Waitsburg week, once in a long while (S, 🟡)
Rarely, on a good week with no debt and no rut, everything lines up: a warm evening, the whole street out, a short scene and a Journal star.
Touches: A rare roll in weekTick() (about 1 in 60 qualifying weeks), its own sheet.
Balance: Tiny bonus; can't happen in a rut or in debt, so careless and idle play almost never see it.

### i71-a26 Empty nest: a half-strength second focus (M, 🟠)
Once the last kid leaves home, you can pick a second focus that works at half strength. The evenings opened up.
Touches: FOCUS in js/state.js; weekTick() applies a second fx at 0.5; the pick sits under the main focus in js/ui.js.
Balance: Offsets the joy lost when kids leave rather than adding on top; costs from the second focus still apply.

### i71-a27 A friendly bet: biggest steelhead or the best tomato (S, 🟡)
A friend bets you on something for the season. Your Outside or Rest weeks add rolls. At season's end, the loser buys pie.
Touches: A season-length chain with chainSet() in js/features.js.
Balance: Bragging rights and small community; nothing big rides on it.

### i71-a28 A sim check that measures samey stretches (S, 🟠)
The balance sim counts the gap between weeks with a real choice, after year two. Target: a median gap of 8 weeks or less for good play, and idle still at or under 50.
Touches: The sim bots in tests/; a new report line beside the score medians.
Balance: Guards the whole round: no new system may raise idle or careless scores.

### i71-a29 Pick your seat at the monthly grange potluck (S, 🟡)
Once a month on a Town week, choose who to sit with: an old friend, a newcomer, or the folks running things. Each nudges a different neighbor or a different stat.
Touches: A monthly Town-focus event in js/events.js; ties to neighbor warmth if that ships.
Balance: Same total value for each seat, just a different direction.

## Ideas 71: Code health after the merge wave

About 60 features merged in a few days, all sharing one global scope. These are cleanups that make the next wave safer: duplicated helpers, money that bypasses cost(), save fields, dead code and test gaps.

### i71-b01 Chain-event buttons show the price you really pay (S, 🔴)
The fixer-upper, food-truck and levee story buttons say "-$350", "$1,400", "$7,000", "Invest $1,500" and "Donate $200" as typed text, but charge cost() and the handy-skill discount. Labels switch to fmtc() and a shared handyCost(), so the button matches the money chip in year 20.
- features.js STORY_EVENTS (lines ~252-300) has six hard-coded dollar labels; the go() code charges `Math.round(cost(350) * (1 - skillLv("handy") * 0.15))`.
- Fix: labels use `fmtc()` or a new `handyCost(v)` that both the label and go() call. "Your $1,500 is gone" uses the same number.
- Balance: none. Text only; the money already moved this way.

### i71-b02 The money outlook test actually checks what it says (S, 🔴)
The outlook rules test works out whether week 1 of the outlook matches a real week, then never asserts it. It gets an assert, plus a second case with a job and a 401(k), where the two code paths split most.
- tests/rules.test.mjs ~1107: `const ok = ...` is returned but no `assert(r.ok)`.
- Add: a working life at 5% 401(k) with a truck loan; week 0 of `moneyOutlook()` must equal `weekTick` net within $1.
- Balance: none. Catches drift between turn.js and features.js moneyOutlook.

### i71-b03 One resolveChoice() for picked and auto-played events (M, 🔴)
An event you tap and an event that resolves itself during a skip run two copies of the same bookkeeping. The tapped path writes the Journal directly, with no entry kind and no 120-entry cap. One helper does the log, the week strip, the map pin and the save.
- events.js showEvent: `S.log.unshift({d, m})` skips log(), so no `k` and no cap; turn.js weekTick auto path uses log().
- Both push to S.run.happened and set S.evPins[0].r. Move all of it into `resolveChoice(ev, choice)` in events.js.
- Balance: none. Journal filters stop guessing at tapped-event entries.

### i71-b04 Promotion stress counts in quiet weeks too (S, 🔴)
eventUpkeep() is only called from rollEvent(), and that is skipped when events are off or a retiree is in Arizona. Promotion stress and promo clean-up move into weekTick, before the event roll.
- events.js rollEvent calls eventUpkeep(); turn.js weekTick skips rollEvent when `S.noEvents || awaySouth()`.
- Rules tests run with noEvents, so promotion stress has never been checked in a played week. Add a check: a promo with n=2 costs about 0.6×W happiness a week.
- Balance: a promoted worker pays the stress they already should. Careless and idle play are not affected.

### i71-b05 Collections fees and hospital bills show in the week's money (S, 🔴)
The collections fee and the hospital bill come out of cash after the week's money lines are added up, so the money lines don't match "Total change in cash". Both become lines in the week.
- features.js debtWeek: `S.money -= cost(COLLECT_FEE)`; turn.js weekTick: the hospital bill is taken after `S.last` is built.
- Fix: push them to `lines` (or append to S.last.lines) before `S.last` is set.
- Balance: none. Display only.

### i71-b06 migrate() drops its two hand-kept default lists (S, 🟠)
migrate() keeps two default tables (d and r) that repeat what blankLife() already fills in. Move evPins and yearStart into blankLife, keep only the real migration steps, and repairLife() can then fix a broken pin list too.
- state.js migrate: `d` and `r` mostly copy blankLife(); the only real steps are carpoolJob = jobId and hustleLast = turn.
- blankLife lacks evPins and yearStart, so repairLife can't fix a non-array evPins (spread as letters in weekTick).
- Balance: none. One place to add a save field from now on.

### i71-b07 One graduate() for classes and class-week events (S, 🟠)
Finishing school is written twice: once in weekTick and once in events.js classWeeks(). The two give different feedback (a note vs a badge toast). One graduate() does the level, the log, the happiness and the note.
- turn.js weekTick (the f.study block) and events.js classWeeks both bump S.edu, log and adj({happy:8}).
- Fix: `graduate(notes)` in state.js; both call it. Leftover class weeks are handled in one spot.
- Balance: none.

### i71-b08 Use working() and longCommute() everywhere (S, 🟠)
The helpers exist, but the code repeats `job() && !S.retired` 7 times and `commuteOneWay() >= 20` 9 times. A LONG_COMMUTE = 20 constant feeds kidCost, canCarpool, carpooling, commuteGasFactor and the event odds.
- events.js has working() and longCommute(); state.js, events.js rollEvent/eventOdds and turn.js still inline the checks.
- commuteGasFactor checks `CITIES[j.city].miles >= 20` for a job that might not be yours. Pass it through the same constant.
- Balance: none. Changing the long-commute line later becomes one edit.

### i71-b09 curYear() and ownsHome() helpers (S, 🟠)
`new Date(S.date).getFullYear()` appears 20 times and `HOMES[S.home].own` 20 times across six files. Two tiny helpers in state.js replace them, and wineYear() and planYear() become plain aliases.
- Copies in features.js (wine, scholarship, snowbird, property tax), turn.js, events.js planYear, ui.js.
- Do it with a search-and-replace and a rules run. No logic change.
- Balance: none.

### i71-b10 One month helper instead of three (S, 🟠)
Seasons are checked three ways: inSeason(...) in features.js, inM(m, ...) in events.js and inline `[3,4,5].includes(curMonth())` 6 times. Keep one inMonths(...) that takes the month or reads curMonth().
- features.js inSeason, events.js inM, plus inline copies in features.js BIZ (food truck) and turn.js truckTime.
- The food-truck months are typed out twice (BIZ.truck.weekly and turn.js truckTime). Give them one TRUCK_MONTHS constant.
- Balance: none.

### i71-b11 Skill discounts come from one constant (S, 🟠)
The "−15% a level" handy and mechanic discount is typed out in four places, and the cook's 4% in two. A skillOff(k) helper and per-skill rates in SKILLS feed the bills, the events and the perk text.
- events.js ~126 and ~215, features.js ~252 and ~259 use `(1 - skillLv(k) * 0.15)`; turn.js billLines and outabout.js townLifeCard use 0.04.
- The SKILLS perk text ("−15% a level", "−4% a level") reads the same rate, so Help can't drift.
- Balance: none.

### i71-b12 Around-town card reads the real bills (S, 🟠)
The Life tab's Around town card works out food and health-care costs itself, and leaves out Hard mode's 10%. It reads the matching lines from billLines() instead.
- outabout.js townLifeCard repeats turn.js billLines food math (GROCERY_SHARE, STOCK_OFF, cook skill) and the 50+/65+ health-care price.
- Fix: `const b = Object.fromEntries(billLines())` and show those values.
- Balance: none. On Hard the card shows the price you actually pay.

### i71-b13 hireOdds() moves out of the Jobs screen (M, 🟠)
The hiring chance is worked out inside apply() in ui.js, mixed in with the screen code. A hireOdds(job) rule in turn.js returns the chance. apply() uses it, and rules tests check it without rendering or faking dice.
- ui.js apply(): community, school, Waitsburg bonus, people skill, outLookBonus, applyBoost, collections and bankruptcy all in one line of UI code.
- rules.test.mjs ~761 renders and stubs Math.random to test a recruiter; it could assert hireOdds() directly.
- Balance: none. The same formula, now testable.

### i71-b14 State fields stop sharing names with functions (S, 🟠)
S.practice is the tutorial flag and practice() trains a skill. S.skiPass is a year and skiPass() is a yes/no. weekTick has a local `cr` that hides the global cr(). Rename the function side (trainSkill, hasSkiPass) and the local, so a search finds one thing.
- features.js practice(k, n) vs S.practice (ui.js newGame); events.js skiPass() vs S.skiPass; turn.js `const cr = CARE[S.care]` shadows events.js cr().
- Rename only functions and locals, so saves keep their field names.
- Balance: none.

### i71-b15 One will, not two flags (S, 🟠)
A will is stored as both S.will and S.out.will. hasWill() reads both, writeWill() and the law-office visit set both, and migrate() copies one to the other. Keep S.will only, and migrate folds out.will into it.
- features.js hasWill/writeWill, outabout.js visit (aid === "will") and actBlocked, outDefault() has will:false.
- The rules check "the law office will and the Life-tab will are the same will" keeps passing.
- Balance: none.

### i71-b16 Remove dead code and stale file headers (S, 🟠)
statBar() in ui.js is never called now that stat buttons replaced it. Each file's header says "part N of 8", but there are 9 files, and outabout.js has no number. Delete the dead helper and fix the headers to match index.html.
- ui.js ~395 statBar: no callers in js/ or index.html.
- Headers in all nine js/*.js files; the load order lives in index.html and the sw.js ASSETS list.
- Balance: none.

### i71-b17 A guard test for the one shared global scope (M, 🟠)
All nine scripts share one global scope, with 466 top-level names. A rules check reads js/*.js and fails if a name is declared twice or matches a window property (open, close, name, status, top). It also lists names that are declared but never used.
- tests/rules.test.mjs: parse `^(function|const|let) name` across js/*.js. Today there are no duplicates and no browser clashes. The test keeps it that way.
- A duplicate `const` throws only at load, in whichever file loads second. This catches it with a plain message naming both files.
- Balance: none.

### i71-b18 Event titles stay unique, and every place points at a real event (S, 🟠)
Cooldowns, once-only flags and map places all use the event title as the key. With 135 events spread over three files and four EVENTS.push calls, a repeated title would quietly share a cooldown. A check catches repeats and EVENT_PLACE entries for titles that no longer exist.
- S.evCd, S.evDone, EVENT_PLACE, OUT_EVENT_BIZ are all keyed by title; EVENTS is extended in events.js, features.js (x2) and outabout.js.
- No repeats today. The test keeps it that way after the next content wave.
- Balance: none.

### i71-b19 Events get a stable id apart from their title (M, 🟠)
Fixing an event title's wording today resets old saves' cooldowns and once-only flags. Each event gets a short id. evCd and evDone key on the id, and migrate() turns old title keys into ids once.
- events.js, features.js, outabout.js event tables; turn.js weekTick and pickEvent/planDue read S.evCd[ev.title].
- A small TITLE_TO_ID map in migrate covers existing saves.
- Balance: one-time events can't come back after a text edit, so retitling events can't be used to farm them.

### i71-b20 Jobs added from other files get the same checks (S, 🟠)
outabout.js pushes 7 jobs into JOBS and fills in LAYOFF_RISK and WORK_SPOT with Object.assign. Only JOB_GROUP is checked today. The same rules check makes sure every job has a layoff risk, a work spot and a group.
- outabout.js ~285-296; rules.test.mjs ~712 checks JOB_GROUP only.
- A job missing LAYOFF_RISK reads undefined, and its layoff odds go NaN without any error.
- Balance: none.

### i71-b21 Badges touch storage only when one is earned (S, 🟠)
badgeWeek() reads and rewrites the badge store in localStorage every week, even when nothing new is earned. That is 26 writes per Auto. It writes only when a badge lands.
- features.js badgeWeek: `store.get(BADGE_KEY)` and `store.set(BADGE_KEY, all)` run every week.
- Fix: read lazily, and set only if something changed.
- Balance: none. Faster skips on slow phones.

### i71-b22 Truck-loan fallback set once in migrate (S, 🟡)
`S.loanPay || CARS.truck.pay` is repeated in netWorth, weekTick and moneyOutlook to cover very old saves, and the fallback is in 2027 dollars. migrate() sets loanPay once when a loan is running without it, and the fallbacks go.
- state.js netWorth, turn.js weekTick, features.js moneyOutlook.
- Balance: none for current lives.

### i71-b23 Name the magic numbers in weekTick (S, 🟡)
weekTick types out unemployment ($1,100), the partner's pay ($1,400), the 15% and 5% tax rates, and home growth 0.025 twice. moneyOutlook copies some of them. Named constants (UI_PAY, PARTNER_PAY, TAX_RATE, RETIRED_TAX, HOME_GROW) live in state.js.
- turn.js weekTick and features.js moneyOutlook. HOME_GROW already exists, but weekTick writes `?? 0.025`.
- Help can then quote the same constants.
- Balance: none.

### i71-b24 A withStub() helper for test fakes (S, 🟡)
Some rules checks replace Math.random or pickEvent and put them back by hand. If the check throws first, the fake stays in place for every later check. A withStub() helper always puts the original back.
- rules.test.mjs ~761 sets Math.random with no try/finally; ~226 reassigns the global pickEvent.
- Add `window.withStub = (obj, key, fake, fn) => {...}` next to fresh() and week().
- Balance: none. One failure stops making later failures.

### i71-b25 Money lines get a key, so tests don't read labels (M, 🟡)
Bills are [label, value] pairs, so tests look up "Paycheck" and "Food & utilities", and the outlook spots property tax by its label. A third key field (pay, rent, food, ptax) lets labels be reworded or translated without breaking tests or the outlook.
- turn.js billLines/weekTick lines, features.js moneyOutlook (`b[0] === "Property tax (county)"`), rules.test.mjs lookups.
- Screens show the label and code reads the key.
- Balance: none.

### i71-b26 Screen tests wait for the screen, not the clock (S, 🟡)
screens.test.mjs has 9 fixed sleeps, flows 4 and gameplay 2. On a busy machine they flake, and on a fast one they waste time. Each waits for the thing it is waiting on: a sheet, focus, or a class.
- screens ~108-228, gameplay ~285 and ~299, flows. A recent commit already did this for one 80 ms pause.
- Balance: none.

### i71-b27 Rules checks for systems with no test (M, 🟡)
A few merged systems have no rules check: Hard mode's +10% living line, the bankruptcy rate added to new mortgages, the gas-friend, snow-chain and raise-boost event state, and the index-fund drop timing. Add one short check each.
- HARD_LIVING (turn.js billLines), BK_RATE (features.js buyRate), S.gasFriend/snowChains/raiseBoost (events.js), S.mkt.dropAt.
- Balance: none. They also guard against Hard mode quietly getting easier.

### i71-b28 One loan-payment helper for the week and the outlook (S, 🟡)
Truck, student and home-equity payments are worked out separately in weekTick, moneyOutlook, moneyWeek and netWorth. One loanLines(offsetWeeks) feeds the week and the outlook, like billLines() already does for bills.
- turn.js weekTick loan blocks, features.js moneyWeek (HE) and moneyOutlook ~1075-1077.
- Balance: none.

### i71-b29 Old cooldowns are cleared each New Year (S, 🟡)
S.evCd keeps every event title ever rolled, with a turn that has long passed. At New Year, weekTick drops entries that are already over, so the save and the backup code stay smaller.
- turn.js weekTick newYear block; S.evCd entries where value <= S.turn.
- Balance: none. Only finished cooldowns are removed.

### i71-b30 The long-shot win says the same as the money chip (S, 🟡)
Win on the long-shot horse and the text says you won $500, while the chip shows +$400 because the $100 bet never came out. The text says "$500 back on your $100 bet", or the bet is taken first.
- events.js Celebration Days choice ~106: `adj({money:cost(400)})` vs `You won ${fmtc(500)}`.
- Balance: none. Same money, honest words.
