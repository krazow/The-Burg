// The Burg: ui.js (part 2 of 8; scripts load in order and share one global scope)
/* ---------- title screen ---------- */
const SCENE = `<svg class="scene" viewBox="0 0 420 170" aria-hidden="true">
  <rect width="420" height="170" rx="18" fill="#cfe5f2"/>
  <circle cx="335" cy="48" r="24" fill="#f4d58d"/>
  <path d="M0 105 C70 70 130 90 200 80 S330 60 420 85 V170 H0Z" fill="#8fae7e"/>
  <rect x="78" y="40" width="34" height="80" fill="#fbf6ea"/><polygon points="78,40 95,20 112,40" fill="#fbf6ea"/>
  <rect x="114" y="62" width="26" height="58" fill="#efe3c8"/><rect x="86" y="50" width="18" height="10" fill="#9b2f1f"/>
  <rect x="230" y="78" width="54" height="40" fill="#9b2f1f"/><polygon points="226,80 257,58 288,80" fill="#6f1f14"/>
  <rect x="250" y="96" width="14" height="22" fill="#fbf6ea"/>
  <path d="M0 120 C90 100 180 125 260 118 S380 100 420 110 V170 H0Z" fill="#e9c46a"/>
  <path d="M0 145 C100 130 220 152 320 142 S400 132 420 138 V170 H0Z" fill="#c99a3b"/>
  <path d="M30 160 C120 150 200 162 300 155" stroke="#7fb3d5" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

function renderTitle(){
  const all = slots(), used = all.filter(Boolean).length;
  const more = !!prefs().moreOpts;
  let len = 'half';
  $('#app').innerHTML = `<div class="title">
    ${SCENE}
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
  S = migrate(clone(g)); S.slot = i; tab = 'home'; MAPSIDE = null; MAPSEL = null; useDice();
  closeSheet(); render(); window.scrollTo(0,0);
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
  $('#app').innerHTML = `
  <header class="top">
    <div class="row"><h2>${esc(S.name)}${S.practice ? ' <span class="tag">Practice</span>' : ''}${mode() !== 'normal' && !S.practice ? ` <span class="tag">${MODES[mode()].ic} ${MODES[mode()].name}</span>` : ''}${S.scenario ? ` <span class="tag">🏁</span>` : ''}${S.weekly ? ` <span class="tag">📅</span>` : ''}${S.gen > 1 ? ` <span class="tag">🌳 ${S.gen}</span>` : ''}</h2><div class="hdr-r"><div class="money">${fmt(S.money)}</div><button id="helpbtn" aria-label="Help and tutorial">?</button></div></div>
    <div class="meta"><span>${dateLabel()} · age ${age()}</span><span>${left}</span></div>
    <div class="progress"><i style="width:${pct}%"></i></div>
  </header>
  <main id="main"></main>
  ${tab==='home' ? `${S.run ? `<button class="weekstrip" id="strip" aria-label="What the last ${S.run.weeks > 1 ? S.run.weeks + ' weeks' : 'week'} did: details"><span class="wl">${S.run.weeks > 1 ? `Last ${S.run.weeks} wks` : 'Last week'}</span><span class="wc">${runChips()}</span><span class="more">›</span></button>` : ''}
    <div class="endbar"><button class="btn primary" id="end">End Week →<small>${FOCUS[S.focus].ic} ${FOCUS_SHORT[S.focus]}</small></button>
    <button class="btn ghost" id="ff4" aria-label="Skip 4 weeks">⏩ 4</button>${big ? `<button class="btn ghost" id="ff13" aria-label="Skip 13 weeks">⏩ 13</button>` : ''}<button class="btn ghost" id="auto" aria-label="Play until something happens">⏭ Auto</button></div>` : ''}
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
  if ($('#end')) $('#end').onclick = endTurn;
  if ($('#ff4')) $('#ff4').onclick = () => playWeeks(4);
  if ($('#ff13')) $('#ff13').onclick = () => playWeeks(13);
  if ($('#auto')) $('#auto').onclick = () => playWeeks(26);
  if ($('#strip')) $('#strip').onclick = showRunDetails;
  ({home:renderHome, jobs:renderJobs, life:renderLife, log:renderLog})[tab]();
  document.querySelectorAll('[data-apply]').forEach(b => b.onclick = () => apply(b.dataset.apply));
  document.querySelectorAll('[data-locked]').forEach(b => b.onclick = () => explainLocked(b.dataset.locked));
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const statColor = v => v >= 60 ? 'var(--sage)' : v >= 35 ? 'var(--wheat-d)' : 'var(--barn)';
const statBar = (label, v) => `<div class="stat"><label><span>${label}</span><span>${Math.round(v)}</span></label>
  <div class="bar"><i style="width:${v}%;background:${statColor(v)}"></i></div></div>`;

const FOCUS_SHORT = { work:'Work extra', rest:'Rest', community:'Town', study:'Classes', outdoors:'Outside', hustle:'Hustle' };
const statBtn = (k, label, v) => `<button class="stat statbtn" data-stat="${k}" aria-label="${label} ${Math.round(v)}: what moves it">
  <label><span>${label} <span class="info">ⓘ</span></span><span>${Math.round(v)}</span></label>
  <div class="bar"><i style="width:${v}%;background:${statColor(v)}"></i></div></button>`;
// one-time tips for new players (remembered across games)
const TIPS = [
  { id:'focus', when:() => S.turn === 0 && S.jobId, text:'👋 Pick what to spend this week on, then tap <b>End Week</b>. Your focus repeats each week until you change it.' },
  { id:'strip', when:() => S.run && S.turn >= 1, text:'📊 The strip above End Week shows what your week did. Tap it for details. <b>⏩</b> skips ahead and <b>⏭ Auto</b> plays until something needs you.' },
  { id:'tabs',  when:() => S.turn >= 4, text:'💼 <b>Jobs</b> has better-paying work, and 🌾 <b>Life</b> has homes, rides, savings and schooling.' }
];
// B8: say why overtime (and side hustles) on a long commute are dragging you down
function overtimeTip(){
  const r = S.recentF || [], n = r.filter(f => f === 'work' || f === 'hustle').length;
  if (r.length < 4 || n < 3 || S.retired) return '';
  const what = r.filter(f => f === 'work').length >= 3 ? 'Overtime' : r.filter(f => f === 'hustle').length >= 3 ? 'Side hustles' : 'Overtime and side hustles';
  return `😮‍💨 ${what} ${n} weeks in 4 ${n === 4 ? 'are' : 'is'} wearing you down${commuteOneWay() >= 20 ? ', on top of a long commute' : ''}: they cost happiness and health every week. Mix in Rest or Get outside.`;
}
function currentTip(){ if (S.practice) return null; const done = prefs().tips || []; return TIPS.find(t => !done.includes(t.id) && t.when()); }
function renderHome(){
  const j = job(), f = FOCUS[S.focus];
  const work = S.retired ? '🎉 Retired' : j ? `💼 ${j.title}${CITIES[j.city].miles ? ` · ${CITIES[j.city].name}` : ''}` : '💼 No job yet';
  const tip = currentTip();
  const sugg = (stat, fk, why) => S.focus === fk ? `<div class="card warn">${why} Your focus is already ${FOCUS[fk].name}.</div>`
    : `<div class="card warn">${why} <button class="sm" data-sugg="${fk}">${FOCUS[fk].ic} ${FOCUS[fk].name} this week</button></div>`;
  const streak = S.streakF === S.focus && S.focus !== 'study' && S.streakN >= 4
    ? `<div class="s">🔁 ${S.streakN} weeks in a row: next week it works at ${Math.round(focusEffect(S.focus, S.streakN + 1) * 100)}%${S.streakN >= RUT_WEEKS ? ', and you\'re in a rut (−happiness)' : ''}.</div>` : '';
  $('#main').innerHTML = `<div class="homegrid"><div class="hmain">
  <div class="card"><div class="stats">
    ${statBtn('happy','Happiness', S.happy)}${statBtn('health','Health', S.health)}
    ${statBtn('community','Community', S.community)}
    <button class="stat statbtn" data-stat="net" aria-label="Net worth: what counts"><label><span>Net worth <span class="info">ⓘ</span></span></label><div style="font-weight:800;font-size:1.125rem;margin-top:2px">${fmt(netWorth())}</div></button>
  </div>${scoreButton()}</div>
  ${tip ? `<div class="card tip"><div>${tip.text}</div><button class="sm alt" data-tip="${tip.id}">Got it</button></div>` : ''}
  ${installReady() ? `<div class="card tip installcard"><div>📲 <b>Enjoying the Burg?</b> Install it: it opens from your home screen like an app and plays offline.</div><div class="slotbtns"><button class="sm" id="install">Install</button><button class="sm alt" id="installno">Not now</button></div></div>` : ''}
  ${!j && !S.retired ? `<div class="card warn">💼 No paycheck coming in. <button class="sm" data-go="jobs">Find a job</button></div>` : ''}
  ${S.happy < 30 ? sugg('happy', 'outdoors', `😟 Happiness is low (${Math.round(S.happy)}).`) : ''}
  ${S.health < 30 ? sugg('health', 'rest', `🤒 Health is low (${Math.round(S.health)}).`) : ''}
  ${overtimeTip() ? `<div class="card warn">${overtimeTip()}</div>` : ''}
  ${S.money < -15000 ? `<div class="card warn">⚠️ Your debt is getting dangerous. Below -$40,000 you'll have to leave town.</div>` : ''}
  <div class="card"><div class="focushead"><h3>This week's focus</h3></div>${scenarioLine()}${seasonLine()}${mapToggle()}
    ${prefs().mapView ? mapBlock('T') : `<div class="fgrid">${Object.entries(FOCUS).map(([k,x]) => {
      const dis = (x.needsJob && (!j || S.retired)) || (x.study && S.edu >= 3);
      return `<button class="fbtn ${S.focus===k?'on':''}" data-f="${k}" ${dis?'disabled':''} aria-pressed="${S.focus===k}"><span class="ic">${x.ic}</span><b>${FOCUS_SHORT[k]}</b></button>`;
    }).join('')}</div>
    <div class="fdesc"><b>${f.ic} ${f.name}:</b> ${f.study && S.edu < 3 ? `work toward a ${EDU[S.edu+1].toLowerCase()} (${studyDone()}/${STUDY_NEED[S.edu]} weeks).` : f.desc}${f.study && S.edu < 3 ? ` ${wk(cost(TUITION[S.edu]))}.` : f.cost ? ` ${wk(cost(f.cost))}.` : ''}${streak}</div>`}
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
  document.querySelectorAll('.fbtn').forEach(b => b.onclick = () => { S.focus = b.dataset.f; save(); render(); });
  document.querySelectorAll('[data-stat]').forEach(b => b.onclick = () => showStatInfo(b.dataset.stat));
  if ($('#scorenow')) $('#scorenow').onclick = showScoreNow;
  document.querySelectorAll('[data-sugg]').forEach(b => b.onclick = () => { S.focus = b.dataset.sugg; save(); render(); toast(`This week: ${FOCUS[S.focus].name}`); });
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tab = b.dataset.go; render(); window.scrollTo(0,0); });
  document.querySelectorAll('[data-tip]').forEach(b => b.onclick = () => { setPref('tips', [...(prefs().tips || []), b.dataset.tip]); renderHome(); });
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
    && !(p.installNo && Date.now() - p.installNo < INSTALL_SNOOZE) && S.turn >= INSTALL_AFTER && !currentTip();
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
      <div class="kv"><span>Home equity</span><span>${fmt(S.equity)}</span></div>
      <div class="kv"><span>${CARS[S.car].name}</span><span>${fmt(S.carValue)}</span></div>
      <div class="kv"><span>401(k)</span><span>${fmt(S.k401 || 0)}</span></div>
      ${loan ? `<div class="kv"><span>Truck loan</span><span>-${fmt(loan)}</span></div>` : ''}
      <div class="kv"><span><b>Net worth</b></span><span><b>${fmt(netWorth())}</b></span></div>
      <p class="muted">Counts for 30% of your Life Score: ${fmt(t)} (in 2027 dollars) or more by the end gets full points.</p>
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
const takeHome = x => payNow(x, S.jobId === x.id) * W * 0.85 - commuteCost(CITIES[x.city].miles, CARS[S.car], x) * W;
function jobRow(x){
  const c = CITIES[x.city], cur = S.jobId === x.id && !S.retired, th = takeHome(x);
  const base = job() && !S.retired ? takeHome(job()) : 0, diff = th - base;
  const btn = cur ? `<span class="tag cur">Current</span>`
    : S.edu < x.edu ? `<button class="sm locked" data-locked="${x.id}" aria-label="Locked: how to unlock">🔒 ${['','Cert','Assoc.','Degree'][x.edu]}</button>`
    : `<button class="sm" data-apply="${x.id}" ${S.applied?'disabled':''}>Apply</button>`;
  return `<div class="kv job${S.edu < x.edu ? ' lockedrow' : ''}"><div><div class="t">${x.title}</div>
    <div class="s">${x.where ? esc(x.where) + ', ' : ''}${c.name}${c.miles ? ` · ${c.miles} mi` : ' · no commute'} · pay ${wk(payNow(x, cur))}${c.miles ? `, gas ${wk(commuteCost(c.miles, CARS[S.car], x))}` : ''}${x.remote ? ` · 🏠 ${x.remote} remote days` : ''}</div></div>
    <div style="text-align:right"><div class="pay">${fmt(th)}/wk</div>
    <div class="s">${cur ? 'take-home' : base && Math.abs(diff) >= 1 ? `<span class="${diff>0?'upt':'downt'}">${diff>0?'▲':'▼'} ${fmt(Math.abs(diff))}</span>` : 'take-home'}</div>${btn}</div></div>`;
}
let jobOK = false;
function explainLocked(id){
  const x = jobById(id); if (!x) return;
  const steps = []; let weeks = 0;
  for (let l = S.edu; l < x.edu; l++) {
    const w = Math.ceil(STUDY_NEED[l] - (l === S.edu ? S.studyProg : 0)); weeks += w;
    steps.push(`<div class="kv"><span>${EDU[l+1]}</span><span>${w} weeks · ${wk(cost(TUITION[l]))}</span></div>`);
  }
  sheet(`<h2>🔒 ${x.title}</h2><p>This job needs a <b>${EDU[x.edu].toLowerCase()}</b>. You have a ${EDU[S.edu].toLowerCase()}.</p>
    <p class="muted">Pick <b>📚 Take classes</b> as your weekly focus to study${S.studyProg ? ` (you're ${studyDone()}/${STUDY_NEED[S.edu]} weeks into the next one)` : ''}. About ${weeks} weeks in all:</p>
    ${steps.join('')}
    ${S.focus === 'study' ? '<p><b>📚 Take classes is already your focus.</b></p>' : `<button class="btn primary" id="yes">📚 Make Take classes my focus</button>`}
    <button class="btn ghost" id="no">${S.focus === 'study' ? 'OK' : 'Not now'}</button>`);
  if ($('#yes')) $('#yes').onclick = () => { S.focus = 'study'; save(); closeSheet(); tab = 'home'; render(); toast('This week: Take classes'); };
  $('#no').onclick = closeSheet;
}
function renderJobs(){
  syncCarpool();
  const j = job();
  const cur = S.jobId && !S.retired ? S.jobId : null;
  const list = JOBS.filter(x => (jobCity === 'all' || x.city === jobCity) && (!jobOK || x.edu <= S.edu))
    .sort((a, b) => (b.id === cur) - (a.id === cur) || (a.edu > S.edu) - (b.edu > S.edu) || (a.edu > S.edu ? a.edu - b.edu : 0) || takeHome(b) - takeHome(a));
  const mapOn = !!prefs().mapView;
  $('#main').innerHTML = `${mapToggle()}
  ${mapOn ? `<div class="card"><h3>Job board <span class="tag">${S.applied ? 'Applied this week' : '1 application per week'}</span></h3>${mapBlock('R')}</div>` : `
  <div class="chips"><button class="chip ok ${jobOK?'on':''}" id="jobok" aria-pressed="${jobOK}">✅ Can apply</button>${[['all','All towns'], ...Object.entries(CITIES).map(([k,c]) => [k,c.name])].map(([k,l]) =>
    `<button class="chip ${jobCity===k?'on':''}" data-c="${k}">${l}</button>`).join('')}</div>
  ${jobCity!=='all' ? `<div class="card muted">${CITIES[jobCity].blurb}</div>` : ''}
  <div class="card">
    <h3>Job board <span class="tag">${S.applied ? 'Applied this week' : '1 application per week'}</span></h3>
    <p class="muted" style="margin:0 0 4px;font-size:0.8125rem">Take-home is pay after taxes and gas${job() && !S.retired ? ', with ▲▼ against your current job' : ''}.</p>
    ${list.map(jobRow).join('') || '<p class="muted">No jobs match.</p>'}
  </div>`}
  ${j && !S.retired && commuteOneWay() >= 20 ? `<div class="card"><h3>🚙 Carpool</h3>
    ${S.carpool ? `<p class="muted" style="margin:0 0 6px">You ride with neighbors to ${CITIES[j.city].name}: half the gas, the drive wears on you less, and you stay in the loop (▲ community).</p><button class="sm alt" id="carpool">Drive alone</button>`
      : canCarpool() ? `<p class="muted" style="margin:0 0 6px">Split the drive to ${CITIES[j.city].name} with neighbors: half the gas, less wear from the commute, and a little community.</p><button class="sm" id="carpool">Join a carpool</button>`
      : `<p class="muted" style="margin:0">Know more people in town (community 30+) and you can join a carpool: half the gas and an easier commute.</p>`}</div>` : ''}
  ${j && !S.retired ? `<button class="btn ghost" id="quit">Quit my job</button>` : ''}
  ${LENGTHS[S.len].turns===Infinity && age()>=62 && !S.retired ? `<button class="btn primary" id="retire">Retire (Social Security ${wk(ssPay())}${pensionVested()?` + pension ${wk(pensionPay())}`:''}${S.k401>0?` + 401(k) ${wk(S.k401*0.04/12)}`:''})</button>` : ''}`;
  document.querySelectorAll('.chip[data-c]').forEach(b => b.onclick = () => { jobCity = b.dataset.c; render(); });
  if ($('#jobok')) $('#jobok').onclick = () => { jobOK = !jobOK; render(); };
  if ($('#carpool')) $('#carpool').onclick = () => { S.carpool = !S.carpool; S.carpoolJob = S.carpool ? S.jobId : null; save(); render(); toast(S.carpool ? '🚙 You joined a carpool' : 'Driving alone again'); };
  document.querySelectorAll('[data-apply]').forEach(b => b.onclick = () => apply(b.dataset.apply));
  if ($('#quit')) $('#quit').onclick = () => {
    sheet(`<h2>Quit your job?</h2><p>You'll have no paycheck until you land another one.</p>
      <button class="btn primary" id="y">Quit</button><button class="btn ghost" id="n">Never mind</button>`);
    $('#y').onclick = () => { log(`Quit the job as ${job().title}.`); S.jobId = null; adj({happy:3}); if (S.focus==='work') S.focus='rest'; closeSheet(); save(); render(); };
    $('#n').onclick = closeSheet;
  };
  if ($('#retire')) $('#retire').onclick = () => {
    S.retired = true; S.jobId = null; if (S.focus==='work') S.focus='rest';
    adj({happy:10}); log(`Retired at ${age()}. Time for coffee on Main Street every morning.`);
    save(); render(); toast('Happy retirement!');
  };
}
function commuteCost(miles, car = CARS[S.car], j = null){ return miles * 2 * WORKDAYS * cost(GAS) / car.mpg * (j ? commuteGasFactor(j) : 1); }

function apply(id){
  const x = jobById(id); if (S.applied) return;
  S.applied = true;
  let p = 0.5 + S.community * 0.004 + (S.edu > x.edu ? 0.12 : 0) + (x.city === 'waitsburg' ? 0.1 : 0) + skillLv('people') * 0.04 + outLookBonus();
  if (!S.jobId) p += 0.08;
  p += S.applyBoost || 0;                          // new work clothes from a clearance sale (event)
  const sure = (S.hireBy ?? -1) >= S.turn;         // a recruiter set up the interview (event)
  S.applyBoost = 0; S.hireBy = -1;                 // both count for the next application only
  if (S.practice || sure || chance(Math.min(0.92, p))) {
    S.jobId = id; S.jobMonths = 0; S.raise = 1;
    log(`Hired as ${x.title} in ${CITIES[x.city].name}!`); adj({happy:5});
    sheet(`<div class="big">🎉</div><h2 style="text-align:center">You're hired!</h2>
      <p style="text-align:center">${x.title} in ${CITIES[x.city].name} at ${wk(payNow(x))}.</p><button class="btn primary" id="ok">Let's go</button>`);
  } else {
    log(`Applied for ${x.title} in ${CITIES[x.city].name}. They went with someone else.`); adj({happy:-2});
    sheet(`<div class="big">📭</div><h2 style="text-align:center">Not this time</h2>
      <p style="text-align:center">The ${x.title} job went to someone else. You can apply again next ${turnWord().toLowerCase()}.</p>
      <p class="muted" style="text-align:center">Tip: higher Community standing and more schooling help.</p><button class="btn primary" id="ok">OK</button>`);
  }
  $('#ok').onclick = () => { closeSheet(); tab = 'home'; render(); };
  save();
}

function renderLife(){
  const h = HOMES[S.home];
  $('#main').innerHTML = `${S.practice ? '' : goalsCard()}${S.practice ? '' : skillsCard()}${S.practice ? '' : bizCard()}${S.practice ? '' : townLifeCard()}
  <div class="card"><h3>📚 Education</h3>
    <div class="kv"><span>Highest</span><span><b>${EDU[S.edu]}</b></span></div>
    ${S.edu < 3 ? `<div class="kv"><span>Next: ${EDU[S.edu+1]}</span><span>${studyDone()}/${STUDY_NEED[S.edu]} weeks</span></div>
    <div class="bar"><i style="width:${S.studyProg/STUDY_NEED[S.edu]*100}%;background:var(--sky)"></i></div>
    <p class="muted">Pick "Take classes" as your focus to study through ${SCHOOL[S.edu]} (${wk(cost(TUITION[S.edu]))}).</p>` : '<p class="muted">You\'ve finished all the schooling the game offers.</p>'}
  </div>
  <div class="card"><h3>🏡 Home in Waitsburg</h3>
    ${Object.entries(HOMES).map(([k,x]) => {
      const cur = S.home === k;
      let btn = cur ? '<span class="tag cur">Home</span>' : `<button class="sm ${x.own?'':'alt'}" data-home="${k}">${x.own ? `Buy (${fmt(cost(x.down))} down)` : 'Move'}</button>`;
      return `<div class="kv job"><div><div class="t">${x.name}</div><div class="s">${x.own?'Mortgage':'Rent'} ${wk(cur && x.own && S.mortgage ? S.mortgage : cost(x.cost))}${x.own?' · builds equity':''}</div></div>${btn}</div>`;
    }).join('')}
    ${h.own ? `<p class="muted">Home equity: <b>${fmt(S.equity)}</b>. Moving sells your house (6% fees).</p>` : ''}
  </div>
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
  <div class="card"><h3>🏦 Retirement savings (401(k))</h3>
    <div class="kv"><span>Balance</span><span><b>${fmt(S.k401)}</b></span></div>
    ${S.retired ? `<p class="muted">You're retired: about ${wk(S.k401*0.04/12)} comes out each week.</p>` : `
    <p class="muted" style="margin:6px 0">Put part of each paycheck away before taxes. At 5% or more your employer adds 3%. It grows about 6% a year and pays out when you retire.</p>
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
  document.querySelectorAll('[data-biz]').forEach(b => b.onclick = () => startBiz(b.dataset.biz));
  if ($('#renew')) $('#renew').onclick = () => { const err = renewLease(); if (err) return toast(err); save(); render(); toast('🌾 Lease renewed for 5 years'); };
  if ($('#bizsell')) $('#bizsell').onclick = () => { sheet(`<h2>Sell your business?</h2><p>You'd get about ${fmt(bizValue())}.</p><button class="btn primary" id="y">Sell</button><button class="btn ghost" id="n">Keep it</button>`); $('#y').onclick = () => { closeSheet(); sellBiz(); }; $('#n').onclick = closeSheet; };
  document.querySelectorAll('[data-home]').forEach(b => b.onclick = () => moveHome(b.dataset.home));
  document.querySelectorAll('[data-car]').forEach(b => b.onclick = () => buyCar(b.dataset.car));
  if (!S.practice) planningWire();
  document.querySelectorAll('[data-k401]').forEach(b => b.onclick = () => { S.k401rate = +b.dataset.k401; save(); renderLife(); toast(`Saving ${K401[S.k401rate]*100}% of each paycheck`); });
}

function moveHome(k){
  const x = HOMES[k], old = HOMES[S.home];
  const sale = old.own ? Math.round(S.equity * 0.94) : 0;
  const need = (x.own ? cost(x.down) : 0) + cost(300);
  if (S.money + sale < need) return toast(`You need ${fmt(need - sale)} on hand (down payment + moving).`);
  sheet(`<h2>${x.own ? 'Buy' : 'Move to'} ${x.name}?</h2>
    <p>${x.own ? `Down payment ${fmt(cost(x.down))}, then ${wk(cost(x.cost))} mortgage (locked in) from Standard Bearer Bank, with the closing papers at Mother Hubbard's Legal Cupboard.` : `Rent is ${wk(cost(x.cost))}.`} Moving costs ${fmt(cost(300))}.</p>
    ${old.own ? `<p>You'll sell your current place and pocket ${fmt(sale)}.</p>` : ''}
    <button class="btn primary" id="y">Do it</button><button class="btn ghost" id="n">Cancel</button>`);
  $('#y').onclick = () => {
    S.money += sale - need; S.equity = x.own ? cost(x.down) : 0; S.mortgage = x.own ? cost(x.cost) : null; S.home = k;
    adj({happy:4}); outMoved(); log(`Moved into the ${x.name.toLowerCase()}.`);
    closeSheet(); save(); render();
  };
  $('#n').onclick = closeSheet;
}
function buyCar(k){
  const c = CARS[k], bonus = tradeBonus(), price = cost(k==='sedan' ? c.price : c.down) - Math.round(S.carValue) - bonus;
  if (S.money < price) return toast(`You need ${fmt(price)} after your trade-in.`);
  sheet(`<h2>Get the ${c.name.toLowerCase()}?</h2>
    <p>Your ${CARS[S.car].name.toLowerCase()} trades in for ${fmt(S.carValue)}${bonus ? `, plus the dealer's ${fmt(bonus)} bonus this week` : ''}. You pay ${fmt(Math.max(0,price))} now${c.pay?`, then ${wk(cost(c.pay))} for 5 years (financed through Standard Bearer Bank)`:''}.</p>
    <button class="btn primary" id="y">Buy it</button><button class="btn ghost" id="n">Cancel</button>`);
  $('#y').onclick = () => {
    S.money -= price; S.car = k; S.carValue = cost(c.value); S.loanLeft = c.months || 0; S.loanPay = c.pay ? cost(c.pay) : 0; S.svc = S.turn;
    adj({happy:5}); log(`Drove home a ${c.name.toLowerCase()}.`);
    closeSheet(); save(); render();
  };
  $('#n').onclick = closeSheet;
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
    <button class="btn ghost" id="help">❓ Help & tutorial</button>
    <button class="btn ghost" id="title">Back to title screen</button>
    <button class="btn ghost" id="retireNow">End this life now (see score)</button>
    <button class="btn ghost" id="close">Close</button>`);
  $('#save').onclick = saveCopySheet;
  $('#load').onclick = loadSheet;
  $('#backup').onclick = backupSheet;
  $('#settings').onclick = () => settingsSheet(true);
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
  ['swipe', '👆 Swipes', 'Swipe left or right to change tabs, and swipe a pop-up\'s handle down to close it.']
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
    if (modalOpen) { const b = ['#no', '#close', '#back', '#ok'].map(q => $('#sheet ' + q)).find(Boolean); if (b) { e.preventDefault(); b.click(); } return; }
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
