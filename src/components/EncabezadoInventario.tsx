// EncabezadoInventario.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La parte de arriba de la página de inventario: el título "Inventario",
// una frase que lo explica y, SOLO para el encargado, el botón
// "+ Agregar recurso".
// Se sacó de PaginaInventario.tsx para que ese archivo no quedara tan largo
// (regla del grupo: un archivo de más de ~150 líneas se divide).
// Sus estilos están en PaginaInventario.css (clases encabezado-pagina-*).
// *** Para cambiar el título o la frase de la página, cámbialos aquí. ***
// En la guía: paso 3 (props y dibujar con condición).
// Cubre: HU-01 y RNF-03 (solo el encargado agrega recursos)

// Este archivo no importa nada: no necesita useState ni otras herramientas.
// Es un componente "tonto" (así se les dice con cariño): solo dibuja lo
// que le dicen sus props.
interface PropsEncabezadoInventario {
  // true si hay que mostrar el botón (la página lo decide con permisos.ts).
  mostrarBotonAgregar: boolean;
  // La función de la página que abre el formulario "Agregar recurso".
  onAgregar: () => void;
}

// Componente EncabezadoInventario
// Recibe: si se muestra el botón y la función que abre el formulario.
// Devuelve: el encabezado de la página.
function EncabezadoInventario(props: PropsEncabezadoInventario) {
  return (
    <header className="encabezado-pagina encabezado-inventario">
      {/* Un <div> sin clase solo sirve para agrupar el título y la frase,
          así el CSS los pone a la izquierda y el botón a la derecha. */}
      <div>
        <h2 className="encabezado-pagina-titulo">Inventario</h2>
        <p className="encabezado-pagina-descripcion">
          Recursos de los laboratorios de las torres B y C
        </p>
      </div>
      {/* "condicion && (...)": el botón se dibuja SOLO si mostrarBotonAgregar es true. */}
      {props.mostrarBotonAgregar && (
        <button type="button" className="boton-principal" onClick={props.onAgregar}>
          + Agregar recurso
        </button>
      )}
    </header>
  );
}

export default EncabezadoInventario;
