// CreditosLogin.tsx
// Créditos del equipo en la esquina de la página de ingreso: quiénes hicimos
// LabCentral, la carrera, la asignatura y el profesor.
// Cubre: presentación del proyecto (no corresponde a una HU)

import './CreditosLogin.css';

// Integrantes del equipo, uno por línea en pantalla
const integrantesEquipo: string[] = ['Johann Cortés Farias', 'Diego Cortés Toro', 'Martín Zepeda Puelles'];

// Componente CreditosLogin
// No recibe props. Devuelve el pie con el logo de la carrera y los créditos.
function CreditosLogin() {
  return (
    <footer className="creditos-login">
      <div className="creditos-login-contenido">
        <img
          className="creditos-login-logo"
          src="/bienvenida/logo-carrera-blanco.svg"
          alt="Ingeniería Civil en Computación e Informática"
          width="118"
          height="40"
        />

        <div>
          <p className="creditos-login-titulo">Realizado por</p>
          {/* .map() dibuja un <p> por cada nombre; key ayuda a React a
              reconocer cada elemento de la lista */}
          {integrantesEquipo.map((nombre) => (
            <p key={nombre} className="creditos-login-nombre">
              {nombre}
            </p>
          ))}
          <p className="creditos-login-nota">
            Ingeniería Civil en Computación e Informática · Programación de Aplicaciones · Prof. Luis Rojas Rubio
          </p>
        </div>
      </div>
    </footer>
  );
}

export default CreditosLogin;
