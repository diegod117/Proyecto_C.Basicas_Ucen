// authService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Aquí está todo lo de ENTRAR y SALIR de la app (iniciar y cerrar sesión),
// y también el correo de "¿Olvidaste tu contraseña?".
// "auth" viene de "authentication" (autenticación = comprobar quién eres).
//
// ¿Cómo se entra? En dos pasos:
//   1. Firebase revisa el correo y la contraseña.
//   2. Buscamos ese correo en src/data/usuarios.ts para saber su nombre y rol.
//
// Regla del grupo: las pantallas NUNCA hablan con Firebase directamente,
// siempre a través de este archivo. Así, si algún día cambiamos Firebase
// por otra cosa, solo hay que cambiar este archivo.
// En la guía: paso 5 (async/await) y paso 8 (Firebase).
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03

// Las funciones de Firebase que vamos a usar. Se pueden importar varias
// a la vez, separadas por comas, una por línea para que se lean mejor.
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
// Recibe: un correo (texto).
// Devuelve: la persona de nuestra lista que tiene ese correo, o undefined
// (= "no encontré a nadie") si el correo no está en la lista.
// "Usuario | undefined" se lee: "devuelve un Usuario O nada".
//
// Pasamos todo a minúsculas (toLowerCase) porque "Docente@prueba.cl" y
// "docente@prueba.cl" son el mismo correo, aunque se escriban distinto.
// No lleva "export": solo se usa dentro de este archivo (es un ayudante privado).
function buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
  const correoMinusculas = correo.toLowerCase();
  // for...of = "por cada usuario de la lista, haz esto". Es como revisar
  // la lista de invitados nombre por nombre hasta encontrar el que buscas.
  for (const usuario of listaUsuarios) {
    // === compara si dos cosas son EXACTAMENTE iguales.
    if (usuario.correo.toLowerCase() === correoMinusculas) {
      // return = "listo, aquí está, termina la función".
      return usuario;
    }
  }
  // Si revisamos toda la lista y no apareció, devolvemos "nada".
  return undefined;
}

// ------------------------------------------------------------------
// traducirError
// ------------------------------------------------------------------
// Recibe: el código de error que manda Firebase, en inglés
// (ej: 'auth/invalid-credential').
// Devuelve: un mensaje en español que cualquier persona entiende.
// Es como un diccionario: código raro -> frase clara.
function traducirError(codigo: string): string {
  // || se lee "o". Si el código es cualquiera de estos tres, es el mismo
  // problema: datos incorrectos. (Firebase usa nombres distintos según
  // la versión del proyecto, por eso revisamos los tres.)
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
    // Cualquier otro error que no conocemos: lo mostramos con su código
    // para poder buscarlo después. El + junta textos: 'a' + 'b' = 'ab'.
    return 'Ocurrió un error inesperado (' + codigo + ').';
  }
}

// ------------------------------------------------------------------
// iniciarSesion
// ------------------------------------------------------------------
// Recibe: el correo y la contraseña que escribió la persona.
// Devuelve: '' (texto vacío) si pudo entrar, o el mensaje de error.
//
// "async" = se demora, porque tiene que preguntarle a Firebase por internet.
// Por eso devuelve una Promise (una promesa de que el resultado llegará).
// "await" = espera la respuesta de Firebase antes de seguir a la línea siguiente.
async function iniciarSesion(correo: string, contrasena: string): Promise<string> {
  // try/catch: si Firebase dice "contraseña incorrecta", lanza un error
  // y el código salta directo al bloque catch (en vez de romper la app).
  try {
    await signInWithEmailAndPassword(autenticacion, correo, contrasena);
  } catch (error) {
    // El error puede ser de muchas clases. "instanceof FirebaseError"
    // pregunta: "¿este error es de Firebase?". Si sí, tiene un código
    // (error.code) que podemos traducir.
    if (error instanceof FirebaseError) {
      return traducirError(error.code);
    }
    return 'No se pudo iniciar sesión.';
  }

  // La contraseña estaba bien. Pero además el correo tiene que estar en
  // NUESTRA lista (usuarios.ts) para saber qué rol tiene.
  // Si no está, lo sacamos de nuevo (signOut) y le explicamos por qué.
  if (buscarUsuarioPorCorreo(correo) === undefined) {
    await signOut(autenticacion);
    return 'Tu cuenta no tiene un rol asignado. Habla con el encargado del sistema.';
  }

  // Todo salió bien.
  return '';
}

// ------------------------------------------------------------------
// enviarCorreoRecuperacion
// ------------------------------------------------------------------
// Recibe: el correo de la persona que olvidó su contraseña.
// Devuelve: '' si Firebase aceptó el pedido, o el mensaje de error.
// Firebase manda un correo con un enlace a SU PROPIA página para crear la
// contraseña nueva: nosotros no tuvimos que hacer esa página. Y es gratis.
async function enviarCorreoRecuperacion(correo: string): Promise<string> {
  try {
    await sendPasswordResetEmail(autenticacion, correo);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Truco de seguridad: si el correo NO tiene cuenta, respondemos igual
      // que si la tuviera. Así nadie puede usar este formulario para
      // adivinar qué correos están registrados.
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
// No recibe nada. Le dice a Firebase "esta persona se fue".
// "Promise<void>" = una promesa que no entrega nada (void = vacío),
// solo avisa cuando terminó.
async function cerrarSesion(): Promise<void> {
  await signOut(autenticacion);
}

// ------------------------------------------------------------------
// escucharSesion
// ------------------------------------------------------------------
// Imagina un timbre: cada vez que alguien entra o sale, suena.
// Esta función instala ese timbre.
//
// Recibe: "alCambiar", que es UNA FUNCIÓN (sí, ¡se pueden pasar funciones
// como si fueran datos!). Esa función se ejecuta cada vez que suena el timbre:
//   - al abrir la página (si ya había una sesión guardada),
//   - al iniciar sesión,
//   - al cerrar sesión.
// alCambiar recibe la persona conectada, o null (= nadie) si no hay sesión.
// El tipo "(usuario: Usuario | null) => void" se lee: "una función que
// recibe un Usuario o null, y no devuelve nada".
//
// Devuelve: otra función, que sirve para DESINSTALAR el timbre.
// App.tsx la usa en su useEffect (ver guía, paso 5).
function escucharSesion(alCambiar: (usuario: Usuario | null) => void): () => void {
  // onAuthStateChanged es el timbre de Firebase.
  // usuarioFirebase es la persona según Firebase, o null si no hay nadie.
  const dejarDeEscuchar = onAuthStateChanged(autenticacion, (usuarioFirebase) => {
    if (usuarioFirebase === null || usuarioFirebase.email === null) {
      alCambiar(null);
      return;
    }

    // Firebase solo sabe el correo. Buscamos el nombre y el rol en
    // nuestra lista. Si el correo no está, es como si no hubiera nadie.
    const usuario = buscarUsuarioPorCorreo(usuarioFirebase.email);
    if (usuario === undefined) {
      alCambiar(null);
    } else {
      alCambiar(usuario);
    }
  });

  return dejarDeEscuchar;
}

// Exportamos las 4 funciones que las pantallas pueden usar.
// buscarUsuarioPorCorreo y traducirError NO se exportan: son ayudantes privados.
export { iniciarSesion, cerrarSesion, escucharSesion, enviarCorreoRecuperacion };
