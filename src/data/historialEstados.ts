// historialEstados.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Son líneas de PRUEBA del historial (el "diario de vida" de los recursos).
// También son "semilla": si Firestore no tiene historial, la app copia estas.
// Son los dos cambios del multímetro que aparecen en el dibujo del diseño,
// más uno de los termómetros, para que el historial no parta vacío.
// IMPORTANTE: van de la más antigua a la más nueva, igual que un diario:
// lo nuevo se escribe al final (ver historialService.ts).
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
