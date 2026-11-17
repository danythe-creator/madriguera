// LECCIONES: lista de unidades.
import { $, $$, esc } from '../util.js';
import { unitProgress, unitUnlocked } from '../state.js';
import { UNITS } from '../data/units.js';
import { CFG } from '../data/config.js';
import { register } from '../router.js';
import { startLesson } from './lesson.js';

function renderUnits(){
  $('#units').innerHTML = UNITS.map((u, i) => {
    const p = unitProgress(u), ok = unitUnlocked(i);
    return `<div class="unit ${ok ? '' : 'locked'}">
      <div class="ico">${u.ico}</div>
      <div class="t"><b>${esc(u.name)}</b><small>${ok ? `${p} / ${u.words.length} palabras aprendidas` : `Aprende ${CFG.unlockUnitAt} palabras de la unidad anterior`}</small>
        <div class="bar"><i style="width:${p / u.words.length * 100}%"></i></div></div>
      <button ${ok ? '' : 'disabled'} data-u="${u.id}">${p === u.words.length ? 'Repasar' : 'Estudiar'}</button>
    </div>`;
  }).join('');
  $$('.unit button').forEach(b => b.onclick = () => startLesson(b.dataset.u));
}
register('units', renderUnits);
