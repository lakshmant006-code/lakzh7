// Stores visitor-uploaded portraits in Vercel Blob under pending/, to be
// picked up later by scripts/list-pending-uploads.cjs and processed by hand
// (Nano Banana Pro cleanup -> image-to-3D -> bake -> add to gallery). This
// module never calls any AI generation API itself — it's just the intake.
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageDataUri(imageDataUri) {
  if (typeof imageDataUri !== "string" || !imageDataUri.startsWith("data:image/")) {
    return "imageDataUri must be a data:image/... URI";
  }
  const match = imageDataUri.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  if (!match || !ALLOWED_MIME.has(match[1])) {
    return "unsupported image type (use JPEG, PNG, or WebP)";
  }
  const approxBytes = imageDataUri.length * 0.75;
  if (approxBytes > MAX_IMAGE_BYTES) {
    return `image too large (max ${(MAX_IMAGE_BYTES / 1024 / 1024).toFixed(0)}MB)`;
  }
  return null;
}

function dataUriToBuffer(imageDataUri) {
  const commaIndex = imageDataUri.indexOf(",");
  const header = imageDataUri.slice(0, commaIndex);
  const base64 = imageDataUri.slice(commaIndex + 1);
  const mime = header.match(/^data:(image\/[a-zA-Z+]+);base64$/)[1];
  const ext = mime === "image/jpeg" ? "jpg" : mime.split("/")[1];
  return { buffer: Buffer.from(base64, "base64"), ext, mime };
}

export async function storePendingUpload(imageDataUri, token) {
  const { buffer, ext, mime } = dataUriToBuffer(imageDataUri);
  const id = randomUUID();
  const blob = await put(`pending/${id}.${ext}`, buffer, {
    access: "private",
    contentType: mime,
    token,
  });
  return { id, url: blob.url, pathname: blob.pathname };
}

// Best-effort, single-instance-only rate limiter -- see README for why this
// isn't a real distributed limit and what to use instead if abuse becomes a
// problem.
const requestLog = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export function checkRateLimit(key) {
  const now = Date.now();
  const timestamps = (requestLog.get(key) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return true;
}
