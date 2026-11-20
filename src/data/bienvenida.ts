// bienvenida.ts
// Textos fijos de la página de bienvenida: lo que puede hacer cada rol en
// "Qué puedes hacer", las fotos de esas filas y los integrantes del equipo.
// OJO: a diferencia de los otros archivos de src/data/, estos textos NO se
// suben a Firestore. Son parte de la página, como un título o un botón.
// Cada afirmación se revisó contra el código (permisos.ts, servicios y
// componentes); ver la bitácora J42.
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-03 (qué hace cada rol)

import type { FilaQueHace, FotoBienvenida } from '../types/Bienvenida';

// Lo que puede hacer el docente (el rol que se muestra al abrir la página)
export const filasDocente: FilaQueHace[] = [
  {
    titulo: 'Mira qué hay disponible',
    texto:
      'Busca por nombre y filtra por categoría, laboratorio, estado o antigüedad; cada ficha muestra cuántas unidades están disponibles, en uso, dañadas o en mantención.',
  },
  {
    titulo: 'Reserva por fecha y horario',
    texto:
      'Elige el recurso, la cantidad, la asignatura y una sala libre. El sistema no te deja reservar lo que otro curso ya tomó.',
  },
  {
    titulo: 'Tus reservas, a la mano',
    texto:
      'En Reservas ves tus reservas programadas y en curso, y tu historial de las realizadas. Puedes cancelar las tuyas mientras no hayan terminado.',
  },
  {
    titulo: 'Desde el celular',
    texto: 'Funciona en una pantalla de 360 px: consulta y reserva desde el pasillo.',
  },
];

// Lo que puede hacer el encargado del laboratorio
export const filasEncargado: FilaQueHace[] = [
  {
    titulo: 'Cada equipo, por su número de serie',
    texto:
      'Registra cada unidad con su número de serie y su estado, y cada recurso con su ubicación exacta: torre, sala, bodega y mueble.',
  },
  {
    titulo: 'Entradas, salidas y un historial que no se borra',
    texto:
      'Adquisiciones, préstamos, reposiciones, envíos a mantención y bajas quedan registrados con fecha, motivo y responsable.',
  },
  {
    titulo: 'Alertas antes de que algo falte',
    texto:
      'El sistema avisa cuando un insumo baja de su stock mínimo o hay unidades dañadas o en mantención.',
  },
  {
    titulo: 'La planilla, cargada de una vez',
    texto: 'Sube el Excel del inventario, revisa qué filas tienen errores y guarda solo las válidas.',
  },
];

// Lo que puede hacer el Departamento de Ciencias Básicas
export const filasDepartamento: FilaQueHace[] = [
  {
    titulo: 'El estado de todo el inventario',
    texto: 'Consulta cada recurso con su estado, su ubicación y su historial.',
  },
  {
    titulo: 'Alertas e incidencias a la vista',
    texto: 'Revisa las alertas de reparación, mantención y reposición, y el historial de incidencias.',
  },
  {
    titulo: 'La antigüedad de cada equipo',
    texto:
      'Cada ficha muestra la fecha de adquisición y la antigüedad en años y meses; filtra por menos de 1 año, entre 1 y 2 o más de 2, para planificar calibraciones y renovaciones.',
  },
];

// Fotos de las filas: son las mismas para todos los roles (la fila 1 usa la
// primera, la fila 2 la segunda...). Todas se muestran del mismo tamaño.
export const fotosQueHace: FotoBienvenida[] = [
  { archivo: 'osciloscopio.jpg', alt: 'Osciloscopio analógico sobre un mesón, con su pantalla encendida' },
  { archivo: 'ph-metro.jpg', alt: 'pH-metro de mesa antiguo con su aguja y sus perillas' },
  { archivo: 'probetas-graduadas.jpg', alt: 'Dos probetas graduadas junto a un mortero y frascos de reactivo' },
  { archivo: 'densimetro.jpg', alt: 'Una mano introduce un densímetro en una probeta con una muestra de color café' },
];

// Integrantes del equipo, escritos como pidió el profesor. Los usan
// "Hecho en la Central" y el bloque de créditos del pie.
export const integrantesEquipo: string[] = ['Johann Cortés Farias', 'Diego Cortés Toro', 'Martín Zepeda Puelles'];
