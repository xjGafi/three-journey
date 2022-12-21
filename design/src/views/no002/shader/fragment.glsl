varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uTimeOffset;

#include <g_snoise>

void main() {
  vec3 color = uColor1;

  vec2 uv = vUv;
  float noise = snoise(uv * 4. + uTime * 0.3 + uTimeOffset);
  uv += noise * 0.03;
  color = mix(color, uColor2, noise);

  float dist = distance(uv, vec2(0.5));
  float start = 0.3;
  float width = 0.01;
  float smoothing = 0.002;
  float ring = smoothstep(start, start + smoothing, dist) - smoothstep(start + width, start + width + smoothing, dist);
  float glow = smoothstep(start - 0.04, start + smoothing + 0.05, dist) - smoothstep(start + width, start + width + smoothing + 0.03, dist);
  float alpha = ring + glow * 0.12;

  gl_FragColor = vec4(color, alpha);
}