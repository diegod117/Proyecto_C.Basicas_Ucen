// CambioEstado.ts
// Define cómo es un registro del historial de estados de un recurso.
// Cada vez que el encargado cambia el estado de unidades de un recurso,
// se guarda un registro así, para saber qué le ha pasado a cada recurso.
// También se registran las reposiciones de stock (unidades nuevas que llegan).
// Cubre: HU-06 (historial de movimientos), RF-01, RF-04 (reposición), RF-13 (entradas y salidas),
//        RF-10 (cambio de ubicación), RNF-06

import type { EstadoRecurso } from './Recurso';

// Tipo de movimiento que se registra en el historial (CA-06.1):
//   - 'cambio_estado': unidades que pasan de un estado a otro (el total no cambia).
//   - 'entrada': llegan unidades a "disponible" (adquisición, préstamo o reposición).
//   - 'salida': unidades que salen por daño reparable (a mantención) o irreparable (de baja).
//   - 'cambio_ubicacion': el recurso se movió a otra torre, sala, bodega o mueble.
//   - 'alta': el recurso se agregó al inventario con sus unidades iniciales.
//   - 'reposicion': registros ANTIGUOS de reposición. Los registros del historial
//     no se pueden modificar (RNF-06), así que este tipo se sigue aceptando; los
//     nuevos se guardan como 'entrada' con subtipo 'reposicion'.
export type TipoMovimiento =
  | 'cambio_estado'
  | 'entrada'
  | 'salida'
  | 'cambio_ubicacion'
  | 'alta'
  | 'reposicion';

// Por qué entra una unidad (RF-13, CA-14.1)
export type TipoEntrada = 'adquisicion' | 'prestamo' | 'reposicion';

// Por qué sale una unidad (RF-13, CA-14.2):
//   - 'dano_reparable': pasa a "en mantención"
//   - 'dano_irreparable': pasa a "dado de baja"
export type TipoSalida = 'dano_reparable' | 'dano_irreparable';

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
  cantidad: number; // cuántas unidades cambiaron (0 en un cambio de ubicación)
  motivo: string; // por qué se hizo el cambio (lo escribe el encargado)
  usuario: string; // quién hizo el cambio

  // Campos de HU-06 (CA-06.1). Son opcionales porque los registros antiguos
  // no los tienen y no se pueden modificar.
  // Valor anterior y nuevo, escritos como texto para mostrarlos tal cual:
  // un estado ("Disponible") o un código de ubicación ("B307-B1-M2").
  valorAnterior?: string;
  valorNuevo?: string;
  // Número de serie o de inventario de la unidad afectada (HU-12), si se indicó
  unidad?: string;
  // Tipo de la entrada o de la salida (solo en 'entrada' y 'salida')
  subtipo?: TipoEntrada | TipoSalida;
}
