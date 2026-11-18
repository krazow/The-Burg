# Changelog

Release notes for The Burg. `/release now` turns the Unreleased section into a dated `## X.Y.Z (YYYY-MM-DD)`
entry for every release, and the GitHub release notes are taken from it.

## Unreleased

### Added
- **What your week did:** a strip above End Week shows the money (events included) and ▲▼ for happiness, health
  and community. Tap it for the full breakdown and everything that happened.
- **⏭ Auto** plays weeks until something needs you, and ⏩ 13 weeks is now in 2-year games too.
- **Year in review** each New Year in 2-year, 5-year and Lifetime games: net worth and stat changes, plus the
  year's milestones.
- **Help when you need it:** three one-time tips for new players. Tap any stat to see what moves it. A banner
  suggests a focus when happiness or health gets low. Locked jobs explain how to unlock them and can make "Take
  classes" your focus.
- **Job list:** jobs you can apply for come first, there's a ✅ Can apply filter, and each job shows take-home pay
  after taxes and gas, with ▲▼ against your current job.
- The ending shows how each part of the Life Score adds up.
- **❓ Help** on the title screen, as a **?** in the in-game header, and in the Menu. It holds a full **game guide**:
  getting started, your week, stats, money, jobs, school, homes and vehicles, savings, family, events, maps,
  saving, the Life Score, tips, and installing. The tables come from the game's own numbers.
- **Gameplay tutorial** under Help: a guided practice life where a pulsing ring and a 👆 show exactly what to tap,
  and each of the 26 steps waits for your tap. It never touches your saves or settings, and puts you back where you
  were.

### Fixed
- Text contrast now meets WCAG AA everywhere: darker grey and green text, and the "Current" and "Home" tags.
- Map pins are easier to tap: each has a larger invisible touch area (at least 24 × 24 px even on small phones).

### Changed
- **Home puts the week first:** a compact focus grid sits right under the stats, the End Week button shows your
  focus, and your job, home, ride and schooling fit on one line that links to Jobs and Life.
- **Doing the same thing every week fades:** a focus works at full strength for 4 weeks in a row, then less. After
  8 weeks you're in a rut (happiness drops) until you switch. Classes are exempt. Rest now tops out in the low 80s,
  and new lives start a little lower (happiness 60, health 78). A player who never changes focus now scores a
  median of 48 (it was 64–76).
- Events with only one choice close in one tap and show their result as a message.

## 0.1.0 (2026-11-17)

The first release of The Burg.

### Added
- A turn-based life sim set in Waitsburg, WA. Each turn is one week: pick a focus (work extra, rest, show up for
  town, take classes, get outside or a side hustle), pay the bills and drive Highway 12.
- Four game lengths: 6 months, 2 years, 5 years and Lifetime (age 18 until the end, with retirement from 62), and
  ⏩ 4-week and 13-week skips that stop when something happens.
- 25 jobs across Waitsburg, Dayton, Walla Walla, Kennewick, Richland and Pasco. Farther jobs pay more but cost gas
  and wear you down, and schooling (trade certificate, associate, bachelor's) unlocks better ones. Layoff risk
  depends on the job.
- Homes to rent or buy, vehicles to upgrade, a 401(k) with an employer match, and family life: partners, kids,
  helping with college and the trip of a lifetime.
- Prices rise 3% a year and pay 2.5% a year, so raises matter. Mortgages and truck loans lock in when you buy.
- About 30 seasonal local events, from Celebration Days and wheat harvest to snow on Highway 12, the Touchet
  running high, powder days at Bluewood and Walla Walla Sweets.
- Tappable maps: a Waitsburg town map where you pick your week by place, and a region map of the six towns with
  the rivers, US-12, each town's jobs and your truck driving the commute.
- A Life Score from happiness, health, community standing and net worth (Lifetime counts in 2027 dollars), with
  your best score saved for each length.
- Up to 5 saved lives. Each life auto-saves to its own slot, and the title screen lists them all to continue or
  delete. In the Menu, **💾 Save game** saves to this life's slot or a copy to another slot as a checkpoint, and
  **📂 Load game** switches to any saved life. With all 5 slots full, starting a new life asks which one to replace.
  A game saved in the first beta moves into slot 1.
- Installable as an app, and works offline.
