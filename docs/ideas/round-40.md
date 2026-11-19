# Ideas round 40

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 40: Road event pack 2

Thirty more road events for commute weeks of 20+ miles and trip weeks, in the same format and balance rules as section B of docs/review-and-events-2026-11-18.md (☺ happiness · ♥ health · 🤝 community · money via cost(), in 2027 dollars; road events fire at 8% only in road weeks).

### i40-a01 Highway 12: Road spray and an empty washer tank (S, 🟡)
- When/who: Nov–Mar, commuters 20+ mi.
- Choices: Buy fluid at the next station −cost(8) (no stat change) · Squint through it (☺−1; 5%: slide onto the shoulder, −cost(300)).
- Repeat: 8 wk. Touches: js/events.js road list; uses longCommute() and inM().
- Balance: Expected cost of squinting is about $15 plus ☺−1, so paying $8 is the smart, cheap choice.

### i40-a02 Highway 12: A hitchhiker at the Lowden turnoff (S, 🟡)
- When/who: Any month, Walla Walla drives, daytime.
- Choices: Give them a lift into town (☺+2, 🤝+1; 20%: they work at a Waitsburg farm, 🤝+1 more) · Drive on (no change).
- Repeat: 8 wk. Touches: js/events.js road list; place pin on the Walla Walla road.
- Balance: Small good deed; drive on is free, so careless play loses nothing and gains nothing.

### i40-a03 Highway 12: Black ice puts you in the ditch (M, 🔴)
- When/who: Dec–Feb, commuters 20+ mi.
- Choices: Call a tow −cost(150) (☺−1) · Flag down a farmer with a tractor, community 25+ (🤝+2, ☺−1) · Dig out yourself (♥−2, ☺−2; 20%: −cost(120) bent rim).
- Repeat: Yearly. Touches: js/events.js road list; community gate on the tractor choice; S.tires winter tires halve the odds the event fires.
- Balance: Medium bad luck; community and winter tires soften it, rewarding good play.

### i40-a04 Highway 12: The check-engine light on the beater (S, 🟠)
- When/who: 1998 pickup only, commuters or trips.
- Choices: Read the code yourself, Mechanic 1+ (−cost(20); Mechanic +1 practice) · Shop diagnostic −cost(120) · Ignore it (25%: breakdown within a month, −cost(500), ☺−2).
- Repeat: 8 wk. Touches: js/events.js road list; S.car === "beater"; the ignore branch sets a short flag checked in the monthly breakdown roll.
- Balance: Ignoring costs about $125 expected, the same as the shop, so it is not a free win; Mechanic pays off.

