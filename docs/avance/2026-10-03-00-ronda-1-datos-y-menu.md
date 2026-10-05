# 2026-10-03 — Ronda 1: datos de prueba y menú de navegación

**HU trabajada:** ninguna en específico (base común para la ronda 2). Prepara HU-01, HU-03, HU-04, HU-05, HU-08 y HU-09.

**Qué se hizo:**
- Ubicación con formato torre + sala (ej: B307 = torre B, sala 307). En `Recurso.ts` se reemplazó `laboratorio` por `torre` (`'B' | 'C'`) y `sala`.
- Datos de prueba inventados en `src/data/`:
  - `recursos.ts`: 10 recursos que cubren las 6 categorías y los 5 estados, en B307, B308 y C210. Los guantes de nitrilo están bajo su stock mínimo, para probar las alertas.
  - `reservas.ts`: 4 reservas. Los 8 termómetros quedan ocupados el 09/10 a las 08:30, para probar HU-08.
  - `incidencias.ts`: 3 incidencias, una en cada estado.
- Menú de navegación con `useState` en `App.tsx` (sin librerías de rutas) y tres páginas borrador: Inventario, Reservas e Incidencias.
- Plan de implementación por integrante en `docs/plan-implementacion.md`.

**Archivos tocados:** `src/types/Recurso.ts`, `src/types/Pagina.ts`, `src/data/recursos.ts`, `src/data/reservas.ts`, `src/data/incidencias.ts`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaReservas.tsx`, `src/pages/PaginaIncidencias.tsx`, `src/App.tsx`, `src/styles/global.css`, `docs/plan-implementacion.md`, `docs/avance.md`, `README.md`.
