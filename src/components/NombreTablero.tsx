// NombreTablero.tsx
// Tile del nombre en el tablero de bienvenida: el logo de la facultad
// arriba y, abajo, "LabCentral" (el único h1 de la página) con su frase.
// Se separó de TableroBienvenida para que su .css no pasara de ~200 líneas.
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01

import './NombreTablero.css';

// Componente NombreTablero
// No recibe props. Devuelve el tile con el logo, el nombre y la frase.
function NombreTablero() {
  return (
    <div className="tablero-tile tablero-nombre">
      <img
        className="tablero-logo"
        src="/bienvenida/logo-finarq-azul.svg"
        alt="Universidad Central de Chile, Facultad de Ingeniería y Arquitectura"
        width="136"
        height="48"
      />
      <div>
        <h1 className="tablero-titulo">LabCentral</h1>
        <p className="tablero-frase">Inventario y reservas de los laboratorios de Ciencias Básicas.</p>
      </div>
    </div>
  );
}

export default NombreTablero;
