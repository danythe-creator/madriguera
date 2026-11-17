// Arranque de la app.
import { $$ } from './util.js';
import { load, tick, save } from './state.js';
import { showView } from './router.js';
import { renderTop } from './views/home.js';
import './views/units.js';
import { checkUnlocks } from './views/collection.js';
import './views/shop.js';
import './views/settings.js';

load(); tick(); save(); checkUnlocks(); renderTop();
$$('nav button').forEach(b => b.onclick = () => showView(b.dataset.v));
showView('home');

// Al volver a la app (por ejemplo, al día siguiente) se actualiza la casa.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !document.querySelector('#view-home').classList.contains('hidden')) showView('home');
});

// Funciona sin internet e instalable (PWA). Solo en https o localhost.
if ('serviceWorker' in navigator && location.protocol !== 'file:'){
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
