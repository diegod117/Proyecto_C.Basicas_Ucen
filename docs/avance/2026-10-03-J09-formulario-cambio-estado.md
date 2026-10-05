# 2026-10-03 — J9: formulario para cambiar el estado de un recurso (Johann)

**HU trabajada:** HU-02 (en progreso). Rama: `feature/hu-02-cambiar-estado`.

**Qué se hizo:**
- Componente nuevo `src/components/FormularioCambioEstado.tsx` y `.css`, a la derecha de la ficha como en el mockup. Campos: estado actual (muestra cuántas unidades hay en cada uno), nuevo estado, cantidad y motivo.
- Archivo nuevo `src/utils/cambioEstado.ts`:
  - `obtenerEstadoOrigenInicial()`: si el recurso no tiene unidades disponibles, parte en el primer estado que sí tenga.
  - `validarCambioEstado()`: estados distintos, cantidad entera mayor que 0, que no supere las unidades del estado de origen, y motivo obligatorio.
- `src/services/recursosService.ts`: nueva función `cambiarEstadoRecurso()`. Resta en el estado de origen y suma en el nuevo, y vuelve a revisar las unidades para que nunca queden números negativos.
- `FichaRecurso`: dos columnas (datos y formulario). Un `useState` contador la redibuja después de guardar, porque React no detecta solo que el servicio cambió los números.
- El formulario usa `noValidate` para que todos los errores salgan con nuestros mensajes en español.
- El motivo se pide y se valida, pero se guardará recién con el historial (HU-06, J11).
- Se probó en el navegador:
  - las 5 validaciones (mismo estado, cantidad 0, cantidad 2.5, 3 desde "Dañado" con solo 1 unidad, y sin motivo);
  - un cambio válido (1 multímetro de Disponible a Dañado): la tabla quedó 11 / 2 y la tarjeta y el filtro "Dañado" se actualizaron;
  - la campana parte con "En mantención" como estado inicial.

**Archivos tocados:** `src/components/FormularioCambioEstado.tsx`, `src/components/FormularioCambioEstado.css`, `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/utils/cambioEstado.ts`, `src/services/recursosService.ts`, `docs/avance.md`.
