// PaginaCargaExcel.tsx
// Página "Cargar planilla" (ruta /cargar-planilla, solo el encargado).
// El encargado elige la planilla Excel del inventario, ve una vista previa
// que separa las filas válidas de las que tienen error y, en dos pasos con
// su botón cada uno, crea las categorías y salas que falten y guarda los
// recursos. Aquí solo se junta todo; la lectura y revisión están en utils/
// y el guardado en services/.
// Cubre: HU-16, RF-15 (CA-16.1 a CA-16.4)

import { useState } from 'react';
import type { FilaPlanilla, ResultadoRevision } from '../types/Importacion';
import { leerArchivoPlanilla } from '../services/planillaService';
import { obtenerCategorias, obtenerTorres, obtenerSalas } from '../services/configuracionService';
import { obtenerRecursos } from '../services/recursosService';
import { leerFilasPlanilla } from '../utils/planillaExcel';
import { revisarFilas } from '../utils/revisionPlanilla';
import SelectorArchivoPlanilla from '../components/SelectorArchivoPlanilla';
import ResumenCarga from '../components/ResumenCarga';
import TablaFilasValidas from '../components/TablaFilasValidas';
import TablaFilasConError from '../components/TablaFilasConError';
import './PaginaCargaExcel.css';

// Componente PaginaCargaExcel
// No recibe props. Devuelve la página con el selector, la vista previa y los pasos.
function PaginaCargaExcel() {
  const [nombreArchivo, setNombreArchivo] = useState('');
  // Filas leídas del archivo; null mientras no se haya elegido uno válido
  const [filas, setFilas] = useState<FilaPlanilla[] | null>(null);
  const [errorLectura, setErrorLectura] = useState('');
  const [leyendo, setLeyendo] = useState(false);

  // elegirArchivo
  // Recibe el archivo elegido. No devuelve nada. Es "async" porque leer el
  // archivo toma un momento. Si algo falla, deja el mensaje de error.
  async function elegirArchivo(archivo: File) {
    setNombreArchivo(archivo.name);
    setFilas(null);
    setErrorLectura('');
    setLeyendo(true);

    const archivoLeido = await leerArchivoPlanilla(archivo);
    if (archivoLeido.error !== '') {
      setErrorLectura(archivoLeido.error);
      setLeyendo(false);
      return;
    }
    const lectura = leerFilasPlanilla(archivoLeido.hoja);
    setLeyendo(false);
    if (lectura.error !== '') {
      setErrorLectura(lectura.error);
    } else {
      setFilas(lectura.filas);
    }
  }

  // La revisión se calcula en cada dibujo con los datos actuales de la app:
  // así, cuando se creen las categorías y salas que faltan, se actualiza sola.
  let revision: ResultadoRevision | null = null;
  if (filas !== null) {
    revision = revisarFilas(filas, obtenerCategorias(), obtenerTorres(), obtenerSalas(), obtenerRecursos());
  }

  return (
    <section className="contenido-pagina">
      <header className="encabezado-pagina">
        <h2 className="encabezado-pagina-titulo">Cargar planilla</h2>
        <p className="encabezado-pagina-descripcion">
          Carga el inventario desde la planilla Excel. Primero se revisa cada fila; no se guarda
          nada hasta que confirmes.
        </p>
      </header>

      <div className="carga-tarjeta">
        <SelectorArchivoPlanilla onElegir={elegirArchivo} deshabilitado={leyendo} />
        {leyendo && <p className="texto-secundario">Leyendo el archivo...</p>}
        {errorLectura !== '' && <p className="carga-error">{errorLectura}</p>}
      </div>

      {revision !== null && (
        <div className="carga-tarjeta">
          <ResumenCarga
            nombreArchivo={nombreArchivo}
            totalFilas={revision.validas.length + revision.conError.length}
            cantidadValidas={revision.validas.length}
            cantidadConError={revision.conError.length}
          />
          <h3 className="carga-subtitulo">Filas con error ({revision.conError.length})</h3>
          <TablaFilasConError filas={revision.conError} />
          <h3 className="carga-subtitulo">Filas válidas ({revision.validas.length})</h3>
          <TablaFilasValidas filas={revision.validas} />
        </div>
      )}
    </section>
  );
}

export default PaginaCargaExcel;
