import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  BufferAttribute,
  SplineCurve,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

const AMPLITUDE = 1; // 振幅：数值越大，曲线越陡峭 y = A * sin(x)
const ACCURACY = 50; // 精度：数值越大，曲线越光滑

init();
render();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100);
  camera.position.set(0, 0, 30);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(30);
  scene.add(axesHelper);

  // Object
  addSinByFloat32Array();
  addSinByVector2();
  addSinBySplineCurve();

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.minDistance = 10;
  controls.maxDistance = 80;
  controls.update();

  // Resize
  window.addEventListener("resize", onWindowResize);
}

function pi(scale: number) {
  return Math.PI * scale;
}

function addSinByFloat32Array() {
  // 创建 x 轴 [0, 2π] 范围的坐标点
  let points = [];
  let x = 0;
  let y = 0;
  do {
    points.push(x, y, 0);
    x += 1 / ACCURACY;
    y = Math.sin(x) * AMPLITUDE;
  } while (x.toFixed(3) <= pi(2).toFixed(3));
  // Float32Array 类型数组创建顶点位置 position 数据
  const positions = new Float32Array(points);
  // 创建 position 属性缓冲区对象
  const attribuePositions = new BufferAttribute(positions, 3);
  // 设置几何体 attributes 属性的 position 属性
  const geometry = new BufferGeometry().setAttribute(
    "position",
    attribuePositions
  );

  const material = new LineBasicMaterial({ color: 0xffff00 });
  const line = new Line(geometry, material);
  scene.add(line);
}

function addSinByVector2() {
  // 创建 x 轴 [0, 2π] 范围的坐标点
  let points = [];
  let x = 0;
  let y = 0;
  do {
    points.push(new Vector2(x, y));
    x += 1 / ACCURACY;
    y = Math.sin(x) * AMPLITUDE;
  } while (x.toFixed(3) <= pi(2).toFixed(3));
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0x00ffff });
  const line = new Line(geometry, material);
  line.position.y = 1;
  scene.add(line);
}

function addSinBySplineCurve() {
  // 创建 x 轴 [0, 2π] 范围内的 5 个关键坐标点
  const curve = new SplineCurve([
    new Vector2(pi(0), 0),
    new Vector2(pi(1 / 2), 1 * AMPLITUDE),
    new Vector2(pi(1), 0),
    new Vector2(pi(3 / 2), -1 * AMPLITUDE),
    new Vector2(pi(2), 0),
  ]);
  // 根据关键坐标点生成 ACCURACY + 2 个坐标点
  const points = curve.getPoints(ACCURACY);
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0xff00ff });
  const line = new Line(geometry, material);
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
