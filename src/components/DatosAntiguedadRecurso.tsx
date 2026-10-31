// DatosAntiguedadRecurso.tsx
// Muestra la fecha de adquisición y la antigüedad de un recurso en la ficha.
// Se usa dentro del <dl> de "Datos del recurso" de FichaRecurso.
// Si el recurso no tiene fecha (los que ya estaban guardados), muestra "Sin fecha".
// Cubre: HU-13, RF-12 (CA-13.2)

import { obtenerFechaHoy } from '../utils/fechas';
import { textoAntiguedad } from '../utils/antiguedad';

interface PropsDatosAntiguedadRecurso {
  // Fecha "AAAA-MM-DD"; puede no venir porque el campo es opcional
  fechaAdquisicion?: string;
}

// Componente DatosAntiguedadRecurso
// Recibe: la fecha de adquisición del recurso (si la tiene).
// Devuelve: dos pares dt/dd (fecha y antigüedad), sin etiqueta extra
// (el "<> ... </>" es un Fragment, igual que el del stock mínimo en la ficha).
function DatosAntiguedadRecurso(props: PropsDatosAntiguedadRecurso) {
  let textoFecha = 'Sin fecha';
  if (props.fechaAdquisicion !== undefined && props.fechaAdquisicion !== '') {
    textoFecha = props.fechaAdquisicion;
  }

  return (
    <>
      <dt>Fecha de adquisición</dt>
      <dd>{textoFecha}</dd>
      <dt>Antigüedad</dt>
      <dd>{textoAntiguedad(props.fechaAdquisicion, obtenerFechaHoy())}</dd>
    </>
  );
}

export default DatosAntiguedadRecurso;
