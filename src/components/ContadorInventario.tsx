// ContadorInventario.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La línea que dice "Mostrando 3 de 10 recursos", con el botón
// "Limpiar filtros" al lado (solo si estás usando algún filtro).
// Se sacó de PaginaInventario.tsx para que ese archivo no quedara tan largo.
// Sus estilos están en PaginaInventario.css (clases inventario-contador y
// boton-limpiar-pequeno).
// En la guía: paso 3 (props).
// Cubre: HU-01 (listado con filtros)

// Las props: dos números, un sí/no y una función.
interface PropsContadorInventario {
  cantidadMostrada: number; // cuántos recursos pasaron los filtros
  cantidadTotal: number; // cuántos recursos hay en total
  hayFiltrosActivos: boolean; // si es true, aparece el botón "Limpiar filtros"
  onLimpiarFiltros: () => void; // la función de la página que limpia los filtros
}

// Componente ContadorInventario
// Recibe: las dos cantidades, si hay filtros y la función para limpiarlos.
// Devuelve: la línea del contador.
function ContadorInventario(props: PropsContadorInventario) {
  return (
    <div className="inventario-contador">
      {/* Dentro del texto se pueden meter valores con llaves:
          "Mostrando {3} de {10} recursos" -> "Mostrando 3 de 10 recursos". */}
      <p className="texto-secundario">
        Mostrando {props.cantidadMostrada} de {props.cantidadTotal} recursos
      </p>
      {/* "condicion && <elemento>" = dibuja el elemento SOLO si la condición
          es true. Aquí: el botón aparece solo si hay algún filtro puesto. */}
      {props.hayFiltrosActivos && (
        <button className="boton-limpiar-pequeno" onClick={props.onLimpiarFiltros}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export default ContadorInventario;
