import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SphereGeometry,
  PointsMaterial,
  Points,
  LineBasicMaterial,
  LineDashedMaterial,
  Line
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

init();
render();

function init() {
  const { innerWidth, innerHeight } = window;

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Object
  // 点材质 PointsMaterial
  addPointsMaterial();
  // 基础线材质 LineBasicMaterial
  addLineBasicMaterial();
  // 虚线材质 LineDashedMaterial
  addLineDashedMaterial();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addPointsMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25);
  // 点材质对象
  const material = new PointsMaterial({
    color: 0xff0000,
    size: 3 // 点渲染尺寸
  });
  // 点模型对象
  const point = new Points(geometry, material);
  point.position.x = -220;
  scene.add(point);
}

function addLineBasicMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25);
  // 直线基础材质对象
  const material = new LineBasicMaterial({
    color: 0x00ff00
  });
  // 线模型对象
  const line = new Line(geometry, material);
  scene.add(line);
}

function addLineDashedMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25);
  // 虚线材质对象
  const material = new LineDashedMaterial({
    color: 0x0000ff,
    dashSize: 10, // 显示线段的大小。默认为 3。
    gapSize: 5 // 间隙的大小。默认为 1
  });
  // 线模型对象
  const line = new Line(geometry, material);
  // 计算 LineDashedMaterial 所需的距离数组
  line.computeLineDistances();
  line.position.x = 220;
  scene.add(line);
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
