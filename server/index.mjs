/**
 * Servidor Express: sitio estático + POST /api/chat (Gemini).
 */
import "dotenv/config";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  filterCourseIdsToValid,
  parseModelChatJson,
} from "../js/features/chatApiResponse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_BODY_BYTES = 32 * 1024;
const GEMINI_TIMEOUT_MS = 45_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;

/**
 * @param {unknown} raw
 * @returns {{ role: string, content: string }[]}
 */
function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = String(/** @type {Record<string, unknown>} */ (m).role || "");
    const content = String(/** @type {Record<string, unknown>} */ (m).content || "").slice(
      0,
      MAX_MESSAGE_CHARS
    );
    if (!content) continue;
    if (role !== "user" && role !== "assistant") continue;
    out.push({ role, content });
  }
  return out.slice(-MAX_MESSAGES);
}

async function loadJson(relPath) {
  const full = path.join(ROOT, ...relPath.split("/"));
  const buf = await fs.readFile(full, "utf8");
  return JSON.parse(buf);
}

function buildSystemPrompt(kb, courses, instructors) {
  const schemaHint = `Responde SOLO con un objeto JSON (sin markdown) con esta forma exacta:
{
  "reply": "texto en español para el usuario",
  "in_scope": true o false,
  "catalog_actions": {
    "set_modality_filter": null o "all" o "Presencial" o "Virtual" o "Semipresencial" o "coming_soon",
    "highlight_course_ids": null o array de strings con ids existentes en cursos,
    "show_all_courses": true o false
  }
}

Reglas de catalog_actions:
- Si el usuario busca un curso que SÍ existe: in_scope true, show_all_courses false, highlight_course_ids con los id exactos del catálogo, y set_modality_filter alineado al curso (modalidad del curso) o "all" si aplica a varios.
- Si el curso NO existe en el JSON: in_scope true, mensaje claro, show_all_courses true, highlight_course_ids null, set_modality_filter "all".
- Si el usuario pide ver todos / limpiar / reiniciar: show_all_courses true, highlight_course_ids null, set_modality_filter "all".
- Preguntas solo de gestores o programa sin cambiar el catálogo: show_all_courses false, highlight_course_ids null, set_modality_filter null (no cambies modalidad) salvo que el usuario pida filtrar cursos explícitamente.
- Fuera de los tres dominios permitidos: in_scope false, reply exactamente el texto de políticas.off_topic_reply del JSON de conocimiento, catalog_actions neutras: show_all_courses false, highlight_course_ids null, set_modality_filter null.

No inventes cursos ni personas. Usa únicamente los datos en KNOWLEDGE_BASE, COURSES e INSTRUCTORS. Si status es coming_soon, indícalo. Si preguntan precios, resume los cuatro segmentos en COP según el curso. Sugiere gestores.html para más detalle de docentes y programa.html para el programa.`;

  return [
    "Eres el asistente oficial del portafolio de educación continuada del programa ISC, Universidad de Cundinamarca, Seccional Ubaté.",
    schemaHint,
    "KNOWLEDGE_BASE:",
    JSON.stringify(kb),
    "COURSES:",
    JSON.stringify(courses),
    "INSTRUCTORS:",
    JSON.stringify(instructors),
  ].join("\n\n");
}

/**
 * @param {{ role: string, content: string }[]} messages
 */
function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

async function callGemini(systemText, messages) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !String(key).trim()) {
    throw new Error("GEMINI_API_KEY no configurada");
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const body = {
    systemInstruction: {
      parts: [{ text: systemText }],
    },
    contents: toGeminiContents(messages),
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": String(key).trim(),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => (p && p.text ? String(p.text) : "")).join("")
      : "";
    if (!text.trim()) {
      throw new Error("Respuesta vacía del modelo");
    }
    return text;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const app = express();
  app.disable("x-powered-by");

  app.use(express.static(ROOT, { index: ["index.html"] }));

  app.post(
    "/api/chat",
    express.json({ limit: MAX_BODY_BYTES }),
    async (req, res) => {
      try {
        const messages = normalizeMessages(req.body?.messages);
        if (
          messages.length === 0 ||
          messages[messages.length - 1].role !== "user"
        ) {
          res
            .status(400)
            .json({ error: "Se requiere al menos un mensaje de usuario." });
          return;
        }

        const [kb, courses, instructors] = await Promise.all([
          loadJson("data/chatbot/knowledge-base.json"),
          loadJson("data/courses.json"),
          loadJson("data/instructors.json"),
        ]);

        if (!Array.isArray(courses) || !Array.isArray(instructors)) {
          res.status(500).json({ error: "Datos de catálogo inválidos" });
          return;
        }

        const validCourseIds = new Set(courses.map((c) => String(c.id || "")));
        const systemText = buildSystemPrompt(kb, courses, instructors);
        const raw = await callGemini(systemText, messages);
        const parsed = parseModelChatJson(raw);

        const ca = parsed.catalog_actions;
        if (ca.show_all_courses) {
          ca.highlight_course_ids = null;
          ca.set_modality_filter = "all";
        } else if (ca.highlight_course_ids) {
          ca.highlight_course_ids = filterCourseIdsToValid(
            ca.highlight_course_ids,
            validCourseIds
          );
        }

        res.json({
          reply: parsed.reply,
          in_scope: parsed.in_scope,
          catalog_actions: ca,
        });
      } catch {
        res.status(502).json({
          error: "No se pudo obtener una respuesta válida del asistente.",
        });
      }
    }
  );

  app.listen(PORT, () => {
    process.stdout.write(
      `Servidor ISC en http://localhost:${PORT} (estáticos + /api/chat)\n`
    );
  });
}

main().catch((e) => {
  process.stderr.write(String(e instanceof Error ? e.message : e) + "\n");
  process.exit(1);
});
