// FilaReserva.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// UNA fila de la tabla de reservas. Muestra: recurso, docente, fecha,
// horario, cantidad, asignatura, sala, el ESTADO (Programada / En curso /
// Realizada, como una pastillita de color) y, si corresponde, el botón "Cancelar".
// Se separó de TablaReservas.tsx para que ese archivo no pasara de ~150
// líneas (regla del grupo). La tabla dibuja una FilaReserva por cada reserva.
// En la guía: paso 3 (props) y paso 12 (estados de la reserva).
// Cubre: RF-03 (listado y cancelación de reservas), RNF-03

import type { Reserva } from '../types/Reserva';
import { obtenerRecursoPorId } from '../services/recursosService';
import { obtenerEstadoReserva, textoEstadoReserva } from '../utils/estadoReserva';

// Las props que le pasa TablaReservas.
interface PropsFilaReserva {
  // La reserva que hay que dibujar en esta fila.
  reserva: Reserva;
  // true si la tabla tiene la columna "Acción" (si no, no dibujamos esa celda).
  mostrarAcciones: boolean;
  // true si la persona conectada puede cancelar ESTA reserva.
  sePuedeCancelar: boolean;
  // La función de la tabla para cancelar. Recibe los datos para la
  // pregunta "¿Estás seguro...?". El botón está aquí, pero la acción vive
  // en la tabla: la fila solo AVISA (igual que el menú le avisa a App).
  onCancelar: (id: number, nombreRecurso: string, fecha: string, horario: string) => void;
}

// Componente FilaReserva
// Recibe: la reserva, si se muestran acciones, si se puede cancelar y la
// función para cancelar.
// Devuelve: una fila <tr> de la tabla (tr = "table row", fila de tabla).
function FilaReserva(props: PropsFilaReserva) {
  // Nombre corto para no escribir "props.reserva." todo el rato.
  const reserva = props.reserva;

  // La reserva solo guarda el NÚMERO del recurso; buscamos su nombre.
  const recurso = obtenerRecursoPorId(reserva.recursoId);
  // Por si no lo encontramos (ej: lo borraron), partimos con "Recurso #5".
  let nombreRecurso = 'Recurso #' + reserva.recursoId;
  if (recurso) {
    // Lo encontramos: "Multímetro (B307-B1-M2)".
    nombreRecurso = recurso.nombre + ' (' + recurso.ubicacion.codigo + ')';
  }
  const horarioTexto = reserva.horaInicio + ' - ' + reserva.horaFin;

  // ¿En qué momento va? Lo calcula el reloj (ver utils/estadoReserva.ts).
  const estado = obtenerEstadoReserva(reserva);

  return (
    <tr>
      {/* td = "table data", una celda de la fila. */}
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
        {/* La pastillita de color. El nombre de la clase se ARMA pegando
            textos: 'etiqueta-reserva-' + 'en_curso' = 'etiqueta-reserva-en_curso'.
            Cada una tiene su color en TablaReservas.css. */}
        <span className={'etiqueta-reserva etiqueta-reserva-' + estado}>{textoEstadoReserva(estado)}</span>
      </td>
      {props.mostrarAcciones && (
        <td>
          {/* El botón solo aparece si ESTA reserva se puede cancelar.
              Si no, se ve una rayita "—". */}
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
