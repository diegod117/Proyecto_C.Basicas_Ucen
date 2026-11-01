# 2026-11-01 — J42: página de bienvenida e ingreso "LabCentral" (Johann)

**HU trabajada:** ninguna de la línea base. Es un pedido de diseño del stakeholder: un ingreso "bonito", con identidad propia y con la Universidad Central presente. Toca RNF-01 (360 px), RNF-11 (contraste) y el inicio de sesión (sección 3.4, HU-15), sin cambiar su comportamiento. Rama: `feature/bienvenida-labcentral`. (J41 queda reservado para HU-17, en espera.)

**Qué se hizo:**
- La ruta `/login` pasó de ser una tarjeta centrada sobre un degradado a una **página de bienvenida**. Arriba va un tablero de tiles que llena la pantalla: la marca UCEN, enlaces a las secciones, el nombre "LabCentral" con el logo de la Facultad, dos fotos, el formulario de ingreso y un tile azul de acento. Debajo vienen 4 secciones y el pie:
  1. "Todo el laboratorio, ordenado": con un selector **Encargado · Docente · Departamento** (un `useState`), las filas muestran lo que puede hacer ese rol. Parte en Docente.
  2. "Dos salas, un inventario": página azul noche con un mosaico de fotos, B206, B302 y "13 categorías".
  3. "Hecho en la Central": los integrantes, la asignatura, el profesor y el sello de la carrera.
  4. "Preguntas frecuentes": 10 preguntas como texto de lectura, en 2 columnas.
  5. El pie: el nombre a todo el ancho, las salas, los enlaces, los logos, el bloque **"Realizado en equipo por:"** (pedido del profesor) y los créditos de las fotos.
- **El formulario se comporta igual.** Su lógica pasó tal cual de `PaginaLogin.tsx` a `components/FormularioIngreso.tsx`: los mismos `useState`, la validación de campos vacíos, `iniciarSesion`, el cálculo `mensajeMostrado`/`yaIntento` de HU-15 y el cambio a "¿Olvidaste tu contraseña?" con su "Volver". Ahora la recuperación aparece dentro del mismo tile. Solo cambiaron textos de presentación:
  - el título pasó a un h2 "Ingresa a tu cuenta";
  - la etiqueta dice "Correo institucional";
  - el botón dice "Ingresar" / "Ingresando…";
  - se agregó la línea "¿No tienes cuenta? Pídela al encargado del laboratorio.".
  - En `FormularioRecuperarContrasena` el h1 pasó a h2, porque el único h1 de la página es "LabCentral".
- **Montserrat reemplaza a Inter en toda la app** (`<link>` de Google Fonts en `index.html`, no es un paquete). El `<title>` ahora es "LabCentral · Inventario Ciencias Básicas UCEN".
- **Colores UCEN como variables** en `global.css`: `--ucen-azul`, `--ucen-azul-hover`, `--ucen-noche`, `--ucen-tinta`, `--ucen-tinta-suave`, `--ucen-papel`, `--ucen-superficie`, `--ucen-gris`, `--ucen-texto-claro`, `--ucen-borde-campo` y `--ucen-radio` (8 px). **Los colores de la app no cambiaron**: el rediseño del resto de la app es otra rama.
- **Movimiento** (solo con `prefers-reduced-motion: no-preference`):
  - la foto de probetas se abre como un obturador al cargar;
  - la foto de hornos hace un zoom muy lento;
  - las secciones aparecen al bajar con un `IntersectionObserver` (`threshold: 0` y `rootMargin: '0px 0px -10% 0px'`).
  - **Ningún elemento puede quedar oculto si algo falla.** El estado oculto existe solo en pantalla (no al imprimir), sin movimiento reducido y con la clase `con-animacion` en el `<html>`, que pone el `useEffect`. Si no existe `IntersectionObserver`, se muestra todo de inmediato. Al salir de la página se quita la clase.
