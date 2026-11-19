// The Burg: ui.js (part 2 of 8; scripts load in order and share one global scope)
/* ---------- title screen ---------- */
// i2-a09: the town scene follows the seasons (colors plus a few seasonal touches), so long games feel time pass
const SEASON_COLORS = {
  Winter: { sky:'#dfe9f1', sun:'#f3efdc', hill:'#e9eef2', fieldA:'#dfe5e8', fieldB:'#c5ced4', river:'#9cbfd6' },
  Spring: { sky:'#d3ebf7', sun:'#f4d58d', hill:'#93c47d', fieldA:'#b5d88a', fieldB:'#86b061', river:'#7fb3d5' },
  Summer: { sky:'#cfe5f2', sun:'#f4d58d', hill:'#8fae7e', fieldA:'#e9c46a', fieldB:'#c99a3b', river:'#7fb3d5' },
  Fall:   { sky:'#efe1cc', sun:'#f0c27a', hill:'#b38a52', fieldA:'#dba15a', fieldB:'#a8692f', river:'#7fa9c4' }
};
const seasonColors = m => SEASON_COLORS[SEASON(((m % 12) + 12) % 12)];
function scene(m = new Date().getMonth()){
  if (!Number.isInteger(m)) m = new Date().getMonth();
  const se = SEASON(((m % 12) + 12) % 12), c = SEASON_COLORS[se];
  const extra = {
    Winter: `<path d="M76 41 L95 19 L114 41 Z" fill="#fff"/><path d="M224 81 L257 56 L290 81 Z" fill="#fff"/>
      ${[[40,30],[150,22],[190,50],[300,28],[380,40],[60,70],[360,70]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`).join('')}`,
    Spring: [[30,128],[60,138],[150,132],[200,140],[320,130],[370,136],[110,150]].map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${i % 2 ? '#f2a7b8' : '#fff4b0'}"/>`).join(''),
    Summer: '<circle cx="335" cy="48" r="31" fill="#f4d58d" opacity=".35"/>',
    Fall: [[170,92],[196,86],[322,92]].map(([x,y], i) => `<rect x="${x-1.5}" y="${y}" width="3" height="16" fill="#6b4a2b"/><circle cx="${x}" cy="${y-2}" r="10" fill="${['#c8642a','#e0a03a','#b5452a'][i]}"/>`).join('')
  }[se];
  return `<svg class="scene" viewBox="0 0 420 170" aria-hidden="true" data-season="${se}">
  <rect width="420" height="170" rx="18" fill="${c.sky}"/>
  <circle cx="335" cy="48" r="24" fill="${c.sun}"/>
  <path d="M0 105 C70 70 130 90 200 80 S330 60 420 85 V170 H0Z" fill="${c.hill}"/>
  <rect x="78" y="40" width="34" height="80" fill="#fbf6ea"/><polygon points="78,40 95,20 112,40" fill="#fbf6ea"/>
  <rect x="114" y="62" width="26" height="58" fill="#efe3c8"/><rect x="86" y="50" width="18" height="10" fill="#9b2f1f"/>
  <rect x="230" y="78" width="54" height="40" fill="#9b2f1f"/><polygon points="226,80 257,58 288,80" fill="#6f1f14"/>
  <rect x="250" y="96" width="14" height="22" fill="#fbf6ea"/>
  <path d="M0 120 C90 100 180 125 260 118 S380 100 420 110 V170 H0Z" fill="${c.fieldA}"/>
  <path d="M0 145 C100 130 220 152 320 142 S400 132 420 138 V170 H0Z" fill="${c.fieldB}"/>
  <path d="M30 160 C120 150 200 162 300 155" stroke="${c.river}" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${extra}
</svg>`;
}
// the title screen shows the season of the life you played last (or today's, with no lives yet)
const titleMonth = () => { const g = slots().filter(Boolean).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0], m = g && g.date ? new Date(g.date).getMonth() : NaN; return Number.isInteger(m) ? m : new Date().getMonth(); };

