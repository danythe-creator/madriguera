// ROEDORES: colección de mascotas (ratas primero), elegir quién vive en casa y ponerles nombre.
import { $, $$, esc, toast } from '../util.js';
import { S, save, petName, learnedCount } from '../state.js';
import { PETS, GROUPS, petDef, reqText } from '../data/config.js';
import { petSVG } from '../petsvg.js';
import { register, showView } from '../router.js';

/** Desbloquea las mascotas cuyo requisito ya se cumplió (las de la tienda se compran). */
export function checkUnlocks(){
  const learned = learnedCount();
  PETS.forEach(p => {
    if (S.unlocked.includes(p.id)) return;
    const r = p.req;
    const ok = (r.xp !== undefined && S.xp >= r.xp) || (r.streak && S.streak >= r.streak) || (r.learned && learned >= r.learned);
    if (ok){ S.unlocked.push(p.id); toast(`🎉 ¡${p.name} (${p.sp}) se unió a tu madriguera!`); }
  });
  save();
}

function card(p){
  const un = S.unlocked.includes(p.id), sel = S.pet === p.id;
  const btn = un
    ? `<button class="${sel ? 'sel' : ''}" data-p="${p.id}">${sel ? 'En casa' : 'Elegir'}</button>`
    : p.req.cost ? `<button class="goshop" data-shop="1">🛍️ 🌰 ${p.req.cost}</button>` : `<button disabled>🔒</button>`;
  return `<div class="pcard ${un ? '' : 'locked'}">
    ${un ? `<button class="rename" data-r="${p.id}" title="Cambiar nombre" aria-label="Cambiar nombre">✏️</button>` : ''}
    ${petSVG(p)}<b>${un ? esc(petName(p.id)) : '???'}</b>
    <small>${esc(p.sp)}<br>${un ? esc(p.desc || '') : esc(reqText(p))}</small>${btn}</div>`;
}

function renderPets(){
  const have = g => PETS.filter(p => p.group === g && S.unlocked.includes(p.id)).length;
  const total = g => PETS.filter(p => p.group === g).length;
  $('#pets').innerHTML = `<button class="cta together" id="btnTogether">🌳 Verlos a todos juntos</button>` +
    GROUPS.map(g => `<h3 class="ghead">${g.name} <span>${have(g.id)}/${total(g.id)}</span></h3>
    <div class="grid">${PETS.filter(p => p.group === g.id).map(card).join('')}</div>`).join('');
  $('#btnTogether').onclick = () => showView('yard');
  $$('.pcard button[data-p]').forEach(b => b.onclick = () => {
    S.pet = b.dataset.p; save(); renderPets(); toast(`${petName(S.pet)} ahora vive en la casa.`);
  });
  $$('.pcard .goshop').forEach(b => b.onclick = () => showView('shop'));
  $$('.pcard .rename').forEach(b => b.onclick = () => {
    const id = b.dataset.r, cur = petName(id);
    const n = prompt(`Nuevo nombre para ${cur}:`, cur);
    if (n === null) return;
    const clean = n.trim().slice(0, 16);
    if (!clean || clean === petDef(id).name) delete S.names[id]; else S.names[id] = clean;
    save(); renderPets();
  });
}
register('pets', renderPets);
