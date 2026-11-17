/* =====================================================================
   JUNTOS: espacios comunes (patio, sala, cocina) donde conviven todas las
   mascotas desbloqueadas. Caminan solas, se visitan, duermen y comen juntas.
   Tocar una mascota: dice una frase en inglés. Tocar un objeto: su nombre.
   ===================================================================== */
import { $, $$, esc, pick, toast } from '../util.js';
import { S, save, petName, spend } from '../state.js';
import { petDef } from '../data/config.js';
import { SCENES, PHRASES, YARD_DECOR } from '../data/scenes.js';
import { petSVG } from '../petsvg.js';
import { speak } from '../speech.js';
import { register, showView } from '../router.js';
import { renderTop } from './home.js';

const SPEED = 10;            // % del escenario por segundo
let actors = [], loop = null, selected = null, seed = null;

const isNight = () => { const h = new Date().getHours(); return h < 7 || h >= 19; };
const sceneOf = id => S.petScene[id] || 'patio';
export const sceneOpen = s => !s.price || S.owned.includes('scene_' + s.id);
const current = () => SCENES.find(s => s.id === S.yardScene && sceneOpen(s)) || SCENES[0];
/** Decoración comprada y activa en el escenario actual. */
const decorHere = () => YARD_DECOR.filter(d => d.scene === current().id && S.owned.includes(d.id) && S.yardDecor[d.id] !== false);
const rand = (a, b) => a + Math.random() * (b - a);
const visible = () => !$('#view-yard').classList.contains('hidden');

function randomSpot(){
  const [f0, f1] = current().floor;
  return { x: rand(12, 88), y: rand(f0, f1) };
}

/** Coloca la mascota; más arriba = más lejos = más pequeña. */
function place(a, x, y){
  const [f0, f1] = current().floor;
  a.x = x; a.y = y;
  a.el.style.left = x + '%'; a.el.style.top = y + '%';
  a.el.style.setProperty('--s', (0.72 + 0.28 * (y - f0) / (f1 - f0)).toFixed(3));
  a.el.style.zIndex = Math.round(y * 10);
}
const setState = (a, st) => { a.el.querySelector('.ypi').dataset.state = st; };

function moveTo(a, x, y, then){
  const d = Math.hypot(x - a.x, (y - a.y) * 1.1), t = Math.max(.4, d / SPEED);
  a.el.style.setProperty('--t', t + 's');
  a.el.querySelector('.ypi').classList.toggle('flip', x < a.x);
  setState(a, 'walk'); place(a, x, y);
  a.busy = Date.now() + t * 1000;
  clearTimeout(a.timer);
  a.timer = setTimeout(() => { setState(a, 'idle'); then?.(); }, t * 1000);
}

function hearts(x, y, emoji = '💗', n = 3){
  const fx = $('#yardFx');
  for (let i = 0; i < n; i++){
    const s = document.createElement('span'); s.textContent = emoji;
    s.style.left = (x + rand(-4, 4)) + '%'; s.style.top = (y - rand(14, 24)) + '%'; s.style.animationDelay = (i * .15) + 's';
    fx.appendChild(s); setTimeout(() => s.remove(), 1800);
  }
}

function bubble(x, y, html, ms = 3200){
  const b = $('#yardBubble'); b.innerHTML = html;
  b.style.left = Math.min(80, Math.max(20, x)) + '%'; b.style.top = Math.max(4, y) + '%';
  b.classList.add('show'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), ms);
}

