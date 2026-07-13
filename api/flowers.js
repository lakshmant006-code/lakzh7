import { listFlowers, saveFlower } from "../server/supabase-flowers.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

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
      const flowers = await listFlowers(process.env);
      return res.status(200).json({ flowers });
    }

    if (req.method === "POST") {
      const { name, image, message } = req.body ?? {};
      const flower = await saveFlower({ name, image, message }, process.env);
      return res.status(201).json({ flower });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("[api/flowers]", err);
    return res.status(500).json({
      error: err.message || "Flower storage failed.",
    });
  }
}
