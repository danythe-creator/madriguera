# Hoja de ruta

## Contexto
- **Usuaria principal:** mujer de 22 años, nivel **A2**, usa **Android** (Chrome). Ama a los roedores.
- **Meta:** aprender inglés con una calidad comparable a Busuu o Duolingo. Mínimo **una lección de ~5 minutos al día**, sin tope: más tiempo = más avance.
- **Restricciones:** sin presupuesto; desarrollo en Linux Mint XFCE con 4 GB de RAM.
  → Cero dependencias en la app, sin compilación, hosting gratis (GitHub Pages), herramientas ligeras.

## Principios
1. **Aprender primero, jugar después.** Las recompensas premian aprender (precisión, constancia, habilidades nuevas), no repetir lo fácil.
2. **Lecciones cortas y completas.** Una lección ≈ 5 min ≈ 10–14 ejercicios que mezclan vocabulario, gramática, escuchar, leer, escribir y hablar.
3. **Contenido revisado por una persona.** Las fuentes automáticas se usan como materia prima; todo se revisa antes de publicarse.
4. **Nada se pierde.** El progreso se protege (almacenamiento persistente, respaldos, pruebas automáticas).

## Fuentes libres (con atribución obligatoria)
| Recurso | Uso | Licencia |
|---|---|---|
| NGSL / NGSL-Spoken | Lista de ~2,800 palabras frecuentes | CC BY-SA |
| Tatoeba | Oraciones inglés–español reales | CC BY 2.0 FR (audio: varía por autor) |
| Wiktionary (vía kaikki.org) | Definiciones, pronunciación IPA | CC BY-SA |
| Piper TTS | Generar audio natural sin internet en la PC | MIT (cada voz tiene su licencia: elegir una que permita uso libre) |

## ✅ Hecho
- App modular, PWA sin internet, FSRS, fecha local, respuestas alternativas y errores de dedo.
- 8 unidades A1 (98 palabras), audio con voz del sistema, audio lento.
- 21 mascotas (ratas, conejos, cuyos, hámsters), Manchis y Myel, tienda, decoración, 5 espacios comunes.
- Cartas sorpresa por enlace privado.

## Fase A — Bases serias (en curso)
- [x] Pruebas automáticas de la lógica (repaso, respuestas, cartas, integridad del contenido).
- [x] Prueba de punta a punta con navegador real.
- [x] Las pruebas corren solas en cada cambio (GitHub Actions, gratis en repos públicos).
- [x] Almacenamiento persistente en Android (el navegador no borra el progreso por falta de espacio).
- [x] Recordatorio de respaldo y registro de la fecha del último respaldo.
- [x] Botón "Reportar error" en cada ejercicio; los reportes se exportan para corregir el contenido.
- [x] Pantalla de "Novedades" al actualizar.
- [x] Diseño del formato de contenido v2 (lecciones con vocabulario + gramática + oraciones + diálogo). Ver `docs/CONTENIDO.md`.

## Fase B — Contenido A2 → B1 (lo más importante)
- [ ] Examen de ubicación: como ya es A2, puede "saltar" lo que ya domina.
- [ ] Currículo A2 completo y luego B1: ~40 unidades por nivel, cada una con un tema de gramática.
- [ ] Ejercicios nuevos: ordenar palabras (banco de palabras), traducir oraciones, dictado, comprensión auditiva, emparejar contra reloj, completar diálogos, elegir la forma gramatical.
- [ ] Repaso espaciado también de oraciones y estructuras, no solo palabras.
- [ ] **Módulo para hispanohablantes:** falsos amigos (*embarrassed*, *actually*), calcos ("I have 22 years"), orden de adjetivos, preposiciones (*in/on/at*), pares mínimos (*ship/sheep*, *b/v*, *th*).
- [ ] Explicaciones de gramática breves, en español, con ejemplos.

## Fase C — Escuchar y hablar
- [ ] Audio natural pregenerado con Piper (mismo sonido en cualquier celular, sin internet).
- [ ] "Repite después de mí" con reconocimiento de voz de Chrome Android (gratis, requiere internet): marca palabras mal pronunciadas.
- [ ] Ejercicios de comprensión con oraciones y diálogos completos.

## Fase D — Leer y medir
- [ ] Historias graduadas de Manchis y Myel: audio, tocar palabra = traducción, preguntas de comprensión.
- [ ] Examen al final de cada nivel y **nivel MCER estimado** ("A2 · 60 %").
- [ ] Progreso por habilidad: vocabulario, gramática, escuchar, hablar, leer, escribir.

## Fase E — Motivación conectada al estudio
- [ ] Misiones diarias por habilidad, logros, protector de racha.
- [ ] Mascotas que aprenden "trucos" al subir de nivel; eventos de temporada (Navidad, San Valentín…) con vocabulario.
- [ ] Recordatorio diario (notificaciones locales cuando el navegador lo permita).

## Fase F — Conversación (opcional)
- [ ] Diálogos con guion y ramas (restaurante, viaje, entrevista, presentarse).
- [ ] Opcional: conversación con IA mediante la cuota gratuita de Cloudflare Workers AI (requiere cuenta; límites sujetos a cambio).

## Herramientas para el desarrollador (ligeras en 4 GB)
- Editor: Geany, Mousepad o VSCodium.
- Probar en su celular: cable USB + `chrome://inspect` en Chrome de la PC (depuración remota).
- Scripts de contenido: Python 3 (ya viene en Linux Mint).
- Audio: Piper (consume poca RAM; se usa una vez para generar archivos).
