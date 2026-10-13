// configuracion.ts
// Categorías, torres y salas iniciales. Se suben a Firestore la primera vez
// (si las colecciones están vacías). Después el encargado agrega más desde
// la página "Configuración".
// Son las mismas que usaba la app antes, cuando eran listas fijas.
// Cubre: datos de apoyo para RF-08, RF-10 y RNF-05

import type { Categoria, Torre, Sala } from '../types/Configuracion';

// Las 6 categorías de RF-08. Solo insumos y reactivos usan stock mínimo (HU-09).
export const listaCategoriasPrueba: Categoria[] = [
  { clave: 'instrumento', nombre: 'Instrumento', usaStockMinimo: false },
  { clave: 'insumo', nombre: 'Insumo', usaStockMinimo: true },
  { clave: 'equipo', nombre: 'Equipo', usaStockMinimo: false },
  { clave: 'reactivo', nombre: 'Reactivo', usaStockMinimo: true },
  { clave: 'mobiliario', nombre: 'Mobiliario', usaStockMinimo: false },
  { clave: 'instalacion', nombre: 'Instalación', usaStockMinimo: false },
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
