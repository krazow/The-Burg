# Ideas round 4

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 4: Stories and seasons

Story arcs, the Waitsburg year, small moments, humor and the Touchet Tattler, so a life in the Burg reads like a story.

### i4-a01 Tattler headlines from your own week (S, 🔴)

- The weekly Tattler line is built from what really happened: your event, the season goal, the river, the harvest check, a new job or house.
- Replace the fixed TATTLER list in js/outabout.js with templates filled from the week's notes, S.run.happened and town state in js/turn.js.
- Falls back to the old lines on quiet weeks.
- Balance: flavor only, no stat change.

### i4-a02 Write a letter to the editor (S, 🟠)

- Some events add a 'Write to the Tattler' choice; next week the paper prints your letter, and the town reacts.
- New choice on town events like the levee, the crosswalk or loose dogs (js/events.js, js/features.js).
- Stored in S.letters; printed by the headline system and kept in the Journal.
- Small community +1 to +2, sometimes -1 if the letter is sharp. Once per season, so it can't be farmed.

### i4-a03 Tattler classifieds you can answer (M, 🟠)

- A want ad in the week summary is a real offer: a cheap used truck, free firewood, a room for rent, a puppy. Answer it from the week sheet before it's gone.
- New CLASSIFIEDS list in js/outabout.js; one offer every 6–10 weeks, good for 2 weeks.
- Answer button in the week sheet (js/turn.js) opens a small choice sheet.
- Balance: deals are a little better than the store but some are lemons; only players who read the summary benefit. Auto play skips them.

### i4-a04 The trunk in the attic (M, 🔴)

- Homeowners find a trunk of old letters from a 1910s Waitsburg family. Over a few months you trace who wrote them and decide where they go.
- A 4-step story chain in js/features.js using chainSet/chainAt: find, read, ask around (library, museum, old-timers), choose: donate, keep, return to a descendant.
- Ends with a Tattler story and storiesDone +1.
- Balance: costs focus weeks on Community; reward is happiness and community, no money.

### i4-a05 The Cardinals make a playoff run (M, 🟠)

- In some falls the high school team gets hot. Follow them week to week, help the boosters, and maybe drive to the state game.
- 3-step chain from 'Friday night game' in js/events.js: booster bake sale, semifinal, state game (trip cost, gas, a day off).
- Win or lose is rolled; the town's mood shows in the Tattler lines.
- Balance: every step costs time or money; reward is happiness and community, capped at one run per 3 years.

### i4-a06 Build a float for the Celebration Days parade (M, 🟠)

- Each spring you can sign up to build a float. Weeks spent on it, your Handy skill and a little luck decide the ribbon in May.
- A spring chain in js/features.js that runs beside the 'Get Celebration Days ready' goal in js/state.js; Community focus weeks count toward both.
- Ribbon goes in the Journal and the Tattler.
- Balance: needs 3+ chosen weeks; careless players never start it. Reward stays small (happy and community).

### i4-a07 Enter something at the county fair (M, 🟠)

- Pick an entry in June (pie, quilt, zucchini, a photo), practice over the summer, and see the judging at Fair & Frontier Days.
- Chain in js/features.js: choose entry, 1–2 practice check-ins, judging in September tied to the existing fair event.
- Uses Cook or Handy skill for the odds; a blue ribbon becomes a Journal milestone.
- Balance: no money prize worth farming; a fun reward for planning ahead.

### i4-a08 Coffee with an old-timer (M, 🔴)

- A retired wheat farmer at the café starts saving you a seat. Over a year he tells the town's history, and in the end he leaves you something.
- Chain of 5–6 short steps in js/features.js, each a story about real Waitsburg history (the flood, the mill, the depot).
- Ends with a gift (his tool chest: Handy practice; or a photo of Main Street in 1950) and a warm goodbye.
- Balance: only starts with Community focus; small happiness each step; nothing a careless player reaches.

### i4-a09 The empty storefront on Main Street (M, 🟠)

- A long-empty building gets a town meeting. Speak up for what goes in, help fix it up, and come to the opening months later.
- 3-step chain in js/features.js; your pick (bakery, hardware, youth center) changes a stand-in business name shown in Out and about (js/outabout.js).
- The new place adds one small weekly option afterward.
- Balance: community and happiness; the new place is a convenience, not a money source.

### i4-a10 Work a whole harvest with a farm family (M, 🟠)

- Sign on for one harvest as a truck driver. A breakdown, a long hot week, the last load, and the harvest dinner.
- A July–August chain in js/features.js that replaces the side-hustle harvest gig (js/state.js) for those weeks instead of stacking on it.
- Choices about rest vs. extra loads move pay and health.
- Balance: same pay band as the harvest gig; the story is the reward. Counts toward the summer town goal like the gig does.

