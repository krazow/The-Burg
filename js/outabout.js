// The Burg: outabout.js (Out and about, #48–#54; loads after features.js and before maps.js; one shared global scope)
/* ============================================================
   🛍️ OUT AND ABOUT: Waitsburg's own businesses
   - PLACES: every business, with a stand-in name (real names are never used), its real street address,
     when it's open in the game (days, seasons, winter breaks) and what you can do there.
   - Visits: a quick action beside the week's focus. Up to OUT_MAX a week, one per place, each with a small
     effect on the same scale as a trip stop. Going back within OUT_REPEAT weeks is half as special, and visits
     can't add more than OUT_WEEK_CAP points to any one stat in a week. Drinks are 21 and over.
   - The Main Street close-up map (tap Main Street on the town map) and Preston Avenue pins on the town map.
   - Business events, jobs at local businesses, and life systems (bank, clinic, grocery, local trades).
   Facts (addresses, days, seasons) were last checked on PLACES_CHECKED. They match reality loosely and never
   promise anything. Businesses change: update this one list, and check it once a year.
   ============================================================ */
const PLACES_CHECKED = '2026-11-18';
const OUT_MAX = 2, OUT_FX = TRIP_FX, OUT_REPEAT = REPEAT_WEEKS, OUT_WEEK_CAP = 3, LOOK_WEEKS = 2, AD_WEEKS = 8, AD_BOOST = 0.15;
const jamWeek = (t = S && S.turn) => !!S && t % 2 === 0;           // Tonnage's bluegrass jam: every other week
const festivalWeek = () => !!S && curMonth() === 4;       // Celebration Days in May
const WINTER_BREAK = [0, 1];                               // January and February
const MONTH_SPAN = ms => `${MONTHS[ms[0]]}–${MONTHS[ms[ms.length - 1]]}`;

