# Auditoría Express — contexto

Proyecto Platzi de automatización post-lead. `api/submit.js` es un proxy seguro hacia n8n: el token va solo en `N8N_WEBHOOK_TOKEN` de Vercel y se envía como `X-Webhook-Token`.

No enviar el webhook directamente desde el navegador. Mantener rate limit, timeout y validación. n8n debe encadenar email, Sheet/CRM y notificación. Antes de commit/push: review de Codex.
