# Plan de implementación del MVP

Equipo: **Johann Cortés, Martín Zepeda Puelles, Diego Cortés**.
Cada integrante tiene un **área del sistema** y al menos **10 commits de código**, más los commits de bitácora. Así cada uno puede explicar su parte completa en la exposición.

| Integrante | Área | Historias de usuario | RF principales |
|---|---|---|---|
| **Johann** | Inventario | HU-01, HU-02, HU-06, HU-11 | RF-01, RF-02, RF-08, RF-10 |
| **Martín** | Reservas | HU-03, HU-07, HU-08 + "Mis reservas" | RF-03 |
| **Diego** | Incidencias y alertas | HU-04, HU-10, HU-09, HU-05 | RF-04, RF-05 |

---

## 1. Cómo se conectan las partes (leer antes de empezar)

Todavía no hay backend, así que los datos viven en los **servicios** (`src/services/`). Cada servicio guarda una lista en memoria y tiene funciones para leerla y modificarla. Las páginas **nunca** importan directamente `src/data/`: siempre pasan por un servicio.

```
data/recursos.ts ──► services/recursosService.ts  ◄── usan: Inventario (Johann), Reservas (Martín), Alertas (Diego)
data/reservas.ts ──► services/reservasService.ts  ◄── usa:  Reservas (Martín)
data/incidencias.ts ► services/incidenciasService.ts ◄── usa: Incidencias (Diego)
```

**¿Por qué así?**
- Si Johann cambia el estado de un multímetro a "dañado" (HU-02), la página de alertas de Diego lo ve automáticamente (HU-09), porque ambos leen del mismo servicio.
- Cuando exista un backend, solo se cambian los servicios. Las páginas quedan igual.

> Nota: al recargar el navegador, los datos vuelven a los de prueba. Para el MVP está bien. Si queremos que se guarden, se puede usar `localStorage` más adelante (preguntar antes).

---

## 2. Reglas para no pisarnos

1. **Cada uno trabaja en sus propios archivos** (ver la columna "Archivos" de cada tabla).
2. **Archivos compartidos:** `App.tsx`, `MenuNavegacion.tsx`, `types/Pagina.ts`, `types/Recurso.ts`, `types/Reserva.ts`, `types/Incidencia.ts` y `styles/global.css`. Antes de tocarlos se avisa en el grupo, y el cambio va en un commit pequeño aparte.
3. **Una rama por HU**, que siempre parte de `main` actualizado (**Pull** antes de crearla).
4. **Antes de cada commit:** `npm run build` sin errores. Antes del Pull Request, también `npm run lint`.
5. **Revisión cruzada de Pull Requests:** el PR de Johann lo revisa Martín, el de Martín lo revisa Diego y el de Diego lo revisa Johann.
6. **`docs/avance.md`:** cada uno agrega su entrada al final. Si GitHub muestra un conflicto en ese archivo, se dejan **ambas** entradas.

---

## 3. Orden de trabajo

| Fase | Johann | Martín | Diego |
|---|---|---|---|
| **0. Base** (primero, PR pequeño) | Commits J1 y J2 (servicio de recursos y textos de estados) | Lee el código y prepara HU-03 | Lee el código y prepara HU-04 |
| **1** | HU-01 Listado y filtros | HU-03 Formulario de reserva | HU-04 Formulario de incidencia |
| **2** | HU-02 Cambiar estado | HU-07 y HU-08 Disponibilidad | HU-10 Historial de incidencias |
| **3** | HU-06 y HU-11 Historial y ubicación | Mis reservas | HU-09 y HU-05 Alertas |
| **4. Cierre** | Integración, pruebas en celular (RNF-01) y preparación de la exposición, los tres juntos | | |

**Importante:** Martín y Diego necesitan `obtenerRecursos()` (para el selector de recurso en sus formularios) y los textos de estados. Por eso J1 y J2 se integran a `main` **antes** que todo lo demás.

---

