/* =====================================================================
   ESPACIOS COMUNES — escenarios donde conviven todas las mascotas.
   Cada escenario es un SVG de 400×440. Los elementos con class="obj" se
   pueden tocar: dicen su nombre en inglés (data-en) y español (data-es).
   floor: franja vertical (en %) por donde caminan las mascotas.
   ===================================================================== */
const obj = (en, es, body) => `<g class="obj" data-en="${en}" data-es="${es}">${body}</g>`;

export const SCENES = [
 { id:'patio', name:'Patio', ico:'🌳', floor:[60, 93], svg: night => `
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="${night ? '#1f2a52' : '#9fd3ee'}"/><stop offset="1" stop-color="${night ? '#3b4a7a' : '#e3f4fb'}"/></linearGradient></defs>
  ${obj('sky', 'cielo', `<rect width="400" height="250" fill="url(#sky)"/>`)}
  ${night
    ? obj('moon', 'luna', `<circle cx="320" cy="62" r="26" fill="#fff4c2"/><circle cx="332" cy="54" r="22" fill="#2a3763"/>`)
      + [[60,40],[150,70],[230,30],[370,110],[110,120]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('')
    : obj('sun', 'sol', `<circle cx="320" cy="62" r="28" fill="#ffd35a"/><circle cx="320" cy="62" r="40" fill="#ffd35a" opacity=".25"/>`)
      + obj('cloud', 'nube', `<g fill="#fff" opacity=".9"><ellipse cx="120" cy="60" rx="40" ry="16"/><ellipse cx="100" cy="52" rx="22" ry="16"/><ellipse cx="140" cy="48" rx="24" ry="18"/></g>`)}
  ${obj('house', 'casa', `<rect x="290" y="96" width="120" height="150" fill="#f1cf9f"/><path d="M276 104 L350 46 L420 104 Z" fill="#c25a30"/>`)}
  ${obj('window', 'ventana', `<rect x="312" y="122" width="44" height="40" rx="4" fill="${night ? '#ffe9a6' : '#bfe3f5'}" stroke="#9c6a44" stroke-width="5"/><path d="M334 122 V162 M312 142 H356" stroke="#9c6a44" stroke-width="3"/>`)}
  ${obj('door', 'puerta', `<rect x="364" y="170" width="34" height="76" rx="4" fill="#9c6a44"/><circle cx="371" cy="210" r="3" fill="#f4b63b"/>`)}
  ${obj('fence', 'cerca', `<g fill="#f4e6cf" stroke="#d9c4a2" stroke-width="2">
     <rect x="0" y="196" width="290" height="10"/><rect x="0" y="226" width="290" height="10"/>
     ${Array.from({length:10}, (_, i) => `<path d="M${6 + i*29} 250 V186 l10 -12 l10 12 V250 Z"/>`).join('')}</g>`)}
  ${obj('tree', 'árbol', `<rect x="34" y="120" width="26" height="130" rx="6" fill="#8e5a35"/>
     <g fill="#6f9a52"><circle cx="47" cy="98" r="48"/><circle cx="12" cy="128" r="30"/><circle cx="88" cy="124" r="32"/></g>
     <g fill="#e3794a"><circle cx="30" cy="92" r="6"/><circle cx="66" cy="110" r="6"/><circle cx="50" cy="70" r="6"/></g>`)}
  ${obj('grass', 'pasto', `<rect y="246" width="400" height="194" fill="#9bc46a"/>
     <g stroke="#86b157" stroke-width="3" stroke-linecap="round">${Array.from({length:26}, (_, i) => `<path d="M${(i * 53) % 400} ${270 + (i * 37) % 160} l3 -8"/>`).join('')}</g>`)}
  ${obj('flower', 'flor', [[30,300,'#f3a7b8'],[372,286,'#f4b63b'],[18,402,'#fff'],[384,410,'#f3a7b8']].map(([x,y,c]) =>
     `<path d="M${x} ${y+16} v-14" stroke="#5e8c45" stroke-width="3"/><g fill="${c}"><circle cx="${x-5}" cy="${y}" r="5"/><circle cx="${x+5}" cy="${y}" r="5"/><circle cx="${x}" cy="${y-5}" r="5"/><circle cx="${x}" cy="${y+5}" r="5"/></g><circle cx="${x}" cy="${y}" r="3.5" fill="#e3794a"/>`).join(''))}
  ${obj('carrot', 'zanahoria', `<path d="M196 258 l8 30 l8 -30 z" fill="#e3794a"/><path d="M204 258 l-6 -10 M204 258 l0 -12 M204 258 l6 -10" stroke="#6f9a52" stroke-width="3" stroke-linecap="round"/>`)}
 `},
 { id:'living', name:'Sala', ico:'🛋️', floor:[64, 93], svg: night => `
  ${obj('wall', 'pared', `<rect width="400" height="270" fill="#f6e3cc"/><rect y="200" width="400" height="70" fill="#ead2b4"/><rect y="196" width="400" height="6" fill="#d9b48a"/>`)}
  ${obj('window', 'ventana', `<rect x="148" y="34" width="104" height="96" rx="6" fill="${night ? '#2a3763' : '#bfe3f5'}" stroke="#9c6a44" stroke-width="7"/><path d="M200 34 V130 M148 82 H252" stroke="#9c6a44" stroke-width="4"/>`)}
  ${obj('curtain', 'cortina', `<path d="M132 26 h28 q-6 60 4 118 h-32 z M240 26 h28 v118 h-32 q10 -58 4 -118 z" fill="#f3a7b8"/>`)}
  ${obj('clock', 'reloj', `<circle cx="324" cy="74" r="26" fill="#fffaf0" stroke="#9c6a44" stroke-width="5"/><path d="M324 74 V58 M324 74 l12 6" stroke="#3a271b" stroke-width="3" stroke-linecap="round"/>`)}
  ${obj('picture', 'cuadro', `<rect x="34" y="50" width="66" height="52" rx="4" fill="#a7d6ea" stroke="#b07a52" stroke-width="5"/><path d="M40 96 l18 -22 l14 14 l10 -10 l14 18 z" fill="#6f9a52"/>`)}
  ${obj('sofa', 'sofá', `<rect x="18" y="168" width="150" height="70" rx="20" fill="#6f9a52"/><rect x="30" y="146" width="126" height="50" rx="16" fill="#86b157"/><rect x="8" y="180" width="30" height="62" rx="12" fill="#5e8c45"/><rect x="148" y="180" width="30" height="62" rx="12" fill="#5e8c45"/>
     <rect x="50" y="160" width="32" height="26" rx="8" fill="#f4b63b"/>`)}
  ${obj('lamp', 'lámpara', `<path d="M346 266 V150" stroke="#3a271b" stroke-width="5"/><path d="M322 150 h48 l-10 -36 h-28 z" fill="${night ? '#ffe9a6' : '#f4b63b'}"/><ellipse cx="346" cy="268" rx="20" ry="6" fill="#3a271b"/>
     ${night ? '<ellipse cx="346" cy="200" rx="70" ry="90" fill="#ffe9a6" opacity=".18"/>' : ''}`)}
  ${obj('plant', 'planta', `<path d="M262 226 C240 210 238 182 248 176 C258 188 262 206 262 226 Z M262 226 C284 210 288 182 276 176 C268 190 264 206 262 226 Z" fill="#6f9a52"/><path d="M246 222 h32 l-5 44 h-22 z" fill="#e3794a"/>`)}
  ${obj('floor', 'piso', `<rect y="268" width="400" height="172" fill="#b67a4b"/>${Array.from({length:10}, (_, i) => `<path d="M${i*40} 268 V440" stroke="#a86d41" stroke-width="2"/>`).join('')}`)}
  ${obj('rug', 'tapete', `<ellipse cx="200" cy="360" rx="170" ry="54" fill="#e3794a" opacity=".85"/><ellipse cx="200" cy="360" rx="140" ry="38" fill="none" stroke="#fff6e8" stroke-width="4" stroke-dasharray="10 8"/>`)}
  ${obj('book', 'libro', `<rect x="20" y="404" width="34" height="10" rx="2" fill="#a7d6ea"/><rect x="24" y="394" width="30" height="10" rx="2" fill="#f3a7b8"/>`)}
 `},
 { id:'kitchen', name:'Cocina', ico:'🍳', floor:[64, 93], svg: night => `
  ${obj('wall', 'pared', `<rect width="400" height="270" fill="#e8f4ec"/>
     <g fill="#d3ebdc">${Array.from({length:40}, (_, i) => (i % 2 ? '' : `<rect x="${(i % 10) * 40}" y="${110 + Math.floor(i / 10) * 20}" width="40" height="20"/>`)).join('')}</g>`)}
  ${obj('window', 'ventana', `<rect x="40" y="26" width="90" height="70" rx="6" fill="${night ? '#2a3763' : '#bfe3f5'}" stroke="#fffaf0" stroke-width="7"/><path d="M85 26 V96" stroke="#fffaf0" stroke-width="4"/>`)}
  ${obj('cup', 'taza', `<rect x="160" y="70" width="22" height="22" rx="4" fill="#f3a7b8"/><path d="M182 76 q10 4 0 12" fill="none" stroke="#f3a7b8" stroke-width="3"/>`)}
  ${obj('shelf', 'repisa', `<rect x="150" y="92" width="110" height="7" rx="2" fill="#9c6a44"/>`)}
  ${obj('plate', 'plato', `<circle cx="224" cy="78" r="14" fill="#fffaf0" stroke="#a7d6ea" stroke-width="3"/>`)}
  ${obj('stove', 'estufa', `<rect x="20" y="176" width="110" height="94" rx="6" fill="#f4f2ef" stroke="#c9c0b4" stroke-width="3"/><rect x="20" y="168" width="110" height="12" rx="3" fill="#3a271b"/><rect x="36" y="198" width="78" height="50" rx="6" fill="#3a271b" opacity=".8"/>`)}
  ${obj('pot', 'olla', `<rect x="44" y="144" width="56" height="26" rx="6" fill="#c25a30"/><rect x="40" y="140" width="64" height="6" rx="3" fill="#9c4a24"/>`)}
  ${obj('fridge', 'refrigerador', `<rect x="300" y="60" width="86" height="210" rx="10" fill="#fffaf0" stroke="#c9c0b4" stroke-width="3"/><path d="M300 132 H386" stroke="#c9c0b4" stroke-width="3"/><rect x="312" y="92" width="6" height="26" rx="3" fill="#c9c0b4"/><rect x="312" y="148" width="6" height="36" rx="3" fill="#c9c0b4"/>
     <circle cx="350" cy="96" r="7" fill="#f4b63b"/><circle cx="366" cy="104" r="6" fill="#f3a7b8"/>`)}
  ${obj('table', 'mesa', `<rect x="150" y="196" width="130" height="12" rx="4" fill="#c98a5a"/><rect x="162" y="208" width="10" height="62" fill="#9c6a44"/><rect x="258" y="208" width="10" height="62" fill="#9c6a44"/>`)}
  ${obj('cheese', 'queso', `<path d="M166 194 l40 -18 l12 18 z" fill="#f4b63b"/><circle cx="190" cy="189" r="3" fill="#d99a1e"/>`)}
  ${obj('apple', 'manzana', `<circle cx="244" cy="184" r="11" fill="#d8534e"/><path d="M244 173 q2 -6 6 -6" stroke="#6f9a52" stroke-width="3" fill="none"/>`)}
  ${obj('floor', 'piso', `<rect y="268" width="400" height="172" fill="#f1e2c8"/>
     <g fill="#e2cda8">${Array.from({length:40}, (_, i) => ((i + Math.floor(i / 10)) % 2 ? `<rect x="${(i % 10) * 40}" y="${268 + Math.floor(i / 10) * 43}" width="40" height="43"/>` : '')).join('')}</g>`)}
  ${obj('water', 'agua', `<ellipse cx="350" cy="412" rx="24" ry="9" fill="#a7d6ea" stroke="#7fb7cf" stroke-width="3"/>`)}
 `},
 { id:'bedroom', name:'Recámara', ico:'🛏️', price:50, floor:[66, 93], svg: night => `
  ${obj('wall', 'pared', `<rect width="400" height="270" fill="#ece3f7"/><rect y="206" width="400" height="64" fill="#ddd0ef"/><rect y="202" width="400" height="6" fill="#c8b6e2"/>`)}
  ${obj('window', 'ventana', `<rect x="168" y="40" width="70" height="80" rx="35" fill="${night ? '#2a3763' : '#bfe3f5'}" stroke="#fffaf0" stroke-width="7"/><path d="M203 40 V120" stroke="#fffaf0" stroke-width="4"/>
     ${night ? '<circle cx="222" cy="66" r="9" fill="#fff4c2"/>' : ''}`)}
  ${obj('mirror', 'espejo', `<ellipse cx="270" cy="96" rx="20" ry="28" fill="#dff0f7" stroke="#d9b48a" stroke-width="5"/><path d="M262 84 l10 -10" stroke="#fff" stroke-width="3"/>`)}
  ${obj('closet', 'clóset', `<rect x="300" y="66" width="92" height="204" rx="8" fill="#d9a36f"/><path d="M346 72 V264" stroke="#b9834f" stroke-width="3"/><circle cx="338" cy="168" r="4" fill="#7f5435"/><circle cx="354" cy="168" r="4" fill="#7f5435"/>`)}
  ${obj('bed', 'cama', `<rect x="14" y="146" width="44" height="124" rx="10" fill="#b07a52"/><rect x="40" y="196" width="196" height="58" rx="12" fill="#fffaf0"/>
     <rect x="94" y="200" width="142" height="54" rx="10" fill="#f3a7b8"/><path d="M110 210 h110 M110 226 h110 M110 242 h110" stroke="#fff" stroke-width="3" opacity=".6"/><rect x="226" y="236" width="12" height="34" fill="#b07a52"/>`)}
  ${obj('pillow', 'almohada', `<rect x="54" y="180" width="54" height="30" rx="14" fill="#fff" stroke="#e8dcd0" stroke-width="2"/>`)}
  ${obj('nightstand', 'buró', `<rect x="244" y="214" width="46" height="56" rx="5" fill="#c98a5a"/><path d="M244 240 h46" stroke="#9c6a44" stroke-width="2"/><circle cx="267" cy="230" r="3" fill="#7f5435"/>`)}
  ${obj('lamp', 'lámpara', `<path d="M267 214 V196" stroke="#7f5435" stroke-width="4"/><path d="M254 196 h26 l-6 -20 h-14 z" fill="${night ? '#ffe9a6' : '#a7d6ea'}"/>`)}
  ${obj('floor', 'piso', `<rect y="268" width="400" height="172" fill="#c99a6e"/>${Array.from({length:10}, (_, i) => `<path d="M${i*40} 268 V440" stroke="#b9875c" stroke-width="2"/>`).join('')}`)}
  ${obj('rug', 'tapete', `<ellipse cx="190" cy="350" rx="150" ry="44" fill="#b48ad6" opacity=".8"/><ellipse cx="190" cy="350" rx="120" ry="30" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 8"/>`)}
  ${obj('slippers', 'pantuflas', `<ellipse cx="66" cy="300" rx="16" ry="8" fill="#f3a7b8"/><ellipse cx="96" cy="304" rx="16" ry="8" fill="#f3a7b8"/>`)}
 `},
 { id:'garden', name:'Huerto', ico:'🥕', price:80, floor:[70, 94], svg: night => `
  ${obj('sky', 'cielo', `<rect width="400" height="210" fill="${night ? '#2a3763' : '#bfe3f5'}"/>`)}
  ${night ? obj('moon', 'luna', `<circle cx="70" cy="56" r="20" fill="#fff4c2"/>`) : obj('sun', 'sol', `<circle cx="70" cy="56" r="24" fill="#ffd35a"/>`)}
  ${obj('hill', 'colina', `<ellipse cx="300" cy="230" rx="220" ry="80" fill="#86b157"/><ellipse cx="60" cy="236" rx="160" ry="60" fill="#9bc46a"/>`)}
  ${obj('fence', 'cerca', `<g fill="#c98a5a"><rect y="184" width="400" height="8"/><rect y="204" width="400" height="8"/>${Array.from({length:9}, (_, i) => `<rect x="${10 + i*48}" y="172" width="10" height="50"/>`).join('')}</g>`)}
  ${obj('soil', 'tierra', `<rect y="222" width="400" height="90" fill="#8e5a35"/><g fill="#7a4c2c">${[236,262,288].map(y => `<rect x="0" y="${y}" width="400" height="10" rx="5"/>`).join('')}</g>`)}
  ${obj('carrot', 'zanahoria', [40,84,128].map(x => `<path d="M${x} 244 l-6 -16 M${x} 244 l0 -18 M${x} 244 l6 -16" stroke="#6f9a52" stroke-width="4" stroke-linecap="round"/><path d="M${x-7} 244 h14 l-7 10 z" fill="#e3794a"/>`).join(''))}
  ${obj('lettuce', 'lechuga', [200,248].map(x => `<g fill="#9bc46a"><circle cx="${x}" cy="262" r="16"/><circle cx="${x-10}" cy="266" r="11" fill="#86b157"/><circle cx="${x+10}" cy="266" r="11" fill="#86b157"/></g>`).join(''))}
  ${obj('tomato', 'jitomate', [312,358].map(x => `<path d="M${x} 296 V256" stroke="#5e8c45" stroke-width="4"/><circle cx="${x-8}" cy="270" r="8" fill="#d8534e"/><circle cx="${x+7}" cy="282" r="8" fill="#d8534e"/>`).join(''))}
  ${obj('strawberry', 'fresa', [56,100,144].map(x => `<path d="M${x} 292 q-9 2 -6 12 q6 10 12 0 q3 -10 -6 -12z" fill="#d8534e"/><path d="M${x-5} 291 h10" stroke="#6f9a52" stroke-width="3"/>`).join(''))}
  ${obj('grass', 'pasto', `<rect y="310" width="400" height="130" fill="#9bc46a"/><rect y="330" width="400" height="70" fill="#d9b48a" opacity=".5"/>`)}
  ${obj('watering can', 'regadera', `<path d="M346 412 h40 v-30 h-40 z" fill="#a7d6ea"/><path d="M346 392 l-22 -14" stroke="#a7d6ea" stroke-width="6" stroke-linecap="round"/><path d="M356 382 q10 -16 20 0" fill="none" stroke="#7fb7cf" stroke-width="4"/>`)}
 `},
];

/* =====================================================================
   DECORACIÓN DE LOS ESPACIOS COMUNES (se compra en la tienda).
   Cada objeto: escenario, precio, palabra en inglés/español (se puede tocar),
   dibujo en coordenadas del escenario (400×440), box = recorte para la vista
   previa en la tienda, spot = lugar (en %) al que las mascotas van a jugar.
   ===================================================================== */
export const YARD_DECOR = [
 // Patio
 {id:'y_swing', scene:'patio', name:'Columpio', price:30, en:'swing', es:'columpio', box:'50 120 90 140', spot:[24, 64],
  svg:`<path d="M72 140 V232 M108 140 V232" stroke="#7f5435" stroke-width="3"/><rect x="64" y="230" width="52" height="9" rx="3" fill="#e3794a"/>`},
 {id:'y_pool', scene:'patio', name:'Alberca inflable', price:35, en:'pool', es:'alberca', box:'240 300 130 70', spot:[74, 78],
  svg:`<ellipse cx="304" cy="336" rx="58" ry="22" fill="#f3a7b8"/><ellipse cx="304" cy="334" rx="46" ry="14" fill="#a7d6ea"/><path d="M280 332 q8 -4 16 0 M308 336 q8 -4 16 0" stroke="#fff" stroke-width="2" fill="none"/>`},
 {id:'y_birdhouse', scene:'patio', name:'Casita de pájaros', price:20, en:'birdhouse', es:'casita de pájaros', box:'225 120 50 140', spot:null,
  svg:`<rect x="247" y="170" width="6" height="86" fill="#9c6a44"/><rect x="234" y="148" width="32" height="28" fill="#f4b63b"/><path d="M228 150 L250 128 L272 150 Z" fill="#c25a30"/><circle cx="250" cy="162" r="5" fill="#3a271b"/>`},
 {id:'y_ball', scene:'patio', name:'Pelota', price:10, en:'ball', es:'pelota', box:'100 360 60 50', spot:[33, 88],
  svg:`<circle cx="130" cy="388" r="15" fill="#fff"/><path d="M115 388 a15 15 0 0 1 30 0 z" fill="#d8534e"/><path d="M130 373 v30" stroke="#a7d6ea" stroke-width="5"/>`},
 // Sala
 {id:'y_tv', scene:'living', name:'Televisión', price:40, en:'television', es:'televisión', box:'262 118 70 60', spot:null,
  svg:`<rect x="272" y="128" width="52" height="36" rx="4" fill="#3a271b"/><rect x="276" y="132" width="44" height="28" rx="2" fill="#a7d6ea"/><path d="M286 154 l10 -12 l8 8 l6 -6 l8 10 z" fill="#6f9a52"/>`},
 {id:'y_guitar', scene:'living', name:'Guitarra', price:30, en:'guitar', es:'guitarra', box:'180 170 60 110', spot:null,
  svg:`<path d="M206 184 V226" stroke="#7f5435" stroke-width="6"/><ellipse cx="206" cy="246" rx="17" ry="20" fill="#e3794a"/><ellipse cx="206" cy="232" rx="12" ry="12" fill="#e3794a"/><circle cx="206" cy="244" r="5" fill="#3a271b"/>`},
 {id:'y_fishbowl', scene:'living', name:'Pecera', price:25, en:'fishbowl', es:'pecera', box:'320 360 70 60', spot:[84, 90],
  svg:`<circle cx="354" cy="390" r="22" fill="#bfe3f5" stroke="#7fb7cf" stroke-width="3"/><path d="M346 392 q8 -8 14 0 q-6 8 -14 0 l-6 -5 v10 z" fill="#f4b63b"/>`},
 // Cocina
 {id:'y_cake', scene:'kitchen', name:'Pastel', price:20, en:'cake', es:'pastel', box:'312 22 64 44', spot:null,
  svg:`<rect x="322" y="40" width="44" height="20" rx="4" fill="#f3a7b8"/><rect x="322" y="36" width="44" height="8" rx="4" fill="#fffaf0"/><path d="M344 36 v-10" stroke="#f4b63b" stroke-width="3"/><circle cx="344" cy="24" r="3" fill="#e3794a"/>`},
 {id:'y_cookies', scene:'kitchen', name:'Galletas', price:15, en:'cookies', es:'galletas', box:'30 390 70 40', spot:[16, 90],
  svg:`<ellipse cx="62" cy="412" rx="28" ry="8" fill="#fffaf0" stroke="#a7d6ea" stroke-width="2"/>${[[50,404],[64,400],[76,406]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#d9a36f"/><circle cx="${x-2}" cy="${y-2}" r="1.6" fill="#7f5435"/>`).join('')}`},
 {id:'y_vase', scene:'kitchen', name:'Florero', price:15, en:'vase', es:'florero', box:'62 50 50 56', spot:null,
  svg:`<path d="M78 94 h18 l-3 -18 h-12 z" fill="#a7d6ea"/><circle cx="80" cy="66" r="6" fill="#f3a7b8"/><circle cx="92" cy="62" r="6" fill="#f4b63b"/><circle cx="87" cy="72" r="5" fill="#fff"/>`},
 // Recámara
 {id:'y_teddy', scene:'bedroom', name:'Oso de peluche', price:20, en:'teddy bear', es:'oso de peluche', box:'140 160 60 60', spot:null,
  svg:`<circle cx="160" cy="176" r="7" fill="#b07a52"/><circle cx="184" cy="176" r="7" fill="#b07a52"/><circle cx="172" cy="188" r="14" fill="#c98a5a"/><ellipse cx="172" cy="208" rx="16" ry="12" fill="#c98a5a"/><circle cx="167" cy="186" r="2" fill="#3a271b"/><circle cx="177" cy="186" r="2" fill="#3a271b"/><ellipse cx="172" cy="193" rx="5" ry="3" fill="#f3dcc0"/>`},
 {id:'y_stars', scene:'bedroom', name:'Estrellas que brillan', price:25, en:'stars', es:'estrellas', box:'20 10 280 70', spot:null,
  svg:`<g fill="#f4b63b">${[[40,30],[96,52],[134,22],[250,30],[290,56],[330,24],[370,44]].map(([x,y]) => `<path class="twinkle" d="M${x} ${y-8} l2.4 5.6 6 .6 -4.6 4 1.4 6 -5.2 -3.2 -5.2 3.2 1.4 -6 -4.6 -4 6 -.6z"/>`).join('')}</g>`},
 {id:'y_balloons', scene:'bedroom', name:'Globos', price:20, en:'balloons', es:'globos', box:'270 10 60 220', spot:null,
  svg:`<path d="M296 214 q-6 -60 -12 -130 M296 214 q2 -70 8 -150 M296 214 q8 -60 18 -110" stroke="#7f5435" stroke-width="1.5" fill="none"/><ellipse cx="284" cy="70" rx="16" ry="20" fill="#f3a7b8"/><ellipse cx="306" cy="48" rx="16" ry="20" fill="#a7d6ea"/><ellipse cx="316" cy="96" rx="15" ry="19" fill="#f4b63b"/>`},
 // Huerto
 {id:'y_scarecrow', scene:'garden', name:'Espantapájaros', price:35, en:'scarecrow', es:'espantapájaros', box:'340 110 60 160', spot:null,
  svg:`<path d="M370 270 V140 M344 172 H396" stroke="#7f5435" stroke-width="5"/><circle cx="370" cy="138" r="14" fill="#f3dcc0"/><path d="M352 130 h36 l-6 -16 h-24 z" fill="#c25a30"/><rect x="354" y="160" width="32" height="40" rx="4" fill="#6f9a52"/><circle cx="365" cy="138" r="2" fill="#3a271b"/><circle cx="375" cy="138" r="2" fill="#3a271b"/>`},
 {id:'y_sunflower', scene:'garden', name:'Girasol', price:15, en:'sunflower', es:'girasol', box:'0 90 60 150', spot:null,
  svg:`<path d="M28 236 V118" stroke="#5e8c45" stroke-width="5"/><path d="M28 180 q-16 -6 -20 -18 q14 0 20 18" fill="#6f9a52"/><g fill="#f4b63b">${Array.from({length:12}, (_, i) => { const a = i / 12 * Math.PI * 2; return `<ellipse cx="${(28 + Math.cos(a) * 15).toFixed(1)}" cy="${(110 + Math.sin(a) * 15).toFixed(1)}" rx="7" ry="4" transform="rotate(${i * 30} ${(28 + Math.cos(a) * 15).toFixed(1)} ${(110 + Math.sin(a) * 15).toFixed(1)})"/>`; }).join('')}</g><circle cx="28" cy="110" r="10" fill="#7f5435"/>`},
 {id:'y_wheelbarrow', scene:'garden', name:'Carretilla', price:25, en:'wheelbarrow', es:'carretilla', box:'90 360 120 70', spot:[38, 88],
  svg:`<path d="M110 380 h70 l-10 24 h-50 z" fill="#d8534e"/><circle cx="150" cy="414" r="10" fill="#3a271b"/><path d="M180 384 l24 -6 M112 404 l-6 14" stroke="#7f5435" stroke-width="4" stroke-linecap="round"/><g fill="#e3794a"><path d="M126 380 l6 -12 l6 12z"/><path d="M146 380 l6 -12 l6 12z"/></g>`},
];
export const sceneDef = id => SCENES.find(s => s.id === id);

/** Frases que dicen las mascotas al tocarlas (inglés / español). */
export const PHRASES = {
  all: [
    ['Hi there!', '¡Hola!'], ['I love you!', '¡Te quiero!'], ["Let's play!", '¡Vamos a jugar!'],
    ['I am happy.', 'Estoy feliz.'], ['Look at me!', '¡Mírame!'], ['This is fun!', '¡Esto es divertido!'],
    ['Where is my seed?', '¿Dónde está mi semilla?'], ['I am hungry.', 'Tengo hambre.'], ['You are my favorite person.', 'Eres mi persona favorita.'],
  ],
  night: [['I am sleepy.', 'Tengo sueño.'], ['Good night!', '¡Buenas noches!']],
  rat: [['Rats are very smart.', 'Las ratas somos muy listas.'], ['I like cheese.', 'Me gusta el queso.'], ['Can I sleep in the hammock?', '¿Puedo dormir en la hamaca?']],
  rabbit: [['I like carrots!', '¡Me gustan las zanahorias!'], ['I can jump very high.', 'Puedo saltar muy alto.']],
  guinea: [['Wheek! Wheek!', '¡Uiik! ¡Uiik!'], ['I want vegetables, please.', 'Quiero verduras, por favor.']],
  other: [['My cheeks are full!', '¡Tengo los cachetes llenos!'], ['I run very fast.', 'Corro muy rápido.']],
};