### i40-a05 Highway 12: The low-fuel light past Touchet (S, 🟡)
- When/who: Any, Tri-Cities drives (Pasco, Kennewick, Richland).
- Choices: Coast to the Wallula station (☺−2; 10%: run dry, −cost(80) for a can and a ride) · Turn back to the Waitsburg pump (☺−1; −quarter day's pay if working).
- Repeat: 8 wk. Touches: js/events.js road list; roadTown() in the Tri-Cities; dayPay().
- Balance: Small; a time-or-risk choice in the style of R-3.

### i40-a06 Highway 12: A radio call-in contest (S, 🟡)
- When/who: Commuters 20+ mi.
- Choices: Call in at the light (☺+1; 10%: you win concert tickets, ☺+5) · Change the station (no change).
- Repeat: 8 wk. Touches: js/events.js road list; a win writes a Journal line.
- Balance: Expected value about ☺+1.4; tiny and only for commuters, so idle play never sees it.

### i40-a07 Highway 12: A garage-sale sign in Touchet (S, 🟡)
- When/who: Apr–Sep, Tri-Cities drives.
- Choices: Pull over and dig −cost(20) (☺+2; 20%: an old tool set, Handy +2 practice) · Keep driving (no change).
- Repeat: 8 wk. Touches: js/events.js road list; practice("handy").
- Balance: Small; about $10 a point, a fair deal capped by the cooldown.

### i40-a08 Highway 12: Hay bales spill off a pickup ahead (S, 🟠)
- When/who: Jun–Aug, any road week.
- Choices: Stop and help restack (🤝+2, ☺+1, ♥−1) · Steer around (☺−1; 10%: −cost(150) bumper).
- Repeat: 8 wk. Touches: js/events.js road list; 20% that the driver is from Waitsburg when S.gasFriend is set (R-30 tie-in).
- Balance: Helping costs a little health; steering around has a small expected cost.

### i40-a09 Commute: The drive starts to feel endless (M, 🔴)
- When/who: Commute 40+ mi each way, 26+ weeks in the job.
- Choices: Stop at a park on the way home (♥+1, ☺+1; home late) · Grind it out (☺−3) · Start looking closer to home (opens Jobs with +10% on your next application, ☺−1).
- Repeat: Yearly. Touches: js/events.js road list; S.applyBoost (already in EVENT_STATE); S.jobMonths.
- Balance: Makes the long-commute trade-off felt; no choice is a net gain, so it can only slow careless high-pay commuters.

### i40-a10 Commute: The boss asks you to grab parts on the way in (S, 🟡)
- When/who: Trades and field jobs with a 20+ mi commute.
- Choices: Run the errand (☺−1, +cost(25) gas money, +2% on your next raise roll) · Say you can't this week (no change).
- Repeat: 8 wk. Touches: js/events.js road list; jobIn("trades","field"); S.raiseBoost.
- Balance: Small; a nudge that hard-working play earns later.

### i40-a11 Commute: A rest-area nap after a night shift (S, 🟠)
- When/who: Care jobs and corrections officers with a 20+ mi commute.
- Choices: Nap 30 minutes at the rest area (♥+1, ☺−1, home late) · Push on home (15%: rumble strip scare, ♥−1, ☺−3).
- Repeat: 8 wk. Touches: js/events.js road list; jobIn("care") or S.jobId === "co".
- Balance: Safe choice is a small net plus; pushing on has an expected ☺−0.5 and a scare.

### i40-a12 Trip: You forgot your wallet at home (S, 🟠)
- When/who: Trip weeks, any.
- Choices: Turn back (−cost(15) gas, ☺−2) · Borrow cash from a friend in town, community 30+ (🤝+1, ☺−1) · Skip lunch and the shopping (♥−1, ☺−2; trip stops that cost money are skipped).
- Repeat: Yearly. Touches: js/events.js road list; S.trip; trip-stop cost pass in js/outabout.js.
- Balance: Small bad luck; community softens it.

### i40-a13 Trip: The kids get carsick (S, 🟡)
- When/who: Trip weeks, players with kids.
- Choices: Stop at a rest area (☺−1) · Push on (☺−2; −cost(25) car cleaning) · Ginger candy from the gas station −cost(5) (☺−1, next carsick event 50% less likely).
- Repeat: 8 wk. Touches: js/events.js road list; S.kids; small flag in EVENT_STATE.
- Balance: Small family flavor; all choices are minor losses.

### i40-a14 Trip: Your trip buddy cancels last minute (M, 🟠)
- When/who: Trip weeks with a friend or partner, any.
- Choices: Go alone (trip happiness −25%) · Invite a neighbor instead, community 25+ (🤝+2, ☺+1) · Reschedule (gas refunded, ☺−1).
- Repeat: 8 wk. Touches: js/events.js road list; scales the trip's happiness in js/outabout.js.
- Balance: Medium; community turns a loss into a small gain.

### i40-a15 Walla Walla: A youth team car wash (S, 🟡)
- When/who: Apr–Sep, Walla Walla drives.
- Choices: Get the truck washed −cost(10) (🤝+1, ☺+1) · Tip extra −cost(25) (🤝+2, ☺+1) · Drive past (no change).
- Repeat: 8 wk. Touches: js/events.js road list; roadTown() === "wallawalla".
- Balance: Small; about $12 a point.

### i40-a16 Walla Walla: A sidewalk chalk festival downtown (S, 🟡)
- When/who: May, Walla Walla drives.
- Choices: Draw a square −cost(10) (☺+3, 🤝+1; kids ☺+1 more) · Stroll and look (☺+1).
- Repeat: Yearly. Touches: js/events.js road list; inM(m,4).
- Balance: Small, yearly; free choice still gives a little.

### i40-a17 Walla Walla: Free day at the fort museum (S, 🟡)
- When/who: Mar–Oct, Walla Walla drives.
- Choices: Walk the pioneer village (☺+2; kids ☺+1 more) · Skip (no change).
- Repeat: Yearly. Touches: js/events.js road list; place pin on the Walla Walla close-up map when built.
- Balance: Flavor; no study bonus so it does not stack with R-12 and R-23.

### i40-a18 Walla Walla: Open mic night at a coffee house (S, 🟡)
- When/who: Any, Walla Walla drives, 18+.
- Choices: Play a song (☺+3, 🤝+1; 20%: stage nerves, ☺−2 instead) · Listen with a coffee −cost(6) (☺+2) · Head home (no change).
- Repeat: 8 wk. Touches: js/events.js road list; a good night writes a Journal line.
- Balance: Expected ☺+2 either way; cheap and small.

### i40-a19 Dayton: A summer concert on the courthouse lawn (S, 🟡)
- When/who: Jun–Aug, Dayton drives.
- Choices: Bring a picnic −cost(20) (☺+3, 🤝+1) · Sit on the grass, free (☺+2) · Skip (no change).
- Repeat: Yearly. Touches: js/events.js road list; roadTown() === "dayton".
- Balance: Small and yearly.

### i40-a20 Dayton: An elk herd on the Bluewood road (S, 🟡)
- When/who: Dec–Mar, Dayton or Bluewood drives, low weight.
- Choices: Stop and watch (☺+3) · Take a picture for the Tattler (☺+2, 🤝+1) · Honk them along (☺−1).
- Repeat: Yearly. Touches: js/events.js road list; w 1; ties to a wildlife list if one is built.
- Balance: A calm moment; small positive, rare.

### i40-a21 Dayton: The 4-H auction at the county fair (M, 🟠)
- When/who: Late August / Labor Day, Dayton drives.
- Choices: Buy a lamb with neighbors −cost(300) (🤝+4; food costs −10% for 2 months) · Bid up a neighbor kid's pig −cost(60) (🤝+2) · Watch (☺+1).
- Repeat: Yearly. Touches: js/events.js road list; a short food-cost flag read by the monthly bills in js/turn.js.
- Balance: Medium; the food discount pays back about a third of the price, so the net is about $25 a point.

### i40-a22 Kennewick: Photos with the mall Santa (S, 🟡)
- When/who: December, players with kids, Tri-Cities drives.
- Choices: Get the photo −cost(30) (☺+4) · Wave from the escalator (☺+1; kids ☺−1).
- Repeat: Yearly. Touches: js/events.js road list; S.kids; inM(m,11).
- Balance: Small, about $8 a point; yearly.

### i40-a23 Kennewick: A big-name concert at the arena (S, 🟠)
- When/who: Any, Tri-Cities drives, money cost(800)+.
- Choices: Buy tickets −cost(140) (☺+6; on a work night ♥−1) · Stream it at home (☺+1).
- Repeat: Yearly. Touches: js/events.js road list; money gate like R-16.
- Balance: Medium happiness at about $23 a point; money gate keeps it from hurting broke players.

### i40-a24 Kennewick: Job fair at the convention center (S, 🔴)
- When/who: March, Tri-Cities drives, not working or job under 6 months.
- Choices: Bring resumes (☺−1; +15% on your next application this month) · Grab the free pens (☺+1).
- Repeat: Yearly. Touches: js/events.js road list; S.applyBoost and S.hireBy (already in EVENT_STATE).
- Balance: Helps job hunters who drive; no stat gain for idle play.

### i40-a25 Kennewick: A fender-bender in the big-box lot (M, 🟠)
- When/who: Any, Kennewick drives.
- Choices: Trade insurance info (−cost(250) deductible, ☺−2) · Settle in cash −cost(150) (☺−1; 20%: they call back for −cost(200) more) · Pop the dent yourself, Mechanic 2+ (−cost(30); Mechanic +1).
- Repeat: Yearly. Touches: js/events.js road list; the call-back uses the echo system if built, else resolves at once.
- Balance: Medium bad luck; cash is cheaper on average ($190) but riskier; Mechanic pays off.

### i40-a26 Kennewick: A water park day in August (S, 🟡)
- When/who: August, players with kids, Tri-Cities drives.
- Choices: Family day pass −cost(80) (☺+5, ♥+1) · The free splash pad (☺+2) · Skip (kids ☺−1).
- Repeat: Yearly. Touches: js/events.js road list; S.kids; inM(m,7).
- Balance: Medium happiness for money, about $16 a point; yearly.

### i40-a27 Pasco: Help a lost driver, in Spanish (S, 🟡)
- When/who: Any, Pasco drives.
- Choices: Walk them through it (🤝+1, ☺+2; People +1 practice) · Point at the gas station (☺+1).
- Repeat: 8 wk. Touches: js/events.js road list; practice("people"); ties to the Spanish idea if built.
- Balance: Small; a People skill source on the road.

### i40-a28 Pasco: Tamales from a church sale (S, 🟠)
- When/who: December, Tri-Cities drives.
- Choices: A dozen for home −cost(25) (☺+3) · Extra for coworkers −cost(50) (☺+2, 🤝+2) · Skip (no change).
- Repeat: Yearly. Touches: js/events.js road list; inM(m,11).
- Balance: Small; about $10–12 a point, yearly.

### i40-a29 Richland: Family science night at the lab (S, 🟡)
- When/who: Oct–Mar, Richland drives, players with kids or studying.
- Choices: Go, free (☺+3; +1 week of class progress if studying, else kids ☺+1) · Skip (no change).
- Repeat: Yearly. Touches: js/events.js road list; classWeeks(1).
- Balance: Small; the study bonus only goes to players already studying.

### i40-a30 Wallula: Peaches and melons from a pickup bed (S, 🟡)
- When/who: August, Tri-Cities drives.
- Choices: Buy a box −cost(25) (☺+2, ♥+1) · Buy two and share with the neighbors −cost(45) (☺+2, 🤝+2) · Drive by (no change).
- Repeat: Yearly. Touches: js/events.js road list; place pin at the Wallula junction on the region map.
- Balance: Small, yearly; health plus a community option.

## Ideas 40: Work event pack 2

Thirty more work events across the job groups, in the same format and balance rules as section C of docs/review-and-events-2026-11-18.md (☺ happiness · ♥ health · 🤝 community · money via cost(), in 2027 dollars).

### i40-b01 [Field] The ski lift stops with riders in the wind (S, 🟠)
- When/who: Bluewood lift operator, Dec–Mar.
- Choices: Talk the riders down on the radio (☺+2, 🤝+1; People +1) · Start the backup motor, Mechanic 1+ (☺+3, +cost(50) bonus; Mechanic +1) · Wait for the supervisor (☺−2).
- Repeat: Yearly. Touches: js/events.js (Work, when lift job and inM winter months).
- Balance: A People or Mechanic payoff; the free choice is a small loss.

### i40-b02 [Field] You lose your dosimeter badge at Hanford (S, 🟡)
- When/who: Hanford cleanup tech, any month.
- Choices: Report it right away (☺−2, half a day's pay lost to the re-check) · Search the truck all evening (60%: find it, ☺+1; otherwise report late, ☺−4).
- Repeat: Yearly. Touches: js/events.js (Work, jobId hanford).
- Balance: Honesty is the safe line; the gamble's expected value is slightly worse (−0.8 vs −2 plus pay), so it's a real choice.

### i40-b03 [Field] A lost bag on the carousel (S, 🟡)
- When/who: Airport ground crew, any month.
- Choices: Track it down on your break (☺+2, 🤝+1; 30%: a thank-you card with +cost(50)) · Leave it for the desk.
- Repeat: 8 wk. Touches: js/events.js (Work, jobId airport).
- Balance: Small good deed; luck pays a little back.

### i40-b04 [Field] The line speeds up for a big order (S, 🟠)
- When/who: Food plant and onion shed, any month.
- Choices: Keep pace for the bonus (+cost(120), ♥−3) · Ask for a rotation (☺+1; People 1+: 🤝+1 more) · Slow down and take the heat (☺−2).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId foodplant or onion).
- Balance: Money for health at about the focus rate; the People choice is free but skill-gated.

### i40-b05 [Field] Frost watch in the vineyard (S, 🟡)
- When/who: Winery cellar hand, April.
- Choices: Run the wind machines all night (+cost(180), ♥−2, ☺−1) · Go home on time (80%: no change; 20%: frost hits and the crew bonus is cut, ☺−2).
- Repeat: Yearly. Touches: js/events.js (Work, jobId cellar, inM April).
- Balance: Separate from the crush-season idea; medium money for a rough night.

### i40-b06 [Office] A storm-claim rush after hail (S, 🔴)
- When/who: Farm insurance agent, Jun–Aug.
- Choices: Work the weekend on claims (+cost(250), ☺−2, 🤝+3) · Normal hours and the callbacks wait (🤝−2).
- Repeat: Yearly. Touches: js/events.js (Work, jobId insure, inM summer).
- Balance: The agent's clients are your neighbors, so it's a community event; good play gains, skipping costs a little.

### i40-b07 [Office] A student asks you for a letter (S, 🟡)
- When/who: College professor, Oct–Feb.
- Choices: Write a careful one (☺+3, ♥−1; 25%: a thank-you note next spring, ☺+2) · Send a form letter (☺−1).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId prof).
- Balance: Small and warm; the follow-up is a one-line Journal note.

