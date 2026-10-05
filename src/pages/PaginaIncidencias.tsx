// PaginaIncidencias.tsx
// Página de incidencias: muestra el formulario para registrar una incidencia,
// un mensaje de confirmación y el historial de incidencias en una tabla.
// Solo el encargado ve el formulario; el departamento solo consulta la tabla.
// Cubre: HU-04 (formulario), HU-10 (historial), RF-05, RNF-03

import { useState } from 'react';
import FormularioIncidencia from '../components/FormularioIncidencia';
import TablaIncidencias from '../components/TablaIncidencias';
import type { Usuario } from '../types/Usuario';
import { puedeGestionarIncidencias } from '../utils/permisos';
import './PaginaIncidencias.css';

// Props que recibe la página desde App
interface PropsPaginaIncidencias {
  // Usuario conectado: decide si se muestra el formulario (RNF-03)
  usuario: Usuario;
}

// Componente PaginaIncidencias
// Recibe el usuario conectado. Devuelve la página completa de incidencias.
function PaginaIncidencias(props: PropsPaginaIncidencias) {
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

      {/* Formulario para registrar una incidencia nueva.
          Solo lo ve el encargado (RNF-03); los demás ven un aviso. */}
      {puedeGestionarIncidencias(props.usuario.rol) && (
        <FormularioIncidencia onIncidenciaRegistrada={alRegistrarIncidencia} />
      )}
      {!puedeGestionarIncidencias(props.usuario.rol) && (
        <p className="texto-secundario">
          Tu rol solo permite consultar las incidencias. Para registrar una, avisa al
          encargado de laboratorio.
        </p>
      )}

      {/* Historial de incidencias (HU-10) */}
      {/* La key={contador} hace que React vuelva a crear la tabla
          cada vez que se registra una incidencia, mostrando la nueva. */}
      <TablaIncidencias key={contador} usuario={props.usuario} />
    </section>
  );
}

export default PaginaIncidencias;
