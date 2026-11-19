# Ideas round 29

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 29: Safety nets and helping each other

How people in Waitsburg get through hard times, and how the player can be the one who helps, written with dignity and without politics.

### i29-a01 A back-on-your-feet plan after a layoff (M, 🔴)
Today a layoff just sets S.ui = 6 and a happy hit. This adds a 'Getting back up' card on Home with four one-tap steps.
Each step uses that week's focus slot or costs a little gas, and adds a small bonus to the hire chance in ui.js (the p formula), up to about +0.15.
Touches events.js (layoff results), ui.js (Home card, hire odds), state.js (S.backPlan).
Balance: steps cost a week of focus, so idle play gets nothing. It shortens a rough stretch; it never pays money.

### i29-a02 Join the credit union before you need it (M, 🔴)
New Money-tab row: 'Credit union member since …'.
After 8 weeks, a $500–$1,500 small-dollar loan at about 1% a month over 6–12 months, paid like the truck loan.
Touches state.js (S.cu), turn.js (loan payment line), ui.js (Money tab), help.js.
Balance: you must plan ahead to join, so careless players hit the regular debt interest. The loan is capped and must be repaid, so it never beats having savings.

### i29-a03 A neighbor loses their job: help without making it awkward (M, 🔴)
A two-step chain in features.js (like the levee and food truck chains).
Step 1: pick how to help (money, time or a lead). Step 2, 4–8 weeks later: they're back at work and the payoff fits what you did.
A job lead needs community 40+ or the People skill; the quiet bill costs cash but gives the most happiness.
Balance: every option costs money or a focus week; doing nothing costs only a little community, so careless play gains nothing.

### i29-a04 Sign up for a neighbor's meal train (S, 🔴)
An event in events.js with three choices: cook (cost 25, community +3, happy +2), buy takeout (cost 45, community +1), or pass.
Ties into the potluck dish idea if it exists: your known dish makes the meal count more.
Balance: small cost, small reward; it's about rhythm, not score.

### i29-a05 Run the Saturday sort at the food bank (M, 🟠)
Count 'community' focus weeks in S.fbShifts; at 6, an event offers the lead role.
As lead: +1 community a month, -1 health from lifting, and you miss the role if you stop showing up for 8 weeks.
Different from 'Food bank Thursday' (getting help); this is the giving side.
Touches state.js, turn.js (monthly tick), features.js (life story line).

### i29-a06 Glean the field edges after harvest (S, 🟠)
Event in events.js, months 7–9, only after the summer harvest goal.
Choice: glean (health +1, community +3, food & utilities -$40 next month) or skip.
Balance: one Saturday, small numbers, seasonal only.

### i29-a07 Donate a deer to the food bank (S, 🟡)
Event in events.js, months 9–10, needs an Outside week that fall.
Choices: keep it all (food bill -$60 next month) or donate half (pay a $40 fee, community +4, happy +2).
Balance: a trade between your pantry and the town's, no free gain.

### i29-a08 Split wood for the firewood bank (S, 🟠)
Fits the existing winter goal list in state.js (GOALS): an extra fall option that counts 'outdoors' weeks toward the food bank goal.
Each wood day: health +1 (good work), health -1 if age 60+ instead, community +2.
Balance: uses focus weeks, so it replaces other gains rather than adding free ones.

### i29-a09 Weatherize a neighbor's windows with the Grange crew (S, 🟡)
Event in events.js, month 9, needs a pickup or community 30+.
Choice: help (community +3, health -1, a later +2 happy follow-up via chainSet) or skip.
Balance: one-time, small.

### i29-a10 Even out the winter heat bill with budget billing (M, 🟠)
Add a winter bump to food & utilities in turn.js (Dec–Feb about +15%, Jun–Aug +5% for cooling).
A Money-tab toggle spreads the year's total evenly; a once-a-year 'settle up' line in September pays or refunds the difference.
Balance: same yearly total; it only smooths cash flow, so it helps careful play avoid debt interest without adding money.

### i29-a11 Benefit dollars go twice as far at the farmers market (S, 🟡)
Only shows if the benefits idea (i7-a27) is built and active.
The 'Farmers market' outing in features.js costs half for benefit users and adds +1 health.
Balance: limited to market months and the weekly cap.

