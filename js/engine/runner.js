/* =====================================================================
   REPRODUCTOR DE LECCIONES v2: presenta cada ejercicio, revisa, da
   retroalimentación, programa el repaso (FSRS) y cierra la sesión.
   Tipos: intro · tip · dialog · read · mc · type · build · match · speak
   Modos: lesson (lección del curso) · review (repaso) · placement (prueba de nivel)
   ===================================================================== */
import { $, $$, esc, shuffle, pick, toast } from '../util.js';
import { S, save, cardState, addXP, petName } from '../state.js';
import { CFG, petDef } from '../data/config.js';
import { petSVG } from '../petsvg.js';
import { speak } from '../speech.js';
import { schedule } from '../srs.js';
import { check, checkSentence, speechScore } from '../answers.js';
import { showView } from '../router.js';
import { lessonKey, PLACEMENT, placementResult } from '../content/index.js';
import { listenOnce, stopListening } from './listen.js';
import { UNITS } from '../data/units.js';
import { buildLesson, buildReview } from './build.js';
import { dueKeys, nextLesson } from './path.js';
import { renderTop } from '../views/home.js';
import { checkUnlocks } from '../views/collection.js';
import { checkLetters } from '../views/letters.js';

let R = null; // sesión actual
const GRADED = new Set(['mc', 'type', 'build', 'match', 'speak']);
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/\n\n/g, '</p><p>');
const spk = (text, big = false) => `<button class="spk ${big ? 'xl' : ''}" data-say="${esc(text)}" aria-label="Escuchar">🔊</button>` +
  `<button class="spk turtle" data-say="${esc(text)}" data-rate="0.55" aria-label="Escuchar lento">🐢</button>`;
const sentHTML = s => esc(s).replace('___', '<u>&nbsp;</u>');

/* ---------- iniciar ---------- */
function start(list, meta){
  if (!list.length) return toast('No hay nada que practicar por ahora. ✨');
  stopListening();
  R = { list, i: 0, meta, total: list.filter(e => GRADED.has(e.type)).length, correct: 0, wrong: 0, xp: 0, seeds: 0,
        answered: new Set(), retried: new Set(), byLevel: { A1: 0, A2: 0, B1: 0 } };
  bindUI();
  showView('lesson');
  render();
}

/** Lección del curso (+ hasta 3 repasos vencidos al final). */
export function runLesson(u, l){
  const list = buildLesson(u, l);
  if (l.kind !== 'review') list.push(...buildReview(dueKeys().filter(k => !list.some(e => e.key === k)), 3));
  start(list, { mode: 'lesson', u, l });
}
/** Repaso de lo que ya venció. */
export function runReview(){ start(buildReview(dueKeys(), 12), { mode: 'review' }); }
/** Prueba de nivel. */
export function runPlacement(){
  start(PLACEMENT.map(p => ({ type: 'mc', skill: 'placement', lvl: p.lvl, q: `Prueba de nivel`, sent: p.es ? null : p.q, big: p.es ? p.q : null,
    small: !!p.es, options: shuffle([p.a, ...p.opts]), answer: p.a })), { mode: 'placement' });
}

/* ---------- controles compartidos con la vista de lección ---------- */
function bindUI(){
  $('#btnNext').onclick = next;
  $('#btnQuit').onclick = () => { stopListening(); if (R && R.answered.size && R.meta.mode !== 'placement') finish(true); else { R = null; showView('home'); } };
  $('#btnReport').onclick = report;
}
document.addEventListener('keydown', e => {
  if (!R || $('#view-lesson').classList.contains('hidden') || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'Escape') return $('#btnQuit').onclick();
  if ($('#fb').classList.contains('show')){ if (e.key === 'Enter'){ e.preventDefault(); next(); } return; }
  if (e.key === 'Enter'){ const c = $('#ex .cta, #btnCheck:not(:disabled)'); if (c){ e.preventDefault(); c.click(); } return; }
  const n = +e.key; if (n >= 1 && n <= 4){ const b = $$('#ex .opt')[n - 1]; if (b && !b.disabled) b.click(); }
});

