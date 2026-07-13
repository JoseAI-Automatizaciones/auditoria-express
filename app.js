const form = document.querySelector('#lead');
const button = document.querySelector('#send');
const message = document.querySelector('#msg');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = 'Enviando…';
  message.textContent = '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let response;
    try {
      response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No pudimos procesar tu solicitud.');

    message.textContent = data.message || 'Solicitud recibida. Revisaremos tu caso pronto.';
    form.reset();
  } catch (error) {
    message.textContent = error.name === 'AbortError'
      ? 'La respuesta tardó demasiado. Intenta nuevamente.'
      : error.message || 'No pudimos enviar tu solicitud. Intenta nuevamente.';
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.textContent = 'Enviar mi solicitud →';
  }
});