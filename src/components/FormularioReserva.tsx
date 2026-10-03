// FormularioReserva.tsx
// Componente de formulario para reservar recursos del laboratorio.
// Implementa el patrón de "formulario controlado" con React useState.
// Cubre: HU-03 (reserva básica), HU-07 (cálculo y visualización de disponibilidad en tiempo real)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import { agregarReserva } from '../services/reservasService';
import {
  validarCamposReserva,
  calcularUnidadesDisponibles,
} from '../utils/disponibilidad';
import './FormularioReserva.css';

// Props que recibe el formulario
interface FormularioReservaProps {
  onReservaCreada?: () => void;
}

// Componente FormularioReserva
// Permite al docente seleccionar el recurso, fecha y rango horario,
// mostrando en tiempo real cuántas unidades quedan libres para ese tramo.
function FormularioReserva({ onReservaCreada }: FormularioReservaProps) {
  // --- Estados controlados del formulario ---
  const [recursoId, setRecursoId] = useState('');
  const [docente, setDocente] = useState('Prof. Martín Zepeda');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [asignatura, setAsignatura] = useState('');
  const [sala, setSala] = useState('');

  // Estados para avisos en pantalla
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Obtenemos los recursos desde el servicio
  const recursos = obtenerRecursos();

  // --- Cálculo dinámico de disponibilidad en tiempo real (HU-07) ---
  // Se recalcula automáticamente cada vez que el usuario cambia el recurso, la fecha o el horario.
  let unidadesDisponibles: number | null = null;
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

  // Limpiar campos luego de un registro exitoso
  function limpiarFormulario() {
    setRecursoId('');
    setFecha('');
    setHoraInicio('');
    setHoraFin('');
    setCantidad(1);
    setAsignatura('');
    setSala('');
  }

  // Manejador del evento de envío del formulario
  function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    // Validación de campos obligatorios y coherencia horaria
    const error = validarCamposReserva(
      recursoId,
      fecha,
      horaInicio,
      horaFin,
      cantidad,
      asignatura,
      sala
    );

    if (error !== '') {
      setMensajeError(error);
      return;
    }

    // Guardar en el servicio
    agregarReserva({
      recursoId: Number(recursoId),
      docente: docente.trim() === '' ? 'Prof. Martín Zepeda' : docente,
      fecha,
      horaInicio,
      horaFin,
      cantidad,
      asignatura,
      sala,
    });

    setMensajeExito('¡Reserva registrada con éxito!');
    limpiarFormulario();

    if (onReservaCreada) {
      onReservaCreada();
    }
  }

  return (
    <form className="formulario-reserva" onSubmit={manejarEnvio}>
      <h3>Nueva reserva</h3>

      {/* Alertas de error o éxito */}
      {mensajeError !== '' && (
        <div className="mensaje-error">{mensajeError}</div>
      )}
      {mensajeExito !== '' && (
        <div className="mensaje-exito">{mensajeExito}</div>
      )}

      {/* Fila 1: Selector de recurso y nombre del docente */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-recurso">Recurso *</label>
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
          <input
            id="campo-docente"
            type="text"
            value={docente}
            onChange={function (evento) {
              setDocente(evento.target.value);
              setMensajeError('');
              setMensajeExito('');
            }}
          />
        </div>
      </div>

      {/* Fila 2: Fecha de la reserva */}
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

      {/* Fila 3: Horario de inicio y fin */}
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

      {/* Aviso reactivo de disponibilidad en tiempo real (HU-07) */}
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

      {/* Fila 4: Cantidad requerida, Asignatura y Sala */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-cantidad">Cantidad *</label>
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

      <button type="submit" className="boton-confirmar">
        Confirmar reserva
      </button>
    </form>
  );
}

export default FormularioReserva;
