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
pruneWeekly();
renderTitle();
whatsNew();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch(e){} });
}