function renderTitle(){
  const all = slots(), used = all.filter(Boolean).length;
  const more = !!prefs().moreOpts;
  let len = 'half';
  $('#app').innerHTML = `<div class="title">
    ${scene(titleMonth())}
    <h1>The Burg</h1>
    <div class="sub">Make a life in Waitsburg, Washington.</div>
    ${used ? `<label class="field">Your lives (${used}/${SLOT_COUNT})</label>
      <div class="slots">${all.map((g,i) => g ? slotCard(g, i, `<div class="slotbtns"><button class="sm" data-cont="${i}">Continue</button><button class="sm alt" data-del="${i}" aria-label="Delete ${esc(g.name)}'s life">🗑</button></div>`) : '').join('')}</div>
      <div class="muted" style="margin:18px 0 0">— or start a new life —</div>` : ''}
    <label class="field" for="nm">Your citizen's name</label>
    <input type="text" id="nm" maxlength="20" placeholder="e.g. Dusty" autocomplete="off">
    <label class="field">Game length</label>
    <div class="lengths">${Object.entries(LENGTHS).map(([k,L]) =>
      `<button class="len ${k===len?'on':''}" data-len="${k}" aria-pressed="${k===len}"><b>${L.label}</b><span>${L.sub}</span></button>`).join('')}</div>
    <button class="btn primary bigstart" id="start">Start a new life</button>
    <button class="moreopts" id="moreopts" aria-expanded="${more}" aria-controls="morepanel"><span><b>More options</b><span class="s" id="moresum"></span></span><span class="caret" aria-hidden="true">${more ? '▴' : '▾'}</span></button>
    <div id="morepanel" class="morepanel${more ? '' : ' hidden'}">
      <label class="field">How your life begins</label>
      <div class="bgs" role="group" aria-label="How your life begins">${Object.entries(BACKGROUNDS).map(([k,b]) =>
        `<button class="chip ${k==='fresh'?'on':''}" data-bg="${k}" aria-pressed="${k==='fresh'}">${b.ic} ${b.name}</button>`).join('')}</div>
      <div class="muted bgdesc" id="bgdesc">${BACKGROUNDS.fresh.desc} <b>${BACKGROUNDS.fresh.hint}.</b></div>
      <label class="field">Mode</label>
      <div class="maptog" role="group" aria-label="Mode">${Object.entries(MODES).map(([k,m]) =>
        `<button class="${k==='normal'?'on':''}" data-mode="${k}" aria-pressed="${k==='normal'}">${m.ic} ${m.name}</button>`).join('')}</div>
      <div class="muted bgdesc" id="modedesc">${MODES.normal.desc}</div>
    </div>
    <button class="btn ghost" id="chal">🏁 Challenges</button>
    <button class="btn ghost" id="weekly">📅 Weekly challenge (${isoWeek()})</button>
    ${hasRecords() ? '<button class="btn ghost" id="records">🏆 Your records</button>' : ''}
    <button class="btn ghost" id="how">❓ Help & tutorial</button>
    <button class="btn ghost" id="restore">📥 Restore from a backup</button>
    <button class="btn ghost" id="settings">⚙️ Settings</button>
    ${Object.keys(store.get(BADGE_KEY) || {}).length ? `<div class="muted" style="margin-top:10px;font-size:0.8125rem">🏅 Badges collected across your lives: ${BADGES.filter(b => (store.get(BADGE_KEY) || {})[b.id]).map(b => b.ic).join(' ')} (${Object.keys(store.get(BADGE_KEY) || {}).length}/${BADGES.length})</div>` : ''}
    <div class="muted" style="margin-top:14px;font-size:0.75rem">v${APP_VERSION}</div>
  </div>`;
  let bg = 'fresh', md = 'normal';
  const moreSum = () => { $('#moresum').textContent = `${BACKGROUNDS[bg].ic} ${BACKGROUNDS[bg].name} · ${MODES[md].ic} ${MODES[md].name}`; };
  moreSum();
  // G2: starting backgrounds and modes live in a "More options" panel; open or closed is remembered
  $('#moreopts').onclick = () => {
    const open = $('#morepanel').classList.toggle('hidden') === false;
    $('#moreopts').setAttribute('aria-expanded', open); $('#moreopts .caret').textContent = open ? '▴' : '▾';
    setPref('moreOpts', open);
  };
  document.querySelectorAll('[data-bg]').forEach(b => b.onclick = () => { bg = b.dataset.bg;
    document.querySelectorAll('[data-bg]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); $('#bgdesc').innerHTML = `${BACKGROUNDS[bg].desc} <b>${BACKGROUNDS[bg].hint}.</b>`; moreSum(); });
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { md = b.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); $('#modedesc').textContent = MODES[md].desc; moreSum(); });
  document.querySelectorAll('.len').forEach(b => b.onclick = () => {
    len = b.dataset.len; document.querySelectorAll('.len').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  });
  document.querySelectorAll('[data-cont]').forEach(b => b.onclick = () => loadSlot(+b.dataset.cont));
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => askDelete(+b.dataset.del));
  $('#start').onclick = () => {
    const name = ($('#nm').value.trim() || 'Dusty').slice(0,20);
    const free = slots().indexOf(null);
    if (free < 0) return askReplace(name, len, { bg, mode: md });
    newGame(name, len, free, { bg, mode: md });
  };
  $('#how').onclick = showHelp;
  $('#chal').onclick = challengesSheet;
  $('#weekly').onclick = () => {
    sheet(`<h2>📅 Weekly challenge ${isoWeek()}</h2><p>A 6-month life where everyone gets the same events and dice this week. Play it, then share your score card and compare with friends.</p><button class="btn primary" id="y">Start</button><button class="btn ghost" id="n">Not now</button>`);
    $('#y').onclick = () => { const name = (($('#nm') && $('#nm').value.trim()) || 'Dusty').slice(0,20); closeSheet(); startWeekly(name); };
    $('#n').onclick = closeSheet;
  };
  $('#restore').onclick = restoreSheet;
  $('#settings').onclick = () => settingsSheet(false);
  if ($('#records')) $('#records').onclick = recordsSheet;
}
/* ---------- 🏆 Your records (G7, R7): best scores by length × mode, challenges, and this week's weekly challenge ---------- */
// only the current week's weekly-challenge best is kept; older weeks are dropped when the game loads
function pruneWeekly(){
  const best = store.get(BEST_KEY); if (!best) return;
  const cur = `wk-${isoWeek()}`, stale = Object.keys(best).filter(k => k.startsWith('wk-') && k !== cur);
  if (stale.length) { stale.forEach(k => delete best[k]); store.set(BEST_KEY, best); }
}
function hasRecords(){
  const best = store.get(BEST_KEY) || {};
  return Object.keys(best).some(k => bestLabel(k)) || Object.keys(store.get(CHALLENGE_KEY) || {}).length > 0;
}
function recordsSheet(){
  const best = store.get(BEST_KEY) || {}, won = store.get(CHALLENGE_KEY) || {}, mds = ['relaxed', 'normal', 'hard'];
  const cell = v => v == null ? '<span class="muted" aria-label="none yet">–</span>' : `<b>${v}</b>`;
  const nWon = Object.keys(SCENARIOS).filter(k => won[k]).length, wk = best[`wk-${isoWeek()}`];
  sheet(`<h2>🏆 Your records</h2>
    <p class="muted">Your best Life Scores on this device.</p>
    <table class="rec"><caption>Best score by game length and mode</caption>
      <thead><tr><th scope="col">Length</th>${mds.map(m => `<th scope="col">${MODES[m].ic} ${MODES[m].name}</th>`).join('')}</tr></thead>
      <tbody>${Object.entries(LENGTHS).map(([k, L]) => `<tr><th scope="row">${L.label}</th>${mds.map(m => `<td>${cell(best[bestKey(k, m)])}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <h3 style="margin-top:14px">🏁 Challenges <span class="tag">${nWon}/${Object.keys(SCENARIOS).length} completed</span></h3>
    ${Object.entries(SCENARIOS).map(([k, sc]) => `<div class="kv"><span>${sc.ic} ${sc.name}${won[k] ? ' ✅' : ''}</span><span>${best['sc-' + k] != null ? `best <b>${best['sc-' + k]}</b>` : '<span class="muted">not played</span>'}</span></div>`).join('')}
    <h3 style="margin-top:14px">📅 This week's challenge (${isoWeek()})</h3>
    <div class="kv"><span>Your best this week</span><span>${wk != null ? `<b>${wk}</b>` : '<span class="muted">not played yet</span>'}</span></div>
    <button class="btn primary" id="ok">Close</button>`);
  $('#ok').onclick = closeSheet;
}
/* ---------- ✨ What's new (G6): a one-time card after an update, once per version ---------- */
const SEEN_KEY = KEY_PREFIX + 'seenVersion';
const WHATS_NEW = {
  '0.2.0': [
    ['🚗', 'Trips around the region', 'plan a trip to Dayton, Walla Walla or the Tri-Cities with up to 3 stops.'],
    ['🏆', 'Life Score so far', 'see your score any time on Home, with a report card every 13 weeks.'],
    ['🚙', 'Carpools, remote days and side-hustle gigs', 'make long commutes easier and earn on the side with the seasons.'],
    ['🎬', 'Starting backgrounds', 'begin as a farm kid, a grad coming home, a Seattle transplant or a young parent.'],
    ['🌤️', 'Relaxed and Hard modes', 'play at your own pace, or make it tougher.'],
    ['🌸', 'Town goals', 'one goal a season that the whole town works on.'],
    ['🎯', 'Badges and life goals', 'pin up to 3 goals for extra Life Score points.'],
    ['📖', 'Stories', 'some events now unfold over several weeks.'],
    ['🏁', 'Challenges', 'set-up stories with a goal, like saving the family farm.'],
    ['🧰', 'Skills', 'get handier, cook better and know more people as you go.'],
    ['🏪', 'Your own business', 'lease wheat ground, run a food truck or open a woodworking shop.'],
    ['📅', 'Weekly challenge and score card', 'everyone gets the same start each week; share your score.'],
    ['🌳', 'Legacy', 'when a Lifetime game ends, carry on as your grandkid.'],
    ['🏘️', 'Out and about', 'visit 20 Waitsburg businesses from a new Main Street map, with new local jobs.'],
    ['🛣️', 'Road and work events', '60 new events on the road, in other towns and at work.'],
    ['📒', 'Your records and Journal filters', 'see your best scores by length and mode, and filter the Journal.']
  ]
};
const baseVersion = () => APP_VERSION.replace(/-.*/, '');
// shows the card once per version to players who played before; brand-new players and the tutorial skip it
const verNum = v => String(v || '0').replace(/-.*/, '').split('.').reduce((a, x) => a * 1000 + (parseInt(x, 10) || 0), 0);
function whatsNew(){
  const cur = baseVersion(), seen = store.get(SEEN_KEY);
  if (seen === cur || (typeof TUT !== 'undefined' && TUT)) return false;
  const played = slots().some(Boolean) || Object.keys(store.get(BEST_KEY) || {}).length > 0;
  store.set(SEEN_KEY, cur);
  // the newest notes up to this version that this player hasn't seen yet (so 0.2.1 still shows 0.2.0's list once)
  const v = Object.keys(WHATS_NEW).filter(x => verNum(x) <= verNum(cur) && (!seen || verNum(x) > verNum(seen))).sort((a, b) => verNum(b) - verNum(a))[0];
  if (!played || !v || !$('#modal').classList.contains('hidden')) return false;
  sheet(`<h2>✨ What's new in ${v}</h2>
    <p class="muted">Welcome back! Here's what's new in the Burg:</p>
    <ul class="wnlist">${WHATS_NEW[v].map(([ic, t, d]) => `<li><span aria-hidden="true">${ic}</span> <b>${t}:</b> ${d}</li>`).join('')}</ul>
    <p class="muted">The Help guide (❓) explains each one.</p>
    <button class="btn primary" id="ok">Got it</button>`);
  $('#ok').onclick = closeSheet;
  announce(`What's new in ${v}`);
  return true;
}
function loadSlot(i){
  const g = slots()[i]; if (!g) return;
  if (S && !S.over && S.slot !== i) save();
  LIFE_UNDO = []; S = migrate(clone(g)); S.slot = i; tab = 'home'; MAPSIDE = null; MAPSEL = null; useDice();
  closeSheet(); render(); window.scrollTo(0,0);
  if (g.savedAt && Date.now() - g.savedAt >= RECAP_AFTER && S.recapAt !== g.savedAt && !S.practice) recapSheet(g.savedAt);
}
/* ---------- i2-a14: "Previously in the Burg" when you come back after a while (once per save) ---------- */
const RECAP_AFTER = 8 * 3600e3;          // 8 hours away
function recapSheet(at){
  const days = Math.floor((Date.now() - at) / 864e5), sc = S.practice ? null : lifeScore();
  const recent = S.log.filter(e => !/^📋/.test(e.m)).slice(0, 5);
  const goals = (S.goals || []).map(id => badgeById(id)).filter(Boolean);
  const j = job(), f = FOCUS[S.focus];
  sheet(`<h2>📺 Previously in the Burg</h2>
    <p class="muted">${esc(S.name)}, age ${age()} · ${dateLabel()} · last played ${days >= 2 ? `${days} days ago` : days === 1 ? 'yesterday' : 'earlier today'}.</p>
    ${recent.length ? `<h3>Lately</h3>${recent.map(e => `<div class="logitem"><em>${e.d}</em> ${e.m}</div>`).join('')}` : ''}
    <h3 style="margin-top:10px">Where things stand</h3>
    <div class="kv"><span>Work</span><span>${S.retired ? 'Retired' : j ? esc(j.title) : 'No job yet'}</span></div>
    <div class="kv"><span>Cash</span><span>${fmt(S.money)}</span></div>
    <div class="kv"><span>This week's focus</span><span>${f.ic} ${f.name}</span></div>
    ${sc ? `<div class="kv"><span>Life Score so far</span><span><b>${sc.score}</b> ${sc.title}</span></div>` : ''}
    ${goals.length ? `<h3 style="margin-top:10px">🎯 Your life goals</h3>${goals.map(b => `<div class="kv"><span>${b.ic} ${b.name}</span><span>${S.badges && S.badges[b.id] != null ? '✅ Done' : 'Not yet'}</span></div>`).join('')}` : ''}
    ${seasonLine()}
    <button class="btn primary" id="ok">Back to it</button>`);
  S.recapAt = at; save();                 // never twice for the same save
  $('#ok').onclick = closeSheet;
  announce('Previously in the Burg');
}
function askDelete(i){
  const g = slots()[i]; if (!g) return;
  sheet(`<h2>Delete ${esc(g.name)}'s life?</h2><p>${slotLine(g)}</p><p>This can't be undone.</p>
    <button class="btn primary" id="yes">Delete</button><button class="btn ghost" id="no">Keep it</button>`);
  $('#yes').onclick = () => { writeSlot(i, null); closeSheet(); renderTitle(); toast('Deleted'); };
  $('#no').onclick = closeSheet;
}
function askReplace(name, len, opts = {}){
  sheet(`<h2>All ${SLOT_COUNT} slots are full</h2><p>Pick a life to replace with ${esc(name)}'s new one. The old one is deleted.</p>
    <div class="slots">${slots().map((g,i) => slotCard(g, i, `<button class="sm" data-over="${i}">Replace</button>`)).join('')}</div>
    <button class="btn ghost" id="no">Cancel</button>`);
  document.querySelectorAll('[data-over]').forEach(b => b.onclick = () => {   // H2: one tap never deletes a life
    const i = +b.dataset.over, old = slots()[i];
    if (!old) { closeSheet(); return newGame(name, len, i, opts); }
    sheet(`<h2>Replace ${esc(old.name)}'s life?</h2><p>${slotLine(old)}</p><p>Slot ${i+1} will hold ${esc(name)}'s new life instead. This can't be undone.</p>
      <button class="btn ghost" id="back">Back</button><button class="btn primary" id="yes">Replace it</button>`);
    $('#yes').onclick = () => { closeSheet(); newGame(name, len, i, opts); };
    $('#back').onclick = () => askReplace(name, len, opts);
  });
  $('#no').onclick = closeSheet;
}
// Menu: save a copy of this life to another slot (a checkpoint you can go back to)
function saveCopySheet(){
  save();
  sheet(`<h2>Save game</h2><p class="muted">Save to <b>this life's slot</b>, or save a copy to <b>another slot</b> as a checkpoint: you keep playing this life, and can load the copy later to go back to this moment.</p>
    <div class="slots">${slots().map((g,i) => i === S.slot
      ? slotCard(g, i, `<div class="slotbtns"><span class="tag cur">Playing</span><button class="sm" data-copy="${i}">Save</button></div>`)
      : slotCard(g, i, `<button class="sm" data-copy="${i}">${g ? 'Replace' : 'Save here'}</button>`)).join('')}</div>
    <button class="btn ghost" id="no">Cancel</button>`);
  document.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => {
    const i = +b.dataset.copy, old = slots()[i];
    if (i === S.slot) { save(); closeSheet(); toast(`Saved to slot ${i+1}`); return; }
    const go = () => {
      const c = clone(S); c.slot = i; c.savedAt = Date.now(); c.copyNote = `Copy · ${dateLabel().replace('Week of ','')}`;
      writeSlot(i, c); closeSheet(); toast(`Copy saved to slot ${i+1}`);
    };
    if (!old) return go();
    sheet(`<h2>Replace ${esc(old.name)}'s life?</h2><p>${slotLine(old)}</p><p>Slot ${i+1} will hold the copy instead. This can't be undone.</p>
      <button class="btn primary" id="yes">Replace it</button><button class="btn ghost" id="back">Back</button>`);
    $('#yes').onclick = go; $('#back').onclick = saveCopySheet;
  });
  $('#no').onclick = closeSheet;
}
// Menu: switch to another saved life (this one is saved first)
/* ---------- 📤 backups: move your lives between devices ---------- */
// A backup is every saved life plus best scores. It leaves as a .json file or a "backup code" (text you can paste
// into a message to yourself); codes are gzip-compressed when the browser can.
function backupData(){ return { app: 'theburg', kind: 'backup', v: 1, version: APP_VERSION, exported: new Date().toISOString(), slots: slots(), best: store.get(BEST_KEY) || {}, badges: store.get(BADGE_KEY) || {}, challenges: store.get(CHALLENGE_KEY) || {} }; }
const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s); };
const unb64 = text => Uint8Array.from(atob(text.replace(/\s+/g, '')), c => c.charCodeAt(0));
async function backupCode(obj){
  const json = JSON.stringify(obj);
  if (window.CompressionStream) {
    const gz = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
    return 'BURG1:' + b64(new Uint8Array(await new Response(gz).arrayBuffer()));
  }
  return 'BURG0:' + b64(new TextEncoder().encode(json));
}
async function readBackup(text){
  text = (text || '').trim();
  let d;
  try {
    if (text.startsWith('{')) d = JSON.parse(text);
    else if (text.startsWith('BURG1:')) {
      if (!window.DecompressionStream) throw new Error('This browser can\'t open compressed codes. Use the backup file instead.');
      const raw = new Blob([unb64(text.slice(6))]).stream().pipeThrough(new DecompressionStream('gzip'));
      d = JSON.parse(await new Response(raw).text());
    } else if (text.startsWith('BURG0:')) d = JSON.parse(new TextDecoder().decode(unb64(text.slice(6))));
    else throw new Error('');
  } catch (e) { throw new Error(e.message || 'That doesn\'t look like a backup from The Burg.'); }
  if (!d || d.app !== 'theburg' || !Array.isArray(d.slots)) throw new Error('That doesn\'t look like a backup from The Burg.');
  const ok = isLife;   // H1: anything else a thin backup is missing, migrate() fills in
  const lives = d.slots.slice(0, SLOT_COUNT).map(g => ok(g) ? migrate(g) : null);
  if (!lives.some(Boolean)) throw new Error('That backup has no saved lives in it.');
  const obj = x => x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  const when = typeof d.exported === 'string' || Number.isFinite(d.exported) ? new Date(d.exported) : null;   // H1: a date is shown only if it parses
  return { lives, best: obj(d.best), badges: obj(d.badges), challenges: obj(d.challenges), exported: when && !isNaN(when) ? when.toISOString() : null };
}
// put a backup's lives in: 'add' fills empty slots (returns how many didn't fit), 'replace' swaps all slots
function restoreBackup(b, mode){
  const cur = slots(), best = store.get(BEST_KEY) || {};
  for (const [k, v] of Object.entries(b.best)) if (bestLabel(k) && Number.isFinite(v) && !(best[k] >= v)) best[k] = v;   // every mode, challenge and weekly best
  store.set(BEST_KEY, best);
  // badges and challenge wins are a collection: keep everything from both sides
  const badges = store.get(BADGE_KEY) || {}, wins = store.get(CHALLENGE_KEY) || {};
  for (const k of Object.keys(b.badges || {})) if (BADGES.some(x => x.id === k)) badges[k] = 1;
  for (const k of Object.keys(b.challenges || {})) if (SCENARIOS[k]) wins[k] = 1;
  store.set(BADGE_KEY, badges); store.set(CHALLENGE_KEY, wins);
  let skipped = 0;
  if (mode === 'replace') store.set(SLOTS_KEY, b.lives.map((g, i) => g ? { ...g, slot: i } : null).concat(Array(SLOT_COUNT).fill(null)).slice(0, SLOT_COUNT));
  else {
    for (const g of b.lives.filter(Boolean)) { const i = cur.indexOf(null); if (i < 0) { skipped++; continue; } cur[i] = { ...g, slot: i }; }
    store.set(SLOTS_KEY, cur);
  }
  return skipped;
}
function backupSheet(){
  if (S && !S.over && !S.practice) save();
  const n = slots().filter(Boolean).length;
  sheet(`<h2>📤 Back up or restore</h2>
    <p class="muted">Your lives are saved on this device. A backup lets you keep a copy or move them to another phone or computer.</p>
    <h3>Back up (${n} ${n === 1 ? 'life' : 'lives'})</h3>
    <button class="btn primary" id="bkfile" ${n ? '' : 'disabled'}>⬇️ Download a backup file</button>
    <button class="btn ghost" id="bkcode" ${n ? '' : 'disabled'}>📋 Copy a backup code</button>
    <div id="bkout"></div>
    <h3 style="margin-top:14px">Restore</h3>
    <button class="btn ghost" id="bkrestore">📥 Restore from a backup</button>
    <button class="btn ghost" id="no">Close</button>`);
  $('#bkfile').onclick = () => {
    const blob = new Blob([JSON.stringify(backupData(), null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `the-burg-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast('Backup file downloaded'); announce('Backup file downloaded');
  };
  $('#bkcode').onclick = async () => {
    const code = await backupCode(backupData());
    let copied = false;
    try { await navigator.clipboard.writeText(code); copied = true; } catch (e) {}
    $('#bkout').innerHTML = `<p class="${copied ? '' : 'muted'}">${copied ? '✅ Copied! Paste it into a note or a message to yourself.' : 'Copy this code (select it all), then paste it into a note or a message to yourself:'}</p>
      <textarea class="code" id="bkcodetext" readonly aria-label="Backup code" rows="4">${code}</textarea>`;
    const ta = $('#bkcodetext'); ta.focus(); ta.select();
    announce(copied ? 'Backup code copied' : 'Backup code shown, select and copy it');
  };
  $('#bkrestore').onclick = restoreSheet;
  $('#no').onclick = closeSheet;
}
function restoreSheet(){
  sheet(`<h2>📥 Restore from a backup</h2>
    <p class="muted">Paste a backup code, or choose a backup file.</p>
    <textarea class="code" id="rscode" rows="4" aria-label="Paste a backup code" placeholder="BURG1:…"></textarea>
    <button class="btn ghost" id="rsfilebtn">📁 Choose a backup file</button><input type="file" id="rsfile" accept=".json,application/json,text/plain" hidden>
    <button class="btn primary" id="rscheck">Check this backup</button>
    <div id="rsout" role="status"></div>
    <button class="btn ghost" id="no">Cancel</button>`);
  const check = async text => {
    const out = $('#rsout');
    try {
      const b = await readBackup(text);
      const lives = b.lives.filter(Boolean), free = slots().filter(g => !g).length;
      out.innerHTML = `<p><b>This backup has ${lives.length} ${lives.length === 1 ? 'life' : 'lives'}</b>${b.exported ? ` (saved ${new Date(b.exported).toLocaleDateString()})` : ''}:</p>
        <div class="slots">${b.lives.map((g, i) => g ? slotCard(g, i, '') : '').join('')}</div>
        <button class="btn primary" id="rsadd" ${free ? '' : 'disabled'}>Add to my empty slots (${free} free)</button>
        <button class="btn ghost" id="rsrep">Replace all my lives with these</button>`;
      $('#rsadd').onclick = () => finishRestore(b, 'add');
      $('#rsrep').onclick = () => {
        out.innerHTML = `<p><b>Replace all your lives?</b> Every life saved on this device now is deleted and replaced by the backup's. This can't be undone.</p>
          <button class="btn primary" id="rsyes">Replace them</button><button class="btn ghost" id="rsback">Back</button>`;
        $('#rsyes').onclick = () => finishRestore(b, 'replace');
        $('#rsback').onclick = () => check(text);
        $('#rsyes').focus();
      };
      $('#rsadd').focus();
    } catch (e) { out.innerHTML = `<p class="warnline">⚠️ ${esc(e.message)}</p>`; }
  };
  $('#rscheck').onclick = () => check($('#rscode').value);
  $('#rsfilebtn').onclick = () => $('#rsfile').click();
  $('#rsfile').onchange = async e => { const f = e.target.files && e.target.files[0]; if (!f) return; const text = await f.text(); $('#rscode').value = ''; check(text); };
  $('#no').onclick = closeSheet;
}
function finishRestore(b, mode){
  const skipped = restoreBackup(b, mode);
  closeSheet();
  if (mode === 'replace' || !S) { S = null; renderTitle(); }
  else render();
  const msg = skipped ? `Restored. ${skipped} ${skipped === 1 ? 'life' : 'lives'} didn't fit: free up a slot and restore again.` : 'Backup restored';
  toast(msg); announce(msg);
}

function loadSheet(){
  save();
  const all = slots(), lives = all.map((g,i) => [g,i]).filter(([g]) => g);
  sheet(`<h2>Load game</h2><p class="muted">${esc(S.name)}'s life is saved first, so you can come back to it.</p>
    <div class="slots">${lives.map(([g,i]) => slotCard(g, i, i === S.slot ? '<span class="tag cur">Playing</span>' : `<button class="sm" data-load="${i}">Load</button>`)).join('')}</div>
    ${lives.length < 2 ? '<p>No other saved lives yet. Use 💾 Save game to save a copy to another slot, or start a new life from the title screen.</p>' : ''}
    <button class="btn ghost" id="no">Cancel</button>`);
  document.querySelectorAll('[data-load]').forEach(b => b.onclick = () => { loadSlot(+b.dataset.load); toast(`Loaded ${S.name}'s life`); });
  $('#no').onclick = closeSheet;
}
function newGame(name, len, slot = 0, opts = {}){
  LIFE_UNDO = []; PLAY_AT = -1e9;
  S = blankLife(name, len, slot);                 // road and work events (health plan, ski pass, job-hunt help and more) included
  S.bg = BACKGROUNDS[opts.bg] ? opts.bg : 'fresh'; S.mode = MODES[opts.mode] ? opts.mode : 'normal';
  if (BACKGROUNDS[S.bg].set) BACKGROUNDS[S.bg].set(S);
  S.weekly = opts.weekly || null; S.rng = opts.weekly ? weekSeed(opts.weekly) : null; S.rngEv = opts.weekly ? weekSeed(`${opts.weekly}:events`) : null; useDice();
  if (len === 'half') { S.happy -= HALF_START_DIP; S.health -= HALF_START_DIP; }   // B2: 26 weeks is short, so a 6-month life starts a little worn
  if (SCENARIOS[opts.scenario]) { S.scenario = opts.scenario; if (SCENARIOS[S.scenario].set) SCENARIOS[S.scenario].set(S); }
  S.yearStart = { nw: netWorth(), happy: S.happy, health: S.health, community: S.community };
  if (opts.practice) { S.practice = true; S.noEvents = true; }      // the tutorial's throwaway life: never saved, no random events
  log(S.bg === 'fresh' ? `${name} turns 18 and rents a room above Main Street in Waitsburg. Time to find a job.`
    : `${name} starts a new life in Waitsburg: ${BACKGROUNDS[S.bg].name.toLowerCase()}. ${BACKGROUNDS[S.bg].desc}`);
  tab = S.jobId ? 'home' : 'jobs'; save(); render();
  if (!opts.practice) toast('Welcome to the Burg! Start by finding a job.');
}

/* ---------- main render ---------- */
function render(){
  if (!S) return renderTitle();
  const L = LENGTHS[S.len];
  const pct = L.turns === Infinity ? Math.min(100, (age()-18)/(85-18)*100) : S.turn / L.turns * 100;
  const big = L.turns === Infinity || L.turns >= 104;
  const left = L.turns === Infinity ? `Age ${age()}` : `${L.turns - S.turn} weeks left`;
  const nar = S.practice ? '' : ' skipx';          // i2-a23: on narrow phones the ⏩ buttons hide behind a long press on End Week
  $('#app').innerHTML = `
  <header class="top">
    <div class="row"><h2>${esc(S.name)}${S.practice ? ' <span class="tag">Practice</span>' : ''}${mode() !== 'normal' && !S.practice ? ` <span class="tag">${MODES[mode()].ic} ${MODES[mode()].name}</span>` : ''}${S.scenario ? ` <span class="tag">🏁</span>` : ''}${S.weekly ? ` <span class="tag">📅</span>` : ''}${S.gen > 1 ? ` <span class="tag">🌳 ${S.gen}</span>` : ''}</h2><div class="hdr-r"><div class="money">${fmt(S.money)}</div><button id="helpbtn" aria-label="Help and tutorial">?</button></div></div>
    <div class="meta"><span>${dateLabel()} · age ${age()}</span><span>${left}</span></div>
    <div class="progress"><i style="width:${pct}%"></i></div>
  </header>
  <main id="main"></main>
  ${tab==='home' ? `${S.run ? `<button class="weekstrip" id="strip" aria-label="What the last ${S.run.weeks > 1 ? S.run.weeks + ' weeks' : 'week'} did: details"><span class="wl">${S.run.weeks > 1 ? `Last ${S.run.weeks} wks` : 'Last week'}</span><span class="wc">${runChips()}</span><span class="more">›</span></button>` : ''}
    <div class="endbar${ROLL ? ' rolling' : ''}">${ROLL ? `<button class="btn primary" id="stoproll">⏹ Stop<small>${S.run.weeks} of up to ${ROLL.n} weeks</small></button>`
      : `<button class="btn primary" id="end" aria-keyshortcuts="Shift+Enter" aria-description="Press and hold, or Shift+Enter, for more ways to skip ahead">End Week →<small>${FOCUS[S.focus].ic} ${FOCUS_SHORT[S.focus]}</small></button>
    <button class="btn ghost${nar}" id="ff4" aria-label="Skip 4 weeks">⏩ 4</button>${big ? `<button class="btn ghost${nar}" id="ff13" aria-label="Skip 13 weeks">⏩ 13</button>` : ''}<button class="btn ghost" id="auto" aria-label="Auto: play until ${autoUntil() === 'event' ? 'something needs you' : AUTO_UNTIL[autoUntil()].short + ' or something needs you'}. Press and hold for options">⏭ Auto</button>`}</div>` : ''}
  <nav><div class="in">
    ${[['home','🏠','Home'],['jobs','💼','Jobs'],['life','🌾','Life'],['log','📜','Journal']].map(([k,ic,l]) =>
      `<button data-tab="${k}" class="${tab===k?'on':''}"${tab===k?' aria-current="page"':''}><span class="ic" aria-hidden="true">${ic}</span>${l}</button>`).join('')}
    <button data-tab="menu"><span class="ic">⚙️</span>Menu</button>
  </div></nav>`;
  document.querySelectorAll('#app > nav button').forEach(b => b.onclick = () => {
    if (b.dataset.tab === 'menu') return showMenu();
    tab = b.dataset.tab; MAPSIDE = null; MAPSEL = null; render(); window.scrollTo(0,0);
  });
  $('#helpbtn').onclick = showHelp;
  if ($('#end')) { $('#end').onclick = e => { if (holdDone(e)) return; tapPlay(1, e); }; holdOpens($('#end'), skipSheet); }
  if ($('#ff4')) $('#ff4').onclick = e => tapPlay(4, e);
  if ($('#ff13')) $('#ff13').onclick = e => tapPlay(13, e);
  if ($('#auto')) { $('#auto').onclick = e => { if (holdDone(e)) return; tapPlay('auto', e); }; holdOpens($('#auto'), skipSheet); }
  if ($('#stoproll')) $('#stoproll').onclick = stopRoll;
  if ($('#strip')) $('#strip').onclick = showRunDetails;
  FIRST_SLOT = 'open';
  ({home:renderHome, jobs:renderJobs, life:renderLife, log:renderLog})[tab]();
  FIRST_SLOT = null;
  if (COUNT_FROM) { const from = COUNT_FROM; COUNT_FROM = null; if (tab === 'home') animateStats(from); }
  document.querySelectorAll('[data-apply]').forEach(b => b.onclick = () => apply(b.dataset.apply));
  document.querySelectorAll('[data-locked]').forEach(b => b.onclick = () => explainLocked(b.dataset.locked));
}
// i2-a23: press and hold (or right-click, or Shift+Enter) opens the skip options; the release after a hold isn't a tap
function holdOpens(el, fn){
  let t = null;
  const clear = () => clearTimeout(t);
  el.addEventListener('pointerdown', e => { if (e.button) return; el._held = false; clear(); t = setTimeout(() => { el._held = true; fn(); }, 520); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, clear));
  el.addEventListener('contextmenu', e => { e.preventDefault(); clear(); if (!el._held) { el._held = true; fn(); } });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); e.stopPropagation(); fn(); } });
}
const holdDone = e => { const el = e.currentTarget; if (el && el._held) { el._held = false; return true; } return false; };
// the skip options: ⏩ 4 and ⏩ 13, what ⏭ Auto plays until (i2-a11), and whether to watch the weeks go by (i2-a28)
function skipSheet(){
  if (!S || S.over || ROLL) return;
  const L = LENGTHS[S.len], big = L.turns === Infinity || L.turns >= 104;
  const k = autoUntil(), sp = watchWeeks() ? 'watch' : 'instant', rm = reducedMotion();
  const opt = (grp, val, on, label, dis) => `<button class="btn ghost opt${on ? ' on' : ''}" role="radio" aria-checked="${on}" data-${grp}="${val}"${dis ? ' disabled' : ''}>${on ? '✓ ' : ''}${label}</button>`;
  sheet(`<h2>Skip ahead</h2>
    <p class="muted">Skips keep your ${S.plan && S.plan.length ? 'focus plan' : 'focus'} and stop when something needs you: an event with a choice, a milestone or New Year. Events with only one way to go play out on their own.</p>
    <div class="skiprow"><button class="btn primary" id="sk4">⏩ 4 weeks</button>${big ? '<button class="btn primary" id="sk13">⏩ 13 weeks</button>' : ''}</div>
    <h3 style="margin-top:14px" id="untilh">⏭ Auto plays up to ${AUTO_MAX} weeks, until…</h3>
    <div role="radiogroup" aria-labelledby="untilh">${Object.entries(AUTO_UNTIL).map(([key, o]) => opt('until', key, k === key, o.name)).join('')}</div>
    <h3 style="margin-top:14px" id="speedh">While skipping</h3>
    <div role="radiogroup" aria-labelledby="speedh">${opt('speed', 'instant', sp === 'instant', 'Jump straight there')}${opt('speed', 'watch', sp === 'watch', 'Watch the weeks go by', rm)}</div>
    ${rm ? '<p class="muted">Your device asks for less motion, so skips jump straight there.</p>' : ''}
    <button class="btn primary" id="skauto">⏭ Auto now</button>
    <button class="btn ghost" id="close">Close</button>`);
  $('#sk4').onclick = () => { closeSheet(); playWeeks(4); };
  if ($('#sk13')) $('#sk13').onclick = () => { closeSheet(); playWeeks(13); };
  $('#skauto').onclick = () => { closeSheet(); autoPlay(); };
  $('#close').onclick = closeSheet;
  const keep = sel => { const id = document.activeElement && document.activeElement.dataset; skipSheet(); const b = id && $(`#sheet [data-${sel}="${id[sel]}"]`); if (b) setTimeout(() => b.focus(), 40); };
  document.querySelectorAll('#sheet [data-until]').forEach(b => b.onclick = () => { setPref('autoUntil', b.dataset.until); render(); keep('until'); });
  document.querySelectorAll('#sheet [data-speed]').forEach(b => b.onclick = () => { setPref('speed', b.dataset.speed); keep('speed'); });
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const statColor = v => v >= 60 ? 'var(--sage)' : v >= 35 ? 'var(--wheat-d)' : 'var(--barn)';
const statBar = (label, v) => `<div class="stat"><label><span>${label}</span><span>${Math.round(v)}</span></label>
  <div class="bar"><i style="width:${v}%;background:${statColor(v)}"></i></div></div>`;

const FOCUS_SHORT = { work:'Work extra', rest:'Rest', community:'Town', study:'Classes', outdoors:'Outside', hustle:'Hustle' };
const statBtn = (k, label, v) => `<button class="stat statbtn" data-stat="${k}" aria-label="${label} ${Math.round(v)}: what moves it">
  <label><span>${label} <span class="info">ⓘ</span></span><span>${Math.round(v)}</span></label>
  <div class="bar"><i style="width:${v}%;background:${statColor(v)}"></i></div></button>`;
// i2-a16: a first-month checklist for new players; finished steps are remembered on this device (prefs().cl), no rewards
const CHECKLIST = [
  { id:'job', ic:'💼', t:'Get a job', done:() => !!S.jobId || S.retired, go:'jobs', b:'Jobs' },
  { id:'week', ic:'📅', t:'Pick a focus, then tap End Week', done:() => S.turn >= 1, go:'focus', b:'Focus' },
  { id:'strip', ic:'📊', t:'Tap the strip above End Week to see where your money went', done:() => !!(prefs().cl || {}).strip, go:'strip', b:'Show me' },
  { id:'k401', ic:'🏦', t:'Save 5% in your 401(k) for the free 3% match', done:() => S.k401rate > 0, go:'life', b:'Life' },
  { id:'goal', ic:'🎯', t:'Pin a life goal for bonus points', done:() => (S.goals || []).length > 0, go:'life', b:'Life' },
  { id:'out', ic:'🛍️', t:'Visit a place in town, or plan a trip', done:() => !!S.trip || !!(S.out && S.out.visits) || Object.keys(S.towns || {}).length > 0, go:'out', b:'Go out' }
];
function checklist(){
  if (S.practice || S.turn >= 26 || prefs().clHide) return null;
  const cl = { ...(prefs().cl || {}) }; let changed = false;
  for (const c of CHECKLIST) if (!cl[c.id] && c.done()) { cl[c.id] = 1; changed = true; }
  if (changed) setPref('cl', cl);
  const n = CHECKLIST.filter(c => cl[c.id]).length;
  return n >= CHECKLIST.length ? null : { cl, n };
}
function checklistCard(){
  const c = checklist(); if (!c) return '';
  return `<div class="card checklist" id="checklist"><h3>🧭 Your first month <span class="tag">${c.n}/${CHECKLIST.length}</span></h3>
    ${c.n ? `<p class="muted" style="margin:2px 0 0;font-size:0.8125rem">✅ ${CHECKLIST.filter(x => c.cl[x.id]).map(x => x.t.replace(/,.*| for .*| to see.*/, '')).join(' · ')}</p>` : ''}
    <ul class="cl">${CHECKLIST.filter(x => !c.cl[x.id]).slice(0, 3).map(x => `<li><span><span aria-hidden="true">⬜</span><span class="sr-only">To do:</span> ${x.ic} ${x.t}</span><button class="sm alt" data-cl="${x.go}" aria-label="${x.b}: ${x.t}">${x.b}</button></li>`).join('')}</ul>
    <button class="sm alt" id="clhide">Hide the checklist</button></div>`;
}
// where a checklist step or a next-step hint takes you (it never acts for you)
function goTo(where){
  if (where === 'strip') return S.run ? showRunDetails() : toast('End a week first, then tap the strip above End Week.');
  if (where === 'out') return outSheet();
  if (where === 'trip') return tripPicker();
  if (where === 'focus') { tab = 'home'; render(); const f = document.querySelector('.fbtn:not([disabled]), .mapsvg'); if (f) { f.scrollIntoView({ block: 'center' }); if (f.focus) f.focus({ preventScroll: true }); } return; }
  tab = where; render(); window.scrollTo(0,0);
}
// B8: say why overtime (and side hustles) on a long commute are dragging you down
function overtimeTip(){
  const r = S.recentF || [], n = r.filter(f => f === 'work' || f === 'hustle').length;
  if (r.length < 4 || n < 3 || S.retired) return '';
  const what = r.filter(f => f === 'work').length >= 3 ? 'Overtime' : r.filter(f => f === 'hustle').length >= 3 ? 'Side hustles' : 'Overtime and side hustles';
  return `😮‍💨 ${what} ${n} weeks in 4 ${n === 4 ? 'are' : 'is'} wearing you down${commuteOneWay() >= 20 ? ', on top of a long commute' : ''}: they cost happiness and health every week. Mix in Rest or Get outside.`;
}
// what the selected focus does this week (Take classes names the certificate or diploma it works toward)
function focusDesc(f){
  if (f.study && S.certStudy) { const c = CERTS[S.certStudy.id]; return `work toward your ${c.name} certificate (${Math.floor(S.certStudy.prog)}/${c.weeks} weeks, already paid for).`; }
  if (f.study && S.edu < 3) return `work toward a ${EDU[S.edu+1].toLowerCase()}${S.program ? ` in ${PROGRAMS[S.program].name.toLowerCase()}` : ''} (${studyDone()}/${STUDY_NEED[S.edu]} weeks). ${tuitionWords()}.`;
  return f.desc + (f.cost ? ` ${wk(cost(f.cost))}.` : '');
}
function renderHome(){
  const j = job(), f = FOCUS[S.focus];
  const work = S.retired ? '🎉 Retired' : j ? `💼 ${esc(jobTitle(j))}${CITIES[j.city].miles ? ` · ${CITIES[j.city].name}` : ''}` : '💼 No job yet';
  const cl = checklistCard(), hint = cl ? null : nextStep();
  const sugg = (stat, fk, why) => S.focus === fk ? `<div class="card warn">${why} Your focus is already ${FOCUS[fk].name}.</div>`
    : `<div class="card warn">${why} <button class="sm" data-sugg="${fk}">${FOCUS[fk].ic} ${FOCUS[fk].name} this week</button></div>`;
  $('#main').innerHTML = `<div class="homegrid"><div class="hmain">
  <div class="card"><div class="stats">
    ${statBtn('happy','Happiness', S.happy)}${statBtn('health','Health', S.health)}
    ${statBtn('community','Community', S.community)}
    <button class="stat statbtn" data-stat="net" aria-label="Net worth: what counts"><label><span>Net worth <span class="info">ⓘ</span></span></label><div style="font-weight:800;font-size:1.125rem;margin-top:2px">${fmt(netWorth())}</div></button>
  </div>${scoreButton()}</div>
  ${cl}${hint ? `<div class="card next"><div>👉 <b>Next step:</b> ${hint.t}</div><button class="sm" data-next="${hint.go}">${hint.b}</button></div>` : ''}
  ${installReady() ? `<div class="card tip installcard"><div>📲 <b>Enjoying the Burg?</b> Install it: it opens from your home screen like an app and plays offline.</div><div class="slotbtns"><button class="sm" id="install">Install</button><button class="sm alt" id="installno">Not now</button></div></div>` : ''}
  ${!j && !S.retired ? `<div class="card warn">💼 No paycheck coming in. <button class="sm" data-go="jobs">Find a job</button></div>` : ''}
  ${S.happy < 30 ? sugg('happy', 'outdoors', `😟 Happiness is low (${Math.round(S.happy)}).`) : ''}
  ${S.health < 30 ? sugg('health', 'rest', `🤒 Health is low (${Math.round(S.health)}).`) : ''}
  ${overtimeTip() ? `<div class="card warn">${overtimeTip()}</div>` : ''}
  ${S.money < -15000 ? `<div class="card warn">⚠️ Your debt is getting dangerous. Below ${fmt(mode() === 'hard' ? -25000 : -40000)} you'll have to leave town${canBankrupt() ? ' or file for bankruptcy' : ''}.</div>` : onPlan() ? `<div class="card">📞 <b>On a payment plan.</b> Your debt is still in collections (worse odds on job applications and loans until you're back above $0), but the calls stop while your cash keeps going up.</div>` : inCollections() ? `<div class="card warn">📞 Your debt is in collections: daily calls (−happiness) and worse odds on job applications and loans until you're back above $0. Raise your cash ${PLAN_WEEKS} weeks in a row to get on a payment plan.</div>` : ''}
  <div class="card"><div class="focushead"><h3>This week's focus</h3><button class="sm alt" id="planbtn" aria-pressed="${!!(S.plan && S.plan.length)}" aria-label="Focus plan: ${S.plan && S.plan.length ? 'on' : 'off'}">🗓 Plan${S.plan && S.plan.length ? ' ✓' : ''}</button></div>${scenarioLine()}${seasonLine()}${mapToggle()}
    ${prefs().mapView ? mapBlock('T') : `<div class="fgrid">${Object.entries(FOCUS).map(([k,x]) => {
      const dis = (x.needsJob && (!j || S.retired)) || (x.study && !canStudy());
      const eff = dis ? 1 : focusEffect(k, S.streakF === k ? S.streakN + 1 : 1);   // i2-a02: a fading focus says how strong it still is
      return `<button class="fbtn ${S.focus===k?'on':''}" data-f="${k}" ${dis?'disabled':''} aria-pressed="${S.focus===k}"${eff < 1 ? ` aria-label="${FOCUS_SHORT[k]}, works at ${Math.round(eff * 100)}%"` : ''}><span class="ic">${x.ic}</span><b>${FOCUS_SHORT[k]}</b>${eff < 1 ? `<small class="fade">${Math.round(eff * 100)}%</small>` : ''}</button>`;
    }).join('')}</div>
    <div class="fdesc"><b>${f.ic} ${f.name}:</b> ${focusDesc(f)}${previewLine(S.focus)}</div>`}
    ${prefs().mapView ? previewLine(S.focus) : ''}
    ${planLine()}
    ${outButton()}
  </div></div>
  <aside class="hside" aria-label="At a glance">
  <div class="card sumrow">
    <button class="sumchip" data-go="jobs">${work}</button>
    <button class="sumchip" data-go="life">🏠 ${HOMES[S.home].name.replace(/^Rented /,'')}</button>
    <button class="sumchip" data-go="life">🛻 ${CARS[S.car].name}</button>
    <button class="sumchip" data-go="life">🎓 ${EDU[S.edu].replace(' diploma','')}</button>
    <button class="sumchip${S.trip ? ' on' : ''}" id="tripchip">${tripChip()}</button>
  </div>
  ${S.log.length ? `<div class="card wideonly"><h3>📜 Lately</h3>${S.log.slice(0, 6).map(e => `<div class="logitem"><em>${e.d}</em>${e.m}</div>`).join('')}<button class="sm alt" data-go="log" style="margin-top:8px">Open the Journal</button></div>` : ''}
  </aside></div>`;
  $('#tripchip').onclick = () => S.trip ? tripSheet(S.trip.city) : tripPicker();
  $('#outbtn').onclick = outSheet;
  document.querySelectorAll('#main .fbtn[data-f]').forEach(b => b.onclick = () => { handFocus(b.dataset.f); const n = document.querySelector(`.fbtn[data-f="${S.focus}"]`); if (n) n.focus({ preventScroll: true }); const p = $('#fprev'); if (p) announce(p.textContent.replace(/\s+/g, ' ').trim()); });
  $('#planbtn').onclick = planSheet;
  document.querySelectorAll('[data-stat]').forEach(b => b.onclick = () => showStatInfo(b.dataset.stat));
  if ($('#scorenow')) $('#scorenow').onclick = showScoreNow;
  document.querySelectorAll('[data-sugg]').forEach(b => b.onclick = () => handFocus(b.dataset.sugg, true));
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tab = b.dataset.go; render(); window.scrollTo(0,0); });
  document.querySelectorAll('[data-cl], [data-next]').forEach(b => b.onclick = () => goTo(b.dataset.cl || b.dataset.next));
  if ($('#clhide')) $('#clhide').onclick = () => { setPref('clHide', true); renderHome(); announce('Checklist hidden. It\'s in the Help guide under Finding your way.'); };
  if ($('#install')) $('#install').onclick = installNow;
  if ($('#installno')) $('#installno').onclick = () => { setPref('installNo', Date.now()); renderHome(); announce('OK. Help has the install steps any time.'); };
}
// i2-a30: offer to install at a good moment: after a couple of months of play, when no other tip is showing,
// and never when it's already installed (home-screen app or the Android app) or the browser can't install it
const INSTALL_AFTER = 8, INSTALL_SNOOZE = 14 * 864e5;
const isInstalled = () => (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true || String(document.referrer || '').startsWith('android-app://');
function installReady(){
  const p = prefs();
  return !!(typeof INSTALL_EVT !== 'undefined' && INSTALL_EVT) && !S.practice && !isInstalled() && !p.installed
    && !(p.installNo && Date.now() - p.installNo < INSTALL_SNOOZE) && S.turn >= INSTALL_AFTER && !checklist();
}
function installNow(){
  const e = INSTALL_EVT; if (!e) return;
  INSTALL_EVT = null;
  try {
    e.prompt();
    Promise.resolve(e.userChoice).then(c => { if (c && c.outcome === 'accepted') { setPref('installed', true); toast('📲 Installed: find the Burg on your home screen.'); } else setPref('installNo', Date.now()); if (S && tab === 'home') renderHome(); }).catch(() => {});
  } catch(err){}
  if (S && tab === 'home') renderHome();
}
// i2-a12: picking a focus by hand; with a plan on, it pauses the plan for this week only
function handFocus(k, say){
  S.focus = k; save(); render();
  const p = planFocus();
  if (p && p !== k) toast(`Plan paused this week: ${FOCUS[k].name}. Back to the plan next week.`);
  else if (say) toast(`This week: ${FOCUS[k].name}`);
}
function planLine(){
  if (!S.plan || !S.plan.length) return '';
  const i = (S.planI || 0) % S.plan.length, p = planFocus();
  const list = S.plan.map((k, j) => j === i ? `<b>${FOCUS[k].ic} ${FOCUS_SHORT[k]}</b>` : `${FOCUS[k].ic} ${FOCUS_SHORT[k]}`).join(' → ');
  return `<div class="planline">🗓 Plan: ${list}${p !== S.focus ? ` <span class="muted">(paused this week)</span>` : ''}</div>`;
}
function planSheet(){
  let cur = S.plan && S.plan.length ? [...S.plan] : [S.focus];
  const draw = () => {
    sheet(`<h2>🗓 Focus plan</h2>
      <p class="muted">Pick up to ${PLAN_MAX} focuses that take turns, one a week, so you don't have to change it by hand. Picking a focus yourself pauses the plan for that week. A focus still fades if it comes up week after week, so mix it up.</p>
      <ol class="planlist">${cur.map((k, i) => `<li><span>Week ${i + 1}: ${FOCUS[k].ic} ${FOCUS[k].name}</span><button class="sm alt" data-rm="${i}" aria-label="Remove week ${i + 1}, ${FOCUS[k].name}">✕</button></li>`).join('') || '<li class="muted">No weeks yet.</li>'}</ol>
      ${cur.length < PLAN_MAX ? `<p style="margin:8px 0 6px"><b>Add week ${cur.length + 1}:</b></p><div class="fgrid">${Object.entries(FOCUS).map(([k, x]) =>
        `<button class="fbtn" data-add="${k}" ${planOK(k) ? '' : 'disabled'} aria-label="Add ${x.name}"><span class="ic">${x.ic}</span><b>${FOCUS_SHORT[k]}</b></button>`).join('')}</div>` : ''}
      <button class="btn primary" id="psave" ${cur.length ? '' : 'disabled'}>Use this plan</button>
      ${S.plan && S.plan.length ? '<button class="btn ghost" id="poff">Stop the plan</button>' : ''}
      <button class="btn ghost" id="close">Cancel</button>`);
    document.querySelectorAll('#sheet [data-rm]').forEach(b => b.onclick = () => { cur.splice(+b.dataset.rm, 1); draw(); });
    document.querySelectorAll('#sheet [data-add]').forEach(b => b.onclick = () => { cur.push(b.dataset.add); draw(); });
    $('#psave').onclick = () => { S.plan = cur.slice(0, PLAN_MAX); S.planI = 0; S.focus = planFocus(); save(); closeSheet(); render(); toast(`🗓 Plan on: ${S.plan.map(k => FOCUS_SHORT[k]).join(' → ')}`); };
    if ($('#poff')) $('#poff').onclick = () => { S.plan = []; S.planI = 0; save(); closeSheet(); render(); toast('Plan off: your focus stays put until you change it'); };
    $('#close').onclick = closeSheet;
  };
  draw();
}
const STATINFO = {
  happy: { t:'😊 Happiness', up:['Rest & recharge, Get outside, Show up for town', 'A partner, a dog, kids at home, a nicer home', 'Retirement'],
    down:['Stressful jobs and long commutes', 'Work extra hours, Take classes, Side hustle', 'Debt, no job, and doing the same thing for too long'], note:'Counts for 30% of your Life Score (your average over the game).' },
  health: { t:'❤️ Health', up:['Rest & recharge, Get outside', 'Seeing a doctor when you\'re run down'],
    down:['Physical jobs (farm, plants, Hanford)', 'Work extra hours, Side hustle', 'Getting older'], note:'Counts for 20% of your Life Score (your average). At 0 you land in the hospital.' },
  community: { t:'🤝 Community', up:['Show up for town', 'Working in Waitsburg (a little in Dayton)', 'Kids at home, a council seat, helping in events'],
    down:['It fades slowly if you don\'t show up', 'Skipping out on neighbors'], note:'Counts for 20% of your Life Score. Higher standing helps you get hired.' }
};
function showStatInfo(k){
  if (k === 'net') {
    const loan = S.loanLeft > 0 ? S.loanLeft * (S.loanPay || CARS.truck.pay) * 0.85 : 0;
    const t = LENGTHS[S.len].target;
    sheet(`<h2>💰 Net worth</h2><p class="muted">Everything you own minus what you owe.</p>
      <div class="kv"><span>Cash</span><span>${fmt(S.money)}</span></div>
      <div class="kv"><span>${term('equity')}</span><span>${fmt(S.equity)}</span></div>
      <div class="kv"><span>${CARS[S.car].name}</span><span>${fmt(S.carValue)}</span></div>
      <div class="kv"><span>401(k), after tax (${Math.round(K401_AFTER_TAX * 100)}% of ${fmt(S.k401 || 0)})</span><span>${fmt((S.k401 || 0) * K401_AFTER_TAX)}</span></div>
      ${S.biz ? `<div class="kv"><span>${BIZ[S.biz.type].name}</span><span>${fmt(bizValue())}</span></div>` : ''}
      ${S.stocks > 0 ? `<div class="kv"><span>Index funds</span><span>${fmt(S.stocks)}</span></div>` : ''}
      ${wineAtCost() ? `<div class="kv"><span>Wine futures (at cost)</span><span>${fmt(wineAtCost())}</span></div>` : ''}
      ${loan ? `<div class="kv"><span>Truck loan</span><span>-${fmt(loan)}</span></div>` : ''}
      ${S.sloanLeft > 0 ? `<div class="kv"><span>Student loans</span><span>-${fmt(S.sloanLeft * S.sloanPay * 0.85)}</span></div>` : ''}
      ${heBalance() ? `<div class="kv"><span>Home equity loan</span><span>-${fmt(heBalance())}</span></div>` : ''}
      <div class="kv"><span><b>Net worth</b></span><span><b>${fmt(netWorth())}</b></span></div>
      <p class="muted">Counts for 30% of your ${term('lifescore')}: ${fmt(t)} (in ${term('dollars')}) or more by the end gets full points.</p>
      <button class="btn primary" id="ok">Got it</button>`);
  } else {
    const x = STATINFO[k];
    sheet(`<h2>${x.t}: ${Math.round(S[k])}</h2>
      <h3>Goes up with</h3>${x.up.map(u => `<div class="logitem">▲ ${u}</div>`).join('')}
      <h3 style="margin-top:10px">Goes down with</h3>${x.down.map(u => `<div class="logitem">▼ ${u}</div>`).join('')}
      <p class="muted">${x.note}</p><button class="btn primary" id="ok">Got it</button>`);
  }
  $('#ok').onclick = closeSheet;
}

// weekly take-home: pay after ~15% taxes, minus commuting gas in your current vehicle
const takeHome = x => payNow(x, S.jobId === x.id) * W * (1 - taxRate(payNow(x, S.jobId === x.id))) -   // i75-b03: taxed by bracket
  commuteCost(CITIES[x.city].miles, CARS[S.car], x) * W;
function jobRow(x){
  const c = CITIES[x.city], cur = S.jobId === x.id && !S.retired, th = takeHome(x);
  const base = job() && !S.retired ? takeHome(job()) : 0, diff = th - base;
  const lock = S.edu < x.edu ? ['','Cert','Assoc.','Degree'][x.edu] : extraLock(x), back = S.recall && S.recall.job === x.id && jobInSeason(x);
  const btn = cur ? `<span class="tag cur">Current</span>`
    : lock ? `<button class="sm locked" data-locked="${x.id}" aria-label="Locked: needs ${esc(lock)}. How to unlock">🔒 ${esc(lock.replace(' program', ''))}</button>`
    : back ? `<button class="sm" data-recall="${x.id}">Go back</button>`
    : !jobInSeason(x) ? `<button class="sm" disabled aria-label="Hires again in ${MONTHS[x.season[0]]}">Hires ${MONTHS[x.season[0]].slice(0,3)}</button>`
    : `<button class="sm" data-apply="${x.id}" ${S.applied?'disabled':''}>Apply</button>`;
  const tags = [x.remote === 5 ? '🏠 fully remote' : x.remote ? `🏠 ${x.remote} remote days` : '', x.season ? `🗓️ ${seasonWords(x)}` : '', x.union ? '🪪 union' : '',
    x.apprentice && !cur ? `🧰 apprentice, ${x.apprentice.weeks / 52} yrs to full pay` : '', CLEARANCE.includes(x.id) && !cur ? '🔐 clearance' : '', majorFits(x) ? '🎓 your major' : ''].filter(Boolean);
  return `<div class="kv job${lock ? ' lockedrow' : ''}"><div><div class="t">${cur ? esc(jobTitle(x)) : x.title}</div>
    <div class="s">${x.where ? esc(x.where) + ', ' : ''}${c.name}${c.miles ? ` · ${c.miles} mi` : ' · no commute'} · pay ${wk(payNow(x, cur))}${c.miles ? `, gas ${wk(commuteCost(c.miles, CARS[S.car], x))}` : ''}${tags.length ? ` · ${tags.join(' · ')}` : ''}</div></div>
    <div style="text-align:right"><div class="pay">${fmt(th)}/wk</div>
    <div class="s">${cur ? 'take-home' : base && Math.abs(diff) >= 1 ? `<span class="${diff>0?'upt':'downt'}">${diff>0?'▲':'▼'} ${fmt(Math.abs(diff))}</span>` : 'take-home'}</div>${btn}</div></div>`;
}
let jobOK = false;
function explainLocked(id){
  const x = jobById(id); if (!x) return;
  if (S.edu >= x.edu && extraLock(x)) {         // i3-a02/a03: a certificate or a program
    const c = x.needCert && CERTS[x.needCert], pr = x.needMajor && PROGRAMS[x.needMajor];
    sheet(`<h2>🔒 ${x.title}</h2>
      <p>${c ? `This job needs a <b>${c.name}</b> certificate: a ${c.weeks}-week course for ${fmtc(c.fee)}, taken with 📚 Take classes weeks.`
        : `This job needs a diploma earned in the <b>${pr.ic} ${pr.name}</b> program. Pick the program on the Life tab before you study, and your next diploma counts.`}</p>
      <button class="btn primary" id="yes">Open the Life tab</button><button class="btn ghost" id="no">Not now</button>`);
    $('#yes').onclick = () => { closeSheet(); tab = 'life'; render(); };
    $('#no').onclick = closeSheet;
    return;
  }
  const steps = []; let weeks = 0;
  for (let l = S.edu; l < x.edu; l++) {
    const w = Math.ceil(STUDY_NEED[l] - (l === S.edu ? S.studyProg : 0)); weeks += w;
    steps.push(`<div class="kv"><span>${EDU[l+1]}</span><span>${w} weeks · ${wk(tuitionNow(l))}</span></div>`);
  }
  sheet(`<h2>🔒 ${x.title}</h2><p>This job needs a <b>${EDU[x.edu].toLowerCase()}</b>. You have a ${EDU[S.edu].toLowerCase()}.</p>
    <p class="muted">Pick <b>📚 Take classes</b> as your weekly focus to study${S.studyProg ? ` (you're ${studyDone()}/${STUDY_NEED[S.edu]} weeks into the next one)` : ''}. About ${weeks} weeks in all:</p>
    ${steps.join('')}
    ${S.focus === 'study' ? '<p><b>📚 Take classes is already your focus.</b></p>' : `<button class="btn primary" id="yes">📚 Make Take classes my focus</button>`}
    <button class="btn ghost" id="no">${S.focus === 'study' ? 'OK' : 'Not now'}</button>`);
  if ($('#yes')) $('#yes').onclick = () => { S.focus = 'study'; save(); closeSheet(); tab = 'home'; render(); toast('This week: Take classes'); };
  $('#no').onclick = closeSheet;
}
// i3: your job at the top of the Jobs tab: its ladder, apprenticeship, clearance, union, season, notice and the bus
function myJobCard(){
  const j = S.retired ? null : job(), r = refNow();
  const wait = S.interview && jobById(S.interview.id) ? `<p class="muted" style="margin:0 0 6px">📞 Waiting to hear back about the ${esc(jobById(S.interview.id).title.toLowerCase())} job (by the end of the week).</p>` : '';
  const refLine = r ? `<p class="muted" style="margin:6px 0 0">📄 ${r === 'good' ? 'Your last boss will give you a good reference (better odds when you apply).' : 'A bad reference follows you from your last job (worse odds) until ' + MONTHS[new Date(S.date + (S.ref.until - S.turn) * 7 * 864e5).getMonth()] + '.'}</p>` : '';
  const rec = S.recall && jobById(S.recall.job) ? `<p class="muted" style="margin:6px 0 0">📞 The ${esc(jobById(S.recall.job).title.toLowerCase())} job calls you back ${jobInSeason(jobById(S.recall.job)) ? 'now: tap Go back on the list' : `in ${MONTHS[jobById(S.recall.job).season[0]]}`}.</p>` : '';
  if (!j) return wait || refLine || rec ? `<div class="card"><h3>💼 Job hunt</h3>${wait}${rec}${refLine}</div>` : '';
  const L = ladderOf(j), rung = Math.min(S.rung || 0, 2), next = L[rung + 1];
  const steps = L.map((x, i) => `<li${i === rung ? ' aria-current="step"' : ''}>${i < rung ? '✅' : i === rung ? '➡️' : '⬜'} ${i === rung ? `<b>${esc(x.title)}</b>` : esc(x.title)}${i ? ` <small class="muted">+${Math.round((x.payMult - 1) * 100)}% pay</small>` : ''}</li>`).join('');
  const a = j.apprentice, app = apprenticing(j) ? `<div class="kv"><span>🧰 Apprenticeship: year ${Math.floor((S.appWeeks || 0) / 52) + 1} of ${a.weeks / 52}</span><span>${Math.round(appMult(j, true) * 100)}% pay</span></div>
    <div class="bar" role="progressbar" aria-label="Apprenticeship progress" aria-valuenow="${S.appWeeks || 0}" aria-valuemin="0" aria-valuemax="${a.weeks}"><i style="width:${(S.appWeeks || 0) / a.weeks * 100}%;background:var(--sky)"></i></div>` : '';
  const facts = [clearing() ? `🔐 Clearance pending: ${S.clearAt - S.turn} more weeks at ${Math.round(CLEAR_PAY * 100)}% pay. Heavy debt (below ${fmtc(-5000)}) can sink the check.` : '',
    j.union ? `🪪 Union job: dues ${wk(payNow(j) * UNION_DUES)}, a 1.5% step raise each January, half the layoff risk.${S.strike ? ` On strike for ${S.strike.until - S.turn} more weeks (40% strike pay).` : ''}` : '',
    S.furlough && S.turn < S.furlough.until ? `🏛️ Furloughed for ${S.furlough.until - S.turn} more weeks. Back pay so far: ${fmt(S.furlough.owed)}.` : '',
    j.season ? `🗓️ Seasonal: ${seasonWords(j)}. You're laid off when it ends and called back next season.` : '',
    j.remote === 5 ? '🏠 Fully remote: no commute, but no coworkers, so your community fades faster.' : '',
    S.bonus && S.bonus.job === j.id && S.turn < S.bonus.until ? `💵 Sign-on bonus: leave in the next ${S.bonus.until - S.turn} weeks and you pay back ${fmt(S.bonus.amt)}.` : '',
    S.notice != null ? `👋 You gave notice: your last day is in ${Math.max(0, S.notice - S.turn)} week${S.notice - S.turn === 1 ? '' : 's'}.` : ''].filter(Boolean);
  const bus = busOK(j) ? `<p class="muted" style="margin:6px 0">🚌 ${S.bus ? 'You ride the county bus' : 'County bus'} to ${CITIES[j.city].name}: ${wk(cost(BUS_PASS))} pass, 90% less commute gas and half the truck wear, but longer days (▼ a little happiness).</p>
    <button class="sm${S.bus ? ' alt' : ''}" id="bus" aria-pressed="${!!S.bus}">${S.bus ? '🚙 Drive instead' : '🚌 Ride the bus'}</button>` : '';
  return `<div class="card"><h3>💼 ${esc(jobTitle(j))}</h3>${wait}
    <p class="muted" style="margin:0 0 4px">${esc(j.where ? j.where + ', ' : '')}${CITIES[j.city].name} · ${wk(payNow(j))} · ${Math.floor(S.tenure || 0)} months on the job</p>
    <ol class="ladder" aria-label="Job ladder">${steps}</ol>
    ${next ? `<p class="muted" style="margin:4px 0">Next step up: ${esc(next.title)}. ${rungNeeds(next) ? `Needs ${rungNeeds(next)}.` : 'You qualify: watch for a promotion offer.'}</p>` : '<p class="muted" style="margin:4px 0">You\'re at the top of this ladder.</p>'}
    ${app}${facts.map(t => `<p class="muted" style="margin:4px 0">${t}</p>`).join('')}${bus}${rec}${refLine}</div>`;
}
function renderJobs(){
  syncCarpool();
  const j = job();
  const cur = S.jobId && !S.retired ? S.jobId : null;
  const list = JOBS.filter(x => (jobCity === 'all' || x.city === jobCity) && (!jobOK || (x.edu <= S.edu && !extraLock(x))))
    .sort((a, b) => (b.id === cur) - (a.id === cur) || (a.edu > S.edu || !!extraLock(a)) - (b.edu > S.edu || !!extraLock(b)) || (a.edu > S.edu ? a.edu - b.edu : 0) || takeHome(b) - takeHome(a));
  const mapOn = !!prefs().mapView;
  $('#main').innerHTML = `${myJobCard()}${mapToggle()}
  ${mapOn ? `<div class="card"><h3>Job board <span class="tag">${S.applied ? 'Applied this week' : '1 application per week'}</span></h3>${mapBlock('R')}</div>` : `
  <div class="chips"><button class="chip ok ${jobOK?'on':''}" id="jobok" aria-pressed="${jobOK}">✅ Can apply</button>${[['all','All towns'], ...Object.entries(CITIES).map(([k,c]) => [k,c.name])].map(([k,l]) =>
    `<button class="chip ${jobCity===k?'on':''}" data-c="${k}">${l}</button>`).join('')}</div>
  ${jobCity!=='all' ? `<div class="card muted">${CITIES[jobCity].blurb}</div>` : ''}
  <div class="card">
    <h3>Job board <span class="tag">${S.applied ? 'Applied this week' : '1 application per week'}</span></h3>
    <p class="muted" style="margin:0 0 4px;font-size:0.8125rem">${term('takehome')} is pay after taxes and gas${job() && !S.retired ? ', with ▲▼ against your current job' : ''}.</p>
    ${list.map(jobRow).join('') || '<p class="muted">No jobs match.</p>'}
  </div>`}
  ${j && !S.retired && commuteOneWay() >= 20 && !onBus() ? `${firstTime('carpool')}<div class="card"><h3>🚙 Carpool</h3>
    ${S.carpool ? `<p class="muted" style="margin:0 0 6px">You ride with neighbors to ${CITIES[j.city].name}: half the gas, the drive wears on you less, and you stay in the loop (▲ community).</p><button class="sm alt" id="carpool">Drive alone</button>`
      : canCarpool() ? `<p class="muted" style="margin:0 0 6px">Split the drive to ${CITIES[j.city].name} with neighbors: half the gas, less wear from the commute, and a little community.</p><button class="sm" id="carpool">Join a carpool</button>`
      : `<p class="muted" style="margin:0">Know more people in town (community 30+) and you can join a carpool: half the gas and an easier commute.</p>`}</div>` : ''}
  ${j && !S.retired && S.notice == null ? `<button class="btn ghost" id="quit">Quit my job</button>` : ''}
  ${LENGTHS[S.len].turns===Infinity && age()>=62 && !S.retired ? `<button class="btn primary" id="retire">Retire (Social Security ${wk(ssPay())}${pensionVested()?` + pension ${wk(pensionPay())}`:''}${S.k401>0?` + 401(k) ${wk(S.k401*drawRate()/12)}`:''})</button>` : ''}`;
  document.querySelectorAll('.chip[data-c]').forEach(b => b.onclick = () => { jobCity = b.dataset.c; render(); });
  if ($('#jobok')) $('#jobok').onclick = () => { jobOK = !jobOK; render(); };
  if ($('#carpool')) $('#carpool').onclick = () => { S.carpool = !S.carpool; S.carpoolJob = S.carpool ? S.jobId : null; save(); render(); toast(S.carpool ? '🚙 You joined a carpool' : 'Driving alone again'); };
  document.querySelectorAll('[data-apply]').forEach(b => b.onclick = () => apply(b.dataset.apply));
  // i3-a09: how you leave decides your reference
  if ($('#quit')) $('#quit').onclick = () => {
    const ok = (S.tenure || 0) >= 6;
    const j = job(), changes = [   // i2-a32: what will change
      `💵 Take-home: ${fmt(takeHome(j))}/wk → $0 once you've left, until you're hired again (no unemployment benefits when you quit)`,
      '😊 Happiness +3 when you go, then ▼ every week without a job',
      ...(S.carpool ? ['🚙 Your carpool ends'] : []), ...(S.focus === 'work' ? ['🛋️ Your focus changes from Work extra hours to Rest'] : []),
      ...(S.k401rate ? ['🏦 Your 401(k) savings and the employer match stop'] : [])];
    sheet(`<h2>Quit your job?</h2><p>You'll have no paycheck until you land another one. How you leave follows you to your next application.</p>
      <h3>What will change</h3><ul class="changes">${changes.map(l => `<li>${l}</li>`).join('')}</ul>
      <button class="btn primary" id="notice">Give two weeks' notice${ok ? ' (a good reference)' : ''}</button>
      ${!ok ? '<p class="muted">You\'ve been here under 6 months, so there isn\'t much of a reference to give either way.</p>' : ''}
      <button class="btn ghost" id="y">Walk out today (a bad reference for a year)</button><button class="btn ghost" id="n">Never mind</button>`);
    $('#notice').onclick = () => { S.notice = S.turn + 2; log(`Gave two weeks' notice at the ${job().title.toLowerCase()} job.`); closeSheet(); save(); render(); toast('Two weeks to go'); };
    $('#y').onclick = () => { log(`Quit the job as ${job().title}.`); leaveJob('walk'); adj({happy:3}); closeSheet(); save(); render(); };
    $('#n').onclick = closeSheet;
  };
  if ($('#bus')) $('#bus').onclick = () => { S.bus = !S.bus; if (S.bus) { S.carpool = false; S.carpoolJob = null; } save(); render(); toast(S.bus ? '🚌 You ride the county bus now' : 'Driving again'); };
  document.querySelectorAll('[data-recall]').forEach(b => b.onclick = () => { const x = jobById(b.dataset.recall); startJob(x.id, S.recall); log(`Went back to the ${x.title.toLowerCase()} job for the season.`); save(); render(); toast(`Back at work: ${x.title}`); });
  if ($('#retire')) $('#retire').onclick = () => {
    leaveJob('retire'); S.retired = true; if (S.focus==='work') S.focus='rest';
    adj({happy:10}); log(`Retired at ${age()}. Time for coffee on Main Street every morning.`);
    save(); render(); toast('Happy retirement!');
  };
}
function commuteCost(miles, car = CARS[S.car], j = null){ return miles * 2 * WORKDAYS * cost(GAS) / car.mpg * (j ? commuteGasFactor(j) : 1); }

