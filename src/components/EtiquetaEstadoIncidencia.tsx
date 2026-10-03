// EtiquetaEstadoIncidencia.tsx
// Componente pequeño y reutilizable que muestra el estado de una incidencia
// como una etiqueta con color: amarillo (pendiente), azul (en revisión)
// o verde (resuelta).
// Cubre: HU-10 (historial de incidencias con estado visual)

import type { EstadoIncidencia } from '../types/Incidencia';
import './EtiquetaEstadoIncidencia.css';

// Props que recibe la etiqueta: solo necesita el estado.
interface PropsEtiquetaEstado {
  estado: EstadoIncidencia;
}

// textoEstadoIncidencia
// Recibe: un estado de incidencia, por ejemplo 'en_revision'.
// Devuelve: el texto para mostrar al usuario, por ejemplo "En revisión".
// Es similar a textoEstado de inventario.ts, pero para incidencias.
function textoEstadoIncidencia(estado: EstadoIncidencia): string {
  if (estado === 'pendiente') {
    return 'Pendiente';
  } else if (estado === 'en_revision') {
    return 'En revisión';
  } else {
    return 'Resuelta';
  }
}

// claseDelEstado
// Recibe: un estado de incidencia.
// Devuelve: la clase CSS que le da el color correspondiente.
function claseDelEstado(estado: EstadoIncidencia): string {
  if (estado === 'pendiente') {
    return 'etiqueta-estado etiqueta-estado-pendiente';
  } else if (estado === 'en_revision') {
    return 'etiqueta-estado etiqueta-estado-en-revision';
  } else {
    return 'etiqueta-estado etiqueta-estado-resuelta';
  }
}

// Componente EtiquetaEstadoIncidencia
// Recibe: estado (el estado de la incidencia).
// Devuelve: un <span> con el texto y color del estado.
function EtiquetaEstadoIncidencia(props: PropsEtiquetaEstado) {
  return (
    <span className={claseDelEstado(props.estado)}>
      {textoEstadoIncidencia(props.estado)}
    </span>
  );
}

export default EtiquetaEstadoIncidencia;
