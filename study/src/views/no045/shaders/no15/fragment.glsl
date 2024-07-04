varying vec2 vUv;

void main() {
  // 菱形渐变（中间黑四周白）
  float strengthX = abs(vUv.x - .5);
  float strengthY = abs(vUv.y - .5);
  float strength = strengthX + strengthY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}