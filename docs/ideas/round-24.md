# Ideas round 24

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 24: Values and hard choices

Everyday hard choices with no single right answer, a light values profile that colors the text, and echoes that come back weeks later, all kept out of the score.

### i24-a01 A quiet values profile that grows from your choices (M, 🔴)
Hard choices nudge four leanings (honest–tactful, loyal–even-handed, careful–bold, private–open), shown on the Me screen as a few plain words, never as points.
- New S.vals {honest, loyal, bold, open}, each -10 to +10, nudged ±1 by choices tagged `v:{honest:1}` in js/events.js.
- Me screen (js/ui.js) shows words like "Tells it straight, sticks by friends" once a leaning passes 3.
- Balance: the profile never feeds lifeScore(); no leaning is better, so there is nothing to farm.

### i24-a02 Echoes: some choices come back weeks later (M, 🔴)
A choice can schedule a short follow-up card 3 to 8 weeks out, so the found wallet or the covered shift gets a second scene.
- S.echoes = [{at, id, data}] checked in js/turn.js before rollEvent; due echoes show instead of a random event.
- Echo cards live in a new ECHOES table in js/events.js, same shape as events, can't re-echo more than once.
- Balance: echoes replace a random event that week, so event volume doesn't rise; they mostly settle up, both ways.

### i24-a03 Values never touch the score: a guard test (S, 🔴)
A test plays two scripted lives that differ only in dilemma choices and checks the life score stays within the normal luck spread.
- New tests/values.spec in the existing Playwright helpers; seeds Math.random the same for both runs.
- Fails if any tagged dilemma choice gives one side a lasting edge over the other.
- Balance: keeps careless and idle medians where they are; the lens adds feeling, not points.

### i24-a04 Make up after a falling-out (M, 🔴)
When a choice sours things with someone, a later card lets you apologize first, wait for them, or let it go; each has a cost.
- Hooks the existing coworker conflict, A rough patch and the new dilemmas; stores S.rifts [{who, since}].
- Apologize: small happy dip now, community back later. Wait: 50% they come to you. Let go: rift fades after a year.
- Balance: an open rift costs a little community each season, so ignoring people isn't free, and fixing it only restores what was lost.

### i24-a05 Cover for a coworker who clocks out early (S, 🔴)
A coworker asks you to punch them out an hour early so they can get their kid. Cover, say no kindly, or tell the boss.
- New work event in js/events.js tagged loyal/honest; needs working().
- Cover: echo in 4 weeks, 70% they cover your double shift, 30% the boss finds out and you both get a talking-to.
- Say no: nothing now, slight rift. Tell the boss: raise odds up a little, rift for sure. No option wins on points.

### i24-a06 The wallet, take two: keep the cash, mail the license (S, 🟠)
The lost wallet event gets a third choice, and the honest ones get an echo when you see the owner again.
- Edits the existing road event in js/events.js (R-28). Keep the cash: +$60 now, tagged honest -1.
- Echo 6 weeks later: a flyer at the café thanks whoever mailed the license back. You feel a bit odd, or a bit proud.
- Balance: keeping the cash is a small one-time gain, less than one week of most jobs.

### i24-a07 Too much change at Burg Basket (S, 🟠)
The cashier hands you back $20 extra. Walk back in, keep it, or mention it next time you shop.
- Town event placed at the grocery pin; uses the stand-in grocery name already in js/outabout.js.
- Mention it next time: an echo the next week you shop there; if you forget, it counts as keeping it.
- Balance: $20 either way; the echo is mostly a line of text and a small community nudge.

### i24-a08 Dinged a car in the lot and nobody saw (S, 🟠)
You back into a parked pickup on Main Street. Leave a note with your number, or drive on.
- Town event in js/events.js; note path costs $0 to the deductible ($250), owner waves it off 50% of the time.
- Drive on: 15% echo where someone saw it and the café table knows; community -3.
- Balance: the honest path costs money, the other risks standing; expected values are close on purpose.

### i24-a09 Your friend asks, is my pie any good? (S, 🟠)
A friend wants to enter their pie at the county fair and asks for the truth. It's not great. Tell them gently, or cheer them on.
- Town event in late summer, tagged honest/loyal; ties to Fair & Frontier Days.
- Echo at the fair: tell the truth and they fix it (ribbon 50%) or sulk; cheer and they enter as is (ribbon 10%) but stay close.
- Balance: just happy and community nudges, a few points each way.

