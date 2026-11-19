# Ideas round 17

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 17: Starting out

Ideas for the first months and years of a new life, so the opening of every game has choices and a steady beat.

### i17-a01 Graduation night: a three-choice opening scene (M, 🔴)

- New opening sheet in ui.js startGame, shown for the 18-year-old starts (fresh, farm, parent can skip).
- River party: +community, -$40. Family dinner: +happy, a box of kitchen things. Night shift: +$120, -happy.
- Writes S.plan ('save up', 'get out', 'learn a trade') used by later ideas.
- Balance: nudges are under 3 points or $150, so no choice is a must-pick.

### i17-a02 Three doors on day one: a starter job, a program, a place (M, 🔴)

- Home tab card in ui.js for turn 0 only, built from JOBS (edu 0, short commute), SCHOOL and HOMES.
- Replaces the bare 'Start by finding a job' toast.
- You can still ignore it and use the tabs.
- Balance: the cards are ordinary picks, not better than what the tabs offer; idle play still never takes one.

### i17-a03 Opening weeks run on their own small event pool (M, 🔴)

- events.js: tag events with start:true and give them a high weight while S.turn < 8.
- Normal event rate takes over after week 8.
- Each starter event happens at most once per life.
- Balance: payoffs are tiny and mixed; the sim checks careless median stays <= 60.

### i17-a04 Staying with family: a new starting background (L, 🔴)

- New BACKGROUNDS entry 'home' and HOMES entry 'family' (cost 200, happy -1) in state.js.
- Weekly chore tax: one evening a week, a small community bump with family.
- Happiness slowly sags after a year at home unless you are in school or saving toward a move.
- Balance: cheap rent is offset by the sag and a lower happiness cap; staying forever costs score.

### i17-a05 Moving-out week: pack the pickup (S, 🟠)

- Story event in events.js fired from the move handler in features.js when the old home was 'family' or 'room'.
- Choice: ask friends (community up, pizza bill) or do it alone (health dip, no cost).
- Journal 'mile' line so it shows in the year review.
- Balance: one-time, small effects.

### i17-a06 Move back home for a while (M, 🟠)

- Offered once per life under 26, when money < -$1,500 and family is in town (not the transplant).
- Switches S.home to 'family'; happiness -6 on the move, small weekly sag after 16 weeks.
- A move-out goal appears on Home.
- Balance: a safety net, not a strategy: careless runs that take it lose happiness and can't use it twice.

### i17-a07 The pickup is Dad's, and he wants it back (M, 🟠)

- S.carBorrowed flag set by BACKGROUNDS; dated notice 8 weeks ahead on Home.
- On the date, S.car becomes null unless you bought one; no car means walking or the ride board.
- Option: buy the pickup from him for $1,800 on a payment plan.
- Balance: gives early saving a clear goal; careless play feels the squeeze, good play plans for it.

### i17-a08 Open your first checking account (S, 🟠)

- New S.bank flag; turn.js takes 2% of pay while false (fresh and farm starts begin without one).
- One-tap action on the Money sheet: costs an evening, $25 opening deposit.
- Grad and transplant starts already have one.
- Balance: small leak only careless play keeps paying.

### i17-a09 Your phone: stay on the family plan or get your own (S, 🟠)

- New monthly line in the bills list (turn.js costs).
- Family plan: random 'pay your share' event; your own plan: +1 happiness once.
- Transplant starts on their own plan.
- Balance: about $35 a month swing; no stat edge either way.

### i17-a10 On your parents' health insurance until 26 (S, 🟠)

- Insurance cost in turn.js is lower while age() < 26 and bg is fresh, farm or home.
- Dated reminder via the 'Up next' style notice.
- Works with the open enrollment idea if that is built.
- Balance: savings end on a known date, so they can't carry a lazy life.

### i17-a11 Car insurance drops at 25 (S, 🟡)

- vehicleTabs in state.js gets an age factor: 1.4 under 21, 1.2 under 25.
- Birthday note in turn.js.
- Ties to the speeding ticket idea below.
- Balance: a cost early in life that rewards clean driving.

### i17-a12 First speeding ticket on Highway 12 (S, 🟡)

- Event in events.js, under-25 drivers with a commute, higher weight in weeks with overtime focus.
- Class: $40 and an evening; it keeps the insurance drop on time.
- Court: coin flip, a lost workday.
- Balance: costs only; the class is the clear careful choice.

### i17-a13 Graduation money in a card (S, 🟠)

