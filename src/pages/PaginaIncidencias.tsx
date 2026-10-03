// PaginaIncidencias.tsx
// Página de incidencias. Por ahora es solo un borrador:
// muestra cuántas incidencias de prueba hay, para comprobar que los datos cargan.
// Aquí se construirá el formulario para registrar incidencias.
// Cubre: HU-04 (pendiente), RF-05

import { listaIncidenciasPrueba } from '../data/incidencias';

// Componente PaginaIncidencias
// No recibe props. Devuelve el contenido de la página de incidencias.
function PaginaIncidencias() {
  return (
    <section className="contenido-pagina">
      <h2>Incidencias</h2>
      <p>Pendiente: HU-04 (formulario para registrar una incidencia).</p>
      <p className="texto-secundario">
        Incidencias de prueba cargadas: {listaIncidenciasPrueba.length}
      </p>
    </section>
  );
}

export default PaginaIncidencias;
