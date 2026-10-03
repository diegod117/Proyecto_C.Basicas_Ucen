// Alerta.ts
// Define cómo es una alerta generada automáticamente por el sistema.
// Cubre: RF-04 (alertas de mantenimiento, reparación o reposición),
//        HU-09 (generación de alertas) y HU-05 (panel de alertas).

// ------------------------------------------------------------------
// Tipo de alerta (RF-04, HU-09)
// ------------------------------------------------------------------
// Tipo unión con los 3 tipos de alerta exigidos por el requerimiento RF-04:
// - 'mantencion': para recursos que tienen unidades en mantención.
// - 'reparacion': para recursos con unidades dañadas.
// - 'reposicion': para insumos o reactivos cuyo stock disponible cayó
//   bajo el stock mínimo configurado.
export type TipoAlerta = 'mantencion' | 'reparacion' | 'reposicion';

// ------------------------------------------------------------------
// Alerta (HU-09, HU-05)
// ------------------------------------------------------------------
// Representa una alerta individual que se mostrará en el panel de alertas.
export interface Alerta {
  // Identificador único de la alerta (útil para la 'key' en React)
  id: string;

  // Id del recurso al que le ocurrió la condición de alerta
  recursoId: number;

  // Qué tipo de problema o aviso es (usa el tipo unión definido arriba)
  tipo: TipoAlerta;

  // Mensaje explicativo para el usuario (ej: "Bajo stock mínimo: quedan 3 unidades")
  mensaje: string;

  // Fecha o momento en que se genera la alerta (ej: "2026-10-02")
  fecha: string;
}
