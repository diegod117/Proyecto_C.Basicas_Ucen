// fechas.ts
// Funciones de ayuda para trabajar con fechas.
// HU-10 pide que la fecha de la incidencia se ponga sola (automática),
// así que el usuario no la escribe en el formulario.
// Cubre: HU-10 (fecha automática al registrar una incidencia)

// obtenerFechaActual
// No recibe nada.
// Devuelve la fecha y hora actual como texto en formato "AAAA-MM-DD HH:MM".
// Ejemplo: "2026-10-02 23:15"
//
// ¿Por qué una función aparte?
// Porque armar la fecha manualmente con new Date() requiere varios pasos
// (getMonth() empieza en 0, hay que agregar ceros a la izquierda, etc.).
// Si lo hacemos en un solo lugar, evitamos repetir ese código y
// nos aseguramos de que todas las fechas tengan el mismo formato.
export function obtenerFechaActual(): string {
  const ahora = new Date();

  // getFullYear() devuelve el año completo, ej: 2026
  const anio = ahora.getFullYear();

  // getMonth() devuelve el mes empezando en 0 (enero = 0, octubre = 9),
  // por eso le sumamos 1. padStart(2, '0') agrega un cero a la izquierda
  // si el número tiene un solo dígito: "9" → "09".
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');

  // getDate() devuelve el día del mes (1-31)
  const dia = String(ahora.getDate()).padStart(2, '0');

  // getHours() y getMinutes() devuelven la hora y los minutos (0-59)
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');

  return anio + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos;
}
