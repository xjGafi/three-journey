#include <g_pnoise>

uniform vec2 uMousePosition;

varying float distortion;
varying float color1;
varying float color2;

varying vec2 vUv;
varying float mouseX;
varying float mouseY;

void main() {
  mouseX = (uMousePosition.x - 0.4);
  mouseY = (uMousePosition.y - 0.4);
  distortion = pnoise(normal + mouseY, vec3(10.)) * mouseX * 2.;

  vUv = uv;
  vec3 pos = position;

  color1 = pnoise(normal + 0.9, vec3(10.)) * 1.0;
  color2 = pnoise(normal + 0.29, vec3(10.)) * 0.6;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}