// PaginaLogin.tsx
// Página de ingreso de LabCentral (ruta /login). Es lo primero que se ve si
// nadie ha iniciado sesión. Sigue el estilo del login de MiUcen: pantalla
// dividida, con el panel azul de la Universidad Central a un lado y el
// formulario de ingreso al otro. Los créditos del equipo van en una esquina.
// El formulario (y el de recuperar contraseña) está en FormularioIngreso.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), HU-15,
//        RNF-01 (celular) y RNF-11 (contraste)

import PanelMarcaLogin from '../components/PanelMarcaLogin';
import FormularioIngreso from '../components/FormularioIngreso';
import CreditosLogin from '../components/CreditosLogin';
import './PaginaLogin.css';

interface PropsPaginaLogin {
  // Mensaje de por qué no se pudo entrar al abrir la página con una sesión
  // guardada (cuenta desactivada, no registrada o sin conexión). Puede ir vacío.
  mensajeInicial: string;
}

// Componente PaginaLogin
// Recibe: el mensaje inicial, que se le pasa tal cual al formulario.
// Devuelve: la página de ingreso completa.
function PaginaLogin(props: PropsPaginaLogin) {
  // Las tres partes van en este orden en el HTML: panel azul, formulario y
  // créditos. En el celular se ven una debajo de la otra en ese orden; en
  // escritorio el CSS (grid-template-areas) pone el formulario a la derecha
  // y los créditos debajo del panel azul (ver PaginaLogin.css).
  return (
    <div className="pagina-login">
      <PanelMarcaLogin />

      <main className="login-lado-formulario">
        <div className="login-caja">
          {/* El único h1 de la página: el nombre del sistema */}
          <h1 className="login-sistema">LabCentral</h1>
          <p className="login-sistema-texto">
            Inventario y reservas de los laboratorios de Ciencias Básicas.
          </p>

          <FormularioIngreso mensajeInicial={props.mensajeInicial} />
        </div>

        <p className="login-derechos">© Universidad Central de Chile</p>
      </main>

      <CreditosLogin />
    </div>
  );
}

export default PaginaLogin;
