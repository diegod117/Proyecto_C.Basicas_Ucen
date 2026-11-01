// usuarios.ts
// Funciones de ayuda para administrar usuarios desde Configuración: validar un
// usuario nuevo y validar que un cambio (desactivar o cambiar el rol) no deje
// al sistema sin encargados. Son funciones puras: no guardan nada ni usan
// Firebase (eso lo hace services/usuariosService.ts).
// Cubre: HU-15, RF-14 (CA-15.2: no se aceptan correos repetidos)

import type { DatosNuevoUsuario, RolUsuario, Usuario } from '../types/Usuario';

// Los tres roles, en el orden en que se muestran en las listas
export const listaRoles: RolUsuario[] = ['encargado', 'docente', 'departamento'];

// textoRol
// Recibe: un rol. Devuelve: su nombre para mostrar en pantalla.
export function textoRol(rol: RolUsuario): string {
  if (rol === 'encargado') {
    return 'Encargado';
  } else if (rol === 'docente') {
    return 'Docente';
  } else {
    return 'Departamento';
  }
}

// normalizarCorreo
// Recibe: un correo como lo escribió la persona. Devuelve: el mismo correo sin
// espacios y en minúsculas. Así "Docente@Prueba.cl" y "docente@prueba.cl"
// son el mismo usuario (y el mismo documento en Firestore).
export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

// correoTieneFormatoValido
// Recibe: un correo. Devuelve: true si tiene la forma algo@dominio.ext, sin
// espacios y sin "/" (Firestore no acepta "/" en el nombre de un documento).
export function correoTieneFormatoValido(correo: string): boolean {
  if (correo === '' || correo.includes(' ') || correo.includes('/')) {
    return false;
  }
  const partes = correo.split('@');
  if (partes.length !== 2 || partes[0] === '' || partes[1] === '') {
    return false;
  }
  // El dominio necesita al menos un punto que no esté al principio ni al final
  const dominio = partes[1];
  return dominio.includes('.') && !dominio.startsWith('.') && !dominio.endsWith('.');
}

// validarNuevoUsuario
// Recibe: lo que escribió el encargado y la lista de usuarios que ya existen.
// Devuelve: un mensaje de error, o '' si se puede agregar. Revisa en orden y
// devuelve el PRIMER problema.
export function validarNuevoUsuario(datos: DatosNuevoUsuario, existentes: Usuario[]): string {
  if (datos.nombre.trim() === '') {
    return 'Escribe el nombre del usuario.';
  }
  const correo = normalizarCorreo(datos.correo);
  if (!correoTieneFormatoValido(correo)) {
    return 'El correo no tiene un formato válido, ej: nombre@ucentral.cl.';
  }
  if (!listaRoles.includes(datos.rol)) {
    return 'Elige el rol del usuario.';
  }
  for (const usuario of existentes) {
    if (usuario.correo.toLowerCase() === correo) {
      return 'Ya existe un usuario con el correo ' + correo + '.';
    }
  }
  return '';
}

// contarEncargadosActivos
// Recibe: la lista de usuarios. Devuelve: cuántos son encargados y están activos.
export function contarEncargadosActivos(lista: Usuario[]): number {
  let cantidad = 0;
  for (const usuario of lista) {
    if (usuario.rol === 'encargado' && usuario.activo) {
      cantidad = cantidad + 1;
    }
  }
  return cantidad;
}

// validarCambioUsuario
// Recibe: la lista de usuarios, el correo del usuario que se cambia y cómo
//         quedaría (su rol nuevo y si quedaría activo).
// Devuelve: un mensaje de error, o '' si el cambio se puede hacer.
// Simula el cambio y revisa que siga habiendo al menos un encargado activo:
// si no, nadie podría volver a administrar los usuarios. (Las reglas de
// Firestore no pueden contar documentos, por eso esta revisión está aquí.)
export function validarCambioUsuario(
  lista: Usuario[],
  correo: string,
  rolNuevo: RolUsuario,
  activoNuevo: boolean,
): string {
  const simulada: Usuario[] = [];
  for (const usuario of lista) {
    if (usuario.correo === correo) {
      simulada.push({ ...usuario, rol: rolNuevo, activo: activoNuevo });
    } else {
      simulada.push(usuario);
    }
  }
  if (contarEncargadosActivos(simulada) === 0) {
    return 'Debe quedar al menos un encargado activo.';
  }
  return '';
}
