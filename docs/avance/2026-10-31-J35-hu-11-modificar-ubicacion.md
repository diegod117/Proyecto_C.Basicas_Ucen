# 2026-10-31 — J35: modificar la ubicación de un recurso (Johann)

**HU trabajada:** HU-11 (RF-10; CA-11.2 y CA-11.3, sin romper CA-11.1). Rama: `feature/hu-11-modificar-ubicacion`.

**Qué se hizo:**
- La ficha del recurso tiene un recuadro nuevo "Cambiar ubicación" (solo para el encargado). Muestra la ubicación actual y deja elegir la torre y la sala de las listas de Configuración, y escribir la bodega y el mueble. El código nuevo se genera solo (ej: `B307-B1-M2`). El motivo es opcional: si queda vacío, el historial guarda "Cambio de ubicación".
- Validaciones (`validarCambioUbicacion`): hay que elegir la sala, la bodega y el mueble no pueden quedar vacíos, la ubicación tiene que ser distinta a la actual y no puede haber otro recurso con el mismo nombre en esa ubicación (misma regla de duplicados de "Agregar recurso": se sacó a la función `buscarRecursoRepetido` para no repetirla).
- `cambiarUbicacion` (en `movimientosService.ts`) guarda en un solo lote (`writeBatch`) la `ubicacion` del recurso y su registro del historial (`crearRegistroCambioUbicacion`, que ya existía desde HU-06) con la ubicación anterior, la nueva, la fecha y el usuario (CA-11.3). Solo después de que Firestore acepta se actualiza la copia en memoria. Las cantidades, las unidades y las reservas no cambian.
- `CamposUbicacionRecurso` ahora recibe solo los 4 datos de ubicación (`DatosUbicacion`, tipo nuevo) en vez del formulario completo, así lo usan tanto "Agregar recurso" como "Cambiar ubicación".
- Permiso nuevo `puedeCambiarUbicacion` en `utils/permisos.ts` (solo el encargado, igual que las otras acciones de la ficha).
- Reglas de Firestore: la regla de `update` de `recursos` ahora permite cambiar `ubicacion` además de `cantidades` y `unidades`. El historial ya aceptaba el registro nuevo (solo exige sesión iniciada para crear).

**Importante antes de probar:** hay que pegar `docs/firestore.rules` completo en la consola de Firebase (Firestore Database > Reglas > Publicar). Sin eso, Firestore rechaza el cambio y el recuadro muestra "No se pudo cambiar la ubicación".

**Verificación:** `npm run build` y `npm run lint` sin errores. No se probó en el navegador desde la sesión de Claude. Para probarlo: entrar como encargado, abrir la ficha de un recurso, cambiar la sala o la bodega en "Cambiar ubicación", guardar y ver el código nuevo en la ficha y el registro en el historial (ubicación anterior y nueva).

**Archivos nuevos:** `src/components/FormularioCambioUbicacion.tsx/.css`, `docs/avance/2026-10-31-J35-hu-11-modificar-ubicacion.md`.

**Archivos modificados:** `src/types/Recurso.ts`, `src/components/CamposUbicacionRecurso.tsx`, `src/components/FormularioNuevoRecurso.tsx`, `src/components/AccionesRecurso.tsx`, `src/utils/ubicacion.ts`, `src/utils/nuevoRecurso.ts`, `src/utils/permisos.ts`, `src/services/movimientosService.ts`, `docs/firestore.rules`.
