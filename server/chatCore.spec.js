import { describe, expect, it } from "vitest";
import { loadCatalog, normalizeMessages } from "./chatCore.mjs";

describe("normalizeMessages", () => {
  it("filtra roles y recorta longitud", () => {
    const out = normalizeMessages([
      { role: "user", content: "hola" },
      { role: "system", content: "x" },
      { role: "assistant", content: "ok" },
    ]);
    expect(out.map((m) => m.role)).toEqual(["user", "assistant"]);
  });

  it("devuelve vacío si no es arreglo", () => {
    expect(normalizeMessages(null)).toEqual([]);
  });
});

describe("loadCatalog", () => {
  it("usa JSON embebido si projectRoot no tiene data/ (p. ej. serverless sin archivos)", async () => {
    const { courses, instructors, kb } = await loadCatalog(
      "/__no_existe_portafolio_data__/999"
    );
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
    expect(Array.isArray(instructors)).toBe(true);
    expect(kb && typeof kb === "object").toBe(true);
  });
});
