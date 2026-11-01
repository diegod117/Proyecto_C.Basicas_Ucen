// BarraBienvenida.tsx
// Fila de arriba de la página de bienvenida, hecha de tiles:
// la marca UCEN (vuelve al inicio), los 4 enlaces a las secciones y el
// botón "Ingresar", que lleva el cursor al campo de correo.
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01

import { enfocarCampoCorreo } from '../utils/bienvenida';
import './BarraBienvenida.css';

// Componente BarraBienvenida
// No recibe props. Devuelve la barra de tiles.
// Los enlaces son <a href="#..."> normales: el navegador baja solo hasta
// el elemento que tiene ese id (no hace falta React Router para esto).
function BarraBienvenida() {
  return (
    <nav className="barra-bienvenida" aria-label="Secciones de la página">
      <a className="barra-marca" href="#inicio">
        <img src="/bienvenida/marca-ucen-blanca.svg" alt="Universidad Central" width="40" height="40" />
      </a>

      <div className="barra-enlaces">
        <a href="#que-hace">Qué hace</a>
        <a href="#laboratorios">Laboratorios</a>
        <a href="#quienes">Quiénes somos</a>
        <a href="#preguntas">Preguntas</a>
      </div>

      <button type="button" className="barra-ingresar" onClick={enfocarCampoCorreo}>
        Ingresar
      </button>
    </nav>
  );
}

export default BarraBienvenida;
