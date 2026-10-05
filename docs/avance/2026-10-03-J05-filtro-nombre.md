# 2026-10-03 — J5: filtro por nombre (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `PaginaInventario`: buscador por nombre con `useState` (input controlado con `value` + `onChange`). El contador muestra "Mostrando X de 10 recursos".
- `src/utils/inventario.ts`: se agregaron `prepararTextoParaBuscar()`, que pasa el texto a minúsculas y le quita las tildes, y `filtrarPorNombre()`. La búsqueda ignora mayúsculas y tildes: "termometro" encuentra "Termómetro digital".
- Se probó con texto vacío, solo espacios, sin tildes, en mayúsculas, con coincidencia parcial ("ard") y sin resultados.

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/inventario.ts`, `docs/avance.md`.
