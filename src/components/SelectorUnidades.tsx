// SelectorUnidades.tsx
// Lista de las unidades de un equipo o instrumento, cada una con una casilla,
// su número de serie y su estado actual. El encargado marca las que quiere
// cambiar. La usan "Cambiar estado de unidades" (HU-02) y "Registrar salida" (HU-14).
// Cubre: HU-02, HU-14, HU-12 (unidades)

import type { Unidad, EstadoRecurso } from '../types/Recurso';
import { textoEstado } from '../utils/inventario';
import './SelectorUnidades.css';

interface PropsSelectorUnidades {
  unidades: Unidad[];
  // Los números de serie que están marcados ahora
  marcados: string[];
  // Recibe la lista nueva de números marcados
  onCambiar: (marcados: string[]) => void;
  // Si se indica, las unidades en ese estado no se pueden marcar
  // (ej: 'dado_de_baja', porque una unidad dada de baja ya no sale de nuevo)
  estadoBloqueado?: EstadoRecurso;
}

// Componente SelectorUnidades
// Recibe: las unidades, cuáles están marcadas y la función para cambiarlas.
// Devuelve: la lista con casillas.
function SelectorUnidades(props: PropsSelectorUnidades) {
  // marcarUnidad
  // Recibe: el número de serie de una unidad y si quedó marcada o no.
  // No devuelve nada. Avisa la lista nueva con ese número agregado o sacado.
  function marcarUnidad(numero: string, marcada: boolean) {
    if (marcada) {
      // [...lista, numero] crea una lista nueva con el número al final
      props.onCambiar([...props.marcados, numero]);
    } else {
      // filter deja todos los números menos el que se desmarcó
      props.onCambiar(props.marcados.filter((n) => n !== numero));
    }
  }

  return (
    <>
      <span className="formulario-unidades-etiqueta">Unidades (marca las que cambian)</span>
      <ul className="formulario-unidades-lista">
        {props.unidades.map((unidad) => (
          <li key={unidad.numero}>
            <label className="formulario-unidades-opcion">
              <input
                type="checkbox"
                checked={props.marcados.includes(unidad.numero)}
                disabled={unidad.estado === props.estadoBloqueado}
                onChange={(evento) => marcarUnidad(unidad.numero, evento.target.checked)}
              />
              <span className="formulario-unidades-numero">{unidad.numero}</span>
              <span className={'etiqueta etiqueta-' + unidad.estado}>{textoEstado(unidad.estado)}</span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SelectorUnidades;
