// Ilustraciones SVG originales de las mascotas. Todas comparten clases (.body, .head, .eye, .tail, .earL, .earR) para que las animaciones CSS funcionen con cualquiera.

function face(x, eyeY, c){ // ojos, cachetes, nariz, boca, bigotes
  return `
  <g class="eyes"><circle class="eye" cx="${x-18}" cy="${eyeY}" r="6" fill="#2b1d16"/><circle class="eye" cx="${x+18}" cy="${eyeY}" r="6" fill="#2b1d16"/>
   <circle cx="${x-16}" cy="${eyeY-2}" r="2" fill="#fff"/><circle cx="${x+20}" cy="${eyeY-2}" r="2" fill="#fff"/></g>
  <g class="eyes-closed" fill="none" stroke="#2b1d16" stroke-width="3" stroke-linecap="round"><path d="M${x-24} ${eyeY+2} q6 5 12 0"/><path d="M${x+12} ${eyeY+2} q6 5 12 0"/></g>
  <ellipse cx="${x-28}" cy="${eyeY+16}" rx="8" ry="5" fill="${c.blush}" opacity=".75"/><ellipse cx="${x+28}" cy="${eyeY+16}" rx="8" ry="5" fill="${c.blush}" opacity=".75"/>
  <ellipse cx="${x}" cy="${eyeY+18}" rx="6" ry="4.5" fill="${c.nose}"/>
  <path class="mouth" d="M${x-7} ${eyeY+26} q7 6 14 0" fill="none" stroke="#2b1d16" stroke-width="2.5" stroke-linecap="round"/>
  <g stroke="#2b1d16" stroke-width="1.5" opacity=".5" stroke-linecap="round">
   <path d="M${x-14} ${eyeY+18} l-26 -4"/><path d="M${x-14} ${eyeY+22} l-26 4"/><path d="M${x+14} ${eyeY+18} l26 -4"/><path d="M${x+14} ${eyeY+22} l26 4"/></g>`;
}
export const PET_SVG = {
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
