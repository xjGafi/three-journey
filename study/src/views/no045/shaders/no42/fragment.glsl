varying vec2 vUv;

#include <g_cnoise>

void main() {
  // 噪音函数
  float strength = cnoise(vUv * 10.);

  gl_FragColor = vec4(strength, strength, strength, 1.);
}