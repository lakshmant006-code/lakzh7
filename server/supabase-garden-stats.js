import { createClient } from "@supabase/supabase-js";

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

const STATS_ROW_ID = "default";

export async function getGardenSessionCount(env = process.env) {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from("garden_stats")
    .select("page_views")
    .eq("id", STATS_ROW_ID)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Number(data?.page_views ?? 0);
}

export async function incrementGardenSessionCount(env = process.env) {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase.rpc("increment_garden_page_views");

  if (error) {
    throw new Error(error.message);
  }

  return Number(data ?? 0);
}
