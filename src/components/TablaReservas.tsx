// TablaReservas.tsx
// Componente de tabla que lista las reservas registradas.
// Ordena las reservas cronológicamente y permite cancelar reservas existentes.
// Cubre: RF-03 (listado, ordenamiento y cancelación de reservas)

import { useState } from 'react';
import { obtenerReservas, cancelarReserva } from '../services/reservasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import './TablaReservas.css';

// Props que recibe la tabla
interface TablaReservasProps {
  // Clave que se actualiza desde el componente padre para refrescar los datos.
  version?: number;
  // Callback opcional para avisar al padre cuando cambian las reservas.
  onReservaModificada?: () => void;
}

// Componente TablaReservas
// Renderiza una tabla HTML con las reservas ordenadas y opción de cancelación.
function TablaReservas({ version, onReservaModificada }: TablaReservasProps) {
  // Estado local para refrescar la tabla apenas se cancela una reserva.
  const [actualizacionInterna, setActualizacionInterna] = useState(0);

  // Obtenemos una copia de las reservas para no mutar el arreglo original al ordenar.
  const reservas = [...obtenerReservas()];

  // Ordenamiento cronológico: primero fecha, luego hora de inicio.
  reservas.sort(function (a, b) {
    if (a.fecha < b.fecha) {
      return -1;
    }
    if (a.fecha > b.fecha) {
      return 1;
    }
    if (a.horaInicio < b.horaInicio) {
      return -1;
    }
    if (a.horaInicio > b.horaInicio) {
      return 1;
    }
    return 0;
  });

  // Cancela una reserva después de confirmar con el usuario.
  function manejarCancelar(id: number, nombreRecurso: string, fecha: string, horario: string) {
    const mensajeConfirmacion = `¿Estás seguro de que deseas cancelar la reserva de:\n${nombreRecurso}\nFecha: ${fecha} (${horario})?`;

    const usuarioConfirmo = window.confirm(mensajeConfirmacion);

    if (usuarioConfirmo) {
      cancelarReserva(id);
      setActualizacionInterna(function (prev) {
        return prev + 1;
      });

      if (onReservaModificada) {
        onReservaModificada();
      }
    }
  }

  return (
    <div className="tabla-reservas-contenedor" key={`${version}-${actualizacionInterna}`}>
      <h3>Reservas programadas</h3>

      {reservas.length === 0 ? (
        <p className="sin-reservas-texto">No hay reservas registradas en este momento.</p>
      ) : (
        <div className="tabla-scroll">
          <table className="tabla-reservas">
            <thead>
              <tr>
                <th>Recurso</th>
                <th>Docente</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Cant.</th>
                <th>Asignatura</th>
                <th>Sala</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(function (reserva) {
                const recurso = obtenerRecursoPorId(reserva.recursoId);
                const nombreRecurso = recurso
                  ? `${recurso.nombre} (${recurso.ubicacion.codigo})`
                  : `Recurso #${reserva.recursoId}`;
                const horarioTexto = `${reserva.horaInicio} - ${reserva.horaFin}`;

                return (
                  <tr key={reserva.id}>
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
                      <button
                        type="button"
                        className="boton-cancelar-reserva"
                        onClick={function () {
                          manejarCancelar(reserva.id, nombreRecurso, reserva.fecha, horarioTexto);
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TablaReservas;
