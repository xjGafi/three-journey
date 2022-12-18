varying vec2 vUv;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  // 随机色阶网格（在 No.23 的基础上旋转 90 度）
  float x = ceil(vUv.x * 10. - vUv.y * 10.) / 10.;
  float y = ceil(vUv.y * 10. + vUv.x * 10.) / 10.;
  float strength = random(vec2(x, y));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}