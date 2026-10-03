# Requerimientos — Sistema de Inventario C. Básicas

- **Integrantes:** Johann Cortes, Martin Zepeda Puelles, Diego Cortes
- **Asignatura:** Programación de aplicaciones
- **Fecha:** 01 de octubre de 2026
- **Profesor:** Luis Rojas Rubio

---

## 1. Contexto del proyecto

### 1.1 Organización para la cual se construye la plataforma

La plataforma se desarrolla para el Departamento de Ciencias Básicas de la Universidad Central, que administra los laboratorios de los edificios B y C. En estos laboratorios se utilizan instrumentos, equipos, materiales, insumos y reactivos para las clases prácticas de las asignaturas del departamento. La gestión de los laboratorios está a cargo del profesor Luis Sergio Torres, quien fue el stakeholder entrevistado durante el levantamiento de requerimientos realizado en la asignatura de Ingeniería de Software (profesor Hans Guerrero).

Actualmente el inventario se lleva en una planilla Excel estática, ordenada por ubicación física (bodega y mueble), que registra para cada ítem su descriptor, número de serie, cantidad, marca, proveedor y una observación.

### 1.2 Usuarios de la plataforma

| Usuario | Descripción | Necesidad principal | Uso esperado de la plataforma |
|---|---|---|---|
| **Encargado de laboratorio** | Cargo nuevo que operará el sistema día a día. Es el usuario principal. | Mantener actualizado el estado del inventario. | Registrar y modificar el estado y la ubicación de los recursos, registrar incidencias y gestionar solicitudes de material. Uso principal desde PC/notebook. |
| **Docente** | Profesor que utiliza materiales, instrumentos y equipos en sus clases. | Saber qué recursos hay disponibles y en qué cantidad operativa. | Consultar disponibilidad y reservar recursos por horario, desde PC o celular. |
| **Encargado del Departamento de Ciencias Básicas (Prof. Luis Sergio Torres)** | Administra los laboratorios y supervisa la gestión. | Recibir reportabilidad y alertas de mantención o compra. | Consultar reportes y alertas, principalmente desde PC y celular. No opera el día a día. |

### 1.3 Problema o necesidad que se busca resolver

El problema principal es que no existe forma de saber el estado operativo de los recursos de los laboratorios: la planilla no indica si un ítem está disponible, en uso, dañado, en mantención o dado de baja. Esto genera las siguientes dificultades:

- Los elementos fuera de servicio quedan registrados junto a los operativos, lo que genera confusión.
- Los daños y los insumos agotados se detectan recién en el momento de usar el recurso, en plena clase.
- Los docentes no saben con anticipación qué recursos hay ni en qué cantidad, y pueden necesitar un recurso que otro profesor está usando en el mismo horario (por ejemplo, termómetros).
- Las incidencias y accidentes se registran en una hoja en papel, sin un historial consultable.
- No existen procesos formales de mantención ni de orden de compra asociados al ciclo de vida de cada bien.
- Las solicitudes de material de los docentes se hacen en un formato que el encargado debe verificar manualmente.

Por ello, el departamento busca migrar a un inventario dinámico que muestre en tiempo real la disponibilidad y el estado de cada recurso, diferenciado por categoría, con reservas por horario, registro de incidencias, alertas y reportabilidad accesible desde PC y celular.

---

## 2. Descripción general de la plataforma

La plataforma es un sistema web de gestión de inventario para los laboratorios del Departamento de Ciencias Básicas, que reemplaza la planilla Excel actual por un inventario dinámico. Permitirá registrar cada recurso (instrumentos, equipos, materiales, insumos, reactivos, mobiliario e instalaciones) con su categoría, ubicación física y estado operativo: disponible, en uso, dañado, en mantención o dado de baja. Los docentes podrán consultar, desde el computador o el celular, qué recursos hay y en qué cantidad operativa, y reservarlos para un horario específico sin chocar con otros profesores. El encargado del laboratorio mantendrá actualizado el inventario, registrará incidencias y accidentes con su historial, y gestionará las solicitudes de material de los docentes verificando automáticamente su disponibilidad. El sistema generará alertas de mantención, reparación y reposición, enviará notificaciones por correo y dentro de la plataforma, y entregará al encargado del departamento un resumen diario del uso del laboratorio. El acceso será por roles: el encargado edita el inventario, el docente consulta y reserva, y el departamento revisa reportes y alertas.

