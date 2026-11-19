# Ideas round 50

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 50: Cut, merge and simplify

The Burg's core identity: **one week at a time, choose how to spend it in a real small town, and balance money against happiness, health and belonging.** Each idea below cuts or merges something that doesn't serve that. Each one says what players lose and what they gain.

### i50-a01 Life goals fold into badges: no pinning, no bonus points (S, 🔴)
Drop the 🎯 pin-up-to-3 life goals and their +2 Life Score each; badges stay as a plain collection.
- Cut: goalsSheet, goalsCard's pin button, goalBonus, GOAL_MAX/GOAL_POINTS, S.goals/S.goalAt (features.js); the bonus line in showScoreNow and lifeScore.
- Keep: BADGES, badgeWeek and the badge toast. The Life tab card becomes "🏅 Badges" with the earned icons only.
- Lose: up to 6 points for careful planners. Gain: one less sheet and one less paragraph in Help (the pin-timing rule needs explaining every time).
- Balance: good-play median drops by about 2–4. Re-run the sim; if good play dips under 70, nudge the community curve, not a new bonus. Careless and idle never pinned goals, so they are unchanged.

### i50-a02 One "Go somewhere" button: Out and about and trips merge (M, 🔴)
Home has two "do something extra this week" entries (🛍️ Out and about and 🚗 Plan a trip).
- Merge: outButton/outSheet (outabout.js) and tripChip/tripPicker/tripSheet (features.js) into one goSheet with a Waitsburg/Region toggle; the trip chip leaves the summary row.
- Lose: a one-tap trip chip. Gain: one button under the focus, one Help section, one mental model ("extras on top of my week").
- Keep the rules as they are (2 visits, 3 stops, same repeat rule); only the doors merge.
- Balance: no change to effects; careless and idle bots use neither.

### i50-a03 Home shows one goal line, not two (S, 🔴)
In a challenge life, Home stacks the challenge line on top of the town goal line above the focus buttons.
- Change: renderHome (ui.js) calls scenarioLine() or seasonLine(), not both; the challenge also shows in the header tag already.
- Lose: the town goal reminder during a challenge (town goals still count and still toast when done). Gain: the focus card starts with the focus.
- Balance: none; town goals still pay the same.

### i50-a04 Life tab starts with your home, ride and money; Around town goes (S, 🔴)
The Life tab opens with life goals, skills, a business pitch and an Around town card before you ever see your home or your ride.
- Change: renderLife (ui.js) order; remove townLifeCard() (outabout.js). The grocery line ("shop local or stock up") moves into the Food and utilities row of the money details.
- Lose: a card that names the bank, clinic, grocery and trades. Gain: the thing you came to the Life tab for is on screen without scrolling (the tab is ~3,100 px tall at 390 px wide today).
- Balance: none.

### i50-a05 Title screen: weekly challenge and records join Challenges (S, 🔴)
The title screen has six buttons under Start (Challenges, Weekly challenge, Your records, Help, Restore) plus a badge emoji row.
- Change: renderTitle (ui.js) loses #weekly, #records and the cross-life badge line; challengesSheet (features.js) gains a weekly row and the records table from recordsSheet.
- Lose: one-tap weekly start. Gain: a title screen that reads Name, Length, Start, More options, Challenges, Help.
- Balance: none.

### i50-a06 Restore from a backup becomes a small link (S, 🟠)
Restoring a backup is a once-per-new-phone action but sits as a full button on every title screen.
- Change: renderTitle (ui.js) swaps the ghost button for a link-styled button with the same id and a 44 px tap area.
- Lose: nothing. Gain: one less big button on the first screen.
- Balance: none.

