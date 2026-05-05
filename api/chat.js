/**
 * Vercel Serverless Function: POST /api/chat
 */
import path from "path";
import { fileURLToPath } from "url";
import {
  ChatRequestError,
  handleChatRequest,
  MAX_BODY_BYTES,
} from "../server/chatCore.mjs";

const PROJECT_ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

/**
 * @param {import("http").IncomingMessage} req
 * @param {number} limit
 * @returns {Promise<string>}
 */
function readStreamBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("payload too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

/**
 * @param {import("http").IncomingMessage} req
 * @returns {Promise<Record<string, unknown>>}
 */
async function parseJsonBody(req) {
  if (Buffer.isBuffer(req.body)) {
    const text = req.body.toString("utf8", 0, MAX_BODY_BYTES);
    return JSON.parse(text);
  }
  if (
    req.body &&
    typeof req.body === "object" &&
    !Buffer.isBuffer(req.body)
  ) {
    return /** @type {Record<string, unknown>} */ (req.body);
  }
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  const text = await readStreamBody(req, MAX_BODY_BYTES);
  return JSON.parse(text);
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  let parsed;
  try {
    parsed = await parseJsonBody(req);
  } catch {
    res
      .status(400)
      .json({ error: "Cuerpo JSON inválido o demasiado grande." });
    return;
  }

  try {
    const out = await handleChatRequest(PROJECT_ROOT, parsed);
    res.status(200).json(out);
  } catch (e) {
    if (e instanceof ChatRequestError) {
      const msg =
        e.statusCode >= 500 &&
        e.code !== "INVALID_DATA" &&
        e.code !== "DATA_READ"
          ? "No se pudo obtener una respuesta válida del asistente."
          : e.message;
      res.status(e.statusCode).json({ error: msg });
      return;
    }
    res.status(502).json({
      error: "No se pudo obtener una respuesta válida del asistente.",
    });
  }
}
