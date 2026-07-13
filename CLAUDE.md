# Auditoría Express — contexto

Proyecto Platzi de automatización post-lead. El navegador envía el formulario a /api/submit en Vercel; esa función valida, limita abuso y reenvía los datos al webhook público de n8n. La URL del webhook no se expone al navegador.

El webhook sigue sin autenticación por decisión del usuario. En n8n, el workflow debe encadenar email, Sheet/CRM y notificación, responder HTTP 2xx y usar los valores recibidos como {{$json.body.name}} si el nodo Webhook los ubica dentro de body.

Configuración requerida en Vercel: N8N_WEBHOOK_URL. Nunca se commitean archivos .env*. Antes de commit/push: review de Codex.