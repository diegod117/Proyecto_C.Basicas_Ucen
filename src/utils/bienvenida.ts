// bienvenida.ts
// Funciones de ayuda de la página de bienvenida (PaginaLogin).
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01, RNF-03

import type { RolUsuario } from '../types/Usuario';
import type { FilaQueHace } from '../types/Bienvenida';
import { filasDocente, filasEncargado, filasDepartamento } from '../data/bienvenida';

// filasSegunRol
// Recibe: el rol elegido en el selector de "Qué puedes hacer".
// Devuelve: las filas (título y párrafo) de lo que puede hacer ese rol.
export function filasSegunRol(rol: RolUsuario): FilaQueHace[] {
  if (rol === 'encargado') {
    return filasEncargado;
  } else if (rol === 'departamento') {
    return filasDepartamento;
  } else {
    return filasDocente;
  }
}

// enfocarCampoCorreo
// No recibe nada. No devuelve nada.
// Pone el cursor en el campo de correo del formulario de ingreso. La usan los
// botones "Ingresar" de la barra de arriba y del pie: así, desde cualquier
// parte de la página, se llega al formulario con un clic.
// focus() además hace scroll hasta el campo si no se ve.
// Si está abierto el formulario de recuperar contraseña, el campo de correo
// tiene otro id ('recuperar-correo'), por eso se prueban los dos.
export function enfocarCampoCorreo(): void {
  let campo = document.getElementById('login-correo');
  if (campo === null) {
    campo = document.getElementById('recuperar-correo');
  }

  // instanceof revisa que de verdad sea un <input> antes de usarlo
  if (campo instanceof HTMLInputElement) {
    campo.focus();
  }
}
