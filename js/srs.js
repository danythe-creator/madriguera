/* =====================================================================
   Repetición espaciada con FSRS (Free Spaced Repetition Scheduler, v4.5),
   el mismo modelo que usa Anki. Cada tarjeta guarda:
     s  estabilidad (días hasta que la probabilidad de recordar baja a 90 %)
     d  dificultad (1 = fácil … 10 = difícil)
     last  momento del último repaso (ms)
     due   momento del próximo repaso (ms)
   Calificaciones: 1 = otra vez (fallo), 2 = difícil, 3 = bien, 4 = fácil.
   ===================================================================== */
const W = [0.4872,1.4003,3.7145,13.8206,5.1618,1.2298,0.8975,0.031,1.6474,0.1367,1.0461,2.1072,0.0793,0.3246,1.587,0.2272,2.8755];
const DECAY = -0.5, FACTOR = 19/81, DAY = 864e5;
const clamp = (x,a,b) => Math.min(b, Math.max(a, x));

export const retrievability = (elapsedDays, s) => Math.pow(1 + FACTOR * elapsedDays / s, DECAY);
const interval = (s, r) => Math.max(1, Math.round(s / FACTOR * (Math.pow(r, 1/DECAY) - 1)));
const initD = g => clamp(W[4] - (g - 3) * W[5], 1, 10);

/** Aplica un repaso a la tarjeta `c` (se modifica en el sitio). */
export function schedule(c, grade, retention = 0.9, now = Date.now()){
  c.seen = true; c.lapses = c.lapses || 0;
  if (!c.s){ // primer repaso
    c.s = W[grade - 1];
    c.d = initD(grade);
  } else {
    const elapsed = Math.max(0, (now - (c.last || now)) / DAY);
    const r = retrievability(elapsed, c.s);
    // dificultad: se mueve según la calificación y regresa un poco a la media
    const d = c.d - W[6] * (grade - 3);
    c.d = clamp(W[7] * initD(4) + (1 - W[7]) * d, 1, 10);
    if (grade === 1){
      c.lapses++;
      c.s = Math.min(c.s, W[11] * Math.pow(c.d, -W[12]) * (Math.pow(c.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
    } else if (elapsed < 0.5){
      // repaso el mismo día: crecimiento pequeño para no inflar la estabilidad
      c.s = c.s * (grade === 2 ? 1 : grade === 3 ? 1.2 : 1.5);
    } else {
      const hard = grade === 2 ? W[15] : 1, easy = grade === 4 ? W[16] : 1;
      c.s = c.s * (1 + Math.exp(W[8]) * (11 - c.d) * Math.pow(c.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
    }
  }
  c.reps = grade === 1 ? 0 : (c.reps || 0) + 1;   // aciertos seguidos (para elegir tipo de ejercicio)
  c.last = now;
  let days = interval(c.s, retention);
  if (c.reps === 1 && grade < 4) days = 1;   // paso de aprendizaje: una palabra recién aprendida se repasa al día siguiente
  c.due = grade === 1 ? now + 10 * 60e3 : now + days * DAY;
  return c;
}

/** Convierte una tarjeta del formato SM-2 de la v1 a FSRS. */
export function migrateSM2(old){
  if (!old || old.s !== undefined) return old;
  const c = { seen: !!old.seen, reps: old.reps || 0, lapses: 0, due: old.due || 0, last: null };
  if (old.seen){
    c.s = Math.max(0.5, old.interval || 0.5);
    c.d = clamp(5 + (2.5 - (old.ease || 2.5)) * 5, 1, 10);
    c.last = (old.due || Date.now()) - (old.interval || 0) * DAY;
  }
  return c;
}
