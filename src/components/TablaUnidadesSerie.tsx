// TablaUnidadesSerie.tsx
// Tabla de la ficha con cada unidad de un equipo o instrumento: su número
// de serie (o de inventario) y su estado. Si el recurso es de una categoría
// con número de serie pero todavía no tiene unidades registradas (se creó
// antes de HU-12), muestra un aviso.
// Cubre: HU-12, RF-11 (CA-12.3)

import type { Recurso } from '../types/Recurso';
import { textoEstado } from '../utils/inventario';
import { categoriaUsaNumeroSerie } from '../utils/unidades';
import './TablaUnidadesSerie.css';

interface PropsTablaUnidadesSerie {
  recurso: Recurso;
}

// Componente TablaUnidadesSerie
// Recibe: el recurso.
// Devuelve: la tabla de unidades, un aviso, o nada si el recurso no usa números de serie.
function TablaUnidadesSerie(props: PropsTablaUnidadesSerie) {
  const recurso = props.recurso;

  // Insumos, reactivos, etc.: no tienen unidades con número, no mostramos nada.
  // Devolver null hace que React no dibuje nada.
  if (recurso.unidades === undefined && !categoriaUsaNumeroSerie(recurso.categoria)) {
    return null;
  }

  if (recurso.unidades === undefined) {
    return (
      <>
        <h3 className="ficha-subtitulo">Unidades con número de serie</h3>
        <p className="texto-secundario">
          Este recurso todavía no tiene sus unidades registradas con número de serie.
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="ficha-subtitulo">Unidades con número de serie</h3>
      <table className="ficha-tabla-unidades">
        <thead>
          <tr>
            <th>N° de serie o de inventario</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* El número no se repite dentro del recurso (CA-12.2), por eso sirve de key */}
          {recurso.unidades.map((unidad) => (
            <tr key={unidad.numero}>
              <td>{unidad.numero}</td>
              <td>
                <span className={'etiqueta etiqueta-' + unidad.estado}>{textoEstado(unidad.estado)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TablaUnidadesSerie;
