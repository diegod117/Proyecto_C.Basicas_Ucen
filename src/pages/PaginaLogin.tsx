// PaginaLogin.tsx
// Página de bienvenida e ingreso de LabCentral (ruta /login).
// Es lo primero que se ve si nadie ha iniciado sesión: el tablero con el
// formulario de ingreso y, debajo, las secciones que explican el sistema.
// El formulario (y el de recuperar contraseña) está en FormularioIngreso.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), HU-15, RNF-01

// bienvenida.css va PRIMERO: así los .css de cada sección se cargan después
// y pueden ajustar sus estilos (por ejemplo, el margen de un párrafo).
import '../styles/bienvenida.css';
import TableroBienvenida from '../components/TableroBienvenida';
import SeccionQueHace from '../components/SeccionQueHace';
import SeccionLaboratorios from '../components/SeccionLaboratorios';
import SeccionQuienes from '../components/SeccionQuienes';
import SeccionPreguntas from '../components/SeccionPreguntas';
import './PaginaLogin.css';

interface PropsPaginaLogin {
  // Mensaje de por qué no se pudo entrar al abrir la página con una sesión
  // guardada (cuenta desactivada, no registrada o sin conexión). Puede ir vacío.
  mensajeInicial: string;
}

// Componente PaginaLogin
// Recibe: el mensaje inicial, que pasa por el tablero hasta el formulario.
// Devuelve: la página de bienvenida completa.
function PaginaLogin(props: PropsPaginaLogin) {
  return (
    <div className="pagina-bienvenida">
      <main>
        <TableroBienvenida mensajeInicial={props.mensajeInicial} />
        <SeccionQueHace />
        <SeccionLaboratorios />
        <SeccionQuienes />
        <SeccionPreguntas />
      </main>
    </div>
  );
}

export default PaginaLogin;
