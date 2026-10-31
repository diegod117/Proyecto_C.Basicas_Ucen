# Línea base de requisitos v1.0 — Sistema de Inventario C. Básicas

Resultado de la reunión de validación con el stakeholder (profesor Luis Sergio Torres, encargado del Departamento de Ciencias Básicas, y la encargada de laboratorio) del **14-10-2026**, documentada en el **Laboratorio N°5** de Ingeniería de Software.

**Este archivo reemplaza a `docs/requerimientos.md` cuando se contradicen.** `requerimientos.md` se mantiene como la versión anterior (v0) y no se modifica.

---

## 1. Qué cambió respecto de `requerimientos.md`

| ID | Estado | Cambio |
|---|---|---|
| RF-01 | Modificado | El estado se cambia por **unidad específica** (número de serie o de inventario), con motivo, y distingue daño reparable de irreparable. |
| RF-02 | Aceptado | Sin cambios (buscador y filtros validados). |
| RF-03 | Aceptado | Sin cambios (reserva inmediata del docente, sin aprobación del encargado). |
| RF-04 | Aceptado | Sin cambios (panel de alertas por tipo; los consumibles se descuentan). |
| RF-05 | Aceptado | Sin cambios. El estado del recurso se cambia **por separado** desde su ficha, no desde la incidencia. |
| RF-06 | **Eliminado** | Solicitudes de material: la reserva (RF-03) ya cumple esa función. No se implementa. |
| RF-07 | Pendiente | Resumen diario desde el celular: falta confirmar con el stakeholder. No se implementa por ahora. |
| RF-08 | Modificado | Categorías configurables, cada una con **descripción breve**. |
| RF-09 | Modificado | Correo al docente al confirmar o cancelar una reserva y al usuario nuevo; contador de alertas en la plataforma. |
| RF-10 | Modificado | La ubicación se puede **modificar** y cada cambio queda en el historial. |
| RF-11 a RF-15 | **Nuevos** | Ver sección 2. |

---

## 2. Requisitos funcionales v1.0

| ID | Requisito | Prioridad | Estado |
|---|---|---|---|
| RF-01 | Cambiar el estado operativo de una o más **unidades específicas** de un recurso. Las unidades de equipos e instrumentos se identifican por número de serie o de inventario, y cada cambio lleva un motivo. Si la salida es por daño irreparable, la unidad pasa a "dado de baja". | Alta | Validado |
| RF-02 | Consultar disponibilidad y cantidad operativa con búsqueda y filtros. | Alta | Validado |
| RF-03 | Reservar recursos por horario, con la sala elegida de una lista de salas libres. | Alta | Validado |
| RF-04 | Generar alertas de reparación, mantención y reposición para el encargado y el departamento. | Alta | Validado |
| RF-05 | Registrar incidencias con fecha, docente presente, descripción, recurso (y unidad) y personas afectadas. | Alta | Validado |
| RF-06 | Solicitudes de material. | — | **Eliminado** |
| RF-07 | Resumen diario de uso desde el celular. | Media | Pendiente |
| RF-08 | Clasificar recursos en categorías configurables, cada una con una descripción breve (ej.: "Instalación: elementos fijos como llaves de gas, data o mesones"). | Media | Validado |
| RF-09 | Enviar un correo al docente al confirmar o cancelar una reserva (recurso, cantidad, fecha, horario y sala) y al usuario nuevo con su acceso; mostrar en la plataforma el contador de alertas pendientes. | Media | Validado |
| RF-10 | Registrar la ubicación física (torre, sala, bodega y mueble, con su código) y permitir modificarla; el historial guarda la ubicación anterior, la nueva, la fecha y el usuario. | Alta | Validado |
| RF-11 | Identificar cada unidad de equipos e instrumentos por número de serie o de inventario. | Alta | Validado |
| RF-12 | Registrar la fecha de adquisición de cada recurso y filtrar el inventario por antigüedad. | Media | Validado |
| RF-13 | Registrar entradas (adquisición, préstamo, reposición) y salidas (daño reparable o irreparable) con tipo y motivo. | Media | Validado |
| RF-14 | Gestionar usuarios desde Configuración: agregar, cambiar rol y desactivar, con envío del acceso por correo. Solo el encargado. | Alta | Validado |
| RF-15 | Cargar el inventario inicial desde la planilla Excel actual. | Alta | Validado |

