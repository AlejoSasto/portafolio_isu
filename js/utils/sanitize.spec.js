import { describe, expect, it } from "vitest";
import { escapeAttr, escapeHtml, formatMultiline } from "./sanitize.js";

describe("escapeHtml", () => {
  it("escapa caracteres HTML especiales", () => {
    expect(escapeHtml('<a href="x">y & z</a>')).toBe(
      "&lt;a href=\"x\"&gt;y &amp; z&lt;/a&gt;"
    );
  });

  it("devuelve cadena vacía para entrada vacía", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("escapeAttr", () => {
  it("escapa comillas y ampersands para uso en atributos", () => {
    expect(escapeAttr('say "hi" & \'bye\'')).toBe(
      "say &quot;hi&quot; &amp; &#39;bye&#39;"
    );
  });
});

describe("formatMultiline", () => {
  it("escapa y convierte saltos de línea en br", () => {
    expect(formatMultiline("a\n<b>")).toBe("a<br>&lt;b&gt;");
  });
});
