# Plan de implementación — Fase 3: guardar los datos en Firestore

Integrantes de esta fase: **Johann Cortés y Diego Cortés**.
Continúa `docs/plan-implementacion.md` y `docs/plan-fase-2.md`. Las fases 1 y 2 ya están en `main`.

## ¿Por qué esta fase?

Hoy todos los datos viven **en la memoria del navegador**. Al recargar la página se pierden las reservas, las incidencias, los cambios de estado y las reposiciones. Eso no cumple **RNF-06** ("el historial no se pierde ni se sobrescribe") y además arruina la demo con cualquier recarga.

**Firestore** es la base de datos de Firebase. Ya usamos Firebase para el login, está incluido en el plan gratuito (Spark) y no requiere instalar nada nuevo: viene en el paquete `firebase`.

| Integrante | Parte | Commits |
|---|---|---|
| **Johann** | Conexión con Firestore, carga de datos al iniciar sesión, recursos, historial y reglas de seguridad | J23 a J28 |
| **Diego** | Incidencias y reservas | D22 a D28 |

> Martín no participa en esta fase. Las reservas son su área, así que Diego **le avisa** cuando toque `FormularioReserva.tsx` y `TablaReservas.tsx`.

---

## 1. Cómo funciona (leer antes de empezar)

### La idea: una "copia en memoria"

Hoy las páginas leen los datos **al instante**: `obtenerRecursos()`, `obtenerReservas()`… se usan en al menos 7 lugares (páginas, formularios, alertas y disponibilidad). Firestore, en cambio, responde **por internet** y tarda. Si cada lectura esperara a Firestore, habría que cambiar todas las pantallas.

Para evitarlo, cada servicio **mantiene su lista en memoria como ahora**, pero:

1. **Al iniciar sesión**, App descarga todo desde Firestore y llena esas listas (una sola vez). Mientras tanto muestra "Cargando datos...".
2. **Al leer**, nada cambia: las páginas siguen usando `obtenerRecursos()`, etc., que leen la copia en memoria.
3. **Al guardar**, el servicio escribe **en Firestore** y, si salió bien, actualiza la copia en memoria.

```
                    ┌─────────────── al iniciar sesión (una vez) ───────────────┐
                    ▼                                                            │
Firestore (internet) ──► lista en memoria del servicio ──► páginas (leen igual que antes)
        ▲                                                                       │
        └────────────── al guardar: el servicio escribe aquí primero ◄──────────┘
```

**Lo que hay que saber explicar en la presentación:**
- **Firestore es el original; la memoria es una copia** para que las pantallas no tengan que esperar.
- Las **lecturas no cambian**. Las funciones que **guardan** pasan a ser `async`, igual que `iniciarSesion()`: devuelven una `Promise` y se usan con `await`.
- **Límite conocido:** si otro usuario guarda algo, lo ves al recargar la página, no al instante. Para el MVP basta así; el tiempo real (`onSnapshot`) queda como mejora opcional.

### Cómo se guardan los datos

| Colección en Firestore | Servicio | Responsable |
|---|---|---|
| `recursos` | `recursosService.ts` | Johann |
| `historial` | `historialService.ts` | Johann |
| `incidencias` | `incidenciasService.ts` | Diego |
| `reservas` | `reservasService.ts` | Diego |

- **Cada documento usa como nombre su `id` convertido a texto**: el recurso con `id: 7` se guarda como `recursos/7`. Así los tipos de `src/types/` **no cambian** y el código que compara ids sigue funcionando.
- **Los ids nuevos se siguen calculando como ahora** (el mayor + 1). Si dos personas guardan en el mismo segundo podrían chocar; para el MVP se acepta.
- **Datos de prueba:** la primera vez que un servicio encuentra su colección **vacía**, sube los datos de `src/data/`. Así nadie tiene que cargarlos a mano.
- `src/data/usuarios.ts` (los roles) **se queda como está** en esta fase.
- Los usuarios y los roles **no** se guardan en Firestore en esta fase.

### Dos detalles técnicos que causan errores si se olvidan

1. **Firestore no acepta `undefined`.** Varios campos son opcionales (`marca?`, `stockMinimo?`, `detalleAfectacion?`…). Por eso J23 configura Firestore con `ignoreUndefinedProperties: true`, que hace que se salten esos campos en vez de dar error.
2. **Lo que viene de Firestore no tiene tipo.** `doc.data()` devuelve un objeto genérico, así que se convierte con `as Recurso` (o `as Reserva`, etc.), igual que el `as EstadoRecurso` que ya usamos en los `<select>`.

