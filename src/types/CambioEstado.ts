// CambioEstado.ts
// Define cómo es un registro del historial de estados de un recurso.
// Cada vez que el encargado cambia el estado de unidades de un recurso,
// se guarda un registro así, para saber qué le ha pasado a cada recurso.
// Cubre: HU-06 (historial de cambios de estado), RF-01, RNF-06

import type { EstadoRecurso } from './Recurso';

// CambioEstado
// Ejemplo: "El 01/10 a las 11:20, el encargado pasó 1 multímetro de
// Disponible a Dañado porque tenía la punta rota".
export interface CambioEstado {
  id: number;
  recursoId: number; // a qué recurso le pasó (igual que en Reserva e Incidencia)
  fecha: string; // automática, formato "AAAA-MM-DD HH:MM"
  estadoAnterior: EstadoRecurso; // desde qué estado salieron las unidades
  estadoNuevo: EstadoRecurso; // a qué estado pasaron
  cantidad: number; // cuántas unidades cambiaron
  motivo: string; // por qué se hizo el cambio (lo escribe el encargado)
  usuario: string; // quién hizo el cambio
}
