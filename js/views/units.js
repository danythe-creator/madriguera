// LECCIONES: prueba de nivel, ruta del curso (A2) y unidades de vocabulario A1.
import { $, $$, esc, toast } from '../util.js';
import { S, unitProgress, unitUnlocked } from '../state.js';
import { UNITS } from '../data/units.js';
import { CFG } from '../data/config.js';
import { LEVELS } from '../content/index.js';
import { register } from '../router.js';
import { startLesson } from './lesson.js';
import { unitOpen, lessonOpen, lessonDone, unitDoneCount, nextLesson } from '../engine/path.js';
import { runLesson, runPlacement } from '../engine/runner.js';

const KIND_ICO = { vocab: '🔤', grammar: '🧩', dialogue: '💬', reading: '📖', review: '🏆' };

function placementCard(){
  if (S.placement) return `<div class="pcheck done"><span>🧭</span><div><b>Tu nivel: ${esc(S.placement.level)}</b>
    <small>Prueba de nivel del ${new Date(S.placement.ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</small></div>
    <button class="ghostbtn" id="btnPlacement">Repetir</button></div>`;
  return `<div class="pcheck"><span>🧭</span><div><b>¿Ya sabes algo de inglés?</b><small>Prueba de nivel: 15 preguntas, unos 3 minutos. Te dice dónde empezar.</small></div>
    <button id="btnPlacement">Empezar</button></div>`;
}

function courseHTML(){
  const nx = nextLesson();
  return LEVELS.map(lv => `<h2 class="lvlh">${esc(lv.name)}</h2>` + lv.units.map(u => {
    const open = unitOpen(u), done = unitDoneCount(u), total = u.lessons.length;
    const lessons = u.lessons.map(l => {
      const ok = lessonDone(u, l), can = lessonOpen(u, l), cur = nx && nx.u === u && nx.l === l;
      const best = S.lessons[`${u.id}:${l.id}`]?.best;
      return `<button class="lrow ${ok ? 'ok' : ''} ${cur ? 'cur' : ''}" data-u="${u.id}" data-l="${l.id}" ${can || ok ? '' : 'disabled'}>
        <span class="lk">${ok ? '✓' : can ? KIND_ICO[l.kind] : '🔒'}</span><span class="lt">${esc(l.title)}</span>
        ${best !== undefined ? `<small>${best}%</small>` : cur ? '<small>▶</small>' : ''}</button>`;
    }).join('');
    return `<div class="cunit ${open ? '' : 'locked'}">
      <div class="chead"><div class="ico">${u.icon}</div><div class="t"><b>${esc(u.title)}</b><small>${esc(u.can_do)}</small>
        <div class="bar"><i style="width:${done / total * 100}%"></i></div></div><span class="cnt">${done}/${total}</span></div>
      ${open ? `<div class="lrows">${lessons}</div>` : `<p class="note">🔒 ${COURSE_LOCK(u)}</p>`}
    </div>`;
  }).join('')).join('');
}
const COURSE_LOCK = u => LEVELS[0].units.indexOf(u) === 0
  ? 'Se abre al terminar el nivel A1 o al hacer la prueba de nivel.'
  : 'Termina la unidad anterior para abrirla.';

function a1HTML(){
  return `<h2 class="lvlh">Nivel A1 · Vocabulario básico</h2>` + UNITS.map((u, i) => {
    const p = unitProgress(u), ok = unitUnlocked(i);
    return `<div class="unit ${ok ? '' : 'locked'}">
      <div class="ico">${u.ico}</div>
      <div class="t"><b>${esc(u.name)}</b><small>${ok ? `${p} / ${u.words.length} palabras aprendidas` : `Aprende ${CFG.unlockUnitAt} palabras de la unidad anterior`}</small>
        <div class="bar"><i style="width:${p / u.words.length * 100}%"></i></div></div>
      <button ${ok ? '' : 'disabled'} data-a1="${u.id}">${p === u.words.length ? 'Repasar' : 'Estudiar'}</button>
    </div>`;
  }).join('');
}

function renderUnits(){
  // Si ya pasó el A1 (o la prueba), la ruta A2 va primero; si no, primero el A1.
  const a2First = S.placement?.skipA1 || unitOpen(LEVELS[0].units[0]);
  $('#units').innerHTML = placementCard() + (a2First ? courseHTML() + a1HTML() : a1HTML() + courseHTML());
  $('#btnPlacement').onclick = runPlacement;
  $$('#units .lrow').forEach(b => b.onclick = () => {
    const u = LEVELS.flatMap(l => l.units).find(x => x.id === b.dataset.u), l = u.lessons.find(x => x.id === b.dataset.l);
    if (!lessonOpen(u, l) && !lessonDone(u, l)) return toast('Termina la lección anterior primero.');
    runLesson(u, l);
  });
  $$('#units [data-a1]').forEach(b => b.onclick = () => startLesson(b.dataset.a1));
}
register('units', renderUnits);
