// configuracion.ts (en data/)
// ¿QUÉ ES ESTE ARCHIVO?
// Las categorías, torres y salas con las que PARTE la app.
// Son las "semillas": la primera vez que alguien entra y las colecciones de
// Firestore están vacías, configuracionService las sube (las "siembra").
// Después el encargado agrega más desde la página "Configuración".
// Son las mismas que la app usaba antes, cuando eran listas fijas.
// En la guía: paso 13 (Configuración).
// Cubre: datos de apoyo para RF-08, RF-10 y RNF-05

import type { Categoria, Torre, Sala } from '../types/Configuracion';

// Las 6 categorías de RF-08.
// Solo insumos y reactivos usan stock mínimo (HU-09): son los que se gastan.
// "Categoria[]" = una lista de categorías (con el molde de types/Configuracion.ts).
export const listaCategoriasPrueba: Categoria[] = [
  { clave: 'instrumento', nombre: 'Instrumento', usaStockMinimo: false },
  { clave: 'insumo', nombre: 'Insumo', usaStockMinimo: true },
  { clave: 'equipo', nombre: 'Equipo', usaStockMinimo: false },
  { clave: 'reactivo', nombre: 'Reactivo', usaStockMinimo: true },
  { clave: 'mobiliario', nombre: 'Mobiliario', usaStockMinimo: false },
  { clave: 'instalacion', nombre: 'Instalación', usaStockMinimo: false },
];

// Las torres B y C (sección 1.1 de los requerimientos).
export const listaTorresPrueba: Torre[] = [{ letra: 'B' }, { letra: 'C' }];

// Las salas que ya aparecen en los recursos y reservas de prueba.
export const listaSalasPrueba: Sala[] = [
  { codigo: 'B302', torre: 'B', numero: '302' },
  { codigo: 'B307', torre: 'B', numero: '307' },
  { codigo: 'B308', torre: 'B', numero: '308' },
  { codigo: 'C205', torre: 'C', numero: '205' },
  { codigo: 'C210', torre: 'C', numero: '210' },
];