### i40-b08 [Office] A grant deadline at the lab (M, 🔴)
- When/who: National lab scientist and lab administrator, any month.
- Choices: Pull two weeks of late nights (♥−3, ☺−2; 40%: funded, +4% pay) · Submit what you have (☺+1; 15%: funded, +4% pay).
- Repeat: Yearly. Touches: js/events.js (Work, jobId scientist or labadmin; raise via S.raise up to RAISE_CAP).
- Balance: A small, risky raise like J1, paid for in health.

### i40-b09 [Office] A loan you have to turn down (S, 🟡)
- When/who: Bank loan officer, any month.
- Choices: Explain it kindly and point them to the credit union (☺−1, 🤝+2; People +1) · Just send the letter (☺−2).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId loan).
- Balance: Both choices sting a little; the kind one builds community and People.

### i40-b10 [Office] The year-end audit (S, 🟠)
- When/who: Courthouse clerk, insurance agent, loan officer, lab administrator, June.
- Choices: Pull the files early (☺−2; a clean audit, +cost(100) bonus) · Wing it (60%: fine, ☺+1; 40%: two weeks of cleanup, ☺−4, ♥−1).
- Repeat: Yearly. Touches: js/events.js (Work, those jobIds, inM June).
- Balance: Preparing wins on average, so careful play scores higher than careless.

