// PaginaLogin.tsx
// Pantalla de inicio de sesión: correo y contraseña.
// Es lo primero que se ve si nadie ha iniciado sesión.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { iniciarSesion } from '../services/authService';
import './PaginaLogin.css';

// Componente PaginaLogin
// No recibe props: no necesita avisarle nada a App, porque App se entera
// sola del login a través de escucharSesion() (ver App.tsx).
// Devuelve el formulario de inicio de sesión.
function PaginaLogin() {
  // Formulario controlado: cada input guarda su valor en un useState.
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // true mientras esperamos la respuesta de Firebase.
  // Sirve para desactivar el botón y que no se haga clic dos veces.
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  // manejarEnvio
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque tiene que esperar la respuesta de Firebase.
  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    // Sin esto, el navegador recargaría la página al enviar el formulario.
    evento.preventDefault();

    if (correo.trim() === '' || contrasena === '') {
      setMensajeError('Escribe tu correo y tu contraseña.');
      return;
    }

    setMensajeError('');
    setEsperandoRespuesta(true);
    const error = await iniciarSesion(correo.trim(), contrasena);
    setEsperandoRespuesta(false);

    // Si hubo error lo mostramos. Si salió bien no hacemos nada aquí:
    // App detecta la sesión nueva y cambia de pantalla solo.
    if (error !== '') {
      setMensajeError(error);
    }
  }

  // Texto del botón según si estamos esperando o no
  let textoBoton = 'Iniciar sesión';
  if (esperandoRespuesta) {
    textoBoton = 'Ingresando...';
  }

  return (
    <div className="login-fondo">
      {/* M18: overflow:hidden en .login-tarjeta + ::before = franja decorativa azul arriba.
          .login-tarjeta-cuerpo tiene el padding para que el contenido quede
          debajo de la franja y no pegado al borde. */}
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <div className="login-tarjeta-cuerpo">
          <h1 className="login-titulo">UCEN — Gestión de Inventario</h1>
          <p className="texto-secundario login-subtitulo">
            Laboratorios del Departamento de Ciencias Básicas
          </p>

          <label className="login-etiqueta" htmlFor="login-correo">
            Correo
          </label>
          <input
            id="login-correo"
            className="login-input"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
          />

          <label className="login-etiqueta" htmlFor="login-contrasena">
            Contraseña
          </label>
          <input
            id="login-contrasena"
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
          />

          {/* Solo se muestra si hay un mensaje de error */}
          {mensajeError !== '' && <p className="login-error">{mensajeError}</p>}

          <button className="login-boton" type="submit" disabled={esperandoRespuesta}>
            {textoBoton}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaginaLogin;
