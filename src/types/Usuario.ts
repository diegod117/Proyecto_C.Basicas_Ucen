// Usuario.ts
// Define cómo es un usuario del sistema y qué roles puede tener.
// Lo usan el servicio de autenticación, App.tsx y el menú.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03

// Tipo unión: un usuario solo puede tener uno de estos tres roles
// (los tres usuarios de la tabla 1.2 de requerimientos).
export type RolUsuario = 'encargado' | 'docente' | 'departamento';

// Datos del usuario que inició sesión.
// Firebase solo nos dice el correo; el nombre y el rol los sacamos
// de nuestra lista en src/data/usuarios.ts.
export interface Usuario {
  correo: string;
  nombre: string;
  rol: RolUsuario;
}
