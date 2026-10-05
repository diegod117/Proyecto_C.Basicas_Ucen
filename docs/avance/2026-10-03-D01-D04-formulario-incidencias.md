# 2026-10-03 — D1 a D4: servicio y formulario de incidencias (Diego)

**HU trabajada:** HU-04 (registrar incidencia) y RF-05.

**Qué se hizo:**
- `src/services/incidenciasService.ts` (D1): creación del servicio con `obtenerIncidencias()`, `obtenerIncidenciaPorId()` y `agregarIncidencia()`.
- `src/components/FormularioIncidencia.tsx/.css` (D2, D3, D4): formulario controlado para ingresar incidencias con selección de recurso afectado, docente presente, descripción, checkbox condicional de personas afectadas con detalle opcional, y validación de campos obligatorios en un máximo de 5 pasos (RNF-02).
- `src/pages/PaginaIncidencias.tsx/.css` (D4): mensaje temporal de confirmación tras registrar con éxito y actualización reactiva de la vista.

**Archivos tocados:** `src/services/incidenciasService.ts`, `src/components/FormularioIncidencia.tsx`, `src/components/FormularioIncidencia.css`, `src/pages/PaginaIncidencias.tsx`, `src/pages/PaginaIncidencias.css`.