// i3-a07: an application leads to an interview (features.js); a recruiter's sure thing or a practice life skips it
function apply(id){
  const x = jobById(id); if (!x || S.applied || extraLock(x) || !jobInSeason(x)) return;
  S.applied = true;
  const p = hireOdds(x), sure = (S.hireBy ?? -1) >= S.turn;   // a recruiter set up the interview (event)
  S.applyBoost = 0; S.hireBy = -1;                 // both count for the next application only
  if (S.practice || sure) return hired(x);
  S.interview = { id, p };
  interviewSheet(x);
  save();
}

// i3-a02 programs and i3-a03 certificates on the Life tab
function eduCard(){
  const pr = PROGRAMS[S.program], cs = S.certStudy && CERTS[S.certStudy.id];
  return `<div class="card"><h3>📚 Education</h3>
    <div class="kv"><span>Highest</span><span><b>${EDU[S.edu]}</b>${S.major ? ` <small>(${PROGRAMS[S.major].ic} ${PROGRAMS[S.major].name})</small>` : ''}</span></div>
    ${S.edu < 3 ? `<div class="kv"><span>Next: ${EDU[S.edu+1]}${pr ? ` in ${pr.name.toLowerCase()}` : ''}</span><span>${studyDone()}/${STUDY_NEED[S.edu]} weeks</span></div>
    <div class="bar"><i style="width:${S.studyProg/STUDY_NEED[S.edu]*100}%;background:var(--sky)"></i></div>
    <p class="muted">Pick "Take classes" as your focus to study through ${SCHOOL[S.edu]} (${tuitionWords()}).${cs ? ' Your certificate course comes first.' : ''}</p>
    <p style="margin:6px 0 2px"><b>Program</b> <small class="muted">Same weeks and tuition. Your diploma counts as a major in it: +${Math.round(MAJOR_PAY * 100)}% pay and better odds at matching jobs.</small></p>
    <div class="chips" role="group" aria-label="Program">${[['', '📘 General studies'], ...Object.entries(PROGRAMS).map(([k, x]) => [k, `${x.ic} ${x.name}`])].map(([k, l]) =>
      `<button class="chip ${(S.program || '') === k ? 'on' : ''}" data-prog="${k}" aria-pressed="${(S.program || '') === k}">${l}</button>`).join('')}</div>
    ${pr ? `<p class="muted" style="margin:2px 0 0">${pr.ic} Matching jobs: ${pr.jobs.map(id => jobById(id)).filter(Boolean).map(x => x.title.toLowerCase()).join(', ')}.</p>` : ''}`
    : '<p class="muted">You\'ve finished all the schooling the game offers.</p>'}
    <h3 style="margin-top:12px">📜 Short certificates</h3>
    <p class="muted" style="margin:0 0 4px">A few weeks of Take classes and a one-time fee open one door, without the whole school ladder.</p>
    ${cs ? `<div class="kv"><span>${cs.ic} ${cs.name}</span><span>${Math.floor(S.certStudy.prog)}/${cs.weeks} weeks</span></div>
      <div class="bar"><i style="width:${S.certStudy.prog / cs.weeks * 100}%;background:var(--sky)"></i></div>` : ''}
    ${Object.entries(CERTS).map(([k, c]) => `<div class="kv job"><div><div class="t">${c.ic} ${c.name}</div><div class="s">${c.weeks} weeks · ${fmtc(c.fee)} · ${c.what}</div></div>
      ${(S.certs || {})[k] ? '<span class="tag cur">Earned</span>' : S.certStudy && S.certStudy.id === k ? '<span class="tag">In progress</span>'
        : `<button class="sm" data-cert="${k}" ${S.certStudy ? 'disabled' : ''}>Sign up</button>`}</div>`).join('')}
  </div>`;
}
function renderLife(){
  const h = HOMES[S.home], u = undoTop();
  $('#main').innerHTML = `${u ? `<div class="card undo" role="status"><span>↩ ${esc(u.label)}</span><button class="sm" id="undo" aria-label="Undo: ${esc(u.label)}">Undo</button></div>` : ''}${S.practice ? '' : goalsCard()}${S.practice ? '' : skillsCard()}${S.practice ? '' : bizCard()}${S.practice ? '' : townLifeCard()}
${S.edu < 3 ? firstTime('school') : ''}${eduCard()}
  <div class="card"><h3>🏡 Home in Waitsburg</h3>
    ${Object.entries(HOMES).map(([k,x]) => {
      const cur = S.home === k;
      let btn = cur ? '<span class="tag cur">Home</span>' : `<button class="sm ${x.own?'':'alt'}" data-home="${k}">${x.own ? `Buy (${fmt(homeDown(k))} down)` : 'Move'}</button>`;
      return `<div class="kv job"><div><div class="t">${x.name}</div><div class="s">${x.own?'Mortgage':'Rent'} ${wk(cur && x.own && S.mortgage ? S.mortgage : x.own ? newMortgage(k) : cost(x.cost))}${x.own?` · builds equity · worth ${fmt(homeValue(k))}`:''}</div></div>${btn}</div>`;
    }).join('')}
    ${h.own ? `<p class="muted">${term('equity')}: <b>${fmt(S.equity)}</b>. Moving sells your house (6% agent fees).</p>` : ''}
    ${homeMoneyHTML()}
  </div>
  <div class="card"><h3>🛡️ Insurance & phone</h3>
    ${insParts().map(([l, v]) => `<div class="kv"><span>${l}</span><span>${fmtc(v)}/mo</span></div>`).join('')}
    <div class="kv"><span><b>Total</b></span><span><b>${wk(cost(insMonthly()))}</b></span></div>
    <button class="sm alt" id="inssheet">Change coverage</button>
  </div>
  ${S.practice ? '' : investCard()}
  <div class="card"><h3>🛻 Ride</h3>
    ${Object.entries(CARS).map(([k,c]) => {
      const cur = S.car === k;
      const label = k==='beater' ? 'Starter' : k==='sedan' ? `Buy ${fmt(cost(c.price))}` : `${fmt(cost(c.down))} down`;
      const btn = cur ? '<span class="tag cur">Yours</span>' : k==='beater' ? '' : `<button class="sm" data-car="${k}" ${S.loanLeft>0?'disabled':''}>${label}</button>`;
      return `<div class="kv job"><div><div class="t">${c.name}</div><div class="s">${c.mpg} mpg${c.pay?` · ${wk(cur && S.loanPay ? S.loanPay : cost(c.pay))} for 5 years`:''}</div></div>${btn}</div>`;
    }).join('')}
    <p class="muted">Trade-in value of your ride: ${fmt(S.carValue)}${tradeBonus() ? ` (+${fmt(tradeBonus())} dealer bonus this week)` : ''}${S.loanLeft>0?` · ${Math.ceil(S.loanLeft/W)} weekly payments left`:''}</p>
    <p class="muted">🔧 ${S.turn - (S.svc ?? 0) <= 26 ? 'Oil changed recently: fewer breakdowns.' : S.turn - (S.svc ?? 0) <= 52 ? `Last oil change ${S.turn - (S.svc ?? 0)} weeks ago.` : 'Overdue for an oil change: breakdowns are more likely.'} ${S.tires === S.car ? '❄️ Winter tires on.' : ''} Get car care on a trip to Dayton, Walla Walla or the Tri-Cities.</p>
  </div>
  ${S.retired ? '' : firstTime('k401')}<div class="card"><h3>🏦 Retirement savings (${term('k401')})</h3>
    <div class="kv"><span>Balance</span><span><b>${fmt(S.k401)}</b></span></div>
    <div class="kv"><span>After tax (counts in net worth)</span><span>${fmt(S.k401 * K401_AFTER_TAX)}</span></div>
    ${(S.k401match || 0) >= 1 && !S.retired ? `<div class="kv"><span>Employer match not yours yet<br><small class="muted">Vests after ${K401_VEST_MONTHS / 12} years at this job (${Math.max(0, Math.ceil((K401_VEST_MONTHS - (S.tenure || 0)) / 12 * 10) / 10)} years to go). Leave sooner and it goes back.</small></span><span>${fmt(S.k401match)}</span></div>` : ''}
    ${S.retired ? `<p class="muted">You're retired: about ${wk(S.k401*drawRate()/12)} comes out each week (${(drawRate() * 100).toFixed(1)}% this year, rising after 73 like the IRS table), taxed about ${RETIRE_TAX * 100}%.</p>` : `
    <p class="muted" style="margin:6px 0">Put part of each paycheck away before taxes. At 5% or more your employer adds 3%, yours after ${K401_VEST_MONTHS / 12} years at the job. It grows about 6% a year and pays out when you retire, taxed then, so net worth counts it at ${Math.round(K401_AFTER_TAX * 100)}%.</p>
    <div class="maptog">${K401.map((r,i) => `<button class="${S.k401rate===i?'on':''}" data-k401="${i}">${r*100}%</button>`).join('')}</div>`}
  </div>
  ${S.practice ? '' : planningCard()}
  <div class="card"><h3>❤️ Household</h3>
    <div class="kv"><span>Partner</span><span>${S.partner ? 'Together 💕' : 'Single'}</span></div>
    <div class="kv"><span>Dog</span><span>${S.dog ? 'One good dog 🐕' : 'None'}</span></div>
    <div class="kv"><span>Kids</span><span>${S.kids.length ? S.kids.map(b => Math.floor((S.ageMonths-b)/12)).map(a => a < 18 ? `age ${a}` : 'grown').join(', ') : 'None'}</span></div>
    <div class="kv"><span>Prices since 2027</span><span>${S.col > 1.005 ? `+${Math.round((S.col-1)*100)}%` : 'Same'}</span></div>
    <div class="kv"><span>Town council</span><span>${S.council ? 'Council member' : '—'}</span></div>
  </div>`;
  if ($('#goals')) $('#goals').onclick = goalsSheet;
  if ($('#undo')) $('#undo').onclick = lifeUndo;
  document.querySelectorAll('[data-biz]').forEach(b => b.onclick = () => startBiz(b.dataset.biz));
  if ($('#renew')) $('#renew').onclick = () => { const err = renewLease(); if (err) return toast(err); save(); render(); toast('🌾 Lease renewed for 5 years'); };
  if ($('#bizsell')) $('#bizsell').onclick = () => { sheet(`<h2>Sell your business?</h2><p>You'd get about ${fmt(bizValue())}.</p><button class="btn primary" id="y">Sell</button><button class="btn ghost" id="n">Keep it</button>`); $('#y').onclick = () => { closeSheet(); sellBiz(); }; $('#n').onclick = closeSheet; };
  document.querySelectorAll('[data-prog]').forEach(b => b.onclick = () => { S.program = b.dataset.prog || null; save(); render(); toast(S.program ? `${PROGRAMS[S.program].ic} Studying ${PROGRAMS[S.program].name.toLowerCase()}` : 'General studies'); });
  document.querySelectorAll('[data-cert]').forEach(b => b.onclick = () => { const c = CERTS[b.dataset.cert];
    sheet(`<h2>${c.ic} ${c.name}</h2><p>${c.what}</p><p>${c.weeks} weeks of 📚 Take classes, and ${fmtc(c.fee)} up front. Your diploma classes wait until it's done.</p>
      <button class="btn primary" id="yes">Sign up (${fmtc(c.fee)})</button><button class="btn ghost" id="no">Not now</button>`);
    $('#yes').onclick = () => { startCert(b.dataset.cert); closeSheet(); save(); render(); toast(`📜 Signed up: ${c.name}. Pick Take classes to study.`); };
    $('#no').onclick = closeSheet; });
  document.querySelectorAll('[data-home]').forEach(b => b.onclick = () => moveHome(b.dataset.home));
  document.querySelectorAll('[data-car]').forEach(b => b.onclick = () => buyCar(b.dataset.car));
  if (!S.practice) planningWire();
  document.querySelectorAll('[data-k401]').forEach(b => b.onclick = () => { S.k401rate = +b.dataset.k401; save(); renderLife(); toast(`Saving ${K401[S.k401rate]*100}% of each paycheck`); });
  // round 3: insurance, the house, crop and herd, investing
  if ($('#inssheet')) $('#inssheet').onclick = () => insSheet();
  if ($('#refi')) $('#refi').onclick = () => { sheet(`<h2>📉 Refinance?</h2><p>Standard Bearer Bank would redo your mortgage at ${S.rate.toFixed(2)}%: ${wk(S.mortgage)} becomes ${wk(refiPay())}. Closing costs are ${fmt(refiFee())}, paid now.</p>
      <p class="muted">It pays for itself in about ${Math.ceil(refiFee() / Math.max(1, S.mortgage - refiPay()))} months, so it's worth it if you'll stay a while.</p><button class="btn primary" id="y">Refinance</button><button class="btn ghost" id="no">Not now</button>`);
    $('#y').onclick = () => { if (refinance()) { closeSheet(); save(); render(); toast('📉 Refinanced'); } }; $('#no').onclick = closeSheet; };
  if ($('#heloan')) $('#heloan').onclick = heSheet;
  if ($('#sellwheat')) $('#sellwheat').onclick = () => { const v = sellStoredWheat(); save(); render(); toast(`🌾 Sold the stored wheat for ${fmt(v)}`); };
  if ($('#cropins')) $('#cropins').onclick = () => { S.biz.ins = !S.biz.ins; save(); render(); const b = $('#cropins'); if (b) b.focus({ preventScroll: true }); announce(S.biz.ins ? `Crop insurance on: ${fmt(cost(CROP_INS))} each April.` : 'Crop insurance off.'); };
  document.querySelectorAll('[data-inv]').forEach(b => b.onclick = () => {
    const v = b.dataset.inv === 'all' ? -(S.stocks || 0) : +b.dataset.inv;
    if (invest(v)) { save(); render(); toast(v > 0 ? `📈 Put ${fmt(v)} in index funds` : `📈 Took ${fmt(-v)} out`); announce(`Index funds now ${fmt(S.stocks)}. Cash ${fmt(S.money)}.`); }
  });
  if ($('#wine')) $('#wine').onclick = () => { if (buyWine()) { save(); render(); toast(`🍷 You're in on the ${wineYear()} vintage`); } };
}