/** Decide qué hace cada mascota libre: pasear, visitar a otra, dormir, saltar… */
function think(){
  if (!visible()){ stop(); return; }
  const now = Date.now();
  for (const a of actors){
    if (a.busy > now || a.next > now || a === selected) continue;
    const r = Math.random(), sleepy = isNight() ? .3 : .1;
    a.next = now + rand(2500, 6000);
    if (r < .45){ const p = randomSpot(); moveTo(a, p.x, p.y); }
    else if (r < .65 && actors.length > 1){
      const b = pick(actors.filter(o => o !== a && o.busy < now));
      if (!b) continue;
      const side = a.x < b.x ? -9 : 9;
      moveTo(a, Math.min(90, Math.max(10, b.x + side)), b.y + rand(-1, 1), () => {
        setState(a, 'happy'); setState(b, 'happy'); hearts((a.x + b.x) / 2, Math.min(a.y, b.y));
        b.busy = Date.now() + 1800;
        setTimeout(() => { setState(a, 'idle'); setState(b, 'idle'); }, 1800);
      });
    }
    else if (r < .78 && decorHere().some(d => d.spot)){
      const d = pick(decorHere().filter(d => d.spot));
      moveTo(a, d.spot[0] + rand(-5, 5), d.spot[1] + rand(-2, 2), () => {
        setState(a, 'happy'); hearts(a.x, a.y, '✨', 2);
        a.busy = Date.now() + 1800; a.timer = setTimeout(() => setState(a, 'idle'), 1800);
      });
    }
    else if (r < .78 + sleepy){ setState(a, 'sleepy'); a.busy = now + rand(4000, 8000); a.timer = setTimeout(() => setState(a, 'idle'), a.busy - now); }
    else if (r < .92){ setState(a, 'happy'); a.busy = now + 1800; a.timer = setTimeout(() => setState(a, 'idle'), 1800); }
  }
}
function stop(){ clearInterval(loop); loop = null; actors.forEach(a => clearTimeout(a.timer)); }

