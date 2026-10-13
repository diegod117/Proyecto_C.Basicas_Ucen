// MenuNavegacion.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Dibuja las dos partes del menú que siempre se ven:
//   1. La BARRA AZUL de arriba (header): el título de la app a la izquierda,
//      y a la derecha TU NOMBRE, TU ROL y el botón "Cerrar sesión".
//   2. El MENÚ GRIS de la izquierda (sidebar): los enlaces Inventario,
//      Reservas, Incidencias, Alertas y Configuración (solo los que tu rol
//      puede ver).
// Cada opción del menú es un ENLACE de React Router (NavLink) a su dirección
// (/inventario, /reservas...). Ver guía, paso 10.
// En celular, el menú gris se convierte en una fila de botones (ver MenuNavegacion.css).
//
// *** ¿CÓMO CAMBIO LO QUE DICE ARRIBA A LA DERECHA? (ver guía, paso 9) ***
//   - El NOMBRE ("Pedro Soto") NO está escrito aquí: viene de usuario.nombre,
//     que sacamos del parlante con useUsuario(). Ese nombre está en
//     src/data/usuarios.ts. Cámbialo allá.
//   - El ROL ("Encargado de laboratorio") SÍ está escrito aquí, en la
//     función nombreDelRol de más abajo. Cambia el texto entre comillas.
//   - El TÍTULO ("UCEN — Gestión de Inventario") está aquí, en el <h1>.
//   - Los COLORES y TAMAÑOS están en MenuNavegacion.css.
//
// En la guía: paso 3 (props y JSX), paso 6 (useUsuario) y paso 10 (NavLink).
// Cubre: navegación con React Router, inicio de sesión con roles
//        (sección 3.4 de requerimientos) y RNF-03.

// NavLink = un enlace de React Router que SABE si es la página actual.
import { NavLink } from 'react-router-dom';
import type { RolUsuario } from '../types/Usuario';
import { puedeVerPagina } from '../utils/permisos';
// useUsuario = nuestro hook para saber quién está conectado (guía, paso 6).
import { useUsuario } from '../context/ContextoUsuario';
// Importar el .css de este componente aplica sus estilos.
import './MenuNavegacion.css';

// ¿QUÉ SON LAS PROPS?
// Son los datos que un componente RECIBE de su "papá" (aquí el papá es App.tsx).
// Es como cuando tu mamá te manda al almacén con una lista: tú (el hijo)
// no decides qué comprar, usas lo que te dieron en la lista.
// Esta interface es esa "lista": qué datos llegan y de qué tipo es cada uno.
// Si App se olvida de pasar uno obligatorio, TypeScript lo marca en rojo.
//
// Antes esta lista era más larga (paginaActual, onCambiarPagina, usuario).
// Ahora:
//   - la persona conectada la escuchamos del parlante con useUsuario(),
//   - y qué página se está mirando lo sabe la dirección (URL): los NavLink
//     se dan cuenta solos.
interface PropsMenuNavegacion {
  // Cuántas alertas hay, para el numerito rojo (HU-05).
  // El "?" = opcional: si no llega, no se dibuja el numerito.
  cantidadAlertas?: number;
  // Una FUNCIÓN de App que cierra la sesión. "() => void" = no recibe nada
  // y no devuelve nada.
  onCerrarSesion: () => void;
}

// nombreDelRol
// Recibe: un rol "feo" ('encargado', 'docente' o 'departamento').
// Devuelve: el texto bonito que se ve en la barra azul, debajo de tu nombre.
// *** AQUÍ SE CAMBIA "Encargado de laboratorio" ***
// Ejemplo: si quieres que diga "Jefe de laboratorio", cambia SOLO el texto
// entre comillas de la primera línea con return. No cambies 'encargado'
// (el de la izquierda del ===), porque ese es el valor interno del rol.
function nombreDelRol(rol: RolUsuario): string {
  if (rol === 'encargado') {
    return 'Encargado de laboratorio';
  } else if (rol === 'docente') {
    return 'Docente';
  } else {
    return 'Departamento';
  }
}

// obtenerClaseEnlace
// Recibe: un objeto que nos entrega NavLink, con un dato "isActive":
//   true si la dirección actual es la de ese enlace, false si no.
// Devuelve: la clase CSS del enlace. Si es la página que se está mirando,
// le agrega "boton-menu-activo" (el CSS la pinta de azul clarito con una
// rayita a la izquierda).
// Ejemplo: en /inventario/3 (la ficha de un recurso) el enlace "Inventario"
// sigue pintado, porque la dirección EMPIEZA con /inventario.
// "{ isActive: boolean }" = un objeto con un solo dato, de tipo true/false.
function obtenerClaseEnlace(estado: { isActive: boolean }): string {
  if (estado.isActive) {
    return 'boton-menu boton-menu-activo';
  } else {
    return 'boton-menu';
  }
}