## 4. Plan de Johann: Inventario

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| J1 | `feature/servicio-recursos` | `feat(HU-01): agrega servicio para obtener recursos` | `services/recursosService.ts` | Separar datos de pantallas: `obtenerRecursos()` y `obtenerRecursoPorId(id)` |
| J2 | `feature/servicio-recursos` | `feat(HU-01): agrega funciones para mostrar estados, categorías y cantidad total` | `utils/inventario.ts` | `textoEstado('danado')` → "Dañado"; `calcularCantidadTotal(recurso)` con un `for` |
| J3 | `feature/hu-01-listado-inventario` | `feat(HU-01): crea componente TarjetaRecurso` | `components/TarjetaRecurso.tsx/.css` | Props: la tarjeta recibe un `Recurso` |
| J4 | `feature/hu-01-listado-inventario` | `feat(HU-01): muestra listado de recursos en la página de inventario` | `pages/PaginaInventario.tsx/.css` | Recorrer una lista con `.map()` y la `key` |
| J5 | `feature/hu-01-listado-inventario` | `feat(HU-01): agrega filtro por nombre` | `PaginaInventario.tsx`, `utils/inventario.ts` | `useState` + `onChange` en un input |
| J6 | `feature/hu-01-listado-inventario` | `feat(HU-01): agrega filtros por categoría, laboratorio y estado` | `components/FiltrosInventario.tsx/.css` | Varios `<select>`; filtrar con `if` dentro de un `for` |
| J7 | `feature/hu-01-listado-inventario` | `style(HU-01): adapta el listado a celular y agrega mensaje sin resultados` | `.css` de la página | Grid responsivo (RNF-01), renderizado condicional |
| J8 | `feature/hu-02-cambiar-estado` | `feat(HU-02): crea ficha del recurso al hacer clic en una tarjeta` | `components/FichaRecurso.tsx/.css` | `useState` para el recurso seleccionado; muestra la ubicación (RF-10) |
| J9 | `feature/hu-02-cambiar-estado` | `feat(HU-02): agrega formulario para cambiar el estado de un recurso` | `components/FormularioCambioEstado.tsx/.css` | Formulario controlado: estado de origen, estado nuevo, cantidad y motivo |
| J10 | `feature/hu-02-cambiar-estado` | `feat(HU-02): guarda el cambio de estado y valida la cantidad` | `recursosService.ts` | `cambiarEstadoRecurso()`: no puede mover más unidades de las que hay |
| J11 | `feature/hu-06-historial-estados` | `feat(HU-06): registra cada cambio de estado en un historial` | `types/CambioEstado.ts`, `services/historialService.ts` | Nuevo tipo; nunca se borra un registro (RNF-06) |
| J12 | `feature/hu-06-historial-estados` | `feat(HU-06): muestra el historial de estados en la ficha` | `components/TablaHistorial.tsx/.css` | Tabla con `.map()`, igual a la del mockup |
| J13 | `feature/hu-11-ubicacion` | `feat(HU-11): agrega funciones para generar y validar el código de ubicación` | `utils/ubicacion.ts` | `generarCodigo()` → "B307-B1-M2"; validar campos vacíos |
| J14+ | cada rama | `docs: actualiza avance con HU-0X` | `docs/avance.md` | — |

**Demo en la exposición:** filtrar "termómetros" de la torre C, abrir la ficha, pasar 1 unidad a "dañado" y mostrar que aparece en el historial.

---

## 5. Plan de Martín: Reservas

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| M1 | `feature/hu-03-reservas` | `feat(HU-03): agrega servicio de reservas` | `services/reservasService.ts` | `obtenerReservas()` y `agregarReserva()`; generar un `id` nuevo |
| M2 | `feature/hu-03-reservas` | `feat(HU-03): crea formulario de reserva con fecha y horario` | `components/FormularioReserva.tsx/.css` | Inputs `date`/`time` controlados con `useState` |
| M3 | `feature/hu-03-reservas` | `feat(HU-03): agrega selector de recurso, cantidad, asignatura y sala` | `FormularioReserva.tsx` | `<select>` llenado con `obtenerRecursos()` (de Johann) |
| M4 | `feature/hu-03-reservas` | `feat(HU-03): valida campos obligatorios y que la hora de fin sea posterior al inicio` | `utils/disponibilidad.ts` | Validaciones con `if/else` y mensajes de error |
| M5 | `feature/hu-03-reservas` | `feat(HU-03): guarda la reserva y muestra mensaje de confirmación` | `PaginaReservas.tsx/.css` | El evento `onSubmit` y `preventDefault()` |
| M6 | `feature/hu-07-disponibilidad-horario` | `feat(HU-07): agrega función para saber si dos horarios se cruzan` | `utils/disponibilidad.ts` | Comparar horas como texto ("08:30" < "10:00") |
| M7 | `feature/hu-07-disponibilidad-horario` | `feat(HU-07): calcula unidades disponibles de un recurso en un horario` | `utils/disponibilidad.ts` | Disponibles menos las reservas que se cruzan con ese horario |
| M8 | `feature/hu-07-disponibilidad-horario` | `feat(HU-07): muestra en el formulario cuántas unidades quedan en ese horario` | `FormularioReserva.tsx` | Recalcular al cambiar fecha, hora o recurso (como el aviso del mockup) |
| M9 | `feature/hu-08-validar-reserva` | `feat(HU-08): impide reservar más unidades de las disponibles` | `utils/disponibilidad.ts`, `FormularioReserva.tsx` | Probar con los termómetros del 09/10 a las 08:30 (ya están todos ocupados) |
| M10 | `feature/hu-08-validar-reserva` | `feat(HU-08): desactiva el botón confirmar cuando no hay disponibilidad` | `FormularioReserva.tsx/.css` | Atributo `disabled` según el estado |
| M11 | `feature/mis-reservas` | `feat(RF-03): crea tabla con las reservas ordenadas por fecha` | `components/TablaReservas.tsx/.css` | Ordenar una lista con `.sort()` explicado paso a paso |
| M12 | `feature/mis-reservas` | `feat(RF-03): permite cancelar una reserva` | `reservasService.ts`, `TablaReservas.tsx` | Confirmar con `window.confirm()` y actualizar la lista |
| M13 | `feature/mis-reservas` | `style(RF-03): adapta formulario y tabla a celular` | `.css` | RNF-01: el docente reserva desde el celular |
| M14+ | cada rama | `docs: actualiza avance con HU-0X` | `docs/avance.md` | — |

