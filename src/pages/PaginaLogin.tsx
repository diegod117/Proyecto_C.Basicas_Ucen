// PaginaLogin.tsx
// Página de bienvenida e ingreso de LabCentral (ruta /login).
// Es lo primero que se ve si nadie ha iniciado sesión.
// El formulario de ingreso (y el de recuperar contraseña) está en
// components/FormularioIngreso.tsx.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), HU-15

import FormularioIngreso from '../components/FormularioIngreso';
import './PaginaLogin.css';

interface PropsPaginaLogin {
  // Mensaje de por qué no se pudo entrar al abrir la página con una sesión
  // guardada (cuenta desactivada, no registrada o sin conexión). Puede ir vacío.
  mensajeInicial: string;
}

// Componente PaginaLogin
// Recibe: el mensaje inicial, que se le pasa tal cual al formulario.
// Devuelve: la página con el formulario de ingreso.
function PaginaLogin(props: PropsPaginaLogin) {
  return (
    <main className="pagina-bienvenida">
      <div className="pagina-bienvenida-ingreso">
        <FormularioIngreso mensajeInicial={props.mensajeInicial} />
      </div>
    </main>
  );
}

export default PaginaLogin;
