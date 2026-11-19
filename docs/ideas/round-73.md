# Ideas round 73

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 73: Civic life in a small town

Right now civic life is one coin-flip council event; these ideas add campaigns, terms, boards, local ballot measures and town changes you can see, all with fictional people and no party politics.

### i73-a01 Council terms end: run again every four years (S, 🔴)
Today S.council is true forever. A seat now lasts four years; near the end you pick Run again, Step down or Hand it to someone, and a re-run can lose.
Files: events.js 'Run for town council?' sets S.councilEnd; a new 'Your term is up' event in events.js; turn.js stops the +0.8 community decay bonus when the seat ends; ui.js Household row shows the year it ends.
Balance: Removes a permanent free community boost. Re-election odds come from community over the term, so a seat won and then ignored is lost.

### i73-a02 Doorbelling Saturdays: a three-week campaign instead of a coin flip (M, 🔴)
Running opens a three-week campaign. Weeks on Show up for town count as door-knocking; Work extra or Side hustle weeks count as nothing. Your odds on election night come from those weeks plus community.
Files: events.js council event starts S.campaign {weeks, doors}; turn.js counts doors from S.focus; a short note each campaign week ('You knocked on 40 doors on Preston Ave').
Balance: Replaces the flat 65% roll. Careless play that keeps working overtime mostly loses; idle play (Rest) knocks no doors.

### i73-a03 Candidate night at the Grange hall (S, 🟠)
During a campaign a forum night asks you three plain questions (the pool, the water rates, Main Street). Each answer is honest, safe or a dodge, and each moves vote odds a little.
Files: One multi-step event in events.js that fires once per campaign; answers add to S.campaign.doors; Tattler headline in outabout.js quotes your best line.
Balance: Small swing (±5% total). There is no partisan side; questions are about local services only.

### i73-a04 A write-in run when nobody files (S, 🟠)
Some years no one files for an open seat. If your community is 50+, neighbors offer to write you in. Say yes and you can win with 23 votes and no sign money.
Files: New rare event in events.js (when no S.council and community 50–59, below the normal run event); a winning write-in sets S.council and S.councilEnd.
Balance: Only for players already giving time to town. Rare (yr:1, low weight), and the seat still needs the term duties below.

### i73-a05 A tied race is settled by drawing lots (S, 🟡)
Once in a long while a council race ties. The clerk draws a name from a coffee can at city hall, and you watch.
Files: Branch inside the campaign result in events.js (about 1 in 60 races); one Tattler headline; achievement 'Luck of the draw' in features.js.
Balance: Pure flavor, 50/50, no effect on balance.

### i73-a06 Pick a council committee: streets, water or parks (M, 🔴)
Winning a seat asks which committee you want. Streets brings plow and pothole events, water brings rate and pipe events, parks brings pool and playground events, and each lets you fix one thing a year.
Files: state.js S.committee; events.js adds a 'committee' tag so the matching small events weight up; the yearly fix is a choice that changes a town flag (S.townFlags) read by later events.
Balance: Committee work costs one evening a week of rest (small happy dip). Fixes help the town, not your money, so it is not a score farm.

### i73-a07 Council night is the second Wednesday (S, 🟡)
The game says meetings are Wednesday nights but nothing happens. Once a month a council week shows a one-line agenda item and a small rest cost, and a $50 stipend shows on the money lines.
Files: turn.js monthly check when S.council; moneyWeek line 'Council stipend'; agenda lines from a list in events.js or outabout.js.
Balance: Stipend is tiny ($50/month) and the rest cost offsets it, so a seat is never a money play.

### i73-a08 Three council members at the café is a meeting (S, 🟡)
You and two other members end up at the café counter talking about the water rates. Keep talking, change the subject or leave. Keeping on talking can land a stern note from the clerk.
Files: One light events.js event when S.council, tied to the Main Street place; the stern note costs a little community.
Balance: Teaches the open-meetings idea with humor. Tiny stakes either way.

