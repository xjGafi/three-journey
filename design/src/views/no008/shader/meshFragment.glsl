vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
  return vec3(c / 255., c / 255., c / 255.);
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

uniform vec2 uDimensions;
uniform float uMultiplier;

void main() {
  vec2 st = gl_FragCoord.xy / uDimensions * uMultiplier;
  vec3 baseColor = rgb(190., 20., 120.);
  vec3 color = baseColor;

  color = overlay(baseColor, rgb(255.), distortion);
  color = mix(color, rgb(20., 255., 255.), st.x * 1.3 - 0.2);
  color = mix(color, rgb(255., 20., 255.), st.y - 0.3);

  gl_FragColor = vec4(color, 1.0);
}