# Ideas round 74

Pick what you want on the build board or tell me. Details per idea below.

## Ideas 74: Health, body and aging

Ideas for how bodies, health care, injuries and aging feel in a small rural town, kept gentle and plain.

### i74-a01 Injuries that fit the job (M, 🔴)
Each job gets a body part it wears on (back for farm hands and nurses, wrists on the onion and food lines, ears at the airport and rail yard, feet for retail). 'Hurt on the job' names it and its fix fits it.
Touches: JOBS in state.js gain a body field; the 'Hurt on the job' event in events.js reads it for its text and choices.
Balance: Same odds and costs as today, only the words and the right fix change, so careless play gets nothing extra.

### i74-a02 Washington sick hours that pile up (S, 🔴)
Jobs earn sick hours like the state rule (one hour per 40 worked). When 'Feeling run down' or the flu hits, saved hours cover the time off so the week isn't unpaid.
Touches: New S.sickHrs added in turn.js on paid months; the sick events in events.js offer 'Use sick hours'; the bank shows on the Life tab.
Balance: Hours cap at 40 and only pay for time off, so they never turn into cash. Idle players earn none with no job.

### i74-a03 A mental health day, no questions asked (S, 🔴)
When happiness runs low, a quiet 'Take a personal day' choice can appear on the week. You get a calm day and a small happiness lift, written with respect and with no explaining needed.
Touches: A small event in events.js gated on happy < 45 with a job; it uses sick hours if you have them, otherwise one day's pay.
Balance: At most once every 13 weeks and worth less than a Rest week, so you can't farm it.

### i74-a04 Ambulance district membership (S, 🟠)
The volunteer ambulance sells a $60-a-year membership. Members pay nothing for the ride on a hospital trip; others get a $1,200 ride bill on top of the stay.
Touches: New line on the insurance sheet in features.js; the hospital stay in turn.js adds the ride bill when you aren't a member.
Balance: Small yearly cost against a rare big bill. Rough play pays it more often, so careful play wins.

### i74-a05 A seat on the county medical van (M, 🟠)
Without a car, or at 75 and up, Walla Walla appointments can go on the county medical van: $5 and the whole day, but no 42-mile drive.
Touches: Trip 'appt' stops in features.js get a van option that uses the day; new van flag on the trip sheet.
Balance: Same health gain as driving, just cheaper and slower. It opens care, not a new source of points.

### i74-a06 Desk jobs wear too after 40 (S, 🟠)
Jobs with no wear pick up a little after 40: stiff back, tired eyes. One choice to 'stand up and walk at lunch' clears it.
Touches: turn.js health drift adds 0.2 wear for wear:0 jobs after 40 unless S.deskHabit is set by a one-time event.
Balance: Narrows the gap between office and field jobs a little. The fix is one good choice, which rewards paying attention.

### i74-a07 Physical therapy twice a week, or tough it out (M, 🟠)
After a work injury, choose six weeks of therapy in Walla Walla (time and gas) or tough it out. Therapy clears the injury; toughing it out leaves a small lasting drain.
Touches: Follow-up step on 'Hurt on the job' using the chain helpers in features.js; a lingering flag lowers health drift until cleared.
Balance: Costs money now to save health later. Careless picks pay slowly over years.

### i74-a08 Dental coverage on the insurance sheet (S, 🟠)
Dental becomes its own line: about $28 a month. A cracked tooth costs $1,400 without it or $400 with it, and yearly cleanings are free.
Touches: Insurance sheet in features.js; a new 'cracked tooth' event in events.js that's more likely when S.dentist is old.
Balance: Bills are rare and capped. A yearly dentist trip lowers the odds either way, so habits matter more than coverage.

### i74-a09 Get outside changes shape as you age (M, 🟠)
The Get outside focus reads differently by age: hiking the Blues in your 20s, creek walks in your 50s, the riverwalk bench at 75. Some outings, like skiing Bluewood, need a fair health score.
Touches: FOCUS text in state.js and trip stops in features.js check age and health bands; the effects stay the same.
Balance: Same numbers at every age, so balance doesn't move. It's flavor that respects an older body.

