#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main() {
  // 花边圆形
  float angle = atan(vUv.x - .5, vUv.y - .5);
  angle /= PI * 2.;
  angle += .5;
  float sinusoid = sin(angle * 100.);

  float radius = .25 + sinusoid * .02;
  float strength = 1. - step(.01, abs(distance(vUv, vec2(.5)) - radius));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}