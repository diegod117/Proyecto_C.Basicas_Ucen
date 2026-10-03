// PaginaIncidencias.tsx
// Página de incidencias: muestra el formulario para registrar una incidencia
// y un mensaje de confirmación cuando se registra con éxito.
// Cubre: HU-04 (formulario de incidencia), RF-05

import { useState } from 'react';
import FormularioIncidencia from '../components/FormularioIncidencia';
import './PaginaIncidencias.css';

// Componente PaginaIncidencias
// No recibe props. Devuelve la página completa de incidencias.
function PaginaIncidencias() {
  // Controla si se muestra el mensaje de confirmación.
  // Parte en false: al principio solo se ve el formulario.
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Se ejecuta cuando el formulario avisa que se registró una incidencia.
  // No recibe nada. No devuelve nada.
  function alRegistrarIncidencia() {
    setMostrarConfirmacion(true);

    // Después de 3 segundos, ocultamos el mensaje automáticamente.
    setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 3000);
  }

  return (
    <section className="contenido-pagina">
      <h2>Incidencias</h2>

      {/* Mensaje de confirmación: aparece tras registrar con éxito */}
      {mostrarConfirmacion && (
        <div className="mensaje-confirmacion">
          ✓ Incidencia registrada con éxito. Estado inicial: pendiente.
        </div>
      )}

      {/* Formulario para registrar una incidencia nueva */}
      <FormularioIncidencia onIncidenciaRegistrada={alRegistrarIncidencia} />
    </section>
  );
}

export default PaginaIncidencias;
