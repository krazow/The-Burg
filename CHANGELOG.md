# Changelog

Release notes for The Burg. `/release now` turns the Unreleased section into a dated `## X.Y.Z (YYYY-MM-DD)`
entry for every release, and the GitHub release notes are taken from it.

## Unreleased

### Added
- The Burg: a turn-based life sim set in Waitsburg, WA. Work at 25 jobs across Waitsburg, Dayton, Walla Walla,
  Kennewick, Richland and Pasco; rent or buy a home, upgrade your truck, take classes, and handle seasonal local
  events. Your Life Score blends happiness, health, community standing and net worth.
- Weekly turns, with 6-month, 2-year, 5-year and Lifetime games, and ⏩ 4-week and 13-week skips that stop when
  something happens.
- Tappable maps: a Waitsburg town map where you pick your week by place, and a region map of the six towns with the
  rivers, US-12, town job cards and your truck driving the commute.
- Auto-save, installable as an app, and works offline.
- A 401(k): save 0%, 5% or 10% of each paycheck before taxes, with a 3% employer match at 5% or more. It grows about
  6% a year and pays out when you retire.
- Family life: start a family (kids cost about $650 a month until they're 18), help a kid with college, and take the
  trip of a lifetime. Partners now bring in a part-time paycheck.
- Releases through the shared Krazow release kit, a beta at `/beta/` for testers, and automated tests: a smoke
  test, gameplay tests and a bot play-test simulation with a balance report.

### Changed
- Prices rise 3% a year and pay rises 2.5% a year, so raises matter. Mortgages and truck loans are locked in when
  you buy, homes gain value, and health care costs start at 50. Lifetime net worth is scored in 2027 dollars.
- The Life Score is rescaled so a middling life lands in the middle: careless play now scores a median of 58
  (it was 78), and good play 85 in 5-year and Lifetime games.
- Community standing is harder to max out, and focus choices count a little less each week.
- An inheritance happens at most once per game. Layoff risk depends on the job (steady public-sector and licensed
  work is safer than retail or seasonal work). Town council runs and stray dogs come up more often.
