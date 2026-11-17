/* =====================================================================
   GENERADOR DE EJERCICIOS: convierte una unidad del curso en lecciones
   de ~5 minutos (10–14 ejercicios) y arma sesiones de repaso.

   Claves de repaso (FSRS), una por cosa que se aprende:
     w:<unidad>:<palabra>   palabra          e:<unidad>:<palabra>  oración de ejemplo de la palabra
     s:<unidad>:<n>         oración          g:<unidad>:<n>        ejercicio de gramática
     d:<unidad>:<n>         línea de diálogo r:<unidad>:<n>        pregunta de lectura
     <unidadA1>:<palabra>   palabra del nivel A1 (formato anterior)
   ===================================================================== */
import { shuffle, pick } from '../util.js';
import { UNITS } from '../data/units.js';
import { COURSE_UNITS, unitById } from '../content/index.js';
import { canListen } from './listen.js';

const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Reemplaza la palabra en la oración por ___ (sin importar mayúsculas). */
export const blankWord = (sentence, word) => sentence.replace(new RegExp(`\\b${escRe(word)}\\b`, 'i'), '___');
/** Palabras de una oración para el banco de palabras (sin puntuación). */
export const tilesOf = s => s.replace(/[.,!?¡¿;:"«»—]/g, ' ').split(/\s+/).filter(Boolean);

/** Opción correcta + distractores distintos, mezclados. */
function choices(answer, pool, n = 3){
  const set = new Set([answer]);
  for (const x of shuffle([...pool])){ if (set.size > n) break; if (x && x !== answer) set.add(x); }
  return shuffle([...set]);
}

/* ---------- palabras ---------- */
const wk = (u, w) => `w:${u.id}:${w.en}`;
const vocab = {
  intro: (u, w) => ({ type: 'intro', word: w }),
  en2es: (u, w) => ({ type: 'mc', key: wk(u, w), skill: 'vocab', q: '¿Qué significa?', big: w.en, sayBtn: w.en,
    options: choices(w.es, u.words.map(x => x.es)), answer: w.es, after: w.ex }),
  es2en: (u, w) => ({ type: 'mc', key: wk(u, w), skill: 'vocab', q: '¿Cómo se dice en inglés?', big: w.es,
    options: choices(w.en, u.words.map(x => x.en)), answer: w.en, after: w.ex, sayAfter: w.en }),
  fill: (u, w) => w.ex?.[0] && blankWord(w.ex[0], w.en) !== w.ex[0] ? ({ type: 'mc', key: wk(u, w), skill: 'vocab', q: 'Completa la oración',
    sent: blankWord(w.ex[0], w.en), sub: w.ex[1], options: choices(w.en, u.words.map(x => x.en)), answer: w.en, after: w.ex }) : null,
  type: (u, w) => ({ type: 'type', mode: 'word', key: wk(u, w), skill: 'write', q: 'Escribe en inglés', big: w.es,
    answer: w.en, alts: w.alt || [], after: w.ex }),
  listen: (u, w) => ({ type: 'mc', key: wk(u, w), skill: 'listen', q: 'Escucha y elige lo que oíste', say: w.en, sayBig: true,
    options: choices(w.en, u.words.map(x => x.en)), answer: w.en, after: w.ex }),
};
const exampleBuild = (u, w) => w.ex?.[1] ? sentence.build(u, w.ex, `e:${u.id}:${w.en}`) : null;

/* ---------- oraciones ---------- */
const sentence = {
  build: (u, s, key) => {
    const answerTiles = tilesOf(s[0]);
    const lower = new Set(answerTiles.map(t => t.toLowerCase()));
    const extra = shuffle(allSentences(u).flatMap(x => tilesOf(x[0])).filter(t => !lower.has(t.toLowerCase()) && t.length > 2));
    const distract = [...new Set(extra.map(t => t.toLowerCase()))].slice(0, answerTiles.length > 6 ? 3 : 2);
    return { type: 'build', key, skill: 'write', q: 'Traduce la oración', es: s[1], answer: s[0], tiles: shuffle([...answerTiles, ...distract]), after: s };
  },
  dictation: (u, s, key) => ({ type: 'type', mode: 'sentence', key, skill: 'listen', q: 'Escucha y escribe', say: s[0], sayBig: true,
    answer: s[0], after: s }),
  meaning: (u, s, key) => ({ type: 'mc', key, skill: 'listen', q: 'Escucha: ¿qué significa?', say: s[0], sayBig: true,
    options: choices(s[1], allSentences(u).map(x => x[1])), answer: s[1], after: s }),
  speak: (u, s, key) => canListen() ? ({ type: 'speak', key, skill: 'speak', text: s[0], es: s[1], after: s }) : null,
};
const allSentences = u => [...u.sentences, ...u.words.map(w => w.ex).filter(Boolean), ...u.dialogue.lines.map(l => [l.en, l.es])];
const sk = (u, i) => `s:${u.id}:${i}`;
const shortSentences = u => u.sentences.map((s, i) => ({ s, i })).filter(x => tilesOf(x.s[0]).length <= 9);

/* ---------- gramática, diálogo, lectura ---------- */
const gap = (u, i) => {
  const d = u.grammar.drills[i];
  return { type: 'mc', key: `g:${u.id}:${i}`, skill: 'grammar', q: 'Elige la opción correcta', sent: d.q, sub: d.es,
    options: shuffle([d.a, ...d.opts]), answer: d.a, after: [d.q.replace('___', d.a), d.es] };
};
const youLines = u => u.dialogue.lines.map((l, i) => ({ l, i })).filter(x => x.l.who === 'you' && x.i > 0);
const reply = (u, i) => {
  const lines = u.dialogue.lines, prev = lines[i - 1], line = lines[i];
  return { type: 'mc', key: `d:${u.id}:${i}`, skill: 'read', q: 'Elige la mejor respuesta', who: prev.who, line: prev.en, sayBtn: prev.en,
    options: choices(line.en, youLines(u).map(x => x.l.en)), answer: line.en, after: [line.en, line.es] };
};
const question = (u, i) => {
  const q = u.reading.questions[i];
  return { type: 'mc', key: `r:${u.id}:${i}`, skill: 'read', q: 'Comprensión de lectura', big: q.q, small: true, sayBtn: q.q,
    options: shuffle([q.a, ...q.opts]), answer: q.a, after: [q.a, ''] };
};

/* ---------- lecciones ---------- */
export function buildLesson(u, l){
  const out = [];
  const add = (...xs) => xs.forEach(x => x && out.push(x));
  if (l.kind === 'vocab'){
    const ws = l.words.map(i => u.words[i]);
    ws.forEach(w => add(vocab.intro(u, w), vocab.en2es(u, w)));
    add({ type: 'match', skill: 'vocab', pairs: ws.map(w => [w.en, w.es]) });
    shuffle([...ws]).slice(0, 2).forEach(w => add(vocab.fill(u, w)));
    add(vocab.es2en(u, pick(ws)), vocab.type(u, pick(ws)), vocab.listen(u, pick(ws)), exampleBuild(u, pick(ws)));
  }
  if (l.kind === 'grammar'){
    add({ type: 'tip', grammar: u.grammar });
    shuffle(u.grammar.drills.map((_, i) => i)).slice(0, 6).forEach(i => add(gap(u, i)));
    const ss = shuffle(shortSentences(u));
    add(sentence.build(u, ss[0].s, sk(u, ss[0].i)), sentence.build(u, ss[1].s, sk(u, ss[1].i)));
    add(sentence.dictation(u, ss[2].s, sk(u, ss[2].i)));
    add(sentence.speak(u, ss[3].s, sk(u, ss[3].i)) || sentence.meaning(u, ss[3].s, sk(u, ss[3].i)));
  }
  if (l.kind === 'dialogue'){
    add({ type: 'dialog', dialogue: u.dialogue });
    youLines(u).forEach(x => add(reply(u, x.i)));
    const you = pick(youLines(u));
    add(sentence.build(u, [you.l.en, you.l.es], `d:${u.id}:${you.i}`));
    const other = pick(u.dialogue.lines.filter(x => x.who !== 'you'));
    add(sentence.meaning(u, [other.en, other.es], `d:${u.id}:${u.dialogue.lines.indexOf(other)}`));
    const sp = pick(youLines(u));
    add(sentence.speak(u, [sp.l.en, sp.l.es], `d:${u.id}:${sp.i}`));
    shuffle(u.grammar.drills.map((_, i) => i)).slice(0, 2).forEach(i => add(gap(u, i)));
  }
  if (l.kind === 'reading'){
    add({ type: 'read', reading: u.reading });
    u.reading.questions.forEach((_, i) => add(question(u, i)));
    const t = shuffle(u.reading.text.map((s, i) => ({ s, i })).filter(x => tilesOf(x.s[0]).length <= 10));
    if (t[0]) add(sentence.build(u, t[0].s, `rs:${u.id}:${t[0].i}`));
    if (t[1]) add(sentence.dictation(u, t[1].s, `rs:${u.id}:${t[1].i}`));
    shuffle([...u.words]).slice(0, 2).forEach(w => add(pick([vocab.es2en, vocab.listen])(u, w)));
  }
  if (l.kind === 'review'){
    shuffle([...u.words]).slice(0, 4).forEach(w => add(pick([vocab.es2en, vocab.fill, vocab.type, vocab.listen])(u, w) || vocab.es2en(u, w)));
    shuffle(u.grammar.drills.map((_, i) => i)).slice(0, 3).forEach(i => add(gap(u, i)));
    const ss = shuffle(shortSentences(u));
    add(sentence.build(u, ss[0].s, sk(u, ss[0].i)), sentence.build(u, ss[1].s, sk(u, ss[1].i)),
        sentence.dictation(u, ss[2].s, sk(u, ss[2].i)), sentence.meaning(u, ss[3].s, sk(u, ss[3].i)));
    add(reply(u, pick(youLines(u)).i));
    add(sentence.speak(u, ss[4].s, sk(u, ss[4].i)));
  }
  return out;
}

/* ---------- repasos ---------- */
const a1Word = key => {
  const [uid, en] = key.split(/:(.+)/);
  const unit = UNITS.find(x => x.id === uid); const w = unit?.words.find(x => x.en === en);
  if (!w) return null;
  const s = w.s.replace('___', w.en);
  const u = { id: uid, words: unit.words.map(x => ({ ...x, ex: [x.s.replace('___', x.en), ''] })) };
  return { u, w: { ...w, ex: [s[0].toUpperCase() + s.slice(1), ''] } };
};

/** Crea un ejercicio de repaso a partir de su clave (o null si ya no existe ese contenido). */
export function reviewExercise(key){
  const parts = key.split(':');
  const kind = parts.length >= 3 ? parts[0] : null, uid = parts[1], rest = parts.slice(2).join(':');
  if (!['w', 'e', 's', 'g', 'd', 'r', 'rs'].includes(kind)){ // palabra A1 ("unidad:palabra")
    const a = a1Word(key); if (!a) return null;
    return (pick([vocab.es2en, vocab.fill, vocab.type, vocab.listen])(a.u, a.w) || vocab.es2en(a.u, a.w));
  }
  const u = unitById(uid);
  if (!u) return null;
  const w = u.words.find(x => x.en === rest);
  switch (kind){
    case 'w': return w ? (pick([vocab.es2en, vocab.fill, vocab.type, vocab.listen])(u, w) || vocab.es2en(u, w)) : null;
    case 'e': return w ? exampleBuild(u, w) : null;
    case 's': { const s = u.sentences[+rest]; return s ? pick([sentence.build, sentence.dictation, sentence.meaning])(u, s, key) : null; }
    case 'g': return u.grammar.drills[+rest] ? gap(u, +rest) : null;
    case 'd': { const l = u.dialogue.lines[+rest]; if (!l) return null;
      return l.who === 'you' && +rest > 0 ? reply(u, +rest) : sentence.meaning(u, [l.en, l.es], key); }
    case 'r': return u.reading.questions[+rest] ? question(u, +rest) : null;
    case 'rs': { const s = u.reading.text[+rest]; return s ? pick([sentence.build, sentence.dictation])(u, s, key) : null; }
  }
  return null;
}

/** Sesión de repaso con lo que ya venció (máximo `n` ejercicios). */
export function buildReview(keys, n = 12){
  const out = [];
  for (const k of keys){ if (out.length >= n) break; const e = reviewExercise(k); if (e) out.push(e); }
  return out;
}
export { COURSE_UNITS };
