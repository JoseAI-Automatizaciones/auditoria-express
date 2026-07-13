# Auditoría Express — automatización post-lead

Landing que manda cada solicitud directamente a un webhook de n8n para encadenar email, CRM/Sheet y una notificación interna.

## Arquitectura

Navegador → webhook POST público de n8n → email + CRM/Sheet + notificación

No usa variables de Vercel ni funciones serverless. El navegador hace un POST application/x-www-form-urlencoded al webhook.

## Configuración obligatoria en n8n

1. En el nodo Webhook: Method POST, Path Platzi13dejulio y Authentication None.
2. Permite el dominio real de Vercel en CORS. Para el proyecto actual debe ser su URL de producción, sin slash final.
3. Conecta las tres acciones: Send Email, Google Sheets/CRM y Telegram/Slack/email interno.
4. Los campos llegan como name, email, business y challenge.
5. Finaliza con Respond to Webhook usando cualquier respuesta HTTP 2xx, por ejemplo { "ok": true }.
6. Activa el workflow y usa la Production URL.

## Prueba

Envía un lead real desde la landing y confirma: correo recibido, fila/lead creado y notificación entregada.

## Workflow descargable

Puedes [descargar e importar el workflow de n8n](n8n/Platzi%2013%20de%20Julio.json) directamente desde este repositorio.