**Fuera de la primera versión (no implementar sin pedirlo):**
- RF-NEW-04: acta de baja formal (falta el formato institucional; mientras tanto, el motivo queda en el historial).
- RF-NEW-06: permisos temporales de docente con fecha de término.
- RF-NEW-08: vista por laboratorio con la distribución de muebles.
- RF-NEW-09: inicio de sesión con credenciales institucionales.
- Integración con compras, proveedores o Aula Digital.

---

## 3. Requisitos no funcionales v1.0

| ID | Requisito | Estado |
|---|---|---|
| RNF-01 | Aplicación web sin instalación, en las dos últimas versiones de Chrome, Edge, Firefox y Safari, desde 360 px de ancho y sin desplazamiento horizontal. | Validado |
| RNF-02 | Un encargado registra una incidencia en máximo 5 acciones desde el menú y en menos de 2 minutos. | Validado |
| RNF-03 | Solo inician sesión las cuentas registradas por la encargada; cualquier otra recibe "Usuario no registrado". Crear, editar o eliminar recursos, usuarios y configuración es exclusivo del encargado, también en las reglas de Firestore. | Validado |
| RNF-04 | Las alertas aparecen en el panel en máximo 5 segundos; el correo de reserva se envía en máximo 5 minutos. | Por confirmar |
| RNF-05 | Categorías, torres y salas se agregan desde Configuración y quedan disponibles al instante, sin cambiar código. | Validado |
| RNF-06 | Historial, incidencias y reservas no se pueden modificar ni eliminar desde la app; respaldo semanal de la base de datos (últimas 4 copias). | Validado |
| RNF-07 | Búsqueda y filtros en máximo 3 segundos con hasta 2.000 recursos. | Por confirmar |
| RNF-08 | El docente solo ve sus propias reservas e historial. | Validado |
| RNF-09 | Disponibilidad de 99% en horario académico (lunes a sábado, 08:00 a 22:00). | Por confirmar |
| RNF-10 | Contraseñas de al menos 6 caracteres y recuperación por enlace al correo. | Validado |
| RNF-11 | Contraste mínimo 4,5:1; los estados y categorías no se indican solo con color. | Por confirmar |

---

## 4. Historias de usuario

### Modificadas

- **HU-02 (front-end, RF-01, RF-11):** Como encargado de laboratorio, quiero cambiar el estado operativo de unidades específicas de un recurso, identificadas por su número de serie o de inventario, para saber exactamente cuál está dañada, en mantención o dada de baja.
- **HU-06 (back-end, RF-01, RF-13):** Como encargado de laboratorio, quiero que el sistema guarde en un historial cada cambio de estado, entrada, salida y cambio de ubicación, para tener trazabilidad completa de lo que le ha ocurrido a cada recurso.
- **HU-11 (back-end, RF-10):** Como encargado de laboratorio, quiero que cada recurso tenga una ubicación física obligatoria (torre, sala, bodega y mueble) que pueda modificar cuando se reorganice el laboratorio, para encontrarlo rápidamente y evitar el desorden.

### Nuevas

| ID | Tipo | Historia | RF | Prioridad |
|---|---|---|---|---|
| HU-12 | Front / back | Como encargado, quiero registrar cada unidad de un equipo o instrumento con su número de serie o de inventario, para saber exactamente cuál se dañó, está en mantención o fue dada de baja. | RF-11 | Alta |
| HU-13 | Front | Como encargado del departamento, quiero ver la fecha de adquisición de cada recurso y filtrar por antigüedad, para planificar calibraciones, mantenciones o renovaciones. | RF-12 | Media |
| HU-14 | Back | Como encargado, quiero registrar cada entrada (adquisición, préstamo o reposición) y cada salida (daño reparable o irreparable) con su tipo y motivo, para que el inventario refleje todos los movimientos. | RF-13 | Media |
| HU-15 | Front / back | Como encargado, quiero agregar, desactivar y cambiar el rol de los usuarios desde Configuración, y que el sistema envíe el acceso al correo del docente, para administrar el ingreso sin depender del equipo de desarrollo. | RF-14, RF-09 | Alta |
| HU-16 | Back | Como encargado, quiero cargar el inventario actual desde la planilla Excel, para comenzar a usar el sistema sin ingresar cada recurso a mano. | RF-15 | Alta |

---

## 5. Criterios de aceptación (los que cambian o son nuevos)

**HU-01:** CA-01.2 categorías y laboratorios se leen desde Configuración · CA-01.3 9 recursos por página, al cambiar un filtro vuelve a la página 1 · CA-01.4 sin resultados: "No se encontraron recursos con esos filtros" · CA-01.5 usable desde 360 px.

