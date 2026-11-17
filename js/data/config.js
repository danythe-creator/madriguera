// Mascotas desbloqueables y ajustes de juego.
export const PETS = [
 {id:'mouse',  name:'Pip',  sp:'Ratón',   lvl:'A1', req:{xp:0},     hint:'Tu primer compañero.'},
 {id:'hamster',name:'Mochi',sp:'Hámster', lvl:'A2', req:{xp:150},   hint:'Se desbloquea con 150 XP.'},
 {id:'guinea', name:'Tuna', sp:'Cuyo',    lvl:'B1', req:{xp:400},   hint:'Se desbloquea con 400 XP.'},
 {id:'rabbit', name:'Lupe', sp:'Conejo · invitada', lvl:'★', req:{streak:7}, hint:'Racha de 7 días. (Lagomorfa, pero no le digas.)'},
];

export const CFG = {
  sessionSize:10,     // ejercicios por sesión
  newPerSession:4,    // palabras nuevas por sesión (como máximo)
  dailyGoal:30,       // XP para cumplir la meta del día
  xpCorrect:10, seedCorrect:1, perfectBonus:5,
  feedCost:1, feedAmount:25, decayPerHour:4,
  unlockUnitAt:8,     // palabras aprendidas para abrir la siguiente unidad
  retention:0.9,      // retención objetivo del algoritmo FSRS
};

export const petDef = id => PETS.find(p => p.id === id);