// st: 'main' (Main Street close-up), 'preston' (town map) or 'town' (listed only); x, y: the pin on its map
const PLACES = [
  { id:'shavings', name:'Simply Shavings', ic:'🪚', lb:'Woodshop', addr:'101 Main St.', st:'main', x:35, y:220, kind:'Woodshop and makerspace',
    desc:'A woodshop and makerspace with classes, open shop time and handmade gifts.', hours:'Classes and open shop most weeks · closed for a winter break in January and February',
    closed:WINTER_BREAK, closedWhy:'Closed for the winter break until March',
    acts:[{ id:'class', ic:'🪵', name:'A woodworking class', cost:40, fx:{happy:3}, note:'A hobby that eases a rut (and builds your handy skill).' }] },
  { id:'pasta', name:'The Little Kiss Pasta Bar', ic:'🍝', lb:'Pasta bar', addr:'119 Main St.', st:'main', x:70, y:290, kind:'Pasta bar',
    desc:'A small pasta bar that\'s hard to get into. Fresh pasta, a short menu and a big night out.', hours:'Dinner, Wednesday to Saturday',
    acts:[{ id:'dinner', ic:'🍝', name:'Pasta dinner', cost:45, fx:{happy:6}, date:true },
          { id:'wine', ic:'🍷', name:'Dinner with a glass of wine', cost:60, fx:{happy:7}, date:true, min21:true }] },
  { id:'rouge', name:'Rouge Salon & Spa', ic:'💇', lb:'Salon', addr:'141 Main St.', st:'main', x:105, y:220, kind:'Salon and spa',
    desc:'Haircuts, color and spa days.', hours:'By appointment, Tuesday to Saturday',
    acts:[{ id:'cut', ic:'✂️', name:'A haircut', cost:35, fx:{happy:3}, note:`Looking sharp: better odds on job applications for ${LOOK_WEEKS} weeks.` },
          { id:'spa', ic:'🧖', name:'A spa day', cost:95, fx:{happy:6, health:1}, note:`Looking sharp for ${LOOK_WEEKS} weeks, too.` }] },
  { id:'legal', name:'Mother Hubbard\'s Legal Cupboard', ic:'⚖️', lb:'Law office', addr:'145 Main St.', st:'main', x:140, y:290, kind:'Law office',
    desc:'The town\'s law office: wills, estates and the closing papers when you buy a home.', hours:'Weekdays, by appointment',
    acts:[{ id:'will', ic:'📜', name:'Write a will', cost:300, fx:{happy:2}, once:true, minAge:25, note:'Once. Peace of mind for you and your family.' }] },
  { id:'junque', name:'The Junque Sisters', ic:'🛋️', lb:'Vintage', addr:'Town Hall building, Main St.', st:'main', x:175, y:220, kind:'Vintage and gift shop',
    desc:'Vintage finds, gifts and decor. Good for holiday shopping and for making a new place feel like home.', hours:'Thursday to Saturday · closed for a winter break in January and February',
    closed:WINTER_BREAK, closedWhy:'Closed for the winter break until March',
    acts:[{ id:'browse', ic:'🎁', name:'Browse for gifts and decor', cost:25, fx:{happy:3}, note:'Does more in November and December, or in your first 8 weeks in a new home.' }] },
  { id:'bank', name:'Standard Bearer Bank', ic:'🏦', lb:'Bank', addr:'215 Main St.', st:'main', x:260, y:290, kind:'Bank',
    desc:'Where your savings, your 401(k) and any loans live.', hours:'Weekdays',
    acts:[{ id:'banker', ic:'💬', name:'Sit down with a banker', cost:0, info:'bank', note:'See your savings and loans. Doesn\'t use a visit.' }] },
  { id:'clinic', name:'The Burg Clinic', ic:'🩺', lb:'Clinic', addr:'235 Main St.', st:'main', x:300, y:220, kind:'Medical clinic',
    desc:'The town clinic: checkups, and where you go when you\'re feeling run down.', hours:'Weekdays',
    acts:[{ id:'checkup', ic:'🩺', name:'A checkup', cost:150, fx:{health:5}, note:'Does more when your health is low.' }] },
  { id:'gather', name:'Grenache & Gather', ic:'🍷', lb:'Tasting', addr:'120 Main St.', st:'main', x:60, y:110, kind:'Wine tasting and guest-chef dinners',
    desc:'A tasting room with guest-chef dinners. Home of Grenache Fest. Tastings and the wine dinners are 21 and over; anyone can stop in for a cheese board.', hours:'Thursday to Sunday',
    acts:[{ id:'taste', ic:'🍷', name:'A wine tasting', cost:30, fx:{happy:4}, min21:true, date:true },
          { id:'chef', ic:'👩‍🍳', name:'A guest-chef dinner', cost:85, fx:{happy:7}, min21:true, date:true },
          { id:'board', ic:'🧀', name:'A cheese board and sparkling cider', cost:22, fx:{happy:3}, date:true }] },   // i26-b05: for any age
  { id:'basket', name:'Burg Basket Grocery', ic:'🛒', lb:'Grocery', addr:'200 Main St.', st:'main', x:240, y:110, kind:'Grocery store',
    desc:'The town grocery. A little pricier than the big stores in Walla Walla, but you see everybody.', hours:'Every day',
    acts:[{ id:'shop', ic:'🛒', name:'Shop local this week', cost:12, fx:{happy:1, community:2}, note:'A few dollars more than the big store, and a chat in every aisle (it counts for community once every 4 weeks).' }] },
  { id:'bean', name:'Howlin\' Bean', ic:'☕', lb:'Coffee', addr:'206 Main St.', st:'main', x:275, y:40, kind:'Coffee shop',
    desc:'Coffee and pastries, and the best place in town to run into people.', hours:'Mornings, most days',
    acts:[{ id:'coffee', ic:'☕', name:'Coffee and a pastry', cost:8, fx:{happy:2, community:1}, note:'You might run into someone you know.' }] },
  { id:'tonnage', name:'Tonnage Coffee & Strings', ic:'🪕', lb:'Jam', addr:'216 Main St.', st:'main', x:310, y:110, kind:'Private space with a bluegrass jam',
    desc:'A private space. It opens to the public only on community event days, like Celebration Days, and for a bluegrass jam every other week.', hours:'Bluegrass jam every other week · open on community event days',
    open:() => jamWeek() || festivalWeek(), closedWhy:'Private this week. The jam is next week.',
    acts:[{ id:'jam', ic:'🪕', name:'The bluegrass jam', cost:5, fx:{happy:3, community:3}, note:'A few dollars in the tip jar.' }] },
  { id:'tattler', name:'The Touchet Tattler', ic:'📰', lb:'Paper', addr:'216 Main St.', st:'main', x:345, y:40, kind:'Local newspaper',
    desc:'The town paper: council news, ballgames and the classifieds.', hours:'Out every week',
    acts:[{ id:'paper', ic:'📰', name:'Pick up the paper', cost:2, fx:{community:1} },
          { id:'ad', ic:'📣', name:'Place an ad for your side hustle', cost:15, note:`Side-hustle pay +${AD_BOOST * 100}% for ${AD_WEEKS} weeks.` }] },
  { id:'brick', name:'The Royal Brick', ic:'🎶', lb:'Wine bar', addr:'222 Main St.', st:'main', x:380, y:110, kind:'Wine bar with music nights',
    desc:'A wine bar in an old brick block, with music nights. Out-of-town visitors stay upstairs. The bar is 21 and over; the early open-mic hour is for everyone.', hours:'Evenings, Thursday to Saturday',
    acts:[{ id:'night', ic:'🍷', name:'An evening at the wine bar', cost:25, fx:{happy:3, community:2}, min21:true, date:true },
          { id:'openmic', ic:'🎸', name:'The all-ages open-mic hour', cost:5, fx:{happy:2, community:2}, note:'Early evening, before the bar crowd. A few dollars at the door.' }] },   // i26-b05
  { id:'mrq', name:'Mr. Q\'s Smokehouse', ic:'🍖', lb:'BBQ', addr:'405 Preston Ave.', st:'preston', x:256, y:104, kind:'Barbecue takeout',
    desc:'Barbecue takeout, smoked low and slow.', hours:'Thursday to Saturday, while the smoker\'s going',
    acts:[{ id:'bbq', ic:'🍖', name:'Barbecue takeout', cost:18, fx:{happy:3} }] },
  { id:'lad', name:'Laughing Lad Ale House', ic:'🍺', lb:'Ale house', addr:'444 Preston Ave.', st:'preston', x:291, y:68, kind:'Brewery taproom',
    desc:'A brewery taproom. The outdoor grill runs from late spring into fall.', hours:'Taproom most evenings · grill from May to October',
    acts:[{ id:'pint', ic:'🍺', name:'A pint in the taproom', cost:14, fx:{happy:3, community:1}, min21:true },
          { id:'grill', ic:'🍔', name:'A burger off the outdoor grill', cost:16, fx:{happy:3}, months:[4,5,6,7,8,9] }] },
  { id:'gulch', name:'Bourbon Gulch Sports Bar', ic:'🏈', lb:'Sports bar', addr:'701 Preston Ave.', st:'preston', x:334, y:38, kind:'Sports bar and grill',
    desc:'Burgers, the game on every screen, and families in the booths.', hours:'Every day',
    acts:[{ id:'game', ic:'🏈', name:'Dinner and the game', cost:28, fx:{happy:3, community:2} }] },
  { id:'garden', name:'Dreamy Garden Center', ic:'🌱', lb:'Garden', addr:'503 W. 2nd St.', st:'town', kind:'Garden center',
    desc:'Starts, seeds and hanging baskets for the spring.', hours:'Spring, March to June',
    open:() => [2,3,4,5].includes(curMonth()), closedWhy:'Closed until spring (March)',
    acts:[{ id:'starts', ic:'🌷', name:'Flats of starts for the yard', cost:30, fx:{happy:3, health:1}, note:'Does more for homeowners, and in your first 8 weeks in a new home.' }] },
  { id:'yoga', name:'Earth and Air Yoga', ic:'🧘', lb:'Yoga', addr:'Waitsburg', st:'town', kind:'Yoga studio',
    desc:'Evening yoga classes for every level.', hours:'Evening classes',
    acts:[{ id:'class', ic:'🧘', name:'An evening yoga class', cost:15, fx:{health:3, happy:2} }] },
  { id:'mcgrub', name:'McGrub & Grain Co.', ic:'🌾', lb:'Farm supply', addr:'115 Garden St.', st:'town', kind:'Farm supply',
    desc:'Seed, fertilizer and advice for the wheat farms around town.', hours:'Weekdays, and long days at harvest',
    acts:[{ id:'counter', ic:'🧢', name:'Talk shop at the farm counter', cost:0, fx:{community:1}, note:'Free. Farm folks (farm hands, ag techs and wheat growers) get more out of it every time; everyone else once a season.' }] },
  { id:'trades', name:'Local trades', ic:'🔨', lb:'Trades', addr:'Waitsburg', st:'town', kind:'Contractors',
    desc:'Fair Price Pours (concrete), Sharp Point Builders (construction), Tim\'s Trim & Timber (carpentry) and LC Spray & Spread (applicators). They fix roofs, porches and kitchens around town.', hours:'Weekdays',
    acts:[{ id:'call', ic:'📞', name:'Who to call for repairs', cost:0, info:'trades', note:'Doesn\'t use a visit.' }] }
];
const placeById = id => PLACES.find(p => p.id === id);
// i15-a02/i38-a11/i26-b02: visits do less near the top: gains taper from 80 to 92, no health at 70 or more (except the clinic),
// the farm counter helps non-farm folks once a season, and the grocery's chats count once every 4 weeks
const OUT_HEALTH_MAX = 70, MCGRUB_WEEKS = 13, BASKET_WEEKS = 4;
const outTaper = k => clamp((95 - S[k]) / 15, 0.2, 1);   // full strength to 80, a fifth from 92
const farmFolk = () => ['farmhand', 'agtech'].includes(S.jobId) && !S.retired || !!(S.biz && S.biz.type === 'wheat');
// a plain note on what this option won't do for you right now ('' when nothing is held back)
function outLimitNote(p, a){
  const o = outState(), fx = a.fx || {}, out = [];
  if (fx.health && p.id !== 'clinic' && S.health >= OUT_HEALTH_MAX) out.push(`No health from this while yours is ${OUT_HEALTH_MAX} or more: only a checkup adds health then.`);
  if (p.id === 'mcgrub' && !farmFolk() && S.turn - (o.mcg ?? -99) < MCGRUB_WEEKS) out.push(`You've talked shop here this season: once every ${MCGRUB_WEEKS} weeks unless you farm.`);
  if (p.id === 'basket' && S.turn - (o.last.basket ?? -99) < BASKET_WEEKS) out.push(`No community this time: the chats count once every ${BASKET_WEEKS} weeks.`);
  if (Object.entries(fx).some(([k, v]) => v > 0 && !(k === 'health' && p.id !== 'clinic' && S.health >= OUT_HEALTH_MAX) && outTaper(k) < 1)) out.push('Does less: that stat is already past 80.');
  return out.join(' ');
}
const actOf = (p, aid) => p.acts.find(a => a.id === aid);

