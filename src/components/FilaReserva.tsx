// FilaReserva.tsx
// Una fila de la tabla de reservas: recurso, docente, fecha, horario,
// cantidad, asignatura, sala, el estado (Programada / En curso / Realizada)
// y, si corresponde, el botón "Cancelar".
// Se separó de TablaReservas.tsx para que ese archivo no pasara de ~150 líneas.
// Cubre: RF-03 (listado y cancelación de reservas), RNF-03

import type { Reserva } from '../types/Reserva';
import { obtenerRecursoPorId } from '../services/recursosService';
import { obtenerEstadoReserva, textoEstadoReserva } from '../utils/estadoReserva';

interface PropsFilaReserva {
  reserva: Reserva;
  // true si existe la columna "Acción" en la tabla
  mostrarAcciones: boolean;
  // true si el usuario conectado puede cancelar ESTA reserva
  sePuedeCancelar: boolean;
  // Función de la tabla para cancelar (recibe los datos para la confirmación)
  onCancelar: (id: number, nombreRecurso: string, fecha: string, horario: string) => void;
}

// Componente FilaReserva
// Recibe: la reserva, si se muestran acciones, si se puede cancelar y la
// función para cancelar.
// Devuelve: una fila <tr> de la tabla.
function FilaReserva(props: PropsFilaReserva) {
  const reserva = props.reserva;

  const recurso = obtenerRecursoPorId(reserva.recursoId);
  let nombreRecurso = 'Recurso #' + reserva.recursoId;
  if (recurso) {
    nombreRecurso = recurso.nombre + ' (' + recurso.ubicacion.codigo + ')';
  }
  const horarioTexto = reserva.horaInicio + ' - ' + reserva.horaFin;

  // El estado se calcula con la hora actual (ver utils/estadoReserva.ts)
  const estado = obtenerEstadoReserva(reserva);

  return (
    <tr>
      <td>
        <strong>{nombreRecurso}</strong>
      </td>
      <td>{reserva.docente}</td>
      <td>{reserva.fecha}</td>
      <td>{horarioTexto}</td>
      <td>{reserva.cantidad}</td>
      <td>{reserva.asignatura}</td>
      <td>{reserva.sala}</td>
      <td>
        {/* La clase de color se arma con el estado: etiqueta-reserva-en_curso, etc. */}
        <span className={'etiqueta-reserva etiqueta-reserva-' + estado}>{textoEstadoReserva(estado)}</span>
      </td>
      {props.mostrarAcciones && (
        <td>
          {/* El botón solo aparece si esta reserva se puede cancelar */}
          {props.sePuedeCancelar && (
            <button
              type="button"
              className="boton-cancelar-reserva"
              onClick={function () {
                props.onCancelar(reserva.id, nombreRecurso, reserva.fecha, horarioTexto);
              }}
            >
              Cancelar
            </button>
          )}
          {!props.sePuedeCancelar && <span>—</span>}
        </td>
      )}
    </tr>
  );
}

export default FilaReserva;
