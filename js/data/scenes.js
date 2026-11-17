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
];

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
