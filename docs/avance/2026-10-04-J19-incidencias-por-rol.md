# 2026-10-04 — J19: incidencias según el rol (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-incidencias`.

**Qué se hizo:**
- `PaginaIncidencias.tsx` (archivo de Diego): recibe el usuario. Solo el encargado ve el formulario para registrar incidencias; el departamento ve un aviso en su lugar.
- `TablaIncidencias.tsx` (archivo de Diego): recibe el usuario. Si el rol no puede gestionar incidencias, se oculta la columna "Acción" completa (encabezado y botones), en vez de dejarla vacía.
- `App.tsx`: le pasa el usuario a `PaginaIncidencias`. El docente no ve esta página desde J16.
- Se probó en el navegador:
  - el encargado registra una incidencia y la avanza a "en revisión" y "resuelta";
  - el departamento ve el aviso y la tabla sin la columna "Acción".
- Se recuperaron las entradas de J16, J17 y J18 de esta bitácora, que se habían perdido al resolver conflictos de merge. Se tomaron de los commits de los PR #21 y #22.

**Archivos tocados:** `src/pages/PaginaIncidencias.tsx`, `src/components/TablaIncidencias.tsx`, `src/App.tsx`, `docs/avance.md`.
