// Recurso.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el molde más importante de la app: el de un RECURSO del laboratorio.
// Un recurso es cualquier cosa que el laboratorio tiene: un multímetro,
// una caja de guantes, una mesa, un reactivo...
// En la guía: paso 2 (TypeScript) y paso 9 (cómo cambiar datos de la ficha).
// Cubre: RF-01 (estado operativo), RF-02 (cantidad operativa), RF-08 (categoría),
//        RF-10 y HU-11 (ubicación física), HU-09 (stock mínimo de insumos)

// ¿Por qué un archivo solo de moldes?
// Aquí no hay pantallas ni cálculos, solo DESCRIPCIONES de cómo son los datos.
// TypeScript usa estas descripciones para avisarnos de errores ANTES de
// abrir la app. Por ejemplo, si escribimos "dañdo" en vez de "danado",
// o si se nos olvida un dato. Es como un corrector ortográfico, pero para datos.
// Estos moldes desaparecen cuando la app se arma (npm run build):
// el navegador nunca los ve. Solo nos ayudan a nosotros mientras escribimos.

// ------------------------------------------------------------------
// ¿Qué clase de recurso es? (RF-08)
// ------------------------------------------------------------------
// La categoría del recurso (instrumento, insumo...).
// ANTES era una lista fija de 6 textos escrita aquí (un "tipo unión").
// AHORA las categorías viven en Firestore, y el encargado puede agregar
// nuevas desde la página "Configuración" (RNF-05, escalabilidad).
// Como TypeScript no puede saber de antemano qué categorías va a inventar
// el encargado, la categoría pasa a ser un texto cualquiera (string):
// la CLAVE de una categoría (ej: 'instrumento'). La lista de verdad está
// en services/configuracionService.ts. Ver guía, paso 13.
export type CategoriaRecurso = string;

// ------------------------------------------------------------------
// ¿Cómo está cada unidad? (RF-01)
// ------------------------------------------------------------------
// Los 5 estados en que puede estar una unidad.
// Ojo: "reservado" NO es un estado. Una reserva depende del día y la hora,
// así que se guarda aparte (ver Reserva.ts).
// Se escriben con guion bajo y sin tilde (en_uso, danado) porque así es más
// fácil escribirlos en el código sin equivocarse. En pantalla se muestran
// bonitos ("En uso", "Dañado") gracias a utils/inventario.ts.
export type EstadoRecurso =
  | 'disponible'
  | 'en_uso'
  | 'danado'
  | 'en_mantencion'
  | 'dado_de_baja';

// ------------------------------------------------------------------
// ¿En qué edificio está?
// ------------------------------------------------------------------
// La torre del edificio (una letra). Los laboratorios partieron en las
// torres B y C (sección 1.1 de los requerimientos), pero ahora el encargado
// puede agregar torres nuevas en "Configuración". Por eso ya no es 'B' | 'C'
// sino un texto cualquiera (string), igual que la categoría.
export type Torre = string;

// ------------------------------------------------------------------
// ¿Dónde está guardado exactamente? (RF-10, HU-11)
// ------------------------------------------------------------------
// "interface" = la lista de datos que un objeto TIENE QUE tener.
// Ninguno lleva "?", así que TODOS son obligatorios (HU-11 lo pide).
// Ejemplo: torre "B" + sala "307" = laboratorio B307.
// Se guardan separados para poder filtrar por torre o por sala.
export interface Ubicacion {
  torre: Torre; // una letra, ej: "B"
  sala: string; // ej: "307"
  bodega: string; // ej: "Bodega 1"
  mueble: string; // ej: "Mueble 2"
  codigo: string; // un código corto para encontrarlo rápido, ej: "B307-B1-M2"
}

// ------------------------------------------------------------------
// ¿Cuántas unidades hay en cada estado? (RF-01, RF-02)
// ------------------------------------------------------------------
// Un recurso puede tener muchas unidades (ej: 14 multímetros), y no todas
// están igual: 12 disponibles, 1 dañado y 1 en mantención.
// Por eso guardamos un número para CADA estado, como cajones de un mueble:
// el cajón "disponible" tiene 12, el cajón "danado" tiene 1, etc.
// Los nombres son iguales a los de EstadoRecurso a propósito, así podemos
// escribir cantidades['danado'] usando el estado como nombre del cajón.
export interface CantidadesPorEstado {
  disponible: number;
  en_uso: number;
  danado: number;
  en_mantencion: number;
  dado_de_baja: number;
}

// ------------------------------------------------------------------
// El RECURSO completo (el dato principal del inventario)
// ------------------------------------------------------------------
// Los datos son casi los mismos que tenía la planilla Excel del laboratorio
// (descriptor, número de serie, marca, proveedor, observación).
//
// El "?" después del nombre = OPCIONAL (puede no venir).
// Por ejemplo, un reactivo no tiene número de serie, así que no lo ponemos.
// Si un dato opcional no viene, la ficha muestra "No registrado".
export interface Recurso {
  id: number; // su número único (como un RUT)
  nombre: string; // ej: "Multímetro Fluke 87V" (en el Excel se llamaba "descriptor")
  categoria: CategoriaRecurso; // solo una de las categorías de arriba
  ubicacion: Ubicacion; // ¡un objeto dentro de otro objeto! (una caja dentro de otra)
  cantidades: CantidadesPorEstado; // los "cajones" con cuántas unidades hay en cada estado
  numeroSerie?: string;
  marca?: string;
  proveedor?: string;
  observacion?: string;
  // Solo para insumos y reactivos: si quedan esta cantidad o menos
  // disponibles, la app avisa que hay que comprar más (HU-09).
  stockMinimo?: number;
}

// ¿Y la cantidad TOTAL? No la guardamos: se calcula sumando todos los
// cajones (ver calcularCantidadTotal en utils/inventario.ts).
// Si la guardáramos aparte, alguien podría olvidar actualizarla y quedaría mal.

// ------------------------------------------------------------------
// Lo que se escribe en el formulario "Agregar recurso"
// ------------------------------------------------------------------
// Todo es texto (string) porque las cajitas <input> SIEMPRE entregan texto,
// aunque escribas un número. Al guardar, utils/nuevoRecurso.ts lo convierte
// en un Recurso de verdad.
// "CategoriaRecurso | ''" = una categoría O un texto vacío (''). El vacío es
// para cuando el encargado todavía no elige la categoría.
export interface DatosNuevoRecurso {
  nombre: string;
  categoria: CategoriaRecurso | '';
  cantidadTexto: string; // cuántas unidades llegan (entran como "disponible")
  stockMinimoTexto: string; // solo se usa en insumos y reactivos
  torre: Torre;
  sala: string;
  bodega: string;
  mueble: string;
  marca: string;
  numeroSerie: string;
  proveedor: string;
  observacion: string;
}
