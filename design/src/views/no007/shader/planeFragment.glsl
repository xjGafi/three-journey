vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
  return vec3(c / 255., c / 255., c / 255.);
}

float colorBurn(float base, float blend) {
  return (blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0);
}

vec3 colorBurn(vec3 base, vec3 blend) {
  return vec3(colorBurn(base.r, blend.r), colorBurn(base.g, blend.g), colorBurn(base.b, blend.b));
}

vec3 colorBurn(vec3 base, vec3 blend, float opacity) {
  return (colorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

float lighten(float base, float blend) {
  return max(blend, base);
}

vec3 lighten(vec3 base, vec3 blend) {
  return vec3(lighten(base.r, blend.r), lighten(base.g, blend.g), lighten(base.b, blend.b));
}

vec3 lighten(vec3 base, vec3 blend, float opacity) {
  return (lighten(base, blend) * opacity + base * (1.0 - opacity));
}

varying float color1;
varying float color2;

varying vec2 vUv;

void main() {
  vec3 baseColor = rgb(50., 200., 255.);
  vec3 color = baseColor;

  color = mix(color, rgb(255., 100., 220.), color1);
  color = mix(color, rgb(220., 100., 255.), color2);

  float uvx = (cos(vUv.x * 3.141592 * 2.) + 1.) / 2.;
  float uvy = (cos(vUv.y * 3.141592 * 2.) + 1.) / 2.;

  color = lighten(color, rgb(220., 100., 255.), uvx * 0.2);
  color = lighten(color, rgb(255., 100., 220.), vUv.y);
  color = colorBurn(color, rgb(255., 100., 220.), uvy * 0.5);

  color = lighten(color, rgb(255., 100., 220.), 0.2);
  gl_FragColor = vec4(color, 1.0);
}