// NOVEDADES: se muestran una vez cuando cambia la versión (a quien ya usaba la app).
import { $, esc } from '../util.js';
import { S, save } from '../state.js';
import { CHANGELOG, VERSION } from '../data/changelog.js';

/** Muestra las novedades. Sin `force`, solo si hay versión nueva y la persona ya usaba la app. Devuelve true si se mostró. */
export function showNews(force = false){
  const isNew = S.seenVersion !== VERSION;
  if (!force){
    if (!isNew) return false;
    S.seenVersion = VERSION; save();
    if (!S.stats.sessions) return false; // instalación nueva: no hay "novedades" que contar
  }
  const list = force ? CHANGELOG : CHANGELOG.slice(0, 1);
  $('#newsBody').innerHTML = list.map(c => `<h3>${esc(c.title)} <small>v${esc(c.v)}</small></h3>
    <ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('');
  $('#newsModal').hidden = false;
  return true;
}
$('#newsClose').onclick = () => { $('#newsModal').hidden = true; };
