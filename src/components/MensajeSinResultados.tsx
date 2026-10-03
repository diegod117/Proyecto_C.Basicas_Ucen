// MensajeSinResultados.tsx
// Mensaje que se muestra cuando ningún recurso cumple los filtros,
// con un botón para limpiarlos. Así el usuario no ve una pantalla vacía
// sin saber qué pasó.
// Cubre: HU-01

import './MensajeSinResultados.css';

interface PropsMensajeSinResultados {
  // Función que se llama al hacer clic en "Limpiar filtros".
  // El mensaje no sabe cómo limpiar los filtros: solo avisa a la página.
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
