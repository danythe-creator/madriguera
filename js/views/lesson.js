/* =====================================================================
   LECCIÓN: cola de tarjetas, tipos de ejercicio y retroalimentación.
   ===================================================================== */
import { $, $$, shuffle, pick, esc, toast } from '../util.js';
import { S, save, tick, allCards, cardState, isSeen, dueCards, unitUnlocked, addXP, petName } from '../state.js';
import { UNITS } from '../data/units.js';
import { CFG, petDef } from '../data/config.js';
import { petSVG } from '../petsvg.js';
import { speak } from '../speech.js';
import { schedule } from '../srs.js';
import { check, isCognate } from '../answers.js';
import { showView } from '../router.js';
import { renderTop } from './home.js';
import { checkUnlocks } from './collection.js';
import { checkLetters } from './letters.js';

let L = null; // sesión actual

const fullSent = c => { const s = c.s.replace('___', c.en); return s[0].toUpperCase() + s.slice(1); };

export function startLesson(unitId){
  tick();
  const all = allCards(), queue = [];
  const unseenOf = id => all.filter(c => c.unit === id && !isSeen(c.key));
  queue.push(...shuffle(dueCards()).slice(0, CFG.sessionSize - CFG.newPerSession));
  // palabras nuevas: de la unidad elegida, o de la primera desbloqueada que tenga palabras sin ver
  let pool = unitId ? unseenOf(unitId) : [];
  if (!pool.length) for (let i = 0; i < UNITS.length; i++){
    if (!unitUnlocked(i)) continue;
    pool = unseenOf(UNITS[i].id); if (pool.length) break;
  }
  // si hay pocos repasos pendientes se permiten algunas palabras nuevas más
  const nNew = Math.min(CFG.sessionSize - queue.length, queue.length >= 3 ? CFG.newPerSession : CFG.newPerSession + 2);
  queue.push(...pool.slice(0, nNew));
  if (queue.length < 4){ // práctica libre con lo ya visto si no hay nada pendiente
    const seen = shuffle(all.filter(c => isSeen(c.key) && !queue.includes(c) && (!unitId || c.unit === unitId)));
    queue.push(...seen.slice(0, CFG.sessionSize - queue.length));
  }
  if (!queue.length) return toast('No hay nada que estudiar todavía.');
  L = { queue, i: 0, total: queue.length, correct: 0, wrong: 0, xp: 0, seeds: 0, answered: new Set(), retry: [] };
  showView('lesson'); nextEx();
}

/** El tipo de ejercicio depende de cuánto conoce la palabra. */
function exType(c){
  const st = S.cards[c.key], r = st?.reps || 0, cog = isCognate(c);
  if (!st?.seen || r === 0) return cog ? 'fill' : 'en2es';
  if (r === 1) return cog ? 'fill' : pick(['es2en', 'fill']);
  return pick(cog ? ['fill', 'listen', 'type'] : ['fill', 'listen', 'type', 'es2en']);
}

/** Opciones: la correcta + 3 distractores distintos, de preferencia de la misma unidad. */
function options(c, field){
  const seenVals = new Set([c[field]]), d = [];
  const pools = [allCards().filter(x => x.unit === c.unit), allCards()];
  for (const pool of pools) for (const x of shuffle([...pool])){
    if (d.length >= 3) break;
    if (!seenVals.has(x[field])){ seenVals.add(x[field]); d.push(x[field]); }
  }
  return shuffle([c[field], ...d]);
}

