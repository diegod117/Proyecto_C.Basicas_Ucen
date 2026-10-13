// PaginaIncidencias.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página de INCIDENCIAS (accidentes o problemas en el laboratorio).
// Tiene, de arriba a abajo:
//   1. El título "Incidencias".
//   2. Un mensaje verde de "¡listo!" (solo unos segundos, después de registrar).
//   3. El formulario para registrar una incidencia (solo el encargado).
//   4. La tabla con todas las incidencias.
// El docente no puede entrar a esta página (lo decide permisos.ts).
// En la guía: paso 3 (componentes y key) y paso 8 (incidencias).
// Cubre: HU-04 (formulario), HU-10 (historial), RF-05, RNF-03

import { useState } from 'react';
import FormularioIncidencia from '../components/FormularioIncidencia';
import TablaIncidencias from '../components/TablaIncidencias';
import { useUsuario } from '../context/ContextoUsuario';
import { puedeGestionarIncidencias } from '../utils/permisos';
import './PaginaIncidencias.css';

// Componente PaginaIncidencias
// No recibe props: ya no hace falta que App le pase la persona conectada,
// porque la sacamos con useUsuario() (ver guía, paso 6).
// Devuelve: la página completa.
function PaginaIncidencias() {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  // Con su rol decidimos si se ve el formulario (RNF-03).
  const usuario = useUsuario();
  // ¿Se muestra el mensaje verde? Parte en false (no se ve).
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Un contador que sube cada vez que se registra una incidencia.
  // Se usa como "key" de la tabla: cuando cambia, React tira la tabla vieja
  // y crea una nueva, que vuelve a leer las incidencias (¡incluida la nueva!).
  // Es el mismo truco de la "camiseta con número" que se usa en App.tsx.
  const [contador, setContador] = useState(0);

  // alRegistrarIncidencia
  // La llama el formulario cuando guardó una incidencia.
  // No recibe nada. No devuelve nada.
  function alRegistrarIncidencia() {
    setMostrarConfirmacion(true); // aparece el mensaje verde
    setContador(contador + 1); // la tabla se vuelve a crear

    // setTimeout = "ejecuta esto DESPUÉS de un rato". El rato va en
    // milisegundos: 3000 ms = 3 segundos. Como una alarma de cocina.
    // Pasados 3 segundos, el mensaje verde desaparece solo.
    setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 3000);
  }

  return (
    <section className="contenido-pagina">
      <h2>Incidencias</h2>

      {/* El mensaje verde, solo si mostrarConfirmacion es true. */}
      {mostrarConfirmacion && (
        <div className="mensaje-confirmacion">
          ✓ Incidencia registrada con éxito. Estado inicial: pendiente.
        </div>
      )}

      {/* El formulario: solo lo ve el encargado (RNF-03).
          Los demás (departamento) ven un aviso en su lugar. */}
      {puedeGestionarIncidencias(usuario.rol) && (
        <FormularioIncidencia
          onIncidenciaRegistrada={alRegistrarIncidencia}
        />
      )}
      {!puedeGestionarIncidencias(usuario.rol) && (
        <p className="texto-secundario">
          Tu rol solo permite consultar las incidencias. Para registrar una, avisa al
          encargado de laboratorio.
        </p>
      )}

      {/* La tabla con todas las incidencias (HU-10).
          key={contador}: cada vez que se registra una, la tabla se crea de nuevo
          y muestra la incidencia recién agregada.
          Fíjate que ya no le pasamos "usuario": la tabla lo saca sola con useUsuario(). */}
      <TablaIncidencias key={contador} />
    </section>
  );
}

export default PaginaIncidencias;
