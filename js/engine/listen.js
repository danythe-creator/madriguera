// RECONOCIMIENTO DE VOZ (Chrome en Android). Gratis; necesita internet.
import { S } from '../state.js';

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

/** ¿Se pueden hacer ejercicios de hablar ahora? */
export const canListen = () => !!SR && navigator.onLine !== false && !((S.noSpeakUntil || 0) > Date.now());

let rec = null;
/** Escucha una frase en inglés. cb(err, alternativas[]) — err: 'no-speech', 'not-allowed', 'network', … */
export function listenOnce(cb){
  try {
    stopListening();
    rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 4; rec.continuous = false;
    let done = false;
    rec.onresult = e => { done = true; cb(null, Array.from(e.results[0]).map(a => a.transcript)); };
    rec.onerror = e => { if (!done){ done = true; cb(e.error || 'error', []); } };
    rec.onend = () => { if (!done){ done = true; cb('no-speech', []); } };
    rec.start();
  } catch (e) { cb('error', []); }
}
export function stopListening(){ try { rec?.abort(); } catch (e) {} rec = null; }
