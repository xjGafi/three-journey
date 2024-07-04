varying vec2 vUv;

void main() {
  // 白色点（ No.10 中黑白条纹的交叉点）
  float strengthX = step(.8, mod(vUv.x * 10., 1.));
  float strengthY = step(.8, mod(vUv.y * 10., 1.));
  float strength = strengthX * strengthY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}