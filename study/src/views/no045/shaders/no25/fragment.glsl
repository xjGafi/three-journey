varying vec2 vUv;

void main() {
  // 中心渐变（中间黑，周围白）
  // float strength = length(vUv - .5);

  float strength = distance(vUv, vec2(.5));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}