---

## 2. Preparar Firestore en la consola (Johann, antes de J23)

1. En la consola de Firebase, abre **Firestore Database → Crear base de datos**.
2. **Ubicación:** la más cercana, por ejemplo Santiago (`southamerica-west1`) si aparece, o São Paulo (`southamerica-east1`). **No se puede cambiar después.**
3. Elige **modo de producción** y luego, en la pestaña **Reglas**, pega estas reglas temporales:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Temporal: cualquier usuario con sesión iniciada puede leer y escribir.
       // J27 las reemplaza por reglas más estrictas.
       match /{documento=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. Publica las reglas.

**Plan gratuito:** 50.000 lecturas y 20.000 escrituras al día. Cada inicio de sesión lee ~25 documentos, así que sobra.

---

## 3. Reglas para no pisarnos

1. **Johann hace primero J23 y J24** (conexión y carga al iniciar sesión) en un PR pequeño. Cambian `firebase.ts` y `App.tsx`, que son compartidos. Diego empieza D22 **después** de hacer Pull de ese PR.
2. Cada uno toca **sus propios servicios**: Johann `recursosService` e `historialService`; Diego `incidenciasService` y `reservasService`.
3. Si alguien necesita cambiar `App.tsx` o `services/cargaDatos.ts`, avisa en el grupo antes.
4. Lo demás sigue igual: una rama por tarea desde `main` actualizado, `npm run build` y `npm run lint` antes del PR, y **un archivo nuevo en `docs/avance/`** por tarea (ver `docs/avance.md`). Como Martín no está, **los PR de Johann los revisa Diego y los de Diego los revisa Johann**.
5. **Probar siempre recargando la página (F5):** si después de recargar el cambio sigue ahí, quedó guardado en Firestore.

---

## 4. Orden de trabajo

| Paso | Johann | Diego |
|---|---|---|
| **0. Base** (PR pequeño, primero) | J23 y J24: conexión, carga al iniciar sesión y recursos | Lee la sección 1 y revisa cómo quedó `recursosService.cargarRecursos()` en J24 |
| **1** | J25 y J26: historial y guardar cambios de estado y reposiciones | D22 a D24: incidencias |
| **2** | J27: reglas de seguridad | D25 a D27: reservas |
| **3. Cierre** | J28 y la prueba completa con Diego | D28 y la prueba completa con Johann |

---

## 5. Plan de Johann: base, recursos, historial y reglas

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| J23 | `feature/firestore-base` | `feat(RNF-06): conecta la aplicación con Firestore` | `services/firebase.ts` | `initializeFirestore(app, { ignoreUndefinedProperties: true })`; exporta `baseDatos`, igual que `autenticacion` |
| J24 | `feature/firestore-base` | `feat(RNF-06): carga los recursos desde Firestore al iniciar sesión` | `services/recursosService.ts`, `services/cargaDatos.ts` (nuevo), `App.tsx` | `cargarRecursos()`: `getDocs()` de la colección; si está vacía, sube `data/recursos.ts`. `cargarTodosLosDatos()` llama a la carga de cada servicio. App muestra "Cargando datos..." con un `useState` y un mensaje si falla |
| J25 | `feature/firestore-historial` | `feat(HU-06): guarda y carga el historial desde Firestore` | `services/historialService.ts`, `cargaDatos.ts` | `cargarHistorial()` con los datos de prueba si está vacía. Ordenar por `id` al cargar, porque Firestore no garantiza el orden |
| J26 | `feature/firestore-historial` | `feat(HU-02): guarda cambios de estado y reposiciones en Firestore` | `recursosService.ts`, `historialService.ts`, `FormularioCambioEstado.tsx`, `FormularioReponerStock.tsx` | `cambiarEstadoRecurso()` y `reponerStock()` pasan a `async`. Con `writeBatch`, el recurso y su registro del historial se guardan **juntos o ninguno**. Los formularios usan `await` y desactivan el botón mientras guardan |
| J27 | `feature/firestore-reglas` | `feat(RNF-06): agrega reglas de seguridad de Firestore` | `docs/firestore.rules` (nuevo; se pega en la consola) | Solo usuarios con sesión. `historial`: se puede crear y leer, **nunca modificar ni borrar** (RNF-06 garantizado por el servidor). `incidencias`: no se pueden borrar |
| J28 | `feature/firestore-reglas` | `docs(RNF-06): registra la prueba de que los datos se mantienen al recargar` | `docs/avance/…` | Recorrer la demo, recargar con F5 en cada paso y anotar el resultado. Probar también en el celular |

**Demo en la exposición:** cambiar el estado del multímetro, **recargar la página** y mostrar que el cambio y su historial siguen ahí. Después, mostrar en la consola de Firebase el documento `recursos/1` con las cantidades nuevas.

---

## 6. Plan de Diego: incidencias y reservas

Diego sigue el mismo patrón de J24 y J26: **cargar** al iniciar sesión y **guardar con `async`**.

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| D22 | `feature/firestore-incidencias` | `feat(HU-10): carga las incidencias desde Firestore` | `services/incidenciasService.ts`, `cargaDatos.ts` | `cargarIncidencias()`: `getDocs()`; si está vacía, sube `data/incidencias.ts`. Se agrega a `cargarTodosLosDatos()` (**avisar a Johann**) |
| D23 | `feature/firestore-incidencias` | `feat(HU-04): guarda las incidencias nuevas en Firestore` | `incidenciasService.ts`, `FormularioIncidencia.tsx` | `agregarIncidencia()` pasa a `async` con `setDoc()`. El formulario espera con `await`, desactiva el botón y muestra un error si falla |
| D24 | `feature/firestore-incidencias` | `feat(HU-10): guarda el avance de estado de las incidencias en Firestore` | `incidenciasService.ts`, `TablaIncidencias.tsx` | `cambiarEstadoIncidencia()` con `updateDoc()`, que cambia **solo** el campo `estado` |
| D25 | `feature/firestore-reservas` | `feat(RF-03): carga las reservas desde Firestore` | `services/reservasService.ts`, `cargaDatos.ts` | Igual que D22, con `data/reservas.ts` |
| D26 | `feature/firestore-reservas` | `feat(HU-03): guarda las reservas nuevas en Firestore` | `reservasService.ts`, `FormularioReserva.tsx` | `agregarReserva()` pasa a `async`. **Avisar a Martín** (es su archivo) |
| D27 | `feature/firestore-reservas` | `feat(RF-03): elimina de Firestore las reservas canceladas` | `reservasService.ts`, `TablaReservas.tsx` | `cancelarReserva()` con `deleteDoc()`. **Avisar a Martín** |
| D28 | `feature/firestore-reservas` | `docs(HU-08): registra la prueba de disponibilidad con datos de Firestore` | `docs/avance/…` | Los termómetros del 09/10 a las 08:30 siguen bloqueados después de recargar. Una reserva nueva y una cancelada se mantienen al recargar |

**Demo en la exposición:** registrar una incidencia, recargar y mostrar que sigue ahí con su fecha y "Registrada por". Luego reservar y mostrar que, después de recargar, ese horario ya tiene menos unidades disponibles.

---

## 7. Cierre de la fase (Johann y Diego)

- Probar con **dos navegadores a la vez** (por ejemplo, encargado en el PC y docente en el celular): lo que guarda uno lo ve el otro **al recargar**.
- Revisar que las funciones `async` nuevas tengan comentarios que expliquen `async`, `await` y `Promise`.
- Actualizar la demo completa: login → inventario → ficha → reserva → incidencia → alertas → **recargar** → cerrar sesión.
- Opcional: botón "Restablecer datos de prueba", solo para el encargado, para dejar la base igual antes de cada ensayo de la demo.
- Opcional: actualizaciones en tiempo real con `onSnapshot`.

## 8. Preguntar al profesor

- **RF-09 (notificaciones por correo):** enviar correos automáticos desde Firebase requiere el plan de pago (Blaze). Dentro de la plataforma ya existen: panel de alertas y contador en el menú.
- **RF-06 (solicitudes de material) y RF-07 (resumen diario):** quedan para la fase 4 y se apoyan en los datos de esta fase.
- **Roles en Firestore:** hoy los roles están en `data/usuarios.ts`. Moverlos a Firestore permitiría que las reglas del servidor también apliquen RNF-03. ¿Hace falta para la entrega?
