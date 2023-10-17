float lighten(float base, float blend) {
  return max(blend, base);
}

vec3 lighten(vec3 base, vec3 blend) {
  return vec3(lighten(base.r, blend.r), lighten(base.g, blend.g), lighten(base.b, blend.b));
}

vec3 lighten(vec3 base, vec3 blend, float opacity) {
  return (lighten(base, blend) * opacity + base * (1.0 - opacity));
}
float darken(float base, float blend) {
  return min(blend, base);
}

vec3 darken(vec3 base, vec3 blend) {
  return vec3(darken(base.r, blend.r), darken(base.g, blend.g), darken(base.b, blend.b));
}

vec3 darken(vec3 base, vec3 blend, float opacity) {
  return (darken(base, blend) * opacity + base * (1.0 - opacity));
}

#include <g_snoise>
#include <g_circle>

uniform sampler2D uTexture;
uniform vec2 uTextureDimensions;
uniform float uTime;
uniform vec3 uColorHigh;
uniform vec3 uColorLow;

varying vec2 vUv;

const float count = 50.;

void main() {
  vec2 uv = vec2(vUv.x * (uTextureDimensions.x / uTextureDimensions.y), vUv.y);
  vec2 floored = floor(uv * count);
  vec2 fractedBlock = fract(uv * count);
  fractedBlock -= 0.5;
  fractedBlock *= 1.25;
  fractedBlock += 0.5;
  vec2 fracted = fract(fractedBlock * 2.);
  float noise = snoise(floored + uTime * 0.1);

  vec3 tex = texture2D(uTexture, floor(vUv * vec2(count * (uTextureDimensions.x / uTextureDimensions.y), count)) / vec2(count * (uTextureDimensions.x / uTextureDimensions.y), count)).rgb;

  vec3 color = tex;

  color = lighten(color, uColorHigh, 1. - noise * 0.45);
  color = darken(color, uColorLow, 1. - noise * 0.2);
  color = mix(color, vec3(1.), circle(fracted, 0.2, 0.4) * 0.28);
  color -= (1. - smoothstep(-0.2, 0.01, fractedBlock.x) * smoothstep(-0.2, 0.01, 1. - fractedBlock.x) * smoothstep(-0.2, 0.01, fractedBlock.y) * smoothstep(-0.2, 0.01, 1. - fractedBlock.y)) * 0.04;
  gl_FragColor = vec4(color, 1.);
}