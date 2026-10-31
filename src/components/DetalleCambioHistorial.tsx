// DetalleCambioHistorial.tsx
// Celda "Cambio" de la tabla del historial: dibuja el movimiento según su
// tipo (cambio de estado, entrada, salida, cambio de ubicación, alta o
// reposición antigua). Se separó de TablaHistorial.tsx para que ese
// archivo no creciera con cada tipo nuevo.
// Usa los estilos de TablaHistorial.css.
// Cubre: HU-06 (CA-06.1), RF-13, RF-10

import type { CambioEstado } from '../types/CambioEstado';
import type { EstadoRecurso } from '../types/Recurso';
import { textoEstado } from '../utils/inventario';
import { textoSubtipo } from '../utils/historial';

interface PropsDetalleCambioHistorial {
  cambio: CambioEstado;
}

// Componente DetalleCambioHistorial
// Recibe: un movimiento del historial.
// Devuelve: el texto del movimiento con las etiquetas de estado.
function DetalleCambioHistorial(props: PropsDetalleCambioHistorial) {
  const cambio = props.cambio;

  // Etiqueta de colores de un estado. Es una función dentro del componente
  // porque la usan varios tipos de movimiento.
  function etiquetaEstado(estado: EstadoRecurso) {
    return <span className={'etiqueta etiqueta-' + estado}>{textoEstado(estado)}</span>;
  }

  // Si el movimiento tiene unidad (número de serie), la mostramos al final
  let textoUnidad = '';
  if (cambio.unidad !== undefined) {
    textoUnidad = ' · unidad ' + cambio.unidad;
  }

  // Alta del recurso. Ej: Alta 10 → [Disponible]
  if (cambio.tipo === 'alta') {
    return (
      <>
        <span className="tabla-historial-reposicion">Alta {cambio.cantidad}</span>
        {' → '}
        {etiquetaEstado('disponible')}
      </>
    );
  }

  // Reposición ANTIGUA (los registros viejos no se pueden modificar).
  // Ej: Reposición +10 → [Disponible]
  if (cambio.tipo === 'reposicion') {
    return (
      <>
        <span className="tabla-historial-reposicion">Reposición +{cambio.cantidad}</span>
        {' → '}
        {etiquetaEstado('disponible')}
      </>
    );
  }

  // Entrada. Ej: Entrada · Préstamo +2 → [Disponible]
  if (cambio.tipo === 'entrada') {
    let nombreEntrada = 'Entrada';
    if (cambio.subtipo !== undefined) {
      nombreEntrada = 'Entrada · ' + textoSubtipo(cambio.subtipo);
    }
    return (
      <>
        <span className="tabla-historial-reposicion">
          {nombreEntrada} +{cambio.cantidad}
        </span>
        {' → '}
        {etiquetaEstado('disponible')}
      </>
    );
  }

  // Salida. Ej: Salida · Daño irreparable: [Disponible] → [Dado de baja] (1) · unidad FLK-0003
  if (cambio.tipo === 'salida') {
    let nombreSalida = 'Salida';
    if (cambio.subtipo !== undefined) {
      nombreSalida = 'Salida · ' + textoSubtipo(cambio.subtipo);
    }
    return (
      <>
        <span className="tabla-historial-reposicion">{nombreSalida}: </span>
        {etiquetaEstado(cambio.estadoAnterior)}
        {' → '}
        {etiquetaEstado(cambio.estadoNuevo)}
        <span className="tabla-historial-cantidad">
          {' '}
          ({cambio.cantidad}){textoUnidad}
        </span>
      </>
    );
  }

  // Cambio de ubicación. Ej: Ubicación: B307-B1-M2 → B308-B2-M1
  if (cambio.tipo === 'cambio_ubicacion') {
    return (
      <>
        <span className="tabla-historial-reposicion">Ubicación: </span>
        {cambio.valorAnterior} {' → '} {cambio.valorNuevo}
      </>
    );
  }

  // Cambio de estado. Ej: [Disponible] → [Dañado] (1) · unidad FLK-0003
  return (
    <>
      {etiquetaEstado(cambio.estadoAnterior)}
      {' → '}
      {etiquetaEstado(cambio.estadoNuevo)}
      <span className="tabla-historial-cantidad">
        {' '}
        ({cambio.cantidad}){textoUnidad}
      </span>
    </>
  );
}

export default DetalleCambioHistorial;
