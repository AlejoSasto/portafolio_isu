/**
 * Educación Continuada — Universidad de Cundinamarca, Ingeniería de Sistemas y Computación Ubaté.
 */

/** @type {Array<Record<string, unknown>>} */
let instructorsCache = [];
/** @type {Array<Record<string, unknown>>} */
let coursesCache = [];

/**
 * Formatea un valor en pesos colombianos.
 * @param {number|null|undefined} value
 * @returns {string}
 */
function formatCOP(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/**
 * Instructores asociados a un curso (join simulado).
 * @param {string} courseId
 * @param {Array<Record<string, unknown>>} instructors
 * @returns {Array<Record<string, unknown>>}
 */
function getInstructorsByCourse(courseId, instructors) {
  return instructors.filter((inst) => {
    const courses = inst.courses;
    return Array.isArray(courses) && courses.includes(courseId);
  });
}

/**
 * Iniciales a partir del nombre.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * @param {string} courseId
 */
function openPricingModal(courseId) {
  const modal = document.getElementById("pricingModal");
  const titleEl = document.getElementById("modalTitle");
  const nameEl = document.getElementById("modalCourseName");
  const bodyEl = document.getElementById("modalBody");
  if (!modal || !titleEl || !nameEl || !bodyEl) return;

  const course = coursesCache.find((c) => c.id === courseId);
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

function closePricingModal() {
  const modal = document.getElementById("pricingModal");
  if (!modal) return;
  modal.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

/**
 * @param {string} filterKey - 'all' | 'Presencial' | 'Virtual' | 'coming_soon'
 */
function filterCourses(filterKey) {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".course-card");
  cards.forEach((card) => {
    const modality = card.getAttribute("data-modality") || "";
    const status = card.getAttribute("data-status") || "";
    let show = true;
    if (filterKey === "coming_soon") {
      show = status === "coming_soon";
    } else if (filterKey === "Presencial" || filterKey === "Virtual") {
      show = modality === filterKey && status !== "coming_soon";
    } else {
      show = true;
    }
    card.classList.toggle("is-hidden", !show);
  });

  const emptyMsg = grid.getAttribute("data-empty-msg") || "Sin resultados.";
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

/**
 * @param {Record<string, unknown>} inst
 * @returns {string}
 */
function renderInstructorCard(inst) {
  const id = String(inst.id || "");
  const name = String(inst.name || "");
  const title = String(inst.title || "");
  const spec = String(inst.specialization || "");
  const masters = String(inst.masters || "");
  const photo = String(inst.photo || "");
  const initials = getInitials(name);

  return `
    <article class="instructor-card" data-id="${id}">
      <div class="instructor-photo-wrap">
        <img class="instructor-photo" src="${photo}" alt="" width="88" height="88" loading="lazy" data-initials="${initials}">
        <div class="instructor-initials" aria-hidden="true">${initials}</div>
      </div>
      <h3 class="instructor-name">${escapeHtml(name)}</h3>
      <p class="instructor-meta"><strong>Título:</strong> ${escapeHtml(title)}</p>
      <p class="instructor-meta"><strong>Especialización:</strong> ${escapeHtml(spec)}</p>
      <p class="instructor-meta"><strong>Maestría:</strong> ${escapeHtml(masters)}</p>
    </article>
  `;
}

/**
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * @param {Record<string, unknown>} course
 * @param {Array<Record<string, unknown>>} instructors
 * @returns {string}
 */
function renderCourseCard(course, instructors) {
  const id = String(course.id || "");
  const title = String(course.title || "");
  const desc = String(course.description || "");
  const modality = String(course.modality || "");
  const status = String(course.status || "");
  const hours = course.hours && typeof course.hours === "object" ? course.hours : {};
  const total = hours.total;
  const inPerson = hours.in_person;
  const autonomous = hours.autonomous;
  const modules = Array.isArray(course.modules) ? course.modules : [];
  const linked = getInstructorsByCourse(id, instructors);
  const instructorsLine =
    linked.length > 0
      ? `<p class="course-hours"><strong>Gestores:</strong> ${linked
          .map((i) => escapeHtml(String(i.name || "")))
          .join(" · ")}</p>`
      : "";

  const isSoon = status === "coming_soon";
  const badgeStatus = isSoon
    ? '<span class="badge badge-soon">Próximamente</span>'
    : '<span class="badge badge-active">Disponible</span>';

  let hoursHtml = "";
  if (!isSoon && total != null) {
    hoursHtml = `<p class="course-hours"><strong>Horas:</strong> ${total} totales`;
    if (inPerson != null && autonomous != null) {
      hoursHtml += ` (${inPerson} presenciales · ${autonomous} autónomas)`;
    }
    hoursHtml += "</p>";
  } else if (isSoon) {
    hoursHtml = '<p class="course-hours">Carga horaria por definir.</p>';
  }

  let modulesHtml = "";
  if (modules.length > 0) {
    const items = modules
      .slice()
      .sort((a, b) => Number(a.order) - Number(b.order))
      .map(
        (m) =>
          `<li><strong>${escapeHtml(String(m.title || ""))}</strong> — ${escapeHtml(
            String(m.description || "")
          )}</li>`
      )
      .join("");
    modulesHtml = `
      <details class="course-modules">
        <summary>Ver módulos (${modules.length})</summary>
        <ul class="module-list">${items}</ul>
      </details>
    `;
  }

  const priceBtn = isSoon
    ? `<button type="button" class="btn btn-secondary" disabled>Ver precios</button>`
    : `<button type="button" class="btn btn-secondary" data-open-pricing="${escapeHtml(
        id
      )}">Ver precios</button>`;

  const icon = title.slice(0, 1).toUpperCase();

  return `
    <article class="course-card" data-id="${id}" data-modality="${escapeHtml(
    modality
  )}" data-status="${escapeHtml(status)}">
      <div class="course-thumb" aria-hidden="true">${escapeHtml(icon)}</div>
      <div class="course-body">
        <div class="course-badges">
          <span class="badge badge-modality">${escapeHtml(modality)}</span>
          ${badgeStatus}
        </div>
        <h3 class="course-title">${escapeHtml(title)}</h3>
        <p class="course-desc">${escapeHtml(desc)}</p>
        ${instructorsLine}
        ${hoursHtml}
        ${modulesHtml}
        <div class="course-actions">
          ${priceBtn}
          <a class="btn btn-primary" href="#contact">Inscribirme</a>
        </div>
      </div>
    </article>
  `;
}

function wireInstructorPhotos() {
  document.querySelectorAll(".instructor-photo").forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    img.addEventListener("error", () => {
      const card = img.closest(".instructor-card");
      if (card) card.classList.add("is-fallback");
    });
    img.addEventListener("load", () => {
      const card = img.closest(".instructor-card");
      if (card) card.classList.remove("is-fallback");
    });
    if (!img.complete || img.naturalWidth === 0) {
      const card = img.closest(".instructor-card");
      if (card && img.src && !img.src.endsWith("/")) {
        /* defer: error event will fire for missing file */
      }
    }
  });
}

async function loadInstructors() {
  const grid = document.getElementById("instructorGrid");
  if (!grid) return;

  try {
    const res = await fetch("data/instructors.json");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    instructorsCache = data;
    grid.innerHTML = data.map((inst) => renderInstructorCard(inst)).join("");
    wireInstructorPhotos();
  } catch {
    grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar instructores."}</p>`;
  }
}

async function loadCourses() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  try {
    const res = await fetch("data/courses.json");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    coursesCache = data;
    grid.innerHTML = data
      .map((c) => renderCourseCard(c, instructorsCache))
      .join("");

    grid.querySelectorAll("[data-open-pricing]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-open-pricing");
        if (id) openPricingModal(id);
      });
    });

    const courseSelect = document.getElementById("cf-course");
    if (courseSelect) {
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
  } catch {
    grid.innerHTML = `<p class="section-lead">${grid.getAttribute("data-empty-msg") || "Error al cargar cursos."}</p>`;
  }
}

function initFilters() {
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

function initProfileTabs() {
  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.getAttribute("data-panel");
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach((p) => {
        const isMatch = p.id === panelId;
        p.classList.toggle("active", isMatch);
        if (isMatch) {
          p.removeAttribute("hidden");
        } else {
          p.setAttribute("hidden", "");
        }
      });
    });
  });
}

function initNav() {
  const burger = document.getElementById("navBurger");
  const nav = document.querySelector(".navbar");
  const links = document.getElementById("navLinks");

  burger?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav?.classList.remove("open");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelector(".nav-search")?.addEventListener("click", () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  });
}

function initModal() {
  document.getElementById("modalClose")?.addEventListener("click", closePricingModal);
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closePricingModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePricingModal();
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initBackTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  });
  btn.addEventListener("click", () => {
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  });
}

function initContactForm() {
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

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", async () => {
  initYear();
  initNav();
  initModal();
  initFilters();
  initProfileTabs();
  initReveal();
  initBackTop();
  initContactForm();
  await loadInstructors();
  await loadCourses();
});
