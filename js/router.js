// Cambio de vista. Cada vista se registra con su función de render.
import { $, $$ } from './util.js';

const renderers = {};
export const register = (name, fn) => { renderers[name] = fn; };

export function showView(v){
  $$('.view').forEach(x => x.classList.add('hidden'));
  $('#view-' + v).classList.remove('hidden');
  $$('nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('nav').classList.toggle('hidden', v === 'lesson');
  $('#view-' + v).scrollTop = 0;
  renderers[v]?.();
}