### i73-a09 Step out of the vote on your own shop's permit (S, 🟠)
If you own a business or farm and sit on council, a permit or lease that touches it comes up. Step out of the vote, or vote anyway and risk the Tattler noticing.
Files: events.js event when S.council and the player has a business; voting anyway helps the business a little but has a chance of a community hit and a headline.
Balance: The honest choice costs nothing but a small missed gain, so careless self-dealing does not pay on average.

### i73-a10 Mayor after a council term (L, 🟠)
After one full council term with good community you can run for mayor. The mayor signs the budget, cuts the ribbon at Celebration Days and takes the 2 a.m. call when the water main breaks.
Files: state.js S.mayor; a mayor event chain in events.js (budget week, ribbon at Days, emergency call); turn.js health and happy cost for crisis weeks; achievement in features.js.
Balance: Big community and happiness moments but a steady time cost (Rest weeks recover less). Needs a full prior term, so no shortcut.

### i73-a11 The pool levy: six weeks of pool, four, or none (M, 🔴)
Every few years a pool levy is on the spring ballot. Vote yes, no or skip it. If it passes, summer pool weeks are full; if it fails, the season is short or the pool stays shut, and pool events and the summer Get outside bonus change with it.
Files: events.js spring ballot event; S.townFlags.pool = 'full'|'short'|'closed'; existing pool events check the flag; owners see a small line on property tax in turn.js.
Balance: Your vote is one of many: outcome is mostly town-driven with a small nudge from community and campaigning, so it is not a lever to farm.

### i73-a12 Each levy shows as its own line on the tax bill (S, 🔴)
Owners see what each passed measure costs: pool, fire, school, library, each a few dollars a month. Renters see a small rent bump the next lease year.
Files: turn.js moneyWeek splits the property tax line into named parts from S.townFlags; ui.js Money card shows them in a fold-out.
Balance: Costs are small and real, so a yes vote has a price. That keeps 'vote yes on everything' from being free.

### i73-a13 Days committee: pick three things for this year's Days (M, 🔴)
Joining the Celebration Days committee gives you a spring choice: three of horse races, the street dance, fireworks, the demolition derby, a kids' tractor pull, a bigger parade. What you picked shows up when Days week comes.
Files: state.js S.daysPicks; events.js Days week reads the picks for text and small happy/community boosts; fireworks pick checks the dry-year ban.
Balance: Needs Show up for town weeks in spring to stay on the committee. Picks change flavor and small boosts, not money.

### i73-a14 Facade grant: one storefront repainted a year (M, 🟠)
The Main Street group gets a small grant each year. You help pick which empty or tired storefront gets paint and a sign, and it changes on the Main Street close-up map.
Files: maps.js mainStreetBlock reads S.townFlags.facades (a count or list); events.js yearly 'Facade grant' choice for players in the merchants' group or with high community.
Balance: A visible change, not a money boost. Only opens with community 55+, so idle play never sees the town change.

### i73-a15 Your share of the new sidewalk (S, 🟡)
The council forms a sidewalk district on your street. Owners pay a one-time share (about $900) or spread it on the tax bill for five years; the walk to Main Street gets nicer.
Files: events.js event for homeowners in town; choice of lump sum or five-year tax line in turn.js; small lasting happy bump.
Balance: A real cost that only pays back in comfort, so it trims careless spenders a little and doesn't help idle play.

### i73-a16 Fire district commissioner: the engine or the station (M, 🟠)
An elected fire commissioner seat comes open. If you win, your first big call is whether to put the money toward a newer engine or a roof and heat for the station. Each pays off in later fire and storm events.
Files: events.js seat event (needs volunteer fire membership or community 60+); S.townFlags.fire = 'engine'|'station'; kitchen fire and wildfire events read it for better outcomes.
Balance: A seat costs one evening a month. Good outcomes help the town's response, not your score directly.

