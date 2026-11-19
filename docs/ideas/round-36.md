# Ideas round 36

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 36: Love, conflict and family ties

The ups and downs of close relationships, handled with care: fights about money and time, making up, splits and co-parenting, dating again and blended families, each with a cost that keeps careless play from coming out ahead.

### i36-a01 A rough patch becomes a short story, not one card (M, 🔴)
Replaces the single 50/50 roll in events.js with a chainSet('rough', …) chain like the food truck.
Step 1 picks the cause from state: money < 0, a long work streak, or kids at home.
Files: events.js, features.js (chain helpers).
Balance: doing nothing ends the chain on the worst odds, so idle play loses the partner more often.

### i36-a02 The money talk: one of you spends, one of you saves (S, 🔴)
Fires off S.money and the bills total in turn.js.
Budget together: date nights cost less for 8 weeks. Blame: happy drops. Second job: money up, home weeks down.
Files: events.js, turn.js.
Balance: only shows when money is short, so careless spending triggers it, never good play.

### i36-a03 'You're never home': the overtime argument (S, 🔴)
Reads S.streakF/S.streakN that turn.js already tracks.
Keeping the promise means the next week must be Rest or Community, or it counts as broken.
Files: events.js, turn.js.
Balance: grinding money now has a home-life cost, which keeps all-work play below good play.

### i36-a04 Cool off before you answer (S, 🟠)
A small helper in events.js queues a follow-up card for the next week.
Teaches a real skill: waiting a night often beats deciding hot.
Balance: costs a week of time, not money; repeated cooling off without a follow-through stops working.

### i36-a05 Apologize first, with a small gesture (S, 🟠)
Three choices with $0, $20 and $40 costs in events.js.
Waiting has the worst odds and the lowest cost.
Balance: tiny money cost, small happiness gain; no score bump on its own.

### i36-a06 Couples counseling in Walla Walla (M, 🔴)
Different from the solo 'Talk it out' card: this one needs a partner and runs as a 6-week track like a class (classWeeks style).
Each session attended lifts the chain's odds; skipping two in a row ends it.
Files: events.js, turn.js (weekly track), ui.js (a small 'Counseling 3 of 6' chip).
Balance: costs money and travel; only helps if you show up, so idle play can't use it.

### i36-a07 The chores fight: who does what at home (S, 🟡)
Sets S.chores = 'fair' | 'hired' | 'slide' in events.js; hired adds a monthly bill line in turn.js.
Kids at home make the card show more often.
Balance: small choice, small effect; slide is the idle default and costs the most later.

### i36-a08 A trial separation: eight weeks apart (M, 🟠)
New S.sep = {weeks:8} counted down in turn.js; partner income and date nights pause.
At the end a card offers reconcile (needs a counseling session or two home weeks) or divorce.
Files: events.js, turn.js, ui.js (status on Home).
Balance: costs money (two places to live) and happiness; gives a second chance only to players who act.

### i36-a09 Divorce in Washington: the 90-day wait (M, 🔴)
A 13-week S.divorce track in turn.js with one or two short cards along the way.
Mediation: about $1,500 and less happiness loss. Lawyers: about $8,000 and a bigger drop.
Files: events.js, turn.js, help.js (a plain-language note that WA is no-fault).
Balance: a real money cost on the path; careless play that ignores the relationship pays it most.

### i36-a10 Split the savings, the house and the truck (M, 🟠)
Uses S.mortgage and home value from state.js; buyout adds to the mortgage.
Debts split too, so a player deep in debt sheds half of it, but keeps the stain on happiness.
Files: features.js (sheet), state.js.
Balance: a split always loses money overall (two households), so it is never a shortcut.

### i36-a11 Who keeps the dog? (S, 🟡)
Reads S.dog; 'back and forth' keeps half the dog's happiness bonus in turn.js.
Small, warm and a little sad, without any heavy content.
Balance: just shifts an existing small bonus.

### i36-a12 Pick a parenting plan at the courthouse (M, 🔴)
Builds on the planned co-parenting idea (i6-a21) by making the schedule a choice, stored as S.plan.
Each plan sets the share of kid costs and kid joy in turn.js, and how many handoff cards come up.
Files: events.js, turn.js, ui.js (the Family card shows 'Kids with you this week').
Balance: more time with kids means more cost and more joy; none is free.

