// The Burg: starts.js (new starts, inclusion and look; loads after weather.js and shares the one global scope)
/* ============================================================
   🌱 NEW STARTS, INCLUSION AND LOOK (wave 1)
   i17-a01 graduation night · i17-a02 three doors on day one · i17-a03 the opening weeks' own events
   i17-a04 staying with family · i17-a14 friends leave in August · i17-a20 the FAFSA
   i7-a20 pronouns · i7-a21 living with a disability · i7-a27 help you can apply for
   i6-b01 a drawn portrait · i6-b02 your house on Home · i6-b05 Main Street changes as you play
   (i6-b03 the title scene's time of day and i6-b11 season accent colors are in ui.js and index.html)
   ============================================================ */
// a new life's fields for this file (old saves get them from blankLife through migrate: pronouns 'they', no disability)
const START_STATE = () => ({ pron:'they', partnerName:null, partnerPron:'they', face:{ skin:2, hair:'short', hc:1, glasses:false },
  disability:null, startAge:null, famAt:null, gradNight:null, doorsDone:false, sentOff:false, drifted:false, aid:{}, fafsa:null, fafsaNote:null });

/* ---------- i7-a20: the person you date gets a name and pronouns (no dice used, so the rolls stay put) ---------- */
const PARTNER_NAMES = ['Sam', 'Jordan', 'Riley', 'Casey', 'Alex', 'Morgan', 'Jesse', 'Taylor', 'Avery', 'Drew', 'Jamie', 'Robin', 'Quinn', 'Reese'];
const hashStr = t => { let h = 2166136261; for (const c of String(t)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
function meetPartner(){
  if (!S) return;
  if (!S.partner) { if (S.partnerName) S.partnerName = null; return; }
  if (S.partnerName) return;
  const h = hashStr(`${S.lid}:${S.turn}`);
  S.partnerName = PARTNER_NAMES[h % PARTNER_NAMES.length]; S.partnerPron = ['she', 'he', 'they'][(h >>> 8) % 3];
}
const partnerWord = (capital = false) => S && S.partner && S.partnerName ? S.partnerName : capital ? 'Your partner' : 'your partner';
const partnerP = () => pron(S && S.partnerPron);
// i7-a20: one line for the end of a life, in your pronouns
function pronLine(){
  const p = pron(), yrs = Math.max(0, Math.round((S.turn || 0) / 52)), pp = partnerP();
  const time = yrs >= 2 ? `${yrs} years` : (S.turn || 0) >= 8 ? `${Math.round(S.turn / 4.33)} months` : 'a few weeks';
  return `${S.name} spent ${time} in the Burg. People on Main Street still talk about ${p.them} and the life ${p.they} built here.`
    + (S.partner && S.partnerName ? ` ${S.partnerName} was by ${p.their} side. Ask ${pp.them}, and ${pp.they}'ll tell you about ${S.name}'s best days.` : '');
}
// i7-a20: now and then The Touchet Tattler writes about you
function tattlerAboutYou(){
  const p = pron(), j = !S.retired && job();
  if (S.partner && S.partnerName && S.turn % 2) return `${S.name} and ${S.partnerName} were seen at the Friday game. ${Cap(p.they)} ${p.were} cheering the loudest.`;
  if (j) return `${S.name} works as ${/^[aeiou]/i.test(j.title) ? 'an' : 'a'} ${j.title.toLowerCase()} these days. ${Cap(p.they)} ${p.says} the coffee at the café is still the best in town.`;
  return `${S.name} is new in town. Say hello if you see ${p.them} on Main Street.`;
}

/* ---------- i7-a21: living with a disability ---------- */
// Each one: what it's like, which jobs need an accommodation (they all stay open), what the employer sets up, and any
// monthly cost (2027 dollars). Washington's job-training office (DVR) pays half of tuition, so costs come with support.
const DISABILITIES = {
  wheel:  { ic:'♿', name:'Wheelchair user', desc:'You use a manual wheelchair. Your room on Main Street is on the ground floor, and your pickup has hand controls.',
    needs: x => (x.wear || 0) >= 0.6, acc:'a ramp, a desk at the right height and a clear path to the break room',
    upkeep:35, bill:'Wheelchair tires and repairs' },
  deaf:   { ic:'🧏', name:'Deaf', desc:'You are Deaf and use ASL. Captions, texts and an interpreter for big meetings cover most days.',
    needs: x => ['insure', 'teller', 'loan', 'clerk', 'vaclerk', 'reporter', 'co', 'rail', 'airport', 'teacher', 'para', 'prof', 'nukeop', 'damop', 'trucker', 'lineman'].includes(x.id),
    acc:'an ASL interpreter for meetings and texts instead of radio calls', upkeep:0 },
  low:    { ic:'🔍', name:'Low vision', desc:'You have low vision. You read with a magnifier and a screen reader, and big print helps.',
    needs: x => ['trucker', 'harvtruck', 'mech', 'imaging', 'phleb', 'lineman', 'welder', 'electrician', 'rail', 'airport', 'forest', 'elevator'].includes(x.id),
    acc:'a big monitor, screen-reader software and good lighting', upkeep:20, bill:'Magnifier and screen-reader upkeep' },
  chronic:{ ic:'🌗', name:'Chronic illness', desc:'You live with a chronic illness. You have good days and bad days, and a doctor in Walla Walla helps you manage it.',
    needs: x => (x.stress || 0) >= 0.8 || (x.wear || 0) >= 0.9, acc:'a flexible schedule and a place to rest on bad days',
    upkeep:60, bill:'Doctor visits and medicine' }
};
const DVR_SHARE = 0.5, RAMP_COST = 1500;
const dis = () => S && S.disability && DISABILITIES[S.disability] ? DISABILITIES[S.disability] : null;
const needsAcc = x => { const d = dis(); return !!(d && d.needs(x)); };
// the job row's tag: fits, or needs an accommodation (every job stays open)
const accTag = x => !dis() ? '' : needsAcc(x) ? '🛠️ needs an accommodation' : '✓ fits';
// on a new job that needs one, the employer sets it up (the law asks them to, and it costs you nothing)
function accOnHire(id){ const x = jobById(id); if (x && needsAcc(x)) log(`${x.title}: your employer set up ${dis().acc}.`); }
// a wheelchair user moving somewhere new pays part of a ramp and a wider bathroom door
const moveExtra = k => S && S.disability === 'wheel' && !['room', 'family'].includes(k) ? cost(RAMP_COST) : 0;

/* ---------- i17-a20: the FAFSA ---------- */
// filed January to March, it covers classes until the next March 31; a Pell Grant pays half the tuition that's left
// after the Washington College Grant while your pay is under the line (monthly, 2027 dollars)
const PELL_LINE = 5000, PELL_SHARE = 0.5;
const fafsaOpen = () => curMonth() <= 2;
const fafsaOn = () => { if (S.fafsa == null) return false; const d = new Date(S.date), y = d.getFullYear(); return y === S.fafsa || (y === S.fafsa + 1 && d.getMonth() <= 2); };
const fafsaFiledThisYear = () => S.fafsa === new Date(S.date).getFullYear();
const payLine = () => { const j = S && !S.retired && S.jobId ? jobById(S.jobId) : null; return j ? payNow(j) / (S.wage || 1) : 0; };
const pellShare = () => S && fafsaOn() && payLine() < PELL_LINE ? PELL_SHARE : 0;
const dvrShare = () => S && dis() ? DVR_SHARE : 0;
// what's left to pay after the FAFSA's Pell Grant and DVR (1 = all of it)
const extraAid = () => (1 - pellShare()) * (1 - dvrShare());
const aidWords = () => [pellShare() ? 'a Pell Grant pays half' : '', dvrShare() ? 'DVR pays half' : ''].filter(Boolean).join(', and ');
function fileFafsa(){
  if (!fafsaOpen() || fafsaFiledThisYear()) return false;
  S.fafsa = new Date(S.date).getFullYear(); log(`Filed the FAFSA for the ${S.fafsa}–${String(S.fafsa + 1).slice(2)} school year.`, 'money');
  return true;
}
function fafsaCard(){
  if (S.edu >= 3 || S.retired || S.practice) return '';
  const y = new Date(S.date).getFullYear();
  const st = fafsaFiledThisYear() ? `✅ Filed for ${y}–${String(y + 1).slice(2)}.` : fafsaOn() ? `✅ Filed for ${S.fafsa}–${String(S.fafsa + 1).slice(2)}, good until March 31.` : '';
  const pell = payLine() < PELL_LINE ? `While your pay is under ${fmtc(PELL_LINE)} a month, a Pell Grant pays half of your tuition.` : `Your pay is over ${fmtc(PELL_LINE)} a month, so a Pell Grant won't help right now.`;
  return `<div class="fafsa" id="fafsa"><p style="margin:8px 0 4px"><b>📝 Financial aid (FAFSA)</b> <small class="muted">${pell} File each year from January to March.</small></p>
    ${st ? `<p class="muted" style="margin:0">${st}</p>` : ''}
    ${fafsaOpen() && !fafsaFiledThisYear() ? '<button class="sm" id="fafsabtn">File the FAFSA (one tap)</button>' : !st ? `<p class="muted" style="margin:0">Opens again in January.</p>` : ''}</div>`;
}
function fafsaWire(){ if ($('#fafsabtn')) $('#fafsabtn').onclick = () => { if (fileFafsa()) { save(); render(); toast('📝 FAFSA filed'); announce('FAFSA filed. It covers your classes until next March.'); } }; }

/* ---------- i7-a27: help you can apply for ---------- */
// each one checks pay (household, monthly, 2027 dollars) and cash before it pays out, and stops as you recover
const AID_LINE = 3300, AID_CASH = 4000, AID_SHOW = 1000;
const BASIC_FOOD = 290, BASIC_FOOD_KID = 200, HEAT_HELP = 400, SCHOOL_MEAL = 70, FOOD_BOX = 45, BANK_WEEKS = 4;
const aidOK = () => householdPay() < AID_LINE && S.money < cost(AID_CASH);
const schoolKids = () => (S.kids || []).filter(b => kidAge(b) >= 5 && kidAge(b) < 18).length;
const heatSeason = () => [10, 11, 0, 1, 2].includes(curMonth());
const winterId = () => { const d = new Date(S.date); return d.getMonth() >= 10 ? d.getFullYear() : d.getFullYear() - 1; };
const aidActive = () => !!(S.aid && (S.aid.food || S.aid.meals));
const aidShow = () => !S.practice && (S.money < cost(AID_SHOW) || aidActive());
const AIDS = {
  food:  { ic:'🛒', name:'Basic Food', what:() => `Money for groceries on an EBT card: about ${wk(cost(BASIC_FOOD + BASIC_FOOD_KID * kidsAtHome()))}, while your pay is low.`,
    can:() => aidOK() && !S.aid.food, on:() => !!S.aid.food },
  heat:  { ic:'🔥', name:'Energy help for winter heat', what:() => `A one-time ${fmtc(HEAT_HELP)} toward this winter's heating bill (November to March).`,
    can:() => aidOK() && heatSeason() && S.aid.heat !== winterId(), on:() => S.aid.heat === winterId() },
  meals: { ic:'🍎', name:'Free school meals', what:() => `Breakfast and lunch at school for your kids: about ${wk(cost(SCHOOL_MEAL * Math.max(1, schoolKids())))} less on food.`,
    can:() => aidOK() && schoolKids() > 0 && !S.aid.meals, on:() => !!S.aid.meals },
  bank:  { ic:'🥫', name:'The food bank', what:() => `A box of groceries (about ${fmtc(FOOD_BOX)} worth), once every ${BANK_WEEKS} weeks. No forms.`,
    can:() => S.turn - (S.aid.bank ?? -99) >= BANK_WEEKS, on:() => S.turn - (S.aid.bank ?? -99) < BANK_WEEKS }
};
function applyAid(k){
  const a = AIDS[k]; if (!a || !a.can()) return false;
  if (k === 'food') { S.aid.food = true; log('Signed up for Basic Food. The EBT card came in the mail.', 'money'); }
  if (k === 'heat') { S.aid.heat = winterId(); S.money += cost(HEAT_HELP); log(`Energy help paid ${fmtc(HEAT_HELP)} toward the heating bill.`, 'money'); }
  if (k === 'meals') { S.aid.meals = true; log('The kids get free breakfast and lunch at school now.', 'money'); }
  if (k === 'bank') { S.aid.bank = S.turn; S.money += cost(FOOD_BOX); log('Picked up a box of groceries at the food bank.', 'money'); }
  return true;
}
function aidCard(){
  if (!aidShow()) return '';
  const rows = Object.entries(AIDS).filter(([k]) => k !== 'meals' || schoolKids() > 0 || S.aid.meals).map(([k, a]) => {
    const btn = a.on() ? `<span class="tag cur">${k === 'bank' ? 'Picked up' : k === 'heat' ? 'Paid' : 'Getting it'}</span>`
      : a.can() ? `<button class="sm" data-aid="${k}">${k === 'bank' ? 'Pick up a box' : 'Apply'}</button>` : '<span class="tag">Not right now</span>';
    return `<div class="kv job"><div><div class="t">${a.ic} ${a.name}</div><div class="s">${a.what()}</div></div>${btn}</div>`;
  }).join('');
  return `<div class="card" id="aidcard"><h3>🤝 Help you can get</h3>
    <p class="muted" style="margin:0 0 4px">These are here for weeks like this. Lots of people in town use them for a while. Each one takes one tap, and help stops on its own when your pay is back over ${fmtc(AID_LINE)} a month.</p>${rows}</div>`;
}
function aidWire(){
  document.querySelectorAll('[data-aid]').forEach(b => b.onclick = () => { const k = b.dataset.aid;
    if (applyAid(k)) { save(); render(); toast(`${AIDS[k].ic} ${AIDS[k].name}: done`); announce(`${AIDS[k].name}: done. Cash ${fmt(S.money)}.`); } });
}

/* ---------- each week (turn.js): aid, the family home, the disability's costs, the FAFSA reminder ---------- */
const FAM_SAG_AFTER = 52, FAM_CAP = 85, FAM_SAVE = 3000;
const famSaving = () => S.money >= cost(FAM_SAVE);
const famSchool = () => (S.recentF || []).includes('study') || !!S.certStudy;
function startsWeek(lines){
  meetPartner();
  const a = S.aid || (S.aid = {});
  if (a.food) { if (aidOK()) lines.push(['Basic Food (EBT card)', cost(BASIC_FOOD + BASIC_FOOD_KID * kidsAtHome()) * W, 'Groceries on your EBT card while your pay is low.']);
    else { a.food = false; log(`Basic Food ended: your pay or savings are back above the line. Nice work.`, 'money'); } }
  if (a.meals) { if (aidOK() && schoolKids() > 0) lines.push(['Free school meals', cost(SCHOOL_MEAL * schoolKids()) * W, 'Breakfast and lunch at school cost less at home.']);
    else { a.meals = false; log('Free school meals ended: your pay is back above the line.', 'money'); } }
  const d = dis(); if (d && d.upkeep) lines.push([d.bill, -cost(d.upkeep) * W]);
  { const dt = new Date(S.date), y = dt.getFullYear();
    if (dt.getMonth() === 0 && S.fafsaNote !== y && S.edu < 3 && !S.retired && !S.practice && age() < 60) { S.fafsaNote = y;
      log(`📝 The FAFSA is open until March 31. It takes one tap on the Life tab and can cut your tuition in half.`, 'money'); } }
}
// after the stats move: chores and a small house
function startsStats(why){
  if (S.home !== 'family') return;
  adj({ community:0.4 }); why.push('🏠 Chores and dinner with family: ▲ community.');
  if (S.turn - (S.famAt ?? 0) >= FAM_SAG_AFTER && !famSchool() && !famSaving()) { adj({ happy:-0.8 }); why.push('🏠 Your old room feels small after a year: ▼ happiness. Classes or saving to move out help.'); }
  if (S.happy > FAM_CAP) S.happy = FAM_CAP;
}

/* ---------- i17-a01: graduation night, i17-a02: three doors (Home, week one only) ---------- */
const GRAD_BG = ['fresh', 'farm', 'home', 'access'];
const gradShow = () => S.turn === 0 && S.gradNight == null && !S.practice && !S.scenario && GRAD_BG.includes(S.bg) && (S.startAge ?? 18) <= 18;
const GRAD = {
  river:  { ic:'🔥', name:'The river party', fx:() => ({ community:4, money:-cost(40) }), cost:40, words:'a bonfire by the Touchet with half your class',
    done:'You stayed up past midnight by the fire. Half the town knows your face now.' },
  dinner: { ic:'🍝', name:'Family dinner', fx:() => ({ happy:4 }), words:'dinner at home and a box of kitchen things for your own place',
    done:'Pot roast, a few happy tears and a box of pans, plates and a can opener.' },
  shift:  { ic:'🌙', name:'Pick up a night shift', fx:() => ({ money:cost(120), happy:-3 }), words:'a night shift at the gas station for some extra cash',
    done:'Quiet, cold and boring. But you start out with a little extra cash.' }
};
function gradCard(){
  if (!gradShow()) return '';
  return `<div class="card gradcard" id="gradcard"><h3>🎓 Graduation night</h3><p style="margin:0 0 6px">You walked across the stage at Waitsburg High today. How do you spend tonight?</p>
    <div class="gradbtns">${Object.entries(GRAD).map(([k, g]) => `<button class="btn ghost" data-grad="${k}">${g.ic} ${g.name}${k === 'river' ? ` (-${fmtc(g.cost)}, +community)` : k === 'dinner' ? ' (+happiness)' : ` (+${fmtc(120)}, -happiness)`}</button>`).join('')}</div>
    <button class="sm alt" data-grad="skip">Skip this</button></div>`;
}
function gradPick(k){
  const g = GRAD[k]; S.gradNight = k;
  if (g) { adj(g.fx()); log(`Graduation night: ${g.done}`, undefined, 1); }
  save(); render(); if (g) { toast(`${g.ic} ${g.name}`); announce(g.done); }
}
const doorsShow = () => S.turn === 0 && !S.doorsDone && !S.jobId && !S.practice && !S.retired;
function starterJob(){
  return JOBS.filter(x => x.edu === 0 && CITIES[x.city].miles <= 11 && jobInSeason(x) && !extraLock(x))
    .sort((a, b) => takeHome(b) - takeHome(a) || CITIES[a.city].miles - CITIES[b.city].miles)[0] || null;
}
function doorsCard(){
  if (!doorsShow()) return '';
  const j = starterJob(), h = HOMES[S.home];
  return `<div class="card" id="doors"><h3>🚪 Three ways to start</h3><p class="muted" style="margin:0 0 6px">Pick one, or look around the tabs on your own.</p>
    ${j ? `<div class="kv job"><div><div class="t">💼 A starter job: ${j.title}</div><div class="s">${CITIES[j.city].name}${CITIES[j.city].miles ? ` · ${CITIES[j.city].miles} mi` : ' · no commute'} · about ${fmt(takeHome(j))}/wk take-home · no diploma needed${dis() ? ` · ${accTag(j)}` : ''}</div></div>
      <button class="sm" data-apply="${j.id}" ${S.applied ? 'disabled' : ''}>Apply</button></div>` : ''}
    ${S.edu < 3 ? `<div class="kv job"><div><div class="t">📚 A program: ${SCHOOL[S.edu]}</div><div class="s">${STUDY_NEED[S.edu]} weeks of classes to a ${EDU[S.edu + 1].toLowerCase()} · ${tuitionWords()}</div></div>
      <button class="sm" data-door="study">Take classes</button></div>` : ''}
    <div class="kv job"><div><div class="t">🏡 A place: ${h.name}</div><div class="s">Rent ${wk(cost(h.cost))} now · other homes and prices are on the Life tab</div></div>
      <button class="sm alt" data-door="home">See homes</button></div>
    <button class="sm alt" data-door="skip">I'll look around</button></div>`;
}
function doorsWire(){
  document.querySelectorAll('[data-grad]').forEach(b => b.onclick = () => gradPick(b.dataset.grad));
  document.querySelectorAll('[data-door]').forEach(b => b.onclick = () => {
    const k = b.dataset.door;
    if (k === 'study') { if (canStudy()) { S.doorsDone = true; handFocus('study', true); } return; }
    if (k === 'home') { S.doorsDone = true; save(); goTo('life'); return; }
    S.doorsDone = true; save(); render(); announce('OK. The tabs below have jobs, school and homes.');
  });
}

/* ---------- i17-a03: the opening weeks run on their own small pool (each at most once a life) ---------- */
const START_WEEKS = 8, START_ODDS = 0.3;
function startEvent(month){
  if (S.turn >= START_WEEKS || S.retired) return null;
  if (!EVENTS.some(e => e.cat === 'start' && !S.evDone[e.title] && (!e.when || e.when(month)))) return null;
  return chance(START_ODDS * rule('evMult')) ? pickEvent(month, 'start') : null;   // the events rule (i19-b01) scales these too
}
const START_EVENTS = [
  { ic:'🥘', title:'A welcome casserole', cat:'start', start:1, once:1, w:3,
    text:'Marge from down the street knocks with a casserole and a list of who to call for what.',
    choices:() => [
      {label:'Ask her in for coffee', go:() => { adj({community:2, happy:1}); return 'An hour later you know the best plumber, the worst road and who makes the pies.'; }},
      {label:'Thank her at the door', go:() => { adj({happy:1}); return 'It was a very good casserole.'; }}]},
  { ic:'📇', title:'A library card', cat:'start', start:1, once:1, w:2,
    text:'The town library has free Wi-Fi and a quiet table. Its book club meets on Thursdays.',
    choices:() => [
      {label:'Get a card and join the book club', go:() => { adj({community:2, happy:-0.5}); return 'Seven people, one book and a lot of opinions. You\'ll be back.'; }},
      {label:'Just get the Wi-Fi password', go:() => { adj({happy:1}); return 'Fast Wi-Fi, a quiet table. Good enough.'; }}]},
  { ic:'🛋️', title:'A couch on the stairs', cat:'start', start:1, once:1, w:2,
    text:'Your neighbor is stuck halfway up the stairs with a couch.',
    choices:() => [
      {label:'Grab the other end', go:() => { adj({community:2, health:-1}); return 'Two pivots and one scraped knuckle later, it fit. They owe you one.'; }},
      {label:'Hold the door and cheer', go:() => { adj({community:1}); return 'You held the door. It took a while.'; }}]},
  { ic:'🍳', title:'Your first grocery run', cat:'start', start:1, once:1, w:2,
    text:'Standing in the store with a cart and no plan. Rice, beans, coffee... and that nice pan?',
    choices:() => [
      {label:'Keep it cheap', go:() => { adj({happy:0.5}); return 'Rice, beans and a big bag of coffee. You\'ll eat fine.'; }},
      {label:`Buy the nice pan too (-${fmtc(30)})`, go:() => { adj({money:-cost(30), happy:2}); return 'It is a very good pan.'; }}]}
];
/* ---------- i17-a14: friends leave in August, come home at Thanksgiving (year one, starts under 20) ---------- */
const youngStart = () => S.startAge != null && S.startAge < 20 && S.turn < 52;
const FRIEND_EVENTS = [
  { ic:'👋', title:'Friends head off', fixed:1, yr:1, once:1, w:1, when:m => m === 7 && youngStart(),
    text:'Half your class is packing up for college, the army or jobs in Seattle. There\'s a send-off at the river on Saturday.',
    choices:() => [
      {label:`Go to the send-off (-${fmtc(20)})`, go:() => { adj({money:-cost(20), community:3, happy:2}); S.sentOff = true; return 'Hugs, a cooler of pop and promises to text. You meant every one.'; }},
      {label:'Skip it', go:() => { S.drifted = true; return 'You meant to text them. You didn\'t, and the summer ended.'; }}]},
  { ic:'🦃', title:'Friends home for Thanksgiving', fixed:1, yr:1, once:1, w:1, when:m => m === 10 && new Date(S.date).getDate() >= 18 && youngStart() && !!S.evDone['Friends head off'],
    text:() => S.sentOff ? 'Your friends are home for Thanksgiving, and the first thing they do is find you.' : 'Your old friends are home for Thanksgiving. You see them across the store.',
    choices:() => [
      {label:S.sentOff ? 'Catch up over pie' : 'Wave hello', go:() => { if (S.sentOff) { adj({happy:4, community:1}); return 'Stories from college and the army, and your own from right here. Same old crew.'; } adj({happy:1}); return 'A wave, a "we should hang out" and a little awkward. It happens.'; }}]}
];
/* ---------- i7-a21: everyday events, good days and bad days (never pity and never a cure) ---------- */
const hasDis = k => S.disability === k;
const DIS_EVENTS = [
  { ic:'🌗', title:'A flare-up week', w:3, when:() => hasDis('chronic'),
    text:'Your illness is flaring this week. Everything takes twice the energy.',
    choices:() => [
      {label:'Rest and take it slow', go:() => { adj({health:3, happy:-1}); return 'Soup, naps and an early night every night. By Sunday you felt more like yourself.'; }},
      {label:`See your doctor in Walla Walla (-${fmtc(40)})`, go:() => { adj({money:-cost(40), health:4}); return 'A small change to your medicine, and the week got easier.'; }},
      {label:'Push through', go:() => { adj({health:-3, happy:1}); return 'You got it all done, and paid for it on the weekend.'; }}]},
  { ic:'☀️', title:'A good stretch', w:2, when:() => hasDis('chronic'),
    text:'Your medicine is working and you feel strong this month.',
    choices:() => [
      {label:'Head to the river with friends', go:() => { adj({happy:3, community:1}); return 'A whole afternoon on the Touchet. You\'ll remember this one.'; }},
      {label:'Get ahead on chores', go:() => { adj({happy:1, health:1}); return 'Laundry, dishes and the porch, all done. It feels good to be ahead.'; }}]},
  { ic:'🧏', title:'No interpreter at the meeting', cat:'work', w:2, when:() => hasDis('deaf') && working(),
    text:'It\'s a big work day with a long meeting. No one booked an ASL interpreter.',
    choices:() => [
      {label:'Ask your boss to book one', go:() => { adj({happy:1, community:1}); return 'They moved the meeting an hour and booked one. Next time it\'s on the list.'; }},
      {label:'Read the notes later', go:() => { adj({happy:-1}); return 'The notes left out half of it, but you caught up.'; }}]},
  { ic:'☕', title:'Deaf coffee night', w:2, when:() => hasDis('deaf'),
    text:'There\'s a Deaf coffee night in Walla Walla on Friday: ASL, coffee and people from all over the valley.',
    choices:() => [
      {label:`Go (-${fmtc(15)})`, go:() => { adj({money:-cost(15), happy:3, community:2}); return 'Three hours of easy talk. You left with new friends.'; }},
      {label:'Not this week', go:() => { adj({happy:0.5}); return 'Next month, for sure.'; }}]},
  { ic:'🚧', title:'The ramp is blocked', w:2, when:() => hasDis('wheel'),
    text:'Work on the post office steps has the ramp blocked.',
    choices:() => [
      {label:'Call city hall', go:() => { adj({community:2}); return 'A temporary ramp went in the next day. Parents with strollers thanked you too.'; }},
      {label:'Ask a neighbor to grab your mail', go:() => { adj({community:1, happy:-1}); return 'Your neighbor brought it by with a muffin.'; }}]},
  { ic:'🏀', title:'Wheelchair basketball', w:2, when:() => hasDis('wheel') && age() < 60,
    text:'A group in Walla Walla plays ball in wheelchairs on Tuesday nights. They need players.',
    choices:() => [
      {label:`Join them (-${fmtc(20)})`, go:() => { adj({money:-cost(20), health:3, happy:3}); return 'Fast, loud and a lot of fun. You\'re sore in a good way.'; }},
      {label:'Maybe later', go:() => { adj({happy:0.5}); return 'They said the door\'s always open.'; }}]},
  { ic:'📄', title:'A form in tiny print', w:2, when:() => hasDis('low'),
    text:'The county mailed a form in print too small for your magnifier.',
    choices:() => [
      {label:'Call and ask for large print', go:() => { adj({happy:1}); return 'A large-print copy came a week later, and they put a note on your file.'; }},
      {label:'Have a friend read it to you', go:() => { adj({community:1}); return 'Ten minutes on the phone, and it was done.'; }}]},
  { ic:'🎬', title:'Audio description night', w:2, when:() => hasDis('low'),
    text:'The movie house in Walla Walla has headsets that tell you what\'s on the screen.',
    choices:() => [
      {label:`Go (-${fmtc(15)})`, go:() => { adj({money:-cost(15), happy:3}); return 'Every scene, clear as day. Popcorn too.'; }},
      {label:'Wait for it to stream', go:() => { adj({happy:0.5}); return 'It\'ll be on in a month.'; }}]}
];
EVENTS.push(...START_EVENTS, ...FRIEND_EVENTS, ...DIS_EVENTS);
Object.assign(EVENT_PLACE, { 'A welcome casserole':['T','home'], 'A library card':['T','library'], 'A couch on the stairs':['T','home'], 'Your first grocery run':['T','mainst'],
  'Friends head off':['T','river'], 'Friends home for Thanksgiving':['T','school'], 'A flare-up week':['T','home'], 'A good stretch':['T','river'],
  'No interpreter at the meeting':'work', 'Deaf coffee night':['R','wallawalla'], 'The ramp is blocked':['T','mainst'], 'Wheelchair basketball':['R','wallawalla'],
  'A form in tiny print':['T','home'], 'Audio description night':['R','wallawalla'] });

/* ---------- i6-b01: a drawn portrait that ages with you (looks only) ---------- */
const SKINS = ['#f6d7bf', '#e8b98f', '#c98e62', '#9a643e', '#6b4329'];
const HAIRC = [['#2b2018', 'Black'], ['#5a3a22', 'Brown'], ['#8a3b1e', 'Auburn'], ['#d6b26a', 'Blond']];
const HAIRS = { short:'Short', long:'Long', curly:'Curly', bun:'Bun', none:'Shaved' };
const mixHex = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
const okFace = f => ({ skin: Number.isInteger(f && f.skin) && SKINS[f.skin] ? f.skin : 2, hair: f && HAIRS[f.hair] ? f.hair : 'short',
  hc: Number.isInteger(f && f.hc) && HAIRC[f.hc] ? f.hc : 1, glasses: !!(f && f.glasses) });
// shapes, so the same face draws as SVG (Home, the ending) and on the score card's canvas
function faceShapes(face, years = 18, mood = 60){
  const f = okFace(face), skin = SKINS[f.skin], gray = clamp((years - 40) / 35, 0, 1), hair = mixHex(HAIRC[f.hc][0], '#d9d6d0', gray);
  const brow = mixHex(HAIRC[f.hc][0], '#bdb8b0', gray), ink = '#3d2b1f', line = 'rgba(61,43,31,.45)', smile = clamp((mood - 45) / 12, -1.5, 3);
  const sh = [['circle', { cx:32, cy:32, r:31, fill:'#efe3c8' }], ['path', { d:'M8 64 C10 50 20 45 32 45 C44 45 54 50 56 64Z', fill:'#4a7340' }],
    ['rect', { x:27, y:38, w:10, h:9, fill:skin }]];
  if (f.hair === 'long') sh.push(['path', { d:'M17 28 C17 10 47 10 47 28 L48 50 L16 50Z', fill:hair }]);
  sh.push(['circle', { cx:19, cy:29, r:3, fill:skin }], ['circle', { cx:45, cy:29, r:3, fill:skin }], ['ellipse', { cx:32, cy:28, rx:13, ry:15, fill:skin }]);
  if (f.hair === 'short' || f.hair === 'long' || f.hair === 'bun') sh.push(['path', { d:'M19 25 C18 11 46 11 45 25 C41 18 25 17 19 25Z', fill:hair }]);
  if (f.hair === 'bun') sh.push(['circle', { cx:32, cy:9, r:5.5, fill:hair }]);
  if (f.hair === 'curly') for (const [x, y] of [[20, 21], [25, 15], [32, 13], [39, 15], [44, 21]]) sh.push(['circle', { cx:x, cy:y, r:6, fill:hair }]);
  sh.push(['path', { d:'M24 23.5 L29.5 23', stroke:brow, sw:1.8 }], ['path', { d:'M34.5 23 L40 23.5', stroke:brow, sw:1.8 }],
    ['circle', { cx:27, cy:28, r:1.6, fill:ink }], ['circle', { cx:37, cy:28, r:1.6, fill:ink }],
    ['path', { d:`M27.5 35 Q32 ${(35 + smile).toFixed(1)} 36.5 35`, stroke:'#7a3b2e', sw:1.4 }]);
  if (years >= 40) sh.push(['path', { d:'M41.5 27 l2.5 -1 M41.5 29 l2.5 1 M22.5 27 l-2.5 -1 M22.5 29 l-2.5 1', stroke:line, sw:0.8 }]);
  if (years >= 55) sh.push(['path', { d:'M26 18.5 Q32 17 38 18.5 M27 20.5 Q32 19.3 37 20.5', stroke:line, sw:0.8 }]);
  if (years >= 70) sh.push(['path', { d:'M24.5 32 q-1 2.5 0.5 4.5 M39.5 32 q1 2.5 -0.5 4.5', stroke:line, sw:0.8 }]);
  if (f.glasses) sh.push(['circle', { cx:27, cy:28, r:4, stroke:ink, sw:1.1 }], ['circle', { cx:37, cy:28, r:4, stroke:ink, sw:1.1 }], ['path', { d:'M31 28 L33 28', stroke:ink, sw:1.1 }]);
  return sh;
}
function faceSVG(face, years, mood, size = 56, label = ''){
  const at = o => `${o.fill ? `fill="${o.fill}"` : 'fill="none"'}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}" stroke-linecap="round"` : ''}`;
  const body = faceShapes(face, years, mood).map(([t, o]) => t === 'circle' ? `<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" ${at(o)}/>`
    : t === 'ellipse' ? `<ellipse cx="${o.cx}" cy="${o.cy}" rx="${o.rx}" ry="${o.ry}" ${at(o)}/>` : t === 'rect' ? `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" ${at(o)}/>` : `<path d="${o.d}" ${at(o)}/>`).join('');
  return `<svg class="face" viewBox="0 0 64 64" width="${size}" height="${size}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}><clipPath id="fc${size}"><circle cx="32" cy="32" r="31"/></clipPath><g clip-path="url(#fc${size})">${body}</g></svg>`;
}
const myFace = (size = 56, label = true) => faceSVG(S.face, age(), S.happy, size, label ? `A drawing of ${S.name} at ${age()}` : '');
// the score card draws the same shapes on its canvas
function faceCanvas(g, x, y, size){
  try {
    g.save(); g.translate(x, y); g.scale(size / 64, size / 64);
    g.beginPath(); g.arc(32, 32, 31, 0, Math.PI * 2); g.clip();
    for (const [t, o] of faceShapes(S.face, age(), S.happy)) {
      const p = t === 'path' ? new Path2D(o.d) : new Path2D();
      if (t === 'circle') p.arc(o.cx, o.cy, o.r, 0, Math.PI * 2); else if (t === 'ellipse') p.ellipse(o.cx, o.cy, o.rx, o.ry, 0, 0, Math.PI * 2); else if (t === 'rect') p.rect(o.x, o.y, o.w, o.h);
      if (o.fill) { g.fillStyle = o.fill; g.fill(p); }
      if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.sw || 1; g.lineCap = 'round'; g.stroke(p); }
    }
    g.restore();
  } catch (e) { try { g.restore(); } catch (e2) {} }
}
// the title screen's "Your look" picker (More options)
function lookPicker(face){
  const f = okFace(face), chip = (attr, v, on, inner, lbl) => `<button class="chip${on ? ' on' : ''}" data-${attr}="${v}" aria-pressed="${on}"${lbl ? ` aria-label="${lbl}"` : ''}>${inner}</button>`;
  return `<div class="lookrow"><div id="lookprev">${faceSVG(f, 18, 60, 64, 'Your look')}</div><div class="lookopts">
    <div class="bgs" role="group" aria-label="Skin tone">${SKINS.map((c, i) => chip('skin', i, f.skin === i, `<span class="swatch" style="background:${c}"></span>`, `Skin tone ${i + 1}`)).join('')}</div>
    <div class="bgs" role="group" aria-label="Hair">${Object.entries(HAIRS).map(([k, n]) => chip('hair', k, f.hair === k, n)).join('')}</div>
    <div class="bgs" role="group" aria-label="Hair color">${HAIRC.map(([c, n], i) => chip('hc', i, f.hc === i, `<span class="swatch" style="background:${c}"></span> ${n}`)).join('')}</div>
    <div class="bgs" role="group" aria-label="Glasses">${chip('glasses', 1, f.glasses, '👓 Glasses')}</div></div></div>`;
}
// i7-a21: the disability picker, shown under the background when you pick Living with a disability
function disPicker(cur){
  return `<div class="bgs" role="group" aria-label="Your disability" id="dispick">${Object.entries(DISABILITIES).map(([k, d]) =>
    `<button class="chip${cur === k ? ' on' : ''}" data-dis="${k}" aria-pressed="${cur === k}">${d.ic} ${d.name}</button>`).join('')}</div>
    <div class="muted bgdesc" id="disdesc">${DISABILITIES[cur].desc}</div>`;
}