/* ---- saved state: S.out ---- */
const outDefault = () => ({ wk:0, n:0, here:[], gain:{ happy:0, health:0, community:0 }, last:{}, ad:-99, look:-99, will:false, moved:-99, visits:0, mcg:-99 });
// this week's visits; reading never changes the save, only a visit does (write = true)
function outState(write){
  const d = outDefault(), o = S.out && typeof S.out === 'object' ? { ...d, ...S.out } : d;
  if (o.wk !== S.turn) Object.assign(o, { wk:S.turn, n:0, here:[], gain:{ happy:0, health:0, community:0 } });
  if (write) S.out = o;
  return o;
}
const visitsLeft = () => Math.max(0, OUT_MAX - outState().n);
const outAdBoost = () => S && S.out && S.turn - S.out.ad < AD_WEEKS ? 1 + AD_BOOST : 1;
const outLookBonus = () => S && S.out && S.turn - S.out.look < LOOK_WEEKS ? 0.06 : 0;
const newHome = () => S.out && S.turn - S.out.moved < 8;
function outMoved(){ outState(true).moved = S.turn; }

// why a place is closed this week ('' when it's open)
function placeClosed(p){
  if (p.closed && p.closed.includes(curMonth())) return p.closedWhy;
  if (p.open && !p.open()) return p.closedWhy;
  return '';
}
// which of a place's options show at all (drinks only for 21 and over)
const shownActs = p => p.acts.filter(a => !(a.min21 && age() < 21));
// i26-b05: a place where everything is 21 and over says so on its pin and in the list
const only21 = p => age() < 21 && p.acts.some(a => a.min21) && !shownActs(p).some(a => !a.info);
// why an option can't be done right now ('' when it can)
function actBlocked(p, a){
  if (awaySouth()) return 'You\'re in Arizona until April';   // i3-a30
  const shut = placeClosed(p); if (shut) return shut;
  if (a.min21 && age() < 21) return '21 and over';
  if (a.minAge && age() < a.minAge) return `From age ${a.minAge}`;
  if (a.months && !a.months.includes(curMonth())) return `Only ${MONTH_SPAN(a.months)}`;
  if (a.once && a.id === 'will' && hasWill()) return 'Done: your will is on file';
  if (a.info) return '';
  const o = outState();
  if (o.here.includes(p.id)) return 'You went here this week';
  if (o.n >= OUT_MAX) return `You've made your ${OUT_MAX} visits this week`;
  if (S.money < actCost(a)) return 'Not enough cash';
  return '';
}
const actCost = a => cost(a.cost) * (a.date && S.partner ? 2 : 1);
const actWhat = a => [a.cost ? fmt(actCost(a)) + (a.date && S.partner ? ' for two' : '') : 'Free', a.fx ? fxWords(a.fx) : ''].filter(Boolean).join(' · ');