**Demo en la exposición:** intentar reservar termómetros el 09/10 a las 08:30 y mostrar que el sistema lo impide (el caso real que contó el profesor Torres). Luego elegir otro horario y reservar con éxito.

---

## 6. Plan de Diego: Incidencias y alertas

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| D1 | `feature/hu-04-incidencias` | `feat(HU-04): agrega servicio de incidencias` | `services/incidenciasService.ts` | `obtenerIncidencias()` y `agregarIncidencia()` |
| D2 | `feature/hu-04-incidencias` | `feat(HU-04): crea formulario con recurso afectado, docente presente y descripción` | `components/FormularioIncidencia.tsx/.css` | Formulario controlado; `<textarea>` |
| D3 | `feature/hu-04-incidencias` | `feat(HU-04): agrega pregunta de personas afectadas con detalle opcional` | `FormularioIncidencia.tsx` | Checkbox (`boolean`) y un campo que aparece solo si se marca |
| D4 | `feature/hu-04-incidencias` | `feat(HU-04): valida campos obligatorios y confirma el registro` | `FormularioIncidencia.tsx`, `PaginaIncidencias.tsx/.css` | RNF-02: registrar en 5 pasos como máximo |
| D5 | `feature/hu-10-historial-incidencias` | `feat(HU-10): guarda la incidencia con fecha automática y estado pendiente` | `utils/fechas.ts`, `incidenciasService.ts` | `new Date()` y armar el texto "AAAA-MM-DD HH:MM" |
| D6 | `feature/hu-10-historial-incidencias` | `feat(HU-10): crea tabla con el historial de incidencias` | `components/TablaIncidencias.tsx/.css` | Mostrar el nombre del recurso a partir de su `recursoId` |
| D7 | `feature/hu-10-historial-incidencias` | `feat(HU-10): agrega etiqueta de color según el estado de la incidencia` | `components/EtiquetaEstadoIncidencia.tsx/.css` | Componente pequeño y reutilizable |
| D8 | `feature/hu-10-historial-incidencias` | `feat(HU-10): permite avanzar una incidencia a en revisión y a resuelta` | `incidenciasService.ts`, `TablaIncidencias.tsx` | `cambiarEstadoIncidencia()`; pendiente → en revisión → resuelta |
| D9 | `feature/hu-09-alertas` | `feat(HU-09): agrega tipo Alerta` | `types/Alerta.ts` | Tipo unión: `'mantencion' \| 'reparacion' \| 'reposicion'` |
| D10 | `feature/hu-09-alertas` | `feat(HU-09): genera alertas de recursos dañados, en mantención o bajo stock mínimo` | `utils/alertas.ts` | Recorrer recursos y crear alertas con `if` (probar con los guantes de nitrilo) |
| D11 | `feature/hu-05-panel-alertas` | `feat(HU-05): agrega página de alertas al menú` | `types/Pagina.ts`, `App.tsx`, `MenuNavegacion.tsx` | Archivos compartidos: **avisar al grupo antes** |
| D12 | `feature/hu-05-panel-alertas` | `feat(HU-05): muestra las alertas pendientes en tarjetas` | `pages/PaginaAlertas.tsx/.css`, `components/TarjetaAlerta.tsx/.css` | Colores por tipo de alerta |
| D13 | `feature/hu-05-panel-alertas` | `feat(HU-05): muestra contador de alertas en el menú` | `MenuNavegacion.tsx/.css` | Nueva prop numérica, como la campana del mockup |
| D14+ | cada rama | `docs: actualiza avance con HU-0X` | `docs/avance.md` | — |

**Demo en la exposición:** registrar una incidencia en menos de 5 pasos (RNF-02), mostrar que nace "pendiente" con fecha automática y avanzarla a "resuelta". Luego abrir el panel de alertas y mostrar la de los guantes bajo el stock mínimo.

---

## 7. Fase 4: integración (los tres)

Commits extra opcionales, si queda tiempo:

- **Johann y Martín:** botón "Reservar recurso" en la ficha, que abre el formulario con el recurso ya elegido (como en el mockup).
- **Johann y Diego:** botón "Registrar incidencia" en la ficha.
- **Los tres:** probar todo en el celular (RNF-01), revisar que todos los archivos tengan sus comentarios y ensayar la demo completa.

## 8. Fuera del MVP (preguntar al profesor antes)

Estos requerimientos no tienen una HU asociada o dependen de un backend:
- **RF-06** solicitudes de material, **RF-07** resumen diario y **RF-09** notificaciones por correo.
- **RNF-03** login con roles (está en la sección 3.4 como pendiente de confirmar).

Si sobra tiempo, el que termine primero puede proponer una versión simple, por ejemplo un selector "Ver como: Encargado / Docente" que oculte botones según el rol.
