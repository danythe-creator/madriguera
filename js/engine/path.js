// RUTA DEL CURSO: qué unidades y lecciones están abiertas, cuál sigue y qué toca repasar.
import { S, unitProgress } from '../state.js';
import { UNITS } from '../data/units.js';
import { CFG } from '../data/config.js';
import { COURSE_UNITS, lessonKey } from '../content/index.js';

export const lessonDone = (u, l) => !!S.lessons[lessonKey(u, l)]?.done;
export const unitComplete = u => u.lessons.every(l => lessonDone(u, l));
export const unitDoneCount = u => u.lessons.filter(l => lessonDone(u, l)).length;

/** El A1 cuenta como terminado si casi todas sus unidades tienen suficientes palabras aprendidas. */
export const a1Done = () => UNITS.filter(u => unitProgress(u) >= CFG.unlockUnitAt).length >= UNITS.length - 2;

export function unitOpen(u){
  const i = COURSE_UNITS.indexOf(u);
  if (i === 0) return !!S.placement?.skipA1 || a1Done();
  return !!S.placement?.openA2 || unitComplete(COURSE_UNITS[i - 1]);
}
export function lessonOpen(u, l){
  if (!unitOpen(u)) return false;
  const i = u.lessons.indexOf(l);
  if (l.kind === 'review') return u.lessons.filter(x => x.kind !== 'review').every(x => lessonDone(u, x));
  return i === 0 || lessonDone(u, u.lessons[i - 1]);
}
/** ¿Ya empezó la ruta v2 (A2)? */
export const pathActive = () => !!COURSE_UNITS.length && unitOpen(COURSE_UNITS[0]);

/** Siguiente lección pendiente en orden. */
export function nextLesson(){
  for (const u of COURSE_UNITS) for (const l of u.lessons)
    if (lessonOpen(u, l) && !lessonDone(u, l)) return { u, l };
  return null;
}

/** Claves de tarjetas (palabras, oraciones, gramática…) cuyo repaso ya venció. */
export function dueKeys(){
  const now = Date.now();
  return Object.entries(S.cards).filter(([, c]) => c.seen && c.due <= now).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
}
