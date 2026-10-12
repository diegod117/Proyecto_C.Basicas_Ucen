// MensajeSinResultados.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El recuadro que aparece cuando los filtros no encuentran NINGÚN recurso.
// Dice "No hay recursos que coincidan..." y tiene un botón para limpiar los
// filtros. Así la persona no queda mirando una pantalla vacía sin entender por qué.
// En la guía: paso 3 (props con funciones).
// Cubre: HU-01

import './MensajeSinResultados.css';

interface PropsMensajeSinResultados {
  // La función que se llama al apretar "Limpiar filtros".
  // Este componente NO sabe limpiar los filtros (los filtros viven en la
  // página): solo AVISA que apretaron el botón, y la página hace el trabajo.
  // Es como un timbre: el timbre no abre la puerta, solo avisa que alguien llegó.
  onLimpiarFiltros: () => void;
}

// Componente MensajeSinResultados
// Recibe: la función para limpiar los filtros.
// Devuelve: el recuadro con el mensaje y el botón.
function MensajeSinResultados(props: PropsMensajeSinResultados) {
  return (
    <div className="sin-resultados">
      <p className="sin-resultados-titulo">No hay recursos que coincidan con los filtros</p>
      <p className="sin-resultados-texto">
        Prueba con otro nombre o cambia la categoría, el laboratorio o el estado.
      </p>
      <button className="sin-resultados-boton" onClick={props.onLimpiarFiltros}>
        Limpiar filtros
      </button>
    </div>
  );
}

export default MensajeSinResultados;