/* i2-a25: undo Life-tab changes until End Week. Each change made from the Life tab (or a sheet it opened) keeps a
   copy of the life from just before it. Undo puts that copy back, keeping this week's focus. The list is cleared when
   a week is played (weekTick), when something else changes the life, and after any change that rolled the dice. */
let LIFE_UNDO = [], undoPre = null;
const UNDO_MAX = 5;
const undoKey = () => JSON.stringify({ ...S, savedAt: 0, focus: 0, plan: 0, planI: 0 });
function undoTop(){
  const u = LIFE_UNDO[LIFE_UNDO.length - 1];
  return u && S && u.life === S.slot && u.after === undoKey() ? u : null;   // stale once anything else changed the life
}
function lifeUndo(){
  const u = undoTop(); if (!u) return;
  const cur = S;
  S = JSON.parse(u.snap); S.focus = cur.focus; S.plan = cur.plan; S.planI = cur.planI;
  LIFE_UNDO.pop(); save(); render();
  toast(`Undone: ${u.label}`); announce(`Undone: ${u.label}`);
  setTimeout(() => { const b = $('#undo'); if (b) b.focus({ preventScroll: true }); }, 40);
}
document.addEventListener('click', e => {
  if (!S || S.over || S.practice || tab !== 'life' || ROLL || !e.target.closest || !e.target.closest('#main, #sheet') || e.target.closest('#undo')) return;
  const orig = Math.random, pre = { S, snap: JSON.stringify(S), key: undoKey(), logN: S.log.length, toast: $('#toast').textContent, used: false };
  pre.wrap = function(){ pre.used = true; return orig.apply(this, arguments); };   // notice any roll of the dice
  Math.random = pre.wrap; undoPre = pre;
  setTimeout(() => {
    if (Math.random === pre.wrap) Math.random = orig;
    if (undoPre === pre) undoPre = null;
    if (S !== pre.S) return;
    if (pre.used) { LIFE_UNDO = []; return; }      // a change with a roll of the dice can't be undone (no rerolls)
    const k = undoKey(); if (k === pre.key) return;
    const t = $('#toast').textContent;
    const label = S.log.length > pre.logN ? S.log[0].m : t && t !== pre.toast ? t : 'your last change';
    if (LIFE_UNDO.length && LIFE_UNDO[LIFE_UNDO.length - 1].after !== pre.key) LIFE_UNDO = [];   // something else changed the life in between
    LIFE_UNDO.push({ snap: pre.snap, after: k, label, life: S.slot });
    LIFE_UNDO = LIFE_UNDO.slice(-UNDO_MAX);
    if (tab === 'life' && $('#modal').classList.contains('hidden') && !$('#undo')) { const y = window.scrollY; render(); window.scrollTo(0, y); }
  }, 0);
}, true);
function moveHome(k){
  const x = HOMES[k], old = HOMES[S.home];
  const he = old.own ? heBalance() : 0, sale = old.own ? Math.round(S.equity * (1 - SELL_FEE) - he) : 0;   // i3-a21: 6% agent fees; i3-a23: the equity loan is paid off
  const down = x.own ? homeDown(k) : 0, need = down + cost(300), md = MOODS[homeMood()];
  if (S.money + sale < need) return toast(`You need ${fmt(need - sale)} on hand (down payment + moving).`);
  const nowPay = old.own && S.mortgage ? S.mortgage : cost(old.cost), newPay = x.own ? newMortgage(k) : cost(x.cost), dPay = (newPay - nowPay) * W;
  const dNw = -cost(300) - (old.own ? S.equity * SELL_FEE : 0);
  confirmSheet({ title: `${x.own ? 'Buy' : 'Move to'} ${x.name}?`, yes: 'Do it',
    intro: `${x.own ? `Down payment ${fmt(down)}, then ${wk(newMortgage(k))} mortgage at ${buyRate().toFixed(2)}% (locked in) from Standard Bearer Bank, with the closing papers at Mother Hubbard's Legal Cupboard.` : `Rent is ${wk(cost(x.cost))}.`} Moving costs ${fmt(cost(300))}.${old.own ? ` You'll sell your current place and pocket ${fmt(sale)} after the 6% agent fees${he ? ` and paying off the ${fmt(he)} home equity loan` : ''}.` : ''}`,
    after: `<p class="muted">${md.ic} The housing market is <b>${md.name.toLowerCase()}</b>: ${md.desc}.</p>`,
    lines: [`💵 Cash: ${fmt(S.money)} → ${fmt(S.money + sale - need)}`,
      `🏠 ${old.own ? 'Mortgage' : 'Rent'} ${wk(nowPay)} → ${x.own ? 'mortgage' : 'rent'} ${wk(newPay)} (${dPay >= 0 ? '+' : '−'}${fmt(Math.abs(dPay))} a week)`,
      `😊 Happiness +4 now, and ${x.happy > old.happy ? 'a little happier every week' : x.happy < old.happy ? 'a little less happy every week' : 'the same week to week'}`,
      ...(x.own ? [`📈 You start with ${fmt(down)} of ${term('equity')}, and it grows with each payment`] : []),
      `💰 ${term('networth', 'Net worth')}: −${fmt(-dNw)} (moving costs${old.own ? ' and 6% agent fees' : ''})`],
    onYes: () => {
      if (old.own) { S.heLeft = 0; S.hePay = 0; }
      S.money += sale - need; S.equity = down; S.mortgage = x.own ? newMortgage(k) : null; S.mortRate = x.own ? buyRate() : null; S.home = k;
      adj({happy:4}); outMoved(); log(`Moved into the ${x.name.toLowerCase()}.`);
      save(); render();
    } });
}
// i2-a32: big choices list what will change before you say yes; Never mind (or Escape) is always the safe way out
function confirmSheet({ title, intro = '', after = '', lines = [], yes = 'Do it', no = 'Cancel', onYes }){
  sheet(`<h2>${title}</h2>${intro ? `<p>${intro}</p>` : ''}${after}
    ${lines.length ? `<h3>What will change</h3><ul class="changes">${lines.map(l => `<li>${l}</li>`).join('')}</ul>` : ''}
    <button class="btn primary" id="y">${yes}</button><button class="btn ghost" id="n">${no}</button>`);
  $('#y').onclick = () => { closeSheet(); onYes(); };
  $('#n').onclick = closeSheet;
}
// weekly gas for your commute and errands in a given vehicle
const weekGas = car => (commuteOneWay() * 2 * WORKDAYS * commuteGasFactor() + ERRAND_MILES) * W * cost(GAS) / car.mpg;
function buyCar(k){
  const c = CARS[k], bonus = tradeBonus(), price = cost(k==='sedan' ? c.price : c.down) - Math.round(S.carValue) - bonus;
  if (c.pay && loanBlock()) return toast(loanBlock());          // financing needs a bank that will lend to you
  if (S.money < price) return toast(`You need ${fmt(price)} after your trade-in.`);
  const g0 = weekGas(CARS[S.car]), g1 = weekGas(c), loan = c.months ? c.months * cost(c.pay) * 0.85 : 0;
  const dNw = -price + cost(c.value) - S.carValue - loan;
  confirmSheet({ title: `Get the ${c.name.toLowerCase()}?`, yes: 'Buy it',
    intro: `Your ${CARS[S.car].name.toLowerCase()} trades in for ${fmt(S.carValue)}${bonus ? `, plus the dealer's ${fmt(bonus)} bonus this week` : ''}. You pay ${fmt(Math.max(0,price))} now${c.pay?`, then ${wk(cost(c.pay))} for 5 years (financed through Standard Bearer Bank)`:''}.`,
    lines: [`💵 Cash: ${fmt(S.money)} → ${fmt(S.money - price)}`,
      ...(c.pay ? [`🧾 A payment of ${wk(cost(c.pay))} every week for 5 years`] : []),
      `⛽ Gas: about ${fmt(g0)}/wk → ${fmt(g1)}/wk (${c.mpg} mpg instead of ${CARS[S.car].mpg})`,
      `🔧 Breakdowns get ${c.breakdown < CARS[S.car].breakdown ? 'less' : 'more'} likely`,
      '😊 Happiness +5',
      `💰 ${term('networth', 'Net worth')}: ${dNw >= 0 ? '+' : '−'}${fmt(Math.abs(dNw))}${dNw < 0 ? ' (a vehicle loses value once you drive it home' + (loan ? ', and the loan counts against you' : '') + ')' : ''}`],
    onYes: () => {
      S.money -= price; S.car = k; S.carValue = cost(c.value); S.loanLeft = c.months || 0; S.loanPay = c.pay ? cost(c.pay) : 0; S.svc = S.turn;
      adj({happy:5}); log(`Drove home a ${c.name.toLowerCase()}.`);
      save(); render();
    } });
}

