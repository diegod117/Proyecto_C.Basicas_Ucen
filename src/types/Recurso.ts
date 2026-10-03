// Recurso.ts
// Define cómo es un "recurso" del laboratorio: un instrumento, equipo, insumo, etc.
// Cubre: RF-01 (estado operativo), RF-02 (cantidad operativa), RF-08 (categoría),
//        RF-10 y HU-11 (ubicación física), HU-09 (stock mínimo de insumos)

// ¿Qué es este archivo?
// Aquí NO hay lógica ni pantallas, solo "moldes" de datos.
// TypeScript usa estos moldes para avisarnos si nos equivocamos,
// por ejemplo si escribimos "dañdo" en vez de "danado" o si olvidamos un campo.
// Estos tipos desaparecen al compilar: el navegador nunca los ve.

// ------------------------------------------------------------------
// Categoría del recurso (RF-08)
// ------------------------------------------------------------------
// Esto es un "tipo unión" (union type): la variable solo puede tener
// UNO de estos textos exactos. Si escribimos otro texto, TypeScript marca error.
// Para agregar una categoría nueva basta con sumarla aquí (RNF-05).
export type CategoriaRecurso =
  | 'instrumento'
  | 'insumo'
  | 'equipo'
  | 'reactivo'
  | 'mobiliario'
  | 'instalacion';

// ------------------------------------------------------------------
// Estado operativo (RF-01)
// ------------------------------------------------------------------
// Son los 5 estados que pide el requerimiento.
// Ojo: "reservado" NO es un estado del recurso. Una reserva se guarda
// aparte (ver Reserva.ts), porque depende de la fecha y el horario.
// Usamos guion bajo y sin tildes para evitar problemas al escribir el código.
export type EstadoRecurso =
  | 'disponible'
  | 'en_uso'
  | 'danado'
  | 'en_mantencion'
  | 'dado_de_baja';

// ------------------------------------------------------------------
// Torre donde está el laboratorio
// ------------------------------------------------------------------
// Los laboratorios del departamento están en los edificios (torres) B y C
// (ver sección 1.1 de los requerimientos).
export type Torre = 'B' | 'C';

// ------------------------------------------------------------------
// Ubicación física (RF-10, HU-11)
// ------------------------------------------------------------------
// Una "interface" describe la forma de un objeto: qué propiedades tiene
// y de qué tipo es cada una. Todas son obligatorias porque HU-11 dice
// que la ubicación es obligatoria.
//
// El laboratorio se identifica con torre + sala. Ejemplo: "B307" es la
// sala 307 de la torre B. Los guardamos separados para poder filtrar
// por torre o por sala más adelante (HU-01).
export interface Ubicacion {
  torre: Torre; // "B" o "C"
  sala: string; // ej: "307"
  bodega: string; // ej: "Bodega 1"
  mueble: string; // ej: "Mueble 2"
  codigo: string; // código corto para encontrarlo rápido, ej: "B307-B1-M2"
}

// ------------------------------------------------------------------
// Cantidad de unidades en cada estado (RF-01, RF-02)
// ------------------------------------------------------------------
// Un recurso puede tener varias unidades (ej: 14 multímetros) y no todas
// están igual: 12 disponibles, 1 dañado, 1 en mantención.
// Por eso guardamos cuántas unidades hay en CADA estado.
// Los nombres de las propiedades son iguales a los de EstadoRecurso
// para que sea fácil relacionarlos más adelante.
export interface CantidadesPorEstado {
  disponible: number;
  en_uso: number;
  danado: number;
  en_mantencion: number;
  dado_de_baja: number;
}

// ------------------------------------------------------------------
// Recurso (el dato principal del inventario)
// ------------------------------------------------------------------
// Los primeros campos son los mismos que tiene hoy la planilla Excel
// (descriptor, número de serie, marca, proveedor, observación),
// así será más fácil pasar los datos al sistema.
//
// El signo "?" significa que el campo es OPCIONAL: puede no venir.
// Por ejemplo, un reactivo o un insumo normalmente no tiene número de serie.
export interface Recurso {
  id: number;
  nombre: string; // en la planilla se llama "descriptor"
  categoria: CategoriaRecurso; // usa el tipo de arriba, no un texto cualquiera
  ubicacion: Ubicacion; // un objeto dentro de otro objeto
  cantidades: CantidadesPorEstado;
  numeroSerie?: string;
  marca?: string;
  proveedor?: string;
  observacion?: string;
  // Solo tiene sentido para insumos y reactivos: si la cantidad disponible
  // baja de este número, el sistema debería avisar para reponer (HU-09).
  stockMinimo?: number;
}

// Nota: no guardamos la "cantidad total" porque se puede calcular
// sumando las cantidades de cada estado. Si la guardáramos aparte,
// podría quedar desactualizada. Ese cálculo irá en src/utils/.