### i4-a11 Letters from a friend who left (M, 🟠)

- A high school friend moved to Seattle and writes every few months. Write back or don't; years later they visit, or move home.
- Letters arrive as a small chain in js/features.js with a Mailbox entry (see the Mailbox idea).
- Writing back costs nothing but a choice; the ending depends on how often you did.
- Balance: tiny happiness each letter; the payoff is a story ending, not score.

### i4-a12 The Sunday phone call (S, 🟡)

- Now and then your mom or dad calls on Sunday with family news: a cousin's wedding, a broken furnace, a question about money.
- A low-weight 'family' event set in js/events.js with short choices (listen, send $100, drive over).
- Hooks into aging parents if that gets built.
- Balance: ignoring calls many times in a row costs a little happiness; nothing to gain by spamming them.

### i4-a13 A Mailbox on Home (M, 🟠)

- A mailbox icon on Home collects letters, postcards, bills, wedding invites and Christmas cards so the week's news feels like mail.
- New S.mail list and a sheet in js/ui.js; events and chains can drop a piece of mail.
- Unread count shown on the icon; old mail moves to the Journal.
- Balance: display only; nothing in it is required to play well.

### i4-a14 Christmas cards (S, 🟡)

- In December, decide how many cards to send. Next December, the cards you get back show who you've stayed close to.
- One December event in js/events.js: send 0, 10 or 30 cards (stamps and cards cost a little).
- Cards back = a count from community and how many you sent last year, shown in the Mailbox.
- Balance: +1 to +2 community at most; idle players get almost none back.

### i4-a15 A shoebox of twelve photos (M, 🟠)

- You can keep at most 12 photos in a life. Big moments offer 'Take a picture'; when the box is full you choose which to keep.
- Photo = emoji scene, caption and date, stored in S.photos (js/state.js), shown in the Journal.
- The ending sheet in js/features.js shows the 12 you kept.
- Balance: no stats. The limit makes choosing part of the fun.

### i4-a16 New Year's resolutions (S, 🔴)

- The first week of January asks for one resolution: save $2,000, walk more, take a class, call home. Keep it through the year for a small reward.
- New January event in js/events.js; progress checked monthly in js/turn.js and shown on Home.
- Kept: happiness +4 and a Journal milestone. Broken: a joke line in the Tattler.
- Balance: each resolution needs real choices; idle and careless play won't keep them.

### i4-a17 A line about the weather and the land (S, 🔴)

- Each week summary opens with one line about the valley: wheat turning gold, the first frost, Sweets at the stand, snow on the Blues.
- A WEEK_LINES table by month in js/turn.js, picked by week of the month.
- No new system; gives every quiet week a sense of place and season.
- Balance: text only.

### i4-a18 The long winter (M, 🟠)

- January and February bring cabin fever. Happiness drifts down unless you get out: Bluewood, a potluck, a class, friends over.
- A winter drain in js/turn.js, shown as a gentle note on Home; any social or outdoor focus or trip stops it for the week.
- Hard mode makes it a bit stronger; Relaxed turns it off.
- Balance: hits idle play most (helps keep idle <= 50); good play barely notices.

### i4-a19 Celebration Days as a planned weekend (M, 🔴)

- The May Celebration Days event becomes a small schedule: pick 2 of 4 things (parade, horse races, the street dance, the car show) and see how the weekend plays out.
- Upgrade the existing 'Celebration Days' event in js/events.js to a two-pick sheet; same pattern for Fair & Frontier Days in September.
- Each pick has its own small effect and Journal line.
- Balance: total gain about the same as today's event; the change is choice, not more reward.

### i4-a20 The goat that won't be caught (S, 🟡)

- Every so often the Tattler reports another sighting of a loose goat around town. Years later, someone finally catches it. Maybe you.
- A running gag: 4–6 sighting lines spread over years in the headline system; a final once-per-life event in js/events.js.
- Catching it: a Tattler photo and a laugh.
- Balance: +1 community at the end; pure humor.

### i4-a21 Sheriff's log in the Tattler (S, 🟡)

- Funny small-town police log lines: a cow on the highway, a suspicious man who was a scarecrow, a raccoon in the bank's drive-up.
- A SHERIFF_LOG list mixed into the weekly Tattler line in js/outabout.js.
- Now and then one involves you, based on your week (a speeding ticket, a stranded driver).
- Balance: text only.

