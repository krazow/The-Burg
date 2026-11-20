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
  lifescore: { w:'Life Score', d:() => `Your score out of 100: average happiness 30%, average health 20%, average community 20%, and net worth against your game length's target 30%${on('score.aims') ? ` (a life aim moves ${AIM_W} of those points to its own measure)` : ''}. The weakest part counts ${WEAK_SHARE * 100}% on its own${on('score.reportCards') ? `, and your report cards count ${CARD_SHARE * 100}% of the final score` : ''}. Debt counts below 0${on('score.debtDrag') ? ', and weeks deep in debt cost points' : ''}. Pinned life goals you reach add points${on('money.bankruptcy') ? `; a bankruptcy takes ${BK_PENALTY} off` : ''}.` },
  dollars: { w:'2027 dollars', d:() => `Prices rise about ${COL_RATE * 100}% a year. Targets are written in 2027 prices, so a dollar later in the game counts for a little less.` },
  focus: { w:'focus', d:() => 'What you spend your week on. It repeats every week until you change it.' },
  // i68-b28: words from the newer systems
  vesting: { w:'vesting', d:() => `Staying long enough to keep a pension: ${PENSION_VEST} years in public jobs. Leave sooner and it's gone. A 401(k) match vests after ${K401_VEST_MONTHS / 12} years at a job.` },
  probate: { w:'probate', d:() => `What happens without a will: the house is sold, and the court takes ${PROBATE_CUT * 100}% and about ${PROBATE_WEEKS} weeks before your heir gets the rest.` },
  deductible: { w:'deductible', d:() => 'What you pay first after a loss before insurance pays the rest.' },
  liability: { w:'Liability only', d:() => `Car insurance that pays for harm you do to others, not your own vehicle. It costs ${fmtc(INS_AUTO.liab)} a month instead of ${fmtc(INS_AUTO.full)}, but you pay for your own repairs.` },
  heloan: { w:'Home equity loan', d:() => `Money borrowed against your home: up to ${HE_SHARE * 100}% of your equity, paid back over ${HE_MONTHS / 12} years. Selling the house pays off what's left.` },
  refi: { w:'Refinance', d:() => `Trading your mortgage for one at a lower rate. It costs ${REFI_FEE * 100}% of the home's value up front, so it pays only if you stay a few years.` },
  collections: { w:'Collections', d:() => `After ${COLLECT_WEEKS} weeks below $0 your debt goes to a collector: a $${COLLECT_FEE} fee and calls that cost happiness until you pay it down.` },
  dues: { w:'Union dues', d:() => `What a union job takes from each paycheck: ${UNION_DUES * 100}%. In return you get a step raise each January and half the layoff risk.` },
  apprentice: { w:'Apprentice', d:() => 'Someone learning a trade on the job. You start at part pay and step up each year until you earn full pay.' },
  major: { w:'major', d:() => `The program your diploma is in. Matching jobs pay ${MAJOR_PAY * 100}% more and are easier to get.` },
  cert: { w:'certificate', d:() => { const w = Object.values(CERTS).map(c => c.weeks); return `A short course (${Math.min(...w)} to ${Math.max(...w)} weeks) with a one-time fee and no tuition. Each one opens a job or adds pay.`; } }
};
let TERM_N = 0;
// a word you can tap (or focus and press Enter) to see what it means; screen readers hear the meaning on focus
function term(key, label){
  const g = GLOSSARY[key]; if (!g || !on('help.inline')) return label || (g ? g.w : key);
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
  trips: { help:'trips', ic:'🚗', t:'Trips', d:() => `Pick a town and up to ${TRIP_MAX} stops; the trip happens when you end the week. The town you commute to costs no extra gas. Other trips take part of your week, so your focus works at ${TRIP_TIME * 100}%. A stock-up run makes groceries ${STOCK_OFF * 100}% cheaper for ${STOCK_WEEKS} weeks.` },
  goals: { help:'goals', ic:'🎯', t:'Life goals', d:() => `Pin up to ${GOAL_MAX} badges as goals. Each one you reach after pinning it adds ${GOAL_POINTS} points to your Life Score.` },
  skills: { help:'grow', ic:'🧰', t:'Skills', d:() => `Skills grow as you practice: ${SKILL_STEPS.join(', ')} practice points for levels 1, 2 and 3. Each level saves money or opens a choice.` },
  biz: { help:'grow', ic:'🏪', t:'Your own business', d:() => `One at a time: ${Object.values(BIZ).map(b => `${b.ic} ${b.name.toLowerCase()} (${fmtc(b.cost)})`).join(', ')}. Selling gets back 60% of the price, less about ${BIZ_DEP * 100}% a year as it ages.` },
  k401: { help:'savings', ic:'🏦', t:'The 401(k)', d:() => `Save ${K401.slice(1).map(r => r * 100 + '%').join(' or ')} of each paycheck before taxes. At 5% or more your employer adds 3%: free money that grows about 6% a year.` },
  school: { help:'school', ic:'📚', t:'School', d:() => `Pick Take classes as your focus. ${EDU.slice(1).map((e, i) => `${e}: ${STUDY_NEED[i]} weeks`).join(', ')}. Classes never put you in a rut.` },
  carpool: { help:'hired', ic:'🚙', t:'Carpools', d:() => 'With community 30 or more you can ride with neighbors on a 20+ mile commute: half the gas, an easier drive, and a little community. The carpool goes with the job.' },
  // i68-b10: the jobs and school systems
  interview: { help:'hired', ic:'🗣️', t:'Interviews', d:() => 'Pick how to answer. Being straight helps a little, selling hard needs People skill, and asking about pay suits hard-to-fill jobs. Decide later keeps today\'s odds.' },
  offer: { help:'hired', ic:'🤝', t:'Asking for more', d:() => `Hard-to-fill jobs let you ask for 5% more pay or a ${fmtc(SIGN_ON)} sign-on bonus. Asking risks the offer: about 1 time in ${Math.round(1 / ASK_LOSE)} they pull it.` },
  union: { help:'work', ic:'🪪', t:'Union jobs', d:() => `Dues are ${UNION_DUES * 100}% of your pay. In return: a 1.5% step raise each January, half the layoff risk, and a contract vote now and then.` },
  ladder: { help:'work', ic:'🪜', t:'The job ladder', d:() => 'Every job has three steps. The second (+12% pay) comes after a year on the job; the top (+25%) needs 3 years plus more school or People skill 2. A promotion offer shows up when you qualify.' },
  program: { help:'school', ic:'🎓', t:'Programs', d:() => `Pick a program before you study. Same weeks and tuition, but your diploma counts as a major: +${Math.round(MAJOR_PAY * 100)}% pay and better odds at matching jobs.` },
  cert: { help:'school', ic:'📜', t:'Certificates', d:() => `A short course of Take classes weeks that opens one kind of job: ${Object.values(CERTS).map(c => `${c.name.replace(/ \(.*/, '')} ${c.weeks} weeks, ${fmtc(c.fee)}`).join('; ')}. Pay as you go or all at once.` },
  // i68-b11: the money systems
  invest: { help:'savings', ic:'📈', t:'Index funds', d:() => `About 6% a year on average, but about 1 year in ${Math.round(1 / MKT.badOdds)} the market drops about ${MKT.drop * 100}%. Keep a month of bills in cash first: debt costs 1.5% a month.` },
  ins: { help:'money', ic:'🛡️', t:'Insurance', d:() => `Cheaper coverage saves a little each month. When something breaks, you pay the first part: ${fmtc(AUTO_DED)} for your car or truck on full coverage, ${fmtc(RENTERS_DED)} with renters insurance.` },
  will: { help:'later', ic:'📜', t:'A will', d:() => `${fmtc(WILL_FEE)} from age ${WILL_MIN_AGE}. With one, your grandkid gets their share and the family home right away. Without one, the house is sold and probate takes ${PROBATE_CUT * 100}% and 6 months.` },
  ltc: { help:'later', ic:'📋', t:'Long-term care', d:() => `From ${LTC_AGE}, you can buy care insurance for ${fmtc(LTC_PREMIUM)} a month. If you need help at home or a care home after ${CARE_AGE}, it pays ${LTC_COVER * 100}% of the bill. Care costs ${fmtc(CARE.aide.cost)} to ${fmtc(CARE.living.cost)} a month without it.` },
  ptax: { help:'home', ic:'🏛️', t:'Property tax', d:() => `Owners pay the county ${PROP_TAX * 100}% of the home's value a year, half in April and half in October: about ${fmt(propTax())} each time right now.` },
  collect: { help:'money', ic:'📞', t:'Debt and collections', d:() => `Below $0, debt costs 1.5% a month. After ${COLLECT_WEEKS} weeks in a row it goes to collections: a ${fmtc(COLLECT_FEE)} fee, daily calls (▼ happiness) and worse odds on jobs and loans.` },
  wheat: { help:'farm', ic:'🌾', t:'Stored wheat', d:() => `The elevator keeps your grain while you wait for a better price, for ${fmtc(WHEAT_STORE_FEE * 1000)} a month per 1,000 bushels. It has to be sold by July, when the new crop comes in.` }
};
let FIRST_SLOT = null;          // one explainer per screen: render() opens the slot, the first unseen explainer takes it
function firstTime(key){
  const x = FIRST[key];
  if (!x || !S || S.practice || TUT || !on('help.inline') || (prefs().first || {})[key] || FIRST_SLOT === 'used') return '';
  if (FIRST_SLOT === 'open') FIRST_SLOT = 'used';
  return `<div class="card tip first" data-firstcard="${key}"><div><b>${x.ic} New: ${x.t}.</b> ${x.d()}</div><div class="slotbtns">${x.help ? `<button class="sm alt" data-helpsec="${x.help}" aria-label="More in Help about ${x.t}">More in Help →</button>` : ''}<button class="sm alt" data-first="${key}" aria-label="Got it: ${x.t}">Got it</button></div></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-first]'); if (!b) return;
  setPref('first', { ...(prefs().first || {}), [b.dataset.first]: 1 });
  // i70-b21: the card keeps its space until the screen next redraws, so nothing jumps under your thumb
  const c = b.closest('[data-firstcard]');
  if (c) { c.style.minHeight = c.offsetHeight + 'px'; c.classList.add('gone'); c.innerHTML = '<span class="muted">✓ Got it</span>'; }
  announce('Got it');
});

/* ---------- the game guide (i68-b01 one order, i44-b20 folding sections, i44-b17 search, i44-b19 deep links) ----------
   Each section: id (its #g-id anchor), title, a one-line summary, extra search words (i68-b30) and its body.
   g is the contents group it sits in. */
const HELP_GROUPS = [['begin', '🌾 Starting out'], ['money', '💵 Money, work and school'], ['life', '🏡 Home, savings and family'],
  ['valley', '🗺️ Around the valley'], ['build', '🧰 Building a life'], ['app', '📱 The app']];
// old anchors (the tutorial, older links) still land somewhere sensible
const HELP_ALIAS = { jobs:'hired', retire:'later', legacy:'later', wheat:'farm', cattle:'farm', pension:'work', union:'work' };
// i44-b19: ? opens Help at the part you're looking at
const HELP_TABS = { home:'week', jobs:'hired', life:'home', log:'score' };
function helpHere(){
  const sh = !$('#modal').classList.contains('hidden') && document.querySelector('#sheet [data-helpfor]');
  if (sh) return sh.dataset.helpfor;
  return S && !S.over ? HELP_TABS[tab] || null : null;
}
// i7-a08: plain-words questions, each with a short answer, the part of the game it's about and the guide section
const QUESTIONS = [
  { q:'How do I get a better job?', a:() => 'Open Jobs. Jobs you can get come first, with pay after taxes and gas. A 🔒 job needs more school or a certificate: tap it to see what.', tab:'jobs', sel:['[data-hs="jobboard"]'], sec:'hired' },
  { q:'How do I get a raise?', a:() => 'Stay a year and your boss may offer a raise or the next step up. The Jobs tab shows your ladder and what the next step needs.', tab:'jobs', sel:['[data-hs="myjob"]', '[data-hs="jobboard"]'], sec:'work' },
  { q:'Why is my health dropping?', a:() => 'Hard jobs, overtime, side hustles and age wear on it. Rest and Get outside bring it back. A doctor visit on a trip helps most when it\'s low.', tab:'home', sel:['[data-stat="health"]'], sec:'stats' },
  { q:'Why am I unhappy?', a:() => 'Long drives, stress at work, debt and doing the same thing every week all cost happiness. Rest, Get outside and time with people help.', tab:'home', sel:['[data-stat="happy"]'], sec:'stats' },
  { q:'How do I save money?', a:() => 'Put 5% of each paycheck in the 401(k) on the Life tab. Your boss adds 3% for free. Index funds can grow more, but they can drop.', tab:'life', sel:['[data-hs="k401"]'], sec:'savings' },
  { q:'Where did my money go?', a:() => 'Tap the strip above End Week. It lists every paycheck and bill. Tap a line to see why it cost that.', tab:'home', sel:['#strip', '#end'], sec:'money' },
  { q:'How do I get out of debt?', a:() => 'Keep a steady job, take fewer trips, and Work extra hours for a while. Get your cash going up and the collection calls stop.', tab:'home', sel:['[data-f="work"]', '#end'], sec:'money' },
  { q:'How do I go back to school?', a:() => 'Pick Take classes as your focus. Each week counts toward a diploma. A short certificate is a quicker door to some jobs.', tab:'life', sel:['[data-hs="edu"]'], sec:'school' },
  { q:'How do I buy a house?', a:() => 'Save up the down payment, then buy on the Life tab. Owning builds equity, but owners pay property tax.', tab:'life', sel:['[data-hs="home"]'], sec:'home' },
  { q:'How do I skip ahead?', a:() => '⏩ plays a few weeks at once. ⏭ Auto plays until something needs you. Both stop for events that need a choice.', tab:'home', sel:['#auto', '#end'], sec:'week' },
  { q:'How do I take a trip?', a:() => 'Tap Plan a trip on Home. Pick a town and up to 3 stops. It happens when you end the week.', tab:'home', sel:['#tripchip'], sec:'trips' },
  { q:'How is my score worked out?', a:() => 'Happiness, health, community and net worth all count. Your weakest part counts extra. Tap Life Score so far on Home for the breakdown.', tab:'home', sel:['#scorenow'], sec:'score' }
];
function guideSections(){
  const W2 = 12/52;
  const pw = v => '$' + Math.round(v * W2).toLocaleString('en-US') + '/wk';
  const yrs = m => m === 12 ? 'a year' : `${m / 12} years`;
  const lenRows = Object.entries(LENGTHS).map(([k, L]) => `<tr><td>${L.label}</td><td>${L.turns === Infinity ? 'Age 18 until the end (retire from 62)' : L.turns + ' weeks'}</td><td>${S && !S.classic ? (diff() === 'easy' && !L.easy ? 'Not in Easy' : '$' + lenTarget(k).toLocaleString('en-US')) : `$${L.target.toLocaleString('en-US')}${L.easy ? ` ($${L.easy.toLocaleString('en-US')} on Easy)` : ''}`}</td></tr>`).join('');   // D7: each difficulty's target
  const focusRows = Object.entries(FOCUS).map(([k,f]) => `<tr><td>${f.ic} <b>${f.name}</b></td><td>${f.desc} ${fxWords(f.fx)}${f.payMult ? `, +${Math.round((f.payMult - 1) * 100)}% pay` : ''}${f.hustle ? ', extra cash' : ''}${f.study ? ', counts toward your next diploma' : ''}</td><td>${f.cost ? pw(f.cost) : f.study ? 'tuition' : '—'}</td></tr>`).join('');
  const jobRows = Object.entries(CITIES).map(([ck,c]) => `<tr class="grp"><td colspan="3"><b>${c.name}</b> · ${c.miles ? c.miles + ' mi each way' : 'home, no commute'}</td></tr>` +
    JOBS.filter(x => x.city === ck).map(x => `<tr><td>${x.title}${x.season ? ` <small>(${MONTHS[x.season[0]].slice(0,3)}–${MONTHS[x.season[x.season.length-1]].slice(0,3)})</small>` : ''}${x.union ? ' 🪪' : ''}</td><td>${pw(x.pay)}${x.apprentice ? ' <small>(60% as an apprentice)</small>' : ''}</td><td>${EDU[x.edu].replace(' diploma','')}${x.needCert ? ` + ${CERTS[x.needCert].name.replace(/ \(.*/, '')}` : ''}${x.needMajor ? ` in ${PROGRAMS[x.needMajor].name.toLowerCase()}` : ''}</td></tr>`).join('')).join('');
  const certRows = Object.values(CERTS).map(c => `<tr><td>${c.ic} ${c.name}</td><td>${c.weeks} weeks</td><td>$${c.fee.toLocaleString('en-US')}</td><td>${c.what}</td></tr>`).join('');
  const certWeeks = Object.values(CERTS).map(c => c.weeks), certNames = Object.values(CERTS).map(c => c.name.replace(/ \(.*/, '').replace(/ (license|public)$/, '')).map(n => n === n.toUpperCase() ? n : n.toLowerCase());
  const eduRows = [1,2,3].map(l => `<tr><td>${EDU[l]}</td><td>${STUDY_NEED[l-1]} weeks</td><td>${pw(TUITION[l-1])}</td><td>${SCHOOL[l-1]}</td></tr>`).join('');
  const homeRows = Object.values(HOMES).map(h => `<tr><td>${h.name}</td><td>${h.own ? 'Buy: $' + h.down.toLocaleString('en-US') + ' down, then ' : 'Rent '}${pw(h.cost)}</td><td>${h.own ? 'Builds equity' : '—'}</td></tr>`).join('');
  const carRows = Object.values(CARS).map(c => `<tr><td>${c.name}</td><td>${c.mpg} mpg</td><td>${c.price ? '$' + c.price.toLocaleString('en-US') : c.down ? '$' + c.down.toLocaleString('en-US') + ' down + ' + pw(c.pay) + ' for 5 years' : 'Starter'}</td></tr>`).join('');
  const L = ladderOf(jobById('farmhand')), up = r => Math.round((L[r].payMult - 1) * 100);
  const see = (id, label) => `<button type="button" class="helplink" data-helpsec="${id}">${label} →</button>`;
  return [
    { id:'start', g:'begin', t:'🌾 Getting started', sum:'Game lengths, backgrounds, modes and your first moves.', w:'new life length background mode start', b:`
      <p>You're 18 and just moved into a rented room above Main Street in <b>Waitsburg, WA</b>, with $1,500, a 1998 pickup and a high school diploma. Make the best life you can before the game ends.</p>
      <p>Choose a game length when you start a new life:</p>
      <table><tr><th>Length</th><th>How long</th><th>Net worth for full points</th></tr>${lenRows}</table>
      <p>Backgrounds and modes are under <b>More options</b>, below Start.</p>
      <p><b>How your life begins:</b> ${Object.values(BACKGROUNDS).map(b => `${b.ic} <b>${b.name}</b> (${b.hint.toLowerCase()}): ${b.desc}`).join(' ')}</p>
      <p><b>Mode:</b> ${Object.values(MODES).map(m => `${m.ic} <b>${m.name}</b>: ${m.desc}`).join(' ')} Best scores are kept separately for each mode.</p>
      <p><b>Systems:</b> ${Object.values(UNLOCK_MODES).map(m => `${m.ic} <b>${m.name}</b>: ${m.desc}`).join(' ')} In <b>Open as I go</b>, these open during your life, each at its moment or by a set week at the latest: ${UNLOCKS.map(u => `${u.ic} ${u.label}`).join(', ')}. A <b>New</b> tag and a dot on the tab point to what just opened. Tap a ✨ <b>Soon</b> spot, or <b>I know this one</b> at the top of Help, to open one early: it works exactly the same either way. Opening early or late never changes your score. Everything in this guide is there for you to read, open or not.</p>
      <p><b>First moves:</b> find a job on the <b>Jobs</b> tab, pick a weekly focus on <b>Home</b>, and tap <b>End Week</b>. Want to see it done? Play the <b>gameplay tutorial</b> at the top of this page.</p>` },
    { id:'week', g:'begin', t:'📅 Your week', sum:'Pick a focus, end the week, skip ahead, plan and undo.', w:'plan rotation auto undo skip focus rut fade town goal', b:`
      <p>Each turn is <b>one week</b>. On <b>Home</b>, pick one <b>focus</b> for the week, then tap <b>End Week</b>. The button shows your focus, and it repeats every week until you change it.</p>
      <table><tr><th>Focus</th><th>What it does</th><th>Cost</th></tr>${focusRows}</table>
      <p><b>Town goals:</b> each season the town has a goal. Your focus works toward it: ${SEASON_GOALS.map(g => `${g.ic} <b>${g.name}</b> (${g.need} weeks of ${g.what})`).join(', ')}. Finish it before the season ends to gain community and happiness. Your progress shows above the focus buttons.</p>
      <p><b>Mix it up.</b> A focus works at full strength for 4 weeks in a row, then fades (down to 30%). After 8 weeks of the same thing you're <b>in a rut</b>, and happiness drops every week until you switch. The rut note comes back every 13 weeks, with buttons to switch. Classes are the exception: study as long as you like. A rut costs a little less happiness in Relaxed.</p>
      <p><b>Tops out:</b> Rest and Get outside do less as a stat nears the low 80s (the high 70s on Hard), so the top of each stat takes a mix of things.</p>
      <ul><li><b>⏩ 4</b> plays 4 weeks with your focus or your plan.</li>
      <li><b>⏭ Auto</b> plays until something needs you, or until what you chose: a stat under 35, cash under $0, or a new season.</li>
      <li><b>🗓 Plan</b> rotates up to 4 focuses, one a week. Picking by hand pauses it for one week.</li>
      <li><b>↩ Undo</b> on the Life tab takes back changes until you end the week. It can't undo a roll of the dice.</li></ul>
      <p>On small phones, hold <b>End Week</b> for these (or press Shift+Enter). Skips stop for an event that needs a choice, for news you need to act on, or at New Year, and never change what happens. Good news, like a paid-off loan or a diploma, doesn't stop a skip: it shows at the top of the next sheet.  <b>Watch the weeks go by</b> shows each week roll past.</p>
      <p>Skips also stop when happiness, health or community drops below 25. They stop the first time your cash goes below ${fmt(-cost(MONEY_TALK_AT))}, too. After 4 weeks of one focus, <b>⏭ Auto</b> asks first if you'd like to switch. You can turn this off in Settings → Focus check.</p>
      <p><b>After an event:</b> the result has <b>OK</b> and <b>Next week →</b>, which ends the week with the same focus in one tap. After a small event you've seen before, tick <b>Next time, answer the same way</b>: while you skip ahead, that event then answers itself and shows in the week strip. On a plain End Week it still asks. See or turn off your rules in <b>Menu → 🔁 Answer rules</b>.</p>
      <p><b>Coming up:</b> a line on Home counts the dated things in the next 8 weeks (vehicle tabs, an oil change, a last loan payment, a lease, the town goal's end, New Year). Tap it for the list.</p>
      <p><b>What the week did:</b> the strip above End Week shows your money (events included) and ▲▼ for each stat. Tap it to see every paycheck, bill and event. Tap a line there to see <b>why</b> it cost what it did, and read why your stats moved. <b>🧮 Last 4 weeks by kind</b> adds your paychecks and bills up by kind: pay, taxes, home, ride and so on.</p>
      <p><b>Before you pick:</b> under the focus buttons, <b>Next week</b> estimates what the focus will add (stats and cash, before events). A button shows a percentage when that focus is fading from repeating it.</p>` },
    { id:'way', g:'begin', t:'🧭 Finding your way', sum:'The first-month checklist, next steps and tap-to-explain words.', w:'checklist next step explainer glossary recap milestone animation story', b:`
      <ul><li><b>Your first month:</b> a checklist on Home walks you through the basics: a job, your first week, the week strip, the 401(k), a life goal and a visit around town. Ticked steps are remembered on this device, and you can hide it.</li>
      <li><b>Next step:</b> after that, Home shows one suggestion based on the weakest part of your Life Score. Tap it to go to the right place. It never acts for you.</li>
      <li><b>New here?</b> The first time you open trips, the businesses, skills, life goals, the 401(k), school or carpools, a short card explains it. <b>More in Help</b> opens the right part of this guide, and <b>Got it</b> hides the card for good.</li>
      <li><b>Underlined words</b> (like ${term('networth')}) explain themselves when you tap them.</li>
      <li><b>Big choices</b> (moving, buying a vehicle, quitting) list what will change in cash, weekly costs and stats before you say yes.</li>
      <li><b>Previously in the Burg:</b> come back after a while and a short recap shows what happened lately and where things stand.</li>
      <li><b>Milestones:</b> new badges and skill levels get a card of their own after the week. <b>⚙️ Settings → Animations</b> turns off moving bars, counting cash and confetti (they're also off when your device asks for reduced motion).</li>
      <li><b>Your life story:</b> when a life ends, its highlights year by year come before the score. Tap <b>Skip to the score</b> to jump past it. The score card you share includes a few highlights.</li></ul>` },
    { id:'stats', g:'begin', t:'📊 Stats', sum:'What moves happiness, health, community and net worth.', w:'happiness health community net worth hospital banner', b:`
      <p>Tap any stat on Home to see what moves it. Each stat also shows a word: <b>Low</b> (under 35), <b>OK</b>, <b>Good</b> (60 and up) or <b>Great</b> (80 and up). The small notches on its bar mark where the word changes.</p>
      <ul><li><b>😊 Happiness (0–100).</b> Up: Rest, Get outside, Show up for town, a partner, a dog, kids, a nicer home, a new job (once every ${HIRE_JOY_WEEKS} weeks), retirement (a partner, pets, kids and your home lift you toward the high 80s, not past them). Down: stressful jobs, long commutes, overtime, classes, side hustles, debt, no job, ruts.</li>
      <li><b>❤️ Health (0–100).</b> Up: Rest, Get outside, a doctor visit. Down: physical jobs, overtime, side hustles, and age. From 55 your health tops out lower each year (about ${Math.round(maxHealth(70))} at 70 and ${Math.round(maxHealth(85))} at 85); the Health card shows your cap. At 0 you land in the hospital (a big bill), or in Lifetime after 50 it can end your life.</li>
      <li><b>🤝 Community (0–100).</b> Up: Show up for town, working in Waitsburg (a little in Dayton), kids, a council seat, helping in events. It fades slowly if you don't show up, and faster above 60. A Seattle transplant's community slips back toward 10 in the first year, until people know you. Higher standing helps you get hired.</li>
      <li><b>💰 Net worth.</b> Cash + home equity + your vehicle + 401(k) + a business + index funds (at today's value) + wine futures (at what you paid), minus what's left on truck, student and home equity loans. Tap it on Home for the breakdown.</li></ul>
      <p>The happiness, health and community sheets show a small chart of the last 26 weeks. A dashed line marks 30, the low warning. Health also has one at 0, the hospital. The net worth sheet has a chart of your cash and net worth.</p>
      <p>A red banner appears when happiness or health drops below 30, with a suggested focus to fix it.</p>` },
    { id:'tips', g:'begin', t:'💡 Tips', sum:'Seven habits that make a good life.', w:'advice hint strategy', b:`
      <ul><li>Rotate your focus: a little work, a little town, a little rest. Long streaks fade and ruts hurt.</li>
      <li>Classes are a long game. A certificate or degree opens jobs that pay far more.</li>
      <li>Compare <b>take-home</b>, not pay: a long commute in a thirsty pickup eats a raise fast.</li>
      <li>Save 5% in your 401(k) for the free 3% match, especially in long games.</li>
      <li>Show up for town. Community counts for the score, helps you get hired, and unlocks the council.</li>
      <li>Watch the week strip. If a stat keeps going ▼, change your focus before it turns red.</li>
      <li>Before a risky choice, save a copy (Menu → 💾 Save game) so you can come back.</li></ul>` },
    { id:'money', g:'money', t:'💵 Money', sum:'Pay, bills, taxes, insurance and how debt works.', w:'collections bankruptcy debt deductible renters insurance liability taxes gas unemployment minimum wage', b:`
      <p><b>Coming in:</b> your paycheck, side hustles, a partner's part-time paycheck, unemployment benefits for 6 months after a layoff (${Math.round(UI_SHARE * 100)}% of your last job's pay, between ${fmtc(UI_MIN)} and ${fmtc(UI_MAX)} a month), and Social Security, a public pension and 401(k) payouts once you retire.</p>
      <p><b>Going out every week:</b> rent or mortgage, food and utilities, insurance and phone (you choose the coverage), gas (commute plus errands), truck payments, dog care, date nights, kids, health care (your ${fmtc(HEALTH_PREMIUM)} share of the plan at work before 50, or Apple Health for $0 with no job or pay under ${fmtc(APPLE_HEALTH_PAY)}; more from 50 and 65), late-life care, tuition and focus costs. The <b>📅 money outlook</b> on the Life tab projects the next 13 weeks.</p>
      <p><b>Gas matters.</b> A Tri-Cities job pays more, but 60+ miles each way in a 15-mpg pickup costs real money. The job list shows <b>take-home pay after taxes and gas</b>.</p>
      <p><b>Taxes</b> (federal income tax, Social Security and Medicare; Washington has no income tax) take 13% of a paycheck up to $3,500 a month, rising smoothly to 16% at $6,000, 20% at $8,000 and 22% from $9,000 (2027 dollars). Every job pays at least Washington's minimum wage, about ${fmtc(MIN_WAGE_MONTH)} a month full time. Food and utilities run about ${fmtc(FOOD_UTIL)} a month.</p>
      <p><b>Prices rise</b> about 3% a year and pay about 2.5% a year, so you need raises to keep up. A mortgage or truck loan locks its payment in when you sign.</p>
      <p><b>🛡️ Insurance</b> is on the Life tab, about ${fmtc(INS_PHONE + INS_AUTO.full + INS_RENTERS)} a month with the phone.</p>
      <ul><li><b>Your vehicle:</b> full coverage (${fmtc(INS_AUTO.full)}) pays for a wreck after a $500 ${term('deductible')}. ${term('liability', 'Liability only')} (${fmtc(INS_AUTO.liab)}) is cheaper, but you pay for your own repairs.</li>
      <li><b>Renters:</b> renters insurance pays for your things after $250.</li>
      <li><b>Owners:</b> about ${fmtc(INS_HOME.fixer)} for the fixer-upper and ${fmtc(INS_HOME.farm)} for the farmhouse, with a $500, $1,000 or $2,500 deductible. A cheaper <b>wind and hail</b> plan saves about 0.15% of the home's value a year. But then a windstorm claim can cost you up to ${WIND_PCT * 100}% of what the house is worth. The sheet shows that in dollars.</li></ul>
      <p>Cheaper coverage saves a little each month. Then crashes, deer, theft, break-ins, fires and storms cost you more.</p>
      <p><b>💳 Debt, step by step:</b></p>
      <ol class="steps"><li><b>Below $0:</b> about 1.5% interest a month.</li>
      <li><b>${COLLECT_WEEKS} weeks below $0:</b> ${term('collections')}, a $${COLLECT_FEE} fee and calls that cost happiness each week. Get your cash going up ${PLAN_WEEKS} weeks in a row and you're on a payment plan: the calls stop.</li>
      <li><b>${fmt(debtWarnAt('normal'))}</b> (${fmt(debtWarnAt('hard'))} on Hard): a warning.</li>
      <li><b>${fmt(debtLimit('normal'))}</b> (${fmt(debtLimit('hard'))} on Hard): leave town, or <b>file for bankruptcy</b> once a life. Bankruptcy wipes the debt but takes funds, wine futures, a business and a nice vehicle, blocks loans for ${Math.round(BK_WEEKS / 52)} years and costs ${BK_PENALTY} points. The sheet explains it when it comes up.</li></ol>
      <p>In collections, job applications and loans are harder to get. In Relaxed, debt never ends the game: a debt counselor stops it at ${fmt(RELAXED_FLOOR)}.</p>` },
    { id:'hired', g:'money', t:'💼 Getting a job', sum:'Applying, interviews, offers, commuting and the job list.', w:'interview reference bonus bus remote carpool commute apply offer side hustle mall overtime', b:`
      <p>There are ${JOBS.length} jobs in six towns, including work at Waitsburg's own businesses. You always live in Waitsburg, so other towns mean a commute. You can apply for <b>one job per week</b>. Higher community standing, extra schooling and local jobs improve your odds. <b>⚖️ Compare</b> on the job board puts two jobs side by side. It shows take-home pay, the drive, stress, wear and layoff risk in words.</p>
      <p><b>Making a long commute work:</b> some office jobs (insurance agent, courthouse clerk, professor, scientist) let you work at home <b>2 days</b> a week, so you drive in only 3. The loan officer and lab administrator get 3. The <b>mall</b> in Kennewick is always hiring. It gives 10% off Tri-Cities trip stops. The <b>Pasco food plant</b> pays 30% overtime in the August–October harvest pack. With community 30 or more you can <b>join a carpool</b> on the Jobs tab. You pay half the gas. The drive tires you less, and you hear the news. A carpool goes with the job: when you change jobs you drive alone until you join one again. <b>Side hustles</b> follow the seasons: harvest work in summer, plowing snow in winter, yard work, fixing cars. They pay up to 60% more as you get good at them. Go 6 months with no side hustle (food-truck weekends count) and you get rusty, so the extra fades.</p>
      <p>The list puts jobs you can apply for first. <b>✅ Can apply</b> hides the rest, and ▲▼ compares each job's take-home with your current one. 🔒 jobs need more schooling, a ${term('cert', 'certificate')} or a program: tap one to see exactly what it takes. Seasonal jobs only hire in season.</p>
      <p><b>Applying and interviews:</b> each application leads to a short interview. Being straight about yourself helps a little; selling yourself hard works only with People skill; asking about pay suits hard-to-fill jobs. Tap <b>Decide later</b> and they call by the end of the week, at the usual odds. Your People skill, a fresh haircut, the right program and your <b>reference</b> all count.</p>
      <p><b>Offers:</b> for hard-to-fill jobs (nurses, nursing assistants, imaging techs, truckers, linemen, wind and reactor techs, teachers, phlebotomists, the lab) you can take the offer, ask for 5% more (People skill helps) or ask for a $3,000 sign-on bonus that you pay back if you leave inside a year. Asking can lose the offer (1 in 10).</p>
      <p><b>References:</b> after 6 months in a job, two weeks' notice (or a layoff) gets you a good reference that helps your next applications. Walking out or getting fired gives you a bad one for a year.</p>
      <p><b>Remote job:</b> with a bachelor's degree you can work fully remote for a Seattle company: city pay and no commute, a one-time $${FIBER_COST} fiber install, but no coworkers, so community fades faster, and layoffs are common.</p>
      <p><b>🚌 County bus:</b> with a job in Dayton or Walla Walla you can ride the bus for a $${BUS_PASS} monthly pass: 90% less commute gas and half the truck trouble, but longer days cost a little happiness.</p>
      <table><tr><th>Job</th><th>Pay (2027)</th><th>Needs</th></tr>${jobRows}</table>` },
    { id:'work', g:'money', t:'🪜 Moving up at work', sum:'Promotions, raises, unions, layoffs and public jobs.', w:'promotion ladder union strike dues furlough shutdown clearance apprentice pension vest layoff raise federal public government seasonal', b:`
      <p><b>🪜 Every job has two steps up</b>, like farm hand, then ${L[1].title.toLowerCase()}, then ${L[2].title.toLowerCase()}. After ${yrs(L[1].needMonths)} your boss can offer the first step (+${up(1)}% pay). The top step (+${up(2)}%) takes ${yrs(L[2].needMonths)} plus more school than the job asks, or People skill ${L[2].needSkill[1]}. Each step is a little more stress. A new job starts you at the bottom. The Jobs tab shows where you are.</p>
      <p><b>Raises:</b> after a year in a job your boss may offer about 6%. Raises of every kind (union steps and contracts too) top out at +${Math.round((RAISE_CAP - 1) * 100)}% above the job's pay; promotions up the ladder and changing jobs are the way past that. <b>Layoffs</b> depend on the job: retail and seasonal work is shakiest, public-sector and licensed work is steadiest, and you're safe for your first 9 months.</p>
      <p><b>🏛️ Working for the government.</b> Public jobs pay steady and rarely lay off. Many earn a pension: ${PENSION_RATE * 100}% of your best pay there for each year, paid monthly once you retire, but only after ${PENSION_VEST} years in public jobs (${term('vesting')}). Federal jobs (Hanford, the lab, the dam, the VA, the Forest Service) can be furloughed in a shutdown: no pay for a few weeks, then all the back pay at once. Hanford and the lab need a clearance: ${CLEAR_WEEKS} weeks at ${CLEAR_PAY * 100}% pay, and deep debt can sink it.</p>
      <table><tr><th>Jobs with a pension</th></tr><tr><td>${JOBS.filter(j => j.pension).map(j => j.title).join(', ')}</td></tr></table>
      <p><b>🧰 ${term('apprentice', 'Apprenticeships')}</b> are for the electrician, plumber and power lineman jobs, and need a trade certificate. You start at 50% of full pay (60% as a lineman). Your pay steps up each year for 4 years (3 for a lineman), then you earn full pay. If you leave, you start over.</p>
      <p><b>🪪 Union jobs</b> take ${UNION_DUES * 100}% ${term('dues', 'union dues')} from each check. You get a 1.5% raise each January and half the risk of a layoff. Every few years there's a vote on the contract: take the 2% deal, or strike for a few weeks on 40% pay for a likely 6% raise. Union jobs are marked 🪪 in the job list.</p>
      <p><b>Seasonal work:</b> the Bluewood lift (December–March), harvest trucking (July–August) and the Forest Service crew (June–September) lay you off when the season ends and call you back when it returns, with no application. Pair a winter job with a summer one, or ride unemployment for a few months.</p>` },
    { id:'school', g:'money', t:'🎓 School, programs and certificates', sum:'Diplomas, programs, short certificates and paying for school.', w:'CDL welding notary phlebotomy pesticide major program certificate tuition grant student loan college degree diploma classes', b:`
      <p><b>📚 Take classes</b> works toward one of two things. A diploma takes months and opens most better jobs. Pick a program first and the diploma becomes your ${term('major')}: +${MAJOR_PAY * 100}% pay and better odds at matching jobs. A short ${term('cert', 'certificate')} (${certNames.join(', ')}) takes ${Math.min(...certWeeks)}–${Math.max(...certWeeks)} weeks and a one-time fee, with no tuition. Its weeks come first, then classes go back to your diploma.</p>
      <p><b>Paying for it:</b> each week of classes charges tuition. Under ${fmtc(GRANT_FULL)} a month in pay, the <b>Washington College Grant</b> pays all of your tuition, and less as pay rises, until none from ${fmtc(GRANT_NONE)}. Tuition in a week you're below $0 goes on a federal <b>student loan</b> (about ${SLOAN_RATE * 100}%, 10 years) instead of your card. A week with a trip out of town counts as 3/4 of a week of classes. Studying never puts you in a rut.</p>
      <table><tr><th>Diploma</th><th>Weeks</th><th>Tuition</th><th>Where</th></tr>${eduRows}</table>
      <p><b>Programs</b> are picked on the Life tab before you study. They take the same weeks and tuition. Wind techs need the wind energy program, and teachers need teaching.</p>
      <p><b>Certificates:</b> sign up on the Life tab and pay the fee once. One course at a time.</p>
      <table><tr><th>Certificate</th><th>Weeks</th><th>Fee</th><th>What it does</th></tr>${certRows}</table>` },
    { id:'home', g:'life', t:'🏡 Homes and vehicles', sum:'Renting, buying, the housing market and vehicles.', w:'property tax refinance rate hot market mortgage equity house truck car vehicle move', b:`
      <p>On the <b>Life</b> tab you can move or buy a home in Waitsburg (moving costs $300) and trade up your ride. Owned homes build ${term('equity', 'equity')} and gain value. Moving out of one sells it (${SELL_FEE * 100}% agent fees).</p>
      <p><b>🏡 The housing market</b> changes every January: some years are <b>hot</b> (buyers line up, prices climb, and buying costs 5% more), some <b>slow</b> (houses sit and prices slip, and buying costs 3% less). On average homes gain about ${HOME_GROW * 100}% a year. <b>Mortgage rates</b> change each year too (around ${BASE_RATE}%); your rate locks in when you buy. If rates drop a full point below yours, you can ${term('refi', 'refinance')}: the sheet explains it when it comes up.</p>
      <p><b>Owners</b> pay <b>property tax</b> twice a year, in April and October. It's about ${PROP_TAX * 100}% of the home's value a year. Owners can also take a ${term('heloan', 'home equity loan')}: up to half the equity, at the year's rate plus 1 point, paid back over 10 years. Selling pays off what's left.</p>
      <table><tr><th>Home</th><th>Cost</th><th></th></tr>${homeRows}</table>
      <table><tr><th>Vehicle</th><th>Mileage</th><th>Price</th></tr>${carRows}</table>
      <p>Better mileage means cheaper commutes, and newer vehicles break down less. Your old ride counts as a trade-in. Prices shown are 2027 prices; they rise over time.</p>` },
    { id:'savings', g:'life', t:'🏦 Savings', sum:'The 401(k), index funds, wine futures and planning ahead.', w:'index fund market drop 401k match wine futures outlook broker spare room host', b:`
      <p>On the <b>Life</b> tab, put <b>0%, 5% or 10%</b> of each paycheck into a <b>401(k)</b> before taxes. At 5% or more your employer adds 3%, which <b>vests</b> after ${K401_VEST_MONTHS / 12} years at a job: leave sooner and the match goes back (your own savings are always yours). It grows about 6% a year and counts toward net worth at ${Math.round(K401_AFTER_TAX * 100)}%, because it's taxed when it comes out.</p>
      <p><b>📈 Index funds</b> at ${BROKER} in Walla Walla (Life tab): about 6% a year on average, but about one year in five the market drops 25% at once. Selling in a drop locks in the loss; holding usually comes back. <b>🍷 Wine futures</b> at ${WINERY}: each fall (September to November) buy into that year's vintage for $2,500; it pays out when the wine is released 3 years later, usually about 25% more, 50% more for a great year, and less if wildfire smoke got into the grapes (smoky summers make it a gamble). It counts at what you paid until then.</p>
      <p><b>🧭 Planning ahead</b> (Life tab): the <b>📅 money outlook</b> shows your next 13 weeks of pay and bills, the big ones (vehicle tabs, tuition, a lease renewal, a winter away) and the week, if any, your cash would dip below zero. It's also under the week's details.</p>
      <p><b>🛏️ A spare room:</b> if you own your home, you can host guests on the first weekend of May, July, September and November. Each stay pays about ${fmt(HOST_PAY)}. The cleaning costs a little happiness, and now and then a guest is rough on the place.</p>
      <p><b>🏛️ Pensions</b> come with public jobs.</p>${see('work', 'Working for the government')}` },
    { id:'later', g:'life', t:'🌅 Later life and legacy', sum:'Retiring, Social Security, care, a will and your grandkid.', w:'Social Security retire retirement will probate care aide assisted living Medicaid Arizona scholarship legacy grandkid heir long-term', b:`
      <p>In <b>Lifetime</b> games you can retire from age 62 (on the Jobs tab). Retirement pays Social Security, any pension, and your 401(k): 4% a year until 73, then more each year like the IRS required-distribution table (about 5% at 80 and 8% at 90). Social Security and a pension are untaxed up to ${fmtc(RETIRE_TAX_FREE)} a month; 401(k) withdrawals are taxed about ${RETIRE_TAX * 100}%.</p>
      <p><b>🇺🇸 Social Security</b> pays every month once you retire. It grows with each year you drew a paycheck (${SS_FULL_YEARS} years is a full career) and with how well you were paid. With no work record you get 60% of the standard check (${fmt(SS_PAY)} a month); a long, well-paid career gets up to 140%. Side hustles and your own business don't count.</p>
      <p><b>📜 A will</b> (${fmt(WILL_FEE)}, from age ${WILL_MIN_AGE}, on the Life tab or at Mother Hubbard's Legal Cupboard) matters when your grandkid takes over: with one, their share passes right away along with the family home. Without one, the house is sold and ${term('probate')} takes ${PROBATE_CUT * 100}% and ${PROBATE_WEEKS} weeks.</p>
      <p><b>Care late in life:</b> at ${LTC_AGE} you can buy <b>long-term care insurance</b> (${fmt(LTC_PREMIUM)} a month; it pays ${LTC_COVER * 100}% of the bill). From ${CARE_AGE}, if health falls below ${CARE_HEALTH}, you choose your care: an aide at home, assisted living in Walla Walla, or family. The sheet explains each choice when it comes up. When the money runs out, Medicaid pays for a shared room in Dayton.</p>
      <p><b>🌵 Winter in Arizona:</b> each December, if you're retired, you can go south from January to March. It costs ${fmt(SOUTH_COST)} a month. Your health and happiness hold up. But your community fades, and nothing happens in town while you're gone.</p>
      <p><b>🎓 A scholarship.</b> From a net worth of ${fmt(SCHOLAR_NW)} you can endow a scholarship at Waitsburg High (${fmt(SCHOLAR_COST)}): a graduate gets it every June, and you get a little community each year.</p>
      <p><b>🌳 Legacy:</b> when a Lifetime game ends and you had kids, you can keep playing as your grandkid (18, with a name like Ann Lee II that you can change), with half your net worth (up to $250,000 in 2027 dollars) and some of your standing in town. A grandkid comes only after a full life (you passed at 60 or older, not run out of town by debt). Tap <b>Not now</b> and the grandkid waits on the title screen until you start or dismiss them; each heir's save carries the family line.</p>` },
    { id:'family', g:'life', t:'❤️ Family and household', sum:'A partner, kids, pets and the town council.', w:'partner kids children childcare dog cat council', b:`
      <p>Life brings people and pets: a <b>partner</b> (date nights, a part-time paycheck, and happier weeks), <b>kids</b> (about ${fmtc(KID_COST)} a month each until 18, ${fmtc(KID_CARE)} of it childcare, plus ${fmtc(KID_CARE_COMMUTE)} more if you commute 20+ miles; under about ${fmtc(WCCC_LINE)} a month of household pay, Working Connections childcare caps your childcare at ${fmtc(WCCC_CAP)}; they bring the most joy in weeks you Rest or Show up for town, and more community), a <b>dog</b> (or a barn cat, about half a dog's cheer for about $20 a month), even a seat on the <b>town council</b> once your community standing is 60 or higher. These mostly arrive through events, so say yes when it fits your life.</p>` },
    { id:'body', g:'life', t:'🩺 Your body over a life', sum:'Wear from work, sick hours, checkups and getting older.', w:'injury therapy sick dental ambulance shots ski health plan van caregiving leave', b:`
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
      <li><b>🧓 Dad's appointments</b> (Lifetime, in your late 40s or 50s): your sister calls from Spokane. Split the drives with her (money), pay for a driver and helper (more money), or take every drive yourself (happiness and health). With a job you can take Washington's <b>paid family leave</b>: up to ${LEAVE_WEEKS} weeks at 90% of your pay (up to a cap), with your job's wear paused. While you're helping, a <b>🌿 respite weekend</b> at the adult day program in Walla Walla gives back health and happiness caregiving took, never more.</li></ul>` },
    { id:'events', g:'valley', t:'🎲 Events', sum:'What can happen each week, and how often.', w:'event random luck town road work ticket speeding kids toddler', b:`
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
      <p>A commuter with a job sees about one event every 3 weeks; someone at home with no job, about one every 7. Hard mode brings 25% more of each. Event prices rise with the cost of living.</p>` },
    { id:'weather', g:'valley', t:'🌦️ Weather and hard years', sum:'Dry years, hard winters, smoke, storms and getting ready.', w:'smoke wildfire flood storm windstorm roof snow winter drought chinook fog fan filter block captain', b:`
      <p><b>One weather year:</b> each year has its own weather, and everything reads the same one. About 1 year in 7 is <b>dry</b>: a poor wheat harvest, a low river, a short pack season at the onion shed and the food plant (15% less pay for a few weeks, and layoffs a little more likely), hay for the herd from July, and more smoke and heat. A <b>wet</b> spring makes high water on the Touchet more likely. Wildfire smoke comes about 1 summer in 4, and a little more often as the decades go by. In July a note names the year. Each winter is <b>hard</b> (about 1 in 4), <b>mild</b> (1 in 5) or ordinary: a hard one brings more snow, a bigger heating bill, a gray January and a hard winter on the herd; a mild one brings a low heating bill.</p>
      <p><b>Getting ready</b> is on the Life tab's <b>Ready for weather</b> card.</p>
      <ul><li><b>Smoke:</b> in a smoky summer, outdoor crews work shorter days in July and August: 10% less pay, half the wear on your body. You can push through, but you may get sick for a week. A <b>box-fan air filter</b> (${fmtc(FAN_DIY)} to build with the Handy skill, or ${fmtc(FAN_BUY)} for a purifier) keeps smoke out of your health at home that year.</li>
      <li><b>Roof damage:</b> after a windstorm, roofers are booked for weeks. Wait with a tarp (a little happiness each week, and rain can get under it), pay about 30% more to go first, or fix it yourself with the Handy skill.</li>
      <li><b>Flood:</b> after the flood, if you own the fixer-upper, you can raise the furnace and water heater. Later floods then cost 80% less to clean up.</li>
      <li><b>Snow:</b> in winter, Home has a toggle to <b>clear the neighbor's walk</b> every snow, for a little health and community.</li>
      <li><b>Block captain:</b> with community ${CAPTAIN_MIN} or more you can run your street's plan for each windstorm or outage. It takes an evening and builds community.</li></ul>
      <ul><li><b>Bad luck has a ceiling:</b> at most 2 big weather hits (storms, floods, hail, hard snow on the highway) in a calendar year.</li>
      <li><b>Gray January:</b> in a hard winter the valley fog can sit for 3 to 5 weeks, a small drain on happiness each week. A light-therapy lamp halves it for good; a walk at noon or a drive up toward Bluewood helps that week.</li>
      <li><b>A chinook</b> can melt the snow in a day and send the river up: moving things off the basement floor halves what a flood costs you.</li>
      <li><b>After a flood</b> reaches your place, about six weeks of drying out: where you sleep and who does the drywall set the bill (a Handy skill and good friends make it cheaper).</li>
      <li><b>Storm debts:</b> sandbagging, mucking out, helping a neighbor through an outage, coffee for line crews or listening to a farmer in a bad year all count. Each person you've helped (up to 5) takes 10% off later home repairs from floods and storms, up to half.</li>
      <li><b>Farm and herd:</b> a May rain lifts the wheat; hail can flatten a stripe of it (crop insurance pays most of it). In a dry July you can sell two cow-calf pairs (the herd grows back in two years) or keep them and buy hay. An ice storm in calving season means night checks, or thinner calves at the sale.</li>
      <li><b>What the weather cost you:</b> the week's details group weather events on one storm card, and each year in review shows what the weather cost and what getting ready saved.</li></ul>` },
    { id:'maps', g:'valley', t:'🗺️ Maps', sum:'The town map, the region map and where things happen.', w:'map pin region town list', b:`
      <p>Home and Jobs both have a <b>📋 List / 🗺️ Map</b> switch, and the game remembers your choice.</p>
      <ul><li><b>🏡 Waitsburg:</b> tap a place to spend your week there. Home is Rest, Main Street is Show up for town, the library is classes, the river is Get outside, the bulletin board is a side hustle, and your workplace or Highway 12 is Work extra hours. Dashed circles are just for looking. The fields around town change color with the seasons. Tap <b>Main Street</b> for a close-up of the downtown businesses (see Out and about).</li>
      <li><b>🛣️ The region:</b> the six towns along US-12 and the rivers. Tap a town for its drive, gas cost and jobs, apply right there, or plan a trip. After each week your 🛻 drives your commute.</li></ul>
      <p><b>📍 Where things happen:</b> every event takes place somewhere (the fairgrounds, the Touchet, Bluewood, your workplace). The event tells you where, and for 4 weeks a gold badge marks the spot on the map. Tap the place to see what happened there.</p>
      <p class="muted">River shapes for the Columbia, Snake and Yakima come from <b>Natural Earth</b> (public domain). The Walla Walla and Touchet rivers and the roads are drawn by hand.</p>` },
    { id:'trips', g:'valley', t:'🚗 Trips around the region', sum:'Day trips to Dayton, Walla Walla and the Tri-Cities.', w:'trip groceries stock up oil change winter tires dentist doctor dinner movie', b:`
      <p>Once a week you can take a <b>trip</b> to Dayton, Walla Walla or the Tri-Cities: tap <b>🚗 Plan a trip</b> on Home, or a town on the region map. Pick a town and up to ${TRIP_MAX} stops. The trip happens when you end the week.</p>
      <ul><li><b>Gas:</b> there and back, at your vehicle's mileage. In the town you <b>commute to</b> it's free: you stop on the way home.</li>
      <li><b>Time:</b> any other trip takes part of your week, so your focus works at ${TRIP_TIME*100}% that week.</li>
      <li><b>Groceries:</b> a stock-up run at a big store makes groceries ${STOCK_OFF*100}% cheaper for ${STOCK_WEEKS} weeks.</li>
      <li><b>Car care:</b> an oil change cuts breakdowns for 6 months; after a year without one they're more likely. Winter tires (October–January) make sliding off Highway 12 much less likely. Your vehicle's tabs renew every January (DMV): about 1% of what the vehicle is worth, at least $60.</li>
      <li><b>Appointments:</b> skip the dentist for more than a year and a toothache gets likely. A doctor checkup does more when your health is low.</li>
      <li><b>In debt?</b> While your cash is below $0, a trip can have only 1 stop.</li>
      <li><b>Going out:</b> doing the same thing again within ${REPEAT_WEEKS} weeks is only half as fun. Dinners and movies cost double, and do more, with your partner along.</li></ul>
      <table><tr><th>Town</th><th>Places to go</th></tr>${Object.entries(CITIES).filter(([k]) => k !== 'waitsburg').map(([k,c]) => `<tr><td>${TOWNIC[k]} <b>${c.name}</b><br><small>${c.miles} mi</small></td><td>${townStops(k).map(x => `${x.ic} ${x.name}${x.cost ? ` ($${x.cost})` : ''}${x.season ? ` <small>(${x.season})</small>` : ''}${x.min21 ? ' <small>(21+)</small>' : ''}`).join('<br>')}</td></tr>`).join('')}</table>
      <p class="muted">Prices are in 2027 dollars and rise over the years. Places are described, not named.</p>` },
    { id:'out', g:'valley', t:'🛍️ Out and about in Waitsburg', sum:'Quick visits to Waitsburg\'s own shops and places.', w:'shop visit coffee bar haircut ad newspaper bank clinic grocery', b:`
      <p>Waitsburg's own businesses are in the game, under friendly stand-in names, at their real street addresses. Tap <b>🛍️ Out and about</b> under your weekly focus on Home for the list, or switch Home to <b>🗺️ Map</b> and tap <b>Main Street</b> for a close-up of the downtown blocks. The Preston Avenue places (the ale house, the sports bar and the smokehouse) have their own pins on the town map. Every pin opens a card: what the place is, when it's open, and what you can do there.</p>
      <ul><li><b>Quick visits:</b> up to ${OUT_MAX} a week, on top of your focus (they don't use up your week). One visit per place a week, and going back within ${OUT_REPEAT} weeks is half as special. Visits can add at most ${OUT_WEEK_CAP} points to any one stat in a week, and do less as a stat climbs past 80. With health at ${OUT_HEALTH_MAX} or more, only a checkup at the clinic adds health. The farm counter at McGrub & Grain helps farm folks every time and everyone else once a season; the grocery's chats count for community once every ${BASKET_WEEKS} weeks.</li>
      <li><b>Open days and seasons:</b> places keep their real rhythms. Simply Shavings and The Junque Sisters take a winter break in January and February. Dreamy Garden Center is open in the spring. Laughing Lad's outdoor grill runs from May to October. Tonnage Coffee & Strings is a private space: it opens to the public only on community event days like Celebration Days, and for a bluegrass jam every other week.</li>
      <li><b>21 and over:</b> you can't buy drinks until you're 21. That goes for The Little Kiss Pasta Bar, Grenache & Gather, The Royal Brick and Laughing Lad's taproom. Under 21 you can still get a cheese board at Grenache & Gather. You can catch the all-ages open mic and early shows at The Royal Brick too. A place with nothing for you yet says 21+.</li>
      <li><b>Perks on Home:</b> a sure-thing interview, a trade-in bonus, a fresh haircut, a hustle ad or a stock-up run shows as a chip on Home with the weeks left. Tap it to go where you use it.</li>
      <li><b>Little extras:</b> a haircut or spa day at Rouge helps your job applications for ${LOOK_WEEKS} weeks, an ad in The Touchet Tattler raises side-hustle pay ${AD_BOOST * 100}% for ${AD_WEEKS} weeks, and a woodworking class eases a rut.</li>
      <li><b>Around town:</b> Standard Bearer Bank holds your savings and loans, The Burg Clinic is where you see a doctor, Burg Basket Grocery is where your weekly food money goes, and the local trades fix your roof and porch. Just moved? The Junque Sisters and Dreamy Garden Center help make it home.</li>
      <li><b>Events and jobs:</b> the bluegrass jam, Grenache Fest, music nights, the grill opening, the spring garden rush, a summer cookout and more. Local jobs include line cook, barista, grocery clerk, bank teller, reporter, trades apprentice, medical assistant and ag technician.</li></ul>
      <table><tr><th>Place</th><th>Where and when</th></tr>${PLACES.map(p => `<tr><td>${p.ic} <b>${esc(p.name)}</b><br><small>${esc(p.kind)}</small></td><td>${esc(p.addr)}<br><small>${esc(p.hours)}</small></td></tr>`).join('')}</table>
      <p class="muted">Names are stand-ins; addresses are real. Days and seasons match reality loosely and were last checked ${PLACES_CHECKED}: call ahead in real life.</p>` },
    { id:'grow', g:'build', t:'🧰 Skills and your own business', sum:'Skills you practice and a business of your own.', w:'skill handy people business food truck shop', b:`
      <p><b>Skills</b> grow with practice and show on the Life tab (★ levels 1–3):</p>
      <ul>${Object.values(SKILLS).map(k => `<li>${k.ic} <b>${k.name}:</b> ${k.how}. ${k.perk}.</li>`).join('')}</ul>
      <p><b>Start a business</b> on the Life tab (one at a time; it's worth 60% of what you paid if you sell, less about 5% a year as it ages):</p>
      <ul>${Object.values(BIZ).map(b => `<li>${b.ic} <b>${b.name}</b> ($${b.cost.toLocaleString('en-US')}): ${b.desc}</li>`).join('')}</ul>
      <p>The food truck and the shop only earn in certain weeks: each April a note says what yours needs, each October one says what it earned this year, and the business card shows <b>This season</b> (in red at $0).</p>
      <p>Wheat and cattle have a year of their own.</p>${see('farm', 'Farm and ranch')}` },
    { id:'farm', g:'build', t:'🚜 Farm and ranch', sum:'Wheat and cattle, month by month.', w:'cattle calves cow herd hay bushel elevator crop insurance wheat lease pasture auction harvest drought', b:`
      <p><b>🌾 Wheat</b> is a 5-year lease, and the ground is farmed for you. <b>🐄 Cattle</b> are ${CATTLE_COWS} cow-calf pairs on rented pasture (${fmtc(PASTURE)} a month, plus about ${fmtc(COW_CARE)} per cow a year for the vet, minerals and bull). Both start on the Life tab.</p>
      <table><tr><th>When</th><th>What happens</th></tr>
      <tr><td>By March</td><td>🌾 Lease by March to farm this year's crop. A later lease starts with next year's.</td></tr>
      <tr><td>April</td><td>🌾 Farming costs about ${fmtc(WHEAT_FARMING)}. <b>Crop insurance</b> (${fmtc(CROP_INS)}) makes a drought year pay ${CROP_INS_YIELD * 100}% of a normal crop instead of 30%, and covers most of a hail stripe.</td></tr>
      <tr><td>Spring</td><td>🐄 Calves come. More of them if you checked on the herd during calving.</td></tr>
      <tr><td>July</td><td>🌾 The price per bushel is set.</td></tr>
      <tr><td>August</td><td>🌾 Harvest: sell now or store it at the elevator (${WHEAT_STORE_FEE * 100}% of the crop a month). The harvest card explains it when it comes up.</td></tr>
      <tr><td>Each month after</td><td>🌾 Stored wheat's price moves, usually up a little. Sell it from the Life tab before the next July.</td></tr>
      <tr><td>October</td><td>🐄 The calves sell at the livestock auction, at that year's price.</td></tr>
      <tr><td>November–March</td><td>🐄 Hay for the cows (${fmtc(HAY)} per cow a month, half again in a hard winter).</td></tr>
      <tr><td>Any time</td><td>🐄 Get outside weeks count as checking the herd. Go 6 weeks without one and you risk losing a cow.</td></tr></table>
      <p>A drought year loses money on wheat, and a dry July means hay early (see Weather). A lease is worth less as its 5 years run down; a renewed lease is worth what the renewal cost.</p>` },
    { id:'goals', g:'build', t:'🎯 Goals, stories and challenges', sum:'Badges, life goals, stories and challenges.', w:'badge goal pin story challenge weekly scenario share', b:`
      <p><b>Badges:</b> earn them as your life unfolds. They're collected across all your lives (see them on the title screen).</p>
      <table><tr><th>Badge</th><th>How to earn it</th></tr>${BADGES.map(b => `<tr><td>${b.ic} ${b.name}</td><td>${b.desc}</td></tr>`).join('')}</table>
      <p><b>Life goals:</b> on the <b>Life</b> tab, pin up to ${GOAL_MAX} badges as goals for this life. Each one you reach <b>after</b> pinning it adds <b>${GOAL_POINTS} points</b> to your Life Score.</p>
      <p><b>Stories:</b> some events play out over weeks. You fix up the fixer-upper. A friend starts a food truck. You coach a Little League season: a losing streak, a comeback and the season party. A flood leads to a new levee. It can come any spring the Touchet runs high, sandbags or not. If it reaches your place, you spend a few weeks drying out. What you pick at each step changes what comes next.</p>
      <p><b>🏁 Challenges</b> (on the title screen): set-up stories with a goal. ${Object.values(SCENARIOS).map(c => `${c.ic} <b>${c.name}</b>: ${c.desc}`).join(' ')}</p>
      <p><b>📅 Weekly challenge</b> (title screen): a 6-month life where everyone gets the same start and luck that week: the events come in the same weeks whatever you choose (what you chose earlier can still change which ones can happen). The week turns over at midnight UTC on Monday, the same moment for everyone. It has its own place on the title screen, so it never takes one of your 5 slots, and it's cleared when the week ends. <b>📤 Share score card</b> on the end screen makes a picture of your result.</p>` },
    { id:'score', g:'build', t:'🏆 The Life Score', sum:'How your Life Score adds up, and life aims.', w:'score points report card aim title records good weeks', b:`
      <p><b>Life Score so far:</b> Home shows the score you'd get if the game ended today. Tap it for the breakdown and a tip for your weakest part.${on('score.reportCards') ? ' A report card goes in your Journal every 13 weeks.' : ''} In the <b>📜 Journal</b>, the chips at the top show just Money, Events, Milestones (badges, skills, report cards, town goals, stories) or Trips.</p>
      <p>At the end, your life gets a score out of 100 from four parts:</p>
      <table><tr><th>Part</th><th>Measured as</th><th>Weight</th></tr>
      <tr><td>Happiness</td><td>Your average over the game: 30 → 0 points, 90 → 100</td><td>30%</td></tr>
      <tr><td>Health</td><td>Your average: 40 → 0, 95 → 100</td><td>20%</td></tr>
      <tr><td>Community</td><td>Your average: 10 → 0, 90 → 100</td><td>20%</td></tr>
      <tr><td>Net worth</td><td>Against the target for your game length (in 2027 dollars). Student loans count at half.</td><td>30%</td></tr></table>
      <p><b>A balanced life counts more:</b> the weighted parts make ${100 - WEAK_SHARE * 100}% of the score and your weakest part the other ${WEAK_SHARE * 100}%, so maxing one part while another sits low doesn't carry a life.</p>
      ${on('score.reportCards') ? '' : '<p><b>No report cards on Easy:</b> your final score comes from your averages and your net worth when the life ends.</p>'}
      ${!on('score.reportCards') ? '' : `<p><b>Report cards count:</b> you get a report card every 13 weeks. It is judged on how far into the game you are. Your final score is ${CARD_SHARE * 100}% the average of your report cards and ${100 - CARD_SHARE * 100}% how your life ends. So a strong last month can't undo three bad years. And a bad last week can't undo a good life.</p>`}
      <p><b>💳 Debt:</b> below $0, net worth counts against you (against $90,000, down to −${-DEBT_FLOOR.normal} points of the part, −${-DEBT_FLOOR.relaxed} on Easy).${on('score.debtDrag') ? ` Each week your cash is below −$1,000 adds to a debt drag of up to ${DRAG_PTS.normal} points. End the life with cash at $0 or more and net worth above $0 and the drag drops to a third.` : ''} Life Score so far shows what debt is costing you and what climbing out would win back, and a life that climbed out says so under its title.</p>
      ${!on('score.aims') ? '' : `<p><b>🧭 Life aims:</b> under <b>More options</b> when you start a life, pick what you're playing for. <b>All-around</b> is the classic score. ${Object.entries(AIMS).filter(([k]) => k !== 'all').map(([, a]) => `<b>${a.ic} ${a.name}</b>: ${a.line.replace(/\.$/, '')}.`).join(' ')} Each aim takes ${AIM_W} of net worth's 30 points for its own measure. You can change your aim on the <b>Life</b> tab once a year; the aim part counts each aim by the weeks you held it.</p>`}
      <p><b>☀️ Good weeks:</b> a week where happiness and health are both ${GOOD_MIN}+ and your cash is at $0 or more. The end screen shows how many of your weeks were good ones.${on('score.aims') ? ' They\'re the Contentment aim\'s measure.' : ''}</p>
      <p>Titles: 85+ <b>Legend of the Burg</b>, 70+ <b>Pillar of the Community</b>, 55+ <b>Solid Waitsburger</b>, 40+ <b>Getting By on Main Street</b>, below that <b>Tumbleweed</b>. Your best score for each length is kept. Easy, Normal and Hard each have their own shelf, and lives from before difficulty modes are on a <b>🏛️ Classic</b> shelf. Tap <b>Challenges and records</b> on the title screen to see them, with your top lives, your challenges and this week's weekly challenge.</p>
      <p><b>🎛️ Changing the rules:</b> under More options on the title screen, <b>Change the rules</b> lets you set starting money, how fast prices rise, where debt ends the game, how often things happen, and an assist that handles routine events (flat tires, fog, mice) the way a careful player would. Every knob shows the Normal value. A badge tells you where the life counts before you start: <b>Standard</b> (the normal records; Normal rules, or only the routine assist), <b>Custom</b> (its own shelf in Your records) or <b>Sandbox</b> (never recorded, for example with no events at all). Rules are set when a life starts and show on the Life tab; an assist can be turned off later but not back on, and the life keeps the shelf it started on. Weekly challenges and Challenges always use Normal rules.</p>
      <p><b>On track?</b> Life Score so far also shows whether your net worth is on track for how far through the game you are (in Lifetime, counted from 18 to 65). In the first weeks it says <b>Just getting started</b> instead of a title.</p>` },
    { id:'saves', g:'app', t:'💾 Saving and loading', sum:'Five lives, saving, loading and backups.', w:'save load slot backup restore code delete', b:`
      <p>You can keep up to <b>5 lives</b>. Each one saves itself after every week.</p>
      <ul><li><b>Title screen:</b> your lives are listed with Continue and 🗑 Delete. When all 5 slots are full, a new life asks which one to replace. Each life saves on its own, every week and whenever you leave the app; if an event card or an ending was open when the app closed, Continue brings it back, with the same outcome waiting. Each slot also keeps last week's save: if this week's save gets damaged, the title screen offers <b>Use last week's copy</b>. If your phone's storage is full, a warning says the week wasn't saved, and a save that can't be read is kept aside for you to download.</li>
      <li><b>Menu → 💾 Save game:</b> Save writes your current life right now. Save here or Replace on another slot makes a copy as a checkpoint you can go back to.</li>
      <li><b>Menu → 📂 Load game:</b> switches to any saved life. The one you're playing is saved first.</li>
      <li><b>Menu → 👋 Done for now:</b> saves, shows a small card about this sitting (weeks played, the dates, your Life Score before and after, the best moment), then goes to the title screen.</li></ul>
      <p>Finishing a life frees its slot. Saves live on this device and in this browser. The game asks your phone to keep them even when it's low on space; <b>Menu → 📤 Back up or restore</b> says <b>Saves protected</b>, or suggests a backup if the phone said no. In the phone app, Back up and Share open your phone's share sheet (Drive, email, Messages).</p>
      <p>If something breaks, a sheet says so: <b>Continue</b> goes back to your last save, and <b>Copy details</b> copies what went wrong so you can send it to us.</p>
      <p><b>Menu → 📤 Back up or restore:</b> download a backup file or copy a backup code, then on another device use <b>📥 Restore from a backup</b> (on the title screen or in the same menu). You can add the backup's lives to empty slots or replace all your lives.</p>
      <p>A backup also keeps your best scores, badges and settings. You can make one from the title screen or the end screen, even with no life going.</p>
      <ul><li><b>Codes check themselves.</b> If a backup code gets cut off or a letter changes on the way, restoring it says which: the last part is missing, a piece in the middle is missing, or one piece was changed. Copy it again from the original. A code pasted with other words around it still works.</li>
      <li><b>No twins.</b> A life that's already on this phone isn't added twice.</li>
      <li><b>A backup from a newer game</b> asks you to update first. Tap <b>Check for an update</b>.</li>
      <li><b>📱 Moving to a new phone</b> (in the Menu and under Back up or restore): a two-step guide. On the old phone, copy the backup code into a text or email to yourself (or download a backup file). On the new phone, tap <b>📱 I'm the new phone</b> on the title screen and paste the code or choose the file.</li>
      <li><b>Older copies are "rewound".</b> Restoring an earlier week of a life that's already on this phone asks first. A rewound life still plays, but its ending doesn't set best scores or badges.</li>
      <li><b>Near the end:</b> four weeks before a 2-year or 5-year life ends, the week's report offers <b>📤 Back up now</b>, once.</li></ul>` },
    { id:'settings', g:'app', t:'⚙️ Settings: night theme, text size, sounds', sum:'Theme, text size, sounds, swipes and Back.', w:'theme dark mode night text size sound vibration swipe back button tablet', b:`
      <p>Open <b>Menu → ⚙️ Settings</b> (or Settings on the title screen). Settings are saved on this device for every life and never change the game's numbers.</p>
      <ul><li><b>Theme:</b> Day, Night, or Match phone (the default), which follows your phone's dark mode.</li>
      <li><b>Text size:</b> Normal, Large or Larger. Normal starts from your phone's own text size, and every part of the screen grows with it, the header, tabs and End Week too.</li>
      <li><b>Sounds:</b> off at first. Soft or Normal plays small sounds made by the game itself (nothing to download, so they work offline): a tick for each week, a chime for events, a fanfare for badges. ⏩ and Auto stay quiet until something happens.</li>
      <li><b>Vibration:</b> a short buzz for events and badges on phones that can (iPhones can't).</li>
      <li><b>Swipes:</b> swipe left or right on the page to move between Home, Jobs, Life and the Journal. Pull a pop-up down to close it, from anywhere on it when it's scrolled to the top. Events that ask you to choose can't be swiped away.</li>
      <li><b>Back button:</b> your phone's Back closes the pop-up on top, then takes you to Home. In Help it goes to the contents first, then closes Help. In the tutorial it asks <b>Skip the tour?</b> On Home it says <b>Press Back again to leave</b>, and your week is saved. On an event it just reminds you to pick one, so a stray Back never answers for you.</li>
      <li><b>Quick focus:</b> tap the focus icon on the left of <b>End Week</b> to pick from the six focuses right there, without scrolling.</li>
      <li><b>Week summary (screen readers):</b> after End Week a screen reader says one short sentence (Short, the default), or every number (Full).</li></ul>
      <p>On a tablet, a computer or a phone held sideways, Home shows two columns, with your job, home, ride and recent journal entries at the side.</p>` },
    { id:'install', g:'app', t:'📱 Installing and playing offline', sum:'Add it to your home screen and play offline.', w:'install offline app apk windows iphone android home screen version', b:`
      <p>The Burg is a web app you can install. On iPhone, open it in Safari, tap Share, then <b>Add to Home Screen</b>. On Android, open it in Chrome and tap <b>Install app</b> (or ⋮ → Add to Home screen). After the first visit it works offline. After you've played a couple of months, Home may offer an <b>Install</b> button where your browser supports it; <b>Not now</b> hides it for two weeks.</p>
      <p><b>When the browser may not keep your lives</b>, the title screen says so. In a private window, back up before you close it. In a Safari tab on iPhone, Safari can wipe a site after 7 days away, so add the game to your Home Screen. If the browser wiped your lives, load a backup. On iPhone the Home Screen app keeps its own lives, not Safari's. To bring them, copy a backup code in Safari and paste it in the app.</p>
      <p>The game downloads itself once and then opens from your device, with no download at all on a normal launch. A new version is fetched in the background when there is one.</p>
      <p>There's also an <b>Android app (APK)</b> and a <b>Windows installer</b> on the game's GitHub releases page: github.com/krazow/The-Burg/releases.</p>
      <p><b>Updates:</b> a new version downloads in the background. When it's ready, a <b>🔄 Update</b> button shows on Home (and the title screen). Tap it between weeks to refresh; until then the game keeps running the version you started with.</p>
      <p>Version ${APP_VERSION}.</p>` },
    { id:'device', g:'app', t:'🔒 What this game keeps on your device', sum:'What is kept here, nothing sent anywhere, and erasing it.', w:'privacy data storage erase delete everything kept', b:deviceHTML() }
  ];
}
function guideHTML(){
  const all = guideSections();
  const secHTML = s => `<details class="gsec" id="g-${s.id}" name="gsec" data-words="${esc(s.w || '')}"><summary><span class="gst">${s.t}</span><span class="gsum">${s.sum}</span></summary><div class="gbody">${s.b}</div></details>`;
  return `<div class="guide" id="guide">
    <h2 class="gt">📖 The whole guide</h2>
    <nav class="toc" aria-label="Guide contents">${HELP_GROUPS.map(([g, t]) => `<button type="button" data-helpgrp="${g}">${t}</button>`).join('')}</nav>
    ${HELP_GROUPS.map(([g, t]) => `<h3 class="ggrp" id="gg-${g}" tabindex="-1">${t}</h3>${all.filter(s => s.g === g).map(secHTML).join('')}`).join('')}
  </div>`;
}
// i7-a08: the question cards; Show me needs a life in play
function questionsHTML(){
  const live = HELP_FROM === 'game' && S && !S.over && !S.practice && !TUT;
  return `<div class="qcards"><h2 class="gt">❔ How do I…?</h2>
    ${QUESTIONS.map((x, i) => `<details class="qcard" name="helpq"><summary>${x.q}</summary><p>${x.a()}</p>
      <div class="slotbtns">${live ? `<button type="button" class="sm" data-showme="${i}">👀 Show me</button>` : ''}<button type="button" class="sm alt" data-helpsec="${x.sec}">Read more →</button></div></details>`).join('')}
    <button type="button" class="btn ghost" data-helpgo="guide">📖 Read the whole guide</button></div>`;
}
// open one section (and only that one), scroll to it, and put focus on its heading
function helpGo(id){
  id = HELP_ALIAS[id] || id;
  const v = $('#helpview');
  if (id === 'guide') { const g = $('#guide'); if (g) g.scrollIntoView({ block: 'start' }); const f = v.querySelector('.toc button'); if (f) f.focus({ preventScroll: true }); return true; }
  const d = document.getElementById('g-' + id); if (!d) return false;
  helpSearch('');
  v.querySelectorAll('details.gsec[open]').forEach(x => { if (x !== d) x.open = false; });
  d.open = true;
  d.scrollIntoView({ block: 'start' });
  d.querySelector('summary').focus({ preventScroll: true });
  return true;
}
// kept for older links (the contents used to call it)
function helpJump(id){ helpGo(id); }
/* ---- i44-b17 / i68-b30: search the guide as you type; works offline, on the rendered text ---- */
let HELP_IDX = null;
function helpIndex(){
  if (HELP_IDX) return HELP_IDX;
  let n = 0;
  HELP_IDX = [...document.querySelectorAll('#helpview details.gsec')].map(d => ({
    id: d.id.slice(2), t: d.querySelector('.gst').textContent, words: (d.dataset.words || '').toLowerCase(),
    blocks: [...d.querySelectorAll('.gbody > p, .gbody li, .gbody tr')].filter(el => !el.querySelector('th') && !el.querySelector('li')).map(el => {
      const c = el.cloneNode(true); c.querySelectorAll('.sr-only, .termdef, button.helplink').forEach(x => x.remove());
      el.dataset.hb = ++n;
      const text = c.textContent.replace(/\s+/g, ' ').trim();
      return { n, text, low: text.toLowerCase() };
    }).filter(b => b.text)
  }));
  return HELP_IDX;
}
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function hiLite(text, terms){
  const re = new RegExp(`(${terms.map(reEsc).join('|')})`, 'ig');
  return text.split(re).map((p, i) => i % 2 ? `<mark>${esc(p)}</mark>` : esc(p)).join('');
}
function snippet(text, terms){
  if (text.length <= 200) return text;
  const at = Math.min(...terms.map(t => { const i = text.toLowerCase().indexOf(t); return i < 0 ? Infinity : i; }));
  const from = at === Infinity ? 0 : Math.max(0, at - 70);
  return (from ? '…' : '') + text.slice(from, from + 200).trim() + '…';
}
let HELP_SAY = null;
function helpSearch(q){
  const v = $('#helpview'), box = $('#helpq'), res = $('#helpres'); if (!v || !res) return;
  if (box && box.value !== q) box.value = q;
  const terms = q.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  v.querySelector('.helpbody').classList.toggle('searching', terms.length > 0);
  if (!terms.length) { res.innerHTML = ''; return; }
  let hits = 0;
  const out = helpIndex().map(s => {
    const bl = s.blocks.filter(b => terms.every(t => b.low.includes(t)));
    const byWord = !bl.length && terms.every(t => s.words.includes(t) || s.t.toLowerCase().includes(t));
    if (!bl.length && !byWord) return '';
    hits += bl.length || 1;
    return `<h3>${esc(s.t)}</h3>${bl.slice(0, 6).map(b => `<button type="button" class="hres" data-hjump="${b.n}">${hiLite(snippet(b.text, terms), terms)}</button>`).join('')}
      ${bl.length > 6 ? `<p class="muted">and ${bl.length - 6} more in this part</p>` : ''}${byWord ? `<button type="button" class="hres" data-helpsec="${s.id}">Open ${esc(s.t)} →</button>` : ''}`;
  }).join('');
  res.innerHTML = out || `<p class="muted">Nothing in the guide matches “${esc(q.trim())}”. Try a shorter word.</p>`;
  clearTimeout(HELP_SAY); HELP_SAY = setTimeout(() => announce(hits ? `${hits} match${hits === 1 ? '' : 'es'} in the guide` : 'No matches in the guide'), 500);
}
function helpJumpTo(n){
  const el = document.querySelector(`#helpview [data-hb="${n}"]`); if (!el) return;
  helpSearch('');
  const d = el.closest('details.gsec');
  $('#helpview').querySelectorAll('details.gsec[open]').forEach(x => { if (x !== d) x.open = false; });
  d.open = true;
  el.scrollIntoView({ block: 'center' });
  el.classList.add('hflash'); setTimeout(() => el.classList.remove('hflash'), 2400);
  el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
}
// i44-b20: only the section you open stays open (for browsers without <details name>)
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.open || !d.matches || !d.matches('#helpview details[name]')) return;
  document.querySelectorAll(`#helpview details[name="${d.getAttribute('name')}"][open]`).forEach(x => { if (x !== d) x.open = false; });
}, true);
// Help's own buttons, and "More in Help →" links anywhere in the game (i44-b11)
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-helpsec], [data-helpgrp], [data-hjump], [data-helpgo], [data-helptop], [data-showme]'); if (!t) return;
  const inHelp = !!t.closest('#helpview');
  if (t.dataset.helpsec) { e.preventDefault(); return inHelp ? helpGo(t.dataset.helpsec) : showHelp(t.dataset.helpsec); }
  if (!inHelp) return;
  if (t.dataset.helpgrp) { const h = document.getElementById('gg-' + t.dataset.helpgrp); if (h) { h.scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); } }
  else if (t.dataset.hjump) helpJumpTo(t.dataset.hjump);
  else if (t.dataset.helpgo) helpGo(t.dataset.helpgo);
  else if (t.dataset.helptop != null) { helpSearch(''); $('#helpview').scrollTo({ top: 0, behavior: calmMotion() ? 'auto' : 'smooth' }); const q = $('#helpq'); if (q) q.focus({ preventScroll: true }); }
  else if (t.dataset.showme) showMe(+t.dataset.showme);
});
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
  $('#no').onclick = () => { closeSheet(); showHelp('device'); };
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
function showHelp(sec){
  if (typeof sec !== 'string') sec = null;           // also used straight as a click handler
  // i54-a04/a07: remember what to go back to; Help opened from a sheet (the Menu) goes back to what opened that sheet
  if (!lastHelpFocus) { const a = document.activeElement; lastHelpFocus = a && a.closest && a.closest('#sheet') ? lastFocus : opener(a); }
  lastFocus = null;
  closeSheet(); $('#toast').classList.add('hidden');
  HELP_FROM = S && !S.over ? 'game' : 'title';
  HELP_IDX = null;
  const v = $('#helpview');
  v.innerHTML = `<div class="helphead"><h1>❓ Help</h1><button class="sm alt" id="helpclose" aria-label="Close help">✕ Close</button></div>
    <div class="helpbody">
      <div class="helpsearch"><label for="helpq" class="sr-only">Search the guide</label><input type="search" id="helpq" placeholder="🔍 Search: gas, carpool, retire…" autocomplete="off" enterkeyhint="search"></div>
      <div id="helpres" class="helpres" aria-label="Search results"></div>
      ${on('help.tutorial') ? `<div class="card tutcard"><h3>🎮 Gameplay tutorial</h3>
        <p>Play a short <b>practice life</b>, about 4 minutes: jobs, your weekly focus, skips and plans, how the Life Score adds up, Out and about, trips, insurance, the money outlook, the maps and Settings. A pulsing ring shows exactly what to tap, and each step waits for your tap. ${HELP_FROM === 'game' ? 'Your current life is saved first and comes right back afterward.' : 'Nothing is saved.'}</p>
        <button class="btn primary" id="tutstart">Start the tutorial</button></div>` : ''}
      ${comingUpCard()}
      ${questionsHTML()}
      ${guideHTML()}
    </div>
    <div class="helpfoot"><button type="button" class="sm alt" data-helptop>☰ Contents</button><button type="button" class="sm" id="helpclose2">✕ Close</button></div>`;
  v.classList.remove('hidden'); v.scrollTop = 0;
  const went = sec && helpGo(sec);
  if (!went) setTimeout(() => $('#helpclose').focus({ preventScroll: true }), 30);
  $('#helpclose').onclick = closeHelp; $('#helpclose2').onclick = closeHelp;
  if ($('#tutstart')) $('#tutstart').onclick = startTutorial;
  $('#helpq').oninput = e => helpSearch(e.target.value);
  comingUpWire();
  if ($('#eraseall')) $('#eraseall').onclick = eraseSheet;
  histSync();
}
let lastHelpFocus = null;
// i59-a02: Back in Help goes to the contents first (from inside a section), then closes Help
function helpBack(){
  const v = $('#helpview');
  if (v.scrollTop > 160) { v.scrollTo({ top: 0 }); const t = v.querySelector('.toc button'); if (t) t.focus({ preventScroll: true }); announce('Help contents'); return; }
  closeHelp();
}
function closeHelp(){
  const wasOpen = !$('#helpview').classList.contains('hidden');
  $('#helpview').classList.add('hidden');
  const f = lastHelpFocus; lastHelpFocus = null;
  if (wasOpen && !TUT && !SHOWME) setTimeout(() => refocus(f), 30);
  histSync();
}
/* ---- i7-a08: Show me: go to the tab and ring the spot, using the tutorial's dimmer and bubble ---- */
let SHOWME = false;
function showMe(i){
  const q = QUESTIONS[i]; if (!q || !S || S.over) return;
  SHOWME = true; closeHelp(); closeSheet(); SHOWME = false;
  tab = q.tab; MAPSIDE = null; MAPSEL = null; render(); window.scrollTo(0, 0);
  const el = q.sel.map(s => document.querySelector(s)).find(Boolean);
  if (!el) return;
  if (!el.closest('.endbar, .weekstrip, nav')) el.scrollIntoView({ block: 'center' });
  if (!$('#coach')) document.body.insertAdjacentHTML('beforeend', '<div id="coach" class="hidden"></div>');
  const c = $('#coach'), r = el.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
  const box = { x: r.left - pad, y: r.top - pad, w: r.width + pad*2, h: r.height + pad*2 };
  c.innerHTML = coachDims(box, vw, vh) + `<div class="cring" style="left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px"></div>
    <div class="cbubble" role="dialog" aria-live="polite" style="visibility:hidden"><div class="cstep">${q.q}</div><div class="ctext">${q.a()}</div>
    <div class="cbtns"><button class="sm" id="cnext">Got it</button></div></div>`;
  c.classList.remove('hidden');
  placeBubble(c.querySelector('.cbubble'), box, vw, vh, false);
  announce(`${q.q} ${q.a()}`);
  const done = () => { hideCoach(); if (el.isConnected && el.focus) el.focus({ preventScroll: true }); };
  $('#cnext').onclick = e => { e.stopPropagation(); done(); };
  c.querySelectorAll('.cdim').forEach(d => d.onclick = done);
  setTimeout(() => { const b = $('#cnext'); if (b) b.focus({ preventScroll: true }); }, 60);
}
// the four dark panels around a highlighted box (the whole screen when there's no box)
const coachDims = (box, vw, vh) => (box ? [
    [0, 0, vw, Math.max(0, box.y)], [0, box.y + box.h, vw, Math.max(0, vh - box.y - box.h)],
    [0, box.y, Math.max(0, box.x), box.h], [box.x + box.w, box.y, Math.max(0, vw - box.x - box.w), box.h]]
  : [[0, 0, vw, vh]]).map(([x,y,w,h]) => `<div class="cdim" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`).join('');

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
  if (!on('help.tutorial')) { if (typeof after === 'function') after(); return; }   // to-do 2 D3: no tutorial: go straight on
  closeHelp(); closeSheet();
  if (S && !S.over && !S.practice) save();
  TUT = { i: -1, skipped: [], prev: { S: S && !S.over ? clone(S) : null, tab, prefs: clone(prefs()), jobCity, jobOK, undo: LIFE_UNDO, after: typeof after === 'function' ? after : null } };
  LIFE_UNDO = [];
  setPref('mapView', false); jobCity = 'all'; jobOK = false;
  newGame('Practice', 'half', 0, { practice: true });
  S.diff = 'hard';                                 // difficulty: the tour shows every feature (on Normal's numbers) until each step gets its own tier
  if (!$('#coach')) document.body.insertAdjacentHTML('beforeend', '<div id="coach" class="hidden"></div>');
  tutNext();
}
function tutNext(){
  if (!TUT) return;
  TUT.i++;
  const st = tsteps()[TUT.i];
  if (!st) return endTutorial(true);
  if (st.before) st.before();
  TUT.tries = 0;
  setTimeout(drawCoach, 380);                       // let sheets slide in and screens redraw
}
function drawCoach(){
  if (!TUT) return;
  const st = tsteps()[TUT.i], c = $('#coach'), N = tsteps().length;
  $('#toast').classList.add('hidden');
  const el = st.sel ? document.querySelector(st.sel) : null;
  if (st.sel && !el) { if (++TUT.tries < 12) return setTimeout(drawCoach, 150); TUT.skipped.push(TUT.i); return tutNext(); }   // skip a step whose target never appeared
  if (el && el.scrollIntoView && !el.closest('.endbar, .weekstrip, nav, .sheet')) el.scrollIntoView({ block: 'center' });
  else if (el && el.scrollIntoView && el.closest('.sheet')) el.scrollIntoView({ block: 'nearest' });   // a long sheet: bring its button into view
  const r = el ? el.getBoundingClientRect() : null, pad = 6;
  const box = r ? { x: r.left - pad, y: r.top - pad, w: r.width + pad*2, h: r.height + pad*2 } : null;
  const vw = innerWidth, vh = innerHeight;
  c.innerHTML = coachDims(box, vw, vh) +
    (box ? `<div class="cring${st.tap ? ' tap' : ''}" style="left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px"></div>${st.tap ? `<div class="cfinger" style="left:${box.x + box.w/2}px;top:${box.y + box.h/2}px">👆</div>` : ''}` : '') +
    `<div class="cbubble" role="dialog" aria-live="polite" style="${box ? 'visibility:hidden' : 'top:50%;transform:translate(-50%,-50%)'}">
      <div class="cstep">${TUT.mini ? '👀 Show me how · ' : ''}Step ${TUT.i + 1} of ${N}</div>
      <div class="ctext">${st.text}</div>
      <div class="cbtns">${st.tap ? '<span class="chint">👆 Tap the highlighted spot</span>' : `<button class="sm" id="cnext">${st.done ? 'Finish' : 'Next'}</button>`}
        ${st.done ? '' : `<button class="sm alt" id="cskip">${TUT.mini ? 'Close' : 'Skip tutorial'}</button>`}</div></div>`;
  c.classList.remove('hidden');
  if (box) placeBubble(c.querySelector('.cbubble'), box, vw, vh, !!st.tap);
  announce(`${TUT.mini ? 'Show me how' : 'Tutorial'} step ${TUT.i + 1} of ${N}. ${c.querySelector('.ctext').textContent}`);
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
// i59-a02: Back during the tutorial asks before ending it; a second Back says yes
function askSkipTour(){
  const c = $('#coach'), b = c && !c.classList.contains('hidden') ? c.querySelector('.cbtns') : null;
  if (!b) return;
  if ($('#cskipyes')) return endTutorial(false);
  b.innerHTML = '<span class="chint">Skip the tour?</span><button class="sm" id="cskipyes">Skip it</button><button class="sm alt" id="cskipno">Keep going</button>';
  $('#cskipyes').onclick = e => { e.stopPropagation(); endTutorial(false); };
  $('#cskipno').onclick = e => { e.stopPropagation(); drawCoach(); };
  $('#cskipno').focus({ preventScroll: true }); announce('Skip the tour?');
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
  const st = tsteps()[TUT.i];
  if (st && st.tap && st.sel && e.target.closest && e.target.closest(st.sel)) { hideCoach(); setTimeout(tutNext, 60); }
}, true);
addEventListener('resize', () => { if (TUT && !$('#coach').classList.contains('hidden')) drawCoach(); });
function endTutorial(done){
  const prev = TUT && TUT.prev; if (TUT && !TUT.mini) LAST_TUT_SKIPPED = TUT.skipped; TUT = null; hideCoach(); closeSheet();
  if (!prev) return;
  if (prev.mini) { tab = prev.tab || 'home'; render(); window.scrollTo(0,0); return; }   // i31-b17: a Show me tour changed nothing but the tab
  store.set(PREF_KEY, prev.prefs); applyPrefs(); jobCity = prev.jobCity; jobOK = prev.jobOK; LIFE_UNDO = prev.undo || [];
  S = prev.S; tab = prev.tab || 'home'; MAPSIDE = null; MAPSEL = null;
  if (S) { render(); window.scrollTo(0,0); } else { renderTitle(); if (prev.after) { prev.after(); return; } }
  toast(done ? '🎉 Tutorial finished' : 'Tutorial closed');
}

