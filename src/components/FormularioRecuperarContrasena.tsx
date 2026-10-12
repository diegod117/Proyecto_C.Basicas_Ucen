// FormularioRecuperarContrasena.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El formulario de "¿Olvidaste tu contraseña?". Pide tu correo y Firebase
// te manda un email con un enlace para crear una contraseña nueva.
// Aparece dentro de la pantalla de login, en lugar del formulario normal.
// Usa las mismas clases CSS de la tarjeta de login (PaginaLogin.css)
// para que se vea igualita.
// En la guía: paso 4 (formularios controlados).
// Cubre: inicio de sesión (sección 3.4 de requerimientos)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { enviarCorreoRecuperacion } from '../services/authService';
import './FormularioRecuperarContrasena.css';

// Las props que le pasa PaginaLogin (su "papá").
interface PropsFormularioRecuperarContrasena {
  // El correo que ya habías escrito en el login (puede venir vacío).
  // Así no tienes que escribirlo otra vez.
  correoInicial: string;
  // Una función de PaginaLogin para volver al formulario de inicio de sesión.
  onVolver: () => void;
}

// Componente FormularioRecuperarContrasena
// Recibe: el correo inicial y la función para volver.
// Devuelve: la tarjeta con el formulario de recuperación.
function FormularioRecuperarContrasena(props: PropsFormularioRecuperarContrasena) {
  // La cajita del correo parte con lo que venía del login (props.correoInicial).
  const [correo, setCorreo] = useState(props.correoInicial);
  const [mensajeError, setMensajeError] = useState('');
  // true cuando Firebase ya aceptó el pedido: entonces se ve el aviso verde.
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  // manejarEnvio
  // Se ejecuta al apretar "Enviar enlace".
  // Recibe: el evento del formulario. No devuelve nada.
  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // que no se recargue la página

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
        {/* Cajita controlada: muestra "correo" y lo actualiza con cada letra. */}
        <input
          id="recuperar-correo"
          className="login-input"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
        />

        {mensajeError !== '' && <p className="login-error">{mensajeError}</p>}

        {/* El aviso verde dice lo MISMO exista o no la cuenta. Así nadie
            puede usar este formulario para averiguar qué correos están
            registrados (es un truco de seguridad). */}
        {correoEnviado && (
          <p className="recuperar-exito">
            Si el correo está registrado, te llegará un enlace para crear una
            contraseña nueva. Revisa también la carpeta de spam.
          </p>
        )}

        <button className="login-boton" type="submit" disabled={esperandoRespuesta}>
          {textoBoton}
        </button>

        {/* type="button" = este botón NO envía el formulario, solo vuelve al login. */}
        <button type="button" className="login-enlace" onClick={props.onVolver}>
          ← Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
}

export default FormularioRecuperarContrasena;
