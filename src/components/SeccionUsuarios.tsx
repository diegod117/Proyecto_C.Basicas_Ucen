// SeccionUsuarios.tsx
// Sección "Usuarios" de la página Configuración (solo el encargado, CA-15.1):
// lista los usuarios con su rol y estado, permite cambiar el rol, desactivar o
// activar, reenviar el acceso y agregar usuarios nuevos.
// Los usuarios se descargan aquí (y no al iniciar sesión) porque solo el
// encargado puede leer la lista completa.
// Usa los estilos de PaginaConfiguracion.css y SeccionUsuarios.css.
// Cubre: HU-15, RF-14 (CA-15.1 a CA-15.3), RNF-03

import { useState, useEffect } from 'react';
import type { RolUsuario } from '../types/Usuario';
import { useUsuario } from '../context/ContextoUsuario';
import {
  cargarUsuarios,
  obtenerUsuarios,
  modificarUsuario,
  reenviarAcceso,
} from '../services/usuariosService';
import FormularioNuevoUsuario from './FormularioNuevoUsuario';
import TablaUsuarios from './TablaUsuarios';
import './SeccionUsuarios.css';

// Componente SeccionUsuarios
// No recibe props: el usuario conectado lo lee con useUsuario().
// Devuelve la tarjeta con la tabla y el formulario.
function SeccionUsuarios() {
  const usuarioActual = useUsuario();
  const [estadoCarga, setEstadoCarga] = useState<'cargando' | 'listo' | 'error'>('cargando');
  // Mensaje del último cambio: esError dice si se muestra en rojo o en verde
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  // El valor no se usa: solo sirve para que React vuelva a dibujar la tabla
  // después de agregar o modificar un usuario (la lista vive en el servicio)
  const [, setCambios] = useState(0);

  // Al aparecer la sección se descarga la lista (el [] hace que sea una sola vez)
  useEffect(() => {
    async function descargar() {
      try {
        await cargarUsuarios();
        setEstadoCarga('listo');
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        setEstadoCarga('error');
      }
    }
    descargar();
  }, []);

  // mostrar: deja el mensaje en pantalla y redibuja la tabla
  function mostrar(texto: string, error: boolean) {
    setMensaje(texto);
    setEsError(error);
    setCambios((anterior) => anterior + 1);
  }

  // cambiarRol / cambiarActivo / reenviar
  // Reciben el correo del usuario (y el valor nuevo). Llaman al servicio y
  // muestran el resultado. El servicio revisa que quede un encargado activo.
  async function cambiarRol(correo: string, rol: RolUsuario) {
    setOcupado(true);
    const error = await modificarUsuario(correo, { rol: rol });
    setOcupado(false);
    mostrar(error === '' ? 'Rol cambiado. Se aplica en su próximo ingreso.' : error, error !== '');
  }

  async function cambiarActivo(correo: string, activo: boolean) {
    setOcupado(true);
    const error = await modificarUsuario(correo, { activo: activo });
    setOcupado(false);
    const exito = activo ? 'Usuario activado.' : 'Usuario desactivado: ya no puede iniciar sesión.';
    mostrar(error === '' ? exito : error, error !== '');
  }

  async function reenviar(correo: string) {
    setOcupado(true);
    const error = await reenviarAcceso(correo);
    setOcupado(false);
    mostrar(error === '' ? 'Se envió el enlace para crear la contraseña a ' + correo + '.' : error, error !== '');
  }

  return (
    <article className="configuracion-tarjeta">
      <h3 className="configuracion-titulo">Usuarios ({obtenerUsuarios().length})</h3>

      {estadoCarga === 'cargando' && <p className="texto-secundario">Cargando usuarios...</p>}
      {estadoCarga === 'error' && (
        <p className="configuracion-error">No se pudieron cargar los usuarios. Revisa tu conexión.</p>
      )}
      {estadoCarga === 'listo' && (
        <TablaUsuarios
          usuarios={obtenerUsuarios()}
          correoActual={usuarioActual.correo}
          ocupado={ocupado}
          onCambiarRol={cambiarRol}
          onCambiarActivo={cambiarActivo}
          onReenviar={reenviar}
        />
      )}

      <h4 className="usuarios-subtitulo">Agregar usuario</h4>
      <p className="texto-secundario usuarios-ayuda">
        Se crea su cuenta y se le envía un correo con el enlace para crear su contraseña.
      </p>
      <FormularioNuevoUsuario onAgregado={(texto) => mostrar(texto, false)} />

      {mensaje !== '' && esError && <p className="configuracion-error">{mensaje}</p>}
      {mensaje !== '' && !esError && <p className="configuracion-exito">{mensaje}</p>}
    </article>
  );
}

export default SeccionUsuarios;