// do it: pay, apply the (capped) effect, and return what happened
function visit(pid, aid){
  const p = placeById(pid), a = p && actOf(p, aid);
  if (!a) return { err:'That place isn\'t in town.' };
  const why = actBlocked(p, a); if (why) return { err:why };
  if (a.info) return { info:a.info };
  const o = outState(true), c = actCost(a);
  S.money -= c;
  let mult = S.turn - (o.last[pid] ?? -99) < OUT_REPEAT ? 0.5 : 1;   // back again so soon: less special
  if (a.date && S.partner) mult += 0.4;
  if (pid === 'clinic' && S.health < 50) mult *= 1.7;
  if (pid === 'junque' && ([10, 11].includes(curMonth()) || newHome())) mult *= 1.5;
  if (pid === 'garden' && (HOMES[S.home].own || newHome())) mult *= 1.5;
  if (pid === 'mcgrub' && farmFolk()) mult *= 2;
  const fx = { ...(a.fx || {}) };
  let extra = '';
  // i26-b02: free and cheap visits stop carrying an idle life
  if (pid === 'mcgrub' && !farmFolk()) { if (S.turn - (o.mcg ?? -99) < MCGRUB_WEEKS) delete fx.community; else o.mcg = S.turn; }
  if (pid === 'basket' && S.turn - (o.last.basket ?? -99) < BASKET_WEEKS) delete fx.community;
  if (pid !== 'clinic' && S.health >= OUT_HEALTH_MAX) delete fx.health;   // i38-a11: healthy already: only the clinic adds health
  if (pid === 'bean' && chance(0.35)) { fx.community = (fx.community || 0) + 3; extra = ' You ran into an old friend and talked for an hour.'; }
  const before = { happy:S.happy, health:S.health, community:S.community };
  for (const [k, v] of Object.entries(fx)) {
    const d = Math.min(v * mult * OUT_FX * (v > 0 ? outTaper(k) : 1), Math.max(0, OUT_WEEK_CAP - o.gain[k]));   // capped per stat per week; i15-a02: less in the 80s
    o.gain[k] += d; adj({ [k]: d });
  }
  if (pid === 'shavings') { practice('handy', 1); if (S.streakN > 4) S.streakN = Math.max(1, S.streakN - 2); }
  if (pid === 'rouge') o.look = S.turn;
  if (aid === 'ad') o.ad = S.turn;
  if (aid === 'will') { o.will = true; S.will = true; }   // i3-a33: the will is read when the grandkid takes over
  o.n++; o.here.push(pid); o.last[pid] = S.turn; o.visits++;
  const did = a.name.charAt(0).toLowerCase() + a.name.slice(1);
  log(`Out and about: ${did} at ${p.name}.`);
  return { msg:`${a.ic} ${a.name} at ${p.name}.${extra}`, money:-c, before };
}

