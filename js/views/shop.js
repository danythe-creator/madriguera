// TIENDA: adoptar mascotas, decorar el cuarto y los espacios comunes con semillas.
import { $, $$, esc, toast } from '../util.js';
import { S, save, spend } from '../state.js';
import { PETS } from '../data/config.js';
import { DECOR, WALLS, SLOTS, decorDef } from '../data/shop.js';
import { SCENES, YARD_DECOR } from '../data/scenes.js';
import { petSVG } from '../petsvg.js';
import { register } from '../router.js';
import { renderTop } from './home.js';
import { sceneOpen } from './yard.js';

const owns = id => S.owned.includes(id);
let tab = 'pets';
const TABS = { pets: '🐾 Mascotas', room: '🏠 Mi cuarto', spaces: '🌳 Espacios' };

/** Botón de compra: primer toque pide confirmar, el segundo compra. */
function buyBtn(kind, id, price){
  const can = S.seeds >= price;
  return `<button class="buy" data-kind="${kind}" data-id="${id}" data-price="${price}" ${can ? '' : 'disabled'}>🌰 ${price}</button>`;
}
const card = (prev, name, action, extra = '', on = false) =>
  `<div class="scard ${on ? 'equipped' : ''}">${prev}<b>${esc(name)}</b>${extra}${action}</div>`;

function petsTab(){
  return `<div class="sgrid">${PETS.filter(p => p.req.cost).map(p => card(
    `<div class="prev pet">${petSVG(p)}</div>`, p.name,
    S.unlocked.includes(p.id) ? '<button class="owned" disabled>Adoptado ✓</button>' : buyBtn('pet', p.id, p.req.cost),
    `<small>${esc(p.sp)}</small>`)).join('')}</div>`;
}

function roomTab(){
  const decor = Object.entries(SLOTS).map(([slot, label]) => {
    const items = DECOR.filter(d => d.slot === slot).map(d => {
      const on = S.decor[slot] === d.id;
      const action = owns(d.id) || d.price === 0
        ? `<button class="use ${on ? 'on' : ''}" data-slot="${slot}" data-id="${d.id}">${on ? 'Quitar' : 'Usar'}</button>`
        : buyBtn('decor', d.id, d.price);
      return card(`<div class="prev">${d.html()}</div>`, d.name, action, '', on);
    }).join('');
    return `<h3>${label}</h3><div class="sgrid">${items}</div>`;
  }).join('');
  const walls = WALLS.map(w => {
    const on = S.wallTheme === w.id;
    const action = owns(w.id) || w.price === 0
      ? `<button class="use ${on ? 'on' : ''}" data-wall="${w.id}" ${on ? 'disabled' : ''}>${on ? 'En uso' : 'Usar'}</button>`
      : buyBtn('wall', w.id, w.price);
    return card(`<div class="swatch" style="background:linear-gradient(180deg,${w.a},${w.b})"></div>`, w.name, action, '', on);
  }).join('');
  return decor + `<h3>Color de pared</h3><div class="sgrid">${walls}</div>`;
}

function spacesTab(){
  const night = false;
  const rooms = SCENES.filter(s => s.price).map(s => card(
    `<div class="prev scene"><svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice">${s.svg(night)}</svg></div>`,
    `${s.ico} ${s.name}`,
    sceneOpen(s) ? '<button class="owned" disabled>Abierto ✓</button>' : buyBtn('scene', s.id, s.price))).join('');
  const decor = SCENES.map(s => {
    const items = YARD_DECOR.filter(d => d.scene === s.id);
    if (!sceneOpen(s)) return `<h3>${s.ico} ${s.name}</h3><p class="note">🔒 Abre este espacio para decorarlo.</p>`;
    return `<h3>${s.ico} ${s.name}</h3><div class="sgrid">${items.map(d => {
      const have = owns(d.id), on = have && S.yardDecor[d.id] !== false;
      const action = have
        ? `<button class="use ${on ? 'on' : ''}" data-yd="${d.id}">${on ? 'Guardar' : 'Poner'}</button>`
        : buyBtn('ydecor', d.id, d.price);
      return card(`<div class="prev"><svg viewBox="${d.box}">${d.svg}</svg></div>`, d.name, action, `<small>${esc(d.en)}</small>`, on);
    }).join('')}</div>`;
  }).join('');
  return `<p class="note">Las mascotas juegan con lo que pongas en sus espacios. Toca los objetos en "Juntos" para oír su nombre en inglés.</p>
    <h3>Abrir espacios</h3><div class="sgrid">${rooms}</div>${decor}`;
}

function renderShop(){
  $('#shopSeeds').textContent = S.seeds;
  $('#shop').innerHTML = `<div class="stabs">${Object.entries(TABS).map(([k, v]) =>
      `<button data-tab="${k}" class="${k === tab ? 'on' : ''}">${v}</button>`).join('')}</div>` +
    ({ pets: petsTab, room: roomTab, spaces: spacesTab }[tab])();

  $$('#shop .stabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; renderShop(); });
  $$('#shop .buy').forEach(b => b.onclick = () => {
    if (!b.dataset.c){ // confirmación
      $$('#shop .buy[data-c]').forEach(x => { delete x.dataset.c; x.textContent = '🌰 ' + x.dataset.price; });
      b.dataset.c = 1; b.textContent = '¿Comprar? 🌰 ' + b.dataset.price; return;
    }
    buy(b.dataset.kind, b.dataset.id, +b.dataset.price);
  });
  $$('#shop .use[data-slot]').forEach(b => b.onclick = () => {
    const slot = b.dataset.slot;
    S.decor[slot] = S.decor[slot] === b.dataset.id ? null : b.dataset.id;
    save(); renderShop();
  });
  $$('#shop .use[data-wall]').forEach(b => b.onclick = () => { S.wallTheme = b.dataset.wall; save(); renderShop(); });
  $$('#shop .use[data-yd]').forEach(b => b.onclick = () => {
    const id = b.dataset.yd; S.yardDecor[id] = S.yardDecor[id] === false; save(); renderShop();
  });
}

function buy(kind, id, price){
  if (!spend(price)) return toast('Te faltan semillas. ¡A estudiar! 📚');
  if (kind === 'pet'){
    S.unlocked.push(id); S.pet = id;
    toast(`🎉 ¡${PETS.find(x => x.id === id).name} llegó a la madriguera!`);
  } else if (kind === 'scene'){
    S.owned.push('scene_' + id);
    const s = SCENES.find(x => x.id === id);
    toast(`${s.ico} ¡Abriste ${s.name}! Lleva mascotas desde "Juntos".`);
  } else {
    S.owned.push(id);
    if (kind === 'decor') S.decor[decorDef(id).slot] = id;
    if (kind === 'wall') S.wallTheme = id;
    if (kind === 'ydecor') S.yardDecor[id] = true;
    toast(kind === 'ydecor' ? '¡Listo! Ya está en su espacio 🌳' : '¡Listo! Ya está en tu cuarto 🏠');
  }
  save(); renderTop(); renderShop();
}
register('shop', renderShop);
