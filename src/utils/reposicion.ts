// reposicion.ts
// Funciones de ayuda para el formulario "Reponer stock" de la ficha:
// validar los datos y armar el texto de confirmación.
// Cubre: RF-04 y HU-09 (resolver una alerta de reposición)

// validarReposicion
// Recibe: lo que escribió el usuario en el formulario.
//   - cantidadTexto viene como texto porque así lo entrega el <input>.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
export function validarReposicion(cantidadTexto: string, motivo: string): string {
  // La cantidad debe ser un número entero mayor que 0 (igual que en cambioEstado.ts)
  const cantidad = Number(cantidadTexto);
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }

  // El motivo es obligatorio: queda en el historial (ej: de qué compra vienen)
  if (motivo.trim() === '') {
    return 'Escribe el motivo (ej: "Compra orden 123").';
  }

  return '';
}

// textoResumenReposicion
// Recibe: la cantidad repuesta y cuántas unidades disponibles quedaron.
// Devuelve: el texto de confirmación.
// Ejemplo: "Se agregaron 10 unidades. Ahora hay 12 disponibles."
export function textoResumenReposicion(cantidad: number, disponiblesAhora: number): string {
  // Singular o plural: "Se agregó 1 unidad" / "Se agregaron 10 unidades"
  let inicio = 'Se agregaron ' + cantidad + ' unidades';
  if (cantidad === 1) {
    inicio = 'Se agregó 1 unidad';
  }
  return inicio + '. Ahora hay ' + disponiblesAhora + ' disponibles.';
}
