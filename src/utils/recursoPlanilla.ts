// recursoPlanilla.ts
// Convierte una fila de la planilla Excel en un Recurso y compara recursos
// para detectar los repetidos. Lo usa revisionPlanilla.ts.
// Son funciones puras: no guardan nada ni usan Firebase.
// Cubre: HU-16, RF-15 (CA-16.4: los recursos entran "disponibles")

import type { Recurso, Ubicacion } from '../types/Recurso';
import type { FilaPlanilla } from '../types/Importacion';
import { generarCodigoUbicacion } from './ubicacion';
import { limpiarValorOpcional, partirDescripcion, armarObservacion } from './valoresPlanilla';

// textoOUndefined
// Recibe: un texto. Devuelve: ese texto, o undefined si quedó vacío
// (así el campo no se guarda y la ficha muestra "No registrado").
function textoOUndefined(texto: string): string | undefined {
  if (texto === '') {
    return undefined;
  }
  return texto;
}

// armarRecursoDeFila
// Recibe: la fila, la clave de su categoría, el código de su sala (ej: "B206"),
//         la cantidad y la nota de la cantidad (ej: "kit" en "4 kit").
// Devuelve: el Recurso (con id 0: el servicio le pone el id real al guardarlo).
// Todo entra "disponible". La bodega es "Sala" y el mueble "Sin mueble"
// porque la planilla no los trae (es lo que la app usa para los recursos que
// están en la sala misma; después se pueden precisar con "Cambiar ubicación").
// No hay fecha de adquisición: la ficha mostrará "Sin fecha".
export function armarRecursoDeFila(
  fila: FilaPlanilla,
  claveCategoria: string,
  codigoSala: string,
  cantidad: number,
  notaCantidad: string,
): Recurso {
  const partes = partirDescripcion(fila.descripcion);
  const ubicacion: Ubicacion = {
    torre: codigoSala.charAt(0),
    sala: codigoSala.slice(1),
    bodega: 'Sala',
    mueble: 'Sin mueble',
    codigo: '',
  };
  ubicacion.codigo = generarCodigoUbicacion(ubicacion);

  return {
    id: 0,
    nombre: partes.nombre,
    categoria: claveCategoria,
    ubicacion: ubicacion,
    cantidades: { disponible: cantidad, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    marca: textoOUndefined(limpiarValorOpcional(fila.marca)),
    numeroSerie: textoOUndefined(limpiarValorOpcional(fila.serie)),
    proveedor: textoOUndefined(fila.proveedor),
    // El detalle de la descripción, el modelo y la observación van juntos aquí
    observacion: textoOUndefined(
      armarObservacion(partes.detalle, limpiarValorOpcional(fila.modelo), fila.observacion, notaCantidad),
    ),
  };
}

// mismoRecurso
// Recibe: dos recursos. Devuelve: true si son "el mismo" para la carga desde Excel.
// DECISIÓN CONSCIENTE: son el mismo si tienen igual nombre, código de
// ubicación, marca y observación (que lleva el modelo y el detalle). Es más
// laxa que buscarRecursoRepetido ("Agregar recurso" solo mira nombre +
// ubicación) porque la planilla real tiene variantes legítimas con el mismo
// nombre en la misma sala (ej: varios "VASO PRECIPITADO" de distinta marca).
export function mismoRecurso(a: Recurso, b: Recurso): boolean {
  return (
    a.nombre.toLowerCase() === b.nombre.toLowerCase() &&
    a.ubicacion.codigo === b.ubicacion.codigo &&
    (a.marca ?? '') === (b.marca ?? '') &&
    (a.observacion ?? '') === (b.observacion ?? '')
  );
}
