// PaginaReservas.tsx
// Página de reservas del laboratorio.
// Permite al personal docente registrar nuevas reservas de materiales e instrumentos
// y consultar el historial ordenado de reservas activas.
// Cubre: HU-03 (formulario), HU-07, HU-08 y RF-03 (tabla de reservas)

import { useState } from 'react';
import FormularioReserva from '../components/FormularioReserva';
import TablaReservas from '../components/TablaReservas';
import { obtenerReservas } from '../services/reservasService';
import './PaginaReservas.css';

// Componente PaginaReservas
// Renderiza el encabezado del módulo, el formulario y la tabla de reservas.
function PaginaReservas() {
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
        {/* Formulario para registrar una nueva reserva */}
        <FormularioReserva onReservaCreada={manejarReservaCreada} />

        {/* Tabla con el historial de reservas ordenadas cronológicamente (M11) */}
        <TablaReservas version={actualizaciones} />
      </div>
    </section>
  );
}

export default PaginaReservas;
