# 2026-10-31 — J31: historial con entradas, salidas y cambios de ubicación (Johann)

**HU trabajada:** HU-06 (RF-01, RF-13, RF-10; CA-06.1 a CA-06.3). Rama: `feature/hu-06-historial-completo`.

**Qué se hizo:**
- `CambioEstado` (tipo del historial) acepta los tipos nuevos `entrada`, `salida` y `cambio_ubicacion`, además de `cambio_estado` y `alta`. `reposicion` se sigue aceptando, porque los registros antiguos de Firestore no se pueden modificar (RNF-06); los nuevos se guardan como `entrada` con subtipo `reposicion`.
- Campos opcionales nuevos (CA-06.1): `valorAnterior`, `valorNuevo`, `unidad` (número de serie, HU-12) y `subtipo`. Los tipos `TipoEntrada` (adquisición, préstamo, reposición) y `TipoSalida` (daño reparable, daño irreparable) también son nuevos.
- `historialService.ts`: los registros de cambio de estado, reposición y alta llenan `valorAnterior` y `valorNuevo`. `crearRegistroCambioEstado` recibe opcionalmente la unidad. Funciones nuevas `crearRegistroEntrada`, `crearRegistroSalida` y `crearRegistroCambioUbicacion`, que solo **crean** el registro (como las anteriores). Un daño reparable deja la unidad en mantención y uno irreparable la deja dada de baja (CA-14.2).
- `utils/historial.ts` (nuevo): textos de los subtipos y el estado al que pasa una salida.
- `TablaHistorial.tsx`: la celda "Cambio" pasó al componente nuevo `DetalleCambioHistorial.tsx`, que dibuja cada tipo (ej.: `Entrada · Préstamo +2 → Disponible`, `Salida · Daño irreparable: Disponible → Dado de baja (1) · unidad X`, `Ubicación: B307-B1-M2 → B308-B2-M1`).
- CA-06.2 y CA-06.3 ya se cumplían: las reglas de Firestore no dejan modificar ni borrar el historial, y la consulta por recurso va del más reciente al más antiguo.
- Las reglas de Firestore **no cambian**.

**Qué falta para que se vea en la app:** nada escribe todavía los tipos nuevos. Los usan HU-02 (cambio de estado por unidad), HU-14 (entradas y salidas) y HU-11 (cambio de ubicación). Con HU-06 solo quedan listos el modelo, las funciones y la tabla.

**Verificación:** `npm run build` y `npm run lint` sin errores. Los registros que ya existen se muestran igual que antes. No se probó en el navegador desde la sesión de Claude.

**Archivos nuevos:** `src/utils/historial.ts`, `src/components/DetalleCambioHistorial.tsx`.

**Archivos modificados:** `src/types/CambioEstado.ts`, `src/services/historialService.ts`, `src/components/TablaHistorial.tsx`.
