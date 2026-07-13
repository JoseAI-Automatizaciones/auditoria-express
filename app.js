const WEBHOOK_URL = 'https://jose-ai-n8n.vjgiak.easypanel.host/webhook/Platzi13dejulio';
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
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: new URLSearchParams(Object.fromEntries(new FormData(form))),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(data.error || 'El webhook rechazó la solicitud.');
    message.textContent = data.message || '¡Solicitud recibida! Te contactaremos pronto.';
    form.reset();
  } catch (error) {
    message.textContent = error.message || 'No pudimos enviar tu solicitud. Intenta nuevamente.';
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.textContent = 'Enviar mi solicitud →';
  }
});