/* ---------- presentar ---------- */
function render(){
  $('#fb').classList.remove('show', 'ok', 'bad');
  if (R.i >= R.list.length) return finish(false);
  const ex = R.list[R.i]; R.cur = { ex, done: false };
  const doneGraded = R.list.slice(0, R.i).filter(e => GRADED.has(e.type)).length;
  $('#lprog').style.width = Math.min(100, doneGraded / Math.max(1, R.total) * 100) + '%';
  $('#lcount').textContent = R.meta.mode === 'placement' ? `${R.i + 1}/${R.list.length}` : '';
  const box = $('#ex');
  box.innerHTML = (RENDER[ex.type] || RENDER.mc)(ex);
  box.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say, b.dataset.rate ? +b.dataset.rate : undefined));
  AFTER[ex.type]?.(ex, box);
  if (ex.say) setTimeout(() => speak(ex.say), 350);
  box.scrollTop = 0;
}

const pethint = () => {
  const p = petDef(S.pet);
  return `<div class="pethint">${petSVG(p)}<span>${esc(petName(p.id))} ${pick(['te echa porras.', 'está aprendiendo contigo.', 'confía en ti.', 'mueve los bigotes.'])}</span></div>`;
};
const optsHTML = ex => `<div class="opts">${ex.options.map((o, i) => `<button class="opt" data-i="${i}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('')}</div>`;