### i40-b11 [Care] Working the holiday shift (S, 🔴)
- When/who: Nurse, nursing assistant, imaging tech, medical assistant, Nov–Dec.
- Choices: Work the holiday for double pay (+2 days' pay, ☺−3; partner or kids: ☺−1 more) · Trade for New Year's (☺+1, 🤝−1).
- Repeat: Yearly. Touches: js/events.js (Work, jobIn care minus para, inM 10–11).
- Balance: Uses dayPay(); a family cost makes it a real trade-off.

### i40-b12 [Care] Run the school flu-shot clinic (M, 🟠)
- When/who: Nurse, medical assistant, paraeducator, October.
- Choices: Run the line on a Saturday (+cost(80), 🤝+3, ♥−1; your own shot too) · Just get your own shot (♥+1) · Skip.
- Repeat: Yearly. Touches: js/events.js (Work) plus a small flag S.fluShot for the year: either shot halves the health hit of J13 'Flu going around'.
- Balance: Skip has no cost now but a bigger risk later.

### i40-b13 [Care] A student melts down in the hall (S, 🟠)
- When/who: Paraeducator, school year (Sep–May).
- Choices: Sit with them until they calm down (☺+2, 🤝+2; People +1) · Call the office (☺−1).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId para).
- Balance: A People source for the one school job; small.

