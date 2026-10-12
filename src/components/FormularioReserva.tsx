// FormularioReserva.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El formulario "Nueva reserva" de la página de Reservas.
// Un profesor (o el encargado) elige qué recurso quiere, para qué día, a qué
// hora y cuántas unidades. Mientras llena el formulario, la app le va
// diciendo cuántas unidades quedan libres a esa hora (HU-07), y si no
// alcanzan, apaga el botón (HU-08).
// Es un "formulario controlado": cada cajita guarda lo que escribes en un
// useState (ver guía, paso 4).
// Cubre: HU-03 (reserva básica), HU-07 (cálculo disponibilidad), HU-08 (desactivar botón por falta de stock)
// y RNF-03 (el docente reserva siempre a su propio nombre)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import { agregarReserva } from '../services/reservasService';
import {
  validarCamposReserva,
  calcularUnidadesDisponibles,
  validarDisponibilidadReserva,
} from '../utils/disponibilidad';
import type { Usuario } from '../types/Usuario';
import { puedeReservarAOtroDocente } from '../utils/permisos';
import './FormularioReserva.css';

// Las props que le pasa PaginaReservas.
interface FormularioReservaProps {
  // Una función opcional ("?") para avisar que se creó una reserva.
  onReservaCreada?: () => void;
  // La persona conectada: decide qué nombre va en la cajita "Docente" (RNF-03).
  usuario: Usuario;
}