const RENDER = {
  intro: ({ word: w }) => `<div class="q">Palabra nueva</div>
    <div class="card intro"><div class="big">${esc(w.en)}</div><div class="spkrow">${spk(w.en)}</div>
    <p class="es">${esc(w.es)}</p>
    ${w.ex ? `<div class="example"><p>${esc(w.ex[0])} ${spk(w.ex[0])}</p><small>${esc(w.ex[1])}</small></div>` : ''}
    ${w.alt?.length ? `<p class="note">También: ${w.alt.map(esc).join(', ')}</p>` : ''}</div>
    <button class="cta">Continuar</button>`,
  tip: ({ grammar: g }) => `<div class="q">Gramática</div>
    <div class="card tip"><h2>${esc(g.title)}</h2><p>${md(g.explain_es)}</p>
    <div class="examples">${g.examples.map(([en, es]) => `<div class="exrow"><p>${esc(en)} ${spk(en)}</p><small>${esc(es)}</small></div>`).join('')}</div>
    ${g.pitfall_es ? `<div class="pitfall">⚠️ <b>Ojo:</b> ${md(g.pitfall_es)}</div>` : ''}</div>
    <button class="cta">¡Entendido!</button>`,
  dialog: ({ dialogue: d }) => `<div class="q">Diálogo · escucha y lee</div>
    <div class="card dialog"><h2>${esc(d.title)}</h2>${d.lines.map(l => `<div class="dline ${l.who === 'you' ? 'you' : ''}">
      <b>${l.who === 'you' ? 'Tú' : esc(l.who)}</b><p>${esc(l.en)} ${spk(l.en)}</p><small class="tr hidden">${esc(l.es)}</small></div>`).join('')}
    <button class="ltr" data-toggle>Ver traducción</button></div>
    <button class="cta">Continuar</button>`,
  read: ({ reading: r }) => `<div class="q">Lectura</div>
    <div class="card reading"><h2>${esc(r.title)}</h2>${r.text.map(([en, es]) => `<p class="rs"><span>${esc(en)}</span> ${spk(en)}<small class="tr hidden">${esc(es)}</small></p>`).join('')}
    <button class="ltr" data-toggle>Ver traducción</button></div>
    <p class="note">Toca una oración para ver su traducción.</p>
    <button class="cta">Contestar preguntas</button>`,
  mc: ex => `<div class="q">${esc(ex.q)}</div>
    ${ex.line ? `<div class="card bubble2"><b>${esc(ex.who)}:</b> ${esc(ex.line)} ${spk(ex.line)}</div>` : ''}
    ${ex.big ? `<div class="big ${ex.small ? 'smallq' : ''}">${esc(ex.big)}${ex.sayBtn ? spk(ex.sayBtn) : ''}</div>` : ''}
    ${ex.sent ? `<div class="sent">${sentHTML(ex.sent)}</div>` : ''}${ex.sub ? `<p class="tr">${esc(ex.sub)}</p>` : ''}
    ${ex.sayBig ? `<div class="bigspk">${spk(ex.say, true)}</div>` : ''}
    ${optsHTML(ex)}${R.meta.mode === 'placement' ? '' : pethint()}`,
  type: ex => `<div class="q">${esc(ex.q)}</div>
    ${ex.big ? `<div class="big">${esc(ex.big)}</div>` : ''}${ex.sayBig ? `<div class="bigspk">${spk(ex.say, true)}</div>` : ''}
    <${ex.mode === 'sentence' ? 'textarea rows="2"' : 'input'} class="inp" id="inp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${ex.mode === 'sentence' ? 'Escribe lo que escuchas…' : '…'}">${ex.mode === 'sentence' ? '</textarea>' : ''}
    <button class="check" id="btnCheck">Comprobar</button>${pethint()}`,
  build: ex => `<div class="q">${esc(ex.q)}</div><div class="sent es">${esc(ex.es)}</div>
    <div class="bline" id="bline"></div>
    <div class="bank" id="bank">${ex.tiles.map((t, i) => `<button class="tile" data-i="${i}">${esc(t)}</button>`).join('')}</div>
    <button class="check" id="btnCheck" disabled>Comprobar</button>`,
  match: ex => {
    const L = shuffle(ex.pairs.map((p, i) => ({ t: p[0], i }))), Rr = shuffle(ex.pairs.map((p, i) => ({ t: p[1], i })));
    return `<div class="q">Une las parejas</div><div class="match">
      <div class="col">${L.map(x => `<button class="tile m" data-side="en" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
      <div class="col">${Rr.map(x => `<button class="tile m" data-side="es" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div></div>${pethint()}`;
  },
  speak: ex => `<div class="q">Di en voz alta</div>
    <div class="sent">${esc(ex.text)}</div><div class="spkrow">${spk(ex.text)}</div><p class="tr">${esc(ex.es)}</p>
    <button class="mic" id="mic" aria-label="Hablar">🎤</button><p class="heard" id="heard">Toca el micrófono y lee la oración.</p>
    <button class="skip" id="skipSpeak">No puedo hablar ahora</button>`,
};

/* ---------- interacción por tipo ---------- */
const AFTER = {
  intro: (ex, box) => { box.querySelector('.cta').onclick = next; speak(ex.word.en); },
  tip: (ex, box) => { box.querySelector('.cta').onclick = next; },
  dialog: (ex, box) => { toggleTr(box); box.querySelector('.cta').onclick = next; },
  read: (ex, box) => {
    toggleTr(box);
    box.querySelectorAll('.rs span').forEach(s => s.onclick = () => s.parentElement.querySelector('.tr').classList.toggle('hidden'));
    box.querySelector('.cta').onclick = next;
  },
  mc: (ex, box) => box.querySelectorAll('.opt').forEach(b => b.onclick = () => answerMC(ex, b)),
  type: (ex, box) => {
    const inp = box.querySelector('#inp'); setTimeout(() => inp.focus({ preventScroll: true }), 50);
    const go = () => inp.value.trim() && grade(ex.mode === 'sentence' ? checkSentence(ex.answer, inp.value) : check({ en: ex.answer, alt: ex.alts }, 'en', inp.value), inp.value);
    box.querySelector('#btnCheck').onclick = go;
    inp.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); e.stopPropagation(); go(); } };
  },
  build: (ex, box) => {
    const line = box.querySelector('#bline'), btn = box.querySelector('#btnCheck');
    const sync = () => { btn.disabled = !line.children.length; };
    box.querySelectorAll('#bank .tile').forEach(t => t.onclick = () => {
      if (R.cur.done || t.classList.contains('used')) return;
      t.classList.add('used');
      const c = document.createElement('button'); c.className = 'tile'; c.textContent = t.textContent;
      c.onclick = () => { if (R.cur.done) return; c.remove(); t.classList.remove('used'); sync(); };
      line.appendChild(c); sync(); speak(t.textContent, 1);
    });
    btn.onclick = () => { const s = [...line.children].map(c => c.textContent).join(' '); const r = checkSentence(ex.answer, s); grade(r.typo ? { ...r, ok: false, grade: 1 } : r, s); };
  },
  match: (ex, box) => {
    let sel = null, errors = 0, left = ex.pairs.length;
    box.querySelectorAll('.tile.m').forEach(t => t.onclick = () => {
      if (t.disabled) return;
      if (!sel || sel.dataset.side === t.dataset.side){ $$('.tile.m.sel').forEach(x => x.classList.remove('sel')); sel = t; t.classList.add('sel');
        if (t.dataset.side === 'en') speak(t.textContent); return; }
      if (sel.dataset.i === t.dataset.i){
        [sel, t].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
        sel = null;
        if (--left === 0) grade({ ok: errors <= 2, grade: errors === 0 ? 3 : errors <= 2 ? 2 : 1 }, `${errors} errores`);
      } else {
        errors++; const a = sel; [a, t].forEach(x => x.classList.add('bad'));
        setTimeout(() => [a, t].forEach(x => x.classList.remove('bad', 'sel')), 500); sel = null;
      }
    });
  },
  speak: (ex, box) => {
    let tries = 0; const mic = box.querySelector('#mic'), heard = box.querySelector('#heard');
    mic.onclick = () => {
      if (R.cur.done) return;
      mic.classList.add('on'); heard.textContent = '🎙️ Te escucho…';
      listenOnce((err, alts) => {
        mic.classList.remove('on');
        if (err){
          if (err === 'not-allowed' || err === 'service-not-allowed'){ heard.textContent = 'Necesito permiso para usar el micrófono. Puedes saltar este ejercicio.'; return; }
          if (err === 'network'){ heard.textContent = 'Para hablar se necesita internet. Puedes saltar este ejercicio.'; return; }
          heard.textContent = 'No te escuché. Toca el micrófono e inténtalo otra vez.'; return;
        }
        const best = alts.map(a => speechScore(ex.text, a)).sort((a, b) => b.ratio - a.ratio)[0];
        heard.innerHTML = 'Escuché: ' + best.marks.map(m => `<span class="${m.ok ? 'hit' : 'miss'}">${esc(m.w)}</span>`).join(' ');
        tries++;
        if (best.ok) grade({ ok: true, grade: best.ratio === 1 ? 3 : 2 }, alts[0]);
        else if (tries >= 3) grade({ ok: false, grade: 1 }, alts[0]);
        else heard.innerHTML += '<br><small>Casi: repite las palabras en rojo. Intento ' + (tries + 1) + ' de 3.</small>';
      });
    };
    box.querySelector('#skipSpeak').onclick = () => {
      stopListening(); S.noSpeakUntil = Date.now() + 15 * 60e3; save();
      R.list = R.list.filter((e, i) => i <= R.i || e.type !== 'speak');
      R.total = R.list.filter(e => GRADED.has(e.type)).length - 1;
      toast('Ok, sin ejercicios de hablar por 15 minutos.');
      R.i++; render();
    };
  },
};

