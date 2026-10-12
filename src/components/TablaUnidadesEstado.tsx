// TablaUnidadesEstado.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La tablita "Unidades por estado" de la ficha: cuántas unidades hay en
// cada uno de los 5 estados (con su etiqueta de color) y el total abajo.
// Antes estaba dentro de FichaRecurso.tsx; se separó para que ese archivo
// no pasara de ~150 líneas.
// En la guía: paso 3 (.map, key y Fragment).
// Cubre: HU-02 (ficha del recurso), RF-01

import type { Recurso } from '../types/Recurso';
import { textoEstado, calcularCantidadTotal, listaEstadosRecurso } from '../utils/inventario';
import './TablaUnidadesEstado.css';

// Solo recibe un dato: el recurso.
interface PropsTablaUnidadesEstado {
  recurso: Recurso;
}

// Componente TablaUnidadesEstado
// Recibe: el recurso.
// Devuelve: el subtítulo y la tabla.
function TablaUnidadesEstado(props: PropsTablaUnidadesEstado) {
  const recurso = props.recurso;

  return (
    // <> ... </> (Fragment): una caja invisible para devolver DOS cosas
    // (el subtítulo y la tabla) sin agregar una etiqueta extra.
    <>
      {/* Mostramos los 5 estados, incluso los que tienen 0, para que el
          encargado vea el panorama completo. */}
      <h3 className="ficha-subtitulo">Unidades por estado</h3>
      {/* Una tabla HTML: <table> la tabla, <tbody> el cuerpo,
          <tr> una fila (table row), <td> una celda (table data). */}
      <table className="ficha-tabla-estados">
        <tbody>
          {/* Una fila por cada estado, fabricada con .map().
              key={estado}: el nombre único de cada fila. */}
          {listaEstadosRecurso.map((estado) => (
            <tr key={estado}>
              <td>
                {/* La etiqueta de color: la clase se arma pegando textos,
                    ej: "etiqueta etiqueta-danado" -> el CSS la pinta roja. */}
                <span className={'etiqueta etiqueta-' + estado}>{textoEstado(estado)}</span>
              </td>
              {/* recurso.cantidades[estado] = abre el cajón de ese estado. */}
              <td className="ficha-tabla-numero">{recurso.cantidades[estado]}</td>
            </tr>
          ))}
          {/* La última fila: el total de todos los cajones. */}
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