const LOG_FILTERS = [['all', 'All'], ['money', '💰 Money'], ['ev', '🎲 Events'], ['mile', '🏅 Milestones'], ['trip', '🚗 Trips']];
let logFilter = 'all';
function renderLog(){
  const list = S.log.filter(e => logFilter === 'all' || (e.k || logKind(e.m)) === logFilter);
  const label = LOG_FILTERS.find(f => f[0] === logFilter)[1].replace(/^\S+ /, '');
  $('#main').innerHTML = `<div class="chips" role="group" aria-label="Show in the Journal">${LOG_FILTERS.map(([k, l]) =>
      `<button class="chip ${logFilter === k ? 'on' : ''}" data-lf="${k}" aria-pressed="${logFilter === k}">${l}</button>`).join('')}</div>
    <div class="card"><h3>📜 ${esc(S.name)}'s journal</h3>
    ${list.map(e => `<div class="logitem"><em>${e.d}</em>${e.m}</div>`).join('') || `<p class="muted">Nothing under ${label.toLowerCase()} yet.</p>`}</div>`;
  document.querySelectorAll('[data-lf]').forEach(b => b.onclick = () => {
    logFilter = b.dataset.lf; renderLog();
    const n = S.log.filter(e => logFilter === 'all' || (e.k || logKind(e.m)) === logFilter).length;
    announce(`${LOG_FILTERS.find(f => f[0] === logFilter)[1].replace(/^\S+ /, '')}: ${n} ${n === 1 ? 'entry' : 'entries'}`);
    const f = document.querySelector(`[data-lf="${logFilter}"]`); if (f) f.focus({ preventScroll: true });
  });
}

