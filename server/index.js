import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createFlowersMiddleware } from "./flowers-api.js";
import { createGardenStatsMiddleware } from "./garden-stats-api.js";
import { createGeminiFlowerMiddleware } from "./gemini-flower.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const env = process.env;

const app = express();

app.use("/api/generate-flower", createGeminiFlowerMiddleware(env));
app.use("/api/flowers", createFlowersMiddleware(env));
app.use("/api/garden-stats", createGardenStatsMiddleware(env));

app.use(express.static(distDir));

// SPA fallback — mirrors the rewrite in vercel.json for client-side routing.
app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
