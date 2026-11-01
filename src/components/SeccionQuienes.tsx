// SeccionQuienes.tsx
// Sección "Hecho en la Central" de la bienvenida: quién hizo LabCentral,
// en qué asignatura y de dónde nació, con el sello de la carrera.
// Cubre: presentación del proyecto (no corresponde a una HU), RNF-01

import { integrantesEquipo } from '../data/bienvenida';
import './SeccionQuienes.css';

// Componente SeccionQuienes
// No recibe props. Devuelve la sección con el título, los datos cortos y
// los dos párrafos.
function SeccionQuienes() {
  return (
    <section id="quienes" className="bienv-seccion bienv-ancho bienv-grilla" aria-labelledby="quienes-titulo">
      <h2 id="quienes-titulo" className="bienv-display bienv-eje aparece">
        Hecho en la Central
      </h2>

      {/* Tres datos cortos al margen izquierdo (columnas 1 y 2) */}
      <div className="quienes-datos aparece aparece-2">
        <p className="bienv-nota">Universidad Central de Chile</p>
        <p className="bienv-nota">Santiago, 2026</p>
        <p className="bienv-nota">Programación de Aplicaciones</p>
      </div>

      <div className="quienes-texto aparece aparece-2">
        {/* El sello "flota" a la izquierda y el texto lo rodea */}
        <p className="quienes-parrafo">
          <img className="quienes-sello" src="/bienvenida/sello-carrera.jpg" alt="Sello de la carrera" loading="lazy" />
          LabCentral lo construimos{' '}
          <span className="quienes-nombre">{integrantesEquipo[0]}</span>,{' '}
          <span className="quienes-nombre">{integrantesEquipo[1]}</span> y{' '}
          <span className="quienes-nombre">{integrantesEquipo[2]}</span>, estudiantes de Ingeniería Civil en
          Computación e Informática de la Facultad de Ingeniería y Arquitectura, en la asignatura
          Programación de Aplicaciones del profesor Luis Rojas Rubio.
        </p>
        <p className="quienes-parrafo">
          Nació de una planilla de Excel que no decía si un equipo estaba operativo, dañado o en
          mantención. Los requisitos se validaron con el Departamento de Ciencias Básicas en octubre
          de 2026.
        </p>
      </div>
    </section>
  );
}

export default SeccionQuienes;
