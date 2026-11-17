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
  const headMarks = pt === 'hooded' ? `<path d="M100 54 q-7 18 0 34 q7 -16 0 -34z" fill="${fur}"/>`
    : pt === 'husky' ? `<path d="M100 52 q-16 30 -26 58 q26 14 52 0 q-10 -28 -26 -58z" fill="${white}"/>` : '';
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
 hamster(){ const c={fur:'#e8a94a',light:'#fff1d6',blush:'#f0a0a0',nose:'#d98585',ear:'#f5c98a'}; return `
  <svg class="pet" viewBox="0 0 200 200">
   <g class="body">
    <ellipse cx="100" cy="134" rx="64" ry="54" fill="${c.fur}"/><ellipse cx="100" cy="148" rx="42" ry="32" fill="${c.light}"/>
    <ellipse cx="76" cy="180" rx="13" ry="7" fill="${c.ear}"/><ellipse cx="124" cy="180" rx="13" ry="7" fill="${c.ear}"/>
    <g class="head">
     <g class="earL"><circle cx="62" cy="62" r="17" fill="${c.fur}"/><circle cx="62" cy="62" r="9" fill="${c.ear}"/></g>
     <g class="earR"><circle cx="138" cy="62" r="17" fill="${c.fur}"/><circle cx="138" cy="62" r="9" fill="${c.ear}"/></g>
     <ellipse cx="100" cy="96" rx="54" ry="44" fill="${c.fur}"/>
     <ellipse cx="66" cy="110" rx="20" ry="16" fill="#f3bd6a"/><ellipse cx="134" cy="110" rx="20" ry="16" fill="#f3bd6a"/>
     <ellipse cx="100" cy="112" rx="22" ry="16" fill="${c.light}"/>
     ${face(100,88,c)}
    </g>
   </g></svg>`; },
 guinea(){ const c={fur:'#8a5a3a',light:'#f6ead8',blush:'#f0a0a0',nose:'#d98585',ear:'#c98a6a'}; return `
  <svg class="pet" viewBox="0 0 200 200">
   <g class="body">
    <ellipse cx="100" cy="136" rx="70" ry="50" fill="${c.fur}"/>
    <ellipse cx="128" cy="140" rx="30" ry="34" fill="${c.light}"/>
    <ellipse cx="72" cy="182" rx="12" ry="6" fill="${c.ear}"/><ellipse cx="128" cy="182" rx="12" ry="6" fill="${c.ear}"/>
    <g class="head">
     <g class="earL"><ellipse cx="58" cy="72" rx="14" ry="10" fill="${c.ear}" transform="rotate(-20 58 72)"/></g>
     <g class="earR"><ellipse cx="142" cy="72" rx="14" ry="10" fill="${c.ear}" transform="rotate(20 142 72)"/></g>
     <ellipse cx="100" cy="98" rx="52" ry="42" fill="${c.fur}"/>
     <path d="M100 56 q-30 0 -42 30 q10 -8 42 -8 z" fill="${c.light}"/>
     ${face(100,92,c)}
    </g>
   </g></svg>`; },
 rabbit(){ const c={fur:'#d9cfc3',light:'#fbf7f1',blush:'#f3a7b8',nose:'#e88aa0',ear:'#f3b8c4'}; return `
  <svg class="pet" viewBox="0 0 200 200">
   <circle cx="150" cy="160" r="12" fill="${c.light}"/>
   <g class="body">
    <ellipse cx="100" cy="136" rx="56" ry="50" fill="${c.fur}"/><ellipse cx="100" cy="150" rx="34" ry="28" fill="${c.light}"/>
    <ellipse cx="78" cy="180" rx="13" ry="7" fill="${c.ear}"/><ellipse cx="122" cy="180" rx="13" ry="7" fill="${c.ear}"/>
    <g class="head">
     <g class="earL"><ellipse cx="78" cy="30" rx="14" ry="36" fill="${c.fur}"/><ellipse cx="78" cy="32" rx="7" ry="26" fill="${c.ear}"/></g>
     <g class="earR"><ellipse cx="122" cy="30" rx="14" ry="36" fill="${c.fur}"/><ellipse cx="122" cy="32" rx="7" ry="26" fill="${c.ear}"/></g>
     <ellipse cx="100" cy="98" rx="48" ry="40" fill="${c.fur}"/>
     ${face(100,92,c)}
    </g>
   </g></svg>`; },
};

/** Dibuja la mascota `p` (entrada de PETS); usa p.svg y p.v si es una variante. */
export const petSVG = p => PET_SVG[p.svg || p.id](p.v);
