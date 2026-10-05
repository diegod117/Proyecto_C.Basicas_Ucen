// EncabezadoInventario.tsx
// Encabezado de la página de inventario: título, descripción y, solo para
// el encargado, el botón "+ Agregar recurso".
// Se separó de PaginaInventario.tsx para que ese archivo no creciera tanto.
// Sus estilos están en PaginaInventario.css (clases encabezado-pagina-*).
// Cubre: HU-01 y RNF-03 (solo el encargado agrega recursos)

interface PropsEncabezadoInventario {
  // true si el usuario puede agregar recursos (lo decide la página con permisos.ts)
  mostrarBotonAgregar: boolean;
  // Función de la página que abre el formulario "Agregar recurso"
  onAgregar: () => void;
}

// Componente EncabezadoInventario
// Recibe: si se muestra el botón y la función que abre el formulario.
// Devuelve: el encabezado de la página.
function EncabezadoInventario(props: PropsEncabezadoInventario) {
  return (
    <header className="encabezado-pagina encabezado-inventario">
      <div>
        <h2 className="encabezado-pagina-titulo">Inventario</h2>
        <p className="encabezado-pagina-descripcion">
          Recursos de los laboratorios de las torres B y C
        </p>
      </div>
      {props.mostrarBotonAgregar && (
        <button type="button" className="boton-principal" onClick={props.onAgregar}>
          + Agregar recurso
        </button>
      )}
    </header>
  );
}

export default EncabezadoInventario;
