float lighten(float base, float blend) {
  return max(blend, base);
}

vec3 lighten(vec3 base, vec3 blend) {
  return vec3(lighten(base.r, blend.r), lighten(base.g, blend.g), lighten(base.b, blend.b));
}

vec3 lighten(vec3 base, vec3 blend, float opacity) {
  return (lighten(base, blend) * opacity + base * (1.0 - opacity));
}

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

float overlay(float base, float blend) {
  return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 overlay(vec3 base, vec3 blend) {
  return vec3(overlay(base.r, blend.r), overlay(base.g, blend.g), overlay(base.b, blend.b));
}

vec3 overlay(vec3 base, vec3 blend, float opacity) {
  return (overlay(base, blend) * opacity + base * (1.0 - opacity));
}

varying float distortion;
varying float color1;
varying float color2;
varying float color3;

varying float mouseX;
varying float mouseY;

void main() {
  vec3 baseColor = rgb(50., 0., 220.);
  baseColor = mix(baseColor, rgb(255., 0., 0.), mouseX);
  baseColor = lighten(baseColor, rgb(180., 200., 255.), mouseY);
  vec3 color = baseColor;

  color = lighten(color, rgb(255., 50., 200.), distortion * 2.);
  color = lighten(color, rgb(160., 255., 200.), color1 * 1.);
  color = overlay(color, rgb(255., 255., 150.), color2 * 1.);
  color = overlay(color, rgb(160., 200., 255.), color3 * 2.5);
  color = mix(color, rgb(255., 255., 255.), 0.5);

  gl_FragColor = vec4(color, 1.0);
}