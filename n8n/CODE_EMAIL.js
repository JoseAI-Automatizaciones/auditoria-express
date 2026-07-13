function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function readText(value, fallback) {
  const text = String(value ?? '').trim();
  return text || fallback;
}

return $input.all().map((item) => {
  const incoming = item.json.body && typeof item.json.body === 'object'
    ? item.json.body
    : item.json;

  const name = readText(incoming.name, 'hola');
  const email = readText(incoming.email, '');
  const business = readText(incoming.business, 'tu proyecto');
  const challenge = readText(incoming.challenge, 'Mejorar la captación y el seguimiento de leads.');

  const safeName = escapeHtml(name);
  const safeBusiness = escapeHtml(business);
  const safeChallenge = escapeHtml(challenge);

  const emailHtml = [
    '<!doctype html>',
    '<html lang="es"><body style="margin:0;padding:0;background:#f5f8fc;font-family:Arial,Helvetica,sans-serif;color:#0d1b2a;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f8fc;padding:32px 16px;"><tr><td align="center">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;">',
    '<tr><td style="height:7px;background:#2de2b7;"></td></tr>',
    '<tr><td style="padding:36px 32px 24px;">',
    '<p style="margin:0 0 14px;color:#16856d;font-size:12px;font-weight:700;letter-spacing:1.4px;">AUDITORÍA EXPRESS</p>',
    '<h1 style="margin:0 0 18px;font-size:30px;line-height:1.18;color:#0d1b2a;">Hola, ' + safeName + '.</h1>',
    '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Gracias por solicitar una auditoría para <strong>' + safeBusiness + '</strong>. Ya recibimos tu información y nuestro sistema dejó tu solicitud organizada para seguimiento.</p>',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;background:#f5f8fc;border-radius:12px;"><tr><td style="padding:18px 20px;border-left:4px solid #2de2b7;">',
    '<p style="margin:0 0 7px;font-size:12px;font-weight:700;letter-spacing:1px;color:#16856d;">TU PRIORIDAD DECLARADA</p>',
    '<p style="margin:0;font-size:16px;line-height:1.55;color:#243447;">' + safeChallenge + '</p>',
    '</td></tr></table>',
    '<h2 style="margin:28px 0 12px;font-size:20px;color:#0d1b2a;">Lo que revisaremos primero</h2>',
    '<ol style="margin:0;padding-left:22px;font-size:16px;line-height:1.75;color:#243447;">',
    '<li>Qué ocurre desde que entra un lead hasta el primer contacto.</li>',
    '<li>Cómo priorizar y responder antes de que el interés se enfríe.</li>',
    '<li>Qué información conviene registrar para dar seguimiento.</li>',
    '</ol>',
    '<p style="margin:26px 0 0;font-size:16px;line-height:1.6;">Pronto nos estaremos contactando contigo con los siguientes pasos.</p>',
    '<p style="margin:28px 0 0;font-size:15px;color:#526579;">— Equipo Auditoría Express</p>',
    '</td></tr>',
    '<tr><td style="padding:18px 32px;background:#0d1b2a;color:#b9c9dc;font-size:12px;line-height:1.5;">Solicitud recibida desde Auditoría Express.</td></tr>',
    '</table></td></tr></table></body></html>',
  ].join('');

  return {
    json: {
      ...item.json,
      lead: { name, email, business, challenge },
      to: email,
      subject: 'Recibimos tu solicitud de auditoría, ' + name,
      emailHtml,
    },
  };
});