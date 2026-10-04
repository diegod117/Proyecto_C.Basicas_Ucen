# Plan de implementación — Fase 2: permisos por rol y diseño

Equipo: **Johann Cortés, Martín Zepeda Puelles, Diego Cortés**.
Continúa el plan de `docs/plan-implementacion.md`. El MVP base (HU-01 a HU-11) y el login con Firebase ya están en `main`.

Esta fase tiene dos partes que se trabajan **al mismo tiempo**:

| Integrante | Parte | Qué cubre | Commits |
|---|---|---|---|
| **Johann** | Permisos por rol | RNF-03 + usuario real en historial, incidencias y reservas | J15 a J22 |
| **Martín** | Diseño: base visual, menú, login, reservas y alertas | RNF-01 (que se vea bien en PC y celular) | M15 a M21 |
| **Diego** | Diseño: inventario, ficha e incidencias | RNF-01 | D15 a D21 |

---

## 1. Qué ve y qué puede hacer cada rol (confirmar antes de empezar)

Propuesta basada en la tabla 1.2 de requerimientos y en RNF-03 ("el encargado edita; el docente consulta y reserva; el departamento revisa reportes y alertas"). **Los tres deben estar de acuerdo antes de que Johann empiece J16.**

| Acción | Encargado | Docente | Departamento |
|---|---|---|---|
| Ver inventario, ficha e historial de estados | ✔ | ✔ | ✔ |
| Cambiar el estado de un recurso (HU-02) | ✔ | — | — |
| Reservar un recurso (HU-03) | ✔ | ✔ | — |
| Ver reservas | todas | solo las suyas | todas |
| Cancelar una reserva | cualquiera | solo las suyas | — |
| Página Incidencias | registrar y avanzar estado | no la ve | solo ver |
| Página Alertas (HU-05) | ✔ | no la ve | ✔ |

> Importante: estos permisos solo **ocultan** botones y páginas en la pantalla. Sin un backend, alguien que sepa programar podría saltárselos. Para el MVP basta así, pero hay que decirlo en la exposición.

---

## 2. Reglas para no pisarnos en esta fase

1. **Johann toca los `.tsx`** (lógica de quién puede hacer qué). **Martín y Diego tocan sobre todo los `.css`.** Así casi no hay conflictos aunque trabajen en los mismos componentes.
2. Si Martín o Diego necesitan cambiar el JSX de un componente (agregar un `div` o una clase), lo hacen en un commit pequeño aparte y **avisan en el grupo**, porque Johann puede estar editando ese mismo archivo.
3. **Archivos compartidos** (avisar antes de tocarlos): `App.tsx`, `MenuNavegacion.tsx/.css`, `styles/global.css`, `index.html` y `types/`.
4. Todo lo demás sigue igual que en la fase 1: **una rama por tarea** que parte de `main` actualizado, `npm run build` y `npm run lint` antes del PR, revisión cruzada (a Johann lo revisa Martín, a Martín lo revisa Diego y a Diego lo revisa Johann) y la entrada en `docs/avance.md` al final de cada tarea.
5. **Sin librerías nuevas.** El diseño se hace con CSS simple. Si alguien quiere íconos (por ejemplo, Font Awesome como en el mockup), se pregunta antes.

---

## 3. Orden de trabajo

| Paso | Johann | Martín | Diego |
|---|---|---|---|
| **0. Base** (PR pequeños, se integran primero) | J15 y J16: permisos y menú por rol | M15 y M16: colores, fuente y estilos base | Lee el mockup y prepara el diseño del inventario |
| **1** | J17 y J18: inventario y reservas por rol | M17 y M18: nuevo menú lateral y login | D15 a D17: tarjetas, filtros y encabezado del inventario |
| **2** | J19 y J20: incidencias y usuario real | M19 y M20: reservas y alertas | D18 a D20: ficha, historial e incidencias |
| **3. Cierre** | J21 y J22: "Mis reservas" y pruebas | M21: revisión en celular | D21: revisión en celular |

**Por qué este orden:**
- J16 cambia `App.tsx` y `MenuNavegacion.tsx`, y M17 cambia esos mismos archivos para hacer el menú lateral. Por eso **J16 se integra antes de que Martín empiece M17**.
- M15 y M16 definen los colores y tamaños que usan todos. Si se integran primero, Diego los usa desde el principio y no tiene que inventar colores propios.

---

