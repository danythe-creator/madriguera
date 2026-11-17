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

/* ---------- oraciones completas (dictado, traducción, pronunciación) ---------- */
const CONTRACTIONS = [
  [/\bwon't\b/g, 'will not'], [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\blet's\b/g, 'let us'],
  [/\b(i)'m\b/g, '$1 am'], [/\b(\w+)'re\b/g, '$1 are'], [/\b(\w+)'ve\b/g, '$1 have'], [/\b(\w+)'ll\b/g, '$1 will'],
  [/\b(\w+)'d\b/g, '$1 would'], [/\b(\w+)n't\b/g, '$1 not'], [/\b(he|she|it|that|what|there|who|where|here)'s\b/g, '$1 is'],
];
/** Normaliza una oración y expande contracciones: "I'm" = "I am", "don't" = "do not". */
export function normSentence(s){
  let t = norm(s).replace(/[«»—–]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t;
}
export const words = s => normSentence(s).split(' ').filter(Boolean);

/** Revisa una oración escrita. Tolera mayúsculas, puntuación, contracciones y errores de dedo por palabra. */
export function checkSentence(target, input, alts = []){
  const got = words(input);
  if (!got.length) return { ok: false, grade: 1, typo: false };
  let best = { ok: false, grade: 1, typo: false };
  for (const t of [target, ...alts]){
    const exp = words(t);
    if (exp.join(' ') === got.join(' ')) return { ok: true, grade: 3, typo: false };
    if (exp.length === got.length && exp.every((w, i) => lev(w, got[i]) <= typoLimit(w.length)))
      best = { ok: true, grade: 2, typo: true };
  }
  return best;
}

/** Compara lo que se escuchó (reconocimiento de voz) con la oración esperada. */
const NUMS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
export function speechScore(target, heard){
  // el reconocedor a veces escribe números con cifras ("7") en lugar de palabras ("seven")
  const exp = words(target), got = words(heard).map(w => /^\d+$/.test(w) && NUMS[+w] ? NUMS[+w] : w);
  const pool = [...got];
  const marks = exp.map(w => {
    const i = pool.findIndex(g => g === w || lev(g, w) <= (w.length >= 6 ? 1 : 0));
    if (i >= 0){ pool.splice(i, 1); return { w, ok: true }; }
    return { w, ok: false };
  });
  const ratio = exp.length ? marks.filter(m => m.ok).length / exp.length : 0;
  return { ratio, marks, ok: ratio >= 0.8 };
}
