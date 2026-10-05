# 2026-10-03 — D9 y D10: generación de alertas automáticas (Diego)

**HU trabajada:** HU-09 (alertas de mantención, reparación y reposición) y RF-04.

**Qué se hizo:**
- `src/types/Alerta.ts` (D9): definición del tipo unión `TipoAlerta` (`'mantencion' | 'reparacion' | 'reposicion'`) y la interface `Alerta`.
- `src/utils/alertas.ts` (D10): función `generarAlertas(recursos)` que evalúa recursos dañados (reparación), recursos en mantención (mantención) y recursos cuyo stock disponible cae bajo el `stockMinimo` (reposición, como los guantes de nitrilo). Incluye función `textoTipoAlerta()`.

**Archivos tocados:** `src/types/Alerta.ts`, `src/utils/alertas.ts`.
