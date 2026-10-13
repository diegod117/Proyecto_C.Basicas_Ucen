# Guía de estudio — Sistema de Inventario C. Básicas

Esta guía explica **paso a paso** cómo funciona la app, desde cero.
Está pensada para alguien que recién empieza con TypeScript, React y CSS.
Cubre **todo** lo que está en `main` para la segunda presentación: React Router, useContext, los hooks propios, la paginación, las reservas que pasan solas al historial y la página Configuración.

**Cómo usarla:**

1. Lee los pasos **en orden**: cada uno usa lo que aprendiste en el anterior.
2. Cuando un paso diga "abre tal archivo", ábrelo en VS Code y lee sus comentarios. En esta rama (`estudio-johann`) **todos** los archivos tienen comentarios explicados con palabras simples. El código es **idéntico** al de `main`: solo cambian los comentarios.
3. Prueba cada cosa en el navegador. Cambiar algo y ver qué pasa es la mejor forma de aprender.
4. Al final de cada paso hay preguntas para revisar si entendiste.
5. ¿Poco tiempo? Lee primero el **[paso 14](#paso-14--la-rúbrica-la-demo-y-las-preguntas)**: dice dónde está cada cosa que pide la rúbrica y qué te pueden preguntar.
6. ¿Quieres estudiar **solo los 5 pedidos del profesor**, con más código y recetas para cambiarlos? Lee **[guia-pedidos-profesor.md](guia-pedidos-profesor.md)**.

| Paso | Tema |
|---|---|
| [0](#paso-0--prender-la-app) | Prender la app |
| [1](#paso-1--el-mapa-de-la-app) | El mapa de la app (carpetas y quién llama a quién) |
| [2](#paso-2--typescript-los-moldes-de-los-datos) | TypeScript: los moldes de los datos |
| [3](#paso-3--react-componentes-jsx-y-props) | React: componentes, JSX y props |
| [4](#paso-4--usestate-la-memoria-de-un-componente) | useState: la memoria de un componente |
| [5](#paso-5--useeffect-y-asyncawait-hacer-cosas-que-se-demoran) | useEffect y async/await (y el reloj de las reservas) |
| [6](#paso-6--usecontext-el-parlante-de-la-app) | **useContext: el parlante de la app** |
| [7](#paso-7--css-cómo-se-ve-todo) | CSS: cómo se ve todo |
| [8](#paso-8--los-datos-firebase-servicios-y-alertas) | Los datos: Firebase, servicios y alertas |
| [9](#paso-9--recetas-cómo-cambiar-cosas) | **Recetas: cómo cambiar cosas** (tu nombre, el rol, la ficha...) |
| [10](#paso-10--react-router-cada-página-tiene-su-dirección) | **React Router: cada página tiene su dirección** |
| [11](#paso-11--hooks-propios-y-paginación) | **Hooks propios y paginación** |
| [12](#paso-12--reservas-que-pasan-solas-al-historial-y-salas-libres) | **Reservas que pasan solas al historial, y salas libres** |
| [13](#paso-13--configuración-categorías-torres-y-salas) | **Configuración: categorías, torres y salas** |
| [14](#paso-14--la-rúbrica-la-demo-y-las-preguntas) | **La rúbrica, la demo y las preguntas** |
| [Glosario](#glosario) | Palabras raras explicadas |

---

## Paso 0 — Prender la app

En la terminal de VS Code, dentro de la carpeta del proyecto:

```bash
npm install     # descarga las librerías (React, Firebase, React Router...)
npm run dev     # prende la app en modo desarrollo
```

> ⚠️ **Si ya tenías el proyecto, igual corre `npm install`.** Desde que agregamos React Router hay una librería nueva (`react-router-dom`). Sin `npm install`, la app no prende y sale el error *"Failed to resolve import react-router-dom"*.

Abre **http://localhost:5173** en el navegador. Las cuentas de prueba son `encargado@prueba.cl`, `docente@prueba.cl` y `departamento@prueba.cl`. Las contraseñas las tiene el grupo; no se escriben aquí porque este archivo se sube a GitHub.

Tres cosas que vas a usar todo el tiempo:

- **Cambios en vivo:** con `npm run dev` corriendo, cada vez que guardas un archivo, el navegador se actualiza solo. Si cambias un archivo de `services/`, recarga con **F5**, porque los datos en memoria se borran.
- **La consola del navegador:** se abre con **F12 → Console**. Ahí aparecen los errores y los `console.log`.
- **Revisar antes de entregar:** `npm run build` (revisa que TypeScript no tenga errores) y `npm run lint` (revisa el estilo del código).

---

## Paso 1 — El mapa de la app

### Las carpetas, como un restaurante

| Carpeta | Qué hay | En el restaurante sería... |
|---|---|---|
| `src/types/` | Los **moldes** de los datos (cómo es un Recurso, una Reserva, una Sala...) | Las recetas escritas: dicen qué ingredientes lleva cada plato |
| `src/data/` | Datos de prueba ("semillas") para la primera vez | Los ingredientes de muestra para la primera vez |
| `src/services/` | Los que **guardan y entregan** los datos (hablan con Firebase) | Los bodegueros |
| `src/utils/` | **Herramientas** pequeñas (filtrar, validar, calcular) | Los cuchillos y las ollas |
| `src/components/` | **Piezas** de pantalla (una tarjeta, un formulario, una tabla) | Los platos, los vasos, los cubiertos |
| `src/pages/` | **Pantallas completas** (Inventario, Reservas, Configuración...) | Las mesas ya armadas |
| `src/context/` | **Nuevo:** el "parlante" que anuncia quién está conectado (paso 6) | El altavoz del local |
| `src/hooks/` | **Nuevo:** nuestros hooks propios (paso 11) | Un estuche con herramientas ya armadas |
| `src/styles/` | Los estilos de toda la app (colores, letra) | La decoración del local |
| `src/App.tsx` | El componente principal, con el **mapa de direcciones** | El jefe de cocina |
| `src/main.tsx` | La puerta de entrada | La puerta del restaurante |

Una regla importante: **las páginas usan componentes, pero los componentes nunca importan páginas.** El papá conoce al hijo, pero el hijo no conoce al papá.

### Quién llama a quién

```
index.html                       una hoja en blanco con un <div id="root">
  └─ main.tsx                    "React, dibuja App aquí adentro"
       └─ BrowserRouter          conecta la app con la dirección del navegador (paso 10)
            └─ App.tsx           ¿hay alguien conectado?
                 ├─ /login → PaginaLogin          (si NO hay nadie)
                 └─ ContextoUsuario.Provider      (si SÍ hay alguien) el parlante (paso 6)
                      └─ CargadorDatos            espera los datos de Firebase
                           ├─ MenuNavegacion      la barra azul + el menú gris (NavLink)
                           └─ <Routes>: según la dirección, UNA página:
                                ├─ /inventario/*  → PaginaInventario
                                │    ├─ (listado) EncabezadoInventario, FiltrosInventario,
                                │    │            ContadorInventario, GrillaRecursos → TarjetaRecurso,
                                │    │            Paginacion
                                │    ├─ /inventario/3     → FichaSegunRuta → FichaRecurso
                                │    │      ├─ TablaUnidadesEstado, AvisoUbicacion, TablaHistorial
                                │    │      └─ FormularioCambioEstado, FormularioReponerStock
                                │    └─ /inventario/nuevo → FormularioNuevoRecurso
                                │           └─ CamposUbicacionRecurso, CamposDetalleRecurso
                                ├─ /reservas      → PaginaReservas
                                │    └─ FormularioReserva, TablaReservas ×2 → FilaReserva
                                ├─ /incidencias   → PaginaIncidencias → FormularioIncidencia, TablaIncidencias
                                ├─ /alertas       → PaginaAlertas → TarjetaAlerta
                                └─ /configuracion → PaginaConfiguracion
                                     └─ SeccionCategorias, SeccionTorres, SeccionSalas
```

**Para leer ahora:** [main.tsx](../src/main.tsx) y [App.tsx](../src/App.tsx). No te preocupes si no entiendes todo: en los próximos pasos vas a volver a ellos.

**Preguntas:**
- Si quisieras cambiar algo de cómo se ve UNA tarjeta del inventario, ¿en qué carpeta buscarías? *(En `components/`, en `TarjetaRecurso.tsx` y `TarjetaRecurso.css`.)*
- ¿Qué página se ve en la dirección `/configuracion`? *(PaginaConfiguracion, y solo si eres el encargado.)*

---

## Paso 2 — TypeScript: los moldes de los datos

**TypeScript es JavaScript con "etiquetas"** que dicen de qué tipo es cada cosa. Esas etiquetas no cambian lo que hace el programa: solo sirven para que VS Code te avise con una **raya roja** si te equivocas, **antes** de abrir la app. Es como un corrector ortográfico, pero para datos.

### 2.1 Variables: cajas con nombre

```ts
const nombre = 'Pedro';   // const: una caja que NO se reemplaza por otra
let cantidad = 3;         // let: una caja que SÍ puede cambiar
cantidad = 4;             // ✔ se puede, porque es let
```

### 2.2 Los tipos básicos

| Tipo | Qué guarda | Ejemplo |
|---|---|---|
| `string` | texto | `'Multímetro'` |
| `number` | número | `12` |
| `boolean` | sí o no | `true` / `false` |
| `Recurso[]` | una **lista** de recursos | `[recurso1, recurso2]` |
| `null` / `undefined` | "nada" | — |

### 2.3 `type`: ponerle nombre a un tipo (y el "tipo unión")

Abre [types/Recurso.ts](../src/types/Recurso.ts):

```ts
export type EstadoRecurso = 'disponible' | 'en_uso' | 'danado' | 'en_mantencion' | 'dado_de_baja';
```

La rayita `|` se lee **"o"**. Un `EstadoRecurso` puede ser `'disponible'` **o** `'en_uso'` **o**... y **nada más**. Si alguien escribe `'dañado'` con ñ, TypeScript lo marca en rojo.

Otros tipos unión de la app:

```ts
export type EstadoReserva = 'programada' | 'en_curso' | 'realizada';   // types/Reserva.ts
export type Pagina = 'inventario' | 'reservas' | 'incidencias' | 'alertas' | 'configuracion';
```

> **¿Y la categoría?** Antes era `'instrumento' | 'insumo' | ...` (6 opciones fijas). Ahora el encargado puede **inventar categorías nuevas** en la página Configuración, y TypeScript no puede adivinar qué nombres va a inventar. Por eso ahora es `type CategoriaRecurso = string`. Lo mismo pasó con la torre: antes `'B' | 'C'`, ahora `string`. Ver el paso 13.

### 2.4 `interface`: la lista de datos que un objeto tiene que tener

```ts
export interface Sala {      // types/Configuracion.ts
  codigo: string;   // 'B307'
  torre: string;    // 'B'
  numero: string;   // '307'
}
```

Es como la ficha de un alumno: si falta un dato, la ficha está incompleta y TypeScript reclama.

- **El `?` significa opcional:** `marca?: string` quiere decir que la marca puede no venir.
- **Objeto dentro de objeto:** `ubicacion: Ubicacion` es una caja dentro de otra caja.

### 2.5 Funciones con tipos

```ts
//                       recibe una reserva ─┐        ┌─ devuelve un estado
function obtenerEstadoReserva(reserva: Reserva): EstadoReserva { ... }
```

`: void` significa que la función no devuelve nada. `Categoria | undefined` significa que devuelve una Categoria o nada.

### 2.6 Importar y exportar

- `export` = "dejo que otros archivos usen esto".
- `import { algo } from './archivo'` = "traigo `algo` de otro archivo". Las llaves `{ }` se usan para las cosas exportadas con nombre.
- `export default App` + `import App from './App'` = la cosa principal del archivo, que se importa sin llaves.
- `import type { ... }` = trae solo un molde, no código.
- `'./'` es "esta carpeta" y `'../'` es "la carpeta de arriba".

### 2.7 Pequeños trucos que vas a ver mucho

| Escrito así | Se lee | Dónde verlo |
|---|---|---|
| `a && b` | "a **y** b" | [alertas.ts](../src/utils/alertas.ts) |
| `a \|\| b` | "a **o** b" | [permisos.ts](../src/utils/permisos.ts) |
| `!algo` | "**no** algo" | [cambioEstado.ts](../src/utils/cambioEstado.ts) |
| `x === y` | "¿son exactamente iguales?" | en todas partes |
| `cond ? a : b` | "si cond, entonces a; si no, b" (ternario) | [FormularioReserva.tsx](../src/components/FormularioReserva.tsx) |
| `` `Hola ${nombre}` `` | texto con variables adentro | [TablaReservas.tsx](../src/components/TablaReservas.tsx) |
| `{ ...objeto, campo: 1 }` | "copia el objeto y cambia un campo" | [CamposUbicacionRecurso.tsx](../src/components/CamposUbicacionRecurso.tsx) |
| `algo as Sala` | "confía en mí: esto es una Sala" | [configuracionService.ts](../src/services/configuracionService.ts) |
| `Omit<Reserva, 'id'>` | "una Reserva, pero sin el dato id" | [reservasService.ts](../src/services/reservasService.ts) |
| `"2026-10-11" < "2026-10-12"` | comparar fechas como texto (funciona porque van año-mes-día) | [estadoReserva.ts](../src/utils/estadoReserva.ts) |

**Para leer ahora:** todos los archivos de [src/types/](../src/types/) (son cortos) y [utils/inventario.ts](../src/utils/inventario.ts).

**Preguntas:**
- ¿Qué pasa si en `data/recursos.ts` escribes `estado: 'roto'`? *(TypeScript lo marca en rojo, porque `'roto'` no está en `EstadoRecurso`.)*
- ¿Por qué `CategoriaRecurso` ahora es `string` y no una lista fija? *(Porque el encargado puede crear categorías nuevas desde la app, y TypeScript no puede saber sus nombres de antemano.)*

---

## Paso 3 — React: componentes, JSX y props

### 3.1 Un componente es una función que devuelve un pedazo de pantalla

```tsx
function ContadorInventario(props: PropsContadorInventario) {
  return (
    <div className="inventario-contador">
      <p>Mostrando {props.cantidadMostrada} de {props.cantidadTotal} recursos</p>
    </div>
  );
}
```

- Su nombre empieza con **mayúscula**.
- Lo que devuelve se llama **JSX**: parece HTML, pero vive dentro de TypeScript.
- Diferencias con HTML: se escribe `className` en vez de `class`, y `htmlFor` en vez de `for`.
- Lo que va entre **llaves `{ }`** es código: `{props.cantidadMostrada}` escribe el número ahí.
- Un componente se usa como si fuera una etiqueta: `<ContadorInventario cantidadMostrada={3} ... />`.

### 3.2 Props: lo que el papá le pasa al hijo

Las **props** son los datos que un componente **recibe de su papá**. Es como cuando tu mamá te manda al almacén con una lista: tú no decides qué comprar, usas la lista. La `interface Props...` es esa lista, y **así se "tipan" las props** (la rúbrica lo pide).

Ejemplo en [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx) y [Paginacion.tsx](../src/components/Paginacion.tsx):

```tsx
// La lista de lo que recibe Paginacion (props tipadas):
interface PropsPaginacion {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;   // una FUNCIÓN
}

// PaginaInventario (el papá) se las pasa:
<Paginacion
  paginaActual={filtros.paginaActual}          // un DATO
  totalPaginas={filtros.totalPaginas}          // otro DATO
  onCambiarPagina={filtros.cambiarPagina}      // una FUNCIÓN para que el hijo avise
/>

// Y Paginacion lo usa así:
<button onClick={() => props.onCambiarPagina(numero)}>{numero}</button>
```

### 3.3 El patrón más importante de React

> **Los datos BAJAN por props. Los avisos SUBEN llamando a funciones.**

```
      PaginaInventario  (guarda en qué página estamos)
             │  ▲
 baja:       │  │  sube: "¡apretaron el 2!"
 paginaActual│  │  props.onCambiarPagina(2)
             ▼  │
         Paginacion
```

`Paginacion` no cambia la página ella sola: avisa, y el papá decide. Lo vas a ver en **toda** la app: `FiltrosInventario`, `TarjetaRecurso`, `FilaReserva`, las secciones de Configuración y los formularios.

> **¿Y el usuario conectado?** Antes también bajaba por props, de mano en mano. Ahora viaja por un "parlante" (useContext). Eso se explica en el paso 6.

### 3.4 Dibujar algo solo a veces

```tsx
{mostrarBotonAgregar && <button>+ Agregar recurso</button>}   // solo si es true
{lista.length === 0 ? <p>Vacío</p> : <Tabla />}               // uno u otro
if (props.totalPaginas <= 1) { return null; }                 // null = no dibujes nada
```

### 3.5 Dibujar listas: `.map()` y `key`

```tsx
{props.recursos.map((recurso) => (
  <TarjetaRecurso key={recurso.id} recurso={recurso} />
))}
```

`.map()` es una fábrica: entran 9 recursos y salen 9 tarjetas. La **`key`** es el "número de lista" de cada elemento, para que React sepa cuál es cuál cuando algo cambia. Ver [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx).

### 3.6 Otras dos cosas

- **Fragment `<> ... </>`:** una caja invisible para devolver dos cosas juntas. Ver [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx).
- **`children`:** lo que se escribe entre la etiqueta que abre y la que cierra, como `<CargadorDatos> ...esto... </CargadorDatos>`. Ver [CargadorDatos.tsx](../src/components/CargadorDatos.tsx).

**Para leer ahora:** [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), [TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx), [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx), [Paginacion.tsx](../src/components/Paginacion.tsx) y [FilaReserva.tsx](../src/components/FilaReserva.tsx).

**Preguntas:**
- ¿Por qué en `onClick` se escribe `() => props.onCambiarPagina(numero)` y no `props.onCambiarPagina(numero)`? *(Sin la flecha, la función se ejecutaría apenas se dibuja el botón, sin hacer clic.)*
- ¿Por qué `FilaReserva` recibe `onCancelar` en vez de cancelar ella misma? *(Porque la tabla es la que sabe redibujarse y avisar a la página. La fila solo avisa: "los datos bajan, los avisos suben".)*

---

## Paso 4 — useState: la memoria de un componente

### 4.1 La pizarra mágica

Un componente es una función: cada vez que se ejecuta, empieza de cero y se olvida de todo. **`useState` le da memoria.**

```tsx
const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
//      └ lo que hay ahora  └ la única forma de cambiarlo           └ el valor inicial
```

Imagina una **pizarra mágica**. Cuando escribes algo nuevo con `setUsuarioActual(...)`, React **vuelve a dibujar** el componente con el valor nuevo. Todos los que miran la pizarra ven el cambio al tiro.

**Reglas de oro:**

1. **Nunca** cambies la pizarra directo (`usuarioActual = algo`): React no se entera. Siempre usa la función `set...`.
2. Si guardas un **objeto**, entrega uno **nuevo**: `setDatos({ ...datos, nombre: 'x' })`. Si cambias el mismo objeto, React no ve la diferencia.

### 4.2 Formularios controlados

Cada cajita guarda lo que escribes en un `useState`, letra por letra:

```tsx
const [correo, setCorreo] = useState('');

<input
  value={correo}                                       // muestra lo que hay en la memoria
  onChange={(evento) => setCorreo(evento.target.value)} // cada letra nueva se guarda
/>
```

### 4.3 Los eventos

| Evento | Cuándo pasa |
|---|---|
| `onClick` | al hacer clic |
| `onChange` | al escribir o elegir algo |
| `onSubmit` | al enviar un formulario (botón `type="submit"` o Enter) |

Dentro de `onSubmit` siempre está `evento.preventDefault()`: sin eso, el navegador **recargaría la página**.

### 4.4 La receta de todos los formularios

Abre [FormularioCambioEstado.tsx](../src/components/FormularioCambioEstado.tsx) o [SeccionCategorias.tsx](../src/components/SeccionCategorias.tsx). Todos los formularios siguen los mismos pasos:

1. `preventDefault()`.
2. **Revisar** con una herramienta de `utils/` que devuelve `''` si todo está bien.
3. Si hay error, mostrarlo y cortar con `return`.
4. `setGuardando(true)`, para apagar el botón.
5. **Guardar** con `await` al servicio.
6. Mostrar el mensaje verde o rojo, y avisar hacia arriba con `props.on...()`.

### 4.5 El truco de la `key` para "reiniciar" un componente

Si a un componente le cambias la `key`, React lo **tira a la basura y crea uno nuevo** desde cero (como cambiarle el número de camiseta a un jugador). Se usa en:

- [App.tsx](../src/App.tsx): `<CargadorDatos key={usuarioActual.correo}>`. Si entra otra persona, se vuelven a descargar los datos.
- [PaginaIncidencias.tsx](../src/pages/PaginaIncidencias.tsx): `key={contador}`, para que la tabla muestre la incidencia nueva.

> Antes también se usaba para que el botón "Inventario" del menú volviera al listado. Ya no hace falta: ahora el menú cambia la **dirección** a `/inventario` y React Router muestra el listado (paso 10).

**Para leer ahora:** [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx), [FormularioCambioEstado.tsx](../src/components/FormularioCambioEstado.tsx) y [FormularioNuevoRecurso.tsx](../src/components/FormularioNuevoRecurso.tsx) (que usa un useState con un objeto).

**Preguntas:**
- ¿Dónde se guardan los filtros del inventario: en `FiltrosInventario` o en otro lado? *(En el hook `useFiltrosInventario`, que usa `PaginaInventario`. `FiltrosInventario` no tiene memoria: solo muestra y avisa.)*
- ¿Por qué el campo "Stock mínimo" aparece solo cuando eliges "Insumo"? *(Al elegir, cambia el useState `datos`, React redibuja, y `usaStockMinimo(datos)` ahora da `true` porque esa categoría tiene `usaStockMinimo: true`.)*

---

## Paso 5 — useEffect y async/await: hacer cosas que se demoran

### 5.1 async / await: la pizza

Ir a internet (a Firebase) **se demora**. Una función que se demora se marca con **`async`** y devuelve una **Promise** (promesa).

> Es como pedir una pizza: te dan un número de pedido (la promesa) y la pizza (el resultado) llega después. **`await`** significa "espera aquí hasta que llegue la pizza".

```ts
async function iniciarSesion(correo: string, contrasena: string): Promise<string> {
  await signInWithEmailAndPassword(autenticacion, correo, contrasena); // espera a Firebase
  ...
}
```

### 5.2 try / catch / finally

```ts
try {
  await guardar();          // intenta esto
} catch (error) {
  mostrarError();           // si algo explota (ej: sin internet), haz esto
} finally {
  setGuardando(false);      // esto se ejecuta SIEMPRE, salga bien o mal
}
```

### 5.3 useEffect: "haz esto después de dibujar"

```tsx
useEffect(() => {
  const dejarDeEscuchar = escucharSesion((usuario) => { ... }); // instala el "timbre"
  return dejarDeEscuchar;                                        // al desaparecer, lo desinstala
}, []);   // ← CUÁNDO repetirlo
```

La lista del final dice **cuándo** se repite:

| Lista | Se ejecuta |
|---|---|
| `[]` vacía | **una sola vez**, al aparecer el componente |
| `[intentos]` | al aparecer, y **cada vez que `intentos` cambie** |

Lo que **devuelve** el useEffect es la "limpieza": se ejecuta cuando el componente desaparece.

**Regla:** la función de `useEffect` no puede ser `async`. El truco es crear una función async adentro y llamarla, como en [CargadorDatos.tsx](../src/components/CargadorDatos.tsx).

### 5.4 El reloj de las reservas: `setInterval`

App tiene un **segundo** useEffect, nuevo:

```tsx
const [, setMinutosTranscurridos] = useState(0);

useEffect(() => {
  const repeticion = setInterval(() => {
    setMinutosTranscurridos((valorAnterior) => valorAnterior + 1);   // cada minuto, +1
  }, 60000);                                                          // 60000 ms = 1 minuto
  return () => clearInterval(repeticion);                             // limpieza: apaga la alarma
}, []);
```

- `setInterval(funcion, 60000)` es una **alarma que suena cada minuto**.
- Cada vez que suena, suma 1 a un useState. Ese número **no se muestra en ningún lado**: solo sirve para que App se **redibuje**.
- Al redibujarse, se recalcula el estado de cada reserva mirando la hora. Así una reserva pasa sola de "En curso" a "Realizada" **sin recargar la página** (paso 12).
- `clearInterval` es la limpieza: si App desaparece, apagamos la alarma para que no quede sonando para siempre.

### 5.5 Un detalle: por qué la carga no se hace dos veces

Mientras programas (`npm run dev`), React ejecuta los useEffect **dos veces seguidas** a propósito, para pillar errores (es el `StrictMode` de [main.tsx](../src/main.tsx)). Eso hacía que la descarga de datos partiera dos veces. En [cargaDatos.ts](../src/services/cargaDatos.ts), la variable `cargaEnCurso` anota la carga que ya partió, y el segundo que llega **espera la misma** en vez de empezar otra. Es como dos hermanos que piden pizza: si uno ya llamó, el otro espera la misma pizza.

**Para leer ahora:** [App.tsx](../src/App.tsx) (los dos useEffect), [CargadorDatos.tsx](../src/components/CargadorDatos.tsx), [authService.ts](../src/services/authService.ts) y [cargaDatos.ts](../src/services/cargaDatos.ts).

**Preguntas:**
- ¿Por qué `CargadorDatos` tiene `[intentos]` y no `[]`? *(Para que el botón "Reintentar" vuelva a descargar: al sumar 1 a `intentos`, el useEffect se repite.)*
- ¿Para qué sirve el `setInterval` de App si el número no se muestra? *(Para que App se redibuje cada minuto y las reservas cambien de estado solas cuando pasa su hora.)*

---

## Paso 6 — useContext: el parlante de la app

> **Esto cambió:** antes la app **no** usaba `useContext`. Ahora **sí**, solo para compartir al usuario conectado. La rúbrica pide useContext, y [CLAUDE.md](../CLAUDE.md) se actualizó para permitirlo.

### 6.1 El problema que resuelve: pasar el recado de mano en mano

El **usuario conectado** vive en `App.tsx`, pero lo necesitan componentes que están **muy abajo**, como el formulario de cambio de estado. Antes viajaba así, como un recado que pasa de mano en mano:

```
App                      usuario={usuarioActual}
 └ PaginaInventario          usuario={props.usuario}      ← no lo usa, solo lo pasa
    └ FichaRecurso               usuario={props.usuario}  ← no lo usa, solo lo pasa
       └ FormularioCambioEstado      usa props.usuario.nombre
```

`PaginaInventario` y `FichaRecurso` no usaban el usuario para nada propio: solo lo pasaban. A esto se le llama **"prop drilling"** (taladrar con props).

### 6.2 La solución: un parlante

`useContext` es como poner un **parlante** en la sala: App "anuncia" el usuario **una vez**, y **cualquier** componente de adentro lo escucha directo.

```
App: 📢 "¡La persona conectada es Pedro Soto, encargado!"
   (todos los de adentro lo escuchan directo, sin pasárselo)
      MenuNavegacion        → useUsuario()  → muestra el nombre arriba a la derecha
      FormularioCambioEstado → useUsuario() → anota el nombre en el historial
      TablaReservas         → useUsuario()  → decide qué reservas mostrar
```

### 6.3 Las 3 piezas en nuestro código

**Pieza 1: crear el parlante** — [context/ContextoUsuario.ts](../src/context/ContextoUsuario.ts):

```ts
export const ContextoUsuario = createContext<Usuario | null>(null);
//                                          └ qué viaja por el canal   └ valor si nadie anuncia
```

**Pieza 2: anunciar** — en [App.tsx](../src/App.tsx), envolviendo a toda la app:

```tsx
<ContextoUsuario.Provider value={usuarioActual}>
  <CargadorDatos ...>
    ...toda la app...
  </CargadorDatos>
</ContextoUsuario.Provider>
```

**Pieza 3: escuchar** — con nuestro hook `useUsuario()`, en el mismo archivo ContextoUsuario.ts:

```ts
export function useUsuario(): Usuario {
  const usuario = useContext(ContextoUsuario);   // "¿qué dice el parlante?"
  if (usuario === null) {
    throw new Error('useUsuario() solo se puede usar con una sesión iniciada.');
  }
  return usuario;
}
```

Y en cualquier componente basta una línea:

```tsx
const usuario = useUsuario();
<span>{usuario.nombre}</span>
```

### 6.4 ¿Por qué un hook `useUsuario()` y no `useContext` directo en cada archivo?

1. **Más corto:** cada componente escribe una línea en vez de cuatro.
2. **Más seguro:** `useContext` devuelve `Usuario | null`, y TypeScript obligaría a revisar el `null` en cada archivo. `useUsuario()` lo revisa **una vez** y devuelve un `Usuario` seguro.
3. **Error claro:** si alguien lo usa donde no hay sesión (ej: en el login), sale un mensaje que dice exactamente qué pasó.

### 6.5 ¿Quién usa `useUsuario()`?

MenuNavegacion, PaginaInventario, FichaRecurso, FormularioCambioEstado, FormularioReponerStock, FormularioNuevoRecurso, PaginaReservas, FormularioReserva, TablaReservas, PaginaIncidencias, FormularioIncidencia y TablaIncidencias. Ninguno recibe ya el usuario por props.

### 6.6 ¿Por qué SOLO el usuario va por el parlante?

Porque es el único dato que necesitan **muchos** componentes en **muchos niveles**. Lo demás (el recurso de una ficha, la página actual de la paginación...) lo necesita uno o dos componentes cercanos, y por props se ve más claro de dónde viene cada cosa.

**Respuesta para la presentación:** *"Usamos useContext para compartir el usuario conectado. Antes lo pasábamos por props de App hasta el formulario, pasando por componentes que no lo usaban. Ahora App lo anuncia una vez con ContextoUsuario.Provider, y cada componente lo lee con nuestro hook useUsuario(), que además revisa que haya sesión."*

**Para leer ahora:** [ContextoUsuario.ts](../src/context/ContextoUsuario.ts), la parte de abajo de [App.tsx](../src/App.tsx) y [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx).

**Preguntas:**
- ¿Qué pasaría si `MenuNavegacion` estuviera **afuera** del `<ContextoUsuario.Provider>`? *(El parlante no le llegaría: `useContext` daría `null` y `useUsuario()` lanzaría el error.)*
- ¿Por qué el login no usa `useUsuario()`? *(Porque en el login todavía no hay nadie conectado: el parlante está anunciando `null`.)*

---

## Paso 7 — CSS: cómo se ve todo

### 7.1 Cómo se lee una regla

```css
.boton-principal {                    /* SELECTOR: a quién */
  background-color: var(--color-principal);   /* PROPIEDAD: valor; */
}
```

Cada componente tiene su `.css` al lado, y se activa con `import './Archivo.css'`.

> ⚠️ **Ojo:** en CSS normal, **todas las clases son globales** (de toda la app). Por ejemplo, `.mensaje-error` existe en [FormularioReserva.css](../src/components/FormularioReserva.css) **y** en [FormularioIncidencia.css](../src/components/FormularioIncidencia.css), y las dos reglas se mezclan. Por eso conviene darles nombres únicos a las clases (como `paginacion-...` o `configuracion-...`).

### 7.2 Selectores (a quién se le aplica)

| Selector | Significa | Ejemplo en la app |
|---|---|---|
| `.clase` | lo que tenga `className="clase"` | `.tarjeta-recurso` |
| `body`, `h1` | esa etiqueta HTML | [global.css](../src/styles/global.css) |
| `.a .b` (con espacio) | `.b` que está **dentro** de `.a` | `.configuracion-campo input` |
| `.a.b` (sin espacio) | algo que tiene **las dos** clases | `.boton-filtro-alerta.activo` |
| `.a, .b` (con coma) | la misma regla para **los dos** | `.configuracion-error, .configuracion-exito` |
| `:hover` | con el mouse encima | `.tarjeta-recurso:hover` |
| `:focus` | cuando estás escribiendo en la cajita | `.login-input:focus` |
| `:disabled` | botón apagado | `.paginacion-boton:disabled` |
| `:not(...)` | "que NO sea..." | `.paginacion-boton:hover:not(:disabled)` |
| `::before` | un elemento "fantasma" antes del contenido | la franja azul del login |
| `:nth-child(even)` | los hijos en posición par | las "filas de cebra" de [TablaReservas.css](../src/components/TablaReservas.css) |

### 7.3 La caja: margin, border, padding

Todo en una página es una **caja**:

```
┌──────────── margin (espacio de AFUERA) ────────────┐
│  ┌──────── border (el borde) ──────────────────┐   │
│  │  ┌──── padding (relleno de ADENTRO) ─────┐  │   │
│  │  │        contenido (el texto)           │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

`padding: 8px 16px` se lee así: 8px arriba y abajo, 16px a los lados. Con 4 valores, el orden es el de las agujas del reloj: **arriba, derecha, abajo, izquierda**.

### 7.4 Unidades y colores

| Unidad | Significa |
|---|---|
| `px` | pixeles (los puntitos de la pantalla) |
| `rem` | veces la letra normal (1rem = 16px) |
| `%` | porcentaje del papá |
| `vh` | alto de la ventana (100vh = toda la pantalla) |
| `fr` | una "fracción" del espacio libre (solo en grid) |

Los colores se escriben de dos formas:

- **`#1a63bb`:** rojo, verde y azul en hexadecimal. `#ffffff` es blanco y `#000000` es negro.
- **`rgba(0, 0, 0, 0.08)`:** rojo, verde, azul y transparencia (de 0 a 1).

### 7.5 Variables: un solo lugar para los colores

En [global.css](../src/styles/global.css) están **todos** los colores y tamaños:

```css
:root { --color-principal: #1a63bb; }        /* se crea */
.boton { background: var(--color-principal); } /* se usa */
```

Si cambias el valor en `:root`, cambia en toda la app (también en la paginación y en Configuración).

### 7.6 Flex: acomodar en una fila (o una columna)

```css
display: flex;                    /* mis hijos van en FILA */
flex-direction: column;           /* ...o en COLUMNA */
justify-content: space-between;   /* uno a cada extremo */
align-items: center;              /* centrados de arriba a abajo */
gap: 16px;                        /* espacio entre hijos */
flex-wrap: wrap;                  /* si no caben, bajan a otra línea */
```

Ver la barra azul en [MenuNavegacion.css](../src/components/MenuNavegacion.css) y los botones de página en [Paginacion.css](../src/components/Paginacion.css).

### 7.7 Grid: acomodar en una cuadrícula

```css
display: grid;
grid-template-columns: 2fr 1fr;   /* 2 columnas: la 1ª el doble de ancha */
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* ¡tantas como quepan! */
```

El segundo es el truco de las tarjetas del inventario: en el computador caben varias por fila y en el celular 1, sin escribir nada más. Ver [GrillaRecursos.css](../src/components/GrillaRecursos.css) y [FichaRecurso.css](../src/components/FichaRecurso.css).

### 7.8 Position: pegar cosas a la pantalla

| Valor | Qué hace | Dónde |
|---|---|---|
| `fixed` | **pegado** a la pantalla, como un sticker en el vidrio | la barra azul y el menú gris |
| `sticky` | se mueve normal hasta cierta altura y ahí **se pega**, como un imán | los formularios de la ficha |
| `z-index` | quién va encima de quién (más alto = más arriba) | la barra azul (100) |

Ojo: lo que es `fixed` **no ocupa lugar** en la página. Por eso `.app-contenido` tiene un `margin-top` para no quedar tapado.

### 7.9 @media: reglas solo para celular (diseño responsive)

```css
@media (max-width: 768px) {   /* solo si la pantalla mide 768px o menos */
  .grupo-campos { flex-direction: column; }
}
```

**Para probarlo:** F12 → el ícono del celular (arriba a la izquierda de DevTools) → elige 375px. Prueba también la página Configuración y la paginación: los botones crecen a 44px de alto para tocarlos con el dedo.

### 7.10 El mejor truco para aprender CSS

**F12 → Elements**, y haz clic derecho sobre algo de la página → **Inspeccionar**. A la derecha ves todas sus reglas CSS, y puedes **cambiar los valores en vivo** para probar (no se guarda nada). Cuando te guste cómo queda, copia el valor al archivo `.css`.

**Para leer ahora:** [global.css](../src/styles/global.css), [MenuNavegacion.css](../src/components/MenuNavegacion.css), [Paginacion.css](../src/components/Paginacion.css) y [PaginaConfiguracion.css](../src/pages/PaginaConfiguracion.css).

---

## Paso 8 — Los datos: Firebase, servicios y alertas

### 8.1 Iniciar sesión: el guardia y la lista de invitados

1. **Firebase Authentication** es el **guardia**: revisa el correo y la contraseña. Las contraseñas viven en Firebase (Consola → Authentication → Users).
2. **[data/usuarios.ts](../src/data/usuarios.ts)** es la **lista de invitados**: dice el nombre y el rol de cada correo.

Un correo tiene que estar en **los dos** lugares. Ver [authService.ts](../src/services/authService.ts).

### 8.2 Firestore: el cuaderno en la nube

Firestore guarda los datos en **7 colecciones** (carpetas):

| Colección | Qué guarda | Servicio |
|---|---|---|
| `recursos` | el inventario | [recursosService.ts](../src/services/recursosService.ts) |
| `historial` | cada cambio de estado, reposición o alta | [historialService.ts](../src/services/historialService.ts) |
| `incidencias` | los accidentes y problemas | [incidenciasService.ts](../src/services/incidenciasService.ts) |
| `reservas` | las reservas de los profesores | [reservasService.ts](../src/services/reservasService.ts) |
| `categorias` | **nueva:** las categorías de recursos | [configuracionService.ts](../src/services/configuracionService.ts) |
| `torres` | **nueva:** las torres (B, C...) | [configuracionService.ts](../src/services/configuracionService.ts) |
| `salas` | **nueva:** las salas (B307...) | [configuracionService.ts](../src/services/configuracionService.ts) |

Cada cosa es un **documento** (una hoja) con un nombre: `recursos/7`, `salas/B307`, `categorias/insumo`.

### 8.3 La copia en memoria (la idea más importante)

Ir a internet es lento. Por eso:

1. Al iniciar sesión, [CargadorDatos](../src/components/CargadorDatos.tsx) trae **todo** de Firestore **una vez** (con [cargaDatos.ts](../src/services/cargaDatos.ts)) y lo guarda en una lista dentro de cada servicio. La configuración se carga **primero**, porque los recursos usan sus categorías y salas.
2. Mientras tanto se ve "Cargando...". Si falla, se ve un error con el botón **"Reintentar"** (la rúbrica pide estos estados de carga y error).
3. Las pantallas **leen esa copia**, al tiro, sin esperar (`obtenerRecursos()`, `obtenerSalas()`...).
4. Al **cambiar** algo, primero se guarda en Firestore, y **solo si Firestore dice "ok"** se cambia también la copia.

> Es como tener una fotocopia del cuaderno en la mochila: lees la fotocopia (rápido), pero cuando escribes, escribes primero en el original y después en la fotocopia.

**La semilla:** si una colección está vacía (la primera vez, o si alguien la borró en la consola), el servicio la llena con los datos de `src/data/`.

### 8.4 Cómo viaja un cambio de estado (de principio a fin)

```
1. El encargado aprieta "Guardar cambio"   → FormularioCambioEstado.guardarCambio()
2. Revisa los datos                        → utils/cambioEstado.validarCambioEstado()
3. Le pide al bodeguero                    → recursosService.cambiarEstadoRecurso()
   (con su nombre, que sacó de useUsuario())
4. Arma la línea del diario                → historialService.crearRegistroCambioEstado()
5. Guarda las DOS cosas juntas (un lote)   → writeBatch: cantidades + historial (o las dos o ninguna)
6. Firestore dice "ok" → cambia la copia en memoria
7. El formulario avisa hacia arriba        → props.onEstadoCambiado()
       → FichaRecurso → FichaSegunRuta → PaginaInventario → App.registrarCambioInventario()
8. App suma 1 a cambiosInventario → React redibuja todo
       → el numerito rojo de alertas se recalcula, la ficha muestra los números nuevos
```

### 8.5 Las reglas de Firestore (el guardia del cuaderno)

[docs/firestore.rules](firestore.rules) dice qué se puede hacer **en el servidor**, aunque alguien modifique la app. Se pegan a mano en la consola de Firebase → Firestore → Reglas.

- **historial:** solo se agregan líneas; **nunca** se borran ni se cambian (RNF-06).
- **recursos:** se crean, y después solo se cambian sus cantidades.
- **incidencias:** se crean, y después solo cambia su estado.
- **reservas:** se crean y se borran (cancelar una reserva es borrarla).
- **categorias, torres y salas:** solo se **leen** y se **crean**. No se cambian ni se borran (un recurso o una reserva podría estar usándolas).

### 8.6 Reservas: ¿cuántas quedan libres?

En [disponibilidad.ts](../src/utils/disponibilidad.ts): **libres = disponibles − las reservadas que chocan con ese horario**. Dos reservas chocan si son el mismo día y una empieza antes de que la otra termine. Lo nuevo de las reservas (estados por hora y salas libres) está en el paso 12.

### 8.7 Alertas (las "notificaciones")

Las alertas **no se guardan en ningún lado**: [alertas.ts](../src/utils/alertas.ts) las **calcula** cada vez, revisando todos los recursos:

- unidades dañadas → **reparación**
- unidades en mantención → **mantención**
- un insumo con `disponible <= stockMinimo` → **reposición**

Por eso nunca quedan viejas: si reparas algo, su alerta desaparece sola. El numerito rojo del menú es `generarAlertas().length`, calculado en [App.tsx](../src/App.tsx).

**Para leer ahora:** [recursosService.ts](../src/services/recursosService.ts), [historialService.ts](../src/services/historialService.ts), [configuracionService.ts](../src/services/configuracionService.ts) y [alertas.ts](../src/utils/alertas.ts).

---

## Paso 9 — Recetas: cómo cambiar cosas

Después de cualquier cambio: guarda, mira el navegador, y antes de subirlo corre `npm run build` y `npm run lint`.

> **Tip:** en vez de buscar por número de línea, usa **Ctrl+F** (o Cmd+F en Mac) dentro del archivo y busca el nombre de la función o el texto.

### 9.1 Cambiar el NOMBRE que sale arriba a la derecha

El nombre no está escrito en el menú: viene de la lista de usuarios.

1. Abre [src/data/usuarios.ts](../src/data/usuarios.ts).
2. Busca el bloque del correo con que entras (por ejemplo, `encargado@prueba.cl`).
3. Cambia el texto de `nombre: '...'`.
4. Guarda y recarga (F5).

El viaje del nombre es:

```
usuarios.ts
  → authService.buscarUsuarioPorCorreo
  → App (useState usuarioActual)
  → 📢 ContextoUsuario.Provider (el parlante)
  → MenuNavegacion: const usuario = useUsuario();
  → {usuario.nombre}
```

> ⚠️ El nombre también se usa para otras cosas:
> - Queda guardado en las líneas **nuevas** del historial e incidencias. Las viejas mantienen el nombre anterior.
> - "Mis reservas" del docente compara el nombre de la reserva con el del usuario. Si le cambias el nombre al docente, sus reservas viejas dejan de aparecer en "Mis reservas".

### 9.2 Cambiar "Encargado de laboratorio" (el rol debajo de tu nombre)

1. Abre [src/components/MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx) y busca la función `nombreDelRol`.
2. Cambia **solo el texto de la derecha** del `return`:
   ```tsx
   if (rol === 'encargado') {
     return 'Jefe de laboratorio';   // ← antes decía 'Encargado de laboratorio'
   }
   ```
3. **No cambies** el `'encargado'` de la izquierda del `===`: ese es el valor interno del rol, y lo usa toda la app.

### 9.3 Cambiar el tamaño o color de tu nombre y rol

En [MenuNavegacion.css](../src/components/MenuNavegacion.css):

- `.app-header-usuario-nombre` es tu nombre.
- `.app-header-usuario-rol` es el rol.

```css
.app-header-usuario-nombre {
  font-size: 1rem;     /* más grande (antes 0.875rem) */
  color: #fde047;      /* amarillo */
}
```

En celulares de menos de 420px, el rol se esconde (`display: none`, al final del archivo).

### 9.4 Cambiar el título de la app

Está en 4 lugares:

| Dónde se ve | Archivo | Busca |
|---|---|---|
| La barra azul | [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx) | `app-header-titulo` |
| El título del login | [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx) | `login-titulo` |
| El subtítulo del login | [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx) | `login-subtitulo` |
| La pestaña del navegador | [index.html](../index.html) | `<title>` |

### 9.5 Cambiar los colores de toda la app

[global.css](../src/styles/global.css), dentro de `:root`. Por ejemplo, cambia `--color-principal` y cambia el azul de la barra, los botones, la paginación y los títulos, todo junto.

### 9.6 Agregar una persona nueva

1. **Consola de Firebase → Authentication → Users → Add user**: el correo y la contraseña.
2. En [usuarios.ts](../src/data/usuarios.ts), copia un bloque `{ correo, nombre, rol }`, pégalo y cambia los datos. El rol tiene que ser `'encargado'`, `'docente'` o `'departamento'`.

### 9.7 Cambiar un texto de la ficha (ej: "N° de serie" → "Número de serie")

[FichaRecurso.tsx](../src/components/FichaRecurso.tsx), busca `<dt>N° de serie</dt>`. Cambia el texto entre `<dt>` y `</dt>`. Lo mismo para los subtítulos `<h3>`.

Si quieres que diga otra cosa cuando un dato falta (hoy dice "No registrado"), cámbialo en `textoCampoOpcional` de [utils/inventario.ts](../src/utils/inventario.ts).

### 9.8 Agregar un DATO NUEVO a la ficha (ej: "Fecha de compra")

Se toca en 5 lugares. Síguelos en orden: TypeScript te va a marcar en rojo lo que falte.

**1. El molde** — [types/Recurso.ts](../src/types/Recurso.ts):
```ts
export interface Recurso {
  ...
  fechaCompra?: string;   // opcional: los recursos viejos no la tienen
}
export interface DatosNuevoRecurso {
  ...
  fechaCompra: string;
}
```

**2. El formulario parte vacío** — en `datosVaciosNuevoRecurso` de [utils/nuevoRecurso.ts](../src/utils/nuevoRecurso.ts):
```ts
  fechaCompra: '',
```

**3. Se guarda al crear el recurso** — en `armarRecurso` del mismo archivo:
```ts
    fechaCompra: textoOpcional(datos.fechaCompra),
```

**4. La cajita del formulario** — en [CamposDetalleRecurso.tsx](../src/components/CamposDetalleRecurso.tsx), copia un `<label>`:
```tsx
<label className="nuevo-recurso-campo">
  Fecha de compra
  <input
    type="date"
    value={datos.fechaCompra}
    onChange={(evento) => props.onCambiar({ ...datos, fechaCompra: evento.target.value })}
  />
</label>
```

**5. Mostrarlo en la ficha** — en [FichaRecurso.tsx](../src/components/FichaRecurso.tsx), junto a los otros `<dt>`:
```tsx
<dt>Fecha de compra</dt>
<dd>{textoCampoOpcional(recurso.fechaCompra)}</dd>
```

Los recursos que ya existían van a mostrar "No registrado", porque no tienen ese dato.

### 9.9 Cambiar cómo se llama un estado en pantalla

[utils/inventario.ts](../src/utils/inventario.ts), función `textoEstado`. Por ejemplo, `return 'Dañado';` → `return 'Roto';`. Cambia en tarjetas, ficha, filtros e historial a la vez.

Los estados de las reservas ("Programada", "En curso", "Realizada") se cambian en `textoEstadoReserva` de [utils/estadoReserva.ts](../src/utils/estadoReserva.ts).

> Los **nombres de las categorías** ya no están en el código: están en Firestore. Ver la receta 9.12.

### 9.10 Cambiar quién puede hacer qué (permisos)

Todo está en [utils/permisos.ts](../src/utils/permisos.ts). Por ejemplo, para que el departamento también pueda reservar, en `puedeReservar`:
```ts
if (rol === 'docente' || rol === 'encargado' || rol === 'departamento') {
```

### 9.11 Cambiar los textos de las alertas

[utils/alertas.ts](../src/utils/alertas.ts): ahí se arman los mensajes. Los dibujitos (🔧 ⚠️ 📦) están en [TarjetaAlerta.tsx](../src/components/TarjetaAlerta.tsx), y los colores en [TarjetaAlerta.css](../src/components/TarjetaAlerta.css).

### 9.12 Agregar una categoría, torre o sala nueva

**¡Ya no se programa!** Entra como encargado → menú **Configuración** → escribe el nombre → **"+ Agregar"**. Aparece al tiro en el filtro del inventario, en "Agregar recurso" y (las salas) en las reservas. Ver el paso 13.

Si quieres que una categoría **venga de fábrica** (la primera vez que se llena Firestore), agrégala a `listaCategoriasPrueba` en [data/configuracion.ts](../src/data/configuracion.ts).

### 9.13 Agregar una página nueva (ej: "Reportes")

1. [types/Pagina.ts](../src/types/Pagina.ts): agrega `| 'reportes'`.
2. Crea `src/pages/PaginaReportes.tsx` y su `PaginaReportes.css` (copia la forma de [PaginaAlertas.tsx](../src/pages/PaginaAlertas.tsx)).
3. [App.tsx](../src/App.tsx), dentro de `<Routes>`, **antes** del `path="*"`:
   ```tsx
   <Route
     path="/reportes"
     element={paginaSiPuede(usuarioActual, 'reportes', <PaginaReportes />)}
   />
   ```
4. [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx): copia un bloque de `NavLink` y cambia `'alertas'` por `'reportes'` y `to="/alertas"` por `to="/reportes"`.
5. Si no todos los roles la pueden ver: [permisos.ts](../src/utils/permisos.ts), `puedeVerPagina`.

### 9.14 Mostrar más (o menos) recursos por página

[utils/paginacion.ts](../src/utils/paginacion.ts): cambia `RECURSOS_POR_PAGINA = 9` por el número que quieras (ej: 12, que es una grilla de 4 × 3).

---

## Paso 10 — React Router: cada página tiene su dirección

### 10.1 El problema

Antes, la página que se veía era un `useState` en App (`paginaActual`). Eso tenía problemas:

- La dirección del navegador **siempre** decía `localhost:5173/`, estuvieras donde estuvieras.
- El botón **"Atrás"** del navegador te sacaba de la app.
- Si recargabas (F5) en una ficha, volvías al principio.
- No podías copiar el link de una ficha y mandárselo a alguien.

### 10.2 La solución: React Router

**React Router** es una librería (`react-router-dom`) que conecta la app con la **dirección (URL)** del navegador. Ahora cada página tiene su dirección, como las páginas de un libro tienen su número:

| Dirección | Qué se ve |
|---|---|
| `/login` | el login (solo si no hay sesión) |
| `/inventario` | el listado con filtros y paginación |
| `/inventario/3` | la ficha del recurso número 3 |
| `/inventario/nuevo` | el formulario "Agregar recurso" (solo encargado) |
| `/reservas` | las reservas |
| `/incidencias` | las incidencias (no el docente) |
| `/alertas` | las alertas (no el docente) |
| `/configuracion` | la configuración (solo encargado) |

**Importante:** la página **no se recarga** al cambiar de dirección. React Router solo cambia lo que se dibuja. Por eso la app sigue siendo rápida (es una "SPA": *Single Page Application*, una app de una sola página).

### 10.3 Las piezas, una por una

| Pieza | Qué hace | Es como... | Dónde |
|---|---|---|---|
| `<BrowserRouter>` | Conecta la app con la dirección del navegador. Envuelve a todo. | Enchufar la app a la barra de direcciones | [main.tsx](../src/main.tsx) |
| `<Routes>` + `<Route>` | El **mapa**: "en esta dirección, dibuja esta página". Dibuja SOLO la que calza. | El índice de un libro | [App.tsx](../src/App.tsx) |
| `<NavLink>` | Un enlace que cambia la dirección **y sabe si está activo** (para pintarlo azul). | Un botón del ascensor que se ilumina en tu piso | [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx) |
| `useNavigate()` | Cambiar de dirección **desde el código** (sin clic en un enlace). | Que el GPS te lleve solo | [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx), [App.tsx](../src/App.tsx) |
| `<Navigate to="..." replace />` | Al dibujarse, te **manda** a otra dirección. | Un letrero de "desvío" | [App.tsx](../src/App.tsx), [FichaSegunRuta.tsx](../src/components/FichaSegunRuta.tsx) |
| `useParams()` | Lee la parte que **cambia** de la dirección (el `3` de `/inventario/3`). | Leer el número de la puerta | [FichaSegunRuta.tsx](../src/components/FichaSegunRuta.tsx) |

### 10.4 El mapa principal (App.tsx)

```tsx
<Routes>
  <Route path="/inventario/*" element={<PaginaInventario ... />} />
  <Route path="/reservas"     element={paginaSiPuede(usuarioActual, 'reservas', <PaginaReservas />)} />
  ...
  <Route path="*" element={<Navigate to="/inventario" replace />} />
</Routes>
```

- `path` = la dirección. `element` = lo que se dibuja ahí.
- `path="*"` = **cualquier otra** dirección. Va **al final**, como el `else` de un if.
- El `*` de `/inventario/*` significa "y todo lo que venga después": deja que PaginaInventario tenga **sus propias** direcciones adentro.

### 10.5 Rutas anidadas: las direcciones de adentro del inventario

En [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx) hay **otro** `<Routes>`:

```tsx
<Routes>
  <Route index element={contenidoListado} />            {/* /inventario      */}
  <Route path="nuevo" element={contenidoNuevoRecurso} /> {/* /inventario/nuevo */}
  <Route path=":idRecurso" element={<FichaSegunRuta ... />} /> {/* /inventario/3 */}
</Routes>
```

- Se escriben **sin** `/inventario` adelante, porque App ya lo puso.
- `index` = la dirección justa, sin nada más.
- `:idRecurso` = los **dos puntos** significan "esta parte cambia". Puede ser `3`, `7`, `15`...
- ¿Y `/inventario/nuevo`? React Router prefiere el texto **fijo** (`nuevo`) antes que el que cambia (`:idRecurso`), así que no se confunde.

**Ventaja escondida:** como la ficha es una dirección **de adentro**, PaginaInventario **nunca desaparece** al abrir una ficha. Por eso, al volver, los filtros y la página en que estabas **siguen ahí**.

### 10.6 useParams: leer el número de la dirección

En [FichaSegunRuta.tsx](../src/components/FichaSegunRuta.tsx):

```tsx
const parametros = useParams();                     // { idRecurso: "3" }
const idRecurso = Number(parametros.idRecurso);     // "3" (texto) → 3 (número)
const recurso = obtenerRecursoPorId(idRecurso);
if (recurso === undefined) {
  return <Navigate to="/inventario" replace />;     // /inventario/999 → no existe → al listado
}
return <FichaRecurso recurso={recurso} ... />;
```

### 10.7 Rutas protegidas: el guardia de la puerta (RNF-03)

El menú ya esconde los botones que tu rol no puede ver. Pero ¿y si un docente **escribe** `/alertas` en la barra del navegador? Para eso está `paginaSiPuede` en [App.tsx](../src/App.tsx):

```tsx
function paginaSiPuede(usuario: Usuario, pagina: Pagina, contenido: ReactNode): ReactNode {
  if (puedeVerPagina(usuario.rol, pagina)) {
    return contenido;                              // puede: le mostramos la página
  } else {
    return <Navigate to="/inventario" replace />;  // no puede: desvío al inventario
  }
}
```

`replace` reemplaza la dirección en el historial: así el botón "Atrás" no lo devuelve a la página prohibida. Lo mismo pasa con `/inventario/nuevo` para quien no es encargado, y con cualquier dirección si no hay sesión (todo te manda a `/login`).

### 10.8 El viaje de un clic en una tarjeta

```
1. Haces clic en la tarjeta del Multímetro (id 3)
2. TarjetaRecurso avisa hacia arriba         → props.onSeleccionar(3)
                                             → GrillaRecursos → props.onSeleccionarRecurso(3)
3. PaginaInventario.abrirFicha(3)            → navegar('/inventario/3')
4. La dirección cambia (sin recargar la página)
5. El <Routes> de PaginaInventario ve "3"    → dibuja <FichaSegunRuta>
6. FichaSegunRuta: useParams() → "3" → busca el recurso → dibuja <FichaRecurso>
7. Aprietas "Atrás" en el navegador          → la dirección vuelve a /inventario
                                             → se ve el listado, con tus filtros intactos
```

### 10.9 Pruébalo en el navegador

1. Entra como encargado, abre una ficha y mira la dirección: `/inventario/3`. Aprieta **F5**: sigues en la ficha.
2. Filtra por una categoría, abre una ficha y aprieta **"Atrás"** del navegador: vuelves al listado **con el filtro puesto**.
3. Entra como docente y escribe `localhost:5173/alertas` en la barra: te manda a `/inventario`.
4. Escribe `localhost:5173/inventario/999`: como ese recurso no existe, vuelves al listado.
5. Escribe `localhost:5173/cualquiercosa`: vuelves al inventario.

**Para leer ahora:** [main.tsx](../src/main.tsx), [App.tsx](../src/App.tsx), [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx) y [FichaSegunRuta.tsx](../src/components/FichaSegunRuta.tsx).

**Preguntas:**
- ¿Qué diferencia hay entre `<NavLink>` y `useNavigate()`? *(NavLink es un enlace donde la persona hace clic. useNavigate cambia la dirección desde el código, por ejemplo después de guardar un recurso.)*
- ¿Por qué `path="*"` va al final? *(Porque calza con cualquier dirección. Es el "si no" del mapa: lo que no calzó con nada antes.)*
- ¿Por qué los filtros no se pierden al abrir una ficha? *(Porque la ficha es una ruta de adentro de `/inventario`: PaginaInventario sigue en pantalla y su memoria también.)*

---

## Paso 11 — Hooks propios y paginación

### 11.1 ¿Qué es un hook?

Un **hook** es una herramienta de React cuyo nombre empieza con **`use`**: `useState`, `useEffect`, `useContext`, `useNavigate`, `useParams`...

Un **hook propio** (o "personalizado") es una función **nuestra** que:

1. empieza con `use`, y
2. usa otros hooks adentro.

Tenemos dos:

| Hook | Qué guarda | Dónde |
|---|---|---|
| `useUsuario()` | Escucha el parlante y devuelve la persona conectada (paso 6) | [context/ContextoUsuario.ts](../src/context/ContextoUsuario.ts) |
| `useFiltrosInventario()` | Toda la memoria de los filtros y la paginación del inventario | [hooks/useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts) |

**Dos reglas de los hooks:**

1. Solo se llaman **dentro de un componente** (o de otro hook).
2. Siempre arriba, **nunca dentro de un `if` o un `for`**. React los cuenta en orden cada vez que dibuja; si uno a veces no se llama, se desordenan.

### 11.2 useFiltrosInventario: un estuche para los útiles

Antes, PaginaInventario tenía adentro 4 `useState` (uno por filtro), los cálculos del colador y las funciones para limpiar. Con la paginación iba a pasar las 150 líneas (la regla del grupo). Así que **sacamos todo eso a un hook**:

```tsx
// En PaginaInventario.tsx, una sola línea:
const filtros = useFiltrosInventario();

// Y se usa así:
<FiltrosInventario categoria={filtros.categoria} onCambiarCategoria={filtros.cambiarCategoria} ... />
<GrillaRecursos recursos={filtros.recursosDeLaPagina} ... />
<Paginacion paginaActual={filtros.paginaActual} totalPaginas={filtros.totalPaginas} ... />
```

> **Ojo con esta idea:** la memoria (los `useState`) **no vive en el archivo del hook**. Vive en el componente que lo llama (PaginaInventario), igual que si estuvieran escritos allá. El hook es solo una forma ordenada de escribirlos, como un estuche: los útiles siguen siendo tuyos.

Lo que devuelve el hook tiene su propio molde, `DatosFiltrosInventario`: valores para mostrar (`categoria`, `paginaActual`, `recursosDeLaPagina`...) y funciones para cambiarlos (`cambiarCategoria`, `cambiarPagina`, `limpiarFiltros`...).

### 11.3 La paginación, paso a paso

Supón que hay **20 recursos** y no hay filtros:

```
1. calcularTotalPaginas(20, 9)        → 20 / 9 = 2,2 → Math.ceil → 3 páginas
2. Estás en la página 2
3. obtenerRecursosDePagina(lista, 2, 9):
     inicio = (2 - 1) × 9 = 9
     lista.slice(9, 18)                → los recursos en las posiciones 9 a 17
                                         (las listas cuentan desde 0: el décimo al decimoctavo)
4. GrillaRecursos recibe SOLO esos 9
5. Paginacion dibuja:  ← Anterior  [1] [2] [3]  Siguiente →
                                        └ azul (la actual)
```

Las funciones están en [utils/paginacion.ts](../src/utils/paginacion.ts) y los botones en [Paginacion.tsx](../src/components/Paginacion.tsx).

**Tres detalles del hook:**

- **Al cambiar un filtro, vuelves a la página 1.** Si estabas en la página 3 y filtras por "Reactivo" (que tiene 2 recursos), la página 3 ya no existe.
- **Si la página quedó fuera de rango, se muestra la última.** Por ejemplo, si estabas en la página 2 y alguien dañó un recurso que ya no pasa el filtro.
- **Al cambiar de página, sube hasta arriba** (`window.scrollTo(0, 0)`), para ver la grilla desde el principio.

**Para leer ahora:** [useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts), [paginacion.ts](../src/utils/paginacion.ts) y [Paginacion.tsx](../src/components/Paginacion.tsx).

**Preguntas:**
- ¿Cuántas páginas hay con 9 recursos? ¿Y con 10? *(Con 9, una sola, y Paginacion no dibuja nada. Con 10, dos: 9 en la primera y 1 en la segunda.)*
- ¿Por qué `Paginacion` no tiene `useState`? *(Porque solo muestra y avisa. La página actual la guarda el hook, en PaginaInventario.)*
- ¿Qué tienen en común `useUsuario` y `useFiltrosInventario`? *(Los dos empiezan con "use" y usan otros hooks adentro: useContext y useState.)*

---

## Paso 12 — Reservas que pasan solas al historial, y salas libres

El profesor pidió dos cosas para las reservas:

1. Que cuando pase la hora de una reserva, quede **realizada**, pase al **historial** y el inventario **recupere** las unidades.
2. Que la sala se **elija de una lista** que muestre solo las salas **disponibles**.

### 12.1 Los 3 momentos de una reserva

Una reserva pasa por 3 momentos, como una clase del horario:

```
         10:00                    11:30
───────────┼────────────────────────┼──────────────▶ hora
 PROGRAMADA│       EN CURSO         │  REALIZADA
 (azul)    │  (amarillo: las        │  (gris: pasa al historial
           │   unidades están en    │   y las unidades vuelven)
           │   la sala del profe)   │
```

### 12.2 El estado NO se guarda: se calcula

Este es el truco más importante. En Firestore la reserva **no tiene** un campo "estado". Cada vez que la app se dibuja, [estadoReserva.ts](../src/utils/estadoReserva.ts) lo **calcula** mirando el reloj:

```ts
const ahora = obtenerFechaActual();                       // "2026-10-12 10:45"
const inicio = reserva.fecha + ' ' + reserva.horaInicio;  // "2026-10-12 10:00"
const fin = reserva.fecha + ' ' + reserva.horaFin;        // "2026-10-12 11:30"

if (ahora >= fin)         → 'realizada'
else if (ahora >= inicio) → 'en_curso'
else                      → 'programada'
```

Comparar los textos con `>=` funciona porque van **de lo más grande a lo más chico** (año, mes, día, hora, minuto), igual que ordenar palabras en el diccionario.

**¿Por qué calcularlo y no guardarlo?** Si se guardara, alguien (o algo) tendría que cambiarlo **justo** a las 11:30. Calculándolo, siempre está correcto, sin que nadie haga nada. Es la misma idea que las alertas (paso 8.7).

### 12.3 ¿Y cómo se entera la pantalla de que pasó la hora?

React solo recalcula cuando **redibuja**. Si nadie toca nada, no redibuja nunca... Por eso App tiene el **reloj** del paso 5.4: un `setInterval` que cada minuto cambia un useState, App se redibuja, y todos los estados se recalculan. Así, a las 11:30, la reserva salta sola de una tabla a la otra.

### 12.4 Las dos tablas

En [PaginaReservas.tsx](../src/pages/PaginaReservas.tsx) se usa **el mismo** componente dos veces, con una prop `modo` distinta:

```tsx
<TablaReservas modo="activas"   ... />   // programadas y en curso, con botón Cancelar
<TablaReservas modo="historial" ... />   // realizadas, sin botón (ya pasaron), la más nueva arriba
```

Dentro de [TablaReservas.tsx](../src/components/TablaReservas.tsx), cada tabla se queda solo con las suyas:

```tsx
const realizada = obtenerEstadoReserva(reserva) === 'realizada';
if ((modo === 'historial' && realizada) || (modo === 'activas' && !realizada)) {
  reservas.push(reserva);
}
```

Cada fila ([FilaReserva.tsx](../src/components/FilaReserva.tsx)) muestra una pastillita de color con el estado. Su clase se arma pegando textos: `'etiqueta-reserva-' + estado` → `etiqueta-reserva-en_curso` (amarilla, en [TablaReservas.css](../src/components/TablaReservas.css)).

### 12.5 Las unidades "vuelven" al inventario

Mientras una reserva está **en curso**, sus unidades están en la sala del profesor, no en el laboratorio. [estadoReserva.ts](../src/utils/estadoReserva.ts) las cuenta:

```ts
calcularUnidadesEnReservaAhora(recursoId)   // suma las cantidades de las reservas EN CURSO de ese recurso
```

- La **tarjeta** del inventario ([TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx)) las resta: *"Cantidad: 19 (15 disponibles · 4 en reserva ahora)"*.
- La **ficha** ([TablaUnidadesEstado.tsx](../src/components/TablaUnidadesEstado.tsx)) muestra un aviso amarillo.
- Cuando la reserva queda **realizada**, deja de contar: el número vuelve a 0 y las unidades "vuelven" solas. **Nadie toca la base de datos.**

### 12.6 La sala, elegida de una lista de salas libres

En [FormularioReserva.tsx](../src/components/FormularioReserva.tsx), la sala ya no se escribe: es un **menú**.

```tsx
const horarioCompleto = fecha !== '' && horaInicio !== '' && horaFin !== '' && horaFin > horaInicio;
let salasParaElegir = obtenerSalas();                 // sin horario: TODAS las salas
if (horarioCompleto) {
  salasParaElegir = obtenerSalasLibres(fecha, horaInicio, horaFin, docente.trim());  // con horario: solo las LIBRES
}
```

¿Cuándo está **ocupada** una sala? Lo decide `salaEstaLibre` en [disponibilidad.ts](../src/utils/disponibilidad.ts):

> Una sala está ocupada si **OTRO** profesor la tiene reservada en un horario que **se cruza** con el tuyo.

¿Por qué "otro"? Porque un profesor puede reservar multímetros **y** cables para su **misma** clase, en la misma sala. Es como una sala de estudio de la biblioteca: si la pidió otro grupo a esa hora, no puedes; si la pediste tú, puedes llevar más cosas.

**Doble revisión:** al apretar "Confirmar reserva", la sala se revisa **otra vez**. ¿Por qué? Porque alguien pudo elegir la sala y **después** cambiar la hora, y quizás en el horario nuevo ya no está libre.

### 12.7 No se puede reservar en el pasado

`validarCamposReserva` (en [disponibilidad.ts](../src/utils/disponibilidad.ts)) rechaza una fecha anterior a hoy: `if (fecha < obtenerFechaHoy())`.

### 12.8 Pruébalo en el navegador

1. Como docente, crea una reserva para **hoy**, que empiece en 1 minuto y dure 2 minutos (ej: si son las 15:20, de 15:21 a 15:23).
2. Mira la tabla: dice **Programada** (azul).
3. Espera un minuto: dice **En curso** (amarillo). Ve al inventario: la tarjeta dice *"N en reserva ahora"*.
4. Espera dos minutos más: la reserva **salta sola** a "Mi historial de reservas (realizadas)", y la tarjeta vuelve a su número normal. **Sin recargar.**
5. Como encargado, reserva la sala B307 de 10:00 a 11:00 a nombre de otro profesor. Después, como docente, elige el mismo día y de 10:30 a 11:30: **B307 no aparece** en la lista.

**Para leer ahora:** [estadoReserva.ts](../src/utils/estadoReserva.ts), [TablaReservas.tsx](../src/components/TablaReservas.tsx), [FilaReserva.tsx](../src/components/FilaReserva.tsx), [disponibilidad.ts](../src/utils/disponibilidad.ts) (las funciones de abajo) y [FormularioReserva.tsx](../src/components/FormularioReserva.tsx).

**Preguntas:**
- ¿Dónde se guarda el estado "realizada" de una reserva? *(En ningún lado: se calcula cada vez comparando la fecha y la hora con el reloj.)*
- ¿Por qué el inventario recupera las unidades sin que nadie cambie Firestore? *(Porque las unidades "en reserva ahora" se calculan solo con las reservas en curso. Cuando la reserva termina, ya no cuenta.)*
- Si el profesor Juan reservó la sala B302 de 10 a 12, ¿puede Juan reservar más materiales en B302 de 11 a 12? ¿Y la profesora Ana? *(Juan sí, porque es su propia clase. Ana no: la sala está ocupada por otro docente.)*

---

## Paso 13 — Configuración: categorías, torres y salas

### 13.1 El problema: escalabilidad

Antes, las 6 categorías, las torres B y C y las salas estaban **escritas en el código**. Para agregar la categoría "Material de vidrio" o la torre D había que **programar** y volver a subir la app. Eso no "escala" (no crece bien).

El profesor pidió poder agregarlas **con un botón**. Eso es justo lo que dice RNF-05: *incorporar categorías sin cambios estructurales*.

### 13.2 La solución: guardarlas como datos, no como código

Ahora viven en **3 colecciones nuevas** de Firestore (`categorias`, `torres` y `salas`) y el encargado las agrega en la página **Configuración**.

```
PaginaConfiguracion  (/configuracion, solo encargado)
 ├─ SeccionCategorias   lista + formulario "Nueva categoría" (+ ✓ "Se gasta")
 ├─ SeccionTorres       lista (con cuántas salas tiene cada una) + "Nueva torre"
 └─ SeccionSalas        lista + elegir torre + "Número de sala"
```

### 13.3 Las piezas

| Pieza | Archivo | Qué hace |
|---|---|---|
| Los moldes | [types/Configuracion.ts](../src/types/Configuracion.ts) | `Categoria { clave, nombre, usaStockMinimo }`, `Torre { letra }`, `Sala { codigo, torre, numero }` |
| Las semillas | [data/configuracion.ts](../src/data/configuracion.ts) | Las 6 categorías, las torres B y C y 5 salas, para la primera vez |
| El bodeguero | [services/configuracionService.ts](../src/services/configuracionService.ts) | Carga, siembra, entrega (`obtener...`) y agrega (`agregar...`) |
| Los revisores | [utils/configuracion.ts](../src/utils/configuracion.ts) | Revisan que lo nuevo esté bien escrito y no exista ya |
| La página | [pages/PaginaConfiguracion.tsx](../src/pages/PaginaConfiguracion.tsx) | Junta las 3 secciones |
| Las secciones | [SeccionCategorias.tsx](../src/components/SeccionCategorias.tsx), [SeccionTorres.tsx](../src/components/SeccionTorres.tsx), [SeccionSalas.tsx](../src/components/SeccionSalas.tsx) | Una tarjeta con lista + formulario cada una |

### 13.4 La clave de una categoría

Cuando escribes **"Material de vidrio"**, se guarda así:

```ts
{ clave: 'material_de_vidrio', nombre: 'Material de vidrio', usaStockMinimo: false }
```

- La **clave** (minúsculas, sin tildes, con `_`) es lo que se guarda en cada recurso: `recurso.categoria = 'material_de_vidrio'`. Se arma sola con `crearClaveCategoria`.
- El **nombre** es lo bonito que se ve en pantalla. `textoCategoria` (en [utils/inventario.ts](../src/utils/inventario.ts)) busca la categoría por su clave y devuelve el nombre.
- **`usaStockMinimo`** es el cuadradito "Se gasta". Si está marcado, el formulario "Agregar recurso" pide el stock mínimo (como insumos y reactivos, HU-09).

Como se comparan **claves**, "Equipo", "equipo" y "Équipo" cuentan como la misma: no se puede repetir.

### 13.5 ¿Dónde aparece lo nuevo, solo?

| Agregas... | Aparece en... | Porque ese componente llama a... |
|---|---|---|
| una categoría | el filtro del inventario y "Agregar recurso" | `obtenerCategorias()` |
| una torre | el menú "Torre" de "Agregar recurso" y de la sección de salas | `obtenerTorres()` |
| una sala | el menú "Sala" de "Agregar recurso" (filtrado por torre) y el menú "Sala" de las reservas | `obtenerSalasDeTorre()` / `obtenerSalas()` |

Nadie escribió la categoría nueva en esos componentes: todos le **piden la lista** al mismo servicio.

### 13.6 ¿Por qué no se pueden borrar?

A propósito, no hay botón de borrar, y las reglas de Firestore lo prohíben (solo leer y crear). Si borraras la sala B307, las reservas y recursos que dicen "B307" quedarían apuntando a algo que no existe.

### 13.7 Pruébalo en el navegador

1. Entra como encargado → **Configuración**.
2. Agrega la categoría **"Herramienta"**. Ve al inventario: aparece en el filtro de categoría.
3. Agrega la torre **"E"**. En la lista dice *"Torre E · 0 salas"*.
4. Agrega la sala **E101** (elige torre E, número 101). La torre E ahora dice *"1 sala"* (en singular).
5. Ve a "Agregar recurso", elige torre E: aparece la sala 101.
6. Ve a Reservas: **E101** aparece en el menú de salas.
7. Prueba errores: agrega otra vez "herramienta" (ya existe), una torre "EE" (no es una letra), una sala "abc" (no es un número).

> ⚠️ Lo que agregues en estas pruebas **queda guardado** en Firestore y no se puede borrar desde la app. Si es solo una prueba, después bórralo a mano en la consola de Firebase (o pide al grupo que lo haga).

**Para leer ahora:** [types/Configuracion.ts](../src/types/Configuracion.ts), [configuracionService.ts](../src/services/configuracionService.ts), [utils/configuracion.ts](../src/utils/configuracion.ts) y [SeccionCategorias.tsx](../src/components/SeccionCategorias.tsx) (las otras dos secciones funcionan igual).

**Preguntas:**
- ¿Qué tuvieron que cambiar en el código para que la categoría "Herramienta" aparezca en el filtro? *(Nada: el filtro le pide la lista a `obtenerCategorias()`, y la categoría nueva ya está ahí.)*
- ¿Por qué `CategoriaRecurso` pasó a ser `string`? *(Porque ahora las categorías las crea el encargado, y TypeScript no puede saber sus nombres de antemano.)*
- ¿Qué pasa si se corta internet al agregar una sala? *(Firestore falla, `agregarSala` devuelve `false`, la copia en memoria no se toca y se ve el mensaje rojo.)*

---

## Paso 14 — La rúbrica, la demo y las preguntas

### 14.1 Dónde está cada cosa que pide la rúbrica

| La rúbrica pide... | Dónde está | Qué mostrar |
|---|---|---|
| **React Router** (rutas, navegación) | [main.tsx](../src/main.tsx) (`BrowserRouter`), [App.tsx](../src/App.tsx) (`Routes`, rutas protegidas), [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx) (`NavLink`), [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx) (rutas anidadas, `useNavigate`), [FichaSegunRuta.tsx](../src/components/FichaSegunRuta.tsx) (`useParams`) | La dirección cambia, F5 en una ficha, el botón "Atrás", un docente escribiendo `/alertas` |
| **Props tipadas** | Toda `interface Props...`, por ejemplo [Paginacion.tsx](../src/components/Paginacion.tsx) y [FilaReserva.tsx](../src/components/FilaReserva.tsx) | Una interface y cómo el papá le pasa las props |
| **useState** | En todos los formularios; [useFiltrosInventario.ts](../src/hooks/useFiltrosInventario.ts) | Un formulario controlado |
| **useEffect** | [App.tsx](../src/App.tsx) (sesión y reloj), [CargadorDatos.tsx](../src/components/CargadorDatos.tsx) (carga y "Reintentar") | El `[]`, el `[intentos]` y la limpieza |
| **useContext** | [ContextoUsuario.ts](../src/context/ContextoUsuario.ts) + el `Provider` en [App.tsx](../src/App.tsx) | Antes vs. ahora (paso 6.1) |
| **Hooks personalizados** | `useUsuario` y `useFiltrosInventario` | Las dos reglas de los hooks |
| **Firebase** (datos reales) | Authentication + 7 colecciones de Firestore (paso 8.2) | Cambiar un estado y verlo en la consola de Firebase |
| **Estados de carga y error** | [CargadorDatos.tsx](../src/components/CargadorDatos.tsx): "Cargando..." y error con "Reintentar"; mensajes rojos en los formularios | Una recarga (F5) |
| **Diseño responsive** | Los `@media` de cada `.css` y la grilla `auto-fill` | F12 → modo celular a 375px |
| **`main` funcional** | `npm install`, `npm run dev`, `npm run build`, `npm run lint` | Que prenda en el computador de cualquiera |
| **Commits de todos** | El historial de GitHub | — |
| **Defensa oral** | Esta guía 🙂 | Cualquiera debe poder explicar cualquier parte |

### 14.2 Los 5 pedidos del profesor

| Pedido | Dónde | Paso |
|---|---|---|
| Paginación del inventario | `useFiltrosInventario`, `paginacion.ts`, `Paginacion.tsx` | 11 |
| Agregar categorías nuevas | Configuración → SeccionCategorias | 13 |
| Reservas: pasan a "realizada", al historial, y vuelven las unidades | `estadoReserva.ts`, `TablaReservas` ×2, el reloj de App | 12 |
| Elegir la sala de una lista de salas disponibles | `obtenerSalasLibres` en `disponibilidad.ts`, `FormularioReserva` | 12 |
| Agregar torres y salas con un botón (escalabilidad) | Configuración → SeccionTorres y SeccionSalas | 13 |

### 14.3 Un orden sugerido para la demo

1. **Login** con el encargado. Mostrar la dirección `/login` → `/inventario`.
2. **Inventario:** filtrar, pasar de página (paginación), abrir una ficha (`/inventario/3`), F5, "Atrás" (los filtros siguen).
3. **Ficha:** cambiar el estado de una unidad → sube el numerito de alertas → se ve en el historial.
4. **Configuración:** agregar una categoría, una torre y una sala → mostrar que aparecen en el inventario y en las reservas.
5. **Reservas:** elegir horario → la lista de salas muestra solo las libres → reservar → mostrar las dos tablas (activas e historial).
6. **Roles:** cerrar sesión, entrar como docente → no ve Incidencias, Alertas ni Configuración; escribir `/alertas` a mano → lo devuelve al inventario.
7. **Celular:** F12 → 375px.
8. **Código:** mostrar `ContextoUsuario.ts`, el `<Routes>` de App y `useFiltrosInventario.ts`.

> **Antes de la demo:** revisen que los datos de Firestore se vean ordenados (reservas con fechas futuras, textos sin pruebas raras) y que todos hayan hecho `git pull` de `main` + `npm install`.

### 14.4 Ejercicios (de fácil a difícil)

Hazlos en esta rama. Si algo se rompe, con `git checkout -- archivo` vuelve a como estaba.

1. Haz que debajo de tu nombre diga **"Jefe de laboratorio"**.
2. Pon tu nombre en **amarillo** en la barra azul.
3. Cambia "No registrado" por **"Sin dato"** en la ficha.
4. Haz que la barra azul sea **verde**, cambiando una sola línea.
5. Haz que el **docente** también vea la página de Alertas.
6. Muestra **12** recursos por página en vez de 9.
7. Haz que la reserva "En curso" diga **"Ahora"**.
8. En [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx), borra el `key={recurso.id}`. ¿Qué aviso sale en la consola (F12)? Después ponlo de nuevo.
9. Saca a `MenuNavegacion` de adentro del `<ContextoUsuario.Provider>` en App.tsx (ponlo justo antes). ¿Qué error sale? Después déjalo como estaba.
10. Agrega una página **"Reportes"** con su dirección `/reportes` (receta 9.13).

<details>
<summary><strong>Ver soluciones</strong></summary>

1. [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), en `nombreDelRol`: `return 'Jefe de laboratorio';`.
2. [MenuNavegacion.css](../src/components/MenuNavegacion.css), en `.app-header-usuario-nombre`, agrega `color: #fde047;`.
3. [utils/inventario.ts](../src/utils/inventario.ts), en `textoCampoOpcional`: `return 'Sin dato';`.
4. [global.css](../src/styles/global.css): `--color-principal: #15803d;`. Ojo: también cambian los botones, la paginación y los títulos, porque usan la misma variable.
5. [permisos.ts](../src/utils/permisos.ts), en `puedeVerPagina`: cambia `if (pagina === 'incidencias' || pagina === 'alertas')` por `if (pagina === 'incidencias')`. Fíjate que **también** funciona escribiendo `/alertas` a mano, porque el guardia `paginaSiPuede` pregunta a la misma función.
6. [utils/paginacion.ts](../src/utils/paginacion.ts): `RECURSOS_POR_PAGINA = 12`.
7. [utils/estadoReserva.ts](../src/utils/estadoReserva.ts), en `textoEstadoReserva`: `return 'Ahora';`.
8. Sale `Each child in a list should have a unique "key" prop`. React necesita la key para saber qué tarjeta es cuál.
9. Sale `useUsuario() solo se puede usar con una sesión iniciada.` El parlante solo llega a los componentes que están **adentro** del Provider.
10. Sigue la receta 9.13 paso por paso.

</details>

### 14.5 Preguntas que les pueden hacer (con respuestas cortas)

**React y TypeScript**

| Pregunta | Respuesta |
|---|---|
| ¿Qué es un componente? | Una función que devuelve un pedazo de pantalla (JSX). Su nombre va con mayúscula. |
| ¿Diferencia entre props y state? | Las **props** las recibe el componente de su papá y no las cambia. El **state** (useState) es su memoria propia, y al cambiarlo React redibuja. |
| ¿Cómo tiparon las props? | Con una `interface Props...` en cada componente. Si el papá no pasa una prop obligatoria, o pasa una del tipo equivocado, TypeScript lo marca en rojo. |
| ¿Para qué sirve el `[]` de useEffect? | Dice cuándo repetirlo. Vacío = una sola vez, al aparecer el componente. |
| ¿Qué devuelve un useEffect? | La "limpieza": lo que se hace cuando el componente desaparece (dejar de escuchar la sesión, apagar el `setInterval`). |
| ¿Qué es TypeScript? | JavaScript con tipos: avisa errores antes de ejecutar. |

**React Router**

| Pregunta | Respuesta |
|---|---|
| ¿Para qué usaron React Router? | Para que cada página tenga su dirección: se puede recargar, usar "Atrás" y compartir el link de una ficha. |
| ¿Qué es una ruta anidada? | Una ruta dentro de otra: `/inventario/3` y `/inventario/nuevo` están dentro de `/inventario`. Por eso los filtros no se pierden al abrir una ficha. |
| ¿Cómo leen el id de la ficha? | Con `useParams()`, de la ruta `:idRecurso`. Viene como texto y lo pasamos a número con `Number()`. |
| ¿Cómo protegen las rutas por rol? | Con `paginaSiPuede` en App: si el rol no puede ver la página, devuelve `<Navigate to="/inventario" replace />`. |
| ¿NavLink o Link? | NavLink, porque sabe si es la página actual (`isActive`) y así pintamos el botón del menú. |

**useContext y hooks**

| Pregunta | Respuesta |
|---|---|
| ¿Para qué usaron useContext? | Para compartir el usuario conectado sin pasarlo por props de mano en mano (paso 6). |
| ¿Qué es un hook personalizado? | Una función nuestra que empieza con `use` y usa otros hooks. Tenemos `useUsuario` y `useFiltrosInventario`. |
| ¿Por qué `useUsuario` lanza un error? | Si alguien lo usa donde no hay sesión, es un error de programación: mejor que avise al tiro con un mensaje claro. |
| ¿Dónde vive la memoria de `useFiltrosInventario`? | En el componente que lo llama (PaginaInventario). El hook solo ordena los useState. |

**Datos y Firebase**

| Pregunta | Respuesta |
|---|---|
| ¿Dónde se guardan los datos? | En Firestore (la base de datos de Firebase), en 7 colecciones. Al entrar se copian a memoria para que la app sea rápida. |
| ¿Qué pasa si se corta internet al guardar? | Firestore falla, la copia en memoria no se toca, y el formulario muestra un error. |
| ¿Cómo muestran la carga? | CargadorDatos muestra "Cargando..." mientras descarga, y si falla, un error con "Reintentar". |
| ¿Cómo evitan que se pierda el historial? | El código no tiene funciones para borrarlo, y las reglas de Firestore lo prohíben en el servidor (RNF-06). |
| ¿Qué hace `writeBatch`? | Junta varias escrituras y Firestore guarda todas o ninguna. Así nunca queda un cambio sin su línea en el historial. |
| ¿Cómo se calculan las alertas? | No se guardan: se recalculan cada vez revisando los recursos (dañados, en mantención, bajo el stock mínimo). |

**Los pedidos del profesor**

| Pregunta | Respuesta |
|---|---|
| ¿Cómo hicieron la paginación? | El hook filtra la lista, `calcularTotalPaginas` dice cuántas páginas hay y `slice` corta los 9 de la página actual. |
| ¿Cómo sabe la app que una reserva terminó? | Compara la fecha y hora de término con el reloj. No se guarda: se calcula. Un `setInterval` en App redibuja cada minuto. |
| ¿Cómo vuelven las unidades al inventario? | Las unidades "en reserva ahora" se calculan solo con reservas en curso. Cuando termina, dejan de contar. Nadie cambia Firestore. |
| ¿Cómo saben qué salas están libres? | `salaEstaLibre` revisa si otro docente tiene esa sala en un horario que se cruza. El menú muestra solo las libres, y se revisa de nuevo al guardar. |
| ¿Cómo agregan categorías sin programar? | Se guardan en Firestore (colección `categorias`) y todos los componentes le piden la lista al servicio. El encargado las agrega en Configuración. |
| ¿Por qué no se pueden borrar categorías o salas? | Porque recursos o reservas podrían estar usándolas. Las reglas de Firestore solo permiten leer y crear. |

**Diseño**

| Pregunta | Respuesta |
|---|---|
| ¿Cómo se ve bien en celular? | Con `@media` (reglas solo para pantallas chicas), grids que se acomodan solas (`auto-fill`) y botones de 44px para el dedo. |
| ¿Cómo deciden qué ve cada rol? | Con las funciones de `utils/permisos.ts`. El menú esconde los enlaces, las páginas esconden botones, y las rutas protegidas bloquean la dirección escrita a mano. |

---

## Glosario

| Palabra | Significa |
|---|---|
| **async / await** | Marca una función que se demora / espera su resultado (la pizza). |
| **BrowserRouter** | El componente de React Router que conecta la app con la dirección del navegador. |
| **Callback** | Una función que le pasas a otra para que la llame después (ej: `onCambiarPagina`). |
| **Colección / documento** | En Firestore: una carpeta / una hoja dentro de la carpeta. |
| **Componente** | Función que devuelve un pedazo de pantalla. |
| **Contexto (Context)** | Un "parlante" para compartir un dato con muchos componentes (ver useContext). |
| **Escalabilidad** | Que la app pueda crecer (más categorías, torres, salas) sin reprogramarla. |
| **Evento** | Algo que pasa: un clic, escribir, enviar un formulario. |
| **Formulario controlado** | Cada cajita guarda su valor en un useState. |
| **Fragment `<>`** | Caja invisible para devolver varias cosas juntas. |
| **Hook** | Herramienta especial de React que empieza con `use` (useState, useEffect, useContext...). |
| **Hook personalizado** | Un hook hecho por nosotros: `useUsuario`, `useFiltrosInventario`. |
| **HMR** | Los cambios en vivo al guardar un archivo. |
| **Interface** | La lista de datos que un objeto tiene que tener. |
| **JSX** | El "HTML dentro de TypeScript" que devuelven los componentes. |
| **key** | Nombre único de cada elemento de una lista; si cambia, React recrea el componente. |
| **NavLink** | Enlace de React Router que sabe si es la página actual. |
| **Paginación** | Mostrar una lista larga de a pedazos (de 9 en 9), con botones para cambiar de página. |
| **Props** | Datos que un componente recibe de su papá. |
| **Prop drilling** | Pasar una prop por varios niveles solo para que llegue abajo (lo que evitamos con useContext). |
| **Promise** | Promesa de un resultado que llega después. |
| **Provider** | La parte del contexto que "anuncia" el dato: `<ContextoUsuario.Provider value={...}>`. |
| **Render / redibujar** | Que React vuelva a ejecutar el componente y actualice la pantalla. |
| **Ruta (Route)** | Una dirección de la app y lo que se dibuja en ella. |
| **Ruta anidada** | Una ruta dentro de otra (`/inventario/3` dentro de `/inventario`). |
| **Ruta protegida** | Una ruta que revisa el rol antes de mostrar la página. |
| **Semilla (seed)** | Los datos de `src/data/` que se suben a Firestore si una colección está vacía. |
| **Servicio** | Archivo que guarda y entrega los datos (el bodeguero). |
| **setInterval** | Repetir una función cada cierto tiempo (el reloj de App, cada minuto). |
| **SPA** | *Single Page Application*: una app que cambia de página sin recargar el navegador. |
| **Spread `...`** | Copiar todo lo de un objeto o lista: `{ ...datos }`. |
| **State** | La memoria de un componente (useState). |
| **Tipo unión** | `'a' \| 'b'`: solo puede ser uno de esos valores. |
| **Ternario** | `condicion ? siVerdad : siMentira`. |
| **URL / dirección** | Lo que se ve en la barra del navegador (`localhost:5173/reservas`). |
| **useContext** | Hook para escuchar un contexto (el parlante). Lo usamos dentro de `useUsuario()`. |
| **useNavigate** | Hook de React Router para cambiar de dirección desde el código. |
| **useParams** | Hook de React Router para leer la parte que cambia de la dirección (`:idRecurso`). |
