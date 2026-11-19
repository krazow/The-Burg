// The Burg: help.js (part 7 of 8; scripts load in order and share one global scope)
/* ============================================================
   ❓ HELP: the help center (title screen ❓ Help, in-game ❓ and Menu),
   the game guide, and the guided practice tutorial.
   ============================================================ */
let HELP_FROM = null;                  // 'title' or 'game': where Close goes back to

function fxWords(fx){
  const n = { happy:'happiness', health:'health', community:'community' };
  return Object.entries(fx).map(([k,v]) => `${v > 0 ? '▲' : '▼'} ${n[k]}`).join(', ');
}
function guideHTML(){
  const W2 = 12/52;
  const pw = v => '$' + Math.round(v * W2).toLocaleString() + '/wk';
  const lenRows = Object.values(LENGTHS).map(L => `<tr><td>${L.label}</td><td>${L.turns === Infinity ? 'Age 18 until the end (retire from 62)' : L.turns + ' weeks'}</td><td>$${L.target.toLocaleString()}</td></tr>`).join('');
  const focusRows = Object.entries(FOCUS).map(([k,f]) => `<tr><td>${f.ic} <b>${f.name}</b></td><td>${f.desc} ${fxWords(f.fx)}${f.payMult ? ', +20% pay' : ''}${f.hustle ? ', extra cash' : ''}${f.study ? ', counts toward your next diploma' : ''}</td><td>${f.cost ? pw(f.cost) : f.study ? 'tuition' : '—'}</td></tr>`).join('');
  const jobRows = Object.entries(CITIES).map(([ck,c]) => `<tr class="grp"><td colspan="3"><b>${c.name}</b> · ${c.miles ? c.miles + ' mi each way' : 'home, no commute'}</td></tr>` +
    JOBS.filter(x => x.city === ck).map(x => `<tr><td>${x.title}</td><td>${pw(x.pay)}</td><td>${EDU[x.edu].replace(' diploma','')}</td></tr>`).join('')).join('');
  const eduRows = [1,2,3].map(l => `<tr><td>${EDU[l]}</td><td>${STUDY_NEED[l-1]} weeks</td><td>${pw(TUITION[l-1])}</td><td>${SCHOOL[l-1]}</td></tr>`).join('');
  const homeRows = Object.values(HOMES).map(h => `<tr><td>${h.name}</td><td>${h.own ? 'Buy: $' + h.down.toLocaleString() + ' down, then ' : 'Rent '}${pw(h.cost)}</td><td>${h.own ? 'Builds equity' : '—'}</td></tr>`).join('');
  const carRows = Object.values(CARS).map(c => `<tr><td>${c.name}</td><td>${c.mpg} mpg</td><td>${c.price ? '$' + c.price.toLocaleString() : c.down ? '$' + c.down.toLocaleString() + ' down + ' + pw(c.pay) + ' for 5 years' : 'Starter'}</td></tr>`).join('');
  const sec = (id, title, body) => `<section id="g-${id}"><h2>${title}</h2>${body}<button class="totop" onclick="document.querySelector('#helpview').scrollTo({top:0,behavior:'smooth'})">↑ Back to contents</button></section>`;
  const S2 = [
    ['start', '🌾 Getting started', `
      <p>You're 18 and just moved into a rented room above Main Street in <b>Waitsburg, WA</b>, with $1,500, a 1998 pickup and a high school diploma. Make the best life you can before the game ends.</p>
      <p>Choose a game length when you start a new life:</p>
      <table><tr><th>Length</th><th>How long</th><th>Net worth for full points</th></tr>${lenRows}</table>
      <p>Backgrounds and modes are under <b>More options</b>, below Start.</p>
      <p><b>How your life begins:</b> ${Object.values(BACKGROUNDS).map(b => `${b.ic} <b>${b.name}</b> (${b.hint.toLowerCase()}): ${b.desc}`).join(' ')}</p>
      <p><b>Mode:</b> ${Object.values(MODES).map(m => `${m.ic} <b>${m.name}</b>: ${m.desc}`).join(' ')} Best scores are kept separately for each mode.</p>
      <p><b>First moves:</b> find a job on the <b>Jobs</b> tab, pick a weekly focus on <b>Home</b>, and tap <b>End Week</b>. Want to see it done? Play the <b>gameplay tutorial</b> at the top of this page.</p>`],
    ['week', '📅 Your week', `
      <p>Each turn is <b>one week</b>. On <b>Home</b>, pick one <b>focus</b> for the week, then tap <b>End Week</b>. The button shows your focus, and it repeats every week until you change it.</p>
      <table><tr><th>Focus</th><th>What it does</th><th>Cost</th></tr>${focusRows}</table>
      <p><b>Town goals:</b> each season the town has a goal you work toward with your focus: ${SEASON_GOALS.map(g => `${g.ic} <b>${g.name}</b> (${g.need} weeks of ${g.what})`).join(', ')}. Finish it before the season ends for a boost in community and happiness. Your progress shows above the focus buttons.</p>
      <p><b>Mix it up.</b> A focus works at full strength for 4 weeks in a row, then fades (down to 30%). After 8 weeks of the same thing you're <b>in a rut</b>, and happiness drops every week until you switch. Classes are the exception: study as long as you like.</p>
      <p><b>Skipping ahead:</b> <b>⏩ 4</b> and <b>⏩ 13</b> play several weeks with the same focus (or your focus plan). <b>⏭ Auto</b> plays until something needs you (up to 26 weeks). Skips stop when an event needs a choice, at a milestone, or at New Year. An event with only one way to go plays out on its own and shows in the week strip. On small phones, press and hold <b>End Week</b> (or press Shift+Enter) for the ⏩ skips and the options; they're also in the Menu.</p>
      <p><b>Auto until…</b> In the skip options, pick what else stops ⏭ Auto: a stat dropping below 35, cash dropping below $0, or the season changing. Skipping never changes what happens, only how many taps it takes. Pick <b>Watch the weeks go by</b> to see each week roll past (tap <b>Stop</b> any time); if your device asks for less motion, skips always jump straight there.</p>
      <p><b>Focus plan:</b> tap <b>🗓 Plan</b> to set up to 4 focuses that take turns, one a week. Picking a focus by hand pauses the plan for that week only. Plans follow the same rules as picking by hand: a focus that comes up week after week still fades.</p>
      <p><b>What the week did:</b> the strip above End Week shows your money (events included) and ▲▼ for each stat. Tap it to see every paycheck, bill and event.</p>`],
    ['stats', '📊 Stats', `
      <p>Tap any stat on Home to see what moves it.</p>
      <ul><li><b>😊 Happiness (0–100).</b> Up: Rest, Get outside, Show up for town, a partner, a dog, kids, a nicer home, retirement. Down: stressful jobs, long commutes, overtime, classes, side hustles, debt, no job, ruts.</li>
      <li><b>❤️ Health (0–100).</b> Up: Rest, Get outside, a doctor visit. Down: physical jobs, overtime, side hustles, and age. At 0 you land in the hospital (a big bill), or in Lifetime after 50 it can end your life.</li>
      <li><b>🤝 Community (0–100).</b> Up: Show up for town, working in Waitsburg (a little in Dayton), kids, a council seat, helping in events. It fades slowly if you don't show up. Higher standing helps you get hired.</li>
      <li><b>💰 Net worth.</b> Cash + home equity + your vehicle + 401(k), minus what's left on a truck loan. Tap it on Home for the breakdown.</li></ul>
      <p>A red banner appears when happiness or health drops below 30, with a suggested focus to fix it.</p>`],
    ['money', '💵 Money', `
      <p><b>Coming in:</b> your paycheck (taxes take about 15%), side hustles, a partner's part-time paycheck, unemployment benefits for 6 months after a layoff, and Social Security plus 401(k) payouts once you retire.</p>
      <p><b>Going out every week:</b> rent or mortgage, food and utilities, insurance and phone, gas (commute plus errands), truck payments, dog care, date nights, kids, health care from age 50, tuition and focus costs.</p>
      <p><b>Gas matters.</b> A Tri-Cities job pays more, but 60+ miles each way in a 15-mpg pickup costs real money. The job list shows <b>take-home pay after taxes and gas</b>.</p>
      <p><b>Prices rise</b> about 3% a year and pay about 2.5% a year, so you need raises to keep up. A mortgage or truck loan locks its payment in when you sign.</p>
      <p><b>Debt:</b> going below $0 charges about 1.5% interest a month. At -$15,000 you get a warning, and at -$40,000 you have to leave town, which ends the game.</p>`],
    ['jobs', '💼 Jobs', `
      <p>There are ${JOBS.length} jobs in six towns, including work at Waitsburg's own businesses. You always live in Waitsburg, so other towns mean a commute. You can apply for <b>one job per week</b>. Higher community standing, extra schooling and local jobs improve your odds.</p>
      <p><b>Making a long commute work:</b> office jobs (insurance agent, courthouse clerk, professor, loan officer, lab administrator, scientist) have <b>2 remote days</b> a week, so you drive in only 3. With community 30 or more you can <b>join a carpool</b> on the Jobs tab: half the gas, the drive wears on you less, and you stay in the loop. A carpool goes with the job: when you change jobs you drive alone until you join one again. <b>Side hustles</b> follow the seasons (harvest work in summer, plowing snow in winter, yard work, fixing cars) and pay up to 60% more as you get good at them. After 6 months without a side hustle you slowly get rusty and that extra fades.</p>
      <p>The list puts jobs you can apply for first. <b>✅ Can apply</b> hides the rest, and ▲▼ compares each job's take-home with your current one. 🔒 jobs need more schooling: tap one to see exactly what it takes.</p>
      <p><b>Raises:</b> after a year in a job your boss may offer about 6% (up to +50% in total). <b>Layoffs</b> depend on the job: retail and seasonal work is shakiest, public-sector and licensed work is steadiest, and you're safe for your first 9 months.</p>
      <table><tr><th>Job</th><th>Pay (2027)</th><th>Needs</th></tr>${jobRows}</table>`],
    ['school', '🎓 School', `
      <p>Pick <b>📚 Take classes</b> as your focus to study. Each week of classes counts toward your next diploma and charges tuition. A week with a trip out of town counts as 3/4 of a week of classes. Studying never puts you in a rut.</p>
      <table><tr><th>Diploma</th><th>Weeks</th><th>Tuition</th><th>Where</th></tr>${eduRows}</table>`],
    ['home', '🏡 Homes and vehicles', `
      <p>On the <b>Life</b> tab you can move or buy a home in Waitsburg (moving costs $300) and trade up your ride. Owned homes build equity and gain value. Moving out of one sells it (6% fees).</p>
      <p><b>Changed your mind?</b> Until you end the week, an <b>↩ Undo</b> bar at the top of the Life tab takes back your last Life-tab changes (a move, a new ride, a 401(k) rate, a business). Anything that rolled the dice, and anything already played out in a week, can't be undone.</p>
      <table><tr><th>Home</th><th>Cost</th><th></th></tr>${homeRows}</table>
      <table><tr><th>Vehicle</th><th>Mileage</th><th>Price</th></tr>${carRows}</table>
      <p>Better mileage means cheaper commutes, and newer vehicles break down less. Your old ride counts as a trade-in. Prices shown are 2027 prices; they rise over time.</p>`],
    ['savings', '🏦 Savings and retirement', `
      <p>On the <b>Life</b> tab, put <b>0%, 5% or 10%</b> of each paycheck into a <b>401(k)</b> before taxes. At 5% or more your employer adds 3%. It grows about 6% a year and counts toward net worth.</p>
      <p>In <b>Lifetime</b> games you can retire from age 62 (on the Jobs tab). Retirement pays Social Security, and your 401(k) pays out about 4% a year.</p>`],
    ['family', '❤️ Family and household', `
      <p>Life brings people and pets: a <b>partner</b> (date nights, a part-time paycheck, and happier weeks), <b>kids</b> (about $650 a month each until 18, plus $200 of childcare if you commute 20+ miles; they bring the most joy in weeks you Rest or Show up for town, and more community), a <b>dog</b>, even a seat on the <b>town council</b> once your community standing is 60 or higher. These mostly arrive through events, so say yes when it fits your life.</p>`],
    ['events', '🎲 Events', `
      <p>Many weeks something happens: about 100 events tied to the seasons, the road and your work. Tap a choice to decide, and every choice shows what it did. Events with only one choice close in one tap. A few examples:</p>
      <ul><li><b>Spring:</b> Celebration Days races, the Touchet running high, tax refunds.</li>
      <li><b>Summer:</b> wheat harvest, Walla Walla Sweets, the Dayton depot festival, the fair and rodeo.</li>
      <li><b>Fall and winter:</b> deer season, snow on Highway 12, powder days at Bluewood, Friday night games.</li>
      <li><b>Any time:</b> truck trouble, layoffs, raises, a friendly stray, someone special, a windstorm, a tip about a job.</li></ul>
      <p><b>Three kinds of events</b>, each with its own odds, and never more than one a week:</p>
      <ul><li><b>🏡 Town</b> (about 1 week in 7): Waitsburg life and the seasons, for everyone.</li>
      <li><b>🛣️ Road</b> (about 1 week in 12): deer, fog, flat tires, festivals and deals in other towns. Only in weeks you commute 20+ miles each way or take a trip, and it happens in the town you drive to.</li>
      <li><b>💼 Work</b> (about 1 week in 12): reviews, promotions, overtime, coworkers and the holiday party. Only when you have a job; some fit only certain kinds of work.</li></ul>
      <p>A commuter with a job sees about one event every 3 weeks; someone at home with no job, about one every 7. Hard mode brings 25% more of each. Event prices rise with the cost of living.</p>`],
    ['maps', '🗺️ Maps', `
      <p>Home and Jobs both have a <b>📋 List / 🗺️ Map</b> switch, and the game remembers your choice.</p>
      <ul><li><b>🏡 Waitsburg:</b> tap a place to spend your week there. Home is Rest, Main Street is Show up for town, the library is classes, the river is Get outside, the bulletin board is a side hustle, and your workplace or Highway 12 is Work extra hours. Dashed circles are just for looking. The fields around town change color with the seasons.</li>
      <li><b>🛣️ The region:</b> the six towns along US-12 and the rivers. Tap a town for its drive, gas cost and jobs, apply right there, or plan a trip. After each week your 🛻 drives your commute.</li></ul>
      <p><b>📍 Where things happen:</b> every event takes place somewhere (the fairgrounds, the Touchet, Bluewood, your workplace). The event tells you where, and for 4 weeks a gold badge marks the spot on the map. Tap the place to see what happened there.</p>
      <p class="muted">River shapes for the Columbia, Snake and Yakima come from <b>Natural Earth</b> (public domain). The Walla Walla and Touchet rivers and the roads are drawn by hand.</p>`],
    ['trips', '🚗 Trips around the region', `
      <p>Once a week you can take a <b>trip</b> to Dayton, Walla Walla or the Tri-Cities: tap <b>🚗 Plan a trip</b> on Home, or a town on the region map. Pick a town and up to ${TRIP_MAX} stops. The trip happens when you end the week.</p>
      <ul><li><b>Gas:</b> there and back, at your vehicle's mileage. In the town you <b>commute to</b> it's free: you stop on the way home.</li>
      <li><b>Time:</b> any other trip takes part of your week, so your focus works at ${TRIP_TIME*100}% that week.</li>
      <li><b>Groceries:</b> a stock-up run at a big store makes groceries ${STOCK_OFF*100}% cheaper for ${STOCK_WEEKS} weeks.</li>
      <li><b>Car care:</b> an oil change cuts breakdowns for 6 months; after a year without one they're more likely. Winter tires (October–January) make sliding off Highway 12 much less likely. Your vehicle's tabs renew every January (DMV): about 1% of what the vehicle is worth, at least $60.</li>
      <li><b>Appointments:</b> skip the dentist for more than a year and a toothache gets likely. A doctor checkup does more when your health is low.</li>
      <li><b>In debt?</b> While your cash is below $0, a trip can have only 1 stop.</li>
      <li><b>Going out:</b> doing the same thing again within ${REPEAT_WEEKS} weeks is only half as fun. Dinners and movies cost double, and do more, with your partner along.</li></ul>
      <table><tr><th>Town</th><th>Places to go</th></tr>${Object.entries(CITIES).filter(([k]) => k !== 'waitsburg').map(([k,c]) => `<tr><td>${TOWNIC[k]} <b>${c.name}</b><br><small>${c.miles} mi</small></td><td>${townStops(k).map(x => `${x.ic} ${x.name}${x.cost ? ` ($${x.cost})` : ''}${x.season ? ` <small>(${x.season})</small>` : ''}${x.min21 ? ' <small>(21+)</small>' : ''}`).join('<br>')}</td></tr>`).join('')}</table>
      <p class="muted">Prices are in 2027 dollars and rise over the years. Places are described, not named.</p>`],
    ['out', '🛍️ Out and about in Waitsburg', `
      <p>Waitsburg's own businesses are in the game, under friendly stand-in names, at their real street addresses. Tap <b>🛍️ Out and about</b> under your weekly focus on Home for the list, or switch Home to <b>🗺️ Map</b> and tap <b>Main Street</b> for a close-up of the downtown blocks. The Preston Avenue places (the ale house, the sports bar and the smokehouse) have their own pins on the town map. Every pin opens a card: what the place is, when it's open, and what you can do there.</p>
      <ul><li><b>Quick visits:</b> up to ${OUT_MAX} a week, on top of your focus (they don't use up your week). One visit per place a week, and going back within ${OUT_REPEAT} weeks is half as special. Visits can add at most ${OUT_WEEK_CAP} points to any one stat in a week.</li>
      <li><b>Open days and seasons:</b> places keep their real rhythms. Simply Shavings and The Junque Sisters take a winter break in January and February. Dreamy Garden Center is open in the spring. Laughing Lad's outdoor grill runs from May to October. Tonnage Coffee & Strings is a private space: it opens to the public only on community event days like Celebration Days, and for a bluegrass jam every other week.</li>
      <li><b>21 and over:</b> drinks at The Little Kiss Pasta Bar, Grenache & Gather, The Royal Brick and Laughing Lad's taproom only show once you're 21.</li>
      <li><b>Little extras:</b> a haircut or spa day at Rouge helps your job applications for ${LOOK_WEEKS} weeks, an ad in The Touchet Tattler raises side-hustle pay ${AD_BOOST * 100}% for ${AD_WEEKS} weeks, and a woodworking class eases a rut.</li>
      <li><b>Around town (Life tab):</b> Standard Bearer Bank holds your savings and loans, The Burg Clinic is where you see a doctor, Burg Basket Grocery is where your weekly food money goes, and the local trades fix your roof and porch. Just moved? The Junque Sisters and Dreamy Garden Center help make it home.</li>
      <li><b>Events and jobs:</b> the bluegrass jam, Grenache Fest, music nights, the grill opening, the spring garden rush, a summer cookout and more. Local jobs include line cook, barista, grocery clerk, bank teller, reporter, trades apprentice, medical assistant and ag technician.</li></ul>
      <table><tr><th>Place</th><th>Where and when</th></tr>${PLACES.map(p => `<tr><td>${p.ic} <b>${esc(p.name)}</b><br><small>${esc(p.kind)}</small></td><td>${esc(p.addr)}<br><small>${esc(p.hours)}</small></td></tr>`).join('')}</table>
      <p class="muted">Names are stand-ins; addresses are real. Days and seasons match reality loosely and were last checked ${PLACES_CHECKED}: call ahead in real life.</p>`],
    ['goals', '🎯 Goals, stories and challenges', `
      <p><b>Badges:</b> earn them as your life unfolds. They're collected across all your lives (see them on the title screen).</p>
      <table><tr><th>Badge</th><th>How to earn it</th></tr>${BADGES.map(b => `<tr><td>${b.ic} ${b.name}</td><td>${b.desc}</td></tr>`).join('')}</table>
      <p><b>Life goals:</b> on the <b>Life</b> tab, pin up to ${GOAL_MAX} badges as goals for this life. Each one you reach <b>after</b> pinning it adds <b>${GOAL_POINTS} points</b> to your Life Score.</p>
      <p><b>Stories:</b> some events unfold over weeks: fixing up the fixer-upper, a friend's food truck, and the flood that leads to a new levee (it only comes after high water that the town didn't sandbag with your help). What you choose at each step changes what comes next.</p>
      <p><b>🏁 Challenges</b> (on the title screen): set-up stories with a goal. ${Object.values(SCENARIOS).map(c => `${c.ic} <b>${c.name}</b>: ${c.desc}`).join(' ')}</p>`],
    ['grow', '🧰 Skills and your own business', `
      <p><b>Skills</b> grow with practice and show on the Life tab (★ levels 1–3):</p>
      <ul>${Object.values(SKILLS).map(k => `<li>${k.ic} <b>${k.name}:</b> ${k.how}. ${k.perk}.</li>`).join('')}</ul>
      <p><b>Start a business</b> on the Life tab (one at a time; it's worth 60% of what you paid if you sell, less about 5% a year as it ages):</p>
      <ul>${Object.values(BIZ).map(b => `<li>${b.ic} <b>${b.name}</b> ($${b.cost.toLocaleString()}): ${b.desc}</li>`).join('')}</ul>
      <p><b>📅 Weekly challenge</b> (title screen): a 6-month life where everyone gets the same start and luck that week: the events come in the same weeks whatever you choose (what you chose earlier can still change which ones can happen). The week turns over at midnight UTC on Monday, the same moment for everyone. <b>📤 Share score card</b> on the end screen makes a picture of your result.</p>
      <p><b>🌳 Legacy:</b> when a Lifetime game ends and you had kids, you can keep playing as your grandkid (18, with a name like Ann Lee II that you can change), with half your net worth (up to $250,000 in 2027 dollars) and some of your standing in town.</p>`],
    ['saves', '💾 Saving and loading', `
      <p>You can keep up to <b>5 lives</b>. Each one saves itself after every week.</p>
      <ul><li><b>Title screen:</b> your lives are listed with Continue and 🗑 Delete. When all 5 slots are full, a new life asks which one to replace.</li>
      <li><b>Menu → 💾 Save game:</b> Save writes your current life right now. Save here or Replace on another slot makes a copy as a checkpoint you can go back to.</li>
      <li><b>Menu → 📂 Load game:</b> switches to any saved life. The one you're playing is saved first.</li></ul>
      <p>Finishing a life frees its slot. Saves live on this device and in this browser.</p>
      <p><b>Menu → 📤 Back up or restore:</b> download a backup file or copy a backup code, then on another device use <b>📥 Restore from a backup</b> (on the title screen or in the same menu). You can add the backup's lives to empty slots or replace all your lives.</p>`],
    ['score', '🏆 The Life Score', `
      <p><b>Life Score so far:</b> Home shows the score you'd get if the game ended today. Tap it for the breakdown and a tip for your weakest part. A report card goes in your Journal every 13 weeks. In the <b>📜 Journal</b>, the chips at the top show just Money, Events, Milestones (badges, skills, report cards, town goals, stories) or Trips.</p>
      <p>At the end, your life gets a score out of 100 from four parts:</p>
      <table><tr><th>Part</th><th>Measured as</th><th>Weight</th></tr>
      <tr><td>Happiness</td><td>Your average over the game: 30 → 0 points, 90 → 100</td><td>30%</td></tr>
      <tr><td>Health</td><td>Your average: 40 → 0, 95 → 100</td><td>20%</td></tr>
      <tr><td>Community</td><td>Where you end: 10 → 0, 90 → 100</td><td>20%</td></tr>
      <tr><td>Net worth</td><td>Against the target for your game length (in 2027 dollars)</td><td>30%</td></tr></table>
      <p>Titles: 85+ <b>Legend of the Burg</b>, 70+ <b>Pillar of the Community</b>, 55+ <b>Solid Waitsburger</b>, 40+ <b>Getting By on Main Street</b>, below that <b>Tumbleweed</b>. Your best score for each length is kept, and Relaxed and Hard scores are labeled and kept separately from Normal ones: tap <b>🏆 Your records</b> on the title screen to see them by length and mode, with your challenges and this week's weekly challenge.</p>
      <p><b>On track?</b> Life Score so far also shows whether your net worth is on track for how far through the game you are (in Lifetime, counted from 18 to 65).</p>`],
    ['tips', '💡 Tips', `
      <ul><li>Rotate your focus: a little work, a little town, a little rest. Long streaks fade and ruts hurt.</li>
      <li>Classes are a long game. A certificate or degree opens jobs that pay far more.</li>
      <li>Compare <b>take-home</b>, not pay: a long commute in a thirsty pickup eats a raise fast.</li>
      <li>Save 5% in your 401(k) for the free 3% match, especially in long games.</li>
      <li>Show up for town. Community counts for the score, helps you get hired, and unlocks the council.</li>
      <li>Watch the week strip. If a stat keeps going ▼, change your focus before it turns red.</li>
      <li>Before a risky choice, save a copy (Menu → 💾 Save game) so you can come back.</li></ul>`],
    ['install', '📱 Installing and playing offline', `
      <p>The Burg is a web app you can install. On iPhone, open it in Safari, tap Share, then <b>Add to Home Screen</b>. On Android, open it in Chrome and tap <b>Install app</b> (or ⋮ → Add to Home screen). After the first visit it works offline.</p>
      <p>There's also an <b>Android app (APK)</b> and a <b>Windows installer</b> on the game's GitHub releases page: github.com/krazow/The-Burg/releases.</p>
      <p>Version ${APP_VERSION}.</p>`]
  ];
  return `<div class="guide">
    <h2 class="gt">📖 Game guide</h2>
    <nav class="toc" aria-label="Guide contents">${S2.map(([id,t]) => `<button onclick="document.getElementById('g-${id}').scrollIntoView({behavior:'smooth'})">${t}</button>`).join('')}</nav>
    ${S2.map(([id,t,b]) => sec(id, t, b)).join('')}
  </div>`;
}
function showHelp(){
  closeSheet(); $('#toast').classList.add('hidden');
  HELP_FROM = S && !S.over ? 'game' : 'title';
  const v = $('#helpview');
  v.innerHTML = `<div class="helphead"><h1>❓ Help</h1><button class="sm alt" id="helpclose" aria-label="Close help">✕ Close</button></div>
    <div class="helpbody">
      <div class="card tutcard"><h3>🎮 Gameplay tutorial</h3>
        <p>Play a short <b>practice life</b>, about 3 minutes. A pulsing ring shows exactly what to tap, and each step waits for your tap. ${HELP_FROM === 'game' ? 'Your current life is saved first and comes right back afterward.' : 'Nothing is saved.'}</p>
        <button class="btn primary" id="tutstart">Start the tutorial</button></div>
      ${guideHTML()}
    </div>`;
  if (!lastHelpFocus) lastHelpFocus = document.activeElement && document.activeElement.id || null;
  v.classList.remove('hidden'); v.scrollTop = 0; setTimeout(() => $('#helpclose').focus({ preventScroll: true }), 30);
  $('#helpclose').onclick = closeHelp;
  $('#tutstart').onclick = startTutorial;
}
let lastHelpFocus = null;
function closeHelp(){
  const wasOpen = !$('#helpview').classList.contains('hidden');
  $('#helpview').classList.add('hidden');
  const id = lastHelpFocus; lastHelpFocus = null;
  if (wasOpen && !TUT) setTimeout(() => { const el = id && document.getElementById(id); if (el) el.focus({ preventScroll: true }); }, 30);
}

