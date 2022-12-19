#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

vec2 rotate(vec2 uv, float rotation, vec2 center) {
  float x = cos(rotation) * (uv.x - center.x) + sin(rotation) * (uv.y - center.y) + center.x;
  float y = cos(rotation) * (uv.y - center.y) - sin(rotation) * (uv.x - center.x) + center.y;

  return vec2(x, y);
}

void main() {
  // 点光源效果（星星，旋转 45 度）
  vec2 rotateUv = rotate(vUv, PI / 4., vec2(.5, .5));

  vec2 lightUvX = vec2(
    rotateUv.x * .1 + .45,
    rotateUv.y * .5 + .25
  );
  float lightX = 0.02 / distance(lightUvX, vec2(.5));

  vec2 lightUvY = vec2(
    rotateUv.x * .5 + .25,
    rotateUv.y * .1 + .45
  );
  float lightY = 0.02 / distance(lightUvY, vec2(.5));

  float strength = lightX * lightY;

  gl_FragColor = vec4(strength, strength, strength, 1.);
}