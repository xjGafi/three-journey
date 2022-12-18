varying vec2 vUv;

void main() {
  // 白色十字
  float barX = step(.4, mod(vUv.x * 10. + .2, 1.));
  barX *= step(.8, mod(vUv.y * 10. + .4, 1.));

  float barY = step(.8, mod(vUv.x * 10. + .4, 1.));
  barY *= step(.4, mod(vUv.y * 10. + .2, 1.));

  float strength = barX + barY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}