/* ---------- guided practice tutorial ---------- */
let TUT = null;
const TSTEPS = [
  { text:'👋 Welcome to a <b>practice life</b>. Nothing here is saved. Follow the <b>pulsing ring</b> and tap what it points to.' },
  { sel:'[data-apply="farmhand"]', tap:1, text:'This is the <b>Jobs</b> tab. Each job shows take-home pay after taxes and gas. Tap <b>Apply</b> on Wheat farm hand.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'You got the job! Tap <b>Let\'s go</b>.' },
  { sel:'#main .stats', text:'These are your <b>stats</b>: happiness, health and community (0–100), and net worth. Later, tap any stat to see what moves it.' },
  { sel:'[data-f="community"]', tap:1, text:'Each week you pick one <b>focus</b>. Tap <b>Town</b> to show up for your community.' },
  { sel:'#end', tap:1, text:'The End Week button shows your focus. Tap <b>End Week</b> to play the week.' },
  { sel:'#strip', tap:1, text:'This strip shows what the week did: money, and ▲▼ for each stat. Tap it.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'Here\'s every paycheck and bill. Tap <b>Close</b>.' },
  { before:() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')), sel:'#modal:not(.hidden) [data-i="0"]', tap:1, text:'<b>Events</b> pop up as life happens. Tap the first choice.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'Every choice shows what it did. Tap <b>Continue</b>.' },
  { sel:'#ff4', tap:1, text:'<b>⏩</b> plays several weeks with the same focus and stops if something needs you. On small phones it hides behind a long press on End Week. Tap <b>⏩ 4</b>.' },
  { sel:'nav [data-tab="jobs"]', tap:1, text:'Let\'s look for better work. Tap <b>Jobs</b>.' },
  { sel:'[data-locked="para"]', tap:1, text:'🔒 jobs need more schooling. Tap the locked <b>School paraeducator</b> job.' },
  { sel:'#modal:not(.hidden) #yes', tap:1, text:'It shows what the job takes. Tap <b>Make Take classes my focus</b>.' },
  { sel:'nav [data-tab="life"]', tap:1, text:'Tap <b>Life</b> for homes, rides, savings and family.' },
  { sel:'[data-k401="1"]', tap:1, text:'Save for retirement: tap <b>5%</b>. Your employer adds 3% on top.' },
  { sel:'nav [data-tab="home"]', tap:1, text:'Back to <b>Home</b>.' },
  { sel:'#main .maptog button:nth-child(2)', tap:1, text:'Rather use a map? Tap <b>🗺️ Map</b>.' },
  { sel:'.mpin[aria-label="Touchet River"]', tap:1, text:'Tap a place to spend your week there. Tap the <b>River</b>.' },
  { sel:'.mapdet .sm', tap:1, text:'Tap <b>Spend this week here</b>.' },
  { sel:'#main .maptog button:nth-child(1)', tap:1, text:'Your focus is now <b>Get outside</b>. Tap <b>📋 List</b> to switch back.' },
  { sel:'nav [data-tab="menu"]', tap:1, text:'Tap <b>Menu</b>.' },
  { sel:'#modal:not(.hidden) #save', text:'<b>💾 Save game</b> and <b>📂 Load game</b> live here. Real lives also save themselves every week, in up to 5 slots.' },
  { sel:'#modal:not(.hidden) #close', tap:1, text:'Tap <b>Close</b>.' },
  { sel:'#helpbtn', text:'Tap <b>?</b> any time for the full game guide, or to replay this tutorial.' },
  { text:'🎉 That\'s the basics! Balance <b>happiness, health, community and money</b>, and mix up your weekly focus. Good luck in the Burg.', done:1 }
];
function startTutorial(){
  closeHelp(); closeSheet();
  if (S && !S.over && !S.practice) save();
  TUT = { i: -1, prev: { S: S && !S.over ? clone(S) : null, tab, prefs: clone(prefs()), jobCity, jobOK } };
  setPref('mapView', false); jobCity = 'all'; jobOK = false;
  newGame('Practice', 'half', 0, { practice: true });
  if (!$('#coach')) document.body.insertAdjacentHTML('beforeend', '<div id="coach" class="hidden"></div>');
  tutNext();
}
function tutNext(){
  if (!TUT) return;
  TUT.i++;
  const st = TSTEPS[TUT.i];
  if (!st) return endTutorial(true);
  if (st.before) st.before();
  TUT.tries = 0;
  setTimeout(drawCoach, 380);                       // let sheets slide in and screens redraw
}
function drawCoach(){
  if (!TUT) return;
  const st = TSTEPS[TUT.i], c = $('#coach');
  $('#toast').classList.add('hidden');
  const el = st.sel ? document.querySelector(st.sel) : null;
  if (st.sel && !el) { if (++TUT.tries < 12) return setTimeout(drawCoach, 150); return tutNext(); }   // skip a step whose target never appeared
  if (el && el.scrollIntoView && !el.closest('.endbar, .weekstrip, nav, .sheet')) el.scrollIntoView({ block: 'center' });
  const r = el ? el.getBoundingClientRect() : null, pad = 6;
  const box = r ? { x: r.left - pad, y: r.top - pad, w: r.width + pad*2, h: r.height + pad*2 } : null;
  const vw = innerWidth, vh = innerHeight;
  const dim = box ? [
      [0, 0, vw, Math.max(0, box.y)], [0, box.y + box.h, vw, Math.max(0, vh - box.y - box.h)],
      [0, box.y, Math.max(0, box.x), box.h], [box.x + box.w, box.y, Math.max(0, vw - box.x - box.w), box.h]]
    : [[0, 0, vw, vh]];
  const below = box && box.y + box.h / 2 < vh / 2;
  const bubbleY = !box ? 'top:50%;transform:translate(-50%,-50%)' : below ? `top:${Math.min(vh - 200, box.y + box.h + 14)}px` : `bottom:${Math.min(vh - 120, vh - box.y + 14)}px`;
  c.innerHTML = dim.map(([x,y,w,h]) => `<div class="cdim" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`).join('') +
    (box ? `<div class="cring${st.tap ? ' tap' : ''}" style="left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px"></div>${st.tap ? `<div class="cfinger" style="left:${box.x + box.w/2}px;top:${box.y + box.h/2}px">👆</div>` : ''}` : '') +
    `<div class="cbubble" role="dialog" aria-live="polite" style="${bubbleY}">
      <div class="cstep">Step ${TUT.i + 1} of ${TSTEPS.length}</div>
      <div class="ctext">${st.text}</div>
      <div class="cbtns">${st.tap ? '<span class="chint">👆 Tap the highlighted spot</span>' : `<button class="sm" id="cnext">${st.done ? 'Finish' : 'Next'}</button>`}
        ${st.done ? '' : '<button class="sm alt" id="cskip">Skip tutorial</button>'}</div></div>`;
  c.classList.remove('hidden');
  announce(`Tutorial step ${TUT.i + 1} of ${TSTEPS.length}. ${c.querySelector('.ctext').textContent}`);
  { const f = st.tap && el && el.focus ? el : $('#cnext'); if (f) f.focus({ preventScroll: true }); }   // keyboard users can press Enter
  if ($('#cnext')) $('#cnext').onclick = e => { e.stopPropagation(); hideCoach(); tutNext(); };
  if ($('#cskip')) $('#cskip').onclick = e => { e.stopPropagation(); endTutorial(false); };
}
function hideCoach(){ const c = $('#coach'); if (c) { c.classList.add('hidden'); c.innerHTML = ''; } }
// a tap on the highlighted spot moves the tutorial on (the app handles the tap as usual)
document.addEventListener('click', e => {
  if (!TUT) return;
  const st = TSTEPS[TUT.i];
  if (st && st.tap && st.sel && e.target.closest && e.target.closest(st.sel)) { hideCoach(); setTimeout(tutNext, 60); }
}, true);
addEventListener('resize', () => { if (TUT && !$('#coach').classList.contains('hidden')) drawCoach(); });
function endTutorial(done){
  const prev = TUT && TUT.prev; TUT = null; hideCoach(); closeSheet();
  if (!prev) return;
  store.set(PREF_KEY, prev.prefs); jobCity = prev.jobCity; jobOK = prev.jobOK;
  S = prev.S; tab = prev.tab || 'home';
  if (S) { render(); window.scrollTo(0,0); } else renderTitle();
  toast(done ? '🎉 Tutorial finished' : 'Tutorial closed');
}
