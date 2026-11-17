/* =====================================================================
   CARTAS SORPRESA
   Alguien escribe cartas (modo "escribir"), la app las empaca en un enlace
   y la otra persona las recibe al abrirlo. Cada carta aparece cuando se
   cumple su condición. Las cartas viajan dentro del enlace (después de #),
   así que nunca llegan al servidor ni quedan en el código público.

   Carta: { id, from, es, en, when:{t, v}, secret, got, read }
     when.t: now (al abrir) | date (AAAA-MM-DD) | streak | learned | xp | sessions
   ===================================================================== */
import { S, save, learnedCount } from './state.js';
import { dayKey } from './util.js';

export const TRIGGERS = {
  now:      { label: 'En cuanto abra la app', input: null },
  date:     { label: 'En una fecha',          input: 'date' },
  streak:   { label: 'Al llegar a una racha de… días', input: 'number' },
  learned:  { label: 'Al aprender… palabras',  input: 'number' },
  xp:       { label: 'Al llegar a… XP',        input: 'number' },
  sessions: { label: 'Después de… lecciones',  input: 'number' },
};

/** Texto de la condición, con el avance actual. */
export function whenText(w){
  const v = w.v;
  switch (w.t){
    case 'date': {
      const d = new Date(v + 'T12:00');
      return 'el ' + d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    case 'streak':   return `con una racha de ${v} días (vas en ${S.streak})`;
    case 'learned':  return `al aprender ${v} palabras (llevas ${learnedCount()})`;
    case 'xp':       return `al llegar a ${v} XP (tienes ${S.xp})`;
    case 'sessions': return `después de ${v} lecciones (llevas ${S.stats.sessions})`;
    default:         return 'muy pronto';
  }
}

function due(w){
  const v = w.v;
  switch (w.t){
    case 'date':     return !!v && dayKey() >= v;
    case 'streak':   return Math.max(S.streak, S.bestStreak || 0) >= +v;
    case 'learned':  return learnedCount() >= +v;
    case 'xp':       return S.xp >= +v;
    case 'sessions': return S.stats.sessions >= +v;
    default:         return true;
  }
}

/** Entrega las cartas cuya condición ya se cumplió. Devuelve las recién llegadas. */
export function deliverLetters(){
  const arrived = [];
  for (const l of S.letters){
    if (!l.got && due(l.when)){ l.got = Date.now(); l.read = false; arrived.push(l); }
  }
  if (arrived.length) save();
  return arrived;
}
export const unread = () => S.letters.filter(l => l.got && !l.read).sort((a, b) => a.got - b.got);

/* ---------- empaque en enlace ----------
   JSON → UTF-8 → mezcla ligera (para que no se lea a simple vista) → base64url */
const KEY = 'madriguera💌';
function scramble(bytes){
  const k = new TextEncoder().encode(KEY);
  return bytes.map((b, i) => b ^ k[i % k.length]);
}
export function encodeLetters(list){
  const slim = list.map(l => ({ i: l.id, f: l.from, e: l.es, n: l.en || undefined, t: l.when.t, v: l.when.v, s: l.secret ? 1 : undefined }));
  const bytes = scramble(new TextEncoder().encode(JSON.stringify({ v: 1, l: slim })));
  let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeLetters(code){
  code = code.trim().replace(/^.*cartas=/, '').replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(code + '==='.slice((code.length + 3) % 4));
  const bytes = scramble(Uint8Array.from(bin, ch => ch.charCodeAt(0)));
  const o = JSON.parse(new TextDecoder().decode(bytes));
  if (!o || !Array.isArray(o.l)) throw new Error('Código no válido');
  return o.l.map(x => ({ id: String(x.i), from: String(x.f || ''), es: String(x.e || ''), en: x.n ? String(x.n) : '',
    when: { t: TRIGGERS[x.t] ? x.t : 'now', v: x.v ?? '' }, secret: !!x.s }));
}

/** Guarda cartas recibidas. Si una ya existía (mismo id) se actualiza el texto sin perder si ya llegó. */
export function importLetters(code){
  const list = decodeLetters(code);
  let added = 0;
  for (const l of list){
    const old = S.letters.find(x => x.id === l.id);
    if (old) Object.assign(old, { from: l.from, es: l.es, en: l.en, when: l.when, secret: l.secret });
    else { S.letters.push({ ...l, got: null, read: false }); added++; }
  }
  save();
  return { total: list.length, added };
}

export const newId = () => Math.random().toString(36).slice(2, 10);
