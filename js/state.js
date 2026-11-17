/* =====================================================================
   ESTADO + persistencia en localStorage (con try/catch: en modo privado
   o con almacenamiento bloqueado la app sigue funcionando, sin guardar).
   ===================================================================== */
import { UNITS } from './data/units.js';
import { CFG, petDef } from './data/config.js';
import { dayKey, dayKeyOffset } from './util.js';
import { migrateSM2 } from './srs.js';

const KEY = 'madriguera.v2', OLD_KEY = 'madriguera.v1';

const fresh = () => ({
  version: 2,
  xp: 0, seeds: 3, streak: 0, bestStreak: 0, lastGoalDay: null,
  todayXP: 0, todayKey: dayKey(),
  pet: 'rat', fullness: 60, fullTs: Date.now(), unlocked: ['rat', 'mouse'],
  names: {},          // nombres personalizados: id de mascota -> nombre
  owned: ['shelf', 'wheel', 'cream'],              // objetos de la tienda comprados
  decor: { wall: 'shelf', right: 'wheel' },        // zona del cuarto -> objeto
  wallTheme: 'cream',
  petScene: {},       // mascota -> espacio común donde vive (patio por defecto)
  yardScene: 'patio', // último espacio común visitado
  cards: {},          // "unidad:palabra" -> datos FSRS
  stats: { sessions: 0, answers: 0, correct: 0, days: {} },  // days: "AAAA-MM-DD" -> XP
  settings: { rate: 0.9, voice: null, sound: true },
});

export let S = fresh();

export function load(){
  try {
    const raw = localStorage.getItem(KEY);
    if (raw){ S = deepMerge(fresh(), JSON.parse(raw)); return; }
    const old = localStorage.getItem(OLD_KEY);
    if (old){ // migración desde la v1 (SM-2 y fechas en UTC)
      const o = JSON.parse(old);
      S = deepMerge(fresh(), { ...o, cards: {} });
      for (const [k, c] of Object.entries(o.cards || {})) S.cards[k] = migrateSM2(c);
      S.todayKey = dayKey();
      save();
    }
  } catch (e) { /* almacenamiento no disponible */ }
}
export function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
export function resetAll(){ try { localStorage.removeItem(KEY); localStorage.removeItem(OLD_KEY); } catch (e) {} S = fresh(); }
export function exportData(){ return JSON.stringify(S); }
export function importData(json){ const o = JSON.parse(json); if (typeof o !== 'object' || !o.cards) throw new Error('Archivo no válido'); S = deepMerge(fresh(), o); save(); }

function deepMerge(base, over){
  for (const k of Object.keys(over || {})){
    const v = over[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && k !== 'cards')
      base[k] = deepMerge(base[k], v);
    else base[k] = v;
  }
  return base;
}

/* ---------- consultas sobre tarjetas ---------- */
let _all;
export function allCards(){
  return _all || (_all = UNITS.flatMap(u => u.words.map(w => ({ ...w, unit: u.id, key: u.id + ':' + w.en }))));
}
export const cardState = key => S.cards[key] || (S.cards[key] = { seen: false, reps: 0, lapses: 0, due: 0 });
export const isSeen = key => !!S.cards[key]?.seen;
export const isLearned = key => (S.cards[key]?.s || 0) >= 1 && (S.cards[key]?.reps || 0) >= 1;
export const unitProgress = u => u.words.filter(w => isLearned(u.id + ':' + w.en)).length;
export const unitUnlocked = i => i === 0 || unitProgress(UNITS[i - 1]) >= CFG.unlockUnitAt;
export const dueCards = () => { const now = Date.now(); return allCards().filter(c => isSeen(c.key) && S.cards[c.key].due <= now); };
export const level = () => Math.floor(S.xp / 100) + 1;

/** Decaimiento de la panza y cambio de día (fecha local). */
export function tick(){
  const h = (Date.now() - S.fullTs) / 36e5;
  if (h > 0){ S.fullness = Math.max(0, S.fullness - h * CFG.decayPerHour); S.fullTs = Date.now(); }
  const today = dayKey();
  if (S.todayKey !== today){ S.todayKey = today; S.todayXP = 0; }
  if (S.lastGoalDay && S.lastGoalDay !== today && S.lastGoalDay !== dayKeyOffset(-1)) S.streak = 0;
}

/** Suma XP de una sesión y actualiza meta diaria / racha. */
export function addXP(xp){
  tick();
  S.xp += xp; S.todayXP += xp;
  S.stats.days[S.todayKey] = (S.stats.days[S.todayKey] || 0) + xp;
  if (S.todayXP >= CFG.dailyGoal && S.lastGoalDay !== S.todayKey){
    S.streak = (S.lastGoalDay === dayKeyOffset(-1)) ? S.streak + 1 : 1;
    S.lastGoalDay = S.todayKey;
    S.bestStreak = Math.max(S.bestStreak || 0, S.streak);
    return true; // meta cumplida hoy por primera vez
  }
  return false;
}

/* ---------- mascotas y tienda ---------- */
export const petName = id => S.names[id] || petDef(id).name;
export const learnedCount = () => allCards().filter(c => isLearned(c.key)).length;

/** Gasta semillas si alcanzan. Devuelve true si se pudo. */
export function spend(n){
  if (S.seeds < n) return false;
  S.seeds -= n; save(); return true;
}
