varying vec2 vUv;

void main() {
  // 点光源效果（星星）
  vec2 lightUvX = vec2(
    vUv.x * .1 + .45,
    vUv.y * .5 + .25
  );
  float lightX = 0.02 / distance(lightUvX, vec2(.5));

  vec2 lightUvY = vec2(
    vUv.x * .5 + .25,
    vUv.y * .1 + .45
  );
  float lightY = 0.02 / distance(lightUvY, vec2(.5));

  float strength = lightX * lightY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}