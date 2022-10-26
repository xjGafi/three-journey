import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Clock,
  Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Pane } from 'tweakpane';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls;

let geometry = new BufferGeometry(),
  material = new PointsMaterial(),
  points: Points;

const PARAMS = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
};

const clock = new Clock();

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 100);
  camera.position.set(4, 4, -4);

  // Scene
  scene = new Scene();

  // Object
  geometryGenerator();
  materialGenerator();
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

  // Pane
  initPane();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function geometryGenerator() {
  const positions = new Float32Array(PARAMS.count * 3);
  const colors = new Float32Array(PARAMS.count * 3);

  const colorInside = new Color(PARAMS.insideColor);
  const colorOutside = new Color(PARAMS.outsideColor);

  for (let i = 0; i < PARAMS.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * PARAMS.radius;

    // Position
    const spinAngle = radius * PARAMS.spin;
    const branchAngle = ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2;
    const angle = branchAngle + spinAngle;

    // 一个点的坐标 (x, y, z)
    positions[i3] = Math.cos(angle) * radius + getRandom(radius); // x
    positions[i3 + 1] = getRandom(radius); // y
    positions[i3 + 2] = Math.sin(angle) * radius + getRandom(radius); // z

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / PARAMS.radius);

    // 一个点的颜色 rgb(r, g, b)
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
}

function materialGenerator() {
  material.size = PARAMS.size;
  material.transparent = true;
  material.depthWrite = false; // 防止 z-index 叠加时导致闪烁
  material.blending = AdditiveBlending; // 设置混合模式
  material.vertexColors = true; // 使用顶点着色器
}

function initPane() {
  const pane = new Pane({ title: 'Points' });
  pane
    .addInput(PARAMS, 'count', {
      max: 500000,
      min: 10000,
      step: 100
    })
    .on('change', geometryGenerator);
  pane
    .addInput(PARAMS, 'size', {
      max: 0.1,
      min: 0.001,
      step: 0.001
    })
    .on('change', materialGenerator);
  pane
    .addInput(PARAMS, 'radius', {
      max: 20,
      min: 0.01,
      step: 0.01
    })
    .on('change', geometryGenerator);
  pane
    .addInput(PARAMS, 'branches', {
      max: 10,
      min: 1,
      step: 1
    })
    .on('change', geometryGenerator);
  pane
    .addInput(PARAMS, 'spin', {
      max: 5,
      min: -5,
      step: 0.001
    })
    .on('change', geometryGenerator);
  pane
    .addInput(PARAMS, 'randomness', {
      max: 2,
      min: 0,
      step: 0.001
    })
    .on('change', geometryGenerator);
  pane
    .addInput(PARAMS, 'randomnessPower', {
      max: 10,
      min: 1,
      step: 0.001
    })
    .on('change', geometryGenerator);
  pane.addInput(PARAMS, 'insideColor').on('change', geometryGenerator);
  pane.addInput(PARAMS, 'outsideColor').on('change', geometryGenerator);
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
  points.rotation.y = elapsedTime / 10;

  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}

function getRandom(radius: number) {
  return (
    Math.pow(Math.random(), PARAMS.randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    PARAMS.randomness *
    radius
  );
}
