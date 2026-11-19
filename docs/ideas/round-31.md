# Ideas round 31

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 31: Public places

The shared places of Waitsburg as things you use, watch change over a long life, and help keep going.

### i31-a01 Shared places wear down and get cared for (L, 🔴)
Nine public places (library, Preston Park, pool, post office, fairgrounds, school gym, cemetery, riverwalk, depot) each get a care level that slips a little every week. What players do raises it; storms, floods and neglect lower it.
- New `S.places` object, one 0–100 care number per place, drifting down about 0.3 a week in turn.js.
- Map pins in maps.js get a word for their state: tidy, a bit worn, run down.
- Balance: care never adds to Life Score directly. It only changes what places give you, so idle play can't farm it.

### i31-a02 Pitch in at a public place (M, 🔴)
Tap a public pin and choose "Pitch in" as your Town week: pick up the park, shelve books, paint the bleachers. It raises that place's care and your community.
- A new action on public pins in maps.js; the week runs through the normal community focus in turn.js.
- Gives +2 community and +10 care to that place.
- Balance: the same place gives half as much if you pitched in there in the last 8 weeks, so one cheap loop can't carry a life.

### i31-a03 Let a place slide and it closes a door (M, 🔴)
When a place stays run down, it loses something real: the pool doesn't open in summer, the library drops Saturday hours, the park restroom gets locked.
- Checked in turn.js at season starts; each loss is an event in events.js with a plain line in the week summary.
- The lost thing comes back once care climbs over 50 again.
- Balance: careless and idle lives let places slide, so they lose park and pool happiness. Good play keeps them open.

### i31-a04 A seat on the parks board (M, 🔴)
After a year of pitching in, City Hall asks you to join the parks board. Each season you pick which place gets the city's small fix budget, and folks tell you what they think.
- A chain in features.js (chainSet) that starts when you've pitched in 6+ times.
- Each quarter a choice sheet: one place gets +20 care; the most neglected place may bring a grumble event.
- Balance: no money, just choices. Costs one Town week a quarter.

### i31-a05 Adopt a place for life (M, 🟠)
Once per life you can sign up as the keeper of one public place. If you pitch in there at least once a season, it holds its care better and the town starts calling you by it ("the pool lady").
- `S.keeper` set from the place sheet; turn.js halves that place's drift while you keep it up.
- A few keeper-only events in events.js, like the kids who grew up swimming there thanking you.
- Balance: skip a season and the bonus and title lapse.

### i31-a06 Friends of the Library book sale (S, 🟠)
Each April, Weller Public Library holds a sale: a bag of books for a few dollars. You can also donate boxes when you move, and the money helps the library's care.
- A seasonal act on the library pin (outabout.js style act, months:[4]).
- Buying gives +2 happiness; donating during a move gives +1 community and +5 library care.
- Balance: once a year.

### i31-a07 A seed library at Weller (S, 🟡)
In March and April the library hands out free seed packets. Bring back saved seeds in the fall and the library keeps it going.
- Library act in March–April; a fall follow-up note if you took seeds and have a yard.
- Small happiness boost to garden starts that spring.
- Balance: free but tiny, and the fall return only counts if you took seeds.

### i31-a08 Borrow your textbooks through the library (S, 🟠)
Study weeks at Weller can borrow course books by interlibrary loan, so school costs a little less.
- In turn.js, school cost drops 10% for terms where most study weeks were at the library pin.
- Balance: you still pay tuition and still do the weeks; it only rewards using the real place.

### i31-a09 The library as a cool room in smoke and heat (S, 🟠)
On wildfire smoke weeks or hot spells, the library opens as a cool, clean-air room. Going there spares you the health hit.
- New smoke and heat-wave weeks in events.js (summer, rare) add a "Spend the day at the library" choice.
- Balance: saves health, costs the week's focus. Careless play that ignores it takes the hit.

### i31-a10 Reserve the Preston Park shelter (S, 🟡)
Book the shelter for a birthday or graduation for a small deposit. Clean up after and you get it back, and the park stays nice.
- A park act with a deposit; a follow-up line returns it if you chose to clean up.
- Clean up: +5 park care. Leave a mess: lose the deposit and -5 care.
- Balance: one party a season.

