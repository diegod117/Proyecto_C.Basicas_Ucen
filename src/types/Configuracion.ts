// Configuracion.ts
// Define cómo son las categorías, torres y salas que el encargado puede
// agregar desde la página "Configuración". Antes eran listas fijas escritas
// en el código; ahora se guardan en Firestore, así la app crece sin tener
// que programar (RNF-05: incorporar categorías sin cambios estructurales).
// Cubre: RF-08 (categorías con descripción breve), RF-10 (ubicación: torres y salas), RNF-05

// Categoría de un recurso. Ej: { clave: 'instrumento', nombre: 'Instrumento', usaStockMinimo: false }
export interface Categoria {
  clave: string; // en minúsculas, sin tildes ni espacios: es lo que se guarda en cada recurso
  nombre: string; // lo que ve el usuario
  // true si los recursos de esta categoría se gastan y hay que reponerlos
  // (como insumos y reactivos): el formulario pide su stock mínimo (HU-09)
  usaStockMinimo: boolean;
  // true si cada unidad de esta categoría se identifica por número de serie
  // o de inventario (equipos e instrumentos, HU-12). Es opcional porque las
  // categorías guardadas antes de HU-12 no lo tienen (ver utils/unidades.ts).
  usaNumeroSerie?: boolean;
  // Descripción breve de la categoría (RF-08), ej: "Elementos fijos como
  // llaves de gas, data o mesones". Es opcional porque las categorías
  // guardadas antes no la tienen: en ese caso se muestra "Sin descripción".
  descripcion?: string;
}

// Torre (edificio) donde hay laboratorios. Ej: { letra: 'B' }
export interface Torre {
  letra: string;
}

// Sala de una torre. Ej: { codigo: 'B307', torre: 'B', numero: '307' }
// El código es torre + número, igual que el que se usa en las reservas.
export interface Sala {
  codigo: string;
  torre: string;
  numero: string;
}
