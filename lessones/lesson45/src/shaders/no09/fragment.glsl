varying vec2 vUv;

void main() {
  // 黑白条纹（仅 Y轴）
  float strength = mod(vUv.y * 10., 1.);
  strength = step(.5, strength); // 修改第一个参数可以调整条纹粗细

  // float strength = round(mod(vUv.y * 10., 1.)); // 等价于

  gl_FragColor = vec4(strength, strength, strength, 1.);
}