### i24-a10 A neighbor's dog keeps digging up another neighbor's garden (S, 🟠)
You know whose dog it is. Tell the gardener, talk to the dog's owner, or quietly patch the fence yourself.
- Town event, needs a house (not the starter apartment); tagged honest/private.
- Patch the fence: $80 and a week's free time; nobody knows, both stay friendly. Talk to the owner: 60% fixed, 40% a rift.
- Balance: cheapest choice is the riskiest one socially.

### i24-a11 The neighbor kid broke your window and begged you not to tell (S, 🟡)
A baseball through your window, and a scared kid at the door. Tell the parents, settle it with the kid, or let it go.
- Town event in spring/summer, needs a house; $150 window.
- Settle with the kid: they mow your lawn for a month (save on yard) and echo later as a friendly teen.
- Tell the parents: they pay for it, the kid avoids you for a while.

### i24-a12 Judge the pie table when your friend entered (S, 🟡)
The fair asks you to judge baked goods. Your friend's entry is good, but not the best. Score it straight or bump it up.
- Fair event, needs community 50+; tagged loyal/fair.
- Straight: friend is cool to you for a few weeks, fair board asks you back next year. Bump it: friend thrilled, 20% someone notices.
- Balance: small community swing either way; no money involved.

### i24-a13 A friend wants you as a job reference (S, 🟠)
A friend applies at the elevator and lists you. You've seen them blow off shifts. Vouch fully, be honest, or politely decline.
- Town event, needs community 40+. Distinct from putting in a word unasked (i16-b19).
- Echo 8 weeks: if hired after a full vouch, 50% they do fine, 50% the manager mentions it to you.
- Honest or decline: friend may cool off; your word counts more on the next real tip.

### i24-a14 Speak up at the council meeting (M, 🟠)
As a council member you learn the pool needs a costly repair. Say so now and the pool may close this summer, or wait until fall.
- Council-only event (S.council) in spring; tagged honest/careful. Plain town upkeep, no parties or politics.
- Now: summer is quieter, people grumble, but trust holds. Wait: 25% echo where a leak closes it mid-July and the Tattler asks who knew.
- Balance: both paths have a bad summer somewhere; community changes are small.

### i24-a15 You saw the fender-bender, and the driver is a friend's teen (S, 🟡)
In the grocery lot a teen you know taps another car and starts to leave. Speak up to the other driver, talk to the teen, or stay out of it.
- Town event; tagged honest/loyal.
- Talk to the teen: 70% they go back and own it, and the parent thanks you later as an echo.
- Stay out: no change now, 10% echo where it comes out and you're asked why you said nothing.

### i24-a16 The booster club books are $40 short (S, 🟡)
You're helping with the booster club money and see a friend borrowed $40 for snacks and forgot. Cover it, ask them, or tell the club.
- Town event, needs community 50+ or a kid in school.
- Cover it: -$40, nobody knows. Ask them: they pay back, maybe a bit embarrassed. Tell the club: fair, but a rift.
- Balance: tiny money, social trade-offs.

### i24-a17 A promise you made comes due (M, 🟠)
Some choices create a promise (help them move, coach the team, be at the game). When the week comes, it shows on the plan screen.
- S.promises [{due, who, what}]; js/ui.js plan screen shows a 🤝 row that week; keeping it uses a free-time slot.
- Break it and the echo is a rift; keep it and you lose that week's activity but gain community.
- Balance: promises only come from choices you picked, and keeping one costs real time, so idle play can't stack them.

### i24-a18 Sleep on it: put off one hard choice a week (S, 🟡)
Dilemma cards get a "Sleep on it" button once. The card comes back next week, and sometimes the problem solves itself.
- showEvent() in js/events.js adds the button when ev.dl is set; pushes an echo for next week.
- 20% of the time it resolves on its own with a short line; otherwise you choose then, with no penalty.
- Balance: no stat change; it's pacing, not an escape.

### i24-a19 Results in your own voice (S, 🟠)
Event result lines get a short add-on that matches your values profile, so an honest player and a tactful one read the same scene a bit differently.
- A valueVoice(ev) helper in js/events.js picks from 2–3 lines per leaning, e.g. "You'd have said it either way."
- Only on tagged dilemmas and only when a leaning is strong (5+).
- Balance: text only.

