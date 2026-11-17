// Pruebas del curso v2 (A2): integridad del contenido, generador de ejercicios y revisión de oraciones.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, COURSE_UNITS, PLACEMENT, placementResult } from '../js/content/index.js';
import { buildLesson, reviewExercise, blankWord, tilesOf } from '../js/engine/build.js';
import { checkSentence, speechScore, normSentence } from '../js/answers.js';

const dupes = arr => arr.filter((x, i) => arr.indexOf(x) !== i);
const KINDS = ['vocab', 'grammar', 'dialogue', 'reading', 'review'];

test('Curso: ids únicos de unidades', () => {
  assert.deepEqual(dupes(COURSE_UNITS.map(u => u.id)), []);
  assert.ok(LEVELS.every(l => l.units.length));
});

for (const u of COURSE_UNITS){
  test(`Unidad ${u.id}: contenido completo y coherente`, () => {
    for (const k of ['title', 'icon', 'can_do', 'level']) assert.ok(u[k], `falta ${k}`);
    assert.ok(u.words.length >= 8, 'al menos 8 palabras');
    assert.deepEqual(dupes(u.words.map(w => w.en)), [], 'palabras repetidas');
    assert.deepEqual(dupes(u.words.map(w => w.es)), [], 'traducciones repetidas (confunden la opción múltiple)');
    for (const w of u.words){
      assert.ok(w.ex?.[0] && w.ex?.[1], `${w.en}: falta oración de ejemplo`);
      assert.notEqual(blankWord(w.ex[0], w.en), w.ex[0], `${w.en}: la oración de ejemplo no contiene la palabra`);
    }
    const g = u.grammar;
    assert.ok(g.id && g.title && g.explain_es && g.examples.length >= 2, 'gramática incompleta');
    assert.ok(g.drills.length >= 6, 'al menos 6 ejercicios de gramática');
    for (const d of g.drills){
      assert.equal((d.q.match(/___/g) || []).length, 1, `"${d.q}" debe tener un hueco`);
      assert.ok(!d.opts.includes(d.a), `"${d.q}": la respuesta aparece entre los distractores`);
      assert.equal(new Set([d.a, ...d.opts]).size, d.opts.length + 1, `"${d.q}": opciones repetidas`);
      assert.ok(d.es, `"${d.q}": falta traducción`);
    }
    assert.ok(u.sentences.length >= 6 && u.sentences.every(s => s[0] && s[1]), 'oraciones incompletas');
    assert.ok(u.sentences.filter(s => tilesOf(s[0]).length <= 9).length >= 5, 'faltan oraciones cortas para armar y dictar');
    const you = u.dialogue.lines.filter((l, i) => l.who === 'you' && i > 0);
    assert.ok(you.length >= 2, 'el diálogo necesita al menos 2 respuestas tuyas');
    assert.ok(u.dialogue.lines.every(l => l.en && l.es && l.who));
    assert.ok(u.reading.text.length >= 3 && u.reading.questions.length >= 2, 'lectura incompleta');
    for (const q of u.reading.questions) assert.ok(!q.opts.includes(q.a), `"${q.q}": respuesta repetida en opciones`);
    assert.deepEqual(dupes(u.lessons.map(l => l.id)), []);
    for (const l of u.lessons){
      assert.ok(KINDS.includes(l.kind), `${l.id}: tipo ${l.kind}`);
      if (l.kind === 'vocab') assert.ok(l.words.every(i => u.words[i]), `${l.id}: índice de palabra inválido`);
    }
    assert.equal(u.lessons.at(-1).kind, 'review', 'la última lección es el repaso de unidad');
  });

  test(`Unidad ${u.id}: cada lección genera ejercicios válidos`, () => {
    for (const l of u.lessons){
      for (let r = 0; r < 5; r++){ // varias veces: el generador es aleatorio
        const list = buildLesson(u, l);
        const graded = list.filter(e => ['mc', 'type', 'build', 'match', 'speak'].includes(e.type));
        assert.ok(graded.length >= 6, `${l.id}: muy pocos ejercicios (${graded.length})`);
        for (const e of list){
          if (e.type === 'mc'){
            assert.ok(e.options.includes(e.answer), `${l.id}: la respuesta no está entre las opciones`);
            assert.equal(new Set(e.options).size, e.options.length, `${l.id}: opciones repetidas`);
            assert.ok(e.options.length >= 2);
          }
          if (e.type === 'build'){
            const tiles = [...e.tiles];
            for (const t of tilesOf(e.answer)){ const i = tiles.indexOf(t); assert.ok(i >= 0, `${l.id}: falta la ficha "${t}"`); tiles.splice(i, 1); }
            assert.ok(checkSentence(e.answer, tilesOf(e.answer).join(' ')).ok, 'armar con las fichas correctas debe ser válido');
          }
          if (e.key) assert.ok(reviewExercise(e.key), `${e.key}: no se puede repasar`);
        }
      }
    }
  });
}

test('Oraciones: contracciones, mayúsculas, puntuación y errores de dedo', () => {
  assert.equal(normSentence("I'm having breakfast."), 'i am having breakfast');
  assert.equal(checkSentence("I'm having breakfast.", 'i am having breakfast').grade, 3);
  assert.equal(checkSentence("He doesn't like coffee.", 'He does not like coffee').grade, 3);
  assert.equal(checkSentence("I'd like the soup, please.", 'I would like the soup please').grade, 3);
  assert.equal(checkSentence('We went to the beach.', 'we wnet to the beach').grade, 2);
  assert.equal(checkSentence('We went to the beach.', 'we go to the beach').ok, false);
  assert.equal(checkSentence('We went to the beach.', '').ok, false);
});

test('Pronunciación: tolera cifras y marca las palabras que faltan', () => {
  assert.equal(speechScore('I usually wake up at seven.', 'I usually wake up at 7').ratio, 1);
  const r = speechScore("I'd like the soup, please.", 'I like the soup');
  assert.equal(r.ok, false);
  assert.deepEqual(r.marks.filter(m => !m.ok).map(m => m.w), ['would', 'please']);
});

test('Prueba de nivel: 5 preguntas por nivel y resultados coherentes', () => {
  for (const l of ['A1', 'A2', 'B1']) assert.equal(PLACEMENT.filter(p => p.lvl === l).length, 5);
  for (const p of PLACEMENT) assert.ok(!p.opts.includes(p.a), p.q);
  assert.equal(placementResult({ A1: 2, A2: 0, B1: 0 }).skipA1, false);
  assert.deepEqual([placementResult({ A1: 5, A2: 2, B1: 0 }).skipA1, placementResult({ A1: 5, A2: 2, B1: 0 }).openA2], [true, false]);
  assert.equal(placementResult({ A1: 5, A2: 5, B1: 1 }).openA2, true);
  assert.equal(placementResult({ A1: 5, A2: 5, B1: 4 }).level, 'B1');
});
