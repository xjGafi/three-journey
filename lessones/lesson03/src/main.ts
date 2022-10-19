import './style.css';
import {
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  // AxesHelper,
  // CameraHelper,
  TextureLoader,
  MeshMatcapMaterial,
  TorusGeometry,
  Clock,
  Texture
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { Pane } from 'tweakpane';

import { textureMap } from './textures';
import helvetikerRegularUrl from '@/fonts/helvetiker_regular.typeface.json?url';

let camera: OrthographicCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  controls: OrbitControls;

let cameraZoom = 5; // 三维场景显示范围控制系数，系数越大，显示的范围越大

const textureLoader = new TextureLoader();

let material: MeshMatcapMaterial, matcapTexture: Texture;

const clock = new Clock();

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Scene
  scene = new Scene();

  // Camera
  const aspectRatio = innerWidth / innerHeight; // 窗口纵横比
  // 创建相机对象
  camera = new OrthographicCamera(
    -cameraZoom * aspectRatio,
    cameraZoom * aspectRatio,
    cameraZoom,
    -cameraZoom,
    0.1,
    100
  );
  camera.position.set(0, 0, 10);

  // const cameraHelper = new CameraHelper(camera);
  // scene.add(cameraHelper);

  // Axes
  // const axesHelper = new AxesHelper(200);
  // scene.add(axesHelper);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Object
  // console.time('font');
  // 贴图
  material = new MeshMatcapMaterial();
  setMaterialMatcap(textureMap.matcaps3);
  // 字体
  const fontLoader = new FontLoader();
  fontLoader.load(helvetikerRegularUrl, (font) => {
    const textGeometry = new TextGeometry('Hello, three.js!', {
      font,
      size: 1, // 大小
      height: 0.3, // 厚度
      curveSegments: 10, // 曲线的分段数
      bevelEnabled: true, // 是否开启斜角
      bevelThickness: 0.03, // 文本上斜角的深度
      bevelSize: 0.02, // 斜角与原始文本轮廓之间的延伸距离
      bevelOffset: 0,
      bevelSegments: 10 // 斜角的分段数
    });
    textGeometry.center();
    const text = new Mesh(textGeometry, material);
    scene.add(text);
  });
  // console.timeEnd('font');
  // 甜甜圈
  const donutGeometry = new TorusGeometry(0.3, 0.2, 32, 64);
  for (let i = 0; i < 200; i++) {
    const donut = new Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 15;
    donut.position.y = (Math.random() - 0.5) * 15;
    donut.position.z = (Math.random() - 0.5) * 15;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minZoom = 0.1;
  controls.maxZoom = 10;
  controls.enableDamping = true;

  // Pane
  initPane();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function setMaterialMatcap(url: string) {
  matcapTexture = textureLoader.load(url);
  material.matcap = matcapTexture;
}

function initPane() {
  const pane = new Pane({ title: 'Material' });
  // 修改材质贴图
  for (const key in textureMap) {
    if (Object.prototype.hasOwnProperty.call(textureMap, key)) {
      const url = textureMap[key];
      pane
        .addButton({
          title: key
        })
        .on('click', () => {
          setMaterialMatcap(url);
        });
    }
  }
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;

  const aspectRatio = innerWidth / innerHeight;
  camera.left = -cameraZoom * aspectRatio;
  camera.right = cameraZoom * aspectRatio;
  camera.top = cameraZoom;
  camera.bottom = -cameraZoom;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  scene.rotation.y = -elapsedTime / 10;

  controls.update();
  stats.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}
