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

varying vec2 vUv;

uniform vec2 uMousePosition;
uniform vec2 dimensions;
uniform float dimensionsMultiplier;
uniform sampler2D tDiffuse;

void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  vec2 st = gl_FragCoord.xy / (dimensions.xy * dimensionsMultiplier);

  float x = uMousePosition.x * 1.;
  float y = uMousePosition.y * 1.;

  float stx = st.x;
  float sty = st.y * 1.2;

  vec3 color = c.rgb;
  color = colorBurn(color, rgb(150., 100., 150.), sty);
  color = lighten(color, rgb(80., 120., 120.), stx);
  color = lighten(color, rgb(150., 60., 60.), (1. - stx) * 2.);
  color = overlay(color, rgb(150., 255., 255.), (1. - x) * 0.4);
  color = overlay(color, rgb(100., 255., 255.), (1. - y) * 0.2);
  gl_FragColor = vec4(color, 1.0);
}