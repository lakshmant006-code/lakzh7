/**
 * Loads the compact particle dataset baked from the source GLB:
 * a header uint32 count, followed by Float32Array positions (xyz),
 * Float32Array normals (xyz), and Uint8Array colors (rgb).
 */
export async function loadMeshParticles(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load particle data: ${url}`);
  const buffer = await res.arrayBuffer();

  const header = new Uint32Array(buffer, 0, 1);
  const count = header[0];

  let offset = 4;
  const positions = new Float32Array(buffer.slice(offset, offset + count * 3 * 4));
  offset += count * 3 * 4;
  const normals = new Float32Array(buffer.slice(offset, offset + count * 3 * 4));
  offset += count * 3 * 4;
  const colors = new Uint8Array(buffer.slice(offset, offset + count * 3));

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const center = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    z: (minZ + maxZ) / 2,
  };
  const radius = Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 2;

  return { count, positions, normals, colors, center, radius };
}

export function subsampleParticles(data, maxCount) {
  if (data.count <= maxCount) return data;

  const stride = data.count / maxCount;
  const count = Math.floor(maxCount);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const colors = new Uint8Array(count * 3);

  for (let i = 0; i < count; i++) {
    const srcIndex = Math.floor(i * stride);
    const srcI3 = srcIndex * 3;
    const dstI3 = i * 3;
    positions[dstI3] = data.positions[srcI3];
    positions[dstI3 + 1] = data.positions[srcI3 + 1];
    positions[dstI3 + 2] = data.positions[srcI3 + 2];
    normals[dstI3] = data.normals[srcI3];
    normals[dstI3 + 1] = data.normals[srcI3 + 1];
    normals[dstI3 + 2] = data.normals[srcI3 + 2];
    colors[dstI3] = data.colors[srcI3];
    colors[dstI3 + 1] = data.colors[srcI3 + 1];
    colors[dstI3 + 2] = data.colors[srcI3 + 2];
  }

  return { count, positions, normals, colors, center: data.center, radius: data.radius };
}
