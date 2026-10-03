// MenuNavegacion.tsx
// Barra superior azul con el nombre del sistema y los botones
// para cambiar de página (Inventario, Reservas, Incidencias).
// Cubre: navegación base (no corresponde a una HU específica)

import type { Pagina } from '../types/Pagina';
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
}

// Componente MenuNavegacion
// Recibe: paginaActual y onCambiarPagina (ver interface de arriba).
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
      <h1 className="menu-titulo">SGIL - Gestión de Inventario</h1>

      <nav className="menu-botones">
        {/* Al hacer clic, llamamos a la función que nos pasó App.
            Se escribe "() => ..." para que se ejecute SOLO al hacer clic,
            y no apenas se dibuja el botón. */}
        <button
          className={obtenerClaseBoton('inventario')}
          onClick={() => props.onCambiarPagina('inventario')}
        >
          Inventario
        </button>
        <button
          className={obtenerClaseBoton('reservas')}
          onClick={() => props.onCambiarPagina('reservas')}
        >
          Reservas
        </button>
        <button
          className={obtenerClaseBoton('incidencias')}
          onClick={() => props.onCambiarPagina('incidencias')}
        >
          Incidencias
        </button>
      </nav>
    </header>
  );
}

export default MenuNavegacion;