## 4. Plan de Johann: Permisos por rol (RNF-03)

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| J15 | `feature/rnf-03-permisos-rol` | `feat(RNF-03): agrega funciones que dicen qué puede hacer cada rol` | `utils/permisos.ts` | Una función por permiso con `if/else`: `puedeCambiarEstado(rol)`, `puedeReservar(rol)`, `puedeVerPagina(rol, pagina)`… Toda la tabla de la sección 1 queda en un solo archivo |
| J16 | `feature/rnf-03-permisos-rol` | `feat(RNF-03): muestra en el menú solo las páginas que el rol puede ver` | `App.tsx`, `MenuNavegacion.tsx` | `App` pasa el usuario a las páginas; si la página actual no está permitida, vuelve a Inventario |
| J17 | `feature/rnf-03-inventario` | `feat(RNF-03): solo el encargado puede cambiar el estado de un recurso` | `FichaRecurso.tsx`, `PaginaInventario.tsx` | Renderizado condicional: el docente ve la ficha y el historial, pero no el formulario |
| J18 | `feature/rnf-03-reservas` | `feat(RNF-03): solo docentes y encargado pueden reservar` | `PaginaReservas.tsx`, `FormularioReserva.tsx` | El campo "docente" se llena solo con el nombre del usuario conectado (hoy dice "Prof. Martín Zepeda" fijo). **Avisar a Martín** |
| J19 | `feature/rnf-03-incidencias` | `feat(RNF-03): solo el encargado registra y avanza incidencias` | `PaginaIncidencias.tsx`, `TablaIncidencias.tsx` | El departamento ve la tabla sin botones. **Avisar a Diego** |
| J20 | `feature/usuario-real` | `feat(HU-06): registra el nombre del usuario conectado en historial e incidencias` | `historialService.ts`, `recursosService.ts`, `FormularioIncidencia.tsx` | Cambiar el texto fijo "Encargado (usuario actual)" por un parámetro con el nombre real |
| J21 | `feature/mis-reservas-docente` | `feat(RF-03): el docente ve y cancela solo sus propias reservas` | `TablaReservas.tsx`, `reservasService.ts` | Filtrar con `if` dentro de un `for`, comparando `reserva.docente` con el nombre del usuario |
| J22 | `feature/mis-reservas-docente` | `chore(RNF-03): ajusta usuarios de prueba para la demo` | `data/usuarios.ts` | Que el docente de prueba se llame "Prof. Ana Morales" y el encargado "Pedro Soto", como en los datos de prueba. Así "Mis reservas" muestra algo |
| J23+ | cada rama | `docs: actualiza avance con RNF-03` | `docs/avance.md` | — |

**Demo en la exposición:** entrar como docente (no aparecen Incidencias ni Alertas, y la ficha no tiene el formulario de estado), reservar y ver solo sus propias reservas. Cerrar sesión, entrar como encargado y mostrar que ve todo, y que el historial guarda su nombre.

---

## 5. Dirección visual (para Martín y Diego)

Para que la app deje de verse genérica, los dos siguen **la misma línea**, basada en `docs/mockup-sgil.html`:

- **Color:** el azul UCEN `#1A63BB` sigue siendo el principal. Se agrega un azul muy claro (`#e8f0fe`) para fondos de elementos activos y un gris claro (`#f1f5f9`) para el menú lateral.
- **Tipografía:** **Inter** (la misma del mockup), cargada con un `<link>` de Google Fonts en `index.html`. No es un paquete npm.
- **Diseño de pantalla en PC:** barra superior azul con el usuario, **menú lateral gris** a la izquierda y el contenido en blanco a la derecha, como en el mockup.
- **En celular:** el menú lateral pasa a ser una fila de botones arriba (RNF-01).
- **Tarjetas:** fondo blanco, esquinas redondeadas (10px), sombra suave y sin bordes grises duros.
- **Encabezado de cada página:** título grande y una línea de descripción en gris debajo (ej: "Inventario — Recursos de los laboratorios de las torres B y C").
- **Botones:** tres estilos en todas las páginas: principal (azul relleno), secundario (borde azul) y peligro (rojo para "Dar de baja" o "Cancelar").
- **Etiquetas de estado:** se mantienen los colores actuales, con forma de "píldora" (más redondeadas).

**Regla de oro:** nadie escribe colores sueltos (`#3b82f6`) en su `.css`. Siempre se usan las variables de `global.css` (`var(--color-principal)`). Así toda la app combina.

