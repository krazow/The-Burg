# Ideas round 3

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 3: Money, work and the valley

Ideas that give work, school and money in the valley more paths, more real choices and something to spend on late in life.

### i3-a01 Job ladders with named rungs (M, 🔴)

Every job gets two or three named steps (farm hand → lead hand → farm manager, CNA → charge aide, cellar hand → assistant winemaker). The promotion offer moves you up a rung with a new title, pay and stress, and the top rungs need time in the job plus the right school or skill.

- Each JOBS entry gains a `ladder` array of {title, payMult, stress, needMonths, needEdu, needSkill}.
- The existing promotion offer (events.js, J2) moves `S.rung` up instead of a flat +12%; the Jobs tab shows the ladder.
- Touches state.js (JOBS), events.js (promotion offer), ui.js (job card).
- Balance: rungs need months on the job, so job-hoppers and idle players never reach them; top-rung stress keeps it a trade-off.

### i3-a02 Pick a program, not just a level (M, 🔴)

School gets real programs from the valley's colleges: nursing, wine making, farm equipment tech, wind energy tech, business, teaching. Finishing one gives a hiring and pay bonus at matching jobs, so school becomes a path, not just a number.

- When you start classes you pick a program; `S.major` is saved with the diploma it earned.
- Matching jobs (nursing → cna/rn/imaging, wine → cellar, equipment → mech/elevator) get +10% pay and better application odds.
- Touches state.js (EDU, SCHOOL), ui.js (study picker), events.js (application odds).
- Balance: same weeks and tuition as today; only careful, matched choices get the bonus.

### i3-a03 Short certificates: CDL, welding, phlebotomy, notary (S, 🔴)

Quick 4–8 week courses that unlock one job or perk without climbing the whole school ladder: a CDL for trucking, welding for the shop and Hanford, phlebotomy for the hospital, a pesticide license for farm work.

- A `CERTS` list in state.js; taking one uses Take classes weeks and a one-time fee.
- Trucker (CDL) and new jobs check `S.certs` instead of (or as well as) `edu`.
- Touches state.js, ui.js (Life tab classes), turn.js (study progress).
- Balance: costs real weeks of no overtime; gives a narrow door, not a big pay jump.

### i3-a04 Apprenticeships: earn while you learn a trade (M, 🟠)

Electrician, plumber and lineman apprenticeships pay 60% of full pay for two to four years while you work, then you become a journeyman with some of the best pay in the valley.

- New jobs with `apprentice:{weeks, startMult}`; pay steps up every year until done.
- Needs a trade certificate to apply; quitting early resets it.
- Touches state.js (JOBS), turn.js (pay), ui.js (progress bar on the job card).
- Balance: low pay early means good players trade short-term money for a long payoff; careless play rarely sticks with it.

### i3-a05 More valley jobs: wind farms, dams, the Forest Service (S, 🟠)

Add jobs the region really has: wind turbine tech in the Dayton hills, dam operator on the Snake, a Forest Service crew in the Blue Mountains, a school teacher in Waitsburg, a VA hospital clerk in Walla Walla, a nuclear plant operator near Richland.

- Six to eight JOBS entries with pay, edu, stress, wear and layoff risk, each mapped to a work spot and an icon.
- A few need a program or certificate from the school ideas above.
- Touches state.js (JOBS, LAYOFF), events.js (work-spot map), maps.js (pins).
- Balance: pay set inside today's range for each edu level; the sim's job picker should not find a new best job.

### i3-a06 Seasonal jobs that end and start again (M, 🟡)

Bluewood lift work runs December to March, harvest trucking July to August and the Forest Service crew in summer. When a season ends you're laid off with a recall date, so you pair a winter job with a summer one or ride unemployment.

- `season:[months]` on some jobs; turn.js ends pay out of season and sets `S.recall`.
- Recall brings you back without applying; the Jobs tab shows when the season returns.
- Touches state.js, turn.js, ui.js, events.js (layoff code reused).
- Balance: off-season weeks earn nothing unless you plan a second job, so idle play loses money.

### i3-a07 Interviews with a choice or two (M, 🟠)

Applying for a better job leads to a short interview event: how you answer (honest, confident, ask about pay) and your People skill, haircut and references change the odds, instead of a hidden dice roll.

