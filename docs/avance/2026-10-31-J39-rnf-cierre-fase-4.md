# 2026-10-31 — J39: cierre de requisitos no funcionales de la fase 4 (Johann)

**HU y requisitos trabajados:** HU-01 (CA-01.4 y CA-01.5), HU-04 (CA-04.3 y CA-04.4), HU-05 (CA-05.2), RNF-01, RNF-02, RNF-04, RNF-07, RNF-09 y RNF-11. Rama: `feature/rnf-cierre-fase-4`.

**Estado de J39: PARCIAL respecto de la fila del plan** ("Pruebas completas a 360 px, conteo de acciones de la incidencia, reglas por rol, respaldo; HU-01"). No incluye RNF-03 (reglas por rol), RNF-08 (el docente solo ve sus reservas, también en las reglas) ni RNF-06 respaldo, por estas razones: D6 junta los roles en Firestore y las reglas por rol con HU-15, que es J40 y va al final; D7 aplazó el respaldo semanal; y RNF-09 (99% de disponibilidad) depende de Firebase y del hosting, no se puede verificar desde el código. Tampoco se toca la consola de Firebase: `docs/firestore.rules` no cambió y no hay nada que pegar.

**Qué se hizo:**
- **CA-01.4:** el mensaje cuando los filtros no encuentran nada dice exactamente "No se encontraron recursos con esos filtros" (antes: "No hay recursos que coincidan con los filtros").
- **Contraste (RNF-11):** el gris de los textos secundarios (`--color-texto-secundario`) pasa de `#6b7280` a `#5b6472`; el contador de alertas del menú usa `--color-danado`; el botón "Cerrar sesión" tiene fondo transparente (hover con `--color-principal-oscuro`); el rol de la barra azul sube a `opacity: 0.9`; y los textos de ayuda dentro de los campos (placeholder) usan el mismo gris con `opacity: 1`.
- **360 px (RNF-01 y CA-01.5):** se corrigieron los puntos donde la página podía desbordarse con nombres largos (categorías de la planilla de HU-16, series sin espacios): `fieldset` y `select` pueden achicarse, y la categoría de la tarjeta, de la ficha y de Configuración y el valor de cada dato de la ficha se parten en vez de salirse. La barra azul usa menos relleno bajo 420 px.
- **Filtros del inventario (cambio visual en escritorio):** HU-13 había dejado 5 columnas en una fila y los selects medían de 115 a 149 px, así que "Entre 1 y 2 años" o "En mantención" se cortaban. Ahora el buscador ocupa toda la primera fila y los 4 filtros van debajo en 4 columnas (más de 1100 px), en 2 columnas (de 701 a 1100 px) o en una columna (700 px o menos). **En escritorio la barra de filtros es una fila más alta que antes.** Si Johann prefiere el diseño anterior, basta devolver `grid-template-columns` a `2.4fr 1fr 1fr 1fr 1fr`, quitar la regla `.campo-filtro:first-child` y el bloque de 1100 px de `FiltrosInventario.css` (a costa de que el texto de los selects vuelva a cortarse).

**RNF-02 (conteo de acciones de la incidencia):** la línea base fija un máximo de 5 acciones desde el menú. El recorrido mínimo del encargado (código de `FormularioIncidencia` y `MenuNavegacion`):
1. Clic en "Incidencias" del menú.
2. Elegir el recurso afectado en la lista (`campo-recurso`).
3. Escribir el docente presente (`campo-docente`).
4. Escribir la descripción (`campo-descripcion`).
5. Clic en "Registrar incidencia".

Son 5 acciones exactas. La unidad afectada (HU-12, solo en recursos con unidades) y "¿Hubo personas afectadas?" con su detalle son opcionales y suman acciones si se usan; el máximo se mide sobre el recorrido obligatorio. El límite de 2 minutos no se midió con una persona; el recorrido son 3 campos y 2 clics.

**CA-04.4:** si falta un campo, el mensaje dice cuál ("Debe seleccionar un recurso afectado.", "Debe indicar el docente presente.", "Debe escribir una descripción de lo ocurrido." y, con personas afectadas, "Debe describir cómo fueron afectadas las personas.") y lo escrito no se borra, porque los campos solo se limpian después de guardar con éxito (`manejarEnvio`).

**CA-04.3:** `incidenciasService.agregarIncidencia` crea la incidencia con `estado: 'pendiente'` y no toca el recurso; el estado del recurso se cambia por separado desde su ficha con "Cambiar estado". La confirmación dice "Estado inicial: pendiente".

