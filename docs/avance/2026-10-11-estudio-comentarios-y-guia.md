# 2026-10-11 — Rama de estudio: comentarios simples y guía (Johann)

**Trabajado:** material de estudio para la presentación. No cubre una HU. Rama: `estudio-johann` (no se integra a `main`).

**Qué se hizo:**
- Se reescribieron los comentarios de **todos** los archivos de `src/` (85 archivos: `.ts`, `.tsx` y `.css`) con palabras muy simples y ejemplos. Cada archivo empieza con "¿QUÉ ES ESTE ARCHIVO?" y dice en qué paso de la guía se explica.
- Los archivos que más se usan para hacer cambios tienen marcas `***` que dicen dónde cambiar cada cosa: `MenuNavegacion.tsx/.css` (nombre, rol y título), `usuarios.ts`, `FichaRecurso.tsx`, `global.css` y `permisos.ts`.
- `docs/guia-estudio.md` (nuevo): una guía en 11 pasos.
  - Pasos 0 y 1: cómo prender la app y el mapa de carpetas.
  - Pasos 2 a 5: TypeScript, componentes y props, useState, useEffect y async/await.
  - Paso 6: **useContext**. La app no lo usa; se explica qué es y por qué se prefirieron las props.
  - Paso 7: CSS.
  - Paso 8: Firebase y los datos.
  - Paso 9: **recetas para cambiar cosas**, como el nombre de arriba a la derecha, "Encargado de laboratorio", el título, los colores, los datos de la ficha y los permisos.
  - Paso 10: ejercicios con soluciones y preguntas para la presentación. Al final hay un glosario.

**Cómo se verificó que el código no cambió:**
- Un script compara cada archivo con `main` ignorando los comentarios. En TS/TSX compara el árbol de sintaxis de TypeScript; en CSS compara las reglas sin comentarios.
- Resultado: 85 archivos con comentarios nuevos y **0 con código distinto**.
- `npm run build` y `npm run lint` sin errores.

**Archivos tocados:** los 85 archivos de `src/`, `docs/guia-estudio.md` y `docs/avance/2026-10-11-estudio-comentarios-y-guia.md`.