- When an application is due, an 'Interview' event (cat 'work') fires with two or three answers that move the odds.
- Reuses the haircut boost, People skill and (if built) work standing.
- Touches events.js (applications), features.js (skills).
- Balance: good play raises odds a little; careless skipping keeps today's odds, so no new free path.

### i3-a08 Negotiate the offer (S, 🟡)

When you're hired for a hard-to-fill job (nurse, trucker, lab), you can ask for more: take it as is, ask for 5% more (People skill helps), or ask for a sign-on bonus that you pay back if you leave inside a year.

- A small sheet after a successful application; sets `S.raise` or pays a bonus with `S.bonusUntil`.
- Touches ui.js (hire flow), events.js.
- Balance: a failed ask can lose the offer (10%), so it's a real choice.

### i3-a09 References follow you (S, 🟡)

How you leave a job matters: two weeks' notice and good standing give a good reference that helps your next application; walking out or a firing gives a bad one for a year.

- `S.ref` set on Quit (with a notice choice) and on firing events; read by the application odds.
- Touches ui.js (quit button), events.js.
- Balance: hurts careless job-hopping, which today has no cost.

### i3-a10 A union card at the rail yard, Hanford and the hospital (M, 🟠)

Union jobs take monthly dues but get steadier raises and layoff protection. Every few years a contract fight comes up: vote to strike (a few weeks of strike pay, then likely a raise) or take the deal.

- `union:true` on rail, hanford, rn, para, co; dues as a bill line; layoff risk lowered.
- A once-every-3-years 'Contract vote' story chain in features.js (STORY_EVENTS).
- Touches state.js, turn.js (bills), features.js (chain), events.js.
- Balance: strike weeks cost money now; the raise only pays off if you stay.

### i3-a11 Federal shutdown furlough (S, 🟡)

Hanford and national lab workers can get furloughed for a few weeks when the federal budget stalls. Back pay comes later, but bills don't wait, so savings matter.

- One event for richland federal jobs: pay stops for 2–5 weeks, then a back-pay lump.
- Touches events.js only.
- Balance: money-neutral for players with savings, painful for players running at zero.

### i3-a12 A security clearance for Hanford and the lab (S, 🟡)

Big Richland jobs need a clearance. After you're hired you wait about 12 weeks on lower 'badged-out' pay, and heavy debt or a missed truck payment can sink the check.

- `S.clearanceAt` on hire for hanford/scientist/labadmin; reduced pay until it clears; debt below −$5,000 adds a failure roll.
- Touches events.js (hire), turn.js (pay).
- Balance: rewards keeping money in order before reaching for the top pay.

### i3-a13 Remote job for a Seattle company (M, 🟠)

With a bachelor's degree and fiber internet installed at home, you can work fully remote for a West Side company: city pay, no commute, but no coworkers, so community fades faster.

- One special job, city 'waitsburg', remote:5, needs edu 3 and a one-time internet install cost.
- Extra community drift while held; layoff risk high (0.8).
- Touches state.js (JOBS), turn.js (community drift), ui.js.
- Balance: high pay offset by community and layoff risk; community is 20% of the score.

### i3-a14 Ride the county bus to Walla Walla (S, 🟡)

Take the county bus from Waitsburg to Dayton or Walla Walla for a small monthly pass instead of driving: much less gas and truck wear, but longer days cost a little happiness.

- A commute option next to carpool: `S.bus` for dayton and wallawalla jobs; gas factor 0.1, happiness −0.3/week.
- Touches state.js (commuteGasFactor), ui.js (Jobs tab toggle).
- Balance: saves money for planners; small enough that it doesn't beat living close to work.

### i3-a15 Wheat prices: sell at harvest or store it (M, 🟠)

Your leased wheat ground gets a real price each summer. At harvest you choose: sell now, or store it at the elevator for a fee and sell later, hoping prices rise by spring.

- A yearly `S.wheatPrice` roll; an August harvest event with Sell / Store; a spring 'Sell stored wheat' button on the business card.
- Touches features.js (BIZ.wheat, bizWeek, bizCard), events.js.
- Balance: average result equals today's; it adds a decision, not more money.

### i3-a16 Crop insurance for the wheat lease (S, 🟠)

Pay a yearly premium in spring and a bad harvest pays out most of a normal year instead of 30%. Skip it and keep the money, but a drought year hurts.

