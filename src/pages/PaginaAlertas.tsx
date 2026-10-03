// PaginaAlertas.tsx
// Página del panel de alertas del laboratorio.
// Muestra las alertas automáticas de recursos dañados, en mantención
// o con stock bajo el mínimo.
// Cubre: HU-05 (panel de alertas), RF-04

import './PaginaAlertas.css';

// Componente PaginaAlertas
// No recibe props. Muestra la pantalla del panel de alertas.
function PaginaAlertas() {
  return (
    <section className="contenido-pagina">
      <h2>Panel de Alertas</h2>
      <p className="texto-secundario">
        Alertas automáticas de mantención, reparación y reposición de recursos.
      </p>
    </section>
  );
}

export default PaginaAlertas;
