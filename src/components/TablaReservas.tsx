// TablaReservas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La tabla con las RESERVAS, ordenadas por fecha y hora (la más próxima arriba).
// Cada fila tiene un botón "Cancelar" (si tienes permiso).
//   - Encargado: ve todas y cancela cualquiera.
//   - Docente: ve solo las suyas ("Mis reservas") y cancela las suyas.
//   - Departamento: ve todas, pero no puede cancelar.
// En la guía: paso 3 (tablas y .map) y paso 8 (reservas).
// Cubre: RF-03 (listado, ordenamiento y cancelación de reservas) y RNF-03

import { useState } from 'react';
import { obtenerReservasVisibles, cancelarReserva } from '../services/reservasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import type { Usuario } from '../types/Usuario';
import { puedeCancelarReserva, puedeVerTodasLasReservas } from '../utils/permisos';
import './TablaReservas.css';

// Las props que le pasa PaginaReservas.
interface TablaReservasProps {
  // Un número que el papá sube cuando las reservas cambian, para que la
  // tabla se vuelva a dibujar. Opcional ("?").
  version?: number;
  // Una función opcional para avisarle al papá que se canceló una reserva.
  onReservaModificada?: () => void;
  // La persona conectada: decide qué reservas se ven y cuáles se pueden cancelar.
  usuario: Usuario;
}

// Componente TablaReservas
// OJO, aquí las props se reciben de OTRA forma:
//   function TablaReservas({ version, onReservaModificada, usuario }: TablaReservasProps)
// Las llaves { } "desarman" el objeto props y sacan cada dato a su propia
// variable. Así se escribe "usuario" en vez de "props.usuario".
// Es lo mismo que recibir props, solo que más corto. (Se llama "desestructurar".)
// Devuelve: la tabla de reservas, o un mensaje si no hay ninguna.
function TablaReservas({ version, onReservaModificada, usuario }: TablaReservasProps) {
  // Un contador propio, para redibujar la tabla apenas se cancela una reserva.
  const [actualizacionInterna, setActualizacionInterna] = useState(0);

  // Una COPIA de las reservas que esta persona puede ver ([...lista] = copia).
  // Copiamos porque más abajo las ordenamos, y sort() cambia la lista que
  // ordena: así no desordenamos la lista original del servicio.
  const reservas = [...obtenerReservasVisibles(usuario)];

  // Los textos cambian según el rol.
  let titulo = 'Reservas programadas';
  let textoSinReservas = 'No hay reservas registradas en este momento.';
  if (!puedeVerTodasLasReservas(usuario.rol)) {
    titulo = 'Mis reservas';
    textoSinReservas = 'No tienes reservas registradas.';
  }

  // La columna "Acción" solo existe si el rol puede cancelar al menos SUS
  // reservas (encargado y docente). El departamento no la ve.
  const mostrarAcciones = puedeCancelarReserva(usuario.rol, true);

  // Ordenamos por fecha y, si es el mismo día, por hora de inicio.
  // sort compara dos reservas (a y b):
  //   devolver -1 = "a va primero", 1 = "b va primero", 0 = "da igual".
  // Las fechas "2026-10-08" se pueden comparar como texto porque van
  // año-mes-día: el orden alfabético coincide con el orden del calendario.
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

  // manejarCancelar
  // Recibe: el número de la reserva y algunos datos para la pregunta.
  // No devuelve nada. Pregunta "¿estás seguro?" y, si dicen que sí, la cancela.
  async function manejarCancelar(id: number, nombreRecurso: string, fecha: string, horario: string) {
    // Un template string (comillas invertidas): ${...} mete variables en el texto.
    // \n = salto de línea dentro del texto.
    const mensajeConfirmacion = `¿Estás seguro de que deseas cancelar la reserva de:\n${nombreRecurso}\nFecha: ${fecha} (${horario})?`;

    // window.confirm abre la ventanita "Aceptar / Cancelar" y devuelve true o false.
    const usuarioConfirmo = window.confirm(mensajeConfirmacion);

    if (usuarioConfirmo) {
      const exito = await cancelarReserva(id);

      if (exito) {
        // Subimos el contador propio para redibujar la tabla sin esa reserva.
        setActualizacionInterna(function (prev) {
          return prev + 1;
        });

        // Si el papá nos pasó la función (es opcional), le avisamos.
        if (onReservaModificada) {
          onReservaModificada();
        }
      } else {
        // alert = una ventanita con un mensaje y un solo botón "Aceptar".
        alert('Hubo un error al cancelar la reserva. Revise su conexión.');
      }
    }
  }

  return (
    // key: cuando cambia "version" o "actualizacionInterna", la key cambia y
    // React vuelve a crear la tabla desde cero (el mismo truco que en App.tsx).
    <div className="tabla-reservas-contenedor" key={`${version}-${actualizacionInterna}`}>
      <h3>{titulo}</h3>

      {/* Operador ternario dentro del JSX: condicion ? (si es verdad) : (si es mentira).
          Si no hay reservas -> el mensaje. Si hay -> la tabla. */}
      {reservas.length === 0 ? (
        <p className="sin-reservas-texto">{textoSinReservas}</p>
      ) : (
        // tabla-scroll deja deslizar la tabla hacia el lado en el celular.
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
              {/* Una fila por cada reserva. Aquí .map usa una función normal
                  (function) en vez de una flecha; hacen lo mismo. Como hay
                  cálculos antes de dibujar la fila, la función tiene llaves { }
                  y un return. */}
              {reservas.map(function (reserva) {
                // Buscamos el recurso para mostrar su nombre (la reserva solo guarda su número).
                const recurso = obtenerRecursoPorId(reserva.recursoId);
                // Ternario: si encontramos el recurso, "Nombre (código)";
                // si no, "Recurso #5".
                const nombreRecurso = recurso
                  ? `${recurso.nombre} (${recurso.ubicacion.codigo})`
                  : `Recurso #${reserva.recursoId}`;
                const horarioTexto = `${reserva.horaInicio} - ${reserva.horaFin}`;

                // ¿Esta reserva es de la persona conectada? (RNF-03)
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
                        {/* El botón solo aparece si ESTA reserva se puede cancelar.
                            Si no, se ve una rayita "—". */}
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
