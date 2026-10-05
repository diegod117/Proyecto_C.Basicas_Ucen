// ContadorInventario.tsx
// Línea "Mostrando X de Y recursos" con el botón "Limpiar filtros".
// Se separó de PaginaInventario.tsx para que ese archivo no creciera tanto.
// Sus estilos están en PaginaInventario.css (clases inventario-contador y
// boton-limpiar-pequeno).
// Cubre: HU-01 (listado con filtros)

interface PropsContadorInventario {
  cantidadMostrada: number; // recursos que cumplen los filtros
  cantidadTotal: number; // todos los recursos del inventario
  hayFiltrosActivos: boolean; // si es true, aparece "Limpiar filtros"
  onLimpiarFiltros: () => void;
}

// Componente ContadorInventario
// Recibe: las dos cantidades, si hay filtros activos y la función para limpiarlos.
// Devuelve: la línea del contador.
function ContadorInventario(props: PropsContadorInventario) {
  return (
    <div className="inventario-contador">
      <p className="texto-secundario">
        Mostrando {props.cantidadMostrada} de {props.cantidadTotal} recursos
      </p>
      {/* "condición && <elemento>" dibuja el elemento SOLO si la condición
          es true. Aquí: el botón aparece solo si hay algún filtro activo. */}
      {props.hayFiltrosActivos && (
        <button className="boton-limpiar-pequeno" onClick={props.onLimpiarFiltros}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export default ContadorInventario;
