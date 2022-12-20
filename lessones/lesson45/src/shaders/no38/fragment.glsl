#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main() {
  // 中心渐变（带角度）
  float angle = atan(vUv.x - .5, vUv.y - .5);
  angle /= PI * 2.;
  angle += .5;
  float strength = angle;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}