// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// 使用 ShaderMaterial 类，这些变量 position 无需声明，顶点着色器可以直接调用

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
