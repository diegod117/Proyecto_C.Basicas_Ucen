// PaginaConfiguracion.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página "CONFIGURACIÓN" (dirección /configuracion, SOLO el encargado).
// Desde aquí se agregan categorías de recursos, torres y salas nuevas con
// un botón, sin tocar el código (pedido del profesor). Así el sistema
// puede CRECER: si mañana construyen la torre D, el encargado la agrega
// aquí y listo (escalabilidad, RNF-05).
// La página tiene tres partes, y cada una vive en su propio componente
// (SeccionCategorias, SeccionTorres y SeccionSalas) para que este archivo
// quede corto.
// En la guía: paso 13 (Configuración).
// Cubre: RF-08 (categorías), RF-10 (torres y salas), RNF-05

import { useState } from 'react';
import SeccionCategorias from '../components/SeccionCategorias';
import SeccionTorres from '../components/SeccionTorres';
import SeccionSalas from '../components/SeccionSalas';
import './PaginaConfiguracion.css';

// Componente PaginaConfiguracion
// No recibe props. Devuelve: la página con las tres secciones.
function PaginaConfiguracion() {
  // Un contador de cambios: cada vez que una sección agrega algo, suma 1.
  // ¿Para qué? Las listas viven en el servicio (no en un useState), así
  // que React no se entera solo. Al cambiar este useState, React redibuja
  // la página COMPLETA, con sus tres secciones. Así, por ejemplo, una torre
  // recién agregada aparece al tiro en el menú de torres de la sección de salas.
  const [cambios, setCambios] = useState(0);

  // registrarCambio
  // No recibe ni devuelve nada. Las secciones la llaman al agregar algo.
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

      {/* Las tres secciones. A cada una le pasamos la MISMA función
          (registrarCambio) para que nos avise cuando agrega algo. */}
      <div className="configuracion-secciones">
        <SeccionCategorias onAgregado={registrarCambio} />
        <SeccionTorres onAgregado={registrarCambio} />
        <SeccionSalas onAgregado={registrarCambio} />
      </div>
    </section>
  );
}

export default PaginaConfiguracion;
