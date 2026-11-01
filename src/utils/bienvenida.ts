// bienvenida.ts
// Funciones de ayuda de la página de bienvenida (PaginaLogin).
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01

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
