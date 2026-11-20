// PaginaLogin.tsx
// Página de bienvenida e ingreso de LabCentral (ruta /login).
// Es lo primero que se ve si nadie ha iniciado sesión: el tablero con el
// formulario de ingreso y, debajo, las secciones que explican el sistema.
// El formulario (y el de recuperar contraseña) está en FormularioIngreso.
// Aquí también está la animación de "entrada" de las secciones al bajar.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), HU-15, RNF-01

import { useEffect } from 'react';
// bienvenida.css va PRIMERO: así los .css de cada sección se cargan después
// y pueden ajustar sus estilos (por ejemplo, el margen de un párrafo).
import '../styles/bienvenida.css';
import TableroBienvenida from '../components/TableroBienvenida';
import SeccionQueHace from '../components/SeccionQueHace';
import SeccionLaboratorios from '../components/SeccionLaboratorios';
import SeccionQuienes from '../components/SeccionQuienes';
import SeccionPreguntas from '../components/SeccionPreguntas';
import PieBienvenida from '../components/PieBienvenida';
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
  // Entradas al bajar: los elementos con la clase "aparece" se ven un poco
  // más abajo y transparentes, y cuando llegan a la pantalla suben y se
  // aclaran (la clase "visible" hace el cambio; ver PaginaLogin.css).
  // useEffect con [] se ejecuta UNA vez, después de dibujar la página.
  useEffect(() => {
    // 1) La clase "con-animacion" en el <html> es la que activa el estado
    //    oculto. Si este código no corre, la clase no está y todo se ve normal.
    const raiz = document.documentElement;
    raiz.classList.add('con-animacion');

    const elementos = document.querySelectorAll('.aparece');

    // 2) Navegadores sin IntersectionObserver: se muestra todo de inmediato.
    if (!('IntersectionObserver' in window)) {
      elementos.forEach((elemento) => elemento.classList.add('visible'));
      return () => raiz.classList.remove('con-animacion');
    }

    // 3) IntersectionObserver avisa cuando un elemento entra a la pantalla.
    //    threshold: 0 = basta con que asome un pixel. Así un bloque muy alto
    //    (como la lista de "Qué puedes hacer" en celular) también aparece,
    //    aunque nunca se vea un porcentaje grande de él (celular horizontal
    //    o zoom al 200 %).
    //    rootMargin '0px 0px -10% 0px' achica la pantalla "de mentira" un 10 %
    //    por abajo: el elemento aparece cuando ya subió un poco.
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            // Ya apareció: dejamos de mirarlo (la animación es una sola vez)
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );
    elementos.forEach((elemento) => observador.observe(elemento));

    // 4) Al salir de la página (por ejemplo, al iniciar sesión) se deja de
    //    observar y se quita la clase, para no afectar al resto de la app.
    return () => {
      observador.disconnect();
      raiz.classList.remove('con-animacion');
    };
  }, []);

  return (
    <div className="pagina-bienvenida">
      <main>
        <TableroBienvenida mensajeInicial={props.mensajeInicial} />
        <SeccionQueHace />
        <SeccionLaboratorios />
        <SeccionQuienes />
        <SeccionPreguntas />
      </main>
      <PieBienvenida />
    </div>
  );
}

export default PaginaLogin;