### i50-a07 Challenges become a goal on a starting background (M, 🟠)
Each challenge is a background plus a goal (Save the family farm = Farm kid + buy the farmhouse; Single parent = Young parent + a target).
- Change: SCENARIOS (features.js) move onto BACKGROUNDS (state.js) as an optional goal; scenarioWeek and scenarioLine stay, challengesSheet goes. "From the wheat to the lab" and "Debt-free" sit on Fresh start as two goal choices.
- Lose: a separate menu of named challenges. Gain: one start-up system ("how your life begins"), not two that overlap.
- Balance: goals keep their own record line, so they never mix with Normal bests. If a5 is built first, a7 replaces its sheet with records only.

### i50-a08 Hard becomes a challenge; the Mode picker and Relaxed go (M, 🟠)
Three modes, five backgrounds, four challenges, a weekly and legacy are a lot of start variants.
- Cut: MODES picker in renderTitle, mode tags, modeScoreNote, the -mode keys in bestKey/bestLabel (state.js, features.js). Hard's rule set stays behind S.mode for the challenge.
- Lose: Relaxed (debt never ends it). Gain: one less choice before you play, a records table with one row per length, and simpler Help.
- Old saves in Relaxed keep their mode (migrate leaves it); only new lives can't pick it.
- Balance: Relaxed scores were kept apart, so the Normal targets are untouched.

### i50-a09 Two skills, not four: Cook and People go (M, 🟠)
Cook levels up from Rest and People from Show up for town: they reward focuses that already pay off, and add a card row each.
- Cut: SKILLS.cook and SKILLS.people, their practice() calls in skillWeek, the food discount and the apply-odds bonus (features.js, ui.js apply). The food truck's Cook boost goes with a10.
- Lose: a 4–12% food discount and slightly better job odds. Gain: the Skills card halves and every skill means "what you learned to fix".
- Balance: Cook levels while resting, so idle play loses a small edge (helps keep idle <= 50). Good play loses a few dollars a week; check the sim.

### i50-a10 The food truck business goes (M, 🟠)
The food truck only earns in Side hustle weeks, so it is a pricier Side hustle, and the friend's food truck story uses the same name for something else.
- Cut: BIZ.truck (features.js), its Help line and any business events tagged truck. Saves that own one get it sold at bizValue() with a Journal line.
- Lose: a third business. Gain: "Side hustle" means one thing, and the truck story stops colliding with a business you own.
- Balance: the hustler bot loses its best summer earner; check it still clears 70 with the shop.

### i50-a11 Wheat lease without the renewal rule (S, 🟠)
The lease runs 5 years, renewing costs a quarter of the price, and there are 8 weeks of grace: a paragraph for one business.
- Cut: LEASE_WEEKS, LEASE_RENEW, LEASE_GRACE, leaseDue, renewLease and the Renew button (state.js, features.js, ui.js). Multiply BIZ.wheat.yearly by about 0.95 instead.
- Lose: a once-in-5-years decision. Gain: the card says "pays once a year at harvest" and nothing else.
- Balance: same money over 5 years; sim check that the lease is still worth less than a good job.

### i50-a12 Businesses sell for half, with no yearly wear (S, 🟡)
A business is worth 60% of its price, minus 5% a year as it ages.
- Cut: BIZ_DEP and S.biz.dep (state.js, features.js bizValue). Help line becomes one short sentence.
- Lose: a slow decline nobody watches. Gain: a rule you can say out loud.
- Balance: a 10-year-old shop is worth a little more than today; net-worth impact is small (under $1,000 in most lives).

### i50-a13 Out and about loses its hidden boosts (S, 🟠)
A haircut quietly lifts job odds for 2 weeks, a paper ad lifts hustle pay 15% for 8 weeks, and the jam is open every other week.
- Cut: LOOK_WEEKS, AD_WEEKS, AD_BOOST, outAdBoost, S.out.look/ad, jamWeek gating (outabout.js); the "Little extras" bullet in Help.
- Lose: three tricks only Help readers find. Gain: every place reads the same way, and Help's Out and about section shrinks by a third.
- Balance: hustle pay drops slightly for players who bought ads; careless and idle never did.

