// FormularioReserva.tsx
// Componente de formulario para reservar recursos del laboratorio.
// Implementa el patrón de "formulario controlado" con React useState.
// Cubre: HU-03 (selector de recurso, cantidad, asignatura y sala), RF-03

import { useState } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import './FormularioReserva.css';

// Componente FormularioReserva
// Permite al docente seleccionar el recurso a reservar, cantidad de unidades,
// fecha, horario, asignatura y sala de destino.
function FormularioReserva() {
  // --- Estados controlados del formulario ---
  // Guardamos cada valor en un useState individual
  const [recursoId, setRecursoId] = useState('');
  const [docente, setDocente] = useState('Prof. Martín Zepeda');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [asignatura, setAsignatura] = useState('');
  const [sala, setSala] = useState('');

  // Obtenemos los recursos desde el servicio de recursos implementado por Johann.
  // La lista se usa para poblar dinámicamente las opciones del <select>.
  const recursos = obtenerRecursos();

  return (
    <form className="formulario-reserva">
      <h3>Nueva reserva</h3>

      {/* Fila 1: Selector de recurso y nombre del docente */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-recurso">Recurso</label>
          <select
            id="campo-recurso"
            value={recursoId}
            onChange={function (evento) {
              setRecursoId(evento.target.value);
            }}
          >
            <option value="">Seleccione un recurso</option>
            {/* .map() itera sobre cada recurso para renderizar un <option> */}
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
          <label htmlFor="campo-docente">Docente</label>
          <input
            id="campo-docente"
            type="text"
            value={docente}
            onChange={function (evento) {
              setDocente(evento.target.value);
            }}
          />
        </div>
      </div>

      {/* Fila 2: Fecha de la reserva */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-fecha">Fecha</label>
          <input
            id="campo-fecha"
            type="date"
            value={fecha}
            onChange={function (evento) {
              setFecha(evento.target.value);
            }}
          />
        </div>
      </div>

      {/* Fila 3: Horario de inicio y fin */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-hora-inicio">Hora inicio</label>
          <input
            id="campo-hora-inicio"
            type="time"
            value={horaInicio}
            onChange={function (evento) {
              setHoraInicio(evento.target.value);
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-hora-fin">Hora fin</label>
          <input
            id="campo-hora-fin"
            type="time"
            value={horaFin}
            onChange={function (evento) {
              setHoraFin(evento.target.value);
            }}
          />
        </div>
      </div>

      {/* Fila 4: Cantidad requerida, Asignatura y Sala */}
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="campo-cantidad">Cantidad</label>
          <input
            id="campo-cantidad"
            type="number"
            min="1"
            value={cantidad}
            onChange={function (evento) {
              setCantidad(Number(evento.target.value));
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-asignatura">Asignatura</label>
          <input
            id="campo-asignatura"
            type="text"
            placeholder="Ej: Física I"
            value={asignatura}
            onChange={function (evento) {
              setAsignatura(evento.target.value);
            }}
          />
        </div>

        <div className="campo">
          <label htmlFor="campo-sala">Sala</label>
          <input
            id="campo-sala"
            type="text"
            placeholder="Ej: B302"
            value={sala}
            onChange={function (evento) {
              setSala(evento.target.value);
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
