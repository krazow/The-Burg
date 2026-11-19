# Ideas round 32

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 32: Dayton up close

A closer look at Dayton, the Columbia County seat 11 miles up Highway 12: its old courthouse and depot, Main Street, the fair, the hospital, Bluewood's home town, and what living there would mean.

### i32-a01 Dayton close-up map, like Waitsburg's Main Street map (L, 🔴)
A third map view in js/maps.js, drawn the same stylized way as townSVG() (Touchet River, Highway 12 as Main Street, "↙ Waitsburg 11 mi" label).
Pins map to STOPS ids in js/features.js; pins with no stop are dashed "just for looking", like the Waitsburg map.
Reached from regionDetail("dayton") with a "See Dayton up close" button; the List view still works.
Balance: no new effects, only a new way to pick existing stops. Later reused by the Dayton edition idea (i27-b09).

### i32-a02 Split the depot and the courthouse into two stops (S, 🔴)
Two STOPS entries in js/features.js replacing "depot"; the depot gets a when:inSeason(3..9) window.
Each gets its own short trip-log line about what you saw.
Balance: same small happy/community each, and REPEAT_WEEKS still applies, so two stops don't double what one gave if you spam them.

### i32-a03 A Dayton trip is a short trip (S, 🔴)
Make TRIP_TIME per town in js/features.js (a time field on CITIES in js/state.js).
The trip sheet says "Short trip: most of your week is still yours."
Balance: Dayton stops are the weakest, so this makes them worth picking without beating a good focus week. Idle players gain nothing: no trip, no change.

### i32-a04 Dayton's Main Street block (M, 🟠)
A daytonStreetBlock() in js/outabout.js modeled on mainStreetBlock().
All stand-in names; each shop line rotates by season.
Balance: flavor only, except shops that are stops (ideas 05 and 06).

### i32-a05 A milkshake at the old drugstore counter (S, 🟡)
STOPS entry (kind eat, cost ~8, happy +2) in js/features.js; family bump through the existing kids check in js/turn.js.
Balance: tiny effect, cooldown like other stops.

### i32-a06 Dinner at the old brick hotel (S, 🟡)
STOPS entry with date:true, cost ~45, happy +4.
Balance: costs real money and a trip, sits below the Walla Walla dinner on effect per dollar only slightly.

### i32-a07 Historic homes walking tour (S, 🟡)
STOPS entry (cost 0, health +2, happy +2, inSeason spring and fall).
Fixer-upper link: a flag that knocks 10% off the next repair in the home code.
Balance: one-time discount per year, not stackable.

### i32-a08 Courthouse clerk work scenes (M, 🟠)
Job-tagged events in js/events.js (only when job().id === "clerk"), cat "work".
Each has two choices: go the extra mile (stress, better standing) or keep it to the rules (no change).
Balance: small numbers; it makes the job feel real, not richer.

### i32-a09 The courthouse clock needs fixing (S, 🟡)
A rare region event in js/events.js pinned to Dayton (EVPIN map).
Choices: $25 (community +2), a Saturday of help (community +3, rest −), skip.
Balance: rare, small, costs money or time.

### i32-a10 A courthouse wedding (S, 🟠)
A venue choice in the wedding flow (wherever the partner/marriage code lives in js/events.js or js/ui.js).
Courthouse: cost ~$150, happy +4; others stay as they are.
Balance: saves money but smaller happy, so neither choice dominates.

### i32-a11 The Columbia County Fair on Labor Day weekend (M, 🔴)
STOPS entry with a when() that checks the Labor Day week (early September) in js/features.js; a region event the week before as a reminder.
Fair stop: cost ~$25, happy +4, community +1; kids along gives family time.
Balance: once a year, costs money and the trip. Distinct from i4-a07 (Waitsburg-side entry).

### i32-a12 Show a 4-H animal at the county fair (M, 🟠)
A family project in js/turn.js with a spring start event and the fair result event.
Outcome rolls on weeks you kept up with it (skipped weeks lower the odds).
Balance: neglect loses money; careful play earns a modest profit and family +.

### i32-a13 Hospital-paid nursing assistant course (M, 🔴)
A region event in js/events.js; accepting sets an 8-week study track that uses your focus (like classes, no tuition).
On finish, a flag lets you apply to "cna" in js/state.js despite edu 0.
Balance: costs 8 weeks of focus; it opens one job, not the whole edu ladder. A new non-school path for low-edu careful players.

