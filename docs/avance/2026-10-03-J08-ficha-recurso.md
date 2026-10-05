# 2026-10-03 — J8: ficha del recurso (Johann)

**HU trabajada:** HU-02 (en progreso). Rama: `feature/hu-02-cambiar-estado`.

**Qué se hizo:**
- Componente nuevo `src/components/FichaRecurso.tsx` y `.css`. Muestra:
  - la ruta "← Inventario / Nombre";
  - la ubicación completa: torre, sala, bodega, mueble y código (RF-10);
  - los datos de la planilla, con "No registrado" si faltan;
  - el stock mínimo, solo si el recurso lo tiene;
  - una tabla con las unidades de los 5 estados y el total (RF-01).
- `TarjetaRecurso`: nueva prop `onSeleccionar(idRecurso)`. Toda la tarjeta se puede cliquear y se resalta al pasar el mouse.
- `PaginaInventario`: `useState<number | null>` guarda el id del recurso abierto (`null` = ninguno). Si hay uno, muestra la ficha en vez del listado. Al volver, los filtros se mantienen.
- Componente nuevo `src/components/MensajeSinResultados.tsx` y `.css`. Se separó de `PaginaInventario` para que la página no pasara las ~150 líneas.
- `src/utils/inventario.ts`: se agregó `textoCampoOpcional()`.
- `src/styles/global.css` (archivo compartido): se movieron ahí los colores de las etiquetas de estado (`.etiqueta-*`), porque ahora los usan `TarjetaRecurso` y `FichaRecurso`.
- Se probó en el navegador:
  - filtrar "Dañado" → abrir el multímetro → volver: el filtro sigue en "Dañado";
  - la mesa (sin datos opcionales) muestra "No registrado";
  - los guantes muestran su stock mínimo.

**Archivos tocados:** `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/components/MensajeSinResultados.tsx`, `src/components/MensajeSinResultados.css`, `src/components/TarjetaRecurso.tsx`, `src/components/TarjetaRecurso.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/inventario.ts`, `src/styles/global.css`, `docs/avance.md`.
