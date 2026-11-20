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
  networth: { w:'Net worth', d:() => 'Everything you own minus what you owe. It adds up your cash (below $0 it counts against you), home equity, vehicle and 401(k). It adds index funds at today\'s value, and wine futures at what you paid until they pay out. It adds what your business would sell for. Then it takes off what\'s left on a truck loan, student loans and a home equity loan. It counts for 30% of your Life Score (15% with a life aim other than All-around).' },
  equity: { w:'Home equity', d:() => `The part of your home that is yours: the down payment, plus each mortgage payment's share, plus whatever the housing market adds or takes away (about ${HOME_GROW * 100}% a year in a normal market). A home equity loan borrows against it and counts against your net worth until it's paid. Selling costs ${SELL_FEE * 100}% in agent fees.` },
  takehome: { w:'Take-home', d:() => 'Pay after taxes (13% on a small paycheck up to 22% on a big one) and the gas to drive to work and back (half with a carpool, less on remote days, and a bus pass instead of gas if you ride the county bus). Union dues and any 401(k) savings come out of it too.' },
  k401: { w:'401(k)', d:() => `A retirement account. Put ${K401.slice(1).map(r => r * 100 + '%').join(' or ')} of each paycheck in before taxes; at 5% or more your employer adds 3% (yours after ${K401_VEST_MONTHS / 12} years at the job). It grows about 6% a year and counts in your net worth at ${Math.round(K401_AFTER_TAX * 100)}%, since it's taxed when it comes out.` },
  rut: { w:'rut', d:() => `After ${RUT_WEEKS} weeks of the same focus you're in a rut: happiness drops every week until you switch. Classes never cause a rut.` },
  fade: { w:'works at', d:() => 'A focus works fully for 4 weeks in a row, then does a little less each week (down to 30%). Switch for a week to reset it.' },
  lifescore: { w:'Life Score', d:() => `Your score out of 100: average happiness 30%, average health 20%, average community 20%, and net worth against your game length's target 30% (a life aim moves ${AIM_W} of those points to its own measure). The weakest part counts ${WEAK_SHARE * 100}% on its own, and your report cards count ${CARD_SHARE * 100}% of the final score. Debt counts below 0, and weeks deep in debt cost points. Pinned life goals you reach add points; a bankruptcy takes ${BK_PENALTY} off.` },
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
  carpool: { ic:'🚙', t:'Carpools', d:() => 'With community 30 or more you can ride with neighbors on a 20+ mile commute: half the gas, an easier drive, and a little community. The carpool goes with the job.' },
  // i68-b10: the jobs and school systems
  interview: { ic:'🗣️', t:'Interviews', d:() => 'Pick how to answer. Being straight helps a little, selling hard needs People skill, and asking about pay suits hard-to-fill jobs. Decide later keeps today\'s odds.' },
  offer: { ic:'🤝', t:'Asking for more', d:() => `Hard-to-fill jobs let you ask for 5% more pay or a ${fmtc(SIGN_ON)} sign-on bonus. Asking risks the offer: about 1 time in ${Math.round(1 / ASK_LOSE)} they pull it.` },
  union: { ic:'🪪', t:'Union jobs', d:() => `Dues are ${UNION_DUES * 100}% of your pay. In return: a 1.5% step raise each January, half the layoff risk, and a contract vote now and then.` },
  ladder: { ic:'🪜', t:'The job ladder', d:() => 'Every job has three steps. The second (+12% pay) comes after a year on the job; the top (+25%) needs 3 years plus more school or People skill 2. A promotion offer shows up when you qualify.' },
  program: { ic:'🎓', t:'Programs', d:() => `Pick a program before you study. Same weeks and tuition, but your diploma counts as a major: +${Math.round(MAJOR_PAY * 100)}% pay and better odds at matching jobs.` },
  cert: { ic:'📜', t:'Certificates', d:() => `A short course of Take classes weeks that opens one kind of job: ${Object.values(CERTS).map(c => `${c.name.replace(/ \(.*/, '')} ${c.weeks} weeks, ${fmtc(c.fee)}`).join('; ')}. Pay as you go or all at once.` },
  // i68-b11: the money systems
  invest: { ic:'📈', t:'Index funds', d:() => `About 6% a year on average, but about 1 year in ${Math.round(1 / MKT.badOdds)} the market drops about ${MKT.drop * 100}%. Keep a month of bills in cash first: debt costs 1.5% a month.` },
  ins: { ic:'🛡️', t:'Insurance', d:() => `Cheaper coverage saves a little each month. When something breaks, you pay the first part: ${fmtc(AUTO_DED)} for your car or truck on full coverage, ${fmtc(RENTERS_DED)} with renters insurance.` },
  will: { ic:'📜', t:'A will', d:() => `${fmtc(WILL_FEE)} from age ${WILL_MIN_AGE}. With one, your grandkid gets their share and the family home right away. Without one, the house is sold and probate takes ${PROBATE_CUT * 100}% and 6 months.` },
  ltc: { ic:'📋', t:'Long-term care', d:() => `From ${LTC_AGE}, you can buy care insurance for ${fmtc(LTC_PREMIUM)} a month. If you need help at home or a care home after ${CARE_AGE}, it pays ${LTC_COVER * 100}% of the bill. Care costs ${fmtc(CARE.aide.cost)} to ${fmtc(CARE.living.cost)} a month without it.` },
  ptax: { ic:'🏛️', t:'Property tax', d:() => `Owners pay the county ${PROP_TAX * 100}% of the home's value a year, half in April and half in October: about ${fmt(propTax())} each time right now.` },
  collect: { ic:'📞', t:'Debt and collections', d:() => `Below $0, debt costs 1.5% a month. After ${COLLECT_WEEKS} weeks in a row it goes to collections: a ${fmtc(COLLECT_FEE)} fee, daily calls (▼ happiness) and worse odds on jobs and loans.` },
  wheat: { ic:'🌾', t:'Stored wheat', d:() => `The elevator keeps your grain while you wait for a better price, for ${fmtc(WHEAT_STORE_FEE * 1000)} a month per 1,000 bushels. It has to be sold by July, when the new crop comes in.` }
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
  const pw = v => '$' + Math.round(v * W2).toLocaleString('en-US') + '/wk';
  const lenRows = Object.values(LENGTHS).map(L => `<tr><td>${L.label}</td><td>${L.turns === Infinity ? 'Age 18 until the end (retire from 62)' : L.turns + ' weeks'}</td><td>$${L.target.toLocaleString('en-US')}</td></tr>`).join('');
  const focusRows = Object.entries(FOCUS).map(([k,f]) => `<tr><td>${f.ic} <b>${f.name}</b></td><td>${f.desc} ${fxWords(f.fx)}${f.payMult ? `, +${Math.round((f.payMult - 1) * 100)}% pay` : ''}${f.hustle ? ', extra cash' : ''}${f.study ? ', counts toward your next diploma' : ''}</td><td>${f.cost ? pw(f.cost) : f.study ? 'tuition' : '—'}</td></tr>`).join('');
  const jobRows = Object.entries(CITIES).map(([ck,c]) => `<tr class="grp"><td colspan="3"><b>${c.name}</b> · ${c.miles ? c.miles + ' mi each way' : 'home, no commute'}</td></tr>` +
    JOBS.filter(x => x.city === ck).map(x => `<tr><td>${x.title}${x.season ? ` <small>(${MONTHS[x.season[0]].slice(0,3)}–${MONTHS[x.season[x.season.length-1]].slice(0,3)})</small>` : ''}${x.union ? ' 🪪' : ''}</td><td>${pw(x.pay)}${x.apprentice ? ' <small>(60% as an apprentice)</small>' : ''}</td><td>${EDU[x.edu].replace(' diploma','')}${x.needCert ? ` + ${CERTS[x.needCert].name.replace(/ \(.*/, '')}` : ''}${x.needMajor ? ` in ${PROGRAMS[x.needMajor].name.toLowerCase()}` : ''}</td></tr>`).join('')).join('');
  const certRows = Object.values(CERTS).map(c => `<tr><td>${c.ic} ${c.name}</td><td>${c.weeks} weeks</td><td>$${c.fee.toLocaleString('en-US')}</td><td>${c.what}</td></tr>`).join('');
  const progRows = Object.values(PROGRAMS).map(x => `<tr><td>${x.ic} ${x.name}</td><td>${x.jobs.map(id => JOBS.find(j => j.id === id)).filter(Boolean).map(j => j.title.toLowerCase()).join(', ')}</td></tr>`).join('');
  const eduRows = [1,2,3].map(l => `<tr><td>${EDU[l]}</td><td>${STUDY_NEED[l-1]} weeks</td><td>${pw(TUITION[l-1])}</td><td>${SCHOOL[l-1]}</td></tr>`).join('');
  const homeRows = Object.values(HOMES).map(h => `<tr><td>${h.name}</td><td>${h.own ? 'Buy: $' + h.down.toLocaleString('en-US') + ' down, then ' : 'Rent '}${pw(h.cost)}</td><td>${h.own ? 'Builds equity' : '—'}</td></tr>`).join('');
  const carRows = Object.values(CARS).map(c => `<tr><td>${c.name}</td><td>${c.mpg} mpg</td><td>${c.price ? '$' + c.price.toLocaleString('en-US') : c.down ? '$' + c.down.toLocaleString('en-US') + ' down + ' + pw(c.pay) + ' for 5 years' : 'Starter'}</td></tr>`).join('');
  const sec = (id, title, body) => `<section id="g-${id}"><h2>${title}</h2>${body}<button class="totop" data-call="helptop">↑ Back to contents</button></section>`;
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
      <p>Tap any stat on Home to see what moves it. Each stat also shows a word: <b>Low</b> (under 35), <b>OK</b>, <b>Good</b> (60 and up) or <b>Great</b> (80 and up). The small notches on its bar mark where the word changes.</p>
      <ul><li><b>😊 Happiness (0–100).</b> Up: Rest, Get outside, Show up for town, a partner, a dog, kids, a nicer home, retirement. Down: stressful jobs, long commutes, overtime, classes, side hustles, debt, no job, ruts.</li>
      <li><b>❤️ Health (0–100).</b> Up: Rest, Get outside, a doctor visit. Down: physical jobs, overtime, side hustles, and age. At 0 you land in the hospital (a big bill), or in Lifetime after 50 it can end your life.</li>
      <li><b>🤝 Community (0–100).</b> Up: Show up for town, working in Waitsburg (a little in Dayton), kids, a council seat, helping in events. It fades slowly if you don't show up. Higher standing helps you get hired.</li>
      <li><b>💰 Net worth.</b> Cash + home equity + your vehicle + 401(k) + a business + index funds (at today's value) + wine futures (at what you paid), minus what's left on truck, student and home equity loans. Tap it on Home for the breakdown.</li></ul>
      <p>A red banner appears when happiness or health drops below 30, with a suggested focus to fix it.</p>`],
    ['money', '💵 Money', `
      <p><b>Coming in:</b> your paycheck, side hustles, a partner's part-time paycheck, unemployment benefits for 6 months after a layoff (${Math.round(UI_SHARE * 100)}% of your last job's pay, between ${fmtc(UI_MIN)} and ${fmtc(UI_MAX)} a month), and Social Security, a public pension and 401(k) payouts once you retire.</p>
      <p><b>Going out every week:</b> rent or mortgage, food and utilities, insurance and phone (you choose the coverage), gas (commute plus errands), truck payments, dog care, date nights, kids, health care (your ${fmtc(HEALTH_PREMIUM)} share of the plan at work before 50, or Apple Health for $0 with no job or pay under ${fmtc(APPLE_HEALTH_PAY)}; more from 50 and 65), late-life care, tuition and focus costs. The <b>📅 money outlook</b> on the Life tab projects the next 13 weeks.</p>
      <p><b>Gas matters.</b> A Tri-Cities job pays more, but 60+ miles each way in a 15-mpg pickup costs real money. The job list shows <b>take-home pay after taxes and gas</b>.</p>
      <p><b>Taxes</b> (federal income tax, Social Security and Medicare; Washington has no income tax) take 13% of a paycheck up to $3,500 a month, rising smoothly to 16% at $6,000, 20% at $8,000 and 22% from $9,000 (2027 dollars). Every job pays at least Washington's minimum wage, about ${fmtc(MIN_WAGE_MONTH)} a month full time. Food and utilities run about ${fmtc(FOOD_UTIL)} a month.</p>
      <p><b>Prices rise</b> about 3% a year and pay about 2.5% a year, so you need raises to keep up. A mortgage or truck loan locks its payment in when you sign.</p>
      <p><b>🛡️ Insurance</b> (Life tab, about ${fmtc(INS_PHONE + INS_AUTO.full + INS_RENTERS)} a month with the phone): full coverage (${fmtc(INS_AUTO.full)}) or liability only (${fmtc(INS_AUTO.liab)}) on your vehicle, homeowners at about ${fmtc(INS_HOME.fixer)} for the fixer-upper and ${fmtc(INS_HOME.farm)} for the farmhouse, renters insurance (renters) or a $500, $1,000 or $2,500 deductible (owners). Cheaper coverage saves a little every month, but crashes, deer, ditches, theft, break-ins, fires and storms then cost you more: full coverage pays vehicle losses after a $500 deductible, renters insurance pays for your things after $250, and a homeowners policy pays after your deductible. Owners can also take a cheaper <b>wind and hail</b> plan (about 0.15% of the home's value a year less): a windstorm claim then costs you up to ${WIND_PCT * 100}% of what the house is worth instead of the regular deductible, and the sheet shows that in dollars.</p>
      <p><b>🌦️ Weather</b> (the Life tab's <b>Ready for weather</b> card): in a wildfire-smoke summer, outdoor crews work shorter days in July and August (10% less pay, half the wear on your body) unless you choose to push through, which risks a sick week. A <b>box-fan air filter</b> (${fmtc(FAN_DIY)} to build with the Handy skill, or ${fmtc(FAN_BUY)} for a purifier) keeps smoke out of your health at home for that year. After a windstorm, roofers are booked for weeks: wait with a tarp (a little happiness each week, and rain can get under it), pay about 30% more to jump the line, or fix it yourself with the Handy skill. After the flood, owners of the fixer-upper can raise the furnace and water heater to cut later flood cleanup by 80%. In winter, Home has a toggle to <b>clear the neighbor's walk</b> every snow (a little health, a little community). With community ${CAPTAIN_MIN} or more you can be your street's <b>block captain</b>: each windstorm or outage you run the plan for an evening and gain community.</p>
      <p><b>Debt:</b> going below $0 charges about 1.5% interest a month. After ${COLLECT_WEEKS} weeks below $0 it goes to <b>collections</b>: a $${COLLECT_FEE} fee, calls that cost happiness every week (they stop once your cash has gone up ${PLAN_WEEKS} weeks in a row: you're <b>on a payment plan</b>), and worse odds on job applications and loans until you're back above $0. At ${fmt(debtWarnAt('normal'))} you get a warning (${fmt(debtWarnAt('hard'))} on Hard), and at ${fmt(debtLimit('normal'))} (${fmt(debtLimit('hard'))} on Hard) you have to leave town, which ends the game (in Relaxed debt never ends it: a debt counselor stops it at ${fmt(RELAXED_FLOOR)}), unless you <b>file for bankruptcy</b> (once a life): the debt is wiped, but you lose index funds, wine futures, any business and any vehicle better than a 1998 pickup. Your home and 401(k) are protected. For 7 years banks won't lend to you (mortgages cost 3 points more) and better-paying jobs are harder to land, and it takes ${BK_PENALTY} points off your Life Score.</p>`],
    ['jobs', '💼 Jobs', `
      <p>There are ${JOBS.length} jobs in six towns, including work at Waitsburg's own businesses. You always live in Waitsburg, so other towns mean a commute. You can apply for <b>one job per week</b>. Higher community standing, extra schooling and local jobs improve your odds.</p>
      <p><b>Making a long commute work:</b> some office jobs (insurance agent, courthouse clerk, professor, scientist) let you work at home <b>2 days</b> a week, so you drive in only 3. The loan officer and lab administrator get 3. The <b>mall</b> in Kennewick is always hiring. It gives 10% off Tri-Cities trip stops. The <b>Pasco food plant</b> pays 30% overtime in the August–October harvest pack. With community 30 or more you can <b>join a carpool</b> on the Jobs tab. You pay half the gas. The drive tires you less, and you hear the news. A carpool goes with the job: when you change jobs you drive alone until you join one again. <b>Side hustles</b> follow the seasons: harvest work in summer, plowing snow in winter, yard work, fixing cars. They pay up to 60% more as you get good at them. Go 6 months with no side hustle (food-truck weekends count) and you get rusty, so the extra fades.</p>
      <p>The list puts jobs you can apply for first. <b>✅ Can apply</b> hides the rest, and ▲▼ compares each job's take-home with your current one. 🔒 jobs need more schooling, a certificate or a program: tap one to see exactly what it takes. Seasonal jobs only hire in season.</p>
      <p><b>Applying and interviews:</b> each application leads to a short interview. Being straight about yourself helps a little; selling yourself hard works only with People skill; asking about pay suits hard-to-fill jobs. Tap <b>Decide later</b> and they call by the end of the week, at the usual odds. Your People skill, a fresh haircut, the right program and your <b>reference</b> all count.</p>
      <p><b>Offers:</b> for hard-to-fill jobs (nurses, nursing assistants, imaging techs, truckers, linemen, wind and reactor techs, teachers, phlebotomists, the lab) you can take the offer, ask for 5% more (People skill helps) or ask for a $3,000 sign-on bonus that you pay back if you leave inside a year. Asking can lose the offer (1 in 10).</p>
      <p><b>References:</b> after 6 months in a job, two weeks' notice (or a layoff) gets you a good reference that helps your next applications. Walking out or getting fired gives you a bad one for a year.</p>
      <p><b>Promotions and job ladders:</b> every job has two named steps up (farm hand → lead hand → farm manager, cellar hand → cellar master → assistant winemaker). The first needs a year in the job; the top step needs three years plus more schooling than the job asks for, or People skill level 2. Each step pays more (+12%, then +25% over the start) and is more stressful. A new job starts at the bottom of its ladder. The Jobs tab shows your ladder and what the next step needs.</p>
      <p><b>Raises:</b> after a year in a job your boss may offer about 6%. Raises of every kind (union steps and contracts too) top out at +${Math.round((RAISE_CAP - 1) * 100)}% above the job's pay; promotions up the ladder and changing jobs are the way past that. <b>Layoffs</b> depend on the job: retail and seasonal work is shakiest, public-sector and licensed work is steadiest, and you're safe for your first 9 months.</p>
      <p><b>Apprenticeships</b> (electrician, plumber, power lineman; trade certificate needed): you start at 50% of a journeyman's pay (60% as a lineman) and step up every year over about 8,000 hours (4 years; 3 for a lineman), then earn full pay. Leaving starts it over.</p>
      <p><b>Seasonal work:</b> the Bluewood lift (December–March), harvest trucking (July–August) and the Forest Service crew (June–September) lay you off when the season ends and call you back when it returns, with no application. Pair a winter job with a summer one, or ride unemployment for a few months.</p>
      <p><b>🪪 Union jobs</b> (rail yard, Hanford, nurses, paraeducators, corrections, teachers, electricians, linemen) take 1.5% dues, give a 1.5% step raise each January and half the layoff risk. Every few years there's a contract vote: take the 2% deal, or strike for a few weeks on 40% strike pay for a likely 6% raise.</p>
      <p><b>Federal jobs</b> (Hanford, the lab, the dam, the VA, the Forest Service) can be furloughed for a few weeks in a shutdown: no paychecks, then back pay in one lump, so savings matter. <b>Hanford and the lab</b> need a security clearance: about 12 weeks at 80% pay after you're hired, and debt below -$5,000 can sink the check and the job.</p>
      <p><b>Remote job:</b> with a bachelor's degree you can work fully remote for a Seattle company: city pay and no commute, a one-time $900 fiber install, but no coworkers, so community fades faster, and layoffs are common.</p>
      <p><b>🚌 County bus:</b> with a job in Dayton or Walla Walla you can ride the bus for a $50 monthly pass: 90% less commute gas and half the truck trouble, but longer days cost a little happiness.</p>
      <table><tr><th>Job</th><th>Pay (2027)</th><th>Needs</th></tr>${jobRows}</table>`],
    ['school', '🎓 School', `
      <p>Pick <b>📚 Take classes</b> as your focus to study. Each week of classes counts toward your next diploma and charges tuition. Under ${fmtc(GRANT_FULL)} a month in pay, the <b>Washington College Grant</b> pays all of your tuition, and less as pay rises, until none from ${fmtc(GRANT_NONE)}. Tuition in a week you're below $0 goes on a federal <b>student loan</b> (about ${SLOAN_RATE * 100}%, 10 years) instead of your card. A week with a trip out of town counts as 3/4 of a week of classes. Studying never puts you in a rut.</p>
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
      <p>On the <b>Life</b> tab, put <b>0%, 5% or 10%</b> of each paycheck into a <b>401(k)</b> before taxes. At 5% or more your employer adds 3%, which <b>vests</b> after ${K401_VEST_MONTHS / 12} years at a job: leave sooner and the match goes back (your own savings are always yours). It grows about 6% a year and counts toward net worth at ${Math.round(K401_AFTER_TAX * 100)}%, because it's taxed when it comes out.</p>
      <p><b>📈 Index funds</b> at ${BROKER} in Walla Walla (Life tab): about 6% a year on average, but about one year in five the market drops 25% at once. Selling in a drop locks in the loss; holding usually comes back. <b>🍷 Wine futures</b> at ${WINERY}: each fall (September to November) buy into that year's vintage for $2,500; it pays out when the wine is released 3 years later, usually about 25% more, 50% more for a great year, and less if wildfire smoke got into the grapes (smoky summers make it a gamble). It counts at what you paid until then.</p>
      <p>In <b>Lifetime</b> games you can retire from age 62 (on the Jobs tab). Retirement pays Social Security, and your 401(k) pays out 4% a year until 73, then more each year like the IRS required-distribution table (about 5% at 80 and 8% at 90). Social Security and a pension are untaxed up to ${fmtc(RETIRE_TAX_FREE)} a month; 401(k) withdrawals are taxed about ${RETIRE_TAX * 100}%.</p>
      <p><b>🇺🇸 Social Security reflects your work.</b> It grows with the years you drew a paycheck (35 is a full career) and your average pay: from 60% of the standard ${fmt(SS_PAY)} a month with no work record up to 140% after 35 years of good pay. Side hustles and businesses don't count.</p>
      <p><b>🏛️ Public pensions.</b> ${JOBS.filter(j => j.pension).map(j => j.title.toLowerCase()).join(', ')} jobs earn a pension: ${PENSION_RATE * 100}% of your best pay there for each year worked, paid every month once you retire. You need ${PENSION_VEST} years in public jobs to <b>vest</b>; leave sooner and you get nothing.</p>
      <p><b>🧭 Planning ahead</b> (Life tab): the <b>📅 money outlook</b> shows your next 13 weeks of pay and bills, the big ones (vehicle tabs, tuition, a lease renewal, a winter away) and the week, if any, your cash would dip below zero. It's also under the week's details.</p>
      <p><b>📜 A will</b> (${fmt(WILL_FEE)}, from age ${WILL_MIN_AGE}, on the Life tab or at Mother Hubbard's Legal Cupboard) matters when your grandkid takes over: with one, their share passes right away along with the family home. Without one, the house is sold and probate takes 10% and 26 weeks.</p>
      <p><b>Late in life</b> (Lifetime): at ${LTC_AGE} you can buy <b>long-term care insurance</b> (${fmt(LTC_PREMIUM)} a month). From ${CARE_AGE}, if health falls below ${CARE_HEALTH}, you choose your care: a paid aide at home (${fmt(CARE.aide.cost)} a month), assisted living in Walla Walla (${fmt(CARE.living.cost)} a month; health holds best, community fades), or family (no bill, but it costs happiness). Paid care needs about 6 months of the bill on hand; without it, or when the savings run out, Medicaid pays for a shared room in Dayton. Insurance pays ${LTC_COVER * 100}% of the bill. Each December retirees can <b>winter in Arizona</b> (January to March, ${fmt(SOUTH_COST)} a month): health and happiness hold up, but community fades and nothing happens in town while you're gone.</p>
      <p><b>🎓 A scholarship.</b> From a net worth of ${fmt(SCHOLAR_NW)} you can endow a scholarship at Waitsburg High (${fmt(SCHOLAR_COST)}): a graduate gets it every June, and you get a little community each year. <b>🛏️ A spare room:</b> homeowners can host visitors on the first weekend of May, July, September and November (about ${fmt(HOST_PAY)} each, a little happiness for the cleaning, and the odd rough guest).</p>`],
    ['family', '❤️ Family and household', `
      <p>Life brings people and pets: a <b>partner</b> (date nights, a part-time paycheck, and happier weeks), <b>kids</b> (about ${fmtc(KID_COST)} a month each until 18, ${fmtc(KID_CARE)} of it childcare, plus ${fmtc(KID_CARE_COMMUTE)} more if you commute 20+ miles; under about ${fmtc(WCCC_LINE)} a month of household pay, Working Connections childcare caps your childcare at ${fmtc(WCCC_CAP)}; they bring the most joy in weeks you Rest or Show up for town, and more community), a <b>dog</b> (or a barn cat, about half a dog's cheer for about $20 a month), even a seat on the <b>town council</b> once your community standing is 60 or higher. These mostly arrive through events, so say yes when it fits your life.</p>`],
    ['body', '🩺 Your body over a life', `
      <p>Bodies change over a life, and the game tries to treat that gently. Most of this shows on the Life tab's <b>🩺 Health and body</b> card.</p>
      <ul><li><b>Every job wears on something:</b> backs for farm hands and nurses, wrists on the onion and food lines, ears at the airport and rail yard, feet for retail and teaching, shoulders for linemen and welders. When you get <b>hurt on the job</b>, the event names it and offers the fix that fits.</li>
      <li><b>Physical therapy:</b> after a work injury, the doctor suggests ${PT_WEEKS} weeks of therapy in Walla Walla, twice a week (copays and gas). Therapy clears it; toughing it out leaves a small, lasting drain on health until you start therapy later (a stop on a Walla Walla trip).</li>
      <li><b>🤒 Sick hours:</b> like Washington's rule, a job earns one hour of sick time for every 40 worked (one a week), up to ${SICK_CAP}. When the flu or feeling run down hits, they cover the time off so the week isn't unpaid. They never turn into cash.</li>
      <li><b>🌤️ A personal day:</b> when happiness falls below ${MH_HAPPY} and you have a job, a personal day can come up, no reason needed (at most once every ${MH_GAP} weeks). It uses a day of sick hours, or a day's pay.</li>
      <li><b>💺 Desk jobs after ${DESK_AGE}:</b> jobs that are easy on the body start to wear a little (a stiff back, tired eyes). One good choice, walking at lunch, clears it for good.</li>
      <li><b>🦷 Dental</b> (insurance sheet, $${DENTAL} a month): yearly checkups are free, an emergency dentist costs less, and a cracked tooth costs $${TOOTH_DENTAL.toLocaleString('en-US')} instead of $${TOOTH_BILL.toLocaleString('en-US')}. A yearly checkup makes a cracked tooth less likely either way.</li>
      <li><b>🚑 Ambulance district</b> (insurance sheet, $${AMB_YEAR} a year): members pay nothing for the ride on a hospital trip. Without it, a hospital stay adds a $${AMB_RIDE.toLocaleString('en-US')} ride bill.</li>
      <li><b>💉 Grown-up shots:</b> from 50, the pharmacy (a stop in Dayton or Walla Walla) has the shingles shot, and from 65 the pneumonia shot. With them a flu week is shorter and milder.</li>
      <li><b>🎣 Get outside</b> reads differently with age: hiking the Blues when you're young, creek walks in your 50s, the riverwalk bench at 75. Skiing Bluewood on a powder day wants a fair health score (${SKI_HEALTH} or more); otherwise you can ride up for the view. With a <b>Bluewood season pass</b> (on sale each October), every Get outside week from December through March is a ski day: a little extra happiness and health, no lift ticket.</li>
      <li><b>🩺 The health plan at work</b> (you pick it each January). The cheap plan saves you about $240 that year. The better plan cuts doctor, urgent care, therapy and emergency dentist bills in half.</li>
      <li><b>🪑 Chair exercise:</b> from ${CHAIR_AGE}, the Touchet Valley Senior Center (Out and about) has a cheap morning class: a little health, a little community, and people who ask how you are.</li>
      <li><b>🚐 The county medical van:</b> at ${VAN_AGE} and up, Walla Walla appointments can go on the van: $${VAN_FARE} instead of gas, but it takes the whole day (your focus works at ${VAN_TIME * 100}% that week).</li>
      <li><b>🧓 Dad's appointments</b> (Lifetime, in your late 40s or 50s): your sister calls from Spokane. Split the drives with her (money), pay for a driver and helper (more money), or take every drive yourself (happiness and health). With a job you can take Washington's <b>paid family leave</b>: up to ${LEAVE_WEEKS} weeks at 90% of your pay (up to a cap), with your job's wear paused. While you're helping, a <b>🌿 respite weekend</b> at the adult day program in Walla Walla gives back health and happiness caregiving took, never more.</li></ul>`],
    ['events', '🎲 Events', `
      <p>Many weeks something happens: more than 100 events tied to the seasons, the road and your work. Tap a choice to decide, and every choice shows what it did. Events with only one choice close in one tap. A few examples:</p>
      <ul><li><b>Spring:</b> Celebration Days races, the Touchet running high, tax refunds.</li>
      <li><b>Summer:</b> wheat harvest, Walla Walla Sweets, the Dayton depot festival, the fair and rodeo.</li>
      <li><b>Fall and winter:</b> deer season, snow on Highway 12, powder days at Bluewood, Friday night games.</li>
      <li><b>Any time:</b> truck trouble, layoffs, raises, a friendly stray, someone special, a power outage, a tip about a job. Windstorms come October to March, once a year at most: trimming the big limb and tying things down first halves the damage.</li>
      <li><b>Every year, for sure:</b> Celebration Days is in May, each year.</li>
      <li><b>Kids:</b> toddlers (2 to 5) bring fevers, daycare spots, potty training, story time and a first haircut. Every kid gets a send-off the week they turn 18, and moving out goes in your Journal. Most weeks the week strip's details have a line about one of the kids.</li>
      <li><b>🚓 Speeding tickets:</b> traffic school keeps one off your record, but only once every ${TICKET_YEARS} years. A ticket you pay stays on your record for ${TICKET_YEARS} years and adds ${fmtc(TICKET_INS)} a month to your insurance.</li>
      <li><b>Around Waitsburg:</b> the park cleanup, the trout opener, the Fourth of July parade, the yard sale, ice storms and frozen pipes, mice in the walls. Helping in the park cleanup, an ice storm or a field fire counts as a week toward the season's town goal. A generator bought in an ice storm keeps the power on in later outages.</li></ul>
      <p><b>Three kinds of events</b>, each with its own odds, and never more than one a week:</p>
      <ul><li><b>🏡 Town</b> (about 1 week in 7): Waitsburg life and the seasons, for everyone.</li>
      <li><b>🛣️ Road</b> (about 1 week in 12): deer, fog, flat tires, festivals and deals in other towns. Only in weeks you commute 20+ miles each way or take a trip, and it happens in the town you drive to.</li>
      <li><b>💼 Work</b> (about 1 week in 12): reviews, promotions, overtime, coworkers, the holiday party, union contract votes and federal shutdowns. Only when you have a job; some fit only certain kinds of work.</li></ul>
      <p>A commuter with a job sees about one event every 3 weeks; someone at home with no job, about one every 7. Hard mode brings 25% more of each. Event prices rise with the cost of living.</p>`],
    ['maps', '🗺️ Maps', `
      <p>Home and Jobs both have a <b>📋 List / 🗺️ Map</b> switch, and the game remembers your choice.</p>
      <ul><li><b>🏡 Waitsburg:</b> tap a place to spend your week there. Home is Rest, Main Street is Show up for town, the library is classes, the river is Get outside, the bulletin board is a side hustle, and your workplace or Highway 12 is Work extra hours. Dashed circles are just for looking. The fields around town change color with the seasons. Tap <b>Main Street</b> for a close-up of the downtown businesses (see Out and about).</li>
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
      <li><b>21 and over:</b> you can't buy drinks until you're 21. That goes for The Little Kiss Pasta Bar, Grenache & Gather, The Royal Brick and Laughing Lad's taproom. Under 21 you can still get a cheese board at Grenache & Gather. You can catch the all-ages open mic and early shows at The Royal Brick too. A place with nothing for you yet says 21+.</li>
      <li><b>Little extras:</b> a haircut or spa day at Rouge helps your job applications for ${LOOK_WEEKS} weeks, an ad in The Touchet Tattler raises side-hustle pay ${AD_BOOST * 100}% for ${AD_WEEKS} weeks, and a woodworking class eases a rut.</li>
      <li><b>Around town:</b> Standard Bearer Bank holds your savings and loans, The Burg Clinic is where you see a doctor, Burg Basket Grocery is where your weekly food money goes, and the local trades fix your roof and porch. Just moved? The Junque Sisters and Dreamy Garden Center help make it home.</li>
      <li><b>Events and jobs:</b> the bluegrass jam, Grenache Fest, music nights, the grill opening, the spring garden rush, a summer cookout and more. Local jobs include line cook, barista, grocery clerk, bank teller, reporter, trades apprentice, medical assistant and ag technician.</li></ul>
      <table><tr><th>Place</th><th>Where and when</th></tr>${PLACES.map(p => `<tr><td>${p.ic} <b>${esc(p.name)}</b><br><small>${esc(p.kind)}</small></td><td>${esc(p.addr)}<br><small>${esc(p.hours)}</small></td></tr>`).join('')}</table>
      <p class="muted">Names are stand-ins; addresses are real. Days and seasons match reality loosely and were last checked ${PLACES_CHECKED}: call ahead in real life.</p>`],
    ['goals', '🎯 Goals, stories and challenges', `
      <p><b>Badges:</b> earn them as your life unfolds. They're collected across all your lives (see them on the title screen).</p>
      <table><tr><th>Badge</th><th>How to earn it</th></tr>${BADGES.map(b => `<tr><td>${b.ic} ${b.name}</td><td>${b.desc}</td></tr>`).join('')}</table>
      <p><b>Life goals:</b> on the <b>Life</b> tab, pin up to ${GOAL_MAX} badges as goals for this life. Each one you reach <b>after</b> pinning it adds <b>${GOAL_POINTS} points</b> to your Life Score.</p>
      <p><b>Stories:</b> some events play out over weeks. You fix up the fixer-upper. A friend starts a food truck. You coach a Little League season: a losing streak, a comeback and the season party. A flood leads to a new levee. It can come any spring the Touchet runs high, sandbags or not. If it reaches your place, you spend a few weeks drying out. What you pick at each step changes what comes next.</p>
      <p><b>🏁 Challenges</b> (on the title screen): set-up stories with a goal. ${Object.values(SCENARIOS).map(c => `${c.ic} <b>${c.name}</b>: ${c.desc}`).join(' ')}</p>`],
    ['grow', '🧰 Skills and your own business', `
      <p><b>Skills</b> grow with practice and show on the Life tab (★ levels 1–3):</p>
      <ul>${Object.values(SKILLS).map(k => `<li>${k.ic} <b>${k.name}:</b> ${k.how}. ${k.perk}.</li>`).join('')}</ul>
      <p><b>Start a business</b> on the Life tab (one at a time; it's worth 60% of what you paid if you sell, less about 5% a year as it ages):</p>
      <ul>${Object.values(BIZ).map(b => `<li>${b.ic} <b>${b.name}</b> ($${b.cost.toLocaleString('en-US')}): ${b.desc}</li>`).join('')}</ul>
      <p>The food truck and the shop only earn in certain weeks: each April a note says what yours needs, each October one says what it earned this year, and the business card shows <b>This season</b> (in red at $0).</p>
      <p><b>🌾 Wheat:</b> lease by March to farm that year's crop; a lease taken later starts with the next year's crop. What a lease sells for shrinks as its 5 years run down, and a renewed lease is worth what the renewal cost. The ground is hired farmed: custom farming, seed and fertilizer cost about $${WHEAT_FARMING.toLocaleString('en-US')} each April, so a drought year loses money. The price per bushel is set each July. At harvest in August choose <b>sell now</b> or <b>store it</b> at the elevator (about 1% of the crop a month); stored wheat's price moves each month, usually up a little, and you sell it from the Life tab before the next July. <b>Crop insurance</b> ($${CROP_INS} each April) makes a drought year pay 90% of a normal crop instead of 30%, and covers most of a hail stripe. The harvest follows the year's weather (see Weather and hard years). <b>🐄 Cattle:</b> pasture rent is $${PASTURE} a month and the vet, minerals and bull lease about $${COW_CARE} per cow a year; hay costs extra in a hard winter, calves come in spring (more if you checked on the herd during calving), and they sell in October at that year's price. Every week without a Get outside week for 6 weeks risks losing a cow.</p>
      <p><b>📅 Weekly challenge</b> (title screen): a 6-month life where everyone gets the same start and luck that week: the events come in the same weeks whatever you choose (what you chose earlier can still change which ones can happen). The week turns over at midnight UTC on Monday, the same moment for everyone. It has its own place on the title screen, so it never takes one of your 5 slots, and it's cleared when the week ends. <b>📤 Share score card</b> on the end screen makes a picture of your result.</p>
      <p><b>🌳 Legacy:</b> when a Lifetime game ends and you had kids, you can keep playing as your grandkid (18, with a name like Ann Lee II that you can change), with half your net worth (up to $250,000 in 2027 dollars) and some of your standing in town. A grandkid comes only after a full life (you passed at 60 or older, not run out of town by debt). Tap <b>Not now</b> and the grandkid waits on the title screen until you start or dismiss them; each heir's save carries the family line.</p>`],
    ['weather', '🌦️ Weather and hard years', `
      <p><b>One weather year:</b> each year has its own weather, and everything reads the same one. About 1 year in 7 is <b>dry</b>: a poor wheat harvest, a low river, a short pack season at the onion shed and the food plant (15% less pay for a few weeks, and layoffs a little more likely), hay for the herd from July, and more smoke and heat. A <b>wet</b> spring makes high water on the Touchet more likely. Wildfire smoke comes about 1 summer in 4, and a little more often as the decades go by. In July a note names the year. Each winter is <b>hard</b> (about 1 in 4), <b>mild</b> (1 in 5) or ordinary: a hard one brings more snow, a bigger heating bill, a gray January and a hard winter on the herd; a mild one brings a low heating bill.</p>
      <ul><li><b>Bad luck has a ceiling:</b> at most 2 big weather hits (storms, floods, hail, hard snow on the highway) in a calendar year.</li>
      <li><b>Gray January:</b> in a hard winter the valley fog can sit for 3 to 5 weeks, a small drain on happiness each week. A light-therapy lamp halves it for good; a walk at noon or a drive up toward Bluewood helps that week.</li>
      <li><b>A chinook</b> can melt the snow in a day and send the river up: moving things off the basement floor halves what a flood costs you.</li>
      <li><b>After a flood</b> reaches your place, about six weeks of drying out: where you sleep and who does the drywall set the bill (a Handy skill and good friends make it cheaper).</li>
      <li><b>Storm debts:</b> sandbagging, mucking out, helping a neighbor through an outage, coffee for line crews or listening to a farmer in a bad year all count. Each person you've helped (up to 5) takes 10% off later home repairs from floods and storms, up to half.</li>
      <li><b>Farm and herd:</b> a May rain lifts the wheat; hail can flatten a stripe of it (crop insurance pays most of it). In a dry July you can sell two cow-calf pairs (the herd grows back in two years) or keep them and buy hay. An ice storm in calving season means night checks, or thinner calves at the sale.</li>
      <li><b>What the weather cost you:</b> the week's details group weather events on one storm card, and each year in review shows what the weather cost and what getting ready saved.</li></ul>`],
    ['saves', '💾 Saving and loading', `
      <p>You can keep up to <b>5 lives</b>. Each one saves itself after every week.</p>
      <ul><li><b>Title screen:</b> your lives are listed with Continue and 🗑 Delete. When all 5 slots are full, a new life asks which one to replace. Each life saves on its own, every week and whenever you leave the app; if an event card or an ending was open when the app closed, Continue brings it back. If your phone's storage is full, a warning says the week wasn't saved, and a save that can't be read is kept aside for you to download.</li>
      <li><b>Menu → 💾 Save game:</b> Save writes your current life right now. Save here or Replace on another slot makes a copy as a checkpoint you can go back to.</li>
      <li><b>Menu → 📂 Load game:</b> switches to any saved life. The one you're playing is saved first.</li></ul>
      <p>Finishing a life frees its slot. Saves live on this device and in this browser.</p>
      <p><b>Menu → 📤 Back up or restore:</b> download a backup file or copy a backup code, then on another device use <b>📥 Restore from a backup</b> (on the title screen or in the same menu). You can add the backup's lives to empty slots or replace all your lives.</p>
      <ul><li><b>Codes check themselves.</b> If a backup code gets cut off or a letter changes on the way, restoring it says which: the last part is missing, a piece in the middle is missing, or one piece was changed. Copy it again from the original.</li>
      <li><b>A backup from a newer game</b> asks you to update first. Tap <b>Check for an update</b>.</li>
      <li><b>📱 Moving to a new phone</b> (in the Menu and under Back up or restore): a two-step guide. On the old phone, copy the backup code into a text or email to yourself (or download a backup file). On the new phone, tap <b>📱 I'm the new phone</b> on the title screen and paste the code or choose the file.</li>
      <li><b>Older copies are "rewound".</b> Restoring an earlier week of a life that's already on this phone asks first. A rewound life still plays, but its ending doesn't set best scores or badges.</li>
      <li><b>Near the end:</b> four weeks before a 2-year or 5-year life ends, the week's report offers <b>📤 Back up now</b>, once.</li></ul>`],
    ['score', '🏆 The Life Score', `
      <p><b>Life Score so far:</b> Home shows the score you'd get if the game ended today. Tap it for the breakdown and a tip for your weakest part. A report card goes in your Journal every 13 weeks. In the <b>📜 Journal</b>, the chips at the top show just Money, Events, Milestones (badges, skills, report cards, town goals, stories) or Trips.</p>
      <p>At the end, your life gets a score out of 100 from four parts:</p>
      <table><tr><th>Part</th><th>Measured as</th><th>Weight</th></tr>
      <tr><td>Happiness</td><td>Your average over the game: 30 → 0 points, 90 → 100</td><td>30%</td></tr>
      <tr><td>Health</td><td>Your average: 40 → 0, 95 → 100</td><td>20%</td></tr>
      <tr><td>Community</td><td>Your average: 10 → 0, 90 → 100</td><td>20%</td></tr>
      <tr><td>Net worth</td><td>Against the target for your game length (in 2027 dollars). Student loans count at half.</td><td>30%</td></tr></table>
      <p><b>A balanced life counts more:</b> the weighted parts make ${100 - WEAK_SHARE * 100}% of the score and your weakest part the other ${WEAK_SHARE * 100}%, so maxing one part while another sits low doesn't carry a life.</p>
      <p><b>Report cards count:</b> you get a report card every 13 weeks. It is judged on how far into the game you are. Your final score is ${CARD_SHARE * 100}% the average of your report cards and ${100 - CARD_SHARE * 100}% how your life ends. So a strong last month can't undo three bad years. And a bad last week can't undo a good life.</p>
      <p><b>💳 Debt:</b> below $0, net worth counts against you (against $90,000, down to −${-DEBT_FLOOR.normal} points of the part, −${-DEBT_FLOOR.relaxed} on Relaxed). Each week your cash is below −$1,000 adds to a debt drag of up to ${DRAG_PTS.normal} points (${DRAG_PTS.relaxed} on Relaxed). End the life with cash at $0 or more and net worth above $0 and the drag drops to a third. Life Score so far shows what debt is costing you and what climbing out would win back, and a life that climbed out says so under its title.</p>
      <p><b>🧭 Life aims:</b> under <b>More options</b> when you start a life, pick what you're playing for. <b>All-around</b> is the classic score. ${Object.entries(AIMS).filter(([k]) => k !== 'all').map(([, a]) => `<b>${a.ic} ${a.name}</b>: ${a.line.replace(/\.$/, '')}.`).join(' ')} Each aim takes ${AIM_W} of net worth's 30 points for its own measure. You can change your aim on the <b>Life</b> tab once a year; the aim part counts each aim by the weeks you held it.</p>
      <p><b>☀️ Good weeks:</b> a week where happiness and health are both ${GOOD_MIN}+ and your cash is at $0 or more. The end screen shows how many of your weeks were good ones; they're the Contentment aim's measure.</p>
      <p>Titles: 85+ <b>Legend of the Burg</b>, 70+ <b>Pillar of the Community</b>, 55+ <b>Solid Waitsburger</b>, 40+ <b>Getting By on Main Street</b>, below that <b>Tumbleweed</b>. Your best score for each length is kept, and Relaxed and Hard scores are labeled and kept separately from Normal ones: tap <b>🏆 Your records</b> on the title screen to see them by length and mode, with your challenges and this week's weekly challenge.</p>
      <p><b>🎛️ Changing the rules:</b> under More options on the title screen, <b>Change the rules</b> lets you set starting money, how fast prices rise, where debt ends the game, how often things happen, and an assist that handles routine events (flat tires, fog, mice) the way a careful player would. Every knob shows the Normal value. A badge tells you where the life counts before you start: <b>Standard</b> (the normal records; Normal rules, or only the routine assist), <b>Custom</b> (its own shelf in Your records) or <b>Sandbox</b> (never recorded, for example with no events at all). Rules are set when a life starts and show on the Life tab; an assist can be turned off later but not back on, and the life keeps the shelf it started on. Weekly challenges and Challenges always use Normal rules.</p>
      <p><b>On track?</b> Life Score so far also shows whether your net worth is on track for how far through the game you are (in Lifetime, counted from 18 to 65). In the first weeks it says <b>Just getting started</b> instead of a title.</p>`],
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
      <li><b>Text size:</b> Normal, Large or Larger. Normal starts from your phone's own text size, and every part of the screen grows with it, the header, tabs and End Week too.</li>
      <li><b>Sounds:</b> off at first. Soft or Normal plays small sounds made by the game itself (nothing to download, so they work offline): a tick for each week, a chime for events, a fanfare for badges. ⏩ and Auto stay quiet until something happens.</li>
      <li><b>Vibration:</b> a short buzz for events and badges on phones that can (iPhones can't).</li>
      <li><b>Swipes:</b> swipe left or right on the page to move between Home, Jobs, Life and the Journal. Pull the little handle at the top of a pop-up down to close it. Events that ask you to choose can't be swiped away.</li>
      <li><b>Week summary (screen readers):</b> after End Week a screen reader says one short sentence (Short, the default), or every number (Full).</li>

      <li><b>Back button:</b> your phone's Back closes the pop-up on top, then Help, then takes you to Home; it stays in the game. On an event it just reminds you to pick one, so a stray Back never answers for you.</li></ul>
      <p>On a tablet, a computer or a phone held sideways, Home shows two columns, with your job, home, ride and recent journal entries at the side.</p>`],
    ['install', '📱 Installing and playing offline', `
      <p>The Burg is a web app you can install. On iPhone, open it in Safari, tap Share, then <b>Add to Home Screen</b>. On Android, open it in Chrome and tap <b>Install app</b> (or ⋮ → Add to Home screen). After the first visit it works offline. After you've played a couple of months, Home may offer an <b>Install</b> button where your browser supports it; <b>Not now</b> hides it for two weeks.</p>
      <p><b>When the browser may not keep your lives</b>, the title screen says so. In a private window, back up before you close it. In a Safari tab on iPhone, Safari can wipe a site after 7 days away, so add the game to your Home Screen. If the browser wiped your lives, load a backup. On iPhone the Home Screen app keeps its own lives, not Safari's. To bring them, copy a backup code in Safari and paste it in the app.</p>
      <p>The game downloads itself once and then opens from your device, with no download at all on a normal launch. A new version is fetched in the background when there is one.</p>
      <p>There's also an <b>Android app (APK)</b> and a <b>Windows installer</b> on the game's GitHub releases page: github.com/krazow/The-Burg/releases.</p>
      <p>Version ${APP_VERSION}.</p>`],
    ['device', '🔒 What this game keeps on your device', deviceHTML()]
  ];
  return `<div class="guide">
    <h2 class="gt">📖 Game guide</h2>
    <nav class="toc" aria-label="Guide contents">${S2.map(([id,t]) => `<button data-call="helpgo" data-arg="${id}">${t}</button>`).join('')}</nav>
    ${S2.map(([id,t,b]) => sec(id, t, b)).join('')}
  </div>`;
}
/* ---------- i57-a23: what the game keeps on this device, and erasing all of it ---------- */
function storageKB(){ let n = 0; for (const k of myKeys()) { try { n += k.length + (localStorage.getItem(k) || '').length; } catch (e) {} } return Math.max(n ? 1 : 0, Math.round(n / 1024)); }
function deviceHTML(){
  const lives = slots().filter(Boolean).length, best = Object.keys(store.get(BEST_KEY) || {}).length, badges = Object.keys(store.get(BADGE_KEY) || {}).length;
  return `<p>Everything stays in this browser on this device. <b>Nothing is sent anywhere:</b> there's no account and no server, and the game only goes online to download itself and its updates.</p>
      <ul><li><b>Your lives:</b> ${lives} of ${SLOT_COUNT} slots in use, each saved after every week.</li>
      <li><b>Best scores:</b> ${best} kept, by length and mode, plus challenges and this week's weekly challenge.</li>
      <li><b>Badges and challenge wins:</b> ${badges} badge${badges === 1 ? '' : 's'} collected.</li>
      <li><b>Settings and little notes to itself:</b> theme, text size, sounds, which tips you've seen, and when you last visited.</li>
      <li><b>The game's own files</b>, so it works with no signal. It also keeps a tiny note that you have played here. That way the title screen can tell you if your lives were wiped.</li></ul>
      <p>All together your saved data is about <b>${storageKB()} KB</b>.</p>
      <button class="btn ghost" id="eraseall">🗑 Erase everything</button>`;
}
function eraseSheet(){
  closeHelp();                                      // the sheet sits under the Help page, so Help steps aside
  sheet(`<h2>🗑 Erase everything?</h2>
    <p>This deletes every life, best score, badge and setting this game keeps on this device, and its offline copy. It can't be undone. Back up first if you might want them.</p>
    <label class="field" for="erasetype">Type ERASE to confirm</label>
    <input type="text" id="erasetype" autocomplete="off" autocapitalize="characters">
    <button class="btn primary" id="yes" disabled>Erase everything</button>
    <button class="btn ghost" id="no">Keep it all</button>`);
  $('#erasetype').oninput = () => { $('#yes').disabled = $('#erasetype').value.trim().toUpperCase() !== 'ERASE'; };
  $('#no').onclick = () => { closeSheet(); showHelp(); };
  $('#yes').onclick = () => {
    for (const k of myKeys()) store.del(k);
    FLAG_SET = false; S = null; LIFE_UNDO = [];
    closeSheet(); renderTitle();
    toast('Everything was erased'); announce('Everything was erased from this device');
    // then the offline copy, in the background: it never redraws, so a life started meanwhile isn't thrown back to the title
    const cachePre = KEY_PREFIX === 'theburgbeta.' ? 'theburgbeta-' : 'theburg-';
    (async () => {
      try { if (typeof caches !== 'undefined') for (const k of await caches.keys()) if (k.startsWith(cachePre) || k === FLAG_CACHE) await caches.delete(k); } catch (e) {}
      try { if ('serviceWorker' in navigator) for (const r of await navigator.serviceWorker.getRegistrations()) if (new URL(r.scope).pathname === new URL('./', location.href).pathname) await r.unregister(); } catch (e) {}
    })();
  };
  setTimeout(() => { if ($('#erasetype')) $('#erasetype').focus(); }, 60);
}
// i43-b03: guide sections lay out only when scrolled near (content-visibility); a contents jump lays them all out
// first so it lands on the right spot
function helpJump(id){ const g = document.querySelector('#helpview .guide'); if (g) g.classList.add('full'); const el = document.getElementById('g-' + id); if (el) el.scrollIntoView({ behavior: calmMotion() ? 'auto' : 'smooth' }); }
function showHelp(){
  // i54-a04/a07: remember what to go back to; Help opened from a sheet (the Menu) goes back to what opened that sheet
  if (!lastHelpFocus) { const a = document.activeElement; lastHelpFocus = a && a.closest && a.closest('#sheet') ? lastFocus : opener(a); }
  lastFocus = null;
  closeSheet(); $('#toast').classList.add('hidden');
  HELP_FROM = S && !S.over ? 'game' : 'title';
  const v = $('#helpview');
  v.innerHTML = `<div class="helphead"><h1>❓ Help</h1><button class="sm alt" id="helpclose" aria-label="Close help">✕ Close</button></div>
    <div class="helpbody">
      <div class="card tutcard"><h3>🎮 Gameplay tutorial</h3>
        <p>Play a short <b>practice life</b>, about 4 minutes: jobs, your weekly focus, skips and plans, how the Life Score adds up, Out and about, trips, insurance, the money outlook, the maps and Settings. A pulsing ring shows exactly what to tap, and each step waits for your tap. ${HELP_FROM === 'game' ? 'Your current life is saved first and comes right back afterward.' : 'Nothing is saved.'}</p>
        <button class="btn primary" id="tutstart">Start the tutorial</button></div>
      ${guideHTML()}
    </div>`;
  v.classList.remove('hidden'); v.scrollTop = 0; setTimeout(() => $('#helpclose').focus({ preventScroll: true }), 30);
  $('#helpclose').onclick = closeHelp;
  $('#tutstart').onclick = startTutorial;
  if ($('#eraseall')) $('#eraseall').onclick = eraseSheet;
  histSync();
}
let lastHelpFocus = null;
function closeHelp(){
  const wasOpen = !$('#helpview').classList.contains('hidden');
  $('#helpview').classList.add('hidden');
  const f = lastHelpFocus; lastHelpFocus = null;
  if (wasOpen && !TUT) setTimeout(() => refocus(f), 30);
  histSync();
}

/* ---------- guided practice tutorial ---------- */
let TUT = null, LAST_TUT_SKIPPED = [];        // steps whose target never appeared (the tests check there are none)
const TSTEPS = [
  { text:'👋 Welcome to a <b>practice life</b>. Nothing here is saved. Follow the <b>pulsing ring</b> and tap what it points to.' },
  { sel:'[data-apply="farmhand"]', tap:1, text:'This is the <b>Jobs</b> tab. Each job shows take-home pay after taxes and gas. Tap <b>Apply</b> on Wheat farm hand.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'You got the job! Tap <b>Let\'s go</b>.' },
  { sel:'#main .stats', text:'These are your <b>stats</b>: happiness, health and community (0–100), and net worth. Later, tap any stat to see what moves it.' },
  { sel:'[data-f="community"]', tap:1, text:'Each week you pick one <b>focus</b>. Tap <b>Town</b> to show up for your community.' },
  { sel:'#end', tap:1, text:'The End Week button shows your focus. Tap <b>End Week</b> to play the week.' },
  { sel:'#strip', tap:1, text:'This strip shows what the week did: money, and ▲▼ for each stat. Tap it.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'Here\'s every paycheck and bill. Tap a line to see <b>why</b> it cost that. Tap <b>Close</b>.' },
  { before:() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')), sel:'#modal:not(.hidden) [data-i="0"]', tap:1, text:'<b>Events</b> pop up as life happens. Tap the first choice.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'Every choice shows what it did. Tap <b>Continue</b>.' },
  { sel:'#ff4', tap:1, text:'<b>⏩</b> plays several weeks with the same focus and stops if something needs you. On small phones it hides behind a long press on End Week. Tap <b>⏩ 4</b>.' },
  { sel:'#app:has(#auto) #scorenow', tap:1, text:'This is how you win. Your <b>🏆 Life Score</b> is made of four parts. Tap <b>Life Score so far</b>.' },
  { sel:'#modal:not(.hidden) .card.tip', text:'Happiness counts 30%, net worth 30%, health 20% and community 20%. Your <b>weakest part</b> counts extra. This tip names it and what helps it, so balance beats grinding one thing.' },
  { before:() => closeSheet(), sel:'#auto', text:'<b>⏭ Auto</b> plays until something needs you. Press and hold it (or Menu → Skip and Auto options) to pick <b>Auto until</b>: a stat getting low, cash below $0, or a new season.' },
  { sel:'#planbtn', text:'<b>🗓 Plan</b> sets up to 4 focuses that take turns, one a week. Picking a focus by hand pauses the plan for that week.' },
  { sel:'#outbtn', tap:1, text:'Quick visits to Waitsburg\'s shops, on top of your focus. Tap <b>🛍️ Out and about</b>.' },
  { sel:'#modal:not(.hidden) #no', tap:1, text:'Every place has a card: when it\'s open and what you can do there. Up to 3 visits a week. Tap <b>Close</b>.' },
  { sel:'#tripchip', text:'<b>🚗 Trips:</b> once a week, go to Dayton, Walla Walla or the Tri-Cities for groceries, the dentist, an oil change or a night out. It happens when you end the week.' },
  { sel:'nav [data-tab="jobs"]', tap:1, text:'Let\'s look for better work. Tap <b>Jobs</b>.' },
  { sel:'#main .term[data-term="takehome"]', tap:1, text:'<b>Underlined words</b> explain themselves. Tap <b>Take-home</b>.' },
  { sel:'[data-job="lineman"]', text:'Tags show what\'s special: <b>🪪 union</b> jobs take dues but give steadier raises, and <b>🧰 apprentice</b> jobs start at 60% pay and step up each year.' },
  { sel:'[data-locked="para"]', tap:1, text:'🔒 jobs need more schooling, a short certificate or a program (sign up on the Life tab). Tap the locked <b>School paraeducator</b> job.' },
  { sel:'#modal:not(.hidden) #yes', tap:1, text:'It shows what the job takes. Tap <b>Make Take classes my focus</b>.' },
  { sel:'nav [data-tab="life"]', tap:1, text:'Tap <b>Life</b> for school, homes, rides, savings and family.' },
  { sel:'[data-k401="1"]', tap:1, text:'Save for retirement: tap <b>5%</b>. Your employer adds 3% on top.' },
  { sel:'#undo', text:'Changed your mind? <b>↩ Undo</b> takes back Life-tab changes until you end the week.' },
  { sel:'#inssheet', tap:1, text:'🛡️ You choose your <b>insurance</b>. Tap <b>Change coverage</b>.' },
  { sel:'#modal:not(.hidden) #ok', tap:1, text:'Cheaper coverage saves a little each month, but a crash or a break-in costs you more. Tap <b>Done</b>.' },
  { sel:'#outlook', tap:1, text:'🧭 <b>Planning ahead</b> shows your Social Security and pension for retirement (in Lifetime games you can retire from 62). Tap <b>📅 Money outlook</b>.' },
  { sel:'#modal:not(.hidden) #no', tap:1, text:'Your next 13 weeks of pay and bills, and the week your cash would dip below zero. Tap <b>Close</b>.' },
  { sel:'nav [data-tab="home"]', tap:1, text:'Back to <b>Home</b>.' },
  { sel:'#main .maptog button:nth-child(2)', tap:1, text:'Rather use a map? Tap <b>🗺️ Map</b>.' },
  { sel:'.mpin[aria-label="Touchet River"]', tap:1, text:'Tap a place to spend your week there. Tap the <b>River</b>.' },
  { sel:'.mapdet .sm', tap:1, text:'Tap <b>Spend this week here</b>.' },
  { sel:'.mpin[aria-label="Main Street"]', tap:1, text:'Your focus is now <b>Get outside</b>. Tap <b>Main Street</b> for a close-up of downtown.' },
  { sel:'.msmap', text:'Each pin is a business. Tap one any time for its card. Dashed pins are closed this week.' },
  { sel:'#main .maptog button:nth-child(1)', tap:1, text:'Tap <b>📋 List</b> to switch back.' },
  { sel:'nav [data-tab="menu"]', tap:1, text:'Tap <b>Menu</b>.' },
  { sel:'#modal:not(.hidden) #settings', tap:1, text:'<b>💾 Save game</b> and <b>📂 Load game</b> live here; real lives also save themselves every week. Tap <b>⚙️ Settings</b>.' },
  { sel:'#modal:not(.hidden) #back', tap:1, text:'Night theme, text size, sounds and swipes. Tap <b>Back to Menu</b>.' },
  { sel:'#modal:not(.hidden) #close', tap:1, text:'Tap <b>Close</b>.' },
  { sel:'#helpbtn', text:'🎉 That\'s the basics! Balance <b>happiness, health, community and money</b>, and mix up your focus. When a life ends, your <b>life story</b> plays before the score. Tap <b>?</b> any time for the game guide or this tutorial.', done:1 }
];
// after: what to do when the practice life ends from the title screen (i23-a01: start the real life the player picked)
function startTutorial(after){
  closeHelp(); closeSheet();
  if (S && !S.over && !S.practice) save();
  TUT = { i: -1, skipped: [], prev: { S: S && !S.over ? clone(S) : null, tab, prefs: clone(prefs()), jobCity, jobOK, undo: LIFE_UNDO, after: typeof after === 'function' ? after : null } };
  LIFE_UNDO = [];
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
  if (st.sel && !el) { if (++TUT.tries < 12) return setTimeout(drawCoach, 150); TUT.skipped.push(TUT.i); return tutNext(); }   // skip a step whose target never appeared
  if (el && el.scrollIntoView && !el.closest('.endbar, .weekstrip, nav, .sheet')) el.scrollIntoView({ block: 'center' });
  else if (el && el.scrollIntoView && el.closest('.sheet')) el.scrollIntoView({ block: 'nearest' });   // a long sheet: bring its button into view
  const r = el ? el.getBoundingClientRect() : null, pad = 6;
  const box = r ? { x: r.left - pad, y: r.top - pad, w: r.width + pad*2, h: r.height + pad*2 } : null;
  const vw = innerWidth, vh = innerHeight;
  const dim = box ? [
      [0, 0, vw, Math.max(0, box.y)], [0, box.y + box.h, vw, Math.max(0, vh - box.y - box.h)],
      [0, box.y, Math.max(0, box.x), box.h], [box.x + box.w, box.y, Math.max(0, vw - box.x - box.w), box.h]]
    : [[0, 0, vw, vh]];
  c.innerHTML = dim.map(([x,y,w,h]) => `<div class="cdim" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`).join('') +
    (box ? `<div class="cring${st.tap ? ' tap' : ''}" style="left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px"></div>${st.tap ? `<div class="cfinger" style="left:${box.x + box.w/2}px;top:${box.y + box.h/2}px">👆</div>` : ''}` : '') +
    `<div class="cbubble" role="dialog" aria-live="polite" style="${box ? 'visibility:hidden' : 'top:50%;transform:translate(-50%,-50%)'}">
      <div class="cstep">Step ${TUT.i + 1} of ${TSTEPS.length}</div>
      <div class="ctext">${st.text}</div>
      <div class="cbtns">${st.tap ? '<span class="chint">👆 Tap the highlighted spot</span>' : `<button class="sm" id="cnext">${st.done ? 'Finish' : 'Next'}</button>`}
        ${st.done ? '' : '<button class="sm alt" id="cskip">Skip tutorial</button>'}</div></div>`;
  c.classList.remove('hidden');
  if (box) placeBubble(c.querySelector('.cbubble'), box, vw, vh, !!st.tap);
  announce(`Tutorial step ${TUT.i + 1} of ${TSTEPS.length}. ${c.querySelector('.ctext').textContent}`);
  { const f = st.tap && el && el.focus ? el : $('#cnext'); if (f) f.focus({ preventScroll: true }); }   // keyboard users can press Enter
  if ($('#cnext')) $('#cnext').onclick = e => { e.stopPropagation(); hideCoach(); tutNext(); };
  if ($('#cskip')) $('#cskip').onclick = e => { e.stopPropagation(); endTutorial(false); };
}
// G1: put the bubble where it never covers the highlighted spot, at any screen size: below or above it if it fits,
// beside it on a wide screen, and otherwise in the bigger gap, scrolling inside itself
function placeBubble(b, box, vw, vh, tap){
  const m = 8, gap = 14, bh = b.offsetHeight;
  const below = vh - (box.y + box.h) - gap - m, above = box.y - gap - m;
  const at = css => { Object.assign(b.style, css); b.style.visibility = ''; };
  if (below >= bh && (below >= above || above < bh)) return at({ top: `${box.y + box.h + gap}px` });
  if (above >= bh) return at({ top: `${box.y - gap - bh}px` });
  const right = vw - (box.x + box.w) - gap - m, left = box.x - gap - m, side = Math.max(left, right);
  if (side >= 240) {
    const w = Math.min(440, side), x = right >= left ? box.x + box.w + gap : box.x - gap - w;
    b.style.width = `${w}px`;
    const h = b.offsetHeight;
    return at({ left: `${x}px`, transform: 'none', top: `${Math.max(m, Math.min(vh - h - m, box.y + box.h / 2 - h / 2))}px` });
  }
  const room = Math.max(below, above);
  if (!tap && room < 120) return at({ top: 'auto', bottom: `${m}px` });   // a big area to look at: the bubble may sit over part of it
  at({ maxHeight: `${Math.max(80, room)}px`, overflowY: 'auto', top: below >= above ? `${box.y + box.h + gap}px` : `${Math.max(m, box.y - gap - Math.min(bh, room))}px` });
}
// i43-a05: where Tab may go during the tutorial: the lit spot (when it's for tapping), then Next and Skip
function coachStops(){
  const st = TUT && TSTEPS[TUT.i], el = st && st.tap && st.sel ? document.querySelector(st.sel) : null;
  const own = !el ? [] : el.matches('button:not([disabled]), [tabindex="0"], input, a[href]') ? [el] : focusables(el);
  const b = document.querySelector('#coach .cbubble');
  return [...own, ...(b ? focusables(b) : [])];
}
function hideCoach(){ const c = $('#coach'); if (c) { c.classList.add('hidden'); c.innerHTML = ''; } }
// i54-a10: on a look-only step the ringed spot is just for looking: taps, long presses and right-clicks on it do nothing
['click', 'pointerdown', 'contextmenu'].forEach(ev => document.addEventListener(ev, e => {
  if (!TUT) return;
  const st = TSTEPS[TUT.i];
  if (st && !st.tap && st.sel && e.target.closest && e.target.closest(st.sel) && !(e.target.closest('#coach'))) { e.preventDefault(); e.stopImmediatePropagation(); }
}, true));
// a tap on the highlighted spot moves the tutorial on (the app handles the tap as usual)
document.addEventListener('click', e => {
  if (!TUT) return;
  const st = TSTEPS[TUT.i];
  if (st && st.tap && st.sel && e.target.closest && e.target.closest(st.sel)) { hideCoach(); setTimeout(tutNext, 60); }
}, true);
addEventListener('resize', () => { if (TUT && !$('#coach').classList.contains('hidden')) drawCoach(); });
function endTutorial(done){
  const prev = TUT && TUT.prev; if (TUT) LAST_TUT_SKIPPED = TUT.skipped; TUT = null; hideCoach(); closeSheet();
  if (!prev) return;
  store.set(PREF_KEY, prev.prefs); applyPrefs(); jobCity = prev.jobCity; jobOK = prev.jobOK; LIFE_UNDO = prev.undo || [];
  S = prev.S; tab = prev.tab || 'home'; MAPSIDE = null; MAPSEL = null;
  if (S) { render(); window.scrollTo(0,0); } else { renderTitle(); if (prev.after) { prev.after(); return; } }
  toast(done ? '🎉 Tutorial finished' : 'Tutorial closed');
}