**CA-05.2 (interpretación):** cada tarjeta de alerta muestra el tipo (insignia con icono y texto), la fecha y hora, el recurso (su nombre abre el mensaje) y la causa en el mensaje (unidades dañadas, unidades en mantención o stock bajo con el mínimo), más la ubicación del recurso en el pie. La línea base no define "origen": se interpreta como **la causa que describe el mensaje**. Si se pidiera un campo "Origen" explícito, sería un cambio pequeño de `TarjetaAlerta`. Limitación: la fecha es siempre el momento en que se dibuja la pantalla, porque las alertas se calculan y no se guardan.

**Mediciones de RNF-04 y RNF-07** (script temporal fuera del repositorio, con las funciones reales y 2.000 recursos sintéticos; no se commitea):
- RNF-07 (búsqueda y filtros en máximo 3 s con hasta 2.000 recursos): 1.536 combinaciones de búsqueda por nombre, categoría, laboratorio, estado y antigüedad, más la paginación: promedio 0,40 ms y peor caso 1,18 ms.
- RNF-04 (alertas en máximo 5 s): `generarAlertas` con 2.000 recursos (403 alertas): promedio 0,036 ms y máximo 0,158 ms en 50 repeticiones.
- Ambos quedan como **"cumplido por diseño y medido"**, que no es lo mismo que "Validado" de la línea base (RNF-04 y RNF-07 siguen "por confirmar" con el stakeholder): `generarAlertas` y los filtros trabajan sobre la copia en memoria, sin red. La descarga inicial de Firestore al iniciar sesión no entra en la medición. El correo de RNF-04 (máximo 5 minutos) pertenece a HU-17, que está en espera (D5).

**RNF-11, contraste mínimo 4,5:1.** Se midió con un script temporal que recorre los 30 archivos CSS y calcula la razón de contraste de **todas las parejas texto/fondo**: reglas con color y fondo, las que usan `rgba` (mezclado con el fondo real) u `opacity`, las que heredan el blanco de la barra azul, y las reglas con solo color contra los fondos posibles (blanco, fondo, fondo del menú y, donde corresponde, azul claro). Los controles deshabilitados están exentos del criterio. Los bordes y sombras no son texto.
- **Antes:** Total de parejas medidas: 269 | no cumplen: 40. Fallaban 40 parejas, que corresponden a pocos casos: el gris `#6b7280` sobre el fondo del menú (4,41) y sobre el azul claro (4,22) en muchos textos secundarios (encabezados de las tablas de historial e incidencias, aviso de permisos de la ficha, código de la cabecera de las tarjetas, `.configuracion-nota`, `.configuracion-descripcion`...), el contador de alertas del menú (blanco sobre `#ef4444`, 3,76) y el botón "Cerrar sesión" (4,39 normal y 3,36 al pasar el mouse). El rol de la barra azul pasaba por poco (4,55). El `placeholder` por defecto del navegador (`#757575`) sobre el fondo de los campos da 4,40.
- **Después:** Total de parejas medidas: 272 | no cumplen: 0. Ninguna pareja bajo 4,5.
- **Al límite, sin cambiar:** `.etiqueta-en_mantencion` (`#a16207` sobre `#fef9c3`, 4,58) y las demás reglas que usan ese mismo par (`.etiqueta-estado-pendiente`, `.etiqueta-reserva-en_curso`, `.aviso-ubicacion`, `.ficha-en-reserva`).
- **Efecto colateral aceptado:** `PaginaAlertas.css` usa `--color-texto-secundario` como color de borde de un botón al pasar el mouse (línea 86) y queda un poco más oscuro.
- **No solo con color:** toda etiqueta de estado, de reserva y de incidencia lleva texto (Disponible, En uso...), las alertas llevan icono y texto, y las categorías se muestran con su nombre; la página actual de la paginación y el ítem activo del menú se distinguen además por relleno o borde. Sin cambios.

Parejas que fallaban antes de los cambios:

