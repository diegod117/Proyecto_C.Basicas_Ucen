// reposicion.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para el recuadro "Reponer stock" de la ficha de un recurso
// (cuando llegan unidades nuevas, por ejemplo una compra de guantes):
//   1. revisar que lo que se escribió esté bien,
//   2. armar el mensaje de "listo, se agregaron...".
// En la guía: paso 4 (formularios y validación).
// Cubre: RF-04 y HU-09 (resolver una alerta de reposición)

// validarReposicion
// Recibe: lo que se escribió en el formulario.
//   - cantidadTexto es TEXTO porque las cajitas <input> siempre entregan texto,
//     aunque escribas un número.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
// La idea de "devolver '' si está bien" se repite en toda la app:
// texto vacío = sin errores.
export function validarReposicion(cantidadTexto: string, motivo: string): string {
  // Number('5') convierte el texto '5' en el número 5.
  // Si el texto no es un número (ej: 'hola'), da NaN ("no es un número").
  const cantidad = Number(cantidadTexto);
  // Number.isInteger = "¿es un número entero (sin decimales)?".
  // El ! al principio significa "NO". Se lee:
  // "si NO es entero, O es menor que 1, hay un error".
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }

  // El motivo es obligatorio porque queda en el historial (ej: de qué compra vienen).
  // trim() borra los espacios; si después de borrarlos no queda nada, está vacío.
  if (motivo.trim() === '') {
    return 'Escribe el motivo (ej: "Compra orden 123").';
  }

  // Pasó todas las revisiones.
  return '';
}

// textoResumenReposicion
// Recibe: cuántas unidades se agregaron y cuántas disponibles hay ahora.
// Devuelve: el mensaje de "listo".
// Ejemplo: "Se agregaron 10 unidades. Ahora hay 12 disponibles."
export function textoResumenReposicion(cantidad: number, disponiblesAhora: number): string {
  // Partimos con el plural, y si es solo 1, lo cambiamos al singular:
  // "Se agregaron 10 unidades" / "Se agregó 1 unidad".
  let inicio = 'Se agregaron ' + cantidad + ' unidades';
  if (cantidad === 1) {
    inicio = 'Se agregó 1 unidad';
  }
  return inicio + '. Ahora hay ' + disponiblesAhora + ' disponibles.';
}
