// PERFIL: estadísticas, voz, respaldo y reinicio.
import { $, esc, toast, dayKeyOffset } from '../util.js';
import { S, save, allCards, isLearned, isSeen, dueCards, resetAll, exportData, importData } from '../state.js';
import { englishVoices, speak } from '../speech.js';
import { register } from '../router.js';

function renderSettings(){
  const all = allCards(), learned = all.filter(c => isLearned(c.key)).length, seen = all.filter(c => isSeen(c.key)).length;
  const acc = S.stats.answers ? Math.round(S.stats.correct / S.stats.answers * 100) : 0;
  // últimos 7 días de XP (gráfica de barras sencilla)
  const days = Array.from({length: 7}, (_, i) => dayKeyOffset(i - 6));
  const max = Math.max(30, ...days.map(d => S.stats.days[d] || 0));
  const wd = ['D','L','M','M','J','V','S'];
  $('#stats').innerHTML = `
    <div class="kpis">
      <div><b>${learned}</b>aprendidas</div><div><b>${seen}/${all.length}</b>vistas</div>
      <div><b>${dueCards().length}</b>por repasar</div><div><b>${acc}%</b>precisión</div>
      <div><b>${S.streak}</b>racha</div><div><b>${S.bestStreak || S.streak}</b>mejor racha</div>
    </div>
    <div class="week" role="img" aria-label="XP de los últimos 7 días">${days.map(d => {
      const v = S.stats.days[d] || 0, dt = new Date(d + 'T12:00');
      return `<div><i style="height:${Math.round(v / max * 100)}%" title="${v} XP"></i><span>${wd[dt.getDay()]}</span></div>`;
    }).join('')}</div>`;

  const voices = englishVoices();
  $('#voice').innerHTML = voices.length
    ? voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === S.settings.voice ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')
    : '<option>Sin voces en inglés en este dispositivo</option>';
  $('#rate').value = S.settings.rate; $('#rateVal').textContent = S.settings.rate.toFixed(2) + '×';
}
register('settings', renderSettings);
try { speechSynthesis.addEventListener('voiceschanged', () => { if (!$('#view-settings').classList.contains('hidden')) renderSettings(); }); } catch (e) {}

$('#voice').onchange = e => { S.settings.voice = e.target.value; save(); speak('Hello! Nice to meet you.'); };
$('#rate').oninput = e => { S.settings.rate = +e.target.value; $('#rateVal').textContent = S.settings.rate.toFixed(2) + '×'; save(); };
$('#rate').onchange = () => speak('The hamster is very happy.');

$('#btnExport').onclick = () => {
  const blob = new Blob([exportData()], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `madriguera-respaldo-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$('#btnImport').onclick = () => $('#fileImport').click();
$('#fileImport').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { importData(await f.text()); toast('Respaldo restaurado ✓'); renderSettings(); }
  catch (err) { toast('Ese archivo no es un respaldo válido.'); }
  e.target.value = '';
};
$('#btnReset').onclick = () => {
  const b = $('#btnReset');
  if (b.dataset.c){ resetAll(); location.reload(); }
  else { b.dataset.c = 1; b.textContent = '¿Seguro? Se borra todo. Toca otra vez'; setTimeout(() => { delete b.dataset.c; b.textContent = 'Reiniciar todo'; }, 4000); }
};