### i50-a14 Three skip buttons become two (S, 🔴)
The end bar has End Week, ⏩ 4, ⏩ 13 and ⏭ Auto.
- Cut: #ff13 in render (ui.js), its Help and tutorial mentions, and the screens test that sizes it.
- Lose: an exact quarter skip. Gain: a roomier end bar on a 320 px phone and one less thing to explain.
- Balance: none; Auto already stops on events and red stats.

### i50-a15 Home warnings collapse into one heads-up card (S, 🟠)
Home can stack five yellow cards (no job, low happiness, low health, overtime, debt).
- Change: renderHome (ui.js) builds the warnings into a list, sorts by urgency (debt, health, happiness, job, overtime) and renders the first.
- Lose: seeing every warning at once. Gain: the focus buttons stay above the fold even in a bad week.
- Balance: the urgent one still shows with its one-tap fix, so careless play gets the same nudge.

### i50-a16 The summary chip row on Home goes (S, 🟠)
The row under the focus card (job, home, ride, school, trip) repeats the tab bar.
- Cut: the .sumrow card in renderHome (ui.js) and its CSS.
- Lose: one-tap jumps to the Jobs and Life tabs. Gain: Home ends at the focus card; the tab bar already does the jumping.
- Balance: none.

### i50-a17 The report card log line goes; the score arrow compares to last year (S, 🟠)
Every 13 weeks a "📋 Report card" line lands in the Journal and resets the ▲▼ on the score button.
- Change: turn.js drops the S.turn % 13 block; S.scoreQ is set when the year in review is built; showScoreNow says "Last year: N".
- Lose: a quarterly number in the Journal. Gain: fewer Journal lines and one less rhythm to learn. In a 6-month game the arrow compares to the start.
- Balance: none (display only).

### i50-a18 Score so far measures net worth against where you should be by now (S, 🟠)
Mid-game, the net worth part of Life Score so far is low because it compares you with the end-of-game target, so a second row ("Net worth on track?") explains it.
- Change: showScoreNow and scoreButton (features.js) use real / (target × gameProgress()) for the wealth part while S.over is false; remove wealthTrack. The final score is unchanged.
- Lose: seeing the end-of-game wealth part early. Gain: one honest number instead of a number plus a caveat.
- Balance: the final score is untouched; only the mid-game display moves.

### i50-a19 Household card drops the price index and empty council row (S, 🟡)
"Prices since 2027 +6%" and "Town council —" sit on the Household card for every player.
- Change: renderLife (ui.js) Household card; showRunDetails (turn.js) gains one line about prices.
- Lose: nothing. Gain: Household is about the people in it.
- Balance: none.

### i50-a20 Journal filters: All and Milestones only (S, 🟠)
The Journal has five filter chips (All, Money, Events, Milestones, Trips).
- Change: LOG_FILTERS (ui.js); logKind can stay for the year in review.
- Lose: a money-only and trips-only view. Gain: a chip row that fits any phone and one less control.
- Balance: none.

### i50-a21 Menu: Save, Load and Back up merge into one "Your lives" sheet (S, 🟠)
The Menu has 💾 Save, 📂 Load and 📤 Back up as three primary buttons for one idea (where your lives are kept).
- Merge: saveCopySheet, loadSheet and backupSheet entry points (ui.js) into one sheet; Menu goes from 7 buttons to 5.
- Lose: a direct Load button. Gain: one place for everything about saves, which Help can explain in three lines.
- Balance: none.

### i50-a22 Jobs tab: one town picker, locked jobs tucked away (S, 🟠)
The Jobs tab opens with 9 chips (List, Map, Can apply, All towns and six towns) before the board.
- Change: renderJobs (ui.js); jobOK defaults to true; town chips become a native <select> (keyboard and screen-reader friendly).
- Lose: seeing every out-of-reach job at once. Gain: the board starts near the top of the screen.
- Balance: locked jobs still say what they need when shown, so planners can still aim for them.

