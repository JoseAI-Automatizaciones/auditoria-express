# Auditoría Express — automatización post-lead

Landing para demostrar que un lead recibe respuesta y organización automática después de enviar un formulario.

## Arquitectura

`Navegador → n8n Webhook público → Email + CRM/Sheet + notificación`

El navegador envía los datos directamente al webhook público. No hay variables de Vercel ni autenticación en este modo.`n`n## CORS en n8n`n`nConfigura el webhook para aceptar solicitudes desde el dominio de Vercel de esta landing. El formulario usa `application/x-www-form-urlencoded` para evitar un preflight innecesario.`n`n- `N8N_WEBHOOK_URL`: `https://jose-ai-n8n.vjgiak.easypanel.host/webhook/Platzi13dejulio`
- `N8N_WEBHOOK_TOKEN`: un valor aleatorio largo, configurado únicamente en Vercel y n8n. Nunca en Git ni en este archivo.

Genera el valor localmente con:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(24)).Replace('+','-').Replace('/','_').TrimEnd('=')
```

## Configuración del workflow n8n

1. Crea un workflow y agrega **Webhook**: Method `POST`, Path `Platzi13dejulio`, Authentication **None** (webhook público).
2. No configures credenciales de Header Auth.
3. Conecta estas tres acciones:
   - **Send Email**: destinatario `{{$json.email}}`; usa el HTML de abajo.
   - **Google Sheets o CRM**: crea una fila/lead con `name`, `email`, `business`, `challenge`, `source`, `submitted_at`.
   - **Telegram, Slack o email interno**: `Nuevo lead: {{$json.name}} · {{$json.business}} · {{$json.email}}`.
4. Termina con **Respond to Webhook** y JSON `{ "ok": true }`.
5. Activa el workflow y usa la Production URL.

## HTML para el correo de bienvenida

```html
<div style="background:#f5f8fc;padding:32px;font-family:Arial,sans-serif;color:#0d1b2a"><div style="max-width:600px;margin:auto;background:#fff;border-top:6px solid #2de2b7;border-radius:16px;padding:32px"><p style="color:#16856d;font-weight:700;letter-spacing:1px">AUDITORÍA EXPRESS</p><h1 style="margin:0 0 16px;font-size:28px">Hola, {{$json.name}}.</h1><p>Gracias por solicitar una auditoría para <strong>{{$json.business}}</strong>.</p><p>Ya registramos tu solicitud y estamos revisando este desafío:</p><blockquote style="border-left:4px solid #2de2b7;margin:20px 0;padding:12px 16px;background:#f5f8fc">{{$json.challenge}}</blockquote><p>Te compartiremos los próximos pasos pronto. Mientras tanto, tu lead ya está organizado en nuestro sistema.</p><p style="margin-top:28px">— Equipo Auditoría Express</p></div></div>
```

## Prueba final

Envía un lead real desde la landing. Debes comprobar: correo recibido, fila/lead creado y notificación entregada.
