// The Burg: turn.js (part 3 of 8; scripts load in order and share one global scope)
/* ---------- turn processing (one turn = one week) ---------- */
function endTurn(){ playWeeks(1); }

let ROLL = null;              // i2-a28: weeks rolling by on screen (null when not)
let PLAY_AT = -1e9;           // when the last End Week or skip finished, so a double tap plays one week
const ROLL_MS = 260, LOW_STOP = 35, AUTO_MAX = 26, RUT_AGAIN = 13, RED_AT = 25, RED_REARM = 35;
// i2-a11: what ⏭ Auto plays until, besides anything that needs you (an event with a choice, a milestone, New Year)
const AUTO_UNTIL = {
  event:  { name:'Something needs me', short:'' },
  low:    { name:`A stat drops below ${LOW_STOP} (happiness, health or community)`, short:'a stat drops',
            test: st => { const s = [['happy','Happiness'],['health','Health'],['community','Community']].find(([k]) => S[k] < LOW_STOP && st[k] >= LOW_STOP);
              return s ? `${s[1]} dropped to ${Math.round(S[s[0]])}.` : null; } },
  broke:  { name:'Cash drops below $0', short:'cash runs out', test: st => S.money < 0 && st.money >= 0 ? `Cash dropped below $0 (${fmt(S.money)}).` : null },
  season: { name:'The season changes', short:'the season turns', test: st => SEASON(curMonth()) !== st.season ? `${SEASON(curMonth())} is here.` : null }
};
const autoUntil = () => AUTO_UNTIL[prefs().autoUntil] ? prefs().autoUntil : 'event';
// i2-a28: "watch" shows each week go by; Instant is the default, and reduced motion always plays instantly
const reducedMotion = () => calmMotion();          // the device setting or Settings → Animations off
const watchWeeks = () => prefs().speed === 'watch' && !reducedMotion();
// the End Week and skip buttons come through here: a second tap of a double tap (or a held-down Enter) is ignored
function tapPlay(n, e){
  if (ROLL || !S || S.over || (e && e.detail > 1) || performance.now() - PLAY_AT < 350) return;
  if (n === 'auto') autoPlay(); else playWeeks(n);
}
function autoPlay(){ const k = autoUntil(); playWeeks(AUTO_MAX, AUTO_UNTIL[k].test || null); }
function stopRoll(){ if (!ROLL) return; clearTimeout(ROLL.t); const fin = ROLL.fin; ROLL = null; fin(); }

