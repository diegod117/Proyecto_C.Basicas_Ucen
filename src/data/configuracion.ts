// configuracion.ts
// Categorías, torres y salas iniciales. Se suben a Firestore la primera vez
// (si las colecciones están vacías). Después el encargado agrega más desde
// la página "Configuración".
// Son las mismas que usaba la app antes, cuando eran listas fijas.
// Cubre: datos de apoyo para RF-08 (con descripción breve), RF-10 y RNF-05

import type { Categoria, Torre, Sala } from '../types/Configuracion';

// Las 6 categorías de RF-08. Solo insumos y reactivos usan stock mínimo (HU-09).
// Solo equipos e instrumentos usan número de serie por unidad (HU-12).
// Descripciones: SOLO la de "Instalación" viene de la línea base (RF-08). Las
// otras 5 (Instrumento, Insumo, Equipo, Reactivo y Mobiliario) son una
// propuesta nuestra: texto provisional por confirmar con el stakeholder.
// Estos datos solo se suben a Firestore si la colección "categorias" está
// vacía; las categorías que ya están guardadas no se modifican.
export const listaCategoriasPrueba: Categoria[] = [
  {
    clave: 'instrumento',
    nombre: 'Instrumento',
    usaStockMinimo: false,
    usaNumeroSerie: true,
    descripcion: 'Aparatos de medición, como multímetros o termómetros.',
  },
  {
    clave: 'insumo',
    nombre: 'Insumo',
    usaStockMinimo: true,
    descripcion: 'Materiales que se gastan con el uso, como guantes.',
  },
  {
    clave: 'equipo',
    nombre: 'Equipo',
    usaStockMinimo: false,
    usaNumeroSerie: true,
    descripcion: 'Aparatos de laboratorio de uso general, como osciloscopios o fuentes de poder.',
  },
  {
    clave: 'reactivo',
    nombre: 'Reactivo',
    usaStockMinimo: true,
    descripcion: 'Sustancias químicas que se consumen en las prácticas.',
  },
  {
    clave: 'mobiliario',
    nombre: 'Mobiliario',
    usaStockMinimo: false,
    descripcion: 'Muebles de trabajo, como mesas y bancos.',
  },
  {
    clave: 'instalacion',
    nombre: 'Instalación',
    usaStockMinimo: false,
    descripcion: 'Elementos fijos como llaves de gas, data o mesones.',
  },
];

// Las torres B y C (sección 1.1 de requerimientos)
export const listaTorresPrueba: Torre[] = [{ letra: 'B' }, { letra: 'C' }];

// Las salas que ya aparecen en los recursos y reservas de prueba
export const listaSalasPrueba: Sala[] = [
  { codigo: 'B302', torre: 'B', numero: '302' },
  { codigo: 'B307', torre: 'B', numero: '307' },
  { codigo: 'B308', torre: 'B', numero: '308' },
  { codigo: 'C205', torre: 'C', numero: '205' },
  { codigo: 'C210', torre: 'C', numero: '210' },
];
