// Arranque de la app.
import { $$ } from './util.js';
import { load, tick, save } from './state.js';
import { showView } from './router.js';
import { renderTop } from './views/home.js';
import './views/units.js';
import { checkUnlocks } from './views/collection.js';
import './views/shop.js';
import './views/yard.js';
import './views/settings.js';
import { importFromHash } from './views/letters.js';
import { showNews } from './views/news.js';
import { S } from './state.js';
import { toast } from './util.js';

load(); tick(); save(); checkUnlocks(); renderTop();
importFromHash();
window.addEventListener('hashchange', () => { if (importFromHash()) showView('home'); });
$$('nav button').forEach(b => b.onclick = () => showView(b.dataset.v));
showView('home');

// Pide al navegador que no borre el progreso aunque falte espacio (Chrome lo concede a apps instaladas o usadas a menudo).
try { navigator.storage?.persist?.(); } catch (e) {}

// Novedades (una vez por versión) y recordatorio de respaldo (máximo una vez por semana).
setTimeout(() => {
  if (showNews()) return;
  const week = 7 * 864e5, now = Date.now();
  const stale = !S.lastBackup || now - S.lastBackup > 2 * week;
  const nagged = S.lastBackupNag && now - S.lastBackupNag < week;
  if (S.stats.sessions >= 5 && stale && !nagged){
    S.lastBackupNag = now; save();
    toast('💾 Te recomiendo descargar un respaldo en Progreso.');
  }
}, 1500);

// Al volver a la app (por ejemplo, al día siguiente) se actualiza la casa.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !document.querySelector('#view-home').classList.contains('hidden')) showView('home');
});

// Funciona sin internet e instalable (PWA). Solo en https o localhost.
if ('serviceWorker' in navigator && location.protocol !== 'file:'){
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
