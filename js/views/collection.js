// ROEDORES: colección de mascotas desbloqueables.
import { $, $$, esc, toast } from '../util.js';
import { S, save } from '../state.js';
import { PETS, petDef } from '../data/config.js';
import { PET_SVG } from '../petsvg.js';
import { register } from '../router.js';

export function checkUnlocks(){
  PETS.forEach(p => {
    if (S.unlocked.includes(p.id)) return;
    const ok = (p.req.xp !== undefined && S.xp >= p.req.xp) || (p.req.streak && S.streak >= p.req.streak);
    if (ok){ S.unlocked.push(p.id); toast(`🎉 ¡${p.name} (${p.sp}) se unió a tu madriguera!`); }
  });
  save();
}

function renderPets(){
  $('#pets').innerHTML = PETS.map(p => {
    const un = S.unlocked.includes(p.id), sel = S.pet === p.id;
    return `<div class="pcard ${un ? '' : 'locked'}">${PET_SVG[p.id]()}<b>${un ? esc(p.name) : '???'}</b>
      <small>${esc(p.sp)} · ${p.lvl}<br>${un ? '' : esc(p.hint)}</small>
      <button ${un ? '' : 'disabled'} class="${sel ? 'sel' : ''}" data-p="${p.id}">${sel ? 'En casa' : un ? 'Elegir' : '🔒'}</button></div>`;
  }).join('');
  $$('.pcard button').forEach(b => b.onclick = () => {
    S.pet = b.dataset.p; save(); renderPets(); toast(`${petDef(S.pet).name} ahora vive en la casa.`);
  });
}
register('pets', renderPets);
