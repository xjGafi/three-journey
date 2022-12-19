varying vec2 vUv;

void main() {
  // 白色异形环
  vec2 waveUv = vec2(
    vUv.x,
    vUv.y + sin(vUv.x * 30.) * .1
  );
  float strength = 1. - step(.015, abs(distance(waveUv, vec2(.5)) - .25));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}