/* ---- screens ---- */
function placeLine(p){
  const shut = placeClosed(p), acts = shownActs(p).filter(a => !a.info), from = acts.length ? Math.min(...acts.map(a => a.cost)) : null;
  if (!shut && only21(p)) return '21+: nothing here for you until you turn 21';
  return shut ? `Closed: ${shut.replace(/^Closed (for )?/i, '').replace(/^\w/, c => c.toLowerCase())}` : `Open this week${from != null ? ` · ${from ? 'from ' + fmtc(from) : 'free'}` : ''}`;
}
function outButton(){
  const n = visitsLeft();
  return `<button class="btn ghost outbtn" id="outbtn">🛍️ Out and about<small>${n ? `Visits left this week: ${n} of ${OUT_MAX}` : 'No visits left this week'}</small></button>`;
}
function outSheet(){
  const grp = (title, list) => `<h3 class="triph">${title}</h3>` + list.map(p => `<button class="kv job tripto" data-place="${p.id}"><span><span class="t">${p.ic} ${esc(p.name)}</span><span class="s">${esc(p.addr)} · ${placeLine(p)}</span></span><span aria-hidden="true">›</span></button>`).join('');
  sheet(`<h2>🛍️ Out and about</h2>
    <p class="muted">Quick visits around town, on top of your week's focus: up to ${OUT_MAX} a week, one per place. ${visitsLeft()} left this week. Going back within ${OUT_REPEAT} weeks is half as special, and visits do less as a stat climbs past 80.</p>
    ${grp('Main Street', PLACES.filter(p => p.st === 'main'))}${grp('Preston Avenue', PLACES.filter(p => p.st === 'preston'))}${grp('Around town', PLACES.filter(p => p.st === 'town' && !(p.hide && p.hide())))}
    <p class="muted">Places use stand-in names. Days and seasons last checked ${PLACES_CHECKED}.</p>
    <button class="btn ghost" id="no">Close</button>`);
  document.querySelectorAll('#sheet [data-place]').forEach(b => b.onclick = () => bizSheet(b.dataset.place, true));
  $('#no').onclick = closeSheet;
}
function bizJobs(p){ return JOBS.filter(j => j.place === p.id); }
function bizSheet(pid, fromList){
  const p = placeById(pid); if (!p) return;
  const shut = placeClosed(p), acts = shownActs(p), o = outState();
  const jobs = bizJobs(p).map(j => `<div class="kv"><span>💼 ${j.title}${S.jobId === j.id && !S.retired ? ' <span class="tag cur">Your job</span>' : ''}</span><span>${wk(payNow(j))}${j.edu ? ` · ${EDU[j.edu].replace(' diploma','').toLowerCase()}` : ''}</span></div>`).join('');
  const hidden = p.acts.length > acts.length;
  sheet(`<h2>${p.ic} ${esc(p.name)}</h2>
    <p class="evplace">📍 ${esc(p.addr)} · ${esc(p.kind)}</p>
    <p>${esc(p.desc)}</p>
    <p class="muted">🕒 ${esc(p.hours)}.<br><b>${shut ? '🚪 ' + esc(shut) + '.' : '✅ Open this week.'}</b></p>
    ${acts.map(a => { const why = actBlocked(p, a);
      return `<button class="stopbtn" data-act="${a.id}" ${why ? 'disabled' : ''}><span class="t">${a.ic} ${a.name}</span><span class="s">${why || actWhat(a)}</span>${a.note && !why ? `<span class="s">${a.note}</span>` : ''}${!why && outLimitNote(p, a) ? `<span class="s">${outLimitNote(p, a)}</span>` : ''}</button>`; }).join('')}
    ${hidden ? '<p class="muted">Drinks here are for 21 and over.</p>' : ''}
    ${acts.some(a => !a.info) ? `<p class="muted">Visits left this week: ${visitsLeft()} of ${OUT_MAX}.</p>` : ''}
    ${jobs ? `<h3 class="triph">Work here</h3>${jobs}<p class="muted">Apply on the Jobs tab.</p>` : ''}
    ${bizRecent(pid)}
    <div id="bizout" role="status"></div>
    ${fromList ? '<button class="btn ghost" id="back">All places</button>' : ''}
    <button class="btn ghost" id="no">Close</button>`);
  document.querySelectorAll('#sheet [data-act]').forEach(b => b.onclick = () => {
    const r = visit(pid, b.dataset.act);
    if (r.err) return toast(r.err);
    if (r.info) return r.info === 'bank' ? bankSheet(pid) : tradesSheet(pid);
    save(); render(); bizSheet(pid, fromList);
    $('#bizout').innerHTML = `<p><b>${r.msg}</b></p><p>${r.money ? `<span class="delta down">${fmt(r.money)}</span>` : ''}${deltaChips(r.before)}</p>`;
    toast(r.msg); announce(r.msg);
  });
  if ($('#back')) $('#back').onclick = outSheet;
  $('#no').onclick = closeSheet;
}
function bankSheet(pid){
  const row = (l, v) => `<div class="kv"><span>${l}</span><span>${v}</span></div>`;
  const h = HOMES[S.home];
  sheet(`<h2>🏦 Standard Bearer Bank</h2><p class="evplace">📍 215 Main St.</p>
    <p>A banker walks you through where your money stands.</p>
    ${row('Cash on hand', fmt(S.money))}${row('401(k) savings', `${fmt(S.k401 || 0)}${S.retired ? '' : ` · saving ${K401[S.k401rate || 0] * 100}%`}`)}
    ${h.own ? (outright() ? row('Home loan (mortgage)', 'None: paid for') : row('Home loan (mortgage)', `${wk(S.mortgage || cost(h.cost))}, locked in`)) : row('Home', HOMES[S.home].folks ? 'At your folks\' place' : 'Renting')}
    ${S.loanLeft > 0 ? row('Truck loan', `${wk(S.loanPay || CARS.truck.pay)} · ${Math.ceil(S.loanLeft / W)} payments left`) : ''}
    ${S.sloanLeft > 0 ? row('Student loan', `${wk(S.sloanPay)} · ${Math.ceil(S.sloanLeft / W)} payments left`) : ''}
    <p class="muted">${S.money < 0 ? 'You\'re overdrawn: debt costs about 1.5% a month in interest.' : 'Saving 5% or more in your 401(k) gets the 3% match.'} Change your 401(k) and buy a home or vehicle on the Life tab: the bank handles the loans.</p>
    <button class="btn primary" id="back">Back</button><button class="btn ghost" id="no">Close</button>`);
  $('#back').onclick = () => bizSheet(pid, true); $('#no').onclick = closeSheet;
}
function tradesSheet(pid){
  sheet(`<h2>🔨 Local trades</h2>
    <p>When something breaks, these are the folks around town who fix it:</p>
    <div class="kv"><span>🧱 Fair Price Pours</span><span>Concrete</span></div><div class="kv"><span>🏗️ Sharp Point Builders</span><span>Construction</span></div>
    <div class="kv"><span>🪚 Tim's Trim & Timber</span><span>Carpentry</span></div><div class="kv"><span>🚜 LC Spray & Spread</span><span>Applicators</span></div>
    <p class="muted">${HOMES[S.home].own ? 'They handle storm damage and fixer-upper work on your home. Your handy skill cuts the bill.' : 'You rent, so your landlord calls them. Buy a home and the repairs are yours.'} Sharp Point Builders also takes on apprentices (Jobs tab).</p>
    <button class="btn primary" id="back">Back</button><button class="btn ghost" id="no">Close</button>`);
  $('#back').onclick = () => bizSheet(pid, true); $('#no').onclick = closeSheet;
}
// events at a place in the last 4 weeks
function bizRecent(pid){
  const r = (S.evPins || []).filter(x => OUT_EVENT_BIZ[x.t] === pid && S.turn - x.turn <= 4); if (!r.length) return '';
  return `<div class="recent"><b>📍 Recently here</b>${r.map(x => `<div class="s">${x.ic} ${esc(x.t)} · ${S.turn - x.turn <= 1 ? 'this week' : (S.turn - x.turn) + ' weeks ago'}${x.r ? `: ${esc(x.r)}` : ''}</div>`).join('')}</div>`;
}

