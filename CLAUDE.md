# Auditoría Express — contexto

Proyecto Platzi de automatización post-lead. El formulario envía directamente al webhook público de n8n mediante URLSearchParams; la URL es visible en el cliente.

El webhook es público por decisión del usuario; n8n debe configurar CORS y gestionar anti-spam. n8n debe encadenar email, Sheet/CRM y notificación. Antes de commit/push: review de Codex.
