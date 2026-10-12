// FichaRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La FICHA de un recurso: la página con TODOS sus datos. Se abre al hacer
// clic en una tarjeta del inventario. Tiene dos columnas:
//   - Izquierda: la categoría, el nombre, la ubicación, los datos de la
//     planilla (serie, marca, proveedor, observación), las unidades por
//     estado y, abajo, el historial.
//   - Derecha: los recuadros "Cambiar estado" y "Reponer stock" (solo el
//     encargado). Los demás roles ven un aviso en su lugar.
//
// *** ¿CÓMO CAMBIO COSAS DE LA FICHA? (ver guía, paso 9) ***
//   - Un TÍTULO o ETIQUETA (ej: "N° de serie", "Datos del recurso"):
//     cambia el texto entre las etiquetas <dt>...</dt> o <h3>...</h3> de abajo.
//   - Un DATO NUEVO (ej: "Fecha de compra"): hay que agregarlo en 4 lugares:
//     el molde (types/Recurso.ts), el formulario (CamposDetalleRecurso.tsx),
//     armarRecurso (utils/nuevoRecurso.ts) y aquí un <dt> + <dd> nuevos.
//   - Los COLORES y el ORDEN de las columnas: en FichaRecurso.css.
//
// En la guía: paso 3 (componentes), paso 9 (recetas).
// Cubre: HU-02 (ficha y cambio de estado), HU-06 (historial),
//        HU-11 (aviso si la ubicación tiene problemas), RF-01, RF-10, RNF-03,
//        RF-04 (reponer stock)

import type { Recurso } from '../types/Recurso';
import type { Usuario } from '../types/Usuario';
import { puedeCambiarEstado, puedeReponerStock } from '../utils/permisos';
import { textoCategoria, textoCampoOpcional } from '../utils/inventario';
import { obtenerHistorialDeRecurso } from '../services/historialService';
import FormularioCambioEstado from './FormularioCambioEstado';
import FormularioReponerStock from './FormularioReponerStock';
import TablaUnidadesEstado from './TablaUnidadesEstado';
import TablaHistorial from './TablaHistorial';
import AvisoUbicacion from './AvisoUbicacion';
import './FichaRecurso.css';

// Las props que le pasa PaginaInventario.
interface PropsFichaRecurso {
  // El recurso que hay que mostrar.
  recurso: Recurso;
  // La función para volver al listado (la página decide qué hacer).
  onVolver: () => void;
  // La función para avisar que se guardó un cambio. La ficha NO la usa ella
  // misma: solo se la pasa a sus formularios. El aviso viaja como una carta
  // que pasa de mano en mano:
  // formulario -> ficha -> página -> App (que redibuja todo).
  onEstadoCambiado: () => void;
  // La persona conectada: decide si se muestran los formularios (RNF-03).
  usuario: Usuario;
}