### i32-a14 Visit residents in the hospital care wing (S, 🟠)
STOPS entry (cost 0, happy +2, community +2) in js/features.js; a December event if visited 4+ times that year.
Balance: same size as other free stops; the card is a one-line bonus.

### i32-a15 The hospital foundation auction (S, 🟡)
Yearly region event in js/events.js: ticket $40 (community +3, happy +2); a bid choice that might win a Bluewood pass (links to the pass flag).
Balance: costs money; the pass win is a small chance.

### i32-a16 One team for two towns: co-op sports (M, 🟠)
A family event chain in js/events.js for teens in fall; drive (gas, family +) or carpool (a Dayton friend made).
Works with the rivalry game idea (i12-a03) without repeating it.
Balance: costs gas or a little time, pays in family and a friend.

### i32-a17 The town pool in summer (S, 🟡)
STOPS entry (cost ~5, health +2, happy +2, inSeason June–August).
Kids: three trips in a summer and a Journal line says they can swim.
Balance: tiny; only in summer.

### i32-a18 Ski rentals in Bluewood's home town (S, 🟠)
STOPS entry (cost ~$120, inSeason Nov–Feb) that sets a season flag read by the Powder day event in js/events.js.
Balance: only pays off if you go skiing twice or more; one trip is a loss.

### i32-a19 Bluewood ski patrol: a seasonal Dayton job (M, 🟠)
New JOBS entry in js/state.js with a season window; js/turn.js ends it in spring and offers it again in fall.
Requires health above a line to apply.
Balance: no summer pay, so it fits a mixed life (summer farm work), not idle play.

### i32-a20 County road crew, with winter plowing (M, 🟠)
New JOBS entry (city dayton, edu 0, pay ~3100); a winter event pool adds overtime choices.
Balance: overtime is a choice with a stress cost.

### i32-a21 A courthouse career ladder (M, 🟡)
Job tiers on "clerk" in js/state.js; promotion check in js/turn.js.
The elected step ties to the election events already in the game.
Balance: slow, standing-based; careless play rarely climbs.

### i32-a22 Three Dayton regulars (M, 🟠)
A small NPC list for Dayton in js/features.js, seen when you take a stop they hang out at.
Different from the café waitress regular in i12-a07.
Balance: tips are small; you only meet them by actually going.

### i32-a23 The old cannery building finds a new use (M, 🟡)
A multi-step event chain in js/events.js with a flag that may add one Dayton JOBS entry.
Balance: the outcome is mostly luck, with your voice nudging it a bit.

### i32-a24 Lewis and Clark campsite on Patit Creek (S, 🟡)
STOPS entry (cost 0, happy +2) or a LANDMARKS pin in js/maps.js near Dayton.
Balance: tiny.

### i32-a25 Wind turbine blades on the Dayton road (S, 🟡)
Road event in js/events.js, cat "road", only when the road town is Dayton.
Balance: small cost either way.

### i32-a26 A lighted holiday parade on Dayton's Main Street (S, 🟡)
Yearly region event pinned to Dayton in js/events.js: go (gas, happy +3, family +) or skip.
Balance: once a year, small.

### i32-a27 A historic house in Dayton with old-look rules (M, 🟠)
A Dayton home type for the live-in-another-town idea (i12-a09), in HOMES in js/state.js.
Balance: cheap up front, costly to neglect; careless play loses value.

### i32-a28 What changes if you move to Dayton (S, 🟠)
A summary card in the move sheet in js/ui.js, computed from CITIES, JOBS and your state.
Helps i12-a09 and i27-b09 without adding effects.
Balance: information only.

### i32-a29 See all of Dayton: a stamp card (S, 🟡)
A visited set in state (S.dayVisits) filled by trip stops; shown under regionDetail("dayton").
Balance: one-time +3 community, takes several paid trips to earn.

### i32-a30 Hardware clerk discount for home repairs (S, 🟡)
A check on job().id === "hardware" in the repair code; an odd-job bonus line in js/turn.js.
Balance: modest discount, only for that job and only if you own a fixer-upper.