### i31-a11 Storm takes a limb off a park tree (M, 🟠)
A windstorm drops a big limb in Preston Park and closes it for two weeks. Join the cleanup crew, and in the fall help plant a new tree you can watch grow over the years.
- A chain in features.js with a cleanup step and a fall planting step.
- The park sheet keeps "your tree" with the year it went in.
- Balance: a feel-good payoff later, not a stat engine.

### i31-a12 Opening day and the last day at the pool (S, 🟠)
The city pool opens on Memorial Day weekend and closes after Labor Day with a dog swim before it's drained. Each is a small, happy Town-week moment.
- Two dated events in events.js; only fire if the pool is open that year.
- +3 happiness, +1 community; the dog swim gives more if you have a dog.
- Balance: twice a year at most.

### i31-a13 Scrub and paint the pool in May (S, 🟠)
Before the pool opens, a work party scrubs and repaints it. Show up and the pool opens on time with a fresh coat.
- A May call on the pool pin; +15 pool care.
- A small health cost on a hot day, more if your health is low.
- Balance: this is the main way to keep the pool open, so idle lives lose it.

### i31-a14 Morning water aerobics at the pool (S, 🟡)
Summer mornings at the pool have a water class for older folks. It's cheap and easy on the joints.
- A pool act for age 55+ in June–August; +3 health, +1 community.
- Balance: summer only, and only if the pool is open.

### i31-a15 Rent a P.O. box (S, 🟡)
Lots of folks in town get mail at a P.O. box. Rent one each year and the trip for mail becomes a chance to see people; forget to renew and a bill notice comes late.
- `S.pobox` set from the post office pin; a yearly renewal line in turn.js.
- Small community trickle; a missed renewal can add a late fee once.
- Balance: costs money yearly and gives only a little.

### i31-a16 The postmaster knows what's going on (S, 🟡)
The person at the post office counter hears everything first. Once a month they might mention a job opening, a house going up for sale, or someone who needs a hand.
- A monthly tip on the post office pin, pulling from existing job and home lists.
- Balance: a tip, not a guarantee; you still apply or buy the normal way.

### i31-a17 Grandstand work weekend before Celebration Days (S, 🟠)
The week before Celebration Days, volunteers fix and paint the fairgrounds grandstand. Pitch in and you get better seats for the horse races.
- An April/May event on the fairgrounds pin; +15 fairgrounds care, +2 community.
- Race-day happiness is higher that year if you helped.
- Balance: one week, once a year.

### i31-a18 Winter storage in the fairgrounds barns (S, 🟡)
From fall to spring the empty barns rent stalls for boats, trailers and project cars. It's cheap, and the fees help keep the fairgrounds up.
- A fairgrounds act October–April for players with a boat or second vehicle.
- Saves a little on wear; +5 fairgrounds care.
- Balance: costs rent and only helps if you own something to store.

### i31-a19 Animals come to the fairgrounds in a wildfire (M, 🟠)
When fire runs in the foothills, farm animals are brought to the fairgrounds. You can haul water and do night shifts, and a cared-for fairgrounds handles it better.
- A wildfire event in events.js with a help choice; outcomes better when fairgrounds care is high.
- Ties to farm jobs and the smoke weeks above.
- Balance: helping costs health and a week; skipping costs community.

### i31-a20 Blood drive in the school gym (S, 🟡)
A few times a year a blood drive sets up in the school gym. Give and you're tired for a week, but folks notice.
- A quarterly event; -1 health that week, +2 community.
- A badge after four drives in features.js BADGES.
- Balance: blocked when health is low.

### i31-a21 Winter walking in the school gym (S, 🟠)
On icy months, the gym opens early for walkers. It keeps your health up without the slick sidewalks.
- A school pin act in December–February; +2 health, +1 community.
- Lowers the odds of a winter slip-and-fall event that week.
- Balance: cheap but takes a focus week.

### i31-a22 Cemetery cleanup before Memorial Day (S, 🟠)
The town straightens headstones, trims grass and sets flags at the Waitsburg City Cemetery. It's a quiet day that means a lot to people.
- A May work-day event; +2 community, +15 cemetery care.
- Separate from visiting your own family plot.
- Balance: once a year.

### i31-a23 October history walk in the cemetery (S, 🟡)
Volunteers stand by old graves and tell the stories of early families. After your first year you can take a part yourself.
- An October event; first year you watch (+2 happiness), later years you can play a part (+3 community).
- Balance: once a year; a speaking part needs people skill 1.