function nextEx(){
  $('#fb').classList.remove('show', 'ok', 'bad');
  if (L.i >= L.queue.length) return finish(false);
  const c = L.queue[L.i], t = exType(c), ex = $('#ex');
  const field = t === 'en2es' ? 'es' : 'en';
  L.cur = { c, t, field, done: false };
  $('#lprog').style.width = (L.i / L.queue.length * 100) + '%';
  $('#lcount').textContent = `${L.i + 1}/${L.queue.length}`;
  const isNew = !isSeen(c.key), p = petDef(S.pet);
  const hint = `<div class="pethint">${petSVG(p)}<span>${isNew ? `Palabra nueva: ${esc(petName(p.id))} la está aprendiendo contigo.` : 'Repaso'}</span></div>`;
  const list = t === 'type' ? [] : options(c, field); L.cur.list = list;
  const opts = `<div class="opts">${list.map((o, i) => `<button class="opt" data-i="${i}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('')}</div>`;
  const spk = `<button class="spk" data-say="${esc(c.en)}" aria-label="Escuchar">🔊</button><button class="spk turtle" data-slow="${esc(c.en)}" aria-label="Escuchar lento">🐢</button>`;
  const html = {
    en2es: `<div class="q">¿Qué significa?</div><div class="big">${esc(c.en)}${spk}</div>${opts}`,
    es2en: `<div class="q">¿Cómo se dice en inglés?</div><div class="big">${esc(c.es)}</div>${opts}`,
    fill:  `<div class="q">Completa la oración</div><div class="sent">${esc(c.s).replace('___', '<u>&nbsp;</u>')}</div><p class="tr">${esc(c.es)}</p>${opts}`,
    listen:`<div class="q">Escucha y elige lo que oíste</div><button class="spk xl" data-say="${esc(c.en)}" aria-label="Escuchar">🔊</button><button class="slow" data-slow="${esc(c.en)}">🐢 Escuchar más lento</button>${opts}`,
    type:  `<div class="q">Escribe en inglés</div><div class="big">${esc(c.es)}</div><input class="inp" id="inp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="…"><button class="check" id="btnCheck">Comprobar</button>`,
  }[t];
  ex.innerHTML = html + hint;
  ex.querySelectorAll('.spk').forEach(b => b.onclick = () => speak(b.dataset.say));
  ex.querySelectorAll('[data-slow]').forEach(b => b.onclick = () => speak(b.dataset.slow, 0.55));
  ex.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(list[+b.dataset.i], b));
  if (t === 'listen') setTimeout(() => speak(c.en), 300);
  if (t === 'type'){
    const i = $('#inp'); i.focus();
    $('#btnCheck').onclick = () => i.value.trim() && answer(i.value);
    i.onkeydown = e => { if (e.key === 'Enter' && i.value.trim()){ e.stopPropagation(); answer(i.value); } };
  }
}

function answer(v, btn){
  const cur = L.cur; if (cur.done) return; cur.done = true; cur.answer = String(v ?? '');
  const { c, t, field } = cur;
  const res = check(c, field, v);
  const first = !L.answered.has(c.key);
  if (first){
    L.answered.add(c.key);
    schedule(cardState(c.key), res.grade, CFG.retention);
    S.stats.answers++; if (res.ok) S.stats.correct++;
  }
  $$('.opt').forEach(b => { b.disabled = true; if (cur.list[+b.dataset.i] === c[field]) b.classList.add('ok'); });
  if (btn && !res.ok) btn.classList.add('bad');
  const inp = $('#inp');
  if (inp){ inp.disabled = true; inp.style.borderColor = res.ok ? 'var(--ok)' : 'var(--bad)'; $('#btnCheck').disabled = true; }
  const fb = $('#fb'); fb.classList.add('show', res.ok ? 'ok' : 'bad');
  const sent = `<i>${esc(fullSent(c))}</i>`;
  if (res.ok){
    if (first){ L.correct++; L.xp += CFG.xpCorrect; L.seeds += CFG.seedCorrect; }
    $('#fbTitle').textContent = res.typo ? '¡Casi perfecto!' : pick(['¡Squeak!', '¡Exacto!', '¡Muy bien!', '¡Eso es!']);
    $('#fbText').innerHTML = (res.typo ? `Ojo con la ortografía: <b class="w">${esc(c[field])}</b><br>` : `<b class="w">${esc(c.en)}</b> = ${esc(c.es)} · `) + sent;
  } else {
    if (first){ L.wrong++; L.retry.push(c); }
    $('#fbTitle').textContent = 'Casi…';
    $('#fbText').innerHTML = `La respuesta era <b class="w">${esc(c[field])}</b> · ${sent}`;
  }
  // Audio en la hoja de respuesta: palabra, palabra lenta y oración completa.
  const fa = $('#fbAudio'), sentence = fullSent(c);
  fa.innerHTML = `<button data-say="${esc(c.en)}">🔊 ${esc(c.en)}</button><button data-say="${esc(c.en)}" data-rate="0.55">🐢 Lento</button><button data-say="${esc(sentence)}" data-rate="0.8">💬 Oración</button>`;
  fa.querySelectorAll('button').forEach(b => b.onclick = () => speak(b.dataset.say, b.dataset.rate ? +b.dataset.rate : undefined));
  $('#btnReport').textContent = '⚑ Reportar un error'; $('#btnReport').disabled = false;
  if (t !== 'en2es') speak(c.en);
  save();
  setTimeout(() => $('#btnNext').focus(), 50);
}

