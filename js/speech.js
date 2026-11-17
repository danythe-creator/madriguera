// Voz: síntesis del navegador (Web Speech API). Gratis y sin internet si el sistema tiene voces instaladas.
import { S } from './state.js';

const hasTTS = () => 'speechSynthesis' in window;

export function englishVoices(){
  if (!hasTTS()) return [];
  return speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang))
    .sort((a, b) => score(b) - score(a));
}
// Preferimos voces de mejor calidad (las "Natural"/"Neural"/Google suelen sonar mejor) y en-US.
const score = v => (/natural|neural|online/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (/en[-_]US/i.test(v.lang) ? 1 : 0);

let last = { text: '', at: 0, slow: false };
export function speak(text, rate){
  try {
    if (!hasTTS()) return;
    // Repetir la misma frase en menos de 4 s la dice más lento (y alterna).
    const now = Date.now();
    if (!rate && text === last.text && now - last.at < 4000 && !last.slow){ rate = 0.55; last.slow = true; }
    else last.slow = !!rate && rate < 0.7;
    last.text = text; last.at = now;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || S.settings.rate || 0.9;
    const voices = englishVoices();
    const v = voices.find(v => v.voiceURI === S.settings.voice) || voices[0];
    if (v){ u.voice = v; u.lang = v.lang; }
    speechSynthesis.speak(u);
  } catch (e) {}
}
try { speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); } catch (e) {}
