import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import uploadPortraitHandler from "../api/upload-portrait.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.post("/api/upload-portrait", uploadPortraitHandler);

app.use(express.static(distDir));

// SPA fallback — mirrors the rewrite in vercel.json for client-side routing.
// A path-less middleware (rather than app.get("*", ...)) avoids Express 5's
// path-to-regexp requiring named wildcards (e.g. "/*splat").
app.use((req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