### i31-a24 Buy a cemetery plot (S, 🟡)
Later in life you can buy plots at the city cemetery. It's one less thing for the family to sort out.
- A once-only City Hall act, age 60+, like the will in outabout.js.
- +2 happiness, and the family has an easier time in end-of-life events.
- Balance: costs money and gives no score.

### i31-a25 The riverwalk after high water (M, 🟠)
When the Touchet floods, mud and branches cover the levee trail and it closes. Crews clear it, faster if players pitch in.
- A spring high-water event in events.js; riverwalk care drops 30 and the river pin loses its walk act until care is back over 40.
- Balance: careless play leaves the trail shut longer; good play gets it back.

### i31-a26 Plant willows on the riverbank (S, 🟡)
In spring, volunteers plant willows along the Touchet. Years later they shade the water, and fishing gets a little better.
- A spring riverwalk event; logs the year planted.
- After 5 years, fishing odds rise a touch on the river pin.
- Balance: slow payoff that only long lives see.

### i31-a27 The old depot, open on Saturdays (L, 🟠)
The boarded-up rail depot gets one fix a year when the town's places are cared for. After a few years it opens Saturdays with old photos, and you can volunteer there.
- A depot pin added in maps.js with stages tracked in `S.places.depot`.
- Each yearly fix needs town care to average 50+.
- Balance: rewards keeping the whole town up, not one action. Separate from fixing the Grange hall.

### i31-a28 The water bill and the City Hall clerk (S, 🟡)
Your water and sewer bill shows in the monthly bills. Paying at the counter instead of online is a chance to chat and hear what City Hall is working on.
- A line in the bills code; a City Hall act on the Main St. pin.
- +1 community; tells you which place the city plans to fix next.
- Balance: costs nothing extra but uses a visit.

### i31-a29 Borrow a church hall for your reception (S, 🟠)
A church hall in town lends its kitchen and tables for a wedding reception for much less than a Walla Walla venue. Members help set up.
- A choice in the wedding event; cheaper than other venues.
- +2 community; the hall asks for help at their next dinner.
- Balance: saves money but owes a favor later.

### i31-a30 Winter coat closet in a church basement (S, 🟡)
In the fall, donate a coat you don't wear. In a hard winter when money is short, you can get one there.
- A fall act for donating; a winter offer if you're in debt.
- Balance: donation is small; the help only shows up when you need it.

### i31-a31 Lights on the grain elevator at Christmas (S, 🟠)
Every December, a crew strings lights on the grain elevator and the whole town can see them. Help with the setup or just go watch.
- A December event on the elevator pin; watch gives +2 happiness, helping gives +2 community too.
- Balance: once a year.

### i31-a32 The elevators on the skyline: coming home (S, 🟡)
After you've been away three weeks or more, the first sight of the grain elevators gets a short line and a small happiness lift.
- A check in turn.js after trips or long work stretches; once a month at most.
- Balance: tiny, and only for players who leave and come back.

### i31-a33 Then and now on each place's sheet (M, 🟡)
Each public place keeps a short log of what changed in your life: a new roof, a summer it didn't open, the tree you planted.
- A list on `S.places[k].log` written by the events above, shown on the place sheet.
- Balance: words only, no points.

### i31-a34 The town you leave behind on the end screen (S, 🟠)
The end screen shows how each public place stood when your life ended and what you did for it.
- Reads `S.places` in the end-screen code in features.js.
- Balance: no score change; it just makes care feel worth it.

## Ideas 31: Unlocking systems over a game

The Burg has a lot of systems now; these ideas open them one at a time through story moments, scaled to the game length, with a way for experienced players to open everything.

### i31-b01 One unlock table for every system (M, 🔴)
A data table in js/state.js: id, label, icon, when(S), moment text, and a hard deadline week per game length.
ui.js, features.js and outabout.js wrap each card, chip and focus button in isOpen(id).
Saved as S.opened {id: week} so reloads and old saves keep what was opened (old saves start with everything open).
Balance: UI only. No system pays more for being opened late, and nothing a good player needs is held back past its deadline.

