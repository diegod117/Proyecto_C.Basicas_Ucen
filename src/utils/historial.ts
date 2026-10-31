// historial.ts
// Funciones de ayuda para mostrar los movimientos del historial: pasan los
// tipos internos (como 'dano_irreparable') a texto para el usuario.
// Cubre: HU-06 (CA-06.1), RF-13

import type { TipoEntrada, TipoSalida } from '../types/CambioEstado';

// textoSubtipo
// Recibe: el tipo de una entrada o de una salida.
// Devuelve: el texto para mostrar en la tabla del historial.
export function textoSubtipo(subtipo: TipoEntrada | TipoSalida): string {
  if (subtipo === 'adquisicion') {
    return 'Adquisición';
  }
  if (subtipo === 'prestamo') {
    return 'Préstamo';
  }
  if (subtipo === 'reposicion') {
    return 'Reposición';
  }
  if (subtipo === 'dano_reparable') {
    return 'Daño reparable';
  }
  return 'Daño irreparable';
}

// estadoNuevoDeSalida
// Recibe: el tipo de una salida.
// Devuelve: el estado al que pasa la unidad: el daño reparable la deja
// "en mantención" y el irreparable la deja "dado de baja" (CA-14.2).
export function estadoNuevoDeSalida(tipo: TipoSalida): 'en_mantencion' | 'dado_de_baja' {
  if (tipo === 'dano_reparable') {
    return 'en_mantencion';
  }
  return 'dado_de_baja';
}
