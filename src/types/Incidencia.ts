// Incidencia.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el molde de una INCIDENCIA: un accidente o problema que pasó en el
// laboratorio (ej: "se cayó un multímetro y se rompió la punta").
// Antes esto se anotaba en una hoja de papel; ahora se guarda en la app.
// En la guía: paso 2 (TypeScript: tipos unión, boolean y "?").
// Cubre: RF-05, HU-04 (formulario de incidencia), HU-10 (historial con estado inicial)

// ------------------------------------------------------------------
// ¿En qué etapa va la incidencia?
// ------------------------------------------------------------------
// Como un semáforo que avanza en un solo sentido:
//   'pendiente'   -> recién anotada, nadie la ha mirado todavía
//   'en_revision' -> el encargado la está revisando
//   'resuelta'    -> ya se arregló
// Toda incidencia nueva parte en 'pendiente' (eso lo pide HU-10).
export type EstadoIncidencia = 'pendiente' | 'en_revision' | 'resuelta';

// ------------------------------------------------------------------
// ¿Qué datos tiene una incidencia?
// ------------------------------------------------------------------
// Son los mismos datos que pedía la hoja de papel (RF-05), más quién
// la anotó y en qué etapa va (HU-10).
export interface Incidencia {
  id: number; // el número de la incidencia (1, 2, 3...)

  // A qué recurso le pasó. Guardamos solo su NÚMERO (id), no el recurso
  // completo. Es como anotar "el alumno con RUT 12.345" en vez de copiar
  // toda su ficha: si después cambia algo de la ficha, el RUT sigue sirviendo.
  recursoId: number;

  // Cuándo se anotó, ej: "2026-10-01 11:20".
  // La app la pone sola: la persona no la escribe.
  fecha: string;

  docentePresente: string; // qué profesor estaba en la sala cuando pasó
  descripcion: string; // qué pasó, contado con palabras

  // boolean = un dato que solo puede ser true (sí) o false (no).
  // Es como un interruptor de luz: prendido o apagado.
  hayPersonasAfectadas: boolean;
  // El "?" después del nombre significa OPCIONAL: este dato puede no estar.
  // Solo se llena si hubo personas afectadas (si el interruptor está en true).
  detalleAfectacion?: string;

  registradaPor: string; // nombre de quien la anotó (la persona conectada)
  estado: EstadoIncidencia; // en qué etapa va (ver el semáforo de arriba)
}
