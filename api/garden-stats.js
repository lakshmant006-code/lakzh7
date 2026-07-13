import {
  getGardenSessionCount,
  incrementGardenSessionCount,
} from "../server/supabase-garden-stats.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      const sessionCount = await getGardenSessionCount(process.env);
      return res.status(200).json({ sessionCount });
    }

    if (req.method === "POST") {
      const sessionCount = await incrementGardenSessionCount(process.env);
      return res.status(200).json({ sessionCount });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("[api/garden-stats]", err);
    return res.status(500).json({
      error: err.message || "Garden stats failed.",
    });
  }
}
