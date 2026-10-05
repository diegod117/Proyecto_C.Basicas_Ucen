// TablaUnidadesEstado.tsx
// Tabla "Unidades por estado" de la ficha de un recurso: cuántas unidades
// hay en cada uno de los 5 estados y el total.
// Antes estaba dentro de FichaRecurso.tsx; se separó para que ese archivo
// no pasara de ~150 líneas.
// Cubre: HU-02 (ficha del recurso), RF-01

import type { Recurso } from '../types/Recurso';
import { textoEstado, calcularCantidadTotal, listaEstadosRecurso } from '../utils/inventario';
import './TablaUnidadesEstado.css';

interface PropsTablaUnidadesEstado {
  recurso: Recurso;
}

// Componente TablaUnidadesEstado
// Recibe: el recurso.
// Devuelve: el subtítulo y la tabla con las unidades por estado.
function TablaUnidadesEstado(props: PropsTablaUnidadesEstado) {
  const recurso = props.recurso;

  return (
    // "<> ... </>" (Fragment) agrupa el subtítulo y la tabla sin agregar
    // una etiqueta extra al HTML
    <>
      {/* Aquí mostramos los 5 estados, incluso los que tienen 0,
          para que el encargado vea el panorama completo. */}
      <h3 className="ficha-subtitulo">Unidades por estado</h3>
      <table className="ficha-tabla-estados">
        <tbody>
          {listaEstadosRecurso.map((estado) => (
            <tr key={estado}>
              <td>
                <span className={'etiqueta etiqueta-' + estado}>{textoEstado(estado)}</span>
              </td>
              <td className="ficha-tabla-numero">{recurso.cantidades[estado]}</td>
            </tr>
          ))}
          <tr className="ficha-tabla-total">
            <td>Total</td>
            <td className="ficha-tabla-numero">{calcularCantidadTotal(recurso)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default TablaUnidadesEstado;
