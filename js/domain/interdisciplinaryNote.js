import { escapeHtml } from "../utils/sanitize.js";

/**
 * Texto por defecto cuando `interdisciplinary` es verdadero sin nota propia.
 *
 * @param {Record<string, unknown>} instructor
 * @returns {string}
 */
function defaultInterdisciplinaryCopy(instructor) {
  const name =
    instructor && instructor.name != null ? String(instructor.name).trim() : "";
  const subject = name || "Este gestor";
  return (
    `${subject} pertenece a otro programa académico y participa en trabajo ` +
    `colaborativo con gestores de otras disciplinas.`
  );
}

/**
 * Genera HTML escapado para el bloque institucional de contexto interdisciplinar.
 *
 * @param {unknown} instructors
 * @returns {string}
 */
export function buildInterdisciplinarySectionsHtml(instructors) {
  if (!Array.isArray(instructors)) {
    return "";
  }

  const flagged = instructors.filter(
    (inst) =>
      inst &&
      typeof inst === "object" &&
      /** @type {Record<string, unknown>} */ (inst).interdisciplinary === true
  );

  if (flagged.length === 0) {
    return "";
  }

  return flagged
    .map((raw) => {
      const inst = /** @type {Record<string, unknown>} */ (raw);
      const custom =
        typeof inst.interdisciplinary_note === "string"
          ? inst.interdisciplinary_note.trim()
          : "";
      const text = custom || defaultInterdisciplinaryCopy(inst);
      return `<p class="institutional-note__paragraph">${escapeHtml(text)}</p>`;
    })
    .join("");
}
