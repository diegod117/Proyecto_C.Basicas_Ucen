// FormularioNuevoUsuario.tsx
// Formulario "Agregar usuario" de la sección Usuarios de Configuración: nombre,
// correo y rol. Al guardar se crea la cuenta de acceso, se registra al usuario
// y se le envía el enlace para crear su contraseña.
// Usa los estilos de PaginaConfiguracion.css y SeccionUsuarios.css.
// Cubre: HU-15, RF-14 (CA-15.2: nombre, correo y rol; no se repiten correos)

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RolUsuario } from '../types/Usuario';
import { agregarUsuario } from '../services/usuariosService';
import { listaRoles, textoRol } from '../utils/usuarios';

interface PropsFormularioNuevoUsuario {
  // Función de la sección para avisar que se agregó (con el mensaje a mostrar)
  onAgregado: (mensaje: string) => void;
}

// Componente FormularioNuevoUsuario
// Recibe: la función que avisa que se agregó un usuario.
// Devuelve: el formulario con sus campos y el botón.
function FormularioNuevoUsuario(props: PropsFormularioNuevoUsuario) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<RolUsuario>('docente');
  const [mensajeError, setMensajeError] = useState('');
  // true mientras se crea la cuenta y se guarda: desactiva el botón (evita el doble clic)
  const [guardando, setGuardando] = useState(false);

  // guardar
  // Recibe el evento del formulario. No devuelve nada. Es "async" porque
  // crear la cuenta y guardar el usuario van por internet.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeError('');
    setGuardando(true);
    const resultado = await agregarUsuario({ nombre: nombre, correo: correo, rol: rol });
    setGuardando(false);

    if (resultado.ok) {
      setNombre('');
      setCorreo('');
      setRol('docente');
      props.onAgregado(resultado.mensaje);
    } else {
      setMensajeError(resultado.mensaje);
    }
  }

  // cambiarRol: busca en la lista de roles el que coincide con lo elegido
  // (así no hace falta convertir el texto del <select> a la fuerza)
  function cambiarRol(valor: string) {
    for (const opcion of listaRoles) {
      if (opcion === valor) {
        setRol(opcion);
      }
    }
  }

  return (
    <form className="configuracion-formulario" onSubmit={guardar} noValidate>
      <label className="configuracion-campo">
        Nombre
        <input
          type="text"
          placeholder="Ej: Prof. Ana Morales"
          value={nombre}
          onChange={(evento) => {
            setNombre(evento.target.value);
            setMensajeError('');
          }}
        />
      </label>
      <label className="configuracion-campo">
        Correo
        <input
          type="email"
          placeholder="nombre@ucentral.cl"
          value={correo}
          onChange={(evento) => {
            setCorreo(evento.target.value);
            setMensajeError('');
          }}
        />
      </label>
      <label className="configuracion-campo">
        Rol
        <select value={rol} onChange={(evento) => cambiarRol(evento.target.value)}>
          {listaRoles.map((opcion) => (
            <option key={opcion} value={opcion}>
              {textoRol(opcion)}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="boton-principal" disabled={guardando}>
        {guardando && 'Agregando...'}
        {!guardando && '+ Agregar usuario'}
      </button>
      {mensajeError !== '' && <p className="configuracion-error usuarios-mensaje">{mensajeError}</p>}
    </form>
  );
}

export default FormularioNuevoUsuario;
