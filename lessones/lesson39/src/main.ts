import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  TextureLoader,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Clock
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import point from '@/textures/particles/1.png?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls;

let geometry: BufferGeometry, material: PointsMaterial, points: Points;

const clock = new Clock();

const COUNT = 5000;
const RANGE = 10;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 100);
  camera.position.set(0, 5, -5);

  // Scene
  scene = new Scene();

  // Object
  geometry = geometryGenerator(COUNT);
  material = materialGenerator(point, 0.1);
  points = new Points(geometry, material);
  scene.add(points);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputEncoding = sRGBEncoding;

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function geometryGenerator(count: number) {
  const geometry = new BufferGeometry();

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * RANGE;
    colors[i] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  return geometry;
}

function materialGenerator(url: string, size: number) {
  const material = new PointsMaterial();

  material.size = size;
  material.transparent = true;
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(url);
  material.alphaMap = texture; // alpha 贴图是一张灰度纹理，用于控制整个表面的不透明度。
  // material.alphaTest = 0.01;
  // material.depthTest = false;
  material.depthWrite = false; // 防止 z-index 叠加时导致闪烁
  material.blending = AdditiveBlending; // 设置混合模式
  material.vertexColors = true; // 使用顶点着色器

  return material;
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

  // 正弦波动画
  for (let i = 0; i < COUNT; i++) {
    const postionX = geometry.attributes.position.getX(i);
    geometry.attributes.position.setY(i, Math.sin(elapsedTime + postionX));
  }
  geometry.attributes.position.needsUpdate = true;

  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
