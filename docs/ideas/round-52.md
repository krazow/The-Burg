# Ideas round 52

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 52: The first hour

Five new players were played for about an hour each at phone size, and each idea below fixes a moment where one of them might quit, or builds on a moment that hooked them.

### i52-a01 Two "Good first job" tags on the Jobs list in a first life (S, 🔴)
Moment: Ann and Di tapped the top job (airport ground crew, Pasco, 58 mi) because the board sorts by take-home. Their happiness slid from 59 to 37 over 26 weeks.
How: on the first Jobs visit of a first life, tag the two best jobs within 25 miles (take-home minus a happiness penalty for the drive). The tag goes away after the first hire.
Files: js/ui.js (renderJobs), JOBS data in js/state.js.
Balance: it only adds information. Pay and hiring odds stay the same.

### i52-a02 "You're hired" names the drive and what it costs you (S, 🔴)
Moment: the hired sheet says "Airport ground crew in Pasco at $854/wk. Let's go". It never mentions the drive that drags happiness down every week.
How: in apply(), add a line built from commuteOneWay() and the drive time when the drive is 20+ miles.
Files: js/ui.js apply().
Balance: no change to the numbers.

### i52-a03 The first "Work extra" tap says it's overtime on top of your job (S, 🔴)
Moment: a bank teller with no commute picked Work extra every week because it reads like "go to work". Happiness fell from 67 to 27 by week 29.
How: a one-time flag (S.seenOT). The note shows once, under the focus buttons, before End Week.
Files: js/ui.js (focus grid, renderHome).
Balance: idle and careless bots never tap it, so their scores don't move. People who misread the label stop losing points.

### i52-a04 An ignored warning card counts what it has cost (M, 🟠)
Moment: "Overtime 4 weeks in 4 are wearing you down" showed up in week 4 and then sat unchanged for 25 weeks while happiness kept dropping.
How: store the stat value and turn when each warning first shows (S.warnAt). Show the running loss, and add a button that sets the focus the card suggests.
Files: js/ui.js (Home warning cards), js/turn.js (record when each warning starts).
Balance: it only adds information. The fix still costs a week of pay.

### i52-a05 A rejection offers "Spend this week on Town" in one tap (S, 🟠)
Moment: Di (a Seattle transplant, community 5) got turned down on the first try. The tip says "higher Community helps", and then Home sits on Rest with nothing to do.
How: add a button to the rejection sheet in apply() that sets S.focus to community and goes to Home.
Files: js/ui.js apply().
Balance: a Town week pays nothing, so it has a real cost.

### i52-a06 Job cards show your hiring chances in words (S, 🟠)
Moment: transplants and grads apply blind to out-of-town jobs and lose 2 happiness on a rejection, with no idea the odds were worse.
How: pull the odds math out of apply() into hireOdds(id). Use 70%+ / 55%+ / below as the three words.
Files: js/ui.js (apply, renderJobs).
Balance: the odds stay the same. Players just make better choices.

### i52-a07 No happiness loss for a rejection in your first month (S, 🟡)
Moment: Di's first action in the game was a rejection and a happiness drop, a sour first minute.
How: in apply(), skip adj({happy:-2}) when S.turn < 4.
Files: js/ui.js apply().
Balance: at most 4 points in month one. Idle play never applies, so it doesn't benefit.

### i52-a08 End Week asks once when you have no job and haven't applied (S, 🟠)
Moment: with no job, End Week reads "End Week → 🛋️ Rest". A player who skipped the Jobs tab rests away week one and earns nothing.
How: a check in the #end handler, guarded by S.askedApply.
Files: js/ui.js (End Week handler).
Balance: it shows once and doesn't help idle bots.

### i52-a09 Each job card says what the work week feels like (S, 🟠)
Moment: 14 jobs you can apply for are listed with pay and miles only. New players have no reason to pick the reporter over the onion shed except money.
How: add a feel field to each job in JOBS. Show it as a muted line on the job card.
Files: js/state.js (JOBS), js/ui.js (renderJobs).
Balance: text only.