### i24-a20 Folks know you: greetings shaped by your leanings (S, 🟡)
Out & About places greet you with lines that match how you've chosen, like "Here comes the one who'll tell it straight."
- js/outabout.js place cards pick a greeting from S.vals when a leaning is 5+; falls back to today's lines.
- Light flavor only; no prices or effects change.
- Balance: none needed.

### i24-a21 What you stood for, on the end screen (M, 🟠)
The end screen adds one short paragraph from your values profile and the three dilemmas you'll be remembered for.
- finish() in js/features.js reads S.vals and S.run.happened (filtered to ev.dl) to pick the three moments.
- Kind, non-judging wording for every profile; no grade.
- Balance: not part of the score; distinct from the life tallies (i9-a30) and kids raised honestly (i12-b30).

### i24-a22 Your kid pocketed a candy bar (S, 🟠)
Your young kid walks out of the store with a candy bar. Walk back and pay together, talk at home, or let it slide.
- Town event, needs a kid aged 5–11 in S.kids.
- Walk back: embarrassing now (happy -1); echo years later when the teen returns extra change. Let it slide: nothing now.
- Balance: tiny effects; mainly a seed for the next idea.

### i24-a23 Kids pick up a bit of how you live (M, 🟡)
Each kid carries a small leaning copied in part from your choices, shown on the family card and in their grown-up line.
- S.kids[i].v set when a kid turns 18, half from S.vals plus a little chance.
- Used only in text: "Sam turned out blunt, like you." No effect on money or score.
- Balance: none; keeps the profile from feeling like it vanishes.

### i24-a24 Hire your cousin or the better applicant (M, 🟠)
If you own a business, a slot opens. Your cousin needs the work; a stranger has more experience.
- Event tied to BIZ in js/features.js; adds a small worker modifier to that business's yearly return.
- Cousin: family happy, business earns a bit less the first year, 50% they grow into it. Stranger: earns more, family dinner is chilly.
- Balance: both paths land near the same 2-year total.

### i24-a25 The lost dog you grew to love (S, 🟠)
A stray you've fed for a month turns out to have a family. You see the poster at the post office. Call them, or keep quiet.
- Echo of the existing A friendly stray event when you took the dog in (S.dog).
- Call: the dog goes home, happy -6, and the family sends a card; 30% they offer you a pup later. Keep quiet: you keep the dog, honest -1.
- Balance: keeping the dog keeps its happiness bonus, but the call path pays some back over time.

### i24-a26 The person who wronged you needs a favor (S, 🟡)
The coworker who took credit for your work needs a ride to Walla Walla. Help them, or say you're busy.
- Echo of the coworker conflict event when it went badly or you went to the boss.
- Help: rift clears, a week's free time used. Busy: nothing changes, and that's fine too.
- Balance: small community vs. one free week.

### i24-a27 The Tattler prints what you did in public (S, 🟡)
When a choice happens in public (council, fair judging, the returned wallet), the local paper runs a line about it the next week.
- Adds an item to the Tattler place card in js/outabout.js and the Journal; uses the evPins list.
- Lines are neutral and small-town ("A council member said the pool needs work").
- Balance: text only, plus +1 community if the line reads well.

### i24-a28 Dilemmas wear a ⚖️ and show both sides' cost (S, 🟡)
Dilemma cards show a scale icon and, under each choice, one plain line of what it costs, so nothing looks like the right answer.
- ev.dl flag in js/events.js; showEvent() shows costs in words ("a friend's trust", "$20") instead of a green/red preview.
- Works with the existing choice-preview ideas; this only changes the wording for dilemmas.
- Balance: none; makes clear every option costs something.

### i24-a29 Pace dilemmas: at most one every six weeks (S, 🟠)
Hard choices are tagged and spaced out so they stay special, with a shared cooldown across all of them.
- S.dlCd turn number checked in pickEvent(); dl events skipped while it is in the future.
- Echoes are exempt so stories still finish.
- Balance: keeps total events the same; protects long games from moral fatigue.

### i24-a30 People change: a leaning can flip (S, 🟡)
If your choices drift the other way for a while, a Journal line notes it, like "Lately you've been keeping more to yourself."
- Check in js/turn.js when a leaning crosses zero; logs a milestone line once per flip per year.
- Shows the profile is a record, not a label.
- Balance: text only.

