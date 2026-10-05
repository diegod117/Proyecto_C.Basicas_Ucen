// FormularioRecuperarContrasena.tsx
// Formulario de "¿Olvidaste tu contraseña?": pide el correo y Firebase
// envía un enlace para crear una contraseña nueva.
// Se muestra dentro de la pantalla de login, en lugar del formulario normal.
// Usa las mismas clases de la tarjeta de login (PaginaLogin.css) para
// que se vea igual.
// Cubre: inicio de sesión (sección 3.4 de requerimientos)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { enviarCorreoRecuperacion } from '../services/authService';
import './FormularioRecuperarContrasena.css';

interface PropsFormularioRecuperarContrasena {
  // Correo que la persona ya había escrito en el login (puede venir vacío).
  // Así no tiene que escribirlo de nuevo.
  correoInicial: string;
  // Función de PaginaLogin para volver al formulario de inicio de sesión
  onVolver: () => void;
}

// Componente FormularioRecuperarContrasena
// Recibe: el correo inicial y la función para volver al login.
// Devuelve: la tarjeta con el formulario para recuperar la contraseña.
function FormularioRecuperarContrasena(props: PropsFormularioRecuperarContrasena) {
  const [correo, setCorreo] = useState(props.correoInicial);
  const [mensajeError, setMensajeError] = useState('');
  // true cuando Firebase ya aceptó el pedido: se muestra el aviso verde
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  // manejarEnvio
  // Recibe el evento del formulario. No devuelve nada.
  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (correo.trim() === '') {
      setMensajeError('Escribe tu correo.');
      return;
    }

    setMensajeError('');
    setEsperandoRespuesta(true);
    const error = await enviarCorreoRecuperacion(correo.trim());
    setEsperandoRespuesta(false);

    if (error !== '') {
      setMensajeError(error);
    } else {
      setCorreoEnviado(true);
    }
  }

  let textoBoton = 'Enviar enlace';
  if (esperandoRespuesta) {
    textoBoton = 'Enviando...';
  }

  return (
    <form className="login-tarjeta" onSubmit={manejarEnvio}>
      <div className="login-tarjeta-cuerpo">
        <h1 className="login-titulo">Recuperar contraseña</h1>
        <p className="texto-secundario login-subtitulo">
          Te enviaremos un enlace para crear una contraseña nueva.
        </p>

        <label className="login-etiqueta" htmlFor="recuperar-correo">
          Correo
        </label>
        <input
          id="recuperar-correo"
          className="login-input"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
        />

        {mensajeError !== '' && <p className="login-error">{mensajeError}</p>}

        {/* El mensaje es el mismo exista o no la cuenta: Firebase no nos
            dice si el correo está registrado, para que nadie pueda
            averiguar qué cuentas existen. */}
        {correoEnviado && (
          <p className="recuperar-exito">
            Si el correo está registrado, te llegará un enlace para crear una
            contraseña nueva. Revisa también la carpeta de spam.
          </p>
        )}

        <button className="login-boton" type="submit" disabled={esperandoRespuesta}>
          {textoBoton}
        </button>

        {/* type="button" para que este botón NO envíe el formulario */}
        <button type="button" className="login-enlace" onClick={props.onVolver}>
          ← Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
}

export default FormularioRecuperarContrasena;
