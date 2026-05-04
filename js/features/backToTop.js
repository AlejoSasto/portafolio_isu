export function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  });
  btn.addEventListener("click", () => {
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  });
}
