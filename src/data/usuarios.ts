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
    // Mismo nombre que aparece en los datos de prueba del historial y de
    // las incidencias, así la demo se ve coherente.
    nombre: 'Pedro Soto',
    rol: 'encargado',
  },
  {
    correo: 'docente@prueba.cl',
    // Igual que en src/data/reservas.ts: así, al entrar como docente,
    // "Mis reservas" ya muestra sus 2 reservas de prueba (J21).
    nombre: 'Prof. Ana Morales',
    rol: 'docente',
  },
  {
    correo: 'departamento@prueba.cl',
    nombre: 'Luis Sergio Torres',
    rol: 'departamento',
  },
];