- A toggle on the wheat business card; premium in April; the 15% bad-year branch checks `S.biz.ins`.
- Touches features.js (BIZ.wheat.yearly).
- Balance: premium priced near the expected loss; it trades variance, not value.

### i3-a17 Wine futures with a Walla Walla winery (M, 🟡)

Buy into a winery's vintage: you pay in fall and get paid when the wine is released three years later, more if it was a great year and less if smoke got the grapes.

- A new BIZ-like 'investment' with `payAt` turn and a vintage roll; shown on the Life tab.
- Touches features.js (BIZ or a new INVEST list), turn.js (payout), events.js (smoke-year news).
- Balance: money locked for 3 years and counted at cost in net worth until paid, so it can't inflate the score early.

### i3-a18 A small cattle herd in the foothills (M, 🟡)

Run a few cow-calf pairs on rented pasture: feed costs in winter, calving in spring, and selling calves at the fall livestock auction. Cattle prices and a hard winter swing the year.

- A fourth BIZ type 'cattle' with monthly feed costs Nov–Mar and an October sale.
- Get outside weeks count as checking the herd; skipping them raises loss odds.
- Touches features.js (BIZ), events.js (calving, hard winter).
- Balance: needs active weeks, so idle owners lose money.

### i3-a19 A real insurance sheet: truck, renters, home (M, 🔴)

Replace the flat 'Insurance & phone' line with choices: liability-only or full coverage on the truck, renters insurance, and a home deductible. Crashes, theft, windstorms and fires then pay out based on what you picked.

- `S.ins = {auto:'liab'|'full', renters:bool, deductible}`; the bill line in turn.js sums them.
- Existing events (truck trouble, windstorm, break-ins) check coverage before charging.
- Touches turn.js, events.js, ui.js (Life tab), help.js.
- Balance: the default matches today's cost; going cheap saves money until bad luck, which hits careless players hardest.

### i3-a20 Property taxes for owners (S, 🟠)

Homeowners pay county property tax twice a year, in April and October, so owning has a real yearly cost beyond the mortgage and planners keep cash ready.

- A bill line in turn.js in months 3 and 9 for `home.own`, about 1% of home value a year.
- Shown in the money outlook (below) and in help.js.
- Balance: small; slightly lowers owners' edge, which is large today.

### i3-a21 The valley's housing market (M, 🟠)

Home prices move each year with the valley: some years buyers line up, some years houses sit. Selling costs agent fees, and buying in a hot year costs more, so when you move matters.

- A yearly `S.homeIdx` that moves home prices and equity growth (replaces the flat 2.5%).
- The move flow in ui.js charges 6% to sell and shows the market mood.
- Touches state.js (HOMES), turn.js (equity), ui.js (moving).
- Balance: average growth stays 2.5%; the fee stops cheap move-and-flip loops.

### i3-a22 Mortgage rates and refinancing (S, 🟡)

Mortgage rates change each year. Buy when rates are low, or refinance later for a fee to lower your payment.

- `S.rate` yearly; mortgage payment scales with it at purchase; a Refinance button when the rate is 1 point lower.
- Touches ui.js (buy, refinance), turn.js (mortgage).
- Balance: closing costs mean it only pays if you stay several years.

### i3-a23 Borrow against your home (S, 🟡)

Owners can take a home equity loan at a low rate to start a business, pay for school or clear expensive debt, with a fixed monthly payment.

- Reuses the loan pattern (sloanLeft/sloanPay) as `heLeft/hePay`; limit 50% of equity.
- Touches ui.js (Life tab), turn.js (payment), state.js (netWorth).
- Balance: debt counts against net worth, so it can't pad the score.

### i3-a24 Public pensions for school, county and state jobs (M, 🔴)

Paraeducators, courthouse clerks, corrections officers, teachers and nurses at the state hospital earn a pension after five years. It pays monthly in retirement on top of Social Security.

- `pension:true` on public jobs; `S.pensionYears` grows while employed; vested at 5 years.
- Retirement pay in turn.js adds `pensionYears × 1.5% × final pay`.
- Touches state.js, turn.js, ui.js (Life tab retirement line), help.js.
- Balance: lower-paid public jobs become a sound long game; careless job-hoppers never vest.

### i3-a25 Social Security that reflects your work (S, 🟠)

Your Social Security check grows with the years you worked and what you earned, instead of being the same for everyone.