### i52-a10 No event repeats in your first 52 weeks (S, 🔴)
Moment: in one first year, Eve got the Windstorm 3 times, the stray dog twice and truck trouble twice. Bo got the neighbor's moving day twice, and Di got the Little Kiss table twice.
How: in pickEvent(), when S.turn < 52, filter out titles in S.evSeen. If nothing is left, fall back to the full list.
Files: js/events.js (pickEvent), js/state.js (evSeen default).
Balance: the chance of an event each week stays the same, so the sim scores barely move. Check with tests/sim.test.mjs.

### i52-a11 A stray you found a home for stays found (S, 🟡)
Moment: Eve found the stray a home, and a few weeks later the same "scruffy dog follows you home" event fired again.
How: set S.evCd for the stray to S.turn + 104 on that choice, and add a tiny follow-up event.
Files: js/events.js.
Balance: about the same. It's one small event.

### i52-a12 Big repair bills in your first half-year can be split (S, 🟠)
Moment: in week 2, Bo had $587 cash and got a $503 truck repair. Cy got an $884 shop bill. The money goes almost to zero right as new players are deciding whether to keep playing.
How: add a choice on Truck trouble and similar shop events that pushes onto a small S.owed list, which turn.js takes from pay.
Files: js/events.js, js/turn.js (weekly bills).
Balance: the $25 fee makes it cost more overall. Careless play gains nothing.

### i52-a13 A gamble that fails says what the careful choice would have done (S, 🟠)
Moment: Bo picked "Wing it" for the safety inspection and lost $590 with the site shut down for a week. He was never told it was a gamble or what the other choice did.
How: add an optional safe: text to risky choices in WORK_EVENTS and similar lists. Add it to the result only on the bad outcome.
Files: js/events.js.
Balance: no change to the numbers. It teaches the player for next time.

### i52-a14 Event text doesn't claim a past you didn't have (S, 🟡)
Moment: Di's first sight of the event said "You've been trying for weeks" when Di had never been there. Lines like that break the feeling that this is your own life.
How: make the text a function that checks your Out and about visit history. Sweep for other "you've been" lines too.
Files: js/outabout.js.
Balance: text only.

### i52-a15 A new partner's next scene is a good one (S, 🟠)
Moment: "Ask them out" is a big hook (+10 happiness). But the only partner event that can follow is "You and your partner have been arguing a lot lately."
How: set S.partnerAt when they say yes. Gate A rough patch on S.turn - S.partnerAt >= 13, and add a one-time First date event.
Files: js/events.js.
Balance: the first date costs money. Only an event choice can trigger it, so idle play never gets it.

### i52-a16 Cut the longest early event cards to under 35 words (S, 🟡)
Moment: most event cards were 20–30 words. The bluegrass jam card was 52 words before any choice, the longest thing a new player read.
How: rewrite the text, keeping the place facts in OUT_EVENT_BIZ and Help.
Files: js/events.js, js/outabout.js.
Balance: none.

### i52-a17 First lives start the first week of April (M, 🟠)
Moment: a January start opens on "Closed: the winter break until March" cards, snow on Highway 12 and a "Holiday food drive". The best moment in Bo's first hour (Celebration Days) didn't come until week 20.
How: in newGame(), when no life has been finished yet (BEST_KEY empty), set the start date to the first Monday in April.
Files: js/state.js (newGame), check the season logic in js/features.js town goals.
Balance: a full year still passes in 2-year and longer games. Check 6-month scores in the sim.

### i52-a18 January's town goal gets a January name (S, 🟡)
Moment: week one of every life (January 4) opens with a "Holiday" goal for a holiday that has already passed.
How: change the text only.
Files: js/features.js (town goals).
Balance: none.

### i52-a19 Out and about lists open places before closed ones (S, 🟠)
Moment: in January, the first two Main Street cards a new player sees say "Closed: the winter break until March".
How: sort by placeClosed() inside each street group in the Out and about render.
Files: js/outabout.js.
Balance: none.

