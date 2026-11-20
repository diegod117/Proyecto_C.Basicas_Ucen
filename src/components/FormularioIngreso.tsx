// FormularioIngreso.tsx
// Formulario para iniciar sesión con correo y contraseña. Va dentro del
// tile de ingreso de la página de bienvenida (TableroBienvenida).
// Desde aquí también se puede pedir un correo para recuperar la contraseña:
// en ese caso el mismo tile muestra FormularioRecuperarContrasena.
// La lógica es la MISMA que tenía PaginaLogin.tsx antes de J42; solo se
// movió a este componente para que la página pudiera crecer con secciones.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos),
//        HU-15 (mensaje de cuenta desactivada o no registrada)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { iniciarSesion } from '../services/authService';
import FormularioRecuperarContrasena from './FormularioRecuperarContrasena';
import './FormularioIngreso.css';

interface PropsFormularioIngreso {
  // Mensaje de por qué no se pudo entrar al abrir la página con una sesión
  // guardada (cuenta desactivada, no registrada o sin conexión). Puede ir vacío.
  mensajeInicial: string;
}

// Componente FormularioIngreso
// Recibe: el mensaje inicial (ver arriba). No necesita avisarle nada a App,
// porque App se entera sola del login a través de escucharSesion() (ver App.tsx).
// Devuelve: el formulario de inicio de sesión, o el de recuperar contraseña.
function FormularioIngreso(props: PropsFormularioIngreso) {
  // Formulario controlado: cada input guarda su valor en un useState.
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // true cuando la persona ya intentó entrar desde este formulario: desde ahí
  // manda el mensaje del formulario y se deja de mostrar el que mandó App
  const [yaIntento, setYaIntento] = useState(false);

  // true mientras esperamos la respuesta de Firebase.
  // Sirve para desactivar el botón y que no se haga clic dos veces.
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  // true cuando la persona hizo clic en "¿Olvidaste tu contraseña?".
  // En ese caso el tile muestra el formulario de recuperación.
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);

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
    setYaIntento(true);
    setEsperandoRespuesta(true);
    const error = await iniciarSesion(correo.trim(), contrasena);
    setEsperandoRespuesta(false);

    // Si hubo error lo mostramos. Si salió bien no hacemos nada aquí:
    // App detecta la sesión nueva y cambia de pantalla solo.
    if (error !== '') {
      setMensajeError(error);
    }
  }

  // Mensaje que se ve: el del formulario si hay uno; si no, el que mandó App
  // (por ejemplo "Tu cuenta está desactivada..." al abrir la página con una
  // sesión guardada). Se calcula en cada dibujo, así NO depende de cuándo
  // llegue: aunque App primero muestre el login y después reciba el mensaje,
  // aparece igual (un useState inicial solo se lee una vez, al montar).
  let mensajeMostrado = mensajeError;
  if (mensajeMostrado === '' && !yaIntento) {
    mensajeMostrado = props.mensajeInicial;
  }

  // Texto del botón según si estamos esperando o no
  let textoBoton = 'Ingresar';
  if (esperandoRespuesta) {
    textoBoton = 'Ingresando…';
  }

  // Si eligió recuperar la contraseña, mostramos ese formulario en el
  // mismo tile. Le pasamos el correo que ya escribió y una función
  // para volver al login.
  if (mostrarRecuperacion) {
    return (
      <FormularioRecuperarContrasena
        correoInicial={correo}
        onVolver={() => setMostrarRecuperacion(false)}
      />
    );
  }

  return (
    <form className="login-formulario" onSubmit={manejarEnvio}>
      {/* h2 y no h1: el único h1 de la página es "LabCentral" */}
      <h2 className="login-titulo">Ingresa a tu cuenta</h2>

      <label className="login-etiqueta" htmlFor="login-correo">
        Correo institucional
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
      {mensajeMostrado !== '' && <p className="login-error">{mensajeMostrado}</p>}

      <button className="login-boton" type="submit" disabled={esperandoRespuesta}>
        {textoBoton}
      </button>

      {/* type="button" para que este botón NO envíe el formulario de login */}
      <button
        type="button"
        className="login-enlace"
        onClick={() => setMostrarRecuperacion(true)}
      >
        ¿Olvidaste tu contraseña?
      </button>

      <p className="login-nota">¿No tienes cuenta? Pídela al encargado del laboratorio.</p>
    </form>
  );
}

export default FormularioIngreso;
