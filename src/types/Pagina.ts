// Pagina.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es la lista de PANTALLAS que tiene la app. Solo hay cuatro.
// La usan dos archivos:
//   - App.tsx, para saber qué pantalla mostrar.
//   - MenuNavegacion.tsx, para saber qué botón del menú pintar como "elegido".
// Como los dos la necesitan, vive aquí en types/ y no copiada dos veces.
// En la guía: paso 2 (tipo unión) y paso 9 (cómo agregar una página nueva).
// Cubre: navegación base y HU-05 (la página de alertas)

// Pagina solo puede ser uno de estos cuatro textos. Si mañana quisieras
// una pantalla nueva (ej: 'reportes'), el PRIMER paso es agregarla aquí.
// Al hacerlo, TypeScript te va a ir mostrando en rojo los lugares
// que todavía no saben qué hacer con ella. ¡Es como una lista de tareas gratis!
export type Pagina = 'inventario' | 'reservas' | 'incidencias' | 'alertas';