- **Fotos libres** de Wikimedia Commons, en escala de grises, en `public/bienvenida/` (carpeta nueva, autorizada por Johann). A la foto del pH-metro se le recortó el marco negro del escaneo. Ningún texto dice que sean nuestros laboratorios.

**Decisiones:**
- Nombre **LabCentral**. Fuente **Montserrat**, porque Gotham, la oficial, es de pago. Fotos libres con créditos en el pie. Alcance: bienvenida y secciones.
- **Tablero en 4 disposiciones.** Opción b), aprobada por el coordinador después de medir:
  1. escritorio con 2×2;
  2. **escritorio bajo**, solo con `@media (min-width: 1025px) and (max-height: 800px)`: el tile de ingreso ocupa las dos filas de la columna central;
  3. tablet (701–1024 px);
  4. celular (≤ 700 px).
  - Con 1024 px o menos mandan tablet y celular aunque la pantalla sea baja.
  - El h1 de la disposición 2 se calcula con el ancho real de su columna, que es la mitad del tablero: `min(calc((50vw - 64px) / 5.4), 11vh)`.
- Los enlaces de la barra empiezan en el eje (centro) solo desde 1440 px; más angosto no caben, y con menos de 860 px se esconden (están en el pie).
- Los textos fijos van en `src/data/` (`bienvenida.ts`, `preguntasBienvenida.ts`, `creditosBienvenida.ts`) con el comentario de que **no se suben a Firestore**.
- El borde de los campos es `#8290a1`: 3,25:1 contra el blanco del campo.
- Display tiene 32 px de mínimo, no 36, para que "Todo el laboratorio, ordenado" quede en 2 líneas a 360 px.

**Textos corregidos al revisarlos contra el código** (el resto del brief se verificó y se dejó igual):

| Dónde | Texto del brief | Texto final | Por qué |
|---|---|---|---|
| Docente 3 | En "Mis reservas" ves las programadas, las en curso y las realizadas | En Reservas ves tus reservas programadas y en curso, y tu historial de las realizadas. Puedes cancelar las tuyas mientras no hayan terminado. | La página se llama Reservas; solo se cancelan las que no terminaron (`TablaReservas`) |
| Encargado 1 | cada unidad con su número de serie, su estado y su ubicación | cada unidad con su número de serie y su estado, y cada recurso con su ubicación exacta | `Unidad` solo tiene número y estado; la ubicación es del recurso |
| Encargado 2 | Adquisiciones, préstamos, reparaciones y bajas | Adquisiciones, préstamos, reposiciones, envíos a mantención y bajas | `TipoEntrada` / `TipoSalida` |
| Departamento 2 | alertas de stock y mantención | alertas de reparación, mantención y reposición | `textoTipoAlerta` |
| Departamento 3 | Filtra por años desde la adquisición | Cada ficha muestra la fecha y la antigüedad en años y meses; filtra por menos de 1 año, entre 1 y 2 o más de 2 | `opcionesAntiguedad` |
| Laboratorios | material de vidrio… / "Vidrio y más" | balanzas, control de temperatura, material volumétrico, pH-metros, computadores e instrumentos de mecánica, óptica y electrónica / "… Computadores · … · pH-metros · Volumétricos y más" | Las 13 categorías de la planilla no incluyen "vidrio" |
| Pregunta 2 | La contraseña debe tener al menos 6 caracteres | (se quitó) | No está en nuestro código: lo decide Firebase |
| Preguntas 1, 3, 4, 6, 7 y 9 | (ver brief) | Se precisó: Configuración > Usuarios; los dos mensajes de "no registrado"; "desactivada"; las unidades y salas libres; cancelar desde Reservas; la unidad solo si tiene número de serie | `authService`, `FormularioReserva`, `CampoUnidadIncidencia` |

Las salas B206 y B302 y las 13 categorías se verificaron en la planilla real: B-206 tiene 79 marcas y B-302 tiene 63.

