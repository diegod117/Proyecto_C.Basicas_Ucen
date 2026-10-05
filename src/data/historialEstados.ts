// historialEstados.ts
// Datos de prueba del historial de cambios de estado (datos INVENTADOS).
// Son los dos cambios del multímetro que aparecen en el mockup, más uno
// de los termómetros, para que el historial no parta vacío.
// IMPORTANTE: van ordenados del más antiguo al más nuevo, igual que como
// se van agregando los cambios reales (ver historialService.ts).
// Cubre: datos de apoyo para HU-06

import type { CambioEstado } from '../types/CambioEstado';

export const listaHistorialPrueba: CambioEstado[] = [
  {
    id: 1,
    tipo: 'cambio_estado',
    recursoId: 1, // Multímetro Fluke 87V
    fecha: '2026-09-12 09:05',
    estadoAnterior: 'en_mantencion',
    estadoNuevo: 'disponible',
    cantidad: 1,
    motivo: 'Se cambió el fusible y quedó operativo',
    usuario: 'Pedro Soto',
  },
  {
    id: 2,
    tipo: 'cambio_estado',
    recursoId: 6, // Termómetro digital
    fecha: '2026-09-25 16:40',
    estadoAnterior: 'disponible',
    estadoNuevo: 'danado',
    cantidad: 2,
    motivo: 'Pantalla sin lectura después del práctico',
    usuario: 'Pedro Soto',
  },
  {
    id: 3,
    tipo: 'cambio_estado',
    recursoId: 1, // Multímetro Fluke 87V
    fecha: '2026-10-01 11:20',
    estadoAnterior: 'disponible',
    estadoNuevo: 'danado',
    cantidad: 1,
    motivo: 'Punta rota',
    usuario: 'Pedro Soto',
  },
];
