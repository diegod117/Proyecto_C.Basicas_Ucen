// TablaReservas.tsx
// Componente de tabla que lista las reservas registradas.
// Ordena las reservas cronológicamente y permite cancelar reservas existentes.
// El docente solo ve y cancela sus propias reservas; el departamento solo consulta.
// Cubre: RF-03 (listado, ordenamiento y cancelación de reservas) y RNF-03

import { useState } from 'react';
import { obtenerReservasVisibles, cancelarReserva } from '../services/reservasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import type { Usuario } from '../types/Usuario';
import { puedeCancelarReserva, puedeVerTodasLasReservas } from '../utils/permisos';
import './TablaReservas.css';

// Props que recibe la tabla
interface TablaReservasProps {
  // Clave que se actualiza desde el componente padre para refrescar los datos.
  version?: number;
  // Callback opcional para avisar al padre cuando cambian las reservas.
  onReservaModificada?: () => void;
  // Usuario conectado: decide qué reservas se ven y cuáles se pueden cancelar (RNF-03)
  usuario: Usuario;
}

// Componente TablaReservas
// Renderiza una tabla HTML con las reservas ordenadas y opción de cancelación.
function TablaReservas({ version, onReservaModificada, usuario }: TablaReservasProps) {
  // Estado local para refrescar la tabla apenas se cancela una reserva.
  const [actualizacionInterna, setActualizacionInterna] = useState(0);

  // Obtenemos una copia de las reservas que este usuario puede ver (RNF-03),
  // para no mutar el arreglo original al ordenar.
  const reservas = [...obtenerReservasVisibles(usuario)];

  // El docente ve "Mis reservas"; el encargado y el departamento ven todas.
  let titulo = 'Reservas programadas';
  let textoSinReservas = 'No hay reservas registradas en este momento.';
  if (!puedeVerTodasLasReservas(usuario.rol)) {
    titulo = 'Mis reservas';
    textoSinReservas = 'No tienes reservas registradas.';
  }

  // La columna "Acción" solo existe si el rol puede cancelar al menos sus
  // propias reservas (encargado y docente). El departamento no la ve.
  const mostrarAcciones = puedeCancelarReserva(usuario.rol, true);

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
      <h3>{titulo}</h3>

      {reservas.length === 0 ? (
        <p className="sin-reservas-texto">{textoSinReservas}</p>
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
                {mostrarAcciones && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {reservas.map(function (reserva) {
                const recurso = obtenerRecursoPorId(reserva.recursoId);
                const nombreRecurso = recurso
                  ? `${recurso.nombre} (${recurso.ubicacion.codigo})`
                  : `Recurso #${reserva.recursoId}`;
                const horarioTexto = `${reserva.horaInicio} - ${reserva.horaFin}`;

                // ¿Esta reserva es del usuario conectado? (RNF-03)
                const esReservaPropia = reserva.docente === usuario.nombre;
                const sePuedeCancelar = puedeCancelarReserva(usuario.rol, esReservaPropia);

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
                    {mostrarAcciones && (
                      <td>
                        {/* El botón solo aparece si esta reserva se puede cancelar */}
                        {sePuedeCancelar && (
                          <button
                            type="button"
                            className="boton-cancelar-reserva"
                            onClick={function () {
                              manejarCancelar(reserva.id, nombreRecurso, reserva.fecha, horarioTexto);
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                        {!sePuedeCancelar && <span>—</span>}
                      </td>
                    )}
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