### i4-a22 The old pickup's last ride (S, 🟡)

- Your 1998 pickup gets a name and little comments over the years. When you sell it or it dies, there is a short goodbye.
- Name chosen at start or first repair; a few lines in vehicle events in js/events.js.
- A goodbye moment when you replace it (Life tab, js/ui.js), saved to the Journal.
- Balance: no stat effect beyond a small happiness bump on the goodbye.

### i4-a23 A last walk down Main Street (M, 🔴)

- In the final week, before the score, you walk the town map. Each place that mattered lights up with one line you remember from your life there.
- Uses maps.js pins and the Journal (S.log) plus event pins (S.evPins) to pick up to 8 places.
- Plays as a short tap-through, then the ending sheet in js/features.js.
- Balance: no score effect; it makes a full life feel finished.

### i4-a24 Unfinished business (S, 🔴)

- About 8 weeks before a set-length game ends, a note lists stories, goals and the season goal that can still finish in time.
- Reads S.chains, pinned life goals and seasonGoal() in js/state.js; shows on Home and in the week summary.
- Lets players aim their last weeks at endings that feel earned.
- Balance: only helps players who act on it; adds nothing to idle play.

### i4-a25 The school bond vote (M, 🟠)

- The school district asks for a bond. Campaign for it, against it, or stay out; the vote decides if Waitsburg gets a new gym for later years.
- Spring chain in js/features.js; your work shifts the odds; result saved in S.town.
- A yes vote raises property taxes a little for owners and opens a gym option for kids and Community focus.
- Balance: costs time or money either way; the town-wide effect is small.

### i4-a26 A town story that spans years (L, 🟠)

- Each long life gets one big town saga, picked from three: save the old grain elevator, restore the depot, or rebuild the town pool.
- A 6–8 step chain over several years in js/features.js; steps wait 20–40 weeks and remember your flags.
- Ends with a dedication, a lasting change on the town map (js/maps.js) and a Tattler front page.
- Balance: large happiness and community at the end only for players who stayed involved; skipped steps let the town finish it without you.

### i4-a27 Little firsts (S, 🟡)

- One-line moments the first time something happens: first paycheck, first key to your own place, first wave from a passing truck.
- A FIRSTS table checked in js/turn.js; shown as a toast and kept in the Journal.
- About 15 firsts, each once per life.
- Balance: no stats.

### i4-a28 The dry summer (M, 🟠)

- Some summers there's no rain. A burn ban, water limits, a field fire on the hills, and a thin harvest check.
- A rare multi-week chain in js/features.js tied to the wheat lease payout (js/features.js BIZ) and the harvest goal.
- Choices: help the fire crew, conserve, pay for water; affects health, community and the lease check.
- Balance: a setback that rewards preparation (savings, insurance if built); never more than once every 5 years.

### i4-a29 The reporter's big story (M, 🟡)

- If you work at the Tattler, one year you chase a real story: where did the Christmas lights budget go?
- Job-only chain in js/features.js for the reporter job (js/outabout.js).
- Dig in, drop it, or go easy on a neighbor; outcome shapes a raise and community.
- Balance: same pay band as other job events; only one per life.

### i4-a30 A year ago today (S, 🟡)

- Once a season the Journal shows a 'one year ago' card from your own life: the job you started, the storm, the ribbon.
- Picks a milestone entry from S.log close to the same date last year; shown on Home in js/ui.js.
- Needs only the existing Journal.
- Balance: text only.

### i4-a31 A time capsule at Celebration Days (M, 🔴)

- Your first May, the town buries a time capsule. You add a note with three hopes for your life. It's opened at the end, and you see which came true.
- Hopes picked from life-goal-like options (own a home, a ribbon, a business, a family, $X saved) in js/features.js.
- Opened on the ending sheet before the score, or after 10 years in Lifetime games.
- Balance: happiness only, no score bonus, so it doesn't double the pinned life goals.

### i4-a32 Gossip at the café table (S, 🟠)

- Old-timers' gossip in the week summary hints at what's coming: the river's up in the hills, layoffs at the plant, a good wheat year.
- The hint is written when certain events become likely in js/events.js (high water, layoffs, harvest odds).
- Shown as a café line under the Tattler line.
- Balance: rewards players who read and plan; no effect on Auto or idle play.

## Ideas 4: Challenge and new modes

Ways to make the game harder, fairer and more varied: tougher modes for strong players, recovery for struggling ones, small bets and minigames, and new ways to play.