### i52-a20 Your first birthday comes inside your first year (M, 🟠)
Moment: after 52 weeks, Bo's year in review said "Bo is 18 now", a full year with no birthday.
How: start S.ageMonths at 18y plus 1–11 months so the birthday turn varies. Add a note to the yearly birthday line in turn.js.
Files: js/state.js (newGame), js/turn.js (birthday note), js/turn.js year in review.
Balance: a one-time +2. Check the retirement age math, which reads age().

### i52-a21 A grad's negative net worth says it's mostly the student loan (S, 🟡)
Moment: Cy (Grad coming home) saw a red -$35,111 on Home in week one and a Life Score of 3.
How: check sloan > -netWorth in the Net worth stat tile.
Files: js/ui.js (stat tiles), js/state.js netWorth.
Balance: text only.

### i52-a22 Kept the dog? It shows on Home from the next week (S, 🟠)
Moment: "You have a dog now. Best decision all year." plus the Good dog badge was a real hook for Bo and Di, and then the dog was never mentioned again.
How: add a sumchip when S.dog is set, and a small pool of dog lines for the week strip.
Files: js/ui.js (summary chips, week strip).
Balance: no change. The dog's happiness bonus already exists.

### i52-a23 The week strip counts a town-goal week when it happens (S, 🟠)
Moment: Ann never made a Town or Outside week, and nobody else saw town-goal progress until "Town goal done!" showed up around week 30–40.
How: add a goal tick to the weekstrip data in turn.js.
Files: js/turn.js, js/ui.js (week strip).
Balance: text only.

### i52-a24 Week 13's report card shows itself once (M, 🟠)
Moment: none of the five new players saw a report card in the first hour, because they only go to the Journal. The Home score just ticked up or down with no reason given.
How: in turn.js, when the first report card is written and S.firstRC is unset, show a sheet reusing SCORE_TIPS.
Files: js/turn.js, js/features.js (SCORE_TIPS).
Balance: text only.

### i52-a25 A 6-month ending offers "Keep going to 2 years" (M, 🟠)
Moment: Ann's 6-month game ended at week 26 with a "New best!" just as things got going, with only "Play again" to tap. That's a natural place to quit.
How: in finish(), if S.len is half and it isn't a challenge or weekly run, add a button that sets S.len to two, clears S.over and keeps playing.
Files: js/features.js (finish), js/state.js (LENGTHS).
Balance: the 2-year score uses the 2-year target and averages, so there's no double counting.

### i52-a26 The header says "Year 1 of 5", not "259 weeks left" (S, 🟠)
Moment: Cy's 5-year game showed "259 weeks left" in the header in week one, which makes the game feel endless.
How: format the header text from S.turn and LENGTHS. Keep "weeks left" for 6-month games and the final 13 weeks.
Files: js/ui.js (header).
Balance: none.

### i52-a27 A one-time "Your first month" recap after week 4 (M, 🟠)
Moment: a first month full of small changes (▼1, ▼2) and up to four silent weeks gives no sense of progress. This is the point where a bored new player closes the tab.
How: in turn.js, compare S at turn 0 and turn 4 (save a snapshot), using evPins for the best moment.
Files: js/turn.js, js/ui.js sheet.
Balance: text only.

### i52-a28 A neighbor's porch notes guide your first 13 weeks (L, 🟠)
Moment: the five players hit long quiet stretches (Di had no event until week 9, Cy went 15 weeks between events) with no one in town talking to them.
How: a NOTES table keyed on state (no job, long commute, 4 overtime weeks, never did Town, kept a dog, first paycheck). The note shows in the week strip and opens with a tap.
Files: new block in js/features.js, js/turn.js hook, js/ui.js week strip.
Balance: notes have no stat effects, so idle and careless scores don't change.

### i52-a29 A first-hour retention test with five scripted newcomers (L, 🔴)
Moment: this round's playthroughs were done by hand. A test keeps the first hour good as content grows.
How: reuse the tests/helpers.mjs serve, launch and seedScript helpers. Record each sheet's word count, events and stats, then check them against the thresholds. Write a short report to test-results/first-hour.md.
Files: tests/firsthour.test.mjs, package.json script, the CI workflow.
Balance: the test catches problems. It doesn't change the game.

