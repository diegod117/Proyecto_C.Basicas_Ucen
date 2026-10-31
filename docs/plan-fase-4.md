# Plan de implementación — Fase 4: línea base v1.0

**Johann trabaja solo** en esta fase (Diego y Martín no hacen cambios por ahora).
Continúa `docs/plan-fase-3.md` (Firestore, ya en `main`) y las mejoras de la segunda presentación y de React Router (`docs/avance/2026-10-12-*.md`).
Los requerimientos vigentes son los de **`docs/linea-base-v1.md`** (validación con el stakeholder del 14-10-2026). Cuando contradicen a `docs/requerimientos.md`, manda la línea base.

## ¿Por qué esta fase?

La validación con el stakeholder cambió el inventario de **cantidades por estado** a **unidades específicas con número de serie**, agregó entradas y salidas, fecha de adquisición, gestión de usuarios, correos y carga desde Excel. El código de `main` cubre las historias de la versión anterior; esta fase lo acerca a la línea base.

**Reglas de trabajo** (ver `CLAUDE.md`): una historia de usuario por rama (`feature/hu-XX-descripcion-corta`), commits pequeños en español, `npm run build` y `npm run lint` antes del PR, una entrada nueva en `docs/avance/` por tarea, y **no se hace merge**: Johann aprueba cada PR. IDs de la bitácora desde **J29**.

> Este plan es la propuesta. **No se escribe código hasta que Johann lo confirme** y resuelva las decisiones marcadas con 🔶 (sección 4).

---

## 1. Comparación: línea base vs. lo que hay en `main`

Estados: **Hecho** (cumple la línea base), **Parcial** (existe, pero falta algo de la línea base) y **Pendiente** (no existe).
Revisado el 31-10-2026 contra el código de `main` (`e87557e`) y `docs/avance/`.

### Requisitos funcionales

| ID | Estado | Qué hay en `main` | Qué falta |
|---|---|---|---|
| RF-01 | **Parcial** | Cambio de estado por **cantidad** de unidades, con motivo, y registro en el historial (`FormularioCambioEstado`, `recursosService.cambiarEstadoRecurso`). Existe el estado `dado_de_baja`. | Elegir **unidades específicas** por número de serie; distinguir daño reparable (→ en mantención) de irreparable (→ dado de baja). Depende de RF-11. |
| RF-02 | **Hecho** | Búsqueda por nombre, filtros de categoría, laboratorio y estado, y paginación de 9 (`useFiltrosInventario`). | Solo el filtro de antigüedad, que es RF-12. |
| RF-03 | **Parcial** | Reserva con fecha, horario, cantidad, asignatura y sala elegida de las **salas libres**; valida stock y fechas pasadas; "Mis reservas" con Programada / En curso / Realizada. | El correo al confirmar o cancelar (RF-09). |
| RF-04 | **Hecho** | Panel de alertas por tipo con filtro; las alertas se **calculan** desde el inventario (`utils/alertas.ts`). Los consumibles se descuentan. | Nada de lógica. Revisar si se muestra el "origen" (CA-05.2). |
| RF-05 | **Parcial** | Formulario de incidencias, estado inicial "Pendiente", historial y avance de estado. | Indicar la **unidad** afectada (CA-12.4). Verificar CA-04.4 (máximo 5 acciones). |
| RF-06 | Eliminado | — | No se implementa. |
| RF-07 | Pendiente de confirmar | — | No se implementa. |
| RF-08 | **Parcial** | Categorías configurables en Firestore (`/configuracion`, `SeccionCategorias`). | La **descripción breve** de cada categoría. |
| RF-09 | **Parcial** | Contador de alertas pendientes en el menú (`MenuNavegacion`, `badge-alertas-menu`). | Los **correos** (reserva confirmada o cancelada, y acceso del usuario nuevo). |
| RF-10 | **Parcial** | Ubicación obligatoria (torre, sala, bodega, mueble) con código generado; torres y salas desde Configuración. | **Modificar** la ubicación desde la ficha y guardar cada cambio en el historial. |
| RF-11 | Pendiente | Solo existe un campo `numeroSerie?` por recurso. | Una unidad por número de serie o de inventario. |
| RF-12 | Pendiente | — | Fecha de adquisición, antigüedad y filtro. |
| RF-13 | **Parcial** | `reponerStock` y el tipo `alta` (entrada de reposición y alta inicial). | Entradas de adquisición y préstamo; **salidas** por daño reparable o irreparable; tipo y motivo. |
| RF-14 | Pendiente | Los roles están fijos en `src/data/usuarios.ts`. | Gestionar usuarios desde Configuración. |
| RF-15 | Pendiente | — | Carga desde `.xlsx`. |

