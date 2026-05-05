import { describe, expect, it } from "vitest";
import {
  filterCourseIdsToValid,
  parseModelChatJson,
  stripJsonFences,
} from "./chatApiResponse.js";

describe("stripJsonFences", () => {
  it("elimina cercas markdown json", () => {
    const raw = "```json\n{\"a\":1}\n```";
    expect(stripJsonFences(raw)).toBe('{"a":1}');
  });
});

describe("parseModelChatJson", () => {
  it("parsea respuesta mínima válida", () => {
    const text = JSON.stringify({
      reply: "Hola",
      in_scope: true,
      catalog_actions: {
        set_modality_filter: null,
        highlight_course_ids: ["course_001"],
        show_all_courses: false,
      },
    });
    const r = parseModelChatJson(text);
    expect(r.reply).toBe("Hola");
    expect(r.in_scope).toBe(true);
    expect(r.catalog_actions.highlight_course_ids).toEqual(["course_001"]);
    expect(r.catalog_actions.show_all_courses).toBe(false);
  });

  it("normaliza modalidad inválida a null", () => {
    const text = JSON.stringify({
      reply: "x",
      in_scope: true,
      catalog_actions: {
        set_modality_filter: "Otro",
        highlight_course_ids: null,
        show_all_courses: false,
      },
    });
    const r = parseModelChatJson(text);
    expect(r.catalog_actions.set_modality_filter).toBeNull();
  });

  it("convierte array vacío de ids en null", () => {
    const text = JSON.stringify({
      reply: "x",
      in_scope: true,
      catalog_actions: {
        set_modality_filter: null,
        highlight_course_ids: [],
        show_all_courses: false,
      },
    });
    const r = parseModelChatJson(text);
    expect(r.catalog_actions.highlight_course_ids).toBeNull();
  });
});

describe("filterCourseIdsToValid", () => {
  it("filtra ids contra el conjunto válido", () => {
    const s = new Set(["a", "b"]);
    expect(filterCourseIdsToValid(["a", "z"], s)).toEqual(["a"]);
    expect(filterCourseIdsToValid(["z"], s)).toBeNull();
  });
});
