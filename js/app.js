/**
 * Punto de entrada — Educación Continuada · Universidad de Cundinamarca · ISC Ubaté.
 * Requiere servidor HTTP (módulos ES + fetch).
 */
import { initPricingModal } from "./features/pricingModal.js";
import {
  initCourseFilters,
  loadCourses,
  loadCoursesForContactForm,
  loadInstructors,
} from "./features/catalog.js";
import { initNavigation } from "./features/navigation.js";
import { initProfileTabs } from "./features/profileTabs.js";
import { initScrollReveal } from "./features/scrollReveal.js";
import { initBackToTop } from "./features/backToTop.js";
import { initContactForm } from "./features/contactForm.js";
import { initActiveNav } from "./features/activeNav.js";

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/** @returns {string} */
function getPageKey() {
  return document.body?.dataset?.page || "home";
}

document.addEventListener("DOMContentLoaded", async () => {
  initYear();
  initNavigation();
  initActiveNav();

  const page = getPageKey();

  initBackToTop();
  initScrollReveal();

  if (page === "programa") {
    initProfileTabs();
  }

  if (page === "cursos") {
    initPricingModal();
    initCourseFilters();
    await loadInstructors();
    await loadCourses();
  }

  if (page === "gestores") {
    await loadInstructors();
  }

  if (page === "contacto") {
    initContactForm();
    await loadCoursesForContactForm();
  }
});
