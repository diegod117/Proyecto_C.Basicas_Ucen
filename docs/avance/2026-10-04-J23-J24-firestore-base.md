# 2026-10-04 — J23 y J24: conexión con Firestore y carga de recursos (Johann)

**Trabajado:** RNF-06 (fase 3, ver `docs/plan-fase-3.md`). Rama: `feature/firestore-base`.

**Qué se hizo:**
- Se creó la base de datos de Firestore en la consola de Firebase, con las reglas temporales del plan (solo usuarios con sesión iniciada pueden leer y escribir).
- `services/firebase.ts` (J23): exporta `baseDatos`, creada con `initializeFirestore(app, { ignoreUndefinedProperties: true })`. Esa opción es necesaria porque varios campos son opcionales (`marca?`, `stockMinimo?`…) y Firestore no acepta `undefined`.
- `services/recursosService.ts` (J24):
  - la lista en memoria parte vacía;
  - `cargarRecursos()` descarga la colección `recursos` con `getDocs()`;
  - si la colección está vacía (la primera vez), sube los 10 recursos de `data/recursos.ts` con `writeBatch`; cada documento se llama como su id (`recursos/7`);
  - al final ordena por `id`, porque Firestore entrega los documentos ordenados como texto ("1", "10", "2"…).
- `services/cargaDatos.ts` (nuevo): `cargarTodosLosDatos()` llama a la carga de cada servicio y devuelve `''` o un mensaje de error. Por ahora solo carga los recursos; los demás servicios se suman aquí (J25, D22, D25).
- `components/CargadorDatos.tsx` (nuevo):
  - después del login muestra "Cargando datos del inventario..." y luego el menú y las páginas, que recibe como `children`;
  - si la descarga falla, muestra el error y un botón "Reintentar";
  - al terminar avisa a `App` (`onDatosListos`) para que recalcule el contador de alertas del menú, que antes se calculaba con la lista vacía.
- `App.tsx`: envuelve el menú y las páginas con `<CargadorDatos key={correo}>`, así cada usuario que inicia sesión descarga los datos de nuevo. Se dejó en un componente aparte para que `App.tsx` no pasara de ~150 líneas (quedó en 144).
- Se probó en el navegador:
  - al iniciar sesión aparece "Cargando datos..." y luego los 10 recursos, con el contador de alertas correcto;
  - en la consola de Firebase quedó la colección `recursos` con 10 documentos;
  - al recargar, los recursos se descargan desde Firestore sin volver a subirlos.

**Notas:**
- El `useEffect` de `CargadorDatos` tiene un comentario que desactiva una advertencia de `lint` a propósito: si `props` estuviera en sus dependencias, la descarga se repetiría sin parar.
- El build avisa que la app pesa más por el código de Firestore. Es solo una advertencia.
- Los cambios de estado y las reposiciones todavía se guardan solo en memoria: eso lo resuelve J26.

**Archivos tocados:** `src/services/firebase.ts`, `src/services/recursosService.ts`, `src/services/cargaDatos.ts`, `src/components/CargadorDatos.tsx`, `src/App.tsx`, `docs/avance/2026-10-04-J23-J24-firestore-base.md`.
