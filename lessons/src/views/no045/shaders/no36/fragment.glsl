varying vec2 vUv;

void main() {
  // 渐变（带角度）
  float angle = atan(vUv.x, vUv.y);
  float strength = angle;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}