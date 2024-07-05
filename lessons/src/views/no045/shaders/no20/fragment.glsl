varying vec2 vUv;

void main() {
  // 梯度色阶条纹（左黑 - 右白）
  // float strength = round(vUv.x * 10.) / 10.;  // round: 四舍五入

  // float strength = floor(vUv.x * 10.) / 10.;  // floor: 向下取整

  float strength = ceil(vUv.x * 10.) / 10.;  // ceil: 向上取整

  gl_FragColor = vec4(strength, strength, strength, 1.);
}