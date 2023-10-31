#include <g_pnoise>

uniform vec2 uMousePosition;

varying float distortion;
varying float color1;
varying float color2;
varying float color3;

varying float mouseX;
varying float mouseY;

void main() {
  mouseX = (uMousePosition.x - 0.5);
  mouseY = (uMousePosition.y - 0.5);
  distortion = pnoise(normal, vec3(10.)) * 1.5 * mouseY * 2.5;

  vec3 pos = position;
  pos.yz += distortion * 10.0 * (mouseY + 0.1);
  pos.xz += distortion * 20.0 * (mouseX + 0.1);

  color1 = pnoise(normal + 0.9, vec3(10.)) * 1.;
  color2 = pnoise(normal + 3.1, vec3(10.)) * 1.9;
  color2 = pnoise(normal * 2., vec3(10.)) * 1.9;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}