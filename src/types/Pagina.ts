// Pagina.ts
// Define las páginas (pantallas) que existen en la aplicación.
// Lo usan App.tsx (para saber qué página mostrar) y MenuNavegacion.tsx
// (para saber qué botón marcar). Por eso va en types/ y no repetido.
// Cubre: navegación base (no corresponde a una HU específica)

// Tipo unión: la página actual solo puede ser uno de estos seis textos.
// Cubre: HU-05 (agrega la página de alertas), RNF-05 (la de configuración)
// y HU-16 (la de carga desde Excel)
export type Pagina =
  | 'inventario'
  | 'reservas'
  | 'incidencias'
  | 'alertas'
  | 'configuracion'
  | 'cargaExcel';
