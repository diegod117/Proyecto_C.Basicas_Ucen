// PaginaLogin.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La pantalla para ENTRAR a la app: una tarjeta con correo y contraseña.
// Es lo primero que ves si nadie ha iniciado sesión.
// También tiene el botón "¿Olvidaste tu contraseña?".
// *** Para cambiar el título o el subtítulo del login: busca más abajo
//     "login-titulo" y "login-subtitulo" (ver guía, paso 9). ***
// En la guía: paso 4 (useState y formularios) y paso 5 (async/await).
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos)

import { useState } from 'react';
// FormEvent es el TIPO del "evento" que ocurre cuando se envía un formulario.
import type { FormEvent } from 'react';
import { iniciarSesion } from '../services/authService';
import FormularioRecuperarContrasena from '../components/FormularioRecuperarContrasena';
import './PaginaLogin.css';

// Componente PaginaLogin
// No recibe props. ¿Cómo le avisa a App que entraste? ¡No le avisa!
// Cuando Firebase te deja entrar, suena el "timbre" (escucharSesion en
// App.tsx) y App cambia de pantalla sola.
// Devuelve: la tarjeta de inicio de sesión.
function PaginaLogin() {
  // ---------------------------------------------------------------
  // FORMULARIO CONTROLADO (ver guía, paso 4)
  // ---------------------------------------------------------------
  // Cada cajita del formulario guarda lo que escribes en un useState.
  // Así React SIEMPRE sabe qué hay escrito, letra por letra.
  // Es como un dictado: cada letra que escribes, React la anota en su cuaderno.
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // true mientras esperamos la respuesta de Firebase.
  // Sirve para apagar el botón y que nadie haga clic dos veces.
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  // true cuando se apretó "¿Olvidaste tu contraseña?".
  // Entonces la tarjeta muestra el formulario de recuperación en vez del login.
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);

  // manejarEnvio
  // Se ejecuta al apretar "Iniciar sesión" (o Enter).
  // Recibe: el "evento" del formulario. No devuelve nada.
  // Es "async" porque tiene que esperar a Firebase.
  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    // Por defecto, un <form> RECARGA la página al enviarse (así funcionaba
    // la web antigua). preventDefault() = "no hagas lo de siempre, yo me encargo".
    evento.preventDefault();

    // Revisión rápida antes de molestar a Firebase.
    if (correo.trim() === '' || contrasena === '') {
      setMensajeError('Escribe tu correo y tu contraseña.');
      return; // return = no sigas
    }

    setMensajeError('');
    setEsperandoRespuesta(true); // apagamos el botón
    const error = await iniciarSesion(correo.trim(), contrasena); // esperamos a Firebase
    setEsperandoRespuesta(false); // prendemos el botón otra vez

    // Si hubo error, lo mostramos. Si salió bien, no hacemos nada:
    // App se da cuenta sola y cambia de pantalla.
    if (error !== '') {
      setMensajeError(error);
    }
  }

  // El texto del botón cambia mientras esperamos.
  let textoBoton = 'Iniciar sesión';
  if (esperandoRespuesta) {
    textoBoton = 'Ingresando...';
  }

  // Si se pidió recuperar la contraseña, mostramos ESE formulario.
  // Le pasamos dos props: el correo que ya estaba escrito (para no
  // escribirlo de nuevo) y una función para volver al login.
  if (mostrarRecuperacion) {
    return (
      <div className="login-fondo">
        <FormularioRecuperarContrasena
          correoInicial={correo}
          onVolver={() => setMostrarRecuperacion(false)}
        />
      </div>
    );
  }

  return (
    // login-fondo = el fondo morado/azul que ocupa toda la pantalla.
    <div className="login-fondo">
      {/* M18: la tarjeta blanca. Su franja azul de arriba se dibuja con CSS
          (::before en PaginaLogin.css). login-tarjeta-cuerpo le da el espacio
          interior para que el contenido no quede pegado a los bordes.
          onSubmit = "cuando se envíe este formulario, ejecuta manejarEnvio". */}
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <div className="login-tarjeta-cuerpo">
          {/* *** EL TÍTULO DEL LOGIN: cambia este texto *** */}
          <h1 className="login-titulo">UCEN — Gestión de Inventario</h1>
          {/* *** EL SUBTÍTULO DEL LOGIN: cambia este texto *** */}
          <p className="texto-secundario login-subtitulo">
            Laboratorios del Departamento de Ciencias Básicas
          </p>

          {/* htmlFor une la etiqueta con su cajita (el id de abajo): si
              haces clic en la palabra "Correo", se activa la cajita. */}
          <label className="login-etiqueta" htmlFor="login-correo">
            Correo
          </label>
          {/* Una cajita CONTROLADA:
                value={correo}  -> muestra lo que hay en la memoria (useState)
                onChange={...}  -> cada vez que escribes una letra, guardamos
                                   el texto nuevo en la memoria.
              evento.target.value = "lo que hay escrito ahora en la cajita". */}
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
          {/* type="password" hace que se vean puntitos en vez de letras. */}
          <input
            id="login-contrasena"
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
          />

          {/* El mensaje de error solo se dibuja si hay texto (si no es ''). */}
          {mensajeError !== '' && <p className="login-error">{mensajeError}</p>}

          {/* type="submit" = este botón ENVÍA el formulario (dispara onSubmit).
              disabled = apagado mientras esperamos a Firebase. */}
          <button className="login-boton" type="submit" disabled={esperandoRespuesta}>
            {textoBoton}
          </button>

          {/* type="button" = este botón NO envía el formulario, solo hace
              lo que diga su onClick (mostrar la recuperación). */}
          <button
            type="button"
            className="login-enlace"
            onClick={() => setMostrarRecuperacion(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaginaLogin;
