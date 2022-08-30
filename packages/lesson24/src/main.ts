import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  sRGBEncoding,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  TextureLoader,
  AmbientLight,
  RepeatWrapping,
  Texture
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import url from '@/textures/avatar.jpeg?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

let texture: Texture;

let time = 0;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 10000);
  camera.position.set(0, 0, 500);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(300);
  scene.add(axesHelper);

  // Light
  const ambient = new AmbientLight(0xffffff);
  scene.add(ambient);

  // Object
  // 创建一个平面
  const geometry = new PlaneGeometry(1000, 1000);

  // 加载纹理贴图
  texture = new TextureLoader().load(url);
  // 设置阵列
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  // uv 两个方向纹理重复数量
  // 等价 texture.repeat = new Vector2(10, 10)
  texture.repeat.set(10, 10);

  const material = new MeshLambertMaterial({
    map: texture, // 设置纹理贴图
    side: DoubleSide
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputEncoding = sRGBEncoding;

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1500;
  controls.maxDistance = 5000;
  controls.update();

  // Resize
  window.addEventListener('resize', onWindowResize);
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

  // 设置纹理偏移和旋转
  texture.offset.x -= 0.05;
  texture.rotation = Math.sin((time += 0.016));

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
