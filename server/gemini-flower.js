import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REFERENCE_FILES = Array.from({ length: 10 }, (_, i) => `${i + 1}.png`);

const DEFAULT_MODEL = "gemini-2.5-flash-image";

let referencePartsCache = null;

function resolveAssetsDir() {
  const candidates = [
    path.join(__dirname, "assets"),
    path.join(process.cwd(), "server", "assets"),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, REFERENCE_FILES[0]))) {
      return dir;
    }
  }

  throw new Error("Gemini reference images not found in server/assets.");
}

function loadReferenceParts() {
  if (referencePartsCache) return referencePartsCache;

  referencePartsCache = REFERENCE_FILES.map((file) => {
    const filePath = path.join(resolveAssetsDir(), file);
    const data = fs.readFileSync(filePath).toString("base64");
    return {
      inlineData: {
        mimeType: "image/png",
        data,
      },
    };
  });

  return referencePartsCache;
}

function hexToColorName(hex) {
  const h = hex.replace("#", "").toLowerCase();
  const map = {
    ef4444: "vibrant red",
    f97316: "vibrant orange",
    facc15: "sunny yellow",
    "22c55e": "fresh green",
    "3b82f6": "bright blue",
    a855f7: "rich purple",
    ec4899: "hot pink",
    "14b8a6": "teal",
    f472b6: "soft rose",
    ffffff: "white",
  };
  return map[h] ?? `color ${hex}`;
}

function buildPrompt({ name, color, message }) {
  const colorName = hexToColorName(color);
  const trimmedMessage = message.trim() || "a quiet moment of growth";

  return `You are given ${REFERENCE_FILES.length} reference images of watercolor flower blooms. Study their shared art style carefully.

Generate ONE new single flower illustration that matches this style:
- Hand-painted watercolor on paper: soft bleeding edges, wet-on-wet washes, visible paper texture, no hard ink outlines
- Top-down (overhead) view of one isolated bloom only — no stem, no leaves, no vase, no scenery
- Dominant petal colors in ${colorName} (${color}), vibrant and saturated like the references
- Unique petal shape and center detail — do not copy any reference flower exactly
- Centered composition with comfortable padding around the bloom
- Clear, defined petal edges suitable for compositing onto a 3D grass field

This flower is a personal tribute for "${name}". Let the mood reflect this short message: "${trimmedMessage}"

CRITICAL BACKGROUND: Use a perfectly flat, solid pure white background (#FFFFFF) behind the flower only. No gradients, no shadows on the background, no texture outside the bloom.`;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export async function generateFlower({ name, color, message, env = process.env }) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to .env.local for local dev or Vercel env vars for production.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = env.GEMINI_IMAGE_MODEL || DEFAULT_MODEL;
  const prompt = buildPrompt({ name, color, message });
  const references = loadReferenceParts();

  const response = await ai.models.generateContent({
    model,
    contents: [{ text: prompt }, ...references],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts =
    response.candidates?.[0]?.content?.parts ?? response.parts ?? [];
  let imageBase64 = null;
  let mimeType = "image/png";
  const textParts = [];

  for (const part of parts) {
    if (part.text) textParts.push(part.text);
    if (part.inlineData?.data) {
      imageBase64 = part.inlineData.data;
      mimeType = part.inlineData.mimeType || mimeType;
    }
  }

  if (!imageBase64) {
    const err = new Error(
      "Gemini did not return an image. Try again or switch GEMINI_IMAGE_MODEL.",
    );
    err.model = model;
    err.text = textParts.join("\n");
    throw err;
  }

  return {
    image: imageBase64,
    mimeType,
    model,
    prompt,
    text: textParts.join("\n"),
  };
}

export function createGeminiFlowerMiddleware(env) {
  return async (req, res, next) => {
    if (req.method !== "POST") {
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.end();
        return;
      }
      return next();
    }

    try {
      const body = await readJsonBody(req);
      const name = String(body.name ?? "").trim();
      const color = String(body.color ?? "#a855f7").trim();
      const message = String(body.message ?? "").trim();

      if (!name) {
        sendJson(res, 400, { error: "Name is required." });
        return;
      }

      const result = await generateFlower({ name, color, message, env });
      sendJson(res, 200, result);
    } catch (err) {
      console.error("[gemini-flower]", err);
      sendJson(res, err.model ? 502 : 500, {
        error: err.message || "Flower generation failed.",
        model: err.model,
        text: err.text,
      });
    }
  };
}