| Razón | Estado | Regla | Pareja |
|---|---|---|---|
| 3.36 | NO CUMPLE | MenuNavegacion.css .boton-cerrar-sesion:hover | #ffffff sobre #5a8fce |
| 3.76 | NO CUMPLE | MenuNavegacion.css .badge-alertas-menu | #ffffff sobre #ef4444 |
| 4.22 | NO CUMPLE | PaginaConfiguracion.css .configuracion-descripcion | #6b7280 sobre #e8f0fe (azul claro) |
| 4.22 | NO CUMPLE | PaginaConfiguracion.css .configuracion-nota | #6b7280 sobre #e8f0fe (azul claro) |
| 4.39 | NO CUMPLE | MenuNavegacion.css .boton-cerrar-sesion | #ffffff sobre #3c7ac5 |
| 4.41 | NO CUMPLE | FichaRecurso.css .ficha-aviso-permiso | #6b7280 sobre #f1f5f9 |
| 4.41 | NO CUMPLE | FichaRecurso.css .ficha-datos dt | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FichaRecurso.css .ficha-ruta-separador | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FichaRecurso.css .ficha-subtitulo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FiltrosInventario.css .campo-filtro input::placeholder | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FiltrosInventario.css .campo-filtro label | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioCambioEstado.css .formulario-cambio-estado label | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioCambioEstado.css .formulario-movimiento-ayuda | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioIncidencia.css .campo-formulario label | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioIncidencia.css .formulario-incidencia-subtitulo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioNuevoRecurso.css .nuevo-recurso-campo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | FormularioNuevoRecurso.css .nuevo-recurso-codigo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | MensajeSinResultados.css .sin-resultados-texto | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaAlertas.css .pagina-alertas-titulos p | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaCargaExcel.css .carga-selector | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaConfiguracion.css .configuracion-campo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaConfiguracion.css .configuracion-descripcion | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaConfiguracion.css .configuracion-nota | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaInventario.css .encabezado-pagina-descripcion | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaLogin.css .login-subtitulo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | PaginaReservas.css .pagina-reservas-descripcion | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | SelectorUnidades.css .formulario-unidades-etiqueta | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaHistorial.css .tabla-historial th | #6b7280 sobre #f1f5f9 |
| 4.41 | NO CUMPLE | TablaHistorial.css .tabla-historial-fecha | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaHistorial.css .tabla-historial-vacia | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaIncidencias.css .tabla-incidencias th | #6b7280 sobre #f1f5f9 |
| 4.41 | NO CUMPLE | TablaIncidencias.css .tabla-incidencias-unidad | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaIncidencias.css .tabla-incidencias-vacia | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaIncidencias.css .texto-accion-finalizada | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TablaReservas.css .sin-reservas-texto | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TarjetaAlerta.css .tarjeta-alerta-fecha | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TarjetaAlerta.css .tarjeta-alerta-footer | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TarjetaRecurso.css .tarjeta-codigo | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | TarjetaRecurso.css .tarjeta-laboratorio, .tarjeta-cantidad | #6b7280 sobre #f1f5f9 (fondo-menu) |
| 4.41 | NO CUMPLE | global.css .texto-secundario | #6b7280 sobre #f1f5f9 (fondo-menu) |

Tabla completa después de los cambios (todas las parejas medidas):