function toggleTr(box){
  const b = box.querySelector('[data-toggle]'); if (!b) return;
  b.onclick = () => { const hidden = box.querySelector('.tr.hidden'); box.querySelectorAll('.tr').forEach(t => t.classList.toggle('hidden', !hidden)); b.textContent = hidden ? 'Ocultar traducción' : 'Ver traducción'; };
}

function answerMC(ex, btn){
  const v = ex.options[+btn.dataset.i];
  if (R.meta.mode === 'placement'){
    if (R.cur.done) return; R.cur.done = true;
    if (v === ex.answer) R.byLevel[ex.lvl]++;
    btn.classList.add('picked'); R.answered.add(R.i);
    setTimeout(() => { R.i++; render(); }, 280);
    return;
  }
  $$('#ex .opt').forEach(b => { if (ex.options[+b.dataset.i] === ex.answer) b.classList.add('ok'); });
  if (v !== ex.answer) btn.classList.add('bad');
  grade(v === ex.answer ? { ok: true, grade: 3 } : { ok: false, grade: 1 }, v);
}

/* ---------- calificar y retroalimentación ---------- */
function grade(res, given){
  const cur = R.cur; if (cur.done) return; cur.done = true; cur.answer = String(given ?? '');
  const ex = cur.ex, id = ex.key || `${ex.type}:${R.i}`;
  const first = !R.answered.has(id);
  if (first){
    R.answered.add(id);
    if (ex.key) schedule(cardState(ex.key), res.grade, CFG.retention);
    S.stats.answers++; if (res.ok) S.stats.correct++;
    const sk = (S.skills[ex.skill] = S.skills[ex.skill] || { ok: 0, n: 0 }); sk.n++; if (res.ok) sk.ok++;
    if (res.ok){ R.correct++; R.xp += CFG.xpCorrect; R.seeds += CFG.seedCorrect; } else R.wrong++;
  }
  if (!res.ok && !R.retried.has(id) && ex.type !== 'match' && ex.type !== 'speak'){ R.retried.add(id); R.list.push(ex); } // vuelve al final
  $$('#ex .opt, #ex .tile, #ex #btnCheck').forEach(b => b.disabled = true);
  const inp = $('#inp'); if (inp){ inp.disabled = true; inp.style.borderColor = res.ok ? 'var(--ok)' : 'var(--bad)'; }

  const fb = $('#fb'); fb.classList.add('show', res.ok ? 'ok' : 'bad');
  const after = ex.after || [ex.answer, ''];
  $('#fbTitle').textContent = res.ok ? (res.typo ? '¡Casi perfecto!' : pick(['¡Squeak!', '¡Exacto!', '¡Muy bien!', '¡Eso es!', '¡Bien hecho!'])) : 'Casi…';
  let txt = '';
  if (!res.ok && ex.answer && ex.type !== 'match') txt += `Respuesta correcta: <b class="w">${esc(ex.answer)}</b><br>`;
  if (res.typo) txt += `Ojo con la ortografía: <b class="w">${esc(ex.answer)}</b><br>`;
  if (after[0] && after[0] !== ex.answer) txt += `<i>${esc(after[0])}</i>`;
  else if (after[0] && res.ok) txt += `<b class="w">${esc(after[0])}</b>`;
  if (after[1]) txt += ` · ${esc(after[1])}`;
  if (ex.type === 'match') txt = res.ok ? '¡Todas las parejas!' : 'Varias parejas equivocadas. Las verás otra vez pronto.';
  $('#fbText').innerHTML = txt;
  const say = after[0] || ex.answer;
  $('#fbAudio').innerHTML = ex.type === 'match' ? '' : `<button data-say="${esc(say)}">🔊 Escuchar</button><button data-say="${esc(say)}" data-rate="0.55">🐢 Lento</button>`;
  $('#fbAudio').querySelectorAll('button').forEach(b => b.onclick = () => speak(b.dataset.say, b.dataset.rate ? +b.dataset.rate : 0.9));
  $('#btnReport').textContent = '⚑ Reportar un error'; $('#btnReport').disabled = false;
  if (/[a-z]/i.test(say) && ex.type !== 'speak' && ex.skill !== 'listen' && !/[áéíóúñ¿¡]/i.test(say)) speak(say);
  save();
  setTimeout(() => $('#btnNext').focus({ preventScroll: true }), 50);
}