### i40-b14 [Care] Night shifts wreck your sleep (M, 🟠)
- When/who: Nurse and nursing assistant, any month.
- Choices: Blackout curtains and a fan −cost(60) (♥+2, ☺+1; 'Feeling run down' half as likely for a year) · Coffee and grit (♥−2).
- Repeat: Yearly. Touches: js/events.js (Work, jobId rn or cna) plus a yearly flag read by the 'Feeling run down' weight.
- Balance: About $25 a point, in range.

### i40-b15 [Care] Your CPR card is due (M, 🟡)
- When/who: Any care job, any month.
- Choices: Take the evening class (☺−1, 🤝+1; once later, 10%: you help a choking diner, ☺+5, 🤝+4) · Let it lapse (−cost(100) late recertification, ☺−2).
- Repeat: Yearly. Touches: js/events.js (Work) plus a once-only follow-up event in Town.
- Balance: Keeping current is cheaper; the follow-up is a rare reward.

### i40-b16 [Service] A grease fire on the flat-top (S, 🟠)
- When/who: Line cook, any month.
- Choices: Smother it with a sheet pan (☺+2, 🤝+1; 10%: a minor burn, ♥−3) · Pull the extinguisher and clear the kitchen (☺−1, half a day's pay lost while it's closed).
- Repeat: Yearly. Touches: js/events.js (Work, jobId diner; place gulch).
- Balance: Both choices are fine; the bold one carries a little risk.

