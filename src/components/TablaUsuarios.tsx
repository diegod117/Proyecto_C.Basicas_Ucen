// TablaUsuarios.tsx
// Tabla de la sección Usuarios de Configuración: nombre, correo, rol (se puede
// cambiar), estado (Activo o Desactivado, siempre con texto) y las acciones
// Desactivar / Activar y Reenviar acceso. No guarda nada: avisa a la sección.
// Usa los estilos de SeccionUsuarios.css.
// Cubre: HU-15, RF-14 (CA-15.3: el encargado cambia el rol o desactiva un usuario)

import type { RolUsuario, Usuario } from '../types/Usuario';
import { listaRoles, textoRol } from '../utils/usuarios';

interface PropsTablaUsuarios {
  usuarios: Usuario[];
  // Correo de quien está conectado: su fila no se puede desactivar ni cambiar de rol
  correoActual: string;
  // true mientras se guarda un cambio (desactiva los controles)
  ocupado: boolean;
  onCambiarRol: (correo: string, rol: RolUsuario) => void;
  onCambiarActivo: (correo: string, activo: boolean) => void;
  onReenviar: (correo: string) => void;
}

// Componente TablaUsuarios
// Recibe: los usuarios, el correo de quien está conectado y las funciones de cambio.
// Devuelve: la tabla (dentro de un recuadro que se desliza hacia el lado en el celular).
function TablaUsuarios(props: PropsTablaUsuarios) {
  // elegirRol: busca en la lista de roles el que coincide con lo elegido en el <select>
  function elegirRol(correo: string, valor: string) {
    for (const rol of listaRoles) {
      if (rol === valor) {
        props.onCambiarRol(correo, rol);
      }
    }
  }

  return (
    <div className="usuarios-tabla-scroll">
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* El correo no se repite, sirve como key */}
          {props.usuarios.map((usuario) => {
            const esPropio = usuario.correo === props.correoActual;
            return (
              <tr key={usuario.correo}>
                <td>
                  {usuario.nombre}
                  {esPropio && <span className="texto-secundario"> (tú)</span>}
                </td>
                <td className="usuarios-correo">{usuario.correo}</td>
                <td>
                  <select
                    value={usuario.rol}
                    disabled={props.ocupado || esPropio}
                    onChange={(evento) => elegirRol(usuario.correo, evento.target.value)}
                  >
                    {listaRoles.map((rol) => (
                      <option key={rol} value={rol}>
                        {textoRol(rol)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {usuario.activo && <span className="usuarios-estado-activo">Activo</span>}
                  {!usuario.activo && <span className="usuarios-estado-desactivado">Desactivado</span>}
                </td>
                <td className="usuarios-acciones">
                  <button
                    type="button"
                    className="boton-secundario usuarios-boton"
                    disabled={props.ocupado || esPropio}
                    onClick={() => props.onCambiarActivo(usuario.correo, !usuario.activo)}
                  >
                    {usuario.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    className="boton-secundario usuarios-boton"
                    disabled={props.ocupado || !usuario.activo}
                    onClick={() => props.onReenviar(usuario.correo)}
                  >
                    Reenviar acceso
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