### Historias de usuario

| HU | Estado | Observación |
|---|---|---|
| HU-01 | **Parcial** | CA-01.2 y CA-01.3 cumplidos. Falta confirmar el texto exacto de CA-01.4 ("No se encontraron recursos con esos filtros") y CA-01.5 (360 px; la bitácora probó 390 px). El filtro de antigüedad va en HU-13. |
| HU-02 | **Parcial** | Cambia por cantidad, no por unidad (CA-02.2, CA-02.3, CA-02.4). Se rehace sobre HU-12. |
| HU-03 | **Parcial** | CA-03.1 a CA-03.3 cumplidos. Falta el correo (CA-03.4), que va en HU-17. |
| HU-04 | **Parcial** | Falta elegir la unidad (CA-12.4). CA-04.3 y CA-04.4 se verifican en la prueba. |
| HU-05 | **Hecho** | CA-05.1 a CA-05.4 funcionan (alertas calculadas: no se duplican y desaparecen solas). Verificar que cada alerta muestre el origen. |
| HU-06 | **Parcial** | El historial guarda cambio de estado, reposición y alta. Faltan tipos *entrada*, *salida* y *cambio de ubicación*, y los campos valor anterior y valor nuevo (CA-06.1). Las reglas ya impiden modificar y borrar (CA-06.2). |
| HU-07 | Hecho | Disponibilidad por horario (sin cambios en la línea base). |
| HU-08 | **Hecho** | Stock y salas ocupadas (CA-08.3) cumplidos. |
| HU-09 | Hecho | Alertas automáticas. CA-09.4 se cumple porque se calculan. |
| HU-10 | Hecho | Incidencias con fecha automática, usuario y estado inicial. |
| HU-11 | **Parcial** | Ubicación obligatoria con código (CA-11.1 cumplido). Falta cambiarla desde la ficha (CA-11.2) y el historial (CA-11.3). |
| HU-12 | Pendiente | Unidades con número de serie. |
| HU-13 | Pendiente | Fecha de adquisición y filtro de antigüedad. |
| HU-14 | **Parcial** | Solo existe la reposición. |
| HU-15 | Pendiente | Usuarios desde Configuración. |
| HU-16 | Pendiente | Carga desde Excel. |

### Requisitos no funcionales

| ID | Estado | Observación |
|---|---|---|
| RNF-01 | Parcial | Probado a 390 px; falta probar 360 px. |
| RNF-02 | Por verificar | Contar las acciones de la incidencia. |
| RNF-03 | **Parcial** | Los permisos por rol los aplica solo la app. Las reglas de Firestore no distinguen roles porque los roles no están en Firestore. Se resuelve con HU-15 (🔶 D6). |
| RNF-04, 07, 09, 11 | Por confirmar | Medir alertas, búsqueda y contraste en la prueba final. |
| RNF-05 | Hecho | Categorías, torres y salas desde Configuración. |
| RNF-06 | **Parcial** | Las reglas ya bloquean modificar y borrar el historial. Falta el respaldo semanal (🔶 D7). |
| RNF-08 | Parcial | "Mis reservas" filtra por docente en la app; las reglas permiten leer todas las reservas. Igual que RNF-03. |
| RNF-10 | Hecho | Recuperación por enlace al correo. Firebase exige 6 caracteres. |

### Fuera de la primera versión (no se implementa)

Acta de baja formal (RF-NEW-04), permisos temporales (RF-NEW-06), vista por laboratorio (RF-NEW-08), login institucional (RF-NEW-09), RF-06 y RF-07.

---

## 2. Cómo se reparte el trabajo

Se agrega una historia nueva que la línea base no numera, **HU-17**, solo para poder dar al correo de reservas su propia rama. Si prefieres no inventar IDs, el correo de reservas se une a HU-15.

> Los números de commit J29 en adelante se usan en el orden de la sección 3. Cada fila es **una rama y un PR**.