### i74-a10 Chair exercise at the senior center (S, 🟡)
At 65 and up, a cheap morning class at the senior center: a little health, a little community, and people who ask how you are.
Touches: New place action in outabout.js, shown for age 65+.
Balance: Uses the same tapering as other Out-and-about gains, so it can't stack past Rest.

### i74-a11 Grown-up shots at 50 and 65 (S, 🟠)
The pharmacy offers the shingles shot at 50 and pneumonia shots at 65. Getting them makes a later flu week shorter and milder.
Touches: Pharmacy stop on the Walla Walla or Dayton trip in features.js sets S.shots; 'Flu going around' in events.js reads it.
Balance: A small cost with a payoff years later, which careful play notices and careless play misses.

### i74-a12 Who drives Dad to Walla Walla: you or your sister (M, 🟠)
A sibling in Spokane calls about your aging parent's appointments. Split the drives, pay for help, or take them all. Each choice shapes your weeks and the family's feelings.
Touches: An event chain in features.js tied to the aging-parents work; sets a monthly time cost like CARE drift.
Balance: Taking it all costs happiness and health; sharing costs money. No choice is free, so no choice is always right.

### i74-a13 A respite weekend at the adult day program (S, 🟠)
While you're caregiving, the adult day program in Walla Walla can give you a weekend off. It costs some money and gives back health and happiness the caregiving took.
Touches: Offered from the caregiving state (S.care or a parent flag) as a trip stop in features.js.
Balance: Only recovers what caregiving drained, never above where you were.

### i74-a14 Paid family leave to care for a parent (M, 🟠)
Washington's paid leave covers caring for a sick parent too: up to 12 weeks at most of your pay instead of quitting or burning out.
Touches: Choice inside the parent-care events; a leave flag in turn.js pays 90% of pay up to a cap and pauses job wear.
Balance: Pays less than working and only during a real care need, so it can't be used to coast.

### i74-a15 A memory check for Dad, gently (S, 🟡)
Your parent repeats the same story at Sunday dinner. You can suggest a memory visit in Walla Walla, talk with your siblings first, or let it be for now. Each path is calm and kind.
Touches: One event in features.js for parents in their late 70s; it opens the power-of-attorney step sooner when you plan ahead.
Balance: Pure story with small happiness effects; planning ahead saves money later.

### i74-a16 The trucker's DOT medical card (S, 🟠)
Truck drivers renew a medical card every two years. Good health gets two years; low health gets a one-year card; very low health means a few weeks off the road to recover.
Touches: A timed check in turn.js for jobId 'trucker'; text in events.js.
Balance: Adds a cost to running a high-pay, high-wear job into the ground.

### i74-a17 A debrief after a hard shift (S, 🟠)
Nurses, nursing assistants and corrections officers sometimes have a hard shift. You can talk it through with the crew, call a friend, or keep it in. Talking helps happiness more over time.
Touches: Job-gated event in events.js for rn, cna and co; a small lasting stress cut for the talking choice.
Balance: Gentle and not graphic. The help is small and capped, so stress still matters in those jobs.

### i74-a18 Between jobs: COBRA or the state exchange (M, 🟠)
Leaving a job with benefits asks how you'll cover the gap: pricey COBRA, a cheaper exchange plan, or go without and hope.
Touches: Hook on job change in ui.js and turn.js; a short coverage flag that changes medBill in events.js until the next job.
Balance: Going without saves money only until a bill hits, so quitting carelessly costs more.

### i74-a19 Night glare on Highway 12 after 60 (S, 🟡)
After 60, driving home after dark gets harder. Evening classes, late shifts and night events ask you to drive, carpool or skip.
Touches: An event in events.js gated on age and commute; a commute setting remembers your choice.
Balance: Small happiness and time costs, and a carpool fixes it, so it rewards planning.

