// TablaReservas.tsx
// Componente de tabla que lista las reservas registradas.
// Se usa dos veces en la página de reservas, según "modo":
//   - 'activas':   las reservas programadas y en curso (se pueden cancelar)
//   - 'historial': las reservas ya realizadas (solo se consultan)
// Una reserva pasa sola al historial cuando termina su hora (ver
// utils/estadoReserva.ts). Cada fila está en FilaReserva.tsx.
// El docente solo ve y cancela sus propias reservas; el departamento solo consulta.
// Cubre: RF-03 (listado, ordenamiento y cancelación de reservas) y RNF-03

import { useState } from 'react';
import { obtenerReservasVisibles, cancelarReserva } from '../services/reservasService';
import type { Reserva } from '../types/Reserva';
import { obtenerEstadoReserva } from '../utils/estadoReserva';
import FilaReserva from './FilaReserva';
import { useUsuario } from '../context/ContextoUsuario';
import { puedeCancelarReserva, puedeVerTodasLasReservas } from '../utils/permisos';
import './TablaReservas.css';

// Props que recibe la tabla
interface TablaReservasProps {
  // Qué reservas muestra: las activas o el historial (las realizadas)
  modo: 'activas' | 'historial';
  // Clave que se actualiza desde el componente padre para refrescar los datos.
  version?: number;
  // Callback opcional para avisar al padre cuando cambian las reservas.
  onReservaModificada?: () => void;
}

// Componente TablaReservas
// Renderiza una tabla HTML con las reservas ordenadas y opción de cancelación.
// El usuario conectado (decide qué reservas se ven y cuáles se pueden cancelar,
// RNF-03) lo lee con useUsuario().
function TablaReservas({ modo, version, onReservaModificada }: TablaReservasProps) {
  // El usuario conectado viene del contexto (ver context/ContextoUsuario.ts)
  const usuario = useUsuario();
  // Estado local para refrescar la tabla apenas se cancela una reserva.
  const [actualizacionInterna, setActualizacionInterna] = useState(0);

  // De las reservas que este usuario puede ver (RNF-03), nos quedamos con
  // las del modo: activas (programada o en curso) o historial (realizada).
  // Es una lista NUEVA, así al ordenarla no se desordena la del servicio.
  const reservas: Reserva[] = [];
  for (const reserva of obtenerReservasVisibles(usuario)) {
    const realizada = obtenerEstadoReserva(reserva) === 'realizada';
    if ((modo === 'historial' && realizada) || (modo === 'activas' && !realizada)) {
      reservas.push(reserva);
    }
  }

  // Títulos según el modo y el rol: el docente ve solo las suyas
  const veTodas = puedeVerTodasLasReservas(usuario.rol);
  let titulo = 'Próximas reservas y en curso';
  let textoSinReservas = 'No hay reservas próximas.';
  if (modo === 'historial') {
    titulo = 'Historial de reservas (realizadas)';
    textoSinReservas = 'Todavía no hay reservas realizadas.';
  }
  if (!veTodas && modo === 'activas') {
    titulo = 'Mis próximas reservas y en curso';
  } else if (!veTodas && modo === 'historial') {
    titulo = 'Mi historial de reservas (realizadas)';
  }

  // La columna "Acción" solo existe en las activas, y si el rol puede
  // cancelar al menos sus propias reservas (encargado y docente).
  // Una reserva realizada ya pasó: no tiene sentido cancelarla.
  const mostrarAcciones = modo === 'activas' && puedeCancelarReserva(usuario.rol, true);

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

  // El historial se lee mejor con lo más reciente arriba: damos vuelta la lista
  if (modo === 'historial') {
    reservas.reverse();
  }

  // Cancela una reserva después de confirmar con el usuario.
  async function manejarCancelar(id: number, nombreRecurso: string, fecha: string, horario: string) {
    const mensajeConfirmacion = `¿Estás seguro de que deseas cancelar la reserva de:\n${nombreRecurso}\nFecha: ${fecha} (${horario})?`;

    const usuarioConfirmo = window.confirm(mensajeConfirmacion);

    if (usuarioConfirmo) {
      const exito = await cancelarReserva(id);
      
      if (exito) {
        setActualizacionInterna(function (prev) {
          return prev + 1;
        });

        if (onReservaModificada) {
          onReservaModificada();
        }
      } else {
        alert('Hubo un error al cancelar la reserva. Revise su conexión.');
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
                <th>Estado</th>
                {mostrarAcciones && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {reservas.map(function (reserva) {
                // ¿Esta reserva es del usuario conectado? (RNF-03)
                const esReservaPropia = reserva.docente === usuario.nombre;
                return (
                  <FilaReserva
                    key={reserva.id}
                    reserva={reserva}
                    mostrarAcciones={mostrarAcciones}
                    sePuedeCancelar={puedeCancelarReserva(usuario.rol, esReservaPropia)}
                    onCancelar={manejarCancelar}
                  />
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
