// PieBienvenida.tsx
// Pie de la página de bienvenida: el nombre LabCentral a todo el ancho,
// dónde está el laboratorio, enlaces, logos de la facultad y la carrera,
// los créditos (equipo y fotos) y "Volver arriba".
// Cubre: presentación del proyecto (no corresponde a una HU), RNF-01

import CreditosBienvenida from './CreditosBienvenida';
import { enfocarCampoCorreo } from '../utils/bienvenida';
import './PieBienvenida.css';

// Componente PieBienvenida
// No recibe props. Devuelve el <footer> completo.
// bienv-oscuro le avisa a bienvenida.css que el contorno de foco va en blanco.
function PieBienvenida() {
  return (
    <footer className="pie bienv-oscuro">
      <div className="bienv-ancho">
        {/* El nombre grande es decorativo (ya está en el h1): aria-hidden
            evita que el lector de pantalla lo lea dos veces */}
        <p className="pie-nombre" aria-hidden="true">
          LabCentral
        </p>

        <div className="bienv-grilla pie-fila">
          {/* Dónde está, uno por línea */}
          <div className="pie-lugares">
            <p className="bienv-titulo">Torre B · Sala B206</p>
            <p className="bienv-titulo">Torre B · Sala B302</p>
            <p className="bienv-titulo">Departamento de Ciencias Básicas</p>
          </div>

          {/* Tres columnas de enlaces */}
          <div className="pie-enlaces">
            <div>
              <p className="bienv-nota pie-enlaces-titulo">Sistema</p>
              <ul>
                <li>
                  {/* Es un botón: no cambia de página, pone el cursor en el correo */}
                  <button type="button" className="pie-boton-enlace" onClick={enfocarCampoCorreo}>
                    Ingresar
                  </button>
                </li>
                <li><a href="#que-hace">Qué hace</a></li>
                <li><a href="#laboratorios">Laboratorios</a></li>
                <li><a href="#quienes">Quiénes somos</a></li>
                <li><a href="#preguntas">Preguntas</a></li>
              </ul>
            </div>
            <div>
              <p className="bienv-nota pie-enlaces-titulo">Universidad</p>
              <ul>
                <li>
                  <a href="https://www.ucentral.cl" target="_blank" rel="noopener noreferrer">
                    ucentral.cl
                  </a>
                </li>
                <li>Facultad de Ingeniería y Arquitectura</li>
              </ul>
            </div>
            <div>
              <p className="bienv-nota pie-enlaces-titulo">Proyecto</p>
              <ul>
                <li>Programación de Aplicaciones · 2026</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pie-logos">
          <img
            src="/bienvenida/logo-finarq-blanco.svg"
            alt="Universidad Central, Facultad de Ingeniería y Arquitectura"
            width="158"
            height="56"
            loading="lazy"
          />
          <img
            src="/bienvenida/logo-carrera-blanco.svg"
            alt="Ingeniería Civil en Computación e Informática"
            width="166"
            height="56"
            loading="lazy"
          />
          <p className="bienv-nota pie-lema">Desde la Central hacia tu futuro</p>
        </div>

        <CreditosBienvenida />

        <div className="pie-final">
          <p>© 2026 Universidad Central de Chile · Proyecto académico</p>
          <a href="#inicio">Volver arriba</a>
        </div>
      </div>
    </footer>
  );
}

export default PieBienvenida;