---

## 3. Orden de trabajo (una HU por rama)

El orden respeta las dependencias: primero el modelo de datos (unidades y historial), después lo que se apoya en él.

| Orden | ID | Rama | HU / RF | Qué se hace | Necesita decisión |
|---|---|---|---|---|---|
| 0 | J29 | `docs/fase-4-linea-base` | — | Este plan, la línea base, `CLAUDE.md` y `.claude/settings.json`. | — |
| 1 | J30 | `feature/hu-12-unidades-serie` | HU-12, RF-11 | Tipo `Unidad` (id, número, estado). Agregar un equipo o instrumento con cantidad N pide N números; sin repetidos; la ficha muestra la tabla de unidades. Las cantidades por estado se **calculan** desde las unidades. Los insumos y reactivos siguen con cantidades. | 🔶 D1, D2 |
| 2 | J31 | `feature/hu-06-historial-completo` | HU-06, RF-13 | Ampliar el historial: tipos *entrada*, *salida* y *cambio de ubicación*, valor anterior y nuevo, unidad. Consulta por recurso, del más reciente al más antiguo. | 🔶 D3 |
| 3 | J32 | `feature/hu-02-estado-por-unidad` | HU-02, RF-01 | "Cambiar estado" elige unidades por número de serie (equipos e instrumentos) o cantidad (insumos y reactivos). Motivo obligatorio; daño irreparable → "dado de baja". | — |
| 4 | J33 | `feature/hu-14-entradas-salidas` | HU-14, RF-13 | Formularios de entrada (adquisición, préstamo, reposición) y salida (daño reparable o irreparable), con tipo y motivo. Reutiliza `reponerStock`. | — |
| 5 | J34 | `feature/hu-04-incidencia-con-unidad` | HU-04, RF-05 | La incidencia permite indicar la unidad. Verificar CA-04.3 y CA-04.4. | — |
| 6 | J35 | `feature/hu-11-modificar-ubicacion` | HU-11, RF-10 | Botón "Cambiar ubicación" en la ficha (solo encargado), con las listas de Configuración; cada cambio queda en el historial. | 🔶 D3 (reglas) |
| 7 | J36 | `feature/hu-13-fecha-adquisicion` | HU-13, RF-12 | Campo en "Agregar recurso" (no futura), antigüedad en la ficha y filtro (menos de 1 año, 1 a 2, más de 2). | 🔶 D3 (recursos ya guardados) |
| 8 | J37 | `feature/rf-08-descripcion-categorias` | RF-08 | Descripción breve en cada categoría (formulario y lista en Configuración). | 🔶 D3 (categorías ya guardadas) |
| 9 | J38 | `feature/hu-15-usuarios` | HU-15, RF-14 | Sección "Usuarios" en Configuración (solo encargado): agregar, cambiar rol y desactivar. Los roles pasan de `data/usuarios.ts` a Firestore. | 🔶 D4, D5, D6 |
| 10 | J39 | `feature/hu-17-correos-reservas` | RF-09, HU-03 (CA-03.4) | Correo al docente al confirmar o cancelar una reserva (recurso, cantidad, fecha, horario y sala). | 🔶 D5 |
| 11 | J40 | `feature/hu-16-carga-excel` | HU-16, RF-15 | Subir `.xlsx`, vista previa con filas válidas y con error, guardar solo las válidas. | 🔶 D8, y falta la planilla real |
| 12 | J41 | `feature/rnf-cierre-fase-4` | RNF-01, 02, 03, 06, 08 | Pruebas completas a 360 px, conteo de acciones de la incidencia, reglas por rol, respaldo; HU-01 (texto de CA-01.4). | 🔶 D6, D7 |

**Por qué este orden:** HU-12 cambia la forma de guardar un recurso, así que todo lo que toca estados (HU-02, HU-04, HU-14) va **después**. HU-06 va antes de HU-02 y HU-14 para que ya existan los tipos de movimiento que escriben. HU-15 va antes de los correos porque el acceso del usuario nuevo también es un correo. HU-16 va al final porque depende de la planilla real y de una librería.

**Cada rama sigue el flujo de `CLAUDE.md`:** plan corto → confirmación de Johann → implementar → `npm run build` y `npm run lint` → explicar y cómo probar → archivo en `docs/avance/` → commit, push y PR. No se empieza la siguiente historia hasta que Johann confirme que el PR anterior está en `main`.

