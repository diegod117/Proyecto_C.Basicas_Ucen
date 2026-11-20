// SeccionQuienes.tsx
// Sección "Hecho en la Central" de la bienvenida: quién hizo LabCentral,
// en qué asignatura y de dónde nació, con el sello de la carrera.
// Todo va en un bloque centrado: sello, título, frase grande, párrafo y datos.
// Cubre: presentación del proyecto (no corresponde a una HU), RNF-01

import { integrantesEquipo } from '../data/bienvenida';
import './SeccionQuienes.css';

// Componente SeccionQuienes
// No recibe props. Devuelve la sección con el sello, el título, los dos
// párrafos y los datos cortos.
function SeccionQuienes() {
  return (
    <section id="quienes" className="bienv-seccion bienv-ancho" aria-labelledby="quienes-titulo">
      <div className="bienv-cabecera quienes-bloque">
        <img className="quienes-sello aparece" src="/bienvenida/sello-carrera.jpg" alt="Sello de la carrera" loading="lazy" />

        <h2 id="quienes-titulo" className="bienv-display aparece">
          Hecho en la Central
        </h2>

        {/* Frase grande: solo quiénes somos (corta, para que se lea de un vistazo) */}
        <p className="quienes-parrafo aparece aparece-2">
          LabCentral lo construimos{' '}
          <span className="quienes-nombre">{integrantesEquipo[0]}</span>,{' '}
          <span className="quienes-nombre">{integrantesEquipo[1]}</span> y{' '}
          <span className="quienes-nombre">{integrantesEquipo[2]}</span>.
        </p>

        {/* El resto va como texto normal */}
        <p className="bienv-texto quienes-detalle aparece aparece-2">
          Somos estudiantes de Ingeniería Civil en Computación e Informática de la Facultad de
          Ingeniería y Arquitectura, y lo hicimos en la asignatura Programación de Aplicaciones del
          profesor Luis Rojas Rubio. Nació de una planilla de Excel que no decía si un equipo estaba
          operativo, dañado o en mantención. Los requisitos se validaron con el Departamento de
          Ciencias Básicas en octubre de 2026.
        </p>

        {/* Tres datos cortos, en una fila centrada */}
        <div className="quienes-datos aparece aparece-3">
          <p className="bienv-nota">Universidad Central de Chile</p>
          <p className="bienv-nota">Santiago, 2026</p>
          <p className="bienv-nota">Programación de Aplicaciones</p>
        </div>
      </div>
    </section>
  );
}

export default SeccionQuienes;
