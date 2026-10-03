// incidencias.ts
// Datos de prueba de incidencias (datos INVENTADOS).
// Hay una incidencia en cada estado: pendiente, en revisión y resuelta.
// Cubre: datos de apoyo para HU-04 y HU-10

import type { Incidencia } from '../types/Incidencia';

export const listaIncidenciasPrueba: Incidencia[] = [
  {
    id: 1,
    recursoId: 1, // Multímetro Fluke 87V
    fecha: '2026-10-01 11:20',
    docentePresente: 'Prof. Ana Morales',
    descripcion: 'Un estudiante dejó caer el multímetro y se rompió la punta de prueba.',
    hayPersonasAfectadas: false,
    // No hay "detalleAfectacion" porque nadie resultó afectado (es opcional)
    registradaPor: 'Pedro Soto (encargado)',
    estado: 'pendiente',
  },
  {
    id: 2,
    recursoId: 8, // Sulfato de cobre
    fecha: '2026-09-28 15:45',
    docentePresente: 'Prof. Jorge Paredes',
    descripcion: 'Derrame de sulfato de cobre sobre el mesón durante el práctico.',
    hayPersonasAfectadas: true,
    detalleAfectacion: 'Un estudiante con irritación leve en la mano. Se lavó con agua y fue a enfermería.',
    registradaPor: 'Pedro Soto (encargado)',
    estado: 'en_revision',
  },
  {
    id: 3,
    recursoId: 2, // Osciloscopio Rigol
    fecha: '2026-09-15 09:10',
    docentePresente: 'Prof. Carlos Fuentes',
    descripcion: 'El osciloscopio no encendía. Se envió a mantención y se cambió el fusible.',
    hayPersonasAfectadas: false,
    registradaPor: 'Pedro Soto (encargado)',
    estado: 'resuelta',
  },
];
