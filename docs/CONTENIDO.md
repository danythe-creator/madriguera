# Formato de contenido v2 (diseño para la Fase B)

Objetivo: lecciones de ~5 minutos al estilo Busuu/Duolingo para una usuaria **A2 → B1**,
con vocabulario, gramática, oraciones, escuchar, leer, escribir y hablar.
El formato actual (`js/data/units.js`: palabras sueltas) se mantiene para las unidades A1 y convive con el nuevo.

## Estructura

```
Nivel (A2, B1)
 └─ Unidad (tema: "En el restaurante", ~4–6 lecciones)
     ├─ Lección 1  vocabulario nuevo + oraciones
     ├─ Lección 2  gramática (explicación breve en español + práctica)
     ├─ Lección 3  diálogo (escuchar, completar, ordenar)
     ├─ Lección 4  lectura / historia de Manchis y Myel
     └─ Repaso de unidad (cuenta para el nivel MCER estimado)
```

## Archivo por unidad: `js/content/a2/restaurant.js`

Cada unidad es un módulo JavaScript (`export default { … }`) con esta forma, y se registra en `js/content/index.js`.
Así funciona sin internet y las pruebas pueden revisarlo directamente.

```json
{
  "id": "a2-restaurant",
  "level": "A2",
  "title": "En el restaurante",
  "icon": "🍽️",
  "can_do": "Puedo pedir comida y preguntar el precio.",
  "grammar": {
    "id": "would-like",
    "title": "Pedir con amabilidad: I'd like…",
    "explain_es": "Para pedir algo con cortesía usamos **I'd like** (= I would like) + sustantivo o + to + verbo.",
    "examples": [["I'd like a coffee, please.", "Quisiera un café, por favor."]]
  },
  "words": [
    { "en": "menu", "es": "menú", "pos": "noun", "ipa": "ˈmenjuː" },
    { "en": "bill", "es": "cuenta", "pos": "noun", "alt": ["check"], "note_es": "En EE. UU. se dice *check*." }
  ],
  "sentences": [
    { "en": "Could I see the menu, please?", "es": "¿Podría ver el menú, por favor?", "src": "tatoeba:12345" }
  ],
  "dialogue": [
    { "who": "waiter", "en": "Are you ready to order?", "es": "¿Está lista para ordenar?" },
    { "who": "you",    "en": "Yes, I'd like the soup, please.", "es": "Sí, quisiera la sopa, por favor." }
  ],
  "lessons": [
    { "id": "l1", "kind": "vocab",    "new": ["menu", "bill", "waiter", "order"] },
    { "id": "l2", "kind": "grammar",  "grammar": "would-like" },
    { "id": "l3", "kind": "dialogue" },
    { "id": "l4", "kind": "reading",  "story": "manchis-cafe" }
  ]
}
```

## Tipos de ejercicio (generados a partir de los datos)
| Tipo | Habilidad | De dónde sale |
|---|---|---|
| Opción múltiple (en→es, es→en) | vocabulario | `words` |
| Completar la oración | vocabulario / gramática | `sentences`, `grammar.examples` |
| Ordenar palabras (banco) | gramática | `sentences` |
| Traducir oración (escribir) | escribir | `sentences` |
| Dictado | escuchar / escribir | `sentences` + audio |
| Escuchar y elegir significado | escuchar | `sentences` + audio |
| Completar diálogo | conversación | `dialogue` |
| Repite después de mí | hablar | `sentences` + reconocimiento de voz |
| Emparejar contra reloj | vocabulario | `words` |
| Elegir la forma correcta | gramática | `grammar.drills` |

Una lección mezcla ~10–14 ejercicios: primero presenta, luego practica en orden de dificultad
(reconocer → recordar → producir), y cierra con 2–3 repasos de lecciones anteriores (FSRS).

## Repaso espaciado
Cada **palabra, oración y punto gramatical** es una tarjeta FSRS con su propia clave
(`w:menu`, `s:tatoeba:12345`, `g:would-like`). El tipo de ejercicio sube de dificultad según los aciertos.

## Cómo se produce el contenido
1. **Script** (Python, en la PC): toma palabras del nivel de NGSL y busca oraciones cortas en Tatoeba
   que solo usen vocabulario conocido. Genera un borrador JSON por unidad.
2. **Revisión humana**: corregir traducciones, elegir oraciones naturales, escribir la explicación de gramática.
3. **Pruebas automáticas** (`tests/content.test.mjs`): validan el formato antes de publicar.
4. **Reportes** de la usuaria (⚑) → se corrigen en la siguiente versión.

## Créditos
Cada unidad guarda la fuente de sus oraciones (`src`). La app tendrá una pantalla de créditos
(NGSL: CC BY-SA; Tatoeba: CC BY 2.0 FR), obligatoria por las licencias.
