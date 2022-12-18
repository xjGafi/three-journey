uniform float uSegments;

varying vec2 vUv;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  float x = ceil(vUv.x * uSegments) / uSegments;
  float y = ceil(vUv.y * uSegments) / uSegments;
  float strength = random(vec2(x, y));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}