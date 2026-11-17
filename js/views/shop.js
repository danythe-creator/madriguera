// TIENDA: adoptar ratas, decorar el cuarto y cambiar el color de pared con semillas.
import { $, $$, esc, toast } from '../util.js';
import { S, save, spend } from '../state.js';
import { PETS } from '../data/config.js';
import { DECOR, WALLS, SLOTS, decorDef } from '../data/shop.js';
import { petSVG } from '../petsvg.js';
import { register } from '../router.js';
import { renderTop } from './home.js';

const owns = id => S.owned.includes(id);

/** Botón de compra: primer toque pide confirmar, el segundo compra. */
function buyBtn(kind, id, price){
  const can = S.seeds >= price;
  return `<button class="buy" data-kind="${kind}" data-id="${id}" data-price="${price}" ${can ? '' : 'disabled'}>🌰 ${price}</button>`;
}

function renderShop(){
  $('#shopSeeds').textContent = S.seeds;
  const pets = PETS.filter(p => p.req.cost);
  const petCards = pets.map(p => {
    const un = S.unlocked.includes(p.id);
    return `<div class="scard">
      <div class="prev pet">${petSVG(p)}</div><b>${esc(p.name)}</b><small>${esc(p.sp)}</small>
      ${un ? '<button class="owned" disabled>Adoptado ✓</button>' : buyBtn('pet', p.id, p.req.cost)}</div>`;
  }).join('');

  const decorBySlot = Object.entries(SLOTS).map(([slot, label]) => {
    const items = DECOR.filter(d => d.slot === slot).map(d => {
      const on = S.decor[slot] === d.id;
      const action = owns(d.id) || d.price === 0
        ? `<button class="use ${on ? 'on' : ''}" data-slot="${slot}" data-id="${d.id}">${on ? 'Quitar' : 'Usar'}</button>`
        : buyBtn('decor', d.id, d.price);
      return `<div class="scard ${on ? 'equipped' : ''}"><div class="prev">${d.html()}</div><b>${esc(d.name)}</b>${action}</div>`;
    }).join('');
    return `<h3>${label}</h3><div class="sgrid">${items}</div>`;
  }).join('');

  const walls = WALLS.map(w => {
    const on = S.wallTheme === w.id;
    const action = owns(w.id) || w.price === 0
      ? `<button class="use ${on ? 'on' : ''}" data-wall="${w.id}" ${on ? 'disabled' : ''}>${on ? 'En uso' : 'Usar'}</button>`
      : buyBtn('wall', w.id, w.price);
    return `<div class="scard ${on ? 'equipped' : ''}"><div class="swatch" style="background:linear-gradient(180deg,${w.a},${w.b})"></div><b>${esc(w.name)}</b>${action}</div>`;
  }).join('');

  $('#shop').innerHTML = `
    <h3>Adopción</h3><div class="sgrid">${petCards}</div>
    ${decorBySlot}
    <h3>Color de pared</h3><div class="sgrid">${walls}</div>`;

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
}

function buy(kind, id, price){
  if (!spend(price)) return toast('Te faltan semillas. ¡A estudiar! 📚');
  if (kind === 'pet'){
    S.unlocked.push(id); S.pet = id;
    const p = PETS.find(x => x.id === id);
    toast(`🎉 ¡${p.name} llegó a la madriguera!`);
  } else {
    S.owned.push(id);
    if (kind === 'decor') S.decor[decorDef(id).slot] = id;
    if (kind === 'wall') S.wallTheme = id;
    toast('¡Listo! Ya está en tu cuarto 🏠');
  }
  save(); renderTop(); renderShop();
}
register('shop', renderShop);