/* ---- maps: the Main Street close-up, and Preston Avenue pins on the town map ---- */
const MSW = 420, MSH = 330;
function mainStreetSVG(){
  let s = `<svg class="mapsvg msmap" viewBox="0 0 ${MSW} ${MSH}" role="group" aria-label="Main Street close-up: tap a business">
    <rect width="${MSW}" height="${MSH}" style="fill:var(--map-block)"/>
    <rect x="0" y="150" width="${MSW}" height="30" style="fill:var(--map-road)"/><path d="M0 165 H${MSW}" stroke="#c9b48a" stroke-width="1.5" stroke-dasharray="10 8"/>
    <rect x="203" y="0" width="14" height="${MSH}" style="fill:var(--map-road)"/>
    <text x="100" y="169" class="mlbl" text-anchor="middle" font-weight="700">Main St. · 100 block</text><text x="318" y="169" class="mlbl" text-anchor="middle" font-weight="700">200 block</text>
    <text x="${MSW - 6}" y="${MSH - 4}" class="mlbl" text-anchor="end" font-size="7.5">Not to scale</text>`;
  for (const p of PLACES.filter(x => x.st === 'main')) {
    const shut = !!placeClosed(p) || only21(p), recent = (S.evPins || []).find(x => OUT_EVENT_BIZ[x.t] === p.id && S.turn - x.turn <= 4);
    s += `<g class="mpin mspin" data-biz="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}, ${esc(p.addr)}: ${only21(p) ? '21 and over' : shut ? 'closed this week' : 'open this week'}" data-call="BIZTAP" data-arg="${p.id}">
      <circle cx="${p.x}" cy="${p.y}" r="42" fill="transparent"/><circle cx="${p.x}" cy="${p.y}" r="15" style="fill:${shut ? 'var(--map-pin-off)' : 'var(--map-pin)'};stroke:var(--map-ink)" stroke-width="1.4"${shut ? ' stroke-dasharray="3 2"' : ''}/>
      <text x="${p.x}" y="${p.y + 5.5}" font-size="15" text-anchor="middle">${p.ic}</text>
      <text x="${p.x}" y="${p.y + 27}" class="mtown" text-anchor="middle">${p.lb}${only21(p) ? ' 21+' : ''}</text></g>`;
    if (recent) s += `<g class="evbadge" pointer-events="none"><circle cx="${p.x + 14}" cy="${p.y - 12}" r="9" fill="#ffd166" stroke="#9b2f1f" stroke-width="1.5"/><text x="${p.x + 14}" y="${p.y - 8}" font-size="10" text-anchor="middle">${recent.ic}</text></g>`;
  }
  return s + '</svg>';
}
function mainStreetBlock(){
  return `<h3 class="triph">🔍 Main Street close-up</h3>${mainStreetSVG()}
    <div class="mapcap">Tap a business for its card: when it's open and what you can do there. Dashed pins are closed this week.</div>
    <button class="btn ghost" data-call="outSheet">🛍️ Out and about: every place in town</button>`;
}
// Preston Avenue businesses as pins on the town map (along Highway 12 heading out toward Dayton)
const outTownPins = () => PLACES.filter(p => p.st === 'preston').map(p => ({ k:p.id, lb:p.lb, ic:p.ic, x:p.x, y:p.y, name:p.name, biz:p.id, desc:`${p.desc} ${p.addr}.` }));
function outTownDetail(p){
  const b = placeById(p.biz), f = p.focus && FOCUS[p.focus];
  const btn = !f ? '' : S.focus === p.focus ? `<span class="tag cur">This week's focus: ${f.name}</span>`
    : `<button class="sm" data-call="MAPFOCUS" data-arg="${p.focus}">${f.ic} Spend this week here</button>`;
  return `<div class="card mapdet"><h3>${b.ic} ${esc(b.name)}</h3><p style="margin:0 0 4px;font-size:0.875rem">${p.work ? `You work here as ${esc(p.work.toLowerCase())}. ` : ''}${esc(b.desc)}</p>
    <p class="muted" style="margin:0 0 8px">📍 ${esc(b.addr)} · ${placeLine(b)}</p>
    <button class="sm alt" data-call="BIZTAP" data-arg="${b.id}">🛍️ Visit or see the card</button> ${btn}${recentList('T', p.k)}</div>`;
}
window.BIZTAP = id => bizSheet(id);