### i24-a31 Writing rules for hard choices (S, 🟠)
A short page in docs that sets the rules: both sides defensible, no lecture, no villains, no politics, results say what happened, not what's right.
- New section in docs/review-and-events doc or a small docs/values.md; lists the v tags and echo rules.
- Every dilemma PR checks against it.
- Balance: keeps the tone non-preachy as content grows.

### i24-a32 Forgive yourself: make it right at the place (M, 🟠)
For 8 weeks after a choice you might regret, the place where it happened offers a "Make it right" action on its Out & About card.
- js/outabout.js place card shows the action when an S.echoes entry has fix:true and the pin matches.
- Costs that week's outing and a little money; clears the rift or flips the honest tag back.
- Balance: it costs the same time as any outing, so it's a choice, not a free undo.

## Ideas 24: Memories and looking back

Ideas for keepsakes, anniversaries, childhood flashbacks and how remembering shapes happiness, built on one memory list that only fills from choices you make.

### i24-b01 A memory list that lasts the whole life (M, 🔴)
A new S.mem list keeps up to 60 memories (week, place, people, kind, how big) made only by choices you take in events and outings. The Journal still trims at 120, but memories stay for the whole life and feed the ideas below.
state.js adds S.mem plus a remember() helper next to log(); migrate() fills it empty for old saves. events.js and outabout.js call remember() on chosen outcomes only. Weekly skips, Auto and plain rest never make memories, so idle play can't fill it.

### i24-b02 The life timeline: one screen from 18 to now (L, 🔴)
A sideways timeline by age with bands for where you lived, where you worked, partner, kids and pets, and dots for memories. Tap a year to see that year's memories and badges.
New sheet in ui.js, opened from the Life tab and the end screen. Bands come from a small S.hist list of moves and job changes (one entry each time they change). Display only, no score effect. Scrolls on phones.

### i24-b03 This week, years ago: memories come back on their date (M, 🔴)
On the 5th, 10th and 20th anniversary of a big memory, a small card shows up: 'Ten years ago this week you got the keys to the place on Preston.' Call the person who was there, go back to the place, or let it pass.
turn.js checks S.mem each week, at most one card a month. Calling gives a little community, visiting gives a little happiness and costs the evening (counts as an outing). Different from 'A year ago today': longer gaps, a real choice, and it names the people. Small payoffs keep it from being a farm.

### i24-b04 Look through the box: remembering as a Rest choice (S, 🟠)
When you pick Rest, you can spend it looking through old memories. It gives a bit more happiness than plain rest, scaled by how many different kinds of memories you have, not how many.
FOCUS rest in state.js gets a sub-choice; ui.js shows it. Bonus +1 to +3 happiness by distinct kinds. Used more than twice in 8 weeks it turns to 'living in the past' and gives less than plain rest. Careless play has few kinds, so it gains little.

### i24-b05 Memories fade unless you go back to them (M, 🟠)
Each memory has a clarity that slowly drops over the years. Telling the story, visiting the place or the anniversary card brings it back. Clear memories show brighter on the timeline and in the ending.
S.mem entries get a clarity number; turn.js lowers it once a year. Clarity only affects display and which memories the ending picks, plus idea 21. No money effect. Rewards players who come back to their life's people and places.

### i24-b06 Hard anniversaries come back too (M, 🟠)
The week a parent died, the layoff, the crash: those dates come back as a quiet card with a small happiness dip. Spend the evening with someone, go to the place, or keep busy; each eases it differently.
Same weekly check as the anniversary cards, for memories marked hard. Dip is -2 to -4, cut in half if your community or partner closeness is high. Written gently, never a punishment loop: each hard memory comes back at most three times.

### i24-b07 Pick three childhood summers in Waitsburg at the start (M, 🔴)
At the start, choose three memories from growing up here: swimming at the town pool, catching crawdads in the Touchet, the fair parade, sledding at the park, riding in a combine. They set a few small leanings for the life.
New step in newGame() in ui.js, picks saved as S.kidMem. Each gives one small, specific lean (creek summers: fishing outings a bit happier; fair parade: fair events a bit better). Tiny effects, no score points on their own. Skippable with a 'pick for me' button.

