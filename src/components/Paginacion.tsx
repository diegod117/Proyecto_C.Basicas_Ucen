// Paginacion.tsx
// Botones para moverse entre páginas: "← Anterior", 1, 2, 3... y "Siguiente →".
// No guarda la página actual: la guarda la página que lo usa (con useState),
// y este componente solo la muestra y avisa cuando el usuario elige otra.
// Si hay una sola página, no dibuja nada.
// Cubre: HU-01 (listado del inventario con paginación)

import './Paginacion.css';

interface PropsPaginacion {
  paginaActual: number; // la página que se está viendo (parte en 1)
  totalPaginas: number;
  // Función de la página para cambiar a otra página
  onCambiarPagina: (pagina: number) => void;
}

// Componente Paginacion
// Recibe: la página actual, el total de páginas y la función para cambiarla.
// Devuelve: la fila de botones, o null (nada) si hay una sola página.
function Paginacion(props: PropsPaginacion) {
  if (props.totalPaginas <= 1) {
    return null;
  }

  // Armamos la lista [1, 2, ..., totalPaginas] con un for, para dibujar
  // un botón por cada número con .map()
  const numerosDePagina: number[] = [];
  for (let numero = 1; numero <= props.totalPaginas; numero++) {
    numerosDePagina.push(numero);
  }

  return (
    // <nav> con aria-label ayuda a los lectores de pantalla a saber qué es
    <nav className="paginacion" aria-label="Páginas del inventario">
      {/* "Anterior" se desactiva en la primera página */}
      <button
        type="button"
        className="paginacion-boton"
        disabled={props.paginaActual === 1}
        onClick={() => props.onCambiarPagina(props.paginaActual - 1)}
      >
        ← Anterior
      </button>

      {numerosDePagina.map((numero) => {
        // La página actual se ve resaltada en azul
        let clase = 'paginacion-boton paginacion-numero';
        if (numero === props.paginaActual) {
          clase = clase + ' paginacion-actual';
        }
        return (
          <button key={numero} type="button" className={clase} onClick={() => props.onCambiarPagina(numero)}>
            {numero}
          </button>
        );
      })}

      {/* "Siguiente" se desactiva en la última página */}
      <button
        type="button"
        className="paginacion-boton"
        disabled={props.paginaActual === props.totalPaginas}
        onClick={() => props.onCambiarPagina(props.paginaActual + 1)}
      >
        Siguiente →
      </button>
    </nav>
  );
}

export default Paginacion;
