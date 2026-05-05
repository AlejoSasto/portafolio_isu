import { describe, expect, it } from "vitest";
import { normalizeMessages } from "./chatCore.mjs";

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