// Componente FormularioReserva
// Las props se reciben "desarmadas" con llaves { } (ver TablaReservas.tsx):
// así se escribe "usuario" en vez de "props.usuario".
// Devuelve: el formulario completo.
function FormularioReserva({ onReservaCreada, usuario }: FormularioReservaProps) {
  // ---------------------------------------------------------------
  // LA MEMORIA DEL FORMULARIO: un useState por cada cajita.
  // ---------------------------------------------------------------
  // El recurso elegido. Es texto porque el <select> entrega texto
  // ('' = todavía no se elige nada).
  const [recursoId, setRecursoId] = useState('');
  // La cajita "Docente" (RNF-03):
  //   - Si eres docente, parte con TU nombre y queda bloqueada (gris).
  //   - Si eres el encargado, parte vacía y puedes escribir el nombre del profesor.
  const sePuedeEditarDocente = puedeReservarAOtroDocente(usuario.rol);
  let docenteInicial = usuario.nombre;
  if (sePuedeEditarDocente) {
    docenteInicial = '';
  }
  const [docente, setDocente] = useState(docenteInicial);
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  // Aquí la cantidad SÍ es número (parte en 1).
  const [cantidad, setCantidad] = useState(1);
  const [asignatura, setAsignatura] = useState('');
  const [sala, setSala] = useState('');

  // Los mensajes que se ven en pantalla (rojo y verde) y si estamos guardando.
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Los recursos para las opciones del menú "Recurso".
  const recursos = obtenerRecursos();

  // ---------------------------------------------------------------
  // ¿CUÁNTAS QUEDAN LIBRES? (HU-07) — se recalcula con cada letra
  // ---------------------------------------------------------------
  // "number | null": un número, o null si todavía no se puede calcular.
  let unidadesDisponibles: number | null = null;
  // Solo se puede calcular si ya hay recurso, fecha, las dos horas, y la
  // hora de fin es después de la de inicio. Todas unidas con && ("y").
  const datosCompletosParaCalculo =
    recursoId !== '' &&
    fecha !== '' &&
    horaInicio !== '' &&
    horaFin !== '' &&
    horaFin > horaInicio;

  if (datosCompletosParaCalculo) {
    unidadesDisponibles = calcularUnidadesDisponibles(
      Number(recursoId),
      fecha,
      horaInicio,
      horaFin
    );
  }

  // ---------------------------------------------------------------
  // ¿HAY QUE APAGAR EL BOTÓN? (HU-08)
  // ---------------------------------------------------------------
  // Sí, si ya calculamos (no es null) Y (no queda ninguna O se piden más de las que hay).
  const bloqueoPorDisponibilidad =
    unidadesDisponibles !== null &&
    (unidadesDisponibles === 0 || cantidad > unidadesDisponibles);

  // limpiarFormulario
  // Deja las cajitas vacías después de guardar una reserva.
  // (El docente no se limpia, para no tener que escribirlo otra vez.)
  function limpiarFormulario() {
    setRecursoId('');
    setFecha('');
    setHoraInicio('');
    setHoraFin('');
    setCantidad(1);
    setAsignatura('');
    setSala('');
  }

  // manejarEnvio
  // Se ejecuta al apretar "Confirmar reserva".
  // Recibe: el evento del formulario. No devuelve nada.
  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault(); // que no se recargue la página
    setMensajeError('');
    setMensajeExito('');

    // 1. ¿Están todas las cajitas obligatorias? (HU-03)
    const errorCampos = validarCamposReserva(
      recursoId,
      fecha,
      horaInicio,
      horaFin,
      cantidad,
      asignatura,
      sala
    );

    if (errorCampos !== '') {
      setMensajeError(errorCampos);
      return;
    }

    // El docente también es obligatorio.
    if (docente.trim() === '') {
      setMensajeError('Debe indicar el nombre del docente.');
      return;
    }

    // 2. ¿Alcanzan las unidades a esa hora? (HU-08)
    const errorDisponibilidad = validarDisponibilidadReserva(
      Number(recursoId),
      fecha,
      horaInicio,
      horaFin,
      cantidad
    );

    if (errorDisponibilidad !== '') {
      setMensajeError(errorDisponibilidad);
      return;
    }

    setGuardando(true);

    // try / catch / finally:
    //   try     -> intenta guardar
    //   catch   -> si algo explota (ej: sin internet), muestra un error
    //   finally -> esto se ejecuta SIEMPRE al final, haya salido bien o mal
    try {
      // 3. Guardar. Le pasamos un objeto con todos los datos.
      // "fecha," (sin ": algo") es un atajo de "fecha: fecha": cuando el dato
      // y la variable se llaman igual, basta con escribirlo una vez.
      await agregarReserva({
        recursoId: Number(recursoId),
        docente: docente.trim(),
        fecha,
        horaInicio,
        horaFin,
        cantidad,
        asignatura,
        sala,
      });

      setMensajeExito('¡Reserva registrada con éxito!');
      limpiarFormulario();

      // Si el papá nos pasó la función (es opcional), le avisamos.
      if (onReservaCreada) {
        onReservaCreada();
      }
    } catch (error) {
      console.error('Error al guardar reserva:', error);
      setMensajeError('Error al guardar la reserva. Revise su conexión.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-reserva" onSubmit={manejarEnvio}>
      <h3>Nueva reserva</h3>

      {/* Los mensajes rojo (error) y verde (éxito), solo si tienen texto. */}
      {mensajeError !== '' && (
        <div className="mensaje-error">{mensajeError}</div>
      )}
      {mensajeExito !== '' && (
        <div className="mensaje-exito">{mensajeExito}</div>
      )}

      {/* Fila 1: el recurso y el docente, lado a lado.
          grupo-campos = una fila; campo = una columna con su etiqueta y cajita. */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-recurso">Recurso *</label>
          {/* Aquí onChange usa una función normal (function) con VARIAS
              instrucciones: guarda el valor y borra los mensajes viejos. */}
          <select
            id="campo-recurso"
            value={recursoId}
            onChange={function (evento) {
              setRecursoId(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          >
            <option value="">Seleccione un recurso</option>
            {recursos.map(function (recurso) {
              return (
                <option key={recurso.id} value={recurso.id}>
                  {recurso.nombre} ({recurso.ubicacion.codigo})
                </option>
              );
            })}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="campo-docente">Docente *</label>
          {/* disabled = la cajita queda gris y no se puede escribir.
              !sePuedeEditarDocente = "si NO puede editar" -> bloqueada (docente). */}
          <input
            id="campo-docente"
            type="text"
            placeholder="Nombre del profesor"
            value={docente}
            disabled={!sePuedeEditarDocente}
            onChange={function (evento) {
              setDocente(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>
      </div>

      {/* Fila 2: la fecha. type="date" muestra un calendario para elegir. */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-fecha">Fecha *</label>
          <input
            id="campo-fecha"
            type="date"
            value={fecha}
            onChange={function (evento) {
              setFecha(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>
      </div>

      {/* Fila 3: hora de inicio y de fin. type="time" muestra un reloj. */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-hora-inicio">Hora inicio *</label>
          <input
            id="campo-hora-inicio"
            type="time"
            value={horaInicio}
            onChange={function (evento) {
              setHoraInicio(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-hora-fin">Hora fin *</label>
          <input
            id="campo-hora-fin"
            type="time"
            value={horaFin}
            onChange={function (evento) {
              setHoraFin(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>
      </div>

      {/* El aviso verde o rojo de "cuántas quedan" (HU-07).
          Solo aparece cuando ya se pudo calcular (no es null).
          La clase y el texto se eligen con ternarios (condicion ? a : b):
            hay unidades -> verde "✔ Disponibles..."
            no hay       -> rojo  "✖ Sin unidades..." */}
      {unidadesDisponibles !== null && (
        <div
          className={
            unidadesDisponibles > 0
              ? 'aviso-disponibilidad hay-unidades'
              : 'aviso-disponibilidad sin-unidades'
          }
        >
          {unidadesDisponibles > 0
            ? `✔ Disponibles en este horario: ${unidadesDisponibles} unidad(es)`
            : '✖ Sin unidades disponibles en este horario (todas reservadas)'}
        </div>
      )}

      {/* Fila 4: cantidad, asignatura y sala (tres columnas). */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-cantidad">Cantidad *</label>
          {/* Number(...) convierte el texto de la cajita en número antes de guardarlo. */}
          <input
            id="campo-cantidad"
            type="number"
            min="1"
            value={cantidad}
            onChange={function (evento) {
              setCantidad(Number(evento.target.value));
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-asignatura">Asignatura *</label>
          <input
            id="campo-asignatura"
            type="text"
            placeholder="Ej: Física I"
            value={asignatura}
            onChange={function (evento) {
              setAsignatura(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-sala">Sala *</label>
          <input
            id="campo-sala"
            type="text"
            placeholder="Ej: B302"
            value={sala}
            onChange={function (evento) {
              setSala(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>
      </div>

      {/* El botón. Se apaga (disabled) si no alcanzan las unidades O si está guardando.
          Su texto usa un ternario DOBLE (uno dentro de otro). Se lee así:
            ¿guardando?                -> "Guardando..."
            si no, ¿no hay suficientes? -> "Sin disponibilidad suficiente"
            si no                       -> "Confirmar reserva" */}
      <button
        type="submit"
        className="boton-confirmar"
        disabled={bloqueoPorDisponibilidad || guardando}
      >
        {guardando
          ? 'Guardando...'
          : bloqueoPorDisponibilidad
          ? 'Sin disponibilidad suficiente'
          : 'Confirmar reserva'}
      </button>
    </form>
  );
}

export default FormularioReserva;