- Track `S.earnYears` and average pay; `ssPay()` scales from 60% to 140% of today's amount.
- Touches state.js (ssPay), turn.js.
- Balance: idle and unemployed lives retire poorer, which is the point.

### i3-a26 Collections when debt drags on (S, 🟠)

Stay in debt for months and it goes to collections: calls that cost happiness, worse odds on job applications and loans, and a fee, until you get back above zero.

- `S.debtWeeks` counts weeks below zero; past 12, a weekly happiness cost and an application penalty.
- Touches turn.js, events.js (application odds).
- Balance: aimed at careless play, which today shrugs off debt until the ending.

### i3-a27 Bankruptcy instead of leaving town (M, 🟡)

When debt passes the limit, you can file for bankruptcy instead of the game ending: you lose savings, vehicles beyond a beater and any business, debt is wiped, and loans and good jobs are harder for years.

- A choice sheet before the debt ending in turn.js; sets `S.bk` with a 7-year penalty on loans and some applications.
- Touches turn.js (debtEnd), ui.js, features.js (lifeScore penalty).
- Balance: a fixed Life Score penalty keeps it worse than never going broke.

### i3-a28 A 3-month money outlook (S, 🔴)

A Money sheet shows the next 13 weeks: regular bills, the dates of big ones (tabs, property tax, lease renewal, tuition), and whether you're on track to stay above zero.

- Read-only projection from the same constants weekTick uses; flags any week it dips below zero.
- Touches ui.js (new sheet), turn.js (shared bill helper).
- Balance: information only; helps good play more than careless play.

### i3-a29 A brokerage account with good and bad years (M, 🟡)

Put money in index funds in Walla Walla: it averages about 6% a year, but some years drop 20%. Selling in a panic locks in losses.

- `S.stocks` with a yearly return roll; a 'Market drop' event offers Hold or Sell.
- Touches turn.js (yearly growth), events.js, ui.js (Life tab).
- Balance: same average as the 401(k) but with swings; counts in net worth at market value.

### i3-a30 Retire south for the winter (S, 🟡)

Retirees can spend January to March in Arizona: it costs a lot and community fades while you're gone, but health and happiness hold up through the gray months.

- A yearly choice for retired players in December; skips events and trips for those weeks.
- Touches events.js, turn.js (drift while away).
- Balance: a late-game money sink with a community cost.

### i3-a31 Long-term care late in life (M, 🟠)

In your 70s and 80s you choose how to be cared for: stay home with a paid aide, move to assisted living in Walla Walla, or count on family. Each costs money or happiness, and buying care insurance at 55 lowers the bill.

- An event chain from age 75 when health is under 50; monthly costs as a bill line; an insurance choice event at 55.
- Touches events.js, turn.js, features.js (STORY_EVENTS).
- Balance: the main late-game money sink, so big Lifetime savings have a use.

### i3-a32 Endow a scholarship at Waitsburg High (S, 🟡)

Late in life (or rich at any age), put a lump sum into a scholarship in your name. A graduate gets it every spring, you get a community boost each year, and it appears in your life story.

- A Life-tab button from net worth $150,000; lowers money, adds a yearly community bump and a June event.
- Touches ui.js, events.js, features.js (finish screen line).
- Balance: turns surplus money into community at a poor rate, so it's a choice, not an exploit.

### i3-a33 Write a will (S, 🟡)

See a lawyer in Walla Walla to write a will. In legacy mode, a will passes your savings and home to your heir in full; without one, probate takes a share and months.

- A one-time Life-tab action (fee) sets `S.will`; startLegacy in features.js applies a 10% probate cut and a delay without it.
- Touches features.js (startLegacy), ui.js.
- Balance: small cost; only matters in legacy mode.

### i3-a34 Rent your spare room on wine weekends (S, 🟡)

Owners with a spare room can host visitors on Walla Walla's big wine weekends and summer events: good money a few times a year, plus cleaning and the odd bad guest.

- A Life-tab toggle for owners; income in fixed weeks (spring release, summer, fall harvest) with a small happiness cost.
- Touches turn.js (income line), events.js (guest events).
- Balance: a few hundred dollars a year; can't replace a job.

## Ideas 3: App and platform

Ideas for keeping saves safe, running well on old phones, moving lives between devices without a cloud, installing from the stores, Spanish, privacy and the tools that keep the code healthy.

