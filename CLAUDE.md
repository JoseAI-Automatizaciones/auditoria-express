# Auditoría Express — contexto

Proyecto Platzi de automatización post-lead. El navegador envía el formulario directamente al webhook público de n8n con un POST x-www-form-urlencoded. La URL está en app.js y no usa variables de Vercel ni API serverless.

El nodo Webhook de n8n debe tener Authentication None y CORS debe permitir el dominio de producción de Vercel. n8n encadena email, Sheet/CRM y notificación. Antes de commit/push: review de Codex.