### i74-a20 The visiting specialist at the Dayton clinic (S, 🟡)
Once a month a specialist from Walla Walla sees patients in Dayton. Wait up to three weeks for that day, or drive to Walla Walla this week.
Touches: Clinic place in outabout.js gets a 'next specialist day' date; the Kennewick specialist idea can use the same slot.
Balance: Waiting is cheaper but slower; both give the same health in the end.

### i74-a21 Weeks to get in: booked appointments (M, 🟠)
Doctor and dentist trips get a booked date two to six weeks out, like real rural care. Urgent needs still go to the emergency room, for more money.
Touches: Trip 'appt' stops in features.js become a booking that comes due on a later week, shown on the week strip.
Balance: Rewards booking ahead before health is low. No change to what a visit gives.

### i74-a22 Hard years in the body show after 55 (M, 🟠)
Years spent in high-wear jobs lower your health target a little after 55; desk and school years don't. The Life tab shows 'years of hard work'.
Touches: Count wear-weighted years in turn.js; the age health target on line 163 subtracts up to 6 points.
Balance: Balances high pay against long-term health, so the best-paying hard job isn't always best.

### i74-a23 Healing takes longer after 60 (S, 🟡)
Injuries and illness flags last longer after 60, and Rest weeks matter more for getting back up.
Touches: Injury and sick flags in events.js double their weeks past 60.
Balance: Makes late-life play a bit more careful; idle Rest gains don't grow.

### i74-a24 Teeth at 70: a bridge, an implant or dentures (S, 🟡)
An old tooth gives out. Pick a bridge, an implant or dentures, each with a different cost and comfort, and no wrong answer.
Touches: Age-gated event in events.js; the dental coverage line changes the costs.
Balance: One-time cost with a small happiness tradeoff. Coverage and checkups soften it.

### i74-a25 Tell the boss, or keep it private (S, 🟠)
After a health event, choose whether to tell your boss. Telling gets lighter overtime asks for a while; keeping it private is respected and nothing bad happens.
Touches: Follow-up choice on health events in events.js; a flag lowers 'Work extra hours' pressure events for 8 weeks.
Balance: Small comfort either way; no choice is punished.

### i74-a26 A blood pressure kiosk at the grocery (S, 🟡)
A free kiosk by the grocery pharmacy counter. Use it while shopping to see a plain health trend and a nudge if it's time for a checkup.
Touches: New action at the grocery place in outabout.js; shows the health trend line from the Life tab.
Balance: Free and gives no health itself, only information, so it can't be farmed.

### i74-a27 Who looks after the caregiver? (S, 🟠)
While you're caring for someone, your own checkups slip. A neighbor offers to sit for an afternoon so you can get to the clinic.
Touches: Event in features.js gated on caregiving and an old checkup date; ties to the clinic in outabout.js.
Balance: Brings checkups back for busy caregivers without making them free.

### i74-a28 Drive a neighbor to their appointment (S, 🟡)
An older neighbor needs a ride to Walla Walla. Give up a morning and the gas for community points and a story or two on the drive.
Touches: Neighbor event in events.js using the gas cost from the commute helpers.
Balance: Costs time and money for community, the same trade as other volunteering.

### i74-a29 A gentle Help page: your body over a life (S, 🟠)
A plain Help page on how health works: job wear and stress, the age ceiling, what helps (rest, outdoors, checkups) and what slowly hurts.
Touches: New page in help.js using the numbers from state.js and turn.js.
Balance: Helps careful players make good choices; no change to scoring.

## Ideas 74: Accessibility audit

A read-through of index.html, js/ui.js and the other screens for screen readers, keyboards, contrast, motion and plain reading, with the file and selector for each fix.

