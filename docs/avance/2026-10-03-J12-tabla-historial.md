# 2026-10-03 — J12: tabla del historial de estados en la ficha (Johann)

**HU trabajada:** HU-06 (cierre). Rama: `feature/hu-06-historial-estados`.

**Qué se hizo:**
- Componente nuevo `src/components/TablaHistorial.tsx` y `.css`, con las columnas Fecha | Cambio | Motivo | Usuario, como en el mockup más el motivo. El cambio se muestra con las etiquetas de color de los estados. Si no hay cambios, muestra un aviso. En celular la tabla se desliza hacia el lado.
- `FichaRecurso`: nueva columna izquierda con los datos y, debajo, el historial (`obtenerHistorialDeRecurso()`). Como App redibuja todo al guardar, el cambio nuevo aparece arriba al instante.
- Corrección en `FormularioCambioEstado` (HU-02): si el estado de origen queda sin unidades después de guardar (ej: "Dañado (0)"), el formulario elige solo otro estado que tenga unidades.
- Se probó en el navegador:
  - el multímetro muestra sus 2 cambios del mockup;
  - al guardar uno nuevo aparece primero;
  - un error no agrega filas;
  - el soldador muestra el aviso de historial vacío;
  - al salir y volver a la ficha, el historial se mantiene.

**Archivos tocados:** `src/components/TablaHistorial.tsx`, `src/components/TablaHistorial.css`, `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/components/FormularioCambioEstado.tsx`, `docs/avance.md`.
