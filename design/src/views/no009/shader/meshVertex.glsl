#include <g_pnoise>

uniform vec2 uMousePosition;
uniform float uTime;

varying float distortion;
varying float color1;
varying float color2;

varying vec2 vUv;
varying float mouseX;
varying float mouseY;

void main() {
  mouseX = (uMousePosition.x - 0.5);
  mouseY = (uMousePosition.y - 0.5);
  distortion = pnoise(normal + mouseY + uTime, vec3(10.));

  vUv = uv;
  vec3 pos = position;
  pos.xz += distortion * 5.;
  pos.yz += distortion * 5.;

  color1 = pnoise(normal + 0.9, vec3(10.)) * 1.0;
  color2 = pnoise(normal + 0.29, vec3(10.)) * 0.6;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}