# FairClaimBC — GitHub Pages Deployment

## Setup

1. Sube todos estos archivos a tu repositorio de GitHub
2. Ve a Settings → Pages → Source: Deploy from branch → main → / (root)
3. GitHub te da la URL en 2 minutos: `https://[tu-usuario].github.io/fairclaimbc`

## Conectar tu dominio de GoDaddy

1. En GitHub Pages → Custom domain → escribe tu dominio (ej: `fairclaimbc.ca`)
2. En GoDaddy → DNS → agrega estos registros:
   ```
   Type: CNAME
   Name: www
   Value: [tu-usuario].github.io
   
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
3. Espera 10-30 minutos para propagación DNS

## Archivos del proyecto

- `index.html`       — página principal con API key configurada
- `app.jsx`          — lógica principal + llamada directa a Anthropic API
- `main.jsx`         — pantallas Delta Report, Checkout, Letter
- `letter.jsx`       — generación de carta de disputa
- `data.jsx`         — datos de vehículos BC
- `design-canvas.jsx`— canvas de diseño
- `ios-frame.jsx`    — frame móvil
- `browser-window.jsx`— frame desktop
- `tweaks-panel.jsx` — panel de configuración

## Actualizar la API key

La API key está en `index.html` línea 23.
Para regenerarla: https://console.anthropic.com → API Keys
