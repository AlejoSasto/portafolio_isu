import { CONFIG } from "../config.js";

/**
 * Resuelve qué ítem del menú principal debe marcarse según la URL.
 * Pensado para pruebas y para rutas bajo subcarpeta (solo importa el último segmento).
 *
 * @param {string} pathname
 * @returns {"home"|"programa"|"cursos"|"gestores"|"contacto"|null}
 */
export function getActiveNavKey(pathname) {
  const normalized = String(pathname || "").replace(/\\/g, "/");
  const segments = normalized.split("/").filter(Boolean);
  let last = segments.length ? segments[segments.length - 1] : "";

  if (!last || last === "") {
    return "home";
  }

  const lower = last.toLowerCase();
  if (lower === "index.html" || lower === "") {
    return "home";
  }

  const map = new Map(
    Object.entries(CONFIG.routes).map(([key, file]) => [file.toLowerCase(), key])
  );
  const hit = map.get(lower);
  if (hit) return /** @type {"home"|"programa"|"cursos"|"gestores"|"contacto"} */ (hit);

  /* Sitio servido bajo subruta (p. ej. GitHub Pages: /repo/ → último segmento sin .html). */
  if (segments.length === 1 && !lower.endsWith(".html")) {
    return "home";
  }

  return null;
}

/**
 * Marca el enlace activo en el navbar según `location.pathname`.
 */
export function initActiveNav() {
  const key = getActiveNavKey(
    typeof window !== "undefined" ? window.location.pathname : ""
  );
  if (!key) return;

  document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
    const el = /** @type {HTMLAnchorElement} */ (a);
    const navKey = el.getAttribute("data-nav");
    const isActive = navKey === key;
    el.classList.toggle("active", isActive);
    if (isActive) {
      el.setAttribute("aria-current", "page");
    } else {
      el.removeAttribute("aria-current");
    }
  });
}
