varying vec2 vUv;

#include <g_cnoise>

void main() {
  // 噪音函数
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // Final color
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(mixedColor, 1.0);
}