**Mediciones** (Chrome headless contra `npm run dev`; el error de prueba es "Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.", de 2 líneas). "Fin" es el borde inferior del tablero y "nota" la última línea del formulario. El formulario cabe completo si la nota queda dentro de la pantalla.

| Pantalla | Disposición | Sin error (fin / nota) | Con error (fin / nota) | ¿Cabe el formulario? | "LabCentral" (texto / espacio) |
|---|---|---|---|---|---|
| 1920×1080 | 1 | 1080 / 1040 | 1080 / 1040 | sí / sí | 644 / 880 |
| 1536×864 | 1 (≤ 900 de alto) | 864 / 832 | 879 / 847 | sí / sí | 494 / 704 |
| 1440×900 | 1 (≤ 900 de alto) | 900 / 868 | 902 / 870 | sí / sí | 514 / 656 |
| 1280×800 | 2 | 800 / 616 | 800 / 655 | sí / sí | 457 / 576 |
| 1366×768 | 2 | 768 / 600 | 768 / 639 | sí / sí | 439 / 619 |
| 1280×720 | 2 | 720 / 576 | 720 / 615 | sí / sí | 411 / 576 |
| 1025×700 | 2 | 700 / 566 | 700 / 616 | sí / sí | 400 / 449 |
| 1024×768 | 3 (tablet) | 1101 / 753 | 1177 / 830 | sí / no (no se exige) | 372 / 452 |
| 768×1024 | 3 | 1202 / 753 | 1279 / 830 | sí / sí | 279 / 324 |
| 740×360 | 3 | 1052 / 772 | 1129 / 849 | no / no (no se exige) | 269 / 310 |
| 640×360 | 4 (celular) | 1838 / 749 | 1915 / 826 | no / no (no se exige) | 554 / 576 |
| 390×844 | 4 | 1494 / 752 | 1571 / 829 | sí / sí | 314 / 326 |
| 360×740 | 4 | 1444 / 747 | 1543 / 846 | no / no (casi) | 285 / 296 |

- **Sin scroll horizontal en ningún ancho** de la tabla, con la página completa.
- Todos los títulos tienen 2 líneas o menos y hay un solo h1.
- El nombre del pie, con `(100vw − 2×margen) / 5.5`, mide 1245 de 1344 px a 1440 y ~289 de 312 a 360, sin recorte.
- Con un error de 2 líneas, en 1440×900 y 1536×864 el tile de ingreso pasa 2 y 15 px bajo el borde (solo su relleno inferior); el formulario completo se ve igual.
- La recuperación con el aviso verde cabe en 1440×900, 1280×720, 1366×768 y 1025×700, y el diseño no salta.

**Otras pruebas:**
- **Formulario** (contra Firebase real, con un correo inexistente):
  - con campos vacíos aparece "Escribe tu correo y tu contraseña.";
  - mientras espera muestra "Ingresando…" con el botón desactivado;
  - con una clave mala aparece "Correo o contraseña incorrectos, o usuario no registrado.";
  - la recuperación copia el correo y "Volver" lo conserva.
- **Entradas al bajar:** en 1440×900, 740×360, 640×360 y 360×740, las 11 partes con `aparece` empiezan ocultas y quedan visibles al bajar hasta el final (0 ocultas). Con movimiento reducido o al imprimir, ninguna está oculta y no hay animaciones. Al desmontar la página, el `<html>` queda sin `con-animacion`.
- **Orden de Tab:**
  - el recorrido completo es marca → 4 enlaces → Ingresar → correo → contraseña → Ingresar → ¿Olvidaste? → selector (con `aria-pressed`) → enlaces y créditos del pie → Volver arriba;
  - el contorno es azul sobre fondo claro y blanco en los tiles oscuros y en el pie;
  - "Ingresar" (barra y pie) pone el foco en el correo, incluso con la recuperación abierta.
