import { getCourses } from "../state.js";
import { formatCOP } from "../utils/format.js";

export function openPricingModal(courseId) {
  const modal = document.getElementById("pricingModal");
  const titleEl = document.getElementById("modalTitle");
  const nameEl = document.getElementById("modalCourseName");
  const bodyEl = document.getElementById("modalBody");
  if (!modal || !titleEl || !nameEl || !bodyEl) return;

  const course = getCourses().find((c) => c.id === courseId);
  if (!course) return;

  titleEl.textContent = "Tarifas por segmento";
  nameEl.textContent = String(course.title || "");

  const status = course.status;
  const prices = course.prices && typeof course.prices === "object" ? course.prices : {};

  if (status === "coming_soon") {
    bodyEl.innerHTML =
      '<p class="modal-placeholder">Los precios de este curso se publicarán próximamente.</p>';
  } else {
    const rows = [
      { key: "instructor", label: "Gestor del conocimiento (instructor)" },
      { key: "graduate", label: "Graduado" },
      { key: "executive", label: "Directivo" },
      { key: "community", label: "Comunidad externa" },
    ];
    let html =
      '<table class="price-table"><thead><tr><th>Segmento</th><th>Tarifa (COP)</th></tr></thead><tbody>';
    for (const row of rows) {
      const val = prices[row.key];
      html += `<tr><td>${row.label}</td><td>${formatCOP(
        typeof val === "number" ? val : null
      )}</td></tr>`;
    }
    html += "</tbody></table>";
    bodyEl.innerHTML = html;
  }

  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  const closeBtn = document.getElementById("modalClose");
  if (closeBtn) closeBtn.focus();
}

export function closePricingModal() {
  const modal = document.getElementById("pricingModal");
  if (!modal) return;
  modal.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

export function initPricingModal() {
  document.getElementById("modalClose")?.addEventListener("click", closePricingModal);
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closePricingModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePricingModal();
  });
}