| Razón | Estado | Regla | Pareja |
|---|---|---|---|
| 1.90 | EXENTO (deshabilitado) | FormularioReserva.css .boton-confirmar:disabled | #f5f6f8 sobre #b0b5bf |
| 2.08 | EXENTO (deshabilitado) | Paginacion.css .paginacion-boton:disabled | #a6acb6 sobre #f1f5f9 (fondo-menu) |
| 2.11 | EXENTO (deshabilitado) | Paginacion.css .paginacion-boton:disabled | #aaafb7 sobre #f8fafc (fondo) |
| 2.13 | EXENTO (deshabilitado) | Paginacion.css .paginacion-boton:disabled | #adb2b8 sobre #ffffff (blanco) |
| 4.57 | cumple | EtiquetaEstadoIncidencia.css .etiqueta-estado-resuelta | #15803d sobre #dcfce7 |
| 4.57 | cumple | FormularioCambioEstado.css .formulario-cambio-exito | #15803d sobre #dcfce7 |
| 4.57 | cumple | PaginaConfiguracion.css .configuracion-exito | #15803d sobre #dcfce7 |
| 4.57 | cumple | PaginaIncidencias.css .mensaje-confirmacion | #15803d sobre #dcfce7 |
| 4.57 | cumple | global.css .etiqueta-disponible | #15803d sobre #dcfce7 |
| 4.58 | cumple | TablaHistorial.css .tabla-historial-reposicion | #15803d sobre #f1f5f9 (fondo-menu) |
| 4.58 | cumple | TablaIncidencias.css .boton-accion-resuelta | #15803d sobre #f1f5f9 (fondo-menu) |
| 4.58 | cumple | AvisoUbicacion.css .aviso-ubicacion | #a16207 sobre #fef9c3 |
| 4.58 | cumple | EtiquetaEstadoIncidencia.css .etiqueta-estado-pendiente | #a16207 sobre #fef9c3 |
| 4.58 | cumple | TablaReservas.css .etiqueta-reserva-en_curso | #a16207 sobre #fef9c3 |
| 4.58 | cumple | TablaUnidadesEstado.css .ficha-en-reserva | #a16207 sobre #fef9c3 |
| 4.58 | cumple | global.css .etiqueta-en_mantencion | #a16207 sobre #fef9c3 |
| 4.79 | cumple | FormularioRecuperarContrasena.css .recuperar-exito | #15803d sobre #f0fdf4 |
| 4.79 | cumple | FormularioReserva.css .aviso-disponibilidad.hay-unidades | #15803d sobre #f0fdf4 |
| 4.79 | cumple | FormularioReserva.css .mensaje-exito | #15803d sobre #f0fdf4 |
| 4.79 | cumple | TablaHistorial.css .tabla-historial-reposicion | #15803d sobre #f8fafc (fondo) |
| 4.79 | cumple | TablaIncidencias.css .boton-accion-resuelta | #15803d sobre #f8fafc (fondo) |
| 5.02 | cumple | TablaHistorial.css .tabla-historial-reposicion | #15803d sobre #ffffff (blanco) |
| 5.02 | cumple | TablaIncidencias.css .boton-accion-resuelta | #15803d sobre #ffffff (blanco) |
| 5.11 | cumple | MenuNavegacion.css .app-header-usuario-rol | #e8eff8 sobre #1a63bb (azul principal) |
| 5.17 | cumple | MenuNavegacion.css .boton-menu-activo | #1a63bb sobre #e8f0fe |
| 5.17 | cumple | MenuNavegacion.css .boton-menu:hover | #1a63bb sobre #e8f0fe |
| 5.17 | cumple | PaginaConfiguracion.css .configuracion-item | #1a63bb sobre #e8f0fe |
| 5.17 | cumple | PaginaConfiguracion.css .configuracion-item-categoria | #1a63bb sobre #e8f0fe |
| 5.17 | cumple | PaginaReservas.css .contador-reservas-badge | #1a63bb sobre #e8f0fe |
| 5.22 | cumple | PaginaConfiguracion.css .configuracion-descripcion | #5b6472 sobre #e8f0fe (azul claro) |
| 5.22 | cumple | PaginaConfiguracion.css .configuracion-nota | #5b6472 sobre #e8f0fe (azul claro) |
| 5.30 | cumple | FormularioCambioEstado.css .formulario-cambio-error | #b91c1c sobre #fee2e2 |
| 5.30 | cumple | FormularioIncidencia.css .mensaje-error | #b91c1c sobre #fee2e2 |
| 5.30 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-error | #b91c1c sobre #fee2e2 |
| 5.30 | cumple | PaginaCargaExcel.css .carga-error | #b91c1c sobre #fee2e2 |
| 5.30 | cumple | PaginaConfiguracion.css .configuracion-error | #b91c1c sobre #fee2e2 |
| 5.30 | cumple | global.css .etiqueta-danado | #b91c1c sobre #fee2e2 |
| 5.41 | cumple | FichaRecurso.css .ficha-boton-volver | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | FichaRecurso.css .ficha-categoria | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | FichaRecurso.css .ficha-codigo | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo strong | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-grupo legend | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | FormularioReserva.css .formulario-reserva h3 | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | PaginaAlertas.css .pagina-alertas-titulos h2 | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | PaginaInventario.css .boton-limpiar-pequeno | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | PaginaLogin.css .login-enlace | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | PaginaLogin.css .login-titulo | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | PaginaReservas.css .pagina-reservas-header h2 | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | TablaIncidencias.css .boton-accion-revision | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | TablaReservas.css .tabla-reservas-contenedor h3 | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | TarjetaRecurso.css .tarjeta-categoria | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | global.css .boton-secundario | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.41 | cumple | global.css h1 | #1a63bb sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FichaRecurso.css .ficha-aviso-permiso | #5b6472 sobre #f1f5f9 |
| 5.46 | cumple | FichaRecurso.css .ficha-datos dt | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FichaRecurso.css .ficha-ruta-separador | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FichaRecurso.css .ficha-subtitulo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FiltrosInventario.css .campo-filtro input::placeholder | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FiltrosInventario.css .campo-filtro label | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioCambioEstado.css .formulario-cambio-estado label | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioCambioEstado.css .formulario-movimiento-ayuda | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioIncidencia.css .campo-formulario label | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioIncidencia.css .formulario-incidencia-subtitulo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-campo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | MensajeSinResultados.css .sin-resultados-texto | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaAlertas.css .pagina-alertas-titulos p | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaCargaExcel.css .carga-selector | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaConfiguracion.css .configuracion-campo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaConfiguracion.css .configuracion-descripcion | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaConfiguracion.css .configuracion-nota | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaInventario.css .encabezado-pagina-descripcion | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaLogin.css .login-subtitulo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | PaginaReservas.css .pagina-reservas-descripcion | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | SelectorUnidades.css .formulario-unidades-etiqueta | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaHistorial.css .tabla-historial th | #5b6472 sobre #f1f5f9 |
| 5.46 | cumple | TablaHistorial.css .tabla-historial-fecha | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaHistorial.css .tabla-historial-vacia | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaIncidencias.css .tabla-incidencias th | #5b6472 sobre #f1f5f9 |
| 5.46 | cumple | TablaIncidencias.css .tabla-incidencias-unidad | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaIncidencias.css .tabla-incidencias-vacia | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaIncidencias.css .texto-accion-finalizada | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TablaReservas.css .sin-reservas-texto | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TarjetaAlerta.css .tarjeta-alerta-fecha | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TarjetaAlerta.css .tarjeta-alerta-footer | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TarjetaRecurso.css .tarjeta-codigo | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | TarjetaRecurso.css .tarjeta-laboratorio, .tarjeta-cantidad | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | global.css .texto-secundario | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.46 | cumple | global.css input::placeholder, textarea::placeholder | #5b6472 sobre #f1f5f9 (fondo-menu) |
| 5.49 | cumple | EtiquetaEstadoIncidencia.css .etiqueta-estado-en-revision | #1d4ed8 sobre #dbeafe |
| 5.49 | cumple | TablaReservas.css .etiqueta-reserva-programada | #1d4ed8 sobre #dbeafe |
| 5.49 | cumple | global.css .etiqueta-en_uso | #1d4ed8 sobre #dbeafe |
| 5.66 | cumple | FichaRecurso.css .ficha-boton-volver | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | FichaRecurso.css .ficha-categoria | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | FichaRecurso.css .ficha-codigo | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo strong | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-grupo legend | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | FormularioReserva.css .formulario-reserva h3 | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | PaginaAlertas.css .pagina-alertas-titulos h2 | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | PaginaInventario.css .boton-limpiar-pequeno | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | PaginaLogin.css .login-enlace | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | PaginaLogin.css .login-titulo | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | PaginaReservas.css .pagina-reservas-header h2 | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | TablaIncidencias.css .boton-accion-revision | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | TablaReservas.css .tabla-reservas-contenedor h3 | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | TarjetaRecurso.css .tarjeta-categoria | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | global.css .boton-secundario | #1a63bb sobre #f8fafc (fondo) |
| 5.66 | cumple | global.css h1 | #1a63bb sobre #f8fafc (fondo) |
| 5.72 | cumple | FichaRecurso.css .ficha-datos dt | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FichaRecurso.css .ficha-ruta-separador | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FichaRecurso.css .ficha-subtitulo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FiltrosInventario.css .campo-filtro input::placeholder | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FiltrosInventario.css .campo-filtro label | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioCambioEstado.css .formulario-cambio-estado label | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioCambioEstado.css .formulario-movimiento-ayuda | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioIncidencia.css .campo-formulario label | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioIncidencia.css .formulario-incidencia-subtitulo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-campo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | MensajeSinResultados.css .sin-resultados-texto | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaAlertas.css .pagina-alertas-titulos p | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaCargaExcel.css .carga-selector | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaConfiguracion.css .configuracion-campo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaConfiguracion.css .configuracion-descripcion | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaConfiguracion.css .configuracion-nota | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaInventario.css .encabezado-pagina-descripcion | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaLogin.css .login-subtitulo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | PaginaReservas.css .pagina-reservas-descripcion | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | SelectorUnidades.css .formulario-unidades-etiqueta | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaHistorial.css .tabla-historial-fecha | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaHistorial.css .tabla-historial-vacia | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaIncidencias.css .tabla-incidencias-unidad | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaIncidencias.css .tabla-incidencias-vacia | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaIncidencias.css .texto-accion-finalizada | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TablaReservas.css .sin-reservas-texto | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TarjetaAlerta.css .tarjeta-alerta-fecha | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TarjetaAlerta.css .tarjeta-alerta-footer | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TarjetaRecurso.css .tarjeta-codigo | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | TarjetaRecurso.css .tarjeta-laboratorio, .tarjeta-cantidad | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | global.css .texto-secundario | #5b6472 sobre #f8fafc (fondo) |
| 5.72 | cumple | global.css input::placeholder, textarea::placeholder | #5b6472 sobre #f8fafc (fondo) |
| 5.91 | cumple | PaginaCargaExcel.css .carga-error-fila | #b91c1c sobre #f1f5f9 (fondo-menu) |
| 5.91 | cumple | FormularioReserva.css .aviso-disponibilidad.sin-unidades | #b91c1c sobre #fef2f2 |
| 5.91 | cumple | FormularioReserva.css .mensaje-error | #b91c1c sobre #fef2f2 |
| 5.91 | cumple | PaginaLogin.css .login-error | #b91c1c sobre #fef2f2 |
| 5.91 | cumple | TablaReservas.css .boton-cancelar-reserva | #b91c1c sobre #fef2f2 |
| 5.92 | cumple | FichaRecurso.css .ficha-boton-volver | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | FichaRecurso.css .ficha-categoria | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | FichaRecurso.css .ficha-codigo | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | FormularioCambioEstado.css .formulario-cambio-boton | #ffffff sobre #1a63bb |
| 5.92 | cumple | FormularioIncidencia.css .boton-registrar | #ffffff sobre #1a63bb |
| 5.92 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo strong | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-grupo legend | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | FormularioReserva.css .boton-confirmar | #ffffff sobre #1a63bb |
| 5.92 | cumple | FormularioReserva.css .formulario-reserva h3 | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | MensajeSinResultados.css .sin-resultados-boton | #ffffff sobre #1a63bb |
| 5.92 | cumple | MenuNavegacion.css .app-header | #ffffff sobre #1a63bb |
| 5.92 | cumple | MenuNavegacion.css .app-header-titulo | #ffffff sobre #1a63bb (azul principal) |
| 5.92 | cumple | MenuNavegacion.css .boton-cerrar-sesion | #ffffff sobre #1a63bb (azul principal) |
| 5.92 | cumple | PaginaAlertas.css .boton-filtro-alerta.activo | #ffffff sobre #1a63bb |
| 5.92 | cumple | PaginaAlertas.css .pagina-alertas-titulos h2 | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | PaginaInventario.css .boton-limpiar-pequeno | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | PaginaLogin.css .login-boton | #ffffff sobre #1a63bb |
| 5.92 | cumple | PaginaLogin.css .login-enlace | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | PaginaLogin.css .login-titulo | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | PaginaReservas.css .pagina-reservas-header h2 | #1a63bb sobre #ffffff (blanco) |
| 5.92 | EXENTO (deshabilitado) | Paginacion.css .paginacion-actual, .paginacion-actual:hover:not(:disab | #ffffff sobre #1a63bb |
| 5.92 | cumple | Paginacion.css .paginacion-boton | #1a63bb sobre #ffffff |
| 5.92 | cumple | TablaIncidencias.css .boton-accion-revision | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | TablaReservas.css .tabla-reservas-contenedor h3 | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | TarjetaRecurso.css .tarjeta-categoria | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | global.css .boton-principal | #ffffff sobre #1a63bb |
| 5.92 | cumple | global.css .boton-secundario | #1a63bb sobre #ffffff (blanco) |
| 5.92 | cumple | global.css h1 | #1a63bb sobre #ffffff (blanco) |
| 5.98 | cumple | FichaRecurso.css .ficha-datos dt | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FichaRecurso.css .ficha-ruta-separador | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FichaRecurso.css .ficha-subtitulo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FiltrosInventario.css .campo-filtro input::placeholder | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FiltrosInventario.css .campo-filtro label | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioCambioEstado.css .formulario-cambio-estado label | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioCambioEstado.css .formulario-movimiento-ayuda | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioIncidencia.css .campo-formulario label | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioIncidencia.css .formulario-incidencia-subtitulo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-campo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-codigo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | MensajeSinResultados.css .sin-resultados-texto | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaAlertas.css .pagina-alertas-titulos p | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaAlertas.css .panel-alertas-vacio | #5b6472 sobre #ffffff |
| 5.98 | cumple | PaginaCargaExcel.css .carga-selector | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaConfiguracion.css .configuracion-campo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaConfiguracion.css .configuracion-descripcion | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaConfiguracion.css .configuracion-nota | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaInventario.css .encabezado-pagina-descripcion | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaLogin.css .login-subtitulo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | PaginaReservas.css .pagina-reservas-descripcion | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | SelectorUnidades.css .formulario-unidades-etiqueta | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaHistorial.css .tabla-historial-fecha | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaHistorial.css .tabla-historial-vacia | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaIncidencias.css .tabla-incidencias-unidad | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaIncidencias.css .tabla-incidencias-vacia | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaIncidencias.css .texto-accion-finalizada | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TablaReservas.css .sin-reservas-texto | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TarjetaAlerta.css .tarjeta-alerta-fecha | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TarjetaAlerta.css .tarjeta-alerta-footer | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TarjetaRecurso.css .tarjeta-codigo | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | TarjetaRecurso.css .tarjeta-laboratorio, .tarjeta-cantidad | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | global.css .texto-secundario | #5b6472 sobre #ffffff (blanco) |
| 5.98 | cumple | global.css input::placeholder, textarea::placeholder | #5b6472 sobre #ffffff (blanco) |
| 6.18 | cumple | PaginaCargaExcel.css .carga-error-fila | #b91c1c sobre #f8fafc (fondo) |
| 6.37 | cumple | TarjetaAlerta.css .tarjeta-alerta-mantencion .tarjeta-alerta-badge | #92400e sobre #fef3c7 |
| 6.47 | cumple | MenuNavegacion.css .badge-alertas-menu | #ffffff sobre #b91c1c |
| 6.47 | cumple | PaginaCargaExcel.css .carga-error-fila | #b91c1c sobre #ffffff (blanco) |
| 6.47 | cumple | TablaReservas.css .boton-cancelar-reserva:hover | #ffffff sobre #b91c1c |
| 6.47 | cumple | global.css .boton-peligro | #ffffff sobre #b91c1c |
| 6.80 | cumple | PaginaAlertas.css .contador-total-badge | #991b1b sobre #fee2e2 |
| 6.80 | cumple | TarjetaAlerta.css .tarjeta-alerta-reparacion .tarjeta-alerta-badge | #991b1b sobre #fee2e2 |
| 6.87 | cumple | TablaReservas.css .etiqueta-reserva-realizada | #4b5563 sobre #f3f4f6 |
| 6.87 | cumple | global.css .etiqueta-dado_de_baja | #4b5563 sobre #f3f4f6 |
| 7.15 | cumple | TarjetaAlerta.css .tarjeta-alerta-reposicion .tarjeta-alerta-badge | #1e40af sobre #dbeafe |
| 8.11 | cumple | MenuNavegacion.css .boton-cerrar-sesion:hover | #ffffff sobre #144f96 |
| 12.81 | cumple | MenuNavegacion.css .boton-menu | #1f2937 sobre #e8f0fe (azul claro) |
| 13.40 | cumple | FichaRecurso.css .ficha-nombre | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | FormularioIncidencia.css .campo-checkbox label | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | FormularioIncidencia.css .formulario-incidencia-titulo | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | FormularioReserva.css .campo label | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | MenuNavegacion.css .boton-menu | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | PaginaAlertas.css .boton-filtro-alerta | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | PaginaConfiguracion.css .configuracion-checkbox | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | PaginaInventario.css .encabezado-pagina-titulo | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | PaginaLogin.css .login-etiqueta | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | SelectorUnidades.css .formulario-unidades-opcion | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | TablaIncidencias.css .tabla-incidencias td | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | TablaIncidencias.css .tabla-incidencias-titulo | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | TablaReservas.css .tabla-reservas td | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 13.40 | cumple | TablaReservas.css .tabla-reservas th | #1f2937 sobre #f1f5f9 |
| 13.40 | cumple | TarjetaAlerta.css .tarjeta-alerta-mensaje | #1f2937 sobre #f1f5f9 (fondo-menu) |
| 14.03 | cumple | FichaRecurso.css .ficha-nombre | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | FiltrosInventario.css .campo-filtro input, .campo-filtro select | #1f2937 sobre #f8fafc |
| 14.03 | cumple | FormularioCambioEstado.css .formulario-cambio-estado select, .formulario-cambio-es | #1f2937 sobre #f8fafc |
| 14.03 | cumple | FormularioIncidencia.css .campo-checkbox label | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | FormularioIncidencia.css .campo-formulario input, .campo-formulario select, .cam | #1f2937 sobre #f8fafc |
| 14.03 | cumple | FormularioIncidencia.css .formulario-incidencia-titulo | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | FormularioNuevoRecurso.css .nuevo-recurso-campo input, .nuevo-recurso-campo select | #1f2937 sobre #f8fafc |
| 14.03 | cumple | FormularioReserva.css .campo input, .campo select | #1f2937 sobre #f8fafc |
| 14.03 | cumple | FormularioReserva.css .campo label | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | MenuNavegacion.css .boton-menu | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | PaginaAlertas.css .boton-filtro-alerta | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | PaginaConfiguracion.css .configuracion-campo input, .configuracion-campo select | #1f2937 sobre #f8fafc |
| 14.03 | cumple | PaginaConfiguracion.css .configuracion-checkbox | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | PaginaInventario.css .encabezado-pagina-titulo | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | PaginaLogin.css .login-etiqueta | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | PaginaLogin.css .login-input | #1f2937 sobre #f8fafc |
| 14.03 | cumple | SelectorUnidades.css .formulario-unidades-opcion | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | TablaIncidencias.css .tabla-incidencias td | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | TablaIncidencias.css .tabla-incidencias-titulo | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | TablaReservas.css .tabla-reservas td | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | TarjetaAlerta.css .tarjeta-alerta-mensaje | #1f2937 sobre #f8fafc (fondo) |
| 14.03 | cumple | global.css body | #1f2937 sobre #f8fafc |
| 14.68 | cumple | FichaRecurso.css .ficha-nombre | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | FormularioIncidencia.css .campo-checkbox label | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | FormularioIncidencia.css .formulario-incidencia-titulo | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | FormularioReserva.css .campo label | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | MenuNavegacion.css .boton-menu | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | PaginaAlertas.css .boton-filtro-alerta | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | PaginaConfiguracion.css .configuracion-checkbox | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | PaginaInventario.css .encabezado-pagina-titulo | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | PaginaLogin.css .login-etiqueta | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | SelectorUnidades.css .formulario-unidades-opcion | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | TablaIncidencias.css .tabla-incidencias td | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | TablaIncidencias.css .tabla-incidencias-titulo | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | TablaReservas.css .tabla-reservas td | #1f2937 sobre #ffffff (blanco) |
| 14.68 | cumple | TarjetaAlerta.css .tarjeta-alerta-mensaje | #1f2937 sobre #ffffff (blanco) |

**Auditoría de 360 px, 768 px y 1024 px (por lectura del CSS):**
- Ya funcionaban: grilla de tarjetas (`minmax(240px, 1fr)`), grilla de alertas (una columna bajo 768 px), tablas de reservas, historial, incidencias, unidades y de la planilla (todas dentro de un recuadro con `overflow-x: auto`), formularios de reserva, incidencia, nuevo recurso y cambio de estado (una columna bajo 768 px y letra de 16 px), paginación con `flex-wrap` y login.
- Corregido: selects con opciones muy largas (la categoría más larga de la planilla mide ~42 caracteres sin espacios), textos largos sin espacios en la tarjeta, la ficha y Configuración, la barra azul bajo 420 px, y la barra de filtros entre 701 y 1100 px (ver arriba). Ningún `@media` existente fue modificado, salvo que el de 420 px de `MenuNavegacion.css` recibió reglas nuevas de la barra azul. En `FiltrosInventario.css` el orden es: regla base, bloque de 1100 px (nuevo) y bloque de 700 px (existente, sin cambios).
- Desviaciones aceptadas y documentadas: **el menú tiene scroll horizontal interno a 360 px** (la fila de pestañas del encargado con 6 ítems no cabe y se desliza dentro de su barra; es el patrón de pestañas ya diseñado en M17/M21), igual que la fila de filtros de alertas y las tablas anchas dentro de su recuadro. RNF-01 se lee como "sin desplazamiento horizontal **de la página**".

**Pendientes (fuera de J39):** RNF-03 y RNF-08 (J40 con HU-15, decisión D6), RNF-06 respaldo semanal (D7), correo de RNF-04 (HU-17, en espera por D5), RNF-09 (no verificable desde el código). `docs/plan-fase-4.md` no se actualizó en esta rama; su tabla de estado queda para una tarea de documentación aparte.

**Verificación:** `npm run build` y `npm run lint` sin errores en cada commit. **No hubo pruebas de navegador desde la sesión de Claude.** Qué debe revisar Johann en el navegador (DevTools en modo celular; en cada ancho, que la página no se deslice hacia el costado ni haya texto cortado), a 360, 390, 768 y 1024 px (y 1280 px para los filtros):
1. Login: tarjeta completa y botón de 44 px.
2. Barra azul: título, nombre y "Cerrar sesión" caben a 360 px; el botón se lee normal y al pasar el mouse (fondo azul oscuro); el contador rojo del menú se lee bien.
3. Menú: a 360 px la fila se desliza dentro de su barra; "Cargar planilla" solo para el encargado.
4. Inventario, filtros: a 768 y 1024 px los 4 selects en 2×2 con el buscador en toda la fila, y se leen completos "Entre 1 y 2 años" y "En mantención"; a 700 px o menos, una columna; a 1280 px, 4 selects en una fila; el selector de Categoría con la categoría larga ("Electronica/electricidad/electromagnetismo") sin ensanchar la página.
5. Inventario, resto: tarjetas en una columna; categoría larga en la cabecera de la tarjeta sin cortarse; paginación con varias páginas; con un filtro sin resultados debe aparecer "No se encontraron recursos con esos filtros".
6. Ficha: datos en una columna; una serie o modelo largo sin desbordar la tarjeta; tablas con scroll dentro de su recuadro; los formularios de la derecha bajan debajo de la ficha.
7. Agregar recurso: selector de categoría largo sin ensanchar el formulario; campo de fecha; campos de número de serie.
8. Reservas: formulario y tabla con scroll.
9. Incidencias: contar las 5 acciones del recorrido mínimo; probar con un campo vacío y ver que dice cuál falta sin borrar lo escrito; tabla con scroll.
10. Alertas: tarjetas en una columna; tipo, fecha, recurso y ubicación visibles.
11. Configuración: lista de categorías con descripción, torres y salas, sin cortes.
12. Cargar planilla: selector de archivo y tablas con scroll (sin cargar nada real).
13. Contraste a simple vista: tablas de historial e incidencias, cabecera de las tarjetas, descripción de categorías, texto de ayuda dentro de los campos y contador rojo.

**Archivos nuevos:** `docs/avance/2026-10-31-J39-rnf-cierre-fase-4.md`.

**Archivos modificados:** `src/components/MensajeSinResultados.tsx`, `src/styles/global.css`, `src/components/MenuNavegacion.css`, `src/components/FiltrosInventario.css`, `src/components/FormularioNuevoRecurso.css`, `src/components/TarjetaRecurso.css`, `src/components/FichaRecurso.css`, `src/pages/PaginaConfiguracion.css`.
