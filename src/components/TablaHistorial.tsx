// TablaHistorial.tsx
// Tabla "Historial de estados" que va debajo de la ficha de un recurso.
// Muestra cada cambio de estado: cuándo, qué cambió, por qué y quién.
// También muestra las reposiciones de stock (unidades nuevas que llegaron).
// Cubre: HU-06 (ver el historial de cambios de estado), RF-04, RNF-06

import type { CambioEstado } from '../types/CambioEstado';
import { textoEstado } from '../utils/inventario';
import './TablaHistorial.css';

interface PropsTablaHistorial {
  // Los cambios que hay que mostrar, ya ordenados del más reciente al más
  // antiguo (así los entrega historialService)
  historial: CambioEstado[];
}

// Componente TablaHistorial
// Recibe: la lista de cambios de estado de un recurso.
// Devuelve: la tabla, o un mensaje si el recurso todavía no tiene cambios.
function TablaHistorial(props: PropsTablaHistorial) {
  return (
    <div className="tabla-historial">
      <h3 className="tabla-historial-titulo">Historial de estados</h3>

      {/* Si la lista está vacía mostramos un aviso en vez de una tabla vacía */}
      {props.historial.length === 0 && (
        <p className="tabla-historial-vacia">Este recurso aún no tiene cambios de estado registrados.</p>
      )}

      {props.historial.length > 0 && (
        // Este div permite deslizar la tabla hacia el lado en un celular
        // si no cabe en la pantalla (RNF-01)
        <div className="tabla-historial-contenedor">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cambio</th>
                <th>Motivo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {/* Una fila por cada cambio. La key es el id del registro,
                  que nunca se repite. */}
              {props.historial.map((cambio) => (
                <tr key={cambio.id}>
                  <td className="tabla-historial-fecha">{cambio.fecha}</td>
                  <td className="tabla-historial-cambio">
                    {/* Reposición. Ej: Reposición +10 → [Disponible] */}
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
                    {/* Cambio de estado. Ej: [Disponible] → [Dañado] (1) */}
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