function showMenu(){
  sheet(`<h2>Menu</h2>
    <button class="btn primary" id="save">💾 Save game</button>
    <button class="btn primary" id="load">📂 Load game</button>
    <button class="btn ghost" id="backup">📤 Back up or restore</button>
    <p class="muted" style="margin-top:12px">${esc(S.name)}'s life is in slot ${S.slot+1} and also saves itself after every week.</p>
    <button class="btn ghost" id="settings">⚙️ Settings</button>
    <button class="btn ghost" id="skipopts">⏩ Skip and Auto options</button>
    <button class="btn ghost" id="help">❓ Help & tutorial</button>
    <button class="btn ghost" id="title">Back to title screen</button>
    <button class="btn ghost" id="retireNow">End this life now (see score)</button>
    <button class="btn ghost" id="close">Close</button>`);
  $('#save').onclick = saveCopySheet;
  $('#load').onclick = loadSheet;
  $('#backup').onclick = backupSheet;
  $('#settings').onclick = () => settingsSheet(true);
  $('#skipopts').onclick = skipSheet;
  $('#help').onclick = showHelp;
  $('#title').onclick = () => { save(); closeSheet(); S = null; renderTitle(); };
  $('#retireNow').onclick = confirmRetire;
  $('#close').onclick = closeSheet;
}

