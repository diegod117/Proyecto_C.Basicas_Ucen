// FichaRecurso.tsx
// Ficha con TODOS los datos de un recurso: categoría, ubicación física
// completa, datos de la planilla (serie, marca, proveedor, observación)
// y cuántas unidades hay en cada estado.
// Se abre al hacer clic en una tarjeta del inventario.
// A la derecha muestra el formulario para cambiar el estado, y debajo
// de los datos, el historial de cambios de estado.
// El formulario solo lo ve el encargado; los demás roles ven un aviso.
// Cubre: HU-02 (ficha y cambio de estado), HU-06 (historial),
//        HU-11 (aviso si la ubicación tiene problemas), RF-01, RF-10, RNF-03

import type { Recurso } from '../types/Recurso';
import type { Usuario } from '../types/Usuario';
import { puedeCambiarEstado } from '../utils/permisos';
import {
  textoCategoria,
  textoEstado,
  textoCampoOpcional,
  calcularCantidadTotal,
  listaEstadosRecurso,
} from '../utils/inventario';
import { obtenerHistorialDeRecurso } from '../services/historialService';
import FormularioCambioEstado from './FormularioCambioEstado';
import TablaHistorial from './TablaHistorial';
import AvisoUbicacion from './AvisoUbicacion';
import './FichaRecurso.css';

interface PropsFichaRecurso {
  // El recurso que se muestra
  recurso: Recurso;
  // Función para volver al listado (la página decide qué hacer)
  onVolver: () => void;
  // Función para avisar que se guardó un cambio de estado. La ficha no la
  // usa: solo se la pasa al formulario. El aviso viaja así:
  // formulario -> ficha -> página -> App (que redibuja todo).
  onEstadoCambiado: () => void;
  // Usuario conectado: decide si se muestra el formulario (RNF-03)
  usuario: Usuario;
}

// Componente FichaRecurso
// Recibe: el recurso, la función para volver, la de aviso de cambio de estado
// y el usuario conectado.
// Devuelve: la ficha completa del recurso.
function FichaRecurso(props: PropsFichaRecurso) {
  const recurso = props.recurso;
  const ubicacion = recurso.ubicacion;

  // Pedimos el historial al servicio cada vez que se dibuja la ficha.
  // Cuando se guarda un cambio de estado, App redibuja todo, esta línea
  // se vuelve a ejecutar y el cambio nuevo aparece arriba en la tabla.
  const historial = obtenerHistorialDeRecurso(recurso.id);

  return (
    <div className="ficha-recurso">
      {/* Ruta de navegación, como en el mockup: "← Inventario / Nombre" */}
      <div className="ficha-ruta">
        <button className="ficha-boton-volver" onClick={props.onVolver}>
          ← Inventario
        </button>
        <span className="ficha-ruta-separador">/</span>
        <span className="ficha-ruta-actual">{recurso.nombre}</span>
      </div>

      {/* Dos columnas: datos a la izquierda y formulario a la derecha */}
      <div className="ficha-columnas">
        {/* Columna izquierda: datos del recurso y, debajo, su historial */}
        <div className="ficha-columna-izquierda">
          <div className="ficha-tarjeta">
            <div className="ficha-encabezado">
              <span className="ficha-categoria">{textoCategoria(recurso.categoria)}</span>
              <h2 className="ficha-nombre">{recurso.nombre}</h2>
            </div>

            {/* Ubicación física completa (RF-10, HU-11) */}
            <h3 className="ficha-subtitulo">Ubicación</h3>
            {/* <dl> es una "lista de definiciones": pares de nombre (dt) y valor (dd).
                Es la etiqueta HTML pensada justo para mostrar "Dato: valor". */}
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
            {/* Solo aparece si la ubicación tiene algún problema (HU-11) */}
            <AvisoUbicacion ubicacion={ubicacion} />

            {/* Datos que hoy vienen de la planilla Excel. Son opcionales, por eso
                usamos textoCampoOpcional: si no vienen, muestra "No registrado". */}
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
                  (normalmente insumos y reactivos, ver HU-09).
                  "<> ... </>" se llama Fragment: agrupa dos elementos (dt y dd)
                  sin agregar una etiqueta extra al HTML, porque React exige
                  devolver un solo elemento en cada expresión. */}
              {recurso.stockMinimo !== undefined && (
                <>
                  <dt>Stock mínimo</dt>
                  <dd>{recurso.stockMinimo}</dd>
                </>
              )}
            </dl>

            {/* Cantidad de unidades en cada estado (RF-01).
                Aquí mostramos los 5 estados, incluso los que tienen 0,
                para que el encargado vea el panorama completo. */}
            <h3 className="ficha-subtitulo">Unidades por estado</h3>
            <table className="ficha-tabla-estados">
              <tbody>
                {listaEstadosRecurso.map((estado) => (
                  <tr key={estado}>
                    <td>
                      <span className={'etiqueta etiqueta-' + estado}>{textoEstado(estado)}</span>
                    </td>
                    <td className="ficha-tabla-numero">{recurso.cantidades[estado]}</td>
                  </tr>
                ))}
                <tr className="ficha-tabla-total">
                  <td>Total</td>
                  <td className="ficha-tabla-numero">{calcularCantidadTotal(recurso)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Historial de cambios de estado (HU-06), como en el mockup */}
          <TablaHistorial historial={historial} />
        </div>

        {/* Columna derecha (RNF-03): solo el encargado edita el inventario.
            Los demás roles ven los datos y el historial, pero en lugar
            del formulario aparece un aviso. */}
        {puedeCambiarEstado(props.usuario.rol) && (
          <FormularioCambioEstado recurso={recurso} onEstadoCambiado={props.onEstadoCambiado} />
        )}
        {!puedeCambiarEstado(props.usuario.rol) && (
          <p className="ficha-aviso-permiso">
            Solo el encargado de laboratorio puede cambiar el estado de un recurso.
          </p>
        )}
      </div>
    </div>
  );
}

export default FichaRecurso;
