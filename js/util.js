// Utilidades generales.
export const $ = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);
export const shuffle = a => { for (let i = a.length - 1; i > 0; i--){ const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = a => a[Math.random() * a.length | 0];

const ESC = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
export const esc = s => String(s).replace(/[&<>"']/g, ch => ESC[ch]);

/** Normaliza para comparar: minúsculas, sin acentos, sin puntuación, espacios simples. */
export const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[’`]/g, "'").replace(/[.,!?¡¿;:"]/g, '').replace(/\s+/g, ' ').trim();

/** Distancia de edición (Levenshtein). */
export function lev(a, b){
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++){
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/** Fecha LOCAL del dispositivo como "AAAA-MM-DD" (no UTC). */
export function dayKey(d = new Date()){
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function dayKeyOffset(days){ const d = new Date(); d.setDate(d.getDate() + days); return dayKey(d); }

let toastT;
export function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
