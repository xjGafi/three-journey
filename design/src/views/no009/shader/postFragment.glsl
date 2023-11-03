vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
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
uniform vec2 uAmount;
uniform float uDensityMultiplier;
uniform sampler2D tDiffuse;

void main() {
  vec2 st = gl_FragCoord.xy / (dimensions.xy * uDensityMultiplier);

  vec4 c = texture2D(tDiffuse, vUv);

  vec2 uvPixelated = floor(vUv * uAmount) / uAmount;
  vec4 cPixelated = texture2D(tDiffuse, uvPixelated);

  float dx = 1. - abs(st.x - uMousePosition.x);
  c = mix(c, cPixelated, pow(dx, uDensityMultiplier * 2.));
  vec3 color = c.rgb;
  color = overlay(color, rgb(150., 100., 210.), st.x);
                // color = lighten(color, rgb(0., 230., 230.), 1. - stx);
                // color = overlay(color, rgb(50., 100., 210.), x);
                // color = colorBurn(color, rgb(0., 80., 80.), clamp(0.45 - ((x) * (sty + 0.2) * 0.6), -0.25, 1.5));

  gl_FragColor = vec4(color, 1.0);
}