### i40-b17 [Service] Inventory count night (S, 🟡)
- When/who: Mall retail, hardware store clerk, grocery clerk, January.
- Choices: Stay for the count (+cost(70), ♥−1, ☺−1) · Leave at close (☺+1; 20%: the boss notices, ☺−2).
- Repeat: Yearly. Touches: js/events.js (Work, those jobIds, inM 0).
- Balance: Small money for a long night.

### i40-b18 [Service] A shoplifter at your register (S, 🔴)
- When/who: Mall retail, hardware store clerk, grocery clerk, any month.
- Choices: Let them go and call it in (☺−1) · Chase them out the door (☺+2; 20%: you fall, ♥−4; 15%: a write-up for leaving the till, ☺−3) · It's a hungry kid: pay for the bread yourself −cost(10) (☺+3, 🤝+2).
- Repeat: 8 wk. Touches: js/events.js (Work).
- Balance: The kind choice wins on stats; chasing has an expected loss, so careless play doesn't gain.

### i40-b19 [Service] A tour bus stops for lunch (S, 🟡)
- When/who: Line cook and barista, May–Sep.
- Choices: Stay through the rush (+cost(60) in tips, ♥−1) · Clock out at your usual time (☺+1).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId diner or barista).
- Balance: Ties to summer Lewis & Clark traffic; small.

### i40-b20 [Service] A regular stops coming in (S, 🟠)
- When/who: Any service job, community 20+.
- Choices: Drop off their usual at the house −cost(8) (🤝+3, ☺+2) · Ask around about them (🤝+1) · Let it go.
- Repeat: 8 wk. Touches: js/events.js (Work, jobIn service).
- Balance: A small-town moment; cheap community, gated by standing.

### i40-b21 [Trades] Your drive-time clock runs out an hour from home (S, 🟠)
- When/who: Truck driver, any month.
- Choices: Sleep in the cab at a truck stop (☺−2, ♥−1) · Motel −cost(90) · Push the last hour (☺+1; 15%: caught at a scale, −cost(400) fine).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId trucker).
- Balance: Pushing on has an expected cost of about $60; the safe choices cost about the same, so it's a style choice, not a free win.

