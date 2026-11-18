# Gameplay analysis and recommendations

_November 18, 2026. Based on the game's code and the bot play-test (104 simulated games, 8 strategies) run while
building Around the region. Tracked under "Soon: Gameplay recommendations" in TODO.md: findings #79–#84 (prioritized) and recommendations #66–#77._

## What the play-tests and the code show

1. **The game has no goals until the very end.** The Life Score only appears when the game ends. Nothing in between
   says "you're on track" or "this year you did X". A careful player (the planner bot) reaches 83–94, but the game
   never tells them that while they're playing.
2. **Long commutes and side hustles don't pay off.** In 5-year games:
   - The bot that takes the best-paying job anywhere (commuter) scores **45**.
   - The bot that mostly hustles scores **40**.
   - The stay-in-Waitsburg bot (homebody) scores **80**.

   A long commute costs happiness every week (Richland, 68 miles, costs about 1.7 happiness a month). A side hustle
   pays $350–$850 a month for health and happiness, which is less than Work extra hours (+15% pay). The Tri-Cities
   jobs and the Hustle focus look like traps.
3. **Long stretches have no decisions.** An event happens in about 1 week in 4 (a 28% chance each week), and
   ⏭ Auto plays up to 26 weeks. Once you have a job, a home and a focus rotation, many weeks are just End Week. Story
   doesn't build up, because every event is a one-off with a cooldown.
4. **Every life starts the same.** You're always 18, renting the room above Main Street with $1,500, a 1998 pickup
   and a diploma. Replays differ only through random events.
5. **Education is the only way to grow.** Classes unlock jobs, but you never get better at anything else. Money only
   goes to four homes, three vehicles and a 401(k): you can't invest, start something or build anything.
6. **One difficulty for everyone.** Doing nothing scores 49 (the target is 50 or below) and careless play scores 53.
   That's right for the default game, but there's no gentler mode for someone who just wants to play, and no harder
   one for players who have mastered it.

## Recommendations

### Features

| # | Recommendation | What it is | Why (observation) | Size |
|---|---|---|---|---|
| #66 | **Life goals and achievements** | Pick 3 goals when a life starts (own the farmhouse, earn a degree, raise a family, win a council seat, retire debt-free…) and earn badges along the way, shown on Home and at the end. | Gives the game targets before the end (1). | M |
| #67 | **Life Score so far** | A live score on Home with the four parts, updated each week, plus a short quarterly report card. | Shows players how they're doing while they play (1). | S |
| #68 | **Story chains** | Events that unfold over weeks: renovating the fixer-upper, helping a friend open a shop, flood recovery after high water, a harvest-season push. Each step depends on what you chose before. | Breaks up stretches with no decisions and builds story (3). | M |
| #69 | **Starting backgrounds** | Choose how your life starts: farm kid (a truck and community, no cash), a grad coming home (a degree and student debt), a transplant from Seattle (savings, no community), a young parent. | Every life plays differently from week one (4). | S |
| #70 | **Fix commutes and side hustles** | Carpools and remote days for long commutes, and a choice of real gigs for side hustles (harvest work, snow plowing, fixing cars) that pay better as you get good at them. | Makes the Tri-Cities jobs and the Hustle focus real options instead of traps (2). | S |
| #71 | **Skills** | Skills that grow with practice, like handy, mechanic, cook and people. Each one opens new choices: fix the truck yourself, cook instead of eating out, better gigs and events. | A second way to grow besides school (5). | M |
| #72 | **Start your own business** | Lease wheat ground, run a food truck at Celebration Days, or sell woodwork. Small, risky, and it can grow. | Something to build with your money (5). | L |

### Styles of play and modes

| # | Recommendation | What it is | Why (observation) | Size |
|---|---|---|---|---|
| #73 | **Relaxed and Hard modes** | Relaxed: gentler drains, no debt ending, more help. Hard: more events, tougher layoffs, rising rent. Saved with each life and shown on the score. | One difficulty doesn't fit everyone (6). | S |
| #74 | **Challenge scenarios** | Set-up stories with a goal, like "Debt-free in 2 years" (start $8,000 in debt), "Save the family farm" or "Single parent". Each has its own win condition and badge. | Gives players focused goals and replays (1, 4). | M |
| #75 | **Weekly challenge and score card** | One shared random seed a week, so everyone gets the same events, plus a shareable score-card image. | Lets friends compare the same life and share results. | M |
| #76 | **Legacy mode** | When a Lifetime game ends, keep playing as your grown kid, who inherits some of your money and your town standing. | Gives a long game a reason to keep going (1, 5). | L |
| #77 | **Season goals in town** | Each season a town goal (help put on Celebration Days, bring in the harvest, the holiday food drive), worked toward with your focus over several weeks. | More decisions during quiet stretches, tied to Waitsburg's calendar (3). | S |

**Suggested order:**
1. The small, high-impact ones first: #67 Life Score so far, #70 commutes and hustles, #69 starting backgrounds,
   #73 modes, #77 season goals.
2. Then the bigger systems: #66 goals and achievements, #68 story chains, #74 scenarios.
3. After that: #71 skills, #75 weekly challenge, and the large ones, #72 your own business and #76 legacy.

Every change to scoring or drains reruns the bot play-test, so careless play stays at 60 or below, doing nothing
at 50 or below, and good play at 70 or above.
