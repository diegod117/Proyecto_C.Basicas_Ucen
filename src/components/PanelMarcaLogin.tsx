// PanelMarcaLogin.tsx
// Panel azul de la página de ingreso (como el de MiUcen): el logo blanco de
// la Universidad Central y una frase corta que dice para qué sirve LabCentral.
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01, RNF-11

import './PanelMarcaLogin.css';

// Componente PanelMarcaLogin
// No recibe props. Devuelve el panel con el logo, la frase y el subtítulo.
function PanelMarcaLogin() {
  return (
    <section className="panel-marca" aria-label="Universidad Central">
      {/* width y height reservan el espacio del logo antes de que cargue,
          así la página no "salta" al aparecer la imagen */}
      <img
        className="panel-marca-logo"
        src="/bienvenida/logo-finarq-blanco.svg"
        alt="Universidad Central de Chile, Facultad de Ingeniería y Arquitectura"
        width="170"
        height="60"
      />

      <div className="panel-marca-textos">
        <p className="panel-marca-frase">
          El inventario de los laboratorios, en un solo lugar.
        </p>
        <p className="panel-marca-subtitulo">
          Revisa qué hay disponible, reserva equipos y reporta incidencias.
        </p>
      </div>
    </section>
  );
}

export default PanelMarcaLogin;
