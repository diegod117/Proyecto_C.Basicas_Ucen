# 2026-10-31 — J34: incidencia con unidad afectada (Johann)

**HU trabajada:** HU-04 (RF-05; CA-04.3, CA-04.4 y CA-12.4). Rama: `feature/hu-04-incidencia-con-unidad`.

**Qué se hizo:**
- `Incidencia` tiene un campo opcional nuevo `unidad` (número de serie o de inventario).
- `CampoUnidadIncidencia` (nuevo): lista desplegable "Unidad afectada (opcional)" con "Sin indicar" por defecto y cada unidad con su número y estado. Solo aparece si el recurso elegido tiene unidades. Es opcional para que el camino mínimo siga siendo de 5 acciones (menú → recurso → docente → descripción → enviar, RNF-02 y CA-04.4); si fuera obligatoria serían 6.
- `FormularioIncidencia`: muestra ese campo, lo borra al cambiar de recurso y manda la unidad al guardar. La incidencia **no** cambia el estado de la unidad (CA-04.3): eso se hace aparte con "Cambiar estado de unidades" o "Registrar salida".
- `TablaIncidencias`: la columna del recurso agrega "· unidad X" cuando hay.
- `incidenciasService.ts` no cambió: ya guarda todos los campos que recibe. Las reglas de Firestore tampoco cambian.

**Verificado leyendo el código (sin cambios):** CA-04.3 (nace "Pendiente" y no toca el estado del recurso) y CA-04.4 (si falta un campo el mensaje dice cuál y lo escrito se conserva).

**Verificación:** `npm run build` y `npm run lint` sin errores. No se probó en el navegador desde la sesión de Claude.

**Archivos nuevos:** `src/components/CampoUnidadIncidencia.tsx`.

**Archivos modificados:** `src/types/Incidencia.ts`, `src/components/FormularioIncidencia.tsx`, `src/components/TablaIncidencias.tsx/.css`.
