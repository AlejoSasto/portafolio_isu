import { getInstructorsByCourse } from "../domain/instructorRelations.js";
import { escapeHtml, escapeAttr } from "../utils/sanitize.js";

/**
 * @param {Record<string, unknown>} course
 * @param {Array<Record<string, unknown>>} instructors
 * @returns {string}
 */
export function renderCourseCard(course, instructors) {
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
    : `<button type="button" class="btn btn-secondary" data-open-pricing="${escapeAttr(
        id
      )}">Ver precios</button>`;

  const icon = title.slice(0, 1).toUpperCase();

  return `
    <article class="course-card" data-id="${escapeAttr(id)}" data-modality="${escapeAttr(
    modality
  )}" data-status="${escapeAttr(status)}">
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
          <a class="btn btn-primary" href="contacto.html">Inscribirme</a>
        </div>
      </div>
    </article>
  `;
}
