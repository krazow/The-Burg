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
/* ---------- i2-a20: tap a word to see what it means ---------- */
const GLOSSARY = {
  networth: { w:'Net worth', d:() => 'Everything you own minus what you owe: cash (below $0 it counts against you), your home equity, your vehicle, your 401(k), index funds at today\'s value, wine futures at what you paid until they pay out, and what your business would sell for. Then it takes off what\'s left on a truck loan, student loans and a home equity loan. It counts for 30% of your Life Score.' },
  equity: { w:'Home equity', d:() => `The part of your home that is yours: the down payment, plus each mortgage payment's share, plus whatever the housing market adds or takes away (about ${HOME_GROW * 100}% a year in a normal market). A home equity loan borrows against it and counts against your net worth until it's paid. Selling costs ${SELL_FEE * 100}% in agent fees.` },
  takehome: { w:'Take-home', d:() => 'Pay after about 15% taxes and the gas to drive to work and back (half with a carpool, less on remote days, and a bus pass instead of gas if you ride the county bus). Union dues and any 401(k) savings come out of it too.' },
  k401: { w:'401(k)', d:() => `A retirement account. Put ${K401.slice(1).map(r => r * 100 + '%').join(' or ')} of each paycheck in before taxes; at 5% or more your employer adds 3%. It grows about 6% a year and counts in your net worth.` },
  rut: { w:'rut', d:() => `After ${RUT_WEEKS} weeks of the same focus you're in a rut: happiness drops every week until you switch. Classes never cause a rut.` },
  fade: { w:'works at', d:() => 'A focus works fully for 4 weeks in a row, then does a little less each week (down to 30%). Switch for a week to reset it.' },
  lifescore: { w:'Life Score', d:() => `Your score out of 100: average happiness 30%, average health 20%, community at the end 20%, and net worth against your game length's target 30%. Pinned life goals you reach add points; a bankruptcy takes ${BK_PENALTY} off.` },
  dollars: { w:'2027 dollars', d:() => `Prices rise about ${COL_RATE * 100}% a year. Targets are written in 2027 prices, so a dollar later in the game counts for a little less.` },
  focus: { w:'focus', d:() => 'What you spend your week on. It repeats every week until you change it.' }
};
let TERM_N = 0;
// a word you can tap (or focus and press Enter) to see what it means; screen readers hear the meaning on focus
function term(key, label){
  const g = GLOSSARY[key]; if (!g) return label || key;
  const id = `gl${++TERM_N}`;
  return `<button type="button" class="term" data-term="${key}" aria-expanded="false" aria-describedby="${id}">${label || g.w}</button><span class="sr-only" id="${id}">${g.d()}</span>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-term]'); if (!b) return;
  e.stopPropagation();
  const open = b.getAttribute('aria-expanded') !== 'true', next = b.nextElementSibling && b.nextElementSibling.nextElementSibling;
  if (next && next.classList.contains('termdef')) next.remove();
  if (open) b.nextElementSibling.insertAdjacentHTML('afterend', `<span class="termdef" role="note"><b>${GLOSSARY[b.dataset.term].w}:</b> ${GLOSSARY[b.dataset.term].d()}</span>`);
  b.setAttribute('aria-expanded', open);
});
/* ---------- i2-a17: first-time explainers, shown where a system opens up, once per device ---------- */
const FIRST = {
  trips: { ic:'🚗', t:'Trips', d:() => `Pick a town and up to ${TRIP_MAX} stops; the trip happens when you end the week. The town you commute to costs no extra gas. Other trips take part of your week, so your focus works at ${TRIP_TIME * 100}%. A stock-up run makes groceries ${STOCK_OFF * 100}% cheaper for ${STOCK_WEEKS} weeks.` },
  goals: { ic:'🎯', t:'Life goals', d:() => `Pin up to ${GOAL_MAX} badges as goals. Each one you reach after pinning it adds ${GOAL_POINTS} points to your Life Score.` },
  skills: { ic:'🧰', t:'Skills', d:() => `Skills grow as you practice: ${SKILL_STEPS.join(', ')} practice points for levels 1, 2 and 3. Each level saves money or opens a choice.` },
  biz: { ic:'🏪', t:'Your own business', d:() => `One at a time: ${Object.values(BIZ).map(b => `${b.ic} ${b.name.toLowerCase()} (${fmtc(b.cost)})`).join(', ')}. Selling gets back 60% of the price, less about ${BIZ_DEP * 100}% a year as it ages.` },
  k401: { ic:'🏦', t:'The 401(k)', d:() => `Save ${K401.slice(1).map(r => r * 100 + '%').join(' or ')} of each paycheck before taxes. At 5% or more your employer adds 3%: free money that grows about 6% a year.` },
  school: { ic:'📚', t:'School', d:() => `Pick Take classes as your focus. ${EDU.slice(1).map((e, i) => `${e}: ${STUDY_NEED[i]} weeks`).join(', ')}. Classes never put you in a rut.` },
  carpool: { ic:'🚙', t:'Carpools', d:() => 'With community 30 or more you can ride with neighbors on a 20+ mile commute: half the gas, an easier drive, and a little community. The carpool goes with the job.' }
};
let FIRST_SLOT = null;          // one explainer per screen: render() opens the slot, the first unseen explainer takes it
function firstTime(key){
  const x = FIRST[key];
  if (!x || !S || S.practice || TUT || (prefs().first || {})[key] || FIRST_SLOT === 'used') return '';
  if (FIRST_SLOT === 'open') FIRST_SLOT = 'used';
  return `<div class="card tip first" data-firstcard="${key}"><div><b>${x.ic} New: ${x.t}.</b> ${x.d()}</div><button class="sm alt" data-first="${key}" aria-label="Got it: ${x.t}">Got it</button></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-first]'); if (!b) return;
  setPref('first', { ...(prefs().first || {}), [b.dataset.first]: 1 });
  const c = b.closest('[data-firstcard]'); if (c) c.remove();
  announce('Got it');
});

