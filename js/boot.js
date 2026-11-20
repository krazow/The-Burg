// The Burg: boot.js (part 8 of 8; scripts load in order and share one global scope)
/* ---------- boot ---------- */
applyPrefs();                    // i2-a03: text size and theme are on <html> before anything draws
// i2-a30: keep the browser's install offer for the right moment (a card on Home), instead of its own pop-up
let INSTALL_EVT = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); INSTALL_EVT = e;
  if (S && tab === 'home' && $('#modal').classList.contains('hidden') && $('#main')) renderHome();
});
window.addEventListener('appinstalled', () => { INSTALL_EVT = null; setPref('installed', true); if (S && tab === 'home' && $('#main')) renderHome(); });
// i57-a10: no inline handlers (the page's content security policy forbids them). Buttons drawn as HTML strings
// name a game function in data-call (and its argument in data-arg); pins drawn as SVG also answer Enter and Space.
const CALLS = { MAPTAP: k => MAPTAP(k), MAPTAB: k => MAPTAB(k), MAPPREF: v => MAPPREF(v === '1'), TRIPTO: k => TRIPTO(k), MAPFOCUS: f => MAPFOCUS(f),
  BIZTAP: id => BIZTAP(id), outSheet: () => outSheet(), teaserSheet: id => teaserSheet(id), retireSheet: () => retireSheet(),
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
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch(e){} });
}