### i73-a17 The boot drive at the four-way stop (S, 🟠)
The fire crew stands at the stop on Main and Preston with boots for a Saturday. Help hold a boot, drop in a few dollars or drive around.
Files: Light events.js event in summer; holding a boot needs a Show up for town week; adds to a fire-fund counter that can unlock the new-engine outcome above.
Balance: Small community gain. Skipping costs nothing, so it does not punish busy weeks.

### i73-a18 Library board: pick the new librarian (M, 🟠)
On the library board, the head librarian retires. Two finalists: one wants longer evening hours, one wants a kids' reading room. Your pick changes what the library offers for years.
Files: events.js board event; S.townFlags.library = 'hours'|'kids'; study and class weeks at the library get a small boost from 'hours', kids' events from 'kids'.
Balance: Both options are fair trade-offs. Only reachable with a library board seat, which needs community.

### i73-a19 Grange resolutions: send one idea to the state meeting (S, 🟡)
Each fall the Grange votes on what to send to the state meeting: rural broadband, a farm road fix, a 4-H barn. You write one up and see if it passes the hall.
Files: events.js fall event for Grange members; passing adds a Tattler headline and a small community gain; years later a 'your resolution came back' note can fire.
Balance: Flavor plus a small delayed payoff. Topics stay local and nonpartisan.

### i73-a20 Four-day school week on the school board agenda (M, 🟠)
The school board weighs a four-day week. If you sit on the board you vote; if not, you can speak up. If it passes, parents of young kids need Friday care and teens get Friday jobs.
Files: events.js agenda event; S.townFlags.school4 changes kids' monthly cost (a small childcare line) and opens a teen Friday job note.
Balance: Mixed effects by design. No option is free, so it can't be gamed for score.

### i73-a21 A dog park on the council agenda (S, 🟡)
A neighbor asks council for a fenced dog park by the river. If you have a dog you can testify; if it passes, Get outside weeks with the dog get a small happy bonus.
Files: events.js event; S.townFlags.dogpark; turn.js adds +1 happy on Get outside weeks when S.dog and the flag is set.
Balance: Tiny bonus, gated on owning a dog and a passed vote.

### i73-a22 Write the grant for the new playground (M, 🟠)
The park board needs someone to write a state grant for new play equipment. It takes three class or community weeks; if it lands, the park gets a playground and kids' events get happier.
Files: events.js offer; S.grantWrite counts study or community weeks; award chance rises with weeks put in; S.townFlags.playground read by kids' and park events.
Balance: Takes real weeks away from work, and the reward is the town's, so it is a choice, not a score boost.

### i73-a23 Put your own idea on the ballot: 60 signatures (L, 🟠)
With community 65+ you can start a local measure from a short list: a splash pad, longer library hours, a crosswalk on Main. Gather 60 signatures over a few Show up weeks, then the town votes in November.
Files: New 'Start a petition' button on the Community card in ui.js; S.petition {pick, sigs}; turn.js counts sigs on community weeks; November events.js vote reads community; a passed measure sets a town flag and a tax line.
Balance: Long effort, uncertain result, and a tax line if it passes. Careless and idle play never reach the 65 gate.

### i73-a24 After the bond passes: two summers of dust and detours (S, 🟡)
A passed school or water bond means construction. For two summers some weeks carry a detour note and a small commute cost, then the new building opens with a ribbon cutting.
Files: turn.js reads S.townFlags build timers; short notes; one 'It's open' event at the end with a happy bump for everyone.
Balance: Small, temporary cost; shows that votes change the town over years.

### i73-a25 An 'I Voted' sticker streak (S, 🟠)
Voting in every November election (and special ballots) builds a streak on the Records page. Skipping breaks it. A 20-year streak earns an achievement.
Files: S.voteStreak in state.js; ballot events in events.js add to it; ui.js Records card; features.js achievement.
Balance: Voting is one tap and costs nothing, so the streak is a light nudge, not a score source.

