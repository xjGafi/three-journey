vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
  return vec3(c / 255., c / 255., c / 255.);
}
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
  -0.577350269189626,  // -1.0 + 2.0 * C.x
  0.024390243902439); // 1.0 / 41.0
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
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
vec2 cover(vec2 screenDimensions, vec2 textureDimensions) {
  vec2 s = screenDimensions;
  vec2 i = textureDimensions;
  vec2 st = gl_FragCoord.xy / s;
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = st * s / new + offset;
  return uv;
}

vec2 uvCover(in vec2 _uv, vec2 screenDimensions, vec2 textureDimensions) {
  vec2 s = screenDimensions;
  vec2 i = textureDimensions;
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = _uv * s / new + offset;
  return uv;
}

varying vec2 vUv;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform float u_time;
uniform vec2 u_shapeSize;
uniform vec2 u_mousePosition;
uniform float u_mouseMovement;
uniform float u_animation;
uniform vec2 u_shapePosition;

void main() {
  vec3 c1 = rgb(u_color1.r, u_color1.g, u_color1.b);
  vec3 c2 = rgb(u_color2.r, u_color2.g, u_color2.b);
  vec3 c3 = rgb(u_color3.r, u_color3.g, u_color3.b);
  vec3 c4 = rgb(u_color4.r, u_color4.g, u_color4.b);

  vec2 uv = vUv;
  float mouseDist = distance(u_mousePosition, vUv);
  float noise = snoise(uv * 5. * (1. + u_mouseMovement * 3.));
  uv += noise * 0.005 * (1. + pow(u_animation * 2.5, 2.));

  float dist = distance(uv, vec2(0.5));
  vec3 color = vec3(0.);
  float rippleIntensity = sin((dist * 50. * 3.141592 - u_time * 10.)) * 0.5 + 0.5;
  color = mix(color, mix(c1, c2, dist * 2.), rippleIntensity);
  color = mix(color, mix(c2, c3, 1. - smoothstep(0.0, 0.5, dist * 2.)), rippleIntensity);
  color = mix(color, mix(c3, c4, smoothstep(0.0, 0.5, dist * 2.)), rippleIntensity);
  color = mix(color, vec3(0.0, 1., 1.), u_animation * 0.2);
  color = mix(color, vec3(0.), pow(dist * 2., 3.));
  float colorIntensity = (color.r + color.g + color.b) * 0.3333;
  color = mix(vec3(0.), color, smoothstep(0.5 - (u_animation * 0.4), 0.6, colorIntensity));

  gl_FragColor = vec4(color, 1.);
}