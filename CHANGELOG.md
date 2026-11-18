# Changelog

Release notes for The Burg. `/release now` turns the Unreleased section into a dated `## X.Y.Z (YYYY-MM-DD)`
entry for every release, and the GitHub release notes are taken from it.

## Unreleased

### Added
- **Out and about:** 20 Waitsburg businesses under stand-in names, with pins on a new Main Street close-up map and business cards. Visit up to 2 a week for a small boost; real seasons and winter breaks apply, and drinks are 21 and over.
- 7 jobs at local businesses (barista, grocery clerk, bank teller, medical assistant, reporter, ag tech, trades apprentice), and 10 business events such as the every-other-week bluegrass jam and Grenache Fest.
- An "Around town" card on the Life tab: the bank, clinic, grocery and local trades.
- 30 events on the road and in other towns, and 30 events at work.
- "🏆 Your records": best scores by length and mode, challenges, and this week's weekly challenge.
- A one-time "What's new" sheet after an update.
- Journal filter chips: All, Money, Events, Milestones, Trips.
- Heirs get a numbered name (Ann Lee II, III…) that you can change.

### Changed
- Events are paced by kind: town 14%, road 8% (long commute or trip week) and work 8% (with a job) each week; Hard mode raises each.
- The title screen puts Name, Game length and Start first; backgrounds and modes are under "More options".
- Balance: higher net-worth targets for 5-year and Lifetime games; 6-month games start a little lower; the grad, young parent, trips in debt, stock-up runs, overtime grinding and side-hustle experience were all rebalanced.
- Businesses lose value over time, and the wheat lease must be renewed every 5 years.
- Vehicle tabs scale with the vehicle's value; Hard mode's extra costs are 10% of rent, food and insurance.
- Relaxed and Hard scores are labeled everywhere; Life Score so far says whether you're on track.
- The weekly challenge brings the same events in the same weeks whatever you choose, and its week is counted in UTC.
- The game code is split into 8 script files.

### Fixed
- The flood story only follows high water you didn't prepare for.
- Out-of-town trips now slow class progress, and a carpool ends when you change jobs.
- Only the current week's weekly-challenge best is kept.
- An event in the New Year week no longer skips the year in review.

## 0.2.0 (2026-11-18)

### Added
- **Events happen at places.** Every event says where it takes place (the fairgrounds, the Touchet, Bluewood, Walla
  Walla, your workplace…). For 4 weeks a gold badge marks the spot on the Waitsburg or region map, and tapping the
  place shows what happened there.
- **Real river shapes** on the region map: the Columbia, Snake and Yakima now follow their true courses (from Natural
  Earth). The Tri-Cities pins are spread out so every town label is readable.
- **Back up and restore your lives.** Menu → 📤 Back up or restore downloads a backup file or copies a short backup
  code. On another device, 📥 Restore from a backup (title screen or Menu) adds those lives to your empty slots or
  replaces all of them, and keeps your best scores.
- **Android app and Windows installer** on each release, alongside the web app. The Android app is signed with
  The Burg's own release key, so future updates install over it. (If you installed an earlier test APK, uninstall it
  once first.)

- **🚗 Trips around the region.** Once a week, plan a trip to Dayton, Walla Walla, Pasco, Kennewick or Richland:
  tap 🚗 Plan a trip on Home, or a town on the region map, and pick up to 3 stops. It happens when you end the
  week. A trip costs gas there and back and takes part of your week (your focus works at 75%), but in the town you
  commute to it's free: you stop on the way home.
- **Groceries:** a stock-up run at a big store makes groceries 15% cheaper for 4 weeks.
- **Car care:** oil changes cut breakdowns for 6 months, and after a year without one they're more likely. Winter
  tires (October–January) make sliding off Highway 12 much less likely. A car wash, and vehicle tabs that renew each
  January.
- **Eating out and things to do** in each town: a small-town café, dinner downtown, tasting rooms (21+), taquerias,
  the mall, farmers markets, college games, movies, parks, a science museum, minor-league baseball. Some are
  seasonal. Doing the same thing again within 4 weeks is only half as fun, and dates cost double but do more.
- **Appointments:** dentist and doctor checkups. Skip the dentist for over a year and a **Toothache** event can
  happen.
- The Help guide has a new "Trips around the region" section, and the Life tab shows your car care.
- **🏆 Life Score so far** on Home: the score you'd get if the game ended today, with a breakdown and a tip for your
  weakest part. A report card goes in your Journal every 13 weeks.
- **Carpools and remote days:** office jobs have 2 remote days a week, and with community 30+ you can join a carpool
  for long commutes (half the gas, an easier drive, a little community).
- **Side-hustle gigs** follow the seasons (harvest work, plowing snow, yard work, fixing cars) and pay up to 60% more
  with experience.

- **How your life begins:** pick a start on the title screen: Fresh start, Farm kid (a job on the family farm),
  Grad coming home (a degree and student loans), Seattle transplant (savings and a sedan, but nobody knows you) or
  Young parent (a toddler and a tight budget).
- **Relaxed and Hard modes:** Relaxed wears down slower and never ends in debt; Hard wears down faster, has more
  events and layoffs, costs 10% more and ends in debt at -$25,000. Best scores are kept per mode.
