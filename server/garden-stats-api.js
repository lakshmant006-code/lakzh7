import {
  getGardenSessionCount,
  incrementGardenSessionCount,
} from "./supabase-garden-stats.js";

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export async function handleGardenStatsRequest(req, res, env) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.method === "GET") {
      const sessionCount = await getGardenSessionCount(env);
      sendJson(res, 200, { sessionCount });
      return;
    }

    if (req.method === "POST") {
      const sessionCount = await incrementGardenSessionCount(env);
      sendJson(res, 200, { sessionCount });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (err) {
    console.error("[garden-stats-api]", err);
    sendJson(res, 500, {
      error: err.message || "Garden stats failed.",
    });
  }
}

export function createGardenStatsMiddleware(env) {
  return (req, res) => {
    handleGardenStatsRequest(req, res, env);
  };
}