## Ideas 52: Clubs and organizations

The town's clubs and groups as something you join, show up for, lead and pay dues to, with membership opening small doors around Waitsburg.

### i52-b01 Clubs card: join up to two town groups (L, 🔴)

A Clubs card on the Life tab lists the town's groups (service club, Legion post, garden club, historical society, booster club, ambulance crew, quilt guild, scouts, a congregation) with meeting night, yearly dues and what each opens. Join up to two at a time.

- A new CLUBS table in features.js (key, icon, name, meets, dues, opens, needs) and S.clubs = {key:{since, attend, office}} with a migrate() default.
- Life tab card in ui.js shows each club you belong to, your attendance and any office; a sheet lists the rest with a Join button.
- Needs some groups gated: the Legion post needs a veteran start or family tie, scouts need a kid 7-17, the Chamber needs a business.
- Balance: joining does nothing alone; all value comes from showing up (see meeting nights), so idle play gets only the dues bill.

### i52-b02 Try a meeting before you join (S, 🟠)

Any club lets you sit in once as a guest for free: you see the room, the people and the chores, then decide. No dues, no promise.

- A "Visit a meeting" button on the club sheet costs that week's Show up for town focus and gives +1 community.
- A short flavor line per club (coffee, the gavel, the pie) so each group feels different before you pay.
- Touches ui.js club sheet and a small visit() in features.js. Once per club per life; no balance risk.

### i52-b03 Dues day on the bills (S, 🔴)

Each club adds its yearly dues to the Bills list in its renewal month ($25 garden club to $90 service club). Skip it and you drop off the rolls.

- Dues go through the existing bill lines in turn.js, scaled by the price index like other costs.
- Unpaid dues set the club to lapsed (no perks, no office) with a one-line heads-up on Home.
- Balance: a small, steady cost that careless play forgets; good play budgets it.

### i52-b04 Meeting nights ride on Show up for town (M, 🔴)

Clubs meet once a month. A week of Show up for town in that month counts as making the meeting, and members get +1 extra community and a little happiness that week. Miss the month and nothing happens but your attendance slips.

- In turn.js, when S.focus is community, mark each joined club attended for the month (S.clubs[k].attend++).
- Bonus is small (+1 community, +1 happy per club, max two clubs) and does not stack with a streak past four weeks (focusEffect still applies).
- Balance: rewards a varied plan that drops in on town monthly, not grinding community every week.

### i52-b05 Lapsed: three missed meetings and you're off the active list (S, 🟠)

Miss three meetings in a row and the club moves you to "on the rolls": you still get the newsletter, but no office, no event role and no members-only perks until you show up twice.

- A missed counter per club in turn.js; status shown on the Clubs card as Active, On the rolls or Lapsed.
- No penalty to standing beyond losing perks, so it never feels like punishment.
- Balance: keeps idle and Auto-skip players from banking club perks they never earned.

### i52-b06 Hold an office: secretary, treasurer, president (M, 🔴)

After a year of steady attendance, a club can ask you to take an office. Secretary keeps the minutes, treasurer counts the money, president runs the meeting; each step up gives more community each month and asks for one extra week a quarter.

- S.clubs[k].office ladder in features.js; an event in events.js offers the next step when attend >= 10 in the last 12 months.
- The office's quarterly week is a pinned to-do on Home; skipping it costs community and can get you replaced.
- Shown in the Household card next to the council seat line.
- Balance: the payoff is capped (+0.4 community a week for president) and needs real weeks spent, so only good play gets it.

### i52-b07 The annual meeting: nobody wants to be president (S, 🟠)

Once a year each club holds its election, and the room goes quiet when they ask for a president. Raise your hand, nominate someone else, or look at your shoes.

- A town event in events.js that fires in each club's annual month for active members.
- Raise hand: become president (needs secretary or treasurer first). Nominate a friend: +1 community. Look away: no change, but a funny line.
- Balance: it is an offer, not a must; saying no is always fine.

### i52-b08 Run the club's big event (L, 🔴)

