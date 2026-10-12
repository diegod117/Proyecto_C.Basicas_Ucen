// PaginaAlertas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El PANEL DE ALERTAS: las "notificaciones" de la app. Muestra una tarjeta
// por cada problema que encontró el detector (utils/alertas.ts):
// unidades dañadas, en mantención, o insumos con pocas unidades.
// Arriba hay botones para ver solo un tipo (Reparación, Mantención o Reposición).
// El docente no puede entrar a esta página (lo decide permisos.ts).
// En la guía: paso 4 (useState para un filtro) y paso 8 (alertas).
// Cubre: HU-05 (panel de alertas), RF-04

import { useState } from 'react';
import type { TipoAlerta } from '../types/Alerta';
import { generarAlertas } from '../utils/alertas';
import TarjetaAlerta from '../components/TarjetaAlerta';
import './PaginaAlertas.css';

// Componente PaginaAlertas
// No recibe props. Devuelve el panel con las tarjetas de alertas.
function PaginaAlertas() {
  // Qué botón de filtro está elegido.
  // "'todas' | TipoAlerta" = puede ser 'todas' O uno de los tipos de alerta.
  const [filtroTipo, setFiltroTipo] = useState<'todas' | TipoAlerta>('todas');

  // Le pedimos al detector TODAS las alertas de este momento.
  const todasLasAlertas = generarAlertas();

  // Nos quedamos solo con las del tipo elegido.
  // .filter(...) = un colador: recorre la lista y se queda SOLO con los
  // elementos para los que la función devuelve true.
  const alertasFiltradas = todasLasAlertas.filter((alerta) => {
    if (filtroTipo === 'todas') {
      return true; // con "todas", pasan todas
    }
    return alerta.tipo === filtroTipo; // si no, solo las de ese tipo
  });

  return (
    <section className="contenido-pagina">
      <header className="pagina-alertas-header">
        <div className="pagina-alertas-titulos">
          <h2>Panel de Alertas</h2>
          <p className="texto-secundario">
            Supervisión automática de recursos que requieren mantención, reparación o reposición.
          </p>
        </div>
        {/* La pastilla roja con el total, ej: "6 alertas pendientes". */}
        <div className="pagina-alertas-contador">
          <span className="contador-total-badge">
            {todasLasAlertas.length} alertas pendientes
          </span>
        </div>
      </header>

      {/* Los 4 botones de filtro. Cada uno muestra cuántas alertas hay de su tipo.
          className usa un template string con un ternario adentro:
            `boton-filtro-alerta ${ condicion ? 'activo' : '' }`
          -> si es el botón elegido, le agrega la clase "activo" (se pinta azul).
          todasLasAlertas.filter((a) => a.tipo === 'reparacion').length
          -> cuántas alertas son de reparación (colar y contar). */}
      <div className="filtros-alertas">
        <button
          type="button"
          className={`boton-filtro-alerta ${filtroTipo === 'todas' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('todas')}
        >
          Todas ({todasLasAlertas.length})
        </button>
        <button
          type="button"
          className={`boton-filtro-alerta ${filtroTipo === 'reparacion' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('reparacion')}
        >
          Reparación ({todasLasAlertas.filter((a) => a.tipo === 'reparacion').length})
        </button>
        <button
          type="button"
          className={`boton-filtro-alerta ${filtroTipo === 'mantencion' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('mantencion')}
        >
          Mantención ({todasLasAlertas.filter((a) => a.tipo === 'mantencion').length})
        </button>
        <button
          type="button"
          className={`boton-filtro-alerta ${filtroTipo === 'reposicion' ? 'activo' : ''}`}
          onClick={() => setFiltroTipo('reposicion')}
        >
          Reposición ({todasLasAlertas.filter((a) => a.tipo === 'reposicion').length})
        </button>
      </div>

      {/* Ternario: si no quedó ninguna -> un mensaje; si hay -> las tarjetas. */}
      {alertasFiltradas.length === 0 ? (
        <div className="panel-alertas-vacio">
          <p>No hay alertas que coincidan con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="grid-alertas">
          {/* Una tarjeta por alerta. key = el id de la alerta (ej: "alerta-6-reparacion"). */}
          {alertasFiltradas.map((alerta) => (
            <TarjetaAlerta key={alerta.id} alerta={alerta} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PaginaAlertas;
