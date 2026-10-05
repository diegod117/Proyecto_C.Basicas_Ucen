# 2026-10-03 — J11: registro del historial de cambios de estado (Johann)

**HU trabajada:** HU-06 (en progreso). Rama: `feature/hu-06-historial-estados`.

**Qué se hizo:**
- Tipo nuevo `src/types/CambioEstado.ts`: id, recurso, fecha, estado anterior, estado nuevo, cantidad, motivo y usuario.
- Datos de prueba nuevos `src/data/historialEstados.ts`: 3 registros (los 2 del multímetro del mockup y 1 de los termómetros), ordenados del más antiguo al más nuevo.
- Servicio nuevo `src/services/historialService.ts`:
  - `registrarCambioEstado()` pone sola la fecha (`obtenerFechaActual()` de Diego) y el usuario ('Encargado (usuario actual)', el mismo texto que usan las incidencias).
  - `obtenerHistorialDeRecurso()` devuelve los cambios de un recurso, del más reciente al más antiguo.
  - No hay funciones para borrar ni modificar registros (RNF-06).
- `recursosService.cambiarEstadoRecurso()` ahora recibe el motivo y registra el cambio en el historial. Así es imposible cambiar un estado sin que quede registrado. `FormularioCambioEstado` le pasa el motivo.
- Probado con un script: un cambio válido queda registrado primero con fecha y usuario; los cambios rechazados (99 unidades, un recurso que no existe) no dejan registro; los demás recursos no se ven afectados.
- El historial todavía no se ve en pantalla: la tabla se agrega en J12.

**Archivos tocados:** `src/types/CambioEstado.ts`, `src/data/historialEstados.ts`, `src/services/historialService.ts`, `src/services/recursosService.ts`, `src/components/FormularioCambioEstado.tsx`, `docs/avance.md`.