- One-time opening event for 18-year-old starts (events.js start pool).
- Save: +$400. Car fund: +$400 tagged toward the pickup buyout. Weekend: +$100, +happy, +community.
- Balance: same total value, different stat; no wrong answer.

### i17-a14 Friends leave in August, come home at Thanksgiving (M, 🔴)

- Two linked story events in events.js, year one only, for starts under 20.
- Goodbye choice: a send-off (community up) or skip it (no cost, a 'drifted' flag).
- Thanksgiving: friends you saw off are glad to see you; small happiness boost.
- Balance: happiness and community only, a few points.

### i17-a15 Where your class went: four classmates you can follow (M, 🟠)

- New S.classmates array in state.js; names from a stand-in list; a card on the People or Home tab.
- Yearly update in turn.js; events can reference them by name.
- Ties to letters, reunions and dating ideas from earlier rounds.
- Balance: flavor; no direct stat gains.

### i17-a16 Your old coach still checks in (S, 🟡)

- Short events in events.js, ages 18–24, at most three per life.
- Helping with a game night or concert: community +2.
- Later grants a small interview bonus for school and county jobs.
- Balance: gated on time spent; idle play never triggers the favor.

### i17-a17 Running Start credits from high school (S, 🟡)

- Checkbox on the start sheet for fresh and home starts; sets S.studyProg = 8, money -400.
- Uses existing STUDY_NEED in state.js.
- Balance: a trade of cash for progress, not a free head start.

### i17-a18 Ask three people before you pick a path (S, 🟠)

- Info sheet in features.js off the Study focus, built from SCHOOL, TUITION and JOBS.
- Shows real numbers from the game data, not hand-written ones.
- Balance: info only.

### i17-a19 A job shadow day (M, 🟠)

- New focus option for ages 18–25 (FOCUS in state.js) that names one job from JOBS.
- Gives a +interview chance flag and a happiness hint about fit (stress and wear shown in plain words).
- Costs a week of pay or a day off.
- Balance: lost pay keeps it from being free; limited to four per life.

### i17-a20 Financial aid: fill out the FAFSA by the deadline (M, 🔴)

- Dated window in turn.js (January–March); one-tap action on the Study sheet.
- Grant cuts TUITION by 50% when yearly pay is under a set line.
- Journal reminder at the window start.
- Balance: rewards planning; careless play rarely files.

### i17-a21 Talk to the recruiter: enlist at 18–20 (L, 🟠)

- Event in events.js for ages 18–20; on yes, a time skip in turn.js with a summary sheet.
- Sets edu money and the veteran perks from the veteran start idea if built.
- Not in short modes (6 months, 1 year).
- Balance: the skipped weeks score at a middle line, not a max, so it can't beat good play.

### i17-a22 Your 90-day review at your first job (S, 🟠)

- Applies to the first job of the life; pay starts at 92% in turn.js.
- Review checks weeks worked and focus history (work or community weeks count).
- Raises to 100% or 104%.
- Balance: rewards showing up, punishes idle a little.

### i17-a23 Young bodies bounce back, late nights tempt (S, 🟡)

- Small age factor on health recovery in turn.js.
- More weight on social night events in events.js under 25.
- Balance: tuned in the sim so net health is the same as now on careless play.

### i17-a24 Rental history: your first landlord's reference (S, 🟡)

- S.rentRecord counter in state.js, ticked in turn.js when rent is paid with money above zero.
- Move costs in features.js use it for the deposit size.
- Balance: rewards steady play, small amounts.

### i17-a25 Adulting badges: firsts that count (S, 🟠)

- New entries in the badges list in features.js with test functions.
- Shown as a row on the badge book.
- Balance: badges don't add score; they point new players at good habits.

### i17-a26 A younger brother who needs a ride (S, 🟡)

- Short events in events.js; S.sibling flag set by background.
- Yes: an evening, gas, community or happiness bump. No: a small family-mood dip.
- Later: he graduates and you go to the ceremony.
- Balance: small, repeat-limited.

### i17-a27 The 18-year-old's money list on Home (S, 🟠)

- Card in ui.js renderHome using the same numbers turn.js charges.
- Hides after week 12 or when tapped away.
- Balance: info only.

### i17-a28 A summer fire crew for 18–24 (M, 🟡)

- Seasonal job in JOBS with a months field and an age cap, listed from April.
- High wear and stress; ends in September with a note.
- Balance: big money short-term, health cost; it can't be held year-round.

### i17-a29 Turning 21 with your friends (S, 🟡)

