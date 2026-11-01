// usuariosService.ts
// Servicio de los usuarios: guarda y lee la colección "usuarios" de Firestore.
// Cada documento se llama igual que el correo (en minúsculas) y tiene: correo,
// nombre, rol, activo (true o false) y fechaAlta. El login (authService) usa
// leerUsuarioPorCorreo; la sección "Usuarios" de Configuración, las demás.
// No se borra a nadie: se DESACTIVA. El nombre no se modifica (une al docente
// con sus reservas).
// Cubre: HU-15, RF-14 (CA-15.2 a CA-15.4), RNF-03

import { collection, getDocs, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { baseDatos } from './firebase';
import { crearCuentaDeAcceso, enviarEnlaceDeAcceso } from './cuentasService';
import type {
  CambioUsuario,
  DatosNuevoUsuario,
  ResultadoAltaUsuario,
  ResultadoLecturaUsuario,
  Usuario,
} from '../types/Usuario';
import { obtenerFechaActual } from '../utils/fechas';
import {
  documentoAUsuario,
  normalizarCorreo,
  validarCambioUsuario,
  validarNuevoUsuario,
} from '../utils/usuarios';

// Copia en memoria de la colección. La llena cargarUsuarios(), que llama la
// sección "Usuarios" (solo la puede leer el encargado, por eso no se carga
// junto con los otros datos).
const listaUsuarios: Usuario[] = [];

// ordenarLista: deja la lista ordenada por nombre
function ordenarLista(): void {
  listaUsuarios.sort(function (a, b) {
    return a.nombre.localeCompare(b.nombre);
  });
}

// cargarUsuarios: descarga todos los usuarios (solo si quien pide es encargado)
// y llena la copia en memoria. Si falla, lanza un error.
export async function cargarUsuarios(): Promise<void> {
  const resultado = await getDocs(collection(baseDatos, 'usuarios'));
  listaUsuarios.splice(0, listaUsuarios.length);
  for (const documento of resultado.docs) {
    const usuario = documentoAUsuario(documento.data());
    if (usuario !== null) {
      listaUsuarios.push(usuario);
    }
  }
  ordenarLista();
}

// obtenerUsuarios: devuelve la lista completa (copia en memoria)
export function obtenerUsuarios(): Usuario[] {
  return listaUsuarios;
}

// leerUsuarioPorCorreo
// Recibe: el correo con el que se inició sesión. Devuelve: una Promise con el
// usuario registrado (ver ResultadoLecturaUsuario). Cada persona puede leer su
// propio documento, esté activa o no. La usa el login (authService).
export async function leerUsuarioPorCorreo(correo: string): Promise<ResultadoLecturaUsuario> {
  try {
    const documento = await getDoc(doc(baseDatos, 'usuarios', normalizarCorreo(correo)));
    if (!documento.exists()) {
      return { usuario: null, error: '' };
    }
    const usuario = documentoAUsuario(documento.data());
    if (usuario === null) {
      return { usuario: null, error: '' };
    }
    return { usuario: usuario, error: '' };
  } catch (error) {
    console.error('Error al leer el usuario en Firestore:', error);
    return { usuario: null, error: 'No se pudo verificar tu cuenta. Revisa tu conexión.' };
  }
}

// agregarUsuario
// Recibe: lo que escribió el encargado (nombre, correo y rol). Devuelve: una
// Promise con { ok, mensaje }. Pasos: validar, crear la cuenta de acceso,
// guardar el documento y enviar el enlace para crear la contraseña. Si la
// cuenta queda creada pero el documento no se guarda, esa persona NO puede
// entrar (sin documento no hay acceso) y volver a agregarla funciona, porque
// "la cuenta ya existía" no es un error.
export async function agregarUsuario(datos: DatosNuevoUsuario): Promise<ResultadoAltaUsuario> {
  const error = validarNuevoUsuario(datos, listaUsuarios);
  if (error !== '') {
    return { ok: false, mensaje: error };
  }

  const correo = normalizarCorreo(datos.correo);
  const resultadoCuenta = await crearCuentaDeAcceso(correo);
  if (resultadoCuenta !== 'creada' && resultadoCuenta !== 'existia') {
    return { ok: false, mensaje: resultadoCuenta };
  }

  const usuarioNuevo: Usuario = {
    correo: correo,
    nombre: datos.nombre.trim(),
    rol: datos.rol,
    activo: true,
  };
  try {
    await setDoc(doc(baseDatos, 'usuarios', correo), {
      correo: usuarioNuevo.correo,
      nombre: usuarioNuevo.nombre,
      rol: usuarioNuevo.rol,
      activo: true,
      fechaAlta: obtenerFechaActual(),
    });
  } catch (errorGuardado) {
    console.error('Error al guardar el usuario en Firestore:', errorGuardado);
    return {
      ok: false,
      mensaje: 'La cuenta de acceso quedó creada pero no se pudo registrar al usuario. Vuelve a intentarlo.',
    };
  }
  listaUsuarios.push(usuarioNuevo);
  ordenarLista();

  const errorCorreo = await enviarEnlaceDeAcceso(correo);
  let mensaje = 'Usuario ' + usuarioNuevo.nombre + ' agregado.';
  if (resultadoCuenta === 'existia') {
    mensaje = mensaje + ' Ese correo ya tenía una cuenta de acceso, se conserva.';
  }
  if (errorCorreo === '') {
    mensaje = mensaje + ' Se envió el enlace para crear la contraseña.';
  } else {
    mensaje = mensaje + ' No se pudo enviar el correo: usa "Reenviar acceso".';
  }
  return { ok: true, mensaje: mensaje };
}

// modificarUsuario
// Recibe: el correo del usuario y el campo que cambia (su rol, o si queda activo).
// Devuelve: una Promise con '' si se guardó, o el mensaje de error.
// Antes de guardar revisa que siga habiendo un encargado activo
// (validarCambioUsuario). Primero Firestore y, si lo aceptó, la copia en memoria.
export async function modificarUsuario(correo: string, cambio: CambioUsuario): Promise<string> {
  const usuario = listaUsuarios.find((u) => u.correo === correo);
  if (usuario === undefined) {
    return 'No se encontró al usuario.';
  }
  const rolNuevo = cambio.rol === undefined ? usuario.rol : cambio.rol;
  const activoNuevo = cambio.activo === undefined ? usuario.activo : cambio.activo;
  const error = validarCambioUsuario(listaUsuarios, correo, rolNuevo, activoNuevo);
  if (error !== '') {
    return error;
  }
  // Solo se envía a Firestore el campo que cambió
  const campos: Record<string, string | boolean> = {};
  if (cambio.rol !== undefined) {
    campos.rol = cambio.rol;
  }
  if (cambio.activo !== undefined) {
    campos.activo = cambio.activo;
  }
  try {
    await updateDoc(doc(baseDatos, 'usuarios', correo), campos);
  } catch (errorGuardado) {
    console.error('Error al modificar el usuario en Firestore:', errorGuardado);
    return 'No se pudo guardar el cambio. Revisa tu conexión.';
  }
  usuario.rol = rolNuevo;
  usuario.activo = activoNuevo;
  return '';
}

// reenviarAcceso
// Recibe: el correo del usuario. Devuelve '' si se envió el correo, o el error.
export async function reenviarAcceso(correo: string): Promise<string> {
  return enviarEnlaceDeAcceso(correo);
}
