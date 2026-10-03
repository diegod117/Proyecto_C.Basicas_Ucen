// Incidencia.ts
// Define cómo es una incidencia o accidente ocurrido en el laboratorio.
// Reemplaza la "hoja de incidencia" en papel que se usa hoy.
// Cubre: RF-05, HU-04 (formulario de incidencia), HU-10 (historial con estado inicial)

// ------------------------------------------------------------------
// Estado de la incidencia (HU-10)
// ------------------------------------------------------------------
// Toda incidencia nace como "pendiente" (lo pide HU-10).
// Luego el encargado la revisa y finalmente la marca como resuelta.
// Orden esperado: pendiente -> en_revision -> resuelta
export type EstadoIncidencia = 'pendiente' | 'en_revision' | 'resuelta';

// ------------------------------------------------------------------
// Incidencia (RF-05)
// ------------------------------------------------------------------
// Los campos son los mismos que pide RF-05: fecha, docente presente,
// descripción, ítem afectado y afectación a usuarios.
// HU-10 agrega: usuario que la registra y estado.
export interface Incidencia {
  id: number;

  // El ítem afectado. Igual que en Reserva, guardamos solo el id del recurso.
  recursoId: number;

  // Fecha y hora en que se registró. HU-10 pide que se ponga sola
  // (automática), así que el usuario no la escribe en el formulario.
  fecha: string; // ej: "2026-10-01 11:20"

  docentePresente: string; // docente que estaba en la clase cuando ocurrió
  descripcion: string; // qué pasó

  // Afectación a usuarios: primero un sí/no (boolean = true o false)
  // y, solo si hubo personas afectadas, un detalle. Por eso el "?" (opcional).
  hayPersonasAfectadas: boolean;
  detalleAfectacion?: string;

  registradaPor: string; // nombre del encargado que la registró (HU-10)
  estado: EstadoIncidencia; // usa el tipo de arriba
}
