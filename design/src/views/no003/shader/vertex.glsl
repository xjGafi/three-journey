varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vPos;

uniform float uTime;
uniform float uTimeOffset;

#include <g_pnoise>

void main() {
  vec3 pos = position;
  vUv2 = uv;

  vec2 noiseUv = uv;
  noiseUv.y += pnoise(uv * (10.) + uTime * 1.5 + uTimeOffset, vec2(10.)) - pnoise(uv * 4. - uTime * .5 + uTimeOffset, vec2(10.));
  vUv = noiseUv;
  pos += pnoise(noiseUv * 1. - uTime + uTimeOffset, vec2(10.)) * 3.;

  vPos = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