- **Selector:** Encargado muestra 4 filas, Docente 4 y Departamento 3.
- **App con Montserrat a 360 px:** como no hay contraseña de prueba para entrar, las páginas se montaron con un usuario simulado y los datos de `src/data/`, sin tocar el repo ni Firestore. Se revisaron Inventario, la ficha, Agregar recurso, Reservas (encargado y docente), Incidencias, Alertas, Configuración y Cargar planilla, con Montserrat y con Inter: **sin desbordes en ninguna**.
  - Las tablas siguen en sus recuadros con scroll, como antes.
  - El título de la barra azul ya se cortaba con "…" y se sigue cortando.
  - Los números de las tablas usan dígitos proporcionales; no molesta, se anota para la rama de rediseño.
  - Las clases nuevas no chocan con ninguna clase de la app, y las reglas compartidas cuelgan de `.pagina-bienvenida`.
- **No se probó con una sesión real** (falta la contraseña de prueba). Hay que probar el ingreso de verdad (ver abajo).

**Créditos de las fotos** (también en el pie, con enlaces):
- «Graduated Cylinders and Beaker filled with Chemical Compounds», Horia Varlan, CC BY 2.0;
- «Muffle furnaces», Brammers, CC0;
- «Beckman Model 72 pH Meter», dominio público;
- «Oscilloscope APL», Tourbillon, CC BY-SA 3.0;
- «Incandescence», Debivort, CC BY-SA 3.0;
- «Laboratory Hydrometer test», Maame1Yaa, CC0;
- «Laboratory graduated cylinders for volumes measurements (milliliters)», Albarubescens, CC BY-SA 4.0;
- «Laboratory at Park College, 1910», sin restricciones de derechos conocidas.

Todas vía Wikimedia Commons. Imágenes redimensionadas y mostradas en escala de grises.

**Cómo probarlo en el navegador** (`npm run dev`, sin sesión, `/login`):
1. Entrar con una cuenta real. Debe pasar al inventario como siempre. Con una cuenta desactivada debe aparecer el aviso de HU-15 dentro del tile de ingreso.
2. Probar "¿Olvidaste tu contraseña?" y "Volver", y los botones "Ingresar" de la barra y del pie.
3. Usar los enlaces Qué hace / Laboratorios / Quiénes somos / Preguntas y "Volver arriba".
4. Cambiar el rol en "Soy: Encargado · Docente · Departamento".
5. En DevTools, probar 1440×900, 1280×720, 768×1024 y 360×740, y "Emulate prefers-reduced-motion: reduce".
6. Después de entrar, revisar la app en 360 px con la letra nueva.

**Archivos tocados (líneas):**
- Modificados:
  - `index.html`
  - `src/styles/global.css`
  - `src/pages/PaginaLogin.tsx` (92) y `.css` (46)
  - `src/components/FormularioRecuperarContrasena.tsx` (103) y `.css` (15)
- Nuevos — componentes (.tsx / .css):
  - `FormularioIngreso` (147 / 155)
  - `TableroBienvenida` (62 / 144)
  - `BarraBienvenida` (35 / 129)
  - `NombreTablero` (29 / 99)
  - `FotoTablero` (35 / 86)
  - `SeccionQueHace` (58 / 156)
  - `SelectorRolBienvenida` (67, usa el .css de SeccionQueHace)
  - `SeccionLaboratorios` (66 / 109)
  - `SeccionQuienes` (47 / 93)
  - `SeccionPreguntas` (31 / 50)
  - `PieBienvenida` (98 / 156)
  - `CreditosBienvenida` (58 / 41)
- Nuevos — otros:
  - `src/styles/bienvenida.css` (119)
  - `src/types/Bienvenida.ts` (37)
  - `src/data/bienvenida.ts` (87), `src/data/preguntasBienvenida.ts` (58) y `src/data/creditosBienvenida.ts` (71)
  - `src/utils/bienvenida.ts` (40)
  - `public/bienvenida/` (8 fotos y 6 logos)
  - `docs/avance/2026-11-01-J42-bienvenida-labcentral.md`
