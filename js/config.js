/**
 * Rutas de datos y textos centralizados (escalable para nuevos endpoints).
 */
export const CONFIG = {
  /** Rutas de vistas (MPA); mantener alineadas con el navbar en cada HTML. */
  routes: {
    home: "index.html",
    programa: "programa.html",
    cursos: "cursos.html",
    gestores: "gestores.html",
    contacto: "contacto.html",
  },
  data: {
    instructors: "data/instructors.json",
    courses: "data/courses.json",
  },
  /** Formspree — educación continua ISC Ubaté */
  formspree: {
    endpoint: "https://formspree.io/f/xojreznl",
  },
  /** POST al mismo origen cuando se usa `npm start` (Express). */
  chatApiUrl: "/api/chat",
  ui: {
    courseGridEmptyDefault: "No hay cursos que coincidan con el filtro.",
    comingSoonEmpty:
      "Por ahora no hay cursos en estado próximamente. Consulte el catálogo disponible.",
  },
};
