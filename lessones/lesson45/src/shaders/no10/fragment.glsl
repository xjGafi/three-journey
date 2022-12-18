varying vec2 vUv;

void main() {
  // 黑白条纹（X轴 & Y轴）
  float strengthX = step(.8, mod(vUv.x * 10., 1.));
  float strengthY = step(.8, mod(vUv.y * 10., 1.));
  float strength = strengthX + strengthY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}