// Pruebas de integridad del contenido: evitan errores al agregar palabras, mascotas u objetos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UNITS } from '../js/data/units.js';
import { PETS, GROUPS, reqText } from '../js/data/config.js';
import { DECOR, WALLS, SLOTS } from '../js/data/shop.js';
import { SCENES, YARD_DECOR, PHRASES } from '../js/data/scenes.js';
import { petSVG } from '../js/petsvg.js';

const dupes = arr => arr.filter((x, i) => arr.indexOf(x) !== i);

test('Unidades: ids únicos y campos completos', () => {
  assert.deepEqual(dupes(UNITS.map(u => u.id)), []);
  for (const u of UNITS){
    assert.ok(u.name && u.ico && u.words.length >= 4, `unidad ${u.id}`);
    assert.deepEqual(dupes(u.words.map(w => w.en)), [], `palabras repetidas en ${u.id}`);
    // en una misma unidad, dos palabras con la misma traducción confunden la opción múltiple
    assert.deepEqual(dupes(u.words.map(w => w.es)), [], `traducciones repetidas en ${u.id}`);
  }
});

test('Unidades: cada oración tiene exactamente un hueco ___', () => {
  for (const u of UNITS) for (const w of u.words){
    assert.ok(w.en && w.es, `${u.id}: palabra incompleta`);
    assert.equal((w.s.match(/___/g) || []).length, 1, `${u.id}:${w.en} → "${w.s}"`);
    if (w.alt) assert.ok(Array.isArray(w.alt), `${u.id}:${w.en} alt debe ser lista`);
  }
});

test('Mascotas: ids únicos, grupo válido, requisito válido y dibujo sin errores', () => {
  assert.deepEqual(dupes(PETS.map(p => p.id)), []);
  const groups = GROUPS.map(g => g.id);
  for (const p of PETS){
    assert.ok(groups.includes(p.group), `${p.id}: grupo ${p.group}`);
    assert.ok(Object.keys(p.req).length === 1, `${p.id}: un solo requisito`);
    assert.notEqual(reqText(p), '');
    const svg = petSVG(p);
    assert.match(svg, /^\s*<svg/);
    assert.doesNotMatch(svg, /undefined|NaN/, `${p.id}: dibujo con valores vacíos`);
    assert.ok(PHRASES[p.group], `${p.id}: faltan frases del grupo ${p.group}`);
  }
  assert.ok(PETS.some(p => p.id === 'rat' && p.req.xp === 0), 'la mascota inicial existe');
});

test('Tienda y espacios: ids únicos, zonas y escenarios válidos', () => {
  assert.deepEqual(dupes([...DECOR, ...WALLS, ...YARD_DECOR].map(d => d.id)), []);
  for (const d of DECOR){ assert.ok(SLOTS[d.slot], `${d.id}: zona ${d.slot}`); assert.doesNotMatch(d.html(), /undefined|NaN/); }
  const sceneIds = SCENES.map(s => s.id);
  for (const d of YARD_DECOR){
    assert.ok(sceneIds.includes(d.scene), `${d.id}: escenario ${d.scene}`);
    assert.ok(d.en && d.es && d.box, `${d.id}: datos incompletos`);
    assert.doesNotMatch(d.svg, /undefined|NaN/);
  }
  for (const s of SCENES) for (const night of [true, false]) assert.doesNotMatch(s.svg(night), /undefined|NaN/, `escenario ${s.id}`);
});