**HU-02:** CA-02.1 solo el encargado ve "Cambiar estado" · CA-02.2 en equipos e instrumentos se eligen las unidades por número de serie o de inventario; en insumos y reactivos se indica la cantidad · CA-02.3 motivo obligatorio para dañado, en mantención o dado de baja; daño irreparable → "dado de baja" · CA-02.4 mensaje de confirmación y la ficha muestra el nuevo estado de cada unidad.

**HU-03:** CA-03.1 fecha, horas, cantidad, asignatura y sala obligatorias; la sala sale de la lista de salas libres · CA-03.2 muestra cuántas unidades hay disponibles en ese horario · CA-03.3 no permite fechas pasadas ni término ≤ inicio · CA-03.4 al confirmar, resumen, la reserva aparece en "Mis reservas" (Programada / En curso / Realizada) y el docente recibe un correo.

**HU-04:** CA-04.3 la incidencia queda "Pendiente" y el estado del recurso se cambia por separado desde su ficha · CA-04.4 máximo 5 acciones; si falta un campo, indica cuál y conserva lo escrito.

**HU-05:** CA-05.1 contador de alertas pendientes en el menú (encargado y departamento) · CA-05.2 cada alerta indica recurso, tipo, fecha y origen, y se filtra por tipo · CA-05.3 la alerta desaparece sola al reparar o reponer · CA-05.4 el docente no ve el panel.

**HU-06:** CA-06.1 cada movimiento guarda fecha y hora, usuario, tipo (cambio de estado, entrada, salida o cambio de ubicación), valor anterior, valor nuevo, cantidad o unidad y motivo · CA-06.2 no se modifica ni elimina · CA-06.3 se consulta por recurso, del más reciente al más antiguo.

**HU-08:** CA-08.3 una sala reservada por otro docente en un horario que se cruza no aparece; el mismo docente sí puede reservar varios recursos para su sala.

**HU-09:** CA-09.4 no se crea una alerta duplicada si ya hay una pendiente para el mismo recurso y motivo.

**HU-11:** CA-11.1 no se guarda un recurso sin torre, sala, bodega y mueble; se genera el código · CA-11.2 el encargado cambia la ubicación desde la ficha, eligiendo de las listas de Configuración · CA-11.3 cada cambio queda en el historial con la ubicación anterior y la nueva.

**HU-12:** CA-12.1 al agregar un equipo o instrumento con cantidad N se piden N números de serie o de inventario · CA-12.2 no se aceptan números repetidos dentro del mismo recurso · CA-12.3 la ficha muestra una tabla con cada unidad, su número y su estado · CA-12.4 al registrar una incidencia o un cambio de estado se puede indicar la unidad.

**HU-13:** CA-13.1 "Agregar recurso" incluye la fecha de adquisición, que no puede ser futura · CA-13.2 la ficha muestra la fecha y la antigüedad en años y meses · CA-13.3 filtro por antigüedad: menos de 1 año, entre 1 y 2 años, más de 2 años.

**HU-14:** CA-14.1 una entrada pide tipo (adquisición, préstamo o reposición), cantidad, fecha y observación, y suma al disponible · CA-14.2 una salida pide tipo (daño reparable → en mantención; daño irreparable → dado de baja) y motivo obligatorio · CA-14.3 cada entrada y salida queda en el historial.

**HU-15:** CA-15.1 solo el encargado ve la sección "Usuarios" en Configuración · CA-15.2 para agregar se pide nombre, correo y rol; no se aceptan correos repetidos y el sistema envía un enlace para crear la contraseña · CA-15.3 el encargado cambia el rol o desactiva un usuario; un usuario desactivado no puede iniciar sesión · CA-15.4 un correo no registrado recibe "Usuario no registrado".

**HU-16:** CA-16.1 acepta un `.xlsx` con las columnas de la planilla actual (descriptor, número de serie, cantidad, marca, proveedor, observación y ubicación) · CA-16.2 vista previa que separa filas válidas de filas con error · CA-16.3 solo se guardan las válidas y se muestra "X recursos cargados, Y con errores" · CA-16.4 los recursos cargados quedan "disponibles" y se pueden corregir desde su ficha.

---

## 6. Pendientes de confirmar con el stakeholder (no inventar)

- Con cuánta anticipación se puede reservar y la duración máxima de una reserva.
- Quién define el stock mínimo de cada insumo.
- Si el docente debe ver o no los recursos dados de baja.
- Si el director de carrera o compras necesitan acceso.
- La planilla Excel real del inventario (el stakeholder la iba a enviar).
