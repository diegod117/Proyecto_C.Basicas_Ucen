# 2026-10-03 — J7: mensaje sin resultados y botón "Limpiar filtros" (Johann)

**HU trabajada:** HU-01 (cierre). Rama: `feature/hu-01-sin-resultados`. El resto de HU-01 ya se integró a `main` con el PR #7.

**Qué se hizo:**
- `PaginaInventario`: si ningún recurso cumple los filtros, en vez de la grilla vacía muestra el mensaje "No hay recursos que coincidan con los filtros" con un botón "Limpiar filtros". Para elegir qué mostrar se usa un `if/else` dentro de `mostrarResultados()`.
- Junto al contador "Mostrando X de 10" aparece un enlace "Limpiar filtros", solo si hay algún filtro activo (`condición && <elemento>`).
- `limpiarFiltros()` vuelve los 4 `useState` a su valor inicial.
- `src/utils/filtrosInventario.ts`: se agregó `hayFiltrosActivos()`.
- Se probó en el navegador: con reactivo + B307 aparece el mensaje (0 recursos), y al hacer clic en "Limpiar filtros" vuelven los 10 recursos y los 3 `<select>` vuelven a "Todos".

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/filtrosInventario.ts`, `docs/avance.md`.
