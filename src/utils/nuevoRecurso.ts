// nuevoRecurso.ts
// Funciones de ayuda para el formulario "Agregar recurso": validar lo que
// escribió el encargado y convertirlo en un Recurso listo para guardar.
// Cubre: RF-01, RF-08 (categoría) y RF-10, HU-11 (ubicación obligatoria)

import type { Recurso, DatosNuevoRecurso, Ubicacion, CategoriaRecurso } from '../types/Recurso';
import { generarCodigoUbicacion, validarUbicacion } from './ubicacion';

// datosVaciosNuevoRecurso
// Valores con los que parte el formulario (todo vacío, torre B).
export const datosVaciosNuevoRecurso: DatosNuevoRecurso = {
  nombre: '',
  categoria: '',
  cantidadTexto: '1',
  stockMinimoTexto: '',
  torre: 'B',
  sala: '',
  bodega: '',
  mueble: '',
  marca: '',
  numeroSerie: '',
  proveedor: '',
  observacion: '',
};

// usaStockMinimo
// Recibe: los datos del formulario.
// Devuelve: true si la categoría elegida usa stock mínimo (insumos y
// reactivos, ver HU-09). El formulario solo muestra ese campo en ese caso.
export function usaStockMinimo(datos: DatosNuevoRecurso): boolean {
  if (datos.categoria === 'insumo' || datos.categoria === 'reactivo') {
    return true;
  } else {
    return false;
  }
}

// armarUbicacion
// Recibe: los datos del formulario.
// Devuelve: la ubicación con su código generado automáticamente (HU-11),
// ej: torre B, sala 307, Bodega 1, Mueble 2 -> "B307-B1-M2".
export function armarUbicacion(datos: DatosNuevoRecurso): Ubicacion {
  const ubicacion: Ubicacion = {
    torre: datos.torre,
    sala: datos.sala.trim(),
    bodega: datos.bodega.trim(),
    mueble: datos.mueble.trim(),
    codigo: '',
  };
  ubicacion.codigo = generarCodigoUbicacion(ubicacion);
  return ubicacion;
}

// esEnteroMayorQue
// Recibe: un texto y un número mínimo.
// Devuelve: true si el texto es un número entero mayor que el mínimo.
function esEnteroMayorQue(texto: string, minimo: number): boolean {
  const numero = Number(texto);
  return Number.isInteger(numero) && numero > minimo && texto.trim() !== '';
}

// validarNuevoRecurso
// Recibe: los datos del formulario y la lista de recursos que ya existen.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
// Revisa los errores en orden y devuelve el PRIMERO que encuentra.
export function validarNuevoRecurso(datos: DatosNuevoRecurso, existentes: Recurso[]): string {
  if (datos.nombre.trim() === '') {
    return 'Escribe el nombre del recurso.';
  }
  if (datos.categoria === '') {
    return 'Elige la categoría del recurso.';
  }
  if (!esEnteroMayorQue(datos.cantidadTexto, 0)) {
    return 'La cantidad inicial debe ser un número entero mayor que 0.';
  }
  if (usaStockMinimo(datos) && datos.stockMinimoTexto.trim() !== '') {
    // "mayor que -1" = acepta el 0 y cualquier entero positivo
    if (!esEnteroMayorQue(datos.stockMinimoTexto, -1)) {
      return 'El stock mínimo debe ser un número entero (0 o más).';
    }
  }

  // Ubicación obligatoria (HU-11): reutilizamos la validación de J13
  const problemasUbicacion = validarUbicacion(armarUbicacion(datos));
  if (problemasUbicacion.length > 0) {
    return problemasUbicacion[0];
  }

  // No puede haber dos recursos con el mismo nombre en la misma ubicación
  const nombre = datos.nombre.trim().toLowerCase();
  const codigo = armarUbicacion(datos).codigo;
  for (const recurso of existentes) {
    if (recurso.nombre.toLowerCase() === nombre && recurso.ubicacion.codigo === codigo) {
      return 'Ya existe "' + recurso.nombre + '" en ' + codigo + '. Para sumar unidades usa "Reponer stock" en su ficha.';
    }
  }

  return '';
}

// textoOpcional
// Recibe: un texto de un campo opcional.
// Devuelve: el texto sin espacios sobrantes, o undefined si quedó vacío
// (así el campo no se guarda y la ficha muestra "No registrado").
function textoOpcional(texto: string): string | undefined {
  if (texto.trim() === '') {
    return undefined;
  }
  return texto.trim();
}

// armarRecurso
// Recibe: los datos del formulario (ya validados) y el id del recurso nuevo.
// Devuelve: el Recurso listo para guardar. Todas las unidades iniciales
// entran como "disponible"; si alguna viene mala, se cambia después con
// "Cambiar estado" (y queda en el historial).
export function armarRecurso(datos: DatosNuevoRecurso, id: number): Recurso {
  const recurso: Recurso = {
    id: id,
    nombre: datos.nombre.trim(),
    // "as" porque validarNuevoRecurso ya revisó que no esté vacía
    categoria: datos.categoria as CategoriaRecurso,
    ubicacion: armarUbicacion(datos),
    cantidades: {
      disponible: Number(datos.cantidadTexto),
      en_uso: 0,
      danado: 0,
      en_mantencion: 0,
      dado_de_baja: 0,
    },
    marca: textoOpcional(datos.marca),
    numeroSerie: textoOpcional(datos.numeroSerie),
    proveedor: textoOpcional(datos.proveedor),
    observacion: textoOpcional(datos.observacion),
  };

  if (usaStockMinimo(datos) && datos.stockMinimoTexto.trim() !== '') {
    recurso.stockMinimo = Number(datos.stockMinimoTexto);
  }

  return recurso;
}
