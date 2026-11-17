# The Burg: To-do

_Last updated: November 16, 2026_

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
| 1 | **Review and merge the maps PR** (your action) | The map is finished and tested; merging it puts the current game on `main` before releases start. | [PR #1](https://github.com/krazow/The-Burg/pull/1) |
| 2 | **Adopt the shared release kit** | You've turned on Actions and allowed `release/*` and `v*`. This adds the `/release now` → beta → promote flow every krazow app uses. | [#2](https://github.com/krazow/The-Burg/issues/2) |
| 3 | **QA suite: browser smoke + gameplay tests** | The kit's CI runs `npm test` on every PR and release, so these gate every release. | [#3](https://github.com/krazow/The-Burg/issues/3) |
| 4 | **Play-test simulation suite** | Bots play hundreds of full games to catch crashes and bad balance before people do. It also measures the P2 balance work. | [#4](https://github.com/krazow/The-Burg/issues/4) |
| 5 | **First beta release and tester invite** | Gets the game in front of real players at `/beta/`. | [#5](https://github.com/krazow/The-Burg/issues/5) |

- [ ] Merge maps PR — [PR #1](https://github.com/krazow/The-Burg/pull/1)
- [ ] Adopt the release kit — [#2](https://github.com/krazow/The-Burg/issues/2)
- [ ] QA suite: smoke + gameplay tests — [#3](https://github.com/krazow/The-Burg/issues/3)
- [ ] Play-test simulation suite — [#4](https://github.com/krazow/The-Burg/issues/4)
- [ ] First beta release — [#5](https://github.com/krazow/The-Burg/issues/5)

## Soon: P2

- [ ] **Lifetime economy:** savings grow into the millions; add rising costs, investing, family costs — [#6](https://github.com/krazow/The-Burg/issues/6)
- [ ] **Difficulty:** strategy-free bots still score 70–90; tune with the simulation suite — [#7](https://github.com/krazow/The-Burg/issues/7)
- [ ] **Events happen at places on the map** — [#8](https://github.com/krazow/The-Burg/issues/8)
- [ ] **Manual play-test pass on real phones** (iPhone and Android install, offline, resume) — [#9](https://github.com/krazow/The-Burg/issues/9)
- [ ] **Accessibility pass** (contrast, keyboard and screen readers on the maps, reduced motion) — [#10](https://github.com/krazow/The-Burg/issues/10)

## Later: P3

- [ ] **More local content:** town-specific events, seasonal jobs — [#11](https://github.com/krazow/The-Burg/issues/11)
- [ ] **Real river shapes on the region map** — [#12](https://github.com/krazow/The-Burg/issues/12)
- [ ] **Save backup and multiple save slots** — [#13](https://github.com/krazow/The-Burg/issues/13)
- [ ] **Windows and Android builds through the kit** — [#14](https://github.com/krazow/The-Burg/issues/14)

---

## QA plan

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

What has run so far (ad hoc, not yet in the repo): a headless 6-month playthrough, a 16-game simulation across all
four lengths, and a maps walkthrough, all with no errors. Item 1 turns these into the permanent suites.

---

## Done

| Date | What | Where |
|---|---|---|
| Nov 16, 2026 | Built **The Burg**: a turn-based life sim set in Waitsburg with 25 jobs across Waitsburg, Dayton, Walla Walla, Kennewick, Richland and Pasco; housing, vehicles, schooling, about 27 seasonal local events, Life Score, auto-save, installable with offline play. | `main` |
| Nov 16, 2026 | Balance fixes from simulated games: raises capped at +50%, 6 months of unemployment benefits after a layoff, debt warnings. | `main` |
| Nov 16, 2026 | **Weekly turns** and four game lengths (6 months, 2 years, 5 years, Lifetime), with ⏩ 4-week and 13-week skips that stop when something happens; weekly pay and bills. | `main` |
| Nov 16, 2026 | Repo set up, README written, offline cache and version stamp made release-kit compatible. | `main` |
| Nov 16, 2026 | **Map navigation** like Island Time: List/Map toggle, Waitsburg town map that sets your week's focus, region map with real town positions, rivers, US-12, town job cards and a commute truck. | [PR #1](https://github.com/krazow/The-Burg/pull/1) |
| Nov 16, 2026 | Set up this to-do list and its GitHub issues (#2–#14) with priority labels. | `TODO.md` |