// Componente FichaRecurso
// Recibe: el recurso, la función para volver, la de avisar cambios y la persona.
// Devuelve: la ficha completa.
function FichaRecurso(props: PropsFichaRecurso) {
  // Nombres cortos para no escribir "props.recurso.ubicacion." todo el rato.
  const recurso = props.recurso;
  const ubicacion = recurso.ubicacion;

  // Le pedimos el diario de ESTE recurso al servicio, cada vez que se dibuja.
  // Cuando se guarda un cambio, App redibuja todo, esta línea se vuelve a
  // ejecutar, y la línea nueva aparece arriba en la tabla.
  const historial = obtenerHistorialDeRecurso(recurso.id);

  return (
    <div className="ficha-recurso">
      {/* La "ruta" de arriba: "← Inventario / Nombre del recurso".
          El botón "← Inventario" llama a onVolver (vuelve al listado). */}
      <div className="ficha-ruta">
        <button className="ficha-boton-volver" onClick={props.onVolver}>
          ← Inventario
        </button>
        <span className="ficha-ruta-separador">/</span>
        <span className="ficha-ruta-actual">{recurso.nombre}</span>
      </div>

      {/* Las dos columnas (el CSS las pone lado a lado; en celular, una abajo de la otra). */}
      <div className="ficha-columnas">
        {/* ===== COLUMNA IZQUIERDA: los datos y, abajo, el historial ===== */}
        <div className="ficha-columna-izquierda">
          <div className="ficha-tarjeta">
            <div className="ficha-encabezado">
              <span className="ficha-categoria">{textoCategoria(recurso.categoria)}</span>
              <h2 className="ficha-nombre">{recurso.nombre}</h2>
            </div>

            {/* --- UBICACIÓN (RF-10, HU-11) --- */}
            <h3 className="ficha-subtitulo">Ubicación</h3>
            {/* <dl> es una "lista de definiciones" de HTML: pares de
                  <dt> = el nombre del dato (ej: "Torre")
                  <dd> = su valor (ej: "B")
                Es la etiqueta pensada justo para mostrar "Dato: valor".
                El CSS (.ficha-datos) los acomoda en dos columnas. */}
            <dl className="ficha-datos">
              <dt>Torre</dt>
              <dd>{ubicacion.torre}</dd>
              <dt>Sala</dt>
              <dd>{ubicacion.sala}</dd>
              <dt>Bodega</dt>
              <dd>{ubicacion.bodega}</dd>
              <dt>Mueble</dt>
              <dd>{ubicacion.mueble}</dd>
              <dt>Código</dt>
              <dd className="ficha-codigo">{ubicacion.codigo}</dd>
            </dl>
            {/* Un recuadro amarillo que SOLO aparece si la ubicación tiene
                algún problema (HU-11). Si está bien, no dibuja nada. */}
            <AvisoUbicacion ubicacion={ubicacion} />

            {/* --- DATOS DE LA PLANILLA --- Son opcionales (pueden no venir).
                textoCampoOpcional muestra "No registrado" si no vienen.
                *** Aquí se agrega un dato nuevo: copia un par <dt> + <dd>. *** */}
            <h3 className="ficha-subtitulo">Datos del recurso</h3>
            <dl className="ficha-datos">
              <dt>N° de serie</dt>
              <dd>{textoCampoOpcional(recurso.numeroSerie)}</dd>
              <dt>Marca</dt>
              <dd>{textoCampoOpcional(recurso.marca)}</dd>
              <dt>Proveedor</dt>
              <dd>{textoCampoOpcional(recurso.proveedor)}</dd>
              <dt>Observación</dt>
              <dd>{textoCampoOpcional(recurso.observacion)}</dd>
              {/* El stock mínimo solo se muestra si el recurso lo tiene
                  (insumos y reactivos, HU-09). "!== undefined" = "sí existe".
                  <> ... </> (Fragment) es una caja invisible: agrupa el <dt> y
                  el <dd> porque después de && solo puede ir UNA cosa. */}
              {recurso.stockMinimo !== undefined && (
                <>
                  <dt>Stock mínimo</dt>
                  <dd>{recurso.stockMinimo}</dd>
                </>
              )}
            </dl>

            {/* --- UNIDADES POR ESTADO (RF-01) --- en su propio componente. */}
            <TablaUnidadesEstado recurso={recurso} />
          </div>

          {/* --- HISTORIAL (HU-06) --- el "diario" del recurso. */}
          <TablaHistorial historial={historial} />
        </div>

        {/* ===== COLUMNA DERECHA (RNF-03) =====
            Solo el encargado puede modificar el inventario. Le preguntamos
            al reglamento (permisos.ts): "¿este rol puede cambiar estados?".
            Si sí: dibujamos los dos formularios. */}
        {puedeCambiarEstado(props.usuario.rol) && (
          <div className="ficha-columna-derecha">
            <FormularioCambioEstado
              recurso={recurso}
              onEstadoCambiado={props.onEstadoCambiado}
              usuario={props.usuario}
            />
            {/* Reponer stock: suma unidades nuevas (apaga las alertas de
                reposición). Usa el MISMO aviso hacia App que el cambio de
                estado, porque también cambia los números. */}
            {puedeReponerStock(props.usuario.rol) && (
              <FormularioReponerStock
                recurso={recurso}
                onStockRepuesto={props.onEstadoCambiado}
                usuario={props.usuario}
              />
            )}
          </div>
        )}
        {/* Si NO puede (el ! da vuelta la respuesta): mostramos un aviso. */}
        {!puedeCambiarEstado(props.usuario.rol) && (
          <p className="ficha-aviso-permiso">
            Solo el encargado de laboratorio puede cambiar el estado o reponer el stock
            de un recurso.
          </p>
        )}
      </div>
    </div>
  );
}

export default FichaRecurso;
