// Configuracion.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Los moldes (interfaces) de las tres cosas que el encargado puede AGREGAR
// desde la página "Configuración": categorías, torres y salas.
// Antes eran listas fijas escritas en el código; para agregar una había que
// programar. Ahora se guardan en Firestore, así la app CRECE sin tocar el
// código (eso es "escalabilidad", RNF-05: incorporar categorías sin
// cambios estructurales).
// En la guía: paso 2 (interface) y paso 13 (Configuración).
// Cubre: RF-08 (categorías), RF-10 (ubicación: torres y salas), RNF-05

// Categoria
// Una categoría de recurso.
// Ej: { clave: 'instrumento', nombre: 'Instrumento', usaStockMinimo: false }
export interface Categoria {
  // La clave: en minúsculas, sin tildes ni espacios ('instalacion').
  // Es lo que se guarda en cada recurso (recurso.categoria = 'instalacion').
  clave: string;
  // El nombre bonito que ve la persona ("Instalación").
  nombre: string;
  // true si las cosas de esta categoría se GASTAN y hay que volver a
  // comprarlas (como insumos y reactivos). En ese caso el formulario
  // "Agregar recurso" pide su stock mínimo (HU-09).
  usaStockMinimo: boolean;
}

// Torre
// Un edificio donde hay laboratorios. Ej: { letra: 'B' }
// Solo tiene un dato, pero igual es un objeto: así, si mañana queremos
// agregarle algo (ej: un nombre), no hay que cambiar todo.
export interface Torre {
  letra: string;
}

// Sala
// Una sala de una torre. Ej: { codigo: 'B307', torre: 'B', numero: '307' }
// El código es torre + número pegados, igual que el que se usa en las reservas.
// Guardamos las tres cosas para no tener que estar cortando el código.
export interface Sala {
  codigo: string;
  torre: string;
  numero: string;
}
