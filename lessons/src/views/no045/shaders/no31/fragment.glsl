varying vec2 vUv;

void main() {
  // 非线性渐变（白 - 黑 - 白）
  float strength = abs(distance(vUv, vec2(.5)) - .2);

  gl_FragColor = vec4(strength, strength, strength, 1.);
}