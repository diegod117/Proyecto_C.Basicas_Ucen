# 2026-10-05 — Formularios de la ficha fijos en pantalla (Johann)

**Trabajado:** arreglo de diseño en la ficha del recurso (recuadros "Cambiar estado" y "Reponer stock"). Solo estilos (CSS), sin cambios de lógica.

**Problema:** al bajar por la ficha, "Cambiar estado" se quedaba fijo, pero solo a 16px del borde, así que se escondía detrás de la barra azul (que mide 56px). "Reponer stock" no estaba fijo, así que subía y quedaba debajo de "Cambiar estado".

**Qué se hizo:**
- `components/FichaRecurso.css`: ahora se fija la **columna derecha completa** (`position: sticky`) y no cada formulario por separado. Así los dos recuadros se mueven juntos, uno debajo del otro, y quedan justo bajo la barra azul.
  - Si la ventana es baja y no caben los dos, la columna se desliza por dentro (`max-height` + `overflow-y: auto`).
  - Se agregaron `padding: 10px` y `margin: -10px` para que `overflow-y` no recorte la sombra de las tarjetas.
  - Solo en escritorio (más de 800px). En celular la columna baja debajo de la ficha como antes.
- `components/FormularioCambioEstado.css`: se quitó su `position: sticky`.
- `components/FormularioReponerStock.css`: se quitó la regla `position: static`, que ya no hace falta.

**Pruebas (Chrome, cuenta `encargado@prueba.cl`, ficha del Multímetro Fluke 87V):**
- Ventana de 1280×900: al bajar, "Cambiar estado" queda a 16px de la barra azul y "Reponer stock" justo debajo, sin taparse. Se ven las sombras completas.
- Ventana de 1280×650 (no caben los dos): la columna se desliza por dentro y nada queda tapado por la barra.
- Celular (390px): la columna no queda fija y no hay desplazamiento hacia el lado.
- Sin errores en la consola.

**Archivos tocados:** `src/components/FichaRecurso.css`, `src/components/FormularioCambioEstado.css`, `src/components/FormularioReponerStock.css`, `docs/avance/2026-10-05-columna-fija-ficha.md`.