### i73-a26 Youth council: your teen sits in at city hall (S, 🟡)
A kid 14–17 can join the youth seat on council. They come home with stories, and if your bond is good it can shape their path at 18.
Files: events.js kid event when kids are teens; small happy for both; a tag on the kid read by the age-18 path roll if that exists.
Balance: Flavor and a small family boost; no money effect.

### i73-a27 Civic hours on the Community card (M, 🔴)
Every board meeting, campaign week, boot drive and committee job adds hours to a running civic tally, shown as a short list on the Community card ('Pool levy campaign, 2031').
Files: state.js S.civic list (capped length); helper in features.js civicLog(text, hours); ui.js Community card shows the latest five and a total.
Balance: Display only; it powers the gates for write-ins, mayor and petitions, so the gates reward real time given.

### i73-a28 Two boards at once wears thin (S, 🟠)
Hold more than two civic seats (council, fire, library, school, Grange office) and each extra one costs a little happiness a week, with a note that you're stretched.
Files: turn.js counts seats; dH -= 0.5 per seat over two; one note the first week it happens.
Balance: Stops a player from stacking every seat for community and makes the seats a choice.

### i73-a29 A failed levy comes back in the spring (S, 🟠)
When a levy fails, the board tries again on the next ballot with a smaller ask. You can campaign for it, against it or sit out, and the town lives with the gap in between.
Files: events.js 'second try' ballot event reads a failed flag; S.townFlags holds the gap effect (short pool season, dark station nights) until it passes.
Balance: A gap gives the town a lived cost; the small second ask keeps it from swinging balance hard.

### i73-a30 End screen: what you helped pass (S, 🟠)
The end-of-life screen lists the measures, grants and fixes you worked on and whether they passed, under a heading like 'Because you showed up'.
Files: features.js end screen reads S.civic and S.townFlags; no new events.
Balance: No score change; it is a payoff for players who gave time to town.

### i73-a31 Swearing in, and the first agenda packet (S, 🟡)
Winning a seat opens a short scene: the oath at city hall, a handshake from the clerk and a packet thicker than you expected.
Files: events.js follow-up scene after a win (or the signature-scene frame if built); sets the first committee pick.
Balance: Pure flavor.

### i73-a32 The farm at the edge of town asks to come in (M, 🟡)
A farm family wants their land annexed for city water so they can build homes. Council (or the public, if you are not on it) weighs new families and taxes against traffic and the town's edge.
Files: events.js multi-choice council event; passing sets S.townFlags.annex, which adds a 'new families' note and slightly raises home prices in state.js rent and buy tables.
Balance: Effects are slow and small on both sides. No winning answer.

### i73-a33 Planning commission: a shop in a neighbor's garage (S, 🟡)
Your neighbor wants a variance to run a small engine shop out of their garage. On the planning commission you vote; off it, you can write in for or against.
Files: events.js event; outcome adds a neighbor mood note and, if approved, a cheap repair option on car events.
Balance: A small trade-off; no big money either way.

## Ideas 73: Saves, endings and sharing

Ideas for keeping lives safe, remembering finished lives and families, and sharing endings and starts with friends, all without accounts or a server.

### i73-b01 Finished lives leave a small stub, so they aren't lost at "Play again" (M, 🔴)
finish() in js/features.js calls writeSlot(slot, null) and only the best score survives. After "Play again" nothing of the life is left.
Add ENDS_KEY (KEY_PREFIX + "ends.v1") and an endStub(S, reason) helper called in finish() before the slot is cleared. Keep the 10 best plus the 5 most recent, so it stays under about 15 KB.
This is the storage that the shelf (i2-b03), family tree (i2-b14) and hall of fame ideas need. It is plumbing, not a screen.
Balance: nothing here touches the score. Practice lives (S.practice) never write a stub.