---

## 3. Requerimientos del usuario

A continuación se presentan todos los requerimientos definidos en la asignatura de Ingeniería de Software (Laboratorios 2 y 3), sin acotar. Se indica la prioridad asignada en esa asignatura solo como referencia.

### 3.1 Requerimientos funcionales

| ID | Requerimiento | Usuario | Prioridad | Origen / justificación |
|---|---|---|---|---|
| RF-01 | El sistema deberá permitir al encargado registrar y actualizar el estado operativo de cada recurso (disponible, en uso, dañado, en mantención, dado de baja). | Encargado de laboratorio | Alta | La planilla actual no permite saber si un ítem está operativo. |
| RF-02 | El sistema deberá permitir a los docentes consultar la disponibilidad y cantidad operativa de insumos, materiales y equipos. | Docente | Alta | Torres indicó que es lo más importante para los docentes. |
| RF-03 | El sistema deberá permitir a los docentes reservar recursos para un horario específico, mostrando su estado como "disponible" o "en uso". | Docente | Alta | Evitar que un docente necesite un recurso que otro está usando (ej. termómetros). |
| RF-04 | El sistema deberá enviar alertas de mantenimiento, reparación o reposición al encargado y al departamento. | Encargado / Departamento | Alta | Ambos deben gestionar la mantención o compra. |
| RF-05 | El sistema deberá permitir registrar una incidencia, incluyendo fecha, docente presente, descripción, ítem afectado y afectación a usuarios. | Encargado de laboratorio | Alta | Digitaliza la "hoja de incidencia" que se usa hoy, con esos mismos campos. |
| RF-06 | El sistema deberá permitir ingresar una solicitud de material y mostrar automáticamente si está en existencia y operativo. | Encargado de laboratorio | Media | Hoy el docente llena un formato y el encargado verifica manualmente. |
| RF-07 | El sistema deberá generar un resumen diario de uso del laboratorio, accesible desde el celular. | Torres / Encargado | Media | Torres quiere consultar el resumen fuera de la oficina. |
| RF-08 | El sistema deberá permitir clasificar cada recurso en una categoría de inventario (instrumento, insumo, equipo, reactivo, mobiliario, instalación). | Encargado / Departamento | Media | Cada tipo de bien se gestiona de forma distinta. |
| RF-09 | El sistema deberá enviar notificaciones tanto por correo como dentro de la plataforma. | Encargado / Docente | Media | Torres pidió alertas por correo y también dentro de la plataforma. |
| RF-10 | El sistema deberá registrar la ubicación física (laboratorio / bodega / mueble) de cada recurso. | Encargado de laboratorio | Alta | Torres enfatizó la importancia del código de ubicación física. |

### 3.2 Requisitos no funcionales

| ID | Categoría | Requerimiento | Origen / justificación |
|---|---|---|---|
| RNF-01 | Disponibilidad | El sistema deberá poder usarse desde PC/notebook y desde dispositivos móviles. | Se usará principalmente en PC, y en celular en caso de urgencias. |
| RNF-02 | Usabilidad | Un encargado capacitado deberá poder registrar una incidencia en un máximo de 5 pasos desde la pantalla principal. | El registro debe ser rápido dado el ritmo diario del encargado. |
| RNF-03 | Seguridad | El sistema deberá restringir la edición del inventario y de las solicitudes solo al encargado, dejando a los docentes con permisos de consulta (y reserva). | Torres indicó que esa gestión no la debe manejar el docente. |
| RNF-04 | Rendimiento / oportunidad | Las notificaciones de mantención, reposición o incidencias deberán enviarse en un plazo breve desde que se genera el evento. | Hoy las fallas se detectan en el momento de usar el recurso. |
| RNF-05 | Mantenibilidad | El sistema deberá permitir incorporar nuevas categorías de inventario sin requerir cambios estructurales mayores. | La categorización propuesta podría ampliarse con el tiempo. |
| RNF-06 | Respaldo y recuperación | El sistema deberá mantener un historial de incidencias y cambios de estado que no se pierda ni se sobrescriba. | Conservar el historial para trazabilidad y seguridad. |

