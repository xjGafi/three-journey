vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
  return vec3(c / 255., c / 255., c / 255.);
}
float polygon(in vec2 _st, in float sideCount, in float smoothing) {
  float _PI = 3.14159265359;
  _st = _st * 2.0 - 1.0;
  float angle = atan(_st.x, _st.y) + _PI;
  float radius = (_PI * 2.) / sideCount;
  float shape = cos(floor(0.5 + angle / radius) * radius - angle) * length(_st);
  return 1.0 - smoothstep(0.4, 0.4 + smoothing, shape);
}

varying vec2 vUv;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_time;

void main() {
  vec3 color = mix(u_color1, u_color2, vUv.x);
  vec2 uv = vUv;
  float shapeOuter = polygon(uv, 3., 0.01);
  float shapeOuterGlow = polygon(uv, 3., 0.05);
  uv = uv * 2. - 1.;
  uv *= 1.1;
  uv = uv * 0.5 + 0.5;
  float shapeInnerShadow = polygon(uv, 3., 0.02);
  float shape = clamp(0., 1., shapeOuterGlow * 0.2 + shapeOuter) - shapeInnerShadow;

  gl_FragColor = vec4(color, shape);
}