- Birthday hook in turn.js for age 21; event in events.js.
- Big night: +community, -health next week. Dinner: +happy. Trip: costs more, +happy, +community.
- Balance: one-time.

### i17-a30 The plan you made at 18, looked at again at 25 (M, 🟠)

- Sheet in ui.js at the 25th birthday, reading S.plan and a few tallies.
- One pivot choice: go back to school (a study bonus), move towns, or double down (a small job-standing nudge).
- Balance: pivots trade one stat for another; nothing free.

## Ideas 17: Getting it to players

Ideas for the owner's side of the game: store listings, a website, a Waitsburg launch, feedback, release notes and keeping it free, without tracking anyone.

### i17-b01 A link preview that shows the town when shared (S, 🔴)
index.html gets a description, Open Graph and Twitter tags and a 1200x630 preview picture of the town scene, so a link pasted in a text or a town Facebook group shows the picture and one plain line instead of a bare address.
- Add meta description, og:title, og:description, og:image and twitter:card to index.html, plus a share-preview.png made from the title screen.
- Small-town news travels by group posts and texts; this is the cheapest ad there is.
- Touches index.html, a new image, sw.js offline list. No gameplay effect.

### i17-b02 A README written for players first (S, 🔴)
README.md opens with what the game is, a Play now link, three screenshots, install steps for Android, Windows and iPhone, and 'free, no ads, works offline, nothing tracked'. The test and build details move to docs/DEVELOPING.md.
- The GitHub page is often the first page people see; today it starts with game lengths and test suites.
- Touches README.md and a new docs/DEVELOPING.md. No gameplay effect.

### i17-b03 A real privacy policy page at its own address (S, 🔴)
A short privacy.html at the site root says the game collects nothing, sends nothing and stores lives only on the device, with a contact address and a date. Google Play and the Microsoft Store both ask for this link.
- Same words as the in-game 'what this game knows' page so the two never disagree; a test checks both mention every storage key.
- Touches a new privacy.html, sw.js, release.json site files. No gameplay effect.

### i17-b04 Release notes players actually read (S, 🔴)
Each CHANGELOG release gets a short 'For players' block of three to five plain lines. That one block feeds the in-game What's new sheet, the store 'What's new' boxes and the website, so nobody writes notes three times.
- A check fails the release if the block is missing or over the Play Store's 500-character limit.
- Touches CHANGELOG.md, ui.js whatsNew, the release kit's notes step. No gameplay effect.

### i17-b05 A Waitsburg launch kit: flyer, poster and tear-off strips (M, 🔴)
A printable page (docs/launch/flyer.html with print CSS) makes a one-page flyer and a poster: the town picture, 'A free game about life in the Burg', a QR code to play, three install steps, and tear-off strips for the library and grocery boards.
- Uses the game's own colors and town art so it looks like the game.
- Stand-in names only; no real business logos.
- Repo-only (docs/launch). No gameplay effect.

### i17-b06 Measuring what players do without tracking them (M, 🔴)
Menu > 'Share my play summary' builds a short anonymous text (length, mode, weeks played, finished or not, score band, which features were used, version) that the player reads first and sends through their own share sheet or email. A tools/summaries.mjs script turns pasted summaries into a table for the owner.
- No network calls, no ids, nothing automatic; the player sees every word.
- Score shown as a band, not an exact number, so nobody feels judged.
- Touches features.js (share), ui.js menu, new tools script. No gameplay effect.

### i17-b07 A beta tester group with a 'try this' list (M, 🔴)
Each beta's CHANGELOG lists three to five things to try. Beta builds show a small 'Beta' ribbon on Home that opens the list; testers tick what they tried, and the feedback note includes the ticks. A docs/beta.md page explains how to join the /beta/ site and the Play testing track.
- Gives testers a job instead of 'tell me what you think'.
- Ticks are stored only on the device and only shared if the tester sends feedback.
- Touches ui.js, state.js (beta flag from APP_VERSION), CHANGELOG.md, docs. No gameplay effect.

### i17-b08 Free and ad-free, said plainly, with the costs written down (S, 🔴)
A 'Free for good' line in Help, the store listings and the site: no ads, no purchases, no data, ever. docs/costs.md lists what it costs to keep running (Play's one-time fee, domain, Apple's yearly fee and why iPhone stays a web app) so the promise is one the owner can keep.
- Any tip link lives only on the website, never in the game, and unlocks nothing.
- Touches help.js, docs. No gameplay effect.

