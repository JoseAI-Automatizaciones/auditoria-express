# Auditoría Express — automatización post-lead

Landing que convierte una solicitud en una automatización real: email, registro en CRM/Sheet y alerta interna desde n8n.

## Arquitectura

Navegador → API de Vercel → webhook público de n8n → email + CRM/Sheet + notificación

La landing no expone la URL de n8n. La API valida los datos, usa honeypot, limita intentos por IP y rechaza solicitudes de otros orígenes antes de reenviar un lead válido.

## Configuración en Vercel

Crea la variable de entorno N8N_WEBHOOK_URL para Production, Preview y Development con esta URL:

https://jose-ai-n8n.vjgiak.easypanel.host/webhook/Platzi13dejulio

Después redeploya. No requiere token ni Header Auth: el webhook permanece público por decisión del proyecto, pero ya no es accesible desde el JavaScript del navegador.

## Workflow en n8n

1. Crea un Webhook POST con path Platzi13dejulio, Authentication None.
2. Conecta tres acciones: Send Email, Google Sheets/CRM y Telegram/Slack/email interno.
3. En los nodos, usa los campos de body: {{$json.body.name}}, {{$json.body.email}}, {{$json.body.business}} y {{$json.body.challenge}}.
4. Termina con Respond to Webhook y una respuesta HTTP 2xx, por ejemplo { "ok": true }.
5. Activa el workflow y usa su Production URL.

## Prueba

Envía un lead de prueba desde la landing y confirma: correo recibido, fila/lead creado y notificación entregada.