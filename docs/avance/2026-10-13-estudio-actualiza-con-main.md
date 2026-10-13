# 2026-10-13 — Rama de estudio: se actualiza con `main` y guía nueva (Johann)

**Trabajado:** material de estudio para la segunda presentación. No cubre una HU. Rama: `estudio-johann` (no se integra a `main`).

**Qué se hizo:**
- Se hizo un merge de `main` en `estudio-johann`, con todo lo de los PR #45 y #46:
  - React Router y useContext;
  - paginación;
  - Configuración (categorías, torres y salas);
  - reservas que pasan solas al historial;
  - salas libres.
- En los 22 archivos con conflicto quedó el **código de `main`** y se volvieron a escribir los comentarios en palabras simples.
- Los 15 archivos nuevos también se comentaron así:
  - `ContextoUsuario.ts`, `useFiltrosInventario.ts` y `paginacion.ts`;
  - `estadoReserva.ts`, `configuracionService.ts` y las dos `configuracion.ts`;
  - `Configuracion.ts` (tipos);
  - `FichaSegunRuta`, `FilaReserva` y `Paginacion` (`.tsx` y `.css`);
  - `PaginaConfiguracion` (`.tsx` y `.css`) y las tres `Seccion*`.
- Se completaron los comentarios de lo que `main` agregó en archivos sin conflicto: `Reserva.ts`, `fechas.ts`, `disponibilidad.ts`, `TarjetaRecurso`, `TablaUnidadesEstado` y sus `.css`.
- `docs/guia-estudio.md` se reescribió. Los pasos 0 a 9 se mantienen, actualizados:
  - El paso 6 ahora explica el **useContext que sí usamos**: `ContextoUsuario` y `useUsuario`.
  - El paso 5 explica el reloj `setInterval` de App.
  - Las recetas del paso 9 se actualizaron para las rutas y la Configuración.
- Pasos nuevos de la guía:
  - Paso 10: **React Router** (rutas, rutas anidadas, `NavLink`, `useNavigate`, `useParams` y rutas protegidas).
  - Paso 11: **hooks propios y paginación**.
  - Paso 12: **reservas por hora y salas libres**.
  - Paso 13: **Configuración**.
  - Paso 14: **la rúbrica punto por punto**, un orden para la demo, ejercicios con soluciones y preguntas con respuestas cortas.

**Cómo se verificó que el código no cambió:**
- El mismo script de la vez anterior compara cada archivo de `src/` con `origin/main` sin mirar los comentarios. Revisó 102 archivos y encontró **0 con código distinto**. También se probó que el script sí detecta un cambio real.
- `npm run build` y `npm run lint` pasaron sin errores.

**Archivos tocados:** todo `src/` (el merge más los comentarios), `docs/guia-estudio.md` y este archivo.