### i32-a31 Dayton events show on its close-up map (S, 🟠)
Extend EVPIN in js/events.js with Dayton spot keys and reuse evBadge() in js/maps.js.
Balance: display only.

## Ideas 32: Walla Walla up close

Ideas that make Walla Walla, the big town 21 miles down US-12, feel like a real place you work, study and visit.

### i32-b01 Walla Walla close-up map (L, 🔴)
Tapping Walla Walla on the region map opens its own close-up map, like the Waitsburg one: Main Street downtown, the two colleges, Pioneer Park, the fairgrounds, the hospital and VA campus, the penitentiary on the west edge, and the wine district by the airport.
- A second town map built like townSVG/townPlaces in js/maps.js, drawn for Walla Walla (stand-in names only).
- Opens from the Walla Walla pin in regionDetail and from the trip sheet header.
- Read-only places plus pins; nothing here pays out on its own.
- Balance: it is a view, so careless and idle play gain nothing.

### i32-b02 Every Walla Walla trip stop gets a pin (S, 🔴)
Each Walla Walla stop in the trip list (tasting room, dinner downtown, market, college game, movies, dentist, checkup) gets a spot on the close-up map. Tap a pin to add it to this week's trip.
- Add x,y per town to STOPS in js/features.js and draw them on the close-up map.
- Tapping a pin calls the same add-stop path as the trip sheet, so TRIP_MAX and stopBlocked still apply.
- Balance: no new effects, just a faster way to plan.

### i32-b03 Your workplace shows on the close-up map (S, 🟠)
If you work in Walla Walla, your job's building gets a briefcase pin (the shed, the winery, the hospital, the campus, the pen) and your truck ends its commute there.
- Map job ids (cellar, onion, co, rn, prof) to places in js/maps.js; extend the commute truck animation.
- Pin sheet shows your shift, pay and weeks on the job.
- Balance: display only.

### i32-b04 Stroll Main Street downtown (S, 🟠)
A free Walla Walla stop: walk the downtown blocks, look in the windows, get a coffee. Small happiness, no cost.
- New STOPS entry, kind 'do', cost a coffee ($5), fx {happy:2}.
- Free stops still take trip time (TRIP_TIME 0.75 focus) unless you commute there.
- Balance: REPEAT_WEEKS fade keeps it from being a free weekly boost.

### i32-b05 Pioneer Park: the duck pond, the aviary and the bandstand (S, 🟠)
A Walla Walla stop at the big old city park: feed the ducks, see the birds, and on summer Thursdays catch a free band concert.
- New STOPS entry, free, fx {health:1, happy:3}; in June–August an extra +1 community for the concert.
- Kids along add a little happiness (date-style flag for family).
- Balance: small, seasonal, and costs trip time and gas.

