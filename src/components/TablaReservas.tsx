// TablaReservas.tsx
// Componente de tabla que lista las reservas registradas.
// Ordena las reservas cronológicamente (por fecha y luego hora de inicio).
// Cubre: RF-03 (listado y ordenamiento de reservas)

import { obtenerReservas } from '../services/reservasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import './TablaReservas.css';

// Props que recibe la tabla
interface TablaReservasProps {
  // Clave o trigger que se actualiza cada vez que se agrega o cancela una reserva
  // para forzar a la tabla a re-renderizar los datos actualizados.
  version?: number;
}

// Componente TablaReservas
// Renderiza una tabla HTML estilizada con las reservas ordenadas por fecha.
function TablaReservas({ version }: TablaReservasProps) {
  // 1. Obtenemos las reservas desde el servicio
  // Usamos el operador spread [...] para clonar el arreglo original antes de ordenar,
  // ya que .sort() muta el arreglo sobre el cual se ejecuta y queremos respetar inmutabilidad.
  const reservas = [...obtenerReservas()];

  // 2. Ordenamiento cronológico con .sort() paso a paso:
  // - Si a.fecha < b.fecha, 'a' debe ir antes que 'b' (retornamos -1).
  // - Si a.fecha > b.fecha, 'b' debe ir antes que 'a' (retornamos 1).
  // - Si tienen la misma fecha, desempatamos comparando las horas de inicio.
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

  return (
    <div className="tabla-reservas-contenedor" key={version}>
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
              </tr>
            </thead>
            <tbody>
              {reservas.map(function (reserva) {
                // Buscamos los datos completos del recurso a partir de su ID
                const recurso = obtenerRecursoPorId(reserva.recursoId);
                const nombreRecurso = recurso
                  ? `${recurso.nombre} (${recurso.ubicacion.codigo})`
                  : `Recurso #${reserva.recursoId}`;

                return (
                  <tr key={reserva.id}>
                    <td>
                      <strong>{nombreRecurso}</strong>
                    </td>
                    <td>{reserva.docente}</td>
                    <td>{reserva.fecha}</td>
                    <td>
                      {reserva.horaInicio} - {reserva.horaFin}
                    </td>
                    <td>{reserva.cantidad}</td>
                    <td>{reserva.asignatura}</td>
                    <td>{reserva.sala}</td>
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
