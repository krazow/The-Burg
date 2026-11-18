# The Burg

Life in The Burg: a turn-based life sim set in Waitsburg, WA, built as an installable web app (PWA).

You live in Waitsburg and work anywhere from Waitsburg and Dayton to Walla Walla, Kennewick, Richland or Pasco. Each turn is one week: pick a focus, pay the bills, drive Highway 12, and handle whatever life in the Burg throws at you.

## Help

Tap **❓ Help & tutorial** on the title screen, or **?** in the game's header, for the full game guide and a guided
practice tutorial that shows you what to tap, step by step.

## Game lengths

- **6 Months** (26 weeks)
- **2 Years** (104 weeks)
- **5 Years** (260 weeks)
- **Lifetime** (age 18 until the end, with retirement from 62)

Skip buttons (⏩ 4 weeks, ⏩ 13 weeks in 2-year and longer games, and ⏭ Auto) play several weeks with the same focus and stop when something needs you. A strip above End Week shows what the last week did. Doing the same thing for too many weeks in a row loses its effect, and eventually puts you in a rut.

## Maps

Home and Jobs each have a **📋 List / 🗺️ Map** toggle, and the game remembers your choice.

- **🏡 Waitsburg:** a stylized town map. Tap a place to spend your week there: home to rest, Main Street to show up for town, the library for classes, the Touchet River to get outside, the bulletin board for odd jobs, and your workplace (or Highway 12) to work extra hours.
- **🛣️ The region:** the six towns at their real coordinates, with the Columbia, Snake, Yakima, Walla Walla and Touchet rivers and US-12. Tap a town to see the drive, your gas cost and its jobs (you can apply right there). After each week your 🛻 drives your commute.

## Scoring

Your Life Score blends average happiness (30%), average health (20%), community standing (20%) and net worth against a target for the game length (30%). You can keep up to 5 lives going: each auto-saves to its own slot after every turn, and the Menu's 💾 Save game and 📂 Load game save to this slot or a copy to another (a checkpoint), or switch to a different life.

## Testing

`npm test` runs seven suites in a real browser (Playwright). CI runs them on every pull request and release, and
each has its own script (for example `npm run test:rules`).

- **Smoke** (`tests/smoke.test.mjs`): the app opens cleanly, the service worker installs, and it opens offline.
- **Game rules** (`tests/rules.test.mjs`): the math, checked directly: pay and taxes, bills, gas, rising prices,
  mortgages and equity, truck loans, the 401(k) and retirement, the Life Score, focus streaks and ruts, Rest's cap,
  event rules (seasons, cooldowns, once-only, layoff risk), the hospital, debt, unemployment, school, kids, net
  worth, save migration, applications and the year in review.
- **Gameplay** (`tests/gameplay.test.mjs`): taps through the core loop: start a game, get hired, end weeks,
  answer an event, skip ahead, save and load, both maps, help and the full tutorial, and the ending screen.
- **Flows** (`tests/flows.test.mjs`): the Life tab (moving, buying, vehicles, 401(k)), quitting and retiring, the
  hospital, the debt ending, family and council, **every choice of every event**, and a Lifetime game to its end.
- **Screens and accessibility** (`tests/screens.test.mjs`): 10 screens at 7 sizes from a 320 px phone to desktop and
  landscape. Fails on content wider than the screen, overlapping or off-screen bars, less than 45% of the screen for
  content, unnamed buttons, tap targets under 44 × 44 px, text under 11 px, or contrast below WCAG AA. Then checks
  keyboard and screen-reader use: Tab and Enter, focus rings, dialogs that trap Tab and close with Escape, map pins,
  Help, the whole tutorial by keyboard, and live announcements. Screenshots go to `test-results/screens/`.
- **Offline and updates** (`tests/offline.test.mjs`): the app caches itself, a life can be continued and played
  offline, and a new version replaces the old one without losing saves or best scores.
- **Play-test simulation** (`tests/sim.test.mjs`): seven bot players (planner, homebody, commuter, student,
  hustler, careless, idle) play full games at every length. It fails on errors or impossible values, and writes a
  balance report to `test-results/balance-report.md` (and the Actions job summary). Use `SIM_SCALE=3` for more
  games and `SIM_DEBUG=1` to see each part of the score.

The dice are seeded, so a failing run fails the same way every time. On a machine without Playwright's own browser,
set `CHROME_PATH` to an installed Chrome.

## Releasing

Releases use the shared [Krazow release kit](https://github.com/krazow/release-kit). In a Claude chat on this
repo, type `/release now` to publish a beta at https://krazow.github.io/The-Burg/beta/, then `/release promote`
to put it live at https://krazow.github.io/The-Burg/. Pushing to `main` doesn't change the live game.
`VERSION` holds the version, and `CHANGELOG.md` the release notes.

## Running it

It's a static site with no build step. Serve the folder over HTTP (for example with GitHub Pages) and open `index.html`. On a phone, use "Add to Home Screen" to install it. The service worker (`sw.js`) caches the app so it works offline.

## Files

- `index.html`: the whole game (markup, styles and logic)
- `manifest.webmanifest`, `icon*.png`, `icon.svg`: install metadata and icons
- `sw.js`: offline cache
- `tools/make-geo.py`: bakes the real Columbia, Snake and Yakima river shapes (Natural Earth 1:10m, public domain) into `index.html`. Re-run it with the folder holding Natural Earth's `ne_10m_rivers_lake_centerlines.geojson` and `ne_10m_rivers_north_america.geojson`.
