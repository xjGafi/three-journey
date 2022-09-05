import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  sRGBEncoding,
  Mesh,
  TextureLoader,
  DirectionalLight,
  SphereGeometry,
  MeshPhongMaterial
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import url1 from '@/textures/Abstract_008_basecolor.jpg?url';
import url2 from '@/textures/Abstract_008_metallic.jpg?url';
import url3 from '@/textures/Abstract_008_bump.jpg?url';
import url4 from '@/textures/Abstract_008_normal.jpg?url';
import url5 from '@/textures/Abstract_008_roughness.jpg?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  light: DirectionalLight;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 600);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(300);
  scene.add(axesHelper);

  // Light
  light = new DirectionalLight(0xffffff, 0.3);
  light.position.z = 600;
  scene.add(light);

  // Object
  addTextureBump();

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
  controls.minDistance = 100;
  controls.maxDistance = 800;
  controls.update();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addTextureBump() {
  const geometry = new SphereGeometry(80, 64, 32);
  let material: MeshPhongMaterial;
  let mesh: Mesh;

  const textureLoader = new TextureLoader();
  const texture1 = textureLoader.load(url1);
  const texture2 = textureLoader.load(url2);
  const texture3 = textureLoader.load(url3);
  const texture4 = textureLoader.load(url4);
  const texture5 = textureLoader.load(url5);

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture1,
    bumpScale: 3
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(-120, 120, 0);
  scene.add(mesh);

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture2,
    bumpScale: 3
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(120, 120, 0);
  scene.add(mesh);

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture3,
    bumpScale: 3
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(120, -120, 0);
  scene.add(mesh);

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture4,
    bumpScale: 3
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(-120, -120, 0);
  scene.add(mesh);

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture5,
    bumpScale: 3
  });
  mesh = new Mesh(geometry, material);
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

  const timer = Date.now() * 0.0016;

  light.position.x = Math.sin(timer) * 500;
  light.position.y = Math.cos(timer) * 500;

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
