# 2026-10-03 — D5 a D8: historial de incidencias y avance de estado (Diego)

**HU trabajada:** HU-10 (historial de incidencias con estado) y RF-05.

**Qué se hizo:**
- `src/utils/fechas.ts` (D5): función `obtenerFechaActual()` en formato `AAAA-MM-DD HH:MM`. Toda incidencia nace con fecha automática y estado `pendiente`.
- `src/components/TablaIncidencias.tsx/.css` (D6, D8): tabla con historial de incidencias que muestra fecha, nombre de recurso (resuelto por `recursoId`), descripción, etiqueta de estado y columna de acciones.
- `src/components/EtiquetaEstadoIncidencia.tsx/.css` (D7): componente reutilizable con colores distintivos por estado (`pendiente`: amarillo, `en_revision`: azul, `resuelta`: verde).
- `src/services/incidenciasService.ts` (D8): función `cambiarEstadoIncidencia(id, nuevoEstado)` que permite avanzar el ciclo `pendiente` ➔ `en_revision` ➔ `resuelta`.

**Archivos tocados:** `src/utils/fechas.ts`, `src/services/incidenciasService.ts`, `src/components/TablaIncidencias.tsx`, `src/components/TablaIncidencias.css`, `src/components/EtiquetaEstadoIncidencia.tsx`, `src/components/EtiquetaEstadoIncidencia.css`.
