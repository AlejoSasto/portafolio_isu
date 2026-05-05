import { CONFIG } from "../config.js";
import {
  applyCatalogActions,
  resetAssistantCatalogView,
} from "./catalog.js";

/** @typedef {{ role: "user" | "assistant", content: string }} ChatMessage */

/** @type {ChatMessage[]} */
let transcript = [];

/**
 * @param {HTMLElement} root
 * @param {string} role
 * @param {string} text
 */
function appendMessage(root, role, text) {
  const wrap = document.createElement("div");
  wrap.className =
    role === "user"
      ? "course-chat-msg course-chat-msg--user"
      : "course-chat-msg course-chat-msg--bot";
  const bubble = document.createElement("div");
  bubble.className = "course-chat-bubble";
  bubble.textContent = text;
  wrap.appendChild(bubble);
  root.appendChild(wrap);
  root.scrollTop = root.scrollHeight;
}

/**
 * @param {HTMLElement} root
 */
function showTyping(root) {
  const wrap = document.createElement("div");
  wrap.className = "course-chat-msg course-chat-msg--bot course-chat-typing";
  wrap.id = "courseChatTyping";
  wrap.setAttribute("aria-hidden", "true");
  const dots = document.createElement("div");
  dots.className = "course-chat-typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";
  wrap.appendChild(dots);
  root.appendChild(wrap);
  root.scrollTop = root.scrollHeight;
}

function removeTyping() {
  document.getElementById("courseChatTyping")?.remove();
}

/**
 * @param {Record<string, unknown>} actions
 */
function updateAssistantFilterBar(actions) {
  const bar = document.getElementById("chat-assistant-filter-bar");
  const label = document.getElementById("chat-assistant-filter-label");
  if (!bar || !label) return;

  const ca = actions || {};
  const showAll = ca.show_all_courses === true;
  const highlights = Array.isArray(ca.highlight_course_ids)
    ? ca.highlight_course_ids
    : [];
  const mod = ca.set_modality_filter != null ? String(ca.set_modality_filter) : null;

  if (showAll) {
    bar.hidden = true;
    return;
  }

  if (highlights.length > 0) {
    label.textContent =
      "Mostrando los cursos que el asistente identificó en el catálogo.";
    bar.hidden = false;
    return;
  }

  if (mod && mod !== "all") {
    label.textContent = `Filtro de modalidad aplicado por el asistente: ${mod}.`;
    bar.hidden = false;
    return;
  }

  bar.hidden = true;
}

function hideAssistantFilterBar() {
  const bar = document.getElementById("chat-assistant-filter-bar");
  if (bar) bar.hidden = true;
}

/**
 * @returns {Promise<string>}
 */
async function loadWelcomeText() {
  try {
    const res = await fetch("data/chatbot/knowledge-base.json");
    if (!res.ok) throw new Error("kb");
    const kb = await res.json();
    const w = kb?.ux_copy?.welcome;
    if (typeof w === "string" && w.trim()) return w.trim();
  } catch {
    /* fallback */
  }
  return "Puedo orientarte sobre cursos de educación continuada, gestores del conocimiento e información del programa ISC. ¿En qué te puedo ayudar?";
}

export function initCourseChatbot() {
  const form = document.getElementById("courseChatForm");
  const input = document.getElementById("courseChatInput");
  const sendBtn = document.getElementById("courseChatSend");
  const messagesEl = document.getElementById("courseChatMessages");
  const clearBarBtn = document.getElementById("chat-assistant-filter-clear");

  if (!form || !input || !sendBtn || !messagesEl) return;

  window.addEventListener("isc-catalog-manual-filter", () => {
    hideAssistantFilterBar();
  });

  clearBarBtn?.addEventListener("click", () => {
    resetAssistantCatalogView();
    hideAssistantFilterBar();
  });

  loadWelcomeText().then((welcome) => {
    transcript = [{ role: "assistant", content: welcome }];
    appendMessage(messagesEl, "assistant", welcome);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(messagesEl, "user", text);
    transcript.push({ role: "user", content: text });
    input.value = "";
    sendBtn.disabled = true;
    showTyping(messagesEl);

    try {
      const res = await fetch(CONFIG.chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcript }),
      });

      const raw = await res.json().catch(() => ({}));
      removeTyping();

      if (!res.ok) {
        const err =
          typeof raw.error === "string"
            ? raw.error
            : "No se pudo contactar al asistente. ¿Ejecutó el servidor con npm start y configuró GEMINI_API_KEY?";
        appendMessage(messagesEl, "assistant", err);
        transcript.push({ role: "assistant", content: err });
        return;
      }

      const reply = typeof raw.reply === "string" ? raw.reply : "";
      const actions =
        raw.catalog_actions && typeof raw.catalog_actions === "object"
          ? raw.catalog_actions
          : {};

      appendMessage(messagesEl, "assistant", reply);
      transcript.push({ role: "assistant", content: reply });

      applyCatalogActions(actions);
      updateAssistantFilterBar(actions);

      if (transcript.length > 24) {
        transcript = transcript.slice(-24);
      }
    } catch {
      removeTyping();
      const err = "Error de red al contactar al asistente.";
      appendMessage(messagesEl, "assistant", err);
      transcript.push({ role: "assistant", content: err });
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  });

}
