/* =====================================================================
   Mascotas y ajustes de juego.
   Cada mascota:
     id    identificador único (no cambiarlo: se guarda en el progreso)
     name  nombre por defecto (se puede renombrar en la app)
     sp    especie / variedad
     svg   dibujo a usar (si no se indica, se usa el id) y v = sus parámetros
     req   cómo se consigue: {xp}, {streak}, {learned} (palabras) o {cost} (semillas, en la tienda)
     desc  dato curioso que se muestra en la colección
   ===================================================================== */
export const PETS = [
 // --- Ratas ---
 {id:'rat', name:'Canela', sp:'Rata hooded', svg:'rat', group:'rat', req:{xp:0},
  v:{pattern:'hooded', fur:'#f7f2ea', hood:'#b07a52', ears:'dumbo'},
  desc:'Las ratas "hooded" tienen la cabeza y una línea en la espalda de color.'},
 {id:'rat_albino', name:'Nieve', sp:'Rata albina', svg:'rat', group:'rat', req:{cost:40},
  v:{pattern:'albino', fur:'#fbf8f4', eye:'#c4334f', ears:'top'},
  desc:'Sus ojos rojos ven poco, pero su olfato es increíble.'},
 {id:'rat_black', name:'Tinta', sp:'Rata berkshire', svg:'rat', group:'rat', req:{learned:20},
  v:{pattern:'berkshire', hood:'#3d3532', ears:'top'},
  desc:'Las berkshire son oscuras con la pancita blanca.'},
 {id:'rat_siamese', name:'Luna', sp:'Rata siamesa', svg:'rat', group:'rat', req:{streak:3},
  v:{pattern:'siamese', fur:'#f3e6d2', point:'#6b4a3a', eye:'#7a1f2b', ears:'top'},
  desc:'Como los gatos siameses: hocico, orejas y patitas más oscuros.'},
 {id:'rat_husky', name:'Pimienta', sp:'Rata husky', svg:'rat', group:'rat', req:{cost:60},
  v:{pattern:'husky', fur:'#f4f2ef', hood:'#8d8f99', ears:'dumbo'},
  desc:'Su pelaje se va aclarando con la edad, como un husky.'},
 {id:'rat_rex', name:'Rizos', sp:'Rata rex', svg:'rat', group:'rat', req:{cost:90},
  v:{pattern:'hooded', fur:'#f5ead9', hood:'#9a8f88', ears:'dumbo', rex:true},
  desc:'Las rex tienen el pelo y los bigotes rizados.'},
 {id:'rat_blue', name:'Mora', sp:'Rata azul', svg:'rat', group:'rat', req:{learned:50},
  v:{pattern:'solid', hood:'#7d8aa3', ears:'dumbo'},
  desc:'"Azul" es un gris azulado muy buscado por los criadores.'},
 // --- Otros roedores (y una invitada) ---
 {id:'rabbit', name:'Lupe', sp:'Conejo · invitada', group:'other', req:{xp:150},
  desc:'Lagomorfa, no roedora… pero no le digas.'},
 {id:'guinea', name:'Tuna', sp:'Cuyo', group:'other', req:{xp:300},
  desc:'Los cuyos "hacen popcorn": saltan de felicidad.'},
 {id:'hamster', name:'Mochi', sp:'Hámster', group:'other', req:{xp:450},
  desc:'Guarda comida en sus cachetes para después.'},
 {id:'mouse', name:'Pip', sp:'Ratón', group:'other', req:{xp:0},
  desc:'Pequeño, curioso y muy rápido.'},
];

/** Texto de cómo se consigue una mascota. */
export function reqText(p){
  const r = p.req;
  if (r.cost) return `En la tienda · 🌰 ${r.cost}`;
  if (r.learned) return `Aprende ${r.learned} palabras`;
  if (r.streak) return `Racha de ${r.streak} días`;
  if (r.xp) return `Llega a ${r.xp} XP`;
  return 'Disponible';
}

export const CFG = {
  sessionSize:10,     // ejercicios por sesión
  newPerSession:4,    // palabras nuevas por sesión (como máximo)
  dailyGoal:30,       // XP para cumplir la meta del día
  xpCorrect:10, seedCorrect:1, perfectBonus:5, goalBonus:5,
  feedCost:1, feedAmount:25, decayPerHour:4,
  unlockUnitAt:8,     // palabras aprendidas para abrir la siguiente unidad
  retention:0.9,      // retención objetivo del algoritmo FSRS
};

export const petDef = id => PETS.find(p => p.id === id) || PETS[0];