/* ---------- ⚙️ Settings (i2-a03): comfort options in one place; none of them changes the game ---------- */
const SETTING_ROWS = [
  ['theme', '🌗 Theme', 'Night is easier on the eyes in the dark. Match phone follows your phone\'s dark mode.'],
  ['textSize', '🔠 Text size', 'Makes all the writing bigger.'],
  ['sound', '🎵 Sounds', 'Small sounds for a new week, events and badges. Quiet while ⏩ and Auto play.'],
  ['vibrate', '📳 Vibration', 'A short buzz for events and badges, on phones that can (not iPhones).'],
  ['swipe', '👆 Swipes', 'Swipe left or right to change tabs, and swipe a pop-up\'s handle down to close it.'],
  ['motion', '✨ Animations', 'Stat bars that slide, cash that counts up after a week, and confetti for badges. Always off when your device asks for reduced motion.']
];
function settingsSheet(fromMenu = false, keep = null){
  const canBuzz = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  sheet(`<h2>⚙️ Settings</h2><p class="muted">These are saved on this device for every life. They don't change the game.</p>
    ${SETTING_ROWS.filter(([k]) => k !== 'vibrate' || canBuzz).map(([k, label, desc]) => `<div class="setrow" role="group" aria-labelledby="set-${k}">
      <div class="setl" id="set-${k}">${label}</div>
      <div class="seg">${SETTINGS[k].opts.map(([v, l]) => `<button data-set="${k}" data-v="${v}" class="${setting(k) === v ? 'on' : ''}" aria-pressed="${setting(k) === v}">${l}</button>`).join('')}</div>
      <div class="s">${desc}</div></div>`).join('')}
    <button class="btn ghost" id="back">${fromMenu ? '← Back to Menu' : 'Done'}</button>`);
  document.querySelectorAll('#sheet [data-set]').forEach(b => b.onclick = () => {
    const k = b.dataset.set, v = b.dataset.v;
    setPref(k, v); applyPrefs();
    if (k === 'sound') sfx('tap');
    if (k === 'vibrate') buzz('week');
    settingsSheet(fromMenu, { k, v, top: $('#sheet').scrollTop });
    announce(`${SETTING_ROWS.find(r => r[0] === k)[1].replace(/^\S+ /, '')}: ${b.textContent.replace(/^[^\w]+/u, '')}`);
  });
  $('#back').onclick = () => fromMenu ? showMenu() : closeSheet();
  if (keep) { const b = $(`#sheet [data-set="${keep.k}"][data-v="${keep.v}"]`); $('#sheet').scrollTop = keep.top; setTimeout(() => { if (b) b.focus({ preventScroll: true }); }, 40); }
}

