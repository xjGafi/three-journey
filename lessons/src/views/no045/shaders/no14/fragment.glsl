varying vec2 vUv;

void main() {
  // X轴渐变（中间黑两边白）
  float strength = abs(vUv.x - 0.5);

  gl_FragColor = vec4(strength, strength, strength, 1.);
}