---

## 6. Plan de Martín: base visual, menú, login, reservas y alertas

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| M15 | `feature/diseno-base` | `style: agrega colores, sombras y tamaños comunes en variables` | `styles/global.css` | Variables de CSS (`--sombra-tarjeta`, `--radio-borde`, `--color-principal-claro`…) |
| M16 | `feature/diseno-base` | `style: agrega la fuente Inter y estilos base de botones` | `index.html`, `styles/global.css` | Cargar una fuente de Google Fonts; clases `.boton-principal`, `.boton-secundario` y `.boton-peligro` |
| M17 | `feature/diseno-menu-lateral` | `style: cambia el menú a una barra superior con menú lateral` | `App.tsx`, `MenuNavegacion.tsx/.css` | Diseño con `display: flex` en dos columnas. **Esperar a que J16 esté en `main`** |
| M18 | `feature/diseno-login` | `style: rediseña la pantalla de login como en el mockup` | `PaginaLogin.css` | Título en dos líneas y franja decorativa arriba de la tarjeta |
| M19 | `feature/diseno-reservas` | `style(HU-03): rediseña el formulario y la tabla de reservas` | `FormularioReserva.css`, `TablaReservas.css`, `PaginaReservas.css` | Usar las variables de M15; tabla con filas alternadas |
| M20 | `feature/diseno-alertas` | `style(HU-05): rediseña las tarjetas y filtros de alertas` | `TarjetaAlerta.css`, `PaginaAlertas.css` | Franja de color a la izquierda según el tipo de alerta |
| M21 | `feature/diseno-reservas` | `style: revisa menú, login, reservas y alertas en celular` | `.css` de M17 a M20 | `@media (max-width: 768px)`: probar a 375px |
| M22+ | cada rama | `docs: actualiza avance con el diseño` | `docs/avance.md` | — |

---

## 7. Plan de Diego: inventario, ficha e incidencias

| # | Rama | Mensaje de commit | Archivos | Qué se aprende / explica |
|---|---|---|---|---|
| D15 | `feature/diseno-inventario` | `style(HU-01): rediseña las tarjetas de recursos` | `TarjetaRecurso.css`, `GrillaRecursos.css` | Sombra suave y efecto `:hover` (la tarjeta se eleva un poco) |
| D16 | `feature/diseno-inventario` | `style(HU-01): rediseña los filtros y el buscador` | `FiltrosInventario.css` | Filtros en una franja blanca; buscador más grande |
| D17 | `feature/diseno-inventario` | `style(HU-01): agrega encabezado de página con título y descripción` | `PaginaInventario.tsx/.css`, `MensajeSinResultados.css` | El mismo encabezado que usarán las demás páginas (avisar a Martín) |
| D18 | `feature/diseno-ficha` | `style(HU-02): rediseña la ficha del recurso en dos columnas` | `FichaRecurso.css`, `FormularioCambioEstado.css`, `AvisoUbicacion.css` | Datos e historial a la izquierda y acciones a la derecha, como en el mockup |
| D19 | `feature/diseno-ficha` | `style(HU-06): rediseña la tabla del historial de estados` | `TablaHistorial.css`, `global.css` (etiquetas) | Etiquetas de estado en forma de píldora. `global.css` es compartido: **avisar** |
| D20 | `feature/diseno-incidencias` | `style(HU-04): rediseña el formulario y la tabla de incidencias` | `FormularioIncidencia.css`, `TablaIncidencias.css`, `EtiquetaEstadoIncidencia.css`, `PaginaIncidencias.css` | Usar las mismas variables y botones de M15 y M16 |
| D21 | `feature/diseno-incidencias` | `style: revisa inventario, ficha e incidencias en celular` | `.css` de D15 a D20 | `@media (max-width: 768px)`: probar a 375px |
| D22+ | cada rama | `docs: actualiza avance con el diseño` | `docs/avance.md` | — |

---

## 8. Cierre de la fase (los tres)

- Entrar con los tres roles en PC y en celular y recorrer todas las páginas.
- Revisar que todos los archivos nuevos o modificados tengan sus comentarios.
- Ensayar la demo completa: login → inventario → ficha → reserva → incidencia → alertas → cerrar sesión.
- Borrar las ramas ya integradas (se dejó para el final del MVP).
- Opcional: publicar la app con Firebase Hosting para mostrarla en la exposición (preguntar antes, porque requiere instalar `firebase-tools`).
