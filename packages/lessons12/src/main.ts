import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  AxesHelper,
  Mesh,
  AmbientLight,
  MeshLambertMaterial,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

let mesh: Mesh;

init();
animate();

function init() {
  const { innerWidth, innerHeight } = window;

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Object
  const geometry = new BoxGeometry(100, 100, 100);
  // 网格模型材质设置为白色
  const material = new MeshLambertMaterial({
    color: 0xffffff,
  });
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  // Light
  addAmbientLight();
  addSpotLight();
  addPointLight();
  addDirectionalLightHelper();

  // Axes
  const axesHelper = new AxesHelper(500);
  scene.add(axesHelper);

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 800;
  controls.update();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener("resize", onWindowResize);
}

function addAmbientLight() {
  // 环境光对象
  // 环境光源颜色 RGB 成分分别和物体材质颜色 RGB 成分分别相乘
  const ambient = new AmbientLight(0x0000ff);
  scene.add(ambient);
}

function addSpotLight() {
  // 聚光光源对象
  const spotLight = new SpotLight(0xff0000);
  // 设置聚光光源位置
  // 光源对象和模型对象的 position 属性一样是 Vector3 对象
  // SpotLight 的基类是 Light，Light 的基类是 Object3D
  // 聚光光源对象继承 Object3D 对象的位置属性 position
  spotLight.position.set(-100, 100, 100);
  // spotLight.target = mesh;
  scene.add(spotLight);

  // 聚光源辅助对象
  const spotLightHelper = new SpotLightHelper(spotLight, 0xff00ff);
  scene.add(spotLightHelper);
}

function addPointLight() {
  // 点光源对象
  const point = new PointLight(0xff0000);
  // 设置点光源位置（同聚光光源）
  point.position.set(100, 100, 100);
  scene.add(point);

  // 点光源辅助对象
  const pointLightHelper = new PointLightHelper(point, 10, 0x00ffff);
  scene.add(pointLightHelper);
}

function addDirectionalLightHelper() {
  // 平行光光源对象
  const directionalLight = new DirectionalLight(0xff0000);
  // 设置平行光光源位置（同聚光光源）
  directionalLight.position.set(0, -150, 0);
  // directionalLight.target = mesh;
  scene.add(directionalLight);

  // 平行光光源辅助对象
  const directionalLightHelper = new DirectionalLightHelper(
    directionalLight,
    0xffff00
  );
  scene.add(directionalLightHelper);
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

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
