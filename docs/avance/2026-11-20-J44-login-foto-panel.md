# 2026-11-20 — J44: foto del edificio UCEN en el panel azul del login (Johann)

**HU trabajada:** ninguna de la línea base. Es un ajuste de diseño de J43, que pidió Johann: poner una foto del edificio de la Universidad Central detrás del panel azul, con un fade azul parecido al de MiUcen. Rama: `feature/login-foto-panel`.

**Qué se hizo:**
- `public/bienvenida/edificio-ucen.jpg`: es la foto que entregó Johann (600×450), pasada de PNG a JPG (de 366 KB a 68 KB).
- `PanelMarcaLogin.css`: el panel ahora tiene dos capas de fondo. Arriba va un degradado del azul UCEN que empieza al 55 % (deja ver la foto) y termina al 100 % abajo, para que los textos se lean y el panel se una sin corte con el azul de los créditos. Debajo va la foto con `background-size: cover`. Si la foto no carga, queda el azul de siempre.
- No se tocó ningún `.tsx`.
- `npm run build` y `npm run lint`: OK. Se probó el panel a 1440×900 y a 360 px.

**Archivos tocados:** `public/bienvenida/edificio-ucen.jpg` (nuevo), `src/components/PanelMarcaLogin.css`, `docs/avance/2026-11-20-J44-login-foto-panel.md`.
