import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Vector2,
  CubicBezierCurve,
  CubicBezierCurve3,
  Vector3,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  ArcCurve,
  LineCurve,
  CurvePath,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

const ACCURACY = 100; // 精度：数值越大，曲线越光滑

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
  addCubicBezierCurve();
  addQuadraticBezierCurve();
  addCubicBezierCurve3();
  addQuadraticBezierCurve3();
  addCurvePath();

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

function addCubicBezierCurve() {
  const curve = new CubicBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(2, -3),
    new Vector2(3, 0)
  );

  const points = curve.getPoints(ACCURACY);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0xff0000 });

  const line = new Line(geometry, material);
  scene.add(line);
}

function addQuadraticBezierCurve() {
  const curve = new QuadraticBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(3, 0)
  );

  const points = curve.getPoints(ACCURACY);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0x00ff00 });

  const line = new Line(geometry, material);
  scene.add(line);
}

function addCubicBezierCurve3() {
  const curve = new CubicBezierCurve3(
    new Vector3(0, 0, 0),
    new Vector3(1, 3, -3),
    new Vector3(2, -3, 3),
    new Vector3(3, 0, 0)
  );

  const points = curve.getPoints(ACCURACY);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0x0000ff });

  const line = new Line(geometry, material);
  scene.add(line);
}

function addQuadraticBezierCurve3() {
  const curve = new QuadraticBezierCurve3(
    new Vector3(0, 0, 0),
    new Vector3(1, 3, -3),
    new Vector3(3, 0, 0)
  );

  const points = curve.getPoints(ACCURACY);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: 0xffff00 });

  const line = new Line(geometry, material);
  scene.add(line);
}

function addCurvePath() {
  const RADIUS = 1;
  const HEIGHT = 2;
  const arc1 = new ArcCurve(0, 0, RADIUS, 0, Math.PI, true);
  const arc2 = new ArcCurve(0, HEIGHT, RADIUS, Math.PI, 0, true);
  const line1 = new LineCurve(
    new Vector2(RADIUS, HEIGHT),
    new Vector2(RADIUS, 0)
  );
  const line2 = new LineCurve(
    new Vector2(-RADIUS, 0),
    new Vector2(-RADIUS, HEIGHT)
  );

  const curvePath = new CurvePath();
  curvePath.curves.push(line1, arc1, line2, arc2);
  const points = curvePath.getPoints(ACCURACY);
  const geometry = new BufferGeometry().setFromPoints(points as Array<Vector2>);

  const material = new LineBasicMaterial({ color: 0x00ffff });
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
