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
  EllipseCurve,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

const AMPLITUDE = 1; // 振幅（圆弧半径）：数值越大，曲线越陡峭 y = A * sin(x)
const ACCURACY = 50; // 精度：数值越大，曲线越光滑

init();
render();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100);
  camera.position.set(0, 0, 10);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  // Object
  // 正弦曲线
  addSinByFloat32Array();
  addSinByVector2();
  addSinBySplineCurve();
  // 圆形
  addArcCurve(1, 1);
  addEllipseCurve(1, 1);
  // 椭圆形
  addArcCurve(3, 1);
  addEllipseCurve(3, 1);

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.minDistance = 1;
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
  line.position.y = 1;
  scene.add(line);
}

function addSinByVector2() {
  let points = [];
  // 批量生成圆弧上的顶点数据
  for (let i = 0; i <= ACCURACY; i++) {
    const angle = ((2 * Math.PI) / ACCURACY) * i;
    const x = angle;
    const y = AMPLITUDE * Math.sin(angle);
    points.push(new Vector2(x, y));
  }
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0x00ffff });
  const line = new Line(geometry, material);
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
  // 根据关键坐标点生成 ACCURACY + 1 个坐标点
  const points = curve.getPoints(ACCURACY);
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0xff00ff });
  const line = new Line(geometry, material);
  scene.add(line);
}

function addArcCurve(scaleX: number, scaleY: number) {
  let points = [];
  // 批量生成圆弧上的顶点数据
  for (let i = 0; i <= ACCURACY; i++) {
    const angle = ((2 * Math.PI) / ACCURACY) * i;
    const x = AMPLITUDE * scaleX * Math.sin(angle);
    const y = AMPLITUDE * scaleY * Math.cos(angle);
    points.push(new Vector2(x, y));
  }
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0xff0000 });
  const line = new Line(geometry, material);
  scene.add(line);
}

function addEllipseCurve(scaleX: number, scaleY: number) {
  const curve = new EllipseCurve(
    0,
    0,
    AMPLITUDE * scaleX,
    AMPLITUDE * scaleY,
    0,
    2 * Math.PI,
    false, // 是否顺时针绘制，默认值为 false
    0
  );
  const points = curve.getPoints(ACCURACY);
  // 设置几何体的坐标点
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0x0000ff });
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
