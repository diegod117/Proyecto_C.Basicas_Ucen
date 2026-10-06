# 2026-10-06 — Arreglos: menú "Inventario" y textos de las alertas (Johann)

**Trabajado:** errores encontrados en la prueba completa de la app con los tres roles. Rama: `main`.

**Problemas:**
1. Dentro de la ficha de un recurso, apretar **"Inventario" en el menú** no volvía al listado. Solo funcionaba el botón "← Inventario" de la ficha.
2. Las alertas (HU-05, RF-04) tenían errores de singular y plural: "2 unidades dañadas requiere reparación" y "stock bajo (1 disponibles, ...)".

**Qué se hizo:**
- `App.tsx`:
  - Nuevo contador `vecesMenuInventario`, que se usa como `key` de `PaginaInventario`.
  - Nueva función `cambiarPagina()`, que el menú llama en lugar de `setPaginaActual`. Si se elige "Inventario", suma 1 al contador.
  - Cuando cambia la `key`, React crea la página de nuevo, así que la ficha o el formulario "Agregar recurso" se cierran y se ve el listado.
  - Los filtros también vuelven a cero, igual que antes cuando se iba a otra página y se volvía.
- `utils/alertas.ts`:
  - "1 unidad dañada **requiere**", pero "2 unidades dañadas **requieren**".
  - "stock bajo (**1 disponible**, ...)", pero "(**0 disponibles**, ...)" y "(**3 disponibles**, ...)".

**Pruebas (Chrome, cuenta `encargado@prueba.cl`):**
- Ficha abierta → menú "Inventario": vuelve al listado (10 recursos).
- Formulario "Agregar recurso" → menú "Inventario": vuelve al listado.
- El botón "← Inventario" de la ficha y el paso Reservas → Inventario siguen funcionando. El contador de alertas no cambia.
- Alertas con los datos reales: "Termómetro digital: 2 unidades dañadas requieren reparación." y "Multímetro Fluke 87V: 1 unidad dañada requiere reparación.".
- `generarAlertas()` con recursos de prueba de 0, 1 y 3 unidades: singular y plural correctos en los tres casos.
- `npm run build` y `npm run lint` sin errores. Sin errores en la consola.

**Archivos tocados:** `src/App.tsx`, `src/utils/alertas.ts`, `docs/avance/2026-10-06-fix-menu-inventario-y-alertas.md`.
