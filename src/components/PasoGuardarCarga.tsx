// PasoGuardarCarga.tsx
// Paso 2 de 2 de la carga: antes de guardar, dice cuántos recursos se van a
// crear (y con qué ids); al apretar el botón los guarda en Firestore. El
// botón se desactiva mientras guarda, para evitar el doble clic.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.3: solo se guardan las filas válidas;
//        CA-16.4: los recursos quedan "disponibles")

import { useState } from 'react';
import type { Recurso } from '../types/Recurso';
import type { FilaRevisada, ResultadoGuardado } from '../types/Importacion';
import { useUsuario } from '../context/ContextoUsuario';
import { obtenerSiguienteIdRecurso } from '../services/recursosService';
import { guardarRecursosImportados } from '../services/importacionService';

interface PropsPasoGuardarCarga {
  // Filas válidas (cada una trae su recurso)
  validas: FilaRevisada[];
  // true si todavía faltan categorías o salas por crear (paso 1)
  faltaCrear: boolean;
  // Función de la página que recibe el resultado cuando termina de guardar
  onTerminado: (resultado: ResultadoGuardado) => void;
}

// Componente PasoGuardarCarga
// Recibe: las filas válidas, si falta crear algo y la función de término.
// Devuelve: el recuadro del paso 2.
function PasoGuardarCarga(props: PropsPasoGuardarCarga) {
  // El nombre del usuario conectado queda en el historial de cada alta
  const usuario = useUsuario();
  const [guardando, setGuardando] = useState(false);

  if (props.faltaCrear) {
    return (
      <div className="carga-paso">
        <h3 className="carga-subtitulo">Paso 2 de 2: guardar los recursos</h3>
        <p className="texto-secundario">Primero completa el paso 1.</p>
      </div>
    );
  }
  if (props.validas.length === 0) {
    return (
      <div className="carga-paso">
        <h3 className="carga-subtitulo">Paso 2 de 2: guardar los recursos</h3>
        <p className="texto-secundario">No hay filas válidas para guardar.</p>
      </div>
    );
  }

  const cantidad = props.validas.length;
  const primerId = obtenerSiguienteIdRecurso();

  // guardar
  // No recibe nada. Guarda las filas válidas por tandas y avisa a la página.
  async function guardar() {
    setGuardando(true);
    const recursos: Recurso[] = [];
    for (const fila of props.validas) {
      if (fila.recurso !== null) {
        recursos.push(fila.recurso);
      }
    }
    const resultado = await guardarRecursosImportados(recursos, usuario.nombre);
    setGuardando(false);
    props.onTerminado(resultado);
  }

  return (
    <div className="carga-paso">
      <h3 className="carga-subtitulo">Paso 2 de 2: guardar los recursos</h3>
      <p>
        Se guardarán <strong>{cantidad} recursos nuevos</strong> (ids del {primerId} al{' '}
        {primerId + cantidad - 1}). Cada uno queda &quot;disponible&quot; y con su alta en el
        historial. Esto no se puede deshacer desde la app.
      </p>
      <button type="button" className="boton-principal" onClick={guardar} disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Guardar ' + cantidad + ' recursos'}
      </button>
    </div>
  );
}

export default PasoGuardarCarga;
