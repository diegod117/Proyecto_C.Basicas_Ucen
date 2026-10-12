// CambioEstado.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el molde de UNA LÍNEA del historial de un recurso.
// Piensa en el historial como un diario de vida del recurso: cada vez que
// le pasa algo (se daña, se repara, llegan unidades nuevas), se escribe
// una línea nueva en el diario. Este archivo dice qué datos tiene esa línea.
// En la guía: paso 2 (TypeScript) y paso 8 (historial).
// Cubre: HU-06 (historial de cambios de estado), RF-01, RF-04 (reposición), RNF-06

// "import" = traer algo que está en OTRO archivo, como pedirle prestado
// un lápiz a un compañero. Aquí traemos el tipo EstadoRecurso desde Recurso.ts.
// "import type" = solo traemos un tipo (un molde), no código que se ejecute.
// './Recurso' = el archivo Recurso.ts que está en esta MISMA carpeta (el "./").
import type { EstadoRecurso } from './Recurso';

// ¿Qué clase de cosa pasó? Solo puede ser una de estas tres:
//   - 'cambio_estado': unas unidades pasaron de un estado a otro
//     (ej: de Disponible a Dañado). El total de unidades NO cambia.
//   - 'reposicion': llegaron unidades NUEVAS (ej: se compraron guantes).
//     Se suman a "disponible" y el total SUBE.
//   - 'alta': el recurso se agregó por primera vez al inventario.
export type TipoMovimiento = 'cambio_estado' | 'reposicion' | 'alta';

// CambioEstado: una línea del diario.
// Ejemplo en palabras: "El 01/10 a las 11:20, Pedro Soto pasó 1 multímetro
// de Disponible a Dañado porque tenía la punta rota".
// Fíjate que cada dato de esa frase tiene su lugar abajo.
export interface CambioEstado {
  id: number; // el número de la línea (1, 2, 3...)
  tipo: TipoMovimiento; // qué clase de cosa pasó (ver arriba)
  recursoId: number; // a QUÉ recurso le pasó (su número)
  fecha: string; // cuándo pasó, ej: "2026-10-01 11:20" (la app la pone sola)
  // En una reposición las unidades son nuevas y no "vienen" de ningún estado,
  // así que ahí los dos estados quedan como 'disponible'.
  estadoAnterior: EstadoRecurso; // en qué estado ESTABAN las unidades
  estadoNuevo: EstadoRecurso; // a qué estado PASARON
  cantidad: number; // cuántas unidades
  motivo: string; // por qué (lo escribe el encargado, ej: "Punta rota")
  usuario: string; // quién lo hizo (el nombre de la persona conectada)
}