### i73-b02 Top 10 lives in Your records (S, 🔴)
recordsSheet() in js/ui.js shows only a best number per length and mode, with no name or story behind it.
Add a ranked table under the length × mode grid, built from the ENDS_KEY stubs. Weekly and challenge lives get a small tag so they aren't mixed up with free play.
hasRecords() also turns true when any stub exists, so the 🏆 button shows after the first finished life.
Balance: it ranks by Life Score, which already keeps careless and idle play low, so the list rewards good lives.

### i73-b03 Read your last ending again, and share it later (S, 🟠)
Today the end sheet is gone once "Play again" is tapped, and scoreCard() draws from the global S, so you can't share after closing it.
Change scoreCard(stub) to draw from a stub, not S. renderTitle() adds a small link that opens a read-only end sheet built from the newest stub.
Files: js/features.js (scoreCard, shareCard, finish) and js/ui.js (renderTitle).
Balance: you can only read it again. Nothing can be replayed or changed.

### i73-b04 Deleting a life still keeps its stub, marked "set aside" (S, 🟡)
askDelete() in js/ui.js wipes everything. Players who clear a slot to start over lose all trace of a 10-year life.
Write a stub with cause "set aside" and the score so far, kept out of the top-10 ranking and best scores.
Balance: a set-aside life never counts as a best or a finished life, so you can't quit a bad run and keep a high score.

### i73-b05 Records by starting background (S, 🟡)
bestKey() in finish() keys on length and mode only, so a Young parent best and a Fresh start best share one cell.
Read it from the end stubs (S.bg is in each one), so there are no new best keys and old records still line up.
Files: js/ui.js recordsSheet(); it needs the stub (i73-b01).
Balance: harder starts get their own row, which gives a reason to try them without changing any numbers.

### i73-b06 Totals across all your lives (S, 🟡)
Add a TOTALS_KEY that finish() adds to (or work it out from the stubs if they carry enough).
Shown as plain lines, no ranking. Backups carry it (see i73-b30).
Balance: it counts what you did, not what you scored, so it can't make idle play look better.

### i73-b07 Your best life under the title (S, 🟡)
renderTitle() in js/ui.js already reads BEST_KEY. Read the top stub instead, so the line has a name and title, not just a number.
It shows only after the first finished, non-practice life. Tapping it opens Your records.
Balance: cosmetic.

### i73-b08 Name a slot: a short label under the life's name (S, 🟡)
slotCard() in js/state.js shows the name, slotLine and "Slot n". Two lives named Dusty look the same.
Store S.slotLabel, escape it with esc(), and let repairLife() drop it if it isn't a string.
Balance: cosmetic.

### i73-b09 Star a life so Replace and Delete pass it by (S, 🟠)
askReplace() in js/ui.js offers every full slot, and restore "Replace all" wipes them all. One tap in the wrong place loses a 40-year Lifetime game.
Store S.kept = true. restoreBackup(b, "replace") keeps starred lives and fills only the other slots, and the preview says so.
Balance: none. It only protects saves.

### i73-b10 Slot cards show the Life Score so far (S, 🟠)
save() in js/state.js stores S.scoreNow = lifeScore().score and the four parts, so the title screen doesn't need to rebuild S for each slot.
slotLine()/slotCard() draw it, and the bar uses the same colors as showScoreNow().
Balance: it only shows what the Home score button already shows.

### i73-b11 The weekly challenge gets its own slot (S, 🔴)
startWeekly() in js/features.js needs a free slot; players with five Lifetime lives can't play the weekly at all.
Add WEEKLY_SLOT_KEY. save() writes there when S.weekly is set, and pruneWeekly() deletes a finished or stale week. The title screen shows it as one extra card tagged 📅.
Backups skip it, since weekly lives lock to their week (i63-b28).
Balance: same rules and dice as today. It only frees a slot.

### i73-b12 Private window warning on the title screen (S, 🔴)
store.set() swallows errors, and private windows often accept writes and then forget them at close, so players lose a life without any sign.
Detect it: navigator.storage.estimate() reports a very small quota (around 100 MB or less in Chrome and Firefox private windows), or navigator.storage.persisted is missing while the localStorage write test passes. Show the card in renderTitle() and once on Home.
Better a missed warning than a false one: say "may forget" when only one sign shows.
Balance: none.

