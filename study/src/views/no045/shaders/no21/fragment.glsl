varying vec2 vUv;

void main() {
  // 梯度色阶网格（左下黑 - 右上白）
  float strengthX = ceil(vUv.x * 10.) / 10.;
  float strengthY = ceil(vUv.y * 10.) / 10.;
  float strength = strengthX * strengthY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}