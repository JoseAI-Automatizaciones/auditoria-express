# Nodo Code: correo de Auditoría Express

Pega el contenido de CODE_EMAIL.js en un nodo Code de n8n, configurado en Run Once for All Items.

Conecta el nodo Webhook al nodo Code y luego al nodo Gmail.

En Gmail usa estos valores:

- To: {{$json.to}}
- Subject: {{$json.subject}}
- Email Type: HTML
- Message: {{$json.emailHtml}}

El código toma name, email, business y challenge que llegan desde el formulario. Escapa los datos antes de insertarlos al HTML para que un lead no pueda alterar el correo.