### i73-b13 iPhone Safari: warn that lives go after 7 days away (S, 🔴)
Different from the install card (i2-a30): this is about losing data, shows on the title screen, and comes back if the last visit was more than 4 days ago (prefs.lastSeen).
Detect it with an iOS user agent or the standalone check: navigator.standalone !== true and no display-mode: standalone match.
Pair it with a "Back up now" button that opens backupSheet().
Balance: none.

### i73-b14 Empty title screen on a phone that played before: offer Restore first (S, 🟠)
Cleaner apps and "clear cookies" sometimes empty localStorage but leave the service worker and caches. Today the player sees a brand-new game and may start over before thinking of their backup.
In js/boot.js, check navigator.serviceWorker.controller and a one-entry marker cache ("theburg-seen") that is written after the first save. If storage is empty, renderTitle() moves Restore above Start.
This won't catch a full wipe. Help says so plainly.
Balance: none.

### i73-b15 A Storage line in Settings: is this phone keeping your lives? (M, 🟠)
It pulls together facts the game can already check: matchMedia standalone, navigator.storage.persisted()/persist(), the JSON length of SLOTS_KEY, and a prefs.lastBackup stamp set by backupSheet().
The buttons are Install (INSTALL_EVT), Ask to keep (persist(), i3-b03) and Back up now.
Files: js/ui.js settingsSheet, backupSheet; js/state.js prefs.
Balance: none.

### i73-b16 Auto-backup to a folder you choose (M, 🟠)
Use the File System Access API (showDirectoryPicker). The folder handle is kept in IndexedDB, and write access is asked again with requestPermission() at the first backup of each visit.
It writes backupData() from js/ui.js as is. Browsers without the API (Safari, Firefox) don't see the option.
The Storage line (i73-b15) shows "Auto-backup: on, last written Jan 2031".
Balance: none. Restoring still goes through restoreSheet's checks.

### i73-b17 A sync file two computers can share (L, 🟡)
For each life, keep whichever copy has the higher turn (the merge rule from i3-b11), matched by life id (i63-b24). A life that went further on both sides asks which one to keep, with both slot lines shown.
It reuses readBackup() for every check, so a damaged file can't get in.
Off by default, with a clear "this computer last synced …" line.
Balance: same rules as restoring a backup, so you can't keep two copies of one life to try a choice twice. Weekly lives don't sync.

### i73-b18 Share a short text along with the picture (S, 🔴)
navigator.share({ files, title, text }) in js/features.js shareCard(). Messages and Facebook show the text under the picture.
Weekly lives add the week ("Weekly challenge, week of Nov 16") so a friend knows which one to play.
The same text works as alt text for the picture when the player posts it.
Balance: none.

### i73-b19 Square and tall sizes for the score card (S, 🟡)
scoreCard() in js/features.js uses fixed y positions. Change it to take (w, h) and space the blocks out by h.
The last choice is kept in prefs.cardSize.
Balance: none.

### i73-b20 The score card says how the life ended (S, 🟠)
finish(reason) has a long sentence for the end sheet. Add a short cause key (age, time, debt, scenario, gave up) to the stub and to scoreCard().
Kind words for hard endings: "Started over somewhere new" rather than "Bankrupt".
Balance: none.

### i73-b21 A picture on the score card that fits the life (M, 🟡)
Draw it with canvas shapes in the same flat style as SCENE on the title screen (js/ui.js), with no image files, so it still works offline.
Pick the scene by home, business and kids, then by the job's city.
Balance: none.

### i73-b22 A QR code on the score card to play the same start (M, 🟠)
Needs a seed on every life: give non-weekly lives S.rng and S.rngEv at newGame() (useDice() already handles seeded dice), so any ending can be replayed.
The QR holds the address and a short #c= code (seed, length, mode, background, score to beat). Add a small QR encoder file (about 4 KB, no outside library) to js/.
boot.js reads location.hash and opens the challenge sheet before renderTitle()'s new-life form.
Balance: the friend plays under locked rules (i19-b28). Their score goes in as a challenge result, not a best for that length.

