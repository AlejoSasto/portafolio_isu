/**
 * Punto de entrada — Educación Continuada · Universidad de Cundinamarca · ISC Ubaté.
 * Requiere servidor HTTP (módulos ES + fetch).
 */
import { initPricingModal } from "./features/pricingModal.js";
import {
  initCourseFilters,
  loadCourses,
  loadInstructors,
} from "./features/catalog.js";
import { initNavigation } from "./features/navigation.js";
import { initProfileTabs } from "./features/profileTabs.js";
import { initScrollReveal } from "./features/scrollReveal.js";
import { initBackToTop } from "./features/backToTop.js";
import { initContactForm } from "./features/contactForm.js";

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", async () => {
  initYear();
  initNavigation();
  initPricingModal();
  initCourseFilters();
  initProfileTabs();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  await loadInstructors();
  await loadCourses();
});
