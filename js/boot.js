// The Burg: boot.js (part 8 of 8; scripts load in order and share one global scope)
/* ---------- boot ---------- */
applyPrefs();                    // i2-a03: text size and theme are on <html> before anything draws
// i2-a30: keep the browser's install offer for the right moment (a card on Home), instead of its own pop-up
let INSTALL_EVT = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); INSTALL_EVT = e;   // i70-b21: no redraw now; the card shows at the next one, below the focus grid
});
window.addEventListener('appinstalled', () => { INSTALL_EVT = null; setPref('installed', true); if (S && tab === 'home' && $('#main')) renderHome(); });
// i57-a10: no inline handlers (the page's content security policy forbids them). Buttons drawn as HTML strings
// name a game function in data-call (and its argument in data-arg); pins drawn as SVG also answer Enter and Space.
const CALLS = { MAPTAP: k => MAPTAP(k), MAPTAB: k => MAPTAB(k), MAPPREF: v => MAPPREF(v === '1'), TRIPTO: k => TRIPTO(k), MAPFOCUS: f => MAPFOCUS(f),
  BIZTAP: id => BIZTAP(id), outSheet: () => outSheet(), teaserSheet: id => teaserSheet(id),
  helpgo: id => helpJump(id),
  helptop: () => $('#helpview').scrollTo({ top: 0, behavior: calmMotion() ? 'auto' : 'smooth' }) };
document.addEventListener('click', e => {
  const el = e.target && e.target.closest && e.target.closest('[data-call]');
  if (!el || el.disabled || !CALLS[el.dataset.call]) return;
  CALLS[el.dataset.call](el.dataset.arg);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target && e.target.closest && e.target.closest('[data-call]');
  if (!el || /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;     // real buttons already click on Enter and Space
  e.preventDefault(); el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
// i60-a08: leaving the app (switching apps, locking the phone, closing the tab) saves this week's changes first,
// so a focus change, an application or a planned trip survives the phone closing the app
// i70-b12: the sound engine sleeps while the game is in the background (sfx() wakes it for the next sound)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return;
  save();
  try { if (AUDIO && AUDIO.state === 'running') AUDIO.suspend().catch(() => {}); } catch(e){}
});
window.addEventListener('pagehide', () => save());
// i54-a14: another window saved this life: pick up its week here instead of writing over it later
window.addEventListener('storage', e => {
  if (!S || S.over || S.practice || e.key !== slotKey(S.slot ?? 0)) return;
  const g = newerOnDisk(); if (g) adoptNewer(g);
});
tagEventTiers();                 // to-do 2 D4: every event knows its difficulty tier
pruneWeekly();
renderTitle();
setPref('lastSeen', Date.now());                 // i73-b13: the next visit can tell how long you were away
if (slots().some(Boolean)) playedFlag(true);     // i63-b05: remember, in a second place, that this browser has lives
whatsNew();
// i3-b03: if the browser already keeps this game's storage, the backup sheet can say so without asking
try { if (navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then(p => { if (p) PERSIST = true; }).catch(() => {}); } catch(e){}
// i3-b08: a new version installs in the background and waits; "Update ready" on Home or the title screen swaps it in
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { try {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const check = w => { if (w && w.state === 'installed' && navigator.serviceWorker.controller) updateFound(reg); };
      check(reg.waiting);
      reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => check(w)); });
    }).catch(() => {});
  } catch(e){} });
}
/* ---------- i3-b07: a calm sheet when something breaks, instead of a frozen screen ---------- */
let OOPS_N = 0;
function oops(err){
  if (OOPS_N >= 3 || $('#sheet.oops') || typeof sheet !== 'function') return;
  OOPS_N++;
  if (typeof ROLL !== 'undefined' && ROLL) { clearTimeout(ROLL.t); ROLL = null; }
  const detail = `${(err && (err.stack || err.message)) || err}`.slice(0, 1500) + `\nThe Burg v${APP_VERSION} · ${navigator.userAgent}`;
  if (typeof TUT !== 'undefined' && TUT) { TUT = null; hideCoach(); }
  sheet(`<h2>😬 Something went wrong</h2><p>Your life is saved as of last week.</p>
    <p class="muted">Continue picks up from your last save. If this keeps happening, tap Copy details and send them with a note about what you tapped.</p>
    <button class="btn primary" id="ok">Continue</button><button class="btn ghost" id="oopscopy">📋 Copy details</button><div id="oopsout"></div>`);
  $('#sheet').classList.add('oops');
  $('#ok').onclick = () => {
    const i = S && S.slot, g = S && !S.practice && i != null ? readSlot(i) : null;
    if (g) { S = migrate(clone(g)); S.slot = i; useDice(); }
    else if (S && S.practice) S = null;
    closeSheet(); render(); window.scrollTo(0, 0);
    if (S) resumePending();
  };
  $('#oopscopy').onclick = async () => {
    let ok = false; try { await navigator.clipboard.writeText(detail); ok = true; } catch(e){}
    $('#oopsout').innerHTML = ok ? '<p>✅ Copied.</p>' : `<textarea class="code" readonly rows="4" aria-label="Error details">${esc(detail)}</textarea>`;
    announce(ok ? 'Details copied' : 'Details shown, select and copy them');
  };
  announce('Something went wrong. Your life is saved.');
}
window.addEventListener('error', e => {
  if (!e || !e.error || (e.filename && !String(e.filename).startsWith(location.origin))) return;   // only the game's own errors
  try { oops(e.error); } catch(_){}
});
window.addEventListener('unhandledrejection', e => {
  const r = e && e.reason; if (!(r instanceof Error) || ['AbortError', 'NotAllowedError', 'SecurityError'].includes(r.name)) return;
  try { oops(r); } catch(_){}
});
