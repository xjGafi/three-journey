varying float vRandom;  // 限定变量：接收来自 vertex shader 中定义的限定变量

void main() {
  gl_FragColor = vec4(0.0, vRandom, 1.0, 1.0);
}