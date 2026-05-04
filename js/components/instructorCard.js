import { escapeHtml, escapeAttr, formatMultiline } from "../utils/sanitize.js";
import { getInitials } from "../utils/format.js";

/**
 * @param {Record<string, unknown>} inst
 * @returns {string}
 */
export function renderInstructorCard(inst) {
  const id = String(inst.id || "");
  const name = String(inst.name || "");
  const title = String(inst.title || "");
  const spec = String(inst.specialization || "");
  const masters = String(inst.masters || "").trim();
  const formation = String(inst.formation || "").trim();
  const strengths = String(inst.strengths || "").trim();
  const profile = String(inst.profile || "").trim();
  const email = String(inst.email || "").trim();
  const cvlac = String(inst.cvlac || "").trim();
  const photo = String(inst.photo || "");
  const initials = getInitials(name);

  const mastersRow = masters
    ? `<p class="instructor-meta"><strong>Maestría / posgrado:</strong> ${escapeHtml(masters)}</p>`
    : "";

  const detailParts = [];
  if (formation) {
    detailParts.push(
      `<div class="instructor-block"><strong>Formación académica</strong><div class="instructor-pre">${formatMultiline(formation)}</div></div>`
    );
  }
  if (strengths) {
    detailParts.push(
      `<div class="instructor-block"><strong>Áreas de fortaleza</strong><div class="instructor-pre">${formatMultiline(strengths)}</div></div>`
    );
  }
  if (profile) {
    detailParts.push(
      `<div class="instructor-block"><strong>Perfil</strong><div class="instructor-pre">${formatMultiline(profile)}</div></div>`
    );
  }
  const linkParts = [];
  if (email) {
    linkParts.push(
      `<a class="instructor-link" href="mailto:${escapeAttr(email)}">Correo electrónico</a>`
    );
  }
  if (cvlac) {
    linkParts.push(
      `<a class="instructor-link" href="${escapeAttr(cvlac)}" target="_blank" rel="noopener noreferrer">CvLAC</a>`
    );
  }
  if (linkParts.length > 0) {
    detailParts.push(`<p class="instructor-link-row">${linkParts.join(" · ")}</p>`);
  }

  const detailHtml =
    detailParts.length > 0
      ? `<details class="instructor-more"><summary>Ver perfil completo</summary><div class="instructor-detail">${detailParts.join("")}</div></details>`
      : "";

  return `
    <article class="instructor-card" data-id="${escapeAttr(id)}">
      <div class="instructor-photo-wrap">
        <img class="instructor-photo" src="${escapeAttr(photo)}" alt="" width="88" height="88" loading="lazy" data-initials="${escapeAttr(initials)}">
        <div class="instructor-initials" aria-hidden="true">${escapeHtml(initials)}</div>
      </div>
      <h3 class="instructor-name">${escapeHtml(name)}</h3>
      <p class="instructor-meta"><strong>Formación principal:</strong> ${escapeHtml(title)}</p>
      <p class="instructor-meta"><strong>Especialización:</strong> ${escapeHtml(spec)}</p>
      ${mastersRow}
      ${detailHtml}
    </article>
  `;
}

export function wireInstructorPhotos() {
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
  });
}