### i31-b02 Week 1 is just four focuses, stats and End Week (M, 🔴)
Home in ui.js: the focus grid draws only open focuses (4, then 5, then 6), in the same spots so the layout doesn't jump.
The fdesc line under the grid stays the same.
Week 1 also hides the trip chip, Out and about button and Life Score button until their moments.
Balance: Rest/Town/Outside already keep careless play in check; no early access to Hustle means careless bots can't grind gigs in week 1.

### i31-b03 Classes open when you tap a locked job (S, 🟠)
explainLocked() in ui.js calls openSystem('study').
Deadline: week 6 (6 months), week 10 (longer games).
The tutorial already walks this path, so it matches.
Balance: no change to tuition or study weeks.

### i31-b04 Side hustle opens with a neighbor asking for help (S, 🟠)
New one-off event in events.js tagged unlock:'hustle'; picks the season's gig for the text.
openSystem('hustle') in the event result.
Balance: the event pays a small one-time amount either way, and the hustle strain rules (B8 tip) apply from the first gig.

### i31-b05 Out and about opens with a walk down Main Street (S, 🟠)
outButton() in outabout.js checks isOpen('out').
The moment is a toast-sized card on Home, not a full event.
Balance: one visit, normal OUT_FX values; the weekly cap starts counting from the second.

### i31-b06 Trips open when town runs out of something (S, 🟠)
tripChip() in features.js checks isOpen('trip'); the trigger reads S.svc age, month (tires) and turn.
Deadline: week 8, or week 4 in 6-month games.
Balance: the first trip is a normal trip with normal costs.

### i31-b07 A coworker offers a ride: carpools open with a long commute (S, 🟠)
apply() in ui.js calls openSystem('carpool') when CITIES[j.city].miles >= 20.
The Jobs tab only shows carpool and remote rows once open.
Balance: carpool math unchanged; the system just shows up when it matters.

### i31-b08 Skills appear the first time you earn a point (S, 🟠)
practice() in features.js calls openSystem('skills') on the first point.
skillsCard() returns '' until open.
Balance: skill points are earned the same way, open or not; nothing is lost while hidden.

### i31-b09 Goals and badges open with your first report card (S, 🟠)
goalsCard() and the badge list wait for isOpen('goals'); the report card in turn.js calls openSystem.
Goals pinned later still get full points if done (GOAL_POINTS unchanged).
Balance: a goal can't be finished by accident in weeks 1 to 13 and then cashed in, because goals only count once pinned.

### i31-b10 Town goals start at the first new season (S, 🟡)
seasonLine() in ui.js waits for isOpen('town').
Uses the existing season goal; nothing new to tune.
Balance: no reward lost: the first goal simply starts when the box opens.

### i31-b11 Stories wait until your second month (S, 🟡)
STORY_EVENTS pick in features.js checks isOpen('stories') (week 6, or week 3 in 6-month games).
One new tag on the event card for the first chain.
Balance: story rewards are the same; fewer events in weeks 1 to 5 doesn't shift the medians (check in the sim).

### i31-b12 The 401(k) opens with your first benefits packet (S, 🟠)
apply() opens 'k401' for jobs with benefits; renderLife() hides the card until then.
The 'You're hired' sheet gets the 0/5/10% buttons once.
Balance: same match and growth; a player can still pick 0%.

### i31-b13 Buying a home opens when a down payment is in reach (S, 🟡)
renderLife() home card: rentals shown, owned homes folded with one line on what opens them.
Trigger: S.turn >= 26 or money >= 80% of the cheapest down.
Balance: you couldn't afford them earlier anyway; no change to prices.

### i31-b14 Business opens after a year with savings (M, 🟠)
bizCard() in features.js waits for isOpen('biz'); a one-off event in events.js opens it and names the three kinds.
Lifetime games can also open it from the farm-kid background on day one.
Balance: the business is a long payoff; hiding it from short games stops a money sink that can't pay back, and from careless early buys.

### i31-b15 A 'New' tag on anything just opened (S, 🔴)
A newTag(id) helper in ui.js reads S.opened and prefs().seenNew.
Nav buttons in render() get a dot when any open-but-unseen item lives on that tab.
Screen readers hear 'new' in the label.
Balance: none, UI only.

### i31-b16 The unlock card: two lines and 'Show me' (M, 🔴)
An unlockCard() on Home in ui.js, using UNLOCKS moment text.
'Show me' reuses the coach ring from help.js on the item's selector.
Queue in S.unlockQ so two opens never stack.
Balance: none.

