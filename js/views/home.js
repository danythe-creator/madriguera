// CASA: la mascota en su cuarto.
import { $, pick, esc, toast } from '../util.js';
import { S, save, tick, dueCards, allCards, isSeen, level, petName } from '../state.js';
import { CFG, petDef } from '../data/config.js';
import { petSVG } from '../petsvg.js';
import { SLOTS, decorDef, wallDef } from '../data/shop.js';
import { speak } from '../speech.js';
import { register, showView } from '../router.js';
import { startLesson } from './lesson.js';
import { unread } from '../letters.js';
import { openLetter, checkLetters } from './letters.js';

export function renderTop(){
  $('#streak').textContent = S.streak; $('#seeds').textContent = S.seeds;
  $('#lvl').textContent = 'Nv ' + level(); $('#xpbar').style.width = (S.xp % 100) + '%';
}

let stateT;
function setPetState(st, ms){
  const w = $('#petwrap'); w.dataset.state = st; $('#wheel')?.classList.toggle('spin', st === 'happy');
  clearTimeout(stateT);
  if (ms) stateT = setTimeout(() => { w.dataset.state = baseState(); $('#wheel')?.classList.remove('spin'); }, ms);
}
const baseState = () => S.fullness < 30 ? 'sleepy' : 'idle';

function fx(emoji, n = 5){
  const f = $('#fx');
  for (let i = 0; i < n; i++){
    const s = document.createElement('span'); s.textContent = emoji;
    s.style.left = (40 + Math.random() * 30) + '%'; s.style.top = (35 + Math.random() * 25) + '%'; s.style.animationDelay = (i * .12) + 's';
    f.appendChild(s); setTimeout(() => s.remove(), 1700);
  }
}
function bubble(html, ms = 2600){
  const b = $('#bubble'); b.innerHTML = html; b.classList.add('show');
  clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), ms);
}
function renderMeter(){
  $('#fullbar').style.width = S.fullness + '%'; $('#fullpct').textContent = Math.round(S.fullness) + '%';
  $('#btnFeed').disabled = S.seeds < CFG.feedCost;
}

/** Pinta la decoración comprada en cada zona del cuarto y el color de pared. */
export function renderRoom(){
  for (const slot of Object.keys(SLOTS)){
    const d = decorDef(S.decor[slot]);
    const el = $('#slot-' + slot);
    el.innerHTML = d ? d.html() : '';
    el.dataset.item = d ? d.id : '';
  }
  const w = wallDef(S.wallTheme);
  $('#room').style.setProperty('--wallA', w.a); $('#room').style.setProperty('--wallB', w.b);
}

function renderHome(){
  tick(); renderTop();
  const p = petDef(S.pet), name = petName(p.id), due = dueCards().length;
  renderRoom();
  $('#petwrap').innerHTML = petSVG(p); setPetState(baseState());
  $('#petname').textContent = name; $('#petsp').textContent = p.sp;
  renderMeter();
  const h = new Date().getHours(); $('#win').classList.toggle('night', h < 7 || h >= 19);
  checkLetters();
  const un = unread();
  $('#letterBtn').hidden = !un.length; $('#letterCount').textContent = un.length > 1 ? un.length : '';
  $('#mood').textContent = un.length ? `💌 ¡${name} te trae una carta de ${un[0].from || 'alguien especial'}! Toca el sobre.` :
    S.fullness < 30 ? `${name} tiene hambre… dale una semilla.` :
    due > 0 ? `${name} quiere repasar ${due} palabra${due > 1 ? 's' : ''}.` :
    `${name} está feliz. Buen momento para aprender algo nuevo.`;
  const btn = $('#btnStudy');
  btn.textContent = due > 0 ? `Repasar ${due} · + aprender` : 'Aprender palabras nuevas';
  btn.classList.toggle('warm', due > 0);
  $('#goalTxt').textContent = `${Math.min(S.todayXP, CFG.dailyGoal)} / ${CFG.dailyGoal} XP ${S.todayXP >= CFG.dailyGoal ? '✓' : ''}`;
}
register('home', renderHome);

$('#btnFeed').onclick = () => {
  if (S.seeds < CFG.feedCost) return toast('Sin semillas: gana más estudiando.');
  S.seeds -= CFG.feedCost; S.fullness = Math.min(100, S.fullness + CFG.feedAmount); S.fullTs = Date.now(); save();
  const room = $('.room'), s = document.createElement('span'); s.className = 'seedfly'; s.textContent = '🌰';
  s.style.left = '12%'; s.style.top = '75%'; s.style.setProperty('--dx', '110px'); s.style.setProperty('--dy', '-70px');
  room.appendChild(s); setTimeout(() => s.remove(), 950);
  setPetState('eat', 1900); setTimeout(() => { setPetState('happy', 1800); fx('✨', 4); }, 1900);
  renderTop(); renderMeter();
};
$('#btnPet').onclick = () => { setPetState('happy', 1800); fx('💗', 6); bubble(pick(['¡Squeak!', 'Hi, friend!', '♪', 'I love you!'])); };
$('#petwrap').onclick = () => $('#btnPet').onclick();
$('#btnWord').onclick = () => {
  const learned = allCards().filter(c => isSeen(c.key)), pool = learned.length ? learned : allCards().slice(0, 12);
  const w = pick(pool); speak(w.en); bubble(`${esc(w.en)}<small>${esc(w.es)}</small>`, 3200); setPetState('happy', 1400);
};
$('#btnStudy').onclick = () => startLesson();
$('#btnYard').onclick = () => showView('yard');
$('#letterBtn').onclick = () => { const l = unread()[0]; if (l) openLetter(l); };
