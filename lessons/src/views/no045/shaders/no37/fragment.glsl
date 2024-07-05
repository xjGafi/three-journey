varying vec2 vUv;

void main() {
  // 中心渐变（带角度）
  float angle = atan(vUv.x - .5, vUv.y - .5);
  float strength = angle;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}