### i31-b17 Short 'Show me how' tours for each system (M, 🔴)
A MINI_TOURS table in help.js, each a short TSTEPS list run on the real life (no saving changes, no turn played).
Replayable from the system's Help section.
Balance: tours never spend money or a week.

### i31-b18 'Coming up in your life' in Help (S, 🟠)
showHelp() in help.js reads UNLOCKS and S.opened.
Only the next two, no full spoiler list.
Balance: hints point at normal play, not at a score trick.

### i31-b19 'I know this one': open any system early (S, 🔴)
openSystem(id, {quiet:true}) from the teaser.
Logged in S.opened with how it opened, for the sim report.
Balance: opening early gives nothing extra; the system works the same as if its moment had come.

### i31-b20 Start setting: 'Open as I go' or 'Everything open' (S, 🔴)
A new row in renderTitle()'s more panel, saved in prefs and copied to S.unlockMode.
'Everything open' fills S.opened at newGame() with no cards or tags.
Balance: the sim runs both modes; scores must match within noise.

### i31-b21 Your device remembers what you've met (S, 🟠)
A device key theburg.metSystems.v1 next to BADGE_KEY; included in backups.
newGame() reads it when unlockMode is 'Open as I go'.
Balance: none.

### i31-b22 Unlock pace follows game length (M, 🔴)
UNLOCKS rows carry deadline:{half,two,five,life}; a week-end check in turn.js opens anything overdue with its normal moment.
Shown in the Coming up list as 'by week N at the latest'.
Balance: deadlines are set so a good player's sim bot gets every tool it uses today in time; check good play >= 70 stays.

### i31-b23 6-month lives skip systems that can't pay off (S, 🟠)
UNLOCKS rows get lengths:['two','five','life'] where they make no sense in half.
'Everything open' still shows them for players who want them.
Balance: removes money traps in short games; check careless median doesn't rise (they are mostly losses for careless bots).

### i31-b24 Lifetime chapters: what opens at 25, 35 and 50 (M, 🟠)
UNLOCKS rows with an age() rule; the moment fires on the birthday week in turn.js.
Council and retirement already exist; this only times when their rows show.
Balance: the council needs years in town anyway; nothing pays more for waiting.

### i31-b25 Backgrounds start with their own systems open (S, 🟠)
BACKGROUNDS in state.js get opens:[...]; newGame() fills S.opened.
The start sheet lists 'Open from day one'.
Balance: only visibility changes; the B3 grad tuning stays as is.

### i31-b26 Challenges, weekly runs and heirs start with everything open (S, 🟡)
newGame() and startWeekly()/startLegacy() in features.js set unlockMode 'all'.
Keeps weekly scores fair between new and old players.
Balance: same seed and same tools for everyone in a weekly.

### i31-b27 The Menu grows with you (S, 🟡)
showMenu() in ui.js checks S.turn and hasRecords().
'Everything open' shows all rows.
Balance: hiding 'End this life now' early stops new players quitting at week 1 with a harsh score.

### i31-b28 The title screen grows after your first life (S, 🟠)
renderTitle() reads the met-systems key and hasRecords().
'Show all options' is remembered in prefs like moreOpts.
Balance: none.

### i31-b29 Life Score button shows after your first month (S, 🟡)
scoreButton() in features.js waits for isOpen('score').
Pairs with the B10 note that early scores look harsh.
Balance: score math unchanged.

### i31-b30 Auto stops once for each new system (S, 🟡)
playWeeks() in turn.js treats a fresh S.unlockQ entry like a choice event.
Same rule as the town goal stopping long skips once.
Balance: idle bots on Auto get one extra stop per system; no score effect.

### i31-b31 'Firsts' in the Journal (S, 🟡)
openSystem() logs with k:'first'; LOG_FILTERS in ui.js gets the chip.
Quiet opens (everything open, met before) don't log.
Balance: none.

### i31-b32 Help guide sections match what's open (S, 🟡)
The 15-section guide in help.js reads isOpen per section.
The practice tutorial ignores unlocks (it always shows its fixed set).
Balance: none.

### i31-b33 Sim and tests play with unlocks on and off (S, 🔴)
Bots in the sim call openSystem() only through normal play.
tests/ gets one spec per length that fast-forwards and checks S.opened.
Balance: this is the guard: careless <= 60, idle <= 50, good >= 70 must hold in both modes.