### i29-a12 Don't miss the coverage renewal letter (S, 🟡)
Event in events.js, once a year, only for players on public coverage (needs i7-a27 or i9-a23).
Choices: fill it out at the library (no cost, one line of text) or 'later', which sets a 12-week lapse flag that makes health events cost more.
Balance: teaches the real step; careless play loses a bit.

### i29-a13 Pay off the school's lunch balances (S, 🟡)
Event in events.js, months 4 and 11, needs money above $5,000.
Pay $300 (community +3 only if word gets out by chance 30%, happy +4 always).
A mirror event for broke players with kids: an anonymous neighbor clears your $40 balance.
Balance: the 'receive' version only fires when money < 0 and kids at home.

### i29-a14 Build a little free pantry by the sidewalk (M, 🟠)
Build it once for $120 (a homeowner or renter with landlord okay). Then a weekly 'stock it' line of about $8 in turn.js.
Each month it's stocked: community +1, happy +1. If you stop stocking, a neighbor starts filling it too.
Touches state.js (S.pantryBox), turn.js, ui.js (Home chip).
Balance: a small steady cost for a small steady gain; it can't be farmed.

### i29-a15 Borrow from the Grange tool library (M, 🟠)
Needs Grange membership or community 30+.
Fixer-house and repair events in features.js and events.js get a 'Borrow it from the Grange' choice that cuts the cost by about a third.
Donating tools once gives community +2 and unlocks a thank-you line.
Balance: you still pay most of the cost and must have the standing.

### i29-a16 Sit on the Grange's help committee (L, 🟠)
Unlocks at community 55+. A quarterly card with three short anonymous requests (a car repair, a funeral cost, a heating bill) and money for two.
Your picks change small things later: the person you helped turns up in a good event.
Touches features.js (new chain), state.js, a small data table of request texts.
Balance: costs a little time (happy -1 from the hard choice) and gives community +3; no money flows to you.

### i29-a17 The giving tree at the grocery store (S, 🟡)
Event in events.js, month 11.
Give: one tag $40 (happy +3, community +1) or three $120 (happy +5, community +3).
Receive: money < 0 and kids at home, a gift shows up and kids' happiness cost is waived that month.
Balance: seasonal and small.

### i29-a18 A coat closet before the first frost (S, 🟡)
Event in events.js, month 9, needs kids at home.
Give (community +2) or take (food & utilities -$50 that month); if money is low, both choices show.
Balance: tiny, seasonal.

### i29-a19 Rent-to-own couch or the church rummage sale (S, 🟠)
Event in events.js; the rent-to-own choice adds a 52-week $25 line (about $1,300) to turn.js.
The rummage choice costs $40 and needs a pickup or a friend (community 30+).
Balance: the trap is shown in plain numbers before you pick; careless play pays more.

### i29-a20 Help a friend out of a payday loan (M, 🟠)
Two-step chain in features.js. Needs the credit union idea for the best choice.
Walk them to the credit union: a focus week, community +3, happy +3 when they're clear. Lend: ties to 'Lending money to a friend' (i14-b13).
Balance: the helper path costs time or money; no direct cash return.

### i29-a21 A free budget sit-down at the credit union (S, 🟡)
Reads the existing turn breakdown lines from turn.js (keep a 13-week rolling total per line in S.spendLog).
Shows a simple table in a modal in ui.js. No stat change, just information.
Balance: information only.

### i29-a22 Neighbors pass along job leads when you're out of work (S, 🟠)
In turn.js, when there's no job and community >= 40, a small weekly chance adds a 'heard about' job to the board with +0.15 hire odds.
Balance: rewards a life spent showing up, not idle play; low community players still use the regular board.

### i29-a23 Hide it or tell them: the layoff talk at home (S, 🟡)
Event in events.js right after a layoff, if partner or parents are around.
Tell: happy -3 now, then +1 a week for 4 weeks. Hide: happy -1 a week until you find work, then a talk with happy -4.
Balance: no money effect; honest play does slightly better.

### i29-a24 A gas card for the job hunt (S, 🟡)
Event in events.js: no job, money under $500. Gas card covers one month of commute gas.
Later, with a job and money over $3,000, a 'drop one off' choice (cost $50, happy +2, community +1).
Balance: small, once each way.

