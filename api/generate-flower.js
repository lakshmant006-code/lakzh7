import { generateFlower } from "../server/gemini-flower.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { name, color, message } = req.body ?? {};
    const trimmedName = String(name ?? "").trim();

    if (!trimmedName) {
      return res.status(400).json({ error: "Name is required." });
    }

    const result = await generateFlower({
      name: trimmedName,
      color: String(color ?? "#a855f7").trim(),
      message: String(message ?? "").trim(),
      env: process.env,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("[api/generate-flower]", err);
    return res.status(err.model ? 502 : 500).json({
      error: err.message || "Flower generation failed.",
      model: err.model,
      text: err.text,
    });
  }
}
