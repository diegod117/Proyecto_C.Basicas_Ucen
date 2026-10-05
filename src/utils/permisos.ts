// permisos.ts
// Funciones que dicen qué puede ver y hacer cada rol.
// Es la tabla de la sección 1 de docs/plan-fase-2.md pasada a código:
// si hay que cambiar un permiso, se cambia SOLO aquí.
// Las páginas y componentes preguntan "¿este rol puede...?" y, según la
// respuesta, muestran u ocultan botones y formularios.
// Cubre: RNF-03 (el encargado edita; el docente consulta y reserva;
// el departamento revisa reportes y alertas)
//
// OJO: esto solo oculta cosas en la pantalla. Sin un backend, alguien que
// sepa programar podría saltárselo. Para el MVP es suficiente.

import type { RolUsuario } from '../types/Usuario';
import type { Pagina } from '../types/Pagina';

// puedeVerPagina
// Recibe: el rol del usuario y una página del menú.
// Devuelve: true si ese rol puede entrar a esa página.
// Inventario y Reservas las ven todos. Incidencias y Alertas no las ve
// el docente, porque son tareas del encargado y del departamento (RF-04, RF-05).
export function puedeVerPagina(rol: RolUsuario, pagina: Pagina): boolean {
  if (pagina === 'incidencias' || pagina === 'alertas') {
    if (rol === 'docente') {
      return false;
    }
  }
  return true;
}

// puedeCambiarEstado
// Recibe: el rol del usuario.
// Devuelve: true si puede cambiar el estado de un recurso (HU-02).
// Solo el encargado edita el inventario (RNF-03).
export function puedeCambiarEstado(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeReservar
// Recibe: el rol del usuario.
// Devuelve: true si puede reservar un recurso (HU-03).
// Reservan el docente y el encargado; el departamento solo consulta.
export function puedeReservar(rol: RolUsuario): boolean {
  if (rol === 'docente' || rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeReservarAOtroDocente
// Recibe: el rol del usuario.
// Devuelve: true si puede escribir el nombre de OTRO docente al reservar.
// El encargado puede reservar a nombre de un profesor. El docente reserva
// siempre a su propio nombre, así nadie reserva haciéndose pasar por otro.
export function puedeReservarAOtroDocente(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeVerTodasLasReservas
// Recibe: el rol del usuario.
// Devuelve: true si ve las reservas de todos los docentes.
// Si devuelve false (docente), solo ve las suyas ("Mis reservas").
export function puedeVerTodasLasReservas(rol: RolUsuario): boolean {
  if (rol === 'docente') {
    return false;
  } else {
    return true;
  }
}

// puedeCancelarReserva
// Recibe: el rol del usuario y si la reserva es suya (true) o de otro (false).
// Devuelve: true si puede cancelar esa reserva.
// El encargado cancela cualquiera; el docente, solo las suyas;
// el departamento, ninguna.
export function puedeCancelarReserva(rol: RolUsuario, esReservaPropia: boolean): boolean {
  if (rol === 'encargado') {
    return true;
  } else if (rol === 'docente') {
    return esReservaPropia;
  } else {
    return false;
  }
}

// puedeGestionarIncidencias
// Recibe: el rol del usuario.
// Devuelve: true si puede registrar incidencias y avanzar su estado
// (HU-04, HU-10). El departamento solo puede ver la tabla.
export function puedeGestionarIncidencias(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}