/* ---- jobs at local businesses (#52): pay in line with the rest of the table ---- */
Object.assign(jobById('diner'), { title:'Line cook', where:'Bourbon Gulch Sports Bar', place:'gulch' });
JOBS.push(
  {id:'barista',   city:'waitsburg', title:'Barista',           where:'Howlin\' Bean',       place:'bean',    pay:3050, edu:0, stress:.3, wear:.3},
  {id:'grocer',    city:'waitsburg', title:'Grocery clerk',     where:'Burg Basket Grocery', place:'basket',  pay:3100, edu:0, stress:.3, wear:.4},
  {id:'reporter',  city:'waitsburg', title:'Reporter',          where:'The Touchet Tattler', place:'tattler', pay:3300, edu:0, stress:.6, wear:.1},
  {id:'teller',    city:'waitsburg', title:'Bank teller',       where:'Standard Bearer Bank',place:'bank',    pay:3250, edu:0, stress:.5, wear:0},
  {id:'apprentice',city:'waitsburg', title:'Trades apprentice', where:'Sharp Point Builders',place:'trades',  pay:3400, edu:0, stress:.4, wear:1.0, outdoor:1},
  {id:'medasst',   city:'waitsburg', title:'Medical assistant', where:'The Burg Clinic',     place:'clinic',  pay:3300, edu:1, stress:.5, wear:.3},
  {id:'agtech',    city:'waitsburg', title:'Ag technician',     where:'McGrub & Grain Co.',  place:'mcgrub',  pay:3600, edu:1, stress:.4, wear:.5, outdoor:1}
);
Object.assign(LAYOFF_RISK, { barista:1, grocer:.5, reporter:1, teller:.5, apprentice:1, medasst:.2, agtech:.5 });
// where each Waitsburg job is on the town map (its spot becomes the "Work extra hours" place)
Object.assign(WORK_SPOT, { diner:'gulch', barista:'mainst', grocer:'mainst', reporter:'mainst', teller:'mainst', apprentice:'mainst', medasst:'mainst', agtech:'elevator' });

