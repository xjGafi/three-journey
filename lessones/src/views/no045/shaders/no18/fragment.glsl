varying vec2 vUv;

void main() {
  // 黑色矩形
  float strength = step(.2, max(abs(vUv.x - .5), abs(vUv.y - .5)));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}