### i32-b06 Walk or bike the Mill Creek path (S, 🟡)
A paved path along the creek through town. A free health stop April–October, better if you own a bike.
- STOPS entry, inSeason(3..9), fx {health:3, happy:1}.
- Ties to any bike item if one exists (i14-a11 kids' bike).
- Balance: trip gas makes it worse than Get outside at home for idle players.

### i32-b07 First Friday art walk downtown (S, 🟡)
Once a month the downtown galleries and shops stay open late. A cheap evening stop that is a good date.
- STOPS entry with when: first week of the month (curWeekOfMonth helper), cost $10, date:true, fx {happy:3, community:1}.
- Balance: once a month and costs gas.

### i32-b08 Campus jobs at the private college (M, 🟠)
The private college hires valley people too: groundskeeper, dining hall cook, facilities tech. Steady hours, decent benefits, quiet summers.
- Three new JOBS in js/state.js, city wallawalla, edu 0–1, low stress.
- Summer weeks pay a little less (fewer hours); a tuition perk makes a kid's college cheaper later.
- Balance: modest pay, so good play still has to choose; careless play gets no edge.

### i32-b09 The college calendar sets the town's mood (S, 🟡)
Late August move-in jams the streets, May graduation weekend fills every restaurant, and December finals empty it out.
- A small date table read by trip stops: dinner downtown costs more and fades faster on graduation weekend; parking is easy in winter break.
- Lines in the week recap, no sheet.
- Balance: small swings both ways.

### i32-b10 Community college programs that lead to named jobs (M, 🔴)
Classes at the community college are no longer one generic line. Pick a program: nursing assistant, wine-making, wind tech or ag mechanics. Each one opens a named job when you finish.
- Split 'community college classes' in SCHOOL (js/state.js) into programs with their own weeks and unlocks.
- Wine-making → assistant winemaker; nursing → nursing assistant then RN path; wind tech → wind farm jobs.
- Balance: costs class weeks and tuition; idle play never finishes one.

### i32-b11 The night drive home after evening class (S, 🟠)
Evening classes in Walla Walla mean driving US-12 home in the dark. In fog season and deer season there is a small chance of a scare or a hit deer.
- Event gated on a Classes focus week while enrolled in a Walla Walla program, Oct–Feb.
- Choices: slow down (lose an evening), take the long way, or push on (small risk of a repair bill).
- Balance: a real cost to classes, so studying isn't free money.

### i32-b12 Nursing assistant at the hospital (S, 🟠)
An entry job at the Walla Walla hospital that pays less than RN but needs only a short certificate. After a year you can go for RN with the hospital helping pay.
- New JOBS entry (edu 0 plus certificate), stress medium, wear medium.
- Tuition help flag lowers the RN program cost.
- Balance: a ladder, not a shortcut; RN still takes school weeks.

### i32-b13 Jobs at the VA medical center (S, 🟠)
The VA campus hires clerks, techs and groundskeepers. Federal jobs: steady, good benefits, slow to hire.
- Two or three JOBS, city wallawalla; applying takes a few weeks before you hear back.
- Veterans (i7-a23 start) get a hiring preference.
- Balance: pay is middle of the road; the wait is the trade-off.

### i32-b14 Veterans get their checkups at the VA (S, 🟡)
If your character served, the doctor checkup stop in Walla Walla is free at the VA clinic, and the dentist is cheaper.
- In stopCost (js/features.js), checkup cost 0 when S.veteran.
- Only matters with the veteran start, so it rewards a choice, not idleness.
- Balance: saves a few hundred dollars a year at most.

### i32-b15 Corrections officer, as the job really runs (M, 🔴)
The pen is one of the valley's biggest employers. A CO job now starts with academy weeks away, then rotating 12-hour shifts, held-over overtime some weeks, and a state pension.
- Hook the existing co job in js/state.js and js/turn.js: 4 academy weeks at partial pay, a shift-rotation line, a 'held over' event.
- Pension counts toward retirement (ties to 401(k) code).
- Balance: good pay but high stress (1.3) and forced overtime hurt happiness, so it is no easy win.

### i32-b16 More jobs at the pen: cook, maintenance, nurse (S, 🟡)
Not everyone at the penitentiary wears a uniform. Kitchen, maintenance and medical staff work there too, with state benefits and calmer days than a CO.
- Three JOBS entries, city wallawalla, stress lower than co.
- Plain one-line descriptions, matter-of-fact.
- Balance: middle pay, steady; adds choice, not power.

### i32-b17 Crush season for cellar hands (S, 🟠)
In September and October the winery cellar hand job runs long weeks: more pay, more wear, and a harvest party at the end.
- Seasonal multiplier on the cellar job in js/turn.js: +25% pay, +50% wear for 6–8 weeks.
- An end-of-crush event: go to the party or go home and sleep.
- Balance: extra money costs health; careless play that ignores health pays for it.

### i32-b18 Tasting room host: a weekend job (S, 🟠)
A part-time weekend job pouring wine in a Walla Walla tasting room. Tips, nice people, 21 and over.
- Side-hustle option or part-time job with min21, weekends only, busier on wine weekends.
- Balance: small money, takes Side hustle weeks.

### i32-b19 Tasting rooms out by the airport (S, 🟡)
A second wine stop in the old airfield buildings where small new wineries pour. Cheaper than downtown and a little rough around the edges.
- STOPS entry, min21, cost $20, fx {happy:3}; doesn't count as a date night.
- Balance: smaller effect than the downtown tasting stop.

### i32-b20 Who's driving home from wine country? (S, 🔴)
Pick a tasting room stop and the game asks how you get home 21 miles on US-12: stick to one taste and drive, your partner drives, or pay for a ride.
- A quick choice after a tasting stop in js/features.js trip resolution.
- Driving yourself after 'a few' has a small chance of a ticket and a scare; the ride costs about $60.
- Balance: makes tasting trips cost a choice, and never rewards the risky option.

### i32-b21 Sweet onion season: busy summer, slow winter (S, 🟠)
The onion packing shed runs hard in June and July with overtime, then cuts hours in winter. Plan for the lean months.
- Seasonal pay curve on the onion job (more hours in summer, fewer Dec–Mar) in js/turn.js; LAYOFF_RISK stays.
- A Home hint in May: 'Save some of the summer overtime.'
- Balance: same yearly pay, so only planning players come out ahead.

### i32-b22 The sweet onion festival in July (S, 🟡)
A July Saturday in Walla Walla with onion rings, a giant onion contest and music. A trip stop for that one week.
- STOPS entry with a one-week when; cost $15, fx {happy:4, community:1}.
- Balance: once a year.

### i32-b23 Fair week as a trip with its own stops (M, 🟠)
When the fair and Frontier Days are on, Walla Walla gets extra stops for the week: the rodeo, the carnival, the livestock barns and the night concert. It replaces the one-click fair event.
- Turn the 'Fair & Frontier Days' event (js/events.js) into a week of temporary STOPS; keep the pie entry as a stop.
- Kids love the carnival; a 4-H/FFA kid (i1-b12) shows in the barns.
- Balance: costs trip gas and money; same happiness range as the old event.

### i32-b24 Work the fair: a week of temp shifts (S, 🟡)
The fair hires for one week: gates, parking, the beer garden. A little cash and you see half the valley.
- Event offer in late August: take it as your Side hustle week for about $400 and +1 community.
- Balance: one week a year, uses your focus.

### i32-b25 The college rodeo in spring (S, 🟡)
The community college has a rodeo team, and the spring rodeo at the fairgrounds is cheap and loud.
- STOPS entry in April–May, cost $10, fx {happy:3}.
- Balance: small and seasonal.

### i32-b26 The baby comes at 2 a.m. (S, 🟠)
The hospital is 21 miles away. When a baby is due, an event asks if you packed the bag early, and a winter birth means a careful drive in the dark.
- Hook the new-kid code: a short event with two choices; packing early (set a week before) avoids the scare.
- Balance: story first, tiny effects.

### i32-b27 A parking ticket downtown (S, 🟡)
You stayed too long at dinner and got a ticket on the windshield. Pay it or fight it at the city office.
- Rare event after a Walla Walla eat-out stop: pay $25 or spend part of next trip to contest (50% it's dropped).
- Balance: small, rare.

### i32-b28 Holiday lights and the downtown parade (S, 🟡)
In early December downtown lights up and there's an evening parade. A family stop with hot cocoa.
- STOPS entry in December, cost $10, fx {happy:4, community:1}; better with kids.
- Balance: once a year.

### i32-b29 Fly out of the small airport (S, 🟡)
The Walla Walla airport has a couple of flights a day to Seattle. Big trips (family visits, vacations) can leave from there: closer than Pasco, but pricier.
- A choice on vacation or visit events: Walla Walla (less drive, +$120) or Pasco (more drive, cheaper).
- Balance: a trade-off either way.

### i32-b30 Moving to Walla Walla: pick a part of town (M, 🟠)
If you move to Walla Walla (i12-a09), choose a downtown apartment, a south-side house near the parks, or a place near the college. Each has its own rent, noise and walkability.
- Builds on i12-a09: a few HOMES entries tagged wallawalla with small happiness and stress notes.
- Downtown: walk to stops, no trip gas; near the college: noisy in fall.
- Balance: higher rent and slower community growth than Waitsburg, so moving is a real trade.

### i32-b31 Lunch break downtown when you work there (S, 🟠)
If you commute to Walla Walla, once a week you can spend your lunch downtown: a quick errand or a cheap meal without a full trip.
- A one-stop mini-trip for commuters only (tripIsCommute), no focus cost, limited to errand and eat stops.
- Balance: helps the commuter's evenings a little; still costs money.

### i32-b32 Memorial Day at the old fort cemetery (S, 🟡)
The museum grounds hold an old military cemetery. On Memorial Day there's a ceremony; going is quiet and moving.
- Event in the last week of May: go (+2 community, +2 happy, gas) or stay home.
- Stronger for veterans and older characters.
- Balance: once a year, small.
