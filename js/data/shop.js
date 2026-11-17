/* =====================================================================
   TIENDA — decoración del cuarto.
   Cada objeto ocupa una zona ("slot") del cuarto; solo uno por zona.
     wall  pared (arriba a la derecha)     hang  colgando del techo
     left  piso izquierdo                  right piso derecho
     rug   tapete bajo la mascota
   price 0 = viene incluido.
   ===================================================================== */
export const SLOTS = {
  hang: 'Colgante', wall: 'Pared', left: 'Piso · izquierda', right: 'Piso · derecha', rug: 'Tapete',
};

const svg = (vb, body) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

export const DECOR = [
 // ---- pared ----
 {id:'shelf', slot:'wall', name:'Repisa con libros', price:0,
  html:()=>'<div class="shelf"><b></b><b></b><b></b><b></b></div>'},
 {id:'poster', slot:'wall', name:'Póster "I ♥ cheese"', price:15, html:()=>svg('0 0 110 80',`
  <rect x="8" y="4" width="94" height="72" rx="6" fill="#fffaf0" stroke="#9c6a44" stroke-width="5"/>
  <path d="M30 52 l40 -18 l12 18 z" fill="#f4b63b"/><circle cx="52" cy="47" r="3" fill="#d99a1e"/><circle cx="66" cy="50" r="2.5" fill="#d99a1e"/>
  <text x="55" y="26" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#c25a30">I ♥ cheese</text>`)},
 {id:'lights', slot:'wall', name:'Foquitos', price:20, html:()=>svg('0 0 150 60',`
  <path d="M2 8 q36 30 73 4 q37 -26 73 4" fill="none" stroke="#5b4636" stroke-width="2"/>
  ${[[14,18,'#f3a7b8'],[34,27,'#f4b63b'],[56,25,'#a7d6ea'],[78,14,'#9bc46a'],[98,8,'#f3a7b8'],[118,12,'#f4b63b'],[138,20,'#a7d6ea']]
    .map(([x,y,c])=>`<ellipse class="bulb" cx="${x}" cy="${y+8}" rx="5" ry="7" fill="${c}"/>`).join('')}`)},
 {id:'frame', slot:'wall', name:'Cuadro de corazón', price:25, html:()=>svg('0 0 90 90',`
  <rect x="8" y="8" width="74" height="74" rx="8" fill="#ffe8c7" stroke="#b07a52" stroke-width="7"/>
  <path d="M45 66 C20 50 20 30 34 28 C40 27 44 31 45 35 C46 31 50 27 56 28 C70 30 70 50 45 66 Z" fill="#e3794a"/>`)},
 // ---- colgante ----
 {id:'hammock', slot:'hang', name:'Hamaca de rayas', price:30, html:()=>svg('0 0 140 90',`
  <path d="M12 0 L26 44 M128 0 L114 44" stroke="#7f5435" stroke-width="3"/>
  <path d="M20 42 Q70 96 120 42 Q70 62 20 42 Z" fill="#f3a7b8" stroke="#d27f93" stroke-width="2"/>
  <path d="M42 54 Q48 70 54 75 M70 56 V80 M98 54 Q92 70 86 75" stroke="#fff" stroke-width="5" opacity=".7"/>`)},
 {id:'pod', slot:'hang', name:'Nido colgante', price:40, html:()=>svg('0 0 100 110',`
  <path d="M50 0 V30" stroke="#7f5435" stroke-width="3"/>
  <circle cx="50" cy="66" r="38" fill="#a7d6ea" stroke="#7fb7cf" stroke-width="3"/>
  <ellipse cx="50" cy="72" rx="20" ry="17" fill="#3b4a7a"/>
  <path d="M18 54 q32 -16 64 0" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`)},
 {id:'bridge', slot:'hang', name:'Puente de madera', price:35, html:()=>svg('0 0 150 70',`
  <path d="M6 0 L14 40 M144 0 L136 40" stroke="#7f5435" stroke-width="3"/>
  ${Array.from({length:9},(_,i)=>`<rect x="${10+i*15}" y="${36+Math.sin(i/8*Math.PI)*16}" width="12" height="9" rx="2" fill="#c98a5a" stroke="#9c6a44"/>`).join('')}`)},
 // ---- piso izquierda ----
 {id:'house', slot:'left', name:'Casita de madera', price:25, html:()=>svg('0 0 110 100',`
  <path d="M8 46 L55 6 L102 46 Z" fill="#c25a30"/><rect x="16" y="44" width="78" height="54" rx="4" fill="#d9a36f"/>
  <path d="M16 58 H94 M16 72 H94 M16 86 H94" stroke="#b9834f" stroke-width="2"/>
  <path d="M40 98 V72 a15 15 0 0 1 30 0 V98 Z" fill="#3a271b"/>`)},
 {id:'tunnel', slot:'left', name:'Túnel de tela', price:20, html:()=>svg('0 0 130 80',`
  <path d="M6 78 V46 a38 38 0 0 1 76 0 V78 Z" fill="#b48ad6"/><path d="M82 78 V46 a20 38 0 0 1 40 0 V78 Z" fill="#9c6fc2"/>
  <ellipse cx="102" cy="62" rx="12" ry="16" fill="#3a271b"/>
  ${[[24,40],[44,30],[62,44],[30,62],[56,64]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".7"/>`).join('')}`)},
 {id:'plant', slot:'left', name:'Plantita', price:15, html:()=>svg('0 0 80 100',`
  <path d="M40 62 C10 50 8 20 18 14 C30 26 36 44 40 62 Z M40 62 C70 50 72 20 62 14 C50 26 44 44 40 62 Z M40 62 C34 34 40 10 40 4 C40 10 46 34 40 62 Z" fill="#6f9a52"/>
  <path d="M18 62 H62 L56 98 H24 Z" fill="#e3794a"/><rect x="14" y="58" width="52" height="10" rx="3" fill="#c25a30"/>`)},
 // ---- piso derecha ----
 {id:'wheel', slot:'right', name:'Rueda', price:0, html:()=>'<div class="wheel" id="wheel"></div>'},
 {id:'hay', slot:'right', name:'Montoncito de heno', price:10, html:()=>svg('0 0 110 60',`
  <path d="M4 58 Q20 10 55 8 Q92 10 106 58 Z" fill="#e8c35a"/>
  <g stroke="#c9a03a" stroke-width="2" fill="none">${[[20,50,36,22],[38,54,48,16],[60,56,58,14],[80,52,70,20],[94,54,86,30],[30,30,56,38],[60,26,84,40]].map(([a,b,c,d])=>`<path d="M${a} ${b} L${c} ${d}"/>`).join('')}</g>`)},
 {id:'tower', slot:'right', name:'Torre de juegos', price:35, html:()=>svg('0 0 90 120',`
  <rect x="14" y="4" width="10" height="114" fill="#9c6a44"/><rect x="66" y="4" width="10" height="114" fill="#9c6a44"/>
  <rect x="6" y="30" width="78" height="10" rx="3" fill="#d9a36f"/><rect x="6" y="74" width="78" height="10" rx="3" fill="#d9a36f"/>
  <path d="M30 74 L60 40" stroke="#c98a5a" stroke-width="6" stroke-linecap="round"/>
  <circle cx="45" cy="104" r="10" fill="#f3a7b8"/>`)},
 // ---- tapete ----
 {id:'rug_pink', slot:'rug', name:'Tapete rosa', price:15, html:()=>svg('0 0 200 40',`
  <ellipse cx="100" cy="20" rx="96" ry="17" fill="#f3a7b8"/><ellipse cx="100" cy="20" rx="80" ry="11" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>`)},
 {id:'rug_green', slot:'rug', name:'Tapete de pasto', price:15, html:()=>svg('0 0 200 40',`
  <ellipse cx="100" cy="20" rx="96" ry="17" fill="#8dbb62"/>
  <g stroke="#6f9a52" stroke-width="3" stroke-linecap="round">${Array.from({length:14},(_,i)=>`<path d="M${18+i*12} ${16+(i%3)*4} l2 -6"/>`).join('')}</g>`)},
 {id:'cushion', slot:'rug', name:'Cojín gigante', price:20, html:()=>svg('0 0 200 50',`
  <ellipse cx="100" cy="28" rx="96" ry="21" fill="#a7d6ea"/><ellipse cx="100" cy="24" rx="84" ry="15" fill="#c6e6f3"/>
  <circle cx="100" cy="24" r="4" fill="#7fb7cf"/>`)},
];

/** Colores de pared (temas). */
export const WALLS = [
  {id:'cream',    name:'Crema',    price:0,  a:'#f8e2bf', b:'#f1cf9f'},
  {id:'mint',     name:'Menta',    price:20, a:'#dff3e4', b:'#bfe3c8'},
  {id:'lavender', name:'Lavanda',  price:20, a:'#ece3f7', b:'#d6c6ee'},
  {id:'rose',     name:'Rosa',     price:20, a:'#fde4ea', b:'#f6c7d3'},
  {id:'sky',      name:'Cielo',    price:25, a:'#e2f1f8', b:'#bfdff0'},
];

export const decorDef = id => DECOR.find(d => d.id === id);
export const wallDef = id => WALLS.find(w => w.id === id) || WALLS[0];
