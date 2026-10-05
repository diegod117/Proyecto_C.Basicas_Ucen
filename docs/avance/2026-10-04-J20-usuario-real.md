# 2026-10-04 — J20: el usuario real queda en el historial y en las incidencias (Johann)

**Trabajado:** HU-06 y HU-10 (fase 2). Rama: `feature/usuario-real`.

**Qué se hizo:**
- Se eliminó el texto fijo "Encargado (usuario actual)". Ahora el nombre de quien inició sesión viaja como parámetro: login → `App` → página → componente → servicio.
- Historial de estados (HU-06):
  - `FichaRecurso` le pasa el usuario a `FormularioCambioEstado`.
  - El formulario le entrega `usuario.nombre` a `cambiarEstadoRecurso()` (`recursosService.ts`), que se lo pasa a `registrarCambioEstado()` (`historialService.ts`).
  - Se borró la constante `USUARIO_ACTUAL`.
- Incidencias (HU-10):
  - `PaginaIncidencias` le pasa el usuario a `FormularioIncidencia`, que guarda `registradaPor: usuario.nombre`.
  - `TablaIncidencias` tiene una columna nueva "Registrada por" (archivo de Diego, avisado), porque antes ese dato se guardaba pero no se mostraba en ninguna pantalla.
- Se probó en el navegador como encargado:
  - un cambio de estado en la ficha del multímetro queda en el historial con su nombre;
  - una incidencia nueva muestra su nombre en "Registrada por".

**Archivos tocados:** `src/services/historialService.ts`, `src/services/recursosService.ts`, `src/components/FormularioCambioEstado.tsx`, `src/components/FichaRecurso.tsx`, `src/components/FormularioIncidencia.tsx`, `src/components/TablaIncidencias.tsx`, `src/pages/PaginaIncidencias.tsx`, `docs/avance.md`.