### i50-a23 Carpool turns on by itself (S, 🟡)
Joining a carpool has no downside (half the gas, less wear, a little community), so it is not a real choice.
- Change: syncCarpool/canCarpool (state.js) set S.carpool; remove the Carpool card and button from renderJobs (ui.js).
- Lose: a button. Gain: one less card on Jobs and a rule that just happens.
- Balance: careless players who never found the button now get it, a small lift (roughly +1). Re-run the sim; if careless creeps over 60, raise the community gate to 35.

### i50-a24 Badges trimmed from 18 to 12 (S, 🟠)
Some badges come for free (First paycheck, Retired in Lifetime) or repeat other systems (Town helper counts town goals; Good dog and Family are single events).
- Cut: job, retired, helper, dog, family and paidoff from BADGES (features.js). Earned ones in the cross-life store stay hidden, not deleted.
- Lose: easy early badges. Gain: each badge means something, and the collection fits on one line.
- Balance: none (badges carry no points after a1).

### i50-a25 Help: 19 sections become 11 (M, 🔴)
Help has 19 sections.
- Change: the section list in help.js; each merged section keeps its content minus repeats; anchors (#g-…) used by the tutorial and STATINFO links are redirected.
- Lose: some one-topic jump links. Gain: a contents list that fits one phone screen.
- Balance: none.

### i50-a26 Help drops its data tables (S, 🟠)
Help prints the full list of places with hours, every badge, and a job table by town.
- Cut: the PLACES table and the "names are stand-ins" footer move to one short line, the BADGES table goes, the job/pay table goes (help.js).
- Lose: browsing everything from Help. Gain: Help reads in minutes, and stops going stale when data changes.
- Balance: none.

### i50-a27 Story chains become an event field, not their own system (M, 🟡)
Three stories (fixer-upper, food truck, levee) use their own chain/chainAt/chainSet helpers.
- Change: STORY_EVENTS (features.js) use the same once/cooldown/when fields as EVENTS (events.js); S.chains becomes S.after; migrate maps old steps.
- Lose: nothing for players. Gain: writers add a story the same way as any event, and Help stops calling "stories" a separate feature.
- Balance: same odds and waits; the every-choice flows test covers it.

### i50-a28 Drop from the idea board: live-ops and seasonal content drops (S, 🔴)
The idea list has a run of "seasonal drops", "reruns", "every drop runs through the sim" and dated drop plans.
- Board: tag these ideas dropped (titles about seasonal drops, reruns and drop calendars). Seasonal flavor stays where it already lives: SEASON_GOALS and month-gated events.
- Lose: a content calendar. Gain: no promise of upkeep a solo project can't keep.
- Balance: none.

### i50-a29 Drop from the idea board: deep finance sim (S, 🟠)
Withdrawal-rate pickers, market-panic cards, refinance and bankruptcy bundles, emergency-fund meters and three versions of "will retirement cover the bills".
- Board: keep a single "Will retirement cover the bills?" idea, mark the others dropped or merged into it.
- Lose: finance depth. Gain: money stays one of four parts, which the Life Score already says.
- Balance: fewer money levers keeps good play from out-optimizing on wealth alone.

### i50-a30 Drop from the idea board: leaving the valley (S, 🟠)
Snowbird winters, retiring south and trips well past the Tri-Cities take the player out of the place that is the whole point.
- Board: mark snowbird / retire-south / far-trip ideas dropped. Big trips can stay as a one-off event ("Book it") as they are now in events.js.
- Lose: escape fantasies. Gain: every week is spent in or around Waitsburg.
- Balance: none.

### i50-a31 Drop from the idea board: farm-equipment sim (S, 🟠)
Buying a combine, hay cuttings with rain risk, crop insurance, renting more ground, orchards and wind machines would turn the wheat lease into a farming game.
- Board: mark combine, hay, crop-insurance, orchard and extra-ground ideas dropped. Harvest stays as the summer town goal and harvest events.
- Lose: a farm tycoon path. Gain: the wheat stays the backdrop of a town life, not a second game.
- Balance: avoids a money engine that idle-ish players could run.

### i50-a32 Drop from the idea board: narrator voices and text engines (S, 🟡)
A say() helper with tokens, three narrator voices and variant punchline systems are engine work players never see as features.
- Board: mark say()/narrator/variant-engine ideas dropped; keep "retire the repeated punchlines" as a content edit.
- Lose: generated variety. Gain: text stays readable and easy to check against the real town.
- Balance: none.

### i50-a33 Drop from the idea board: comparing and ranking players (S, 🟡)
Compare-two-lives screens, weekly boards per aim, app-icon badges and streak histories push The Burg toward a leaderboard game.
- Board: mark compare / board / streak-history / icon-badge ideas dropped.
- Lose: competitive hooks. Gain: the game stays a quiet life you play at your own pace.
- Balance: none.

### i50-a34 Drop from the idea board: reworded repeats (S, 🔴)
With about 3,400 ideas over 50 rounds, many are the same thing reworded (retirement checks, badge books, help folding, menu tidies).
- Board: a tools/ script groups /tmp/ideas titles by shared keywords and marks all but one per group "merged into <id>". Nothing is built from it.
- Lose: nothing real. Gain: a board you can actually pick from.
- Balance: none.

**Kept on purpose:** the six focuses, the Life Score's four parts, both maps, town goals, the year in review, legacy and the weekly challenge (moved, not cut). Each one is part of the weekly small-town choice.

## Ideas 50: Small-town drama

The friendly frictions of small-town life, played for warmth and humor, where every spat ends in making peace.

### i50-b01 Friction threads: every small spat ends in peace (L, 🔴)
A shared three-step shape for small-town frictions (spark, simmer, make peace) so each one runs a few weeks and always ends warmly. Peace comes from what you choose, not from waiting.
- New FRICTIONS list in features.js built on chainSet/chainAt, like STORY_EVENTS.
- Each thread has a spark event, one or two simmer check-ins and a peace scene with a small reward.
- Touches events.js (town category), features.js, Journal lines in ui.js.
- Balance: ignoring a thread lets it fade with a tiny community dip; idle play never earns the peace reward.

### i50-b02 The truce dinner: seat two feuding neighbors at your table (M, 🔴)
When two neighbors on your street are at odds, you can host a supper for both. Cook skill and a rest week make it go better; a bad night just means try again in spring.
- Unlocks after any friction thread between two NPCs reaches 'simmer'.
- Costs a rest week and about $40 in groceries; Cook level adds odds of success.
- Touches features.js (chains, skills), turn.js (rest week hook).
- Balance: +community and +happy only on success; needs an active choice, so idle play skips it.

### i50-b03 The old-timers' bench at the grocery has a verdict (M, 🔴)
Three regulars on the bench outside the grocery give a one-line take on your week: a new truck, a long commute, a skipped Celebration Days. Gentle ribbing, never mean.
- A weekly line in the week summary, picked from what changed (purchase, job, focus streak).
- At 65+ with community 60+, you're offered a seat on the bench and start giving the verdicts.
- Touches turn.js (summary notes), ui.js.
- Balance: flavor only, plus a small happy bump when you earn the seat.

### i50-b04 The rumor mill decides you won the lottery (S, 🟠)
Buy a new truck or pay off a loan in one go and the town decides you hit the jackpot. Laugh it off, set it straight at the café, or play along for a week.
- Triggered by any single spend or payoff over a set amount.
- Setting it straight costs a café stop and gives +community; playing along gives happy but invites a few 'loan me $20' asks.
- Touches events.js (town event with a w() weight from S.log).
- Balance: no money gain either way.

### i50-b05 Someone parks in front of your shop every single day (M, 🟠)
With a business, a mystery car takes the spot by your door every weekday. A note, a plate of cookies or a word at the post office reveals it's the new nurse who works nights.
- A friction thread for players with S.biz (shop or food truck).
- Each step is a choice; the kind ones lead to a new regular customer.
- Touches features.js (BIZ, chains), events.js.
- Balance: the friendly ending pays a small weekly bump for a few months; the angry note just ends it with −community.

### i50-b06 The council meeting that won't end (S, 🟠)
You go to hear one item and sit through three hours on a stop sign, a dog park and the pool's paint color. Stay to the end or slip out before the vote you came for.
- Town event; the item you came for is always last.
- Staying costs some happy and health (late night) but gives +community and a say in a small town-goal bonus.
- Touches events.js, features.js (town goals).
- Balance: leaving early costs nothing but forfeits the bonus; different from speaking up, this is about sitting it out.

### i50-b07 The newcomer who wants to change everything (L, 🔴)
A new arrival from the west side wants a roundabout on Main, a new festival name and a mural on the grain elevator. Over a few months you help them find one idea the town loves.
- A five-step story chain: the big list, the town grumbles, a quiet coffee, a small project, the newcomer's first Celebration Days.
- Your choices decide which idea survives; the town goal that season gets a bonus.
- Touches features.js (STORY_EVENTS, town goals), events.js.
- Balance: rewards need community focus weeks; brushing them off ends the chain early with nothing.

### i50-b08 The casserole dish that went home with the wrong family (S, 🟡)
After the church potluck you end up with someone else's dish, masking-tape name half rubbed off. Track down the owner and it leads to a new friend, or keep it and it haunts you.
- Town event in fall and winter; three clues across the week summary.
- Returning it means a café or post office stop and gives +community.
- Touches events.js, outabout.js (stop as clue).
- Balance: keeping it gives nothing and a later 'have you seen my dish' nudge.

### i50-b09 Your mail keeps landing at the other 312 (S, 🟡)
Your neighbor across town has the same house number on a different street. Bills and birthday cards cross paths for a month until you two sort it out over coffee.
- A short chain that delays one bill notice by a week (with a heads-up, not a penalty).
- Ends in a small friendship and an extra holiday card later.
- Touches events.js, features.js (chains).
- Balance: no late fees from the mixup, so it never punishes careless play more than careful play.

### i50-b10 The Christmas lights arms race on your street (M, 🟠)
Your neighbor adds a light-up reindeer, so you add a sleigh, so they add a choir. Stay in or bow out; at the end the whole street does a lights night for the food bank.
- December chain: each round costs a bit of money and power bill.
- Bowing out early is fine; the finale gives +community to anyone who joined the food bank night.
- Touches events.js (December), features.js, the winter town goal.
- Balance: costs scale with each round, so going all in loses money for a small happy gain.

### i50-b11 The rooster next door starts at 4:40 (S, 🟡)
A neighbor's new rooster crows before dawn. Earplugs, a talk over the fence, or trade eggs for a later wake-up spot for the coop.
- Town event in spring; lowers the rest-week health bonus a little until settled.
- The egg-trade choice gives a small weekly food savings for a few months.
- Touches events.js, state.js (rest effect).
- Balance: the dip is tiny and ends by itself after 8 weeks if ignored.

### i50-b12 Sunday morning leaf blowers (S, 🟡)
The neighbor runs a leaf blower every rest week in October. Ask nicely, borrow it and do both yards, or just rake and wave.
- Fall event that only shows in rest-focus weeks.
- Doing both yards gives Handy practice and +community.
- Touches events.js, features.js (practice('handy')).
- Balance: small effects; only active choices help.

### i50-b13 The walnut tree that drops on two yards (M, 🟡)
The big walnut on the property line drops nuts on both lawns. Who rakes, who gets the walnuts, and whose turn is it to trim? Ends in a walnut-bread swap.
- A fall friction thread (not the fence: the tree belongs to nobody and everybody).
- Trimming together costs a hustle week and gives Handy practice.
- Touches features.js (frictions), events.js.
- Balance: the peace scene gives a small happy and food gift; no money swing.

### i50-b14 The firehouse chili feed cook-off (M, 🟠)
Enter the firehouse chili feed. The retired fire chief has won eleven years running. Your Cook skill sets the odds; losing gracefully gets you invited to help next year.
- A once-a-year event in February at the fire hall.
- Entering costs $30; Cook level raises the chance of a ribbon.
- Touches events.js, features.js (skills, badges: new 'Chili ribbon').
- Balance: win or lose, the community gain is the same; the ribbon is only a badge.

### i50-b15 The zucchini hot potato (S, 🟡)
In August neighbors leave zucchini on your porch at dawn. You can pass them on, bake bread, or take them to the food bank before the next bag lands.
- A late-summer event that repeats up to three times.
- Each choice gives a small effect; the food bank choice counts toward the fall town goal.
- Touches events.js, features.js (town goals).
- Balance: free food lowers grocery cost slightly for two weeks only.

### i50-b16 The biggest pumpkin weigh-off grudge (M, 🟠)
Your neighbor has taken the pumpkin weigh-off three years in a row. Grow one yourself from May; water it, guard it from frost, and haul it to the weigh-in in October.
- A season-long project: a garden card in May with check-ins in summer.
- Skipping check-ins shrinks the pumpkin; a weigh-in result in October with a handshake either way.
- Touches features.js (chains, badges), ui.js (garden card).
- Balance: needs active weeks across months; idle play never gets to the scale.

### i50-b17 Somebody sat in your booth at the café (S, 🟡)
After months as a regular, you walk in and a stranger is in your booth. Sit with them, take the counter, or hover. Turns out they're the new teacher.
- Needs 8+ café visits in Out and about.
- Sitting with them unlocks a new named regular.
- Touches outabout.js (visit counts), events.js.
- Balance: small community gain; no money.

### i50-b18 The loose cow on Main Street (S, 🟡)
A cow wanders down Main at 7 a.m. and the whole town comes out to help, advise and argue about whose cow it is. You can help herd, film it, or call the rancher.
- A rare once-per-life town event.
- Herding takes a sick-day-sized bite of health but gives +community and a Journal story.
- Touches events.js (once:true).
- Balance: one-time, small effects.

### i50-b19 The town message board reply-all (S, 🟡)
A post asking 'whose dog is this?' turns into 140 comments about speeding on Preston Ave. Post a calm fix, mute it, or bring a plate of brownies to the next meeting.
- Town event with a stand-in board name ('Burg Chatter').
- The calm post gives +community if your community is 40+, nothing otherwise.
- Touches events.js.
- Balance: muting is free and fine; nothing here rewards piling on.

### i50-b20 The ladder you lent three summers ago (S, 🟡)
You need your ladder back. It's been at a neighbor's since the gutter job three summers ago. Ask, buy a new one, or borrow theirs (which is yours).
- Event shows only if you did a home repair or hustle that week.
- Asking well gives +community; buying costs about $180.
- Touches events.js, features.js (handy skill).
- Balance: the cheapest path is the friendly one.

### i50-b21 The reader board typo at the school (S, 🟡)
The school's sign says 'Congrats Graduats.' Everyone notices; nobody wants to tell the custodian. Offer to fix it, write the paper, or leave it as town legend.
- Late May event.
- Fixing it quietly gives +community; a letter to the paper gives a laugh and a Journal line.
- Touches events.js, the letters page if built.
- Balance: tiny effects, pure warmth.

### i50-b22 The four-way stop debate (M, 🟡)
A neighbor wants a stop sign at your corner; another says it'll back up harvest trucks. You're asked to sign a petition, host a talk, or stay out of it.
- A friction thread with a town-goal tie-in; nothing partisan, just traffic.
- Hosting the talk costs a community week and ends in a compromise (a 'slow' sign).
- Touches features.js (frictions, town goals), maps.js (a sign pin on the street).
- Balance: staying out is neutral; only hosting earns the peace bonus.

### i50-b23 Who leads the Celebration Days parade? (M, 🟠)
The tractor club and the classic car club both claim the front spot. You're on the parade crew and have to sort it before May.
- Needs the spring town goal active and community 40+.
- Choices: coin toss, alternate years, or put the kids' bikes up front.
- Touches features.js (spring town goal), events.js.
- Balance: any fair choice finishes the goal sooner; a careless pick costs one goal step.

### i50-b24 Two bake sales on the same Saturday (S, 🟡)
Both churches booked the same Saturday for their bake sale. Buy from one, both, or help them merge into one big sale next year.
- Town event in March or October.
- Helping them merge makes a new yearly event that shows up in later years.
- Touches events.js, features.js (one flag in S).
- Balance: buying from both costs more; merging needs a community week.

### i50-b25 The newspaper prints a correction about you (S, 🟡)
The weekly paper says you caught a 40-pound trout. You did not. Ask for a correction, or let the legend grow (and get asked about it for a year).
- Follows any outdoors week with a fishing or hiking trip.
- Letting it stand adds a running joke line in later week summaries.
- Touches events.js, turn.js (summary note).
- Balance: no stat change from the legend beyond a small happy.

### i50-b26 The mail carrier skips your box (S, 🟡)
Your dog barks at the mail carrier every day, so now they skip you. Meet them with a treat, fence the dog in, or pick up mail at the post office.
- Needs a dog.
- The post office choice adds a Main Street stop; the treat choice ends with the dog and carrier as friends.
- Touches events.js, outabout.js.
- Balance: a delayed bill notice at worst, with no fee.

### i50-b27 The lemonade stand price war (S, 🟡)
Two kids on your street open lemonade stands across from each other. 50 cents, then 25, then free with a cookie. Buy from both, or broker a merger.
- Summer event.
- Brokering the merger gives +happy and a funny Journal line.
- Touches events.js.
- Balance: costs pocket change; pure warmth.

### i50-b28 The snowplow berm in your driveway (S, 🟠)
Every time you shovel, the plow comes by and fills the end of your driveway again. Wave it down with coffee and the driver starts lifting the blade at your house.
- Winter event after a snow week; a hustle-shovel week counts too.
- The coffee choice lowers the next winter's snow health hit.
- Touches events.js, turn.js (winter effects).
- Balance: a small, one-winter perk.

### i50-b29 The kerfuffle of the week (S, 🟠)
A one-line headline on the Home tab about whatever the town is fussing over this week: the pool hours, a runaway goat, the new paint on the bank. Tap it for a two-line story.
- A list of 60+ lines by month in features.js; one picked each week.
- Some lines link to a friction thread already running in your life.
- Touches ui.js (Home tab), features.js.
- Balance: flavor only, no stats.

### i50-b30 Make-peace cards: the small things that fix a spat (M, 🟠)
When a friction is open, the week planner offers a 'make peace' card: a loaf of bread, help with a chore, or a ride. Each costs a little time or money.
- Shows only with an open friction thread; picking one moves it to the peace scene.
- Touches ui.js (week planner), features.js (frictions).
- Balance: costs a part of the week's focus effect, so making peace isn't free score.

### i50-b31 The garage sale where your old stuff comes back (S, 🟡)
You sell your old lamp at your garage sale; a month later it's at the neighbor's sale with a higher price. Buy it back, laugh, or start a street-wide sale together.
- Needs a garage sale earlier in the life (or a spring event if not).
- The street-wide sale choice gives a small cash bump and +community.
- Touches events.js, features.js.
- Balance: cash is small and capped at once a year.

### i50-b32 Peace at the street party: the year's frictions end together (M, 🔴)
In September, the street throws a block party. Every friction you made peace with that year shows up as a toast; open ones get one last chance.
- Year-end scene for the friction threads; the number of toasts adds to community.
- Touches features.js (frictions), events.js, ui.js (a summary sheet).
- Balance: rewards come only from threads you actively resolved; idle play gets the party but no toasts.
