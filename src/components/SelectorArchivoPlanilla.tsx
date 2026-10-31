// SelectorArchivoPlanilla.tsx
// Botón para elegir el archivo .xlsx de la planilla de inventario.
// No lee el archivo: solo avisa a la página cuál eligió el usuario.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.1: acepta un .xlsx)

import type { ChangeEvent } from 'react';

interface PropsSelectorArchivoPlanilla {
  // Función de la página que recibe el archivo elegido
  onElegir: (archivo: File) => void;
  // true mientras se lee el archivo (para no elegir otro al mismo tiempo)
  deshabilitado: boolean;
}

// Componente SelectorArchivoPlanilla
// Recibe: la función que recibe el archivo y si está deshabilitado.
// Devuelve: el campo para elegir el archivo.
function SelectorArchivoPlanilla(props: PropsSelectorArchivoPlanilla) {
  // cambiarArchivo
  // Recibe el evento del <input type="file">. No devuelve nada.
  // evento.target.files es la lista de archivos elegidos; tomamos el primero.
  function cambiarArchivo(evento: ChangeEvent<HTMLInputElement>) {
    const archivos = evento.target.files;
    if (archivos !== null && archivos.length > 0) {
      props.onElegir(archivos[0]);
    }
    // Borramos la selección para poder elegir el mismo archivo otra vez
    evento.target.value = '';
  }

  return (
    <label className="carga-selector">
      Planilla de inventario (.xlsx)
      <input
        type="file"
        accept=".xlsx"
        disabled={props.deshabilitado}
        onChange={cambiarArchivo}
      />
    </label>
  );
}

export default SelectorArchivoPlanilla;
