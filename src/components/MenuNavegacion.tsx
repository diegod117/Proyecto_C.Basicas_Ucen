// MenuNavegacion.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Dibuja las dos partes del menú que siempre se ven:
//   1. La BARRA AZUL de arriba (header): el título de la app a la izquierda,
//      y a la derecha TU NOMBRE, TU ROL y el botón "Cerrar sesión".
//   2. El MENÚ GRIS de la izquierda (sidebar): los botones Inventario,
//      Reservas, Incidencias y Alertas (solo los que tu rol puede ver).
// En celular, el menú gris se convierte en una fila de botones (ver MenuNavegacion.css).
//
// *** ¿CÓMO CAMBIO LO QUE DICE ARRIBA A LA DERECHA? (ver guía, paso 9) ***
//   - El NOMBRE ("Pedro Soto") NO está escrito aquí: viene de props.usuario.nombre,
//     y ese nombre está en src/data/usuarios.ts. Cámbialo allá.
//   - El ROL ("Encargado de laboratorio") SÍ está escrito aquí, en la
//     función nombreDelRol de más abajo. Cambia el texto entre comillas.
//   - El TÍTULO ("UCEN — Gestión de Inventario") está aquí, en el <h1>.
//   - Los COLORES y TAMAÑOS están en MenuNavegacion.css.
//
// En la guía: paso 3 (props y JSX).
// Cubre: navegación base, inicio de sesión con roles (sección 3.4 de requerimientos) y RNF-03.

import type { Pagina } from '../types/Pagina';
import type { Usuario, RolUsuario } from '../types/Usuario';
import { puedeVerPagina } from '../utils/permisos';
// Importar el .css de este componente aplica sus estilos.
import './MenuNavegacion.css';

// ¿QUÉ SON LAS PROPS?
// Son los datos que un componente RECIBE de su "papá" (aquí el papá es App.tsx).
// Es como cuando tu mamá te manda al almacén con una lista: tú (el hijo)
// no decides qué comprar, usas lo que te dieron en la lista.
// Esta interface es esa "lista": qué datos llegan y de qué tipo es cada uno.
// Si App se olvida de pasar uno obligatorio, TypeScript lo marca en rojo.
interface PropsMenuNavegacion {
  // La página que se está mirando, para pintar su botón como "elegido".
  paginaActual: Pagina;
  // Una FUNCIÓN que viene de App. El menú NO cambia la página él solo:
  // solo AVISA a App qué botón se apretó, y App decide (porque App es
  // quien tiene paginaActual en su useState).
  // "(pagina: Pagina) => void" = una función que recibe una Pagina y no devuelve nada.
  onCambiarPagina: (pagina: Pagina) => void;
  // Cuántas alertas hay, para el numerito rojo (HU-05).
  // El "?" = opcional: si no llega, no se dibuja el numerito.
  cantidadAlertas?: number;
  // La persona conectada: de aquí sale el nombre y el rol que se ven arriba.
  usuario: Usuario;
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

// Componente MenuNavegacion
// Recibe: las props de la lista de arriba (paginaActual, onCambiarPagina,
// cantidadAlertas, usuario y onCerrarSesion).
// Devuelve: la barra azul y el menú gris.
// (El <main> con el contenido de cada página está en App.tsx, no aquí.)
// "props: PropsMenuNavegacion" = las props llegan todas juntas en un objeto
// llamado props, y tienen la forma de la interface de arriba.
function MenuNavegacion(props: PropsMenuNavegacion) {
  // obtenerClaseBoton
  // Recibe: una página. Devuelve: la clase CSS que debe tener su botón.
  // Si es la página que se está mirando, le agrega "boton-menu-activo"
  // (el CSS la pinta de azul clarito con una rayita a la izquierda).
  // Una función DENTRO de otra función: puede leer las props del componente.
  function obtenerClaseBoton(pagina: Pagina): string {
    if (pagina === props.paginaActual) {
      return 'boton-menu boton-menu-activo';
    } else {
      return 'boton-menu';
    }
  }

  // Lo que se dibuja. Esto es JSX: parece HTML, pero vive dentro de TypeScript.
  // Diferencias con HTML: se escribe className (no class), y lo que va
  // entre llaves { } es código (ej: {props.usuario.nombre} = "escribe aquí
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
            {/* TU NOMBRE. {props.usuario.nombre} = "el nombre de la persona
                que me pasó App". Viene de src/data/usuarios.ts. */}
            <span className="app-header-usuario-nombre">{props.usuario.nombre}</span>
            {/* TU ROL. Llamamos a nombreDelRol (arriba) para traducir
                'encargado' -> "Encargado de laboratorio". */}
            <span className="app-header-usuario-rol">{nombreDelRol(props.usuario.rol)}</span>
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
        {/* Cada botón se dibuja SOLO si tu rol puede ver esa página (RNF-03).
            "condicion && ( ... )" = si la condición es true, dibuja lo de la
            derecha; si es false, no dibuja nada. Es un "si... entonces" cortito.
            onClick={() => props.onCambiarPagina('inventario')}: aquí SÍ hay que
            escribir "() =>" (una función flecha), porque necesitamos pasarle un
            dato ('inventario'). La flecha hace que se ejecute SOLO al hacer clic,
            y no apenas se dibuja el botón. */}
        {puedeVerPagina(props.usuario.rol, 'inventario') && (
          <button
            className={obtenerClaseBoton('inventario')}
            onClick={() => props.onCambiarPagina('inventario')}
          >
            Inventario
          </button>
        )}
        {puedeVerPagina(props.usuario.rol, 'reservas') && (
          <button
            className={obtenerClaseBoton('reservas')}
            onClick={() => props.onCambiarPagina('reservas')}
          >
            Reservas
          </button>
        )}
        {puedeVerPagina(props.usuario.rol, 'incidencias') && (
          <button
            className={obtenerClaseBoton('incidencias')}
            onClick={() => props.onCambiarPagina('incidencias')}
          >
            Incidencias
          </button>
        )}
        {puedeVerPagina(props.usuario.rol, 'alertas') && (
          <button
            className={obtenerClaseBoton('alertas')}
            onClick={() => props.onCambiarPagina('alertas')}
          >
            <span>Alertas</span>
            {/* El numerito rojo: solo si llegó cantidadAlertas (no es undefined)
                Y es mayor que 0. Con 0 alertas no se dibuja. */}
            {props.cantidadAlertas !== undefined && props.cantidadAlertas > 0 && (
              <span className="badge-alertas-menu">{props.cantidadAlertas}</span>
            )}
          </button>
        )}
      </nav>
    </>
  );
}

// Exportamos el componente para que App.tsx lo pueda usar.
export default MenuNavegacion;