$('#btnNext').onclick = () => {
  L.i++;
  if (L.i >= L.queue.length && L.retry.length){ L.queue.push(...L.retry); L.retry = []; } // los errores vuelven al final
  nextEx();
};
$('#btnQuit').onclick = () => { if (L && L.answered.size > 0) finish(true); else { L = null; showView('home'); } };

// Atajos de teclado (útiles en computadora): 1-4 para elegir, Enter para continuar, Esc para salir.
document.addEventListener('keydown', e => {
  if (!L || $('#view-lesson').classList.contains('hidden')) return;
  if (e.key === 'Escape') return $('#btnQuit').onclick();
  if ($('#fb').classList.contains('show')){ if (e.key === 'Enter'){ e.preventDefault(); $('#btnNext').onclick(); } return; }
  const n = +e.key; if (n >= 1 && n <= 4){ const b = $$('.opt')[n - 1]; if (b) b.click(); }
});

function finish(early){
  $('#fb').classList.remove('show');
  const perfect = !early && L.wrong === 0 && L.total > 0;
  const bonus = perfect ? CFG.perfectBonus : 0;
  S.seeds += L.seeds + bonus; S.stats.sessions++;
  const goalHit = addXP(L.xp);
  if (goalHit) S.seeds += CFG.goalBonus;
  save(); checkUnlocks(); renderTop();
  const letters = checkLetters();
  const p = petDef(S.pet);
  $('#lprog').style.width = '100%'; $('#lcount').textContent = '';
  $('#ex').innerHTML = `<div class="done">
    <div class="pet-big" data-state="happy">${petSVG(p)}</div>
    <h2>${early ? 'Sesión guardada' : perfect ? '¡Sesión perfecta!' : '¡Sesión terminada!'}</h2>
    <p class="sub">${esc(petName(p.id))} ${perfect ? 'está dando saltos.' : 'aprendió contigo.'}</p>
    <div class="rew"><div><b>+${L.xp}</b>XP</div><div><b>+${L.seeds + bonus}</b>🌰 semillas</div><div><b>${L.correct}/${L.correct + L.wrong}</b>aciertos</div></div>
    ${perfect ? `<p class="bonus">Bono por sesión perfecta: +${CFG.perfectBonus} 🌰</p>` : ''}
    ${letters.length ? `<p class="bonus">💌 ¡Llegó una carta! Búscala en la casa.</p>` : ''}
    ${goalHit ? `<p class="bonus">🔥 ¡Meta del día cumplida! +${CFG.goalBonus} 🌰 · Racha: ${S.streak} día${S.streak > 1 ? 's' : ''}</p>` : ''}
    <button class="cta" id="btnHome">Volver a la madriguera</button>
    <button class="cta warm" id="btnAgain">Otra ronda</button>
  </div>`;
  $('#btnHome').onclick = () => showView('home');
  $('#btnAgain').onclick = () => startLesson();
  L = null;
}

// Reportar un error en el ejercicio actual (se guarda y se exporta desde Progreso).
$('#btnReport').onclick = () => {
  const cur = L?.cur; if (!cur) return;
  const note = prompt('¿Qué está mal? (opcional: por ejemplo "la traducción no es correcta")', '');
  if (note === null) return;
  S.reports.push({ ts: new Date().toISOString(), key: cur.c.key, type: cur.t, expected: cur.c[cur.field],
    answer: cur.answer, sentence: cur.c.s, note: note.trim().slice(0, 300) });
  save();
  $('#btnReport').textContent = '✓ Reporte guardado. ¡Gracias!'; $('#btnReport').disabled = true;
};