// H2: ending a life early asks first, with the score so far and 'Keep playing' as the safe choice (Escape = keep playing)
function confirmRetire(){
  const { score, title } = lifeScore();
  sheet(`<h2>End ${esc(S.name)}'s life now?</h2>
    <p>Life Score so far: <b>${score}</b> (${title}).</p><p>The game ends here and this slot is cleared. This can't be undone.</p>
    <button class="btn primary" id="no">Keep playing</button>
    <button class="btn ghost" id="yes">End this life</button>`);
  $('#no').onclick = closeSheet;
  $('#yes').onclick = () => { closeSheet(); finish('You chose to wrap things up.'); };
}
/* ---------- modal ---------- */
let lastFocus = null;
function sheet(html){
  const wasOpen = !$('#modal').classList.contains('hidden');
  if (!wasOpen) lastFocus = document.activeElement && document.activeElement.id ? document.activeElement.id : null;
  const sh = $('#sheet'); sh.className = 'sheet'; sh.style.transform = ''; sh.innerHTML = html; $('#modal').classList.remove('hidden'); sh.scrollTop = 0;
  if (sheetCloser(sh)) sh.insertAdjacentHTML('afterbegin', '<div class="grab" aria-hidden="true"><i></i></div>');   // i2-a22: a handle to swipe it away
  const h = sh.querySelector('h2'); sh.setAttribute('aria-label', h ? h.textContent : 'Message');
  const first = sh.querySelector('[data-i], button.primary, button');
  if (first && !(typeof TUT !== 'undefined' && TUT)) setTimeout(() => first.focus({ preventScroll: true }), 30);   // the tutorial places focus itself
}
function closeSheet(){
  const wasOpen = !$('#modal').classList.contains('hidden');
  if (wasOpen && typeof PLAY_AT !== 'undefined') PLAY_AT = -1e9;   // a sheet in between means the next End Week tap is on purpose
  $('#modal').classList.add('hidden');
  if (wasOpen) setTimeout(() => { const el = lastFocus && document.getElementById(lastFocus); if (el && !TUT) el.focus({ preventScroll: true }); }, 30);
}
// the button that closes the open sheet the safe way (Escape and a swipe down both use it); sheets that ask
// for a choice (events with data-i buttons) have none, so they can't be swiped or escaped away
const sheetCloser = (sh = $('#sheet')) => sh.querySelector('[data-i]') ? null : ['#no', '#close', '#back', '#ok'].map(q => sh.querySelector(q)).find(Boolean) || null;
const focusables = root => [...root.querySelectorAll('button:not([disabled]), [tabindex="0"], input, a[href]')].filter(e => e.offsetParent !== null || e.closest('svg'));
// say something to screen readers without showing it
function announce(msg){ const r = $('#sr'); if (!r) return; r.textContent = ''; setTimeout(() => { r.textContent = msg; }, 60); }
document.addEventListener('keydown', e => {
  const modalOpen = !$('#modal').classList.contains('hidden'), helpOpen = !$('#helpview').classList.contains('hidden');
  const coach = document.querySelector('#coach:not(.hidden)');
  const root = coach ? null : modalOpen ? $('#sheet') : helpOpen ? $('#helpview') : null;
  if (e.key === 'Escape') {
    if (coach) { e.preventDefault(); return endTutorial(false); }
    if (modalOpen) { const b = ['#no', '#n', '#close', '#back', '#ok'].map(q => $('#sheet ' + q)).find(Boolean); if (b) { e.preventDefault(); b.click(); } return; }
    if (helpOpen) { e.preventDefault(); return closeHelp(); }
  }
  if (e.key === 'Tab' && root) {                               // keep Tab inside the open sheet or help page
    const f = focusables(root); if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- 👆 swipes (i2-a22): left/right on the page changes tabs; the handle on a pop-up swipes it closed ---------- */
const SWIPE_TABS = [['home', 'Home'], ['jobs', 'Jobs'], ['life', 'Life'], ['log', 'Journal']];
const SWIPE_MIN = 70;                 // px sideways before a swipe counts, and it must be mostly sideways, so scrolling never triggers it
let swipeAt = null;
const swipeOK = () => setting('swipe') !== 'off' && !(typeof TUT !== 'undefined' && TUT);
function swipeTab(dir){
  if (!S || !swipeOK()) return false;
  const i = SWIPE_TABS.findIndex(t => t[0] === tab), n = i + dir;
  if (i < 0 || n < 0 || n >= SWIPE_TABS.length) return false;
  tab = SWIPE_TABS[n][0]; MAPSIDE = null; MAPSEL = null; render(); window.scrollTo(0, 0);
  const m = $('#main'); if (m) m.classList.add(dir > 0 ? 'slide-l' : 'slide-r');
  announce(`${SWIPE_TABS[n][1]} tab`);
  return true;
}
document.addEventListener('pointerdown', e => {
  swipeAt = null;
  if (e.pointerType === 'mouse' || !e.isPrimary || !swipeOK()) return;
  const t = e.target;
  if (t.closest && t.closest('.grab')) { swipeAt = { kind: 'sheet', x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId }; try { t.closest('.grab').setPointerCapture(e.pointerId); } catch(_){} return; }
  if (!t.closest || !t.closest('#main') || t.closest('.chips, .mapsvg, input, textarea, .seg')) return;
  if (!$('#modal').classList.contains('hidden') || !$('#helpview').classList.contains('hidden')) return;
  swipeAt = { kind: 'tab', x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId };
});
document.addEventListener('pointermove', e => {
  if (!swipeAt || swipeAt.kind !== 'sheet' || e.pointerId !== swipeAt.id) return;
  const dy = Math.max(0, e.clientY - swipeAt.y); $('#sheet').style.transform = dy ? `translateY(${dy}px)` : '';
});
document.addEventListener('pointercancel', () => { if (swipeAt && swipeAt.kind === 'sheet') $('#sheet').style.transform = ''; swipeAt = null; });
document.addEventListener('pointerup', e => {
  const s0 = swipeAt; swipeAt = null;
  if (!s0 || e.pointerId !== s0.id) return;
  const dx = e.clientX - s0.x, dy = e.clientY - s0.y, quick = Date.now() - s0.t < 900;
  if (s0.kind === 'sheet') {
    $('#sheet').style.transform = '';
    const b = sheetCloser();
    if (dy >= SWIPE_MIN && Math.abs(dy) > Math.abs(dx) && b) b.click();
    return;
  }
  if (quick && Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > 2 * Math.abs(dy)) swipeTab(dx < 0 ? 1 : -1);
});
