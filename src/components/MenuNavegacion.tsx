// MenuNavegacion.tsx
// M17 — RNF-01: rediseño del menú a barra superior + menú lateral.
// La barra superior (header) muestra el título y el usuario conectado.
// El menú lateral (aside) muestra solo las páginas que el rol puede ver.
// Cada opción del menú es un enlace de React Router (NavLink) a su ruta.
// En celular el aside pasa a ser una fila horizontal (ver MenuNavegacion.css).
// Cubre: navegación base con React Router, inicio de sesión con roles
//        (sección 3.4 de requerimientos) y RNF-03.

import { NavLink } from 'react-router-dom';
import type { RolUsuario } from '../types/Usuario';
import { puedeVerPagina } from '../utils/permisos';
import { useUsuario } from '../context/ContextoUsuario';
import './MenuNavegacion.css';

// Las "props" son los datos que un componente recibe desde su componente padre
// (en este caso, desde App.tsx). Con esta interface le decimos a TypeScript
// qué props espera el menú y de qué tipo son.
// El usuario ya no llega por props: el menú lo lee del contexto con useUsuario().
interface PropsMenuNavegacion {
  // Cantidad de alertas activas para mostrar en el badge del menú (HU-05).
  // Es una prop numérica, tal como la campana con contador del mockup.
  cantidadAlertas?: number;
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

// obtenerClaseEnlace
// Recibe: un objeto con "isActive", que entrega NavLink (true si la URL
// actual es la de ese enlace).
// Devuelve: la clase CSS del enlace. Si es la página actual, le agrega
// "boton-menu-activo" para que se vea resaltado.
// Ejemplo: en /inventario/3 (la ficha de un recurso) el enlace "Inventario"
// sigue activo, porque la URL empieza con /inventario.
function obtenerClaseEnlace(estado: { isActive: boolean }): string {
  if (estado.isActive) {
    return 'boton-menu boton-menu-activo';
  } else {
    return 'boton-menu';
  }
}

// Componente MenuNavegacion
// Recibe: cantidadAlertas opcional y onCerrarSesion.
// Devuelve: la barra superior (header) y el menú lateral (nav/aside).
// NOTA: el <main> que envuelve el contenido sigue en App.tsx con la clase
// "app-contenido" para que se desplace a la derecha del sidebar.
function MenuNavegacion(props: PropsMenuNavegacion) {
  // El usuario conectado viene del contexto (ver context/ContextoUsuario.ts)
  const usuario = useUsuario();

  return (
    <>
      {/* ── Barra superior azul (fija en la parte de arriba) ── */}
      <header className="app-header">
        <h1 className="app-header-titulo">UCEN — Gestión de Inventario</h1>

        <div className="app-header-usuario">
          <div className="app-header-usuario-datos">
            <span className="app-header-usuario-nombre">{usuario.nombre}</span>
            <span className="app-header-usuario-rol">{nombreDelRol(usuario.rol)}</span>
          </div>
          <button className="boton-cerrar-sesion" onClick={props.onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── Menú lateral gris (fijo a la izquierda, debajo del header) ── */}
      {/* En celular se convierte en fila horizontal (ver .css @media) */}
      <nav className="app-sidebar">
        {/* Cada enlace se dibuja SOLO si el rol del usuario puede ver esa
            página (RNF-03). "condición && (...)" significa: si la condición
            es true, dibuja lo de la derecha; si es false, no dibuja nada.
            NavLink es un enlace de React Router: al hacer clic cambia la URL
            (to="/reservas") sin recargar la página, y Routes en App.tsx
            dibuja la página nueva. A className le pasamos una FUNCIÓN:
            NavLink la llama y nos dice si el enlace está activo. */}
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
            {props.cantidadAlertas !== undefined && props.cantidadAlertas > 0 && (
              <span className="badge-alertas-menu">{props.cantidadAlertas}</span>
            )}
          </NavLink>
        )}
      </nav>
    </>
  );
}

export default MenuNavegacion;
