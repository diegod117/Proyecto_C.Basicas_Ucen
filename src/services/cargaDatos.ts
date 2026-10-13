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
import { cargarConfiguracion } from './configuracionService';

// La carga que está en curso ahora, o null (= nada) si no hay ninguna.
// ¿Para qué sirve? Mientras programamos (npm run dev), React hace los
// useEffect DOS VECES seguidas, a propósito, para pillar errores.
// Entonces la carga se pediría dos veces al mismo tiempo. Si Firestore está
// vacío, las dos querrían subir los datos de prueba, y Firestore rechaza la
// segunda (sería "modificar" documentos, y las reglas no lo dejan).
// Solución: anotamos aquí la carga que ya partió, y el segundo que llega
// la reutiliza en vez de empezar otra. Es como cuando dos hermanos piden
// pizza: si uno ya llamó, el otro no vuelve a llamar, espera la misma pizza.
// "let" (y no "const") porque esta variable sí cambia.
let cargaEnCurso: Promise<string> | null = null;

// cargarTodosLosDatos
// No recibe nada.
// Devuelve: '' (texto vacío) si todo llegó bien, o un mensaje de error.
//
// "async" = esta función se DEMORA (tiene que ir a internet).
// "Promise<string>" = una PROMESA de que después entregará un texto.
//   Es como pedir una pizza: te dan un número de pedido (la promesa)
//   y la pizza (el texto) llega más tarde.
// "await" = "espera aquí hasta que llegue la pizza antes de seguir".
export async function cargarTodosLosDatos(): Promise<string> {
  // ¿Nadie ha pedido la carga todavía? Entonces la pedimos nosotros.
  // Si ya había una, nos saltamos esto y esperamos la misma.
  if (cargaEnCurso === null) {
    cargaEnCurso = cargarUnaVez();
  }
  const resultado = await cargaEnCurso;
  // Ya terminó: borramos la anotación. Así, si después aprietan
  // "Reintentar", se hace una carga nueva de verdad.
  cargaEnCurso = null;
  return resultado;
}

// cargarUnaVez
// Hace la carga de verdad: le pide a cada servicio sus datos, en orden.
// Devuelve: '' si todo llegó bien, o un mensaje de error.
// Sin "export": solo se usa aquí adentro.
//
// try/catch = "intenta esto, y si algo explota, atrápalo".
//   try { ... }   -> lo que intentamos hacer
//   catch { ... } -> lo que hacemos si falló (en vez de que la app se caiga)
async function cargarUnaVez(): Promise<string> {
  try {
    // La configuración va PRIMERO: los recursos usan las categorías,
    // torres y salas, así que esas tienen que estar listas antes.
    await cargarConfiguracion();
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
