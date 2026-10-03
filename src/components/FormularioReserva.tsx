// FormularioReserva.tsx
// Componente de formulario para reservar recursos del laboratorio.
// Implementa el patrón de "formulario controlado" con React useState.
// Cubre: HU-03 (fecha y horario de reserva), RF-03

import { useState } from 'react';
import './FormularioReserva.css';

// Componente FormularioReserva
// Permite al usuario seleccionar la fecha, la hora de inicio y la hora de fin.
function FormularioReserva() {
  // --- Estados controlados para fecha y horario ---
  // useState almacena el valor actual del input. Cada vez que el usuario escribe o cambia
  // la fecha/hora, se ejecuta la función set correspondiente y React actualiza la vista.
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  return (
    <form className="formulario-reserva">
      <h3>Nueva reserva</h3>

      {/* Fila: Fecha de la reserva */}
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

      {/* Fila: Horario de inicio y fin */}
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

      <button type="submit" className="boton-confirmar">
        Confirmar reserva
      </button>
    </form>
  );
}

export default FormularioReserva;
