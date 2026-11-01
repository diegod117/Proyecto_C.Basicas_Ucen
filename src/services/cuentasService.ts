// cuentasService.ts
// Crea las cuentas de acceso (Firebase Authentication) de los usuarios nuevos
// y envía el correo con el enlace para crear la contraseña.
// Por qué una SEGUNDA instancia de la app: createUserWithEmailAndPassword deja
// iniciada la sesión de la cuenta recién creada. Si la creáramos con la app
// principal, el encargado quedaría desconectado y conectado como el usuario
// nuevo. Con una segunda instancia (que tiene su propia sesión) la sesión
// del encargado no se toca.
// Cubre: HU-15, RF-14 (CA-15.2: se envía un enlace para crear la contraseña),
//        RF-09 (solo el correo de acceso), RNF-10

import { initializeApp, deleteApp, FirebaseError } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { autenticacion, configuracionFirebase } from './firebase';

// Resultado de crear la cuenta de acceso:
//   'creada'  -> se creó la cuenta en Authentication
//   'existia' -> el correo ya tenía cuenta (no es un error: solo falta registrarlo)
//   cualquier otro texto -> el mensaje de error
export type ResultadoCuenta = 'creada' | 'existia' | string;

// crearContrasenaTemporal (se exporta para poder probarla)
// No recibe nada. Devuelve una contraseña al azar de 24 caracteres que nadie
// ve: la persona crea la suya con el enlace del correo. crypto.getRandomValues
// da números al azar seguros (Math.random no sirve para contraseñas).
// Al final se agregan una minúscula, una mayúscula, un número y un símbolo
// por si el proyecto exige una política de contraseñas.
export function crearContrasenaTemporal(): string {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const azar = new Uint32Array(20);
  crypto.getRandomValues(azar);
  let contrasena = '';
  for (const numero of azar) {
    contrasena = contrasena + caracteres[numero % caracteres.length];
  }
  return contrasena + 'aA1!';
}

// traducirErrorCuenta
// Recibe un código de error de Firebase. Devuelve un mensaje en español.
function traducirErrorCuenta(codigo: string): string {
  if (codigo === 'auth/invalid-email') {
    return 'El correo no tiene un formato válido.';
  } else if (codigo === 'auth/operation-not-allowed') {
    return 'Firebase no permite crear cuentas nuevas (revisa Authentication > Configuración).';
  } else if (codigo === 'auth/network-request-failed') {
    return 'No hay conexión a internet.';
  } else if (codigo === 'auth/too-many-requests') {
    return 'Demasiados intentos seguidos. Espera unos minutos e intenta de nuevo.';
  } else {
    return 'No se pudo crear la cuenta de acceso (' + codigo + ').';
  }
}

// crearCuentaDeAcceso
// Recibe: el correo de la persona (en minúsculas).
// Devuelve: una Promise con un ResultadoCuenta (ver arriba).
export async function crearCuentaDeAcceso(correo: string): Promise<ResultadoCuenta> {
  // Un nombre distinto ('cuentas-nuevas') crea OTRA instancia de la app, con
  // su propio login. La instancia principal (la del encargado) no se entera.
  const appSecundaria = initializeApp(configuracionFirebase, 'cuentas-nuevas');
  const authSecundaria = getAuth(appSecundaria);
  try {
    await createUserWithEmailAndPassword(authSecundaria, correo, crearContrasenaTemporal());
    // La instancia secundaria quedó conectada como la persona nueva: cerramos esa sesión
    await signOut(authSecundaria);
    return 'creada';
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        return 'existia';
      }
      return traducirErrorCuenta(error.code);
    }
    return 'No se pudo crear la cuenta de acceso.';
  } finally {
    // finally se ejecuta siempre (salió bien o mal): libera la instancia secundaria
    await deleteApp(appSecundaria);
  }
}

// enviarEnlaceDeAcceso
// Recibe: el correo de la persona.
// Devuelve: '' si Firebase aceptó enviar el correo, o el mensaje de error.
// Es el correo de "crear / restablecer contraseña" de Firebase (D5): trae un
// enlace a la página de Firebase donde la persona elige su contraseña. Sirve
// tanto para el usuario nuevo como para "Reenviar acceso".
export async function enviarEnlaceDeAcceso(correo: string): Promise<string> {
  try {
    await sendPasswordResetEmail(autenticacion, correo);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return 'No se pudo enviar el correo (' + error.code + ').';
    }
    return 'No se pudo enviar el correo.';
  }
  return '';
}
