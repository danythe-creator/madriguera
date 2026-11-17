// Ilustraciones SVG originales de las mascotas. Todas comparten clases (.body, .head, .eye, .tail, .earL, .earR) para que las animaciones CSS funcionen con cualquiera.

/** Mezcla dos colores hex: t=0 → a, t=1 → b. */
function mix(a, b, t){
  const p = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
  const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

function face(x, eyeY, c){ // ojos, cachetes, nariz, boca, bigotes
  return `
  <g class="eyes"><circle class="eye" cx="${x-18}" cy="${eyeY}" r="6" fill="${c.eye||'#2b1d16'}"/><circle class="eye" cx="${x+18}" cy="${eyeY}" r="6" fill="${c.eye||'#2b1d16'}"/>
   <circle cx="${x-16}" cy="${eyeY-2}" r="2" fill="#fff"/><circle cx="${x+20}" cy="${eyeY-2}" r="2" fill="#fff"/></g>
  <g class="eyes-closed" fill="none" stroke="#2b1d16" stroke-width="3" stroke-linecap="round"><path d="M${x-24} ${eyeY+2} q6 5 12 0"/><path d="M${x+12} ${eyeY+2} q6 5 12 0"/></g>
  <ellipse cx="${x-28}" cy="${eyeY+16}" rx="8" ry="5" fill="${c.blush}" opacity=".75"/><ellipse cx="${x+28}" cy="${eyeY+16}" rx="8" ry="5" fill="${c.blush}" opacity=".75"/>
  <ellipse cx="${x}" cy="${eyeY+18}" rx="6" ry="4.5" fill="${c.nose}"/>
  <path class="mouth" d="M${x-7} ${eyeY+26} q7 6 14 0" fill="none" stroke="#2b1d16" stroke-width="2.5" stroke-linecap="round"/>
  <g stroke="#2b1d16" stroke-width="1.5" opacity=".5" stroke-linecap="round">
   <path d="M${x-14} ${eyeY+18} l-26 -4"/><path d="M${x-14} ${eyeY+22} l-26 4"/><path d="M${x+14} ${eyeY+18} l26 -4"/><path d="M${x+14} ${eyeY+22} l26 4"/></g>`;
}
export const PET_SVG = {
 /* Rata con variantes: v = { pattern, fur, hood, point, eye, ears, rex }
    pattern: hooded | berkshire | solid | husky | siamese | albino
    ears: dumbo (a los lados) | top (arriba)     rex: pelo y bigotes rizados */
 rat(v = {}){
  const fur = v.fur || '#f7f2ea', hood = v.hood || '#b07a52', pt = v.pattern || 'hooded';
  const white = '#fbf8f4';
  const H = (pt === 'siamese' || pt === 'albino') ? fur : hood;            // cabeza
  const B = (pt === 'solid' || pt === 'berkshire') ? hood : fur;           // cuerpo
  const E = pt === 'siamese' ? v.point : H;                                // oreja (exterior)
  const S = pt === 'siamese' ? mix(v.point, fur, .3) : pt === 'husky' ? white : mix(H, '#ffffff', .18); // hocico
  const F = pt === 'siamese' ? mix(v.point, '#ffffff', .25) : '#f5b8bf';   // patitas
  const T = pt === 'siamese' ? '#c9a196' : '#eab0b0';                      // cola
  const c = { blush:'#f3a7b8', nose: pt === 'siamese' ? '#c98a8a' : '#e88aa0', eye: v.eye };
  const curl = mix(B, '#000000', .14);
  const ears = v.ears === 'top'
    ? `<g class="earL"><circle cx="64" cy="58" r="21" fill="${E}"/><circle cx="64" cy="58" r="13" fill="#f5b8bf"/></g>
       <g class="earR"><circle cx="136" cy="58" r="21" fill="${E}"/><circle cx="136" cy="58" r="13" fill="#f5b8bf"/></g>`
    : `<g class="earL"><circle cx="54" cy="84" r="25" fill="${E}"/><circle cx="54" cy="84" r="16" fill="#f5b8bf"/></g>
       <g class="earR"><circle cx="146" cy="84" r="25" fill="${E}"/><circle cx="146" cy="84" r="16" fill="#f5b8bf"/></g>`;
  const bodyMarks = {
    hooded: `<ellipse cx="100" cy="114" rx="44" ry="26" fill="${hood}"/><path d="M100 112 q-6 30 0 62 q6 -32 0 -62z" fill="${hood}" opacity=".85"/>`,
    berkshire: `<ellipse cx="100" cy="152" rx="40" ry="28" fill="${white}"/>`,
    husky: `<ellipse cx="100" cy="114" rx="40" ry="22" fill="${hood}" opacity=".55"/>` +
      [[62,132],[80,150],[128,136],[140,152],[110,160],[72,160],[138,122]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${hood}" opacity=".5"/>`).join(''),
    siamese: `<ellipse cx="100" cy="160" rx="52" ry="22" fill="${v.point}" opacity=".18"/>`,
  }[pt] || '';
  const spot = v.spot ? `<ellipse cx="100" cy="64" rx="8" ry="7" fill="#fffdf8"/>` : '';
  const headMarks = spot + (pt === 'hooded' ? `<path d="M100 54 q-7 18 0 34 q7 -16 0 -34z" fill="${fur}"/>`
    : pt === 'husky' ? `<path d="M100 52 q-16 30 -26 58 q26 14 52 0 q-10 -28 -26 -58z" fill="${white}"/>` : '');
  const rex = v.rex ? `<g fill="none" stroke="${curl}" stroke-width="2.5" stroke-linecap="round" opacity=".55">
      ${[[60,128],[84,118],[108,124],[132,120],[70,150],[96,146],[124,148],[146,138]].map(([x,y]) => `<path d="M${x} ${y} q4 -7 8 0 q4 7 8 0"/>`).join('')}</g>` : '';
  const rexHead = v.rex ? `<g fill="none" stroke="${mix(H,'#000000',.15)}" stroke-width="2.5" stroke-linecap="round" opacity=".6">
      <path d="M80 62 q4 -7 8 0 q4 7 8 0"/><path d="M104 60 q4 -7 8 0 q4 7 8 0"/></g>
      <g fill="none" stroke="#2b1d16" stroke-width="1.5" opacity=".45" stroke-linecap="round">
      <path d="M58 106 q-8 -8 -16 0 q-6 6 -12 0"/><path d="M142 106 q8 -8 16 0 q6 6 12 0"/></g>` : '';
  return `
  <svg class="pet" viewBox="0 0 200 200">
   <path class="tail" d="M152 162 q50 10 38 -38 q-6 -22 -24 -26" fill="none" stroke="${T}" stroke-width="9" stroke-linecap="round"/>
   <g class="body">
    <ellipse cx="100" cy="138" rx="66" ry="48" fill="${B}"/>
    ${bodyMarks}${rex}
    <ellipse cx="74" cy="182" rx="13" ry="7" fill="${F}"/><ellipse cx="126" cy="182" rx="13" ry="7" fill="${F}"/>
    <g class="head">
     ${ears}
     <ellipse cx="100" cy="90" rx="46" ry="38" fill="${H}"/>
     ${headMarks}
     <ellipse cx="100" cy="110" rx="27" ry="20" fill="${S}"/>
     ${face(100,86,c)}${rexHead}
    </g>
   </g></svg>`; },
 mouse(){ const c={fur:'#9c9cab',light:'#dedee6',blush:'#f3a7b8',nose:'#e88aa0',ear:'#f3a7b8'}; return `
  <svg class="pet" viewBox="0 0 200 200">
   <path class="tail" d="M150 150 q45 5 32 -45" fill="none" stroke="#d4a0a6" stroke-width="8" stroke-linecap="round"/>
   <g class="body">
    <ellipse cx="100" cy="132" rx="58" ry="50" fill="${c.fur}"/><ellipse cx="100" cy="146" rx="36" ry="28" fill="${c.light}"/>
    <ellipse cx="78" cy="176" rx="12" ry="7" fill="${c.ear}"/><ellipse cx="122" cy="176" rx="12" ry="7" fill="${c.ear}"/>
    <g class="head">
     <g class="earL"><circle cx="55" cy="66" r="27" fill="${c.fur}"/><circle cx="55" cy="66" r="16" fill="${c.ear}"/></g>
     <g class="earR"><circle cx="145" cy="66" r="27" fill="${c.fur}"/><circle cx="145" cy="66" r="16" fill="${c.ear}"/></g>
     <ellipse cx="100" cy="96" rx="48" ry="40" fill="${c.fur}"/>
     ${face(100,90,c)}
    </g>
   </g></svg>`; },
 /* Hámster con variantes: v = { pattern, fur, light, cheek, dark }
    pattern: syrian (sirio) | stripe (enano ruso, raya en la espalda) | robo (roborovski, cejas blancas)
             panda (blanco y negro) | teddy (pelo largo) */
 hamster(v = {}){
  const pt = v.pattern || 'syrian', fur = v.fur || '#e8a94a', light = v.light || '#fff1d6';
  const cheek = v.cheek || mix(fur, '#ffffff', .2), dark = v.dark || mix(fur, '#000000', .35), ear = v.ear || '#f5c98a';
  const c = { blush:'#f0a0a0', nose:'#d98585', eye: v.eye };
  const small = pt === 'robo' || pt === 'stripe';
  const head = pt === 'panda' ? light : fur;
  const fluff = pt === 'teddy'
    ? `<g fill="${mix(fur,'#000000',.06)}">${[[40,140],[44,166],[60,184],[140,184],[156,166],[160,140],[50,116],[150,116]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="16"/>`).join('')}</g>` : '';
  const fluffHead = pt === 'teddy'
    ? `<g fill="${mix(fur,'#000000',.06)}">${[[52,104],[54,122],[148,104],[146,122],[86,54],[100,50],[114,54]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="11"/>`).join('')}</g>` : '';
  const bodyMarks = pt === 'panda'
    ? `<path d="M38 128 q10 -34 62 -36 q52 2 62 36 q-12 18 -62 18 q-50 0 -62 -18z" fill="${fur}"/>`
    : pt === 'stripe' ? `<path d="M98 82 q-4 40 0 70 h4 q4 -30 0 -70z" fill="${dark}"/>` : '';
  const headMarks = pt === 'stripe'
    ? `<path d="M96 52 q4 -2 8 0 l-2 26 h-4 z" fill="${dark}"/>`
    : pt === 'robo' ? `<ellipse cx="80" cy="74" rx="9" ry="5" fill="#fffaf0"/><ellipse cx="120" cy="74" rx="9" ry="5" fill="#fffaf0"/>`
    : pt === 'panda' ? `<ellipse cx="68" cy="70" rx="16" ry="12" fill="${fur}" transform="rotate(-25 68 70)"/><ellipse cx="132" cy="70" rx="16" ry="12" fill="${fur}" transform="rotate(25 132 70)"/>` : '';
  const sc = small ? 'transform="translate(100 186) scale(.9) translate(-100 -186)"' : '';
  return `
  <svg class="pet" viewBox="0 0 200 200">
   <g class="body" ${sc}>
    ${fluff}
    <ellipse cx="100" cy="134" rx="64" ry="54" fill="${pt === 'panda' ? light : fur}"/>
    ${bodyMarks}
    <ellipse cx="100" cy="150" rx="${pt === 'robo' ? 46 : 42}" ry="${pt === 'robo' ? 34 : 32}" fill="${light}"/>
    <ellipse cx="76" cy="180" rx="13" ry="7" fill="${ear}"/><ellipse cx="124" cy="180" rx="13" ry="7" fill="${ear}"/>
    <g class="head">
     <g class="earL"><circle cx="62" cy="62" r="17" fill="${pt === 'panda' ? fur : head}"/><circle cx="62" cy="62" r="9" fill="${ear}"/></g>
     <g class="earR"><circle cx="138" cy="62" r="17" fill="${pt === 'panda' ? fur : head}"/><circle cx="138" cy="62" r="9" fill="${ear}"/></g>
     ${fluffHead}
     <ellipse cx="100" cy="96" rx="54" ry="44" fill="${head}"/>
     ${headMarks}
     <ellipse cx="66" cy="110" rx="20" ry="16" fill="${pt === 'panda' ? '#f4f0ea' : cheek}"/><ellipse cx="134" cy="110" rx="20" ry="16" fill="${pt === 'panda' ? '#f4f0ea' : cheek}"/>
     <ellipse cx="100" cy="112" rx="22" ry="16" fill="${light}"/>
     ${face(100,88,c)}
    </g>
   </g></svg>`; },
 /* Cuyo con variantes: v = { pattern, base, ear, spots:[color1,color2], hair }
    pattern: tricolor | abyssinian (remolinos) | peruvian (pelo largo) */
 guinea(v = {}){
  const base = v.base || '#8a5a3a', pt = v.pattern || 'self', ear = v.ear || '#c98a6a';
  const [s1, s2] = v.spots || ['#d98a3d', '#3d3532'];
  const c = { blush:'#f0a0a0', nose:'#d98585', eye: v.eye };
  const dark = mix(base, '#000000', .18);
  const bodyMarks = {
    tricolor: `<path d="M34 128 q10 -30 44 -28 q-6 30 6 60 q-34 6 -50 -32z" fill="${s1}"/>
               <path d="M124 104 q34 -4 44 26 q4 26 -20 40 q-8 -36 -24 -66z" fill="${s2}"/>`,
    abyssinian: [[50,124],[100,150],[150,124],[76,166],[126,166]].map(([x,y]) =>
      `<path d="M${x} ${y} m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -6 -9" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`).join(''),
    peruvian: '',
  }[pt] || '';
  // contorno "despeinado" para el abisinio
  const spiky = pt === 'abyssinian'
    ? `<path d="M30 136 l-8 -10 l12 -2 l-4 -14 l14 4 l2 -14 l12 10 l8 -12 l8 14 l12 -10 l4 14 l12 -8 l2 14 l14 -4 l-2 14 l12 4 l-8 12 l10 8 l-60 20 z" fill="${base}"/>` : '';
  const longHair = pt === 'peruvian'
    ? `<path d="M30 120 q-10 40 -2 74 q10 -8 16 2 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q8 -10 16 0 q6 -10 14 -2 q8 -34 -2 -74 z" fill="${base}"/>
       <g stroke="${dark}" stroke-width="2" opacity=".45" fill="none" stroke-linecap="round">
        <path d="M46 130 q-4 30 2 58"/><path d="M70 136 q-2 28 2 52"/><path d="M100 140 v48"/><path d="M130 136 q2 28 -2 52"/><path d="M154 130 q4 30 -2 58"/></g>` : '';
  const headMarks = pt === 'tricolor'
    ? `<path d="M48 92 q2 -34 38 -38 q-4 24 -20 50 q-12 0 -18 -12z" fill="${s1}"/><path d="M118 56 q30 4 34 34 q-14 4 -26 -6 q-8 -14 -8 -28z" fill="${s2}"/>`
    : pt === 'abyssinian' ? `<path d="M76 62 l6 -14 l8 10 l10 -14 l10 14 l8 -10 l6 14 z" fill="${base}"/><path d="M100 62 m-8 0 a8 8 0 1 1 8 8" fill="none" stroke="${dark}" stroke-width="3" opacity=".6"/>`
    : pt === 'peruvian' ? `<path d="M50 84 q10 -34 50 -34 q40 0 50 34 q-12 -10 -24 -6 q-8 -10 -26 -8 q-18 -2 -26 8 q-12 -4 -24 6z" fill="${mix(base,'#ffffff',.12)}"/>`
    : `<path d="M100 56 q-30 0 -42 30 q10 -8 42 -8 z" fill="${v.light || '#f6ead8'}"/>`;
  return `
  <svg class="pet" viewBox="0 0 200 200">
   <defs><clipPath id="gpBody"><ellipse cx="100" cy="136" rx="70" ry="50"/></clipPath><clipPath id="gpHead"><ellipse cx="100" cy="98" rx="52" ry="42"/></clipPath></defs>
   <g class="body">
    ${spiky}
    <ellipse cx="100" cy="136" rx="70" ry="50" fill="${base}" stroke="${dark}" stroke-opacity=".12" stroke-width="2"/>
    <g clip-path="url(#gpBody)">${bodyMarks}</g>${longHair}
    <ellipse cx="72" cy="184" rx="12" ry="6" fill="${ear}"/><ellipse cx="128" cy="184" rx="12" ry="6" fill="${ear}"/>
    <g class="head">
     <g class="earL"><ellipse cx="56" cy="74" rx="15" ry="10" fill="${ear}" transform="rotate(-25 56 74)"/></g>
     <g class="earR"><ellipse cx="144" cy="74" rx="15" ry="10" fill="${ear}" transform="rotate(25 144 74)"/></g>
     <ellipse cx="100" cy="98" rx="52" ry="42" fill="${base}" stroke="${dark}" stroke-opacity=".12" stroke-width="2"/>
     ${pt === 'tricolor' ? `<g clip-path="url(#gpHead)">${headMarks}</g>` : headMarks}
     <ellipse cx="100" cy="114" rx="22" ry="15" fill="${mix(base,'#ffffff',.22)}"/>
     ${face(100,92,c)}
    </g>
   </g></svg>`; },
 /* Conejo con variantes: v = { fur, light, ears, pattern, mane }
    ears: up | lop (belier, caídas)     pattern: solid | dutch (holandés) | lion (melena) */
 rabbit(v = {}){
  const fur = v.fur || '#d9cfc3', light = v.light || '#fbf7f1', pt = v.pattern || 'solid', white = '#fbf8f4';
  const inner = '#f3b8c4', c = { blush:'#f3a7b8', nose:'#e88aa0', eye: v.eye };
  const belly = pt === 'dutch' ? white : light;
  const ears = v.ears === 'lop'
    ? `<g class="earL"><ellipse cx="50" cy="108" rx="16" ry="40" fill="${fur}" transform="rotate(14 50 108)"/><ellipse cx="52" cy="110" rx="8" ry="30" fill="${inner}" transform="rotate(14 52 110)"/></g>
       <g class="earR"><ellipse cx="150" cy="108" rx="16" ry="40" fill="${fur}" transform="rotate(-14 150 108)"/><ellipse cx="148" cy="110" rx="8" ry="30" fill="${inner}" transform="rotate(-14 148 110)"/></g>`
    : `<g class="earL"><ellipse cx="78" cy="30" rx="14" ry="36" fill="${fur}" transform="rotate(-8 78 62)"/><ellipse cx="78" cy="32" rx="7" ry="26" fill="${inner}" transform="rotate(-8 78 62)"/></g>
       <g class="earR"><ellipse cx="122" cy="30" rx="14" ry="36" fill="${fur}" transform="rotate(8 122 62)"/><ellipse cx="122" cy="32" rx="7" ry="26" fill="${inner}" transform="rotate(8 122 62)"/></g>`;
  const mane = pt === 'lion'
    ? `<g fill="${v.mane || mix(fur,'#ffffff',.25)}">${Array.from({length:16}, (_, i) => {
        const a = i / 16 * Math.PI * 2, x = 100 + Math.cos(a) * 50, y = 98 + Math.sin(a) * 42;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15"/>`; }).join('')}</g>` : '';
  const headMarks = pt === 'dutch' ? `<path d="M100 58 q-16 30 -24 58 q24 18 48 0 q-8 -28 -24 -58z" fill="${white}"/>` : '';
  const lopFirst = v.ears === 'lop';
  return `
  <svg class="pet" viewBox="0 0 200 200">
   <circle cx="152" cy="162" r="13" fill="${light}"/>
   <g class="body">
    <ellipse cx="100" cy="138" rx="58" ry="50" fill="${fur}"/><ellipse cx="100" cy="152" rx="38" ry="30" fill="${belly}"/>
    <ellipse cx="78" cy="182" rx="14" ry="7" fill="${pt === 'dutch' ? white : inner}"/><ellipse cx="122" cy="182" rx="14" ry="7" fill="${pt === 'dutch' ? white : inner}"/>
    <g class="head">
     ${mane}${lopFirst ? '' : ears}
     <ellipse cx="100" cy="98" rx="48" ry="40" fill="${fur}"/>
     ${headMarks}
     <ellipse cx="100" cy="112" rx="20" ry="14" fill="${pt === 'dutch' ? white : mix(fur,'#ffffff',.3)}"/>
     ${face(100,92,c)}
     ${lopFirst ? ears : ''}
    </g>
   </g></svg>`; },
};

/** Dibuja la mascota `p` (entrada de PETS); usa p.svg y p.v si es una variante. */
export const petSVG = p => PET_SVG[p.svg || p.id](p.v);
