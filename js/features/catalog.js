import { CONFIG } from "../config.js";
import { fetchJson } from "../services/api.js";
import {
  getInstructors,
  setInstructors,
  setCourses,
} from "../state.js";
import { renderInstructorCard, wireInstructorPhotos } from "../components/instructorCard.js";
import { renderCourseCard } from "../components/courseCard.js";
import { openPricingModal } from "./pricingModal.js";
import { escapeHtml } from "../utils/sanitize.js";

export async function loadInstructors() {
  const grid = document.getElementById("instructorGrid");
  if (!grid) return;

  try {
    const data = await fetchJson(CONFIG.data.instructors);
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    setInstructors(data);
    grid.innerHTML = data.map((inst) => renderInstructorCard(inst)).join("");
    wireInstructorPhotos();
  } catch {
    grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar instructores."}</p>`;
  }
}

function bindPricingButtons(grid) {
  grid.querySelectorAll("[data-open-pricing]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open-pricing");
      if (id) openPricingModal(id);
    });
  });
}

function fillCourseSelect(data) {
  const courseSelect = document.getElementById("cf-course");
  if (!courseSelect) return;
  courseSelect.innerHTML =
    '<option value="">Seleccione…</option>' +
    data
      .map(
        (c) =>
          `<option value="${escapeHtml(String(c.id))}">${escapeHtml(
            String(c.title)
          )}</option>`
      )
      .join("") +
    '<option value="otro">Otro / consulta general</option>';
}

export async function loadCourses() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  try {
    const data = await fetchJson(CONFIG.data.courses);
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    setCourses(data);
    grid.innerHTML = data
      .map((c) => renderCourseCard(c, getInstructors()))
      .join("");

    bindPricingButtons(grid);
    fillCourseSelect(data);
  } catch {
    grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar cursos."}</p>`;
  }
}

/**
 * @param {string} filterKey
 */
export function filterCourses(filterKey) {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".course-card");
  cards.forEach((card) => {
    const modality = card.getAttribute("data-modality") || "";
    const status = card.getAttribute("data-status") || "";
    let show = true;
    if (filterKey === "coming_soon") {
      show = status === "coming_soon";
    } else if (
      filterKey === "Presencial" ||
      filterKey === "Virtual" ||
      filterKey === "Semipresencial"
    ) {
      show = modality === filterKey && status !== "coming_soon";
    } else {
      show = true;
    }
    card.classList.toggle("is-hidden", !show);
  });

  let emptyMsg =
    grid.getAttribute("data-empty-msg") || CONFIG.ui.courseGridEmptyDefault;
  if (filterKey === "coming_soon") {
    emptyMsg = CONFIG.ui.comingSoonEmpty;
  }
  const visible = [...cards].filter((c) => !c.classList.contains("is-hidden"));
  let emptyEl = grid.querySelector(".course-empty");
  if (visible.length === 0) {
    if (!emptyEl) {
      emptyEl = document.createElement("p");
      emptyEl.className = "course-empty section-lead";
      emptyEl.style.gridColumn = "1 / -1";
      grid.appendChild(emptyEl);
    }
    emptyEl.textContent = emptyMsg;
  } else if (emptyEl) {
    emptyEl.remove();
  }
}

export function initCourseFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter") || "all";
      filterCourses(filter);
    });
  });
}
