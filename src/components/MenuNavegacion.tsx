// MenuNavegacion.tsx
// Barra superior azul con el nombre del sistema y los botones
// para cambiar de página (Inventario, Reservas, Incidencias).
// También muestra quién inició sesión y el botón para cerrar sesión.
// Solo muestra los botones de las páginas que el rol puede ver.
// Cubre: navegación base, inicio de sesión con roles (sección 3.4 de requerimientos) y RNF-03

import type { Pagina } from '../types/Pagina';
import type { Usuario, RolUsuario } from '../types/Usuario';
import { puedeVerPagina } from '../utils/permisos';
import './MenuNavegacion.css';

// Las "props" son los datos que un componente recibe desde su componente padre
// (en este caso, desde App.tsx). Con esta interface le decimos a TypeScript
// qué props espera el menú y de qué tipo son.
interface PropsMenuNavegacion {
  // La página que se está mostrando, para marcar su botón como "activo"
  paginaActual: Pagina;
  // Una FUNCIÓN que viene de App. El menú no cambia la página por sí solo:
  // le avisa a App cuál página eligió el usuario, y App se encarga del resto.
  // "(pagina: Pagina) => void" = recibe una Pagina y no devuelve nada.
  onCambiarPagina: (pagina: Pagina) => void;
  // Cantidad de alertas activas para mostrar en el badge del menú (HU-05).
  // Es una prop numérica, tal como la campana con contador del mockup.
  cantidadAlertas?: number;
  // Usuario conectado, para mostrar su nombre y su rol.
  usuario: Usuario;
  // Función de App que cierra la sesión.
  onCerrarSesion: () => void;
}

// Recibe un rol. Devuelve el nombre del rol para mostrar en pantalla
// (en los datos está en minúsculas y sin tildes).
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
// Recibe: paginaActual, onCambiarPagina, cantidadAlertas opcional,
// usuario y onCerrarSesion.
// Devuelve: la barra de navegación.
function MenuNavegacion(props: PropsMenuNavegacion) {
  // Devuelve la clase CSS de un botón: si es la página actual,
  // le agrega "boton-menu-activo" para que se vea resaltado.
  function obtenerClaseBoton(pagina: Pagina): string {
    if (pagina === props.paginaActual) {
      return 'boton-menu boton-menu-activo';
    } else {
      return 'boton-menu';
    }
  }

  return (
    <header className="menu-navegacion">
      <h1 className="menu-titulo">UCEN - Gestión de Inventario</h1>

      <nav className="menu-botones">
        {/* Cada botón se dibuja SOLO si el rol del usuario puede ver esa
            página (RNF-03). "condición && (...)" significa: si la condición
            es true, dibuja lo de la derecha; si es false, no dibuja nada.
            Al hacer clic, llamamos a la función que nos pasó App.
            Se escribe "() => ..." para que se ejecute SOLO al hacer clic,
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
            {props.cantidadAlertas !== undefined && props.cantidadAlertas > 0 && (
              <span className="badge-alertas-menu">{props.cantidadAlertas}</span>
            )}
          </button>
        )}
      </nav>

      <div className="menu-usuario">
        <div className="menu-usuario-datos">
          <span className="menu-usuario-nombre">{props.usuario.nombre}</span>
          <span className="menu-usuario-rol">{nombreDelRol(props.usuario.rol)}</span>
        </div>
        <button className="boton-menu" onClick={props.onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default MenuNavegacion;
