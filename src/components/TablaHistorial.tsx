// TablaHistorial.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La tabla "Historial de estados" que va debajo de la ficha de un recurso:
// el "diario de vida" del recurso. Cada fila cuenta algo que le pasó:
// cuándo, qué cambió, por qué y quién lo hizo.
// Hay tres clases de filas (según el "tipo" de la línea):
//   - 'alta'          -> "Alta 3 → Disponible"     (el recurso se agregó)
//   - 'reposicion'    -> "Reposición +10 → Disponible" (llegaron unidades)
//   - 'cambio_estado' -> "Disponible → Dañado (1)"  (unidades cambiaron de estado)
// En la guía: paso 3 (.map, key y dibujar con condición).
// Cubre: HU-06 (ver el historial de cambios de estado), RF-04, RNF-06

import type { CambioEstado } from '../types/CambioEstado';
import { textoEstado } from '../utils/inventario';
import './TablaHistorial.css';

interface PropsTablaHistorial {
  // Las líneas del diario de este recurso, ya ordenadas de la más nueva
  // a la más vieja (así las entrega historialService).
  historial: CambioEstado[];
}

// Componente TablaHistorial
// Recibe: la lista de líneas del diario.
// Devuelve: la tabla, o un mensaje si el recurso todavía no tiene líneas.
function TablaHistorial(props: PropsTablaHistorial) {
  return (
    <div className="tabla-historial">
      <h3 className="tabla-historial-titulo">Historial de estados</h3>

      {/* ¿El diario está vacío? Mostramos un aviso en vez de una tabla vacía. */}
      {props.historial.length === 0 && (
        <p className="tabla-historial-vacia">Este recurso aún no tiene cambios de estado registrados.</p>
      )}

      {/* ¿Tiene al menos una línea? Dibujamos la tabla. */}
      {props.historial.length > 0 && (
        // Este div deja deslizar la tabla hacia el lado en un celular,
        // si no cabe en la pantalla (RNF-01).
        <div className="tabla-historial-contenedor">
          <table>
            {/* <thead> = la cabeza de la tabla (los títulos de las columnas).
                <th> = una celda de título (table header). */}
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cambio</th>
                <th>Motivo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {/* Una fila por cada línea del diario. La key es el número
                  de la línea, que nunca se repite. */}
              {props.historial.map((cambio) => (
                <tr key={cambio.id}>
                  <td className="tabla-historial-fecha">{cambio.fecha}</td>
                  <td className="tabla-historial-cambio">
                    {/* Solo UNO de estos tres bloques se dibuja, según el tipo. */}

                    {/* Tipo 'alta'. Ej: Alta 10 → [Disponible] */}
                    {cambio.tipo === 'alta' && (
                      <>
                        <span className="tabla-historial-reposicion">Alta {cambio.cantidad}</span>
                        {/* {' → '} = un texto con espacios a los lados. En JSX los
                            espacios sueltos se pierden, así que se escriben así. */}
                        {' → '}
                        <span className="etiqueta etiqueta-disponible">
                          {textoEstado('disponible')}
                        </span>
                      </>
                    )}
                    {/* Tipo 'reposicion'. Ej: Reposición +10 → [Disponible] */}
                    {cambio.tipo === 'reposicion' && (
                      <>
                        <span className="tabla-historial-reposicion">
                          Reposición +{cambio.cantidad}
                        </span>
                        {' → '}
                        <span className="etiqueta etiqueta-disponible">
                          {textoEstado('disponible')}
                        </span>
                      </>
                    )}
                    {/* Tipo 'cambio_estado'. Ej: [Disponible] → [Dañado] (1)
                        Las etiquetas de color se arman con la clase "etiqueta-" + estado. */}
                    {cambio.tipo === 'cambio_estado' && (
                      <>
                        <span className={'etiqueta etiqueta-' + cambio.estadoAnterior}>
                          {textoEstado(cambio.estadoAnterior)}
                        </span>
                        {' → '}
                        <span className={'etiqueta etiqueta-' + cambio.estadoNuevo}>
                          {textoEstado(cambio.estadoNuevo)}
                        </span>
                        <span className="tabla-historial-cantidad"> ({cambio.cantidad})</span>
                      </>
                    )}
                  </td>
                  <td>{cambio.motivo}</td>
                  <td>{cambio.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TablaHistorial;