Each club has one big yearly event: the service club's pancake-and-car-show morning, the Legion's Memorial Day program, the garden club's home garden tour, the boosters' auction. Sign up to run it and spend prep weeks; how well it goes depends on the weeks you gave it.

- A multi-step chain using chainSet() in features.js: sign up, 2-4 prep weeks (Show up for town or Side hustle counts), the day itself.
- Outcome scales with prep weeks: a great day (+8 community, +4 happy, a journal milestone), an okay one, or a rained-out mess with a laugh.
- One event per life-year; club officers get first pick.
- Balance: big reward, but it costs 3-5 focused weeks of pay or rest, so it only pays off for a planned year.

### i52-b09 Members-only doors: what joining opens (M, 🔴)

Membership opens small things around town: the Legion hall for your party at half price, the garden club's seed swap, the historical society's archive room, the ambulance crew's CPR class, the quilt guild's long-arm machine. Each shows a club badge on the Out and about list.

- A needsClub field on places and actions in outabout.js; actBlocked() checks S.clubs and shows "Members only: join the garden club".
- Also lets events in events.js add a member-only choice (c.if: () => isMember('legion')).
- Balance: perks are discounts and flavor, never raw score; each one still costs a week or money.

### i52-b10 Spread too thin: the third club costs more than it gives (S, 🟠)

If you hold an office in two clubs at once, or sit on the council too, a warning shows and each month brings a small happiness drain from too many evenings out.

- A check in turn.js: offices + council > 2 gives -1 happy a month and a Home heads-up.
- A "Step down" button on the Clubs card lets you hand off an office with no standing loss.
- Balance: stops a stack of offices from farming community; good play picks one or two.

### i52-b11 Service club eyeglass box and the school vision check (S, 🟡)

The service club runs the old-glasses drop box at the bank and a free eye check at the school each fall. Members can help run the check for a week; if you have a kid, they get screened free.

- A fall town event in events.js for service club members; a kid at home avoids the glasses cost in a later event.
- Ties to the eye-check idea from the health round if built.
- Balance: small community gain for a Show up week; no money reward.

### i52-b12 The service club's bike rodeo for kids (S, 🟡)

Every May the club sets up cones in the school lot, checks brakes and hands out helmets. Help run it and a kid in your house gets a new helmet.

- A May event in events.js for service club members; choice to help, donate $20, or skip.
- Help: +2 community, +1 happy; with a kid at home, a journal line.
- Balance: one Saturday, small fixed reward.

### i52-b13 Rival service clubs' tug-of-war at Celebration Days (S, 🟡)

The two service clubs settle a year-long grudge with a tug-of-war over the Touchet. If you belong to one, you pull, and the loser buys the coffee.

- A May event during Celebration Days for service club members; outcome mostly luck plus a nudge from your health.
- Win: +2 happy and a Tattler line. Lose: soaked, +1 happy, +1 community.
- Balance: pure flavor; both outcomes are good.

### i52-b14 Flag Day: retire worn flags at the Legion (S, 🟡)

On June 14 the Legion post holds a quiet ceremony to retire worn flags. Bring the one off your porch, help with the color guard, or just stand with the crowd.

- A June event in events.js; the color guard choice needs Legion or auxiliary membership.
- Small community and happiness; a journal line the first time.
- Balance: one week, small reward, no money.

### i52-b15 Poppies at the post office for the veterans' post (S, 🟡)

Before Memorial Day the veterans' post sets up a table at the post office with paper poppies for donations. Members can take a shift; anyone can drop a few dollars.

- A May event for everyone; the shift choice needs Legion or auxiliary membership and gives +2 community.
- Donate: -$5 to -$20, +1 happy.
- Balance: small and once a year.

### i52-b16 In through family: join the Legion auxiliary (S, 🟠)

You don't have to have served: if a parent, partner or grandparent did, you can join the auxiliary or the sons' group. It opens the Legion hall, Flag Day and the post's events.

- A family-tie roll at the start (or a veteran partner) sets S.vetFamily; CLUBS needs() checks it.
- Shares the Legion's meeting night and big event; can't hold the post commander office, only auxiliary offices.
- Balance: same rules as any club; just widens who can join.

