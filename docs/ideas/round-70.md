# Ideas round 70

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 70: Farm and ranch life

The wheat, cattle and grapes around Waitsburg as a full-time career and as side income, with real weather, price and loan choices.

### i70-a01 Forward-sell part of next year's wheat in spring (M, 🔴)
From March to May the farm sheet offers to lock a price on up to half your expected crop. If the harvest comes up short, you buy back the gap at the summer price.
- Adds a 'Lock a price' button to the wheat lease sheet and a S.biz.fwd record (bushels, price).
- At harvest the locked bushels pay the locked price, the rest pays the July price.
- Touches features.js: BIZ.wheat, the monthly price roll, the harvest check.
- Balance: the locked price is set near the expected price, so it cuts risk, not adds money. Over-selling before a bad year costs real cash.

### i70-a02 A spring weather outlook on the farm sheet (S, 🔴)
Each February the farm sheet shows the season outlook: wet, normal or dry. It shifts the yield roll, and it is right about two years in three.
- Stored as S.outlook, rolled once a year in the monthly roll.
- wheatYield() reads it: dry narrows the range low, wet lifts it.
- Gives forward-selling and crop insurance a reason, so they are choices, not coin flips.
- Touches features.js. Balance: no new money; it rewards players who read the sheet.

### i70-a03 Pick your crop insurance level: 50, 70 or 85% (S, 🔴)
Crop insurance becomes three levels instead of one. Higher coverage pays more in a bad year and costs a lot more every April.
- Replaces CROP_INS and CROP_INS_YIELD with a small table; the level shows on the farm sheet and the money outlook.
- Premiums climb faster than coverage, as real policies do.
- Touches features.js (wheatYield, the outlook's April premium line).
- Balance: 85% loses money on average; it only pays off for careful players who skipped a forward sale in a dry year.

### i70-a04 Falling number: rain at harvest docks the price (S, 🟠)
A wet August can sprout the grain in the head. The elevator tests it, and low-testing wheat sells 15 to 30% under the posted price.
- A small chance in wet-outlook years, higher if harvest ran late.
- Shows on the harvest check as its own line: 'Quality discount'.
- Storing the grain does not fix it.
- Touches features.js harvest code. Balance: a cost only, softened by the 85% insurance level.

### i70-a05 The river is closed: the barge locks shut and the price drops (S, 🟠)
Most local wheat goes down the river by barge. When the locks close for repairs or the river runs low, the elevator price drops for six to ten weeks.
- An event in late summer or winter; the co-op price falls about 8%, then recovers.
- Players with stored wheat can wait it out and pay storage, or sell now.
- Touches events.js and the wheat price drift in features.js.
- Balance: rewards watching the price; storage fees keep waiting from being free.

### i70-a06 The farm sheet keeps a record of every crop year (S, 🟠)
A small table on the farm sheet: year, outlook, bushels per acre, price, insurance paid and what the year netted.
- Stored as S.biz.hist, one row per harvest.
- Helps players learn the land and spot whether insurance has paid for itself.
- Touches features.js biz sheet. Later ideas (the farm loan) read it.
- Balance: information only.

### i70-a07 Farm full-time: run your own ground as your job (L, 🔴)
A real farming career. Instead of hiring the lease farmed, you farm it yourself: no paycheck, no custom-farming bill, and your work weeks become field weeks.
- Picked like a job ('Farming your own ground'); pay is the crop, so income comes in lumps.
- Missing work weeks during fall seeding (Sep–Oct) or harvest (Jul–Aug) lowers that year's yield.
- Needs more ground than the 80-acre lease: a bigger lease or owned land, plus equipment (next idea).
- Touches state.js JOBS, turn.js weekly pay, features.js wheat code. Balance: idle farming yields about 60%; good play lands near a mid-level job's pay plus land value.

### i70-a08 Equipment notes: a used tractor and drill on a five-year loan (M, 🟠)
To farm your own ground you need machines. Buy a used tractor and drill on a five-year note, or rent them each season for more.
- The payment shows on the money sheet; the machines lose value each year and can be sold at a farm auction.
- Renting costs more per year but carries no debt.
- Touches features.js (money outlook, net worth) and the farm sheet.
- Balance: debt is real; a bad year with a note due stings.

### i70-a09 Share a drill with the neighbor (S, 🟠)
Split the cost of a drill 50/50 with the farmer next door. You seed second, so in a late fall the wait can cost some yield.
- A choice when you buy equipment; the neighbor becomes a named contact.
- Keeping the deal raises Community a little each year.
- Touches features.js equipment code and a small event.
- Balance: saves money for a small risk; no stacking.

### i70-a10 A land contract: the old farmer carries the note (M, 🟠)
When ground comes up for sale, a retiring seller offers to finance it himself: 10% down and payments to him for 15 years.
- An offer next to the bank's terms when buying ground (i15-a09).
- Two missed payments and the ground goes back to him, with what you paid lost.
- Touches features.js land purchase and the money outlook.
- Balance: higher interest than a bank; easier to get, harder to keep if you coast.

### i70-a11 A beginning-farmer loan from the county farm loan office (M, 🟠)
A low-down-payment land loan for people who have farmed fewer than ten years. The paperwork takes 12 weeks and asks for three years of farm records.
- Stand-in office name. Uses the crop-year record table as proof.
- Opens only after three harvests of your own.
- Touches features.js land purchase.
- Balance: idle or new players can't use it; it rewards a real farm history.

### i70-a12 Put the steep ground in the conservation program (S, 🟠)
Owners can enroll their steepest ground in a 10-year conservation contract: grass instead of wheat, a small payment every October.
- The payment is below what farming it would earn; the land-health number rises.
- You can't plow it again until the contract ends.
- Touches features.js land ownership and the valley ledger (i45-a01) if built.
- Balance: steady but small, so it can't carry an idle life.

### i70-a13 A grain bin at home instead of the elevator (S, 🟠)
Farmhouse owners can buy a grain bin and store their own wheat with no elevator fee. A bin needs checking, or the grain can spoil.
- Check it with a Get outside week once a month in summer and fall.
- Unchecked bins risk a 20% loss to heat and bugs.
- Touches features.js stored-wheat code (WHEAT_STORE_FEE).
- Balance: saves fees only for players who keep checking.

### i70-a14 Run for the co-op elevator board (M, 🟠)
After two years with a wheat lease and good standing, you can run for the co-op board at the January annual meeting.
- Board members give up one evening a month (a little stress) and vote on one big question a year: a new loader, or merging with the Dayton co-op.
- The vote shows up in town text and the next year's price spread.
- Touches events.js (annual meeting), features.js (co-op), state.js (S.coopBoard).
- Balance: no pay; it trades time for Community.

### i70-a15 Grow the herd: keep back heifers instead of selling them (M, 🟠)
At the October auction you choose how many heifer calves to keep. They eat hay for two years before they calve, then the herd is bigger.
- The herd can grow from 6 to about 30 cows, with pasture rent rising to match.
- More cows means bigger auction checks and bigger losses when nobody checks them.
- Touches features.js cattleWeek and the auction.
- Balance: costs cash now for income later; neglect hurts more as the herd grows.

### i70-a16 Cattle prices run in long waves (S, 🟠)
Calf prices follow a slow cycle of about ten years. The farm sheet says whether prices are climbing, near the top or falling.
- Replaces the fixed CALF_PRICE with a cycle plus a little noise.
- Pairs with keeping heifers: grow the herd on the way up, sell down near the top.
- Touches features.js.
- Balance: the long-run average stays the same.

### i70-a17 Branding day: the neighbors work your calves, you work theirs (S, 🔴)
Every spring the ranchers trade a Saturday. Help at two neighbors' brandings and they all come to yours; skip them and you hire help.
- Cattle owners get the event in April and May; Show up for town weeks count as helping.
- Going earns Community and a free branding; skipping costs a hired-crew bill.
- Touches events.js and features.js cattleWeek.
- Balance: rewards showing up, a small cost for coasting.

### i70-a18 A wolf takes a calf: file the state claim (S, 🟠)
Wolves are back in the Blue Mountains. A calf is lost, and the state pays for it only if you found it within a few days.
- Claim pays if the herd was checked in the last two weeks; otherwise no payment.
- Plain, factual tone; no villain.
- Touches features.js cattleWeek and events.js.
- Balance: a loss that checking softens.

### i70-a19 A cow dog that knows the work (S, 🟠)
Buy a trained stock dog or raise a pup over a year. With a dog, a herd check lasts nine weeks instead of six, and branding needs one less helper.
- Ties to the dog systems if a dog exists; a cow dog is its own named dog.
- Touches features.js (herdChecked) and the dog record.
- Balance: a cost up front; it eases, but does not remove, the need to ride out.

### i70-a20 Breaking ice on the water trough (S, 🟠)
In a cold snap from December to February, cattle owners have to get out and break the ice that week, or a cow gets sick and the vet comes.
- A short weather event; Get outside that week clears it.
- A missed week costs a vet bill and a little happiness.
- Touches events.js and cattleWeek.
- Balance: a small, fair cost for ignoring the herd in winter.

### i70-a21 Custom-graze a neighbor's yearlings for the summer (S, 🟠)
If you have pasture, take a neighbor's 20 yearlings from May to September for a monthly fee per head. Lose one and you pay for it.
- Open to cattle owners and land owners; side income without buying stock.
- Uses the same herd-check rule.
- Touches features.js (a summer add-on to the cattle or land record).
- Balance: modest pay that needs checks; no pay if you coast.

### i70-a22 Build fence for ranchers: a spring side hustle (S, 🟠)
A new side gig from March to May: building barbed-wire fence on the Dayton-side ranches. It pays more than yard work and is harder on you.
- Added to GIGS in state.js: pay above yard work, health -1 a week.
- Needs a pickup.
- Balance: same Side hustle week cost as other gigs.

### i70-a23 Farm-sit while a family goes to the fair (S, 🟡)
A one-week offer in late August: feed and water a family's stock while they show at the fair. Skip the chores and a gate gets left open.
- Pays a few hundred dollars and Community.
- Doing it means a Get outside week; anything else risks the open gate (a small bill and a talk).
- Touches events.js.
- Balance: small and one-off.

### i70-a24 Ranch hand on a cow-calf outfit near Dayton (M, 🟠)
A new outdoor job. Calving nights in February and March raise stress; a few good years make you the cow boss.
- Pay near the farm hand's, high wear. The cow boss perk: run your own six cows on the ranch's grass with no pasture rent.
- Touches state.js JOBS and LAYOFF_RISK, and the cattle pasture line.
- Balance: the perk only helps players who also run cattle and keep checking them.

### i70-a25 Crop adjuster: walk the hailed fields (M, 🟠)
A new job at a crop insurance office. Quiet most of the year, then long weeks after hail, drought or a wet harvest.
- Overtime pay comes in storm years, with stress to match.
- Different from the farm insurance agent (who sells policies).
- Touches state.js JOBS and events.js (storm years set a flag).
- Balance: pay averages mid-level; the spikes come with stress.

### i70-a26 Ag lender at the farm credit office (M, 🟠)
A Walla Walla office job lending to farmers. Farm know-how from a past lease or the Farming skill earns a raise.
- Story choices: approve the young couple's first land loan or play it safe.
- Touches state.js JOBS and a short event chain.
- Balance: a normal office path; farm history helps but doesn't jump the ladder.

### i70-a27 Auctioneer school: call the Tuesday sale (M, 🟡)
Pay for a two-week course, then call the Tuesday livestock sale and the farm estate auctions on Side hustle weeks.
- Pays per sale and builds Community; good for a talker.
- Touches state.js GIGS (a new gig after the course) and outabout.js (the sale barn).
- Balance: course cost up front; pay matches other gigs.

### i70-a28 Lease a bearing vineyard block and sell the grapes (M, 🟠)
Lease five acres of grapes that already produce. Sell them on contract to a winery each October. Frost in April and smoke in August hit the price.
- Pruning in February takes Side hustle weeks, or you pay a crew.
- Reads the existing S.smoke year for smoke-tainted fruit.
- Touches features.js BIZ (a new 'grapes' type).
- Balance: hired pruning eats most of the profit; the margin comes from your own weeks.

### i70-a29 Custom crush: make wine from your own grapes (S, 🟡)
With the vineyard lease, keep a ton back and pay a custom crush cellar to make it. It becomes a vintage you own, sold two years later.
- Plugs into the existing wine vintage system (S.wine).
- Touches features.js.
- Balance: money tied up for two years; smoke years can sour it.

### i70-a30 Chickpeas in the rotation: the hummus contract (S, 🟠)
Instead of peas or fallow, sign a winter contract for chickpeas. Better price, but a wet spring can bring disease and cut the crop in half.
- Builds on the rotation choice (i18-a03).
- Touches features.js wheat-year code.
- Balance: higher expected pay with more risk; insurance covers part.

### i70-a31 Farm ground gets its own slot, apart from the one business (M, 🔴)
Today you can run only one business, so a farmer can't also keep the woodshop. Farm enterprises move to their own slot: one farm plus one town business.
- Moves wheat, cattle and grapes to S.farm; the money sheet and net worth read both.
- A save migration in state.js copies S.biz to S.farm when it is a farm type.
- Balance: every farm enterprise needs active weeks; run the sim bots to keep careless at or under 60 and idle at or under 50.

### i70-a32 The rain gauge on the fence post (S, 🟡)
During the growing season the week recap shows rain: '0.4 inch this week, 6.2 since September'. It is the same weather that sets your yield.
- Makes the outlook and the yield roll visible week by week.
- Touches turn.js week recap and features.js.
- Balance: information only.

### i70-a33 Farm safety: the rollbar and the seatbelt (S, 🟠)
Farm hands and tractor owners can pay to put a rollbar on the old tractor. On a side-hill near-miss, the rollbar means you walk away.
- Without it: a health hit and a medical bill.
- Touches events.js and the equipment record.
- Balance: a small cost that pays off once in a long life.

### i70-a34 Winter grower meetings at the fairgrounds (S, 🟡)
In January and February, Study weeks can go to the extension office's grower meetings. Each one adds Farming skill progress.
- Three meetings in a winter make the spring outlook right three times in four for you.
- Touches turn.js study focus and features.js outlook.
- Balance: costs study weeks that could go to a degree.

## Ideas 70: One-handed phone play

Ideas for playing on a small phone with one thumb: reach, sheets, text size, battery and interruptions. All are interface only and change no scores.

### i70-b01 Text size reaches the header, tabs and End Week (S, 🔴)
Menu → Settings → Text size only grows text sized in rem. The header, tab labels, End Week, the Last week strip and toasts use px, so they stay small.
- index.html: .top h2, .top .money, .top .meta, #app > nav button, .endbar .btn, .endbar #end small, .weekstrip .wl/.delta and .toast are in px; move them to rem.
- Cap the header with clamp() so an XL name still fits on a 320px phone.
- Comfort setting only: no game effect.

### i70-b02 Swipe a sheet down from anywhere when it's at the top (S, 🔴)
Today only the small handle at the very top of a sheet swipes it closed, which is the hardest spot for a thumb. A downward swipe anywhere on a sheet that is scrolled to the top closes it too.
- ui.js pointerdown: if the target is inside #sheet, sheet.scrollTop is 0 and sheetCloser() finds a button, track it like the .grab drag.
- Event choice sheets still have no closer, so they can't be swiped away.
- No score effect.

### i70-b03 Tap the dim area above a sheet to close it (S, 🟠)
Tapping the darkened game above an open sheet closes it the safe way, like most phone apps.
- ui.js: one click handler on #modal that runs only when e.target is #modal itself, and clicks sheetCloser().
- Ignore taps in the first 350ms after a sheet opens, and never close event choice sheets.
- No score effect.

### i70-b04 Tap the tab you're on to jump to the top (S, 🟠)
On a long Jobs, Life or Journal page, tapping the same tab again scrolls smoothly back to the top instead of redrawing the page.
- ui.js render(): the nav handler checks b.dataset.tab === tab and calls window.scrollTo({top:0, behavior:'smooth'}) (instant with Reduce Motion).
- No score effect.

### i70-b05 Each tab remembers where you were (M, 🟠)
Leave the Jobs list halfway down, check Home, and come back to the same row. Today every tab change and swipe jumps to the top.
- ui.js: a TABY map saves window.scrollY per tab before the nav handler and swipeTab() change tabs, and restores it after render().
- Home still opens at the top after End Week; the memory clears when a new week starts.
- No score effect.

### i70-b06 Buying or changing something keeps your place (M, 🟠)
Tapping a button low on the Life tab (401(k) rate, sell wheat, buy a ride) redraws the page and can jump it, so the thumb loses its spot. The tapped card stays where it was.
- ui.js render(): before redrawing, note the tapped element's id or data attribute and its top on screen; after, scroll so the same element sits at the same height.
- Touches the many save(); render() calls in ui.js and features.js through one helper.
- No score effect.

### i70-b07 Help closes from the bottom of the screen (S, 🔴)
Help is a full page whose only Close button sits in the top corner. A slim bar at the bottom of Help holds Close and Contents within thumb reach.
- help.js showHelp(): add a fixed bottom bar with safe-area padding; Contents scrolls #helpview to the top.
- Raise .helpbody bottom padding so the bar never covers the last line.
- No score effect.

### i70-b08 The header folds to one slim line when you scroll (S, 🟠)
Past the first card, the red header drops the date line and progress bar and keeps just the name and cash, giving a short phone about 30px more room.
- index.html: a .top.slim style; ui.js: one passive scroll listener with requestAnimationFrame toggles it past 40px.
- Unfolds at the top. Off with Reduce Motion's no-animation rules (it just snaps).
- No score effect.

### i70-b09 No text smaller than 12px (S, 🟠)
Several labels are 11px: the ⓘ on stat cards, tags like Practice, Help table headers and the tutorial step line. They are hard to read on a phone at arm's length.
- index.html: raise .info, .tag, .guide th and .cstep to at least 0.75rem, and the tab labels from 12px to 0.8125rem.
- Add a check to tests/screens.test.mjs that no visible text is under 12px.
- No score effect.

### i70-b10 The backup code box doesn't zoom the page on iPhone (S, 🟠)
The restore box (#rscode) uses 12px text, so iPhone Safari zooms the whole page in when you tap it and leaves it zoomed.
- index.html: .code gets font-size 1rem on touch phones (@media (pointer:coarse)); keep the small monospace look on desktop.
- No score effect.

### i70-b11 The name box's keyboard says Go and capitalizes (S, 🟡)
Typing a name shows a keyboard with Go; pressing it starts the life, and the first letter is capitalized for you.
- ui.js renderTitle #nm and features.js #heirnm: add autocapitalize="words", spellcheck="false" and enterkeyhint="go"; Enter clicks #start (or the heir's confirm).
- No score effect.

### i70-b12 Sounds sleep when you switch apps (S, 🔴)
When the game goes to the background, its audio engine pauses, so it uses no battery and can't play a page-turn over a phone call.
- state.js/boot.js: on visibilitychange to hidden, AUDIO.suspend(); sfx() already resumes it on the next sound.
- No score effect.

### i70-b13 Sideways sheets slide in from the side (M, 🟠)
On a phone held sideways, sheets take the full height of the right half of the screen instead of a short strip from the bottom, so event choices and Close sit under the thumb.
- index.html: in the existing (orientation:landscape) and (max-height:520px) block, .modal aligns right and .sheet becomes min(420px,55%) wide, full height, with right safe-area padding.
- Event choices stay at the bottom of that panel. Follows the hand setting below.
- No score effect.

### i70-b14 A left-hand setting (S, 🟠)
Settings gets ✋ Hand: Right or Left. Left mirrors the End Week row and the sideways sheet so the big buttons stay in a left thumb's easy arc.
- state.js SETTINGS gets hand; applyPrefs sets html.lefty; index.html flips .endbar with flex-direction:row-reverse and the landscape sheet side.
- No score effect.

### i70-b15 Sideways chip rows show there's more (S, 🟡)
The Jobs and Journal chip rows scroll sideways with no scrollbar, so a thumb user never sees the chips past the edge. A soft fade marks the hidden side, and the chosen chip scrolls into view.
- index.html .chips: mask-image fade on the edge with more; ui.js after render: the .chip.on calls scrollIntoView({inline:'center', block:'nearest'}).
- No score effect.

### i70-b16 Swipes show and feel when they count (S, 🟡)
Dragging a sheet down fades the dim backdrop as it goes, and a tiny buzz marks the point where letting go will close it. A tab swipe gives the same tick.
- ui.js pointermove: set #modal opacity from dy; buzz('tick') once on crossing SWIPE_MIN; state.js BUZZ gets tick:6.
- Vibration setting still turns it off. No score effect.

### i70-b17 The safe answer is always the bottom button (S, 🔴)
Yes/no sheets put buttons in different orders: Delete a life puts Delete first, Replace puts it last, and End this life is the bottom button, right where the thumb lands. The bottom button is always the safe one.
- ui.js 166 (Delete/Keep it), 178 and 201 (Replace/Back), 790 (confirmRetire), features.js 1135: safe answer last, risky answer above it in a ghost red style.
- Close or Not now is always the last row of any sheet.
- No score effect.

### i70-b18 True black night theme for OLED phones (S, 🟡)
Theme gets a Black option: the night theme with pure black backgrounds, easier on the battery of most newer phones and darker in bed.
- state.js SETTINGS theme opts add black; index.html html.night.black sets --cream and --paper near #000 and meta theme-color to match.
- No score effect.

### i70-b19 A year in review you didn't see waits for you (M, 🟠)
If the phone drops the app while the year in review is waiting behind an event (a call, the camera), the review is lost. It now waits and shows when you open the life again.
- turn.js after(): set S.reviewDue before showing; clear it when the review sheet closes; ui.js loadSlot shows it if set.
- Story only: the review changes nothing, so it can't be farmed.

### i70-b20 More room between side-by-side small buttons (S, 🟡)
Small buttons sit 6px apart in slot rows, chip rows and Settings choices, so a thumb can hit the neighbor. Make the gap 10px.
- index.html: .slotbtns, .chips, .seg, .maptog gap 6px to 10px; keep 44px minimum sizes.
- No score effect.

### i70-b21 Home doesn't shift under your thumb (S, 🔴)
When the browser's install offer arrives, boot.js redraws Home and drops the install card in above the focus grid, so a tile can move just as you tap it. Tapping Got it on a tip does the same.
- boot.js beforeinstallprompt: stop calling renderHome(); the card shows at the next normal render.
- ui.js data-tip: fade the tip out and keep its space until the next render.
- No score effect.

### i70-b22 Toasts let taps through (S, 🔴)
A toast sits right over the Last week strip and End Week row for two seconds, and a tap on it does nothing. Taps now pass through to the button under it.
- index.html .toast: pointer-events:none.
- No score effect; it also stops a missed tap feeling like the game froze.

### i70-b23 A reach check in the screen tests (M, 🟠)
A test at 360×640 checks that End Week, event choices, sheet Close or OK, and Help's Close all sit in the bottom 45% of the screen.
- tests/screens.test.mjs: open each sheet type and measure getBoundingClientRect() centers.
- Catches future sheets that put their main button at the top. No score effect.

### i70-b24 Filters ride above the tab bar (M, 🟡)
On Jobs and the Journal, the filter chips stick just above the tab bar once you scroll, so you can change town or filter without reaching back to the top.
- index.html: on Jobs and Journal, .chips gets position:sticky with bottom set above the nav and safe area; ui.js renderJobs and renderLog wrap the row.
- No score effect.

### i70-b25 A Continue button at the bottom of the title screen (S, 🟡)
With saved lives, Continue sits in a card near the top of a long page. A bar at the bottom holds ▶ Continue with your latest life's name.
- ui.js renderTitle(): a fixed bottom bar for the most recently saved slot, with safe-area padding; hidden when the name box has focus.
- No score effect.

### i70-b26 The Menu fits on one screen (S, 🟠)
The Menu is nine full-width buttons, taller than a small phone, so Close falls off the bottom. Make it a two-column grid with Close as one full row at the bottom.
- ui.js showMenu(): wrap the buttons in a 2-column grid; End this life stays apart from Close, top right.
- No score effect.

### i70-b27 The open tab is easy to see in sunlight (S, 🟡)
The current tab only changes color. Give it a soft pill behind the icon so you can tell where you are at a glance.
- index.html #app > nav button.on .ic: background var(--tint), border-radius 999px, padding.
- No score effect.

### i70-b28 Toasts wait if you've left the app (S, 🟡)
A badge toast that fires as you switch away is gone when you come back. If the page is hidden, the toast waits and shows when you return.
- state.js toast(): if document.hidden, keep the message and show it on the next visibilitychange to visible.
- No score effect.
