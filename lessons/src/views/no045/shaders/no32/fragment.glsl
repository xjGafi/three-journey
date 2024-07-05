varying vec2 vUv;

void main() {
  // 黑色圆环
  float strength = step(.015, abs(distance(vUv, vec2(.5)) - .25));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}