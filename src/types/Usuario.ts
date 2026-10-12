// Usuario.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el molde de una PERSONA que entra a la app, y la lista de "roles"
// (papeles) que puede tener. El rol decide qué puede hacer cada uno,
// como en un colegio: el profesor puede poner notas y el alumno no.
// En la guía: paso 2 (TypeScript) y paso 9 (cómo cambiar el nombre y el rol).
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03

// Los tres papeles posibles. Una persona tiene UNO solo:
//   'encargado'    -> el encargado del laboratorio (puede hacer de todo)
//   'docente'      -> un profesor (puede mirar y reservar)
//   'departamento' -> el jefe del departamento (solo puede mirar)
export type RolUsuario = 'encargado' | 'docente' | 'departamento';

// Los datos de la persona que inició sesión.
// Firebase (el servicio de Google que revisa la contraseña) solo nos dice
// el CORREO. El nombre y el rol los buscamos nosotros en la lista
// src/data/usuarios.ts. ¡Ahí es donde se cambian!
export interface Usuario {
  correo: string; // ej: 'encargado@prueba.cl'
  nombre: string; // ej: 'Pedro Soto' -> es lo que sale arriba a la derecha
  rol: RolUsuario; // ej: 'encargado' -> el menú lo muestra como "Encargado de laboratorio"
}
