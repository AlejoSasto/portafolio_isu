/** @typedef {{ set_modality_filter: string | null, highlight_course_ids: string[] | null, show_all_courses: boolean }} CatalogActions */

const ALLOWED_MODALITY = new Set([
  "all",
  "Presencial",
  "Virtual",
  "Semipresencial",
  "coming_soon",
]);

/**
 * Quita cercas tipo ```json del modelo.
 * @param {string} raw
 * @returns {string}
 */
export function stripJsonFences(raw) {
  let s = String(raw || "").trim();
  s = s.replace(/^\s*```(?:json)?\s*/i, "");
  s = s.replace(/\s*```\s*$/i, "");
  return s.trim();
}

/**
 * Parsea y normaliza el JSON devuelto por el modelo (post-validación de esquema mínimo).
 * @param {string} rawText
 * @returns {{ reply: string, in_scope: boolean, catalog_actions: CatalogActions }}
 */
export function parseModelChatJson(rawText) {
  const clean = stripJsonFences(rawText);
  const obj = JSON.parse(clean);
  if (typeof obj.reply !== "string") {
    throw new Error("Respuesta inválida: falta reply");
  }
  const in_scope = Boolean(obj.in_scope);
  const ca = obj.catalog_actions && typeof obj.catalog_actions === "object" ? obj.catalog_actions : {};

  let set_modality_filter =
    ca.set_modality_filter === undefined || ca.set_modality_filter === null
      ? null
      : String(ca.set_modality_filter);
  if (set_modality_filter && !ALLOWED_MODALITY.has(set_modality_filter)) {
    set_modality_filter = null;
  }

  let highlight_course_ids = null;
  if (Array.isArray(ca.highlight_course_ids)) {
    const ids = ca.highlight_course_ids.map((x) => String(x)).filter(Boolean);
    highlight_course_ids = ids.length ? ids : null;
  }

  const show_all_courses = Boolean(ca.show_all_courses);

  return {
    reply: obj.reply.trim(),
    in_scope,
    catalog_actions: {
      set_modality_filter,
      highlight_course_ids,
      show_all_courses,
    },
  };
}

/**
 * Valida IDs de curso contra la lista oficial.
 * @param {string[] | null} ids
 * @param {Set<string>} validIds
 * @returns {string[] | null}
 */
export function filterCourseIdsToValid(ids, validIds) {
  if (!ids || ids.length === 0) return null;
  const out = ids.filter((id) => validIds.has(String(id)));
  return out.length ? out : null;
}
