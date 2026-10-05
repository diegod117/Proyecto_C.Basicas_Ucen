# 2026-10-04 — Reponer stock desde la ficha (Johann)

**Trabajado:** RF-04 y HU-09 (resolver alertas de reposición), HU-06 y RNF-06 (queda en el historial), RNF-03 (solo el encargado). Rama: `feature/reponer-stock`.

**Problema:** las alertas de reposición (ej: guantes de nitrilo, 2 cajas con mínimo 5) no se podían resolver. La ficha solo tenía "Cambiar estado", que mueve unidades entre estados sin cambiar el total. No había forma de agregar unidades nuevas.

**Qué se hizo:**
- `components/FormularioReponerStock.tsx/.css` (nuevos): recuadro "Reponer stock" debajo de "Cambiar estado".
  - Muestra "Disponibles: N · Mínimo: M" y pide las unidades que llegaron y un motivo (ej: "Compra orden 123").
  - Usa las mismas clases CSS que "Cambiar estado" para verse igual.
- `utils/reposicion.ts` (nuevo): `validarReposicion()` (cantidad entera mayor que 0 y motivo obligatorio) y `textoResumenReposicion()` (mensaje de confirmación en singular o plural).
- `services/recursosService.ts`: `reponerStock()` suma las unidades a "disponible" y registra la reposición en el historial. A diferencia de un cambio de estado, aquí el total sí sube.
- `types/CambioEstado.ts`: campo nuevo `tipo: 'cambio_estado' | 'reposicion'`. Se agregó a los 3 registros de `data/historialEstados.ts`.
- `services/historialService.ts`: `registrarReposicion()`; `registrarCambioEstado()` ahora guarda `tipo: 'cambio_estado'`.
- `components/TablaHistorial.tsx/.css`: las reposiciones se muestran como "Reposición +N → Disponible", en verde.
- `utils/permisos.ts`: `puedeReponerStock(rol)`, solo el encargado.
- `components/FichaRecurso.tsx/.css`: los dos formularios van en una columna derecha (`.ficha-columna-derecha`). El docente y el departamento ven un solo aviso.
- `components/TablaUnidadesEstado.tsx/.css` (nuevos): la tabla "Unidades por estado" se separó de la ficha, que ya pasaba de 160 líneas. Ahora la ficha tiene 157.
- Se probó con un script que usa los servicios reales:
  - se rechazan una cantidad 0, decimales, un motivo vacío y un recurso inexistente;
  - con los guantes (2 disponibles, mínimo 5): al reponer 3 quedan 5 y la alerta sigue, porque la regla de HU-09 es "menor o igual al mínimo"; al reponer 1 más quedan 6 y la alerta desaparece;
  - el historial guarda las reposiciones con su motivo y usuario, junto a los cambios de estado normales.

**Pendiente (fuera del alcance):** descontar unidades consumidas (ej: cajas de guantes usadas). Es el "registro del consumo de insumos" de la sección 3.4 de requerimientos.

**Archivos tocados:** `src/components/FormularioReponerStock.tsx`, `src/components/FormularioReponerStock.css`, `src/components/TablaUnidadesEstado.tsx`, `src/components/TablaUnidadesEstado.css`, `src/utils/reposicion.ts`, `src/utils/permisos.ts`, `src/services/recursosService.ts`, `src/services/historialService.ts`, `src/types/CambioEstado.ts`, `src/data/historialEstados.ts`, `src/components/TablaHistorial.tsx`, `src/components/TablaHistorial.css`, `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `docs/avance/2026-10-04-reponer-stock.md`.