function renderYard(){
  stop(); selected = null; seed = null;
  const sc = current(), night = isNight();
  $('#yardTabs').innerHTML = SCENES.map(s => {
    const n = S.unlocked.filter(id => sceneOf(id) === s.id).length;
    const open = sceneOpen(s);
    return `<button data-s="${s.id}" class="${s.id === sc.id ? 'on' : ''} ${open ? '' : 'locked'}"><span>${open ? s.ico : '🔒'}</span>${s.name}${open ? ` <small>${n}</small>` : ''}</button>`;
  }).join('');
  $$('#yardTabs button').forEach(b => b.onclick = () => {
    const s = SCENES.find(x => x.id === b.dataset.s);
    if (!sceneOpen(s)){ toast(`${s.ico} ${s.name}: desbloquéalo en la tienda por 🌰 ${s.price}`); return showView('shop'); }
    S.yardScene = s.id; save(); renderYard();
  });
  $('#yardTabs .on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  const decor = decorHere().map(d => `<g class="obj" data-en="${d.en}" data-es="${d.es}">${d.svg}</g>`).join('');
  $('#yardBg').innerHTML = `<svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice">${sc.svg(night)}${decor}</svg>`;
  $('#yardFx').innerHTML = ''; $('#yardBubble').classList.remove('show');

  const stage = $('#yardPets'); stage.innerHTML = '';
  actors = S.unlocked.filter(id => sceneOf(id) === sc.id).map(id => {
    const el = document.createElement('button');
    el.className = 'ypet'; el.setAttribute('aria-label', petName(id));
    el.innerHTML = `<div class="ypi" data-state="idle">${petSVG(petDef(id))}</div>`;
    stage.appendChild(el);
    const a = { id, el, x: 0, y: 0, busy: 0, next: Date.now() + rand(300, 3000) };
    const p = randomSpot(); place(a, p.x, p.y);
    el.onclick = e => { e.stopPropagation(); tapPet(a); };
    return a;
  });
  $('#yardHint').textContent = actors.length
    ? `${actors.length} ${actors.length === 1 ? 'mascota vive' : 'mascotas viven'} aquí. Toca a una para escucharla, o toca cualquier objeto para aprender su nombre en inglés.`
    : 'No hay nadie aquí todavía. Toca una mascota en otro espacio para traerla.';
  renderBar();
  $('#btnScatter').disabled = !actors.length || S.seeds < 1;
  loop = setInterval(think, 500);
}
register('yard', renderYard);

function tapPet(a){
  selected = a;
  const p = petDef(a.id), grp = p.group || 'other';
  const [en, es] = pick([...PHRASES.all, ...(PHRASES[grp] || []), ...(isNight() ? PHRASES.night : [])]);
  setState(a, 'happy'); a.busy = Date.now() + 1800;
  clearTimeout(a.timer); a.timer = setTimeout(() => { setState(a, 'idle'); if (selected === a) selected = null; }, 2500);
  bubble(a.x, a.y - 30, `<b>${esc(petName(a.id))}:</b> ${esc(en)}<small>${esc(es)}</small>`);
  speak(en);
  renderBar(a);
}

/** Barra de acciones de la mascota seleccionada: mudarla a otro espacio o llevarla a casa. */
function renderBar(a){
  const bar = $('#yardBar');
  if (!a){ bar.innerHTML = ''; bar.classList.remove('show'); return; }
  const others = SCENES.filter(s => s.id !== current().id && sceneOpen(s));
  bar.innerHTML = `<b>${esc(petName(a.id))}</b>
    ${others.map(s => `<button data-to="${s.id}">${s.ico} ${s.name}</button>`).join('')}
    ${S.pet === a.id ? '<span class="home">🏠 Vive en tu casa</span>' : '<button data-home="1">🏠 A mi casa</button>'}`;
  bar.classList.add('show');
  bar.querySelectorAll('[data-to]').forEach(b => b.onclick = () => {
    const to = SCENES.find(s => s.id === b.dataset.to);
    S.petScene[a.id] = to.id; save();
    toast(`${petName(a.id)} se fue a ${to.name.toLowerCase()} ${to.ico}`);
    moveTo(a, a.x < 50 ? -15 : 115, a.y, () => renderYard());
  });
  bar.querySelector('[data-home]')?.addEventListener('click', () => {
    S.pet = a.id; save(); toast(`${petName(a.id)} ahora vive en tu casa 🏠`); renderBar(a);
  });
}

// Tocar un objeto del escenario: su nombre en inglés.
$('#yardBg').addEventListener('click', e => {
  const o = e.target.closest('.obj'); if (!o) return;
  const r = $('#yardStage').getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
  bubble(x, y - 12, `${esc(o.dataset.en)}<small>${esc(o.dataset.es)}</small>`, 2600);
  speak(o.dataset.en);
  selected = null; renderBar();
});

// Esparcir semillas: todas corren a comer juntas.
$('#btnScatter').onclick = () => {
  if (!actors.length || seed) return;
  if (!spend(1)) return toast('No tienes semillas. ¡A estudiar! 📚');
  renderTop();
  const p = randomSpot(), el = document.createElement('span');
  el.className = 'yseed'; el.textContent = '🌰🌰'; el.style.left = p.x + '%'; el.style.top = p.y + '%';
  $('#yardFx').appendChild(el); seed = el;
  let arrived = 0;
  actors.forEach((a, i) => {
    const ang = i / actors.length * Math.PI * 2;
    const rx = 8 + actors.length * 1.2, ry = 3 + actors.length * .5;
    moveTo(a, Math.min(92, Math.max(8, p.x + Math.cos(ang) * rx)), p.y + Math.sin(ang) * ry, () => {
      setState(a, 'eat'); a.busy = Date.now() + 2200;
      if (++arrived === actors.length) setTimeout(() => {
        el.remove(); seed = null; hearts(p.x, p.y, '✨', 4);
        actors.forEach(b => setState(b, 'happy'));
        setTimeout(() => actors.forEach(b => setState(b, 'idle')), 1600);
        $('#btnScatter').disabled = S.seeds < 1;
      }, 2000);
    });
  });
  S.fullness = Math.min(100, S.fullness + 10); S.fullTs = Date.now(); save();
};
$('#yardBack').onclick = () => showView('home');