// Plays up to n weeks. Skips (n > 1) stop when something needs the player: an event with a real choice,
// a milestone note, a year in review, the end of the game, or the player's own Auto stop (i2-a11).
// One-choice events don't stop a skip: they resolve in place and show up in the week strip's details (i2-a13).
function playWeeks(n, stop = null){
  if (ROLL) return;
  S.run = { weeks: 0, money: S.money, happy: S.happy, health: S.health, community: S.community, happened: [] };
  const st = { money: S.money, happy: S.happy, health: S.health, community: S.community, season: SEASON(curMonth()) };
  let res, why = null;
  const step = () => {
    res = weekTick(n > 1); S.run.weeks++;
    if (res.ending || res.ev || res.notes.length || res.review) return true;
    if (n > 1 && moneyTalkDue()) return true;      // i63-a13: going under for the first time stops a skip for the money talk
    if (stop && (why = stop(st))) return true;
    return S.run.weeks >= n;
  };
  if (n > 1 && watchWeeks()) {
    const life = S;
    ROLL = { n, fin: () => finishRun(res, why, n) };
    const tick = () => {
      if (!ROLL || S !== life) { ROLL = null; return; }
      if (step()) { ROLL = null; return finishRun(res, why, n); }
      save(); render(); ROLL.t = setTimeout(tick, ROLL_MS);
    };
    return tick();
  }
  while (!step());
  finishRun(res, why, n);
}
const BACKUP_NUDGE = '📤 Your ending is 4 weeks away. Back up now so the record is safe?';
// i22-a02: an ending that waited (behind the notes, or when the app closed) plays out the same way on Continue
function endLife(e){ return e.debt && canBankrupt() ? bankruptcySheet(e.r) : finish(e.r, e); }
function finishRun(res, why, n){
  PLAY_AT = performance.now();
  if (res.ending) S.endPending = { r: res.ending, debt: !!res.debt, death: !!res.death };   // i22-a02: the ending sticks if the app closes behind the notes
  save();
  const notes = why ? [...res.notes, `⏸ Auto stopped: ${why}`] : res.notes;
  const cared = careLine();                        // i19-b15: one "Taken care of" line for the routine assist
  const after = () => {
    if (res.ending) return endLife(S.endPending);   // i3-a27: a debt ending can still be a bankruptcy
    COUNT_FROM = { money: S.run.money, happy: S.run.happy, health: S.run.health, community: S.run.community };   // i2-a08: stats count up from last week
    render();
    const next = () => {
      if (res.ev) showEvent(res.ev, res.review);     // a year in review that week comes after the event
      else if (res.review) showReview(res.review);
      else if (moneyTalkDue()) moneyTalk();
    };
    // i2-a10: badges and skill levels get one celebration card after the week, then the week goes on
    if (S.newBadges && S.newBadges.length) { const won = S.newBadges; S.newBadges = []; save(); sfx('badge'); buzz('badge'); celebrate(won, next); }
    else { if (!res.ev) { if (n === 1) sfx('week'); buzz('week'); } next(); }   // i2-a04/a05: one small tick per press
    const r = S.run, dm = S.money - r.money, ch = (n, v) => Math.abs(v) < 0.5 ? `${n} unchanged` : `${n} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}`;
    const own = r.happened.filter(h => h.auto).length;
    if (cared && !notes.length) toast(cared);
    if (setting('srWeek') === 'short') announce(weekSentence(res) + (cared ? ` ${cared}.` : ''));   // i7-a02: one plain sentence (Settings can ask for every number)
    else announce(`${r.weeks > 1 ? r.weeks + ' weeks' : 'Week'} done. Cash ${dm >= 0 ? 'up' : 'down'} ${fmt(Math.abs(dm))}, now ${fmt(S.money)}. ${ch('Happiness', S.happy - r.happy)}, ${ch('health', S.health - r.health)}, ${ch('community', S.community - r.community)}. ${own ? `${own} event${own > 1 ? 's' : ''} with no choice to make played out: see the week strip. ` : ''}${cared ? cared + '. ' : ''}${dateLabel()}.`);
  };
  if (notes.length) {
    const fix = res.ending ? [] : noteFixes(res);
    sheet(`<h2>${S.run.weeks > 1 ? S.run.weeks + ' weeks later' : 'This week'}</h2>
      ${notes.map(t => `<p><b>${t}</b></p>`).join('')}
      ${cared ? `<p class="muted">${esc(cared)}</p>` : ''}
      <p>${runChips()}</p>
      ${fix.length ? `<p class="muted" style="margin-bottom:4px">Switch your focus in one tap:</p><div class="skiprow">${fix.map(k => `<button class="btn ghost" data-sugg="${k}">${FOCUS[k].ic} ${FOCUS_SHORT[k]}</button>`).join('')}</div>` : ''}
      ${notes.includes(BACKUP_NUDGE) ? '<button class="btn ghost" id="nudgebk">📤 Back up now</button>' : ''}
      <button class="btn primary" id="ok">${fix.length ? `Keep ${FOCUS_SHORT[S.focus]}` : 'Continue'}</button>`);
    $('#ok').onclick = () => { closeSheet(); after(); };
    document.querySelectorAll('#sheet [data-sugg]').forEach(b => b.onclick = () => { S.focus = b.dataset.sugg; save(); closeSheet(); after(); toast(`This week: ${FOCUS[S.focus].name}`); });
    if ($('#nudgebk')) $('#nudgebk').onclick = () => backupSheet(after);   // closing the backup sheet carries on with the week
  } else after();
}
// i48-b04/b05: the focus buttons a rut or a stat in the red gets (the same fixes as the Home cards), never the current focus
function noteFixes(res){
  if (!res.rut && !(res.red && res.red.length)) return [];
  const map = { happy:'outdoors', health:'rest', community:'community' };
  const want = [...(res.red || []).map(k => map[k]), ...(res.rut ? lowFocus(S.focus) : [])];
  return [...new Set(want)].filter(k => k !== S.focus && !(FOCUS[k].needsJob && (!job() || S.retired))).slice(0, 3);
}
// i19-b15: the routine events the assist answered in the last End Week or skip, in one line
function careLine(){
  const c = S.run ? S.run.happened.filter(h => h.care) : [];
  return c.length ? `🧹 Taken care of: ${c.map(h => `${h.title}${h.money ? ` (${h.money > 0 ? '+' : ''}${fmt(h.money)})` : ''}`).join(', ')}` : '';
}
// i7-a02: the short week summary a screen reader hears after End Week, e.g.
// "Week 34 done. You earned $612. Health up 2, happiness down 1. One event waiting."
function weekSentence(res = {}){
  const r = S.run; if (!r) return '';
  const dm = Math.round(S.money - r.money), first = S.turn - r.weeks + 1;
  const stats = [['Happiness', S.happy - r.happy], ['Health', S.health - r.health], ['Community', S.community - r.community]]
    .filter(([, v]) => Math.abs(v) >= 0.5).map(([n, v], i) => `${i ? n.toLowerCase() : n} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}`);
  return [r.weeks > 1 ? `Weeks ${first} to ${S.turn} done.` : `Week ${S.turn} done.`,
    dm > 0 ? `You earned ${fmt(dm)}.` : dm < 0 ? `You spent ${fmt(-dm)} more than you made.` : 'Your cash stayed the same.',
    stats.length ? `${stats.join(', ')}.` : 'Your stats held steady.',
    res.ev ? 'One event waiting.' : ''].filter(Boolean).join(' ');
}
// i43-a01: the week strip's numbers in words, for its screen-reader label
function runWords(){
  if (!S.run) return '';
  const r = S.run, dm = S.money - r.money;
  const ch = (n, v) => Math.abs(v) < 0.5 ? `${n} unchanged` : `${n} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}`;
  return `${r.weeks > 1 ? `Last ${r.weeks} weeks` : 'Last week'}: cash ${Math.abs(dm) < 0.5 ? 'unchanged' : `${dm > 0 ? 'up' : 'down'} ${fmt(Math.abs(dm))}`}, ${ch('happiness', S.happy - r.happy)}, ${ch('health', S.health - r.health)}, ${ch('community', S.community - r.community)}`;
}
// what the last End Week / skip did, counting events resolved since
function runChips(){
  if (!S.run) return '';
  const r = S.run, dm = S.money - r.money;
  const d = [['😊', S.happy - r.happy], ['❤️', S.health - r.health], ['🤝', S.community - r.community]];
  return `<span class="delta ${dm>=0?'up':'down'}">${dm>=0?'+':''}${fmt(dm)}</span>` +
    d.map(([ic,v]) => `<span class="delta ${Math.abs(v) < 0.5 ? 'flat' : v>0?'up':'down'}">${ic} ${Math.abs(v) < 0.5 ? '±0' : (v>0?'▲':'▼') + Math.abs(Math.round(v))}</span>`).join('');
}
// i75-a22: weather events sit together on one storm card, with what the weather cost in one number
function happenedRows(list){
  const row = h => `<div class="kv"><span>${h.ic} ${esc(h.title)}</span><span style="color:${h.money<0?'var(--down)':'var(--up)'}">${h.money ? (h.money>0?'+':'') + fmt(h.money) : ''}</span></div>`;
  const wx = list.filter(h => h.wx), rest = list.filter(h => !h.wx);
  if (!wx.length) return rest.map(row).join('');
  const sum = wx.reduce((a, h) => a + (h.money || 0), 0);
  return `<div class="card wxcard" role="group" aria-label="Weather: ${wx.length} event${wx.length > 1 ? 's' : ''}${sum ? `, ${sum < 0 ? 'cost' : 'brought in'} ${fmt(Math.abs(sum))}` : ''}"><div class="kv"><span><b>🌦️ Weather</b></span><span style="color:${sum<0?'var(--down)':'var(--up)'}"><b>${sum ? (sum>0?'+':'') + fmt(sum) : '±$0'}</b></span></div>${wx.map(row).join('')}</div>${rest.map(row).join('')}`;
}
function showRunDetails(){
  const r = S.run; if (!r) return;
  const dm = S.money - r.money;
  sheet(`<h2>${r.weeks > 1 ? `The last ${r.weeks} weeks` : 'This week'}</h2>
    <p>${runChips()}</p>
    ${S.last ? `<h3 style="margin-top:12px">${r.weeks > 1 ? 'The last week' : 'Money'}</h3>${S.last.lines.some(x => x[2]) ? '<p class="muted" style="margin:0 0 4px;font-size:0.8125rem">Tap a line to see why.</p>' : ''}${S.last.lines.map(([l,v,why], i) => why
      ? `<button class="kv whyrow" aria-expanded="false" aria-controls="why${i}" data-why="${i}"><span>${l} <span class="info" aria-hidden="true">ⓘ</span></span><span style="color:${v<0?'var(--down)':'var(--up)'}">${v>0?'+':''}${fmt(v)}</span></button><div class="whytext hidden" id="why${i}">${why}</div>`
      : `<div class="kv"><span>${l}</span><span style="color:${v<0?'var(--down)':'var(--up)'}">${v>0?'+':''}${fmt(v)}</span></div>`).join('')}
      <div class="kv"><span><b>Paychecks and bills</b></span><span><b>${S.last.net>=0?'+':''}${fmt(S.last.net)}</b></span></div>` : ''}
    ${r.happened.length ? `<h3 style="margin-top:12px">What happened</h3>${happenedRows(r.happened)}` : ''}
    <div class="kv"><span><b>Total change in cash</b></span><span><b>${dm>=0?'+':''}${fmt(dm)}</b></span></div>${kidMoment()}${tattlerLine()}
    ${S.last && S.last.why && S.last.why.length ? `<h3 style="margin-top:12px">Why your stats moved${r.weeks > 1 ? ' last week' : ''}</h3>${S.last.why.map(w => `<div class="logitem">${w}</div>`).join('')}` : ''}
    ${S.practice || !on('money.outlook') ? '' : '<button class="btn ghost" id="outlook">📅 Money outlook: next 13 weeks</button>'}
    <button class="btn primary" id="ok">Close</button>`);
  setPref('cl', { ...(prefs().cl || {}), strip: 1 });   // i2-a16: the checklist's "look at your week" step
  document.querySelectorAll('[data-why]').forEach(b => b.onclick = () => {
    const open = b.getAttribute('aria-expanded') !== 'true', d = $('#why' + b.dataset.why);
    b.setAttribute('aria-expanded', open); d.classList.toggle('hidden', !open);
  });
  $('#ok').onclick = closeSheet;
  if ($('#outlook')) $('#outlook').onclick = () => outlookSheet(showRunDetails);
}
// i2-a10: one card for everything earned this week (badges and skill levels); no confetti with reduced motion
function celebrate(list, then){
  const items = list.map(x => String(x).replace(/^(\S+) Badge earned: /, '$1 '));
  sheet(`<div class="celebrate${calmMotion() ? ' calm' : ''}" aria-hidden="true">${'<i></i>'.repeat(calmMotion() ? 0 : 14)}</div>
    <div class="big">🏅</div><h2 style="text-align:center">${list.length > 1 ? `${list.length} new milestones!` : 'A new milestone!'}</h2>
    ${items.map(t => `<div class="logitem" style="text-align:center;font-size:1rem"><b>${t}</b></div>`).join('')}
    <p class="muted" style="text-align:center">Badges stay in your collection across all your lives.</p>
    <button class="btn primary" id="ok">Continue</button>`);
  announce(`New: ${items.join('. ')}`);
  $('#ok').onclick = () => { closeSheet(); if (then) then(); };
}
let COUNT_FROM = null;
// i2-a08: after a week, bars slide and cash counts from last week's numbers (400 ms); skipped with reduced motion
function animateStats(from){
  if (!from || calmMotion() || typeof requestAnimationFrame !== 'function') return;
  const bars = [...document.querySelectorAll('.statbtn[data-stat] .bar i')].filter(i => from[i.closest('[data-stat]').dataset.stat] != null);
  for (const i of bars) { const k = i.closest('[data-stat]').dataset.stat; i.dataset.to = i.style.width; i.style.transition = 'none'; i.style.width = `${from[k]}%`; }
  if (bars.length) { void bars[0].offsetWidth; requestAnimationFrame(() => bars.forEach(i => { i.style.transition = ''; i.style.width = i.dataset.to; })); }
  const el = $('.top .money'); if (!el || Math.abs(S.money - from.money) < 1) return;
  const a = from.money, b = S.money, t0 = performance.now();
  const step = t => { const p = Math.min(1, (t - t0) / 400); if (!el.isConnected) return; el.textContent = fmt(a + (b - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  el.textContent = fmt(a); requestAnimationFrame(step);
}
// i2-a02: what a focus does to your stats this week; weekTick and the focus preview share it
const FOCUS_K = 0.28;
const rutHit = () => mode() === 'relaxed' ? 0.7 : 1.2;
const comfortF = () => clamp((88 - S.happy) / 30, 0, 1);
function focusFx(fk, eff, away){
  const f = FOCUS[fk] || FOCUS.rest;
  return Object.fromEntries(Object.entries(f.fx).map(([st,v]) => {
    let d = v * FOCUS_K * (v > 0 ? eff * (away ? (away === true ? TRIP_TIME : away) : 1) : 1);   // i74-a05: a van day passes a number
    if ((fk === 'rest' || fk === 'outdoors') && v > 0) d *= clamp((restTop() - S[st]) / 20, 0, 1);   // Rest and Get outside top out in the low 80s (i59-b02; the 70s on Hard, i35-b05)
    return [st, d];
  }));
}
// a side-hustle week's pay; roll is the week's dice (0.5 = an average week, for the preview)
const hustleXp = () => 1 + Math.min(0.6, (S.hustleWeeks || 0) / 40);
const hustlePay = (gig, roll) => cost(gig.pay * (0.85 + roll * 0.3)) * hustleXp() * outAdBoost() * W;
const truckSeason = () => !!(S.biz && S.biz.type === 'truck' && [3,4,5,6,7,8,9].includes(curMonth()));
// i2-a02: a no-dice estimate of what picking this focus does next week: stats, extra cash, and how strong it still is
function focusPreview(fk){
  const f = FOCUS[fk], j = S.retired ? null : job();
  const n = S.streakF === fk ? S.streakN + 1 : 1, eff = focusEffect(fk, n);
  const away = !!(S.trip && CITIES[S.trip.city] && !tripIsCommute(S.trip.city));
  const fx = focusFx(fk, eff, away), cash = [];
  const rut = fk !== 'study' && n > RUT_WEEKS;
  if (rut) fx.happy = (fx.happy || 0) - rutHit();
  if (f.payMult && j) cash.push(['overtime after taxes', payNow(j) * W * (f.payMult - 1) * (1 - K401[S.k401rate || 0]) * (1 - taxRate(payNow(j) * f.payMult))]);
  if (f.hustle) { if (truckSeason()) cash.push(['a food-truck weekend', truckPay()]); else { const g = currentGig(); cash.push([g.name, hustlePay(g, 0.5)]); } }
  if (f.cost) cash.push([f.name.toLowerCase(), -cost(f.cost) * W]);
  if (f.study && !S.certStudy && S.edu < 3 && tuitionNow() > 0.005) cash.push([S.money < 0 ? 'tuition (on your student loan)' : 'tuition', S.money < 0 ? 0 : -tuitionNow() * W]);
  return { fx, cash, money: cash.reduce((a, [, v]) => a + v, 0), eff, n, rut, away };
}
function previewLine(fk){
  const p = focusPreview(fk), ic = { happy:'😊', health:'❤️', community:'🤝' };
  const st = Object.entries(p.fx).filter(([, v]) => Math.abs(v) >= 0.05).map(([k, v]) => `${ic[k]} ${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`);
  const cash = p.cash.map(([l, v]) => `💵 ${v >= 0 ? '+' : '−'}${fmt(Math.abs(v)).replace('-', '')} ${l}`);
  return `<div class="preview" id="fprev"><b>Next week:</b> ${[...st, ...cash].join(' · ') || 'no change'}${p.eff < 1 ? ` · <b>works at ${Math.round(p.eff * 100)}%</b> (${p.n} weeks in a row)` : ''}${p.rut ? ` · in a rut (−${rutHit()} 😊)` : ''}${p.away ? ` · your trip takes part of the week (${TRIP_TIME * 100}%)` : ''}
    <span class="s">On top of your job, home and bills. An estimate, before events.</span></div>`;
}
function showReview(rv){
  const row = (l, a, b, money) => { const d = b - a; return `<div class="kv"><span>${l}</span><span>${money ? fmt(b) : Math.round(b)} <span class="delta ${Math.abs(d) < (money?1:0.5) ? 'flat' : d>0?'up':'down'}">${Math.abs(d) < (money?1:0.5) ? '±0' : (d>0?'▲':'▼') + (money ? fmt(Math.abs(d)) : Math.round(Math.abs(d)))}</span></span></div>`; };
  sheet(`<div class="big">📅</div><h2 style="text-align:center">${rv.year} in review</h2>
    <p class="muted" style="text-align:center">${esc(S.name)} is ${age()} now.</p>
    ${row('Net worth', rv.start.nw, rv.end.nw, true)}${row('Happiness', rv.start.happy, rv.end.happy)}${row('Health', rv.start.health, rv.end.health)}${row('Community', rv.start.community, rv.end.community)}
    ${rv.milestones.length ? `<h3 style="margin-top:12px">Milestones</h3>${rv.milestones.map(m => `<div class="logitem">${esc(m)}</div>`).join('')}` : '<p class="muted">A quiet year.</p>'}
    ${rv.wx && (rv.wx.cost >= 1 || rv.wx.saved >= 1) ? `<h3 style="margin-top:12px">🌦️ What the weather cost you</h3><div class="kv"><span>Storms, floods, heat and hard winters</span><span style="color:var(--down)">${fmt(rv.wx.cost)}</span></div>${rv.wx.saved >= 1 ? `<div class="kv"><span>What getting ready saved you</span><span style="color:var(--up)">${fmt(rv.wx.saved)}</span></div>` : ''}` : ''}
    <p class="muted">${rv.events} event${rv.events===1?'':'s'} this year.</p>
    <button class="btn primary" id="ok">On to ${rv.year + 1}</button>`);
  $('#ok').onclick = () => { closeSheet(); render(); };
}

// i3-a28: the bills that come every week, the same in weekTick and the 13-week money outlook (off = weeks from now)
function billLines(off = 0){
  const m = W, home = HOMES[S.home], car = CARS[S.car], out = [], c = v => cost(v) * Math.pow(1 + growth('col'), off / 52);
  const rentV = -(home.own && S.mortgage ? S.mortgage : c(home.cost))*m;
  out.push([home.own ? 'Mortgage' : 'Rent', rentV]);
  const stocked = S.turn + off < S.stockUntil;
  const foodV = -c(FOOD_UTIL - (stocked ? GROCERY_SHARE * STOCK_OFF : 0))*(1 - skillLv('cook') * 0.04)*m, insV = -c(insMonthly())*m;   // i3-a19: what you picked on the insurance sheet ($220 by default)
  out.push([stocked ? 'Food & utilities (stocked up)' : 'Food & utilities', foodV]);
  out.push(['Insurance & phone', insV]);
  if (mode() === 'hard') out.push(['Higher living costs (Hard, +10%)', (rentV + foodV + insV) * HARD_LIVING]);   // R15: 10% of rent, food and insurance
  const miles = (commuteOneWay()*2*WORKDAYS*commuteGasFactor() + ERRAND_MILES) * m;
  out.push([commuteOneWay() ? 'Gas (commute + errands)' : 'Gas (errands)', -miles*c(GAS)/car.mpg]);
  if (onBus()) out.push(['County bus pass', -c(BUS_PASS)*m]);          // i3-a14
  { const j = S.retired ? null : job();                                 // i3-a10: union dues, not while on strike or gone
    if (unionJob(j) && !(S.strike && S.turn + off < S.strike.until) && !(S.notice != null && S.turn + off >= S.notice) && !(j.season && !jobInSeason(j, new Date(S.date + off * 7 * 864e5).getMonth()))) out.push(['Union dues', -payNow(j) * Math.pow(1 + rule('wage'), off / 52) * UNION_DUES * m]); }
  if (S.dog) out.push(['Dog food & vet', -c(45)*m]);
  if (S.cat) out.push(['Cat food', -c(CAT_MONTHLY)*m]);              // W14: the barn cat
  if (S.partner) out.push(['Date nights', -c(120)*m]);
  const kidsHome = kidsAtHome();
  if (kidsHome) out.push([kidsHome > 1 ? `Kids (${kidsHome})` : 'Kid', -kidCost()*kidsHome*m]);
  const a0 = yrsOf(S.ageMonths + off * m);
  { const h = healthMonthly(a0, off); if (h) out.push(['Health care', -c(h)*m]); }   // i75-b04: an employee share before 50
  if (S.ltc && S.ltc.ins && !S.care) out.push(['Long-term care insurance', -c(LTC_PREMIUM)*m]);
  { const cp = certPay(off); if (cp) out.push(['Certificate course', -cp, `Your ${CERTS[S.certStudy.id].name} course, paid as you go: ${fmt(S.certStudy.per)} a week for ${CERTS[S.certStudy.id].weeks} weeks. ${fmt(certOwed())} left before this week.`]); }   // i72-b04
  if (S.care && careMonthly() > 0) out.push([CARE[S.care].bill, -c(careMonthly())*m]);
  return out;
}
// i75-b04: health care each month (2027 dollars): $180 from 50 and $420 from 65; before 50, the $130 employee share while
// you work at a job paying $1,900 or more, or Apple Health ($0) with no job or low pay
function healthMonthly(a0 = age(), off = 0){
  if (a0 >= 50) return a0 >= 65 ? 420 : 180;
  const j = S.retired ? null : job();
  if (!j || (S.notice != null && S.turn + off >= S.notice) || !jobInSeason(j, new Date(S.date + off * 7 * 864e5).getMonth())) return 0;
  return payNow(j) / (S.wage || 1) >= APPLE_HEALTH_PAY ? HEALTH_PREMIUM : 0;
}
// i75-b08: the Pasco food plant runs harvest overtime from August to October
// i75-b05: unemployment benefits a month: 41% of the last job's pay (set when you were laid off), between $1,500 and $4,900
const uiFor = j => clamp(UI_SHARE * payNow(j) / (S.wage || 1), UI_MIN, UI_MAX);
const uiMonthly = () => (S.uiPay || UI_MIN) * S.wage;
const plantOT = (j, mo = curMonth()) => j && j.id === 'foodplant' && on('jobs.seasonal') && PLANT_OT_MONTHS.includes(mo) ? 1 + PLANT_OT : 1;
// i75-b08: a mall retail associate gets 10% off stops in the Tri-Cities
const retailPerk = town => !!(S && S.jobId === 'retail' && !S.retired && on('jobs.seasonal') && ['kennewick', 'pasco', 'richland'].includes(town));
// i75-b13/b14: a retiree's money for one week: Social Security, the pension, the 401(k) draw, and the tax on them
function retireeIncome(lines, m, draw = true){
  const ss = ssPay() * m, pen = pensionVested() ? pensionPay() * m : 0;
  lines.push(['Social Security', ss]); if (pen) lines.push(['Pension', pen]);
  let w = 0;
  if (draw && S.k401 > 0) { w = Math.min(S.k401, S.k401 * drawRate() * m / 12); S.k401 -= w; lines.push(['401(k) withdrawal', w]); }
  const tax = Math.max(0, ss + pen - cost(RETIRE_TAX_FREE) * m) * RETIRE_TAX + w * RETIRE_TAX;
  if (tax > 0) lines.push(['Taxes', -tax, `Social Security and the pension are untaxed up to ${fmtc(RETIRE_TAX_FREE)} a month; above that, and on 401(k) withdrawals, about ${RETIRE_TAX * 100}%.`]);
  return ss + pen + w;
}
// i3-a24/a25: a week of work adds to your Social Security record and, in a public job, your pension
function workYear(j, m){
  const real = payNow(j) / S.col;                  // this job's pay in 2027 dollars
  S.earnYears = (S.earnYears || 0) + m / 12; S.earnSum = (S.earnSum || 0) + real * m / 12;
  if (j.pension) {
    const was = pensionVested();
    S.pensionYears = (S.pensionYears || 0) + m / 12; S.pensionPay = Math.max(S.pensionPay || 0, real);
    if (!was && pensionVested()) log(`Vested in the public pension after ${PENSION_VEST} years: it pays when you retire.`, 'mile');
  }
}

// i2-a21: why a money line cost what it did (lines that don't carry their own reason get one here)
function lineWhy(l, f, j){
  const home = HOMES[S.home], car = CARS[S.car];
  if (l === 'Social Security') return 'Your Social Security check, paid weekly. It grows with the years you worked and rises with prices.';
  if (l === 'Pension') return 'Your public pension: you vested by working enough years in a public job.';
  if (l === '401(k) withdrawal') return `In retirement ${(drawRate() * 100).toFixed(1)}% of your 401(k) comes out this year: 4% until 73, then more each year, like the IRS required-distribution table.`;
  if (/^Paycheck/.test(l) && j) return `${j.title}: ${wk(payNow(j))}${f.payMult ? `, plus ${Math.round((f.payMult - 1) * 100)}% for overtime at time and a half` : ''}${plantOT(j) > 1 ? `, plus ${PLANT_OT * 100}% harvest overtime (August to October)` : ''}${S.raise > 1.005 ? `, with ${Math.round((S.raise - 1) * 100)}% in raises` : ''}. Pay grows about 2.5% a year.`;
  if (l === 'Mortgage') return `Your ${home.name.toLowerCase()}: the payment was locked in when you bought (or refinanced).`;
  if (l === 'Rent') return `Rent on the ${home.name.replace(/^Rented /, '').toLowerCase()}. Rents rise with prices, about 3% a year.`;
  if (/^Food & utilities/.test(l)) return `Groceries, power, water, sewer, trash and internet${/stocked/.test(l) ? `, with groceries ${STOCK_OFF*100}% off from a stock-up run` : ''}${skillLv('cook') ? `, ${skillLv('cook') * 4}% less because you cook` : ''}. Shop local at Burg Basket Grocery for a little community, or stock up on a trip to Walla Walla for ${STOCK_OFF * 100}% off groceries.`;
  if (l === 'Insurance & phone') return `Your insurance (set on the insurance sheet) and your phone plan${insExtras().length ? `, with ${insExtras().map(([n]) => n.replace(/^\S+ /, '').toLowerCase()).join(' and ')}` : ''}. Your medical plan is the separate Health care line.`;
  if (/^Higher living costs/.test(l)) return 'Hard mode: rent, food and insurance cost 10% more.';
  if (/^Vehicle tabs/.test(l)) return 'Every January: about 1% of what your vehicle is worth, at least $60.';
  if (/^Gas \(/.test(l)) return `${commuteOneWay() ? `${commuteOneWay()} miles each way${driveDays() < 1 ? `, ${Math.round(driveDays() * 5)} days a week` : ''}${carpooling() ? ', half of it with the carpool' : ''}, plus errands` : 'Errands around town'}, at ${car.mpg} mpg.`;
  if (l === 'Dog food & vet') return 'Food and the vet for your dog.';
  if (l === 'Date nights') return 'Time out with your partner.';
  if (/^Partner's paycheck/.test(l)) return 'Your partner works part-time until 65.';
  if (/^Kids? ?/.test(l) && /^Kid/.test(l)) return `About ${fmtc(KID_COST)} a month for each kid at home, ${fmtc(KID_CARE)} of it childcare${commuteOneWay() >= 20 ? `, plus ${fmtc(KID_CARE_COMMUTE)} more childcare because you commute 20+ miles` : ''}${childcareHelp() ? `. Your income qualifies for Working Connections childcare, so you pay only ${fmtc(WCCC_CAP)} of the childcare` : ''}.`;
  if (l === 'Health care') return age() >= 65 ? 'Health care costs more from 65.' : age() >= 50 ? 'Health care costs more from 50.' : `Your share of the health plan at work. With no job, or pay under ${fmtc(APPLE_HEALTH_PAY)} a month, Apple Health covers you for $0.`;
  if (l === 'Long-term care insurance') return 'A monthly premium so care late in life is covered.';
  if (l === (FOCUS[S.focus] || {}).name) return `Your focus this week, ${l}, costs a little.`;
  return '';
}
// i71-b05: money that lands after the week's lines are summed (a collections fee, a hospital bill) still shows as a line
function lateLine(l, v, why = ''){
  S.money += v;
  if (S.last) { S.last.lines.push([l, v, why]); S.last.net += v; }
}
function weekTick(auto){
  const L = LENGTHS[S.len], m = W, k = 0.28;
  const lines = [], notes = [];
  let rut = false;
  LIFE_UNDO = [];                                  // i2-a25: a played week can't be undone
  jobWeekStart(notes);                             // i3: an interview's answer, notice, seasons and recalls
  const f = FOCUS[S.focus] || FOCUS.rest, j = S.retired ? null : job();
  if (S.focus === 'work' && j) S.seenOT = true;   // i52-a03: the overtime note has been seen for a whole week
  if (syncCarpool()) log('Your carpool ended with the job change: you drive alone now.');

  // ---- money (constants are monthly; m converts to one week) ----
  let gross = 0, k401 = 0;
  if (S.retired) gross = retireeIncome(lines, m);   // i75-b13/b14: draws that rise with age, and retiree taxes
  else if (j && onLeave()) gross = leavePay(j, lines);   // i74-a14: paid family leave
  else if (j) gross = jobPay(j, payNow(j) * m * (f.payMult||1) * plantOT(j) * wxPayF(j) * smokePayMult(), lines, f);   // i75-a29 a short pack season; i75-a07 the smoke rule's shorter days; i3: strikes, furloughs, clearances, union dues
  if (!S.retired) gross += furloughBackPay(lines);
  if (j) workYear(j, m);                           // i3-a24/a25: years worked count toward Social Security and a public pension
  if (j && !S.retired && S.k401rate && on('money.k401')) {           // pre-tax contribution, with a 3% employer match at 5% or more
    k401 = gross * K401[S.k401rate]; const match = gross * K401_MATCH;
    lines.push(['401(k) contribution', -k401, `You save ${K401[S.k401rate]*100}% of your pay before taxes, and your employer adds ${K401_MATCH * 100}% more. Your savings are always yours; the match is yours after ${K401_VEST_MONTHS / 12} years at the job.`]);
    S.k401 += k401 + match;
    if ((S.tenure || 0) < K401_VEST_MONTHS) S.k401match = (S.k401match || 0) + match;   // i75-b12: not yours until it vests
  }
  if ((S.k401match || 0) > 0 && j && (S.tenure || 0) >= K401_VEST_MONTHS) { S.k401match = 0; log(`Your 401(k) match vested: after ${K401_VEST_MONTHS / 12} years at the job it's all yours.`, 'money'); }
  if (gross && !S.retired) { const r = taxRate(j ? payNow(j) * (f.payMult || 1) * plantOT(j) : gross / m);   // i75-b03: by bracket
    lines.push(['Taxes', -(gross - k401) * r, `About ${Math.round(r * 100)}% of your pay${k401 ? ' after your 401(k) savings' : ''}: federal income tax, Social Security and Medicare. Washington has no income tax.`]); }
  if (!S.retired && !j && S.ui > 0) { const n = Math.min(m, S.ui); lines.push(['Unemployment benefits', uiMonthly()*n, `${Math.round(UI_SHARE * 100)}% of your last job's pay, for up to 6 months after a layoff.`]); S.ui -= n; }
  let gig = null;
  const truckTime = S.biz && S.biz.type === 'truck' && [3,4,5,6,7,8,9].includes(curMonth());
  if (f.hustle && !truckTime) { gig = currentGig(); lines.push([`Side hustle: ${gig.name}`, hustlePay(gig, Math.random()), `Gigs follow the seasons. ${S.hustleWeeks ? `${S.hustleWeeks} weeks of experience add ${Math.round((hustleXp() - 1) * 100)}% to your pay.` : 'Pay grows as you get good at it.'}`]); S.hustleWeeks = (S.hustleWeeks || 0) + 1; S.hustleLast = S.turn; }
  else if (f.hustle && truckTime) S.hustleLast = S.turn;   // i22-a12: a food-truck weekend keeps your hustle skills fresh
  else if (S.hustleWeeks > 0 && S.turn - (S.hustleLast ?? S.turn) > HUSTLE_FADE_AFTER) S.hustleWeeks = Math.max(0, S.hustleWeeks - HUSTLE_FADE);   // B9: rusty after 6 months off
  const home = HOMES[S.home];
  wxWeek(lines, notes);                            // i75: this year's weather, gray weeks and the weather bill
  bizWeek(lines, notes);
  moneyWeek(lines, notes);                         // round 3: property tax, home equity loan, index funds, wine futures
  weatherLines(lines, notes);                      // i75: smoke sick days, the roof on the waiting list, the neighbor's walk
  const trip = tripWeek(lines);                    // this week's trip around the region, if one is planned
  lines.push(...billLines());                      // i3-a28: the regular bills, shared with the money outlook
  if (certOwed()) { S.certStudy.owe -= certPay(); if (S.certStudy.owe < 0.005) S.certStudy.owe = 0; }   // i72-b04: this week's course payment
  eventMoneyWeek(lines);                           // i58-b02: health-plan savings and light duty, week by week
  { const y = new Date(S.date).getFullYear(); if (curMonth() === 0 && S.tabsYear !== y && on('car.upkeep')) { lines.push(['Vehicle tabs (DMV)', -vehicleTabs()]); S.tabsYear = y; } }
  if (S.loanLeft > 0) {
    const n = Math.min(m, S.loanLeft); lines.push(['Truck payment', -(S.loanPay || CARS.truck.pay)*n, `Five years of payments on the new pickup: about ${Math.max(0, Math.ceil((S.loanLeft - n) / W))} weeks to go.`]); S.loanLeft -= n;
    if (S.loanLeft < 1e-6) { S.loanLeft = 0; notes.push('🛻 The truck is paid off!'); S.paidOff = true; log('Made the last truck payment.'); }
  }
  if (S.sloanLeft > 0) {
    const n = Math.min(m, S.sloanLeft); lines.push(['Student loan', -S.sloanPay*n, `Paying back college: about ${Math.max(0, Math.ceil((S.sloanLeft - n) / W))} weeks to go.`]); S.sloanLeft -= n;
    if (S.sloanLeft < 1e-6) { S.sloanLeft = 0; notes.push('🎓 Your student loans are paid off!'); S.paidOff = true; log('Paid off the student loans.'); }
  }
  if (S.partner && age() < 65) lines.push(["Partner's paycheck (part-time)", 1400*S.wage*m]);
  const kidsHome = kidsAtHome();
  if (f.cost) lines.push([f.name, -cost(f.cost)*m]);
  healthWeek(lines, notes, j, gross);              // i74: sick hours, physical therapy, Dad's care
  planWeek(lines, notes);                          // i3-a30/a31/a33/a34: winters south, late-life care, probate and spare-room guests
  // i3-a03: a certificate course takes the week's classes first (its fee was paid up front, or week by week: i72-b04)
  if (f.study && !certWeek(trip && trip.away ? TRIP_TIME : 1, notes) && S.edu < 3) {
    const tu = tuitionNow() * m, gr = grantShare();
    const why = `Classes at ${SCHOOL[S.edu]}, charged in weeks you Take classes${gr > 0.005 ? `, with ${Math.round(gr * 100)}% paid by the Washington College Grant` : ''}.`;
    if (tu > 0.005 && S.money < 0) {               // i75-b23: below $0, tuition goes on the student loan at about 6.5%
      if (!(S.sloanLeft > 0)) notes.push(`🎓 You're below $0, so this week's tuition went on a federal student loan (about ${SLOAN_RATE * 100}%) instead of your card.`);
      tuitionOnLoan(tu); lines.push(['Tuition (on your student loan)', 0]);
    } else if (tu > 0.005) lines.push(['Tuition', -tu, why]);
    S.studyProg += trip && trip.away ? TRIP_TIME : 1;     // R11: a trip week is 3/4 of a week of classes
    if (S.studyProg >= STUDY_NEED[S.edu]) { graduate(); notes.push(`🎓 You earned your ${EDU[S.edu]}${S.major && S.major === S.program ? ` in ${PROGRAMS[S.major].name.toLowerCase()}` : ''}! New jobs unlocked.`); }
  }
  if (S.money < 0) lines.push(['Interest on debt', S.money * (mode() === 'relaxed' ? 0.01 : 0.015) * m, `You're below $0, so debt charges about ${mode() === 'relaxed' ? 1 : 1.5}% interest a month.`]);
  const net = lines.reduce((a,[,v]) => a + v, 0);
  S.money += net;
  S.last = { lines: lines.filter(([,v]) => Math.round(v)).map(l => l[2] ? l : [l[0], l[1], lineWhy(l[0], f, j)]), net };
  debtWeek(notes);                                 // i3-a26: long debt goes to collections
  // i3-a21: the valley's home prices move with this year's market (2.5% a year on average); owners gain principal + appreciation
  { const hg = on('home.market') ? S.homeGrow ?? 0.025 : 0;   // to-do 2: in Easy homes keep their listed price
    S.homeIdx = (S.homeIdx || 1) * Math.pow(1 + hg, 1/52);
    if (home.own) S.equity = S.equity * Math.pow(1 + hg, 1/52) + home.equityPer * m; }
  S.carValue = Math.max(cost(500), S.carValue * Math.pow(0.99, m));   // i30-b02: the floor rises with prices
  S.k401 *= Math.pow(1.06, 1/52); if (S.k401match) S.k401match = Math.min(S.k401, S.k401match * Math.pow(1.06, 1/52));
  S.col *= Math.pow(1 + growth('col'), 1/52); S.wage *= Math.pow(1 + growth('wage'), 1/52);

  // ---- stats drift for the week ----
  const a = age();
  // i2-a21: plain reasons the stats moved, read from the same rules (this changes nothing)
  const why = [`${f.ic} Your focus, ${f.name}${focusEffect(S.focus, S.streakF === S.focus ? S.streakN + 1 : 1) < 1 ? `, at ${Math.round(focusEffect(S.focus, S.streakF === S.focus ? S.streakN + 1 : 1) * 100)}% after ${S.streakN + 1} weeks in a row` : ''}${trip && trip.away ? ', with a trip taking part of the week' : ''}: ${fxWords(f.fx)}.`];
  if (S.retired) why.push('🎉 Retirement: ▲ happiness every week.');
  else if (j) { if (j.stress >= 0.6) why.push(`💼 ${j.title} is stressful: ▼ happiness.`); if (j.wear >= 0.7) why.push(`💼 ${j.title} is hard on your body: ▼ health.`); if (j.city === 'waitsburg') why.push('🤝 Working in Waitsburg keeps you in the loop: ▲ community.'); }
  else why.push('💼 No job: ▼ happiness.');
  if (smokeRuleWeek()) why.push(pushingSmoke() ? '😷 Pushing through full shifts in the smoke: full pay, full wear, and a chance of a sick week.' : '😷 The smoke rule at work: shorter days, 10% less pay, half the wear on your body.');
  if (commuteOneWay() >= 20) why.push(`🛣️ ${commuteOneWay()} miles each way${carpooling() ? ' (the carpool helps)' : ''}: ▼ happiness.`);
  if (S.money < 0) why.push('💳 Being in debt: ▼ happiness.');
  if (S.partner || S.dog || S.cat || kidsAtHome()) why.push(`🏡 ${[S.partner ? 'your partner' : '', S.dog ? 'your dog' : '', S.cat ? 'your cat' : '', kidsAtHome() ? 'kids at home' : ''].filter(Boolean).join(', ').replace(/^./, c => c.toUpperCase())}: ▲ happiness${comfortF() < 1 ? `, ${comfortF() <= 0 ? 'but not past the high 80s' : 'less as you near the high 80s'}` : ''}.`);
  if (S.health < 35 && (S.focus === 'work' || S.focus === 'hustle')) why.push('😮‍💨 Pushing through low health with extra work: ▼▼ health.');
  if (S.focus !== 'study' && S.streakF === S.focus && S.streakN + 1 > RUT_WEEKS) why.push(`🔁 In a rut (${S.streakN + 1} weeks of the same thing): ▼ happiness.`);
  why.push(`⚖️ Stats drift toward the middle: high ones slip, low ones recover a little${a >= 50 && on('health.agingDrift') ? ', and health drifts lower with age' : ''}.`);
  if (S.bgRest != null && S.turn < BG_REST_WEEKS) why.push('🏙️ New in town: community slips back toward 10 until your first year is up, unless you show up.');   // i37-b06
  if (maxHealth(a) < 100 && S.health >= maxHealth(a) - 1) why.push(`❤️ At ${a}, health tops out at ${Math.round(maxHealth(a))}.`);   // i30-b03
  let dh = -0.5 + (happyRest() - S.happy) * 0.06;   // i35-b05: Hard rests lower
  let dH = ((a < 30 ? 85 : a < 50 || !on('health.agingDrift') ? 78 : a < 65 ? 68 : a < 80 ? 55 : 42) - S.health) * 0.025;   // to-do 2: Easy has no aging drift
  const cRest = commRest();                        // i35-b05 Hard 20; i37-b06 a newcomer's first year 10
  let dc = (cRest - S.community) * (S.community > 60 ? 0.1 : 0.05) * (S.community > cRest ? 1 - skillLv('people') * 0.15 : 1);   // people skill: community fades slower; i38-a08: harder above 60
  if (S.retired) dh += 1;
  else if (j) { dh -= j.stress + rungOf(j).stress; dH -= onLeave() ? 0 : j.wear * smokeWearMult(); dc += remoteDays(j) === 5 ? -0.4 : j.city==='waitsburg' ? 0.6 : j.city==='dayton' ? 0.2 : 0; }   // i3-a01 rung stress; i3-a13 no coworkers
  else dh -= 2;
  dh -= commuteOneWay() / 40 * driveDays() * (carpooling() ? 0.6 : 1);
  if (carpooling()) dc += 0.3;                    // riding with neighbors keeps you in the loop
  if (onBus()) dh -= 0.3;                          // i3-a14: longer days on the bus
  dh += (home.happy * 0.4 + (S.partner ? 0.6 : 0) + (S.dog ? 0.4 : 0) + (S.cat ? 0.2 : 0) + kidsHome * kidJoy()) * comfortF() - (S.money < 0 ? 2 : 0);   // i30-b04: home comforts pull toward the mid-80s
  dc += kidsHome * 0.2;
  if (S.council) dc += 0.8;
  if (awaySouth()) { dh = Math.max(dh, 0.5); dH = Math.max(dH, 0.3); dc -= 1.2; }   // i3-a30: sun holds you up, but town forgets you a little
  { const b = bodyDrift(a, j, why); dh += b.dh; dH += b.dH; dc += b.dc; }   // i74: desk wear, an old injury, helping Dad
  if (S.care && CARE[S.care]) { const cr = CARE[S.care]; dh += cr.happy; dH += cr.health; dc += cr.comm; }   // i3-a31
  // worn down: pushing through low health with overtime or side hustles makes it worse, fast
  if (S.health < 35 && (S.focus === 'work' || S.focus === 'hustle')) dH -= 3.2;
  if (mode() === 'relaxed') { if (dh < 0) dh *= 0.6; if (dH < 0) dH *= 0.6; if (dc < 0) dc *= 0.6; }
  if (mode() === 'hard') { if (dh < 0) dh *= 1.25; if (dH < 0) dH *= 1.25; if (dc < 0) dc *= 1.25; }
  S.happy = clamp(S.happy + dh*m); S.health = clamp(S.health + dH*m); S.community = clamp(S.community + dc*m);
  if (dH > 0) S.health = Math.min(S.health, Math.max(maxHealth(), S.health - dH*m));   // i30-b03: health recovers only up to its age cap
  // doing the same thing week after week loses its punch (classes excepted), and a long rut wears on you
  if (S.streakF === S.focus) S.streakN++; else { S.streakF = S.focus; S.streakN = 1; }
  S.recentF = [S.focus, ...(S.recentF || [])].slice(0, 4);
  const eff = focusEffect();
  adj(focusFx(S.focus, eff, trip && trip.away ? (trip.van ? VAN_TIME : true) : false));
  if (skiWeek()) { adj({happy:2, health:1}); why.push('⛷️ A ski day at Bluewood on your season pass: ▲ happiness and health, no lift ticket.'); }   // i66-b16
  S.last.why = why;
  if (S.focus !== 'study' && S.streakN > RUT_WEEKS) {
    adj({happy: -rutHit()});                       // i48-b02: softer on Relaxed
    // i48-b03: the note (and a stop for skips) comes back every 13 weeks while the same focus runs on
    if ((S.streakN - RUT_WEEKS - 1) % RUT_AGAIN === 0) { rut = true; notes.push(`🔁 ${S.streakN - 1} weeks of "${f.name}" in a row. You're in a rut: −${rutHit()} happiness every week until you switch.`); }
  }
  if (trip) adj(trip.fx);
  seasonWeek(notes);
  if (gig && gig.fx) adj(Object.fromEntries(Object.entries(gig.fx).map(([st, v]) => [st, v * k])));
  skillWeek(notes, gig);

  eventUpkeep();                                   // i71-b04: promotion stress counts in quiet weeks too
  // ---- maybe an event this week ----
  const dice = eventDice();         // R8: events roll their own dice, so a weekly challenge brings everyone the same events
  let ev = S.noEvents || awaySouth() ? null : rollEvent(curMonth(), trip);   // i3-a30: nothing happens in town while you're in Arizona   // town, road and work events, paced by category
  dice.done();
  { const due = S.noEvents ? null : takeDue(); if (due) ev = due; }   // a harvest choice or a market drop comes first
  if (ev) {
    S.evAt = S.turn; S.pendingEv = ev.title;      // i22-a01: saved with the week, so closing the app can't skip it; the cooldown starts on a choice
    if (ev.big) wxHit();                           // i75-a23: a big weather hit counts toward the year's cap
    { const pl = eventPlace(ev); S.evPins = [{ t: ev.title, ic: ev.ic, m: pl[0], k: pl[1], turn: S.turn + 1, r: '' }, ...(S.evPins || [])].slice(0, 12); }
    S.evSeen = S.turn < 52 ? { ...(S.evSeen || {}), [ev.title]: 1 } : {};   // i52-a10: only the first year needs it
    S.evLabel = dateLabel();
    S.yearEvents = (S.yearEvents || 0) + 1;
    // while skipping ahead, one-choice events resolve on their own; with the routine assist (i19-b15) routine events
    // take a careful player's choice and show up as "Taken care of"
    const care = rule('routine') && !S.practice ? routinePick(ev) : null, ch = !care && auto ? ev.choices().filter(c => !c.if || c.if()) : [];
    const pickNow = care || (ch.length === 1 ? ch[0] : null);
    if (pickNow) {
      resolveChoice(ev, pickNow, true);                                   // i71-b03
      if (care && S.run && S.run.happened.length) S.run.happened[S.run.happened.length - 1].care = 1;
      ev = null;
    }
  }

  // ---- advance one week ----
  S.happySum += S.happy * m; S.healthSum += S.health * m; S.commSum = (S.commSum || 0) + S.community * m; S.monthsPlayed += m;   // i15-a01: community is a life average too
  scoreWeek(trip);                                 // good weeks, debt weeks, aim weeks and the aim tallies (wave 1 score)
  const oldAge = age(), oldYear = new Date(S.date).getFullYear();
  jobWeekEnd(notes);                               // i3: months on the job, apprenticeships, clearances, strikes
  S.date += 7 * 864e5; S.ageMonths += m; S.turn++; S.jobMonths += m; S.applied = false;
  kidBirthdays(m);                                 // i46-a04: a kid turning 18 moves out, in the Journal
  if (age() > oldAge && age() % 10 === 0) notes.push(`🎂 Happy ${age()}th birthday!`);
  // i63-b08: four weeks before a 2-year or 5-year life ends, one line suggests a backup (once per life)
  if (!S.practice && !S.backupNudged && (S.len === 'two' || S.len === 'five') && S.turn >= L.turns - 4 && S.turn < L.turns) { S.backupNudged = true; notes.push(BACKUP_NUDGE); }
  if (S.turn % CARD_EVERY === 0 && !S.practice) {  // a quarterly report card in the Journal (doesn't stop skips); i20-b14: it counts toward the final score
    const c = addReportCard(), sc = lifeScore().score, d = S.scoreQ == null ? null : sc - S.scoreQ;
    log(`📋 Report card: ${c} this quarter. Life Score so far ${sc}${d == null ? '' : ` (${d >= 0 ? '+' : ''}${d} since the last one)`}.`);
    S.scoreQ = sc;
  }
  if (S.focus === 'work' && !job()) S.focus = 'rest';
  if (S.focus === 'study' && !canStudy()) S.focus = 'rest';           // i3-a03: a certificate finished after the last diploma
  if (S.plan && S.plan.length) { S.planI = ((S.planI || 0) + 1) % S.plan.length; S.focus = planFocus(); }   // i2-a12: next week's turn in the rotation
  let review = null;
  const newYear = new Date(S.date).getFullYear();
  if (newYear > oldYear) {
    const snap = { nw: netWorth(), happy: S.happy, health: S.health, community: S.community };
    if (S.yearStart && LENGTHS[S.len].turns > 26) review = { year: oldYear, start: S.yearStart, end: snap, events: S.yearEvents || 0, wx: wxYearEnd(oldYear),
      milestones: reviewMilestones(oldYear) };   // i5-a03
    if (S.yearStart) S.years = [...(S.years || []), { year: oldYear, age: age(), start: S.yearStart, end: snap, m: yearMilestones(oldYear) }].slice(-120);   // i2-a29: for the life story
    S.yearStart = snap; S.yearEvents = 0;
    // i3-a10: union jobs get a step raise every January after 6 months on the job
    if (unionJob() && working() && !S.strike && (S.tenure || 0) >= 6) { const g = bumpPay(1.015); if (g > 0.0005) log(`Union step raise: ${pctTxt(g)} at the ${job().title.toLowerCase()} job.`); }
    // difficulty: with no job ladders (Easy), a small raise each January after 6 months on the job
    else if (!on('jobs.ladder') && working() && (S.tenure || 0) >= 6) { const g = bumpPay(YEAR_RAISE); if (g > 0.0005) log(`Yearly raise: ${pctTxt(g)} at the ${job().title.toLowerCase()} job.`, 'money'); }
  }

  badgeWeek(notes); scenarioWeek(notes);
  // ---- health crises & endings ----
  let ending = null, death = false;
  if (S.health <= 0) {
    if (L.turns === Infinity && age() >= 50) { ending = `${S.name}'s health finally gave out at age ${age()}.`; death = true; }
    else { const ride = ambRide(), bill = Math.round(cost(6500)) + ride; lateLine('🏥 Hospital bill', -bill, ride ? `The hospital stay in Walla Walla, ${fmt(ride)} of it for the ambulance ride.` : ambOn() ? 'The hospital stay in Walla Walla; your ambulance district membership covered the ride.' : 'The hospital stay in Walla Walla, ambulance ride and all.'); S.health = 30; adj({happy:-10});   // i74-a04: the ambulance ride, unless you're a member
      notes.push(`🏥 You ended up in the hospital. The bill was ${fmt(bill)}${ride ? `, ${fmt(ride)} of it for the ambulance ride` : ambOn() ? ', and your ambulance district membership covered the ride' : ''}.`); log('Spent a week in the hospital in Walla Walla.'); }
  }
  if (!ending && L.turns === Infinity && age() >= 60) {
    const p = Math.pow((age()-60)/35, 3) * 0.22 * (1.6 - S.health/100) * (W/3);
    if (chance(p) || age() >= 102) { ending = `${S.name} passed peacefully at age ${age()}, with the whole town at the service.`; death = true; }
  }
  if (!ending && S.turn >= L.turns) ending = `${L.label} in the Burg is in the books.`;
  const debtEnd = debtLimit();                     // i60-a12: the same limit the Home card and Help name
  let debt = false;
  if (!ending && debtEnd != null && S.money < debtEnd) { ending = `Buried in debt, ${S.name} packed up and left Waitsburg.`; debt = true; }
  if (debtEnd == null && S.money < RELAXED_FLOOR) S.money = RELAXED_FLOOR;   // Relaxed: a debt counselor stops the slide
  // i48-b05: a stat falling into the red says so once (and stops a skip); it warns again after it climbs back above 35
  const red = [];
  if (!ending) {
    const rl = S.redLow = S.redLow && typeof S.redLow === 'object' ? S.redLow : {};
    for (const [k, n] of [['happy', 'Happiness'], ['health', 'Health'], ['community', 'Community']]) {
      if (S[k] > RED_REARM) delete rl[k];
      else if (S[k] < RED_AT && !rl[k]) { rl[k] = 1; red.push(k); notes.push(`🟥 ${n} dropped into the red (${Math.round(S[k])}).`); }
    }
  }
  return { ev, notes, ending, review, debt, death, rut, red };
}

function deltaChips(before){
  const d = [['Happiness', S.happy-before.happy], ['Health', S.health-before.health], ['Community', S.community-before.community]];
  return d.map(([l,v]) => Math.abs(v) < 0.5 ? '' : `<span class="delta ${v>0?'up':'down'}">${l} ${v>0?'+':''}${Math.round(v)}</span>`).join('');
}
