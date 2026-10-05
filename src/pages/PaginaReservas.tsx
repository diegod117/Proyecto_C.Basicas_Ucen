// PaginaReservas.tsx
// Página de reservas del laboratorio.
// Permite al personal docente registrar nuevas reservas
// y consultar o cancelar reservas existentes.
// Cubre: HU-03 (formulario), HU-07, HU-08 y RF-03 (tabla y cancelación)

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

  function refrescarDatos() {
    setActualizaciones(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

  return (
    <section className="contenido-pagina">
      <header className="pagina-reservas-header">
        <h2>Reservas de Laboratorio</h2>
        {/* M19: clase pagina-reservas-descripcion para el estilo del encabezado */}
        <p className="pagina-reservas-descripcion">
          Módulo para solicitar recursos, instrumentos y espacios de trabajo.
        </p>
        <span className="contador-reservas-badge">
          Reservas registradas: {listaReservas.length}
        </span>
      </header>

      <div className="pagina-reservas-contenedor">
        {/* Formulario para registrar una nueva reserva */}
        <FormularioReserva onReservaCreada={refrescarDatos} />

        {/* Tabla con el historial de reservas y botón de cancelación */}
        <TablaReservas version={actualizaciones} onReservaModificada={refrescarDatos} />
      </div>
    </section>
  );
}

export default PaginaReservas;
