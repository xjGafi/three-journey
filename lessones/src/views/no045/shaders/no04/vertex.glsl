attribute float aRandom;  // 属性变量：接收在 three.js 的 geometry 中定义的随机数属性

varying float vRandom;  // 限定变量：将该值从 vertex shader 发送到 fragment shader

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandom * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vRandom = aRandom;  // 将 aRandom 赋值给 vRandom，并发送给 fragment shader
}
