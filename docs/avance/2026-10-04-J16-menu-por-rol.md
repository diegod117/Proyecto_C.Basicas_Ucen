# 2026-10-04 — J16: menú según el rol (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-permisos-rol` (PR #19).

**Qué se hizo:**
- `MenuNavegacion.tsx`: cada botón del menú se dibuja solo si `puedeVerPagina(rol, pagina)` lo permite. Se aplicó a los cuatro botones, así un cambio de permisos se hace solo en `utils/permisos.ts`.
- `App.tsx`: protección extra. Si la página actual no está permitida para el rol, se muestra el inventario.
- Se probó en el navegador: el docente ve solo Inventario y Reservas; el encargado y el departamento ven las cuatro páginas.
- Nota: al principio el docente seguía viendo Incidencias y Alertas porque el `main` local estaba atrasado. Después de cada PR integrado hay que hacer **Pull** en GitHub Desktop.

**Archivos tocados:** `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `docs/avance.md`.