/* ---- business events (#51) ---- */
const OUT_EVENTS = [
  { ic:'🪕', title:'Bluegrass jam at Tonnage', biz:'tonnage', w:2, when:() => jamWeek(S.turn + 1),   // i22-a13: rolled this week, shown next week (after the turn ticks)
    text:'Tonnage Coffee & Strings is a private space most days, but every other week it opens its doors for a bluegrass jam. Bring an instrument or just listen.',
    choices:() => [
      {label:`Go listen (-${fmtc(5)} in the tip jar)`, go:() => { adj({money:-cost(5), happy:3, community:2}); return 'A banjo, two fiddles and half the town tapping their feet.'; }},
      {label:'Bring a guitar and sit in', if:() => S.community >= 45, go:() => { adj({happy:4, community:3}); return 'You fumbled the first chorus and nailed the second. They want you back in two weeks.'; }},
      {label:'Stay home', go:() => 'You could hear it from down the street.'}
    ]},
  { ic:'🎪', title:'Tonnage opens for Celebration Days', biz:'tonnage', yr:1, w:2, when:m => inM(m,4),
    text:'For Celebration Days, Tonnage Coffee & Strings opens to everyone: coffee, music on the sidewalk and a view of the parade.',
    choices:() => [
      {label:`Stop in (-${fmtc(10)})`, go:() => { adj({money:-cost(10), happy:3, community:2}); return 'Coffee, a fiddle tune and the best parade view on Main.'; }},
      {label:'Keep walking', go:() => 'Maybe next time the doors are open.'}
    ]},
  { ic:'🍇', title:'Grenache Fest', biz:'gather', yr:1, w:3, when:m => inM(m,3) && age() >= 21,
    text:'Grenache & Gather is pouring grenache from all over the valley, with a guest chef in the kitchen.',
    choices:() => [
      {label:`Get a ticket (-${fmtc(65)})`, go:() => { adj({money:-cost(65), happy:5, community:1}); return 'Good wine, good food, and you met three winemakers.'; }},
      {label:'Pass this year', go:() => 'You heard it was a good one.'}
    ]},
  { ic:'🎶', title:'Music night at The Royal Brick', biz:'brick', w:2, when:() => age() >= 21,
    text:'A band from Walla Walla is playing The Royal Brick on Saturday night.',
    choices:() => [
      {label:`Go (-${fmtc(25)})`, go:() => { adj({money:-cost(25), happy:4, community:2}); return 'Standing room only, and the band played two encores.'; }},
      {label:'Early night', go:() => 'You slept well, at least.'}
    ]},
  // i26-b05: the same band plays an early all-ages set, so under-21s get music night too
  { ic:'🎸', title:'All-ages show at The Royal Brick', biz:'brick', w:2, when:() => age() < 21,
    text:'A band from Walla Walla plays an early show at The Royal Brick on Saturday. It\'s for all ages, and it ends before the bar opens.',
    choices:() => [
      {label:`Go (-${fmtc(12)})`, go:() => { adj({money:-cost(12), happy:4, community:2}); return 'You stood up front, and the drummer tossed you a broken stick.'; }},
      {label:'Early night', go:() => 'You slept well, at least.'}
    ]},
  { ic:'🍔', title:'The grill is open at Laughing Lad', biz:'lad', yr:1, w:3, when:m => inM(m,4),
    text:'Laughing Lad Ale House fired up its outdoor grill for the season. The patio is full.',
    choices:() => [
      {label:`Grab a burger on the patio (-${fmtc(16)})`, go:() => { adj({money:-cost(16), happy:3, community:1}); return 'First burger off the grill this year. Summer\'s coming.'; }},
      {label:'Not tonight', go:() => 'The grill runs into fall. There\'s time.'}
    ]},
  { ic:'🪵', title:'Simply Shavings is back', biz:'shavings', yr:1, w:2, when:m => inM(m,2),
    text:'Simply Shavings is back from its winter break, with a spring class schedule taped to the door.',
    choices:() => [
      {label:`Sign up for a class (-${fmtc(40)})`, go:() => { adj({money:-cost(40), happy:3}); practice('handy', 1); return 'You made a cutting board. It\'s only a little crooked.'; }},
      {label:'Just say welcome back', go:() => { adj({community:1}); return 'They were glad to see you.'; }}
    ]},
  { ic:'🛋️', title:'The Junque Sisters reopen', biz:'junque', yr:1, w:2, when:m => inM(m,2),
    text:'The Junque Sisters are back from their winter break with a shop full of new old things.',
    choices:() => [
      {label:`Browse (-${fmtc(25)})`, go:() => { adj({money:-cost(25), happy:3}); return 'You found a lamp you didn\'t know you needed.'; }},
      {label:'Window shop', go:() => 'You\'ll be back.'}
    ]},
  { ic:'🌱', title:'Spring rush at Dreamy Garden Center', biz:'garden', yr:1, w:3, when:m => inM(m,3,4),
    text:'It\'s the busiest week of the year at Dreamy Garden Center: tomato starts, hanging baskets and cookies by the register.',
    choices:() => [
      {label:`Fill the truck with starts (-${fmtc(40)})`, go:() => { adj({money:-cost(40), happy: HOMES[S.home].own ? 5 : 3, health:1}); return HOMES[S.home].own ? 'Your yard is going to look great this summer.' : 'Pots on the windowsill count as a garden.'; }},
      {label:'Help carry flats for the older folks', go:() => { adj({community:3, health:-1}); return 'Sore back, lots of thank-yous.'; }}
    ]},
  { ic:'🍖', title:'Cookout at Mr. Q\'s', biz:'mrq', yr:1, w:3, when:m => inM(m,6,7),
    text:'Mr. Q\'s Smokehouse is throwing a summer cookout on Preston Avenue. Brisket, beans and a cornhole tournament.',
    choices:() => [
      {label:`Go hungry (-${fmtc(20)})`, go:() => { adj({money:-cost(20), happy:4, community:2}); return 'You lost at cornhole and won at brisket.'; }},
      {label:'Skip it', go:() => 'The smoke drifted all the way to your place.'}
    ]},
  { ic:'🍝', title:'A table at The Little Kiss', biz:'pasta', w:1, when:() => S.money > cost(500),
    text:'Somebody canceled, and The Little Kiss Pasta Bar has a table for you tonight. You\'ve been trying for weeks.',
    choices:() => [
      {label:`Take it (-${fmtc(S.partner ? 90 : 45)})`, go:() => { adj({money:-cost(S.partner ? 90 : 45), happy:S.partner ? 7 : 5}); return 'Fresh pasta, a candle on the table and no rush. Worth the wait.'; }},
      {label:'Not tonight', go:() => 'You\'ll keep trying.'}
    ]}
];
EVENTS.push(...OUT_EVENTS);
// where business events happen (the Main Street ones also show on the close-up), and the events that moved to real places
const OUT_EVENT_BIZ = { 'Feeling run down':'clinic', 'An inheritance':'legal', 'Someone catches your eye':'bean' };
for (const e of OUT_EVENTS) OUT_EVENT_BIZ[e.title] = e.biz;
for (const [t, b] of Object.entries(OUT_EVENT_BIZ)) EVENT_PLACE[t] = ['T', placeById(b).st === 'preston' ? b : 'mainst'];

// i50-a04: the Life tab's Around town card is gone; its grocery tip lives in the Food & utilities line of the week's money details
// a line of local news for the week's details
const TATTLER = [
  'Council debates the new crosswalk on Main Street.', 'The Cardinals win at home in overtime.', 'Library story hour moves to Saturdays.',
  'Wheat prices tick up at the elevator.', 'The levee committee wants volunteers.', 'A letter to the editor about loose dogs.',
  'The fairgrounds get a fresh coat of paint.', 'Classifieds: a good used truck, cheap.', 'Bluegrass jam draws a crowd at Tonnage.'
];
const tattlerLine = () => S && !S.practice ? `<p class="muted" style="margin-top:10px">📰 In The Touchet Tattler this week: ${TATTLER[S.turn % TATTLER.length]}</p>` : '';