### i17-b09 Microsoft Store listing kit (M, 🟠)
A script builds what Partner Center asks for: Windows screenshots at store sizes from the real game, the listing text, a 'what's new' from the player notes, the privacy link and the age rating answers. It sits beside the Play Store kit and shares its listing file.
- Uses the Windows app settings already in release.json (port 47920, app id).
- Touches a new tools/store-windows.mjs, store/ folder. No gameplay effect.

### i17-b10 One listing file for every store and the site (S, 🟠)
store/listing.json holds the name, short and long descriptions, keywords, category (Simulation) and contact, with each store's length limits checked by a test. The Play kit, the Microsoft kit, the website and the press kit all read from it.
- Written in the game's plain small-town voice; mentions Highway 12, the Touchet and real towns, never real business names.
- Touches a new store/listing.json and tests. No gameplay effect.

### i17-b11 Showcase lives for screenshots that can be remade (M, 🟠)
A few saved lives in tests/fixtures/showcase put the game in its best-looking moments: Celebration Days, harvest on the region map, a finished life's score card, Main Street close-up. Every store shot, site image and press picture is made from them, so a new look means rerunning one script.
- Saves load through the normal restore path, so they also test it.
- Touches tests/fixtures, tests/helpers.mjs, the store kits. No gameplay effect.

### i17-b12 A 30-second trailer made by the game itself (M, 🟠)
tools/trailer.mjs uses Playwright's video recording to play a showcase life through a scripted path: pick a focus, drive Highway 12, an event, a year in review, the score. Captions come from a small text file; an mp4 is made if ffmpeg is installed.
- Same file works for the Play listing video, the site and a booth loop.
- Repo-only tool. No gameplay effect.

### i17-b13 A press kit page (S, 🟠)
press.html: a one-paragraph pitch, a fact sheet (free, platforms, offline, made in Washington, release date), the icon and logo files, screenshots in a zip, the trailer, a contact address and a note on what's real and what's stand-in.
- Reads its facts from store/listing.json and VERSION so it stays current.
- Touches a new press.html on the site. No gameplay effect.

### i17-b14 A story for the local paper (S, 🟠)
docs/launch/paper.md holds a ready-to-send note and a 300-word piece for the weekly paper: who made it, why Waitsburg, what's real (the river, the fairgrounds, Highway 12), how to play free, plus two photo picks. Names a stand-in paper, filled in by the owner.
- Repo-only. No gameplay effect.

### i17-b15 Celebration Days booth mode (M, 🟠)
Opening the game with ?kiosk=1 on a borrowed tablet starts a 4-week demo life, never saves to the real slots, resets after two minutes with nobody tapping, and ends with a big 'Play on your phone' QR code.
- Kiosk lives don't count toward records, badges or the weekly challenge, so a booth can't fill anyone's shelf.
- Touches boot.js, state.js (no-save flag), ui.js. Normal play is unchanged.

### i17-b16 Shared computers at the library and school (S, 🟠)
A ?shared=1 link the library or school can bookmark shows a calm line on the title screen: 'This computer forgets. Back up before you leave or play on your phone.' Quitting offers the backup code right away.
- Public computers wipe browser storage at log-off; this stops 'my life vanished' complaints.
- Touches boot.js, ui.js backup sheet. No gameplay effect.

### i17-b17 Launch week challenge on the library board (S, 🟠)
For launch week, the weekly challenge uses a fixed 'Opening Week' seed and the end screen says 'Write your score on the sheet at the library'. A printable score sheet sits in the launch kit; no server, no leaderboard online.
- Same seed and normal scoring rules for everyone, so careless play still scores low.
- Touches the weekly challenge seed in state.js or features.js, docs/launch. No balance change.

### i17-b18 A page for Waitsburg's real businesses (S, 🟠)
Help and the site get 'For local businesses': why the game uses stand-in names, how places were chosen, and how an owner can ask for a correction, to be left out, or to have their real name used. Links to the contact address.
- Heads off worry before the paper story runs.
- Touches help.js, site page. No gameplay effect.

### i17-b19 Plain-language report forms on GitHub (M, 🟠)
.github/ISSUE_TEMPLATE gets three short forms: 'Something broke', 'I have an idea', and 'That's not how Waitsburg is'. Each asks two or three plain questions and the version; Help links to them for players who use GitHub.
- The town-fact form feeds the stand-in and place details; ideas feed the roadmap.
- Touches .github/ISSUE_TEMPLATE, help.js. No gameplay effect.

### i17-b20 A public roadmap in plain words (S, 🟠)
tools/roadmap.mjs turns the P1 and P2 items in TODO.md into a short Now / Next / Later page for the site and Help, with no issue numbers or jargon. It runs on every release so it's never stale.
- Players see their suggestions land; the owner keeps one source.
- Touches a new tools script, site page, help.js. No gameplay effect.

