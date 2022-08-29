import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  BufferGeometry,
  Line,
  LineDashedMaterial,
  AxesHelper,
} from "three";

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

init();
render();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 500);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Axes
  const axes = new AxesHelper(100);
  scene.add(axes);

  // Object
  const geometry = lineGeometry(30);
  const material = new LineDashedMaterial({ color: 0x0000ff });
  const line = new Line(geometry, material);
  line.computeLineDistances(); // or lineSegments.computeLineDistances()
  scene.add(line);

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Resize
  window.addEventListener("resize", onWindowResize);
}

function lineGeometry(length: number) {
  // 定义带有一些顶点的 几何体
  const points = [
    new Vector3(-length, 0, 0),
    new Vector3(0, length, 0),
    new Vector3(length, 0, 0),
  ];
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points);
  return geometry;
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
