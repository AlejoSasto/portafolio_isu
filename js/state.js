/**
 * Estado mínimo de la app (caché en memoria tras fetch).
 * Sustituible por otro store sin cambiar las vistas.
 */

/** @type {Array<Record<string, unknown>>} */
let instructors = [];
/** @type {Array<Record<string, unknown>>} */
let courses = [];

export function getInstructors() {
  return instructors;
}

export function setInstructors(data) {
  instructors = Array.isArray(data) ? data : [];
}

export function getCourses() {
  return courses;
}

export function setCourses(data) {
  courses = Array.isArray(data) ? data : [];
}
