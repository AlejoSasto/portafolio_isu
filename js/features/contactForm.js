import { CONFIG } from "../config.js";

/**
 * Envío a Formspree vía fetch (AJAX), sin dependencias extra.
 * @see https://help.formspree.io/hc/en-us/articles/360013470814-Submit-forms-with-JavaScript-AJAX
 */

/**
 * @param {Record<string, unknown>} body
 * @returns {string}
 */
function formatFormspreeErrors(body) {
  if (typeof body.error === "string" && body.error) {
    return body.error;
  }
  const errors = body.errors;
  if (errors && typeof errors === "object") {
    const parts = Object.entries(errors)
      .map(([field, msg]) => {
        const m = Array.isArray(msg) ? msg.join(", ") : String(msg);
        return `${field}: ${m}`;
      })
      .filter(Boolean);
    if (parts.length > 0) return parts.join(" · ");
  }
  return "No se pudo enviar el formulario. Intente de nuevo más tarde.";
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form || !status) return;

    const nameInput = form.querySelector("#cf-name");
    const emailInput = form.querySelector("#cf-email");
    if (
      nameInput instanceof HTMLInputElement &&
      emailInput instanceof HTMLInputElement
    ) {
      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        status.textContent = "Complete nombre y correo.";
        status.style.color = "#c62828";
        return;
      }
    }

    const fd = new FormData(form);
    fd.append("_subject", "Educación continua ISC Ubaté — solicitud desde el sitio");

    status.style.color = "";
    status.textContent = "Enviando…";
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

    try {
      const res = await fetch(CONFIG.formspree.endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        status.style.color = "";
        status.textContent =
          "¡Gracias! Su mensaje fue enviado. Nos pondremos en contacto pronto.";
        form.reset();
      } else {
        status.style.color = "#c62828";
        status.textContent = formatFormspreeErrors(data);
      }
    } catch {
      status.style.color = "#c62828";
      status.textContent =
        "Error de red. Compruebe su conexión e intente de nuevo.";
    } finally {
      if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
    }
  });
}
