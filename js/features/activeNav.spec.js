import { describe, expect, it } from "vitest";
import { getActiveNavKey } from "./activeNav.js";

describe("getActiveNavKey", () => {
  it("resuelve inicio para pathname vacío o raíz", () => {
    expect(getActiveNavKey("")).toBe("home");
    expect(getActiveNavKey("/")).toBe("home");
  });

  it("resuelve home para index.html", () => {
    expect(getActiveNavKey("/index.html")).toBe("home");
    expect(getActiveNavKey("index.html")).toBe("home");
  });

  it("resuelve vistas por nombre de archivo", () => {
    expect(getActiveNavKey("/programa.html")).toBe("programa");
    expect(getActiveNavKey("/foo/cursos.html")).toBe("cursos");
    expect(getActiveNavKey("gestores.html")).toBe("gestores");
    expect(getActiveNavKey("/repo/contacto.html")).toBe("contacto");
  });

  it("trata subruta única sin .html como home (GitHub Pages)", () => {
    expect(getActiveNavKey("/portafolio_isu")).toBe("home");
  });

  it("devuelve null para archivo desconocido con varios segmentos", () => {
    expect(getActiveNavKey("/app/vista.html")).toBe(null);
  });
});
