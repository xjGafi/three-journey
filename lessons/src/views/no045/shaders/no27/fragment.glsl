varying vec2 vUv;

void main() {
  // 点光源效果（椭圆）
  vec2 lightUv = vec2(
    vUv.x * .2 + .4,
    vUv.y * .5 + .25
  );
  float strength = 0.05 / distance(lightUv, vec2(.5));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}