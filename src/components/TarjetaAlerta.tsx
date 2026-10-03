// TarjetaAlerta.tsx
// Tarjeta visual que muestra una alerta individual del sistema (HU-05).
// Aplica un color y estilo distintivo según el tipo de alerta:
//   - Mantención (amarillo)
//   - Reparación (rojo)
//   - Reposición (azul)
// Cubre: HU-05 (panel de alertas), RF-04

import type { Alerta, TipoAlerta } from '../types/Alerta';
import { textoTipoAlerta } from '../utils/alertas';
import { obtenerRecursoPorId } from '../services/recursosService';
import './TarjetaAlerta.css';

interface PropsTarjetaAlerta {
  alerta: Alerta;
}

// clasePorTipo
// Devuelve la clase CSS correspondiente al tipo de alerta para darle color.
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
// Devuelve un símbolo/icono para identificar visualmente el tipo de alerta.
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
// Recibe una alerta como prop y la muestra en formato de tarjeta.
function TarjetaAlerta(props: PropsTarjetaAlerta) {
  const alerta = props.alerta;
  const recurso = obtenerRecursoPorId(alerta.recursoId);

  return (
    <article className={`tarjeta-alerta ${clasePorTipo(alerta.tipo)}`}>
      <header className="tarjeta-alerta-header">
        <span className="tarjeta-alerta-badge">
          {iconoPorTipo(alerta.tipo)} {textoTipoAlerta(alerta.tipo)}
        </span>
        <span className="tarjeta-alerta-fecha">{alerta.fecha}</span>
      </header>

      <p className="tarjeta-alerta-mensaje">{alerta.mensaje}</p>

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