### i74-b01 [Sheets] The Tab key can reach the backup code boxes (S, 🔴)
The Tab trap in ui.js uses focusables(), which lists buttons, [tabindex="0"], input and links, but not textarea.
In restoreSheet() the trap wraps from Cancel to "Choose a file" and from "Choose a file" back to Cancel, so #rscode is never reached. A keyboard player can only restore from a file.
Fix: add textarea, select and [contenteditable] to the selector; restoreSheet() puts first focus on #rscode instead of "Check this backup".
Balance: no game numbers change.

### i74-b02 [Sheets] Delete, Quit and Replace open on the safe button (S, 🔴)
sheet() in ui.js picks `[data-i], button.primary, button` for first focus.
askDelete() focuses Delete, the Quit job sheet focuses Quit, and the askReplace() confirm focuses "Replace it" even though Back comes first.
Fix: give Keep it, Never mind, Back and Cancel a data-safe attribute, and have sheet() try [data-safe] before button.primary. confirmRetire() already gets this right.
Balance: none. It only stops a slip from ending something.

### i74-b03 [Sheets] Confirm sheets are alert dialogs that read their warning (S, 🟠)
Today #sheet is always role="dialog" with a name copied from the h2, so the body ("This can't be undone") is never read when it opens.
In sheet(), when the sheet has a [data-safe] button, set role="alertdialog", give the h2 an id for aria-labelledby, and point aria-describedby at the first <p>.
Touches ui.js sheet(), askDelete(), askReplace(), the Quit job sheet and confirmRetire().
Balance: none.

### i74-b04 [All] Text size starts from the phone's own text setting (S, 🔴)
html{font-size:16px} and the ts-l (18px) and ts-xl (20px) classes are fixed pixels, so a browser set to a bigger default font is ignored.
Change them to 100%, 112.5% and 125%. Everything else is already in rem, so it all follows.
Check the fixed px sizes in the header and End Week bar still fit at a 20px base (they are tracked in another idea).
Balance: none.

### i74-b05 [Home] The Net worth button says the amount out loud (S, 🔴)
In renderHome() (ui.js) the three stat buttons read "Happiness 62: what moves it", but Net worth drops its number because the aria-label replaces the visible text.
Put fmt(netWorth()) into the label, so it reads like the other three.
Balance: none.

### i74-b06 [Tabs] Switching tabs keeps focus on the tab you picked (S, 🟠)
The nav click handler in render() (ui.js) sets tab, re-renders and scrolls up; focus is lost, so a keyboard player tabs through the header again.
After render, focus `#app > nav [data-tab="<tab>"]` with preventScroll. Add aria-label="Tabs" to the nav.
The Menu button's icon span has no aria-hidden (the four tabs do), so it is read as "gear Menu".
Balance: none.

### i74-b07 [Header] Header tags and cash say what they mean (S, 🟠)
In render() (ui.js) the tags are emoji-only spans. Screen readers say "chequered flag", and sighted new players don't know them either.
Add a title and an sr-only word to each tag, and an sr-only "Cash" before .money.
Balance: none.

### i74-b08 [Header] The life progress bar is read as "week 12 of 26" (S, 🟡)
Add role="progressbar", aria-label="How far along this life is", aria-valuenow (rounded pct) and aria-valuetext to .progress in render() (ui.js).
The school bar got the same fix in an earlier round; this is the header one.
Balance: none.

### i74-b09 [Home] The week summary says when a stat turns low (S, 🟠)
The red warning cards appear silently on Home. A screen reader user only hears "health down 3".
In playWeeks() (turn.js), add the low-stat and debt crossings to the announce() text, reusing the same 30 line as the Home cards.
Call announce() before showEvent() or showReview(), so the event's focus move doesn't cut it off.
Balance: the same warnings sighted players already see. No numbers change.

### i74-b10 [All] Spoken names keep the words you can see (S, 🟠)
WCAG "label in name": the accessible name must contain the visible text.
ui.js render(): #auto becomes "Auto: play until something happens". jobRow(): the locked button becomes "Cert needed: how to unlock" (Assoc., Degree the same way).
Sweep the other aria-labels in ui.js, features.js and outabout.js for the same problem.
Balance: none.

