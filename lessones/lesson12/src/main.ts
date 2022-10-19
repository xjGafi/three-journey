import './style.css';
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
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  Group,
  Clock,
  HemisphereLight,
  RectAreaLight,
  Vector3,
  HemisphereLightHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  controls: OrbitControls;

let group: Group, sphere: Mesh, cube: Mesh, torus: Mesh, plane: Mesh;

const clock = new Clock();

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(1, 1, 2);

  // Scene
  scene = new Scene();

  // Objects
  addObjects();

  // Light
  addAmbientLight();
  addDirectionalLightHelper();
  addHemisphereLight();
  addPointLight();
  addRectAreaLight();
  addSpotLight();

  // Axes
  const axesHelper = new AxesHelper(500);
  scene.add(axesHelper);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addObjects() {
  group = new Group();
  scene.add(group);

  // Material
  const material = new MeshStandardMaterial();
  material.roughness = 0.4;

  // Objects
  sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
  sphere.position.x = -1.5;

  cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);

  torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
  torus.position.x = 1.5;

  plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.65;

  group.add(sphere, cube, torus, plane);
}

function addAmbientLight() {
  // 环境光对象
  // 环境光源颜色 RGB 成分分别和物体材质颜色 RGB 成分分别相乘
  const light = new AmbientLight(0xffffff, 0.5);
  scene.add(light);
}

function addDirectionalLightHelper() {
  // 平行光光源对象
  const light = new DirectionalLight(0xff0000, 0.3);
  // 设置平行光光源位置（同聚光光源）
  light.position.set(1, 0.25, 0);
  scene.add(light);

  // 平行光光源辅助对象
  const helper = new DirectionalLightHelper(light, 0.2);
  scene.add(helper);
}

function addHemisphereLight() {
  // 半球光对象
  // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
  const light = new HemisphereLight(0xff0000, 0x0000ff, 0.3);
  scene.add(light);

  // 半球光光源辅助对象
  const helper = new HemisphereLightHelper(light, 0.2);
  scene.add(helper);
}

function addPointLight() {
  // 点光源对象
  const light = new PointLight(0xff9000, 0.5, 10, 2);
  // 设置点光源位置（同聚光光源）
  light.position.set(1, -0.5, 1);
  scene.add(light);

  // 点光源辅助对象
  const helper = new PointLightHelper(light, 0.2);
  scene.add(helper);
}

function addRectAreaLight() {
  // 平面光光源对象
  const light = new RectAreaLight(0x4e00ff, 2, 1, 1);
  // 设置平面光光源位置（同聚光光源）
  light.position.set(-1.5, 0, 1.5);
  // 设置平面光光源方向
  light.lookAt(new Vector3());
  scene.add(light);

  // 平面光光源辅助对象
  const helper = new RectAreaLightHelper(light);
  scene.add(helper);
}

function addSpotLight() {
  // 聚光光源对象
  const light = new SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
  // 设置聚光光源位置
  // 光源对象和模型对象的 position 属性一样是 Vector3 对象
  // SpotLight 的基类是 Light，Light 的基类是 Object3D
  // 聚光光源对象继承 Object3D 对象的位置属性 position
  light.position.set(0, 2, 3);
  scene.add(light);

  // 聚光源辅助对象
  const helper = new SpotLightHelper(light);
  scene.add(helper);
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

  const elapsedTime = clock.getElapsedTime();

  const speed = elapsedTime / 5;

  sphere.position.z = Math.sin(speed);
  cube.rotation.set(speed, speed, 0);
  torus.rotation.set(speed, speed, 0);

  controls.update();
  stats.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}
