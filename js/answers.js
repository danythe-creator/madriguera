// Revisión de respuestas: alternativas válidas, artículos y errores de dedo.
import { norm, lev } from './util.js';

const stripParens = s => s.replace(/\s*\(.*?\)\s*/g, ' ').trim();
const stripArticle = s => s.replace(/^(the|a|an|to) /, '');

export function accepted(c, field){
  return field === 'en' ? [c.en, ...(c.alt || [])] : [stripParens(c.es), ...(c.altEs || [])];
}

/** Tolerancia de errores de dedo según la longitud de la palabra. */
const typoLimit = len => len >= 8 ? 2 : len >= 4 ? 1 : 0;

/**
 * Revisa una respuesta.
 * Devuelve { ok, grade, typo, expected } donde grade es la calificación FSRS
 * (1 fallo, 2 acierto con error de dedo, 3 acierto).
 */
export function check(c, field, input){
  const v = stripArticle(norm(input));
  const list = accepted(c, field).map(a => stripArticle(norm(a)));
  if (list.includes(v)) return { ok:true, grade:3, typo:false };
  if (v && list.some(a => lev(a, v) <= typoLimit(a.length)))
    return { ok:true, grade:2, typo:true };
  return { ok:false, grade:1, typo:false };
}

/** ¿La palabra se escribe casi igual en ambos idiomas? (hámster, color…) */
export function isCognate(c){
  const a = norm(c.en), b = norm(stripParens(c.es));
  return lev(a, b) <= Math.max(1, Math.floor(a.length / 4));
}