/* ---------- i6-b02: your house on Home, drawn from what you own (looks only) ---------- */
function houseParts(){
  const own = !!HOMES[S.home].own, kids = Math.min(3, kidsAtHome()), fixed = S.home !== 'fixer' || !!(S.chains && S.chains.fixer && S.chains.fixer.step >= 2);
  return { porch: own && fixed, garden: own && (S.outWeeks || 0) >= 10, dog: !!S.dog, cat: !!S.cat, kids, biz: S.biz && BIZ[S.biz.type] ? S.biz.type : null,
    truck2: !!(S.biz && ['wheat', 'truck'].includes(S.biz.type)), partner: !!S.partner };
}
function houseWords(p = houseParts()){
  const bits = [p.porch ? 'a porch' : '', p.garden ? 'a garden' : '', p.dog ? 'a dog house' : '', p.cat ? 'a cat on the step' : '', p.kids ? `${p.kids === 1 ? 'a kid\'s bike' : `${p.kids} kids' bikes`}` : '',
    p.truck2 ? (p.biz === 'truck' ? 'the food truck' : 'a farm truck') : '', p.biz && !p.truck2 ? 'a sign for your business' : ''].filter(Boolean);
  return `${HOMES[S.home].name}${bits.length ? `, with ${bits.length > 1 ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1] : bits[0]}` : ''}`;
}
function houseArt(){
  const p = houseParts(), c = seasonColors(curMonth()), k = S.home;
  const win = (x, y, lit) => `<rect x="${x}" y="${y}" width="12" height="12" fill="${lit ? '#f4d58d' : '#cfe0ea'}" stroke="#6b4a2b" stroke-width="1"/>`;
  let s = `<rect width="320" height="120" rx="12" fill="${c.sky}"/><path d="M0 92 C80 84 160 96 320 88 V120 H0Z" fill="${c.fieldA}"/>`;
  if (k === 'room') s += `<rect x="112" y="26" width="96" height="66" fill="#9b2f1f"/><rect x="108" y="22" width="104" height="6" fill="#6f1f14"/>${win(124, 36, true)}${win(154, 36, false)}${win(184, 36, false)}
    <rect x="118" y="62" width="40" height="30" fill="#cfe0ea" stroke="#6b4a2b"/><rect x="166" y="64" width="14" height="28" fill="#6b4a2b"/><path d="M114 58 H206 L200 64 H120Z" fill="#e9c46a"/>`;
  else if (k === 'family') s += `<rect x="104" y="44" width="112" height="48" fill="#efe3c8"/><polygon points="98,46 160,14 222,46" fill="#6f1f14"/>${win(118, 54, true)}${win(144, 54, false)}${win(176, 54, true)}${win(196, 54, false)}${win(130, 26, true)}
    <rect x="156" y="70" width="14" height="22" fill="#6b4a2b"/>`;
  else if (k === 'farm') s += `<rect x="70" y="46" width="90" height="46" fill="#fbf6ea"/><polygon points="64,48 115,20 166,48" fill="#6f1f14"/>${win(82, 56, true)}${win(134, 56, false)}<rect x="108" y="68" width="14" height="24" fill="#6b4a2b"/>
    <rect x="172" y="50" width="52" height="42" fill="#9b2f1f"/><polygon points="168,52 198,30 228,52" fill="#6f1f14"/><rect x="190" y="68" width="16" height="24" fill="#fbf6ea"/><rect x="230" y="34" width="16" height="58" rx="8" fill="#c5ced4"/>`;
  else s += `<rect x="112" y="50" width="96" height="42" fill="${k === 'fixer' && !p.porch ? '#d8c9a8' : '#fbf6ea'}"/><polygon points="106,52 160,24 214,52" fill="#6f1f14"/>${win(124, 60, true)}${win(184, 60, false)}
    <rect x="153" y="68" width="14" height="24" fill="#6b4a2b"/>${k === 'fixer' && !p.porch ? '<path d="M184 60 l-4 14" stroke="#6b4a2b" stroke-width="2"/>' : ''}`;
  const hx = k === 'farm' ? 70 : 112;               // where the house's front starts
  if (p.porch) s += `<rect x="${hx}" y="86" width="${k === 'farm' ? 90 : 96}" height="6" fill="#a8692f"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${hx + 2 + i * (k === 'farm' ? 21 : 22)}" y="78" width="2" height="8" fill="#a8692f"/>`).join('')}`;
  if (p.garden) s += [0, 1, 2, 3].map(i => `<circle cx="${14 + i * 12}" cy="111" r="4" fill="#4a7340"/><circle cx="${20 + i * 12}" cy="115" r="3" fill="#e0a03a"/>`).join('');
  if (p.dog) s += `<rect x="${k === 'farm' ? 292 : 278}" y="80" width="22" height="14" fill="#a8692f"/><polygon points="${k === 'farm' ? 290 : 276},81 ${k === 'farm' ? 303 : 289},70 ${k === 'farm' ? 316 : 302},81" fill="#6f1f14"/><rect x="${k === 'farm' ? 299 : 285}" y="85" width="8" height="9" fill="#3d2b1f"/>`;
  if (p.cat) s += `<circle cx="${hx + 52}" cy="89" r="3" fill="#3d2b1f"/><circle cx="${hx + 55}" cy="86" r="2" fill="#3d2b1f"/>`;
  for (let i = 0; i < p.kids; i++) { const x = (k === 'farm' ? 10 : 62) + i * 16; s += `<circle cx="${x}" cy="102" r="4" fill="none" stroke="#3f7fae" stroke-width="1.5"/><circle cx="${x + 9}" cy="102" r="4" fill="none" stroke="#3f7fae" stroke-width="1.5"/><path d="M${x} 102 L${x + 4} 96 L${x + 9} 102" stroke="#9b2f1f" stroke-width="1.5" fill="none"/>`; }
  const ride = (x, col) => `<rect x="${x}" y="96" width="34" height="10" rx="2" fill="${col}"/><rect x="${x + 4}" y="88" width="14" height="9" rx="2" fill="${col}"/><circle cx="${x + 7}" cy="107" r="3.5" fill="#3d2b1f"/><circle cx="${x + 27}" cy="107" r="3.5" fill="#3d2b1f"/>`;
  s += ride(k === 'farm' ? 252 : 228, { beater:'#a8692f', sedan:'#3f7fae', truck:'#6f1f14' }[S.car] || '#a8692f');
  if (p.truck2) { const tx = k === 'farm' ? 10 : 12; s += p.biz === 'truck' ? `<rect x="${tx}" y="72" width="44" height="24" rx="3" fill="#fbf6ea" stroke="#9b2f1f" stroke-width="2"/><circle cx="${tx + 10}" cy="98" r="4" fill="#3d2b1f"/><circle cx="${tx + 34}" cy="98" r="4" fill="#3d2b1f"/>` : ride(tx, '#4a7340').replace(/y="96"/, 'y="88"').replace(/y="88" width="14"/, 'y="80" width="14"').replace(/cy="107"/g, 'cy="99"'); }
  if (p.biz && !p.truck2) s += `<rect x="${hx - 14}" y="68" width="2" height="26" fill="#6b4a2b"/><rect x="${hx - 24}" y="62" width="22" height="12" rx="2" fill="#e9c46a" stroke="#6b4a2b"/>`;
  if (p.partner) s += `<path d="M${hx + 17} ${k === 'room' ? 40 : k === 'family' ? 58 : 62} l2 -2 a1.4 1.4 0 0 1 2 2 l-4 4 l-4 -4 a1.4 1.4 0 0 1 2 -2Z" fill="#9b2f1f"/>`;   // a heart in your lit window
  return `<svg class="houseart" viewBox="0 0 320 120" role="img" aria-label="${esc('Your place: ' + houseWords(p))}">${s}</svg>`;
}

/* ---------- i6-b05: Main Street changes as you play (looks only) ---------- */
// each decoration: when it shows, a few shapes on the town map, and a note on the place it sits by
const DECOS = [
  { k:'shop', near:'mainst', when:() => !!(S.biz && BIZ[S.biz.type]), note:() => `${BIZ[S.biz.type].ic} The empty storefront on Main Street is open again, with your sign over the door: ${BIZ[S.biz.type].name.toLowerCase()}.`,
    svg:() => `<rect x="240" y="150" width="26" height="12" rx="2" fill="#e9c46a" stroke="#6b4a2b"/><rect x="244" y="153" width="18" height="2" fill="#9b2f1f"/><rect x="244" y="157" width="12" height="2" fill="#9b2f1f"/>` },
  { k:'sold', near:'home', when:() => !!HOMES[S.home].own, note:() => `🪧 A SOLD sign still leans by your front step: ${HOMES[S.home].name.toLowerCase()} is yours.`,
    svg:() => `<rect x="100" y="98" width="2" height="16" fill="#6b4a2b"/><rect x="92" y="92" width="22" height="9" fill="#fff" stroke="#9b2f1f"/><text x="103" y="99" font-size="6" text-anchor="middle" fill="#9b2f1f" font-weight="700">SOLD</text>` },
  { k:'mural', near:'mainst', when:() => (S.seasonWins || 0) >= 1, note:() => `🎨 A new mural on the side of the hardware store, painted after the town goal${(S.seasonWins || 0) > 1 ? 's' : ''} you helped finish.`,
    svg:() => `<rect x="196" y="190" width="30" height="14" rx="2" fill="#fbf6ea" stroke="#6b4a2b"/><circle cx="203" cy="197" r="3" fill="#f4d58d"/><path d="M198 202 L206 195 L212 200 L218 193 L224 202Z" fill="#4a7340"/>` },
  { k:'truck', near:'mainst', when:() => !!(S.chains && S.chains.truck && S.chains.truck.step >= 3), note:() => '🍔 Your friend\'s food truck has a regular spot on Main Street now.',
    svg:() => `<rect x="150" y="194" width="24" height="12" rx="2" fill="#fbf6ea" stroke="#9b2f1f"/><circle cx="155" cy="207" r="2" fill="#3d2b1f"/><circle cx="169" cy="207" r="2" fill="#3d2b1f"/>` },
  { k:'levee', near:'river', when:() => !!(S.chains && S.chains.levee && S.chains.levee.step >= 99), note:() => '🎗️ The new levee along the Touchet, with a plaque that thanks the volunteers.',
    svg:() => `<path d="M300 98 C320 86 344 76 372 64" stroke="#8f7d63" stroke-width="4" fill="none" stroke-linecap="round"/>` }
];
const decosOn = () => S && !S.practice ? DECOS.filter(d => { try { return d.when(); } catch (e) { return false; } }) : [];
const decoSVG = () => { const on = decosOn(); return on.length ? `<g class="decos" aria-hidden="true" pointer-events="none">${on.map(d => d.svg()).join('')}</g>` : ''; };
const decoNotes = k => decosOn().filter(d => d.near === k).map(d => `<p class="muted deco" style="margin:6px 0 0">${d.note()}</p>`).join('');
