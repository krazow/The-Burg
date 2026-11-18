# The Burg: To-do

_Last updated: November 17, 2026 (0.2.0-beta.2; Help guide fix; demo videos)_

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

---

## Next up: P1, in order

| # | Item | Why it's next | Issue |
|---|---|---|---|
| 1 | **Add the Android signing secrets** (your action) | The APK builds, but with a throwaway key, so every update would need an uninstall. Add the three secrets (the same key as Bankroll works). | [#37](https://github.com/krazow/The-Burg/issues/37) |
| 2 | **Cut beta 3, try it, then promote** (`/release now` after the secrets, then `/release promote`) | 0.2.0-beta.2 is out ([pre-release](https://github.com/krazow/The-Burg/releases/tag/v0.2.0-beta.2)), but its APK still used a throwaway key, and the Help guide fix (PR #38) came after it. | [#37](https://github.com/krazow/The-Burg/issues/37) |

- [ ] Android signing secrets — [#37](https://github.com/krazow/The-Burg/issues/37)
- [ ] Beta 3 with the signed APK and the Help fix, then `/release promote`

## Soon: P2

- [ ] **Manual play-test pass on real phones** (iPhone and Android install, offline, resume) — [#9](https://github.com/krazow/The-Burg/issues/9)

## Later: P3

- [ ] **More local content:** town-specific events, seasonal jobs — [#11](https://github.com/krazow/The-Burg/issues/11)

---

## QA plan

`npm test` runs seven suites (about 2 minutes); CI runs them on every pull request and release: smoke (5), game rules (26), gameplay (30), flows (18, including every event choice), screens and accessibility (14: 7 rules over 7 sizes × 10 screens plus 7 keyboard and screen-reader checks), offline and updates (6), and the bot simulation. See the README's Testing section.

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
