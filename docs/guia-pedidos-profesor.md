# Guía de los pedidos del profesor — código y cómo cambiar cosas

Esta guía es **solo** sobre lo que el profesor pidió para la segunda presentación. Para lo básico (componentes, props, useState, useEffect, CSS), mira [guia-estudio.md](guia-estudio.md).

Cada pedido tiene cuatro partes:

1. **Qué hace**, en palabras simples.
2. **El código explicado**: qué archivo hace qué, con los pedazos importantes.
3. **Recetas**: cómo cambiar cosas, con el "antes" y el "después".
4. **Si te preguntan**: respuestas cortas para la presentación.

> **Tip:** en vez de buscar por número de línea, abre el archivo y usa **Ctrl+F** (Cmd+F en Mac) con el texto que dice cada receta. Los números de línea cambian entre `main` y esta rama por los comentarios, pero el código es el mismo.

> **Después de cada cambio:** guarda, mira el navegador y, antes de subir algo, corre `npm run build` y `npm run lint`. Si algo se rompe, `git checkout -- archivo` lo deja como estaba.

| # | Pedido del profesor | Ir a |
|---|---|---|
| 1 | Paginación para el inventario | [Pedido 1](#pedido-1--paginación-del-inventario) |
| 2 | Agregar categorías nuevas | [Pedido 2](#pedido-2--agregar-categorías-nuevas) |
| 3 | Reservas que quedan "realizadas", pasan al historial y devuelven las unidades | [Pedido 3](#pedido-3--reservas-que-terminan-solas) |
| 4 | Elegir la sala de una lista de salas disponibles | [Pedido 4](#pedido-4--elegir-la-sala-de-una-lista-de-salas-libres) |
| 5 | Agregar torres y salas con un botón (escalabilidad) | [Pedido 5](#pedido-5--agregar-torres-y-salas-escalabilidad) |
| — | Chuleta: todos los cambios rápidos en una tabla | [Chuleta](#chuleta-qué-cambiar-y-dónde) |

---

## Pedido 1 — Paginación del inventario

### Qué hace

El inventario ya no muestra todos los recursos de una vez: los muestra **de 9 en 9**, como las páginas de un libro. Abajo de las tarjetas aparecen los botones:

```
← Anterior   [1]  2   3   Siguiente →
```

- La página actual se ve **azul**.
- "Anterior" se apaga en la página 1, y "Siguiente" en la última.
- Si hay una sola página, los botones no aparecen.
- Si cambias un filtro, vuelves a la página 1.
- Si abres una ficha y vuelves, sigues en la misma página.

### El código explicado

Son 3 archivos, cada uno con su trabajo:

| Archivo | Su trabajo | Es como... |
|---|---|---|
| [utils/paginacion.ts](../src/utils/paginacion.ts) | Las **cuentas**: cuántas páginas hay y qué recursos van en cada una | La calculadora |
| [hooks/useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts) | La **memoria**: en qué página estás (un `useState`) | La libreta |
| [components/Paginacion.tsx](../src/components/Paginacion.tsx) | Los **botones** que ves | El control remoto |

**1. Las cuentas** — `utils/paginacion.ts`:

```ts
export const RECURSOS_POR_PAGINA = 9;

export function calcularTotalPaginas(cantidad: number, porPagina: number): number {
  const paginas = Math.ceil(cantidad / porPagina);   // 20 / 9 = 2,2 → redondea hacia arriba → 3
  if (paginas < 1) {
    return 1;                                         // 0 recursos → igual "1 página" (vacía)
  }
  return paginas;
}

export function obtenerRecursosDePagina(lista: Recurso[], pagina: number, porPagina: number): Recurso[] {
  const inicio = (pagina - 1) * porPagina;            // página 2 → (2-1) × 9 = 9
  return lista.slice(inicio, inicio + porPagina);     // corta desde la posición 9 hasta la 17
}
```

`slice` es como cortar una tajada de pan: la lista original no cambia, solo sacas una copia de ese pedazo. Las listas cuentan **desde 0**, así que la posición 9 es el **décimo** recurso.

**2. La memoria** — `hooks/useFiltrosInventario.ts`:

```ts
const [paginaActual, setPaginaActual] = useState(1);   // parte en la página 1

// Primero se filtra, DESPUÉS se pagina:
const recursosFiltrados = filtrarRecursos(listaRecursos, textoBusqueda, categoria, laboratorio, estado);
const totalPaginas = calcularTotalPaginas(recursosFiltrados.length, RECURSOS_POR_PAGINA);

// Protección: si estabas en la página 3 pero ahora solo hay 2, mostramos la 2.
let paginaMostrada = paginaActual;
if (paginaMostrada > totalPaginas) {
  paginaMostrada = totalPaginas;
}

// Al cambiar un filtro, volvemos a la página 1:
function cambiarCategoria(valor: string) {
  setCategoria(valor);
  setPaginaActual(1);
}

// Al cambiar de página, subimos hasta arriba:
function cambiarPagina(pagina: number) {
  setPaginaActual(pagina);
  window.scrollTo(0, 0);
}
```

El hook le entrega a la página **solo los 9 recursos** de la página actual (`recursosDeLaPagina`), y la grilla dibuja solo esos.

**3. Los botones** — `components/Paginacion.tsx`:

```tsx
if (props.totalPaginas <= 1) {
  return null;                                 // 1 página → no dibuja nada
}

const numerosDePagina: number[] = [];
for (let numero = 1; numero <= props.totalPaginas; numero++) {
  numerosDePagina.push(numero);                // 3 páginas → [1, 2, 3]
}

<button disabled={props.paginaActual === 1}
        onClick={() => props.onCambiarPagina(props.paginaActual - 1)}>
  ← Anterior
</button>
```

`Paginacion` **no tiene** `useState`: no sabe en qué página estás, solo muestra lo que le pasan y **avisa** cuando aprietas un botón (`props.onCambiarPagina`). Los datos bajan por props y los avisos suben con funciones.

**¿Por qué no se pierde la página al abrir una ficha?** Porque la ficha es una ruta **de adentro** de `/inventario` (`/inventario/3`). PaginaInventario nunca desaparece, así que su memoria, la del hook, sigue ahí.

### Recetas

**1.1 Mostrar 12 recursos por página en vez de 9**
[utils/paginacion.ts](../src/utils/paginacion.ts), busca `RECURSOS_POR_PAGINA`:
```ts
export const RECURSOS_POR_PAGINA = 12;   // antes: 9
```
Con 12 se ve una grilla de 4 × 3 en el computador. Es **el único cambio**: el resto de la app usa esta constante.

**1.2 Cambiar el texto de los botones**
[components/Paginacion.tsx](../src/components/Paginacion.tsx), busca `← Anterior` y `Siguiente →`, y cambia el texto entre las etiquetas:
```tsx
        « Volver        {/* antes: ← Anterior */}
        ...
        Ver más »       {/* antes: Siguiente → */}
```

**1.3 Agregar un texto "Página 2 de 3"**
En [Paginacion.tsx](../src/components/Paginacion.tsx), justo antes del botón "Siguiente", agrega:
```tsx
      <span className="texto-secundario">
        Página {props.paginaActual} de {props.totalPaginas}
      </span>
```
`texto-secundario` es una clase que ya existe (letra gris).

**1.4 Que al cambiar un filtro NO vuelva a la página 1**
[hooks/useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts): borra la línea `setPaginaActual(1);` de `cambiarTexto`, `cambiarCategoria`, `cambiarLaboratorio` y `cambiarEstado`. No pasa nada malo si la página ya no existe, gracias a la protección `paginaMostrada`.

**1.5 Que al cambiar de página NO suba hasta arriba**
En el mismo archivo, en `cambiarPagina`, borra `window.scrollTo(0, 0);`.

**1.6 Cambiar el color del botón de la página actual**
[components/Paginacion.css](../src/components/Paginacion.css), busca `.paginacion-actual`:
```css
.paginacion-actual,
.paginacion-actual:hover:not(:disabled) {
  color: var(--color-blanco);
  background-color: #15803d;   /* verde (antes: var(--color-principal), el azul) */
  border-color: #15803d;
}
```

**1.7 Que los botones aparezcan aunque haya una sola página**
En [Paginacion.tsx](../src/components/Paginacion.tsx), cambia `if (props.totalPaginas <= 1)` por `if (props.totalPaginas < 1)`.

### Cómo probarlo

1. Entra como encargado. Si hay más de 9 recursos, abajo aparecen los botones.
2. Ve a la página 2, abre una ficha y aprieta "Volver" (o "Atrás" del navegador): sigues en la página 2.
3. Filtra por una categoría con pocos recursos: los botones desaparecen y vuelves a la página 1.
4. Si hay 9 recursos o menos, agrega uno con "+ Agregar recurso" para que aparezca la página 2.

### Si te preguntan

| Pregunta | Respuesta |
|---|---|
| ¿Cómo calculan cuántas páginas hay? | Cantidad de recursos filtrados dividido 9, redondeado hacia arriba con `Math.ceil`. |
| ¿Cómo saben qué recursos van en cada página? | `slice` corta la lista desde `(página - 1) × 9` y toma 9. |
| ¿Dónde se guarda la página actual? | En un `useState` del hook `useFiltrosInventario`, que usa PaginaInventario. |
| ¿Por qué primero filtran y después paginan? | Para que la paginación sea sobre lo que el usuario está buscando. Si paginaras primero, la página 2 podría quedar vacía después de filtrar. |
| ¿Por qué un hook propio? | Para juntar toda la memoria de filtros y páginas en un lugar y que PaginaInventario quede corta y solo dibuje. |

---

## Pedido 2 — Agregar categorías nuevas

### Qué hace

El encargado entra a **Configuración** (en el menú, solo él la ve) y en la tarjeta "Categorías de recursos" escribe una nueva, por ejemplo **"Material de vidrio"**. Si marca **"Se gasta"**, el formulario de agregar recurso le pedirá el stock mínimo, como a los insumos y reactivos.

La categoría nueva aparece **sola** en:

- el filtro de categoría del inventario;
- el menú "Categoría" de "+ Agregar recurso";
- las tarjetas y fichas de los recursos de esa categoría.

### El código explicado

**La idea clave:** antes, las 6 categorías estaban **escritas en el código**. Para agregar una había que programar. Ahora son **datos** guardados en Firestore (colección `categorias`), y todos los componentes le **piden la lista** al servicio.

```
ANTES                                     AHORA
types/Recurso.ts:                         types/Recurso.ts:
  type CategoriaRecurso =                   type CategoriaRecurso = string;
    'instrumento' | 'insumo' | ...        Firestore → colección "categorias"
utils/inventario.ts:                        → configuracionService.obtenerCategorias()
  listaCategoriasRecurso = [...]             → filtro, formulario, tarjetas...
  textoCategoria: if/else ×6
```

**1. El molde** — [types/Configuracion.ts](../src/types/Configuracion.ts):

```ts
export interface Categoria {
  clave: string;            // 'material_de_vidrio' → lo que se guarda en cada recurso
  nombre: string;           // 'Material de vidrio' → lo que ve la persona
  usaStockMinimo: boolean;  // true = se gasta (pide stock mínimo, HU-09)
}
```

**2. La clave se arma sola** — [utils/configuracion.ts](../src/utils/configuracion.ts):

```ts
export function crearClaveCategoria(nombre: string): string {
  return prepararTextoParaBuscar(nombre).replaceAll(' ', '_');
  // "Material de Vidrio" → "material de vidrio" (minúsculas, sin tildes) → "material_de_vidrio"
}
```

**3. El revisor** — en el mismo archivo, `validarNuevaCategoria`:

```ts
if (nombre.trim() === '') {
  return 'Escribe el nombre de la categoría.';
}
const clave = crearClaveCategoria(nombre);
for (const categoria of existentes) {
  if (categoria.clave === clave) {
    return 'Ya existe la categoría "' + categoria.nombre + '".';
  }
}
return '';   // '' = todo bien
```

Compara **claves**, no nombres. Así "Equipo", "equipo" y "Équipo" cuentan como la misma.

**4. El formulario** — [components/SeccionCategorias.tsx](../src/components/SeccionCategorias.tsx), función `guardar`. Sigue la receta de siempre:

```tsx
evento.preventDefault();                                // 1. no recargar
const error = validarNuevaCategoria(nombre, categorias); // 2. revisar
if (error !== '') { setMensajeError(error); return; }
setGuardando(true);
const seGuardo = await agregarCategoria({               // 3. guardar
  clave: crearClaveCategoria(nombreLimpio),
  nombre: nombreLimpio,
  usaStockMinimo: usaStockMinimo,
});
if (seGuardo) { ... props.onAgregado(); }               // 4. avisar a la página
```

**5. El bodeguero** — [services/configuracionService.ts](../src/services/configuracionService.ts):

```ts
export async function agregarCategoria(categoria: Categoria): Promise<boolean> {
  try {
    await setDoc(doc(baseDatos, 'categorias', categoria.clave), categoria);  // 1º Firestore
  } catch (error) {
    return false;                                                            // falló → no se toca nada
  }
  listaCategorias.push(categoria);                                           // 2º la copia en memoria
  ordenarListas();
  return true;
}
```

Primero se guarda en la nube, y **solo si funcionó** se agrega a la copia en memoria. Así la pantalla nunca muestra algo que no se guardó.

**6. Todos piden la lista al servicio:**

| Dónde | Qué llama |
|---|---|
| Filtro del inventario ([FiltrosInventario.tsx](../src/components/FiltrosInventario.tsx)) | `obtenerCategorias().map(...)` |
| "+ Agregar recurso" ([FormularioNuevoRecurso.tsx](../src/components/FormularioNuevoRecurso.tsx)) | `obtenerCategorias().map(...)` |
| Nombre bonito en tarjetas y ficha ([utils/inventario.ts](../src/utils/inventario.ts)) | `textoCategoria` → `obtenerCategoriaPorClave(clave).nombre` |
| ¿Pedir stock mínimo? ([utils/nuevoRecurso.ts](../src/utils/nuevoRecurso.ts)) | `usaStockMinimo` → `obtenerCategoriaPorClave(...).usaStockMinimo` |

**7. La primera vez (la semilla):** si la colección `categorias` está vacía, `cargarConfiguracion` sube las 6 categorías de [data/configuracion.ts](../src/data/configuracion.ts) con un `writeBatch` (todas juntas o ninguna).

**8. No se pueden borrar ni editar** desde la app. Las reglas de Firestore ([docs/firestore.rules](firestore.rules)) solo permiten `read` y `create` en `categorias`, porque si borraras "Insumo", los recursos que son insumos quedarían con una categoría que no existe.

### Recetas

**2.1 Agregar una categoría (sin programar)**
Encargado → **Configuración** → "Nueva categoría" → escribe el nombre → marca "Se gasta" si corresponde → **"+ Agregar categoría"**.

**2.2 Cambiar el NOMBRE de una categoría que ya existe**
Desde la app no se puede (a propósito). Se hace en la **consola de Firebase → Firestore → `categorias`** → abre el documento (ej: `instalacion`) → edita el campo `nombre` → recarga la app (F5). **No cambies la `clave`** ni el nombre del documento: los recursos guardan la clave.

**2.3 Que una categoría existente pase a pedir stock mínimo**
Igual que 2.2, pero cambia el campo `usaStockMinimo` a `true`.

**2.4 Agregar una categoría "de fábrica"**
En [data/configuracion.ts](../src/data/configuracion.ts), en `listaCategoriasPrueba`, agrega una línea:
```ts
  { clave: 'herramienta', nombre: 'Herramienta', usaStockMinimo: false },
```
⚠️ Solo se sube si la colección `categorias` está **vacía** (la primera vez). Si ya tiene datos, usa la receta 2.1.

**2.5 Cambiar el texto del cuadradito "Se gasta"**
[SeccionCategorias.tsx](../src/components/SeccionCategorias.tsx), busca `Se gasta (pedir stock mínimo`, y cambia el texto.

**2.6 Cambiar los mensajes de error**
[utils/configuracion.ts](../src/utils/configuracion.ts), en `validarNuevaCategoria`: cambia los textos de los `return`. Por ejemplo, `'Escribe el nombre de la categoría.'` → `'Falta el nombre.'`.

**2.7 Ordenar las categorías de otra forma**
[configuracionService.ts](../src/services/configuracionService.ts), función `ordenarListas`. Para que las que usan stock mínimo vayan primero, cambia el `sort` de categorías por:
```ts
  listaCategorias.sort(function (a, b) {
    if (a.usaStockMinimo && !b.usaStockMinimo) {
      return -1;          // a va primero
    }
    if (!a.usaStockMinimo && b.usaStockMinimo) {
      return 1;           // b va primero
    }
    return a.nombre.localeCompare(b.nombre);   // empate: por nombre
  });
```

### Cómo probarlo

1. Encargado → Configuración → agrega "Herramienta".
2. Inventario → filtro de categoría: aparece "Herramienta".
3. "+ Agregar recurso" → elige "Herramienta": **no** aparece "Stock mínimo". Agrega otra categoría marcando "Se gasta", elígela, y ahora **sí** aparece.
4. Intenta agregar "herramienta" otra vez: *"Ya existe la categoría "Herramienta"."*

> ⚠️ Lo que agregues **queda guardado** y no se borra desde la app. Si fue una prueba, bórralo en la consola de Firebase.

### Si te preguntan

| Pregunta | Respuesta |
|---|---|
| ¿Qué tuvieron que cambiar para agregar categorías sin programar? | Pasamos las categorías del código a Firestore. Todos los componentes le piden la lista a `configuracionService`, así una nueva aparece en todos lados sola. |
| ¿Por qué `CategoriaRecurso` es `string`? | Porque el encargado inventa categorías nuevas y TypeScript no puede saber sus nombres de antemano. |
| ¿Qué es la clave? | El nombre "interno" (minúsculas, sin tildes, con `_`) que se guarda en cada recurso. El nombre bonito es solo para mostrar. |
| ¿Cómo evitan repetidas? | Comparan claves: "Equipo" y "equipo" dan la misma clave. Además, el documento se llama como la clave, y las reglas no dejan sobrescribirlo. |
| ¿Por qué no se pueden borrar? | Porque hay recursos que las usan. Las reglas de Firestore solo permiten leer y crear. |

---

## Pedido 3 — Reservas que terminan solas

### Qué hace

Una reserva pasa por **3 momentos**, igual que una clase del horario:

```
                 10:00                     11:30
──────────────────┼──────────────────────────┼─────────────▶ hora
   PROGRAMADA     │        EN CURSO          │   REALIZADA
   (azul)         │  (amarillo)              │   (gris)
                  │  las unidades están en   │   pasa al HISTORIAL y
                  │  la sala del profesor    │   las unidades VUELVEN
```

- En **Reservas** hay **dos tablas**: arriba "Próximas reservas y en curso" (con botón Cancelar) y abajo "Historial de reservas (realizadas)".
- Mientras una reserva está **en curso**, la tarjeta del inventario dice *"15 disponibles · 4 en reserva ahora"* y la ficha muestra un aviso amarillo.
- Cuando termina, la reserva **salta sola** al historial y el inventario vuelve a su número normal. **Sin recargar la página y sin que nadie toque nada.**

### El código explicado

**La idea clave:** el estado de la reserva **NO se guarda** en Firestore. Se **calcula** cada vez mirando el reloj. Si se guardara, alguien tendría que cambiarlo justo a las 11:30; calculándolo, siempre está bien.

**1. El molde** — [types/Reserva.ts](../src/types/Reserva.ts):

```ts
export type EstadoReserva = 'programada' | 'en_curso' | 'realizada';
```

**2. El reloj** — [utils/estadoReserva.ts](../src/utils/estadoReserva.ts), `obtenerEstadoReserva`:

```ts
const ahora = obtenerFechaActual();                       // "2026-10-12 10:45"
const inicio = reserva.fecha + ' ' + reserva.horaInicio;  // "2026-10-12 10:00"
const fin = reserva.fecha + ' ' + reserva.horaFin;        // "2026-10-12 11:30"

if (ahora >= fin) {
  return 'realizada';
} else if (ahora >= inicio) {
  return 'en_curso';
} else {
  return 'programada';
}
```

¿Por qué se pueden comparar **textos** con `>=`? Porque van de lo más grande a lo más chico (año → mes → día → hora → minuto). Es como ordenar palabras en el diccionario, letra por letra: `"2026-10-12 10:45" >= "2026-10-12 10:00"` es `true`.

**3. Las unidades que "salen" del laboratorio** — en el mismo archivo:

```ts
export function calcularUnidadesEnReservaAhora(recursoId: number): number {
  let total = 0;
  for (const reserva of obtenerReservas()) {
    if (reserva.recursoId === recursoId && obtenerEstadoReserva(reserva) === 'en_curso') {
      total = total + reserva.cantidad;
    }
  }
  return total;
}
```

Solo cuenta las reservas **en curso**. Cuando una termina, ya no es "en curso", deja de contar, y las unidades "vuelven". **Firestore nunca se toca.**

**4. La tarjeta del inventario** — [components/TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx):

```tsx
const enReservaAhora = calcularUnidadesEnReservaAhora(recurso.id);
let cantidadDisponible = recurso.cantidades.disponible - enReservaAhora;
if (cantidadDisponible < 0) {
  cantidadDisponible = 0;            // nunca números negativos
}
...
Cantidad: {cantidadTotal} ({cantidadDisponible} {textoDisponibles}
{enReservaAhora > 0 && ' · ' + enReservaAhora + ' en reserva ahora'})
```

La ficha hace lo mismo en [TablaUnidadesEstado.tsx](../src/components/TablaUnidadesEstado.tsx), con un aviso amarillo.

**5. Las dos tablas** — [pages/PaginaReservas.tsx](../src/pages/PaginaReservas.tsx) usa **el mismo componente dos veces**, con una prop distinta:

```tsx
<TablaReservas modo="activas"   version={actualizaciones} onReservaModificada={refrescarDatos} />
<TablaReservas modo="historial" version={actualizaciones} />
```

Y [components/TablaReservas.tsx](../src/components/TablaReservas.tsx) se queda solo con las suyas:

```tsx
const reservas: Reserva[] = [];
for (const reserva of obtenerReservasVisibles(usuario)) {
  const realizada = obtenerEstadoReserva(reserva) === 'realizada';
  if ((modo === 'historial' && realizada) || (modo === 'activas' && !realizada)) {
    reservas.push(reserva);
  }
}
```

Además, según el `modo`:
- cambia el **título** (y si eres docente, dice "Mis...");
- la columna **"Acción"** (Cancelar) solo existe en `activas`: una reserva que ya pasó no se cancela;
- el historial se da **vuelta** (`reservas.reverse()`) para ver lo más reciente arriba.

**6. La pastillita de color** — [components/FilaReserva.tsx](../src/components/FilaReserva.tsx):

```tsx
const estado = obtenerEstadoReserva(reserva);
<span className={'etiqueta-reserva etiqueta-reserva-' + estado}>
  {textoEstadoReserva(estado)}
</span>
```

El nombre de la clase se **arma pegando textos**: `'etiqueta-reserva-' + 'en_curso'` = `etiqueta-reserva-en_curso`. Cada una tiene su color en [TablaReservas.css](../src/components/TablaReservas.css).

**7. ¿Cómo se entera la pantalla de que pasó la hora?** React solo recalcula cuando **redibuja**, y si nadie toca nada, no redibuja. Por eso [App.tsx](../src/App.tsx) tiene una **alarma que suena cada minuto**:

```tsx
const [, setMinutosTranscurridos] = useState(0);

useEffect(() => {
  const repeticion = setInterval(() => {
    setMinutosTranscurridos((valorAnterior) => valorAnterior + 1);   // cambia un useState...
  }, 60000);                                                          // ...cada 60.000 ms = 1 minuto
  return () => clearInterval(repeticion);                             // limpieza: apaga la alarma
}, []);
```

Ese número no se muestra en ningún lado: **solo sirve para que App se redibuje**. Al redibujarse, todas las reservas recalculan su estado y saltan de tabla solas.

**8. No se reserva en el pasado** — [utils/disponibilidad.ts](../src/utils/disponibilidad.ts), en `validarCamposReserva`:

```ts
if (fecha < obtenerFechaHoy()) {
  return 'La fecha de la reserva no puede ser anterior a hoy.';
}
```

### Recetas

**3.1 Cambiar cómo se llaman los estados**
[utils/estadoReserva.ts](../src/utils/estadoReserva.ts), función `textoEstadoReserva`:
```ts
  if (estado === 'programada') {
    return 'Agendada';      // antes: 'Programada'
  } else if (estado === 'en_curso') {
    return 'Ahora';         // antes: 'En curso'
  } else {
    return 'Terminada';     // antes: 'Realizada'
  }
```
**No cambies** `'programada'`, `'en_curso'` ni `'realizada'` de la izquierda del `===`: son los valores internos, y el CSS los usa para los colores.

**3.2 Cambiar los colores de las pastillitas**
[TablaReservas.css](../src/components/TablaReservas.css), busca `.etiqueta-reserva-en_curso` (o `-programada`, `-realizada`):
```css
.etiqueta-reserva-en_curso {
  color: #15803d;               /* verde (antes amarillo) */
  background-color: #dcfce7;
}
```

**3.3 Cambiar los títulos de las tablas**
[TablaReservas.tsx](../src/components/TablaReservas.tsx), busca `let titulo =`. Hay 4 títulos: 2 para quien ve todas y 2 para el docente ("Mis...").
```ts
  let titulo = 'Reservas pendientes';   // antes: 'Próximas reservas y en curso'
```
El mensaje cuando la tabla está vacía es `textoSinReservas`, justo abajo.

**3.4 Que el historial muestre lo más antiguo arriba**
En el mismo archivo, borra estas líneas:
```ts
  if (modo === 'historial') {
    reservas.reverse();
  }
```

**3.5 Que la pantalla se actualice más seguido (cada 30 segundos)**
[App.tsx](../src/App.tsx), busca `60000`:
```tsx
    }, 30000);   // antes: 60000 (1 minuto). 30000 = 30 segundos
```
No conviene bajarlo mucho: la app se redibujaría todo el rato sin necesidad.

**3.6 Cambiar el texto "en reserva ahora" de la tarjeta**
[TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx), busca `en reserva ahora`:
```tsx
{enReservaAhora > 0 && ' · ' + enReservaAhora + ' prestados'}
```
El aviso amarillo de la ficha está en [TablaUnidadesEstado.tsx](../src/components/TablaUnidadesEstado.tsx), busca `están en una reserva en curso ahora`.

**3.7 Permitir reservar en fechas pasadas (por ejemplo, para registrar algo atrasado)**
[utils/disponibilidad.ts](../src/utils/disponibilidad.ts), en `validarCamposReserva`, borra el `if (fecha < obtenerFechaHoy()) { ... }`.

**3.8 Que el departamento también pueda cancelar reservas**
[utils/permisos.ts](../src/utils/permisos.ts), en `puedeCancelarReserva`:
```ts
  if (rol === 'encargado' || rol === 'departamento') {
    return true;
  }
```

### Cómo probarlo

1. Como docente, crea una reserva para **hoy** que empiece en 1 minuto y dure 2 (ej: si son las 15:20, de 15:21 a 15:23).
2. En la tabla de arriba dice **Programada** (azul).
3. Espera un minuto: dice **En curso** (amarillo). Ve al inventario: la tarjeta de ese recurso dice *"N en reserva ahora"*, y la ficha muestra el aviso amarillo.
4. Espera dos minutos más: la reserva **salta sola** a "Mi historial de reservas (realizadas)" y la tarjeta vuelve a su número normal. Sin recargar.

### Si te preguntan

| Pregunta | Respuesta |
|---|---|
| ¿Dónde guardan que una reserva está "realizada"? | En ningún lado: se calcula cada vez comparando la fecha y hora de término con el reloj. |
| ¿Cómo pasa sola al historial sin recargar? | Un `setInterval` en App cambia un useState cada minuto. App se redibuja, se recalcula el estado, y la reserva cambia de tabla. |
| ¿Cómo recupera el inventario las unidades? | Las "unidades en reserva ahora" se calculan solo con reservas en curso y se restan de las disponibles. Cuando la reserva termina, deja de contar. Nunca se modifica Firestore. |
| ¿Por qué comparar fechas como texto? | Porque el formato "AAAA-MM-DD HH:MM" va de lo más grande a lo más chico, y el orden alfabético coincide con el orden del tiempo. |
| ¿Por qué el historial no tiene botón Cancelar? | Porque esas reservas ya pasaron. `mostrarAcciones` solo es true en modo "activas". |
| ¿Por qué hacen dos tablas con el mismo componente? | Para no repetir código. La prop `modo` le dice cuáles mostrar y qué título poner. |

---

## Pedido 4 — Elegir la sala de una lista de salas libres

### Qué hace

En el formulario de reserva, la **sala ya no se escribe**: es un menú.

- Antes de elegir fecha y horario, el menú muestra **todas** las salas (para que veas cuáles existen).
- Cuando ya hay fecha, hora de inicio y hora de fin, muestra **solo las libres** en ese horario.
- Al apretar "Confirmar reserva", la sala se revisa **otra vez**.

Una sala está **ocupada** si **otro profesor** la tiene reservada en un horario que **se cruza** con el tuyo. Si eres **tú** quien la tiene, sigue libre para ti: puedes reservar multímetros **y** cables para tu misma clase.

### El código explicado

**1. ¿Se cruzan dos horarios?** — [utils/disponibilidad.ts](../src/utils/disponibilidad.ts), `seCruzanHorarios` (ya existía para HU-07):

```ts
if (fechaA !== fechaB) {
  return false;                              // distinto día → no chocan
}
if (finA <= inicioB || finB <= inicioA) {
  return false;                              // una termina antes de que la otra empiece → no chocan
}
return true;                                 // en cualquier otro caso, se pisan
```

Ejemplo: 10:00–11:00 y 11:00–12:00 **no** chocan (una termina justo cuando la otra empieza). 10:00–11:00 y 10:30–11:30 **sí** chocan.

**2. ¿La sala está libre?** — en el mismo archivo, `salaEstaLibre`:

```ts
export function salaEstaLibre(codigoSala, fecha, horaInicio, horaFin, docente): boolean {
  for (const reserva of obtenerReservas()) {
    // Solo importan las de ESTA sala y de OTRO profesor
    if (reserva.sala === codigoSala && reserva.docente !== docente) {
      const hayChoque = seCruzanHorarios(fecha, horaInicio, horaFin,
                                         reserva.fecha, reserva.horaInicio, reserva.horaFin);
      if (hayChoque) {
        return false;                        // encontramos un choque → ocupada
      }
    }
  }
  return true;                               // ninguna chocó → libre
}
```

**3. La lista de salas libres** — en el mismo archivo, `obtenerSalasLibres`:

```ts
const salasLibres: Sala[] = [];
for (const sala of obtenerSalas()) {                         // todas las salas de Configuración
  if (salaEstaLibre(sala.codigo, fecha, horaInicio, horaFin, docente)) {
    salasLibres.push(sala);                                  // solo metemos las libres
  }
}
return salasLibres;
```

**4. El menú del formulario** — [components/FormularioReserva.tsx](../src/components/FormularioReserva.tsx):

```tsx
const horarioCompleto = fecha !== '' && horaInicio !== '' && horaFin !== '' && horaFin > horaInicio;
let salasParaElegir = obtenerSalas();                       // sin horario: TODAS
if (horarioCompleto) {
  salasParaElegir = obtenerSalasLibres(fecha, horaInicio, horaFin, docente.trim());   // con horario: LIBRES
}
...
<select id="campo-sala" value={sala} onChange={...}>
  <option value="">Elige una sala</option>
  {salasParaElegir.map(function (salaDeLista) {
    return <option key={salaDeLista.codigo} value={salaDeLista.codigo}>{salaDeLista.codigo}</option>;
  })}
</select>
```

Como `salasParaElegir` se calcula **cada vez que el formulario se dibuja**, y el formulario se redibuja con cada cambio de fecha u hora (son `useState`), la lista se actualiza sola mientras escribes.

**5. La doble revisión al guardar** — en `manejarEnvio` del mismo archivo:

```tsx
// 3. ¿La sala sigue libre?
if (!salaEstaLibre(sala, fecha, horaInicio, horaFin, docente.trim())) {
  setMensajeError('La sala ' + sala + ' ya está reservada por otro docente en ese horario. Elige otra.');
  return;
}
```

¿Por qué otra vez? Porque alguien puede **elegir la sala primero** y **después cambiar la hora**. La sala elegida queda en el menú, pero quizás ya no está libre en el horario nuevo.

**6. Las salas vienen de Configuración** (`obtenerSalas()` en [configuracionService.ts](../src/services/configuracionService.ts)). Si el encargado agrega una sala nueva (pedido 5), aparece en este menú sin tocar el código.

### Recetas

**4.1 Que la sala quede ocupada aunque sea el MISMO profesor**
[utils/disponibilidad.ts](../src/utils/disponibilidad.ts), en `salaEstaLibre`, cambia:
```ts
    if (reserva.sala === codigoSala && reserva.docente !== docente) {
```
por:
```ts
    if (reserva.sala === codigoSala) {
```
⚠️ Ojo: así un profesor ya no podría reservar dos materiales distintos para la misma clase.

**4.2 Que el menú muestre SOLO las salas libres (y nada antes del horario)**
[FormularioReserva.tsx](../src/components/FormularioReserva.tsx), cambia `let salasParaElegir = obtenerSalas();` por:
```ts
  let salasParaElegir: Sala[] = [];
```
y agrega arriba `import type { Sala } from '../types/Configuracion';`. Así, hasta que no haya horario, el menú solo dice "Elige una sala".

**4.3 Mostrar "Sala B302" en vez de solo "B302" en el menú**
En el mismo archivo, dentro del `.map` del menú de salas:
```tsx
                  Sala {salaDeLista.codigo}
```

**4.4 Cambiar el mensaje de "sala ocupada"**
En el mismo archivo, busca `ya está reservada por otro docente`, y cambia el texto.

**4.5 Que una reserva que termina a las 11:00 SÍ choque con una que empieza a las 11:00 (dejar tiempo para ordenar)**
[utils/disponibilidad.ts](../src/utils/disponibilidad.ts), en `seCruzanHorarios`, cambia `<=` por `<`:
```ts
  if (finA < inicioB || finB < inicioA) {
```
⚠️ Esta función también la usa el cálculo de unidades disponibles (HU-07), así que afecta a los dos.

### Cómo probarlo

1. Como **encargado**, haz una reserva para mañana de 10:00 a 11:00 en la sala **B307**, a nombre de otro profesor (ej: "Prof. Prueba").
2. Como **docente**, elige el mismo día de 10:30 a 11:30: **B307 no aparece** en el menú.
3. Cambia el horario a 11:00–12:00: **B307 vuelve a aparecer** (no chocan).
4. Elige B307, y **después** vuelve a poner 10:30–11:30 y aprieta "Confirmar": sale el error de sala ocupada.

### Si te preguntan

| Pregunta | Respuesta |
|---|---|
| ¿Cómo saben qué salas están libres? | `salaEstaLibre` revisa todas las reservas: si otro profesor tiene esa sala en un horario que se cruza, está ocupada. `obtenerSalasLibres` deja solo las libres. |
| ¿Cuándo se cruzan dos horarios? | Mismo día, y ninguna termina antes de que empiece la otra. |
| ¿Por qué el mismo profesor puede repetir sala? | Porque puede necesitar varios materiales para su misma clase. |
| ¿Por qué revisan la sala otra vez al guardar? | Porque se pudo elegir la sala y después cambiar el horario. |
| ¿De dónde salen las salas? | De la colección `salas` de Firestore, que el encargado amplía en Configuración. |

---

## Pedido 5 — Agregar torres y salas (escalabilidad)

### Qué hace

En **Configuración** hay dos tarjetas más:

- **Torres:** lista las torres con cuántas salas tiene cada una (*"Torre B · 3 salas"*, *"Torre E · 1 sala"*) y deja agregar una nueva escribiendo **una letra**.
- **Salas:** lista todas las salas (B302, B307...) y deja agregar una eligiendo la **torre** y escribiendo el **número**.

Las torres y salas nuevas aparecen solas en:

- "+ Agregar recurso" → Ubicación: los menús "Torre" y "Sala". Al elegir una torre, solo se ven sus salas.
- Reservas → el menú "Sala" (pedido 4).

**Escalabilidad** significa que la app **crece sin reprogramarla**: si mañana construyen la torre E, el encargado la agrega con un botón.

### El código explicado

Funciona **igual que las categorías** (pedido 2): moldes en [types/Configuracion.ts](../src/types/Configuracion.ts), semillas en [data/configuracion.ts](../src/data/configuracion.ts), bodeguero en [configuracionService.ts](../src/services/configuracionService.ts) y revisores en [utils/configuracion.ts](../src/utils/configuracion.ts).

**1. Los moldes:**

```ts
export interface Torre {
  letra: string;     // 'B'
}
export interface Sala {
  codigo: string;    // 'B307'  ← torre + número pegados
  torre: string;     // 'B'
  numero: string;    // '307'
}
```

Se guardan las 3 cosas de la sala para no tener que estar cortando el código.

**2. El revisor de torres** — `validarNuevaTorre`:

```ts
const letraLimpia = letra.trim().toUpperCase();          // "e" → "E"
if (letraLimpia.length !== 1 || letraLimpia < 'A' || letraLimpia > 'Z') {
  return 'La torre debe ser una sola letra, ej: "D".';    // "EE", "7", "#" → error
}
for (const torre of existentes) {
  if (torre.letra === letraLimpia) {
    return 'La torre ' + letraLimpia + ' ya existe.';
  }
}
return '';
```

Además, la cajita tiene `maxLength={1}` en [SeccionTorres.tsx](../src/components/SeccionTorres.tsx): no deja escribir más de una letra.

**3. El revisor de salas** — `validarNuevaSala`:

```ts
if (torre === '') {
  return 'Elige la torre de la sala.';
}
const numeroLimpio = numero.trim();
if (numeroLimpio === '' || !Number.isInteger(Number(numeroLimpio)) || numeroLimpio.includes('.')) {
  return 'El número de sala debe ser un número, ej: "305".';    // "", "abc", "3.5" → error
}
const codigo = torre + numeroLimpio;                               // "E" + "101" = "E101"
for (const sala of existentes) {
  if (sala.codigo === codigo) {
    return 'La sala ' + codigo + ' ya existe.';
  }
}
return '';
```

**4. "1 sala" o "3 salas"** — en [SeccionTorres.tsx](../src/components/SeccionTorres.tsx):

```tsx
const cantidadSalas = obtenerSalasDeTorre(torre.letra).length;
let textoSalas = cantidadSalas + ' salas';
if (cantidadSalas === 1) {
  textoSalas = '1 sala';                     // cuidamos la gramática
}
```

**5. La página redibuja las 3 tarjetas** — [PaginaConfiguracion.tsx](../src/pages/PaginaConfiguracion.tsx):

```tsx
const [cambios, setCambios] = useState(0);
function registrarCambio() {
  setCambios(cambios + 1);
}
<SeccionCategorias onAgregado={registrarCambio} />
<SeccionTorres onAgregado={registrarCambio} />
<SeccionSalas onAgregado={registrarCambio} />
```

Las listas viven en el servicio (no en un useState), así que React no se entera solo. Cuando una tarjeta agrega algo, avisa con `onAgregado`, la página cambia `cambios` y **redibuja las 3**. Por eso una torre recién agregada aparece al tiro en el menú de torres de la tarjeta de salas, y la sala nueva actualiza el *"· 1 sala"* de su torre.

**6. Ubicación del recurso con menús** — [components/CamposUbicacionRecurso.tsx](../src/components/CamposUbicacionRecurso.tsx):

```tsx
const salasDeLaTorre = obtenerSalasDeTorre(datos.torre);   // solo las salas de la torre elegida

<select value={datos.torre}
        onChange={(evento) => props.onCambiar({ ...datos, torre: evento.target.value, sala: '' })}>
  {obtenerTorres().map((torre) => <option ...>Torre {torre.letra}</option>)}
</select>
```

Al **cambiar de torre se borra la sala** (`sala: ''`), porque las salas de la torre anterior ya no sirven. Si la torre no tiene salas, aparece *"Esta torre no tiene salas. Agrégalas en "Configuración"."*

**7. Solo el encargado** — [utils/permisos.ts](../src/utils/permisos.ts), `puedeVerPagina`: `configuracion` es solo para `encargado`. El menú esconde el enlace y la ruta protegida de [App.tsx](../src/App.tsx) (`paginaSiPuede`) devuelve al inventario a cualquiera que escriba `/configuracion` a mano.

### Recetas

**5.1 Agregar una torre o sala (sin programar)**
Encargado → **Configuración** → tarjeta "Torres" (escribe la letra) o "Salas" (elige la torre y escribe el número) → **"+ Agregar"**. Primero la torre, después sus salas.

**5.2 Cambiar las torres y salas "de fábrica"**
[data/configuracion.ts](../src/data/configuracion.ts), en `listaTorresPrueba` y `listaSalasPrueba`. Igual que con las categorías, ⚠️ solo se suben si la colección está **vacía**.
```ts
export const listaSalasPrueba: Sala[] = [
  ...
  { codigo: 'C215', torre: 'C', numero: '215' },
];
```

**5.3 Cambiar los mensajes de error**
[utils/configuracion.ts](../src/utils/configuracion.ts), en `validarNuevaTorre` y `validarNuevaSala`: cambia los textos de los `return`.

**5.4 Que el número de sala tenga que ser de 3 dígitos**
En `validarNuevaSala`, después del `if` del número, agrega:
```ts
  if (numeroLimpio.length !== 3) {
    return 'El número de sala debe tener 3 dígitos, ej: "305".';
  }
```

**5.5 Que también el departamento pueda entrar a Configuración**
[utils/permisos.ts](../src/utils/permisos.ts), en `puedeVerPagina`, dentro del `if (pagina === 'configuracion')`:
```ts
    if (rol === 'encargado' || rol === 'departamento') {
```
El enlace del menú y la ruta protegida usan la misma función, así que los dos cambian solos.

**5.6 Cambiar el título o la frase de la página Configuración**
[PaginaConfiguracion.tsx](../src/pages/PaginaConfiguracion.tsx), dentro del `<header>`: el `<h2>` y el `<p>`.

**5.7 Que las tarjetas de Configuración se vean una al lado de la otra en el computador**
[PaginaConfiguracion.css](../src/pages/PaginaConfiguracion.css), en `.configuracion-secciones`:
```css
.configuracion-secciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));   /* tantas columnas como quepan */
  gap: var(--espacio-lg);
}
```
En el celular igual quedan una debajo de otra, porque solo cabe una columna.

### Cómo probarlo

1. Encargado → Configuración → agrega la torre **"e"**: se guarda como **"E"** y dice *"Torre E · 0 salas"*.
2. Agrega la sala **E101**: la torre E ahora dice *"Torre E · 1 sala"*.
3. "+ Agregar recurso" → Torre E → Sala: aparece **101**. Torre B → ya no aparece.
4. Reservas → menú Sala: aparece **E101**.
5. Prueba errores: torre "EE" o "7", sala "abc", y repetir E101.
6. Como docente, escribe `localhost:5173/configuracion`: te devuelve al inventario.

> ⚠️ Igual que con las categorías: lo que agregues **queda guardado**. Si fue una prueba, bórralo en la consola de Firebase.

### Si te preguntan

| Pregunta | Respuesta |
|---|---|
| ¿Qué es la escalabilidad aquí? | Que se pueden agregar torres y salas con un botón, sin cambiar el código. Antes estaban escritas en el código. |
| ¿Dónde se guardan? | En las colecciones `torres` y `salas` de Firestore. Cada documento se llama como la letra o el código. |
| ¿Cómo se arma el código de la sala? | Torre + número pegados: "E" + "101" = "E101". |
| ¿Por qué al cambiar de torre se borra la sala? | Porque las salas de la torre anterior ya no corresponden. |
| ¿Cómo evitan que un docente entre a Configuración? | `puedeVerPagina` dice que es solo del encargado: el menú esconde el enlace y la ruta protegida lo devuelve al inventario. |
| ¿Por qué no se pueden borrar? | Porque recursos y reservas las usan. Las reglas de Firestore solo permiten leer y crear. |

---

## Chuleta: qué cambiar y dónde

| Quiero cambiar... | Archivo | Busca (Ctrl+F) |
|---|---|---|
| Cuántos recursos por página | [utils/paginacion.ts](../src/utils/paginacion.ts) | `RECURSOS_POR_PAGINA` |
| Texto de los botones de página | [Paginacion.tsx](../src/components/Paginacion.tsx) | `← Anterior` / `Siguiente →` |
| Color del botón de la página actual | [Paginacion.css](../src/components/Paginacion.css) | `.paginacion-actual` |
| Que al filtrar no vuelva a la página 1 | [useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts) | `setPaginaActual(1)` |
| Nombre de una categoría existente | Consola de Firebase → Firestore → `categorias` | campo `nombre` |
| Categorías, torres y salas de fábrica | [data/configuracion.ts](../src/data/configuracion.ts) | `listaCategoriasPrueba` |
| Mensajes de error de Configuración | [utils/configuracion.ts](../src/utils/configuracion.ts) | `return '` |
| Orden de categorías, torres y salas | [configuracionService.ts](../src/services/configuracionService.ts) | `ordenarListas` |
| Quién ve Configuración | [utils/permisos.ts](../src/utils/permisos.ts) | `'configuracion'` |
| Texto de los estados de reserva | [utils/estadoReserva.ts](../src/utils/estadoReserva.ts) | `textoEstadoReserva` |
| Color de las pastillas de estado | [TablaReservas.css](../src/components/TablaReservas.css) | `.etiqueta-reserva-` |
| Títulos de las tablas de reservas | [TablaReservas.tsx](../src/components/TablaReservas.tsx) | `let titulo =` |
| Orden del historial | [TablaReservas.tsx](../src/components/TablaReservas.tsx) | `reservas.reverse()` |
| Cada cuánto se actualizan las reservas | [App.tsx](../src/App.tsx) | `60000` |
| Texto "en reserva ahora" | [TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx) | `en reserva ahora` |
| Aviso amarillo de la ficha | [TablaUnidadesEstado.tsx](../src/components/TablaUnidadesEstado.tsx) | `reserva en curso ahora` |
| Reservar en fechas pasadas | [utils/disponibilidad.ts](../src/utils/disponibilidad.ts) | `obtenerFechaHoy()` |
| Cuándo una sala está ocupada | [utils/disponibilidad.ts](../src/utils/disponibilidad.ts) | `salaEstaLibre` |
| Cuándo chocan dos horarios | [utils/disponibilidad.ts](../src/utils/disponibilidad.ts) | `seCruzanHorarios` |
| Mensaje de "sala ocupada" | [FormularioReserva.tsx](../src/components/FormularioReserva.tsx) | `ya está reservada` |
| Texto "Elige una sala" | [FormularioReserva.tsx](../src/components/FormularioReserva.tsx) y [CamposUbicacionRecurso.tsx](../src/components/CamposUbicacionRecurso.tsx) | `Elige una sala` |

### La idea que une todo (para cerrar la explicación)

Los 5 pedidos usan las mismas tres ideas:

1. **Calcular en vez de guardar.** El estado de una reserva, las unidades "en reserva ahora", las salas libres y las páginas no se guardan: se calculan cada vez que la pantalla se dibuja. Así nunca quedan desactualizados.
2. **Datos en vez de código.** Las categorías, torres y salas pasaron de estar escritas en el código a estar en Firestore. Todos los componentes le piden la lista al mismo servicio, y por eso lo nuevo aparece en todos lados solo.
3. **Primero Firestore, después la memoria.** Al agregar algo, primero se guarda en la nube y solo si funcionó se cambia la copia en memoria. Las reglas de Firestore protegen lo que no se debe borrar.
