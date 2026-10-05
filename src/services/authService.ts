// authService.ts
// Servicio de inicio y cierre de sesión.
// Firebase revisa el correo y la contraseña; después buscamos el rol
// del usuario en src/data/usuarios.ts.
// Las páginas y componentes usan este servicio, nunca Firebase directo.
// Así, si algún día cambiamos Firebase por otra cosa, solo se cambia aquí.
// También envía el correo para recuperar la contraseña.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { autenticacion } from './firebase';
import { listaUsuarios } from '../data/usuarios';
import type { Usuario } from '../types/Usuario';

// ------------------------------------------------------------------
// buscarUsuarioPorCorreo
// ------------------------------------------------------------------
// Recibe un correo. Devuelve el usuario de nuestra lista (con su rol),
// o undefined si ese correo no tiene un rol asignado.
// Pasamos todo a minúsculas porque "Docente@prueba.cl" y
// "docente@prueba.cl" son el mismo correo.
function buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
  const correoMinusculas = correo.toLowerCase();
  for (const usuario of listaUsuarios) {
    if (usuario.correo.toLowerCase() === correoMinusculas) {
      return usuario;
    }
  }
  return undefined;
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
    return 'Correo o contraseña incorrectos.';
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

  // El correo y la contraseña son correctos, pero además el correo
  // tiene que estar en nuestra lista para saber su rol.
  if (buscarUsuarioPorCorreo(correo) === undefined) {
    await signOut(autenticacion);
    return 'Tu cuenta no tiene un rol asignado. Habla con el encargado del sistema.';
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
// Recibe una función que se ejecutará CADA VEZ que la sesión cambie:
// al abrir la página (si ya había una sesión guardada), al iniciar
// sesión y al cerrarla. Esa función recibe el usuario, o null si
// no hay nadie conectado.
// Devuelve otra función que sirve para dejar de escuchar.
function escucharSesion(alCambiar: (usuario: Usuario | null) => void): () => void {
  // onAuthStateChanged es de Firebase: nos avisa cuando cambia la sesión.
  // usuarioFirebase es null si nadie inició sesión.
  const dejarDeEscuchar = onAuthStateChanged(autenticacion, (usuarioFirebase) => {
    if (usuarioFirebase === null || usuarioFirebase.email === null) {
      alCambiar(null);
      return;
    }

    // Si el correo no está en nuestra lista, se trata como "sin sesión".
    const usuario = buscarUsuarioPorCorreo(usuarioFirebase.email);
    if (usuario === undefined) {
      alCambiar(null);
    } else {
      alCambiar(usuario);
    }
  });

  return dejarDeEscuchar;
}

export { iniciarSesion, cerrarSesion, escucharSesion, enviarCorreoRecuperacion };