### 3.3 Historias de usuario asociadas

| ID | Tipo | Historia de usuario | RF |
|---|---|---|---|
| HU-01 | Front-end | Como docente, quiero ver un listado del inventario con filtros por nombre, categoría, laboratorio y estado, para saber antes de ir al laboratorio qué recursos hay y en qué cantidad operativa. | RF-02 |
| HU-02 | Front-end | Como encargado de laboratorio, quiero cambiar el estado operativo de un recurso desde su ficha, para mantener el inventario actualizado sin editar una planilla. | RF-01, RF-10 |
| HU-03 | Front-end | Como docente, quiero reservar un recurso indicando fecha, horario y cantidad en un formulario, para asegurar que estará disponible en mi clase y no lo use otro docente. | RF-03 |
| HU-04 | Front-end | Como encargado de laboratorio, quiero registrar una incidencia desde un formulario simple, para dejar constancia de qué pasó, qué recurso se afectó y si hubo personas afectadas. | RF-05 |
| HU-05 | Front-end | Como encargado del departamento, quiero ver las alertas pendientes en el panel principal, para enterarme a tiempo de qué recursos requieren mantención, reparación o reposición. | RF-04 |
| HU-06 | Back-end | Como encargado de laboratorio, quiero que el sistema guarde cada cambio de estado en un historial, para tener trazabilidad de lo que le ha ocurrido a cada recurso. | RF-01 |
| HU-07 | Back-end | Como docente, quiero que el sistema calcule automáticamente la cantidad operativa disponible de cada recurso para un horario, para confiar en que el número que veo es real. | RF-02, RF-03 |
| HU-08 | Back-end | Como docente, quiero que el sistema impida reservas que superen la cantidad disponible en un mismo horario, para evitar conflictos con otros docentes. | RF-03 |
| HU-09 | Back-end | Como encargado, quiero que el sistema genere alertas automáticamente cuando un recurso pase a dañado o en mantención, o cuando un insumo baje de su stock mínimo, para gestionar la reparación o compra sin revisar todo a mano. | RF-04 |
| HU-10 | Back-end | Como encargado de laboratorio, quiero que el sistema almacene cada incidencia con fecha automática, usuario que la registra y estado inicial "Pendiente", para conservar un historial confiable. | RF-05 |
| HU-11 | Back-end | Como encargado de laboratorio, quiero que cada recurso tenga una ubicación física obligatoria (laboratorio, bodega y mueble) con un código, para encontrarlo rápidamente. | RF-10 |

### 3.4 Otras necesidades detectadas en el levantamiento

Durante la entrevista también surgieron necesidades que aún no están formalizadas como requerimientos, o que quedaron pendientes de confirmar con el stakeholder:

- Inicio de sesión con roles diferenciados (encargado, docente y departamento), necesario para aplicar RNF-03.
- Historial de vida útil de los equipos y registro del consumo de insumos.
- Gestión del ciclo completo de mantención con órdenes de compra y seguimiento de proveedores.
- Reportabilidad avanzada: dashboard de uso y estadísticas por laboratorio o período.
- Integración con la plataforma Aula Digital de la universidad (pendiente de confirmar si se requiere).
- Posible rol o nivel de acceso para el director de carrera (pendiente de confirmar).
- Migración del historial de la planilla Excel actual al nuevo sistema (pendiente de confirmar).

---

## Declaración de uso de herramientas de inteligencia artificial

Para la elaboración de este documento, el equipo utilizó modelos de inteligencia artificial generativa, específicamente Claude (Anthropic) y Google Gemini, como herramientas de apoyo. Estas herramientas se usaron para ordenar y redactar la información, estructurar las tablas de requerimientos y revisar la coherencia del contenido. Los requerimientos, las necesidades y el contexto del proyecto provienen del levantamiento de información realizado por el equipo con el stakeholder principal Luis Sergio Torres Muñoz en la asignatura de Ingeniería de Software. Todo el contenido generado fue revisado, ajustado y validado por los integrantes del grupo, quienes asumen la responsabilidad total sobre lo presentado.
