// Paginacion.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La fila de botones para moverse entre páginas (pedido del profesor):
//   "← Anterior"   1   2   3   "Siguiente →"
// Este componente NO guarda en qué página estamos: eso lo guarda la página
// que lo usa (en el hook useFiltrosInventario). Este solo la MUESTRA y
// AVISA cuando la persona elige otra. Es como el control remoto: no sabe
// qué canal está dando, solo manda la orden "cambia al 2".
// Si hay una sola página, no dibuja nada (no hace falta).
// En la guía: paso 11 (paginación).
// Cubre: HU-01 (listado del inventario con paginación)

import './Paginacion.css';

// Las props que le pasa PaginaInventario.
interface PropsPaginacion {
  paginaActual: number; // la página que se está viendo (parte en 1)
  totalPaginas: number; // cuántas páginas hay en total
  // La función para avisar "quiero ir a la página X".
  onCambiarPagina: (pagina: number) => void;
}

// Componente Paginacion
// Recibe: la página actual, el total de páginas y la función para cambiarla.
// Devuelve: la fila de botones, o null (nada) si hay una sola página.
function Paginacion(props: PropsPaginacion) {
  // Con 1 página (o menos) no hay a dónde moverse: no dibujamos nada.
  // return null = "este componente no dibuja nada".
  if (props.totalPaginas <= 1) {
    return null;
  }

  // Armamos la lista [1, 2, ..., totalPaginas] con un for, para después
  // dibujar un botón por cada número con .map().
  // Ej: totalPaginas = 3 -> [1, 2, 3].
  // numero++ = "súmale 1 a numero" (es lo mismo que numero = numero + 1).
  const numerosDePagina: number[] = [];
  for (let numero = 1; numero <= props.totalPaginas; numero++) {
    numerosDePagina.push(numero);
  }

  return (
    // <nav> = una zona de navegación. aria-label es un nombre invisible
    // que leen los lectores de pantalla (para personas ciegas).
    <nav className="paginacion" aria-label="Páginas del inventario">
      {/* "Anterior": va a la página actual - 1.
          disabled = apagado. Se apaga en la página 1 (no hay página 0). */}
      <button
        type="button"
        className="paginacion-boton"
        disabled={props.paginaActual === 1}
        onClick={() => props.onCambiarPagina(props.paginaActual - 1)}
      >
        ← Anterior
      </button>

      {/* Un botón por cada número. */}
      {numerosDePagina.map((numero) => {
        // El botón de la página actual lleva una clase extra para verse azul.
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

      {/* "Siguiente": va a la página actual + 1. Se apaga en la última. */}
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