### i36-a13 The ex moves to Walla Walla (S, 🟠)
Adds a handoff gas line to the monthly bills in turn.js based on S.plan.
A follow-up card offers the school choice: stay in Waitsburg or move to a Walla Walla school.
Balance: a steady small cost that rewards planning, like a commute.

### i36-a14 Child support on the monthly bills (S, 🟠)
A simplified version of the state worksheet: a share of the gap between your pay and your ex's, per kid at home.
Files: turn.js (bill line), help.js (one short note on how it's figured).
Balance: keeps a split from being a money shortcut; idle players can't avoid it.

### i36-a15 Holidays split: this year, next year (S, 🟠)
Uses the calendar months in events.js (inM) and S.plan.
Even years with you, odd years with them; the Journal notes which.
Balance: off-year choices give small happiness back if you reach out; doing nothing gives a dip.

### i36-a16 Sit together at the graduation (S, 🟡)
A small add-on to existing kid milestone events; reads S.divorced.
Sitting together lifts kid joy; skipping costs happiness and a Journal line you'll see later.
Balance: one card per milestone; no grind.

### i36-a17 Back out there: dating again later in life (M, 🔴)
Adds a cooldown (S.evCd) and new card text in events.js for age 40+ and players who were partnered before.
Later-life dates are slower: two good dates before 'seeing each other'.
Balance: same odds as first-time dating, so it doesn't reward splitting up.

### i36-a18 Dating with kids at home (S, 🟠)
Ties dating to kidsAtHome() and S.plan in state.js.
A later card asks when to introduce the new person to the kids: soon, slow, or not yet.
Balance: adds a cost to dating as a single parent; never a bonus.

### i36-a19 Grange hall dance night for the over-50 crowd (S, 🟡)
A new monthly out-and-about stop in outabout.js / features.js stops list, cost about $10.
For singles 50+, it adds weight to the dating card for the next few weeks.
Balance: small cost, small community and happiness; doesn't stack with other dance stops.

### i36-a20 Moving in together: whose place? (M, 🟠)
A sheet in features.js using S.home and S.mortgage; renting out the second home adds monthly income and repair events.
Combining stuff: a yard sale card brings in a little cash.
Balance: sharing rent saves money; that's real life and costs a little freedom (fewer solo stops).

### i36-a21 Joint account or keep it separate? (S, 🟡)
S.accounts = 'joint' | 'pot' | 'separate' set in events.js.
Joint shows partner pay in your total; separate means you only see your half. The money talk card weighs it.
Balance: no money gain either way, only fewer or more fights.

### i36-a22 A second marriage and a prenup (S, 🟡)
Reads S.kids and the planned will in S.out.will; sets S.prenup.
At the end, the grandkid sheet shows whether the kids' share was kept.
Balance: a $600 lawyer fee; changes inheritance only, never the score directly.

### i36-a23 Two sets of kids under one roof (M, 🟠)
Counts your kids plus step-kids against home size in state.js.
Squabble cards: split the TV, share the bathroom, who gets the front seat.
Files: events.js, state.js.
Balance: room shortage costs happiness; the fix costs money, so neither path is free.

### i36-a24 Your step-kid warms up slowly (M, 🟠)
A 3-step trust track per step-kid stored in S.stepkids, moved by a handful of events.
The last step is a warm milestone with a Journal line.
Balance: each step costs a week or a little money; skipping the cards just leaves things cool.

### i36-a25 The other parent's weekend (S, 🟡)
Three or four short cards in events.js tied to S.stepkids.
Flexible costs a weekend; holding the line costs a little happiness at home.
Balance: small costs either way, no score lever.

### i36-a26 Your partner gets an offer in Spokane (M, 🟠)
Long distance: partner income stays, date nights become monthly drives and a weekly call.
Turning it down: they stay, with a small resentment flag that raises fight odds for a year.
Files: events.js, turn.js. Balance: every path has a cost.

### i36-a27 Long-distance family: a weekly call (S, 🟡)
A light S.calls counter in turn.js; one quick-tap 'Call family' on Home on Sundays.
Every few months the far-away family asks you to visit: a $400 drive or flight.
Balance: free and tiny; skipping only costs a small holiday dip.

### i36-a28 Fly home for a hard week (S, 🟠)
One event in events.js; uses the existing unpaid week or a vacation day logic.
Going adds a Journal line and family standing; staying gets a call card.
Balance: costs money and a week; the payoff is happiness and memory, not dollars.

### i36-a29 Your grown kid's marriage hits a rough patch (S, 🟡)
A late-life event in events.js for players with grown kids.
Watching the grandkids costs a few Saturdays and lifts happiness; taking a side can cool things with your kid.
Balance: no money lever, small happiness either way.

### i36-a30 A sibling asks for a loan, and your partner says no (S, 🟠)
One event in events.js; a lent loan has a chance to come back over the next year.
Going against your partner raises fight odds for a while.
Balance: real money risk; the safe choice costs only a little family warmth.

### i36-a31 Reach out to an estranged family member (M, 🟡)
New S.estranged flag set at start for some backgrounds (a soft random start detail) in state.js.
A two-step chain in events.js: letter, then a coffee in Dayton.
Balance: free but takes weeks; never touches money.

### i36-a32 Empty nest: just the two of you again (S, 🟡)
Fires when kidsAtHome() drops to 0 with a partner, reading state.js.
The hobby choice adds a cheap weekly stop with your partner; drifting raises rough patch odds slightly.
Balance: small effect, pushes active choices over idle.

### i36-a33 Retired together: too much time in the same kitchen (S, 🟡)
Late-life event in events.js for retired couples.
Any active choice gives a small happiness lift; doing nothing gives a small dip.
Balance: keeps retired idle weeks from being the best weeks.

### i36-a34 A split isn't the end of a good life (S, 🔴)
A recovery boost in turn.js for 12 weeks after S.partner goes false, tied to community and rest weeks.
End screen line in ui.js.
Balance: recovery needs active weeks; idle play stays lower. Keeps the loss from dragging a good life under 70.

### i36-a35 Help page: when things get hard at home (S, 🟠)
One new section in help.js, built from the event data where possible.
Plain language, no lectures.
Balance: info only; helps new players avoid the careless spiral.

## Ideas 36: For veteran players

Ideas to keep a dedicated player coming back after many lives: mastery goals, secrets, a town that remembers, and collections.

### i36-b01 Lives-lived rank: Newcomer to Fixture of the Burg (M, 🔴)
A rank that grows with finished lives that scored 55+ and ran 2 years or more: Newcomer, Regular, Old-timer, Fixture of the Burg. It shows on the title screen and in a few greetings.
- New device key theburg.meta.v1 counts qualifying finished lives (state.js store, written from the ending in features.js).
- Title screen (ui.js) shows the rank under the badge row; next rank and how many lives to go on tap.
- Balance: only lives scoring 55+ over 2+ years count, so careless and idle lives never raise it. No score effect.

### i36-b02 A hard goal for each background (M, 🔴)
Each start gets one tough optional goal: Farm kid keeps the farmhouse debt-free for 5 years, Grad pays off the loans early, Transplant reaches community 80, Young parent owns a home when the kid finishes school.
- Add a deep goal to each entry in BACKGROUNDS (state.js) with a test(), checked weekly next to SCENARIOS (features.js).
- A small card on the Life tab; done goals get a gold mark in Your records.
- Balance: a record mark only, no Life Score points.

### i36-b03 Rare combos open secret events (M, 🔴)
About 8 hidden combos open one-time secret events: dog + farmhouse + council seat brings the Grange chair offer; degree + farmhand job brings the extension office visit.
- events.js: a SECRETS table of {test, event}, checked like the normal pool but once per life.
- First time on this device it is tagged Secret in the Journal and the album.
- Balance: mostly story with small stat changes (about ±3), so they are rewards for curiosity, not a score engine.

### i36-b04 Trade mastery across lives (M, 🟠)
Weeks worked at each job add up across all your finished lives. 104 weeks makes you a Journeyman, 520 a Master, shown as a mark on the job card.
- Sum weeks per jobId at life end into theburg.meta.v1; the Jobs list in ui.js shows the mark.
- Masters get a coworker line and a shop-talk event, nothing more.
- Balance: cosmetic and story only, so no pay or hiring edge.

### i36-b05 Banner year: a flawless year badge (S, 🟠)
A new badge for four report cards in the same year that are all 70 or better.
- Add to BADGES in features.js, testing the last four report cards in S.scoreQ.
- Goal points only count if pinned first, as now.
- Balance: careless and idle play cannot hold 70+ for a full year.

### i36-b06 Lessons learned: a new choice for an event that burned you (M, 🟠)
If an event choice cost you a lot in a past life (over $1,000 or 10 stat points), the next time it comes up you get an extra choice: "Remember last time".
- events.js logs heavy losses by event id to theburg.scars.v1; the event sheet adds one extra option.
- The extra choice costs something real (a week's focus or a fee), so it is a trade, not a free pass.
- Balance: lowers the worst outcomes a little, does not add upside.

### i36-b07 Deep-cut events after your 10th life (M, 🔴)
A set of about 12 late events that only show once you have finished 10 lives: talk of the old depot reopening, a 1930s photo of your house, a reunion of the class of '87.
- events.js eligibility checks the lives-lived count from theburg.meta.v1.
- Each is once per device, then joins the normal rare pool.
- Balance: flavor events that net out near zero.

### i36-b08 Your old things turn up at the antique store (M, 🟠)
Paintings, quilts and the old pickup from past lives show up for sale at the antique shop on Main Street with your old name on the tag.
- Save up to 10 named items at life end; outabout.js adds them to the Main Street stop.
- Buying one gives a small happiness bump and a Journal line.
- Balance: costs money, small capped happiness (+3), once per item.

### i36-b09 A hall of fame wall at the museum (M, 🟠)
The history museum has a wall with your best life in each category: longest marriage, biggest net worth, most town goals, oldest at the end, most kids raised.
- Categories come from end-of-life tallies stored with each finished life.
- Shown from Your records (ui.js) and a museum visit in outabout.js.
- Balance: no score effect.

### i36-b10 Your past lives on the October cemetery walk (S, 🟡)
The October history walk stops at up to three headstones from your past lives, each with its end title and the epitaph you picked.
- events.js text for the walk reads the last finished lives from the shelf.
- Only lives that reached at least age 60 get a stone.
- Balance: flavor only.

### i36-b11 Device milestones: weeks lived across every life (M, 🟠)
Every finished life's weeks add up. At 1,000, 5,000 and 10,000 weeks the next life gets an Old-timer Day on Main Street, and the title screen shows the total.
- Total kept in theburg.meta.v1; the event sits in events.js with a one-time flag per milestone.
- Weeks from Auto skips count half; abandoned lives do not count.
- Balance: the event gives a one-time +3 community.

### i36-b12 How close you came: your best life part by part (S, 🟠)
Your records shows your best happiness, health, community and net worth parts from any life against their maximum, and which life set each.
- recordsSheet in ui.js reads the part scores saved with each finished life.
- Gives mastery players a clear ceiling to chase.
- Balance: read-only.

### i36-b13 Race your best life: a ghost marker on the score bar (M, 🟠)
The Life Score so far on Home shows a faint marker where your best life of the same length stood at this week.
- Save the best life's score at each report card; the Home score (features.js) draws a marker.
- Hidden in your first 3 lives to keep early play calm.
- Balance: information only.

### i36-b14 Riddle of the week at the library (S, 🟡)
After 5 lives, the librarian gives one riddle a week that points at a hidden badge or secret combo you have not found yet.
- outabout.js library stop picks an unfound secret and shows its riddle text.
- Riddles written per secret in the SECRETS table.
- Balance: a hint only.

### i36-b15 Purist trophies: Local-only, Carless and Never-in-debt (M, 🟠)
End-of-life trophies for self-set limits, spotted on their own: worked only in Waitsburg and Dayton, sold the truck and walked for 2 years, never dropped below $0.
- Track simple flags in S during the life; the ending (features.js) awards them to a trophy shelf in Your records.
- Each needs at least a 2-year life.
- Balance: harder lives, trophies only, no score.

### i36-b16 Old-hand mode: fewer first-life nudges after 3 lives (S, 🟡)
After 3 finished lives the game quietly drops the beginner toasts, early hints and first-month nudges. A switch in the Menu turns them back on.
- ui.js and help.js check the lives-lived count before showing first-life hints.
- Saves taps for people who know the game.
- Balance: none.

### i36-b17 Rare starts: 1 in 25 lives begins with a surprise (S, 🟡)
Once in a while a fresh start opens with something unusual: you won the fair raffle quilt, an uncle left you a fishing cabin key, or the old pickup has a new engine.
- newGame in ui.js rolls the seeded dice; a small table in state.js.
- Shown on the welcome toast and saved in the life's story.
- Balance: small and mixed (some come with costs), so the average start does not get better.

### i36-b18 A background and mode star grid (S, 🟡)
A grid of every background by Relaxed, Normal and Hard. Each cell gets 1 to 3 stars for finishing with 55, 70 or 85.
- Stored in theburg.meta.v1; shown in Your records (ui.js).
- Gives completionists a clear set to fill.
- Balance: stars only; Relaxed stars marked apart.

### i36-b19 A letter to your next life (S, 🟡)
On the ending screen you pick one of three lines (or write a short one) for your next life. It turns up in the first week of the next fresh start.
- Ending in features.js saves the note; week 1 in turn.js logs it to the Journal.
- Names are escaped like other Journal text.
- Balance: no effect.

### i36-b20 Every week by hand: a no-skip badge (S, 🟡)
A badge for finishing a 2-year or longer life without the skip or Auto buttons.
- Set a flag when a skip is used (turn.js); badge test in features.js.
- Pinning it as a goal still gives the usual 2 points.
- Balance: more taps, not easier play.

### i36-b21 The fortune teller at the fair reads your past lives (S, 🟡)
At the county fair a fortune teller names your last life's title and gives a vague hint about one secret you have not found.
- A once-a-year fair event in events.js, after your 3rd life.
- Reuses the riddle text from the SECRETS table.
- Balance: flavor and a hint.

### i36-b22 A cross-life story: the lost family Bible (L, 🟠)
A six-part story told across lives. Each finished life that does a certain thing (joins the church, visits the archive, restores the farmhouse) finds one page. All six open a final event.
- Page flags in theburg.meta.v1; page events and the finale in events.js.
- The Journal shows found pages; the album lists blanks.
- Balance: pages need good lives (55+), the finale is mostly story with a small keepsake.

### i36-b23 Open the books: exact odds after 10 lives (S, 🟡)
After 10 lives, Help gets an Old-timer's page with exact event odds, layoff risk by job and how each score part is figured.
- help.js builds the tables from the same data the game uses.
- For players who want to master the system.
- Balance: information only.

### i36-b24 Season pennants: a goal for all your lives this real season (M, 🟠)
Each real-world season sets a device goal shared by every life you play, like finish 6 town goals or reach 10 report cards of 70+. Meet it and a pennant goes on the title screen.
- Real date picks the goal (same idea as isoWeek in the weekly challenge); progress in theburg.meta.v1.
- Records show past pennants.
- Balance: needs good-play results, so idle lives add nothing.

### i36-b25 A secret job: grain elevator foreman (M, 🟡)
Become a Master farmhand (see trade mastery) and later lives can see an elevator foreman opening, with its own harvest-week events.
- Add a job to the job list in state.js, hidden until the mastery flag is set.
- Pay sits inside the current farm band.
- Balance: different events, not more money.

### i36-b26 Rare life stamp on the ending (S, 🟡)
If a life's mix of results has never happened on this device (say, no car, council seat and three kids), the ending gets a Rare life stamp.
- Hash a few end tallies and compare with past lives in the shelf (features.js ending).
- Counts only for lives of 2+ years.
- Balance: a stamp only.

### i36-b27 The café regulars use your rank (S, 🟡)
The regulars greet you by your lives-lived rank: "Morning, old-timer". At Fixture of the Burg they save you a seat.
- Text lines in outabout.js and the café events.
- Reads the rank from theburg.meta.v1.
- Balance: flavor only.

### i36-b28 Good-life streak on the title screen (S, 🟠)
Finish lives in a row at 70 or better to grow a streak on the title screen. A life under 55 resets it.
- Streak count in theburg.meta.v1, updated at the ending.
- Best streak kept in Your records.
- Balance: careless and idle lives can only break a streak, never build one.
