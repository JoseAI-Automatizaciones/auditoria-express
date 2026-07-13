const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map();

function json(res, status, body) {
  res.status(status).json(body);
}

function clientIp(req) {
  return (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'unknown')
    .toString().split(',')[0].trim();
}

function isAllowedRequest(req) {
  const site = req.headers['sec-fetch-site'];
  if (site && !['same-origin', 'same-site', 'none'].includes(site)) return false;
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return true;
  try { return new URL(origin).host === host; } catch { return false; }
}

function hitLimit(ip) {
  const now = Date.now();
  const entries = (attempts.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  entries.push(now);
  attempts.set(ip, entries);
  return entries.length > MAX_REQUESTS;
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Método no permitido.' });
  }
  if (!isAllowedRequest(req)) return json(res, 403, { error: 'Origen no permitido.' });

  const ip = clientIp(req);
  if (hitLimit(ip)) return json(res, 429, { error: 'Demasiados intentos. Espera unos minutos.' });

  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});

  if (text(body.website, 120)) return json(res, 400, { error: 'No pudimos procesar la solicitud.' });

  const lead = {
    name: text(body.name, 120),
    email: text(body.email, 200).toLowerCase(),
    business: text(body.business, 120),
    challenge: text(body.challenge, 700),
    source: 'auditoria-express',
    submitted_at: new Date().toISOString(),
  };

  if (lead.name.length < 2 || !validEmail(lead.email) || lead.business.length < 2 || lead.challenge.length < 10) {
    return json(res, 400, { error: 'Revisa los datos del formulario e inténtalo de nuevo.' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl || !/^https:\/\//.test(webhookUrl)) {
    return json(res, 503, { error: 'El sistema de seguimiento aún no está configurado.' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return json(res, 502, { error: 'No pudimos activar el seguimiento. Intenta nuevamente.' });
    return json(res, 200, { ok: true, message: '¡Solicitud recibida! Te contactaremos pronto.' });
  } catch {
    return json(res, 502, { error: 'No pudimos activar el seguimiento. Intenta nuevamente.' });
  }
}