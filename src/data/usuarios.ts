// usuarios.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es la LISTA DE PERSONAS que pueden usar la app, con su nombre y su rol.
// ¡AQUÍ SE CAMBIA EL NOMBRE QUE SALE ARRIBA A LA DERECHA! (ver guía, paso 9)
//
// ¿Cómo funciona el inicio de sesión? En dos partes, como la entrada a una fiesta:
//   1. Firebase (de Google) es el guardia de la puerta: revisa que el correo
//      y la contraseña sean correctos. Las contraseñas viven en Firebase,
//      NO aquí (Consola de Firebase > Authentication > Users).
//   2. Esta lista es la "lista de invitados": dice cómo se llama cada correo
//      y qué rol tiene (qué puede hacer adentro).
// IMPORTANTE: un correo tiene que estar en LOS DOS lugares. Si está en
// Firebase pero no aquí, la app no sabe su rol y no lo deja entrar.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos)

import type { Usuario } from '../types/Usuario';

// Una lista (los corchetes []) de objetos Usuario (cada uno entre llaves {}).
// Para agregar una persona: copia un bloque { ... }, pégalo y cambia los datos.
export const listaUsuarios: Usuario[] = [
  {
    correo: 'encargado@prueba.cl',
    // Se llama igual que en los datos de prueba del historial y de las
    // incidencias, así la demostración se ve ordenada.
    // Si cambias 'Pedro Soto' por otro nombre, ese nombre aparece arriba
    // a la derecha al entrar con este correo.
    nombre: 'Pedro Soto',
    rol: 'encargado',
  },
  {
    correo: 'docente@prueba.cl',
    // Se llama igual que en src/data/reservas.ts. Así, al entrar como
    // docente, "Mis reservas" ya muestra sus 2 reservas de prueba (J21).
    // (La app compara el nombre de la reserva con este nombre.)
    nombre: 'Prof. Ana Morales',
    rol: 'docente',
  },
  {
    correo: 'departamento@prueba.cl',
    nombre: 'Luis Sergio Torres',
    rol: 'departamento',
  },
  // Cuenta real de un integrante del equipo. Sirve para probar
  // "¿Olvidaste tu contraseña?", porque a este correo le llega el email de verdad.
  {
    correo: 'johann.cortes@alumnos.ucentral.cl',
    nombre: 'Johann Cortés',
    rol: 'encargado',
  },
];
