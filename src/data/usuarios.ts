// usuarios.ts
// Usuarios de prueba y el rol de cada uno.
// DESDE HU-15 ESTA LISTA YA NO DECIDE QUIÉN ENTRA: los usuarios y sus roles
// están en la colección "usuarios" de Firestore, que administra el encargado
// desde Configuración. Este archivo queda solo como REFERENCIA de qué
// documentos hay que sembrar a mano en la consola de Firebase la primera vez
// (el nombre de cada documento es el correo en minúsculas; ver la bitácora J40).
// Cada correo también debe estar creado en Authentication > Users.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), HU-15

import type { Usuario } from '../types/Usuario';

export const listaUsuarios: Usuario[] = [
  {
    correo: 'encargado@prueba.cl',
    // Mismo nombre que aparece en los datos de prueba del historial y de
    // las incidencias, así la demo se ve coherente.
    nombre: 'Pedro Soto',
    rol: 'encargado',
    activo: true,
  },
  {
    correo: 'docente@prueba.cl',
    // Igual que en src/data/reservas.ts: así, al entrar como docente,
    // "Mis reservas" ya muestra sus 2 reservas de prueba (J21).
    nombre: 'Prof. Ana Morales',
    rol: 'docente',
    activo: true,
  },
  {
    correo: 'departamento@prueba.cl',
    nombre: 'Luis Sergio Torres',
    rol: 'departamento',
    activo: true,
  },
  // Cuenta real de un integrante del equipo (sirve para probar
  // "¿Olvidaste tu contraseña?", porque le llega el correo de verdad).
  {
    correo: 'johann.cortes@alumnos.ucentral.cl',
    nombre: 'Johann Cortés',
    rol: 'encargado',
    activo: true,
  },
];
