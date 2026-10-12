// alertas.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "detector de problemas". Revisa todos los recursos, uno por uno,
// y por cada problema que encuentra crea una alerta (un aviso):
//   - unidades dañadas         -> alerta de "reparación"
//   - unidades en mantención   -> alerta de "mantención"
//   - insumo con pocas unidades -> alerta de "reposición" (hay que comprar)
// Las alertas NO se guardan en ningún lado: se vuelven a calcular cada vez.
// Así nunca quedan viejas: si arreglas un recurso, su alerta desaparece sola.
// Estas alertas son las "notificaciones" de la app: el numerito rojo del menú
// y el Panel de Alertas.
// En la guía: paso 8 (alertas) y paso 9 (cambiar los textos).
// Cubre: HU-09 (generación de alertas automáticas), RF-04

import type { Recurso } from '../types/Recurso';
import type { Alerta, TipoAlerta } from '../types/Alerta';
import { obtenerRecursos } from '../services/recursosService';
import { obtenerFechaActual } from './fechas';

// ------------------------------------------------------------------
// textoTipoAlerta
// ------------------------------------------------------------------
// Recibe: un tipo de alerta "feo" ('mantencion', 'reparacion' o 'reposicion').
// Devuelve: el texto bonito para la pantalla ("Mantención", ...).
// Es el mismo truco de traductor que textoEstado() en inventario.ts.
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
// Recibe: una lista de recursos. Es OPCIONAL: el "= obtenerRecursos()"
//   significa "si no me pasas ninguna lista, uso la del servicio".
//   (Eso se llama "valor por defecto".)
// Devuelve: la lista de alertas que encontró.
// La usan App.tsx (para el numerito rojo del menú) y PaginaAlertas.
export function generarAlertas(recursos: Recurso[] = obtenerRecursos()): Alerta[] {
  const alertas: Alerta[] = [];
  const fechaHoy = obtenerFechaActual();

  // Revisamos cada recurso, uno por uno.
  for (const recurso of recursos) {
    // --- Problema 1: ¿tiene unidades dañadas? -> alerta de reparación ---
    if (recurso.cantidades.danado > 0) {
      // Cuidamos la gramática: el verbo también cambia.
      // "1 unidad dañada requiere" pero "2 unidades dañadas requieren".
      let unidadesTexto = '';
      if (recurso.cantidades.danado === 1) {
        unidadesTexto = '1 unidad dañada requiere';
      } else {
        unidadesTexto = recurso.cantidades.danado + ' unidades dañadas requieren';
      }

      // push = agregamos una alerta nueva al final de la lista.
      // El objeto { } tiene todos los datos del molde Alerta.
      alertas.push({
        // El id se arma pegando textos, ej: "alerta-6-reparacion".
        // Así es único: un recurso solo puede tener una alerta de cada tipo.
        id: 'alerta-' + recurso.id + '-reparacion',
        recursoId: recurso.id,
        tipo: 'reparacion',
        mensaje: recurso.nombre + ': ' + unidadesTexto + ' reparación.',
        fecha: fechaHoy,
      });
    }

    // --- Problema 2: ¿tiene unidades en mantención? -> alerta de mantención ---
    if (recurso.cantidades.en_mantencion > 0) {
      // Aquí se usa un "operador ternario": condicion ? siEsVerdad : siEsMentira
      // Es un if/else escrito en una sola expresión. Se lee:
      // "¿hay exactamente 1? entonces '1 unidad...', si no, 'N unidades...'".
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

    // --- Problema 3: ¿quedan pocas unidades? -> alerta de reposición ---
    // Solo los insumos y reactivos tienen stockMinimo (es opcional, con "?").
    // Por eso preguntamos DOS cosas, unidas con && (que se lee "y"):
    //   1. ¿tiene stockMinimo? (!== undefined = "no es nada" -> sí tiene)
    //   2. ¿las disponibles son menos o iguales (<=) que el mínimo?
    if (
      recurso.stockMinimo !== undefined &&
      recurso.cantidades.disponible <= recurso.stockMinimo
    ) {
      // Gramática otra vez: "1 disponible" pero "0 disponibles" o "3 disponibles".
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
        // Un mensaje largo pegado con + en varias líneas, ej:
        // "Guantes de nitrilo: stock bajo (2 disponibles, mínimo requerido: 5)."
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
