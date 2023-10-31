uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float tex = texture2D(uTexture, vUv).r;
  gl_FragColor = vec4(uColor, tex);
}