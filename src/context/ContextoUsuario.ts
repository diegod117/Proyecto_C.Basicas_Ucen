// ContextoUsuario.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el PARLANTE de la app: sirve para que TODOS los componentes sepan
// quién está conectado, sin tener que pasárselo de mano en mano.
// Usa useContext, una herramienta de React (ver guía, paso 6).
//
// ¿Qué problema resuelve?
// Antes la persona conectada se pasaba como prop de papá a hijo a nieto:
//   App -> PaginaInventario -> FichaRecurso -> FormularioCambioEstado
// aunque los del medio NO la usaran (solo la pasaban). Es como un recado
// que pasa por 4 personas hasta llegar a quien lo necesita.
// Ahora App la ANUNCIA una vez por el parlante (ContextoUsuario.Provider)
// y cualquier componente la ESCUCHA escribiendo useUsuario().
//
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), RNF-03

// createContext = crear un parlante. useContext = escuchar un parlante.
import { createContext, useContext } from 'react';
import type { Usuario } from '../types/Usuario';

// ContextoUsuario
// createContext crea el parlante (el "canal" por donde viaja el dato).
// Lo que va entre paréntesis (null) es lo que se escucha si nadie está
// anunciando nada: null = "no hay nadie conectado".
// <Usuario | null> le dice a TypeScript qué puede viajar por este canal:
// un Usuario O null (nada).
// Se exporta porque App.tsx lo usa para anunciar: <ContextoUsuario.Provider value={...}>
export const ContextoUsuario = createContext<Usuario | null>(null);

// useUsuario
// Es un HOOK PERSONALIZADO (hecho por nosotros). Un hook personalizado es
// una función que:
//   1. empieza con "use" (así React sabe que es un hook), y
//   2. usa otros hooks adentro (aquí usa useContext).
// No recibe nada.
// Devuelve: la persona conectada (con su nombre, correo y rol).
// Así, en cualquier componente basta escribir:  const usuario = useUsuario();
// en vez de repetir las 4 líneas de abajo en todos lados.
export function useUsuario(): Usuario {
  // useContext(ContextoUsuario) = "¿qué está diciendo el parlante ahora?"
  const usuario = useContext(ContextoUsuario);
  // Si sale null, alguien usó useUsuario() en un lugar donde no hay sesión
  // (ej: en la pantalla de login). Eso es un error de programación, así
  // que "lanzamos" (throw) un error con un mensaje claro para encontrarlo
  // rápido. Gracias a este if, TypeScript sabe que abajo usuario NO es null.
  if (usuario === null) {
    throw new Error('useUsuario() solo se puede usar con una sesión iniciada.');
  }
  return usuario;
}
