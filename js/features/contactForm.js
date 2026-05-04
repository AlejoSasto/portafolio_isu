export function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form?.addEventListener("submit", (e) => {
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
    status.style.color = "";
    status.textContent =
      "¡Gracias! Su mensaje fue registrado (demostración; no se envió a ningún servidor).";
    form.reset();
  });
}
