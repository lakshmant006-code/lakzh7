import { listFlowers, saveFlower } from "./supabase-flowers.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export async function handleFlowersRequest(req, res, env) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.method === "GET") {
      const flowers = await listFlowers(env);
      sendJson(res, 200, { flowers });
      return;
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const flower = await saveFlower(
        { name: body.name, image: body.image, message: body.message },
        env,
      );
      sendJson(res, 201, { flower });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (err) {
    console.error("[flowers-api]", err);
    sendJson(res, 500, {
      error: err.message || "Flower storage failed.",
    });
  }
}

export function createFlowersMiddleware(env) {
  return (req, res, next) => {
    handleFlowersRequest(req, res, env);
  };
}
