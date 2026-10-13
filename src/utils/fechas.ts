// fechas.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Una "caja de herramientas" para fechas. La carpeta utils/ está llena de
// estas cajas: funciones pequeñas que ayudan a varias pantallas.
// Aquí hay una sola herramienta: la que dice qué día y hora es AHORA,
// escrita siempre igual. La usan el historial y las incidencias, porque
// la fecha se pone sola (la persona no la escribe).
// En la guía: paso 2 (funciones con tipos).
// Cubre: HU-10 (fecha automática al registrar una incidencia)

// obtenerFechaActual
// No recibe nada.
// Devuelve: la fecha y hora de ahora como texto, así: "2026-10-02 23:15".
//
// ¿Por qué hacer una función solo para esto?
// Porque armar la fecha tiene varios pasos con trampas (los meses empiezan
// en 0, hay que poner ceros a la izquierda...). Si lo hacemos UNA vez aquí,
// todas las fechas de la app quedan iguales y no repetimos el código.
// ": string" después de los paréntesis = esta función devuelve un texto.
export function obtenerFechaActual(): string {
  // new Date() = "un reloj que marca este preciso momento".
  const ahora = new Date();

  // El año completo, ej: 2026.
  const anio = ahora.getFullYear();

  // ¡Trampa! getMonth() cuenta los meses desde 0: enero = 0, octubre = 9.
  // Por eso le sumamos 1.
  // String(...) convierte el número en texto.
  // padStart(2, '0') = "si el texto tiene menos de 2 letras, rellena con
  // ceros a la izquierda": "9" -> "09". Así todas las fechas miden lo mismo.
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');

  // El día del mes (del 1 al 31).
  const dia = String(ahora.getDate()).padStart(2, '0');

  // La hora (0 a 23) y los minutos (0 a 59).
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');

  // Pegamos todo con + : "2026" + "-" + "10" + ... = "2026-10-02 23:15".
  return anio + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos;
}

// obtenerFechaHoy
// No recibe nada.
// Devuelve la fecha de hoy como texto "AAAA-MM-DD" (sin la hora).
// Ejemplo: "2026-10-12"
// Es el mismo formato que entrega un <input type="date">, así se pueden
// comparar como texto: "2026-10-11" < "2026-10-12" es true.
// (Funciona porque va de lo más grande a lo más chico: año, mes, día.
// Es como ordenar palabras en el diccionario, letra por letra.)
// Cubre: HU-03 (no reservar en fechas que ya pasaron)
export function obtenerFechaHoy(): string {
  // obtenerFechaActual devuelve "AAAA-MM-DD HH:MM"; los primeros 10
  // caracteres son justo la fecha. slice(0, 10) corta el texto ahí.
  return obtenerFechaActual().slice(0, 10);
}
