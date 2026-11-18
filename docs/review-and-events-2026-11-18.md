# The Burg: review, gotchas and 90 new events

_November 18, 2026, written after the gameplay fixes (phases 1–4, PRs #86–#89) were merged and tested. It covers the
**review** (changes, game balancing, gaps and gotchas) and **90 event ideas** (30 in Waitsburg, 30 on the road and in
other towns, 30 at work), each balanced against the current game. Nothing here is built yet; pick what you want and
it moves into the build list. Tracked in TODO.md under "Your picks: review and new events" (#90–#93)._

## How this was tested

**`main` after all four phases:**
- **All 7 suites pass:** smoke, rules, gameplay, flows, screens, offline and simulation.
- **3× simulation:** 282 games, covering 9 bot styles, every start and every mode, at every length.
- **Exploratory checks:** every start × mode × length played to the end; every challenge played and judged; three
  legacy generations in a row; an old 0.1.0 save loading and playing; backups carrying the new data; and 532 random
  taps on every screen with no errors.

**Balance (3× simulation):** doing nothing scores 48 (target 50 or below), careless play 58 (60 or below) and good
play 91 in 5-year and Lifetime games (70 or above).

| Bot style | 6 months | 2 years | 5 years | Lifetime |
|---|---|---|---|---|
| Planner (good play) | 72 | 75 | 89 | 95 |
| Homebody (stays in town) | 69 | 78 | 82 | 77 |
| Sensible long-commuter | 69 | 72 | 76 | 71 |
| Overtime grinder | 64 | 54 | 54 | 59 |
| Side hustler | 62 | 55 | 49 | 54 |
| Student | 65 | 63 | 81 | 96 |
| Careless | 58 | 56 | 65 | 73 |
| Idle (does nothing) | 58 | 43 | 34 | 29 |
| Trip every week | 74 | 78 | 77 | 70 (3 of 3 ended in debt) |

| Start or mode (2 years) | Good play | Careless |
|---|---|---|
| Normal start | 75 | 56 |
| Farm kid | 78 | 59 |
| Grad coming home | 90 | 76 |
| Seattle transplant | 77 | 58 |
| Young parent | 82 | 54 |
| Relaxed | 83 | 65 |
| Hard | 73 | 51 |

---

## Part 1: changes, game balancing, gaps and gotchas

Severity: 🔴 a real bug or exploit (fix soon), 🟠 balance, 🟡 a gap or a rough edge, ⚪ polish. Each item says what to do.

### Gotchas and bugs found in testing
| # | Sev | Item | What to do |
|---|---|---|---|
| R1 | 🔴 | **Backups don't include badges or challenge results.** `backupData()` saves lives and best scores, but not the badge collection or the challenges you've won, so moving devices loses them. | Add `theburg.badges.v1` and `theburg.challenges.v1` to backups and restore. |
| R2 | 🔴 | **Pin-at-the-end exploit.** You can pin 3 already-earned badges as "life goals" in your last week and get +6 Life Score. | Only count a goal if it was pinned before the badge was earned (store the week it was pinned). |
| R3 | 🔴 | **Event costs don't rise with prices.** 19 event choices use fixed dollar amounts (for example the $350 doctor, the $1,200 roof and the $650 toothache), while prices rise 3% a year. By year 50 they cost a quarter as much in real terms. | Wrap every event amount in `cost()`. |
| R4 | 🟠 | **The version label still says 0.1.0** in the game code (`APP_VERSION`). The release kit stamps the real version into some places, but the title screen and backups show 0.1.0. | Stamp `APP_VERSION` from `VERSION` at release, or read it from `release.json`. |
| R5 | 🟡 | **Legacy names repeat.** "Ann Lee" → "Ann Jr." → "Ann Jr." → "Ann Jr.". | Use II, III, IV, or ask for a name when you continue. |
| R6 | 🟡 | **The legacy heir is 18 although the parent died in their 80s**, so the story only works as a grandchild. | Call it "your grandkid", or start the heir at 30–50 with a matching history. |
| R7 | 🟡 | **Weekly challenge best scores pile up**: one "📅 2026-W47" entry a week fills the title screen's best-score line. | Show only the current week's weekly best. |
| R8 | 🟡 | **"Same dice" isn't "same events".** In the weekly challenge, different choices consume dice differently, so two players' lives drift apart after their first different choice. | Use separate dice for events and for everything else, or reword the claim to "the same start and luck". |
| R9 | 🟡 | **Weekly challenge week boundaries** use the device clock and time zone, so friends in different time zones can be on different weeks for a few hours. | Use UTC for the week. |
| R10 | 🟡 | **The flood story can start without high water.** "Water in the basements" can come in any February–April, separate from "The Touchet is running high". | Only start it after a high-water event that you didn't sandbag, or in the same month. |
| R11 | 🟡 | **Trips don't slow down classes.** A trip cuts your focus to 75%, but study progress still counts a full week. | Decide on purpose: keep it as is, or count 0.75 of a week. |
| R12 | 🟡 | **The carpool setting sticks** when you change jobs, so a new long commute silently starts carpooling. | Reset the carpool when the job changes, or ask. |
| R13 | 🟡 | **Business value rises with prices forever** (60% of the price today). A wheat lease never ends or loses value. | Add slow depreciation and a lease renewal every 5 years. |
| R14 | ⚪ | **Vehicle tabs are a flat $95** whatever the vehicle. | Scale them with vehicle value (more for the new pickup). |
| R15 | ⚪ | **Hard mode's +10% living costs** is a flat line, not 10% of your actual bills. | Make it a percentage of rent, food and insurance. |
| R16 | ⚪ | **Relaxed mode** stops debt at -$40,000, so you can't lose. That's fine because best scores are separate, but the end screen should say so. | Add "(Relaxed)" next to the score, which the end screen partly does now. |

### Game balancing
| # | Sev | Item | What to do |
|---|---|---|---|
| B1 | 🟠 | **Careless play in long games** scores 65 (5 years) and 73 (Lifetime). Wealth piles up even with bad choices, because pay outgrows costs over decades. | Raise the Lifetime wealth target, add more random large expenses (R3 helps), or score Lifetime wealth against age. |
| B2 | 🟠 | **Doing nothing in 6-month games** scores 58. Starting stats are decent and 26 weeks isn't long enough for drains to bite. | Lower starting happiness and health a little for 6-month games, or count early weeks more. |
| B3 | 🟠 | **The grad start is very strong**: careless play scores 76 because the associate degree opens nurse jobs on day one. | Raise the loan, or have the degree be a certificate with one year left. It's labeled "Head start" today. |
| B4 | 🟠 | **The young parent isn't harder**: kids add happiness and community, which outweighs the $650 a month. | Kids' happiness could depend on time at home (rest and town focus), and childcare could cost more for commuters. |
| B5 | 🟠 | **Weekly trips forever end in debt in Lifetime games** (3 of 3), with no warning. | Warn when you plan a trip while in debt, and limit trips while in debt. |
| B6 | 🟠 | **Stock-up runs barely pay off from the Tri-Cities**: about $50 saved over 4 weeks against about $32 of gas in the pickup. | Raise the saving to 20%, or make stock-up last 6 weeks. |
| B7 | 🟠 | **Story rewards were trimmed once** (careless hit 60). Each new event pack needs the same check. | Keep the simulation's careless ceiling as a hard test failure, not just a report. |
| B8 | 🟠 | **The long-commute overtime grinder** scores 54–59. That's intended (overwork should cost), but players may not see why. | Add a stat tip: "Overtime 3 weeks in 4 is wearing you down." |
| B9 | ⚪ | **Side hustle experience never fades**, and the 60% bonus stays forever. | Fade it slowly after 6 months without hustling. |
| B10 | ⚪ | **Life Score so far looks harsh early**: the wealth part counts against the full target from week one. | Show "on track" against a target scaled to how far through the game you are. |

### Gaps and rough edges
| # | Sev | Item | What to do |
|---|---|---|---|
| G1 | 🟡 | **The tutorial doesn't show the new features**: trips, life goals, skills, businesses, town goals or challenges. | Add 4–5 short steps, or a "What's new" tour. |
| G2 | 🟡 | **The title screen is long** (name, length, start, mode, Start, Challenges, Weekly, Help, Restore). On small phones Start is far down. | Collapse start and mode into a "More options" panel, and put Start first. |
| G3 | 🟡 | **The screen checks don't cover the newest pop-ups**: life goals, challenges, weekly challenge and business. | Add them to the screens suite at 7 sizes. |
| G4 | 🟡 | **Score cards need checking on real devices**, in the Android app and the Windows app (sharing a picture may fall back to a download). | Add to the phone play-test (#9). |
| G5 | 🟡 | **Events will thin out as more are added.** Each new event makes every other one rarer, and the 90 below would make each existing event about 4× rarer. | Pace events by category (see "How to balance new events"). |
| G6 | 🟡 | **No in-game "What's new"**: returning players won't find the new features. | Show a one-time "What's new in 0.3.0" card after an update. |
| G7 | ⚪ | **Best scores per mode and challenge** show as one long line. | Use a small table, or a "Your records" screen. |
| G8 | ⚪ | **Journal filters**: report cards, badges, skills and trips now fill the Journal. | Add filter chips (Money, Events, Milestones). |
| G9 | ⚪ | **Out and about** (#48–#54) is waiting on your business-name picks. Around the region uses described places ("a taqueria") in the meantime. | Pick the names. |
| G10 | ⚪ | **A beta with all of this** hasn't been cut. Phases 1–4 and Around the region are only on `main`. | `/release now`, then try it, then `/release promote`. |

### Technical and testing
| # | Sev | Item | What to do |
|---|---|---|---|
| T1 | 🟡 | **The careless and idle ceilings are report-only** in the simulation. A change could quietly break balance. | Fail the simulation when careless is above 62 or idle above 52 (a small margin for dice). |
| T2 | 🟡 | **The full test run takes about 15 minutes** on 2 CPUs, mostly the simulation. | Run the full simulation on `main` and releases only; use `SIM_SCALE=0.5` on pull requests. |
| T3 | ⚪ | **index.html is about 2,400 lines.** Edits are getting risky. | Split the game logic into a few script files (the release kit supports more than one file). |
| T4 | ⚪ | **The exploratory tests** used in this round aren't saved in the repo. | Add them as `tests/explore.test.mjs`. |

---

## Part 2: 90 new events, balanced

### How to balance new events
- **Pace by category, so the existing events keep their frequency.** Today one event comes in about 28% of weeks
  from about 33 events. With 90 more, pick each week like this:
  - **Town (14%)**: Waitsburg and today's seasonal events.
  - **Road (8%)**: only in weeks you commute 20+ miles or take a trip.
  - **Work (8%)**: only when you have a job.

  A commuter with a job sees about one event every 3 weeks, and someone without a job or a commute about one every
  7. Hard mode adds +25% to each category.
- **Effect sizes, on the same scale as a week's focus.** One week of a focus moves a stat about 1 point.
  - **Small:** ±1–3 stat points, or up to $60.
  - **Medium:** ±4–6, or $60–$400.
  - **Large:** ±7–10, or $400–$1,500. Large events are yearly or once only.
- **Money and stats trade at about $25 per point of happiness**, in 2027 dollars (from trips: a $28 movie gives +3
  happiness before the focus scaling). Every amount goes through `cost()` so it rises with prices (see R3).
- **Choices are trade-offs.** Opportunity events have a positive best choice that costs something. Bad-luck events
  have a choice that softens them, often tied to a skill, community or a badge. There's always a free "skip"
  choice, sometimes with a small community cost.
- **Cooldowns:** repeatable events wait 8 weeks, yearly ones 40 weeks.
- **Built-in checks:** every pack must keep careless at 60 or below, idle at 50 or below and good play at 70 or above
  in the simulation, and each event's every choice is tested in the flows suite.

Key: ☺ happiness · ♥ health · 🤝 community · $ in 2027 dollars (rises with prices). "Yearly" means once a year at
most; "8 wk" means it can repeat after 8 weeks.

### A. 30 events in Waitsburg
| # | Event | When / who | Choices → effects | Repeat | Balance note |
|---|---|---|---|---|---|
| W1 | Preston Park cleanup day | April | Help rake and haul (🤝+3, ♥−1) · Donate rakes −$25 (🤝+1) · Skip (🤝−1) | Yearly | Counts toward the spring town goal. Small. |
| W2 | Bruce House museum open house | June | Volunteer as a guide (🤝+3, ☺+1) · Take the tour −$10 (☺+2) · Skip | Yearly | Flavor plus community. Small. |
| W3 | Fourth of July parade | July | Ride on a float, community 40+ (🤝+3, ☺+3) · Watch from Main Street (☺+2) | Yearly | Reward for community; no downside. |
| W4 | Trout opener on Coppei Creek | April | Fish opening morning −$30 license (♥+2, ☺+3) · Skip | Yearly | Ties to Get outside; medium. |
| W5 | Library book sale | October | Fill a box −$15 (☺+2; +1 week of class progress if studying) · Volunteer sorting (🤝+2) | Yearly | A small boost for students. |
| W6 | FFA bake sale | Any | Bake something −$8 (🤝+2) · Buy a pie −$12 (☺+1) · Walk past | 8 wk | Small and cheap; Cook skill +1 practice. |
| W7 | Neighbor's chickens loose in your yard | Spring–summer | Help catch them (🤝+2, ☺+1) · Grumble over the fence (🤝−2) | 8 wk | Comic, small. |
| W8 | Ice storm knocks out power | Dec–Feb | Check on older neighbors (🤝+3, ♥−1) · Wait it out (☺−2) · Generator −$450 (no future outage penalty) | Yearly | Counts toward the winter goal; medium. |
| W9 | Frozen pipes | Dec–Feb, homeowners | Plumber −$350 · Fix it yourself, Handy 1+ (−$60, ♥−1; Handy +2) · (renters: landlord fixes it, ☺−1) | Yearly | A Handy payoff; medium. |
| W10 | Citywide yard sale | June | Sell your stuff (+$80–$200) · Bargain hunt −$40 (☺+3) · Both (+$40–$160, ☺+2) | Yearly | A small money option; fits low-cash starts. |
| W11 | School fundraiser auction | March | Donate −$50 (🤝+3) · Bid on a quilt −$120 (☺+3, 🤝+1) · Skip | Yearly | Community for money; about $20/point, in range. |
| W12 | Fire district pancake breakfast | May | Eat −$10 (☺+2, 🤝+2) · Flip pancakes, community 30+ (🤝+4, ♥−1) | Yearly | Small; volunteering is better. |
| W13 | Smoke from a wheat-field fire | August | Haul water for the crews (🤝+4, ♥−2) · Stay in (♥−1) · Leave town for the weekend −$80 (no health hit) | Yearly | A summer-goal tie-in; medium. |
| W14 | Mice in the walls | October | Traps −$20 (☺−1) · Exterminator −$180 · Adopt a barn cat (☺+4, −$20/mo; new pet) | Yearly | A cat is a small, permanent pet (half a dog's effect). |
| W15 | An old friend moves back | Any | Dinner −$30 (☺+4) · Help them move (🤝+2, ♥−1) · Wave from the porch | Once | One time; medium. |
| W16 | Snow day | Dec–Feb | Sled at the park (☺+4, ♥+1) · Shovel neighbors' walks (🤝+3, ♥−1) | 8 wk | Counts toward the winter goal. |
| W17 | Community potluck at Town Hall | Fall | Bring a dish −$15 (🤝+3, ☺+2; Cook 2+: ☺+1 more) · Skip | Yearly | A Cook skill payoff. |
| W18 | "Lost dog" poster | Any, no dog | Search the levee (🤝+3; 30%: find it, ☺+3, +$50 reward) · Share the post (🤝+1) | 8 wk | Small; luck adds a bit. |
| W19 | Pour beer at the Celebration Days beer garden | May, 21+ | Volunteer (🤝+3, ☺+2, ♥−1) · Just visit −$20 (☺+2) | Yearly | Stacks with Celebration Days; keep small. |
| W20 | Town Hall roof fundraiser | Any | Donate −$100 (🤝+4) · Help with the bake-off (🤝+2) · Skip | Yearly | Community at about $25/point. |
| W21 | Adopt a Main Street flower basket | April | −$40 (☺+1, 🤝+3; your name on a tag all summer) · Skip | Yearly | Small, steady. |
| W22 | Little League needs a coach | March, community 30+ | Coach this season (🤝+5, ☺+2, ♥−1; starts a 3-step story: losing streak → comeback → season party) · Skip | Yearly | A new short story chain; medium. |
| W23 | A cross-country cyclist asks for water | Summer | Offer a meal −$10 (☺+3, 🤝+1) · Fill their bottle (☺+1) | 8 wk | Flavor for the Lewis & Clark route. |
| W24 | Late frost kills the garden | May, homeowners | Replant −$40 (☺+1) · Let it go (☺−2) | Yearly | Small; for homeowners only. |
| W25 | Christmas lights contest | December | Go big −$120 (☺+4, 🤝+3; 25%: win a $100 gift card) · A few strings −$20 (☺+2) · Skip | Yearly | Medium; luck pays some back. |
| W26 | Neighbor's tree takes out your fence | After a Windstorm, homeowners | Split the cost −$300 (🤝+2) · Insurance −$500 deductible (🤝−1) · Fix it yourself, Handy 2+ (−$80, ♥−1) | Yearly | A follow-up to the Windstorm event; a Handy payoff. |
| W27 | Barn dance at the fairgrounds | October | Go −$15 (☺+4, 🤝+2; if single, a 20% better chance on the next "catches your eye") · Skip | Yearly | Ties to relationships. |
| W28 | Wild turkeys strut down Main Street | Spring | Take a picture (☺+1) | 8 wk, low weight | Flavor only; one choice, auto-resolves. |
| W29 | Graduation party invitations | June | Cards for everyone −$25 (🤝+2, ☺+1) · Skip (🤝−1) | Yearly | Small. |
| W30 | Rattlesnake in the woodpile | Summer | Call the guy who relocates them −$40 · Handle it yourself (☺+2; 15% bite: −$1,800 hospital, ♥−6) | Yearly | A risky choice whose expected cost is about $270; the safe choice is cheaper. |

### B. 30 events on the road and in other towns
Road events come in weeks you commute 20+ miles or take a trip, in the town you drive to or along the way.

| # | Event | When / who | Choices → effects | Repeat | Balance note |
|---|---|---|---|---|---|
| R-1 | Deer on Highway 12 at dusk | Commuters, Oct–Jan | Brake hard (☺−1; 15% hit: −$900 repair, ♥−1; 5% with winter tires on) | 8 wk | Rewards winter tires; the expected cost is about $135. |
| R-2 | Stuck behind a wheat truck | Harvest, Jul–Aug | Wait it out (☺−1) · Pass on the straightaway (☺+1; 5%: close call, ♥−2) | 8 wk | Small; a little risk. |
| R-3 | Fog in the Touchet Valley | Nov–Jan | Drive slow (☺−1) · Leave late and lose a few hours (−$ about a quarter day's pay) | 8 wk | A choice between time and money. |
| R-4 | Flat tire on US-12 | Any | Change it yourself, Mechanic 1+ (♥−1; Mechanic +1) · Call a tow −$120 | 8 wk | A Mechanic payoff. |
| R-5 | Speeding ticket | Commuters | Pay it −$160 (☺−2) · Traffic school −$60 (☺−1, lose an evening) | Yearly | Medium; a cheaper option that costs time. |
| R-6 | Road-construction detour | Summer | Take the long way (−$15 gas, ☺−1) | 8 wk | One choice; auto-resolves. |
| R-7 | A stranded driver on the shoulder | Any | Stop and help (🤝+2, ☺+2; 10%: they're from Waitsburg, 🤝+2 more) · Drive on | 8 wk | A small good deed. |
| R-8 | Your carpool buddy is always late | Carpoolers | Talk it out (🤝+1, ☺−1; People skill +1) · Leave the carpool | Yearly | Tests the carpool; People skill payoff. |
| R-9 | An audiobook habit on the commute | Commute 40+ miles | Learn something (+1 week of class progress if studying, else ☺+2) · Music and coffee (☺+2) | 8 wk | Makes long commutes a little better. |
| R-10 | Dust storm near the Tri-Cities | Summer | Pull over and wait (☺−1) · Push through (10%: −$600 fender) | Yearly | Risk choice; expected cost $60. |
| R-11 | Hot-air balloon festival in Walla Walla | May | Watch the dawn launch (☺+4) · Balloon ride −$250 (☺+8) | Yearly | A large positive for money; yearly. |
| R-12 | A free college lecture in Walla Walla | School year | Go (☺+2; +1 week of class progress if studying) · Skip | 8 wk | A study boost. |
| R-13 | A friend is in the hospital in Walla Walla | Any | Visit (🤝+2, ☺+1, trip gas) · Send flowers −$40 (🤝+1) | Yearly | Small. |
| R-14 | Wine release weekend in Walla Walla | Spring and fall, 21+ | Stop at a tasting −$35 (☺+3) · Sit in traffic (☺−1) | 8 wk | Small; ties to the tasting room stop. |
| R-15 | Train crossing in Pasco | Pasco commuters | Wait (☺−1) · Take the long way (−$8 gas) · (5%: late, −$50 docked pay) | 8 wk | Small and frequent for Pasco jobs. |
| R-16 | Cheap flight deal out of Pasco | Any, money $1,000+ | Weekend getaway −$350 (☺+6) · Pass | Yearly | Big happiness for money; yearly. |
| R-17 | Spring festival in Pasco | May | Food and music −$25 (☺+4, 🤝+1) · Skip | Yearly | Medium. |
| R-18 | Hydroplane races on the Columbia | July | Go −$30 (☺+5) · Watch from the riverbank, free (☺+3) | Yearly | Medium. |
| R-19 | Fourth of July fireworks in Columbia Park | July | Drive over (☺+3, trip gas) · Stay in Waitsburg for the parade (see W3) | Yearly | Conflicts with W3 on purpose: a choice of where to celebrate. |
| R-20 | Clearance sale at the mall | January and August | New work clothes −$120 (☺+2; +5% odds on your next job application) · Window shop (☺+1) | Yearly | Small job-hunting help. |
| R-21 | A test drive at a dealership | Kennewick or Pasco trips | Take it home (opens the Ride card with a $500 trade-in bonus this week) · Just a test drive (☺+2) | Yearly | Nudges vehicle upgrades; the bonus is small. |
| R-22 | Riverfront 5K in Richland | April and September | Run it −$25 (♥+3, ☺+2) · Cheer from the side (☺+1) | Yearly | A health option. |
| R-23 | Hanford history tour | Any, Richland trips | Take it, free (☺+2; +1 week of class progress if studying) | Yearly | Flavor plus study. |
| R-24 | Classic car show in Dayton | June | Show off the 1998 pickup (☺+3; 20%: "best beater", +$50) · Browse (☺+2) | Yearly | A fun reason to keep the beater. |
| R-25 | Bluewood season pass sale | October | Buy it −$300 (the next Powder day events at Bluewood are free that season) · Pass | Yearly | Changes the existing Powder day event's cost. |
| R-26 | Chains required on the road to Bluewood | Dec–Feb, Dayton trips | Buy chains −$60 (good for the season) · Turn back (☺−2) | Yearly | Small. |
| R-27 | Wrong pump at the gas station | Any, low weight | Drain and refill −$400 (☺−2) | Yearly, 2% | Pure bad luck; very rare. |
| R-28 | A lost wallet in a Walla Walla parking lot | Any | Track down the owner (🤝+2, ☺+3; 40%: $50 reward) · Leave it at the store desk (☺+1) | Yearly | A small good deed. |
| R-29 | Pothole season | March | Swerve and slow down (☺−1) · (sedan: 30% hit, −$150 alignment) | Yearly | Small; the pickup shrugs it off. |
| R-30 | A friendly regular at the gas station | Commuters, once | Coffee and stories (☺+2, 🤝+1; makes R-7 more likely to be "someone from Waitsburg") | Once | Flavor; makes long commutes feel lived-in. |

### C. 30 events at work
Work events need a job. Some are for certain kinds of jobs:
- **Field:** farm hand, cellar hand, onion shed, food plant, Hanford tech, lift operator, airport crew.
- **Office:** insurance, clerk, loan officer, lab administrator, professor, scientist.
- **Care:** nursing assistant, nurse, imaging tech, paraeducator.
- **Service:** diner cook, retail, hardware store.
- **Transport and trades:** trucker, rail, mechanic, elevator operator, corrections officer.

| # | Event | When / who | Choices → effects | Repeat | Balance note |
|---|---|---|---|---|---|
| J1 | Your performance review | Any job, 26+ weeks in | Ask for a raise (60% + People skill ×5%: +4% pay, ☺+3; otherwise ☺−3) · Keep your head down | Yearly | A small, risky raise (the existing "A raise" event is +6%). |
| J2 | A promotion offer | Any job, 52+ weeks in | Take it (+12% pay, job stress +0.3) · Turn it down (☺+1) | Yearly | Real trade-off: more pay, more stress. |
| J3 | Mandatory overtime week | Field and service | Work it (+30% of a week's pay, ♥−3, ☺−2) · Refuse (10%: a write-up, ☺−1) | 8 wk | Like Work extra hours for one week. |
| J4 | A coworker conflict | Any | Talk it out (70% + People 15%/level: 🤝+1, ☺+1; otherwise ☺−2) · Go to the boss (☺−1) | 8 wk | People skill payoff; People +1. |
| J5 | Free training course | Any job | Take it (+4 weeks of class progress, ☺−1) · Skip | Once | A study shortcut; large in effect but one time. |
| J6 | Hurt on the job | Field and transport | Light duty (−20% pay for 4 weeks) · Push through (♥−6) · See the doctor −$120 (♥−2) | Yearly | Medium; health or money. |
| J7 | Employee of the month | Any; odds up with People | Accept the parking spot and gift card (☺+4, +$50) | Yearly | A pure positive; rare. |
| J8 | New manager | Any | Bring donuts −$15 (☺+1, 🤝+1) · Keep your head down (☺−3 for a rough month) | Yearly | Small. |
| J9 | Holiday party | December | Go (☺+3, 🤝+1) · Skip (☺−1) | Yearly | Small. |
| J10 | Train the new hire | Any, 26+ weeks in | Mentor them (☺+1; People +2) · Not my job (☺−1) | 8 wk | A People skill source. |
| J11 | A big mistake at work | Any, 15% weight | Fix it after hours (♥−2) · Own up to the boss (☺−2; +10% on your next raise roll) | 8 wk | Honesty pays later. |
| J12 | Equipment breaks down | Field and transport | Fix it, Mechanic 1+ (+$100 bonus; Mechanic +1) · Call it in (☺−1, half a day without pay) | 8 wk | A Mechanic payoff. |
| J13 | Flu going around | Dec–Feb | Stay home unpaid (−1 day's pay, ♥+1) · Work sick (♥−4; 30%: coworkers catch it, 🤝−1) | Yearly | Medium; health or money. |
| J14 | A customer compliment | Service and care | Enjoy it (☺+3) | 8 wk | Small positive; one choice, auto-resolves. |
| J15 | A rude customer | Service | Keep your cool (☺−2; People +1) · Snap back (☺+1; 20%: write-up, ☺−3) | 8 wk | Small. |
| J16 | Workplace fundraiser | Any | Chip in −$25 (🤝+2) · Skip | Yearly | Small. |
| J17 | The boss offers a weekend gig | Field and trades | Take it (+$300, ♥−2, ☺−1) · Decline | 8 wk | Like a side hustle week. |
| J18 | Conference trip | Office and care | Go, paid (☺+3, +2 weeks of class progress; partner ☺−1 if you have one) · Skip | Yearly | Study plus happiness. |
| J19 | A coworker retires | Any | Chip in −$20 (🤝+2, ☺+2) · Sign the card (🤝+1) | Yearly | Small. |
| J20 | New software rollout | Office | Learn it early (☺−2 now; +5% on the next promotion offer) · Grumble (☺−1) | Yearly | A small long-term bet. |
| J21 | Payroll error: a late paycheck | Any, low weight | Wait it out (☺−2; interest if it puts you in debt) | Yearly | One choice; auto-resolves. |
| J22 | Year-end bonus | Office and care, December | Bank it (+2 weeks' pay) · Treat yourself (+1 week's pay, ☺+4) | Yearly | Medium-large; office and care only. |
| J23 | Lunchroom potluck | Any | Bring a dish −$10 (🤝+1, ☺+2; Cook 2+: ☺+1 more) · Grab a plate (☺+1) | 8 wk | Cook skill payoff. |
| J24 | Cover a double shift | Service, care and field | Do it (+1.5 days' pay, ♥−2, 🤝+2) · Say no | 8 wk | Small; money and community for health. |
| J25 | Harvest crunch | Elevator, cellar hand, onion shed, Jul–Sep | 60-hour weeks for a month (+$1,200, ♥−4, ☺−2) · Normal hours (☺+1) | Yearly | Large money; like Harvest time for jobs it doesn't cover. |
| J26 | Safety inspection | Field and transport | Prep the crew (☺−1; 20%: shutdown, a week unpaid, avoided) · Wing it (20%: shut down a week unpaid) | Yearly | Expected cost about 0.2 weeks' pay. |
| J27 | A recruiter calls | Any, community 30+ | Interview (your next job application is guaranteed this month) · Stay loyal (+2% pay) | Yearly | Job-hopping help vs a small raise. |
| J28 | A remote-day trial | Office jobs without remote days | Try it (☺+2; this month's commute gas −40%) · Skip | Yearly | Like the remote days built in phase 1. |
| J29 | Health plan choice | Any, January | Cheaper plan (+$40/month) · Better coverage (hospital bills −50%) | Yearly | A lasting choice between money and risk. |
| J30 | A work friend's wedding | Any | Go, with a gift −$100 (☺+4, 🤝+2) · Send a gift −$60 (☺+1) | Yearly | Medium. |

### What each pack needs to build
- **Pacing by category** (G5) comes first, so new events don't crowd out the old ones.
- Event places for the map pins:
  - Waitsburg events: on the town map.
  - Road events: the town you drive to, or US-12.
  - Work events: your workplace.
- Every amount goes through `cost()` (R3).
- New state, small:
  - a cat (W14)
  - a generator (W8)
  - a health-plan choice (J29)
  - a season pass (R-25)
  - the Little League story (W22)
- **Tests:** every event's every choice runs in the flows suite, and a simulation check per pack holds careless at
  60 or below, idle at 50 or below and good play at 70 or above.