### i73-b23 A challenge link with a score to beat, and a side-by-side result (M, 🟠)
It uses the same #c= code as the QR (i73-b22). The code carries the sender's four parts so the comparison works offline.
finish() checks S.challengeFrom and adds a two-column block. The stub keeps who you played against.
Fits i50-a33: it only compares two people who chose to compare, with nothing kept or ranked beyond that.
Balance: the seed is the same but choices differ, so playing well is the only way to win.

### i73-b24 Last month's weekly challenges stay playable (S, 🟠)
startWeekly(name, wkid) takes a week id. weekSeed() already builds the dice from any week string.
pruneWeekly() keeps the last 4 wk- keys instead of only the current one.
Balance: a late week can't beat or replace the current week's record, so there is nothing to gain from replaying old seeds.

### i73-b25 Each heir's save carries the family line (M, 🔴)
In finish(), the parent object gets the life's stub. startLegacy() sets S.line = [...(parent.line || []), parentStub], kept to at most 40 entries of about 200 bytes each.
migrate() gives older heirs an empty line, with a "generations before this one weren't recorded" note.
This is the data for i2-b14 (the family tree) and i54-b25 (mentor lines), and it travels in the slot, so backups carry it for free.
Balance: the line is only shown. It gives no money or stats.

### i73-b26 A cousin's life: start a second heir from the same ending (M, 🟠)
legacySheet() in js/features.js gets a second name field and a free-slot check. Each heir gets half of inheritance(): one big share becomes two smaller ones.
Each branch keeps the same family id, so the tree can show the split, and each gets its own gen count.
Balance: the inheritance is split, not doubled, so a branch can never be worth more than one heir. Probate and the will still apply to each share.

### i73-b27 A family card: the whole line in one picture (M, 🟡)
A new familyCard() next to scoreCard() in js/features.js, drawn from S.line plus the current life.
It uses the same tall or square sizes and the same share text as the score card.
Balance: it shows the average, so one great heir can't hide three weak lives.

### i73-b28 Slot cards show the generation and the family best (S, 🟡)
slotLine() in js/state.js adds it when S.gen > 1, with the best score taken from S.line.
Ties in with i12-b21 (mode and weekly tags) without repeating it.
Balance: cosmetic.

### i73-b29 Players on this device: separate lives and records for each person (L, 🟡)
Add a profile part to the key: KEY_PREFIX + "p2." for the second player, and so on. slots(), BEST_KEY, BADGE_KEY, CHALLENGE_KEY and ENDS_KEY all go through one key(name) helper. Player 1 keeps today's keys, so nothing needs to move.
A backup holds one player by default, with an "All players" option.
Balance: none. Each player's records only hold their own lives.

### i73-b30 Backups carry finished lives and family lines (S, 🟠)
js/ui.js backupData() and restoreBackup(). Stubs merge by id plus end date with no copies, and the totals take the larger count.
readBackup() checks every stub field: numbers must be numbers, text is escaped when shown, and the list is capped at 15.
The restore preview adds a line: "and 12 finished lives for your records".
Balance: a stub never becomes a best score unless BEST_KEY already agrees (i57-a20).

### i73-b31 A score card picture that is also a keepsake file (M, 🟡)
After canvas.toBlob(), add an iTXt chunk ("theburg-stub" = the stub as JSON) to the PNG bytes before sharing. That is about 40 lines and needs a CRC32 function.
restoreSheet() accepts image/png: it finds the chunk, checks it like any stub, and lists it as someone else's life if the name doesn't match one of yours.
Social apps often strip this data. Help says that a picture saved straight to Files or sent by email keeps it.
Balance: stubs from pictures are tagged and never count as your bests.