### i74-b11 [Jobs] The ▲▼ pay difference is read in words (S, 🟠)
jobRow() in ui.js shows the difference with .upt or .downt and a triangle.
Wrap the triangle in aria-hidden and add an sr-only "a week more than your job" or "a week less than your job".
Balance: none.

### i74-b12 [Money] Red and green follow the sign; zero is gray (S, 🟠)
.job .pay is always var(--up) (index.html), so "-$20/wk" on a far, low-pay job looks like good news.
runChips() (turn.js) marks dm >= 0 as up, so "+$0" is green. Use the flat class for |dm| < 1.
showRunDetails() colors the "What happened" rows green for $0 too.
Balance: none. Clearer bad news may steer careless players away from losing jobs, which is fine.

### i74-b13 [Money] Short forms are read in full: a week, a month, miles (M, 🟠)
wk() in state.js returns "$X/wk" and is used in HTML and in aria-labels. Add wkH() for HTML that wraps "/wk" in aria-hidden plus sr-only " a week"; aria-labels use "a week" directly.
Do the same for "/mo" (insurance, ui.js and features.js), "mi" (jobRow, trip picker) and "wks" in the week strip.
dateLabel() cuts months to 3 letters: put the full month in an aria-label or a <time datetime>.
Balance: none.

### i74-b14 [End] The big score and its math read as plain sentences (S, 🟠)
finish() in features.js: give .score role="img" with aria-label "Life Score N out of 100, <title>".
part(): put an sr-only sentence beside the math, and mark the visual math aria-hidden. "(30 → 0, 90 → 100)" becomes "30 or less scores 0, 90 or more scores 100" for readers.
Balance: none.

