// CampoFechaAdquisicion.tsx
// Campo "Fecha de adquisición" del formulario "Agregar recurso".
// Es obligatorio y no deja elegir días posteriores a hoy.
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: HU-13, RF-12 (CA-13.1)

import { obtenerFechaHoy } from '../utils/fechas';

interface PropsCampoFechaAdquisicion {
  // Fecha elegida, como texto "AAAA-MM-DD" ('' si todavía no elige)
  fecha: string;
  // Función del formulario para guardar la fecha nueva
  onCambiar: (fecha: string) => void;
}

// Componente CampoFechaAdquisicion
// Recibe: la fecha actual y la función para cambiarla.
// Devuelve: el campo de fecha con su etiqueta.
function CampoFechaAdquisicion(props: PropsCampoFechaAdquisicion) {
  return (
    <label className="nuevo-recurso-campo">
      Fecha de adquisición
      {/* type="date" entrega el texto "AAAA-MM-DD". El "max" solo ayuda al
          navegador a no mostrar días futuros; la validación de verdad está
          en validarNuevoRecurso, porque la fecha también se puede escribir a mano. */}
      <input
        type="date"
        max={obtenerFechaHoy()}
        value={props.fecha}
        onChange={(evento) => props.onCambiar(evento.target.value)}
      />
    </label>
  );
}

export default CampoFechaAdquisicion;
