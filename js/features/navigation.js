export function initNavigation() {
  const burger = document.getElementById("navBurger");
  const nav = document.querySelector(".navbar");
  const links = document.getElementById("navLinks");

  burger?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav?.classList.remove("open");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelector(".nav-search")?.addEventListener("click", () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  });
}
