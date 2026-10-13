// permisos.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "reglamento" de la app: dice qué puede ver y hacer cada rol.
// Cada función es una pregunta de sí o no, por ejemplo:
// "¿un docente puede cambiar el estado de un recurso?" -> false (no).
// Las pantallas le hacen estas preguntas y, según la respuesta, muestran
// u ocultan botones y formularios.
// ¡Si quieres cambiar un permiso, se cambia SOLO aquí! (ver guía, paso 9)
// Cubre: RNF-03 (el encargado edita; el docente consulta y reserva;
// el departamento revisa reportes y alertas)
//
// OJO: esto solo ESCONDE cosas en la pantalla. Es como esconder las galletas
// en un estante alto: funciona para casi todos, pero alguien que sepa
// programar podría alcanzarlas. Para este proyecto (MVP) es suficiente.

import type { RolUsuario } from '../types/Usuario';
import type { Pagina } from '../types/Pagina';

// Todas las funciones de aquí devuelven "boolean": true (sí) o false (no).

// puedeVerPagina
// Recibe: el rol de la persona y una página del menú.
// Devuelve: true si esa persona puede entrar a esa página.
// Inventario y Reservas las ven todos. Incidencias y Alertas NO las ve el
// docente, porque son tareas del encargado y del departamento (RF-04, RF-05).
export function puedeVerPagina(rol: RolUsuario, pagina: Pagina): boolean {
  // Configuración (agregar categorías, torres y salas) es SOLO del encargado.
  // Es la llave de la bodega: no se le pasa a cualquiera.
  if (pagina === 'configuracion') {
    if (rol === 'encargado') {
      return true;
    } else {
      return false;
    }
  }
  // || se lee "o": "si la página es incidencias O alertas..."
  if (pagina === 'incidencias' || pagina === 'alertas') {
    if (rol === 'docente') {
      return false;
    }
  }
  // Cualquier otro caso: sí puede.
  return true;
}

// puedeCambiarEstado
// Recibe: el rol de la persona.
// Devuelve: true si puede cambiar el estado de un recurso (HU-02).
// Solo el encargado modifica el inventario (RNF-03).
export function puedeCambiarEstado(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeReponerStock
// Recibe: el rol de la persona.
// Devuelve: true si puede agregar unidades nuevas a un recurso.
// Igual que cambiar estado: solo el encargado (RNF-03).
export function puedeReponerStock(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeAgregarRecurso
// Recibe: el rol de la persona.
// Devuelve: true si ve el botón "+ Agregar recurso".
// Solo el encargado (RNF-03).
export function puedeAgregarRecurso(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeReservar
// Recibe: el rol de la persona.
// Devuelve: true si ve el formulario "Nueva reserva" (HU-03).
// Reservan el docente y el encargado. El departamento solo mira.
export function puedeReservar(rol: RolUsuario): boolean {
  if (rol === 'docente' || rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeReservarAOtroDocente
// Recibe: el rol de la persona.
// Devuelve: true si puede escribir el nombre de OTRO profesor al reservar.
// El encargado puede reservar para cualquier profesor. El docente reserva
// siempre a su propio nombre (el campo le aparece bloqueado), así nadie
// puede reservar haciéndose pasar por otro.
export function puedeReservarAOtroDocente(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}

// puedeVerTodasLasReservas
// Recibe: el rol de la persona.
// Devuelve: true si ve las reservas de TODOS los profesores.
// Si devuelve false (docente), solo ve las suyas ("Mis reservas").
export function puedeVerTodasLasReservas(rol: RolUsuario): boolean {
  if (rol === 'docente') {
    return false;
  } else {
    return true;
  }
}

// puedeCancelarReserva
// Recibe: el rol de la persona y si la reserva es SUYA (true) o de otro (false).
// Devuelve: true si puede cancelar esa reserva.
//   - Encargado: cualquiera.
//   - Docente: solo las suyas (devuelve lo mismo que esReservaPropia).
//   - Departamento: ninguna.
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
// Recibe: el rol de la persona.
// Devuelve: true si puede registrar incidencias y avanzar su semáforo
// (HU-04, HU-10). El departamento solo puede mirar la tabla.
export function puedeGestionarIncidencias(rol: RolUsuario): boolean {
  if (rol === 'encargado') {
    return true;
  } else {
    return false;
  }
}