### i4-b01 Heat levels above Hard (M, 🔴)
- Unlocks per length after a Hard score of 70 or more; each heat level adds one chosen rule from a HEAT table.
- Rules are small flags read in turn.js (bills, events weights, layoff roll) and events.js.
- Best scores are kept per heat level (bestKey gets a heat suffix), and the score card shows the flame count.
- Balance: heat only makes things harder, never adds score, so it can't lift careless play.

### i4-b02 Ironman lives (S, 🔴)
- A toggle under More options on the title screen; sets S.ironman.
- The Menu's Save game / Load game hide copy and checkpoint for this slot (ui.js); restore from a backup marks the life as no longer Ironman.
- Badges and best scores record the ribbon; nothing about play changes.
- Balance: no rule changes, so score targets are untouched.

### i4-b03 House rules you set before you start (M, 🔴)
- A HOUSE_RULES table in state.js with a check() per rule; ui.js shows them under More options.
- turn.js checks each week; breaking one shows a quick note and drops that pin (the life goes on).
- Pins are bragging rights only; Life Score is unchanged.
- Balance: rules only limit you, so careless and idle bots score the same or lower.

### i4-b04 Contracts on the bulletin board (M, 🔴)
- New CONTRACTS in features.js, offered from the bulletin board spot on the town map (maps.js).
- Progress counts weeks of a matching focus (hustle, community or outdoors), like season goals.
- Pay rises with prices and with the handy skill; one contract at a time.
- Balance: a missed deadline costs community 4, so taking every contract carelessly scores worse than taking none.

### i4-b05 A comeback arc after a hard fall (M, 🔴)
- A story chain in events.js (chainSet/chainAt) with steps like physical therapy, a friend's couch, the unemployment office in Walla Walla.
- Each step offers a cheap slow path and a costly fast path.
- Like other badges, it adds +2 only if you pinned it as a life goal beforehand.
- Balance: the arc never pays more than the fall cost, so falling on purpose never helps.

### i4-b06 Hospital bills: payment plan or charity care (S, 🟠)
- Replaces the lump sum in turn.js's hospital branch with an event and a small S.medPlan like the truck loan.
- Charity care checks pay against a threshold; the form costs a week's focus at 75%.
- Balance: the bill total is the same or lower, but only for those who already struggle; a well-paid player still pays in full.

### i4-b07 Bigger money brings bigger asks (M, 🔴)
- An event tier in events.js unlocked at net worth bands (50k, 250k, 1M); amounts scale with net worth, not just prices.
- Each has a smart choice that limits the damage (insurance, saying no kindly, a lawyer).
- Helps review item B1: careless long games stop coasting on pay growth.
- Balance: good players who plan lose little; careless ones lose more. Re-run the sim.

### i4-b08 Custom mode: set your own sliders (M, 🟠)
- MODES gains 'custom' with S.custom holding the five numbers; turn.js reads them where it now reads mode().
- A sheet in ui.js with presets (Relaxed, Normal, Hard) to start from.
- Balance: Custom scores never count as Normal bests or toward unlocks.

### i4-b09 Mode check-in at the end of year one (S, 🟠)
- A line in the year-in-review sheet (features.js) with one button.
- Switching up to Hard is free; switching down to Relaxed moves the life to the Relaxed shelf for good.
- Balance: dropping down can't be used to protect a Normal best.

### i4-b10 A gentle first season on your first life (S, 🟠)
- A flag set in newGame (ui.js) when no lives or bests exist yet; turn.js and events.js check it.
- Not offered for challenges, weekly or Hard.
- Balance: 13 weeks of 26+ is too short to move a careless or idle score past the targets; check with the sim.

### i4-b11 One do-over a year (S, 🟠)
- Keep one snapshot of S before each End Week (turn.js); a Menu button restores it and spends the token.
- The score card notes how many do-overs you used.
- Balance: event dice reroll, so a do-over helps escape one bad week, not farm good ones.

### i4-b12 Stake a life goal (S, 🟠)
- A toggle on pinned goals (features.js GOALS); end screen adds or subtracts.
- Max one staked goal per life.
- Balance: careless and idle play rarely meet goals, so staking lowers their median; good players gain at most 2 more.

### i4-b13 Push your luck at harvest (M, 🟠)
- A small sheet when the hustle gig is harvest (GIGS in state.js), shown once a week, skippable (skip = safe default).
- Up to 5 rounds; the odds show on each button.
- Balance: expected value is slightly positive only with good health, negative when tired, so grinding when worn out hurts.

### i4-b14 Go all in on a week (M, 🟠)
- A toggle on the focus card (ui.js); turn.js multiplies the focus and rolls the backfire.
- Backfire odds rise when health is under 50; can't be used two weeks running.
- Balance: expected gain is about even at full health and negative when worn, so mashing it doesn't help careless play.

