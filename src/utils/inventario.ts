// inventario.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Una caja de herramientas para MOSTRAR el inventario bonito en pantalla.
// La usan varias páginas (Inventario, Reservas, Incidencias, Alertas),
// por eso vive aquí y no copiada en cada una.
// En la guía: paso 2 (funciones) y paso 9 (cambiar textos de la ficha).
// Cubre: HU-01, RF-01 (estados), RF-02 (cantidad), RF-08 (categorías)

// ¿Por qué hacen falta estas herramientas?
// En el código guardamos los estados y categorías "feos": sin tildes ni
// espacios (ej: 'en_mantencion', 'instalacion'), porque así es difícil
// equivocarse al escribirlos. Pero a la persona hay que mostrarle textos
// bonitos ("En mantención", "Instalación"). Estas funciones son el
// "traductor" de feo a bonito, en un solo lugar.
// ¿Quieres que en pantalla diga "Roto" en vez de "Dañado"? Se cambia aquí.

import type { Recurso, EstadoRecurso, CategoriaRecurso } from '../types/Recurso';
import { obtenerCategoriaPorClave } from '../services/configuracionService';

// Los 5 estados en el orden en que se muestran en pantalla.
// Sirve para recorrerlos todos con un for (por ejemplo, para dibujar las
// etiquetas de colores de una tarjeta o las opciones de un filtro).
// "EstadoRecurso[]" = una lista de estados.
export const listaEstadosRecurso: EstadoRecurso[] = [
  'disponible',
  'en_uso',
  'danado',
  'en_mantencion',
  'dado_de_baja',
];

// textoEstado
// Recibe: un estado "feo", ej: 'danado'.
// Devuelve: el texto bonito para la pantalla, ej: "Dañado".
// Es una cadena de if / else if: pregunta uno por uno hasta acertar.
export function textoEstado(estado: EstadoRecurso): string {
  if (estado === 'disponible') {
    return 'Disponible';
  } else if (estado === 'en_uso') {
    return 'En uso';
  } else if (estado === 'danado') {
    return 'Dañado';
  } else if (estado === 'en_mantencion') {
    return 'En mantención';
  } else {
    // Si no fue ninguno de arriba, SOLO puede ser 'dado_de_baja',
    // porque el tipo EstadoRecurso no permite otros valores.
    return 'Dado de baja';
  }
}

// textoCategoria
// Recibe: la CLAVE de una categoría, ej: 'instalacion'.
// Devuelve: su nombre bonito para la pantalla, ej: "Instalación".
// Antes esto era una escalera de if/else con las 6 categorías escritas a
// mano. Ahora los nombres viven en Firestore (colección "categorias"), así
// que solo BUSCAMOS la categoría y devolvemos su nombre. Ventaja: una
// categoría nueva creada en "Configuración" también se ve bonita, sin
// tocar el código.
export function textoCategoria(categoria: CategoriaRecurso): string {
  const encontrada = obtenerCategoriaPorClave(categoria);
  // undefined = "no la encontré". No debería pasar, pero por si acaso
  // mostramos la clave tal cual, en vez de que la app se caiga.
  if (encontrada === undefined) {
    return categoria;
  }
  return encontrada.nombre;
}

// calcularCantidadTotal
// Recibe: un recurso.
// Devuelve: cuántas unidades tiene en total, sumando todos los "cajones".
// Ejemplo: el multímetro tiene 12 disponibles + 1 dañado + 1 en mantención = 14.
// No guardamos el total en el recurso porque podría quedar desactualizado:
// es más seguro sumarlo cada vez.
export function calcularCantidadTotal(recurso: Recurso): number {
  // Guardamos los cajones en una variable con nombre corto para no
  // escribir "recurso.cantidades." cinco veces.
  const cantidades = recurso.cantidades;

  // Una suma escrita en varias líneas para que se lea mejor.
  const total =
    cantidades.disponible +
    cantidades.en_uso +
    cantidades.danado +
    cantidades.en_mantencion +
    cantidades.dado_de_baja;

  return total;
}

// textoCampoOpcional
// Recibe: un dato opcional del recurso (marca, proveedor...), que puede no venir.
// Devuelve: ese mismo texto, o "No registrado" si no viene o está vacío.
// "valor?: string" = este parámetro es opcional (puede llegar undefined),
// igual que los datos con "?" del molde Recurso.
export function textoCampoOpcional(valor?: string): string {
  if (valor === undefined || valor === '') {
    return 'No registrado';
  }
  return valor;
}

// obtenerEstadosConUnidades
// Recibe: un recurso.
// Devuelve: solo los estados que tienen al menos 1 unidad.
// Ejemplo: el Arduino tiene 26 disponibles y 19 en uso, así que devuelve
// ['disponible', 'en_uso']. No tiene sentido mostrar "Dañado (0)".
export function obtenerEstadosConUnidades(recurso: Recurso): EstadoRecurso[] {
  const estadosConUnidades: EstadoRecurso[] = [];

  for (const estado of listaEstadosRecurso) {
    // recurso.cantidades[estado] = "abre el cajón que se llama como diga
    // la variable estado". Si estado es 'en_uso', es lo mismo que
    // recurso.cantidades.en_uso. Funciona porque los cajones se llaman
    // igual que los estados (ver types/Recurso.ts).
    if (recurso.cantidades[estado] > 0) {
      estadosConUnidades.push(estado);
    }
  }

  return estadosConUnidades;
}
