# The Burg: To-do

_Last updated: November 18, 2026 (review bugs R1–R3 fixed)_

This is the project's working to-do list: what's been done, what's next, and in what order. Every open item has a
matching **GitHub issue** with a priority label (**P1 – now**, **P2 – soon**, **P3 – later**). The issues are the
GitHub to-do list. This document is the readable overview, and the two are kept in sync: when an item is
added, finished or re-prioritized, both change in the same session.

- **Open items:** [Issues](https://github.com/krazow/The-Burg/issues), filterable by
  [P1](https://github.com/krazow/The-Burg/issues?q=is%3Aopen+label%3A%22P1+%E2%80%93+now%22),
  [P2](https://github.com/krazow/The-Burg/issues?q=is%3Aopen+label%3A%22P2+%E2%80%93+soon%22),
  [P3](https://github.com/krazow/The-Burg/issues?q=is%3Aopen+label%3A%22P3+%E2%80%93+later%22),
  [qa](https://github.com/krazow/The-Burg/issues?q=is%3Aopen+label%3Aqa)
- **Waiting on review:** [pull requests](https://github.com/krazow/The-Burg/pulls)
- **✅ Build board:** [check items to have them built](https://claude.ai/artifact/465Un431Hb4B6PNB9WDx9J). It lists every open item (releases, the review, Out and about with its business-name choices, the 90 events, version 2.0). Claude checks it every hour, builds what's checked, and marks each item done with its pull request.

---

## Next up: P1, in order

| # | Item | Why it's next | Issue |
|---|---|---|---|
| 1 | **Cut a new beta** (`/release now`) | `main` now has Around the region and all four gameplay phases (Life Score so far, carpools, backgrounds, modes, town goals, badges, stories, challenges, skills, businesses, weekly challenge, legacy). Beta 4 has none of it. | — |
| 2 | **Try it, then promote** (`/release promote`) | The Android app is signed with The Burg's key since beta 4, so updates install over each other. | — |
| 3 | **Pick from the review and the 90 events** (below) | The three 🔴 review bugs are fixed; the rest is yours to pick. | [#90](https://github.com/krazow/The-Burg/issues/90) |

- [x] Cut a new beta with everything on `main` (0.2.0-beta.5)
- [ ] Try it on your phone, then `/release promote`
- [x] Pick review items and events to build (104 picked on the build board; all built)

## Soon: P2

- [ ] **Manual play-test pass on real phones** (iPhone and Android install, offline, resume) — [#9](https://github.com/krazow/The-Burg/issues/9)

## Feature: Out and about (Waitsburg's real businesses) — built, ships in the next beta

Waitsburg's open businesses come into the game: pins on a Main Street close-up map, places to visit for a small cost
and a small boost, real jobs, and events from their real rhythms (Ten Ton's every-other-week bluegrass jam, Grenache
Fest at Atelier, winter breaks). Business list, how each one appears, decisions and risks:
[docs/out-and-about.md](docs/out-and-about.md). Issues are in the
[Out and about milestone](https://github.com/krazow/The-Burg/milestone/2). It also covers most of
[#11](https://github.com/krazow/The-Burg/issues/11).

**Game names: pick one for each business.** Each business gets a playful stand-in name, so the real name isn't used but locals can still tell which place it is from where it sits on the map. Check one option under each, or write your own; the rest get deleted when you've chosen.

**Food and drink**

- [x] **Bar Bacetto** (119 Main, Italian pasta bar): pick a game name
  - [x] Bar Smacketto
  - [x] The Little Kiss Pasta Bar
  - [x] Bar Buonbacio
  - [x] Noodle Smooch at 119
  - [x] Bar Pastaccio
- [x] **Wolfling Coffee** (206 Main, coffee and pastries): pick a game name
  - [x] Wolf Pup Coffee
  - [x] Howlin' Bean
  - [x] Cub & Cup Coffee
  - [x] Little Wolf Roasters
  - [x] The Den Coffee
- [x] **Atelier Waitsburg** (120 Main, wine tasting and guest chefs): pick a game name
  - [x] The Wine Workshop at 120
  - [x] Atelier Wheatsburg
  - [x] Grenache & Gather
  - [x] The Studio Cellar
  - [x] Petite Atelier
- [x] **The Royal Block** (222 Main, hotel and wine bar): pick a game name
  - [x] The Regal Block
  - [x] The Crown Block Hotel
  - [x] The Royal Brick
  - [x] Kings Row Hotel
  - [x] The Noble Block
- [x] **Laht Neppur Brewing** (444 Preston Ave, brewery (its name is the owner's spelled backwards)): pick a game name
  - [x] Drawkcab Brewing Co. ("backward" spelled backwards)
  - [x] Hatl Nupper Brewing
  - [x] Laughing Lad Ale House
  - [x] Backward Brewing Co.
  - [x] 444 Preston Pub & Brew
- [x] **Whiskey Canyon Sports Bar & Grill** (701 Preston Ave): pick a game name
  - [x] Bourbon Gulch Sports Bar
  - [x] Whiskey Gulch Grill
  - [x] Rye Canyon Sports Bar
  - [x] Whisky Ravine Bar & Grill
  - [x] Moonshine Canyon Grill
- [x] **Mr. C's Smokin' Co.** (405 Preston Ave, BBQ): pick a game name
  - [x] Mr. Q's Smokehouse
  - [x] Mister See's Smokin' Co.
  - [x] Mr. Z's Smoke Shack
  - [x] The Smokin' Mister
  - [x] Mr. C-Saw Smokin' Co.
- [x] **Ten Ton Coffee** (216 Main, open on event days, every-other-week bluegrass jam): pick a game name
  - [x] Eleven Ton Coffee
  - [x] Half Ton Coffee
  - [x] The Heavyweight Coffee Club
  - [x] Tonnage Coffee & Strings
  - [x] Twenty Ton Tunes

**Shops**

- [x] **Waitsburg Grocery** (200 Main): pick a game name
  - [x] Waitsburger Grocery
  - [x] Wait-a-Bit Grocery
  - [x] Burg Basket Grocery
  - [x] Main Street Market
  - [x] Waitsbury Grocery
- [x] **Simply Sawdust** (101 Main, woodshop and makerspace): pick a game name
  - [x] Simply Shavings
  - [x] Plainly Sawdust
  - [x] Just Sawdust
  - [x] Sawdust & Sundries
  - [x] Purely Plywood
- [x] **Gaudy Gals on Main** (Town Hall, vintage and gifts): pick a game name
  - [x] Gussied Gals on Main
  - [x] Glitzy Gals on Main
  - [x] The Junque Sisters
  - [x] Gaudy Galore on Main
  - [x] Flashy Gals on Main
- [x] **Nancy's Dream Garden Center** (503 W. 2nd St.): pick a game name
  - [x] Nancy's Daydream Garden
  - [x] Nan's Dream Greenhouse
  - [x] Fancy Nancy's Garden
  - [x] Dreamy Garden Center
  - [x] Nancy's Bloom & Dream

**Services**

- [x] **Blush Salon & Spa** (141 Main): pick a game name
  - [x] Rouge Salon & Spa
  - [x] Flush Salon
  - [x] Blusher Salon & Spa
  - [x] Pink Cheeks Salon
  - [x] Glow Salon & Spa
- [x] **Banner Bank** (215 Main): pick a game name
  - [x] Pennant Bank
  - [x] Flagstaff Bank
  - [x] Standard Bearer Bank
  - [x] Bunting Bank
  - [x] Banner Day Bank
- [x] **Waitsburg Clinic** (235 Main): pick a game name
  - [x] Waits-a-Minute Clinic
  - [x] The Burg Clinic
  - [x] Main Street Health Hut
  - [x] Touchet Valley Clinic
  - [x] Waitsburg Fix-It Clinic
- [x] **The Times** (216 Main, the local paper): pick a game name
  - [x] The Waitsburg Tymes
  - [x] The Burg Times
  - [x] The Weekly Waits
  - [x] The Main Street Minutes
  - [x] The Touchet Tattler
- [x] **Stone and Sky Yoga** (evening classes): pick a game name
  - [x] Rock and Cloud Yoga
  - [x] Pebble & Sky Yoga
  - [x] Stone and Star Yoga
  - [x] Boulder & Blue Yoga
  - [x] Earth and Air Yoga
- [x] **Hubbard Law Office and Karl Law Office** (145 Main): pick a game name
  - [x] Cupboard & Carl, Attorneys
  - [x] Hubbub & Karl Law
  - [x] The 145 Main Law Offices
  - [x] Mother Hubbard's Legal Cupboard
  - [x] Huffard & Carlo Law

**Farm and trades**

- [x] **McGregor Co.** (115 Garden St., farm supply): pick a game name
  - [x] McGrower Co.
  - [x] McGreener Co.
  - [x] The McFarmer Co.
  - [x] McGrainer Co.
  - [x] McGrub & Grain Co.
- [x] **Local trades**: pick a game name for each
  - [x] **Affordable Concrete**
    - [x] Reasonable Concrete
    - [x] Budget Cement Co.
    - [x] Fair Price Pours
    - [x] Thrifty Concrete
    - [x] Cheap & Cheerful Concrete
  - [x] **Chisel Point Construction**
    - [x] Chisel Tip Construction
    - [x] Sharp Point Builders
    - [x] Gouge Point Construction
    - [x] Pointy Chisel Builders
    - [x] Chisel Peak Construction
  - [x] **Tim's Carpentry**
    - [x] Tom's Carpentry
    - [x] Timber Tim's
    - [x] Tim-ber! Carpentry
    - [x] Jim's Joinery
    - [x] Tim's Trim & Timber
  - [x] **L-C Applicators**
    - [x] L-C Sprayers
    - [x] Elsie Applicators
    - [x] El Sea Applicators
    - [x] LC Spray & Spread
    - [x] K-D Applicators

| # | Item | Size | Issue |
|---|---|---|---|
| 1 | **Decisions and business facts** (your picks): choose the game names above, check the city-list businesses, real days and seasons, `data/places.json` | S | [#48](https://github.com/krazow/The-Burg/issues/48) |
| 2 | **Main Street close-up map** and business pins, business cards, Help guide section | L | [#49](https://github.com/krazow/The-Burg/issues/49) |
| 3 | **Visiting businesses:** a quick Out and about action with capped effects, open days, winter breaks, 21+ rules | L | [#50](https://github.com/krazow/The-Burg/issues/50) |
| 4 | **Business events:** bluegrass jam, Grenache Fest, music night, grill season, winter-break returns; doctor and inheritance at real places | M | [#51](https://github.com/krazow/The-Burg/issues/51) |
| 5 | **Jobs at local businesses:** line cook, barista, grocery clerk, teller, medical assistant, reporter, ag tech, trades apprentice | M | [#52](https://github.com/krazow/The-Burg/issues/52) |
| 6 | **Life systems at real places:** bank, clinic, grocery, local trades, home shopping | M | [#53](https://github.com/krazow/The-Burg/issues/53) |
| 7 | **Out and about QA:** rules, flows, screens, simulation balance | M | [#54](https://github.com/krazow/The-Burg/issues/54) |

- [x] Decisions and business facts — [#48](https://github.com/krazow/The-Burg/issues/48)
- [x] Main Street close-up map — [#49](https://github.com/krazow/The-Burg/issues/49)
- [x] Visiting businesses — [#50](https://github.com/krazow/The-Burg/issues/50)
- [x] Business events — [#51](https://github.com/krazow/The-Burg/issues/51)
- [x] Jobs at local businesses — [#52](https://github.com/krazow/The-Burg/issues/52)
- [x] Life systems at real places — [#53](https://github.com/krazow/The-Burg/issues/53)
- [x] Out and about QA — [#54](https://github.com/krazow/The-Burg/issues/54)

## Soon: Around the region (Dayton, Walla Walla and the Tri-Cities) — built, ships in the next beta

Today the other towns are only places to work. This gives you reasons to go: errands, car care, eating out and
outings, with real trade-offs (cheaper groceries in the big towns cost gas and time; skipping an oil change raises
breakdown odds). Commuters run errands in their work town on the way home. Uses playful stand-in names, like Out and
about, and shares its visit system. Issues are in the
[Around the region milestone](https://github.com/krazow/The-Burg/milestone/3).

**What each town offers:**

| Town | Errands | Eat | Do |
|---|---|---|---|
| **Dayton** (11 mi) | Small grocery, auto repair shop | Small-town café | The old depot, courthouse, Bluewood skiing (already in the game) |
| **Walla Walla** (21 mi) | Big supermarkets, auto parts and tire shops, car wash, hospital and specialists, DMV | Downtown restaurants, tasting rooms (21+) | Farmers market, college games and concerts, movies |
| **Pasco** (58 mi) | Grocery, car dealers | Taquerias and food trucks | Farmers market, the state park where the rivers meet, minor-league baseball, the airport (trip of a lifetime) |
| **Kennewick** (62 mi) | Warehouse store, car dealers, big-box stores, hospital | Mall food court and chains | The mall, Columbia Park, arena events |
| **Richland** (68 mi) | Grocery, car wash | Riverfront dining | Riverfront park, science museum |

| # | Item | Size | Issue |
|---|---|---|---|
| 1 | **Trips on the region map:** tap a town → Make a trip; gas by distance and mpg; combine errands; free for commuters on the way home | M | [#57](https://github.com/krazow/The-Burg/issues/57) |
| 2 | **Grocery runs:** close and pricier in Waitsburg vs. cheaper in the big towns; a monthly stock-up | S | [#58](https://github.com/krazow/The-Burg/issues/58) |
| 3 | **Car care and car wash:** oil changes and tune-ups change breakdown odds, winter tires, car wash, yearly tabs, dealers | M | [#59](https://github.com/krazow/The-Burg/issues/59) |
| 4 | **Dining out by town:** each town's own flavor; dates, birthdays, celebrating a raise | M | [#60](https://github.com/krazow/The-Burg/issues/60) |
| 5 | **Outings and attractions:** markets, parks, games, movies, museum; seasonal where real | M | [#61](https://github.com/krazow/The-Burg/issues/61) |
| 6 | **Appointments in bigger towns:** specialists and hospital, dentist, DMV | S | [#62](https://github.com/krazow/The-Burg/issues/62) |
| 7 | **Around the region QA:** rules, flows, screens, simulation balance | M | [#63](https://github.com/krazow/The-Burg/issues/63) |

- [x] Trips on the region map — [#57](https://github.com/krazow/The-Burg/issues/57)
- [x] Grocery runs — [#58](https://github.com/krazow/The-Burg/issues/58)
- [x] Car care and car wash — [#59](https://github.com/krazow/The-Burg/issues/59)
- [x] Dining out by town — [#60](https://github.com/krazow/The-Burg/issues/60)
- [x] Outings and attractions — [#61](https://github.com/krazow/The-Burg/issues/61)
- [x] Appointments in bigger towns — [#62](https://github.com/krazow/The-Burg/issues/62)
- [x] Around the region QA — [#63](https://github.com/krazow/The-Burg/issues/63)

## Soon: Gameplay recommendations

From a gameplay analysis on November 18 (code review and 104 simulated games): there are no goals until the very
end, long commutes and side hustles are traps, many weeks have no decisions, every life starts the same, school is
the only way to grow, and there's one difficulty for everyone. Full analysis:
[docs/gameplay-recommendations-2026-11-18.md](docs/gameplay-recommendations-2026-11-18.md). In the suggested
order (small, high-impact ones first):

### What I found (prioritized)

The six problems the analysis found, most important first. Each one closes when the recommendations that fix it ship.

| Priority | Finding | Evidence | Fixed by | Issue |
|---|---|---|---|---|
| 1 (P2) | **Long commutes and side hustles don't pay off** | Commuter bot 45 and hustler bot 40 vs 80 for staying in town (5-year games). A balance problem with a small fix. | [#70](https://github.com/krazow/The-Burg/issues/70) | [#79](https://github.com/krazow/The-Burg/issues/79) |
| 2 (P2) | **No goals until the very end** | The Life Score only shows when the game ends. | [#67](https://github.com/krazow/The-Burg/issues/67), [#66](https://github.com/krazow/The-Burg/issues/66), [#74](https://github.com/krazow/The-Burg/issues/74), [#76](https://github.com/krazow/The-Burg/issues/76) | [#80](https://github.com/krazow/The-Burg/issues/80) |
| 3 (P2) | **Many weeks have no decisions** | An event about 1 week in 4; events never build into a story. | [#77](https://github.com/krazow/The-Burg/issues/77), [#68](https://github.com/krazow/The-Burg/issues/68) | [#81](https://github.com/krazow/The-Burg/issues/81) |
| 4 (P3) | **Every life starts the same** | Always 18, the room above Main Street, $1,500 and the 1998 pickup. | [#69](https://github.com/krazow/The-Burg/issues/69), [#74](https://github.com/krazow/The-Burg/issues/74) | [#82](https://github.com/krazow/The-Burg/issues/82) |
| 5 (P3) | **One difficulty for everyone** | Nothing gentler for casual players, nothing harder for experienced ones. | [#73](https://github.com/krazow/The-Burg/issues/73) | [#83](https://github.com/krazow/The-Burg/issues/83) |
| 6 (P3) | **School is the only way to grow** | Nothing to build or invest in beyond homes, vehicles and the 401(k). | [#71](https://github.com/krazow/The-Burg/issues/71), [#72](https://github.com/krazow/The-Burg/issues/72) | [#84](https://github.com/krazow/The-Burg/issues/84) |

- [x] 1. Long commutes and side hustles don't pay off — [#79](https://github.com/krazow/The-Burg/issues/79)
- [x] 2. No goals until the very end — [#80](https://github.com/krazow/The-Burg/issues/80)
- [x] 3. Many weeks have no decisions — [#81](https://github.com/krazow/The-Burg/issues/81)
- [x] 4. Every life starts the same — [#82](https://github.com/krazow/The-Burg/issues/82)
- [x] 5. One difficulty for everyone — [#83](https://github.com/krazow/The-Burg/issues/83)
- [x] 6. School is the only way to grow — [#84](https://github.com/krazow/The-Burg/issues/84)

### Recommendations

| # | Item | Size | Issue |
|---|---|---|---|
| 1 | **Life Score so far on Home** | S | [#67](https://github.com/krazow/The-Burg/issues/67) |
| 2 | **Fix long commutes and side hustles (they score 45 and 40 vs 80 for staying in town)** | S | [#70](https://github.com/krazow/The-Burg/issues/70) |
| 3 | **Starting backgrounds (farm kid, grad coming home, Seattle transplant, young parent)** | S | [#69](https://github.com/krazow/The-Burg/issues/69) |
| 4 | **Relaxed and Hard modes** | S | [#73](https://github.com/krazow/The-Burg/issues/73) |
| 5 | **Season goals in town (Celebration Days, harvest, holiday food drive)** | S | [#77](https://github.com/krazow/The-Burg/issues/77) |
| 6 | **Life goals and achievements** | M | [#66](https://github.com/krazow/The-Burg/issues/66) |
| 7 | **Story chains: events that unfold over weeks** | M | [#68](https://github.com/krazow/The-Burg/issues/68) |
| 8 | **Challenge scenarios (Debt-free in 2 years, Save the family farm, Single parent)** | M | [#74](https://github.com/krazow/The-Burg/issues/74) |
| 9 | **Skills that grow with practice** | M | [#71](https://github.com/krazow/The-Burg/issues/71) |
| 10 | **Weekly challenge and shareable score card** | M | [#75](https://github.com/krazow/The-Burg/issues/75) |
| 11 | **Start your own business** | L | [#72](https://github.com/krazow/The-Burg/issues/72) |
| 12 | **Legacy mode: play on as your kid** | L | [#76](https://github.com/krazow/The-Burg/issues/76) |

- [x] Life Score so far on Home — [#67](https://github.com/krazow/The-Burg/issues/67)
- [x] Fix long commutes and side hustles — [#70](https://github.com/krazow/The-Burg/issues/70)
- [x] Starting backgrounds — [#69](https://github.com/krazow/The-Burg/issues/69)
- [x] Relaxed and Hard modes — [#73](https://github.com/krazow/The-Burg/issues/73)
- [x] Season goals in town — [#77](https://github.com/krazow/The-Burg/issues/77)
- [x] Life goals and achievements — [#66](https://github.com/krazow/The-Burg/issues/66)
- [x] Story chains: events that unfold over weeks — [#68](https://github.com/krazow/The-Burg/issues/68)
- [x] Challenge scenarios — [#74](https://github.com/krazow/The-Burg/issues/74)
- [x] Skills that grow with practice — [#71](https://github.com/krazow/The-Burg/issues/71)
- [x] Weekly challenge and shareable score card — [#75](https://github.com/krazow/The-Burg/issues/75)
- [x] Start your own business — [#72](https://github.com/krazow/The-Burg/issues/72)
- [x] Legacy mode: play on as your kid — [#76](https://github.com/krazow/The-Burg/issues/76)

## Your picks: review and new events

From the testing round after the gameplay fixes. **Pick what you want and tell me**; picked items move into a build
list. Details, balance notes and how each fits the game: [docs/review-and-events-2026-11-18.md](docs/review-and-events-2026-11-18.md).
Building any event pack needs event pacing by category first (review item G5), so new events don't crowd out the
old ones.

<details><summary><b>Review: changes, balancing, gaps and gotchas</b> (40 items) — [#90](https://github.com/krazow/The-Burg/issues/90). 🔴 = recommended first.</summary>

- [x] 🔴 **R1** Backups don't include badges or challenge results
- [x] 🔴 **R2** Pin-at-the-end exploit
- [x] 🔴 **R3** Event costs don't rise with prices
- [x] 🟠 **R4** The version label still says 0.1.0
- [x] 🟡 **R5** Legacy names repeat
- [x] 🟡 **R6** The legacy heir is 18 although the parent died in their 80s
- [x] 🟡 **R7** Weekly challenge best scores pile up
- [x] 🟡 **R8** "Same dice" isn't "same events"
- [x] 🟡 **R9** Weekly challenge week boundaries
- [x] 🟡 **R10** The flood story can start without high water
- [x] 🟡 **R11** Trips don't slow down classes
- [x] 🟡 **R12** The carpool setting sticks
- [x] 🟡 **R13** Business value rises with prices forever
- [x] ⚪ **R14** Vehicle tabs are a flat $95
- [x] ⚪ **R15** Hard mode's +10% living costs
- [x] ⚪ **R16** Relaxed mode
- [x] 🟠 **B1** Careless play in long games
- [x] 🟠 **B2** Doing nothing in 6-month games
- [x] 🟠 **B3** The grad start is very strong
- [x] 🟠 **B4** The young parent isn't harder
- [x] 🟠 **B5** Weekly trips forever end in debt in Lifetime games
- [x] 🟠 **B6** Stock-up runs barely pay off from the Tri-Cities
- [x] 🟠 **B7** Story rewards were trimmed once
- [x] 🟠 **B8** The long-commute overtime grinder
- [x] ⚪ **B9** Side hustle experience never fades
- [x] ⚪ **B10** Life Score so far looks harsh early
- [ ] 🟡 **G1** The tutorial doesn't show the new features
- [x] 🟡 **G2** The title screen is long
- [x] 🟡 **G3** The screen checks don't cover the newest pop-ups
- [ ] 🟡 **G4** Score cards need checking on real devices
- [x] 🟡 **G5** Events will thin out as more are added
- [x] 🟡 **G6** No in-game "What's new"
- [x] ⚪ **G7** Best scores per mode and challenge
- [x] ⚪ **G8** Journal filters
- [x] ⚪ **G9** Out and about
- [x] ⚪ **G10** A beta with all of this
- [x] 🟡 **T1** The careless and idle ceilings are report-only
- [x] 🟡 **T2** The full test run takes about 15 minutes
- [x] ⚪ **T3** index.html is about 2,400 lines
- [x] ⚪ **T4** The exploratory tests

</details>

<details><summary><b>Event pack A: 30 events in Waitsburg</b> — [#91](https://github.com/krazow/The-Burg/issues/91)</summary>

- [ ] **W1** Preston Park cleanup day (April)
- [ ] **W2** Bruce House museum open house (June)
- [ ] **W3** Fourth of July parade (July)
- [ ] **W4** Trout opener on Coppei Creek (April)
- [ ] **W5** Library book sale (October)
- [ ] **W6** FFA bake sale (Any)
- [ ] **W7** Neighbor's chickens loose in your yard (Spring–summer)
- [ ] **W8** Ice storm knocks out power (Dec–Feb)
- [ ] **W9** Frozen pipes (Dec–Feb, homeowners)
- [ ] **W10** Citywide yard sale (June)
- [ ] **W11** School fundraiser auction (March)
- [ ] **W12** Fire district pancake breakfast (May)
- [ ] **W13** Smoke from a wheat-field fire (August)
- [ ] **W14** Mice in the walls (October)
- [ ] **W15** An old friend moves back (Any)
- [ ] **W16** Snow day (Dec–Feb)
- [ ] **W17** Community potluck at Town Hall (Fall)
- [ ] **W18** "Lost dog" poster (Any, no dog)
- [ ] **W19** Pour beer at the Celebration Days beer garden (May, 21+)
- [ ] **W20** Town Hall roof fundraiser (Any)
- [ ] **W21** Adopt a Main Street flower basket (April)
- [ ] **W22** Little League needs a coach (March, community 30+)
- [ ] **W23** A cross-country cyclist asks for water (Summer)
- [ ] **W24** Late frost kills the garden (May, homeowners)
- [ ] **W25** Christmas lights contest (December)
- [ ] **W26** Neighbor's tree takes out your fence (After a Windstorm, homeowners)
- [ ] **W27** Barn dance at the fairgrounds (October)
- [ ] **W28** Wild turkeys strut down Main Street (Spring)
- [ ] **W29** Graduation party invitations (June)
- [ ] **W30** Rattlesnake in the woodpile (Summer)

</details>

<details><summary><b>Event pack B: 30 events on the road and in other towns</b> — [#92](https://github.com/krazow/The-Burg/issues/92)</summary>

- [x] **R-1** Deer on Highway 12 at dusk (Commuters, Oct–Jan)
- [x] **R-2** Stuck behind a wheat truck (Harvest, Jul–Aug)
- [x] **R-3** Fog in the Touchet Valley (Nov–Jan)
- [x] **R-4** Flat tire on US-12 (Any)
- [x] **R-5** Speeding ticket (Commuters)
- [x] **R-6** Road-construction detour (Summer)
- [x] **R-7** A stranded driver on the shoulder (Any)
- [x] **R-8** Your carpool buddy is always late (Carpoolers)
- [x] **R-9** An audiobook habit on the commute (Commute 40+ miles)
- [x] **R-10** Dust storm near the Tri-Cities (Summer)
- [x] **R-11** Hot-air balloon festival in Walla Walla (May)
- [x] **R-12** A free college lecture in Walla Walla (School year)
- [x] **R-13** A friend is in the hospital in Walla Walla (Any)
- [x] **R-14** Wine release weekend in Walla Walla (Spring and fall, 21+)
- [x] **R-15** Train crossing in Pasco (Pasco commuters)
- [x] **R-16** Cheap flight deal out of Pasco (Any, money $1,000+)
- [x] **R-17** Spring festival in Pasco (May)
- [x] **R-18** Hydroplane races on the Columbia (July)
- [x] **R-19** Fourth of July fireworks in Columbia Park (July)
- [x] **R-20** Clearance sale at the mall (January and August)
- [x] **R-21** A test drive at a dealership (Kennewick or Pasco trips)
- [x] **R-22** Riverfront 5K in Richland (April and September)
- [x] **R-23** Hanford history tour (Any, Richland trips)
- [x] **R-24** Classic car show in Dayton (June)
- [x] **R-25** Bluewood season pass sale (October)
- [x] **R-26** Chains required on the road to Bluewood (Dec–Feb, Dayton trips)
- [x] **R-27** Wrong pump at the gas station (Any, low weight)
- [x] **R-28** A lost wallet in a Walla Walla parking lot (Any)
- [x] **R-29** Pothole season (March)
- [x] **R-30** A friendly regular at the gas station (Commuters, once)

</details>

<details><summary><b>Event pack C: 30 events at work</b> — [#93](https://github.com/krazow/The-Burg/issues/93)</summary>

- [x] **J1** Your performance review (Any job, 26+ weeks in)
- [x] **J2** A promotion offer (Any job, 52+ weeks in)
- [x] **J3** Mandatory overtime week (Field and service)
- [x] **J4** A coworker conflict (Any)
- [x] **J5** Free training course (Any job)
- [x] **J6** Hurt on the job (Field and transport)
- [x] **J7** Employee of the month (Any; odds up with People)
- [x] **J8** New manager (Any)
- [x] **J9** Holiday party (December)
- [x] **J10** Train the new hire (Any, 26+ weeks in)
- [x] **J11** A big mistake at work (Any, 15% weight)
- [x] **J12** Equipment breaks down (Field and transport)
- [x] **J13** Flu going around (Dec–Feb)
- [x] **J14** A customer compliment (Service and care)
- [x] **J15** A rude customer (Service)
- [x] **J16** Workplace fundraiser (Any)
- [x] **J17** The boss offers a weekend gig (Field and trades)
- [x] **J18** Conference trip (Office and care)
- [x] **J19** A coworker retires (Any)
- [x] **J20** New software rollout (Office)
- [x] **J21** Payroll error: a late paycheck (Any, low weight)
- [x] **J22** Year-end bonus (Office and care, December)
- [x] **J23** Lunchroom potluck (Any)
- [x] **J24** Cover a double shift (Service, care and field)
- [x] **J25** Harvest crunch (Elevator, cellar hand, onion shed, Jul–Sep)
- [x] **J26** Safety inspection (Field and transport)
- [x] **J27** A recruiter calls (Any, community 30+)
- [x] **J28** A remote-day trial (Office jobs without remote days)
- [x] **J29** Health plan choice (Any, January)
- [x] **J30** A work friend's wedding (Any)

</details>

## Ideas round 1 (pick on the build board)

64 ideas. Details: [docs/ideas/round-1.md](docs/ideas/round-1.md). 🔴 = recommended first.

<details><summary><b>Ideas 1: Gameplay depth</b> (32 ideas)</summary>

- [ ] 🔴 **i1-a01** Work standing at your job (M)
- [ ] 🔴 **i1-a02** Community standing perks (M)
- [ ] 🔴 **i1-a03** Home upgrades for owners (M)
- [ ] 🟠 **i1-a04** Council seat that votes (M)
- [ ] 🔴 **i1-a05** Savings account and savings goals (S)
- [ ] 🟠 **i1-a06** Credit score (M)
- [ ] 🟠 **i1-a07** Refinance your debt at the bank (S)
- [ ] 🟠 **i1-a08** Take a roommate (S)
- [ ] 🟠 **i1-a09** A garden plot (M)
- [ ] 🟡 **i1-a10** Hunting and fishing licenses (S)
- [ ] 🟡 **i1-a11** Winter heating bills (S)
- [ ] 🟡 **i1-a12** Tax refund season (S)
- [ ] 🟠 **i1-a13** Take a real vacation (M)
- [ ] 🟠 **i1-a14** Partner closeness (M)
- [ ] 🟠 **i1-a15** Kids grow up: stages and choices (L)
- [ ] 🟠 **i1-a16** Aging parents (M)
- [ ] 🟡 **i1-a17** Your dog grows old (S)
- [ ] 🟠 **i1-a18** Become a landlord (L)
- [ ] 🟠 **i1-a19** Grow your business (M)
- [ ] 🟠 **i1-a20** Good years and bad years in the valley (M)
- [ ] 🟠 **i1-a21** Volunteer fire department (M)
- [ ] 🟠 **i1-a22** Healthy habits (M)
- [ ] 🟡 **i1-a23** Old injuries that linger (M)
- [ ] 🟠 **i1-a24** Choose when to retire (M)
- [ ] 🟠 **i1-a25** Lead a big town project (M)
- [ ] 🟡 **i1-a26** Chores pile up (S)
- [ ] 🟡 **i1-a27** Employer pays for school (S)
- [ ] 🟡 **i1-a28** Truck miles add up (S)
- [ ] 🟡 **i1-a29** Grandkids (S)
- [ ] 🟡 **i1-a30** Decade check-ins (M)
- [ ] 🟡 **i1-a31** A stall at the summer market (M)
- [ ] 🟡 **i1-a32** A second, lighter focus (M)

</details>

<details><summary><b>Ideas 1: Town and people</b> (32 ideas)</summary>

- [ ] 🔴 **i1-b01** Named neighbors on your street (L)
- [ ] 🔴 **i1-b02** Community roles you hold over time (L)
- [ ] 🔴 **i1-b03** Join the volunteer fire department (M)
- [ ] 🔴 **i1-b04** Favors you can call in (M)
- [ ] 🔴 **i1-b05** A partner with a name and a path to the altar (M)
- [ ] 🟠 **i1-b06** A relationship meter instead of coin flips (S)
- [ ] 🟠 **i1-b07** Your partner has their own job (M)
- [ ] 🔴 **i1-b08** Kids grow up in stages (M)
- [ ] 🔴 **i1-b09** Aging parents in town (M)
- [ ] 🔴 **i1-b10** Holidays at home (S)
- [ ] 🟠 **i1-b11** A council term with real votes (M)
- [ ] 🟠 **i1-b12** Your kid raises an FFA market lamb (M)
- [ ] 🟠 **i1-b13** Name your dog, and dogs grow old (M)
- [ ] 🟠 **i1-b14** Barn cat, chickens and a horse (M)
- [ ] 🟡 **i1-b15** Adopt a pet on purpose (S)
- [ ] 🟠 **i1-b16** Home upkeep for owners (M)
- [ ] 🟠 **i1-b17** A backyard garden (M)
- [ ] 🟡 **i1-b18** Firewood and fall chores (S)
- [ ] 🟠 **i1-b19** Take in a roommate or rent the spare room (S)
- [ ] 🟡 **i1-b20** More places to live in town (S)
- [ ] 🟠 **i1-b21** Roles for retirees (S)
- [ ] 🟠 **i1-b22** Lonely stretches (S)
- [ ] 🟠 **i1-b23** Trade childcare with neighbors (S)
- [ ] 🟠 **i1-b24** The Burg almanac: town calendar and memory book (M)
- [ ] 🟠 **i1-b25** What the town says about you (M)
- [ ] 🟠 **i1-b26** Funerals and the house next door (S)
- [ ] 🟡 **i1-b27** Welcome the new family (S)
- [ ] 🟡 **i1-b28** Birthdays that matter (S)
- [ ] 🟡 **i1-b29** Class reunion every ten years (S)
- [ ] 🟡 **i1-b30** A best friend through the years (M)
- [ ] 🟠 **i1-b31** Grown kids who stay or go (M)
- [ ] 🟡 **i1-b32** Sunday crew: a congregation or the Grange (S)

</details>

## Ideas round 2 (pick on the build board)

62 ideas. Details: [docs/ideas/round-2.md](docs/ideas/round-2.md). 🔴 = recommended first.

<details><summary><b>Ideas 2: Play experience</b> (32 ideas)</summary>

- [ ] 🔴 **i2-a01** Show what each event choice does (S)
- [ ] 🔴 **i2-a02** Preview what this week's focus will do (S)
- [ ] 🔴 **i2-a03** A Settings sheet in the Menu (M)
- [ ] 🟠 **i2-a04** Vibration on phones (S)
- [ ] 🟠 **i2-a05** Small sounds, made in code (M)
- [ ] 🟠 **i2-a06** Text size setting (S)
- [ ] 🟠 **i2-a07** Night theme (M)
- [ ] 🟠 **i2-a08** Stats that count up after a week (S)
- [ ] 🟡 **i2-a09** Seasons on the town scene (M)
- [ ] 🟠 **i2-a10** A real moment for badges and milestones (S)
- [ ] 🔴 **i2-a11** Auto until something you choose (M)
- [ ] 🔴 **i2-a12** A weekly focus rotation (M)
- [ ] 🔴 **i2-a13** Don't stop skips for events with no choice (M)
- [ ] 🔴 **i2-a14** "Previously in the Burg" when you come back (S)
- [ ] 🟡 **i2-a15** A good place to stop (S)
- [ ] 🟠 **i2-a16** First-month checklist in a real game (M)
- [ ] 🟠 **i2-a17** First-time explainers for new systems (S)
- [ ] 🟠 **i2-a18** Early warning when a stat keeps falling (S)
- [ ] 🟠 **i2-a19** One "next step" hint on Home (S)
- [ ] 🟡 **i2-a20** Tap a word to see what it means (S)
- [ ] 🟡 **i2-a21** Why did that happen? (M)
- [ ] 🟡 **i2-a22** Swipe between tabs and to close sheets (M)
- [ ] 🟡 **i2-a23** Skip options behind a long-press on End Week (S)
- [ ] 🟡 **i2-a24** Event choices in thumb reach (S)
- [ ] 🟡 **i2-a25** Undo Life-tab changes before End Week (S)
- [ ] 🟡 **i2-a26** Keyboard shortcuts on desktop and Windows (S)
- [ ] 🟡 **i2-a27** Two columns on tablets and landscape (M)
- [ ] 🟡 **i2-a28** Watch the weeks roll by on Auto (M)
- [ ] 🟠 **i2-a29** Your life story at the ending (M)
- [ ] 🟠 **i2-a30** Install the app at the right moment (S)
- [ ] 🟡 **i2-a31** High-contrast and color-blind check (S)
- [ ] 🟠 **i2-a32** Big choices say what will change (S)

</details>

<details><summary><b>Ideas 2: Replay and progression</b> (30 ideas)</summary>

- [ ] 🔴 **i2-b01** Your life in the Tattler: an obituary at the end (S)
- [ ] 🔴 **i2-b02** Where are they now: epilogue lines (S)
- [ ] 🔴 **i2-b03** Lives lived: a shelf of every finished life (M)
- [ ] 🔴 **i2-b04** Unlockable starts earned across lives (M)
- [ ] 🟠 **i2-b05** Start in the middle of life (M)
- [ ] 🟠 **i2-b06** Five new challenges, unlocked as a ladder (M)
- [ ] 🟠 **i2-b07** Bronze, silver and gold on every challenge (S)
- [ ] 🔴 **i2-b08** A badge book with hidden badges and progress (M)
- [ ] 🟡 **i2-b09** Badges with levels (S)
- [ ] 🔴 **i2-b10** The Burg album: every event you have seen (M)
- [ ] 🟠 **i2-b11** Story endings to collect (S)
- [ ] 🔴 **i2-b12** Life paths: what kind of life it was (M)
- [ ] 🔴 **i2-b13** Heirlooms in legacy mode (M)
- [ ] 🟠 **i2-b14** The family tree (M)
- [ ] 🟠 **i2-b15** Previous lives show up in town (M)
- [ ] 🟠 **i2-b16** The town grows across your lives (L)
- [ ] 🔴 **i2-b17** Daily 4-week sprint (M)
- [ ] 🟠 **i2-b18** Weekly challenge twists (S)
- [ ] 🟡 **i2-b19** Weekly streak and history (S)
- [ ] 🔴 **i2-b20** Challenge a friend with a life code (M)
- [ ] 🟠 **i2-b21** Race your best run (S)
- [ ] 🟠 **i2-b22** Family night: take turns on the same life (M)
- [ ] 🟡 **i2-b23** A life story score card (S)
- [ ] 🟠 **i2-b24** Stars for every start and mode (S)
- [ ] 🟡 **i2-b25** Next unlock on the title screen (S)
- [ ] 🟡 **i2-b26** Your personal town records (S)
- [ ] 🟡 **i2-b27** Holiday specials on the real calendar (S)
- [ ] 🟠 **i2-b28** Retirement chapter: choose your last years (M)
- [ ] 🟡 **i2-b29** A keepsake shelf on Home (S)
- [ ] 🟡 **i2-b30** Score card shows your best and your record (S)

</details>

## Ideas round 3 (pick on the build board)

68 ideas. Details: [docs/ideas/round-3.md](docs/ideas/round-3.md). 🔴 = recommended first.

<details><summary><b>Ideas 3: Money, work and the valley</b> (34 ideas)</summary>

- [ ] 🔴 **i3-a01** Job ladders with named rungs (M)
- [ ] 🔴 **i3-a02** Pick a program, not just a level (M)
- [ ] 🔴 **i3-a03** Short certificates: CDL, welding, phlebotomy, notary (S)
- [ ] 🟠 **i3-a04** Apprenticeships: earn while you learn a trade (M)
- [ ] 🟠 **i3-a05** More valley jobs: wind farms, dams, the Forest Service (S)
- [ ] 🟡 **i3-a06** Seasonal jobs that end and start again (M)
- [ ] 🟠 **i3-a07** Interviews with a choice or two (M)
- [ ] 🟡 **i3-a08** Negotiate the offer (S)
- [ ] 🟡 **i3-a09** References follow you (S)
- [ ] 🟠 **i3-a10** A union card at the rail yard, Hanford and the hospital (M)
- [ ] 🟡 **i3-a11** Federal shutdown furlough (S)
- [ ] 🟡 **i3-a12** A security clearance for Hanford and the lab (S)
- [ ] 🟠 **i3-a13** Remote job for a Seattle company (M)
- [ ] 🟡 **i3-a14** Ride the county bus to Walla Walla (S)
- [ ] 🟠 **i3-a15** Wheat prices: sell at harvest or store it (M)
- [ ] 🟠 **i3-a16** Crop insurance for the wheat lease (S)
- [ ] 🟡 **i3-a17** Wine futures with a Walla Walla winery (M)
- [ ] 🟡 **i3-a18** A small cattle herd in the foothills (M)
- [ ] 🔴 **i3-a19** A real insurance sheet: truck, renters, home (M)
- [ ] 🟠 **i3-a20** Property taxes for owners (S)
- [ ] 🟠 **i3-a21** The valley's housing market (M)
- [ ] 🟡 **i3-a22** Mortgage rates and refinancing (S)
- [ ] 🟡 **i3-a23** Borrow against your home (S)
- [ ] 🔴 **i3-a24** Public pensions for school, county and state jobs (M)
- [ ] 🟠 **i3-a25** Social Security that reflects your work (S)
- [ ] 🟠 **i3-a26** Collections when debt drags on (S)
- [ ] 🟡 **i3-a27** Bankruptcy instead of leaving town (M)
- [ ] 🔴 **i3-a28** A 3-month money outlook (S)
- [ ] 🟡 **i3-a29** A brokerage account with good and bad years (M)
- [ ] 🟡 **i3-a30** Retire south for the winter (S)
- [ ] 🟠 **i3-a31** Long-term care late in life (M)
- [ ] 🟡 **i3-a32** Endow a scholarship at Waitsburg High (S)
- [ ] 🟡 **i3-a33** Write a will (S)
- [ ] 🟡 **i3-a34** Rent your spare room on wine weekends (S)

</details>

<details><summary><b>Ideas 3: App and platform</b> (34 ideas)</summary>

- [ ] 🔴 **i3-b01** Keep beta saves apart from real saves (S)
- [ ] 🔴 **i3-b02** An open event survives closing the app (S)
- [ ] 🔴 **i3-b03** Ask the phone to keep your saves (S)
- [ ] 🔴 **i3-b04** Last-good copy of every life (S)
- [ ] 🟠 **i3-b05** Save repair and versioned updates (M)
- [ ] 🟠 **i3-b06** Tell the player when a save fails (S)
- [ ] 🔴 **i3-b07** A friendly screen when something breaks (S)
- [ ] 🔴 **i3-b08** Update ready: refresh between weeks (S)
- [ ] 🟠 **i3-b09** Check the offline file list in tests (S)
- [ ] 🟠 **i3-b10** Move a life with a QR code (M)
- [ ] 🟠 **i3-b11** Merge restore: the newest copy of each life wins (M)
- [ ] 🟡 **i3-b12** Hand off a life instead of copying it (S)
- [ ] 🟡 **i3-b13** A gentle backup reminder (S)
- [ ] 🟠 **i3-b14** Light mode for old phones (S)
- [ ] 🟠 **i3-b15** Auto weeks without redrawing every one (M)
- [ ] 🟡 **i3-b16** Draw maps only when they're opened (S)
- [ ] 🟠 **i3-b17** A speed test on a slow phone (S)
- [ ] 🟠 **i3-b18** A plain message on browsers that are too old (S)
- [ ] 🟠 **i3-b19** Pause Auto when you leave the app (S)
- [ ] 🟠 **i3-b20** Language groundwork: one place for all words (M)
- [ ] 🟡 **i3-b21** The Burg en español (L)
- [ ] 🟠 **i3-b22** Play Store kit: screenshots, listing, privacy answers (M)
- [ ] 🟠 **i3-b23** Protect saves in the Windows app (S)
- [ ] 🟡 **i3-b24** Install shortcuts and a richer install sheet (S)
- [ ] 🔴 **i3-b25** What this game knows about you (S)
- [ ] 🟠 **i3-b26** Feedback without tracking (M)
- [ ] 🟡 **i3-b27** Share a single moment as a picture (M)
- [ ] 🟡 **i3-b28** Tell a friend: a link and a QR to install (S)
- [ ] 🟠 **i3-b29** A replay test that catches accidental balance shifts (S)
- [ ] 🟠 **i3-b30** A hidden builder panel (M)
- [ ] 🟠 **i3-b31** Check every event is well-formed (S)
- [ ] 🟡 **i3-b32** Catch name clashes between script files (S)
- [ ] 🟡 **i3-b33** A map of what the tests never touch (S)
- [ ] 🟡 **i3-b34** A badge on the app icon for the new weekly challenge (S)

</details>

## Ideas round 4 (pick on the build board)

63 ideas. Details: [docs/ideas/round-4.md](docs/ideas/round-4.md). 🔴 = recommended first.

<details><summary><b>Ideas 4: Stories and seasons</b> (32 ideas)</summary>

- [ ] 🔴 **i4-a01** Tattler headlines from your own week (S)
- [ ] 🟠 **i4-a02** Write a letter to the editor (S)
- [ ] 🟠 **i4-a03** Tattler classifieds you can answer (M)
- [ ] 🔴 **i4-a04** The trunk in the attic (M)
- [ ] 🟠 **i4-a05** The Cardinals make a playoff run (M)
- [ ] 🟠 **i4-a06** Build a float for the Celebration Days parade (M)
- [ ] 🟠 **i4-a07** Enter something at the county fair (M)
- [ ] 🔴 **i4-a08** Coffee with an old-timer (M)
- [ ] 🟠 **i4-a09** The empty storefront on Main Street (M)
- [ ] 🟠 **i4-a10** Work a whole harvest with a farm family (M)
- [ ] 🟠 **i4-a11** Letters from a friend who left (M)
- [ ] 🟡 **i4-a12** The Sunday phone call (S)
- [ ] 🟠 **i4-a13** A Mailbox on Home (M)
- [ ] 🟡 **i4-a14** Christmas cards (S)
- [ ] 🟠 **i4-a15** A shoebox of twelve photos (M)
- [ ] 🔴 **i4-a16** New Year's resolutions (S)
- [ ] 🔴 **i4-a17** A line about the weather and the land (S)
- [ ] 🟠 **i4-a18** The long winter (M)
- [ ] 🔴 **i4-a19** Celebration Days as a planned weekend (M)
- [ ] 🟡 **i4-a20** The goat that won't be caught (S)
- [ ] 🟡 **i4-a21** Sheriff's log in the Tattler (S)
- [ ] 🟡 **i4-a22** The old pickup's last ride (S)
- [ ] 🔴 **i4-a23** A last walk down Main Street (M)
- [ ] 🔴 **i4-a24** Unfinished business (S)
- [ ] 🟠 **i4-a25** The school bond vote (M)
- [ ] 🟠 **i4-a26** A town story that spans years (L)
- [ ] 🟡 **i4-a27** Little firsts (S)
- [ ] 🟠 **i4-a28** The dry summer (M)
- [ ] 🟡 **i4-a29** The reporter's big story (M)
- [ ] 🟡 **i4-a30** A year ago today (S)
- [ ] 🔴 **i4-a31** A time capsule at Celebration Days (M)
- [ ] 🟠 **i4-a32** Gossip at the café table (S)

</details>

<details><summary><b>Ideas 4: Challenge and new modes</b> (31 ideas)</summary>

- [ ] 🔴 **i4-b01** Heat levels above Hard (M)
- [ ] 🔴 **i4-b02** Ironman lives (S)
- [ ] 🔴 **i4-b03** House rules you set before you start (M)
- [ ] 🔴 **i4-b04** Contracts on the bulletin board (M)
- [ ] 🔴 **i4-b05** A comeback arc after a hard fall (M)
- [ ] 🟠 **i4-b06** Hospital bills: payment plan or charity care (S)
- [ ] 🔴 **i4-b07** Bigger money brings bigger asks (M)
- [ ] 🟠 **i4-b08** Custom mode: set your own sliders (M)
- [ ] 🟠 **i4-b09** Mode check-in at the end of year one (S)
- [ ] 🟠 **i4-b10** A gentle first season on your first life (S)
- [ ] 🟠 **i4-b11** One do-over a year (S)
- [ ] 🟠 **i4-b12** Stake a life goal (S)
- [ ] 🟠 **i4-b13** Push your luck at harvest (M)
- [ ] 🟠 **i4-b14** Go all in on a week (M)
- [ ] 🟡 **i4-b15** Small bets at the Days horse races (S)
- [ ] 🟡 **i4-b16** Grange raffle tickets (S)
- [ ] 🟠 **i4-b17** Fishing the Touchet: a quick tap game (M)
- [ ] 🟡 **i4-b18** Pie and preserves at the fair (S)
- [ ] 🟠 **i4-b19** Kitchen-table bills when money is short (M)
- [ ] 🟠 **i4-b20** Puzzle weeks (M)
- [ ] 🟠 **i4-b21** Speedrun goals: fewest weeks (M)
- [ ] 🟡 **i4-b22** Porch mode: a sandbox (S)
- [ ] 🟡 **i4-b23** Blitz: a clock on every week (S)
- [ ] 🟠 **i4-b24** The Joneses: a rival life next door (M)
- [ ] 🟡 **i4-b25** Two households, one town (L)
- [ ] 🟠 **i4-b26** Dynasty: a family score across generations (L)
- [ ] 🟡 **i4-b27** Sheriff's auction fixer-upper (M)
- [ ] 🟡 **i4-b28** Hard hides the exact numbers (S)
- [ ] 🟡 **i4-b29** A grit rating for harder lives (S)
- [ ] 🟠 **i4-b30** Big seasonal tests you can prepare for (M)
- [ ] 🟡 **i4-b31** The sim plays every new mode and rule (S)

</details>

## Ideas round 5 (pick on the build board)

60 ideas. Details: [docs/ideas/round-5.md](docs/ideas/round-5.md). 🔴 = recommended first.

<details><summary><b>Ideas 5: Fresh-eyes playtest</b> (28 ideas)</summary>

- [ ] 🔴 **i5-a01** Fix age running a year behind at birthdays (S)
- [ ] 🔴 **i5-a02** Life Score so far is right in the first month (S)
- [ ] 🔴 **i5-a03** Year in review counts the big moments (S)
- [ ] 🔴 **i5-a04** Signature yearly events always happen (S)
- [ ] 🔴 **i5-a05** Active perks with weeks left on Home (S)
- [ ] 🟠 **i5-a06** Event results link to the screen they're about (S)
- [ ] 🟠 **i5-a07** Job tips show take-home and the drive (S)
- [ ] 🟠 **i5-a08** Job board shows what the drive costs you in happiness (S)
- [ ] 🟡 **i5-a09** Switching jobs shows what you give up (S)
- [ ] 🟠 **i5-a10** Happiness at the top needs something new (L)
- [ ] 🟠 **i5-a11** Pay extra on the mortgage or truck loan (M)
- [ ] 🟡 **i5-a12** A heads-up when cash just sits there (S)
- [ ] 🟡 **i5-a13** Fold out-and-about into one Journal line a week (S)
- [ ] 🟠 **i5-a14** Out and about shows what's new to you (S)
- [ ] 🟡 **i5-a15** Events notice what you've already done (S)
- [ ] 🟠 **i5-a16** Fresh text for events that repeat (L)
- [ ] 🟠 **i5-a17** Event drought guard (S)
- [ ] 🟡 **i5-a18** One-choice events as a quick news card (S)
- [ ] 🟡 **i5-a19** Choice labels show the real cost (S)
- [ ] 🟡 **i5-a20** A turned-down date isn't a dead end (M)
- [ ] 🟡 **i5-a21** Nudge to finish a half-done degree (S)
- [ ] 🟠 **i5-a22** End screen: one thing to try next time (S)
- [ ] 🟡 **i5-a23** The last year gets a review too (S)
- [ ] 🟡 **i5-a24** Your work history on the Jobs tab (S)
- [ ] 🟡 **i5-a25** Tips put themselves away once you've done the thing (S)
- [ ] 🟡 **i5-a26** Suggest Auto in a quiet stretch (S)
- [ ] 🟡 **i5-a27** Score pill shows the trend (S)
- [ ] 🟠 **i5-a28** A playtest bot that writes a readable story (M)

</details>

<details><summary><b>Ideas 5: Outdoors and the region</b> (32 ideas)</summary>

- [ ] 🔴 **i5-b01** A forecast chip that changes this week's focus (M)
- [ ] 🔴 **i5-b02** Smoke weeks: an air-quality meter in late summer (M)
- [ ] 🔴 **i5-b03** Pick where you get outside (M)
- [ ] 🟠 **i5-b04** Camp at Lewis and Clark Trail State Park (S)
- [ ] 🟠 **i5-b05** An outdoor gear shelf (M)
- [ ] 🔴 **i5-b06** An Outdoors skill (S)
- [ ] 🟠 **i5-b07** The elk draw: apply in spring, hunt in fall (M)
- [ ] 🟡 **i5-b08** Winter steelhead on the Touchet (S)
- [ ] 🟡 **i5-b09** Morel season in the Blues (S)
- [ ] 🟡 **i5-b10** Pheasant opener on a neighbor's stubble (S)
- [ ] 🟡 **i5-b11** Huckleberry picking in August (S)
- [ ] 🟠 **i5-b12** Lost on a Blue Mountains trail (S)
- [ ] 🟡 **i5-b13** Join county search and rescue (M)
- [ ] 🟠 **i5-b14** Fire season closes the Blues (S)
- [ ] 🟡 **i5-b15** The wheat hills change color on the region map (S)
- [ ] 🟠 **i5-b16** Prescott, Dixie, Starbuck and Pomeroy as day trips (M)
- [ ] 🟠 **i5-b17** Milton-Freewater: big buys without sales tax (S)
- [ ] 🔴 **i5-b18** Weekend road trips: Spokane, Pendleton, Lewiston, Seattle (L)
- [ ] 🟠 **i5-b19** Zoom the map out to the Northwest (M)
- [ ] 🟡 **i5-b20** Pendleton Round-Up in September (S)
- [ ] 🟡 **i5-b21** Snoqualmie Pass report on Seattle trips (S)
- [ ] 🟠 **i5-b22** Heat wave week and the cooling bill (S)
- [ ] 🟠 **i5-b23** Winter blues and short days (S)
- [ ] 🟠 **i5-b24** A wildlife life list (M)
- [ ] 🟠 **i5-b25** Plant willows on Coppei Creek (S)
- [ ] 🟠 **i5-b26** Work weekends at Bluewood for a free pass (S)
- [ ] 🟡 **i5-b27** Tubing the Touchet in July (S)
- [ ] 🟡 **i5-b28** Burn ban season (S)
- [ ] 🟠 **i5-b29** Bring someone outside with you (S)
- [ ] 🟠 **i5-b30** A year outside: a seasonal outing card (M)
- [ ] 🟡 **i5-b31** Ski lessons for you or the kids (S)
- [ ] 🟡 **i5-b32** A cabin up the Touchet road (L)

</details>

## Ideas round 6 (pick on the build board)

64 ideas. Details: [docs/ideas/round-6.md](docs/ideas/round-6.md). 🔴 = recommended first.

<details><summary><b>Ideas 6: Family and generations</b> (32 ideas)</summary>

- [ ] 🔴 **i6-a01** Name your kids, and see them on the Family card (S)
- [ ] 🔴 **i6-a02** How you raised them shapes the heir (M)
- [ ] 🔴 **i6-a03** A 529 college fund for each kid (M)
- [ ] 🔴 **i6-a04** A letter from your grandparent (S)
- [ ] 🔴 **i6-a05** Split the estate among your kids (S)
- [ ] 🔴 **i6-a06** Family traditions that carry down (M)
- [ ] 🔴 **i6-a07** Empty nest: the house goes quiet (M)
- [ ] 🟠 **i6-a08** Raising teens: a parenting style (M)
- [ ] 🟠 **i6-a09** Hand the old truck down to your teen (S)
- [ ] 🟠 **i6-a10** A brother or sister in the valley (M)
- [ ] 🟠 **i6-a11** In-laws come with the partner (M)
- [ ] 🟡 **i6-a12** Your own family reunion at the park (S)
- [ ] 🟠 **i6-a13** Memorial Day at the family plot (S)
- [ ] 🟠 **i6-a14** Bring your teen into the family business (M)
- [ ] 🟠 **i6-a15** Hand the business to a grown kid (L)
- [ ] 🟠 **i6-a16** The family home keeps its history (M)
- [ ] 🟠 **i6-a17** Boomerang kid moves back home (S)
- [ ] 🟡 **i6-a18** Help a grown kid with a down payment (S)
- [ ] 🟡 **i6-a19** Your kid's wedding (S)
- [ ] 🟡 **i6-a20** A partner with kids from before (S)
- [ ] 🟡 **i6-a21** Co-parenting after a split (M)
- [ ] 🟡 **i6-a22** Foster a kid through the county (M)
- [ ] 🟠 **i6-a23** Inherited favors and grudges (M)
- [ ] 🟠 **i6-a24** Town choices stick for the next generation (M)
- [ ] 🟡 **i6-a25** The years show across generations (M)
- [ ] 🟡 **i6-a26** Stories at the Thanksgiving table (S)
- [ ] 🟠 **i6-a27** Turn down the family money (S)
- [ ] 🟠 **i6-a28** Choose which grandkid carries on (M)
- [ ] 🟠 **i6-a29** Overlap generations: switch to your kid at 65 (L)
- [ ] 🟡 **i6-a30** A puppy from the old dog's litter (S)
- [ ] 🟡 **i6-a31** Anniversaries that add up (S)
- [ ] 🟡 **i6-a32** Your family's marks on the map (S)

</details>

<details><summary><b>Ideas 6: Look, sound and map</b> (32 ideas)</summary>

- [ ] 🔴 **i6-b01** A drawn portrait that ages with you (M)
- [ ] 🔴 **i6-b02** Your house on Home, drawn from what you own (M)
- [ ] 🔴 **i6-b03** The title scene follows your latest life (M)
- [ ] 🟠 **i6-b04** Day and dusk on the town map (M)
- [ ] 🔴 **i6-b05** Main Street changes as you play (M)
- [ ] 🟠 **i6-b06** Footprints: the places you go most (S)
- [ ] 🟠 **i6-b07** Region map remembers your trips (M)
- [ ] 🟠 **i6-b08** Weather on the map (S)
- [ ] 🟠 **i6-b09** The Touchet rises and falls (S)
- [ ] 🟡 **i6-b10** Wheat trucks at harvest (S)
- [ ] 🔴 **i6-b11** Season accent colors across the app (S)
- [ ] 🟠 **i6-b12** A home that ages with you (M)
- [ ] 🟠 **i6-b13** Holiday touches on Home (S)
- [ ] 🟡 **i6-b14** Your truck on the map looks like your truck (S)
- [ ] 🟠 **i6-b15** Original icon set to replace emoji in key spots (M)
- [ ] 🟡 **i6-b16** Paper texture and a stamp look (S)
- [ ] 🟠 **i6-b17** A soundtrack made in code (M)
- [ ] 🟡 **i6-b18** Town sounds on the map (S)
- [ ] 🟡 **i6-b19** Haptic patterns that mean something (S)
- [ ] 🟠 **i6-b20** Theme picker: Barn, Wheat, Creek, Night (S)
- [ ] 🟡 **i6-b21** Dark map palette (S)
- [ ] 🟠 **i6-b22** Small life moments animate once (M)
- [ ] 🟡 **i6-b23** Weather in the header (S)
- [ ] 🟠 **i6-b24** A portrait album at the end (M)
- [ ] 🟡 **i6-b25** Your kids appear by the house (S)
- [ ] 🟠 **i6-b26** A hand-drawn Waitsburg map style (L)
- [ ] 🟡 **i6-b27** Map labels that tell you something (S)
- [ ] 🟠 **i6-b28** Night lights show who's home (S)
- [ ] 🟡 **i6-b29** Animated week turn (S)
- [ ] 🟡 **i6-b30** Pet portrait that ages (M)
- [ ] 🟠 **i6-b31** Splash and icon tied to the season (S)
- [ ] 🟡 **i6-b32** Little easter eggs on the map (S)

</details>

## Ideas round 7 (pick on the build board)

65 ideas. Details: [docs/ideas/round-7.md](docs/ideas/round-7.md). 🔴 = recommended first.

<details><summary><b>Ideas 7: Everyone can play</b> (34 ideas)</summary>

- [ ] 🔴 **i7-a01** Reduced motion that follows the phone setting (S)
- [ ] 🔴 **i7-a02** A one-sentence week summary for screen readers (S)
- [ ] 🔴 **i7-a03** Stats in words, not just bars (S)
- [ ] 🟠 **i7-a04** Read aloud: events, choices and help (M)
- [ ] 🔴 **i7-a05** Grade 6 reading check for every line of game text (S)
- [ ] 🔴 **i7-a06** New to games? A three-question start (S)
- [ ] 🟠 **i7-a07** Simple numbers setting (S)
- [ ] 🔴 **i7-a08** Plain-words Help: 'How do I...?' cards (M)
- [ ] 🟠 **i7-a09** Bigger buttons mode (M)
- [ ] 🟠 **i7-a10** Every gesture and timer has a tap-only way (S)
- [ ] 🟠 **i7-a11** Word labels on every icon button (S)
- [ ] 🟠 **i7-a12** Map pins with shapes, letters and a 'list the places' view (S)
- [ ] 🟡 **i7-a13** Easy-reading font and spacing (S)
- [ ] 🟠 **i7-a14** Family-friendly events setting (S)
- [ ] 🟡 **i7-a15** Heads-up before heavy moments (S)
- [ ] 🟡 **i7-a16** Play-time reminder you set (S)
- [ ] 🟡 **i7-a17** Short-session quick week (M)
- [ ] 🟠 **i7-a18** Calm Home: show more only when it matters (M)
- [ ] 🟡 **i7-a19** Young reader text for events (M)
- [ ] 🔴 **i7-a20** Pronouns for you and your partner (S)
- [ ] 🔴 **i7-a21** Living with a disability: a respectful start (L)
- [ ] 🟠 **i7-a22** Ask for an accommodation at work (M)
- [ ] 🟠 **i7-a23** Came home from the service: a veteran start (M)
- [ ] 🟠 **i7-a24** Parenting solo, with real supports (M)
- [ ] 🟠 **i7-a25** Get paid as a family caregiver (M)
- [ ] 🟠 **i7-a26** First-generation family in the valley (M)
- [ ] 🔴 **i7-a27** Help is there: benefits you can apply for (M)
- [ ] 🟠 **i7-a28** A town that looks like real towns (M)
- [ ] 🟠 **i7-a29** A writing guide for respectful events (S)
- [ ] 🟡 **i7-a30** Older-player comfort pack (S)
- [ ] 🟡 **i7-a31** Messages stay until you're done reading (S)
- [ ] 🟡 **i7-a32** Life situations that are ordinary, not plot twists (M)
- [ ] 🟡 **i7-a33** Captions for every sound (S)
- [ ] 🟡 **i7-a34** Pause and think: no auto-advance ever (S)

</details>

<details><summary><b>Ideas 7: Players and community content</b> (31 ideas)</summary>

- [ ] 🔴 **i7-b01** Events as data: a simple JSON event format (M)
- [ ] 🔴 **i7-b02** Content checker for every data file (S)
- [ ] 🔴 **i7-b03** One send helper for every community form (S)
- [ ] 🟠 **i7-b04** Submissions open or closed this month (S)
- [ ] 🟠 **i7-b05** A content style guide (S)
- [ ] 🟠 **i7-b06** Send in a town happening (M)
- [ ] 🔴 **i7-b07** Seasonal content drops (M)
- [ ] 🟠 **i7-b08** Vote on what comes next (M)
- [ ] 🟡 **i7-b09** Thumbs up or down on events (S)
- [ ] 🔴 **i7-b10** Trivia night at the library (M)
- [ ] 🟠 **i7-b11** Send in a trivia question (S)
- [ ] 🟠 **i7-b12** Where in the Burg? map riddles (M)
- [ ] 🔴 **i7-b13** This week in Waitsburg history (S)
- [ ] 🟠 **i7-b14** History markers on the town map (M)
- [ ] 🟠 **i7-b15** Send in a local history fact (S)
- [ ] 🟠 **i7-b16** Looking back: stories from locals (S)
- [ ] 🟡 **i7-b17** Recipe of the year at Celebration Days (S)
- [ ] 🟡 **i7-b18** A book of local sayings (S)
- [ ] 🔴 **i7-b19** A live town board at the post office (M)
- [ ] 🟡 **i7-b20** Put a board item on your phone calendar (S)
- [ ] 🟠 **i7-b21** Send a real community event to the board (S)
- [ ] 🟠 **i7-b22** Town notes built from word lists (M)
- [ ] 🟠 **i7-b23** Share your year as a text postcard (S)
- [ ] 🟠 **i7-b24** Made with the town: a credits page (S)
- [ ] 🟡 **i7-b25** Town contributor badge (S)
- [ ] 🔴 **i7-b26** Waitsburg for real: a page in Help (S)
- [ ] 🟠 **i7-b27** 'Try it for real' notes on events (S)
- [ ] 🟡 **i7-b28** Support the town link (S)
- [ ] 🟡 **i7-b29** A classroom pack for local schools (M)
- [ ] 🟡 **i7-b30** Community goal with a real-world gift (L)
- [ ] 🟠 **i7-b31** Every drop runs through the balance sim (S)

</details>

## Ideas round 8 (pick on the build board)

62 ideas. Details: [docs/ideas/round-8.md](docs/ideas/round-8.md). 🔴 = recommended first.

<details><summary><b>Ideas 8: Playtest of modes</b> (28 ideas)</summary>

- [ ] 🔴 **i8-a01** Grandkid only after a life that ran its course (S)
- [ ] 🔴 **i8-a02** "Not now" keeps the grandkid waiting (S)
- [ ] 🔴 **i8-a03** Retirees can't be "hired" into a job that never pays (M)
- [ ] 🔴 **i8-a04** Retiring asks first and marks the day (M)
- [ ] 🔴 **i8-a05** Live challenge progress with a deadline (M)
- [ ] 🔴 **i8-a06** Job openings change week to week (M)
- [ ] 🟠 **i8-a07** Lifetime "score so far" counts net worth against "by now" (S)
- [ ] 🟠 **i8-a08** Retirement happiness needs a reason after the first years (S)
- [ ] 🟠 **i8-a09** Events you've seen a lot come up less (M)
- [ ] 🟠 **i8-a10** A long marriage doesn't end on one coin flip (S)
- [ ] 🟡 **i8-a11** The trip of a lifetime happens once (S)
- [ ] 🟠 **i8-a12** Farm kid lives at the family place at first (S)
- [ ] 🟠 **i8-a13** Work events that fit a farm or a small shop (M)
- [ ] 🟡 **i8-a14** Fix the raise wording (S)
- [ ] 🟠 **i8-a15** Farm kid can take over the family farm (L)
- [ ] 🟠 **i8-a16** Relaxed says so when the debt floor catches you (S)
- [ ] 🟠 **i8-a17** Hard makes the first job harder to land (S)
- [ ] 🟠 **i8-a18** Challenge results and records judge the challenge (S)
- [ ] 🟠 **i8-a19** Early win, then a stretch goal (S)
- [ ] 🟡 **i8-a20** Save the family farm gets a story (M)
- [ ] 🟡 **i8-a21** A briefing when a challenge starts (S)
- [ ] 🟡 **i8-a22** Take a challenge on Hard (S)
- [ ] 🟠 **i8-a23** A weekly finished after Monday still counts (S)
- [ ] 🟠 **i8-a24** Your first weekly finish is the official one (S)
- [ ] 🟡 **i8-a25** Weekly challenge starts in this real month (S)
- [ ] 🟠 **i8-a26** Town goals with a new twist each year (S)
- [ ] 🟡 **i8-a27** Road events match the road you drive (S)
- [ ] 🟡 **i8-a28** The grandkid sheet shows what comes down (S)

</details>

<details><summary><b>Ideas 8: Work life up close</b> (34 ideas)</summary>

- [ ] 🔴 **i8-b01** A named boss at every job (M)
- [ ] 🟠 **i8-b02** Two regular coworkers who keep turning up (M)
- [ ] 🔴 **i8-b03** A week in the life: a card for each job (S)
- [ ] 🔴 **i8-b04** Pick your shift: days, swing or nights (M)
- [ ] 🟠 **i8-b05** Hospital rhythm: three 12-hour shifts a week (S)
- [ ] 🟡 **i8-b06** On-call weeks for nurses, mechanics and trades (S)
- [ ] 🔴 **i8-b07** Your work week on Home: a shift strip (S)
- [ ] 🟡 **i8-b08** The schedule goes up late: service-job weekends (S)
- [ ] 🟠 **i8-b09** Tips at the bar, the café and the diner (S)
- [ ] 🟡 **i8-b10** Rush weeks: Black Friday, Celebration Days, the holidays (S)
- [ ] 🔴 **i8-b11** Paid time off you can actually use (M)
- [ ] 🟠 **i8-b12** Sick week: call in or push through (S)
- [ ] 🟠 **i8-b13** Benefits at a glance on every job (S)
- [ ] 🔴 **i8-b14** Quit well: give notice or walk out (S)
- [ ] 🟠 **i8-b15** Old bosses can hire you back (S)
- [ ] 🟡 **i8-b16** A send-off on your last day (S)
- [ ] 🟠 **i8-b17** Starting over: the first-year dip in a new field (M)
- [ ] 🟡 **i8-b18** A late-start career: become a nurse at 40 (L)
- [ ] 🟠 **i8-b19** Burnout and a leave of absence (M)
- [ ] 🔴 **i8-b20** School-hours jobs (M)
- [ ] 🟠 **i8-b21** Part-time hours (M)
- [ ] 🟠 **i8-b22** Summer break with kids at home (S)
- [ ] 🟡 **i8-b23** Snow day scramble (S)
- [ ] 🟠 **i8-b24** Go solo in your trade (M)
- [ ] 🟡 **i8-b25** Quarterly taxes when you work for yourself (S)
- [ ] 🟠 **i8-b26** The farm year for farm hands (S)
- [ ] 🟠 **i8-b27** Wine crush as a season with a finish line (S)
- [ ] 🟡 **i8-b28** Road weeks for truck drivers (S)
- [ ] 🟠 **i8-b29** A signature week for each Main Street job (M)
- [ ] 🟡 **i8-b30** Pick a beat at the Tattler (S)
- [ ] 🟠 **i8-b31** Main Street jobs know everybody (S)
- [ ] 🟡 **i8-b32** Talk of a union in the break room (M)
- [ ] 🟡 **i8-b33** Laid off? Retraining money for a new field (S)
- [ ] 🔴 **i8-b34** Job group tags for every work rule (S)

</details>

## Ideas round 9 (pick on the build board)

67 ideas. Details: [docs/ideas/round-9.md](docs/ideas/round-9.md). 🔴 = recommended first.

<details><summary><b>Ideas 9: Later life and endings</b> (34 ideas)</summary>

- [ ] 🔴 **i9-a01** Medicare at 65: pick your plan (M)
- [ ] 🟠 **i9-a02** Checkups at 50 lower late-life risk (S)
- [ ] 🟠 **i9-a03** Midlife: the 'what now?' years (M)
- [ ] 🟠 **i9-a04** Show where health is headed for your age (S)
- [ ] 🟡 **i9-a05** Hearing aids and cataract surgery (S)
- [ ] 🟠 **i9-a06** Handing over the truck keys (M)
- [ ] 🟠 **i9-a07** Grab bars before the fall (S)
- [ ] 🟡 **i9-a08** Hire the neighbor kid for the walk and yard (S)
- [ ] 🔴 **i9-a09** Lend a hand: a retiree focus in place of overtime (S)
- [ ] 🟠 **i9-a10** A standing weekly commitment for retirees (M)
- [ ] 🟡 **i9-a11** Social Security raises each January (S)
- [ ] 🟠 **i9-a12** Choose your 401(k) draw rate (M)
- [ ] 🟡 **i9-a13** Reverse mortgage or sell and rent back (M)
- [ ] 🔴 **i9-a14** Mentor a young townsperson (M)
- [ ] 🟠 **i9-a15** Teach what you know at the library (S)
- [ ] 🟠 **i9-a16** Grandkid week in July (S)
- [ ] 🟡 **i9-a17** Watch the grandkids so your kid can work (S)
- [ ] 🟠 **i9-a18** Phone scams aimed at retirees (S)
- [ ] 🟠 **i9-a19** Caring for your partner (M)
- [ ] 🔴 **i9-a20** Losing your partner, gently (M)
- [ ] 🟠 **i9-a21** Sort the house: keep, give, sell (M)
- [ ] 🟠 **i9-a22** Give while you're living (M)
- [ ] 🟡 **i9-a23** Medicaid steps in when care runs long (S)
- [ ] 🟠 **i9-a24** Talk it over: your wishes on paper (S)
- [ ] 🔴 **i9-a25** A final season instead of a sudden end (L)
- [ ] 🟠 **i9-a26** Goodbyes: three visits in your last season (M)
- [ ] 🟡 **i9-a27** Record stories for the grandkids (S)
- [ ] 🔴 **i9-a28** Endings that fit the life (S)
- [ ] 🟠 **i9-a29** A life chart on the ending screen (M)
- [ ] 🟡 **i9-a30** What it added up to: a life's tallies (S)
- [ ] 🟡 **i9-a31** Pick a line for your stone (S)
- [ ] 🟠 **i9-a32** Lifelong habits shape the late years (S)
- [ ] 🟠 **i9-a33** Faster late years: monthly turns after 70 (L)
- [ ] 🟠 **i9-a34** Age bands on every event, checked by tests (M)

</details>

<details><summary><b>Ideas 9: Learning real-life skills</b> (33 ideas)</summary>

- [ ] 🔴 **i9-b01** A pay stub you can open (S)
- [ ] 🔴 **i9-b02** A 'Real-life notes' switch (S)
- [ ] 🔴 **i9-b03** 'What would this cost in real life?' moments (M)
- [ ] 🔴 **i9-b04** A monthly budget with three buckets (M)
- [ ] 🟠 **i9-b05** Emergency fund meter (S)
- [ ] 🔴 **i9-b06** A store credit card and the minimum payment (M)
- [ ] 🟠 **i9-b07** A payday loan offer when you're broke (S)
- [ ] 🟡 **i9-b08** Pay off debts in the order you choose (S)
- [ ] 🟠 **i9-b09** An overdraft fee the first time you go below zero (S)
- [ ] 🟠 **i9-b10** Compound interest birthdays (S)
- [ ] 🔴 **i9-b11** Money left on the table: the 401(k) match (S)
- [ ] 🟠 **i9-b12** 'Will I have enough?' retirement check (M)
- [ ] 🔴 **i9-b13** Read the lease before you sign (M)
- [ ] 🟠 **i9-b14** Move-in costs and getting your deposit back (S)
- [ ] 🔴 **i9-b15** Rent vs. buy, side by side (M)
- [ ] 🟠 **i9-b16** Open enrollment: pick a health plan (M)
- [ ] 🟡 **i9-b17** W-4 at hire: more now or a refund later (S)
- [ ] 🟠 **i9-b18** Free tax help night at the library (S)
- [ ] 🟡 **i9-b19** Hourly jobs and time-and-a-half (S)
- [ ] 🟡 **i9-b20** The first paycheck comes two weeks late (S)
- [ ] 🟠 **i9-b21** The real price of the new pickup (S)
- [ ] 🟠 **i9-b22** A scam text from 'your bank' (S)
- [ ] 🟡 **i9-b23** Read the bill: catch the mistake (S)
- [ ] 🟠 **i9-b24** Prices then and now in the year review (S)
- [ ] 🟡 **i9-b25** Student loan plans for the grad start (S)
- [ ] 🔴 **i9-b26** Money lessons from this life (M)
- [ ] 🔴 **i9-b27** Class codes that work offline (L)
- [ ] 🔴 **i9-b28** Guided lesson units (L)
- [ ] 🟠 **i9-b29** Discussion prompts at checkpoints (M)
- [ ] 🔴 **i9-b30** A printable one-page summary (M)
- [ ] 🟠 **i9-b31** Result codes for the teacher's table (M)
- [ ] 🟡 **i9-b32** A teacher guide in Help (S)
- [ ] 🟡 **i9-b33** Small splurge, long shadow (S)

</details>

## Ideas round 10 (pick on the build board)

64 ideas. Details: [docs/ideas/round-10.md](docs/ideas/round-10.md). 🔴 = recommended first.

<details><summary><b>Ideas 10: Lessons from other games</b> (32 ideas)</summary>

- [ ] 🔴 **i10-a01** Three small wants that refresh (M)
- [ ] 🟠 **i10-a02** Pick two traits when you start (M)
- [ ] 🟡 **i10-a03** One worry at a time (S)
- [ ] 🔴 **i10-a04** Fix up the old Grange hall, one set at a time (L)
- [ ] 🟠 **i10-a05** Neighbors with likes, dislikes and friendship scenes (M)
- [ ] 🟠 **i10-a06** Finds for the historical society (M)
- [ ] 🟠 **i10-a07** A different out-of-town visitor on Main Street each week (M)
- [ ] 🟡 **i10-a08** Talk a neighbor out of moving away (M)
- [ ] 🟠 **i10-a09** The town gives you a nickname (S)
- [ ] 🔴 **i10-a10** Front-porch asks: quick two-button cards (M)
- [ ] 🟠 **i10-a11** Council term as a balancing act (M)
- [ ] 🟡 **i10-a12** Small talk while you're out (S)
- [ ] 🟠 **i10-a13** Hidden knacks you find by trying (S)
- [ ] 🟡 **i10-a14** A bill lands before payday (S)
- [ ] 🟡 **i10-a15** Check the forms at a county desk job (M)
- [ ] 🟡 **i10-a16** Cut a corner at work, and the check comes later (M)
- [ ] 🟠 **i10-a17** How everyone at home is doing (M)
- [ ] 🟠 **i10-a18** Kindness tokens turned over at the end (M)
- [ ] 🟡 **i10-a19** Show the odds as a spinner on risky choices (S)
- [ ] 🟠 **i10-a20** A freezer full of fish, game and garden (M)
- [ ] 🟠 **i10-a21** Pick your pace on winter roads (S)
- [ ] 🟡 **i10-a22** The washed-out road (S)
- [ ] 🟠 **i10-a23** Trade work with neighbors instead of cash (M)
- [ ] 🟠 **i10-a24** Notes in the little free library (S)
- [ ] 🔴 **i10-a25** Ask the town for help (M)
- [ ] 🟡 **i10-a26** A corkboard of thank-you cards (S)
- [ ] 🟡 **i10-a27** Walk a trail to the top (M)
- [ ] 🟠 **i10-a28** Spots you only find by wandering (S)
- [ ] 🟠 **i10-a29** Set your prices at your business (M)
- [ ] 🟡 **i10-a30** When two things want the same evening (M)
- [ ] 🟡 **i10-a31** A town history rolled at the start (L)
- [ ] 🟠 **i10-a32** Each place to live has a feel (S)

</details>

<details><summary><b>Ideas 10: Wild cards</b> (32 ideas)</summary>

- [ ] 🔴 **i10-b01** A rare-events pool and a 'Once in a lifetime' page (S)
- [ ] 🔴 **i10-b02** The ghost at the old brick hotel (M)
- [ ] 🔴 **i10-b03** The mill bell mystery: a town puzzle over years (L)
- [ ] 🔴 **i10-b04** Strange gigs on the bulletin board (M)
- [ ] 🟠 **i10-b05** Northern lights over the wheat (S)
- [ ] 🟡 **i10-b06** Chase the eclipse (M)
- [ ] 🟡 **i10-b07** A meteorite in the stubble (S)
- [ ] 🟠 **i10-b08** A hot-air balloon lands in your field (S)
- [ ] 🟠 **i10-b09** Dust storm on Highway 12 (S)
- [ ] 🟠 **i10-b10** Cattle loose on Highway 12 (S)
- [ ] 🟠 **i10-b11** A film crew takes over Main Street (M)
- [ ] 🟡 **i10-b12** Something in the Blue Mountains (S)
- [ ] 🟠 **i10-b13** An arrowhead in the creek bank: do it right (S)
- [ ] 🟡 **i10-b14** Dig day at the mammoth site (S)
- [ ] 🟠 **i10-b15** The old cornerstone box is opened (S)
- [ ] 🟠 **i10-b16** The territorial charter vote (M)
- [ ] 🟡 **i10-b17** The stoplight debate (S)
- [ ] 🟠 **i10-b18** A key to a box nobody knew about (M)
- [ ] 🟠 **i10-b19** A letter about money the state is holding (S)
- [ ] 🟠 **i10-b20** A world record on Main Street (M)
- [ ] 🟡 **i10-b21** The demolition derby at the fair (M)
- [ ] 🟠 **i10-b22** Count the town: census taker every ten years (S)
- [ ] 🟡 **i10-b23** Santa suit season (S)
- [ ] 🟡 **i10-b24** A famous someone buys the house on the hill (M)
- [ ] 🟡 **i10-b25** Groundhog week (M)
- [ ] 🟡 **i10-b26** A dog's-eye week (S)
- [ ] 🟠 **i10-b27** Sliding doors: the job you didn't take (M)
- [ ] 🟠 **i10-b28** Groundwork for era starts (M)
- [ ] 🟠 **i10-b29** Start in 1975 (big) (L)
- [ ] 🟡 **i10-b30** Ash falls on the valley: May 1980 (S)
- [ ] 🟡 **i10-b31** Start in 2050 (big, speculative) (L)
- [ ] 🟡 **i10-b32** Honorary mayor for a day (S)

</details>

## Ideas round 11 (pick on the build board)

62 ideas. Details: [docs/ideas/round-11.md](docs/ideas/round-11.md). 🔴 = recommended first.

<details><summary><b>Ideas 11: Home, food and daily life</b> (29 ideas)</summary>

- [ ] 🔴 **i11-a01** Cook in or eat out: a weekly food habit (M)
- [ ] 🔴 **i11-a02** Your potluck dish (S)
- [ ] 🔴 **i11-a03** A good bed and the sleep you get (M)
- [ ] 🔴 **i11-a04** One hobby at home that grows (L)
- [ ] 🟠 **i11-a05** Morning coffee: the pot, the counter or the gas station (S)
- [ ] 🟠 **i11-a06** Evening walks around the block (S)
- [ ] 🟡 **i11-a07** A Sunday drive in the wheat (S)
- [ ] 🟠 **i11-a08** Furnish your rooms (M)
- [ ] 🟠 **i11-a09** Something breaks: fix it, call it in, or tell the landlord (M)
- [ ] 🟠 **i11-a10** Weekend projects around the house (M)
- [ ] 🟠 **i11-a11** Settling in after a move (S)
- [ ] 🟠 **i11-a12** The Burg Basket receipt (S)
- [ ] 🟠 **i11-a13** Shop local all month: the Burg Basket punch card (S)
- [ ] 🟡 **i11-a14** Run a tab at the Burg Basket (M)
- [ ] 🟠 **i11-a15** Food follows the seasons (M)
- [ ] 🟡 **i11-a16** Canning day with the neighbor: jars for gifts (S)
- [ ] 🟠 **i11-a17** Host a dinner for friends (S)
- [ ] 🟠 **i11-a18** Be a regular at the Main Street diner (S)
- [ ] 🟠 **i11-a19** Subscriptions that creep (S)
- [ ] 🟠 **i11-a20** Food bank Thursday (S)
- [ ] 🟡 **i11-a21** Bring the fiddle to the bluegrass jam (S)
- [ ] 🟡 **i11-a22** Book club at the library (S)
- [ ] 🟡 **i11-a23** A quilt for the school auction (S)
- [ ] 🟡 **i11-a24** A recipe box that fills up (S)
- [ ] 🟠 **i11-a25** Home has rooms you tap (L)
- [ ] 🟡 **i11-a26** Weekdays and a weekend pick (L)
- [ ] 🟡 **i11-a27** Late-night gaming and the 2 a.m. problem (S)
- [ ] 🟡 **i11-a28** A slow cooker for busy weeks (S)
- [ ] 🟡 **i11-a29** A spare key with the neighbor (S)

</details>

<details><summary><b>Ideas 11: Variants of the best</b> (33 ideas)</summary>

- [ ] 🔴 **i11-b01** [i1-a01] Light version: a three-word job standing (S)
- [ ] 🟠 **i11-b02** [i1-a01] Full version: standing that remembers why (M)
- [ ] 🟡 **i11-b03** [i1-a01] Two-track version: standing with the boss and the crew (M)
- [ ] 🔴 **i11-b04** [i2-a01] Light version: arrows only on event buttons (S)
- [ ] 🟠 **i11-b05** [i2-a01] Full version: hints that unlock with skill and standing (M)
- [ ] 🟡 **i11-b06** [i2-a01] Alternate: a 'Think it over' button instead of hints (S)
- [ ] 🔴 **i11-b07** [i2-a02] Light version: money-only week preview (S)
- [ ] 🟠 **i11-b08** [i2-a02] Full version: compare two focuses side by side (M)
- [ ] 🟡 **i11-b09** [i2-a02] Alternate: a 4-week plan preview instead of one week (M)
- [ ] 🔴 **i11-b10** [i1-b01] Light version: one neighbor next door (S)
- [ ] 🟠 **i11-b11** [i1-b01] Full version: neighbors who move and change (L)
- [ ] 🟡 **i11-b12** [i1-b01] Alternate: the street as a card you tend (M)
- [ ] 🔴 **i11-b13** [i1-a02] Light version: one perk at each threshold (S)
- [ ] 🟠 **i11-b14** [i1-a02] Full version: perks you pick (M)
- [ ] 🟡 **i11-b15** [i1-a02] Alternate: community as a spendable 'goodwill' meter (M)
- [ ] 🔴 **i11-b16** [i2-b03] Light version: last 10 lives as one-line rows (S)
- [ ] 🟠 **i11-b17** [i2-b03] Full version: a shelf of books you open (M)
- [ ] 🟡 **i11-b18** [i2-b03] Alternate: a family tree instead of a shelf (M)
- [ ] 🔴 **i11-b19** [i3-a01] Light version: titles only, same pay steps (S)
- [ ] 🟠 **i11-b20** [i3-a01] Full version: rungs with gates you can see (M)
- [ ] 🟡 **i11-b21** [i3-a01] Alternate: side moves instead of a ladder (M)
- [ ] 🔴 **i11-b22** [i8-a06] Light version: a few jobs closed each month (S)
- [ ] 🟠 **i11-b23** [i8-a06] Full version: hiring seasons by job type (M)
- [ ] 🟡 **i11-b24** [i8-a06] Alternate: apply and wait for a call back (M)
- [ ] 🔴 **i11-b25** [i5-b01] Light version: weather line with one rule (S)
- [ ] 🟠 **i11-b26** [i5-b01] Full version: weather that hits jobs and events (M)
- [ ] 🟡 **i11-b27** [i5-b01] Alternate: a season mood instead of weekly weather (S)
- [ ] 🔴 **i11-b28** [i10-a01] Light version: one want at a time (S)
- [ ] 🟠 **i11-b29** [i10-a01] Full version: wants that come from your life (M)
- [ ] 🔴 **i11-b30** [i1-b05] Light version: just a name and two stages (S)
- [ ] 🟠 **i11-b31** [i1-b05] Full version: a relationship meter with ups and downs (M)
- [ ] 🟠 **i11-b32** [i1-a05] Light version: a cushion line, no bank (S)
- [ ] 🟠 **i11-b33** [i1-a05] Full version: savings goals with a jar on Home (M)

</details>

## Ideas round 12 (pick on the build board)

62 ideas. Details: [docs/ideas/round-12.md](docs/ideas/round-12.md). 🔴 = recommended first.

<details><summary><b>Ideas 12: The neighboring towns</b> (32 ideas)</summary>

- [ ] 🔴 **i12-a01** College Place joins the region map (M)
- [ ] 🔴 **i12-a02** Each town gets a character card (S)
- [ ] 🔴 **i12-a03** The Dayton rivalry game (M)
- [ ] 🟠 **i12-a04** Bragging rights after the rivalry game (S)
- [ ] 🟠 **i12-a05** Follow the Cardinals on the road (S)
- [ ] 🟠 **i12-a06** More than sports: cross-town contests (M)
- [ ] 🔴 **i12-a07** Regulars in every town (M)
- [ ] 🟠 **i12-a08** Ties in your work town (M)
- [ ] 🔴 **i12-a09** Live in another town (L)
- [ ] 🟠 **i12-a10** Community follows you, but slowly (M)
- [ ] 🟡 **i12-a11** Try a town before you move (S)
- [ ] 🟠 **i12-a12** Move closer to the job? (S)
- [ ] 🟡 **i12-a13** Coming home again (S)
- [ ] 🟠 **i12-a14** The US-12 commuter club (M)
- [ ] 🟡 **i12-a15** Leave early or leave late (S)
- [ ] 🟡 **i12-a16** Fill up where gas is cheaper (S)
- [ ] 🟠 **i12-a17** Jury duty in Walla Walla (S)
- [ ] 🟡 **i12-a18** County seat errands (S)
- [ ] 🟠 **i12-a19** Learn some Spanish in Pasco (M)
- [ ] 🟡 **i12-a20** Three cities, three personalities (S)
- [ ] 🔴 **i12-a21** Festival weeks as trip stops (M)
- [ ] 🟡 **i12-a22** A weekly 'what's on' line per town (S)
- [ ] 🟡 **i12-a23** Wine weekends crowd Walla Walla (S)
- [ ] 🟠 **i12-a24** Hardware runs for the fixer-upper (S)
- [ ] 🟡 **i12-a25** Dayton's small-town services (S)
- [ ] 🟡 **i12-a26** Teens want to go to the big town (M)
- [ ] 🟠 **i12-a27** Towns appear on the map as you hear of them (M)
- [ ] 🟡 **i12-a28** Drive-time rings on the region map (S)
- [ ] 🟡 **i12-a29** Same trip as last time (S)
- [ ] 🟠 **i12-a30** Prescott, the sister town (M)
- [ ] 🟠 **i12-a31** Out-of-town friends who need a visit (M)
- [ ] 🟡 **i12-a32** Region map shows where you're known (S)

</details>

<details><summary><b>Ideas 12: Quick wins</b> (30 ideas)</summary>

- [ ] 🔴 **i12-b01** "End this life now" asks first (S)
- [ ] 🔴 **i12-b02** Net worth breakdown adds up (S)
- [ ] 🔴 **i12-b03** Debt warning names the right limit for the mode (S)
- [ ] 🔴 **i12-b04** Replacing a full slot asks once more (S)
- [ ] 🟠 **i12-b05** Undo a deleted life for a few seconds (S)
- [ ] 🟠 **i12-b06** Starting a business asks first (S)
- [ ] 🟠 **i12-b07** A calm debt card before the scary one (S)
- [ ] 🟠 **i12-b08** Cash in the header turns red in debt (S)
- [ ] 🟡 **i12-b09** Long names don't push the cash off the header (S)
- [ ] 🟠 **i12-b10** Lifetime header says something useful on the right (S)
- [ ] 🟠 **i12-b11** No "-$0" in the week strip (S)
- [ ] 🟠 **i12-b12** A trade-in worth more than the car says "you get money back" (S)
- [ ] 🟠 **i12-b13** Say why the ride buttons are greyed out (S)
- [ ] 🟡 **i12-b14** 401(k) buttons show what they cost a week (S)
- [ ] 🟡 **i12-b15** Greyed-out focus tiles say why (S)
- [ ] 🟠 **i12-b16** Empty job list offers to clear the filter (S)
- [ ] 🟡 **i12-b17** The Journal says it keeps the last 120 entries (S)
- [ ] 🟡 **i12-b18** Names are escaped in Journal lines (S)
- [ ] 🟠 **i12-b19** Multi-week details say the bills are for the last week (S)
- [ ] 🟡 **i12-b20** The hospital note says where you land (S)
- [ ] 🟠 **i12-b21** Save slots show mode, challenge and weekly tags (S)
- [ ] 🟠 **i12-b22** No checkpoint copies of a weekly-challenge life (S)
- [ ] 🟡 **i12-b23** The weekly challenge sheet shows your best this week (S)
- [ ] 🟡 **i12-b24** The welcome toast fits how your life begins (S)
- [ ] 🟡 **i12-b25** Legacy is "grandkid" everywhere (S)
- [ ] 🟡 **i12-b26** Help numbers come from the game data (S)
- [ ] 🟡 **i12-b27** Restore with nothing pasted says what to do (S)
- [ ] 🟡 **i12-b28** Backup buttons say why they're off (S)
- [ ] 🟡 **i12-b29** The quit sheet says benefits only follow a layoff (S)
- [ ] 🟡 **i12-b30** The end screen counts kids raised honestly (S)

</details>

## Ideas round 13 (pick on the build board)

62 ideas. Details: [docs/ideas/round-13.md](docs/ideas/round-13.md). 🔴 = recommended first.

<details><summary><b>Ideas 13: Health, body and mind</b> (32 ideas)</summary>

- [ ] 🔴 **i13-a01** Fitness that builds slowly and fades slowly (L)
- [ ] 🔴 **i13-a02** A video visit with the clinic from the kitchen table (S)
- [ ] 🔴 **i13-a03** Workers' comp after you're hurt on the job (M)
- [ ] 🔴 **i13-a04** Quit smoking: a habit you can start the game with (M)
- [ ] 🔴 **i13-a05** Talk it out: a friend, the pastor or a counselor (M)
- [ ] 🟠 **i13-a06** A checkup finds high blood pressure (M)
- [ ] 🟠 **i13-a07** The specialist is in Walla Walla (M)
- [ ] 🟠 **i13-a08** Sick on a Saturday: wait for Monday or urgent care (S)
- [ ] 🟠 **i13-a09** Squinting at the menu: reading glasses in your 40s (S)
- [ ] 🟠 **i13-a10** The dentist's postcard on the fridge (S)
- [ ] 🟠 **i13-a11** A free health fair and flu shots at the fairgrounds (S)
- [ ] 🟠 **i13-a12** Good boots and earplugs for field and trades jobs (S)
- [ ] 🟠 **i13-a13** Spring pollen and harvest dust (S)
- [ ] 🟠 **i13-a14** A pint is a treat, not a habit (S)
- [ ] 🟠 **i13-a15** Drive a neighbor to treatment in Walla Walla (S)
- [ ] 🟠 **i13-a16** You need a ride home after a procedure (S)
- [ ] 🟠 **i13-a17** Health shows up at work (S)
- [ ] 🟠 **i13-a18** Grief takes its time (M)
- [ ] 🟠 **i13-a19** Morning walking group on Main Street (S)
- [ ] 🟡 **i13-a20** Rec league softball and pickup at the school gym (M)
- [ ] 🟡 **i13-a21** Get outside changes with age (S)
- [ ] 🟡 **i13-a22** A gym in Walla Walla or the school weight room (M)
- [ ] 🟡 **i13-a23** Braces for a kid (S)
- [ ] 🟡 **i13-a24** Dry January (S)
- [ ] 🟡 **i13-a25** Daylight saving week (S)
- [ ] 🟡 **i13-a26** Summer at the town pool (S)
- [ ] 🟡 **i13-a27** Your year in health (S)
- [ ] 🟡 **i13-a28** A health savings account with the cheaper plan (M)
- [ ] 🟠 **i13-a29** Your body: back, knees, teeth, eyes and heart (L)
- [ ] 🟠 **i13-a30** A regular doctor who knows you (M)
- [ ] 🟡 **i13-a31** Ladders and chainsaws: fixing it yourself (S)
- [ ] 🟡 **i13-a32** A heart scare after 55, and cardiac rehab (M)

</details>

<details><summary><b>Ideas 13: Town history and civic life</b> (30 ideas)</summary>

- [ ] 🔴 **i13-b01** The town ledger: Waitsburg changes over a long game (M)
- [ ] 🔴 **i13-b02** Wait's mill: how the town got its name (S)
- [ ] 🔴 **i13-b03** Levy season: vote, campaign or stay home (M)
- [ ] 🔴 **i13-b04** Public comment night at city hall (M)
- [ ] 🟠 **i13-b05** The water system is a hundred years old (M)
- [ ] 🟠 **i13-b06** Broadband comes up the valley (M)
- [ ] 🟠 **i13-b07** Rent creeps up as new families arrive (S)
- [ ] 🟠 **i13-b08** New families on your block (M)
- [ ] 🟠 **i13-b09** Enrollment and the school's future (M)
- [ ] 🟠 **i13-b10** Run for school board (M)
- [ ] 🟠 **i13-b11** The Bruce House: be a museum docent (M)
- [ ] 🟠 **i13-b12** Coppei: the school before the town (S)
- [ ] 🟠 **i13-b13** Flood memory: the year the Touchet came over (M)
- [ ] 🟠 **i13-b14** Celebration Days through the years (M)
- [ ] 🟠 **i13-b15** The town's old charter, explained (S)
- [ ] 🟠 **i13-b16** A storefront closes, a storefront opens (M)
- [ ] 🟠 **i13-b17** Library card week (S)
- [ ] 🟠 **i13-b18** Library hours on the ballot (M)
- [ ] 🟠 **i13-b19** Fill a town board seat (M)
- [ ] 🟠 **i13-b20** Election Day helper (S)
- [ ] 🟠 **i13-b21** The town budget hearing (M)
- [ ] 🟠 **i13-b22** Volunteer firefighter tones (S)
- [ ] 🟡 **i13-b23** Old-timer oral history project (M)
- [ ] 🟡 **i13-b24** Historic district paint rules (S)
- [ ] 🟡 **i13-b25** A plaque for your house (S)
- [ ] 🟡 **i13-b26** The town's 'then and now' photo walk (M)
- [ ] 🟡 **i13-b27** Population sign update (S)
- [ ] 🟡 **i13-b28** A town hall on housing (M)
- [ ] 🟡 **i13-b29** Read the Tattler's minutes (S)
- [ ] 🟡 **i13-b30** A century in the Burg: lifetime town timeline (L)

</details>

## Ideas round 14 (pick on the build board)

68 ideas. Details: [docs/ideas/round-14.md](docs/ideas/round-14.md). 🔴 = recommended first.

<details><summary><b>Ideas 14: Vehicles and getting around</b> (33 ideas)</summary>

- [ ] 🔴 **i14-a01** More rides on the used lot: AWD wagon, minivan, hybrid (M)
- [ ] 🔴 **i14-a02** Sell it yourself: private sale or quick trade-in (M)
- [ ] 🟠 **i14-a03** A pickup in a neighbor's driveway: buy it, or get it checked first (M)
- [ ] 🟠 **i14-a04** The project truck in the shed (L)
- [ ] 🔴 **i14-a05** Change your own oil in the driveway (S)
- [ ] 🟡 **i14-a06** A rolling tool chest (S)
- [ ] 🔴 **i14-a07** A used electric car on a rural road (L)
- [ ] 🟠 **i14-a08** A charger comes to Main Street (S)
- [ ] 🟠 **i14-a09** Bike to Dayton in good weather (M)
- [ ] 🟠 **i14-a10** Walk to work on Main Street (S)
- [ ] 🟡 **i14-a11** A bike for the kids (S)
- [ ] 🔴 **i14-a12** Driver's ed and the learner's permit (M)
- [ ] 🟠 **i14-a13** The teen's first fender bender (S)
- [ ] 🟡 **i14-a14** Renew your license every eight years (S)
- [ ] 🔴 **i14-a15** The pump price on the Home tab (S)
- [ ] 🟠 **i14-a16** The ride board at the grocery store (M)
- [ ] 🟠 **i14-a17** Help a neighbor move with your pickup (S)
- [ ] 🔴 **i14-a18** A winter kit in the trunk (S)
- [ ] 🟠 **i14-a19** Highway 12 is closed (S)
- [ ] 🟡 **i14-a20** Shovel out the neighbor's car (S)
- [ ] 🟠 **i14-a21** Palouse Falls and Lyons Ferry on a summer Saturday (S)
- [ ] 🟡 **i14-a22** Wrong turn on a gravel road (S)
- [ ] 🔴 **i14-a23** What happens while your truck is in the shop (S)
- [ ] 🟠 **i14-a24** Pick your loan: 3, 5 or 7 years (S)
- [ ] 🟡 **i14-a25** Name your truck (S)
- [ ] 🟠 **i14-a26** One car or two (M)
- [ ] 🟡 **i14-a27** Someone took the catalytic converter (S)
- [ ] 🟠 **i14-a28** Retire the old beater: scrap it or give it to the school shop (S)
- [ ] 🟠 **i14-a29** A recall notice in the mail (S)
- [ ] 🟡 **i14-a30** A rock chip in the windshield (S)
- [ ] 🟠 **i14-a31** Pack a cooler for trips (S)
- [ ] 🟡 **i14-a32** Jump-start a stranger in the Kennewick lot (S)
- [ ] 🟠 **i14-a33** Tractors and combines on the road (M)

</details>

<details><summary><b>Ideas 14: Friends and social life</b> (35 ideas)</summary>

- [ ] 🔴 **i14-b01** Your crew: one friendship meter for your circle (M)
- [ ] 🔴 **i14-b02** Saturday invites from the group text (S)
- [ ] 🔴 **i14-b03** Say no too often and the invites stop (S)
- [ ] 🟠 **i14-b04** Game night, and your turn to host (S)
- [ ] 🟠 **i14-b05** A winter bowling league in Walla Walla (M)
- [ ] 🟠 **i14-b06** Becoming a regular at the ale house (S)
- [ ] 🟡 **i14-b07** The regulars' table: who's at the bar tonight (S)
- [ ] 🟡 **i14-b08** Fantasy football at the sports bar (M)
- [ ] 🟡 **i14-b09** Cards with the old-timers: cribbage at the café (S)
- [ ] 🔴 **i14-b10** The yearly group trip: who books it? (M)
- [ ] 🔴 **i14-b11** A falling out, and making up (M)
- [ ] 🟠 **i14-b12** Make up at Celebration Days (S)
- [ ] 🟠 **i14-b13** Lending money to a friend (S)
- [ ] 🟡 **i14-b14** A friend needs your couch (M)
- [ ] 🔴 **i14-b15** Small-town dating: everyone knows by Monday (M)
- [ ] 🟠 **i14-b16** A dating app with a 60-mile radius (M)
- [ ] 🟡 **i14-b17** Friends set you up on a blind date (S)
- [ ] 🟡 **i14-b18** Running into your ex at the grocery (S)
- [ ] 🔴 **i14-b19** Being new in town: from stranger to local (M)
- [ ] 🟡 **i14-b20** The two-finger steering-wheel wave (S)
- [ ] 🟡 **i14-b21** Who are your people? The first question you get (S)
- [ ] 🟠 **i14-b22** Social battery: introvert or extrovert as a play style (L)
- [ ] 🟠 **i14-b23** Quiet ways to belong (S)
- [ ] 🟠 **i14-b24** You're the subject of the gossip (M)
- [ ] 🟡 **i14-b25** A friend tells you a secret (S)
- [ ] 🟠 **i14-b26** The jam regulars' potluck (S)
- [ ] 🟡 **i14-b27** Carpool to a bluegrass festival (S)
- [ ] 🟠 **i14-b28** Celebration Days: who's back in town (S)
- [ ] 🟡 **i14-b29** The street dance after the parade (S)
- [ ] 🟠 **i14-b30** Friendsgiving for the folks with nowhere to go (S)
- [ ] 🟡 **i14-b31** Friends drift as life changes (M)
- [ ] 🟡 **i14-b32** After-shift beers with coworkers (S)
- [ ] 🟡 **i14-b33** Elk camp with the crew (S)
- [ ] 🟡 **i14-b34** A surprise party for a friend's 40th (S)
- [ ] 🟠 **i14-b35** Who shows up: friends at your send-off (S)

</details>

## Ideas round 15 (pick on the build board)

60 ideas. Details: [docs/ideas/round-15.md](docs/ideas/round-15.md). 🔴 = recommended first.

<details><summary><b>Ideas 15: Playtest of a long game</b> (27 ideas)</summary>

- [ ] 🔴 **i15-a01** Community counts your average, not the last week (S)
- [ ] 🔴 **i15-a02** Out and about gains taper off in the 80s, like Rest (S)
- [ ] 🔴 **i15-a03** Windstorm: a storm season and a real choice (S)
- [ ] 🔴 **i15-a04** A business that earns nothing says so (S)
- [ ] 🔴 **i15-a05** Sandbagging leads into the levee story too (S)
- [ ] 🟡 **i15-a06** "Truck trouble" names what you actually drive (S)
- [ ] 🟠 **i15-a07** Story steps are marked on event buttons (S)
- [ ] 🟠 **i15-a08** The wheat lease pays its own farming costs (S)
- [ ] 🟠 **i15-a09** Buy the wheat ground outright (M)
- [ ] 🟠 **i15-a10** A family can start inside a 5-year life (S)
- [ ] 🟠 **i15-a11** The dealer sheet shows the 5-year total (S)
- [ ] 🟠 **i15-a12** Overtime most weeks counts as a rut (S)
- [ ] 🟠 **i15-a13** Year in review: one lever, one leak (S)
- [ ] 🟠 **i15-a14** A work calendar: four sure beats a year (M)
- [ ] 🟠 **i15-a15** Standing trips and visits that keep running during skips (S)
- [ ] 🟠 **i15-a16** Long commutes use up your evenings (S)
- [ ] 🟡 **i15-a17** A friend's tip is for a job you would take (S)
- [ ] 🟠 **i15-a18** Score so far shows what is maxed and what can still grow (S)
- [ ] 🟠 **i15-a19** Main Street specials of the week (M)
- [ ] 🟡 **i15-a20** Dealership events skip a nearly new vehicle (S)
- [ ] 🟠 **i15-a21** Events for the business you own (M)
- [ ] 🟡 **i15-a22** Events that fit a comfortable life (M)
- [ ] 🟠 **i15-a23** Where your money came from (S)
- [ ] 🟠 **i15-a24** Long-game checks in the balance sim (S)
- [ ] 🟡 **i15-a25** A 15% 401(k) step (S)
- [ ] 🟡 **i15-a26** A turned-down story comes back once (S)
- [ ] 🟡 **i15-a27** The jam's boost fades after a few in a season (S)

</details>

<details><summary><b>Ideas 15: Planning tools and info</b> (33 ideas)</summary>

- [ ] 🔴 **i15-b01** Keep a small weekly history of money and the four stats (S)
- [ ] 🔴 **i15-b02** Tiny trend lines in the stat sheets (S)
- [ ] 🔴 **i15-b03** Money over time: cash and net worth on one chart (M)
- [ ] 🟠 **i15-b04** An on-pace mark for the net worth target (S)
- [ ] 🔴 **i15-b05** Where the money went: the last 4 weeks by kind (M)
- [ ] 🔴 **i15-b06** Up next: dated things in the next 8 weeks (M)
- [ ] 🟡 **i15-b07** A month view for the Journal (M)
- [ ] 🔴 **i15-b08** Compare two jobs side by side (M)
- [ ] 🟡 **i15-b09** Compare two rides on your own commute (S)
- [ ] 🟠 **i15-b10** Cushion: how many weeks of bills your cash covers (S)
- [ ] 🟠 **i15-b11** Payback time for classes (S)
- [ ] 🟠 **i15-b12** Progress bars for pinned life goals and challenges (S)
- [ ] 🟠 **i15-b13** How many weeks until you can afford it (S)
- [ ] 🟠 **i15-b14** Debt-free dates on every loan (S)
- [ ] 🟡 **i15-b15** Retirement check for Lifetime games (M)
- [ ] 🟠 **i15-b16** Month-end digest in the Journal (S)
- [ ] 🟠 **i15-b17** A notepad in the Journal (S)
- [ ] 🟠 **i15-b18** Remind me in a few weeks (S)
- [ ] 🟠 **i15-b19** Old Journal lines fold into month summaries (M)
- [ ] 🟡 **i15-b20** Star a Journal entry to keep it (S)
- [ ] 🟡 **i15-b21** Search the Journal (S)
- [ ] 🟡 **i15-b22** Journal sections by year (S)
- [ ] 🟡 **i15-b23** Copy the Journal as text (S)
- [ ] 🟠 **i15-b24** A table behind every chart (S)
- [ ] 🟠 **i15-b25** Year-to-date totals (M)
- [ ] 🟡 **i15-b26** Hours and miles behind the wheel (S)
- [ ] 🟠 **i15-b27** A job wishlist that says what's missing (S)
- [ ] 🟡 **i15-b28** 'Last time you picked this' on repeat events (S)
- [ ] 🟡 **i15-b29** Show money per week or per month (S)
- [ ] 🟡 **i15-b30** Side-hustle seasons at a glance (S)
- [ ] 🟠 **i15-b31** The Planner: everything on one screen (L)
- [ ] 🟡 **i15-b32** Compare two lives from the title screen (M)
- [ ] 🟡 **i15-b33** Big moments marked on the charts (M)

</details>

## Ideas round 16 (pick on the build board)

66 ideas. Details: [docs/ideas/round-16.md](docs/ideas/round-16.md). 🔴 = recommended first.

<details><summary><b>Ideas 16: Month by month</b> (34 ideas)</summary>

- [ ] 🟠 **i16-a01** January: The December card bill comes due (S)
- [ ] 🟠 **i16-a02** January: Ten below and the truck won't start (S)
- [ ] 🟡 **i16-a03** January: Polar plunge in the Touchet for the food bank (S)
- [ ] 🔴 **i16-a04** February: Valentine's dinner (S)
- [ ] 🟡 **i16-a05** February: Super Bowl Sunday (S)
- [ ] 🟡 **i16-a06** February: Prune vines for a week of winter cash (S)
- [ ] 🟠 **i16-a07** March: Spring break with the kids (S)
- [ ] 🟡 **i16-a08** March: State basketball in Spokane (S)
- [ ] 🟡 **i16-a09** March: Mud season on the county roads (S)
- [ ] 🟡 **i16-a10** April: Easter egg hunt at the park (S)
- [ ] 🟠 **i16-a11** April: Prom for your teen (M)
- [ ] 🟡 **i16-a12** April: Closing day at Bluewood (S)
- [ ] 🟠 **i16-a13** May: Mother's Day brunch (S)
- [ ] 🟡 **i16-a14** May: Teacher appreciation week (S)
- [ ] 🔴 **i16-a15** June: Pea harvest night shifts (M)
- [ ] 🟡 **i16-a16** June: Father's Day fishing (S)
- [ ] 🟡 **i16-a17** June: U-pick cherries over the Oregon line (S)
- [ ] 🟠 **i16-a18** July: Run the fireworks stand for the boosters (S)
- [ ] 🟡 **i16-a19** July: Summer camp in the Blues (S)
- [ ] 🔴 **i16-a20** August: Back-to-school week (S)
- [ ] 🟡 **i16-a21** August: Perseids over the wheat (S)
- [ ] 🟡 **i16-a22** August: The last truck and the harvest dinner (S)
- [ ] 🟠 **i16-a23** September: Labor Day weekend (S)
- [ ] 🟡 **i16-a24** September: Back-to-school night (S)
- [ ] 🔴 **i16-a25** October: Halloween on Main Street (S)
- [ ] 🟡 **i16-a26** October: A week on an orchard picking crew (S)
- [ ] 🟡 **i16-a27** November: Veterans Day at the school gym (S)
- [ ] 🟡 **i16-a28** November: Ski swap at the fairgrounds (S)
- [ ] 🟡 **i16-a29** November: Turkey trot down Main Street (S)
- [ ] 🟠 **i16-a30** December: Cut your own tree in the Blues (S)
- [ ] 🟡 **i16-a31** December: The school Christmas concert (S)
- [ ] 🟡 **i16-a32** December: A year-end gift to the food bank (S)
- [ ] 🔴 **i16-a33** January–December: Holidays land on the right week (M)
- [ ] 🟠 **i16-a34** January–December: The month at a glance on Home (M)

</details>

<details><summary><b>Ideas 16: For every play style</b> (32 ideas)</summary>

- [ ] 🔴 **i16-b01** [Optimizer] A focus queue: plan the next four weeks (M)
- [ ] 🟡 **i16-b02** [Optimizer] Copy your life's weekly numbers as CSV (S)
- [ ] 🟠 **i16-b03** [Optimizer] Soft-cap ticks on the stat bars (S)
- [ ] 🟡 **i16-b04** [Optimizer] Tag a life with your strategy name (M)
- [ ] 🔴 **i16-b05** [Storyteller] Name each year like a book chapter (S)
- [ ] 🟡 **i16-b06** [Storyteller] A narrator voice: plain, porch-talk or dry (M)
- [ ] 🟠 **i16-b07** [Storyteller] Why you did it: a reason chip on big choices (S)
- [ ] 🟠 **i16-b08** [Storyteller] Still unfolding: open story threads (S)
- [ ] 🔴 **i16-b09** [Explorer] A dot on choices you've never picked (S)
- [ ] 🟠 **i16-b10** [Explorer] Seasonal pins that come and go (M)
- [ ] 🟡 **i16-b11** [Explorer] Old townsites on the region map (M)
- [ ] 🟠 **i16-b12** [Explorer] Ask a local which way to go (S)
- [ ] 🔴 **i16-b13** [Homebody] Pick how you rest: read, bake, tinker or nap (M)
- [ ] 🟡 **i16-b14** [Homebody] Houseplants on the windowsill (S)
- [ ] 🟠 **i16-b15** [Homebody] A craft table that sells from home (M)
- [ ] 🟡 **i16-b16** [Homebody] Badges where the house is the hero (S)
- [ ] 🔴 **i16-b17** [Social Butterfly] A contacts list with 'last talked' weeks (M)
- [ ] 🟠 **i16-b18** [Social Butterfly] Play matchmaker for two neighbors (M)
- [ ] 🟠 **i16-b19** [Social Butterfly] Put in a word to get a friend hired (S)
- [ ] 🟡 **i16-b20** [Social Butterfly] Throw a block party in summer (M)
- [ ] 🔴 **i16-b21** [Collector] One collections page for every set (M)
- [ ] 🟠 **i16-b22** [Collector] The license plate game on Highway 12 (S)
- [ ] 🟡 **i16-b23** [Collector] Rocks from the river bars (S)
- [ ] 🟠 **i16-b24** [Collector] A stop passport with a stamp for each place (S)
- [ ] 🟠 **i16-b25** [Speedrunner] Split times for milestones (M)
- [ ] 🔴 **i16-b26** [Speedrunner] Turbo setting: no animations, events still stop (S)
- [ ] 🟡 **i16-b27** [Speedrunner] A run code that proves your result (M)
- [ ] 🟡 **i16-b28** [Speedrunner] Practice one hard stretch (M)
- [ ] 🔴 **i16-b29** [Parent + Kid] Guess first: what will happen? (S)
- [ ] 🟡 **i16-b30** [Parent + Kid] Count the paycheck in coins and bills (S)
- [ ] 🟡 **i16-b31** [Parent + Kid] Kid draws the dog or the truck (M)
- [ ] 🟠 **i16-b32** [Parent + Kid] Picture icons on event choices (S)

</details>

## Ideas round 17 (pick on the build board)

62 ideas. Details: [docs/ideas/round-17.md](docs/ideas/round-17.md). 🔴 = recommended first.

<details><summary><b>Ideas 17: Starting out</b> (30 ideas)</summary>

- [ ] 🔴 **i17-a01** Graduation night: a three-choice opening scene (M)
- [ ] 🔴 **i17-a02** Three doors on day one: a starter job, a program, a place (M)
- [ ] 🔴 **i17-a03** Opening weeks run on their own small event pool (M)
- [ ] 🔴 **i17-a04** Staying with family: a new starting background (L)
- [ ] 🟠 **i17-a05** Moving-out week: pack the pickup (S)
- [ ] 🟠 **i17-a06** Move back home for a while (M)
- [ ] 🟠 **i17-a07** The pickup is Dad's, and he wants it back (M)
- [ ] 🟠 **i17-a08** Open your first checking account (S)
- [ ] 🟠 **i17-a09** Your phone: stay on the family plan or get your own (S)
- [ ] 🟠 **i17-a10** On your parents' health insurance until 26 (S)
- [ ] 🟡 **i17-a11** Car insurance drops at 25 (S)
- [ ] 🟡 **i17-a12** First speeding ticket on Highway 12 (S)
- [ ] 🟠 **i17-a13** Graduation money in a card (S)
- [ ] 🔴 **i17-a14** Friends leave in August, come home at Thanksgiving (M)
- [ ] 🟠 **i17-a15** Where your class went: four classmates you can follow (M)
- [ ] 🟡 **i17-a16** Your old coach still checks in (S)
- [ ] 🟡 **i17-a17** Running Start credits from high school (S)
- [ ] 🟠 **i17-a18** Ask three people before you pick a path (S)
- [ ] 🟠 **i17-a19** A job shadow day (M)
- [ ] 🔴 **i17-a20** Financial aid: fill out the FAFSA by the deadline (M)
- [ ] 🟠 **i17-a21** Talk to the recruiter: enlist at 18–20 (L)
- [ ] 🟠 **i17-a22** Your 90-day review at your first job (S)
- [ ] 🟡 **i17-a23** Young bodies bounce back, late nights tempt (S)
- [ ] 🟡 **i17-a24** Rental history: your first landlord's reference (S)
- [ ] 🟠 **i17-a25** Adulting badges: firsts that count (S)
- [ ] 🟡 **i17-a26** A younger brother who needs a ride (S)
- [ ] 🟠 **i17-a27** The 18-year-old's money list on Home (S)
- [ ] 🟡 **i17-a28** A summer fire crew for 18–24 (M)
- [ ] 🟡 **i17-a29** Turning 21 with your friends (S)
- [ ] 🟠 **i17-a30** The plan you made at 18, looked at again at 25 (M)

</details>

<details><summary><b>Ideas 17: Getting it to players</b> (32 ideas)</summary>

- [ ] 🔴 **i17-b01** A link preview that shows the town when shared (S)
- [ ] 🔴 **i17-b02** A README written for players first (S)
- [ ] 🔴 **i17-b03** A real privacy policy page at its own address (S)
- [ ] 🔴 **i17-b04** Release notes players actually read (S)
- [ ] 🔴 **i17-b05** A Waitsburg launch kit: flyer, poster and tear-off strips (M)
- [ ] 🔴 **i17-b06** Measuring what players do without tracking them (M)
- [ ] 🔴 **i17-b07** A beta tester group with a 'try this' list (M)
- [ ] 🔴 **i17-b08** Free and ad-free, said plainly, with the costs written down (S)
- [ ] 🟠 **i17-b09** Microsoft Store listing kit (M)
- [ ] 🟠 **i17-b10** One listing file for every store and the site (S)
- [ ] 🟠 **i17-b11** Showcase lives for screenshots that can be remade (M)
- [ ] 🟠 **i17-b12** A 30-second trailer made by the game itself (M)
- [ ] 🟠 **i17-b13** A press kit page (S)
- [ ] 🟠 **i17-b14** A story for the local paper (S)
- [ ] 🟠 **i17-b15** Celebration Days booth mode (M)
- [ ] 🟠 **i17-b16** Shared computers at the library and school (S)
- [ ] 🟠 **i17-b17** Launch week challenge on the library board (S)
- [ ] 🟠 **i17-b18** A page for Waitsburg's real businesses (S)
- [ ] 🟠 **i17-b19** Plain-language report forms on GitHub (M)
- [ ] 🟠 **i17-b20** A public roadmap in plain words (S)
- [ ] 🟠 **i17-b21** Support and FAQ from one file (S)
- [ ] 🟠 **i17-b22** A 'Get the game' page that picks the right install (M)
- [ ] 🟠 **i17-b23** iPhone as a first-class web app (M)
- [ ] 🟠 **i17-b24** Honest age rating answers, kept honest (S)
- [ ] 🟠 **i17-b25** A note for parents and teachers (S)
- [ ] 🟠 **i17-b26** A kind review ask, once (S)
- [ ] 🟠 **i17-b27** A store-day checklist the release prints (S)
- [ ] 🟡 **i17-b28** Count downloads from what's already public (S)
- [ ] 🟡 **i17-b29** A problems log that stays on the phone (S)
- [ ] 🟡 **i17-b30** One version number everywhere (S)
- [ ] 🟡 **i17-b31** A first-five-minutes test like a store reviewer (M)
- [ ] 🟡 **i17-b32** A small website with the game at /play (L)

</details>

## Ideas round 18 (pick on the build board)

61 ideas. Details: [docs/ideas/round-18.md](docs/ideas/round-18.md). 🔴 = recommended first.

<details><summary><b>Ideas 18: Farm, land and animals</b> (31 ideas)</summary>

- [ ] 🔴 **i18-a01** Cash rent or crop share on the wheat lease (S)
- [ ] 🟠 **i18-a02** The landowner is a person you keep happy (M)
- [ ] 🟠 **i18-a03** Peas or summer fallow: the rotation choice (M)
- [ ] 🟡 **i18-a04** A harvest scale ticket instead of one number (S)
- [ ] 🟠 **i18-a05** Join the grain co-op and get a patronage check (S)
- [ ] 🟠 **i18-a06** The farm credit operating line (M)
- [ ] 🟡 **i18-a07** Enroll ground in the conservation program (S)
- [ ] 🟠 **i18-a08** Drought year: the county declares a disaster (M)
- [ ] 🟠 **i18-a09** Hay: three cuttings and a rain risk (M)
- [ ] 🟠 **i18-a10** Water rights come with the land, or they don't (M)
- [ ] 🔴 **i18-a11** A few acres outside town (the hobby farm home) (M)
- [ ] 🟡 **i18-a12** The hobby farm ledger: what it really costs (S)
- [ ] 🔴 **i18-a13** 4-H: your kid raises a market lamb (M)
- [ ] 🟡 **i18-a14** Be a 4-H club leader (S)
- [ ] 🟡 **i18-a15** Lambing season keeps you up in February (M)
- [ ] 🟡 **i18-a16** Bees for the orchards (S)
- [ ] 🟠 **i18-a17** Plant an orchard or vines: a slow business (L)
- [ ] 🟡 **i18-a18** Frost night: help run the wind machines (S)
- [ ] 🟠 **i18-a19** Buy an old combine and cut for neighbors (M)
- [ ] 🟡 **i18-a20** The combine breaks down mid-harvest (S)
- [ ] 🟠 **i18-a21** Farm auctions: an estate sale out on the county road (M)
- [ ] 🟠 **i18-a22** Rent more ground when an old farmer retires (M)
- [ ] 🟡 **i18-a23** A fence line dispute with the neighbor (S)
- [ ] 🟡 **i18-a24** A hunting lease on your ground (S)
- [ ] 🟡 **i18-a25** A wind company wants to lease your ridge (M)
- [ ] 🟠 **i18-a26** A farm stand at the end of the driveway (S)
- [ ] 🟡 **i18-a27** Sale-barn café on Tuesday (S)
- [ ] 🟠 **i18-a28** A Farming skill you earn in the field (M)
- [ ] 🟡 **i18-a29** Who feeds the animals when you're gone? (S)
- [ ] 🟡 **i18-a30** Barn raising after a neighbor's fire (S)
- [ ] 🟡 **i18-a31** Ten years on the same ground (S)

</details>

<details><summary><b>Ideas 18: Luck and the unexpected</b> (30 ideas)</summary>

- [ ] 🔴 **i18-b01** A luck tally for the year: good breaks and bad breaks (M)
- [ ] 🔴 **i18-b02** A rough stretch, said out loud (S)
- [ ] 🟠 **i18-b03** How luck works, written in Help (S)
- [ ] 🟠 **i18-b04** 'Why me?' on a bad-luck event (S)
- [ ] 🟠 **i18-b05** Windfalls wait a week (M)
- [ ] 🔴 **i18-b06** Insurance claims take weeks, not a tap (M)
- [ ] 🟠 **i18-b07** Walk the house with your phone: a home inventory (S)
- [ ] 🔴 **i18-b08** Storm-chaser roofer at the door (S)
- [ ] 🟠 **i18-b09** A rental that's too cheap to be real (S)
- [ ] 🟡 **i18-b10** The buyer who overpays for your truck (S)
- [ ] 🟡 **i18-b11** A card of scam signs you collect (S)
- [ ] 🔴 **i18-b12** Flood insurance waits 30 days (M)
- [ ] 🟠 **i18-b13** Flood zone and fire edge on the home cards and map (M)
- [ ] 🔴 **i18-b14** Wildfire evacuation: Ready, Set, Go (M)
- [ ] 🟠 **i18-b15** A go bag by the door (S)
- [ ] 🟡 **i18-b16** The smoke alarm chirps at 3 a.m. (S)
- [ ] 🟠 **i18-b17** A kitchen fire: small and recoverable (M)
- [ ] 🟡 **i18-b18** Hail on the hood (S)
- [ ] 🟠 **i18-b19** Pipes freeze in a cold snap (S)
- [ ] 🟡 **i18-b20** Trim the big tree before storm season (S)
- [ ] 🔴 **i18-b21** Mud-out day: the town comes to your house (L)
- [ ] 🟡 **i18-b22** A relief shelter at the school gym (S)
- [ ] 🟡 **i18-b23** Disaster aid after a declared flood (M)
- [ ] 🟠 **i18-b24** A relief jar on the café counter (S)
- [ ] 🟡 **i18-b25** Scratch tickets with the real odds (S)
- [ ] 🟡 **i18-b26** A lucky penny that admits it does nothing (S)
- [ ] 🟠 **i18-b27** January: what could go wrong this year (M)
- [ ] 🟠 **i18-b28** Luck versus choices on the end screen (M)
- [ ] 🟡 **i18-b29** Good deeds come back, and Help says so (S)
- [ ] 🟠 **i18-b30** A sure thing from a friend at church (S)

</details>

## Ideas round 19 (pick on the build board)

63 ideas. Details: [docs/ideas/round-19.md](docs/ideas/round-19.md). 🔴 = recommended first.

<details><summary><b>Ideas 19: Build bundles</b> (30 ideas)</summary>

- [ ] 🔴 **i19-a01** Bundle: Neighbors on your street (L)
- [ ] 🔴 **i19-a02** Bundle: Partner with a name and a meter (L)
- [ ] 🔴 **i19-a03** Bundle: Aging parents and caregiving (L)
- [ ] 🔴 **i19-a04** Bundle: Kids grow up in stages (L)
- [ ] 🟠 **i19-a05** Bundle: Garden, canning and the freezer (M)
- [ ] 🟠 **i19-a06** Bundle: Volunteer fire and search crews (M)
- [ ] 🟠 **i19-a07** Bundle: Council seat and town votes (L)
- [ ] 🔴 **i19-a08** Bundle: Job standing, boss and coworkers (L)
- [ ] 🟠 **i19-a09** Bundle: Job ladders with visible rungs (M)
- [ ] 🟠 **i19-a10** Bundle: A job market that moves (M)
- [ ] 🟠 **i19-a11** Bundle: Shifts and the work week (M)
- [ ] 🟠 **i19-a12** Bundle: Town standing you can spend (M)
- [ ] 🔴 **i19-a13** Bundle: Savings jar and cushion (M)
- [ ] 🟠 **i19-a14** Bundle: Debt help: refinance, plans and bankruptcy (M)
- [ ] 🟠 **i19-a15** Bundle: Homeowner upkeep and upgrades (M)
- [ ] 🟡 **i19-a16** Bundle: Roommate and the spare room (S)
- [ ] 🟡 **i19-a17** Bundle: Pets with names that grow old (M)
- [ ] 🟠 **i19-a18** Bundle: Friends and your crew (M)
- [ ] 🟠 **i19-a19** Bundle: Retirement chapter (M)
- [ ] 🔴 **i19-a20** Bundle: A final season and a fitting ending (L)
- [ ] 🟡 **i19-a21** Bundle: The shelf of lives and the family tree (M)
- [ ] 🟠 **i19-a22** Bundle: What gets passed down (M)
- [ ] 🟠 **i19-a23** Bundle: Weather and the seasons (M)
- [ ] 🟠 **i19-a24** Bundle: Wants and worries (M)
- [ ] 🔴 **i19-a25** Bundle: Choices that show what they do (M)
- [ ] 🟠 **i19-a26** Bundle: Plan the week ahead (M)
- [ ] 🟠 **i19-a27** Bundle: The wheat lease as a real farm (L)
- [ ] 🟠 **i19-a28** Bundle: Body, habits and health over time (M)
- [ ] 🟡 **i19-a29** Bundle: Holidays on the calendar (M)
- [ ] 🟡 **i19-a30** Bundle: Charts of your life (M)

</details>

<details><summary><b>Ideas 19: Custom games and settings</b> (33 ideas)</summary>

- [ ] 🔴 **i19-b01** One rules object every system reads (M)
- [ ] 🔴 **i19-b02** Change the rules: one folded button on the start sheet (S)
- [ ] 🔴 **i19-b03** This life counts toward: a live badge on the rules sheet (S)
- [ ] 🔴 **i19-b04** Like Normal, but...: every knob shows the Normal value (S)
- [ ] 🔴 **i19-b05** What this means for a week: dollar examples on each knob (S)
- [ ] 🟠 **i19-b06** Easier or harder: a simple meter for your rule set (S)
- [ ] 🟠 **i19-b07** Pick any game length, in weeks (M)
- [ ] 🟡 **i19-b08** End at an age you pick (S)
- [ ] 🟠 **i19-b09** Starting money: Broke, Standard or Comfortable (S)
- [ ] 🟠 **i19-b10** Inflation dial: frozen, usual or 1970s (S)
- [ ] 🟠 **i19-b11** Pick which kinds of events show up (M)
- [ ] 🟠 **i19-b12** Turn whole systems on or off (L)
- [ ] 🟡 **i19-b13** Start in any month (S)
- [ ] 🟠 **i19-b14** Longer turns for long lives (L)
- [ ] 🔴 **i19-b15** Assist: handle the routine stuff for me (S)
- [ ] 🟠 **i19-b16** Assist: let the game answer small events (S)
- [ ] 🟠 **i19-b17** Assist: no game over (S)
- [ ] 🟡 **i19-b18** Assist: warn me before cash goes under a line (S)
- [ ] 🔴 **i19-b19** You can turn assists off mid-life, not on (S)
- [ ] 🟠 **i19-b20** Built-in preset cards (M)
- [ ] 🟡 **i19-b21** Preset cards show a typical score range (S)
- [ ] 🟠 **i19-b22** Save your own presets (S)
- [ ] 🟠 **i19-b23** Share a preset as a short code (S)
- [ ] 🟠 **i19-b24** Type a word as your seed (S)
- [ ] 🟡 **i19-b25** Same seed, new rules: compare two runs (M)
- [ ] 🟠 **i19-b26** A Custom shelf grouped by rule set (M)
- [ ] 🟡 **i19-b27** Rules show on the score card and share image (S)
- [ ] 🔴 **i19-b28** Rules lock for weekly challenges and scenarios (S)
- [ ] 🟠 **i19-b29** Rules travel safely in backups (S)
- [ ] 🟠 **i19-b30** Tinker sheet for sandbox lives (M)
- [ ] 🟡 **i19-b31** Event browser: try any event in a sandbox (S)
- [ ] 🟠 **i19-b32** Custom games, explained: a plain Help page (S)
- [ ] 🔴 **i19-b33** The sim plays every preset and the extreme knobs (M)

</details>

## Ideas round 20 (pick on the build board)

65 ideas. Details: [docs/ideas/round-20.md](docs/ideas/round-20.md). 🔴 = recommended first.

<details><summary><b>Ideas 20: Screen by screen</b> (35 ideas)</summary>

- [ ] 🔴 **i20-a01** [Jobs] Town filter chips stop squashing into circles (S)
- [ ] 🔴 **i20-a02** [Journal] Filter chips show whole words and a count (S)
- [ ] 🔴 **i20-a03** [Home] Toasts sit above the bottom bars, not on top of them (S)
- [ ] 🔴 **i20-a04** [Event] Hold toasts while an event sheet is open (S)
- [ ] 🔴 **i20-a05** [Home] A slimmer bottom stack on short phones (M)
- [ ] 🟠 **i20-a06** [Home] Fast-forward buttons say what they do (S)
- [ ] 🟠 **i20-a07** [Home] Map view gets the room it needs (M)
- [ ] 🟡 **i20-a08** [Home] Town goal box: one short line and progress dots (S)
- [ ] 🔴 **i20-a09** [Jobs] Section headers: can apply, needs a certificate, needs a degree (M)
- [ ] 🟠 **i20-a10** [Jobs] Clearer pay words: before tax and take-home (S)
- [ ] 🟠 **i20-a11** [Jobs] Locked buttons name what you need (S)
- [ ] 🟠 **i20-a12** [Jobs] Your current job pinned as its own card (M)
- [ ] 🟡 **i20-a13** [Jobs] Quit my job looks like a risky button (S)
- [ ] 🔴 **i20-a14** [Life] Buy buttons never cut off (S)
- [ ] 🟠 **i20-a15** [Life] Jump chips at the top of a long tab (M)
- [ ] 🟡 **i20-a16** [Life] Badges row says what you earned (S)
- [ ] 🟡 **i20-a17** [Life] Household rows in plain words (S)
- [ ] 🟡 **i20-a18** [Life] Around town buttons side by side (S)
- [ ] 🟡 **i20-a19** [Life] What you have stands out from what you could buy (S)
- [ ] 🟠 **i20-a20** [Main Street] Readable labels on the close-up map (M)
- [ ] 🟠 **i20-a21** [Region map] Bars don't cover the bottom of the map (S)
- [ ] 🔴 **i20-a22** [Business card] One way to count visits (S)
- [ ] 🔴 **i20-a23** [Trip] A header that stays put on the trip sheet (M)
- [ ] 🟠 **i20-a24** [Sheets] Close and main action pinned at the bottom of long sheets (M)
- [ ] 🟠 **i20-a25** [Menu] Save first, risky last (S)
- [ ] 🟡 **i20-a26** [All] Names ending in s read right (S)
- [ ] 🟠 **i20-a27** [Life goals] A picked counter and Done button in view (S)
- [ ] 🔴 **i20-a28** [End] Score math in a clean table (S)
- [ ] 🟡 **i20-a29** [Title] Mode and start chips in a tidy grid (S)
- [ ] 🔴 **i20-a30** [Challenges] Start buttons fit on screen (S)
- [ ] 🟠 **i20-a31** [Weekly] Name the week in plain words (S)
- [ ] 🟡 **i20-a32** [Records] Your bests stand out from the dashes (S)
- [ ] 🟡 **i20-a33** [What's new] Short list, then 'See all' (S)
- [ ] 🟡 **i20-a34** [Tutorial] The highlight ring hugs the button (S)
- [ ] 🟡 **i20-a35** [Tablet] Bottom bars match the content column (S)

</details>

<details><summary><b>Ideas 20: What winning means</b> (30 ideas)</summary>

- [ ] 🔴 **i20-b01** Play for something: pick a life aim (L)
- [ ] 🟠 **i20-b02** Roots: a measure of how deep you grew in (M)
- [ ] 🟠 **i20-b03** Adventure: a measure of the new things you tried (M)
- [ ] 🟠 **i20-b04** Legacy: what outlasts you (M)
- [ ] 🔴 **i20-b05** Good weeks: a count money can't buy (S)
- [ ] 🔴 **i20-b06** Your aim can change, but it counts by the week (S)
- [ ] 🟠 **i20-b07** End titles from your aim and your score (S)
- [ ] 🟡 **i20-b08** Low scores get kind titles (S)
- [ ] 🟠 **i20-b09** Two verdicts at the end: the town's and yours (M)
- [ ] 🟡 **i20-b10** Rate your own life before you see the score (S)
- [ ] 🟠 **i20-b11** Security, not riches, in short games (M)
- [ ] 🟠 **i20-b12** An 'enough' line on the score sheet (S)
- [ ] 🔴 **i20-b13** A balanced life counts more than one maxed part (S)
- [ ] 🔴 **i20-b14** The Life Score is the average of your report cards (M)
- [ ] 🟠 **i20-b15** Net worth counts what you'd really walk away with (S)
- [ ] 🟠 **i20-b16** Score so far says what the last weeks can still change (S)
- [ ] 🟠 **i20-b17** Your three turning points (M)
- [ ] 🟠 **i20-b18** The score as a picture: four bars and their weights (S)
- [ ] 🟡 **i20-b19** Try other weights on the end screen (S)
- [ ] 🟡 **i20-b20** Every part's score in plain words (S)
- [ ] 🟡 **i20-b21** Your aim shows up on birthdays (S)
- [ ] 🟠 **i20-b22** Halfway reckoning: is this still what you want? (S)
- [ ] 🔴 **i20-b23** No aim beats another: a balance-sim check (S)
- [ ] 🟠 **i20-b24** Share card leads with good weeks, not money (S)
- [ ] 🟠 **i20-b25** Compare lives by what mattered, not dollars (M)
- [ ] 🟡 **i20-b26** Pick your epitaph from three lines (S)
- [ ] 🟠 **i20-b27** The goals sheet suggests badges for your aim (S)
- [ ] 🟠 **i20-b28** New badges money can't buy (S)
- [ ] 🟡 **i20-b29** A weekly challenge board for each aim (S)
- [ ] 🟡 **i20-b30** Your partner has an aim too (M)

</details>

## Ideas round 21 (pick on the build board)

64 ideas. Details: [docs/ideas/round-21.md](docs/ideas/round-21.md). 🔴 = recommended first.

<details><summary><b>Ideas 21: Writing and voice</b> (30 ideas)</summary>

- [ ] 🔴 **i21-a01** Real job names in event text (S)
- [ ] 🔴 **i21-a02** Workplace words for each kind of job (M)
- [ ] 🟠 **i21-a03** Retire the repeated punchlines (S)
- [ ] 🟠 **i21-a04** A test that catches repeated lines (S)
- [ ] 🟠 **i21-a05** Saying no gets a real line (M)
- [ ] 🟡 **i21-a06** Choice buttons in one voice (S)
- [ ] 🟡 **i21-a07** An exclamation-mark budget (S)
- [ ] 🔴 **i21-a08** Text that knows your age (M)
- [ ] 🔴 **i21-a09** Text that knows where you came from (S)
- [ ] 🟠 **i21-a10** Text that knows who's at home (M)
- [ ] 🟠 **i21-a11** Text that knows how you're doing (M)
- [ ] 🔴 **i21-a12** A last line that fits the life (S)
- [ ] 🟡 **i21-a13** Leaving town in debt, with some dignity (S)
- [ ] 🟡 **i21-a14** Decade birthdays that mention your life (S)
- [ ] 🟠 **i21-a15** A bigger Tattler, by month, without repeats (M)
- [ ] 🟡 **i21-a16** One spelling for every local place (S)
- [ ] 🟠 **i21-a17** A dry closer for flat result lines (M)
- [ ] 🟠 **i21-a18** Our best lines as the voice examples (S)
- [ ] 🟠 **i21-a19** First names for the people you meet once (M)
- [ ] 🟠 **i21-a20** Townsfolk who speak in their own words (M)
- [ ] 🔴 **i21-a21** A valley detail in every generic event (M)
- [ ] 🔴 **i21-a22** A say() helper with variants and tokens (M)
- [ ] 🟡 **i21-a23** Event titles in one style (S)
- [ ] 🟡 **i21-a24** Business events that start at the moment (S)
- [ ] 🟠 **i21-a25** Journal lines in one voice (S)
- [ ] 🟡 **i21-a26** Small wins and big wins read differently (S)
- [ ] 🟡 **i21-a27** Retirement that fits the job you left (S)
- [ ] 🟡 **i21-a28** A local's tip in each Help section (S)
- [ ] 🟡 **i21-a29** Season touches inside events (M)
- [ ] 🟠 **i21-a30** A rewrite pass on the ten flattest events (L)

</details>

<details><summary><b>Ideas 21: The economy over decades</b> (34 ideas)</summary>

- [ ] 🔴 **i21-b01** The mortgage ends after 30 years (S)
- [ ] 🔴 **i21-b02** A real home value, with equity as value minus the loan (M)
- [ ] 🟠 **i21-b03** Home prices run on their own index, not the price of milk (M)
- [ ] 🟠 **i21-b04** The bank checks your pay before the mortgage (S)
- [ ] 🟡 **i21-b05** Affordability on the Homes list: years of pay (S)
- [ ] 🔴 **i21-b06** A valley cycle that lasts years, not coin flips (M)
- [ ] 🟠 **i21-b07** Hiring freeze: the job board thins out in a recession (S)
- [ ] 🟠 **i21-b08** Raises freeze, then catch up (S)
- [ ] 🔴 **i21-b09** 401(k) and savings follow the cycle (M)
- [ ] 🟠 **i21-b10** Panic or hold: the market-drop card (S)
- [ ] 🟠 **i21-b11** One interest rate runs the whole economy (M)
- [ ] 🟡 **i21-b12** Your locked payment gets lighter every year (S)
- [ ] 🟠 **i21-b13** Rent goes up once a year, at lease renewal (S)
- [ ] 🟠 **i21-b14** Pay steps up each January, by employer type (S)
- [ ] 🔴 **i21-b15** Washington's minimum wage rises with prices each January (S)
- [ ] 🟠 **i21-b16** Real pay that rises a little with experience (M)
- [ ] 🔴 **i21-b17** Prices that rise at different speeds (M)
- [ ] 🟠 **i21-b18** Gas shocks that last a year or two (S)
- [ ] 🟡 **i21-b19** Newer cars get better mileage over the years (M)
- [ ] 🔴 **i21-b20** See everything in today's dollars or 2027 dollars (S)
- [ ] 🟠 **i21-b21** What it costs in hours of your work (S)
- [ ] 🟠 **i21-b22** Your cash lost value this year (S)
- [ ] 🟡 **i21-b23** A decade chart of the valley economy (M)
- [ ] 🟠 **i21-b24** Pick your withdrawal rate in retirement (S)
- [ ] 🟠 **i21-b25** Does retirement cover the bills? A plain check (S)
- [ ] 🟡 **i21-b26** Claim Social Security at 62, 67 or 70 (S)
- [ ] 🟡 **i21-b27** Older workers in a downturn (S)
- [ ] 🟡 **i21-b28** Extended unemployment in a recession (S)
- [ ] 🟡 **i21-b29** Booms tempt you to buy high (S)
- [ ] 🔴 **i21-b30** Sim test: frozen prices give the same score (S)
- [ ] 🔴 **i21-b31** Sim test: affordability stays sane every decade (M)
- [ ] 🟠 **i21-b32** Sim test: a recession at the worst time (M)
- [ ] 🟠 **i21-b33** A check that every price goes through cost() (S)
- [ ] 🟡 **i21-b34** Two lives, one economy: an economy seed (S)

</details>

## Ideas round 22 (pick on the build board)

56 ideas. Details: [docs/ideas/round-22.md](docs/ideas/round-22.md). 🔴 = recommended first.

<details><summary><b>Ideas 22: Bug hunt</b> (26 ideas)</summary>

- [ ] 🔴 **i22-a01** Closing the app mid-event no longer dodges it (M)
- [ ] 🔴 **i22-a02** An ending sticks even if you close the app (M)
- [ ] 🔴 **i22-a03** A new job clears leftover unemployment (S)
- [ ] 🔴 **i22-a04** No harvest check the week you lease the ground (S)
- [ ] 🟠 **i22-a05** No harvest check after the lease is up (S)
- [ ] 🔴 **i22-a06** Renewing the lease can't be flipped for profit (S)
- [ ] 🔴 **i22-a07** A goal you already meet when you pin it doesn't count (S)
- [ ] 🔴 **i22-a08** Old winter tires don't come back with a new car (S)
- [ ] 🔴 **i22-a09** The friend's job tip shows today's pay (S)
- [ ] 🔴 **i22-a10** Raise and promotion text tell the truth at the cap (S)
- [ ] 🟠 **i22-a11** A raise doesn't reset your time on the job (S)
- [ ] 🔴 **i22-a12** The food truck counts as hustling (S)
- [ ] 🔴 **i22-a13** The bluegrass jam event comes on a jam week (S)
- [ ] 🔴 **i22-a14** The gas-spike event counts remote days and carpools (S)
- [ ] 🔴 **i22-a15** Extra class weeks carry over when you graduate (S)
- [ ] 🔴 **i22-a16** Helping with college checks your cash first (S)
- [ ] 🟠 **i22-a17** Your partner gets Social Security too (S)
- [ ] 🟠 **i22-a18** Hard mode's +10% leaves the mortgage alone (S)
- [ ] 🔴 **i22-a19** The Lifetime progress bar and the score agree (S)
- [ ] 🟠 **i22-a20** Older saves get a mortgage in today's dollars (S)
- [ ] 🟠 **i22-a21** A restored backup checks home, car and job ids (S)
- [ ] 🟠 **i22-a22** Sim bots skip weeks too (M)
- [ ] 🟠 **i22-a23** Sim bots buy homes and cars and start the next generation (M)
- [ ] 🟠 **i22-a24** The sim checks every number, not just five (S)
- [ ] 🟠 **i22-a25** Trip stops get checked again if you go into debt (S)
- [ ] 🟠 **i22-a26** Moving away from the fixer-upper ends its story (S)

</details>

<details><summary><b>Ideas 22: Inside a week</b> (30 ideas)</summary>

- [ ] 🔴 **i22-b01** Day notes: five weekday lines in the week summary (S)
- [ ] 🔴 **i22-b02** Tonight: one evening tap a week (M)
- [ ] 🔴 **i22-b03** A week recap that tells a tiny story (M)
- [ ] 🔴 **i22-b04** Keep a turn under 20 seconds: a turn-budget test (S)
- [ ] 🔴 **i22-b05** A midweek tap, inline in the recap (M)
- [ ] 🟠 **i22-b06** Moment pack: 90 small daily lines (M)
- [ ] 🟠 **i22-b07** Jobs set which days are your weekend (M)
- [ ] 🟠 **i22-b08** Overtime and hustle eat your weekend (S)
- [ ] 🟠 **i22-b09** The weekend writes itself (S)
- [ ] 🟠 **i22-b10** Sunday night feeling: a one-word read (S)
- [ ] 🟠 **i22-b11** Quick reactions to the week's result (S)
- [ ] 🟠 **i22-b12** The week's best moment chip (S)
- [ ] 🟠 **i22-b13** Money in day order (S)
- [ ] 🟠 **i22-b14** Fewer sheets: small notes go to the strip (S)
- [ ] 🟠 **i22-b15** Quiet weeks play faster (S)
- [ ] 🟠 **i22-b16** Household evenings (S)
- [ ] 🟡 **i22-b17** Evening habits form on their own (M)
- [ ] 🟡 **i22-b18** Day notes that hint at next week (M)
- [ ] 🟡 **i22-b19** Name every week (S)
- [ ] 🟡 **i22-b20** A snapshot of the week (M)
- [ ] 🟡 **i22-b21** The year in review picks its best weeks (S)
- [ ] 🟡 **i22-b22** Skip digest: one line per week (S)
- [ ] 🟡 **i22-b23** A text after a rough week (S)
- [ ] 🟡 **i22-b24** One-thumb turn layout (S)
- [ ] 🟡 **i22-b25** Sunday supper line (S)
- [ ] 🟡 **i22-b26** Weather by day in the recap (S)
- [ ] 🟡 **i22-b27** Commute shows up in the day notes (S)
- [ ] 🟡 **i22-b28** One plain tweak after a hard week (S)
- [ ] 🟡 **i22-b29** Stack the week's sheets with a counter (S)
- [ ] 🟡 **i22-b30** Evening options follow the town calendar (M)

</details>

## Ideas round 23 (pick on the build board)

64 ideas. Details: [docs/ideas/round-23.md](docs/ideas/round-23.md). 🔴 = recommended first.

<details><summary><b>Ideas 23: First-time player</b> (31 ideas)</summary>

- [ ] 🔴 **i23-a01** Offer the practice life on a brand-new start (S)
- [ ] 🔴 **i23-a02** Badge toasts stop replaying after you reopen the app (S)
- [ ] 🔴 **i23-a03** '1 weeks left' reads 'Last week!' (S)
- [ ] 🔴 **i23-a04** End Week shows a planned trip (S)
- [ ] 🔴 **i23-a05** Town goal box says the reward and the time left (S)
- [ ] 🟠 **i23-a06** A missed town goal says so (S)
- [ ] 🟠 **i23-a07** Focus buttons that count for the town goal wear its icon (S)
- [ ] 🟠 **i23-a08** One name for each focus everywhere (S)
- [ ] 🟠 **i23-a09** A Classes week shows school progress (S)
- [ ] 🟠 **i23-a10** Tapping a grayed-out focus says why (S)
- [ ] 🟠 **i23-a11** Switching jobs asks first (S)
- [ ] 🟠 **i23-a12** 'You're hired' shows take-home, like the board (S)
- [ ] 🟠 **i23-a13** The recruiter's sure thing shows on the Jobs tab (S)
- [ ] 🟡 **i23-a14** Work events happen at your workplace (S)
- [ ] 🟠 **i23-a15** Home chips open the right part of Life (S)
- [ ] 🟠 **i23-a16** Out and about suggests one visit right on Home (M)
- [ ] 🟠 **i23-a17** A visit's result shows under the button, without a toast (S)
- [ ] 🟡 **i23-a18** 'Work here' on a place sheet can take you to the job (S)
- [ ] 🟠 **i23-a19** Household rows say how things happen (S)
- [ ] 🟠 **i23-a20** Reopening the app goes back to your life (S)
- [ ] 🟡 **i23-a21** Menu says your life is already saved (S)
- [ ] 🟠 **i23-a22** Hint cards sit under the focus grid (S)
- [ ] 🟠 **i23-a23** Jobs welcome stays until the first application (S)
- [ ] 🟠 **i23-a24** Practice life ends with 'Start a real life' (S)
- [ ] 🟠 **i23-a25** Tutorial bubble moves up when the target is in a sheet (S)
- [ ] 🟡 **i23-a26** Selected trip stops show a check and a running total (S)
- [ ] 🟡 **i23-a27** Score words without '2027 dollars' (S)
- [ ] 🟡 **i23-a28** Your first score says 'First score', not 'New best!' (S)
- [ ] 🟡 **i23-a29** The life you just finished stays on the title screen (M)
- [ ] 🟡 **i23-a30** Journal puts same-week entries under one date (S)
- [ ] 🟡 **i23-a31** Life goals get a nudge in the first month (S)

</details>

<details><summary><b>Ideas 23: Owning a Main Street business</b> (33 ideas)</summary>

- [ ] 🔴 **i23-b01** A storefront on Main Street: a fourth kind of business (L)
- [ ] 🔴 **i23-b02** Pick a kind of shop: bakery, hardware and feed, gift, bike and outdoor (M)
- [ ] 🟠 **i23-b03** The permit run before you open (S)
- [ ] 🔴 **i23-b04** A business loan from the bank (M)
- [ ] 🟠 **i23-b05** Rent the space or buy the old brick building (M)
- [ ] 🟠 **i23-b06** Opening day and the ribbon cutting (S)
- [ ] 🔴 **i23-b07** Hire your first employee (M)
- [ ] 🟠 **i23-b08** Employees are people: raises, sick days and quitting (M)
- [ ] 🟠 **i23-b09** Payroll, the minimum wage and workers' comp (S)
- [ ] 🔴 **i23-b10** Behind the counter: a new weekly focus for owners (M)
- [ ] 🔴 **i23-b11** Stock the shelves: order before the busy weeks (M)
- [ ] 🟡 **i23-b12** The distributor's truck comes on Tuesdays (S)
- [ ] 🟠 **i23-b13** Seasonal customers: riders, hunters and wine weekends (S)
- [ ] 🔴 **i23-b14** Festival weekends: stay open late and staff up (M)
- [ ] 🟠 **i23-b15** The big store in Walla Walla (M)
- [ ] 🟡 **i23-b16** Special orders: 'Can you get one in?' (S)
- [ ] 🟠 **i23-b17** A Tattler ad plan for your shop (S)
- [ ] 🟠 **i23-b18** Word of mouth: the shop's reputation (M)
- [ ] 🟠 **i23-b19** Sales tax and the state excise return (S)
- [ ] 🟡 **i23-b20** Bookkeeping night or hire a bookkeeper (S)
- [ ] 🟠 **i23-b21** Pay yourself: owner's draw or put it back in (M)
- [ ] 🔴 **i23-b22** A shop profit and loss on the business card (S)
- [ ] 🟠 **i23-b23** Closed on Mondays: owner strain and time off (M)
- [ ] 🟡 **i23-b24** Stay open in January or close for winter (S)
- [ ] 🟡 **i23-b25** Join the Main Street merchants' group (S)
- [ ] 🟠 **i23-b26** Shop owners are town fixtures (M)
- [ ] 🟡 **i23-b27** Every team wants a sponsor (S)
- [ ] 🟡 **i23-b28** Regulars at the counter (M)
- [ ] 🟡 **i23-b29** Name your shop and put up the sign (S)
- [ ] 🟠 **i23-b30** Sell the business through a broker (M)
- [ ] 🟡 **i23-b31** Sell to your longtime employee (M)
- [ ] 🟡 **i23-b32** The going-out-of-business sale (S)
- [ ] 🔴 **i23-b33** A storefront bot in the balance sim (S)

</details>

## Ideas round 24 (pick on the build board)

62 ideas. Details: [docs/ideas/round-24.md](docs/ideas/round-24.md). 🔴 = recommended first.

<details><summary><b>Ideas 24: Values and hard choices</b> (32 ideas)</summary>

- [ ] 🔴 **i24-a01** A quiet values profile that grows from your choices (M)
- [ ] 🔴 **i24-a02** Echoes: some choices come back weeks later (M)
- [ ] 🔴 **i24-a03** Values never touch the score: a guard test (S)
- [ ] 🔴 **i24-a04** Make up after a falling-out (M)
- [ ] 🔴 **i24-a05** Cover for a coworker who clocks out early (S)
- [ ] 🟠 **i24-a06** The wallet, take two: keep the cash, mail the license (S)
- [ ] 🟠 **i24-a07** Too much change at Burg Basket (S)
- [ ] 🟠 **i24-a08** Dinged a car in the lot and nobody saw (S)
- [ ] 🟠 **i24-a09** Your friend asks, is my pie any good? (S)
- [ ] 🟠 **i24-a10** A neighbor's dog keeps digging up another neighbor's garden (S)
- [ ] 🟡 **i24-a11** The neighbor kid broke your window and begged you not to tell (S)
- [ ] 🟡 **i24-a12** Judge the pie table when your friend entered (S)
- [ ] 🟠 **i24-a13** A friend wants you as a job reference (S)
- [ ] 🟠 **i24-a14** Speak up at the council meeting (M)
- [ ] 🟡 **i24-a15** You saw the fender-bender, and the driver is a friend's teen (S)
- [ ] 🟡 **i24-a16** The booster club books are $40 short (S)
- [ ] 🟠 **i24-a17** A promise you made comes due (M)
- [ ] 🟡 **i24-a18** Sleep on it: put off one hard choice a week (S)
- [ ] 🟠 **i24-a19** Results in your own voice (S)
- [ ] 🟡 **i24-a20** Folks know you: greetings shaped by your leanings (S)
- [ ] 🟠 **i24-a21** What you stood for, on the end screen (M)
- [ ] 🟠 **i24-a22** Your kid pocketed a candy bar (S)
- [ ] 🟡 **i24-a23** Kids pick up a bit of how you live (M)
- [ ] 🟠 **i24-a24** Hire your cousin or the better applicant (M)
- [ ] 🟠 **i24-a25** The lost dog you grew to love (S)
- [ ] 🟡 **i24-a26** The person who wronged you needs a favor (S)
- [ ] 🟡 **i24-a27** The Tattler prints what you did in public (S)
- [ ] 🟡 **i24-a28** Dilemmas wear a ⚖️ and show both sides' cost (S)
- [ ] 🟠 **i24-a29** Pace dilemmas: at most one every six weeks (S)
- [ ] 🟡 **i24-a30** People change: a leaning can flip (S)
- [ ] 🟠 **i24-a31** Writing rules for hard choices (S)
- [ ] 🟠 **i24-a32** Forgive yourself: make it right at the place (M)

</details>

<details><summary><b>Ideas 24: Memories and looking back</b> (30 ideas)</summary>

- [ ] 🔴 **i24-b01** A memory list that lasts the whole life (M)
- [ ] 🔴 **i24-b02** The life timeline: one screen from 18 to now (L)
- [ ] 🔴 **i24-b03** This week, years ago: memories come back on their date (M)
- [ ] 🟠 **i24-b04** Look through the box: remembering as a Rest choice (S)
- [ ] 🟠 **i24-b05** Memories fade unless you go back to them (M)
- [ ] 🟠 **i24-b06** Hard anniversaries come back too (M)
- [ ] 🔴 **i24-b07** Pick three childhood summers in Waitsburg at the start (M)
- [ ] 🟠 **i24-b08** Flashbacks where it happened (S)
- [ ] 🟠 **i24-b09** Your sixth-grade letter comes back (S)
- [ ] 🟠 **i24-b10** A note to future you in a hard week (S)
- [ ] 🟡 **i24-b11** Leave a December note for next December (S)
- [ ] 🟠 **i24-b12** The memory box: pack it yourself when you move (M)
- [ ] 🟡 **i24-b13** Ticket stubs from trips and nights out (S)
- [ ] 🟠 **i24-b14** The fridge door on Home (S)
- [ ] 🟠 **i24-b15** Tell a story at the café table (M)
- [ ] 🟠 **i24-b16** The town remembers what you did (S)
- [ ] 🟡 **i24-b17** Drive past your old place (S)
- [ ] 🟠 **i24-b18** Clear out your old room at your parents' house (M)
- [ ] 🟡 **i24-b19** Big weather gets a name and a year (S)
- [ ] 🟠 **i24-b20** Doing things lingers; buying things fades (M)
- [ ] 🟠 **i24-b21** Remembered happiness on the end screen (M)
- [ ] 🟠 **i24-b22** The people in your memories (S)
- [ ] 🟠 **i24-b23** A comfort memory in a rough stretch (S)
- [ ] 🟡 **i24-b24** A bench in the park for someone you lost (S)
- [ ] 🟡 **i24-b25** Grandma's recipe card on the holidays (S)
- [ ] 🟡 **i24-b26** The grandkid's 'interview a grandparent' project (S)
- [ ] 🟡 **i24-b27** A place from your childhood closes (S)
- [ ] 🟡 **i24-b28** Dreams that mix up your memories (S)
- [ ] 🟠 **i24-b29** The heir remembers growing up with you (M)
- [ ] 🔴 **i24-b30** A balance check: skipping never makes memories (S)

</details>

## Ideas round 25 (pick on the build board)

62 ideas. Details: [docs/ideas/round-25.md](docs/ideas/round-25.md). 🔴 = recommended first.

<details><summary><b>Ideas 25: More build bundles</b> (30 ideas)</summary>

- [ ] 🔴 **i25-a01** Bundle: Bug-fix sweep: saves, endings and the grandkid (M)
- [ ] 🔴 **i25-a02** Bundle: Bug-fix sweep: jobs and pay (M)
- [ ] 🔴 **i25-a03** Bundle: Bug-fix sweep: money, farm and business (M)
- [ ] 🔴 **i25-a04** Bundle: Bug-fix sweep: score, clock and goals (M)
- [ ] 🔴 **i25-a05** Bundle: Bug-fix sweep: events and the calendar (S)
- [ ] 🔴 **i25-a06** Bundle: Bug-fix sweep: Home screen and toasts (S)
- [ ] 🔴 **i25-a07** Bundle: Bug-fix sweep: lists and long sheets (S)
- [ ] 🔴 **i25-a08** Bundle: One rules sheet for custom games (M)
- [ ] 🟠 **i25-a09** Bundle: Custom knobs: length, money and events (L)
- [ ] 🟠 **i25-a10** Bundle: Assists for a gentler game (S)
- [ ] 🟠 **i25-a11** Bundle: Presets, seeds and sharing rules (M)
- [ ] 🔴 **i25-a12** Bundle: Pick a life aim (L)
- [ ] 🔴 **i25-a13** Bundle: A fairer Life Score (M)
- [ ] 🟠 **i25-a14** Bundle: End-screen verdicts and titles (M)
- [ ] 🔴 **i25-a15** Bundle: A say() helper and text that knows you (M)
- [ ] 🟠 **i25-a16** Bundle: Valley detail and a bigger Tattler (M)
- [ ] 🔴 **i25-a17** Bundle: Home prices, mortgages and equity (M)
- [ ] 🔴 **i25-a18** Bundle: A valley business cycle (M)
- [ ] 🔴 **i25-a19** Bundle: Prices and pay over the decades (M)
- [ ] 🟠 **i25-a20** Bundle: Will retirement cover the bills? (M)
- [ ] 🟠 **i25-a21** Bundle: Economy and long-game sim tests (M)
- [ ] 🔴 **i25-a22** Bundle: Day notes and Tonight (M)
- [ ] 🟠 **i25-a23** Bundle: A week recap that tells a story (M)
- [ ] 🟠 **i25-a24** Bundle: Faster quiet weeks (M)
- [ ] 🔴 **i25-a25** Bundle: Open a shop on Main Street (L)
- [ ] 🔴 **i25-a26** Bundle: Running the shop week to week (M)
- [ ] 🟠 **i25-a27** Bundle: Shop customers, rivals and selling out (M)
- [ ] 🔴 **i25-a28** Bundle: A quiet values profile (M)
- [ ] 🟠 **i25-a29** Bundle: Small dilemmas, well paced (M)
- [ ] 🔴 **i25-a30** Bundle: Memories that last a lifetime (M)

</details>

<details><summary><b>Ideas 25: Cozy and calm</b> (32 ideas)</summary>

- [ ] 🔴 **i25-b01** Cozy mode: normal pace, softer landings (L)
- [ ] 🔴 **i25-b02** Cozy: big bills split into four weekly pieces (S)
- [ ] 🟠 **i25-b03** Cozy: a neighbor shows up in bad moments (S)
- [ ] 🟠 **i25-b04** Cozy: never two rough weeks in a row (S)
- [ ] 🟠 **i25-b05** Cozy: a month's notice before a layoff (S)
- [ ] 🟠 **i25-b06** Cozy: health scares stay scares (S)
- [ ] 🟠 **i25-b07** Cozy score: contentment counts more than net worth (M)
- [ ] 🟡 **i25-b08** Cozy wording for setbacks (S)
- [ ] 🔴 **i25-b09** A quiet week, said kindly (M)
- [ ] 🟠 **i25-b10** Three small good things (S)
- [ ] 🔴 **i25-b11** Sit on the porch: see who walks by (M)
- [ ] 🟠 **i25-b12** The creek at dusk (M)
- [ ] 🟠 **i25-b13** Snow falling on Main Street (M)
- [ ] 🟠 **i25-b14** Calm moments through the year (L)
- [ ] 🟡 **i25-b15** A quiet moments album (M)
- [ ] 🔴 **i25-b16** A Gentle pace setting (M)
- [ ] 🟠 **i25-b17** A small-gift shelf (M)
- [ ] 🟠 **i25-b18** The casserole dish that goes back and forth (S)
- [ ] 🟠 **i25-b19** Too much zucchini (S)
- [ ] 🟠 **i25-b20** A comfort routine you pick (M)
- [ ] 🟡 **i25-b21** A bird feeder by the kitchen window (S)
- [ ] 🟡 **i25-b22** A stray cat that chooses you (M)
- [ ] 🟠 **i25-b23** Rain on the roof (S)
- [ ] 🟠 **i25-b24** Soup weather: the first cold week (S)
- [ ] 🟡 **i25-b25** Calm weeks on the end screen (S)
- [ ] 🟠 **i25-b26** Swap books with a neighbor (S)
- [ ] 🟡 **i25-b27** Calm sounds while you plan (M)
- [ ] 🟡 **i25-b28** Hunker down: a winter focus (S)
- [ ] 🟠 **i25-b29** Holiday baking for the street (S)
- [ ] 🟡 **i25-b30** Write a thank-you note (S)
- [ ] 🔴 **i25-b31** Cozy explained next to Relaxed on the start sheet (S)
- [ ] 🔴 **i25-b32** The balance sim plays Cozy too (S)

</details>

## Ideas round 26 (pick on the build board)

61 ideas. Details: [docs/ideas/round-26.md](docs/ideas/round-26.md). 🔴 = recommended first.

<details><summary><b>Ideas 26: The valley's people and cultures</b> (32 ideas)</summary>

- [ ] 🔴 **i26-a01** Tamástslikt Cultural Institute: a day trip to learn (S)
- [ ] 🔴 **i26-a02** The mercado in Walla Walla (S)
- [ ] 🔴 **i26-a03** Día de los Muertos: a community altar exhibit (S)
- [ ] 🔴 **i26-a04** A quinceañera invitation (S)
- [ ] 🟠 **i26-a05** Fiestas patrias in September (S)
- [ ] 🟠 **i26-a06** A Sunday soccer league (M)
- [ ] 🔴 **i26-a07** Ana, the orchard crew lead: a story over a year (M)
- [ ] 🟠 **i26-a08** Heat rules on the crew (S)
- [ ] 🟠 **i26-a09** Tutor for the citizenship test (M)
- [ ] 🟡 **i26-a10** A coworker's citizenship ceremony (S)
- [ ] 🟠 **i26-a11** A tamalada in December (S)
- [ ] 🟡 **i26-a12** Folklórico at the school spring show (S)
- [ ] 🟡 **i26-a13** Spanish radio on the drive (S)
- [ ] 🟠 **i26-a14** Hello in two languages around town (S)
- [ ] 🟡 **i26-a15** Where the Walla Walla sweet onion came from (S)
- [ ] 🟡 **i26-a16** Walla Walla's Chinese gardeners and laundries (S)
- [ ] 🟡 **i26-a17** The Volga German families of 'Russian Town' (S)
- [ ] 🟠 **i26-a18** Whitman Mission: a history that has two sides (S)
- [ ] 🟡 **i26-a19** The pioneer village and the 33-mule combine (S)
- [ ] 🔴 **i26-a20** Whose homeland this is: a page in Help (S)
- [ ] 🟠 **i26-a21** Salmon come back to the Touchet (S)
- [ ] 🟠 **i26-a22** Restoration crew tech: a job with the tribes' fisheries (M)
- [ ] 🟠 **i26-a23** Mission and Pendleton on the region map (L)
- [ ] 🟡 **i26-a24** A public powwow, as a guest (S)
- [ ] 🟡 **i26-a25** Old-time threshing day (S)
- [ ] 🟡 **i26-a26** A valley community cookbook (M)
- [ ] 🟡 **i26-a27** A summer Pride picnic in Walla Walla (S)
- [ ] 🔴 **i26-a28** A valley culture calendar in one data table (S)
- [ ] 🔴 **i26-a29** Community readers for culture scenes (S)
- [ ] 🟠 **i26-a30** 'Learned something' badges for visiting (S)
- [ ] 🟡 **i26-a31** Saturday Spanish story time at the library (S)
- [ ] 🟡 **i26-a32** Teach a coworker to drive the forklift, learn some Spanish back (S)

</details>

<details><summary><b>Ideas 26: Playtest of the newest content</b> (29 ideas)</summary>

- [ ] 🔴 **i26-b01** Out-and-about players in the balance sim (S)
- [ ] 🔴 **i26-b02** Free and $12 visits stop carrying an idle life (S)
- [ ] 🔴 **i26-b03** Bug: the $300 will is never read (S)
- [ ] 🔴 **i26-b04** What's new for the Out and about update (S)
- [ ] 🔴 **i26-b05** Things to do under 21 at the tasting room and wine bar (M)
- [ ] 🔴 **i26-b06** Traffic school only once in a while (S)
- [ ] 🟠 **i26-b07** Pricey visits do something cheap ones can't (M)
- [ ] 🟠 **i26-b08** The Little Kiss takes reservations (M)
- [ ] 🟠 **i26-b09** Business events once a season each (S)
- [ ] 🟠 **i26-b10** Commute filler events once a year (S)
- [ ] 🟠 **i26-b11** Lift operators drive the Bluewood road (M)
- [ ] 🟡 **i26-b12** The Bluewood pass on sale at the Dayton stop (S)
- [ ] 🟠 **i26-b13** A second choice for one-button road and work events (M)
- [ ] 🟠 **i26-b14** Every good deed costs a little (M)
- [ ] 🟡 **i26-b15** The audiobook choice: two buttons, one result (S)
- [ ] 🟡 **i26-b16** Snapping at a customer goes in your file (S)
- [ ] 🟠 **i26-b17** Better coverage covers the clinic (S)
- [ ] 🟠 **i26-b18** Staff perks where you work in town (M)
- [ ] 🟡 **i26-b19** Work events show on your workplace pin (S)
- [ ] 🟡 **i26-b20** Smaller tap areas on the Main Street close-up (S)
- [ ] 🟡 **i26-b21** Places you can't use yet say so in the list (S)
- [ ] 🟡 **i26-b22** Celebration Days is one week, not all of May (S)
- [ ] 🟡 **i26-b23** Heir names: "Mary I" and generation 40 (S)
- [ ] 🟡 **i26-b24** The grandkid's first Journal line is a milestone (S)
- [ ] 🟡 **i26-b25** Legacy lives kept apart in records (M)
- [ ] 🟠 **i26-b26** Event coverage report in the sim (M)
- [ ] 🟠 **i26-b27** Weekday-only places cost a commuter half a day (M)
- [ ] 🟡 **i26-b28** Shop local instead of the big-store run (S)
- [ ] 🟡 **i26-b29** Your regular spot on the end screen (S)

</details>

## Ideas round 27 (pick on the build board)

64 ideas. Details: [docs/ideas/round-27.md](docs/ideas/round-27.md). 🔴 = recommended first.

<details><summary><b>Ideas 27: The owner's tools</b> (32 ideas)</summary>

- [ ] 🔴 **i27-a01** This week's odds, and why an event won't fire (S)
- [ ] 🔴 **i27-a02** Try an event without keeping the result (M)
- [ ] 🔴 **i27-a03** Dev-touched lives never set best scores (S)
- [ ] 🔴 **i27-a04** What changed this week: a save diff (S)
- [ ] 🔴 **i27-a05** Bug codes that replay to the exact week (L)
- [ ] 🔴 **i27-a06** Balance dashboard from sim runs (L)
- [ ] 🔴 **i27-a07** Balance diff on every pull request (M)
- [ ] 🔴 **i27-a08** A cost() check for hand-typed dollars (S)
- [ ] 🔴 **i27-a09** Button price matches what it charges (S)
- [ ] 🟠 **i27-a10** Every event has a real map pin (S)
- [ ] 🟠 **i27-a11** Sheets that fit on a small phone (M)
- [ ] 🟠 **i27-a12** Every choice writes a journal line (S)
- [ ] 🟠 **i27-a13** Choice outcome table (M)
- [ ] 🟡 **i27-a14** Big swings need a tag (S)
- [ ] 🟡 **i27-a15** Season words match the months (S)
- [ ] 🟠 **i27-a16** Event catalog page (M)
- [ ] 🟡 **i27-a17** Content counts by season and place (S)
- [ ] 🟠 **i27-a18** Score breakdown per bot (S)
- [ ] 🟠 **i27-a19** Jobs report from the sim (M)
- [ ] 🟡 **i27-a20** Event money and score impact (M)
- [ ] 🟡 **i27-a21** Weekly stat lines for one bot life (M)
- [ ] 🟠 **i27-a22** Ceiling headroom in the sim summary (S)
- [ ] 🟠 **i27-a23** Try a tuning change in the sim from the command line (M)
- [ ] 🟡 **i27-a24** All the balance numbers in one file (M)
- [ ] 🟡 **i27-a25** A fast sim that runs without a browser (L)
- [ ] 🟠 **i27-a26** Save doctor: paste a save and check it (S)
- [ ] 🟠 **i27-a27** Pin a moment and come back to it (S)
- [ ] 🟡 **i27-a28** Walk a story chain step by step (M)
- [ ] 🟠 **i27-a29** Mistakes show on screen in dev mode (S)
- [ ] 🟡 **i27-a30** Prices across the decades (S)
- [ ] 🟡 **i27-a31** New-event starter (S)
- [ ] 🟡 **i27-a32** Help and data agree (S)

</details>

<details><summary><b>Ideas 27: The long-term vision</b> (32 ideas)</summary>

- [ ] 🔴 **i27-b01** Name the next three versions: 2.0 People, 2.5 Seasons, 3.0 Towns (S)
- [ ] 🔴 **i27-b02** A 'not building' list in the README (S)
- [ ] 🔴 **i27-b03** Move Waitsburg's data into one town file (M)
- [ ] 🔴 **i27-b04** Every save knows its home town (S)
- [ ] 🟠 **i27-b05** Find every hard-coded 'Waitsburg' in game text (S)
- [ ] 🟡 **i27-b06** Engine and content in separate folders (L)
- [ ] 🔴 **i27-b07** A new-town checklist (S)
- [ ] 🟠 **i27-b08** A town champion for each edition (S)
- [ ] 🟠 **i27-b09** Dayton edition pilot: a home town 11 miles up the road (L)
- [ ] 🟡 **i27-b10** 'Pick your town' card that stays hidden until it's real (S)
- [ ] 🟡 **i27-b11** Walla Walla edition as the 3.0 big-town test (L)
- [ ] 🟠 **i27-b12** The sim plays every edition before it ships (S)
- [ ] 🟡 **i27-b13** Your heir can grow up in the next town over (M)
- [ ] 🔴 **i27-b14** 2.5 'Seasons' starts with a real-year calendar file (M)
- [ ] 🟠 **i27-b15** Update the calendar every January as a release step (S)
- [ ] 🔴 **i27-b16** The first seasonal drop: Celebration Days, May 2027 (M)
- [ ] 🟠 **i27-b17** Drops stay in the game as reruns (S)
- [ ] 🔴 **i27-b18** The town layer: one switch, off by default (S)
- [ ] 🟠 **i27-b19** A tiny town file the game can read, never needs (M)
- [ ] 🟡 **i27-b20** Town averages from the bots, shipped with each release (S)
- [ ] 🟠 **i27-b21** A community-written chapter: 'The Year the Elevator Closed' (L)
- [ ] 🟠 **i27-b22** A writing night at the library (S)
- [ ] 🟡 **i27-b23** A paper form for the NPC plan (S)
- [ ] 🟡 **i27-b24** Credits inside the moment, not just on a page (S)
- [ ] 🟡 **i27-b25** A school partnership: one student event pack each spring (M)
- [ ] 🟠 **i27-b26** A historical-society fact check before history ships (S)
- [ ] 🟡 **i27-b27** A 'make your own town' guide for other small towns (M)
- [ ] 🟠 **i27-b28** Decide the license: open engine, Waitsburg content kept (S)
- [ ] 🟠 **i27-b29** One big thing per version (S)
- [ ] 🟠 **i27-b30** A size and speed budget the tests enforce (S)
- [ ] 🟡 **i27-b31** A yearly cut list: retire what nobody uses (S)
- [ ] 🟡 **i27-b32** A 'State of the Burg' note on the game's birthday (S)

</details>

## Ideas round 28 (pick on the build board)

62 ideas. Details: [docs/ideas/round-28.md](docs/ideas/round-28.md). 🔴 = recommended first.

<details><summary><b>Ideas 28: Sports and recreation</b> (30 ideas)</summary>

- [ ] 🔴 **i28-a01** One Activities card for leagues and seasons (L)
- [ ] 🔴 **i28-a02** Friday night home games at the school field (M)
- [ ] 🔴 **i28-a03** Your kid plays Little League: fees, games and snack duty (M)
- [ ] 🟠 **i28-a04** Saturday youth soccer: the drive to Walla Walla fields (M)
- [ ] 🟠 **i28-a05** Kids' activities as a line on the monthly bills (S)
- [ ] 🟠 **i28-a06** Pickleball at the park courts (M)
- [ ] 🟠 **i28-a07** Nine holes on the Walla Walla city course (M)
- [ ] 🟡 **i28-a08** Invited to the boss's charity scramble (S)
- [ ] 🟠 **i28-a09** Kids' fishing derby at the stocked pond (S)
- [ ] 🟡 **i28-a10** Opening day of trout season at the lakes (S)
- [ ] 🟠 **i28-a11** Train for the Days fun run (M)
- [ ] 🟡 **i28-a12** A gravel ride through the wheat hills (M)
- [ ] 🟡 **i28-a13** Host a rest stop for a charity bike tour (S)
- [ ] 🔴 **i28-a14** Sunday football at your place (M)
- [ ] 🟡 **i28-a15** A friend has two tickets to a Seattle ballgame (S)
- [ ] 🟡 **i28-a16** The ballgame on the radio on the drive home (S)
- [ ] 🟠 **i28-a17** Lifeguard at the town pool: a summer gig (S)
- [ ] 🟠 **i28-a18** Swim lessons for the kids (S)
- [ ] 🟠 **i28-a19** Play hurt or sit out: rec-league sprains (M)
- [ ] 🟠 **i28-a20** Ump Little League for spring weekend cash (S)
- [ ] 🟠 **i28-a21** Tryouts: your teen makes the team, or doesn't (S)
- [ ] 🟠 **i28-a22** Senior night: your kid's last home game (S)
- [ ] 🟡 **i28-a23** The alumni game: suit up one more time (S)
- [ ] 🟡 **i28-a24** The Days softball tournament (S)
- [ ] 🟡 **i28-a25** A basketball hoop over the garage (S)
- [ ] 🟡 **i28-a26** Sledding the hill by the school (S)
- [ ] 🟡 **i28-a27** A disc golf round in Walla Walla (S)
- [ ] 🟡 **i28-a28** Badges for a full season (S)
- [ ] 🟠 **i28-a29** Talk sports at the coffee counter (S)
- [ ] 🔴 **i28-a30** A sporty bot in the balance sim (S)

</details>

<details><summary><b>Ideas 28: Digital life in a small town</b> (32 ideas)</summary>

- [ ] 🔴 **i28-b01** Home internet: phone hotspot, tower wireless or satellite (M)
- [ ] 🟠 **i28-b02** No bars at the farmhouse: the missed callback (S)
- [ ] 🟠 **i28-b03** Study in the library parking lot (S)
- [ ] 🔴 **i28-b04** Online classes or the drive to Walla Walla (M)
- [ ] 🔴 **i28-b05** The town page: a weekly scroll of posts (L)
- [ ] 🟠 **i28-b06** Wade into a comment fight on the town page (S)
- [ ] 🟡 **i28-b07** Share the lost dog post (S)
- [ ] 🟠 **i28-b08** Order it online or buy it on Main Street (S)
- [ ] 🟡 **i28-b09** Packages wait at the post office (S)
- [ ] 🔴 **i28-b10** Rest week: phone in a drawer or scrolling (M)
- [ ] 🟡 **i28-b11** Phone-free month challenge (S)
- [ ] 🔴 **i28-b12** Streaming subscriptions creep up (M)
- [ ] 🟡 **i28-b13** Movie night at home instead of the drive (S)
- [ ] 🟡 **i28-b14** The rivalry game cuts out in the snow (S)
- [ ] 🔴 **i28-b15** Your kid's first phone (M)
- [ ] 🟠 **i28-b16** The middle-school group chat drama (S)
- [ ] 🟡 **i28-b17** Remote day bloopers (S)
- [ ] 🟠 **i28-b18** The windstorm takes the internet too (S)
- [ ] 🟡 **i28-b19** Prescriptions by mail (S)
- [ ] 🟠 **i28-b20** A buyer overpays for your old truck (S)
- [ ] 🟠 **i28-b21** Too-cheap firewood on the town page (S)
- [ ] 🟠 **i28-b22** Neighbors post about your side hustle (M)
- [ ] 🟡 **i28-b23** Sell the garage clutter on the swap page (S)
- [ ] 🟡 **i28-b24** The Tattler moves mostly online (S)
- [ ] 🟠 **i28-b25** Snow week: school sends kids home with laptops (S)
- [ ] 🟡 **i28-b26** Late-night online games with old friends (S)
- [ ] 🟡 **i28-b27** Post a Touchet sunset photo (S)
- [ ] 🟡 **i28-b28** Screen time vs time outside on the end screen (S)
- [ ] 🔴 **i28-b29** Sign up for county alert texts (S)
- [ ] 🟠 **i28-b30** The cell tower vote (M)
- [ ] 🔴 **i28-b31** Be the town's tech helper (M)
- [ ] 🟡 **i28-b32** Help a parent with their tablet (S)

</details>

## Ideas round 29 (pick on the build board)

65 ideas. Details: [docs/ideas/round-29.md](docs/ideas/round-29.md). 🔴 = recommended first.

<details><summary><b>Ideas 29: Safety nets and helping each other</b> (31 ideas)</summary>

- [ ] 🔴 **i29-a01** A back-on-your-feet plan after a layoff (M)
- [ ] 🔴 **i29-a02** Join the credit union before you need it (M)
- [ ] 🔴 **i29-a03** A neighbor loses their job: help without making it awkward (M)
- [ ] 🔴 **i29-a04** Sign up for a neighbor's meal train (S)
- [ ] 🟠 **i29-a05** Run the Saturday sort at the food bank (M)
- [ ] 🟠 **i29-a06** Glean the field edges after harvest (S)
- [ ] 🟡 **i29-a07** Donate a deer to the food bank (S)
- [ ] 🟠 **i29-a08** Split wood for the firewood bank (S)
- [ ] 🟡 **i29-a09** Weatherize a neighbor's windows with the Grange crew (S)
- [ ] 🟠 **i29-a10** Even out the winter heat bill with budget billing (M)
- [ ] 🟡 **i29-a11** Benefit dollars go twice as far at the farmers market (S)
- [ ] 🟡 **i29-a12** Don't miss the coverage renewal letter (S)
- [ ] 🟡 **i29-a13** Pay off the school's lunch balances (S)
- [ ] 🟠 **i29-a14** Build a little free pantry by the sidewalk (M)
- [ ] 🟠 **i29-a15** Borrow from the Grange tool library (M)
- [ ] 🟠 **i29-a16** Sit on the Grange's help committee (L)
- [ ] 🟡 **i29-a17** The giving tree at the grocery store (S)
- [ ] 🟡 **i29-a18** A coat closet before the first frost (S)
- [ ] 🟠 **i29-a19** Rent-to-own couch or the church rummage sale (S)
- [ ] 🟠 **i29-a20** Help a friend out of a payday loan (M)
- [ ] 🟡 **i29-a21** A free budget sit-down at the credit union (S)
- [ ] 🟠 **i29-a22** Neighbors pass along job leads when you're out of work (S)
- [ ] 🟡 **i29-a23** Hide it or tell them: the layoff talk at home (S)
- [ ] 🟡 **i29-a24** A gas card for the job hunt (S)
- [ ] 🟡 **i29-a25** Ask the coach about the sports fee (S)
- [ ] 🟠 **i29-a26** Drive the senior meal route on Tuesdays (M)
- [ ] 🟡 **i29-a27** Bring food after a funeral (S)
- [ ] 🟠 **i29-a28** A 'carried and carried others' line on your life story (S)
- [ ] 🟠 **i29-a29** A 'When money's tight' page in Help (S)
- [ ] 🟡 **i29-a30** Your first full paycheck after a hard stretch (S)
- [ ] 🟡 **i29-a31** Share a Thanksgiving table (S)

</details>

<details><summary><b>Ideas 29: Arts, music and making things</b> (34 ideas)</summary>

- [ ] 🔴 **i29-b01** Buy a used instrument at the Junque Sisters (S)
- [ ] 🔴 **i29-b02** Practice nights: a Music track on the Skills card (M)
- [ ] 🟡 **i29-b03** Tunes you know: a short list that grows (S)
- [ ] 🔴 **i29-b04** From the back row to calling tunes: the jam ladder (M)
- [ ] 🟠 **i29-b05** Your first solo: push through or sit it out (S)
- [ ] 🟠 **i29-b06** The slow jam for beginners (S)
- [ ] 🟠 **i29-b07** Three regulars start a band (L)
- [ ] 🟡 **i29-b08** Name the band (and the town has opinions) (S)
- [ ] 🟡 **i29-b09** Busk on Main during Celebration Days (S)
- [ ] 🔴 **i29-b10** Community theater: auditions in January, the show in March (L)
- [ ] 🟠 **i29-b11** Opening night: you go up on your lines (S)
- [ ] 🟠 **i29-b12** Build the set: theater crew uses your Handy skill (S)
- [ ] 🔴 **i29-b13** The Tuesday quilting circle (M)
- [ ] 🟠 **i29-b14** Finish a quilt: who gets it? (S)
- [ ] 🟡 **i29-b15** Pick a quilt pattern and colors (S)
- [ ] 🟠 **i29-b16** Paint the valley on Outside weeks (M)
- [ ] 🟡 **i29-b17** Every painting gets a line of its own (S)
- [ ] 🟠 **i29-b18** A month on the coffee shop wall (M)
- [ ] 🔴 **i29-b19** Woodworking projects with a finish line (M)
- [ ] 🟠 **i29-b20** Give it away: a gift that lands (S)
- [ ] 🟠 **i29-b21** A bench for the park, with a small plaque (M)
- [ ] 🟡 **i29-b22** The unfinished-projects pile (S)
- [ ] 🟡 **i29-b23** Fix a cracked fiddle for a kid (S)
- [ ] 🟠 **i29-b24** Your own column in the Tattler (M)
- [ ] 🟡 **i29-b25** A book of valley stories, a hundred copies (L)
- [ ] 🟠 **i29-b26** Photograph the valley, described in words (M)
- [ ] 🟠 **i29-b27** The town calendar contest (S)
- [ ] 🔴 **i29-b28** A booth at the December craft bazaar (M)
- [ ] 🟠 **i29-b29** Teach a beginner class at the woodshop (M)
- [ ] 🟠 **i29-b30** Your kid takes piano lessons (M)
- [ ] 🟡 **i29-b31** Your skills meet at the spring show (S)
- [ ] 🟠 **i29-b32** Making it through a hard week (S)
- [ ] 🟠 **i29-b33** Things you made, and where they are now (M)
- [ ] 🔴 **i29-b34** Creative payoffs only from finished work: a sim check (S)

</details>

## Ideas round 30 (pick on the build board)

59 ideas. Details: [docs/ideas/round-30.md](docs/ideas/round-30.md). 🔴 = recommended first.

<details><summary><b>Ideas 30: Bundles and release plans</b> (33 ideas)</summary>

- [ ] 🔴 **i30-a01** Bundle: Bug-fix sweep: the Out and about playtest (M)
- [ ] 🔴 **i30-a02** Bundle: Cozy mode (L)
- [ ] 🟠 **i30-a03** Bundle: Kind words and small kindnesses (M)
- [ ] 🟠 **i30-a04** Bundle: Calm moments through the year (M)
- [ ] 🔴 **i30-a05** Bundle: A valley culture calendar (M)
- [ ] 🔴 **i30-a06** Bundle: Day trips to learn the valley's history (M)
- [ ] 🟠 **i30-a07** Bundle: Ana, the crew and two languages (M)
- [ ] 🟠 **i30-a08** Bundle: Visits that pull their weight (M)
- [ ] 🟠 **i30-a09** Bundle: Working in town (M)
- [ ] 🔴 **i30-a10** Bundle: Dev panel: odds, previews and diffs (M)
- [ ] 🔴 **i30-a11** Bundle: Content lints (M)
- [ ] 🔴 **i30-a12** Bundle: Balance dashboard and sim bots (L)
- [ ] 🟠 **i30-a13** Bundle: Tuning in one file and a faster sim (L)
- [ ] 🔴 **i30-a14** Bundle: Roadmap and the Seasons calendar (M)
- [ ] 🟠 **i30-a15** Bundle: One town file (L)
- [ ] 🟠 **i30-a16** Bundle: Written with the community (M)
- [ ] 🔴 **i30-a17** Bundle: One Activities card for leagues (L)
- [ ] 🔴 **i30-a18** Bundle: Kids in sports (M)
- [ ] 🟠 **i30-a19** Bundle: Game days and the outdoors (M)
- [ ] 🔴 **i30-a20** Bundle: Home internet and online classes (M)
- [ ] 🔴 **i30-a21** Bundle: The town page (L)
- [ ] 🔴 **i30-a22** Bundle: Screens at home (M)
- [ ] 🟡 **i30-a23** Bundle: Shopping, mail and the monthly bills (M)
- [ ] 🔴 **i30-a24** Bundle: Back on your feet after a layoff (M)
- [ ] 🔴 **i30-a25** Bundle: Helping a neighbor through it (M)
- [ ] 🟠 **i30-a26** Bundle: Food bank, Grange and giving back (L)
- [ ] 🔴 **i30-a27** Bundle: Music: from a used fiddle to a band (M)
- [ ] 🔴 **i30-a28** Bundle: Quilting and woodworking (M)
- [ ] 🟠 **i30-a29** Bundle: Paint, photograph and write (M)
- [ ] 🟠 **i30-a30** Bundle: On stage and at the bazaar (L)
- [ ] 🔴 **i30-a31** Release plan: v0.3 — Solid ground (L)
- [ ] 🔴 **i30-a32** Release plan: v0.4 — People (L)
- [ ] 🔴 **i30-a33** Release plan: v0.5 — Seasons (L)

</details>

<details><summary><b>Ideas 30: Lifetime playtest</b> (26 ideas)</summary>

- [ ] 🔴 **i30-b01** Bug: the grandkid's pickup is worth an eighth of a starter truck (S)
- [ ] 🔴 **i30-b02** Bug: a ride's value never drops below 2027's $500 (S)
- [ ] 🔴 **i30-b03** You're healthiest at 80: health's ceiling comes down with age (M)
- [ ] 🔴 **i30-b04** Home comforts hold happiness in the 80s, not at 100 (M)
- [ ] 🔴 **i30-b05** Retirement years can't drag the net-worth part down (S)
- [ ] 🔴 **i30-b06** Downsize with the sale money: buy the smaller place outright (M)
- [ ] 🟠 **i30-b07** Raises take 20 years to reach the cap, not 9 (S)
- [ ] 🟠 **i30-b08** People skill slows the fade only up to 75 (S)
- [ ] 🟠 **i30-b09** Retirees keep the same pace of events (S)
- [ ] 🟠 **i30-b10** Family money arrives as a trust, not a lump (M)
- [ ] 🟠 **i30-b11** The grandkid can take the family home instead of cash (M)
- [ ] 🟠 **i30-b12** Money past the hand-down cap goes to the town (S)
- [ ] 🟠 **i30-b13** Half your raise follows you to a job in the same field (S)
- [ ] 🟠 **i30-b14** Badges and goals for the second half of life (M)
- [ ] 🟠 **i30-b15** Turning down a council run twice puts it away for five years (S)
- [ ] 🟡 **i30-b16** A council seat needs ten years in town (S)
- [ ] 🟡 **i30-b17** Side hustles ease off after 70 (S)
- [ ] 🟡 **i30-b18** Rides show their model year and wear with age (M)
- [ ] 🟡 **i30-b19** Snowbird winters for retirees (M)
- [ ] 🟡 **i30-b20** Classes after retirement are cheap and just for fun (S)
- [ ] 🟡 **i30-b21** Quiet years count the small things in the year in review (S)
- [ ] 🟡 **i30-b22** A finished town goal stops a long skip only the first time (S)
- [ ] 🟡 **i30-b23** Report cards go yearly after 65, and skip "+0" (S)
- [ ] 🟡 **i30-b24** At the top of the pay scale, the Jobs tab says so (S)
- [ ] 🟡 **i30-b25** A Lifetime decade table in the sim report (S)
- [ ] 🟠 **i30-b26** Life stages: one table drives drift, caps and event pools (L)

</details>

## Later: P3

- [ ] **More local content:** town-specific events, seasonal jobs (mostly covered by Out and about) — [#11](https://github.com/krazow/The-Burg/issues/11)

## Version 2.0: Be in The Burg (player-submitted NPCs)

Players fill in a questionnaire in the game about themselves as a Waitsburg character (where they hang out, their
personality, how they react to the player, their own small event). Answers go to Formspree
(`https://formspree.io/f/xyewwazg`), you review them, and approved characters ship in the next release. Full plan,
risks and the 10-page questionnaire: [docs/npc-submissions.md](docs/npc-submissions.md). The issues are grouped in the
[v2.0 milestone](https://github.com/krazow/The-Burg/milestone/1). Version 2.0 is released when all six are done. In order:

| # | Item | Size | Issue |
|---|---|---|---|
| 1 | **Policy and Formspree setup** (your decisions): 18+, no romance with player NPCs, first names only, human review, removal on request; privacy note; honeypot, spam filter, monthly export (free plan: 50/month, 30-day history) | S | [#39](https://github.com/krazow/The-Burg/issues/39) |
| 2 | **In-game questionnaire** (🙋 Be in the game): 10 pages, draft saved, preview card, send with offline queue | L | [#40](https://github.com/krazow/The-Burg/issues/40) |
| 3 | **Import and review tool:** Formspree export → `data/npcs.json`, flags identifying or unsafe text, removal list | M | [#41](https://github.com/krazow/The-Burg/issues/41) |
| 4 | **NPC engine:** friendship saved per life, map pins at hangouts, meetings, 👥 People screen | L | [#42](https://github.com/krazow/The-Burg/issues/42) |
| 5 | **NPC behavior:** offers, asks, reactions, personal events, NPCs in today's anonymous events; capped effects | L | [#43](https://github.com/krazow/The-Burg/issues/43) |
| 6 | **NPC QA:** rules, flows with a mocked Formspree, screens, simulation balance with NPCs | M | [#44](https://github.com/krazow/The-Burg/issues/44) |

- [ ] Policy and Formspree setup — [#39](https://github.com/krazow/The-Burg/issues/39)
- [ ] In-game questionnaire — [#40](https://github.com/krazow/The-Burg/issues/40)
- [ ] Import and review tool — [#41](https://github.com/krazow/The-Burg/issues/41)
- [ ] NPC engine — [#42](https://github.com/krazow/The-Burg/issues/42)
- [ ] NPC behavior and events — [#43](https://github.com/krazow/The-Burg/issues/43)
- [ ] NPC QA — [#44](https://github.com/krazow/The-Burg/issues/44)

---

## QA plan

`npm test` runs seven suites (about 2 minutes); CI runs them on every pull request and release: smoke (5), game rules (26), gameplay (30), flows (18, including every event choice), screens and accessibility (14: 7 rules over 7 sizes × 11 screens plus 7 keyboard and screen-reader checks), offline and updates (6), and the bot simulation. See the README's Testing section.

Three layers, from cheapest to most human:

1. **Smoke and gameplay tests** ([#3](https://github.com/krazow/The-Burg/issues/3)): Playwright in a real browser, run
   by `npm test` and by CI on every pull request and release. They check that the app opens cleanly, installs
   offline, and that the core loop works: start a game, apply for a job, end a week, answer an event, save and
   continue, use both maps, and reach the ending screen.
2. **Play-test simulation** ([#4](https://github.com/krazow/The-Burg/issues/4)): bot players with different
   strategies play full 6-month, 2-year, 5-year and Lifetime games. The suite fails on errors or impossible values,
   and prints a balance report (score spread, net worth, debt endings, event frequency) used to tune difficulty
   ([#6](https://github.com/krazow/The-Burg/issues/6), [#7](https://github.com/krazow/The-Burg/issues/7)).
3. **People** ([#5](https://github.com/krazow/The-Burg/issues/5), [#9](https://github.com/krazow/The-Burg/issues/9)):
   a phone checklist before each production release, plus beta testers at `/beta/`.

**Status:** suites 1 and 2 are live. CI runs them on every pull request and on `main` (smoke 5 checks, gameplay 11
checks, simulation 78 games across 6 bot strategies). They passed on all three merged PRs and on `main` after the merges.
The first balance report led to the fixes in [PR #17](https://github.com/krazow/The-Burg/pull/17); the simulation now also checks
that careless play stays at or below 60 and good play at or above 70.

---

## Done

| Date | What | Where |
|---|---|---|
| Nov 18, 2026 | **Build board picks, all 104 built:** the review gotchas, balance and testing fixes, title screen with More options, Your records, What's new, Journal filters, event pacing by category, 30 road and 30 work events, and **Out and about** (20 Waitsburg businesses under stand-in names, Main Street map, visits, 7 local jobs, business events). | PRs [#97](https://github.com/krazow/The-Burg/pull/97), [#98](https://github.com/krazow/The-Burg/pull/98), [#99](https://github.com/krazow/The-Burg/pull/99), [#100](https://github.com/krazow/The-Burg/pull/100), [#101](https://github.com/krazow/The-Burg/pull/101) |
| Nov 16, 2026 | Built **The Burg**: a turn-based life sim set in Waitsburg with 25 jobs across Waitsburg, Dayton, Walla Walla, Kennewick, Richland and Pasco; housing, vehicles, schooling, about 27 seasonal local events, Life Score, auto-save, installable with offline play. | `main` |
| Nov 16, 2026 | Balance fixes from simulated games: raises capped at +50%, 6 months of unemployment benefits after a layoff, debt warnings. | `main` |
| Nov 16, 2026 | **Weekly turns** and four game lengths (6 months, 2 years, 5 years, Lifetime), with ⏩ 4-week and 13-week skips that stop when something happens; weekly pay and bills. | `main` |
| Nov 16, 2026 | Repo set up, README written, offline cache and version stamp made release-kit compatible. | `main` |
| Nov 16, 2026 | **Map navigation** like Island Time: List/Map toggle, Waitsburg town map that sets your week's focus, region map with real town positions, rivers, US-12, town job cards and a commute truck. | [PR #1](https://github.com/krazow/The-Burg/pull/1) (merged) |
| Nov 16, 2026 | Set up this to-do list and its GitHub issues (#2–#14) with priority labels. | `TODO.md` |
| Nov 16, 2026 | **Release kit adopted** (release.json, VERSION, CHANGELOG, release + CI workflows, `/release` command); kit checks, beta/production builds and site check pass locally. | [PR #15](https://github.com/krazow/The-Burg/pull/15) |
| Nov 16, 2026 | **QA suites built:** smoke, gameplay walkthrough and bot play-test simulation with a balance report. The first report filed [#16](https://github.com/krazow/The-Burg/issues/16) and updated [#6](https://github.com/krazow/The-Burg/issues/6) and [#7](https://github.com/krazow/The-Burg/issues/7). | [PR #15](https://github.com/krazow/The-Burg/pull/15) |
| Nov 17, 2026 | **Balance fixes** (#6, #7, #16): prices rise 3%/yr and pay 2.5%/yr, 401(k) with match, kids/college/trip events, partner income, rescaled Life Score, job-based layoffs, one inheritance per game. Careless play: median 78 → 58; good play: 85. | [PR #17](https://github.com/krazow/The-Burg/pull/17) |
| Nov 17, 2026 | **Merged** the maps ([PR #1](https://github.com/krazow/The-Burg/pull/1)), release kit + QA ([PR #15](https://github.com/krazow/The-Burg/pull/15)) and balance fixes ([PR #17](https://github.com/krazow/The-Burg/pull/17)) after QA passed on each. CI on `main` passes. Closed #2, #3, #4, #6, #7 and #16. | `main` |
| Nov 17, 2026 | **First beta: 0.1.0-beta.1.** QA, build, Pages deploy and the live smoke test all passed. Live at https://krazow.github.io/The-Burg/beta/. | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.1.0-beta.1) |
| Nov 17, 2026 | **Save and load up to 5 games:** each life auto-saves to its own slot; title list with Continue/Delete; Menu → Save a copy (checkpoint) and Load; full slots ask which to replace; 0.1.0 saves move into slot 1. QA passed (gameplay now 16 checks). | [PR #18](https://github.com/krazow/The-Burg/pull/18) |
| Nov 17, 2026 | **Second beta: 0.1.0-beta.2** with 5 save slots. QA, build, deploy and live smoke test passed. | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.1.0-beta.2) |
| Nov 17, 2026 | **Menu Save game / Load game** at the top of the in-game Menu: save to this life's slot or a copy to another; load any saved life. QA passed. | [PR #19](https://github.com/krazow/The-Burg/pull/19) |
| Nov 17, 2026 | **Third beta: 0.1.0-beta.3** with the clearer Menu Save game / Load game. All release checks passed. | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.1.0-beta.3) |
| Nov 17, 2026 | **Playtest of beta 3** on a phone-sized screen: walkthrough with screenshots, tap counts and an idle-player check. Filed #20–#27; added notes to #10 and #11. | [report](docs/playtest-2026-11-17.md) |
| Nov 17, 2026 | **Playtest fixes (#20–#27):** week results strip, focus-first Home, End Week shows the focus, ⏭ Auto and 13-week skips for 2-year games, one-tap events, tips, locked-job help, stat help and low-stat banners, score breakdown, take-home job list with a Can apply filter, year in review, and focus streaks/ruts so doing nothing scores 48. Gameplay tests: 27 checks. | [PR #28](https://github.com/krazow/The-Burg/pull/28) |
| Nov 17, 2026 | **Help center:** ❓ Help & tutorial on the start page, a **?** in the game header and in the Menu; a 15-section game guide built from the game's data; a 26-step guided practice tutorial with touch highlights that never touches saves. Gameplay tests: 30 checks. | [PR #29](https://github.com/krazow/The-Burg/pull/29) |
| Nov 17, 2026 | **More test suites:** game rules (24), flows (18, all 56 event choices), screens and accessibility (7 sizes × 10 screens), offline and updates (6). Fixed WCAG AA contrast and small map-pin targets; filed #31 (landscape). | [PR #30](https://github.com/krazow/The-Burg/pull/30) |
| Nov 17, 2026 | **Found issues fixed:** landscape layout (#31), every target 44 × 44 px and keyboard/screen-reader support (#10), and hospital tuning (overwork is now dangerous). Tests: rules 26, screens 14. | [PR #32](https://github.com/krazow/The-Burg/pull/32) |
| Nov 17, 2026 | **0.1.0 released to production** (beta 4 → promote): https://krazow.github.io/The-Burg/. Tester invite posted on #5. | [release](https://github.com/krazow/The-Burg/releases/tag/v0.1.0) |
| Nov 17, 2026 | **Events happen at places on the map (#8):** every event has a place; gold badges and "Recently here" on both maps. Added a screens check for code leftovers. | [PR #33](https://github.com/krazow/The-Burg/pull/33) |
| Nov 17, 2026 | **Real river shapes (#12):** Columbia, Snake and Yakima from Natural Earth via `tools/make-geo.py`; Tri-Cities labels fixed. | [PR #34](https://github.com/krazow/The-Burg/pull/34) |
| Nov 17, 2026 | **Save backup (#13):** download a backup file or copy a backup code; restore by adding to empty slots or replacing all. | [PR #35](https://github.com/krazow/The-Burg/pull/35) |
| Nov 17, 2026 | **Android and Windows builds (#14):** APK (`com.krazow.theburg`) and Windows installer (port 47920) on every release. | [PR #36](https://github.com/krazow/The-Burg/pull/36) |
| Nov 17, 2026 | **0.2.0-beta.1:** all of the above; QA, Android, Windows, deploy and live smoke test passed. The APK used a throwaway key ([#37](https://github.com/krazow/The-Burg/issues/37)). | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.2.0-beta.1) |
| Nov 17, 2026 | **0.2.0-beta.2:** all release checks passed; the APK still used a throwaway key (#37). Merged branches were deleted. | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.2.0-beta.2) |
| Nov 17, 2026 | **Help guide fix:** the contents list was pinned to the bottom of the screen over the guide's text (since 0.1.0). Found while recording the demo video; new screens check. | [PR #38](https://github.com/krazow/The-Burg/pull/38) |
| Nov 17, 2026 | **Demo videos** of the gameplay tutorial with subtitles: vertical 9:16 and widescreen 16:9, each with an .srt file (2:09). | sent in chat |
| Nov 17, 2026 | **Chapter demo videos:** the tutorial recording split into 7 chapters, each introduced by a full-screen slide (no subtitles), in the style of the Bankroll demo: vertical 9:16 and widescreen 16:9 at 4K (3:17). | sent in chat |
| Nov 18, 2026 | **Planned player-submitted NPCs:** analysis, the 10-page questionnaire and the work breakdown; filed #39–#44. | [plan](docs/npc-submissions.md) |
| Nov 18, 2026 | Moved the NPC work (#39–#44) to **version 2.0**, with a [v2.0 milestone](https://github.com/krazow/The-Burg/milestone/1); removed the pronouns question from the form. | `TODO.md` |
| Nov 18, 2026 | **0.2.0-beta.3** with the Help guide fix: all release checks passed, but the APK still used the throwaway key; the signing secrets weren't visible to the workflow (#37). | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.2.0-beta.3) |
| Nov 18, 2026 | **Android signing (#37):** made The Burg's own release key; secrets added. **0.2.0-beta.4** passed every check and its APK is signed with the new key (certificate confirmed in the downloaded APK). | [pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.2.0-beta.4) |
| Nov 18, 2026 | **Planned Out and about:** researched Waitsburg's open businesses; you picked 20 (plus Ten Ton Coffee as you described it). Plan, milestone and issues #48–#54. | [plan](docs/out-and-about.md) |
| Nov 18, 2026 | **Out and about game names:** 5 playful stand-in names per business added for you to pick from, so real business names stay out of the game. | `TODO.md` |
| Nov 18, 2026 | **Planned Around the region:** errands, car care, dining and outings in Dayton, Walla Walla and the Tri-Cities; milestone and issues #57–#63. | `TODO.md` |
| Nov 18, 2026 | **Around the region built (#57–#63):** weekly trips to 5 towns with 23 stops (groceries, car care, eating out, outings, appointments), toothache event, vehicle tabs, Help section. New tests: 9 rules checks, 2 flows, a trip screen at 7 sizes, and a weekly-tripper bot in the simulation (careless 53, idle 49, good play 83). | [PR](https://github.com/krazow/The-Burg/pulls) |
| Nov 18, 2026 | **Gameplay analysis:** 6 observations and 12 recommendations (features and styles of play), filed as #66–#77 under Soon. | [analysis](docs/gameplay-recommendations-2026-11-18.md) |
| Nov 18, 2026 | **Gameplay findings** added to the to-do and prioritized (#79–#84): commutes and side hustles first, then goals, quiet weeks, same starts, difficulty, ways to grow. | `TODO.md` |
| Nov 18, 2026 | **Gameplay fixes, phase 1:** live Life Score on Home with quarterly report cards (#67); carpools, remote days, seasonal side-hustle gigs and a gentler Work extra hours (#70), fixing finding #79. Sim, 5-year games: sensible long-commuter 66 → 73, overtime grinder 46 → 51, side hustler 37 → 50; careless 54, idle 49, good play 86. | [PR #86](https://github.com/krazow/The-Burg/pull/86) |
| Nov 18, 2026 | **Gameplay fixes, phase 2:** five ways a life can begin (#69), Relaxed and Hard modes with best scores per mode (#73, fixing finding #83), and a town goal each season (#77). The sim now also plays every start and mode; careless 58, idle 49, good play 88. | [PR #87](https://github.com/krazow/The-Burg/pull/87) |
| Nov 18, 2026 | **Gameplay fixes, phase 3:** 18 badges and up to 3 life goals worth +2 Life Score each (#66), three stories that unfold over weeks (#68), four challenges on the title screen (#74). Fixes findings #80, #81, #82. Badges show as a quick message so they never interrupt play. | [PR #88](https://github.com/krazow/The-Burg/pull/88) |
| Nov 18, 2026 | **Gameplay fixes, phase 4:** skills (#71), your own business (#72), weekly challenge and score card (#75), legacy mode (#76). Fixes finding #84. All six findings and twelve recommendations are now built. | [PR #89](https://github.com/krazow/The-Burg/pull/89) |
| Nov 18, 2026 | **Testing round after phases 1–4:** all 7 suites, a 3× simulation (282 games), and exploratory checks (every start × mode × length, every challenge, 3 legacy generations, old saves, backups, 532 random taps) all passed. Wrote the review (40 items) and 90 balanced event ideas for you to pick (#90–#93). | [review](docs/review-and-events-2026-11-18.md) |
| Nov 18, 2026 | **Fixed the three 🔴 review bugs (#90 R1–R3):** backups now carry badges, challenge wins and every best score; life goals count only if pinned before the badge; 31 event amounts now rise with prices and show today's price. 3 new rules checks; all suites pass (careless 60, idle 48, good play 87). | [PR #95](https://github.com/krazow/The-Burg/pull/95) |
