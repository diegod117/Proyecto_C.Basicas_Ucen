// nuevoRecurso.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para el formulario "Agregar recurso":
//   1. con qué valores parte el formulario,
//   2. revisar que lo que se escribió esté bien,
//   3. convertir esos textos en un Recurso de verdad, listo para guardar.
// Es como una receta: los ingredientes (lo que se escribió) entran,
// se revisan, y sale la torta (el Recurso).
// En la guía: paso 4 (formularios) y paso 9 (agregar un dato nuevo a la ficha).
// Cubre: RF-01, RF-08 (categoría) y RF-10, HU-11 (ubicación obligatoria)

import type { Recurso, DatosNuevoRecurso, Ubicacion, CategoriaRecurso } from '../types/Recurso';
import { generarCodigoUbicacion, validarUbicacion } from './ubicacion';

// datosVaciosNuevoRecurso
// Los valores con los que aparece el formulario al abrirlo: casi todo vacío,
// la cantidad en '1' y la torre en 'B'.
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
// Recibe: lo que se lleva escrito en el formulario.
// Devuelve: true si la categoría elegida es insumo o reactivo (las únicas
// que se gastan y hay que volver a comprar, HU-09). El formulario solo
// muestra el campo "Stock mínimo" en ese caso.
export function usaStockMinimo(datos: DatosNuevoRecurso): boolean {
  if (datos.categoria === 'insumo' || datos.categoria === 'reactivo') {
    return true;
  } else {
    return false;
  }
}

// armarUbicacion
// Recibe: lo que se escribió en el formulario.
// Devuelve: la ubicación con su código calculado solo (HU-11).
// Ej: torre B, sala 307, Bodega 1, Mueble 2 -> código "B307-B1-M2".
export function armarUbicacion(datos: DatosNuevoRecurso): Ubicacion {
  // Primero la armamos con el código vacío...
  const ubicacion: Ubicacion = {
    torre: datos.torre,
    sala: datos.sala.trim(),
    bodega: datos.bodega.trim(),
    mueble: datos.mueble.trim(),
    codigo: '',
  };
  // ...y después calculamos el código y lo guardamos dentro.
  ubicacion.codigo = generarCodigoUbicacion(ubicacion);
  return ubicacion;
}

// esEnteroMayorQue
// Recibe: un texto y un número mínimo.
// Devuelve: true si el texto es un número entero MAYOR que el mínimo.
// Ayudante privado (sin export).
function esEnteroMayorQue(texto: string, minimo: number): boolean {
  const numero = Number(texto);
  // Tres condiciones unidas con && ("y"): TODAS tienen que cumplirse.
  //   ¿es entero? Y ¿es mayor que el mínimo? Y ¿no está vacío?
  // (La última hace falta porque Number('') da 0, y no queremos aceptar vacío.)
  return Number.isInteger(numero) && numero > minimo && texto.trim() !== '';
}

// validarNuevoRecurso
// Recibe: lo que se escribió en el formulario y los recursos que ya existen.
// Devuelve: el mensaje del PRIMER error que encuentre, o '' si todo está bien.
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
  // El stock mínimo solo se revisa si se usa Y si se escribió algo
  // (es opcional: se puede dejar vacío).
  if (usaStockMinimo(datos) && datos.stockMinimoTexto.trim() !== '') {
    // "mayor que -1" es un truco para aceptar el 0 y todos los positivos.
    if (!esEnteroMayorQue(datos.stockMinimoTexto, -1)) {
      return 'El stock mínimo debe ser un número entero (0 o más).';
    }
  }

  // La ubicación es obligatoria (HU-11). Reutilizamos la herramienta de
  // ubicacion.ts en vez de escribir las mismas revisiones otra vez.
  // Si hay problemas, mostramos el primero ([0]).
  const problemasUbicacion = validarUbicacion(armarUbicacion(datos));
  if (problemasUbicacion.length > 0) {
    return problemasUbicacion[0];
  }

  // No puede haber dos recursos con el MISMO nombre en el MISMO lugar.
  // Comparamos en minúsculas para que "Guantes" y "guantes" cuenten igual.
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
// Recibe: lo que se escribió en un campo opcional (marca, proveedor...).
// Devuelve: el texto sin espacios sobrantes, o undefined (= nada) si quedó vacío.
// Si es undefined, ese dato no se guarda, y la ficha muestra "No registrado".
// "string | undefined" = devuelve un texto O nada.
function textoOpcional(texto: string): string | undefined {
  if (texto.trim() === '') {
    return undefined;
  }
  return texto.trim();
}

// armarRecurso
// Recibe: lo que se escribió (ya revisado) y el número (id) del recurso nuevo.
// Devuelve: el Recurso listo para guardar.
// Todas las unidades entran como "disponible". Si alguna viene mala, después
// se cambia con "Cambiar estado" en su ficha (y queda en el historial).
export function armarRecurso(datos: DatosNuevoRecurso, id: number): Recurso {
  const recurso: Recurso = {
    id: id,
    nombre: datos.nombre.trim(),
    // "as CategoriaRecurso": TypeScript cree que todavía podría ser '' (vacío),
    // pero validarNuevoRecurso ya revisó que no lo es. Con "as" le decimos
    // "tranquilo, aquí ya es una categoría de verdad".
    categoria: datos.categoria as CategoriaRecurso,
    ubicacion: armarUbicacion(datos),
    cantidades: {
      // Number('3') convierte el texto '3' en el número 3.
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

  // El stock mínimo se agrega solo si corresponde y se escribió algo.
  if (usaStockMinimo(datos) && datos.stockMinimoTexto.trim() !== '') {
    recurso.stockMinimo = Number(datos.stockMinimoTexto);
  }

  return recurso;
}
