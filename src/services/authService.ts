// authService.ts
// Servicio de inicio y cierre de sesión.
// Firebase revisa el correo y la contraseña; después buscamos al usuario (su
// rol y si está activo) en la colección "usuarios" de Firestore.
// Las páginas y componentes usan este servicio, nunca Firebase directo.
// Así, si algún día cambiamos Firebase por otra cosa, solo se cambia aquí.
// También envía el correo para recuperar la contraseña.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03,
//        HU-15, RF-14 (CA-15.3: un usuario desactivado no entra; CA-15.4: "Usuario no registrado")

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { autenticacion } from './firebase';
import { leerUsuarioPorCorreo } from './usuariosService';
import type { Usuario } from '../types/Usuario';

// Mensajes cuando la cuenta de Authentication existe pero no sirve para entrar
const MENSAJE_NO_REGISTRADO = 'Usuario no registrado. Habla con el encargado del sistema.';
const MENSAJE_DESACTIVADO = 'Tu cuenta está desactivada. Habla con el encargado del sistema.';

// verificarCuentaRegistrada
// Recibe: el correo de alguien que ya pasó la revisión de Authentication.
// Devuelve: el usuario si está registrado y activo, o null y el mensaje de por
// qué no puede entrar. La usan iniciarSesion y escucharSesion (misma regla).
async function verificarCuentaRegistrada(
  correo: string,
): Promise<{ usuario: Usuario | null; mensaje: string }> {
  const lectura = await leerUsuarioPorCorreo(correo);
  if (lectura.error !== '') {
    return { usuario: null, mensaje: lectura.error };
  }
  if (lectura.usuario === null) {
    return { usuario: null, mensaje: MENSAJE_NO_REGISTRADO };
  }
  if (!lectura.usuario.activo) {
    return { usuario: null, mensaje: MENSAJE_DESACTIVADO };
  }
  return { usuario: lectura.usuario, mensaje: '' };
}

// ------------------------------------------------------------------
// traducirError
// ------------------------------------------------------------------
// Recibe el código de error que manda Firebase (ej: 'auth/invalid-credential').
// Devuelve un mensaje en español para mostrarle al usuario.
function traducirError(codigo: string): string {
  // Firebase usa varios códigos para "datos incorrectos"; los nuevos
  // proyectos usan 'auth/invalid-credential', los antiguos los otros dos.
  if (
    codigo === 'auth/invalid-credential' ||
    codigo === 'auth/wrong-password' ||
    codigo === 'auth/user-not-found'
  ) {
    // Firebase no distingue "correo que no existe" de "contraseña mala" (para no
    // revelar qué correos tienen cuenta), así que el mensaje cubre los dos casos
    return 'Correo o contraseña incorrectos, o usuario no registrado.';
  } else if (codigo === 'auth/invalid-email') {
    return 'El correo no tiene un formato válido.';
  } else if (codigo === 'auth/too-many-requests') {
    return 'Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.';
  } else if (codigo === 'auth/network-request-failed') {
    return 'No hay conexión a internet.';
  } else {
    return 'Ocurrió un error inesperado (' + codigo + ').';
  }
}

// ------------------------------------------------------------------
// iniciarSesion
// ------------------------------------------------------------------
// Recibe el correo y la contraseña que escribió el usuario.
// Devuelve un texto vacío ('') si todo salió bien, o el mensaje de error.
//
// "async" significa que la función tarda (tiene que ir a internet a
// preguntarle a Firebase). Por eso devuelve una Promise: una "promesa"
// de que el resultado llegará después. "await" espera ese resultado.
async function iniciarSesion(correo: string, contrasena: string): Promise<string> {
  // try/catch: si Firebase rechaza el login, lanza un error y
  // el código salta directo al bloque catch.
  try {
    await signInWithEmailAndPassword(autenticacion, correo, contrasena);
  } catch (error) {
    // El error puede ser de cualquier tipo. Revisamos si es un
    // FirebaseError para poder leer su código.
    if (error instanceof FirebaseError) {
      return traducirError(error.code);
    }
    return 'No se pudo iniciar sesión.';
  }

  // Contraseña correcta, pero además hay que estar registrado y activo (HU-15).
  // Si no, se cierra la sesión que Firebase acaba de abrir.
  const cuenta = await verificarCuentaRegistrada(correo);
  if (cuenta.usuario === null) {
    await signOut(autenticacion);
    return cuenta.mensaje;
  }

  return '';
}

// ------------------------------------------------------------------
// enviarCorreoRecuperacion
// ------------------------------------------------------------------
// Recibe el correo de la persona que olvidó su contraseña.
// Devuelve '' si Firebase aceptó el pedido, o el mensaje de error.
// Firebase envía un correo con un enlace a SU PROPIA página para crear
// la contraseña nueva: nosotros no tenemos que hacer esa página.
// Viene incluido en el plan gratuito de Firebase.
async function enviarCorreoRecuperacion(correo: string): Promise<string> {
  try {
    await sendPasswordResetEmail(autenticacion, correo);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Si el correo no tiene cuenta, respondemos IGUAL que si la tuviera.
      // Así nadie puede usar este formulario para averiguar qué correos
      // están registrados (la pantalla muestra un mensaje genérico).
      if (error.code === 'auth/user-not-found') {
        return '';
      }
      return traducirError(error.code);
    }
    return 'No se pudo enviar el correo.';
  }
  return '';
}

// ------------------------------------------------------------------
// cerrarSesion
// ------------------------------------------------------------------
// No recibe nada. Le pide a Firebase cerrar la sesión actual.
async function cerrarSesion(): Promise<void> {
  await signOut(autenticacion);
}

// ------------------------------------------------------------------
// escucharSesion
// ------------------------------------------------------------------
// Recibe una función que se ejecutará CADA VEZ que la sesión cambie (al abrir
// la página con una sesión guardada, al iniciar sesión y al cerrarla). Esa
// función recibe el usuario (o null) y, si no pudo entrar, el mensaje de por qué.
// Devuelve otra función que sirve para dejar de escuchar.
function escucharSesion(
  alCambiar: (usuario: Usuario | null, mensaje: string) => void,
): () => void {
  // onAuthStateChanged es de Firebase: nos avisa cuando cambia la sesión.
  // El callback es "async" porque ahora hay que ir a Firestore a buscar el rol.
  const dejarDeEscuchar = onAuthStateChanged(autenticacion, async (usuarioFirebase) => {
    if (usuarioFirebase === null || usuarioFirebase.email === null) {
      alCambiar(null, '');
      return;
    }
    const correo = usuarioFirebase.email;

    // try/catch: si algo fallara, la app no puede quedar en "Cargando..."
    try {
      const cuenta = await verificarCuentaRegistrada(correo);

      // La lectura tarda: si mientras tanto la persona cerró sesión (o entró
      // otra), esta respuesta ya no corresponde y se ignora.
      const actual = autenticacion.currentUser;
      if (actual === null || actual.email === null || actual.email.toLowerCase() !== correo.toLowerCase()) {
        return;
      }

      if (cuenta.usuario === null) {
        await signOut(autenticacion);
        alCambiar(null, cuenta.mensaje);
      } else {
        alCambiar(cuenta.usuario, '');
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      alCambiar(null, 'No se pudo verificar tu cuenta. Revisa tu conexión.');
    }
  });

  return dejarDeEscuchar;
}

export { iniciarSesion, cerrarSesion, escucharSesion, enviarCorreoRecuperacion };
