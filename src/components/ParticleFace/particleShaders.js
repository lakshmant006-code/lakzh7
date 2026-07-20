export const VERTEX_SHADER = /* glsl */ `
attribute vec3 aColor;
attribute vec3 aNormal;
attribute float aSeed;

uniform float uTime;
uniform float uIntro;
uniform vec3 uMouse;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uPerspectiveScale;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  float t = uTime * 0.5 + aSeed * 6.2831853;
  pos += aNormal * (sin(t) * 0.0035 + 0.0035);
  pos.x += sin(t * 1.1) * 0.0025;
  pos.y += cos(t * 0.9) * 0.0025;

  pos += position * (1.0 - uIntro) * 1.8 * aSeed;

  vec2 toParticle = pos.xy - uMouse.xy;
  float dist = length(toParticle);
  float radiusJitter = uMouseRadius * (0.7 + aSeed * 0.6);
  float falloff = smoothstep(radiusJitter, 0.0, dist);
  falloff = falloff * falloff * (3.0 - 2.0 * falloff);

  vec2 radialDir = dist > 0.0001 ? normalize(toParticle) : vec2(0.0);
  float burstAngle = aSeed * 6.2831853;
  vec2 burstDir = vec2(cos(burstAngle), sin(burstAngle));
  vec2 dir = normalize(mix(radialDir, burstDir, 0.15));

  float travel = falloff * uMouseStrength * (0.85 + aSeed * 0.3);
  pos.xy += dir * travel;
  pos += aNormal * falloff * uMouseStrength * 0.45;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // "Headlight" shading: normals facing the camera read bright, normals
  // facing away (grazing/concave surfaces) read dark — reveals surface detail
  // on an unlit additive point cloud, stays correct as the model rotates.
  vec3 viewNormal = normalize(normalMatrix * aNormal);
  float facing = clamp(viewNormal.z, 0.0, 1.0);
  float shade = 0.22 + pow(facing, 1.4) * 1.05;

  float luminance = dot(aColor, vec3(0.299, 0.587, 0.114));
  float sizeWorld = (0.0025 + luminance * 0.0055) * (0.6 + shade * 0.5);
  sizeWorld *= 1.0 + falloff * 1.6;
  gl_PointSize = sizeWorld * uPerspectiveScale / -mvPosition.z;

  vAlpha = uIntro * shade * (1.0 + falloff * 0.6);
  vColor = aColor;
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float edge = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor * uColor, edge * vAlpha);
}
`;
