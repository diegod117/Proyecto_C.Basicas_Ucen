// cargaDatos.ts
// Descarga TODOS los datos desde Firestore al iniciar sesión.
// Cada servicio tiene su propia función para cargar (cargarRecursos,
// cargarHistorial...). Este archivo solo las llama una tras otra, así
// App.tsx no tiene que conocer cada servicio por separado.
// Cubre: RNF-06 (los datos se guardan en Firestore y no se pierden)
//
// Cuando se agregue la carga de otro servicio (historial, incidencias,
// reservas), se suma aquí con un "await" más. Avisar al grupo antes.

import { cargarRecursos } from './recursosService';
import { cargarHistorial } from './historialService';

// cargarTodosLosDatos
// No recibe nada.
// Devuelve: '' (texto vacío) si se cargó todo bien, o un mensaje de error.
// Usa try/catch: si cualquiera de las cargas falla, el código salta al catch.
export async function cargarTodosLosDatos(): Promise<string> {
  try {
    await cargarRecursos();
    await cargarHistorial();
  } catch (error) {
    // console.error muestra el error técnico en la consola del navegador
    // (F12), para poder revisarlo. Al usuario le mostramos un mensaje simple.
    console.error('Error al cargar los datos desde Firestore:', error);
    return 'No se pudieron cargar los datos del inventario. Revisa tu conexión a internet.';
  }
  return '';
}