### i29-a25 Ask the coach about the sports fee (S, 🟡)
Event in events.js, kids 6–17, money under $300.
Ask: fee waived, kid joy stays up. Skip: happy -3. Later give-back: $100, community +2.
Balance: only when you're truly short.

### i29-a26 Drive the senior meal route on Tuesdays (M, 🟠)
A weekly commitment like the carpool: toggle on the Life tab, needs a car and a schedule that allows it (no long commute, or retired).
Each week: community +0.5, happy +0.5, health 0; gas is repaid. A rare event: someone on your route isn't answering, and you call for help.
Balance: small weekly gains, and it uses the time a careless player would not set up.

### i29-a27 Bring food after a funeral (S, 🟡)
Event in events.js, about once a year.
Bring a dish and stay to clean up (cost 20, community +3, happy +1), drop off a card (community +1), or don't go.
Balance: quiet, small, about being there.

### i29-a28 A 'carried and carried others' line on your life story (S, 🟠)
Add S.helpIn and S.helpOut counters that the events in this group (and the food bank, levee and meal choices) bump.
Show one line in the end screen in features.js and in the yearly recap.
Balance: no score change, so it can't be farmed.

### i29-a29 A 'When money's tight' page in Help (S, 🟠)
New section in help.js; numbers pulled from game data (credit union rate, loan shop rate) so Help can't drift.
No shame words: 'Everyone needs help sometimes.'
Balance: information only.

### i29-a30 Your first full paycheck after a hard stretch (S, 🟡)
A one-time card in turn.js when a job starts after S.ui ran out or money went from negative to positive.
Choices: thank-you card (community +2), pay forward $50 to the food bank (happy +3), or rest (happy +2).
Balance: small and only after real hardship.

### i29-a31 Share a Thanksgiving table (S, 🟡)
Event in events.js, month 10, money over $0.
Host three extra (cost 60, happy +5, community +3) or go to the church community dinner and help serve (community +2, happy +2, no cost).
Balance: holiday-only, small.

## Ideas 29: Arts, music and making things

Ideas for creative life in Waitsburg: instruments and the jam, theater, quilts, paint, woodworking you give away, writing, photos, a craft bazaar and teaching, all paid back in happiness and community more than cash.

### i29-b01 Buy a used instrument at the Junque Sisters (S, 🔴)
Pick up a beat-up guitar, fiddle, banjo or mandolin for $60 to $250. It sits on Home as yours, can be resold, and is the key that opens the practice and jam ideas below.
- A once-a-season shelf item at the vintage shop (outabout.js STOPS 'junque' acts) sets S.instrument = {kind, q}.
- Cheap ones play worse: quality nudges practice gains a little.
- Balance: costs real money up front and does nothing by itself; idle play never buys it.

### i29-b02 Practice nights: a Music track on the Skills card (M, 🔴)
Rest weeks with an instrument add music practice points, and a weekly lesson from a retired fiddler adds more. Levels unlock jam roles, gigs and teaching, not a bigger number.
- Adds a 'music' key to SKILLS in features.js; skillWeek() gives 0.5 a Rest week if S.instrument.
- Lesson act ($25) at Tonnage on off weeks gives +1.5, once a week.
- Builds on i11-a04's hobby, but as a real skill line with its own perk text.
- Balance: Rest streak fade (focusEffect) still applies; points cap at 60 like other skills.