### i52-b17 Your teen goes to Boys State or Girls State (S, 🟡)

The Legion post picks one junior each spring for a week of mock state government. A teen in your house with good grades and a member parent has a better shot.

- A spring event for a kid aged 16-17; chance is higher if you are a Legion or auxiliary member.
- Picked: a proud journal line, +3 happy, and a later line on the end screen about that kid.
- Balance: no money or score boost beyond happiness.

### i52-b18 Garden club keeps the Main Street planters (M, 🟠)

Garden club members each adopt a planter on Main Street. Water it on your Show up weeks through summer; in August the club walks Main and judges them.

- A summer task in features.js: the planter thrives if you made at least 6 Show up or Get outside weeks June-August.
- Shown on the Main Street block in outabout.js as a little flower by the planter you adopted.
- Good planter: +3 community, a Tattler line. A dead one: a gentle ribbing, no penalty.
- Balance: rewards a steady summer, not one big push.

### i52-b19 Yard of the month sign on your lawn (S, 🟡)

The garden club picks a yard each summer month and plants a small sign in it. Homeowners who keep up the yard and garden have a chance.

- A June-September event for homeowners who did home upkeep or garden weeks recently; garden club members are not eligible (no judging yourself).
- +2 community, +2 happy, a Tattler line.
- Balance: needs a home and real yard time; cannot be farmed.

### i52-b20 Garden club plant sale: split your perennials (S, 🟡)

In May the club holds a plant sale at the park. Members dig and split their own iris and daylilies; the money goes to the planters fund.

- A May event for garden club members; a choice to dig (one Get outside week) or bake instead.
- Gives community and a little happy; never money to you.
- Balance: small, once a year.

### i52-b21 The historical society's treasurer keeps a shoebox (S, 🟡)

The historical society asks you to take over the books from a treasurer of 30 years whose system is a shoebox of receipts. Sort it out over a few weeks or politely pass.

- A once-only chain for historical society members, using chainSet(); two Take classes or Rest weeks count as sorting nights.
- Done: you become treasurer (see offices), +3 community, and the society can finally apply for a grant (a later Tattler line).
- Balance: costs weeks, gives modest standing.

### i52-b22 Booster club paints the bleachers in August (S, 🟡)

Before football season the boosters paint the home bleachers. Show up with a roller on a Saturday, send pizza, or skip it.

- An August event for booster members (or any parent of a school-age kid).
- Paint: +2 community, -1 health (sore shoulders). Pizza: -$40, +1 community.
- Balance: small choices, no money gain.

### i52-b23 Take the EMT class with the volunteer ambulance crew (M, 🟠)

The volunteer ambulance crew pays for your EMT class if you agree to take calls. It runs about 12 weeks of Take classes evenings and ends with a state test.

- A course entry in the study system (state.js) that needs ambulance crew membership; tuition is covered by the crew.
- Passing sets S.emt and unlocks the weekend pager; failing lets you retake it once.
- Balance: costs study weeks like any class; the reward is the on-call role, not pay.

### i52-b24 On call for the ambulance: the weekend pager (M, 🟠)

Certified crew members carry a pager one weekend a month. Calls come as short events: a fall on a farm, a car in the ditch on US-12. Each call costs a bit of health and gives real standing.

- Weekly roll in turn.js on your on-call week; calls are town events with "go" and "can't make it" choices.
- Go: +3 community, -1 health, a journal line; a rare hard call gives a happiness dip and a "talk it out" follow-up.
- Pairs with the volunteer fire ideas from round 1 but stays separate (ambulance vs fire).
- Balance: capped at one weekend a month; costs health, so it is not free standing.

### i52-b25 Ribbon cutting: the Chamber welcomes your business (S, 🟡)

When you open a business in Waitsburg, the Chamber shows up with big scissors and a photographer. Members get the ceremony, a Tattler photo and a small first-month boost.

- A hook in startBiz() in features.js: if you joined the Chamber, fire a once-per-business event.
- Gives +2 community and a little first-month income lift.
- Balance: needs a business and dues; small one-time gain.

