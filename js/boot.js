// The Burg: boot.js (part 8 of 8; scripts load in order and share one global scope)
/* ---------- boot ---------- */
pruneWeekly();
renderTitle();
whatsNew();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch(e){} });
}
