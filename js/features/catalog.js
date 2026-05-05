import { CONFIG } from "../config.js";
import { fetchJson } from "../services/api.js";
import {
  getCourses,
  getInstructors,
  setInstructors,
  setCourses,
} from "../state.js";
import { renderInstructorCard, wireInstructorPhotos } from "../components/instructorCard.js";
import { renderCourseCard } from "../components/courseCard.js";
import { openPricingModal } from "./pricingModal.js";
import { escapeHtml } from "../utils/sanitize.js";
import { buildInterdisciplinarySectionsHtml } from "../domain/interdisciplinaryNote.js";

/** @type {Promise<Array<Record<string, unknown>>> | null} */
let coursesLoadPromise = null;

/** @type {string} */
let activeModalityFilter = "all";

/** @type {string[] | null} */
let chatHighlightCourseIds = null;

function modalityMatchesCard(filterKey, modality, status) {
  if (filterKey === "coming_soon") {
    return status === "coming_soon";
  }
  if (
    filterKey === "Presencial" ||
    filterKey === "Virtual" ||
    filterKey === "Semipresencial"
  ) {
    return modality === filterKey && status !== "coming_soon";
  }
  return true;
}

function syncFilterButtonActiveState() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const f = btn.getAttribute("data-filter") || "all";
    btn.classList.toggle("active", f === activeModalityFilter);
  });
}

/**
 * Aplica filtro de modalidad + acotación por IDs del asistente.
 */
export function syncCourseGridVisibility() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".course-card");
  const highlightSet =
    chatHighlightCourseIds && chatHighlightCourseIds.length > 0
      ? new Set(chatHighlightCourseIds.map(String))
      : null;

  cards.forEach((card) => {
    const modality = card.getAttribute("data-modality") || "";
    const status = card.getAttribute("data-status") || "";
    const id = card.getAttribute("data-id") || "";
    const modalityOk = modalityMatchesCard(
      activeModalityFilter,
      modality,
      status
    );
    const idOk = highlightSet === null || highlightSet.has(id);
    card.classList.toggle("is-hidden", !(modalityOk && idOk));
  });

  let emptyMsg =
    grid.getAttribute("data-empty-msg") || CONFIG.ui.courseGridEmptyDefault;
  if (activeModalityFilter === "coming_soon") {
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

export async function loadInstructors() {
  const grid = document.getElementById("instructorGrid");
  if (!grid) return;

  const institutionalEl = document.getElementById(
    "interdisciplinaryInstitutional"
  );

  try {
    const data = await fetchJson(CONFIG.data.instructors);
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    setInstructors(data);
    grid.innerHTML = data.map((inst) => renderInstructorCard(inst)).join("");
    wireInstructorPhotos();

    if (institutionalEl) {
      const institutionalHtml = buildInterdisciplinarySectionsHtml(data);
      if (institutionalHtml) {
        institutionalEl.hidden = false;
        institutionalEl.innerHTML = institutionalHtml;
      } else {
        institutionalEl.hidden = true;
        institutionalEl.innerHTML = "";
      }
    }
  } catch {
    grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar instructores."}</p>`;
    if (institutionalEl) {
      institutionalEl.hidden = true;
      institutionalEl.innerHTML = "";
    }
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

/**
 * Obtiene cursos desde JSON, actualiza estado y el select del formulario si existe.
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function ensureCoursesLoaded() {
  if (coursesLoadPromise) return coursesLoadPromise;

  coursesLoadPromise = (async () => {
    const data = await fetchJson(CONFIG.data.courses);
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    setCourses(data);
    fillCourseSelect(data);
    return data;
  })().catch((err) => {
    coursesLoadPromise = null;
    throw err;
  });

  return coursesLoadPromise;
}

/**
 * Pinta la rejilla de cursos usando el estado en memoria (tras ensureCoursesLoaded).
 */
export function renderCourseGridFromCache() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  const data = getCourses();
  grid.innerHTML = data
    .map((c) => renderCourseCard(c, getInstructors()))
    .join("");
  bindPricingButtons(grid);
  syncCourseGridVisibility();
}

export async function loadCourses() {
  const grid = document.getElementById("courseGrid");
  try {
    await ensureCoursesLoaded();
    if (grid) renderCourseGridFromCache();
  } catch {
    if (grid) {
      grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar cursos."}</p>`;
    }
  }
}

/**
 * Solo para la página de contacto: carga JSON y llena el select de cursos.
 */
export async function loadCoursesForContactForm() {
  try {
    await ensureCoursesLoaded();
  } catch {
    const courseSelect = document.getElementById("cf-course");
    if (courseSelect) {
      courseSelect.innerHTML =
        '<option value="">No se pudieron cargar los cursos</option>' +
        '<option value="otro">Otro / consulta general</option>';
    }
  }
}

/**
 * @param {string} filterKey
 */
export function filterCourses(filterKey) {
  activeModalityFilter = filterKey;
  chatHighlightCourseIds = null;
  syncFilterButtonActiveState();
  syncCourseGridVisibility();
  window.dispatchEvent(new CustomEvent("isc-catalog-manual-filter"));
}

/**
 * @param {Record<string, unknown> | null | undefined} actions
 */
export function applyCatalogActions(actions) {
  const a = actions || {};
  const ca = /** @type {Record<string, unknown>} */ (a);

  if (ca.show_all_courses === true) {
    activeModalityFilter = "all";
    chatHighlightCourseIds = null;
    syncFilterButtonActiveState();
    syncCourseGridVisibility();
    return;
  }

  if (ca.set_modality_filter != null && ca.set_modality_filter !== "") {
    const m = String(ca.set_modality_filter);
    if (
      m === "all" ||
      m === "Presencial" ||
      m === "Virtual" ||
      m === "Semipresencial" ||
      m === "coming_soon"
    ) {
      activeModalityFilter = m;
      syncFilterButtonActiveState();
    }
  }

  if ("highlight_course_ids" in ca) {
    if (Array.isArray(ca.highlight_course_ids)) {
      const ids = ca.highlight_course_ids.map((x) => String(x)).filter(Boolean);
      if (ids.length === 0) {
        chatHighlightCourseIds = null;
      } else {
        const valid = new Set(getCourses().map((c) => String(c.id || "")));
        const filtered = ids.filter((id) => valid.has(id));
        chatHighlightCourseIds = filtered.length ? filtered : null;
      }
    } else {
      chatHighlightCourseIds = null;
    }
  }

  syncCourseGridVisibility();
}

export function resetAssistantCatalogView() {
  activeModalityFilter = "all";
  chatHighlightCourseIds = null;
  syncFilterButtonActiveState();
  syncCourseGridVisibility();
}

export function initCourseFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";
      filterCourses(filter);
    });
  });
}
