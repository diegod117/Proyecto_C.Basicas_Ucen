// PaginaIncidencias.tsx
// Página de incidencias: muestra el formulario para registrar una incidencia,
// un mensaje de confirmación y el historial de incidencias en una tabla.
// Cubre: HU-04 (formulario), HU-10 (historial), RF-05

import { useState } from 'react';
import FormularioIncidencia from '../components/FormularioIncidencia';
import TablaIncidencias from '../components/TablaIncidencias';
import './PaginaIncidencias.css';

// Componente PaginaIncidencias
// No recibe props. Devuelve la página completa de incidencias.
function PaginaIncidencias() {
  // Controla si se muestra el mensaje de confirmación.
  // Parte en false: al principio solo se ve el formulario.
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Contador que se incrementa cada vez que se registra una incidencia.
  // Al cambiar, React vuelve a dibujar la tabla con los datos actualizados.
  // Es un truco simple: la tabla lee los datos del servicio cada vez que
  // se dibuja, y cambiar su "key" la obliga a dibujarse de nuevo.
  const [contador, setContador] = useState(0);

  // Se ejecuta cuando el formulario avisa que se registró una incidencia.
  // No recibe nada. No devuelve nada.
  function alRegistrarIncidencia() {
    setMostrarConfirmacion(true);
    setContador(contador + 1);

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

      {/* Historial de incidencias (HU-10) */}
      {/* La key={contador} hace que React vuelva a crear la tabla
          cada vez que se registra una incidencia, mostrando la nueva. */}
      <TablaIncidencias key={contador} />
    </section>
  );
}

export default PaginaIncidencias;