- **Town goals each season:** get Celebration Days ready (spring), bring in the harvest (summer), stock the food bank
  (fall), the holiday food drive and shoveling for neighbors (winter). Work toward them with your weekly focus.

- **Badges and life goals:** 18 badges to earn (collected across all your lives). Pin up to 3 as life goals on the
  Life tab; each one you reach adds 2 points to your Life Score.
- **Stories that unfold over weeks:** fixing up the fixer-upper, a friend's food truck, and the flood that leads to a
  new levee. Each step depends on what you chose before.
- **🏁 Challenges** on the title screen: Debt-free in 2 years, Save the family farm, Single parent, and From the
  wheat to the lab.

- **🧰 Skills** (Handy, Mechanic, Cook, People) grow with practice and pay off: cheaper repairs, fixing the truck
  yourself, cheaper groceries, better odds when you apply.
- **🏪 Your own business:** lease wheat ground (pays at harvest), run a food truck (weekends, April–October) or open a
  woodworking shop. Sell it any time for 60% of what you paid.
- **📅 Weekly challenge:** a 6-month life with the same dice for everyone that week, and a **📤 score card** picture to
  share at the end of any life.
- **🌳 Legacy:** when a Lifetime game ends and you had kids, keep playing as your grown kid.

### Changed
- **Work extra hours** now pays +20% (was +15%) and wears on you less. Long commutes and side hustles were traps:
  in simulated 5-year games a sensible long-commuter now scores 73 (was 66), an overtime grinder 51 (was 46) and a
  side hustler 50 (was 37). Overworking while your health is low is more dangerous than before.

### Fixed
- **Help guide:** the contents list was stuck to the bottom of the screen, covering the guide's text. It now scrolls
  with the page like everything else.
- **Backups now include your badges and challenge wins**, and restoring keeps every best score (modes, challenges and
  weekly challenges were dropped before). Restoring adds to the badges you already have; it never removes any.
- **Life goals count only if you pin them before earning the badge.** Pinning badges you already had no longer adds
  points. Goals pinned in older saves still count.
- **Event costs rise with prices.** 31 event amounts (the doctor, the roof, the toothache, tows, the shop, tax refunds,
  found money, the inheritance and more) were fixed dollar amounts, so they got cheap in long games. They now rise
  with the cost of living, and the choices show today's price. A day's pay and severance now use your current pay.

## 0.1.0 (2026-11-17)

The first release of The Burg.

### Added
- **A turn-based life sim set in Waitsburg, WA.** Each turn is one week: pick a focus (work extra, rest, show up for
  town, take classes, get outside or a side hustle), pay the bills and drive Highway 12. Four game lengths: 6 months,
  2 years, 5 years and Lifetime (age 18 until the end, with retirement from 62).
- **Home puts the week first:** your stats, a focus grid, and an End Week button that shows your focus. A strip
  above it shows what the last week did (money with events included, and ▲▼ for each stat). Tap it for every
  paycheck, bill and event. ⏩ 4 and ⏩ 13 skip ahead and **⏭ Auto** plays until something needs you.
- **Mix it up:** a focus works at full strength for 4 weeks in a row, then fades, and after 8 weeks you're in a rut.
  Rest tops out in the low 80s. Pushing through low health with overtime is dangerous, and about two years of
  nonstop overtime in a hard job lands you in the hospital.
- **25 jobs in six towns** (Waitsburg, Dayton, Walla Walla, Kennewick, Richland, Pasco). The list shows take-home pay
  after taxes and gas, puts jobs you can apply for first, and compares each with your current job. Locked jobs
  explain the schooling they need. Layoff risk depends on the job.
- **A whole life:** homes to rent or buy, vehicles to upgrade, school (certificate, associate, bachelor's), a 401(k)
  with an employer match, partners, kids, college, and prices that rise 3% a year while pay rises 2.5%.
- **About 30 seasonal local events**, from Celebration Days and wheat harvest to snow on Highway 12, the Touchet
  running high and powder days at Bluewood. Events with one choice close in one tap.
- **Tappable maps:** a Waitsburg town map where you pick your week by place, and a region map of the six towns with
  the rivers, US-12, each town's jobs and your truck driving the commute.
- **A Life Score** from happiness, health, community and net worth (Lifetime counts in 2027 dollars). The ending
  shows how each part adds up, and your best score for each length is kept. Each New Year brings a year in review.
- **Up to 5 saved lives,** each auto-saving to its own slot. The Menu's 💾 Save game saves now or makes a copy as a
  checkpoint, and 📂 Load game switches lives.
- **Help:** ❓ Help & tutorial on the title screen, a **?** in the game header and in the Menu. A 15-section game
  guide, and a 26-step guided practice tutorial that shows you exactly what to tap. Tips for new players, tap any
  stat to see what moves it, and banners suggest a focus when happiness or health gets low.
- **Accessible:** every button is at least 44 × 44 px, text meets WCAG AA contrast, it works with a keyboard and
  screen readers (focus rings, dialogs, spoken week results), and it has a landscape layout for phones.
- **Installable** as an app, and works offline.

