varying vec2 vUv;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_time;
uniform vec2 u_mousePosition;

vec3 rgb(float r, float g, float b) {
  return vec3(r / 255., g / 255., b / 255.);
}

vec3 rgb(float c) {
  return vec3(c / 255., c / 255., c / 255.);
}
float circle(in vec2 _st, in float _radius, in float _smoothing) {
  vec2 l = _st - vec2(0.5);
  return 1.0 - smoothstep(
    _radius - (_radius * _smoothing),
    _radius + (_radius * _smoothing),
    dot(l, l) * 4.0
  );
}

void main() {
  vec3 c1 = rgb(u_color1.r, u_color1.g, u_color1.b);
  vec3 c2 = rgb(u_color2.r, u_color2.g, u_color2.b);

  vec3 color = vec3(1.);
  vec2 uv = vUv;

  uv -= 0.5;

  float r = length(uv) * 2.;
  float a = atan(uv.y, uv.x);
  float fractR = fract(r * (10. + u_mousePosition.x * 20.) + u_time * 0.1);
  float fractA = fract(a * 10. + u_time * 0.2);

  float alpha =
  circle(vec2(fractA, fractR), 0.05 + u_mousePosition.y * 0.4, 0.6 - u_mousePosition.y * 0.4) *
  smoothstep(0.2, 0.3, r) *
  smoothstep(0.0, 0.2, 1. - r);
  color = mix(
    color,
    mix(c1, c2, vUv.x),
    smoothstep(0.3, 0.8, u_mousePosition.y)
  );

  color *= 1.5;

  gl_FragColor = vec4(color, alpha);
}