### i40-b22 [Trades] Called in on your day off (S, 🟡)
- When/who: Rail yard conductor, any month.
- Choices: Take the call (+1.5 days' pay, ☺−2) · Let it ring (☺+1; 20%: you drop down the call list, ☺−2).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId rail).
- Balance: Uses dayPay(); money for happiness at the usual rate.

### i40-b23 [Trades] A customer's car comes back (S, 🟠)
- When/who: Auto mechanic, any month.
- Choices: Redo it free on your lunch (☺−1, 🤝+2; Mechanic +1) · Blame the part (☺+1; 30%: a bad review, ☺−3).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId mech).
- Balance: Owning it builds skill and standing; the dodge loses on average.

### i40-b24 [Trades] An inmate asks you to mail a letter (S, 🟡)
- When/who: Corrections officer, any month.
- Choices: Refuse and write it up (☺−1) · Mail it quietly (☺+1; 20%: caught, two weeks unpaid, ☺−6).
- Repeat: Yearly. Touches: js/events.js (Work, jobId co).
- Balance: Plain and grim; the rule-bending choice loses about two days' pay on average.

### i40-b25 [Trades] The dust alarm at the grain elevator (S, 🟠)
- When/who: Grain elevator operator, Jul–Sep.
- Choices: Shut the leg down and clean it (☺−1, half a day's pay) · Run to the end of the shift (+cost(40); 5%: a small fire, ♥−5, a week's pay lost).
- Repeat: Yearly. Touches: js/events.js (Work, jobId elevator, harvest months).
- Balance: The risky choice's expected loss beats its $40, so careful play wins.

### i40-b26 [Waitsburg business] The espresso machine dies on a Saturday (S, 🟠)
- When/who: Barista at the coffee shop, any month.
- Choices: Brew drip and call it a pour-over special (☺+2, 🤝+2) · Close early (☺+1, half a day's pay).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId barista; pin on the coffee shop).
- Balance: Small; making do is the community choice.

### i40-b27 [Waitsburg business] A council member wants your story pulled (M, 🔴)
- When/who: Reporter at the Tattler, any month.
- Choices: Run it as written (☺+2, 🤝−2; 30%: a press award next spring, ☺+5) · Hold it a week to get their side (🤝+1, ☺−1) · Drop it (☺−3).
- Repeat: Yearly. Touches: js/events.js (Work, jobId reporter) plus a yearly follow-up for the award.
- Balance: Separate from 'The reporter's big story'; each choice trades community for pride.

### i40-b28 [Waitsburg business] Your cash drawer is $40 short (S, 🟡)
- When/who: Bank teller, any month.
- Choices: Recount with the head teller (☺−1; 70%: found, ☺+2) · Cover it from your own pocket −cost(40) (☺−2).
- Repeat: 8 wk. Touches: js/events.js (Work, jobId teller; pin on the bank).
- Balance: Recounting wins on average; small.

### i40-b29 [Waitsburg business] The builder lets you lead a small job (S, 🔴)
- When/who: Trades apprentice, 26+ weeks in.
- Choices: Lead it (Handy +3 practice, ☺+3; 20%: a callback to fix the trim, ☺−2) · Stay on the crew (Handy +1 practice).
- Repeat: Yearly. Touches: js/events.js (Work, jobId apprentice, S.jobMonths >= 6; practice('handy')).
- Balance: A Handy payoff that matters for homeowners later.

### i40-b30 [Waitsburg business] Soil-sample season for the ag tech (S, 🟡)
- When/who: Ag technician at the farm supply, Sep–Oct.
- Choices: Take the far fields too (+cost(150), ♥−1, ☺−1, 🤝+2) · Town fields only.
- Repeat: Yearly. Touches: js/events.js (Work, jobId agtech, inM 8–9).
- Balance: Medium money plus farm-family community for a tiring week.
