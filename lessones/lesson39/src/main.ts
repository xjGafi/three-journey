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

import { Pane } from 'tweakpane';

import { textureMap } from './textures';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls;

let textureLoader = new TextureLoader(),
  geometry = new BufferGeometry(),
  material = new PointsMaterial(),
  points: Points;

const PARAMS = {
  COUNT: 5000,
  RANGE: 10,
  SIZE: 0.1,
  URL: textureMap.particles1
};

const clock = new Clock();

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
  const positions = new Float32Array(PARAMS.COUNT * 3);
  const colors = new Float32Array(PARAMS.COUNT * 3);

  for (let i = 0; i < PARAMS.COUNT * 3; i++) {
    positions[i] = (Math.random() - 0.5) * PARAMS.RANGE;
    colors[i] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
}

function materialGenerator() {
  material.size = PARAMS.SIZE;
  material.transparent = true;
  const texture = textureLoader.load(PARAMS.URL);
  material.alphaMap = texture; // alpha 贴图是一张灰度纹理，用于控制整个表面的不透明度。
  // material.alphaTest = 0.01;
  // material.depthTest = false;
  material.depthWrite = false; // 防止 z-index 叠加时导致闪烁
  material.blending = AdditiveBlending; // 设置混合模式
  material.vertexColors = true; // 使用顶点着色器
}

function initPane() {
  const pane = new Pane();

  // 修改尺寸
  let folder = pane.addFolder({ title: 'Number' });
  folder
    .addInput(PARAMS, 'COUNT', {
      label: 'Count',
      max: 50000,
      min: 5000,
      step: 100
    })
    .on('change', geometryGenerator);
  folder
    .addInput(PARAMS, 'RANGE', {
      label: 'Range',
      max: 20,
      min: 10,
      step: 1
    })
    .on('change', geometryGenerator);
  folder
    .addInput(PARAMS, 'SIZE', {
      label: 'Size',
      max: 0.5,
      min: 0.1,
      step: 0.01
    })
    .on('change', materialGenerator);

  // 修改材质贴图
  folder = pane.addFolder({ title: 'Texture' });
  for (const key in textureMap) {
    if (Object.prototype.hasOwnProperty.call(textureMap, key)) {
      const url = textureMap[key];
      folder
        .addButton({
          title: key
        })
        .on('click', () => {
          PARAMS.URL = url;
          materialGenerator();
        });
    }
  }
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
  for (let i = 0; i < PARAMS.COUNT; i++) {
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