### i24-b08 Flashbacks where it happened (S, 🟠)
When you go somewhere tied to one of your childhood summers, a short flashback plays: you at nine, the same bridge, the same smell of cut wheat. The first time it gives a little happiness.
outabout.js checks S.kidMem against the place visited. One flashback per place per life, so it can't be repeated for gain. Text uses plain stand-in names for any business. Gives explorers a reason to visit old spots.

### i24-b09 Your sixth-grade letter comes back (S, 🟠)
Around 30, a retired teacher mails back the letter you wrote in sixth grade: 'Have a dog. See the ocean. Be a firefighter.' Those three become soft wishes you can choose to chase.
One event in events.js; wishes are rolled from a short list that maps to things the game already has (pets, trips, volunteer fire, owning a home). Each done wish gives a one-time happiness lift and a line in the ending. No penalty for skipping them.

### i24-b10 A note to future you in a hard week (S, 🟠)
When happiness drops below 30, you can write a short note to yourself from three options ('It gets better', 'Call Mom more', 'Don't sell the truck'). When you climb back over 60, the note arrives: 'You made it.'
S.notes in state.js, checked in turn.js. Arrival gives a small happiness lift once per note, at most two notes a life. Only helps if you actually recover, so careless play that stays low never collects it.

### i24-b11 Leave a December note for next December (S, 🟡)
In December, leave one practical note for next year: put snow tires on early, book the cabin before summer, start saving for the January card bill. Follow it next year and it helps a little.
Uses the existing December and January events. A followed note softens one matching event (smaller bill, fewer truck-won't-start rolls). The note only counts if you act on it in time, so it rewards planning, not luck.

### i24-b12 The memory box: pack it yourself when you move (M, 🟠)
Keepsakes live in one box. Moving week asks if you pack it yourself or let the movers; a kitchen fire or flood can reach it unless you grabbed it. Losing it hurts a bit; saving it is a moment.
Hooks into the move code in ui.js and the fire/flood events in events.js. Packing it yourself costs one evening; losing the box removes keepsakes from display and gives a one-time happiness dip. The box adds no score itself, so it can't be farmed.

### i24-b13 Ticket stubs from trips and nights out (S, 🟡)
Trips and nights out leave a ticket stub: a lift ticket from the ski hill, a concert stub from Walla Walla, a fair wristband, a ferry receipt. They go in the memory box with the date.
outabout.js already knows the trip and place; add a stub text per kind. One stub per kind per year so it doesn't pile up. Flavor only; feeds the timeline and the box.

### i24-b14 The fridge door on Home (S, 🟠)
A small fridge on the Home tab holds the five newest things: a kid's drawing, a save-the-date, a fair photo described in words, a magnet from Palouse Falls. Older ones move to the memory box.
Small card in ui.js fed by S.mem and keepsakes. Tap an item to read its line. No stats. A quick way to make Home feel lived in and to show that you've been doing things.

### i24-b15 Tell a story at the café table (M, 🟠)
At the café or the ale house you can tell one of your memories. Friends laugh or go quiet. Some stories get repeated around town and come back to you years later, a little exaggerated.
New outing option in outabout.js, picks from S.mem. Gives a little community and restores the memory's clarity. Each memory can be told once for gain. Repeated stories show up later as a one-line event.

### i24-b16 The town remembers what you did (S, 🟠)
Years later, a neighbor brings it up: 'You pulled my truck out of the ditch the winter of '31.' Good deeds and bad ones both come back as short lines, sometimes with a small favor.
events.js picks a memory where you helped (or let down) someone named and shows a line with a small community or favor effect. At most once a season. Rewards being active in town over many years.

### i24-b17 Drive past your old place (S, 🟡)
After you move, going past your old house on the map shows a line: who lives there now, the porch they painted, the tree you planted that's grown tall.
maps.js / outabout.js check S.hist for old homes. One line per old home per year, flavor only. Makes the town feel like it keeps going without you.

### i24-b18 Clear out your old room at your parents' house (M, 🟠)
Mom wants the room for a sewing table. Pick what to take home: the baseball glove, the 4-H ribbon, the yearbook, the trophy. Years later your own kid finds the glove.
Event in events.js tied to the planned aging-parents work. Picks go into the memory box; one can come back as a later scene with your kid. Small happiness, no money. Only fires if your parents are alive and in the valley.

### i24-b19 Big weather gets a name and a year (S, 🟡)
The worst storms and floods become 'the winter of '31' or 'the flood of '34'. Townsfolk compare new weather to them, and they show on your timeline.
turn.js names a weather event when it is the worst seen so far in the life; stored in S.mem as a town memory. Text in events.js picks up the name. Flavor only.

### i24-b20 Doing things lingers; buying things fades (M, 🟠)
Happiness from purchases fades back in a few weeks. Happiness from new experiences leaves a small lasting lift that stays for a year. Remembering, not owning, is what holds up.
turn.js: buy-boosts decay over 4–6 weeks; each new memory kind in a year adds +0.5 to a yearly floor, capped at +3. Careless spending stops lifting happiness for long; idle play makes no memories. Needs a balance-sim run before shipping.

### i24-b21 Remembered happiness on the end screen (M, 🟠)
Beside average happiness, the ending shows how the life will be remembered: your best stretch, how the last year went, and how clear your memories are. A good last year matters.
Computed in features.js at the end from weekly history plus S.mem clarity. Shown as its own line; worth at most 3 points of score so it can't carry a weak life. Gives a reason to finish strong instead of coasting.

### i24-b22 The people in your memories (S, 🟠)
The ending lists the people who show up most in your memories: your partner, a neighbor, your old boss, the dog. A short line says what you did together.
features.js end screen counts names in S.mem. Display only. If nobody shows up more than once, it says so plainly, which nudges a more social next life.

### i24-b23 A comfort memory in a rough stretch (S, 🟠)
After four weeks of low happiness, a card brings back one of your best memories. Hold on to it for a small lift, or call the person in it for a bigger one.
turn.js, once per rough stretch, needs at least one strong memory. Lift is +2 or +4 with a call. Only players who have built good memories get it, so it doesn't save idle play.

### i24-b24 A bench in the park for someone you lost (S, 🟡)
When someone close dies, you can pay for a bench with a small plaque at the park. On their anniversary you can sit there for an evening.
Event in events.js, costs a one-time sum. Visiting on the anniversary eases the hard-anniversary dip. Shows on the town map as a pin. Small community lift when you buy it.

### i24-b25 Grandma's recipe card on the holidays (S, 🟡)
After a grandparent or parent dies, their recipe card turns up. Make the dish at Thanksgiving or Christmas and everyone goes quiet for a second.
Holiday events in events.js gain an option if the card is in the box. Small happiness and family closeness, once a year. A legacy heir can inherit the card.

### i24-b26 The grandkid's 'interview a grandparent' project (S, 🟡)
A grandkid needs to interview you for school. Pick three memories to tell. The report comes home with a gold star and a drawing of you.
One event in events.js after 60 with grandkids. Uses S.mem picks; the report goes on the fridge. Small happiness and family lift, once per grandkid.

### i24-b27 A place from your childhood closes (S, 🟡)
When a spot from your childhood summers closes or changes (the old pool, the drive-in, the soda counter), you get a goodbye scene: go to the last day, or remember it as it was.
Ties S.kidMem to town changes in the planned town ledger. Going costs an evening and gives a small community lift. Flavor; makes the town's changes feel personal.

### i24-b28 Dreams that mix up your memories (S, 🟡)
Now and then the Journal gets a dream line that mixes two of your memories: the dog at your wedding, the old boss at the county fair.
turn.js, rare, picks two S.mem entries. No effect. Cheap flavor that shows the memory list is alive.

### i24-b29 The heir remembers growing up with you (M, 🟠)
In a legacy life, the heir's three childhood summers come from your last life: the food truck, the cabin trips, the year of the flood. Their flashbacks are your memories seen from the back seat.
newGame() in ui.js builds the heir's S.kidMem options from the parent's S.mem. Same tiny leanings as idea 07. Rewards a full, active parent life without adding money.

### i24-b30 A balance check: skipping never makes memories (S, 🔴)
The balance sim checks that careless and idle runs make few memories and that the memory happiness lifts stay small. Memories only come from choices you made yourself.
Add counts to the existing sim: idle lives under 5 memories, careless under 15, total memory lift capped at +3 happiness a year. Fails the build if a new memory source breaks the targets (careless <= 60, idle <= 50, good >= 70).
