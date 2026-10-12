// EtiquetaEstadoIncidencia.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Un componente chiquitito: la "pastilla" de color que dice en qué etapa
// va una incidencia, como un semáforo:
//   amarillo = Pendiente, azul = En revisión, verde = Resuelta.
// Es "reutilizable": se puede usar en cualquier parte que necesite
// mostrar la etapa de una incidencia.
// *** Los colores están en EtiquetaEstadoIncidencia.css. ***
// En la guía: paso 3 (componentes pequeños).
// Cubre: HU-10 (historial de incidencias con estado visual)

import type { EstadoIncidencia } from '../types/Incidencia';
import './EtiquetaEstadoIncidencia.css';

// Solo necesita un dato: la etapa.
interface PropsEtiquetaEstado {
  estado: EstadoIncidencia;
}

// textoEstadoIncidencia
// Recibe: una etapa "fea", ej: 'en_revision'.
// Devuelve: el texto bonito, ej: "En revisión".
// Es el mismo truco de traductor que textoEstado en utils/inventario.ts.
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
// Recibe: una etapa.
// Devuelve: las clases CSS que le dan su color.
// Todas llevan "etiqueta-estado" (la forma de pastilla) + una del color.
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
// Recibe: la etapa de la incidencia.
// Devuelve: un <span> (un pedacito de texto) con el color y el texto de la etapa.
function EtiquetaEstadoIncidencia(props: PropsEtiquetaEstado) {
  return (
    <span className={claseDelEstado(props.estado)}>
      {textoEstadoIncidencia(props.estado)}
    </span>
  );
}

export default EtiquetaEstadoIncidencia;
