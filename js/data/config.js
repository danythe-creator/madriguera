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
 {id:'rat', name:'Manchis', sp:'Rata', svg:'rat', group:'rat', req:{xp:0},
  v:{pattern:'berkshire', hood:'#e8d3b4', ears:'dumbo', spot:true},
  desc:'Beige clarito, pancita blanca y su manchita blanca en la frente.'},
 {id:'mouse', name:'Myel', sp:'Rata', svg:'rat', group:'rat', req:{xp:0},
  v:{pattern:'berkshire', hood:'#e8d3b4', ears:'dumbo'},
  desc:'Igualita a Manchis, pero sin manchita. Inseparables.'},
 {id:'rat_hooded', name:'Canela', sp:'Rata hooded', svg:'rat', group:'rat', req:{cost:30},
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
 // --- Conejos (lagomorfos, pero aquí son familia) ---
 {id:'rabbit', name:'Lupe', sp:'Conejo enano', svg:'rabbit', group:'rabbit', req:{xp:150},
  v:{fur:'#d9cfc3', ears:'up'},
  desc:'Lagomorfa, no roedora… pero no le digas.'},
 {id:'rabbit_lop', name:'Bombón', sp:'Conejo belier', svg:'rabbit', group:'rabbit', req:{cost:70},
  v:{fur:'#e7c39a', light:'#fff4e4', ears:'lop'},
  desc:'Los belier tienen las orejas caídas a los lados de la cara.'},
 {id:'rabbit_dutch', name:'Dominó', sp:'Conejo holandés', svg:'rabbit', group:'rabbit', req:{learned:35},
  v:{fur:'#3d3532', light:'#5a504c', ears:'up', pattern:'dutch'},
  desc:'El holandés tiene la cara y el pecho blancos, como un antifaz.'},
 {id:'rabbit_lion', name:'Melena', sp:'Conejo cabeza de león', svg:'rabbit', group:'rabbit', req:{cost:100},
  v:{fur:'#c98f5a', light:'#f3dcc0', ears:'up', pattern:'lion', mane:'#e2b27e'},
  desc:'Tiene una melena alrededor de la cabeza, como un pequeño león.'},
 // --- Cuyos ---
 {id:'guinea', name:'Tuna', sp:'Cuyo tricolor', svg:'guinea', group:'guinea', req:{xp:300},
  v:{pattern:'tricolor', base:'#fbf6ee', ear:'#e8b48a', spots:['#d98a3d','#3d3532']},
  desc:'Los cuyos "hacen popcorn": saltan de felicidad.'},
 {id:'guinea_aby', name:'Remolino', sp:'Cuyo abisinio', svg:'guinea', group:'guinea', req:{cost:60},
  v:{pattern:'abyssinian', base:'#a0703f', ear:'#7f5435'},
  desc:'El pelo del abisinio forma remolinos llamados "rosetas".'},
 {id:'guinea_peru', name:'Fideo', sp:'Cuyo peruano', svg:'guinea', group:'guinea', req:{cost:90},
  v:{pattern:'peruvian', base:'#e9c98f', ear:'#d9a86a'},
  desc:'Su pelo puede crecer más de 30 cm. ¡Necesita peluquería!'},
 // --- Hámsters ---
 {id:'hamster', name:'Mochi', sp:'Hámster sirio', svg:'hamster', group:'hamster', req:{xp:450},
  v:{pattern:'syrian', fur:'#e8a94a', light:'#fff1d6', cheek:'#f3bd6a'},
  desc:'Guarda comida en sus cachetes para después.'},
 {id:'hamster_russian', name:'Bolita', sp:'Hámster enano ruso', svg:'hamster', group:'hamster', req:{cost:50},
  v:{pattern:'stripe', fur:'#b9b3ad', light:'#f7f3ee', dark:'#5b524c', ear:'#e8c8b8'},
  desc:'Tiene una raya oscura en la espalda y en invierno se aclara.'},
 {id:'hamster_robo', name:'Pulga', sp:'Hámster roborovski', svg:'hamster', group:'hamster', req:{cost:70},
  v:{pattern:'robo', fur:'#e2b98a', light:'#fffaf0', ear:'#f0cfae'},
  desc:'El más pequeño y veloz. Tiene "cejitas" blancas.'},
 {id:'hamster_panda', name:'Chispa', sp:'Hámster panda', svg:'hamster', group:'hamster', req:{learned:60},
  v:{pattern:'panda', fur:'#3d3532', light:'#fbf8f4', ear:'#e8c8b8'},
  desc:'Un sirio blanco y negro, como un osito panda.'},
 {id:'hamster_teddy', name:'Peluche', sp:'Hámster de pelo largo', svg:'hamster', group:'hamster', req:{cost:90},
  v:{pattern:'teddy', fur:'#ead2a8', light:'#fff6e6', ear:'#f0cfae'},
  desc:'También llamado "osito de peluche" por su pelo esponjoso.'},
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

/** Grupos de la colección, en orden de preferencia. */
export const GROUPS = [
  {id:'rat', name:'Ratas'}, {id:'rabbit', name:'Conejos'}, {id:'guinea', name:'Cuyos'}, {id:'hamster', name:'Hámsters'},
];

export const petDef = id => PETS.find(p => p.id === id) || PETS[0];
