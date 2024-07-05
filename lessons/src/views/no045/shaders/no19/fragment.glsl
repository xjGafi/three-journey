varying vec2 vUv;

void main() {
  // 白色矩形框
  float box1 = step(.2, max(abs(vUv.x - .5), abs(vUv.y - .5)));
  float box2 = 1. - step(.3, max(abs(vUv.x - .5), abs(vUv.y - .5)));
  float strength = box1 * box2;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}