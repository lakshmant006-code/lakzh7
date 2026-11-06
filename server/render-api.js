// The /api handlers as a small Express server, for hosts that serve the site as static files (Render).
// On Vercel these files run as serverless functions and this server is not used.
import express from "express";
import drawings from "../api/hand-drawings.js";
import drawing from "../api/hand-drawing.js";
import portrait from "../api/upload-portrait.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.all("/api/hand-drawings", drawings);
app.all("/api/hand-drawing", drawing);
app.all("/api/upload-portrait", portrait);
app.use((_req, res) => res.status(404).json({ error: "not found" }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`api listening on ${port}`));
