// SelectorRolBienvenida.tsx
// Los tres botones "Encargado · Docente · Departamento" de la sección
// "Qué puedes hacer". El rol elegido lo guarda SeccionQueHace (useState);
// este componente solo dibuja los botones y avisa cuál se tocó.
// Usa los estilos de SeccionQueHace.css.
// Cubre: RNF-03 (qué puede hacer cada rol), RNF-01 (se usa con el pulgar)

import type { RolUsuario } from '../types/Usuario';

interface PropsSelectorRolBienvenida {
  // Rol que está elegido ahora
  rolElegido: RolUsuario;
  // Función de SeccionQueHace para cambiar el rol elegido
  onElegir: (rol: RolUsuario) => void;
}

// claseBoton
// Recibe: el rol de un botón y el rol elegido.
// Devuelve: las clases CSS del botón ("elegido" pinta el botón de azul noche).
function claseBoton(rolDelBoton: RolUsuario, rolElegido: RolUsuario): string {
  if (rolDelBoton === rolElegido) {
    return 'selector-rol-boton selector-rol-elegido';
  } else {
    return 'selector-rol-boton';
  }
}

// Componente SelectorRolBienvenida
// Recibe: el rol elegido y la función para elegir otro.
// Devuelve: el texto "Soy" y los tres botones.
// role="group" agrupa los botones para los lectores de pantalla, y
// aria-pressed les dice cuál está "apretado" (el elegido).
function SelectorRolBienvenida(props: PropsSelectorRolBienvenida) {
  return (
    <div className="selector-rol">
      <p className="bienv-texto selector-rol-soy">Soy</p>
      <div className="selector-rol-botones" role="group" aria-label="Elige tu rol para ver qué puedes hacer">
        <button
          type="button"
          className={claseBoton('encargado', props.rolElegido)}
          aria-pressed={props.rolElegido === 'encargado'}
          onClick={() => props.onElegir('encargado')}
        >
          Encargado
        </button>
        <button
          type="button"
          className={claseBoton('docente', props.rolElegido)}
          aria-pressed={props.rolElegido === 'docente'}
          onClick={() => props.onElegir('docente')}
        >
          Docente
        </button>
        <button
          type="button"
          className={claseBoton('departamento', props.rolElegido)}
          aria-pressed={props.rolElegido === 'departamento'}
          onClick={() => props.onElegir('departamento')}
        >
          Departamento
        </button>
      </div>
    </div>
  );
}

export default SelectorRolBienvenida;
