import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const FLOWERS_BUCKET = "flowers";

function normalizeSupabaseUrl(url) {
  if (!url) return url;
  return String(url)
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

function getSupabaseAdmin(env = process.env) {
  const url = normalizeSupabaseUrl(env.SUPABASE_URL);
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local (dev) and your host env vars (production).",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URL.");
  }

  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function rowToFlower(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.image_url,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function listFlowers(env = process.env) {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from("flowers")
    .select("id, name, image_url, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(rowToFlower);
}

export async function saveFlower({ name, image, message }, env = process.env) {
  const trimmedName = String(name ?? "").trim();
  if (!trimmedName) {
    throw new Error("Name is required.");
  }
  if (!image) {
    throw new Error("Image is required.");
  }
  const trimmedMessage = String(message ?? "").trim();

  const supabase = getSupabaseAdmin(env);
  const { contentType, buffer } = parseDataUrl(image);
  const ext = contentType.includes("png") ? "png" : "png";
  const objectPath = `${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(FLOWERS_BUCKET)
    .upload(objectPath, buffer, {
      contentType: contentType || "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicData } = supabase.storage
    .from(FLOWERS_BUCKET)
    .getPublicUrl(objectPath);

  const imageUrl = publicData.publicUrl;

  const { data, error } = await supabase
    .from("flowers")
    .insert({
      name: trimmedName,
      image_url: imageUrl,
      message: trimmedMessage || null,
    })
    .select("id, name, image_url, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToFlower(data);
}