### i29-b03 Tunes you know: a short list that grows (S, 🟡)
Each music level teaches you a named old-time tune (Soldier's Joy, Old Joe Clark, Red Haired Boy, Angeline the Baker). Known tunes show on the Skills card and in the Journal.
- A TUNES array in features.js; practice() level-ups push the next tune.
- Public-domain fiddle tunes only.
- Balance: flavor only; no stat change, so it can't be farmed.

### i29-b04 From the back row to calling tunes: the jam ladder (M, 🔴)
The jam remembers you: listener, then sitting in, then taking a break (a short solo), then calling a tune for the circle. Each rung needs a music level and a few jams at the rung before.
- S.jamRung and S.jamCount in state.js; the Tonnage jam event (outabout.js ~299) shows the choice for your rung.
- Extends i11-a21 (sit in) and i14-b26 (potluck) instead of repeating them.
- Balance: upper rungs give community, not happiness, and the i15-a27 fade still caps per-season gains.

### i29-b05 Your first solo: push through or sit it out (S, 🟠)
The first time the circle nods at you to take a break, your hands shake. Push through (a chance to flub it, then a bigger lift next time) or pass and wait another jam.
- One-off story event tied to the ladder in outabout.js, using chance() with music level.
- Flubbing costs a little happy now; it's a Journal moment either way.
- Balance: a gamble with a small downside, so blind clicking doesn't win.

### i29-b06 The slow jam for beginners (S, 🟠)
The first hour of every jam plays at half speed for learners. At music level 2 you can be the one who leads it, which pays community and makes a regular out of a shy newcomer.
- A second act on Tonnage, 'Slow jam', and a 'Lead the slow jam' choice at level 2+.
- A named newcomer (stand-in name) can become a friend in the Journal.
- Balance: leading costs your Town focus that week, no money in.

### i29-b07 Three regulars start a band (L, 🟠)
After enough jams, two regulars ask you to form a band. Rehearse on Town weeks, then play the wine bar, a wedding at the fairgrounds or the fall barn dance for small pay and a big night.
- S.band = {name, gigs}; a gig event pool in events.js with month rules (barn dance in October, weddings in June).
- Pay is $40 to $120 a gig split four ways; a gig week skips your usual side hustle.
- Balance: rehearsals take focus weeks and a missed rehearsal can split the band; money is never the reason to do it.

### i29-b08 Name the band (and the town has opinions) (S, 🟡)
Pick a band name from three, or type your own. The Tattler line mentions it and the coffee shop regulars rib you about it.
- Small text input reusing the game-name picker pattern (TODO #91 style).
- Feeds the Tattler pool in outabout.js TATTLER.
- Balance: flavor only.

### i29-b09 Busk on Main during Celebration Days (S, 🟡)
On the festival week, set out your case on the sidewalk and play for an afternoon. Tips scale with music level; kids dance; somebody films it.
- A festivalWeek() act on the Main Street map stop in outabout.js.
- Tips: $5 at level 0 up to $60 at level 3.
- Balance: once a year, so it never becomes a side hustle.

### i29-b10 Community theater: auditions in January, the show in March (L, 🔴)
The Touchet Valley Players (stand-in) hold winter auditions at the Grange hall. Get a lead, the chorus or the stage crew, then give six Town weeks to rehearsal for an opening night in March.
- A chain in STORY_EVENTS (features.js) with chainSet steps: audition, cast list, rehearsals, opening night.
- Role odds use the People skill; missing rehearsals risks being recast.
- Balance: a long commitment with a real cost in weeks; payoff is a big happy and community lift once a year, with a fade for repeats.

### i29-b11 Opening night: you go up on your lines (S, 🟠)
Mid-scene, the next line is gone. Ad-lib (People skill helps), freeze and get prompted, or look at your scene partner and hope. The town remembers it kindly either way.
- One step in the theater chain with three choices; result text varies with skill.
- A Journal milestone and a Tattler line next week (i24-a27 hook).
- Balance: no option scores big; good prep (attended every rehearsal) lowers the odds of the event at all.

### i29-b12 Build the set: theater crew uses your Handy skill (S, 🟠)
Crew members build flats and a porch for the stage. Your Handy level decides whether the porch holds up all three nights, and it gives Handy practice too.
- Crew role branch in the theater chain; practice('handy', 2).
- A wobbly set adds a funny line, not a penalty.
- Balance: crew is the low-pressure path for players who don't want a part.

### i29-b13 The Tuesday quilting circle (M, 🔴)
The Main Street Stitchers (stand-in) meet in a church basement every Tuesday. Going adds quilt progress and gossip; a full quilt takes about ten circles.
- A weekly act on a new map stop in outabout.js; S.quilt = {progress, pattern}.
- Gossip lines give hints about upcoming events (a job opening, a house for sale).
- Balance: small happy and community each time with the same per-season fade as the jam.

### i29-b14 Finish a quilt: who gets it? (S, 🟠)
A finished quilt goes to a new baby in town, a family who lost their house, your own bed or the fire department raffle. Each choice pays back differently, and you remember where it went.
- Event fired when S.quilt.progress hits 100; outcome added to a 'Things you made' list (see below).
- Distinct from i11-a23's school auction: this is the giving choice for every quilt.
- Balance: giving pays community, keeping pays happy, raffle pays the town goal; none pays you cash.

### i29-b15 Pick a quilt pattern and colors (S, 🟡)
Before a quilt starts, choose Log Cabin, Flying Geese or Wheat Sheaf and a color set (harvest gold, river blue, barn red). The finished quilt is described in words in your Journal.
- A small sheet in ui.js; the description string joins pattern, colors and a skill-based quality word.
- Harder patterns take more circles but are worth more at the raffle.
- Balance: pure choice, tied only to time.

### i29-b16 Paint the valley on Outside weeks (M, 🟠)
Bring an easel on an Outside week and paint one of six spots: the wheat hills in June, the Touchet bridge, the fairgrounds grandstand, Preston Avenue, the grain elevator at dusk or Bluewood in snow.
- S.paintings[] with place and season; spot list in maps.js so the map can show a small easel icon.
- A painting kit ($80, once) at the vintage shop or Walla Walla trip.
- Balance: Outside weeks already pay health and happy; painting adds a little more happy but no money until a show.

### i29-b17 Every painting gets a line of its own (S, 🟡)
Your paintings are described in words built from place, season, light and skill: 'Muddy sky, but you got the elevator's shadow right.' Better skill, kinder lines.
- A say()-style template in features.js (i21-a22 helper if it lands).
- Shown on Life and in the ending.
- Balance: flavor only.

### i29-b18 A month on the coffee shop wall (M, 🟠)
With five paintings done, the coffee shop offers its wall for a month. Each week a painting may sell for $40 to $200, and one buyer is somebody you know.
- An offer event in events.js when S.paintings.length >= 5; weekly sale roll during the show.
- Unsold paintings come home; sold ones go on the 'Things you made' list.
- Balance: a once-a-year offer with modest money; painting fast and badly sells less.

### i29-b19 Woodworking projects with a finish line (M, 🔴)
Pick a project in the garage: cutting board (2 sessions), step stool (4), Adirondack chair (6), cradle (8) or a cedar chest (10). Rest weekends move it along; when it's done, you choose who gets it.
- S.project = {kind, done, need} in features.js; Rest weeks with the Handy skill add a session.
- Separate from the woodworking business in BIZ: this is one thing at a time, made for someone.
- Balance: lumber costs money up front; only one project at a time; finished items pay community or happy, not cash.

### i29-b20 Give it away: a gift that lands (S, 🟠)
When a project is done, give it to your partner, a kid, a neighbor, a coworker or the school. Each gift writes a Journal line and some come back later (the cradle passes to the next baby).
- A gift sheet that reuses the finished-quilt pattern; flags remembered for later events.
- Ties into i25-b17's gift shelf without repeating it.
- Balance: gifting to the same person twice gives less.

### i29-b21 A bench for the park, with a small plaque (M, 🟠)
At Handy level 3, build a cedar bench for the city park. It takes most of a season, and after that it shows on the town map with your name on a plaque.
- A once-a-life project with a map marker (maps.js) and a lasting +1 community floor.
- Lumber $400; council approves it in an event (People skill helps).
- Balance: the lasting perk is small and only one per life.

### i29-b22 The unfinished-projects pile (S, 🟡)
Start a new project before finishing the last one and the half-done one goes on the pile. A full pile nags on Home and costs a little happy until you finish or give up on one.
- S.pile[] in features.js; a gentle Home chip in ui.js.
- Giving up refunds nothing but clears the nag.
- Balance: punishes scattered, careless starts and rewards seeing things through.

### i29-b23 Fix a cracked fiddle for a kid (S, 🟡)
A family brings a cracked fiddle they found at the vintage shop. With Handy 2 and a woodshop class behind you, glue the top so their kid can play at the jam.
- One-off event when you have the Handy skill and a Simply Shavings class in your history.
- A Journal line later when the kid plays at the jam.
- Balance: no money; a community lift and a story.

### i29-b24 Your own column in the Tattler (M, 🟠)
The paper offers a monthly column, 'Notes from the Burg.' Pick a topic each month (a person, a place, a season, a gripe); readers react, and a good one is clipped and pinned at the café.
- A monthly event in events.js with four topic choices; $25 a column; S.column count.
- Different from the reporter job (i8-b30) and one-off letters (i4-a02): a regular unpaid-ish voice.
- Balance: a gripe column can cost community; skipping two months in a row ends the column.

### i29-b25 A book of valley stories, a hundred copies (L, 🟡)
Write one chapter every few months. After eight chapters, print a hundred copies and sell them at the vintage shop and the craft fair; the library keeps one forever.
- S.book = {ch} with chapters written from Study or Rest weeks; print cost $600.
- Copies sell slowly over a year; the book shows in the ending.
- Balance: barely breaks even; the payoff is a lasting badge and a line in the obituary.

### i29-b26 Photograph the valley, described in words (M, 🟠)
With a camera ($150), some Outside or Town weeks offer a shot: the combine at dusk, a Cardinals tackle, frost on the fence. Each photo is a line of words with a light and a framing word.
- S.photos[] with a description built like paintings; reuses i4-a15's shoebox limit if that lands.
- A photo skill grows from shots taken, not from money.
- Balance: small happy per keeper; separate from i28-b27's one-off sunset post.

### i29-b27 The town calendar contest (S, 🟠)
In fall the paper picks twelve valley photos for next year's calendar, sold to raise money for the pool. Enter your best three; a winning month means your name on a kitchen wall all year.
- A September event reading S.photos; odds from photo skill and season fit.
- Winner: community +4 and a Journal milestone; calendar sales feed the season goal.
- Balance: no cash prize; entering with no photos isn't offered.

### i29-b28 A booth at the December craft bazaar (M, 🔴)
The school gym holds a holiday bazaar the first Saturday in December. Rent a table for $30 and bring what you made in the fall: cutting boards, a quilt, prints, jam. What sells depends on what you made and how well.
- A December event in events.js reading S.project, S.quilt, S.paintings, S.photos stock.
- Not the summer market stall (i1-a31): winter, one day, made goods only.
- Balance: empty-handed players can only browse; leftover stock waits for next year.

### i29-b29 Teach a beginner class at the woodshop (M, 🟠)
At a level-3 craft (Handy, Music or painting), the makerspace asks you to teach a four-week beginner class. Pays $40 a class and turns students into people who wave at you on Main.
- An offer event on the Simply Shavings stop; four Town-focus weeks.
- Different from i9-a15 (job-based class at the library): craft-based, any age.
- Balance: needs real skill first; nervous first class can go badly.

### i29-b30 Your kid takes piano lessons (M, 🟠)
A kid from 7 to 14 can take lessons for $60 a month. Nag them to practice or let it slide; the spring recital shows how it went, and some kids quit, some keep going for life.
- A kid flag in the kids system with a monthly cost line in turn.js; a May recital event.
- Your Rest and Town weeks count as practice support.
- Balance: money and attention cost; nagging too much lowers the kid's mood.

### i29-b31 Your skills meet at the spring show (S, 🟡)
If you paint, the theater asks you to paint the backdrop; if you play, you sit in the pit band; if you build, you're on set crew. Doing your craft for the show counts as rehearsal.
- Extra choices in the theater chain gated on painting, music and Handy levels.
- Gives craft players a way into the show without acting.
- Balance: same week cost as rehearsal; it only swaps the role.

### i29-b32 Making it through a hard week (S, 🟠)
When a rough-patch event hits, players with a craft get one more choice: an evening in the garage, at the easel or with the fiddle. It eases the blow a little without fixing it.
- An if: choice on 'A rough patch' and similar events in events.js, gated on any craft level 1+.
- Happy +2 and a calm line; no money.
- Balance: a small cushion that only practiced players earn.

### i29-b33 Things you made, and where they are now (M, 🟠)
A Life tab card lists what you made: the cradle at the Lopez house, the bench by the park, the quilt the fire department raffled. The ending reads it back.
- S.made[] filled by quilts, projects, paintings, photos, columns; a card in ui.js and lines in the ending.
- Feeds i2-b01's obituary if it lands.
- Balance: a record, not a score boost.

### i29-b34 Creative payoffs only from finished work: a sim check (S, 🔴)
Add the new craft systems to the balance sim with a careless bot (starts everything, finishes little) and an idle bot. Creative choices should lift good play a few points and never lift idle or careless play.
- Extend the bot plans in tests/ to start projects, quilts and jam rungs at random.
- Assert careless median <= 60 and idle <= 50 still hold with crafts on.
- Balance: this is the guard for the whole group.
