float circle(vec2 _st, float _radius, float _smoothing) {
  vec2 l = _st - vec2(0.5);
  return 1.0 - smoothstep(_radius - (_radius * _smoothing), _radius + (_radius * _smoothing), dot(l, l) * 4.0);
}