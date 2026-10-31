// TablaFilasConError.tsx
// Tabla de la vista previa con las filas de la planilla que NO se cargarán,
// con el número de fila de Excel y los problemas de cada una.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.2)

import type { FilaRevisada } from '../types/Importacion';

interface PropsTablaFilasConError {
  filas: FilaRevisada[];
}

// Componente TablaFilasConError
// Recibe: las filas con error.
// Devuelve: la tabla (o nada si no hay filas con error).
function TablaFilasConError(props: PropsTablaFilasConError) {
  if (props.filas.length === 0) {
    return null;
  }

  return (
    <div className="carga-tabla-scroll">
      <table className="carga-tabla">
        <thead>
          <tr>
            <th>Fila</th>
            <th>Nombre</th>
            <th>Problemas</th>
          </tr>
        </thead>
        <tbody>
          {props.filas.map((fila) => (
            <tr key={fila.numeroFila}>
              <td>{fila.numeroFila}</td>
              <td>{fila.nombre}</td>
              <td>
                {/* Un problema por línea. El texto del problema sirve de key. */}
                {fila.errores.map((error) => (
                  <div key={error} className="carga-error-fila">
                    {error}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaFilasConError;
