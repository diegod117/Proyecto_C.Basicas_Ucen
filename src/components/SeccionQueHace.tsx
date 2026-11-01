// SeccionQueHace.tsx
// Sección "Qué puedes hacer" de la bienvenida: con el selector se elige un
// rol y las filas muestran lo que ESE rol puede hacer en el sistema.
// Cubre: RNF-03 (qué hace cada rol), RNF-01

import { useState } from 'react';
import type { RolUsuario } from '../types/Usuario';
import SelectorRolBienvenida from './SelectorRolBienvenida';
import { filasSegunRol } from '../utils/bienvenida';
import { fotosQueHace } from '../data/bienvenida';
import './SeccionQueHace.css';

// Componente SeccionQueHace
// No recibe props. Devuelve la sección con el título, el selector y las filas.
function SeccionQueHace() {
  // Rol elegido en el selector. Parte en "docente" porque es el rol con más
  // personas; así, antes de elegir, se ve lo que le sirve a la mayoría.
  // Cada vez que cambia, React vuelve a dibujar la sección con las filas nuevas.
  const [rolElegido, setRolElegido] = useState<RolUsuario>('docente');

  const filas = filasSegunRol(rolElegido);

  return (
    <section id="que-hace" className="bienv-seccion bienv-ancho bienv-grilla" aria-labelledby="que-hace-titulo">
      {/* "aparece" va en el título, el selector y la LISTA completa, nunca en
          cada fila: al cambiar de rol se dibujan filas nuevas y, si tuvieran
          "aparece", quedarían invisibles (ver PaginaLogin.tsx). */}
      <h2 id="que-hace-titulo" className="bienv-display bienv-eje aparece">
        Todo el laboratorio, ordenado
      </h2>

      <div className="bienv-eje que-hace-selector aparece aparece-2">
        <SelectorRolBienvenida rolElegido={rolElegido} onElegir={setRolElegido} />
      </div>

      <div className="bienv-eje que-hace-lista aparece aparece-3">
        {/* .map recorre las filas del rol; "indice" dice qué foto le toca.
            key ayuda a React a saber qué fila es cuál al cambiar de rol. */}
        {filas.map((fila, indice) => (
          <article key={rolElegido + '-' + indice} className="fila-que-hace">
            <div className="fila-que-hace-texto">
              <h3 className="bienv-titulo">{fila.titulo}</h3>
              <p className="bienv-texto">{fila.texto}</p>
            </div>
            <img
              className={'fila-foto ' + fotosQueHace[indice].clase}
              src={'/bienvenida/' + fotosQueHace[indice].archivo}
              alt={fotosQueHace[indice].alt}
              loading="lazy"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default SeccionQueHace;
