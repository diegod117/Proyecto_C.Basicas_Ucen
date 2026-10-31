// TablaFilasValidas.tsx
// Tabla de la vista previa con las filas de la planilla que se pueden
// cargar. Tiene scroll para que entren las ~140 filas y para el celular.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.2)

import type { FilaRevisada } from '../types/Importacion';

interface PropsTablaFilasValidas {
  filas: FilaRevisada[];
}

// Componente TablaFilasValidas
// Recibe: las filas válidas.
// Devuelve: la tabla (o un aviso si no hay ninguna).
function TablaFilasValidas(props: PropsTablaFilasValidas) {
  if (props.filas.length === 0) {
    return <p className="texto-secundario">No hay filas válidas para cargar.</p>;
  }

  return (
    <div className="carga-tabla-scroll">
      <table className="carga-tabla">
        <thead>
          <tr>
            <th>Fila</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Sala</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {/* La fila de Excel no se repite, sirve como key */}
          {props.filas.map((fila) => (
            <tr key={fila.numeroFila}>
              <td>{fila.numeroFila}</td>
              <td>{fila.nombre}</td>
              <td>{fila.categoria}</td>
              <td>{fila.sala}</td>
              <td>{fila.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaFilasValidas;
