// CambioEstado.ts
// Define cómo es un registro del historial de estados de un recurso.
// Cada vez que el encargado cambia el estado de unidades de un recurso,
// se guarda un registro así, para saber qué le ha pasado a cada recurso.
// También se registran las reposiciones de stock (unidades nuevas que llegan).
// Cubre: HU-06 (historial de cambios de estado), RF-01, RF-04 (reposición), RNF-06

import type { EstadoRecurso } from './Recurso';

// Tipo de movimiento que se registra en el historial:
//   - 'cambio_estado': unidades que pasan de un estado a otro (el total no cambia).
//   - 'reposicion': llegan unidades NUEVAS y se suman a "disponible" (el total sube).
export type TipoMovimiento = 'cambio_estado' | 'reposicion';

// CambioEstado
// Ejemplo: "El 01/10 a las 11:20, el encargado pasó 1 multímetro de
// Disponible a Dañado porque tenía la punta rota".
export interface CambioEstado {
  id: number;
  tipo: TipoMovimiento; // si fue un cambio de estado o una reposición
  recursoId: number; // a qué recurso le pasó (igual que en Reserva e Incidencia)
  fecha: string; // automática, formato "AAAA-MM-DD HH:MM"
  // En una reposición no hay estado de origen (las unidades son nuevas):
  // ahí ambos estados quedan como 'disponible'.
  estadoAnterior: EstadoRecurso; // desde qué estado salieron las unidades
  estadoNuevo: EstadoRecurso; // a qué estado pasaron
  cantidad: number; // cuántas unidades cambiaron
  motivo: string; // por qué se hizo el cambio (lo escribe el encargado)
  usuario: string; // quién hizo el cambio
}