---

## 4. Decisiones que necesita Johann 🔶

### Decisiones tomadas (31-10-2026)

| ID | Decisión |
|---|---|
| D1 | Las unidades van como arreglo `unidades` dentro de cada documento de `recursos`. |
| D2 | Campo `usaNumeroSerie` en `Categoria`, igual que `usaStockMinimo`. |
| D3 | Campos nuevos **opcionales** en los datos ya guardados (la app los completa al editar). Las reglas se actualizan en `docs/firestore.rules` y se pegan en la consola en cada rama que las cambie. |
| D4 | Cuentas nuevas con una segunda instancia de la app de Firebase; desactivar con `activo: false` en Firestore, y la app niega el ingreso. |
| D5 | Por ahora **solo** el correo de recuperación de contraseña (`sendPasswordResetEmail`). HU-17 (correos de reserva) queda **en espera**. |
| D6 | Los roles pasan a Firestore (colección `usuarios`) junto con HU-15, y las reglas distinguen al encargado. |
| D7 | Respaldo semanal: queda para después. |
| D8 | Se instala la librería para leer `.xlsx` (en la rama de HU-16, no antes). |
| Nuevo | Se viene la etapa de **backend con otra base de datos**. Todo el acceso a datos se mantiene dentro de `src/services/` y sin tipos de Firebase fuera de ellos, para que la migración cambie solo los servicios. Ver `docs/avance/` de cada rama. |

Lo que sigue en esta sección es el detalle original de cada decisión, para referencia.

Ninguna de estas se resuelve sin tu respuesta: `CLAUDE.md` pide preguntar antes de agregar librerías, servicios o backend nuevos, y antes de inventar lo que está "pendiente de confirmar".

### Librerías y servicios nuevos

- **🔶 D8 — Librería para leer `.xlsx` (HU-16).** Leer un `.xlsx` en el navegador necesita una librería (por ejemplo `xlsx` / SheetJS). Opciones: (a) instalar una librería; (b) aceptar solo `.csv`, sin librería, pero la línea base (CA-16.1) pide `.xlsx`; (c) pedir a la encargada que exporte a CSV mientras tanto. *Recomendación: (a), si la apruebas.*
- **🔶 D5 — Servicio de correo (RF-09, HU-15, HU-17).** Hay tres caminos y ninguno está en el proyecto hoy:
  1. **Extensión "Trigger Email" de Firebase** con un proveedor SMTP: exige pasar Firebase al **plan Blaze** (de pago, con tarjeta) y sumar Cloud Functions.
  2. **Servicio externo** (EmailJS, Resend, etc.): es otro servicio y la clave quedaría en el navegador.
  3. **Sin servicio nuevo:** para el acceso del usuario nuevo, `sendPasswordResetEmail` (ya lo usamos en "¿Olvidaste tu contraseña?") sirve como "enlace para crear la contraseña" (CA-15.2). Para los correos de reserva no hay equivalente.
  *Hasta que decidas, HU-15 se puede hacer con la opción 3 y HU-17 queda bloqueada. La fase 3 ya dejó anotado que enviar correos automáticos desde Firebase requiere Blaze.*

### Consola y reglas de Firebase

