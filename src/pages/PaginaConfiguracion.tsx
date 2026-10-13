// PaginaConfiguracion.tsx
// Página "Configuración" (ruta /configuracion, solo el encargado).
// Desde aquí se agregan categorías de recursos, torres y salas nuevas sin
// tocar el código: así el sistema puede crecer (escalabilidad, RNF-05).
// Cada parte va en su propio componente (SeccionCategorias, SeccionTorres
// y SeccionSalas) para que este archivo quede corto.
// Cubre: RF-08 (categorías), RF-10 (torres y salas), RNF-05

import { useState } from 'react';
import SeccionCategorias from '../components/SeccionCategorias';
import SeccionTorres from '../components/SeccionTorres';
import SeccionSalas from '../components/SeccionSalas';
import './PaginaConfiguracion.css';

// Componente PaginaConfiguracion
// No recibe props. Devuelve la página con las tres secciones.
function PaginaConfiguracion() {
  // Contador de cambios: cada vez que una sección agrega algo, suma 1.
  // Al cambiar, React redibuja la página completa. Así, por ejemplo,
  // una torre recién agregada aparece al tiro en la lista de torres de
  // la sección de salas.
  const [cambios, setCambios] = useState(0);

  // registrarCambio
  // No recibe ni devuelve nada. La llaman las secciones al agregar algo.
  function registrarCambio() {
    setCambios(cambios + 1);
  }

  return (
    <section className="contenido-pagina">
      <header className="encabezado-pagina">
        <h2 className="encabezado-pagina-titulo">Configuración</h2>
        <p className="encabezado-pagina-descripcion">
          Agrega categorías de recursos, torres y salas. Aparecen al tiro en el inventario y en
          las reservas.
        </p>
      </header>

      <div className="configuracion-secciones">
        <SeccionCategorias onAgregado={registrarCambio} />
        <SeccionTorres onAgregado={registrarCambio} />
        <SeccionSalas onAgregado={registrarCambio} />
      </div>
    </section>
  );
}

export default PaginaConfiguracion;