### i3-b01 Keep beta saves apart from real saves (S, 🔴)
The beta at /beta/ shares the same storage keys as the real game, so a beta with a new save format can damage your real lives. Beta builds use their own keys, with a one-tap 'Bring my lives into the beta' copy.
- The release kit already renames the cache for beta (theburgbeta-); do the same for SAVE_KEY, SLOTS_KEY and BEST_KEY in js/state.js.
- First beta launch offers to copy (never move) your real lives in.
- Touches js/state.js, the release kit stamping, tests/offline.test.mjs.
- Balance: none; pure safety.

### i3-b02 An open event survives closing the app (S, 🔴)
If you close the app while an event is on screen, the same event (and the same dice) is waiting when you come back. No more rerolling a bad event by swiping the app away.
- Save the pending event id and its rolled numbers into S before the sheet opens; clear it after you answer.
- On Continue, reopen that event instead of rolling a new week.
- Touches js/turn.js, js/events.js, js/ui.js loadSlot.
- Balance: closes a reload exploit that lets careful cheaters dodge every bad event.

### i3-b03 Ask the phone to keep your saves (S, 🔴)
The game asks the browser to treat its storage as permanent, so a phone low on space doesn't quietly wipe your lives. The backup sheet shows 'Saves protected' or suggests a backup if the phone says no.
- Call navigator.storage.persist() after the first real week, and navigator.storage.persisted() in the backup sheet.
- Touches js/state.js, js/ui.js backup sheet, js/help.js.
- Balance: none.

### i3-b04 Last-good copy of every life (S, 🔴)
Each slot keeps the previous week's save as well as the current one. If a save comes back broken, Continue offers the copy from a week earlier instead of losing the life.
- writeSlot writes the new save, reads it back, and only then moves the old one to a 'prev' key.
- slots() falls back to the prev copy when a slot fails to parse.
- Touches js/state.js; a rules test that corrupts a slot and checks recovery.
- Balance: one week back only, and it's the same dice for seeded lives, so it can't be used to reroll.