function guideHTML(){
  const W2 = 12/52;
  const pw = v => '$' + Math.round(v * W2).toLocaleString() + '/wk';
  const lenRows = Object.values(LENGTHS).map(L => `<tr><td>${L.label}</td><td>${L.turns === Infinity ? 'Age 18 until the end (retire from 62)' : L.turns + ' weeks'}</td><td>$${L.target.toLocaleString()}</td></tr>`).join('');
  const focusRows = Object.entries(FOCUS).map(([k,f]) => `<tr><td>${f.ic} <b>${f.name}</b></td><td>${f.desc} ${fxWords(f.fx)}${f.payMult ? ', +20% pay' : ''}${f.hustle ? ', extra cash' : ''}${f.study ? ', counts toward your next diploma' : ''}</td><td>${f.cost ? pw(f.cost) : f.study ? 'tuition' : '—'}</td></tr>`).join('');
  const jobRows = Object.entries(CITIES).map(([ck,c]) => `<tr class="grp"><td colspan="3"><b>${c.name}</b> · ${c.miles ? c.miles + ' mi each way' : 'home, no commute'}</td></tr>` +
    JOBS.filter(x => x.city === ck).map(x => `<tr><td>${x.title}${x.season ? ` <small>(${MONTHS[x.season[0]].slice(0,3)}–${MONTHS[x.season[x.season.length-1]].slice(0,3)})</small>` : ''}${x.union ? ' 🪪' : ''}</td><td>${pw(x.pay)}${x.apprentice ? ' <small>(60% as an apprentice)</small>' : ''}</td><td>${EDU[x.edu].replace(' diploma','')}${x.needCert ? ` + ${CERTS[x.needCert].name.replace(/ \(.*/, '')}` : ''}${x.needMajor ? ` in ${PROGRAMS[x.needMajor].name.toLowerCase()}` : ''}</td></tr>`).join('')).join('');
  const certRows = Object.values(CERTS).map(c => `<tr><td>${c.ic} ${c.name}</td><td>${c.weeks} weeks</td><td>$${c.fee.toLocaleString()}</td><td>${c.what}</td></tr>`).join('');
  const progRows = Object.values(PROGRAMS).map(x => `<tr><td>${x.ic} ${x.name}</td><td>${x.jobs.map(id => JOBS.find(j => j.id === id)).filter(Boolean).map(j => j.title.toLowerCase()).join(', ')}</td></tr>`).join('');
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
      <p><b>Auto until…</b> In the skip options, pick what else stops ⏭ Auto: a stat dropping below 35, cash dropping below $0, or the season changing. Skipping never changes what happens, only how many taps it takes. Pick <b>Watch the weeks go by</b> to see each week roll past (tap <b>Stop</b> any time); if your device asks for less motion (or Animations is off in Settings), skips always jump straight there.</p>
      <p><b>Focus plan:</b> tap <b>🗓 Plan</b> to set up to 4 focuses that take turns, one a week. Picking a focus by hand pauses the plan for that week only. Plans follow the same rules as picking by hand: a focus that comes up week after week still fades.</p>
      <p><b>What the week did:</b> the strip above End Week shows your money (events included) and ▲▼ for each stat. Tap it to see every paycheck, bill and event. Tap a line there to see <b>why</b> it cost what it did, and read why your stats moved.</p>
      <p><b>Before you pick:</b> under the focus buttons, <b>Next week</b> estimates what the focus will add (stats and cash, before events). A button shows a percentage when that focus is fading from repeating it.</p>`],
    ['stats', '📊 Stats', `
      <p>Tap any stat on Home to see what moves it.</p>
      <ul><li><b>😊 Happiness (0–100).</b> Up: Rest, Get outside, Show up for town, a partner, a dog, kids, a nicer home, retirement. Down: stressful jobs, long commutes, overtime, classes, side hustles, debt, no job, ruts.</li>
      <li><b>❤️ Health (0–100).</b> Up: Rest, Get outside, a doctor visit. Down: physical jobs, overtime, side hustles, and age. At 0 you land in the hospital (a big bill), or in Lifetime after 50 it can end your life.</li>
      <li><b>🤝 Community (0–100).</b> Up: Show up for town, working in Waitsburg (a little in Dayton), kids, a council seat, helping in events. It fades slowly if you don't show up. Higher standing helps you get hired.</li>
      <li><b>💰 Net worth.</b> Cash + home equity + your vehicle + 401(k) + a business + index funds (at today's value) + wine futures (at what you paid), minus what's left on truck, student and home equity loans. Tap it on Home for the breakdown.</li></ul>
      <p>A red banner appears when happiness or health drops below 30, with a suggested focus to fix it.</p>`],
    ['money', '💵 Money', `
      <p><b>Coming in:</b> your paycheck (taxes take about 15%), side hustles, a partner's part-time paycheck, unemployment benefits for 6 months after a layoff, and Social Security, a public pension and 401(k) payouts once you retire.</p>
      <p><b>Going out every week:</b> rent or mortgage, food and utilities, insurance and phone (you choose the coverage), gas (commute plus errands), truck payments, dog care, date nights, kids, health care from age 50, late-life care, tuition and focus costs. The <b>📅 money outlook</b> on the Life tab projects the next 13 weeks.</p>
      <p><b>Gas matters.</b> A Tri-Cities job pays more, but 60+ miles each way in a 15-mpg pickup costs real money. The job list shows <b>take-home pay after taxes and gas</b>.</p>
      <p><b>Prices rise</b> about 3% a year and pay about 2.5% a year, so you need raises to keep up. A mortgage or truck loan locks its payment in when you sign.</p>
      <p><b>🛡️ Insurance</b> (Life tab, about $160 a month with the phone): full coverage or liability only on your vehicle, renters insurance (renters) or a $500, $1,000 or $2,500 deductible (owners). Cheaper coverage saves a little every month, but crashes, deer, ditches, theft, break-ins, fires and storms then cost you more: full coverage pays vehicle losses after a $500 deductible, renters insurance pays for your things after $250, and a homeowners policy pays after your deductible. Owners can also take a cheaper <b>wind and hail</b> plan (about 0.15% of the home's value a year less): a windstorm claim then costs you up to ${WIND_PCT * 100}% of what the house is worth instead of the regular deductible, and the sheet shows that in dollars.</p>
      <p><b>🌦️ Weather</b> (the Life tab's <b>Ready for weather</b> card): in a wildfire-smoke summer, outdoor crews work shorter days in July and August (10% less pay, half the wear on your body) unless you choose to push through, which risks a sick week. A <b>box-fan air filter</b> (${fmtc(FAN_DIY)} to build with the Handy skill, or ${fmtc(FAN_BUY)} for a purifier) keeps smoke out of your health at home for that year. After a windstorm, roofers are booked for weeks: wait with a tarp (a little happiness each week, and rain can get under it), pay about 30% more to jump the line, or fix it yourself with the Handy skill. After the flood, owners of the fixer-upper can raise the furnace and water heater to cut later flood cleanup by 80%. In winter, Home has a toggle to <b>clear the neighbor's walk</b> every snow (a little health, a little community). With community ${CAPTAIN_MIN} or more you can be your street's <b>block captain</b>: each windstorm or outage you run the plan for an evening and gain community.</p>
      <p><b>Debt:</b> going below $0 charges about 1.5% interest a month. After ${COLLECT_WEEKS} weeks below $0 it goes to <b>collections</b>: a $${COLLECT_FEE} fee, calls that cost happiness every week, and worse odds on job applications and loans until you're back above $0. At -$15,000 you get a warning, and at -$40,000 (-$25,000 on Hard) you have to leave town, which ends the game, unless you <b>file for bankruptcy</b> (once a life): the debt is wiped, but you lose index funds, wine futures, any business and any vehicle better than a 1998 pickup. Your home and 401(k) are protected. For 7 years banks won't lend to you (mortgages cost 3 points more) and better-paying jobs are harder to land, and it takes ${BK_PENALTY} points off your Life Score.</p>`],
    ['jobs', '💼 Jobs', `
      <p>There are ${JOBS.length} jobs in six towns, including work at Waitsburg's own businesses. You always live in Waitsburg, so other towns mean a commute. You can apply for <b>one job per week</b>. Higher community standing, extra schooling and local jobs improve your odds.</p>
      <p><b>Making a long commute work:</b> office jobs (insurance agent, courthouse clerk, professor, loan officer, lab administrator, scientist) have <b>2 remote days</b> a week, so you drive in only 3. With community 30 or more you can <b>join a carpool</b> on the Jobs tab: half the gas, the drive wears on you less, and you stay in the loop. A carpool goes with the job: when you change jobs you drive alone until you join one again. <b>Side hustles</b> follow the seasons (harvest work in summer, plowing snow in winter, yard work, fixing cars) and pay up to 60% more as you get good at them. After 6 months without a side hustle you slowly get rusty and that extra fades.</p>
      <p>The list puts jobs you can apply for first. <b>✅ Can apply</b> hides the rest, and ▲▼ compares each job's take-home with your current one. 🔒 jobs need more schooling, a certificate or a program: tap one to see exactly what it takes. Seasonal jobs only hire in season.</p>
      <p><b>Applying and interviews:</b> each application leads to a short interview. Being straight about yourself helps a little; selling yourself hard works only with People skill; asking about pay suits hard-to-fill jobs. Tap <b>Decide later</b> and they call by the end of the week, at the usual odds. Your People skill, a fresh haircut, the right program and your <b>reference</b> all count.</p>
      <p><b>Offers:</b> for hard-to-fill jobs (nurses, nursing assistants, imaging techs, truckers, linemen, wind and reactor techs, teachers, phlebotomists, the lab) you can take the offer, ask for 5% more (People skill helps) or ask for a $3,000 sign-on bonus that you pay back if you leave inside a year. Asking can lose the offer (1 in 10).</p>
      <p><b>References:</b> after 6 months in a job, two weeks' notice (or a layoff) gets you a good reference that helps your next applications. Walking out or getting fired gives you a bad one for a year.</p>
      <p><b>Promotions and job ladders:</b> every job has two named steps up (farm hand → lead hand → farm manager, cellar hand → cellar master → assistant winemaker). The first needs a year in the job; the top step needs three years plus more schooling than the job asks for, or People skill level 2. Each step pays more (+12%, then +25% over the start) and is more stressful. A new job starts at the bottom of its ladder. The Jobs tab shows your ladder and what the next step needs.</p>
      <p><b>Raises:</b> after a year in a job your boss may offer about 6% (up to +50% in total). <b>Layoffs</b> depend on the job: retail and seasonal work is shakiest, public-sector and licensed work is steadiest, and you're safe for your first 9 months.</p>
      <p><b>Apprenticeships</b> (electrician, plumber, power lineman; trade certificate needed): you start at 60% of a journeyman's pay and step up every year, then earn full pay. Leaving starts it over.</p>
      <p><b>Seasonal work:</b> the Bluewood lift (December–March), harvest trucking (July–August) and the Forest Service crew (June–September) lay you off when the season ends and call you back when it returns, with no application. Pair a winter job with a summer one, or ride unemployment for a few months.</p>
      <p><b>🪪 Union jobs</b> (rail yard, Hanford, nurses, paraeducators, corrections, teachers, electricians, linemen) take 1.5% dues, give a 1.5% step raise each January and half the layoff risk. Every few years there's a contract vote: take the 2% deal, or strike for a few weeks on 40% strike pay for a likely 6% raise.</p>
      <p><b>Federal jobs</b> (Hanford, the lab, the dam, the VA, the Forest Service) can be furloughed for a few weeks in a shutdown: no paychecks, then back pay in one lump, so savings matter. <b>Hanford and the lab</b> need a security clearance: about 12 weeks at 80% pay after you're hired, and debt below -$5,000 can sink the check and the job.</p>
      <p><b>Remote job:</b> with a bachelor's degree you can work fully remote for a Seattle company: city pay and no commute, a one-time $900 fiber install, but no coworkers, so community fades faster, and layoffs are common.</p>
      <p><b>🚌 County bus:</b> with a job in Dayton or Walla Walla you can ride the bus for a $50 monthly pass: 90% less commute gas and half the truck trouble, but longer days cost a little happiness.</p>
      <table><tr><th>Job</th><th>Pay (2027)</th><th>Needs</th></tr>${jobRows}</table>`],
    ['school', '🎓 School', `
      <p>Pick <b>📚 Take classes</b> as your focus to study. Each week of classes counts toward your next diploma and charges tuition. A week with a trip out of town counts as 3/4 of a week of classes. Studying never puts you in a rut.</p>
      <table><tr><th>Diploma</th><th>Weeks</th><th>Tuition</th><th>Where</th></tr>${eduRows}</table>
      <p><b>Programs:</b> on the Life tab, pick a program before you study (same weeks and tuition). The diploma you finish makes it your <b>major</b>: +10% pay and better odds at matching jobs. The wind turbine tech job needs the wind energy program, and the school teacher job needs teaching.</p>
      <table><tr><th>Program</th><th>Matching jobs</th></tr>${progRows}</table>
      <p><b>Short certificates:</b> sign up on the Life tab and pay the fee once; your 📚 Take classes weeks go to the course first (no tuition), then back to your diploma. One course at a time.</p>
      <table><tr><th>Certificate</th><th>Weeks</th><th>Fee</th><th>What it does</th></tr>${certRows}</table>`],
    ['home', '🏡 Homes and vehicles', `
      <p>On the <b>Life</b> tab you can move or buy a home in Waitsburg (moving costs $300) and trade up your ride. Owned homes build equity and gain value. Moving out of one sells it (6% agent fees).</p>
      <p><b>🏡 The housing market</b> changes every January: some years are <b>hot</b> (buyers line up, prices climb, and buying costs 5% more), some <b>slow</b> (houses sit and prices slip, and buying costs 3% less). On average homes gain about 2.5% a year. <b>Mortgage rates</b> change each year too (around 6.5%); your rate locks in when you buy. If rates drop a full point below yours, you can <b>refinance</b> for closing costs of 2% of the home's value: it only pays if you stay a few years.</p>
      <p><b>Owners</b> pay <b>property tax</b> to the county twice a year, in April and October (about 1% of the home's value a year), and can <b>borrow against the house</b> (up to half the equity, at a year's rate + 1 point, over 10 years). Selling pays off what's left.</p>
      <p><b>Changed your mind?</b> Until you end the week, an <b>↩ Undo</b> bar at the top of the Life tab takes back your last Life-tab changes (a move, a new ride, a 401(k) rate, a business). Anything that rolled the dice, and anything already played out in a week, can't be undone.</p>
      <table><tr><th>Home</th><th>Cost</th><th></th></tr>${homeRows}</table>
      <table><tr><th>Vehicle</th><th>Mileage</th><th>Price</th></tr>${carRows}</table>
      <p>Better mileage means cheaper commutes, and newer vehicles break down less. Your old ride counts as a trade-in. Prices shown are 2027 prices; they rise over time.</p>`],
    ['savings', '🏦 Savings and retirement', `
      <p>On the <b>Life</b> tab, put <b>0%, 5% or 10%</b> of each paycheck into a <b>401(k)</b> before taxes. At 5% or more your employer adds 3%. It grows about 6% a year and counts toward net worth.</p>
      <p><b>📈 Index funds</b> at ${BROKER} in Walla Walla (Life tab): about 6% a year on average, but about one year in five the market drops 25% at once. Selling in a drop locks in the loss; holding usually comes back. <b>🍷 Wine futures</b> at ${WINERY}: each fall (September to November) buy into that year's vintage for $2,500; it pays out when the wine is released 3 years later, usually about 25% more, 50% more for a great year, and less if wildfire smoke got into the grapes (smoky summers make it a gamble). It counts at what you paid until then.</p>
      <p>In <b>Lifetime</b> games you can retire from age 62 (on the Jobs tab). Retirement pays Social Security, and your 401(k) pays out about 4% a year.</p>
      <p><b>🇺🇸 Social Security reflects your work.</b> It grows with the years you drew a paycheck (35 is a full career) and your average pay: from 60% of the standard ${fmt(SS_PAY)} a month with no work record up to 140% after 35 years of good pay. Side hustles and businesses don't count.</p>
      <p><b>🏛️ Public pensions.</b> ${JOBS.filter(j => j.pension).map(j => j.title.toLowerCase()).join(', ')} jobs earn a pension: ${PENSION_RATE * 100}% of your best pay there for each year worked, paid every month once you retire. You need ${PENSION_VEST} years in public jobs to <b>vest</b>; leave sooner and you get nothing.</p>
      <p><b>🧭 Planning ahead</b> (Life tab): the <b>📅 money outlook</b> shows your next 13 weeks of pay and bills, the big ones (vehicle tabs, tuition, a lease renewal, a winter away) and the week, if any, your cash would dip below zero. It's also under the week's details.</p>
      <p><b>📜 A will</b> (${fmt(WILL_FEE)}, from age ${WILL_MIN_AGE}, on the Life tab or at Mother Hubbard's Legal Cupboard) matters when your grandkid takes over: with one, their share passes right away along with the family home. Without one, the house is sold and probate takes 10% and 26 weeks.</p>
      <p><b>Late in life</b> (Lifetime): at ${LTC_AGE} you can buy <b>long-term care insurance</b> (${fmt(LTC_PREMIUM)} a month). From ${CARE_AGE}, if health falls below ${CARE_HEALTH}, you choose your care: a paid aide at home (${fmt(CARE.aide.cost)} a month), assisted living in Walla Walla (${fmt(CARE.living.cost)} a month; health holds best, community fades), or family (no bill, but it costs happiness). Paid care needs about 6 months of the bill on hand; without it, or when the savings run out, Medicaid pays for a shared room in Dayton. Insurance pays ${LTC_COVER * 100}% of the bill. Each December retirees can <b>winter in Arizona</b> (January to March, ${fmt(SOUTH_COST)} a month): health and happiness hold up, but community fades and nothing happens in town while you're gone.</p>
      <p><b>🎓 A scholarship.</b> From a net worth of ${fmt(SCHOLAR_NW)} you can endow a scholarship at Waitsburg High (${fmt(SCHOLAR_COST)}): a graduate gets it every June, and you get a little community each year. <b>🛏️ A spare room:</b> homeowners can host visitors on the first weekend of May, July, September and November (about ${fmt(HOST_PAY)} each, a little happiness for the cleaning, and the odd rough guest).</p>`],
    ['family', '❤️ Family and household', `
      <p>Life brings people and pets: a <b>partner</b> (date nights, a part-time paycheck, and happier weeks), <b>kids</b> (about $650 a month each until 18, plus $200 of childcare if you commute 20+ miles; they bring the most joy in weeks you Rest or Show up for town, and more community), a <b>dog</b>, even a seat on the <b>town council</b> once your community standing is 60 or higher. These mostly arrive through events, so say yes when it fits your life.</p>`],
    ['events', '🎲 Events', `
      <p>Many weeks something happens: about 100 events tied to the seasons, the road and your work. Tap a choice to decide, and every choice shows what it did. Events with only one choice close in one tap. A few examples:</p>
      <ul><li><b>Spring:</b> Celebration Days races, the Touchet running high, tax refunds.</li>
      <li><b>Summer:</b> wheat harvest, Walla Walla Sweets, the Dayton depot festival, the fair and rodeo.</li>
      <li><b>Fall and winter:</b> deer season, snow on Highway 12, powder days at Bluewood, Friday night games.</li>
      <li><b>Any time:</b> truck trouble, layoffs, raises, a friendly stray, someone special, a windstorm, a power outage, a tip about a job.</li></ul>
      <p><b>Three kinds of events</b>, each with its own odds, and never more than one a week:</p>
      <ul><li><b>🏡 Town</b> (about 1 week in 7): Waitsburg life and the seasons, for everyone.</li>
      <li><b>🛣️ Road</b> (about 1 week in 12): deer, fog, flat tires, festivals and deals in other towns. Only in weeks you commute 20+ miles each way or take a trip, and it happens in the town you drive to.</li>
      <li><b>💼 Work</b> (about 1 week in 12): reviews, promotions, overtime, coworkers, the holiday party, union contract votes and federal shutdowns. Only when you have a job; some fit only certain kinds of work.</li></ul>
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
      <p><b>🌾 Wheat:</b> the price per bushel is set each July. At harvest in August choose <b>sell now</b> or <b>store it</b> at the elevator (about 1% of the crop a month); stored wheat's price moves each month, usually up a little, and you sell it from the Life tab before the next July. <b>Crop insurance</b> ($${CROP_INS} each April) makes a drought year pay 90% of a normal crop instead of 30%. <b>🐄 Cattle:</b> hay costs extra in a hard winter, calves come in spring (more if you checked on the herd during calving), and they sell in October at that year's price. Every week without a Get outside week for 6 weeks risks losing a cow.</p>
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
    ['way', '🧭 Finding your way', `
      <ul><li><b>Your first month:</b> a checklist on Home walks you through the basics: a job, your first week, the week strip, the 401(k), a life goal and a visit around town. Ticked steps are remembered on this device, and you can hide it.</li>
      <li><b>Next step:</b> after that, Home shows one suggestion based on the weakest part of your Life Score. Tap it to go to the right place. It never acts for you.</li>
      <li><b>New here?</b> The first time you open trips, the businesses, skills, life goals, the 401(k), school or carpools, a short card explains it. <b>Got it</b> hides it for good.</li>
      <li><b>Underlined words</b> (like ${term('networth')}) explain themselves when you tap them.</li>
      <li><b>Big choices</b> (moving, buying a vehicle, quitting) list what will change in cash, weekly costs and stats before you say yes.</li>
      <li><b>Previously in the Burg:</b> come back after a while and a short recap shows what happened lately and where things stand.</li>
      <li><b>Milestones:</b> new badges and skill levels get a card of their own after the week. <b>⚙️ Settings → Animations</b> turns off moving bars, counting cash and confetti (they're also off when your device asks for reduced motion).</li>
      <li><b>Your life story:</b> when a life ends, its highlights year by year come before the score. Tap <b>Skip to the score</b> to jump past it. The score card you share includes a few highlights.</li></ul>`],
    ['tips', '💡 Tips', `
      <ul><li>Rotate your focus: a little work, a little town, a little rest. Long streaks fade and ruts hurt.</li>
      <li>Classes are a long game. A certificate or degree opens jobs that pay far more.</li>
      <li>Compare <b>take-home</b>, not pay: a long commute in a thirsty pickup eats a raise fast.</li>
      <li>Save 5% in your 401(k) for the free 3% match, especially in long games.</li>
      <li>Show up for town. Community counts for the score, helps you get hired, and unlocks the council.</li>
      <li>Watch the week strip. If a stat keeps going ▼, change your focus before it turns red.</li>
      <li>Before a risky choice, save a copy (Menu → 💾 Save game) so you can come back.</li></ul>`],
    ['settings', '⚙️ Settings: night theme, text size, sounds', `
      <p>Open <b>Menu → ⚙️ Settings</b> (or Settings on the title screen). Settings are saved on this device for every life and never change the game's numbers.</p>
      <ul><li><b>Theme:</b> Day, Night, or Match phone (the default), which follows your phone's dark mode.</li>
      <li><b>Text size:</b> Normal, Large or Larger.</li>
      <li><b>Sounds:</b> off at first. Soft or Normal plays small sounds made by the game itself (nothing to download, so they work offline): a tick for each week, a chime for events, a fanfare for badges. ⏩ and Auto stay quiet until something happens.</li>
      <li><b>Vibration:</b> a short buzz for events and badges on phones that can (iPhones can't).</li>
      <li><b>Swipes:</b> swipe left or right on the page to move between Home, Jobs, Life and the Journal. Pull the little handle at the top of a pop-up down to close it. Events that ask you to choose can't be swiped away.</li></ul>
      <p>On a tablet, a computer or a phone held sideways, Home shows two columns, with your job, home, ride and recent journal entries at the side.</p>`],
    ['install', '📱 Installing and playing offline', `
      <p>The Burg is a web app you can install. On iPhone, open it in Safari, tap Share, then <b>Add to Home Screen</b>. On Android, open it in Chrome and tap <b>Install app</b> (or ⋮ → Add to Home screen). After the first visit it works offline. After you've played a couple of months, Home may offer an <b>Install</b> button where your browser supports it; <b>Not now</b> hides it for two weeks.</p>
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
  else if (el && el.scrollIntoView && el.closest('.sheet')) el.scrollIntoView({ block: 'nearest' });   // a long sheet: bring its button into view
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
