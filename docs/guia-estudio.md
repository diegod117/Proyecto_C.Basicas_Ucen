# Guía de estudio — Sistema de Inventario C. Básicas

Esta guía explica **paso a paso** cómo funciona la app, desde cero.
Está pensada para alguien que recién empieza con TypeScript, React y CSS.

**Cómo usarla:**

1. Lee los pasos **en orden**: cada uno usa lo que aprendiste en el anterior.
2. Cuando un paso diga "abre tal archivo", ábrelo en VS Code y lee sus comentarios. En esta rama (`estudio-johann`) **todos** los archivos tienen comentarios explicados con palabras simples.
3. Prueba cada cosa en el navegador. Cambiar algo y ver qué pasa es la mejor forma de aprender.
4. Al final de cada paso hay preguntas para revisar si entendiste.

| Paso | Tema |
|---|---|
| [0](#paso-0--prender-la-app) | Prender la app |
| [1](#paso-1--el-mapa-de-la-app) | El mapa de la app (carpetas y quién llama a quién) |
| [2](#paso-2--typescript-los-moldes-de-los-datos) | TypeScript: los moldes de los datos |
| [3](#paso-3--react-componentes-jsx-y-props) | React: componentes, JSX y props |
| [4](#paso-4--usestate-la-memoria-de-un-componente) | useState: la memoria de un componente |
| [5](#paso-5--useeffect-y-asyncawait-hacer-cosas-que-se-demoran) | useEffect y async/await |
| [6](#paso-6--usecontext-y-por-qué-no-lo-usamos) | useContext (y por qué no lo usamos) |
| [7](#paso-7--css-cómo-se-ve-todo) | CSS: cómo se ve todo |
| [8](#paso-8--los-datos-firebase-servicios-reservas-y-alertas) | Los datos: Firebase, servicios, reservas y alertas |
| [9](#paso-9--recetas-cómo-cambiar-cosas) | **Recetas: cómo cambiar cosas** (tu nombre, el rol, la ficha...) |
| [10](#paso-10--ejercicios-y-preguntas-para-la-presentación) | Ejercicios y preguntas para la presentación |
| [Glosario](#glosario) | Palabras raras explicadas |

---

## Paso 0 — Prender la app

En la terminal de VS Code, dentro de la carpeta del proyecto:

```bash
npm install     # solo la primera vez: descarga las librerías (React, Firebase...)
npm run dev     # prende la app en modo desarrollo
```

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
| `src/types/` | Los **moldes** de los datos (cómo es un Recurso, una Reserva...) | Las recetas escritas: dicen qué ingredientes lleva cada plato |
| `src/data/` | Datos de prueba inventados | Los ingredientes de muestra para la primera vez |
| `src/services/` | Los que **guardan y entregan** los datos (hablan con Firebase) | Los bodegueros |
| `src/utils/` | **Herramientas** pequeñas (filtrar, validar, calcular) | Los cuchillos y las ollas |
| `src/components/` | **Piezas** de pantalla (una tarjeta, un formulario, una tabla) | Los platos, los vasos, los cubiertos |
| `src/pages/` | **Pantallas completas** (Inventario, Reservas...) | Las mesas ya armadas |
| `src/styles/` | Los estilos de toda la app (colores, letra) | La decoración del local |
| `src/App.tsx` | El componente principal | El jefe de cocina |
| `src/main.tsx` | La puerta de entrada | La puerta del restaurante |

Una regla importante: **las páginas usan componentes, pero los componentes nunca importan páginas.** El papá conoce al hijo, pero el hijo no conoce al papá.

### Quién llama a quién

```
index.html                     una hoja en blanco con un <div id="root">
  └─ main.tsx                  "React, dibuja App aquí adentro"
       └─ App.tsx              ¿hay alguien conectado?
            ├─ PaginaLogin     (si NO hay nadie)
            └─ CargadorDatos   (si SÍ hay alguien) espera los datos de Firebase
                 ├─ MenuNavegacion   la barra azul + el menú gris
                 └─ una página:
                      ├─ PaginaInventario
                      │    ├─ EncabezadoInventario, FiltrosInventario, ContadorInventario
                      │    ├─ GrillaRecursos → TarjetaRecurso (una por recurso)
                      │    ├─ FichaRecurso
                      │    │    ├─ TablaUnidadesEstado, AvisoUbicacion, TablaHistorial
                      │    │    └─ FormularioCambioEstado, FormularioReponerStock
                      │    └─ FormularioNuevoRecurso
                      │         └─ CamposUbicacionRecurso, CamposDetalleRecurso
                      ├─ PaginaReservas → FormularioReserva, TablaReservas
                      ├─ PaginaIncidencias → FormularioIncidencia, TablaIncidencias
                      └─ PaginaAlertas → TarjetaAlerta (una por alerta)
```

**Para leer ahora:** [main.tsx](../src/main.tsx) y [App.tsx](../src/App.tsx). No te preocupes si no entiendes todo: en los próximos pasos vas a volver a ellos.

**Pregunta:** si quisieras cambiar algo de cómo se ve UNA tarjeta del inventario, ¿en qué carpeta buscarías? *(Respuesta: `components/`, en `TarjetaRecurso.tsx` y `TarjetaRecurso.css`.)*

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

### 2.4 `interface`: la lista de datos que un objeto tiene que tener

```ts
export interface Usuario {
  correo: string;
  nombre: string;
  rol: RolUsuario;
}
```

Es como la ficha de un alumno: si falta un dato, la ficha está incompleta y TypeScript reclama.

- **El `?` significa opcional:** `marca?: string` quiere decir que la marca puede no venir.
- **Objeto dentro de objeto:** `ubicacion: Ubicacion` es una caja dentro de otra caja.

### 2.5 Funciones con tipos

```ts
//                  recibe un texto ─┐        ┌─ devuelve un texto
function textoEstado(estado: EstadoRecurso): string { ... }
```

`: void` significa que la función no devuelve nada. `Usuario | undefined` significa que devuelve un Usuario o nada.

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
| `` `Hola ${nombre}` `` | texto con variables adentro | [disponibilidad.ts](../src/utils/disponibilidad.ts) |
| `{ ...objeto, campo: 1 }` | "copia el objeto y cambia un campo" | [FormularioNuevoRecurso.tsx](../src/components/FormularioNuevoRecurso.tsx) |
| `algo as Recurso` | "confía en mí: esto es un Recurso" | [recursosService.ts](../src/services/recursosService.ts) |
| `Omit<Reserva, 'id'>` | "una Reserva, pero sin el dato id" | [reservasService.ts](../src/services/reservasService.ts) |

**Para leer ahora:** todos los archivos de [src/types/](../src/types/) (son cortos) y [utils/inventario.ts](../src/utils/inventario.ts).

**Preguntas:**
- ¿Qué pasa si en `data/recursos.ts` escribes `estado: 'roto'`? *(TypeScript lo marca en rojo, porque `'roto'` no está en `EstadoRecurso`.)*
- ¿Qué significa el `?` en `stockMinimo?: number`? *(Que es opcional: solo lo tienen los insumos y reactivos.)*

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

Las **props** son los datos que un componente **recibe de su papá**. Es como cuando tu mamá te manda al almacén con una lista: tú no decides qué comprar, usas la lista. La `interface Props...` es esa lista.

El ejemplo más importante está en [App.tsx](../src/App.tsx) y [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx):

```tsx
// App (el papá) le pasa al menú (el hijo):
<MenuNavegacion
  usuario={usuarioActual}           // un DATO: la persona conectada
  onCambiarPagina={cambiarPagina}   // una FUNCIÓN: para que el menú avise qué botón se apretó
  ...
/>

// Y el menú lo usa así:
<span>{props.usuario.nombre}</span>
<button onClick={() => props.onCambiarPagina('reservas')}>Reservas</button>
```

### 3.3 El patrón más importante de React

> **Los datos BAJAN por props. Los avisos SUBEN llamando a funciones.**

```
        App  (guarda paginaActual)
         │  ▲
 baja:   │  │  sube: "¡apretaron Reservas!"
 usuario │  │  props.onCambiarPagina('reservas')
         ▼  │
   MenuNavegacion
```

El menú no cambia la página él solo: avisa, y App decide. Lo vas a ver en **toda** la app, por ejemplo en `FiltrosInventario`, `TarjetaRecurso` y los formularios.

### 3.4 Dibujar algo solo a veces

```tsx
{mostrarBotonAgregar && <button>+ Agregar recurso</button>}   // solo si es true
{lista.length === 0 ? <p>Vacío</p> : <Tabla />}               // uno u otro
if (problemas.length === 0) { return null; }                  // null = no dibujes nada
```

### 3.5 Dibujar listas: `.map()` y `key`

```tsx
{props.recursos.map((recurso) => (
  <TarjetaRecurso key={recurso.id} recurso={recurso} />
))}
```

`.map()` es una fábrica: entran 10 recursos y salen 10 tarjetas. La **`key`** es el "número de lista" de cada elemento, para que React sepa cuál es cuál cuando algo cambia. Ver [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx).

### 3.6 Otras dos cosas

- **Fragment `<> ... </>`:** una caja invisible para devolver dos cosas juntas. Ver [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx).
- **`children`:** lo que se escribe entre la etiqueta que abre y la que cierra, como `<CargadorDatos> ...esto... </CargadorDatos>`. Ver [CargadorDatos.tsx](../src/components/CargadorDatos.tsx).

**Para leer ahora:** [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), [TarjetaRecurso.tsx](../src/components/TarjetaRecurso.tsx), [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx) y [FichaRecurso.tsx](../src/components/FichaRecurso.tsx).

**Preguntas:**
- ¿Por qué en `onClick` del menú se escribe `() => props.onCambiarPagina('reservas')` y no `props.onCambiarPagina('reservas')`? *(Sin la flecha, la función se ejecutaría apenas se dibuja el botón, sin hacer clic.)*
- ¿De dónde saca el menú tu nombre? *(De `props.usuario`, que le pasa App.)*

---

## Paso 4 — useState: la memoria de un componente

### 4.1 La pizarra mágica

Un componente es una función: cada vez que se ejecuta, empieza de cero y se olvida de todo. **`useState` le da memoria.**

```tsx
const [paginaActual, setPaginaActual] = useState<Pagina>('inventario');
//      └ lo que hay ahora  └ la única forma de cambiarlo   └ el valor inicial
```

Imagina una **pizarra mágica**. Cuando escribes algo nuevo con `setPaginaActual('reservas')`, React **vuelve a dibujar** el componente con el valor nuevo. Todos los que miran la pizarra ven el cambio al tiro.

**Reglas de oro:**

1. **Nunca** cambies la pizarra directo (`paginaActual = 'reservas'`): React no se entera. Siempre usa la función `set...`.
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

Abre [FormularioCambioEstado.tsx](../src/components/FormularioCambioEstado.tsx). Todos los formularios siguen los mismos pasos:

1. `preventDefault()`.
2. **Revisar** con una herramienta de `utils/` que devuelve `''` si todo está bien.
3. Si hay error, mostrarlo y cortar con `return`.
4. `setGuardando(true)`, para apagar el botón.
5. **Guardar** con `await` al servicio.
6. Mostrar el mensaje verde o rojo, y avisar hacia arriba con `props.on...()`.

### 4.5 El truco de la `key` para "reiniciar" un componente

Si a un componente le cambias la `key`, React lo **tira a la basura y crea uno nuevo** desde cero. Se usa en:

- [App.tsx](../src/App.tsx): `key={vecesMenuInventario}`, para que el botón "Inventario" del menú vuelva al listado.
- [PaginaIncidencias.tsx](../src/pages/PaginaIncidencias.tsx): `key={contador}`, para que la tabla muestre la incidencia nueva.

**Para leer ahora:** [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx), [FormularioCambioEstado.tsx](../src/components/FormularioCambioEstado.tsx), [PaginaInventario.tsx](../src/pages/PaginaInventario.tsx) y [FormularioNuevoRecurso.tsx](../src/components/FormularioNuevoRecurso.tsx) (que usa un useState con un objeto).

**Preguntas:**
- ¿Dónde se guardan los filtros del inventario: en `FiltrosInventario` o en `PaginaInventario`? *(En `PaginaInventario`. `FiltrosInventario` no tiene memoria: solo muestra y avisa.)*
- ¿Por qué el campo "Stock mínimo" aparece solo cuando eliges "Insumo"? *(Al elegir, cambia el useState `datos`, React redibuja, y `usaStockMinimo(datos)` ahora da `true`.)*

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

**Regla:** la función de `useEffect` no puede ser `async`. El truco es crear una función async adentro y llamarla, como en [CargadorDatos.tsx](../src/components/CargadorDatos.tsx).

**Para leer ahora:** [App.tsx](../src/App.tsx) (el useEffect del timbre), [CargadorDatos.tsx](../src/components/CargadorDatos.tsx), [authService.ts](../src/services/authService.ts) y [cargaDatos.ts](../src/services/cargaDatos.ts).

**Pregunta:** ¿por qué `CargadorDatos` tiene `[intentos]` y no `[]`? *(Para que el botón "Reintentar" vuelva a descargar: al sumar 1 a `intentos`, el useEffect se repite.)*

---

## Paso 6 — useContext (y por qué no lo usamos)

> **Importante:** esta app **no usa `useContext`** en ningún archivo. Las reglas del grupo ([CLAUDE.md](../CLAUDE.md)) lo prohíben para mantener el código simple. Igual conviene entenderlo, porque te lo pueden preguntar.

### 6.1 El problema que resuelve: pasar el recado de mano en mano

En nuestra app, el **usuario conectado** vive en `App.tsx`, pero lo necesita el formulario de cambio de estado, que está **cuatro niveles más abajo**. Hoy viaja así, como un recado que pasa de mano en mano:

```
App               usuario={usuarioActual}
 └ PaginaInventario     usuario={props.usuario}
    └ FichaRecurso          usuario={props.usuario}
       └ FormularioCambioEstado   usa props.usuario.nombre
```

`PaginaInventario` y `FichaRecurso` **no usan** el usuario para nada propio: solo lo pasan hacia abajo. A esto se le llama **"prop drilling"** (taladrar con props).

### 6.2 Lo que hace useContext: un parlante

`useContext` es como poner un **parlante** en la sala: App "anuncia" el usuario una vez, y **cualquier** componente de abajo lo escucha directo, sin que los del medio tengan que pasarlo.

**Solo como ejemplo (este código NO está en la app):**

```tsx
// 1. Crear el "parlante"
const ContextoUsuario = createContext<Usuario | null>(null);

// 2. En App: anunciar el usuario a todos los de adentro
<ContextoUsuario.Provider value={usuarioActual}>
  <PaginaInventario />
</ContextoUsuario.Provider>

// 3. En cualquier componente de abajo: escucharlo directo
const usuario = useContext(ContextoUsuario);
```

### 6.3 ¿Por qué no lo usamos?

- **Es más fácil de explicar:** con props, mirando un componente sabes exactamente qué recibe y de quién.
- **La app es chica:** el recado pasa por 3 o 4 manos como máximo, y eso es manejable.
- **Las reglas del grupo:** CLAUDE.md pide usar solo `useState`, `useEffect`, props y eventos.

**Respuesta para la presentación:** *"No usamos useContext porque la app es pequeña y preferimos pasar los datos por props: así cada componente muestra claramente qué datos recibe. Si la app creciera y el usuario se necesitara en muchos niveles, useContext evitaría pasarlo de mano en mano."*

---

## Paso 7 — CSS: cómo se ve todo

### 7.1 Cómo se lee una regla

```css
.boton-principal {                    /* SELECTOR: a quién */
  background-color: var(--color-principal);   /* PROPIEDAD: valor; */
}
```

Cada componente tiene su `.css` al lado, y se activa con `import './Archivo.css'`.

> ⚠️ **Ojo:** en CSS normal, **todas las clases son globales** (de toda la app). Por ejemplo, `.mensaje-error` existe en [FormularioReserva.css](../src/components/FormularioReserva.css) **y** en [FormularioIncidencia.css](../src/components/FormularioIncidencia.css), y las dos reglas se mezclan. Por eso conviene darles nombres únicos a las clases.

### 7.2 Selectores (a quién se le aplica)

| Selector | Significa | Ejemplo en la app |
|---|---|---|
| `.clase` | lo que tenga `className="clase"` | `.tarjeta-recurso` |
| `body`, `h1` | esa etiqueta HTML | [global.css](../src/styles/global.css) |
| `.a .b` (con espacio) | `.b` que está **dentro** de `.a` | `.ficha-datos dt` |
| `.a.b` (sin espacio) | algo que tiene **las dos** clases | `.boton-filtro-alerta.activo` |
| `:hover` | con el mouse encima | `.tarjeta-recurso:hover` |
| `:focus` | cuando estás escribiendo en la cajita | `.login-input:focus` |
| `:disabled` | botón apagado | `.boton-confirmar:disabled` |
| `::before` | un elemento "fantasma" antes del contenido | la franja azul del login |
| `[type="checkbox"]` | según un atributo | [FormularioIncidencia.css](../src/components/FormularioIncidencia.css) |
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

Si cambias el valor en `:root`, cambia en toda la app.

### 7.6 Flex: acomodar en una fila (o una columna)

```css
display: flex;                    /* mis hijos van en FILA */
flex-direction: column;           /* ...o en COLUMNA */
justify-content: space-between;   /* uno a cada extremo */
align-items: center;              /* centrados de arriba a abajo */
gap: 16px;                        /* espacio entre hijos */
flex-wrap: wrap;                  /* si no caben, bajan a otra línea */
```

Ver la barra azul en [MenuNavegacion.css](../src/components/MenuNavegacion.css).

### 7.7 Grid: acomodar en una cuadrícula

```css
display: grid;
grid-template-columns: 2fr 1fr;   /* 2 columnas: la 1ª el doble de ancha */
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* ¡tantas como quepan! */
```

El segundo es el truco de las tarjetas del inventario: en el computador caben 4 por fila y en el celular 1, sin escribir nada más. Ver [GrillaRecursos.css](../src/components/GrillaRecursos.css) y [FichaRecurso.css](../src/components/FichaRecurso.css).

### 7.8 Position: pegar cosas a la pantalla

| Valor | Qué hace | Dónde |
|---|---|---|
| `fixed` | **pegado** a la pantalla, como un sticker en el vidrio | la barra azul y el menú gris |
| `sticky` | se mueve normal hasta cierta altura y ahí **se pega**, como un imán | los formularios de la ficha |
| `z-index` | quién va encima de quién (más alto = más arriba) | la barra azul (100) |

Ojo: lo que es `fixed` **no ocupa lugar** en la página. Por eso `.app-contenido` tiene un `margin-top` para no quedar tapado.

### 7.9 @media: reglas solo para celular

```css
@media (max-width: 768px) {   /* solo si la pantalla mide 768px o menos */
  .grupo-campos { flex-direction: column; }
}
```

**Para probarlo:** F12 → el ícono del celular (arriba a la izquierda de DevTools) → elige 375px.

### 7.10 El mejor truco para aprender CSS

**F12 → Elements**, y haz clic derecho sobre algo de la página → **Inspeccionar**. A la derecha ves todas sus reglas CSS, y puedes **cambiar los valores en vivo** para probar (no se guarda nada). Cuando te guste cómo queda, copia el valor al archivo `.css`.

**Para leer ahora:** [global.css](../src/styles/global.css), [MenuNavegacion.css](../src/components/MenuNavegacion.css), [TarjetaRecurso.css](../src/components/TarjetaRecurso.css) y [FichaRecurso.css](../src/components/FichaRecurso.css).

---

## Paso 8 — Los datos: Firebase, servicios, reservas y alertas

### 8.1 Iniciar sesión: el guardia y la lista de invitados

1. **Firebase Authentication** es el **guardia**: revisa el correo y la contraseña. Las contraseñas viven en Firebase (Consola → Authentication → Users).
2. **[data/usuarios.ts](../src/data/usuarios.ts)** es la **lista de invitados**: dice el nombre y el rol de cada correo.

Un correo tiene que estar en **los dos** lugares. Ver [authService.ts](../src/services/authService.ts).

### 8.2 Firestore: el cuaderno en la nube

Firestore guarda los datos en 4 **colecciones** (carpetas): `recursos`, `historial`, `incidencias` y `reservas`. Cada recurso es un **documento** (una hoja) cuyo nombre es su id: `recursos/7`.

### 8.3 La copia en memoria (la idea más importante)

Ir a internet es lento. Por eso:

1. Al iniciar sesión, [CargadorDatos](../src/components/CargadorDatos.tsx) trae **todo** de Firestore **una vez** y lo guarda en una lista dentro de cada servicio.
2. Las pantallas **leen esa copia**, al tiro, sin esperar (`obtenerRecursos()`).
3. Al **cambiar** algo, primero se guarda en Firestore, y **solo si Firestore dice "ok"** se cambia también la copia.

> Es como tener una fotocopia del cuaderno en la mochila: lees la fotocopia (rápido), pero cuando escribes, escribes primero en el original y después en la fotocopia.

**La semilla:** si una colección está vacía (la primera vez, o si alguien la borró en la consola), el servicio la llena con los datos de `src/data/`.

### 8.4 Cómo viaja un cambio de estado (de principio a fin)

```
1. El encargado aprieta "Guardar cambio"   → FormularioCambioEstado.guardarCambio()
2. Revisa los datos                        → utils/cambioEstado.validarCambioEstado()
3. Le pide al bodeguero                    → recursosService.cambiarEstadoRecurso()
4. Arma la línea del diario                → historialService.crearRegistroCambioEstado()
5. Guarda las DOS cosas juntas (un lote)   → writeBatch: cantidades + historial (o las dos o ninguna)
6. Firestore dice "ok" → cambia la copia en memoria
7. El formulario avisa hacia arriba        → props.onEstadoCambiado()
       → FichaRecurso → PaginaInventario → App.registrarCambioInventario()
8. App suma 1 a cambiosInventario → React redibuja todo
       → el numerito rojo de alertas se recalcula, la ficha muestra los números nuevos
```

### 8.5 Las reglas de Firestore (el guardia del cuaderno)

[docs/firestore.rules](firestore.rules) dice qué se puede hacer **en el servidor**, aunque alguien modifique la app:

- **historial:** solo se agregan líneas; **nunca** se borran ni se cambian (RNF-06).
- **recursos:** se crean, y después solo se cambian sus cantidades.
- **incidencias:** se crean, y después solo cambia su estado.
- **reservas:** se crean y se borran (cancelar una reserva es borrarla).

### 8.6 Reservas: ¿cuántas quedan libres?

En [disponibilidad.ts](../src/utils/disponibilidad.ts): **libres = disponibles − las reservadas que chocan con ese horario**. Dos reservas chocan si son el mismo día y una empieza antes de que la otra termine.

### 8.7 Alertas (las "notificaciones")

Las alertas **no se guardan en ningún lado**: [alertas.ts](../src/utils/alertas.ts) las **calcula** cada vez, revisando todos los recursos:

- unidades dañadas → **reparación**
- unidades en mantención → **mantención**
- un insumo con `disponible <= stockMinimo` → **reposición**

Por eso nunca quedan viejas: si reparas algo, su alerta desaparece sola. El numerito rojo del menú es `generarAlertas().length`, calculado en [App.tsx](../src/App.tsx).

**Para leer ahora:** [recursosService.ts](../src/services/recursosService.ts), [historialService.ts](../src/services/historialService.ts), [alertas.ts](../src/utils/alertas.ts) y [disponibilidad.ts](../src/utils/disponibilidad.ts).

---

## Paso 9 — Recetas: cómo cambiar cosas

Después de cualquier cambio: guarda, mira el navegador, y antes de subirlo corre `npm run build` y `npm run lint`.

### 9.1 Cambiar el NOMBRE que sale arriba a la derecha

El nombre no está escrito en el menú: viene de la lista de usuarios.

1. Abre [src/data/usuarios.ts](../src/data/usuarios.ts).
2. Busca el bloque del correo con que entras (por ejemplo, `encargado@prueba.cl` en la línea 27, o tu cuenta en la línea 47).
3. Cambia el texto de `nombre: '...'`.
4. Guarda y recarga (F5).

El viaje del nombre es: `usuarios.ts` → `authService.buscarUsuarioPorCorreo` → `App` (useState `usuarioActual`) → prop `usuario` → `MenuNavegacion` → `{props.usuario.nombre}`.

> ⚠️ El nombre también se usa para otras cosas:
> - Queda guardado en las líneas **nuevas** del historial e incidencias. Las viejas mantienen el nombre anterior.
> - "Mis reservas" del docente compara el nombre de la reserva con el del usuario. Si le cambias el nombre al docente, sus reservas viejas dejan de aparecer en "Mis reservas".

### 9.2 Cambiar "Encargado de laboratorio" (el rol debajo de tu nombre)

1. Abre [src/components/MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), función `nombreDelRol` (línea 58).
2. Cambia **solo el texto de la derecha** del `return`:
   ```tsx
   if (rol === 'encargado') {
     return 'Jefe de laboratorio';   // ← antes decía 'Encargado de laboratorio'
   }
   ```
3. **No cambies** el `'encargado'` de la izquierda del `===`: ese es el valor interno del rol, y lo usa toda la app.

### 9.3 Cambiar el tamaño o color de tu nombre y rol

En [MenuNavegacion.css](../src/components/MenuNavegacion.css):

- `.app-header-usuario-nombre` (línea 68) es tu nombre.
- `.app-header-usuario-rol` (línea 74) es el rol.

```css
.app-header-usuario-nombre {
  font-size: 1rem;     /* más grande (antes 0.875rem) */
  color: #fde047;      /* amarillo */
}
```

En celulares de menos de 420px, el rol se esconde (`display: none`, cerca de la línea 255).

### 9.4 Cambiar el título de la app

Está en 4 lugares:

| Dónde se ve | Archivo |
|---|---|
| La barra azul | [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), línea 102 |
| El título del login | [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx), línea 99 |
| El subtítulo del login | [PaginaLogin.tsx](../src/pages/PaginaLogin.tsx), línea 102 |
| La pestaña del navegador | [index.html](../index.html), línea 12 |

### 9.5 Cambiar los colores de toda la app

[global.css](../src/styles/global.css), dentro de `:root` (línea 43 en adelante). Por ejemplo, cambia `--color-principal` y cambia el azul de la barra, los botones y los títulos, todo junto.

### 9.6 Agregar una persona nueva

1. **Consola de Firebase → Authentication → Users → Add user**: el correo y la contraseña.
2. En [usuarios.ts](../src/data/usuarios.ts), copia un bloque `{ correo, nombre, rol }`, pégalo y cambia los datos. El rol tiene que ser `'encargado'`, `'docente'` o `'departamento'`.

### 9.7 Cambiar un texto de la ficha (ej: "N° de serie" → "Número de serie")

[FichaRecurso.tsx](../src/components/FichaRecurso.tsx), línea 114: `<dt>N° de serie</dt>`. Cambia el texto entre `<dt>` y `</dt>`. Lo mismo para los subtítulos `<h3>`.

Si en vez de la ficha quieres que diga otra cosa cuando un dato falta (hoy dice "No registrado"), cámbialo en `textoCampoOpcional` de [utils/inventario.ts](../src/utils/inventario.ts).

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

### 9.9 Cambiar cómo se llama un estado o una categoría en pantalla

[utils/inventario.ts](../src/utils/inventario.ts): `textoEstado` (línea 47) y `textoCategoria` (línea 66). Por ejemplo, `return 'Dañado';` → `return 'Roto';`. Cambia en tarjetas, ficha, filtros e historial a la vez.

### 9.10 Cambiar quién puede hacer qué (permisos)

Todo está en [utils/permisos.ts](../src/utils/permisos.ts). Por ejemplo, para que el departamento también pueda reservar, en `puedeReservar` (línea 77):
```ts
if (rol === 'docente' || rol === 'encargado' || rol === 'departamento') {
```

### 9.11 Cambiar los textos de las alertas

[utils/alertas.ts](../src/utils/alertas.ts): ahí se arman los mensajes. Los dibujitos (🔧 ⚠️ 📦) están en [TarjetaAlerta.tsx](../src/components/TarjetaAlerta.tsx), y los colores en [TarjetaAlerta.css](../src/components/TarjetaAlerta.css).

### 9.12 Agregar una categoría nueva (ej: "herramienta")

1. [types/Recurso.ts](../src/types/Recurso.ts): agrega `| 'herramienta'` a `CategoriaRecurso`.
2. [utils/inventario.ts](../src/utils/inventario.ts): agrégala a `listaCategoriasRecurso`, y en `textoCategoria` agrega un `else if (categoria === 'herramienta') { return 'Herramienta'; }` **antes** del `else` final.

### 9.13 Agregar una página nueva (ej: "Reportes")

1. [types/Pagina.ts](../src/types/Pagina.ts): agrega `| 'reportes'`.
2. Crea `src/pages/PaginaReportes.tsx` y su `PaginaReportes.css` (copia la forma de [PaginaAlertas.tsx](../src/pages/PaginaAlertas.tsx)).
3. [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx): copia un bloque de botón y cambia `'alertas'` por `'reportes'`.
4. [App.tsx](../src/App.tsx), en `mostrarPaginaActual`: agrega `else if (paginaActual === 'reportes') { return <PaginaReportes />; }`.
5. Si no todos los roles la pueden ver: [permisos.ts](../src/utils/permisos.ts), `puedeVerPagina`.

---

## Paso 10 — Ejercicios y preguntas para la presentación

Hazlos en esta rama. Si algo se rompe, con `git checkout -- archivo` vuelve a como estaba.

### Ejercicios (de fácil a difícil)

1. Haz que debajo de tu nombre diga **"Jefe de laboratorio"**.
2. Pon tu nombre en **amarillo** en la barra azul.
3. Cambia "No registrado" por **"Sin dato"** en la ficha.
4. Haz que la barra azul sea **verde**, cambiando una sola línea.
5. Haz que el **docente** también vea la página de Alertas.
6. En [GrillaRecursos.tsx](../src/components/GrillaRecursos.tsx), borra el `key={recurso.id}`. ¿Qué aviso sale en la consola (F12)? Después ponlo de nuevo.
7. Haz que las tarjetas del inventario se levanten **8px** en vez de 4px al pasar el mouse.
8. Agrega el dato **"Fecha de compra"** a la ficha (receta 9.8).

<details>
<summary><strong>Ver soluciones</strong></summary>

1. [MenuNavegacion.tsx](../src/components/MenuNavegacion.tsx), en `nombreDelRol`: `return 'Jefe de laboratorio';`.
2. [MenuNavegacion.css](../src/components/MenuNavegacion.css), en `.app-header-usuario-nombre`, agrega `color: #fde047;`.
3. [utils/inventario.ts](../src/utils/inventario.ts), en `textoCampoOpcional`: `return 'Sin dato';`.
4. [global.css](../src/styles/global.css): `--color-principal: #15803d;`. Ojo: también cambian los botones y los títulos, porque usan la misma variable.
5. [permisos.ts](../src/utils/permisos.ts), en `puedeVerPagina`: cambia `if (pagina === 'incidencias' || pagina === 'alertas')` por `if (pagina === 'incidencias')`.
6. Sale `Each child in a list should have a unique "key" prop`. React necesita la key para saber qué tarjeta es cuál.
7. [TarjetaRecurso.css](../src/components/TarjetaRecurso.css), en `.tarjeta-recurso:hover`: `transform: translateY(-8px);`.
8. Sigue la receta 9.8 paso por paso.

</details>

### Preguntas que les pueden hacer (con respuestas cortas)

| Pregunta | Respuesta |
|---|---|
| ¿Qué es un componente? | Una función que devuelve un pedazo de pantalla (JSX). Su nombre va con mayúscula. |
| ¿Diferencia entre props y state? | Las **props** las recibe el componente de su papá y no las cambia. El **state** (useState) es su memoria propia, y al cambiarlo React redibuja. |
| ¿Para qué sirve el `[]` de useEffect? | Dice cuándo repetirlo. Vacío = una sola vez, al aparecer el componente. |
| ¿Por qué no usaron useContext? | La app es chica; con props se ve claro qué recibe cada componente (ver paso 6). |
| ¿Qué es TypeScript? | JavaScript con tipos: avisa errores antes de ejecutar. |
| ¿Dónde se guardan los datos? | En Firestore (la base de datos de Firebase). Al entrar se copian a memoria para que la app sea rápida. |
| ¿Qué pasa si se corta internet al guardar? | Firestore falla, la copia en memoria no se toca, y el formulario muestra un error. |
| ¿Cómo evitan que se pierda el historial? | El código no tiene funciones para borrarlo, y las reglas de Firestore lo prohíben en el servidor (RNF-06). |
| ¿Qué hace `writeBatch`? | Junta varias escrituras y Firestore guarda todas o ninguna. Así nunca queda un cambio sin su línea en el historial. |
| ¿Cómo se calculan las alertas? | No se guardan: se recalculan cada vez revisando los recursos (dañados, en mantención, bajo el stock mínimo). |
| ¿Cómo se ve bien en celular? | Con `@media` (reglas solo para pantallas chicas) y grids que se acomodan solas (`auto-fill`). |
| ¿Cómo deciden qué ve cada rol? | Con las funciones de `utils/permisos.ts`. Las pantallas preguntan "¿este rol puede...?" antes de mostrar botones. |

---

## Glosario

| Palabra | Significa |
|---|---|
| **async / await** | Marca una función que se demora / espera su resultado (la pizza). |
| **Callback** | Una función que le pasas a otra para que la llame después (ej: `onCambiarPagina`). |
| **Colección / documento** | En Firestore: una carpeta / una hoja dentro de la carpeta. |
| **Componente** | Función que devuelve un pedazo de pantalla. |
| **Evento** | Algo que pasa: un clic, escribir, enviar un formulario. |
| **Formulario controlado** | Cada cajita guarda su valor en un useState. |
| **Fragment `<>`** | Caja invisible para devolver varias cosas juntas. |
| **Hook** | Herramienta especial de React que empieza con `use` (useState, useEffect). |
| **HMR** | Los cambios en vivo al guardar un archivo. |
| **Interface** | La lista de datos que un objeto tiene que tener. |
| **JSX** | El "HTML dentro de TypeScript" que devuelven los componentes. |
| **key** | Nombre único de cada elemento de una lista; si cambia, React recrea el componente. |
| **Props** | Datos que un componente recibe de su papá. |
| **Prop drilling** | Pasar una prop por varios niveles solo para que llegue abajo. |
| **Promise** | Promesa de un resultado que llega después. |
| **Render / redibujar** | Que React vuelva a ejecutar el componente y actualice la pantalla. |
| **Servicio** | Archivo que guarda y entrega los datos (el bodeguero). |
| **Spread `...`** | Copiar todo lo de un objeto o lista: `{ ...datos }`. |
| **State** | La memoria de un componente (useState). |
| **Tipo unión** | `'a' \| 'b'`: solo puede ser uno de esos valores. |
| **Ternario** | `condicion ? siVerdad : siMentira`. |
| **useContext** | Hook para compartir un dato con muchos componentes sin pasarlo por props (no se usa en esta app). |
