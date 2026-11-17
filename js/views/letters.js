// CARTAS: buzón, lector de cartas y editor para escribirlas a otra persona.
import { $, $$, esc, toast } from '../util.js';
import { S, save } from '../state.js';
import { TRIGGERS, whenText, deliverLetters, unread, encodeLetters, importLetters, newId } from '../letters.js';
import { speak } from '../speech.js';
import { register, showView } from '../router.js';

const fmtDay = ts => new Date(ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

/* ---------- lector ---------- */
export function openLetter(l){
  const m = $('#letterModal');
  m.querySelector('.env').classList.remove('open');
  m.querySelector('.envfrom').textContent = `Carta de ${l.from || 'alguien especial'}`;
  const body = l.en
    ? `<p class="len">${esc(l.en)}</p>
       <div class="laudio"><button data-r="">🔊 Escuchar</button><button data-r="0.6">🐢 Lento</button></div>
       <button class="ltr">Ver en español</button><p class="les hidden">${esc(l.es)}</p>`
    : `<p class="les">${esc(l.es)}</p>`;
  m.querySelector('.lbody').innerHTML = body;
  m.querySelector('.lfrom').textContent = `— ${l.from || '💌'}`;
  m.querySelectorAll('.laudio button').forEach(b => b.onclick = e => { e.stopPropagation(); speak(l.en, b.dataset.r ? +b.dataset.r : 0.85); });
  m.querySelector('.ltr')?.addEventListener('click', e => {
    e.stopPropagation(); m.querySelector('.les').classList.toggle('hidden');
    e.target.textContent = m.querySelector('.les').classList.contains('hidden') ? 'Ver en español' : 'Ocultar español';
  });
  m.hidden = false;
  m.querySelector('.env').onclick = () => {
    m.querySelector('.env').classList.add('open');
    if (!l.read){ l.read = true; save(); }
  };
}
$('#letterClose').onclick = () => {
  $('#letterModal').hidden = true;
  const v = document.querySelector('.view:not(.hidden)')?.id?.replace('view-', '');
  if (v) showView(v);
};

/** Revisa si llegaron cartas nuevas y avisa. */
export function checkLetters(){
  const arrived = deliverLetters();
  if (arrived.length) toast(arrived.length === 1 ? `💌 ¡Llegó una carta de ${arrived[0].from || 'alguien especial'}!` : `💌 ¡Llegaron ${arrived.length} cartas!`);
  return arrived;
}

/* ---------- buzón ---------- */
function renderInbox(){
  checkLetters();
  const got = S.letters.filter(l => l.got).sort((a, b) => b.got - a.got);
  const waiting = S.letters.filter(l => !l.got);
  $('#inbox').innerHTML =
    (got.length ? got.map(l => `<button class="letter ${l.read ? '' : 'new'}" data-id="${esc(l.id)}">
        <span class="lic">${l.read ? '📖' : '💌'}</span>
        <span class="lt"><b>${esc(l.from || 'Carta')}</b><small>${esc((l.en || l.es).slice(0, 60))}${(l.en || l.es).length > 60 ? '…' : ''}</small></span>
        <span class="ld">${fmtDay(l.got)}</span></button>`).join('')
      : '<p class="note">Aún no tienes cartas. 📭</p>') +
    (waiting.length ? `<h3>Cartas en camino</h3>` + waiting.map(l => `<div class="letter locked">
        <span class="lic">🔒</span>
        <span class="lt"><b>${esc(l.from || 'Alguien')} te escribió</b><small>${l.secret ? 'Llegará cuando menos lo esperes 🤫' : 'Llegará ' + esc(whenText(l.when))}</small></span></div>`).join('') : '');
  $$('#inbox .letter[data-id]').forEach(b => b.onclick = () => openLetter(S.letters.find(l => l.id === b.dataset.id)));
}
register('letters', renderInbox);

$('#codeBtn').onclick = () => {
  const code = $('#codeIn').value; if (!code.trim()) return;
  try { const r = importLetters(code); $('#codeIn').value = ''; toast(`💌 Recibiste ${r.total} carta${r.total > 1 ? 's' : ''}`); renderInbox(); }
  catch (e) { toast('Ese código no es válido.'); }
};
$('#lettersBack').onclick = () => showView('settings');

/** Recibir cartas desde el enlace (#cartas=…). */
export function importFromHash(){
  const h = location.hash;
  if (!h.startsWith('#cartas=')) return false;
  try {
    const r = importLetters(h.slice(1));
    toast(`💌 Recibiste ${r.total} carta${r.total > 1 ? 's' : ''} sorpresa. Irán apareciendo…`);
  } catch (e) { toast('El enlace de cartas no es válido.'); }
  history.replaceState(null, '', location.pathname + location.search);
  return true;
}

/* ---------- editor (para quien escribe) ---------- */
function draftCard(d, i){
  const tr = TRIGGERS[d.when.t];
  return `<div class="draft" data-i="${i}">
    <div class="dhead"><b>Carta ${i + 1}</b><button class="ddel" data-del="${i}" aria-label="Borrar carta">🗑️</button></div>
    <label class="field">Mensaje<textarea data-k="es" rows="3" placeholder="Escribe aquí tu mensaje…">${esc(d.es)}</textarea></label>
    <label class="field">En inglés <small>(opcional: así practica leyendo)</small><textarea data-k="en" rows="2" placeholder="I am so proud of you!">${esc(d.en)}</textarea></label>
    <label class="field">¿Cuándo aparece?
      <select data-k="t">${Object.entries(TRIGGERS).map(([k, t]) => `<option value="${k}" ${k === d.when.t ? 'selected' : ''}>${t.label}</option>`).join('')}</select></label>
    ${tr.input ? `<input class="dval" data-k="v" type="${tr.input}" ${tr.input === 'number' ? 'min="1" inputmode="numeric"' : ''} value="${esc(d.when.v)}" placeholder="${tr.input === 'number' ? 'Ej. 7' : ''}">` : ''}
    <label class="chk"><input type="checkbox" data-k="secret" ${d.secret ? 'checked' : ''}> Que no sepa cuándo llegará</label>
  </div>`;
}

function renderCompose(){
  $('#cAuthor').value = S.author || '';
  $('#drafts').innerHTML = S.drafts.length ? S.drafts.map(draftCard).join('') : '<p class="note">Todavía no hay cartas. Toca "Nueva carta".</p>';
  $('#cOut').innerHTML = '';
  $$('#drafts .draft').forEach(el => {
    const d = S.drafts[+el.dataset.i];
    el.querySelectorAll('[data-k]').forEach(inp => {
      const k = inp.dataset.k;
      const upd = () => {
        if (k === 'es' || k === 'en') d[k] = inp.value;
        else if (k === 't'){ d.when = { t: inp.value, v: '' }; save(); return renderCompose(); }
        else if (k === 'v') d.when.v = inp.value;
        else if (k === 'secret') d.secret = inp.checked;
        save();
      };
      inp.addEventListener(inp.tagName === 'SELECT' || inp.type === 'checkbox' ? 'change' : 'input', upd);
    });
  });
  $$('#drafts .ddel').forEach(b => b.onclick = () => {
    if (!b.dataset.c){ b.dataset.c = 1; b.textContent = '¿Borrar?'; return; }
    S.drafts.splice(+b.dataset.del, 1); save(); renderCompose();
  });
}
register('compose', renderCompose);

$('#cAuthor').oninput = e => { S.author = e.target.value; save(); };
$('#cAdd').onclick = () => {
  S.drafts.push({ id: newId(), es: '', en: '', when: { t: 'now', v: '' }, secret: false }); save(); renderCompose();
  $$('#drafts textarea[data-k=es]')[S.drafts.length - 1]?.focus();
};
$('#composeBack').onclick = () => showView('settings');

$('#cMake').onclick = () => {
  const list = S.drafts.filter(d => d.es.trim());
  if (!list.length) return toast('Escribe al menos una carta.');
  const bad = list.find(d => TRIGGERS[d.when.t].input && !String(d.when.v).trim());
  if (bad) return toast('Falta la fecha o el número en una carta.');
  const code = encodeLetters(list.map(d => ({ ...d, from: S.author.trim() })));
  const link = location.origin + location.pathname + '#cartas=' + code;
  $('#cOut').innerHTML = `
    <p class="note">✅ Listo: ${list.length} carta${list.length > 1 ? 's' : ''}. Envíale este enlace (por ejemplo, por WhatsApp). Al abrirlo en su celular, las cartas se guardan en su app y van apareciendo cuando se cumple cada condición.</p>
    <textarea class="linkbox" id="cLink" readonly rows="3">${esc(link)}</textarea>
    <div class="actions"><button id="cCopy">📋 Copiar</button>${navigator.share ? '<button id="cShare">📤 Compartir</button>' : ''}<button id="cTest">🧪 Probar aquí</button></div>
    <p class="note">Si después editas o agregas cartas, crea un enlace nuevo y envíalo: las cartas que ya tenía se actualizan sin repetirse.</p>`;
  $('#cCopy').onclick = async () => {
    try { await navigator.clipboard.writeText(link); }
    catch (e) { const t = $('#cLink'); t.select(); document.execCommand('copy'); }
    toast('Enlace copiado 📋');
  };
  $('#cShare')?.addEventListener('click', () => navigator.share({ title: 'Madriguera 💌', text: 'Tengo algo para ti 💌', url: link }).catch(() => {}));
  $('#cTest').onclick = () => { importLetters(code); toast('Cartas agregadas a TU buzón para probar.'); showView('letters'); };
};
