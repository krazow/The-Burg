// The Burg: owner.js (loads after help.js, before boot.js; scripts share one global scope)
/* ============================================================
   🔧 OWNER PANEL (feature-flag plan): a hidden sheet for the game's owner. It opens with ?owner in the address or
   7 quick taps on the version line (title screen and Menu). Every feature can follow the life's difficulty
   (Default), or be forced on or off. Choices are saved on this device only (DIFF_FLAGS_KEY), and a new life takes
   a copy when it starts (S.flags). "Apply to this life now" copies them into the open life. A life that uses them
   is marked (S.flagsEdited): its best goes on the Custom shelf and it never joins the Easy, Normal, Hard or Classic
   lists. Weekly challenges, story challenges and the practice life never use them. Not in Help, the tutorial or
   What's new on purpose.
   Names and areas come from the feature-flag inventory (b = turning it off changes the balance, lock = core loop).
   ============================================================ */
const OWNER_AREAS = ["Core loop (locked)", "Jobs & work", "School & training", "Money & investing", "Housing & vehicles", "Family & relationships", "Health & aging", "Weather", "Town & Out and about", "Trips & maps", "Event packs", "Business & skills", "Retirement & legacy", "Score, goals & challenges", "UI helpers & assists", "Help & tutorial"];
const FEATURE_INFO = {
  'core.week': { n:"Weekly turn", a:0, b:1, lock:1 },
  'core.focus': { n:"Weekly focus (work/rest/community/outdoors)", a:0, b:1, lock:1 },
  'core.jobs': { n:"Jobs list and pay", a:0, b:1, lock:1 },
  'core.saves': { n:"Save slots and autosave", a:0, lock:1 },
  'core.score': { n:"Life Score (base)", a:0, b:1, lock:1 },
  'core.bills': { n:"Rent, food, insurance bills", a:0, b:1, lock:1 },
  'jobs.interview': { n:"Interviews, hire odds and negotiating", a:1, b:1 },
  'jobs.perks': { n:"Sign-on bonuses and clearances", a:1, b:1 },
  'jobs.ladder': { n:"Promotions ladder", a:1, b:1 },
  'jobs.layoffs': { n:"Layoffs, furloughs and unemployment", a:1, b:1 },
  'jobs.union': { n:"Unions and strikes", a:1, b:1 },
  'jobs.seasonal': { n:"Seasonal work rhythms", a:1, b:1 },
  'jobs.hustle': { n:"Side hustle focus", a:1, b:1 },
  'jobs.commute': { n:"Carpool, bus and remote work", a:1, b:1 },
  'jobs.events': { n:"Work events", a:1, b:1 },
  'school': { n:"School and diplomas", a:2, b:1 },
  'school.certs': { n:"Certificates", a:2, b:1 },
  'money.k401': { n:"401(k) with match and vesting", a:3, b:1 },
  'money.index': { n:"Index funds, market and wine futures", a:3, b:1 },
  'money.insuranceChoices': { n:"Insurance choices", a:3, b:1 },
  'money.collections': { n:"Collections and debt plans", a:3, b:1 },
  'money.bankruptcy': { n:"Bankruptcy", a:3, b:1 },
  'money.outlook': { n:"Money outlook sheet", a:3 },
  'money.inflation': { n:"Price and wage growth", a:3, b:1 },
  'home.buy': { n:"Buying a home", a:4, b:1 },
  'home.market': { n:"Housing market moods", a:4, b:1 },
  'home.loans': { n:"Refinance and home equity loans", a:4, b:1 },
  'home.propertyTax': { n:"Property tax", a:4, b:1 },
  'car.buy': { n:"Buying vehicles", a:4, b:1 },
  'car.upkeep': { n:"Oil changes, breakdowns and tabs", a:4, b:1 },
  'family.partner': { n:"Partner", a:5, b:1 },
  'family.kids': { n:"Kids", a:5, b:1 },
  'family.pets': { n:"Dog and barn cat", a:5, b:1 },
  'family.dadCare': { n:"Caring for Dad", a:5, b:1 },
  'family.council': { n:"Town council", a:5, b:1 },
  'health.sickHours': { n:"Sick hours", a:6, b:1 },
  'health.injuries': { n:"Injuries and physical therapy", a:6, b:1 },
  'health.coverage': { n:"Dental and ambulance coverage", a:6, b:1 },
  'health.events': { n:"Health events (personal days, flu, tooth)", a:6, b:1 },
  'health.careStops': { n:"Care stops (shots, senior van, respite)", a:6, b:1 },
  'health.paidLeave': { n:"Paid family leave", a:6, b:1 },
  'health.agingDrift': { n:"Aging health drift", a:6, b:1 },
  'health.lateCare': { n:"Late-life care and LTC insurance", a:6, b:1 },
  'weather': { n:"Weather and hard years", a:7, b:1 },
  'weather.smoke': { n:"Wildfire smoke rule", a:7, b:1 },
  'weather.homeDamage': { n:"Home damage: flood, dry-out and roof list", a:7, b:1 },
  'weather.neighbors': { n:"Neighbors help and block captain", a:7, b:1 },
  'weather.events': { n:"Weather events", a:7, b:1 },
  'out': { n:"Out and about", a:8, b:1 },
  'out.bizJobs': { n:"Business jobs", a:8, b:1 },
  'out.extras': { n:"Bank, trades sheets and Town Tattler", a:8 },
  'out.events': { n:"Out and about events", a:8, b:1 },
  'town.seasonGoals': { n:"Seasonal town goals", a:8, b:1 },
  'town.walk': { n:"Neighbor walk card", a:8, b:1 },
  'trips': { n:"Trips around the region", a:9, b:1 },
  'trips.roadEvents': { n:"Road events", a:9, b:1 },
  'trips.ski': { n:"Bluewood ski pass", a:9, b:1 },
  'maps': { n:"Region, town and Main Street maps", a:9 },
  'events': { n:"Random events (master)", a:10, b:1 },
  'events.packW2': { n:"Town events wave 2", a:10, b:1 },
  'events.packA1': { n:"Waitsburg pack A part 1", a:10, b:1 },
  'events.story': { n:"Story chains", a:10, b:1 },
  'biz': { n:"Own a business", a:11, b:1 },
  'biz.wheat': { n:"Wheat lease", a:11, b:1 },
  'biz.truck': { n:"Food truck", a:11, b:1 },
  'biz.shop': { n:"Woodworking shop", a:11, b:1 },
  'biz.cattle': { n:"Cattle", a:11, b:1 },
  'skills': { n:"Skills", a:11, b:1 },
  'retire.income': { n:"Retirement income rules (SS, pensions, RMDs)", a:12, b:1 },
  'retire.south': { n:"Winters south", a:12, b:1 },
  'retire.host': { n:"Spare-room guests", a:12, b:1 },
  'legacy.will': { n:"Wills and probate", a:12, b:1 },
  'legacy.heirs': { n:"Play as your heir", a:12 },
  'legacy.scholarship': { n:"Endow a scholarship", a:12, b:1 },
  'score.aims': { n:"Life aims", a:13, b:1 },
  'score.reportCards': { n:"Quarterly report cards", a:13, b:1 },
  'score.debtDrag': { n:"Debt drag on score", a:13, b:1 },
  'goals.badges': { n:"Badges and picked goals", a:13, b:1 },
  'challenges.scenarios': { n:"Scenario challenges", a:13 },
  'challenges.weekly': { n:"Weekly challenge", a:13 },
  'modes': { n:"Relaxed and Hard modes", a:13, b:1 },
  'backgrounds': { n:"Starting backgrounds", a:13, b:1 },
  'lengths.life': { n:"Lifetime length", a:13 },
  'score.history': { n:"Records, life story and share", a:13 },
  'ui.plan': { n:"Plan rotation", a:14 },
  'ui.auto': { n:"Skip and Auto play", a:14 },
  'ui.undo': { n:"Life tab undo", a:14 },
  'ui.checklist': { n:"Getting-started checklist", a:14 },
  'ui.recap': { n:"Welcome-back recap", a:14 },
  'ui.nudges': { n:"Install and backup nudges", a:14 },
  'ui.milestones': { n:"Year in review and milestone cards", a:14 },
  'ui.explain': { n:"Week details, stat reasons and focus preview", a:14 },
  'help.tutorial': { n:"Practice-life tutorial", a:15 },
  'help.inline': { n:"First-time explainers and glossary", a:15 },
  'help.whatsNew': { n:"What's new", a:15 }
};
const OWNER_TEXT = {
  intro: 'Turn parts of the game on or off on this device. Default follows the life\'s mode. Your picks start with each new life.',
  lifeOn: 'This life uses owner settings, so its score goes on the Custom shelf.',
  lifeOff: 'This life plays the normal way. Tap Apply to use these picks now.',
  lifeLocked: 'This life is a challenge or practice, so it plays the normal way.',
  noLife: 'No life is open. A new life will use these picks.',
  view: 'Show each part as it would be in this mode.',
  locked: 'Always on. The game needs it.',
  reset: 'All parts are back to their defaults.',
  applied: 'Owner settings are now on for this life.'
};
const OWNER_VALS = [['def', 'Default'], ['on', 'Force on'], ['off', 'Force off']];
// the overrides saved on this device, cleaned: known, unlocked keys with true or false only
function cleanFlags(o){
  const out = {};
  if (o && typeof o === 'object' && !Array.isArray(o)) for (const k in o) if (FEATURE_INFO[k] && !FEATURE_INFO[k].lock && typeof o[k] === 'boolean') out[k] = o[k];
  return out;
}
function ownerFlags(){
  try { return cleanFlags(JSON.parse(localStorage.getItem(DIFF_FLAGS_KEY) || 'null')); } catch (e) { return {}; }
}
function setOwnerFlags(o){
  const c = cleanFlags(o);
  try { if (Object.keys(c).length) localStorage.setItem(DIFF_FLAGS_KEY, JSON.stringify(c)); else localStorage.removeItem(DIFF_FLAGS_KEY); } catch (e) {}
}
// can this life (or one started with these options) use owner settings? Never weekly, story challenges or practice
const ownerFree = (s = S) => !!s && !s.weekly && !SCENARIOS[s.scenario] && !s.practice;
// the copy a new life takes when it starts (null when nothing is set or the life can't use it)
function newLifeFlags(opts = {}){
  if (opts.weekly || SCENARIOS[opts.scenario] || opts.practice) return null;
  const o = ownerFlags(); return Object.keys(o).length ? o : null;
}
// the extra fields on() needs to see a new life's settings before the life exists (start screen, newGame)
const ownerCtx = (opts = {}) => { const f = newLifeFlags(opts); return f ? { flags: f, flagsEdited: true } : {}; };
// is any override in play: saved on this device, or in the open life?
const lifeFlagged = (s = S) => !!(s && s.flagsEdited && s.flags && Object.keys(s.flags).length);
const ownerActive = () => Object.keys(ownerFlags()).length > 0 || lifeFlagged();
const ownerChip = () => ownerActive() ? '<button class="chip ownchip" id="ownchip" data-call="ownerPanel">🔧 Owner settings on</button>' : '';
// the open life takes the device's settings now (it stays marked even if they are all back to Default)
function applyOwnerNow(){
  if (!ownerFree()) return false;
  const o = ownerFlags();
  if (!Object.keys(o).length && !S.flagsEdited) return false;
  S.flags = o; S.flagsEdited = true;
  save(); return true;
}
let OWNER_VIEW = null;
// the Developer button in Settings: it shows on a device once the panel has been opened the hidden way
const DEV_KEY = 'burg-dev';
const devUnlocked = () => { try { return localStorage.getItem(DEV_KEY) === '1'; } catch (e) { return false; } };
let OWNER_FROM = null;                            // null, or { menu } when opened from Settings: Done goes back there
function devPanel(fromMenu = false){ OWNER_FROM = { menu: fromMenu }; ownerPanel(); }
function ownerPanel(keep = null){
  try { localStorage.setItem(DEV_KEY, '1'); } catch (e) {}
  const o = ownerFlags(), view = DIFFS[OWNER_VIEW] ? OWNER_VIEW : S ? diff() : 'normal';
  OWNER_VIEW = view;
  const ctx = { diff: view, flags: o, flagsEdited: true };
  const val = k => o[k] === true ? 'on' : o[k] === false ? 'off' : 'def';
  const name = k => FEATURE_INFO[k] ? FEATURE_INFO[k].n : k;
  const row = k => {
    const f = FEATURE_INFO[k], tier = FEATURE_TIER[k] || 'normal', deps = FEATURE_DEPS[k] || [];
    const offDeps = deps.filter(d => !on(d, ctx)), blocked = offDeps.length > 0, now = on(k, ctx);
    const tags = `<span class="tag" data-tier="${tier}">${DIFFS[tier].ic} ${DIFFS[tier].label}</span>${f.b ? '<span class="tag ownbal">⚖️ changes balance</span>' : ''}`;
    const seg = f.lock ? `<div class="s ownlock">🔒 ${OWNER_TEXT.locked}</div>`
      : `<div class="seg" role="group" aria-label="${esc(f.n)}">${OWNER_VALS.map(([v, l]) => {
          const dis = blocked && !(v === 'def' && val(k) !== 'def');
          return `<button data-own="${k}" data-v="${v}" class="${val(k) === v ? 'on' : ''}" aria-pressed="${val(k) === v}"${dis ? ' disabled' : ''}>${l}</button>`; }).join('')}</div>`;
    const note = [deps.length ? `Needs: ${deps.map(name).join(', ')}.` : '', blocked ? `<b class="ownblock">Off because ${offDeps.map(name).join(', ')} ${offDeps.length > 1 ? 'are' : 'is'} off.</b>` : '',
      f.lock ? '' : `In ${DIFFS[view].label}: <b data-now>${now ? 'on' : 'off'}</b>${val(k) === 'def' ? '' : ' (forced)'}.`].filter(Boolean).join(' ');
    return `<div class="setrow ownrow${blocked ? ' blocked' : ''}" data-key="${k}"><div class="setl">${esc(f.n)} ${tags}</div>${seg}${note ? `<div class="s">${note}</div>` : ''}</div>`;
  };
  const n = Object.keys(o).length, free = ownerFree();
  const life = !S ? OWNER_TEXT.noLife : !free ? OWNER_TEXT.lifeLocked : lifeFlagged() || S.flagsEdited ? OWNER_TEXT.lifeOn : OWNER_TEXT.lifeOff;
  sheet(`<h2>🛠️ Developer</h2><h3 style="margin-top:0">🚩 Feature flags</h3><p class="muted">${OWNER_TEXT.intro}</p>
    <div class="card tip" id="ownstate" role="status">${n ? `<b>${n} ${n === 1 ? 'part is' : 'parts are'} forced.</b>` : '<b>Everything is on Default.</b>'} ${life}</div>
    <div class="setrow"><div class="setl">${OWNER_TEXT.view}</div><div class="seg" role="group" aria-label="Mode">${DIFF_LIST.map(d =>
      `<button data-ownview="${d}" class="${d === view ? 'on' : ''}" aria-pressed="${d === view}">${DIFFS[d].ic} ${DIFFS[d].label}</button>`).join('')}</div></div>
    ${S && free ? '<button class="btn primary" id="ownapply">Apply to this life now</button>' : ''}
    <button class="btn ghost" id="ownreset"${n ? '' : ' disabled'}>Reset all to defaults</button>
    ${OWNER_AREAS.map((a, i) => { const ks = Object.keys(FEATURE_INFO).filter(k => FEATURE_INFO[k].a === i);
      return ks.length ? `<h3 style="margin-top:14px" data-area="${i}">${esc(a)}</h3>${ks.map(row).join('')}` : ''; }).join('')}
    <button class="btn ghost" id="ownclose">${OWNER_FROM ? '← Back to Settings' : 'Done'}</button>`);
  $('#sheet').classList.add('owner');
  document.querySelectorAll('#sheet [data-own]').forEach(b => b.onclick = () => {
    const k = b.dataset.own, v = b.dataset.v, cur = ownerFlags();
    if (v === 'def') delete cur[k]; else cur[k] = v === 'on';
    setOwnerFlags(cur); ownerPanel({ sel: `[data-own="${k}"][data-v="${v}"]`, top: $('#sheet').scrollTop });
    announce(`${name(k)}: ${b.textContent}`);
  });
  document.querySelectorAll('#sheet [data-ownview]').forEach(b => b.onclick = () => { OWNER_VIEW = b.dataset.ownview; ownerPanel({ sel: `[data-ownview="${OWNER_VIEW}"]`, top: $('#sheet').scrollTop }); });
  $('#ownreset').onclick = () => { setOwnerFlags({}); ownerPanel({ sel: '#ownclose' }); announce(OWNER_TEXT.reset); toast(OWNER_TEXT.reset); };
  if ($('#ownapply')) $('#ownapply').onclick = () => { if (applyOwnerNow()) { toast(OWNER_TEXT.applied); announce(OWNER_TEXT.applied); } ownerPanel({ sel: '#ownapply' }); };
  $('#ownclose').onclick = () => { const from = OWNER_FROM; OWNER_FROM = null; if (from) { if (S) render(); else renderTitle(); settingsSheet(from.menu, { sel: '#devbtn' }); return; } closeSheet(); if (S) render(); else renderTitle(); };
  if (keep) { if (keep.top != null) $('#sheet').scrollTop = keep.top; const b = keep.sel && $(`#sheet ${keep.sel}`); setTimeout(() => { if (b && !b.disabled) b.focus({ preventScroll: true }); }, 40); }
}
// 7 quick taps on the version line open the panel (a pause of more than a second starts the count again)
const OWNER_TAPS = 7, OWNER_TAP_GAP = 1000;
let OWNER_TAP = { n: 0, at: 0 };
document.addEventListener('click', e => {
  const el = e.target && e.target.closest && e.target.closest('[data-ver]');
  if (!el) return;
  const now = Date.now();
  OWNER_TAP = { n: now - OWNER_TAP.at > OWNER_TAP_GAP ? 1 : OWNER_TAP.n + 1, at: now };
  if (OWNER_TAP.n >= OWNER_TAPS) { OWNER_TAP = { n: 0, at: 0 }; ownerPanel(); }
});
// ?owner in the address opens it when the game starts
const ownerAsked = () => { try { return new URLSearchParams(location.search).has('owner'); } catch (e) { return false; } };
