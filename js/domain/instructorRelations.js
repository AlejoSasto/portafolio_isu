/**
 * Reglas de dominio: relación curso ↔ gestores (join simulado desde JSON).
 * @param {string} courseId
 * @param {Array<Record<string, unknown>>} instructorList
 * @returns {Array<Record<string, unknown>>}
 */
export function getInstructorsByCourse(courseId, instructorList) {
  return instructorList.filter((inst) => {
    const courses = inst.courses;
    return Array.isArray(courses) && courses.includes(courseId);
  });
}