// Componente MenuNavegacion
// Recibe: las props de la lista de arriba (cantidadAlertas y onCerrarSesion).
// Devuelve: la barra azul y el menú gris.
// (El <main> con el contenido de cada página está en App.tsx, no aquí.)
// "props: PropsMenuNavegacion" = las props llegan todas juntas en un objeto
// llamado props, y tienen la forma de la interface de arriba.
function MenuNavegacion(props: PropsMenuNavegacion) {
  // useUsuario() = "¿quién está conectado?". Lo responde el parlante
  // (ContextoUsuario) que App pone alrededor de todo. Ver guía, paso 6.
  // De aquí salen tu nombre y tu rol.
  const usuario = useUsuario();

  // Lo que se dibuja. Esto es JSX: parece HTML, pero vive dentro de TypeScript.
  // Diferencias con HTML: se escribe className (no class), y lo que va
  // entre llaves { } es código (ej: {usuario.nombre} = "escribe aquí
  // el nombre de la persona").
  return (
    // <> ... </> es un "fragmento": una caja invisible. Un componente tiene
    // que devolver UNA sola cosa; como aquí son dos (header y nav), las
    // metemos en esta caja que no se ve en la página.
    <>
      {/* ── BARRA AZUL de arriba (queda fija aunque bajes la página) ── */}
      <header className="app-header">
        {/* El TÍTULO de la app. Para cambiarlo, cambia este texto
            (y también el del login en PaginaLogin.tsx). */}
        <h1 className="app-header-titulo">UCEN — Gestión de Inventario</h1>

        {/* La parte derecha: tus datos + el botón para salir */}
        <div className="app-header-usuario">
          <div className="app-header-usuario-datos">
            {/* TU NOMBRE. {usuario.nombre} = "el nombre de la persona
                conectada". Viene de src/data/usuarios.ts. */}
            <span className="app-header-usuario-nombre">{usuario.nombre}</span>
            {/* TU ROL. Llamamos a nombreDelRol (arriba) para traducir
                'encargado' -> "Encargado de laboratorio". */}
            <span className="app-header-usuario-rol">{nombreDelRol(usuario.rol)}</span>
          </div>
          {/* onClick = "cuando hagan clic, ejecuta esta función".
              Le pasamos la función de App DIRECTO (sin paréntesis): si
              escribiéramos props.onCerrarSesion() con paréntesis, ¡se
              ejecutaría apenas se dibuja el botón, sin hacer clic! */}
          <button className="boton-cerrar-sesion" onClick={props.onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── MENÚ GRIS de la izquierda (en celular se vuelve una fila, ver el .css) ── */}
      <nav className="app-sidebar">
        {/* Cada enlace se dibuja SOLO si tu rol puede ver esa página (RNF-03).
            "condicion && ( ... )" = si la condición es true, dibuja lo de la
            derecha; si es false, no dibuja nada. Es un "si... entonces" cortito.

            <NavLink to="/reservas"> es un enlace de React Router (paso 10):
            al hacer clic cambia la dirección a /reservas SIN recargar la
            página, y el <Routes> de App.tsx dibuja la página nueva.
            className={obtenerClaseEnlace}: le pasamos una FUNCIÓN (sin
            paréntesis). NavLink la llama solo, contándole si el enlace
            está activo, y usa la clase que le devolvemos. */}
        {puedeVerPagina(usuario.rol, 'inventario') && (
          <NavLink to="/inventario" className={obtenerClaseEnlace}>
            Inventario
          </NavLink>
        )}
        {puedeVerPagina(usuario.rol, 'reservas') && (
          <NavLink to="/reservas" className={obtenerClaseEnlace}>
            Reservas
          </NavLink>
        )}
        {puedeVerPagina(usuario.rol, 'incidencias') && (
          <NavLink to="/incidencias" className={obtenerClaseEnlace}>
            Incidencias
          </NavLink>
        )}
        {puedeVerPagina(usuario.rol, 'alertas') && (
          <NavLink to="/alertas" className={obtenerClaseEnlace}>
            <span>Alertas</span>
            {/* El numerito rojo: solo si llegó cantidadAlertas (no es undefined)
                Y es mayor que 0. Con 0 alertas no se dibuja. */}
            {props.cantidadAlertas !== undefined && props.cantidadAlertas > 0 && (
              <span className="badge-alertas-menu">{props.cantidadAlertas}</span>
            )}
          </NavLink>
        )}
        {/* Configuración: solo la ve el encargado (lo dice permisos.ts).
            Ahí se agregan categorías, torres y salas (guía, paso 13). */}
        {puedeVerPagina(usuario.rol, 'configuracion') && (
          <NavLink to="/configuracion" className={obtenerClaseEnlace}>
            Configuración
          </NavLink>
        )}
      </nav>
    </>
  );
}

// Exportamos el componente para que App.tsx lo pueda usar.
export default MenuNavegacion;
