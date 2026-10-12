// TarjetaAlerta.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// UNA tarjeta del Panel de Alertas (HU-05). Cada tipo de alerta tiene su
// propio color y dibujito:
//   - Mantención -> amarillo, 🔧
//   - Reparación -> rojo,     ⚠️
//   - Reposición -> azul,     📦
// Abajo muestra dónde está el recurso, para ir a buscarlo.
// *** Los colores están en TarjetaAlerta.css; los dibujitos, aquí abajo. ***
// En la guía: paso 3 (props) y paso 8 (alertas).
// Cubre: HU-05 (panel de alertas), RF-04

import type { Alerta, TipoAlerta } from '../types/Alerta';
import { textoTipoAlerta } from '../utils/alertas';
import { obtenerRecursoPorId } from '../services/recursosService';
import './TarjetaAlerta.css';

// Solo recibe la alerta que tiene que mostrar.
interface PropsTarjetaAlerta {
  alerta: Alerta;
}

// clasePorTipo
// Recibe: el tipo de alerta.
// Devuelve: la clase CSS que le da su color a la tarjeta.
function clasePorTipo(tipo: TipoAlerta): string {
  if (tipo === 'mantencion') {
    return 'tarjeta-alerta-mantencion';
  } else if (tipo === 'reparacion') {
    return 'tarjeta-alerta-reparacion';
  } else {
    return 'tarjeta-alerta-reposicion';
  }
}

// iconoPorTipo
// Recibe: el tipo de alerta.
// Devuelve: un dibujito (emoji) para reconocerla de un vistazo.
// *** Para cambiar un dibujito, cambia el emoji entre comillas. ***
function iconoPorTipo(tipo: TipoAlerta): string {
  if (tipo === 'mantencion') {
    return '🔧';
  } else if (tipo === 'reparacion') {
    return '⚠️';
  } else {
    return '📦';
  }
}

// Componente TarjetaAlerta
// Recibe: una alerta.
// Devuelve: la tarjeta de esa alerta.
function TarjetaAlerta(props: PropsTarjetaAlerta) {
  const alerta = props.alerta;
  // La alerta solo guarda el NÚMERO del recurso; buscamos el recurso
  // completo para mostrar su ubicación.
  const recurso = obtenerRecursoPorId(alerta.recursoId);

  return (
    // La clase se arma con un template string: "tarjeta-alerta" (la forma)
    // + la clase del color que devuelve clasePorTipo.
    <article className={`tarjeta-alerta ${clasePorTipo(alerta.tipo)}`}>
      <header className="tarjeta-alerta-header">
        {/* La pastilla de arriba: el dibujito + el tipo, ej: "⚠️ Reparación". */}
        <span className="tarjeta-alerta-badge">
          {iconoPorTipo(alerta.tipo)} {textoTipoAlerta(alerta.tipo)}
        </span>
        <span className="tarjeta-alerta-fecha">{alerta.fecha}</span>
      </header>

      {/* El mensaje, ej: "Termómetro digital: 2 unidades dañadas requieren reparación." */}
      <p className="tarjeta-alerta-mensaje">{alerta.mensaje}</p>

      {/* La ubicación, solo si encontramos el recurso (no es undefined).
          {' '} = un espacio en blanco; en JSX, un espacio al final de una
          línea se pierde, así que se escribe de esta forma. */}
      {recurso !== undefined && (
        <footer className="tarjeta-alerta-footer">
          <span className="tarjeta-alerta-ubicacion">
            Ubicación: <strong>{recurso.ubicacion.codigo}</strong> (Torre{' '}
            {recurso.ubicacion.torre}, Sala {recurso.ubicacion.sala})
          </span>
        </footer>
      )}
    </article>
  );
}

export default TarjetaAlerta;
