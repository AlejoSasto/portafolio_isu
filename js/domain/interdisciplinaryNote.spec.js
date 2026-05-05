import { describe, expect, it } from "vitest";
import { buildInterdisciplinarySectionsHtml } from "./interdisciplinaryNote.js";

describe("buildInterdisciplinarySectionsHtml", () => {
  it("devuelve cadena vacía si no es un arreglo", () => {
    expect(buildInterdisciplinarySectionsHtml(null)).toBe("");
    expect(buildInterdisciplinarySectionsHtml(undefined)).toBe("");
    expect(buildInterdisciplinarySectionsHtml({})).toBe("");
  });

  it("devuelve cadena vacía si nadie tiene interdisciplinary true", () => {
    const instructors = [
      { id: "a", name: "Uno", interdisciplinary: false },
      { id: "b", name: "Dos" },
    ];
    expect(buildInterdisciplinarySectionsHtml(instructors)).toBe("");
  });

  it("usa interdisciplinary_note cuando está definida", () => {
    const html = buildInterdisciplinarySectionsHtml([
      {
        id: "inst_013",
        name: "Milton",
        interdisciplinary: true,
        interdisciplinary_note: "Nota <script>x</script> institucional.",
      },
    ]);
    expect(html).toContain("Nota &lt;script&gt;x&lt;/script&gt; institucional.");
    expect(html).not.toContain("<script>");
  });

  it("usa texto por defecto con el nombre si falta la nota", () => {
    const html = buildInterdisciplinarySectionsHtml([
      {
        id: "x",
        name: "María Pérez",
        interdisciplinary: true,
      },
    ]);
    expect(html).toContain("María Pérez");
    expect(html).toContain("otro programa académico");
  });

  it("combina varios gestores marcados", () => {
    const html = buildInterdisciplinarySectionsHtml([
      {
        id: "1",
        name: "A",
        interdisciplinary: true,
        interdisciplinary_note: "Primera nota.",
      },
      { id: "2", name: "B", interdisciplinary: true },
    ]);
    expect(html.split("institutional-note__paragraph").length).toBe(3);
    expect(html).toContain("Primera nota.");
    expect(html).toContain("B");
  });
});
