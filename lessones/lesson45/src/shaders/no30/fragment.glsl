varying vec2 vUv;

void main() {
  // 黑色圆形
  float strength = step(.25, distance(vUv, vec2(.5)));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}