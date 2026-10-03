// PaginaReservas.tsx
// Página de reservas del laboratorio.
// Permite al personal docente registrar nuevas reservas de materiales e instrumentos.
// Cubre: HU-03 (página y formulario de reserva), RF-03

import { useState } from 'react';
import FormularioReserva from '../components/FormularioReserva';
import { obtenerReservas } from '../services/reservasService';
import './PaginaReservas.css';

// Componente PaginaReservas
// Renderiza el encabezado del módulo y el formulario de nueva reserva.
function PaginaReservas() {
  // Estado local que se incrementa para forzar un re-renderizado
  // cuando el formulario completa una reserva con éxito.
  const [actualizaciones, setActualizaciones] = useState(0);

  const listaReservas = obtenerReservas();

  function manejarReservaCreada() {
    setActualizaciones(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

  return (
    <section className="contenido-pagina">
      <header className="pagina-reservas-header">
        <h2>Reservas de Laboratorio</h2>
        <p className="texto-secundario">
          Módulo para solicitar recursos, instrumentos y espacios de trabajo.
        </p>
        <span className="contador-reservas-badge">
          Reservas registradas: {listaReservas.length}
        </span>
      </header>

      <div className="pagina-reservas-contenedor">
        {/* Componente del formulario controlado */}
        <FormularioReserva onReservaCreada={manejarReservaCreada} />
      </div>
    </section>
  );
}

export default PaginaReservas;
