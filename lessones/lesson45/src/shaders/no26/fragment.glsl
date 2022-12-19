varying vec2 vUv;

void main() {
  // 中心渐变（中间白，周围黑）
  // float strength = 1. - distance(vUv, vec2(.5));

  // 点光源效果
  float strength = 0.05 / distance(vUv, vec2(.5));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}