### i4-b15 Small bets at the Days horse races (S, 🟡)
- A seasonal event in events.js with a small bet picker; results logged in the Journal.
- Hard cap per year; 21+ only.
- Balance: negative expected value, so betting every year lowers net worth a little.

### i4-b16 Grange raffle tickets (S, 🟡)
- A once-a-year event in events.js; tickets $5 each, max 10.
- Balance: standing gain is tiny and capped; money spent is a loss on average.

### i4-b17 Fishing the Touchet: a quick tap game (M, 🟠)
- A small canvas or button game in features.js, launched from the week results strip; respects reduced motion.
- Fish types follow the seasons (steelhead in winter, trout in summer).
- Balance: max +2 happiness, and skipping gives the average, so it's never required and bots aren't hurt.

### i4-b18 Pie and preserves at the fair (S, 🟡)
- A summer event with three picks; judge preferences seeded per life (rngEv).
- Ribbons go on the keepsake shelf; the cook skill improves your odds.
- Balance: rewards are a ribbon and +2 community at most.

### i4-b19 Kitchen-table bills when money is short (M, 🟠)
- Triggered in turn.js when money would go under a line; a sheet in ui.js with four rows.
- Late rent risks a notice, a late truck payment risks repossession, late power adds a fee.
- Balance: a hardship you manage, not a free pass: each choice costs something, and smart triage only limits the damage.

### i4-b20 Puzzle weeks (M, 🟠)
- A PUZZLES table of fixed states and scripted events in features.js; a Puzzles button on the Challenges sheet.
- Three stars per puzzle; no effect on any life.
- Balance: separate from lives and scores.

### i4-b21 Speedrun goals: fewest weeks (M, 🟠)
- New SCENARIOS entries with a speed:true flag; the end screen shows weeks taken and your best.
- Fixed dice per goal so runs are fair to compare.
- Balance: separate records; doesn't touch Life Score.

### i4-b22 Porch mode: a sandbox (S, 🟡)
- A mode flag that hides the score and disables badges, bests and challenges.
- Setup sheet in ui.js; saves go in a normal slot with a porch label.
- Balance: no score, so nothing to exploit.

### i4-b23 Blitz: a clock on every week (S, 🟡)
- A timer bar in ui.js; turn.js already handles a default focus.
- 6-month length only; its own best score.
- Balance: separate bests; the default choices are the same ones careless bots use.

### i4-b24 The Joneses: a rival life next door (M, 🟠)
- Reuse the simulation bot's choices (tests sim) as a small in-game player with its own state and dice.
- Pick an easy, steady or sharp rival.
- Balance: no score change; beating the sharp rival is a badge only.

### i4-b25 Two households, one town (L, 🟡)
- Two state objects in one save; End Week switches players (ui.js header shows whose turn).
- Shared town goals in state.js count both players' focus.
- Different from Family night (one shared life).
- Balance: help between players is capped so one can't carry the other's score.

### i4-b26 Dynasty: a family score across generations (L, 🟠)
- Builds on legacySheet in features.js: a dynasty record that sums each life and tracks family goals.
- A dynasty shelf on the title screen.
- Balance: each life's own score is unchanged; the dynasty score averages lives, so one strong life can't carry weak ones.

### i4-b27 Sheriff's auction fixer-upper (M, 🟡)
- A rare event for players with savings; a sealed bid sheet; the condition rolls after you win.
- Uses HOMES and the mortgage code; the handy skill cuts repair costs.
- Balance: fair price on average; a bad roll is a real loss, so it's a bet, not free equity.

### i4-b28 Hard hides the exact numbers (S, 🟡)
- A display switch where choice effects are shown (events.js / ui.js), read from mode().
- Balance: makes Hard harder for good players without changing any math.

### i4-b29 A grit rating for harder lives (S, 🟡)
- A small function in features.js using BACKGROUNDS, MODES and rules.
- Shown on the end screen and score card.
- Balance: display only.

### i4-b30 Big seasonal tests you can prepare for (M, 🟠)
- A warning card on Home; prep counts weeks of matching focus (outdoors, community, rest) plus a stock-up trip.
- The test hits as an event with damage scaled by prep.
- Balance: careless players take the full hit; good planners take little. Beginners get a plain warning.

### i4-b31 The sim plays every new mode and rule (S, 🟡)
- Extend the simulation in tests with bot policies for each new option.
- Hard limits: careless median 60 or less, idle 50 or less, good play 70 or more.
- Keeps every idea in this group honest.