function next(){ stopListening(); R.i++; render(); }

function report(){
  const cur = R?.cur; if (!cur) return;
  const note = prompt('¿Qué está mal? (opcional: por ejemplo "la traducción no es correcta")', '');
  if (note === null) return;
  S.reports.push({ ts: new Date().toISOString(), key: cur.ex.key || cur.ex.type, type: cur.ex.type, expected: cur.ex.answer || '',
    answer: cur.answer || '', sentence: cur.ex.sent || cur.ex.big || cur.ex.es || '', note: note.trim().slice(0, 300) });
  save(); $('#btnReport').textContent = '✓ Reporte guardado. ¡Gracias!'; $('#btnReport').disabled = true;
}

/* ---------- terminar ---------- */
function finish(early){
  stopListening();
  $('#fb').classList.remove('show');
  $('#lprog').style.width = '100%'; $('#lcount').textContent = '';
  const m = R.meta;
  if (m.mode === 'placement') return finishPlacement();
  const graded = R.correct + R.wrong, score = graded ? R.correct / graded : 0;
  const perfect = !early && R.wrong === 0 && graded > 0, bonus = perfect ? CFG.perfectBonus : 0;
  let passed = true, headline = early ? 'Sesión guardada' : perfect ? '¡Lección perfecta!' : '¡Lección terminada!';
  if (m.mode === 'lesson' && !early){
    const k = lessonKey(m.u, m.l), prev = S.lessons[k] || {};
    passed = m.l.kind !== 'review' || score >= 0.8;
    S.lessons[k] = { done: prev.done || passed, best: Math.max(prev.best || 0, Math.round(score * 100)), ts: Date.now() };
    if (!passed) headline = 'Casi: necesitas 80 % para pasar el repaso';
    else if (m.l.kind === 'review') headline = '¡Unidad completada! 🏆';
  }
  if (m.mode === 'review' && !early) headline = perfect ? '¡Repaso perfecto!' : '¡Repaso terminado!';
  S.seeds += R.seeds + bonus; S.stats.sessions++;
  const goalHit = addXP(R.xp); if (goalHit) S.seeds += CFG.goalBonus;
  save(); checkUnlocks(); renderTop();
  const letters = checkLetters();
  const p = petDef(S.pet), nx = nextLesson();
  $('#ex').innerHTML = `<div class="done">
    <div class="pet-big" data-state="happy">${petSVG(p)}</div>
    <h2>${headline}</h2>
    <p class="sub">${esc(petName(p.id))} ${perfect ? 'está dando saltos.' : 'aprendió contigo.'}</p>
    <div class="rew"><div><b>+${R.xp}</b>XP</div><div><b>+${R.seeds + bonus}</b>🌰</div><div><b>${Math.round(score * 100)}%</b>aciertos</div></div>
    ${perfect ? `<p class="bonus">Bono por lección perfecta: +${CFG.perfectBonus} 🌰</p>` : ''}
    ${goalHit ? `<p class="bonus">🔥 ¡Meta del día cumplida! +${CFG.goalBonus} 🌰 · Racha: ${S.streak} día${S.streak > 1 ? 's' : ''}</p>` : ''}
    ${letters.length ? '<p class="bonus">💌 ¡Llegó una carta! Búscala en la casa.</p>' : ''}
    ${nx && !early ? `<button class="cta" id="btnNextLesson">Siguiente: ${esc(nx.u.icon)} ${esc(nx.l.title)}</button>` : ''}
    ${!passed ? '<button class="cta warm" id="btnRetry">Intentar otra vez</button>' : ''}
    <button class="cta ${nx && !early ? 'ghost' : ''}" id="btnHome">Volver a la madriguera</button>
  </div>`;
  $('#btnHome').onclick = () => showView('home');
  $('#btnNextLesson')?.addEventListener('click', () => runLesson(nx.u, nx.l));
  $('#btnRetry')?.addEventListener('click', () => runLesson(m.u, m.l));
  R = null;
}

