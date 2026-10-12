// Alerta.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es un "molde" (como el molde de una galleta). No hace nada solo:
// solo dice CÓMO TIENE QUE SER una alerta. Una alerta es un aviso que la app
// crea sola cuando algo anda mal, por ejemplo "hay un multímetro dañado".
// En la guía: paso 2 (TypeScript: type e interface).
// Cubre: RF-04 (alertas de mantenimiento, reparación o reposición),
//        HU-09 (generación de alertas) y HU-05 (panel de alertas).

// ------------------------------------------------------------------
// ¿De qué tipo puede ser una alerta?
// ------------------------------------------------------------------
// "export" = "dejo que otros archivos usen esto". Sin export, este tipo
//   solo existiría aquí adentro y nadie más lo podría importar.
// "type" = le ponemos un nombre a un tipo de dato, como ponerle nombre a una caja.
// Las rayitas "|" se leen "o". Entonces TipoAlerta puede ser:
//   'mantencion' O 'reparacion' O 'reposicion'... ¡y NADA MÁS!
// Esto se llama "tipo unión". Si alguien escribe 'reparasion' (mal escrito),
// TypeScript lo subraya en rojo antes de que la app se rompa. Es como un
// profesor que revisa la ortografía antes de entregar la prueba.
//   - 'mantencion': el recurso tiene unidades en mantención.
//   - 'reparacion': el recurso tiene unidades dañadas.
//   - 'reposicion': a un insumo o reactivo le quedan pocas unidades.
export type TipoAlerta = 'mantencion' | 'reparacion' | 'reposicion';

// ------------------------------------------------------------------
// ¿Qué datos tiene una alerta?
// ------------------------------------------------------------------
// "interface" = la lista de cosas que un objeto TIENE QUE tener.
// Es como la ficha de un alumno: nombre, RUT, carrera... si falta algo,
// la ficha está incompleta y TypeScript reclama.
// Cada línea es "nombreDelDato: tipoDelDato".
//   string = texto (va entre comillas, ej: 'hola')
//   number = número (ej: 3)
export interface Alerta {
  // Un nombre único para esta alerta, como el RUT de una persona.
  // React lo necesita para la "key" cuando dibuja una lista (ver guía, paso 3).
  id: string;

  // El número (id) del recurso que tiene el problema.
  recursoId: number;

  // Qué tipo de alerta es. Solo puede ser uno de los 3 textos de TipoAlerta.
  tipo: TipoAlerta;

  // El texto que lee la persona, ej: "Termómetro digital: 2 unidades dañadas..."
  mensaje: string;

  // El día en que se creó la alerta, ej: "2026-10-02".
  fecha: string;
}
