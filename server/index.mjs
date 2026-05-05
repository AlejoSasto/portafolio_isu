/**
 * Servidor Express: sitio estático + POST /api/chat (Gemini).
 */
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  ChatRequestError,
  handleChatRequest,
  MAX_BODY_BYTES,
} from "./chatCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  const app = express();
  app.disable("x-powered-by");

  app.use(express.static(ROOT, { index: ["index.html"] }));

  app.post(
    "/api/chat",
    express.json({ limit: MAX_BODY_BYTES }),
    async (req, res) => {
      try {
        const out = await handleChatRequest(ROOT, req.body);
        res.json(out);
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