### i3-b05 Save repair and versioned updates (M, 🟠)
Every save carries a format number, and a small list of upgrade steps brings old saves up to date. Missing or broken values (like money that isn't a number) are fixed with safe defaults instead of crashing.
- Add S.fmt and a MIGRATIONS array in js/state.js, run in loadSlot and restore.
- tests/rules.test.mjs loads saved fixtures from each old version.
- Balance: repaired values use the game's normal starting defaults, never bonuses.

### i3-b06 Tell the player when a save fails (S, 🟠)
Right now a full storage area makes saving fail silently. Instead the game trims old journal lines and tries again, and if that fails too it shows 'Couldn't save this week' with a Back up now button.
- store.set returns success; save() handles QuotaExceededError.
- Touches js/state.js, js/ui.js toast.
- Balance: none.

### i3-b07 A friendly screen when something breaks (S, 🔴)
If the game hits an error, you see a calm sheet: 'Something went wrong. Your life is saved as of last week.' with Continue and Copy details buttons, instead of a frozen screen.
- window.onerror and unhandledrejection handlers in js/boot.js; keep the last 5 errors on the device only.
- Copy details includes version, screen size and the error, nothing personal.
- Tests: flows test throws on purpose and checks the sheet.
- Balance: none.

### i3-b08 Update ready: refresh between weeks (S, 🔴)
When a new version has downloaded, a small 'Update ready' note appears on Home and the app refreshes when you tap it, never in the middle of an event. Today the new files take over at once and can mix with old ones.
- sw.js waits instead of skipWaiting on install; the page posts a message to activate.
- js/boot.js listens for a waiting worker and controllerchange; save() runs first.
- tests/offline.test.mjs covers it.
- Balance: none.

### i3-b09 Check the offline file list in tests (S, 🟠)
A test fails if any script in index.html is missing from the service worker's offline list, so a new js file can never break offline play.
- Parse script tags in index.html and ASSETS in sw.js in tests/offline.test.mjs.
- Balance: none; prevents a whole class of release bugs.

### i3-b10 Move a life with a QR code (M, 🟠)
The backup sheet shows one life as a QR code; on the other phone or computer you scan it with the camera and the life appears in a free slot. No cloud, no account.
- A small inline QR encoder in js/ui.js; scanning uses the camera barcode reader where the browser has one, with paste-the-code as the fallback.
- Larger lives split across 2-3 codes scanned in a row.
- Balance: same data as the backup code, so nothing new to exploit.

### i3-b11 Merge restore: the newest copy of each life wins (M, 🟠)
Restoring a backup can now merge: each life keeps whichever copy was played more recently, and badges, records and finished lives are combined. Playing on a phone and a laptop stops being all-or-nothing.
- Match lives by a life id (add one at creation), compare savedAt and turn.
- Touches js/ui.js restoreSheet and backupData in js/state.js.
- Balance: records merge by the best real score; an older copy can never overwrite a newer one.

### i3-b12 Hand off a life instead of copying it (S, 🟡)
When you send a life to another device, you can mark the copy left behind as 'Moved to another device'. It stays readable but can't be continued, so you don't end up with two versions of the same life.
- A movedAt flag on the slot; slotCard shows it with an Undo.
- Touches js/state.js, js/ui.js.
- Balance: stops playing two branches of one life and keeping the better one.

### i3-b13 A gentle backup reminder (S, 🟡)
After about 26 played weeks without a backup, the Menu shows a small 'Last backup: never' line. One tap opens the backup sheet; it never pops up over play.
- Store lastBackupAt with the slots; reset by file or code backup.
- Touches js/ui.js menu and backup sheet.
- Balance: none.

### i3-b14 Light mode for old phones (S, 🟠)
On phones with little memory or few processor cores, the game turns off animations, count-ups and map detail on its own. A line in the Menu lets you switch it either way.
- Check navigator.deviceMemory and hardwareConcurrency in js/boot.js; add a body class that index.html CSS uses.
- Respects prefers-reduced-motion too.
- Balance: none.

### i3-b15 Auto weeks without redrawing every one (M, 🟠)
When you skip or auto-play several weeks, the game works through them and draws the screen once at the end. On old phones a 52-week skip goes from seconds to a blink.
- Split the week math in js/turn.js from rendering; render() runs after the batch or when an event needs you.
- Balance: identical results; the sim test checks the same scores with and without batching.

### i3-b16 Draw maps only when they're opened (S, 🟡)
The town, Main Street and region maps are built the first time you open them instead of at start, so the game opens faster on older phones.
- Lazy-build the SVG in js/maps.js and js/outabout.js; cache it until the season changes.
- Balance: none.

### i3-b17 A speed test on a slow phone (S, 🟠)
A new test slows the browser down to old-phone speed and checks that the game opens in under 2 seconds and End Week answers in under a quarter second.
- tests/perf.test.mjs using Playwright's CPU throttling; added to npm test.
- Prints timings so slowdowns show up in pull requests.
- Balance: none.

### i3-b18 A plain message on browsers that are too old (S, 🟠)
Instead of a blank screen on a very old phone browser, the game says 'This browser is too old for The Burg' and suggests updating or using another browser.
- A tiny script at the top of index.html checks for the features the game uses before the rest loads.
- Balance: none.

### i3-b19 Pause Auto when you leave the app (S, 🟠)
If you switch away while Auto is running, it stops and saves. Coming back shows where you are, not ten weeks you didn't watch.
- visibilitychange listener in js/turn.js stops the auto loop and calls save().
- Balance: none; Auto already stops for events.

### i3-b20 Language groundwork: one place for all words (M, 🟠)
Buttons, tabs, menus and help move into one word list with a small t() helper, so the game can be translated without touching game logic. Numbers and dates use the player's language settings.
- New js/strings.js loaded first; fmt and dateLabel use Intl.
- A test flags any new on-screen English left outside the list in ui.js.
- Balance: none.

### i3-b21 The Burg en español (L, 🟡)
A full Spanish version: menus, help, jobs and then events, chosen in the Menu or from the phone's language. Many families in the valley speak Spanish at home.
- Built on the word list; events get a Spanish text field, translated in packs, falling back to English where not done yet.
- Town and place names stay as they are.
- Touches js/strings.js, js/events.js, js/help.js; screen tests run in both languages.
- Balance: same numbers in both languages.

### i3-b22 Play Store kit: screenshots, listing, privacy answers (M, 🟠)
A script makes everything the Android store listing needs: phone and tablet screenshots from real game screens, a feature graphic, the listing text and the data-safety answers (no data collected).
- tools/store-kit.mjs uses Playwright at store sizes; output goes to a store/ folder the release kit can pick up.
- Uses android.appId from release.json.
- Balance: none.

### i3-b23 Protect saves in the Windows app (S, 🟠)
Saves in the Windows app are tied to its local port, so a port change would hide them. A release check makes sure the port never changes, and an empty first start offers Restore from a backup right away.
- Release check on windows.port in release.json; title screen shows Restore when no slots and no records exist.
- Touches js/ui.js renderTitle, tests/offline.test.mjs.
- Balance: none.

### i3-b24 Install shortcuts and a richer install sheet (S, 🟡)
Long-press the installed icon for 'Continue my life' and 'Weekly challenge'. The install prompt shows real screenshots and a description, like a store page.
- Add shortcuts, screenshots, id and categories to manifest.webmanifest; handle ?go=continue and ?go=weekly in js/boot.js.
- Balance: none.

### i3-b25 What this game knows about you (S, 🔴)
A short page in Help: everything stays on this device, nothing is sent anywhere, and here is exactly what is stored. An 'Erase everything' button clears all lives, records and settings after a confirm.
- New section in js/help.js listing the storage keys in plain words; erase uses store.del on every theburg key and clears the cache.
- Doubles as the privacy policy the app stores ask for.
- Balance: none.

### i3-b26 Feedback without tracking (M, 🟠)
A 'Send feedback' button writes a note you can read and edit before it goes: your message, the version and screen size, and, only if you tick the box, your last 10 journal lines. It sends through your own email or share sheet.
- Uses navigator.share or a mailto link, so there is no server and nothing sent in the background.
- Touches js/ui.js menu, js/help.js.
- Balance: none.

### i3-b27 Share a single moment as a picture (M, 🟡)
Any badge, town goal or journal milestone can be shared as a small picture card: the date, what happened and the town scene behind it.
- Reuse the canvas drawing from shareCard in js/features.js; add a share button to badge and milestone rows.
- Balance: sharing gives nothing in the game.

### i3-b28 Tell a friend: a link and a QR to install (S, 🟡)
A 'Tell a friend' button shares the game's web address, and shows it as a QR code for the person sitting next to you.
- Reuses the QR encoder from 'Move a life with a QR code'; navigator.share with a text fallback.
- Touches js/ui.js menu.
- Balance: none.

### i3-b29 A replay test that catches accidental balance shifts (S, 🟠)
A test plays a few seeded lives for 52 weeks and compares the journal and score with a saved copy. If a change moves the numbers, the test says so, and the copy is updated on purpose when the change is meant.
- Uses the seeded dice in js/features.js; fixtures in tests/fixtures/; npm run test:replay -- --update to refresh.
- Balance: protects the careless <= 60, idle <= 50, good >= 70 targets between sim runs.

### i3-b30 A hidden builder panel (M, 🟠)
Opening the game with ?dev=1 adds a panel to jump ahead weeks, set stats, fire any event by name and look at the save. Building and checking new events gets much faster.
- New js/dev.js, loaded only with the flag and left out of the offline list.
- Lives touched by the panel are marked so they never count for records or badges.
- Balance: marked lives can't set best scores.

### i3-b31 Check every event is well-formed (S, 🟠)
A test walks every event and makes sure it has a title, valid months, at least one choice, and only effects the game knows about. A typo in a new event pack fails the test instead of the player's game.
- Add to tests/rules.test.mjs, reading the event lists from js/events.js and js/outabout.js.
- Balance: also flags any choice whose effects are all positive, which careless play would always pick.

### i3-b32 Catch name clashes between script files (S, 🟡)
The nine script files share one global scope. A quick check fails when two files define the same top-level name or use a name nobody defines.
- tools/check-globals.mjs run in CI before the browser tests.
- Balance: none; keeps the codebase safe to grow.

### i3-b33 A map of what the tests never touch (S, 🟡)
The test run can produce a coverage report showing which functions and events never ran, so new tests go where they help most.
- Playwright's JS coverage in tests/helpers.mjs behind COVERAGE=1; writes a small HTML report.
- Balance: none.

### i3-b34 A badge on the app icon for the new weekly challenge (S, 🟡)
When a new weekly challenge starts and you haven't played it, the installed app's icon shows a small dot. It clears when you open the challenge, and it can be turned off.
- navigator.setAppBadge in js/boot.js, checked when the app opens; no notifications or servers.
- Balance: none; the challenge is its own score list.
