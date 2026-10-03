// PaginaAlertas.tsx
// Página del panel de alertas del laboratorio.
// Muestra las alertas automáticas de recursos dañados, en mantención
// o con stock bajo el mínimo en tarjetas organizadas.
// Cubre: HU-05 (panel de alertas), RF-04

import { useState } from 'react';
import type { TipoAlerta } from '../types/Alerta';
import { generarAlertas } from '../utils/alertas';
import TarjetaAlerta from '../components/TarjetaAlerta';
import './PaginaAlertas.css';

// Componente PaginaAlertas
// No recibe props. Muestra la lista de alertas generadas en tarjetas.
function PaginaAlertas() {
  // Filtro por tipo: 'todas', 'mantencion', 'reparacion' o 'reposicion'
  const [filtroTipo, setFiltroTipo] = useState<'todas' | TipoAlerta>('todas');

  // Generamos las alertas llamando a la función de HU-09
  const todasLasAlertas = generarAlertas();

  // Filtramos según la opción elegida por el usuario
  const alertasFiltradas = todasLasAlertas.filter((alerta) => {
    if (filtroTipo === 'todas') {
      return true;
    }
    return alerta.tipo === filtroTipo;
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
        <div className="pagina-alertas-contador">
          <span className="contador-total-badge">
            {todasLasAlertas.length} alertas pendientes
          </span>
        </div>
      </header>

      {/* Botones de filtro por tipo de alerta */}
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

      {/* Lista de tarjetas de alerta */}
      {alertasFiltradas.length === 0 ? (
        <div className="panel-alertas-vacio">
          <p>No hay alertas que coincidan con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="grid-alertas">
          {alertasFiltradas.map((alerta) => (
            <TarjetaAlerta key={alerta.id} alerta={alerta} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PaginaAlertas;
