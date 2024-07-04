varying vec2 vUv;

void main() {
  // X 轴渐变（左黑 - 右白）
  // float strength = vUv.x;

  // y 轴渐变（上白 - 下黑）
  // float strength = vUv.y;

  // y 轴渐变（上黑 - 下白）
  // float strength = 1. - vUv.y;

  // 仅下面一点黑色
  // float strength = vUv.y * 5.;

  // 锯齿状渐变
  float strength = mod(vUv.y * 10., 1.);

  gl_FragColor = vec4(strength, strength, strength, 1.);
}