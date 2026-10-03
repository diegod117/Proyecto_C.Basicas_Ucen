// Pagina.ts
// Define las páginas (pantallas) que existen en la aplicación.
// Lo usan App.tsx (para saber qué página mostrar) y MenuNavegacion.tsx
// (para saber qué botón marcar). Por eso va en types/ y no repetido.
// Cubre: navegación base (no corresponde a una HU específica)

// Tipo unión: la página actual solo puede ser uno de estos tres textos.
// Cuando se agregue una página nueva (ej: 'alertas' en HU-05),
// se suma aquí y TypeScript nos avisará dónde falta manejarla.
export type Pagina = 'inventario' | 'reservas' | 'incidencias';
