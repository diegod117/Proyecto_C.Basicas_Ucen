// usuarios.ts
// Lista de usuarios autorizados y el rol de cada uno.
// Firebase se encarga de revisar el correo y la contraseña; esta lista
// solo dice QUÉ ROL tiene cada correo. Mientras no haya base de datos,
// el rol se guarda aquí.
// IMPORTANTE: cada correo de esta lista también debe estar creado en
// Firebase (Authentication > Users), si no, no podrá iniciar sesión.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos)

import type { Usuario } from '../types/Usuario';

export const listaUsuarios: Usuario[] = [
  {
    correo: 'encargado@prueba.cl',
    nombre: 'Encargado de prueba',
    rol: 'encargado',
  },
  {
    correo: 'docente@prueba.cl',
    nombre: 'Docente de prueba',
    rol: 'docente',
  },
  {
    correo: 'departamento@prueba.cl',
    nombre: 'Luis Sergio Torres',
    rol: 'departamento',
  },
];