function finishPlacement(){
  const res = placementResult(R.byLevel);
  S.placement = { level: res.level, skipA1: res.skipA1, openA2: res.openA2, ts: Date.now(), score: { ...R.byLevel } };
  if (res.skipA1) markA1Known();
  save(); renderTop();
  const nx = nextLesson();
  $('#ex').innerHTML = `<div class="done">
    <div class="pet-big" data-state="happy">${petSVG(petDef(S.pet))}</div>
    <h2>Tu nivel: ${esc(res.level)}</h2>
    <div class="rew">${['A1', 'A2', 'B1'].map(l => `<div><b>${R.byLevel[l]}/5</b>${l}</div>`).join('')}</div>
    <p class="sub">${esc(res.msg)}</p>
    ${nx ? `<button class="cta" id="btnNextLesson">Empezar: ${esc(nx.u.icon)} ${esc(nx.l.title)}</button>` : ''}
    <button class="cta ${nx ? 'ghost' : ''}" id="btnHome">Volver a la madriguera</button></div>`;
  $('#btnHome').onclick = () => showView('home');
  $('#btnNextLesson')?.addEventListener('click', () => runLesson(nx.u, nx.l));
  R = null;
}

/** Al saltar el A1, sus palabras quedan como "sabidas" y vuelven de vez en cuando como repaso. */
function markA1Known(){
  const now = Date.now(), DAY = 864e5;
  UNITS.forEach(u => u.words.forEach(w => {
    const k = u.id + ':' + w.en;
    if (S.cards[k]?.seen) return;
    S.cards[k] = { seen: true, reps: 2, lapses: 0, s: 12, d: 5, last: now, due: now + (3 + Math.random() * 27) * DAY };
  }));
}
