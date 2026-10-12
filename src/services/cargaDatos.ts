// cargaDatos.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Cuando alguien inicia sesión, la app tiene que ir a buscar TODOS los datos
// a Firestore (el cuaderno en la nube) y traerlos al computador.
// Cada servicio sabe traer lo suyo (cargarRecursos, cargarHistorial...).
// Este archivo es el "jefe de la mudanza": llama a cada uno, uno después
// del otro, y avisa si algo salió mal. Así App.tsx no tiene que conocer
// cada servicio por separado.
// En la guía: paso 5 (async/await) y paso 8 (los datos).
// Cubre: RNF-06 (los datos se guardan en Firestore y no se pierden)
//
// Si algún día hay un servicio nuevo con datos en Firestore, se agrega aquí
// otra línea "await cargar...()". Avisar al grupo antes.

import { cargarRecursos } from './recursosService';
import { cargarHistorial } from './historialService';
import { cargarIncidencias } from './incidenciasService';
import { cargarReservas } from './reservasService';

// cargarTodosLosDatos
// No recibe nada.
// Devuelve: '' (texto vacío) si todo llegó bien, o un mensaje de error.
//
// "async" = esta función se DEMORA (tiene que ir a internet).
// "Promise<string>" = una PROMESA de que después entregará un texto.
//   Es como pedir una pizza: te dan un número de pedido (la promesa)
//   y la pizza (el texto) llega más tarde.
// "await" = "espera aquí hasta que llegue la pizza antes de seguir".
//
// try/catch = "intenta esto, y si algo explota, atrápalo".
//   try { ... }   -> lo que intentamos hacer
//   catch { ... } -> lo que hacemos si falló (en vez de que la app se caiga)
export async function cargarTodosLosDatos(): Promise<string> {
  try {
    await cargarRecursos();
    await cargarHistorial();
    await cargarIncidencias();
    await cargarReservas();
  } catch (error) {
    // console.error escribe el error en la consola del navegador
    // (se abre con F12 > Console). Ahí lo leemos los programadores.
    // A la persona que usa la app le mostramos un mensaje simple.
    console.error('Error al cargar los datos desde Firestore:', error);
    return 'No se pudieron cargar los datos del inventario. Revisa tu conexión a internet.';
  }
  // Si llegamos aquí, no hubo errores: devolvemos texto vacío = "todo bien".
  return '';
}
