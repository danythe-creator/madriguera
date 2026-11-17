# 🐭 Madriguera · Inglés con roedores

App para aprender inglés cuidando roedores: estudias, ganas semillas, alimentas a tu mascota y desbloqueas nuevas.
Funciona en el navegador, se instala en el celular como app y sirve sin internet.

**Sin dependencias, sin compilar, sin costo**: HTML, CSS y JavaScript puros. Corre bien en equipos modestos.

## Probarla en tu computadora

Los módulos de JavaScript necesitan un servidor local (abrir `index.html` con doble clic no funciona):

```bash
cd madriguera
python3 -m http.server 8000
```

Luego abre <http://localhost:8000> en el navegador.

## Publicarla gratis (GitHub Pages)

1. En GitHub: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
3. En un par de minutos estará en `https://<tu-usuario>.github.io/madriguera/`.
4. En el celular, abre esa dirección en Chrome y elige **Agregar a la pantalla de inicio** / **Instalar app**.

## Estructura

```
index.html              estructura de las pantallas
css/styles.css          estilos (colores en :root)
js/main.js              arranque
js/data/units.js        ← CONTENIDO: unidades y palabras (edita aquí)
js/data/config.js       mascotas (variedades y cómo se consiguen) y ajustes del juego
js/data/shop.js         objetos de la tienda y colores de pared
js/state.js             progreso guardado (localStorage) y migraciones
js/letters.js           cartas sorpresa (condiciones y empaque en enlace)
js/srs.js               repetición espaciada FSRS
js/answers.js           revisión de respuestas (alternativas, errores de dedo)
js/speech.js            voz en inglés
js/petsvg.js            dibujos de las mascotas
js/views/*.js           pantallas: casa, lecciones, lección, roedores, progreso
sw.js                   funcionamiento sin internet
```

Al publicar una versión nueva, cambia `CACHE` en `sw.js` (por ejemplo `madriguera-v3`).

Ver [docs/ROADMAP.md](docs/ROADMAP.md) para lo que sigue.