### i74-b15 [Night] Low stat bars stay visible in the dark theme (S, 🔴)
statColor() (ui.js) uses --sage, --wheat-d and --barn. On the night track (#3a2e24) red measures 1.77:1 and green 2.39:1. On the day track, the middle wheat bar is 2.07:1 and the school bar's --sky is 1.82:1.
Add --bar-low, --bar-mid, --bar-ok and --bar-school per theme in index.html (for example a lighter red #e0705c and green #7fb86f at night) and use them in statColor().
Add a non-text contrast check for .bar i to screens.test.mjs, with a seeded low-stat life so the red bar is on screen.
Balance: none.

### i74-b16 [All] Grayed-out buttons are still readable (S, 🟠)
index.html: .sm[disabled], .btn[disabled] (opacity .45) and .fbtn[disabled] (opacity .4).
Use color:var(--muted) on var(--track) with a 1.5px dashed var(--dash) border, like .sm.locked does. That stays above 4.5:1 in both themes.
WCAG lets disabled controls skip contrast, but players still need to read what they can't do yet.
Balance: none.

### i74-b17 [Windows] Bars and picked buttons show in Windows contrast themes (M, 🟠)
The game ships as a Windows app, where contrast themes are common for low vision.
Add @media (forced-colors: active) in index.html: .bar i{background:Highlight;forced-color-adjust:none}, and .on / [aria-pressed=true] get a 3px CanvasText outline and a ✓ before the label.
Check the header progress bar, map pins (SVG fills) and the coach ring the same way.
Balance: none.

### i74-b18 [Maps] Pins say if they're your focus, open, or had news (S, 🟠)
townSVG() and regionSVG() in maps.js set aria-label to the name only. The ⭐, red ring, dashed circle and gold event badge are visual only.
Build the label from p.focus, S.focus, MAPSEL and the recent evPins entry; add aria-expanded="${sel}" on the selected pin.
Balance: none.

### i74-b19 [Maps] The List/Map and Waitsburg/region switches say which is on (S, 🟡)
mapToggle() in maps.js: add aria-pressed to both buttons (the other .maptog groups already have it).
mapBlock(): drop role="tablist"/"tab" and aria-selected, and use aria-pressed. A half-built tab pattern tells readers to use arrow keys that do nothing.
Balance: none.

### i74-b20 [Help] Contents buttons move focus to the section, not just the page (S, 🟠)
help.js: the .toc buttons call scrollIntoView({behavior:'smooth'}), and .totop calls scrollTo smooth; neither moves focus.
Give each section h2 tabindex="-1" and focus it after the scroll. "Back to contents" focuses the contents button for that section.
Use behavior:'auto' when prefers-reduced-motion is set.
Balance: none.

### i74-b21 [Journal] The Journal is a list with real dates (S, 🟡)
renderLog() and the wide-screen "Lately" card in renderHome() (ui.js) print .logitem divs.
Use <ol class="loglist"> with <li class="logitem">; drop the list style in CSS so it looks the same. Swap <em> for <time> with the full date in datetime.
Balance: none.

### i74-b22 [Title] Badge emoji on the title screen say their names (S, 🟠)
renderTitle() in ui.js joins b.ic for each badge. Wrap each in <span role="img" aria-label="${b.name}" title="${b.name}">.
Do the same for the ✅ in the records sheet's challenge list and in the goals picker ("completed").
Balance: none.

### i74-b23 [Reading] Long text is left-aligned, and map labels are upright (S, 🟡)
Centered and italic text is harder to track for dyslexic and low-vision readers.
apply() in ui.js and finish() in features.js use inline text-align:center on <p>; keep centering for the emoji and one-line titles only.
index.html: .mapsvg .mlbl and .mwlbl text drop font-style:italic. This is a default fix, separate from the planned easy-reading font option.
Balance: none.

### i74-b24 [Plain words] A Plain words setting for money terms (M, 🟡)
state.js gets a PLAIN map and a term(k) helper. The Life tab, the net worth sheet, insurance, investing and the Jobs header use term() for their labels.
It pairs with the planned tap-a-word definitions: this one changes the label itself, for players who don't want to tap.
SETTINGS gains words:{def:'std'}, and the Settings sheet lists it under Text size.
Balance: only labels change; the money math is the same.

### i74-b25 [Docs] Idea marks have a word, not just a color (S, 🟡)
The round .md headings and TODO.md lines print only the emoji.
The merge step that writes TODO.md and docs/ideas adds the word after the mark. The JSON sev field stays as it is, so the board still parses.
Balance: none (docs only).

### i74-b26 [Tests] Three new checks in the screens test (S, 🟠)
Label in name: for every button with aria-label, the visible text (minus emoji) must appear in the label.
Trap reach: open Restore and Back up, then check every input, textarea and button can be reached with Tab inside the sheet.
Bars: .bar i and .progress i against their track, in both themes, with a seeded life where one stat is under 30.
Balance: none.

### i74-b27 [Event] Escape on an event says why it stays open (S, 🟡)
The keydown handler in ui.js returns early when an event sheet has no closer.
When the sheet has [data-i] buttons, call announce('Pick a choice to go on') and focus the first choice.
Balance: none. Events still need a choice.

### i74-b28 [Home] Focus tiles say the full focus name and its cost (S, 🟡)
renderHome() in ui.js prints FOCUS_SHORT only. Give each .fbtn aria-describedby pointing at a hidden line with FOCUS[k].name, the weekly cost and the reason it is disabled.
Name the grid with role="group" aria-labelledby on the "This week's focus" heading.
Balance: none.

### i74-b29 [Reading] The game holds up when readers widen text spacing (S, 🟡)
Add a screens.test.mjs pass that injects line-height:1.5, letter-spacing:.12em, word-spacing:.16em and p margins of 2em, then reuses the overflow and overlap checks.
Likely fixes in index.html: .endbar #end line-height 1.15, .fbtn small 1.25, and fixed bottom offsets for #strip.
Balance: none.
