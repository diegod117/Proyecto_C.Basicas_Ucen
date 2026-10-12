// recursos.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Son los recursos de PRUEBA del inventario (datos INVENTADOS).
// ¿Para qué sirven si ahora usamos Firestore (la base de datos de Google)?
// La primera vez que alguien entra a la app y Firestore está vacío, la app
// copia esta lista a Firestore (ver recursosService.ts). Es como la "semilla"
// que se planta para que el inventario no parta vacío.
// Por eso, si borras la colección "recursos" en la consola de Firebase,
// al volver a entrar se vuelve a llenar con ESTA lista.
// Están pensados para probar todos los casos:
//   - las 6 categorías (RF-08)
//   - los 5 estados (RF-01)
//   - 3 laboratorios en 2 torres: B307, B308 y C210 (RF-10)
//   - un insumo con pocas unidades, para que salga una alerta (HU-05, HU-09)
// En la guía: paso 2 (arreglos y objetos) y paso 8 (Firestore).
// Cubre: datos de apoyo para HU-01, HU-02, HU-05 y HU-09

// Traemos el molde Recurso desde la carpeta types.
// '../types/Recurso' = sube UNA carpeta (los ".." = "la carpeta de arriba")
// y después entra a types/Recurso.ts.
import type { Recurso } from '../types/Recurso';

// "const" = una caja con nombre cuyo contenido NO se reemplaza por otro.
// "Recurso[]" = una LISTA de recursos. Los corchetes [] significan "lista"
//   (en programación se dice "arreglo" o "array").
// Cada recurso va entre llaves { } (eso es un "objeto": un grupo de datos
// con nombre, como una ficha) y se separan con comas.
// Si a un recurso le falta un dato obligatorio o tiene un estado mal escrito,
// TypeScript lo subraya en rojo porque no calza con el molde Recurso.
export const listaRecursosPrueba: Recurso[] = [
  {
    id: 1,
    nombre: 'Multímetro Fluke 87V',
    categoria: 'instrumento',
    ubicacion: { torre: 'B', sala: '307', bodega: 'Bodega 1', mueble: 'Mueble 2', codigo: 'B307-B1-M2' },
    // 14 en total: 12 disponibles + 1 dañado + 1 en mantención (igual que el dibujo del diseño)
    cantidades: { disponible: 12, en_uso: 0, danado: 1, en_mantencion: 1, dado_de_baja: 0 },
    numeroSerie: 'FLK-87V-2291',
    marca: 'Fluke',
    proveedor: 'Electrónica Industrial SpA',
    observacion: 'Una unidad con la punta rota',
  },
  {
    id: 2,
    nombre: 'Osciloscopio Rigol DS1054Z',
    categoria: 'equipo',
    ubicacion: { torre: 'B', sala: '307', bodega: 'Bodega 1', mueble: 'Mueble 1', codigo: 'B307-B1-M1' },
    cantidades: { disponible: 3, en_uso: 2, danado: 0, en_mantencion: 1, dado_de_baja: 0 },
    marca: 'Rigol',
    proveedor: 'Electrónica Industrial SpA',
  },
  {
    id: 3,
    nombre: 'Soldador Weller WE1010',
    categoria: 'equipo',
    ubicacion: { torre: 'B', sala: '308', bodega: 'Bodega 1', mueble: 'Mueble 3', codigo: 'B308-B1-M3' },
    cantidades: { disponible: 20, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    marca: 'Weller',
  },
  {
    id: 4,
    nombre: 'Arduino Uno R3',
    categoria: 'equipo',
    ubicacion: { torre: 'B', sala: '308', bodega: 'Bodega 2', mueble: 'Mueble 1', codigo: 'B308-B2-M1' },
    cantidades: { disponible: 26, en_uso: 19, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    marca: 'Arduino',
    proveedor: 'MCI Electronics',
  },
  {
    id: 5,
    nombre: 'Fuente de poder GW Instek GPS-3303',
    categoria: 'equipo',
    ubicacion: { torre: 'B', sala: '307', bodega: 'Bodega 2', mueble: 'Mueble 2', codigo: 'B307-B2-M2' },
    // Una fuente está "dada de baja": se echó a perder para siempre y ya no se usa
    cantidades: { disponible: 5, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 1 },
    numeroSerie: 'GPS-3303-0457',
    marca: 'GW Instek',
    observacion: 'Unidad 0457 dada de baja por falla en el transformador',
  },
  {
    id: 6,
    nombre: 'Termómetro digital',
    categoria: 'instrumento',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Bodega 1', mueble: 'Mueble 1', codigo: 'C210-B1-M1' },
    // El ejemplo que dio el profesor Torres: varios profesores quieren
    // termómetros a la misma hora (ver reservas.ts, reservas 3 y 4)
    cantidades: { disponible: 8, en_uso: 0, danado: 2, en_mantencion: 0, dado_de_baja: 0 },
    proveedor: 'Instrumentos Científicos Ltda.',
  },
  {
    id: 7,
    nombre: 'Guantes de nitrilo (caja 100 un.)',
    categoria: 'insumo',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Bodega 2', mueble: 'Mueble 1', codigo: 'C210-B2-M1' },
    // Quedan 2 cajas y el mínimo es 5. Como 2 es menor que 5,
    // este insumo hace aparecer una alerta de "comprar más" (HU-09)
    cantidades: { disponible: 2, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    proveedor: 'Distribuidora Médica Sur',
    stockMinimo: 5,
  },
  {
    id: 8,
    nombre: 'Sulfato de cobre (frasco 500 g)',
    categoria: 'reactivo',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Bodega 2', mueble: 'Mueble 3', codigo: 'C210-B2-M3' },
    // Este reactivo tiene 6 y el mínimo es 2: le sobra, así que NO da alerta
    cantidades: { disponible: 6, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    proveedor: 'Química Andina SpA',
    stockMinimo: 2,
  },
  {
    id: 9,
    nombre: 'Mesa de trabajo antiestática',
    categoria: 'mobiliario',
    ubicacion: { torre: 'B', sala: '308', bodega: 'Sala', mueble: 'Sin mueble', codigo: 'B308-SALA' },
    cantidades: { disponible: 10, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
  },
  {
    id: 10,
    nombre: 'Campana de extracción de gases',
    categoria: 'instalacion',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Sala', mueble: 'Sin mueble', codigo: 'C210-SALA' },
    cantidades: { disponible: 0, en_uso: 0, danado: 0, en_mantencion: 1, dado_de_baja: 0 },
    observacion: 'En mantención anual del filtro',
  },
];
