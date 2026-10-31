# 2026-10-31 — J32: cambiar el estado por unidad (Johann)

**HU trabajada:** HU-02 (RF-01, RF-11; CA-02.1 a CA-02.4). Rama: `feature/hu-02-estado-por-unidad`.

**Qué se hizo:**
- Formulario nuevo `FormularioCambioEstadoUnidades` para equipos e instrumentos (recursos que tienen `unidades`, HU-12): una lista con una casilla por unidad (número de serie y estado actual), el estado nuevo y el motivo (CA-02.2). Los insumos y reactivos siguen con `FormularioCambioEstado`, por cantidad.
- `utils/cambioEstado.ts`: `validarCambioEstadoUnidades` (al menos una unidad marcada, ninguna ya en el estado nuevo, motivo obligatorio) y `textoResumenCambioUnidades` (mensaje de confirmación, CA-02.4).
- `recursosService.ts`: función nueva `cambiarEstadoUnidades`. Cambia el estado de cada unidad marcada, recalcula `cantidades` con `contarUnidadesPorEstado` y guarda en **un solo lote** el recurso y **un registro de historial por unidad**, con su número de serie en `unidad`. `guardarCambioConHistorial` ahora recibe una lista de registros y, opcionalmente, las unidades nuevas.
- Ids del historial: `crearRegistroCambioEstado` calcula "el mayor + 1" desde la memoria, y los registros nuevos aún no están ahí, así que varios seguidos habrían quedado con el mismo id. Cada registro toma el id siguiente al del anterior.
- `FichaRecurso.tsx`: los recursos con unidades muestran el formulario nuevo y se quita el aviso provisional de HU-12. "Reponer stock" sigue desactivado en esos recursos hasta HU-14.
- Dar de baja pide confirmación (un daño irreparable se registra pasando la unidad a "Dado de baja"). El motivo sigue siendo obligatorio en todo cambio (la línea base lo exige solo para dañado, en mantención y dado de baja; el actual es más estricto).
- CA-02.1 ya se cumplía: solo el encargado ve el formulario.

**Reglas de Firestore:** `docs/firestore.rules` ahora permite modificar `unidades` además de `cantidades` en `recursos`. **Hay que pegar el archivo completo en la consola de Firebase (Firestore Database > Reglas > Publicar) antes de probar**; si no, el guardado falla por permisos.

**Verificación:** `npm run build` y `npm run lint` sin errores. No se probó en el navegador desde la sesión de Claude (requiere iniciar sesión y publicar las reglas).

**Ojo:** `recursosService.ts` (~340 líneas) ya pasaba de ~150; se podría dividir más adelante (por ejemplo, separar el cambio de estado), pero no se refactorizó para no mezclar con la historia.

**Archivos nuevos:** `src/components/FormularioCambioEstadoUnidades.tsx/.css`.

**Archivos modificados:** `src/utils/cambioEstado.ts`, `src/services/recursosService.ts`, `src/components/FichaRecurso.tsx`, `docs/firestore.rules`.