/* ---------- 👀 'Show me how' (i31-b16/b17): short tours of one system, run on your real life ---------- */
// A few rings with Next, no taps needed: nothing is bought, saved or played, and you come back to the tab you were on.
const tsteps = () => (TUT && TUT.steps) || TSTEPS;
const MINI_TOURS = {
  study: [
    { tab:'home', sel:'.fbtn[data-f="study"]', text:'📚 <b>Take classes</b> is a weekly focus. Each week of classes counts toward a certificate or a diploma. Tuition is less with the Washington College Grant when your pay is low.' },
    { tab:'jobs', sel:'[data-locked]', text:'🔒 jobs need more schooling, a certificate or a program. Tap a locked job any time to see what it takes.' },
    { tab:'life', sel:'#educard', text:'On the <b>Life</b> tab, pick a program for more pay at jobs that match. Or sign up for a short certificate.' }],
  out: [
    { tab:'home', sel:'#outbtn', text:() => `🛍️ <b>Out and about:</b> up to ${OUT_MAX} quick visits a week to places in town, on top of your focus. One per place a week; going back within ${OUT_REPEAT} weeks is half as special.` }],
  goals: [
    { tab:'life', sel:'#goalscard', text:() => `🎯 <b>Life goals:</b> pin up to ${GOAL_MAX} badges. Each one you reach after pinning it adds ${GOAL_POINTS} points to your Life Score.` }],
  k401: [
    { tab:'life', sel:'#k401card', text:'🏦 Your <b>401(k)</b> saves part of each paycheck before taxes. It grows about 6% a year.' },
    { tab:'life', sel:'[data-k401="1"]', text:'At <b>5%</b> or more your employer adds 3% on top: free money. You can change it any time.' }],
  hustle: [
    { tab:'home', sel:'.fbtn[data-f="hustle"]', text:'🔧 <b>Side hustle</b> is a weekly focus: weekend gigs that change with the seasons, and pay more as you get good at them.' },
    { tab:'home', sel:'.fdesc', text:'Gigs cost a little happiness and health, so mix them with Rest or Get outside. Three weeks in four wears you down.' }],
  plan: [
    { tab:'home', sel:'#planbtn', text:() => `🗓 <b>Plan</b> sets up to ${PLAN_MAX} focuses that take turns, one a week. Picking a focus by hand pauses the plan for that week only.` }],
  score: [
    { tab:'home', sel:'#scorenow', text:'🏆 Your <b>Life Score so far</b>: what you\'d get if the game ended today. Tap it to see the parts and your weakest one.' }],
  trip: [
    { tab:'home', sel:'#tripchip', text:() => `🚗 <b>Trips:</b> pick a town and up to ${TRIP_MAX} stops. The trip happens when you end the week. A stock-up run makes groceries cheaper for a while.` }],
  skills: [
    { tab:'life', sel:'#skillscard', text:'🧰 <b>Skills</b> grow as you practice: cooking on Rest weeks, people skills in town, handy work on side hustles. Each level saves money or opens a choice.' }],
  biz: [
    { tab:'life', sel:'#bizcard', text:'🏪 <b>Your own business:</b> one at a time. It earns (or loses) a little every week, and you can sell it later for part of what you paid.' }]
};
function miniTour(id){
  const steps = MINI_TOURS[id]; if (!steps || !S || S.over || TUT) return;
  closeHelp(); closeSheet();
  if (!$('#coach')) document.body.insertAdjacentHTML('beforeend', '<div id="coach" class="hidden"></div>');
  TUT = { i: -1, skipped: [], mini: id, prev: { mini: true, tab },
    steps: steps.map((st, i) => ({ sel: st.sel, text: typeof st.text === 'function' ? st.text() : st.text, done: i === steps.length - 1 ? 1 : 0,
      before: () => { if (st.tab && tab !== st.tab) { tab = st.tab; render(); window.scrollTo(0,0); } } })) };
  tutNext();
}
// i31-b18/b19/b22: in Help, the next two systems coming up (and by when at the latest), 'I know this one', and the tours
function comingUpCard(){
  if (!S || S.over || S.practice) return '';
  const soon = UNLOCKS.filter(u => !isOpen(u.id)), by = u => unlockBy(u) ?? 1e9;
  const next = soon.slice().sort((a, b) => by(a) - by(b)).slice(0, 2), tours = UNLOCKS.filter(u => isOpen(u.id) && MINI_TOURS[u.id]);
  if (!next.length && !tours.length) return '';
  return `<div class="card" id="comingup"><h3>🔓 Your life so far</h3>
    ${next.length ? `<p class="muted" style="margin:4px 0">Coming up in your life:</p>${next.map(u => `<div class="kv"><span>${u.ic} ${u.label}<br><small class="muted">Opens ${unlockWhen(u)}</small></span><button class="sm alt" data-early="${u.id}" aria-label="I know this one: open ${u.label} now">I know this one</button></div>`).join('')}
      <button class="sm alt" id="openall">Open everything now</button>` : ''}
    ${tours.length ? `<p class="muted" style="margin:8px 0 4px">👀 Show me how:</p><div class="chips">${tours.map(u => `<button class="chip" data-tour="${u.id}">${u.ic} ${u.label}</button>`).join('')}</div>` : ''}</div>`;
}
function comingUpWire(){
  const redo = msg => { save(); render(); const c = $('#comingup'); if (c) { c.outerHTML = comingUpCard(); comingUpWire(); } announce(msg); const f = $('#comingup button'); if (f) f.focus({ preventScroll: true }); };
  document.querySelectorAll('#comingup [data-early]').forEach(b => b.onclick = () => { const u = UNLOCK[b.dataset.early]; openSystem(u.id, { quiet:true, how:'early' }); redo(`${u.label} is open.`); });
  if ($('#openall')) $('#openall').onclick = () => { UNLOCKS.forEach(u => openSystem(u.id, { quiet:true, how:'early' })); redo('Everything is open.'); };
  document.querySelectorAll('#comingup [data-tour]').forEach(b => b.onclick = () => miniTour(b.dataset.tour));
}
