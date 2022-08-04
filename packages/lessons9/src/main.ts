import "./style.css";
import {
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

init();
animate();

function init() {
  const { innerWidth, innerHeight } = window;

  // Camera
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 500);
  camera.position.set(0, 0, 300);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(500);
  scene.add(axesHelper);

  // Object
  addPointsMaterial();
  addLineDashedMaterial();
  addLineBasicMaterial();
  addMeshBasicMaterial();

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 400;
  controls.update();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener("resize", onWindowResize);
}

// 一个具有四个顶点数据的几何体
function boxGeometry(): BufferGeometry {
  // 类型数组创建顶点位置 position 数据
  const vertices = new Float32Array([
    0,
    0,
    0, // 顶点 1 坐标
    50,
    0,
    0, // 顶点 2 坐标
    50,
    50,
    0, // 顶点 3 坐标
    0,
    50,
    0, // 顶点 4 坐标
  ]);
  // 创建顶点位置 position 属性缓冲区对象，3 个为一组，表示一个顶点的 xyz 坐标
  const attribueVertices = new BufferAttribute(vertices, 3);

  // 类型数组创建顶点颜色 color 数据
  const colors = new Float32Array([
    1,
    0,
    0, // 顶点 1 颜色 0xff0000
    0,
    1,
    0, // 顶点 2 颜色 0x00ff00
    0,
    0,
    1, // 顶点 3 颜色 0x0000ff
    1,
    1,
    0, // 顶点 4 颜色 0xffff00
  ]);
  // 创建顶点颜色 color 属性缓冲区对象，3 个为一组，表示一个顶点的颜色
  const attribueColor = new BufferAttribute(colors, 3);

  // 创建一个 Buffer 类型几何体对象
  const geometry = new BufferGeometry();
  // 设置几何体 attributes 属性的位置、颜色属性
  geometry.setAttribute("position", attribueVertices);
  geometry.setAttribute("color", attribueColor);

  // Uint16Array 类型数组创建顶点索引数据
  const indexes = new Uint16Array([
    // 0 对应第 1 个顶点位置数据、第 1 个顶点法向量数据
    // 1 对应第 2 个顶点位置数据、第 2 个顶点法向量数据
    // 以此类推
    // 索引值 3 个为一组，表示一个三角形的 3 个顶点
    0,
    1,
    2, // 第一个三角形
    2,
    3,
    0, // 第二个三角形
  ]);
  // 索引数据赋值给几何体的 index 属性
  geometry.index = new BufferAttribute(indexes, 1); //1个为一组

  return geometry;
}

// 点渲染模式
function addPointsMaterial() {
  // 几何体对象
  const geometry = boxGeometry();
  // 点材质对象
  const material = new PointsMaterial({
    vertexColors: true,
    size: 5.0, //点对象像素尺寸
  });
  // 点模型对象
  const points = new Points(geometry, material);
  points.position.set(-150, 0, 0);
  scene.add(points);
}

// 虚线渲染模式
function addLineDashedMaterial() {
  // 几何体对象
  const geometry = boxGeometry();
  // 虚线材质对象
  const material = new LineDashedMaterial({
    vertexColors: true,
    dashSize: 10, // 显示线段的大小，默认为 3
    gapSize: 5, // 间隙的大小，默认为 1
  });
  // 虚线模型对象
  const line = new Line(geometry, material);
  line.computeLineDistances();
  line.position.set(-50, 0, 0);
  scene.add(line);
}

// 实线渲染模式
function addLineBasicMaterial() {
  // 几何体对象
  const geometry = boxGeometry();
  // 实线材质对象
  const material = new LineBasicMaterial({
    vertexColors: true,
  });
  // 实线模型对象
  const line = new Line(geometry, material);
  line.position.set(50, 0, 0);
  scene.add(line);
}

// 三角面(网格)渲染模式
function addMeshBasicMaterial() {
  // 几何体对象
  const geometry = boxGeometry();
  // 三角面(网格)材质对象
  const material = new MeshBasicMaterial({
    vertexColors: true,
    side: DoubleSide, // 两面可见
  });
  // 三角面(网格)模型对象
  const mesh = new Mesh(geometry, material);
  mesh.position.set(150, 0, 0);
  scene.add(mesh);
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  // const time = Date.now() * 0.001;
  // scene.rotation.y = 0.25 * time;

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
