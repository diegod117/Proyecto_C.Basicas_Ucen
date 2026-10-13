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
import { cargarIncidencias } from './incidenciasService';
import { cargarReservas } from './reservasService';
import { cargarConfiguracion } from './configuracionService';

// La carga que está en curso, o null si no hay ninguna.
// En modo desarrollo (npm run dev), React ejecuta los useEffect DOS veces
// seguidas para ayudar a encontrar errores. Sin esto, la carga correría dos
// veces al mismo tiempo: si las colecciones están vacías, las dos intentarían
// subir los datos de prueba y Firestore rechazaría la segunda (sería
// "modificar" documentos que no se pueden modificar).
let cargaEnCurso: Promise<string> | null = null;

// cargarTodosLosDatos
// No recibe nada.
// Devuelve: '' (texto vacío) si se cargó todo bien, o un mensaje de error.
// Si ya hay una carga en curso, devuelve ESA misma promesa en vez de
// empezar otra: los dos que la pidieron reciben el mismo resultado.
export async function cargarTodosLosDatos(): Promise<string> {
  if (cargaEnCurso === null) {
    cargaEnCurso = cargarUnaVez();
  }
  const resultado = await cargaEnCurso;
  // Terminó: la próxima vez (por ejemplo, "Reintentar") se carga de nuevo
  cargaEnCurso = null;
  return resultado;
}

// cargarUnaVez
// Hace la carga de verdad, servicio por servicio.
// Devuelve: '' si se cargó todo bien, o un mensaje de error.
// Usa try/catch: si cualquiera de las cargas falla, el código salta al catch.
async function cargarUnaVez(): Promise<string> {
  try {
    await cargarConfiguracion();
    await cargarRecursos();
    await cargarHistorial();
    await cargarIncidencias();
    await cargarReservas();
  } catch (error) {
    // console.error muestra el error técnico en la consola del navegador
    // (F12), para poder revisarlo. Al usuario le mostramos un mensaje simple.
    console.error('Error al cargar los datos desde Firestore:', error);
    return 'No se pudieron cargar los datos del inventario. Revisa tu conexión a internet.';
  }
  return '';
}
