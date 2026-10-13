// TablaReservas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La tabla con las RESERVAS, ordenadas por fecha y hora.
// Se usa DOS VECES en la página de reservas (pedido del profesor). La prop
// "modo" le dice cuál de las dos ser:
//   - 'activas':   las reservas programadas y en curso (se pueden cancelar)
//   - 'historial': las reservas ya realizadas (solo se miran)
// Una reserva se cambia SOLA de la tabla 'activas' a 'historial' cuando
// termina su hora: nadie la mueve a mano (ver utils/estadoReserva.ts y
// guía, paso 12). Cada fila se dibuja con FilaReserva.tsx.
//   - Encargado: ve todas y cancela cualquiera.
//   - Docente: ve solo las suyas ("Mis reservas") y cancela las suyas.
//   - Departamento: ve todas, pero no puede cancelar.
// En la guía: paso 3 (tablas y .map), paso 8 (reservas) y paso 12.
// Cubre: RF-03 (listado, ordenamiento y cancelación de reservas) y RNF-03

import { useState } from 'react';
import { obtenerReservasVisibles, cancelarReserva } from '../services/reservasService';
import type { Reserva } from '../types/Reserva';
import { obtenerEstadoReserva } from '../utils/estadoReserva';
import FilaReserva from './FilaReserva';
import { useUsuario } from '../context/ContextoUsuario';
import { puedeCancelarReserva, puedeVerTodasLasReservas } from '../utils/permisos';
import './TablaReservas.css';

// Las props que le pasa PaginaReservas.
interface TablaReservasProps {
  // Qué reservas muestra. Solo puede ser uno de estos dos textos
  // (un "tipo unión", ver guía, paso 2).
  modo: 'activas' | 'historial';
  // Un número que el papá sube cuando las reservas cambian, para que la
  // tabla se vuelva a dibujar. Opcional ("?").
  version?: number;
  // Una función opcional para avisarle al papá que se canceló una reserva.
  onReservaModificada?: () => void;
}

// Componente TablaReservas
// OJO, aquí las props se reciben de OTRA forma:
//   function TablaReservas({ modo, version, onReservaModificada }: TablaReservasProps)
// Las llaves { } "desarman" el objeto props y sacan cada dato a su propia
// variable. Así se escribe "modo" en vez de "props.modo".
// Es lo mismo que recibir props, solo que más corto. (Se llama "desestructurar".)
// ¿Y la persona conectada? La sacamos con useUsuario() (guía, paso 6): decide
// qué reservas se ven y cuáles se pueden cancelar (RNF-03).
// Devuelve: la tabla de reservas, o un mensaje si no hay ninguna.
function TablaReservas({ modo, version, onReservaModificada }: TablaReservasProps) {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  const usuario = useUsuario();
  // Un contador propio, para redibujar la tabla apenas se cancela una reserva.
  const [actualizacionInterna, setActualizacionInterna] = useState(0);

  // ¿Qué reservas van en ESTA tabla?
  // Partimos con una lista vacía y metemos (push) solo las que tocan.
  // Es una lista NUEVA: así, cuando la ordenemos más abajo, no
  // desordenamos la lista original del servicio.
  // "Reserva[]" = una lista de reservas (le decimos el tipo porque parte vacía
  // y TypeScript no podría adivinar qué va a tener).
  const reservas: Reserva[] = [];
  for (const reserva of obtenerReservasVisibles(usuario)) {
    // ¿Ya terminó? Le preguntamos al reloj (estadoReserva.ts).
    const realizada = obtenerEstadoReserva(reserva) === 'realizada';
    // Se lee: "si soy el historial y está realizada, O si soy la de
    // activas y NO está realizada, entonces va en mi tabla".
    if ((modo === 'historial' && realizada) || (modo === 'activas' && !realizada)) {
      reservas.push(reserva);
    }
  }

  // Los títulos cambian según el modo y el rol (el docente ve solo las suyas).
  // Partimos con los de "activas" y los vamos cambiando con if.
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

  // La columna "Acción" (el botón Cancelar) solo existe en la tabla de
  // activas, y si el rol puede cancelar al menos SUS reservas (encargado y
  // docente). Una reserva realizada ya pasó: no tiene sentido cancelarla.
  const mostrarAcciones = modo === 'activas' && puedeCancelarReserva(usuario.rol, true);

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

  // En el historial conviene ver lo MÁS RECIENTE arriba, así que damos
  // vuelta la lista (reverse = de atrás para adelante).
  if (modo === 'historial') {
    reservas.reverse();
  }

  // manejarCancelar
  // Recibe: el número de la reserva y algunos datos para la pregunta.
  // No devuelve nada. Pregunta "¿estás seguro?" y, si dicen que sí, la cancela.
  // Se la pasamos a cada FilaReserva por props: el botón está en la fila,
  // pero la acción vive aquí.
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
    // React vuelve a crear la tabla desde cero (el truco de la "camiseta").
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
                <th>Estado</th>
                {mostrarAcciones && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {/* Una fila por cada reserva. Aquí .map usa una función normal
                  (function) en vez de una flecha; hacen lo mismo.
                  Cada fila es un componente FilaReserva (un archivo aparte,
                  para que este no quede tan largo). Le pasamos por props
                  todo lo que necesita para dibujarse. */}
              {reservas.map(function (reserva) {
                // ¿Esta reserva es de la persona conectada? (RNF-03)
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