### i52-b26 Quilts for a veteran: the guild and the post together (S, 🟡)

The quilt guild makes a quilt for a local veteran each year and gives it at the Legion. If you are in the guild, you sew a block; if you are in the post, you help pick who gets it.

- A fall chain linking two clubs: guild members get a sewing step, Legion members a choosing step.
- Both get community and a journal line; if you're in both, a warm extra line.
- Balance: small rewards; shows clubs working together.

### i52-b27 Be a scout den leader (M, 🟠)

With a kid aged 7-11 you can lead a den: one evening a month of knots, campfires and lost neckerchiefs. Every few months the den earns a badge you can see on the Family card.

- Scouts needs a kid at home; the den leader office uses the same office ladder and monthly Show up check.
- Kid happiness and your community rise a little each month you show up; a campout counts as a Get outside week.
- Balance: tied to real weeks and a kid; no money gain.

### i52-b28 Scout popcorn sale in the fall (S, 🟡)

Your scout comes home with an order form. Walk the neighborhood together, take it to your work, or just buy a tin yourself.

- A September event for families with a scout.
- Walk: +2 community, +1 happy, kid joy. Work: +1 community, small work standing note. Buy: -$25.
- Balance: small and once a year.

### i52-b29 Your teen's Eagle-style project, and how much you help (S, 🟡)

Your teen scout wants to build a bench or fix the trail at the river for their top rank. Help a lot, help a little, or let them run it.

- A chain for a scout aged 15-17; "let them run it" has a lower success chance but a bigger payoff line on the end screen.
- Done: +3 community and a journal milestone for the kid.
- Balance: the best outcome is the hands-off one, which costs you nothing but risk.

### i52-b30 Your congregation, or none, shows up when you're laid up (S, 🟠)

If you belong to a congregation (any, chosen by name, or none), they bring meals and mow the lawn when you are in the hospital or just had a baby. Without one, close neighbors may still come.

- A congregation club with a player-typed name or a neutral list; no faith content, just people.
- When a hospital stay or new baby fires, active members get a small health and happiness lift and a journal line.
- Balance: a soft safety net, not money; only works if you have been showing up.

### i52-b31 Club scholarship night for your senior (S, 🟡)

At graduation the town's clubs hand out small scholarships. Your senior can apply; a family that has been active in town has a better shot.

- A June event for a kid turning 18; chance rises with your community and active club memberships.
- Award: $500-$1,000 toward the kid's schooling, a proud journal line.
- Balance: modest money tied to years of standing; careless play rarely qualifies.

### i52-b32 Club news in the Tattler (S, 🟡)

The weekly paper runs short club notes: who took office, who ran the pancake feed, whose planter won. Your name shows up when you do something.

- Add club lines to the TATTLER pool in outabout.js, filled from S.clubs events and offices.
- Pure flavor; no stat change.
- Balance: none needed.

### i52-b33 Service pins: 10, 25 and 40 years (S, 🟡)

In long games, clubs hand out pins at the yearly dinner for years of membership. A 25-year pin earns a standing ovation and a line on the end screen.

- Count years active per club; a dinner event at 10, 25 and 40 years in Lifetime games.
- Small community and happiness at each; badge candidate if the badge list has room.
- Balance: only real, continuous membership counts; lapsed years reset nothing but do not count.

### i52-b34 Clubs on the end screen and for the heir (S, 🟠)

The end screen lists the clubs you belonged to and the offices you held. In a legacy game, your heir gets a "family name" welcome at your old club.

- finish() in features.js adds a Clubs line; startLegacy() passes S.clubs history to the heir.
- The heir's first visit to that club skips the guest step and starts with +1 community.
- Balance: a small head start, not a score bonus.

### i52-b35 Sim check: joiners versus ghosts (S, 🔴)

Add a sim bot that joins two clubs and plays steady, and make sure the careless and idle bots that join and never show up pay dues and gain nothing.

- Extend tests/sim.test.mjs with a "joiner" bot; assert careless median stays <= 60 and idle <= 50 with clubs on.
- Report average offices held and events run per bot in the balance report.
- Balance: this is the guardrail for the whole set.
