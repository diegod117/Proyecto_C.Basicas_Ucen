# 2026-10-04 — D21: revisión en celular de inventario, ficha e incidencias (Diego)

**Trabajado:** RNF-01 (fase 2). Rama: `feature/diseno-incidencias`.

**Qué se hizo:** reglas `@media (max-width: 768px)`, pensadas para probar a 375px.
- `FichaRecurso.css`: menos relleno en las tarjetas, título más chico y datos en una columna (el dato arriba y el valor debajo).
- `FormularioCambioEstado.css`, `FormularioIncidencia.css` y `FiltrosInventario.css`: campos con letra de 16px para que el celular no haga zoom al tocarlos, menos relleno y checkbox más grande.
- `TablaIncidencias.css`: ancho mínimo de 640px para que la tabla se deslice hacia el lado en vez de aplastarse.

**Pendiente:** la parte de celular de `TablaHistorial.css` (ancho mínimo y menos relleno) depende de que D19 esté en `main`.

**Archivos tocados:** `src/components/FichaRecurso.css`, `src/components/FormularioCambioEstado.css`, `src/components/FormularioIncidencia.css`, `src/components/FiltrosInventario.css`, `src/components/TablaIncidencias.css`, `docs/avance.md`.
