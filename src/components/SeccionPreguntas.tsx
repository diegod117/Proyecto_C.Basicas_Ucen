// SeccionPreguntas.tsx
// Sección "Preguntas frecuentes" de la bienvenida: cada pregunta en negrita y
// su respuesta en la misma línea, como texto de lectura (sin acordeones).
// Cubre: inicio de sesión (sección 3.4), HU-15 (mensajes de cuenta), RNF-01

import { preguntasFrecuentes } from '../data/preguntasBienvenida';
import './SeccionPreguntas.css';

// Componente SeccionPreguntas
// No recibe props. Devuelve el título y las preguntas con sus respuestas.
function SeccionPreguntas() {
  return (
    <section id="preguntas" className="bienv-seccion bienv-ancho bienv-grilla" aria-labelledby="preguntas-titulo">
      <h2 id="preguntas-titulo" className="bienv-titulo preguntas-titulo aparece">
        Preguntas frecuentes
      </h2>

      <div className="preguntas-texto aparece aparece-2">
        {/* Un <p> por pregunta. La pregunta va en <strong> (peso 600) y la
            respuesta sigue en la misma línea. */}
        {preguntasFrecuentes.map((item) => (
          <p key={item.pregunta} className="bienv-texto preguntas-item">
            <strong>{item.pregunta}</strong> {item.respuesta}
          </p>
        ))}
      </div>
    </section>
  );
}

export default SeccionPreguntas;
