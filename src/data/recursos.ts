// recursos.ts
// Datos de prueba del inventario, mientras no exista un backend.
// Son datos INVENTADOS, pensados para probar todos los casos:
//   - las 6 categorías (RF-08)
//   - los 5 estados operativos (RF-01)
//   - 3 laboratorios en 2 torres: B307, B308 y C210 (RF-10)
//   - un insumo bajo su stock mínimo, para probar las alertas (HU-05, HU-09)
// Cubre: datos de apoyo para HU-01, HU-02, HU-05 y HU-09

// "import type" trae solo el tipo (el molde), no código que se ejecute.
import type { Recurso } from '../types/Recurso';

// "Recurso[]" significa "una lista (arreglo) de objetos Recurso".
// Si a algún recurso le falta un campo obligatorio o tiene un estado
// mal escrito, TypeScript lo marca en rojo antes de ejecutar.
export const listaRecursosPrueba: Recurso[] = [
  {
    id: 1,
    nombre: 'Multímetro Fluke 87V',
    categoria: 'instrumento',
    ubicacion: { torre: 'B', sala: '307', bodega: 'Bodega 1', mueble: 'Mueble 2', codigo: 'B307-B1-M2' },
    // 14 en total: 12 disponibles, 1 dañado y 1 en mantención (igual que el mockup)
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
    // Una fuente está dada de baja: ya no se puede usar ni reparar
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
    // Es el ejemplo que dio el profesor Torres: varios docentes
    // necesitan termómetros en el mismo horario (ver reservas.ts)
    cantidades: { disponible: 8, en_uso: 0, danado: 2, en_mantencion: 0, dado_de_baja: 0 },
    proveedor: 'Instrumentos Científicos Ltda.',
  },
  {
    id: 7,
    nombre: 'Guantes de nitrilo (caja 100 un.)',
    categoria: 'insumo',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Bodega 2', mueble: 'Mueble 1', codigo: 'C210-B2-M1' },
    // Quedan 2 cajas y el mínimo es 5: este insumo debería generar
    // una alerta de reposición (HU-09)
    cantidades: { disponible: 2, en_uso: 0, danado: 0, en_mantencion: 0, dado_de_baja: 0 },
    proveedor: 'Distribuidora Médica Sur',
    stockMinimo: 5,
  },
  {
    id: 8,
    nombre: 'Sulfato de cobre (frasco 500 g)',
    categoria: 'reactivo',
    ubicacion: { torre: 'C', sala: '210', bodega: 'Bodega 2', mueble: 'Mueble 3', codigo: 'C210-B2-M3' },
    // Este reactivo SÍ tiene suficiente stock (6 mayor que 2), no debe dar alerta
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
