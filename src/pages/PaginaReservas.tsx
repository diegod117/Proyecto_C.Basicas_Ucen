// PaginaReservas.tsx
// Página de reservas. Por ahora es solo un borrador:
// muestra cuántas reservas de prueba hay, para comprobar que los datos cargan.
// Aquí se construirá el formulario de reserva.
// Cubre: HU-03 (pendiente), RF-03

import { listaReservasPrueba } from '../data/reservas';

// Componente PaginaReservas
// No recibe props. Devuelve el contenido de la página de reservas.
function PaginaReservas() {
  return (
    <section className="contenido-pagina">
      <h2>Reservas</h2>
      <p>Pendiente: HU-03 (formulario para reservar un recurso).</p>
      <p className="texto-secundario">
        Reservas de prueba cargadas: {listaReservasPrueba.length}
      </p>
    </section>
  );
}

export default PaginaReservas;
