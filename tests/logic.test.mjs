// Pruebas de la lógica: repaso espaciado, revisión de respuestas y cartas sorpresa.
// Ejecutar:  node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schedule, migrateSM2 } from '../js/srs.js';
import { check, isCognate } from '../js/answers.js';
import { S } from '../js/state.js';
import { encodeLetters, decodeLetters, importLetters, deliverLetters } from '../js/letters.js';
import { dayKey, dayKeyOffset, norm, lev } from '../js/util.js';

const DAY = 864e5;

test('FSRS: primer acierto se repasa al día siguiente', () => {
  const now = Date.now(), c = {};
  schedule(c, 3, 0.9, now);
  assert.equal(c.seen, true);
  assert.equal(c.reps, 1);
  assert.equal(Math.round((c.due - now) / DAY), 1);
});

test('FSRS: los intervalos crecen con aciertos y un fallo reinicia', () => {
  let now = Date.now(); const c = {}; const gaps = [];
  for (let i = 0; i < 4; i++){ schedule(c, 3, 0.9, now); gaps.push(c.due - now); now = c.due; }
  for (let i = 1; i < gaps.length; i++) assert.ok(gaps[i] > gaps[i - 1], 'el intervalo debe crecer');
  const sBefore = c.s;
  schedule(c, 1, 0.9, now);
  assert.equal(c.reps, 0);
  assert.equal(c.lapses, 1);
  assert.ok(c.s < sBefore, 'la estabilidad baja tras un fallo');
  assert.ok(c.due - now <= 15 * 60e3, 'tras un fallo vuelve en minutos');
  assert.ok(c.d >= 1 && c.d <= 10);
});

test('FSRS: migración desde SM-2 (v1)', () => {
  const c = migrateSM2({ reps: 2, interval: 3, ease: 2.6, due: Date.now(), seen: true });
  assert.ok(c.s >= 1 && c.d >= 1 && c.d <= 10);
  assert.equal(migrateSM2({ seen: false }).seen, false);
});

test('Respuestas: alternativas, artículos, mayúsculas y puntuación', () => {
  const c = { en: 'thank you', es: 'gracias', alt: ['thanks'] };
  assert.equal(check(c, 'en', 'Thanks!').grade, 3);
  assert.equal(check(c, 'en', '  THANK   you ').grade, 3);
  assert.equal(check({ en: 'apple', es: 'manzana' }, 'en', 'an apple').grade, 3);
  assert.equal(check({ en: 'one', es: 'uno', alt: ['1'] }, 'en', '1').grade, 3);
  assert.equal(check({ en: 'brown', es: 'café (color)' }, 'es', 'café').grade, 3);
});

test('Respuestas: errores de dedo cuentan como acierto difícil, no en palabras cortas', () => {
  assert.deepEqual(check({ en: 'kitchen', es: 'cocina' }, 'en', 'kitchn'), { ok: true, grade: 2, typo: true });
  assert.equal(check({ en: 'cat', es: 'gato' }, 'en', 'cap').ok, false);
  assert.equal(check({ en: 'cat', es: 'gato' }, 'en', '').ok, false);
});

test('Respuestas: palabras casi iguales en ambos idiomas', () => {
  assert.equal(isCognate({ en: 'hamster', es: 'hámster' }), true);
  assert.equal(isCognate({ en: 'kitchen', es: 'cocina' }), false);
});

test('Utilidades: normalizar, distancia y fecha local', () => {
  assert.equal(norm('¡Hólá, Mundo!'), 'hola mundo');
  assert.equal(lev('kitten', 'sitting'), 3);
  assert.match(dayKey(), /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(dayKeyOffset(-1) < dayKey());
});

test('Cartas: el enlace conserva acentos, emojis y saltos de línea', () => {
  const list = [{ id: 'a1', from: 'Dany', es: '¡Ánimo, mi amor! ❤️\nSigue así', en: 'Keep going!', when: { t: 'now', v: '' }, secret: false }];
  const back = decodeLetters('https://x.github.io/madriguera/#cartas=' + encodeLetters(list));
  assert.equal(back[0].es, list[0].es);
  assert.equal(back[0].en, 'Keep going!');
  assert.equal(back[0].from, 'Dany');
  assert.throws(() => decodeLetters('esto-no-es-un-codigo'));
});

test('Cartas: entrega por condición y sin duplicados al reimportar', () => {
  S.letters = []; S.streak = 2; S.bestStreak = 2;
  const code = encodeLetters([
    { id: 'now', from: 'D', es: 'hola', when: { t: 'now' } },
    { id: 'past', from: 'D', es: 'aniversario', when: { t: 'date', v: '2020-02-14' } },
    { id: 'future', from: 'D', es: 'futuro', when: { t: 'date', v: '2999-01-01' } },
    { id: 'streak', from: 'D', es: 'racha', when: { t: 'streak', v: 7 } },
  ]);
  assert.equal(importLetters(code).added, 4);
  assert.deepEqual(deliverLetters().map(l => l.id).sort(), ['now', 'past']);
  assert.equal(importLetters(code).added, 0, 'no se duplican');
  assert.equal(S.letters.length, 4);
  S.streak = 7;
  assert.deepEqual(deliverLetters().map(l => l.id), ['streak']);
});
