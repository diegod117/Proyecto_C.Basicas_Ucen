// alertas.ts
// Funciones de ayuda para generar y clasificar alertas automáticas del sistema.
// Recorre los recursos del inventario y detecta si alguno necesita atención:
// unidades dañadas, en mantención o insumos bajo su stock mínimo.
// Cubre: HU-09 (generación de alertas automáticas), RF-04

import type { Recurso } from '../types/Recurso';
import type { Alerta, TipoAlerta } from '../types/Alerta';
import { obtenerRecursos } from '../services/recursosService';
import { obtenerFechaActual } from './fechas';

// ------------------------------------------------------------------
// textoTipoAlerta
// ------------------------------------------------------------------
// Recibe: un tipo de alerta ('mantencion', 'reparacion' o 'reposicion').
// Devuelve: el texto en español con mayúscula inicial para mostrar en pantalla.
// Sigue el mismo patrón que textoEstado() y textoCategoria() en inventario.ts.
export function textoTipoAlerta(tipo: TipoAlerta): string {
  if (tipo === 'mantencion') {
    return 'Mantención';
  } else if (tipo === 'reparacion') {
    return 'Reparación';
  } else {
    return 'Reposición';
  }
}

// ------------------------------------------------------------------
// generarAlertas
// ------------------------------------------------------------------
// Recibe: opcionalmente una lista de recursos (por defecto usa la del servicio).
// Devuelve: una lista de alertas generadas según las condiciones de RF-04:
// 1. Dañados: si tiene unidades con daño, genera alerta de 'reparacion'.
// 2. Mantención: si tiene unidades en mantención, genera alerta de 'mantencion'.
// 3. Reposición: si el recurso tiene un stockMinimo definido y las unidades
//    disponibles son menores o iguales a ese mínimo (ej: guantes de nitrilo).
export function generarAlertas(recursos: Recurso[] = obtenerRecursos()): Alerta[] {
  const alertas: Alerta[] = [];
  const fechaHoy = obtenerFechaActual();

  for (const recurso of recursos) {
    // Caso 1: Unidades dañadas -> alerta de reparación
    if (recurso.cantidades.danado > 0) {
      // El verbo también cambia: "1 unidad dañada requiere" pero
      // "2 unidades dañadas requieren"
      let unidadesTexto = '';
      if (recurso.cantidades.danado === 1) {
        unidadesTexto = '1 unidad dañada requiere';
      } else {
        unidadesTexto = recurso.cantidades.danado + ' unidades dañadas requieren';
      }

      alertas.push({
        id: 'alerta-' + recurso.id + '-reparacion',
        recursoId: recurso.id,
        tipo: 'reparacion',
        mensaje: recurso.nombre + ': ' + unidadesTexto + ' reparación.',
        fecha: fechaHoy,
      });
    }

    // Caso 2: Unidades en mantención -> alerta de mantención
    if (recurso.cantidades.en_mantencion > 0) {
      const unidadesTexto =
        recurso.cantidades.en_mantencion === 1
          ? '1 unidad en mantención'
          : recurso.cantidades.en_mantencion + ' unidades en mantención';

      alertas.push({
        id: 'alerta-' + recurso.id + '-mantencion',
        recursoId: recurso.id,
        tipo: 'mantencion',
        mensaje: recurso.nombre + ': ' + unidadesTexto + '.',
        fecha: fechaHoy,
      });
    }

    // Caso 3: Insumo o reactivo bajo stock mínimo -> alerta de reposición
    // El stockMinimo es opcional (solo lo tienen insumos y reactivos).
    // Verificamos si existe y si la cantidad disponible cayó al mínimo o menos.
    if (
      recurso.stockMinimo !== undefined &&
      recurso.cantidades.disponible <= recurso.stockMinimo
    ) {
      // "1 disponible" en singular y "0 disponibles" o "3 disponibles" en plural
      let disponiblesTexto = '';
      if (recurso.cantidades.disponible === 1) {
        disponiblesTexto = '1 disponible';
      } else {
        disponiblesTexto = recurso.cantidades.disponible + ' disponibles';
      }

      alertas.push({
        id: 'alerta-' + recurso.id + '-reposicion',
        recursoId: recurso.id,
        tipo: 'reposicion',
        mensaje:
          recurso.nombre +
          ': stock bajo (' +
          disponiblesTexto +
          ', mínimo requerido: ' +
          recurso.stockMinimo +
          ').',
        fecha: fechaHoy,
      });
    }
  }

  return alertas;
}