### i17-b21 Support and FAQ from one file (S, 🟠)
docs/faq.md answers the top questions: my life disappeared, moving to a new phone, why there's no iPhone store app, is it really free, are these real businesses, why the update didn't show. Help and the website both build from it.
- Every answer ends with the one button or link that fixes it.
- Touches docs/faq.md, help.js, site. No gameplay effect.

### i17-b22 A 'Get the game' page that picks the right install (M, 🟠)
On the site (and Menu > Get the app), Android sees the Play badge, Windows sees the Microsoft Store badge, iPhone sees two-picture Share > Add to Home Screen steps, and everyone else gets the browser link and a QR.
- Badges show only once a store listing is live (a flag in store/listing.json).
- Touches a new site page, ui.js menu. No gameplay effect.

### i17-b23 iPhone as a first-class web app (M, 🟠)
Proper apple-touch-icon sizes, launch screens for common iPhones, a status-bar style that matches the header, and an iPhone screenshot set for the site. Today it has one 192px icon and nothing else.
- Keeps iOS free (no Apple fee) while looking like a real app on the home screen.
- Touches index.html, new icon and splash files, sw.js offline list. No gameplay effect.

### i17-b24 Honest age rating answers, kept honest (S, 🟠)
docs/store/rating.md lists every mature thing in the game (drinks 21 and over, debt, illness, death of a parent, bars) for the store rating forms. A test flags new events with alcohol, gambling or violence words so the rating is updated before release.
- Touches docs, a new test over the event list in events.js. No gameplay effect.

### i17-b25 A note for parents and teachers (S, 🟠)
A short page on the site and in Help: what the game covers, that drinks are 21 and over in the game, no accounts, no chat, no data, and a suggested age. Teachers can print it with the classroom pack.
- Makes the school and library launch easy to say yes to.
- Touches help.js, site page. No gameplay effect.

### i17-b26 A kind review ask, once (S, 🟠)
After a finished life scored 70 or more, a one-time card says 'Enjoying The Burg? A review helps other people find it' with a link to the store it was installed from. Never mid-week, never again after 'No thanks'.
- Shown only after good finished play, so it never nags idle or careless players mid-game.
- Touches ui.js end screen, state.js flag, store link from listing.json.

### i17-b27 A store-day checklist the release prints (S, 🟠)
docs/launch/checklist.md lists the hand steps for each release (upload to Play, update store notes, post on the site, tell beta testers), and /release promote prints the ones left so nothing gets forgotten.
- Hooks into the release kit through release.json extras; the kit itself stays shared.
- Repo-only. No gameplay effect.

### i17-b28 Count downloads from what's already public (S, 🟡)
tools/numbers.mjs uses gh to read GitHub release download counts and prints a monthly table next to the numbers copied from the Play and Microsoft dashboards. Nothing is added to the game.
- Answers 'is anyone playing?' without a single tracker.
- Repo-only tool.

### i17-b29 A problems log that stays on the phone (S, 🟡)
The last 20 errors are kept in a small local list. Help > 'Problems log' shows them in plain words, and the feedback note includes them only if the player ticks the box.
- Helps fix bugs testers can't describe; nothing is sent unless they choose.
- Touches boot.js error handler, help.js, the feedback note. No gameplay effect.

### i17-b30 One version number everywhere (S, 🟡)
A test checks that VERSION, APP_VERSION in state.js, the top CHANGELOG entry and the site's version line agree, and the store version code is worked out from VERSION.
- Stops 'which version do you have?' confusion between the stores, the site and the game.
- Touches tests, release.json. No gameplay effect.

### i17-b31 A first-five-minutes test like a store reviewer (M, 🟡)
A Playwright test plays like a stranger: title, tutorial, four weeks. It fails if the first life needs more than a set number of taps to start or if any first-week screen shows words from a jargon list.
- Store reviewers and new players judge in minutes; this guards that window.
- Touches tests/. No gameplay effect.

### i17-b32 A small website with the game at /play (L, 🟡)
A site/ folder holds the home page, Get the game, FAQ, roadmap, release notes, press, privacy and parents pages, all built from repo files; the game moves to /play/ with a redirect from the old address so installed apps and saves keep working.
- Big because moving the game's address risks saves; the redirect and a save-key test come first.
- Touches release.json site/app paths, sw.js scope, a new site/ folder. No gameplay effect.
