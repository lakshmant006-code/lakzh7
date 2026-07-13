export async function fetchFlowers() {
  const res = await fetch("/api/flowers");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  return data.flowers ?? [];
}

export async function plantFlower({ name, image, message }) {
  const res = await fetch("/api/flowers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, image, message }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  return data.flower;
}
