const GARDEN_SESSION_KEY = "garden-session-recorded";

async function fetchGardenSessionCount() {
  const res = await fetch("/api/garden-stats");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  return data.sessionCount ?? 0;
}

export async function recordGardenSession() {
  try {
    if (sessionStorage.getItem(GARDEN_SESSION_KEY)) {
      return fetchGardenSessionCount();
    }
  } catch {
    // sessionStorage unavailable (e.g. private mode restrictions)
  }

  const res = await fetch("/api/garden-stats", { method: "POST" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  try {
    sessionStorage.setItem(GARDEN_SESSION_KEY, "1");
  } catch {
    // ignore
  }

  return data.sessionCount ?? 0;
}
