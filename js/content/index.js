/* =====================================================================
   CURSO v2 — niveles y unidades con lecciones (ver docs/CONTENIDO.md).
   Para agregar una unidad: crea el archivo en js/content/<nivel>/ e impórtalo aquí.
   ===================================================================== */
import routine from './a2/routine.js';
import past from './a2/past.js';
import restaurant from './a2/restaurant.js';
import plans from './a2/plans.js';
import compare from './a2/compare.js';

export const LEVELS = [
  { id: 'A2', name: 'Nivel A2 · Pre-intermedio', units: [routine, past, restaurant, plans, compare] },
];

export const COURSE_UNITS = LEVELS.flatMap(l => l.units);
export const unitById = id => COURSE_UNITS.find(u => u.id === id);
export const lessonKey = (u, l) => `${u.id}:${l.id}`;

/** Prueba de nivel: 5 preguntas por nivel (A1, A2, B1). */
export const PLACEMENT = [
  { lvl: 'A1', q: 'My name ___ Ana.', a: 'is', opts: ['am', 'are'] },
  { lvl: 'A1', q: 'There ___ two cats in the house.', a: 'are', opts: ['is', 'be'] },
  { lvl: 'A1', q: 'I ___ a sister and a brother.', a: 'have', opts: ['has', 'am'] },
  { lvl: 'A1', q: '¿Qué significa «kitchen»?', a: 'cocina', opts: ['cocinar', 'pollo'], es: true },
  { lvl: 'A1', q: 'She ___ from Mexico.', a: 'is', opts: ['are', 'do'] },
  { lvl: 'A2', q: 'Yesterday we ___ to the movies.', a: 'went', opts: ['go', 'goes'] },
  { lvl: 'A2', q: 'Look! It ___.', a: 'is raining', opts: ['rains', 'rain'] },
  { lvl: 'A2', q: "I'd ___ a glass of water, please.", a: 'like', opts: ['want', 'liking'] },
  { lvl: 'A2', q: 'My brother is ___ than me.', a: 'taller', opts: ['more tall', 'tallest'] },
  { lvl: 'A2', q: 'Are you ___ to travel next summer?', a: 'going', opts: ['go', 'will'] },
  { lvl: 'B1', q: 'I have lived here ___ 2019.', a: 'since', opts: ['for', 'from'] },
  { lvl: 'B1', q: 'If it rains tomorrow, we ___ stay at home.', a: 'will', opts: ['would', 'are'] },
  { lvl: 'B1', q: 'She asked me where I ___.', a: 'lived', opts: ['live', 'did live'] },
  { lvl: 'B1', q: 'This book ___ written in 1990.', a: 'was', opts: ['is', 'has'] },
  { lvl: 'B1', q: "I'm not used to ___ up early.", a: 'getting', opts: ['get', 'got'] },
];

/** Interpreta el resultado de la prueba de nivel. */
export function placementResult(correctByLevel){
  const a1 = correctByLevel.A1 >= 4, a2 = correctByLevel.A2 >= 4, b1 = correctByLevel.B1 >= 3;
  if (!a1) return { level: 'A1', skipA1: false, openA2: false,
    msg: 'Te recomiendo empezar por el nivel A1: lo vas a completar rápido y te dará buena base.' };
  if (!a2) return { level: 'A2', skipA1: true, openA2: false,
    msg: 'Dominas lo básico. Empieza el nivel A2 desde la primera unidad. Las palabras del A1 aparecerán de vez en cuando como repaso.' };
  if (!b1) return { level: 'A2+', skipA1: true, openA2: true,
    msg: 'Vas muy bien en A2: todas sus unidades quedan abiertas para que avances en el orden que quieras.' };
  return { level: 'B1', skipA1: true, openA2: true,
    msg: '¡Excelente! Tienes nivel B1. Repasa el A2 a tu ritmo: el nivel B1 llegará pronto a la app.' };
}