- **🔶 D3 — Reglas de Firestore y datos ya guardados.** Las reglas actuales (`docs/firestore.rules`) solo dejan modificar `cantidades` en `recursos`, y **no** dejan modificar `categorias`. Para esta fase hay que cambiarlas: `recursos` (ubicación, fecha de adquisición, unidades), `categorias` (descripción) y `historial` (nuevos tipos). Además, los recursos y categorías que **ya están en tu Firestore** no tienen los campos nuevos. Opciones: (a) tratar los campos nuevos como opcionales y que la app los complete al editar; (b) borrar las colecciones desde la consola para que se vuelvan a subir los datos de prueba. Las reglas se pegan a mano en la consola de Firebase, como en la fase 3.
- **🔶 D6 — Roles en Firestore y reglas por rol (RNF-03, RNF-08).** La línea base exige que "crear, editar o eliminar" sea exclusivo del encargado **también en las reglas**. Hoy las reglas solo piden una sesión iniciada. Para distinguir roles, los usuarios deben estar en Firestore (colección `usuarios`) y las reglas deben leerla. Eso se hace junto con HU-15. ¿Lo hacemos así, o las reglas por rol quedan para otra etapa?
- **🔶 D4 — Crear y desactivar usuarios (HU-15).** Desde el navegador no se puede crear una cuenta de Firebase Authentication sin cerrar tu propia sesión (`createUserWithEmailAndPassword` inicia sesión con la cuenta nueva), ni deshabilitar una cuenta (eso lo hace el Admin SDK). Opciones: (a) crear las cuentas con una segunda instancia de la app de Firebase y marcar `activo: false` en Firestore, de modo que la app niegue el ingreso a un usuario desactivado (la cuenta de Authentication seguiría existiendo); (b) usar Cloud Functions (exige Blaze, ver D5). *Recomendación: (a).* También confirmar que **"Usuario no registrado"** se muestre cuando el correo no está en la colección `usuarios`.
- **🔶 D7 — Respaldo semanal (RNF-06).** Los respaldos programados de Firestore (últimas 4 copias) se configuran en la consola y, según el plan de Firebase, pueden exigir **Blaze**. ¿Se configura o se documenta como pendiente?

### Modelo de datos

- **🔶 D1 — Dónde se guardan las unidades (HU-12).** (a) Un arreglo `unidades` dentro de cada documento `recursos/{id}` (simple, cabe bien con 2.000 recursos de pocas unidades); (b) una subcolección `recursos/{id}/unidades` (más escalable, pero cada ficha hace más lecturas y el código es más largo). *Recomendación: (a), porque es más fácil de explicar.*
- **🔶 D2 — Qué categorías usan número de serie.** La línea base dice "equipos e instrumentos". Como las categorías son configurables, propongo un campo `usaNumeroSerie` en `Categoria`, igual que ya existe `usaStockMinimo`. ¿Te parece, o lo fijamos a las categorías `equipo` e `instrumento`?

### Pendientes de la línea base (sección 6, no inventar)

- Con cuánta anticipación se puede reservar y la duración máxima de una reserva.
- Quién define el stock mínimo de cada insumo.
- Si el docente ve o no los recursos dados de baja.
- Si el director de carrera o compras necesitan acceso.
- La **planilla Excel real** (la necesita HU-16).

Mientras no haya respuesta, el código no las aplica.

---

## 5. Pensando en el backend (Firebase es temporal)

El profesor indicó que Firebase/Firestore es una base **temporal** y que más adelante se migra a un backend con otra base de datos (todavía sin definir). Reglas para el código nuevo de esta fase:

1. Todo acceso a datos queda en `src/services/`. Las páginas y componentes no importan `firebase`. Hoy ya se cumple.
2. La lógica de negocio (validar, calcular, leer el Excel) va en `src/utils/` como funciones puras, sin Firebase. Así se reutiliza tal cual con el backend nuevo. Ej.: la lectura del `.xlsx` devuelve recursos y no guarda nada.
3. Fechas como texto, ids numéricos y datos planos (sin `Timestamp` ni referencias de Firestore).
4. Ningún tipo de Firebase en `src/types/`.
5. Cada servicio expone las mismas funciones de siempre (`obtener…`, `agregar…`, `cambiar…`); al migrar se reescribe por dentro y el resto de la app no cambia.
6. **Trabajo que se botaría al migrar:** las reglas de Firestore por rol y la creación de cuentas con una segunda instancia de Firebase (D4 y D6). Por eso HU-15 (J38) se hace **al final**, o después de saber el backend, y no se invierte más en reglas de las necesarias.
7. Anotado: `recursosService` y `historialService` comparten un `writeBatch` (se pasa de uno al otro). Es interno de `services/` y se reescribe junto con ellos, así que no se toca ahora.

---

## 6. Lo que no cambia

- Stack: React + TypeScript con Vite, Firebase (Authentication + Firestore) y React Router. **No se instala nada** sin tu aprobación (hoy, solo D8 lo necesitaría).
- Las lecturas siguen usando la copia en memoria de cada servicio y las escrituras son `async` (ver `docs/plan-fase-3.md`, sección 1).
- La estructura de carpetas, el estilo de código y los comentarios de `CLAUDE.md`.
