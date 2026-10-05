# 2026-10-04 — J17: solo el encargado cambia el estado de un recurso (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-inventario`.

**Qué se hizo:**
- `FichaRecurso.tsx`: usa `puedeCambiarEstado(rol)`. El encargado ve el formulario de cambio de estado como antes. El docente y el departamento ven los datos, la ubicación y el historial, y en la columna derecha un aviso: "Solo el encargado de laboratorio puede cambiar el estado de un recurso."
- `FichaRecurso.css`: clase `.ficha-aviso-permiso`, una tarjeta gris del mismo estilo que el formulario.
- `PaginaInventario.tsx` recibe el usuario y se lo pasa a la ficha; `App.tsx` se lo pasa a la página.
- Se probó en el navegador con los tres roles en la ficha del multímetro: el encargado puede guardar un cambio; el docente y el departamento ven el aviso.
- Nota: `FichaRecurso.tsx` quedó en 161 líneas. Más adelante se puede separar la tabla "Unidades por estado" en su propio componente.

**Archivos tocados:** `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/pages/PaginaInventario.tsx`, `src/App.tsx`, `docs/avance.md`.
